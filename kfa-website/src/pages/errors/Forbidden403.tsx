import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export function Forbidden403Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 px-4 dark:from-neutral-900 dark:to-neutral-800">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-red-100 p-6 dark:bg-red-900/20">
            <ShieldAlert className="h-16 w-16 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Error code */}
        <h1 className="mb-4 text-6xl font-bold text-neutral-900 dark:text-neutral-100">
          403
        </h1>

        {/* Title */}
        <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Доступ запрещен
        </h2>

        {/* Description */}
        <p className="mb-8 text-neutral-600 dark:text-neutral-400">
          У вас недостаточно прав для доступа к этой странице.
          Обратитесь к администратору, если считаете, что это ошибка.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
          >
            <Home className="h-5 w-5" />
            Вернуться на главную
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-6 py-3 font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            <ArrowLeft className="h-5 w-5" />
            Назад
          </button>
        </div>

        {/* Additional info */}
        <div className="mt-12 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            <strong className="text-neutral-900 dark:text-neutral-100">Нужен доступ?</strong>
            <br />
            Свяжитесь с администратором по адресу{' '}
            <a
              href="mailto:admin@kfa.kg"
              className="text-primary-600 underline hover:text-primary-700 dark:text-primary-400"
            >
              admin@kfa.kg
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
