import { GlassButton, GlassIconButton } from '@/components/common/glass';
import QuizOption, { QUIZ_COLORS, type OptionStatus } from '@/components/quiz/QuizOption';
import QuizProgress from '@/components/quiz/QuizProgress';
import QuizResultView from '@/components/quiz/QuizResult';
import { useSubmitQuizAnswer } from '@/hooks/queries/mutations';
import type { Quiz, QuizResult } from '@/types/learning';
import { CheckCircle2, ChevronLeft, XCircle } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, BackHandler, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  quizzes: Quiz[];
  results: QuizResult[]; // news-body의 기존 quizResults 재사용 → 별도 정답 상태를 만들지 않음
  onAnswer: (r: QuizResult) => void; // 문제를 맞혔을 때만 호출 (기존 handleQuizAnswer)
  onClose: () => void;
};

const anim = (v: Animated.Value, to: number, duration: number, delay = 0) =>
  Animated.timing(v, { toValue: to, duration, delay, useNativeDriver: true });

export default function QuizMode({ quizzes, results, onAnswer, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const firstOpen = quizzes.findIndex((q) => !results.some((r) => r.quizId === q.id));
  const [index, setIndex] = useState(Math.max(firstOpen, 0));
  const [phase, setPhase] = useState<'quiz' | 'result'>(firstOpen === -1 ? 'result' : 'quiz');

  const quiz = quizzes[index];
  const result = results.find((r) => r.quizId === quiz.id);
  const answered = !!result;
  const totalHoney = results.reduce((s, r) => s + r.earnedHoney, 0);
  const correctCount = results.filter((r) => r.isCorrect).length;
  const isLast = index === quizzes.length - 1;

  // 재도전: 현재 문제에서 틀린 선택지(정답·해설은 노출하지 않음)
  const [wrong, setWrong] = useState<number[]>([]);
  const submit = useSubmitQuizAnswer();
  const lastWrong = wrong[wrong.length - 1];

  const enter = useRef(new Animated.Value(0)).current; // 퀴즈 모드 등장/퇴장
  const content = useRef(new Animated.Value(1)).current; // 퀴즈 → 결과 fade
  const slide = useRef(new Animated.Value(1)).current; // 문제 전환 opacity
  const shiftX = useRef(new Animated.Value(0)).current; // 문제 전환 translateX
  const reveal = useRef(new Animated.Value(answered ? 1 : 0)).current; // 해설 + 다음 버튼

  useEffect(() => {
    anim(enter, 1, 280).start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const close = () => anim(enter, 0, 200).start(() => onClose());
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      close();
      return true;
    });
    return () => sub.remove();
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = async (i: number) => {
    if (answered || submit.isPending) return;
    try {
      const res = await submit.mutateAsync({ quizId: quiz.id, selectedIndex: i });

      // 정답/오답 결과 모두 저장
      onAnswer({
        quizId: quiz.id,
        selectedIndex: i,
        isCorrect: res.isCorrect,
        earnedHoney: res.earnedHoney,
        alreadySolved: res.alreadySolved,
        correctIndex: res.correctIndex,
        explanation: res.explanation,
      });

      if (res.isCorrect) {
        // 정답: 해설 및 '다음 문제' 버튼 노출
        reveal.setValue(0);
        anim(reveal, 1, 280, 180).start();
      } else {
        // 오답: 해설 없이 0.5초 동안 빨간색 오답 피드백만 노출 후 다음 문제로 자동 이동
        setTimeout(() => {
          goNext();
        }, 500);
      }
    } catch {
      Alert.alert('제출 실패', '네트워크 상태를 확인하고 다시 시도해주세요.');
    }
  };

  const goNext = () => {
    if (isLast) {
      anim(content, 0, 220).start(() => setPhase('result'));
      return;
    }
    Animated.parallel([anim(slide, 0, 160), anim(shiftX, -24, 160)]).start(() => {
      setWrong([]);
      setIndex((i) => i + 1);
      reveal.setValue(0);
      slide.setValue(0);
      shiftX.setValue(24);
      Animated.parallel([anim(slide, 1, 220), anim(shiftX, 0, 220)]).start();
    });
  };

  const statusOf = (i: number): OptionStatus => {
    if (!result) return 'idle';

    if (result.isCorrect) {
      // 정답을 맞힌 경우
      return i === result.selectedIndex || i === result.correctIndex ? 'correct' : 'dim';
    } else {
      // 오답인 경우: 내가 찍은건 빨강(wrong), 나머지는 dim
      if (i === result.selectedIndex) return 'wrong';
      return 'dim';
    }
  };

  const up = (v: Animated.Value, from: number) => ({
    opacity: v,
    transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [from, 0] }) }],
  });

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          zIndex: 50,
          backgroundColor: '#F9F9F9',
          opacity: enter,
          transform: [
            { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
          ],
        },
      ]}
    >
      {phase === 'result' ? (
        <QuizResultView
          totalHoney={totalHoney}
          correctCount={correctCount}
          totalCount={quizzes.length}
          onDone={close}
        />
      ) : (
        <Animated.View style={{ flex: 1, opacity: content }}>
          {/* 상단 고정: 뒤로가기 + progress bars (status bar 아래) */}
          <View
            style={{
              paddingTop: insets.top + 8,
              paddingHorizontal: 16,
              paddingBottom: 8,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <GlassIconButton icon={ChevronLeft} label="퀴즈 닫기" size={40} onPress={close} />
            <QuizProgress total={quizzes.length} current={index} />
            <Text style={{ fontSize: 12, color: '#898989' }}>
              {index + 1} / {quizzes.length}
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 24,
              paddingBottom: insets.bottom + 120,
            }}
          >
            <Animated.View style={{ opacity: slide, transform: [{ translateX: shiftX }] }}>
              {/* <Image
                source={require('@/assets/images/logo.png')}
                style={{ width: 48, height: 48 }}
              /> */}
              <View className="flex-row items-center justify-between my-4">
                <View
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: '#22272B',
                    borderRadius: 999,
                    paddingHorizontal: 14,
                    paddingVertical: 4,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFDC53' }}>
                    Q{index + 1}
                  </Text>
                </View>

                {/* 정답/오답 상태 표시 */}
                {result && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    {result.isCorrect ? (
                      <>
                        <CheckCircle2 size={18} color={QUIZ_COLORS.correct.border} />
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: QUIZ_COLORS.correct.border,
                          }}
                        >
                          {result.earnedHoney > 0
                            ? `정답이에요! +${result.earnedHoney}P`
                            : '정답이에요!'}
                        </Text>
                      </>
                    ) : (
                      <>
                        <XCircle size={18} color={QUIZ_COLORS.wrong.border} />
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: QUIZ_COLORS.wrong.border,
                          }}
                        >
                          오답이에요!
                        </Text>
                      </>
                    )}
                  </View>
                )}
              </View>
              <Text
                style={{
                  fontSize: 22,
                  lineHeight: 32,
                  fontWeight: '800',
                  color: '#22272B',
                  letterSpacing: -0.5,
                  marginTop: 12,
                }}
              >
                {quiz.question}
              </Text>
              <Text style={{ fontSize: 14, color: '#898989', marginTop: 8, marginBottom: 24 }}>
                하나를 고르면 바로 정답을 확인할 수 있어요.
              </Text>

              <View style={{ gap: 12 }}>
                {quiz.choices.map((c, i) => (
                  <QuizOption
                    key={c.id}
                    index={i}
                    text={c.text}
                    status={statusOf(i)}
                    selected={result?.selectedIndex === i}
                    disabled={answered || submit.isPending}
                    onPress={() => handleSelect(i)}
                  />
                ))}
              </View>

              {/* 해설: 기존 QuizCard의 해설 박스 스타일 그대로 + 정답/오답 헤더 */}
              {result?.explanation && (
                <Animated.View style={[{ marginTop: 40 }, up(reveal, 12)]}>
                  <View
                    style={{
                      backgroundColor: '#F9F9F9',
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={{ fontSize: 16, fontWeight: '700', color: '#898989', marginBottom: 5 }}
                    >
                      💡 해설
                    </Text>
                    <Text style={{ fontSize: 14, color: '#22272B', lineHeight: 24 }}>
                      {result.explanation}
                    </Text>
                  </View>
                </Animated.View>
              )}
            </Animated.View>
          </ScrollView>

          {/* 다음 버튼: 답을 고르기 전에는 숨김(터치도 차단), 이후 fade + translateY로 등장 */}
          <Animated.View
            pointerEvents={answered ? 'auto' : 'none'}
            style={[
              { position: 'absolute', left: 20, right: 20, bottom: insets.bottom + 16 },
              up(reveal, 16),
            ]}
          >
            <GlassButton
              onPress={goNext}
              label={isLast ? '결과 보기' : '다음 문제'}
              size="lg"
              variant="solid"
            />
          </Animated.View>
        </Animated.View>
      )}
    </Animated.View>
  );
}
