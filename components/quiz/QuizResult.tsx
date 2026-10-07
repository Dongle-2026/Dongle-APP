import { GlassButton } from '@/components/common/glass';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = { totalHoney: number; correctCount: number; totalCount: number; onDone: () => void };

export default function QuizResult({ totalHoney, correctCount, totalCount, onDone }: Props) {
  const insets = useSafeAreaInsets();
  const appear = useRef(new Animated.Value(0)).current;
  const [n, setN] = useState(0);

  useEffect(() => {
    // 등장: opacity + scale
    Animated.spring(appear, {
      toValue: 1,
      useNativeDriver: true,
      damping: 15,
      stiffness: 140,
    }).start();
    // 포인트 count-up 0 → totalHoney
    const v = new Animated.Value(0);
    const id = v.addListener(({ value }) => setN(Math.round(value)));
    Animated.timing(v, {
      toValue: totalHoney,
      duration: 900,
      delay: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    return () => v.removeListener(id);
  }, [totalHoney]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top + 80,
        paddingBottom: insets.bottom + 16,
        paddingHorizontal: 20,
      }}
    >
      <Animated.View
        style={{
          flex: 1,
          alignItems: 'center',
          opacity: appear.interpolate({
            inputRange: [0, 0.6],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
          transform: [
            { scale: appear.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) },
          ],
        }}
      >
        {/* Header Section */}
        <View className="w-full flex-row justify-start gap-4 items-center mb-12">
          <View className="mx-4">
            <View className="flex-row items-center gap-2">
              <Text
                style={{ fontSize: 28, fontWeight: '900', color: '#22272B', letterSpacing: -0.8 }}
              >
                {correctCount === totalCount ? '완벽해요!' : '짝짝짝!'}
              </Text>
            </View>
            <Text style={{ fontSize: 16, color: '#6A7178', marginTop: 4, fontWeight: '500' }}>
              퀴즈를 모두 풀었어요
            </Text>
          </View>
        </View>

        <Image
          source={require('@/assets/avatars/celebrate.png')}
          style={{ width: 160, height: 160 }}
          resizeMode="contain"
        />

        {/* Main Score Card */}
        <View className="h-60 z-20 -mt-8">
          <View
            style={{
              padding: 24,
              alignItems: 'center',
              backgroundColor: '#28200C',
              borderRadius: 16,
            }}
          >
            {/* 포인트 숫자 영역 */}
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
              <Text
                style={{
                  fontSize: 60,
                  lineHeight: 68,
                  fontWeight: '900',
                  color: '#FFDC53',
                  letterSpacing: -1.5,
                }}
              >
                +{n}
              </Text>
              <Text style={{ fontSize: 28, fontWeight: '800', color: '#FFDC53' }}>P</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#EEEEEF',
            width: '100%',
            borderRadius: 16,
            paddingVertical: 28,
            paddingHorizontal: 32,
          }}
        >
          {/* 정답 상태 칩 */}
          <View
            style={{
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: '700' }}>
              {correctCount} / {totalCount} 정답
            </Text>
          </View>
          <Text style={{ fontSize: 16 }}>
            {totalHoney > 0 ? `꿀 ${totalHoney}p를 모았어요` : '획득한 꿀이 없어요'}
          </Text>

          {/* 하단 팁 / 0점 시 보상 가이드 */}
          {totalHoney === 0 ? (
            <View
              style={{
                marginTop: 16,
                paddingHorizontal: 16,
                paddingVertical: 12,
                backgroundColor: '#F5F5F5',
                borderRadius: 14,
                width: '100%',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 13, color: '#616161', fontWeight: '600' }}>
                🌱 다시 도전해서 꿀 포인트를 적립해보세요!
              </Text>
            </View>
          ) : (
            <Text style={{ fontSize: 13, color: '#9E9E9E', marginTop: 8 }}>
              획득한 꿀은 마이페이지에서 확인할 수 있어요
            </Text>
          )}
        </View>
      </Animated.View>

      <GlassButton label="뉴스로 돌아가기" variant="solid" size="lg" fullWidth onPress={onDone} />
    </View>
  );
}
