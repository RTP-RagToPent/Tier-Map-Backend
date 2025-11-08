#!/bin/bash

# ============================================================
# Rallies API テストスクリプト
# Cookie認証を使用したRallies APIの動作確認用curlコマンド集
# ============================================================

# 色付き出力用
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Supabase ローカル環境の設定
SUPABASE_URL="http://localhost:54321"
API_URL="${SUPABASE_URL}/functions/v1/rallies"
# TODO: ここにあなたのSupabaseプロジェクトのAnonキーを設定してください
ANON_KEY="__PLACEHOLDER_ANON_KEY__"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Rallies API テスト${NC}"
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
  -H "apikey: ${ANON_KEY}" \
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
# ステップ 2: GET /functions/v1/rallies/ - 一覧取得
# ============================================================
echo -e "${GREEN}[STEP 2] ラリー一覧取得 (GET)${NC}"
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
# ステップ 3: POST /functions/v1/rallies/ - ラリー作成
# ============================================================
echo -e "${GREEN}[STEP 3] ラリー作成 (POST)${NC}"
read -p "作成するラリー名: " RALLY_NAME
read -p "ジャンル (例: sports, music, other): " RALLY_GENRE

echo "実行するコマンド:"
echo "curl -X POST '${API_URL}/' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'Cookie: sb-access-token=\${ACCESS_TOKEN}; sb-refresh-token=\${REFRESH_TOKEN}' \\"
echo "  -H 'Authorization: Bearer \${ANON_KEY}' \\"
echo "  -d '{\"name\": \"${RALLY_NAME}\", \"genre\": \"${RALLY_GENRE}\"}' \\"
echo "  -v"
echo ""

