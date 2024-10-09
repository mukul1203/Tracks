import React from "react";
import { View, ImageBackground, StyleSheet } from "react-native";

export const Background = ({
  children
}: any) => {
  return (
    <ImageBackground
      // @ts-expect-error TS(2304): Cannot find name 'source'.
      source={require("../assets/earth.jpeg")} // Replace with your image source
      // @ts-expect-error TS(2552): Cannot find name 'style'. Did you mean 'styles'?
      style={styles.backgroundImage}
    >
      // @ts-expect-error TS(2552): Cannot find name 'style'. Did you mean 'styles'?
      <View style={styles.overlay}>{children}</View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // You can adjust the resizeMode as needed
  },
  overlay: {
    flex: 1,
    // backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
    padding: 16, // Adjust padding as needed
  },
});
