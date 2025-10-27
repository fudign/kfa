import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { NavbarMenu } from '@/components/aceternity/navbar-menu';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Logo } from '@/components/ui/Logo';
import { useAuthStore } from '@/stores/authStore';

export function Header() {
  const { t, i18n } = useTranslation('common');
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const languages = [
    { code: 'ru', name: 'РУС' },
    { code: 'ky', name: 'КЫР' },
    { code: 'en', name: 'ENG' },
  ];

  const navItems = [
    {
      title: t('nav.about'),
      href: '/about',
      submenu: [
        { title: 'Миссия', href: '/about#mission', description: 'Наша цель и ценности' },
        { title: 'История', href: '/about#history', description: 'Путь развития КФА' },
        { title: 'Команда', href: '/about#team', description: 'Руководство и эксперты' },
        { title: 'Документы', href: '/documents', description: 'Устав и регламенты' },
      ],
    },
    {
      title: t('nav.membership'),
      href: '/membership',
      submenu: [
        { title: 'Преимущества', href: '/membership#benefits' },
        { title: 'Как вступить', href: '/membership/join' },
        { title: 'Члены КФА', href: '/members' },
        { title: 'Взносы', href: '/membership#fees' },
      ],
    },
    {
      title: t('nav.standards'),
      href: '/standards',
    },
    {
      title: t('nav.education'),
      href: '/education',
      submenu: [
        { title: 'Программы обучения', href: '/education/programs' },
        { title: 'Сертификация', href: '/education/certification' },
        { title: 'Календарь курсов', href: '/education/calendar' },
      ],
    },
    {
      title: 'Корпоративное управление',
      href: '/governance/code',
      submenu: [
        { title: 'Кодекс корпоративного управления', href: '/governance/code', description: 'Стандарты и практики КФА 2024' },
        { title: 'Программа сертификации директоров', href: '/governance/directors', description: 'Профессиональная подготовка директоров' },
        { title: 'База независимых директоров', href: '/governance/directors-database', description: 'Поиск квалифицированных директоров' },
        { title: 'Governance Scorecard', href: '/governance/scorecard', description: 'Самооценка практик управления' },
        { title: 'Сообщество директоров', href: '/governance/community', description: 'Профессиональная сеть директоров' },
      ],
    },
    {
      title: t('nav.research'),
      href: '/research',
    },
    {
      title: t('nav.news'),
      href: '/news',
    },
    {
      title: t('nav.events'),
      href: '/events',
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-neutral-800 dark:bg-neutral-900/95">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <Logo height={48} className="transition-opacity hover:opacity-90" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <NavbarMenu items={navItems} />
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="hidden items-center gap-1 md:flex">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                  i18n.language === lang.code
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu / Login Button */}
          {isAuthenticated && user ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to={
                  user.role === 'admin'
                    ? '/dashboard/admin'
                    : user.role === 'member'
                    ? '/dashboard'
                    : '/dashboard/profile'
                }
                className="flex items-center gap-2 rounded-lg border border-primary-200 px-3 py-2 text-sm font-medium text-primary-700 transition-all hover:bg-primary-50 dark:border-primary-800 dark:text-primary-400 dark:hover:bg-primary-900/20"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden xl:inline">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                title="Выйти"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth/login"
              className="hidden rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 md:inline-flex"
            >
              {t('nav.login')}
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-2 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 lg:hidden">
          <nav className="container space-y-1 py-4">
            {navItems.map((item) => (
              <div key={item.title}>
                <Link
                  to={item.href}
                  className="block rounded-md px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.title}
                </Link>
                {item.submenu && (
                  <div className="ml-4 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.title}
                        to={subItem.href}
                        className="block rounded-md px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {/* User Menu / Login Button */}
            {isAuthenticated && user ? (
              <div className="space-y-2 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                <Link
                  to={
                    user.role === 'admin'
                      ? '/dashboard/admin'
                      : user.role === 'member'
                      ? '/dashboard'
                      : '/dashboard/profile'
                  }
                  className="flex items-center gap-2 rounded-lg border border-primary-200 px-4 py-3 text-sm font-medium text-primary-700 transition-all hover:bg-primary-50 dark:border-primary-800 dark:text-primary-400 dark:hover:bg-primary-900/20"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Выйти</span>
                </button>
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="block rounded-md bg-primary-600 px-4 py-2 text-center text-sm font-semibold text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.login')}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
