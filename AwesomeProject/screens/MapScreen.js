import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { getAuth, signOut } from 'firebase/auth';
import { useUsers } from '../utils/hooks/useUsers';
import MapView,{Marker} from 'react-native-maps';
import { useLocation } from '../utils/hooks/useLocation';

const auth = getAuth();


export default function MapScreen({route:{params:{groupId}}, navigation}) {//MapScreen is for an existing group
  //TODO: even updateUser need not be here.
  //Just get allUsers data somehow. Responsibility of updation should be hidden inside the useUsers,
  //by using the useLocation internally.
  const initLocation = {latitude: 10, longitude: 10};
  const [allUsers, updateUser] = useUsers({}, groupId);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState(
                                      {
                                        ...initLocation,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421
                                      }
                                      );
  const [location, locationErrorMsg] = useLocation(initLocation);
  if(locationErrorMsg.length) //FIXME
    setErrorMsg(locationErrorMsg);

  useEffect(() => {
    (async () => {
      try {
        await updateUser(location);
      }
      catch(error) {
        setErrorMsg("Update to db failed! " + error.message);
        return;
      }
      setRegion({...region, latitude, longitude});
    })();
  }, [location]);

  const onRegionChange = useCallback((inRegion, gesture)=>{
    if(!gesture.isGesture) //FIXME: this won't work for apple maps.
      setRegion(inRegion);
  });

  const getMarkers = ()=>{
    let markers = [];
    for (let userId in allUsers) {
      if (allUsers.hasOwnProperty(userId)) {
        let {latitude, longitude, email} = allUsers[userId];
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
      <Text>{errorMsg}</Text> :  
      [
      <Button key="Sign Out" title="Sign Out" style={styles.button} onPress={() => signOut(auth)} />,
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
