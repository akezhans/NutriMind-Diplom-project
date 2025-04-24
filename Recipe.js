import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const recipes = [
  // Завтрак
  {
    id: '1',
    name: 'Oatmeal',
    description: 'Полезная и питательная овсянка для идеального начала дня.',
    image: { uri: 'https://avatars.mds.yandex.net/i?id=f2a89966b2b64c4afafb0447abc53543cb472936-4872083-images-thumbs&n=13' },
    ingredients: ['1 стакан овсянки', '2 стакана воды или молока', '1 ч.л. меда', 'Ягоды по вкусу'],
    prepTime: 5, // Время подготовки (например, 5 минут)
  cookTime: 10, // Время приготовления (например, 10 минут)
  ingredients: [
    { name: 'Овсянка', amount: 1, unit: 'стакан' },
    { name: 'Вода или молоко', amount: 2, unit: 'стакана' },
    { name: 'Мёд', amount: 1, unit: 'ч.л.' },
    { name: 'Ягоды', amount: 'по вкусу', unit: '' }
  ],
    steps: [
      { description: 'Нагрейте воду или молоко в кастрюле.', time: 0.1 },  // 1 минута
      { description: 'Добавьте овсянку и варите на медленном огне.', time: 300 }, // 5 минут
      { description: 'Добавьте мед и перемешайте.', time: 10 },  // 10 сек
      { description: 'Украсьте ягодами перед подачей.', time: 5 }  // 5 сек
    ]
  },
  { id: '2', name: 'Scrambled Eggs', description: 'Классический омлет, богатый белком и полезными жирами, отлично подходит для завтрака.', image: { uri: 'https://i.pinimg.com/736x/e3/a2/51/e3a251d29e5fa633eb03ed4d80839e53.jpg' } },
  { id: '3', name: 'Avocado Toast', description: 'Хрустящий тост с кремовым авокадо – идеальный источник полезных жиров и витаминов.', image: { uri: 'https://avatars.mds.yandex.net/i?id=eb782df76d716ca4b487343c8ee2c4220194062a-4321509-images-thumbs&n=13' } },
  { id: '4', name: 'Smoothie Bowl', description: 'Освежающий и питательный боул с фруктами и йогуртом, заряжающий энергией на весь день.', image: { uri: 'https://avatars.mds.yandex.net/i?id=a902a89e4f521c9c0253539323deda09_l-6357502-images-thumbs&n=13' } },
  { id: '5', name: 'Pancakes with Honey', description: 'Нежные блинчики с медом – вкусный и полезный вариант для сладкого завтрака.', image: { uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/2800_opt_1/3d49c8161057127.63bedab849330.png' } },

  // Обед
  { id: '6', name: 'Beshbarmak', description: 'Традиционное казахское блюдо из лапши и мяса, символ гостеприимства и домашнего уюта.', image: { uri: 'https://pic.rutubelist.ru/video/6c/2d/6c2db2f59a5a6035ed6a8d40a7c3f53b.jpg' } },
  { id: '7', name: 'Caesar Salad', description: 'Легкий салат с курицей, хрустящими сухариками и пикантным соусом.', image: { uri: 'https://avatars.mds.yandex.net/i?id=fb28a3b94b866986e698193c9048da4a_l-4234038-images-thumbs&n=13' } },
  { id: '8', name: 'Spaghetti Bolognese', description: 'Классическая паста с насыщенным мясным соусом Болоньезе.', image: { uri: 'https://avatars.mds.yandex.net/i?id=c9f093ee8887a24d89c17873fdd3e370_l-5210586-images-thumbs&n=13' } },
  { id: '9', name: 'Chicken Soup', description: 'Ароматный куриный суп, согревающий и улучшающий самочувствие.', image: { uri: 'https://s.yimg.com/ny/api/res/1.2/KJWDHGu3vq3CEQBf44olTw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtoPTUyMg--/https://media.zenfs.com/en/southern_living_806/a8838470e8ce4c671e4b8500a3d49113' } },
  { id: '10', name: 'Pizza Margherita', description: 'Классическая итальянская пицца с томатами, моцареллой и базиликом.', image: { uri: 'https://eda.yandex/images/3781088/63c75c8d766ec65977a03abb225425bf-1100x825.jpg' } },

  // Ужин
  { id: '11', name: 'Sushi', description: 'Японские суши с рисом, свежей рыбой и водорослями нори.', image: { uri: 'https://static.tildacdn.com/tild3031-6361-4561-a139-336136643637/422212481894599_a283.png' } },
  { id: '12', name: 'Burger', description: 'Сочный бургер с говяжьей котлетой, сыром и свежими овощами.', image: { uri: 'https://avatars.mds.yandex.net/get-altay/2816622/2a0000017517e31a126712150d54595b9c52/XXL_height' } },
  { id: '13', name: 'Steak', description: 'Идеально прожаренный стейк с насыщенным мясным вкусом.', image: { uri: 'https://eda.yandex/images/2750126/d5f1a49b2515477e8651420bbce8cec5-1100x825.jpg' } },
  { id: '14', name: 'Shashlik', description: 'Ароматный шашлык, приготовленный на углях с маринованным мясом.', image: { uri: 'https://fs.cap.ru/file/HY3vnp6bhrw0CG3MsC7AOlfChDgqGUuM' } },
  { id: '15', name: 'Fish & Chips', description: 'Хрустящая рыба с золотистым картофелем фри – популярное английское блюдо.', image: { uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Fish_and_chips_blackpool.jpg/1200px-Fish_and_chips_blackpool.jpg' } },

  // Перекусы
  { id: '21', name: 'Granola Bar', description: 'Полезный батончик из злаков и орехов, заряжающий энергией.', image: { uri: 'https://static.life.ru/01b76aa67969329103185b5a23a46b08.jpg' } },
  { id: '22', name: 'Fruit Salad', description: 'Освежающий салат из свежих фруктов, богатых витаминами.', image: { uri: 'https://storage.myseldon.com/news-pict-a5/A570D09657B4BE5C8A36D8765CD8DEFF' } },
  { id: '23', name: 'Yogurt with Nuts', description: 'Натуральный йогурт с орехами – идеальный источник белка и полезных жиров.', image: { uri: 'https://avatars.mds.yandex.net/i?id=947f067965a9a0e1857b4e0b71b5c513_l-5210344-images-thumbs&n=13' } },
  { id: '24', name: 'Cheese Crackers', description: 'Хрустящие крекеры с сыром – вкусный и сытный перекус.', image: { uri: 'https://i.pinimg.com/originals/17/b7/6b/17b76bcf059e46dfab4adfd18aa4ca90.jpg' } },
  { id: '25', name: 'Peanut Butter Toast', description: 'Тост с арахисовой пастой – отличное сочетание вкуса и энергии.', image: { uri: 'https://paromag.ru/upload/iblock/7d3/toast_box_peanut_butter_with_kaya_bread.jpg' } }
];



function RecipesScreen({ route }) {
  const navigation = useNavigation();
  const addMeal = route.params?.addMeal;

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Recipes</Text>
      <Text style={styles.subtitle}>Discover delicious homemade recipes</Text> */}

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        numColumns={2} // Два столбца
        columnWrapperStyle={styles.row} // Разделяем строки
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recipeCard}
            onPress={() => {
              addMeal(item);
              navigation.navigate('Plan');
            }}>
            <Image source={item.image} style={styles.recipeImage} />
            <Text style={styles.recipeName}>{item.name}</Text>
          </TouchableOpacity>
          
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 20 },
  row: { justifyContent: 'space-between' }, // Выравниваем элементы в строке
  recipeCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 10,
    margin: 5,
  },
  recipeImage: { width: 120, height: 120, borderRadius: 15, marginBottom: 10 },
  recipeName: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});

export default RecipesScreen;
