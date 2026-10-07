import HomeHeader from '@/components/home/HomeHeader';
import NewsPost from '@/components/news/news-post';
import { useNewsDetail } from '@/context/NewsDetailContext';
import { newsService } from '@/services/newsService';
import type { CardNews } from '@/types';
import { useNavigation } from 'expo-router';
import type { RefObject } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'; // [NEW] useMemo
import {
  ActivityIndicator,
  Animated,
  type FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Text,
  View,
} from 'react-native';
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
  const navigation = useNavigation(); // [NEW]

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

  const scrollY = useRef(new Animated.Value(0)).current;
  const [headerH, setHeaderH] = useState(160); // onLayout으로 실제 높이로 교체됨

  const headerAnim = useMemo(() => {
    const h = Math.max(headerH, 1);
    return {
      opacity: scrollY.interpolate({
        inputRange: [0, h * 0.55],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      }),
      translateY: scrollY.interpolate({
        inputRange: [0, h],
        outputRange: [0, h * 0.75],
        extrapolate: 'clamp',
      }),
    };
  }, [headerH, scrollY]);

  // 홈 탭 재클릭 → 최상단 스크롤 → refresh ───────────────────────
  const listRef = useRef<FlatList<CardNews>>(null);
  const offsetY = useRef(0);
  const pendingRefresh = useRef(false);
  const refreshRef = useRef(handleRefresh);
  const refreshingRef = useRef(refreshing);
  refreshRef.current = handleRefresh;
  refreshingRef.current = refreshing;

  const onScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
        listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
          const y = e.nativeEvent.contentOffset.y;
          offsetY.current = y;
          // 최상단 스크롤이 끝나면(예약돼 있을 때) 기존 refresh 로직 실행
          if (pendingRefresh.current && y <= 1) {
            pendingRefresh.current = false;
            refreshRef.current();
          }
        },
      }),
    [scrollY]
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unsubscribe = (navigation as any).addListener('tabPress', () => {
      if (!navigation.isFocused() || refreshingRef.current) return; // 다른 탭에서 홈으로 "이동"하는 경우는 제외
      if (offsetY.current <= 1) {
        refreshRef.current(); // 이미 최상단이면 바로 refresh
        return;
      }
      pendingRefresh.current = true;
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    });
    return unsubscribe;
  }, [navigation]);

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
    <View style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
      <Animated.FlatList
        ref={listRef}
        data={news}
        renderItem={({ item }) => <NewsItem item={item} onPress={handleCardPress} />}
        keyExtractor={(item) => item.id}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <Animated.View
            onLayout={(e) => setHeaderH(e.nativeEvent.layout.height)}
            style={{
              opacity: headerAnim.opacity,
              transform: [{ translateY: headerAnim.translateY }],
            }}
          >
            <HomeHeader topInset={insets.top} />
          </Animated.View>
        }
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        progressViewOffset={insets.top + 8}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        scrollEventThrottle={16}
        onScroll={onScroll} // [NEW]
        onScrollBeginDrag={() => {
          pendingRefresh.current = false;
        }}
      />
    </View>
  );
}
