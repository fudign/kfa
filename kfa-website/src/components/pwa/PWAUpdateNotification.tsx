import { useState } from 'react';
import { RefreshCw, X } from 'lucide-react';

/**
 * PWA Update Notification Component
 *
 * Отображает уведомление о доступном обновлении приложения
 * Позволяет пользователю обновить приложение одним кликом
 */
export function PWAUpdateNotification() {
  const [showUpdate] = useState(false);

  // Temporary: Пока используем упрощенную версию без useRegisterSW
  // В production версии интеграция будет через virtual:pwa-register/react

  if (!showUpdate) {
    return null;
  }

  const handleUpdate = () => {
    window.location.reload();
  };

  const handleDismiss = () => {
    // В production версии здесь будет логика отложенного обновления
    console.log('Обновление отложено');
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[90] animate-slide-up md:bottom-6 md:right-6 md:left-auto md:max-w-md"
      role="alert"
      aria-live="assertive"
      aria-labelledby="update-title"
    >
      <div className="relative overflow-hidden rounded-t-kfa border border-primary-200 bg-gradient-to-br from-primary-50 to-primary-100 shadow-kfa-xl dark:border-primary-800 dark:from-primary-900/90 dark:to-primary-800/90 md:rounded-kfa">
        {/* Анимированная полоса */}
        <div className="h-1 bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600 bg-[length:200%_100%] animate-gradient"></div>

        <div className="p-5 md:p-6">
          {/* Кнопка закрытия */}
          <button
            onClick={handleDismiss}
            className="absolute right-4 top-4 rounded-lg p-1 text-primary-600 transition-colors hover:bg-primary-200 dark:text-primary-300 dark:hover:bg-primary-700"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Иконка с анимацией */}
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg md:h-14 md:w-14">
              <RefreshCw className="h-6 w-6 animate-spin-slow md:h-7 md:w-7" />
            </div>
            <div className="flex-1">
              <h3
                id="update-title"
                className="font-display text-lg font-bold text-primary-900 dark:text-white md:text-xl"
              >
                Доступно обновление
              </h3>
            </div>
          </div>

          {/* Описание */}
          <p className="mb-5 text-sm text-primary-800 dark:text-primary-100 md:text-base">
            Новая версия приложения КФА готова к установке. Обновите для получения последних
            функций и исправлений.
          </p>

          {/* Что нового (опционально) */}
          <div className="mb-5 rounded-lg bg-white/50 p-3 dark:bg-primary-950/50">
            <p className="mb-2 text-xs font-semibold text-primary-900 dark:text-primary-100">
              Что нового:
            </p>
            <ul className="space-y-1 text-xs text-primary-800 dark:text-primary-200">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary-600 dark:text-primary-400">•</span>
                <span>Улучшенная производительность</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary-600 dark:text-primary-400">•</span>
                <span>Исправления ошибок</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary-600 dark:text-primary-400">•</span>
                <span>Новые возможности</span>
              </li>
            </ul>
          </div>

          {/* Кнопки */}
          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              className="flex-1 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 font-semibold text-white shadow-md transition-all hover:from-primary-700 hover:to-primary-800 hover:shadow-lg active:scale-95"
            >
              Обновить сейчас
            </button>
            <button
              onClick={handleDismiss}
              className="rounded-lg border border-primary-300 bg-white/50 px-4 py-3 font-medium text-primary-700 transition-colors hover:bg-white dark:border-primary-600 dark:bg-primary-800/50 dark:text-primary-100 dark:hover:bg-primary-700"
            >
              Позже
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
