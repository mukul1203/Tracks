import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";
import { Background } from "../components/Background";

const WelcomeScreen = ({ navigation }) => {
  return (
    <Background>
      <View style={styles.container}>
        <View style={styles.buttons}>
          <Button
            title="Sign in"
            buttonStyle={styles.button}
            onPress={() => navigation.navigate("Sign In")}
          />
          <Button
            title="Sign up"
            type="outline"
            buttonStyle={styles.button}
            onPress={() => navigation.navigate("Sign Up")}
          />
        </View>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  buttons: {
    flex: 1,
    alignItems: "center",
    justifyContent: "top",
  },

  button: {
    marginTop: 10,
  },
});

export default WelcomeScreen;
