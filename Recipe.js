import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';

const recipes = [
  { id: '1', name: 'Besbarmaq', image: require('./assets/NMlunch.jpg') },
  { id: '2', name: 'Sirne', image: require('./assets/NMlunch.jpg') },
  { id: '3', name: 'Besbarmaq', image: require('./assets/NMlunch.jpg') },
  { id: '4', name: 'Sirne', image: require('./assets/NMlunch.jpg') },
  { id: '5', name: 'Besbarmaq', image: require('./assets/NMlunch.jpg') },
  { id: '6', name: 'Sirne', image: require('./assets/NMlunch.jpg') },
];

export default function RecipeScreen() {
  const [selectedFilter, setSelectedFilter] = useState('Curated');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipes</Text>
      <Text style={styles.subtitle}>Discover delicious homemade recipes for your weekly meal plan</Text>

      <View style={styles.filterContainer}>
        {['Curated', 'My List', 'Favorite'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterButton, selectedFilter === filter && styles.activeFilter]}
            onPress={() => setSelectedFilter(filter)}>
            <Text style={[styles.filterText, selectedFilter === filter && styles.activeFilterText]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            <Image source={item.image} style={styles.recipeImage} />
            <Text style={styles.recipeName}>{item.name}</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeFilter: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  activeFilterText: {
    color: '#fff',
  },
  recipeCard: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
  },
  recipeImage: {
    width: 140,
    height: 140,
    borderRadius: 10,
  },
  recipeName: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
});