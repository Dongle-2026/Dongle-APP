import { GlassSurface } from '@/components/common/glass';
import { CheckCircle2, XCircle } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

export const QUIZ_COLORS = {
  correct: { bg: '#EDFBF0', border: '#34c759', badge: '#34c759', text: '#1a7a35' },
  wrong: { bg: '#FFF0F0', border: '#FF3B30', badge: '#FF3B30', text: '#c0392b' },
};
export type OptionStatus = 'idle' | 'correct' | 'wrong' | 'dim';

type Props = {
  index: number;
  text: string;
  status: OptionStatus;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
};

export default function QuizOption({ index, text, status, selected, disabled, onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const shake = useRef(new Animated.Value(0)).current;

  // transform 기반이라 레이아웃이 밀리지 않음. 사용자가 고른 카드에서만 재생.
  useEffect(() => {
    if (!selected) return;
    if (status === 'correct') {
      Animated.sequence([
        Animated.timing(scale, { toValue: 0.98, duration: 80, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1.03, useNativeDriver: true, speed: 40, bounciness: 10 }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }),
      ]).start();
    } else if (status === 'wrong') {
      Animated.sequence(
        [-6, 6, -4, 4, 0].map((v) =>
          Animated.timing(shake, { toValue: v, duration: 60, useNativeDriver: true })
        )
      ).start();
    }
  }, [status, selected]); // eslint-disable-line react-hooks/exhaustive-deps

  const c =
    status === 'correct' ? QUIZ_COLORS.correct : status === 'wrong' ? QUIZ_COLORS.wrong : null;

  return (
    <Animated.View
      style={{ opacity: status === 'dim' ? 0.5 : 1, transform: [{ scale }, { translateX: shake }] }}
    >
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ selected, disabled }}
        style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
      >
        <GlassSurface
          radius={20}
          shadow={c ? 'md' : 'sm'}
          contentStyle={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingHorizontal: 16,
            paddingVertical: 18,
            minHeight: 64,
          }}
        >
          {c && (
            <View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                {
                  borderRadius: 20,
                  backgroundColor: c.bg,
                  borderWidth: 1.5,
                  borderColor: c.border,
                },
              ]}
            />
          )}
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 9,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: c ? c.badge : '#F0EEEC',
            }}
          >
            {status === 'correct' ? (
              <CheckCircle2 size={16} color="#fff" />
            ) : status === 'wrong' ? (
              <XCircle size={16} color="#fff" />
            ) : (
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#898989' }}>
                {String.fromCharCode(65 + index)}
              </Text>
            )}
          </View>
          <Text
            style={{
              flex: 1,
              fontSize: 15,
              lineHeight: 22,
              fontWeight: selected || status === 'correct' ? '700' : '500',
              color: c ? c.text : '#22272B',
            }}
          >
            {text}
          </Text>
        </GlassSurface>
      </Pressable>
    </Animated.View>
  );
}
