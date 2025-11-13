# 🧪 КФА Testing Guide

**Comprehensive Testing Documentation**

---

## 📋 Testing Overview

### Test Coverage:

```
E2E Tests:        195 tests (144 passing, 51 blocked)
Unit Tests:       TBD
Integration:      Covered by E2E
API Tests:        Via E2E business-processes.spec.ts
```

### Testing Stack:

- **E2E**: Playwright
- **Runner**: Vitest
- **Assertions**: Chai/Expect
- **API**: Native fetch/request

---

## 🚀 Quick Start

### Run All Tests:

```bash
cd kfa-website
npm test
```

### Run Specific Test File:

```bash
# Business Processes
npm test tests/e2e/business-processes.spec.ts

# CMS Tests
npm test tests/e2e/cms-news.spec.ts

# Auth Tests
npm test tests/e2e/auth-roles.spec.ts
```

### Run Single Test:

```bash
npm test tests/e2e/business-processes.spec.ts -t "USER can submit membership application"
```

### Watch Mode:

```bash
npm test -- --watch
```

---

## 📁 Test Files Structure

```
tests/e2e/
├── business-processes.spec.ts    # 8 test suites, 40+ tests
├── cms-news.spec.ts              # CMS news functionality
├── cms-media.spec.ts             # Media upload/management
├── cms-auth.spec.ts              # CMS authentication
├── auth-roles.spec.ts            # Role-based access control
├── navigation.spec.ts            # Navigation tests
├── i18n.spec.ts                  # Internationalization
├── visual.spec.ts                # Visual regression
├── guest-and-ownership.spec.ts   # Guest access & ownership
├── home.spec.ts                  # Home page tests
├── all-pages-smoke.spec.ts       # Smoke tests for all pages
└── all-pages-critical-errors.spec.ts  # Critical error detection
```

---

## 🎯 Test Categories

### 1. Business Processes Tests

**File:** `tests/e2e/business-processes.spec.ts`

**Covers:**

- Membership Application Process (7 tests)
- Payment Processing (6 tests)
- Content Creation & Moderation (7 tests)
- Certification Process (8 tests)
- Membership Lifecycle (5 tests)
- Event Registration (4 tests)
- Dashboard Access Control (9 tests)
- User Management (6 tests)

**Run:**

```bash
npm test tests/e2e/business-processes.spec.ts
```

**Example Test:**

```typescript
test('USER can submit membership application', async ({ request }) => {
  const response = await request.post(`${API_URL}/applications`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: {
      membership_type: 'full',
      organization: 'Test Company',
      position: 'Financial Analyst',
      // ...
    },
  });

  expect(response.status()).toBe(201);
  const data = await response.json();
  expect(data.data.status).toBe('pending');
});
```

---

### 2. CMS Tests

**Files:**

- `cms-news.spec.ts` - News CRUD operations
- `cms-media.spec.ts` - Media upload/management
- `cms-auth.spec.ts` - CMS authentication

**Run:**

```bash
npm test tests/e2e/cms-news.spec.ts
npm test tests/e2e/cms-media.spec.ts
npm test tests/e2e/cms-auth.spec.ts
```

---

### 3. Authentication & Authorization Tests

**File:** `auth-roles.spec.ts`

**Covers:**

- User registration
- User login
- Role-based access (admin, member, user)
- Permission checks
- Token management

**Run:**

```bash
npm test tests/e2e/auth-roles.spec.ts
```

---

### 4. Visual & UI Tests

**Files:**

- `visual.spec.ts` - Visual regression
- `navigation.spec.ts` - Navigation flows
- `home.spec.ts` - Home page

**Run:**

```bash
npm test tests/e2e/visual.spec.ts
npm test tests/e2e/navigation.spec.ts
```

---

## 🔧 Test Configuration

### Playwright Config

**File:** `playwright.config.ts`

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

### Test Accounts

**Defined in:** `tests/e2e/business-processes.spec.ts`

```typescript
const testAccounts = {
  user: {
    email: 'user@kfa.kg',
    password: 'password',
    role: 'user',
  },
  member: {
    email: 'member@kfa.kg',
    password: 'password',
    role: 'member',
  },
  admin: {
    email: 'admin@kfa.kg',
    password: 'password',
    role: 'admin',
  },
};
```

**⚠️ Note:** Create these accounts in Supabase before running tests!

---

## 📊 Test Results Interpretation

### Passing Test:

```
✓ USER can submit membership application (245ms)
```

### Failing Test:

```
✗ MEMBER can create payment
  Expected status 201, received 422
  Error: Validation failed
```

### Blocked Test:

```
⊗ ADMIN can issue certificate
  Error: ECONNREFUSED - API endpoint not available
```

---

## 🐛 Debugging Tests

### 1. Enable Verbose Output

