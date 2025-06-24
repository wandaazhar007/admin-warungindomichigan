// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBELpkeqzHP7kywkNLo5J5c4FLsBQsFOu8",
  authDomain: "warungindomichigan.firebaseapp.com",
  projectId: "warungindomichigan",
  storageBucket: "warungindomichigan.firebasestorage.app",
  messagingSenderId: "613823784860",
  appId: "1:613823784860:web:3921b7963b25d09fc0ca59",
  measurementId: "G-EJ8QEKJZRB"
};

// Initialize Firebase and EXPORT the app instance
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const storage = getStorage(app);