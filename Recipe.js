import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, FlatList, Image, StyleSheet,
  TouchableOpacity, Modal, SafeAreaView, ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

export const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export default function RecipeScreen() {
  const [recipes, setRecipes] = useState([]);
  const [tab, setTab] = useState('all'); // 'all' | 'mine' | 'favorites'
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Recipe form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [image, setImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch recipes based on the selected tab
  const fetchRecipes = async () => {
    let endpoint = '/recipes';
    if (tab === 'mine') endpoint = '/recipes/mine';
    if (tab === 'favorites') endpoint = '/recipes/favorites';

    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) return;

      const res = await axios.get(`${API_BASE_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRecipes(res.data);
    } catch (err) {
      console.error('Ошибка загрузки рецептов:', err.message);
    }
  };

  // Fetch recipes by name (for search functionality)
  const searchRecipes = async () => {
    if (searchQuery.trim()) {
      try {
        const token = await SecureStore.getItemAsync('token');
        const res = await axios.get(`${API_BASE_URL}/search-recipes`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { name: searchQuery },
        });
        setRecipes(res.data);
      } catch (err) {
        console.error('Ошибка поиска рецептов:', err.response ? err.response.data : err.message);
      }
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [tab]);

  // Pick image for the recipe
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setIngredients('');
    setSteps('');
    setImage(null);
  };

  const createRecipe = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('token');
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('ingredients', JSON.stringify(ingredients.split(',').map(i => i.trim())));
      formData.append('steps', JSON.stringify(steps.split('.').map(s => s.trim())));

      if (image) {
        formData.append('image', {
          uri: image.uri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        });
      }

      await axios.post(`${API_BASE_URL}/my-recipes`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setModalVisible(false);
      resetForm();
      fetchRecipes();
    } catch (err) {
      console.error('Ошибка создания рецепта:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (id) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      await axios.delete(`${API_BASE_URL}/my-recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRecipes();
    } catch (err) {
      console.error('Ошибка удаления рецепта:', err.message);
    }
  };

  const addToFavorites = async (id) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      await axios.post(`${API_BASE_URL}/favorite-recipes/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRecipes();
    } catch (err) {
      console.error('Ошибка добавления в избранное:', err.message);
    }
  };

  const removeFromFavorites = async (id) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      await axios.delete(`${API_BASE_URL}/favorite-recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRecipes();
    } catch (err) {
      console.error('Ошибка удаления из избранного:', err.message);
    }
  };

  const renderRecipe = ({ item }) => (
    <View style={styles.recipe}>
      <Text style={styles.recipeTitle}>{item.name}</Text>
      {item.image && (
        <Image source={{ uri: `${API_BASE_URL}${item.image}` }} style={styles.recipeImage} />
      )}
      <Text>{item.description}</Text>
      <View style={styles.recipeActions}>
        <Button title="Удалить" onPress={() => deleteRecipe(item.id)} />
        {tab !== 'favorites' && (
          <Button title="Добавить в избранное" onPress={() => addToFavorites(item.id)} />
        )}
        {tab === 'favorites' && (
          <Button title="Удалить из избранного" onPress={() => removeFromFavorites(item.id)} />
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Поиск рецептов"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
        <Button title="Поиск" onPress={searchRecipes} />
      </View>

      <View style={styles.tabContainer}>
        {['all', 'mine', 'favorites'].map(t => (
          <TouchableOpacity key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.activeTab]}>
            <Text style={[styles.tabText, tab === t && styles.activeTabText]}>
              {t === 'all' ? 'Все рецепты' : t === 'mine' ? 'Мои рецепты' : 'Избранные'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRecipe}
        contentContainerStyle={{ padding: 10 }}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>＋</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.modalTitle}>Новый рецепт</Text>
          <TextInput placeholder="Название" value={name} onChangeText={setName} style={styles.input} />
          <TextInput placeholder="Описание" value={description} onChangeText={setDescription} style={styles.input} />
          <TextInput placeholder="Ингредиенты (через запятую)" value={ingredients} onChangeText={setIngredients} style={styles.input} />
          <TextInput placeholder="Шаги (через точку)" value={steps} onChangeText={setSteps} style={styles.input} />
          <Button title="Выбрать изображение" onPress={pickImage} />
          {image && <Image source={{ uri: image.uri }} style={styles.image} />}
          <Button title={loading ? "Сохраняем..." : "Сохранить"} onPress={createRecipe} disabled={loading} />
          <Button title="Закрыть" onPress={() => setModalVisible(false)} />
        </ScrollView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#eee',
    paddingVertical: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#007bff',
  },
  tabText: {
    color: '#333',
  },
  activeTabText: {
    color: 'white',
  },
  recipe: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fdfdfd',
  },
  recipeTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  recipeImage: {
    width: '100%',
    height: 150,
    marginVertical: 5,
  },
  recipeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#007bff',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    fontSize: 30,
    color: 'white',
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6, marginVertical: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
  },
});
