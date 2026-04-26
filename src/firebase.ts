// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCApOoLyz05AYTdmiLrmZkGIk0_P645W-8",
  authDomain: "mural-project-78363.firebaseapp.com",
  databaseURL: "https://mural-project-78363-default-rtdb.firebaseio.com",
  projectId: "mural-project-78363",
  storageBucket: "mural-project-78363.firebasestorage.app",
  messagingSenderId: "121627058335",
  appId: "1:121627058335:web:453d22f1f259ea509302aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
