#!/bin/bash

# Test script for Clever Sermon API endpoints
# Tests critical endpoints to ensure they're working

BASE_URL="http://localhost:4001/api/v1"

echo "🧪 Testing Clever Sermon API Endpoints"
echo "========================================"
echo ""

# Test 1: Health check (no auth needed)
echo "1. Testing server is running..."
curl -s -o /dev/null -w "Status: %{http_code}\n" $BASE_URL/auth/login
echo ""

# Test 2: Register a test user
echo "2. Registering test user..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "name": "Test User"
  }')

echo "$REGISTER_RESPONSE" | jq -r '.token // .message' 2>/dev/null || echo "$REGISTER_RESPONSE"
echo ""

# Test 3: Login
echo "3. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }')

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token // .token' 2>/dev/null)

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo "✅ Login successful"
  echo ""
else
  echo "❌ Login failed"
  echo "$LOGIN_RESPONSE"
  exit 1
fi

# Test 4: Create workspace
echo "4. Creating workspace..."
WORKSPACE_RESPONSE=$(curl -s -X POST $BASE_URL/workspaces \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Sermon",
    "mainPassage": "John 3:16",
    "theme": "God'\''s Love",
    "language": "en"
  }')

WORKSPACE_ID=$(echo "$WORKSPACE_RESPONSE" | jq -r '.id' 2>/dev/null)

if [ "$WORKSPACE_ID" != "null" ] && [ -n "$WORKSPACE_ID" ]; then
  echo "✅ Workspace created: $WORKSPACE_ID"
  echo ""
else
  echo "❌ Workspace creation failed"
  echo "$WORKSPACE_RESPONSE"
  exit 1
fi

# Test 5: Get workspace
echo "5. Fetching workspace..."
GET_WORKSPACE=$(curl -s -X GET "$BASE_URL/workspaces/$WORKSPACE_ID" \
  -H "Authorization: Bearer $TOKEN")

WORKSPACE_TITLE=$(echo "$GET_WORKSPACE" | jq -r '.title' 2>/dev/null)

if [ "$WORKSPACE_TITLE" = "Test Sermon" ]; then
  echo "✅ Workspace fetched successfully"
  echo ""
else
  echo "❌ Workspace fetch failed"
  echo "$GET_WORKSPACE"
  exit 1
fi

# Test 6: Get all workspaces
echo "6. Fetching all workspaces..."
ALL_WORKSPACES=$(curl -s -X GET "$BASE_URL/workspaces" \
  -H "Authorization: Bearer $TOKEN")

WORKSPACE_COUNT=$(echo "$ALL_WORKSPACES" | jq '. | length' 2>/dev/null)

if [ "$WORKSPACE_COUNT" -gt 0 ]; then
  echo "✅ Found $WORKSPACE_COUNT workspace(s)"
  echo ""
else
  echo "❌ Failed to fetch workspaces"
  echo "$ALL_WORKSPACES"
fi

# Test 7: Test EGW endpoints
echo "7. Testing EGW endpoints..."
EGW_BOOKS=$(curl -s -X GET "$BASE_URL/egw/books?language=en" \
  -H "Authorization: Bearer $TOKEN")

BOOK_COUNT=$(echo "$EGW_BOOKS" | jq '. | length' 2>/dev/null)

if [ "$BOOK_COUNT" -gt 0 ]; then
  echo "✅ EGW books endpoint working ($BOOK_COUNT books)"
  echo ""
else
  echo "⚠️  EGW books endpoint returned no data"
  echo ""
fi

# Test 8: Test Scripture endpoint
echo "8. Testing Scripture endpoint..."
SCRIPTURE=$(curl -s -X GET "$BASE_URL/scripture/passage?reference=John+3:16" \
  -H "Authorization: Bearer $TOKEN")

VERSE_TEXT=$(echo "$SCRIPTURE" | jq -r '.verses[0].text' 2>/dev/null)

if [ -n "$VERSE_TEXT" ] && [ "$VERSE_TEXT" != "null" ]; then
  echo "✅ Scripture endpoint working"
  echo "   John 3:16: ${VERSE_TEXT:0:50}..."
  echo ""
else
  echo "⚠️  Scripture endpoint issue"
  echo "$SCRIPTURE" | head -5
  echo ""
fi

# Summary
echo "========================================"
echo "✅ All critical endpoints tested"
echo "========================================"
echo ""
echo "Workspace ID for further testing: $WORKSPACE_ID"
echo "Auth Token: ${TOKEN:0:20}..."
