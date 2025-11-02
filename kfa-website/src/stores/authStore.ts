import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '@/services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member' | 'user' | 'guest'; // Legacy field for backward compatibility
  roles: string[]; // Spatie roles: ['admin', 'editor', etc.]
  permissions: string[]; // Spatie permissions: ['media.upload', 'content.create', etc.]
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;

  // RBAC Helper Methods
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: localStorage.getItem('auth_token'),
      isAuthenticated: !!localStorage.getItem('auth_token'),
      isLoading: false,
      error: null,

      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authAPI.login(credentials);
          const { user, token } = response;

          // Save token to localStorage
          localStorage.setItem('auth_token', token);

          set({
            user: {
              id: user.id.toString(),
              email: user.email,
              name: user.name,
              role: user.role || 'guest',
              roles: user.roles || [],
              permissions: user.permissions || [],
            },
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Ошибка входа. Проверьте данные.';
          set({
            error: errorMessage,
            isLoading: false,
            user: null,
            token: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      register: async (data) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authAPI.register(data);
          const { user, token } = response;

          // Save token to localStorage
          localStorage.setItem('auth_token', token);

          set({
            user: {
              id: user.id.toString(),
              email: user.email,
              name: user.name,
              role: user.role || 'guest',
              roles: user.roles || [],
              permissions: user.permissions || [],
            },
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Ошибка регистрации. Попробуйте снова.';
          set({
            error: errorMessage,
            isLoading: false,
            user: null,
            token: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          const token = get().token;
          if (token) {
            await authAPI.logout();
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Полная очистка всех данных авторизации
          // 1. Очистка localStorage
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          localStorage.removeItem('kfa-auth-storage');

          // 2. Очистка sessionStorage
          sessionStorage.clear();

          // 3. Очистка cookies (если есть)
          document.cookie.split(';').forEach(cookie => {
            const [name] = cookie.split('=');
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          });

          // 4. Сброс состояния store
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      checkAuth: async () => {
        const token = get().token;
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          const response = await authAPI.getUser();
          const user = response.data || response;

          set({
            user: {
              id: user.id.toString(),
              email: user.email,
              name: user.name,
              role: user.role || 'guest',
              roles: user.roles || [],
              permissions: user.permissions || [],
            },
            isAuthenticated: true,
          });
        } catch (error) {
          // Token invalid or expired
          localStorage.removeItem('auth_token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      clearError: () => set({ error: null }),

      // RBAC Helper Methods
      hasRole: (role: string) => {
        const user = get().user;
        if (!user || !user.roles) return false;
        return user.roles.includes(role);
      },

      hasAnyRole: (roles: string[]) => {
        const user = get().user;
        if (!user || !user.roles) return false;
        return roles.some(role => user.roles.includes(role));
      },

      hasPermission: (permission: string) => {
        const user = get().user;
        if (!user || !user.permissions) return false;
        return user.permissions.includes(permission);
      },

      hasAnyPermission: (permissions: string[]) => {
        const user = get().user;
        if (!user || !user.permissions) return false;
        return permissions.some(permission => user.permissions.includes(permission));
      },

      hasAllPermissions: (permissions: string[]) => {
        const user = get().user;
        if (!user || !user.permissions) return false;
        return permissions.every(permission => user.permissions.includes(permission));
      },
    }),
    {
      name: 'kfa-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
