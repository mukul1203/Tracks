import React, { useEffect, useState } from "react";
import { deleteGroup, ignoreInvite, joinGroup } from "../utils/data/actions";
import {
  GROUP_CREATED_BY,
  GROUP_NAME,
  INVITE_GROUP,
  INVITE_ID,
  INVITE_SENT_BY,
  USER_EMAIL,
  USER_ID,
  USER_NAME,
} from "../utils/data/paths";
import {
  getGroup,
  getGroupMembers,
  getUser,
  getValueFromPath,
} from "../utils/data/selectors";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { auth } from "../services/auth";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";

export const Invite = ({ invite }) => {
  const [userName, setUserName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const groupId = getValueFromPath(invite, INVITE_GROUP);

  useEffect(() => {
    const fetchGroupData = async () => {
      const group = await getGroup(groupId);
      setGroupName(getValueFromPath(group, GROUP_NAME));

      const userId = getValueFromPath(group, GROUP_CREATED_BY);
      const user = await getUser(userId);
      setUserName(getValueFromPath(user, USER_NAME));

      setGroupMembers(await getGroupMembers(group));
    };

    fetchGroupData();
  }, [getValueFromPath(invite, INVITE_ID)]);

  const toggleMembersView = () => setShowMembers(!showMembers);
  const isSelfInvite =
    getValueFromPath(invite, INVITE_SENT_BY) === auth.currentUserId();
  return (
    <View style={styles.container}>
      <View style={styles.listItem}>
        <Text style={styles.textBold}>{groupName || "Loading group..."}</Text>
        <Text style={styles.text}>
          Created by: {userName || "Loading user..."}
        </Text>

        {/* Toggle button to show/hide group members */}
        <TouchableOpacity onPress={toggleMembersView}>
          <Icon
            name={showMembers ? "chevron-up" : "chevron-down"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>
      {/* Conditional rendering of group members */}
      {showMembers && (
        <View style={styles.listItem}>
          <Button
            title="Join"
            buttonStyle={styles.button}
            onPress={() => joinGroup(groupId)}
          />
          {!isSelfInvite && (
            <Button
              title="Ignore"
              type="outline"
              buttonStyle={styles.button}
              onPress={() => ignoreInvite(invite)}
            />
          )}
          {isSelfInvite && (
            <Button
              title="Delete"
              type="outline"
              buttonStyle={styles.button}
              onPress={() => deleteGroup(groupId)}
            />
          )}
          <View style={styles.membersList}>
            {groupMembers.length > 0 ? (
              groupMembers.map((member) => (
                <Text
                  key={getValueFromPath(member, USER_ID)}
                  style={styles.memberText}
                >
                  {getValueFromPath(member, USER_NAME) +
                    " - " +
                    getValueFromPath(member, USER_EMAIL)}
                </Text>
              ))
            ) : (
              <Text style={styles.memberText}>No members found.</Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  textBold: {
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
    paddingHorizontal: 10,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 10,
    borderRadius: 5,
  },
  text: { color: "white", paddingHorizontal: 10 },
  memberText: {
    color: "white",
    fontSize: 14,
    marginVertical: 2,
  },
  toggleText: {
    color: "#007BFF",
    marginTop: 10,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  listItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  membersList: {
    marginTop: 10,
    paddingHorizontal: 8,
  },
});
