import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUsers } from "../utils/hooks/useUsers";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { exitGroup } from "../utils/data/actions";
import { getValueFromPath } from "../utils/data/selectors";
import { USER_ID, USER_LATITUDE, USER_LONGITUDE } from "../utils/data/paths";
import { useLocationEffect } from "../utils/hooks/useLocationEffect";
import { CustomMarker } from "../components/MapCustomMarker";
import { colors, radius, spacing } from "../theme";
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
  const insets = useSafeAreaInsets();
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

  const confirmExit = () =>
    Alert.alert("Leave group?", "You'll stop sharing your location here.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Leave",
        style: "destructive",
        onPress: () => exitGroup(groupId),
      },
    ]);

  const count = locatedUsers.length;

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <View style={styles.errorBox}>
          <Icon name="error-outline" type="material" size={40} color={colors.danger} />
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
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

          {count === 0 && (
            <View style={styles.waiting} pointerEvents="none">
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.waitingText}>Waiting for locations…</Text>
            </View>
          )}

          {/* Live count pill */}
          <View style={[styles.pill, { top: insets.top + spacing.sm }]}>
            <Icon name="people" type="material" size={16} color={colors.text} />
            <Text style={styles.pillText}>
              {count === 0
                ? "No one visible"
                : `${count} ${count === 1 ? "person" : "people"}`}
            </Text>
          </View>

          {/* Controls */}
          <View style={[styles.controls, { top: insets.top + spacing.sm }]}>
            <Icon
              name="crosshairs-gps"
              type="material-community"
              size={22}
              color={colors.textOnLight}
              containerStyle={styles.controlButton}
              onPress={() => {
                setAutoFocus(true);
                fitToUsers();
              }}
            />
            <Icon
              name="logout"
              type="material-community"
              size={22}
              color={colors.danger}
              containerStyle={styles.controlButton}
              onPress={confirmExit}
            />
          </View>
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
  pill: {
    position: "absolute",
    left: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceSolid,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  pillText: {
    color: colors.text,
    fontWeight: "600",
    marginLeft: spacing.xs,
  },
  controls: {
    position: "absolute",
    right: spacing.md,
    alignItems: "center",
  },
  controlButton: {
    backgroundColor: colors.text,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  waiting: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  waitingText: {
    marginTop: spacing.sm,
    fontSize: 16,
    color: colors.textOnLight,
    fontWeight: "600",
  },
  errorBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  errorText: {
    marginTop: spacing.sm,
    fontSize: 15,
    color: colors.textOnLight,
    textAlign: "center",
  },
});
