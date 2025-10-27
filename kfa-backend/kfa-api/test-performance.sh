#!/bin/bash
echo "=== PERFORMANCE TEST ==="
echo ""

# Test 1: Login (first)
echo "[1/6] Login (first request)..."
time1=$(curl -w "%{time_total}" -o /dev/null -s -X POST http://localhost/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"admin@kfa.kg","password":"password"}')
echo "Time: ${time1}s"
echo ""

# Get token for authenticated requests
token=$(curl -s -X POST http://localhost/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"admin@kfa.kg","password":"password"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Test 2: Login (repeat)
echo "[2/6] Login (repeat request)..."
time2=$(curl -w "%{time_total}" -o /dev/null -s -X POST http://localhost/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"admin@kfa.kg","password":"password"}')
echo "Time: ${time2}s"
echo ""

# Test 3: GET /api/user
echo "[3/6] GET /api/user (authenticated)..."
time3=$(curl -w "%{time_total}" -o /dev/null -s http://localhost/api/user \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $token")
echo "Time: ${time3}s"
echo ""

# Test 4: GET /api/news
echo "[4/6] GET /api/news..."
time4=$(curl -w "%{time_total}" -o /dev/null -s http://localhost/api/news \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $token")
echo "Time: ${time4}s"
echo ""

# Test 5: GET /api/programs
echo "[5/6] GET /api/programs..."
time5=$(curl -w "%{time_total}" -o /dev/null -s http://localhost/api/programs \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $token")
echo "Time: ${time5}s"
echo ""

# Test 6: GET /api/events
echo "[6/6] GET /api/events..."
time6=$(curl -w "%{time_total}" -o /dev/null -s http://localhost/api/events \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $token")
echo "Time: ${time6}s"
echo ""

echo "=== SUMMARY ==="
echo "Login (first):    ${time1}s"
echo "Login (repeat):   ${time2}s"
echo "GET /api/user:    ${time3}s"
echo "GET /api/news:    ${time4}s"
echo "GET /api/programs: ${time5}s"
echo "GET /api/events:  ${time6}s"
