import { useNewsDetail } from '@/context/NewsDetailContext';
import { KEYWORD_NEWS } from '@/utils/mock';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Search } from 'lucide-react-native';
import type { RefObject } from 'react';
import { useRef } from 'react';
import { Dimensions, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - 32 - 8) / 2;

function NewsGridCard({
  item,
  onPress,
}: {
  item: (typeof KEYWORD_NEWS)[number];
  onPress: (item: (typeof KEYWORD_NEWS)[number], ref: RefObject<View | null>) => void;
}) {
  const cardRef = useRef<View>(null);
  return (
    <TouchableOpacity
      ref={cardRef}
      onPress={() => onPress(item, cardRef)}
      activeOpacity={0.9}
      style={{ width: cardWidth, height: 220, borderRadius: 16, overflow: 'hidden' }}
    >
      <Image
        source={{ uri: item.image }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.01)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.82)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', padding: 12, paddingBottom: 14 }}>
          <Text
            numberOfLines={2}
            style={{ fontSize: 14, fontWeight: '800', color: '#fff', lineHeight: 20 }}
          >
            {item.keyword}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function EmptyResult({ keyword }: { keyword: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
      <Text style={{ fontSize: 32, marginBottom: 12 }}>🔍</Text>
      <Text style={{ fontSize: 16, fontWeight: '700', color: '#22272B', marginBottom: 6 }}>
        검색 결과가 없어요
      </Text>
      <Text style={{ fontSize: 13, color: '#898989', textAlign: 'center', lineHeight: 20 }}>
        <Text style={{ fontWeight: '700', color: '#22272B' }}>'{keyword}'</Text>에 대한 뉴스를 찾지
        못했어요{'\n'}다른 키워드로 검색해보세요
      </Text>
    </View>
  );
}

export default function NewsListScreen() {
  const { open } = useNewsDetail();
  const { keyword } = useLocalSearchParams<{ keyword?: string }>();
  const displayKeyword = keyword ?? '검색 결과';

  // 목업: keyword 필터링 (API 연동 시 교체)
  const filteredNews = keyword
    ? KEYWORD_NEWS.filter((n) => n.keyword.toLowerCase().includes(keyword.toLowerCase()))
        .concat(
          // 목업 데이터가 적으므로 결과 없을 때도 전체 노출
          KEYWORD_NEWS
        )
        .filter((v, i, arr) => arr.findIndex((t) => t.id === v.id) === i)
    : KEYWORD_NEWS;

  const handleCardPress = (
    item: (typeof KEYWORD_NEWS)[number],
    cardRef: RefObject<View | null>
  ) => {
    open({ newsId: item.id, thumbnail: item.image, title: item.keyword, cardRef });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F6F6F8' }}>
      <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
        {/* 헤더 */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            gap: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={{
              padding: 10,
              borderRadius: 100,
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#F0EEEC',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChevronLeft size={20} color="#22272B" />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Search size={18} color="#898989" />
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#22272B', flex: 1 }}>
              {displayKeyword}
            </Text>
          </View>
        </View>

        {filteredNews.length === 0 ? (
          <EmptyResult keyword={displayKeyword} />
        ) : (
          <FlatList
            data={filteredNews}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
            columnWrapperStyle={{ gap: 8, marginBottom: 8 }}
            renderItem={({ item }) => <NewsGridCard item={item} onPress={handleCardPress} />}
          />
        )}
      </SafeAreaView>
    </View>
  );
}
