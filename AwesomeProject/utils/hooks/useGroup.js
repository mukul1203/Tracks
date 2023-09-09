import { equalTo, get, getDatabase, orderByChild, push, query, ref, set } from "firebase/database";
import { useState } from "react";

const database = getDatabase();

export function useGroup(init) {
    const [groupInfo, setGroupInfo] = useState(init);
    const createGroup = async (mems) => {
        const groupRef = push(ref(database, 'groups/'));
        await set(groupRef, JSON.stringify(mems));//for now just push the members as stringified list
        setGroupInfo({groupId: groupRef.key, members:mems});
        //Also update invitees' invites list with this group id
        //TODO: optimize. First fetch all users, then batch the updates using update()
        for(let i = 0; i < mems.length; i++) {
            const usersRef = query(ref(database, 'users/'),orderByChild('email'),equalTo(mems[i]));
            await get(usersRef).then((users)=>{
                const userIds = Object.keys(users.exportVal()); //There should be only one userId with given email
                if(userIds.length == 1)
                    return set(ref(database, 'users/'+userIds[0]+'/invites/'+groupRef.key), true);
            });
        }
    };
    return [groupInfo, createGroup];
  }