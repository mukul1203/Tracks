import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import { useUsers } from "../utils/hooks/useUsers";
import MapView, { Marker } from "react-native-maps";
import { exitGroup } from "../utils/hooks/useGroup";
import { useMapRegion } from "../utils/hooks/useMapRegion";

function generateUniqueColor(inputString) {
  let hash = 0;
  for (let i = 0; i < inputString.length; i++) {
    hash = inputString.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Ensure the generated color has enough contrast with white background
  const color = "#" + ((hash & 0xffffff) | 0xaaaaaa).toString(16);
  return color;
}

export default function MapScreen({
  route: {
    params: { groupId },
  },
  navigation,
}) {
  //MapScreen is for an existing group
  const [errorMsg, setErrorMsg] = useState(null);
  const [allUsers] = useUsers(groupId, setErrorMsg);
  const [region, setRegion, autoFocus] = useMapRegion(allUsers, setErrorMsg);
  //This is wierd, but works.
  //We need to use a ChangeComplete callback, not Change callback
  //and with the isGesture check. Will reason about it later,
  //but for now let it be.
  const onRegionChangeComplete = useCallback((inRegion, { isGesture }) => {
    if (isGesture)
      //FIXME: this won't work for apple maps.
      setRegion(inRegion);
  });

  const getMarkers = () => {
    let markers = [];
    for (let userId in allUsers) {
      if (allUsers.hasOwnProperty(userId)) {
        const { latitude = 0, longitude = 0, email } = allUsers[userId];
        markers.push(
          <Marker
            coordinate={{ latitude, longitude }}
            title={email}
            description={JSON.stringify({ latitude, longitude })}
            key={userId}
          >
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8, // Half of the width and height to make it circular
                backgroundColor: generateUniqueColor(userId),
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 3, // Add a border
                borderColor: "black", // Border color
              }}
            ></View>
          </Marker>
        );
      }
    }
    return markers;
  };
  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : (
        <View style={styles.container}>
          <Button
            title="Exit Group"
            style={styles.button}
            onPress={() => exitGroup(groupId)}
          />
          <Button
            title="Auto Focus"
            style={styles.button}
            onPress={() => autoFocus()}
          />
          <Text>{Object.keys(allUsers).length}</Text>
          <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={onRegionChangeComplete}
          >
            {getMarkers()}
          </MapView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  button: {
    marginTop: 10,
  },
});
