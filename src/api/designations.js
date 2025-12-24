import { BASE_URL } from '../config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const designationsApi = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    if (params.search) queryParams.append('search', params.search); // Add search parameter

    const url = `${BASE_URL}/designation${
      queryParams.toString() ? '?' + queryParams.toString() : ''
    }`;
    
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch designations');
    }

    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${BASE_URL}/designation/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch designation');
    }

    return response.json();
  },

  create: async (data) => {
    const response = await fetch(`${BASE_URL}/designation`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create designation');
    }

    return response.json();
  },

  update: async (id, data) => {
    const response = await fetch(`${BASE_URL}/designation/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update designation');
    }

    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/designation/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete designation');
    }

    return response.json();
  },
};