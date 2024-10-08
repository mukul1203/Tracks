import React, { useState } from "react";
import { EmailPasswordInput } from "./EmailPasswordInput";
import { Input } from "react-native-elements";
import { userSignUp } from "../utils/data/actions";
import { StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export const SignUpForm = () => {
  const [name, setName] = useState("");
  return (
    <View style={styles.container}>
      <Input
        placeholder="Name"
        containerStyle={styles.control}
        style={styles.text}
        value={name}
        onChangeText={setName}
        leftIcon={<Icon name="user" size={16} color="white" />}
      />
      <EmailPasswordInput
        title={"Sign Up"}
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
