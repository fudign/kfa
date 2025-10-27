import { useState } from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  type: 'webinar' | 'conference' | 'training';
  description: string;
  status: 'upcoming' | 'ongoing' | 'past';
}

const events: Event[] = [
  {
    id: 1,
    title: 'Регуляторные изменения 2026: что нужно знать',
    date: '2025-11-15',
    time: '14:00',
    location: 'online',
    attendees: 45,
    type: 'webinar',
    description: 'Детальный разбор новых требований НБКР к профессиональным участникам рынка ценных бумаг',
    status: 'upcoming',
  },
  {
    id: 2,
    title: 'Годовая конференция КФА',
    date: '2025-11-20',
    time: '10:00',
    location: 'Бишкек',
    attendees: 120,
    type: 'conference',
    description: 'Главное событие года: итоги работы, перспективы развития, нетворкинг',
    status: 'upcoming',
  },
  {
    id: 3,
    title: 'Курс подготовки к аттестации специалистов',
    date: '2025-12-01',
    time: '09:00',
    location: 'online',
    attendees: 60,
    type: 'training',
    description: 'Интенсивный курс для подготовки к экзамену на сертификат КФА',
    status: 'upcoming',
  },
  {
    id: 4,
    title: 'ESG-инвестирование: практический опыт',
    date: '2025-12-10',
    time: '15:00',
    location: 'online',
    attendees: 80,
    type: 'webinar',
    description: 'Как интегрировать принципы ESG в инвестиционную стратегию',
    status: 'upcoming',
  },
  {
    id: 5,
    title: 'Мастер-класс по риск-менеджменту',
    date: '2025-12-15',
    time: '10:00',
    location: 'Бишкек',
    attendees: 35,
    type: 'training',
    description: 'Современные подходы к управлению рисками на финансовых рынках',
    status: 'upcoming',
  },
];

const eventTypeColors = {
  webinar: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  conference: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  training: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const eventTypeLabels = {
  webinar: 'Вебинар',
  conference: 'Конференция',
  training: 'Обучение',
};

function EventsHeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 px-4 py-12 md:py-16 lg:py-24">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 font-display text-3xl text-white md:mb-6 md:text-4xl lg:text-5xl">
            События КФА
          </h1>
          <p className="text-base leading-relaxed text-primary-50 md:text-lg lg:text-xl">
            Конференции, семинары и обучающие мероприятия для профессионального развития участников рынка
          </p>
        </div>
      </div>
    </section>
  );
}

export function EventsPage() {
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredEvents = events.filter((event) => {
    return selectedType === 'all' || event.type === selectedType;
  });

  return (
    <div className="min-h-screen">
      <EventsHeroSection />

      <section className="bg-gradient-to-b from-primary-50 to-white px-4 py-12 dark:from-neutral-800 dark:to-neutral-900 md:py-16 lg:py-24">
        <div className="container">
          {/* Filters */}
          <div className="mb-8 flex justify-center md:mb-12">
            <div className="inline-flex flex-wrap justify-center gap-2 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
              <button
                onClick={() => setSelectedType('all')}
                className={`rounded-md px-3 py-2 text-xs font-medium transition-colors md:px-4 md:text-sm ${
                  selectedType === 'all'
                    ? 'bg-white text-primary-700 shadow-sm dark:bg-neutral-700 dark:text-primary-300'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                }`}
              >
                Все события
              </button>
              <button
                onClick={() => setSelectedType('webinar')}
                className={`rounded-md px-3 py-2 text-xs font-medium transition-colors md:px-4 md:text-sm ${
                  selectedType === 'webinar'
                    ? 'bg-white text-primary-700 shadow-sm dark:bg-neutral-700 dark:text-primary-300'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                }`}
              >
                Вебинары
              </button>
              <button
                onClick={() => setSelectedType('conference')}
                className={`rounded-md px-3 py-2 text-xs font-medium transition-colors md:px-4 md:text-sm ${
                  selectedType === 'conference'
                    ? 'bg-white text-primary-700 shadow-sm dark:bg-neutral-700 dark:text-primary-300'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                }`}
              >
                Конференции
              </button>
              <button
                onClick={() => setSelectedType('training')}
                className={`rounded-md px-3 py-2 text-xs font-medium transition-colors md:px-4 md:text-sm ${
                  selectedType === 'training'
                    ? 'bg-white text-primary-700 shadow-sm dark:bg-neutral-700 dark:text-primary-300'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                }`}
              >
                Обучение
              </button>
            </div>
          </div>

          {/* Events List */}
          <div className="mx-auto max-w-4xl space-y-4 md:space-y-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="group relative overflow-hidden rounded-kfa border border-neutral-200 bg-white p-4 transition-all hover:border-primary-300 hover:shadow-kfa-lg dark:border-neutral-700 dark:bg-neutral-900 md:p-6 lg:p-8"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
                  {/* Left: Date Badge */}
                  <div className="flex items-start gap-4 md:gap-6">
                    <div className="flex-shrink-0 text-center">
                      <div className="rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 p-3 text-white shadow-kfa-md md:p-4">
                        <div className="text-2xl font-bold md:text-3xl">
                          {new Date(event.date).getDate()}
                        </div>
                        <div className="text-xs font-medium uppercase md:text-sm">
                          {new Date(event.date).toLocaleString('ru-RU', { month: 'short' })}
                        </div>
                      </div>
                    </div>

                    {/* Event Info */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2 md:mb-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold md:px-3 ${
                            eventTypeColors[event.type]
                          }`}
                        >
                          {eventTypeLabels[event.type]}
                        </span>
                      </div>

                      <h3 className="mb-2 font-display text-lg font-semibold text-primary-900 transition-colors group-hover:text-primary-700 dark:text-primary-100 dark:group-hover:text-primary-400 md:mb-3 md:text-xl">
                        {event.title}
                      </h3>

                      <p className="mb-3 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 md:mb-4 md:text-sm">
                        {event.description}
                      </p>

                      <div className="flex flex-wrap gap-3 text-xs text-neutral-600 dark:text-neutral-400 md:gap-4 md:text-sm">
                        <div className="flex items-center gap-1 md:gap-2">
                          <Clock className="h-3 w-3 md:h-4 md:w-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1 md:gap-2">
                          <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                          <span>{event.location === 'online' ? 'Онлайн' : event.location}</span>
                        </div>
                        <div className="flex items-center gap-1 md:gap-2">
                          <Users className="h-3 w-3 md:h-4 md:w-4" />
                          <span>{event.attendees} участников</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: CTA */}
                  <div className="flex-shrink-0">
                    <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-kfa-md transition-all hover:bg-primary-700 hover:shadow-kfa-lg md:w-auto md:px-6 md:py-3 md:text-base">
                      Регистрация
                      <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="rounded-kfa border-2 border-dashed border-neutral-300 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-800 md:p-12">
              <p className="text-base text-neutral-600 dark:text-neutral-400 md:text-lg">
                События не найдены
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
