# Timer

シンプルで使いやすいタイマーアプリケーション

Nuxt 3 + Vuetify 3で構築されたモダンなPWA（Progressive Web App）対応のタイマーアプリです。

## 特徴

- ⏱️ **カウントダウンタイマー** - 設定した時間までカウントダウン
- ⏲️ **カウントアップタイマー** - ストップウォッチ機能
- 🎯 **プリセット時間** - よく使う時間をワンタップで設定（1分、3分、5分、10分）
- 🔔 **通知機能** - タイマー完了時のブラウザ通知
- 🔊 **サウンド** - Web Audio APIによるビープ音
- 📱 **バイブレーション** - モバイル端末での振動通知
- 💾 **設定の永続化** - LocalStorageで設定を保存
- 🌓 **レスポンシブデザイン** - PC・タブレット・スマホ対応
- 📲 **PWA対応** - ホーム画面に追加してアプリのように使用可能
- 🔌 **オフライン対応** - Service Workerによるオフライン動作
- 🎛️ **複数タイマー管理** - 複数のタイマーを同時に作成・管理・切り替え
- ⌨️ **キーボードショートカット** - キーボードで素早く操作

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

# 静的サイト生成
npm run generate

# ビルド後のプレビュー
npm run preview
```

## 使い方

### 複数タイマー管理

複数のタイマーを作成して同時に管理できます：

1. **タイマーの追加**: タブの右端にある「+」ボタンをクリック
2. **タイマーの切り替え**: タブをクリックして切り替え
3. **タイマーの削除**: タブの「×」ボタンをクリック（最後のタイマーは削除不可）
4. **タイマーのラベル編集**: タブをダブルクリック（将来実装予定）

各タイマーは独立して動作し、設定は自動的に保存されます。

### キーボードショートカット

効率的な操作のために、以下のキーボードショートカットが利用できます：

#### タイマー操作
- `Space` - タイマーを開始/一時停止
- `R` - タイマーをリセット

#### タイマー管理
- `N` - 新しいタイマーを追加
- `Tab` - 次のタイマーに切り替え
- `Shift + Tab` - 前のタイマーに切り替え

#### プリセット選択
- `1` - プリセット1を選択（1分）
- `2` - プリセット2を選択（3分）
- `3` - プリセット3を選択（5分）
- `4` - プリセット4を選択（10分）

#### その他
- `?` - キーボードショートカット一覧を表示

ヘッダーのキーボードアイコンをクリックしても、ショートカット一覧を確認できます。

## プロジェクト構造

```
timer/
├── .github/workflows/    # GitHub Actions設定
├── components/           # Vueコンポーネント
│   ├── timer/           # タイマー関連コンポーネント
│   │   ├── TimerDisplay.vue      # タイマー表示
│   │   ├── TimerControls.vue     # タイマー操作
│   │   ├── TimerPresets.vue      # プリセット選択
│   │   └── TimerTabs.vue         # タイマータブ（複数タイマー切り替え）
│   ├── settings/        # 設定コンポーネント
│   │   └── SettingsPanel.vue     # 設定パネル
│   └── common/          # 共通コンポーネント
│       └── KeyboardShortcutsHelp.vue  # キーボードショートカットヘルプ
├── composables/         # Composable関数
│   ├── useTimer.ts      # タイマーロジック（レガシー）
│   ├── useTimers.ts     # 複数タイマー管理
│   ├── useTimerSettings.ts  # 設定管理
│   ├── useNotification.ts   # 通知機能
│   ├── useSound.ts      # サウンド再生
│   └── useKeyboardShortcuts.ts  # キーボードショートカット
├── types/               # 型定義
│   └── timer.ts         # タイマー関連の型
├── pages/               # ページコンポーネント
├── public/              # 静的ファイル
│   └── icons/           # PWAアイコン
├── plugins/             # Nuxtプラグイン
└── nuxt.config.ts       # Nuxt設定
```

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
