import { useEffect, useState } from "react";
import { auth } from "../../services/auth";

export function useAuthentication(setErrorMsg) {
  const [user, setUser] = useState();

  useEffect(() => {
    const unsubscribeFromAuthStateChanged = auth.onUserAuthStateChanged(
      (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          setUser(user);
        } else {
          // User is signed out
          setUser(undefined);
        }
      },
      []
    );
    return unsubscribeFromAuthStateChanged;
  }, []);

  return {
    user,
  };
}
