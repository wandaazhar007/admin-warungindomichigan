// Based on the Order model we designed for the backend
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  // ... and other address fields
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  customerDetails: CustomerDetails;
  subtotal: number;
  totalAmount: number;
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Unpaid' | 'Paid' | 'Failed';
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  } | Date; // Handle both Firestore timestamp and Date object
}