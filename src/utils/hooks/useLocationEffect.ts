import * as Location from "expo-location";
import { useEffect } from "react";
import {
  registerLocationListener,
  requestLocationPermissions,
  startLocationUpdatesAsync,
} from "../../services/location";
import { updateUserLocation } from "../data/actions";

export function useLocationEffect(setErrorMsg: any) {
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
      async (latitude: any, longitude: any, error: any) => {
        console.log(`latitude:${latitude} longitude:${longitude}`);
        if (error?.message) {
          // @ts-expect-error TS(2448): Block-scoped variable 'errorMsg' used before its d... Remove this comment to see the full error message
          setErrorMsg(errorMsg);
          return;
        }
        const { errorMsg } = await updateUserLocation(latitude, longitude);
        if (errorMsg) setErrorMsg(errorMsg);
      }
    );
    return () => {
      unregisterLocationListener();
      // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
      subscriptionPromise.then((stopFn) => stopFn());
    };
  }, []);
  return [];
}
