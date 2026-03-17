import { test, expect } from '@playwright/test';

const FILE_OPEN_URL = '/mandarawebgis.html?file=data/japan_data.mdrj';
const CLIMATE_FILE_OPEN_URL = '/mandarawebgis.html?file=data/japan_climate.mdrj';
const LANDPRICE_FILE_OPEN_URL = '/mandarawebgis.html?file=data/landprice2021.mdrj';
const MDRMJ_FILE_OPEN_URL = '/mandarawebgis.html?file=data/japan_sityoson_pop.mdrmj';
const WORLD_MDRMJ_FILE_OPEN_URL = '/mandarawebgis.html?file=data/worldpopulation3.mdrmj';

type RgbColor = [number, number, number];

async function getVisibleClassPaintColors(page: import('@playwright/test').Page): Promise<RgbColor[]> {
  return page.evaluate(() => {
    const colors: Array<[number, number, number]> = [];
    for (let index = 0; index < 20; index++) {
      const canvas = document.getElementById(`picClassBox${index}`) as HTMLCanvasElement | null;
      if (!canvas) {
        break;
      }
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        continue;
      }
      const context = canvas.getContext('2d');
      if (!context) {
        continue;
      }
      const pixel = context.getImageData(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1).data;
      if (pixel[3] === 0) {
        continue;
      }
      colors.push([pixel[0], pixel[1], pixel[2]]);
    }

    return colors.filter((color, index, source) => source.findIndex((target) => (
      target[0] === color[0] && target[1] === color[1] && target[2] === color[2]
    )) === index);
  });
}

async function countCanvasPixelsByColors(page: import('@playwright/test').Page, colors: RgbColor[]): Promise<number> {
  return page.evaluate((targets) => {
    const canvas = document.getElementById('mapArea') as HTMLCanvasElement | null;
    if (!canvas) {
      return -1;
    }
    const context = canvas.getContext('2d');
    if (!context) {
      return -1;
    }
    const targetSet = new Set(targets.map((color) => color.join(',')));
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let hitCount = 0;

    for (let index = 0; index < imageData.length; index += 4) {
      if (imageData[index + 3] === 0) {
        continue;
      }
      const key = `${imageData[index]},${imageData[index + 1]},${imageData[index + 2]}`;
      if (targetSet.has(key)) {
        hitCount++;
      }
    }

    return hitCount;
  }, colors);
}

async function selectFirstPointClassPaintDataItem(page: import('@playwright/test').Page): Promise<{ value: string; text: string } | null> {
  const options = await page.locator('#selectDataItem option').evaluateAll((nodes) =>
    nodes.map((node) => ({
      value: (node as HTMLOptionElement).value,
      text: (node.textContent ?? '').trim(),
    }))
  );

  for (const option of options) {
    await page.selectOption('#selectDataItem', option.value);
    await page.waitForTimeout(150);
    const classViewVisible = await page.locator('#classView').isVisible();
    const pointMarkVisible = await page.locator('#gbPointMark').isVisible();
    const contourViewVisible = await page.locator('#contourView').isVisible();
    if (classViewVisible && pointMarkVisible && !contourViewVisible) {
      return option;
    }
  }

  return null;
}

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

  test('japan_climate.mdrj は標高へ切り替えるとペイントモードで描画できる', async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];

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

    await expect(page.locator('#SettingPanel')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#contourView')).toBeVisible();

    await page.selectOption('#selectDataItem', '0');

    await expect(page.locator('#classView')).toBeVisible();
    await expect(page.locator('#contourView')).not.toBeVisible();
    await expect(page.locator('#gbPointMark')).toBeVisible();

    const classPaintColors = await getVisibleClassPaintColors(page);
    expect(classPaintColors.length).toBeGreaterThan(0);

    await page.locator('#btnDraw').click();
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
      .toBeGreaterThan(20);

    await expect
      .poll(async () => countCanvasPixelsByColors(page, classPaintColors), { timeout: 10000 })
      .toBeGreaterThan(20);

    await page.waitForTimeout(1200);

    await expect
      .poll(async () => countCanvasPixelsByColors(page, classPaintColors), { timeout: 10000 })
      .toBeGreaterThan(20);

    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });

  test('landprice2021.mdrj でも PointShape のペイントモード描画ができる', async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];

    page.on('pageerror', error => {
      pageErrors.push(String(error));
    });

    page.on('console', message => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    await page.goto(LANDPRICE_FILE_OPEN_URL, {
      waitUntil: 'domcontentloaded',
    });

    await expect(page.locator('#SettingPanel')).toBeVisible({ timeout: 10000 });
    const selected = await selectFirstPointClassPaintDataItem(page);
    expect(selected).not.toBeNull();
    await expect(page.locator('#classView')).toBeVisible();
    await expect(page.locator('#gbPointMark')).toBeVisible();

    const classPaintColors = await getVisibleClassPaintColors(page);
    expect(classPaintColors.length).toBeGreaterThan(0);

    await page.locator('#btnDraw').click();
    await expect(page.locator('#frmPrint')).toBeVisible({ timeout: 10000 });

    await expect
      .poll(async () => countCanvasPixelsByColors(page, classPaintColors), { timeout: 10000 })
      .toBeGreaterThan(20);

    await page.waitForTimeout(1200);

    await expect
      .poll(async () => countCanvasPixelsByColors(page, classPaintColors), { timeout: 10000 })
      .toBeGreaterThan(20);

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

  test('japan_data.mdrj 読み込み後に重ね合わせセットを押しても実行時エラーが発生しない', async ({ page }) => {
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

    const settingPanel = page.locator('#SettingPanel');
    const overlaySetButton = page.locator('#btnOverlaySet');

    await expect(settingPanel).toBeVisible({ timeout: 10000 });
    await expect(overlaySetButton).toBeVisible();
    await expect(overlaySetButton).toBeEnabled();

    await overlaySetButton.click();
    await page.waitForTimeout(500);

    expect(dialogs).toEqual([]);
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
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
