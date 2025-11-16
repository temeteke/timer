/**
 * タイマー履歴管理用composable
 * 完了したタイマーの履歴を記録・管理
 */

import type { TimerHistoryEntry } from '~/types/timer'

const STORAGE_KEY = 'timer-history'
const MAX_HISTORY_ITEMS = 100 // 最大保存件数

export const useTimerHistory = () => {
  // 履歴エントリのリスト
  const history = useState<TimerHistoryEntry[]>('timerHistory', () => [])

  /**
   * 履歴に新しいエントリを追加
   */
  const addHistoryEntry = (entry: Omit<TimerHistoryEntry, 'id' | 'completedAt'>) => {
    const newEntry: TimerHistoryEntry = {
      ...entry,
      id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      completedAt: new Date()
    }

    // 最新のエントリを先頭に追加
    history.value = [newEntry, ...history.value]

    // 最大件数を超えたら古いエントリを削除
    if (history.value.length > MAX_HISTORY_ITEMS) {
      history.value = history.value.slice(0, MAX_HISTORY_ITEMS)
    }

    saveHistory()
  }

  /**
   * 履歴から特定のエントリを削除
   */
  const removeHistoryEntry = (id: string) => {
    history.value = history.value.filter(entry => entry.id !== id)
    saveHistory()
  }

  /**
   * 履歴を全てクリア
   */
  const clearHistory = () => {
    history.value = []
    saveHistory()
  }

  /**
   * LocalStorageに履歴を保存
   */
  const saveHistory = () => {
    if (process.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
      } catch (error) {
        console.error('Failed to save history:', error)
      }
    }
  }

  /**
   * LocalStorageから履歴を読み込み
   */
  const loadHistory = () => {
    if (process.client) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          // Dateオブジェクトを復元
          history.value = parsed.map((entry: any) => ({
            ...entry,
            completedAt: new Date(entry.completedAt)
          }))
        }
      } catch (error) {
        console.error('Failed to load history:', error)
        history.value = []
      }
    }
  }

  /**
   * 統計情報を計算
   */
  const getStatistics = computed(() => {
    const totalCompleted = history.value.filter(entry => entry.completed).length
    const totalDuration = history.value.reduce((sum, entry) => sum + entry.duration, 0)
    const countdownCount = history.value.filter(entry => entry.mode === 'countdown').length
    const countupCount = history.value.filter(entry => entry.mode === 'countup').length

    return {
      totalCompleted,
      totalDuration,
      countdownCount,
      countupCount,
      totalCount: history.value.length
    }
  })

  /**
   * 日付でフィルタリングされた履歴
   */
  const getHistoryByDate = (date: Date) => {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    return history.value.filter(entry => {
      const entryDate = new Date(entry.completedAt)
      return entryDate >= startOfDay && entryDate <= endOfDay
    })
  }

  /**
   * 今日の履歴
   */
  const todayHistory = computed(() => {
    return getHistoryByDate(new Date())
  })

  /**
   * 今週の履歴
   */
  const thisWeekHistory = computed(() => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return history.value.filter(entry => new Date(entry.completedAt) >= weekAgo)
  })

  /**
   * 時間をフォーマット
   */
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}時間${minutes}分${secs}秒`
    } else if (minutes > 0) {
      return `${minutes}分${secs}秒`
    } else {
      return `${secs}秒`
    }
  }

  /**
   * 日時をフォーマット
   */
  const formatDateTime = (date: Date): string => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diff / 60000)
    const diffHours = Math.floor(diff / 3600000)
    const diffDays = Math.floor(diff / 86400000)

    if (diffMinutes < 1) {
      return 'たった今'
    } else if (diffMinutes < 60) {
      return `${diffMinutes}分前`
    } else if (diffHours < 24) {
      return `${diffHours}時間前`
    } else if (diffDays < 7) {
      return `${diffDays}日前`
    } else {
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  return {
    history: readonly(history),
    addHistoryEntry,
    removeHistoryEntry,
    clearHistory,
    loadHistory,
    getStatistics,
    todayHistory,
    thisWeekHistory,
    formatDuration,
    formatDateTime
  }
}
