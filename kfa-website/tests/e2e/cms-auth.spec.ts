import { test, expect, Page } from '@playwright/test';

const APP_URL = 'http://localhost:3000';

// Генерация уникальных email для тестов регистрации
const generateEmail = () => `test-cms-${Date.now()}@example.com`;

// Helper для ожидания навигации и загрузки
async function waitForNavigation(page: Page, url: string) {
  await page.waitForURL(url, { timeout: 10000 });
  await page.waitForLoadState('networkidle');
}

test.describe('CMS Authentication UI Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Очистить localStorage перед каждым тестом
    await page.goto(APP_URL);
    await page.evaluate(() => localStorage.clear());
  });

  test('should display registration form with all fields', async ({ page }) => {
    await page.goto(`${APP_URL}/auth/register`);
    await waitForNavigation(page, `${APP_URL}/auth/register`);

    // Проверить наличие всех полей формы
    await expect(page.locator('#firstName')).toBeVisible();
    await expect(page.locator('#lastName')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#phone')).toBeVisible();
    await expect(page.locator('#company')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#confirmPassword')).toBeVisible();

    // Проверить кнопку регистрации
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText(/зарегистрироваться/i);
  });

  test('should validate required fields on registration', async ({ page }) => {
    await page.goto(`${APP_URL}/auth/register`);
    await waitForNavigation(page, `${APP_URL}/auth/register`);

    // Попытка отправить пустую форму
    await page.locator('button[type="submit"]').click();

    // Ждать появления сообщений об ошибках (JavaScript валидация)
    await page.waitForTimeout(1000);

    // Проверить наличие ошибок валидации
    const errors = page.locator('p.text-red-600');
    await expect(errors.first()).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto(`${APP_URL}/auth/register`);
    await waitForNavigation(page, `${APP_URL}/auth/register`);

    // Заполнить форму с неверным email
    await page.fill('#firstName', 'Test');
    await page.fill('#lastName', 'User');
    await page.fill('#email', 'invalid-email');
    await page.fill('#phone', '+996700123456');
    await page.fill('#company', 'Test Company');
    await page.fill('#password', 'password123');
    await page.fill('#confirmPassword', 'password123');

    await page.locator('button[type="submit"]').click();

    // Ждать появления ошибки валидации email
    await page.waitForTimeout(1000);
    const emailError = page.locator('p.text-red-600').filter({ hasText: /email/i });
    await expect(emailError).toBeVisible();
  });

  test('should validate password confirmation match', async ({ page }) => {
    await page.goto(`${APP_URL}/auth/register`);
    await waitForNavigation(page, `${APP_URL}/auth/register`);

    const uniqueEmail = generateEmail();

    // Заполнить форму с несовпадающими паролями
    await page.fill('#firstName', 'Test');
    await page.fill('#lastName', 'User');
    await page.fill('#email', uniqueEmail);
    await page.fill('#phone', '+996700123456');
    await page.fill('#company', 'Test Company');
    await page.fill('#password', 'password123');
    await page.fill('#confirmPassword', 'different456');

    // Отметить соглашение с условиями
    await page.check('input[type="checkbox"]');

    await page.locator('button[type="submit"]').click();

    // Ждать сообщение об ошибке
    await page.waitForTimeout(2000);

    // Проверить наличие ошибки о несовпадении паролей
    const passwordError = page.locator('p.text-red-600').filter({ hasText: /пароли|password/i });
    await expect(passwordError).toBeVisible();
  });

  test.skip('should successfully register new user', async ({ page }) => {
    await page.goto(`${APP_URL}/auth/register`);
    await waitForNavigation(page, `${APP_URL}/auth/register`);

    const uniqueEmail = generateEmail();

    // Заполнить форму корректными данными
    await page.fill('#firstName', 'Test');
    await page.fill('#lastName', 'CMSUser');
    await page.fill('#email', uniqueEmail);
    await page.fill('#phone', '+996700123456');
    await page.fill('#company', 'Test Company');
    await page.fill('#password', 'Password123!');
    await page.fill('#confirmPassword', 'Password123!');

    // Отметить соглашение с условиями
    await page.check('input[type="checkbox"]');

    // Отправить форму
    await page.locator('button[type="submit"]').click();

    // Ждать редиректа
    await page.waitForURL(/\/(dashboard|auth\/login)/, { timeout: 15000 });

    // Проверить успешный редирект
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(dashboard|auth\/login)/);
  });

  test('should display login form with email and password', async ({ page }) => {
    await page.goto(`${APP_URL}/auth/login`);
    await waitForNavigation(page, `${APP_URL}/auth/login`);

    // Проверить наличие полей
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();

    // Проверить кнопку входа
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText(/войти/i);
  });

  test('should validate required fields on login', async ({ page }) => {
    await page.goto(`${APP_URL}/auth/login`);
    await waitForNavigation(page, `${APP_URL}/auth/login`);

    // Попытка отправить пустую форму
    await page.locator('button[type="submit"]').click();

    // Ждать появления ошибок
    await page.waitForTimeout(1000);

    // Проверить наличие ошибок валидации
    const errors = page.locator('p.text-red-600');
    await expect(errors.first()).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto(`${APP_URL}/auth/login`);
    await waitForNavigation(page, `${APP_URL}/auth/login`);

    // Заполнить форму неверными данными
    await page.fill('#email', 'nonexistent@example.com');
    await page.fill('#password', 'wrongpassword');

    await page.locator('button[type="submit"]').click();

    // Ждать сообщение об ошибке
    await page.waitForTimeout(3000);

    // Проверить, что остались на странице логина
    await expect(page).toHaveURL(`${APP_URL}/auth/login`);

    // Проверить наличие ошибки
    const error = page.locator('p.text-red-600');
    await expect(error.first()).toBeVisible();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    await page.goto(`${APP_URL}/auth/login`);
    await waitForNavigation(page, `${APP_URL}/auth/login`);

    // Использовать seeded тестовый аккаунт
    await page.fill('#email', 'admin@kfa.kg');
    await page.fill('#password', 'password');

    await page.locator('button[type="submit"]').click();

    // Ждать редиректа на дашборд
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });

    // Проверить, что токен сохранен в localStorage
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();

    // Проверить, что на странице дашборда
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should store user data in localStorage after login', async ({ page }) => {
    await page.goto(`${APP_URL}/auth/login`);
    await waitForNavigation(page, `${APP_URL}/auth/login`);

    await page.fill('#email', 'admin@kfa.kg');
    await page.fill('#password', 'password');
    await page.locator('button[type="submit"]').click();

    await page.waitForURL(/\/dashboard/, { timeout: 15000 });

    // Проверить localStorage
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const userStr = await page.evaluate(() => localStorage.getItem('user'));

    expect(token).toBeTruthy();
    expect(userStr).toBeTruthy();

    // Проверить структуру данных пользователя
    if (userStr) {
      const user = JSON.parse(userStr);
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('role');
      expect(user.email).toBe('admin@kfa.kg');
    }
  });

  test('should redirect to login when accessing protected route without auth', async ({ page }) => {
    // Убедиться, что localStorage чист
    await page.goto(APP_URL);
    await page.evaluate(() => localStorage.clear());

    // Попытка зайти на защищенную страницу
    await page.goto(`${APP_URL}/dashboard`);

    // Должен произойти редирект на login
    await page.waitForURL(/\/auth\/login/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('should maintain authentication across page reloads', async ({ page }) => {
    // Залогиниться
    await page.goto(`${APP_URL}/auth/login`);
    await waitForNavigation(page, `${APP_URL}/auth/login`);

    await page.fill('#email', 'admin@kfa.kg');
    await page.fill('#password', 'password');
    await page.locator('button[type="submit"]').click();

    await page.waitForURL(/\/dashboard/, { timeout: 15000 });

    // Сохранить токен
    const tokenBefore = await page.evaluate(() => localStorage.getItem('token'));

    // Перезагрузить страницу
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Проверить, что токен сохранился
    const tokenAfter = await page.evaluate(() => localStorage.getItem('token'));
    expect(tokenAfter).toBe(tokenBefore);

    // Проверить, что все еще на дашборде
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should logout and clear authentication data', async ({ page }) => {
    // Залогиниться
    await page.goto(`${APP_URL}/auth/login`);
    await waitForNavigation(page, `${APP_URL}/auth/login`);

    await page.fill('#email', 'admin@kfa.kg');
    await page.fill('#password', 'password');
    await page.locator('button[type="submit"]').click();

    await page.waitForURL(/\/dashboard/, { timeout: 15000 });

    // Найти и кликнуть кнопку выхода
    const logoutButton = page.locator('button:has-text("Выход"), button:has-text("Logout"), a:has-text("Выход"), a:has-text("Logout")').first();

    // Подождать, пока кнопка станет доступной
    await logoutButton.waitFor({ state: 'visible', timeout: 5000 });
    await logoutButton.click();

    // Ждать редиректа
    await page.waitForURL(/\/(auth\/login|$)/, { timeout: 10000 });

    // Проверить, что токен удален
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeNull();
  });

  test('should handle session expiration gracefully', async ({ page }) => {
    // Залогиниться
    await page.goto(`${APP_URL}/auth/login`);
    await waitForNavigation(page, `${APP_URL}/auth/login`);

    await page.fill('#email', 'admin@kfa.kg');
    await page.fill('#password', 'password');
    await page.locator('button[type="submit"]').click();

    await page.waitForURL(/\/dashboard/, { timeout: 15000 });

    // Имитировать невалидный токен
    await page.evaluate(() => {
      localStorage.setItem('token', 'invalid-token-12345');
    });

    // Попробовать перезагрузить страницу
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Должен произойти редирект на login из-за невалидного токена
    await page.waitForURL(/\/auth\/login/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('should display password visibility toggle', async ({ page }) => {
    await page.goto(`${APP_URL}/auth/login`);
    await waitForNavigation(page, `${APP_URL}/auth/login`);

    const passwordInput = page.locator('#password');

    // Изначально пароль должен быть скрыт
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Найти кнопку показа/скрытия пароля
    const toggleButton = page.locator('button').filter({ has: passwordInput.locator('..') }).last();

    if (await toggleButton.count() > 0) {
      // Кликнуть на кнопку
      await toggleButton.click();

      // Проверить, что тип изменился на text
      await expect(passwordInput).toHaveAttribute('type', 'text');

      // Кликнуть снова
      await toggleButton.click();

      // Проверить, что вернулся тип password
      await expect(passwordInput).toHaveAttribute('type', 'password');
    }
  });

  test('should have link to register page from login', async ({ page }) => {
    await page.goto(`${APP_URL}/auth/login`);
    await waitForNavigation(page, `${APP_URL}/auth/login`);

    // Найти ссылку на регистрацию
    const registerLink = page.locator('a:has-text("Зарегистрироваться")').first();
    await expect(registerLink).toBeVisible();

    // Кликнуть и проверить переход
    await registerLink.click();
    await page.waitForURL(/\/auth\/register/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/auth\/register/);
  });

  test('should have link to login page from register', async ({ page }) => {
    await page.goto(`${APP_URL}/auth/register`);
    await waitForNavigation(page, `${APP_URL}/auth/register`);

    // Найти ссылку на логин
    const loginLink = page.locator('a:has-text("Войти")').first();
    await expect(loginLink).toBeVisible();

    // Кликнуть и проверить переход
    await loginLink.click();
    await page.waitForURL(/\/auth\/login/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});

test.describe('CMS Authentication Edge Cases', () => {

  test('should handle network errors during login', async ({ page, context }) => {
    await page.goto(`${APP_URL}/auth/login`);
    await page.waitForLoadState('networkidle');

    // Блокировать все запросы к API
    await context.route('**/api/login', route => route.abort());

    await page.fill('#email', 'admin@kfa.kg');
    await page.fill('#password', 'password');
    await page.locator('button[type="submit"]').click();

    // Ждать обработки ошибки
    await page.waitForTimeout(3000);

    // Проверить, что остались на странице логина
    await expect(page).toHaveURL(`${APP_URL}/auth/login`);
  });

  test('should prevent multiple simultaneous login submissions', async ({ page }) => {
    await page.goto(`${APP_URL}/auth/login`);
    await page.waitForLoadState('networkidle');

    await page.fill('#email', 'admin@kfa.kg');
    await page.fill('#password', 'password');

    const submitButton = page.locator('button[type="submit"]');

    // Быстро кликнуть несколько раз
    await submitButton.click();

    // Кнопка должна быть заблокирована во время отправки
    await page.waitForTimeout(500);
    await expect(submitButton).toBeDisabled();
  });

  test('should handle whitespace in email input', async ({ page }) => {
    await page.goto(`${APP_URL}/auth/login`);
    await page.waitForLoadState('networkidle');

    // Ввести email с пробелами
    await page.fill('#email', '  admin@kfa.kg  ');
    await page.fill('#password', 'password');
    await page.locator('button[type="submit"]').click();

    // Логин должен пройти успешно (email должен быть обрезан на бэкенде)
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
