import NewsPost from '@/components/news/news-post';
import { useNewsDetail } from '@/context/NewsDetailContext';
import { newsService } from '@/services/newsService';
import type { CardNews } from '@/types';
import type { RefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, RefreshControl, Text, View } from 'react-native';

// ─── 개별 뉴스 아이템 ─────────────────────────────────────────────────────────

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

// ─── HomeScreen ───────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const { open } = useNewsDetail(); // ← context에서 open 함수만 가져옴

  const [news, setNews] = useState<CardNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const headerTranslateY = useRef(new Animated.Value(0)).current;

  // ── 카드 탭 → context.open 호출 ──────────────────────────────────────────
  const handleCardPress = (item: CardNews, cardRef: RefObject<View | null>) => {
    if (!item.image || !item.title) return;
    open({
      newsId: item.id,
      thumbnail: item.image,
      title: item.title,
      cardRef,
    });
  };

  // ── 데이터 로드 ──────────────────────────────────────────────────────────
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

  const handleEndReached = useCallback(() => {
    if (!loading && !refreshing && hasMore) fetchNews(page);
  }, [page, loading, refreshing, hasMore, fetchNews]);

  const handleRefresh = useCallback(() => fetchNews(1, true), [fetchNews]);

  // ── 헤더 hide-on-scroll ───────────────────────────────────────────────────
  const handleScroll = (event: { nativeEvent: { contentOffset: { y: number } } }) => {
    const y = Math.max(0, event.nativeEvent.contentOffset.y);
    const diff = y - lastScrollY.current;
    if (y <= 0) headerTranslateY.setValue(0);
    else if (diff > 5) headerTranslateY.setValue(-100);
    lastScrollY.current = y;
  };

  const headerOpacity = headerTranslateY.interpolate({
    inputRange: [-100, 0],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // ── 렌더 헬퍼 ────────────────────────────────────────────────────────────
  const renderItem = ({ item }: { item: CardNews }) => (
    <NewsItem item={item} onPress={handleCardPress} />
  );

  const renderFooter = () =>
    hasMore ? (
      <View className="py-6 flex-row justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#666" />
      </View>
    ) : null;

  const renderEmpty = () => {
    if (loading)
      return (
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color="#666" />
        </View>
      );
    if (error)
      return (
        <View className="flex-1 justify-center items-center bg-white px-4">
          <Text className="text-gray-800 text-center text-lg mb-2">문제가 발생했습니다</Text>
          <Text className="text-gray-500 text-center text-sm">{error}</Text>
        </View>
      );
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500">불러올 뉴스가 없습니다.</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-mono-100">
      {/* 스크롤에 반응하는 상단 헤더 */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 120,
          zIndex: 10,
          transform: [{ translateY: headerTranslateY }],
          opacity: headerOpacity,
          backgroundColor: '#FFFFFF',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 40,
        }}
      >
        <Image
          source={require('@/assets/images/logo1.png')}
          style={{ width: 75, height: 20 }}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.FlatList
        data={news}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            progressViewOffset={250}
          />
        }
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          scrollY.setValue(event.nativeEvent.contentOffset.y);
          handleScroll(event);
        }}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: 120 }}
      />

      {/* ✅ NewsDetail은 여기서 렌더하지 않음 → _layout.tsx의 Portal이 처리 */}
    </View>
  );
}
