import CardNewsPost from '@/components/CardNewsPost';
import { newsService } from '@/services/newsService';
import type { CardNews } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const [news, setNews] = useState<CardNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 초기 뉴스 로드
  const fetchNews = useCallback(async (pageNum: number = 1, isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setLoading(true);
      }

      const response = await newsService.getLatestNews(pageNum, 10);

      const data = response.data ?? [];

      if (data.length > 0) {
        if (isRefresh || pageNum === 1) {
          setNews(data);
          setPage(2);
        } else {
          setNews((prev) => [...prev, ...data]);
          setPage(pageNum + 1);
        }

        // 받은 데이터가 limit 미만이면 더 이상 데이터 없음
        setHasMore(data.length === 10);
        setError(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '뉴스를 불러올 수 없습니다.';
      setError(errorMessage);
      console.error('뉴스 로드 에러:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    fetchNews(1);
  }, [fetchNews]);

  // 무한 스크롤 핸들러
  const handleEndReached = useCallback(() => {
    if (!loading && !refreshing && hasMore) {
      fetchNews(page);
    }
  }, [page, loading, refreshing, hasMore, fetchNews]);

  // 새로고침 핸들러
  const handleRefresh = useCallback(() => {
    fetchNews(1, true);
  }, [fetchNews]);

  const renderItem = ({ item }: { item: CardNews }) => (
    <CardNewsPost
      news={item}
      onCommentPress={(newsId) => {
        // 댓글 화면으로 이동할 수 있음
        console.log('댓글 보기:', newsId);
      }}
    />
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View className="py-6 flex-row justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color="#666" />
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 justify-center items-center bg-white px-4">
          <Text className="text-gray-800 text-center text-lg mb-2">문제가 발생했습니다</Text>
          <Text className="text-gray-500 text-center text-sm">{error}</Text>
        </View>
      );
    }

    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500">불러올 뉴스가 없습니다.</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-mono-100">
      <TouchableOpacity className="p-4 bg-mono-200 gap-1">
        <Text className="text-lg font-semibold">투데이 돈글</Text>
        <Text className="text-md">오늘의 주요소식 바로 확인하기</Text>
      </TouchableOpacity>
      <FlatList
        data={news}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      />
    </View>
  );
}
