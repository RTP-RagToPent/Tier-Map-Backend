# Tier-Map-Backend

ティアマップは、近場×ジャンルの"ミニ旅"をスタンプラリー形式で体験し、評価からティア表の自動生成、SNS共有まで一気通貫で提供するサービスのバックエンドAPIです。

## 🎯 プロダクトの目的

### 解決する課題

- 地域情報が散在し、スポット選び〜記録〜共有のフローが分断している
- 行動が一過性で継続しない

### 提供する価値

3〜7スポットの**小さな達成**×**ランキング化(ティア表)**×**即共有**により、週末の小ネタ探索を習慣化させる体験を提供します。

## 👥 ターゲットユーザー

- **一次**：20–40代 / 都市圏在住 / 週末に「近所の新規開拓」をしたいライト層
- **二次**：職場・サークル・カップルで**ゆるい競争**や共有を楽しむ人

### ペルソナ例

- **A.** 28歳 会社員 / 土曜に友人と**ラーメン**食べ歩き / LINEで共有が中心
- **B.** 33歳 カップル / **カフェ**巡り＋写真映え / SNSはInstagramが多い

## 🚀 主要機能(PoC版)

1. **地域×ジャンルを選ぶ** →
   候補スポットが3〜5件リスト＋地図表示（徒歩15分圏内）
2. **ラリー開始** → 各スポットで**GPSチェックイン**＋★評価＋ひと言メモ
3. **完走** → **ティア表（S/A/B）**を自動生成 → 共有用画像カードを**LINEで送信**

## 🛠 技術スタック

- **Runtime**: Deno
- **Language**: TypeScript
- **Backend**: Supabase Edge Functions
- **Database**: Supabase (PostgreSQL)
- **Architecture**: Clean Architecture
- **Code Quality**: husky (Git hooks)

## 📁 ディレクトリ構成

```text
Tier-Map-Backend/
├── api-test/                    # API テストスクリプト
│   ├── profile-api.sh
│   ├── rallies-api.sh
│   ├── rally-spots-api.sh
│   └── ratings-api.sh
├── supabase/
│   ├── controller/              # コントローラー層
│   │   ├── ProfilesController.ts
│   │   ├── RalliesController.ts
│   │   ├── RallySpotsController.ts
│   │   └── RatingsController.ts
│   ├── domain/                  # ドメイン層
│   │   ├── profile/
│   │   │   ├── models/
│   │   │   └── repository.ts
│   │   ├── rally/
│   │   │   ├── models/
│   │   │   └── repository.ts
│   │   ├── rallySpot/
│   │   │   ├── models/
│   │   │   └── repository.ts
│   │   ├── rating/
│   │   │   ├── models/
│   │   │   └── repository.ts
│   │   └── spot/
│   │       ├── models/
│   │       └── repository.ts
│   ├── functions/               # Edge Functions エントリーポイント
│   │   ├── profiles/
│   │   │   ├── deno.json
│   │   │   ├── index.ts
│   │   │   └── router/
│   │   └── rallies/
│   │       ├── deno.json
│   │       ├── index.ts
│   │       └── router/
│   ├── infrastructure/          # インフラストラクチャ層
│   │   └── supabase/
│   │       ├── auth.ts
│   │       ├── client.ts
│   │       └── repository/
│   ├── lib/                     # 共通ライブラリ
│   │   ├── config/
│   │   ├── httpResponse.ts
│   │   ├── log.ts
│   │   └── parse.ts
│   └── usecase/                 # ユースケース層
│       ├── profile/
│       ├── rally/
│       ├── rallySpot/
│       ├── rating/
│       └── spot/
├── commitlint.config.js
├── package.json
└── README.md
```

## 🗄️ データベース設計

### テーブル一覧

#### users

認証ユーザー情報(Supabase Auth管理)

| Column | Type   | Key |
| ------ | ------ | --- |
| id     | uuid   | PK  |
| mail   | email  |     |
| pass   | string |     |

#### Profiles

ユーザープロフィール

| Column     | Type               | Key |
| ---------- | ------------------ | --- |
| id         | INT auto increment | PK  |
| user_id    | uuid unique        | FK  |
| name       | string             |     |
| created_at | timestamp          |     |
| updated_at | timestamp          |     |

