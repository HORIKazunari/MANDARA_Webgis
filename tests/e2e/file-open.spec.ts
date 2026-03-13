import { test, expect } from '@playwright/test';

const FILE_OPEN_URL = '/mandarawebgis.html?file=data/japan_data.mdrj';
const CLIMATE_FILE_OPEN_URL = '/mandarawebgis.html?file=data/japan_climate.mdrj';
const MDRMJ_FILE_OPEN_URL = '/mandarawebgis.html?file=data/japan_sityoson_pop.mdrmj';
const WORLD_MDRMJ_FILE_OPEN_URL = '/mandarawebgis.html?file=data/worldpopulation3.mdrmj';

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

  test('japan_climate.mdrj は読み込み時に等値線モードを復元する', async ({ page }) => {
    await page.goto(CLIMATE_FILE_OPEN_URL, {
      waitUntil: 'domcontentloaded',
    });

    const settingPanel = page.locator('#SettingPanel');
    const contourView = page.locator('#contourView');
    const markSizeView = page.locator('#markSizeView');

    await expect(settingPanel).toBeVisible({ timeout: 10000 });
    await expect(contourView).toBeVisible();
    await expect(markSizeView).not.toBeVisible();
  });

  test('japan_climate.mdrj 読み込み後に描画開始すると等値線地図を描画できる', async ({ page }) => {
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

    await page.goto(CLIMATE_FILE_OPEN_URL, {
      waitUntil: 'domcontentloaded',
    });

    const settingPanel = page.locator('#SettingPanel');
    const drawButton = page.locator('#btnDraw');

    await expect(settingPanel).toBeVisible({ timeout: 10000 });
    await expect(drawButton).toBeVisible();
    await expect(drawButton).toBeEnabled();

    await drawButton.click();
    await expect(page.locator('#frmPrint')).toBeVisible({ timeout: 10000 });

    await expect
      .poll(async () => {
        return page.evaluate(() => {
          const canvas = document.getElementById('mapArea') as HTMLCanvasElement | null;
          if (!canvas) {
            return -1;
          }
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return -1;
          }

          const stepX = Math.max(1, Math.floor(canvas.width / 60));
          const stepY = Math.max(1, Math.floor(canvas.height / 40));
          let nonWhiteSamples = 0;

          for (let y = 0; y < canvas.height; y += stepY) {
            for (let x = 0; x < canvas.width; x += stepX) {
              const pixel = ctx.getImageData(x, y, 1, 1).data;
              if (pixel[0] < 250 || pixel[1] < 250 || pixel[2] < 250) {
                nonWhiteSamples++;
              }
            }
          }

          return nonWhiteSamples;
        });
      }, { timeout: 10000 })
      .toBeGreaterThan(50);

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

  test('worldpopulation3.mdrmj 読み込み後に描画開始しても描画エラーが発生しない', async ({ page }) => {
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

    await page.goto(WORLD_MDRMJ_FILE_OPEN_URL, {
      waitUntil: 'domcontentloaded',
    });

    const settingPanel = page.locator('#SettingPanel');
    const drawButton = page.locator('#btnDraw');

    await expect(settingPanel).toBeVisible({ timeout: 10000 });
    await expect(drawButton).toBeVisible();
    await expect(drawButton).toBeEnabled();

    await drawButton.click();
    await expect(page.locator('#frmPrint')).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1000);

    expect(dialogs).toEqual([]);
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
});
