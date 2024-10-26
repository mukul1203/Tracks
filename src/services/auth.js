import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
const firebaseAuth = getAuth();
export const auth = {
  userSignIn: async function (email, password) {
    if (email === "" || password === "") {
      throw new Error("Email and password are mandatory.");
    }
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      throw error;
    }
  },
  userSignOut: async function () {
    await signOut(firebaseAuth);
  },
  userSignUp: async function (name, email, password) {
    if (email === "" || password === "") {
      throw new Error("Email and password are mandatory.");
    }
    try {
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
      await updateProfile(firebaseAuth.currentUser, { displayName: name });
    } catch (error) {
      throw error;
    }
  },
  onUserAuthStateChanged: function (callback) {
    return onAuthStateChanged(firebaseAuth, callback);
  },
  currentUserId: function () {
    return firebaseAuth.currentUser.uid;
  },
  currentUserEmail: function () {
    return firebaseAuth.currentUser.email;
  },
  currentUserName: function () {
    return firebaseAuth.currentUser.displayName;
  },
};
