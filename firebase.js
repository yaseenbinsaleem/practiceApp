import { initializeApp } from "firebase/app";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDmeflmXRZNW5571lJr--hVUsnFYWxXCi8",
  authDomain: "comboapp-e9cb7.firebaseapp.com",
  projectId: "comboapp-e9cb7",
  storageBucket: "comboapp-e9cb7.appspot.com",
  messagingSenderId: "834210791466",
  appId: "1:834210791466:web:d0ce5a8cf16dded0764353",
  measurementId: "G-ZPGMDXXGV9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
};
