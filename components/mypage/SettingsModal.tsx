import type { NotificationSetting, UserProfile } from '@/types/mypage';
import { Bell, BellOff, ChevronRight, LogOut, Shield, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Modal,
    Pressable,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type Props = {
  visible: boolean;
  profile: UserProfile;
  notificationSettings: NotificationSetting;
  onUpdateNotifications: (settings: NotificationSetting) => void;
  onLogout: () => void;
  onClose: () => void;
};

const PROVIDER_LABEL: Record<UserProfile['oauthProvider'], string> = {
  kakao: '카카오로 로그인',
  google: '구글로 로그인',
  apple: '애플로 로그인',
};

const PROVIDER_COLOR: Record<UserProfile['oauthProvider'], string> = {
  kakao: '#FEE500',
  google: '#4285F4',
  apple: '#000',
};

export default function SettingsModal({
  visible,
  profile,
  notificationSettings,
  onUpdateNotifications,
  onLogout,
  onClose,
}: Props) {
  const [settings, setSettings] = useState(notificationSettings);
  const slideAnim = useRef(new Animated.Value(600)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setSettings(notificationSettings);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
          stiffness: 180,
        }),
        Animated.timing(backdropAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      slideAnim.setValue(600);
      backdropAnim.setValue(0);
    }
  }, [visible]);

  const handleClose = () => {
    onUpdateNotifications(settings);
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 600, duration: 240, useNativeDriver: true }),
      Animated.timing(backdropAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => onClose());
  };

  const toggle = (key: keyof NotificationSetting) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '로그아웃', style: 'destructive', onPress: onLogout },
    ]);
  };

  const screenH = Dimensions.get('window').height;

  const SectionLabel = ({ label }: { label: string }) => (
    <Text
      style={{
        fontSize: 11,
        fontWeight: '700',
        color: '#898989',
        letterSpacing: 0.5,
        marginBottom: 8,
        marginTop: 4,
      }}
    >
      {label.toUpperCase()}
    </Text>
  );

  const SettingRow = ({
    icon,
    label,
    desc,
    value,
    onToggle,
  }: {
    icon: React.ReactNode;
    label: string;
    desc?: string;
    value: boolean;
    onToggle: () => void;
  }) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9F9F9',
        borderRadius: 14,
        padding: 14,
        marginBottom: 8,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: value ? '#FFF8D6' : '#F0EEEC',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#22272B' }}>{label}</Text>
          {desc && <Text style={{ fontSize: 11, color: '#898989', marginTop: 1 }}>{desc}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#F0EEEC', true: '#FFDC53' }}
        thumbColor={value ? '#22272B' : '#fff'}
        ios_backgroundColor="#F0EEEC"
      />
    </View>
  );

  return (
    <Modal transparent visible={visible} onRequestClose={handleClose} animationType="none">
      <Animated.View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', opacity: backdropAnim }}>
        <Pressable style={{ flex: 1 }} onPress={handleClose} />

        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            backgroundColor: '#fff',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            maxHeight: screenH * 0.85,
          }}
        >
          {/* Handle */}
          <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#D9D9D9' }} />
          </View>

          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingVertical: 14,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: '800', color: '#22272B', letterSpacing: -0.4 }}
            >
              설정
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: '#F0EEEC',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={16} color="#898989" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ paddingHorizontal: 20, paddingBottom: 48, gap: 4 }}>
              {/* Account */}
              <SectionLabel label="계정" />
              <View
                style={{
                  backgroundColor: '#F9F9F9',
                  borderRadius: 14,
                  padding: 14,
                  marginBottom: 16,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: PROVIDER_COLOR[profile.oauthProvider] + '20',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>
                      {profile.oauthProvider === 'kakao'
                        ? '💬'
                        : profile.oauthProvider === 'google'
                          ? '🌐'
                          : '🍎'}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#22272B' }}>
                      {PROVIDER_LABEL[profile.oauthProvider]}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#898989', marginTop: 1 }}>
                      가입일 {profile.joinedAt}
                    </Text>
                  </View>
                  <ChevronRight size={16} color="#D9D9D9" />
                </View>
              </View>

              {/* Notifications */}
              <SectionLabel label="알림" />
              <View style={{ marginBottom: 16 }}>
                <SettingRow
                  icon={<Bell size={16} color={settings.dailyDigest ? '#22272B' : '#898989'} />}
                  label="오늘의 뉴스"
                  desc="매일 아침 8시, 뉴스 피드를 알려드려요"
                  value={settings.dailyDigest}
                  onToggle={() => toggle('dailyDigest')}
                />
                <SettingRow
                  icon={<Bell size={16} color={settings.quizReminder ? '#22272B' : '#898989'} />}
                  label="퀴즈 리마인더"
                  desc="오늘 퀴즈를 풀지 않았을 때 알림"
                  value={settings.quizReminder}
                  onToggle={() => toggle('quizReminder')}
                />
                <SettingRow
                  icon={<BellOff size={16} color={settings.streakAlert ? '#22272B' : '#898989'} />}
                  label="스트릭 위기 알림"
                  desc="연속 학습이 끊길 것 같을 때 알림"
                  value={settings.streakAlert}
                  onToggle={() => toggle('streakAlert')}
                />
              </View>

              {/* Etc */}
              <SectionLabel label="기타" />
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#F9F9F9',
                  borderRadius: 14,
                  padding: 14,
                  marginBottom: 8,
                }}
                activeOpacity={0.7}
                onPress={() => Alert.alert('개인정보처리방침', '준비 중이에요.')}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: '#F0EEEC',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Shield size={16} color="#898989" />
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#22272B' }}>
                    개인정보처리방침
                  </Text>
                </View>
                <ChevronRight size={16} color="#D9D9D9" />
              </TouchableOpacity>

              {/* Logout */}
              <TouchableOpacity
                onPress={handleLogout}
                activeOpacity={0.8}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  backgroundColor: '#FFF0F0',
                  borderRadius: 14,
                  padding: 14,
                  marginTop: 12,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: '#FFE0E0',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LogOut size={16} color="#E53935" />
                </View>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#E53935' }}>로그아웃</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
