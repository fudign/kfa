import { useAuthStore } from '@/stores/authStore';

/**
 * Hook for checking user permissions and roles
 *
 * Usage:
 * ```tsx
 * const { can, hasRole, isAdmin } = usePermission();
 *
 * {can('media.upload') && <UploadButton />}
 * {hasRole('admin') && <AdminPanel />}
 * {isAdmin && <SystemSettings />}
 * ```
 */
export function usePermission() {
  const { user, hasRole, hasAnyRole, hasPermission, hasAnyPermission, hasAllPermissions } = useAuthStore();

  return {
    // User info
    user,
    isAuthenticated: !!user,

    // Permission checks
    can: hasPermission,
    canAny: hasAnyPermission,
    canAll: hasAllPermissions,

    // Role checks
    hasRole,
    hasAnyRole,
    isAdmin: user?.roles?.includes('admin') || user?.roles?.includes('super_admin') || false,
    isSuperAdmin: user?.roles?.includes('super_admin') || false,
    isModerator: user?.roles?.includes('moderator') || false,
    isEditor: user?.roles?.includes('editor') || false,
    isMember: user?.roles?.includes('member') || false,
    isGuest: user?.roles?.includes('guest') || user?.roles?.length === 0 || false,
  };
}
