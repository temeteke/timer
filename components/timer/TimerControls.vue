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
            :aria-label="state.isPaused ? 'タイマーを再開' : 'タイマーを開始'"
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
            aria-label="タイマーを一時停止"
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
            aria-label="タイマーをリセット"
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
            role="group"
            aria-label="タイマーモード選択"
          >
            <v-btn value="countdown" class="flex-grow-1" aria-label="カウントダウンモード">
              <v-icon class="mr-2">mdi-timer-sand</v-icon>
              カウントダウン
            </v-btn>
            <v-btn value="countup" class="flex-grow-1" aria-label="カウントアップモード">
              <v-icon class="mr-2">mdi-timer</v-icon>
              カウントアップ
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>

      <!-- 時間設定（カウントダウンモード時のみ） -->
      <v-row v-if="state.mode === 'countdown' && !state.isRunning" justify="center" class="mt-6">
        <v-col cols="12" sm="10" md="8">
          <!-- クイック設定（プリセット） -->
          <div class="presets-section mb-6">
            <div class="text-subtitle-2 text-center mb-3">クイック設定</div>
            <v-row role="group" aria-label="プリセット時間選択">
              <v-col
                v-for="preset in settings.presets"
                :key="preset"
                cols="6"
                sm="3"
              >
                <v-card
                  class="preset-card"
                  :class="{ 'active-preset': isActivePreset(preset) }"
                  :elevation="isActivePreset(preset) ? 8 : 2"
                  @click="handlePresetClick(preset)"
                  :aria-label="`タイマーを${formatPresetTime(preset)}に設定`"
                  role="button"
                  tabindex="0"
                  @keyup.enter="handlePresetClick(preset)"
                >
                  <v-card-text class="pa-3 text-center">
                    <div class="preset-icon mb-1">
                      <v-icon size="28" :color="isActivePreset(preset) ? 'primary' : 'default'">
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

          <!-- 電卓式入力 -->
          <div class="time-setter">
            <div class="time-input-header mb-4">
              <div class="text-subtitle-2 text-center mb-2">詳細設定</div>

              <!-- 入力表示エリア -->
              <div class="time-display-container">
                <div class="time-display" aria-live="polite">
                  {{ formattedTimeDisplay }}
                </div>
                <div class="time-input-hint text-caption text-medium-emphasis">
                  {{ inputHint }}
                </div>
              </div>
            </div>

            <!-- テンキー -->
            <div class="number-pad">
              <v-row dense>
                <v-col
                  v-for="num in [1, 2, 3, 4, 5, 6, 7, 8, 9]"
                  :key="num"
                  cols="4"
                >
                  <v-btn
                    block
                    size="large"
                    variant="outlined"
                    color="primary"
                    @click="inputNumber(num)"
                    class="number-btn"
                  >
                    {{ num }}
                  </v-btn>
                </v-col>
                <v-col cols="4">
                  <v-btn
                    block
                    size="large"
                    variant="outlined"
                    color="error"
                    @click="clearInput"
                    class="number-btn"
                  >
                    <v-icon>mdi-backspace-outline</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="4">
                  <v-btn
                    block
                    size="large"
                    variant="outlined"
                    color="primary"
                    @click="inputNumber(0)"
                    class="number-btn"
                  >
                    0
                  </v-btn>
                </v-col>
                <v-col cols="4">
                  <v-btn
                    block
                    size="large"
                    variant="outlined"
                    color="warning"
                    @click="deleteLastDigit"
                    class="number-btn"
                  >
                    <v-icon>mdi-backspace</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const { activeTimer, start, pause, reset, setTime, setMode, formatTime } = useTimers()
const { settings, formatPresetTime } = useTimerSettings()

// アクティブなタイマーの状態
const state = computed(() => activeTimer.value?.state)

// 電卓式入力用の数字列
const inputDigits = ref('')

// プリセット関連の関数
const isActivePreset = (preset: number) => {
  return state.value?.totalSeconds === preset && state.value?.mode === 'countdown'
}

const getPresetIcon = (seconds: number) => {
  if (seconds <= 60) return 'mdi-clock-fast'
  if (seconds <= 300) return 'mdi-clock-outline'
  if (seconds <= 900) return 'mdi-clock-time-four-outline'
  if (seconds <= 1800) return 'mdi-clock-time-eight-outline'
  return 'mdi-clock-time-twelve-outline'
}

const handlePresetClick = (seconds: number) => {
  // プリセット時間を設定
  setTime(seconds)
}

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
  if (mode === 'countdown') {
    updateTimerFromInput()
  }
}

