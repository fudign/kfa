import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.password) {
      newErrors.password = 'Введите новый пароль';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Минимум 8 символов';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      console.log('Password reset with token:', token);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
        <div className="container flex min-h-screen items-center justify-center py-12">
          <div className="w-full max-w-md">
            {/* Success Message */}
            <div className="rounded-kfa border border-green-200 bg-white p-8 shadow-kfa-lg dark:border-green-800 dark:bg-neutral-900">
              <div className="mb-6 flex justify-center">
                <div className="inline-flex rounded-full bg-green-100 p-4 dark:bg-green-900/30">
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
              </div>

              <h1 className="mb-4 text-center font-display text-2xl font-bold text-primary-900 dark:text-primary-100">
                Пароль успешно изменен!
              </h1>

              <p className="mb-8 text-center leading-relaxed text-neutral-600 dark:text-neutral-400">
                Теперь вы можете войти в систему используя новый пароль
              </p>

              <Link
                to="/auth/login"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 py-3 font-semibold text-white shadow-kfa-md transition-all hover:shadow-kfa-lg"
              >
                Войти в систему
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <div className="container flex min-h-screen items-center justify-center py-12">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="mb-8 text-center">
            <Link to="/" className="mb-6 inline-block">
              <Logo height={56} />
            </Link>
            <h1 className="mb-2 font-display text-3xl font-bold text-primary-900 dark:text-primary-100">
              Новый пароль
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">Создайте надежный пароль для вашего аккаунта</p>
          </div>

          {/* Reset Password Form */}
          <div className="rounded-kfa border border-neutral-200 bg-white p-8 shadow-kfa-lg dark:border-neutral-700 dark:bg-neutral-900">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Новый пароль
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

              {/* Confirm Password */}
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

              {/* Password Requirements */}
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
                <p className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Требования к паролю:
                </p>
                <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle
                      className={`h-4 w-4 ${
                        formData.password.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-neutral-400'
                      }`}
                    />
                    Минимум 8 символов
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle
                      className={`h-4 w-4 ${
                        /[A-Z]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : 'text-neutral-400'
                      }`}
                    />
                    Хотя бы одна заглавная буква
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle
                      className={`h-4 w-4 ${
                        /[0-9]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : 'text-neutral-400'
                      }`}
                    />
                    Хотя бы одна цифра
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle
                      className={`h-4 w-4 ${
                        /[!@#$%^&*]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : 'text-neutral-400'
                      }`}
                    />
                    Хотя бы один специальный символ (!@#$%^&*)
                  </li>
                </ul>
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
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    Сохранить пароль
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              ← Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
