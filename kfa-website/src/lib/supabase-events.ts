/**
 * Supabase Events Service
 * Управление мероприятиями через Supabase
 */

import { supabase } from './supabase'
import type { Event, PaginatedResponse } from '@/types'

export interface EventCreateData {
  title: string
  slug: string
  description: string
  location?: string
  starts_at: string
  ends_at?: string
  capacity?: number
  image?: string
}

export interface EventUpdateData extends Partial<EventCreateData> {}

export class SupabaseEventsService {
  private static readonly TABLE = 'events'
  private static readonly PER_PAGE = 12

  /**
   * Получить все мероприятия с фильтрацией и пагинацией
   */
  static async getAll(params?: {
    search?: string
    page?: number
    per_page?: number
  }): Promise<PaginatedResponse<Event>> {
    try {
      let query = supabase
        .from(this.TABLE)
        .select('*', { count: 'exact' })
        .order('starts_at', { ascending: false })

      // Поиск
      if (params?.search) {
        query = query.or(
          `title.ilike.%${params.search}%,description.ilike.%${params.search}%,location.ilike.%${params.search}%`
        )
      }

      // Пагинация
      const page = params?.page || 1
      const perPage = params?.per_page || this.PER_PAGE
      const from = (page - 1) * perPage
      const to = from + perPage - 1

      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      const totalPages = count ? Math.ceil(count / perPage) : 0

      return {
        data: data as Event[],
        meta: {
          current_page: page,
          from: from + 1,
          last_page: totalPages,
          path: '/events',
          per_page: perPage,
          to: Math.min(to + 1, count || 0),
          total: count || 0,
        },
        links: {
          first: `/events?page=1`,
          last: `/events?page=${totalPages}`,
          prev: page > 1 ? `/events?page=${page - 1}` : null,
          next: page < totalPages ? `/events?page=${page + 1}` : null,
        },
      }
    } catch (error: any) {
      console.error('Error fetching events:', error)
      throw new Error(error.message || 'Failed to fetch events')
    }
  }

  /**
   * Получить мероприятие по ID
   */
  static async getById(id: string | number): Promise<Event> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Event not found')
        }
        throw error
      }

      return data as Event
    } catch (error: any) {
      console.error(`Error fetching event ${id}:`, error)
      throw new Error(error.message || 'Failed to fetch event')
    }
  }

  /**
   * Получить мероприятие по slug
   */
  static async getBySlug(slug: string): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        throw error
      }

      return data as Event
    } catch (error: any) {
      console.error(`Error fetching event by slug ${slug}:`, error)
      throw new Error(error.message || 'Failed to fetch event')
    }
  }

  /**
   * Создать мероприятие
   */
  static async create(eventData: EventCreateData): Promise<Event> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .insert({
          title: eventData.title,
          slug: eventData.slug,
          description: eventData.description,
          location: eventData.location,
          starts_at: eventData.starts_at,
          ends_at: eventData.ends_at,
          capacity: eventData.capacity,
          image: eventData.image,
        })
        .select()
        .single()

      if (error) throw error
      if (!data) throw new Error('Failed to create event')

      return data as Event
    } catch (error: any) {
      console.error('Error creating event:', error)
      throw new Error(error.message || 'Failed to create event')
    }
  }

  /**
   * Обновить мероприятие
   */
  static async update(id: string | number, eventData: EventUpdateData): Promise<Event> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .update({
          ...eventData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      if (!data) throw new Error('Event not found')

      return data as Event
    } catch (error: any) {
      console.error(`Error updating event ${id}:`, error)
      throw new Error(error.message || 'Failed to update event')
    }
  }

  /**
   * Удалить мероприятие
   */
  static async delete(id: string | number): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.TABLE)
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error: any) {
      console.error(`Error deleting event ${id}:`, error)
      throw new Error(error.message || 'Failed to delete event')
    }
  }

  /**
   * Получить предстоящие мероприятия
   */
  static async getUpcoming(limit = 10): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('*')
        .gte('starts_at', new Date().toISOString())
        .order('starts_at', { ascending: true })
        .limit(limit)

      if (error) throw error

      return (data as Event[]) || []
    } catch (error: any) {
      console.error('Error fetching upcoming events:', error)
      throw new Error(error.message || 'Failed to fetch upcoming events')
    }
  }

  /**
   * Получить прошедшие мероприятия
   */
  static async getPast(limit = 10): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('*')
        .lt('starts_at', new Date().toISOString())
        .order('starts_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return (data as Event[]) || []
    } catch (error: any) {
      console.error('Error fetching past events:', error)
      throw new Error(error.message || 'Failed to fetch past events')
    }
  }
}

// Экспорт для удобства
export const supabaseEventsAPI = SupabaseEventsService
