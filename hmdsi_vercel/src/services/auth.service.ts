import { apiClient, setAuthToken } from '../config/axios';
import { endpoints } from '../config/endpoints';
import type { ApiResponse, AuthUser, LoginPayload } from './api.types';

export const authService = {
  async login(email: string, password: string): Promise<LoginPayload> {
    const response = await apiClient.post<ApiResponse<LoginPayload>>(endpoints.auth.login, {
      email,
      password,
    });
    setAuthToken(response.data.data.token);
    return response.data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post(endpoints.auth.logout);
    setAuthToken(null);
  },

  async me(): Promise<AuthUser> {
    const response = await apiClient.get<ApiResponse<AuthUser>>(endpoints.auth.me);
    return response.data.data;
  },
};
