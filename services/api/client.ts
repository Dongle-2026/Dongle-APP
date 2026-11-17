import type { ApiErrorBody } from '@/types/api/common';
import { tokenStorage } from './tokenStorage';

// 기존 utils/api.ts와 같은 환경변수를 사용 (EXPO_PUBLIC_API_URL / EXPO_PUBLIC_API_TIMEOUT)
const BASE_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '');
const TIMEOUT = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '30000', 10);

export class HttpError extends Error {
  constructor(
    public status: number,
    public code?: number,
    message?: string
  ) {
    super(message ?? `HTTP ${status}`);
    this.name = 'HttpError';
  }
  get isNetwork() {
    return this.status === 0;
  }
}

/** required: 토큰 필수 / optional: 있으면 첨부 / none: 첨부 안 함 (문서의 "인증" 열) */
export type AuthMode = 'required' | 'optional' | 'none';
type Query = Record<string, string | number | boolean | undefined | null>;
type Opts = { query?: Query; body?: unknown; form?: FormData; auth?: AuthMode };

let onAuthExpired: (() => void) | null = null;
export const setAuthExpiredHandler = (fn: () => void) => {
  onAuthExpired = fn;
};

// 문서는 "응답 data"로만 표기. 본문이 { data: ... } 형태면 data를, 아니면 본문 전체를 반환 (실서버 확인 필요)
const unwrap = <T>(json: unknown): T =>
  (json && typeof json === 'object' && 'data' in json ? (json as { data: T }).data : json) as T;

const toQuery = (q?: Query) => {
  if (!q) return '';
  const parts = Object.entries(q)
    .filter(([, v]) => v !== undefined && v !== null) // '' 는 유지 (bio="" 는 삭제를 의미)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  return parts.length ? `?${parts.join('&')}` : '';
};

// 기존 apiClient와 달리 타임아웃 타이머를 정리하고, 모든 요청에 적용
async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

const parse = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
};

// 동시에 여러 요청이 401을 받아도 갱신은 한 번만
let refreshing: Promise<boolean> | null = null;
function refreshTokens(): Promise<boolean> {
  if (!refreshing) {
    refreshing = (async () => {
      const refreshToken = await tokenStorage.getRefresh();
      if (!refreshToken) return false;
      try {
        const res = await fetchWithTimeout(`${BASE_URL}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        if (!res.ok) return false;
        const d = unwrap<{ accessToken: string; refreshToken: string }>(parse(await res.text()));
        await tokenStorage.set(d.accessToken, d.refreshToken); // 이전 refreshToken은 무효 → 반드시 교체 저장
        return true;
      } catch {
        return false;
      }
    })().finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
}

async function request<T>(
  method: string,
  path: string,
  opts: Opts = {},
  retried = false
): Promise<T> {
  const auth = opts.auth ?? 'required';
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json'; // FormData는 Content-Type 직접 지정 금지(boundary)
  if (auth !== 'none') {
    const token = await tokenStorage.getAccess();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetchWithTimeout(BASE_URL + path + toQuery(opts.query), {
      method,
      headers,
      body: opts.form ?? (opts.body !== undefined ? JSON.stringify(opts.body) : undefined),
    });
  } catch {
    throw new HttpError(0, undefined, '네트워크 연결을 확인해주세요.');
  }

  if (res.status === 401 && auth !== 'none' && !retried && (await tokenStorage.getRefresh())) {
    if (await refreshTokens()) return request<T>(method, path, opts, true);
  }

  const text = await res.text();
  const json = text ? parse(text) : undefined;
  if (!res.ok) {
    if (res.status === 401 && auth !== 'none') {
      await tokenStorage.clear();
      onAuthExpired?.();
    }
    const b = json as ApiErrorBody | undefined;
    throw new HttpError(res.status, b?.code, b?.message);
  }
  return unwrap<T>(json);
}

export const http = {
  get: <T>(path: string, o?: Opts) => request<T>('GET', path, o),
  post: <T>(path: string, o?: Opts) => request<T>('POST', path, o),
  put: <T>(path: string, o?: Opts) => request<T>('PUT', path, o),
  patch: <T>(path: string, o?: Opts) => request<T>('PATCH', path, o),
  delete: <T>(path: string, o?: Opts) => request<T>('DELETE', path, o),
};
