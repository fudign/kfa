import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft, Calendar, User, FileText, Download } from 'lucide-react';
import { LazyMermaidDiagram } from '@/components/common/LazyMermaidDiagram';
import { SEO } from '@/components/seo';
import { generateArticleSchema } from '@/lib/seo/structuredData';

interface ArticleMetadata {
  id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  pages: number;
  file: string;
}

const articles: Record<string, ArticleMetadata> = {
  'market-analysis-q3-2025': {
    id: '1',
    title: 'Анализ рынка ценных бумаг КР за III квартал 2025',
    author: 'Аналитический отдел КФА',
    date: '2025-10-22',
    category: 'Рыночный анализ',
    pages: 85,
    file: '/docs/research/01-market-analysis-q3-2025.md',
  },
  'regulatory-changes-2026': {
    id: '2',
    title: 'Регуляторные изменения 2026: готовность участников рынка',
    author: 'Аналитический отдел КФА',
    date: '2025-10-22',
    category: 'Регулирование',
    pages: 92,
    file: '/docs/research/02-regulatory-changes-2026.md',
  },
  'risk-assessment-methodology': {
    id: '3',
    title: 'Методология оценки рисков для профессиональных участников',
    author: 'Департамент управления рисками КФА',
    date: '2025-10-22',
    category: 'Методология',
    pages: 128,
    file: '/docs/research/03-risk-assessment-methodology.md',
  },
  'esg-trends-kyrgyzstan': {
    id: '4',
    title: 'ESG-тренды на развивающихся рынках: опыт Кыргызстана',
    author: 'Центр устойчивого развития КФА',
    date: '2025-10-22',
    category: 'ESG и устойчивое развитие',
    pages: 115,
    file: '/docs/research/04-esg-trends-kyrgyzstan.md',
  },
  'corporate-governance-best-practices': {
    id: '5',
    title: 'Лучшие практики корпоративного управления',
    author: 'Комитет по корпоративному управлению КФА',
    date: '2025-10-22',
    category: 'Корпоративное управление',
    pages: 145,
    file: '/docs/research/05-corporate-governance-best-practices.md',
  },
};

export function ResearchArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const article = slug ? articles[slug] : null;

  useEffect(() => {
    if (!article) {
      setError('Статья не найдена');
      setLoading(false);
      return;
    }

    fetch(article.file)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load article');
        return res.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading article:', err);
        setError('Ошибка загрузки статьи');
        setLoading(false);
      });
  }, [article]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDownload = () => {
    if (!article) return;

    // Create a blob and download
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-4xl font-bold text-neutral-900 dark:text-white">
            {error || 'Статья не найдена'}
          </h1>
          <button
            onClick={() => navigate('/research')}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Вернуться к исследованиям
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-neutral-900 dark:to-neutral-900">
      <SEO
        title={article.title}
        description={`${article.category} • ${article.author} • ${formatDate(article.date)} • ${article.pages} страниц`}
        url={`https://kfa.kg/research/${slug}`}
        keywords={`${article.category}, исследование КФА, аналитика, ${article.author}`}
        type="article"
        article={{
          publishedTime: article.date,
          author: article.author,
          section: article.category,
          tags: [article.category, 'Исследования', 'КФА'],
        }}
        structuredData={generateArticleSchema({
          headline: article.title,
          description: `${article.category} - ${article.author}`,
          image: 'https://kfa.kg/images/research-og.png',
          datePublished: article.date,
          dateModified: article.date,
          author: {
            name: article.author,
            url: 'https://kfa.kg',
          },
          publisher: {
            name: 'Кыргызский Финансовый Альянс',
            url: 'https://kfa.kg',
            logo: 'https://kfa.kg/logo.png',
          },
        })}
      />
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
        <div className="container max-w-7xl py-8">
          <button
            onClick={() => navigate('/research')}
            className="mb-6 inline-flex items-center gap-2 text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Вернуться к исследованиям
          </button>

          <div className="mb-4">
            <span className="inline-block rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
              {article.category}
            </span>
          </div>

          <h1 className="mb-6 font-display text-4xl font-bold text-neutral-900 dark:text-white md:text-5xl">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(article.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>~{article.pages} страниц</span>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-primary-600 px-4 py-2 font-semibold text-primary-600 transition-colors hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/20"
          >
            <Download className="h-4 w-4" />
            Скачать Markdown
          </button>
        </div>
      </div>

      {/* Article Content */}
      <div className="container py-12">
        <article className="prose prose-xl mx-auto max-w-6xl dark:prose-invert prose-headings:font-display prose-h1:text-5xl prose-h1:leading-tight prose-h2:text-4xl prose-h2:leading-snug prose-h2:mt-16 prose-h2:mb-8 prose-h3:text-3xl prose-h3:leading-snug prose-h3:mt-12 prose-h3:mb-6 prose-h4:text-2xl prose-h4:mt-10 prose-h4:mb-4 prose-p:leading-relaxed prose-p:mb-6 prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-strong:text-neutral-900 dark:prose-strong:text-white prose-code:text-primary-600 dark:prose-code:text-primary-400 prose-pre:bg-neutral-900 dark:prose-pre:bg-neutral-800 prose-li:my-2">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              // Custom rendering for better styling
              code: ({ node, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : '';

                // Check if inline by looking at props
                const isInline = !(props as any)?.['data-inline'] === false;

                // Render Mermaid diagrams with our custom component
                if (language === 'mermaid' && !isInline) {
                  return <LazyMermaidDiagram chart={String(children).replace(/\n$/, '')} />;
                }

                // Regular code blocks
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              table: ({ node, ...props }) => (
                <div className="my-8 overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-300 dark:divide-neutral-600" {...props} />
                </div>
              ),
              th: ({ node, ...props }) => (
                <th className="bg-neutral-100 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300" {...props} />
              ),
              td: ({ node, ...props }) => (
                <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-900 dark:text-neutral-100" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a className="text-primary-600 underline decoration-primary-600/30 underline-offset-2 transition-colors hover:decoration-primary-600 dark:text-primary-400 dark:decoration-primary-400/30 dark:hover:decoration-primary-400" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-primary-500 bg-primary-50 py-2 pl-4 italic text-neutral-700 dark:bg-primary-900/20 dark:text-neutral-300" {...props} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>

      {/* Back to top button */}
      <div className="container pb-12">
        <div className="mx-auto max-w-6xl text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Вернуться наверх
          </button>
        </div>
      </div>
    </div>
  );
}
