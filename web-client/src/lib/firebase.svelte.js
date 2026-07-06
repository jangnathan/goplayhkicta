// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { writable } from "svelte/store";
import { browser } from "$app/env";

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

class AuthManager {
  user = $state(undefined); // undefined = loading, null = logged out

  get isLoggedIn() { return !!this.user; }
  get isChecking() { return this.user === undefined; }

  constructor() {
    if (browser) {
      if (auth) {
        onAuthStateChanged(auth, (firebaseUser) => {
          this.user = firebaseUser;
        });
      }
    }
  }

  async logout() {
    const authInstance = getMyAuth();
    if (authInstance) {
      await signOut(authInstance);
      window.location.href = "/login";
    }
  }
}

// Export a single instantiated structural manager
export const authState = new AuthManager();