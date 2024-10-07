import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Icon, Input } from "react-native-elements";

export const PhoneNumberInput = ({ title, onDonePress }) => {
  const [value, setValue] = useState({ phoneNumber: "", error: "" });
  return (
    <View style={styles.container}>
      {!!value.error && (
        <View style={styles.error}>
          <Text>{value.error}</Text>
        </View>
      )}
      <View style={styles.controls}>
        <Input
          placeholder="Phone number"
          containerStyle={styles.control}
          style={styles.text}
          value={value.phoneNumber}
          onChangeText={(text) => setValue({ ...value, phoneNumber: text })}
          leftIcon={<Icon name="phone" size={16} color="white" />}
        />

        <Button
          title={title}
          buttonStyle={styles.control}
          onPress={async () => {
            try {
              await onDonePress(value.phoneNumber);
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

export const VerificationCodeInput = ({ title, onDonePress }) => {
  const [value, setValue] = useState({ code: "", error: "" });
  return (
    <View style={styles.container}>
      {!!value.error && (
        <View style={styles.error}>
          <Text>{value.error}</Text>
        </View>
      )}
      <View style={styles.controls}>
        <Input
          placeholder="Please enter the OTP"
          containerStyle={styles.control}
          style={styles.text}
          value={value.code}
          onChangeText={(text) => setValue({ ...value, code: text })}
        />

        <Button
          title={title}
          buttonStyle={styles.control}
          onPress={async () => {
            try {
              await onDonePress(value.code);
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
