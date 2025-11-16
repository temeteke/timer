/**
 * タイマー関連の型定義
 */

export interface TimerState {
  mode: 'countdown' | 'countup'
  totalSeconds: number
  remainingSeconds: number
  isRunning: boolean
  isPaused: boolean
}

export interface Timer {
  id: string
  label: string
  state: TimerState
  intervalId?: ReturnType<typeof setInterval> | null
}

export interface TimerHistoryEntry {
  id: string
  label: string
  mode: 'countdown' | 'countup'
  duration: number // 実際に経過した秒数
  targetDuration?: number // カウントダウンの場合の目標時間
  completedAt: Date
  completed: boolean // 正常に完了したか（カウントダウンで0になったか）
}
