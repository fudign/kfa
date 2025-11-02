import { useTranslation } from 'react-i18next';
import { Target, Users, TrendingUp, Award, Shield, Globe } from 'lucide-react';

const features = [
  {
    icon: Shield,
    key: 'regulation',
  },
  {
    icon: Award,
    key: 'certification',
  },
  {
    icon: Users,
    key: 'representation',
  },
  {
    icon: TrendingUp,
    key: 'innovation',
  },
  {
    icon: Target,
    key: 'research',
  },
  {
    icon: Globe,
    key: 'international',
  },
];

export function AboutSection() {
  const { t } = useTranslation('home');

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-neutral-50 to-white py-24">
      <div className="container">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-6 font-display text-display-lg text-primary-900">
            {t('about.title')}
          </h2>
          <p className="text-lg leading-relaxed text-neutral-700">
            {t('about.description')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.key}
                className="group relative rounded-kfa border border-neutral-200 bg-white p-8 transition-all hover:border-primary-300 hover:shadow-kfa-lg"
              >
                <div className="mb-6 inline-flex rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 p-3 text-white shadow-kfa-md">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 font-display text-xl font-semibold text-primary-900">
                  {t(`about.features.${feature.key}.title`)}
                </h3>
                <p className="leading-relaxed text-neutral-600">
                  {t(`about.features.${feature.key}.description`)}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a
            href="/about"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-8 py-4 font-semibold text-white shadow-kfa-md transition-all hover:bg-primary-700 hover:shadow-kfa-lg"
          >
            {t('about.cta')}
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
