import { useState, useEffect } from 'react';
import { getCustomers } from '../../services/customerService';
import type { Customer } from '../../types/customer';
import { useDebounce } from '../../hooks/useDebounce';
import Avatar from '../../components/avatar/Avatar';
import SkeletonLoader from '../../components/skeletonLoader/SkeletonLoader'; // Import skeleton loader
import styles from './CustomersPage.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState<boolean>(false); // State for search loading
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const navigate = useNavigate();


  useEffect(() => {
    setCustomers([]);
    setNextPageToken(null);
    setHasMore(true);
    fetchCustomers(true, debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const fetchCustomers = async (isInitialFetch = false, currentSearchTerm = '') => {
    if (isInitialFetch) setIsSearching(true);
    else setLoadingMore(true);

    try {
      const pageToken = isInitialFetch ? null : nextPageToken;
      const data = await getCustomers(currentSearchTerm, pageToken);
      setCustomers(prev => isInitialFetch ? data.customers : [...prev, ...data.customers]);
      setNextPageToken(data.nextPageToken);
      setHasMore(!!data.nextPageToken);
      setError(null);
    } catch (err) {
      setError("Failed to load customers.");
    } finally {
      setIsSearching(false);
      setLoadingMore(false);
    }
  };

  const handleViewHistory = (customer: Customer) => {
    // Navigate to the detail page AND pass the customer object in the state
    navigate(`/customers/${customer.uid}`, { state: { customer } });
  };

  // Define the column configuration for the customer table skeleton
  const skeletonColumns = [
    { width: '250px' },
    { width: '250px' },
    { width: '150px' },
    { width: '100px' },
  ];

  return (
    <div className={styles.customersPage}>
      <header className={styles.header}>
        <h1>Customers</h1>
        <div className={styles.headerActions}>
          <input
            type="text"
            placeholder="Search by name or email..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>
      <div className={styles.tableContainer}>
        <table className={styles.customersTable}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Joined Date</th>
              <th>Action</th>
            </tr>
          </thead>
          {isSearching ? (
            <SkeletonLoader columns={skeletonColumns} rows={10} />
          ) : (
            <tbody>
              {customers.length > 0 ? customers.map(customer => (
                <tr key={customer.uid}>
                  <td>
                    <div className={styles.customerCell}>
                      <Avatar src={customer.photoURL} name={customer.displayName} />
                      <span>{customer.displayName || 'No Name Provided'}</span>
                    </div>
                  </td>
                  <td>{customer.email}</td>
                  <td>{new Date(customer.creationTime).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleViewHistory(customer)} className={styles.viewButton} title="View History">
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className={styles.noResults}>No customers found.</td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>
      <div className={styles.paginationContainer}>
        {!isSearching && hasMore && (
          <button onClick={() => fetchCustomers(false, debouncedSearchTerm)} disabled={loadingMore} className={styles.loadMoreButton}>
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        )}
        {!isSearching && !hasMore && customers.length > 0 && (
          <p className={styles.endOfListText}>You've reached the end of the list.</p>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;