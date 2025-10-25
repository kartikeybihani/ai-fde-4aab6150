import { Employee } from '../types/employee';
import { Project } from '../types/project';
import { Material } from '../types/material';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const error = await response.text();
    return { data: null, error: error || 'An error occurred' };
  }
  const data = await response.json();
  return { data, error: null };
}

export const apiClient = {
  employees: {
    async getAll(): Promise<ApiResponse<Employee[]>> {
      const response = await fetch(`${API_BASE_URL}/api/employees`);
      return handleResponse<Employee[]>(response);
    },

    async getStatus(id: string): Promise<ApiResponse<Employee>> {
      const response = await fetch(`${API_BASE_URL}/api/employees/${id}/status`);
      return handleResponse<Employee>(response);
    },

    async getPerformance(id: string): Promise<ApiResponse<any>> {
      const response = await fetch(`${API_BASE_URL}/api/employees/${id}/performance`);
      return handleResponse<any>(response);
    }
  },

  projects: {
    async getAll(): Promise<ApiResponse<Project[]>> {
      const response = await fetch(`${API_BASE_URL}/api/projects`);
      return handleResponse<Project[]>(response);
    },

    async getProgress(id: string): Promise<ApiResponse<any>> {
      const response = await fetch(`${API_BASE_URL}/api/projects/${id}/progress`);
      return handleResponse<any>(response);
    },

    async create(project: Partial<Project>): Promise<ApiResponse<Project>> {
      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });
      return handleResponse<Project>(response);
    }
  },

  materials: {
    async getAll(): Promise<ApiResponse<Material[]>> {
      const response = await fetch(`${API_BASE_URL}/api/materials`);
      return handleResponse<Material[]>(response);
    },

    async getAvailability(): Promise<ApiResponse<any>> {
      const response = await fetch(`${API_BASE_URL}/api/materials/availability`);
      return handleResponse<any>(response);
    },

    async update(id: string, updates: Partial<Material>): Promise<ApiResponse<Material>> {
      const response = await fetch(`${API_BASE_URL}/api/materials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      return handleResponse<Material>(response);
    }
  }
};

export type ApiClient = typeof apiClient;