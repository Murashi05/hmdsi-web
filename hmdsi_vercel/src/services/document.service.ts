import { apiClient } from '../config/axios';
import { endpoints } from '../config/endpoints';
import type { ApiResponse, DocumentRecord, PaginatedData } from './api.types';

export interface DocumentFilters { period_id?: number; department_id?: number; category?: string; search?: string; page?: number; per_page?: number }
export const documentService = {
  async getAll(params?: DocumentFilters): Promise<PaginatedData<DocumentRecord>> {
    const r=await apiClient.get<ApiResponse<PaginatedData<DocumentRecord>>>(endpoints.admin.documents,{params}); return r.data.data;
  },
  async save(form: FormData, id?: number|null) {
    const url=id?endpoints.admin.document(id):endpoints.admin.documents;
    const r=await apiClient.post<ApiResponse<DocumentRecord>>(url,form); return r.data.data;
  },
  async remove(id:number){ await apiClient.delete(endpoints.admin.document(id)); },
};
