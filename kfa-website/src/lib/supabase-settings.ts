/**
 * Supabase Settings Service
 * Управление настройками сайта через Supabase
 */

import { supabase } from './supabase'

export interface SiteSetting {
  id: number
  key: string
  value: string | null
  type: 'string' | 'text' | 'number' | 'boolean' | 'email' | 'url'
  category: string
  label: string | null
  description: string | null
  created_at: string
  updated_at: string
}

export interface SettingUpdate {
  key: string
  value: string
}

export class SupabaseSettingsService {
  private static readonly TABLE = 'settings'

  /**
   * Получить все настройки, сгруппированные по категориям
   */
  static async getAll(): Promise<Record<string, SiteSetting[]>> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('*')
        .order('category')
        .order('key')

      if (error) throw error

      // Группируем настройки по категориям
      const grouped: Record<string, SiteSetting[]> = {}

      data?.forEach((setting) => {
        const category = setting.category || 'general'
        if (!grouped[category]) {
          grouped[category] = []
        }
        grouped[category].push(setting as SiteSetting)
      })

      return grouped
    } catch (error: any) {
      console.error('Error fetching settings:', error)
      throw new Error(error.message || 'Failed to fetch settings')
    }
  }

  /**
   * Получить настройку по ключу
   */
  static async getByKey(key: string): Promise<SiteSetting | null> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('*')
        .eq('key', key)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          return null
        }
        throw error
      }

      return data as SiteSetting
    } catch (error: any) {
      console.error(`Error fetching setting ${key}:`, error)
      throw new Error(error.message || 'Failed to fetch setting')
    }
  }

  /**
   * Получить значение настройки по ключу
   */
  static async getValue(key: string, defaultValue: any = null): Promise<any> {
    try {
      const setting = await this.getByKey(key)
      if (!setting || setting.value === null) {
        return defaultValue
      }

      // Преобразуем значение в соответствии с типом
      switch (setting.type) {
        case 'number':
          return parseFloat(setting.value) || defaultValue
        case 'boolean':
          return setting.value === 'true' || setting.value === '1'
        default:
          return setting.value
      }
    } catch (error) {
      console.error(`Error getting value for ${key}:`, error)
      return defaultValue
    }
  }

  /**
   * Обновить настройку
   */
  static async updateSetting(key: string, value: string): Promise<SiteSetting> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .update({
          value,
          updated_at: new Date().toISOString()
        })
        .eq('key', key)
        .select()
        .single()

      if (error) throw error
      if (!data) throw new Error('Setting not found')

      return data as SiteSetting
    } catch (error: any) {
      console.error(`Error updating setting ${key}:`, error)
      throw new Error(error.message || 'Failed to update setting')
    }
  }

  /**
   * Обновить несколько настроек
   */
  static async update(settings: SettingUpdate[]): Promise<void> {
    try {
      // Обновляем каждую настройку
      const promises = settings.map(({ key, value }) =>
        this.updateSetting(key, value)
      )

      await Promise.all(promises)
    } catch (error: any) {
      console.error('Error updating settings:', error)
      throw new Error(error.message || 'Failed to update settings')
    }
  }

  /**
   * Создать новую настройку
   */
  static async create(setting: Omit<SiteSetting, 'id' | 'created_at' | 'updated_at'>): Promise<SiteSetting> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .insert({
          key: setting.key,
          value: setting.value,
          type: setting.type || 'string',
          category: setting.category || 'general',
          label: setting.label,
          description: setting.description,
        })
        .select()
        .single()

      if (error) throw error
      if (!data) throw new Error('Failed to create setting')

      return data as SiteSetting
    } catch (error: any) {
      console.error('Error creating setting:', error)
      throw new Error(error.message || 'Failed to create setting')
    }
  }

  /**
   * Удалить настройку
   */
  static async delete(key: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.TABLE)
        .delete()
        .eq('key', key)

      if (error) throw error
    } catch (error: any) {
      console.error(`Error deleting setting ${key}:`, error)
      throw new Error(error.message || 'Failed to delete setting')
    }
  }

  /**
   * Получить настройки по категории
   */
  static async getByCategory(category: string): Promise<SiteSetting[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('*')
        .eq('category', category)
        .order('key')

      if (error) throw error

      return (data as SiteSetting[]) || []
    } catch (error: any) {
      console.error(`Error fetching settings for category ${category}:`, error)
      throw new Error(error.message || 'Failed to fetch settings')
    }
  }

  /**
   * Получить список всех категорий
   */
  static async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('category')
        .order('category')

      if (error) throw error

      // Получаем уникальные категории
      const categories = [...new Set(data?.map((s) => s.category || 'general') || [])]
      return categories
    } catch (error: any) {
      console.error('Error fetching categories:', error)
      throw new Error(error.message || 'Failed to fetch categories')
    }
  }
}

// Экспорт для удобства
export const supabaseSettingsAPI = SupabaseSettingsService
