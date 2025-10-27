import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { User, Mail, Phone, Building2, MapPin, Save, AlertCircle, CheckCircle } from 'lucide-react';

export function ProfilePage() {
  const [formData, setFormData] = useState({
    firstName: 'Иван',
    lastName: 'Иванов',
    email: 'ivan@example.com',
    phone: '+996 555 123 456',
    company: 'КапиталИнвест',
    position: 'Аналитик',
    city: 'Бишкек',
    address: 'ул. Чуй 123',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    setSaveSuccess(false);

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'Введите имя';
    if (!formData.lastName) newErrors.lastName = 'Введите фамилию';
    if (!formData.email) {
      newErrors.email = 'Введите email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }
    if (!formData.phone) newErrors.phone = 'Введите телефон';
    if (!formData.company) newErrors.company = 'Введите компанию';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="mb-2 font-display text-3xl font-bold text-primary-900 dark:text-primary-100">
            Профиль
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">Управление личной информацией и настройками</p>
        </div>

        {/* Profile Photo */}
        <div className="rounded-kfa border border-neutral-200 bg-white p-6 shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="mb-4 font-display text-xl font-semibold text-primary-900 dark:text-primary-100">
            Фото профиля
          </h2>
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary-600 to-primary-700"></div>
            <div className="flex-1">
              <p className="mb-2 text-sm text-neutral-600 dark:text-neutral-400">
                Рекомендуемый размер: 400x400px, формат JPG или PNG
              </p>
              <button className="rounded-lg border border-primary-600 px-4 py-2 font-semibold text-primary-700 transition-colors hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/30">
                Загрузить фото
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information Form */}
        <div className="rounded-kfa border border-neutral-200 bg-white p-6 shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="mb-6 font-display text-xl font-semibold text-primary-900 dark:text-primary-100">
            Личная информация
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Имя
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`w-full rounded-lg border ${
                      errors.firstName ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                    } bg-white py-3 pl-10 pr-4 text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-neutral-800 dark:text-neutral-100`}
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Фамилия
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={`w-full rounded-lg border ${
                      errors.lastName ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                    } bg-white py-3 pl-10 pr-4 text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-neutral-800 dark:text-neutral-100`}
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Fields */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                    } bg-white py-3 pl-10 pr-4 text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-neutral-800 dark:text-neutral-100`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Телефон
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Phone className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full rounded-lg border ${
                      errors.phone ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                    } bg-white py-3 pl-10 pr-4 text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-neutral-800 dark:text-neutral-100`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Company Fields */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="company"
                  className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Компания
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Building2 className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className={`w-full rounded-lg border ${
                      errors.company ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                    } bg-white py-3 pl-10 pr-4 text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-neutral-800 dark:text-neutral-100`}
                  />
                </div>
                {errors.company && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    {errors.company}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="position"
                  className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Должность
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="position"
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full rounded-lg border border-neutral-300 bg-white py-3 pl-10 pr-4 text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>
            </div>

            {/* Address Fields */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Город
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MapPin className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full rounded-lg border border-neutral-300 bg-white py-3 pl-10 pr-4 text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Адрес
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MapPin className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full rounded-lg border border-neutral-300 bg-white py-3 pl-10 pr-4 text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-3 font-semibold text-white shadow-kfa-md transition-all hover:shadow-kfa-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Сохранить изменения
                  </>
                )}
              </button>

              {saveSuccess && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">Изменения сохранены!</span>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
