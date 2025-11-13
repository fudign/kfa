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
      const { data, error } = await supabase
        .from(this.TABLE)
        .insert({
          name: partnerData.name,
          description: partnerData.description,
          logo: partnerData.logo,
          website: partnerData.website,
          email: partnerData.email,
          phone: partnerData.phone,
          category: partnerData.category,
          status: partnerData.status,
          is_featured: partnerData.is_featured,
          display_order: partnerData.display_order,
        })
        .select()
        .single()

      if (error) throw error
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
      const { data, error } = await supabase
        .from(this.TABLE)
        .update({
          ...partnerData,
          updated_at: new Date().toISOString(),
        })
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
}

// Экспорт для удобства
export const supabasePartnersAPI = SupabasePartnersService
