import { useState, useEffect } from 'react';
import { Clock, MapPin, X, Loader2, AlertCircle, Filter, Award, FileText } from 'lucide-react';
import { eventsAPI, EventRegistration } from '@/services/api';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  cancelled: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400',
  attended: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

const statusLabels: Record<string, string> = {
  pending: 'Ожидает подтверждения',
  approved: 'Подтверждено',
  rejected: 'Отклонено',
  cancelled: 'Отменено',
  attended: 'Посещено',
};

export function MyRegistrations() {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsAPI.getMyRegistrations();

      // Handle both paginated and non-paginated responses
      const registrationsData = response.data || response;
      setRegistrations(Array.isArray(registrationsData) ? registrationsData : []);
    } catch (err: any) {
      console.error('Error fetching registrations:', err);
      setError('Не удалось загрузить ваши регистрации. Пожалуйста, попробуйте позже.');
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (registrationId: number) => {
    if (!confirm('Вы уверены, что хотите отменить регистрацию на это событие?')) {
      return;
    }

    try {
      setCancellingId(registrationId);
      const response = await eventsAPI.cancelRegistration(registrationId);

      if (response.success || response.data) {
        alert('✅ Регистрация успешно отменена');
        fetchRegistrations(); // Refresh the list
      }
    } catch (err: any) {
      console.error('Cancel registration error:', err);

      if (err.response?.data?.message) {
        alert(`❌ ${err.response.data.message}`);
      } else {
        alert('❌ Не удалось отменить регистрацию. Попробуйте позже.');
      }
    } finally {
      setCancellingId(null);
    }
  };

  const filteredRegistrations = registrations.filter((registration) => {
    if (selectedStatus === 'all') return true;
    return registration.status === selectedStatus;
  });

  // Get unique statuses from registrations
  const availableStatuses = [...new Set(registrations.map(r => r.status).filter(Boolean))] as string[];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 py-8 dark:bg-neutral-900">
        <div className="container">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
              <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">Загрузка регистраций...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 py-8 dark:bg-neutral-900">
        <div className="container">
          <div className="rounded-kfa border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
            <AlertCircle className="mx-auto h-12 w-12 text-red-600 dark:text-red-400" />
            <p className="mt-4 text-lg font-semibold text-red-800 dark:text-red-300">{error}</p>
            <button
              onClick={fetchRegistrations}
              className="mt-6 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-700"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8 dark:bg-neutral-900">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 font-display text-3xl font-bold text-primary-900 dark:text-primary-100">
            Мои регистрации
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Управляйте вашими регистрациями на образовательные события КФА
          </p>
        </div>

        {/* Filters */}
        {availableStatuses.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              }`}
            >
              Все ({registrations.length})
            </button>
            {availableStatuses.map((status) => {
              const count = registrations.filter(r => r.status === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedStatus === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-neutral-700 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                  }`}
                >
                  {statusLabels[status] || status} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Registrations List */}
        {filteredRegistrations.length > 0 ? (
          <div className="space-y-4">
            {filteredRegistrations.map((registration) => {
              const event = registration.event;
              const isCancelling = cancellingId === registration.id;
              const canCancel = registration.status === 'pending' || registration.status === 'approved';
              const eventDate = event?.date ? new Date(event.date) : null;

              return (
                <div
                  key={registration.id}
                  className="overflow-hidden rounded-kfa border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-kfa-md dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <div className="flex flex-col gap-4 p-6 md:flex-row md:items-start">
                    {/* Date Badge */}
                    {eventDate && (
                      <div className="flex-shrink-0">
                        <div className="flex h-20 w-20 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-kfa-sm">
                          <div className="text-2xl font-bold">{eventDate.getDate()}</div>
                          <div className="text-xs font-medium uppercase">
                            {eventDate.toLocaleString('ru-RU', { month: 'short' })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Event Details */}
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[registration.status] || 'bg-neutral-100 text-neutral-700'}`}>
                          {statusLabels[registration.status] || registration.status}
                        </span>
                        {registration.attendance_status === 'present' && (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            Присутствовал
                          </span>
                        )}
                      </div>

                      <h3 className="mb-2 font-display text-xl font-semibold text-primary-900 dark:text-primary-100">
                        {event?.title || 'Событие'}
                      </h3>

                      {event?.description && (
                        <p className="mb-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                          {event.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {event?.start_time && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{event.start_time}</span>
                          </div>
                        )}
                        {event?.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.is_online ? 'Онлайн' : event.location}</span>
                          </div>
                        )}
                        {registration.cpe_hours && (
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            <span>{registration.cpe_hours} CPE часов</span>
                          </div>
                        )}
                      </div>

                      {/* Certificate Link */}
                      {registration.certificate_url && (
                        <div className="mt-3">
                          <a
                            href={registration.certificate_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                          >
                            <FileText className="h-4 w-4" />
                            Скачать сертификат
                          </a>
                        </div>
                      )}

                      {/* Notes */}
                      {registration.notes && (
                        <div className="mt-3 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-700/50">
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            <strong>Заметки:</strong> {registration.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {canCancel && (
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => handleCancelRegistration(registration.id)}
                          disabled={isCancelling}
                          className="flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-800 dark:bg-neutral-800 dark:text-red-400 dark:hover:bg-neutral-700"
                        >
                          {isCancelling ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Отмена...
                            </>
                          ) : (
                            <>
                              <X className="h-4 w-4" />
                              Отменить
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Registration Date */}
                  <div className="border-t border-neutral-100 bg-neutral-50 px-6 py-3 dark:border-neutral-700 dark:bg-neutral-900/50">
                    <p className="text-xs text-neutral-500 dark:text-neutral-500">
                      Зарегистрировано: {new Date(registration.created_at).toLocaleString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-kfa border-2 border-dashed border-neutral-300 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-800">
            <Filter className="mx-auto mb-4 h-12 w-12 text-neutral-400" />
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              {registrations.length === 0 ? 'У вас пока нет регистраций' : 'Регистрации не найдены'}
            </p>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-500">
              {registrations.length === 0
                ? 'Посмотрите календарь образовательных событий и зарегистрируйтесь на интересующие вас мероприятия'
                : 'Попробуйте изменить фильтры поиска'
              }
            </p>
            {registrations.length === 0 && (
              <a
                href="/education/calendar"
                className="mt-6 inline-block rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
              >
                Перейти к календарю событий
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
