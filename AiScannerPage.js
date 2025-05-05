import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, Button, Image, ActivityIndicator, Alert, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import ScannerImage from './assets/Scan.png'; 
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native';



export const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

const AiScannerPage = () => {
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 📂 Выбор изображения из галереи
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Ошибка', 'Разрешение на доступ к галерее необходимо');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setSelectedImage(selectedAsset);  // Сохраняем весь объект, а не только URI
      setPreviewUrl(selectedAsset.uri);
      setError('');
      setScanResult(null);
    }
  };

  // 📷 Сделать фото с камеры
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Ошибка', 'Нет доступа к камере');
      return;
    }
  
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const photoUri = result.assets[0].uri;
      const fileExtension = photoUri.split('.').pop(); // Извлекаем расширение файла
  
      // Сохраняем весь объект, а не только URI
      setSelectedImage({
        uri: photoUri,
        type: `image/${fileExtension}`,  // Указываем правильный MIME тип
        name: `product-image.${fileExtension}`, // Указываем имя файла
      });
      setPreviewUrl(photoUri); // Для предварительного просмотра
      setError('');
      setScanResult(null);
    }
  };

  // 🔍 Отправка изображения на сервер
  const handleScan = async () => {
    if (!selectedImage) {
      setError('Пожалуйста, выберите изображение для сканирования');
      return;
    }
  
    setLoading(true);
    setError('');
  
    const formData = new FormData();
    formData.append('image', {
      uri: selectedImage.uri,
      type: 'image/jpeg',
      name: 'product-image.jpg',
    });
  
    try {
      const token = await SecureStore.getItemAsync('token');
  
      const response = await axios.post(`${API_BASE_URL}/analyze-product`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
  
      console.log('Ответ от сервера:', response.data);
      setScanResult(response.data);
    } catch (err) {
      console.error('Ошибка при сканировании:', err.response || err);
      setError(`Ошибка: ${err.response?.data?.message || 'Не удалось выполнить сканирование.'}`);
    } finally {
      setLoading(false);
    }
  };
  

  // 📊 Результаты анализа
  const renderScanResult = () => {
    if (!scanResult) return null;

    return (
      <View style={styles.scanResultContainer}>
        <Text style={styles.scanResultTitle}>Результаты анализа</Text>
        <Text style={styles.scanResultText}>
          <Text style={styles.bold}>Название:</Text> {scanResult.productName}
        </Text>
        <Text style={styles.scanResultText}>
          <Text style={styles.bold}>Статус Халяль:</Text> {scanResult.isHalal ? 'Халяль' : 'Не Халяль'}
        </Text>
        <Text style={styles.scanResultText}>
          <Text style={styles.bold}>Калорийность:</Text> {scanResult.calories} ккал на 100г
        </Text>
        <Text style={styles.scanResultText}>
          <Text style={styles.bold}>Белки:</Text> {scanResult.proteins}г
        </Text>
        <Text style={styles.scanResultText}>
          <Text style={styles.bold}>Жиры:</Text> {scanResult.fats}г
        </Text>
        <Text style={styles.scanResultText}>
          <Text style={styles.bold}>Углеводы:</Text> {scanResult.carbohydrates}г
        </Text>

        <Text style={styles.scanResultSubtitle}>Состав:</Text>
        {scanResult.ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.scanResultText}>
            • {ingredient.name} {ingredient.isHalal ? '(Халяль)' : '(Не Халяль)'}
          </Text>
        ))}

        {scanResult.warnings && scanResult.warnings.length > 0 && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningTitle}>Предупреждения:</Text>
            {scanResult.warnings.map((warning, index) => (
              <Text key={index} style={styles.warningText}>{warning}</Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={ScannerImage} style={styles.scannerImage} resizeMode="contain" />
  
      <Text style={styles.title}>AI Сканер Продуктов</Text>
      <Text style={styles.subtitle}>
        Загрузите фото продукта — и наш ИИ определит состав, калории и статус Халяль.
      </Text>
  
      {error && <Text style={styles.errorText}>{error}</Text>}
  
      <View style={styles.buttonGroup}>
  <TouchableOpacity onPress={pickImage} style={styles.gradientButton}>
    <LinearGradient
      colors={['#A18CD1', '#FBC2EB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <Text style={styles.gradientText}>Галерея</Text>
    </LinearGradient>
  </TouchableOpacity>

  <View style={styles.buttonSpacing} />

  <TouchableOpacity onPress={takePhoto} style={styles.gradientButton}>
    <LinearGradient
      colors={['#89F7FE', '#66A6FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <Text style={styles.gradientText}>Камера</Text>
    </LinearGradient>
  </TouchableOpacity>
</View>
  
      {previewUrl && (
        <Image source={{ uri: previewUrl }} style={styles.previewImage} />
      )}
  
  <View style={{ marginTop: 20 }}>
  <TouchableOpacity
    onPress={handleScan}
    style={[
      styles.scanButton,
      (loading || !selectedImage) && styles.disabledButton
    ]}
    disabled={loading || !selectedImage}
  >
    <Text style={styles.scanButtonText}>
      {loading ? `Сканирование... ${uploadProgress}%` : 'Сканировать продукт'}
    </Text>
  </TouchableOpacity>
</View>
      {loading && <ActivityIndicator size="large" color="#007AFF" style={styles.loadingIndicator} />}
  
      {renderScanResult()}
    </ScrollView>
  );  
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
  },
  scannerImage: {
    width: 800,
    height: 350,
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  
  gradientButton: {
    flex: 1,
    borderRadius: 25,
    overflow: 'hidden',
  },
  
  gradientBackground: {
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  
  gradientText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  
  buttonSpacing: {
    width: 20,
  },
  
  previewImage: {
    width: 250,
    height: 250,
    marginTop: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  scanResultContainer: {
    marginTop: 30,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    width: '100%',
  },
  scanResultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  scanResultText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  scanResultSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  warningContainer: {
    marginTop: 15,
    backgroundColor: '#FFF3CD',
    padding: 10,
    borderRadius: 8,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 5,
  },
  warningText: {
    fontSize: 13,
    color: '#856404',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  scanButton: {
    backgroundColor: '#28a745',
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  disabledButton: {
    backgroundColor: '#a5d6a7', // Светло-зелёный для disabled-состояния
  },
});


export default AiScannerPage;
