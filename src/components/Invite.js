import React, { useEffect, useState } from "react";
import { deleteGroup, ignoreInvite, joinGroup } from "../utils/data/actions";
import {
  GROUP_CREATED_BY,
  GROUP_NAME,
  INVITE_GROUP,
  INVITE_ID,
  INVITE_SENT_BY,
  USER_NAME,
} from "../utils/data/paths";
import { getGroup, getUser, getValueFromPath } from "../utils/data/selectors";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import { auth } from "../services/auth";

export const Invite = ({ invite }) => {
  console.log("Rendering Invite");
  console.log(invite);
  const [userName, setUserName] = useState("");
  const [groupName, setGroupName] = useState("");
  const groupId = getValueFromPath(invite, INVITE_GROUP);
  useEffect(() => {
    const fetchUserName = async () => {
      const group = await getGroup(groupId);
      setGroupName(getValueFromPath(group, GROUP_NAME));
      const userId = getValueFromPath(group, GROUP_CREATED_BY);
      const user = await getUser(userId);
      setUserName(getValueFromPath(user, USER_NAME));
    };
    fetchUserName();
  }, [getValueFromPath(invite, INVITE_ID)]);

  return (
    <View style={styles.listItem}>
      <Text style={styles.text}>{groupName || "Loading..."}</Text>
      <Text style={styles.text}>{userName || "Loading..."}</Text>
      <Button
        title="Join"
        buttonStyle={styles.button}
        onPress={() => joinGroup(groupId)}
      />
      {/*TODO: user should be able to reject an invite, which should change the invite status in db. Group can only be deleted by the creator.*/}
      <Button
        title="Ignore"
        type="outline"
        buttonStyle={styles.button}
        onPress={() => ignoreInvite(invite)}
      />
      {getValueFromPath(invite, INVITE_SENT_BY) == auth.currentUserId() && (
        <Button
          title="Delete"
          type="outline"
          buttonStyle={styles.button}
          onPress={() => deleteGroup(groupId)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
