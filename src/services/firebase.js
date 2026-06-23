import { initializeApp } from "firebase/app";

import { 
  getFirestore, 
  collection, 
  doc,  
  addDoc, 
  getDocs,
  setDoc, 
  deleteDoc 
} from "firebase/firestore";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "my-movie-circle.firebaseapp.com",
  projectId: "my-movie-circle",
  storageBucket: "my-movie-circle.appspot.com",
  messagingSenderId: "509365004119",
  appId: "1:509365004119:web:cac637bcf57aaaef1c4012"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);

export { 
  db, 
  collection, 
  doc, 
  addDoc, 
  getDocs,
  setDoc,
  deleteDoc,
  auth
};