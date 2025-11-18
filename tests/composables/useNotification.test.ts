import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MockNotificationService } from '~/services/__mocks__/NotificationService'

// useNotificationをテストするために、必要なグローバルモックを設定
const mockSettings = {
  soundEnabled: true,
  vibrationEnabled: true,
  volume: 50
}

const mockUseTimerSettings = vi.fn(() => ({
  settings: {
    value: mockSettings
  }
}))

// グローバルに設定
global.useTimerSettings = mockUseTimerSettings

// useNotificationをインポート
import { useNotification } from '~/composables/useNotification'

describe('useNotification', () => {
  let mockService: MockNotificationService

  beforeEach(() => {
    mockService = new MockNotificationService()
    mockSettings.soundEnabled = true
    mockSettings.vibrationEnabled = true
  })

  describe('requestPermission', () => {
    it('should request permission from service', async () => {
      const { requestPermission } = useNotification(mockService)

      const result = await requestPermission()

      expect(result).toBe(true)
      expect(mockService.isPermissionGranted()).toBe(true)
    })

    it('should update permissionGranted state', async () => {
      const { requestPermission, permissionGranted } = useNotification(mockService)

      await requestPermission()

      expect(permissionGranted.value).toBe(true)
    })

    it('should return false when permission denied', async () => {
      mockService.setPermission('denied')
      const { requestPermission, permissionGranted } = useNotification(mockService)

      const result = await requestPermission()

      expect(result).toBe(false)
      expect(permissionGranted.value).toBe(false)
    })

    it('should return false when not supported', async () => {
      mockService.setSupported(false)
      const { requestPermission } = useNotification(mockService)

      const result = await requestPermission()

      expect(result).toBe(false)
    })
  })

  describe('sendNotification', () => {
    beforeEach(() => {
      mockService.setPermissionGranted(true)
    })

    it('should send notification with title and options', () => {
      const { sendNotification } = useNotification(mockService)

      sendNotification('Test Title', { body: 'Test Body' })

      const notifications = mockService.getSentNotifications()
      expect(notifications).toHaveLength(1)
      expect(notifications[0].title).toBe('Test Title')
      expect(notifications[0].options?.body).toBe('Test Body')
    })

    it('should not send when permission not granted', () => {
      mockService.setPermissionGranted(false)
      const { sendNotification } = useNotification(mockService)

      sendNotification('Test')

      expect(mockService.getSentNotifications()).toHaveLength(0)
    })
  })

  describe('notifyTimerComplete', () => {
    beforeEach(() => {
      mockService.setPermissionGranted(true)
    })

    it('should send timer complete notification with default message', () => {
      const { notifyTimerComplete } = useNotification(mockService)

      notifyTimerComplete()

      const notification = mockService.getLastNotification()
      expect(notification?.title).toBe('タイマー終了！')
      expect(notification?.options?.body).toBe('設定した時間が経過しました。')
    })

    it('should send timer complete notification with custom message', () => {
      const { notifyTimerComplete } = useNotification(mockService)

      notifyTimerComplete('カスタムメッセージ')

      const notification = mockService.getLastNotification()
      expect(notification?.title).toBe('タイマー終了！')
      expect(notification?.options?.body).toBe('カスタムメッセージ')
    })

    it('should include icon in notification', () => {
      const { notifyTimerComplete } = useNotification(mockService)

      notifyTimerComplete()

      const notification = mockService.getLastNotification()
      expect(notification?.options?.icon).toBe('/timer/icon-192x192.png')
    })
  })

  describe('checkPermission', () => {
    it('should check permission from service', () => {
      mockService.setPermissionGranted(true)
      const { checkPermission, permissionGranted } = useNotification(mockService)

      checkPermission()

      expect(permissionGranted.value).toBe(true)
    })

    it('should update state when permission not granted', () => {
      mockService.setPermissionGranted(false)
      const { checkPermission, permissionGranted } = useNotification(mockService)

      checkPermission()

      expect(permissionGranted.value).toBe(false)
    })
  })

  describe('integration scenarios', () => {
    it('should handle complete notification flow', async () => {
      const { requestPermission, notifyTimerComplete } = useNotification(mockService)

      // 1. 許可をリクエスト
      const granted = await requestPermission()
      expect(granted).toBe(true)

      // 2. 通知を送信
      notifyTimerComplete('テストが完了しました')

      // 3. 通知が送信されたことを確認
      const notifications = mockService.getSentNotifications()
      expect(notifications).toHaveLength(1)
      expect(notifications[0].options?.body).toBe('テストが完了しました')
    })

    it('should not send notification before requesting permission', () => {
      const { notifyTimerComplete } = useNotification(mockService)

      notifyTimerComplete()

      expect(mockService.getSentNotifications()).toHaveLength(0)
    })

    it('should send multiple notifications', async () => {
      const { requestPermission, notifyTimerComplete } = useNotification(mockService)

      await requestPermission()

      notifyTimerComplete('通知1')
      notifyTimerComplete('通知2')
      notifyTimerComplete('通知3')

      const notifications = mockService.getSentNotifications()
      expect(notifications).toHaveLength(3)
    })
  })

  describe('readonly state', () => {
    it('should expose permissionGranted as readonly', () => {
      const { permissionGranted } = useNotification(mockService)

      // readonly refであることを確認（値は読み取れる）
      expect(permissionGranted.value).toBeDefined()
    })
  })
})
