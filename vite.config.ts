import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    // 1. 核心配置：适配 GitHub Pages 路径（必须和仓库名一致！）
    base: '/arix-signature-interactive-birthday-tree/', // 仓库名是 arix-signature-interactive-birthday-tree，结尾必须带斜杠
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      // 修复重复定义（之前写了两次，删除重复项）
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'), // 别名配置没问题，保持不变
      }
    },
    // 2. 核心配置：明确打包入口，让 Vite 正确编译 index.tsx
    build: {
      input: './index.tsx', // 入口文件路径（根目录的 index.tsx）
      // 可选：简化打包后的文件名，方便排查路径
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[ext]', // 静态资源（CSS/图片）路径
          chunkFileNames: 'assets/[name].js',   // 代码分片路径
          entryFileNames: 'assets/[name].js'    // 入口文件路径（编译后的 index.js）
        }
      }
    }
  };
});