POST_RESPONSE=$(curl -s -X POST "${API_URL}/" \
  -H "Content-Type: application/json" \
  -H "Cookie: ${COOKIE}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -d "{\"name\": \"${RALLY_NAME}\", \"genre\": \"${RALLY_GENRE}\"}" \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$POST_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
BODY=$(echo "$POST_RESPONSE" | sed '/HTTP_STATUS/d')

echo "ステータスコード: ${HTTP_STATUS}"
echo "レスポンス:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

# 作成したラリーIDを抽出（レスポンスに id が含まれる想定）
CREATED_ID=$(echo "$BODY" | jq -r '.data.id' 2>/dev/null)
if [ -z "$CREATED_ID" ] || [ "$CREATED_ID" = "null" ]; then
  echo -e "${RED}❌ ラリー作成に失敗しました。続行不能${NC}"
  exit 1
fi

echo -e "${GREEN}✅ 作成成功: ID=${CREATED_ID}${NC}"
echo ""

# ============================================================
# ステップ 4: GET /functions/v1/rallies/:id - 単一取得
# ============================================================
echo -e "${GREEN}[STEP 4] 単一ラリー取得 (GET /:id)${NC}"
echo "実行するコマンド:"
echo "curl -X GET '${API_URL}/${CREATED_ID}' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'Authorization: Bearer \${ANON_KEY}' \\"
echo "  -H 'Cookie: sb-access-token=\${ACCESS_TOKEN}; sb-refresh-token=\${REFRESH_TOKEN}' \\"
echo "  -v"
echo ""

SINGLE_RESPONSE=$(curl -s -X GET "${API_URL}/${CREATED_ID}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Cookie: ${COOKIE}" \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$SINGLE_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
BODY=$(echo "$SINGLE_RESPONSE" | sed '/HTTP_STATUS/d')

echo "ステータスコード: ${HTTP_STATUS}"
echo "レスポンス:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

# ============================================================
# ステップ 5: PATCH /functions/v1/rallies/:id - 更新
# ============================================================
echo -e "${GREEN}[STEP 5] ラリー更新 (PATCH /:id)${NC}"
read -p "更新後のラリー名: " UPDATE_NAME
read -p "更新後のジャンル: " UPDATE_GENRE

echo "実行するコマンド:"
echo "curl -X PATCH '${API_URL}/${CREATED_ID}' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'Cookie: sb-access-token=\${ACCESS_TOKEN}; sb-refresh-token=\${REFRESH_TOKEN}' \\"
echo "  -H 'Authorization: Bearer \${ANON_KEY}' \\"
echo "  -d '{\"name\": \"${UPDATE_NAME}\", \"genre\": \"${UPDATE_GENRE}\"}' \\"
echo "  -v"
echo ""

PATCH_RESPONSE=$(curl -s -X PATCH "${API_URL}/${CREATED_ID}" \
  -H "Content-Type: application/json" \
  -H "Cookie: ${COOKIE}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -d "{\"name\": \"${UPDATE_NAME}\", \"genre\": \"${UPDATE_GENRE}\"}" \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$PATCH_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
BODY=$(echo "$PATCH_RESPONSE" | sed '/HTTP_STATUS/d')

echo "ステータスコード: ${HTTP_STATUS}"
echo "レスポンス:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

# ============================================================
# ステップ 6: 最終確認 - 一覧に反映されているか
# ============================================================
echo -e "${GREEN}[STEP 6] 更新後の一覧取得 (GET)${NC}"

GET_RESPONSE=$(curl -s -X GET "${API_URL}/" \
  -H "Content-Type: application/json" \
  -H "Cookie: ${COOKIE}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$GET_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
BODY=$(echo "$GET_RESPONSE" | sed '/HTTP_STATUS/d')

echo "ステータスコード: ${HTTP_STATUS}"
echo "レスポンス:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

# ============================================================
# ステップ 7: DELETE /functions/v1/rallies/:id - ラリー削除（任意）
# ============================================================
echo -e "${GREEN}[STEP 7] ラリー削除 (DELETE /:id) - 任意${NC}"
echo "作成したラリー (ID: ${CREATED_ID}) を削除しますか？"
read -p "削除する場合は 'yes' を入力してください: " DELETE_CONFIRM

if [ "$DELETE_CONFIRM" = "yes" ]; then
  echo ""
  echo "実行するコマンド:"
  echo "curl -X DELETE '${API_URL}/${CREATED_ID}' \\"
  echo "  -H 'Content-Type: application/json' \\"
  echo "  -H 'Cookie: sb-access-token=\${ACCESS_TOKEN}; sb-refresh-token=\${REFRESH_TOKEN}' \\"
  echo "  -H 'Authorization: Bearer \${ANON_KEY}' \\"
  echo "  -v"
  echo ""

  DELETE_RESPONSE=$(curl -s -X DELETE "${API_URL}/${CREATED_ID}" \
    -H "Content-Type: application/json" \
    -H "Cookie: ${COOKIE}" \
    -H "Authorization: Bearer ${ANON_KEY}" \
    -w "\nHTTP_STATUS:%{http_code}")

  HTTP_STATUS=$(echo "$DELETE_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
  BODY=$(echo "$DELETE_RESPONSE" | sed '/HTTP_STATUS/d')

  echo "ステータスコード: ${HTTP_STATUS}"
  echo "レスポンス:"
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
  echo ""

  if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "204" ]; then
    echo -e "${GREEN}✅ 削除成功${NC}"
    echo ""

    # 削除後の一覧確認
    echo -e "${GREEN}[確認] 削除後の一覧取得${NC}"
    GET_RESPONSE=$(curl -s -X GET "${API_URL}/" \
      -H "Content-Type: application/json" \
      -H "Cookie: ${COOKIE}" \
      -H "Authorization: Bearer ${ANON_KEY}" \
      -w "\nHTTP_STATUS:%{http_code}")

    HTTP_STATUS=$(echo "$GET_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
    BODY=$(echo "$GET_RESPONSE" | sed '/HTTP_STATUS/d')

    echo "ステータスコード: ${HTTP_STATUS}"
    echo "レスポンス:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    echo ""
  else
    echo -e "${RED}❌ 削除失敗${NC}"
    echo ""
  fi
else
  echo ""
  echo -e "${BLUE}削除をスキップしました。ラリー (ID: ${CREATED_ID}) は残ります。${NC}"
  echo ""
fi

# 終了
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}テスト完了${NC}"
echo -e "${BLUE}========================================${NC}"
