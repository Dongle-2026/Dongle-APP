import * as SecureStore from 'expo-secure-store';

const ACCESS = 'accessToken';
const REFRESH = 'refreshToken';
let access: string | null = null;
let refresh: string | null = null;
let loaded = false;

async function load() {
  if (loaded) return;
  [access, refresh] = await Promise.all([
    SecureStore.getItemAsync(ACCESS),
    SecureStore.getItemAsync(REFRESH),
  ]);
  loaded = true;
}

// 메모리 캐시 + SecureStore 영속화
export const tokenStorage = {
  async getAccess() {
    await load();
    return access;
  },
  async getRefresh() {
    await load();
    return refresh;
  },
  async set(a: string, r: string) {
    access = a;
    refresh = r;
    loaded = true;
    await Promise.all([SecureStore.setItemAsync(ACCESS, a), SecureStore.setItemAsync(REFRESH, r)]);
  },
  async clear() {
    access = null;
    refresh = null;
    loaded = true;
    await Promise.all([SecureStore.deleteItemAsync(ACCESS), SecureStore.deleteItemAsync(REFRESH)]);
  },
};
