import { apiClient } from '../config/axios';
import { endpoints } from '../config/endpoints';
import type { ApiResponse, ArchiveResource, PaginatedData } from './api.types';

export const resourceService = {
  async getResources(params?: {
    category?: string;
    academic_year?: string;
    search?: string;
    page?: number;
  }): Promise<PaginatedData<ArchiveResource>> {
    const response = await apiClient.get<ApiResponse<PaginatedData<ArchiveResource>>>(
      endpoints.resources,
      { params }
    );
    return response.data.data;
  },

  async requestDownload(id: number): Promise<{ file_url: string; download_count: number }> {
    const response = await apiClient.post<
      ApiResponse<{ file_url: string; download_count: number }>
    >(endpoints.resourceDownload(id));
    return response.data.data;
  },
};
