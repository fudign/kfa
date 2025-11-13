# Extract Component Prime Prompt

Extract reusable component from existing code.

## Usage

```bash
kfa prime use extract-component "Extract user avatar display into reusable component"
```

## Prompt Template

Extract reusable component from:

{CONTEXT}

Follow component extraction best practices:

1. **Identify Reusable Logic**
   - Find duplicated UI patterns
   - Identify common functionality
   - Determine component boundaries

2. **Component Design**
   - Single responsibility
   - Clear props interface
   - Minimal dependencies
   - Composable and flexible

3. **Extract Component**
   - Create new file in src/components/
   - Define TypeScript interface for props
   - Move JSX markup
   - Move related styling
   - Add prop validation

4. **Props Design**
   - Required vs optional props
   - Default values
   - Event handlers
   - Children prop if needed
   - Render props pattern if applicable

5. **Update Original Files**
   - Replace duplicated code with component
   - Pass appropriate props
   - Test integration

6. **Documentation**
   - Add JSDoc comments
   - Document props
   - Add usage examples
   - Create Storybook story (if applicable)

7. **Testing**
   - Add unit tests
   - Test all prop combinations
   - Test edge cases

File structure:

- src/components/{ComponentName}.tsx
- src/components/{ComponentName}.test.tsx
- src/types/{componentName}.types.ts

## Expected Output

1. New reusable component
2. Updated original files
3. Type definitions
4. Unit tests
5. Documentation

## Success Criteria

- Component is reusable
- All props documented
- Tests pass
- No duplication
- Original functionality preserved
