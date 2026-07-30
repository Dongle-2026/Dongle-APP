import { newsService } from '@/services/newsService';
import type { CardNews } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { Bookmark, Heart, MessageCircle } from 'lucide-react-native';
import { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface CardNewsPostProps {
  news: CardNews;
  onCommentPress?: (newsId: string) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function CardNewsPost({ news, onCommentPress }: CardNewsPostProps) {
  const [isLiked, setIsLiked] = useState(news.isLiked);
  const [isSaved, setIsSaved] = useState(news.isSaved);
  const [likeCount, setLikeCount] = useState(news.likes);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const slides = news.slides || [];
  const hasMultipleSlides = slides.length > 1;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!hasMultipleSlides) return;

    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / screenWidth);
    setCurrentSlideIndex(currentIndex);
  };

  const handleLike = async () => {
    setIsLoading(true);
    try {
      if (isLiked) {
        await newsService.unlikeNews(news.id);
        setIsLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1));
      } else {
        await newsService.likeNews(news.id);
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('좋아요 처리 중 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (isSaved) {
        await newsService.unsaveNews(news.id);
        setIsSaved(false);
      } else {
        await newsService.saveNews(news.id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('스크랩 처리 중 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="relative h-[480px] bg-mono-100 mb-8">
      <Image
        source={{ uri: slides[0]?.image }}
        className="absolute inset-0 w-full h-full"
        resizeMode="cover"
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
          <View key={slide.id} style={{ width: screenWidth }}>
            <LinearGradient
              colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              className="w-full h-full"
            >
              <View className="w-full h-full">
                <View className="flex-1 justify-end items-start px-4 pb-24">
                  <Text className="text-white text-3xl font-bold mb-4 leading-[42px] w-3/4">
                    {slide.title}
                  </Text>
                  <Text className="text-white text-lg leading-7">{slide.description}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        ))}
      </ScrollView>
      {/* Slide Dots */}
      {hasMultipleSlides && (
        <View className="flex-row gap-2 absolute bottom-4 left-0 right-0 justify-center items-center">
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
      {/* Action Buttons */}
      <View className="p-4 flex-row items-center space-x-4 gap-2 absolute bottom-3 left-0 right-0 ">
        <TouchableOpacity onPress={() => onCommentPress?.(news.id)} className="active:opacity-70">
          <MessageCircle size={24} color="white" />
        </TouchableOpacity>

        <View className="flex-1" />
        <View className="flex-row gap-1 items-center">
          <TouchableOpacity onPress={handleLike} disabled={isLoading} className="active:opacity-70">
            <Heart
              size={24}
              color={isLiked ? '#ef4444' : 'white'}
              fill={isLiked ? '#ef4444' : 'none'}
            />
          </TouchableOpacity>
          <Text className="font-semibold text-white text-sm">{likeCount}</Text>
        </View>

        <TouchableOpacity onPress={handleSave} disabled={isLoading} className="active:opacity-70">
          <Bookmark
            size={24}
            color={isSaved ? '#fbbf24' : 'white'}
            fill={isSaved ? '#fbbf24' : 'none'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
