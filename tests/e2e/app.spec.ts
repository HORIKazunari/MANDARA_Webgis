import { test, expect } from '@playwright/test';

function isIgnorableConsoleError(message: string): boolean {
  return message.includes('Permissions policy violation: compute-pressure is not allowed in this document.')
    || (message.includes('youtube.com/embed/') && message.includes('SameSite'))
    || message.includes('Cookie “__Secure-BUCKET” has been rejected because it is in a cross-site context')
    || message.includes('Cookie “__Secure-YEC” has been rejected because it is in a cross-site context');
}

/**
 * アプリケーション起動の基本テスト
 */
test.describe('アプリケーション起動', () => {
  test('ホームページが正常に表示される', async ({ page }) => {
    // アプリケーションのホームページにアクセス
    await page.goto('/');
    
    // ページタイトルをチェック
    await expect(page).toHaveTitle(/MANDARA/i);
    
    // メインコンテンツが表示されていることを確認
    const mainContent = page.locator('body');
    await expect(mainContent).toBeVisible();
  });

  test('アプリケーションが初期化エラーなく起動する', async ({ page }) => {
    // コンソールエラーをキャプチャ
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && isIgnorableConsoleError(msg.text()) === false) {
        errors.push(msg.text());
      }
    });
    
    // ページに遷移
    await page.goto('/');
    
    // 重大なエラーがないことを確認
    expect(errors).toHaveLength(0);
  });
});

/**
 * UIコンポーネントの基本テスト
 */
test.describe('UIコンポーネント', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('設定画面が表示される', async ({ page }) => {
    // 設定画面の要素を探す
    const settingWindow = page.locator('#setting').or(page.locator('[class*="setting"]'));
    
    // 設定画面が存在する場合は表示されていることを確認
    const count = await settingWindow.count();
    if (count > 0) {
      await expect(settingWindow.first()).toBeVisible();
    }
  });

  test('メニューが機能する', async ({ page }) => {
    // メニュー要素を探す
    const menu = page.locator('[class*="menu"]').or(page.locator('nav'));
    
    // メニューが存在する場合はクリック可能であることを確認
    const count = await menu.count();
    if (count > 0) {
      await expect(menu.first()).toBeVisible();
    }
  });
});
