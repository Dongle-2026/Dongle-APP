// ⚠ 이 파일에서 기존 RecentSearchSection / TrendingSection / SuggestionList / KeywordCard 는 그대로 두고
//    SearchScreen(default export)만 아래 코드로 교체하세요. (3곳 Glass 패치는 답변 본문 참고)
import CategorySlider from '@/components/category-slider';
import { GlassCard } from '@/components/common/glass';
import SearchMorphBar from '@/components/search/SearchMorphBar';
import { CATEGORIES, KEYWORD_NEWS, RECENT_SEARCHES, TRENDING_KEYWORDS } from '@/utils/mock';
import { router } from 'expo-router';
import { ArrowRight, Clock, Minus, Search, TrendingDown, TrendingUp, X } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── 상수 ─────────────────────────────────────────────────────────────────────

const C = {
  ink: '#22272B',
  ink2: '#898989',
  ink3: '#D9D9D9',
  point: '#FFDC53',
  bg: '#FFF9EC',
  surf: '#FFFFFF',
  border: '#F0EEEC',
  border2: '#E8E4E0',
};

// ─── 최근 검색어 ──────────────────────────────────────────────────────────────

function RecentSearchSection({
  searches,
  onPress,
  onRemove,
  onClearAll,
}: {
  searches: string[];
  onPress: (q: string) => void;
  onRemove: (q: string) => void;
  onClearAll: () => void;
}) {
  if (searches.length === 0) return null;
  return (
    <View style={{ paddingVertical: 28 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 16,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '800', color: C.ink }}>최근 검색어</Text>
        <TouchableOpacity onPress={onClearAll} activeOpacity={0.7}>
          <Text style={{ fontSize: 12, color: C.ink2, fontWeight: '500' }}>전체 삭제</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          maxHeight: 76,
          overflow: 'hidden',
        }}
      >
        {searches.map((q) => (
          <GlassCard key={q} onPress={() => onPress(q)} padding={2} radius={20} shadow="none">
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
                paddingVertical: 8,
                gap: 5,
              }}
            >
              <Clock size={12} color={C.ink2} />
              <Text style={{ fontSize: 13, color: C.ink }}>{q}</Text>

              <TouchableOpacity onPress={() => onRemove(q)} activeOpacity={0.7} hitSlop={8}>
                <X size={11} color={C.ink2} />
              </TouchableOpacity>
            </View>
          </GlassCard>
        ))}
      </View>
    </View>
  );
}

// ─── 실시간 트렌드 ────────────────────────────────────────────────────────────

const TREND_ICON = {
  up: <TrendingUp size={11} color="#34C759" strokeWidth={2.5} />,
  down: <TrendingDown size={11} color="#FF3B30" strokeWidth={2.5} />,
  same: <Minus size={11} color={C.ink3} strokeWidth={2.5} />,
} as const;

