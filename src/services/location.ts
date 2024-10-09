import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

//https://docs.expo.dev/versions/latest/sdk/task-manager/
//It must be called in the global scope of your JavaScript bundle.
//In particular, it cannot be called in any of React lifecycle methods like componentDidMount.
//This limitation is due to the fact that when the application is launched in the background,
//we need to spin up your JavaScript app, run your task and then shut down —
//no views are mounted in this scenario.

const locationListeners: any = [];
const unregisterListener = (fn: any) => {
  console.log("Unregistering location listener");
  // @ts-expect-error TS(7006): Parameter 'val' implicitly has an 'any' type.
  const index = locationListeners.findIndex((val, index) => val == fn);
  if (index != -1) locationListeners.splice(index, 1);
};
export const registerLocationListener = (fn: any) => {
  console.log("Registering location listener");
  locationListeners.push(fn);
  return () => unregisterListener(fn);
};

const LOCATION_RECEIVER_TASK = "mainLocationReceiver";
TaskManager.defineTask(
  LOCATION_RECEIVER_TASK,
  // @ts-expect-error TS(2339): Property 'locations' does not exist on type 'unkno... Remove this comment to see the full error message
  ({ data: { locations }, error }) => {
    const {
      coords: { latitude, longitude },
    } = locations[0];
    console.log(`latitude: ${latitude}, longitude:${longitude}`);
    // @ts-expect-error TS(7006): Parameter 'fn' implicitly has an 'any' type.
    locationListeners.forEach((fn) => fn(latitude, longitude, error));
  }
);

export const startLocationUpdatesAsync = async ({
  accuracy,
  timeInterval,
  distanceInterval
}: any) => {
  console.log("Start location updates async");
  await Location.startLocationUpdatesAsync(LOCATION_RECEIVER_TASK, {
    accuracy,
    timeInterval,
    distanceInterval,
    showsBackgroundLocationIndicator: true,
    //somehow foregroundService is needed to
    //make background location tracking work
    //REVISIT
    foregroundService: {
      notificationTitle: "Location Tracking",
      notificationBody: "Tracking your location for routing purposes",
      notificationColor: "#FF0000",
    },
    pausesUpdatesAutomatically: false,
    deferredUpdatesInterval: 0,
    deferredUpdatesDistance: 0,
    deferredUpdatesTimeout: 0,
  });
  return () => {
    console.log("Stopping location updates async");
    Location.stopLocationUpdatesAsync(LOCATION_RECEIVER_TASK);
  };
};

export const requestLocationPermissions = async () => {
  let errorMsg = null;
  let bgResponse;
  // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
  const fgResponse = await Location.requestForegroundPermissionsAsync({});
  const { granted: fgGranted, status: fgStatus } = fgResponse;

  if (!fgGranted) {
    errorMsg = `Permission to access foreground location was denied, status: ${fgStatus}`;
  } else {
    bgResponse = await Location.requestBackgroundPermissionsAsync();
    const { granted: bgGranted, status: bgStatus } = bgResponse;
    if (!bgGranted) {
      errorMsg = `Permission to access background location was denied, status: ${bgStatus}`;
    }
  }
  return { fgResponse, bgResponse, errorMsg };
};
