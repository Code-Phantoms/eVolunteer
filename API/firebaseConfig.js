import firebase from 'firebase/compat/app'
import "firebase/compat/firestore";
import 'firebase/compat/auth'
import { initializeApp } from "firebase/app"
import { initializeAuth } from "firebase/auth"
import { getReactNativePersistence } from "firebase/auth/react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

const firebaseConfig = {
  apiKey: "AIzaSyDVgRiFNlMQoGXZtGPTXeXTttutNU5pXmk",
  authDomain: "evolunteer-71011.firebaseapp.com",
  databaseURL: "https://evolunteer-71011-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "evolunteer-71011",
  storageBucket: "evolunteer-71011.appspot.com",
  messagingSenderId: "36502456450",
  appId: "1:36502456450:web:594e75053515f3347ccc9b",
  measurementId: "G-KT52BLBL7G"
};


try {
  const application = firebase.initializeApp(firebaseConfig);
  console.log('Connected with Firebase')   
} catch (err) {
if (!/already exists/.test(err.message)) {
  console.error('Firebase initialization error', err.stack)}}


const auth = firebase.auth()


export { auth }