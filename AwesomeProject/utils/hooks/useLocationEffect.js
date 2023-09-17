import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { updateUser } from "./useUsers";

export async function updateUserLocationInDB(latitude, longitude) {
  try {
    await updateUser({ latitude, longitude });
  } catch (error) {
    let errorMsg = "Update to db failed! " + error.message;
    return { errorMsg };
  }
  return {};
}

export function useLocationEffect() {
  const [errorMsg, setErrorMsg] = useState("");
  useEffect(() => {
    const subscriptionPromise = (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync({});
      if (status !== "granted") {
        let errorMsg = "Permission to access location was denied";
        setErrorMsg(errorMsg);
        return;
      }
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
    };
  }, []);
  return [errorMsg];
}
