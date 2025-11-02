import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MarketIndicator {
  id: number;
  titleKey: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: typeof TrendingUp;
}

const indicators: MarketIndicator[] = [
  {
    id: 1,
    titleKey: 'indicator1',
    value: '45.8 млрд сом',
    change: 23.4,
    trend: 'up',
    icon: DollarSign,
  },
  {
    id: 2,
    titleKey: 'indicator2',
    value: '127',
    change: 12.5,
    trend: 'up',
    icon: BarChart3,
  },
  {
    id: 3,
    titleKey: 'indicator3',
    value: '34,500',
    change: 18.2,
    trend: 'up',
    icon: Users,
  },
  {
    id: 4,
    titleKey: 'indicator4',
    value: '1,245 сом',
    change: 5.8,
    trend: 'up',
    icon: Activity,
  },
];

export function MarketDataSection() {
  const { t } = useTranslation('research');

  return (
    <section className="bg-white py-24 dark:bg-neutral-900">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-display-md text-primary-900 dark:text-primary-100">
            {t('marketData.title')}
          </h2>
          <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            {t('marketData.subtitle')}
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {indicators.map((indicator) => {
            const Icon = indicator.icon;
            const TrendIcon = indicator.trend === 'up' ? TrendingUp : TrendingDown;
            const trendColor =
              indicator.trend === 'up'
                ? 'text-green-600 dark:text-green-400'
                : indicator.trend === 'down'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-neutral-600 dark:text-neutral-400';

            return (
              <div
                key={indicator.id}
                className="group rounded-kfa border border-neutral-200 bg-gradient-to-b from-white to-neutral-50 p-6 transition-all hover:border-primary-300 hover:shadow-kfa-md dark:border-neutral-700 dark:from-neutral-900 dark:to-neutral-800"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-full bg-primary-100 p-3 dark:bg-primary-900/30">
                    <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  {indicator.trend !== 'stable' && (
                    <div className={`flex items-center gap-1 text-sm font-semibold ${trendColor}`}>
                      <TrendIcon className="h-4 w-4" />
                      <span>{indicator.change > 0 ? '+' : ''}{indicator.change}%</span>
                    </div>
                  )}
                </div>

                <div className="mb-2 font-display text-3xl font-bold text-primary-900 dark:text-primary-100">
                  {indicator.value}
                </div>

                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  {t(`marketData.${indicator.titleKey}.title`)}
                </div>

                <div className="mt-4 text-xs text-neutral-500 dark:text-neutral-500">
                  По данным за III квартал 2025
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart Placeholder */}
        <div className="mt-12 overflow-hidden rounded-kfa border border-neutral-200 bg-gradient-to-b from-white to-neutral-50 p-8 dark:border-neutral-700 dark:from-neutral-900 dark:to-neutral-800">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl font-semibold text-primary-900 dark:text-primary-100">
                Динамика объема торгов
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">2024-2025 гг.</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700">
                Квартальная
              </button>
              <button className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800">
                Годовая
              </button>
            </div>
          </div>

          {/* Placeholder for chart */}
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
            <div className="text-center">
              <BarChart3 className="mx-auto mb-2 h-12 w-12 text-neutral-400" />
              <p className="text-neutral-600 dark:text-neutral-400">График будет добавлен позже</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
