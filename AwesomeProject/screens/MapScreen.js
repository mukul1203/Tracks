import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { useUsers } from '../utils/hooks/useUsers';
import MapView,{Marker} from 'react-native-maps';
import { exitGroup } from '../utils/hooks/useGroup';
import { useMapRegion } from '../utils/hooks/useMapRegion';

function getBackgroundColor(latitude, longitude) {
  //TODO: this should be fixed for a given user!
  // Normalize latitude and longitude values to the range [0, 1]
  const normalizedLatitude = (latitude + 90) / 180;
  const normalizedLongitude = (longitude + 180) / 360;

  // Map location to hue (0 to 360 degrees)
  const hue = normalizedLatitude * normalizedLongitude * 360;

  // Set saturation and lightness values to constants or adjust as needed
  const saturation = 70; // You can adjust this value
  const lightness = 50;  // You can adjust this value

  // Convert HSL to RGB color
  const hslColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  return hslColor;
}

export default function MapScreen({route:{params:{groupId}}, navigation}) {//MapScreen is for an existing group
  const [allUsers] = useUsers(groupId);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion, locationErrorMsg, autoFocus] = useMapRegion(allUsers);
  //This is wierd, but works.
  //We need to use a ChangeComplete callback, not Change callback
  //and with the isGesture check. Will reason about it later,
  //but for now let it be.
  const onRegionChangeComplete = useCallback((inRegion, {isGesture})=>{
    if(isGesture) //FIXME: this won't work for apple maps.
      setRegion(inRegion);
  });

  const getMarkers = ()=>{
    let markers = [];
    for (let userId in allUsers) {
      if (allUsers.hasOwnProperty(userId)) {
        const {latitude=0, longitude=0, email} = allUsers[userId];
        markers.push(
        <Marker
          coordinate={{latitude, longitude}}
          title={email}
          description={JSON.stringify({latitude, longitude})}
          key={userId}
        >
          <View style={{
            width: 16,
            height: 16,
            borderRadius: 8, // Half of the width and height to make it circular
            backgroundColor: getBackgroundColor(latitude, longitude),
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 3, // Add a border
            borderColor: 'black', // Border color
          }}>
          </View>
        </Marker>
        );
      }
    }
    return markers;
  };
  return (
    <View style={styles.container}>
      {
      errorMsg ? 
      <Text>{errorMsg}</Text>:
      [
      <Button key="Exit Group" title="Exit Group" style={styles.button} onPress={() => exitGroup(groupId)} />,
      <Button key="Auto Focus" title="Auto Focus" style={styles.button} onPress={() => autoFocus()} />,
      <Text key="Counter">{Object.keys(allUsers).length}</Text>,
      <MapView key= "Map" style={styles.map} region={region}
      onRegionChangeComplete={onRegionChangeComplete}>
      { getMarkers() }
      </MapView>
      ]
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
  button: {
    marginTop: 10
  }
});
