import React from "react";
import { View, ImageBackground, StyleSheet } from "react-native";

export const Background = ({ children }) => {
  return (
    <ImageBackground
      source={require("../assets/earth.jpeg")} // Replace with your image source
      style={styles.backgroundImage}
    >
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
