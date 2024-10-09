import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import WelcomeScreen from "../screens/WelcomeScreen";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import {
  SIGNIN_SCREEN_NAME,
  SIGNUP_SCREEN_NAME,
  WELCOME_SCREEN_NAME,
} from "../screens/screenConstants";

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    // @ts-expect-error TS(2749): 'NavigationContainer' refers to a value, but is be... Remove this comment to see the full error message
    <NavigationContainer>
      // @ts-expect-error TS(2503): Cannot find namespace 'Stack'.
      <Stack.Navigator>
        // @ts-expect-error TS(2503): Cannot find namespace 'Stack'.
        <Stack.Screen name={WELCOME_SCREEN_NAME} component={WelcomeScreen} />
        // @ts-expect-error TS(2503): Cannot find namespace 'Stack'.
        <Stack.Screen name={SIGNIN_SCREEN_NAME} component={SignInScreen} />
        // @ts-expect-error TS(2503): Cannot find namespace 'Stack'.
        <Stack.Screen name={SIGNUP_SCREEN_NAME} component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
