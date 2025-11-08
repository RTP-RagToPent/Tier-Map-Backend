#!/bin/bash

# ============================================================
# Ratings API テストスクリプト
# Cookie認証を使用したRatings APIの動作確認用curlコマンド集
# ============================================================

# 色付き出力用
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Supabase ローカル環境の設定
SUPABASE_URL="http://localhost:54321"
API_BASE_URL="${SUPABASE_URL}/functions/v1/rallies"
# TODO: ここにあなたのSupabaseプロジェクトのAnonキーを設定してください
ANON_KEY="__PLACEHOLDER_ANON_KEY__"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Ratings API テスト${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# ============================================================
# ステップ 0: 必要な環境変数の確認
# ============================================================
echo -e "${GREEN}[準備] 環境変数の確認${NC}"
echo "SUPABASE_URL: ${SUPABASE_URL}"
echo "API_BASE_URL: ${API_BASE_URL}"
echo "ANON_KEY: ${ANON_KEY:0:10}..."
echo ""

# ============================================================
# ステップ 1: ユーザーログイン（トークン取得）
# ============================================================
echo -e "${GREEN}[STEP 1] ユーザーログイン${NC}"
echo "メールアドレスとパスワードを入力してください"
echo ""

read -p "Email: " USER_EMAIL
read -sp "Password: " USER_PASSWORD
echo ""
echo ""

# ログインしてトークンを取得
echo "ログイン中..."
LOGIN_RESPONSE=$(curl -s -X POST "${SUPABASE_URL}/auth/v1/token?grant_type=password" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -d "{\"email\":\"${USER_EMAIL}\",\"password\":\"${USER_PASSWORD}\"}")

# トークンを抽出
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
REFRESH_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"refresh_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
  echo -e "${RED}❌ ログイン失敗${NC}"
  echo "レスポンス: $LOGIN_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✅ ログイン成功${NC}"
echo "Access Token: ${ACCESS_TOKEN:0:50}..."
echo ""

# Cookieの形式を準備
COOKIE="sb-access-token=${ACCESS_TOKEN}; sb-refresh-token=${REFRESH_TOKEN}"

# ============================================================
# ステップ 2: Rally ID 入力
# ============================================================
echo -e "${GREEN}[STEP 2] テスト対象のRally ID入力${NC}"
read -p "Rally ID: " RALLY_ID
echo ""

API_URL="${API_BASE_URL}/${RALLY_ID}/ratings"

# ============================================================
# ステップ 3: GET /functions/v1/rallies/:rally_id/ratings - 一覧取得
# ============================================================
echo -e "${GREEN}[STEP 3] 評価一覧取得 (GET)${NC}"
echo "実行するコマンド:"
echo "curl -X GET '${API_URL}' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'Authorization: Bearer \${ANON_KEY}' \\"
echo "  -H 'Cookie: sb-access-token=\${ACCESS_TOKEN}; sb-refresh-token=\${REFRESH_TOKEN}' \\"
echo "  -v"
echo ""

GET_RESPONSE=$(curl -s -X GET "${API_URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Cookie: ${COOKIE}" \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$GET_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
BODY=$(echo "$GET_RESPONSE" | sed '/HTTP_STATUS/d')

echo "ステータスコード: ${HTTP_STATUS}"
echo "レスポンス:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

# ============================================================
# ステップ 4: POST /functions/v1/rallies/:rally_id/ratings - 評価作成
# ============================================================
echo -e "${GREEN}[STEP 4] 評価作成 (POST)${NC}"
read -p "Spot ID: " SPOT_ID
read -p "Stars (0-5): " STARS
read -p "Memo: " MEMO
echo ""

echo "評価を作成しています..."
POST_RESPONSE=$(curl -s -X POST "${API_URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Cookie: ${COOKIE}" \
  -d "{\"spot_id\":\"${SPOT_ID}\",\"stars\":${STARS},\"memo\":\"${MEMO}\"}" \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$POST_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
BODY=$(echo "$POST_RESPONSE" | sed '/HTTP_STATUS/d')

echo "ステータスコード: ${HTTP_STATUS}"
echo "レスポンス:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_STATUS" -eq 201 ] || [ "$HTTP_STATUS" -eq 200 ]; then
  echo -e "${GREEN}✅ 評価作成成功${NC}"
else
  echo -e "${RED}❌ 評価作成失敗${NC}"
fi
echo ""

# ============================================================
# ステップ 5: GET /functions/v1/rallies/:rally_id/ratings/:spot_id - 評価詳細取得
# ============================================================
echo -e "${GREEN}[STEP 5] 評価詳細取得 (GET)${NC}"
read -p "取得するSpot ID: " SHOW_SPOT_ID
echo ""

SHOW_URL="${API_URL}/${SHOW_SPOT_ID}"

echo "実行するコマンド:"
echo "curl -X GET '${SHOW_URL}' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'Authorization: Bearer \${ANON_KEY}' \\"
echo "  -H 'Cookie: sb-access-token=\${ACCESS_TOKEN}; sb-refresh-token=\${REFRESH_TOKEN}' \\"
echo "  -v"
echo ""

SHOW_RESPONSE=$(curl -s -X GET "${SHOW_URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Cookie: ${COOKIE}" \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$SHOW_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
BODY=$(echo "$SHOW_RESPONSE" | sed '/HTTP_STATUS/d')

echo "ステータスコード: ${HTTP_STATUS}"
echo "レスポンス:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_STATUS" -eq 200 ]; then
  echo -e "${GREEN}✅ 評価詳細取得成功${NC}"
else
  echo -e "${RED}❌ 評価詳細取得失敗${NC}"
fi
echo ""

# ============================================================
# ステップ 6: 更新テスト (POST で既存評価を更新)
# ============================================================
echo -e "${GREEN}[STEP 6] 既存評価の更新テスト (POST)${NC}"
read -p "更新するSpot ID: " UPDATE_SPOT_ID
read -p "新しいStars (0-5): " UPDATE_STARS
read -p "新しいMemo: " UPDATE_MEMO
echo ""

echo "評価を更新しています..."
UPDATE_RESPONSE=$(curl -s -X POST "${API_URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Cookie: ${COOKIE}" \
  -d "{\"spot_id\":\"${UPDATE_SPOT_ID}\",\"stars\":${UPDATE_STARS},\"memo\":\"${UPDATE_MEMO}\"}" \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$UPDATE_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
BODY=$(echo "$UPDATE_RESPONSE" | sed '/HTTP_STATUS/d')

echo "ステータスコード: ${HTTP_STATUS}"
echo "レスポンス:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_STATUS" -eq 201 ] || [ "$HTTP_STATUS" -eq 200 ]; then
  echo -e "${GREEN}✅ 評価更新成功${NC}"
else
  echo -e "${RED}❌ 評価更新失敗${NC}"
fi
echo ""

# ============================================================
# ステップ 7: 最終確認 - 一覧取得
# ============================================================
echo -e "${GREEN}[STEP 7] 最終確認 - 評価一覧取得 (GET)${NC}"
echo ""

FINAL_RESPONSE=$(curl -s -X GET "${API_URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Cookie: ${COOKIE}" \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$FINAL_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
BODY=$(echo "$FINAL_RESPONSE" | sed '/HTTP_STATUS/d')

echo "ステータスコード: ${HTTP_STATUS}"
echo "レスポンス:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}テスト完了${NC}"
echo -e "${BLUE}========================================${NC}"
