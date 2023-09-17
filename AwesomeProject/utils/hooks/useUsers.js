import { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  update,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  query,
  orderByChild,
  equalTo,
  set,
} from "firebase/database";
import { getAuth } from "firebase/auth";

const database = getDatabase();
const auth = getAuth();

export const updateUser = async ({ latitude, longitude }) => {
  //send the data to DB
  const updates = { latitude, longitude };
  await update(ref(database, "/users/" + auth.currentUser.uid + "/"), updates);
};

export function useUsers(groupId) {
  const [allUsers, setAllUsers] = useState({});

  useEffect(() => {
    const usersRef = query(
      ref(database, "users/"),
      orderByChild("groupId"),
      equalTo(groupId)
    );
    const unsubscribeAdd = onChildAdded(usersRef, (data) => {
      setAllUsers((currentUsers) => ({
        ...currentUsers,
        [data.key]: data.exportVal(),
      }));
    });
    const unsubscribeChange = onChildChanged(usersRef, (data) => {
      setAllUsers((currentUsers) => ({
        ...currentUsers,
        [data.key]: data.exportVal(),
      }));
    });
    const unsubscribeRemove = onChildRemoved(usersRef, (data) => {
      setAllUsers((currentUsers) => {
        const { [data.key]: excluded, ...rest } = currentUsers;
        return rest;
      });
    });
    return () => {
      unsubscribeAdd();
      unsubscribeChange();
      unsubscribeRemove();
    };
  }, [groupId]);

  return [allUsers];
}
