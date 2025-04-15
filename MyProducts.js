import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, FlatList, TouchableOpacity, Alert, StyleSheet, Modal } from 'react-native';

const MyProductsPage = () => {
  const [products, setProducts] = useState([
    { id: '1', name: 'Молоко', image: 'https://via.placeholder.com/100', category: 'Молочные продукты', expiryDate: '2025-04-15' },
    { id: '2', name: 'Яблоки', image: 'https://via.placeholder.com/100', category: 'Фрукты', expiryDate: '2025-04-20' },
    // Пример продуктов
  ]);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  
  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productExpiryDate, setProductExpiryDate] = useState('');

  // Функция для добавления нового продукта
  const addProduct = () => {
    const newProduct = {
      id: String(products.length + 1),
      name: productName,
      image: productImage || 'https://via.placeholder.com/100',
      category: productCategory,
      expiryDate: productExpiryDate,
    };
    setProducts([...products, newProduct]);
    setIsModalVisible(false);
    clearForm();
  };

  // Функция для редактирования продукта
  const editProduct = (id) => {
    const productToEdit = products.find(product => product.id === id);
    setCurrentProduct(productToEdit);
    setProductName(productToEdit.name);
    setProductImage(productToEdit.image);
    setProductCategory(productToEdit.category);
    setProductExpiryDate(productToEdit.expiryDate);
    setIsEditing(true);
    setIsModalVisible(true);
  };

  // Функция для сохранения изменений продукта
  const saveProductChanges = () => {
    const updatedProducts = products.map(product => {
      if (product.id === currentProduct.id) {
        return {
          ...product,
          name: productName,
          image: productImage,
          category: productCategory,
          expiryDate: productExpiryDate,
        };
      }
      return product;
    });
    setProducts(updatedProducts);
    setIsModalVisible(false);
    setIsEditing(false);
    clearForm();
  };

  // Очистка формы
  const clearForm = () => {
    setProductName('');
    setProductImage('');
    setProductCategory('');
    setProductExpiryDate('');
  };

  // Функция для удаления продукта
  const deleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
    Alert.alert('Удалено', 'Продукт был удален');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Мои продукты</Text>
      <Text style={styles.subtitle}>Добавьте или отредактируйте продукты в вашем списке</Text>
      <Button title="Добавить продукт" onPress={() => setIsModalVisible(true)} />

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.mealItem}>
            <Image source={{ uri: item.image }} style={styles.mealImage} />
            <View style={styles.mealDetails}>
              <Text style={styles.mealName}>{item.name}</Text>
              <Text style={styles.mealInfo}>Категория: {item.category}</Text>
              <Text style={styles.mealInfo}>Срок годности: {item.expiryDate}</Text>
            </View>
            <View style={styles.productActions}>
              <Button title="Редактировать" onPress={() => editProduct(item.id)} />
              <Button title="Удалить" onPress={() => deleteProduct(item.id)} color="red" />
            </View>
          </View>
        )}
      />

      {/* Модальное окно для добавления/редактирования продуктов */}
      <Modal visible={isModalVisible} animationType="slide" onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{isEditing ? 'Редактировать продукт' : 'Добавить продукт'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Название продукта"
              value={productName}
              onChangeText={setProductName}
            />
            <TextInput
              style={styles.input}
              placeholder="Ссылка на изображение"
              value={productImage}
              onChangeText={setProductImage}
            />
            <TextInput
              style={styles.input}
              placeholder="Категория"
              value={productCategory}
              onChangeText={setProductCategory}
            />
            <TextInput
              style={styles.input}
              placeholder="Срок годности (например, 2025-04-15)"
              value={productExpiryDate}
              onChangeText={setProductExpiryDate}
            />
            <View style={styles.modalButtons}>
              <Button title={isEditing ? 'Сохранить изменения' : 'Добавить'} onPress={isEditing ? saveProductChanges : addProduct} />
              <Button title="Отмена" onPress={() => setIsModalVisible(false)} color="gray" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    height: 70,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  mealImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  mealDetails: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealInfo: {
    fontSize: 12,
    color: '#888',
  },
  productActions: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Затемнённый фон
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default MyProductsPage;
