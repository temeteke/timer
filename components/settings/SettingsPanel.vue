<template>
  <v-card elevation="0">
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2">mdi-cog</v-icon>
      設定
    </v-card-title>

    <v-card-text>
      <v-list>
        <!-- 通知設定 -->
        <v-list-item>
          <template #prepend>
            <v-icon>mdi-bell</v-icon>
          </template>
          <v-list-item-title>通知</v-list-item-title>
          <v-list-item-subtitle>
            タイマー終了時にブラウザ通知を表示
          </v-list-item-subtitle>
          <template #append>
            <v-switch
              :model-value="settings.soundEnabled"
              color="primary"
              hide-details
              @update:model-value="handleToggleSound"
            />
          </template>
        </v-list-item>

        <v-divider class="my-2" />

        <!-- 通知許可 -->
        <v-list-item v-if="!permissionGranted">
          <template #prepend>
            <v-icon color="warning">mdi-alert</v-icon>
          </template>
          <v-list-item-title>通知の許可が必要です</v-list-item-title>
          <v-list-item-subtitle>
            ブラウザ通知を受け取るには許可が必要です
          </v-list-item-subtitle>
          <template #append>
            <v-btn
              color="primary"
              variant="outlined"
              size="small"
              @click="handleRequestPermission"
            >
              許可する
            </v-btn>
          </template>
        </v-list-item>

        <v-list-item v-else>
          <template #prepend>
            <v-icon color="success">mdi-check-circle</v-icon>
          </template>
          <v-list-item-title>通知が許可されています</v-list-item-title>
          <v-list-item-subtitle>
            タイマー終了時に通知を受け取れます
          </v-list-item-subtitle>
        </v-list-item>

        <v-divider class="my-2" />

        <!-- バイブレーション設定 -->
        <v-list-item>
          <template #prepend>
            <v-icon>mdi-vibrate</v-icon>
          </template>
          <v-list-item-title>バイブレーション</v-list-item-title>
          <v-list-item-subtitle>
            タイマー終了時にバイブレーション（モバイルのみ）
          </v-list-item-subtitle>
          <template #append>
            <v-switch
              :model-value="settings.vibrationEnabled"
              color="primary"
              hide-details
              @update:model-value="handleToggleVibration"
            />
          </template>
        </v-list-item>

        <v-divider class="my-2" />

        <!-- テストボタン -->
        <v-list-item>
          <v-btn
            block
            color="primary"
            variant="outlined"
            prepend-icon="mdi-volume-high"
            @click="handleTestSound"
          >
            サウンドをテスト
          </v-btn>
        </v-list-item>
      </v-list>

      <!-- PWA情報 -->
      <v-alert
        class="mt-4"
        type="info"
        variant="tonal"
        density="compact"
        icon="mdi-information"
      >
        <div class="text-caption">
          <strong>PWA対応：</strong>
          このアプリはホーム画面に追加してオフラインで使用できます
        </div>
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const { settings, toggleSound, toggleVibration, saveSettings } = useTimerSettings()
const { permissionGranted, requestPermission } = useNotification()
const { playSound } = useSound()

// 通知の切り替え
const handleToggleSound = () => {
  toggleSound()
  saveSettings()
}

// バイブレーションの切り替え
const handleToggleVibration = () => {
  toggleVibration()
  saveSettings()
}

// 通知許可のリクエスト
const handleRequestPermission = async () => {
  await requestPermission()
}

// サウンドテスト
const handleTestSound = async () => {
  await playSound()
}
</script>

<style scoped>
.v-list-item {
  min-height: 64px;
}
</style>
