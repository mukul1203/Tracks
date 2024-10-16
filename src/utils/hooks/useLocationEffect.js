import * as Location from "expo-location";
import { useEffect } from "react";
import {
  registerLocationListener,
  requestLocationPermissions,
  startLocationUpdatesAsync,
} from "../../services/location";
import { updateUserLocation } from "../data/actions";

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
        // console.log(`latitude:${latitude} longitude:${longitude}`);
        if (error?.message) {
          setErrorMsg(errorMsg);
          return;
        }
        const { errorMsg } = await updateUserLocation(latitude, longitude);
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
