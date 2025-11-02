import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import {
  BookOpen,
  Clock,
  CheckCircle,
  PlayCircle,
  Calendar,
  Trophy,
  TrendingUp,
  Users,
} from 'lucide-react';

interface Course {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  duration: string;
  status: 'in-progress' | 'completed' | 'not-started';
  thumbnail?: string;
}

const courses: Course[] = [
  {
    id: 1,
    title: 'CFA Level I - Этика и профессиональные стандарты',
    instructor: 'Анна Петрова',
    progress: 75,
    duration: '12 часов',
    status: 'in-progress',
  },
  {
    id: 2,
    title: 'ESG Инвестирование',
    instructor: 'Максим Иванов',
    progress: 100,
    duration: '8 часов',
    status: 'completed',
  },
  {
    id: 3,
    title: 'Финансовое моделирование в Excel',
    instructor: 'Елена Смирнова',
    progress: 45,
    duration: '16 часов',
    status: 'in-progress',
  },
  {
    id: 4,
    title: 'Управление портфелем ценных бумаг',
    instructor: 'Дмитрий Козлов',
    progress: 0,
    duration: '20 часов',
    status: 'not-started',
  },
];

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: 'webinar' | 'workshop' | 'conference';
  participants?: number;
}

const upcomingEvents: Event[] = [
  {
    id: 1,
    title: 'Регуляторные изменения 2026',
    date: '2025-11-15',
    time: '14:00',
    type: 'webinar',
    participants: 156,
  },
  {
    id: 2,
    title: 'Практический воркшоп: Анализ финансовой отчетности',
    date: '2025-11-20',
    time: '10:00',
    type: 'workshop',
    participants: 45,
  },
  {
    id: 3,
    title: 'Годовая конференция КФА',
    date: '2025-12-20',
    time: '10:00',
    type: 'conference',
    participants: 320,
  },
];

const statusConfig = {
  'in-progress': {
    label: 'В процессе',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    icon: PlayCircle,
  },
  completed: {
    label: 'Завершен',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    icon: CheckCircle,
  },
  'not-started': {
    label: 'Не начат',
    color: 'text-neutral-600 dark:text-neutral-400',
    bgColor: 'bg-neutral-100 dark:bg-neutral-700',
    icon: BookOpen,
  },
};

