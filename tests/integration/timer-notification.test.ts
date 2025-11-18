import { describe, it, expect, beforeEach } from 'vitest'
import { MockNotificationService } from '~/services/__mocks__/NotificationService'
import { useNotification } from '~/composables/useNotification'

/**
 * タイマーと通知の統合テスト例
 * 実際のuseTimerとの統合は、useTimerもテスト可能にする必要がある
 */
describe('Timer and Notification Integration', () => {
  let mockNotificationService: MockNotificationService

  beforeEach(() => {
    mockNotificationService = new MockNotificationService()
    mockNotificationService.setPermissionGranted(true)
  })

  describe('timer completion scenarios', () => {
    it('should send notification when timer completes', () => {
      const { notifyTimerComplete } = useNotification(mockNotificationService)

      // タイマー完了をシミュレート
      notifyTimerComplete('5分のタイマーが完了しました')

      // 通知が送信されたことを確認
      const notifications = mockNotificationService.getSentNotifications()
      expect(notifications).toHaveLength(1)
      expect(notifications[0].title).toBe('タイマー終了！')
      expect(notifications[0].options?.body).toBe('5分のタイマーが完了しました')
    })

    it('should send notification for countdown timer', () => {
      const { notifyTimerComplete } = useNotification(mockNotificationService)

      // カウントダウンタイマーの完了
      notifyTimerComplete('カウントダウン完了')

      const notification = mockNotificationService.getLastNotification()
      expect(notification).not.toBeNull()
      expect(notification?.options?.body).toBe('カウントダウン完了')
    })

    it('should send notification for countup timer', () => {
      const { notifyTimerComplete } = useNotification(mockNotificationService)

      // カウントアップタイマーの完了（目標時間到達）
      notifyTimerComplete('目標時間に到達しました')

      const notification = mockNotificationService.getLastNotification()
      expect(notification).not.toBeNull()
      expect(notification?.options?.body).toBe('目標時間に到達しました')
    })

    it('should handle multiple timer completions', () => {
      const { notifyTimerComplete } = useNotification(mockNotificationService)

      // 複数のタイマーが順次完了する場合
      notifyTimerComplete('タイマー1完了')
      notifyTimerComplete('タイマー2完了')
      notifyTimerComplete('タイマー3完了')

      const notifications = mockNotificationService.getSentNotifications()
      expect(notifications).toHaveLength(3)

      // 各通知のメッセージを確認
      expect(notifications[0].options?.body).toBe('タイマー1完了')
      expect(notifications[1].options?.body).toBe('タイマー2完了')
      expect(notifications[2].options?.body).toBe('タイマー3完了')
    })

    it('should not send notification if permission not granted', () => {
      mockNotificationService.setPermissionGranted(false)
      const { notifyTimerComplete } = useNotification(mockNotificationService)

      notifyTimerComplete('このメッセージは送信されない')

      expect(mockNotificationService.getSentNotifications()).toHaveLength(0)
    })

    it('should include correct icon for timer notifications', () => {
      const { notifyTimerComplete } = useNotification(mockNotificationService)

      notifyTimerComplete()

      const notification = mockNotificationService.getLastNotification()
      expect(notification?.options?.icon).toBe('/timer/icon-192x192.png')
    })
  })

  describe('permission flow with timer', () => {
    it('should request permission before first timer notification', async () => {
      const { requestPermission, notifyTimerComplete } = useNotification(mockNotificationService)

      // 許可をリクエスト（実際のアプリではユーザーがボタンをクリック）
      const granted = await requestPermission()
      expect(granted).toBe(true)

      // タイマー完了後に通知
      notifyTimerComplete('初回のタイマー完了')

      const notifications = mockNotificationService.getSentNotifications()
      expect(notifications).toHaveLength(1)
    })

    it('should not send notification if user denies permission', async () => {
      mockNotificationService.setPermission('denied')
      const { requestPermission, notifyTimerComplete } = useNotification(mockNotificationService)

      const granted = await requestPermission()
      expect(granted).toBe(false)

      notifyTimerComplete('このメッセージは表示されない')

      expect(mockNotificationService.getSentNotifications()).toHaveLength(0)
    })
  })

  describe('edge cases', () => {
    it('should handle empty message gracefully', () => {
      const { notifyTimerComplete } = useNotification(mockNotificationService)

      // 空文字列を渡すと、デフォルトメッセージが使用される
      notifyTimerComplete('')

      const notification = mockNotificationService.getLastNotification()
      expect(notification?.options?.body).toBe('設定した時間が経過しました。')
    })

    it('should handle very long messages', () => {
      const { notifyTimerComplete } = useNotification(mockNotificationService)

      const longMessage = 'A'.repeat(1000)
      notifyTimerComplete(longMessage)

      const notification = mockNotificationService.getLastNotification()
      expect(notification?.options?.body).toBe(longMessage)
    })

    it('should handle special characters in messages', () => {
      const { notifyTimerComplete } = useNotification(mockNotificationService)

      notifyTimerComplete('特殊文字: 🎉 ⏰ ✅')

      const notification = mockNotificationService.getLastNotification()
      expect(notification?.options?.body).toBe('特殊文字: 🎉 ⏰ ✅')
    })
  })
})