#### Rallies

スタンプラリー

| Column     | Type               | Key |
| ---------- | ------------------ | --- |
| id         | INT auto increment | PK  |
| profile_id | INT                | FK  |
| name       | string             |     |
| genre      | string             |     |
| created_at | timestamp          |     |
| updated_at | timestamp          |     |

#### Spots

訪問スポット

| Column     | Type      | Key |
| ---------- | --------- | --- |
| id         | string    | PK  |
| name       | string    |     |
| created_at | timestamp |     |
| updated_at | timestamp |     |

#### rallySpots

ラリーとスポットの中間テーブル

| Column     | Type               | Key |
| ---------- | ------------------ | --- |
| id         | INT auto increment | PK  |
| rally_id   | INT                | FK  |
| spot_id    | string             | FK  |
| order_no   | INT                |     |
| created_at | timestamp          |     |
| updated_at | timestamp          |     |

#### Ratings

スポット評価

| Column        | Type               | Key |
| ------------- | ------------------ | --- |
| id            | INT auto increment | PK  |
| rally_spot_id | INT unique         | FK  |
| stars         | INT                |     |
| memo          | string             |     |
| created_at    | timestamp          |     |
| updated_at    | timestamp          |     |

## 📚 API ドキュメント

詳細なAPI仕様については [API.md](./API.md) を参照してください。

### エンドポイント一覧

| メソッド | パス                                             | 説明                   |
| -------- | ------------------------------------------------ | ---------------------- |
| GET      | /functions/v1/profiles/                          | プロフィール取得       |
| PATCH    | /functions/v1/profiles/                          | プロフィール更新       |
| GET      | /functions/v1/rallies/                           | ラリー一覧取得         |
| POST     | /functions/v1/rallies/                           | ラリー作成             |
| GET      | /functions/v1/rallies/:rally_id/                 | ラリー詳細取得         |
| PATCH    | /functions/v1/rallies/:rally_id/                 | ラリー更新             |
| GET      | /functions/v1/rallies/:rally_id/spots            | ラリースポット一覧取得 |
| POST     | /functions/v1/rallies/:rally_id/spots            | ラリースポット登録     |
| GET      | /functions/v1/rallies/:rally_id/spots/:spot_id   | ラリースポット詳細取得 |
| GET      | /functions/v1/rallies/:rally_id/ratings          | 評価一覧取得           |
| POST     | /functions/v1/rallies/:rally_id/ratings/         | 評価作成               |
| GET      | /functions/v1/rallies/:rally_id/ratings/:spot_id | 評価詳細取得           |

## 🚀 セットアップ

詳細なセットアップ手順については [SETUP.md](./SETUP.md) を参照してください。

### 前提条件

- Deno 1.x以上
- Supabase CLIのインストール
- Supabaseプロジェクト

### クイックスタート

#### 1. リポジトリのクローン

```bash
git clone https://github.com/RTP-RagToPent/Tier-Map-Backend.git
cd Tier-Map-Backend
```

#### 2. 環境変数の設定

```bash
cd supabase
cp .env.example .env.local
# .env.local を編集して必要な環境変数を設定
```

#### 3. Supabase ローカル開発環境の起動

```bash
cd supabase
supabase functions serve --env-file .env.local
```

## 🧪 テスト

API テストスクリプトを使用してエンドポイントをテストできます：

```bash
# プロフィールAPIのテスト
./api-test/profile-api.sh

# ラリーAPIのテスト
./api-test/rallies-api.sh

# スポットAPIのテスト
./api-test/rally-spots-api.sh

# 評価APIのテスト
./api-test/ratings-api.sh
```

## 📝 コーディング規約

- TypeScriptの厳密な型チェックを使用
- Clean Architectureの原則に従う
- コミットメッセージは[Conventional Commits](https://www.conventionalcommits.org/)形式を推奨
- huskyによるコミット前のリントチェックを実施

## 📄 ライセンス

このプロジェクトは [LICENSE](./LICENSE)
ファイルに記載されたライセンスの下で公開されています。
