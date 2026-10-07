import { Platform, type ViewStyle } from 'react-native';

// 탭바에서 쓰던 값을 그대로 토큰화했습니다.
const sh = (opacity: number, radius: number, y: number, elevation: number): ViewStyle =>
  Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: y },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: { elevation },
    default: {},
  }) as ViewStyle;

export const glass = {
  ink: '#22272B',
  inkMuted: 'rgba(34, 39, 43, 0.6)',
  inkFaint: 'rgba(34, 39, 43, 0.08)', // 탭바 pill 색
  border: 'rgba(255, 255, 255, 0.7)',
  androidBg: 'rgba(255, 255, 255, 0.88)',
  // 그림자는 불투명도가 있는 뷰에서만 그려지므로, 블러 아래에 얇게 깔아두는 판
  plate: 'rgba(255, 255, 255, 0.4)',
  blur: 60,
  // plate 투명도(0.4)만큼 그림자가 옅어지므로 원본보다 shadowOpacity를 높게 잡았습니다.
  shadow: {
    none: {} as ViewStyle,
    sm: sh(0.18, 12, 3, 3),
    md: sh(0.22, 24, 7, 7),
    lg: sh(0.26, 32, 12, 12),
  },
};

export type ShadowLevel = keyof typeof glass.shadow;
