import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { MediaPicker } from '@/components/cms/MediaPicker';
import { supabasePartnersAPI as partnersAPI } from '@/lib/supabase-partners';
import { usePermission } from '@/hooks/usePermission';
import type { Partner, PaginatedResponse } from '@/types';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  X,
  Save,
  ExternalLink,
  Mail,
  Phone,
  Star,
  Image as ImageIcon
} from 'lucide-react';

export function PartnersManagerPage() {
  const { can } = usePermission();
  const [partners, setPartners] = useState<PaginatedResponse<Partner> | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    website: '',
    email: '',
    phone: '',
    category: 'other' as 'platinum' | 'gold' | 'silver' | 'bronze' | 'other',
    status: 'active' as 'active' | 'inactive',
    is_featured: false,
    display_order: 0,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, statusFilter]);

  useEffect(() => {
    loadPartners(currentPage);
  }, [currentPage, searchTerm, categoryFilter, statusFilter]);

  const loadPartners = async (page: number = 1) => {
    try {
      setLoading(true);
      const params: any = { page };
      if (searchTerm) params.search = searchTerm;
      if (categoryFilter) params.category = categoryFilter;
      if (statusFilter) params.status = statusFilter;

      const response = await partnersAPI.getAll(params);
      setPartners(response);
    } catch (error) {
      console.error('Error loading partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Название
    if (!formData.name.trim()) {
      errors.name = 'Название обязательно';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Название должно содержать минимум 2 символа';
    } else if (formData.name.length > 255) {
      errors.name = 'Название не должно превышать 255 символов';
    }

    // Описание
    if (formData.description && formData.description.length > 1000) {
      errors.description = 'Описание не должно превышать 1000 символов';
    }

    // URL логотипа
    if (formData.logo) {
      try {
        new URL(formData.logo);
      } catch {
        errors.logo = 'Введите корректный URL';
      }
    }

    // Веб-сайт
    if (formData.website) {
      try {
        new URL(formData.website);
      } catch {
        errors.website = 'Введите корректный URL';
      }
    }

    // Email
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Введите корректный email';
      }
    }

    // Телефон
    if (formData.phone) {
      const phoneRegex = /^\+996\s?\d{3}\s?\d{3}\s?\d{3}$/;
      if (!phoneRegex.test(formData.phone)) {
        errors.phone = 'Формат: +996 XXX XXX XXX';
      }
    }

    // Порядок отображения
    if (formData.display_order < 0 || formData.display_order > 9999) {
      errors.display_order = 'Значение должно быть от 0 до 9999';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация перед отправкой
    if (!validateForm()) {
      return;
    }

    try {
      if (editingPartner) {
        await partnersAPI.update(editingPartner.id, formData);
      } else {
        await partnersAPI.create(formData);
      }

      setShowForm(false);
      setEditingPartner(null);
      resetForm();
      await loadPartners();
    } catch (error) {
      console.error('Error saving partner:', error);
      alert('Ошибка при сохранении партнера');
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      description: partner.description || '',
      logo: partner.logo || '',
      website: partner.website || '',
      email: partner.email || '',
      phone: partner.phone || '',
      category: partner.category,
      status: partner.status,
      is_featured: partner.is_featured,
      display_order: partner.display_order,
    });
    setFormErrors({});
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этого партнера?')) return;

    try {
      await partnersAPI.delete(id);
      await loadPartners();
    } catch (error) {
      console.error('Error deleting partner:', error);
      alert('Ошибка при удалении партнера');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      logo: '',
      website: '',
      email: '',
      phone: '',
      category: 'other',
      status: 'active',
      is_featured: false,
      display_order: 0,
    });
    setFormErrors({});
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      platinum: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
      gold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      silver: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
      bronze: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      other: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300',
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-1 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:mb-2 md:text-3xl">
              Управление партнерами
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 md:text-base">
              Добавление и редактирование партнеров КФА
            </p>
          </div>
          {can('partners.create') && (
            <button
              onClick={() => {
                resetForm();
                setEditingPartner(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" />
              Добавить партнера
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Поиск партнеров..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-neutral-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800"
            >
              <option value="">Все категории</option>
              <option value="platinum">Платиновый</option>
              <option value="gold">Золотой</option>
              <option value="silver">Серебряный</option>
              <option value="bronze">Бронзовый</option>
              <option value="other">Другое</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800"
            >
              <option value="">Все статусы</option>
              <option value="active">Активные</option>
              <option value="inactive">Неактивные</option>
            </select>
          </div>
        </div>

        {/* Partners Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
          </div>
        ) : partners?.data && partners.data.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {partners.data.map((partner) => (
              <div
                key={partner.id}
                className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-white p-4 transition-all hover:border-primary-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
              >
                {/* Featured badge */}
                {partner.is_featured && (
                  <div className="absolute right-2 top-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </div>
                )}

                {/* Logo */}
                <div className="mb-3 flex h-20 items-center justify-center overflow-hidden rounded-lg bg-neutral-50 dark:bg-neutral-700">
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-4xl font-bold text-neutral-300">
                      {partner.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {partner.name}
                  </h3>

                  {partner.description && (
                    <p className="line-clamp-2 text-xs text-neutral-600 dark:text-neutral-400">
                      {partner.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getCategoryBadgeColor(partner.category)}`}>
                      {partner.category_label}
                    </span>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      partner.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {partner.status_label}
                    </span>
                  </div>

                  {/* Contact info */}
                  <div className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                    {partner.website && (
                      <div className="flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        <a href={partner.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600">
                          {partner.website}
                        </a>
                      </div>
                    )}
                    {partner.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span>{partner.email}</span>
                      </div>
                    )}
                    {partner.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{partner.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {(can('partners.update') || can('partners.delete')) && (
                  <div className="mt-3 flex gap-2 border-t border-neutral-100 pt-3 dark:border-neutral-700">
                    {can('partners.update') && (
                      <button
                        onClick={() => handleEdit(partner)}
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
                      >
                        <Edit className="h-3 w-3" />
                        Изменить
                      </button>
                    )}
                    {can('partners.delete') && (
                      <button
                        onClick={() => handleDelete(partner.id)}
                        className="flex items-center justify-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 py-12 dark:border-neutral-700">
            <p className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Партнеры не найдены
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Добавить первого партнера
            </button>
          </div>
        )}

        {/* Pagination */}
        {partners && partners.meta.last_page > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!partners.links.prev}
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Назад
            </button>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              Страница {partners.meta.current_page} из {partners.meta.last_page}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!partners.links.next}
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Вперед
            </button>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-neutral-800">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  {editingPartner ? 'Редактировать партнера' : 'Добавить партнера'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingPartner(null);
                  }}
                  className="rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Название *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                      formErrors.name
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500/20 dark:border-neutral-700'
                    } dark:bg-neutral-900`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Описание
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                      formErrors.description
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500/20 dark:border-neutral-700'
                    } dark:bg-neutral-900`}
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.description}</p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Категория *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900"
                    >
                      <option value="platinum">Платиновый</option>
                      <option value="gold">Золотой</option>
                      <option value="silver">Серебряный</option>
                      <option value="bronze">Бронзовый</option>
                      <option value="other">Другое</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Статус *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900"
                    >
                      <option value="active">Активный</option>
                      <option value="inactive">Неактивный</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    URL логотипа
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                        formErrors.logo
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500/20 dark:border-neutral-700'
                      } dark:bg-neutral-900`}
                      placeholder="https://example.com/logo.png"
                    />
                    <button
                      type="button"
                      onClick={() => setShowMediaPicker(true)}
                      className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-semibold transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
                      title="Выбрать из медиатеки"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Выбрать
                    </button>
                  </div>
                  {formErrors.logo && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.logo}</p>
                  )}
                  {formData.logo && (
                    <div className="mt-2 flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-700">
                      <img
                        src={formData.logo}
                        alt="Превью логотипа"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Веб-сайт
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                        formErrors.website
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500/20 dark:border-neutral-700'
                      } dark:bg-neutral-900`}
                      placeholder="https://example.com"
                    />
                    {formErrors.website && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.website}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                        formErrors.email
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500/20 dark:border-neutral-700'
                      } dark:bg-neutral-900`}
                      placeholder="info@example.com"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                        formErrors.phone
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500/20 dark:border-neutral-700'
                      } dark:bg-neutral-900`}
                      placeholder="+996 XXX XXX XXX"
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Порядок отображения
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                        formErrors.display_order
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500/20 dark:border-neutral-700'
                      } dark:bg-neutral-900`}
                    />
                    {formErrors.display_order && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.display_order}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500/20"
                  />
                  <label htmlFor="is_featured" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Избранный партнер
                  </label>
                </div>

                <div className="flex gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingPartner(null);
                    }}
                    className="flex-1 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                  >
                    <Save className="h-4 w-4" />
                    Сохранить
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Media Picker */}
        <MediaPicker
          isOpen={showMediaPicker}
          onClose={() => setShowMediaPicker(false)}
          onSelect={(media) => {
            const selectedMedia = Array.isArray(media) ? media[0] : media;
            setFormData({ ...formData, logo: selectedMedia.url });
            setShowMediaPicker(false);
          }}
          multiple={false}
          accept="image"
        />
      </div>
    </DashboardLayout>
  );
}
