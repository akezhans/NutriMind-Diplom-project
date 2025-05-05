import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, FlatList, Image, Modal, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const bodyParts = {
  Руки: [
    { name: 'Отжимания', image: require('./assets/pushup.png') },
    { name: 'Бицепс сгибания', image: 'https://avatars.dzeninfra.ru/get-zen_doc/1590365/pub_5ed91f29548cab7b06ab7320_5ed92f5c30d6be048de19a4a/scale_1200' },
  ],
  Ноги: [
    { name: 'Приседания', image: 'https://avatars.dzeninfra.ru/get-zen_doc/1590365/pub_5ed91f29548cab7b06ab7320_5ed92f5c30d6be048de19a4a/scale_1200' },
    { name: 'Выпады', image: 'https://avatars.dzeninfra.ru/get-zen_doc/1590365/pub_5ed91f29548cab7b06ab7320_5ed92f5c30d6be048de19a4a/scale_1200' },
  ],
  Пресс: [
    { name: 'Скручивания', image: 'https://avatars.dzeninfra.ru/get-zen_doc/1590365/pub_5ed91f29548cab7b06ab7320_5ed92f5c30d6be048de19a4a/scale_1200' },
    { name: 'Планка', image: 'https://avatars.dzeninfra.ru/get-zen_doc/1590365/pub_5ed91f29548cab7b06ab7320_5ed92f5c30d6be048de19a4a/scale_1200' },
  ],
}; 


const randomWorkout = [
  '20 приседаний, 15 отжиманий, 30 секунд планки',
  '15 выпадов на каждую ногу, 10 отжиманий',
  '30 прыжков на месте, 20 скручиваний',
];

export default function WorkoutScreen() {
  const [dailyWorkout, setDailyWorkout] = useState('');
  const [rounds, setRounds] = useState(0);
  const [bodyPart, setBodyPart] = useState('');
  const [customType, setCustomType] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [history, setHistory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

const navigation = useNavigation();


  useEffect(() => {
    const index = Math.floor(Math.random() * randomWorkout.length);
    setDailyWorkout(randomWorkout[index]);
    loadHistory();
  }, []);

  const startWorkout = () => setRounds((prev) => prev + 1);

  const addCustomWorkout = async () => {
    if (!customType || !customTime) {
      Alert.alert('Заполните тип и продолжительность');
      return;
    }
    const newEntry = {
      date: new Date().toLocaleDateString(),
      type: customType,
      time: customTime,
      note: customNote,
    };
    const updated = [newEntry, ...history];
    setHistory(updated);
    await AsyncStorage.setItem('workoutHistory', JSON.stringify(updated));
    setCustomType('');
    setCustomTime('');
    setCustomNote('');
    setModalVisible(false);
  };

  const loadHistory = async () => {
    const data = await AsyncStorage.getItem('workoutHistory');
    if (data) setHistory(JSON.parse(data));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>
      <Text style={[styles.title, {marginTop: 70} ]}>Спорт</Text>

      {/* Тренировка дня */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🔥 Тренировка дня</Text>
        <Text style={styles.text}>{dailyWorkout}</Text>
        <TouchableOpacity style={styles.button} onPress={startWorkout}>
          <Text style={styles.buttonText}>Начать тренировку</Text>
        </TouchableOpacity>
        {rounds > 0 && <Text style={styles.text}>Подходов: {rounds}</Text>}
      </View>

      {/* Части тела */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>💪 Части тела</Text>
        <View style={styles.bodyRow}>
          {Object.keys(bodyParts).map((part) => (
            <TouchableOpacity
              key={part}
              style={[
                styles.bodyBtn,
                bodyPart === part && { backgroundColor: '#4caf50' },
              ]}
              onPress={() => setBodyPart(part)}
            >
              <Text style={styles.btnText}>{part}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {bodyPart ? (
          <FlatList
            data={bodyParts[bodyPart]}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <View style={styles.exerciseItem}>
                <Image source={item.image} style={styles.exerciseImg} />
                <Text>{item.name}</Text>
              </View>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        ) : null}
      </View>

      {/* Ручное добавление */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>✍️ Добавить тренировку</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
          <Text style={styles.buttonText}>Добавить вручную</Text>
        </TouchableOpacity>
      </View>

      {/* История */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📆 История тренировок</Text>
        {history.map((item, i) => (
          <View key={i} style={styles.historyItem}>
            <Text style={styles.text}>{item.date} — {item.type} ({item.time} мин)</Text>
            {item.note ? <Text style={styles.note}>💬 {item.note}</Text> : null}
          </View>
        ))}
      </View>

      {/* Модальное окно */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Новая тренировка</Text>
            <TextInput
              placeholder="Тип тренировки"
              value={customType}
              onChangeText={setCustomType}
              style={styles.input}
            />
            <TextInput
              placeholder="Продолжительность (мин)"
              value={customTime}
              onChangeText={setCustomTime}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Заметка"
              value={customNote}
              onChangeText={setCustomNote}
              style={styles.input}
            />
            <View style={styles.modalBtnRow}>
              <TouchableOpacity onPress={addCustomWorkout} style={styles.modalBtn}>
                <Text style={styles.buttonText}>Сохранить</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.modalBtn, { backgroundColor: '#ccc' }]}>
                <Text style={styles.buttonText}>Отмена</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f2f2f2' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    elevation: 2,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,  
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  text: { fontSize: 15, marginBottom: 6 },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  bodyRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  bodyBtn: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  btnText: { fontWeight: '500' },
  exerciseItem: { alignItems: 'center', marginRight: 15 },
  exerciseImg: { width: 80, height: 80, resizeMode: 'contain', marginBottom: 5 },
  historyItem: { marginBottom: 8 },
  note: { fontStyle: 'italic', color: '#666' },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 14 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  modalBtnRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  modalBtn: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 10,
  },
});
