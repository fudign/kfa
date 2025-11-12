# Add E2E Tests Prime Prompt

Add end-to-end tests using Playwright.

## Usage

```bash
kfa prime use add-e2e-tests "Add E2E tests for registration flow"
```

## Prompt Template

Add E2E tests for:

{CONTEXT}

## Playwright E2E Testing

1. **Test File Setup**
   - Create in tests/e2e/
   - Import Playwright utilities
   - Use describe/test blocks

2. **Test Scenarios**
   - User journey from start to finish
   - Authentication flows
   - Form submissions
   - Navigation
   - Data display
   - Error handling

3. **Page Object Pattern**
   - Create page objects for reusability
   - Encapsulate page selectors
   - Encapsulate page actions
   - Make tests more maintainable

4. **Playwright API**
   - page.goto() - Navigate
   - page.click() - Click elements
   - page.fill() - Fill inputs
   - page.type() - Type text
   - page.waitForSelector() - Wait for elements
   - page.screenshot() - Debug

5. **Assertions**
   - expect(page).toHaveURL()
   - expect(element).toBeVisible()
   - expect(element).toHaveText()
   - expect(element).toHaveAttribute()

6. **Test Data**
   - Use fixtures for test data
   - Clean up after tests
   - Use unique identifiers

7. **Wait Strategies**
   - Wait for network idle
   - Wait for specific elements
   - Wait for navigation
   - Use auto-wait features

8. **Multiple Browsers**
   - Test in Chromium, Firefox, WebKit
   - Test mobile viewports
   - Test different screen sizes

## Test Structure

```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    
    // Act
    await page.click('button');
    
    // Assert
    await expect(page).toHaveURL('/success');
  });
});
```

## File Organization

- tests/e2e/auth/login.spec.ts
- tests/e2e/auth/register.spec.ts
- tests/e2e/pages/ - Page objects
- tests/e2e/fixtures/ - Test fixtures

## Best Practices

1. **Stable Selectors**
   - Use data-testid
   - Avoid CSS classes
   - Use role-based selectors

2. **Independence**
   - Each test standalone
   - No test order dependency
   - Clean state between tests

3. **Speed**
   - Minimize page loads
   - Use beforeAll for setup
   - Run in parallel

4. **Debugging**
   - Use page.pause()
   - Take screenshots on failure
   - Use trace viewer

## Running Tests

```bash
kfa test e2e
npm run test:e2e
```

## Expected Output

1. E2E test suite
2. Page objects (if needed)
3. Test fixtures
4. CI/CD integration ready

## Success Criteria

- Critical user flows tested
- Tests pass consistently
- Fast execution
- Clear test descriptions
- Screenshots on failure
