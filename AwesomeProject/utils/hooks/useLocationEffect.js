import * as Location from "expo-location";
import { useEffect } from "react";
import { updateUser } from "./useUsers";
import {
  registerLocationListener,
  requestLocationPermissions,
  startLocationUpdatesAsync,
} from "../../services/location";

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
      const { fgResponse, bgResponse, errorMsg } =
        await requestLocationPermissions();
      if (errorMsg) {
        setErrorMsg(errorMsg);
        return;
      }
      return startLocationUpdatesAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 5,
        timeInterval: 1000,
      });
    })();
    const unregisterLocationListener = registerLocationListener(
      async (latitude, longitude, error) => {
        if (error?.message) {
          setErrorMsg(errorMsg);
          return;
        }
        const { errorMsg } = await updateUserLocationInDB(latitude, longitude);
        if (errorMsg) setErrorMsg(errorMsg);
      }
    );
    return () => {
      unregisterLocationListener();
      subscriptionPromise.then((stopFn) => stopFn());
    };
  }, []);
  return [];
}
