import { authStore } from '@/auth/authStore';
import { socialConfigured, useSocialLogin } from '@/auth/useSocialLogin';
import { GlassButton, GlassInput, glass } from '@/components/common/glass';
import { HttpError } from '@/services/api/client';
import { authService } from '@/services/authService';
import { Lock, Mail, User } from 'lucide-react-native';
import { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Image
            source={require('@/assets/avatars/happy.png')}
            style={{ width: 96, height: 110 }}
            resizeMode="contain"
          />
          <Text className="text-[32px]" style={{ marginTop: 12 }}>
            돈글돈글
          </Text>
          <Text style={{ fontSize: 14, color: glass.inkMuted, marginTop: 4 }}>
            뉴스로 배우는 쉬운 금융
          </Text>
        </View>

        {mode === 'start' ? (
          <>
            {/* 카카오: 브랜드 가이드 색상(노랑/검정) */}
            <TouchableOpacity
              onPress={() => void social.login('kakao')}
              disabled={busy || !socialConfigured.kakao}
              accessibilityRole="button"
              style={{
                height: 56,
                borderRadius: 28,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FEE500',
                opacity: busy || !socialConfigured.kakao ? 0.45 : 1,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#191919' }}>
                {social.loading === 'kakao' ? '로그인 중…' : '카카오로 시작하기'}
              </Text>
            </TouchableOpacity>
            <GlassButton
              label={social.loading === 'google' ? '로그인 중…' : 'Google로 시작하기'}
              variant="glass"
              size="lg"
              fullWidth
              disabled={busy || !socialConfigured.google}
              onPress={() => void social.login('google')}
            />
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
