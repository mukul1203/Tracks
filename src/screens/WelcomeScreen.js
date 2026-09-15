import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import { Background } from "../components/Background";
import { colors, radius, spacing } from "../theme";
import { SIGNIN_SCREEN_NAME, SIGNUP_SCREEN_NAME } from "./screenConstants";

const WelcomeScreen = ({ navigation }) => {
  return (
    <Background>
      <View style={styles.container}>
        <View style={styles.brand}>
          <Text style={styles.title}>Tracks</Text>
          <Text style={styles.tagline}>
            See your people on the map, live.
          </Text>
        </View>
        <View style={styles.buttons}>
          <Button
            title="Sign in"
            buttonStyle={styles.button}
            titleStyle={styles.buttonTitle}
            containerStyle={styles.buttonContainer}
            onPress={() => navigation.navigate(SIGNIN_SCREEN_NAME)}
          />
          <Button
            title="Create an account"
            type="outline"
            buttonStyle={styles.buttonOutline}
            titleStyle={styles.buttonOutlineTitle}
            containerStyle={styles.buttonContainer}
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
    justifyContent: "space-between",
    paddingVertical: spacing.xl,
  },
  brand: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: 1,
  },
  tagline: {
    marginTop: spacing.sm,
    fontSize: 16,
    color: colors.textMuted,
    textAlign: "center",
  },
  buttons: {
    alignItems: "stretch",
  },
  buttonContainer: {
    marginTop: spacing.sm,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  buttonTitle: {
    fontWeight: "700",
  },
  buttonOutline: {
    borderColor: colors.text,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  buttonOutlineTitle: {
    color: colors.text,
    fontWeight: "700",
  },
});

export default WelcomeScreen;
