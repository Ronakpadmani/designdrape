// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3x-YfU49GEaUOJfwNkdHMIsauWa0EsJU",
  authDomain: "designdrape-94c39.firebaseapp.com",
  projectId: "designdrape-94c39",
  storageBucket: "designdrape-94c39.firebasestorage.app",
  messagingSenderId: "809673675247",
  appId: "1:809673675247:web:4290c36ec3319515e5661a",
  measurementId: "G-EZXMZXHYRH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

// Secondary app — create customer accounts without signing out admin
const secondaryApp = initializeApp(firebaseConfig, "Secondary");

export const auth = getAuth(app);
export const secondaryAuth = getAuth(secondaryApp);
export const db = getFirestore(app);
export const storage = getStorage(app);