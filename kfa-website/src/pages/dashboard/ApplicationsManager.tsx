import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { applicationsService, type MembershipApplication, type ApplicationStatus } from '@/lib/supabase-applications';
import { usePermission } from '@/hooks/usePermission';
import {
  UserPlus,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Trash2,
  Mail,
  Phone,
} from 'lucide-react';

export function ApplicationsManagerPage() {
  const { can } = usePermission();
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedApplication, setSelectedApplication] = useState<MembershipApplication | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadApplications();
    loadStatistics();
  }, [statusFilter, searchTerm]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;

      const response = await applicationsService.getAll(params);
      setApplications(response.data);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const statistics = await applicationsService.getStatistics();
      setStats(statistics);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const handleStatusChange = async (id: number, status: ApplicationStatus) => {
    if (!confirm(`Изменить статус заявки на "${getStatusLabel(status)}"?`)) return;

    try {
      await applicationsService.updateStatus(id, status);
      await loadApplications();
      await loadStatistics();
      setShowDetailsModal(false);
    } catch (error: any) {
      alert(`Ошибка: ${error.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту заявку?')) return;

    try {
      await applicationsService.delete(id);
      await loadApplications();
      await loadStatistics();
    } catch (error: any) {
      alert(`Ошибка при удалении: ${error.message}`);
    }
  };

  const getStatusBadgeColor = (status: ApplicationStatus) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      reviewing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[status];
  };

  const getStatusLabel = (status: ApplicationStatus) => {
    const labels = {
      pending: 'Ожидает',
      reviewing: 'На рассмотрении',
      approved: 'Одобрена',
      rejected: 'Отклонена',
    };
    return labels[status];
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    const icons = {
      pending: Clock,
      reviewing: Eye,
      approved: CheckCircle,
      rejected: XCircle,
    };
    return icons[status];
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 md:space-y-6">
        {/* Header */}
        <div>
          <h1 className="mb-1 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:mb-2 md:text-3xl">
            Заявки на членство
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 md:text-base">
            Управление заявками на вступление в КФА
          </p>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-800">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Всего</div>
              <div className="mt-1 text-2xl font-bold text-primary-900 dark:text-primary-100">{stats.total}</div>
            </div>
            <div className="rounded-lg bg-yellow-50 p-4 shadow-sm dark:bg-yellow-900/20">
              <div className="text-sm text-yellow-700 dark:text-yellow-400">Ожидают</div>
              <div className="mt-1 text-2xl font-bold text-yellow-900 dark:text-yellow-300">{stats.pending}</div>
            </div>
            <div className="rounded-lg bg-blue-50 p-4 shadow-sm dark:bg-blue-900/20">
              <div className="text-sm text-blue-700 dark:text-blue-400">На рассмотрении</div>
              <div className="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-300">{stats.reviewing}</div>
            </div>
            <div className="rounded-lg bg-green-50 p-4 shadow-sm dark:bg-green-900/20">
              <div className="text-sm text-green-700 dark:text-green-400">Одобрено</div>
              <div className="mt-1 text-2xl font-bold text-green-900 dark:text-green-300">{stats.approved}</div>
            </div>
            <div className="rounded-lg bg-red-50 p-4 shadow-sm dark:bg-red-900/20">
              <div className="text-sm text-red-700 dark:text-red-400">Отклонено</div>
              <div className="mt-1 text-2xl font-bold text-red-900 dark:text-red-300">{stats.rejected}</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-800 md:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Поиск по имени, email, организации..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white py-2 pl-10 pr-4 text-neutral-900 placeholder-neutral-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 dark:placeholder-neutral-400"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100"
            >
              <option value="">Все статусы</option>
              <option value="pending">Ожидают</option>
              <option value="reviewing">На рассмотрении</option>
              <option value="approved">Одобрено</option>
              <option value="rejected">Отклонено</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div className="rounded-lg bg-white shadow-sm dark:bg-neutral-800">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="py-12 text-center text-neutral-600 dark:text-neutral-400">
              <UserPlus className="mx-auto mb-4 h-12 w-12 text-neutral-400" />
              <p>Заявок не найдено</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-neutral-600 dark:text-neutral-400">
                      Заявитель
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-neutral-600 dark:text-neutral-400">
                      Тип
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-neutral-600 dark:text-neutral-400">
                      Контакты
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-neutral-600 dark:text-neutral-400">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-neutral-600 dark:text-neutral-400">
                      Дата подачи
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase text-neutral-600 dark:text-neutral-400">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {applications.map((app) => {
                    const StatusIcon = getStatusIcon(app.status);
                    return (
                      <tr key={app.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-neutral-900 dark:text-neutral-100">
                            {app.first_name} {app.last_name}
                          </div>
                          {app.organization_name && (
                            <div className="text-sm text-neutral-600 dark:text-neutral-400">
                              {app.organization_name}
                            </div>
                          )}
                          <div className="text-sm text-neutral-500">{app.position}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200">
                            {app.membership_type === 'individual' ? 'Индивидуальное' : 'Корпоративное'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
                            <Mail className="h-4 w-4" />
                            {app.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
                            <Phone className="h-4 w-4" />
                            {app.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(app.status)}`}>
                            <StatusIcon className="h-3 w-3" />
                            {getStatusLabel(app.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                          {new Date(app.created_at).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedApplication(app);
                                setShowDetailsModal(true);
                              }}
                              className="rounded-lg p-2 text-primary-600 transition-colors hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20"
                              title="Просмотреть"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            {can('applications.delete') && (
                              <button
                                onClick={() => handleDelete(app.id)}
                                className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                title="Удалить"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-neutral-800">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-primary-900 dark:text-primary-100">
                  Заявка #{selectedApplication.id}
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Personal Info */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Личная информация
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">Имя</div>
                      <div className="font-medium">{selectedApplication.first_name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">Фамилия</div>
                      <div className="font-medium">{selectedApplication.last_name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">Email</div>
                      <div className="font-medium">{selectedApplication.email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">Телефон</div>
                      <div className="font-medium">{selectedApplication.phone}</div>
                    </div>
                    {selectedApplication.organization_name && (
                      <>
                        <div>
                          <div className="text-sm text-neutral-600 dark:text-neutral-400">Организация</div>
                          <div className="font-medium">{selectedApplication.organization_name}</div>
                        </div>
                        <div>
                          <div className="text-sm text-neutral-600 dark:text-neutral-400">Должность</div>
                          <div className="font-medium">{selectedApplication.position}</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Опыт работы
                  </h3>
                  <p className="whitespace-pre-wrap rounded-lg bg-neutral-50 p-4 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                    {selectedApplication.experience}
                  </p>
                </div>

                {/* Motivation */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Мотивация
                  </h3>
                  <p className="whitespace-pre-wrap rounded-lg bg-neutral-50 p-4 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                    {selectedApplication.motivation}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-700">
                  {selectedApplication.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(selectedApplication.id, 'reviewing')}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                      >
                        <Eye className="h-4 w-4" />
                        Начать рассмотрение
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedApplication.id, 'approved')}
                        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Одобрить
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedApplication.id, 'rejected')}
                        className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                      >
                        <XCircle className="h-4 w-4" />
                        Отклонить
                      </button>
                    </>
                  )}
                  {selectedApplication.status === 'reviewing' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(selectedApplication.id, 'approved')}
                        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Одобрить
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedApplication.id, 'rejected')}
                        className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                      >
                        <XCircle className="h-4 w-4" />
                        Отклонить
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
