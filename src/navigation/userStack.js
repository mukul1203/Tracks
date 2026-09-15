import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import MapScreen from "../screens/MapScreen";
import SignedInScreen from "../screens/SignedInScreen";
import { useGroup } from "../utils/hooks/useGroup";
import {
  CREATE_GROUP_SCREEN_NAME,
  MAP_SCREEN_NAME,
  SIGNED_IN_SCREEN_NAME,
} from "../screens/screenConstants";
import CreateGroupScreen from "../screens/CreateGroupScreen";
import { navHeader } from "../theme";

const Stack = createStackNavigator();

export default function UserStack() {
  const [groupId] = useGroup(null);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={navHeader}>
        {groupId ? (
          <Stack.Screen
            name={MAP_SCREEN_NAME}
            component={MapScreen}
            initialParams={{ groupId }}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Group>
            <Stack.Screen
              name={SIGNED_IN_SCREEN_NAME}
              component={SignedInScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={CREATE_GROUP_SCREEN_NAME}
              component={CreateGroupScreen}
              options={{ title: "" }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
