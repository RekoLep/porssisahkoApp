import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/HomeScreen'
import SettingScreen from './src/SettingScreen'
  
const Tab = createBottomTabNavigator();
  
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Koti" component={HomeScreen} />
        <Tab.Screen name="Asetukset" component={SettingScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}