#!/bin/bash

# ============================================================
# Rally Spots API テストスクリプト
# Cookie認証を使用したRally Spots APIの動作確認用curlコマンド集
# ============================================================

# 色付き出力用
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Supabase ローカル環境の設定
SUPABASE_URL="http://localhost:54321"
# TODO: ここにあなたのSupabaseプロジェクトのAnonキーを設定してください
ANON_KEY="__PLACEHOLDER_ANON_KEY__"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Rally Spots API テスト${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# ============================================================
# ステップ 0: 必要な環境変数の確認
# ============================================================
echo -e "${GREEN}[準備] 環境変数の確認${NC}"
echo "SUPABASE_URL: ${SUPABASE_URL}"
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
# ステップ 2: ラリーIDの取得または入力
# ============================================================
echo -e "${GREEN}[STEP 2] ラリーID の設定${NC}"
echo "既存のラリー一覧を取得しています..."
echo ""

RALLIES_RESPONSE=$(curl -s -X GET "${SUPABASE_URL}/functions/v1/rallies/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Cookie: ${COOKIE}")

echo "あなたのラリー一覧:"
echo "$RALLIES_RESPONSE" | jq '.data[] | {id, name, genre}' 2>/dev/null || echo "$RALLIES_RESPONSE"
echo ""

read -p "テストに使用するラリーID: " RALLY_ID

if [ -z "$RALLY_ID" ]; then
  echo -e "${RED}❌ ラリーIDが入力されませんでした${NC}"
  exit 1
fi

API_URL="${SUPABASE_URL}/functions/v1/rallies/${RALLY_ID}/spots"
echo ""
echo "API URL: ${API_URL}"
echo ""

# ============================================================
# ステップ 3: GET /functions/v1/rallies/:rally_id/spots - スポット一覧取得
# ============================================================
echo -e "${GREEN}[STEP 3] Rally Spots 一覧取得 (GET)${NC}"
echo "実行するコマンド:"
echo "curl -X GET '${API_URL}' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'Authorization: Bearer \${ANON_KEY}' \\"
echo "  -H 'Cookie: sb-access-token=\${ACCESS_TOKEN}; sb-refresh-token=\${REFRESH_TOKEN}'"
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
# ステップ 4: POST /functions/v1/rallies/:rally_id/spots - スポット作成
# ============================================================
echo -e "${GREEN}[STEP 4] Rally Spots 作成 (POST)${NC}"
echo "複数のスポットを作成します"
echo ""

# スポット情報の入力
SPOTS_JSON="[]"
while true; do
  read -p "スポットIDを入力 (例: tokyo-tower, 終了する場合は空Enter): " SPOT_ID

  if [ -z "$SPOT_ID" ]; then
    break
  fi

  read -p "スポット名を入力: " SPOT_NAME
  read -p "順序番号を入力 (数値): " ORDER_NO

  # JSONに追加
  NEW_SPOT=$(jq -n \
    --arg spot_id "$SPOT_ID" \
    --arg name "$SPOT_NAME" \
    --argjson order_no "$ORDER_NO" \
    '{spot_id: $spot_id, name: $name, order_no: $order_no}')

  SPOTS_JSON=$(echo "$SPOTS_JSON" | jq --argjson spot "$NEW_SPOT" '. += [$spot]')

  echo -e "${BLUE}追加されたスポット:${NC}"
  echo "$NEW_SPOT" | jq '.'
  echo ""

  read -p "さらにスポットを追加しますか? (y/n): " ADD_MORE
  if [[ ! "$ADD_MORE" =~ ^[Yy]$ ]]; then
    break
  fi
done

if [ "$SPOTS_JSON" = "[]" ]; then
  echo -e "${YELLOW}⚠️  スポットが追加されなかったため、スキップします${NC}"
  echo ""
else
  REQUEST_BODY=$(jq -n --argjson spots "$SPOTS_JSON" '{spots: $spots}')

  echo "送信するJSON:"
  echo "$REQUEST_BODY" | jq '.'
  echo ""

  echo "実行するコマンド:"
  echo "curl -X POST '${API_URL}' \\"
  echo "  -H 'Content-Type: application/json' \\"
  echo "  -H 'Authorization: Bearer \${ANON_KEY}' \\"
  echo "  -H 'Cookie: sb-access-token=\${ACCESS_TOKEN}; sb-refresh-token=\${REFRESH_TOKEN}' \\"
  echo "  -d '${REQUEST_BODY}'"
  echo ""

  POST_RESPONSE=$(curl -s -X POST "${API_URL}" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${ANON_KEY}" \
    -H "Cookie: ${COOKIE}" \
    -d "$REQUEST_BODY" \
    -w "\nHTTP_STATUS:%{http_code}")

  HTTP_STATUS=$(echo "$POST_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
  BODY=$(echo "$POST_RESPONSE" | sed '/HTTP_STATUS/d')

  echo "ステータスコード: ${HTTP_STATUS}"
  echo "レスポンス:"
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
  echo ""

  if [ "$HTTP_STATUS" = "201" ]; then
    echo -e "${GREEN}✅ Rally Spots作成成功${NC}"
  else
    echo -e "${RED}❌ Rally Spots作成失敗${NC}"
  fi
  echo ""
fi

# ============================================================
# ステップ 5: GET /functions/v1/rallies/:rally_id/spots - 作成後の一覧取得
# ============================================================
echo -e "${GREEN}[STEP 5] Rally Spots 一覧取得（作成後の確認）${NC}"
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
# ステップ 6: GET /functions/v1/rallies/:rally_id/spots/:spot_id - 個別取得
# ============================================================
echo -e "${GREEN}[STEP 6] Rally Spot 個別取得 (GET)${NC}"
read -p "取得するスポットIDを入力: " SPOT_ID_TO_GET

if [ ! -z "$SPOT_ID_TO_GET" ]; then
  SPOT_URL="${API_URL}/${SPOT_ID_TO_GET}"

  echo "実行するコマンド:"
  echo "curl -X GET '${SPOT_URL}' \\"
  echo "  -H 'Content-Type: application/json' \\"
  echo "  -H 'Authorization: Bearer \${ANON_KEY}' \\"
  echo "  -H 'Cookie: sb-access-token=\${ACCESS_TOKEN}; sb-refresh-token=\${REFRESH_TOKEN}'"
  echo ""

  GET_SPOT_RESPONSE=$(curl -s -X GET "${SPOT_URL}" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${ANON_KEY}" \
    -H "Cookie: ${COOKIE}" \
    -w "\nHTTP_STATUS:%{http_code}")

  HTTP_STATUS=$(echo "$GET_SPOT_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
  BODY=$(echo "$GET_SPOT_RESPONSE" | sed '/HTTP_STATUS/d')

  echo "ステータスコード: ${HTTP_STATUS}"
  echo "レスポンス:"
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
  echo ""

  if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Rally Spot取得成功${NC}"
  elif [ "$HTTP_STATUS" = "404" ]; then
    echo -e "${YELLOW}⚠️  Rally Spotが見つかりませんでした${NC}"
  else
    echo -e "${RED}❌ Rally Spot取得失敗${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  スポットIDが入力されなかったため、スキップします${NC}"
fi
echo ""

# ============================================================
# 終了
# ============================================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Rally Spots API テスト完了${NC}"
echo -e "${BLUE}========================================${NC}"
