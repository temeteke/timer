# Timer

シンプルで使いやすいタイマーアプリケーション

Nuxt 3 + Vuetify 3で構築されたモダンなPWA（Progressive Web App）対応のタイマーアプリです。

## 特徴

- ⏱️ **カウントダウンタイマー** - 設定した時間までカウントダウン
- ⏲️ **カウントアップタイマー** - ストップウォッチ機能
- 🎯 **プリセット時間** - よく使う時間をワンタップで設定（1分、3分、5分、10分、25分）
- 🔔 **通知機能** - タイマー完了時のブラウザ通知
- 🔊 **サウンド** - Web Audio APIによるビープ音（カスタムサウンド対応）
- 📱 **バイブレーション** - モバイル端末での振動通知
- 💾 **設定の永続化** - LocalStorageで設定を保存
- 🌓 **レスポンシブデザイン** - PC・タブレット・スマホ対応
- 📲 **PWA対応** - ホーム画面に追加してアプリのように使用可能
- 🔌 **オフライン対応** - Service Workerによるオフライン動作

## デモ

https://temeteke.github.io/timer/

## 技術スタック

- **フレームワーク**: [Nuxt 3](https://nuxt.com/) (Vue 3)
- **UIライブラリ**: [Vuetify 3](https://vuetifyjs.com/)
- **状態管理**: Nuxt 3の`useState` Composables
- **PWA**: [@vite-pwa/nuxt](https://vite-pwa-org.netlify.app/)
- **言語**: TypeScript
- **パッケージマネージャー**: npm

## セットアップ

### 前提条件

- Node.js 18.x以上
- npm

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/temeteke/timer.git
cd timer

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで `http://localhost:3000` を開いてアプリにアクセスできます。

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# 静的サイト生成（GitHub Pages用）
npm run generate

# ビルド後のプレビュー
npm run preview
```

## デプロイ

GitHub Pagesへのデプロイ手順は [DEPLOY.md](./DEPLOY.md) を参照してください。

### クイックデプロイ

1. `main` ブランチにプッシュ
2. GitHub Actionsが自動的にビルド＆デプロイ
3. `https://temeteke.github.io/timer/` でアクセス可能

## プロジェクト構造

```
timer/
├── .github/workflows/    # GitHub Actions設定
├── components/           # Vueコンポーネント
│   ├── timer/           # タイマー関連コンポーネント
│   ├── settings/        # 設定コンポーネント
│   └── common/          # 共通コンポーネント
├── composables/         # Composable関数
│   ├── useTimer.ts      # タイマーロジック
│   ├── useTimerSettings.ts  # 設定管理
│   ├── useNotification.ts   # 通知機能
│   └── useSound.ts      # サウンド再生
├── pages/               # ページコンポーネント
├── public/              # 静的ファイル
│   ├── sounds/          # サウンドファイル
│   └── icons/           # PWAアイコン
├── plugins/             # Nuxtプラグイン
└── nuxt.config.ts       # Nuxt設定
```

## カスタマイズ

### サウンドファイルの追加

`public/sounds/` ディレクトリにMP3ファイルを追加できます。詳細は `public/sounds/README.md` を参照してください。

### PWAアイコンのカスタマイズ

`public/icon.svg` を編集して、独自のアイコンを作成できます。詳細は `public/icons/README.md` を参照してください。

## ブラウザサポート

- Chrome / Edge (最新版)
- Firefox (最新版)
- Safari (最新版)
- モバイルブラウザ

PWA機能は対応ブラウザでのみ動作します。

## ライセンス

MIT

## 作者

Built with Nuxt 3 + Vuetify 3
