import type { CategoryDto, KeywordDto, SuggestionDto, TrendingDto } from '@/types/api/search';
import { http } from './api/client';

export const searchService = {
  categories: () => http.get<CategoryDto[]>('/api/categories', { auth: 'none' }),
  keywords: (limit = 8) =>
    http.get<KeywordDto[]>('/api/keywords', { query: { limit }, auth: 'none' }),
  trending: (limit = 10) =>
    http.get<TrendingDto[]>('/api/search/trending', { query: { limit }, auth: 'none' }),
  suggestions: (q: string, limit = 8) =>
    http.get<SuggestionDto[]>('/api/search/suggestions', { query: { q, limit }, auth: 'none' }),
};
