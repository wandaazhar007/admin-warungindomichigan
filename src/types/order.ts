// Define the shape of the shipping address object
export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Add the optional shippingAddress to the CustomerDetails
export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  shippingAddress?: ShippingAddress; // <-- ADD THIS LINE
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

// Add the new fields to the main Order interface
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  customerDetails: CustomerDetails;
  subtotal: number;
  shippingCost?: number; // <-- ADD THIS LINE
  totalAmount: number;
  paymentMethod?: string; // <-- ADD THIS LINE
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Unpaid' | 'Paid' | 'Failed';
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  } | Date;
}