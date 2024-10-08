import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import { Background } from "../components/Background";
import { auth } from "../services/auth";
import { createGroup } from "../utils/data/actions";
import { SIGNED_IN_SCREEN_NAME } from "./screenConstants";
import { getUserFromEmail } from "../utils/data/selectors";

const CreateGroupScreen = function ({ navigation }) {
  const [list, setList] = useState([auth.currentUserEmail()]); //list of emails state
  const [entry, setEntry] = useState(""); //input box state
  const [groupName, setGroupName] = useState("");
  const keyExtractor = (item, index) => index.toString();
  const InviteListItem = (email) => (
    <View style={styles.listItem}>
      <Text style={styles.text}>{email}</Text>
      {email != auth.currentUserEmail() && (
        <Button
          title="Delete"
          type="outline"
          buttonStyle={styles.button}
          onPress={() =>
            setList((list) => list.filter((item) => item != email))
          }
        />
      )}
    </View>
  );
  return (
    <Background>
      <View style={styles.container}>
        <Text style={{ ...styles.text, fontSize: 18 }}>
          Invite participants
        </Text>
        <Input
          placeholder="Group name"
          value={groupName}
          onChangeText={setGroupName}
          style={styles.text}
          errorMessage={!groupName && "Group name is mandatory"}
        ></Input>
        <Input
          placeholder="Email of participant"
          value={entry}
          onChangeText={setEntry}
          style={styles.text}
        ></Input>
        <Button
          title="Add"
          buttonStyle={styles.button}
          onPress={async () => {
            // Only if entry is non empty, not duplicate and a user with given email is found
            // TODO: throw relevant errors here to notify user
            const normalizedEntry = entry?.toLowerCase();
            if (
              normalizedEntry &&
              !list.includes(normalizedEntry) &&
              (await getUserFromEmail(normalizedEntry))
            ) {
              setList([...list, normalizedEntry]);
              setEntry("");
            }
          }}
        ></Button>
        <FlatList
          keyExtractor={keyExtractor}
          data={list}
          renderItem={({ item }) => InviteListItem(item)}
        ></FlatList>
        <Button
          title="Done"
          buttonStyle={styles.button}
          onPress={() => {
            if (groupName) {
              createGroup(list, groupName);
              navigation.navigate(SIGNED_IN_SCREEN_NAME);
            }
          }}
        ></Button>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 10,
    borderRadius: 5,
  },
  text: { color: "white" },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
});

export default CreateGroupScreen;
