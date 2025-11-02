import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';

interface TimelineEvent {
  year: string;
  titleKey: string;
  descriptionKey: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: '2015',
    titleKey: 'event1.title',
    descriptionKey: 'event1.description',
  },
  {
    year: '2017',
    titleKey: 'event2.title',
    descriptionKey: 'event2.description',
  },
  {
    year: '2019',
    titleKey: 'event3.title',
    descriptionKey: 'event3.description',
  },
  {
    year: '2021',
    titleKey: 'event4.title',
    descriptionKey: 'event4.description',
  },
  {
    year: '2023',
    titleKey: 'event5.title',
    descriptionKey: 'event5.description',
  },
  {
    year: '2025',
    titleKey: 'event6.title',
    descriptionKey: 'event6.description',
  },
];

export function HistoryTimeline() {
  const { t } = useTranslation('about');

  return (
    <section id="history" className="bg-white px-4 py-12 dark:bg-neutral-900 md:py-16 lg:py-24">
      <div className="container">
        <div className="mx-auto mb-8 max-w-3xl text-center md:mb-12 lg:mb-16">
          <h2 className="mb-4 font-display text-2xl text-primary-900 dark:text-primary-100 md:mb-6 md:text-3xl lg:text-4xl">
            {t('history.title')}
          </h2>
          <p className="text-base text-neutral-600 dark:text-neutral-400 md:text-lg">
            {t('history.subtitle')}
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 h-full w-0.5 bg-gradient-to-b from-primary-200 via-primary-400 to-primary-600 dark:from-primary-800 dark:via-primary-600 dark:to-primary-400 md:left-8 lg:left-1/2"></div>

          {/* Timeline Events */}
          <div className="space-y-8 md:space-y-12">
            {timelineEvents.map((event, index) => (
              <div
                key={event.year}
                className={`relative flex items-center gap-6 md:gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Year Badge */}
                <div className="absolute left-6 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-primary-600 to-primary-700 font-display text-base font-bold text-white shadow-kfa-lg dark:border-neutral-900 md:left-8 md:h-16 md:w-16 md:text-lg lg:left-1/2">
                  {event.year}
                </div>

                {/* Content Card */}
                <div className={`ml-16 flex-1 md:ml-24 lg:ml-0 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                  <div className="group rounded-kfa border border-neutral-200 bg-white p-4 transition-all hover:border-primary-300 hover:shadow-kfa-lg dark:border-neutral-700 dark:bg-neutral-800 md:p-6">
                    <div className="mb-2 flex items-center gap-2 md:mb-3">
                      <CheckCircle className="h-4 w-4 text-primary-600 dark:text-primary-400 md:h-5 md:w-5" />
                      <h3 className="font-display text-base font-semibold text-primary-900 dark:text-primary-100 md:text-lg lg:text-xl">
                        {t(`history.events.${event.titleKey}`)}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-base">
                      {t(`history.events.${event.descriptionKey}`)}
                    </p>
                  </div>
                </div>

                {/* Empty space for alternating layout */}
                <div className="hidden flex-1 lg:block"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
