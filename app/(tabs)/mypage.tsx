import Section from '@/components/common/Section';
import SectionHeader from '@/components/common/SectionHeader';
import ActivityHeatmap from '@/components/mypage/ActivityHeatmap';
import ProfileEditModal from '@/components/mypage/ProfileEditModal';
import SettingsModal from '@/components/mypage/SettingsModal';
import {
  mockActivityData,
  mockLearningStats,
  mockMyActivity,
  mockNotificationSettings,
  mockProfile,
} from '@/mocks/mypageMock';
import type { NotificationSetting, UserProfile } from '@/types/mypage';
import { Flame, LucideIcon, Newspaper, Settings, Share, Trophy } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
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
        backgroundColor: accent ? '#22272B' : '#F9F9F9',
        borderRadius: 16,
        padding: 14,
        alignItems: 'center',
        gap: 4,
      }}
    >
      <Icon size={16} color={accent ? '#FFDC53' : '#22272B'} />

      <Text
        style={{
          fontSize: 18,
          fontWeight: '800',
          color: accent ? '#FFDC53' : '#22272B',
          letterSpacing: -0.5,
        }}
      >
        {value}
      </Text>

      <Text
        style={{
          fontSize: 11,
          color: '#898989',
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

  const handleProfileSave = (updated: Pick<UserProfile, 'nickname' | 'bio' | 'avatarEmoji'>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="bg-mono-100">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* ── 상단 헤더바 ── */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 4,
            gap: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.7}
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#F0EEEC',
            }}
          >
            <Share size={18} color="#898989" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowSettings(true)}
            activeOpacity={0.7}
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#F0EEEC',
            }}
          >
            <Settings size={18} color="#898989" />
          </TouchableOpacity>
        </View>

        {/* ── 프로필 카드 ── */}
        <Section>
          {/* 아바타 + 기본 정보 */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16 }}>
            {/* 아바타 */}
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 18,
                borderWidth: 1.5,
                borderColor: '#F0EEEC',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 36 }}>{profile.avatarEmoji}</Text>
            </View>

            {/* 닉네임 + 소개 + 프로필 편집 버튼 */}
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
                    color: '#22272B',
                    letterSpacing: -0.5,
                  }}
                >
                  {profile.nickname}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowEditModal(true)}
                  activeOpacity={0.7}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 5,
                    borderRadius: 20,
                    backgroundColor: '#F6F6F8',
                    borderWidth: 1,
                    borderColor: '#F0EEEC',
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#898989' }}>편집</Text>
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  fontSize: 13,
                  color: '#898989',
                  marginTop: 4,
                  lineHeight: 19,
                }}
              >
                {profile.bio || '소개를 작성해보세요'}
              </Text>
            </View>
          </View>

          {/* 구분선 */}
          <View style={{ height: 1, backgroundColor: '#F6F6F8', marginVertical: 16 }} />

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
        </Section>

        {/* ── 활동 히트맵 ── */}
        <Section>
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
        </Section>

        {/* ── 내 활동 ── */}

        <Section>
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
        </Section>

        {/* ── 배지 ── */}
        <Section>
          <SectionHeader title="획득한 배지" />
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#D9D9D9', marginBottom: 10 }}>
            준비 중이에요. 조금만 기다려 주세요!
          </Text>
        </Section>
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
