<template>
  <v-card elevation="0">
    <v-card-text class="pa-4">
      <!-- コントロールボタン -->
      <v-row justify="center" class="mb-4">
        <v-col cols="12" class="d-flex justify-center gap-3">
          <!-- 開始/一時停止ボタン -->
          <v-btn
            v-if="!state.isRunning"
            color="primary"
            size="x-large"
            :disabled="state.remainingSeconds === 0 && state.mode === 'countdown'"
            @click="handleStart"
            class="control-btn"
            rounded
          >
            <v-icon size="large" class="mr-2">
              {{ state.isPaused ? 'mdi-play' : 'mdi-play' }}
            </v-icon>
            {{ state.isPaused ? '再開' : '開始' }}
          </v-btn>

          <v-btn
            v-else
            color="warning"
            size="x-large"
            @click="handlePause"
            class="control-btn"
            rounded
          >
            <v-icon size="large" class="mr-2">
              mdi-pause
            </v-icon>
            一時停止
          </v-btn>

          <!-- リセットボタン -->
          <v-btn
            color="secondary"
            size="x-large"
            :disabled="!state.isRunning && !state.isPaused"
            @click="handleReset"
            class="control-btn"
            rounded
            variant="outlined"
          >
            <v-icon size="large" class="mr-2">
              mdi-refresh
            </v-icon>
            リセット
          </v-btn>
        </v-col>
      </v-row>

      <!-- モード切り替え -->
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-btn-toggle
            :model-value="state.mode"
            @update:model-value="handleModeChange"
            color="primary"
            mandatory
            divided
            class="w-100"
            :disabled="state.isRunning"
          >
            <v-btn value="countdown" class="flex-grow-1">
              <v-icon class="mr-2">mdi-timer-sand</v-icon>
              カウントダウン
            </v-btn>
            <v-btn value="countup" class="flex-grow-1">
              <v-icon class="mr-2">mdi-timer</v-icon>
              カウントアップ
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>

      <!-- 時間設定スライダー（カウントダウンモード時のみ） -->
      <v-row v-if="state.mode === 'countdown' && !state.isRunning" justify="center" class="mt-6">
        <v-col cols="12" sm="8" md="6">
          <div class="time-setter">
            <div class="d-flex justify-space-between align-center mb-2">
              <span class="text-subtitle-2">時間設定</span>
              <span class="text-h6 font-weight-bold text-primary">
                {{ formatTime(customTime) }}
              </span>
            </div>
            <v-slider
              v-model="customTime"
              :min="0"
              :max="3600"
              :step="60"
              thumb-label="always"
              color="primary"
              @update:model-value="handleTimeChange"
            >
              <template #thumb-label="{ modelValue }">
                {{ Math.floor(modelValue / 60) }}分
              </template>
            </v-slider>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const { state, start, pause, reset, setTime, setMode, formatTime } = useTimer()

// カスタム時間設定用
const customTime = ref(state.value.totalSeconds || 300)

// 開始ボタン
const handleStart = () => {
  start()
}

// 一時停止ボタン
const handlePause = () => {
  pause()
}

// リセットボタン
const handleReset = () => {
  reset()
}

// モード変更
const handleModeChange = (mode: 'countdown' | 'countup') => {
  setMode(mode)
  if (mode === 'countdown' && customTime.value > 0) {
    setTime(customTime.value)
  }
}

// 時間変更
const handleTimeChange = (value: number) => {
  setTime(value)
}

// 初期時間設定
onMounted(() => {
  if (state.value.mode === 'countdown' && state.value.totalSeconds === 0) {
    setTime(customTime.value)
  }
})

// タイマー状態が変わったらカスタム時間を更新
watch(() => state.value.totalSeconds, (newVal) => {
  if (newVal > 0 && !state.value.isRunning) {
    customTime.value = newVal
  }
})
</script>

<style scoped>
.control-btn {
  min-width: 140px;
}

.gap-3 {
  gap: 12px;
}

.time-setter {
  padding: 16px;
  border-radius: 12px;
  background-color: rgba(var(--v-theme-surface-variant), 0.3);
}

.w-100 {
  width: 100%;
}

/* レスポンシブ対応 */
@media (max-width: 600px) {
  .control-btn {
    min-width: 120px;
    font-size: 0.875rem;
  }
}
</style>
