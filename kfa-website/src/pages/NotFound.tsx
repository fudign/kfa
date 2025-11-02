import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, HelpCircle } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <div className="container px-6 text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="mb-4 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text font-display text-9xl font-bold text-transparent dark:from-primary-400 dark:to-primary-600">
            404
          </h1>
          <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-primary-600 to-primary-800"></div>
        </div>

        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-full bg-white p-6 shadow-kfa-lg dark:bg-neutral-800">
            <HelpCircle className="h-16 w-16 text-primary-600 dark:text-primary-400" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-12 space-y-4">
          <h2 className="font-display text-3xl font-bold text-primary-900 dark:text-primary-100">
            Страница не найдена
          </h2>
          <p className="mx-auto max-w-lg text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            К сожалению, запрашиваемая страница не существует или была перемещена. Проверьте правильность адреса или
            вернитесь на главную страницу.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-4 font-semibold text-white shadow-kfa-md transition-all hover:shadow-kfa-lg sm:w-auto"
          >
            <Home className="h-5 w-5" />
            На главную
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary-600 px-8 py-4 font-semibold text-primary-700 transition-colors hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/30 sm:w-auto"
          >
            <ArrowLeft className="h-5 w-5" />
            Назад
          </button>
        </div>

        {/* Popular Links */}
        <div className="mt-16">
          <h3 className="mb-6 font-display text-xl font-semibold text-primary-900 dark:text-primary-100">
            Популярные разделы
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {[
              { to: '/about', label: 'О КФА' },
              { to: '/membership', label: 'Членство' },
              { to: '/education', label: 'Образование' },
              { to: '/members', label: 'Члены КФА' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-lg border border-neutral-200 bg-white p-4 font-semibold text-primary-700 transition-all hover:border-primary-300 hover:shadow-kfa-md dark:border-neutral-700 dark:bg-neutral-800 dark:text-primary-400"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="mt-12 rounded-kfa border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center justify-center gap-2 text-neutral-600 dark:text-neutral-400">
            <Search className="h-5 w-5" />
            <p className="text-sm">
              Не можете найти то, что ищете? Попробуйте{' '}
              <Link to="/" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
                поиск по сайту
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
