import { BASE_URL } from '../config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const branchesApi = {
  getAll: async (search = '', per_page = 10) => {
    const response = await fetch(`${BASE_URL}/branches?search=${search}&per_page=${per_page}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch branches');
    }

    return response.json();
  },

  getSelect2: async () => {
    const response = await fetch(`${BASE_URL}/branches?select2=true`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch branches for select2');
    }

    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${BASE_URL}/branches/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch branch');
    }

    return response.json();
  },

  create: async (data) => {
    const response = await fetch(`${BASE_URL}/branches`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create branch');
    }

    return response.json();
  },

  update: async (id, data) => {
    const response = await fetch(`${BASE_URL}/branches/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update branch');
    }

    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/branches/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete branch');
    }

    return response.json();
  },
};