import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import MealModal from '../NutriMind/MealModal';

// Функция для получения текущей недели
const getCurrentWeek = () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Понедельник

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return {
      id: i.toString(),
      name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      number: date.getDate(),
    };
  });
};

// Категории приемов пищи
const mealTypes = [
  { id: '1', name: 'Breakfast', image: require('./assets/NMchoose1.jpg') },
  { id: '2', name: 'Lunch', image: require('./assets/NMchoose2.png') },
  { id: '3', name: 'Dinner', image: require('./assets/NMchoose3.jpg') },
  { id: '4', name: 'Snacks', image: require('./assets/NMchoose4.jpg') },
];

function HomeScreen() {
  const [selectedDay, setSelectedDay] = useState(getCurrentWeek()[2].name);
  const [mealPlans, setMealPlans] = useState({});
  const [showMealSelection, setShowMealSelection] = useState(false);
  const navigation = useNavigation();

  const handleAddMeal = () => {
    setShowMealSelection(true);
  };

  const handleSelectMealType = (mealType) => {
    setShowMealSelection(false);
    navigation.navigate('Recipes', {
      addMeal: (meal) => {
        setMealPlans((prev) => ({
          ...prev,
          [selectedDay]: [...(prev[selectedDay] || []), { ...meal, type: mealType, description: meal.description }],
        }));
      },
    });
  };

  const handleRemoveMeal = (day, mealIndex) => {
    setMealPlans((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, index) => index !== mealIndex),
    }));
  };


  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  
  const openModal = (meal) => {
    setSelectedMeal(meal);
    setModalVisible(true);
  };
  
  const closeModal = () => {
    setModalVisible(false);
  };
  
  const handleDeleteMeal = (meal) => {
    handleRemoveMeal(selectedDay, mealPlans[selectedDay].indexOf(meal));
    closeModal();
  };

  return (
    <View style={styles.container}>
       {/* Заголовок */}
       <Text style={styles.title}>Today</Text>
        <Text style={styles.subtitle}>Plan your weekly meals</Text>

        {/* Дни недели */}
        <View style={styles.daysContainer}>
          {getCurrentWeek().map((day) => (
            <TouchableOpacity
              key={day.id}
              onPress={() => setSelectedDay(day.name)}
              style={styles.dayWrapper}
            >
              <Text
                style={[
                  styles.dayText,
                  selectedDay === day.name && styles.selectedDayText,
                ]}
              >
                {day.name}
              </Text>
              <View
                style={[
                  styles.dayNumber,
                  selectedDay === day.name && styles.selectedDayNumber,
                ]}
              >
                <Text
                  style={[
                    styles.dayNumberText,
                    selectedDay === day.name && styles.selectedDayNumberText,
                  ]}
                >
                  {day.number}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }} // Отступ, чтобы кнопка не перекрывала контент
        keyboardShouldPersistTaps="handled"
      >
       

        {/* Приемы пищи */}
        {mealTypes.map((mealType) => {
          const mealsForType = (mealPlans[selectedDay] || []).filter(
            (meal) => meal.type.id === mealType.id
          );

          return mealsForType.length > 0 ? (
            <View key={mealType.id} style={styles.mealSection}>
              <Text style={styles.mealSectionTitle}>{mealType.name}</Text>
              {mealsForType.map((item, index) => (
  <TouchableOpacity key={index} onPress={() => openModal(item)}>
    <View style={styles.mealItem}>
      <Image source={item.image} style={styles.mealImage} />
      <View style={styles.mealDetails}>
        <Text style={styles.mealName}>{item.name}</Text>
      </View>
      <TouchableOpacity onPress={() => handleRemoveMeal(selectedDay, index)}>
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
))}
            </View>
          ) : null;
        })}
      </ScrollView>

      {/* Кнопка "Add Meal" */}
      <View style={styles.fixedAddButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddMeal}>
          <View style={styles.addButtonContent}>
            <View style={styles.plusIcon}>
              <Ionicons name="add" size={14} color="white" />
            </View>
            <Text style={styles.addButtonText}>Add Meal</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Выбор типа приема пищи */}
      {showMealSelection && (
        <TouchableWithoutFeedback onPress={() => setShowMealSelection(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Add Meal</Text>
              <FlatList
                data={mealTypes}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.mealTypeItem}
                    onPress={() => handleSelectMealType(item)}
                  >
                    <Image source={item.image} style={styles.mealTypeImage} />
                    <Text style={styles.mealTypeText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
      <MealModal 
        meal={selectedMeal}
        isVisible={isModalVisible}
        onClose={closeModal}
        onDelete={handleDeleteMeal}
      />
    </View>
  );
}

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
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayWrapper: {
    alignItems: 'center',
  },
  dayText: {
    fontSize: 14,
    color: '#888',
  },
  selectedDayText: {
    color: '#000',
    fontWeight: 'bold',
  },
  dayNumber: {
    marginTop: 5,
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDayNumber: {
    backgroundColor: '#4CAF50',
  },
  dayNumberText: {
    fontSize: 16,
    color: '#000',
  },
  selectedDayNumberText: {
    color: '#fff',
  },
  mealSection: {
    marginBottom: 15,
  },
  mealSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
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
  addButton: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#FFFFFF', 
    paddingVertical: 15, 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#D9D9D9', 
    borderStyle: 'dashed', // Добавляем пунктирную рамку
    width: '100%', 
  },
  addButtonContent: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  plusIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50', // Зелёный круг
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10, // Отступ перед текстом
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
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
  mealTypeItem: {
    width: '48%', // Чтобы поместилось по 2 элемента в ряд
    aspectRatio: 1, // Квадратные элементы
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  
  
  mealTypeImage: {
    width: 100,
    height: 100,
    borderRadius: 15,
  },
  mealTypeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default HomeScreen;
