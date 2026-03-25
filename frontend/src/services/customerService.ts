import api from './api';
import { ApiResponse, Customer, PaginatedResponse } from '../types';

export const customerService = {
  list: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<PaginatedResponse<Customer>>>('/customers', { params }),

  get: (id: number) =>
    api.get<ApiResponse<Customer>>(`/customers/${id}`),

  create: (data: Partial<Customer>) =>
    api.post<ApiResponse<Customer>>('/customers', data),

  update: (id: number, data: Partial<Customer>) =>
    api.put<ApiResponse<Customer>>(`/customers/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<null>>(`/customers/${id}`),
};
