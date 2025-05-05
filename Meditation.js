import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';  // Для навигации

const AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; // Замени на своё

export default function MeditationScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [remainingTime, setRemainingTime] = useState(300); // 5 мин
  const [sound, setSound] = useState(null);
  const intervalRef = useRef(null);
  const animationRef = useRef(null);

  const navigation = useNavigation();  // Для навигации

  const startMeditation = async () => {
    try {
      setIsPlaying(true);

      // Загружаем аудио
      const { sound: playbackObject } = await Audio.Sound.createAsync(
        { uri: AUDIO_URL },
        { shouldPlay: true }
      );
      setSound(playbackObject);

      // Анимация
      animationRef.current?.play();

      // Запускаем таймер
      intervalRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            stopMeditation();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Ошибка при запуске медитации:', err);
    }
  };

  const stopMeditation = async () => {
    setIsPlaying(false);
    animationRef.current?.reset();
    clearInterval(intervalRef.current);
    setRemainingTime(300);
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' + s : s}`;
  };

  return (
    <View style={styles.container}>
      {/* Кнопка назад */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>Медитация</Text>

      <LottieView
        ref={animationRef}
        source={require('./breath.json')} // гифка дыхания
        style={styles.animation}
        loop
      />

      <Text style={styles.breathText}>Вдох — 4 сек | Выдох — 6 сек</Text>

      <Text style={styles.timer}>{formatTime(remainingTime)}</Text>

      <TouchableOpacity
        onPress={isPlaying ? stopMeditation : startMeditation}
        style={[styles.button, { backgroundColor: isPlaying ? '#dc3545' : '#007bff' }]}
      >
        <Text style={styles.buttonText}>
          {isPlaying ? 'Остановить' : 'Медитировать 5 мин'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,  // Чтобы кнопка не перекрывала другие элементы
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  animation: {
    width: 300,
    height: 300,
  },
  breathText: {
    fontSize: 16,
    marginTop: 10,
    color: '#555',
  },
  timer: {
    fontSize: 40,
    fontWeight: '600',
    marginVertical: 20,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
