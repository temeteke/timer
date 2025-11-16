export type TimerViewMode = 'tabs' | 'grid'

export const useTimerView = () => {
  // ビューモードの状態（tabs または grid）
  const viewMode = useState<TimerViewMode>('timer-view-mode', () => 'tabs')

  // localStorageから読み込み
  onMounted(() => {
    if (process.client) {
      const savedMode = localStorage.getItem('timerViewMode')
      if (savedMode === 'tabs' || savedMode === 'grid') {
        viewMode.value = savedMode
      }
    }
  })

  // localStorageに保存
  watch(viewMode, (newMode) => {
    if (process.client) {
      localStorage.setItem('timerViewMode', newMode)
    }
  })

  // ビューモードを切り替え
  const toggleViewMode = () => {
    viewMode.value = viewMode.value === 'tabs' ? 'grid' : 'tabs'
  }

  // 特定のビューモードに設定
  const setViewMode = (mode: TimerViewMode) => {
    viewMode.value = mode
  }

  return {
    viewMode: readonly(viewMode),
    toggleViewMode,
    setViewMode
  }
}
