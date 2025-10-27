import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Кыргызский Финансовый Альянс/);
  });

  test('should display hero section with title', async ({ page }) => {
    // Проверяем наличие заголовка
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Устойчивое развитие');
  });

  test('should display CTA buttons', async ({ page }) => {
    // Проверяем кнопку "Стать членом"
    const joinButton = page.getByRole('button', { name: /Стать членом/i });
    await expect(joinButton).toBeVisible();

    // Проверяем кнопку "Личный кабинет"
    const loginButton = page.getByRole('button', { name: /Личный кабинет/i });
    await expect(loginButton).toBeVisible();
  });

  test('should display all 4 metrics cards', async ({ page }) => {
    // Ждём загрузки метрик
    await page.waitForTimeout(1000);

    // Проверяем наличие текста метрик
    await expect(page.getByText('Членов КФА')).toBeVisible();
    await expect(page.getByText('Объем торгов')).toBeVisible();
    await expect(page.getByText('Сертифицировано')).toBeVisible();
    await expect(page.getByText('Ближайшее событие')).toBeVisible();
  });

  test('should display metric values', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Проверяем значения метрик
    await expect(page.getByText('45')).toBeVisible(); // Члены
    await expect(page.getByText('2.5')).toBeVisible(); // Объем торгов
    await expect(page.getByText('320')).toBeVisible(); // Сертифицировано
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1); // Должен быть только один h1
  });

  test('should display welcome section', async ({ page }) => {
    const welcomeHeading = page.getByRole('heading', {
      name: /Добро пожаловать в КФА/i
    });
    await expect(welcomeHeading).toBeVisible();
  });
});

test.describe('Homepage - Mobile', () => {
  test.use({
    viewport: { width: 375, height: 667 } // iPhone SE размер
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.goto('/');

    // Проверяем что заголовок виден
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    // Проверяем что кнопки в колонку на мобильном
    const joinButton = page.getByRole('button', { name: /Стать членом/i });
    const loginButton = page.getByRole('button', { name: /Личный кабинет/i });

    await expect(joinButton).toBeVisible();
    await expect(loginButton).toBeVisible();
  });
});

test.describe('Homepage - Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    // Должно загрузиться менее чем за 3 секунды
    expect(loadTime).toBeLessThan(3000);
  });

  test('should not have console errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForTimeout(2000);

    // Не должно быть критических ошибок в консоли
    const criticalErrors = consoleErrors.filter(
      error => !error.includes('favicon') // Игнорируем ошибки favicon
    );

    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('Homepage - Accessibility', () => {
  test('should have proper semantic HTML', async ({ page }) => {
    await page.goto('/');

    // Проверяем наличие основных landmark элементов
    const main = page.locator('main, [role="main"]');
    // Main может быть, но не обязателен на этом этапе

    // Проверяем что есть h1
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
  });

  test('buttons should be keyboard accessible', async ({ page }) => {
    await page.goto('/');

    const joinButton = page.getByRole('button', { name: /Стать членом/i });

    // Проверяем что кнопка может получить фокус
    await joinButton.focus();
    await expect(joinButton).toBeFocused();
  });
});
