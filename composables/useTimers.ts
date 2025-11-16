/**
 * 単一タイマーの管理を行うComposable
 */

import type { Timer, TimerState } from '~/types/timer'

export const useTimers = () => {
  // 単一タイマーの状態
  const timer = useState<Timer>('timer', () => ({
    id: generateId(),
    label: 'タイマー',
    state: {
      mode: 'countdown',
      totalSeconds: 0,
      remainingSeconds: 0,
      isRunning: false,
      isPaused: false
    },
    intervalId: null
  }))

  // 通知とサウンドのcomposableを使用
  const { notifyTimerComplete } = useNotification()
  const { notifyComplete } = useSound()

  // 履歴管理
  const { addHistoryEntry } = useTimerHistory()

  /**
   * ユニークなIDを生成
   */
  function generateId(): string {
    return `timer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * アクティブなタイマーを取得（後方互換性のため）
   */
  const activeTimer = computed(() => timer.value)

  /**
   * タイマーを開始
   */
  const start = () => {
    if (!timer.value || timer.value.state.isRunning) return

    timer.value.state.isRunning = true
    timer.value.state.isPaused = false

    if (process.client) {
      timer.value.intervalId = setInterval(() => {
        if (timer.value.state.mode === 'countdown') {
          if (timer.value.state.remainingSeconds > 0) {
            timer.value.state.remainingSeconds--
          } else {
            // タイマー終了
            stop()
            onTimerComplete(timer.value)
          }
        } else {
          // カウントアップモード
          timer.value.state.remainingSeconds++
        }
      }, 1000)
    }
  }

  /**
   * タイマーを一時停止
   */
  const pause = () => {
    if (!timer.value) return

    if (timer.value.intervalId) {
      clearInterval(timer.value.intervalId)
      timer.value.intervalId = null
    }
    timer.value.state.isRunning = false
    timer.value.state.isPaused = true
  }

  /**
   * タイマーをリセット
   */
  const reset = () => {
    if (!timer.value) return

    if (timer.value.intervalId) {
      clearInterval(timer.value.intervalId)
      timer.value.intervalId = null
    }
    timer.value.state.isRunning = false
    timer.value.state.isPaused = false
    timer.value.state.remainingSeconds = timer.value.state.totalSeconds
  }

  /**
   * タイマーを停止
   */
  const stop = () => {
    if (!timer.value) return

    if (timer.value.intervalId) {
      clearInterval(timer.value.intervalId)
      timer.value.intervalId = null
    }
    timer.value.state.isRunning = false
    timer.value.state.isPaused = false
  }

  /**
   * タイマー時間を設定
   */
  const setTime = (seconds: number) => {
    if (!timer.value || timer.value.state.isRunning) return

    timer.value.state.totalSeconds = seconds
    timer.value.state.remainingSeconds = seconds
    saveTimer()
  }

  /**
   * モードを変更
   */
  const setMode = (mode: 'countdown' | 'countup') => {
    if (!timer.value || timer.value.state.isRunning) return

    timer.value.state.mode = mode
    if (mode === 'countup') {
      timer.value.state.totalSeconds = 0
      timer.value.state.remainingSeconds = 0
    }
    saveTimer()
  }

  /**
   * タイマーのラベルを設定
   */
  const setLabel = (label: string) => {
    if (!timer.value) return

    timer.value.label = label
    saveTimer()
  }

  /**
   * タイマー完了時のコールバック
   */
  const onTimerComplete = async (completedTimer: Timer) => {
    console.log(`Timer "${completedTimer.label}" completed!`)

    // 履歴に追加
    addHistoryEntry({
      label: completedTimer.label,
      mode: completedTimer.state.mode,
      duration: completedTimer.state.mode === 'countdown' ? completedTimer.state.totalSeconds : completedTimer.state.remainingSeconds,
      targetDuration: completedTimer.state.mode === 'countdown' ? completedTimer.state.totalSeconds : undefined,
      completed: true
    })

    // サウンド＆バイブレーションを再生
    await notifyComplete()

    // ブラウザ通知を送信
    notifyTimerComplete(`${completedTimer.label}が完了しました！`)
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
  const getProgress = (): number => {
    if (!timer.value) return 0

    if (timer.value.state.mode === 'countdown' && timer.value.state.totalSeconds > 0) {
      return ((timer.value.state.totalSeconds - timer.value.state.remainingSeconds) / timer.value.state.totalSeconds) * 100
    }
    return 0
  }

  /**
   * フォーマットされた時間文字列
   */
  const getFormattedTime = (): string => {
    if (!timer.value) return '00:00'

    return formatTime(timer.value.state.remainingSeconds)
  }

  /**
   * タイマーをLocalStorageに保存
   */
  const saveTimer = () => {
    if (process.client) {
      const timerData = {
        id: timer.value.id,
        label: timer.value.label,
        state: timer.value.state
        // intervalIdは保存しない
      }

      localStorage.setItem('timer', JSON.stringify(timerData))
    }
  }

  /**
   * LocalStorageからタイマーを読み込み
   */
  const loadTimer = () => {
    if (process.client) {
      try {
        const savedTimer = localStorage.getItem('timer')

        if (savedTimer) {
          const parsed = JSON.parse(savedTimer)
          timer.value = {
            ...parsed,
            intervalId: null,
            state: {
              ...parsed.state,
              isRunning: false,
              isPaused: false
            }
          }
        }
      } catch (error) {
        console.error('Failed to load timer from localStorage:', error)
      }
    }
  }

  /**
   * タイマーを停止してクリーンアップ
   */
  const cleanup = () => {
    if (timer.value?.intervalId) {
      clearInterval(timer.value.intervalId)
      timer.value.intervalId = null
    }
  }

  // コンポーネントがアンマウントされた時のクリーンアップ
  if (process.client) {
    onBeforeUnmount(() => {
      cleanup()
    })
  }

  // 後方互換性のために loadTimers も提供
  const loadTimers = loadTimer

  return {
    timer: readonly(timer),
    activeTimer,
    start,
    pause,
    reset,
    stop,
    setTime,
    setMode,
    setLabel,
    formatTime,
    getFormattedTime,
    getProgress,
    saveTimer,
    loadTimer,
    loadTimers,
    cleanup
  }
}
