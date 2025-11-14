# Debug KFA Issue

You are helping debug an issue in the KFA project.

## Context

KFA stack:

- **Frontend:** React + TypeScript + Vite
- **Backend:** PHP/Laravel (currently paused)
- **Database:** Supabase PostgreSQL
- **Hosting:** Vercel (frontend)

## Debugging Process

### 1. Gather Information

Ask the user:

- What is the expected behavior?
- What is the actual behavior?
- Where does the issue occur? (frontend, backend, database)
- Are there any error messages?
- When did this start happening?

### 2. Check Common Issues

#### Frontend Issues

```bash
# Check TypeScript errors
npx tsc --noEmit

# Check build
node agent-tools/deploy/build-frontend.js

# Review browser console errors
# Check Network tab for failed API calls
```

#### Database Issues

```bash
# Test connection
node agent-tools/supabase/test-connection.js

# Check RLS policies
# Review supabase-cms-tables.sql
```

#### API Issues

```bash
# Check Supabase logs in dashboard
# Verify API keys are correct
# Test endpoints manually
```

### 3. Investigate Files

Based on the issue type, check:

**News Issues:**

- `kfa-website/src/components/sections/NewsSection.tsx`
- `kfa-website/src/lib/supabase-news.ts`
- `kfa-website/src/pages/dashboard/NewsManager.tsx`

**Partners Issues:**

- `kfa-website/src/components/sections/PartnersSection.tsx`
- `kfa-website/src/lib/supabase-partners.ts`
- `kfa-website/src/pages/dashboard/PartnersManager.tsx`

**Settings Issues:**

- `kfa-website/src/lib/supabase-settings.ts`
- `kfa-website/src/pages/dashboard/SettingsManager.tsx`

**Auth Issues:**

- `kfa-website/src/components/layout/AuthButton.tsx`
- Check Supabase Auth settings
- Review RLS policies

**Media Upload Issues:**

- `kfa-website/src/components/dashboard/MediaUpload.tsx`
- Check Supabase Storage buckets
- Review storage policies

### 4. Common Patterns

#### Type Errors

- Check `kfa-website/src/types/index.ts` matches database
- Ensure proper TypeScript strict mode compliance

#### RLS Policy Errors

- "new row violates row-level security policy"
  → Check RLS policies in `supabase-cms-tables.sql`
- Add user to correct role in profiles table

#### CORS Errors

- Already fixed, but check `vercel.json` if it reoccurs
- Verify Supabase URL is whitelisted

#### 404 Errors

- Check routing in `kfa-website/src/App.tsx`
- Verify Vercel deployment completed

### 5. Testing Fix

After identifying and fixing:

```bash
# Test locally
npm run dev

# Test build
node agent-tools/deploy/build-frontend.js

# Test production
node agent-tools/deploy/health-check.js --url=https://kfa-website.vercel.app
```

## Debugging Tools

### Check Database Status

```bash
node agent-tools/db/status.js
node agent-tools/supabase/test-connection.js
```

### Check Environment

```bash
node agent-tools/deploy/verify-env.js
```

### Check Deployment

```bash
node agent-tools/vercel/check-frontend.js
node agent-tools/railway/check-deployment.js
```

### Browser DevTools

- Console: JavaScript errors
- Network: API call failures
- Application: LocalStorage, Cookies, Cache
- Sources: Debugging with breakpoints

## Output

Provide:

1. Root cause analysis
2. Step-by-step fix
3. Files modified
4. Testing verification
5. Prevention recommendations
