import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
  
} from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeScreen from './src/HomeScreen';
import SettingScreen from './src/SettingScreen';

export type RootTabParamList = {
  Koti: undefined;
  Asetukset: undefined;
};

// Luodaan tyypitetty tab-navigaattori
const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarLabelStyle: { fontSize: 12 },
        }}
      >
        <Tab.Screen
          name="Koti"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: 22 }}>{'⚡'}</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Asetukset"
          component={SettingScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: 22 }}>{'⚙️'}</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
