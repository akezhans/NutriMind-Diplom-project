import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Ionicons';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [events, setEvents] = useState({});

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const addEvent = (type) => {
    setEvents((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), type],
    }));
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{ [selectedDate]: { selected: true, selectedColor: '#4CAF50' } }}
      />

      <Text style={styles.title}>Selected Date: {selectedDate || 'None'}</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => addEvent('Meal')}>
          <Icon name="restaurant-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Add Meal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => addEvent('Water')}>
          <Icon name="water-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Add Water</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => addEvent('Workout')}>
          <Icon name="barbell-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Add Workout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={events[selectedDate] || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventText}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  eventItem: {
    backgroundColor: '#f6f6f6',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  eventText: {
    fontSize: 16,
  },
});