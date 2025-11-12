# Fix Production Issue Prime Prompt

Handle production issues quickly and safely.

## Usage

```bash
kfa prime use fix-production-issue "API returning 500 errors"
```

## Prompt Template

Production issue: {CONTEXT}

## Emergency Response

1. **Assess Impact**
   - How many users affected?
   - Critical functionality down?
   - Data integrity risk?

2. **Quick Mitigation**
   - Rollback if possible
   - Temporary workaround
   - Feature flag disable
   - Traffic diversion

3. **Investigate**
   - Check logs
   - Check metrics
   - Recent deployments
   - Recent changes

4. **Fix**
   - Hotfix branch
   - Minimal changes
   - Test thoroughly
   - Fast deployment

5. **Verify**
   - Monitor metrics
   - Test in production
   - User feedback
   - No new issues

6. **Post-Mortem**
   - What happened?
   - Why did it happen?
   - How to prevent?
   - Action items

## Safety First

- Test fix thoroughly
- Have rollback plan
- Monitor deployment
- Communicate with team

## Expected Output

1. Issue resolved
2. Root cause identified
3. Post-mortem document
4. Prevention measures

## Success Criteria

- Production stable
- Users can work
- Issue won't recur
- Team learned
