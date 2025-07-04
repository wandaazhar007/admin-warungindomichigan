import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/dashboard/DashboardPage';
import LoginPage from './pages/login/LoginPage';
import ProductsPage from './pages/products/ProductsPage';
import { useAuthStatus } from './hooks/useAuthStatus';
import { Toaster } from 'react-hot-toast';
import CustomersPage from './pages/customers/CustomersPage';
import CustomerDetailPage from './pages/customerDetail/CustomerDetailPage';
import OrdersPage from './pages/orders/OrdersPage';
import OrderDetailPage from './pages/orderDetail/OrderDetailPage';
// import './App.css';

// This component will wrap all our protected pages
const ProtectedRoutes = () => {
  const { user, isLoading } = useAuthStatus();

  // 1. While we are checking for a user, show a loading message
  if (isLoading) {
    // You can replace this with a beautiful full-page spinner later
    return <div>Loading Application...</div>;
  }

  // 2. If the check is done and there is a user, render the Layout and its child routes
  //    The <Outlet /> component is from react-router-dom and it renders the correct child route
  return user ? <Layout><Outlet /></Layout> : <Navigate to="/login" />;
};

function App() {
  return (
    <> {/* Use a fragment to wrap the Router and Toaster */}
      <Toaster // <-- ADD THE TOASTER COMPONENT
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: '#28a745',
              color: 'white',
            },
          },
          error: {
            style: {
              background: '#dc3545',
              color: 'white',
            },
          },
        }}
      />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoutes />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="customers/:customerId" element={<CustomerDetailPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:orderId" element={<OrderDetailPage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;