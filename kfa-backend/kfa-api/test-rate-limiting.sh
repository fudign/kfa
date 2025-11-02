#!/bin/bash
echo "Testing Rate Limiting (5 attempts per minute for auth)..."
echo ""

for i in {1..6}; do
  echo "[$i/6] Attempt $i..."
  response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST http://localhost/api/login \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d '{"email":"wrong@test.com","password":"wrong"}')
  
  http_code=$(echo "$response" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
  body=$(echo "$response" | sed '/^HTTP_CODE:/d')
  
  echo "HTTP Code: $http_code"
  echo "Response: $body" | head -n 3
  echo ""
  
  sleep 0.5
done

echo "✅ Expected: First 5 attempts should work (401 or 422), 6th should be blocked (429)"
