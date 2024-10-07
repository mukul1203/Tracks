import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signOut,
} from "firebase/auth";
import { database } from "./database";
const firebaseAuth = getAuth();
export const auth = {
  userSignInWithPhoneNumber: function (phoneNumber) {
    // Initialize reCAPTCHA
    var appVerifier = new RecaptchaVerifier(
      firebaseAuth,
      "recaptcha-container",
      {
        size: "invisible", // Invisible reCAPTCHA
        callback: () => {
          // ReCAPTCHA solved, continue with phone sign-in
          // onSignInSubmit();
          console.log("ReCAPTCHA solved, continue with phone sign-in");
        },
        "expired-callback": () => {
          throw error("reCAPTCHA expired, please try again.");
        },
      }
    );

    signInWithPhoneNumber(firebaseAuth, phoneNumber)
      .then((confirmationResult) => {
        // SMS sent. Prompt the user to type the code.
        const verificationCode = window.prompt(
          "Please enter the verification code sent to your phone"
        );
        return confirmationResult.confirm(verificationCode);
      })
      .catch((error) => {
        console.error("Error during phone sign-in:", error);
      });
  },
  userSignIn: async function (email, password) {
    if (email === "" || password === "") {
      throw new Error("Email and password are mandatory.");
    }
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      //Make the user entry in db here
      await database.set(
        "/users/" + firebaseAuth.currentUser.uid + "/email",
        email
      );
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
