import api from './api';
import { ApiResponse, PaginatedResponse, User } from '../types';

export const userService = {
  list: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<PaginatedResponse<User>>>('/users', { params }),

  get: (id: number) =>
    api.get<ApiResponse<User>>(`/users/${id}`),

  create: (data: Partial<User> & { password: string; password_confirmation: string; role?: string }) =>
    api.post<ApiResponse<User>>('/users', data),

  update: (id: number, data: Partial<User> & { password?: string; password_confirmation?: string }) =>
    api.put<ApiResponse<User>>(`/users/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<null>>(`/users/${id}`),

  assignRole: (id: number, role: string) =>
    api.post<ApiResponse<null>>(`/users/${id}/assign-role`, { role }),

  removeRole: (id: number, role: string) =>
    api.post<ApiResponse<null>>(`/users/${id}/remove-role`, { role }),
};
