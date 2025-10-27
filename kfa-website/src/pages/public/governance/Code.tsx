import { Shield, FileText, Users, Target } from 'lucide-react';
// import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function CodeHeroSection() {
  // const { t } = useTranslation('governance');

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
            <Shield className="h-12 w-12 text-white" />
          </div>

          <h1 className="mb-6 font-display text-display-xl text-white">
            Кодекс корпоративного управления КФА
          </h1>
          <p className="text-xl leading-relaxed text-primary-50">
            Стандарты и лучшие практики корпоративного управления для финансовых аналитиков Кыргызстана
          </p>
          <p className="mt-4 text-lg text-primary-100">
            Версия 2024
          </p>
        </div>
      </div>
    </section>
  );
}

function CodePrinciplesSection() {
  const principles = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Прозрачность и подотчетность',
      description: 'Полное раскрытие информации о деятельности, решениях и финансовых показателях организации',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Права акционеров',
      description: 'Защита и обеспечение равных прав всех акционеров, включая миноритарных инвесторов',
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Роль совета директоров',
      description: 'Эффективное руководство и контроль за деятельностью исполнительных органов',
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: 'Управление рисками',
      description: 'Систематический подход к идентификации, оценке и управлению корпоративными рисками',
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-display text-3xl md:text-4xl">Основные принципы</h2>
          <p className="mx-auto max-w-2xl text-lg text-text-muted">
            Кодекс основан на международных стандартах и адаптирован к условиям Кыргызстана
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {principles.map((principle, index) => (
            <div
              key={index}
              className="rounded-kfa border border-border bg-surface p-8 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary-50 p-3 text-primary-600">
                {principle.icon}
              </div>
              <h3 className="mb-3 text-xl font-semibold">{principle.title}</h3>
              <p className="text-text-muted">{principle.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CodeStructureSection() {
  const chapters = [
    { number: 'I', title: 'Общие положения', sections: 5 },
    { number: 'II', title: 'Права акционеров', sections: 8 },
    { number: 'III', title: 'Совет директоров', sections: 12 },
    { number: 'IV', title: 'Исполнительные органы', sections: 7 },
    { number: 'V', title: 'Управление рисками и внутренний контроль', sections: 9 },
    { number: 'VI', title: 'Раскрытие информации', sections: 6 },
    { number: 'VII', title: 'Существенные корпоративные действия', sections: 8 },
    { number: 'VIII', title: 'Заинтересованные стороны', sections: 5 },
  ];

  return (
    <section className="bg-surface py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-display text-3xl md:text-4xl">Структура Кодекса</h2>
          <p className="mx-auto max-w-2xl text-lg text-text-muted">
            Кодекс состоит из 8 глав и 60 разделов, охватывающих все аспекты корпоративного управления
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="space-y-4">
            {chapters.map((chapter, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-kfa border border-border bg-background p-6 transition-all hover:shadow-md"
              >
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-primary-600 font-display text-2xl text-white">
                  {chapter.number}
                </div>
                <div className="flex-grow">
                  <h3 className="mb-1 text-lg font-semibold">{chapter.title}</h3>
                  <p className="text-sm text-text-muted">{chapter.sections} разделов</p>
                </div>
                <button className="btn-outline">Подробнее</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CodeResourcesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-kfa bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-white md:p-12">
            <h2 className="mb-4 font-display text-3xl md:text-4xl">Документы и ресурсы</h2>
            <p className="mb-8 text-lg text-primary-50">
              Скачайте полную версию Кодекса и дополнительные материалы
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <button className="flex items-center gap-3 rounded-lg bg-white/10 p-4 text-left backdrop-blur-sm transition-all hover:bg-white/20">
                <FileText className="h-8 w-8 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Полный текст Кодекса</div>
                  <div className="text-sm text-primary-100">PDF, 2.4 MB</div>
                </div>
              </button>

              <button className="flex items-center gap-3 rounded-lg bg-white/10 p-4 text-left backdrop-blur-sm transition-all hover:bg-white/20">
                <FileText className="h-8 w-8 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Руководство по применению</div>
                  <div className="text-sm text-primary-100">PDF, 1.8 MB</div>
                </div>
              </button>

              <button className="flex items-center gap-3 rounded-lg bg-white/10 p-4 text-left backdrop-blur-sm transition-all hover:bg-white/20">
                <FileText className="h-8 w-8 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Чек-лист для компаний</div>
                  <div className="text-sm text-primary-100">PDF, 856 KB</div>
                </div>
              </button>

              <button className="flex items-center gap-3 rounded-lg bg-white/10 p-4 text-left backdrop-blur-sm transition-all hover:bg-white/20">
                <FileText className="h-8 w-8 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Примеры лучших практик</div>
                  <div className="text-sm text-primary-100">PDF, 1.2 MB</div>
                </div>
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/governance/scorecard" className="btn-secondary">
                Пройти самооценку
              </Link>
              <Link to="/governance/directors" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                База директоров
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function GovernanceCodePage() {
  return (
    <div className="min-h-screen">
      <CodeHeroSection />
      <CodePrinciplesSection />
      <CodeStructureSection />
      <CodeResourcesSection />
    </div>
  );
}
