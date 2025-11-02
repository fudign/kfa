# 📘 Техническая спецификация - KFA Website

## 🎯 Обзор проекта

**Название**: Кыргызский Финансовый Альянс - Корпоративный сайт
**Тип**: SPA (Single Page Application) с SSR возможностями
**Целевая аудитория**: Профессиональные участники рынка ценных бумаг, регуляторы, инвесторы

## 🏗️ Архитектурные решения

### Frontend Architecture

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│   (React Components + Aceternity UI)    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│         State Management Layer          │
│  (Zustand + TanStack Query + Context)   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│            API Layer                    │
│      (Axios + API Hooks + tRPC)         │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│          Backend Services               │
│   (REST API / GraphQL / WebSocket)      │
└─────────────────────────────────────────┘
```

### Component Architecture

Используется **Feature-based** подход:

```
features/
├── auth/
│   ├── components/     # UI компоненты авторизации
│   ├── hooks/         # Кастомные хуки (useAuth, useLogin)
│   ├── api/           # API методы
│   ├── stores/        # Zustand стейты
│   └── types/         # TypeScript типы
├── members/
├── events/
└── ...
```

## 🎨 UI/UX Спецификация

### Design Tokens

```typescript
// Цвета
const colors = {
  primary: {
    main: '#1A3A6B',    // Основной синий
    light: '#3387cf',
    dark: '#0a172b',
  },
  accent: {
    main: '#D4AF37',    // Золотой
    light: '#efc75f',
    dark: '#7f6921',
  },
};

// Типографика
const typography = {
  fontFamily: {
    display: 'Montserrat',
    body: 'Inter',
    mono: 'JetBrains Mono',
  },
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
  },
};

// Spacing
const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
};

// Breakpoints
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};
```

### Component Library

| Компонент | Источник | Назначение |
|-----------|----------|------------|
| Button | shadcn/ui | Кнопки с вариантами |
| Card | shadcn/ui | Карточки контента |
| Form | shadcn/ui | Формы с валидацией |
| Table | shadcn/ui + TanStack | Таблицы с сортировкой |
| Dialog | shadcn/ui | Модальные окна |
| Select | shadcn/ui | Выпадающие списки |
| Tabs | shadcn/ui | Вкладки |
| Spotlight | Aceternity | Hero эффекты |
| CardStack | Aceternity | Анимированные карточки |
| GlareCard | Aceternity | Hover эффекты |

### Accessibility Standards

- **WCAG 2.1 Level AA** соблюдение
- Keyboard navigation для всех интерактивных элементов
- Screen reader совместимость
- Color contrast ratio ≥4.5:1 для текста
- Focus indicators для всех элементов
- ARIA labels где необходимо

## 🔌 API Integration

### REST API Endpoints (пример)

```typescript
// Base URL
const API_BASE = process.env.VITE_API_URL;

// Endpoints
const endpoints = {
  // Auth
  login: '/auth/login',
  logout: '/auth/logout',
  refresh: '/auth/refresh',

  // Members
  getMembers: '/members',
  getMember: '/members/:id',
  createMember: '/members',

  // Events
  getEvents: '/events',
  registerEvent: '/events/:id/register',

  // News
  getNews: '/news',
  getNewsItem: '/news/:id',
};
```

### Data Fetching Strategy

```typescript
// TanStack Query для серверного состояния
import { useQuery, useMutation } from '@tanstack/react-query';

// Пример хука
function useMembers() {
  return useQuery({
    queryKey: ['members'],
    queryFn: fetchMembers,
    staleTime: 5 * 60 * 1000, // 5 минут
    cacheTime: 10 * 60 * 1000, // 10 минут
  });
}

// Zustand для клиентского состояния
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

## 🌐 Internationalization

### Поддерживаемые языки

- **Русский** (ru) - основной
- **Кыргызский** (ky)
- **Английский** (en)

### Структура переводов

```
public/locales/
├── ru/
│   ├── common.json       # Общие переводы
│   ├── home.json         # Главная страница
│   ├── membership.json   # Членство
│   ├── auth.json         # Авторизация
│   └── errors.json       # Сообщения об ошибках
├── ky/
│   └── ...
└── en/
    └── ...
```

### Использование

```tsx
import { useTranslation } from 'react-i18next';

function Component() {
  const { t, i18n } = useTranslation('home');

  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <button onClick={() => i18n.changeLanguage('en')}>
        English
      </button>
    </div>
  );
}
```

## 🔒 Security

### Authentication Flow

