import { Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface NewsPreviewProps {
  title: string;
  excerpt?: string;
  content: string;
  image?: string;
  featured?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function NewsPreview({
  title,
  excerpt,
  content,
  image,
  featured,
  isOpen,
  onClose,
}: NewsPreviewProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Предпросмотр новости
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <article className="p-6">
          {/* Featured Badge */}
          {featured && (
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                ⭐ Избранное
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {title || 'Без заголовка'}
          </h1>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              {excerpt}
            </p>
          )}

          {/* Featured Image */}
          {image && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img
                src={image}
                alt={title}
                className="w-full h-auto object-cover max-h-96"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom components for better styling
                h1: ({ node, ...props }) => (
                  <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl font-bold mt-4 mb-2" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-4 leading-relaxed" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-primary-500 pl-4 italic my-4 text-gray-600 dark:text-gray-400"
                    {...props}
                  />
                ),
                code: ({ node, inline, ...props }: any) =>
                  inline ? (
                    <code
                      className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono"
                      {...props}
                    />
                  ) : (
                    <code
                      className="block bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto text-sm font-mono"
                      {...props}
                    />
                  ),
                a: ({ node, ...props }) => (
                  <a
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),
                img: ({ node, ...props }) => (
                  <img
                    className="rounded-lg my-4 max-w-full h-auto"
                    {...props}
                  />
                ),
              }}
            >
              {content || 'Нет контента для отображения'}
            </ReactMarkdown>
          </div>

          {/* Placeholder if no content */}
          {!content && (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500">
              <p>Контент новости будет отображаться здесь</p>
            </div>
          )}
        </article>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Закрыть предпросмотр
          </button>
        </div>
      </div>
    </div>
  );
}
