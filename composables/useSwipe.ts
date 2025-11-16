/**
 * スワイプジェスチャー検出用composable
 * タッチデバイスでのスワイプ操作をサポート
 */

export interface SwipeOptions {
  threshold?: number // スワイプと判定する最小距離（px）
  timeout?: number // スワイプと判定する最大時間（ms）
}

export const useSwipe = (
  element: Ref<HTMLElement | null>,
  options: SwipeOptions = {}
) => {
  const { threshold = 50, timeout = 500 } = options

  const startX = ref(0)
  const startY = ref(0)
  const startTime = ref(0)
  const isSwiping = ref(false)

  // イベントハンドラ
  const onSwipeLeft = ref<(() => void) | null>(null)
  const onSwipeRight = ref<(() => void) | null>(null)
  const onSwipeUp = ref<(() => void) | null>(null)
  const onSwipeDown = ref<(() => void) | null>(null)

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0]
    startX.value = touch.clientX
    startY.value = touch.clientY
    startTime.value = Date.now()
    isSwiping.value = true
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isSwiping.value) return

    // スワイプ中はスクロールを防ぐ（オプション）
    // e.preventDefault()
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isSwiping.value) return

    const touch = e.changedTouches[0]
    const endX = touch.clientX
    const endY = touch.clientY
    const endTime = Date.now()

    const deltaX = endX - startX.value
    const deltaY = endY - startY.value
    const deltaTime = endTime - startTime.value

    // タイムアウトチェック
    if (deltaTime > timeout) {
      isSwiping.value = false
      return
    }

    // 水平スワイプ
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          // 右スワイプ
          onSwipeRight.value?.()
        } else {
          // 左スワイプ
          onSwipeLeft.value?.()
        }
      }
    }
    // 垂直スワイプ
    else {
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0) {
          // 下スワイプ
          onSwipeDown.value?.()
        } else {
          // 上スワイプ
          onSwipeUp.value?.()
        }
      }
    }

    isSwiping.value = false
  }

  // イベントリスナーの登録
  onMounted(() => {
    const el = element.value
    if (!el) return

    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: true })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })
  })

  // クリーンアップ
  onUnmounted(() => {
    const el = element.value
    if (!el) return

    el.removeEventListener('touchstart', handleTouchStart)
    el.removeEventListener('touchmove', handleTouchMove)
    el.removeEventListener('touchend', handleTouchEnd)
  })

  return {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    isSwiping: readonly(isSwiping)
  }
}
