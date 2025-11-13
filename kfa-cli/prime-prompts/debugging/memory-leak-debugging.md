# Prime Prompt: Memory Leak Debugging

Identify and fix memory leaks in application.

## Usage

```bash
kfa prime use debugging/memory-leak-debugging "Fix memory leak in React app"
```

## Prompt Template

I need to debug memory leaks:

**Context:** {CONTEXT}

### Investigation Steps

1. Reproduce the leak consistently
2. Take heap snapshots (Chrome DevTools)
3. Compare snapshots over time
4. Identify retained objects
5. Trace back to leak source

### Common Causes

- Event listeners not removed
- Closures holding references
- Timers/intervals not cleared
- DOM elements not released
- Cache growing indefinitely
- React: useEffect cleanup missing

### Fixes

- Remove event listeners in cleanup
- Clear intervals/timeouts
- Implement WeakMap/WeakSet
- Limit cache size
- Add React useEffect cleanup
- Use AbortController for requests

## Success Criteria

- ✅ Memory usage stable over time
- ✅ Heap size doesn't grow
- ✅ No retaining references
