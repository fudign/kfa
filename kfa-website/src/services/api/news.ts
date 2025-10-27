import { apiClient } from '../apiClient';
import type {
  News,
  NewsFormData,
  NewsFilters,
  NewsStats,
  PaginatedNewsResponse,
} from '@/types/news';

export class NewsService {
  private static readonly BASE_URL = '/news';

  /**
   * Получить список новостей с фильтрацией и пагинацией
   */
  static async getAll(filters?: NewsFilters): Promise<PaginatedNewsResponse> {
    const response = await apiClient.get<PaginatedNewsResponse>(
      this.BASE_URL,
      { params: filters }
    );
    return response.data;
  }

  /**
   * Получить одну новость по ID
   */
  static async getById(id: number): Promise<News> {
    const response = await apiClient.get<{ data: News }>(
      `${this.BASE_URL}/${id}`
    );
    return response.data.data;
  }

  /**
   * Создать новость
   */
  static async create(data: NewsFormData): Promise<News> {
    const response = await apiClient.post<{ data: News }>(
      this.BASE_URL,
      data
    );
    return response.data.data;
  }

  /**
   * Обновить новость
   */
  static async update(id: number, data: Partial<NewsFormData>): Promise<News> {
    const response = await apiClient.put<{ data: News }>(
      `${this.BASE_URL}/${id}`,
      data
    );
    return response.data.data;
  }

  /**
   * Удалить новость
   */
  static async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.BASE_URL}/${id}`);
  }

  // =============== УПРАВЛЕНИЕ МЕДИА ===============

  /**
   * Прикрепить медиафайл к новости
   */
  static async attachMedia(
    newsId: number,
    mediaId: number,
    type: 'featured' | 'gallery',
    order = 0
  ): Promise<News> {
    const response = await apiClient.post<{ data: News }>(
      `${this.BASE_URL}/${newsId}/media`,
      { media_id: mediaId, type, order }
    );
    return response.data.data;
  }

  /**
   * Открепить медиафайл от новости
   */
  static async detachMedia(newsId: number, mediaId: number): Promise<News> {
    const response = await apiClient.delete<{ data: News }>(
      `${this.BASE_URL}/${newsId}/media/${mediaId}`
    );
    return response.data.data;
  }

  /**
   * Изменить порядок изображений в галерее
   */
  static async reorderMedia(
    newsId: number,
    mediaIds: number[]
  ): Promise<News> {
    const response = await apiClient.put<{ data: News }>(
      `${this.BASE_URL}/${newsId}/media/reorder`,
      { media_ids: mediaIds }
    );
    return response.data.data;
  }

  // =============== МОДЕРАЦИЯ ===============

  /**
   * Одобрить новость (админ)
   */
  static async approve(id: number): Promise<News> {
    const response = await apiClient.post<{ data: News }>(
      `${this.BASE_URL}/${id}/approve`
    );
    return response.data.data;
  }

  /**
   * Отклонить новость (админ)
   */
  static async reject(id: number): Promise<News> {
    const response = await apiClient.post<{ data: News }>(
      `${this.BASE_URL}/${id}/reject`
    );
    return response.data.data;
  }

  /**
   * Переключить статус "избранное" (админ)
   */
  static async toggleFeatured(id: number): Promise<News> {
    const response = await apiClient.post<{ data: News }>(
      `${this.BASE_URL}/${id}/toggle-featured`
    );
    return response.data.data;
  }

  /**
   * Опубликовать новость (админ)
   */
  static async publish(id: number): Promise<News> {
    const response = await apiClient.post<{ data: News }>(
      `${this.BASE_URL}/${id}/publish`
    );
    return response.data.data;
  }

  /**
   * Снять с публикации (админ)
   */
  static async unpublish(id: number): Promise<News> {
    const response = await apiClient.post<{ data: News }>(
      `${this.BASE_URL}/${id}/unpublish`
    );
    return response.data.data;
  }

  /**
   * Архивировать новость (админ)
   */
  static async archive(id: number): Promise<News> {
    const response = await apiClient.post<{ data: News }>(
      `${this.BASE_URL}/${id}/archive`
    );
    return response.data.data;
  }

  /**
   * Отправить на модерацию
   */
  static async submit(id: number): Promise<News> {
    const response = await apiClient.post<{ data: News }>(
      `${this.BASE_URL}/${id}/submit`
    );
    return response.data.data;
  }

  // =============== СТАТИСТИКА ===============

  /**
   * Получить статистику по новостям
   */
  static async getStats(): Promise<NewsStats> {
    const response = await apiClient.get<NewsStats>(
      `${this.BASE_URL}/stats`
    );
    return response.data;
  }
}
