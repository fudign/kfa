import { CheckCircle, ClipboardCheck, BarChart3, FileSearch, AlertCircle, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface QualityProcess {
  id: number;
  icon: typeof CheckCircle;
  titleKey: string;
  descriptionKey: string;
  frequency: string;
}

const processes: QualityProcess[] = [
  {
    id: 1,
    icon: ClipboardCheck,
    titleKey: 'process1',
    descriptionKey: 'description1',
    frequency: 'Ежеквартально',
  },
  {
    id: 2,
    icon: FileSearch,
    titleKey: 'process2',
    descriptionKey: 'description2',
    frequency: 'Ежегодно',
  },
  {
    id: 3,
    icon: BarChart3,
    titleKey: 'process3',
    descriptionKey: 'description3',
    frequency: 'Ежемесячно',
  },
  {
    id: 4,
    icon: AlertCircle,
    titleKey: 'process4',
    descriptionKey: 'description4',
    frequency: 'По запросу',
  },
  {
    id: 5,
    icon: TrendingUp,
    titleKey: 'process5',
    descriptionKey: 'description5',
    frequency: 'Ежегодно',
  },
  {
    id: 6,
    icon: CheckCircle,
    titleKey: 'process6',
    descriptionKey: 'description6',
    frequency: 'Постоянно',
  },
];

export function QualityControlSection() {
  const { t } = useTranslation('standards');

  return (
    <section className="bg-gradient-to-b from-white to-neutral-50 py-24 dark:from-neutral-900 dark:to-neutral-800">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-display-md text-primary-900 dark:text-primary-100">
            {t('quality.title')}
          </h2>
          <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            {t('quality.subtitle')}
          </p>
        </div>

        <div className="mt-16 space-y-6">
          {processes.map((process, index) => {
            const Icon = process.icon;
            return (
              <div
                key={process.id}
                className="group relative overflow-hidden rounded-kfa border border-neutral-200 bg-white transition-all hover:border-primary-300 hover:shadow-kfa-md dark:border-neutral-700 dark:bg-neutral-900"
              >
                <div className="flex flex-col gap-6 p-8 md:flex-row md:items-center">
                  {/* Number Badge */}
                  <div className="flex-shrink-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-2xl font-bold text-white shadow-kfa-md">
                      {index + 1}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="inline-flex rounded-full bg-primary-100 p-4 dark:bg-primary-900/30">
                      <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="mb-2 font-display text-xl font-semibold text-primary-900 dark:text-primary-100">
                      {t(`quality.${process.titleKey}.title`)}
                    </h3>
                    <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {t(`quality.${process.descriptionKey}`)}
                    </p>
                  </div>

                  {/* Frequency */}
                  <div className="flex-shrink-0">
                    <div className="rounded-full bg-accent-100 px-4 py-2 text-sm font-semibold text-accent-700 dark:bg-accent-900/30 dark:text-accent-400">
                      {process.frequency}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
