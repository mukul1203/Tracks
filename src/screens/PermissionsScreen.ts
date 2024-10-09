import * as Location from "expo-location";
import { Button, Linking, StyleSheet, Text, View } from "react-native";
import { Background } from "../components/Background";
import { WELCOME_SCREEN_NAME } from "./screenConstants";

export default function PermissionsScreen({
  navigation
}: any) {
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
    // @ts-expect-error TS(2749): 'Background' refers to a value, but is being used ... Remove this comment to see the full error message
    <Background>
      // @ts-expect-error TS(2552): Cannot find name 'style'. Did you mean 'styles'?
      <View style={styles.container}>
        // @ts-expect-error TS(2552): Cannot find name 'style'. Did you mean 'styles'?
        <View style={styles.block}>
          // @ts-expect-error TS(2552): Cannot find name 'Foreground'. Did you mean 'foreg... Remove this comment to see the full error message
          <Text>Foreground permission:</Text>
          <Text>status: {foreground?.status || "pending"}</Text>
          // @ts-expect-error TS(2531): Object is possibly 'null'.
          {foreground && !foreground.granted && foreground.canAskAgain && (
            // If the permission is not granted, but we can request again, show this
            // @ts-expect-error TS(2304): Cannot find name 'title'.
            <Button title="Grant permission" onPress={requestForeground} />
          )}
          // @ts-expect-error TS(2531): Object is possibly 'null'.
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
              // @ts-expect-error TS(2304): Cannot find name 'title'.
              title="Grant permission through settings"
              // @ts-expect-error TS(2304): Cannot find name 'onPress'.
              onPress={() =>
                requestForeground().then(
                  // @ts-expect-error TS(2345): Argument of type '(p: LocationPermissionResponse) ... Remove this comment to see the full error message
                  (p) => !p.granted && Linking.openSettings()
                )
              }
            />
          )}
        </View>

        // @ts-expect-error TS(2552): Cannot find name 'style'. Did you mean 'styles'?
        <View style={styles.block}>
          // @ts-expect-error TS(2352): Conversion of type '({ children }: any) => { requi... Remove this comment to see the full error message
          <Text>Background permission:</Text>
          // @ts-expect-error TS(2552): Cannot find name 'background'. Did you mean 'Backg... Remove this comment to see the full error message
          <Text>status: {background?.status || "pending"}</Text>
          // @ts-expect-error TS(2304): Cannot find name 'foreground'.
          {!foreground?.granted && (
            // We don't have the foreground permission yet,
            // which is required for Android to use background location
            // @ts-expect-error TS(2304): Cannot find name 'Grant'.
            <Text>Grant foreground location permission first</Text>
          )}
          // @ts-expect-error TS(2304): Cannot find name 'foreground'.
          {foreground?.granted &&
            // @ts-expect-error TS(2304): Cannot find name 'background'.
            background &&
            // @ts-expect-error TS(2304): Cannot find name 'background'.
            !background.granted &&
            // @ts-expect-error TS(2304): Cannot find name 'background'.
            background.canAskAgain && (
              // If the permission is not granted, but we can request again, show this.
              // This handles the permission status update automatically for you, when users are coming back from the app settings
              // @ts-expect-error TS(2304): Cannot find name 'title'.
              <Button title="Grant permission" onPress={requestBackground} />
            )}
          // @ts-expect-error TS(2304): Cannot find name 'foreground'.
          {foreground?.granted &&
            // @ts-expect-error TS(2304): Cannot find name 'background'.
            background &&
            // @ts-expect-error TS(2304): Cannot find name 'background'.
            !background.granted &&
            // @ts-expect-error TS(2304): Cannot find name 'background'.
            !background.canAskAgain && (
              // If the permission is not granted, and we can't request it again, show this.
              // Same here, we have to manually refresh the background status in this case.
              // NOTE: this is not a great scenario to be in, and Google will have some issues with this flow.
              <Button
                // @ts-expect-error TS(2304): Cannot find name 'title'.
                title="Grant permission through settings"
                // @ts-expect-error TS(2304): Cannot find name 'onPress'.
                onPress={() =>
                  // @ts-expect-error TS(2304): Cannot find name 'requestBackground'.
                  requestBackground().then(
                    (p: any) => !p.granted && Linking.openSettings()
                  )
                }
              />
            )}
        // @ts-expect-error TS(2365): Operator '<' cannot be applied to types 'boolean' ... Remove this comment to see the full error message
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
