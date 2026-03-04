import { describe, it, expect, beforeAll } from 'vitest';
import { execFileSync } from 'node:child_process';
import { appState } from '../src/core/AppState';
import { clsMapdata } from '../src/clsMapdata';
import { clsAttrData } from '../src/clsAttrData';
import { clsTime } from '../src/clsTime';
import { enmAttDataType } from '../src/constants/legacyEnums';
import type { JsonObject } from '../src/types';

describe('japanadm population class boundaries', () => {
  beforeAll(() => {
    (appState() as { tileMapClass?: { getTileMapData: (key: string) => Record<string, unknown> } }).tileMapClass = {
      getTileMapData: (_key: string) => ({}),
    };
    (appState() as { settingData?: { ObjectName_Word_Compatible: string; KatakanaCheck: boolean } }).settingData = {
      ObjectName_Word_Compatible: '',
      KatakanaCheck: false,
    };
  });

  it('人口データの階級区分値が有効数値として生成される', () => {
    const raw = execFileSync('unzip', ['-p', 'map/japanadm.mpfj', 'japanadm'], {
      encoding: 'utf8',
      maxBuffer: 200 * 1024 * 1024,
    });
    const jsonText = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
    const source = JSON.parse(jsonText) as JsonObject;

    const mapdata = new clsMapdata();
    mapdata.openJsonMapData(source);
    mapdata.Map.FileName = '日本市町村緯度経度.MPFJ';

    const useObjectKind = Array<boolean>(mapdata.Map.OBKNum ?? 0).fill(false);
    useObjectKind[0] = true;

    const layerInfo = {
      Name: 'レイヤ日本市町村',
      MapfileName: '日本市町村緯度経度.MPFJ',
      UseObjectKind: useObjectKind,
      Time: clsTime.GetYMD(new Date()),
      Shape: 2,
    };

    const attr = new clsAttrData();
    attr.SetMapViewerData([mapdata], [layerInfo], false);

    const layer = attr.LayerData[0];
    const populationIndex = layer.atrData.Data.findIndex((data) => data.Title === '人口');
    expect(populationIndex).toBeGreaterThanOrEqual(0);

    const population = layer.atrData.Data[populationIndex];
    expect(population.DataType).toBe(enmAttDataType.Normal);

    const divNum = population.SoloModeViewSettings.Div_Num;
    expect(divNum).toBeGreaterThan(1);

    const shownValues = population.SoloModeViewSettings.Class_Div
      .slice(0, Math.max(0, divNum - 1))
      .map((classDiv) => Number(classDiv.Value));

    expect(shownValues.length).toBeGreaterThan(0);
    expect(shownValues.every((value) => Number.isFinite(value))).toBe(true);

    for (let i = 1; i < shownValues.length; i++) {
      expect(shownValues[i - 1]).toBeGreaterThanOrEqual(shownValues[i]);
    }
  });

  it('属性定義のない種別が混在しても属性定義がある種別から初期属性を取得する', () => {
    const raw = execFileSync('unzip', ['-p', 'map/japanadm.mpfj', 'japanadm'], {
      encoding: 'utf8',
      maxBuffer: 200 * 1024 * 1024,
    });
    const jsonText = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
    const source = JSON.parse(jsonText) as JsonObject;

    const mapInfo = source.Map as { Kend: number };
    const mpObj = source.MPObj as Array<{ Kind: number }>;
    mpObj[mapInfo.Kend - 1].Kind = 3;

    const mapdata = new clsMapdata();
    mapdata.openJsonMapData(source);
    mapdata.Map.FileName = '日本市町村緯度経度.MPFJ';

    const useObjectKind = Array<boolean>(mapdata.Map.OBKNum ?? 0).fill(false);
    useObjectKind[0] = true;
    useObjectKind[3] = true;

    const layerInfo = {
      Name: 'レイヤ日本市町村',
      MapfileName: '日本市町村緯度経度.MPFJ',
      UseObjectKind: useObjectKind,
      Time: clsTime.GetYMD(new Date()),
      Shape: 2,
    };

    const attr = new clsAttrData();
    attr.SetMapViewerData([mapdata], [layerInfo], false);

    const layer = attr.LayerData[0];
    expect(layer.atrData.Data.length).toBeGreaterThan(1);
    const populationIndex = layer.atrData.Data.findIndex((data) => data.Title === '人口');
    expect(populationIndex).toBeGreaterThanOrEqual(0);
  });

  it('欠損した階級区分設定を補完して凡例値と色を再構築できる', () => {
    const raw = execFileSync('unzip', ['-p', 'map/japanadm.mpfj', 'japanadm'], {
      encoding: 'utf8',
      maxBuffer: 200 * 1024 * 1024,
    });
    const jsonText = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
    const source = JSON.parse(jsonText) as JsonObject;

    const mapdata = new clsMapdata();
    mapdata.openJsonMapData(source);
    mapdata.Map.FileName = '日本市町村緯度経度.MPFJ';

    const useObjectKind = Array<boolean>(mapdata.Map.OBKNum ?? 0).fill(false);
    useObjectKind[0] = true;

    const layerInfo = {
      Name: 'レイヤ日本市町村',
      MapfileName: '日本市町村緯度経度.MPFJ',
      UseObjectKind: useObjectKind,
      Time: clsTime.GetYMD(new Date()),
      Shape: 2,
    };

    const attr = new clsAttrData();
    attr.SetMapViewerData([mapdata], [layerInfo], false);

    const layer = attr.LayerData[0];
    const populationIndex = layer.atrData.Data.findIndex((data) => data.Title === '人口');
    expect(populationIndex).toBeGreaterThanOrEqual(0);

    const population = layer.atrData.Data[populationIndex];
    const expectedDivNum = population.SoloModeViewSettings.Div_Num;
    population.SoloModeViewSettings.Class_Div = [];

    const repairedDivNum = attr.EnsureSoloModeClassDivReady(0, populationIndex);
    expect(repairedDivNum).toBe(expectedDivNum);
    expect(population.SoloModeViewSettings.Class_Div.length).toBe(expectedDivNum);

    const boundaryValues = population.SoloModeViewSettings.Class_Div
      .slice(0, Math.max(0, expectedDivNum - 1))
      .map((classDiv) => Number(classDiv.Value));
    expect(boundaryValues.every((value) => Number.isFinite(value))).toBe(true);

    const hasPaintColor = population.SoloModeViewSettings.Class_Div
      .slice(0, expectedDivNum)
      .every((classDiv) => typeof classDiv.PaintColor?.toRGBA === 'function');
    expect(hasPaintColor).toBe(true);
  });

  it('疎配列化した階級区分も補完して色と凡例値を再構築できる', () => {
    const raw = execFileSync('unzip', ['-p', 'map/japanadm.mpfj', 'japanadm'], {
      encoding: 'utf8',
      maxBuffer: 200 * 1024 * 1024,
    });
    const jsonText = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
    const source = JSON.parse(jsonText) as JsonObject;

    const mapdata = new clsMapdata();
    mapdata.openJsonMapData(source);
    mapdata.Map.FileName = '日本市町村緯度経度.MPFJ';

    const useObjectKind = Array<boolean>(mapdata.Map.OBKNum ?? 0).fill(false);
    useObjectKind[0] = true;

    const layerInfo = {
      Name: 'レイヤ日本市町村',
      MapfileName: '日本市町村緯度経度.MPFJ',
      UseObjectKind: useObjectKind,
      Time: clsTime.GetYMD(new Date()),
      Shape: 2,
    };

    const attr = new clsAttrData();
    attr.SetMapViewerData([mapdata], [layerInfo], false);

    const layer = attr.LayerData[0];
    const populationIndex = layer.atrData.Data.findIndex((data) => data.Title === '人口');
    expect(populationIndex).toBeGreaterThanOrEqual(0);

    const population = layer.atrData.Data[populationIndex];
    const expectedDivNum = population.SoloModeViewSettings.Div_Num;
    population.SoloModeViewSettings.Class_Div = new Array(expectedDivNum);

    const repairedDivNum = attr.EnsureSoloModeClassDivReady(0, populationIndex);
    expect(repairedDivNum).toBe(expectedDivNum);

    const classDiv = population.SoloModeViewSettings.Class_Div;
    expect(classDiv.length).toBe(expectedDivNum);
    expect(classDiv.every((div) => div !== undefined)).toBe(true);

    const boundaryValues = classDiv
      .slice(0, Math.max(0, expectedDivNum - 1))
      .map((div) => Number(div.Value));
    expect(boundaryValues.every((value) => Number.isFinite(value))).toBe(true);

    const colorStrings = classDiv.map((div) => div.PaintColor.toRGBA());
    expect(colorStrings.every((value) => typeof value === 'string' && value.length > 0)).toBe(true);
    if (expectedDivNum > 1 && population.SoloModeViewSettings.ClassPaintMD.Color_Mode !== 2) {
      expect(colorStrings[0]).not.toBe(colorStrings[expectedDivNum - 1]);
    }
  });
});
