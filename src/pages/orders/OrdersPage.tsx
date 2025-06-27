import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link
import { getAllOrders } from '../../services/orderService';
import type { Order } from '../../types/order';
import { useDebounce } from '../../hooks/useDebounce';
import SkeletonLoader from '../../components/skeletonLoader/SkeletonLoader';
import styles from './OrdersPage.module.scss';

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [lastVisible, setLastVisible] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setOrders([]);
    setLastVisible(null);
    setHasMore(true);
    fetchOrders(true, debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const fetchOrders = async (isInitialFetch = false, currentSearchTerm = '') => {
    if (isInitialFetch) setIsSearching(true);
    else setLoadingMore(true);
    try {
      const cursor = isInitialFetch ? null : lastVisible;
      const data = await getAllOrders(cursor, currentSearchTerm);
      setOrders(prev => isInitialFetch ? data.orders : [...prev, ...data.orders]);
      setLastVisible(data.lastVisible);
      setHasMore(!!data.lastVisible);
    } catch (err) {
      setError("Failed to load orders.");
    } finally {
      setIsSearching(false);
      setLoadingMore(false);
    }
  };

  const handleRowClick = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  const skeletonColumns = [
    { width: '150px' }, { width: '200px' }, { width: '120px' },
    { width: '120px' }, { width: '100px' },
  ];

  return (
    <div className={styles.ordersPage}>
      <header className={styles.header}>
        <h1>All Orders</h1>
        <div className={styles.headerActions}>
          <input
            type="text"
            placeholder="Search by customer name/email..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>
      <div className={styles.tableContainer}>
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          {isSearching ? (
            <SkeletonLoader columns={skeletonColumns} rows={10} />
          ) : (
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className={styles.clickableRow} onClick={() => handleRowClick(order.id)}>
                  <td className={styles.orderId}>{order.id.substring(0, 8)}...</td>
                  <td>{order.customerDetails.name}</td>
                  <td>{new Date((order.createdAt as any)._seconds * 1000).toLocaleDateString()}</td>
                  <td><span className={`${styles.status} ${styles[order.orderStatus.toLowerCase()]}`}>{order.orderStatus}</span></td>
                  <td>${(order.totalAmount / 100).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <div className={styles.paginationContainer}>
        {/* Pagination logic remains the same */}
      </div>
    </div>
  );
};

export default OrdersPage;