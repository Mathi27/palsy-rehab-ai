import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // 1. THIS IS THE FIX: Ensures assets load correctly on any hosting platform
  base: './', 
  
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Include your specific icon
      includeAssets: ['face-app-icon.ico'],
      manifest: {
        name: 'Face App Rehab',
        short_name: 'FaceApp',
        description: 'Guided facial rehabilitation and palsy tracking',
        theme_color: '#0284c7',
        background_color: '#f8fafc',
        display: "standalone",
        icons: [
          {
            src: 'face-app-icon.ico', // Removed leading slash for relative path
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon'
          }
        ]
      },
      workbox: {
        // 2. THIS IS THE FIX: Clears old broken versions of the app automatically
        cleanupOutdatedCaches: true, 
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mediapipe-assets-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
})