/**
 * テーマ管理用composable
 * ダークモード/ライトモードの切り替えとシステム設定への対応
 */

import { useTheme as useVuetifyTheme } from 'vuetify'

export type ThemeMode = 'light' | 'dark' | 'auto'

export const useTheme = () => {
  const vuetifyTheme = useVuetifyTheme()

  // テーマモード（light/dark/auto）
  const themeMode = useState<ThemeMode>('themeMode', () => 'auto')

  // システムのダークモード設定
  const prefersDark = ref(false)

  // 実際に適用されるテーマ
  const currentTheme = computed(() => {
    if (themeMode.value === 'auto') {
      return prefersDark.value ? 'dark' : 'light'
    }
    return themeMode.value
  })

  /**
   * テーマモードを設定
   */
  const setThemeMode = (mode: ThemeMode) => {
    themeMode.value = mode
    applyTheme()
    saveThemeToStorage()
  }

  /**
   * テーマを次のモードに切り替え
   */
  const toggleTheme = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'auto']
    const currentIndex = modes.indexOf(themeMode.value)
    const nextIndex = (currentIndex + 1) % modes.length
    setThemeMode(modes[nextIndex])
  }

  /**
   * テーマを適用
   */
  const applyTheme = () => {
    vuetifyTheme.global.name.value = currentTheme.value
  }

  /**
   * LocalStorageからテーマを読み込み
   */
  const loadThemeFromStorage = () => {
    if (process.client) {
      const saved = localStorage.getItem('themeMode')
      if (saved && ['light', 'dark', 'auto'].includes(saved)) {
        themeMode.value = saved as ThemeMode
      }
    }
  }

  /**
   * LocalStorageにテーマを保存
   */
  const saveThemeToStorage = () => {
    if (process.client) {
      localStorage.setItem('themeMode', themeMode.value)
    }
  }

  /**
   * システムのダークモード設定を監視
   */
  const watchSystemTheme = () => {
    if (process.client && window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
      prefersDark.value = darkModeQuery.matches

      // システム設定の変更を監視
      const listener = (e: MediaQueryListEvent) => {
        prefersDark.value = e.matches
        applyTheme()
      }

      darkModeQuery.addEventListener('change', listener)

      // クリーンアップ
      onUnmounted(() => {
        darkModeQuery.removeEventListener('change', listener)
      })
    }
  }

  /**
   * 初期化
   */
  const initTheme = () => {
    loadThemeFromStorage()
    watchSystemTheme()
    applyTheme()
  }

  /**
   * テーマモードのアイコンを取得
   */
  const getThemeIcon = (mode?: ThemeMode) => {
    const targetMode = mode || themeMode.value
    switch (targetMode) {
      case 'light':
        return 'mdi-white-balance-sunny'
      case 'dark':
        return 'mdi-moon-waning-crescent'
      case 'auto':
        return 'mdi-theme-light-dark'
      default:
        return 'mdi-theme-light-dark'
    }
  }

  /**
   * テーマモードのラベルを取得
   */
  const getThemeLabel = (mode?: ThemeMode) => {
    const targetMode = mode || themeMode.value
    switch (targetMode) {
      case 'light':
        return 'ライト'
      case 'dark':
        return 'ダーク'
      case 'auto':
        return '自動'
      default:
        return '自動'
    }
  }

  return {
    themeMode: readonly(themeMode),
    currentTheme: readonly(currentTheme),
    setThemeMode,
    toggleTheme,
    initTheme,
    getThemeIcon,
    getThemeLabel
  }
}
