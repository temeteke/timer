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