function TrendingSection({ onPress }: { onPress: (q: string) => void }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {[TRENDING_KEYWORDS.slice(0, 4), TRENDING_KEYWORDS.slice(4, 8)].map((col, ci) => (
        <View key={ci} style={{ flex: 1 }}>
          {col.map((item, i) => (
            <TouchableOpacity
              key={item.rank}
              onPress={() => onPress(item.keyword)}
              activeOpacity={0.75}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                paddingVertical: 10,
                borderBottomWidth: i < col.length - 1 ? 1 : 0,
                borderBottomColor: C.border,
              }}
            >
              <Text
                style={{
                  width: 18,
                  fontSize: 12,
                  fontWeight: '800',
                  color: item.rank <= 3 ? C.ink : C.ink2,
                  textAlign: 'center',
                }}
              >
                {item.rank}
              </Text>
              <Text
                style={{ flex: 1, fontSize: 13, fontWeight: '600', color: C.ink }}
                numberOfLines={1}
              >
                {item.keyword}
              </Text>
              {TREND_ICON[item.change]}
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}

// ─── 자동완성 ─────────────────────────────────────────────────────────────────

function SuggestionList({ query, onSelect }: { query: string; onSelect: (q: string) => void }) {
  const matched = TRENDING_KEYWORDS.filter((t) =>
    t.keyword.toLowerCase().includes(query.toLowerCase())
  ).map((m) => m.keyword);

  const items = query.trim()
    ? [query.trim(), ...matched.filter((k) => k !== query.trim())].slice(0, 6)
    : matched.slice(0, 6);

  if (items.length === 0) return null;

  return (
    <View
      style={{
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
      }}
    >
      {items.map((kw, i) => (
        <TouchableOpacity
          key={`${kw}-${i}`}
          onPress={() => onSelect(kw)}
          activeOpacity={0.75}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingHorizontal: 16,
            paddingVertical: 13,
            borderBottomWidth: i < items.length - 1 ? 1 : 0,
            borderBottomColor: C.border,
          }}
        >
          <Search size={14} color={C.ink2} />
          <Text style={{ flex: 1, fontSize: 14, color: C.ink, fontWeight: '500' }}>{kw}</Text>
          <ArrowRight size={13} color={C.ink3} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── 키워드 카드 ──────────────────────────────────────────────────────────────

function KeywordCard({
  item,
  onPress,
}: {
  item: (typeof KEYWORD_NEWS)[number];
  onPress: () => void;
}) {
  const { width: screenWidth } = Dimensions.get('window');
  const cardWidth = (screenWidth - 32) / 2;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{ borderRadius: 16, overflow: 'hidden', width: cardWidth, height: 100 }}
    >
      <Image
        source={{ uri: item.image }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        resizeMode="cover"
      />
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.38)',
        }}
      />
      <View style={{ flex: 1, justifyContent: 'flex-end', paddingLeft: 12, paddingBottom: 12 }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: '#fff',
            lineHeight: 20,
          }}
        >
          {item.keyword}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [recentSearches, setRecentSearches] = useState<string[]>(RECENT_SEARCHES);

  // 0 = 기본 화면(버튼), 1 = 검색 중(검색창). 검색바·그리드·오버레이가 이 값 하나로 같이 움직임
  const progress = useRef(new Animated.Value(0)).current;
  const gridOpacity = progress.interpolate({
    inputRange: [0, 0.5],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const overlayOpacity = progress.interpolate({
    inputRange: [0.3, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const cancel = useCallback(() => {
    Keyboard.dismiss();
    setIsSearching(false);
  }, []);

  // Android 뒤로가기: 검색 중이면 검색 종료
  useEffect(() => {
    if (!isSearching) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      cancel();
      return true;
    });
    return () => sub.remove();
  }, [isSearching, cancel]);

  // 기존 검색 로직 유지
  const executeSearch = useCallback(
    (kw: string) => {
      const q = kw.trim();
      if (!q) return;
      setRecentSearches((prev) => [q, ...prev.filter((s) => s !== q)].slice(0, 5));
      Keyboard.dismiss();
      progress.setValue(0);
      setIsSearching(false);
      setQuery('');
      router.push({ pathname: '/news-list', params: { keyword: q } });
    },
    [progress]
  );

  const removeRecent = useCallback(
    (q: string) => setRecentSearches((p) => p.filter((s) => s !== q)),
    []
  );
  const clearAllRecent = useCallback(() => setRecentSearches([]), []);

  const filteredKeywords =
    selectedCategory === 'all'
      ? KEYWORD_NEWS
      : KEYWORD_NEWS.filter((n) => (n as any).category === selectedCategory);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F9F9' }} edges={['top']}>
      <SearchMorphBar
        title="주목할 소식"
        open={isSearching}
        onOpen={() => setIsSearching(true)}
        onCancel={cancel}
        onClosed={() => setQuery('')}
        query={query}
        onChangeQuery={setQuery}
        onSubmit={executeSearch}
        progress={progress}
      />

      <View style={{ flex: 1 }}>
        {/* [기본 화면] 카테고리 + 키워드 그리드 */}
        <Animated.View
          pointerEvents={isSearching ? 'none' : 'auto'}
          style={{ flex: 1, opacity: gridOpacity }}
        >
          <View style={{ height: 80 }}>
            <CategorySlider
              category={CATEGORIES}
              selectedCategory={selectedCategory}
              onPress={(id) => setSelectedCategory(id)}
            />
          </View>
          <FlatList
            data={filteredKeywords}
            numColumns={2}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={{ paddingHorizontal: 12 }}
            columnWrapperStyle={{ gap: 10, marginBottom: 10 }}
            renderItem={({ item }) => (
              <KeywordCard
                item={item}
                onPress={() => {
                  setRecentSearches((prev) =>
                    [item.keyword, ...prev.filter((s) => s !== item.keyword)].slice(0, 5)
                  );
                  router.push({ pathname: '/news-list', params: { keyword: item.keyword } });
                }}
              />
            )}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: C.ink,
                    marginTop: 16,
                    marginBottom: 8,
                  }}
                >
                  해당 카테고리 키워드가 없어요
                </Text>
                <Text style={{ fontSize: 12, color: C.ink2 }}>다른 카테고리를 선택해보세요</Text>
              </View>
            }
          />
        </Animated.View>

        <Animated.View
          pointerEvents={isSearching ? 'auto' : 'none'}
          style={[StyleSheet.absoluteFill, { backgroundColor: '#F9F9F9', opacity: overlayOpacity }]}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
          >
            {query.trim().length > 0 ? (
              <View style={{ marginBottom: 24 }}>
                <SuggestionList query={query} onSelect={executeSearch} />
              </View>
            ) : (
              <>
                <RecentSearchSection
                  searches={recentSearches}
                  onPress={executeSearch}
                  onRemove={removeRecent}
                  onClearAll={clearAllRecent}
                />
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 12 }}
                >
                  <Text style={{ fontSize: 18, fontWeight: '800', color: C.ink }}>
                    실시간 트렌드
                  </Text>
                  <View
                    style={{
                      backgroundColor: C.point,
                      borderRadius: 6,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: '800', color: C.ink }}>LIVE</Text>
                  </View>
                </View>
                <GlassCard padding={16} radius={20} shadow="none">
                  <TrendingSection onPress={executeSearch} />
                </GlassCard>
              </>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
