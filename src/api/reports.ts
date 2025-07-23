import { 
  MonthlyReportData, 
  DailyReportData, 
  AbsenteeReportData, 
  MonthlyAttendanceMatrix,
  ApiResponse,
  PaginatedResponse 
} from '../types';

const BASE_URL = 'https://attendance.mmadinah.com/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const reportsApi = {
  getMonthlyReport: async (): Promise<ApiResponse<PaginatedResponse<MonthlyReportData>>> => {
    const response = await fetch(`${BASE_URL}/reports/monthly`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch monthly report');
    }

    return response.json();
  },

  getDailyReport: async (): Promise<ApiResponse<PaginatedResponse<DailyReportData>>> => {
    const response = await fetch(`${BASE_URL}/reports/daily`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch daily report');
    }

    return response.json();
  },

  getAbsenteeReport: async (): Promise<ApiResponse<PaginatedResponse<AbsenteeReportData>>> => {
    const response = await fetch(`${BASE_URL}/reports/absentee`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch absentee report');
    }

    return response.json();
  },

  getMonthlyAttendanceMatrix: async (): Promise<ApiResponse<{ data: MonthlyAttendanceMatrix[], meta: any }>> => {
    const response = await fetch(`${BASE_URL}/reports/monthly-attendance-matrix`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch monthly attendance matrix');
    }

    return response.json();
  },
};