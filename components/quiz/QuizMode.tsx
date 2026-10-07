import { GlassButton, GlassIconButton } from '@/components/common/glass';
import QuizOption, { QUIZ_COLORS, type OptionStatus } from '@/components/quiz/QuizOption';
import QuizProgress from '@/components/quiz/QuizProgress';
import QuizResultView from '@/components/quiz/QuizResult';
import type { Quiz, QuizResult } from '@/types/learning';
import { CheckCircle2, ChevronLeft, XCircle } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  quizzes: Quiz[];
  results: QuizResult[]; // news-body의 기존 quizResults 재사용 → 별도 정답 상태를 만들지 않음
  onAnswer: (r: QuizResult) => void; // 기존 handleQuizAnswer
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

  const handleSelect = (i: number) => {
    if (answered) return; // 답 변경 불가
    const isCorrect = i === quiz.answerIndex;
    onAnswer({
      quizId: quiz.id,
      selectedIndex: i,
      isCorrect,
      earnedHoney: isCorrect ? quiz.honey : 0,
    });
    reveal.setValue(0);
    anim(reveal, 1, 280, 180).start(); // 카드 애니메이션 뒤에 해설/다음 버튼 등장
  };

  const goNext = () => {
    if (isLast) {
      anim(content, 0, 220).start(() => setPhase('result'));
      return;
    }
    Animated.parallel([anim(slide, 0, 160), anim(shiftX, -24, 160)]).start(() => {
      setIndex((i) => i + 1);
      reveal.setValue(0);
      slide.setValue(0);
      shiftX.setValue(24);
      Animated.parallel([anim(slide, 1, 220), anim(shiftX, 0, 220)]).start();
    });
  };

  const statusOf = (i: number): OptionStatus =>
    !result
      ? 'idle'
      : i === quiz.answerIndex
        ? 'correct'
        : i === result.selectedIndex
          ? 'wrong'
          : 'dim';

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
                {result && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: 6,
                    }}
                  >
                    {result.isCorrect ? (
                      <CheckCircle2 size={18} color={QUIZ_COLORS.correct.border} />
                    ) : (
                      <XCircle size={18} color={QUIZ_COLORS.wrong.border} />
                    )}
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '700',
                        color: result.isCorrect
                          ? QUIZ_COLORS.correct.border
                          : QUIZ_COLORS.wrong.border,
                      }}
                    >
                      {result.isCorrect ? `정답이에요! +${quiz.honey}P` : '아쉬워요!'}
                    </Text>
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
                    disabled={answered}
                    onPress={() => handleSelect(i)}
                  />
                ))}
              </View>

              {/* 해설: 기존 QuizCard의 해설 박스 스타일 그대로 + 정답/오답 헤더 */}
              {result && (
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
                      {quiz.explanation}
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
