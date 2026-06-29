// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyArZabH7q-7olMa5BTnACb0vtf8I4ZSWEM",
  authDomain: "tomorrow-attendance.firebaseapp.com",
  projectId: "tomorrow-attendance",
  storageBucket: "tomorrow-attendance.firebasestorage.app",
  messagingSenderId: "331114891751",
  appId: "1:331114891751:web:d67c947e612246f6f8d542"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export database
export { db };
