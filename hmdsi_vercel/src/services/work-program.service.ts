import { apiClient } from '../config/axios';
import { endpoints } from '../config/endpoints';
import type { ApiResponse, PaginatedData, WorkProgram } from './api.types';

export interface WorkProgramFilters {
  department_slug?: string;
  status?: string;
  is_highlight?: boolean;
  period_id?: number;
  per_page?: number;
  page?: number;
}

export const workProgramService = {
  async getWorkPrograms(params?: WorkProgramFilters): Promise<PaginatedData<WorkProgram>> {
    const response = await apiClient.get<ApiResponse<PaginatedData<WorkProgram>>>(
      endpoints.workPrograms,
      { params }
    );
    return response.data.data;
  },

  async getHighlights(periodId?: number): Promise<WorkProgram[]> {
    const response = await apiClient.get<ApiResponse<WorkProgram[]>>(endpoints.workProgramHighlights, {
      params: { period_id: periodId },
    });
    return response.data.data;
  },

  async getBySlug(slug: string): Promise<WorkProgram> {
    const response = await apiClient.get<ApiResponse<WorkProgram>>(endpoints.workProgram(slug));
    return response.data.data;
  },
};
