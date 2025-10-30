import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  // Legacy API (для обратной совместимости)
  allowedRoles?: Array<'admin' | 'member' | 'user' | 'guest'>;
  redirectTo?: string;
  // New RBAC API
  requireAuth?: boolean;
  requireRole?: string | string[];
  requirePermission?: string | string[];
  requireAllPermissions?: boolean;
  fallbackPath?: string;
}

/**
 * ProtectedRoute компонент для защиты маршрутов с поддержкой RBAC
 *
 * @param children - Компоненты для рендера если авторизован
 * @param allowedRoles - (Legacy) Массив разрешенных ролей
 * @param redirectTo - (Legacy) Куда перенаправлять при отказе доступа
 * @param requireAuth - Требуется авторизация (по умолчанию true)
 * @param requireRole - Требуемая роль или массив ролей (проверка через hasAnyRole)
 * @param requirePermission - Требуемое разрешение или массив разрешений
 * @param requireAllPermissions - Требуются все разрешения из массива (по умолчанию false - любое)
 * @param fallbackPath - Куда перенаправлять при отказе доступа (по умолчанию /auth/login)
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo,
  requireAuth = true,
  requireRole,
  requirePermission,
  requireAllPermissions = false,
  fallbackPath,
}: ProtectedRouteProps) {
  const {
    isAuthenticated,
    user,
    hasAnyRole,
    hasAnyPermission,
    hasAllPermissions
  } = useAuthStore();
  const location = useLocation();

  // Определяем путь для редиректа (новый API имеет приоритет)
  const redirectPath = fallbackPath || redirectTo || '/auth/login';

  // Если требуется авторизация и пользователь не авторизован
  if (requireAuth && (!isAuthenticated || !user)) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Legacy API: проверка через allowedRoles
  if (allowedRoles && user) {
    if (!allowedRoles.includes(user.role)) {
      // Перенаправляем на домашнюю страницу роли или dashboard
      const roleHomePage = getRoleHomePage(user.role);
      return <Navigate to={roleHomePage} replace />;
    }
  }

  // New RBAC API: проверка ролей
  if (requireRole) {
    const roles = Array.isArray(requireRole) ? requireRole : [requireRole];
    if (!hasAnyRole(roles)) {
      return <Navigate to="/errors/403" replace />;
    }
  }

  // New RBAC API: проверка разрешений
  if (requirePermission) {
    const permissions = Array.isArray(requirePermission) ? requirePermission : [requirePermission];
    const hasRequiredPermissions = requireAllPermissions
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);

    if (!hasRequiredPermissions) {
      return <Navigate to="/errors/403" replace />;
    }
  }

  // Пользователь авторизован и имеет нужные роли/разрешения
  return <>{children}</>;
}

/**
 * Получить домашнюю страницу для роли
 * Все пользователи после логина идут на /dashboard/
 */
function getRoleHomePage(role: 'admin' | 'member' | 'user' | 'guest'): string {
  // Все роли идут на общую страницу dashboard
  return '/dashboard/';
}
