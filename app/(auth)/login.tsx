import { authStore } from '@/auth/authStore';
import { socialConfigured, useSocialLogin } from '@/auth/useSocialLogin';
import { GlassButton, GlassInput, glass } from '@/components/common/glass';
import { HttpError } from '@/services/api/client';
import { authService } from '@/services/authService';
import { Lock, Mail, User } from 'lucide-react-native';
import { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Path, Svg } from 'react-native-svg';

type Mode = 'start' | 'login' | 'signup';

export default function LoginScreen() {
  const social = useSocialLogin();
  const [mode, setMode] = useState<Mode>('start');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const busy = submitting || social.loading !== null;
  const error = formError ?? social.error;

  const validate = (): string | null => {
    if (!email.includes('@')) return '이메일 형식을 확인해주세요.';
    if (password.length < 8 || password.length > 100) return '비밀번호는 8~100자로 입력해주세요.'; // 문서: 8~100자
    if (mode === 'signup' && (!name.trim() || !nickname.trim()))
      return '이름과 닉네임을 입력해주세요.';
    return null;
  };

  // 이메일 로그인/회원가입 — 성공하면 토큰 저장 → app/_layout.tsx 인증 분기가 메인으로 이동시킴
  const submit = async () => {
    const invalid = validate();
    if (invalid) return setFormError(invalid);
    setFormError(null);
    setSubmitting(true);
    try {
      const tokens =
        mode === 'signup'
          ? await authService.signup({
              email: email.trim(),
              password,
              name: name.trim(),
              nickname: nickname.trim(),
            })
          : await authService.login({ email: email.trim(), password });
      await authStore.signIn(tokens);
    } catch (e) {
      if (e instanceof HttpError && e.code === 4104)
        setFormError('소셜 로그인으로 가입한 계정이에요.');
      else setFormError(e instanceof Error ? e.message : '요청에 실패했어요.');
    } finally {
      setSubmitting(false);
    }
  };

  const goMode = (m: Mode) => {
    setMode(m);
    setFormError(null);
    social.clearError();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24, gap: 12 }}
      >
        <View style={{ alignItems: 'center', height: 120 }}>
          <View className="flex-row items-center gap-2 mb-2">
            <Image
              source={require('@/assets/images/logo.png')}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
            <Image
              source={require('@/assets/images/logo1.png')}
              style={{ width: 100, height: 30 }}
              resizeMode="contain"
            />
          </View>
          <Text style={{ fontSize: 14, color: glass.inkMuted, marginTop: 4 }}>
            돈 이야기, 어렵지 않게
          </Text>
        </View>

        {mode === 'start' ? (
          <>
            {/* 카카오: 브랜드 가이드 색상(노랑/검정) */}
            <TouchableOpacity
              onPress={() => void social.login('kakao')}
              disabled={busy || !socialConfigured.kakao}
              accessibilityRole="button"
              accessibilityLabel="카카오로 시작하기"
              style={{
                height: 56,
                borderRadius: 28,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FEE500',
                opacity: busy || !socialConfigured.kakao ? 0.45 : 1,
                position: 'relative',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Svg width={22} height={22} viewBox="0 0 24 24">
                  <Path
                    d="M12 3C6.477 3 2 6.49 2 10.8c0 2.78 1.84 5.22 4.62 6.58l-1.18 4.3a.3.3 0 0 0 .46.32l5.1-3.38c.33.03.66.05 1 .05 5.523 0 10-3.49 10-7.87C22 6.49 17.523 3 12 3Z"
                    fill="#191919"
                  />
                </Svg>

                <Text style={{ fontSize: 16, fontWeight: '700', color: '#191919' }}>
                  {social.loading === 'kakao' ? '로그인 중…' : '카카오로 시작하기'}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => void social.login('google')}
              disabled={busy || !socialConfigured.google}
              accessibilityRole="button"
              accessibilityLabel="Google로 시작하기"
              style={{
                height: 56,
                borderRadius: 28,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#DADCE0',
                opacity: busy || !socialConfigured.google ? 0.45 : 1,
                position: 'relative',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Svg width={20} height={20} viewBox="0 0 533.5 544.3">
                  <Path
                    fill="#4285F4"
                    d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147.1c-6.4 33.7-25.7 62.3-54.7 81.4v67.8h88.5c51.8-47.8 84.5-118.2 84.5-203.7z"
                  />
                  <Path
                    fill="#34A853"
                    d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-88.5-67.8c-24.4 16.6-55.8 26.4-91.9 26.4-70.6 0-130.4-47.7-151.7-111.8H27.5v70.2c45.9 91.1 139.8 158.7 244.6 158.7z"
                  />
                  <Path
                    fill="#FBBC05"
                    d="M120.4 325.4c-5.4-16.1-8.5-33.3-8.5-51.4s3.1-35.3 8.5-51.4v-70.2H27.5C10 191.5 0 232.8 0 274s10 82.5 27.5 121.6l92.9-70.2z"
                  />
                  <Path
                    fill="#EA4335"
                    d="M272.1 107.7c39.9 0 75.8 13.7 104.1 40.5l78.1-78.1C407.3 28.5 345.5 0 272.1 0 167.3 0 73.4 67.6 27.5 158.7l92.9 70.2c21.3-64.1 81.1-111.2 151.7-111.2z"
                  />
                </Svg>

                <Text style={{ fontSize: 16, fontWeight: '600', color: '#3C4043' }}>
                  {social.loading === 'google' ? '로그인 중…' : 'Google로 시작하기'}
                </Text>
              </View>
            </TouchableOpacity>
            <GlassButton
              label="이메일로 계속하기"
              variant="ghost"
              size="sm"
              fullWidth
              onPress={() => goMode('login')}
            />
          </>
        ) : (
          <>
            <GlassInput
              icon={Mail}
              placeholder="이메일"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <GlassInput
              icon={Lock}
              placeholder="비밀번호 (8자 이상)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            {mode === 'signup' && (
              <>
                <GlassInput icon={User} placeholder="이름" value={name} onChangeText={setName} />
                <GlassInput
                  icon={User}
                  placeholder="닉네임"
                  value={nickname}
                  onChangeText={setNickname}
                  maxLength={12}
                />
              </>
            )}
            <GlassButton
              label={submitting ? '처리 중…' : mode === 'signup' ? '회원가입' : '로그인'}
              variant="solid"
              size="lg"
              fullWidth
              loading={submitting}
              disabled={busy}
              onPress={() => void submit()}
            />
            <TouchableOpacity
              onPress={() => goMode(mode === 'signup' ? 'login' : 'signup')}
              style={{ alignItems: 'center', padding: 8 }}
            >
              <Text style={{ color: glass.inkMuted }}>
                {mode === 'signup' ? '이미 계정이 있나요? 로그인' : '계정이 없나요? 회원가입'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => goMode('start')}
              style={{ alignItems: 'center', padding: 8 }}
            >
              <Text style={{ color: glass.inkMuted }}>다른 방법으로 시작하기</Text>
            </TouchableOpacity>
          </>
        )}

        {error ? (
          <Text style={{ color: '#FF3B30', textAlign: 'center', fontSize: 13 }}>{error}</Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
