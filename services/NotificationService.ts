/**
 * 通知サービスのインターフェース
 */
export interface INotificationService {
  /**
   * 通知の許可をリクエスト
   */
  requestPermission(): Promise<boolean>

  /**
   * 通知を送信
   */
  sendNotification(title: string, options?: NotificationOptions): void

  /**
   * 通知の許可が得られているか
   */
  isPermissionGranted(): boolean

  /**
   * 通知APIがサポートされているか
   */
  isSupported(): boolean

  /**
   * 現在の許可状態を取得
   */
  getPermission(): NotificationPermission | null
}

/**
 * ブラウザの通知API実装
 */
export class BrowserNotificationService implements INotificationService {
  private soundEnabled: () => boolean
  private vibrationEnabled: () => boolean

  constructor(
    soundEnabled: () => boolean,
    vibrationEnabled: () => boolean
  ) {
    this.soundEnabled = soundEnabled
    this.vibrationEnabled = vibrationEnabled
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window
  }

  getPermission(): NotificationPermission | null {
    if (!this.isSupported()) return null
    return Notification.permission
  }

  isPermissionGranted(): boolean {
    return this.getPermission() === 'granted'
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      console.warn('This browser does not support notifications')
      return false
    }

    // 既に許可されている場合
    if (this.isPermissionGranted()) {
      return true
    }

    // 拒否されている場合
    if (Notification.permission === 'denied') {
      return false
    }

    // 許可をリクエスト
    try {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      return false
    }
  }

  sendNotification(title: string, options?: NotificationOptions): void {
    // 通知が無効の場合は送信しない
    if (!this.soundEnabled()) return

    // 通知の許可がない場合
    if (!this.isPermissionGranted()) {
      console.warn('Notification permission not granted')
      return
    }

    try {
      const defaultOptions: NotificationOptions = {
        icon: '/timer/icon-192x192.png',
        badge: '/timer/icon-192x192.png',
        vibrate: this.vibrationEnabled() ? [200, 100, 200] : undefined,
        requireInteraction: true,
        tag: 'timer-complete',
        ...options
      }

      const notification = new Notification(title, defaultOptions)

      // 通知をクリックした時の処理
      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      // 一定時間後に自動で閉じる
      setTimeout(() => {
        notification.close()
      }, 10000)
    } catch (error) {
      console.error('Failed to send notification:', error)
    }
  }
}
