import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { useEffect, useState } from "react";
import { useLocationEffect } from "./useLocationEffect";

function getBoundingRegion(locations) {
  const padding = 0.0001;
  const lats = locations.map((loc) => loc.latitude);
  const longs = locations.map((loc) => loc.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLong = Math.min(...longs);
  const maxLong = Math.max(...longs);
  const latitudeDelta = maxLat - minLat + 2 * padding;
  const longitudeDelta = maxLong - minLong + 2 * padding;
  const latitude = (maxLat + minLat) / 2;
  const longitude = (maxLong + minLong) / 2;
  return { latitude, longitude, latitudeDelta, longitudeDelta };
}
//ReadWrite hook state
//Maintains a state: region of map to be focussed
//Depends on the various users being shown on map
export function useMapRegion(users) {
  const [userOverridden, setUserOverridden] = useState(false);
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 10.0922,
    longitudeDelta: 10.0421,
  });
  const [errorMsg] = useLocationEffect({ latitude: 0, longitude: 0 }); //TODO: remove this
  const locations = Object.keys(users).map((key) => {
    //user entry may not yet have lat long values, so default to 0
    const { latitude = 0, longitude = 0 } = users[key];
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
  return [region, customSetRegion, errorMsg, autoFocus];
}