```
1. User enters credentials
2. Frontend sends POST /auth/login
3. Backend validates and returns JWT + refresh token
4. Frontend stores tokens (httpOnly cookie preferred)
5. All subsequent requests include JWT in Authorization header
6. On token expiry, use refresh token to get new JWT
```

### Security Headers

```typescript
// vite.config.ts
export default {
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
};
```

### Input Validation

Все формы используют **Zod** для валидации:

```typescript
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(8, 'Минимум 8 символов'),
});

type LoginForm = z.infer<typeof loginSchema>;
```

## ⚡ Performance Optimization

### Code Splitting

```typescript
// Lazy loading страниц
const HomePage = lazy(() => import('@/pages/public/Home'));
const DashboardPage = lazy(() => import('@/pages/member/Dashboard'));

// Suspense обертка
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/dashboard" element={<DashboardPage />} />
  </Routes>
</Suspense>
```

### Image Optimization

```typescript
// Компонент OptimizedImage
<OptimizedImage
  src="/images/hero.jpg"
  alt="КФА"
  loading="lazy"
  aspectRatio="16/9"
/>
```

### Bundle Size Targets

- Initial bundle: **< 200KB gzipped**
- Per-route chunks: **< 100KB gzipped**
- Total bundle: **< 1MB gzipped**

### Performance Metrics

| Метрика | Target | Excellent |
|---------|--------|-----------|
| LCP (Largest Contentful Paint) | < 2.5s | < 1.5s |
| FID (First Input Delay) | < 100ms | < 50ms |
| CLS (Cumulative Layout Shift) | < 0.1 | < 0.05 |
| TTI (Time to Interactive) | < 3.5s | < 2.5s |

## 📱 Responsive Design

### Breakpoint Strategy

```css
/* Mobile first approach */

/* xs: 0-639px (mobile) */
.component { ... }

/* sm: 640px+ (large mobile/tablet) */
@media (min-width: 640px) { ... }

/* md: 768px+ (tablet) */
@media (min-width: 768px) { ... }

/* lg: 1024px+ (desktop) */
@media (min-width: 1024px) { ... }

/* xl: 1280px+ (large desktop) */
@media (min-width: 1280px) { ... }

/* 2xl: 1536px+ (extra large) */
@media (min-width: 1536px) { ... }
```

## 🧪 Testing Strategy

### Unit Tests (Vitest)

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### E2E Tests (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('user can navigate to membership page', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('text=Членство');
  await expect(page).toHaveURL(/.*membership/);
});
```

### Test Coverage Targets

- Unit tests: **≥ 80%**
- Integration tests: **≥ 70%**
- E2E tests: **Critical user flows**

## 🚀 Deployment

### Build Process

```bash
# 1. Проверка типов
npm run type-check

# 2. Линтинг
npm run lint

# 3. Тесты
npm run test

# 4. Сборка
npm run build

# 5. Preview сборки
npm run preview
```

### Environment Variables

```bash
# Development
VITE_API_URL=http://localhost:8000/api
VITE_ENV=development

# Production
VITE_API_URL=https://api.kfa.kg
VITE_ENV=production
```

### CI/CD Pipeline (пример для GitHub Actions)

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20

      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

      - name: Deploy to production
        run: npm run deploy
```

## 📊 Monitoring & Analytics

### Error Tracking

```typescript
// Sentry integration (опционально)
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.VITE_ENV,
});
```

### Analytics

```typescript
// Google Analytics 4 (опционально)
import ReactGA from 'react-ga4';

ReactGA.initialize(process.env.VITE_GA_MEASUREMENT_ID);
```

## 📚 Documentation

### Code Documentation

Используйте **TSDoc** для документирования:

```typescript
/**
 * Форматирует число в валюту
 * @param amount - Сумма для форматирования
 * @param currency - Код валюты (по умолчанию KGS)
 * @returns Отформатированная строка
 * @example
 * formatCurrency(1000) // "1 000 сом"
 */
export function formatCurrency(amount: number, currency = 'KGS'): string {
  // ...
}
```

### Component Documentation

Используйте **Storybook** (опционально):

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'UI/Button',
};

export default meta;
```

## 🔄 Version Control

### Git Workflow

```
main (production)
  ↑
develop (staging)
  ↑
feature/* (feature branches)
```

### Commit Convention

```
type(scope): message

Types:
- feat: новая функциональность
- fix: исправление бага
- docs: документация
- style: форматирование
- refactor: рефакторинг
- test: тесты
- chore: настройки

Example:
feat(auth): add social login
fix(members): correct table sorting
docs(readme): update installation steps
```

---

**Версия спецификации**: 1.0.0
**Дата**: 2025-10-21
**Статус**: УТВЕРЖДЕНО
