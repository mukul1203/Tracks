import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
const firebaseAuth = getAuth();
export const auth = {
  userSignIn: async function (email: any, password: any) {
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
  userSignUp: async function (email: any, password: any) {
    if (email === "" || password === "") {
      throw new Error("Email and password are mandatory.");
    }
    try {
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      throw error;
    }
  },
  onUserAuthStateChanged: function (callback: any) {
    return onAuthStateChanged(firebaseAuth, callback);
  },
  currentUserId: function () {
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    return firebaseAuth.currentUser.uid;
  },
  currentUserEmail: function () {
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    return firebaseAuth.currentUser.email;
  },
};
