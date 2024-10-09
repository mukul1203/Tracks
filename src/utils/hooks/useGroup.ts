import { useEffect, useState } from "react";
import { database } from "../../services/database";
import { auth } from "../../services/auth";
import { USER_ACTIVE_GROUP, USERS } from "../data/paths";

export function useGroup(init, setErrorMsg) {
  const [groupId, setGroupId] = useState(init);
  //observe the groupId key of current user
  useEffect(() => {
    const unsubscribe = database.onValue(
      USERS + "/" + auth.currentUserId() + USER_ACTIVE_GROUP,
      (val) => {
        setGroupId(val); //it will be null if the groupId is not present, which is fine
      },
      (error) => {
        setErrorMsg(error.message);
      }
    );
    return unsubscribe;
  }, []);
  return [groupId];
}
