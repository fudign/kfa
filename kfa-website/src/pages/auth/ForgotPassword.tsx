import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!email) {
      setError('Введите email');
      setIsLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Некорректный email');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      console.log('Password reset requested for:', email);
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
                Письмо отправлено!
              </h1>

              <p className="mb-6 text-center leading-relaxed text-neutral-600 dark:text-neutral-400">
                Мы отправили инструкции по восстановлению пароля на адрес:
              </p>

              <div className="mb-8 rounded-lg bg-neutral-50 p-4 text-center dark:bg-neutral-800">
                <p className="font-semibold text-primary-700 dark:text-primary-400">{email}</p>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Проверьте папку "Входящие" и следуйте инструкциям в письме. Ссылка для сброса пароля действительна
                  в течение 24 часов.
                </p>

                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Если письмо не пришло, проверьте папку "Спам" или попробуйте отправить запрос повторно.
                </p>
              </div>

              <div className="mt-8 space-y-3">
                <Link
                  to="/auth/login"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 py-3 font-semibold text-white shadow-kfa-md transition-all hover:shadow-kfa-lg"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Вернуться ко входу
                </Link>

                <button
                  onClick={() => setIsSuccess(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary-600 py-3 font-semibold text-primary-700 transition-colors hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/30"
                >
                  Отправить повторно
                </button>
              </div>
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
              Восстановление пароля
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Введите email, указанный при регистрации. Мы отправим вам инструкции для сброса пароля
            </p>
          </div>

          {/* Forgot Password Form */}
          <div className="rounded-kfa border border-neutral-200 bg-white p-8 shadow-kfa-lg dark:border-neutral-700 dark:bg-neutral-900">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-lg border ${
                      error ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                    } bg-white py-3 pl-10 pr-4 text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-neutral-800 dark:text-neutral-100`}
                    placeholder="your@email.com"
                  />
                </div>
                {error && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    {error}
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
                    Отправка...
                  </>
                ) : (
                  <>
                    <Mail className="h-5 w-5" />
                    Отправить инструкции
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700"></div>
              <span className="text-sm text-neutral-500 dark:text-neutral-500">или</span>
              <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700"></div>
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                to="/auth/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Вернуться ко входу
              </Link>
            </div>
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