```bash
npm test -- --reporter=verbose
```

### 2. Run Single Test with Debugging

```bash
npm test tests/e2e/business-processes.spec.ts -t "USER can submit" -- --debug
```

### 3. Check API Responses

```typescript
test('Debug API response', async ({ request }) => {
  const response = await request.get(`${API_URL}/news`);

  console.log('Status:', response.status());
  console.log('Headers:', response.headers());
  console.log('Body:', await response.text());
});
```

### 4. Use Playwright Trace Viewer

```bash
# After test failure
npx playwright show-trace trace.zip
```

---

## ✅ Pre-Test Checklist

Before running tests, ensure:

### Backend:

- [ ] Backend is running (`php artisan serve`)
- [ ] Database is configured
- [ ] Migrations are run
- [ ] Test accounts exist

### Frontend:

- [ ] Frontend is running (`npm run dev`)
- [ ] Environment variables are set
- [ ] API URL is correct

### Test Environment:

- [ ] API_URL in tests matches backend
- [ ] Test accounts have correct roles
- [ ] Database has seed data (optional)

---

## 📈 Test Coverage

### Current Status (as of 2025-11-13):

**Passing:**

```
✅ Membership Applications  - 7/7 tests
✅ Payment Processing       - 6/6 tests
✅ Event Registration       - 4/4 tests
✅ CMS News                 - 12/12 tests
✅ Auth & Roles             - 15/15 tests
✅ Navigation               - 8/8 tests
```

**Blocked (Missing Backend APIs):**

```
⊗ Certification Process     - 8 tests (need courses API)
⊗ Membership Lifecycle      - 5 tests (need membership API)
⊗ User Management           - 6 tests (need users API)
```

**Total:**

- 144 tests passing (74%)
- 51 tests blocked (26%)
- 0 tests failing

---

## 🎯 Testing Best Practices

### 1. Use Descriptive Test Names

```typescript
// ❌ Bad
test('test 1', async () => {});

// ✅ Good
test('USER can submit membership application and receive pending status', async () => {});
```

### 2. Clean Up After Tests

```typescript
test.afterEach(async ({ request }) => {
  // Clean up created resources
  if (createdResourceId) {
    await request.delete(`${API_URL}/resource/${createdResourceId}`);
  }
});
```

### 3. Use Proper Assertions

```typescript
// Check status code
expect(response.status()).toBe(201);

// Check response structure
expect(data).toHaveProperty('success');
expect(data.data).toHaveProperty('id');

// Check values
expect(data.data.status).toBe('pending');
```

### 4. Handle Async Properly

```typescript
// ❌ Bad
test('test', async ({ request }) => {
  const response = request.get('/api/news');
  expect(response.status()).toBe(200); // Error!
});

// ✅ Good
test('test', async ({ request }) => {
  const response = await request.get('/api/news');
  expect(response.status()).toBe(200);
});
```

---

## 🔄 Continuous Integration

### GitHub Actions Example:

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test
        env:
          API_URL: ${{ secrets.API_URL }}
```

---

## 📝 Writing New Tests

### Test Template:

```typescript
import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost/api';

test.describe('Feature Name', () => {
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    // Setup: Login, create resources, etc.
    const response = await request.post(`${API_URL}/login`, {
      data: { email: 'test@kfa.kg', password: 'password' },
    });
    authToken = (await response.json()).token;
  });

  test('should do something', async ({ request }) => {
    const response = await request.get(`${API_URL}/endpoint`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
  });

  test.afterAll(async ({ request }) => {
    // Cleanup
  });
});
```

---

## 🚨 Common Test Issues

### Issue: Tests timeout

**Solution:**

```typescript
// Increase timeout for slow tests
test('slow test', async ({ request }) => {
  test.setTimeout(60000); // 60 seconds
  // ...
});
```

### Issue: Flaky tests

**Solution:**

```typescript
// Add retry logic
test('flaky test', async ({ request }) => {
  test.retry(2); // Retry up to 2 times
  // ...
});
```

### Issue: Database state issues

**Solution:**

```typescript
// Use unique identifiers
const uniqueEmail = `test-${Date.now()}@kfa.kg`;
```

---

## 📊 Test Reports

### Generate HTML Report:

```bash
npm test -- --reporter=html
```

### View Report:

```bash
npx playwright show-report
```

### CI/CD Report:

```yaml
- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

---

## ✅ Testing Checklist

### Before Committing:

- [ ] All tests pass locally
- [ ] New features have tests
- [ ] No console errors
- [ ] Test coverage maintained

### Before Deploying:

- [ ] All E2E tests pass
- [ ] API tests pass
- [ ] Visual tests pass
- [ ] Performance tests pass

---

_Testing Guide v1.0.0 - Updated: 2025-11-13_
