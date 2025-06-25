import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faSun, faMoon, faKey } from '@fortawesome/free-solid-svg-icons';
import styles from './Navbar.module.scss';
import { useTheme } from '../../context/ThemeContext';
import { logOut, getIdToken } from '../../services/authService'; // Import the logOut function

const Navbar = () => {
  const navigate = useNavigate(); // Hook for navigation
  const { theme, toggleTheme } = useTheme();

  // We'll get the user's name from the auth state later
  const userName = "Wanda Azhar";

  // --- NEW FUNCTION TO GET AND LOG THE TOKEN ---
  const handleGetToken = async () => {
    try {
      const token = await getIdToken();
      if (token) {
        // This will now definitely show up in your console
        console.log("--- Your Test Auth Token (copy this) ---");
        console.log(token);
        alert("Token has been printed to the browser console.");
      } else {
        alert("Could not get token. Are you logged in?");
      }
    } catch (error) {
      console.error("Error getting token:", error);
      alert("An error occurred while getting the token. Check the console.");
    }
  };


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

        {/* --- TEMPORARY TOKEN BUTTON --- */}
        <button onClick={handleGetToken} className={styles.iconButton} title="Get Test Token">
          <FontAwesomeIcon icon={faKey} />
        </button>


        {/* Attach the handleLogout function to the button's onClick event */}
        <button onClick={handleLogout} className={styles.iconButton} title="Logout">
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
