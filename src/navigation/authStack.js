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
import { navHeader } from "../theme";

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={navHeader}>
        <Stack.Screen
          name={WELCOME_SCREEN_NAME}
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SIGNIN_SCREEN_NAME}
          component={SignInScreen}
          options={{ title: "Sign in" }}
        />
        <Stack.Screen
          name={SIGNUP_SCREEN_NAME}
          component={SignUpScreen}
          options={{ title: "Create account" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
