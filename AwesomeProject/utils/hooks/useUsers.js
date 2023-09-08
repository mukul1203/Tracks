import { useEffect, useState } from "react";
import { getDatabase, ref, set, onChildAdded, onChildChanged, onChildRemoved, query, orderByChild, equalTo, push } from "firebase/database";
import { getAuth } from "firebase/auth";

const database = getDatabase();
const auth = getAuth();
export function useUsers(init) {
    
    const [allUsers, setAllUsers] = useState(init);
    const [groupId, setGroupId] = useState("hellow!");

    const updateUser = async ({latitude, longitude})=>{
        if(false)//if this is a new entry
        {   
            const groupRef = push(ref(database, 'groups/'));
            const groupId = groupRef.key;
            setGroupId(groupId);
            await set(groupRef, true);
        }
        //send the data to DB
        await set(ref(database, 'users/' + auth.currentUser.uid), {latitude, longitude, email:auth.currentUser.email, groupId});
    };

    useEffect(() => {
        const usersRef = ref(database, 'users/');//query(ref(database, 'users/'), [orderByChild('groupId'), equalTo(groupId)]);
        const unsubscribeAdd = onChildAdded(usersRef, (data)=>{
            setAllUsers((currentUsers)=>({...currentUsers, [data.key]:data.exportVal()}));
        });
        const unsubscribeChange = onChildChanged(usersRef, (data)=>{
            setAllUsers((currentUsers)=>({...currentUsers, [data.key]:data.exportVal()}));
        });
        const unsubscribeRemove = onChildRemoved(usersRef, (data)=>{
            setAllUsers((currentUsers)=>{
                const {[data.key]:excluded, ...rest} = currentUsers;
                return rest;
            });
        });
        return ()=>{ unsubscribeAdd(); unsubscribeChange(); unsubscribeRemove(); }
    },[groupId]);

    return [ allUsers, updateUser];
}