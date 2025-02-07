// @ts-ignore: Suppress type error for firebase/app module
import { initializeApp } from "firebase/app";
// @ts-ignore: Suppress type error for firebase/analytics module
import { getAnalytics } from "firebase/analytics";

// Firebase configuration (do not modify data.json, use only for dynamic dropdowns)
const firebaseConfig = {
  apiKey: "AIzaSyBdJTbvvaAV7gTUc-n-xuFgqOTEnHTgbdI",
  authDomain: "mahalle-cursor.firebaseapp.com",
  projectId: "mahalle-cursor",
  storageBucket: "mahalle-cursor.firebasestorage.app",
  messagingSenderId: "54283411994",
  appId: "1:54283411994:web:b1fc199dc1ba60c266e7a3",
  measurementId: "G-CHLB321C6V"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics }; 