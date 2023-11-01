import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { useUsers } from "../utils/hooks/useUsers";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { exitGroup } from "../utils/hooks/useGroup";
import { useMapRegion } from "../utils/hooks/useMapRegion";

let color_cache = {};
function generateUniqueColor(inputString) {
  if (!color_cache[inputString]) {
    let hash = 0;
    for (let i = 0; i < inputString.length; i++) {
      hash = inputString.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Ensure the generated color has enough contrast with white background
    const color = "#" + ((hash & 0xffffff) | 0xaaaaaa).toString(16);
    color_cache[inputString] = color;
  }
  return color_cache[inputString];
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
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={region}
            onRegionChangeComplete={onRegionChangeComplete}
          >
            {getMarkers()}
          </MapView>
          <Text style={styles.counter}>{Object.keys(allUsers).length}</Text>
          <Icon
            name="close"
            type="material"
            size={20}
            containerStyle={styles.closeButton}
            onPress={() => exitGroup(groupId)}
          />
          <Icon
            name="crosshairs-gps"
            type="material-community"
            size={20}
            containerStyle={styles.focusButton}
            onPress={() => autoFocus()}
          />
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
  counter: {
    position: "absolute",
    top: "1%",
    left: "1%",
    backgroundColor: "yellow",
  },
  closeButton: {
    position: "absolute",
    top: "1%",
    right: "3%",
  },
  focusButton: {
    position: "absolute",
    top: "7%",
    right: "3%",
  },
});
