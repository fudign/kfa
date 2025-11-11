import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Eye } from 'lucide-react';

interface Document {
  id: number;
  titleKey: string;
  descriptionKey: string;
  category: 'charter' | 'regulation' | 'standard' | 'report';
  fileUrl: string;
  viewUrl: string;
  size: string;
  date: string;
}

const documents: Document[] = [
  {
    id: 1,
    titleKey: 'doc1.title',
    descriptionKey: 'doc1.description',
    category: 'charter',
    fileUrl: '/documents/charter.md',
    viewUrl: '/documents/view/charter',
    size: '2.5 MB',
    date: '2025-10-23',
  },
  {
    id: 2,
    titleKey: 'doc2.title',
    descriptionKey: 'doc2.description',
    category: 'regulation',
    fileUrl: '/documents/membership.md',
    viewUrl: '/documents/view/membership',
    size: '1.8 MB',
    date: '2024-03-20',
  },
  {
    id: 3,
    titleKey: 'doc3.title',
    descriptionKey: 'doc3.description',
    category: 'standard',
    fileUrl: '/documents/standards.md',
    viewUrl: '/documents/view/standards',
    size: '3.2 MB',
    date: '2024-06-10',
  },
  {
    id: 4,
    titleKey: 'doc4.title',
    descriptionKey: 'doc4.description',
    category: 'regulation',
    fileUrl: '/documents/ethics.md',
    viewUrl: '/documents/view/ethics',
    size: '1.5 MB',
    date: '2024-02-28',
  },
  {
    id: 5,
    titleKey: 'doc5.title',
    descriptionKey: 'doc5.description',
    category: 'report',
    fileUrl: '/documents/annual-report.md',
    viewUrl: '/documents/view/annual-report',
    size: '4.8 MB',
    date: '2024-12-01',
  },
  {
    id: 6,
    titleKey: 'doc6.title',
    descriptionKey: 'doc6.description',
    category: 'regulation',
    fileUrl: '/documents/certification.md',
    viewUrl: '/documents/view/certification',
    size: '2.1 MB',
    date: '2024-04-15',
  },
];

const categoryColors = {
  charter: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  regulation: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  standard: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  report: 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400',
};

export function DocumentsSection() {
  const { t } = useTranslation('about');
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="bg-white px-4 py-12 dark:bg-neutral-900 md:py-16 lg:py-24">
      <div className="container">
        <div className="mb-8 text-center md:mb-12">
          <h2 className="mb-3 font-display text-2xl text-primary-900 dark:text-primary-100 md:mb-4 md:text-3xl lg:text-4xl">
            {t('documents.title')}
          </h2>
          <p className="mx-auto max-w-2xl text-base text-neutral-600 dark:text-neutral-400 md:text-lg">
            {t('documents.subtitle')}
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="grid gap-4 md:gap-6 md:grid-cols-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="group overflow-hidden rounded-kfa border border-neutral-200 bg-white transition-all hover:border-primary-300 hover:shadow-kfa-lg dark:border-neutral-700 dark:bg-neutral-800"
              >
                <div className="p-4 md:p-6">
                  {/* Header */}
                  <div className="mb-3 flex items-start justify-between gap-3 md:mb-4 md:gap-4">
                    <div className="flex items-start gap-2 md:gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 md:h-12 md:w-12">
                        <FileText className="h-5 w-5 md:h-6 md:w-6" />
                      </div>
                      <div className="flex-1">
                        <span
                          className={`mb-2 inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                            categoryColors[doc.category]
                          }`}
                        >
                          {t(`documents.categories.${doc.category}`)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mb-2 font-display text-base font-semibold text-primary-900 dark:text-primary-100 md:text-lg">
                    {t(`documents.items.${doc.titleKey}`)}
                  </h3>
                  <p className="mb-3 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 md:mb-4 md:text-sm">
                    {t(`documents.items.${doc.descriptionKey}`)}
                  </p>

                  {/* Meta */}
                  <div className="mb-3 flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-500 md:mb-4 md:gap-4">
                    <span>{formatDate(doc.date)}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 md:gap-3">
                    <button
                      onClick={() => navigate(doc.viewUrl)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700 md:gap-2 md:px-4 md:text-sm"
                    >
                      <Eye className="h-3 w-3 md:h-4 md:w-4" />
                      {t('documents.actions.view')}
                    </button>
                    <a
                      href={doc.fileUrl}
                      download
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-primary-700 md:gap-2 md:px-4 md:text-sm"
                    >
                      <Download className="h-3 w-3 md:h-4 md:w-4" />
                      {t('documents.actions.download')}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
