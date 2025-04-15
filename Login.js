import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ setIsAuthenticated }) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const BASE_URL = 'http://172.20.10.2:8080'; // Замени на свой актуальный IP

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Italiana': require('../NutriMind/assets/fonts/Italiana-Regular.ttf'),
        'Montserrat-Bold': require('../NutriMind/assets/fonts/Montserrat-Bold.ttf'),
        'Montserrat-Medium': require('../NutriMind/assets/fonts/Montserrat-Medium.ttf')
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/signin`, { email, password });

      if (response.data && response.data.message === "Login successful") {
        console.log("Login successful:", response.data);
        setIsAuthenticated(true);
      } else {
        Alert.alert("Login failed", response.data.message || "Unknown error");
      }      
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login failed", "Invalid email or password");
    }
  };

  if (!fontsLoaded) return null;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackground 
        source={require('../NutriMind/assets/NMfon3.jpg')} 
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 40, left: 20 }}>
          <Image source={require('../NutriMind/assets/Back.png')} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>

        <Text style={{ fontSize: 40, color: '#6CBA69', marginBottom: 80, marginTop: 110, fontFamily: 'Montserrat-Bold' }}>
          Login
        </Text>

        <TextInput
          placeholder='Email'
          placeholderTextColor='#E6E6E6'
          value={email}
          onChangeText={setEmail}
          style={{
            width: 316,
            height: 68,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: 12,
            borderRadius: 20,
            marginBottom: 20,
            color: "white",
            fontSize: 18,
            fontFamily: "Montserrat-Medium"
          }}
        />

        <TextInput
          placeholder='Password'
          placeholderTextColor='#E6E6E6'
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{
            width: 316,
            height: 68,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: 12,
            borderRadius: 20,
            marginBottom: 70,
            color: "white",
            fontSize: 18,
            fontFamily: "Montserrat-Medium"
          }}
        />

        <TouchableOpacity 
          onPress={handleLogin}
          style={{
            backgroundColor: '#5D9C5B',
            padding: 12,
            borderRadius: 20,
            width: 316,
            height: 68,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 25 }}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={{ marginBottom: 30 }}>
          <Text style={{ color: 'white', fontFamily: 'Montserrat-Medium', fontSize: 16 }}>
            Don't have an account? <Text style={{ color: '#5D9C5B', fontFamily: 'Montserrat-Bold', fontSize: 16 }}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <TouchableOpacity style={{ marginHorizontal: 30 }}>
            <Image source={require('../NutriMind/assets/Google.png')} style={{ width: 32, height: 32 }} />
          </TouchableOpacity>

          <TouchableOpacity style={{ marginHorizontal: 30 }}>
            <Image source={require('../NutriMind/assets/facebook.png')} style={{ width: 32, height: 32 }} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

export default Login;
