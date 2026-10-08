import NewsListScreen from '@/components/saved/NewsListScreen';
import { mockReadHistory } from '@/utils/mock'; // TODO: 저장 기사 스토어/API로 교체 (현재 saved.tsx도 같은 mock 사용 중)

export default function SavedNewsScreen() {
  return (
    <NewsListScreen
      title="저장한 기사"
      variant="saved"
      items={mockReadHistory}
      emptyText="저장한 기사가 없어요"
    />
  );
}
