import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  ImageBackground,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const { width } = Dimensions.get('window');

const createSlider = (title, data) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.card}
        imageStyle={{ borderRadius: 20 }}
      >
        <View style={styles.overlay}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardText}>{item.text}</Text>
        </View>
      </ImageBackground>
    </View>
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Animated.FlatList
        data={data}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />
      <View style={styles.dotsContainer}>
        {data.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [6, 12, 6],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={i}
              style={[styles.dot, { width: dotWidth }]}
            />
          );
        })}
      </View>
    </View>
  );
};

const Main = () => {
  const navigation = useNavigation();
  const phrases = [
    "Каждый шаг приближает тебя к цели.",
    "Ты способен на большее, чем думаешь.",
    "Сегодня — идеальный день для начала.",
    "Действуй, даже если боишься.",
    "Успех — это привычка, а не случайность.",
    "Не сдавайся — чудеса ближе, чем ты думаешь.",
    "Лучшее время начать — сейчас.",
  ];
  // Фраза дня по дню недели
const todayPhrase = phrases[new Date().getDay()];

  const facts = [
    {
      id: '1',
      title: 'Интересный факт',
      text: '20 минут ходьбы улучшают настроение на 60%.',
      image: 'https://avatars.mds.yandex.net/i?id=4a5346ede7bf72482f1c95896046ea0e_l-4577239-images-thumbs&n=13',
    },
    {
      id: '2',
      title: 'Интересный факт',
      text: 'Смех укрепляет иммунную систему.',
      image: 'https://avatars.mds.yandex.net/i?id=8d403e1c465bd56ae3c568dfda24a435_l-4034294-images-thumbs&n=13',
    },
    {
      id: '3',
      title: 'Интересный факт',
      text: 'Вода улучшает концентрацию и энергию.',
      image: 'https://avatars.mds.yandex.net/i?id=f520112d2a1c448976f69f8ead47c4ef_l-7762130-images-thumbs&ref=rim&n=13&w=1920&h=1080',
    },
  ];

  const tips = [
    {
      id: '1',
      title: 'Полезный совет',
      text: 'Начни утро без телефона — дай мозгу проснуться.',
      image: 'https://i.pinimg.com/originals/92/34/a1/9234a1b03a9ce3961c1d1a99d599011f.jpg',
    },
    {
      id: '2',
      title: 'Полезный совет',
      text: 'Сделай 3 глубоких вдоха перед делами.',
      image: 'https://avatars.mds.yandex.net/i?id=a62c7885c88cf28e5736e9d287168c0a_l-9098551-images-thumbs&n=13',
    },
    {
      id: '3',
      title: 'Полезный совет',
      text: 'Пей воду после пробуждения.',
      image: 'https://www.newmouth.com/wp-content/uploads/2020/12/young-woman-reaching-for-glass-of-water-on-bedside-table-scaled.jpg',
    },
  ];

  const sections = [
    { title: 'Привычки', color: '#FF9800', icon: 'lightbulb-outline' },
    { title: 'Медитация', color: '#87CEFA', icon: 'spa' },
    { title: 'Спорт', color: '#90EE90', icon: 'fitness-center' },
  ];

  const handleSectionPress = (title) => {
    navigation.navigate(title); // переход в соответствующий раздел
  }

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.section, styles.phraseSection]}>
  <Text style={styles.phraseTitle}>Фраза дня</Text>
  <Text style={styles.phraseText}>{todayPhrase}</Text>
</View>
      {/* {createSlider('Фразы дня', phrases)} */}
      {createSlider('Факты дня', facts)}
      {createSlider('Полезные советы', tips)}

      <View style={styles.grid}>
      {sections.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.sectionCard, { backgroundColor: item.color + '22' }]}
            onPress={() => handleSectionPress(item.title)}
          >
            <MaterialIcons name={item.icon} size={36} color={item.color} />
            <Text style={styles.sectionText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  phraseSection: {
    backgroundColor: '#355c7d',
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#118DC2',
  },
  
  phraseTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFE6',
    marginBottom: 6,
  },
  
  phraseText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFE6',
    lineHeight: 24,
  },
  
  
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 10,
  },
  cardContainer: {
    width: width - 40,
    marginHorizontal: 20,
  },
  card: {
    height: 200,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 16,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardText: {
    color: '#fff',
    fontSize: 14,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#555',
    marginHorizontal: 4,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  cell: {
    width: '30%',
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  cellText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  sectionCard: {
    width: '30%',
    backgroundColor: '#eee',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 3,
  },
  sectionText: {
    // marginTop: 8,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});

export default Main;
