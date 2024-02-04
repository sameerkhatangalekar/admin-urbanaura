
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBppJ8lS0aKknBDVJFGPvbLOszIz8tD6ss",
  authDomain: "portfolio-7177e.firebaseapp.com",
  projectId: "portfolio-7177e",
  storageBucket: "portfolio-7177e.appspot.com",
  messagingSenderId: "115150151237",
  appId: "1:115150151237:web:59178c9bc278e50e7ecd2c"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);
