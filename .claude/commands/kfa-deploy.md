# Deploy KFA Application

You are helping deploy the KFA project.

## Context

KFA deployment stack:

- **Frontend:** Vercel (kfa-website)
- **Backend:** Railway (kfa-backend - currently paused)
- **Database:** Supabase (hosted)
- **Domain:** kfa-website.vercel.app

## Deployment Checklist

### Pre-Deployment

1. **Check Environment Variables:**

```bash
node agent-tools/deploy/verify-env.js
```

2. **Run Tests:**

```bash
node agent-tools/test/run-e2e.js
node agent-tools/test/run-unit.js
```

3. **Build Frontend:**

```bash
node agent-tools/deploy/build-frontend.js
```

4. **Verify Database:**

```bash
node agent-tools/supabase/test-connection.js
```

### Frontend Deployment (Vercel)

The frontend auto-deploys on git push to main branch:

```bash
# Check Vercel status
node agent-tools/vercel/check-frontend.js

# Trigger manual deploy (if needed)
vercel --prod
```

### Backend Deployment (Railway)

Note: Backend is currently paused. To deploy:

```bash
# Check Railway status
node agent-tools/railway/check-deployment.js

# Build backend
node agent-tools/deploy/build-backend.js
```

### Database Migrations

Run migrations on Supabase:

```bash
# Run via Supabase dashboard
# Or use setup script
node agent-tools/supabase/setup-database.js
```

### Post-Deployment

1. **Health Check:**

```bash
node agent-tools/deploy/health-check.js --url=https://kfa-website.vercel.app
```

2. **Verify Features:**

- Test news section loads
- Test partners section loads
- Test dashboard access (admin)
- Test image upload

3. **Monitor Logs:**

- Check Vercel deployment logs
- Check Supabase logs
- Check browser console for errors

## Common Issues

### Frontend Not Updating

```bash
# Clear Vercel cache and redeploy
vercel --prod --force
```

### Environment Variables Missing

```bash
# Check and update in Vercel dashboard
# Or use CLI:
vercel env pull
```

### Database Connection Issues

```bash
# Verify Supabase credentials
node agent-tools/supabase/test-connection.js

# Check RLS policies aren't blocking
# Review FIX-*.sql files for solutions
```

### Build Failures

```bash
# Check TypeScript errors
npx tsc --noEmit

# Check for missing dependencies
npm install
```

## Rollback Plan

If deployment fails:

1. Revert to previous Vercel deployment via dashboard
2. Check error logs: `vercel logs`
3. Fix issues locally and redeploy

## Output

After deployment, provide:

1. Deployment status (success/failure)
2. URLs to check
3. Any warnings or issues found
4. Next steps or monitoring recommendations
