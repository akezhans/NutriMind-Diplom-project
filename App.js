import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Импорт экранов
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
import RecipeDetailsScreen from './RecipeDetailsScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack setIsAuthenticated={setIsAuthenticated} />}
    </NavigationContainer>
  );
}

// **Стек для авторизации**
function AuthStack({ setIsAuthenticated }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome">{(props) => <Welcome {...props} setIsAuthenticated={setIsAuthenticated} />}</Stack.Screen>
      <Stack.Screen name="Login">{(props) => <Login {...props} setIsAuthenticated={setIsAuthenticated} />}</Stack.Screen>
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}

// **Drawer (боковое меню)**
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: '#000000',
        drawerActiveBackgroundColor: '#F6F6F6',
        drawerInactiveTintColor: '#757575',
        drawerStyle: { backgroundColor: '#FCFCFC', width: 256 },
      }}
    >
      <Drawer.Screen name="Dashboard" component={HomeScreen} options={{ drawerIcon: ({ color, size }) => (<Icon name="home-outline" size={size} color={color} />) }} />
      <Drawer.Screen name="My Profile" component={MyProfile} options={{ drawerIcon: ({ color, size }) => (<Icon name="person-outline" size={size} color={color} />) }} />
      <Drawer.Screen name="Recipes" component={Recipe} options={{ drawerIcon: ({ color, size }) => (<Icon name="restaurant-outline" size={size} color={color} />) }} />
      <Drawer.Screen name="Calendar" component={Calendar} options={{ drawerIcon: ({ color, size }) => (<Icon name="calendar-outline" size={size} color={color} />) }} />
      <Drawer.Screen name="My Products" component={MyProducts} options={{ drawerIcon: ({ color, size }) => (<Icon name="cube-outline" size={size} color={color} />) }} />
      <Drawer.Screen name="Scan AI" component={CameraScreen} options={{ drawerIcon: ({ color, size }) => (<Icon name="scan-outline" size={size} color={color} />) }} />
      <Drawer.Screen name="Help" component={Help} options={{ drawerIcon: ({ color, size }) => <Icon name="help-circle-outline" size={size} color={color} /> }} />
    </Drawer.Navigator>
  );
}

// **Главный стек с Drawer + RecipeDetails**
function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Боковое меню */}
      <Stack.Screen name="Main" component={DrawerNavigator} />

      {/* Вложенный экран рецепта */}
      <Stack.Screen name="RecipeDetails" component={RecipeDetailsScreen} />
    </Stack.Navigator>
  );
}

// **Кастомное боковое меню**
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.profileSection}>
        <Image source={require('./assets/NMava.jpg')} style={styles.avatar} />
        <Text style={styles.userName}>Akezhan Sailaubekov</Text>
        <Text style={styles.userRole}>Mobile Developer</Text>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem 
        label="Logout Account" 
        icon={({ size }) => <Icon name="log-out-outline" size={size} color="red" />} 
        labelStyle={{ color: 'red' }} 
        onPress={() => props.navigation.reset({ index: 0, routes: [{ name: "Welcome" }] })} 
      />
    </DrawerContentScrollView>
  );
}

// **Стили**
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
