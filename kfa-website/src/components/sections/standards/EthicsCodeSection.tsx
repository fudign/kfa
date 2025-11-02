import { Heart, Scale, Eye, HandshakeIcon, ShieldCheck, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EthicsPrinciple {
  id: number;
  icon: typeof Heart;
  titleKey: string;
  descriptionKey: string;
}

const principles: EthicsPrinciple[] = [
  {
    id: 1,
    icon: Heart,
    titleKey: 'principle1',
    descriptionKey: 'description1',
  },
  {
    id: 2,
    icon: Scale,
    titleKey: 'principle2',
    descriptionKey: 'description2',
  },
  {
    id: 3,
    icon: Eye,
    titleKey: 'principle3',
    descriptionKey: 'description3',
  },
  {
    id: 4,
    icon: HandshakeIcon,
    titleKey: 'principle4',
    descriptionKey: 'description4',
  },
  {
    id: 5,
    icon: ShieldCheck,
    titleKey: 'principle5',
    descriptionKey: 'description5',
  },
  {
    id: 6,
    icon: Users,
    titleKey: 'principle6',
    descriptionKey: 'description6',
  },
];

export function EthicsCodeSection() {
  const { t } = useTranslation('standards');

  return (
    <section className="bg-white py-24 dark:bg-neutral-900">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-display-md text-primary-900 dark:text-primary-100">
            {t('ethics.title')}
          </h2>
          <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            {t('ethics.subtitle')}
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle) => {
            const Icon = principle.icon;
            return (
              <div
                key={principle.id}
                className="group relative overflow-hidden rounded-kfa border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 p-6 transition-all hover:border-primary-300 hover:shadow-kfa-md dark:border-neutral-700 dark:from-neutral-900 dark:to-neutral-800"
              >
                <div className="mb-4 inline-flex rounded-full bg-accent-100 p-3 dark:bg-accent-900/30">
                  <Icon className="h-6 w-6 text-accent-600 dark:text-accent-400" />
                </div>

                <h3 className="mb-3 font-display text-lg font-semibold text-primary-900 dark:text-primary-100">
                  {t(`ethics.${principle.titleKey}.title`)}
                </h3>

                <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {t(`ethics.${principle.descriptionKey}`)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-4 font-semibold text-white shadow-kfa-md transition-all hover:shadow-kfa-lg">
            Скачать полный Кодекс этики
          </button>
        </div>
      </div>
    </section>
  );
}
