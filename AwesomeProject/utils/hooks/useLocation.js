import * as Location from 'expo-location';
import { useEffect, useState } from "react";

export function useLocation(initLocation) {
    const [location, setLocation] = useState(initLocation);
    const [errorMsg, setErrorMsg] = useState("");
    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
          let {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({});
          setLocation({latitude, longitude});
        })();
      }, []);

      return [location, errorMsg];
}