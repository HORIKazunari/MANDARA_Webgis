import { beforeAll, describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { AppState, appState } from '../src/core/AppState';
import { clsAttrData, point, rectangle } from '../src/clsAttrData';
import { clsPrint } from '../src/clsPrint';
import { Setting_Info } from '../src/clsTime';

describe('japan_climate altitude class paint visibility', () => {
  beforeAll(async () => {
    AppState.reset();
    const state = appState() as {
      preReadMapFile: Record<string, unknown>;
      tileMapClass?: { getTileMapData: (key: string) => Record<string, unknown> };
      settingData?: Setting_Info;
      attrData?: clsAttrData;
    };

    (globalThis as { preReadMapFile?: Record<string, unknown> }).preReadMapFile = state.preReadMapFile;
    await import('../src/japanLatLonMap.ts');
    await import('../src/japanmap.ts');

    state.tileMapClass = {
      getTileMapData: (_key: string) => ({}),
    };
    state.settingData = new Setting_Info();
  });

  it('標高の階級区分モードで大半の地点が表示対象になる', () => {
    const state = appState() as {
      attrData?: clsAttrData;
    };
    const raw = execFileSync('unzip', ['-p', 'data/japan_climate.mdrj'], {
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024,
    });
    const jsonText = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;

    const attr = new clsAttrData();
    state.attrData = attr;

    const ret = attr.OpenNewMandaraFile([], jsonText, 'japan_climate.mdrj', 'mdrj');
    expect(ret.ok).toBe(true);

    attr.TotalData.ViewStyle.ScrData.Set_PictureBox_and_CulculateMul(new rectangle(0, 620, 0, 492));
    attr.ResetObjectPrintedCheckFlag();

    const categoryArray: number[] = [];
    const drawOrder: number[] = [];
    const showF: boolean[] = [];
    clsPrint.getDrawOrder_and_ShowF_ClassMode(0, 0, categoryArray, drawOrder, showF);

    const visibleCount = showF.filter(Boolean).length;
    expect(attr.LayerData[0].Shape).toBe(0);
    expect(attr.LayerData[0].atrObject.ObjectNum).toBeGreaterThan(100);
    expect(visibleCount).toBeGreaterThan(100);

    const firstVisible = showF.findIndex(Boolean);
    expect(firstVisible).toBeGreaterThanOrEqual(0);
    const firstPoint = attr.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(
      attr.LayerData[0].atrObject.atrObjectData[firstVisible].Symbol,
    ) as point;
    expect(Number.isFinite(firstPoint.x)).toBe(true);
    expect(Number.isFinite(firstPoint.y)).toBe(true);
  });
});