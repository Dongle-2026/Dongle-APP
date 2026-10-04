import { useRef } from 'react';
import { Animated } from 'react-native';

// 눌렀을 때 살짝 작아졌다가 spring으로 돌아오는 공통 효과
export function usePressScale(to = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;
  const go = (v: number) => Animated.spring(scale, { toValue: v, useNativeDriver: true, damping: 14, stiffness: 220 }).start();
  return { scale, onPressIn: () => go(to), onPressOut: () => go(1) };
}
