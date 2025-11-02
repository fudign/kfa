# Руководство по SEO оптимизации КФА

## 📊 Обзор

Проект использует комплексную SEO стратегию с динамическими метатегами, структурированными данными (JSON-LD) и оптимизацией для социальных сетей.

## 🛠️ Установленные инструменты

- **react-helmet-async** - Динамическое управление метатегами
- **Structured Data (JSON-LD)** - Разметка для поисковых систем
- **Open Graph** - Оптимизация для Facebook
- **Twitter Cards** - Оптимизация для Twitter

## 🎯 Компоненты

### 1. SEO Component

Универсальный компонент для управления метатегами на каждой странице:

```tsx
import { SEO } from '@/components/seo';

export function YourPage() {
  return (
    <>
      <SEO
        title="Заголовок страницы"
        description="Описание страницы для поисковых систем"
        keywords="ключевые, слова, через, запятую"
        image="https://kfa.kg/images/page-image.png"
        url="https://kfa.kg/your-page"
        type="website" // или "article" для новостей
      />
      {/* Ваш контент */}
    </>
  );
}
```

### 2. Structured Data (JSON-LD)

Используйте готовые функции для генерации структурированных данных:

#### Организация (главная страница)

```tsx
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo/structuredData';

const structuredData = [
  generateOrganizationSchema(),
  generateWebSiteSchema()
];

<SEO structuredData={structuredData} />
```

#### Статья/Новость

```tsx
import { generateArticleSchema } from '@/lib/seo/structuredData';

const articleData = {
  headline: 'Заголовок новости',
  description: 'Краткое описание',
  image: 'https://kfa.kg/news-image.png',
  datePublished: '2025-10-28T10:00:00Z',
  dateModified: '2025-10-28T15:00:00Z',
  author: {
    name: 'Автор Статьи',
    url: 'https://kfa.kg/authors/author-slug'
  },
  publisher: {
    name: 'Кыргызский Финансовый Альянс',
    url: 'https://kfa.kg',
    logo: 'https://kfa.kg/logo.png'
  }
};

<SEO
  type="article"
  article={{
    publishedTime: articleData.datePublished,
    modifiedTime: articleData.dateModified,
    author: articleData.author.name,
    section: 'Новости',
    tags: ['финансы', 'рынок ценных бумаг']
  }}
  structuredData={generateArticleSchema(articleData)}
/>
```

#### Событие

```tsx
import { generateEventSchema } from '@/lib/seo/structuredData';

const eventData = {
  name: 'Название мероприятия',
  description: 'Описание мероприятия',
  startDate: '2025-11-15T10:00:00Z',
  endDate: '2025-11-15T18:00:00Z',
  location: {
    name: 'Место проведения',
    address: 'ул. Исанова, 91, Бишкек'
  },
  image: 'https://kfa.kg/event-image.png',
  organizer: {
    name: 'Кыргызский Финансовый Альянс',
    url: 'https://kfa.kg'
  }
};

<SEO structuredData={generateEventSchema(eventData)} />
```

#### FAQ страница

```tsx
import { generateFAQSchema } from '@/lib/seo/structuredData';

const faqs = [
  {
    question: 'Как стать членом КФА?',
    answer: 'Для вступления в КФА необходимо...'
  },
  {
    question: 'Какие требования к членам?',
    answer: 'Требования включают...'
  }
];

<SEO structuredData={generateFAQSchema(faqs)} />
```

#### Хлебные крошки

```tsx
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData';

const breadcrumbs = [
  { name: 'Главная', url: 'https://kfa.kg' },
  { name: 'Образование', url: 'https://kfa.kg/education' },
  { name: 'Программы', url: 'https://kfa.kg/education/programs' }
];

<SEO structuredData={generateBreadcrumbSchema(breadcrumbs)} />
```

#### Образовательный курс

```tsx
import { generateCourseSchema } from '@/lib/seo/structuredData';

const courseData = {
  name: 'Название курса',
  description: 'Описание курса',
  provider: {
    name: 'Кыргызский Финансовый Альянс',
    url: 'https://kfa.kg'
  }
};

<SEO structuredData={generateCourseSchema(courseData)} />
```

## 📝 Примеры использования по страницам

### Главная страница (/)
```tsx
import { SEO } from '@/components/seo';
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo/structuredData';

export function HomePage() {
  const structuredData = [
    generateOrganizationSchema(),
    generateWebSiteSchema()
  ];

  return (
    <>
      <SEO
        title="Главная"
        description="Кыргызский Финансовый Альянс - СРО участников рынка ценных бумаг"
        url="https://kfa.kg"
        structuredData={structuredData}
      />
      {/* Контент */}
    </>
  );
}
```

### Страница новостей (/news)
```tsx
<SEO
  title="Новости"
  description="Последние новости и аналитика фондового рынка Кыргызстана"
  url="https://kfa.kg/news"
  image="https://kfa.kg/images/news-og.png"
/>
```

### Отдельная новость (/news/:slug)
```tsx
<SEO
  title={news.title}
  description={news.excerpt}
  image={news.image}
  url={`https://kfa.kg/news/${news.slug}`}
  type="article"
  article={{
    publishedTime: news.publishedAt,
    modifiedTime: news.updatedAt,
    author: news.author,
    section: 'Новости',
    tags: news.tags
  }}
  structuredData={generateArticleSchema({
    headline: news.title,
    description: news.excerpt,
    image: news.image,
    datePublished: news.publishedAt,
    dateModified: news.updatedAt,
    author: { name: news.author },
    publisher: {
      name: 'Кыргызский Финансовый Альянс',
      url: 'https://kfa.kg',
      logo: 'https://kfa.kg/logo.png'
    }
  })}
