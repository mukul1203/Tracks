import { getDatabase, ref, set } from "firebase/database";
//Home screen
//1. a button hit to create a group
//2. an input to enter the email address of the participant
//3. filter the list by users who have signed up, report the rest
//4. when Done pressed, create a group in server, add the creator as a user there, populate user's lat/long in user data
//5. show the map and current live location of himself to the user now
//6. send notifications from server to the client apps, to join the group
//7. This needs an invitations list to be shown in home page,[group name, duration, other participants] with join button against each
//8. pressing join means user updates the "groups/group_id/users/" list with his user_id, and also updates an
//entry in "users/user_id/data" with his current lat/long data.
//9. pressing join should switch to the map view, with his current location, and also locations of anyone else joined the group 
//10. Show an exit button on map window, to exit the group
//11. Exiting means delete user entry from the group and also user data entry
//12. If this was the last user to exit, then clear off the group itself from DB
//13. If group duration is exhausted, server should notify clients and delete the group data


// function writeUserData(userId, data) {
//     const db = getDatabase();
//     set(ref(db, 'users/' + userId), {
//         email: data.email,
//         lat: data.lat,
//         long: data.long,
//     });
//   }


//   function writeGroupData(groupId, data) {
//     const db = getDatabase();
//     set(ref(db, 'groups/' + groupId), {
//         duration: data.duration,
//         users: data.users
//     });
//   }

