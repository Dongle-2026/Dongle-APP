import NewsBody from '@/components/news/news-body';
import QuizCTA, { useQuizCTA } from '@/components/quiz/QuizCTA';
import NewsCardTransition, {
  type NewsCardTransitionRef,
} from '@/components/transition/news-card-transition';
import { useMarkRead, useToggleBookmark } from '@/hooks/queries/mutations';
import { useBookmarkState, useNewsBody, useNewsDetail } from '@/hooks/queries/queries';
import type { QuizResult } from '@/types/learning';
import { LinearGradient } from 'expo-linear-gradient';
import { Bookmark, Share2, X } from 'lucide-react-native';
import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Alert, Image, ScrollView, Share, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassIconButton } from '../common/glass';
import QuizMode from '../quiz/QuizMode';

// 읽음 처리 중복 호출 방지: 같은 기사는 하루에 한 번만 호출 (서버도 하루 1회 기록 + 반복 호출 안전)
const markedToday = new Set<string>();
const dayKey = (id: string) => `${id}:${new Date().toDateString()}`;

type NewsDetailProps = {
  newsId: string;
  image: string;
  title: string;
  cardRef: RefObject<View | null>;
  onClose: () => void;
};

export default function NewsDetail({ newsId, image, title, cardRef, onClose }: NewsDetailProps) {
  const { data: news } = useNewsDetail(newsId); // GET /api/news/{id}
  const { data: isSaved = false } = useBookmarkState(newsId); // GET /api/news/{id}/bookmark
  const { data: body } = useNewsBody(newsId); // GET /api/news/{id}/body (본문·용어·퀴즈)
  const toggleBookmark = useToggleBookmark();
  const markRead = useMarkRead();

  const [isClosing, setIsClosing] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [quizMode, setQuizMode] = useState(false);
  const quizzes = body?.quizzes ?? [];
  const quizDone = quizzes.length > 0 && quizResults.length === quizzes.length;
  const cta = useQuizCTA(
    quizzes.length > 0 && body?.quizStatus === 'READY' && !quizDone && !quizMode,
    480
  );
  const maxHoney = quizzes.reduce((s, q) => s + q.honey, 0);

  const insets = useSafeAreaInsets();

  const transitionRef = useRef<NewsCardTransitionRef>(null);

  useEffect(() => {
    setIsClosing(false);
    setQuizResults([]);
    setQuizMode(false);
    cta.reset();
  }, [newsId]); // eslint-disable-line react-hooks/exhaustive-deps

  // 이미 푼 문제는 서버(myResult)에서 복원
  useEffect(() => {
    if (body) setQuizResults(body.quizResults);
  }, [body?.newsId]); // eslint-disable-line react-hooks/exhaustive-deps

  // 상세 진입 즉시 읽음 처리 (+5꿀은 서버가 계산)
  useEffect(() => {
    const key = dayKey(newsId);
    if (markedToday.has(key)) return;
    markedToday.add(key);
    markRead.mutate({ id: newsId }, { onError: () => markedToday.delete(key) }); // 실패하면 다음 진입 때 재시도
  }, [newsId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    if (!news || toggleBookmark.isPending) return;
    toggleBookmark.mutate(
      { id: newsId, next: !isSaved },
      {
        onError: () =>
          Alert.alert(!isSaved ? '저장 실패' : '저장 해제 실패', '잠시 후 다시 시도해주세요.'),
      }
    );
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

  const handleQuizAnswer = (r: QuizResult) =>
    setQuizResults((prev) => (prev.some((x) => x.quizId === r.quizId) ? prev : [...prev, r]));
  const openQuiz = () => {
    cta.hide();
    setQuizMode(true);
  };

  return (
    <NewsCardTransition
      ref={transitionRef}
      image={image}
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
                {news.image ? (
                  <Image
                    source={{ uri: news.image }}
                    className="absolute inset-0 w-full h-full"
                    resizeMode="cover"
                  />
                ) : null}
                <LinearGradient
                  colors={['rgba(0,0,0,0.01)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                  pointerEvents="none"
                />
                <View className="w-full h-full">
                  <View className="flex-1 justify-end items-start pb-16 ml-8">
                    <Text className="text-white text-3xl font-bold mb-2 leading-[42px] w-4/5">
                      {news.title}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* 본문 학습 섹션 */}
            {body ? (
              <NewsBody data={body} quizResults={quizResults} onOpenQuiz={openQuiz} />
            ) : (
              <View className="mx-4 my-4 gap-3">
                <View className="h-5 bg-mono-300 rounded-lg w-3/4" />
                <View className="h-4 bg-mono-300 rounded-lg" />
                <View className="h-4 bg-mono-300 rounded-lg" />
                <View className="h-4 bg-mono-300 rounded-lg w-5/6" />
              </View>
            )}
          </ScrollView>
        )}
      </View>
      <QuizCTA visible={cta.visible} maxHoney={maxHoney} onStart={openQuiz} onClose={cta.hide} />
      {quizMode && quizzes.length > 0 && (
        <QuizMode
          quizzes={quizzes}
          results={quizResults}
          onAnswer={handleQuizAnswer}
          onClose={() => setQuizMode(false)}
        />
      )}
    </NewsCardTransition>
  );
}
