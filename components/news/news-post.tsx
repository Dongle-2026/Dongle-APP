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
  isPress?: boolean;
  onPress?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');
const CARD_HORIZONTAL_PADDING = 16;
const DEFAULT_IMAGE = 'https://via.placeholder.com/600x800/1E293B/FFFFFF?text=Dongle+News';

const CATEGORY_LABEL_MAP: Record<string, string> = {
  youth: '청년',
  policy: '정책',
  finance: '금융',
  investment: '투자',
  'real-estate': '부동산',
  economy: '경제',
  job: '취업',
  savings: '저축',
};

export default function NewsPost({ news, isPress = false, onPress }: NewsPostProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(screenWidth - CARD_HORIZONTAL_PADDING * 2);
  const scrollViewRef = useRef<ScrollView>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const hasMoved = useRef(false);

  const coverSlide = {
    id: `${news.id}-cover`,
    title: news.title,
    description: '',
  };

  const slides = [coverSlide, ...(news.slides || [])];
  const hasMultipleSlides = slides.length > 1;

  const bgImage = news.image || DEFAULT_IMAGE;

  const getCategoryLabel = (categoryKey?: string) => {
    if (!categoryKey) return '';
    return CATEGORY_LABEL_MAP[categoryKey] || categoryKey;
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!hasMultipleSlides) return;

    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / cardWidth);
    setCurrentSlideIndex(currentIndex);
  };

  return (
    <View className="h-[430px] py-3 px-6">
      <View
        className="flex-1 rounded-[28px] overflow-hidden bg-slate-950 relative shadow-xl"
        onLayout={(event) => setCardWidth(event.nativeEvent.layout.width)}
      >
        <Image
          source={{ uri: bgImage }}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />

        <LinearGradient
          colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.92)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
          pointerEvents="none"
        />

        <View className="absolute left-7 right-7 top-6 flex-row justify-between items-center z-10">
          {news.category ? (
            <View>
              <Text className="text-white text-[12px] font-bold tracking-wider">
                {getCategoryLabel(news.category)}
              </Text>
            </View>
          ) : (
            <View />
          )}
          <Text className="text-white/70 text-[10px] font-bold tracking-[2px] uppercase">
            DONGLE MAGAZINE
          </Text>
        </View>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          scrollEventThrottle={16}
          onScroll={handleScroll}
          showsHorizontalScrollIndicator={false}
          onTouchStart={(event) => {
            touchStartX.current = event.nativeEvent.pageX;
            touchStartY.current = event.nativeEvent.pageY;
            hasMoved.current = false;
          }}
          onTouchMove={(event) => {
            const dx = Math.abs(event.nativeEvent.pageX - touchStartX.current);
            const dy = Math.abs(event.nativeEvent.pageY - touchStartY.current);

            if (dx > 8 || dy > 8) {
              hasMoved.current = true;
            }
          }}
          onTouchEnd={() => {
            if (isPress && !hasMoved.current) {
              onPress?.();
            }
          }}
        >
          {slides.map((slide, index) => (
            <View key={`slide-${news.id}-${index}`} style={{ width: cardWidth }} className="h-full">
              <View className="flex-1 justify-center items-start px-8 pt-6">
                {/* 슬라이드 넘버링 뱃지 */}
                {hasMultipleSlides && (
                  <View className="bg-white/15 px-2.5 py-1 rounded-md mb-3 border border-white/10">
                    <Text className="text-white/90 text-[10px] font-bold tracking-widest">
                      {index === 0 ? 'NEWS' : `SLIDE 0${index}`}
                    </Text>
                  </View>
                )}

                <Text
                  className="text-white text-[26px] font-black mb-3.5 leading-10 tracking-tight"
                  numberOfLines={3}
                >
                  {slide.title}
                </Text>

                {slide.description ? (
                  <Text
                    className="text-slate-200 text-lg leading-7 font-normal opacity-90"
                    numberOfLines={5}
                  >
                    {slide.description}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* 📌 5. 슬라이드 인디케이터 (하단 도트) */}

        {hasMultipleSlides && (
          <View className="gap-1.5 absolute bottom-8 left-0 right-0 justify-center items-center flex-row z-10">
            {slides.map((_, index) => (
              <View
                key={`dot-${news.id}-${index}`}
                style={{
                  width: index === currentSlideIndex ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor:
                    index === currentSlideIndex ? '#ffffff' : 'rgba(255,255,255,0.4)',
                }}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
