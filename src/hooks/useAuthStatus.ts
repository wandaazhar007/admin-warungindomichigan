import { useState, useEffect } from 'react';
import { onAuthChange } from '../services/authService';
import type { User } from 'firebase/auth';

export const useAuthStatus = () => {
  const [user, setUser] = useState<User | null>(null);
  // Add a loading state to wait for the onAuthChange check to complete
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthChange returns an unsubscribe function
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { user, isLoading };
};