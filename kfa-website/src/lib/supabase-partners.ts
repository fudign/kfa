/**
 * Supabase Partners Service
 * Управление партнерами через Supabase
 */

import { supabase } from './supabase'
import type { Partner, PaginatedResponse } from '@/types'

export type PartnerCategory = 'platinum' | 'gold' | 'silver' | 'bronze' | 'other'
export type PartnerStatus = 'active' | 'inactive'

export interface PartnerCreateData {
  name: string
  description?: string
  logo?: string
  website?: string
  email?: string
  phone?: string
  category: PartnerCategory
  status: PartnerStatus
  is_featured: boolean
  display_order: number
}

export interface PartnerUpdateData extends Partial<PartnerCreateData> {}

export class SupabasePartnersService {
  private static readonly TABLE = 'partners'
  private static readonly PER_PAGE = 20

  /**
   * Получить всех партнеров с фильтрацией и пагинацией
   */
  static async getAll(params?: {
    search?: string
    category?: PartnerCategory
    status?: PartnerStatus
    page?: number
    per_page?: number
  }): Promise<PaginatedResponse<Partner>> {
    try {
      let query = supabase
        .from(this.TABLE)
        .select('*', { count: 'exact' })
        .order('display_order', { ascending: true })
        .order('name', { ascending: true })

      // Поиск по названию или описанию
      if (params?.search) {
        query = query.or(
          `name.ilike.%${params.search}%,description.ilike.%${params.search}%`
        )
      }

      // Фильтр по категории
      if (params?.category) {
        query = query.eq('category', params.category)
      }

      // Фильтр по статусу
      if (params?.status) {
        query = query.eq('status', params.status)
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

      // Добавляем метки для отображения
      const enrichedData = (data as Partner[])?.map(partner => ({
        ...partner,
        category_label: this.getCategoryLabel(partner.category),
        status_label: partner.status === 'active' ? 'Активный' : 'Неактивный',
      }))

      return {
        data: enrichedData,
        meta: {
          current_page: page,
          from: from + 1,
          last_page: totalPages,
          path: '/partners',
          per_page: perPage,
          to: Math.min(to + 1, count || 0),
          total: count || 0,
        },
        links: {
          first: `/partners?page=1`,
          last: `/partners?page=${totalPages}`,
          prev: page > 1 ? `/partners?page=${page - 1}` : null,
          next: page < totalPages ? `/partners?page=${page + 1}` : null,
        },
      }
    } catch (error: any) {
      console.error('Error fetching partners:', error)
      throw new Error(error.message || 'Failed to fetch partners')
    }
  }

  /**
   * Получить партнера по ID
   */
  static async getById(id: number): Promise<Partner> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Partner not found')
        }
        throw error
      }

      return {
        ...data,
        category_label: this.getCategoryLabel(data.category),
        status_label: data.status === 'active' ? 'Активный' : 'Неактивный',
      } as Partner
    } catch (error: any) {
      console.error(`Error fetching partner ${id}:`, error)
      throw new Error(error.message || 'Failed to fetch partner')
    }
  }

  /**
   * Создать партнера
   */
  static async create(partnerData: PartnerCreateData): Promise<Partner> {
    try {
      // Генерируем уникальный slug из названия
      let slug = this.generateSlug(partnerData.name)
      let slugExists = await this.checkSlugExists(slug)
      let counter = 1

      // Если slug уже существует, добавляем номер
      while (slugExists) {
        slug = `${this.generateSlug(partnerData.name)}-${counter}`
        slugExists = await this.checkSlugExists(slug)
        counter++
      }

      const { data, error } = await supabase
        .from(this.TABLE)
        .insert({
          ...partnerData,
          slug,
        })
        .select()
        .single()

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          data: partnerData,
          slug: slug
        })
        throw error
      }
      if (!data) throw new Error('Failed to create partner')

      return {
        ...data,
        category_label: this.getCategoryLabel(data.category),
        status_label: data.status === 'active' ? 'Активный' : 'Неактивный',
      } as Partner
    } catch (error: any) {
      console.error('Error creating partner:', error)
      throw new Error(error.message || 'Failed to create partner')
    }
  }

  /**
   * Обновить партнера
   */
  static async update(id: number, partnerData: PartnerUpdateData): Promise<Partner> {
    try {
      const updateData: any = {
        ...partnerData,
        updated_at: new Date().toISOString(),
      }

      // Если изменяется имя, обновляем и slug
      if (partnerData.name) {
        updateData.slug = this.generateSlug(partnerData.name)
      }

      const { data, error } = await supabase
        .from(this.TABLE)
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      if (!data) throw new Error('Partner not found')

      return {
        ...data,
        category_label: this.getCategoryLabel(data.category),
        status_label: data.status === 'active' ? 'Активный' : 'Неактивный',
      } as Partner
    } catch (error: any) {
      console.error(`Error updating partner ${id}:`, error)
      throw new Error(error.message || 'Failed to update partner')
    }
  }

  /**
   * Удалить партнера
   */
  static async delete(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.TABLE)
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error: any) {
      console.error(`Error deleting partner ${id}:`, error)
      throw new Error(error.message || 'Failed to delete partner')
    }
  }

  /**
   * Получить избранных партнеров
   */
  static async getFeatured(limit = 10): Promise<Partner[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('*')
        .eq('is_featured', true)
        .eq('status', 'active')
        .order('display_order', { ascending: true })
        .order('name', { ascending: true })
        .limit(limit)

      if (error) throw error

      return ((data as Partner[]) || []).map(partner => ({
        ...partner,
        category_label: this.getCategoryLabel(partner.category),
        status_label: 'Активный',
      }))
    } catch (error: any) {
      console.error('Error fetching featured partners:', error)
      throw new Error(error.message || 'Failed to fetch featured partners')
    }
  }

  /**
   * Получить партнеров по категории
   */
  static async getByCategory(category: PartnerCategory, limit = 50): Promise<Partner[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('*')
        .eq('category', category)
        .eq('status', 'active')
        .order('display_order', { ascending: true })
        .order('name', { ascending: true })
        .limit(limit)

      if (error) throw error

      return ((data as Partner[]) || []).map(partner => ({
        ...partner,
        category_label: this.getCategoryLabel(partner.category),
        status_label: 'Активный',
      }))
    } catch (error: any) {
      console.error(`Error fetching partners for category ${category}:`, error)
      throw new Error(error.message || 'Failed to fetch partners')
    }
  }

  /**
   * Получить метку категории на русском
   */
  private static getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      platinum: 'Платиновый',
      gold: 'Золотой',
      silver: 'Серебряный',
      bronze: 'Бронзовый',
      other: 'Другое',
    }
    return labels[category] || category
  }

  /**
   * Проверяет, существует ли slug в базе данных
   */
  private static async checkSlugExists(slug: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('id')
        .eq('slug', slug)
        .limit(1)

      if (error) throw error
      return data && data.length > 0
    } catch (error) {
      console.error('Error checking slug:', error)
      return false
    }
  }

  /**
   * Генерирует slug из строки
   * Транслитерирует кириллицу, удаляет специальные символы
   */
  private static generateSlug(text: string): string {
    // Таблица транслитерации кириллицы
    const translitMap: Record<string, string> = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
      'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
      'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
      'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
      'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
      'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
      'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
      'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
      'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
    }

    return text
      .split('')
      .map(char => translitMap[char] || char)
      .join('')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-')
      .substring(0, 100) // Ограничим длину slug
  }
}

// Экспорт для удобства
export const supabasePartnersAPI = SupabasePartnersService

// Re-export Partner type
export type { Partner } from '@/types'

// Simple API wrapper for components
export const partnersAPI = {
  async fetchAll(params?: {
    status?: PartnerStatus
    category?: PartnerCategory
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<Partner[]> {
    const result = await SupabasePartnersService.getAll({
      status: params?.status,
      category: params?.category,
      per_page: 100, // Get all for frontend display
    })
    return result.data
  },

  async getById(id: number): Promise<Partner> {
    return SupabasePartnersService.getById(id)
  },

  async create(data: PartnerCreateData): Promise<Partner> {
    return SupabasePartnersService.create(data)
  },

  async update(id: number, data: PartnerUpdateData): Promise<Partner> {
    return SupabasePartnersService.update(id, data)
  },

  async delete(id: number): Promise<void> {
    return SupabasePartnersService.delete(id)
  },
}
