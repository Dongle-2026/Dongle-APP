import type { Page, PageParams } from '@/types/api/common';
import type { TermDetailDto, TermFullDto, TermListItemDto } from '@/types/api/learning';
import type { BookmarkStateDto } from '@/types/api/news';
import { http } from './api/client';

export const termService = {
  save: (termId: string | number) => http.post<BookmarkStateDto>(`/api/terms/${termId}/save`),
  unsave: (termId: string | number) => http.post<BookmarkStateDto>(`/api/terms/${termId}/unsave`),
  learn: (termId: string | number) => http.post<void>(`/api/terms/${termId}/learn`),
  detail: (termId: string | number) =>
    http.get<TermDetailDto>(`/api/terms/${termId}`, { auth: 'optional' }),
  list: (p: PageParams & { path?: string } = {}) =>
    http.get<Page<TermListItemDto>>('/api/terms', { query: { ...p }, auth: 'none' }),
  autocomplete: (query: string, limit = 5) =>
    http.get<TermFullDto[]>('/api/terms/autocomplete', { query: { query, limit }, auth: 'none' }),
  byCategory: (path: string) =>
    http.get<TermFullDto[]>('/api/terms/category', { query: { path }, auth: 'none' }),
  byLevel: (maxLevel = 3) =>
    http.get<TermFullDto[]>('/api/terms/level', { query: { maxLevel }, auth: 'none' }),
  search: (query: string, limit = 10) =>
    http.get<TermListItemDto[]>('/api/terms/search', { query: { query, limit }, auth: 'none' }),
};
