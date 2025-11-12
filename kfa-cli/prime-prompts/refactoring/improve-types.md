# Improve Types Prime Prompt

Improve TypeScript type safety and definitions.

## Usage

```bash
kfa prime use improve-types "Add strict types to user management module"
```

## Prompt Template

Improve TypeScript types for:

{CONTEXT}

Follow TypeScript best practices:

1. **Type Definitions**
   - Replace 'any' with specific types
   - Use interfaces for object shapes
   - Use type aliases for unions/intersections
   - Define generic types where applicable

2. **Strict Typing**
   - Enable strict mode in tsconfig
   - Use strictNullChecks
   - Use noImplicitAny
   - Use noImplicitReturns

3. **Type Guards**
   - Create type guard functions
   - Use 'is' type predicate
   - Handle union types properly
   - Narrow types effectively

4. **Utility Types**
   - Use Partial, Required, Pick, Omit
   - Create custom utility types
   - Use ReturnType, Parameters
   - Use Awaited for promises

5. **API Types**
   - Define request/response types
   - Create DTOs (Data Transfer Objects)
   - Type API endpoints
   - Handle error types

6. **Component Props**
   - Define prop interfaces
   - Use extends for composition
   - Add JSDoc comments
   - Mark required/optional correctly

7. **Type Organization**
   - Create .types.ts files
   - Group related types
   - Export reusable types
   - Use barrel exports

8. **Generic Functions**
   - Add type parameters
   - Constrain generic types
   - Use default type parameters
   - Infer types when possible

## Common Patterns

```typescript
// Before
function getData(id: any): any {
  // ...
}

// After
function getData<T extends BaseEntity>(id: string): Promise<T> {
  // ...
}
```

## Files to Update

- src/types/{module}.types.ts
- Component files
- Service files
- API files

## Expected Output

1. Comprehensive type definitions
2. No 'any' types (or minimal, justified)
3. Type guard functions
4. Updated components/services
5. Type documentation

## Success Criteria

- TypeScript compiles with strict mode
- No ts-ignore comments
- Full IDE autocomplete
- Type errors caught at compile time
- Code more maintainable
