# Prime Prompt: Modernize Legacy Code

Update legacy code to use modern patterns, syntax, and best practices.

## Usage

```bash
kfa prime use refactoring/modernize-legacy-code "Modernize class components to hooks"
```

## Prompt Template

I need you to modernize legacy code:

**Context:** {CONTEXT}

Please update the following:

### 1. Modern Syntax
- ES6+ features (arrow functions, destructuring, spread)
- Async/await instead of callbacks/promises chains
- Optional chaining and nullish coalescing
- Template literals
- Modern imports/exports

### 2. React Modernization (if applicable)
- Class components → Functional components with hooks
- componentDidMount → useEffect
- setState → useState
- Context API instead of prop drilling
- Remove deprecated lifecycle methods

### 3. TypeScript (if applicable)
- Add proper type annotations
- Remove 'any' types
- Use interfaces/types properly
- Implement generics where useful

### 4. Best Practices
- Remove code duplication
- Extract magic numbers/strings to constants
- Use meaningful variable names
- Add error handling
- Implement proper validation

### 5. Dependencies
- Update to latest stable versions
- Remove unused dependencies
- Replace deprecated packages
- Use maintained alternatives

### 6. Testing
- Update tests for new patterns
- Add missing test coverage
- Use modern testing patterns

## Success Criteria

- ✅ Code uses modern syntax
- ✅ No deprecated patterns
- ✅ Type safety improved
- ✅ All tests pass
- ✅ No breaking changes
