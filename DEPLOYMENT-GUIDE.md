# 🚀 КФА Deployment Guide

**Production Deployment Instructions**

---

## 📋 Prerequisites

### Required Services:
- ✅ Supabase Account (Database + Auth + Storage)
- ✅ Railway Account (Backend hosting)
- ✅ Vercel Account (Frontend hosting)
- ✅ Domain (optional, recommended)

### Local Requirements:
- PHP 8.1+
- Node.js 18+
- Composer
- Git

---

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project
```
1. Go to: https://supabase.com/dashboard
2. Click "New Project"
3. Fill in details:
   - Name: kfa-production
   - Database Password: (save this!)
   - Region: Singapore (closest to Kyrgyzstan)
4. Wait for setup (~2 minutes)
```

### 2. Execute SQL
```sql
-- Copy entire content from: EXECUTE-THIS-IN-SUPABASE.sql
-- Paste in: SQL Editor
-- Click: Run

-- This creates:
-- ✅ profiles table
-- ✅ RLS policies
-- ✅ Triggers
-- ✅ Functions
```

### 3. Get Database Credentials
```
Settings → Database → Connection String

Save these values:
- Host: db.xxx.supabase.co
- Database: postgres
- User: postgres
- Password: (your password)
- Port: 5432
```

### 4. Configure Storage Buckets
```javascript
// In Supabase Dashboard → Storage
// Create buckets:
1. media (public)
2. documents (public)
3. private (private)

// Set policies for public access on media & documents
```

---

## 🖥️ Backend Deployment (Railway)

### 1. Prepare Backend
```bash
cd kfa-backend/kfa-api

# Update .env.production
cp .env .env.production
```

**Edit .env.production:**
```env
APP_NAME=КФА
APP_ENV=production
APP_KEY=base64:... # Will generate later
APP_DEBUG=false
APP_URL=https://kfa-api.railway.app

# Database (Supabase)
DB_CONNECTION=pgsql
DB_HOST=db.xxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your_supabase_password

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=your_anon_key
SUPABASE_SECRET=your_service_role_key

# CORS
SANCTUM_STATEFUL_DOMAINS=kfa-website.vercel.app
SESSION_DOMAIN=.railway.app

# Frontend URL
FRONTEND_URL=https://kfa-website.vercel.app
```

### 2. Deploy to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link to Railway
railway link

# Set environment variables
railway variables set APP_ENV=production
railway variables set APP_DEBUG=false
# ... (copy all from .env.production)

# Generate app key
php artisan key:generate --show
# Copy the output

# Set on Railway
railway variables set APP_KEY="base64:..."

# Deploy
git add .
git commit -m "Prepare for production"
railway up
```

### 3. Run Migrations on Railway
```bash
# In Railway Dashboard → Service → Deploy
# Add build command:
php artisan migrate --force

# Or via CLI:
railway run php artisan migrate --force
```

### 4. Verify Deployment
```bash
# Test API
curl https://kfa-api.railway.app/api/news

# Should return JSON with news
```

---

## 🌐 Frontend Deployment (Vercel)

### 1. Prepare Frontend
```bash
cd kfa-website

# Update .env.production
cp .env .env.production
```

**Edit .env.production:**
```env
# API
VITE_API_URL=https://kfa-api.railway.app/api

# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# App
VITE_APP_NAME=КФА
VITE_APP_URL=https://kfa-website.vercel.app
```

### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Answer prompts:
# Project name: kfa-website
# Framework: Vite
# Build command: npm run build
# Output directory: dist

# Set environment variables in Vercel Dashboard
# Settings → Environment Variables
# Add all from .env.production
```

### 3. Configure Custom Domain (Optional)
```
Vercel Dashboard → Settings → Domains
Add domain: www.kfa.kg

DNS Records:
A Record: @ → 76.76.21.21
CNAME: www → cname.vercel-dns.com
```

### 4. Verify Deployment
```bash
# Visit your site
open https://kfa-website.vercel.app

# Test login/registration
```

---

## 🔒 Security Checklist

### Backend (Railway):
- [ ] APP_DEBUG=false
- [ ] APP_ENV=production
- [ ] Unique APP_KEY generated
- [ ] CORS properly configured
- [ ] Database credentials secure
- [ ] Rate limiting enabled
- [ ] HTTPS enforced

### Frontend (Vercel):
- [ ] Environment variables set
- [ ] API URL points to production
- [ ] HTTPS enabled
- [ ] Security headers configured

