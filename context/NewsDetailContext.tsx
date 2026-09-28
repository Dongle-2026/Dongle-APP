'use client';

import type { RefObject } from 'react';
import { createContext, useCallback, useContext, useState } from 'react';
import { View } from 'react-native';

// ─── 타입 ─────────────────────────────────────────────────────────────────────

type OpenPayload = {
  newsId: string;
  thumbnail: string;
  title: string;
  cardRef: RefObject<View | null>;
};

type NewsDetailContextValue = {
  /** 현재 열려있는 뉴스 정보 (없으면 null) */
  current: OpenPayload | null;
  /** 뉴스 상세 열기 */
  open: (payload: OpenPayload) => void;
  /** 뉴스 상세 닫기 */
  close: () => void;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const NewsDetailContext = createContext<NewsDetailContextValue | null>(null);

export function NewsDetailProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<OpenPayload | null>(null);

  const open = useCallback((payload: OpenPayload) => {
    setCurrent(payload);
  }, []);

  const close = useCallback(() => {
    setCurrent(null);
  }, []);

  return (
    <NewsDetailContext.Provider value={{ current, open, close }}>
      {children}
    </NewsDetailContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useNewsDetail() {
  const ctx = useContext(NewsDetailContext);
  if (!ctx) throw new Error('useNewsDetail must be used inside <NewsDetailProvider>');
  return ctx;
}
