import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import { Background } from "../components/Background";
import { SIGNIN_SCREEN_NAME, SIGNUP_SCREEN_NAME } from "./screenConstants";

const WelcomeScreen = ({ navigation }) => {
  return (
    <Background>
      <View style={styles.container}>
        <View style={styles.buttons}>
          <Button
            title="Sign in"
            buttonStyle={styles.button}
            onPress={() => navigation.navigate(SIGNIN_SCREEN_NAME)}
          />
          <Button
            title="Sign up"
            type="outline"
            buttonStyle={styles.button}
            onPress={() => navigation.navigate(SIGNUP_SCREEN_NAME)}
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
