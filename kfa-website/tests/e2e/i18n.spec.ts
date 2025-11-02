import { test, expect } from '@playwright/test';

test.describe('Internationalization (i18n)', () => {
  test('should load with Russian language by default', async ({ page }) => {
    await page.goto('/');

    // Проверяем что текст на русском
    await expect(page.getByText('Устойчивое развитие')).toBeVisible();
    await expect(page.getByText('Стать членом')).toBeVisible();
  });

  test('should display all Russian translations', async ({ page }) => {
    await page.goto('/');

    // Проверяем ключевые переводы
    const russianTexts = [
      'Устойчивое развитие',
      'фондового рынка',
      'Стать членом',
      'Личный кабинет',
      'Членов КФА',
      'Объем торгов'
    ];

    for (const text of russianTexts) {
      await expect(page.getByText(text, { exact: false })).toBeVisible();
    }
  });

  test('should have proper lang attribute', async ({ page }) => {
    await page.goto('/');

    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('ru');
  });
});

test.describe('i18n - Language Switching (Future)', () => {
  test.skip('should switch to Kyrgyz language', async ({ page }) => {
    // Этот тест будет работать когда добавим переключатель языков
    await page.goto('/');

    // await page.click('[aria-label="Language Switcher"]');
    // await page.click('text=Кыргызский');

    // await expect(page.getByText('Туруктуу өнүгүү')).toBeVisible();
  });

  test.skip('should switch to English language', async ({ page }) => {
    // Этот тест будет работать когда добавим переключатель языков
    await page.goto('/');

    // await page.click('[aria-label="Language Switcher"]');
    // await page.click('text=English');

    // await expect(page.getByText('Sustainable development')).toBeVisible();
  });
});
