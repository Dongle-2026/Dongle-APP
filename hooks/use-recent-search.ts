import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const RECENT_SEARCHES_KEY = '@recent_searches_key';
const MAX_RECENT_COUNT = 5;

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // 1. 앱 시작 시 저장된 최근 검색어 불러오기
  useEffect(() => {
    async function loadRecentSearches() {
      try {
        const saved = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
        if (saved) {
          setRecentSearches(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to load recent searches:', e);
      }
    }
    loadRecentSearches();
  }, []);

  // AsyncStorage 업데이트 헬퍼
  const saveToStorage = async (searches: string[]) => {
    try {
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    } catch (e) {
      console.error('Failed to save recent searches:', e);
    }
  };

  // 2. 검색어 추가 (중복 제거 & 최신순 맨 앞 배치)
  const addRecent = useCallback((query: string) => {
    const q = query.trim();
    if (!q) return;

    setRecentSearches((prev) => {
      const next = [q, ...prev.filter((s) => s !== q)].slice(0, MAX_RECENT_COUNT);
      saveToStorage(next);
      return next;
    });
  }, []);

  // 3. 단일 검색어 삭제
  const removeRecent = useCallback((query: string) => {
    setRecentSearches((prev) => {
      const next = prev.filter((s) => s !== query);
      saveToStorage(next);
      return next;
    });
  }, []);

  // 4. 전체 검색어 삭제 (구문 수정 완료)
  const clearAllRecent = useCallback(() => {
    setRecentSearches([]);
    AsyncStorage.removeItem(RECENT_SEARCHES_KEY).catch((e) => {
      console.error('Failed to clear recent searches:', e);
    });
  }, []);

  return {
    recentSearches,
    addRecent,
    removeRecent,
    clearAllRecent,
  };
}
