import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
  plugins: [
    react(),
    // Gzip压缩
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 1024,
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Brotli压缩
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 1024,
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // 代码压缩配置
    minify: 'terser', // 使用terser获得更好的压缩
    cssMinify: true,
    // Terser压缩选项
    terserOptions: {
      compress: {
        drop_console: env.VITE_DEBUG !== 'true', // 根据环境变量决定是否删除console.log
        drop_debugger: true, // 删除debugger
        pure_funcs: env.VITE_DEBUG !== 'true' ? ['console.log'] : [], // 根据环境变量决定是否删除console.log
      },
      mangle: {
        safari10: true, // 支持Safari 10
      },
    },
    // 分包配置
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          antd: ['antd-mobile'],
          router: ['react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
        },
      },
    },
    // 压缩配置
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
  },
  server: {
    proxy: {
      '/api': {
        target: env.VITE_PROXY_TARGET || 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  }
})
