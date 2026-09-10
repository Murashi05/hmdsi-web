import { apiClient } from '../config/axios';
import { endpoints } from '../config/endpoints';
import type { ApiResponse, Period } from './api.types';

export const periodService = {
  async getActive(): Promise<Period> {
    const response = await apiClient.get<ApiResponse<Period>>(endpoints.periodsActive);
    return response.data.data;
  },
  async getAll(): Promise<Period[]> {
    const response = await apiClient.get<ApiResponse<Period[]>>(endpoints.periods);
    return response.data.data;
  },
};
