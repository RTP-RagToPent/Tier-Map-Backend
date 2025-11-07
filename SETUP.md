# Tier-Map-Backend

このプロジェクトはSupabaseを使用したバックエンドアプリケーションです。

## ローカル開発環境のセットアップ

### 1. Supabase CLIのインストール

macOSの場合：

```bash
brew install supabase/tap/supabase
```

### 2. プロジェクトのクローンと依存関係のインストール

```bash
git clone https://github.com/RTP-RagToPent/Tier-Map-Backend.git
cd Tier-Map-Backend
```

### 3. Supabaseプロジェクトのリンク

まず、Supabase CLIにログインします：

```bash
supabase login
```

次に、既存のSupabaseプロジェクトとリンクします：

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### 4. データベーススキーマのダンプ

リモートのデータベーススキーマをローカルファイルにダンプします：

```bash
supabase db dump --file schema.sql --linked
```

### 5. ローカルSupabaseの起動

Dockerを使ってローカルSupabaseインスタンスを起動します：

```bash
supabase start
```

このコマンドは以下のサービスを起動します：

- PostgreSQLデータベース (ポート: 54322)
- Supabase Studio (ポート: 54323)
- API Gateway (ポート: 54321)

### 6. スキーマの適用

ダンプしたスキーマをローカルデータベースに適用します：

```bash
psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -f schema.sql
```

パスワードを求められた時には「**postgres**」と入力してください

### 7. 環境変数の設定

ローカル開発時は、以下の環境変数を`.env.local`に設定してください：

```env
# Frontend Base URL
FRONTEND_BASE_URL=__REPLACE_FRONTEND_BASE_URL__

# ENV
ENV=development
```

### 8. edge functionをローカルで起動

edge functionをローカルで起動します。

```bash
supabase functions serve --env-file .env.local
```

### 9. 開発環境の確認

ブラウザで以下のURLにアクセスして、Supabase
Studioが正常に動作していることを確認します：

```text
http://localhost:54323
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。
