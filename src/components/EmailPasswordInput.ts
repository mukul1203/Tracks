import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button, Input } from "react-native-elements";

export const EmailPasswordInput = ({
  title,
  onDonePress
}: any) => {
  const [value, setValue] = React.useState({
    email: "",
    password: "",
    error: "",
  });

  // @ts-expect-error TS(2322): Type 'boolean' is not assignable to type 'View'.
  return (
    // @ts-expect-error TS(2304): Cannot find name 'style'.
    <View style={styles.container}>
      {!!value.error && (
        // @ts-expect-error TS(2304): Cannot find name 'style'.
        <View style={styles.error}>
          // @ts-expect-error TS(2352): Conversion of type '{ value: { email: string; pass... Remove this comment to see the full error message
          <Text>{value.error}</Text>
        </View>
      )}
      // @ts-expect-error TS(2552): Cannot find name 'style'. Did you mean 'styles'?
      <View style={styles.controls}>
        // @ts-expect-error TS(2749): 'Input' refers to a value, but is being used as a ... Remove this comment to see the full error message
        <Input
          // @ts-expect-error TS(2304): Cannot find name 'placeholder'.
          placeholder="Email"
          // @ts-expect-error TS(2304): Cannot find name 'containerStyle'.
          containerStyle={styles.control}
          // @ts-expect-error TS(2304): Cannot find name 'style'.
          style={styles.text}
          // @ts-expect-error TS(2304): Cannot find name 'value'.
          value={value.email}
          // @ts-expect-error TS(2304): Cannot find name 'onChangeText'.
          onChangeText={(text) => setValue({ ...value, email: text })}
          // @ts-expect-error TS(2304): Cannot find name 'leftIcon'.
          leftIcon={<Icon name="envelope" size={16} color="white" />}
        // @ts-expect-error TS(2365): Operator '<' cannot be applied to types 'RegExp' a... Remove this comment to see the full error message
        />

        <Input
          // @ts-expect-error TS(2304): Cannot find name 'placeholder'.
          placeholder="Password"
          // @ts-expect-error TS(2304): Cannot find name 'containerStyle'.
          containerStyle={styles.control}
          // @ts-expect-error TS(2304): Cannot find name 'style'.
          style={styles.text}
          // @ts-expect-error TS(2304): Cannot find name 'value'.
          value={value.password}
          // @ts-expect-error TS(2304): Cannot find name 'onChangeText'.
          onChangeText={(text) => setValue({ ...value, password: text })}
          // @ts-expect-error TS(2304): Cannot find name 'secureTextEntry'.
          secureTextEntry={true}
          // @ts-expect-error TS(2304): Cannot find name 'leftIcon'.
          leftIcon={<Icon name="key" size={16} color="white" />}
        // @ts-expect-error TS(2365): Operator '<' cannot be applied to types 'RegExp' a... Remove this comment to see the full error message
        />
        <Button
          // @ts-expect-error TS(2304): Cannot find name 'title'.
          title={title}
          // @ts-expect-error TS(2304): Cannot find name 'buttonStyle'.
          buttonStyle={styles.control}
          // @ts-expect-error TS(2304): Cannot find name 'onPress'.
          onPress={async () => {
            try {
              // @ts-expect-error TS(2304): Cannot find name 'onDonePress'.
              await onDonePress(value.email, value.password);
            } catch (error) {
              // @ts-expect-error TS(2304): Cannot find name 'setValue'.
              setValue({
                // @ts-expect-error TS(2304): Cannot find name 'value'.
                ...value,
                // @ts-expect-error TS(2571): Object is of type 'unknown'.
                error: error.message,
              });
            }
          }}
        // @ts-expect-error TS(2365): Operator '<' cannot be applied to types 'boolean' ... Remove this comment to see the full error message
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
