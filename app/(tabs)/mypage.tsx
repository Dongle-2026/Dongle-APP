import { glass, GlassCard, GlassChip, GlassIconButton } from '@/components/common/glass';
import SectionHeader from '@/components/common/SectionHeader';
import ActivityHeatmap from '@/components/mypage/ActivityHeatmap';
import ProfileAvatar from '@/components/mypage/ProfileAvatar';
import ProfileEditModal from '@/components/mypage/ProfileEditModal';
import SettingsModal from '@/components/mypage/SettingsModal';

import { profileService } from '@/services/profileService';
import type { NotificationSetting, ProfileEditInput, UserProfile } from '@/types/mypage';
import {
  AVATAR_OPTIONS,
  mockActivityData,
  mockLearningStats,
  mockMyActivity,
  mockNotificationSettings,
  mockProfile,
} from '@/utils/mock';
import { Flame, LucideIcon, Newspaper, Settings, Share, Trophy } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── 작은 유틸 컴포넌트들 ────────────────────────────────────────────────────

function StatPill({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: accent ? glass.ink : glass.inkFaint,
        borderRadius: 18,
        padding: 14,
        alignItems: 'center',
        gap: 4,
      }}
    >
      <Icon size={16} color={accent ? '#FFDC53' : glass.ink} />
      <Text
        style={{
          fontSize: 18,
          fontWeight: '800',
          color: accent ? '#FFDC53' : glass.ink,
          letterSpacing: -0.5,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontSize: 11,
          color: accent ? 'rgba(255,255,255,0.7)' : glass.inkMuted,
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
    </View>
  );
}
// ─── Main ────────────────────────────────────────────────────────────────────

