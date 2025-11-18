/**
 * ブラウザ通知を管理するComposable
 * Notification APIを使用してタイマー完了時に通知
 */

import type { INotificationService } from '~/services/NotificationService'
import { BrowserNotificationService } from '~/services/NotificationService'

export const useNotification = (
  notificationService?: INotificationService
) => {
  const { settings } = useTimerSettings()

  // サービスが提供されていない場合は、デフォルトのブラウザ実装を使用
  const service = notificationService || (process.client ? new BrowserNotificationService(
    () => settings.value.soundEnabled,
    () => settings.value.vibrationEnabled
  ) : null)

  // 通知の許可状態
  const permissionGranted = ref(false)

  /**
   * 通知の許可をリクエスト
   */
  const requestPermission = async () => {
    if (!process.client || !service) return false

    const granted = await service.requestPermission()
    permissionGranted.value = granted
    return granted
  }

  /**
   * 通知を送信
   */
  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (!process.client || !service) return

    service.sendNotification(title, options)
  }

  /**
   * タイマー完了通知を送信
   */
  const notifyTimerComplete = (message?: string) => {
    sendNotification('タイマー終了！', {
      body: message || '設定した時間が経過しました。',
      icon: '/timer/icon-192x192.png'
    })
  }

  /**
   * 初期化時に許可状態をチェック
   */
  const checkPermission = () => {
    if (!process.client || !service) return

    permissionGranted.value = service.isPermissionGranted()
  }

  // クライアント側でマウント時にチェック
  if (process.client) {
    onMounted(() => {
      checkPermission()
    })
  }

  return {
    permissionGranted: readonly(permissionGranted),
    requestPermission,
    sendNotification,
    notifyTimerComplete,
    checkPermission
  }
}
