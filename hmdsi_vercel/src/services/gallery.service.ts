import { apiClient } from '../config/axios';
import { endpoints } from '../config/endpoints';
import type { ApiResponse, GalleryEvent, PaginatedData } from './api.types';

export const galleryService = {
  async getEvents(params?: {
    period_id?: number;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedData<GalleryEvent>> {
    const response = await apiClient.get<ApiResponse<PaginatedData<GalleryEvent>>>(endpoints.gallery, {
      params,
    });
    return response.data.data;
  },

  async getEvent(slug: string): Promise<GalleryEvent> {
    const response = await apiClient.get<ApiResponse<GalleryEvent>>(endpoints.galleryEvent(slug));
    return response.data.data;
  },
};
