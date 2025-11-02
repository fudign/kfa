import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface LightboxProps {
  isOpen: boolean;
  imageUrl: string;
  imageAlt?: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export function Lightbox({
  isOpen,
  imageUrl,
  imageAlt = 'Image',
  onClose,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}: LightboxProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && hasPrev && onPrev) {
        onPrev();
      } else if (e.key === 'ArrowRight' && hasNext && onNext) {
        onNext();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, hasPrev, hasNext, onClose, onPrev, onNext]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = imageAlt || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-lg bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
        title="Закрыть (Esc)"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Download button */}
      <button
        onClick={handleDownload}
        className="absolute right-16 top-4 z-10 rounded-lg bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
        title="Скачать"
      >
        <Download className="h-6 w-6" />
      </button>

      {/* Previous button */}
      {hasPrev && onPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-lg bg-black/50 p-3 text-white transition-colors hover:bg-black/70"
          title="Предыдущее (←)"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      )}

      {/* Next button */}
      {hasNext && onNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-lg bg-black/50 p-3 text-white transition-colors hover:bg-black/70"
          title="Следующее (→)"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      )}

      {/* Image */}
      <div
        className="relative flex h-full w-full items-center justify-center p-8"
        onClick={onClose}
      >
        <img
          src={imageUrl}
          alt={imageAlt}
          className="max-h-full max-w-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Image info */}
      {imageAlt && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-black/50 px-4 py-2 text-sm text-white">
          {imageAlt}
        </div>
      )}
    </div>
  );
}
