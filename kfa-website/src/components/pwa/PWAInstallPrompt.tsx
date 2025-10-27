import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

/**
 * PWA Install Prompt Component
 *
 * Отображает промпт для установки PWA приложения
 * Показывается автоматически при поддержке и отсутствии установки
 */
export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Проверяем, было ли приложение уже установлено
    const isInstalled = localStorage.getItem('pwa-installed') === 'true';
    const isDismissed = localStorage.getItem('pwa-prompt-dismissed') === 'true';

    if (isInstalled || isDismissed) {
      return;
    }

    // Слушаем событие beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Предотвращаем стандартный промпт
      e.preventDefault();
      // Сохраняем событие для последующего использования
      setDeferredPrompt(e);
      // Показываем наш кастомный промпт через 3 секунды
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    // Слушаем успешную установку
    const handleAppInstalled = () => {
      localStorage.setItem('pwa-installed', 'true');
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Показываем стандартный промпт установки
    deferredPrompt.prompt();

    // Ждем выбора пользователя
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA установлена');
      localStorage.setItem('pwa-installed', 'true');
    } else {
      console.log('PWA установка отклонена');
    }

    // Очищаем сохраненный промпт
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[90] animate-slide-up md:bottom-6 md:left-6 md:right-auto md:max-w-md"
      role="dialog"
      aria-labelledby="pwa-install-title"
      aria-describedby="pwa-install-description"
    >
      <div className="relative overflow-hidden rounded-t-kfa border border-neutral-200 bg-white shadow-kfa-xl dark:border-neutral-700 dark:bg-neutral-800 md:rounded-kfa">
        {/* Градиентная полоса сверху */}
        <div className="h-1 bg-gradient-to-r from-primary-600 to-accent-600"></div>

        <div className="p-5 md:p-6">
          {/* Кнопка закрытия */}
          <button
            onClick={handleDismiss}
            className="absolute right-4 top-4 rounded-lg p-1 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Иконка */}
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg md:h-14 md:w-14">
              <Download className="h-6 w-6 md:h-7 md:w-7" />
            </div>
            <div className="flex-1">
              <h3
                id="pwa-install-title"
                className="font-display text-lg font-bold text-primary-900 dark:text-primary-100 md:text-xl"
              >
                Установить приложение КФА
              </h3>
            </div>
          </div>

          {/* Описание */}
          <p
            id="pwa-install-description"
            className="mb-5 text-sm text-neutral-600 dark:text-neutral-400 md:text-base"
          >
            Получите быстрый доступ к КФА с главного экрана вашего устройства. Работает даже
            оффлайн!
          </p>

          {/* Преимущества */}
          <ul className="mb-5 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <li className="flex items-center gap-2">
              <span className="text-primary-600 dark:text-primary-400">✓</span>
              <span>Быстрый доступ с главного экрана</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary-600 dark:text-primary-400">✓</span>
              <span>Работает офлайн</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary-600 dark:text-primary-400">✓</span>
              <span>Уведомления о новостях и событиях</span>
            </li>
          </ul>

          {/* Кнопки */}
          <div className="flex gap-3">
            <button
              onClick={handleInstall}
              className="flex-1 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 font-semibold text-white shadow-md transition-all hover:from-primary-700 hover:to-primary-800 hover:shadow-lg active:scale-95"
            >
              Установить
            </button>
            <button
              onClick={handleDismiss}
              className="rounded-lg border border-neutral-300 px-4 py-3 font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              Позже
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
