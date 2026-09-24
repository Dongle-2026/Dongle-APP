import NewsBody from '@/components/news/news-body';
import NewsPost from '@/components/news/news-post';
import NewsCardTransition, {
  type NewsCardTransitionRef,
} from '@/components/transition/news-card-transition';
import { newsService } from '@/services';
import type { CardNews } from '@/types';
import { newsBodyMock } from '@/utils/mock';
import { ChevronLeft } from 'lucide-react-native';
import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
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

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    transitionRef.current?.close();
  };

  // 목업: API 연결 전까지 newsBodyMock 사용
  // 실제 연결 시: newsBodyService.getBodyById(newsId) 로 교체
  const bodyData = { ...newsBodyMock, newsId };

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

        {/* 컨텐츠 */}
        {!news ? (
          // 로딩 스켈레톤
          <View className="mx-4 my-2 gap-3">
            <View className="h-[480px] bg-mono-300 rounded-2xl" />
            <View className="h-5 bg-mono-300 rounded-lg w-3/4" />
            <View className="h-5 bg-mono-300 rounded-lg w-1/2" />
            <View className="h-4 bg-mono-300 rounded-lg" />
            <View className="h-4 bg-mono-300 rounded-lg" />
            <View className="h-4 bg-mono-300 rounded-lg w-5/6" />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* 카드뉴스 (기존 컴포넌트) */}
            <NewsPost news={news} />

            {/* 본문 학습 섹션 */}
            <NewsBody data={bodyData} />
          </ScrollView>
        )}
      </SafeAreaView>
    </NewsCardTransition>
  );
}
