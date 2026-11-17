import { HttpError } from '@/services/api/client';
import type { Provider } from '@/types/api/common';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { authStore } from './authStore';

WebBrowser.maybeCompleteAuthSession();
const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000').replace(
  /\/$/,
  ''
);

// Spring 인증 완료 후 앱으로 돌아올 복귀 주소 (app.json의 scheme과 일치해야 함)
const getRedirectUri = (provider: Provider) => {
  return `exp://nqrnuqq-ktritofficial-8081.exp.direct/--/oauth/${provider}`;
};

export const socialConfigured = {
  kakao: true,
  google: true,
};

function toMessage(e: unknown): string {
  if (e instanceof HttpError) {
    if (e.code === 4006 || e.status === 401) return '로그인 인증에 실패했어요. 다시 시도해주세요.';
    if (e.code === 4007 || e.status === 409) return '같은 이메일이 다른 방식으로 가입되어 있어요.';
    if (e.code === 5004 || e.status === 503)
      return '서버의 소셜 로그인 설정이 아직 준비되지 않았어요.';
    return e.message;
  }
  return e instanceof Error ? e.message : '로그인에 실패했어요.';
}

export function useSocialLogin() {
  const [loading, setLoading] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const login = async (provider: Provider): Promise<boolean> => {
    setError(null);
    setLoading(provider);
    try {
      const redirectUri = getRedirectUri(provider);
      const authUrl = `${API_BASE_URL}/oauth2/authorization/${provider}`;
      const res = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      if (res.type !== 'success' || !res.url) {
        return false; // 사용자가 취소했거나 창을 닫음
      }

      const parsedUrl = new URL(res.url);

      const accessToken =
        parsedUrl.searchParams.get('accessToken') || parsedUrl.searchParams.get('token');
      const refreshToken = parsedUrl.searchParams.get('refreshToken');

      if (!accessToken || !refreshToken) {
        throw new Error('인증 토큰을 전달받지 못했어요. 백엔드 리다이렉트 설정을 확인해주세요.');
      }

      await authStore.signIn({
        accessToken,
        refreshToken,
        nickname: parsedUrl.searchParams.get('nickname') || '',
      });

      return true;
    } catch (e) {
      setError(toMessage(e));
      return false;
    } finally {
      setLoading(null);
    }
  };

  return { login, loading, error, clearError: () => setError(null) };
}
