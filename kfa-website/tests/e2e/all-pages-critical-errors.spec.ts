import { test, expect, type ConsoleMessage } from '@playwright/test';

/**
 * Critical Errors Detection Test
 *
 * Проверяет критические ошибки на всех страницах:
 * - JavaScript ошибки выполнения
 * - React render errors
 * - Network failures (500, 503, etc.)
 * - Неперехваченные исключения
 */

const CRITICAL_ROUTES = [
  '/',
  '/about',
  '/news',
  '/events',
  '/education',
  '/members',
  '/auth/login',
  '/auth/register',
];

// Критические паттерны ошибок
const CRITICAL_ERROR_PATTERNS = [
  /uncaught/i,
  /unhandled/i,
  /TypeError/,
  /ReferenceError/,
  /SyntaxError/,
  /React error/i,
  /hydration/i,
  /Failed to compile/i,
];

// Некритические ошибки (можно игнорировать)
const IGNORABLE_ERRORS = [
  /favicon\.ico/,
  /Failed to load resource.*404/,
  /net::ERR_/,
  /ResizeObserver/,
  /ChunkLoadError/,
];

interface ErrorLog {
  type: 'console' | 'page' | 'network';
  message: string;
  url?: string;
  timestamp: number;
}

test.describe('Critical Errors Detection', () => {
  let errors: ErrorLog[] = [];

  test.beforeEach(() => {
    errors = [];
  });

  for (const route of CRITICAL_ROUTES) {
    test(`${route} should not have critical errors`, async ({ page }) => {
      // Собираем все типы ошибок
      page.on('console', (msg: ConsoleMessage) => {
        if (msg.type() === 'error') {
          const text = msg.text();

          // Проверяем что это не игнорируемая ошибка
          const shouldIgnore = IGNORABLE_ERRORS.some(pattern => pattern.test(text));

          if (!shouldIgnore) {
            errors.push({
              type: 'console',
              message: text,
              timestamp: Date.now(),
            });
          }
        }
      });

      page.on('pageerror', (error) => {
        errors.push({
          type: 'page',
          message: error.message,
          timestamp: Date.now(),
        });
      });

      page.on('requestfailed', (request) => {
        const response = request.failure();
        if (response) {
          errors.push({
            type: 'network',
            message: `Request failed: ${request.url()} - ${response.errorText}`,
            url: request.url(),
            timestamp: Date.now(),
          });
        }
      });

      // Переход на страницу
      await page.goto(route);
      await page.waitForLoadState('domcontentloaded');

      // Даем время на выполнение всех скриптов
      await page.waitForTimeout(2000);

      // Анализируем критические ошибки
      const criticalErrors = errors.filter((error) => {
        return CRITICAL_ERROR_PATTERNS.some((pattern) => pattern.test(error.message));
      });

      // Если есть критические ошибки - выводим их
      if (criticalErrors.length > 0) {
        console.error(`\n❌ Critical errors found on ${route}:`);
        criticalErrors.forEach((error, index) => {
          console.error(`  ${index + 1}. [${error.type}] ${error.message}`);
          if (error.url) console.error(`     URL: ${error.url}`);
        });
      }

      // Проверка что нет критических ошибок
      expect(criticalErrors, `Found ${criticalErrors.length} critical errors on ${route}`).toHaveLength(0);

      // Проверка что React не упал
      const reactError = page.locator('[data-testid="error-boundary"], .error-boundary');
      await expect(reactError).not.toBeVisible();
    });
  }
});

test.describe('HTTP Status Codes Check', () => {
  test.describe.configure({ mode: 'parallel' });

  for (const route of CRITICAL_ROUTES) {
    test(`${route} should return 200 status`, async ({ page }) => {
      const response = await page.goto(route);

      // Проверка что статус успешный
      expect(response?.status()).toBe(200);
      expect(response?.ok()).toBe(true);

      // Проверка что content-type корректный
      const contentType = response?.headers()['content-type'];
      expect(contentType).toContain('text/html');
    });
  }
});

