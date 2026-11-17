import DetailHeader from '@/components/common/DetailHeader';
import { glass } from '@/components/common/glass';
import NewsRow from '@/components/saved/NewsRow';
import type { ReadHistory, SavedNews } from '@/types/saved';
import { Stack } from 'expo-router';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  title: string;
  items: (SavedNews | ReadHistory)[];
  variant: 'saved' | 'recent';
  emptyText?: string;
  loading?: boolean; // 최초 로딩
  error?: string; // 요청 실패 메시지
  onRetry?: () => void;
  onEndReached?: () => void; // 다음 페이지 (무한 스크롤)
};

export default function NewsListScreen({
  title,
  items,
  variant,
  emptyText = '아직 아무것도 없어요',
  loading,
  error,
  onRetry,
  onEndReached,
}: Props) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
      <Stack.Screen
        options={{ headerShown: false, animation: 'slide_from_right', gestureEnabled: true }}
      />
      <DetailHeader title={title} subtitle={`${items.length}개`} />
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <NewsRow item={item} variant={variant} />}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, marginLeft: 86, backgroundColor: glass.inkFaint }} />
        )}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={{ marginTop: 80 }} color="#898989" />
          ) : error ? (
            <View style={{ alignItems: 'center', marginTop: 80, gap: 8 }}>
              <Text style={{ color: glass.inkMuted }}>목록을 불러오지 못했어요</Text>
              {onRetry ? (
                <TouchableOpacity onPress={onRetry}>
                  <Text style={{ fontWeight: '700', color: glass.ink }}>다시 시도</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 80, color: glass.inkMuted }}>
              {emptyText}
            </Text>
          )
        }
      />
    </SafeAreaView>
  );
}
