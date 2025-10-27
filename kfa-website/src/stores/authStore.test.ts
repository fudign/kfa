import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useAuthStore } from './authStore';
import type { User } from '@/types';

describe('authStore RBAC методы', () => {
  beforeEach(() => {
    // Очищаем store перед каждым тестом
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      token: null,
      isLoading: false,
    });

    // Очищаем localStorage
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('hasRole', () => {
    it('должен возвращать true если пользователь имеет указанную роль', () => {
      const user: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'admin',
        roles: ['admin', 'editor'],
        permissions: []
      };

      useAuthStore.setState({ user, isAuthenticated: true });
      const { hasRole } = useAuthStore.getState();

      expect(hasRole('admin')).toBe(true);
      expect(hasRole('editor')).toBe(true);
    });

    it('должен возвращать false если пользователь не имеет указанную роль', () => {
      const user: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'member',
        roles: ['member'],
        permissions: []
      };

      useAuthStore.setState({ user, isAuthenticated: true });
      const { hasRole } = useAuthStore.getState();

      expect(hasRole('admin')).toBe(false);
      expect(hasRole('editor')).toBe(false);
    });

    it('должен возвращать false если пользователь не авторизован', () => {
      const { hasRole } = useAuthStore.getState();
      expect(hasRole('admin')).toBe(false);
    });
  });

  describe('hasAnyRole', () => {
    it('должен возвращать true если пользователь имеет хотя бы одну из указанных ролей', () => {
      const user: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'editor',
        roles: ['editor'],
        permissions: []
      };

      useAuthStore.setState({ user, isAuthenticated: true });
      const { hasAnyRole } = useAuthStore.getState();

      expect(hasAnyRole(['admin', 'editor', 'moderator'])).toBe(true);
    });

    it('должен возвращать false если пользователь не имеет ни одной из указанных ролей', () => {
      const user: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'member',
        roles: ['member'],
        permissions: []
      };

      useAuthStore.setState({ user, isAuthenticated: true });
      const { hasAnyRole } = useAuthStore.getState();

      expect(hasAnyRole(['admin', 'editor', 'moderator'])).toBe(false);
    });

    it('должен возвращать false если пользователь не авторизован', () => {
      const { hasAnyRole } = useAuthStore.getState();
      expect(hasAnyRole(['admin', 'editor'])).toBe(false);
    });

    it('должен работать с пустым массивом ролей', () => {
      const user: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'admin',
        roles: ['admin'],
        permissions: []
      };

      useAuthStore.setState({ user, isAuthenticated: true });
      const { hasAnyRole } = useAuthStore.getState();

      expect(hasAnyRole([])).toBe(false);
    });
  });

  describe('hasPermission', () => {
    it('должен возвращать true если пользователь имеет указанное разрешение', () => {
      const user: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'admin',
        roles: ['admin'],
        permissions: ['media.upload', 'media.delete', 'partners.create']
      };

      useAuthStore.setState({ user, isAuthenticated: true });
      const { hasPermission } = useAuthStore.getState();

      expect(hasPermission('media.upload')).toBe(true);
      expect(hasPermission('media.delete')).toBe(true);
      expect(hasPermission('partners.create')).toBe(true);
    });

    it('должен возвращать false если пользователь не имеет указанное разрешение', () => {
      const user: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'member',
        roles: ['member'],
        permissions: ['media.view']
      };

      useAuthStore.setState({ user, isAuthenticated: true });
      const { hasPermission } = useAuthStore.getState();

      expect(hasPermission('media.upload')).toBe(false);
      expect(hasPermission('media.delete')).toBe(false);
    });

    it('должен возвращать false если пользователь не авторизован', () => {
      const { hasPermission } = useAuthStore.getState();
      expect(hasPermission('media.upload')).toBe(false);
    });
  });

  describe('hasAnyPermission', () => {
    it('должен возвращать true если пользователь имеет хотя бы одно из указанных разрешений', () => {
      const user: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'editor',
        roles: ['editor'],
        permissions: ['media.view', 'partners.view']
      };

      useAuthStore.setState({ user, isAuthenticated: true });
      const { hasAnyPermission } = useAuthStore.getState();

      expect(hasAnyPermission(['media.view', 'media.upload', 'media.delete'])).toBe(true);
      expect(hasAnyPermission(['partners.view', 'partners.create'])).toBe(true);
    });

    it('должен возвращать false если пользователь не имеет ни одного из указанных разрешений', () => {
      const user: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'member',
        roles: ['member'],
        permissions: ['media.view']
      };

      useAuthStore.setState({ user, isAuthenticated: true });
      const { hasAnyPermission } = useAuthStore.getState();

      expect(hasAnyPermission(['media.upload', 'media.delete', 'partners.create'])).toBe(false);
    });

    it('должен возвращать false если пользователь не авторизован', () => {
      const { hasAnyPermission } = useAuthStore.getState();
      expect(hasAnyPermission(['media.upload', 'media.delete'])).toBe(false);
    });

    it('должен работать с пустым массивом разрешений', () => {
      const user: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'admin',
        roles: ['admin'],
        permissions: ['media.upload']
      };

      useAuthStore.setState({ user, isAuthenticated: true });
      const { hasAnyPermission } = useAuthStore.getState();

      expect(hasAnyPermission([])).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    it('должен возвращать true если пользователь имеет все указанные разрешения', () => {
      const user: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'admin',
        roles: ['admin'],
        permissions: ['media.view', 'media.upload', 'media.delete', 'partners.create']
      };

      useAuthStore.setState({ user, isAuthenticated: true });
      const { hasAllPermissions } = useAuthStore.getState();

      expect(hasAllPermissions(['media.view', 'media.upload'])).toBe(true);
      expect(hasAllPermissions(['media.view', 'media.upload', 'media.delete'])).toBe(true);
    });

    it('должен возвращать false если пользователь не имеет все указанные разрешения', () => {
      const user: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'editor',
        roles: ['editor'],
        permissions: ['media.view', 'media.upload']
      };

      useAuthStore.setState({ user, isAuthenticated: true });
      const { hasAllPermissions } = useAuthStore.getState();

      expect(hasAllPermissions(['media.view', 'media.upload', 'media.delete'])).toBe(false);
    });

    it('должен возвращать false если пользователь не авторизован', () => {
      const { hasAllPermissions } = useAuthStore.getState();
      expect(hasAllPermissions(['media.upload', 'media.delete'])).toBe(false);
    });

    it('должен работать с пустым массивом разрешений', () => {
      const user: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'admin',
        roles: ['admin'],
        permissions: ['media.upload']
      };

      useAuthStore.setState({ user, isAuthenticated: true });
      const { hasAllPermissions } = useAuthStore.getState();

      expect(hasAllPermissions([])).toBe(true);
    });
  });

  describe('Интеграционные тесты RBAC', () => {
    it('должен корректно проверять комбинации ролей и разрешений', () => {
      const user: User = {
        id: '1',
        email: 'admin@test.com',
        name: 'Admin User',
        role: 'admin',
        roles: ['admin', 'editor'],
        permissions: [
          'media.view',
          'media.upload',
          'media.delete',
          'partners.view',
          'partners.create',
          'partners.update',
          'partners.delete',
          'settings.view',
          'settings.update'
        ]
      };

      useAuthStore.setState({ user, isAuthenticated: true });
      const { hasRole, hasAnyRole, hasPermission, hasAnyPermission, hasAllPermissions } = useAuthStore.getState();

      // Проверка ролей
      expect(hasRole('admin')).toBe(true);
      expect(hasRole('editor')).toBe(true);
      expect(hasAnyRole(['admin', 'moderator'])).toBe(true);

      // Проверка отдельных разрешений
      expect(hasPermission('media.upload')).toBe(true);
      expect(hasPermission('partners.delete')).toBe(true);
      expect(hasPermission('settings.update')).toBe(true);

      // Проверка нескольких разрешений
      expect(hasAnyPermission(['media.upload', 'nonexistent.permission'])).toBe(true);
      expect(hasAllPermissions(['media.view', 'media.upload', 'media.delete'])).toBe(true);

      // Негативные кейсы
      expect(hasRole('super_admin')).toBe(false);
      expect(hasPermission('nonexistent.permission')).toBe(false);
      expect(hasAllPermissions(['media.upload', 'nonexistent.permission'])).toBe(false);
    });

    it('должен корректно обрабатывать пользователя с минимальными правами', () => {
      const user: User = {
        id: '2',
        email: 'guest@test.com',
        name: 'Guest User',
        role: 'guest',
        roles: ['guest'],
        permissions: []
      };

      useAuthStore.setState({ user, isAuthenticated: true });
      const { hasRole, hasPermission, hasAnyPermission, hasAllPermissions } = useAuthStore.getState();

      expect(hasRole('guest')).toBe(true);
      expect(hasRole('admin')).toBe(false);
      expect(hasPermission('media.upload')).toBe(false);
      expect(hasAnyPermission(['media.upload', 'partners.create'])).toBe(false);
      expect(hasAllPermissions(['media.view'])).toBe(false);
    });
  });
});
