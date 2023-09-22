import { useEffect, useState } from "react";
import { invite } from "./useInvites";
import { database } from "../../services/database";
import { auth } from "../../services/auth";
// import { firebaseKeyCodec } from "../firebaseKeyCodec";

export const createGroup = async (emails) => {
  const { key } = database.push("groups/");
  await database.set("groups/" + key, JSON.stringify(emails)); //for now just push the emails as stringified list
  // const emailsObj = emails.reduce((acc, cur)=>{
  //     acc[firebaseKeyCodec.encodeFully(cur)] = true; //firebase doesn't allow ./$[] and some control chars in key
  //     return acc;
  // },{});
  // await set(groupRef, emailsObj);
  //set the group Id for current user
  await database.set("users/" + auth.currentUser().uid + "/groupId", key);
  //Also update invitees' invites list with this group id. Invite self also.
  await invite([...emails, auth.currentUser().email], key);
};

export const exitGroup = (groupId) => {
  database.set("users/" + auth.currentUser().uid + "/groupId", null);
  //TODO: also update the groups/groupId
};

export const joinGroup = (groupId) => {
  //set the user's groupId to this groupId
  //no need to await
  database.set("users/" + auth.currentUser().uid + "/groupId", groupId);
};

export const deleteGroup = (groupId) => {
  //remove the group from user's invite list
  //remove the group from groups list
  //TODO: remove the group entry from every invite list of any user (how to?)
  //TODO: optimize by a single update call
  database.set("users/" + auth.currentUser().uid + "/invites/" + groupId, null);
  database.set("groups/" + groupId, null);
};

export function useGroup(init, setErrorMsg) {
  const [groupId, setGroupId] = useState(init);
  //observe the groupId key of current user
  useEffect(() => {
    const unsubscribe = database.onValue(
      "users/" + auth.currentUser().uid + "/groupId",
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
