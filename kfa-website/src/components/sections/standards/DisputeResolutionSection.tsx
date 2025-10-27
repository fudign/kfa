import { MessageSquare, FileText, Scale, CheckCircle2, Clock, AlertTriangle, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ResolutionStep {
  id: number;
  icon: typeof MessageSquare;
  titleKey: string;
  descriptionKey: string;
  timeframe: string;
}

const steps: ResolutionStep[] = [
  {
    id: 1,
    icon: MessageSquare,
    titleKey: 'step1',
    descriptionKey: 'description1',
    timeframe: '1-3 дня',
  },
  {
    id: 2,
    icon: FileText,
    titleKey: 'step2',
    descriptionKey: 'description2',
    timeframe: '5-7 дней',
  },
  {
    id: 3,
    icon: Scale,
    titleKey: 'step3',
    descriptionKey: 'description3',
    timeframe: '10-14 дней',
  },
  {
    id: 4,
    icon: CheckCircle2,
    titleKey: 'step4',
    descriptionKey: 'description4',
    timeframe: '3-5 дней',
  },
];

const disputeTypes = [
  {
    id: 1,
    icon: AlertTriangle,
    titleKey: 'type1',
    descriptionKey: 'typeDescription1',
  },
  {
    id: 2,
    icon: Users,
    titleKey: 'type2',
    descriptionKey: 'typeDescription2',
  },
  {
    id: 3,
    icon: FileText,
    titleKey: 'type3',
    descriptionKey: 'typeDescription3',
  },
];

export function DisputeResolutionSection() {
  const { t } = useTranslation('standards');

  return (
    <section className="bg-white py-24 dark:bg-neutral-900">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-display-md text-primary-900 dark:text-primary-100">
            {t('dispute.title')}
          </h2>
          <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            {t('dispute.subtitle')}
          </p>
        </div>

        {/* Dispute Types */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {disputeTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div
                key={type.id}
                className="rounded-kfa border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800"
              >
                <div className="mb-4 inline-flex rounded-full bg-accent-100 p-3 dark:bg-accent-900/30">
                  <Icon className="h-6 w-6 text-accent-600 dark:text-accent-400" />
                </div>
                <h3 className="mb-2 font-semibold text-primary-900 dark:text-primary-100">
                  {t(`dispute.${type.titleKey}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {t(`dispute.${type.descriptionKey}`)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Resolution Process */}
        <div className="mt-16">
          <h3 className="mb-8 text-center font-display text-2xl font-semibold text-primary-900 dark:text-primary-100">
            {t('dispute.processTitle')}
          </h3>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 hidden h-full w-0.5 bg-gradient-to-b from-primary-200 via-primary-400 to-primary-600 md:block"></div>

            <div className="space-y-8">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.id} className="relative flex gap-6">
                    {/* Timeline Node */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-700 shadow-kfa-md">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 rounded-kfa border border-neutral-200 bg-white p-6 shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-900">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="font-display text-xl font-semibold text-primary-900 dark:text-primary-100">
                          {t(`dispute.${step.titleKey}.title`)}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-500">
                          <Clock className="h-4 w-4" />
                          <span>{step.timeframe}</span>
                        </div>
                      </div>
                      <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {t(`dispute.${step.descriptionKey}`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 rounded-kfa border-2 border-primary-200 bg-primary-50 p-8 text-center dark:border-primary-800 dark:bg-primary-900/20">
          <h3 className="mb-4 font-display text-xl font-semibold text-primary-900 dark:text-primary-100">
            {t('dispute.contactTitle')}
          </h3>
          <p className="mb-6 leading-relaxed text-neutral-600 dark:text-neutral-400">
            {t('dispute.contactDescription')}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
            <a
              href="mailto:disputes@kfa.kg"
              className="rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
            >
              disputes@kfa.kg
            </a>
            <span className="text-neutral-400">или</span>
            <a
              href="tel:+996312123456"
              className="rounded-lg border border-primary-600 px-6 py-3 font-semibold text-primary-700 transition-colors hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/30"
            >
              +996 (312) 12-34-56
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
