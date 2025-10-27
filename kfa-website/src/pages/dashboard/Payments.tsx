import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CreditCard, CheckCircle, Clock, XCircle, Download, DollarSign } from 'lucide-react';

interface Payment {
  id: number;
  type: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
  date: string;
  invoice?: string;
}

const payments: Payment[] = [
  {
    id: 1,
    type: 'Годовой членский взнос',
    amount: '50,000',
    status: 'paid',
    date: '2025-01-15',
    invoice: 'INV-2025-001',
  },
  {
    id: 2,
    type: 'Сертификация CFA Level I',
    amount: '25,000',
    status: 'paid',
    date: '2025-02-20',
    invoice: 'INV-2025-002',
  },
  {
    id: 3,
    type: 'Конференция КФА 2025',
    amount: '15,000',
    status: 'pending',
    date: '2025-10-01',
  },
  {
    id: 4,
    type: 'Онлайн курс: ESG Инвестирование',
    amount: '8,000',
    status: 'paid',
    date: '2025-03-10',
    invoice: 'INV-2025-003',
  },
];

const statusConfig = {
  paid: {
    icon: CheckCircle,
    label: 'Оплачен',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  pending: {
    icon: Clock,
    label: 'Ожидает',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  failed: {
    icon: XCircle,
    label: 'Отклонен',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
};

export function PaymentsPage() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const totalPaid = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + parseInt(p.amount.replace(/,/g, '')), 0);

  const totalPending = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + parseInt(p.amount.replace(/,/g, '')), 0);

  return (
    <DashboardLayout>
      <div className="space-y-5 md:space-y-6">
        {/* Header */}
        <div>
          <h1 className="mb-1 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:mb-2 md:text-3xl">
            Платежи
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 md:text-base">
            История ваших платежей и текущие счета
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          <div className="rounded-kfa border border-neutral-200 bg-white p-4 shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800 md:p-6">
            <div className="mb-3 flex items-center gap-3 md:mb-4">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30 md:p-3">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400 md:h-6 md:w-6" />
              </div>
            </div>
            <div className="mb-1 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:text-3xl">
              {totalPaid.toLocaleString()} сом
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">Всего оплачено</div>
          </div>

          <div className="rounded-kfa border border-neutral-200 bg-white p-4 shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800 md:p-6">
            <div className="mb-3 flex items-center gap-3 md:mb-4">
              <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900/30 md:p-3">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400 md:h-6 md:w-6" />
              </div>
            </div>
            <div className="mb-1 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:text-3xl">
              {totalPending.toLocaleString()} сом
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">В ожидании</div>
          </div>

          <div className="rounded-kfa border border-neutral-200 bg-white p-4 shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800 md:p-6">
            <div className="mb-3 flex items-center gap-3 md:mb-4">
              <div className="rounded-full bg-primary-100 p-2 dark:bg-primary-900/30 md:p-3">
                <CreditCard className="h-5 w-5 text-primary-600 dark:text-primary-400 md:h-6 md:w-6" />
              </div>
            </div>
            <div className="mb-1 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:text-3xl">
              {payments.length}
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">Всего транзакций</div>
          </div>
        </div>

        {/* Payments List */}
        <div className="rounded-kfa border border-neutral-200 bg-white shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800">
          <div className="border-b border-neutral-200 p-4 dark:border-neutral-700 md:p-6">
            <h2 className="font-display text-lg font-semibold text-primary-900 dark:text-primary-100 md:text-xl">
              История платежей
            </h2>
          </div>
          <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {payments.map((payment) => {
              const config = statusConfig[payment.status];
              const StatusIcon = config.icon;

              return (
                <div
                  key={payment.id}
                  className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between md:gap-4 md:p-6"
                >
                  <div className="flex flex-1 items-start gap-3 md:gap-4">
                    <div className={`flex-shrink-0 rounded-full p-2 ${config.bgColor}`}>
                      <StatusIcon className={`h-5 w-5 ${config.color} md:h-6 md:w-6`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 text-sm font-semibold text-primary-900 dark:text-primary-100 md:text-base">
                        {payment.type}
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">
                        {formatDate(payment.date)}
                      </p>
                      {payment.invoice && (
                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">
                          Счет: {payment.invoice}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 md:justify-end">
                    <div className="text-right">
                      <div className="mb-1 font-display text-lg font-bold text-primary-900 dark:text-primary-100 md:text-xl">
                        {payment.amount} сом
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${config.bgColor} ${config.color}`}
                      >
                        {config.label}
                      </span>
                    </div>
                    {payment.invoice && payment.status === 'paid' && (
                      <button className="rounded-lg p-2 text-primary-600 transition-colors hover:bg-primary-100 dark:text-primary-400 dark:hover:bg-primary-900/30">
                        <Download className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="rounded-kfa border border-neutral-200 bg-white p-4 shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800 md:p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-primary-900 dark:text-primary-100 md:mb-6 md:text-xl">
            Способы оплаты
          </h2>
          <div className="grid gap-3 md:grid-cols-2 md:gap-4">
            <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
              <div className="mb-3 flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Банковский перевод</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">НБКР, Бишкек</p>
                </div>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                Реквизиты для оплаты будут доступны при оформлении платежа
              </p>
            </div>

            <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
              <div className="mb-3 flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Онлайн оплата</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Visa, MasterCard</p>
                </div>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                Быстрая и безопасная оплата банковской картой
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
