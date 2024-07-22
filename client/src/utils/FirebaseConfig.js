import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDYRA-tcEEt7XZrOk56UHF5Yx5FUntZ7fs",
  authDomain: "whatsapp-clone-1ab81.firebaseapp.com",
  projectId: "whatsapp-clone-1ab81",
  storageBucket: "whatsapp-clone-1ab81.appspot.com",
  messagingSenderId: "135039570042",
  appId: "1:135039570042:web:9391a2d29bf02cc0176bc3",
  measurementId: "G-95ZXN6PBWT",
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
