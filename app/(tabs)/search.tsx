import CategorySlider from '@/components/category-slider';
import { RECENT_SEARCHES, TRENDING_KEYWORDS } from '@/mocks/searchMock';
import { CATEGORIES, KEYWORD_NEWS } from '@/utils/mock';
import { router } from 'expo-router';
import { ArrowRight, Clock, Minus, Search, TrendingDown, TrendingUp, X } from 'lucide-react-native';
import { useCallback, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
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
  bg: '#F6F6F8',
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
    <View style={{ marginBottom: 36 }}>
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
          <TouchableOpacity
            key={q}
            onPress={() => onPress(q)}
            activeOpacity={0.75}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: C.surf,
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: C.border2,
            }}
          >
            <Clock size={12} color={C.ink2} />
            <Text style={{ fontSize: 13, color: C.ink }}>{q}</Text>
            <TouchableOpacity onPress={() => onRemove(q)} activeOpacity={0.7} hitSlop={8}>
              <X size={11} color={C.ink3} />
            </TouchableOpacity>
          </TouchableOpacity>
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
    <View style={{ marginBottom: 4 }}>
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
        backgroundColor: C.surf,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: C.border2,
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
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{ flex: 1, aspectRatio: 3 / 3.8, borderRadius: 6, overflow: 'hidden' }}
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 16,
            fontWeight: '800',
            color: '#fff',
            lineHeight: 20,
            textAlign: 'center',
          }}
        >
          {item.keyword}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── 메인 ─────────────────────────────────────────────────────────────────────

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [recentSearches, setRecentSearches] = useState<string[]>(RECENT_SEARCHES);

  const inputRef = useRef<TextInput>(null);
  // 기본화면(카테고리+그리드) fade: 검색 중엔 숨김
  const gridFade = useRef(new Animated.Value(1)).current;
  // 검색 오버레이 fade
  const searchFade = useRef(new Animated.Value(0)).current;

  const enterSearch = useCallback(() => {
    setIsSearching(true);
    Animated.parallel([
      Animated.timing(gridFade, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(searchFade, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const exitSearch = useCallback(() => {
    Keyboard.dismiss();
    Animated.parallel([
      Animated.timing(searchFade, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(gridFade, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setIsSearching(false);
      setQuery('');
    });
  }, []);

  const executeSearch = useCallback((kw: string) => {
    const q = kw.trim();
    if (!q) return;
    setRecentSearches((prev) => [q, ...prev.filter((s) => s !== q)].slice(0, 5));
    Keyboard.dismiss();
    // 애니메이션 즉시 리셋
    searchFade.setValue(0);
    gridFade.setValue(1);
    setIsSearching(false);
    setQuery('');
    router.push({ pathname: '/news-list', params: { keyword: q } });
  }, []);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          검색바 — 항상 렌더, 절대 사라지지 않음
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <View
        style={{
          padding: 16,
          zIndex: 20,
          backgroundColor: C.bg,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {/* 검색 입력창 */}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: C.surf,
              borderRadius: 14,
              padding: 14,
              gap: 10,
              borderWidth: 1,
              borderColor: C.border2,
              shadowColor: '#000',
              shadowOpacity: 0.02,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: isSearching ? 2 : 1,
            }}
          >
            <Search size={17} color={isSearching ? C.ink : C.ink2} strokeWidth={2.2} />

            {/* 비활성: 탭하면 검색모드 진입 */}
            {!isSearching ? (
              <TouchableOpacity onPress={enterSearch} activeOpacity={1} style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, color: C.ink3, fontWeight: '500' }}>
                  지금 주목할 소식
                </Text>
              </TouchableOpacity>
            ) : (
              /* 활성: 실제 TextInput */
              <TextInput
                ref={inputRef}
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={() => executeSearch(query)}
                placeholder="지금 주목할 소식"
                placeholderTextColor={C.ink3}
                returnKeyType="search"
                style={{
                  flex: 1,
                  fontSize: 15,
                  color: C.ink,
                  fontWeight: '500',
                  paddingVertical: 0,
                }}
              />
            )}

            {/* 지우기 버튼 */}
            {isSearching && query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.7}>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: C.bg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={12} color={C.ink2} strokeWidth={2.5} />
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* 취소 버튼 */}
          {isSearching && (
            <TouchableOpacity onPress={exitSearch} activeOpacity={0.7}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: C.ink }}>취소</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          [검색 중] 최근검색어 + 트렌드 + 자동완성
          absolute로 깔아서 검색바 아래부터 채움
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Animated.View
        pointerEvents={isSearching ? 'auto' : 'none'}
        style={{
          position: 'absolute',
          // 검색바(zIndex 20) 아래, top은 검색바가 차지하는 높이만큼
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          paddingTop: isSearching ? 140 : 0,
          backgroundColor: C.bg,
          zIndex: 10,
          opacity: searchFade,
        }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
        >
          {/* 자동완성: 입력 있을 때 */}
          {query.trim().length > 0 && (
            <View style={{ marginBottom: 24 }}>
              <SuggestionList query={query} onSelect={executeSearch} />
            </View>
          )}

          {/* 최근 검색어 + 트렌드: 입력 없을 때 */}
          {query.trim().length === 0 && (
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
                <Text style={{ fontSize: 18, fontWeight: '800', color: C.ink }}>실시간 트렌드</Text>
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
              <View
                style={{
                  backgroundColor: C.surf,
                  borderRadius: 20,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: C.border,
                }}
              >
                <TrendingSection onPress={executeSearch} />
              </View>
            </>
          )}
        </ScrollView>
      </Animated.View>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          [기본 화면] 카테고리 + 키워드 그리드
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Animated.View
        pointerEvents={isSearching ? 'none' : 'auto'}
        style={{ flex: 1, opacity: gridFade, backgroundColor: C.ink }}
      >
        <View style={{ backgroundColor: C.bg }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              paddingHorizontal: 16,
              paddingTop: 4,
            }}
          >
            <Image
              source={require('@/assets/images/fire.png')}
              style={{
                width: 32,
                height: 32,
              }}
            />
            <Text style={{ fontSize: 18, fontWeight: '800', color: C.ink }}>실시간 트렌드</Text>

            {/* <View
            style={{
              backgroundColor: C.point,
              borderRadius: 6,
              paddingHorizontal: 6,
              paddingVertical: 2,
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: '800', color: C.ink }}>HOT</Text>
          </View> */}
          </View>

          <View style={{ height: 80 }}>
            <CategorySlider
              category={CATEGORIES}
              selectedCategory={selectedCategory}
              onPress={(id) => setSelectedCategory(id)}
            />
          </View>
        </View>

        <FlatList
          data={filteredKeywords}
          numColumns={3}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={{
            paddingHorizontal: 12,
            backgroundColor: C.ink,
            paddingVertical: 16,
          }}
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
              <Search color={'white'} size={28} />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '700',
                  color: C.bg,
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
    </SafeAreaView>
  );
}
