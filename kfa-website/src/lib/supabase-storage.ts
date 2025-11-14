/**
 * Supabase Storage Service
 * Прямая работа с Supabase Storage для загрузки файлов
 */

import { supabase } from './supabase'

export interface UploadOptions {
  bucket?: string
  folder?: string
}

export interface UploadResult {
  url: string
  path: string
  fullPath: string
}

export class SupabaseStorageService {
  /**
   * Загрузить файл в Supabase Storage
   */
  static async uploadFile(
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const {
      bucket = 'media',
      folder = 'partners',
    } = options

    try {
      // Генерируем уникальное имя файла
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = folder ? `${folder}/${fileName}` : fileName

      // Загружаем файл
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        console.error('Supabase storage upload error:', error)
        throw new Error(`Failed to upload file: ${error.message}`)
      }

      // Получаем публичный URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)

      return {
        url: urlData.publicUrl,
        path: data.path,
        fullPath: data.fullPath || data.path,
      }
    } catch (error: any) {
      console.error('Error uploading file:', error)
      throw new Error(error.message || 'Failed to upload file')
    }
  }

  /**
   * Удалить файл из Supabase Storage
   */
  static async deleteFile(path: string, bucket: string = 'media'): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])

      if (error) {
        console.error('Supabase storage delete error:', error)
        throw new Error(`Failed to delete file: ${error.message}`)
      }
    } catch (error: any) {
      console.error('Error deleting file:', error)
      throw new Error(error.message || 'Failed to delete file')
    }
  }

  /**
   * Получить публичный URL для файла
   */
  static getPublicUrl(path: string, bucket: string = 'media'): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return data.publicUrl
  }

  /**
   * Проверить, существует ли файл
   */
  static async fileExists(path: string, bucket: string = 'media'): Promise<boolean> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path.split('/').slice(0, -1).join('/'), {
          search: path.split('/').pop(),
        })

      if (error) return false
      return data && data.length > 0
    } catch {
      return false
    }
  }

  /**
   * Получить список файлов в папке
   */
  static async listFiles(
    folder: string = '',
    bucket: string = 'media'
  ): Promise<any[]> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        })

      if (error) {
        console.error('Supabase storage list error:', error)
        throw new Error(`Failed to list files: ${error.message}`)
      }

      return data || []
    } catch (error: any) {
      console.error('Error listing files:', error)
      throw new Error(error.message || 'Failed to list files')
    }
  }
}

// Экспорт для удобства
export const storageService = SupabaseStorageService
