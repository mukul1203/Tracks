import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { useUsers } from "../utils/hooks/useUsers";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useMapRegion } from "../utils/hooks/useMapRegion";
import { exitGroup } from "../utils/data/actions";

let color_cache = {};
function generateUniqueColor(inputString: any) {
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  if (!color_cache[inputString]) {
    let hash = 0;
    for (let i = 0; i < inputString.length; i++) {
      hash = inputString.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Ensure the generated color has enough contrast with white background
    const color = "#" + ((hash & 0xffffff) | 0xaaaaaa).toString(16);
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    color_cache[inputString] = color;
  }
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  return color_cache[inputString];
}

export default function MapScreen({
  route: {
    params: { groupId },
  },

  navigation
}: any) {
  //MapScreen is for an existing group
  const [errorMsg, setErrorMsg] = useState(null);
  const [allUsers] = useUsers(groupId, setErrorMsg);
  const [region, setRegion, autoFocus] = useMapRegion(allUsers, setErrorMsg);
  //This is wierd, but works.
  //We need to use a ChangeComplete callback, not Change callback
  //and with the isGesture check. Will reason about it later,
  //but for now let it be.
  // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
  const onRegionChangeComplete = useCallback((inRegion: any, {
    isGesture
  }: any) => {
    if (isGesture)
      //FIXME: this won't work for apple maps.
      // @ts-expect-error TS(2349): This expression is not callable.
      setRegion(inRegion);
  });

  const getMarkers = () => {
    let markers = [];
    for (let userId in allUsers) {
      if (allUsers.hasOwnProperty(userId)) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        const { latitude = 0, longitude = 0, email } = allUsers[userId];
        markers.push(
          // @ts-expect-error TS(2749): 'Marker' refers to a value, but is being used as a... Remove this comment to see the full error message
          <Marker
            // @ts-expect-error TS(2304): Cannot find name 'coordinate'.
            coordinate={{ latitude, longitude }}
            // @ts-expect-error TS(2304): Cannot find name 'title'.
            title={email}
            // @ts-expect-error TS(2304): Cannot find name 'description'.
            description={JSON.stringify({ latitude, longitude })}
            // @ts-expect-error TS(2304): Cannot find name 'key'.
            key={userId}
          >
            <View
              // @ts-expect-error TS(2304): Cannot find name 'style'.
              style={{
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                width: 16,
                // @ts-expect-error TS(2304): Cannot find name 'height'.
                height: 16,
                // @ts-expect-error TS(2304): Cannot find name 'borderRadius'.
                borderRadius: 8, // Half of the width and height to make it circular
                // @ts-expect-error TS(2304): Cannot find name 'backgroundColor'.
                backgroundColor: generateUniqueColor(userId),
                // @ts-expect-error TS(2304): Cannot find name 'justifyContent'.
                justifyContent: "center",
                // @ts-expect-error TS(2304): Cannot find name 'alignItems'.
                alignItems: "center",
                // @ts-expect-error TS(2304): Cannot find name 'borderWidth'.
                borderWidth: 3, // Add a border
                // @ts-expect-error TS(2304): Cannot find name 'borderColor'.
                borderColor: "black", // Border color
              }}
            // @ts-expect-error TS(2365): Operator '<' cannot be applied to types 'boolean' ... Remove this comment to see the full error message
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
      // @ts-expect-error TS(2322): Type 'boolean' is not assignable to type 'View'.
      ) : (
        // @ts-expect-error TS(2552): Cannot find name 'style'. Did you mean 'styles'?
        <View style={styles.container}>
          <MapView
            // @ts-expect-error TS(2304): Cannot find name 'provider'.
            provider={PROVIDER_GOOGLE}
            // @ts-expect-error TS(2552): Cannot find name 'style'. Did you mean 'styles'?
            style={styles.map}
            // @ts-expect-error TS(2304): Cannot find name 'region'.
            region={region}
            // @ts-expect-error TS(2304): Cannot find name 'onRegionChangeComplete'.
            onRegionChangeComplete={onRegionChangeComplete}
          >
            {getMarkers()}
          </MapView>
          // @ts-expect-error TS(2552): Cannot find name 'style'. Did you mean 'styles'?
          <Text style={styles.counter}>{Object.keys(allUsers).length}</Text>
          <Icon
            // @ts-expect-error TS(2588): Cannot assign to 'name' because it is a constant.
            name="close"
            // @ts-expect-error TS(2304): Cannot find name 'type'.
            type="material"
            // @ts-expect-error TS(2304): Cannot find name 'size'.
            size={20}
            // @ts-expect-error TS(2304): Cannot find name 'containerStyle'.
            containerStyle={styles.closeButton}
            // @ts-expect-error TS(2304): Cannot find name 'onPress'.
            onPress={() => exitGroup(groupId)}
          // @ts-expect-error TS(2365): Operator '<' cannot be applied to types 'RegExp' a... Remove this comment to see the full error message
          />
          <Icon
            // @ts-expect-error TS(2588): Cannot assign to 'name' because it is a constant.
            name="crosshairs-gps"
            // @ts-expect-error TS(2304): Cannot find name 'type'.
            type="material-community"
            // @ts-expect-error TS(2304): Cannot find name 'size'.
            size={20}
            // @ts-expect-error TS(2304): Cannot find name 'containerStyle'.
            containerStyle={styles.focusButton}
            // @ts-expect-error TS(2304): Cannot find name 'onPress'.
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
