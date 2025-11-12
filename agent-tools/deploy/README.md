# Deployment Tools

Lightweight deployment helpers. Each tool is independent and composable.

## Tools

### build-frontend.js

Build React frontend for production.

```bash
node deploy/build-frontend.js
```

Output: Build status + artifact info JSON

### build-backend.js

Prepare Laravel backend for deployment.

```bash
node deploy/build-backend.js
```

Output: Build status + optimization info JSON

### verify-env.js

Verify environment variables are set.

```bash
node deploy/verify-env.js [--env=path]
```

Output: Missing/invalid env vars JSON

### health-check.js

Check if deployed app is healthy.

```bash
node deploy/health-check.js --url=https://api.example.com
```

Output: Health status + response times JSON

## Examples

```bash
# Pre-deploy checks
node deploy/verify-env.js > env-check.json

# Build frontend
node deploy/build-frontend.js > build-frontend.json

# Build backend
node deploy/build-backend.js > build-backend.json

# Post-deploy health check
node deploy/health-check.js --url=https://kfa-production.up.railway.app > health.json
```
