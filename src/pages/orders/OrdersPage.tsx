import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import type { Order } from '../../types/order';
import { useDebounce } from '../../hooks/useDebounce';
import SkeletonLoader from '../../components//skeletonLoader/SkeletonLoader';
import styles from './OrdersPage.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for search and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [lastVisible, setLastVisible] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // State to manage which action menu is open
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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

  const handleStatusUpdate = async (orderId: string, newStatus: Order['orderStatus']) => {
    const originalOrders = [...orders];
    // Optimistically update the UI for a faster user experience
    setOrders(prevOrders => prevOrders.map(order =>
      order.id === orderId ? { ...order, orderStatus: newStatus } : order
    ));
    setOpenMenuId(null); // Close the menu

    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order #${orderId.substring(0, 4)}... updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status. Reverting changes.");
      // If the API call fails, revert the UI back to its original state
      setOrders(originalOrders);
    }
  };

  const skeletonColumns = [
    { width: '150px' }, { width: '200px' }, { width: '120px' },
    { width: '120px' }, { width: '100px' }, { width: '50px' }
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
              <th>Actions</th>
            </tr>
          </thead>
          {isSearching ? (
            <SkeletonLoader columns={skeletonColumns} rows={10} />
          ) : (
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td className={styles.orderId}>{order.id.substring(0, 8)}...</td>
                  <td>{order.customerDetails.name}</td>
                  <td>{new Date((order.createdAt as any)._seconds * 1000).toLocaleDateString()}</td>
                  <td><span className={`${styles.status} ${styles[order.orderStatus.toLowerCase()]}`}>{order.orderStatus}</span></td>
                  <td>${(order.totalAmount / 100).toFixed(2)}</td>
                  <td className={styles.actionsCell}>
                    <button onClick={() => setOpenMenuId(openMenuId === order.id ? null : order.id)}>
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                    {openMenuId === order.id && (
                      <div className={styles.actionsMenu}>
                        <button onClick={() => handleStatusUpdate(order.id, 'Processing')}>Set to Processing</button>
                        <button onClick={() => handleStatusUpdate(order.id, 'Shipped')}>Set to Shipped</button>
                        <button onClick={() => handleStatusUpdate(order.id, 'Delivered')}>Set to Delivered</button>
                        <button onClick={() => handleStatusUpdate(order.id, 'Cancelled')} className={styles.cancelOption}>Cancel Order</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
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

export default OrdersPage;


