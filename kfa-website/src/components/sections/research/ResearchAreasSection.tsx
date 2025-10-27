import { Target, Shield, TrendingUp, Users, Globe, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ResearchArea {
  id: number;
  icon: typeof Target;
  titleKey: string;
  descriptionKey: string;
  publicationsCount: number;
}

const areas: ResearchArea[] = [
  {
    id: 1,
    icon: TrendingUp,
    titleKey: 'area1',
    descriptionKey: 'description1',
    publicationsCount: 15,
  },
  {
    id: 2,
    icon: Shield,
    titleKey: 'area2',
    descriptionKey: 'description2',
    publicationsCount: 12,
  },
  {
    id: 3,
    icon: Users,
    titleKey: 'area3',
    descriptionKey: 'description3',
    publicationsCount: 10,
  },
  {
    id: 4,
    icon: Globe,
    titleKey: 'area4',
    descriptionKey: 'description4',
    publicationsCount: 8,
  },
  {
    id: 5,
    icon: Sparkles,
    titleKey: 'area5',
    descriptionKey: 'description5',
    publicationsCount: 6,
  },
  {
    id: 6,
    icon: Target,
    titleKey: 'area6',
    descriptionKey: 'description6',
    publicationsCount: 7,
  },
];

export function ResearchAreasSection() {
  const { t } = useTranslation('research');

  return (
    <section className="bg-gradient-to-b from-white to-neutral-50 py-24 dark:from-neutral-900 dark:to-neutral-800">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-display-md text-primary-900 dark:text-primary-100">
            {t('researchAreas.title')}
          </h2>
          <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            {t('researchAreas.subtitle')}
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => {
            const Icon = area.icon;
            return (
              <div
                key={area.id}
                className="group relative overflow-hidden rounded-kfa border border-neutral-200 bg-white p-8 transition-all hover:border-primary-300 hover:shadow-kfa-lg dark:border-neutral-700 dark:bg-neutral-900"
              >
                <div className="mb-6 inline-flex rounded-full bg-gradient-to-br from-primary-100 to-primary-50 p-4 dark:from-primary-900/30 dark:to-primary-800/30">
                  <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>

                <h3 className="mb-3 font-display text-xl font-semibold text-primary-900 dark:text-primary-100">
                  {t(`researchAreas.${area.titleKey}.title`)}
                </h3>

                <p className="mb-6 leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {t(`researchAreas.${area.descriptionKey}`)}
                </p>

                <div className="flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-700">
                  <div className="text-sm text-neutral-500 dark:text-neutral-500">Публикаций:</div>
                  <div className="rounded-full bg-primary-100 px-3 py-1 font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                    {area.publicationsCount}
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
