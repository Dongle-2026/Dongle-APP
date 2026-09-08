import NewsPost from '@/components/news/news-post';
import { newsService } from '@/services';
import type { CardNews } from '@/types';
import { KEYWORD_NEWS } from '@/utils/mock';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import type { RefObject } from 'react';
import { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const DETAIL_X = 0;
const DETAIL_Y = 0;

function NewsGridCard({
  item,
  cardWidth,
  onPress,
  isHidden,
}: {
  item: (typeof KEYWORD_NEWS)[number];
  cardWidth: number;
  onPress: (item: (typeof KEYWORD_NEWS)[number], ref: RefObject<View | null>) => void;
  isHidden: boolean;
}) {
  const cardRef = useRef<View>(null);

  return (
    <TouchableOpacity
      ref={cardRef}
      onPress={() => onPress(item, cardRef)}
      activeOpacity={1}
      style={{
        width: cardWidth,
        opacity: 1,
      }}
      className="h-[220px] overflow-hidden rounded-lg"
    >
      <Image
        source={{ uri: item.image }}
        className="absolute inset-0 h-full w-full"
        resizeMode="cover"
      />

      <LinearGradient
        colors={['rgba(0,0,0,0.01)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.8)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <View className="flex-1 justify-end p-3 pb-12">
          <Text numberOfLines={2} className="text-xl font-bold leading-6 text-white">
            {item.keyword}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function NewsListScreen() {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const cardWidth = (screenWidth - 32 - 8) / 2;
  const detailWidth = screenWidth;
  const detailHeight = screenHeight;

  const [selectedItem, setSelectedItem] = useState<(typeof KEYWORD_NEWS)[number] | null>(null);
  const [selectedNews, setSelectedNews] = useState<CardNews | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const progress = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const startWidth = useSharedValue(cardWidth);
  const startHeight = useSharedValue(220);

  const contentOpacity = useSharedValue(1);
  const thumbnailOpacity = useSharedValue(0);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const thumbnailAnimatedStyle = useAnimatedStyle(() => ({
    opacity: thumbnailOpacity.value,
  }));

  const handleCardPress = (
    item: (typeof KEYWORD_NEWS)[number],
    cardRef: RefObject<View | null>
  ) => {
    cardRef.current?.measureInWindow((x, y, width, height) => {
      startX.value = x;
      startY.value = y;
      startWidth.value = width;
      startHeight.value = height;
      progress.value = 0;

      setSelectedItem(item);
      setSelectedNews(null);
      setIsClosing(false);

      contentOpacity.value = 1;
      thumbnailOpacity.value = 0;

      progress.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });

      newsService
        .getNewsById(item.id)
        .then((response) => {
          setSelectedNews(response.data || null);
        })
        .catch((error) => {
          console.error('뉴스 상세 조회 에러:', error);
        });
    });
  };

  const closeOverlay = () => {
    if (isClosing) return;
    setIsClosing(true);
    contentOpacity.value = withTiming(0, {
      duration: 120,
      easing: Easing.out(Easing.ease),
    });
    thumbnailOpacity.value = withTiming(1, {
      duration: 180,
      easing: Easing.out(Easing.ease),
    });
    progress.value = withTiming(
      0,
      {
        duration: 320,
        easing: Easing.out(Easing.cubic),
      },

      (finished) => {
        if (finished) {
          runOnJS(setSelectedItem)(null);
          runOnJS(setSelectedNews)(null);
          runOnJS(setIsClosing)(false);
        }
      }
    );
  };

  const overlayStyle = useAnimatedStyle(() => {
    const currentX = startX.value + (DETAIL_X - startX.value) * progress.value;
    const currentY = startY.value + (DETAIL_Y - startY.value) * progress.value;
    const currentWidth = startWidth.value + (detailWidth - startWidth.value) * progress.value;
    const currentHeight = startHeight.value + (detailHeight - startHeight.value) * progress.value;

    return {
      position: 'absolute',
      left: currentX,
      top: currentY,
      width: currentWidth,
      height: currentHeight,
      zIndex: 100,
    };
  });

  const backdropStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 90,
    backgroundColor: 'rgba(0,0,0,0.35)',
    opacity: progress.value * 0.35,
  }));

  return (
    <View className="flex-1 bg-mono-100">
      <SafeAreaView className="flex-1">
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          className="flex-row items-center gap-2 p-4"
        >
          <ChevronLeft size={28} />
          <Text className="text-lg font-semibold">검색어</Text>
        </TouchableOpacity>

        <FlatList
          data={KEYWORD_NEWS}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
          }}
          columnWrapperStyle={{
            gap: 8,
            marginBottom: 8,
          }}
          renderItem={({ item }) => (
            <NewsGridCard
              item={item}
              cardWidth={cardWidth}
              onPress={handleCardPress}
              isHidden={selectedItem?.id === item.id}
            />
          )}
        />
      </SafeAreaView>

      {selectedItem && (
        <>
          <Animated.View style={backdropStyle} pointerEvents={'box-none'}>
            <TouchableOpacity
              onPress={closeOverlay}
              disabled={isClosing}
              className="absolute inset-0"
              activeOpacity={1}
            />
          </Animated.View>

          <Animated.View style={overlayStyle} pointerEvents={'box-none'}>
            <View className="flex-1 h-full w-full bg-mono-100">
              <Animated.View style={thumbnailAnimatedStyle} className="absolute inset-0">
                <Image
                  source={{ uri: selectedItem.image }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['rgba(0,0,0,0.01)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.8)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                  }}
                />
                <View className="flex-1 justify-end p-6 pb-12">
                  <Text className="text-3xl font-bold text-white">{selectedItem.keyword}</Text>
                </View>
              </Animated.View>

              <Animated.View style={contentAnimatedStyle} className="flex-1 h-full w-full">
                {selectedNews ? (
                  <SafeAreaView className="flex-1 h-full w-full bg-mono-100">
                    <TouchableOpacity
                      onPress={closeOverlay}
                      disabled={isClosing}
                      className="p-4"
                      activeOpacity={1}
                    >
                      <ChevronLeft size={28} />
                    </TouchableOpacity>
                    <NewsPost news={selectedNews} />
                  </SafeAreaView>
                ) : (
                  <SafeAreaView className="flex-1 h-full w-full bg-mono-100">
                    <View className="p-4">
                      <ChevronLeft size={28} />
                      <View className="h-[480px] bg-mono-300 rounded-2xl my-4" />
                    </View>
                  </SafeAreaView>
                )}
              </Animated.View>
            </View>
          </Animated.View>
        </>
      )}
    </View>
  );
}
