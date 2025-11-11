import { useTranslation } from 'react-i18next';
import { CheckCircle, Users, GraduationCap, Shield, BarChart, Handshake, Bell, ArrowRight } from 'lucide-react';

interface Benefit {
  icon: React.ElementType;
  key: string;
}

const benefits: Benefit[] = [
  {
    icon: Shield,
    key: 'regulation',
  },
  {
    icon: GraduationCap,
    key: 'education',
  },
  {
    icon: Users,
    key: 'networking',
  },
  {
    icon: Handshake,
    key: 'representation',
  },
  {
    icon: BarChart,
    key: 'analytics',
  },
  {
    icon: CheckCircle,
    key: 'workgroups',
  },
  {
    icon: Bell,
    key: 'information',
  },
];

export function MembershipBenefitsSection() {
  const { t } = useTranslation('home');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 py-24 dark:from-neutral-900 dark:to-neutral-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
      </div>

      <div className="container relative">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-6 font-display text-display-lg text-white dark:text-neutral-50">
            {t('benefits.title')}
          </h2>
          <p className="text-lg leading-relaxed text-primary-50 dark:text-neutral-300">
            {t('benefits.description')}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.key}
                  className="group relative overflow-hidden rounded-kfa border border-primary-400/30 bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20 hover:shadow-kfa-lg dark:border-neutral-600/30 dark:bg-neutral-700/30 dark:hover:bg-neutral-700/50"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-white p-3 text-primary-700 shadow-kfa-md dark:bg-neutral-700 dark:text-accent-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 font-display text-lg font-semibold text-white dark:text-neutral-100">
                    {t(`benefits.items.${benefit.key}.title`)}
                  </h3>
                  <p className="leading-relaxed text-primary-50 dark:text-neutral-300">
                    {t(`benefits.items.${benefit.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a
            href="/membership"
            className="inline-flex items-center gap-2 rounded-lg bg-accent-600 px-8 py-4 font-semibold text-white shadow-kfa-lg transition-all hover:bg-accent-700 hover:shadow-kfa-xl dark:bg-accent-700 dark:hover:bg-accent-800"
          >
            {t('benefits.cta')}
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
