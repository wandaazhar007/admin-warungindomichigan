import { Outlet } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';
import Navbar from '../layout/Navbar';
import styles from '../layout/Layout.module.scss';

const Layout = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Navbar />
        <main className={styles.pageContent}>
          {/* The Outlet renders the current page (e.g., Dashboard, Products) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;