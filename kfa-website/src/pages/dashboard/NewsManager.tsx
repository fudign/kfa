import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { MediaPicker } from '@/components/cms/MediaPicker';
import { newsAPI } from '@/services/api';
import { usePermission } from '@/hooks/usePermission';
import type { News, PaginatedResponse, Media } from '@/types';
import { newsSchema } from '@/schemas/news.schema';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  X,
  Save,
  CheckCircle,
  Image as ImageIcon
} from 'lucide-react';

export function NewsManagerPage() {
  const { can } = usePermission();
  const [news, setNews] = useState<PaginatedResponse<News> | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    image: '',
    featured_image_id: null as number | null,
    status: 'draft' as 'draft' | 'published' | 'archived',
    featured: false,
    published_at: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    loadNews(currentPage);
  }, [currentPage, searchTerm, statusFilter]);

  const loadNews = async (page: number = 1) => {
    try {
      setLoading(true);
      const params: any = { page };
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;

      const response = await newsAPI.getAll(params);
      setNews(response);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    try {
      // Валидация с использованием Zod схемы
      newsSchema.parse({
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        content: formData.content,
        excerpt: formData.excerpt,
        image: formData.image,
        status: formData.status,
        featured: formData.featured
      });

      // Если валидация прошла успешно, очищаем ошибки
      setFormErrors({});
      return true;
    } catch (error: any) {
      // Обработка ошибок Zod
      const errors: Record<string, string> = {};

      if (error.errors) {
        error.errors.forEach((err: any) => {
          const field = err.path[0];
          errors[field] = err.message;
        });
      }

      setFormErrors(errors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const dataToSubmit: any = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
      };

      // Очистить пустые строки и заменить их на null
      Object.keys(dataToSubmit).forEach(key => {
        if (dataToSubmit[key] === '') {
          dataToSubmit[key] = null;
        }
      });

      if (editingNews) {
        await newsAPI.update(editingNews.id, dataToSubmit);
      } else {
        await newsAPI.create(dataToSubmit);
      }

      setShowForm(false);
      setEditingNews(null);
      resetForm();
      await loadNews(currentPage);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      }
      console.error('Error saving news:', error);
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\wа-яё\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 100);
  };

  const handleEdit = (item: News) => {
    setEditingNews(item);
    setFormData({
      title: item.title || '',
      slug: item.slug || '',
      content: item.content || '',
      excerpt: item.excerpt || '',
      image: item.featured_image?.url || item.image || '',
      featured_image_id: item.featured_image?.id || null,
      status: item.status as 'draft' | 'published' | 'archived' || 'draft',
      featured: item.featured || false,
      published_at: item.published_at || '',
    });
    setFormErrors({});
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту новость?')) {
      return;
    }

    try{
      await newsAPI.delete(id);
      await loadNews(currentPage);
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  const handleMediaSelect = (media: Media | Media[]) => {
    if (Array.isArray(media)) {
      if (media.length > 0) {
        setFormData({
          ...formData,
          image: media[0].url,
          featured_image_id: media[0].id
        });
      }
    } else {
      setFormData({
        ...formData,
        image: media.url,
        featured_image_id: media.id
      });
    }
    setShowMediaPicker(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      image: '',
      featured_image_id: null,
      status: 'draft',
      featured: false,
      published_at: '',
    });
    setFormErrors({});
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingNews(null);
    resetForm();
  };

  if (!can('content.view')) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            У вас нет доступа к этому разделу
          </h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Управление новостями
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Создавайте и управляйте новостями
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Добавить новость
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по заголовку..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none"
              >
                <option value="">Все статусы</option>
                <option value="draft">Черновик</option>
                <option value="published">Опубликовано</option>
                <option value="archived">Архив</option>
              </select>
            </div>
          </div>
        </div>

        {/* News Table */}
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Загрузка...</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Заголовок
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Дата создания
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {news?.data && news.data.length > 0 ? (
                    news.data.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {(item.featured_image?.url || item.image) && (
                              <img
                                src={item.featured_image?.url || item.image}
                                alt={item.title}
                                className="w-12 h-12 rounded object-cover"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {item.title}
                              </div>
                              {item.featured && (
                                <span className="inline-flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                                  <CheckCircle className="w-3 h-3" />
                                  Избранное
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              item.status === 'published'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : item.status === 'archived'
                                ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}
                          >
                            {item.status === 'published'
                              ? 'Опубликовано'
                              : item.status === 'archived'
                              ? 'Архив'
                              : 'Черновик'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(item.created_at).toLocaleDateString('ru-RU')}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit className="w-4 h-4" />
                            Редактировать
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        Новости не найдены
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {news && news.meta && news.meta.last_page > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Показано {news.data.length} из {news.meta.total} записей
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Назад
                  </button>
                  <span className="px-3 py-1 text-gray-600 dark:text-gray-300">
                    Страница {currentPage} из {news.meta.last_page}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === news.meta.last_page}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Вперед
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {editingNews ? 'Редактировать новость' : 'Добавить новость'}
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Заголовок <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      const autoSlug = !editingNews ? generateSlug(newTitle) : formData.slug;
                      setFormData({ ...formData, title: newTitle, slug: autoSlug });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                      formErrors.title
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Введите заголовок новости"
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
                  )}
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL (slug)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Автоматически генерируется из заголовка"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Оставьте пустым для автоматической генерации
                  </p>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Краткое описание
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                      formErrors.excerpt
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Краткое описание новости"
                  />
                  {formErrors.excerpt && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.excerpt}</p>
                  )}
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Контент <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={10}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                      formErrors.content
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Введите текст новости"
                  />
                  {formErrors.content && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.content}</p>
                  )}
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Изображение
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                        formErrors.image
                          ? 'border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowMediaPicker(true)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Выбрать
                    </button>
                  </div>
                  {formErrors.image && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.image}</p>
                  )}
                  {formData.image && (
                    <div className="mt-2 relative inline-block">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-32 h-32 rounded object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '', featured_image_id: null })}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg"
                        title="Удалить изображение"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Status and Featured */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Статус
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as 'draft' | 'published' | 'archived',
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="draft">Черновик</option>
                      <option value="published">Опубликовано</option>
                      <option value="archived">Архив</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) =>
                          setFormData({ ...formData, featured: e.target.checked })
                        }
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Избранное
                      </span>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <Save className="w-4 h-4" />
                    {editingNews ? 'Сохранить изменения' : 'Создать новость'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Media Picker Modal */}
        <MediaPicker
          isOpen={showMediaPicker}
          onClose={() => setShowMediaPicker(false)}
          onSelect={handleMediaSelect}
          accept="image"
        />
      </div>
    </DashboardLayout>
  );
}

export default NewsManagerPage;
