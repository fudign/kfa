import { useTranslation } from 'react-i18next';
import { Target, Eye, Heart } from 'lucide-react';

export function MissionSection() {
  const { t } = useTranslation('about');

  return (
    <section id="mission" className="bg-gradient-to-b from-white to-neutral-50 px-4 py-12 dark:from-neutral-900 dark:to-neutral-800 md:py-16 lg:py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-display text-2xl text-primary-900 dark:text-primary-100 md:mb-6 md:text-3xl lg:text-4xl">
            {t('mission.title')}
          </h2>
          <p className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300 md:text-lg">
            {t('mission.description')}
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:mt-12 md:gap-6 md:grid-cols-3 lg:mt-16 lg:gap-8">
          {/* Миссия */}
          <div className="group rounded-kfa border border-neutral-200 bg-white p-5 transition-all hover:border-primary-300 hover:shadow-kfa-lg dark:border-neutral-700 dark:bg-neutral-900 md:p-6 lg:p-8">
            <div className="mb-4 inline-flex rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 p-3 text-white shadow-kfa-md md:mb-6 md:p-4">
              <Target className="h-6 w-6 md:h-8 md:w-8" />
            </div>
            <h3 className="mb-3 font-display text-lg font-semibold text-primary-900 dark:text-primary-100 md:mb-4 md:text-xl">
              {t('mission.mission.title')}
            </h3>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-base">
              {t('mission.mission.text')}
            </p>
          </div>

          {/* Видение */}
          <div className="group rounded-kfa border border-neutral-200 bg-white p-5 transition-all hover:border-primary-300 hover:shadow-kfa-lg dark:border-neutral-700 dark:bg-neutral-900 md:p-6 lg:p-8">
            <div className="mb-4 inline-flex rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 p-3 text-white shadow-kfa-md md:mb-6 md:p-4">
              <Eye className="h-6 w-6 md:h-8 md:w-8" />
            </div>
            <h3 className="mb-3 font-display text-lg font-semibold text-primary-900 dark:text-primary-100 md:mb-4 md:text-xl">
              {t('mission.vision.title')}
            </h3>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-base">
              {t('mission.vision.text')}
            </p>
          </div>

          {/* Ценности */}
          <div className="group rounded-kfa border border-neutral-200 bg-white p-5 transition-all hover:border-primary-300 hover:shadow-kfa-lg dark:border-neutral-700 dark:bg-neutral-900 md:p-6 lg:p-8">
            <div className="mb-4 inline-flex rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 p-3 text-white shadow-kfa-md md:mb-6 md:p-4">
              <Heart className="h-6 w-6 md:h-8 md:w-8" />
            </div>
            <h3 className="mb-3 font-display text-lg font-semibold text-primary-900 dark:text-primary-100 md:mb-4 md:text-xl">
              {t('mission.values.title')}
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400 md:text-base">
              {(t('mission.values.items', { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-600 md:mt-2"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
