import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Modal, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const categories = ['All', 'Dairy', 'Vegetables', 'Meat', 'Snacks'];

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('All');
  const [expiryDate, setExpiryDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const addProduct = () => {
    if (productName) {
      setProducts([...products, { name: productName, category: productCategory, expiry: expiryDate }]);
      setModalVisible(false);
      setProductName('');
      setExpiryDate('');
    }
  };

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>My Products</Text>
      <Text>Manage your products and track expiry dates.</Text>
      
      {/* Category Filter */}
      <View style={{ flexDirection: 'row', marginVertical: 10 }}>
        {categories.map((cat) => (
          <TouchableOpacity key={cat} onPress={() => setSelectedCategory(cat)} style={{ marginRight: 10 }}>
            <Text style={{ color: selectedCategory === cat ? 'blue' : 'black' }}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1 }}>
            <Text>{item.name} ({item.category})</Text>
            <Text style={{ color: 'red' }}>Expiry: {item.expiry || 'N/A'}</Text>
          </View>
        )}
      />
      
      {/* Add Product Button */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={{ backgroundColor: 'green', padding: 10, marginTop: 20 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>+ Add Product</Text>
      </TouchableOpacity>
      
      {/* Add Product Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Add Product</Text>
          <TextInput placeholder="Product Name" value={productName} onChangeText={setProductName} style={{ borderWidth: 1, marginVertical: 10, padding: 5 }} />
          <TextInput placeholder="Expiry Date (YYYY-MM-DD)" value={expiryDate} onChangeText={setExpiryDate} style={{ borderWidth: 1, marginVertical: 10, padding: 5 }} />
          
          {/* Category Selection */}
          <Text>Category:</Text>
          {categories.filter(c => c !== 'All').map((cat) => (
            <TouchableOpacity key={cat} onPress={() => setProductCategory(cat)}>
              <Text style={{ color: productCategory === cat ? 'blue' : 'black' }}>{cat}</Text>
            </TouchableOpacity>
          ))}
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
            <Button title="Save" onPress={addProduct} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MyProducts;