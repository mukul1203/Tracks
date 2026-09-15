import * as Location from "expo-location";
import { Linking, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Background } from "../components/Background";
import { colors, radius, spacing } from "../theme";
import { WELCOME_SCREEN_NAME } from "./screenConstants";

export default function PermissionsScreen({ navigation }) {
  const [foreground, requestForeground] = Location.useForegroundPermissions();
  const [background, requestBackground] = Location.useBackgroundPermissions();

  if (foreground?.granted && background?.granted) {
    navigation.navigate(WELCOME_SCREEN_NAME);
    return;
  }
  // Rules for the permission flow:
  //  1. Foreground must be granted before we can ask for background.
  //  2. When the user has blocked a permission (`canAskAgain` false) we must
  //     send them to app settings and refresh the status on return.

  const foregroundGranted = foreground?.granted;
  const primaryBtn = (title, onPress) => (
    <Button
      title={title}
      buttonStyle={styles.button}
      titleStyle={styles.buttonTitle}
      containerStyle={styles.buttonContainer}
      onPress={onPress}
    />
  );

  return (
    <Background>
      <View style={styles.container}>
        <Icon name="map-marker-radius" size={64} color={colors.primary} />
        <Text style={styles.title}>Location access</Text>
        <Text style={styles.body}>
          Tracks shows where your group members are in real time. To share your
          own dot on the map, we need permission to use your location — including
          in the background, so friends still see you when the app isn't open.
        </Text>

        <View style={styles.step}>
          <Text style={styles.stepLabel}>While using the app</Text>
          <Text style={styles.stepStatus}>
            {foregroundGranted ? "Granted ✓" : foreground?.status || "pending"}
          </Text>
          {foreground && !foreground.granted && foreground.canAskAgain &&
            primaryBtn("Allow location", requestForeground)}
          {foreground && !foreground.granted && !foreground.canAskAgain &&
            primaryBtn("Open settings", () =>
              requestForeground().then((p) => !p.granted && Linking.openSettings())
            )}
        </View>

        <View style={styles.step}>
          <Text style={styles.stepLabel}>In the background</Text>
          <Text style={styles.stepStatus}>
            {background?.granted
              ? "Granted ✓"
              : !foregroundGranted
              ? "Allow the step above first"
              : background?.status || "pending"}
          </Text>
          {foregroundGranted && background && !background.granted &&
            background.canAskAgain &&
            primaryBtn("Allow always", requestBackground)}
          {foregroundGranted && background && !background.granted &&
            !background.canAskAgain &&
            primaryBtn("Open settings", () =>
              requestBackground().then((p) => !p.granted && Linking.openSettings())
            )}
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
    marginTop: spacing.md,
  },
  body: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  step: {
    alignSelf: "stretch",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  stepStatus: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  buttonContainer: {
    marginTop: spacing.sm,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
  },
  buttonTitle: {
    fontWeight: "700",
  },
});
