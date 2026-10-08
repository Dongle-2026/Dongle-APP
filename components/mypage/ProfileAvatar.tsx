import { glass } from '@/components/common/glass';
import {
    Image,
    type ImageSourcePropType,
    type StyleProp,
    View,
    type ViewStyle,
} from 'react-native';

type Props = {
  uri?: string | null; // 업로드/선택한 사진 (있으면 우선)
  avatarSource?: ImageSourcePropType; // 없으면 아바타
  size: number;
  radius?: number;
  bg?: string;
  style?: StyleProp<ViewStyle>;
};

// 마이페이지 카드 / 프로필 편집 미리보기 / (필요 시) 설정 모달에서 공통으로 사용
export default function ProfileAvatar({
  uri,
  avatarSource,
  size,
  radius = size * 0.3,
  bg = glass.inkFaint,
  style,
}: Props) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: bg,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
          accessibilityLabel="프로필 사진"
        />
      ) : avatarSource ? (
        // 기존 비율(48:55 in 72) 유지
        <Image source={avatarSource} style={{ width: size * 0.667, height: size * 0.764 }} />
      ) : null}
    </View>
  );
}
