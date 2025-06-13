import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import styles from './Navbar.module.scss';
import { useTheme } from '../../context/ThemeContext'; // Import the useTheme hook

const Navbar = () => {
  const userName = "Wanda Azhar";
  const { theme, toggleTheme } = useTheme(); // Use the hook to get theme state and toggle function

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
      </div>
    </nav>
  );
};

export default Navbar;