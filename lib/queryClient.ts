import { HttpError } from '@/services/api/client';
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      // 4xx(인증·검증 오류)는 재시도해도 같은 결과이므로 네트워크/5xx만 최대 2회
      retry: (count, err) =>
        !(err instanceof HttpError && err.status >= 400 && err.status < 500) && count < 2,
    },
  },
});
