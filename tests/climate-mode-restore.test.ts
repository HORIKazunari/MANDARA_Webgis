import { describe, it, expect, beforeAll } from 'vitest';
import { execFileSync } from 'node:child_process';
import { appState } from '../src/core/AppState';
import { clsAttrData } from '../src/clsAttrData';

describe('climate MDRJ mode restore', () => {
  beforeAll(async () => {
    (globalThis as { preReadMapFile?: Record<string, unknown> }).preReadMapFile = appState().preReadMapFile;
    (appState() as { tileMapClass?: { getTileMapData: (key: string) => Record<string, unknown> } }).tileMapClass = {
      getTileMapData: (_key: string) => ({}),
    };
    (appState() as { settingData?: { ObjectName_Word_Compatible: string; KatakanaCheck: boolean } }).settingData = {
      ObjectName_Word_Compatible: '',
      KatakanaCheck: false,
    };
    await import('../src/japanLatLonMap.ts');
  });

  it('旧形式の ModeData から SoloMode を復元して 1月降水量を等値線モードで開ける', () => {
    const raw = execFileSync('unzip', ['-p', 'data/japan_climate.mdrj'], {
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024,
    });
    const jsonText = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;

    const attr = new clsAttrData();
    const result = attr.SetDataFromMDRJ([], jsonText);

    expect(result.ok).toBe(true);
    expect(attr.TotalData.LV1.SelectedLayer).toBe(0);

    const layer = attr.LayerData[0];
    const selectedDataIndex = layer.atrData.SelectedIndex;
    const selectedData = layer.atrData.Data[selectedDataIndex];

    expect(selectedData.Title).toBe('1月降水量');
    expect(selectedData.ModeData).toBe(3);
    expect(attr.getSoloMode(0, selectedDataIndex)).toBe(3);
  });
});