import { useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import { Background } from "../components/Background";
import { auth } from "../services/auth";
import { createGroup } from "../utils/data/actions";
import { SIGNED_IN_SCREEN_NAME } from "./screenConstants";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CreateGroupScreen = function ({ navigation }) {
  const [list, setList] = useState([auth.currentUserEmail()]); //list of emails state
  const [entry, setEntry] = useState(""); //input box state
  const [entryError, setEntryError] = useState("");
  const [groupName, setGroupName] = useState("");
  const [creating, setCreating] = useState(false);
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
          onChangeText={(text) => {
            setEntry(text);
            if (entryError) setEntryError("");
          }}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          errorMessage={entryError}
          style={styles.text}
        ></Input>
        <Button
          title="Add"
          buttonStyle={styles.button}
          onPress={() => {
            const normalizedEntry = entry.trim().toLowerCase();
            if (!normalizedEntry) {
              setEntryError("Enter an email address");
              return;
            }
            if (!EMAIL_REGEX.test(normalizedEntry)) {
              setEntryError("Enter a valid email address");
              return;
            }
            if (list.includes(normalizedEntry)) {
              setEntryError("This email is already added");
              return;
            }
            setList([...list, normalizedEntry]);
            setEntry("");
            setEntryError("");
          }}
        ></Button>
        <FlatList
          keyExtractor={keyExtractor}
          data={list}
          renderItem={({ item }) => InviteListItem(item)}
        ></FlatList>
        <Text style={styles.hint}>
          People not yet on the app will see the invite when they sign up with
          the invited email.
        </Text>
        <Button
          title="Done"
          buttonStyle={styles.button}
          disabled={creating}
          icon={
            creating ? <ActivityIndicator color="white" size="small" /> : undefined
          }
          onPress={async () => {
            if (!groupName.trim()) {
              return;
            }
            setCreating(true);
            try {
              await createGroup(list, groupName.trim());
              navigation.navigate(SIGNED_IN_SCREEN_NAME);
            } catch (error) {
              Alert.alert("Couldn't create group", error.message);
            } finally {
              setCreating(false);
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
  hint: {
    color: "white",
    opacity: 0.8,
    fontSize: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontStyle: "italic",
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
});

export default CreateGroupScreen;
