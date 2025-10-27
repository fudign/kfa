import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Award, Calendar, FileText, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface StatCard {
  id: number;
  icon: typeof Award;
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
}

const stats: StatCard[] = [
  {
    id: 1,
    icon: Award,
    label: 'Активные сертификаты',
    value: '2',
    change: '+1',
    trend: 'up',
  },
  {
    id: 2,
    icon: Calendar,
    label: 'Предстоящие события',
    value: '3',
  },
  {
    id: 3,
    icon: FileText,
    label: 'Документы',
    value: '12',
  },
  {
    id: 4,
    icon: TrendingUp,
    label: 'Часов обучения',
    value: '48',
    change: '+12',
    trend: 'up',
  },
];

interface Activity {
  id: number;
  type: 'certificate' | 'payment' | 'document' | 'event';
  title: string;
  description: string;
  date: string;
  status: 'success' | 'pending' | 'info';
}

const recentActivity: Activity[] = [
  {
    id: 1,
    type: 'certificate',
    title: 'Профессиональный сертификат получен',
    description: 'Вы успешно сдали экзамен и получили сертификат',
    date: '2 часа назад',
    status: 'success',
  },
  {
    id: 2,
    type: 'payment',
    title: 'Платеж обработан',
    description: 'Годовой взнос 50,000 сом',
    date: '1 день назад',
    status: 'success',
  },
  {
    id: 3,
    type: 'event',
    title: 'Регистрация на вебинар',
    description: 'ESG-инвестирование: тренды и перспективы',
    date: '2 дня назад',
    status: 'info',
  },
  {
    id: 4,
    type: 'document',
    title: 'Документ ожидает подписи',
    description: 'Соглашение о конфиденциальности',
    date: '3 дня назад',
    status: 'pending',
  },
];

interface UpcomingEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  type: 'webinar' | 'exam' | 'conference';
}

const upcomingEvents: UpcomingEvent[] = [
  {
    id: 1,
    title: 'Регуляторные изменения 2026',
    date: '2025-11-15',
    time: '14:00',
    type: 'webinar',
  },
  {
    id: 2,
    title: 'Экзамен: Профессиональный уровень',
    date: '2025-12-01',
    time: '09:00',
    type: 'exam',
  },
  {
    id: 3,
    title: 'Годовая конференция КФА',
    date: '2025-12-20',
    time: '10:00',
    type: 'conference',
  },
];

const typeColors = {
  webinar: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  exam: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  conference: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

const typeLabels = {
  webinar: 'Вебинар',
  exam: 'Экзамен',
  conference: 'Конференция',
};

const statusIcons = {
  success: CheckCircle,
  pending: Clock,
  info: CheckCircle,
};

const statusColors = {
  success: 'text-green-600 dark:text-green-400',
  pending: 'text-orange-600 dark:text-orange-400',
  info: 'text-blue-600 dark:text-blue-400',
};

export function DashboardPage() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 md:space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="mb-1 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:mb-2 md:text-3xl">
            Добро пожаловать, Иван!
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 md:text-base">
            Вот краткий обзор вашей активности в КФА
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="rounded-kfa border border-neutral-200 bg-white p-4 shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800 md:p-6"
              >
                <div className="mb-3 flex items-center justify-between md:mb-4">
                  <div className="rounded-full bg-primary-100 p-2 dark:bg-primary-900/30 md:p-3">
                    <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400 md:h-6 md:w-6" />
                  </div>
                  {stat.change && (
                    <span
                      className={`text-xs font-semibold md:text-sm ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                    >
                      {stat.change}
                    </span>
                  )}
                </div>
                <div className="mb-1 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:text-3xl">
                  {stat.value}
                </div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-5 md:gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="rounded-kfa border border-neutral-200 bg-white shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800">
              <div className="border-b border-neutral-200 p-4 dark:border-neutral-700 md:p-6">
                <h2 className="font-display text-lg font-semibold text-primary-900 dark:text-primary-100 md:text-xl">
                  Последняя активность
                </h2>
              </div>
              <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {recentActivity.map((activity) => {
                  const StatusIcon = statusIcons[activity.status];
                  return (
                    <div key={activity.id} className="flex gap-3 p-4 md:gap-4 md:p-6">
                      <div className={`flex-shrink-0 ${statusColors[activity.status]}`}>
                        <StatusIcon className="h-5 w-5 md:h-6 md:w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="mb-1 text-sm font-semibold text-primary-900 dark:text-primary-100 md:text-base">
                          {activity.title}
                        </h3>
                        <p className="mb-2 text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">{activity.description}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500">{activity.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="rounded-kfa border border-neutral-200 bg-white shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800">
              <div className="border-b border-neutral-200 p-4 dark:border-neutral-700 md:p-6">
                <h2 className="font-display text-lg font-semibold text-primary-900 dark:text-primary-100 md:text-xl">
                  Предстоящие события
                </h2>
              </div>
              <div className="divide-y divide-neutral-200 p-3 dark:divide-neutral-700 md:p-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="py-3 md:py-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${typeColors[event.type]}`}>
                        {typeLabels[event.type]}
                      </span>
                    </div>
                    <h3 className="mb-2 text-sm font-semibold text-primary-900 dark:text-primary-100 md:text-base">{event.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400 md:gap-4 md:text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 md:h-4 md:w-4" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
