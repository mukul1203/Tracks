import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { useUsers } from "../utils/hooks/useUsers";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { exitGroup } from "../utils/data/actions";
import { getValueFromPath } from "../utils/data/selectors";
import { USER_ID, USER_LATITUDE, USER_LONGITUDE } from "../utils/data/paths";
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
  // only users with a real location fix belong on the map; a missing fix or a
  // (0,0) default would otherwise drop a phantom marker in the ocean
  const locatedUsers = Object.values(allUsers).filter((user) => {
    const latitude = getValueFromPath(user, USER_LATITUDE);
    const longitude = getValueFromPath(user, USER_LONGITUDE);
    return (
      typeof latitude === "number" &&
      typeof longitude === "number" &&
      !(latitude === 0 && longitude === 0)
    );
  });
  const regionRef = useRef(null);
  const fitToUsers = () => {
    if (locatedUsers.length === 0) return;
    mapviewRef.current?.fitToSuppliedMarkers(
      locatedUsers.map((user) => getValueFromPath(user, USER_ID)),
      {
        animated: true,
        edgePadding: {
          top: V_PADDING,
          left: H_PADDING,
          bottom: V_PADDING,
          right: H_PADDING,
        },
      }
    );
  };
  // Re-fit the camera only when a tracked user has moved outside the current
  // viewport (or on first fix / membership change). Fitting on every location
  // update fought the marker's own coordinate animation and made markers jitter.
  useEffect(() => {
    if (!autofocus) return;
    const region = regionRef.current;
    const anyOutside = locatedUsers.some((user) => {
      if (!region) return true;
      const latitude = getValueFromPath(user, USER_LATITUDE);
      const longitude = getValueFromPath(user, USER_LONGITUDE);
      return (
        Math.abs(latitude - region.latitude) > region.latitudeDelta / 2 ||
        Math.abs(longitude - region.longitude) > region.longitudeDelta / 2
      );
    });
    if (anyOutside) fitToUsers();
  }, [allUsers, autofocus]);
  const onRegionChangeComplete = useCallback((region, { isGesture }) => {
    regionRef.current = region;
    if (isGesture) setAutoFocus(false);
  }, []);

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
            onRegionChangeComplete={onRegionChangeComplete}
          >
            {locatedUsers.map((user) => (
              <CustomMarker data={user} key={getValueFromPath(user, USER_ID)} />
            ))}
          </MapView>
          {locatedUsers.length === 0 && (
            <View style={styles.waiting} pointerEvents="none">
              <ActivityIndicator size="large" />
              <Text style={styles.waitingText}>Waiting for locations…</Text>
            </View>
          )}
          <Text style={styles.counter}>{locatedUsers.length}</Text>
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
            onPress={() => {
              setAutoFocus(true);
              fitToUsers();
            }}
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
  waiting: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  waitingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#333",
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
