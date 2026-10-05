import HomeHeader from '@/components/home/HomeHeader';
import NewsPost from '@/components/news/news-post';
import { useNewsDetail } from '@/context/NewsDetailContext';
import { newsService } from '@/services/newsService';
import type { CardNews } from '@/types';
import type { RefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function NewsItem({
  item,
  onPress,
}: {
  item: CardNews;
  onPress: (item: CardNews, cardRef: RefObject<View | null>) => void;
}) {
  const cardRef = useRef<View>(null);
  return (
    <View ref={cardRef} collapsable={false}>
      <NewsPost news={item} isPress={true} onPress={() => onPress(item, cardRef)} />
    </View>
  );
}

export default function HomeScreen() {
  const { open } = useNewsDetail();
  const insets = useSafeAreaInsets();

  const [news, setNews] = useState<CardNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCardPress = (item: CardNews, cardRef: RefObject<View | null>) => {
    if (!item.image || !item.title) return;
    open({ newsId: item.id, thumbnail: item.image, title: item.title, cardRef });
  };

  const fetchNews = useCallback(async (pageNum = 1, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

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
        setHasMore(data.length === 10);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '뉴스를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNews(1);
  }, [fetchNews]);

  const handleRefresh = useCallback(() => fetchNews(1, true), [fetchNews]);

  const handleEndReached = useCallback(() => {
    if (!loading && !refreshing && hasMore) fetchNews(page);
  }, [page, loading, refreshing, hasMore, fetchNews]);

  const renderFooter = () =>
    hasMore ? (
      <View style={{ paddingVertical: 24, alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#898989" />
      </View>
    ) : null;

  const renderEmpty = () => {
    if (loading)
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
          <ActivityIndicator size="large" color="#898989" />
        </View>
      );
    if (error)
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ fontSize: 16, color: '#22272B', fontWeight: '700', marginBottom: 6 }}>
            문제가 발생했습니다
          </Text>
          <Text style={{ fontSize: 13, color: '#898989', textAlign: 'center' }}>{error}</Text>
        </View>
      );
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
        <Text style={{ fontSize: 13, color: '#898989' }}>불러올 뉴스가 없습니다.</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF9EC' }}>
      <Animated.FlatList
        data={news}
        renderItem={({ item }) => <NewsItem item={item} onPress={handleCardPress} />}
        keyExtractor={(item) => item.id}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={<HomeHeader topInset={insets.top} />}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        scrollEventThrottle={16}
      />
    </View>
  );
}
