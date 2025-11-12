# Prime Prompt: Race Condition Debugging

Find and fix race conditions in asynchronous code.

## Usage

```bash
kfa prime use debugging/race-condition-debugging "Fix race condition in data fetching"
```

## Prompt Template

I need to fix race conditions:

**Context:** {CONTEXT}

### Identification
- Intermittent bugs
- Depends on timing
- Different results with same input
- Errors under load/concurrency

### Common Patterns
- Multiple async operations on same data
- State updates in wrong order
- Concurrent API requests
- Missing request cancellation
- Promises resolving out of order

### Solutions
- Use AbortController for requests
- Add request cancellation
- Use request deduplication
- Implement proper locking
- Use race condition safe patterns
- Add request IDs/timestamps
- Use React useEffect cleanup
- Implement optimistic UI properly

## Success Criteria
- ✅ Consistent results
- ✅ No timing-dependent bugs
- ✅ Tests with concurrency pass
