import type { Quiz, QuizResult } from '@/types/learning';
import { CheckCircle2, XCircle } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  quiz: Quiz;
  index: number;
  result: QuizResult | undefined;
  onAnswer: (result: QuizResult) => void;
};

export default function QuizCard({ quiz, index, result, onAnswer }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(result?.selectedIndex ?? null);

  // 💡 본문 퀴즈 객체에는 explanation이 없고, 백엔드 제출 결과(result)에만 오므로 result 존재 여부로 확인
  const [explanation, setExplanation] = useState<string | undefined>(result?.explanation);
  const [correctIndex, setCorrectIndex] = useState<number | undefined>(result?.correctIndex);

  const honeyAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // 이미 풀었거나 결과를 받았으면 해설 및 정답 공개 상태
  const isRevealed = result !== undefined || selectedIndex !== null;
  const isCorrectAnswer =
    result?.isCorrect ?? (correctIndex !== null && selectedIndex === correctIndex);

  const handleSelect = (choiceIndex: number) => {
    if (isRevealed) return;

    setSelectedIndex(choiceIndex);

    const isCorrect = choiceIndex === correctIndex;
    const earned = isCorrect ? quiz.honey : 0;

    if (isCorrect) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.08,
          useNativeDriver: true,
          speed: 30,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
        }),
      ]).start();

      Animated.timing(honeyAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }

    // 부모 컴포넌트로 선택한 인덱스 전달 (백엔드 제출 API 호출 트리거)
    onAnswer({
      quizId: quiz.id,
      selectedIndex: choiceIndex,
      isCorrect: false, // 백엔드 검증 전 기본값
      earnedHoney: 0,
    });
  };

  const getChoiceStyle = (i: number) => {
    if (!isRevealed) {
      return {
        backgroundColor: '#F9F9F9',
        borderColor: '#F0EEEC',
      };
    }
    if (correctIndex !== undefined) {
      if (i === correctIndex) {
        return { backgroundColor: '#EDFBF0', borderColor: '#34c759' };
      }
      if (i === selectedIndex && i !== correctIndex) {
        return { backgroundColor: '#FFF0F0', borderColor: '#FF3B30' };
      }
    } else {
      if (i === selectedIndex) {
        return { backgroundColor: '#F0EEEC', borderColor: '#22272B' };
      }
    }
    return { backgroundColor: '#F9F9F9', borderColor: '#F0EEEC' };
  };

  const getChoiceTextColor = (i: number) => {
    if (!isRevealed) return '#22272B';
    if (correctIndex !== undefined) {
      if (i === correctIndex) return '#1a7a35';
      if (i === selectedIndex && i !== correctIndex) return '#c0392b';
    }
    return '#898989';
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 20,
          padding: 20,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#F0EEEC',
          shadowColor: '#000',
          shadowOpacity: 0.04,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        }}
      >
        {/* Quiz number badge */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <View
              style={{
                backgroundColor: '#22272B',
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#FFDC53' }}>
                Q{index + 1}
              </Text>
            </View>
          </View>

          {/* Result badge */}
          {isRevealed && result && (
            <Animated.View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                backgroundColor: result.isCorrect ? '#EDFBF0' : '#FFF0F0',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 20,
                opacity: result.isCorrect ? honeyAnim : 1,
              }}
            >
              {result.isCorrect ? (
                <>
                  <CheckCircle2 size={13} color="#34c759" />
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#1a7a35' }}>
                    정답 +{quiz.honey}P
                  </Text>
                </>
              ) : (
                <>
                  <XCircle size={13} color="#FF3B30" />
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#c0392b' }}>오답</Text>
                </>
              )}
            </Animated.View>
          )}
        </View>

        {/* Question */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: '#22272B',
            lineHeight: 24,
            marginBottom: 14,
            letterSpacing: -0.3,
          }}
        >
          {quiz.question}
        </Text>

        {/* Choices */}
        <View style={{ gap: 8 }}>
          {quiz.choices.map((choice, i) => {
            const choiceStyle = getChoiceStyle(i);
            const textColor = getChoiceTextColor(i);
            const isSelected = selectedIndex === i;
            const isCorrectTarget = correctIndex !== undefined && i === correctIndex;
            const showIcon = isRevealed && (isCorrectTarget || isSelected);

            return (
              <TouchableOpacity
                key={choice.id}
                onPress={() => handleSelect(i)}
                disabled={isRevealed}
                activeOpacity={0.75}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  padding: 14,
                  borderRadius: 12,
                  borderWidth: 1.5,
                  ...choiceStyle,
                }}
              >
                {/* Choice label */}
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    backgroundColor:
                      isRevealed && isCorrectTarget
                        ? '#34c759'
                        : isRevealed && isSelected && !isCorrectTarget
                          ? '#FF3B30'
                          : '#F0EEEC',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {showIcon ? (
                    isCorrectTarget ? (
                      <CheckCircle2 size={14} color="#fff" />
                    ) : (
                      <XCircle size={14} color="#fff" />
                    )
                  ) : (
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '700',
                        color: '#898989',
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </Text>
                  )}
                </View>

                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    fontWeight: isSelected || isCorrectTarget ? '600' : '400',
                    color: textColor,
                    lineHeight: 20,
                  }}
                >
                  {choice.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Explanation (백엔드 결과에 포함되어 내려올 때만 표시) */}
        {isRevealed && result?.explanation && (
          <View
            style={{
              marginTop: 16,
              backgroundColor: '#F9F9F9',
              borderRadius: 12,
              padding: 14,
              borderWidth: 1,
              borderColor: '#FFDC53',
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#898989', marginBottom: 5 }}>
              💡 해설
            </Text>
            <Text style={{ fontSize: 13, color: '#22272B', lineHeight: 21 }}>
              {result.explanation}
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}
