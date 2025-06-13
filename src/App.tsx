import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/dashboard/DashboardPage';
import LoginPage from './pages/login/LoginPage';
import ProductsPage from './pages/products/ProductsPage';
import './App.css';

function App() {
  // For now, we'll simulate a logged-in state.
  // We will replace this with real Firebase Auth logic later.
  const isAuthenticated = true;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes are wrapped by the Layout component */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Layout /> : <LoginPage />
          }
        >
          {/* Default page after login is Dashboard */}
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          {/* Add other routes like "customers" and "orders" here later */}
        </Route>

      </Routes>
    </Router>
  );
}

export default App;