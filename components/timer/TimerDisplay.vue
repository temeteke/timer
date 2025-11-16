<template>
  <v-card class="timer-display" elevation="0">
    <v-card-text class="text-center pa-8">
      <!-- 円形プログレスバー -->
      <div
        ref="swipeArea"
        class="progress-wrapper"
        role="region"
        aria-label="タイマー表示エリア"
      >
        <v-progress-circular
          :model-value="progress"
          :size="280"
          :width="12"
          :color="timerColor"
          class="timer-progress"
          :aria-valuenow="progress"
          aria-valuemin="0"
          aria-valuemax="100"
          role="progressbar"
        >
          <!-- 時間表示 -->
          <div class="time-display">
            <div class="time-text" aria-live="polite" aria-atomic="true">
              {{ formattedTime }}
            </div>
            <div class="mode-text" aria-label="タイマーモード">
              {{ modeLabel }}
            </div>
          </div>
        </v-progress-circular>
      </div>

      <!-- ステータス表示 -->
      <div class="status-text mt-6" role="status" aria-live="polite">
        <v-chip
          v-if="state.isRunning"
          color="success"
          variant="flat"
          prepend-icon="mdi-play"
          aria-label="タイマー実行中"
        >
          実行中
        </v-chip>
        <v-chip
          v-else-if="state.isPaused"
          color="warning"
          variant="flat"
          prepend-icon="mdi-pause"
          aria-label="タイマー一時停止中"
        >
          一時停止
        </v-chip>
        <v-chip
          v-else
          color="default"
          variant="flat"
          prepend-icon="mdi-timer-outline"
          aria-label="タイマー待機中"
        >
          待機中
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const { activeTimer, getFormattedTime, getProgress, nextTimer, prevTimer } = useTimers()

// アクティブなタイマーの状態
const state = computed(() => activeTimer.value?.state)

// フォーマットされた時間
const formattedTime = computed(() => getFormattedTime())

// 進捗率
const progress = computed(() => getProgress())

// タイマーの色を状態に応じて変更
const timerColor = computed(() => {
  if (!state.value) return 'grey'

  if (state.value.isRunning) {
    // 残り時間が少なくなったら赤色に
    if (state.value.mode === 'countdown' && state.value.remainingSeconds < 60) {
      return 'error'
    }
    return 'primary'
  }
  if (state.value.isPaused) {
    return 'warning'
  }
  return 'grey'
})

// モード表示ラベル
const modeLabel = computed(() => {
  if (!state.value) return ''
  return state.value.mode === 'countdown' ? 'カウントダウン' : 'カウントアップ'
})

// スワイプジェスチャー対応
const swipeArea = ref<HTMLElement | null>(null)
const { onSwipeLeft, onSwipeRight } = useSwipe(swipeArea)

// 左スワイプで次のタイマーへ
onSwipeLeft.value = () => {
  nextTimer()
}

// 右スワイプで前のタイマーへ
onSwipeRight.value = () => {
  prevTimer()
}
</script>

<style scoped>
.timer-display {
  background: transparent;
}

.progress-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.timer-progress {
  position: relative;
}

.time-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.time-text {
  font-size: 3.5rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  letter-spacing: 0.02em;
}

.mode-text {
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.5rem;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.status-text {
  display: flex;
  justify-content: center;
}

/* レスポンシブ対応 */
@media (max-width: 600px) {
  .time-text {
    font-size: 2.5rem;
  }

  .progress-wrapper {
    min-height: 250px;
  }
}
</style>
