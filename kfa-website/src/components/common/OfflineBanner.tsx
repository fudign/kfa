import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

/**
 * OfflineBanner Component
 *
 * Отображает баннер с уведомлением о статусе подключения к интернету.
 * Автоматически появляется при потере соединения и исчезает при восстановлении.
 */
export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setShowReconnected(true);
        // Hide "reconnected" message after 3 seconds
        setTimeout(() => {
          setShowReconnected(false);
          setWasOffline(false);
        }, 3000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  // Don't show anything if online and never was offline
  if (isOnline && !showReconnected) {
    return null;
  }

  return (
    <div
      className={`fixed left-0 right-0 top-0 z-[100] transition-transform duration-300 ${
        !isOnline || showReconnected ? 'translate-y-0' : '-translate-y-full'
      }`}
      role="alert"
      aria-live="assertive"
    >
      {!isOnline ? (
        // Offline Banner
        <div className="bg-red-600 px-4 py-3 text-white shadow-lg">
          <div className="container mx-auto flex items-center justify-center gap-3">
            <WifiOff className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <p className="text-sm font-medium md:text-base">
              Отсутствует подключение к интернету. Проверьте соединение.
            </p>
          </div>
        </div>
      ) : (
        // Reconnected Banner
        <div className="bg-green-600 px-4 py-3 text-white shadow-lg">
          <div className="container mx-auto flex items-center justify-center gap-3">
            <Wifi className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <p className="text-sm font-medium md:text-base">
              Соединение восстановлено!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
