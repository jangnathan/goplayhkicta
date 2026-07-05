// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDU3gxxeYnCT0xtFMafHk1zbvQ2ROSu9aE", // it is ok to expose
  authDomain: "goplay-hk-icta.firebaseapp.com",
  projectId: "goplay-hk-icta",
  storageBucket: "goplay-hk-icta.firebasestorage.app",
  messagingSenderId: "179158346913",
  appId: "1:179158346913:web:9f08ed9f213487ecf0d4e0",
  measurementId: "G-Z6NKJ82HC6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);