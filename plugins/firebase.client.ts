import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

let storageRef:any
export default defineNuxtPlugin(async nuxtApp => {
    console.log("Pasa :D")
    const config = useRuntimeConfig()
    initializeApp(config.public.firebaseConfig)
    firebase.initializeApp(config.public.firebaseConfig)
    storageRef = firebase.storage().ref();
})

export {
    storageRef
}