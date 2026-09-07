import { apiClient } from '../config/axios';
import { endpoints } from '../config/endpoints';
import type { ApiResponse, Aspiration, AspirationStats, PaginatedData } from './api.types';

export interface AspirationPayload {
  category: Aspiration['category'];
  subject: string;
  message: string;
  is_anonymous?: boolean;
  is_public?: boolean;
  sender_name?: string;
  sender_email?: string;
  sender_student_id?: string;
}

export const aspirationService = {
  async submit(payload: AspirationPayload): Promise<Aspiration> {
    const response = await apiClient.post<ApiResponse<Aspiration>>(endpoints.aspirations, payload);
    return response.data.data;
  },

  async track(code: string): Promise<Aspiration> {
    const response = await apiClient.get<ApiResponse<Aspiration>>(endpoints.aspirationTrack(code));
    return response.data.data;
  },

  async getStats(): Promise<AspirationStats> {
    const response = await apiClient.get<ApiResponse<AspirationStats>>(endpoints.aspirationStats);
    return response.data.data;
  },

  async getPublicList(params?: {
    category?: string;
    status?: string;
    page?: number;
  }): Promise<PaginatedData<Aspiration>> {
    const response = await apiClient.get<ApiResponse<PaginatedData<Aspiration>>>(endpoints.aspirations, {
      params,
    });
    return response.data.data;
  },
};
