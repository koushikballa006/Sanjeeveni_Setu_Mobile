// firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBktd4qBD5nmtyBVxMoUr4RryliQJQSnGg",
  authDomain: "sanjeevenisetu.firebaseapp.com",
  databaseURL:
    "https://sanjeevenisetu-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sanjeevenisetu",
  storageBucket: "sanjeevenisetu.appspot.com",
  messagingSenderId: "506843184775",
  appId: "1:506843184775:web:4dfbb4f0b8c667f48f0222",
  measurementId: "G-903PJFCT98",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const database = getDatabase(app);

export { auth, database };
