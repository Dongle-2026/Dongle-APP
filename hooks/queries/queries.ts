import { learningService } from '@/services/learningService';
import {
  toActivityDay,
  toCardNews,
  toCardNewsDetail,
  toCategories,
  toKeywords,
  toNewsBody,
  toProfile,
  toReadHistory,
  toSavedNews,
  toSavedTerm,
  toSuggestions,
  toTrending,
  toUserActivity,
  toUserStats,
} from '@/services/mappers';
import { meService } from '@/services/meService';
import { newsService } from '@/services/newsService';
import { searchService } from '@/services/searchService';
import type { Page } from '@/types/api/common';
import type { NewsListParams } from '@/types/api/news';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { qk } from './keys';

const PAGE_SIZE = 10;
// Spring Page: 0부터, 다음 페이지 = !last
const nextPage = (last: Page<unknown>) => (last.last ? undefined : last.number + 1);

// ── 뉴스 ─────────────────────────────────────────────
export const useFeed = (filter: Pick<NewsListParams, 'category' | 'keyword' | 'date'> = {}) =>
  useInfiniteQuery({
    queryKey: qk.news.feed(filter),
    queryFn: ({ pageParam }) => newsService.list({ ...filter, page: pageParam, size: PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: nextPage,
    select: (d) => d.pages.flatMap((p) => p.content.map(toCardNews)),
    staleTime: 60_000,
  });

export const useNewsSearch = (q: string) =>
  useInfiniteQuery({
    queryKey: qk.news.search(q),
    queryFn: ({ pageParam }) => newsService.search(q, { page: pageParam, size: PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: nextPage,
    select: (d) => d.pages.flatMap((p) => p.content.map(toCardNews)),
    enabled: q.trim().length > 0,
  });

export const useNewsDetail = (id: string) =>
  useQuery({
    queryKey: qk.news.detail(id),
    queryFn: () => newsService.detail(id),
    select: (d) => toCardNewsDetail(d),
    staleTime: 5 * 60_000,
  });

export const useBookmarkState = (id: string) =>
  useQuery({
    queryKey: qk.news.bookmark(id),
    queryFn: () => newsService.bookmarkStatus(id),
    select: (d) => d.bookmarked,
  });

// 퀴즈가 GENERATING이면 20초마다 재조회 (문서: 1~2분 뒤 재조회)
export const useNewsBody = (id: string) =>
  useQuery({
    queryKey: qk.news.body(id),
    queryFn: () => newsService.body(id),
    select: toNewsBody,
    staleTime: 5 * 60_000,
    refetchInterval: (q) => (q.state.data?.quizStatus === 'GENERATING' ? 20_000 : false),
  });

// ── 내 정보 ──────────────────────────────────────────
export const useMe = () =>
  useQuery({
    queryKey: qk.me.profile,
    queryFn: meService.me,
    select: toProfile,
    staleTime: 5 * 60_000,
  });
export const useMyStats = () =>
  useQuery({ queryKey: qk.me.stats, queryFn: learningService.stats, select: toUserStats });
export const useMyActivity = (days = 126) =>
  useQuery({
    queryKey: qk.me.activity(days),
    queryFn: () => learningService.activity(days),
    select: (d) => d.map(toActivityDay),
    staleTime: 5 * 60_000,
  });
export const useMyInsights = () =>
  useQuery({
    queryKey: qk.me.insights,
    queryFn: learningService.insights,
    select: toUserActivity,
    staleTime: 5 * 60_000,
  });
export const useNotificationSettings = () =>
  useQuery({
    queryKey: qk.me.notificationSettings,
    queryFn: meService.notificationSettings,
    staleTime: 5 * 60_000,
  });

export const useSavedNews = () =>
  useInfiniteQuery({
    queryKey: qk.me.savedNews,
    queryFn: ({ pageParam }) => meService.savedNews({ page: pageParam, size: PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: nextPage,
    select: (d) => d.pages.flatMap((p) => p.content.map(toSavedNews)),
  });

export const useReadHistory = () =>
  useInfiniteQuery({
    queryKey: qk.me.readHistory,
    queryFn: ({ pageParam }) => meService.readHistory({ page: pageParam, size: PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: nextPage,
    select: (d) => d.pages.flatMap((p) => p.content.map(toReadHistory)),
  });

// 저장한 용어: 초성 그룹/가나다 정렬을 위해 전체를 불러온다(페이지를 끝까지 자동 로드)
export function useSavedTermsAll() {
  const q = useInfiniteQuery({
    queryKey: qk.me.savedTerms,
    queryFn: ({ pageParam }) => meService.savedTerms({ page: pageParam, size: 100 }),
    initialPageParam: 0,
    getNextPageParam: nextPage,
    select: (d) => d.pages.flatMap((p) => p.content.map(toSavedTerm)),
  });
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = q;
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  return q;
}

// ── 검색 ─────────────────────────────────────────────
export const useCategories = () =>
  useQuery({
    queryKey: qk.search.categories,
    queryFn: searchService.categories,
    select: toCategories,
    staleTime: 60 * 60_000,
  });
export const useKeywords = () =>
  useQuery({
    queryKey: qk.search.keywords,
    queryFn: () => searchService.keywords(),
    select: toKeywords,
    staleTime: 10 * 60_000,
  });
export const useTrending = () =>
  useQuery({
    queryKey: qk.search.trending,
    queryFn: () => searchService.trending(),
    select: toTrending,
    staleTime: 5 * 60_000,
  });
export const useSuggestions = (q: string) =>
  useQuery({
    queryKey: qk.search.suggestions(q),
    queryFn: () => searchService.suggestions(q),
    select: toSuggestions,
    enabled: q.trim().length > 0,
    staleTime: 60_000,
  });
