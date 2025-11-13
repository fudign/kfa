import { useState, useRef, DragEvent } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ImageUploadZoneProps {
  value?: string;
  onChange: (url: string, mediaId?: number) => void;
  onError?: (error: string) => void;
}

export function ImageUploadZone({
  value,
  onChange,
  onError,
}: ImageUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith('image/'));

    if (imageFile) {
      await uploadFile(imageFile);
    } else {
      onError?.('Пожалуйста, загрузите файл изображения');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onError?.('Размер файла не должен превышать 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onError?.('Можно загружать только изображения');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Не авторизован');

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `news/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      setUploadProgress(50);

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('media').getPublicUrl(filePath);

      setUploadProgress(75);

      // Save to media table
      const { data: mediaData, error: mediaError } = await supabase
        .from('media')
        .insert({
          filename: file.name,
          path: filePath,
          url: publicUrl,
          mime_type: file.type,
          size: file.size,
          uploaded_by: user.id,
          type: 'image',
          alt_text: file.name,
        })
        .select()
        .single();

      if (mediaError) throw mediaError;

      setUploadProgress(100);

      // Call onChange with the public URL and media ID
      onChange(publicUrl, mediaData.id);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error: any) {
      console.error('Upload error:', error);
      onError?.(error.message || 'Ошибка загрузки изображения');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (value) {
    return (
      <div className="relative inline-block">
        <img
          src={value}
          alt="Загруженное изображение"
          className="w-full max-w-md h-64 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
        />
        <button
          type="button"
          onClick={handleRemove}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
          title="Удалить изображение"
        >
          <X className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg px-3 py-2 shadow-lg transition-colors flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Изменить
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragging
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
          }
          ${isUploading ? 'pointer-events-none opacity-75' : ''}
        `}
      >
        {isUploading ? (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 mx-auto text-primary-600 animate-spin" />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Загрузка... {uploadProgress}%
              </p>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary-600 h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                isDragging
                  ? 'bg-primary-100 dark:bg-primary-800'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              <ImageIcon
                className={`w-8 h-8 ${
                  isDragging
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="text-primary-600 dark:text-primary-400">
                  Нажмите для выбора
                </span>{' '}
                или перетащите изображение
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                PNG, JPG, GIF до 5MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
