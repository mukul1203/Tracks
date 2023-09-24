import { useEffect, useState } from "react";
import { database } from "../../services/database";
import { auth } from "../../services/auth";

export const updateUser = async ({ latitude, longitude }) => {
  //send the data to DB
  await database.update("/users/" + auth.currentUser().uid + "/", {
    latitude,
    longitude,
  });
};

export function useUsers(groupId, setErrorMsg) {
  const [allUsers, setAllUsers] = useState({});

  useEffect(() => {
    const usersPath = "users/";
    const unsubscribeAdd = database.onChildAdded(
      usersPath,
      ["groupId", "equals", groupId],
      (data) => {
        setAllUsers((currentUsers) => ({
          ...currentUsers,
          [data.key]: data.val,
        }));
      },
      (error) => setErrorMsg(error.message)
    );
    const unsubscribeChange = database.onChildChanged(
      usersPath,
      ["groupId", "equals", groupId],
      (data) => {
        setAllUsers((currentUsers) => ({
          ...currentUsers,
          [data.key]: data.val,
        }));
      },
      (error) => setErrorMsg(error.message)
    );
    const unsubscribeRemove = database.onChildRemoved(
      usersPath,
      ["groupId", "equals", groupId],
      (data) => {
        setAllUsers((currentUsers) => {
          const { [data.key]: excluded, ...rest } = currentUsers;
          return rest;
        });
      },
      (error) => setErrorMsg(error.message)
    );
    return () => {
      unsubscribeAdd();
      unsubscribeChange();
      unsubscribeRemove();
    };
  }, [groupId]);

  return [allUsers];
}
