import { describe, it, expect, beforeAll } from 'vitest';
import { appState } from '../src/core/AppState';
import { clsMapdata } from '../src/clsMapdata';

describe('clsMapdata.openJsonMapData', () => {
  beforeAll(async () => {
    (globalThis as { preReadMapFile?: Record<string, unknown> }).preReadMapFile = appState().preReadMapFile;
    await import('../src/japanLatLonMap.ts');
  });

  it('日本緯度経度.MPFJ の主要ジオメトリを正しく復元する', () => {
    const source = appState().preReadMapFile['日本緯度経度.MPFJ'] as {
      Map: { ALIN: number; Kend: number; Circumscribed_Rectangle: { Left: number; Top: number; Right: number; Bottom: number } };
      MPLine: Array<{ PointSTC: Array<{ X: number; Y: number }> }>;
    };

    expect(source).toBeTruthy();
    expect(source.MPLine.length).toBeGreaterThan(0);
    expect(source.MPLine[0].PointSTC.length).toBeGreaterThan(1);

    const mapdata = new clsMapdata();
    mapdata.openJsonMapData(source as unknown as Record<string, unknown>);

    expect(mapdata.Map.ALIN).toBe(source.Map.ALIN);
    expect(mapdata.Map.Kend).toBe(source.Map.Kend);

    const srcP0 = source.MPLine[0].PointSTC[0];
    const srcP1 = source.MPLine[0].PointSTC[1];
    const dstP0 = mapdata.MPLine[0].PointSTC[0];
    const dstP1 = mapdata.MPLine[0].PointSTC[1];

    expect(dstP0.x).toBeCloseTo(srcP0.X, 6);
    expect(dstP0.y).toBeCloseTo(srcP0.Y, 6);
    expect(dstP1.x).toBeCloseTo(srcP1.X, 6);
    expect(dstP1.y).toBeCloseTo(srcP1.Y, 6);

    expect(mapdata.Map.Circumscribed_Rectangle.left).toBeCloseTo(source.Map.Circumscribed_Rectangle.Left, 6);
    expect(mapdata.Map.Circumscribed_Rectangle.top).toBeCloseTo(source.Map.Circumscribed_Rectangle.Top, 6);
    expect(mapdata.Map.Circumscribed_Rectangle.right).toBeCloseTo(source.Map.Circumscribed_Rectangle.Right, 6);
    expect(mapdata.Map.Circumscribed_Rectangle.bottom).toBeCloseTo(source.Map.Circumscribed_Rectangle.Bottom, 6);
  });
});