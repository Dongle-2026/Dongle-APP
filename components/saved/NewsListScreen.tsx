import DetailHeader from '@/components/common/DetailHeader';
import { glass } from '@/components/common/glass';
import NewsRow from '@/components/saved/NewsRow';
import { ReadHistory, SavedNews } from '@/types/saved';
import { Stack } from 'expo-router';
import { FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  title: string;
  items: (SavedNews | ReadHistory)[]; // 배열 타입으로 바르게 수정
  variant: 'saved' | 'recent';
  emptyText?: string;
};

export default function NewsListScreen({
  title,
  items,
  variant,
  emptyText = '아직 아무것도 없어요',
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
