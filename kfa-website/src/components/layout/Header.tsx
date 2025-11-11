import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, LogOut, LayoutDashboard, Globe } from 'lucide-react';
import { NavbarMenu } from '@/components/aceternity/navbar-menu';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Logo } from '@/components/ui/Logo';
import { useAuthStore } from '@/stores/authStore';

export function Header() {
  const { t, i18n } = useTranslation('common');
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const languages = [
    { code: 'ru', name: 'РУС', fullName: 'Русский' },
    { code: 'ky', name: 'КЫР', fullName: 'Кыргызча' },
    { code: 'en', name: 'ENG', fullName: 'English' },
  ];

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setLanguageMenuOpen(false);
      }
    };

    if (languageMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [languageMenuOpen]);

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setLanguageMenuOpen(false);
  };

  const navItems = [
    {
      title: t('nav.about'),
      href: '/about',
      submenu: [
        { title: t('nav.submenu.about_kfa'), href: '/about', description: t('nav.submenu.about_kfa_description') },
        { title: t('nav.submenu.documents'), href: '/documents', description: t('nav.submenu.documents_description') },
        { title: t('nav.submenu.standards'), href: '/standards', description: t('nav.submenu.standards_description') },
      ],
    },
    {
      title: t('nav.membership'),
      href: '/membership',
      submenu: [
        { title: t('nav.submenu.join'), href: '/membership', description: t('nav.submenu.join_description') },
        { title: t('nav.submenu.our_members'), href: '/members', description: t('nav.submenu.our_members_description') },
      ],
    },
    {
      title: t('nav.education'),
      href: '/education',
      submenu: [
        { title: t('nav.submenu.programs'), href: '/education/programs', description: t('nav.submenu.programs_description') },
        { title: t('nav.submenu.certification'), href: '/education/certification', description: t('nav.submenu.certification_description') },
        { title: t('nav.submenu.corporate_governance'), href: '/governance/code', description: t('nav.submenu.corporate_governance_description') },
      ],
    },
    {
      title: t('nav.news'),
      href: '/news',
      submenu: [
        { title: t('nav.submenu.news'), href: '/news', description: t('nav.submenu.news_description') },
        { title: t('nav.submenu.events'), href: '/events', description: t('nav.submenu.events_description') },
        { title: t('nav.submenu.research'), href: '/research', description: t('nav.submenu.research_description') },
      ],
    },
    {
      title: t('nav.contacts'),
      href: '/about#contacts',
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-neutral-800 dark:bg-neutral-900/95">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center"
          onClick={() => {
            console.log('🔵 Клик на логотип КФА');
          }}
        >
          <Logo height={48} className="transition-opacity hover:opacity-90" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <NavbarMenu items={navItems} />
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Language Selector - Desktop */}
          <div className="relative hidden md:block" ref={languageMenuRef} data-testid="language-switcher">
            <button
              onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
              className="flex items-center justify-center rounded-lg border border-neutral-200 bg-white p-2 text-neutral-700 transition-all hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              aria-label="Выбор языка"
              aria-expanded={languageMenuOpen}
            >
              <Globe className="h-5 w-5" />
            </button>

            {/* Dropdown Menu */}
            {languageMenuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-neutral-200 bg-white shadow-lg transition-all duration-200 ease-in-out dark:border-neutral-700 dark:bg-neutral-800">
                <div className="py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                        i18n.language === lang.code
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                          : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{lang.fullName}</span>
                        <span className="text-xs text-neutral-500">{lang.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu / Login Button */}
          {isAuthenticated && user ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/dashboard/"
                className="flex items-center gap-2 rounded-lg border border-primary-200 px-3 py-2 text-sm font-medium text-primary-700 transition-all hover:bg-primary-50 dark:border-primary-800 dark:text-primary-400 dark:hover:bg-primary-900/20"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden xl:inline">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                title={t('nav.logout')}
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

            {/* Language Selector - Mobile */}
            <div className="border-t border-neutral-200 pt-4 dark:border-neutral-800">
              <div className="px-4 pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  {t('nav.language')}
                </span>
              </div>
              <div className="space-y-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      handleLanguageChange(lang.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full rounded-md px-4 py-2 text-left text-sm transition-colors ${
                      i18n.language === lang.code
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{lang.fullName}</span>
                      <span className="text-xs text-neutral-500">{lang.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* User Menu / Login Button */}
            {isAuthenticated && user ? (
              <div className="space-y-2 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                <Link
                  to="/dashboard/"
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
                  <span>{t('nav.logout')}</span>
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
