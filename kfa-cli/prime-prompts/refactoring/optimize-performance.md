# Optimize Performance Prime Prompt

Optimize React component or Laravel code performance.

## Usage

```bash
kfa prime use optimize-performance "Optimize news list rendering performance"
```

## Prompt Template

Optimize performance of:

{CONTEXT}

## React Optimization

1. **Identify Performance Issues**
   - Use React DevTools Profiler
   - Identify unnecessary re-renders
   - Find expensive computations
   - Check bundle size

2. **Optimization Techniques**
   - Use React.memo for expensive components
   - Use useMemo for expensive calculations
   - Use useCallback for event handlers
   - Implement virtualization for long lists
   - Code splitting with React.lazy
   - Debounce/throttle frequent updates

3. **Rendering Optimization**
   - Move state down (co-location)
   - Avoid inline object/array creation
   - Use key prop correctly
   - Implement shouldComponentUpdate logic
   - Split large components

4. **Data Fetching**
   - Implement pagination
   - Use SWR or React Query
   - Cache API responses
   - Prefetch data
   - Lazy load images

## Laravel Optimization

1. **Database Queries**
   - Use eager loading (with())
   - Eliminate N+1 queries
   - Add database indexes
   - Use select() to limit columns
   - Implement pagination

2. **Caching**
   - Cache database queries
   - Cache API responses
   - Use Redis for session
   - Implement cache tags

3. **Code Optimization**
   - Use queue for heavy tasks
   - Optimize loops
   - Reduce memory usage
   - Use generators for large datasets

## Measurement

1. **Before Optimization**
   - Measure current performance
   - Document metrics
   - Identify bottlenecks

2. **After Optimization**
   - Re-measure performance
   - Compare metrics
   - Verify improvements
   - Ensure no regression

## Testing

- Verify functionality unchanged
- Test edge cases
- Load testing if applicable
- Profile again

## Expected Output

1. Optimized code
2. Performance metrics (before/after)
3. Documentation of changes
4. Tests updated

## Success Criteria

- Measurable performance improvement
- No functionality regression
- Tests pass
- Code maintainability preserved
