import * as Location from "expo-location";
import { useEffect } from "react";
import { updateUser } from "./useUsers";
import * as TaskManager from "expo-task-manager";

export async function updateUserLocationInDB(latitude, longitude) {
  try {
    await updateUser({ latitude, longitude });
  } catch (error) {
    let errorMsg = "Update to db failed! " + error.message;
    return { errorMsg };
  }
  return {};
}

export function useLocationEffect(setErrorMsg) {
  useEffect(() => {
    const subscriptionPromise = (async () => {
      let { granted, status } =
        await Location.requestForegroundPermissionsAsync({});
      if (!granted) {
        let errorMsg = `Permission to access foreground location was denied, status: ${status}`;
        setErrorMsg(errorMsg);
        return;
      }
      // let { granted: backPermGranted, status: backPermStatus } =
      //   await Location.requestBackgroundPermissionsAsync();
      // if (!backPermGranted) {
      //   let errorMsg = `Permission to access background location was denied, status: ${backPermStatus}`;
      //   setErrorMsg(errorMsg);
      //   //don't return, let it work with foreground
      // }
      //TODO:
      //TaskManager works out of the box in the Expo Go app on Android, however, on iOS, you'll need to use a development build.
      //https://docs.expo.dev/versions/latest/sdk/task-manager/
      //It must be called in the global scope of your JavaScript bundle.
      //In particular, it cannot be called in any of React lifecycle methods like componentDidMount.
      //This limitation is due to the fact that when the application is launched in the background,
      //we need to spin up your JavaScript app, run your task and then shut down —
      //no views are mounted in this scenario.
      // const LOCATION_RECEIVER_TASK = "locationReceiver";
      // TaskManager.defineTask(
      //   LOCATION_RECEIVER_TASK,
      //   async ({ data: { locations }, error }) => {
      //     if (error) {
      //       setErrorMsg(error.message);
      //       return;
      //     }
      //     const {
      //       coords: { latitude, longitude },
      //     } = locations[0];
      //     const { errorMsg } = await updateUserLocationInDB(
      //       latitude,
      //       longitude
      //     );
      //     if (errorMsg) setErrorMsg(errorMsg);
      //   }
      // );
      // await Location.startLocationUpdatesAsync(LOCATION_RECEIVER_TASK, {
      //   accuracy: Location.Accuracy.Highest,
      //   timeInterval: 1000,
      //   distanceInterval: 5,
      //   showsBackgroundLocationIndicator: true,
      //   // foregroundService: {
      //   //   notificationTitle: "Location Tracking",
      //   //   notificationBody: "Tracking your location for routing purposes",
      //   //   notificationColor: "#FF0000",
      //   // },
      //   pausesUpdatesAutomatically: false,
      //   deferredUpdatesInterval: 1000,
      //   deferredUpdatesDistance: 0,
      //   deferredUpdatesTimeout: 1000,
      // });
      return await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          distanceInterval: 5,
          timeInterval: 1000,
        },
        async ({ coords: { latitude, longitude } }) => {
          const { errorMsg } = await updateUserLocationInDB(
            latitude,
            longitude
          );
          if (errorMsg) setErrorMsg(errorMsg);
        }
      );
    })();
    return () => {
      subscriptionPromise.then((subscription) => subscription.remove());
      // Location.stopLocationUpdatesAsync(LOCATION_RECEIVER_TASK);
    };
  }, []);
  return [];
}
