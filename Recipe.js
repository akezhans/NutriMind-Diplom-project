import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const RecipesScreen = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch("http://172.22.101.78:8000/recipes")  // Указываем правильный URL
      .then(response => response.json())
      .then(data => setRecipes(data))
      .catch(error => console.error("Ошибка:", error));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipes</Text>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.recipeItem}>
            <Image source={{ uri: item.image }} style={styles.recipeImage} />
            <View>
              <Text style={styles.recipeName}>{item.name}</Text>
              <Text style={styles.recipeDescription}>{item.description}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  recipeItem: { flexDirection: "row", marginBottom: 15, alignItems: "center" },
  recipeImage: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  recipeName: { fontSize: 18, fontWeight: "bold" },
  recipeDescription: { fontSize: 14, color: "#555" },
});

export default RecipesScreen;
