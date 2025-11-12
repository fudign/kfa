# Supabase Agent Tools

Tools for interacting with Supabase for the KFA project.

## Prerequisites

```bash
npm install @supabase/supabase-js dotenv
```

## Environment Variables

Required in `.env`:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Optional, for admin operations
```

## Tools

### test-connection.js

Tests connection to Supabase and returns project info.

```bash
node agent-tools/supabase/test-connection.js

# Output to file
node agent-tools/supabase/test-connection.js > supabase-status.json
```

**Output:**

```json
{
  "success": true,
  "timestamp": "2025-11-11T...",
  "supabaseUrl": "https://...",
  "responseTime": "150ms",
  "connected": true,
  "projectRef": "abc123",
  "authStatus": "ok"
}
```

### check-buckets.js

Lists all storage buckets and verifies expected KFA buckets exist.

```bash
node agent-tools/supabase/check-buckets.js

# Output to file
node agent-tools/supabase/check-buckets.js > buckets-status.json
```

**Output:**

```json
{
  "success": true,
  "timestamp": "2025-11-11T...",
  "totalBuckets": 3,
  "buckets": [
    {
      "name": "media",
      "id": "...",
      "public": true,
      "hasFiles": true,
      "createdAt": "..."
    }
  ],
  "expectedBuckets": ["media", "documents", "avatars"],
  "missingBuckets": [],
  "allExpectedBucketsPresent": true
}
```

## Usage in Workflows

### Pre-deployment Check

```bash
# Check Supabase before deploying
node agent-tools/supabase/test-connection.js || exit 1
node agent-tools/supabase/check-buckets.js || exit 1
```

### With ADW

```python
# In ADW script
import subprocess
import json

result = subprocess.run(
    ["node", "agent-tools/supabase/test-connection.js"],
    capture_output=True,
    text=True
)

status = json.loads(result.stdout)
if status['success']:
    print("Supabase is ready!")
else:
    print(f"Supabase error: {status['error']}")
```

## Error Handling

All tools:

- Exit with code 0 on success
- Exit with code 1 on failure
- Output JSON to stdout
- Include error messages in JSON output

## Examples

### Check Everything

```bash
#!/bin/bash
echo "Checking Supabase..."

# Connection
node agent-tools/supabase/test-connection.js > results/supabase-connection.json
CONN_STATUS=$?

# Buckets
node agent-tools/supabase/check-buckets.js > results/supabase-buckets.json
BUCKET_STATUS=$?

if [ $CONN_STATUS -eq 0 ] && [ $BUCKET_STATUS -eq 0 ]; then
  echo "✅ Supabase is ready!"
  exit 0
else
  echo "❌ Supabase checks failed"
  exit 1
fi
```

### Parse Results

```bash
# Get project ref
PROJECT_REF=$(node agent-tools/supabase/test-connection.js | jq -r '.projectRef')
echo "Project: $PROJECT_REF"

# Check if buckets exist
BUCKETS_OK=$(node agent-tools/supabase/check-buckets.js | jq -r '.allExpectedBucketsPresent')
if [ "$BUCKETS_OK" = "true" ]; then
  echo "All buckets present"
fi
```
