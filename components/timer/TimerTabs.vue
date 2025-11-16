<template>
  <div class="timer-tabs">
    <!-- タブバー -->
    <v-tabs
      v-model="activeIndex"
      color="primary"
      align-tabs="start"
      show-arrows
      density="comfortable"
    >
      <v-tab
        v-for="(timer, index) in timers"
        :key="timer.id"
        :value="index"
        class="timer-tab"
      >
        <div class="tab-content">
          <!-- タイマーラベル -->
          <div class="tab-label">
            <v-icon size="small" class="mr-1">
              {{ timer.state.isRunning ? 'mdi-timer' : 'mdi-timer-outline' }}
            </v-icon>
            <span>{{ timer.label }}</span>
          </div>

          <!-- 実行中インジケーター -->
          <v-chip
            v-if="timer.state.isRunning"
            size="x-small"
            color="success"
            variant="flat"
            class="ml-2"
          >
            実行中
          </v-chip>

          <!-- 削除ボタン（タイマーが2つ以上ある場合のみ） -->
          <v-btn
            v-if="timers.length > 1"
            icon
            size="x-small"
            variant="text"
            class="ml-2 delete-btn"
            @click.stop="confirmDelete(index)"
          >
            <v-icon size="small">mdi-close</v-icon>
          </v-btn>
        </div>
      </v-tab>

      <!-- タイマー追加タブ -->
      <v-tab @click="handleAddTimer" class="add-timer-tab">
        <v-icon>mdi-plus</v-icon>
        <span class="ml-1">追加</span>
      </v-tab>
    </v-tabs>

    <!-- タブコンテンツ（表示は親コンポーネントで管理） -->

    <!-- ラベル編集ダイアログ -->
    <v-dialog v-model="showLabelDialog" max-width="400">
      <v-card>
        <v-card-title>タイマーラベルを編集</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editingLabel"
            label="ラベル"
            autofocus
            @keyup.enter="saveLabelEdit"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showLabelDialog = false">キャンセル</v-btn>
          <v-btn color="primary" @click="saveLabelEdit">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
  setLabel
} = useTimers()

// アクティブなタブインデックス（双方向バインディング用）
const activeIndex = computed({
  get: () => activeTimerIndex.value,
  set: (value: number) => switchTimer(value)
})

// ラベル編集
const showLabelDialog = ref(false)
const editingLabel = ref('')
const editingIndex = ref(-1)

const openLabelDialog = (index: number) => {
  editingIndex.value = index
  editingLabel.value = timers.value[index]?.label || ''
  showLabelDialog.value = true
}

const saveLabelEdit = () => {
  if (editingLabel.value.trim()) {
    setLabel(editingLabel.value.trim(), editingIndex.value)
  }
  showLabelDialog.value = false
}

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

// タイマー追加
const handleAddTimer = () => {
  addTimer() // timerCounterを使用するためにlabelパラメータを渡さない
}
</script>

<style scoped>
.timer-tabs {
  margin-bottom: 16px;
}

.timer-tab {
  text-transform: none;
  min-width: 120px;
}

.tab-content {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tab-label {
  display: flex;
  align-items: center;
}

.delete-btn {
  opacity: 0.6;
  transition: opacity 0.2s;
}

.delete-btn:hover {
  opacity: 1;
}

.add-timer-tab {
  min-width: auto;
  opacity: 0.7;
}

.add-timer-tab:hover {
  opacity: 1;
}
</style>
