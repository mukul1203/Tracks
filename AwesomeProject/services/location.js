import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

//https://docs.expo.dev/versions/latest/sdk/task-manager/
//It must be called in the global scope of your JavaScript bundle.
//In particular, it cannot be called in any of React lifecycle methods like componentDidMount.
//This limitation is due to the fact that when the application is launched in the background,
//we need to spin up your JavaScript app, run your task and then shut down —
//no views are mounted in this scenario.

const locationListeners = [];
const unregisterListener = (fn) => {
  console.log("Unregistering location listener");
  const index = locationListeners.findIndex((val, index) => val == fn);
  if (index != -1) locationListeners.splice(index, 1);
};
export const registerLocationListener = (fn) => {
  console.log("Registering location listener");
  locationListeners.push(fn);
  return () => unregisterListener(fn);
};

const LOCATION_RECEIVER_TASK = "mainLocationReceiver";
TaskManager.defineTask(
  LOCATION_RECEIVER_TASK,
  ({ data: { locations }, error }) => {
    const {
      coords: { latitude, longitude },
    } = locations[0];
    console.log(`latitude: ${latitude}, longitude:${longitude}`);
    locationListeners.forEach((fn) => fn(latitude, longitude, error));
  }
);

export const startLocationUpdatesAsync = async ({
  accuracy,
  timeInterval,
  distanceInterval,
}) => {
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
    deferredUpdatesInterval: 1000,
    deferredUpdatesDistance: 0,
    deferredUpdatesTimeout: 1000,
  });
  return () => {
    console.log("Stopping location updates async");
    Location.stopLocationUpdatesAsync(LOCATION_RECEIVER_TASK);
  };
};

export const requestLocationPermissions = async () => {
  let errorMsg = null;
  let bgResponse;
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
