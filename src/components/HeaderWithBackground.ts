import { ImageBackground, StyleSheet } from "react-native";
import { Text } from "react-native-elements";

export const HeaderWithBackground = () => {
  return (
    <ImageBackground
      source={require("../assets/splash.png")} // Replace with your image source
      style={styles.backgroundImage}
    >
      {/* Add any other components you want in the header */}
      {/* For example, you can include a title */}
      <Text style={styles.headerTitle}>Tracks</Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // You can adjust the resizeMode as needed
    justifyContent: "center", // Center content vertically if necessary
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});
