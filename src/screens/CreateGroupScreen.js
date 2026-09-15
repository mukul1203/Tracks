import { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Background } from "../components/Background";
import { auth } from "../services/auth";
import { createGroup } from "../utils/data/actions";
import { colors, radius, spacing } from "../theme";
import { SIGNED_IN_SCREEN_NAME } from "./screenConstants";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CreateGroupScreen = function ({ navigation }) {
  const me = auth.currentUserEmail();
  const [list, setList] = useState([me]); // emails to invite (includes self)
  const [entry, setEntry] = useState(""); // email input box
  const [entryError, setEntryError] = useState("");
  const [groupName, setGroupName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [creating, setCreating] = useState(false);

  const addEmail = () => {
    const normalized = entry.trim().toLowerCase();
    if (!normalized) {
      setEntryError("Enter an email address");
      return;
    }
    if (!EMAIL_REGEX.test(normalized)) {
      setEntryError("Enter a valid email address");
      return;
    }
    if (list.includes(normalized)) {
      setEntryError("This email is already added");
      return;
    }
    setList([...list, normalized]);
    setEntry("");
    setEntryError("");
  };

  const done = async () => {
    setNameTouched(true);
    if (!groupName.trim()) return;
    setCreating(true);
    try {
      await createGroup(list, groupName.trim());
      navigation.navigate(SIGNED_IN_SCREEN_NAME);
    } catch (error) {
      Alert.alert("Couldn't create group", error.message);
    } finally {
      setCreating(false);
    }
  };

  const renderChip = (email) => {
    const isMe = email === me;
    return (
      <View style={styles.chip}>
        <Text style={styles.chipText}>{isMe ? `${email} (you)` : email}</Text>
        {!isMe && (
          <TouchableOpacity
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() =>
              setList((l) => l.filter((item) => item !== email))
            }
          >
            <Icon name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.title}>New group</Text>

        <Input
          placeholder="Group name"
          placeholderTextColor={colors.textMuted}
          value={groupName}
          onChangeText={(t) => {
            setGroupName(t);
            if (!nameTouched) setNameTouched(true);
          }}
          style={styles.text}
          errorMessage={
            nameTouched && !groupName.trim() ? "Group name is required" : ""
          }
        />

        <Text style={styles.sectionLabel}>Invite by email</Text>
        <View style={styles.addRow}>
          <Input
            containerStyle={styles.addInput}
            placeholder="name@example.com"
            placeholderTextColor={colors.textMuted}
            value={entry}
            onChangeText={(text) => {
              setEntry(text);
              if (entryError) setEntryError("");
            }}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            returnKeyType="done"
            onSubmitEditing={addEmail}
            errorMessage={entryError}
            style={styles.text}
          />
          <Button
            icon={<Icon name="plus" size={22} color={colors.text} />}
            buttonStyle={styles.addButton}
            containerStyle={styles.addButtonContainer}
            onPress={addEmail}
          />
        </View>

        <FlatList
          style={styles.list}
          keyExtractor={(item, index) => index.toString()}
          data={list}
          renderItem={({ item }) => renderChip(item)}
        />

        <Text style={styles.hint}>
          People not on Tracks yet will see the invite when they sign up with
          the invited email.
        </Text>

        <Button
          title="Create group"
          buttonStyle={styles.doneButton}
          titleStyle={styles.doneTitle}
          disabled={creating}
          loading={creating}
          onPress={done}
        />
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
    marginTop: spacing.sm,
    marginLeft: spacing.xs,
  },
  addRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  addInput: {
    flex: 1,
  },
  addButtonContainer: {
    marginTop: spacing.xs,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    width: 48,
    height: 48,
  },
  list: {
    flexGrow: 0,
    maxHeight: "40%",
  },
  chip: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipText: {
    color: colors.text,
    flexShrink: 1,
  },
  text: { color: colors.text },
  hint: {
    color: colors.textMuted,
    fontSize: 12,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
    fontStyle: "italic",
  },
  doneButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  doneTitle: {
    fontWeight: "700",
  },
});

export default CreateGroupScreen;
