import { getAuth } from "firebase/auth";
import { equalTo, get, getDatabase, onChildAdded, onChildRemoved, orderByChild, query, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
// import { firebaseKeyCodec } from "../firebaseKeyCodec";

const auth = getAuth();
const database = getDatabase();
export async function invite(emails, groupId) {
  //TODO: optimize. First fetch all users, then batch the updates using update()
  for(let i = 0; i < emails.length; i++) {
    const usersRef = query(ref(database, 'users/'),orderByChild('email'),equalTo(emails[i]));
    await get(usersRef).then((users)=>{
        const userIds = Object.keys(users.exportVal()); //There should be only one userId with given email
        if(userIds.length == 1)
            return set(ref(database, 'users/'+userIds[0]+'/invites/'+groupId), true);
    }).catch((error)=>{
        //user with given email not found in users/
        //If we don't catch, none of the users get invites due to error thrown
    });
}  
}

export function useInvites(init) {
    const [invites, setInvites] = useState(init);
    useEffect(()=>{
        const invitesRef = ref(database, 'users/' + auth.currentUser.uid + '/invites/');
        const unsubscribeAdd = onChildAdded(invitesRef, (data)=>{
            setInvites((invites)=>([...invites, data.key]));
        });
        const unsubscribeRemove = onChildRemoved(invitesRef, (data)=>{
            setInvites((invites)=>invites.filter((elem)=>(elem!=data.key)));
        });
        return ()=>{ unsubscribeAdd(); unsubscribeRemove(); }

        // const groupsRef = query(ref(database, 'groups/'), orderByChild(firebaseKeyCodec.encodeFully(auth.currentUser.email)), equalTo(true));
        // const unsubscribeAdd = onChildAdded(groupsRef, (data)=>{
        //     setInvites((invites)=>({...invites, [data.key]:data.exportVal()}));
        // });
        // const unsubscribeChange = onChildChanged(groupsRef, (data)=>{
        //     setInvites((invites)=>({...invites, [data.key]:data.exportVal()}));
        // });
        // const unsubscribeRemove = onChildRemoved(groupsRef, (data)=>{
        //     setInvites((invites)=>{
        //         const {[data.key]:excluded, ...rest} = invites;
        //         return rest;
        //     });
        // });
        // return ()=>{ unsubscribeAdd(); unsubscribeChange(); unsubscribeRemove(); }
    },[])
    return [invites]
}