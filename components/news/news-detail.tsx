import NewsPost from '@/components/news/news-post';
import NewsCardTransition, {
    type NewsCardTransitionRef,
} from '@/components/transition/news-card-transition';
import { newsService } from '@/services';
import type { CardNews } from '@/types';
import { ChevronLeft } from 'lucide-react-native';
import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type NewsDetailProps = {
  newsId: string;
  thumbnail: string;
  title: string;
  cardRef: RefObject<View | null>;
  onClose: () => void;
};

export default function NewsDetail({
  newsId,
  thumbnail,
  title,
  cardRef,
  onClose,
}: NewsDetailProps) {
  const [news, setNews] = useState<CardNews | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const transitionRef = useRef<NewsCardTransitionRef>(null);

  /**
   * newsId가 변경될 때마다
   * 해당 뉴스의 상세 데이터를 조회
   */
  useEffect(() => {
    setNews(null);
    setIsClosing(false);

    newsService
      .getNewsById(newsId)
      .then((response) => {
        setNews(response.data || null);
      })
      .catch((error) => {
        console.error('뉴스 상세 조회 에러:', error);
      });
  }, [newsId]);

  /**
   * 헤더의 뒤로가기 버튼
   */
  const handleClose = () => {
    if (isClosing) return;

    setIsClosing(true);
    transitionRef.current?.close();
  };

  return (
    <NewsCardTransition
      ref={transitionRef}
      thumbnail={thumbnail}
      title={title}
      cardRef={cardRef}
      onClose={() => {
        setIsClosing(false);
        onClose();
      }}
    >
      <SafeAreaView className="flex-1 h-full w-full bg-mono-100">
        {/* 뒤로가기 */}
        <TouchableOpacity
          onPress={handleClose}
          disabled={isClosing}
          className="p-4"
          activeOpacity={1}
        >
          <ChevronLeft size={28} />
        </TouchableOpacity>

        {/* 뉴스 로딩 */}
        {!news ? (
          <View className="h-[480px] bg-mono-300 rounded-2xl mx-4 my-2" />
        ) : (
          <NewsPost news={news} />
        )}
      </SafeAreaView>
    </NewsCardTransition>
  );
}
