#!/bin/bash
echo "=== COMPREHENSIVE API TEST ==="
echo ""

# Test 1: Register new user
echo "[1/10] Testing user registration..."
REG_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST http://localhost/api/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test-$(date +%s)@example.com\",\"password\":\"password\",\"password_confirmation\":\"password\"}")

REG_CODE=$(echo "$REG_RESPONSE" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
echo "HTTP Code: $REG_CODE"
if [ "$REG_CODE" = "201" ]; then
  echo "✅ Registration successful"
else
  echo "❌ Registration failed"
  echo "$REG_RESPONSE" | sed '/^HTTP_CODE:/d' | head -n 3
fi
echo ""

# Test 2: Login
echo "[2/10] Testing login..."
LOGIN_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST http://localhost/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"admin@kfa.kg","password":"password"}')

LOGIN_CODE=$(echo "$LOGIN_RESPONSE" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
TOKEN=$(echo "$LOGIN_RESPONSE" | sed '/^HTTP_CODE:/d' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "HTTP Code: $LOGIN_CODE"
if [ "$LOGIN_CODE" = "200" ] && [ -n "$TOKEN" ]; then
  echo "✅ Login successful, token received"
else
  echo "❌ Login failed"
fi
echo ""

# Test 3: Get current user
echo "[3/10] Testing GET /api/user..."
USER_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" http://localhost/api/user \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN")

USER_CODE=$(echo "$USER_RESPONSE" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
echo "HTTP Code: $USER_CODE"
if [ "$USER_CODE" = "200" ]; then
  echo "✅ User fetch successful"
else
  echo "❌ User fetch failed"
fi
echo ""

# Test 4: GET /api/news
echo "[4/10] Testing GET /api/news..."
NEWS_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" http://localhost/api/news \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN")

NEWS_CODE=$(echo "$NEWS_RESPONSE" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
echo "HTTP Code: $NEWS_CODE"
if [ "$NEWS_CODE" = "200" ]; then
  echo "✅ News fetch successful"
else
  echo "❌ News fetch failed"
fi
echo ""

# Test 5: POST /api/news (admin only)
echo "[5/10] Testing POST /api/news..."
CREATE_NEWS=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST http://localhost/api/news \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"title\":\"API Test News\",\"slug\":\"api-test-$(date +%s)\",\"content\":\"Testing API functionality\"}")

CREATE_CODE=$(echo "$CREATE_NEWS" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
NEWS_ID=$(echo "$CREATE_NEWS" | sed '/^HTTP_CODE:/d' | grep -o '"id":[0-9]*' | cut -d: -f2)

echo "HTTP Code: $CREATE_CODE"
if [ "$CREATE_CODE" = "200" ] || [ "$CREATE_CODE" = "201" ]; then
  echo "✅ News creation successful (ID: $NEWS_ID)"
else
  echo "❌ News creation failed"
fi
echo ""

# Test 6: GET /api/members
echo "[6/10] Testing GET /api/members..."
MEMBERS_CODE=$(curl -s -w "%{http_code}" -o /dev/null http://localhost/api/members \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN")

echo "HTTP Code: $MEMBERS_CODE"
if [ "$MEMBERS_CODE" = "200" ]; then
  echo "✅ Members fetch successful"
else
  echo "❌ Members fetch failed"
fi
echo ""

# Test 7: GET /api/events
echo "[7/10] Testing GET /api/events..."
EVENTS_CODE=$(curl -s -w "%{http_code}" -o /dev/null http://localhost/api/events \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN")

echo "HTTP Code: $EVENTS_CODE"
if [ "$EVENTS_CODE" = "200" ]; then
  echo "✅ Events fetch successful"
else
  echo "❌ Events fetch failed"
fi
echo ""

# Test 8: GET /api/programs
echo "[8/10] Testing GET /api/programs..."
PROGRAMS_CODE=$(curl -s -w "%{http_code}" -o /dev/null http://localhost/api/programs \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN")

echo "HTTP Code: $PROGRAMS_CODE"
if [ "$PROGRAMS_CODE" = "200" ]; then
  echo "✅ Programs fetch successful"
else
  echo "❌ Programs fetch failed"
fi
echo ""

# Test 9: Unauthenticated request (should return 401)
echo "[9/10] Testing unauthenticated request..."
UNAUTH_CODE=$(curl -s -w "%{http_code}" -o /dev/null http://localhost/api/user \
  -H "Accept: application/json")

echo "HTTP Code: $UNAUTH_CODE"
if [ "$UNAUTH_CODE" = "401" ]; then
  echo "✅ Correct 401 for unauthenticated"
else
  echo "❌ Expected 401, got $UNAUTH_CODE"
fi
echo ""

# Test 10: Logout
echo "[10/10] Testing logout..."
LOGOUT_CODE=$(curl -s -w "%{http_code}" -o /dev/null -X POST http://localhost/api/logout \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN")

echo "HTTP Code: $LOGOUT_CODE"
if [ "$LOGOUT_CODE" = "200" ]; then
  echo "✅ Logout successful"
else
  echo "❌ Logout failed"
fi
echo ""

echo "=== TEST SUMMARY ==="
echo "All critical endpoints tested"
