import NewsListScreen from '@/components/saved/NewsListScreen';
import { useSavedNews } from '@/hooks/queries/queries';

export default function SavedNewsScreen() {
  const q = useSavedNews(); // GET /api/me/saved-news
  return (
    <NewsListScreen
      title="저장한 기사"
      variant="saved"
      items={q.data ?? []}
      emptyText="저장한 기사가 없어요"
      loading={q.isLoading}
      error={q.error?.message}
      onRetry={() => void q.refetch()}
      onEndReached={() => {
        if (q.hasNextPage && !q.isFetchingNextPage) void q.fetchNextPage();
      }}
    />
  );
}
