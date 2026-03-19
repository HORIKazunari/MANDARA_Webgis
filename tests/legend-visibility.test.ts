import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { appState } from '../src/core/AppState';
import { clsAttrData, Legend2_Atri, point, rectangle, strInner_Data_Info } from '../src/clsAttrData';
import { clsPrint } from '../src/clsPrint';
import { Accessory } from '../src/clsAccessory';
import { enmLayerMode_Number, enmShape } from '../src/constants/legacyEnums';

describe('legend visibility regression', () => {
  beforeEach(() => {
    const state = appState();
    state.attrData = new clsAttrData();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('凡例可視フラグがすべてfalseのとき凡例描画を呼ばない', () => {
    const state = appState();
    state.attrData.TotalData.ViewStyle.MapLegend.Base.Visible = false;
    state.attrData.TotalData.ViewStyle.MapLegend.Line_DummyKind.Line_Visible = false;
    state.attrData.TotalData.ViewStyle.MapLegend.Line_DummyKind.Dummy_Point_Visible = false;
    state.attrData.TempData.Accessory_Temp.Legend_No_Max = 2;

    vi.spyOn(Accessory, 'AccGroupBoxDraw').mockImplementation(() => {});
    vi.spyOn(Accessory, 'Scale_Print').mockImplementation(() => {});
    vi.spyOn(Accessory, 'Note_Print').mockImplementation(() => {});
    vi.spyOn(Accessory, 'Compass_print').mockImplementation(() => {});
    vi.spyOn(Accessory, 'Title_Print').mockImplementation(() => {});
    const beginSpy = vi.spyOn(Accessory, 'BeginLegendFrame').mockImplementation(() => {});
    const printSpy = vi.spyOn(Accessory, 'Legend_print').mockImplementation(() => false);
    const ensureSpy = vi.spyOn(Accessory, 'EnsureLegendFallback').mockImplementation(() => {});
    const hardSpy = vi.spyOn(Accessory, 'LegendHardFallback_Print').mockImplementation(() => {});
    const debugSpy = vi.spyOn(Accessory, 'LegendDebug_Print').mockImplementation(() => {});

    clsPrint.Figure_Print({} as CanvasRenderingContext2D, false);

    expect(beginSpy).not.toHaveBeenCalled();
    expect(printSpy).not.toHaveBeenCalled();
    expect(ensureSpy).not.toHaveBeenCalled();
    expect(hardSpy).not.toHaveBeenCalled();
    expect(debugSpy).not.toHaveBeenCalled();
  });

  it('凡例可視フラグがtrueのとき凡例描画を呼ぶ', () => {
    const state = appState();
    state.attrData.TotalData.ViewStyle.MapLegend.Base.Visible = true;
    state.attrData.TotalData.ViewStyle.MapLegend.Line_DummyKind.Line_Visible = false;
    state.attrData.TotalData.ViewStyle.MapLegend.Line_DummyKind.Dummy_Point_Visible = false;
    state.attrData.TempData.Accessory_Temp.Legend_No_Max = 2;

    vi.spyOn(Accessory, 'AccGroupBoxDraw').mockImplementation(() => {});
    vi.spyOn(Accessory, 'Scale_Print').mockImplementation(() => {});
    vi.spyOn(Accessory, 'Note_Print').mockImplementation(() => {});
    vi.spyOn(Accessory, 'Compass_print').mockImplementation(() => {});
    vi.spyOn(Accessory, 'Title_Print').mockImplementation(() => {});
    const beginSpy = vi.spyOn(Accessory, 'BeginLegendFrame').mockImplementation(() => {});
    const printSpy = vi.spyOn(Accessory, 'Legend_print').mockImplementation(() => true);
    const ensureSpy = vi.spyOn(Accessory, 'EnsureLegendFallback').mockImplementation(() => {});
    const hardSpy = vi.spyOn(Accessory, 'LegendHardFallback_Print').mockImplementation(() => {});
    const debugSpy = vi.spyOn(Accessory, 'LegendDebug_Print').mockImplementation(() => {});

    clsPrint.Figure_Print({} as CanvasRenderingContext2D, false);

    expect(beginSpy).toHaveBeenCalledTimes(1);
    expect(printSpy).toHaveBeenCalledTimes(2);
    expect(printSpy).toHaveBeenNthCalledWith(1, expect.anything(), 0, false);
    expect(printSpy).toHaveBeenNthCalledWith(2, expect.anything(), 1, false);
    expect(ensureSpy).toHaveBeenCalledTimes(1);
    expect(hardSpy).toHaveBeenCalledTimes(1);
    expect(debugSpy).toHaveBeenCalledTimes(1);
  });

  it('重なった凡例矩形を下方向に逃がす', () => {
    const resolveLegendRectOverlap = (Accessory as unknown as {
      resolveLegendRectOverlap: (currentRect: rectangle, previousRects: rectangle[], canvasWidth: number, canvasHeight: number) => rectangle;
    }).resolveLegendRectOverlap;

    const previousRect = new rectangle(40, 160, 30, 150);
    const currentRect = new rectangle(40, 160, 30, 150);

    const adjusted = resolveLegendRectOverlap(currentRect, [previousRect], 480, 360);

    expect(adjusted.top).toBeGreaterThan(previousRect.bottom);
    expect(adjusted.IntersectsWith(previousRect)).toBe(false);
  });

  it('下方向に収まらない場合は右カラムに逃がす', () => {
    const resolveLegendRectOverlap = (Accessory as unknown as {
      resolveLegendRectOverlap: (currentRect: rectangle, previousRects: rectangle[], canvasWidth: number, canvasHeight: number) => rectangle;
    }).resolveLegendRectOverlap;

    const previousRect = new rectangle(30, 150, 40, 170);
    const currentRect = new rectangle(30, 150, 60, 190);

    const adjusted = resolveLegendRectOverlap(currentRect, [previousRect], 480, 220);

    expect(adjusted.left).toBeGreaterThan(previousRect.right);
    expect(adjusted.IntersectsWith(previousRect)).toBe(false);
  });

  it('サイズ取得時に false を返す凡例でも Rect を保持する', () => {
    const state = appState();
    const legend = new Legend2_Atri();
    legend.Layn = 0;
    legend.DatN = 0;
    legend.Print_Mode_Layer = enmLayerMode_Number.SoloMode;
    legend.SoloMode = 0;

    state.attrData.TempData.Accessory_Temp.MapLegend_W[0] = legend;
    state.attrData.TotalData.ViewStyle.MapLegend.Base.LegendXY[0] = new point(0.1, 0.1);
    const scrData = state.attrData.TotalData.ViewStyle.ScrData as unknown as {
      ScreenMG: { Mul: number; Xplus: number; YPlus: number };
      ScrView: rectangle;
      ScrRectangle: rectangle;
    };
    scrData.ScreenMG = { Mul: 1, Xplus: 0, YPlus: 0 };
    scrData.ScrView = new rectangle(0, 480, 0, 360);
    scrData.ScrRectangle = new rectangle(0, 480, 0, 360);
    (state.attrData as unknown as { LayerData: Array<{ Shape: number }> }).LayerData[0] = {
      Shape: enmShape.PolygonShape,
    };
    vi.spyOn(state.attrData, 'Get_DataUnit_With_Kakko').mockReturnValue('');
    vi.spyOn(state.attrData, 'Get_PaddingPixcel').mockReturnValue(0);

    const drawSpy = vi.spyOn(Accessory, 'Draw_ClassPaintHatchMode').mockImplementation((_g, _alp, boxSize) => {
      boxSize.width = 120;
      boxSize.height = 80;
      return false;
    });

    const ctx = {
      canvas: { width: 480, height: 360 },
      measureText: (text: string) => ({ width: text.length * 8 }),
      save: () => {},
      restore: () => {},
      font: '',
    } as unknown as CanvasRenderingContext2D;

    Accessory.Legend_print(ctx, 0, true);

    expect(drawSpy).toHaveBeenCalledTimes(1);
    expect(state.attrData.TempData.Accessory_Temp.MapLegend_W[0].Rect.width()).toBeGreaterThan(0);
    expect(state.attrData.TempData.Accessory_Temp.MapLegend_W[0].Rect.height()).toBeGreaterThan(0);
  });

  it('内部データフラグが数値0でも追加凡例を作らない', () => {
    const state = appState();
    vi.spyOn(state.attrData, 'Get_DataTitle').mockReturnValue('unused');
    const innerData = new strInner_Data_Info() as strInner_Data_Info & { Flag: boolean | number };
    innerData.Flag = 0;
    innerData.Data = 3;

    const legend = clsPrint.Legend_Mark_Mode_Inner_Data_set(innerData, 0);

    expect(legend).toBeUndefined();
    expect(state.attrData.Get_DataTitle).not.toHaveBeenCalled();
  });

  it('内部データ凡例は内部データ項目を参照する', () => {
    const state = appState();
    vi.spyOn(state.attrData, 'Get_DataTitle').mockImplementation((_layerNum, dataNum) => `D${dataNum}`);
    const innerData = new strInner_Data_Info();
    innerData.Flag = true;
    innerData.Data = 3;

    const legend = clsPrint.Legend_Mark_Mode_Inner_Data_set(innerData, 0);

    expect(legend).toBeDefined();
    expect(legend?.DatN).toBe(3);
    expect(legend?.title).toBe('D3');
  });
});
