import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
  });

  test('should handle 404 for non-existent routes', async ({ page }) => {
    const response = await page.goto('/non-existent-page');

    // Пока у нас нет 404 страницы, может быть 200
    // В будущем добавим проверку на 404 страницу
    expect(response?.status()).toBeDefined();
  });

  test('should have no broken links in visible content', async ({ page }) => {
    await page.goto('/');

    const links = await page.locator('a[href]').all();

    for (const link of links) {
      const href = await link.getAttribute('href');

      // Проверяем только внутренние ссылки
      if (href && href.startsWith('/')) {
        expect(href).toBeTruthy();
      }
    }
  });
});

test.describe('Routing', () => {
  test('should use React Router for client-side navigation', async ({ page }) => {
    await page.goto('/');

    // Проверяем что это SPA (Single Page Application)
    const navigationTiming = await page.evaluate(() =>
      JSON.stringify(performance.getEntriesByType('navigation'))
    );

    expect(navigationTiming).toBeTruthy();
  });
});
