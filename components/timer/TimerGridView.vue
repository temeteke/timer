<template>
  <div class="timer-grid-view">
    <v-container fluid>
      <v-row>
        <!-- タイマーカード -->
        <v-col
          v-for="(timer, index) in timers"
          :key="timer.id"
          cols="6"
          sm="4"
          md="3"
          lg="2"
        >
          <v-card
            :class="[
              'timer-card',
              { 'active-card': activeTimerIndex === index },
              { 'running-card': timer.state.isRunning },
              { 'paused-card': timer.state.isPaused }
            ]"
            :elevation="activeTimerIndex === index ? 8 : 2"
            @click="handleCardClick(index)"
            role="button"
            :aria-label="`${timer.label}${timer.state.isRunning ? ' 実行中' : timer.state.isPaused ? ' 一時停止中' : ''}`"
            tabindex="0"
            @keyup.enter="handleCardClick(index)"
          >
            <!-- ステータスバー -->
            <div :class="['status-bar', getStatusClass(timer)]"></div>

            <v-card-text class="pa-3">
              <!-- タイマー名 -->
              <div class="timer-name mb-2">
                <v-icon :size="16" class="mr-1" :color="getStatusColor(timer)">
                  {{ getStatusIcon(timer) }}
                </v-icon>
                <span class="text-truncate">{{ timer.label }}</span>
              </div>

              <!-- 時間表示 -->
              <div class="timer-time mb-3">
                {{ formatTime(timer) }}
              </div>

              <!-- モード表示 -->
              <div class="timer-mode mb-3">
                <v-chip
                  size="x-small"
                  :color="timer.state.mode === 'countdown' ? 'primary' : 'secondary'"
                  variant="tonal"
                >
                  {{ timer.state.mode === 'countdown' ? 'カウントダウン' : 'カウントアップ' }}
                </v-chip>
              </div>

              <!-- クイックアクション -->
              <div class="quick-actions" @click.stop>
                <!-- 再生/一時停止ボタン -->
                <v-btn
                  :icon="timer.state.isRunning ? 'mdi-pause' : 'mdi-play'"
                  size="small"
                  :color="timer.state.isRunning ? 'warning' : 'success'"
                  variant="tonal"
                  @click="handlePlayPause(index)"
                  :aria-label="timer.state.isRunning ? '一時停止' : '開始'"
                ></v-btn>

                <!-- リセットボタン -->
                <v-btn
                  icon="mdi-refresh"
                  size="small"
                  color="info"
                  variant="tonal"
                  @click="handleReset(index)"
                  :disabled="!timer.state.isRunning && !timer.state.isPaused"
                  aria-label="リセット"
                ></v-btn>

                <!-- 削除ボタン（2つ以上ある場合） -->
                <v-btn
                  v-if="timers.length > 1"
                  icon="mdi-delete"
                  size="small"
                  color="error"
                  variant="tonal"
                  @click="confirmDelete(index)"
                  :aria-label="`${timer.label}を削除`"
                ></v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- タイマー追加カード -->
        <v-col
          cols="6"
          sm="4"
          md="3"
          lg="2"
        >
          <v-card
            class="timer-card add-timer-card"
            :elevation="2"
            @click="handleAddTimer"
            role="button"
            aria-label="新しいタイマーを追加"
            tabindex="0"
            @keyup.enter="handleAddTimer"
          >
            <v-card-text class="pa-3 d-flex flex-column align-center justify-center" style="min-height: 180px;">
              <v-icon size="48" color="primary" class="mb-2">
                mdi-plus-circle-outline
              </v-icon>
              <div class="text-center">追加</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- 削除確認ダイアログ -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title>タイマーを削除</v-card-title>
        <v-card-text>
          「{{ deletingTimerLabel }}」を削除してもよろしいですか？
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showDeleteDialog = false">キャンセル</v-btn>
          <v-btn color="error" @click="executeDelete">削除</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
const {
  timers,
  activeTimerIndex,
  switchTimer,
  addTimer,
  removeTimer,
  start,
  pause,
  reset
} = useTimers()

// タイマー削除
const showDeleteDialog = ref(false)
const deletingIndex = ref(-1)

const deletingTimerLabel = computed(() => {
  return deletingIndex.value >= 0 ? timers.value[deletingIndex.value]?.label : ''
})

const confirmDelete = (index: number) => {
  deletingIndex.value = index
  showDeleteDialog.value = true
}

const executeDelete = () => {
  if (deletingIndex.value >= 0) {
    removeTimer(deletingIndex.value)
  }
  showDeleteDialog.value = false
  deletingIndex.value = -1
}

// カードクリック（タイマー切り替え）
const handleCardClick = (index: number) => {
  switchTimer(index)
}

// タイマー追加
const handleAddTimer = () => {
  addTimer()
}

// 再生/一時停止
const handlePlayPause = (index: number) => {
  const timer = timers.value[index]
  if (activeTimerIndex.value !== index) {
    switchTimer(index)
  }

  if (timer.state.isRunning) {
    pause()
  } else {
    start()
  }
}

// リセット
const handleReset = (index: number) => {
  if (activeTimerIndex.value !== index) {
    switchTimer(index)
  }
  reset()
}

// 時間フォーマット
const formatTime = (timer: any) => {
  const seconds = timer.state.mode === 'countdown'
    ? timer.state.remainingSeconds
    : timer.state.totalSeconds - timer.state.remainingSeconds

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// ステータスアイコン
const getStatusIcon = (timer: any) => {
  if (timer.state.isRunning) return 'mdi-play-circle'
  if (timer.state.isPaused) return 'mdi-pause-circle'
  return 'mdi-timer-outline'
}

// ステータスカラー
const getStatusColor = (timer: any) => {
  if (timer.state.isRunning) return 'success'
  if (timer.state.isPaused) return 'warning'
  return 'grey'
}

// ステータスクラス
const getStatusClass = (timer: any) => {
  if (timer.state.isRunning) return 'status-running'
  if (timer.state.isPaused) return 'status-paused'
  return 'status-stopped'
}
</script>

<style scoped>
.timer-grid-view {
  width: 100%;
}

.timer-card {
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border-radius: 8px !important;
  min-height: 180px;
}

.timer-card:hover {
  transform: translateY(-4px);
}

.active-card {
  border: 2px solid rgb(var(--v-theme-primary));
}

.running-card {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(76, 175, 80, 0);
  }
}

.status-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.status-running {
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  animation: progress 2s ease-in-out infinite;
}

.status-paused {
  background: #ff9800;
}

.status-stopped {
  background: #9e9e9e;
}

@keyframes progress {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.timer-name {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.87);
}

.timer-time {
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'Roboto Mono', monospace;
  text-align: center;
  color: rgb(var(--v-theme-primary));
}

.timer-mode {
  display: flex;
  justify-content: center;
}

.quick-actions {
  display: flex;
  justify-content: space-around;
  gap: 4px;
}

.add-timer-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px dashed rgba(var(--v-theme-primary), 0.3);
  background: rgba(var(--v-theme-surface), 0.5);
}

.add-timer-card:hover {
  transform: translateY(-4px);
  border-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.05);
}

/* モバイル最適化 */
@media (max-width: 600px) {
  .timer-time {
    font-size: 1.25rem;
  }

  .timer-card {
    min-height: 160px;
  }

  .quick-actions {
    gap: 2px;
  }
}
</style>
