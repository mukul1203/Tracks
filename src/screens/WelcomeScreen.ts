import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import { Background } from "../components/Background";
import { SIGNIN_SCREEN_NAME, SIGNUP_SCREEN_NAME } from "./screenConstants";

const WelcomeScreen = ({
  navigation
}: any) => {
  return (
    // @ts-expect-error TS(2749): 'Background' refers to a value, but is being used ... Remove this comment to see the full error message
    <Background>
      // @ts-expect-error TS(2552): Cannot find name 'style'. Did you mean 'styles'?
      <View style={styles.container}>
        // @ts-expect-error TS(2552): Cannot find name 'style'. Did you mean 'styles'?
        <View style={styles.buttons}>
          // @ts-expect-error TS(2749): 'Button' refers to a value, but is being used as a... Remove this comment to see the full error message
          <Button
            // @ts-expect-error TS(2304): Cannot find name 'title'.
            title="Sign in"
            // @ts-expect-error TS(2304): Cannot find name 'buttonStyle'.
            buttonStyle={styles.button}
            // @ts-expect-error TS(2304): Cannot find name 'onPress'.
            onPress={() => navigation.navigate(SIGNIN_SCREEN_NAME)}
          // @ts-expect-error TS(2365): Operator '<' cannot be applied to types 'RegExp' a... Remove this comment to see the full error message
          />
          <Button
            // @ts-expect-error TS(2304): Cannot find name 'title'.
            title="Sign up"
            // @ts-expect-error TS(2304): Cannot find name 'type'.
            type="outline"
            // @ts-expect-error TS(2304): Cannot find name 'buttonStyle'.
            buttonStyle={styles.button}
            // @ts-expect-error TS(2304): Cannot find name 'onPress'.
            onPress={() => navigation.navigate(SIGNUP_SCREEN_NAME)}
          // @ts-expect-error TS(2365): Operator '<' cannot be applied to types 'boolean' ... Remove this comment to see the full error message
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
    // @ts-expect-error TS(2322): Type '"top"' is not assignable to type '"center" |... Remove this comment to see the full error message
    justifyContent: "top",
  },

  button: {
    marginTop: 10,
  },
});

export default WelcomeScreen;
