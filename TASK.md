# Rally Spots の API 実装タスク

現在、Supabase の edge functions を使用して API を実装している。 Profiles と
Rallies の API 構築は現在完了している。

## 前提条件

### 開発環境

- TypeScript
- Deno
- Supabase

### アーキテクチャ

アーキテクチャ: **クリーンアーキテクチャ**

### ディレクトリ構成

```txt
supabase/
├── config.toml
├── controller
├── domain
│   ├── profile
│   │   ├── models
│   │   └── repository.ts
│   └── rally
│       ├── models
│       └── repository.ts
├── functions
│   ├── profiles
│   │   ├── deno.json
│   │   ├── index.ts
│   │   └── router
│   └── rallies
│       ├── deno.json
│       ├── index.ts
│       └── router
├── infrastructure
│   └── supabase
│       ├── auth.ts
│       ├── client.ts
│       └── repository
├── lib
│   ├── config
│   │   ├── env.ts
│   │   ├── loader.ts
│   │   └── supabase.ts
│   ├── httpResponse.ts
│   ├── log.ts
│   └── parse.ts
└── usecase
    ├── profile
    └── rally
```

### テーブル

テーブル名: **Spots**

| column     | type      | key |
| ---------- | --------- | --- |
| id         | string    | PK  |
| name       | string    |     |
| created_at | timestamp |     |
| updated_at | timestamp |     |

テーブル名: **rallySpots**

| column     | type               | key |
| ---------- | ------------------ | --- |
| id         | INT auto increment | PK  |
| rally_id   | INT                | FK  |
| spot_id    | string             | FK  |
| order_no   | INT                |     |
| created_at | timestamp          |     |
| updated_at | timestamp          |     |

### RLS

```sql
alter table public.spots enable row level security;

create policy "spotの作成のみ可能"
on public.spots
for insert
with check (true);

create policy "spotの閲覧のみ可能"
on public.spots
for select
using (true);


alter table public.rallySpots enable row level security;

create policy "自分のラリースポットのみ作成可能"
on public.rallySpots
for insert
with check (rally_id in (select id from public.rallies where profile_id = (select id from public.profiles where user_id = auth.uid())));

create policy "自分のラリースポットのみ閲覧可能"
on public.rallySpots
for select
using (rally_id in (select id from public.rallies where profile_id = (select id from public.profiles where user_id = auth.uid())));

create policy "自分のラリースポットのみ更新可能"
on public.rallySpots
for update
using (rally_id in (select id from public.rallies where profile_id = (select id from public.profiles where user_id = auth.uid())))
with check (rally_id in (select id from public.rallies where profile_id = (select id from public.profiles where user_id = auth.uid())));

create policy "自分のラリースポットのみ削除可能"
on public.rallySpots
for delete
using (rally_id in (select id from public.rallies where profile_id = (select id from public.profiles where user_id = auth.uid())));
```

## 実装情報

| メソッド | パス                                           |
| -------- | ---------------------------------------------- |
| GET      | /functions/v1/rallies/:rally_id/spots          |
| POST     | /functions/v1/rallies/:rally_id/spots          |
| GET      | /functions/v1/rallies/:rally_id/spots/:spot_id |

### 1. GET /functions/v1/rallies/:rally_id/spots

リクエスト

```json
{
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${ANON_KEY}",
    "Cookie": "${COOKIE}"
  }
}
```

レスポンス

```json
{
  "body": {
    "data": [
      {
        "id": "string",
        "name": "string",
        "order_no": "int"
      }
    ],
    "message": "string"
  }
}
```

### 2. POST /functions/v1/rallies/:rally_id/spots

リクエスト

```json
{
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${ANON_KEY}",
    "Cookie": "${COOKIE}"
  },
  "body": {
    "spots": [
      {
        "spot_id": "string",
        "name": "string",
        "order_no": "int"
      }
    ]
  }
}
```

レスポンス

```json
{
  "body": {
    "data": [
      {
        "id": "string",
        "name": "string",
        "order_no": "int"
      }
    ],
    "message": "string"
  }
}
```

#### 補足内容

送信されたspotsがspotテーブルの中に存在しない場合、spotにデータを挿入する形にする。

### 3. GET /functions/v1/rallies/:rally_id/spots/:spot_id

```json
{
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${ANON_KEY}",
    "Cookie": "${COOKIE}"
  }
}
```

レスポンス

```json
{
  "body": {
    "data": {
      "id": "string",
      "name": "string",
      "order_no": "int"
    },
    "message": "string"
  }
}
```

### 補足

- cookie の送信(credentials: include)は必須である。
- rallies/router に rally spots の router を作成して、その中でルーティング
- ralliesの機能とまた異なる機能なのでそこはしっかりと理解して

このプロンプトを順守してコードを実装して。
また、コードの書き方に統一感を出すために他のディレクトリのコードを事前に読んで似せて書いて欲しい。

現状のプロントを作ったので、これを長くなってもいいので、GitHub Copilot (Claude
Sonet 4.5) が理解しやすいプロンプトに書き換えて欲しい
