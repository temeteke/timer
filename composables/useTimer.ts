/**
 * タイマーのコアロジックを管理するComposable
 * Nuxt 3のuseStateを使用してグローバル状態を管理
 */

import type { TimerState } from '~/types/timer'

export const useTimer = () => {
  // グローバル状態（useState使用）
  const state = useState<TimerState>('timer', () => ({
    mode: 'countdown',
    totalSeconds: 0,
    remainingSeconds: 0,
    isRunning: false,
    isPaused: false
  }))

  // 通知とサウンドのcomposableを使用
  const { notifyTimerComplete } = useNotification()
  const { notifyComplete } = useSound()

  // インターバルIDを管理（ブラウザ側のみ）
  let intervalId: ReturnType<typeof setInterval> | null = null

  /**
   * タイマーを開始
   */
  const start = () => {
    if (state.value.isRunning) return

    state.value.isRunning = true
    state.value.isPaused = false

    if (process.client) {
      intervalId = setInterval(() => {
        if (state.value.mode === 'countdown') {
          if (state.value.remainingSeconds > 0) {
            state.value.remainingSeconds--
          } else {
            // タイマー終了
            stop()
            onTimerComplete()
          }
        } else {
          // カウントアップモード
          state.value.remainingSeconds++
        }
      }, 1000)
    }
  }

  /**
   * タイマーを一時停止
   */
  const pause = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    state.value.isRunning = false
    state.value.isPaused = true
  }

  /**
   * タイマーをリセット
   */
  const reset = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    state.value.isRunning = false
    state.value.isPaused = false
    state.value.remainingSeconds = state.value.totalSeconds
  }

  /**
   * タイマーを停止
   */
  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    state.value.isRunning = false
    state.value.isPaused = false
  }

  /**
   * タイマー時間を設定
   */
  const setTime = (seconds: number) => {
    // 実行中は設定変更不可
    if (state.value.isRunning) return

    state.value.totalSeconds = seconds
    state.value.remainingSeconds = seconds
  }

  /**
   * モードを変更
   */
  const setMode = (mode: 'countdown' | 'countup') => {
    // 実行中は変更不可
    if (state.value.isRunning) return

    state.value.mode = mode
    if (mode === 'countup') {
      state.value.totalSeconds = 0
      state.value.remainingSeconds = 0
    }
  }

  /**
   * タイマー完了時のコールバック
   */
  const onTimerComplete = async () => {
    // 完了時の処理（通知、サウンドなど）
    console.log('Timer completed!')

    // サウンド＆バイブレーションを再生
    await notifyComplete()

    // ブラウザ通知を送信
    notifyTimerComplete()
  }

  /**
   * 時間を HH:MM:SS 形式でフォーマット
   */
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  /**
   * 進捗率を計算（0-100）
   */
  const progress = computed(() => {
    if (state.value.mode === 'countdown' && state.value.totalSeconds > 0) {
      return ((state.value.totalSeconds - state.value.remainingSeconds) / state.value.totalSeconds) * 100
    }
    return 0
  })

  /**
   * フォーマットされた時間文字列
   */
  const formattedTime = computed(() => {
    return formatTime(state.value.remainingSeconds)
  })

  // コンポーネントがアンマウントされた時のクリーンアップ
  if (process.client) {
    onBeforeUnmount(() => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    })
  }

  return {
    state: readonly(state),
    start,
    pause,
    reset,
    stop,
    setTime,
    setMode,
    formatTime,
    formattedTime,
    progress
  }
}
