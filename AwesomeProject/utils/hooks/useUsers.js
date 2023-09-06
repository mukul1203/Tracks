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
            setAllUsers({...allUsers, [data.key]:data.value()});
        });
        const unsubscribeChange = onChildChanged(usersRef, (data)=>{
            setAllUsers({...allUsers, [data.key]:data.value()});
        });
        const unsubscribeRemove = onChildRemoved(usersRef, (data)=>{
            setAllUsers((current)=>{
                const {[data.key]:excluded, ...rest} = current;
                return rest;
            });
        });
        // const unsubscribe = onValue(usersRef, (snapshot) => {
        //     const users = snapshot.val();
        //     setAllUsers(users);
        //   });
        // return unsubscribe;
        return ()=>{ unsubscribeAdd(); unsubscribeChange(); unsubscribeRemove(); }
    },[]);

    return [ allUsers, updateCurrentUser];
}