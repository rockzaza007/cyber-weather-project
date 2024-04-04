// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
const authDomain = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN;
const databaseURL = process.env.REACT_APP_FIREBASE_DATABASE_URL;
const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
const storageBucket = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.REACT_APP_FIREBASE_APP_ID;
const measurementId = process.env.REACT_APP_FIREBASE_MEASUREMENT_ID;


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDABvJWIrDS4SFSL2uXkDyzneYG3epL5Jw",
    authDomain: "web-tech-app-2a197.firebaseapp.com",
    databaseURL: "https://web-tech-app-2a197-default-rtdb.firebaseio.com",
    projectId: "web-tech-app-2a197",
    storageBucket: "web-tech-app-2a197.appspot.com",
    messagingSenderId: "183938536891",
    appId: "1:183938536891:web:938bfb6c6fc2ad713a609e",
    measurementId: "G-KF7DD69YXK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const db = getFirestore(app);
export default auth;