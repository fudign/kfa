#!/bin/bash

# Test media upload after fixing endpoint

# Get auth token
echo "=== Getting Auth Token ==="
TOKEN=$(curl -s -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-admin@kfa.kg",
    "password": "TestAdmin123!"
  }' | jq -r '.token')

echo "Token: ${TOKEN:0:20}..."

# Create a small test PNG image (1x1 red pixel)
echo "=== Creating Test Image ==="
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==" | base64 -d > test-upload.png
echo "✓ Created test-upload.png"

# Upload the image
echo ""
echo "=== Uploading Image ==="
RESPONSE=$(curl -s -X POST http://127.0.0.1:8000/api/media \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test-upload.png" \
  -F "collection=test")

echo "$RESPONSE" | jq '.'

# Extract media ID and URL
MEDIA_ID=$(echo "$RESPONSE" | jq -r '.data.id')
MEDIA_URL=$(echo "$RESPONSE" | jq -r '.data.url')
MEDIA_PATH=$(echo "$RESPONSE" | jq -r '.data.path')

echo ""
echo "=== Upload Results ==="
echo "Media ID: $MEDIA_ID"
echo "Path: $MEDIA_PATH"
echo "URL: $MEDIA_URL"

# Check if path is valid (not "0")
if [ "$MEDIA_PATH" != "0" ] && [ ! -z "$MEDIA_PATH" ]; then
    echo "✅ SUCCESS: Path is valid!"
else
    echo "❌ FAILED: Path is still invalid!"
fi

# Cleanup
rm -f test-upload.png

echo ""
echo "=== Done ==="
