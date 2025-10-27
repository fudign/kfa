import { useState } from 'react';
import { Search, Filter } from 'lucide-react';

interface MemberFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  type: string;
  category: string;
  city: string;
}

export function MemberFilters({ onFilterChange }: MemberFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'all',
    category: 'all',
    city: 'all',
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      search: '',
      type: 'all',
      category: 'all',
      city: 'all',
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="rounded-kfa border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900 md:p-6">
      <div className="mb-4 flex items-center justify-between md:mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary-600 dark:text-primary-400 md:h-5 md:w-5" />
          <h3 className="font-display text-base font-semibold text-primary-900 dark:text-primary-100 md:text-lg">
            Фильтры
          </h3>
        </div>
        <button
          onClick={resetFilters}
          className="text-xs font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 md:text-sm"
        >
          Сбросить
        </button>
      </div>

      <div className="space-y-3 md:space-y-4">
        {/* Search */}
        <div>
          <label className="mb-2 block text-xs font-medium text-neutral-700 dark:text-neutral-300 md:text-sm">
            Поиск
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Название организации..."
              className="w-full rounded-lg border border-neutral-300 bg-white py-2 pl-10 pr-4 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
            />
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="mb-2 block text-xs font-medium text-neutral-700 dark:text-neutral-300 md:text-sm">
            Тип членства
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white py-2 px-3 text-sm text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
          >
            <option value="all">Все типы</option>
            <option value="full">Полное членство</option>
            <option value="associate">Ассоциированное</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block text-xs font-medium text-neutral-700 dark:text-neutral-300 md:text-sm">
            Категория
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white py-2 px-3 text-sm text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
          >
            <option value="all">Все категории</option>
            <option value="broker">Брокерская компания</option>
            <option value="dealer">Дилерская компания</option>
            <option value="registrar">Регистратор</option>
            <option value="depository">Депозитарий</option>
            <option value="management">Управляющая компания</option>
            <option value="other">Прочие</option>
          </select>
        </div>

        {/* City */}
        <div>
          <label className="mb-2 block text-xs font-medium text-neutral-700 dark:text-neutral-300 md:text-sm">
            Город
          </label>
          <select
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white py-2 px-3 text-sm text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
          >
            <option value="all">Все города</option>
            <option value="Бишкек">Бишкек</option>
            <option value="Ош">Ош</option>
            <option value="Джалал-Абад">Джалал-Абад</option>
            <option value="Каракол">Каракол</option>
            <option value="Талас">Талас</option>
          </select>
        </div>
      </div>
    </div>
  );
}
