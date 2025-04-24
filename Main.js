import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, Image, Animated, Easing, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Audio } from "expo-av";

const tips = [
  {
    title: "Знаешь ли ты?",
    text: "Овсянка содержит бета-глюкан, который снижает уровень холестерина.",
    image: "https://avatars.mds.yandex.net/i?id=f2a89966b2b64c4afafb0447abc53543cb472936-4872083-images-thumbs&n=13",
  },
  {
    title: "Факт дня",
    text: "20 минут ходьбы на свежем воздухе улучшают настроение на 60%.",
    image: "https://avatars.mds.yandex.net/i?id=4a5346ede7bf72482f1c95896046ea0e_l-4577239-images-thumbs&n=13",
  },
];

const quotes = [
  "Каждый день — это шанс стать лучше.",
  "Ты сильнее, чем думаешь.",
  "Начни с малого, но не останавливайся.",
  "Дисциплина — это мост между целями и результатами.",
  "Заботься о теле — это единственный дом, где ты живешь.",
];

const categories = [
  { name: "Мотивация", icon: "flame-outline" },
  { name: "Привычки", icon: "repeat-outline" },
  { name: "Дыхание", icon: "cloud-outline" },
  { name: "Упражнение дня", icon: "walk-outline" },
];

export default function MainScreen() {
  const [breathAnim] = useState(new Animated.Value(1));
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [waterCount, setWaterCount] = useState(0);
  const [quote, setQuote] = useState("");
  const [glassScale] = useState(new Animated.Value(1));

  async function toggleSound() {
    if (isPlaying && sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      return;
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: "https://github.com/akezhans/Audio/raw/refs/heads/main/rain-sound-188158.mp3" }
    );
    setSound(newSound);
    await newSound.playAsync();
    setIsPlaying(true);
  }

  const addWater = () => {
    if (waterCount < 8) {
      setWaterCount(waterCount + 1);
      Animated.sequence([
        Animated.timing(glassScale, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(glassScale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Alert.alert("Отлично!", "Ты уже выпил 8 стаканов сегодня!");
    }
  };

  useEffect(() => {
    const breathe = () => {
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: 1.5,
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breathAnim, {
          toValue: 1,
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      ]).start(() => breathe());
    };
    breathe();

    // Случайная цитата дня
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  return (
    <ScrollView style={{ padding: 16, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>Главная</Text>

      {/* 🌟 Цитата дня */}
      <View style={{
        backgroundColor: "#fef3c7",
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
      }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>Цитата дня</Text>
        <Text style={{ fontSize: 16, fontStyle: "italic", color: "#92400e" }}>{quote}</Text>
      </View>

      {/* Интересные факты */}
      {tips.map((tip, idx) => (
        <View key={idx} style={{
          backgroundColor: "#f8f8f8",
          borderRadius: 16,
          marginBottom: 16,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 3,
        }}>
          <Image
            source={{ uri: tip.image }}
            style={{ width: "100%", height: 160 }}
            resizeMode="cover"
          />
          <View style={{ padding: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 4 }}>{tip.title}</Text>
            <Text style={{ fontSize: 14, color: "#555" }}>{tip.text}</Text>
          </View>
        </View>
      ))}

      {/* Категории */}
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>Открой для себя</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        {categories.map((cat, idx) => (
          <View key={idx} style={{
            backgroundColor: "#e0f2fe",
            borderRadius: 16,
            padding: 16,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
            minWidth: 120,
          }}>
            <Icon name={cat.icon} size={28} color="#2563eb" />
            <Text style={{ marginTop: 8, textAlign: "center", fontWeight: "500" }}>{cat.name}</Text>
          </View>
        ))}
      </ScrollView>

      {/* 💧 Цель по воде */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>Цель: 8 стаканов воды</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Animated.View key={i} style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              backgroundColor: i < waterCount ? "#3b82f6" : "#e5e7eb",
              marginRight: 8,
              marginBottom: 8,
              transform: i === waterCount - 1 ? [{ scale: glassScale }] : [],
            }} />
          ))}
        </View>
        <TouchableOpacity onPress={addWater} style={{
          marginTop: 12,
          backgroundColor: "#3b82f6",
          padding: 10,
          borderRadius: 12,
          alignSelf: "flex-start",
        }}>
          <Text style={{ color: "white", fontWeight: "bold" }}>+ Стакан воды</Text>
        </TouchableOpacity>
      </View>

      {/* 🎵 Звуки для сна (будет добавлен таймер позже) */}
      <TouchableOpacity
        onPress={toggleSound}
        style={{
          marginBottom: 20,
          backgroundColor: "#dbeafe",
          borderRadius: 16,
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>Расслабляющий звук</Text>
          <Text style={{ color: "#3b82f6" }}>Дождь, лес, ветер (таймер скоро)</Text>
        </View>
        <Icon name={isPlaying ? "pause-circle-outline" : "play-circle-outline"} size={36} color="#2563eb" />
      </TouchableOpacity>

      {/* 🌀 Анимация дыхания */}
      <View style={{ alignItems: "center", marginBottom: 40 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>Упражнение дыхания</Text>
        <Animated.View style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: "#93c5fd",
          transform: [{ scale: breathAnim }],
        }} />
        <Text style={{ marginTop: 12, fontSize: 14, color: "#6b7280" }}>
          Вдох — 5 сек | Выдох — 5 сек
        </Text>
      </View>
    </ScrollView>
  );
}
