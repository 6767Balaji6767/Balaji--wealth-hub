import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkRTVkA8itLitasuIAXVhDHfVYJngxwTs",
  authDomain: "coach-balaji-finance.firebaseapp.com",
  projectId: "coach-balaji-finance",
  storageBucket: "coach-balaji-finance.firebasestorage.app",
  messagingSenderId: "510815318812",
  appId: "1:510815318812:web:3b87f4803716e17d9d00d9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider(); // ← add this
export const googleProvider = new GoogleAuthProvider(); // keep this