### Database (Supabase):
- [ ] RLS policies enabled
- [ ] Strong password used
- [ ] SSL enforced
- [ ] Backup enabled

---

## 📊 Post-Deployment Tasks

### 1. Create Admin User
```bash
# Via Railway CLI
railway run php artisan tinker

# In tinker:
$user = User::create([
    'name' => 'Admin',
    'email' => 'admin@kfa.kg',
    'password' => bcrypt('secure_password_here')
]);

$user->assignRole('admin');
```

### 2. Seed Initial Data
```bash
# Run seeders
railway run php artisan db:seed --class=CertificationProgramSeeder
railway run php artisan db:seed --class=NewsSeeder
```

### 3. Configure Monitoring
```
- Railway: Check Logs tab
- Vercel: Check Analytics
- Supabase: Check Logs & Reports
```

### 4. Setup Backups
```
Supabase Dashboard → Database → Backups
- Enable automatic backups
- Set retention period: 7 days
```

---

## 🔄 CI/CD Setup

### GitHub Actions (Recommended)

**Create `.github/workflows/deploy.yml`:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway link ${{ secrets.RAILWAY_PROJECT_ID }}
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 🐛 Troubleshooting

### Issue: 500 Error on Backend
**Solution:**
```bash
# Check logs
railway logs

# Common fixes:
- Verify APP_KEY is set
- Check database connection
- Run migrations
```

### Issue: CORS Error
**Solution:**
```env
# In .env
SANCTUM_STATEFUL_DOMAINS=your-frontend-domain.com
SESSION_DOMAIN=.railway.app

# Update config/cors.php:
'allowed_origins' => [
    'https://your-frontend.vercel.app'
]
```

### Issue: Database Connection Failed
**Solution:**
```bash
# Verify Supabase credentials
# Check if IP is whitelisted (if needed)
# Test connection:
railway run php artisan migrate:status
```

### Issue: Frontend Not Loading
**Solution:**
```bash
# Check environment variables
vercel env ls

# Redeploy
vercel --prod
```

---

## 📈 Performance Optimization

### Backend:
```bash
# Cache config
railway run php artisan config:cache
railway run php artisan route:cache
railway run php artisan view:cache

# Enable OPcache in php.ini
opcache.enable=1
opcache.memory_consumption=128
```

### Frontend:
```bash
# Optimize build
npm run build

# Verify bundle size
npx vite-bundle-visualizer
```

### Database:
```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_applications_status ON membership_applications(status);
CREATE INDEX idx_payments_user ON payments(user_id);
```

---

## 🔐 Environment Variables Summary

### Backend (.env.production):
```
APP_NAME=КФА
APP_ENV=production
APP_KEY=base64:...
APP_DEBUG=false
APP_URL=https://kfa-api.railway.app

DB_CONNECTION=pgsql
DB_HOST=db.xxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=...

SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=...
SUPABASE_SECRET=...

FRONTEND_URL=https://kfa-website.vercel.app
SANCTUM_STATEFUL_DOMAINS=kfa-website.vercel.app
```

### Frontend (.env.production):
```
VITE_API_URL=https://kfa-api.railway.app/api
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=...
VITE_APP_NAME=КФА
VITE_APP_URL=https://kfa-website.vercel.app
```

---

## ✅ Deployment Checklist

### Pre-Deployment:
- [ ] Code reviewed and tested
- [ ] Environment variables prepared
- [ ] Database SQL script ready
- [ ] Migrations tested locally
- [ ] Tests passing

### Deployment:
- [ ] Supabase project created
- [ ] SQL executed in Supabase
- [ ] Backend deployed to Railway
- [ ] Migrations run on production
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured

### Post-Deployment:
- [ ] Admin user created
- [ ] Initial data seeded
- [ ] API endpoints tested
- [ ] Frontend tested (login, registration)
- [ ] CORS working
- [ ] SSL/HTTPS enabled
- [ ] Monitoring configured
- [ ] Backups enabled

---

## 🎉 Success!

Your КФА application is now live in production!

**Next Steps:**
1. Share URL with stakeholders
2. Monitor logs for first 24 hours
3. Test all critical user flows
4. Setup analytics (Google Analytics, etc.)
5. Configure domain email (info@kfa.kg)

---

*Deployment Guide v1.0.0 - Updated: 2025-11-13*
