import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, Button, Image, ActivityIndicator, Alert, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

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
    // Проверяем содержимое selectedImage перед отправкой
    console.log('selectedImage перед отправкой:', selectedImage);
    
    formData.append('image', {
      uri: selectedImage.uri,
      type: 'image/jpeg',  // укажите корректный MIME тип, если знаете его
      name: 'product-image.jpg',
    });
  
    try {
      const response = await axios.post('http://192.168.0.109:8080/analyze-product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
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
      setError(`Ошибка: ${err.response ? err.response.data.message : 'Не удалось выполнить сканирование.'}`);
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
      <Text style={styles.title}>AI Сканер Продуктов</Text>
      <Text style={styles.subtitle}>
        Загрузите фотографию продукта, и наш ИИ определит его состав, калорийность и статус Халяль/Харам.
      </Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button title="Выбрать изображение из галереи" onPress={pickImage} />
      <View style={styles.spacing} />
      <Button title="Сделать фото с камеры" onPress={takePhoto} />

      {previewUrl && (
        <Image source={{ uri: previewUrl }} style={styles.previewImage} />
      )}

      <Button
        title={loading ? `Сканирование... ${uploadProgress}%` : 'Сканировать продукт'}
        onPress={handleScan}
        disabled={loading || !selectedImage}
      />

      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />}

      {renderScanResult()}
    </ScrollView>
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
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  previewImage: {
    width: 200,
    height: 200,
    marginTop: 15,
    borderRadius: 8,
  },
  scanResultContainer: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderColor: '#ddd',
  },
  scanResultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scanResultText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  scanResultSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  warningContainer: {
    marginTop: 10,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'orange',
  },
  warningText: {
    fontSize: 14,
    color: 'orange',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  spacing: {
    height: 20,
  },
});

export default AiScannerPage;
