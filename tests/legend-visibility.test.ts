import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { appState } from '../src/core/AppState';
import { clsAttrData } from '../src/clsAttrData';
import { clsPrint } from '../src/clsPrint';
import { Accessory } from '../src/clsAccessory';

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
});
