# Prime Prompt: Performance Testing

Add performance tests to ensure code meets performance requirements.

## Usage

```bash
kfa prime use testing/performance-testing "Test API endpoint performance"
```

## Prompt Template

I need performance tests for:

**Context:** {CONTEXT}

### Performance Metrics
- Response time (<200ms for fast, <1s for slow)
- Throughput (requests per second)
- Memory usage
- CPU usage
- Database query time

### Test Scenarios
- Single request performance
- Concurrent requests (load testing)
- Large data sets
- Edge cases (max payload, long queries)

### Tools
- Jest performance testing
- Lighthouse for frontend
- Artillery or k6 for load testing
- Chrome DevTools for profiling

## Success Criteria
- ✅ Performance baselines set
- ✅ Tests fail if too slow
- ✅ Regressions detected
