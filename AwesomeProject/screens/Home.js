import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { Button } from 'react-native-elements';
import { getAuth, signOut } from 'firebase/auth';

const auth = getAuth();

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

export default function HomeScreen({ navigation }) {
  const { user } = useAuthentication();
  
  return (
    <View style={styles.container}>
      <Text>Welcome {user?.email}!</Text>
      <Button title="Sign Out" style={styles.button} onPress={() => signOut(auth)} />
      <Button title="Create Group" style={styles.button} onPress={() => navigation.navigate('Create Group')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 10
  }
});