// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage }  from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATx6l-olzP4tbF5Z1bWE-H0XTiBPdsiH4",
  authDomain: "sunrise-acbb6.firebaseapp.com",
  projectId: "sunrise-acbb6",
  storageBucket: "sunrise-acbb6.appspot.com",
  messagingSenderId: "721756922297",
  appId: "1:721756922297:web:ca5e29b6e8dc36c0601668",
  measurementId: "G-9XQ2C86YST"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app)