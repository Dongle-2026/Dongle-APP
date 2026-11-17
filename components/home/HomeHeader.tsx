import { useMe, useMyStats } from '@/hooks/queries/queries';
import { router } from 'expo-router';
import { Image, Text, View } from 'react-native';
import { GlassCard, GlassChip, glass } from '../common/glass';

type Props = {
  topInset?: number;
};

export default function HomeHeader({ topInset = 52 }: Props) {
  const { data: stats } = useMyStats();
  const { data: me } = useMe();
  const streak = stats?.streak ?? 0;
  const todayHoney = stats?.todayHoney ?? 0;
  const nickname = me?.nickname ?? '돈글이';

  // 목표 꿀단지 (예: 하루 목표 50P 기준 진행률)
  const maxHoney = 50;
  const progressPercent = Math.min(100, Math.max(0, (todayHoney / maxHoney) * 100));

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

      {stats && (
        <View className="py-2 px-6">
          <GlassCard onPress={() => {}}>
            <View className="px-2">
              <View className="flex-row items-center">
                <View className="flex-1">
                  {todayHoney === 0 ? (
                    <>
                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: '700',
                          color: glass.ink,
                          lineHeight: 28,
                        }}
                      >
                        {nickname}님, 오늘의{'\n'}꿀단지가 비어있어요!
                      </Text>
                      <Text style={{ fontSize: 13, color: glass.inkMuted, marginTop: 4 }}>
                        오늘의 뉴스를 읽고 꿀을 모아보세요
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: '600',
                          color: glass.ink,
                          lineHeight: 28,
                        }}
                      >
                        {nickname}님, 오늘 <Text className="font-bold">{todayHoney}P</Text> {'\n'}
                        꿀을 모았어요!
                      </Text>
                    </>
                  )}
                </View>

                <Image
                  source={
                    todayHoney === 0
                      ? require('@/assets/avatars/sad.png')
                      : require('@/assets/avatars/fire.png')
                  }
                  style={{
                    width: 90,
                    height: 95,
                    resizeMode: 'contain',
                  }}
                />
              </View>

              <View className="flex-row items-center">
                <View
                  style={{
                    height: 12,
                    width: '50%',
                    backgroundColor: 'rgba(0, 0, 0, 0.03)',
                    borderRadius: 999,
                    overflow: 'hidden',
                    borderWidth: 1,
                    borderColor: 'rgba(0, 0, 0, 0.01)',
                  }}
                >
                  <View
                    style={{
                      width: `${Math.max(progressPercent, 4)}%`,
                      height: '100%',
                      backgroundColor: '#FFDC53',
                      borderRadius: 999,
                    }}
                  />
                </View>
                <View className="flex-row items-center gap-1 pl-4">
                  <Text style={{ fontSize: 11, fontWeight: '700', color: glass.ink }}>
                    {todayHoney}P
                  </Text>
                  <Text style={{ fontSize: 11, fontWeight: '500', color: glass.inkMuted }}>
                    / {maxHoney}P
                  </Text>
                </View>
              </View>
            </View>
          </GlassCard>
        </View>
      )}
    </>
  );
}
