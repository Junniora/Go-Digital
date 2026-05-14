import { apiPost } from 'src/services/api';
import type { LoginPayload, LoginResponse } from 'src/interfaces';

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    // Llama al endpoint real del backend: POST /api/auth/login
    return await apiPost<LoginResponse>('/auth/login', payload);
  },

  logout() {
    localStorage.removeItem('go_digital_token');
    localStorage.removeItem('go_digital_user');
  },

  getToken(): string | null {
    return localStorage.getItem('go_digital_token');
  },

  getUser() {
    const user = localStorage.getItem('go_digital_user');
    return user ? (JSON.parse(user) as unknown) : null;
  },

  setToken(token: string) {
    localStorage.setItem('go_digital_token', token);
  },

  setUser(user: unknown) {
    localStorage.setItem('go_digital_user', JSON.stringify(user));
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

