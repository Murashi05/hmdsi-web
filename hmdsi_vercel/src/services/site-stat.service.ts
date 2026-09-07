import { apiClient } from '../config/axios';
import { endpoints } from '../config/endpoints';
import type { ApiResponse, SiteStat } from './api.types';

export const siteStatService = {
  async getHomepageStats(): Promise<SiteStat[]> {
    const response = await apiClient.get<ApiResponse<SiteStat[]>>(endpoints.stats);
    return response.data.data;
  },
};
