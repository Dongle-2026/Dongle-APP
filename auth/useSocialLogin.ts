import { HttpError } from '@/services/api/client';
import { authService } from '@/services/authService';
import type { Provider } from '@/types/api/common';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';
import { useRef, useState } from 'react';
import { authStore } from './authStore';

WebBrowser.maybeCompleteAuthSession();

// 백엔드(POST /api/auth/oauth/{provider})는 kakao | google 의 OIDC idToken(+nonce)만 지원한다.
// 앱은 OIDC 인증 후 받은 idToken을 그대로 전달 → 백엔드가 서명·audience 검증.
// 필요한 환경변수 (README 참고)
const KAKAO_KEY = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY;
const GOOGLE_WEB = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const GOOGLE_IOS = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const GOOGLE_ANDROID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;

export const socialConfigured = {
  kakao: !!KAKAO_KEY,
  google: !!(GOOGLE_WEB || GOOGLE_IOS || GOOGLE_ANDROID),
};

// 키가 없으면 expo-auth-session이 hook 호출 시점에 예외를 던지므로 자리표시자를 넣고, 버튼은 비활성 처리한다.
const UNSET = 'unset';
const KAKAO_REDIRECT = AuthSession.makeRedirectUri({ path: 'oauth/kakao' }); // app.json 의 scheme 필요

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
  const googleNonce = useRef(Crypto.randomUUID()).current;
  const kakaoNonce = useRef(Crypto.randomUUID()).current;

  const [, , googlePrompt] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_WEB ?? UNSET,
    iosClientId: GOOGLE_IOS ?? UNSET,
    androidClientId: GOOGLE_ANDROID ?? UNSET,
    extraParams: { nonce: googleNonce },
  });

  const kakaoDiscovery = AuthSession.useAutoDiscovery('https://kauth.kakao.com');
  const [kakaoRequest, , kakaoPrompt] = AuthSession.useAuthRequest(
    {
      clientId: KAKAO_KEY ?? UNSET,
      redirectUri: KAKAO_REDIRECT,
      scopes: ['openid'],
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
      extraParams: { nonce: kakaoNonce },
    },
    kakaoDiscovery
  );

  /** 성공하면 토큰 저장(authStore.signIn)까지 끝낸다. 메인 화면 이동은 app/_layout.tsx 의 인증 분기가 처리. */
  const login = async (provider: Provider): Promise<boolean> => {
    setError(null);
    setLoading(provider);
    try {
      let idToken: string | undefined;
      let nonce: string;

      if (provider === 'google') {
        nonce = googleNonce;
        const res = await googlePrompt();
        if (res.type !== 'success') return false; // 사용자가 취소
        idToken = res.params.id_token ?? res.authentication?.idToken;
      } else {
        nonce = kakaoNonce;
        const res = await kakaoPrompt();
        if (res.type !== 'success' || !kakaoDiscovery) return false;
        const token = await AuthSession.exchangeCodeAsync(
          {
            clientId: KAKAO_KEY ?? UNSET,
            code: res.params.code,
            redirectUri: KAKAO_REDIRECT,
            extraParams: kakaoRequest?.codeVerifier
              ? { code_verifier: kakaoRequest.codeVerifier }
              : undefined,
          },
          kakaoDiscovery
        );
        idToken = token.idToken;
      }

      if (!idToken) throw new Error('ID 토큰을 받지 못했어요. 앱 키/OpenID 설정을 확인해주세요.');
      const tokens = await authService.oauthLogin(provider, { idToken, nonce });
      // tokens.newUser === true 이면 문서상 "온보딩" 대상이나 온보딩 화면/API 명세가 없어 구현하지 않음
      await authStore.signIn(tokens);
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
