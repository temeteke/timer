# テストガイド

## 概要

このプロジェクトでは、Vitestを使用してユニットテストと統合テストを実行します。特に通知機能（Notification API）のテストが可能になっています。

## テストの実行

```bash
# 全てのテストを実行（ウォッチモード）
npm test

# テストを一度だけ実行
npm run test:run

# UIモードでテストを実行
npm run test:ui

# カバレッジレポートを生成
npm run test:coverage
```

## 通知機能のテスト

### 基本的な使い方

通知機能のテストには `MockNotificationService` を使用します：

```typescript
import { MockNotificationService } from '~/services/__mocks__/NotificationService'
import { useNotification } from '~/composables/useNotification'

describe('My Test', () => {
  let mockService: MockNotificationService

  beforeEach(() => {
    mockService = new MockNotificationService()
    mockService.setPermissionGranted(true)
  })

  it('should send notification', () => {
    const { notifyTimerComplete } = useNotification(mockService)

    notifyTimerComplete('テストメッセージ')

    const notifications = mockService.getSentNotifications()
    expect(notifications).toHaveLength(1)
    expect(notifications[0].options?.body).toBe('テストメッセージ')
  })
})
```

### MockNotificationServiceのAPI

#### セットアップメソッド

- `setSupported(supported: boolean)` - 通知APIのサポート状態を設定
- `setPermission(permission: NotificationPermission)` - 許可状態を設定（'default' | 'granted' | 'denied'）
- `setPermissionGranted(granted: boolean)` - 許可状態を簡単に設定（trueで'granted'、falseで'denied'）

#### 検証メソッド

- `getSentNotifications()` - 送信された全ての通知を取得
- `getLastNotification()` - 最後に送信された通知を取得
- `clearSentNotifications()` - 送信された通知をクリア

#### 通知サービスインターフェース

- `isSupported()` - 通知APIがサポートされているか確認
- `getPermission()` - 現在の許可状態を取得
- `isPermissionGranted()` - 許可が得られているか確認
- `requestPermission()` - 許可をリクエスト
- `sendNotification(title, options)` - 通知を送信

## テストの構成

```
tests/
├── setup.ts                           # グローバルなテスト設定
├── services/
│   └── NotificationService.test.ts    # NotificationServiceのユニットテスト
├── composables/
│   └── useNotification.test.ts        # useNotificationのテスト
└── integration/
    └── timer-notification.test.ts     # タイマーと通知の統合テスト
```

## テストの書き方

### 1. 通知の送信をテスト

```typescript
it('should send notification when timer completes', () => {
  mockService.setPermissionGranted(true)
  const { notifyTimerComplete } = useNotification(mockService)

  notifyTimerComplete('タイマー完了')

  const notification = mockService.getLastNotification()
  expect(notification?.title).toBe('タイマー終了！')
  expect(notification?.options?.body).toBe('タイマー完了')
})
```

### 2. 許可のリクエストをテスト

```typescript
it('should request permission', async () => {
  const { requestPermission, permissionGranted } = useNotification(mockService)

  const result = await requestPermission()

  expect(result).toBe(true)
  expect(permissionGranted.value).toBe(true)
})
```

### 3. 許可が拒否された場合をテスト

```typescript
it('should not send notification when permission denied', () => {
  mockService.setPermissionGranted(false)
  const { notifyTimerComplete } = useNotification(mockService)

  notifyTimerComplete('送信されない')

  expect(mockService.getSentNotifications()).toHaveLength(0)
})
```

### 4. 複数の通知をテスト

```typescript
it('should send multiple notifications', () => {
  mockService.setPermissionGranted(true)
  const { notifyTimerComplete } = useNotification(mockService)

  notifyTimerComplete('通知1')
  notifyTimerComplete('通知2')
  notifyTimerComplete('通知3')

  const notifications = mockService.getSentNotifications()
  expect(notifications).toHaveLength(3)
  expect(notifications[0].options?.body).toBe('通知1')
  expect(notifications[1].options?.body).toBe('通知2')
  expect(notifications[2].options?.body).toBe('通知3')
})
```

## テストのベストプラクティス

1. **beforeEach で初期化**: 各テストの前にモックサービスを初期化
2. **明確なテスト名**: テストが何を検証しているか明確に
3. **1つのテストで1つのことを検証**: テストを小さく保つ
4. **エッジケースをテスト**: 空の値、長い文字列、特殊文字などもテスト
5. **統合テストも作成**: 実際の使用シナリオをテスト

## デバッグ

### テストのデバッグ

```bash
# UIモードで実行（推奨）
npm run test:ui
```

### 特定のテストファイルを実行

```bash
npx vitest tests/services/NotificationService.test.ts
```

### 特定のテストケースを実行

```typescript
// テストに .only を追加
it.only('should send notification', () => {
  // このテストだけが実行される
})
```

## カバレッジ

カバレッジレポートを生成するには：

```bash
npm run test:coverage
```

カバレッジレポートは `coverage/` ディレクトリに生成されます。

## トラブルシューティング

### グローバル変数が定義されていないエラー

`tests/setup.ts` でグローバル変数のモックが設定されています。新しいNuxtの自動インポート関数を使用する場合は、setup.tsに追加してください。

### process.client のエラー

テスト環境では `process.client = true` に設定されています。SSRの動作をテストする場合は、個別のテストで設定を変更できます。

## 参考リンク

- [Vitest公式ドキュメント](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Notification API (MDN)](https://developer.mozilla.org/ja/docs/Web/API/Notifications_API)
