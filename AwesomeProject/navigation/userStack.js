import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import MapScreen from "../screens/MapScreen";
import CreateGroupScreen from "../screens/CreateGroupScreen";
import SignedInScreen from "../screens/SignedInScreen";
import { useGroup } from "../utils/hooks/useGroup";

const Stack = createStackNavigator();

export default function UserStack() {
  const [groupId] = useGroup(null);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {groupId ? (
          <Stack.Screen
            name="Map"
            component={MapScreen}
            initialParams={{ groupId }}
          />
        ) : (
          <Stack.Group>
            <Stack.Screen name="Signed In" component={SignedInScreen} />
            <Stack.Screen name="Create Group" component={CreateGroupScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
