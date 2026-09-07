import { apiClient } from '../config/axios';
import { endpoints } from '../config/endpoints';
import type { ApiResponse, ManagementStructure } from './api.types';

export const structureService = {
  async getStructures(params?: {
    period_id?: number;
    department_id?: number;
    department_slug?: string;
  }): Promise<ManagementStructure[]> {
    const response = await apiClient.get<ApiResponse<ManagementStructure[]>>(
      endpoints.managementStructures,
      { params }
    );
    return response.data.data;
  },
};
