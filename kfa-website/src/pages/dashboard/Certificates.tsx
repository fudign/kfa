import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Award, Calendar, Download, ExternalLink, Trophy, Star, CheckCircle } from 'lucide-react';

interface Certificate {
  id: number;
  title: string;
  level: 'basic' | 'professional' | 'expert';
  issueDate: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'pending';
  credentialId: string;
  image?: string;
}

const certificates: Certificate[] = [
  {
    id: 1,
    title: 'CFA Level I',
    level: 'professional',
    issueDate: '2025-02-20',
    expiryDate: '2028-02-20',
    status: 'active',
    credentialId: 'CFA-2025-001-LVL1',
  },
  {
    id: 2,
    title: 'Профессиональная этика',
    level: 'basic',
    issueDate: '2025-01-15',
    status: 'active',
    credentialId: 'ETH-2025-042',
  },
  {
    id: 3,
    title: 'ESG Инвестирование',
    level: 'professional',
    issueDate: '2024-11-10',
    expiryDate: '2027-11-10',
    status: 'active',
    credentialId: 'ESG-2024-156',
  },
  {
    id: 4,
    title: 'CFA Level II',
    level: 'expert',
    issueDate: '',
    status: 'pending',
    credentialId: 'Регистрация на экзамен',
  },
];

const levelConfig = {
  basic: {
    label: 'Базовый',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    icon: Star,
  },
  professional: {
    label: 'Профессиональный',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    icon: Award,
  },
  expert: {
    label: 'Экспертный',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    icon: Trophy,
  },
};

const statusConfig = {
  active: {
    label: 'Активен',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  expired: {
    label: 'Истек',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
  pending: {
    label: 'В процессе',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
};

export function CertificatesPage() {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'В процессе';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const activeCerts = certificates.filter((c) => c.status === 'active').length;
  const pendingCerts = certificates.filter((c) => c.status === 'pending').length;

  return (
    <DashboardLayout>
      <div className="space-y-5 md:space-y-6">
        {/* Header */}
        <div>
          <h1 className="mb-1 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:mb-2 md:text-3xl">
            Сертификаты
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 md:text-base">
            Ваши профессиональные сертификаты и достижения
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          <div className="rounded-kfa border border-neutral-200 bg-white p-4 shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800 md:p-6">
            <div className="mb-3 flex items-center gap-3 md:mb-4">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30 md:p-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 md:h-6 md:w-6" />
              </div>
            </div>
            <div className="mb-1 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:text-3xl">
              {activeCerts}
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">Активных сертификатов</div>
          </div>

          <div className="rounded-kfa border border-neutral-200 bg-white p-4 shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800 md:p-6">
            <div className="mb-3 flex items-center gap-3 md:mb-4">
              <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900/30 md:p-3">
                <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400 md:h-6 md:w-6" />
              </div>
            </div>
            <div className="mb-1 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:text-3xl">
              {pendingCerts}
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">В процессе получения</div>
          </div>

          <div className="rounded-kfa border border-neutral-200 bg-white p-4 shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800 md:p-6">
            <div className="mb-3 flex items-center gap-3 md:mb-4">
              <div className="rounded-full bg-primary-100 p-2 dark:bg-primary-900/30 md:p-3">
                <Award className="h-5 w-5 text-primary-600 dark:text-primary-400 md:h-6 md:w-6" />
              </div>
            </div>
            <div className="mb-1 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:text-3xl">
              {certificates.length}
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">Всего сертификатов</div>
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
          {certificates.map((cert) => {
            const levelConf = levelConfig[cert.level];
            const statusConf = statusConfig[cert.status];
            const LevelIcon = levelConf.icon;

            return (
              <div
                key={cert.id}
                className="rounded-kfa border border-neutral-200 bg-white p-4 shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800 md:p-6"
              >
                {/* Header */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className={`rounded-full p-3 ${levelConf.bgColor}`}>
                    <LevelIcon className={`h-6 w-6 ${levelConf.color} md:h-8 md:w-8`} />
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusConf.bgColor} ${statusConf.color}`}
                  >
                    {statusConf.label}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mb-2 font-display text-lg font-bold text-primary-900 dark:text-primary-100 md:text-xl">
                  {cert.title}
                </h3>

                {/* Level Badge */}
                <span
                  className={`mb-4 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${levelConf.bgColor} ${levelConf.color}`}
                >
                  {levelConf.label}
                </span>

                {/* Details */}
                <div className="mb-4 space-y-2 border-t border-neutral-200 pt-4 dark:border-neutral-700">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-neutral-500" />
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Выдан: {formatDate(cert.issueDate)}
                    </span>
                  </div>
                  {cert.expiryDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-neutral-500" />
                      <span className="text-neutral-600 dark:text-neutral-400">
                        Действителен до: {formatDate(cert.expiryDate)}
                      </span>
                    </div>
                  )}
                  <div className="text-xs text-neutral-500 dark:text-neutral-500">ID: {cert.credentialId}</div>
                </div>

                {/* Actions */}
                {cert.status === 'active' && (
                  <div className="flex gap-2">
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700">
                      <Download className="h-4 w-4" />
                      Скачать
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700">
                      <ExternalLink className="h-4 w-4" />
                      Проверить
                    </button>
                  </div>
                )}
                {cert.status === 'pending' && (
                  <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 transition-colors hover:bg-orange-100 dark:border-orange-900/30 dark:bg-orange-900/10 dark:text-orange-400 dark:hover:bg-orange-900/20">
                    <Calendar className="h-4 w-4" />
                    Зарегистрироваться на экзамен
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Available Certifications */}
        <div className="rounded-kfa border border-neutral-200 bg-white p-4 shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800 md:p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-primary-900 dark:text-primary-100 md:mb-6 md:text-xl">
            Доступные сертификации
          </h2>
          <div className="grid gap-3 md:gap-4 lg:grid-cols-3">
            <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
              <Award className="mb-3 h-8 w-8 text-primary-600 dark:text-primary-400" />
              <h3 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">CFA Level II</h3>
              <p className="mb-3 text-xs text-neutral-600 dark:text-neutral-400">
                Продвинутый уровень программы CFA
              </p>
              <button className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700">
                Подробнее
              </button>
            </div>

            <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
              <Star className="mb-3 h-8 w-8 text-primary-600 dark:text-primary-400" />
              <h3 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Финансовое моделирование
              </h3>
              <p className="mb-3 text-xs text-neutral-600 dark:text-neutral-400">
                Практические навыки моделирования
              </p>
              <button className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700">
                Подробнее
              </button>
            </div>

            <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
              <Trophy className="mb-3 h-8 w-8 text-primary-600 dark:text-primary-400" />
              <h3 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Риск-менеджмент</h3>
              <p className="mb-3 text-xs text-neutral-600 dark:text-neutral-400">
                Управление финансовыми рисками
              </p>
              <button className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700">
                Подробнее
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
