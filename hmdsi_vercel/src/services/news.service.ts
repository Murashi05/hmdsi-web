import { apiClient } from '../config/axios';
import { endpoints } from '../config/endpoints';
import type { ApiResponse, NewsArticle, PaginatedData } from './api.types';

export const newsService = {
  async getArticles(params?: {
    category?: string;
    search?: string;
    is_featured?: boolean;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedData<NewsArticle>> {
    const response = await apiClient.get<ApiResponse<PaginatedData<NewsArticle>>>(endpoints.news, {
      params,
    });
    return response.data.data;
  },

  async getArticle(slug: string): Promise<NewsArticle> {
    const response = await apiClient.get<ApiResponse<NewsArticle>>(endpoints.newsArticle(slug));
    return response.data.data;
  },
};
