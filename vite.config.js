import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 支持通过环境变量 VITE_BASE_URL 设置 base path
// 默认：开发环境 '/'，生产环境 '/personal-profile/' (GitHub Pages)
// AWS Amplify 部署时设置 VITE_BASE_URL=/ 即可
const base = process.env.VITE_BASE_URL || (process.env.NODE_ENV === 'production' ? '/personal-profile/' : '/')

export default defineConfig({
  base,
  plugins: [react()],
})