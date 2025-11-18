import { describe, it, expect, beforeEach, vi } from 'vitest'
import { BrowserNotificationService } from '~/services/NotificationService'
import { MockNotificationService } from '~/services/__mocks__/NotificationService'

describe('MockNotificationService', () => {
  let service: MockNotificationService

  beforeEach(() => {
    service = new MockNotificationService()
  })

  describe('isSupported', () => {
    it('should return true by default', () => {
      expect(service.isSupported()).toBe(true)
    })

    it('should return false when set to unsupported', () => {
      service.setSupported(false)
      expect(service.isSupported()).toBe(false)
    })
  })

  describe('permission management', () => {
    it('should have default permission', () => {
      expect(service.getPermission()).toBe('default')
      expect(service.isPermissionGranted()).toBe(false)
    })

    it('should set permission to granted', () => {
      service.setPermissionGranted(true)
      expect(service.getPermission()).toBe('granted')
      expect(service.isPermissionGranted()).toBe(true)
    })

    it('should set permission to denied', () => {
      service.setPermissionGranted(false)
      expect(service.getPermission()).toBe('denied')
      expect(service.isPermissionGranted()).toBe(false)
    })

    it('should return null permission when unsupported', () => {
      service.setSupported(false)
      expect(service.getPermission()).toBeNull()
    })
  })

  describe('requestPermission', () => {
    it('should return false when unsupported', async () => {
      service.setSupported(false)
      const result = await service.requestPermission()
      expect(result).toBe(false)
    })

    it('should return false when denied', async () => {
      service.setPermission('denied')
      const result = await service.requestPermission()
      expect(result).toBe(false)
    })

    it('should grant permission when default', async () => {
      const result = await service.requestPermission()
      expect(result).toBe(true)
      expect(service.getPermission()).toBe('granted')
    })

    it('should return true when already granted', async () => {
      service.setPermissionGranted(true)
      const result = await service.requestPermission()
      expect(result).toBe(true)
    })
  })

  describe('sendNotification', () => {
    beforeEach(() => {
      service.clearSentNotifications()
    })

    it('should send notification when permission granted', () => {
      service.setPermissionGranted(true)
      service.sendNotification('Test Title', { body: 'Test Body' })

      const notifications = service.getSentNotifications()
      expect(notifications).toHaveLength(1)
      expect(notifications[0].title).toBe('Test Title')
      expect(notifications[0].options?.body).toBe('Test Body')
    })

    it('should not send notification when permission not granted', () => {
      service.setPermissionGranted(false)
      service.sendNotification('Test Title')

      expect(service.getSentNotifications()).toHaveLength(0)
    })

    it('should store multiple notifications', () => {
      service.setPermissionGranted(true)
      service.sendNotification('First')
      service.sendNotification('Second')
      service.sendNotification('Third')

      const notifications = service.getSentNotifications()
      expect(notifications).toHaveLength(3)
      expect(notifications[0].title).toBe('First')
      expect(notifications[1].title).toBe('Second')
      expect(notifications[2].title).toBe('Third')
    })

    it('should get last notification', () => {
      service.setPermissionGranted(true)
      service.sendNotification('First')
      service.sendNotification('Last')

      const last = service.getLastNotification()
      expect(last?.title).toBe('Last')
    })

    it('should return null when no notifications sent', () => {
      const last = service.getLastNotification()
      expect(last).toBeNull()
    })

    it('should clear sent notifications', () => {
      service.setPermissionGranted(true)
      service.sendNotification('Test')
      expect(service.getSentNotifications()).toHaveLength(1)

      service.clearSentNotifications()
      expect(service.getSentNotifications()).toHaveLength(0)
    })

    it('should include timestamp in notification', () => {
      service.setPermissionGranted(true)
      const before = new Date()
      service.sendNotification('Test')
      const after = new Date()

      const notification = service.getLastNotification()
      expect(notification?.timestamp).toBeInstanceOf(Date)
      expect(notification!.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(notification!.timestamp.getTime()).toBeLessThanOrEqual(after.getTime())
    })
  })
})

describe('BrowserNotificationService', () => {
  let service: BrowserNotificationService
  let soundEnabled: boolean
  let vibrationEnabled: boolean

  beforeEach(() => {
    soundEnabled = true
    vibrationEnabled = true
    service = new BrowserNotificationService(
      () => soundEnabled,
      () => vibrationEnabled
    )
  })

  describe('settings integration', () => {
    it('should not send notification when sound disabled', () => {
      soundEnabled = false

      // Mock Notification API
      const mockNotification = vi.fn()
      global.Notification = mockNotification as any
      global.Notification.permission = 'granted'

      service.sendNotification('Test')

      expect(mockNotification).not.toHaveBeenCalled()
    })
  })
})
