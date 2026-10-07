import { GlassSurface } from '@/components/common/glass';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * 본문 하단 근처까지 스크롤하면 한 번만 visible=true.
 * 한 번 보여준 뒤에는 다시 자동으로 나타나지 않고(shown ref), 퀴즈를 끝냈거나 퀴즈 모드면 enabled=false로 숨김.
 */
export function useQuizCTA(enabled: boolean, nearBottom = 240) {
  const [visible, setVisible] = useState(false);
  const shown = useRef(false);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (shown.current || !enabledRef.current) return;
      const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
      const remaining = contentSize.height - (contentOffset.y + layoutMeasurement.height);
      if (contentOffset.y > 0 && remaining <= nearBottom) {
        shown.current = true;
        setVisible(true);
      }
    },
    [nearBottom]
  );

  const hide = useCallback(() => setVisible(false), []);
  // 다른 뉴스로 바뀌었을 때 다시 한 번 보여줄 수 있도록 초기화
  const reset = useCallback(() => {
    shown.current = false;
    setVisible(false);
  }, []);
  return { visible: visible && enabled, onScroll, hide, reset };
}

type Props = { visible: boolean; maxHoney?: number; onStart: () => void; onClose: () => void };

export default function QuizCTA({ visible, maxHoney, onStart, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(0)).current;
  const dragY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => {
        return gesture.dy > 5 && Math.abs(gesture.dy) > Math.abs(gesture.dx);
      },

      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          dragY.setValue(gesture.dy);
        }
      },

      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 60 || gesture.vy > 0.8) {
          // 1. 드래그로 아래로 내려가는 애니메이션 실행
          Animated.timing(dragY, {
            toValue: 200, // 통통 튀거나 남아있지 않게 충분히 내려줍니다.
            duration: 150,
            useNativeDriver: true,
          }).start(() => {
            // 2. 애니메이션이 끝난 후 dragY를 0으로 리셋하지 않고 바로 onClose만 호출
            onClose();
          });
        } else {
          // 복귀 애니메이션
          Animated.spring(dragY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 18,
            stiffness: 220,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      // 다시 나타날 때는 dragY 위치를 0으로 초기화한 뒤 올라옵니다.
      dragY.setValue(0);
      Animated.spring(anim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 16,
        stiffness: 180,
      }).start();
    } else {
      // 숨겨질 때 anim 값 축소
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // 완전 비활성화된 후 dragY 안전하게 초기화
        dragY.setValue(0);
      });
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Animated.View
      {...panResponder.panHandlers}
      pointerEvents={visible ? 'auto' : 'none'}
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: insets.bottom + 12,
        zIndex: 40,
        opacity: anim.interpolate({
          inputRange: [0, 0.6],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        }),
        transform: [
          { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [140, 0] }) },
          { translateY: dragY },
        ],
      }}
    >
      <GlassSurface radius={24} shadow="lg" contentStyle={{ padding: 18, gap: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View
            style={{
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              source={require('@/assets/avatars/happy.png')}
              style={{ width: 43, height: 50 }}
              resizeMode="contain"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#22272B' }}>
              이 뉴스, 얼마나 이해했을까요?
            </Text>
            <Text style={{ fontSize: 13, color: '#898989', marginTop: 3 }}>
              퀴즈 풀고{maxHoney ? ` 최대 ${maxHoney}P` : ''} 꿀 받아가기
            </Text>
          </View>
          <TouchableOpacity
            onPress={onStart}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 999,
              backgroundColor: '#EEEEEF',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#008BFF' }}>도전</Text>
          </TouchableOpacity>
        </View>
      </GlassSurface>
    </Animated.View>
  );
}