// 数字を入力（最大6桁まで）
const inputNumber = (num: number) => {
  if (inputDigits.value.length < 6) {
    inputDigits.value += num.toString()
    updateTimerFromInput()
  }
}

// 最後の1桁を削除
const deleteLastDigit = () => {
  if (inputDigits.value.length > 0) {
    inputDigits.value = inputDigits.value.slice(0, -1)
    updateTimerFromInput()
  }
}

// 入力をクリア
const clearInput = () => {
  inputDigits.value = ''
  setTime(0)
}

// 入力された数字列から秒数を計算
const calculateSeconds = (digits: string): number => {
  if (!digits) return 0

  // 右から2桁ずつ秒、分、時として解釈
  const padded = digits.padStart(6, '0')
  const hours = parseInt(padded.slice(0, 2))
  const minutes = parseInt(padded.slice(2, 4))
  const seconds = parseInt(padded.slice(4, 6))

  return hours * 3600 + minutes * 60 + seconds
}

// 入力からタイマーを更新
const updateTimerFromInput = () => {
  const totalSeconds = calculateSeconds(inputDigits.value)
  setTime(totalSeconds)
}

// フォーマットされた時間表示（HH:MM:SS）
const formattedTimeDisplay = computed(() => {
  if (!inputDigits.value) return '00:00:00'

  const padded = inputDigits.value.padStart(6, '0')
  const hours = padded.slice(0, 2)
  const minutes = padded.slice(2, 4)
  const seconds = padded.slice(4, 6)

  return `${hours}:${minutes}:${seconds}`
})

// 入力ヒント
const inputHint = computed(() => {
  if (!inputDigits.value) return '数字を入力してください（例: 1030 → 10分30秒）'

  const totalSeconds = calculateSeconds(inputDigits.value)
  if (totalSeconds === 0) return '時間を設定してください'

  const parts = []
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) parts.push(`${hours}時間`)
  if (minutes > 0) parts.push(`${minutes}分`)
  if (seconds > 0) parts.push(`${seconds}秒`)

  return parts.join(' ')
})

// 初期時間設定
onMounted(() => {
  // タイマーの現在時間から入力を初期化
  if (state.value && state.value.totalSeconds > 0) {
    const total = state.value.totalSeconds
    const hours = Math.floor(total / 3600)
    const minutes = Math.floor((total % 3600) / 60)
    const seconds = total % 60

    inputDigits.value = `${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}${seconds.toString().padStart(2, '0')}`.replace(/^0+/, '') || '0'
  } else if (state.value && state.value.mode === 'countdown') {
    // デフォルトは5分
    inputDigits.value = '500'
    updateTimerFromInput()
  }
})

// タイマー状態が外部から変わったら入力を更新（プリセット選択時など）
watch(() => state.value?.totalSeconds, (newVal) => {
  if (newVal && newVal > 0 && state.value && !state.value.isRunning && !state.value.isPaused) {
    const total = newVal
    const hours = Math.floor(total / 3600)
    const minutes = Math.floor((total % 3600) / 60)
    const seconds = total % 60

    inputDigits.value = `${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}${seconds.toString().padStart(2, '0')}`.replace(/^0+/, '') || '0'
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

.presets-section {
  margin-bottom: 24px;
}

.preset-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  min-height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preset-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
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
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.2;
  color: rgba(var(--v-theme-on-surface), 0.87);
}

.time-setter {
  padding: 20px;
  border-radius: 12px;
  background-color: transparent;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

.time-display-container {
  text-align: center;
  margin-bottom: 16px;
}

.time-display {
  font-size: 2.5rem;
  font-weight: 700;
  font-family: 'Roboto Mono', monospace;
  color: rgb(var(--v-theme-primary));
  letter-spacing: 0.1em;
  margin-bottom: 8px;
  padding: 16px;
  background-color: rgb(var(--v-theme-surface));
  border-radius: 8px;
  border: 2px solid rgba(var(--v-theme-primary), 0.5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.time-input-hint {
  min-height: 20px;
  font-size: 0.875rem;
}

.number-pad {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.number-btn {
  height: 60px;
  font-size: 1.5rem;
  font-weight: 600;
  transition: all 0.2s;
}

.number-btn:active {
  transform: scale(0.95);
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

  .time-display {
    font-size: 2rem;
    padding: 12px;
  }

  .number-btn {
    height: 50px;
    font-size: 1.25rem;
  }
}
</style>
