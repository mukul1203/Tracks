import React, { useState } from "react";
import { EmailPasswordInput } from "./EmailPasswordInput";
import { Input } from "react-native-elements";
import { userSignUp } from "../utils/data/actions";
import { StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export const SignUpForm = () => {
  const [name, setName] = useState("");
  // @ts-expect-error TS(2322): Type 'boolean' is not assignable to type 'View'.
  return (
    // @ts-expect-error TS(2304): Cannot find name 'style'.
    <View style={styles.container}>
      // @ts-expect-error TS(2749): 'Input' refers to a value, but is being used as a ... Remove this comment to see the full error message
      <Input
        // @ts-expect-error TS(2304): Cannot find name 'placeholder'.
        placeholder="Name"
        // @ts-expect-error TS(2304): Cannot find name 'containerStyle'.
        containerStyle={styles.control}
        // @ts-expect-error TS(2304): Cannot find name 'style'.
        style={styles.text}
        // @ts-expect-error TS(2304): Cannot find name 'value'.
        value={name}
        // @ts-expect-error TS(2304): Cannot find name 'onChangeText'.
        onChangeText={setName}
        // @ts-expect-error TS(2304): Cannot find name 'leftIcon'.
        leftIcon={<Icon name="user" size={16} color="white" />}
      // @ts-expect-error TS(2365): Operator '<' cannot be applied to types 'RegExp' a... Remove this comment to see the full error message
      />
      <EmailPasswordInput
        // @ts-expect-error TS(2304): Cannot find name 'title'.
        title={"Sign Up"}
        // @ts-expect-error TS(2304): Cannot find name 'onDonePress'.
        onDonePress={(email, password) => userSignUp(name, email, password)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
  },

  controls: {
    flex: 1,
  },

  control: {
    marginTop: 10,
  },

  text: {
    color: "white",
  },
  error: {
    marginTop: 10,
    padding: 10,
    color: "#fff",
    backgroundColor: "#D54826FF",
  },
});
