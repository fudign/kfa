/**
 * Supabase Members Service
 * Управление участниками КФА через Supabase
 */

import { supabase } from './supabase'
import type { Member, PaginatedResponse } from '@/types'

export interface MemberCreateData {
  name: string
  email: string
  company?: string
  position?: string
  phone?: string
  photo?: string
  bio?: string
  joined_at?: string
}

export interface MemberUpdateData extends Partial<MemberCreateData> {}

export class SupabaseMembersService {
  private static readonly TABLE = 'members'
  private static readonly PER_PAGE = 20

  /**
   * Получить всех участников с фильтрацией и пагинацией
   */
  static async getAll(params?: {
    search?: string
    company?: string
    page?: number
    per_page?: number
  }): Promise<PaginatedResponse<Member>> {
    try {
      let query = supabase
        .from(this.TABLE)
        .select('*', { count: 'exact' })
        .order('name', { ascending: true })

      // Поиск по имени или email
      if (params?.search) {
        query = query.or(
          `name.ilike.%${params.search}%,email.ilike.%${params.search}%`
        )
      }

      // Фильтр по компании
      if (params?.company) {
        query = query.ilike('company', `%${params.company}%`)
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
        data: data as Member[],
        meta: {
          current_page: page,
          from: from + 1,
          last_page: totalPages,
          path: '/members',
          per_page: perPage,
          to: Math.min(to + 1, count || 0),
          total: count || 0,
        },
        links: {
          first: `/members?page=1`,
          last: `/members?page=${totalPages}`,
          prev: page > 1 ? `/members?page=${page - 1}` : null,
          next: page < totalPages ? `/members?page=${page + 1}` : null,
        },
      }
    } catch (error: any) {
      console.error('Error fetching members:', error)
      throw new Error(error.message || 'Failed to fetch members')
    }
  }

  /**
   * Получить участника по ID
   */
  static async getById(id: string | number): Promise<Member> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Member not found')
        }
        throw error
      }

      return data as Member
    } catch (error: any) {
      console.error(`Error fetching member ${id}:`, error)
      throw new Error(error.message || 'Failed to fetch member')
    }
  }

  /**
   * Создать участника
   */
  static async create(memberData: MemberCreateData): Promise<Member> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .insert({
          name: memberData.name,
          email: memberData.email,
          company: memberData.company,
          position: memberData.position,
          phone: memberData.phone,
          photo: memberData.photo,
          bio: memberData.bio,
          joined_at: memberData.joined_at || new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      if (!data) throw new Error('Failed to create member')

      return data as Member
    } catch (error: any) {
      console.error('Error creating member:', error)
      throw new Error(error.message || 'Failed to create member')
    }
  }

  /**
   * Обновить участника
   */
  static async update(id: string | number, memberData: MemberUpdateData): Promise<Member> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .update({
          ...memberData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      if (!data) throw new Error('Member not found')

      return data as Member
    } catch (error: any) {
      console.error(`Error updating member ${id}:`, error)
      throw new Error(error.message || 'Failed to update member')
    }
  }

  /**
   * Удалить участника
   */
  static async delete(id: string | number): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.TABLE)
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error: any) {
      console.error(`Error deleting member ${id}:`, error)
      throw new Error(error.message || 'Failed to delete member')
    }
  }

  /**
   * Получить участников по компании
   */
  static async getByCompany(company: string, limit = 50): Promise<Member[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('*')
        .eq('company', company)
        .order('name', { ascending: true })
        .limit(limit)

      if (error) throw error

      return (data as Member[]) || []
    } catch (error: any) {
      console.error(`Error fetching members for company ${company}:`, error)
      throw new Error(error.message || 'Failed to fetch members')
    }
  }

  /**
   * Поиск участников
   */
  static async search(query: string, limit = 20): Promise<Member[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%,position.ilike.%${query}%`)
        .order('name', { ascending: true })
        .limit(limit)

      if (error) throw error

      return (data as Member[]) || []
    } catch (error: any) {
      console.error('Error searching members:', error)
      throw new Error(error.message || 'Failed to search members')
    }
  }
}

// Экспорт для удобства
export const supabaseMembersAPI = SupabaseMembersService
