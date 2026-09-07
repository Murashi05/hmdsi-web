import { apiClient } from '../config/axios';
import { endpoints } from '../config/endpoints';
import type { AboutContent, ApiResponse } from './api.types';

export const aboutService = {
  async getAbout(): Promise<AboutContent> {
    const response = await apiClient.get<ApiResponse<AboutContent>>(endpoints.about);
    return response.data.data;
  },
};
