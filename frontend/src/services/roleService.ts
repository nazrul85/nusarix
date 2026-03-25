import api from './api';
import { ApiResponse, PaginatedResponse, Role } from '../types';

export const roleService = {
  list: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<PaginatedResponse<Role>>>('/roles', { params }),

  get: (id: number) =>
    api.get<ApiResponse<Role>>(`/roles/${id}`),

  create: (data: { name: string; permissions?: string[] }) =>
    api.post<ApiResponse<Role>>('/roles', data),

  update: (id: number, data: { name: string; permissions?: string[] }) =>
    api.put<ApiResponse<Role>>(`/roles/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<null>>(`/roles/${id}`),

  syncPermissions: (id: number, permissions: string[]) =>
    api.post<ApiResponse<null>>(`/roles/${id}/sync-permissions`, { permissions }),
};
