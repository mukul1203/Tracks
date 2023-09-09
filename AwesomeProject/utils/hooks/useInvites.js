import { getAuth } from "firebase/auth";
import { getDatabase, onChildAdded, onChildChanged, onChildRemoved, ref } from "firebase/database";
import { useEffect, useState } from "react";

const auth = getAuth();
const database = getDatabase();

export function useInvites(init) {
    const [invites, setInvites] = useState(init);
    useEffect(()=>{
        const invitesRef = ref(database, 'users/' + auth.currentUser.uid + '/invites/');
        const unsubscribeAdd = onChildAdded(invitesRef, (data)=>{
            setInvites((invites)=>([...invites, data.key]));
        });
        // const unsubscribeChange = onChildChanged(invitesRef, (data)=>{
        //     setInvites((invites)=>([...invites, data.key]));
        // });
        const unsubscribeRemove = onChildRemoved(invitesRef, (data)=>{
            setInvites((invites)=>invites.filter((elem)=>(elem!=data.key)));
        });
        return ()=>{ unsubscribeAdd(); unsubscribeRemove(); }//unsubscribeChange();
    },[])
    return [invites]
}