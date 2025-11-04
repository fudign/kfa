import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/components/ui/Logo';
import { useAuthStore } from '@/stores/authStore';

// Тестовые аккаунты для режима разработки
const DEV_ACCOUNTS = [
  {
    role: 'Admin',
    email: 'admin@kfa.kg',
    password: 'password',
    description: 'Полный доступ ко всем функциям',
    color: 'from-red-500 to-red-600',
    icon: '👑',
  },
  {
    role: 'Editor',
    email: 'editor@kfa.kg',
    password: 'password',
    description: 'Создание и редактирование контента',
    color: 'from-blue-500 to-blue-600',
    icon: '✍️',
  },
  {
    role: 'Moderator',
    email: 'moderator@kfa.kg',
    password: 'password',
    description: 'Модерация контента и пользователей',
    color: 'from-green-500 to-green-600',
    icon: '🛡️',
  },
  {
    role: 'Member',
    email: 'member@kfa.kg',
    password: 'password',
    description: 'Просмотр контента и базовые функции',
    color: 'from-purple-500 to-purple-600',
    icon: '👤',
  },
];

export function LoginPage() {
  const { t } = useTranslation('auth');
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Автоматическое перенаправление при изменении user
  useEffect(() => {
    if (user) {
      // Принудительное перенаправление через window.location
      console.log('[Login] User detected, redirecting to dashboard');
      window.location.href = '/dashboard';
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.email) {
      newErrors.email = 'Введите email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }
    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Минимум 6 символов';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Real API call через authStore
      await login({
        email: formData.email,
        password: formData.password,
      });

      // useEffect автоматически перенаправит после изменения user
    } catch (error: any) {
      // Handle API errors
      const apiErrors: Record<string, string> = {};

      if (error.response?.data?.errors) {
        // Laravel validation errors
        Object.entries(error.response.data.errors).forEach(([field, messages]: [string, any]) => {
          apiErrors[field] = Array.isArray(messages) ? messages[0] : messages;
        });
      } else if (error.response?.data?.message) {
        // General error message
        apiErrors.email = error.response.data.message;
      } else {
        // Network or other errors
        apiErrors.email = 'Ошибка подключения. Попробуйте позже.';
      }

      setErrors(apiErrors);
    } finally {
      setIsLoading(false);
    }
  };

  // Быстрый вход для режима разработки
  const handleQuickLogin = async (email: string, password: string) => {
    setErrors({});
    setIsLoading(true);

    try {
      await login({ email, password });

      // useEffect автоматически перенаправит после изменения user
    } catch (error: any) {
      const apiErrors: Record<string, string> = {};
      if (error.response?.data?.message) {
        apiErrors.email = error.response.data.message;
      } else {
        apiErrors.email = 'Ошибка подключения. Попробуйте позже.';
      }
      setErrors(apiErrors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <div className="container flex min-h-screen items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="mb-6 text-center md:mb-8">
            <Link to="/" className="mb-4 inline-block md:mb-6">
              <Logo height={48} className="md:h-14" />
            </Link>
            <h1 className="mb-2 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:text-3xl">
              {t('login.title')}
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 md:text-base">{t('login.subtitle')}</p>
          </div>

          {/* Dev Mode Quick Login */}
          {import.meta.env.DEV && (
            <div className="mb-4 rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950/30">
              <div className="mb-3 flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                  Быстрый вход (Dev Mode)
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {DEV_ACCOUNTS.map((account) => (
                  <button
                    key={account.role}
                    type="button"
                    onClick={() => handleQuickLogin(account.email, account.password)}
                    disabled={isLoading}
                    className={`group relative overflow-hidden rounded-lg bg-gradient-to-r ${account.color} p-3 text-left text-white shadow-md transition-all hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    <div className="relative z-10">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-xl">{account.icon}</span>
                        <span className="font-bold">{account.role}</span>
                      </div>
                      <p className="mb-2 text-xs opacity-90">{account.description}</p>
                      <div className="space-y-0.5 text-xs opacity-75">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="font-mono">{account.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          <span className="font-mono">{account.password}</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-10"></div>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-amber-700 dark:text-amber-300">
                💡 Кликните на роль для автоматического входа
              </p>
            </div>
          )}

          {/* Login Form */}
          <div className="rounded-kfa border border-neutral-200 bg-white p-5 shadow-kfa-lg dark:border-neutral-700 dark:bg-neutral-900 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                    } bg-white py-3 pl-10 pr-4 text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-neutral-800 dark:text-neutral-100`}
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Пароль
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full rounded-lg border ${
                      errors.password ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                    } bg-white py-3 pl-10 pr-12 text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-neutral-800 dark:text-neutral-100`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.remember}
                    onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                    className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600"
                  />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Запомнить меня</span>
                </label>
                <Link
                  to="/auth/forgot-password"
                  className="text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Забыли пароль?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 py-3 font-semibold text-white shadow-kfa-md transition-all hover:shadow-kfa-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Вход...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    Войти
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3 md:my-6 md:gap-4">
              <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700"></div>
              <span className="text-xs text-neutral-500 dark:text-neutral-500 md:text-sm">или</span>
              <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700"></div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">
                Нет аккаунта?{' '}
                <Link
                  to="/auth/register"
                  className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center md:mt-6">
            <Link
              to="/"
              className="text-xs text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 md:text-sm"
            >
              ← Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
