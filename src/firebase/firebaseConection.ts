import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDG6vkkpwlY2hOu51gowRkKdprfjvjzazc",
  authDomain: "tech-space-9208b.firebaseapp.com",
  projectId: "tech-space-9208b",
  storageBucket: "tech-space-9208b.firebasestorage.app",
  messagingSenderId: "389043318547",
  appId: "1:389043318547:web:30872bcb6713ca1438f4e6",
  measurementId: "G-MK088H9YJB"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, auth, storage };