import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useCallback } from 'react';

/**
 * Хук для перенаправления пользователя на страницу в зависимости от роли
 */
export function useRoleRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  /**
   * Перенаправить пользователя после успешного логина
   * Использует location.state.from если доступно, иначе домашнюю страницу роли
   */
  const redirectAfterLogin = useCallback(() => {
    if (!user) return;

    // Проверяем, откуда пришел пользователь
    const from = (location.state as any)?.from?.pathname;

    // Если пользователь пытался зайти на защищенную страницу, возвращаем его туда
    if (from && from !== '/auth/login' && from !== '/auth/register') {
      navigate(from, { replace: true });
      return;
    }

    // Иначе перенаправляем на домашнюю страницу роли
    const roleHome = getRoleHomePage(user.role);
    navigate(roleHome, { replace: true });
  }, [user, location.state, navigate]);

  /**
   * Получить URL домашней страницы для роли
   */
  const getRoleHomePage = (role: 'admin' | 'member' | 'user' | 'guest'): string => {
    const roleRoutes: Record<string, string> = {
      admin: '/dashboard/admin',
      member: '/dashboard',
      user: '/dashboard/profile',
      guest: '/dashboard/profile',
    };

    return roleRoutes[role] || '/';
  };

  /**
   * Проверить, имеет ли пользователь определенную роль
   */
  const hasRole = useCallback(
    (roles: Array<'admin' | 'member' | 'user' | 'guest'>): boolean => {
      if (!user) return false;
      return roles.includes(user.role);
    },
    [user]
  );

  /**
   * Проверить, является ли пользователь админом
   */
  const isAdmin = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  /**
   * Проверить, является ли пользователь членом КФА
   */
  const isMember = useCallback(() => {
    return user?.role === 'member' || user?.role === 'admin';
  }, [user]);

  return {
    redirectAfterLogin,
    getRoleHomePage,
    hasRole,
    isAdmin,
    isMember,
  };
}
