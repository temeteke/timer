<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="text-h4 text-center mb-4">
            Timer App
          </v-card-title>
          <v-card-text class="text-center">
            <v-icon size="64" color="primary">
              mdi-timer-outline
            </v-icon>
            <p class="text-h6 mt-4">
              セットアップ完了！
            </p>
            <p class="text-body-1">
              Nuxt 3 + Vuetify 3 のタイマーアプリケーションです。
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// メインページ
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
