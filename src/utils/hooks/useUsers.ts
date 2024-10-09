import { useEffect, useState } from "react";
import { database } from "../../services/database";
import { USER_ACTIVE_GROUP, USERS } from "../data/paths";

export function useUsers(groupId: any, setErrorMsg: any) {
  const [allUsers, setAllUsers] = useState({});

  useEffect(() => {
    const unsubscribeAdd = database.onChildAdded(
      USERS,
      [USER_ACTIVE_GROUP.substring(1), "equals", groupId],
      (data: any) => {
        setAllUsers((currentUsers) => ({
          ...currentUsers,
          [data.key]: data.val,
        }));
      },
      (error: any) => setErrorMsg(error.message)
    );
    const unsubscribeChange = database.onChildChanged(
      USERS,
      [USER_ACTIVE_GROUP.substring(1), "equals", groupId],
      (data: any) => {
        setAllUsers((currentUsers) => ({
          ...currentUsers,
          [data.key]: data.val,
        }));
      },
      (error: any) => setErrorMsg(error.message)
    );
    const unsubscribeRemove = database.onChildRemoved(
      USERS,
      [USER_ACTIVE_GROUP.substring(1), "equals", groupId],
      (data: any) => {
        setAllUsers((currentUsers) => {
          // @ts-expect-error TS(2538): Type 'any' cannot be used as an index type.
          const { [data.key]: excluded, ...rest } = currentUsers;
          return rest;
        });
      },
      (error: any) => setErrorMsg(error.message)
    );
    return () => {
      unsubscribeAdd();
      unsubscribeChange();
      unsubscribeRemove();
    };
  }, [groupId]);

  return [allUsers];
}
