import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import { Background } from "../components/Background";
import { auth } from "../services/auth";
import { createGroup } from "../utils/data/actions";
import { SIGNED_IN_SCREEN_NAME } from "./screenConstants";
import { getUserFromEmail } from "../utils/data/selectors";

const CreateGroupScreen = function ({
  navigation
}: any) {
  const [list, setList] = useState([auth.currentUserEmail()]); //list of emails state
  const [entry, setEntry] = useState(""); //input box state
  const [groupName, setGroupName] = useState("");
  const keyExtractor = (item: any, index: any) => index.toString();
  // @ts-expect-error TS(2304): Cannot find name 'style'.
  const InviteListItem = (email: any) => <View style={styles.listItem}>
    // @ts-expect-error TS(2304): Cannot find name 'style'.
    <Text style={styles.text}>{email}</Text>
    // @ts-expect-error TS(2304): Cannot find name 'email'.
    {email != auth.currentUserEmail() && (
      // @ts-expect-error TS(2749): 'Button' refers to a value, but is being used as a... Remove this comment to see the full error message
      <Button
        // @ts-expect-error TS(2304): Cannot find name 'title'.
        title="Delete"
        // @ts-expect-error TS(2304): Cannot find name 'type'.
        type="outline"
        // @ts-expect-error TS(2304): Cannot find name 'buttonStyle'.
        buttonStyle={styles.button}
        // @ts-expect-error TS(2304): Cannot find name 'onPress'.
        onPress={() =>
          // @ts-expect-error TS(2304): Cannot find name 'setList'.
          setList((list: any) => list.filter((item: any) => item != email))
        }
      />
    )}
  </View>;
  return (
    <Background>
      <View style={styles.container}>
        // @ts-expect-error TS(2448): Block-scoped variable 'styles' used before its dec... Remove this comment to see the full error message
        <Text style={{ ...styles.text, fontSize: 18 }}>
          // @ts-expect-error TS(2304): Cannot find name 'Invite'.
          Invite participants
        </Text>
        <Input
          // @ts-expect-error TS(2304): Cannot find name 'placeholder'.
          placeholder="Group name"
          // @ts-expect-error TS(2304): Cannot find name 'value'.
          value={groupName}
          // @ts-expect-error TS(2304): Cannot find name 'onChangeText'.
          onChangeText={setGroupName}
          // @ts-expect-error TS(2304): Cannot find name 'style'.
          style={styles.text}
          // @ts-expect-error TS(2304): Cannot find name 'errorMessage'.
          errorMessage={!groupName && "Group name is mandatory"}
        // @ts-expect-error TS(2365): Operator '<' cannot be applied to types 'boolean' ... Remove this comment to see the full error message
        ></Input>
        <Input
          // @ts-expect-error TS(2304): Cannot find name 'placeholder'.
          placeholder="Email of participant"
          // @ts-expect-error TS(2304): Cannot find name 'value'.
          value={entry}
          // @ts-expect-error TS(2304): Cannot find name 'onChangeText'.
          onChangeText={setEntry}
          // @ts-expect-error TS(2304): Cannot find name 'style'.
          style={styles.text}
        ></Input>
        <Button
          // @ts-expect-error TS(2304): Cannot find name 'title'.
          title="Add"
          // @ts-expect-error TS(2304): Cannot find name 'buttonStyle'.
          buttonStyle={styles.button}
          // @ts-expect-error TS(2304): Cannot find name 'onPress'.
          onPress={async () => {
            // Only if entry is non empty, not duplicate and a user with given email is found
            // TODO: throw relevant errors here to notify user
            // @ts-expect-error TS(2304): Cannot find name 'entry'.
            const normalizedEntry = entry?.toLowerCase();
            if (
              normalizedEntry &&
              // @ts-expect-error TS(2304): Cannot find name 'list'.
              !list.includes(normalizedEntry) &&
              (await getUserFromEmail(normalizedEntry))
            ) {
              // @ts-expect-error TS(2304): Cannot find name 'setList'.
              setList([...list, normalizedEntry]);
              // @ts-expect-error TS(2304): Cannot find name 'setEntry'.
              setEntry("");
            }
          }}
        // @ts-expect-error TS(2365): Operator '<' cannot be applied to types 'boolean' ... Remove this comment to see the full error message
        ></Button>
        <FlatList
          // @ts-expect-error TS(2304): Cannot find name 'keyExtractor'.
          keyExtractor={keyExtractor}
          // @ts-expect-error TS(2304): Cannot find name 'data'.
          data={list}
          // @ts-expect-error TS(2304): Cannot find name 'renderItem'.
          renderItem={({ item }) => InviteListItem(item)}
        // @ts-expect-error TS(2365): Operator '<' cannot be applied to types 'boolean' ... Remove this comment to see the full error message
        ></FlatList>
        <Button
          // @ts-expect-error TS(2304): Cannot find name 'title'.
          title="Done"
          // @ts-expect-error TS(2304): Cannot find name 'buttonStyle'.
          buttonStyle={styles.button}
          // @ts-expect-error TS(2304): Cannot find name 'onPress'.
          onPress={() => {
            // @ts-expect-error TS(2304): Cannot find name 'groupName'.
            if (groupName) {
              // @ts-expect-error TS(2304): Cannot find name 'list'.
              createGroup(list, groupName);
              // @ts-expect-error TS(2304): Cannot find name 'navigation'.
              navigation.navigate(SIGNED_IN_SCREEN_NAME);
            }
          }}
        // @ts-expect-error TS(2365): Operator '<' cannot be applied to types 'boolean' ... Remove this comment to see the full error message
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
