# GitHub Pagesへのデプロイ手順

このドキュメントでは、タイマーアプリをGitHub Pagesにデプロイする方法を説明します。

## 前提条件

- GitHubアカウント
- このリポジトリへのプッシュ権限

## デプロイ手順

### 1. リポジトリの準備

リポジトリがGitHub上に存在することを確認してください。

### 2. GitHub Pagesの有効化

1. GitHubリポジトリページにアクセス
2. `Settings` タブをクリック
3. 左サイドバーの `Pages` をクリック
4. **Source** セクションで以下を設定：
   - Source: `GitHub Actions` を選択

### 3. アイコンの準備（オプションだが推奨）

PWAアイコンのプレースホルダーをPNG画像に置き換えることを推奨します：

1. `public/icon.svg` を PNG に変換
2. 以下のファイルを作成：
   - `public/icon-192x192.png` (192x192px)
   - `public/icon-512x512.png` (512x512px)

#### 変換方法

**オンラインツールを使用:**
- https://cloudconvert.com/svg-to-png
- https://svgtopng.com/

**ImageMagickを使用（コマンドライン）:**
```bash
# 192x192
convert -background none -size 192x192 public/icon.svg public/icon-192x192.png

# 512x512
convert -background none -size 512x512 public/icon.svg public/icon-512x512.png
```

### 4. mainブランチへのマージ

デプロイは `main` ブランチへのプッシュ時に自動的に実行されます。

```bash
# 現在のブランチからmainブランチへマージ
git checkout main
git merge your-feature-branch
git push origin main
```

### 5. デプロイの確認

1. GitHubリポジトリの `Actions` タブを開く
2. 最新のワークフロー実行を確認
3. 緑色のチェックマークが表示されれば成功
4. デプロイされたサイトにアクセス：
   ```
   https://[username].github.io/timer/
   ```

## GitHub Actionsワークフロー

デプロイは `.github/workflows/deploy.yml` で定義されています。

### ワークフローの内容

- **トリガー**: `main` ブランチへのプッシュ
- **ビルド**: `npm run generate` で静的サイトを生成
- **デプロイ**: GitHub Pagesにアップロード

### 手動デプロイ

GitHubリポジトリの `Actions` タブから手動でワークフローを実行することもできます：

1. `Actions` タブを開く
2. 左サイドバーで `Deploy to GitHub Pages` を選択
3. `Run workflow` ボタンをクリック
4. ブランチを選択して `Run workflow` を実行

## ローカルでのプレビュー

デプロイ前にローカルでビルドをテストできます：

```bash
# 静的サイトを生成
npm run generate

# 生成されたサイトをプレビュー
npx serve .output/public
```

ブラウザで `http://localhost:3000` を開いて確認してください。

## トラブルシューティング

### デプロイが失敗する

1. `Actions` タブでエラーログを確認
2. `npm run generate` がローカルで成功するか確認
3. リポジトリの権限設定を確認

### ページが404エラーになる

1. `Settings > Pages` で正しいソースが選択されているか確認
2. `nuxt.config.ts` の `baseURL` がリポジトリ名と一致しているか確認
3. デプロイが完了するまで数分待つ

### アイコンが表示されない

1. PNG画像が正しく生成されているか確認
2. ファイル名が `icon-192x192.png` と `icon-512x512.png` であることを確認
3. ブラウザのキャッシュをクリア

### PWAとして動作しない

1. HTTPSでアクセスしているか確認（GitHub PagesはHTTPS）
2. Service Workerが登録されているかDevToolsで確認
3. Manifestファイルが正しく読み込まれているか確認

## カスタムドメインの設定（オプション）

独自ドメインを使用する場合：

1. `Settings > Pages` の `Custom domain` に独自ドメインを入力
2. DNSプロバイダーでCNAMEレコードを設定：
   ```
   www.yourdomain.com → [username].github.io
   ```
3. `public/CNAME` ファイルを作成し、ドメイン名を記述

## 更新方法

アプリを更新する場合：

1. コードを変更
2. `main` ブランチにプッシュ
3. GitHub Actionsが自動的に再デプロイ

通常、デプロイは2〜3分で完了します。

## 参考リンク

- [Nuxt Deployment - Static Hosting](https://nuxt.com/docs/getting-started/deployment#static-hosting)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
