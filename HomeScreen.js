import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const days = [
  { id: '1', name: 'Mon', number: 13 },
  { id: '2', name: 'Tue', number: 14 },
  { id: '3', name: 'Wed', number: 15 },
  { id: '4', name: 'Thu', number: 16 },
  { id: '5', name: 'Fri', number: 17 },
  { id: '6', name: 'Sat', number: 18 },
  { id: '7', name: 'Sun', number: 19 },
];

const meals = [
  { id: '1', name: 'Banana pudding', time: '15 min - 75 calories', checked: true, image: require('./assets/NMbrekfast.jpg') },
  { id: '2', name: 'Beshbarmaq', time: '75 min - 250 calories', checked: true, image: require('./assets/NMlunch.jpg') },
];

function HomeScreen() {
  const [selectedDay, setSelectedDay] = useState('Wed');

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <Text style={styles.title}>Today</Text>
      <Text style={styles.subtitle}>Plan your weekly meals</Text>

      {/* Дни недели */}
      <View style={styles.daysContainer}>
        {days.map((day) => (
          <TouchableOpacity key={day.id} onPress={() => setSelectedDay(day.name)} style={styles.dayWrapper}>
            <Text style={[styles.dayText, selectedDay === day.name && styles.selectedDayText]}>{day.name}</Text>
            <View style={[styles.dayNumber, selectedDay === day.name && styles.selectedDayNumber]}>
              <Text style={[styles.dayNumberText, selectedDay === day.name && styles.selectedDayNumberText]}>{day.number}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Завтрак */}
      <Text style={styles.sectionTitle}>Breakfast</Text>
      <FlatList
        data={meals.filter((meal) => meal.name === 'Banana pudding')}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.mealItem}>
            <Image source={item.image} style={styles.mealImage} />
            <View>
              <Text style={styles.mealName}>{item.name}</Text>
              <Text style={styles.mealInfo}>{item.time}</Text>
            </View>
            <Ionicons name="checkmark-circle" size={30} color="green" style={{marginLeft: 130}} />
          </View>
        )}
      />

      {/* Обед */}
      <Text style={styles.sectionTitle}>Lunch</Text>
      <FlatList
        data={meals.filter((meal) => meal.name === 'Beshbarmaq')}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.mealItem}>
            <Image source={item.image} style={styles.mealImage} />
            <View>
              <Text style={styles.mealName}>{item.name}</Text>
              <Text style={styles.mealInfo}>{item.time}</Text>
            </View>
            <Ionicons name="checkmark-circle" size={30} color="green" style={{marginLeft: 130}} />
          </View>
        )}
      />

      {/* Кнопка "Add Meal" */}
      <TouchableOpacity style={styles.addButton}>
  <View style={styles.addButtonContent}>
    <View style={styles.plusIcon}>
      <Ionicons name="add" size={14} color="white" />
    </View>
    <Text style={styles.addButtonText}>Add Meal</Text>
  </View>
</TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayWrapper: {
    alignItems: 'center',
  },
  dayText: {
    fontSize: 14,
    color: '#888',
  },
  selectedDayText: {
    color: '#000',
    fontWeight: 'bold',
  },
  dayNumber: {
    marginTop: 5,
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDayNumber: {
    backgroundColor: '#4CAF50',
  },
  dayNumberText: {
    fontSize: 16,
    color: '#000',
  },
  selectedDayNumberText: {
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    height: 70,
    padding: 10,
    borderRadius: 10,
  },
  mealImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealInfo: {
    fontSize: 12,
    color: '#888',
  },
  addButton: {
    marginTop: 200,
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    width: '100%',
  },
  
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  plusIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  
  addButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});

export default HomeScreen;
