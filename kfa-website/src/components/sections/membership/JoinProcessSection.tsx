import { useTranslation } from 'react-i18next';
import { FileText, UserCheck, CreditCard, CheckCircle } from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: FileText,
    key: 'application',
  },
  {
    id: 2,
    icon: UserCheck,
    key: 'review',
  },
  {
    id: 3,
    icon: CreditCard,
    key: 'payment',
  },
  {
    id: 4,
    icon: CheckCircle,
    key: 'confirmation',
  },
];

interface JoinProcessSectionProps {
  scrollToForm?: boolean;
}

export function JoinProcessSection({ scrollToForm = false }: JoinProcessSectionProps) {
  const { t } = useTranslation('membership');

  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (scrollToForm) {
      e.preventDefault();
      const formElement = document.getElementById('application-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section className="bg-gradient-to-b from-neutral-50 to-white py-24 dark:from-neutral-800 dark:to-neutral-900">
      <div className="container">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-6 font-display text-display-lg text-primary-900 dark:text-primary-100">
            {t('process.title')}
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            {t('process.subtitle')}
          </p>
        </div>

        {/* Desktop View */}
        <div className="relative mx-auto hidden max-w-5xl md:block">
          {/* Connecting Line */}
          <div className="absolute left-0 right-0 top-16 h-1 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-600 dark:from-primary-800 dark:via-primary-600 dark:to-primary-400"></div>

          <div className="grid grid-cols-4 gap-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="relative text-center">
                  {/* Icon Circle */}
                  <div className="relative z-10 mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-kfa-lg dark:border-neutral-900">
                    <div>
                      <Icon className="mx-auto mb-2 h-10 w-10" />
                      <div className="text-sm font-semibold">{t('process.step')} {step.id}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="rounded-kfa border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
                    <h3 className="mb-3 font-display text-lg font-semibold text-primary-900 dark:text-primary-100">
                      {t(`process.steps.${step.key}.title`)}
                    </h3>
                    <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {t(`process.steps.${step.key}.description`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile View */}
        <div className="mx-auto max-w-md space-y-8 md:hidden">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="relative">
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-12 top-24 h-full w-1 bg-gradient-to-b from-primary-400 to-primary-600 dark:from-primary-600 dark:to-primary-400"></div>
                )}

                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="relative z-10 flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-kfa-lg dark:border-neutral-900">
                    <div className="text-center">
                      <Icon className="mx-auto mb-1 h-8 w-8" />
                      <div className="text-xs font-semibold">{step.id}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 rounded-kfa border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
                    <h3 className="mb-2 font-display text-lg font-semibold text-primary-900 dark:text-primary-100">
                      {t(`process.steps.${step.key}.title`)}
                    </h3>
                    <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {t(`process.steps.${step.key}.description`)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a
            href={scrollToForm ? '#application-form' : '/membership/join'}
            onClick={handleButtonClick}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-8 py-4 font-semibold text-white shadow-kfa-lg transition-all hover:bg-primary-700 hover:shadow-kfa-xl"
          >
            {t('process.cta')}
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
