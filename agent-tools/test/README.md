# Test Tools

Simple testing utilities. Output JSON for easy parsing.

## Tools

### run-e2e.js

Run Playwright E2E tests.

```bash
node test/run-e2e.js [--test=name]
```

Output: Test results JSON

### run-unit.js

Run PHPUnit backend tests.

```bash
node test/run-unit.js [--filter=pattern]
```

Output: Test results JSON

### coverage.js

Generate test coverage report.

```bash
node test/coverage.js
```

Output: Coverage stats JSON

## Examples

```bash
# Run all E2E tests
node test/run-e2e.js > e2e-results.json

# Run specific test
node test/run-e2e.js --test=login > login-test.json

# Run backend unit tests
node test/run-unit.js > unit-results.json

# Get coverage
node test/coverage.js > coverage.json
```
