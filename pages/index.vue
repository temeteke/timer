<template>
  <v-container fluid class="timer-page">
    <!-- ヘッダー -->
    <v-row justify="center">
      <v-col cols="12">
        <div class="app-header text-center py-4">
          <div class="header-content">
            <h1 class="text-h4 text-md-h3 font-weight-bold">
              <v-icon size="large" color="primary" class="mr-2">
                mdi-timer-outline
              </v-icon>
              Timer
            </h1>
            <div class="header-actions">
              <!-- テーマ切り替えボタン -->
              <ThemeToggle />
              <!-- キーボードショートカットヘルプボタン -->
              <v-btn
                icon
                variant="text"
                size="small"
                class="keyboard-help-btn"
                @click="toggleHelp"
              >
                <v-icon>mdi-keyboard</v-icon>
                <v-tooltip activator="parent" location="bottom">
                  キーボードショートカット (?)
                </v-tooltip>
              </v-btn>
            </div>
          </div>
          <p class="text-subtitle-1 text-medium-emphasis mt-2">
            シンプルで使いやすいタイマーアプリ
          </p>
        </div>
      </v-col>
    </v-row>

    <!-- メインコンテンツ -->
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8" xl="6">
        <!-- メインタイマーカード -->
        <v-card elevation="4" class="main-card mb-6">
          <!-- タイマー表示 -->
          <TimerDisplay />

          <v-divider class="my-2" />

          <!-- タイマーコントロール -->
          <TimerControls />
        </v-card>

        <!-- 設定と履歴 -->
        <v-card elevation="4" class="main-card">
          <v-expansion-panels variant="accordion">
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-icon class="mr-2">mdi-cog</v-icon>
                設定
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <SettingsPanel />
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-icon class="mr-2">mdi-history</v-icon>
                履歴
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <TimerHistory />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-col>
    </v-row>

    <!-- フッター -->
    <v-row justify="center" class="mt-6">
      <v-col cols="12">
        <div class="app-footer text-center py-4">
          <p class="text-caption text-medium-emphasis">
            Built with Nuxt 3 + Vuetify 3
          </p>
        </div>
      </v-col>
    </v-row>

    <!-- キーボードショートカットヘルプダイアログ -->
    <KeyboardShortcutsHelp />
  </v-container>
</template>

<script setup lang="ts">
// メインページ
// 単一タイマー用のシンプルなレイアウト

// ページメタデータ
useHead({
  title: 'Timer - シンプルなタイマー',
  meta: [
    {
      name: 'description',
      content: 'Nuxt 3とVuetify 3で作られたシンプルで使いやすいタイマーアプリケーション。カウントダウン、カウントアップに対応。'
    }
  ]
})

// 設定とタイマーを読み込み
const { loadSettings } = useTimerSettings()
const { loadTimer } = useTimers()

// テーマ管理
const { initTheme } = useTheme()

// タイマー履歴
const { loadHistory } = useTimerHistory()

// キーボードショートカットを有効化
const { toggleHelp } = useKeyboardShortcuts()

onMounted(() => {
  loadSettings()
  loadTimer()
  loadHistory()
  initTheme()
})
</script>

<style scoped>
.timer-page {
  min-height: 100vh;
  padding-top: 20px;
  padding-bottom: 40px;
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.02) 100%);
}

.app-header {
  margin-bottom: 20px;
  position: relative;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.keyboard-help-btn {
  opacity: 0.7;
  transition: opacity 0.2s;
}

.keyboard-help-btn:hover {
  opacity: 1;
}

.main-card {
  border-radius: 16px;
  overflow: hidden;
}

.app-footer {
  margin-top: 20px;
}

/* レスポンシブ対応 */
@media (max-width: 960px) {
  .timer-page {
    padding-top: 10px;
  }
}

@media (max-width: 600px) {
  .app-header h1 {
    font-size: 1.75rem;
  }

  .app-header p {
    font-size: 0.875rem;
  }

  .main-card {
    border-radius: 12px;
  }
}
</style>
