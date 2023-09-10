import * as Location from 'expo-location';
import { useEffect, useState } from "react";
import { updateUser } from './useUsers';

//This is not used anywhere, but is necessary to send current user location to DB
//Decouple this. 
//Maybe have a function to sendUserLocation(), that gets scheduled when map screen comes,
//and gets cleared when map screen dies. Something in its useEffect? 
export function useLocation(initLocation) {
    const [location, setLocation] = useState(initLocation);
    const [errorMsg, setErrorMsg] = useState("");
    useEffect(() => {
        const updateCurrentLocation = async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
          let {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({});
          try {
            setLocation({latitude, longitude});//TODO, should not need this
            await updateUser({latitude, longitude});
          }
          catch(error) {
            setErrorMsg("Update to db failed! " + error.message);
            return;
          }
        };
        updateCurrentLocation();
      }, []);

      return [location, errorMsg];
}