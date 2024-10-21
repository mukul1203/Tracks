import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { useUsers } from "../utils/hooks/useUsers";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { exitGroup } from "../utils/data/actions";
import { getValueFromPath } from "../utils/data/selectors";
import { USER_ID } from "../utils/data/paths";
import { useLocationEffect } from "../utils/hooks/useLocationEffect";
import { CustomMarker } from "../components/MapCustomMarker";
import {
  H_PADDING,
  LATITUDE,
  LATITUDE_DELTA,
  LONGITUDE,
  LONGITUDE_DELTA,
  V_PADDING,
} from "./screenConstants";

export default function MapScreen({
  route: {
    params: { groupId },
  },
  navigation,
}) {
  //MapScreen is for an existing group
  const [errorMsg, setErrorMsg] = useState(null);
  const [allUsers] = useUsers(groupId, setErrorMsg);
  const [autofocus, setAutoFocus] = useState(true);
  const mapviewRef = useRef(null);
  const [] = useLocationEffect(setErrorMsg);
  useEffect(() => {
    if (autofocus)
      mapviewRef.current?.fitToSuppliedMarkers(Object.keys(allUsers), {
        animated: true,
        edgePadding: {
          top: V_PADDING,
          left: H_PADDING,
          bottom: V_PADDING,
          right: H_PADDING,
        },
      });
  }, [allUsers]);
  const onRegionChange = useCallback((inRegion, { isGesture }) => {
    // console.log(`region: ${JSON.stringify(inRegion)}`);
    if (isGesture) setAutoFocus(false);
  });

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : (
        <View style={styles.container}>
          <MapView
            ref={mapviewRef}
            initialRegion={{
              latitude: LATITUDE,
              longitude: LONGITUDE,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            onRegionChange={onRegionChange}
          >
            {Object.values(allUsers).map((user) => (
              <CustomMarker data={user} key={getValueFromPath(user, USER_ID)} />
            ))}
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
            onPress={() => setAutoFocus(true)}
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
