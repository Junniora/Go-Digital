import type { LoginPayload, LoginResponse, ApiResponse } from 'src/interfaces';

// ─── Mock data for development without backend ───
const MOCK_USERS: Record<string, { password: string; user: LoginResponse['user'] }> = {
  'admin@godigital.com': {
    password: 'admin123',
    user: {
      id: 1,
      name: 'Admin User',
      email: 'admin@godigital.com',
      department: 'Digital Transformation',
      role: 'admin',
    },
  },
  'user@godigital.com': {
    password: 'user123',
    user: {
      id: 2,
      name: 'John Doe',
      email: 'user@godigital.com',
      department: 'Operations',
      role: 'user',
    },
  },
  'dx@godigital.com': {
    password: 'dx123',
    user: {
      id: 3,
      name: 'Maria DX',
      email: 'dx@godigital.com',
      department: 'Digital Transformation',
      role: 'dx_team',
    },
  },
};

async function mockLogin(payload: LoginPayload): Promise<ApiResponse<LoginResponse>> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const mockUser = MOCK_USERS[payload.email];
  if (mockUser && mockUser.password === payload.password) {
    return {
      success: true,
      data: {
        token: 'mock_jwt_token_' + Date.now(),
        user: mockUser.user,
      },
      message: 'Login successful',
    };
  }
  return {
    success: false,
    data: { token: '', user: {} as LoginResponse['user'] },
    message: 'Invalid email or password',
  };
}

export const authService = {
  async login(payload: LoginPayload) {
    // Backend has no auth endpoint — always use mock login
    // This simulates auth while the rest of the app uses the real API
    return mockLogin(payload);
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
    return user ? JSON.parse(user) as unknown : null;
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
