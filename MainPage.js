import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, Image, Animated, Easing, TouchableOpacity} from "react-native";
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

  async function toggleSound() {
    if (isPlaying && sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      return;
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: "https://github.com/akezhans/Audio/raw/refs/heads/main/rain-sound-188158.mp3" } // пример: лес
    );
    setSound(newSound);
    await newSound.playAsync();
    setIsPlaying(true);
  }

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
  }, []);

  return (
    <ScrollView style={{ padding: 16, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>Главная</Text>

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

      {/* Аудио-блок */}
      <View style={{
        backgroundColor: "#f1f5f9",
        padding: 16,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 24,
      }}>
        <View>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 4 }}>Медитация 5 мин</Text>
          <Text style={{ color: "#6b7280" }}>Дыхательная практика для снятия стресса</Text>
        </View>
        <Icon name="play-circle-outline" size={36} color="#3B82F6" />
      </View>

      {/* Анимация дыхания */}
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
      {/* Аудио медитация */}
      <View style={{ /* ... */ }}>
        <View>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 4 }}>Медитация 5 мин</Text>
          <Text style={{ color: "#6b7280" }}>Дыхательная практика для снятия стресса</Text>
        </View>
        <Icon name="play-circle-outline" size={36} color="#3B82F6" />
      </View>

      {/* 🎵 Природный звук */}
      <TouchableOpacity
        onPress={toggleSound}
        style={{
          marginTop: 20,
          backgroundColor: "#d1fae5",
          borderRadius: 16,
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          {isPlaying ? "Остановить звук природы" : "Включить звук природы"}
        </Text>
        <Icon name={isPlaying ? "pause-outline" : "musical-notes-outline"} size={28} color="#059669" />
      </TouchableOpacity>
    </ScrollView>
  );
}
