import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

// Базовые продукты
const products = [
  { id: '1', name: 'Яблоко', description: 'Свежие яблоки', image: 'https://i.ytimg.com/vi/fxaMPobNGWE/maxresdefault.jpg' },
  { id: '2', name: 'Банан', description: 'Сладкие бананы', image: 'https://avatars.mds.yandex.net/i?id=abdac5c37e9f3e99c1f9647ad5670279_l-8189861-images-thumbs&n=13' },
  { id: '3', name: 'Морковь', description: 'Свежая морковь', image: 'https://basetop.ru/wp-content/uploads/2021/03/819633.jpg' },
  { id: '4', name: 'Помидор', description: 'Сочные помидоры', image: 'https://main-cdn.sbermegamarket.ru/big2/hlr-system/-66/869/569/862/315/8/600012615816b2.jpeg' },
  { id: '5', name: 'Хлеб', description: 'Свежий хлеб', image: 'https://avatars.mds.yandex.net/i?id=513ce563ac87f9ef1209ff959b86c51e_l-9137656-images-thumbs&n=13' },
  { id: '6', name: 'Молоко', description: 'Пастеризованное молоко', image: 'https://miasnota.ru/upload/resize_cache/iblock/376/1200_1200_140cd750bba9870f18aada2478b24840a/376727c02125fde6507072a24f9615c7.jpg' },
  { id: '7', name: 'Яйца', description: 'Куриные яйца', image: 'https://vol.selhozproduct.ru/upload/usl/f_60815ebcf06ce.jpg' },
  { id: '8', name: 'Картофель', description: 'Свежий картофель', image: 'https://cdn.culture.ru/images/93749d1d-4140-54b0-8f9e-755c3996ba25' },
  { id: '9', name: 'Сыр', description: 'Твердый сыр', image: 'https://cdn.culture.ru/images/bae0a3f7-a79d-5fb7-9395-59e20aae581b' },
  { id: '11', name: 'Мед', description: 'Органический мед', image: 'https://cdn.culture.ru/images/892cff9f-2bea-521b-a049-4214b6fdaa4c' },
];

// Экран главной страницы
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Главная</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2} // Устанавливаем 2 колонки
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.productItem} 
            onPress={() => navigation.navigate('ProductDetail', { product: item })} // Навигация с полным объектом
          >
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productDescription}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// Стиль
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#f4f4f9',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    width: '100%',
  },
  productItem: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    width: '45%', // Устанавливаем ширину карточки
    marginHorizontal: 5,
  },
  productImage: {
    width: '100%', // Увеличиваем ширину изображения
    height: 150, // Увеличиваем высоту изображения
    borderRadius: 8,
    marginBottom: 10,
  },
  productDetails: {
    flex: 1,
    alignItems: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productDescription: {
    color: '#555',
  },
});

export default HomeScreen;
