# Prime Prompt: Integration Tests

Write integration tests that test multiple components/modules working together.

## Usage

```bash
kfa prime use testing/integration-tests "Test user registration flow"
```

## Prompt Template

I need integration tests for:

**Context:** {CONTEXT}

### Test Coverage
- Test complete user flows
- Test API integration
- Test database operations
- Test third-party services (mocked)
- Test error scenarios

### Test Structure
- Setup test database/environment
- Seed test data
- Execute test scenario
- Verify results
- Cleanup after tests

### Assertions
- Verify data persistence
- Check API responses
- Validate side effects
- Test state changes
- Verify integrations

## Success Criteria
- ✅ Full flows tested
- ✅ Tests are isolated
- ✅ Tests are repeatable
- ✅ Good coverage achieved
