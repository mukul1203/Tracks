import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { database } from "./database";
const firebaseAuth = getAuth();
export const auth = {
  userSignIn: async function (email, password) {
    if (email === "" || password === "") {
      throw new Error("Email and password are mandatory.");
    }
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      //Make the user entry in db here
      await database.set("/users/" + auth.currentUser.uid + "/email", email);
    } catch (error) {
      throw error;
    }
  },
  userSignOut: async function () {
    return signOut(firebaseAuth);
  },
  userSignUp: async function (email, password) {
    if (email === "" || password === "") {
      throw new Error("Email and password are mandatory.");
    }
    try {
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      throw error;
    }
  },
  onUserAuthStateChanged: function (callback) {
    return onAuthStateChanged(firebaseAuth, callback);
  },
  currentUser: function () {
    return firebaseAuth.currentUser;
  },
};
