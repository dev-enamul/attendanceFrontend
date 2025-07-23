const BASE_URL = 'https://attendance.mmadinah.com/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const employeesApi = {
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/employee`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }

    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${BASE_URL}/employee/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch employee');
    }

    return response.json();
  },

  create: async (data) => {
    const response = await fetch(`${BASE_URL}/employee`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create employee');
    }

    return response.json();
  },

  update: async (id, data) => {
    const response = await fetch(`${BASE_URL}/employee/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update employee');
    }

    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/employee/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete employee');
    }

    return response.json();
  },
};