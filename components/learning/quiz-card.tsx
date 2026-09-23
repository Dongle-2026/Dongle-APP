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
  const [showExplanation, setShowExplanation] = useState(!!result);

  const honeyAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const isRevealed = showExplanation;

  const handleSelect = (choiceIndex: number) => {
    if (isRevealed) return;
    const isCorrect = choiceIndex === quiz.answerIndex;
    const earned = isCorrect ? quiz.honey : 0;

    setSelectedIndex(choiceIndex);
    setShowExplanation(true);

    // Honey pop animation (correct only)
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

    onAnswer({
      quizId: quiz.id,
      selectedIndex: choiceIndex,
      isCorrect,
      earnedHoney: earned,
    });
  };

  const getChoiceStyle = (i: number) => {
    if (!isRevealed) {
      return {
        backgroundColor: '#F9F9F9',
        borderColor: '#F0EEEC',
      };
    }
    if (i === quiz.answerIndex) {
      return { backgroundColor: '#EDFBF0', borderColor: '#34c759' };
    }
    if (i === selectedIndex && i !== quiz.answerIndex) {
      return { backgroundColor: '#FFF0F0', borderColor: '#FF3B30' };
    }
    return { backgroundColor: '#F9F9F9', borderColor: '#F0EEEC' };
  };

  const getChoiceTextColor = (i: number) => {
    if (!isRevealed) return '#22272B';
    if (i === quiz.answerIndex) return '#1a7a35';
    if (i === selectedIndex && i !== quiz.answerIndex) return '#c0392b';
    return '#898989';
  };

  const isCorrectAnswer = selectedIndex === quiz.answerIndex;

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
          {isRevealed && (
            <Animated.View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                backgroundColor: isCorrectAnswer ? '#EDFBF0' : '#FFF0F0',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 20,
                opacity: isCorrectAnswer ? honeyAnim : 1,
              }}
            >
              {isCorrectAnswer ? (
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
            const isCorrect = i === quiz.answerIndex;
            const showIcon = isRevealed && (isCorrect || isSelected);

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
                      isRevealed && isCorrect
                        ? '#34c759'
                        : isRevealed && isSelected && !isCorrect
                          ? '#FF3B30'
                          : '#F0EEEC',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {showIcon ? (
                    isCorrect ? (
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
                    fontWeight: isSelected || isCorrect ? '600' : '400',
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

        {/* Explanation */}
        {isRevealed && (
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
              {quiz.explanation}
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}
