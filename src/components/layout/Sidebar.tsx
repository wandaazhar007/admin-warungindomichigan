import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faBoxOpen, faUsers, faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import styles from './Sidebar.module.scss';
import { useContext } from 'react';
import { SidebarContext } from '../../context/SidebarContext';

const Sidebar = () => {
  const sidebarToggle: any = useContext(SidebarContext);
  const handleSidebar = () => {
    sidebarToggle.triggerSidebar();
  }
  const active = sidebarToggle.active;

  return (
    <aside className={`${styles.sidebar} ${active ? 'on' : ''}`}>
      {/* Sidebar logo or title */}
      <div className={styles.logo}>
        {/* You can place your logo SVG or image here */}
        <span>Admin Panel</span>
      </div>
      <nav className={styles.navigation}>
        <p className={styles.navSectionTitle}>MAIN</p>
        <NavLink to="/" className={({ isActive }) => isActive ? styles.activeLink : ''}>
          <FontAwesomeIcon icon={faTachometerAlt} />
          <span>Dashboard</span>
        </NavLink>

        <p className={styles.navSectionTitle}>DATA</p>
        <NavLink to="/products" className={({ isActive }) => isActive ? styles.activeLink : ''}>
          <FontAwesomeIcon icon={faBoxOpen} />
          <span>Products</span>
        </NavLink>
        <NavLink to="/customers" className={({ isActive }) => isActive ? styles.activeLink : ''}>
          <FontAwesomeIcon icon={faUsers} />
          <span>Customers</span>
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => isActive ? styles.activeLink : ''}>
          <FontAwesomeIcon icon={faFileInvoice} />
          <span>Orders</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;