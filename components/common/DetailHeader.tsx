import { GlassIconButton, glass } from '@/components/common/glass';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Text, View } from 'react-native';

// 상세 화면 공통 헤더: 뒤로가기(GlassIconButton) + 제목
export default function DetailHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        paddingBottom: 12,
      }}
    >
      <GlassIconButton icon={ChevronLeft} label="뒤로" onPress={() => router.back()} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 22, fontWeight: '600', color: glass.ink, letterSpacing: -0.5 }}>
          {title}
        </Text>
        {subtitle ? <Text style={{ fontSize: 13, color: glass.inkMuted }}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}
