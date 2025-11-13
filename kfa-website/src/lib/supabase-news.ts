/**
 * Supabase News Service
 * Direct CRUD operations on news table in Supabase
 */

import { supabase } from './supabase'
import type {
  News,
  NewsFormData,
  NewsFilters,
  PaginatedNewsResponse,
} from '@/types/news'

export class SupabaseNewsService {
  private static readonly TABLE = 'news'
  private static readonly PER_PAGE = 10

  /**
   * Получить список новостей с фильтрацией и пагинацией
   */
  static async getAll(filters?: NewsFilters): Promise<PaginatedNewsResponse> {
    try {
      let query = supabase
        .from(this.TABLE)
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      // Фильтр по статусу
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      // Поиск по заголовку
      if (filters?.search) {
        query = query.ilike('title', `%${filters.search}%`)
      }

      // Фильтр по категории
      if (filters?.category) {
        query = query.eq('category', filters.category)
      }

      // Фильтр по featured
      if (filters?.featured !== undefined) {
        query = query.eq('featured', filters.featured)
      }

      // Пагинация
      const page = filters?.page || 1
      const perPage = filters?.per_page || this.PER_PAGE
      const from = (page - 1) * perPage
      const to = from + perPage - 1

      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      const totalPages = count ? Math.ceil(count / perPage) : 0

      return {
        data: data as News[],
        meta: {
          current_page: page,
          from: from + 1,
          last_page: totalPages,
          path: '/news',
          per_page: perPage,
          to: Math.min(to + 1, count || 0),
          total: count || 0,
        },
        links: {
          first: `/news?page=1`,
          last: `/news?page=${totalPages}`,
          prev: page > 1 ? `/news?page=${page - 1}` : null,
          next: page < totalPages ? `/news?page=${page + 1}` : null,
        },
      }
    } catch (error: any) {
      console.error('Error fetching news:', error)
      throw new Error(error.message || 'Failed to fetch news')
    }
  }

  /**
   * Получить одну новость по ID
   */
  static async getById(id: number): Promise<News> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (!data) throw new Error('News not found')

      return data as News
    } catch (error: any) {
      console.error(`Error fetching news ${id}:`, error)
      throw new Error(error.message || 'Failed to fetch news')
    }
  }

  /**
   * Получить новость по slug
   */
  static async getBySlug(slug: string): Promise<News> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error
      if (!data) throw new Error('News not found')

      return data as News
    } catch (error: any) {
      console.error(`Error fetching news by slug ${slug}:`, error)
      throw new Error(error.message || 'Failed to fetch news')
    }
  }

  /**
   * Создать новость
   */
  static async create(data: NewsFormData): Promise<News> {
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: newsData, error } = await supabase
        .from(this.TABLE)
        .insert({
          ...data,
          author_id: user.id,
          published_at: data.status === 'published' ? new Date().toISOString() : null,
        })
        .select()
        .single()

      if (error) throw error
      if (!newsData) throw new Error('Failed to create news')

      return newsData as News
    } catch (error: any) {
      console.error('Error creating news:', error)
      throw new Error(error.message || 'Failed to create news')
    }
  }

  /**
   * Обновить новость
   */
  static async update(id: number, data: Partial<NewsFormData>): Promise<News> {
    try {
      const updateData: any = { ...data }

      // Если статус меняется на published, установить published_at
      if (data.status === 'published' && !data.published_at) {
        updateData.published_at = new Date().toISOString()
      }

      const { data: newsData, error } = await supabase
        .from(this.TABLE)
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      if (!newsData) throw new Error('News not found')

      return newsData as News
    } catch (error: any) {
      console.error(`Error updating news ${id}:`, error)
      throw new Error(error.message || 'Failed to update news')
    }
  }

  /**
   * Удалить новость
   */
  static async delete(id: number): Promise<void> {
    try {
      const { error } = await supabase.from(this.TABLE).delete().eq('id', id)

      if (error) throw error
    } catch (error: any) {
      console.error(`Error deleting news ${id}:`, error)
      throw new Error(error.message || 'Failed to delete news')
    }
  }

  /**
   * Переключить статус "избранное"
   */
  static async toggleFeatured(id: number): Promise<News> {
    try {
      // Сначала получаем текущее состояние
      const current = await this.getById(id)

      // Обновляем
      const { data, error } = await supabase
        .from(this.TABLE)
        .update({ featured: !current.featured })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      if (!data) throw new Error('News not found')

      return data as News
    } catch (error: any) {
      console.error(`Error toggling featured ${id}:`, error)
      throw new Error(error.message || 'Failed to toggle featured status')
    }
  }

  /**
   * Опубликовать новость
   */
  static async publish(id: number): Promise<News> {
    return this.update(id, {
      status: 'published',
      published_at: new Date().toISOString(),
    })
  }

  /**
   * Снять с публикации
   */
  static async unpublish(id: number): Promise<News> {
    return this.update(id, { status: 'draft' })
  }

  /**
   * Архивировать новость
   */
  static async archive(id: number): Promise<News> {
    return this.update(id, { status: 'archived' })
  }

  /**
   * Получить опубликованные новости
   */
  static async getPublished(limit = 10): Promise<News[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return (data as News[]) || []
    } catch (error: any) {
      console.error('Error fetching published news:', error)
      throw new Error(error.message || 'Failed to fetch published news')
    }
  }

  /**
   * Получить избранные новости
   */
  static async getFeatured(limit = 5): Promise<News[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('*')
        .eq('status', 'published')
        .eq('featured', true)
        .order('published_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return (data as News[]) || []
    } catch (error: any) {
      console.error('Error fetching featured news:', error)
      throw new Error(error.message || 'Failed to fetch featured news')
    }
  }

  /**
   * Поиск новостей
   */
  static async search(query: string, limit = 10): Promise<News[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return (data as News[]) || []
    } catch (error: any) {
      console.error('Error searching news:', error)
      throw new Error(error.message || 'Failed to search news')
    }
  }
}

// Экспорт экземпляра для удобства
export const supabaseNewsAPI = SupabaseNewsService
