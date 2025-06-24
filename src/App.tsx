import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/dashboard/DashboardPage';
import LoginPage from './pages/login/LoginPage';
import ProductsPage from './pages/products/ProductsPage';
import { useAuthStatus } from './hooks/useAuthStatus';
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
    <Router>
      <Routes>
        {/* The Login Page is a public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* All other routes are children of our new ProtectedRoutes component */}
        <Route path="/" element={<ProtectedRoutes />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          {/* Add future protected routes (e.g., customers, orders) here */}
        </Route>

      </Routes>
    </Router>
  );
}

export default App;