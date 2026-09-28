import type { Category } from '@/types';
import { useEffect, useRef } from 'react';
import { Animated, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface CategorySliderProps {
  category: Category[];
  selectedCategory: string;
  onPress: (categoryId: string) => void;
}

// 개별 카테고리 칩
function CategoryChip({
  item,
  isSelected,
  onPress,
}: {
  item: Category;
  isSelected: boolean;
  onPress: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bgAnim = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isSelected ? 1.04 : 1,
        useNativeDriver: true,
        damping: 14,
        stiffness: 220,
      }),
      Animated.timing(bgAnim, {
        toValue: isSelected ? 1 : 0,
        duration: 180,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isSelected]);

  const backgroundColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F0EEEC', '#22272B'],
  });

  const textColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#898989', '#FFFFFF'],
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          position: 'relative',
        }}
      >
        <Animated.View
          style={{
            backgroundColor,
            borderRadius: 100,
            height: 40,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
          }}
        >
          {/* 선택됐을 때 point 점 */}
          {isSelected && (
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: '#FFDC53',
              }}
            />
          )}
          <Animated.Text
            numberOfLines={1}
            style={{
              color: textColor,
              fontSize: 13,
              fontWeight: isSelected ? '700' : '600',
              letterSpacing: -0.2,
            }}
          >
            {item.name}
          </Animated.Text>
          {/* NEW 배지 */}
          {item.isNew && (
            <View
              style={{
                paddingVertical: 1,
                paddingHorizontal: 4,
                borderRadius: 999,
                backgroundColor: '#FF3B30',
              }}
            >
              <Text className="text-white font-semibold text-xs">N</Text>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
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
        gap: 8,
        alignItems: 'center',
      }}
    >
      {category.map((c) => (
        <CategoryChip
          key={c.id}
          item={c}
          isSelected={selectedCategory === c.id}
          onPress={() => onPress(c.id)}
        />
      ))}
    </ScrollView>
  );
}
