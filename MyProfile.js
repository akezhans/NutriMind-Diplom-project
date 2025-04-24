import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

export default function MyProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://192.168.0.109:8080/profile');
        setUserData(response.data);
      } catch (error) {
        console.error('Ошибка при получении профиля:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5A67D8" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.center}>
        <Text>Не удалось загрузить данные профиля.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={require('./assets/NMava.jpg')} style={styles.avatar} />
        <Text style={styles.name}>{userData.name}</Text>
        <Text style={styles.role}>{userData.role || 'Пользователь'}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Личная информация</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{userData.email}</Text>
        </View>
        {userData.city && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Город:</Text>
            <Text style={styles.value}>{userData.city}</Text>
          </View>
        )}
        {userData.age && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Возраст:</Text>
            <Text style={styles.value}>{userData.age}</Text>
          </View>
        )}
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.sectionTitle}>О себе</Text>
        <Text style={styles.aboutText}>
          {userData.about || 'Информация отсутствует.'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  role: {
    fontSize: 16,
    color: 'gray',
  },
  infoSection: {
    marginBottom: 30,
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2D3748',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    width: 100,
    color: '#4A5568',
  },
  value: {
    color: '#2D3748',
  },
  aboutSection: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 10,
  },
  aboutText: {
    color: '#2D3748',
    fontSize: 15,
    lineHeight: 22,
  },
});
