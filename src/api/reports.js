import { BASE_URL } from '../config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const reportsApi = {
  getMonthlyReport: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    if (params.year) queryParams.append('year', params.year);
    if (params.month) queryParams.append('month', params.month);
    if (params.name) queryParams.append('name', params.name);
    
    const url = `${BASE_URL}/reports/monthly${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch monthly report');
    }

    return response.json();
  },

  getDailyReport: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    if (params.date) queryParams.append('date', params.date);
    if (params.name) queryParams.append('name', params.name);
    
    const url = `${BASE_URL}/reports/daily${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch daily report');
    }

    return response.json();
  },

  getAbsenteeReport: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    if (params.date) queryParams.append('date', params.date);
    if (params.name) queryParams.append('name', params.name);
    
    const url = `${BASE_URL}/reports/absentee${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch absentee report');
    }

    return response.json();
  },

  getMonthlyAttendanceMatrix: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    if (params.year) queryParams.append('year', params.year);
    if (params.month) queryParams.append('month', params.month);
    
    const url = `${BASE_URL}/reports/monthly-attendance-matrix${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch monthly attendance matrix');
    }

    return response.json();
  },
};