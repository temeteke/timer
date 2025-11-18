import type { INotificationService } from '../NotificationService'

/**
 * テスト用の通知サービスモック
 */
export class MockNotificationService implements INotificationService {
  private _supported = true
  private _permission: NotificationPermission = 'default'
  private _sentNotifications: Array<{
    title: string
    options?: NotificationOptions
    timestamp: Date
  }> = []

  /**
   * サポート状態を設定（テスト用）
   */
  setSupported(supported: boolean): void {
    this._supported = supported
  }

  /**
   * 許可状態を設定（テスト用）
   */
  setPermission(permission: NotificationPermission): void {
    this._permission = permission
  }

  /**
   * 許可が得られているか設定（テスト用）
   */
  setPermissionGranted(granted: boolean): void {
    this._permission = granted ? 'granted' : 'denied'
  }

  /**
   * 送信された通知の一覧を取得（テスト用）
   */
  getSentNotifications() {
    return this._sentNotifications
  }

  /**
   * 送信された通知をクリア（テスト用）
   */
  clearSentNotifications(): void {
    this._sentNotifications = []
  }

  /**
   * 最後に送信された通知を取得（テスト用）
   */
  getLastNotification() {
    return this._sentNotifications[this._sentNotifications.length - 1] || null
  }

  // INotificationServiceの実装

  isSupported(): boolean {
    return this._supported
  }

  getPermission(): NotificationPermission | null {
    if (!this._supported) return null
    return this._permission
  }

  isPermissionGranted(): boolean {
    return this._permission === 'granted'
  }

  async requestPermission(): Promise<boolean> {
    if (!this._supported) return false
    if (this._permission === 'denied') return false

    // テストでは自動的にgrantedに設定
    this._permission = 'granted'
    return true
  }

  sendNotification(title: string, options?: NotificationOptions): void {
    if (!this.isPermissionGranted()) {
      console.warn('Notification permission not granted')
      return
    }

    this._sentNotifications.push({
      title,
      options,
      timestamp: new Date()
    })
  }
}
