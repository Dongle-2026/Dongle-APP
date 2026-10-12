import type { NewsListParams } from '@/types/api/news';

type Filter = Pick<NewsListParams, 'category' | 'keyword' | 'date'>;

// Query Key는 이 파일에서만 정의 (prefix로 한 번에 invalidate 가능)
export const qk = {
  news: {
    feed: (f: Filter = {}) => ['news', 'feed', f] as const,
    search: (q: string) => ['news', 'search', q] as const,
    detail: (id: string) => ['news', 'detail', id] as const,
    body: (id: string) => ['news', 'body', id] as const,
    bookmark: (id: string) => ['news', 'bookmark', id] as const,
  },
  me: {
    profile: ['me', 'profile'] as const,
    stats: ['me', 'stats'] as const,
    activityAll: ['me', 'activity'] as const,
    activity: (days: number) => ['me', 'activity', days] as const,
    insights: ['me', 'insights'] as const,
    savedNews: ['me', 'saved-news'] as const,
    savedTerms: ['me', 'saved-terms'] as const,
    readHistory: ['me', 'read-history'] as const,
    notificationSettings: ['me', 'notification-settings'] as const,
  },
  search: {
    categories: ['search', 'categories'] as const,
    keywords: ['search', 'keywords'] as const,
    trending: ['search', 'trending'] as const,
    suggestions: (q: string) => ['search', 'suggestions', q] as const,
  },
};
