import { describe, it, expect, beforeAll } from 'vitest';
import { execFileSync } from 'node:child_process';
import { appState } from '../src/core/AppState';
import { clsAttrData } from '../src/clsAttrData';

type MdrmjLike = {
  mapData?: Record<string, {
    MPObj?: Array<{
      DefTimeAttValue?: Array<{
        Data?: Array<Record<string, unknown>>;
      }>;
    }>;
  }>;
};

describe('mdrmj missing span regression', () => {
  beforeAll(async () => {
    (globalThis as { preReadMapFile?: Record<string, unknown> }).preReadMapFile = appState().preReadMapFile;
    (appState() as { tileMapClass?: { getTileMapData: (key: string) => Record<string, unknown> } }).tileMapClass = {
      getTileMapData: (_key: string) => ({}),
    };
    (appState() as { settingData?: { ObjectName_Word_Compatible: string; KatakanaCheck: boolean } }).settingData = {
      ObjectName_Word_Compatible: '',
      KatakanaCheck: false,
    };
  });

  it('Span が省略された mdrmj を開いてもクラッシュせず null 時間として復元する', () => {
    const raw = execFileSync('unzip', ['-p', 'data/japan_sityoson_pop.mdrmj'], {
      encoding: 'utf8',
      maxBuffer: 200 * 1024 * 1024,
    });
    const jsonText = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
    const json = JSON.parse(jsonText) as MdrmjLike;

    let target:
      | {
          mapName: string;
          objectIndex: number;
          defIndex: number;
          dataIndex: number;
          value: string | undefined;
        }
      | undefined;

    for (const [mapName, map] of Object.entries(json.mapData ?? {})) {
      for (let objectIndex = 0; objectIndex < (map.MPObj ?? []).length; objectIndex++) {
        const obj = map.MPObj?.[objectIndex];
        for (let defIndex = 0; defIndex < (obj?.DefTimeAttValue ?? []).length; defIndex++) {
          const def = obj?.DefTimeAttValue?.[defIndex];
          for (let dataIndex = 0; dataIndex < (def?.Data ?? []).length; dataIndex++) {
            const data = def?.Data?.[dataIndex];
            if (data !== undefined && 'Span' in data) {
              target = {
                mapName,
                objectIndex,
                defIndex,
                dataIndex,
                value: typeof data.Value === 'string' ? data.Value : undefined,
              };
              delete data.Span;
              break;
            }
          }
          if (target !== undefined) {
            break;
          }
        }
        if (target !== undefined) {
          break;
        }
      }
      if (target !== undefined) {
        break;
      }
    }

    expect(target).toBeTruthy();

    const attr = new clsAttrData();
    const result = attr.OpenNewMandaraFile([], JSON.stringify(json), 'japan_sityoson_pop.mdrmj', 'mdrmj');

    expect(result.ok).toBe(true);
    expect(result.emes).toBe('');
    expect(attr.TotalData.LV1.DataSourceType).toBe(4);

    const embeddedMap = attr.MapData.SetMapFile(target!.mapName);
    expect(embeddedMap).toBeTruthy();

    const span = embeddedMap!.MPObj[target!.objectIndex].DefTimeAttValue[target!.defIndex].Data[target!.dataIndex].Span;
    expect(span.StartTime.nullFlag()).toBe(true);
    expect(span.EndTime.nullFlag()).toBe(true);
    expect(embeddedMap!.MPObj[target!.objectIndex].DefTimeAttValue[target!.defIndex].Data[target!.dataIndex].Value).toBe(target!.value);
  });
});