/**
 * モバイルデバイス検出用composable
 */

export const useMobile = () => {
  const isMobile = ref(false)

  const checkMobile = () => {
    if (process.client) {
      // 画面幅でモバイルを判定（768px以下）
      isMobile.value = window.innerWidth <= 768
    }
  }

  onMounted(() => {
    checkMobile()

    // リサイズイベントを監視
    window.addEventListener('resize', checkMobile)
  })

  onUnmounted(() => {
    if (process.client) {
      window.removeEventListener('resize', checkMobile)
    }
  })

  return {
    isMobile: readonly(isMobile)
  }
}
