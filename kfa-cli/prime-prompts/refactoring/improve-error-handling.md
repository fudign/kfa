# Prime Prompt: Improve Error Handling

Add comprehensive error handling with proper error types and recovery strategies.

## Usage

```bash
kfa prime use refactoring/improve-error-handling "Add error handling to API calls"
```

## Prompt Template

I need you to improve error handling:

**Context:** {CONTEXT}

Please implement:

### 1. Error Types
- Create custom error classes
- Define error codes/types
- Add error context/metadata
- Use error hierarchies

### 2. Try-Catch Blocks
- Wrap risky operations
- Catch specific error types
- Avoid silent failures
- Log errors with context

### 3. Error Recovery
- Implement retry logic
- Fallback values
- Graceful degradation
- User-friendly error messages

### 4. Validation
- Input validation
- Type checking
- Boundary checks
- Sanitize user input

### 5. Error Propagation
- Throw meaningful errors
- Add error context
- Preserve stack traces
- Document thrown errors

### 6. User Experience
- Show clear error messages
- Provide actionable feedback
- Avoid technical jargon
- Offer retry options

### 7. Logging
- Log errors with context
- Include request IDs
- Add timestamps
- Track error frequency

### 8. Testing
- Test error scenarios
- Test recovery logic
- Test error messages
- Test edge cases

## Success Criteria

- ✅ All errors caught and handled
- ✅ Clear error messages
- ✅ Recovery strategies implemented
- ✅ Errors logged properly
- ✅ Tests cover error cases
