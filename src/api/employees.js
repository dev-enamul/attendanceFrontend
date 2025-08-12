import { BASE_URL } from "../config";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const employeesApi = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    console.log(params);
    if (params.page) queryParams.append("page", params.page);
    if (params.per_page) queryParams.append("per_page", params.per_page);
    if (params.date) queryParams.append("date", params.date);
    if (params.name) queryParams.append("name", params.name);
    if (params.branch_id) queryParams.append("branch_id", params.branch_id);
    const url = `${BASE_URL}/employee${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch employees");
    }
    return response.json();
  },
  getById: async (id) => {
    const response = await fetch(`${BASE_URL}/employee/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch employee");
    }

    return response.json();
  },

  create: async (data) => {
    const response = await fetch(`${BASE_URL}/employee`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create employee");
    }

    return response.json();
  },

  update: async (id, data) => {
    const response = await fetch(`${BASE_URL}/employee/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update employee");
    }

    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/employee/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to delete employee");
    }

    return response.json();
  },
};
