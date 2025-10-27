import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface EducationEvent {
  id: number;
  titleKey: string;
  date: string;
  time: string;
  location: string;
  type: 'webinar' | 'workshop' | 'seminar';
  seats: number;
  seatsAvailable: number;
}

const events: EducationEvent[] = [
  {
    id: 1,
    titleKey: 'event1',
    date: '2025-11-25',
    time: '14:00',
    location: 'online',
    type: 'webinar',
    seats: 100,
    seatsAvailable: 45,
  },
  {
    id: 2,
    titleKey: 'event2',
    date: '2025-12-05',
    time: '10:00',
    location: 'Бишкек',
    type: 'workshop',
    seats: 30,
    seatsAvailable: 12,
  },
  {
    id: 3,
    titleKey: 'event3',
    date: '2025-12-15',
    time: '15:00',
    location: 'online',
    type: 'webinar',
    seats: 150,
    seatsAvailable: 89,
  },
];

const typeColors = {
  webinar: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  workshop: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  seminar: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

const typeLabels = {
  webinar: 'Вебинар',
  workshop: 'Воркшоп',
  seminar: 'Семинар',
};

export function UpcomingEventsSection() {
  const { t } = useTranslation('education');

  return (
    <section className="bg-gradient-to-b from-white to-neutral-50 py-24 dark:from-neutral-900 dark:to-neutral-800">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-display-md text-primary-900 dark:text-primary-100">
            {t('upcomingEvents.title')}
          </h2>
          <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            {t('upcomingEvents.subtitle')}
          </p>
        </div>

        <div className="mt-16 space-y-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="group relative overflow-hidden rounded-kfa border border-neutral-200 bg-white transition-all hover:border-primary-300 hover:shadow-kfa-md dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div className="flex flex-col gap-6 p-8 md:flex-row md:items-center">
                {/* Date Badge */}
                <div className="flex-shrink-0">
                  <div className="flex h-20 w-20 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-kfa-md">
                    <div className="text-2xl font-bold">{new Date(event.date).getDate()}</div>
                    <div className="text-xs font-medium uppercase">
                      {new Date(event.date).toLocaleString('ru-RU', { month: 'short' })}
                    </div>
                  </div>
                </div>

                {/* Event Info */}
                <div className="flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${typeColors[event.type]}`}>
                      {typeLabels[event.type]}
                    </span>
                  </div>

                  <h3 className="mb-3 font-display text-xl font-semibold text-primary-900 dark:text-primary-100">
                    {t(`upcomingEvents.${event.titleKey}.title`)}
                  </h3>

                  <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location === 'online' ? 'Онлайн' : event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>
                        {event.seatsAvailable} из {event.seats} мест доступно
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex-shrink-0">
                  <button className="flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700">
                    Записаться
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/education/calendar"
            className="inline-flex items-center gap-2 rounded-lg border border-primary-600 px-8 py-4 font-semibold text-primary-700 transition-all hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/30"
          >
            <Calendar className="h-5 w-5" />
            Полный календарь событий
          </Link>
        </div>
      </div>
    </section>
  );
}
