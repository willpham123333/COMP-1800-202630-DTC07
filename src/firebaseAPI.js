// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6_1MmWBs9FMIa7yiW_eOo746e9Qi2Eoo",
  authDomain: "comp1800-dtc07.firebaseapp.com",
  projectId: "comp1800-dtc07",
  storageBucket: "comp1800-dtc07.firebasestorage.app",
  messagingSenderId: "68189041021",
  appId: "1:68189041021:web:925b2aad53106464331c14",
  measurementId: "G-NVRRS3DD8C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };