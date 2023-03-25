import firebase from 'firebase/compat/app'
import "firebase/compat/firestore";
import 'firebase/compat/auth'
import { initializeApp } from "firebase/app"
import { initializeAuth } from "firebase/auth"
import { getReactNativePersistence } from "firebase/auth/react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

const firebaseConfig = {
  apiKey: "---",
  authDomain: "---",
  databaseURL: "---",
  projectId: "---",
  storageBucket: "---",
  messagingSenderId: "---",
  appId: "---",
  measurementId: "---"
};


try {
  const application = firebase.initializeApp(firebaseConfig);
  console.log('Connected with Firebase')   
} catch (err) {
if (!/already exists/.test(err.message)) {
  console.error('Firebase initialization error', err.stack)}}


const auth = firebase.auth()


export { auth }
