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

export const Invite = ({
  invite
}: any) => {
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

      // @ts-expect-error TS(2345): Argument of type 'any[]' is not assignable to para... Remove this comment to see the full error message
      setGroupMembers(await getGroupMembers(group));
    };

    fetchGroupData();
  }, [getValueFromPath(invite, INVITE_ID)]);

  const toggleMembersView = () => setShowMembers(!showMembers);
  const isSelfInvite =
    getValueFromPath(invite, INVITE_SENT_BY) === auth.currentUserId();
  // @ts-expect-error TS(2322): Type 'boolean' is not assignable to type 'View'.
  return (
    // @ts-expect-error TS(2304): Cannot find name 'style'.
    <View style={styles.container}>
      // @ts-expect-error TS(2304): Cannot find name 'style'.
      <View style={styles.listItem}>
        // @ts-expect-error TS(2304): Cannot find name 'style'.
        <Text style={styles.textBold}>{groupName || "Loading group..."}</Text>
        // @ts-expect-error TS(2552): Cannot find name 'style'. Did you mean 'styles'?
        <Text style={styles.text}>
          // @ts-expect-error TS(2304): Cannot find name 'Created'.
          Created by: {userName || "Loading user..."}
        </Text>

        {/* Toggle button to show/hide group members */}
        // @ts-expect-error TS(2304): Cannot find name 'onPress'.
        <TouchableOpacity onPress={toggleMembersView}>
          // @ts-expect-error TS(2352): Conversion of type 'void' to type 'Icon' may be a ... Remove this comment to see the full error message
          <Icon
            // @ts-expect-error TS(2304): Cannot find name 'showMembers'.
            name={showMembers ? "chevron-up" : "chevron-down"}
            // @ts-expect-error TS(2304): Cannot find name 'size'.
            size={24}
            // @ts-expect-error TS(2304): Cannot find name 'color'.
            color="white"
          />
        </TouchableOpacity>
      </View>
      {/* Conditional rendering of group members */}
      // @ts-expect-error TS(2304): Cannot find name 'showMembers'.
      {showMembers && (
        // @ts-expect-error TS(2304): Cannot find name 'style'.
        <View style={styles.listItem}>
          // @ts-expect-error TS(2749): 'Button' refers to a value, but is being used as a... Remove this comment to see the full error message
          <Button
            // @ts-expect-error TS(2304): Cannot find name 'title'.
            title="Join"
            // @ts-expect-error TS(2304): Cannot find name 'buttonStyle'.
            buttonStyle={styles.button}
            // @ts-expect-error TS(2304): Cannot find name 'onPress'.
            onPress={() => joinGroup(groupId)}
          />
          // @ts-expect-error TS(2304): Cannot find name 'isSelfInvite'.
          {!isSelfInvite && (
            // @ts-expect-error TS(2749): 'Button' refers to a value, but is being used as a... Remove this comment to see the full error message
            <Button
              // @ts-expect-error TS(2304): Cannot find name 'title'.
              title="Ignore"
              // @ts-expect-error TS(2304): Cannot find name 'type'.
              type="outline"
              // @ts-expect-error TS(2304): Cannot find name 'buttonStyle'.
              buttonStyle={styles.button}
              // @ts-expect-error TS(2304): Cannot find name 'onPress'.
              onPress={() => ignoreInvite(invite)}
            />
          )}
          // @ts-expect-error TS(2304): Cannot find name 'isSelfInvite'.
          {isSelfInvite && (
            // @ts-expect-error TS(2749): 'Button' refers to a value, but is being used as a... Remove this comment to see the full error message
            <Button
              // @ts-expect-error TS(2304): Cannot find name 'title'.
              title="Delete"
              // @ts-expect-error TS(2304): Cannot find name 'type'.
              type="outline"
              // @ts-expect-error TS(2304): Cannot find name 'buttonStyle'.
              buttonStyle={styles.button}
              // @ts-expect-error TS(2304): Cannot find name 'onPress'.
              onPress={() => deleteGroup(groupId)}
            />
          )}
          // @ts-expect-error TS(2304): Cannot find name 'style'.
          <View style={styles.membersList}>
            // @ts-expect-error TS(18004): No value exists in scope for the shorthand propert... Remove this comment to see the full error message
            {groupMembers.length > 0 ? (
              // @ts-expect-error TS(2304): Cannot find name 'groupMembers'.
              groupMembers.map((member: any) => <Text
                // @ts-expect-error TS(2304): Cannot find name 'key'.
                key={getValueFromPath(member: any, USER_ID: any)}
                // @ts-expect-error TS(2552): Cannot find name 'style'. Did you mean 'styles'?
                style={styles.memberText}
              >
                {getValueFromPath(member: any, USER_NAME: any) +
                  " - " +
                  // @ts-expect-error TS(2304): Cannot find name 'member'.
                  getValueFromPath(member, USER_EMAIL)}
              </Text>)
            // @ts-expect-error TS(2322): Type 'boolean' is not assignable to type 'Text'.
            ) : (
              // @ts-expect-error TS(2304): Cannot find name 'style'.
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
