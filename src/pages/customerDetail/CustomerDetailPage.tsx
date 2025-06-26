import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrdersByUserId } from '../../services/orderService';
import type { Order } from '../../types/order';
import styles from './CustomerDetailPage.module.scss';

const CustomerDetailPage = () => {
  const { customerId } = useParams<{ customerId: string }>(); // Get customerId from URL
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      navigate('/customers'); // Redirect if no ID is present
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getOrdersByUserId(customerId);
        setOrders(data.orders);
        // We will add pagination state here later
      } catch (err) {
        setError("Failed to load order history.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [customerId, navigate]);

  return (
    <div className={styles.detailPage}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>&larr; Back to Customers</button>
      <h1>Order History</h1>
      <p>For Customer ID: {customerId}</p>

      <div className={styles.tableContainer}>
        {loading ? <p>Loading orders...</p> : error ? <p>{error}</p> : (
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
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
                  <td colSpan={4}>No orders found for this customer.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CustomerDetailPage;