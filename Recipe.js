import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Recipe() {
  return (
    <View style={styles.container}>
      <Text>Recipe Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
