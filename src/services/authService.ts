import {
  getAuth, // Import getAuth instead of auth
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged // User is a type, so it's a separate import
} from 'firebase/auth';
import type { User } from 'firebase/auth'; // I added this import to use User type my self
import { app } from '../config/firebase'; // Import your initialized app

// Get the auth service for your specific firebase app
export const auth = getAuth(app);

/**
 * Signs in a user with their email and password.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns A promise that resolves with the user's credential.
 */
export const signIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Signs out the current user.
 * @returns A promise that resolves when sign-out is complete.
 */
export const logOut = () => {
  return signOut(auth);
};

/**
 * Listens for changes to the user's authentication state.
 * @param callback - A function to call with the user object when the state changes.
 * @returns The unsubscribe function from Firebase.
 */
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Gets the ID token of the currently signed-in user.
 * @returns A promise that resolves with the ID token string, or null if no user is signed in.
 */
export const getIdToken = async (): Promise<string | null> => {
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    // Temporarily log the token to the console for testing
    // console.log("Your Test Auth Token:", token);
    return token;
  }
  return null;
}