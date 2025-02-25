import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Экран для профиля
function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Профиль</Text>
      <Text>Здесь будет информация о пользователе</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f9',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
});

export default ProfileScreen;
