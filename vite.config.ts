import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    base: process.env.BASE_URL || '/',
})