export default function MypageScreen() {
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [notifSettings, setNotifSettings] = useState<NotificationSetting>(mockNotificationSettings);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleProfileSave = async (input: ProfileEditInput) => {
    const prev = profile;
    setProfile((p) => ({
      ...p,
      nickname: input.nickname,
      bio: input.bio,
      avatarId: input.avatarId,
      // 새 사진은 업로드가 끝나기 전까지 로컬 uri로 먼저 보여줌
      profileImageUrl: input.image === undefined ? p.profileImageUrl : (input.image?.uri ?? null),
    }));
    try {
      setProfile(await profileService.updateProfile(prev, input));
    } catch {
      setProfile(prev);
      Alert.alert('저장 실패', '프로필을 저장하지 못했어요. 잠시 후 다시 시도해주세요.');
    }
  };

  const selectedAvatar = AVATAR_OPTIONS.find((avatar) => avatar.id === profile.avatarId);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ backgroundColor: '#F9F9F9' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110, gap: 16 }}
      >
        {/* ── 상단 헤더바 ── */}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingBottom: 4,
            gap: 8,
          }}
        >
          <Text className="text-[32px]">마이페이지</Text>
          <View className="flex-row gap-2">
            <GlassIconButton icon={Share} label="공유" size={40} onPress={() => {}} />
            <GlassIconButton
              icon={Settings}
              label="설정"
              size={40}
              onPress={() => setShowSettings(true)}
            />
          </View>
        </View>

        {/* ── 프로필 카드 ── */}

        <GlassCard style={{ paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16 }}>
            <ProfileAvatar
              uri={profile.profileImageUrl}
              avatarSource={selectedAvatar?.source}
              size={72}
              radius={22}
            />
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '800',
                    color: glass.ink,
                    letterSpacing: -0.5,
                  }}
                >
                  {profile.nickname}
                </Text>
                <GlassChip label="편집" onPress={() => setShowEditModal(true)} />
              </View>
              <Text style={{ fontSize: 13, color: glass.inkMuted, marginTop: 4, lineHeight: 19 }}>
                {profile.bio || '소개를 작성해보세요'}
              </Text>
            </View>
          </View>
          <View style={{ height: 1, backgroundColor: glass.inkFaint, marginVertical: 16 }} />
          {/* 핵심 스탯 4개 */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <StatPill
              icon={Flame}
              label="연속 학습"
              accent
              value={`${mockLearningStats.streak}일`}
            />
            <StatPill
              icon={Newspaper}
              label="읽은 뉴스"
              value={`${mockLearningStats.readNewsCount}`}
            />
            <StatPill icon={Trophy} label="푼 퀴즈" value={`${mockLearningStats.totalQuizCount}`} />
          </View>
        </GlassCard>

        {/* ── 활동 히트맵 ── */}
        <GlassCard style={{ paddingHorizontal: 16 }}>
          <SectionHeader title="내 꿀단지" />
          <View className="flex-row items-center gap-2">
            <Text
              style={{
                fontSize: 28,
                fontWeight: '900',
                color: '#22272B',
                letterSpacing: -1,
                marginBottom: 12,
              }}
            >
              {mockLearningStats.totalHoney.toLocaleString()}
            </Text>
            <Text className="text-mono-500 text-sm">모았어요!</Text>
          </View>
          <ActivityHeatmap data={mockActivityData} />
        </GlassCard>

        {/* ── 내 활동 ── */}

        <GlassCard style={{ paddingHorizontal: 16 }}>
          <SectionHeader title="내 활동" />

          {/* 퀴즈 정답률 */}
          <View style={{ marginBottom: 24 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: '#898989',
                    marginBottom: 4,
                  }}
                >
                  퀴즈 정답률
                </Text>

                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: '900',
                    color: '#22272B',
                    letterSpacing: -1,
                  }}
                >
                  {mockMyActivity.correctRate}%
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 12,
                  color: '#898989',
                  fontWeight: '600',
                }}
              >
                총 {mockMyActivity.totalQuizCount}문제
              </Text>
            </View>

            {/* Progress Bar */}

            <View
              style={{
                height: 10,
                backgroundColor: '#F0EEEC',
                borderRadius: 999,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  width: `${mockMyActivity.correctRate}%`,
                  height: '100%',
                  backgroundColor: '#FFDC53',
                  borderRadius: 999,
                }}
              />
            </View>
          </View>

          {/* 분야 */}

          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: '#F6F6F8',
              paddingTop: 18,
              gap: 18,
            }}
          >
            {/* 관심 분야 */}

            <View>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '700',
                  color: '#898989',
                  marginBottom: 9,
                }}
              >
                내가 관심 있는 분야
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 7,
                }}
              >
                {mockMyActivity.interestedCategories.map((category) => (
                  <View
                    key={category}
                    style={{
                      paddingHorizontal: 11,
                      paddingVertical: 7,
                      borderRadius: 999,
                      backgroundColor: '#FFF7C2',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: '#5F4C08',
                      }}
                    >
                      {category}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 더 알아볼 분야 */}

            <View>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '700',
                  color: '#898989',
                  marginBottom: 9,
                }}
              >
                더 알아볼 분야
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 7,
                }}
              >
                {mockMyActivity.weakCategories.map((category) => (
                  <View
                    key={category}
                    style={{
                      paddingHorizontal: 11,
                      paddingVertical: 7,
                      borderRadius: 999,
                      backgroundColor: '#F0F6FE',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: '#5B8CCB',
                      }}
                    >
                      {category}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </GlassCard>

        {/* ── 배지 ── */}
        <GlassCard style={{ paddingHorizontal: 16 }}>
          <SectionHeader title="획득한 배지" />
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#D9D9D9', marginBottom: 10 }}>
            준비 중이에요. 조금만 기다려 주세요!
          </Text>
        </GlassCard>
      </ScrollView>

      {/* ── Modals ── */}
      <ProfileEditModal
        visible={showEditModal}
        profile={profile}
        onSave={handleProfileSave}
        onClose={() => setShowEditModal(false)}
      />
      <SettingsModal
        visible={showSettings}
        profile={profile}
        notificationSettings={notifSettings}
        onUpdateNotifications={setNotifSettings}
        onLogout={() => {
          setShowSettings(false);
          // 실제 로그아웃 로직 연결
        }}
        onClose={() => setShowSettings(false)}
      />
    </SafeAreaView>
  );
}
