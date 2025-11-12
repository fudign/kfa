# Prime Prompt: React Component Creation

Create a reusable React component with TypeScript, following best practices and modern patterns.

## Usage

```bash
kfa prime use development/react-component "Create UserCard component with avatar"
```

## Prompt Template

I need you to create a React component with the following requirements:

**Context:** {CONTEXT}

Please follow these guidelines:

### 1. Component Structure
- Use TypeScript with proper type definitions
- Implement as functional component with hooks
- Export both named and default exports
- Include proper JSDoc comments

### 2. Props Interface
- Define TypeScript interface for all props
- Include optional props with default values
- Document each prop with JSDoc
- Use discriminated unions for variants if applicable

### 3. State Management
- Use appropriate React hooks (useState, useEffect, useCallback, useMemo)
- Implement proper cleanup in useEffect
- Optimize re-renders with memoization when needed
- Handle loading and error states

### 4. Styling
- Use CSS modules or styled-components
- Implement responsive design
- Follow existing design system patterns
- Include hover/focus/active states

### 5. Accessibility
- Add proper ARIA labels
- Ensure keyboard navigation works
- Include role attributes where appropriate
- Handle focus management

### 6. Testing
- Create test file with vitest/jest
- Test component rendering
- Test user interactions
- Test edge cases and error states

### 7. Documentation
- Add usage examples in JSDoc
- Document props and their types
- Include code example in component file
- Note any special considerations

## Context Files

Review these files for patterns and conventions:
- src/components/ - Existing component patterns
- src/types/ - Type definitions
- src/styles/ - Styling conventions
- src/hooks/ - Custom hooks usage

## Expected Output

Provide:
1. Component file (ComponentName.tsx)
2. Type definitions (ComponentName.types.ts)
3. Styles file (ComponentName.module.css or styled.ts)
4. Test file (ComponentName.test.tsx)
5. Usage example in comments

## Success Criteria

- ✅ Component renders correctly
- ✅ TypeScript types are complete and accurate
- ✅ All props are properly typed and documented
- ✅ Component is fully accessible
- ✅ Tests cover main functionality
- ✅ Styles are responsive and follow design system
- ✅ No console warnings or errors
- ✅ Code follows project conventions
