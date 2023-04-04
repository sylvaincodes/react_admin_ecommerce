// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage }  from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKILxqX-H-vo4d5BTA9UsyVianvmFm6cM",
  authDomain: "shoes-siteweb.firebaseapp.com",
  projectId: "shoes-siteweb",
  storageBucket: "shoes-siteweb.appspot.com",
  messagingSenderId: "124684926291",
  appId: "1:124684926291:web:9679de9718351128d735a6",
  measurementId: "G-DT5972F303"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app)