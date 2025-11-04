/**
 * Утилиты для генерации структурированных данных (JSON-LD)
 * для улучшения SEO и отображения в поисковых результатах
 */

interface Organization {
  name: string;
  url: string;
  logo: string;
  description: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint?: {
    telephone: string;
    contactType: string;
    email: string;
  };
  sameAs?: string[];
}

interface Article {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    url?: string;
  };
  publisher: Organization;
}

interface Event {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: {
    name: string;
    address?: string;
  };
  image?: string;
  organizer?: Organization;
}

export interface WebSite {
  name: string;
  url: string;
  potentialAction?: {
    '@type': string;
    target: string;
    'query-input': string;
  };
}

/**
 * Генерирует JSON-LD для организации
 */
export function generateOrganizationSchema(): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Кыргызский Финансовый Альянс',
    alternateName: 'КФА',
    url: 'https://kfa.kg',
    logo: 'https://kfa.kg/logo.png',
    description:
      'Саморегулируемая организация профессиональных участников рынка ценных бумаг Кыргызской Республики',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Исанова, 91',
      addressLocality: 'Бишкек',
      addressRegion: 'Чуйская область',
      postalCode: '720040',
      addressCountry: 'KG',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+996-312-666-108',
      contactType: 'customer service',
      email: 'info@kfa.kg',
      availableLanguage: ['Russian', 'Kyrgyz', 'English'],
    },
    sameAs: [
      // Добавить социальные сети при наличии
    ],
  };
}

/**
 * Генерирует JSON-LD для веб-сайта с поиском
 */
export function generateWebSiteSchema(): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Кыргызский Финансовый Альянс',
    url: 'https://kfa.kg',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://kfa.kg/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Генерирует JSON-LD для статьи/новости
 */
export function generateArticleSchema(article: Article): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: article.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: article.publisher.name,
      logo: {
        '@type': 'ImageObject',
        url: article.publisher.logo,
      },
    },
  };
}

/**
 * Генерирует JSON-LD для события
 */
export function generateEventSchema(event: Event): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.location.name,
      address: event.location.address
        ? {
            '@type': 'PostalAddress',
            streetAddress: event.location.address,
            addressLocality: 'Бишкек',
            addressCountry: 'KG',
          }
        : undefined,
    },
    image: event.image ? [event.image] : undefined,
    organizer: event.organizer
      ? {
          '@type': 'Organization',
          name: event.organizer.name,
          url: event.organizer.url,
        }
      : undefined,
  };
}

/**
 * Генерирует JSON-LD для хлебных крошек
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Генерирует JSON-LD для страницы FAQ
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Генерирует JSON-LD для образовательного контента
 */
export function generateCourseSchema(course: {
  name: string;
  description: string;
  provider: Organization;
}): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: course.provider.name,
      url: course.provider.url,
    },
  };
}
