import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [activityLevel, setActivityLevel] = useState("1");
  const [climate, setClimate] = useState("normal");
  const [waterIntake, setWaterIntake] = useState(null);
  const [reminderActive, setReminderActive] = useState(false);

  // Расчет необходимого количества воды
  const calculateWaterIntake = () => {
    if (!weight || !age) {
      Alert.alert("Ошибка", "Пожалуйста, введите вес и возраст.");
      return;
    }

    let intake = parseInt(weight) * 30; // 30 мл на кг веса
    intake += parseInt(age) > 30 ? 200 : 0; // Дополнительные 200 мл для людей старше 30 лет

    if (activityLevel === "high") intake += 500; // Добавляем 500 мл для активных людей
    if (climate === "hot") intake += 300; // Добавляем 300 мл в жаркую погоду

    setWaterIntake(intake);
  };

  // Напоминания о питье (каждые 2 часа)
  useEffect(() => {
    if (reminderActive) {
      const interval = setInterval(() => {
        Alert.alert("Напоминание", "Не забудьте пить воду!");
      }, 7200000); // Напоминание каждые 2 часа

      return () => clearInterval(interval);
    }
  }, [reminderActive]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.header}>Рассчитаем нужное количество воды</Text>

        <TextInput
          style={styles.input}
          placeholder="Ваш вес (кг)"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
        <TextInput
          style={styles.input}
          placeholder="Ваш возраст (лет)"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />

        <Text style={styles.label}>Уровень активности:</Text>
        <View style={styles.radioButtons}>
          <TouchableOpacity
            style={[styles.button, activityLevel === "low" && styles.activeButton]}
            onPress={() => setActivityLevel("low")}
          >
            <Text style={styles.buttonText}>Низкий</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, activityLevel === "medium" && styles.activeButton]}
            onPress={() => setActivityLevel("medium")}
          >
            <Text style={styles.buttonText}>Средний</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, activityLevel === "high" && styles.activeButton]}
            onPress={() => setActivityLevel("high")}
          >
            <Text style={styles.buttonText}>Высокий</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Климат:</Text>
        <View style={styles.radioButtons}>
          <TouchableOpacity
            style={[styles.button, climate === "normal" && styles.activeButton]}
            onPress={() => setClimate("normal")}
          >
            <Text style={styles.buttonText}>Нормальный</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, climate === "hot" && styles.activeButton]}
            onPress={() => setClimate("hot")}
          >
            <Text style={styles.buttonText}>Жаркий</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.calculateButton} onPress={calculateWaterIntake}>
          <Text style={styles.calculateText}>Рассчитать</Text>
        </TouchableOpacity>

        {waterIntake && (
          <Text style={styles.resultText}>
            Вам нужно выпивать {waterIntake} мл воды в день.
          </Text>
        )}

        <TouchableOpacity
          style={styles.reminderButton}
          onPress={() => setReminderActive(!reminderActive)}
        >
          <Text style={styles.buttonText}>
            {reminderActive ? "Остановить напоминания" : "Включить напоминания"}
          </Text>
        </TouchableOpacity>

        <StatusBar style="auto" />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  radioButtons: {
    flexDirection: "row",
    marginBottom: 20,
  },
  button: {
    padding: 10,
    margin: 5,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  activeButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  calculateButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  calculateText: {
    color: "#fff",
    fontSize: 18,
  },
  resultText: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: "bold",
  },
  reminderButton: {
    marginTop: 20,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
  },
});
