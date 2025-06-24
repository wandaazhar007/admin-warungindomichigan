import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import styles from './Navbar.module.scss';
import { useTheme } from '../../context/ThemeContext';
import { logOut } from '../../services/authService'; // Import the logOut function

const Navbar = () => {
  const navigate = useNavigate(); // Hook for navigation
  const { theme, toggleTheme } = useTheme();

  // We'll get the user's name from the auth state later
  const userName = "Wanda Azhar";

  // Function to handle the logout process
  const handleLogout = async () => {
    try {
      await logOut();
      // Redirect to login page after successful logout
      navigate('/login');
      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Failed to log out:", error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.searchBar}>
        {/* Search input can go here later */}
      </div>
      <div className={styles.userMenu}>
        <button onClick={toggleTheme} className={styles.iconButton} title="Toggle Theme">
          <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
        </button>
        <div className={styles.userInfo}>
          <span>{userName}</span>
        </div>
        {/* Attach the handleLogout function to the button's onClick event */}
        <button onClick={handleLogout} className={styles.iconButton} title="Logout">
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
