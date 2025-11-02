import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Users, Filter, ArrowRight } from 'lucide-react';

interface EducationEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'webinar' | 'workshop' | 'seminar' | 'conference' | 'exam';
  category: 'beginners' | 'advanced' | 'certification' | 'special';
  seats: number;
  seatsAvailable: number;
  instructor: string;
  description: string;
}

const events: EducationEvent[] = [
  {
    id: 1,
    title: 'Введение в рынок ценных бумаг',
    date: '2025-11-25',
    time: '14:00',
    location: 'online',
    type: 'webinar',
    category: 'beginners',
    seats: 100,
    seatsAvailable: 45,
    instructor: 'Анна Смирнова',
    description: 'Базовые понятия и принципы работы фондового рынка для начинающих специалистов',
  },
  {
    id: 2,
    title: 'Практикум по анализу финансовой отчетности',
    date: '2025-12-05',
    time: '10:00',
    location: 'Бишкек',
    type: 'workshop',
    category: 'advanced',
    seats: 30,
    seatsAvailable: 12,
    instructor: 'Марат Токтоматов',
    description: 'Практические кейсы по анализу финансовых показателей компаний',
  },
  {
    id: 3,
    title: 'ESG-инвестирование: тренды и перспективы',
    date: '2025-12-15',
    time: '15:00',
    location: 'online',
    type: 'webinar',
    category: 'special',
    seats: 150,
    seatsAvailable: 89,
    instructor: 'Азамат Мурзабеков',
    description: 'Принципы устойчивого инвестирования и их применение на локальном рынке',
  },
  {
    id: 4,
    title: 'Базовый экзамен на сертификацию',
    date: '2025-12-20',
    time: '09:00',
    location: 'Бишкек',
    type: 'exam',
    category: 'certification',
    seats: 50,
    seatsAvailable: 15,
    instructor: 'Комиссия КФА',
    description: 'Аттестационный экзамен для получения базового сертификата специалиста',
  },
  {
    id: 5,
    title: 'Управление рисками в портфеле',
    date: '2026-01-10',
    time: '14:00',
    location: 'online',
    type: 'seminar',
    category: 'advanced',
    seats: 80,
    seatsAvailable: 42,
    instructor: 'Алексей Петров',
    description: 'Современные методы оценки и управления инвестиционными рисками',
  },
  {
    id: 6,
    title: 'Регуляторные изменения 2026',
    date: '2026-01-20',
    time: '11:00',
    location: 'Бишкек',
    type: 'conference',
    category: 'special',
    seats: 200,
    seatsAvailable: 134,
    instructor: 'Спикеры НБКР и КФА',
    description: 'Обзор новых требований регулятора и их влияние на участников рынка',
  },
  {
    id: 7,
    title: 'Основы технического анализа',
    date: '2026-02-01',
    time: '14:00',
    location: 'online',
    type: 'webinar',
    category: 'beginners',
    seats: 100,
    seatsAvailable: 67,
    instructor: 'Анна Смирнова',
    description: 'Практическое применение индикаторов и паттернов технического анализа',
  },
  {
    id: 8,
    title: 'Профессиональный экзамен на сертификацию',
    date: '2026-02-15',
    time: '09:00',
    location: 'Бишкек',
    type: 'exam',
    category: 'certification',
    seats: 30,
    seatsAvailable: 8,
    instructor: 'Комиссия КФА',
    description: 'Экзамен для получения профессионального сертификата',
  },
];

const typeColors = {
  webinar: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  workshop: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  seminar: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  conference: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  exam: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const typeLabels = {
  webinar: 'Вебинар',
  workshop: 'Воркшоп',
  seminar: 'Семинар',
  conference: 'Конференция',
  exam: 'Экзамен',
};

const categoryLabels = {
  beginners: 'Для начинающих',
  advanced: 'Для профессионалов',
  certification: 'Сертификация',
  special: 'Спецмероприятие',
};

function CalendarHeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 py-20">
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
          <div className="mb-6 inline-flex rounded-full bg-white/10 p-4 backdrop-blur-sm">
            <CalendarIcon className="h-12 w-12 text-white" />
          </div>

          <h1 className="mb-6 font-display text-display-lg text-white">Календарь образовательных событий</h1>
          <p className="text-lg leading-relaxed text-primary-50">
            Актуальное расписание вебинаров, семинаров, воркшопов и экзаменов КФА
          </p>
        </div>
      </div>
    </section>
  );
}

export function CalendarPage() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredEvents = events.filter((event) => {
    const matchesType = selectedType === 'all' || event.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesType && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <CalendarHeroSection />

      <section className="bg-white py-12 dark:bg-neutral-900">
        <div className="container">
          {/* Filters */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType('all')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedType === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                }`}
              >
                Все типы
              </button>
              {Object.entries(typeLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedType(key)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedType === key
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-accent-600 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                }`}
              >
                Все категории
              </button>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === key
                      ? 'bg-accent-600 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="group relative overflow-hidden rounded-kfa border border-neutral-200 bg-white transition-all hover:border-primary-300 hover:shadow-kfa-md dark:border-neutral-700 dark:bg-neutral-900"
                >
                  <div className="flex flex-col gap-6 p-8 md:flex-row">
                    {/* Date Badge */}
                    <div className="flex-shrink-0">
                      <div className="flex h-24 w-24 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-kfa-md">
                        <div className="text-3xl font-bold">{new Date(event.date).getDate()}</div>
                        <div className="text-xs font-medium uppercase">
                          {new Date(event.date).toLocaleString('ru-RU', { month: 'short' })}
                        </div>
                        <div className="text-xs">{new Date(event.date).getFullYear()}</div>
                      </div>
                    </div>

                    {/* Event Info */}
                    <div className="flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${typeColors[event.type]}`}>
                          {typeLabels[event.type]}
                        </span>
                        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                          {categoryLabels[event.category]}
                        </span>
                      </div>

                      <h3 className="mb-2 font-display text-xl font-semibold text-primary-900 dark:text-primary-100">
                        {event.title}
                      </h3>

                      <p className="mb-4 leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {event.description}
                      </p>

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

                      <div className="mt-4 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-500">
                        <span>Спикер:</span>
                        <span className="font-semibold text-primary-700 dark:text-primary-400">{event.instructor}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-shrink-0 items-start">
                      <button className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700">
                        Записаться
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Availability Indicator */}
                  {event.seatsAvailable < 10 && (
                    <div className="absolute right-4 top-4 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      Мест осталось мало!
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="rounded-kfa border-2 border-dashed border-neutral-300 bg-neutral-50 p-12 text-center dark:border-neutral-700 dark:bg-neutral-800">
                <Filter className="mx-auto mb-4 h-12 w-12 text-neutral-400" />
                <p className="text-lg text-neutral-600 dark:text-neutral-400">События не найдены</p>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-500">
                  Попробуйте изменить фильтры поиска
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
