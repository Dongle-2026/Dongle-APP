import type { News } from '@/types';
import { apiClient, type ApiResponse } from '@/utils/api';

export const newsService = {
  async getLatestNews(page: number = 1, limit: number = 10): Promise<ApiResponse<News[]>> {
    return apiClient.get<News[]>(`/api/news?page=${page}&limit=${limit}`);
  },

  async getNewsByCategory(
    category: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<News[]>> {
    return apiClient.get<News[]>(`/api/news?category=${category}&page=${page}&limit=${limit}`);
  },

  async getNewsById(id: string): Promise<ApiResponse<News>> {
    return apiClient.get<News>(`/api/news/${id}`);
  },

  async searchNews(query: string, page: number = 1): Promise<ApiResponse<News[]>> {
    return apiClient.get<News[]>(`/api/news/search?q=${encodeURIComponent(query)}&page=${page}`);
  },
};
