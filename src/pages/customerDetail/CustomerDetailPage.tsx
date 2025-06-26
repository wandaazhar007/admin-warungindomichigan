import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getOrdersByUserId } from '../../services/orderService';
import type { Order } from '../../types/order';
import type { Customer } from '../../types/customer'; // Import the Customer type
import { useDebounce } from '../../hooks/useDebounce';
import SkeletonLoader from '../../components/skeletonLoader/SkeletonLoader';
import styles from './CustomerDetailPage.module.scss';

const CustomerDetailPage = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const location = useLocation(); // Hook to access navigation state

  // Get the customer data passed from the previous page
  const customer = location.state?.customer as Customer | undefined;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [lastVisible, setLastVisible] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!customerId) {
      navigate('/customers');
      return;
    }
    setOrders([]);
    setLastVisible(null);
    setHasMore(true);
    fetchOrders(true, debouncedSearchTerm);
  }, [customerId, debouncedSearchTerm, navigate]);

  const fetchOrders = async (isInitialFetch = false, currentSearchTerm = '') => {
    if (isInitialFetch) setIsSearching(true);
    else setLoadingMore(true);

    try {
      const cursor = isInitialFetch ? null : lastVisible;
      const data = await getOrdersByUserId(customerId!, cursor, currentSearchTerm);
      setOrders(prev => isInitialFetch ? data.orders : [...prev, ...data.orders]);
      setLastVisible(data.lastVisible);
      setHasMore(!!data.lastVisible);
      setError(null);
    } catch (err) {
      setError("Failed to load order history.");
    } finally {
      setIsSearching(false);
      setLoadingMore(false);
    }
  };

  const skeletonColumns = [
    { width: '250px' }, { width: '150px' }, { width: '150px' }, { width: '100px' },
  ];

  return (
    <div className={styles.detailPage}>
      <header className={styles.header}>
        <div>
          <button onClick={() => navigate(-1)} className={styles.backButton}>&larr; Back to Customers</button>
          <h1>Order History</h1>
          {/* --- DISPLAY CUSTOMER NAME AND EMAIL --- */}
          {customer ? (
            <p className={styles.customerInfo}>
              For: <strong>{customer.displayName || 'N/A'}</strong> ({customer.email})
            </p>
          ) : (
            <p className={styles.customerInfo}>For Customer ID: {customerId}</p>
          )}
        </div>
        <div className={styles.headerActions}>
          <input
            type="text"
            placeholder="Search by Order ID..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* ... The rest of your component JSX for the table and pagination remains the same ... */}
      <div className={styles.tableContainer}>
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          {isSearching ? (
            <SkeletonLoader columns={skeletonColumns} rows={5} />
          ) : (
            <tbody>
              {orders.length > 0 ? orders.map(order => (
                <tr key={order.id}>
                  <td className={styles.orderId}>{order.id}</td>
                  <td>{new Date((order.createdAt as any)._seconds * 1000).toLocaleDateString()}</td>
                  <td><span className={`${styles.status} ${styles[order.orderStatus.toLowerCase()]}`}>{order.orderStatus}</span></td>
                  <td>${(order.totalAmount / 100).toFixed(2)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className={styles.noResults}>No orders found.</td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>
      <div className={styles.paginationContainer}>
        {!isSearching && hasMore && (
          <button onClick={() => fetchOrders(false, debouncedSearchTerm)} disabled={loadingMore} className={styles.loadMoreButton}>
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomerDetailPage;