import { ImageBackground, StyleSheet } from "react-native";
import { Text } from "react-native-elements";

export const HeaderWithBackground = () => {
  return (
    <ImageBackground
      // @ts-expect-error TS(2304): Cannot find name 'source'.
      source={require("../assets/splash.png")} // Replace with your image source
      // @ts-expect-error TS(2552): Cannot find name 'style'. Did you mean 'styles'?
      style={styles.backgroundImage}
    >
      {/* Add any other components you want in the header */}
      {/* For example, you can include a title */}
      // @ts-expect-error TS(2552): Cannot find name 'style'. Did you mean 'styles'?
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
