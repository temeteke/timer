// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false, // SPAモード（GitHub Pages用）

  app: {
    baseURL: '/timer/', // GitHub Pagesのリポジトリ名に合わせる
    buildAssetsDir: 'assets',
    head: {
      title: 'Timer App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A simple and elegant timer application' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/timer/favicon.ico' }
      ]
    }
  },

  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css'
  ],

  build: {
    transpile: ['vuetify']
  },

  modules: [
    '@vite-pwa/nuxt'
  ],

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Timer App',
      short_name: 'Timer',
      description: 'A simple and elegant timer application',
      theme_color: '#1976D2',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        {
          src: '/timer/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/timer/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/timer/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  },

  devtools: { enabled: true },

  typescript: {
    strict: true,
    typeCheck: false // 開発時の高速化
  },

  vite: {
    ssr: {
      noExternal: ['vuetify']
    }
  },

  generate: {
    nojekyll: true // GitHub Pages用
  }
})
