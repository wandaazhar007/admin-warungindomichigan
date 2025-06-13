import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { signIn } from '../../services/authService';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import styles from './LoginPage.module.scss';

const LoginPage = () => {
  const [email, setEmail] = useState('wandaazhar@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // This is our loading state for the form

  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuthStatus();

  useEffect(() => {
    if (!isAuthLoading && user) {
      navigate('/');
    }
  }, [user, isAuthLoading, navigate]);

  // --- THIS FUNCTION IS NOW COMPLETE ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await signIn(email, password);
      navigate('/'); // Redirect on success
    } catch (err: any) {
      console.error('Login failed:', err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading) {
    return <div>Loading...</div>;
  }
  if (user) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className={styles.loginPage}>
      <form className={styles.loginForm} onSubmit={handleLogin}>
        <div className={styles.formHeader}>
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
            disabled={isSubmitting} // CORRECTED: Use isSubmitting
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
              disabled={isSubmitting} // CORRECTED: Use isSubmitting
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting} // CORRECTED: Use isSubmitting
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>

        <button type="submit" className={styles.loginButton} disabled={isSubmitting}>
          {/* CORRECTED: Use isSubmitting */}
          <span>{isSubmitting ? 'LOGGING IN...' : 'LOGIN'}</span>
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