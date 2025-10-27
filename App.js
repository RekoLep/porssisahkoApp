import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeScreen from './src/HomeScreen';
import SettingScreen from './src/SettingScreen';

const Tab = createBottomTabNavigator();

export default function App() {
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
              <Text style={{ fontSize: 22 }}>
                {'🏠'}
              </Text>
            ),
          }}
        />
        <Tab.Screen 
          name="Asetukset" 
          component={SettingScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: 22 }}>
                {'⚙️'}
              </Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
