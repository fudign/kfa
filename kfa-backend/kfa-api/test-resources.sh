#!/bin/bash
echo "Testing API Resources..."
TOKEN=$(curl -s -X POST http://localhost/api/login -H "Content-Type: application/json" -H "Accept: application/json" -d '{"email":"admin@kfa.kg","password":"password"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "[1/2] Testing News Resource (GET /api/news)..."
curl -s http://localhost/api/news \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN" | head -n 20

echo ""
echo "[2/2] Testing Member Resource (GET /api/members)..."
curl -s http://localhost/api/members \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN" | head -n 20
