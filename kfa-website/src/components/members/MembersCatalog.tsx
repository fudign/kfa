import { useState, useMemo } from 'react';
import { MemberCard } from './MemberCard';
import { MemberFilters, FilterState } from './MemberFilters';

interface Member {
  id: number;
  name: string;
  type: 'full' | 'associate';
  category: string;
  city: string;
  memberSince: string;
  description: string;
  logo?: string;
}

// Mock data
const mockMembers: Member[] = [
  {
    id: 1,
    name: 'КапиталИнвест',
    type: 'full',
    category: 'Брокерская компания',
    city: 'Бишкек',
    memberSince: '2016',
    description: 'Ведущая брокерская компания, специализирующаяся на операциях с ценными бумагами и инвестиционном консультировании',
    logo: 'https://placehold.co/200x100/1A3A6B/FFFFFF/png?text=KapitalInvest',
  },
  {
    id: 2,
    name: 'ФинансТрейд',
    type: 'full',
    category: 'Дилерская компания',
    city: 'Бишкек',
    memberSince: '2017',
    description: 'Дилерская компания, осуществляющая операции купли-продажи ценных бумаг от своего имени и за свой счет',
    logo: 'https://placehold.co/200x100/1A3A6B/FFFFFF/png?text=FinansTrade',
  },
  {
    id: 3,
    name: 'РегистрКомпани',
    type: 'full',
    category: 'Регистратор',
    city: 'Бишкек',
    memberSince: '2015',
    description: 'Специализированный регистратор, ведущий реестры владельцев ценных бумаг эмитентов',
    logo: 'https://placehold.co/200x100/1A3A6B/FFFFFF/png?text=RegistrCo',
  },
  {
    id: 4,
    name: 'ДепозитариСервис',
    type: 'full',
    category: 'Депозитарий',
    city: 'Бишкек',
    memberSince: '2018',
    description: 'Центральный депозитарий ценных бумаг, обеспечивающий учет и хранение',
    logo: 'https://placehold.co/200x100/1A3A6B/FFFFFF/png?text=Depository',
  },
  {
    id: 5,
    name: 'АссетМенеджмент',
    type: 'full',
    category: 'Управляющая компания',
    city: 'Бишкек',
    memberSince: '2019',
    description: 'Профессиональное управление активами частных и институциональных инвесторов',
    logo: 'https://placehold.co/200x100/1A3A6B/FFFFFF/png?text=AssetMgmt',
  },
  {
    id: 6,
    name: 'СеверИнвест',
    type: 'full',
    category: 'Брокерская компания',
    city: 'Каракол',
    memberSince: '2020',
    description: 'Региональная брокерская компания, обслуживающая клиентов северных регионов',
    logo: 'https://placehold.co/200x100/1A3A6B/FFFFFF/png?text=SeverInvest',
  },
  {
    id: 7,
    name: 'ЮжныйКапитал',
    type: 'full',
    category: 'Брокерская компания',
    city: 'Ош',
    memberSince: '2019',
    description: 'Брокерская компания, специализирующаяся на обслуживании клиентов южных регионов',
    logo: 'https://placehold.co/200x100/1A3A6B/FFFFFF/png?text=SouthCapital',
  },
  {
    id: 8,
    name: 'КонсалтингГрупп',
    type: 'associate',
    category: 'Прочие',
    city: 'Бишкек',
    memberSince: '2021',
    description: 'Консалтинговая компания, предоставляющая услуги в области корпоративных финансов',
  },
  {
    id: 9,
    name: 'ФинТехСолюшнс',
    type: 'associate',
    category: 'Прочие',
    city: 'Бишкек',
    memberSince: '2022',
    description: 'IT-компания, разрабатывающая решения для финансового рынка',
  },
];

export function MembersCatalog() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'all',
    category: 'all',
    city: 'all',
  });

  const filteredMembers = useMemo(() => {
    return mockMembers.filter((member) => {
      // Search filter
      if (filters.search && !member.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Type filter
      if (filters.type !== 'all' && member.type !== filters.type) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all' && member.category !== filters.category) {
        return false;
      }

      // City filter
      if (filters.city !== 'all' && member.city !== filters.city) {
        return false;
      }

      return true;
    });
  }, [filters]);

  return (
    <div className="container px-4 py-8 md:py-12">
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[280px_1fr]">
        {/* Filters Sidebar */}
        <aside>
          <div className="sticky top-20 md:top-24">
            <MemberFilters onFilterChange={setFilters} />

            {/* Stats */}
            <div className="mt-4 rounded-kfa border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900 md:mt-6 md:p-6">
              <div className="text-center">
                <div className="mb-2 font-display text-3xl font-bold text-primary-600 dark:text-primary-400 md:text-4xl">
                  {filteredMembers.length}
                </div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">
                  {filteredMembers.length === mockMembers.length
                    ? 'Всего членов КФА'
                    : 'Найдено организаций'}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Members Grid */}
        <div>
          {filteredMembers.length > 0 ? (
            <div className="grid gap-4 md:gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredMembers.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          ) : (
            <div className="rounded-kfa border-2 border-dashed border-neutral-300 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-800 md:p-12">
              <p className="text-base text-neutral-600 dark:text-neutral-400 md:text-lg">
                По выбранным фильтрам ничего не найдено
              </p>
              <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-500 md:text-sm">
                Попробуйте изменить критерии поиска
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
