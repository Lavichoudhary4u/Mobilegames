import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVrWdDPYPDbFu9D2rOudu7keDbNpC8um0",
  authDomain: "react-login-80062.firebaseapp.com",
  projectId: "react-login-80062",
  storageBucket: "react-login-80062.firebasestorage.app",
  messagingSenderId: "839212018560",
  appId: "1:839212018560:web:e5186df9189fdd1dbd6f65",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
