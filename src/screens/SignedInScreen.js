import { FlatList, StyleSheet, View, Text } from "react-native";
import { useInvites } from "../utils/hooks/useInvites";
import { Background } from "../components/Background";
import { Button } from "react-native-elements";
import { Invite } from "../components/Invite";
import { getValueFromPath } from "../utils/data/selectors";
import { INVITE_ID } from "../utils/data/paths";
import { CREATE_GROUP_SCREEN_NAME } from "./screenConstants";
import { userSignOut } from "../utils/data/actions";

export default function SignedInScreen({ navigation }) {
  const { receivedInvites } = useInvites();
  // console.log("received invites");
  // console.log(receivedInvites);
  return (
    <Background>
      <View style={styles.container}>
        <Text style={{ ...styles.text, fontSize: 18 }}>Invites received</Text>
        <FlatList
          flexGrow={1}
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(invite) => getValueFromPath(invite, INVITE_ID)}
          data={receivedInvites}
          renderItem={({ item }) => <Invite invite={item} />}
        ></FlatList>
        <View style={styles.horizontalItems}>
          <Button
            title="Create Group"
            buttonStyle={styles.button}
            onPress={() => navigation.navigate(CREATE_GROUP_SCREEN_NAME)}
          />
          <Button
            title="Sign Out"
            type="outline"
            buttonStyle={styles.button}
            onPress={userSignOut}
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
