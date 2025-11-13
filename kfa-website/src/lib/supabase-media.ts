/**
 * Supabase Media Service
 * Direct CRUD operations on media table and Supabase Storage
 */

import { supabase } from './supabase'
import type { Media, PaginatedResponse } from '@/types'

export class SupabaseMediaService {
  private static readonly TABLE = 'media'
  private static readonly BUCKET = 'media' // Supabase Storage bucket name
  private static readonly PER_PAGE = 20

  /**
   * Получить список медиафайлов с фильтрацией и пагинацией
   */
  static async getAll(params?: {
    type?: string
    collection?: string
    search?: string
    page?: number
    per_page?: number
  }): Promise<PaginatedResponse<Media>> {
    try {
      let query = supabase
        .from(this.TABLE)
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      // Фильтр по типу файла
      if (params?.type) {
        query = query.ilike('mime_type', `${params.type}%`)
      }

      // Фильтр по коллекции
      if (params?.collection) {
        query = query.eq('collection', params.collection)
      }

      // Поиск
      if (params?.search) {
        query = query.or(
          `filename.ilike.%${params.search}%,alt_text.ilike.%${params.search}%,description.ilike.%${params.search}%`
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
        data: data as Media[],
        meta: {
          current_page: page,
          from: from + 1,
          last_page: totalPages,
          path: '/media',
          per_page: perPage,
          to: Math.min(to + 1, count || 0),
          total: count || 0,
        },
        links: {
          first: `/media?page=1`,
          last: `/media?page=${totalPages}`,
          prev: page > 1 ? `/media?page=${page - 1}` : null,
          next: page < totalPages ? `/media?page=${page + 1}` : null,
        },
      }
    } catch (error: any) {
      console.error('Error fetching media:', error)
      throw new Error(error.message || 'Failed to fetch media')
    }
  }

  /**
   * Получить один медиафайл по ID
   */
  static async getById(id: string | number): Promise<Media> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (!data) throw new Error('Media not found')

      return data as Media
    } catch (error: any) {
      console.error(`Error fetching media ${id}:`, error)
      throw new Error(error.message || 'Failed to fetch media')
    }
  }

  /**
   * Загрузить файл в Supabase Storage и создать запись в БД
   */
  static async upload(
    file: File,
    collection?: string
  ): Promise<Media> {
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Генерируем уникальное имя файла
      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substring(2, 15)
      const ext = file.name.split('.').pop()
      const filename = `${timestamp}-${randomStr}.${ext}`
      const path = collection ? `${collection}/${filename}` : filename

      // Загружаем файл в Storage
      const { error: uploadError } = await supabase.storage
        .from(this.BUCKET)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Получаем публичный URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(this.BUCKET).getPublicUrl(path)

      // Создаём запись в таблице media
      const { data: mediaData, error: dbError } = await supabase
        .from(this.TABLE)
        .insert({
          filename,
          original_filename: file.name,
          path,
          url: publicUrl,
          mime_type: file.type,
          size: file.size,
          collection,
          uploader_id: user.id,
        })
        .select()
        .single()

      if (dbError) {
        // Если не удалось создать запись в БД, удаляем файл из Storage
        await supabase.storage.from(this.BUCKET).remove([path])
        throw dbError
      }

      if (!mediaData) throw new Error('Failed to create media record')

      return mediaData as Media
    } catch (error: any) {
      console.error('Error uploading media:', error)
      throw new Error(error.message || 'Failed to upload media')
    }
  }

  /**
   * Обновить метаданные медиафайла
   */
  static async update(
    id: string | number,
    data: { filename?: string; alt_text?: string; description?: string; collection?: string }
  ): Promise<Media> {
    try {
      const { data: mediaData, error } = await supabase
        .from(this.TABLE)
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      if (!mediaData) throw new Error('Media not found')

      return mediaData as Media
    } catch (error: any) {
      console.error(`Error updating media ${id}:`, error)
      throw new Error(error.message || 'Failed to update media')
    }
  }

  /**
   * Удалить медиафайл (из Storage и БД)
   */
  static async delete(id: string | number): Promise<void> {
    try {
      // Сначала получаем информацию о файле
      const media = await this.getById(id)

      // Удаляем файл из Storage
      const { error: storageError } = await supabase.storage
        .from(this.BUCKET)
        .remove([media.path])

      if (storageError) {
        console.warn('Failed to delete file from storage:', storageError)
        // Продолжаем даже если не удалось удалить из Storage
      }

      // Удаляем запись из БД
      const { error: dbError } = await supabase.from(this.TABLE).delete().eq('id', id)

      if (dbError) throw dbError
    } catch (error: any) {
      console.error(`Error deleting media ${id}:`, error)
      throw new Error(error.message || 'Failed to delete media')
    }
  }

  /**
   * Получить медиафайлы по коллекции
   */
  static async getByCollection(collection: string, limit = 50): Promise<Media[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('*')
        .eq('collection', collection)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return (data as Media[]) || []
    } catch (error: any) {
      console.error(`Error fetching media for collection ${collection}:`, error)
      throw new Error(error.message || 'Failed to fetch media')
    }
  }

  /**
   * Получить изображения (только картинки)
   */
  static async getImages(limit = 50): Promise<Media[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('*')
        .ilike('mime_type', 'image%')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return (data as Media[]) || []
    } catch (error: any) {
      console.error('Error fetching images:', error)
      throw new Error(error.message || 'Failed to fetch images')
    }
  }

  /**
   * Загрузить изображение с уменьшением размера (если нужно)
   */
  static async uploadImage(
    file: File,
    collection?: string,
    _maxWidth = 1920,
    _maxHeight = 1920
  ): Promise<Media> {
    // Для простоты пока используем обычную загрузку
    // В будущем можно добавить ресайз через canvas
    return this.upload(file, collection)
  }

  /**
   * Создать или проверить существование storage bucket
   */
  static async ensureBucketExists(): Promise<void> {
    try {
      const { data: buckets } = await supabase.storage.listBuckets()
      const bucketExists = buckets?.some((b) => b.name === this.BUCKET)

      if (!bucketExists) {
        const { error } = await supabase.storage.createBucket(this.BUCKET, {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        })

        if (error) throw error
      }
    } catch (error: any) {
      console.error('Error ensuring bucket exists:', error)
      // Не бросаем ошибку, т.к. bucket может существовать, но у пользователя нет прав на listBuckets
    }
  }
}

// Экспорт экземпляра для удобства
export const supabaseMediaAPI = SupabaseMediaService
