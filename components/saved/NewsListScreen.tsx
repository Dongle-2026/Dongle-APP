import DetailHeader from '@/components/common/DetailHeader';
import { glass } from '@/components/common/glass';
import NewsRow, { type NewsLite } from '@/components/saved/NewsRow';
import { Stack } from 'expo-router';
import { FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = { title: string; items: NewsLite[]; variant: 'saved' | 'recent'; emptyText?: string };

export default function NewsListScreen({
  title,
  items,
  variant,
  emptyText = '아직 아무것도 없어요',
}: Props) {
  // 최근 읽은 뉴스: readAt이 있으면 최신순 정렬, 없으면 데이터 순서 유지(이미 최신순이라고 가정)
  const data =
    variant === 'recent'
      ? [...items].sort(
          (a, b) => new Date(b.readAt ?? 0).getTime() - new Date(a.readAt ?? 0).getTime()
        )
      : items;
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
      <Stack.Screen
        options={{ headerShown: false, animation: 'slide_from_right', gestureEnabled: true }}
      />
      <DetailHeader title={title} subtitle={`${items.length}개`} />
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <NewsRow item={item} variant={variant} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, gap: 10 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 80, color: glass.inkMuted }}>
            {emptyText}
          </Text>
        }
      />
    </SafeAreaView>
  );
}
