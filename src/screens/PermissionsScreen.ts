import * as Location from "expo-location";
import { Button, Linking, StyleSheet, Text, View } from "react-native";
import { Background } from "../components/Background";
import { WELCOME_SCREEN_NAME } from "./screenConstants";

export default function PermissionsScreen({ navigation }) {
  const [foreground, requestForeground] = Location.useForegroundPermissions();
  const [background, requestBackground] = Location.useBackgroundPermissions();

  if (foreground?.granted && background?.granted) {
    navigation.navigate(WELCOME_SCREEN_NAME);
    return;
  }
  // In this example, we follow a couple of rules for the permissions
  //  1. Foreground permission needs to be granted before asking background permission
  //  2. Whenever the user repeatedly blocks a permission, `canAskAgain` will be false and we _have_ to open app settings
  //  3. When opening app settings, we need to manually refresh the permissions in order to update the states

  return (
    <Background>
      <View style={styles.container}>
        <View style={styles.block}>
          <Text>Foreground permission:</Text>
          <Text>status: {foreground?.status || "pending"}</Text>
          {foreground && !foreground.granted && foreground.canAskAgain && (
            // If the permission is not granted, but we can request again, show this
            <Button title="Grant permission" onPress={requestForeground} />
          )}
          {foreground && !foreground.granted && !foreground.canAskAgain && (
            // If the permission is not granted, and we can't request it again, show this.
            //
            // Unfortunately, we have to manually refresh the foreground status in this case.
            // When the user comes back from the app settings page, after manually granting permission,
            // the user has to press this button again, in order to update the state of that permission.
            // We use `requestXPermissionAsync` to update the scoped permission when running in Expo Go.
            //
            // You could try to implement appState and auto-refreshes, but for this example
            // I just check before sending people to the app settings.
            // NOTE: this is not a great scenario to be in, and Google will have some issues with this flow.
            <Button
              title="Grant permission through settings"
              onPress={() =>
                requestForeground().then(
                  (p) => !p.granted && Linking.openSettings()
                )
              }
            />
          )}
        </View>

        <View style={styles.block}>
          <Text>Background permission:</Text>
          <Text>status: {background?.status || "pending"}</Text>
          {!foreground?.granted && (
            // We don't have the foreground permission yet,
            // which is required for Android to use background location
            <Text>Grant foreground location permission first</Text>
          )}
          {foreground?.granted &&
            background &&
            !background.granted &&
            background.canAskAgain && (
              // If the permission is not granted, but we can request again, show this.
              // This handles the permission status update automatically for you, when users are coming back from the app settings
              <Button title="Grant permission" onPress={requestBackground} />
            )}
          {foreground?.granted &&
            background &&
            !background.granted &&
            !background.canAskAgain && (
              // If the permission is not granted, and we can't request it again, show this.
              // Same here, we have to manually refresh the background status in this case.
              // NOTE: this is not a great scenario to be in, and Google will have some issues with this flow.
              <Button
                title="Grant permission through settings"
                onPress={() =>
                  requestBackground().then(
                    (p) => !p.granted && Linking.openSettings()
                  )
                }
              />
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
  },
  block: {
    marginVertical: 16,
  },
});
