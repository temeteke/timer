<template>
  <div class="timer-presets">
    <div class="presets-header mb-4">
      <h3 class="text-h6 text-center">クイック設定</h3>
      <p class="text-caption text-medium-emphasis text-center">
        よく使う時間をワンタップで設定
      </p>
    </div>

    <v-row role="group" aria-label="プリセット時間選択">
      <v-col
        v-for="preset in settings.presets"
        :key="preset"
        cols="6"
        sm="4"
        md="3"
        lg="2"
      >
        <v-card
          class="preset-card"
          :class="{ 'active-preset': isActivePreset(preset) }"
          :elevation="isActivePreset(preset) ? 8 : 2"
          :disabled="state.isRunning"
          @click="handlePresetClick(preset)"
          :aria-label="`タイマーを${formatPresetTime(preset)}に設定`"
          role="button"
          tabindex="0"
          @keyup.enter="handlePresetClick(preset)"
        >
          <v-card-text class="pa-4 text-center">
            <div class="preset-icon mb-2">
              <v-icon size="32" :color="isActivePreset(preset) ? 'primary' : 'default'">
                {{ getPresetIcon(preset) }}
              </v-icon>
            </div>
            <div class="preset-time">
              {{ formatPresetTime(preset) }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const { activeTimer, setTime, setMode } = useTimers()
const { settings, formatPresetTime } = useTimerSettings()

// アクティブなタイマーの状態
const state = computed(() => activeTimer.value?.state)

// 現在のプリセットがアクティブかどうか
const isActivePreset = (preset: number) => {
  return state.value?.totalSeconds === preset && state.value?.mode === 'countdown'
}

// プリセットに応じたアイコンを返す
const getPresetIcon = (seconds: number) => {
  if (seconds <= 60) return 'mdi-clock-fast'
  if (seconds <= 300) return 'mdi-clock-outline'
  if (seconds <= 900) return 'mdi-clock-time-four-outline'
  if (seconds <= 1800) return 'mdi-clock-time-eight-outline'
  return 'mdi-clock-time-twelve-outline'
}

const handlePresetClick = (seconds: number) => {
  if (state.value?.isRunning) return

  // カウントダウンモードに設定
  setMode('countdown')
  // プリセット時間を設定
  setTime(seconds)
}
</script>

<style scoped>
.timer-presets {
  width: 100%;
}

.presets-header {
  margin-bottom: 16px;
}

.preset-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preset-card:hover:not([disabled]) {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.preset-card[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.active-preset {
  border: 2px solid rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.05);
}

.preset-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.preset-time {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
  color: rgba(var(--v-theme-on-surface), 0.87);
}

/* レスポンシブ対応 */
@media (max-width: 600px) {
  .preset-card {
    min-height: 90px;
  }

  .preset-time {
    font-size: 0.875rem;
  }

  .preset-icon {
    margin-bottom: 4px;
  }
}
</style>
