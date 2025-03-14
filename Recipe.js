import React, { useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const categories = ["All", "Breakfast", "Lunch", "Dinner", "Desserts"];
const sortOptions = ["Highest Rated", "Lowest Rated"];

const recipesData = [
  { id: "1", name: "Avocado Toast", category: "Breakfast", rating: 4.5, tags: ["Vegan", "Healthy"], image: require("./assets/NMlunch.jpg") },
  { id: "2", name: "Chicken Salad", category: "Lunch", rating: 4.7, tags: ["Low Calorie", "Protein"], image: require("./assets/NMlunch.jpg") },
  { id: "3", name: "Pasta Carbonara", category: "Dinner", rating: 4.6, tags: ["Comfort Food"], image: require("./assets/NMlunch.jpg") },
];

export default function RecipesScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("Highest Rated");
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  const filteredRecipes =
    selectedCategory === "All"
      ? recipesData
      : recipesData.filter((recipe) => recipe.category === selectedCategory);

  const sortedRecipes = [...filteredRecipes].sort((a, b) =>
    sortOption === "Highest Rated" ? b.rating - a.rating : a.rating - b.rating
  );

  return (
    <View style={styles.container}>
      {/* Header с названием и кнопкой фильтра */}
      <View style={styles.header}>
      
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Ionicons name="filter" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Список рецептов */}
      <FlatList
        data={sortedRecipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            <Image source={item.image} style={styles.recipeImage} />
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeTitle}>{item.name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="gold" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
              <View style={styles.tagsContainer}>
                {item.tags.map((tag, index) => (
                  <Text key={index} style={styles.tag}>
                    {tag}
                  </Text>
                ))}
              </View>
            </View>
            <TouchableOpacity>
              <Ionicons name="heart-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Модальное окно фильтров */}
      <Modal visible={isFilterModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filters</Text>

            <Text style={styles.filterLabel}>Category</Text>
            {categories.map((cat) => (
              <TouchableOpacity key={cat} onPress={() => setSelectedCategory(cat)} style={styles.filterOption}>
                <Text style={{ color: selectedCategory === cat ? "blue" : "black" }}>{cat}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.filterLabel}>Sort By</Text>
            {sortOptions.map((option) => (
              <TouchableOpacity key={option} onPress={() => setSortOption(option)} style={styles.filterOption}>
                <Text style={{ color: sortOption === option ? "blue" : "black" }}>{option}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={() => setFilterModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// 🎨 Стили
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10 },
  headerText: { fontSize: 22, fontWeight: "bold" },
  recipeCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#f8f8f8", borderRadius: 10, marginVertical: 5, padding: 10 },
  recipeImage: { width: 60, height: 60, borderRadius: 10 },
  recipeInfo: { flex: 1, marginLeft: 10 },
  recipeTitle: { fontSize: 16, fontWeight: "bold" },
  ratingContainer: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  ratingText: { marginLeft: 5, fontSize: 14 },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap" },
  tag: { backgroundColor: "#ddd", borderRadius: 5, padding: 5, marginRight: 5, fontSize: 12 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: "80%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  filterLabel: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  filterOption: { padding: 10 },
  closeButton: { backgroundColor: "blue", padding: 10, marginTop: 20, borderRadius: 5, alignItems: "center" },
  closeButtonText: { color: "white", fontWeight: "bold" },
});

