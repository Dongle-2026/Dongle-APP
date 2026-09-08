import type { CardNews } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    Text,
    View,
} from 'react-native';

interface NewsPostProps {
  news: CardNews;
}

const { width: screenWidth } = Dimensions.get('window');
const CARD_HORIZONTAL_PADDING = 16;

export default function NewsPost({ news }: NewsPostProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(screenWidth - CARD_HORIZONTAL_PADDING * 2);
  const scrollViewRef = useRef<ScrollView>(null);

  const slides = news.slides || [];
  const hasMultipleSlides = slides.length > 1;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!hasMultipleSlides) return;

    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / cardWidth);
    setCurrentSlideIndex(currentIndex);
  };

  return (
    <View className="h-[480px] bg-mono-100 px-4 py-2 rounded-2xl overflow-hidden">
      <View
        className="flex-1 rounded-xl overflow-hidden"
        onLayout={(event) => setCardWidth(event.nativeEvent.layout.width)}
      >
        <Image
          source={{ uri: slides[0]?.image }}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.01)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
          pointerEvents="none"
        />
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          scrollEventThrottle={16}
          onScroll={handleScroll}
          showsHorizontalScrollIndicator={false}
        >
          {slides.map((slide) => (
            <View key={slide.id} style={{ width: cardWidth }} className="h-full">
              <View className="w-full h-full">
                <View className="flex-1 justify-end items-start pb-24 ml-8">
                  <Text className="text-white text-3xl font-bold mb-4 leading-[42px] w-3/4">
                    {slide.title}
                  </Text>
                  <Text className="text-white text-lg leading-7 pr-8">{slide.description}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
        {/* Slide Dots */}
        {hasMultipleSlides && (
          <View className="flex-row gap-2 absolute bottom-8 left-0 right-0 justify-center items-center">
            {slides.map((_, index) => (
              <View
                key={index}
                className={`rounded-full ${
                  index === currentSlideIndex ? 'bg-white w-2 h-2' : 'bg-white/50 w-1.5 h-1.5'
                }`}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
