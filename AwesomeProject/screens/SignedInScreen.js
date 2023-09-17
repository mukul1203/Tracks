import { getAuth } from "firebase/auth";
import { Button, FlatList, StyleSheet, View, Text } from "react-native";
import { useInvites } from "../utils/hooks/useInvites";
import { deleteGroup, joinGroup } from "../utils/hooks/useGroup";
import { userSignOut } from "../utils/hooks/useAuthentication";

const auth = getAuth();
export default function SignedInScreen({ navigation }) {
  const user = auth.currentUser;
  const [groupIds] = useInvites([]);
  const JoinGroupListItem = (groupId) => (
    <View style={{ ...styles.container, flexDirection: "row" }}>
      <Text>{groupId}</Text>
      <Button
        title="Join"
        style={styles.button}
        onPress={() => joinGroup(groupId)}
      />
      <Button
        title="Delete"
        style={styles.button}
        onPress={() => deleteGroup(groupId)}
      />
    </View>
  );
  return (
    <View style={styles.container}>
      <Text>Welcome {user?.email}!</Text>
      <FlatList
        keyExtractor={(groupId) => groupId}
        data={groupIds}
        renderItem={({ item }) => JoinGroupListItem(item)}
      ></FlatList>
      <Button title="Sign Out" style={styles.button} onPress={userSignOut} />
      <Button
        title="Create Group"
        style={styles.button}
        onPress={() => navigation.navigate("Create Group")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: 10,
  },
});
