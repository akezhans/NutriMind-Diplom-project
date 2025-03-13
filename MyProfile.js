import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function MyProfile() {
  const [weight, setWeight] = useState('');
  const [weightHistory, setWeightHistory] = useState([65, 66, 66.5, 67, 66.8, 66, 66.9]);

  const handleAddWeight = () => {
    if (weight) {
      setWeightHistory([...weightHistory, parseFloat(weight)]);
      setWeight('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>
      <Text style={styles.subtitle}>Track your weight and monitor progress over time.</Text>

      <View style={styles.profileSection}>
        <Image source={require('./assets/NMava.jpg')} style={styles.avatar} />
        <View>
          <Text style={styles.userName}>Akezhan Sailaubekov</Text>
          <Text style={styles.userEmail}>sajlaubekovakezhan@gmail.com</Text>
        </View>
        <TouchableOpacity style={styles.editButton}><Text style={styles.editText}>Edit</Text></TouchableOpacity>
      </View>

      <View style={styles.inputSection}>
        <Text>Enter Your Weight (kg):</Text>
        <TextInput style={styles.input} keyboardType='numeric' value={weight} onChangeText={setWeight} />
        <Button title="Add Weight" onPress={handleAddWeight} />
      </View>

      <Text style={styles.graphTitle}>Weight Progress</Text>
      <LineChart
        data={{
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{ data: weightHistory }],
        }}
        width={screenWidth - 20}
        height={220}
        yAxisSuffix="kg"
        chartConfig={{
          backgroundColor: '#f1f1f1',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 14, fontStyle: 'italic', color: 'gray' },
  profileSection: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  avatar: { width: 60, height: 60, borderRadius: 40, marginRight: 10 },
  userName: { fontSize: 18, fontWeight: 'bold' },
  userEmail: { fontSize: 14, color: 'gray' },
  editButton: { backgroundColor: '#007bff', padding: 8, borderRadius: 5, marginLeft: 'auto' },
  editText: { color: '#fff' },
  inputSection: { marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 10, borderRadius: 5 },
  graphTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  chart: { borderRadius: 10 },
});
