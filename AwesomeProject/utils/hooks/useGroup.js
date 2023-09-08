import { getDatabase, push, ref, set } from "firebase/database";
import { useState } from "react";

const database = getDatabase();

export function useGroup(init) {
    const [groupInfo, setGroupInfo] = useState(init);
    const createGroup = async (mems) => {
        const groupRef = push(ref(database, 'groups/'));
        await set(groupRef, JSON.stringify(mems));//for now just push the members as stringified list
        setGroupInfo({groupId: groupRef.key, members:mems});
    };
    return [groupInfo, createGroup];
  }