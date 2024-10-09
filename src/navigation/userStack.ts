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

const Stack = createStackNavigator();

export default function UserStack() {
  // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
  const [groupId] = useGroup(null);
  return (
    // @ts-expect-error TS(2749): 'NavigationContainer' refers to a value, but is be... Remove this comment to see the full error message
    <NavigationContainer>
      // @ts-expect-error TS(2503): Cannot find namespace 'Stack'.
      <Stack.Navigator>
        {groupId ? (
          <Stack.Screen
            name={MAP_SCREEN_NAME}
            component={MapScreen}
            initialParams={{ groupId }}
          />
        ) : (
          // @ts-expect-error TS(2503): Cannot find namespace 'Stack'.
          <Stack.Group>
            // @ts-expect-error TS(2503): Cannot find namespace 'Stack'.
            <Stack.Screen
              name={SIGNED_IN_SCREEN_NAME}
              // @ts-expect-error TS(2304): Cannot find name 'component'.
              component={SignedInScreen}
            />
            // @ts-expect-error TS(2503): Cannot find namespace 'Stack'.
            <Stack.Screen
              name={CREATE_GROUP_SCREEN_NAME}
              // @ts-expect-error TS(2304): Cannot find name 'component'.
              component={CreateGroupScreen}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
