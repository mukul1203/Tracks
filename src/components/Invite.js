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
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../services/auth";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import { colors, radius, spacing } from "../theme";

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

  const isSelfInvite =
    getValueFromPath(invite, INVITE_SENT_BY) === auth.currentUserId();

  const confirmDelete = () =>
    Alert.alert(
      "Delete group?",
      "This removes the group for everyone. This can't be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteGroup(groupId),
        },
      ]
    );

  const memberCount = groupMembers.length;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.name}>{groupName || "Loading group…"}</Text>
          <Text style={styles.sub}>
            Created by {userName || "…"}
            {memberCount > 0 &&
              ` · ${memberCount} member${memberCount > 1 ? "s" : ""}`}
          </Text>
        </View>
        <Button
          title="Join"
          buttonStyle={styles.join}
          titleStyle={styles.joinTitle}
          onPress={() => joinGroup(groupId)}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.toggle}
          onPress={() => setShowMembers((s) => !s)}
        >
          <Text style={styles.toggleText}>
            {showMembers ? "Hide members" : "Show members"}
          </Text>
          <Icon
            name={showMembers ? "chevron-up" : "chevron-down"}
            size={18}
            color={colors.textMuted}
          />
        </TouchableOpacity>

        {isSelfInvite ? (
          <TouchableOpacity onPress={confirmDelete}>
            <Text style={styles.danger}>Delete</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => ignoreInvite(invite)}>
            <Text style={styles.muted}>Ignore</Text>
          </TouchableOpacity>
        )}
      </View>

      {showMembers && (
        <View style={styles.membersList}>
          {memberCount > 0 ? (
            groupMembers.map((member) => (
              <Text
                key={getValueFromPath(member, USER_ID)}
                style={styles.memberText}
              >
                {getValueFromPath(member, USER_NAME)} ·{" "}
                {getValueFromPath(member, USER_EMAIL)}
              </Text>
            ))
          ) : (
            <Text style={styles.memberText}>No members have joined yet.</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  info: {
    flex: 1,
    paddingRight: spacing.md,
  },
  name: {
    fontWeight: "700",
    fontSize: 17,
    color: colors.text,
  },
  sub: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  join: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  joinTitle: {
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  toggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleText: {
    color: colors.textMuted,
    marginRight: spacing.xs,
  },
  danger: {
    color: colors.danger,
    fontWeight: "600",
  },
  muted: {
    color: colors.textMuted,
    fontWeight: "600",
  },
  membersList: {
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  memberText: {
    color: colors.text,
    fontSize: 14,
    marginVertical: 2,
  },
});
