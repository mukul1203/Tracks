import { FlatList, StyleSheet, View, Text } from "react-native";
import { useInvites } from "../utils/hooks/useInvites";
import { deleteGroup, joinGroup } from "../utils/hooks/useGroup";
import { auth } from "../services/auth";
import { Background } from "../components/Background";
import { Button } from "react-native-elements";

export default function SignedInScreen({ navigation }) {
  const user = auth.currentUser();
  const [groupIds] = useInvites([]);
  const JoinGroupListItem = (groupId) => (
    <View style={styles.listItem}>
      <Text style={styles.text}>{groupId}</Text>
      <Button
        title="Join"
        buttonStyle={styles.button}
        onPress={() => joinGroup(groupId)}
      />
      <Button
        title="Delete"
        type="outline"
        buttonStyle={styles.button}
        onPress={() => deleteGroup(groupId)}
      />
    </View>
  );
  return (
    <Background>
      <View style={styles.container}>
        {/* <Text style={styles.text}>Welcome {user?.email}!</Text> */}
        <Text style={{ ...styles.text, fontSize: 18 }}>Group Invites</Text>
        <FlatList
          keyExtractor={(groupId) => groupId}
          data={groupIds}
          renderItem={({ item }) => JoinGroupListItem(item)}
        ></FlatList>
        <View style={styles.horizontalItems}>
          <Button
            title="Create Group"
            buttonStyle={styles.button}
            onPress={() => navigation.navigate("Create Group")}
          />
          <Button
            title="Sign Out"
            type="outline"
            buttonStyle={styles.button}
            onPress={auth.userSignOut}
          />
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 10,
    borderRadius: 5,
  },
  text: {
    color: "white",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  horizontalItems: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
