import { ReactNode, useState, useRef, useLayoutEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  CreditCard,
  FileText,
  Award,
  BookOpen,
  LogOut,
  Menu,
  X,
  Bell,
  Settings,
  Image,
  Users,
  Newspaper,
  Calendar,
  UserCheck,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LogoCompact } from '@/components/ui/Logo';
import { useAuthStore } from '@/stores/authStore';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  to: string;
  icon: typeof LayoutDashboard;
  label: string;
  // RBAC: требуемые роли или права доступа
  roles?: string[];
  permissions?: string[];
  requireAllPermissions?: boolean;
}

// Основные пункты меню для всех авторизованных пользователей
const navItems: NavItem[] = [
  {
    to: '/dashboard',
    icon: LayoutDashboard,
    label: 'Обзор',
    // Доступно всем авторизованным
  },
  {
    to: '/dashboard/profile',
    icon: User,
    label: 'Профиль',
    // Доступно всем авторизованным
  },
  {
    to: '/dashboard/payments',
    icon: CreditCard,
    label: 'Платежи',
    roles: ['admin', 'member'],
  },
  {
    to: '/dashboard/documents',
    icon: FileText,
    label: 'Документы',
    roles: ['admin', 'member'],
  },
  {
    to: '/dashboard/certificates',
    icon: Award,
    label: 'Сертификаты',
    roles: ['admin', 'member'],
  },
  {
    to: '/dashboard/education',
    icon: BookOpen,
    label: 'Обучение',
    roles: ['admin', 'member'],
  },
];

// Пункты меню управления контентом (CMS)
const cmsNavItems: NavItem[] = [
  {
    to: '/dashboard/news',
    icon: Newspaper,
    label: 'Новости',
    permissions: ['content.view'],
  },
  {
    to: '/dashboard/events',
    icon: Calendar,
    label: 'События',
    permissions: ['events.view'],
  },
  {
    to: '/dashboard/members',
    icon: UserCheck,
    label: 'Участники',
    permissions: ['members.view'],
  },
  {
    to: '/dashboard/media',
    icon: Image,
    label: 'Медиафайлы',
    permissions: ['media.view'],
  },
  {
    to: '/dashboard/partners',
    icon: Users,
    label: 'Партнеры',
    permissions: ['partners.view'],
  },
  {
    to: '/dashboard/settings',
    icon: Settings,
    label: 'Настройки',
    permissions: ['settings.view'],
  },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, hasAnyRole, hasAnyPermission, hasAllPermissions } = useAuthStore();
  const navRef = useRef<HTMLElement>(null);
  const scrollPositionRef = useRef<number>(0);

  // Сохраняем позицию скролла при скролле
  const handleNavScroll = () => {
    if (navRef.current) {
      scrollPositionRef.current = navRef.current.scrollTop;
    }
  };

  // Обработчик клика на ссылку - сохраняем позицию ДО навигации
  const handleLinkClick = () => {
    if (navRef.current) {
      scrollPositionRef.current = navRef.current.scrollTop;
    }
    setSidebarOpen(false);
  };

  // Восстанавливаем позицию скролла синхронно ПЕРЕД отрисовкой
  useLayoutEffect(() => {
    const navElement = navRef.current;
    if (!navElement) return;

    // Восстанавливаем позицию
    navElement.scrollTop = scrollPositionRef.current;

    // Слушаем скролл для сохранения позиции
    navElement.addEventListener('scroll', handleNavScroll);
    return () => {
      navElement.removeEventListener('scroll', handleNavScroll);
    };
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Функция проверки доступа к пункту меню
  const hasAccess = (item: NavItem): boolean => {
    // Если не указаны требования - доступно всем
    if (!item.roles && !item.permissions) {
      return true;
    }

    // Проверка по ролям
    if (item.roles && item.roles.length > 0) {
      if (!hasAnyRole(item.roles)) {
        return false;
      }
    }

    // Проверка по правам доступа
    if (item.permissions && item.permissions.length > 0) {
      if (item.requireAllPermissions) {
        return hasAllPermissions(item.permissions);
      } else {
        return hasAnyPermission(item.permissions);
      }
    }

    return true;
  };

  // Функция выхода из системы
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // Даже если API запрос не удался, всё равно редиректим
      navigate('/auth/login', { replace: true });
    }
  };

  // Фильтруем пункты меню по правам доступа
  const visibleNavItems = navItems.filter(hasAccess);
  const visibleCmsItems = cmsNavItems.filter(hasAccess);
  const showCmsSection = visibleCmsItems.length > 0;

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-neutral-200 bg-white transition-transform duration-200 dark:border-neutral-700 dark:bg-neutral-800 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-6 dark:border-neutral-700">
            <Link to="/">
              <LogoCompact />
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav ref={navRef} className="flex-1 overflow-y-auto p-4">
            {/* Основное меню */}
            <ul className="space-y-1">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={handleLinkClick}
                      preventScrollReset={true}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                        isActive(item.to)
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                          : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* CMS Section - отображается только если есть права */}
            {showCmsSection && (
              <>
                <div className="my-4 border-t border-neutral-200 dark:border-neutral-700"></div>
                <div className="mb-2 px-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Управление контентом
                  </p>
                </div>
                <ul className="space-y-1">
                  {visibleCmsItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          onClick={handleLinkClick}
                          preventScrollReset={true}
                          className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                            isActive(item.to)
                              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                              : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </nav>

          {/* Bottom Actions */}
          <div className="border-t border-neutral-200 p-4 dark:border-neutral-700">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Выйти</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6 dark:border-neutral-700 dark:bg-neutral-800">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
          </button>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
              </span>
            </button>

            {/* Settings */}
            <button className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700">
              <Settings className="h-5 w-5" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <Link
              to="/dashboard/profile"
              className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-700"></div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{user?.name || 'Пользователь'}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500">
                  {user?.roles && user.roles.length > 0 ? user.roles[0] : 'guest'}
                </p>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
