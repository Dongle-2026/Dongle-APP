import { mockStreakData } from '@/mocks/homeMock';
import { mockProfile } from '@/mocks/mypageMock';
import { router } from 'expo-router';
import { Image, Text, View } from 'react-native';
import { GlassCard, GlassChip, glass } from '../common/glass';

// ─── 홈 헤더 ─────────────────────────────────────────────────────────────────

type Props = {
  /** SafeAreaView의 top inset — FlatList 안에서 호출 시 직접 넘겨줘야 함 */
  topInset?: number;
};

export default function HomeHeader({ topInset = 52 }: Props) {
  const { streak, todayDone } = mockStreakData;

  return (
    <>
      {/* ── 상단 로고 바 ── */}
      <View
        style={{
          paddingTop: topInset + 12,
          paddingHorizontal: 16,
          paddingBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text className="text-[32px]">투데이 돈글</Text>
        <GlassChip label={`✨ ${streak}일`} selected onPress={() => router.navigate('/mypage')} />
      </View>

      {/* ── 오늘 학습 유도 배너 (미완료 시) ── */}
      {!todayDone && (
        <View className="py-3 px-6">
          <GlassCard onPress={() => {}}>
            <View className="flex-row items-center gap-4 pb-2">
              <Image
                source={require('@/assets/avatars/wow.png')}
                style={{
                  width: 48,
                  height: 55,
                }}
              />
              <View>
                <Text style={{ fontSize: 20, fontWeight: '500', color: glass.ink }}>
                  오늘의 꿀단지가 비었어요!
                </Text>
                <Text style={{ fontSize: 14, lineHeight: 21, color: glass.inkMuted }}>
                  {mockProfile.nickname}님 연속학습을 이어가세요!
                </Text>
              </View>
            </View>
          </GlassCard>
        </View>
      )}
    </>
  );
}
