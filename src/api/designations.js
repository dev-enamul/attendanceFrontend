const BASE_URL = 'https://attendance.mmadinah.com/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const designationsApi = {
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/designation`, {
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