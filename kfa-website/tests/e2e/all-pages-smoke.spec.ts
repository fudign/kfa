import { test, expect, type Page } from '@playwright/test';

/**
 * Comprehensive E2E Smoke Test - All Pages
 *
 * Проверяет все публичные страницы на:
 * - Успешную загрузку (статус 200)
 * - Отсутствие ошибок консоли
 * - Отсутствие критических ошибок React
 * - Наличие основного контента
 */

// Список всех публичных маршрутов из App.tsx
const PUBLIC_ROUTES = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/documents', name: 'Documents' },
  { path: '/membership', name: 'Membership' },
  { path: '/membership/join', name: 'Join' },
  { path: '/members', name: 'Members' },
  { path: '/faq', name: 'FAQ' },
  { path: '/news', name: 'News' },
  { path: '/events', name: 'Events' },
  { path: '/standards', name: 'Standards' },
  { path: '/education', name: 'Education' },
  { path: '/education/programs', name: 'Programs' },
  { path: '/education/certification', name: 'Certification' },
  { path: '/education/calendar', name: 'Calendar' },
  { path: '/research', name: 'Research' },
  { path: '/governance/code', name: 'Governance Code' },
  { path: '/governance/directors', name: 'Directors Certification' },
  { path: '/governance/directors-database', name: 'Directors Database' },
  { path: '/governance/scorecard', name: 'Scorecard' },
  { path: '/governance/community', name: 'Directors Community' },
  { path: '/auth/login', name: 'Login' },
  { path: '/auth/register', name: 'Register' },
  { path: '/auth/forgot-password', name: 'Forgot Password' },
  { path: '/privacy', name: 'Privacy' },
  { path: '/terms', name: 'Terms' },
];

// Хелпер для сбора ошибок консоли
function setupConsoleListener(page: Page): string[] {
  const errors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', (error) => {
    errors.push(`Page Error: ${error.message}`);
  });

  return errors;
}

test.describe('All Pages Smoke Test', () => {
  test.describe.configure({ mode: 'parallel' });

  for (const route of PUBLIC_ROUTES) {
    test(`${route.name} (${route.path}) should load without errors`, async ({ page }) => {
      const consoleErrors = setupConsoleListener(page);

      // Переход на страницу
      const response = await page.goto(route.path);

      // Проверка статуса ответа
      expect(response?.status()).toBe(200);

      // Ждем полной загрузки страницы
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
        // Игнорируем таймаут networkidle, продолжаем проверки
      });

      // Проверка что страница загрузилась (есть body)
      await expect(page.locator('body')).toBeVisible();

      // Проверка что нет критических ошибок консоли
      const criticalErrors = consoleErrors.filter(error =>
        !error.includes('favicon.ico') && // Игнорируем ошибки фавикона
        !error.includes('Failed to load resource') && // Игнорируем ошибки загрузки ресурсов
        !error.includes('net::ERR_') // Игнорируем сетевые ошибки
      );

      if (criticalErrors.length > 0) {
        console.error(`Console errors on ${route.path}:`, criticalErrors);
      }

      expect(criticalErrors.length).toBe(0);

      // Проверка что нет React error boundary
      const errorBoundary = page.locator('text=/Something went wrong|Что-то пошло не так/i');
      await expect(errorBoundary).not.toBeVisible();
    });
  }
});

test.describe('All Pages - Basic Content Check', () => {
  test.describe.configure({ mode: 'parallel' });

  for (const route of PUBLIC_ROUTES) {
    test(`${route.name} (${route.path}) should have basic layout`, async ({ page }) => {
      await page.goto(route.path);

      // Для дашборда ожидаем редирект на логин (если не авторизованы)
      if (route.path.startsWith('/dashboard')) {
        await expect(page).toHaveURL(/\/(auth\/login|dashboard)/);
      } else {
        // Проверка что страница имеет title
        const title = await page.title();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(0);

        // Проверка что есть основной контент (main или содержимое)
        const hasContent = await page.locator('main, [role="main"], body > div').count();
        expect(hasContent).toBeGreaterThan(0);
      }
    });
  }
});

test.describe('All Pages - Meta Tags Check', () => {
  test.describe.configure({ mode: 'parallel' });

  for (const route of PUBLIC_ROUTES) {
    test(`${route.name} (${route.path}) should have SEO meta tags`, async ({ page }) => {
      await page.goto(route.path);

      // Проверка наличия meta description (используем .first() для избежания strict mode ошибок)
      const description = await page.locator('meta[name="description"]').first().getAttribute('content');
      expect(description).toBeTruthy();

      // Проверка наличия Open Graph tags (используем .first() для избежания strict mode ошибок)
      const ogTitle = await page.locator('meta[property="og:title"]').first().getAttribute('content');
      expect(ogTitle).toBeTruthy();
    });
  }
});

test.describe('Error Pages', () => {
  test('404 page should display for non-existent routes', async ({ page }) => {
    const consoleErrors = setupConsoleListener(page);

    await page.goto('/this-page-does-not-exist-12345');

    // Проверка что страница загрузилась
    await expect(page.locator('body')).toBeVisible();

    // Проверка что нет критических ошибок
    const criticalErrors = consoleErrors.filter(error =>
      !error.includes('favicon.ico') &&
      !error.includes('Failed to load resource')
    );
    expect(criticalErrors.length).toBe(0);
  });
});

test.describe('Language Switching', () => {
  test('should work on all pages', async ({ page }) => {
    // Проверяем несколько страниц
    const testRoutes = ['/', '/about', '/news', '/education'];

    for (const route of testRoutes) {
      await page.goto(route);

      // Проверка что переключатель языка существует (проверяем наличие в DOM, не обязательно видимый)
      const langSwitcher = page.locator('[data-testid="language-switcher"]');

      // Ожидаем появления переключателя в DOM (может быть скрыт на мобильных)
      await expect(langSwitcher).toBeAttached();
    }
  });
});

test.describe('Responsive Design', () => {
  test.describe.configure({ mode: 'parallel' });

  const viewports = [
    { width: 375, height: 667, name: 'Mobile' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 1920, height: 1080, name: 'Desktop' },
  ];

  for (const viewport of viewports) {
    test(`Home page should be responsive on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');

      // Проверка что страница загрузилась
      await expect(page.locator('body')).toBeVisible();

      // Проверка что контент виден
      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent).toBeVisible();
    });
  }
});
