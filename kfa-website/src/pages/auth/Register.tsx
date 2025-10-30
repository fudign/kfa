import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, Eye, EyeOff, AlertCircle, User, Building2, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/components/ui/Logo';
import { useAuthStore } from '@/stores/authStore';
import { useRoleRedirect } from '@/hooks/useRoleRedirect';

export function RegisterPage() {
  const { t } = useTranslation('auth');
  const register = useAuthStore((state) => state.register);
  const { redirectAfterLogin } = useRoleRedirect();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'Введите имя';
    if (!formData.lastName) newErrors.lastName = 'Введите фамилию';
    if (!formData.email) {
      newErrors.email = 'Введите email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }
    if (!formData.phone) newErrors.phone = 'Введите телефон';
    if (!formData.company) newErrors.company = 'Введите компанию';
    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Минимум 8 символов';
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Пароль должен содержать хотя бы одну букву и одну цифру';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Необходимо принять условия';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Real API call через authStore
      const fullName = `${formData.firstName} ${formData.lastName}`;
      await register({
        name: fullName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      });

      // Перенаправляем пользователя в зависимости от роли
      redirectAfterLogin();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <div className="container flex min-h-screen items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-2xl">
          {/* Logo/Brand */}
          <div className="mb-6 text-center md:mb-8">
            <Link to="/" className="mb-4 inline-block md:mb-6">
              <Logo height={48} className="md:h-14" />
            </Link>
            <h1 className="mb-2 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:text-3xl">
              {t('register.title')}
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 md:text-base">{t('register.subtitle')}</p>
          </div>

          {/* Register Form */}
          <div className="rounded-kfa border border-neutral-200 bg-white p-5 shadow-kfa-lg dark:border-neutral-700 dark:bg-neutral-900 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
              {/* Name Fields */}
              <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Имя
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className={`w-full rounded-lg border ${
                        errors.firstName ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                      } bg-white py-3 pl-10 pr-4 text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-neutral-800 dark:text-neutral-100`}
                      placeholder="Иван"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Фамилия
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className={`w-full rounded-lg border ${
                        errors.lastName ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                      } bg-white py-3 pl-10 pr-4 text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-neutral-800 dark:text-neutral-100`}
                      placeholder="Иванов"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

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

              {/* Phone & Company */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Телефон
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Phone className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full rounded-lg border ${
                        errors.phone ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                      } bg-white py-3 pl-10 pr-4 text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-neutral-800 dark:text-neutral-100`}
                      placeholder="+996 XXX XXX XXX"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Компания
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Building2 className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className={`w-full rounded-lg border ${
                        errors.company ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                      } bg-white py-3 pl-10 pr-4 text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-neutral-800 dark:text-neutral-100`}
                      placeholder="ООО Компания"
                    />
                  </div>
                  {errors.company && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      {errors.company}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid gap-6 md:grid-cols-2">
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

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Подтвердите пароль
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`w-full rounded-lg border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                      } bg-white py-3 pl-10 pr-12 text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-neutral-800 dark:text-neutral-100`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms Agreement */}
              <div>
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600"
                  />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    Я принимаю{' '}
                    <Link to="/terms" className="font-semibold text-primary-600 hover:text-primary-700">
                      условия использования
                    </Link>{' '}
                    и{' '}
                    <Link to="/privacy" className="font-semibold text-primary-600 hover:text-primary-700">
                      политику конфиденциальности
                    </Link>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    {errors.agreeToTerms}
                  </p>
                )}
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
                    Регистрация...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    Зарегистрироваться
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

            {/* Login Link */}
            <div className="text-center">
              <p className="text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">
                Уже есть аккаунт?{' '}
                <Link
                  to="/auth/login"
                  className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Войти
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
