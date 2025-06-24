import type { ReactNode } from 'react'; // Import ReactNode for typing children
import Sidebar from '../layout/Sidebar';
import Navbar from '../layout/Navbar';
import styles from '../layout/Layout.module.scss';

// Define the props that the Layout component will accept
interface LayoutProps {
  children: ReactNode; // 'children' will be the page content (e.g., Dashboard, Products)
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Navbar />
        <main className={styles.pageContent}>
          {/* Render the children that are passed into the Layout component */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;