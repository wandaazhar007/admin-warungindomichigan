import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faSun } from '@fortawesome/free-solid-svg-icons';
import styles from './Navbar.module.scss';

const Navbar = () => {
  const userName = "Wanda Azhar"; // We'll get this from auth state later

  return (
    <nav className={styles.navbar}>
      <div className={styles.searchBar}>
        {/* We can add a search input here later if needed */}
      </div>
      <div className={styles.userMenu}>
        <button className={styles.iconButton}>
          <FontAwesomeIcon icon={faSun} /> {/* Or faMoon for dark theme */}
        </button>
        <div className={styles.userInfo}>
          {/* User Avatar can go here */}
          <span>{userName}</span>
        </div>
        <button className={styles.iconButton}>
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;