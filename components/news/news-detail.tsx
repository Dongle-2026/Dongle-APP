import NewsBody from '@/components/news/news-body';
import QuizCTA, { useQuizCTA } from '@/components/quiz/QuizCTA';
import NewsCardTransition, {
  type NewsCardTransitionRef,
} from '@/components/transition/news-card-transition';
import { newsService } from '@/services';
import type { CardNews } from '@/types';
import type { QuizResult } from '@/types/learning';
import { newsBodyMock } from '@/utils/mock';
import { LinearGradient } from 'expo-linear-gradient';
import { Bookmark, Share2, X } from 'lucide-react-native';
import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Alert, Image, ScrollView, Share, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassIconButton } from '../common/glass';
import QuizMode from '../quiz/QuizMode';

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
  const bodyData = { ...newsBodyMock, newsId }; // 기존 줄을 위로 이동
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [quizMode, setQuizMode] = useState(false);
  const quizDone = quizResults.length === bodyData.quizzes.length;
  const cta = useQuizCTA(bodyData.quizzes.length > 0 && !quizDone && !quizMode, 480);
  const maxHoney = bodyData.quizzes.reduce((s, q) => s + q.honey, 0);

  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const insets = useSafeAreaInsets();

  const transitionRef = useRef<NewsCardTransitionRef>(null);

  useEffect(() => {
    setNews(null);
    setIsClosing(false);
    setQuizResults([]);
    setQuizMode(false);
    setIsSaved(false);
    cta.reset();

    newsService
      .getNewsById(newsId)
      .then((response) => {
        setNews(response.data || null);
        setIsSaved(!!response.data?.isSaved);
      })
      .catch((error) => {
        console.error('뉴스 상세 조회 에러:', error);
      });
  }, [newsId]);

  const handleSave = async () => {
    if (!news || saving) return;
    const next = !isSaved;
    setIsSaved(next);
    setSaving(true);
    try {
      const res = next
        ? await newsService.saveNews(news.id)
        : await newsService.unsaveNews(news.id);
      if (res.status >= 400) throw new Error(`status ${res.status}`);
    } catch {
      setIsSaved(!next);
      Alert.alert(next ? '저장 실패' : '저장 해제 실패', '잠시 후 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    transitionRef.current?.close();
  };
  const handleShare = async () => {
    if (!news) return;

    try {
      await Share.share({
        message: `📰 ${news.title}\n\n돈글돈글에서 읽고 있어요!\n (${news.createdAt})`,
        title: news.title,
      });
    } catch {
      Alert.alert('공유 실패', '잠시 후 다시 시도해주세요.');
    }
  };

  // 목업: API 연결 전까지 newsBodyMock 사용
  // 실제 연결 시: newsBodyService.getBodyById(newsId) 로 교체

  const handleQuizAnswer = (r: QuizResult) =>
    setQuizResults((prev) => (prev.some((x) => x.quizId === r.quizId) ? prev : [...prev, r]));
  const openQuiz = () => {
    cta.hide();
    setQuizMode(true);
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
      <View className="flex-1 h-full w-full bg-mono-100">
        {/* 뒤로가기 */}
        {!quizMode && (
          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              right: 10,
              top: insets.top,
              zIndex: 9999,
              elevation: 9999,
              gap: 12,
            }}
          >
            <GlassIconButton
              icon={Bookmark}
              label={isSaved ? '저장 해제' : '저장'}
              onPress={handleSave}
              variant={isSaved ? 'solid' : 'glass'}
            />
            <GlassIconButton icon={Share2} label="공유" onPress={handleShare} />
            <GlassIconButton icon={X} label="닫기" onPress={handleClose} />
          </View>
        )}

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
            onScroll={cta.onScroll}
            scrollEventThrottle={16}
          >
            {/* 카드뉴스 (기존 컴포넌트) */}
            <View className="h-[440px]">
              <View className="flex-1 overflow-hidden ">
                <Image
                  source={{ uri: news?.image }}
                  className="absolute inset-0 w-full h-full"
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['rgba(0,0,0,0.01)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                  pointerEvents="none"
                />
                <View className="w-full h-full">
                  <View className="flex-1 justify-end items-start pb-16 ml-8">
                    <Text className="text-white text-3xl font-bold mb-2 leading-[42px] w-3/4">
                      {news.title}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* 본문 학습 섹션 */}
            <NewsBody data={bodyData} quizResults={quizResults} onOpenQuiz={openQuiz} />
          </ScrollView>
        )}
      </View>
      <QuizCTA visible={cta.visible} maxHoney={maxHoney} onStart={openQuiz} onClose={cta.hide} />
      {quizMode && (
        <QuizMode
          quizzes={bodyData.quizzes}
          results={quizResults}
          onAnswer={handleQuizAnswer}
          onClose={() => setQuizMode(false)}
        />
      )}
    </NewsCardTransition>
  );
}
