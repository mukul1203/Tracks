import { useEffect, useState } from "react";
import { getDatabase, ref, set, onChildAdded, onChildChanged, onChildRemoved, query, orderByChild, equalTo, push } from "firebase/database";
import { getAuth } from "firebase/auth";

const database = getDatabase();
const auth = getAuth();
export function useUsers(initUsers, groupId) {
    
    const [allUsers, setAllUsers] = useState(initUsers);

    const updateUser = async ({latitude, longitude})=>{
        //send the data to DB
        await set(ref(database, 'users/' + auth.currentUser.uid), {latitude, longitude, email:auth.currentUser.email, groupId});
    };

    useEffect(() => {
        const usersRef = query(ref(database, 'users/'), orderByChild('groupId'), equalTo(groupId));
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