import { GlassIconButton } from '@/components/common/glass';
import { useNewsDetail } from '@/context/NewsDetailContext';
import { useNewsSearch } from '@/hooks/queries/queries';
import { CardNews } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Search } from 'lucide-react-native';
import type { RefObject } from 'react';
import { useRef } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - 32 - 8) / 2;

function NewsGridCard({
  item,
  onPress,
}: {
  item: CardNews;
  onPress: (item: CardNews, ref: RefObject<View | null>) => void;
}) {
  const cardRef = useRef<View>(null);
  return (
    <TouchableOpacity
      ref={cardRef}
      onPress={() => onPress(item, cardRef)}
      activeOpacity={0.9}
      style={{
        width: cardWidth,
        height: 220,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#D9D9D9',
      }}
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
        <View
          style={{
            position: 'absolute',
            left: 12,
            top: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingVertical: 6,
            paddingHorizontal: 8,
            backgroundColor: '#fff',
            borderRadius: 999,
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: '600' }}>{item.category}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-end', padding: 12, paddingBottom: 24 }}>
          <Text
            numberOfLines={3}
            style={{ fontSize: 17, fontWeight: '600', color: '#fff', lineHeight: 24 }}
          >
            {item.title}
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

  const {
    data: newsList,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useNewsSearch(keyword ?? '');

  const newsData = newsList ?? [];

  const handleCardPress = (item: CardNews, cardRef: RefObject<View | null>) => {
    open({ newsId: String(item.id), image: item.image, title: item.title, cardRef });
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>문제가 발생했습니다.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
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
          <GlassIconButton icon={ChevronLeft} label="이전" onPress={() => router.back()} />
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 4,
            }}
          >
            <Search size={18} color="#898989" />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#22272B', flex: 1 }}>
              {displayKeyword}
            </Text>
          </View>
        </View>

        {newsData.length === 0 ? (
          <EmptyResult keyword={displayKeyword} />
        ) : (
          <FlatList
            data={newsData}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
            columnWrapperStyle={{ gap: 8, marginBottom: 8 }}
            renderItem={({ item }) => <NewsGridCard item={item} onPress={handleCardPress} />}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                void fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
          />
        )}
      </SafeAreaView>
    </View>
  );
}
