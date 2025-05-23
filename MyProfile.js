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
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LineChart } from 'react-native-chart-kit';
import Constants from 'expo-constants';
import axiosInstance from './axiosInstance';
import Toast from 'react-native-toast-message';
import RNPickerSelect from 'react-native-picker-select';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';


export const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export default function ProfileScreen() {
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [weightRecords, setWeightRecords] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const getProfile = async () => {
    try {
      const res = await axiosInstance.get('/profile');
      setProfile(res.data);
    } catch (err) {
      console.error('Ошибка получения профиля:', err);
    }
  };

  const getWeightRecords = async () => {
    try {
      const res = await axiosInstance.get('/weight-records');
      const sorted = res.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setWeightRecords(sorted);
    } catch (err) {
      console.error('Ошибка при загрузке данных веса:', err);
    }
  };

  useEffect(() => {
    getProfile();
    getWeightRecords();
  }, []);

  
  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Правильное использование mediaTypes
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!result.canceled) {
        const selectedImageUri = result.assets[0].uri;
        setProfile((prevProfile) => ({
          ...prevProfile,
          profile_picture: selectedImageUri, // Обновляем profile_picture с новым изображением
        }));
  
        console.log('Image selected:', selectedImageUri);
      }
    } catch (error) {
      console.error('Ошибка при выборе изображения:', error);
    }
  };
  
  
  
  const handleSave = async () => {
    try {
      setIsLoading(true);
  
      const formData = new FormData();
      formData.append('full_name', profile.full_name || '');
      formData.append('gender', profile.gender || '');
      formData.append('weight', profile.weight?.toString() || '');
      formData.append('goal_weight', profile.goal_weight?.toString() || '');
  
      if (profile.profile_picture && profile.profile_picture.startsWith('file://')) {
        formData.append('profile_picture', {
          uri: profile.profile_picture,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
      }
  
      const token = await SecureStore.getItemAsync('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
  
      const response = await axios.put(`${API_BASE_URL}/profile`, formData, config);

  
      console.log('Profile updated successfully', response.data);
      setIsLoading(false);
      setEditMode(false); // Можно закрыть режим редактирования
      Toast.show({ type: 'success', text1: 'Профиль обновлен' });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data);
      } else {
        console.error('Ошибка при сохранении:', error);
      }
      Toast.show({ type: 'error', text1: 'Ошибка при сохранении профиля' });
      setIsLoading(false);
    }
  };
  
  
  const renderChart = () => {
    if (!weightRecords.length) return;
  
    const labels = weightRecords.map(record => new Date(record.date).toLocaleDateString('ru-RU'));
  
    const data = weightRecords.map((item) => item.weight);
  

    console.log("Компонент профиля отрисовался");

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Прогресс веса</Text>
        <Text>Тест: рендер работает?</Text>
        <LineChart
          data={{
            labels,
            datasets: [{ data }]
          }}
          width={Dimensions.get('window').width - 40}
          height={240}
          yAxisSuffix=" кг"
          fromZero
          bezier
          segments={5}
          chartConfig={{
            backgroundColor: '#f0f0f0',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            labelColor: () => '#555',
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#007bff',
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
        <Text style={styles.chartInfo}>
          Последняя запись: {weightRecords[weightRecords.length - 1].weight} кг (
          {new Date(weightRecords[weightRecords.length - 1].date).toLocaleDateString('ru-RU')})
        </Text>
      </View>
    );
  };
  

  if (isLoading && !Object.keys(profile).length) {
    return <ActivityIndicator style={{ marginTop: 100 }} />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={{ uri: profile.profile_picture  }}
          style={styles.avatar}
        />
        <Text style={{ fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 10 }}>
          {profile.full_name || 'Имя пользователя'}
        </Text>

        <TouchableOpacity
          onPress={() => setEditMode(!editMode)}
          style={[styles.saveButton, { backgroundColor: '#4182F9' }]}
        >
          <Text style={styles.saveButtonText}>
            {editMode ? 'Отменить' : 'Редактировать профиль'}
          </Text>
        </TouchableOpacity>

        {editMode && (
          <>
            <TouchableOpacity
                onPress={() => {
                  handleImagePick();
                }}
                style={{ backgroundColor: '#D5D040', zIndex: 100, padding: 10, borderRadius: 12 }}
            >
              <Text style={{ textAlign: 'center', color: '#fff', marginTop: 10, fontWeight: '600', fontSize: 16,}}>
                Изменить фото
              </Text>
            </TouchableOpacity>



            <Text style={styles.label}>Имя</Text>
            <TextInput
              value={profile.full_name || ''}
              onChangeText={(text) => setProfile({ ...profile, full_name: text })}
              style={styles.input}
              placeholder="Введите имя"
            />

            <Text style={styles.label}>Пол</Text>
            <RNPickerSelect
              onValueChange={(value) => setProfile({ ...profile, gender: value })}
              items={[
                { label: 'Мужской', value: 'мужской' },
                { label: 'Женский', value: 'женский' },
              ]}
              value={profile.gender}
              style={{
                inputIOS: styles.input,
                inputAndroid: styles.input,
              }}
              placeholder={{ label: 'Выберите пол', value: null }}
            />

            <Text style={styles.label}>Текущий вес (кг)</Text>
            <TextInput
              keyboardType="numeric"
              value={profile.weight !== undefined ? String(profile.weight) : ''}
              onChangeText={(text) =>
                setProfile({ ...profile, weight: text === '' ? '' : parseFloat(text) })
              }
              style={styles.input}
              placeholder="Например, 75"
            />

            <Text style={styles.label}>Целевой вес (кг)</Text>
            <TextInput
              keyboardType="numeric"
              value={profile.goal_weight !== undefined ? String(profile.goal_weight) : ''}
              onChangeText={(text) =>
                setProfile({ ...profile, goal_weight: text === '' ? '' : parseFloat(text) })
              }
              style={styles.input}
              placeholder="Например, 70"
            />

            <TouchableOpacity
              onPress={handleSave}
              style={[styles.saveButton, isLoading && { backgroundColor: '#00AD5A' }]}
              disabled={isLoading}
            >
              <Text style={styles.saveButtonText}>
                {isLoading ? 'Сохраняю...' : 'СОХРАНИТЬ'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {profile.weight && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 16, textAlign: 'center' }}>
              Текущий вес: <Text style={{ fontWeight: '600' }}>{profile.weight} кг</Text>
            </Text>
            <Text style={{ fontSize: 14, textAlign: 'center', color: '#555' }}>
              Дата: {new Date().toLocaleDateString('ru-RU')}
            </Text>
            {profile.goal_weight && (
              <Text style={{ fontSize: 15, textAlign: 'center', marginTop: 4 }}>
                Прогресс: {profile.weight - profile.goal_weight > 0 ? '-' : ''}
                {Math.abs(profile.weight - profile.goal_weight)} кг до цели
              </Text>
            )}
          </View>
        )}
        {renderChart()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
    backgroundColor: '#f2f2f2',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: '#ddd',
  },
  label: {
    fontWeight: '600',
    color: '#333',
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: '#00AD5A',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },
  chartContainer: {
    backgroundColor: 'red',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    marginTop: 20,
  },
  chartInfo: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    marginTop: 6,
  },
});
