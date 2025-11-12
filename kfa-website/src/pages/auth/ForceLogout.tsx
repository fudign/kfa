import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

/**
 * Force Logout Page - Автоматически очищает токен и перенаправляет на логин
 *
 * Используется когда нужно обновить права доступа пользователя
 */
export function ForceLogoutPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Очистить все токены и данные
        localStorage.clear();
        sessionStorage.clear();

        // Вызвать logout из store
        await logout();

        // Небольшая задержка для отображения сообщения
        setTimeout(() => {
          // Перенаправить на логин с сообщением
          navigate('/auth/login?message=permissions_updated', { replace: true });
        }, 1500);
      } catch (error) {
        console.error('Logout error:', error);
        // В любом случае перенаправить на логин
        navigate('/auth/login', { replace: true });
      }
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-primary-600 dark:text-primary-400 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <div className="absolute inset-0 bg-primary-400 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Обновление прав доступа
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Пожалуйста, подождите...
            </p>
          </div>

          {/* Description */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-left">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Что происходит?</strong>
            </p>
            <ul className="mt-2 text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Очищаем старый токен</li>
              <li>Обновляем права доступа</li>
              <li>Перенаправляем на страницу входа</li>
            </ul>
          </div>

          {/* Info */}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Это займет всего несколько секунд
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForceLogoutPage;
