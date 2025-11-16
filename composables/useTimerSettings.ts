/**
 * タイマー設定を管理するComposable
 * LocalStorageで設定を永続化
 */

export interface TimerSettings {
  presets: number[]
  soundEnabled: boolean
  vibrationEnabled: boolean
  darkMode: boolean
  selectedSound: string
}

export const useTimerSettings = () => {
  const settings = useState<TimerSettings>('timerSettings', () => ({
    presets: [60, 180, 300, 600, 1500], // 1分, 3分, 5分, 10分, 25分
    soundEnabled: true,
    vibrationEnabled: true,
    darkMode: false,
    selectedSound: 'default'
  }))

  /**
   * LocalStorageに設定を保存
   */
  const saveSettings = () => {
    if (process.client) {
      try {
        localStorage.setItem('timerSettings', JSON.stringify(settings.value))
      } catch (error) {
        console.error('Failed to save settings:', error)
      }
    }
  }

  /**
   * LocalStorageから設定を読み込み
   */
  const loadSettings = () => {
    if (process.client) {
      try {
        const saved = localStorage.getItem('timerSettings')
        if (saved) {
          const parsed = JSON.parse(saved)
          Object.assign(settings.value, parsed)
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    }
  }

  /**
   * プリセットを追加
   */
  const addPreset = (seconds: number) => {
    if (!settings.value.presets.includes(seconds)) {
      settings.value.presets.push(seconds)
      settings.value.presets.sort((a, b) => a - b)
      saveSettings()
    }
  }

  /**
   * プリセットを削除
   */
  const removePreset = (seconds: number) => {
    const index = settings.value.presets.indexOf(seconds)
    if (index > -1) {
      settings.value.presets.splice(index, 1)
      saveSettings()
    }
  }

  /**
   * ダークモードを切り替え
   */
  const toggleDarkMode = () => {
    settings.value.darkMode = !settings.value.darkMode
    saveSettings()
  }

  /**
   * サウンドの有効/無効を切り替え
   */
  const toggleSound = () => {
    settings.value.soundEnabled = !settings.value.soundEnabled
    saveSettings()
  }

  /**
   * バイブレーションの有効/無効を切り替え
   */
  const toggleVibration = () => {
    settings.value.vibrationEnabled = !settings.value.vibrationEnabled
    saveSettings()
  }

  /**
   * プリセット時間を秒から分に変換
   */
  const formatPresetTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}秒`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    if (remainingSeconds === 0) {
      return `${minutes}分`
    }
    return `${minutes}分${remainingSeconds}秒`
  }

  // 初期化時に設定を読み込み
  if (process.client) {
    onMounted(() => {
      loadSettings()
    })
  }

  return {
    settings: readonly(settings),
    saveSettings,
    loadSettings,
    addPreset,
    removePreset,
    toggleDarkMode,
    toggleSound,
    toggleVibration,
    formatPresetTime
  }
}
