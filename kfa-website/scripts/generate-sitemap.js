import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, '../public');
const BASE_URL = 'https://kfa.kg';

console.log('🗺️  Генерация sitemap.xml...\n');

/**
 * Структура сайта с приоритетами и частотой обновления
 */
const pages = [
  // Главная страница
  {
    url: '/',
    changefreq: 'daily',
    priority: 1.0,
    lastmod: new Date().toISOString().split('T')[0],
  },

  // О нас
  {
    url: '/about',
    changefreq: 'monthly',
    priority: 0.9,
    lastmod: new Date().toISOString().split('T')[0],
  },

  // Новости
  {
    url: '/news',
    changefreq: 'daily',
    priority: 0.9,
    lastmod: new Date().toISOString().split('T')[0],
  },

  // События
  {
    url: '/events',
    changefreq: 'weekly',
    priority: 0.9,
    lastmod: new Date().toISOString().split('T')[0],
  },

  // Членство
  {
    url: '/membership',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: new Date().toISOString().split('T')[0],
  },
  {
    url: '/membership/join',
    changefreq: 'monthly',
    priority: 0.9,
    lastmod: new Date().toISOString().split('T')[0],
  },

  // Члены
  {
    url: '/members',
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString().split('T')[0],
  },

  // Документы
  {
    url: '/documents',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: new Date().toISOString().split('T')[0],
  },

  // Стандарты
  {
    url: '/standards',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: new Date().toISOString().split('T')[0],
  },

  // Образование
  {
    url: '/education',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: new Date().toISOString().split('T')[0],
  },
  {
    url: '/education/programs',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: new Date().toISOString().split('T')[0],
  },
  {
    url: '/education/certification',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: new Date().toISOString().split('T')[0],
  },
  {
    url: '/education/calendar',
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: new Date().toISOString().split('T')[0],
  },

  // Исследования
  {
    url: '/research',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: new Date().toISOString().split('T')[0],
  },

  // FAQ
  {
    url: '/faq',
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: new Date().toISOString().split('T')[0],
  },

  // Юридические страницы
  {
    url: '/privacy',
    changefreq: 'yearly',
    priority: 0.3,
    lastmod: new Date().toISOString().split('T')[0],
  },
  {
    url: '/terms',
    changefreq: 'yearly',
    priority: 0.3,
    lastmod: new Date().toISOString().split('T')[0],
  },
];

/**
 * Генерация XML sitemap
 */
function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages
  .map(
    (page) => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <!-- Альтернативные языки -->
    <xhtml:link rel="alternate" hreflang="ru" href="${BASE_URL}/ru${page.url}" />
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en${page.url}" />
    <xhtml:link rel="alternate" hreflang="ky" href="${BASE_URL}/ky${page.url}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${page.url}" />
  </url>`
  )
  .join('\n')}
</urlset>`;

  const sitemapPath = join(PUBLIC_DIR, 'sitemap.xml');
  writeFileSync(sitemapPath, sitemap, 'utf-8');
  console.log(`✅ sitemap.xml создан (${pages.length} страниц)`);
}

/**
 * Генерация robots.txt (обновление)
 * Добавляем ссылку на sitemap
 */
function updateRobotsTxt() {
  const robots = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Sitemap
Sitemap: ${BASE_URL}/sitemap.xml

# Disallow admin and auth pages from indexing
Disallow: /admin/
Disallow: /auth/login
Disallow: /auth/register
Disallow: /auth/forgot-password
Disallow: /auth/reset-password
Disallow: /dashboard

# Allow all public pages
Allow: /
Allow: /about
Allow: /news
Allow: /events
Allow: /members
Allow: /membership
Allow: /membership/join
Allow: /documents
Allow: /standards
Allow: /education
Allow: /education/programs
Allow: /education/certification
Allow: /education/calendar
Allow: /research
Allow: /faq
Allow: /privacy
Allow: /terms
`;

  const robotsPath = join(PUBLIC_DIR, 'robots.txt');
  writeFileSync(robotsPath, robots, 'utf-8');
  console.log('✅ robots.txt обновлен');
}

// Запуск генерации
try {
  generateSitemap();
  updateRobotsTxt();
  console.log('\n✨ SEO файлы успешно созданы!');
  console.log(`📍 Sitemap URL: ${BASE_URL}/sitemap.xml`);
} catch (error) {
  console.error('❌ Ошибка при генерации:', error.message);
  process.exit(1);
}
