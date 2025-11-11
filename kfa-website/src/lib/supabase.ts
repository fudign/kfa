/**
 * Supabase Client Configuration
 *
 * Provides Supabase client for accessing Storage and Database
 */

import { createClient } from '@supabase/supabase-js'

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!')
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

/**
 * Get public URL for a file in Supabase Storage
 * @param path - File path in the bucket
 * @param bucket - Bucket name (default: 'media')
 * @returns Public URL for the file
 */
export const getPublicUrl = (path: string, bucket: string = 'media'): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Upload a file to Supabase Storage
 * @param file - File to upload
 * @param path - Destination path in the bucket
 * @param bucket - Bucket name (default: 'media')
 * @returns Upload result with path and URL
 */
export const uploadFile = async (
  file: File,
  path: string,
  bucket: string = 'media'
) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw error
    }

    // Get public URL for uploaded file
    const publicUrl = getPublicUrl(path, bucket)

    return {
      success: true,
      data: {
        ...data,
        url: publicUrl
      }
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Delete a file from Supabase Storage
 * @param path - File path in the bucket
 * @param bucket - Bucket name (default: 'media')
 * @returns Delete result
 */
export const deleteFile = async (path: string, bucket: string = 'media') => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      throw error
    }

    return {
      success: true
    }
  } catch (error) {
    console.error('Error deleting file:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * List files in a Supabase Storage bucket
 * @param path - Folder path to list (default: '')
 * @param bucket - Bucket name (default: 'media')
 * @returns List of files
 */
export const listFiles = async (path: string = '', bucket: string = 'media') => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (error) {
      throw error
    }

    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('Error listing files:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Download a file from Supabase Storage
 * @param path - File path in the bucket
 * @param bucket - Bucket name (default: 'media')
 * @returns File blob
 */
export const downloadFile = async (path: string, bucket: string = 'media') => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path)

    if (error) {
      throw error
    }

    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('Error downloading file:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Generate a signed URL for private files
 * @param path - File path in the bucket
 * @param expiresIn - Expiration time in seconds (default: 3600 = 1 hour)
 * @param bucket - Bucket name (default: 'documents')
 * @returns Signed URL
 */
export const createSignedUrl = async (
  path: string,
  expiresIn: number = 3600,
  bucket: string = 'documents'
) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)

    if (error) {
      throw error
    }

    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('Error creating signed URL:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Export types
export type { SupabaseClient } from '@supabase/supabase-js'
