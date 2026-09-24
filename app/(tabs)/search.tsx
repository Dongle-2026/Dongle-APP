import CategorySlider from '@/components/category-slider';
import Searchbar from '@/components/search-bar';
import { CATEGORIES, KEYWORD_NEWS } from '@/utils/mock';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function SearchScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  return (
    <SafeAreaView className="bg-mono-100">
      <Searchbar />

      <CategorySlider
        category={CATEGORIES}
        selectedCategory={selectedCategory}
        onPress={(categoryId) => setSelectedCategory(categoryId)}
      />

      <FlatList
        data={KEYWORD_NEWS}
        numColumns={3}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ gap: 2 }}
        contentContainerStyle={{ gap: 2 }}
        className="px-4"
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push('/news-list')}
            className="flex-1 h-48 overflow-hidden "
          >
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
