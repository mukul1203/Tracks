import React, { useState } from "react";
import { EmailPasswordInput } from "./EmailPasswordInput";
import { Input } from "react-native-elements";
import { userSignUp } from "../utils/data/actions";
import { StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors, spacing } from "../theme";

export const SignUpForm = () => {
  const [name, setName] = useState("");
  return (
    <View style={styles.container}>
      <Input
        placeholder="Name"
        placeholderTextColor={colors.textMuted}
        containerStyle={styles.control}
        style={styles.text}
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        autoCorrect={false}
        textContentType="name"
        autoComplete="name"
        leftIcon={<Icon name="user" size={16} color={colors.textMuted} />}
      />
      <EmailPasswordInput
        title={"Sign Up"}
        onDonePress={(email, password) =>
          userSignUp(name.trim(), email, password)
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "stretch",
  },
  control: {
    marginTop: spacing.sm,
  },
  text: {
    color: colors.text,
  },
});
