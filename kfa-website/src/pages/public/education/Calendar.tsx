import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, MapPin, Users, Filter, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { eventsAPI } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';

interface EducationEvent {
  id: number;
  title: string;
  description?: string;
  date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  type?: 'webinar' | 'workshop' | 'seminar' | 'conference' | 'exam';
  category?: string;
  capacity?: number;
  seats_available?: number;
  instructor?: string;
  instructor_name?: string;
  is_online?: boolean;
  status?: string;
  cpe_hours?: number;
}

const typeColors: Record<string, string> = {
  webinar: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  workshop: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  seminar: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  conference: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  exam: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const typeLabels: Record<string, string> = {
  webinar: 'Вебинар',
  workshop: 'Воркшоп',
  seminar: 'Семинар',
  conference: 'Конференция',
  exam: 'Экзамен',
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
  const [events, setEvents] = useState<EducationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [registeringEventId, setRegisteringEventId] = useState<number | null>(null);

  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsAPI.getAll({ status: 'published' });

      // Handle both paginated and non-paginated responses
      const eventsData = response.data || response;
      setEvents(Array.isArray(eventsData) ? eventsData : []);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError('Не удалось загрузить события. Пожалуйста, попробуйте позже.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: number) => {
    // Check if user is logged in
    if (!isAuthenticated) {
      // Redirect to login
      navigate(`/auth/login?redirect=/education/calendar&event=${eventId}`);
      return;
    }

    try {
      setRegisteringEventId(eventId);
      const response = await eventsAPI.register(eventId);

      if (response.success || response.data) {
        alert('✅ Вы успешно зарегистрированы на событие!');
        // Optionally refresh events to update available seats
        fetchEvents();
      }
    } catch (err: any) {
      console.error('Registration error:', err);

      if (err.response?.data?.message) {
        alert(`❌ ${err.response.data.message}`);
      } else {
        alert('❌ Не удалось зарегистрироваться. Попробуйте позже.');
      }
    } finally {
      setRegisteringEventId(null);
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesType = selectedType === 'all' || event.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesType && matchesCategory;
  });

  // Get unique types and categories from events
  const availableTypes = [...new Set(events.map(e => e.type).filter(Boolean))] as string[];
  const availableCategories = [...new Set(events.map(e => e.category).filter(Boolean))] as string[];

  if (loading) {
    return (
      <div className="min-h-screen">
        <CalendarHeroSection />
        <section className="bg-white py-12 dark:bg-neutral-900">
          <div className="container">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
                <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">Загрузка событий...</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <CalendarHeroSection />
        <section className="bg-white py-12 dark:bg-neutral-900">
          <div className="container">
            <div className="rounded-kfa border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
              <AlertCircle className="mx-auto h-12 w-12 text-red-600 dark:text-red-400" />
              <p className="mt-4 text-lg font-semibold text-red-800 dark:text-red-300">{error}</p>
              <button
                onClick={fetchEvents}
                className="mt-6 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-700"
              >
                Попробовать снова
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <CalendarHeroSection />

      <section className="bg-white py-12 dark:bg-neutral-900">
        <div className="container">
          {/* Filters */}
          {(availableTypes.length > 0 || availableCategories.length > 0) && (
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Type Filter */}
              {availableTypes.length > 0 && (
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
                  {availableTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        selectedType === type
                          ? 'bg-primary-600 text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {typeLabels[type] || type}
                    </button>
                  ))}
                </div>
              )}

              {/* Category Filter */}
              {availableCategories.length > 0 && (
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
                  {availableCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-accent-600 text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Events List */}
          <div className="space-y-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => {
                const isRegistering = registeringEventId === event.id;
                const isFull = event.seats_available !== undefined && event.seats_available <= 0;
                const isAlmostFull = event.seats_available !== undefined && event.seats_available < 10;
                const eventDate = event.date ? new Date(event.date) : null;

                return (
                  <div
                    key={event.id}
                    className="group relative overflow-hidden rounded-kfa border border-neutral-200 bg-white transition-all hover:border-primary-300 hover:shadow-kfa-md dark:border-neutral-700 dark:bg-neutral-900"
                  >
                    <div className="flex flex-col gap-6 p-8 md:flex-row">
                      {/* Date Badge */}
                      {eventDate && (
                        <div className="flex-shrink-0">
                          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-kfa-md">
                            <div className="text-3xl font-bold">{eventDate.getDate()}</div>
                            <div className="text-xs font-medium uppercase">
                              {eventDate.toLocaleString('ru-RU', { month: 'short' })}
                            </div>
                            <div className="text-xs">{eventDate.getFullYear()}</div>
                          </div>
                        </div>
                      )}

                      {/* Event Info */}
                      <div className="flex-1">
                        {(event.type || event.category) && (
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            {event.type && (
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${typeColors[event.type] || 'bg-neutral-100 text-neutral-700'}`}>
                                {typeLabels[event.type] || event.type}
                              </span>
                            )}
                            {event.category && (
                              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                {event.category}
                              </span>
                            )}
                          </div>
                        )}

                        <h3 className="mb-2 font-display text-xl font-semibold text-primary-900 dark:text-primary-100">
                          {event.title}
                        </h3>

                        {event.description && (
                          <p className="mb-4 leading-relaxed text-neutral-600 dark:text-neutral-400">
                            {event.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                          {event.start_time && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{event.start_time}</span>
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{event.is_online ? 'Онлайн' : event.location}</span>
                            </div>
                          )}
                          {event.capacity !== undefined && (
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>
                                {event.seats_available !== undefined
                                  ? `${event.seats_available} из ${event.capacity} мест доступно`
                                  : `Вместимость: ${event.capacity}`
                                }
                              </span>
                            </div>
                          )}
                        </div>

                        {(event.instructor || event.instructor_name) && (
                          <div className="mt-4 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-500">
                            <span>Спикер:</span>
                            <span className="font-semibold text-primary-700 dark:text-primary-400">
                              {event.instructor || event.instructor_name}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="flex flex-shrink-0 items-start">
                        <button
                          onClick={() => handleRegister(event.id)}
                          disabled={isFull || isRegistering}
                          className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isRegistering ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Регистрация...
                            </>
                          ) : isFull ? (
                            'Мест нет'
                          ) : (
                            <>
                              Записаться
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Availability Indicator */}
                    {isAlmostFull && !isFull && (
                      <div className="absolute right-4 top-4 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        Мест осталось мало!
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="rounded-kfa border-2 border-dashed border-neutral-300 bg-neutral-50 p-12 text-center dark:border-neutral-700 dark:bg-neutral-800">
                <Filter className="mx-auto mb-4 h-12 w-12 text-neutral-400" />
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                  {events.length === 0 ? 'Нет доступных событий' : 'События не найдены'}
                </p>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-500">
                  {events.length === 0
                    ? 'Скоро здесь появятся новые образовательные мероприятия'
                    : 'Попробуйте изменить фильтры поиска'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
