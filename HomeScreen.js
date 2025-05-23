import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ru';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { AntDesign } from '@expo/vector-icons';

export const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

const getAuthHeader = async () => {
  const token = await SecureStore.getItemAsync('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const categories = ['Завтрак', 'Обед', 'Ужин', 'Перекус'];

moment.locale('ru');

const HomeScreen = () => {
  const [selectedDay, setSelectedDay] = useState(moment());
  const [mealPlans, setMealPlans] = useState({ Завтрак: [], Обед: [], Ужин: [], Перекус: [] });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allRecipes, setAllRecipes] = useState([]);

  const getWeekDates = () => {
    const today = moment();
    return Array.from({ length: 7 }, (_, i) => {
      const date = today.clone().add(i, 'days');
      return {
        label: date.format('dd'),
        date: date.date(),
        full: date,
      };
    });
  };

  const fetchMealPlans = async () => {
    setIsLoading(true);
    try {
      const config = await getAuthHeader();
      const response = await axios.get(
        `${API_BASE_URL}/meal-plan?date=${selectedDay.format('YYYY-MM-DD')}`,
        config
      );
      const categorized = { Завтрак: [], Обед: [], Ужин: [], Перекус: [] };
      response.data.forEach((item) => {
        if (categorized[item.meal_type]) categorized[item.meal_type].push(item);
      });
      setMealPlans(categorized);
    } catch (error) {
      console.error('Ошибка при загрузке плана питания:', error.response?.data || error.message);
    }
    setIsLoading(false);
  };

  const fetchAllRecipes = async () => {
    try {
      const config = await getAuthHeader();
      const response = await axios.get(`${API_BASE_URL}/recipes`, config);
      setAllRecipes(response.data);
    } catch (error) {
      console.error('Ошибка загрузки рецептов:', error.response?.data || error.message);
    }
  };

  // const handleDeleteMeal = async (mealId) => {
  //   try {
  //     const config = await getAuthHeader();
  //     console.log('Удаление блюда, ID:', mealId);
  //     console.log('Запрос:', `${API_BASE_URL}/meal-plan/${mealId}`);
      
  //     await axios.delete(`${API_BASE_URL}/meal-plan/${mealId}`, config);
  
  //     fetchMealPlans(); // обновление после удаления
  //   } catch (error) {
  //     Alert.alert('Ошибка', 'Не удалось удалить блюдо');
  //     console.error(error.response?.data || error.message);
  //   }
  // };
  
  

  useEffect(() => {
    fetchMealPlans();
    fetchAllRecipes();
  }, [selectedDay]);

  const handleOpenModal = (category) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  const handleSaveMeal = async (recipe) => {
    try {
      const config = await getAuthHeader();
      await axios.post(
        `${API_BASE_URL}/meal-plan`,
        {
          recipe_id: recipe.id,
          date: selectedDay.format('YYYY-MM-DD'),
          meal_type: selectedCategory,
        },
        config
      );
      fetchMealPlans();
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось добавить блюдо');
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#f9f9f9' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>
        План на {selectedDay.format('dddd, D MMMM')}
      </Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
  {getWeekDates().map((day, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => setSelectedDay(day.full)}
      style={{
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: day.full.isSame(selectedDay, 'day') ? '#4CAF50' : '#eee',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: day.full.isSame(selectedDay, 'day') ? '#fff' : '#333', fontWeight: 'bold', fontSize: 12 }}>
        {day.date}
      </Text>
    </TouchableOpacity>
  ))}
</View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 32 }} />
      ) : (
        categories.map((category) => (
          <View key={category} style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 17, fontWeight: 'bold', marginBottom: 8 }}>{category}</Text>
            {mealPlans[category].length === 0 ? (
              <TouchableOpacity
                onPress={() => handleOpenModal(category)}
                style={{
                  height: 100,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderStyle: 'dashed',
                  borderColor: '#aaa',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                }}
              >
                <AntDesign name="plus" size={24} color="#888" />
              </TouchableOpacity>
            ) : (
              <FlatList
                data={mealPlans[category]}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => {
                  const recipe = item.recipe || allRecipes.find(r => r.id === item.recipe_id);
                  return recipe ? (
                    <RecipeCard
                      recipe={recipe}
                      onDelete={() => handleDeleteMeal(item.id)}
                    />
                  ) : null;
                }}
              />
            )}
          </View>
        ))
      )}

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
            Выберите рецепт для: {selectedCategory}
          </Text>
          <FlatList
            data={allRecipes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSaveMeal(item)}
                style={{
                  padding: 12,
                  marginBottom: 10,
                  borderRadius: 10,
                  backgroundColor: '#eee',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                {item.image && (
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: 60, height: 60, borderRadius: 8, marginRight: 10 }}
                  />
                )}
                <Text style={{ fontSize: 16 }}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 20, alignItems: 'center' }}>
            <Text style={{ color: 'red', fontSize: 16 }}>Отмена</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const RecipeCard = ({ recipe, onDelete }) => (
  <View
    style={{
      backgroundColor: '#fff',
      borderRadius: 12,
      marginRight: 12,
      width: 160,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
      position: 'relative',
    }}
  >
    {/* {onDelete && (
      <TouchableOpacity
        onPress={onDelete}
        style={{
          position: 'absolute',
          top: 6,
          right: 6,
          backgroundColor: 'rgba(0,0,0,0.4)',
          borderRadius: 12,
          padding: 4,
          zIndex: 10,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 12 }}>✕</Text>
      </TouchableOpacity>
    )} */}
    {recipe.image && (
      console.log('Image URL:', recipe.image),
      <Image
        source={{ uri: recipe.image }}
        style={{ width: '100%', height: 100, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
      />
    )}
    <View style={{ padding: 10 }}>
      <Text style={{ fontWeight: 'bold' }}>{recipe.name}</Text>
    </View>
  </View>
);

export default HomeScreen;
