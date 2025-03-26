import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const StepTimer = ({ timeInSeconds }) => {
  const [timeLeft, setTimeLeft] = useState(timeInSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      clearInterval(timer);
      setIsRunning(false);
      Alert.alert('⏰ Время вышло!', 'Шаг завершен.');
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handlePress = () => {
    if (isRunning) {
      setIsRunning(false);
      setTimeLeft(timeInSeconds);
    } else {
      setIsRunning(true);
    }
  };

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>{timeLeft} сек</Text>
      <TouchableOpacity onPress={handlePress} style={styles.timerButton}>
        <Text style={styles.buttonText}>{isRunning ? '⏹' : '▶'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  timerText: { fontSize: 14, color: '#555', marginRight: 5 },
  timerButton: { padding: 5, backgroundColor: '#EEE', borderRadius: 5 },
  buttonText: { fontSize: 14, color: '#333' }
});

export default StepTimer;
