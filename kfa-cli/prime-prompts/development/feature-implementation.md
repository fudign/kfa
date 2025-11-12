# Feature Implementation Prime Prompt

Complete feature implementation following KFA best practices.

## Usage

```bash
kfa prime use feature-implementation "Add news filtering by category"
```

## Prompt Template

I need to implement the following feature for the KFA project:

{CONTEXT}

Please follow these steps:

1. **Analysis Phase**
   - Review existing codebase structure
   - Identify affected components (frontend/backend)
   - Check for similar implementations
   - Verify dependencies and compatibility

2. **Planning Phase**
   - Create implementation plan in specs/ directory
   - Break down into subtasks
   - Identify risks and edge cases
   - Estimate complexity

3. **Implementation Phase**
   - Frontend: React + TypeScript + TailwindCSS
   - Backend: Laravel 10 + PHP 8.1
   - Database: PostgreSQL via Supabase
   - Add proper TypeScript types
   - Implement comprehensive error handling
   - Add input validation

4. **Testing Phase**
   - Add unit tests (Vitest for frontend)
   - Add E2E tests (Playwright)
   - Test edge cases and error scenarios
   - Run: kfa test all

5. **Documentation Phase**
   - Add JSDoc/PHPDoc comments
   - Update relevant README files
   - Add usage examples

6. **Pre-Commit Phase**
   - Run: kfa dev check
   - Fix any linting issues
   - Verify: kfa deploy verify
   - Check for security issues

Output the implementation plan to specs/feature-{name}.md before starting.

## Context Files

- kfa-website/src/ - Frontend code
- kfa-backend/kfa-api/app/ - Backend code
- docs/architecture/ - Architecture docs

## Expected Output

1. specs/feature-{name}.md - Detailed plan
2. Implementation code (frontend + backend)
3. Unit and E2E tests
4. Documentation updates

## Success Criteria

- All tests pass (kfa test all)
- No linting errors
- Documentation complete
- Code reviewed
- Ready for deployment
