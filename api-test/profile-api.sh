#!/bin/bash

# ============================================================
# Profile API テストスクリプト
# Cookie認証を使用したProfile APIの動作確認用curlコマンド集
# ============================================================

# 色付き出力用
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Supabase ローカル環境の設定
SUPABASE_URL="http://localhost:54321"
API_URL="${SUPABASE_URL}/functions/v1/profiles"
# TODO: ここにあなたのSupabaseプロジェクトのAnonキーを設定してください
ANON_KEY="__PLACEHOLDER_ANON_KEY__"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Profile API テスト${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# ============================================================
# ステップ 0: 必要な環境変数の確認
# ============================================================
echo -e "${GREEN}[準備] 環境変数の確認${NC}"
echo "SUPABASE_URL: ${SUPABASE_URL}"
echo "API_URL: ${API_URL}"
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
# ステップ 2: GET /functions/v1/profiles/ - プロフィール取得
# ============================================================
echo -e "${GREEN}[STEP 2] プロフィール取得 (GET)${NC}"
echo "実行するコマンド:"
echo "curl -X GET '${API_URL}/' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'Authorization: Bearer \${ANON_KEY}' \\"
echo "  -H 'Cookie: sb-access-token=\${ACCESS_TOKEN}; sb-refresh-token=\${REFRESH_TOKEN}' \\"
echo "  -v"
echo ""

GET_RESPONSE=$(curl -s -X GET "${API_URL}/" \
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
# ステップ 3: PATCH /functions/v1/profiles/ - プロフィール更新
# ============================================================
echo -e "${GREEN}[STEP 3] プロフィール更新 (PATCH)${NC}"
read -p "新しい名前を入力してください: " NEW_NAME
echo ""

echo "実行するコマンド:"
echo "curl -X PATCH '${API_URL}/' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'Authorization: Bearer \${ANON_KEY}' \\"
echo "  -H 'Cookie: sb-access-token=\${ACCESS_TOKEN}; sb-refresh-token=\${REFRESH_TOKEN}' \\"
echo "  -d '{\"name\": \"${NEW_NAME}\"}' \\"
echo "  -v"
echo ""

PATCH_RESPONSE=$(curl -s -X PATCH "${API_URL}/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Cookie: ${COOKIE}" \
  -d "{\"name\": \"${NEW_NAME}\"}" \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$PATCH_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
BODY=$(echo "$PATCH_RESPONSE" | sed '/HTTP_STATUS/d')

echo "ステータスコード: ${HTTP_STATUS}"
echo "レスポンス:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

# ============================================================
# ステップ 4: 更新後の確認
# ============================================================
echo -e "${GREEN}[STEP 4] 更新後のプロフィール確認 (GET)${NC}"

GET_RESPONSE=$(curl -s -X GET "${API_URL}/" \
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

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}テスト完了${NC}"
echo -e "${BLUE}========================================${NC}"
