import { useEffect, useState } from "react";
import { database } from "../../services/database";
import { auth } from "../../services/auth";

// import { firebaseKeyCodec } from "../firebaseKeyCodec";

// Invite given emails to the given group
export async function invite(emails, groupId) {
  //TODO: optimize. First fetch all users, then batch the updates using update()
  for (let i = 0; i < emails.length; i++) {
    await database
      .get("users/", ["email", "equals", emails[i]])
      .then((users) => {
        const userIds = Object.keys(users); //There should be only one userId with given email
        if (userIds.length == 1)
          return database.set(
            "users/" + userIds[0] + "/invites/" + groupId,
            true
          );
      })
      .catch((error) => {
        //user with given email not found in users/
        //If we don't catch, none of the users get invites due to error thrown
        console.log(error.message);
      });
  }
}

export function useInvites(init, setErrorMsg) {
  const [invites, setInvites] = useState(init);
  useEffect(() => {
    const invitesPath = "users/" + auth.currentUser().uid + "/invites/";
    const unsubscribeAdd = database.onChildAdded(
      invitesPath,
      [],
      ({ key, val }) => {
        setInvites((invites) => [...invites, key]);
      },
      (error) => setErrorMsg(error.message)
    );
    const unsubscribeRemove = database.onChildRemoved(
      invitesPath,
      [],
      ({ key, val }) => {
        setInvites((invites) => invites.filter((elem) => elem != key));
      },
      (error) => setErrorMsg(error.message)
    );
    return () => {
      unsubscribeAdd();
      unsubscribeRemove();
    };

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
  }, []);
  return [invites];
}
