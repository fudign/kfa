import { useState, useEffect, useRef, useCallback } from 'react';
import { mediaAPI } from '@/services/api';
import type { Media, PaginatedResponse } from '@/types';
import {
  Upload,
  Image as ImageIcon,
  FileText,
  File,
  Search,
  X,
  Check,
} from 'lucide-react';

interface MediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: Media | Media[]) => void;
  multiple?: boolean;
  accept?: 'image' | 'document' | 'all';
  selectedIds?: number[];
}

export function MediaPicker({
  isOpen,
  onClose,
  onSelect,
  multiple = false,
  accept = 'all',
  selectedIds = [],
}: MediaPickerProps) {
  const [media, setMedia] = useState<PaginatedResponse<Media> | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<number[]>(selectedIds);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchTerm) params.search = searchTerm;

      // Apply type filter based on accept prop
      if (accept === 'image') {
        params.type = 'image';
      } else if (accept === 'document') {
        params.type = 'application';
      }

      const response = await mediaAPI.getAll(params);
      setMedia(response);
    } catch (error) {
      console.error('Error loading media:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, accept]);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen, loadMedia]);

  useEffect(() => {
    setSelected(selectedIds);
  }, [selectedIds]);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);

      for (const file of Array.from(files)) {
        await mediaAPI.upload(file, 'picker');
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

  const toggleSelect = (mediaItem: Media) => {
    if (multiple) {
      if (selected.includes(mediaItem.id)) {
        setSelected(selected.filter((id) => id !== mediaItem.id));
      } else {
        setSelected([...selected, mediaItem.id]);
      }
    } else {
      setSelected([mediaItem.id]);
    }
  };

  const handleConfirm = () => {
    if (selected.length === 0) return;

    const selectedMedia = media?.data.filter((item) => selected.includes(item.id)) || [];

    if (multiple) {
      onSelect(selectedMedia);
    } else {
      onSelect(selectedMedia[0]);
    }

    onClose();
  };

  const getFileIcon = (mediaItem: Media) => {
    if (mediaItem.is_image) return <ImageIcon className="h-5 w-5" />;
    if (mediaItem.is_pdf) return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const getAcceptString = () => {
    if (accept === 'image') return 'image/*';
    if (accept === 'document') return '.pdf,.doc,.docx';
    return 'image/*,.pdf,.doc,.docx';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex h-full max-h-[90vh] w-full max-w-5xl flex-col rounded-lg bg-white shadow-xl dark:bg-neutral-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 p-4 dark:border-neutral-700">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              Выбор медиафайлов
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {multiple
                ? `Выбрано: ${selected.length}`
                : selected.length > 0
                ? 'Выбран 1 файл'
                : 'Выберите файл'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 dark:border-neutral-700 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Поиск файлов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
          <button
            onClick={handleFileSelect}
            disabled={uploading}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {uploading ? 'Загрузка...' : 'Загрузить'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={getAcceptString()}
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
            </div>
          ) : media?.data && media.data.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {media.data.map((item) => {
                const isSelected = selected.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleSelect(item)}
                    className={`group relative overflow-hidden rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-primary-500 ring-2 ring-primary-500/20'
                        : 'border-neutral-200 hover:border-primary-300 dark:border-neutral-700'
                    }`}
                  >
                    {/* Preview */}
                    <div className="flex h-32 items-center justify-center overflow-hidden bg-neutral-100 dark:bg-neutral-700">
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
                    <div className="bg-white p-2 dark:bg-neutral-800">
                      <p
                        className="truncate text-xs font-medium text-neutral-900 dark:text-neutral-100"
                        title={item.filename}
                      >
                        {item.filename}
                      </p>
                      <p className="text-xs text-neutral-500">{item.human_size}</p>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-white shadow-md">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Upload className="mb-3 h-12 w-12 text-neutral-400" />
              <p className="mb-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Нет файлов
              </p>
              <p className="mb-4 text-sm text-neutral-500">
                Загрузите файлы, чтобы выбрать их
              </p>
              <button
                onClick={handleFileSelect}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
              >
                Загрузить файлы
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-neutral-200 p-4 dark:border-neutral-700">
          <button
            onClick={onClose}
            className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
          >
            Отмена
          </button>
          <button
            onClick={handleConfirm}
            disabled={selected.length === 0}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
          >
            Выбрать {selected.length > 0 && `(${selected.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
