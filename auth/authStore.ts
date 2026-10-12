import { queryClient } from '@/lib/queryClient';
import { setAuthExpiredHandler } from '@/services/api/client';
import { tokenStorage } from '@/services/api/tokenStorage';
import type { AuthTokensResponse } from '@/types/api/auth';
import { useSyncExternalStore } from 'react';

type AuthState = { status: 'loading' | 'authed' | 'anon' };
let state: AuthState = { status: 'loading' };
const subs = new Set<() => void>();
const set = (s: AuthState) => {
  state = s;
  subs.forEach((f) => f());
};

export const authStore = {
  useAuth: () =>
    useSyncExternalStore(
      (cb) => {
        subs.add(cb);
        return () => {
          subs.delete(cb);
        };
      },
      () => state
    ),
  async bootstrap() {
    set({ status: (await tokenStorage.getAccess()) ? 'authed' : 'anon' });
  },
  async signIn(t: AuthTokensResponse) {
    await tokenStorage.set(t.accessToken, t.refreshToken);
    queryClient.clear();
    set({ status: 'authed' });
  },
  async signOut() {
    await tokenStorage.clear();
    queryClient.clear();
    set({ status: 'anon' });
  },
};

// 토큰 갱신까지 실패하면 로그아웃 상태로 전환
setAuthExpiredHandler(() => {
  void authStore.signOut();
});
