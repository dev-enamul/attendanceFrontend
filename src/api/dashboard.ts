import { DashboardSummary, AttendanceTrend, ApiResponse } from '../types';

const BASE_URL = 'https://attendance.mmadinah.com/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const dashboardApi = {
  getSummary: async (): Promise<ApiResponse<DashboardSummary>> => {
    const response = await fetch(`${BASE_URL}/dashboard/summary`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard summary');
    }

    return response.json();
  },

  getAttendanceTrend: async (): Promise<ApiResponse<AttendanceTrend[]>> => {
    const response = await fetch(`${BASE_URL}/dashboard/attendance-trend`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch attendance trend');
    }

    return response.json();
  },
};