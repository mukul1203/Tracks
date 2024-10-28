import { useEffect, useState } from "react";
import { database } from "../../services/database";
import { USER_ACTIVE_GROUP, USERS } from "../data/paths";

// returns an OBJECT (not array) of users in the group
export function useUsers(groupId, setErrorMsg) {
  const [allUsers, setAllUsers] = useState({});
  // console.log(JSON.stringify(allUsers));
  useEffect(() => {
    const unsubscribeAdd = database.onChildAdded(
      USERS,
      [USER_ACTIVE_GROUP.substring(1), "equals", groupId],
      (data) => {
        setAllUsers((currentUsers) => ({
          ...currentUsers,
          [data.key]: data.val,
        }));
      },
      (error) => setErrorMsg(error.message)
    );
    const unsubscribeChange = database.onChildChanged(
      USERS,
      [USER_ACTIVE_GROUP.substring(1), "equals", groupId],
      (data) => {
        setAllUsers((currentUsers) => ({
          ...currentUsers,
          [data.key]: data.val,
        }));
      },
      (error) => setErrorMsg(error.message)
    );
    const unsubscribeRemove = database.onChildRemoved(
      USERS,
      [USER_ACTIVE_GROUP.substring(1), "equals", groupId],
      (data) => {
        setAllUsers((currentUsers) => {
          const { [data.key]: excluded, ...rest } = currentUsers;
          return rest;
        });
      },
      (error) => setErrorMsg(error.message)
    );
    return () => {
      // clear all users of existing group on effect resynchronization
      setAllUsers({});
      // unsubscribe all
      unsubscribeAdd();
      unsubscribeChange();
      unsubscribeRemove();
    };
  }, [groupId]);

  return [allUsers];
}
