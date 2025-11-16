<template>
  <v-card elevation="0">
    <v-card-text class="pa-4">
      <div class="presets-header mb-3">
        <h3 class="text-h6">クイック設定</h3>
        <p class="text-caption text-medium-emphasis">
          よく使う時間をワンタップで設定
        </p>
      </div>

      <v-row>
        <v-col
          v-for="preset in settings.presets"
          :key="preset"
          cols="6"
          sm="4"
          md="3"
        >
          <v-btn
            color="primary"
            variant="outlined"
            size="large"
            block
            :disabled="state.isRunning"
            @click="handlePresetClick(preset)"
            class="preset-btn"
          >
            <div class="preset-content">
              <v-icon size="small" class="mb-1">
                mdi-clock-outline
              </v-icon>
              <div class="preset-time">
                {{ formatPresetTime(preset) }}
              </div>
            </div>
          </v-btn>
        </v-col>
      </v-row>

      <!-- ポモドーロタイマー（25分）を強調表示 -->
      <v-row v-if="settings.presets.includes(1500)" class="mt-2">
        <v-col cols="12">
          <v-alert
            color="info"
            variant="tonal"
            density="compact"
            icon="mdi-lightbulb-outline"
            class="pomodoro-tip"
          >
            <div class="text-caption">
              <strong>ポモドーロテクニック:</strong> 25分集中 → 5分休憩のサイクルで生産性UP
            </div>
          </v-alert>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const { state, setTime, setMode } = useTimer()
const { settings, formatPresetTime } = useTimerSettings()

const handlePresetClick = (seconds: number) => {
  // カウントダウンモードに設定
  setMode('countdown')
  // プリセット時間を設定
  setTime(seconds)
}
</script>

<style scoped>
.presets-header {
  text-align: center;
}

.preset-btn {
  height: 80px !important;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.preset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.preset-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.preset-time {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
}

.pomodoro-tip {
  margin-top: 8px;
}

/* レスポンシブ対応 */
@media (max-width: 600px) {
  .preset-btn {
    height: 70px !important;
  }

  .preset-time {
    font-size: 0.875rem;
  }
}
</style>
