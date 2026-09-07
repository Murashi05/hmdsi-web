import { apiClient } from '../config/axios';
import { endpoints } from '../config/endpoints';
import type { ApiResponse, Department, ManagementStructure } from './api.types';

export const departmentService = {
  async getDepartments(periodId?: number): Promise<Department[]> {
    const response = await apiClient.get<ApiResponse<Department[]>>(endpoints.departments, {
      params: { period_id: periodId },
    });
    return response.data.data;
  },

  async getDepartment(slug: string, periodId?: number): Promise<Department> {
    const response = await apiClient.get<ApiResponse<Department>>(endpoints.department(slug), {
      params: { period_id: periodId },
    });
    return response.data.data;
  },

  async getManagementStructure(deptSlug: string): Promise<ManagementStructure[]> {
    const response = await apiClient.get<ApiResponse<ManagementStructure[]>>(
      endpoints.departmentStructure(deptSlug)
    );
    return response.data.data;
  },
};
