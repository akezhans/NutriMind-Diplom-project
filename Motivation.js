import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MotivationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Добро пожаловать в раздел "Мотивация"</Text>
    </View>
  );
};

export default MotivationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
