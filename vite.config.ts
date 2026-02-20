import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Preload 경고 해결: modulePreload 비활성화
    modulePreload: false,
    // 청크 크기 경고 제한 상향 (선택사항)
    chunkSizeWarningLimit: 1000,
    // ✅ 최적화된 청크 분할
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React 코어 라이브러리
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-core';
          }
          // React Router
          if (id.includes('node_modules/react-router')) {
            return 'react-router';
          }
          // UI 라이브러리들
          if (id.includes('node_modules/lucide-react')) {
            return 'lucide';
          }
          if (id.includes('node_modules/@radix-ui')) {
            return 'radix-ui';
          }
          if (id.includes('node_modules/motion')) {
            return 'motion';
          }
          // 차트 라이브러리
          if (id.includes('node_modules/recharts')) {
            return 'recharts';
          }
          // 기타 큰 라이브러리들
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        },
      },
    },
  },
  // ✅ 개발 서버 최적화
  server: {
    hmr: {
      overlay: true
    }
  },
  // ✅ 최적화 설정
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router'
    ],
    exclude: [
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu'
    ]
  }
})