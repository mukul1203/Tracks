import { equalTo, get, getDatabase, onValue, orderByChild, push, query, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

const database = getDatabase();
const auth = getAuth();

export const createGroup = async (emails) => {
    const groupRef = push(ref(database, 'groups/'));
    await set(groupRef, JSON.stringify(emails));//for now just push the emails as stringified list
    //set the group Id for current user
    await set(ref(database, 'users/'+auth.currentUser.uid+'/groupId'), groupRef.key);
    //Also update invitees' invites list with this group id
    //TODO: optimize. First fetch all users, then batch the updates using update()
    for(let i = 0; i < emails.length; i++) {
        const usersRef = query(ref(database, 'users/'),orderByChild('email'),equalTo(emails[i]));
        await get(usersRef).then((users)=>{
            const userIds = Object.keys(users.exportVal()); //There should be only one userId with given email
            if(userIds.length == 1)
                return set(ref(database, 'users/'+userIds[0]+'/invites/'+groupRef.key), true);
        });
    }
};

export const exitGroup = (groupId) => {
    const groupIdRef = ref(database, 'users/'+auth.currentUser.uid+'/groupId');
    set(groupIdRef, null);
    //TODO: also update the groups/groupId
};

export const joinGroup = (groupId) => {
    //set the user's groupId to this groupId
    //no need to await
    const groupIdRef = ref(database, 'users/'+auth.currentUser.uid+'/groupId');
    set(groupIdRef, groupId);
  };

export function useGroup(init) {
    const [groupId, setGroupId] = useState(init);
    //observe the groupId key of current user
    useEffect(()=>{
        const groupIdRef = ref(database, 'users/'+auth.currentUser.uid+'/groupId');
        const unsubscribe = onValue(groupIdRef, (snapshot)=>{
            setGroupId(snapshot.val()); //it will be null if the groupId is not present, which is fine
        });
        return unsubscribe;
    }, []);
    return [groupId];
  }