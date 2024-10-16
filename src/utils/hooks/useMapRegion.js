import { useEffect, useState } from "react";
import { useLocationEffect } from "./useLocationEffect";
import { getValueFromPath } from "../data/selectors";
import { USER_LATITUDE, USER_LONGITUDE } from "../data/paths";
import { Dimensions } from "react-native";

// Returns region bounding all the user locations + some padding around.
// The region to be displayed by the map.
// The region is defined by the center coordinates and the span of coordinates to display.
// {center_x, center_y, width, height}
// Get screen dimensions
const { width, height } = Dimensions.get("screen");

// Calculate a dynamic latitude/longitude delta based on screen size
const ASPECT_RATIO = width / height;
const MIN_LATITUDE_DELTA = 0.005; // Adjust this as needed
const MIN_LONGITUDE_DELTA = MIN_LATITUDE_DELTA * ASPECT_RATIO; // Maintain aspect ratio
// maybe this should be a based on aspect ration of screen and latitude delta

function getBoundingRegion(locations) {
  const lats = locations.map((loc) => loc.latitude);
  const longs = locations.map((loc) => loc.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLong = Math.min(...longs);
  const maxLong = Math.max(...longs);
  // viewport width and height
  let latitudeDelta = maxLat - minLat;
  let longitudeDelta = maxLong - minLong;
  // padding should vary based on bounding box dimensions. So take a 5th of the longer side of the box.
  const padding = Math.max(latitudeDelta, longitudeDelta) / 5;
  latitudeDelta += padding;
  longitudeDelta += padding;
  latitudeDelta = Math.max(latitudeDelta, MIN_LATITUDE_DELTA);
  longitudeDelta = Math.max(longitudeDelta, MIN_LONGITUDE_DELTA);
  // center point
  const latitude = (maxLat + minLat) / 2;
  const longitude = (maxLong + minLong) / 2;
  return { latitude, longitude, latitudeDelta, longitudeDelta };
}
//ReadWrite hook state
//Maintains a state: region of map to be focussed
//Depends on the various users being shown on map
export function useMapRegion(users, setErrorMsg) {
  const [userOverridden, setUserOverridden] = useState(false);
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 10.0922,
    longitudeDelta: 10.0421,
  });
  const [] = useLocationEffect(setErrorMsg); //TODO: remove this
  const locations = Object.values(users).map((user) => {
    const latitude = getValueFromPath(user, USER_LATITUDE) || 0;
    const longitude = getValueFromPath(user, USER_LONGITUDE) || 0;
    return { latitude, longitude };
  });
  useEffect(() => {
    if (!userOverridden && locations.length != 0)
      setRegion(getBoundingRegion(locations));
  }, [JSON.stringify(locations), userOverridden]);

  const customSetRegion = (region) => {
    setUserOverridden(true);
    setRegion(region);
  };

  const autoFocus = () => {
    setUserOverridden(false);
  };
  return [region, customSetRegion, !userOverridden, autoFocus];
}
