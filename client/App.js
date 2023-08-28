import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/home';
import RecogniseFoodScreen from './screens/recogfood';
import ScanMenuScreen from './screens/scanmenu';
import FoodDetailsScreen from './screens/foodDetails';
import MenuDetailsScreen from './screens/menudetails';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen name="RecogniseFood" component={RecogniseFoodScreen} options={{ title: 'Recognise Food' }}/>
        <Stack.Screen name="ScanMenu" component={ScanMenuScreen} options={{ title: 'Scan Menu' }} />
        <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} options={{ title: 'Food Details' }} />
        <Stack.Screen name="MenuDetails" component={MenuDetailsScreen} options={{ title: 'Menu Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
