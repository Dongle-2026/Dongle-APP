import type { LucideIcon } from 'lucide-react-native';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { GlassSurface } from './GlassSurface';
import { glass } from './tokens';
import { usePressScale } from './usePressScale';

const SIZES = {
  sm: { h: 40, px: 16, font: 14, icon: 16 },
  md: { h: 48, px: 22, font: 15, icon: 18 },
  lg: { h: 56, px: 28, font: 16, icon: 20 },
} as const;

type Variant = 'glass' | 'solid' | 'ghost';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: Variant; // glass: 블러 / solid: 진한 잉크 / ghost: 배경 없음
  size?: keyof typeof SIZES;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function GlassButton({
  label,
  onPress,
  variant = 'glass',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading,
  disabled,
  fullWidth,
  style,
}: ButtonProps) {
  const { scale, onPressIn, onPressOut } = usePressScale();
  const s = SIZES[size];
  const fg = variant === 'solid' ? '#fff' : glass.ink;
  const r = s.h / 2;

  const content = (
    <View style={[styles.row, { height: s.h, paddingHorizontal: s.px }]}>
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={s.icon} color={fg} strokeWidth={2} />}
          <Text style={[styles.label, { color: fg, fontSize: s.font }]}>{label}</Text>
          {Icon && iconPosition === 'right' && <Icon size={s.icon} color={fg} strokeWidth={2} />}
        </>
      )}
    </View>
  );

  return (
    <Animated.View
      style={[
        { transform: [{ scale }], opacity: disabled ? 0.45 : 1 },
        fullWidth && { alignSelf: 'stretch' },
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled || loading}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      >
        {({ pressed }) =>
          variant === 'glass' ? (
            <GlassSurface radius={r} shadow="sm">
              {content}
            </GlassSurface>
          ) : (
            <View
              style={[
                { borderRadius: r },
                variant === 'solid'
                  ? [{ backgroundColor: glass.ink }, glass.shadow.sm]
                  : { backgroundColor: pressed ? glass.inkFaint : 'transparent' },
              ]}
            >
              {content}
            </View>
          )
        }
      </Pressable>
    </Animated.View>
  );
}

type IconButtonProps = {
  icon: LucideIcon;
  label: string;
  onPress?: () => void;
  variant?: Exclude<Variant, 'ghost'>;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

// 원형 아이콘 버튼 (뒤로가기, 닫기, 북마크 등)
export function GlassIconButton({
  icon: Icon,
  label,
  onPress,
  variant = 'glass',
  size = 44,
  style,
}: IconButtonProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.92);
  const fg = variant === 'solid' ? '#fff' : glass.ink;
  const inner = (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={size * 0.46} color={fg} strokeWidth={2} />
    </View>
  );
  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={label}
        hitSlop={6}
      >
        {variant === 'glass' ? (
          <GlassSurface radius={size / 2} shadow="sm">
            {inner}
          </GlassSurface>
        ) : (
          <View style={[{ borderRadius: size / 2, backgroundColor: glass.ink }, glass.shadow.sm]}>
            {inner}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  label: { fontWeight: '600', letterSpacing: -0.2 },
});
