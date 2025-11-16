/**
 * ブラウザ通知を管理するComposable
 * Notification APIを使用してタイマー完了時に通知
 */

export const useNotification = () => {
  const { settings } = useTimerSettings()

  // 通知の許可状態
  const permissionGranted = ref(false)

  /**
   * 通知の許可をリクエスト
   */
  const requestPermission = async () => {
    if (!process.client) return false

    // Notification APIが利用可能かチェック
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return false
    }

    // 既に許可されている場合
    if (Notification.permission === 'granted') {
      permissionGranted.value = true
      return true
    }

    // 拒否されている場合
    if (Notification.permission === 'denied') {
      permissionGranted.value = false
      return false
    }

    // 許可をリクエスト
    try {
      const permission = await Notification.requestPermission()
      permissionGranted.value = permission === 'granted'
      return permissionGranted.value
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      return false
    }
  }

  /**
   * 通知を送信
   */
  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (!process.client) return

    // 通知が無効の場合は送信しない
    if (!settings.value.soundEnabled) return

    // 通知の許可がない場合
    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted')
      return
    }

    try {
      const defaultOptions: NotificationOptions = {
        icon: '/timer/icon-192x192.png',
        badge: '/timer/icon-192x192.png',
        vibrate: settings.value.vibrationEnabled ? [200, 100, 200] : undefined,
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
    if (!process.client) return

    if ('Notification' in window) {
      permissionGranted.value = Notification.permission === 'granted'
    }
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
