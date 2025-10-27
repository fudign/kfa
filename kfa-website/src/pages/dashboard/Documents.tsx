import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { FileText, Download, Eye, File, FileCheck, Shield, Clock } from 'lucide-react';

interface Document {
  id: number;
  title: string;
  type: 'contract' | 'certificate' | 'policy' | 'report' | 'application';
  date: string;
  size: string;
  status: 'signed' | 'pending' | 'draft';
}

const documents: Document[] = [
  {
    id: 1,
    title: 'Договор о членстве в КФА',
    type: 'contract',
    date: '2025-01-15',
    size: '245 KB',
    status: 'signed',
  },
  {
    id: 2,
    title: 'Соглашение о конфиденциальности',
    type: 'policy',
    date: '2025-01-15',
    size: '180 KB',
    status: 'pending',
  },
  {
    id: 3,
    title: 'Сертификат CFA Level I',
    type: 'certificate',
    date: '2025-02-20',
    size: '520 KB',
    status: 'signed',
  },
  {
    id: 4,
    title: 'Заявка на участие в конференции',
    type: 'application',
    date: '2025-10-01',
    size: '95 KB',
    status: 'draft',
  },
  {
    id: 5,
    title: 'Отчет об обучении 2025',
    type: 'report',
    date: '2025-08-15',
    size: '1.2 MB',
    status: 'signed',
  },
  {
    id: 6,
    title: 'Правила использования платформы',
    type: 'policy',
    date: '2025-01-01',
    size: '340 KB',
    status: 'signed',
  },
];

const typeConfig = {
  contract: {
    icon: FileCheck,
    label: 'Договор',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  certificate: {
    icon: Shield,
    label: 'Сертификат',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  policy: {
    icon: Shield,
    label: 'Политика',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  report: {
    icon: FileText,
    label: 'Отчет',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  application: {
    icon: File,
    label: 'Заявка',
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
  },
};

const statusConfig = {
  signed: {
    label: 'Подписан',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  pending: {
    label: 'Ожидает подписи',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  draft: {
    label: 'Черновик',
    color: 'text-neutral-600 dark:text-neutral-400',
    bgColor: 'bg-neutral-100 dark:bg-neutral-700',
  },
};

export function DocumentsPage() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const signedDocs = documents.filter((d) => d.status === 'signed').length;
  const pendingDocs = documents.filter((d) => d.status === 'pending').length;

  return (
    <DashboardLayout>
      <div className="space-y-5 md:space-y-6">
        {/* Header */}
        <div>
          <h1 className="mb-1 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:mb-2 md:text-3xl">
            Документы
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 md:text-base">
            Управление вашими документами и сертификатами
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          <div className="rounded-kfa border border-neutral-200 bg-white p-4 shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800 md:p-6">
            <div className="mb-3 flex items-center gap-3 md:mb-4">
              <div className="rounded-full bg-primary-100 p-2 dark:bg-primary-900/30 md:p-3">
                <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400 md:h-6 md:w-6" />
              </div>
            </div>
            <div className="mb-1 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:text-3xl">
              {documents.length}
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">Всего документов</div>
          </div>

          <div className="rounded-kfa border border-neutral-200 bg-white p-4 shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800 md:p-6">
            <div className="mb-3 flex items-center gap-3 md:mb-4">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30 md:p-3">
                <FileCheck className="h-5 w-5 text-green-600 dark:text-green-400 md:h-6 md:w-6" />
              </div>
            </div>
            <div className="mb-1 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:text-3xl">
              {signedDocs}
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">Подписанных</div>
          </div>

          <div className="rounded-kfa border border-neutral-200 bg-white p-4 shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800 md:p-6">
            <div className="mb-3 flex items-center gap-3 md:mb-4">
              <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900/30 md:p-3">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400 md:h-6 md:w-6" />
              </div>
            </div>
            <div className="mb-1 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:text-3xl">
              {pendingDocs}
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">Ожидают подписи</div>
          </div>
        </div>

        {/* Documents List */}
        <div className="rounded-kfa border border-neutral-200 bg-white shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800">
          <div className="border-b border-neutral-200 p-4 dark:border-neutral-700 md:p-6">
            <h2 className="font-display text-lg font-semibold text-primary-900 dark:text-primary-100 md:text-xl">
              Все документы
            </h2>
          </div>
          <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {documents.map((doc) => {
              const typeConf = typeConfig[doc.type];
              const statusConf = statusConfig[doc.status];
              const TypeIcon = typeConf.icon;

              return (
                <div
                  key={doc.id}
                  className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between md:gap-4 md:p-6"
                >
                  <div className="flex flex-1 items-start gap-3 md:gap-4">
                    <div className={`flex-shrink-0 rounded-full p-2 ${typeConf.bgColor}`}>
                      <TypeIcon className={`h-5 w-5 ${typeConf.color} md:h-6 md:w-6`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 text-sm font-semibold text-primary-900 dark:text-primary-100 md:text-base">
                        {doc.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${typeConf.bgColor} ${typeConf.color}`}
                        >
                          {typeConf.label}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${statusConf.bgColor} ${statusConf.color}`}
                        >
                          {statusConf.label}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-500">
                        {formatDate(doc.date)} • {doc.size}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="rounded-lg p-2 text-primary-600 transition-colors hover:bg-primary-100 dark:text-primary-400 dark:hover:bg-primary-900/30">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Document Templates */}
        <div className="rounded-kfa border border-neutral-200 bg-white p-4 shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800 md:p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-primary-900 dark:text-primary-100 md:mb-6 md:text-xl">
            Шаблоны документов
          </h2>
          <div className="grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
            <button className="rounded-lg border border-neutral-200 p-4 text-left transition-all hover:border-primary-300 hover:bg-primary-50 dark:border-neutral-700 dark:hover:border-primary-700 dark:hover:bg-primary-900/10">
              <FileText className="mb-3 h-8 w-8 text-primary-600 dark:text-primary-400" />
              <p className="mb-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Заявка на членство</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Форма для подачи заявки на вступление в КФА
              </p>
            </button>

            <button className="rounded-lg border border-neutral-200 p-4 text-left transition-all hover:border-primary-300 hover:bg-primary-50 dark:border-neutral-700 dark:hover:border-primary-700 dark:hover:bg-primary-900/10">
              <Shield className="mb-3 h-8 w-8 text-primary-600 dark:text-primary-400" />
              <p className="mb-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Соглашение о конфиденциальности
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Стандартная форма NDA для членов КФА
              </p>
            </button>

            <button className="rounded-lg border border-neutral-200 p-4 text-left transition-all hover:border-primary-300 hover:bg-primary-50 dark:border-neutral-700 dark:hover:border-primary-700 dark:hover:bg-primary-900/10">
              <File className="mb-3 h-8 w-8 text-primary-600 dark:text-primary-400" />
              <p className="mb-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Заявка на сертификацию
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Форма для регистрации на экзамен CFA
              </p>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
