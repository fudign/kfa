# E2E Тесты для KFA Website

## Обзор

Этот каталог содержит end-to-end тесты для всех страниц сайта КФА, использующие Playwright.

## Типы тестов

### 1. **all-pages-smoke.spec.ts** - Smoke тесты всех страниц

Проверяет базовую работоспособность всех публичных страниц

### 2. **all-pages-critical-errors.spec.ts** - Критические ошибки

Детальная проверка на критические ошибки

## Запуск тестов

```bash
cd kfa-website

# Все E2E тесты
npm run test:e2e

# Только smoke тесты
npm run test:e2e:smoke

# Только проверка критических ошибок
npm run test:e2e:errors

# Все тесты всех страниц
npm run test:e2e:all-pages
```

## Требования

1. Dev сервер должен быть запущен: `npm run dev`
2. Установлены Playwright браузеры: `npx playwright install`
