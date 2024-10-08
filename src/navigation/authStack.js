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
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name={WELCOME_SCREEN_NAME} component={WelcomeScreen} />
        <Stack.Screen name={SIGNIN_SCREEN_NAME} component={SignInScreen} />
        <Stack.Screen name={SIGNUP_SCREEN_NAME} component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
