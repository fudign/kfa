import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('should match homepage screenshot', async ({ page }) => {
    await page.goto('/');

    // Ждём полной загрузки
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Ждём анимации

    // Делаем скриншот (первый запуск создаст baseline)
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match hero section screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const heroSection = page.locator('div').first();
    await expect(heroSection).toHaveScreenshot('hero-section.png', {
      animations: 'disabled',
    });
  });
});

test.describe('Visual - Dark Mode (Future)', () => {
  test.skip('should display correctly in dark mode', async ({ page }) => {
    // Когда добавим dark mode
    await page.goto('/');
    await page.emulateMedia({ colorScheme: 'dark' });

    await expect(page).toHaveScreenshot('homepage-dark.png');
  });
});

test.describe('Visual - Responsive', () => {
  test('should display correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should display correctly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});
