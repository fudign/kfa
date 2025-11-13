# Add Unit Tests Prime Prompt

Add comprehensive unit tests to code.

## Usage

```bash
kfa prime use add-unit-tests "Add tests for UserService class"
```

## Prompt Template

Add unit tests for:

{CONTEXT}

## React Component Testing (Vitest + Testing Library)

1. **Test File Setup**
   - Create {ComponentName}.test.tsx
   - Import component and testing utilities
   - Set up beforeEach/afterEach if needed

2. **Test Cases**
   - Renders correctly
   - Props are applied
   - User interactions work
   - State updates correctly
   - Callbacks are called
   - Conditional rendering
   - Edge cases

3. **Testing Library Queries**
   - getByRole (preferred)
   - getByLabelText
   - getByText
   - getByTestId (last resort)

4. **User Interactions**
   - Use userEvent for interactions
   - Test button clicks
   - Test form inputs
   - Test keyboard navigation

5. **Mocking**
   - Mock API calls
   - Mock dependencies
   - Mock context providers
   - Mock router

## Laravel Testing (PHPUnit)

1. **Test Types**
   - Unit tests (tests/Unit/)
   - Feature tests (tests/Feature/)

2. **Test Cases**
   - Method returns expected value
   - Validation works
   - Database operations work
   - Authorization works
   - Exceptions are thrown

3. **Assertions**
   - assertEquals, assertTrue, etc.
   - assertDatabaseHas
   - assertJson
   - assertStatus

4. **Test Data**
   - Use factories
   - Create test fixtures
   - Use seeders for setup

## Best Practices

1. **AAA Pattern**
   - Arrange: Set up test data
   - Act: Execute the code
   - Assert: Verify the result

2. **Test Naming**
   - Descriptive test names
   - Use "it should..." or "test..."
   - Clear intent

3. **Test Independence**
   - Each test standalone
   - No shared state
   - Clean up after tests

4. **Coverage**
   - Test happy path
   - Test error cases
   - Test edge cases
   - Test boundary conditions

5. **Maintainability**
   - DRY in tests
   - Clear assertions
   - Avoid test logic
   - Fast execution

## File Structure

Frontend:

- src/components/{Name}.test.tsx
- src/hooks/use{Name}.test.ts
- src/services/{name}.test.ts

Backend:

- tests/Unit/{Name}Test.php
- tests/Feature/{Name}ControllerTest.php

## Expected Output

1. Comprehensive test suite
2. Good test coverage
3. Clear test descriptions
4. Mocks for dependencies
5. Tests pass

## Success Criteria

- 80%+ code coverage
- All tests pass
- Tests are maintainable
- Fast execution (<5s)
- Clear failure messages
