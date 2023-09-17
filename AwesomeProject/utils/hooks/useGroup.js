import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { invite } from "./useInvites";
// import { firebaseKeyCodec } from "../firebaseKeyCodec";

const database = getDatabase();
const auth = getAuth();

export const createGroup = async (emails) => {
  const groupRef = push(ref(database, "groups/"));
  // const emailsObj = emails.reduce((acc, cur)=>{
  //     acc[firebaseKeyCodec.encodeFully(cur)] = true; //firebase doesn't allow ./$[] and some control chars in key
  //     return acc;
  // },{});
  // await set(groupRef, emailsObj);
  await set(groupRef, JSON.stringify(emails)); //for now just push the emails as stringified list
  //set the group Id for current user
  await set(
    ref(database, "users/" + auth.currentUser.uid + "/groupId"),
    groupRef.key
  );
  //Also update invitees' invites list with this group id. Invite self also.
  await invite([...emails, auth.currentUser.email], groupRef.key);
};

export const exitGroup = (groupId) => {
  const groupIdRef = ref(
    database,
    "users/" + auth.currentUser.uid + "/groupId"
  );
  set(groupIdRef, null);
  //TODO: also update the groups/groupId
};

export const joinGroup = (groupId) => {
  //set the user's groupId to this groupId
  //no need to await
  const groupIdRef = ref(
    database,
    "users/" + auth.currentUser.uid + "/groupId"
  );
  set(groupIdRef, groupId);
};

export const deleteGroup = (groupId) => {
  //remove the group from user's invite list
  //remove the group from groups list
  //TODO: remove the group entry from every invite list of any user (how to?)
  //TODO: optimize by a single update call
  const inviteEntryRef = ref(
    database,
    "users/" + auth.currentUser.uid + "/invites/" + groupId
  );
  set(inviteEntryRef, null);
  const groupEntryRef = ref(database, "groups/" + groupId);
  set(groupEntryRef, null);
};

export function useGroup(init) {
  const [groupId, setGroupId] = useState(init);
  //observe the groupId key of current user
  useEffect(() => {
    const groupIdRef = ref(
      database,
      "users/" + auth.currentUser.uid + "/groupId"
    );
    const unsubscribe = onValue(groupIdRef, (snapshot) => {
      setGroupId(snapshot.val()); //it will be null if the groupId is not present, which is fine
    });
    return unsubscribe;
  }, []);
  return [groupId];
}
