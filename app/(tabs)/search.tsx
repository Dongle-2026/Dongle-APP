import CategorySlider from '@/components/CategorySlider';
import { categories, keywordNews } from '@/utils/mock';
import { Search } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function SearchScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  return (
    <SafeAreaView className="bg-mono-100">
      <View className="m-4 h-14 flex-row items-center rounded-2xl border-[2px] border-mono-400/30 bg-white/70 px-4">
        <Search size={20} color="#737373" />

        <TextInput
          placeholder="지금 주목할 소식"
          placeholderTextColor="#A3A3A3"
          className="ml-3 flex-1 text-[15px]"
        />
      </View>

      <CategorySlider
        category={categories}
        selectedCategory={selectedCategory}
        onPress={(categoryId) => setSelectedCategory(categoryId)}
      />

      <FlatList
        data={keywordNews}
        numColumns={3}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ gap: 2 }}
        contentContainerStyle={{ gap: 2 }}
        className="px-4"
        renderItem={({ item }) => (
          <TouchableOpacity className="flex-1 h-48 overflow-hidden ">
            <Image
              source={{ uri: item.image }}
              className="absolute inset-0 h-full w-full"
              resizeMode="cover"
            />
            <View className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} />
            <View className="flex-1 justify-center p-3">
              <Text numberOfLines={2} className="text-xl font-bold text-white text-center">
                {item.keyword}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
