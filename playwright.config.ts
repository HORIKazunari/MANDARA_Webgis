import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2Eテスト設定
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  /* 並列実行の設定 */
  fullyParallel: true,
  
  /* CI環境での設定 */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  /* レポーター設定 */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],
  
  /* 共通テスト設定 */
  use: {
    /* ベースURL - 開発サーバーのURL */
    baseURL: 'http://localhost:5173',
    
    /* スクリーンショット・動画の設定 */
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    /* トレース設定 */
    trace: 'on-first-retry',
  },

  /* 開発サーバーの起動設定 */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  /* テストするブラウザの設定 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* モバイルブラウザのテスト（必要に応じてコメント解除）
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    */
  ],
});
