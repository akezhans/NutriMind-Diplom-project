import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, SafeAreaView, FlatList } from 'react-native';
import StepTimer from "./StepTimer"; 
import { Ionicons } from '@expo/vector-icons';

const RecipeDetailsScreen = ({ route }) => {
  const { meal } = route.params;
  const navigation = useNavigation();
  const [servings, setServings] = useState(2);

  const calculateIngredient = (amount) => {
    if (!amount || isNaN(amount)) return "—";
    return ((amount / 2) * servings).toFixed(1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Кнопка Назад */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        {/* Изображение блюда */}
        {meal.image && (
          <Image 
            source={typeof meal.image === 'string' ? { uri: meal.image } : meal.image} 
            style={styles.recipeImage} 
          />
        )}

        {/* Название и описание */}
        <Text style={styles.title}>{meal.name}</Text>
        <Text style={styles.description}>{meal.description}</Text>

        {/* Время приготовления */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>⏳ Prep: {meal.prepTime || "?"} min</Text>
          <Text style={styles.infoText}>🍳 Cook: {meal.cookTime || "?"} min</Text>
        </View>

        {/* Ингредиенты */}
        <Text style={styles.sectionTitle}>🛒 Ingredients</Text>
        

        {/* Список ингредиентов в две колонки */}
        <View style={styles.ingredientList}>
          {meal.ingredients && meal.ingredients.length > 0 ? (
            meal.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientRow}>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                <Text style={styles.ingredientAmount}>{calculateIngredient(ingredient.amount)} {ingredient.unit}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.ingredientText}>No ingredients available</Text>
          )}
          
        </View>

        {/* Шаги приготовления */}
        <Text style={styles.sectionTitle}>👨‍🍳 Steps</Text>
        {meal.steps && meal.steps.length > 0 ? (
          meal.steps.map((step, index) => (
            <View key={index} style={styles.stepCard}>
              <Text style={styles.stepNumber}>Step {index + 1}</Text>
              <Text style={styles.stepText}>{step.description}</Text>
              {step.time && <StepTimer timeInSeconds={step.time * 60} style={styles.smallTimer} />}
            </View>
          ))
        ) : (
          <Text style={styles.stepText}>No steps available</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },

  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
    zIndex: 10,
  },

  recipeImage: { 
    width: '100%', 
    height: 220, 
    borderRadius: 15, 
    marginBottom: 15 
  },

  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    color: '#333' 
  },

  description: { 
    fontSize: 16, 
    textAlign: 'center', 
    color: '#555', 
    marginBottom: 15 
  },

  infoContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginBottom: 15 
  },

  infoText: { 
    fontSize: 14, 
    color: '#666', 
    marginHorizontal: 10 
  },

  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginTop: 20, 
    marginBottom: 10,
    color: '#444'
  },

  servingsContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 10 
  },

  servingsText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginRight: 10 
  },

  servingsButton: { 
    backgroundColor: '#4CAF50', 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginHorizontal: 5 
  },

  servingsButtonText: { 
    color: '#fff', 
    fontSize: 18 
  },

  servingsCount: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },

  moreButton: {
    marginLeft: 10,
    padding: 5,
  },

  ingredientList: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },

  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },

  ingredientName: {
    fontSize: 16,
    color: '#333',
  },

  ingredientAmount: {
    fontSize: 16,
    color: '#666',
  },

  stepCard: { 
    backgroundColor: '#F9F9F9', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 10, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 5, 
    elevation: 2 
  },

  stepNumber: { 
    fontWeight: 'bold', 
    color: '#000', 
    fontSize: 16, 
    marginBottom: 5 
  },

  stepText: { 
    fontSize: 16, 
    color: '#333' 
  },
});

export default RecipeDetailsScreen;
