/**
 * 複数タイマーの管理を行うComposable
 * 各タイマーに独立した状態とIDを持たせる
 */

import type { Timer, TimerState } from '~/types/timer'

export const useTimers = () => {
  // タイマー番号カウンター（削除されても増加し続ける）
  const timerCounter = useState<number>('timerCounter', () => 1)

  // タイマーのリスト
  const timers = useState<Timer[]>('timers', () => {
    const initialTimer = {
      id: generateId(),
      label: `タイマー ${timerCounter.value}`,
      state: {
        mode: 'countdown',
        totalSeconds: 0,
        remainingSeconds: 0,
        isRunning: false,
        isPaused: false
      },
      intervalId: null
    }
    timerCounter.value++
    return [initialTimer]
  })

  // アクティブなタイマーのインデックス
  const activeTimerIndex = useState<number>('activeTimerIndex', () => 0)

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
   * アクティブなタイマーを取得
   */
  const activeTimer = computed(() => {
    return timers.value[activeTimerIndex.value]
  })

  /**
   * 指定したインデックスのタイマーを開始
   */
  const start = (index?: number) => {
    const idx = index !== undefined ? index : activeTimerIndex.value
    const timer = timers.value[idx]
    if (!timer || timer.state.isRunning) return

    timer.state.isRunning = true
    timer.state.isPaused = false

    if (process.client) {
      timer.intervalId = setInterval(() => {
        if (timer.state.mode === 'countdown') {
          if (timer.state.remainingSeconds > 0) {
            timer.state.remainingSeconds--
          } else {
            // タイマー終了
            stop(idx)
            onTimerComplete(timer)
          }
        } else {
          // カウントアップモード
          timer.state.remainingSeconds++
        }
      }, 1000)
    }
  }

  /**
   * 指定したインデックスのタイマーを一時停止
   */
  const pause = (index?: number) => {
    const idx = index !== undefined ? index : activeTimerIndex.value
    const timer = timers.value[idx]
    if (!timer) return

    if (timer.intervalId) {
      clearInterval(timer.intervalId)
      timer.intervalId = null
    }
    timer.state.isRunning = false
    timer.state.isPaused = true
  }

  /**
   * 指定したインデックスのタイマーをリセット
   */
  const reset = (index?: number) => {
    const idx = index !== undefined ? index : activeTimerIndex.value
    const timer = timers.value[idx]
    if (!timer) return

    if (timer.intervalId) {
      clearInterval(timer.intervalId)
      timer.intervalId = null
    }
    timer.state.isRunning = false
    timer.state.isPaused = false
    timer.state.remainingSeconds = timer.state.totalSeconds
  }

  /**
   * 指定したインデックスのタイマーを停止
   */
  const stop = (index?: number) => {
    const idx = index !== undefined ? index : activeTimerIndex.value
    const timer = timers.value[idx]
    if (!timer) return

    if (timer.intervalId) {
      clearInterval(timer.intervalId)
      timer.intervalId = null
    }
    timer.state.isRunning = false
    timer.state.isPaused = false
  }

  /**
   * タイマー時間を設定
   */
  const setTime = (seconds: number, index?: number) => {
    const idx = index !== undefined ? index : activeTimerIndex.value
    const timer = timers.value[idx]
    if (!timer || timer.state.isRunning) return

    timer.state.totalSeconds = seconds
    timer.state.remainingSeconds = seconds
  }

  /**
   * モードを変更
   */
  const setMode = (mode: 'countdown' | 'countup', index?: number) => {
    const idx = index !== undefined ? index : activeTimerIndex.value
    const timer = timers.value[idx]
    if (!timer || timer.state.isRunning) return

    timer.state.mode = mode
    if (mode === 'countup') {
      timer.state.totalSeconds = 0
      timer.state.remainingSeconds = 0
    }
  }

  /**
   * タイマーのラベルを設定
   */
  const setLabel = (label: string, index?: number) => {
    const idx = index !== undefined ? index : activeTimerIndex.value
    const timer = timers.value[idx]
    if (!timer) return

    timer.label = label
    saveTimers()
  }

  /**
   * 新しいタイマーを追加
   */
  const addTimer = (label?: string) => {
    const newTimer: Timer = {
      id: generateId(),
      label: label || `タイマー ${timerCounter.value}`,
      state: {
        mode: 'countdown',
        totalSeconds: 0,
        remainingSeconds: 0,
        isRunning: false,
        isPaused: false
      },
      intervalId: null
    }

    timerCounter.value++ // カウンターを増やす
    timers.value.push(newTimer)
    activeTimerIndex.value = timers.value.length - 1
    saveTimers()
    return newTimer.id
  }

  /**
   * タイマーを削除
   */
  const removeTimer = (index: number) => {
    if (timers.value.length <= 1) {
      // 最後のタイマーは削除できない
      return
    }

    const timer = timers.value[index]
    if (timer?.intervalId) {
      clearInterval(timer.intervalId)
    }

    timers.value.splice(index, 1)

    // アクティブインデックスを調整
    if (activeTimerIndex.value >= timers.value.length) {
      activeTimerIndex.value = timers.value.length - 1
    }

    saveTimers()
  }

  /**
   * アクティブなタイマーを切り替え
   */
  const switchTimer = (index: number) => {
    if (index >= 0 && index < timers.value.length) {
      activeTimerIndex.value = index
    }
  }

  /**
   * 次のタイマーに切り替え
   */
  const nextTimer = () => {
    activeTimerIndex.value = (activeTimerIndex.value + 1) % timers.value.length
  }

  /**
   * 前のタイマーに切り替え
   */
  const prevTimer = () => {
    activeTimerIndex.value = (activeTimerIndex.value - 1 + timers.value.length) % timers.value.length
  }

  /**
   * タイマー完了時のコールバック
   */
  const onTimerComplete = async (timer: Timer) => {
    console.log(`Timer "${timer.label}" completed!`)

    // 履歴に追加
    addHistoryEntry({
      label: timer.label,
      mode: timer.state.mode,
      duration: timer.state.mode === 'countdown' ? timer.state.totalSeconds : timer.state.remainingSeconds,
      targetDuration: timer.state.mode === 'countdown' ? timer.state.totalSeconds : undefined,
      completed: true
    })

    // サウンド＆バイブレーションを再生
    await notifyComplete()

    // ブラウザ通知を送信
    notifyTimerComplete(`${timer.label}が完了しました！`)
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
  const getProgress = (index?: number): number => {
    const idx = index !== undefined ? index : activeTimerIndex.value
    const timer = timers.value[idx]
    if (!timer) return 0

    if (timer.state.mode === 'countdown' && timer.state.totalSeconds > 0) {
      return ((timer.state.totalSeconds - timer.state.remainingSeconds) / timer.state.totalSeconds) * 100
    }
    return 0
  }

  /**
   * フォーマットされた時間文字列
   */
  const getFormattedTime = (index?: number): string => {
    const idx = index !== undefined ? index : activeTimerIndex.value
    const timer = timers.value[idx]
    if (!timer) return '00:00'

    return formatTime(timer.state.remainingSeconds)
  }

  /**
   * タイマーをLocalStorageに保存
   */
  const saveTimers = () => {
    if (process.client) {
      const timersData = timers.value.map(timer => ({
        id: timer.id,
        label: timer.label,
        state: timer.state
        // intervalIdは保存しない
      }))

      localStorage.setItem('timers', JSON.stringify(timersData))
      localStorage.setItem('activeTimerIndex', activeTimerIndex.value.toString())
      localStorage.setItem('timerCounter', timerCounter.value.toString())
    }
  }

  /**
   * LocalStorageからタイマーを読み込み
   */
  const loadTimers = () => {
    if (process.client) {
      try {
        const savedTimers = localStorage.getItem('timers')
        const savedIndex = localStorage.getItem('activeTimerIndex')
        const savedCounter = localStorage.getItem('timerCounter')

        if (savedTimers) {
          const parsed = JSON.parse(savedTimers)
          if (Array.isArray(parsed) && parsed.length > 0) {
            timers.value = parsed.map(t => ({
              ...t,
              intervalId: null,
              state: {
                ...t.state,
                isRunning: false,
                isPaused: false
              }
            }))
          }
        }

        if (savedIndex) {
          const idx = parseInt(savedIndex, 10)
          if (idx >= 0 && idx < timers.value.length) {
            activeTimerIndex.value = idx
          }
        }

        if (savedCounter) {
          const counter = parseInt(savedCounter, 10)
          if (!isNaN(counter) && counter > 0) {
            timerCounter.value = counter
          }
        }
      } catch (error) {
        console.error('Failed to load timers from localStorage:', error)
      }
    }
  }

  /**
   * すべてのタイマーを停止してクリーンアップ
   */
  const cleanup = () => {
    timers.value.forEach(timer => {
      if (timer.intervalId) {
        clearInterval(timer.intervalId)
        timer.intervalId = null
      }
    })
  }

  // コンポーネントがアンマウントされた時のクリーンアップ
  if (process.client) {
    onBeforeUnmount(() => {
      cleanup()
    })
  }

  return {
    timers: readonly(timers),
    activeTimerIndex: readonly(activeTimerIndex),
    activeTimer,
    start,
    pause,
    reset,
    stop,
    setTime,
    setMode,
    setLabel,
    addTimer,
    removeTimer,
    switchTimer,
    nextTimer,
    prevTimer,
    formatTime,
    getFormattedTime,
    getProgress,
    saveTimers,
    loadTimers,
    cleanup
  }
}
