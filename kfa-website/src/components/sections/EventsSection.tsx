import { useTranslation } from 'react-i18next';
import { Clock, MapPin, Users, ArrowRight } from 'lucide-react';

interface Event {
  id: number;
  titleKey: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  type: 'webinar' | 'conference' | 'training';
}

const upcomingEvents: Event[] = [
  {
    id: 1,
    titleKey: 'event1.title',
    date: '2025-11-15',
    time: '14:00',
    location: 'online',
    attendees: 45,
    type: 'webinar',
  },
  {
    id: 2,
    titleKey: 'event2.title',
    date: '2025-11-20',
    time: '10:00',
    location: 'Bishkek',
    attendees: 120,
    type: 'conference',
  },
  {
    id: 3,
    titleKey: 'event3.title',
    date: '2025-12-01',
    time: '09:00',
    location: 'online',
    attendees: 60,
    type: 'training',
  },
];

const eventTypeColors = {
  webinar: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  conference: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  training: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export function EventsSection() {
  const { t } = useTranslation('home');

  return (
    <section className="bg-gradient-to-b from-primary-50 to-white py-24 dark:from-neutral-800 dark:to-neutral-900">
      <div className="container">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-display text-display-lg text-primary-900 dark:text-primary-100">
            {t('events.title')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
            {t('events.subtitle')}
          </p>
        </div>

        {/* Events List */}
        <div className="mx-auto max-w-4xl space-y-6">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="group relative overflow-hidden rounded-kfa border border-neutral-200 bg-white p-6 transition-all hover:border-primary-300 hover:shadow-kfa-lg dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-primary-600 md:p-8"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                {/* Left: Date Badge */}
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 text-center">
                    <div className="rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 p-4 text-white shadow-kfa-md dark:from-primary-700 dark:to-primary-800">
                      <div className="text-3xl font-bold">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-sm font-medium uppercase">
                        {new Date(event.date).toLocaleString('ru-RU', { month: 'short' })}
                      </div>
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          eventTypeColors[event.type]
                        }`}
                      >
                        {t(`events.types.${event.type}`)}
                      </span>
                    </div>

                    <h3 className="mb-3 font-display text-xl font-semibold text-primary-900 transition-colors group-hover:text-primary-700 dark:text-primary-100 dark:group-hover:text-primary-300">
                      {t(`events.items.${event.titleKey}`)}
                    </h3>

                    <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{t(`events.locations.${event.location}`)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>
                          {event.attendees} {t('events.attendees')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: CTA */}
                <div className="flex-shrink-0">
                  <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white shadow-kfa-md transition-all hover:bg-primary-700 hover:shadow-kfa-lg dark:bg-primary-700 dark:hover:bg-primary-800 md:w-auto">
                    {t('events.register')}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Events */}
        <div className="mt-12 text-center">
          <a
            href="/events"
            className="inline-flex items-center gap-2 font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {t('events.viewCalendar')}
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
