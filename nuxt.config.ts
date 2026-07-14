export default defineNuxtConfig({
  css: ['assets/scss/main.scss'], 
  nitro: {
    preset: 'vercel'
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // Arahkan ke file variabel agar bersih dan tidak error
          additionalData: '@use "@/assets/scss/_variables.scss" as *;'
        }
      }
    }
  },
  
  modules: ['@pinia/nuxt'],
  compatibilityDate: '2026-07-14'
})