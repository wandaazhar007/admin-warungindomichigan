import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faSun, faMoon, faEllipsisVertical, faClose } from '@fortawesome/free-solid-svg-icons';
import styles from './Navbar.module.scss';
import { useTheme } from '../../context/ThemeContext'; // Import the useTheme hook
import { useContext } from 'react';
// import { NavbarContext } from '../../context/NavbarContext';
import { SidebarContext } from '../../context/SidebarContext';

const Navbar = () => {
  const userName = "Wanda Azhar";
  const { theme, toggleTheme } = useTheme(); // Use the hook to get theme state and toggle function

  // const navbarToggle: any = useContext(NavbarContext);
  // const activeNavbar = navbarToggle.active;
  // const triggerNavbar = navbarToggle.triggerNavbar;

  const sidebarToggle: any = useContext(SidebarContext);
  const activeSidebar = sidebarToggle.active;
  const triggerSidebar = sidebarToggle.triggerSidebar;

  return (
    <nav className={styles.navbar}>
      <div className={styles.searchBar}>
        {/* Search input can go here later */}
      </div>
      <div className={styles.userMenu}>
        <button onClick={toggleTheme} className={styles.iconButton} title="Toggle Theme">
          {/* Show a different icon based on the current theme */}
          <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
        </button>
        <div className={styles.userInfo}>
          <span>{userName}</span>
        </div>
        <button className={styles.iconButton} title="Logout">
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
        <div className={styles.toogleSidebar}>
          {/* {activeNavbar ? (
            <FontAwesomeIcon icon={faClose} onClick={triggerSidebar} />
          ) : (
            <FontAwesomeIcon icon={faEllipsisVertical} onClick={triggerSidebar} />
          )} */}

          {activeSidebar ? (
            <FontAwesomeIcon icon={faClose} onClick={triggerSidebar} />
          ) : (
            <FontAwesomeIcon icon={faEllipsisVertical} onClick={triggerSidebar} />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;