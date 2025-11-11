import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft, Download } from 'lucide-react';
import { SEO } from '@/components/seo';

const documentMap: Record<string, { title: string; file: string }> = {
  charter: { title: 'Устав КФА', file: '/documents/charter.md' },
  membership: { title: 'Положение о членстве', file: '/documents/membership.md' },
  standards: { title: 'Профессиональные стандарты', file: '/documents/standards.md' },
  ethics: { title: 'Этический кодекс', file: '/documents/ethics.md' },
  'annual-report': { title: 'Годовой отчет 2024', file: '/documents/annual-report.md' },
  certification: { title: 'Порядок сертификации', file: '/documents/certification.md' },
};

export function DocumentViewer() {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const document = documentId ? documentMap[documentId] : null;

  useEffect(() => {
    if (!document) {
      setError('Документ не найден');
      setLoading(false);
      return;
    }

    fetch(document.file)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Не удалось загрузить документ');
        }
        return response.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [document]);

  const handleDownload = () => {
    if (!document) return;

    const link = window.document.createElement('a');
    link.href = document.file;
    link.download = document.file.split('/').pop() || 'document.md';
    link.click();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-neutral-600 dark:text-neutral-400">
          Загрузка документа...
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {error || 'Документ не найден'}
          </h1>
          <button
            onClick={() => navigate('/documents')}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            Вернуться к документам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <SEO
        title={document.title}
        description={`Просмотр документа: ${document.title}`}
        url={`https://kfa.kg/documents/${documentId}`}
      />

      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
        <div className="container flex items-center justify-between py-4">
          <button
            onClick={() => navigate('/documents')}
            className="flex items-center gap-2 text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400"
          >
            <ArrowLeft className="h-5 w-5" />
            Назад к документам
          </button>

          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            {document.title}
          </h1>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Download className="h-4 w-4" />
            Скачать
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-sm dark:bg-neutral-800">
          <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-display prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-primary-600 hover:prose-a:text-primary-700 dark:prose-a:text-primary-400">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}