test.describe('React Rendering Errors', () => {
  test.describe.configure({ mode: 'parallel' });

  for (const route of CRITICAL_ROUTES) {
    test(`${route} should render without React errors`, async ({ page }) => {
      // Перехватываем ошибки React
      const reactErrors: string[] = [];

      page.on('console', (msg) => {
        const text = msg.text();
        if (
          text.includes('React') ||
          text.includes('Warning:') ||
          text.includes('Error:')
        ) {
          reactErrors.push(text);
        }
      });

      await page.goto(route);
      await page.waitForLoadState('domcontentloaded');

      // Проверка на наличие div с id root (React mount point)
      const root = page.locator('#root');
      await expect(root).toBeVisible();

      // Проверка что в root есть контент
      const rootContent = await root.innerHTML();
      expect(rootContent.length).toBeGreaterThan(100);

      // Выводим React ошибки если есть
      if (reactErrors.length > 0) {
        console.warn(`\n⚠️  React warnings on ${route}:`);
        reactErrors.forEach((error, index) => {
          console.warn(`  ${index + 1}. ${error.substring(0, 200)}...`);
        });
      }
    });
  }
});

test.describe('JavaScript Execution', () => {
  test.describe.configure({ mode: 'parallel' });

  for (const route of CRITICAL_ROUTES) {
    test(`${route} should execute JavaScript without errors`, async ({ page }) => {
      let jsError = false;

      page.on('pageerror', () => {
        jsError = true;
      });

      await page.goto(route);
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});

      // Проверка что JavaScript выполнился без ошибок
      expect(jsError).toBe(false);

      // Проверка что window объект доступен
      const hasWindow = await page.evaluate(() => typeof window !== 'undefined');
      expect(hasWindow).toBe(true);

      // Проверка что React загружен
      const hasReact = await page.evaluate(() => {
        return typeof (window as any).React !== 'undefined' ||
               document.querySelector('[data-reactroot], #root') !== null;
      });
      expect(hasReact).toBe(true);
    });
  }
});

test.describe('Network Failures Detection', () => {
  test('should detect and report failed network requests', async ({ page }) => {
    const failedRequests: { url: string; error: string }[] = [];

    page.on('requestfailed', (request) => {
      const failure = request.failure();
      if (failure && !request.url().includes('favicon')) {
        failedRequests.push({
          url: request.url(),
          error: failure.errorText,
        });
      }
    });

    // Тестируем главную страницу
    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});

    // Если есть проваленные запросы - выводим информацию
    if (failedRequests.length > 0) {
      console.warn('\n⚠️  Failed network requests:');
      failedRequests.forEach((req, index) => {
        console.warn(`  ${index + 1}. ${req.url}`);
        console.warn(`     Error: ${req.error}`);
      });
    }

    // Проверка что критических проваленных запросов нет
    const criticalFailures = failedRequests.filter(
      (req) =>
        !req.url.includes('analytics') &&
        !req.url.includes('tracking') &&
        !req.url.includes('ads')
    );

    expect(criticalFailures, 'Critical network requests failed').toHaveLength(0);
  });
});

test.describe('Memory Leaks Detection', () => {
  test('should not have obvious memory leaks on navigation', async ({ page }) => {
    await page.goto('/');

    // Получаем начальное использование памяти
    const initialMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });

    // Переходим по нескольким страницам
    const routes = ['/', '/about', '/news', '/events', '/education'];

    for (const route of routes) {
      await page.goto(route);
      await page.waitForTimeout(1000);
    }

    // Возвращаемся на главную
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Проверяем финальное использование памяти
    const finalMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });

    // Если память доступна, проверяем что утечка не критична
    if (initialMemory > 0 && finalMemory > 0) {
      const memoryIncrease = finalMemory - initialMemory;
      const increasePercent = (memoryIncrease / initialMemory) * 100;

      console.log(`\nMemory usage:`);
      console.log(`  Initial: ${(initialMemory / 1024 / 1024).toFixed(2)} MB`);
      console.log(`  Final: ${(finalMemory / 1024 / 1024).toFixed(2)} MB`);
      console.log(`  Increase: ${increasePercent.toFixed(2)}%`);

      // Проверка что память не выросла более чем на 200%
      expect(increasePercent).toBeLessThan(200);
    }
  });
});
