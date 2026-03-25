import api from './api';
import { Activity, ApiResponse, DashboardStats } from '../types';

export const dashboardService = {
  stats: () =>
    api.get<ApiResponse<DashboardStats>>('/dashboard/stats'),

  recentActivities: () =>
    api.get<ApiResponse<Activity[]>>('/dashboard/recent-activities'),
};
