import type { Page, PageParams } from '@/types/api/common';
import type { NewsBodyDto } from '@/types/api/learning';
import type {
  BookmarkStateDto,
  CardNewsDetailDto,
  CardNewsSummaryDto,
  NewsDetailDto,
  NewsListItemDto,
  NewsListParams,
  RecommendedNewsDto,
} from '@/types/api/news';
import { http } from './api/client';

export const newsService = {
  list: (p: NewsListParams = {}) =>
    http.get<Page<NewsListItemDto>>('/api/news', { query: { ...p }, auth: 'optional' }),
  today: () => http.get<NewsListItemDto[]>('/api/news/today', { auth: 'optional' }),
  recommend: () => http.get<RecommendedNewsDto[]>('/api/news/recommend'),
  search: (q: string, p: PageParams = {}) =>
    http.get<Page<NewsListItemDto>>('/api/news/search', { query: { q, ...p }, auth: 'optional' }),
  detail: (id: string | number) => http.get<NewsDetailDto>(`/api/news/${id}`, { auth: 'none' }),
  body: (id: string | number) =>
    http.get<NewsBodyDto>(`/api/news/${id}/body`, { auth: 'optional' }),
  bookmarkStatus: (id: string | number) => http.get<BookmarkStateDto>(`/api/news/${id}/bookmark`),
  save: (id: string | number) => http.post<BookmarkStateDto>(`/api/news/${id}/save`),
  unsave: (id: string | number) => http.post<BookmarkStateDto>(`/api/news/${id}/unsave`),
  markRead: (id: string | number, durationSeconds?: number) =>
    http.post<void>(`/api/news/${id}/read`, { query: { durationSeconds } }),
  // POST/PUT/DELETE /api/news/{id}/bookmark 는 "기존 호환" → 앱은 save / unsave 사용 (미구현)
};

export const cardNewsService = {
  list: (p: PageParams = {}) =>
    http.get<Page<CardNewsSummaryDto>>('/api/card-news', { query: { ...p }, auth: 'none' }),
  byArticle: (articleId: string | number) =>
    http.get<CardNewsDetailDto>(`/api/card-news/article/${articleId}`, { auth: 'none' }),
  byId: (cardNewsId: string | number) =>
    http.get<CardNewsDetailDto>(`/api/card-news/${cardNewsId}`, { auth: 'none' }),
  // POST /api/card-news/{articleId}/generate 는 ADMIN 전용 (미구현)
};
