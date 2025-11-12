# Test Coverage Analysis Prime Prompt

Analyze and improve test coverage.

## Usage

```bash
kfa prime use test-coverage-analysis "Improve coverage for user module"
```

## Prompt Template

Analyze and improve test coverage for:

{CONTEXT}

## Generate Coverage Report

### Frontend (Vitest)
```bash
npm test -- --coverage
```

### Backend (PHPUnit)
```bash
php artisan test --coverage
```

## Analysis Steps

1. **Review Coverage Report**
   - Overall coverage percentage
   - Coverage by file
   - Uncovered lines
   - Uncovered branches
   - Uncovered functions

2. **Identify Gaps**
   - Critical paths not tested
   - Error handling not tested
   - Edge cases not covered
   - Complex logic without tests

3. **Prioritize**
   - Business-critical code first
   - Complex algorithms
   - Error-prone areas
   - Frequently changed code

4. **Set Goals**
   - 80%+ line coverage (minimum)
   - 70%+ branch coverage
   - 90%+ for critical code
   - 100% for utility functions

## Improving Coverage

1. **Add Missing Tests**
   - Test uncovered lines
   - Test all branches
   - Test error paths
   - Test edge cases

2. **Test Scenarios**
   - Happy path
   - Error scenarios
   - Boundary conditions
   - Null/undefined inputs
   - Invalid inputs

3. **Branch Coverage**
   - If/else branches
   - Switch cases
   - Ternary operators
   - Logical operators (&&, ||)

4. **Exception Handling**
   - Test error throws
   - Test error catches
   - Test error messages

## Coverage Types

1. **Line Coverage**
   - Percentage of lines executed
   - Most basic metric

2. **Branch Coverage**
   - Percentage of branches taken
   - More meaningful than line

3. **Function Coverage**
   - Percentage of functions called
   - Ensure all exported

4. **Statement Coverage**
   - Similar to line coverage
   - More granular

## Anti-Patterns

1. **Don't Chase 100%**
   - Not all code needs testing
   - Generated code can be excluded
   - Diminishing returns

2. **Don't Test Implementation**
   - Test behavior, not internals
   - Tests should be refactor-proof

3. **Don't Add Meaningless Tests**
   - Tests should verify behavior
   - Not just for coverage metric

## Configuration

### Vitest (vitest.config.ts)
```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.spec.ts'
      ],
      thresholds: {
        lines: 80,
        branches: 70,
        functions: 80,
        statements: 80
      }
    }
  }
});
```

### PHPUnit (phpunit.xml)
```xml
<coverage>
  <include>
    <directory suffix=".php">app</directory>
  </include>
  <exclude>
    <directory>app/Console</directory>
  </exclude>
  <report>
    <html outputDirectory="coverage/html"/>
    <text outputFile="php://stdout"/>
  </report>
</coverage>
```

## Reporting

1. **Generate Reports**
   - HTML for visual review
   - LCOV for CI integration
   - Text for quick check

2. **Track Over Time**
   - Monitor coverage trends
   - Enforce minimums in CI
   - Celebrate improvements

3. **Review in PRs**
   - Check coverage diff
   - Require tests for new code
   - Flag coverage decreases

## CI Integration

```yaml
# GitHub Actions example
- name: Run tests with coverage
  run: npm test -- --coverage

- name: Enforce coverage threshold
  run: npm test -- --coverage --thresholds.lines=80
```

## Expected Output

1. Coverage report
2. Gap analysis
3. New tests for gaps
4. Improved coverage metrics
5. Coverage trends documented

## Success Criteria

- 80%+ overall coverage
- Critical paths 100% covered
- No uncovered error handling
- Coverage tracked in CI
- Team understands metrics
