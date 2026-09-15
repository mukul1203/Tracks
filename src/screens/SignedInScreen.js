import { Alert, FlatList, StyleSheet, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useInvites } from "../utils/hooks/useInvites";
import { Background } from "../components/Background";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Invite } from "../components/Invite";
import { getValueFromPath } from "../utils/data/selectors";
import { INVITE_ID } from "../utils/data/paths";
import { CREATE_GROUP_SCREEN_NAME } from "./screenConstants";
import { userSignOut } from "../utils/data/actions";
import { colors, radius, spacing } from "../theme";

export default function SignedInScreen({ navigation }) {
  const { receivedInvites } = useInvites();
  const insets = useSafeAreaInsets();

  const confirmSignOut = () =>
    Alert.alert("Sign out?", "You'll stop sharing your location.", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: userSignOut },
    ]);

  return (
    <Background>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Groups</Text>
          <Button
            type="clear"
            icon={<Icon name="logout" size={22} color={colors.textMuted} />}
            onPress={confirmSignOut}
          />
        </View>

        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyExtractor={(invite) => getValueFromPath(invite, INVITE_ID)}
          data={receivedInvites}
          renderItem={({ item }) => <Invite invite={item} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Icon
                name="map-marker-multiple-outline"
                size={56}
                color={colors.textMuted}
              />
              <Text style={styles.emptyTitle}>No groups yet</Text>
              <Text style={styles.emptyText}>
                Create a group and invite friends to start sharing locations.
              </Text>
            </View>
          }
        />

        <Button
          title="Create group"
          icon={
            <Icon
              name="plus"
              size={20}
              color={colors.text}
              style={{ marginRight: spacing.sm }}
            />
          }
          buttonStyle={styles.createButton}
          titleStyle={styles.createTitle}
          onPress={() => navigation.navigate(CREATE_GROUP_SCREEN_NAME)}
        />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: spacing.md,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginTop: spacing.md,
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  createTitle: {
    fontWeight: "700",
  },
});
