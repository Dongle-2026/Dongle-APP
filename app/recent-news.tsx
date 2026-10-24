import NewsListScreen from '@/components/saved/NewsListScreen';
import { useReadHistory } from '@/hooks/queries/queries';

export default function RecentNewsScreen() {
  const q = useReadHistory(); // GET /api/me/read-history (서버가 최근 읽은 순으로 정렬)
  return (
    <NewsListScreen
      title="최근 읽은 기사"
      variant="recent"
      items={q.data ?? []}
      emptyText="아직 읽은 기사가 없어요"
      loading={q.isLoading}
      error={q.error?.message}
      onRetry={() => void q.refetch()}
      onEndReached={() => {
        if (q.hasNextPage && !q.isFetchingNextPage) void q.fetchNextPage();
      }}
    />
  );
}
