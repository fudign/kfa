#!/bin/bash
echo "Testing FormRequests validation..."
TOKEN=$(curl -s -X POST http://localhost/api/login -H "Content-Type: application/json" -H "Accept: application/json" -d '{"email":"admin@kfa.kg","password":"password"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "[1/4] Testing News creation..."
curl -s -X POST http://localhost/api/news \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"title\":\"FormRequest Test\",\"slug\":\"formrequest-test-$(date +%s)\",\"content\":\"Testing validation\"}" | head -n 5

echo ""
echo "[2/4] Testing validation error (missing title)..."
curl -s -X POST http://localhost/api/news \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"slug":"test","content":"Testing"}' | head -n 5

echo ""
echo "[3/4] Testing Member creation..."
curl -s -X POST http://localhost/api/members \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"name\":\"Test Member\",\"email\":\"test-$(date +%s)@example.com\"}" | head -n 5

echo ""
echo "[4/4] Testing validation error (invalid email)..."
curl -s -X POST http://localhost/api/members \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Test","email":"invalid-email"}' | head -n 5
