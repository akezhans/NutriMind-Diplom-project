import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

// Импорт экранов
import Welcome from './Welcome';
import SignUp from './SignUp';
import Login from './Login'
import Home from './HomeScreen';
import WaterCalculator from './WaterCalculator';
import BarcodeScanner from './CameraScreen';
import Calendar from './Calendar';
import Recipe from './Recipe';
import MyProducts from './MyProducts';

// Создаем навигаторы
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// 📌 Вкладки внизу (Bottom Tabs)
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'WaterCalculator') {
            iconName = focused ? 'water' : 'water-outline';
          } else if (route.name === 'BarcodeScanner') {
            iconName = focused ? 'scan' : 'scan-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="WaterCalculator" component={WaterCalculator} />
      <Tab.Screen name="BarcodeScanner" component={BarcodeScanner} />
    </Tab.Navigator>
  );
}

// 📌 Боковое меню (Drawer Navigation)
function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Menu" component={TabNavigator} />
      <Drawer.Screen name="Calendar" component={Calendar} />
      <Drawer.Screen name="Recipe" component={Recipe} />
      <Drawer.Screen name="MyProducts" component={MyProducts} />
    </Drawer.Navigator>
  );
}

// 📌 Главный стек навигации
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen
        name = "Welcome"
        component={Welcome}
        options={{ headerShown: false }} 
        />
        <Stack.Screen 
        name="SignUp" 
        component={SignUp} 
        options={{ headerShown: false }} 
        />
        <Stack.Screen
        name = "Login"
        component={Login}
        options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Main"
          component={DrawerNavigator} 
          options={{ headerShown: false }} 
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// 📌 Стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
