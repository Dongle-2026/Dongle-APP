import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

type Props = {
  totalHoney: number;
  correctCount: number;
  totalCount: number;
};

export default function RewardBanner({ totalHoney, correctCount, totalCount }: Props) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 14,
        stiffness: 180,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  const getRank = () => {
    if (accuracy === 100) return { emoji: '🏆', label: '완벽해요!', color: '#FFD700' };
    if (accuracy >= 66) return { emoji: '🎉', label: '잘했어요!', color: '#34c759' };
    if (accuracy >= 33) return { emoji: '📚', label: '한 번 더!', color: '#FFDC53' };
    return { emoji: '💪', label: '도전해요!', color: '#FF9500' };
  };

  const rank = getRank();

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim,
        backgroundColor: '#22272B',
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        alignItems: 'center',
      }}
    >
      {/* Rank emoji */}
      <Text style={{ fontSize: 40, marginBottom: 8 }}>{rank.emoji}</Text>

      <Text
        style={{
          fontSize: 20,
          fontWeight: '800',
          color: '#FFDC53',
          letterSpacing: -0.5,
          marginBottom: 4,
        }}
      >
        {rank.label}
      </Text>

      <Text
        style={{
          fontSize: 13,
          color: '#898989',
          marginBottom: 20,
        }}
      >
        {totalCount}문제 중 {correctCount}문제 정답
      </Text>

      {/* Stats row */}
      <View
        style={{
          flexDirection: 'row',
          gap: 12,
          width: '100%',
        }}
      >
        {/* Honey earned */}
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(255,220,83,0.12)',
            borderRadius: 14,
            padding: 14,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgba(255,220,83,0.25)',
          }}
        >
          <Text style={{ fontSize: 24, marginBottom: 4 }}>🍯</Text>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFDC53' }}>+{totalHoney}P</Text>
          <Text style={{ fontSize: 11, color: '#898989', marginTop: 2 }}>꿀 획득</Text>
        </View>

        {/* Accuracy */}
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.06)',
            borderRadius: 14,
            padding: 14,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.08)',
          }}
        >
          <Text style={{ fontSize: 24, marginBottom: 4 }}>🎯</Text>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#fff' }}>{accuracy}%</Text>
          <Text style={{ fontSize: 11, color: '#898989', marginTop: 2 }}>정답률</Text>
        </View>
      </View>

      {totalHoney === 0 && (
        <Text
          style={{
            marginTop: 14,
            fontSize: 12,
            color: '#898989',
            textAlign: 'center',
            lineHeight: 18,
          }}
        >
          다시 풀어서 꿀을 모아보세요! 🍀
        </Text>
      )}
    </Animated.View>
  );
}
