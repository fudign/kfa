import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePermission } from './usePermission';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/types';

describe('usePermission хук', () => {
  beforeEach(() => {
    // Очищаем store перед каждым тестом
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      token: null,
      isLoading: false,
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('isAuthenticated', () => {
    it('должен возвращать false для неавторизованного пользователя', () => {
      const { result } = renderHook(() => usePermission());
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('должен возвращать true для авторизованного пользователя', () => {
      const user: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'member',
        roles: ['member'],
        permissions: []
      };

      useAuthStore.setState({ user, isAuthenticated: true });
      const { result } = renderHook(() => usePermission());

      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('Методы проверки разрешений', () => {
    it('can() должен проверять наличие разрешения', () => {
      const user: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'editor',
        roles: ['editor'],
        permissions: ['media.upload', 'media.view']
      };

      useAuthStore.setState({ user, isAuthenticated: true });
      const { result } = renderHook(() => usePermission());

      expect(result.current.can('media.upload')).toBe(true);
      expect(result.current.can('media.view')).toBe(true);
      expect(result.current.can('media.delete')).toBe(false);
    });

    it('canAny() должен проверять наличие хотя бы одного разрешения', () => {
      const user: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'editor',
        roles: ['editor'],
        permissions: ['media.view']
      };

      useAuthStore.setState({ user, isAuthenticated: true });
      const { result } = renderHook(() => usePermission());

      expect(result.current.canAny(['media.view', 'media.upload'])).toBe(true);
      expect(result.current.canAny(['media.upload', 'media.delete'])).toBe(false);
    });

    it('canAll() должен проверять наличие всех разрешений', () => {
      const user: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'admin',
        roles: ['admin'],
        permissions: ['media.view', 'media.upload', 'media.delete']
      };

      useAuthStore.setState({ user, isAuthenticated: true });
      const { result } = renderHook(() => usePermission());

      expect(result.current.canAll(['media.view', 'media.upload'])).toBe(true);
      expect(result.current.canAll(['media.view', 'media.upload', 'media.delete'])).toBe(true);
      expect(result.current.canAll(['media.view', 'partners.create'])).toBe(false);
    });
  });

  describe('Методы проверки ролей', () => {
    it('hasRole() должен проверять наличие роли', () => {
      const user: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'admin',
        roles: ['admin', 'editor'],
        permissions: []
      };

      useAuthStore.setState({ user, isAuthenticated: true });
      const { result } = renderHook(() => usePermission());

      expect(result.current.hasRole('admin')).toBe(true);
      expect(result.current.hasRole('editor')).toBe(true);
      expect(result.current.hasRole('moderator')).toBe(false);
    });

    it('hasAnyRole() должен проверять наличие хотя бы одной роли', () => {
      const user: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'editor',
        roles: ['editor'],
        permissions: []
      };

      useAuthStore.setState({ user, isAuthenticated: true });
      const { result } = renderHook(() => usePermission());

      expect(result.current.hasAnyRole(['admin', 'editor'])).toBe(true);
      expect(result.current.hasAnyRole(['admin', 'moderator'])).toBe(false);
    });
  });

  describe('Shortcuts для ролей', () => {
    it('isAdmin должен возвращать true для admin и super_admin', () => {
      const adminUser: User = {
        id: '1',
        email: 'admin@test.com',
        name: 'Admin',
        role: 'admin',
        roles: ['admin'],
        permissions: []
      };

      useAuthStore.setState({ user: adminUser, isAuthenticated: true });
      let { result } = renderHook(() => usePermission());
      expect(result.current.isAdmin).toBe(true);

      const superAdminUser: User = {
        id: '2',
        email: 'super@test.com',
        name: 'Super Admin',
        role: 'admin',
        roles: ['super_admin'],
        permissions: []
      };

      useAuthStore.setState({ user: superAdminUser, isAuthenticated: true });
      result = renderHook(() => usePermission()).result;
      expect(result.current.isAdmin).toBe(true);
    });

    it('isSuperAdmin должен возвращать true только для super_admin', () => {
      const superAdminUser: User = {
        id: '1',
        email: 'super@test.com',
        name: 'Super Admin',
        role: 'admin',
        roles: ['super_admin'],
        permissions: []
      };

      useAuthStore.setState({ user: superAdminUser, isAuthenticated: true });
      const { result } = renderHook(() => usePermission());

      expect(result.current.isSuperAdmin).toBe(true);
    });

    it('isSuperAdmin должен возвращать false для обычного admin', () => {
      const adminUser: User = {
        id: '1',
        email: 'admin@test.com',
        name: 'Admin',
        role: 'admin',
        roles: ['admin'],
        permissions: []
      };

      useAuthStore.setState({ user: adminUser, isAuthenticated: true });
      const { result } = renderHook(() => usePermission());

      expect(result.current.isSuperAdmin).toBe(false);
    });

    it('isModerator должен возвращать true для moderator', () => {
      const moderatorUser: User = {
        id: '1',
        email: 'mod@test.com',
        name: 'Moderator',
        role: 'moderator',
        roles: ['moderator'],
        permissions: []
      };

      useAuthStore.setState({ user: moderatorUser, isAuthenticated: true });
      const { result } = renderHook(() => usePermission());

      expect(result.current.isModerator).toBe(true);
    });

    it('isEditor должен возвращать true для editor', () => {
      const editorUser: User = {
        id: '1',
        email: 'editor@test.com',
        name: 'Editor',
        role: 'editor',
        roles: ['editor'],
        permissions: []
      };

      useAuthStore.setState({ user: editorUser, isAuthenticated: true });
      const { result } = renderHook(() => usePermission());

      expect(result.current.isEditor).toBe(true);
    });

    it('isMember должен возвращать true для member', () => {
      const memberUser: User = {
        id: '1',
        email: 'member@test.com',
        name: 'Member',
        role: 'member',
        roles: ['member'],
        permissions: []
      };

      useAuthStore.setState({ user: memberUser, isAuthenticated: true });
      const { result } = renderHook(() => usePermission());

      expect(result.current.isMember).toBe(true);
    });

    it('isGuest должен возвращать true для guest или пользователя без ролей', () => {
      const guestUser: User = {
        id: '1',
        email: 'guest@test.com',
        name: 'Guest',
        role: 'guest',
        roles: ['guest'],
        permissions: []
      };

      useAuthStore.setState({ user: guestUser, isAuthenticated: true });
      let { result } = renderHook(() => usePermission());
      expect(result.current.isGuest).toBe(true);

      const userWithoutRoles: User = {
        id: '2',
        email: 'norole@test.com',
        name: 'No Role',
        role: 'guest',
        roles: [],
        permissions: []
      };

      useAuthStore.setState({ user: userWithoutRoles, isAuthenticated: true });
      result = renderHook(() => usePermission()).result;
      expect(result.current.isGuest).toBe(true);
    });
  });

  describe('Полная интеграция', () => {
    it('должен предоставлять доступ ко всем функциям для admin пользователя', () => {
      const adminUser: User = {
        id: '1',
        email: 'admin@test.com',
        name: 'Admin User',
        role: 'admin',
        roles: ['admin', 'editor'],
        permissions: [
          'media.view',
          'media.upload',
          'media.delete',
          'partners.create',
          'partners.update',
          'partners.delete',
          'settings.update'
        ]
      };

      useAuthStore.setState({ user: adminUser, isAuthenticated: true });
      const { result } = renderHook(() => usePermission());

      // Проверяем аутентификацию
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(adminUser);

      // Проверяем роли
      expect(result.current.isAdmin).toBe(true);
      expect(result.current.hasRole('admin')).toBe(true);
      expect(result.current.hasRole('editor')).toBe(true);

      // Проверяем разрешения
      expect(result.current.can('media.upload')).toBe(true);
      expect(result.current.can('partners.delete')).toBe(true);
      expect(result.current.canAll(['media.view', 'media.upload'])).toBe(true);
      expect(result.current.canAny(['media.delete', 'nonexistent.permission'])).toBe(true);
    });

    it('должен корректно ограничивать доступ для member пользователя', () => {
      const memberUser: User = {
        id: '1',
        email: 'member@test.com',
        name: 'Member User',
        role: 'member',
        roles: ['member'],
        permissions: ['media.view', 'partners.view']
      };

      useAuthStore.setState({ user: memberUser, isAuthenticated: true });
      const { result } = renderHook(() => usePermission());

      // Проверяем роль
      expect(result.current.isMember).toBe(true);
      expect(result.current.isAdmin).toBe(false);

      // Проверяем разрешения
      expect(result.current.can('media.view')).toBe(true);
      expect(result.current.can('media.upload')).toBe(false);
      expect(result.current.can('media.delete')).toBe(false);
      expect(result.current.canAny(['media.view', 'media.upload'])).toBe(true);
      expect(result.current.canAll(['media.view', 'media.upload'])).toBe(false);
    });

    it('должен возвращать false для всех проверок у неавторизованного пользователя', () => {
      const { result } = renderHook(() => usePermission());

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
      expect(result.current.isAdmin).toBe(false);
      expect(result.current.isMember).toBe(false);
      expect(result.current.can('media.upload')).toBe(false);
      expect(result.current.hasRole('admin')).toBe(false);
    });
  });
});
