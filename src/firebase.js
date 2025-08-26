// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDe4Rzf32RkpTYwyY6k8VURV38vMGQPQqg",
  authDomain: "myapp01-1d450.firebaseapp.com",
  projectId: "myapp01-1d450",
  storageBucket: "myapp01-1d450.firebasestorage.app",
  messagingSenderId: "584489650287",
  appId: "1:584489650287:web:2d7500951ca6293cd3659a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("Firebase initialized:", app);

export { db };