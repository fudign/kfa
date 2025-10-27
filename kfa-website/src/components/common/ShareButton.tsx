import { useState } from 'react';
import { Share2, Check, Copy, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  className?: string;
  variant?: 'icon' | 'button' | 'fab';
}

/**
 * ShareButton Component
 *
 * Кнопка для sharing контента через Web Share API
 * Fallback на копирование ссылки и социальные сети
 */
export function ShareButton({
  title,
  text,
  url,
  className = '',
  variant = 'button',
}: ShareButtonProps) {
  const [showFallback, setShowFallback] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;

  const handleShare = async () => {
    // Проверяем поддержку Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
      } catch (error) {
        // Пользователь отменил или ошибка
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Показываем fallback меню
      setShowFallback(!showFallback);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSocialShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedText = encodeURIComponent(text);

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
    setShowFallback(false);
  };

  // Варианты отображения
  const buttonClasses = {
    icon: 'flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 text-neutral-600 transition-colors hover:border-primary-500 hover:bg-primary-50 hover:text-primary-600 dark:border-neutral-600 dark:text-neutral-400 dark:hover:border-primary-500 dark:hover:bg-primary-900/20 dark:hover:text-primary-400',
    button:
      'inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-primary-500 hover:bg-primary-50 hover:text-primary-600 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-primary-500 dark:hover:bg-primary-900/20 dark:hover:text-primary-400',
    fab: 'fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-kfa-xl transition-all hover:scale-110 hover:shadow-glow-gold',
  };

  return (
    <div className="relative">
      {/* Кнопка Share */}
      <button
        onClick={handleShare}
        className={`${buttonClasses[variant]} ${className}`}
        aria-label="Поделиться"
      >
        <Share2 className={variant === 'icon' ? 'h-5 w-5' : 'h-4 w-4'} />
        {variant === 'button' && <span>Поделиться</span>}
      </button>

      {/* Fallback меню */}
      {showFallback && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowFallback(false)}
            aria-hidden="true"
          />

          {/* Меню */}
          <div className="absolute bottom-full right-0 z-50 mb-2 w-64 animate-scale-in overflow-hidden rounded-kfa border border-neutral-200 bg-white shadow-kfa-xl dark:border-neutral-700 dark:bg-neutral-800">
            <div className="p-3">
              <p className="mb-3 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                Поделиться через:
              </p>

              {/* Копировать ссылку */}
              <button
                onClick={handleCopyLink}
                className="mb-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <Copy className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                )}
                <span className="flex-1 text-neutral-700 dark:text-neutral-300">
                  {copied ? 'Ссылка скопирована!' : 'Копировать ссылку'}
                </span>
              </button>

              {/* Социальные сети */}
              <div className="space-y-1 border-t border-neutral-200 pt-2 dark:border-neutral-700">
                <button
                  onClick={() => handleSocialShare('facebook')}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Facebook className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-neutral-700 dark:text-neutral-300">Facebook</span>
                </button>

                <button
                  onClick={() => handleSocialShare('twitter')}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-sky-50 dark:hover:bg-sky-900/20"
                >
                  <Twitter className="h-4 w-4 text-sky-500 dark:text-sky-400" />
                  <span className="text-neutral-700 dark:text-neutral-300">Twitter</span>
                </button>

                <button
                  onClick={() => handleSocialShare('linkedin')}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Linkedin className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                  <span className="text-neutral-700 dark:text-neutral-300">LinkedIn</span>
                </button>

                <button
                  onClick={() => handleSocialShare('email')}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  <Mail className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  <span className="text-neutral-700 dark:text-neutral-300">Email</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
