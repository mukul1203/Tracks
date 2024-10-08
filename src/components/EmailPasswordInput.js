import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button, Input } from "react-native-elements";

export const EmailPasswordInput = ({ title, onDonePress }) => {
  const [value, setValue] = React.useState({
    email: "",
    password: "",
    error: "",
  });

  return (
    <View style={styles.container}>
      {!!value.error && (
        <View style={styles.error}>
          <Text>{value.error}</Text>
        </View>
      )}
      <View style={styles.controls}>
        <Input
          placeholder="Email"
          containerStyle={styles.control}
          style={styles.text}
          value={value.email}
          onChangeText={(text) => setValue({ ...value, email: text })}
          leftIcon={<Icon name="envelope" size={16} color="white" />}
        />

        <Input
          placeholder="Password"
          containerStyle={styles.control}
          style={styles.text}
          value={value.password}
          onChangeText={(text) => setValue({ ...value, password: text })}
          secureTextEntry={true}
          leftIcon={<Icon name="key" size={16} color="white" />}
        />
        <Button
          title={title}
          buttonStyle={styles.control}
          onPress={async () => {
            try {
              await onDonePress(value.email, value.password);
            } catch (error) {
              setValue({
                ...value,
                error: error.message,
              });
            }
          }}
        />
      </View>
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
