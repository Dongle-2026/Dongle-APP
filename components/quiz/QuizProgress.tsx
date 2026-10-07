import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

// 기존 프로젝트 색상 재사용: 포인트 #FFDC53, 트랙 #F0EEEC
const POINT = '#FFDC53';
const TRACK = '#F0EEEC';

function Bar({ state }: { state: 'done' | 'current' | 'todo' }) {
  const fill = useRef(new Animated.Value(state === 'todo' ? 0 : 1)).current;
  useEffect(() => {
    Animated.timing(fill, { toValue: state === 'todo' ? 0 : 1, duration: 260, useNativeDriver: false }).start();
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: TRACK, overflow: 'hidden' }}>
      <Animated.View
        style={{
          height: '100%', borderRadius: 3, backgroundColor: POINT,
          opacity: state === 'done' ? 0.55 : 1, // 푼 문제는 살짝 옅게, 현재 문제는 선명하게
          width: fill.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
        }}
      />
    </View>
  );
}

// 문제 수만큼 bar를 동적으로 생성 (1문제 → 1개, 5문제 → 5개)
export default function QuizProgress({ total, current }: { total: number; current: number }) {
  return (
    <View style={{ flex: 1, flexDirection: 'row', gap: 6 }} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: total, now: current + 1 }}>
      {Array.from({ length: total }, (_, i) => (
        <Bar key={i} state={i < current ? 'done' : i === current ? 'current' : 'todo'} />
      ))}
    </View>
  );
}
