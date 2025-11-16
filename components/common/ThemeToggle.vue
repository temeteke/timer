<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn
        icon
        variant="text"
        size="small"
        v-bind="props"
        :aria-label="`テーマ: ${getThemeLabel()}`"
      >
        <v-icon>{{ getThemeIcon() }}</v-icon>
        <v-tooltip activator="parent" location="bottom">
          テーマ: {{ getThemeLabel() }}
        </v-tooltip>
      </v-btn>
    </template>

    <v-list density="compact">
      <v-list-item
        v-for="mode in themeModes"
        :key="mode"
        :active="themeMode === mode"
        @click="setThemeMode(mode)"
      >
        <template #prepend>
          <v-icon>{{ getThemeIcon(mode) }}</v-icon>
        </template>
        <v-list-item-title>{{ getThemeLabel(mode) }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import type { ThemeMode } from '~/composables/useTheme'

const { themeMode, setThemeMode, getThemeIcon, getThemeLabel } = useTheme()

const themeModes: ThemeMode[] = ['light', 'dark', 'auto']
</script>
