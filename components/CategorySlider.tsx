import { Category } from '@/types';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface CategorySliderProps {
  category: Category[];
  selectedCategory: string;
  onPress: (categoryId: string) => void;
}

export default function CategorySlider({
  category,
  selectedCategory,
  onPress,
}: CategorySliderProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 32,
        gap: 10,
      }}
    >
      {category.map((c) => {
        const isSelected = selectedCategory === c.id;

        return (
          <TouchableOpacity
            key={c.id}
            onPress={() => onPress(c.id)}
            className="relative h-16 w-16 items-center justify-center"
          >
            {/* 원형 버튼 */}
            <View
              className={`h-16 w-16 items-center justify-center rounded-full border-[2px] ${
                isSelected ? 'border-black bg-white' : 'border-mono-300 bg-black'
              }`}
            >
              <Text
                numberOfLines={1}
                className={`text-sm font-semibold ${isSelected ? 'text-black' : 'text-white'}`}
              >
                {c.name}
              </Text>
            </View>

            {/* NEW 표시 */}
            {c.isNew && (
              <View className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500 border-white border-[1px] " />
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
