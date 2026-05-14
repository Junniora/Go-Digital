import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from 'src/services/authService';
import type { User, LoginPayload } from 'src/interfaces';

export const useAuthStore = defineStore('auth', () => {
  // ─── State ───
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // ─── Getters ───
  const isAuthenticated = computed(() => !!token.value);
  const userName = computed(() => user.value?.name ?? '');
  const userRole = computed(() => user.value?.role ?? 'user');
  const userInitials = computed(() => {
    if (!user.value?.name) return 'U';
    const parts = user.value.name.split(' ');
    return parts.map((p) => p[0]).join('').toUpperCase().slice(0, 2);
  });

  // ─── Actions ───
  function loadFromStorage() {
    const savedToken = authService.getToken();
    const savedUser = authService.getUser();
    if (savedToken && savedUser) {
      token.value = savedToken;
      user.value = savedUser as User;
    }
  }

  async function login(payload: LoginPayload) {
    loading.value = true;
    error.value = null;
    try {
      const response = await authService.login(payload);
      // El backend devuelve directamente { token, user }
      token.value = response.token;
      user.value = response.user;
      authService.setToken(response.token);
      authService.setUser(response.user);
      return true;
    } catch (err: unknown) {
      // Axios lanza un error en respuestas 4xx/5xx
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? (err instanceof Error ? err.message : 'Credenciales incorrectas.');
      error.value = message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    authService.logout();
    token.value = null;
    user.value = null;
    error.value = null;
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    userName,
    userRole,
    userInitials,
    loadFromStorage,
    login,
    logout,
  };
});
