/**
 * Supabase Applications Service
 * Управление заявками на членство через Supabase
 */

import { supabase } from './supabase'

export type MembershipType = 'individual' | 'corporate'
export type ApplicationStatus = 'pending' | 'reviewing' | 'approved' | 'rejected'

export interface MembershipApplicationData {
  membershipType: MembershipType
  firstName: string
  lastName: string
  organizationName?: string
  position: string
  email: string
  phone: string
  experience: string
  motivation: string
}

export interface MembershipApplication {
  id: number
  membership_type: MembershipType
  first_name: string
  last_name: string
  organization_name?: string
  position: string
  email: string
  phone: string
  experience: string
  motivation: string
  status: ApplicationStatus
  reviewed_by?: number
  reviewed_at?: string
  admin_notes?: string
  rejection_reason?: string
  created_at: string
  updated_at: string
  user_id?: number
}

export class SupabaseApplicationsService {
  private static readonly TABLE = 'membership_applications'

  /**
   * Отправить заявку на членство
   */
  static async submit(data: MembershipApplicationData): Promise<{ success: boolean; application?: MembershipApplication }> {
    try {
      const { data: insertData, error } = await supabase
        .from(this.TABLE)
        .insert({
          membership_type: data.membershipType,
          first_name: data.firstName,
          last_name: data.lastName,
          organization_name: data.organizationName || null,
          position: data.position,
          email: data.email,
          phone: data.phone,
          experience: data.experience,
          motivation: data.motivation,
          status: 'pending',
        })
        .select()
        .single()

      if (error) {
        console.error('Error submitting application:', error)
        throw new Error(error.message || 'Failed to submit application')
      }

      return {
        success: true,
        application: insertData as MembershipApplication
      }
    } catch (error: any) {
      console.error('Error submitting application:', error)
      throw new Error(error.message || 'Failed to submit application')
    }
  }

  /**
   * Получить все заявки (для админов)
   */
  static async getAll(params?: {
    status?: ApplicationStatus
    search?: string
    page?: number
    per_page?: number
  }) {
    try {
      let query = supabase
        .from(this.TABLE)
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      // Фильтр по статусу
      if (params?.status) {
        query = query.eq('status', params.status)
      }

      // Поиск
      if (params?.search) {
        query = query.or(
          `first_name.ilike.%${params.search}%,last_name.ilike.%${params.search}%,email.ilike.%${params.search}%,organization_name.ilike.%${params.search}%`
        )
      }

      // Пагинация
      const page = params?.page || 1
      const perPage = params?.per_page || 20
      const from = (page - 1) * perPage
      const to = from + perPage - 1

      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      return {
        data: data as MembershipApplication[],
        total: count || 0,
        page,
        per_page: perPage,
        total_pages: count ? Math.ceil(count / perPage) : 0,
      }
    } catch (error: any) {
      console.error('Error fetching applications:', error)
      throw new Error(error.message || 'Failed to fetch applications')
    }
  }

  /**
   * Получить заявку по ID
   */
  static async getById(id: number): Promise<MembershipApplication> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as MembershipApplication
    } catch (error: any) {
      console.error('Error fetching application:', error)
      throw new Error(error.message || 'Failed to fetch application')
    }
  }

  /**
   * Обновить статус заявки
   */
  static async updateStatus(
    id: number,
    status: ApplicationStatus,
    adminNotes?: string,
    rejectionReason?: string
  ): Promise<MembershipApplication> {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      const updateData: any = {
        status,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
      }

      if (adminNotes) updateData.admin_notes = adminNotes
      if (rejectionReason) updateData.rejection_reason = rejectionReason

      const { data, error } = await supabase
        .from(this.TABLE)
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as MembershipApplication
    } catch (error: any) {
      console.error('Error updating application status:', error)
      throw new Error(error.message || 'Failed to update application')
    }
  }

  /**
   * Удалить заявку
   */
  static async delete(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.TABLE)
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error: any) {
      console.error('Error deleting application:', error)
      throw new Error(error.message || 'Failed to delete application')
    }
  }

  /**
   * Получить статистику по заявкам
   */
  static async getStatistics() {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('status')

      if (error) throw error

      const stats = {
        total: data.length,
        pending: data.filter(a => a.status === 'pending').length,
        reviewing: data.filter(a => a.status === 'reviewing').length,
        approved: data.filter(a => a.status === 'approved').length,
        rejected: data.filter(a => a.status === 'rejected').length,
      }

      return stats
    } catch (error: any) {
      console.error('Error fetching statistics:', error)
      throw new Error(error.message || 'Failed to fetch statistics')
    }
  }
}

// Экспорт для удобства
export const applicationsService = SupabaseApplicationsService
