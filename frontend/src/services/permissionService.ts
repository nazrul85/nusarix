import api from './api';
import { ApiResponse, PaginatedResponse, Permission } from '../types';

export const permissionService = {
  list: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<PaginatedResponse<Permission>>>('/permissions', { params }),

  get: (id: number) =>
    api.get<ApiResponse<Permission>>(`/permissions/${id}`),

  create: (data: { name: string }) =>
    api.post<ApiResponse<Permission>>('/permissions', data),

  update: (id: number, data: { name: string }) =>
    api.put<ApiResponse<Permission>>(`/permissions/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<null>>(`/permissions/${id}`),
};
