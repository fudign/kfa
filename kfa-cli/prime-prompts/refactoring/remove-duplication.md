# Remove Code Duplication Prime Prompt

Identify and eliminate code duplication.

## Usage

```bash
kfa prime use remove-duplication "Remove duplicated validation logic"
```

## Prompt Template

Remove code duplication in:

{CONTEXT}

Apply DRY principle:

1. **Identify Duplication**
   - Find exact duplicates
   - Find similar code patterns
   - Identify duplicated logic
   - Locate repeated constants/types

2. **Extraction Strategies**
   - Extract functions
   - Create utility functions
   - Extract components (React)
   - Create traits/concerns (Laravel)
   - Use inheritance or composition
   - Create constants file

3. **React Duplication**
   - Extract custom hooks
   - Create HOCs (Higher-Order Components)
   - Extract render props
   - Share context providers
   - Create utility components

4. **Laravel Duplication**
   - Create service classes
   - Use traits
   - Create helper functions
   - Use model scopes
   - Create base controllers

5. **Validation Duplication**
   - Create reusable validators
   - Share validation rules
   - Create validation schemas
   - Use form request classes

6. **Configuration Duplication**
   - Extract to config files
   - Use environment variables
   - Create constants
   - Use enums

7. **Refactoring Steps**
   - Create shared module/file
   - Move duplicated code
   - Update all references
   - Test each change
   - Remove old duplicates

8. **Testing**
   - Ensure behavior unchanged
   - Test all use cases
   - Verify edge cases

## Anti-Patterns to Avoid

- Over-abstraction
- Premature generalization
- Creating unclear dependencies
- Making code less readable

## File Organization

- src/utils/ - Utility functions
- src/hooks/ - Custom hooks
- src/services/ - Service classes
- src/constants/ - Constants
- app/Services/ - Laravel services
- app/Traits/ - Laravel traits

## Expected Output

1. Extracted shared code
2. Updated all references
3. Removed duplicates
4. Tests updated
5. Documentation

## Success Criteria

- No code duplication
- Code more maintainable
- Same functionality
- Tests pass
- Easier to modify
