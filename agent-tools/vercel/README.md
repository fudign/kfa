# Vercel Agent Tools

Tools for checking Vercel frontend deployment status for KFA website.

## Prerequisites

No additional dependencies required (uses Node.js built-in modules).

## Environment Variables

Optional in `.env`:

```bash
VERCEL_URL=https://kfa-website.vercel.app
KFA_FRONTEND_URL=https://kfa-website.vercel.app
```

## Tools

### check-frontend.js

Checks if Vercel frontend is live and responding.

```bash
# Use default URL from env
node agent-tools/vercel/check-frontend.js

# Specify URL
node agent-tools/vercel/check-frontend.js --url=https://kfa-website.vercel.app

# Output to file
node agent-tools/vercel/check-frontend.js > vercel-status.json
```

**Output:**

```json
{
  "success": true,
  "timestamp": "2025-11-11T...",
  "project": "kfa-website",
  "url": "https://kfa-website.vercel.app",
  "statusCode": 200,
  "statusMessage": "OK",
  "responseTime": "120ms",
  "contentType": "text/html",
  "serverHeader": "Vercel",
  "vercelCache": "HIT",
  "vercelId": "...",
  "deployed": true,
  "isHtml": true
}
```

## Usage Examples

### Quick Check

```bash
# Check if frontend is up
node agent-tools/vercel/check-frontend.js
```

### Full Stack Check

```bash
#!/bin/bash
echo "Checking full KFA stack..."

# Frontend
node agent-tools/vercel/check-frontend.js > results/frontend.json
FRONTEND=$?

# Backend
node agent-tools/railway/check-deployment.js > results/backend.json
BACKEND=$?

# Supabase
node agent-tools/supabase/test-connection.js > results/supabase.json
SUPABASE=$?

if [ $FRONTEND -eq 0 ] && [ $BACKEND -eq 0 ] && [ $SUPABASE -eq 0 ]; then
  echo "✅ Full stack is operational!"
  exit 0
else
  echo "❌ Some services are down"
  [ $FRONTEND -ne 0 ] && echo "  - Frontend (Vercel) is down"
  [ $BACKEND -ne 0 ] && echo "  - Backend (Railway) is down"
  [ $SUPABASE -ne 0 ] && echo "  - Supabase is down"
  exit 1
fi
```

### Parse Results

```bash
# Get response time
RESPONSE_TIME=$(node agent-tools/vercel/check-frontend.js | jq -r '.responseTime')
echo "Frontend response: $RESPONSE_TIME"

# Check cache status
CACHE_STATUS=$(node agent-tools/vercel/check-frontend.js | jq -r '.vercelCache')
echo "Vercel cache: $CACHE_STATUS"
```

### With ADW

```python
import subprocess
import json

# Check frontend
result = subprocess.run(
    ["node", "agent-tools/vercel/check-frontend.js"],
    capture_output=True,
    text=True
)

status = json.loads(result.stdout)
if status['success']:
    print(f"Frontend is live! Cache: {status.get('vercelCache', 'N/A')}")
    print(f"Response time: {status['responseTime']}")
else:
    print(f"Frontend issue: {status.get('error', 'Unknown')}")
```

## Error Handling

- Exit code 0 = frontend is live and responding
- Exit code 1 = frontend failed or not responding
- All output is JSON to stdout

## Integration Examples

### Pre-deployment Test

```bash
# Test before deploying new version
node agent-tools/vercel/check-frontend.js || \
  echo "Warning: Frontend is currently down"
```

### Post-deployment Verification

```bash
#!/bin/bash
echo "Deploying to Vercel..."

# Deploy (example)
# vercel --prod

echo "Waiting for deployment..."
sleep 10

# Verify
for i in {1..5}; do
  if node agent-tools/vercel/check-frontend.js; then
    echo "✅ Deployment verified!"
    exit 0
  fi
  echo "Attempt $i failed, retrying..."
  sleep 5
done

echo "❌ Deployment verification failed"
exit 1
```

### Monitoring

```bash
#!/bin/bash
# monitor-frontend.sh

while true; do
  RESULT=$(node agent-tools/vercel/check-frontend.js)
  STATUS=$(echo "$RESULT" | jq -r '.success')
  RESPONSE_TIME=$(echo "$RESULT" | jq -r '.responseTime')

  if [ "$STATUS" = "true" ]; then
    echo "[$(date)] ✅ Frontend up ($RESPONSE_TIME)"
  else
    echo "[$(date)] ❌ Frontend down"
    # Send alert
  fi

  sleep 60
done
```

## Complete Deployment Workflow

```bash
#!/bin/bash
# deploy-and-verify.sh

set -e

echo "=== KFA Deployment Workflow ==="

# 1. Pre-deployment checks
echo "1. Running pre-deployment checks..."
node agent-tools/db/status.js
node agent-tools/test/run-e2e.js

# 2. Build frontend
echo "2. Building frontend..."
cd kfa-website && npm run build && cd ..

# 3. Deploy to Vercel
echo "3. Deploying to Vercel..."
# vercel --prod

# 4. Wait for deployment
echo "4. Waiting for deployment..."
sleep 15

# 5. Verify deployment
echo "5. Verifying deployment..."
node agent-tools/vercel/check-frontend.js
node agent-tools/railway/check-deployment.js
node agent-tools/supabase/test-connection.js

echo "=== Deployment Complete ==="
```
