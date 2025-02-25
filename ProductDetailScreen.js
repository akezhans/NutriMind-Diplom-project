import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;  // Получаем объект продукта

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>
      <Text style={styles.productDetails}>Состав: {product.composition}</Text>
      <Text style={styles.productDetails}>Халяль: {product.isHalal ? 'Да' : 'Нет'}</Text>
      <Button title="Назад" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f9',
    padding: 20,
  },
  productImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  productDetails: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
});

export default ProductDetailScreen;
