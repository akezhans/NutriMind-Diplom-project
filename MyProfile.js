import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Text,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';
import { API_BASE_URL } from './config';

export default function ProfileScreen() {
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [weightRecords, setWeightRecords] = useState([]);

  const getProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/profile`, {
        withCredentials: true
      });
      setProfile(res.data); // добавлено
    } catch (err) {
      console.error('Ошибка при загрузке профиля:', err);
    }
  };

  const getWeightRecords = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/weight-records`);
      // сортируем по дате
      const sorted = res.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setWeightRecords(sorted);
    } catch (err) {
      console.error('Ошибка при загрузке данных веса:', err);
    }
  };

 useEffect(() => {
  getProfile();
  getWeightRecords();

  // Для проверки
  setProfile({
    full_name: 'Айдос',
    gender: 'мужской',
    weight: 75,
    goal_weight: 70,
    // profile_picture: require('../assets/NMava.jpg'),
  });

  setWeightRecords([
    { date: '2025-04-01', weight: 76 },
    { date: '2025-04-10', weight: 75 },
    { date: '2025-04-20', weight: 74 },
  ]);
}, []);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        profile_picture: result.assets[0].uri,
      }));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('full_name', profile.full_name || '');
      formData.append('gender', profile.gender || '');
      formData.append('weight', String(profile.weight || ''));
      formData.append('goal_weight', String(profile.goal_weight || ''));

      if (profile.profile_picture && profile.profile_picture.startsWith('file')) {
        formData.append('profile_picture', {
          uri: profile.profile_picture,
          name: 'profile.jpg',
          type: 'image/jpeg',
        });
      }

      const res = await axios.post(`${BASE_URL}/update/profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      setProfile(res.data.user);
    } catch (err) {
      console.error('Ошибка при сохранении:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderChart = () => {
    if (!weightRecords.length) return null;

    const labels = weightRecords.map((item) => {
      const d = new Date(item.date);
      return `${d.getDate()}/${d.getMonth() + 1}`;
    });

    const data = weightRecords.map((item) => item.weight);

    return (
      <View style={{ marginTop: 20 }}>
        <Text style={styles.label}>График веса</Text>
        <LineChart
          data={{
            labels,
            datasets: [{ data }],
          }}
          width={Dimensions.get('window').width - 40}
          height={220}
          yAxisSuffix=" кг"
          chartConfig={{
            backgroundColor: '#f5f5f5',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          style={{ borderRadius: 16 }}
        />
      </View>
    );
  };

  if (isLoading && !Object.keys(profile).length) {
    return <ActivityIndicator style={{ marginTop: 100 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={handleImagePick}>
        <Image
          source={{ uri: profile.profile_picture || 'https://placehold.co/100x100' }}
          style={styles.avatar}
        />
      </TouchableOpacity>

      <Text style={styles.label}>Имя</Text>
      <TextInput
        value={profile.full_name || ''}
        onChangeText={(text) => setProfile({ ...profile, full_name: text })}
        style={styles.input}
      />

      <Text style={styles.label}>Пол</Text>
      <TextInput
        value={profile.gender || ''}
        onChangeText={(text) => setProfile({ ...profile, gender: text })}
        style={styles.input}
      />

      <Text style={styles.label}>Текущий вес</Text>
      <TextInput
        keyboardType="numeric"
        value={profile.weight !== undefined ? String(profile.weight) : ''}
        onChangeText={(text) => {
          const parsed = parseFloat(text);
          setProfile({ ...profile, weight: isNaN(parsed) ? '' : parsed });
        }}
        style={styles.input}
      />

      <Text style={styles.label}>Целевой вес</Text>
      <TextInput
        keyboardType="numeric"
        value={profile.goal_weight !== undefined ? String(profile.goal_weight) : ''}
        onChangeText={(text) => {
          const parsed = parseFloat(text);
          setProfile({ ...profile, goal_weight: isNaN(parsed) ? '' : parsed });
        }}
        style={styles.input}
      />

      <TouchableOpacity
        onPress={handleSave}
        style={[styles.saveButton, isLoading && { backgroundColor: '#ccc' }]}
        disabled={isLoading}
      >
        <Text style={styles.saveButtonText}>{isLoading ? 'Сохраняю...' : 'СОХРАНИТЬ'}</Text>
      </TouchableOpacity>

      {renderChart()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 15,
    backgroundColor: '#f5f5f5',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
