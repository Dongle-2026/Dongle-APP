import { useMe, useMyStats } from '@/hooks/queries/queries';
import { router } from 'expo-router';
import { Image, Text, View } from 'react-native';
import { GlassCard, GlassChip, glass } from '../common/glass';

// ─── 홈 헤더 ─────────────────────────────────────────────────────────────────

type Props = {
  /** SafeAreaView의 top inset — FlatList 안에서 호출 시 직접 넘겨줘야 함 */
  topInset?: number;
};

export default function HomeHeader({ topInset = 52 }: Props) {
  const { data: stats } = useMyStats();
  const { data: me } = useMe();
  const streak = stats?.streak ?? 0;
  const todayHoney = stats?.todayHoney ?? 0;
  const nickname = me?.nickname ?? '';

  return (
    <>
      {/* ── 상단 로고 바 ── */}
      <View
        style={{
          paddingTop: topInset,
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
      {/* 기존 `todayHoney && (…)`는 0일 때 '0'이 그대로 렌더되는 버그 → 통계가 로드된 뒤에만 배너 표시 */}
      {stats && (
        <View className="py-3 px-6">
          <GlassCard onPress={() => {}}>
            {todayHoney == 0 ? (
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
                    {nickname}님 연속학습을 이어가세요!
                  </Text>
                </View>
              </View>
            ) : (
              <View className="flex-row items-center gap-4 pb-2">
                <Image
                  source={require('@/assets/avatars/happy.png')}
                  style={{
                    width: 48,
                    height: 55,
                  }}
                />
                <View>
                  <Text style={{ fontSize: 20, fontWeight: '500', color: glass.ink }}>
                    오늘 {todayHoney}P 꿀을 모았어요
                  </Text>
                  <Text style={{ fontSize: 14, lineHeight: 21, color: glass.inkMuted }}>
                    {nickname}님 잘하고 있어요!
                  </Text>
                </View>
              </View>
            )}
          </GlassCard>
        </View>
      )}
    </>
  );
}
