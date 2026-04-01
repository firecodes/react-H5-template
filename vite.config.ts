import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import legacy from '@vitejs/plugin-legacy'
import postcssPxtorem from 'postcss-pxtorem'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    legacy({
      targets: ['chrome >= 49', 'ios >= 10'],
    }),
    react({
      babel: {
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-proposal-class-properties'],
        ],
      },
    }),
  ],
  css: {
    postcss: {
      plugins: [
        postcssPxtorem({
          rootValue: 37.5, // 基于 375px 设计稿
          propList: ['*'], // 需要转换的属性,* 表示所有属性
          selectorBlackList: [':root'], // 忽略的选择器
          minPixelValue: 1, // 小于或等于 1px 不转换为 rem
        }),
      ],
    },
  },
})
