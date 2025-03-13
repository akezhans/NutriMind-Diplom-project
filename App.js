import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Welcome from './Welcome';
import Login from './Login';
import SignUp from './SignUp';
import HomeScreen from './HomeScreen';
import MyProfile from './MyProfile';
import Recipe from './Recipe';
import Calendar from './Calendar';
import MyProducts from './MyProducts';
import CameraScreen from './CameraScreen';
import Help from './Help';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} setIsAuthenticated={setIsAuthenticated} /> }
        screenOptions={{
          drawerActiveTintColor: '#000000', // Цвет текста активного элемента
          drawerActiveBackgroundColor: '#F6F6F6', // Цвет фона активного элемента
          drawerInactiveTintColor: '#757575', // Цвет текста неактивных элементов
          drawerStyle: { backgroundColor: '#FCFCFC', width: 256 }, // Цвет фона всего меню
        }}>
          <Drawer.Screen name="Dashboard" component={HomeScreen} options={{ drawerIcon: ({ color, size }) => (<Icon name="home-outline" size={size} color={color} />) }} />
          <Drawer.Screen name="My Profile" component={MyProfile} options={{ drawerIcon: ({ color, size }) => (<Icon name="person-outline" size={size} color={color} />) }} />
          <Drawer.Screen name="Recipes" component={Recipe} options={{ drawerIcon: ({ color, size }) => (<Icon name="restaurant-outline" size={size} color={color} />) }} />
          <Drawer.Screen name="Calendar" component={Calendar} options={{ drawerIcon: ({ color, size }) => (<Icon name="calendar-outline" size={size} color={color} />) }} />
          <Drawer.Screen name="My Products" component={MyProducts} options={{ drawerIcon: ({ color, size }) => (<Icon name="cube-outline" size={size} color={color} />) }} />
          <Drawer.Screen name="Scan AI" component={CameraScreen} options={{ drawerIcon: ({ color, size }) => (<Icon name="scan-outline" size={size} color={color} />) }} />
          <Drawer.Screen name="Help" component={Help} options={{ drawerIcon: ({ color, size }) => <Icon name="help-circle-outline" size={size} color={color} /> }} />
        </Drawer.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome">{(props) => <Welcome {...props} setIsAuthenticated={setIsAuthenticated} />}</Stack.Screen>
          <Stack.Screen name="Login">{(props) => <Login {...props} setIsAuthenticated={setIsAuthenticated} />}</Stack.Screen>
          <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.profileSection}>
        <Image source={require('./assets/NMava.jpg')} style={styles.avatar} />
        <Text style={styles.userName}>Akezhan Sailaubekov</Text>
        <Text style={styles.userRole}>Mobile Developer</Text>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem label="Logout Account" icon={({ color, size }) => <Icon name="log-out-outline" size={size} color="red" />} labelStyle={{ color: 'red' }} onPress={() => props.setIsAuthenticated(false)} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userRole: {
    fontSize: 14,
    color: 'gray',
  },
});
