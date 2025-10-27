import { useTranslation } from 'react-i18next';
import { Check, Star, Building2 } from 'lucide-react';

interface MembershipType {
  id: string;
  icon: React.ElementType;
  recommended?: boolean;
}

const membershipTypes: MembershipType[] = [
  {
    id: 'full',
    icon: Building2,
    recommended: true,
  },
  {
    id: 'associate',
    icon: Star,
  },
];

export function MembershipTypesSection() {
  const { t } = useTranslation('membership');

  return (
    <section className="bg-white py-24 dark:bg-neutral-900">
      <div className="container">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-6 font-display text-display-lg text-primary-900 dark:text-primary-100">
            {t('types.title')}
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            {t('types.subtitle')}
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          {membershipTypes.map((type) => {
            const Icon = type.icon;
            const benefits = t(`types.${type.id}.benefits`, { returnObjects: true }) as string[];

            return (
              <div
                key={type.id}
                className={`relative overflow-hidden rounded-kfa border-2 bg-white p-8 transition-all hover:shadow-kfa-xl dark:bg-neutral-800 ${
                  type.recommended
                    ? 'border-primary-400 shadow-kfa-lg dark:border-primary-600'
                    : 'border-neutral-200 dark:border-neutral-700'
                }`}
              >
                {type.recommended && (
                  <div className="absolute right-6 top-6 rounded-full bg-accent-600 px-3 py-1 text-xs font-semibold text-white">
                    {t('types.recommended')}
                  </div>
                )}

                <div className="mb-6">
                  <div className={`mb-4 inline-flex rounded-lg p-4 ${
                    type.recommended
                      ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white'
                      : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
                  }`}>
                    <Icon className="h-10 w-10" />
                  </div>
                  <h3 className="mb-2 font-display text-2xl font-bold text-primary-900 dark:text-primary-100">
                    {t(`types.${type.id}.name`)}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {t(`types.${type.id}.description`)}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="mb-4 text-primary-900 dark:text-primary-100">
                    <span className="text-4xl font-bold">
                      {t(`types.${type.id}.price`)}
                    </span>
                    <span className="ml-2 text-neutral-600 dark:text-neutral-400">
                      {t('types.perYear')}
                    </span>
                  </div>
                </div>

                <div className="mb-8 space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        type.recommended ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-600 dark:text-neutral-400'
                      }`} />
                      <span className="text-neutral-700 dark:text-neutral-300">{benefit}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="/membership/join"
                  className={`block w-full rounded-lg py-3 text-center font-semibold transition-all ${
                    type.recommended
                      ? 'bg-primary-600 text-white shadow-kfa-md hover:bg-primary-700 hover:shadow-kfa-lg'
                      : 'border-2 border-neutral-300 text-neutral-700 hover:border-primary-600 hover:text-primary-600 dark:border-neutral-600 dark:text-neutral-300 dark:hover:border-primary-400 dark:hover:text-primary-400'
                  }`}
                >
                  {t('types.choosePlan')}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
