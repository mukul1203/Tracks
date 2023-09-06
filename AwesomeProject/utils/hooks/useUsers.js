import { useEffect, useState } from "react";
import { getDatabase, ref, set, onChildAdded, onChildChanged, onChildRemoved } from "firebase/database";

const database = getDatabase();

export function useUsers(init) {
    
    const [allUsers, setAllUsers] = useState(init);
    const updateCurrentUser = async (userId, {latitude, longitude, email})=>{
        //send the data to DB
        await set(ref(database, 'users/' + userId), {latitude, longitude, email});
    };

    useEffect(() => {
        
        const usersRef = ref(database, 'users/');
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
    },[]);

    return [ allUsers, updateCurrentUser];
}