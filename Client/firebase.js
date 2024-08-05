import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-01-c374c.firebaseapp.com",
  projectId: "blog-01-c374c",
  storageBucket: "blog-01-c374c.appspot.com",
  messagingSenderId: "322803463533",
  appId: "1:322803463533:web:413f753a5c19f6e53a5664",
};

const app = initializeApp(firebaseConfig);

export { app };
