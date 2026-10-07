import NewsListScreen from '@/components/saved/NewsListScreen';
import { mockReadHistory } from '@/utils/mock';

export default function RecentNewsScreen() {
  return (
    <NewsListScreen
      title="최근 읽은 기사"
      variant="recent"
      items={mockReadHistory}
      emptyText="아직 읽은 기사가 없어요"
    />
  );
}
