import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { useUsers } from "../utils/hooks/useUsers";
import MapView, {
  AnimatedRegion,
  Marker,
  MarkerAnimated,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { useMapRegion } from "../utils/hooks/useMapRegion";
import { exitGroup } from "../utils/data/actions";
import { getValueFromPath } from "../utils/data/selectors";
import {
  USER_EMAIL,
  USER_ID,
  USER_LATITUDE,
  USER_LONGITUDE,
  USER_NAME,
} from "../utils/data/paths";

const ANIMATION_DURATION = 1000; // 1 second, for both region and marker animations
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
const CustomMarker = ({ user }) => {
  const markerRef = useRef(null);
  const latitude = getValueFromPath(user, USER_LATITUDE) || 0;
  const longitude = getValueFromPath(user, USER_LONGITUDE) || 0;
  const coordinateRef = useRef(null);
  if (coordinateRef.current === null) {
    coordinateRef.current = new AnimatedRegion({
      latitude,
      longitude,
    });
  }
  const name = getValueFromPath(user, USER_NAME);
  const email = getValueFromPath(user, USER_EMAIL);
  const userId = getValueFromPath(user, USER_ID);
  console.log(`=======> ${latitude}, ${longitude}`);
  useEffect(() => {
    const newCoordinate = { latitude, longitude };
    if (Platform.OS === "android") {
      markerRef?._component.animateMarkerToCoordinate(
        newCoordinate,
        ANIMATION_DURATION
      );
    } else {
      // `useNativeDriver` defaults to false if not passed explicitly
      // Would have preferred native animation instead of js, but setting it true
      // throws some error I haven't yet figured out a fix for. So keeping it false for the
      // time being.
      console.log(`*************** animation STARTED`);
      coordinateRef.current
        .timing({
          ...newCoordinate,
          useNativeDriver: false,
          duration: ANIMATION_DURATION,
        })
        .start(({ finished }) => {
          /* completion callback */
          console.log(`**************** animation finished: ${finished}`);
        });
    }
    return () => {
      coordinateRef.current.stopAnimation((stopped_at_region) => {
        console.log(
          `stopped animation at ${JSON.stringify(stopped_at_region)}`
        );
        coordinateRef.current.setValue({
          ...stopped_at_region,
          ...newCoordinate,
        });
      });
    };
  }, [latitude, longitude]);
  return (
    <Marker.Animated
      ref={markerRef}
      coordinate={coordinateRef.current}
      title={`${name}(${email})`}
      description={`${latitude}, ${longitude}`}
      key={userId}
      tracksViewChanges={false}
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
    </Marker.Animated>
  );
};

export default function MapScreen({
  route: {
    params: { groupId },
  },
  navigation,
}) {
  //MapScreen is for an existing group
  const [errorMsg, setErrorMsg] = useState(null);
  const [allUsers] = useUsers(groupId, setErrorMsg);
  const [region, setRegion, autoFocus, setAutoFocus] = useMapRegion(
    allUsers,
    setErrorMsg
  );
  // const animatedRegion = useRef(new AnimatedRegion(region)).current;
  const mapviewRef = useRef(null);
  useEffect(() => {
    // animate only in auto mode, not when user has taken control by panning
    // setTimeout(() => {
    if (autoFocus)
      mapviewRef.current?.animateToRegion(region, ANIMATION_DURATION);
    // }, 0);
    // if (autoFocus) {
    //   animatedRegion
    //     .timing({
    //       region,
    //       duration: ANIMATION_DURATION, // Smooth animation over 1 second
    //       useNativeDriver: false,
    //     })
    //     .start();
    // }
  }, [region, autoFocus]);
  // console.log(`region: ${JSON.stringify(region)}`);
  //This is wierd, but works.
  //We need to use a ChangeComplete callback, not Change callback
  //and with the isGesture check. Will reason about it later,
  //but for now let it be.
  const onRegionChange = useCallback((inRegion, { isGesture }) => {
    // console.log(`region: ${JSON.stringify(inRegion)}`);
    if (isGesture)
      //FIXME: this won't work for apple maps.
      setRegion(inRegion);
  });

  const getMarkers = () => {
    return Object.values(allUsers).map((user) => (
      <CustomMarker user={user} key={getValueFromPath(user, USER_ID)} />
    ));
  };
  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : (
        <View style={styles.container}>
          <MapView
            ref={mapviewRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            // region={region}
            onRegionChangeComplete={onRegionChange}
            // onRegionChange={onRegionChange}
            followsUserLocation={false}
            onUserLocationChange={(event) => {
              console.log(
                `user location changed ${event.coordinate.latitude},${event.coordinate.longitude}`
              );
            }}
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
            onPress={() => setAutoFocus()}
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
