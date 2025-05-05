// HabitsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import * as Progress from 'react-native-progress';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';



export default function HabitsScreen() {
  const [weight, setWeight] = useState('');
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal, setWaterGoal] = useState(2000); // мл
  const [dailyGoal, setDailyGoal] = useState('Сделать 15 минут зарядки');
  const [affirmation, setAffirmation] = useState('Ты справишься с любыми трудностями!');
  const [mood, setMood] = useState(null); // '😊' | '😐' | '😢'

    const navigation = useNavigation(); 
  

  const calculateWaterGoal = (kg) => {
    return Math.round(kg * 30); // 30мл на 1кг
  };

  const handleSetWeight = (text) => {
    setWeight(text);
    const parsed = parseFloat(text);
    if (!isNaN(parsed)) {
      setWaterGoal(calculateWaterGoal(parsed));
    }
  };

  const handleAddWater = (ml) => {
    setWaterIntake((prev) => Math.min(prev + ml, waterGoal));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

     <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
       <Ionicons name="arrow-back" size={28} color="#333" />       
    </TouchableOpacity>               

      <Text style={[styles.title, {marginTop: 70} ]}>Привычки</Text>

      {/* Цель дня */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🎯 Цель дня</Text>
        <Text style={styles.goalText}>{dailyGoal}</Text>
      </View>

      {/* Вода */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>💧 Вода</Text>
        <Text style={styles.label}>Вес (кг):</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={handleSetWeight}
          keyboardType="numeric"
          placeholder="Введите вес"
        />
        <Text style={styles.progressText}>
          {waterIntake} мл / {waterGoal} мл
        </Text>
        <Progress.Bar
          progress={waterIntake / waterGoal}
          width={null}
          color="#4da6ff"
          height={14}
          borderRadius={10}
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.waterBtn} onPress={() => handleAddWater(200)}>
            <Text style={styles.btnText}>+200 мл</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.waterBtn} onPress={() => handleAddWater(300)}>
            <Text style={styles.btnText}>+300 мл</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Настроение */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🙂 Настроение</Text>
        <View style={styles.moodRow}>
          {['😊', '😐', '😢'].map((face) => (
            <TouchableOpacity key={face} onPress={() => setMood(face)}>
              <Text style={[styles.moodEmoji, mood === face && styles.selectedMood]}>
                {face}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Аффирмация */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>💬 Аффирмация дня</Text>
        <Text style={styles.affirmation}>{affirmation}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1, 
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  goalText: {
    fontSize: 16,
    color: '#444',
  },
  label: {
    fontSize: 14,
    marginTop: 8,
    color: '#666',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 6,
    fontSize: 16,
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#444',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  waterBtn: {
    backgroundColor: '#4da6ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  moodEmoji: {
    fontSize: 34,
  },
  selectedMood: {
    textShadowColor: '#4da6ff',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  affirmation: {
    fontSize: 16,
    color: '#555',
    fontStyle: 'italic',
    marginTop: 6,
  },
});