/>
```

### События (/events)
```tsx
<SEO
  title="Мероприятия"
  description="Предстоящие мероприятия, семинары и конференции КФА"
  url="https://kfa.kg/events"
/>
```

### Отдельное событие (/events/:slug)
```tsx
<SEO
  title={event.title}
  description={event.description}
  image={event.image}
  url={`https://kfa.kg/events/${event.slug}`}
  structuredData={generateEventSchema({
    name: event.title,
    description: event.description,
    startDate: event.startsAt,
    endDate: event.endsAt,
    location: {
      name: event.location,
      address: event.address
    },
    image: event.image
  })}
/>
```

### О нас (/about)
```tsx
<SEO
  title="О нас"
  description="История, миссия и цели Кыргызского Финансового Альянса"
  url="https://kfa.kg/about"
  structuredData={generateOrganizationSchema()}
/>
```

### FAQ (/faq)
```tsx
<SEO
  title="Часто задаваемые вопросы"
  description="Ответы на часто задаваемые вопросы о КФА"
  url="https://kfa.kg/faq"
  structuredData={generateFAQSchema(faqItems)}
/>
```

### Образование (/education)
```tsx
<SEO
  title="Образование"
  description="Образовательные программы и сертификация для участников рынка"
  url="https://kfa.kg/education"
/>
```

## ✅ Checklist для каждой страницы

### Обязательные метатеги
- [x] `title` - Уникальный заголовок (до 60 символов)
- [x] `description` - Описание страницы (до 160 символов)
- [x] `url` - Канонический URL страницы
- [x] `image` - OG изображение (1200x630px)

### Дополнительные метатеги
- [ ] `keywords` - Ключевые слова (для внутреннего использования)
- [ ] `type` - Тип контента (`website`, `article`, `profile`)
- [ ] `article` - Метаданные для статей (даты, автор, теги)
- [ ] `structuredData` - JSON-LD разметка

### Structured Data по типу контента
- [ ] **Организация** - На главной странице и /about
- [ ] **WebSite** - На главной странице (с SearchAction)
- [ ] **Article** - На страницах новостей и статей
- [ ] **Event** - На страницах мероприятий
- [ ] **FAQPage** - На странице FAQ
- [ ] **Course** - На страницах образовательных программ
- [ ] **BreadcrumbList** - На всех внутренних страницах

## 🔍 Проверка SEO

### Инструменты для тестирования

1. **Google Search Console** - https://search.google.com/search-console
2. **Structured Data Testing Tool** - https://validator.schema.org/
3. **Facebook Sharing Debugger** - https://developers.facebook.com/tools/debug/
4. **Twitter Card Validator** - https://cards-dev.twitter.com/validator
5. **Rich Results Test** - https://search.google.com/test/rich-results

### Локальная проверка

```bash
# 1. Собрать проект
npm run build

# 2. Запустить preview
npm run preview

# 3. Открыть DevTools и проверить:
# - <title> в <head>
# - Метатеги og:* и twitter:*
# - <script type="application/ld+json"> для structured data
```

### Проверка в HTML

```html
<!-- Должны присутствовать в <head> -->
<title>Заголовок страницы | КФА</title>
<meta name="description" content="Описание страницы">
<meta property="og:title" content="Заголовок страницы | КФА">
<meta property="og:description" content="Описание страницы">
<meta property="og:image" content="https://kfa.kg/image.png">
<meta property="og:url" content="https://kfa.kg/page">
<link rel="canonical" href="https://kfa.kg/page">

<!-- Structured data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Кыргызский Финансовый Альянс"
  ...
}
</script>
```

## 📊 Метрики успеха

### Google Search Console
- Количество проиндексированных страниц
- CTR (Click-Through Rate) в поиске
- Средняя позиция в выдаче
- Количество валидных structured data элементов

### Lighthouse SEO Score
- **Цель**: 95-100 баллов
- Проверить через Chrome DevTools → Lighthouse

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## 🚀 Следующие шаги

1. ✅ Добавить SEO компонент на все ключевые страницы
2. ✅ Сгенерировать structured data для всех типов контента
3. 🔄 Создать sitemap.xml (уже есть скрипт `npm run generate:sitemap`)
4. 🔄 Настроить robots.txt
5. 🔄 Зарегистрировать сайт в Google Search Console
6. 🔄 Зарегистрировать сайт в Yandex Webmaster
7. 🔄 Настроить аналитику (Google Analytics 4)

## 📚 Дополнительные ресурсы

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Guide](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

## ✅ Итог

SEO инфраструктура настроена и готова к использованию:
- ✅ Динамические метатеги через react-helmet-async
- ✅ Компонент SEO для простой интеграции
- ✅ Утилиты для structured data (JSON-LD)
- ✅ Поддержка Open Graph и Twitter Cards
- ✅ Примеры для всех типов страниц
- ✅ Документация и checklist

**Дата:** 2025-10-28
**Статус:** ✅ Реализовано
