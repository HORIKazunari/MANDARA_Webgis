import { test, expect } from '@playwright/test';

const FILE_OPEN_URL = '/mandarawebgis.html?file=data/japan_data.mdrj';
const MDRMJ_FILE_OPEN_URL = '/mandarawebgis.html?file=data/japan_sityoson_pop.mdrmj';

/**
 * `?file=...` 指定での地図データ読み込み回帰テスト。
 */
test.describe('URL指定ファイル読み込み', () => {
  test('japan_data.mdrj を開いても展開失敗エラーが発生しない', async ({ page }) => {
    const dialogs: string[] = [];
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];

    page.on('dialog', async dialog => {
      dialogs.push(dialog.message());
      await dialog.dismiss();
    });

    page.on('pageerror', error => {
      pageErrors.push(String(error));
    });

    page.on('console', message => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    await page.goto(FILE_OPEN_URL, {
      waitUntil: 'domcontentloaded',
    });

    // 初期化とファイル展開処理の完了を待つ。
    await page.waitForTimeout(5000);

    expect(dialogs).toEqual([]);
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });

  test('japan_sityoson_pop.mdrmj を開いても展開失敗エラーが発生しない', async ({ page }) => {
    const dialogs: string[] = [];
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];

    page.on('dialog', async dialog => {
      dialogs.push(dialog.message());
      await dialog.dismiss();
    });

    page.on('pageerror', error => {
      pageErrors.push(String(error));
    });

    page.on('console', message => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    await page.goto(MDRMJ_FILE_OPEN_URL, {
      waitUntil: 'domcontentloaded',
    });

    await page.waitForTimeout(5000);

    expect(dialogs).toEqual([]);
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });

  test('japan_data.mdrj 読み込み後に描画開始で地図画面が開く', async ({ page }) => {
    await page.goto(FILE_OPEN_URL, {
      waitUntil: 'domcontentloaded',
    });

    const settingPanel = page.locator('#SettingPanel');
    const drawButton = page.locator('#btnDraw');

    await expect(settingPanel).toBeVisible({ timeout: 10000 });
    await expect(drawButton).toBeVisible();
    await expect(drawButton).toBeEnabled();
    await expect(drawButton).toHaveValue('描画開始');

    await drawButton.click();
    await expect(page.locator('#frmPrint')).toBeVisible({ timeout: 10000 });
  });

  test('japan_sityoson_pop.mdrmj 読み込み後に描画開始で地図画面が開く', async ({ page }) => {
    await page.goto(MDRMJ_FILE_OPEN_URL, {
      waitUntil: 'domcontentloaded',
    });

    const settingPanel = page.locator('#SettingPanel');
    const drawButton = page.locator('#btnDraw');

    await expect(settingPanel).toBeVisible({ timeout: 10000 });
    await expect(drawButton).toBeVisible();
    await expect(drawButton).toBeEnabled();
    await expect(drawButton).toHaveValue('描画開始');

    await drawButton.click();
    await expect(page.locator('#frmPrint')).toBeVisible({ timeout: 10000 });
  });
});
