# Fix Flaky Test Prime Prompt

Diagnose and fix unreliable tests.

## Usage

```bash
kfa prime use fix-flaky-test "Fix intermittent failure in login test"
```

## Prompt Template

Fix flaky test:

{CONTEXT}

## Common Causes of Flaky Tests

1. **Timing Issues**
   - Race conditions
   - Async operations not awaited
   - Network delays
   - Animation timing

2. **Test Dependencies**
   - Tests depend on each other
   - Shared state between tests
   - Test order matters

3. **External Dependencies**
   - Real API calls
   - Database state
   - File system operations
   - Third-party services

4. **Random Data**
   - Randomly generated values
   - Date/time dependencies
   - Non-deterministic behavior

## Diagnosis Steps

1. **Reproduce the Failure**
   - Run test multiple times
   - Run in isolation
   - Run with other tests
   - Check CI logs

2. **Identify Pattern**
   - When does it fail?
   - How often?
   - Which environment?
   - Specific conditions?

3. **Check Logs**
   - Error messages
   - Stack traces
   - Console logs
   - Network logs

## Fix Strategies

### 1. Fix Timing Issues

```typescript
// Bad
test('async operation', () => {
  triggerAsync();
  expect(result).toBe(expected); // Race condition!
});

// Good
test('async operation', async () => {
  await triggerAsync();
  expect(result).toBe(expected);
});
```

### 2. Proper Waits

```typescript
// E2E: Wait for elements
await page.waitForSelector('[data-testid="result"]');

// E2E: Wait for network
await page.waitForLoadState('networkidle');

// Unit: Wait for async updates
await waitFor(() => {
  expect(element).toBeInTheDocument();
});
```

### 3. Mock External Dependencies

```typescript
// Mock API calls
vi.mock('../api', () => ({
  fetchData: vi.fn().mockResolvedValue(mockData),
}));

// Mock timers
vi.useFakeTimers();
vi.advanceTimersByTime(1000);
```

### 4. Fix Test Independence

```typescript
// Clean up after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorage.clear();
});
```

### 5. Fix Random Data

```typescript
// Use fixed test data
const testUser = {
  id: 'test-user-123',
  name: 'Test User',
};

// Or seed random generator
Math.seedrandom('consistent-seed');
```

### 6. Increase Timeouts (Last Resort)

```typescript
test(
  'slow operation',
  async () => {
    // ...
  },
  { timeout: 10000 },
);
```

## Testing Fixes

1. **Run Multiple Times**

   ```bash
   npm test -- --run --repeat-each=20
   ```

2. **Run in Different Orders**

   ```bash
   npm test -- --run --shuffle
   ```

3. **Run in CI**
   - Verify fix in CI environment
   - Check different OS/browsers

## Documentation

- Document the root cause
- Explain the fix
- Add comments if non-obvious

## Expected Output

1. Stable test
2. Root cause documented
3. Fix applied
4. Verification of stability

## Success Criteria

- Test passes consistently (20+ runs)
- No race conditions
- Independent from other tests
- Fast execution maintained
- Well documented
