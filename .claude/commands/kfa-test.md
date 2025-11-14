# Test KFA Application

You are helping test the KFA project.

## Context

KFA testing stack:

- **E2E Tests:** Custom JavaScript tests in `agent-tools/test/`
- **Unit Tests:** Component and API tests
- **Manual Tests:** Browser-based testing
- **Tools:** agent-tools suite for automation

## Testing Strategy

### 1. Quick Health Check

```bash
# Database connection
node agent-tools/supabase/test-connection.js

# Frontend build
node agent-tools/deploy/build-frontend.js

# Deployment status
node agent-tools/deploy/health-check.js --url=https://kfa-website.vercel.app
```

### 2. Database Tests

```bash
# Test connection and schema
node agent-tools/supabase/test-connection.js

# Test specific table (if test exists)
# Create table-specific tests in agent-tools/test/
```

### 3. API Tests

Test each feature's CRUD operations:

**News API:**

```bash
node agent-tools/test/test-news-api.js
# Should test: fetch all, fetch by id, create, update, delete
```

**Partners API:**

```bash
node agent-tools/test/test-partners-api.js
# Should test: fetch all, fetch by id, create, update, delete
```

**Settings API:**

```bash
node agent-tools/test/test-settings-api.js
# Should test: fetch, update
```

### 4. Frontend Component Tests

Test key user flows:

**Public Pages:**

- Homepage loads
- News section displays articles
- Partners section displays logos
- Responsive on mobile

**Dashboard (Admin):**

- Login works
- News manager CRUD operations
- Partners manager CRUD operations
- Settings manager updates
- Media upload works
- Logout works

### 5. E2E Test Suite

```bash
# Run all E2E tests
node agent-tools/test/run-e2e.js

# Run specific test
node agent-tools/test/run-e2e.js --test=news

# Run with verbose output
node agent-tools/test/run-e2e.js --verbose
```

### 6. Manual Testing Checklist

Create a testing checklist:

#### Public Site

- [ ] Homepage loads without errors
- [ ] News section shows recent articles
- [ ] Partners section shows logos
- [ ] Footer displays correctly
- [ ] Mobile responsive
- [ ] Images load properly

#### Dashboard

- [ ] Login redirects to dashboard
- [ ] News manager loads
- [ ] Can create news article
- [ ] Can edit news article
- [ ] Can delete news article
- [ ] Can upload images
- [ ] Partners manager works
- [ ] Settings manager works
- [ ] Logout works

#### Cross-Browser

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Safari
- [ ] Mobile Chrome

### 7. Performance Tests

```bash
# Check build size
node agent-tools/deploy/build-frontend.js
# Review bundle size warnings

# Test load time
# Use Lighthouse in Chrome DevTools
# Target: Performance score > 90
```

### 8. Security Tests

```bash
# Check RLS policies
# Verify unauthenticated users can't access admin
# Test CORS is properly configured
# Ensure API keys are not exposed
```

## Creating New Tests

### Test Template

Create new tests in `agent-tools/test/`:

```javascript
#!/usr/bin/env node
/**
 * Test {Feature} functionality
 */

const { createClient } = require('@supabase/supabase-js');

async function test{Feature}() {
  console.log('Testing {Feature}...');

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
  );

  // Test fetch
  const { data, error } = await supabase
    .from('{table}')
    .select('*');

  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }

  console.log('✅ Success:', data.length, 'items found');
  return { success: true, count: data.length };
}

test{Feature}()
  .then(result => {
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  });
```

## Output Format

All tests should output JSON:

```json
{
  "success": true,
  "test": "news-api",
  "results": {
    "fetch": "passed",
    "create": "passed",
    "update": "passed",
    "delete": "passed"
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

## Continuous Testing

Set up automated testing:

```bash
# Pre-commit tests
bash agent-tools/scripts/test-all.sh

# Pre-deploy tests
bash agent-tools/scripts/pre-deploy-check.sh
```

## Output

After testing, provide:

1. Test results summary
2. Pass/fail for each test
3. Any errors found
4. Recommendations for fixes
5. Updated test coverage metrics
