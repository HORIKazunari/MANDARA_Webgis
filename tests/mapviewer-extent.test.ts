import { describe, it, expect, beforeAll } from 'vitest';
import { appState } from '../src/core/AppState';
import { clsMapdata } from '../src/clsMapdata';
import { clsAttrData } from '../src/clsAttrData';
import { clsTime } from '../src/clsTime';
import { spatial } from '../src/clsGeneric';

describe('map viewer extent', () => {
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

  it('日本緯度経度の表示範囲が日本全体になる', () => {
    const source = appState().preReadMapFile['日本緯度経度.MPFJ'] as Record<string, unknown>;
    const mapdata = new clsMapdata();
    mapdata.openJsonMapData(source);
    mapdata.Map.FileName = '日本緯度経度.MPFJ';

    const useObjectKind = Array<boolean>(mapdata.Map.OBKNum ?? 0).fill(false);
    useObjectKind[0] = true;

    const layerInfo = {
      Name: 'レイヤ日本',
      MapfileName: '日本緯度経度.MPFJ',
      UseObjectKind: useObjectKind,
      Time: clsTime.GetYMD(new Date()),
      Shape: 2,
    };

    const attr = new clsAttrData();
    attr.SetMapViewerData([mapdata], [layerInfo], false);

    const mapRect = attr.TotalData.ViewStyle.ScrData.MapRectangle;
    const latLonRect = attr.TempData.MapAreaLatLon;
    const reverseRect = spatial.Get_Reverse_Rect(mapRect, attr.TotalData.ViewStyle.Zahyo);

    console.log('mapRect', mapRect.left, mapRect.top, mapRect.right, mapRect.bottom);
    console.log('latLonRect', latLonRect.left, latLonRect.top, latLonRect.right, latLonRect.bottom);
    console.log('reverseRect', reverseRect.left, reverseRect.top, reverseRect.right, reverseRect.bottom);

    expect(mapRect.width()).toBeGreaterThan(2500);
    expect(mapRect.height()).toBeGreaterThan(2500);

    expect(latLonRect.left).toBeLessThan(122);
    expect(latLonRect.right).toBeGreaterThan(156);
    expect(latLonRect.top).toBeGreaterThan(45);
    expect(latLonRect.bottom).toBeLessThan(23);

    expect(reverseRect.left).toBeLessThan(122);
    expect(reverseRect.right).toBeGreaterThan(156);
    expect(reverseRect.top).toBeGreaterThan(45);
    expect(reverseRect.bottom).toBeLessThan(23);
  });
});
