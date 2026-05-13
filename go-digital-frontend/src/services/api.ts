import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5044/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ───
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('go_digital_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error instanceof Error ? error : new Error(String(error))),
);

// ─── Response Interceptor ───
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('go_digital_token');
      localStorage.removeItem('go_digital_user');
      window.location.hash = '#/login';
    }
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  },
);

// ─── Direct Helpers (backend returns data directly, no wrapper) ───
export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const response = await api.get<T>(url, { params });
  return response.data;
}

export async function apiPost<T>(url: string, data?: unknown): Promise<T> {
  const response = await api.post<T>(url, data);
  return response.data;
}

export async function apiPut<T>(url: string, data?: unknown): Promise<T> {
  const response = await api.put<T>(url, data);
  return response.data;
}

export async function apiDelete<T>(url: string): Promise<T> {
  const response = await api.delete<T>(url);
  return response.data;
}

// ─── Legacy Typed Helpers (for mock mode compatibility) ───
import type { ApiResponse } from 'src/interfaces';

export async function get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
  const response = await api.get<ApiResponse<T>>(url, { params });
  return response.data;
}

export async function post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
  const response = await api.post<ApiResponse<T>>(url, data);
  return response.data;
}

export async function put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
  const response = await api.put<ApiResponse<T>>(url, data);
  return response.data;
}

export async function del<T>(url: string): Promise<ApiResponse<T>> {
  const response = await api.delete<ApiResponse<T>>(url);
  return response.data;
}

export async function postFormData<T>(url: string, formData: FormData): Promise<ApiResponse<T>> {
  const response = await api.post<ApiResponse<T>>(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export default api;
