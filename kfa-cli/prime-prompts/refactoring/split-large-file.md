# Prime Prompt: Split Large File

Break down a large file into smaller, maintainable modules with clear responsibilities.

## Usage

```bash
kfa prime use refactoring/split-large-file "Split UserManagement.tsx into smaller files"
```

## Prompt Template

I need you to refactor a large file by splitting it into smaller modules:

**Context:** {CONTEXT}

Please follow these steps:

### 1. Analysis

- Identify distinct responsibilities in the current file
- Group related functions/components
- Identify shared utilities
- Find circular dependency risks

### 2. File Structure

Create new file structure:

- Separate components into individual files
- Extract hooks to separate files
- Move utilities to utils/helpers
- Create types/interfaces file
- Keep related code together

### 3. Naming Convention

- Use descriptive file names
- Follow project naming patterns
- Group by feature or responsibility
- Use index files for clean imports

### 4. Dependencies

- Minimize inter-file dependencies
- Avoid circular dependencies
- Use barrel exports (index.ts)
- Update import paths

### 5. Testing

- Update test imports
- Ensure all tests still pass
- Add new tests if needed

## Success Criteria

- ✅ No file >300 lines
- ✅ Clear single responsibility
- ✅ No circular dependencies
- ✅ All tests pass
- ✅ Imports are clean
