import React from "react";
import { getValueFromPath } from "../utils/data/selectors";
import { Marker } from "react-native-maps";
import { View } from "react-native";
import {
  USER_EMAIL,
  USER_ID,
  USER_LATITUDE,
  USER_LONGITUDE,
  USER_NAME,
} from "../utils/data/paths";

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

export const CustomMarker = ({ data }) => {
  const userId = getValueFromPath(data, USER_ID);
  const latitude = getValueFromPath(data, USER_LATITUDE) || 0;
  const longitude = getValueFromPath(data, USER_LONGITUDE) || 0;
  const name = getValueFromPath(data, USER_NAME);
  const email = getValueFromPath(data, USER_EMAIL);
  console.log(`=======> ${latitude}, ${longitude}`);
  return (
    <Marker
      coordinate={{ latitude, longitude }}
      title={`${name}(${email})`}
      description={`${latitude}, ${longitude}`}
      key={userId}
      identifier={userId}
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
};
