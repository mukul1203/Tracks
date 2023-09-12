import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';

const auth = getAuth();

export async function userSignIn(email, password) {
  if (email === '' || password === '') {
    throw new Error('Email and password are mandatory.');
  }
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw error;
  }
}

export async function userSignOut() {
  return signOut(auth);
}

export async function userSignUp(email, password) {
  if (email === '' || password === '') {
    throw new Error('Email and password are mandatory.');
  }
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw error;
  }
}

export function useAuthentication() {
  const [user, setUser] = useState();

  useEffect(() => {
    const unsubscribeFromAuthStateChanged = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUser(user);
      } else {
        // User is signed out
        setUser(undefined);
      }
    },[]);

    return unsubscribeFromAuthStateChanged;
  }, []);

  return {
    user
  };
}