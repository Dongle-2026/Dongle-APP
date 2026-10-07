import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { GlassSurface } from './GlassSurface';
import { glass } from './tokens';
import { usePressScale } from './usePressScale';

type ChipProps = { label: string; selected?: boolean; onPress?: () => void };

// 선택되면 진한 잉크색, 아니면 glass
export function GlassChip({ label, selected, onPress }: ChipProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.95);
  const text = (
    <Text style={[styles.label, { color: selected ? '#fff' : glass.ink }]}>{label}</Text>
  );
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityState={{ selected: !!selected }}
      >
        {selected ? (
          <View style={[styles.box, { backgroundColor: glass.ink }, glass.shadow.sm]}>{text}</View>
        ) : (
          <GlassSurface radius={18} shadow="sm">
            <View style={styles.box}>{text}</View>
          </GlassSurface>
        )}
      </Pressable>
    </Animated.View>
  );
}

type GroupProps<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  style?: StyleProp<ViewStyle>;
};

// 가로 스크롤 단일 선택 필터
export function GlassChipGroup<T extends string>({
  options,
  value,
  onChange,
  style,
}: GroupProps<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={style}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 4, paddingVertical: 6 }}
    >
      {options.map((o) => (
        <GlassChip
          key={o.value}
          label={o.label}
          selected={o.value === value}
          onPress={() => onChange(o.value)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 14, fontWeight: '600' },
});
