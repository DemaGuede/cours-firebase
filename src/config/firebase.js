import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPoxwqJQjs-eOfl4fUs_dPGjqY2THv0xs",
  authDomain: "cours-firebase2.firebaseapp.com",
  projectId: "cours-firebase2",
  storageBucket: "cours-firebase2.appspot.com",
  messagingSenderId: "905883602691",
  appId: "1:905883602691:web:0c86292fda2d67d9c22336",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
