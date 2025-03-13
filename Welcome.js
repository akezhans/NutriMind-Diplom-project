import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import { Image } from 'react-native';

const Welcome = () => {
  const navigation = useNavigation();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  

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

  if (!fontsLoaded) {
    return null; // Пока шрифты не загрузились, ничего не показываем
  }

  return (
    <ImageBackground 
      source={require('../NutriMind/assets/NMfon3.jpg')} 
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
    >
      <Text style={{ fontSize: 40, color: '#5D9C5B', marginBottom: 90, marginTop: 110, fontFamily: 'Montserrat-Bold' }}>
        Get Started
      </Text>
      
      <Text style={{ fontSize: 32, textAlign: 'center', color: 'white', marginBottom: 130, fontFamily: 'Italiana' }}>
        Make Smarter Food{'\n'}
        Choices and Discover {'\n'}
        New Recipes {'\n'}
        Effortlessly!
      </Text>
      
      <TouchableOpacity 
        onPress={() => navigation.navigate('SignUp')} 
        style={{ backgroundColor: '#5D9C5B', padding: 12, justifyContent: 'center', borderRadius: 20, width: 316, height: 68, marginBottom: 20 }}
      >
        <Text style={{ color: 'white',fontFamily: 'Montserrat-Bold',textAlign: 'center', fontSize: 25 }}>Sign Up</Text>
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
  );
};

export default Welcome;
