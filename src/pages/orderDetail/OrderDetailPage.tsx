import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getOrderById, updateOrderStatus } from '../../services/orderService'; // Import updateOrderStatus
import type { Order } from '../../types/order';
import styles from './OrderDetailPage.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for the status dropdown

  useEffect(() => {
    if (!orderId) {
      navigate('/orders');
      return;
    }
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, navigate]);

  const handleStatusUpdate = async (newStatus: Order['orderStatus']) => {
    if (!order) return;
    setIsMenuOpen(false); // Close menu
    const originalStatus = order.orderStatus;
    // Optimistically update UI
    setOrder({ ...order, orderStatus: newStatus });

    try {
      await updateOrderStatus(order.id, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status.");
      // Revert UI on error
      setOrder({ ...order, orderStatus: originalStatus });
    }
  };

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p>{error}</p>;
  if (!order) return <p>Order not found.</p>;

  const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = order.shippingCost || 0;
  const total = order.totalAmount;

  return (
    <div className={styles.detailPage}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>&larr; Back to All Orders</button>
      <header className={styles.header}>
        <h1>Order Details</h1>
        <p className={styles.orderId}>ID: {order.id}</p>
      </header>

      <div className={styles.detailsGrid}>
        <div className={styles.detailCard}>
          <h3>Customer</h3>
          <p>{order.customerDetails.name}</p>
          <p>{order.customerDetails.email}</p>
          <p>{order.customerDetails.phone}</p>
          {/* --- NEW: Shipping Address --- */}
          <h4 className={styles.subheading}>Shipping Address</h4>
          <p className={styles.address}>
            {order.customerDetails.shippingAddress?.street}<br />
            {order.customerDetails.shippingAddress?.city}, {order.customerDetails.shippingAddress?.state} {order.customerDetails.shippingAddress?.zipCode}<br />
            {order.customerDetails.shippingAddress?.country}
          </p>
        </div>
        <div className={styles.detailCard}>
          <h3>Summary</h3>
          <div className={styles.summaryRow}>
            <span>Status</span>
            <span className={`${styles.status} ${styles[order.orderStatus.toLowerCase()]}`}>{order.orderStatus}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Date</span>
            <span>{new Date((order.createdAt as any)._seconds * 1000).toLocaleString()}</span>
          </div>
          {/* --- NEW: Payment Method --- */}
          <div className={styles.summaryRow}>
            <span>Payment</span>
            <span>{order.paymentMethod}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Total</span>
            <strong>${(total / 100).toFixed(2)}</strong>
          </div>
          <div className={styles.actionsContainer}>
            <button className={styles.updateStatusButton} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              Update Status <FontAwesomeIcon icon={faChevronDown} />
            </button>
            {isMenuOpen && (
              <div className={styles.actionsMenu}>
                <button onClick={() => handleStatusUpdate('Processing')}>Set to Processing</button>
                <button onClick={() => handleStatusUpdate('Shipped')}>Set to Shipped</button>
                <button onClick={() => handleStatusUpdate('Delivered')}>Set to Delivered</button>
                <button onClick={() => handleStatusUpdate('Cancelled')} className={styles.cancelOption}>Cancel Order</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.itemsCard}>
        <h3>Items to Prepare</h3>
        <ul className={styles.itemList}>
          {order.items.map((item, index) => (
            <li key={`${item.productId}-${index}`}>
              <span className={styles.itemQuantity}>{item.quantity}x</span>
              <span className={styles.itemName}>{item.name}</span>
              <span className={styles.itemPrice}>${(item.price / 100).toFixed(2)} each</span>
            </li>
          ))}
        </ul>
        {/* --- NEW: Costs section --- */}
        <div className={styles.costsSection}>
          <div className={styles.costRow}>
            <span>Subtotal</span>
            <span>${(subtotal / 100).toFixed(2)}</span>
          </div>
          <div className={styles.costRow}>
            <span>Shipping</span>
            <span>${(shipping / 100).toFixed(2)}</span>
          </div>
          <div className={`${styles.costRow} ${styles.totalRow}`}>
            <span>Total</span>
            <span>${(total / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;