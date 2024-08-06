// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAO4BKzgmnuEF7EGMiRiN-_WqdcjZXUX3A",
  authDomain: "inventory-management-app-ef7a7.firebaseapp.com",
  projectId: "inventory-management-app-ef7a7",
  storageBucket: "inventory-management-app-ef7a7.appspot.com",
  messagingSenderId: "462122602600",
  appId: "1:462122602600:web:a767902f5f2ffb649cabdd",
  measurementId: "G-3SY4RT3B03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}