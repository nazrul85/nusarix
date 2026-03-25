import api from './api';
import { ApiResponse, User } from '../types';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

export const authService = {
  login: (data: LoginPayload) =>
    api.post<ApiResponse<LoginResponse>>('/auth/login', data),

  logout: () =>
    api.post<ApiResponse<null>>('/auth/logout'),

  me: () =>
    api.get<ApiResponse<User>>('/auth/me'),

  forgotPassword: (email: string) =>
    api.post<ApiResponse<null>>('/auth/forgot-password', { email }),

  resetPassword: (data: { token: string; email: string; password: string; password_confirmation: string }) =>
    api.post<ApiResponse<null>>('/auth/reset-password', data),

  resendVerification: () =>
    api.post<ApiResponse<null>>('/auth/resend-verification'),
};
