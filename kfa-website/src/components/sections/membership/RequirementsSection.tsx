import { useTranslation } from 'react-i18next';
import { Shield, FileCheck, Users, TrendingUp } from 'lucide-react';

const requirementCategories = [
  {
    id: 'legal',
    icon: Shield,
  },
  {
    id: 'professional',
    icon: FileCheck,
  },
  {
    id: 'organizational',
    icon: Users,
  },
  {
    id: 'financial',
    icon: TrendingUp,
  },
];

export function RequirementsSection() {
  const { t } = useTranslation('membership');

  return (
    <section className="bg-white py-24 dark:bg-neutral-900">
      <div className="container">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-6 font-display text-display-lg text-primary-900 dark:text-primary-100">
            {t('requirements.title')}
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            {t('requirements.subtitle')}
          </p>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            {requirementCategories.map((category) => {
              const Icon = category.icon;
              const requirements = t(`requirements.categories.${category.id}.items`, {
                returnObjects: true,
              }) as string[];

              return (
                <div
                  key={category.id}
                  className="rounded-kfa border border-neutral-200 bg-white p-8 transition-all hover:border-primary-300 hover:shadow-kfa-lg dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-kfa-md">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-primary-900 dark:text-primary-100">
                      {t(`requirements.categories.${category.id}.title`)}
                    </h3>
                  </div>

                  <ul className="space-y-3">
                    {requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary-600 dark:bg-primary-400"></span>
                        <span className="text-neutral-700 dark:text-neutral-300">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Additional Info */}
          <div className="mt-12 rounded-kfa border-2 border-accent-200 bg-accent-50 p-8 dark:border-accent-800 dark:bg-accent-900/20">
            <h4 className="mb-4 font-display text-lg font-semibold text-accent-900 dark:text-accent-200">
              {t('requirements.note.title')}
            </h4>
            <p className="leading-relaxed text-accent-800 dark:text-accent-300">
              {t('requirements.note.text')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
