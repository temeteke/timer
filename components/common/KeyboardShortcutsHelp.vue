<template>
  <v-dialog
    v-model="showHelp"
    max-width="600"
    scrollable
  >
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-keyboard</v-icon>
        キーボードショートカット
        <v-spacer />
        <v-btn
          icon
          variant="text"
          @click="showHelp = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4">
        <div class="shortcuts-list">
          <!-- タイマー操作 -->
          <div class="shortcut-section">
            <h3 class="text-subtitle-1 font-weight-bold mb-3">
              <v-icon size="small" class="mr-1">mdi-play-pause</v-icon>
              タイマー操作
            </h3>
            <v-list density="compact" class="shortcut-items">
              <v-list-item
                v-for="(shortcut, index) in timerShortcuts"
                :key="index"
                class="shortcut-item"
              >
                <template #prepend>
                  <v-chip
                    size="small"
                    variant="outlined"
                    color="primary"
                    class="shortcut-key"
                  >
                    {{ formatKey(shortcut) }}
                  </v-chip>
                </template>
                <v-list-item-title>
                  {{ shortcut.description }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </div>

          <v-divider class="my-4" />

          <!-- タイマー管理 -->
          <div class="shortcut-section">
            <h3 class="text-subtitle-1 font-weight-bold mb-3">
              <v-icon size="small" class="mr-1">mdi-timer-multiple</v-icon>
              タイマー管理
            </h3>
            <v-list density="compact" class="shortcut-items">
              <v-list-item
                v-for="(shortcut, index) in timerManagementShortcuts"
                :key="index"
                class="shortcut-item"
              >
                <template #prepend>
                  <v-chip
                    size="small"
                    variant="outlined"
                    color="primary"
                    class="shortcut-key"
                  >
                    {{ formatKey(shortcut) }}
                  </v-chip>
                </template>
                <v-list-item-title>
                  {{ shortcut.description }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </div>

          <v-divider class="my-4" />

          <!-- プリセット -->
          <div class="shortcut-section">
            <h3 class="text-subtitle-1 font-weight-bold mb-3">
              <v-icon size="small" class="mr-1">mdi-clock-fast</v-icon>
              プリセット選択
            </h3>
            <v-list density="compact" class="shortcut-items">
              <v-list-item
                v-for="(shortcut, index) in presetShortcuts"
                :key="index"
                class="shortcut-item"
              >
                <template #prepend>
                  <v-chip
                    size="small"
                    variant="outlined"
                    color="primary"
                    class="shortcut-key"
                  >
                    {{ formatKey(shortcut) }}
                  </v-chip>
                </template>
                <v-list-item-title>
                  {{ shortcut.description }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </div>

          <v-divider class="my-4" />

          <!-- ヘルプ -->
          <div class="shortcut-section">
            <h3 class="text-subtitle-1 font-weight-bold mb-3">
              <v-icon size="small" class="mr-1">mdi-help-circle</v-icon>
              その他
            </h3>
            <v-list density="compact" class="shortcut-items">
              <v-list-item
                v-for="(shortcut, index) in otherShortcuts"
                :key="index"
                class="shortcut-item"
              >
                <template #prepend>
                  <v-chip
                    size="small"
                    variant="outlined"
                    color="primary"
                    class="shortcut-key"
                  >
                    {{ formatKey(shortcut) }}
                  </v-chip>
                </template>
                <v-list-item-title>
                  {{ shortcut.description }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          variant="flat"
          @click="showHelp = false"
        >
          閉じる
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { KeyboardShortcut } from '~/composables/useKeyboardShortcuts'

const { shortcuts, showHelp } = useKeyboardShortcuts()

// ショートカットをカテゴリ別に分類
const timerShortcuts = computed(() => {
  return shortcuts.filter(s =>
    s.key === 'Space' || s.key === 'r'
  )
})

const timerManagementShortcuts = computed(() => {
  return shortcuts.filter(s =>
    s.key === 'n' || s.key === 'Tab'
  )
})

const presetShortcuts = computed(() => {
  return shortcuts.filter(s =>
    ['1', '2', '3', '4'].includes(s.key)
  )
})

const otherShortcuts = computed(() => {
  return shortcuts.filter(s =>
    s.key === '?'
  )
})

/**
 * キー表記をフォーマット
 */
const formatKey = (shortcut: KeyboardShortcut): string => {
  const modifiers = shortcut.modifiers || {}
  const parts: string[] = []

  if (modifiers.ctrl) parts.push('Ctrl')
  if (modifiers.shift) parts.push('Shift')
  if (modifiers.alt) parts.push('Alt')
  if (modifiers.meta) parts.push('Cmd')

  // キー名を日本語化
  let keyName = shortcut.key
  if (keyName === 'Space') keyName = 'スペース'
  if (keyName === 'Tab') keyName = 'Tab'

  parts.push(keyName.toUpperCase())

  return parts.join(' + ')
}
</script>

<style scoped>
.shortcuts-list {
  max-height: 600px;
}

.shortcut-section {
  margin-bottom: 16px;
}

.shortcut-item {
  padding: 8px 0;
}

.shortcut-key {
  min-width: 80px;
  justify-content: center;
  font-family: 'Courier New', monospace;
  font-weight: 600;
}

.shortcut-items {
  background: transparent;
}
</style>
