import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MapScreen from '../screens/MapScreen';
import CreateGroupScreen from '../screens/CreateGroupScreen';

const Stack = createStackNavigator();

export default function UserStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Create Group" component={CreateGroupScreen} />
        <Stack.Screen name="Home" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}