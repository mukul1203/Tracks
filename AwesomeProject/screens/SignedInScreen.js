import { getAuth, signOut } from "firebase/auth";
import { Button, FlatList, StyleSheet, View, Text } from "react-native";
import { useInvites } from "../utils/hooks/useInvites";
import { getDatabase, ref, set } from "firebase/database";

const auth = getAuth();
export default function SignedInScreen({ navigation }) {
  const user = auth.currentUser;
  const [invites] = useInvites([]);
  const joinGroup = (groupId) => {
    //set the user's groupId to this groupId
    //TODO:move this elsewhere, and also should we await?
    set(ref(getDatabase(), 'users/'+user.uid+'/groupId'), groupId);
    navigation.navigate('Map', {groupId});
  };

  const JoinGroupListItem = (invite)=>(
    <View style={{...styles.container, flexDirection:"row"}}>
    <Text>{invite}</Text>
    <Button title="Join" style={styles.button} onPress={()=>joinGroup(invite)}/>
    </View>
  );
  return (
    <View style={styles.container}>
      <Text>Welcome {user?.email}!</Text>
      <FlatList 
        keyExtractor={(invite)=>invite}
        data={invites}
        renderItem={({item}) => JoinGroupListItem(item)}
      >
      </FlatList>
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