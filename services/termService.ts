import type { TermAction } from '@/types/learning';
import { type ApiResponse } from '@/utils/api';

// newsService와 같은 패턴. 실제 API 연결 시 mock 부분을 apiClient 호출로 교체하세요.
const mock = (termId: string, action: TermAction['action']): Promise<ApiResponse<TermAction>> =>
  new Promise((resolve) =>
    setTimeout(
      () => resolve({ data: { termId, action, timestamp: new Date().toISOString() }, status: 200 }),
      300
    )
  );

export const termService = {
  saveTerm: (termId: string) => mock(termId, 'save'), // return apiClient.post<TermAction>(`/api/terms/${termId}/save`, {});
  unsaveTerm: (termId: string) => mock(termId, 'unsave'), // return apiClient.post<TermAction>(`/api/terms/${termId}/unsave`, {});
};
// services/index.ts 에 추가: export * from './termService';
