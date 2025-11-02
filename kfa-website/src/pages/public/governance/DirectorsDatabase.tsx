// import { useState } from 'react';
import { Search, Filter, Users, Award, Briefcase, MapPin } from 'lucide-react';
// import { useTranslation } from 'react-i18next';

function DatabaseHeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex rounded-full bg-white/10 p-4 backdrop-blur-sm">
            <Users className="h-12 w-12 text-white" />
          </div>

          <h1 className="mb-6 font-display text-display-xl text-white">
            База независимых директоров
          </h1>
          <p className="text-xl leading-relaxed text-primary-50">
            Найдите квалифицированных директоров для вашего совета директоров
          </p>

          {/* Search Bar */}
          <div className="mt-12">
            <div className="mx-auto max-w-2xl">
              <div className="flex gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Поиск по имени, компании или навыкам..."
                    className="w-full rounded-lg border border-border bg-white py-4 pl-12 pr-4 text-text-primary placeholder-text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
                <button className="btn-secondary flex items-center gap-2 whitespace-nowrap">
                  <Filter className="h-5 w-5" />
                  Фильтры
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FiltersSection() {
  // const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  // const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);

  const industries = [
    'Финансовые услуги',
    'Технологии',
    'Производство',
    'Недвижимость',
    'Энергетика',
    'Здравоохранение',
  ];

  // const certifications = [
  //   'Сертифицированный директор (КФА)',
  //   'Independent Director',
  //   'Chartered Director',
  //   'Corporate Governance Professional',
  // ];

  return (
    <section className="border-b border-border bg-surface py-8">
      <div className="container">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold">Индустрия</label>
            <select className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
              <option>Все индустрии</option>
              {industries.map((industry, index) => (
                <option key={index}>{industry}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Опыт</label>
            <select className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
              <option>Любой опыт</option>
              <option>До 5 лет</option>
              <option>5-10 лет</option>
              <option>10-15 лет</option>
              <option>Более 15 лет</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Локация</label>
            <select className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
              <option>Все регионы</option>
              <option>Бишкек</option>
              <option>Ош</option>
              <option>Джалал-Абад</option>
              <option>Другие регионы</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}

function DirectorsListSection() {
  const directors = [
    {
      name: 'Айгерим Токтомушева',
      title: 'Независимый директор',
      company: 'ABC Bank',
      location: 'Бишкек',
      experience: 12,
      industries: ['Финансовые услуги', 'Технологии'],
      certifications: ['Сертифицированный директор (КФА)', 'Independent Director'],
      boards: 3,
      image: null,
    },
    {
      name: 'Нурбек Сыдыков',
      title: 'Председатель совета директоров',
      company: 'Tech Innovations KG',
      location: 'Бишкек',
      experience: 15,
      industries: ['Технологии', 'Инновации'],
      certifications: ['Chartered Director', 'Corporate Governance Professional'],
      boards: 5,
      image: null,
    },
    {
      name: 'Гульмира Жумабаева',
      title: 'Независимый директор',
      company: 'Energy Solutions',
      location: 'Ош',
      experience: 10,
      industries: ['Энергетика', 'Устойчивое развитие'],
      certifications: ['Сертифицированный директор (КФА)'],
      boards: 2,
      image: null,
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Найдено директоров: {directors.length}</h2>
            <p className="text-text-muted">Отсортировано по релевантности</p>
          </div>
          <select className="rounded-lg border border-border bg-background px-4 py-2">
            <option>По релевантности</option>
            <option>По опыту</option>
            <option>По дате регистрации</option>
            <option>По имени</option>
          </select>
        </div>

        <div className="space-y-6">
          {directors.map((director, index) => (
            <div
              key={index}
              className="rounded-kfa border border-border bg-surface p-6 transition-all hover:shadow-lg"
            >
              <div className="flex flex-col gap-6 md:flex-row">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 text-3xl font-bold text-primary-600">
                    {director.name.charAt(0)}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-grow">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="mb-1 text-xl font-bold">{director.name}</h3>
                      <p className="text-text-muted">{director.title}</p>
                    </div>
                    <button className="btn-primary">Связаться</button>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-4 text-sm text-text-muted">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>{director.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{director.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      <span>{director.experience} лет опыта</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{director.boards} совета</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="mb-1 text-sm font-semibold">Индустрии:</div>
                    <div className="flex flex-wrap gap-2">
                      {director.industries.map((industry, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-primary-50 px-3 py-1 text-xs text-primary-700"
                        >
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 text-sm font-semibold">Сертификации:</div>
                    <div className="flex flex-wrap gap-2">
                      {director.certifications.map((cert, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-success-50 px-3 py-1 text-xs text-success-700"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <div className="flex gap-2">
            <button className="rounded-lg border border-border px-4 py-2 hover:bg-surface">Предыдущая</button>
            <button className="rounded-lg bg-primary-600 px-4 py-2 text-white">1</button>
            <button className="rounded-lg border border-border px-4 py-2 hover:bg-surface">2</button>
            <button className="rounded-lg border border-border px-4 py-2 hover:bg-surface">3</button>
            <button className="rounded-lg border border-border px-4 py-2 hover:bg-surface">Следующая</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function JoinDatabaseSection() {
  return (
    <section className="bg-surface py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-kfa bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-center text-white md:p-12">
            <h2 className="mb-4 font-display text-3xl md:text-4xl">Присоединяйтесь к базе директоров</h2>
            <p className="mb-8 text-lg text-primary-50">
              Станьте частью профессионального сообщества независимых директоров Кыргызстана
            </p>

            <div className="mb-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <Award className="mx-auto mb-3 h-10 w-10" />
                <div className="font-semibold">Повысьте видимость</div>
              </div>
              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <Briefcase className="mx-auto mb-3 h-10 w-10" />
                <div className="font-semibold">Найдите новые возможности</div>
              </div>
              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <Users className="mx-auto mb-3 h-10 w-10" />
                <div className="font-semibold">Расширьте сеть</div>
              </div>
            </div>

            <button className="btn-secondary">Подать заявку</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DirectorsDatabasePage() {
  return (
    <div className="min-h-screen">
      <DatabaseHeroSection />
      <FiltersSection />
      <DirectorsListSection />
      <JoinDatabaseSection />
    </div>
  );
}
