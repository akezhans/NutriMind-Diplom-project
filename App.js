import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

// Импорт экранов
import Welcome from './Welcome';
import Login from './Login';
import SignUp from './SignUp';
import Main from './Main';
import HomeScreen from './HomeScreen';
import MyProfile from './MyProfile';
import Recipe from './Recipe';
import Calendar from './Calendar';
import MyProducts from './MyProducts';
import AiScannerPage from './AiScannerPage';
// import Help from './Help';
import RecipeDetailsScreen from './RecipeDetailsScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Проверка токена при запуске приложения
  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync('token');  // Проверяем, есть ли токен
      if (token) {
        setIsAuthenticated(true);  // Если есть токен, ставим isAuthenticated в true
      } else {
        setIsAuthenticated(false); // Если нет токена, ставим false
      }
    };

    checkToken();
  }, []);

  return (
    <NavigationContainer>
      {isAuthenticated
        ? <AppStack setIsAuthenticated={setIsAuthenticated} />
        : <AuthStack setIsAuthenticated={setIsAuthenticated} />
      }
    </NavigationContainer>
  );
}

// Стек для авторизации
function AuthStack({ setIsAuthenticated }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login">
        {(props) => <Login {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}

// Главное меню (Drawer)
function DrawerNavigator({ setIsAuthenticated }) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} setIsAuthenticated={setIsAuthenticated} />
      )}
      screenOptions={{
        drawerActiveTintColor: '#000000',
        drawerActiveBackgroundColor: '#F6F6F6',
        drawerInactiveTintColor: '#757575',
        drawerStyle: { backgroundColor: '#FCFCFC', width: 256 },
      }}
    >
      <Drawer.Screen name="Dashboard" component={Main} options={{ drawerIcon: ({ color, size }) => (<Icon name="home-outline" size={size} color={color} />) }} />
      <Drawer.Screen name="Plan" component={HomeScreen} options={{ drawerIcon: ({ color, size }) => (<Icon name="list-outline" size={size} color={color} />) }} />
      <Drawer.Screen name="MyProfile" component={MyProfile} options={{ drawerIcon: ({ color, size }) => (<Icon name="person-outline" size={size} color={color} />) }} />
      <Drawer.Screen name="Recipes" component={Recipe} options={{ drawerIcon: ({ color, size }) => (<Icon name="restaurant-outline" size={size} color={color} />) }} />
      {/* <Drawer.Screen name="Calendar" component={Calendar} options={{ drawerIcon: ({ color, size }) => (<Icon name="calendar-outline" size={size} color={color} />) }} /> */}
      <Drawer.Screen name="MyProducts" component={MyProducts} options={{ drawerIcon: ({ color, size }) => (<Icon name="cube-outline" size={size} color={color} />) }} />
      <Drawer.Screen name="Scanner" component={AiScannerPage} options={{ drawerIcon: ({ color, size }) => (<Icon name="scan-outline" size={size} color={color} />) }} />
      {/* <Drawer.Screen name="Help" component={Help} options={{ drawerIcon: ({ color, size }) => <Icon name="help-circle-outline" size={size} color={color} /> }} /> */}
    </Drawer.Navigator>
  );
}

// Главный стек с Drawer + RecipeDetails
function AppStack({ setIsAuthenticated }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root">
        {(props) => <DrawerNavigator {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen name="RecipeDetails" component={RecipeDetailsScreen} />
    </Stack.Navigator>
  );
}

// Кастомное боковое меню с Logout
function CustomDrawerContent(props) {
  const { setIsAuthenticated } = props;

  const handleLogout = async () => {
    try {
      // Отправка запроса на сервер для выхода
      await axios.post(`${API_BASE_URL}/signout`, {}, { withCredentials: true });
      await SecureStore.deleteItemAsync('token');
      await AsyncStorage.removeItem('isAuthenticated');
      setIsAuthenticated(false);  // Сбрасываем состояние аутентификации
    } catch (err) {
      console.error('Ошибка при выходе:', err);
    }
  };

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
        onPress={handleLogout} 
      />
    </DrawerContentScrollView>
  );
}

// Стили
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
