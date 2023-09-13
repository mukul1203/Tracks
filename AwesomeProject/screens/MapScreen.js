import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { useUsers } from '../utils/hooks/useUsers';
import MapView,{Marker} from 'react-native-maps';
import { exitGroup } from '../utils/hooks/useGroup';
import { useMapRegion } from '../utils/hooks/useMapRegion';

export default function MapScreen({route:{params:{groupId}}, navigation}) {//MapScreen is for an existing group
  const [allUsers] = useUsers(groupId);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion, locationErrorMsg, autoFocus] = useMapRegion(allUsers);
  const onRegionChange = useCallback((inRegion, gesture)=>{
    if(!gesture.isGesture) //FIXME: this won't work for apple maps.
      setRegion(inRegion);
  });

  const getMarkers = ()=>{
    let markers = [];
    for (let userId in allUsers) {
      if (allUsers.hasOwnProperty(userId)) {
        let {latitude=0, longitude=0, email} = allUsers[userId];
        markers.push(
        <Marker
          coordinate={{latitude, longitude}}
          title={email}
          description={JSON.stringify({latitude, longitude})}
          key={userId}
        />
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
      <Text>{Object.keys(allUsers).length}</Text>,
      <MapView key= "Map" style={styles.map} region={region}
      onRegionChange={onRegionChange}>
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
