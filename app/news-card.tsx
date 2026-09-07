import CardNewsPost from '@/components/cards/card-news-post';
import { newsService } from '@/services';
import type { CardNews } from '@/types';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function NewsCardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [news, setNews] = useState<CardNews | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        if (!id) return;

        const response = await newsService.getNewsById(id);
        setNews(response.data || null);
      } catch (error) {
        console.error('뉴스 상세 조회 에러:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!news) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>뉴스를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-mono-100 h-full">
      <TouchableOpacity
        onPress={() => {
          router.back();
        }}
        className="p-4 gap-2 flex-row items-center"
      >
        <ChevronLeft size={28} />
      </TouchableOpacity>
      <CardNewsPost news={news} />
    </SafeAreaView>
  );
}

export default NewsCardScreen;
