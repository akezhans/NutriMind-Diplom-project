import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import axios from 'axios';
import { Image } from 'react-native';
import { API_BASE_URL } from './config';

const SignUp = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        // 'Italiana': require('../NutriMind/assets/fonts/Italiana-Regular.ttf'),
        // 'Montserrat-Bold': require('../NutriMind/assets/fonts/Montserrat-Bold.ttf'),
        // 'Montserrat-Medium': require('../NutriMind/assets/fonts/Montserrat-Medium.ttf')
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, {
        fullName,
        email,
        password
      });

      console.log('User created:', response.data);
      Alert.alert('Success', 'User registered successfully!');
      navigation.navigate('Login');  // Перенаправление на экран логина после успешной регистрации
    } catch (error) {
      console.error('Error during sign up:', error.response?.data?.error || error.message);
      Alert.alert('Error', error.response?.data?.error || 'Something went wrong');
    }
  };

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
          Sign Up
        </Text>

        <TextInput
          placeholder='Full name'
          placeholderTextColor='#E6E6E6'
          value={fullName}
          onChangeText={setFullName}
          style={{ width: 316, height: 68, backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: 12, borderRadius: 20, marginBottom: 20, color: "white", fontSize: 18, fontFamily: "Montserrat-Medium", }}
        />

        <TextInput
          placeholder='Email'
          placeholderTextColor='#E6E6E6'
          value={email}
          onChangeText={setEmail}
          style={{ width: 316, height: 68, backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: 12, borderRadius: 20, marginBottom: 20, color: "white", fontSize: 18, fontFamily: "Montserrat-Medium", }}
        />

        <TextInput
          placeholder='Password'
          placeholderTextColor='#E6E6E6'
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{ width: 316, height: 68, backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: 12, borderRadius: 20, marginBottom: 70, color: "white", fontSize: 18, fontFamily: "Montserrat-Medium", }}
        />

        <TouchableOpacity 
          onPress={handleSignUp} 
          style={{ backgroundColor: '#5D9C5B', padding: 12, borderRadius: 20, width: 316, height: 68, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 25 }}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginBottom: 30 }}>
          <Text style={{ color: 'white', fontFamily: 'Montserrat-Medium', fontSize: 16 }}>
            Already have an account? <Text style={{ color: '#5D9C5B', fontFamily: 'Montserrat-Bold', fontSize: 16 }}>Login</Text>
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

export default SignUp;
