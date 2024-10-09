import { useEffect, useState } from "react";
import { auth } from "../../services/auth";

export function useAuthentication(setErrorMsg: any) {
  const [user, setUser] = useState();

  useEffect(() => {
    const unsubscribeFromAuthStateChanged = auth.onUserAuthStateChanged(
      (user: any) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          setUser(user);
        } else {
          // User is signed out
          setUser(undefined);
        }
      },
      // @ts-expect-error TS(2554): Expected 1 arguments, but got 2.
      []
    );
    return unsubscribeFromAuthStateChanged;
  }, []);

  return {
    user,
  };
}
