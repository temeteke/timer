/**
 * キーボードショートカットを管理するComposable
 */

export interface KeyboardShortcut {
  key: string
  description: string
  action: () => void
  modifiers?: {
    ctrl?: boolean
    shift?: boolean
    alt?: boolean
    meta?: boolean
  }
}

export const useKeyboardShortcuts = () => {
  const {
    activeTimer,
    start,
    pause,
    reset,
    addTimer,
    nextTimer,
    prevTimer,
    setTime,
    setMode
  } = useTimers()

  const { settings } = useTimerSettings()

  // ショートカットヘルプの表示状態
  const showHelp = useState<boolean>('showKeyboardHelp', () => false)

  /**
   * スペースキー：開始/一時停止
   */
  const toggleStartPause = () => {
    if (!activeTimer.value) return

    if (activeTimer.value.state.isRunning) {
      pause()
    } else {
      // カウントダウンモードで時間が0の場合は開始しない
      if (activeTimer.value.state.mode === 'countdown' && activeTimer.value.state.remainingSeconds === 0) {
        return
      }
      start()
    }
  }

  /**
   * Rキー：リセット
   */
  const handleReset = () => {
    if (!activeTimer.value) return
    if (activeTimer.value.state.isRunning || activeTimer.value.state.isPaused) {
      reset()
    }
  }

  /**
   * Nキー：新しいタイマーを追加
   */
  const handleAddTimer = () => {
    addTimer()
  }

  /**
   * Tabキー：次のタイマーに切り替え
   */
  const handleNextTimer = () => {
    nextTimer()
  }

  /**
   * Shift+Tabキー：前のタイマーに切り替え
   */
  const handlePrevTimer = () => {
    prevTimer()
  }

  /**
   * 数字キー（1-4）：プリセット選択
   */
  const handlePresetSelect = (index: number) => {
    if (!activeTimer.value) return
    if (activeTimer.value.state.isRunning) return

    const preset = settings.value.presets[index]
    if (preset) {
      setMode('countdown')
      setTime(preset)
    }
  }

  /**
   * ?キー：ヘルプ表示/非表示
   */
  const toggleHelp = () => {
    showHelp.value = !showHelp.value
  }

  /**
   * ショートカットのリスト
   */
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'Space',
      description: 'タイマーを開始/一時停止',
      action: toggleStartPause
    },
    {
      key: 'r',
      description: 'タイマーをリセット',
      action: handleReset
    },
    {
      key: 'n',
      description: '新しいタイマーを追加',
      action: handleAddTimer
    },
    {
      key: 'Tab',
      description: '次のタイマーに切り替え',
      action: handleNextTimer
    },
    {
      key: 'Tab',
      description: '前のタイマーに切り替え',
      action: handlePrevTimer,
      modifiers: { shift: true }
    },
    {
      key: '1',
      description: 'プリセット1を選択',
      action: () => handlePresetSelect(0)
    },
    {
      key: '2',
      description: 'プリセット2を選択',
      action: () => handlePresetSelect(1)
    },
    {
      key: '3',
      description: 'プリセット3を選択',
      action: () => handlePresetSelect(2)
    },
    {
      key: '4',
      description: 'プリセット4を選択',
      action: () => handlePresetSelect(3)
    },
    {
      key: '?',
      description: 'ショートカット一覧を表示',
      action: toggleHelp
    }
  ]

  /**
   * キーボードイベントハンドラ
   */
  const handleKeyDown = (event: KeyboardEvent) => {
    // 入力フィールドにフォーカスがある場合は無視
    const target = event.target as HTMLElement
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return
    }

    // ショートカットを検索して実行
    for (const shortcut of shortcuts) {
      const keyMatch = event.key === shortcut.key || event.code === shortcut.key

      if (!keyMatch) continue

      // モディファイアキーのチェック
      const modifiers = shortcut.modifiers || {}
      const ctrlMatch = modifiers.ctrl ? event.ctrlKey : !event.ctrlKey
      const shiftMatch = modifiers.shift ? event.shiftKey : !event.shiftKey
      const altMatch = modifiers.alt ? event.altKey : !event.altKey
      const metaMatch = modifiers.meta ? event.metaKey : !event.metaKey

      if (ctrlMatch && shiftMatch && altMatch && metaMatch) {
        event.preventDefault()
        shortcut.action()
        break
      }
    }
  }

  /**
   * キーボードショートカットを有効化
   */
  const enableShortcuts = () => {
    if (process.client) {
      window.addEventListener('keydown', handleKeyDown)
    }
  }

  /**
   * キーボードショートカットを無効化
   */
  const disableShortcuts = () => {
    if (process.client) {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }

  // コンポーネントマウント時にショートカットを有効化
  onMounted(() => {
    enableShortcuts()
  })

  // コンポーネントアンマウント時にショートカットを無効化
  onBeforeUnmount(() => {
    disableShortcuts()
  })

  return {
    shortcuts,
    showHelp,
    toggleHelp,
    enableShortcuts,
    disableShortcuts
  }
}
