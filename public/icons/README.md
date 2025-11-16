# PWA アイコン

このディレクトリにはPWA（Progressive Web App）用のアイコンを配置します。

## 必要なファイル

以下のアイコンファイルを追加してください：

### 基本アイコン
- `icon-192x192.png` - Android用標準アイコン（必須）
- `icon-512x512.png` - Android用大サイズアイコン（必須）
- `icon-maskable-192x192.png` - マスカブルアイコン（推奨）
- `icon-maskable-512x512.png` - マスカブルアイコン大（推奨）

### Apple用アイコン（オプション）
- `apple-touch-icon.png` - 180x180px

### Favicon
- `favicon.ico` - ブラウザタブ用（ルートディレクトリに配置）

## アイコンの作成方法

### 1. デザインツールで作成
- Figma
- Adobe Illustrator
- Canva
- Inkscape（無料）

### 2. オンラインジェネレーターを使用
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/
- https://favicon.io/

### 3. アイコンの要件
- **サイズ**: 192x192px と 512x512px
- **フォーマット**: PNG（透過背景推奨）
- **セーフゾーン**: マスカブルアイコンは中央80%にコンテンツを配置
- **テーマ**: タイマーをイメージするデザイン
  - 時計のアイコン
  - ストップウォッチ
  - 砂時計
  - などが適切

### 4. デザインのヒント
- シンプルで認識しやすいデザイン
- 小さいサイズでも見やすいこと
- ブランドカラー（プライマリーカラー）を使用
- 背景色は白または透過

## 簡易的な代替方法

アイコンが用意できない場合、以下の方法で一時的に対応できます：

1. **Material Design Iconsを使用**
   - mdi-timer-outline のアイコンをSVGでエクスポート
   - PNG形式に変換して使用

2. **テキストベースのアイコン**
   - 背景色にプライマリーカラー
   - 「T」や「⏱」などの文字を配置

3. **オンラインツールで自動生成**
   - 上記のジェネレーターツールを使用

## nuxt.config.ts での設定

アイコンを追加したら、nuxt.config.tsのPWA設定を確認してください：

```typescript
pwa: {
  manifest: {
    icons: [
      {
        src: '/timer/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/timer/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  }
}
```
