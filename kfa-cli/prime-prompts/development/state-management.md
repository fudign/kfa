# State Management Prime Prompt

Implement state management for React components.

## Usage

```bash
kfa prime use state-management "Add global authentication state"
```

## Prompt Template

I need to implement state management for:

{CONTEXT}

Choose appropriate state management approach:

1. **Local State (useState)**
   - Use for component-specific state
   - Simple, isolated data
   - No sharing across components

2. **Context API**
   - Use for app-wide state (auth, theme, language)
   - Moderate complexity
   - Few updates

3. **Custom Hooks**
   - Reusable stateful logic
   - Shared across multiple components

Implementation steps:

1. **Create State Structure**
   - Define TypeScript interfaces
   - Initial state values
   - State update functions

2. **Context Provider** (if using Context)
   - Create context in src/contexts/
   - Create provider component
   - Wrap app/routes with provider
   - Export useContext hook

3. **State Management**
   - Implement state update logic
   - Add loading/error states
   - Handle async operations
   - Add optimistic updates if needed

4. **Custom Hooks** (if applicable)
   - Create in src/hooks/
   - Export state and actions
   - Add TypeScript types
   - Include error handling

5. **Integration**
   - Connect components to state
   - Use state in components
   - Handle subscriptions
   - Clean up on unmount

6. **Testing**
   - Test state updates
   - Test context provider
   - Test custom hooks
   - Test integration

File structure:

- src/contexts/{Name}Context.tsx (for Context API)
- src/hooks/use{Name}.ts (for custom hooks)
- src/types/{name}State.types.ts
- src/tests/{name}State.test.tsx

## Context Files

- src/contexts/ - Existing contexts
- src/hooks/ - Existing hooks

## Expected Output

1. Context provider or custom hook
2. TypeScript type definitions
3. Integration examples
4. Unit tests

## Success Criteria

- State updates correctly
- No unnecessary re-renders
- TypeScript types accurate
- Tests pass
- Well documented
