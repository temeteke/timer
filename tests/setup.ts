import { vi } from 'vitest'

// グローバルなモックを設定
global.process = global.process || {} as any
global.process.client = true

// Nuxtの自動インポートをモック
global.ref = vi.fn((value) => ({ value }))
global.readonly = vi.fn((value) => value)
global.computed = vi.fn((getter) => ({ value: getter() }))
global.onMounted = vi.fn((callback) => callback())
global.useState = vi.fn((key, init) => {
  const value = init ? init() : undefined
  return ref(value)
})

// タイマー設定のモック
global.useTimerSettings = vi.fn(() => ({
  settings: {
    value: {
      soundEnabled: true,
      vibrationEnabled: true,
      volume: 50
    }
  }
}))