const eventTypeConfig = {
  webinar: {
    label: 'Вебинар',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  workshop: {
    label: 'Воркшоп',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  conference: {
    label: 'Конференция',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
};

export function EducationPage() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      month: 'short',
      day: 'numeric',
    });
  };

  const completedCourses = courses.filter((c) => c.status === 'completed').length;
  const inProgressCourses = courses.filter((c) => c.status === 'in-progress').length;
  const totalHours = courses
    .filter((c) => c.status === 'completed')
    .reduce((sum, c) => sum + parseInt(c.duration), 0);

  return (
    <DashboardLayout>
      <div className="space-y-5 md:space-y-6">
        {/* Header */}
        <div>
          <h1 className="mb-1 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:mb-2 md:text-3xl">
            Обучение
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 md:text-base">
            Ваш прогресс в обучении и предстоящие события
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 md:gap-6">
          <div className="rounded-kfa border border-neutral-200 bg-white p-4 shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800 md:p-6">
            <div className="mb-3 flex items-center gap-3 md:mb-4">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30 md:p-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 md:h-6 md:w-6" />
              </div>
            </div>
            <div className="mb-1 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:text-3xl">
              {completedCourses}
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">Завершенных курсов</div>
          </div>

          <div className="rounded-kfa border border-neutral-200 bg-white p-4 shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800 md:p-6">
            <div className="mb-3 flex items-center gap-3 md:mb-4">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30 md:p-3">
                <PlayCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 md:h-6 md:w-6" />
              </div>
            </div>
            <div className="mb-1 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:text-3xl">
              {inProgressCourses}
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">В процессе</div>
          </div>

          <div className="rounded-kfa border border-neutral-200 bg-white p-4 shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800 md:p-6">
            <div className="mb-3 flex items-center gap-3 md:mb-4">
              <div className="rounded-full bg-primary-100 p-2 dark:bg-primary-900/30 md:p-3">
                <Clock className="h-5 w-5 text-primary-600 dark:text-primary-400 md:h-6 md:w-6" />
              </div>
            </div>
            <div className="mb-1 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:text-3xl">
              {totalHours}
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">Часов обучения</div>
          </div>

          <div className="rounded-kfa border border-neutral-200 bg-white p-4 shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800 md:p-6">
            <div className="mb-3 flex items-center gap-3 md:mb-4">
              <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900/30 md:p-3">
                <Trophy className="h-5 w-5 text-orange-600 dark:text-orange-400 md:h-6 md:w-6" />
              </div>
            </div>
            <div className="mb-1 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:text-3xl">
              {upcomingEvents.length}
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">События</div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-5 md:gap-6 lg:grid-cols-3">
          {/* My Courses */}
          <div className="lg:col-span-2">
            <div className="rounded-kfa border border-neutral-200 bg-white shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800">
              <div className="border-b border-neutral-200 p-4 dark:border-neutral-700 md:p-6">
                <h2 className="font-display text-lg font-semibold text-primary-900 dark:text-primary-100 md:text-xl">
                  Мои курсы
                </h2>
              </div>
              <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {courses.map((course) => {
                  const config = statusConfig[course.status];
                  const StatusIcon = config.icon;

                  return (
                    <div key={course.id} className="p-4 md:p-6">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="mb-1 text-sm font-semibold text-primary-900 dark:text-primary-100 md:text-base">
                            {course.title}
                          </h3>
                          <p className="mb-2 text-xs text-neutral-600 dark:text-neutral-400">
                            Преподаватель: {course.instructor}
                          </p>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-neutral-500 md:h-4 md:w-4" />
                            <span className="text-xs text-neutral-500 dark:text-neutral-500">{course.duration}</span>
                          </div>
                        </div>
                        <span
                          className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${config.bgColor} ${config.color}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {config.label}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      {course.status !== 'not-started' && (
                        <div className="mb-2">
                          <div className="mb-1 flex items-center justify-between text-xs">
                            <span className="text-neutral-600 dark:text-neutral-400">Прогресс</span>
                            <span className="font-semibold text-primary-900 dark:text-primary-100">
                              {course.progress}%
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                            <div
                              className="h-full rounded-full bg-primary-600 transition-all"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <button
                        className={`mt-3 w-full rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                          course.status === 'not-started'
                            ? 'bg-primary-600 text-white hover:bg-primary-700'
                            : course.status === 'completed'
                              ? 'border border-neutral-200 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700'
                              : 'bg-primary-600 text-white hover:bg-primary-700'
                        }`}
                      >
                        {course.status === 'not-started'
                          ? 'Начать курс'
                          : course.status === 'completed'
                            ? 'Повторить'
                            : 'Продолжить обучение'}
                      </button>
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
                {upcomingEvents.map((event) => {
                  const typeConf = eventTypeConfig[event.type];
                  return (
                    <div key={event.id} className="py-3 md:py-4">
                      <div className="mb-2 flex items-center gap-2">
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${typeConf.bgColor} ${typeConf.color}`}>
                          {typeConf.label}
                        </span>
                      </div>
                      <h3 className="mb-2 text-sm font-semibold text-primary-900 dark:text-primary-100">{event.title}</h3>
                      <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 md:h-4 md:w-4" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                      {event.participants && (
                        <div className="mb-3 flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-500">
                          <Users className="h-3 w-3" />
                          <span>{event.participants} участников</span>
                        </div>
                      )}
                      <button className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700">
                        Зарегистрироваться
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Learning Path */}
        <div className="rounded-kfa border border-neutral-200 bg-white p-4 shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800 md:p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-primary-900 dark:text-primary-100 md:mb-6 md:text-xl">
            Рекомендуемый путь обучения
          </h2>
          <div className="grid gap-3 md:gap-4 lg:grid-cols-3">
            <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
              <div className="mb-3 flex items-center justify-between">
                <BookOpen className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                <span className="text-xs font-semibold text-neutral-500">Шаг 1</span>
              </div>
              <h3 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Основы финансового анализа
              </h3>
              <p className="mb-3 text-xs text-neutral-600 dark:text-neutral-400">
                Изучите фундаментальные принципы анализа
              </p>
              <div className="flex items-center gap-2 text-xs">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600 dark:text-green-400">Рекомендовано</span>
              </div>
            </div>

            <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
              <div className="mb-3 flex items-center justify-between">
                <Trophy className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                <span className="text-xs font-semibold text-neutral-500">Шаг 2</span>
              </div>
              <h3 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">CFA Level I подготовка</h3>
              <p className="mb-3 text-xs text-neutral-600 dark:text-neutral-400">
                Комплексная подготовка к экзамену
              </p>
              <div className="flex items-center gap-2 text-xs">
                <Clock className="h-3 w-3 text-neutral-500" />
                <span className="text-neutral-600 dark:text-neutral-400">После шага 1</span>
              </div>
            </div>

            <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
              <div className="mb-3 flex items-center justify-between">
                <CheckCircle className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                <span className="text-xs font-semibold text-neutral-500">Шаг 3</span>
              </div>
              <h3 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Специализированные курсы
              </h3>
              <p className="mb-3 text-xs text-neutral-600 dark:text-neutral-400">ESG, риск-менеджмент, портфельное управление</p>
              <div className="flex items-center gap-2 text-xs">
                <Clock className="h-3 w-3 text-neutral-500" />
                <span className="text-neutral-600 dark:text-neutral-400">После сертификации</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
