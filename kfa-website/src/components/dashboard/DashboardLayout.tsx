import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
}

const navItems: NavItem[] = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Обзор' },
  { to: '/dashboard/profile', icon: User, label: 'Профиль' },
  { to: '/dashboard/payments', icon: CreditCard, label: 'Платежи' },
  { to: '/dashboard/documents', icon: FileText, label: 'Документы' },
  { to: '/dashboard/certificates', icon: Award, label: 'Сертификаты' },
  { to: '/dashboard/education', icon: BookOpen, label: 'Обучение' },
];

// Admin CMS navigation items
const adminNavItems: NavItem[] = [
  { to: '/dashboard/news', icon: Newspaper, label: 'Новости' },
  { to: '/dashboard/events', icon: Calendar, label: 'События' },
  { to: '/dashboard/members', icon: UserCheck, label: 'Участники' },
  { to: '/dashboard/media', icon: Image, label: 'Медиафайлы' },
  { to: '/dashboard/partners', icon: Users, label: 'Партнеры' },
  { to: '/dashboard/settings', icon: Settings, label: 'Настройки' },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  const isAdmin = user?.role === 'admin';

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

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
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setSidebarOpen(false)}
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

            {/* Admin CMS Section */}
            {isAdmin && (
              <>
                <div className="my-4 border-t border-neutral-200 dark:border-neutral-700"></div>
                <div className="mb-2 px-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Управление контентом
                  </p>
                </div>
                <ul className="space-y-1">
                  {adminNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          onClick={() => setSidebarOpen(false)}
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
            <Link
              to="/auth/login"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Выйти</span>
            </Link>
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
