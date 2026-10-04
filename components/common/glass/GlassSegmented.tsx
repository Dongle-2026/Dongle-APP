import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { GlassSurface } from './GlassSurface';
import { glass } from './tokens';

type Props<T extends string> = { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; style?: StyleProp<ViewStyle> };

const H = 48, PAD = 4;

// 탭바와 같은 spring으로 pill이 미끄러지는 세그먼트 컨트롤. 너비는 onLayout으로 측정하므로 회전에도 안전합니다.
export function GlassSegmented<T extends string>({ options, value, onChange, style }: Props<T>) {
  const [w, setW] = useState(0);
  const x = useRef(new Animated.Value(0)).current;
  const ready = useRef(false);
  const idx = Math.max(0, options.findIndex(o => o.value === value));
  const slot = w ? (w - PAD * 2) / options.length : 0;

  useEffect(() => {
    if (!slot) return;
    const to = idx * slot;
    if (!ready.current) { x.setValue(to); ready.current = true; return; } // 첫 측정은 애니메이션 없이
    Animated.spring(x, { toValue: to, useNativeDriver: true, damping: 18, stiffness: 200, mass: 0.8 }).start();
  }, [idx, slot]);

  return (
    <GlassSurface radius={H / 2} shadow="sm" style={style}>
      <View style={{ height: H, padding: PAD, flexDirection: 'row' }} onLayout={e => setW(e.nativeEvent.layout.width)}>
        {slot > 0 && <Animated.View style={[styles.pill, { width: slot, transform: [{ translateX: x }] }]} />}
        {options.map(o => (
          <Pressable key={o.value} style={styles.slot} onPress={() => onChange(o.value)} accessibilityRole="tab" accessibilityState={{ selected: o.value === value }}>
            <Text style={[styles.label, { opacity: o.value === value ? 1 : 0.55 }]}>{o.label}</Text>
          </Pressable>
        ))}
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  pill: { position: 'absolute', top: PAD, left: PAD, height: H - PAD * 2, borderRadius: (H - PAD * 2) / 2, backgroundColor: glass.inkFaint },
  slot: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 14, fontWeight: '600', color: glass.ink },
});
