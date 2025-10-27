import { useAuthStore } from '@/stores/authStore';
import { Users, FileText, Settings, BarChart3, Shield, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export function AdminDashboardPage() {
  const user = useAuthStore((state) => state.user);

  const stats = [
    {
      id: 1,
      icon: Users,
      label: 'Всего пользователей',
      value: '342',
      change: '+12%',
      trend: 'up',
    },
    {
      id: 2,
      icon: FileText,
      label: 'Активные заявки',
      value: '28',
      change: '+5',
      trend: 'up',
    },
    {
      id: 3,
      icon: Shield,
      label: 'Члены КФА',
      value: '156',
      change: '+8%',
      trend: 'up',
    },
    {
      id: 4,
      icon: BarChart3,
      label: 'Сертификации',
      value: '89',
      change: '+15%',
      trend: 'up',
    },
  ];

  const recentActions = [
    { id: 1, user: 'Иван Петров', action: 'Подал заявку на членство', time: '10 мин назад' },
    { id: 2, user: 'Мария Сидорова', action: 'Завершила сертификацию CFA', time: '1 час назад' },
    { id: 3, user: 'Алексей Козлов', action: 'Обновил профиль', time: '2 часа назад' },
    { id: 4, user: 'Елена Иванова', action: 'Оплатила членский взнос', time: '3 часа назад' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
          <div>
            <h1 className="mb-1 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:mb-2 md:text-3xl">
              Панель администратора
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 md:text-base">
              Добро пожаловать, {user?.name}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 md:px-4 md:py-2 md:text-sm">
              Admin
            </span>
          </div>
        </div>
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="rounded-kfa border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800 md:p-6"
              >
                <div className="mb-3 flex items-center justify-between md:mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30 md:h-12 md:w-12">
                    <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400 md:h-6 md:w-6" />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-600 md:text-sm">
                    <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
                    {stat.change}
                  </span>
                </div>
                <p className="mb-1 text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">{stat.label}</p>
                <p className="font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:text-3xl">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid gap-5 md:gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <div className="rounded-kfa border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800 md:p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-primary-900 dark:text-primary-100 md:mb-6 md:text-xl">
              Последние действия
            </h2>
            <div className="space-y-3 md:space-y-4">
              {recentActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-start gap-3 rounded-lg border border-neutral-100 p-3 dark:border-neutral-700 md:gap-4 md:p-4"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 md:h-10 md:w-10">
                    <Users className="h-4 w-4 text-primary-600 dark:text-primary-400 md:h-5 md:w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100 md:text-base">
                      {action.user}
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">{action.action}</p>
                    <p className="mt-1 text-xs text-neutral-500">{action.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-kfa border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800 md:p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-primary-900 dark:text-primary-100 md:mb-6 md:text-xl">
              Быстрые действия
            </h2>
            <div className="grid gap-3 md:gap-4">
              <button className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3 text-left transition-all hover:border-primary-300 hover:bg-primary-50 dark:border-neutral-700 dark:hover:border-primary-700 dark:hover:bg-primary-900/10 md:p-4">
                <Users className="h-5 w-5 flex-shrink-0 text-primary-600" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 md:text-base">
                    Управление пользователями
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">
                    Просмотр и редактирование профилей
                  </p>
                </div>
              </button>

              <button className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3 text-left transition-all hover:border-primary-300 hover:bg-primary-50 dark:border-neutral-700 dark:hover:border-primary-700 dark:hover:bg-primary-900/10 md:p-4">
                <FileText className="h-5 w-5 flex-shrink-0 text-primary-600" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 md:text-base">
                    Обработка заявок
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">
                    Рассмотрение заявок на членство
                  </p>
                </div>
              </button>

              <button className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3 text-left transition-all hover:border-primary-300 hover:bg-primary-50 dark:border-neutral-700 dark:hover:border-primary-700 dark:hover:bg-primary-900/10 md:p-4">
                <Settings className="h-5 w-5 flex-shrink-0 text-primary-600" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 md:text-base">Настройки системы</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">
                    Конфигурация и параметры
                  </p>
                </div>
              </button>

              <button className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3 text-left transition-all hover:border-primary-300 hover:bg-primary-50 dark:border-neutral-700 dark:hover:border-primary-700 dark:hover:bg-primary-900/10 md:p-4">
                <BarChart3 className="h-5 w-5 flex-shrink-0 text-primary-600" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 md:text-base">
                    Отчеты и аналитика
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">
                    Статистика и метрики
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
