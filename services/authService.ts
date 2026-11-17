import type {
  AuthTokensResponse,
  EmailLoginRequest,
  OAuthLoginRequest,
  OAuthLoginResponse,
  SignupRequest,
} from '@/types/api/auth';
import type { Provider } from '@/types/api/common';
import { http } from './api/client';

export const authService = {
  oauthLogin: (provider: Provider, body: OAuthLoginRequest) =>
    http.post<OAuthLoginResponse>(`/api/auth/oauth/${provider}`, { body, auth: 'none' }),
  refresh: (refreshToken: string) =>
    http.post<AuthTokensResponse>('/api/auth/refresh', { body: { refreshToken }, auth: 'none' }),
  logout: () => http.post<void>('/api/auth/logout'),
  login: (body: EmailLoginRequest) =>
    http.post<AuthTokensResponse>('/api/auth/login', { body, auth: 'none' }),
  signup: (body: SignupRequest) =>
    http.post<AuthTokensResponse>('/api/auth/signup', { body, auth: 'none' }),
  // /api/auth/reissue, /api/auth/withdraw 는 "기존 호환" → 앱은 refresh / DELETE /api/me 사용 (미구현)
};
