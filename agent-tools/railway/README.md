# Railway Agent Tools

Tools for checking Railway deployment status for KFA backend.

## Prerequisites

No additional dependencies required (uses Node.js built-in modules).

## Environment Variables

Optional in `.env`:

```bash
RAILWAY_URL=https://kfa-production.up.railway.app
KFA_BACKEND_URL=https://kfa-production.up.railway.app
```

## Tools

### check-deployment.js

Checks if Railway deployment is live and responding.

```bash
# Use default URL from env
node agent-tools/railway/check-deployment.js

# Specify URL
node agent-tools/railway/check-deployment.js --url=https://kfa-production.up.railway.app

# Output to file
node agent-tools/railway/check-deployment.js > railway-status.json
```

**Output:**

```json
{
  "success": true,
  "timestamp": "2025-11-11T...",
  "project": "kfa-backend",
  "url": "https://kfa-production.up.railway.app",
  "statusCode": 200,
  "statusMessage": "OK",
  "responseTime": "250ms",
  "contentType": "text/html",
  "serverHeader": "nginx",
  "deployed": true
}
```

## Usage Examples

### Pre-deployment Check

```bash
# Check if Railway is accessible
node agent-tools/railway/check-deployment.js || echo "Railway is down!"
```

### Post-deployment Verification

```bash
#!/bin/bash
echo "Verifying Railway deployment..."

# Wait a bit for deployment to stabilize
sleep 5

# Check deployment
node agent-tools/railway/check-deployment.js > results/railway.json

if [ $? -eq 0 ]; then
  echo "✅ Railway deployment is live!"
else
  echo "❌ Railway deployment check failed"
  cat results/railway.json
  exit 1
fi
```

### With Health Check

```bash
# Check main domain
node agent-tools/railway/check-deployment.js --url=https://kfa-production.up.railway.app

# Check specific endpoint
node agent-tools/deploy/health-check.js --url=https://kfa-production.up.railway.app/api/health
```

### Integration with ADW

```python
import subprocess
import json

# Check Railway deployment
result = subprocess.run(
    ["node", "agent-tools/railway/check-deployment.js"],
    capture_output=True,
    text=True
)

status = json.loads(result.stdout)
if status['success'] and status['deployed']:
    print(f"Railway is live! Response: {status['responseTime']}")
else:
    print(f"Railway deployment issue: {status.get('error', 'Unknown')}")
```

## Error Handling

- Exit code 0 = deployment is live and responding
- Exit code 1 = deployment failed or not responding
- All output is JSON to stdout

## Monitoring Script

```bash
#!/bin/bash
# monitor-railway.sh

while true; do
  STATUS=$(node agent-tools/railway/check-deployment.js | jq -r '.deployed')

  if [ "$STATUS" = "true" ]; then
    echo "[$(date)] ✅ Railway is up"
  else
    echo "[$(date)] ❌ Railway is down"
    # Send alert here
  fi

  sleep 60  # Check every minute
done
```

## Workflow Integration

```bash
# Full deployment check workflow
node agent-tools/db/status.js && \
  node agent-tools/railway/check-deployment.js && \
  node agent-tools/supabase/test-connection.js && \
  echo "All systems operational!"
```
