import React from "react";
import { Background } from "../components/Background";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // For phone and email icons

const SignInScreen = ({ navigation }) => {
  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>
        <View style={styles.buttonContainer}>
          {/* Phone Sign In Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Sign In with Phone")}
          >
            <Icon name="phone" size={24} color="white" />
            <Text style={styles.caption}>Sign In with Phone</Text>
          </TouchableOpacity>

          {/* Email Sign In Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Sign In with Email")}
          >
            <Icon name="envelope" size={24} color="white" />
            <Text style={styles.caption}>Sign In with Email</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  button: {
    backgroundColor: "#007AFF", // Blue button background
    padding: 20,
    width: "45%",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 5,
  },
  caption: {
    marginTop: 10,
    fontSize: 14,
    color: "white",
  },
});

export default SignInScreen;
