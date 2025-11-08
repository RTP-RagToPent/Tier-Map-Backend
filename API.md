# API ドキュメント

ティアマップバックエンドAPIの詳細仕様書です。

## 📋 目次

- [認証](#認証)
- [エンドポイント一覧](#エンドポイント一覧)
- [プロフィールAPI](#プロフィールapi)
- [ラリーAPI](#ラリーapi)
- [スポットAPI](#スポットapi)
- [評価API](#評価api)

## 認証

すべてのAPIエンドポイントは認証が必要です。

### 認証ヘッダー

```http
Authorization: Bearer ${ANON_KEY}
Cookie: ${COOKIE}
```

### 環境変数

- `ANON_KEY`: Supabaseの匿名キー
- `COOKIE`: 認証用セッションCookie

## エンドポイント一覧

| メソッド | パス                                             | 説明                   |
| -------- | ------------------------------------------------ | ---------------------- |
| GET      | /functions/v1/profiles/                          | プロフィール取得       |
| PATCH    | /functions/v1/profiles/                          | プロフィール更新       |
| GET      | /functions/v1/rallies/                           | ラリー一覧取得         |
| POST     | /functions/v1/rallies/                           | ラリー作成             |
| GET      | /functions/v1/rallies/:rally_id/                 | ラリー詳細取得         |
| PATCH    | /functions/v1/rallies/:rally_id/                 | ラリー更新             |
| DELETE   | /functions/v1/rallies/:rally_id/                 | ラリー削除             |
| GET      | /functions/v1/rallies/:rally_id/spots            | ラリースポット一覧取得 |
| POST     | /functions/v1/rallies/:rally_id/spots            | ラリースポット登録     |
| GET      | /functions/v1/rallies/:rally_id/spots/:spot_id   | ラリースポット詳細取得 |
| GET      | /functions/v1/rallies/:rally_id/ratings          | 評価一覧取得           |
| POST     | /functions/v1/rallies/:rally_id/ratings/         | 評価作成               |
| GET      | /functions/v1/rallies/:rally_id/ratings/:spot_id | 評価詳細取得           |

---

## プロフィールAPI

### 1. プロフィール取得

ログインユーザーのプロフィール情報を取得します。

**エンドポイント**: `GET /functions/v1/profiles/`

リクエスト

```http
GET /functions/v1/profiles/
Content-Type: application/json
Authorization: Bearer ${ANON_KEY}
Cookie: ${COOKIE}
```

レスポンス

```json
{
  "data": {
    "id": 1,
    "name": "山田太郎"
  },
  "message": "Profile retrieved successfully"
}
```

レスポンスフィールド

| フィールド | 型     | 説明               |
| ---------- | ------ | ------------------ |
| data.id    | int    | プロフィールID     |
| data.name  | string | プロフィール名     |
| message    | string | 処理結果メッセージ |

---

### 2. プロフィール更新

ログインユーザーのプロフィール情報を更新します。

**エンドポイント**: `PATCH /functions/v1/profiles/`

リクエスト

```http
PATCH /functions/v1/profiles/
Content-Type: application/json
Authorization: Bearer ${ANON_KEY}
Cookie: ${COOKIE}
```

```json
{
  "name": "山田花子"
}
```

リクエストフィールド

| フィールド | 型     | 必須 | 説明                 |
| ---------- | ------ | ---- | -------------------- |
| name       | string | ○    | 新しいプロフィール名 |

レスポンス

```json
{
  "data": {
    "id": 1,
    "name": "山田花子"
  },
  "message": "Profile updated successfully"
}
```

レスポンスフィールド

| フィールド | 型     | 説明                   |
| ---------- | ------ | ---------------------- |
| data.id    | int    | プロフィールID         |
| data.name  | string | 更新後のプロフィール名 |
| message    | string | 処理結果メッセージ     |

---

## ラリーAPI

### 1. ラリー一覧取得

ログインユーザーが作成したラリーの一覧を取得します。

**エンドポイント**: `GET /functions/v1/rallies/`

リクエスト

```http
GET /functions/v1/rallies/
Content-Type: application/json
Authorization: Bearer ${ANON_KEY}
Cookie: ${COOKIE}
```

レスポンス

```json
{
  "data": [
    {
      "id": 1,
      "name": "東京ラーメン巡り",
      "genre": "ラーメン"
    },
    {
      "id": 2,
      "name": "渋谷カフェ巡り",
      "genre": "カフェ"
    }
  ],
  "message": "Rallies retrieved successfully"
}
```

レスポンスフィールド

| フィールド   | 型     | 説明               |
| ------------ | ------ | ------------------ |
| data         | array  | ラリー配列         |
| data[].id    | int    | ラリーID           |
| data[].name  | string | ラリー名           |
| data[].genre | string | ジャンル           |
| message      | string | 処理結果メッセージ |

---

### 2. ラリー作成

新しいラリーを作成します。

**エンドポイント**: `POST /functions/v1/rallies/`

リクエスト

```http
POST /functions/v1/rallies/
Content-Type: application/json
Authorization: Bearer ${ANON_KEY}
Cookie: ${COOKIE}
```

```json
{
  "name": "新宿居酒屋巡り",
  "genre": "居酒屋"
}
```

リクエストフィールド

| フィールド | 型     | 必須 | 説明     |
| ---------- | ------ | ---- | -------- |
| name       | string | ○    | ラリー名 |
| genre      | string | ○    | ジャンル |

レスポンス

```json
{
  "data": {
    "id": 3,
    "name": "新宿居酒屋巡り",
    "genre": "居酒屋"
  },
  "message": "Rally created successfully"
}
```

レスポンスフィールド

| フィールド | 型     | 説明               |
| ---------- | ------ | ------------------ |
| data.id    | int    | 作成されたラリーID |
| data.name  | string | ラリー名           |
| data.genre | string | ジャンル           |
| message    | string | 処理結果メッセージ |

---

### 3. ラリー詳細取得

指定したラリーの詳細情報を取得します。

**エンドポイント**: `GET /functions/v1/rallies/:rally_id/`

リクエスト

```http
GET /functions/v1/rallies/1/
Content-Type: application/json
Authorization: Bearer ${ANON_KEY}
Cookie: ${COOKIE}
```

パスパラメータ

| パラメータ | 型  | 説明     |
| ---------- | --- | -------- |
| rally_id   | int | ラリーID |

レスポンス

```json
{
  "data": {
    "id": 1,
    "name": "東京ラーメン巡り",
    "genre": "ラーメン"
  },
  "message": "Rally retrieved successfully"
}
```

レスポンスフィールド

| フィールド | 型     | 説明               |
| ---------- | ------ | ------------------ |
| data.id    | int    | ラリーID           |
| data.name  | string | ラリー名           |
| data.genre | string | ジャンル           |
| message    | string | 処理結果メッセージ |

---

### 4. ラリー更新

指定したラリーの情報を更新します。

**エンドポイント**: `PATCH /functions/v1/rallies/:rally_id/`

リクエスト

```http
PATCH /functions/v1/rallies/1/
Content-Type: application/json
Authorization: Bearer ${ANON_KEY}
Cookie: ${COOKIE}
```

```json
{
  "name": "東京つけ麺巡り",
  "genre": "つけ麺"
}
```

パスパラメータ

| パラメータ | 型  | 説明     |
| ---------- | --- | -------- |
| rally_id   | int | ラリーID |

リクエストフィールド

| フィールド | 型     | 必須 | 説明     |
| ---------- | ------ | ---- | -------- |
| name       | string | ○    | ラリー名 |
| genre      | string | ○    | ジャンル |

レスポンス

```json
{
  "data": {
    "id": 1,
    "name": "東京つけ麺巡り",
    "genre": "つけ麺"
  },
  "message": "Rally updated successfully"
}
```

レスポンスフィールド

| フィールド | 型     | 説明               |
| ---------- | ------ | ------------------ |
| data.id    | int    | ラリーID           |
| data.name  | string | 更新後のラリー名   |
| data.genre | string | 更新後のジャンル   |
| message    | string | 処理結果メッセージ |

---

### 5. ラリー削除

指定したラリーを削除します。

**エンドポイント**: `DELETE /functions/v1/rallies/:rally_id/`

リクエスト

```http
DELETE /functions/v1/rallies/1/
Content-Type: application/json
Authorization: Bearer ${ANON_KEY}
Cookie: ${COOKIE}
```

パスパラメータ

| パラメータ | 型  | 説明     |
| ---------- | --- | -------- |
| rally_id   | int | ラリーID |

---

## スポットAPI

### 1. ラリースポット一覧取得

指定したラリーに登録されているスポットの一覧を取得します。

**エンドポイント**: `GET /functions/v1/rallies/:rally_id/spots`

リクエスト

```http
GET /functions/v1/rallies/1/spots
Content-Type: application/json
Authorization: Bearer ${ANON_KEY}
Cookie: ${COOKIE}
```

パスパラメータ

| パラメータ | 型  | 説明     |
| ---------- | --- | -------- |
| rally_id   | int | ラリーID |

レスポンス

```json
{
  "data": [
    {
      "id": "spot_001",
      "name": "一蘭 新宿店",
      "order_no": 1
    },
    {
      "id": "spot_002",
      "name": "一風堂 渋谷店",
      "order_no": 2
    }
  ],
  "message": "Rally spots retrieved successfully"
}
```

レスポンスフィールド

| フィールド      | 型     | 説明               |
| --------------- | ------ | ------------------ |
| data            | array  | スポット配列       |
| data[].id       | string | スポットID         |
| data[].name     | string | スポット名         |
| data[].order_no | int    | 訪問順序           |
| message         | string | 処理結果メッセージ |

---

### 2. ラリースポット登録

指定したラリーに複数のスポットを一括登録します。

**エンドポイント**: `POST /functions/v1/rallies/:rally_id/spots`

リクエスト

```http
POST /functions/v1/rallies/1/spots
Content-Type: application/json
Authorization: Bearer ${ANON_KEY}
Cookie: ${COOKIE}
```

```json
{
  "spots": [
    {
      "spot_id": "spot_001",
      "name": "一蘭 新宿店",
      "order_no": 1
    },
    {
      "spot_id": "spot_002",
      "name": "一風堂 渋谷店",
      "order_no": 2
    }
  ]
}
```

パスパラメータ

| パラメータ | 型  | 説明     |
| ---------- | --- | -------- |
| rally_id   | int | ラリーID |

リクエストフィールド

| フィールド       | 型     | 必須 | 説明         |
| ---------------- | ------ | ---- | ------------ |
| spots            | array  | ○    | スポット配列 |
| spots[].spot_id  | string | ○    | スポットID   |
| spots[].name     | string | ○    | スポット名   |
| spots[].order_no | int    | ○    | 訪問順序     |

レスポンス

```json
{
  "data": [
    {
      "id": "spot_001",
      "name": "一蘭 新宿店",
      "order_no": 1
    },
    {
      "id": "spot_002",
      "name": "一風堂 渋谷店",
      "order_no": 2
    }
  ],
  "message": "Rally spots created successfully"
}
```

レスポンスフィールド

| フィールド      | 型     | 説明                   |
| --------------- | ------ | ---------------------- |
| data            | array  | 登録されたスポット配列 |
| data[].id       | string | スポットID             |
| data[].name     | string | スポット名             |
| data[].order_no | int    | 訪問順序               |
| message         | string | 処理結果メッセージ     |

---

### 3. ラリースポット詳細取得

指定したラリーの特定スポットの詳細情報を取得します。

**エンドポイント**: `GET /functions/v1/rallies/:rally_id/spots/:spot_id`

リクエスト

```http
GET /functions/v1/rallies/1/spots/spot_001
Content-Type: application/json
Authorization: Bearer ${ANON_KEY}
Cookie: ${COOKIE}
```

パスパラメータ

| パラメータ | 型     | 説明       |
| ---------- | ------ | ---------- |
| rally_id   | int    | ラリーID   |
| spot_id    | string | スポットID |

レスポンス

```json
{
  "data": {
    "id": "spot_001",
    "name": "一蘭 新宿店",
    "order_no": 1
  },
  "message": "Rally spot retrieved successfully"
}
```

レスポンスフィールド

| フィールド    | 型     | 説明               |
| ------------- | ------ | ------------------ |
| data.id       | string | スポットID         |
| data.name     | string | スポット名         |
| data.order_no | int    | 訪問順序           |
| message       | string | 処理結果メッセージ |

---

## 評価API

### 1. 評価一覧取得

指定したラリーの全スポットの評価一覧を取得します。

**エンドポイント**: `GET /functions/v1/rallies/:rally_id/ratings`

リクエスト

```http
GET /functions/v1/rallies/1/ratings
Content-Type: application/json
Authorization: Bearer ${ANON_KEY}
Cookie: ${COOKIE}
```

パスパラメータ

| パラメータ | 型  | 説明     |
| ---------- | --- | -------- |
| rally_id   | int | ラリーID |

レスポンス

```json
{
  "data": [
    {
      "id": 1,
      "spot_id": "spot_001",
      "name": "一蘭 新宿店",
      "order_no": 1,
      "stars": 5,
      "memo": "スープが濃厚で美味しい"
    },
    {
      "id": 2,
      "spot_id": "spot_002",
      "name": "一風堂 渋谷店",
      "order_no": 2,
      "stars": 4,
      "memo": "チャーシューが絶品"
    }
  ],
  "message": "Ratings retrieved successfully"
}
```

レスポンスフィールド

| フィールド      | 型     | 説明               |
| --------------- | ------ | ------------------ |
| data            | array  | 評価配列           |
| data[].id       | int    | 評価ID             |
| data[].spot_id  | string | スポットID         |
| data[].name     | string | スポット名         |
| data[].order_no | int    | 訪問順序           |
| data[].stars    | int    | 評価(1-5)          |
| data[].memo     | string | メモ               |
| message         | string | 処理結果メッセージ |

---

### 2. 評価作成

指定したラリーの特定スポットに評価を登録します。

**エンドポイント**: `POST /functions/v1/rallies/:rally_id/ratings/`

リクエスト

```http
POST /functions/v1/rallies/1/ratings/
Content-Type: application/json
Authorization: Bearer ${ANON_KEY}
Cookie: ${COOKIE}
```

```json
{
  "spot_id": "spot_001",
  "stars": 5,
  "memo": "スープが濃厚で美味しい"
}
```

パスパラメータ

| パラメータ | 型  | 説明     |
| ---------- | --- | -------- |
| rally_id   | int | ラリーID |

リクエストフィールド

| フィールド | 型     | 必須 | 説明            |
| ---------- | ------ | ---- | --------------- |
| spot_id    | string | ○    | スポットID      |
| stars      | int    | ○    | 評価(1-5の整数) |
| memo       | string | ×    | メモ(任意)      |

#### 補足

- 送信された`spot_id`がspotテーブルに存在しない場合、自動的にspotテーブルにデータを挿入します。

レスポンス

```json
{
  "data": {
    "id": 1,
    "spot_id": "spot_001",
    "name": "一蘭 新宿店",
    "order_no": 1,
    "stars": 5,
    "memo": "スープが濃厚で美味しい"
  },
  "message": "Rating created successfully"
}
```

レスポンスフィールド

| フィールド    | 型     | 説明               |
| ------------- | ------ | ------------------ |
| data.id       | int    | 作成された評価ID   |
| data.spot_id  | string | スポットID         |
| data.name     | string | スポット名         |
| data.order_no | int    | 訪問順序           |
| data.stars    | int    | 評価(1-5)          |
| data.memo     | string | メモ               |
| message       | string | 処理結果メッセージ |

---

### 3. 評価詳細取得

指定したラリーの特定スポットの評価詳細を取得します。

**エンドポイント**: `GET /functions/v1/rallies/:rally_id/ratings/:spot_id`

リクエスト

```http
GET /functions/v1/rallies/1/ratings/spot_001
Content-Type: application/json
Authorization: Bearer ${ANON_KEY}
Cookie: ${COOKIE}
```

パスパラメータ

| パラメータ | 型     | 説明       |
| ---------- | ------ | ---------- |
| rally_id   | int    | ラリーID   |
| spot_id    | string | スポットID |

レスポンス

```json
{
  "data": {
    "id": 1,
    "spot_id": "spot_001",
    "name": "一蘭 新宿店",
    "order_no": 1,
    "stars": 5,
    "memo": "スープが濃厚で美味しい"
  },
  "message": "Rating retrieved successfully"
}
```

レスポンスフィールド

| フィールド    | 型     | 説明               |
| ------------- | ------ | ------------------ |
| data.id       | int    | 評価ID             |
| data.spot_id  | string | スポットID         |
| data.name     | string | スポット名         |
| data.order_no | int    | 訪問順序           |
| data.stars    | int    | 評価(1-5)          |
| data.memo     | string | メモ               |
| message       | string | 処理結果メッセージ |

---

## 🚨 エラーレスポンス

エラーが発生した場合、以下の形式でレスポンスが返されます。

### エラーレスポンス例

```json
{
  "message": "詳細な説明"
}
```

### HTTPステータスコード

| コード | 説明                   |
| ------ | ---------------------- |
| 200    | 成功                   |
| 201    | 作成成功               |
| 400    | リクエストが不正       |
| 401    | 認証エラー             |
| 403    | アクセス権限なし       |
| 404    | リソースが見つからない |
| 500    | サーバーエラー         |

---

## 📝 注意事項

1. すべてのAPIエンドポイントは認証が必須です
1. リクエストボディは必ず`Content-Type: application/json`で送信してください
1. 評価の`stars`は1から5までの整数値である必要があります
1. `spot_id`は文字列型です
1. ラリーIDは整数型です

---

## 🔗 関連リンク

- [README.md](./README.md) - プロジェクト概要
- [SETUP.md](./SETUP.md) - セットアップガイド
- [api-test/](./api-test/) - APIテストスクリプト
