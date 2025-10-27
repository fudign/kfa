import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Lightbox } from '@/components/ui/Lightbox';
import { mediaAPI } from '@/services/api';
import { usePermission } from '@/hooks/usePermission';
import type { Media, PaginatedResponse } from '@/types';
import {
  Upload,
  Image as ImageIcon,
  FileText,
  File,
  Trash2,
  Search,
  Filter,
  Download,
  Eye
} from 'lucide-react';

export function MediaManagerPage() {
  const { can } = usePermission();
  const [media, setMedia] = useState<PaginatedResponse<Media> | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<Media | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter]);

  useEffect(() => {
    loadMedia(currentPage);
  }, [currentPage, searchTerm, typeFilter]);

  useEffect(() => {
    const dropZone = dropZoneRef.current;
    if (!dropZone) return;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.target === dropZone) {
        setIsDragging(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        uploadFiles(Array.from(files));
      }
    };

    dropZone.addEventListener('dragenter', handleDragEnter);
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);

    return () => {
      dropZone.removeEventListener('dragenter', handleDragEnter);
      dropZone.removeEventListener('dragover', handleDragOver);
      dropZone.removeEventListener('dragleave', handleDragLeave);
      dropZone.removeEventListener('drop', handleDrop);
    };
  }, []);

  const loadMedia = async (page: number = 1) => {
    try {
      setLoading(true);
      const params: any = { page };
      if (searchTerm) params.search = searchTerm;
      if (typeFilter) params.type = typeFilter;

      const response = await mediaAPI.getAll(params);
      setMedia(response);
    } catch (error) {
      console.error('Error loading media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;

    try {
      setUploading(true);

      for (const file of files) {
        const fileId = `${file.name}-${Date.now()}`;
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

        try {
          // Симуляция прогресса (в реальности нужно axios onUploadProgress)
          const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
              const current = prev[fileId] || 0;
              if (current >= 90) {
                clearInterval(progressInterval);
                return prev;
              }
              return { ...prev, [fileId]: current + 10 };
            });
          }, 100);

          await mediaAPI.upload(file, 'default');

          clearInterval(progressInterval);
          setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));

          // Удалить прогресс через 1 секунду
          setTimeout(() => {
            setUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[fileId];
              return newProgress;
            });
          }, 1000);
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        }
      }

      await loadMedia();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Ошибка при загрузке файлов');
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    await uploadFiles(Array.from(files));
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот файл?')) return;

    try {
      await mediaAPI.delete(id);
      await loadMedia();
      // setSelectedMedia(null);
    } catch (error) {
      console.error('Error deleting media:', error);
      alert('Ошибка при удалении файла');
    }
  };

  const getFileIcon = (media: Media) => {
    if (media.is_image) return <ImageIcon className="h-5 w-5" />;
    if (media.is_pdf) return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  return (
    <DashboardLayout>
      <div ref={dropZoneRef} className="relative space-y-5 md:space-y-6">
        {/* Drag & Drop Overlay */}
        {isDragging && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-900/90 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 text-white">
              <Upload className="h-16 w-16 animate-bounce" />
              <p className="text-2xl font-bold">Перетащите файлы сюда</p>
              <p className="text-neutral-200">Отпустите, чтобы начать загрузку</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-1 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:mb-2 md:text-3xl">
              Управление медиафайлами
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 md:text-base">
              Загрузка и управление изображениями и документами
            </p>
          </div>
          {can('media.upload') && (
            <button
              onClick={handleFileSelect}
              disabled={uploading}
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              {uploading ? 'Загрузка...' : 'Загрузить файл'}
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Поиск файлов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-neutral-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-700 dark:bg-neutral-800"
            >
              <option value="">Все типы</option>
              <option value="image">Изображения</option>
              <option value="application/pdf">PDF</option>
              <option value="application">Документы</option>
            </select>
          </div>
        </div>

        {/* Upload Progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="space-y-3 rounded-lg border border-primary-200 bg-primary-50 p-4 dark:border-primary-800 dark:bg-primary-900/20">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary-900 dark:text-primary-100">
              <Upload className="h-4 w-4 animate-pulse" />
              <span>Загрузка файлов ({Object.keys(uploadProgress).length})</span>
            </div>
            <div className="space-y-2">
              {Object.entries(uploadProgress).map(([fileId, progress]) => {
                const fileName = fileId.split('-').slice(0, -1).join('-');
                return (
                  <div key={fileId} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="truncate font-medium text-neutral-700 dark:text-neutral-300">
                        {fileName}
                      </span>
                      <span className="ml-2 font-semibold text-primary-700 dark:text-primary-400">
                        {progress}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Media Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
          </div>
        ) : media?.data && media.data.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {media.data.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-white p-3 transition-all hover:border-primary-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
              >
                {/* Preview */}
                <div className="mb-3 flex h-40 items-center justify-center overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-700">
                  {item.is_image ? (
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-neutral-400">
                      {getFileIcon(item)}
                      <span className="text-xs">{item.mime_type.split('/')[1]?.toUpperCase()}</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100" title={item.filename}>
                    {item.filename}
                  </p>
                  <p className="text-xs text-neutral-500">{item.human_size}</p>
                  {item.width && item.height && (
                    <p className="text-xs text-neutral-500">
                      {item.width} × {item.height}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => item.is_image ? setLightboxImage(item) : window.open(item.url, '_blank')}
                    className="rounded-lg bg-white/90 p-2 text-primary-600 shadow-md transition-colors hover:bg-white dark:bg-neutral-800/90 dark:hover:bg-neutral-800"
                    title="Просмотр"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <a
                    href={item.url}
                    download={item.filename}
                    className="rounded-lg bg-white/90 p-2 text-primary-600 shadow-md transition-colors hover:bg-white dark:bg-neutral-800/90 dark:hover:bg-neutral-800"
                    title="Скачать"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                  {can('media.delete') && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="rounded-lg bg-white/90 p-2 text-red-600 shadow-md transition-colors hover:bg-white dark:bg-neutral-800/90 dark:hover:bg-neutral-800"
                      title="Удалить"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 py-12 dark:border-neutral-700">
            <Upload className="mb-3 h-12 w-12 text-neutral-400" />
            <p className="mb-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Нет файлов
            </p>
            <p className="mb-4 text-sm text-neutral-500">
              Загрузите файлы, чтобы начать работу
            </p>
            <button
              onClick={handleFileSelect}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Загрузить первый файл
            </button>
          </div>
        )}

        {/* Pagination */}
        {media && media.meta.last_page > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!media.links.prev}
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Назад
            </button>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              Страница {media.meta.current_page} из {media.meta.last_page}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!media.links.next}
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Вперед
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <Lightbox
          isOpen={!!lightboxImage}
          imageUrl={lightboxImage.url}
          imageAlt={lightboxImage.filename}
          onClose={() => setLightboxImage(null)}
          onPrev={() => {
            const images = media?.data.filter(item => item.is_image) || [];
            const currentIndex = images.findIndex(img => img.id === lightboxImage.id);
            if (currentIndex > 0) {
              setLightboxImage(images[currentIndex - 1]);
            }
          }}
          onNext={() => {
            const images = media?.data.filter(item => item.is_image) || [];
            const currentIndex = images.findIndex(img => img.id === lightboxImage.id);
            if (currentIndex < images.length - 1) {
              setLightboxImage(images[currentIndex + 1]);
            }
          }}
          hasPrev={(() => {
            const images = media?.data.filter(item => item.is_image) || [];
            const currentIndex = images.findIndex(img => img.id === lightboxImage.id);
            return currentIndex > 0;
          })()}
          hasNext={(() => {
            const images = media?.data.filter(item => item.is_image) || [];
            const currentIndex = images.findIndex(img => img.id === lightboxImage.id);
            return currentIndex < images.length - 1;
          })()}
        />
      )}
    </DashboardLayout>
  );
}
