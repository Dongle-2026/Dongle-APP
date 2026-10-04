import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { glass, type ShadowLevel } from './tokens';

type Props = {
  children?: ReactNode;
  radius?: number;
  shadow?: ShadowLevel;
  intensity?: number;
  style?: StyleProp<ViewStyle>; // 바깥(그림자) 레이어
  contentStyle?: StyleProp<ViewStyle>; // 안쪽 콘텐츠 레이어
};

// 모든 glass 컴포넌트의 바탕. iOS는 BlurView, Android는 반투명 흰색.
// 바깥(그림자) / 안쪽(overflow hidden) 두 겹으로 나눠 iOS에서 그림자가 잘리지 않게 했습니다.
export function GlassSurface({ children, radius = 24, shadow = 'md', intensity = glass.blur, style, contentStyle }: Props) {
  return (
    <View style={[{ borderRadius: radius, backgroundColor: glass.plate }, glass.shadow[shadow], style]}>
      <View style={{ borderRadius: radius, overflow: 'hidden' }}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={intensity} tint="light" style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: glass.androidBg }]} />
        )}
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { borderRadius: radius, borderWidth: 1, borderColor: glass.border }]}
        />
        <View style={contentStyle}>{children}</View>
      </View>
    </View>
  );
}
