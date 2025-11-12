# Find Bug Root Cause Prime Prompt

Systematically diagnose bug root cause.

## Usage

```bash
kfa prime use find-bug-root-cause "Users cannot submit forms"
```

## Prompt Template

Diagnose bug: {CONTEXT}

## Systematic Debugging

1. **Reproduce Bug**
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Error messages/logs

2. **Gather Information**
   - Browser console errors
   - Network requests
   - Server logs
   - Database queries

3. **Form Hypothesis**
   - What could cause this?
   - Recent changes?
   - Similar bugs?

4. **Test Hypothesis**
   - Add console.logs
   - Use debugger
   - Check network tab
   - Verify assumptions

5. **Isolate Issue**
   - Minimal reproduction
   - Remove complexity
   - Test components individually

6. **Identify Root Cause**
   - Not symptoms
   - Actual source
   - Why did it happen?

7. **Document Findings**
   - Root cause
   - Steps to fix
   - Prevention strategy

## Tools

- Browser DevTools
- React DevTools
- Laravel Telescope
- Database query log
- Error tracking (Sentry)

## Expected Output

1. Bug description
2. Root cause analysis
3. Fix plan
4. Prevention measures

## Success Criteria

- Root cause identified
- Reproducible
- Fix planned
- Documented
