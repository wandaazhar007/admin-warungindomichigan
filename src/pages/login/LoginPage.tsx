import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import styles from './LoginPage.module.scss';

const LoginPage = () => {
  const [email, setEmail] = useState('wandaazhar@gmail.com');
  const [password, setPassword] = useState('123456'); // Initial dummy data
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(''); // To manage login errors

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // --- Firebase Authentication logic will go here ---
    console.log('Logging in with:', { email, password });
    // Example of setting an error:
    setError('Wrong Password');
  };

  return (
    <div className={styles.loginPage}>
      <form className={styles.loginForm} onSubmit={handleLogin}>
        <div className={styles.formHeader}>
          {/* Ignoring the logo as requested */}
          <h2>Admin Login</h2>
          <p>Please log in to your account</p>
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>

        <button type="submit" className={styles.loginButton}>
          <span>LOGIN</span>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </form>
      <footer className={styles.footer}>
        Built with ❤️ by Wanda Azhar in Michigan, USA
      </footer>
    </div>
  );
};

export default LoginPage;