<template>
  <v-card elevation="0">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-history</v-icon>
        タイマー履歴
      </div>
      <v-btn
        v-if="history.length > 0"
        variant="text"
        size="small"
        color="error"
        @click="showClearDialog = true"
      >
        クリア
      </v-btn>
    </v-card-title>

    <v-card-text>
      <!-- 統計情報 -->
      <v-row v-if="history.length > 0" class="mb-4">
        <v-col cols="6" sm="3">
          <v-card variant="tonal" color="primary">
            <v-card-text class="text-center pa-3">
              <div class="text-h5 font-weight-bold">{{ stats.totalCount }}</div>
              <div class="text-caption">総回数</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" sm="3">
          <v-card variant="tonal" color="success">
            <v-card-text class="text-center pa-3">
              <div class="text-h5 font-weight-bold">{{ stats.totalCompleted }}</div>
              <div class="text-caption">完了</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" sm="3">
          <v-card variant="tonal" color="info">
            <v-card-text class="text-center pa-3">
              <div class="text-h5 font-weight-bold">{{ stats.countdownCount }}</div>
              <div class="text-caption">カウントダウン</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" sm="3">
          <v-card variant="tonal" color="warning">
            <v-card-text class="text-center pa-3">
              <div class="text-h5 font-weight-bold">{{ stats.countupCount }}</div>
              <div class="text-caption">カウントアップ</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- フィルター -->
      <v-tabs v-model="activeTab" color="primary" class="mb-4">
        <v-tab value="all">すべて</v-tab>
        <v-tab value="today">今日</v-tab>
        <v-tab value="week">今週</v-tab>
      </v-tabs>

      <!-- 履歴リスト -->
      <v-list v-if="filteredHistory.length > 0" class="history-list">
        <v-list-item
          v-for="entry in filteredHistory"
          :key="entry.id"
          class="history-item"
        >
          <template #prepend>
            <v-avatar
              :color="entry.completed ? 'success' : 'warning'"
              size="40"
            >
              <v-icon color="white">
                {{ entry.mode === 'countdown' ? 'mdi-timer-sand' : 'mdi-timer' }}
              </v-icon>
            </v-avatar>
          </template>

          <v-list-item-title>{{ entry.label }}</v-list-item-title>
          <v-list-item-subtitle>
            <div class="d-flex flex-column">
              <span>{{ formatDuration(entry.duration) }}</span>
              <span class="text-caption">{{ formatDateTime(entry.completedAt) }}</span>
            </div>
          </v-list-item-subtitle>

          <template #append>
            <v-chip
              :color="entry.completed ? 'success' : 'warning'"
              size="small"
              variant="flat"
            >
              {{ entry.completed ? '完了' : '中断' }}
            </v-chip>
            <v-btn
              icon
              size="small"
              variant="text"
              @click="removeHistoryEntry(entry.id)"
            >
              <v-icon size="small">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </v-list>

      <!-- 履歴なし -->
      <v-alert
        v-else
        type="info"
        variant="tonal"
        density="compact"
        icon="mdi-information"
      >
        履歴がありません
      </v-alert>
    </v-card-text>

    <!-- クリア確認ダイアログ -->
    <v-dialog v-model="showClearDialog" max-width="400">
      <v-card>
        <v-card-title>履歴をクリア</v-card-title>
        <v-card-text>
          すべての履歴を削除してもよろしいですか？この操作は元に戻せません。
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showClearDialog = false">キャンセル</v-btn>
          <v-btn color="error" @click="handleClearHistory">削除</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
const {
  history,
  removeHistoryEntry,
  clearHistory,
  getStatistics,
  todayHistory,
  thisWeekHistory,
  formatDuration,
  formatDateTime
} = useTimerHistory()

const activeTab = ref('all')
const showClearDialog = ref(false)

// 統計情報
const stats = getStatistics

// フィルター済み履歴
const filteredHistory = computed(() => {
  switch (activeTab.value) {
    case 'today':
      return todayHistory.value
    case 'week':
      return thisWeekHistory.value
    default:
      return history.value
  }
})

const handleClearHistory = () => {
  clearHistory()
  showClearDialog.value = false
}
</script>

<style scoped>
.history-list {
  max-height: 400px;
  overflow-y: auto;
}

.history-item {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
}

.history-item:last-child {
  border-bottom: none;
}
</style>
