import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    // テスト環境の設定
    environment: 'happy-dom',
    
    // グローバルテストAPI (describe, it, expect等) を自動インポート
    globals: true,
    
    // カバレッジ設定
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        'public/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
      ],
    },
    
    // テストファイルのパターン
    include: ['src/**/*.{test,spec}.{js,ts}', 'tests/**/*.{test,spec}.{js,ts}'],
    
    // テストのタイムアウト設定
    testTimeout: 10000,
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
