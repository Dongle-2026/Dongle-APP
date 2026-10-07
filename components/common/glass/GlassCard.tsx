import type { ReactNode } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { GlassSurface } from './GlassSurface';
import { glass, type ShadowLevel } from './tokens';
import { usePressScale } from './usePressScale';

type CardProps = {
  children: ReactNode;
  onPress?: () => void;
  padding?: number;
  radius?: number;
  shadow?: ShadowLevel;
  style?: StyleProp<ViewStyle>;
};

// onPress를 주면 눌리는 카드가 됩니다.
export function GlassCard({
  children,
  onPress,
  padding = 20,
  radius = 28,
  shadow = 'sm',
  style,
}: CardProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.98);
  const surface = (
    <GlassSurface radius={radius} shadow={shadow} contentStyle={{ padding }}>
      {children}
    </GlassSurface>
  );
  if (!onPress) return <View style={style}>{surface}</View>;
  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
      >
        {surface}
      </Pressable>
    </Animated.View>
  );
}

type SectionProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  card?: boolean; // false면 카드 없이 제목 + 내용만 (가로 스크롤 리스트 등)
  style?: StyleProp<ViewStyle>;
};

export function GlassSection({
  title,
  description,
  action,
  children,
  card = true,
  style,
}: SectionProps) {
  return (
    <View style={[{ gap: 12 }, style]}>
      <View style={styles.head}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          {description ? <Text style={styles.desc}>{description}</Text> : null}
        </View>
        {action}
      </View>
      {card ? <GlassCard>{children}</GlassCard> : children}
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, paddingHorizontal: 4 },
  title: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3, color: glass.ink },
  desc: { fontSize: 13, marginTop: 2, color: glass.inkMuted },
});
