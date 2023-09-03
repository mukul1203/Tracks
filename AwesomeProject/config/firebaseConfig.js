// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import Constants from 'expo-constants';
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: Constants.manifest2?.extra?.firebaseApiKey,
    authDomain: Constants.manifest2?.extra?.firebaseAuthDomain,
    projectId: Constants.manifest2?.extra?.firebaseProjectId,
    storageBucket: Constants.manifest2?.extra?.firebaseStorageBucket,
    messagingSenderId: Constants.manifest2?.extra?.firebaseMessagingSenderId,
    appId: Constants.manifest2?.extra?.firebaseAppId,
    measurementId: Constants.manifest2?.extra?.measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);