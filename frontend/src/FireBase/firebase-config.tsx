import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from '@firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDvAtHv59Ls2Fdn9rEMtXJ8_8QXW-bA-4c",
  authDomain: "genius-memory-game.firebaseapp.com",
  projectId: "genius-memory-game",
  storageBucket: "genius-memory-game.firebasestorage.app",
  messagingSenderId: "975039392638",
  appId: "1:975039392638:web:dc809ef3e58186b135e12f",
  measurementId: "G-E3MV49BG8V"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app)