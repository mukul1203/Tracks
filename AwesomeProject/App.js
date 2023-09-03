import React, { useCallback, useEffect, useState } from 'react';
import MapView,{Marker} from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState({latitude:10, longitude:10});
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState(
                                      {
                                        latitude: 10,
                                        longitude: 10,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421
                                      }
                                      );
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({});
      setLocation({latitude, longitude});
      setRegion({...region, latitude, longitude});
    })();
  }, []);

  const onRegionChange = useCallback((inRegion, gesture)=>{
    if(!gesture.isGesture) //FIXME: this won't work for apple maps.
      setRegion(inRegion);
  });

  return (
    <View style={styles.container}>
      {
      errorMsg ? 
      <Text>errorMsg</Text> : 
      <MapView style={styles.map} region={region}
      onRegionChange={onRegionChange}>
        <Marker
        coordinate={location}
        title="Current location"
        description={JSON.stringify(location)}
        />
      </MapView>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
