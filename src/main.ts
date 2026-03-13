/**
 * メインエントリーポイント
 * ESモジュール完全対応版
 */

import { appState } from './core/AppState';
import { Generic } from './clsGeneric';
import { clsDrawMarkFan, clsTileMap } from './clsDraw';
import { Setting_Info } from './clsTime';
import { point, Screen_info, size, enmBasePosition } from './clsAttrData';
import type { Zahyo_info } from './clsMapdata';
import { enmZahyo_mode_info } from './constants/legacyEnums';
import { frmPrintFront, settingFront } from './frontHandlers';
import { attachFrmPrintMethods, mapMouseInternal as mapMouse } from './frmPrint';
import { clsPrint } from './clsPrint';
import { setting } from './clsWindow';
import { contextMenuPrevent } from './contextMenu';
import {
    frmProjectionConvert,
    frmPrintOption,
    frmPrint_ObjectValue,
    frmPrint_backImageSet,
    frmPrint_DummyObjectGroup
} from './clsSubWindows';

// グローバル変数は完全に削除し、AppState経由でアクセス
// 以前の実装：
// let clsSettingData!: Setting_Info;
// let attrData!: IAttrData;
// let Frm_Print!: IFrmPrint;
// などは AppState に集約済み

/**
 * ログ出力関数
 * AppState経由でログウィンドウにアクセス
 */
import type { JsonValue } from './types';

function _logX(data: JsonValue): void {
    const state = appState();
    
    if (state.logWindow === undefined) {
        state.logWindow = Generic.createNewTextarea(
            document.body, "", "", 10, 700, 10, 10, 
            "font-size:15px;width:400px;height:200px"
        );
    }
    
    let tx: string = "";
    if (Array.isArray(data)) {
        for (const i in data) {
            tx += data[i] + " / ";
        }
    } else {
        tx = String(data);
    }
    // console.log(tx);
    
    if (state.logWindow) {
        state.logWindow.value += tx + "\n";
    }
}

/**
 * アプリケーション初期化関数
 */
function _init(): void {
    const state = appState();
    
    // コンテキストメニュー無効化
    document.body.addEventListener("contextmenu", contextMenuPrevent);
    
    // 状態の初期化
    state.settingData = new Setting_Info();
    state.tileMapClass = new clsTileMap();
    state.clsDrawMarkFan = clsDrawMarkFan;
    
    // フォント設定
    const testFont: string[] = [
        "Yu Gothic UI", 
        "Meiryo UI", 
        "ヒラギノ角ゴ ProN", 
        "Noto Sans CJK", 
        "sans-serif"
    ];
    for (const font of testFont) {
        if (Generic.checkFontExist(font)) {
            state.settingData.SetFont = font;
            break;
        }
    }
    
    // スクロールバー幅の取得
    const divscr: HTMLDivElement = Generic.createNewDiv(
        document.body, "", "", "", 0, 0, 50, 50, 
        "visibility:hidden;overflow-y:scroll", 
        undefined
    );
    state.scrMargin.scrollWidth = 50 - divscr.clientWidth;
    document.body.removeChild(divscr);
    
    // 出力画面生成
    const _frmPrintRef = { windowClose: null as (() => void) | null, resizeMapWindow: null as (() => void) | null };
    state.frmPrint = Generic.createWindow(
        "frmPrint", "", "", 250, 50, 300, 250, 
        false, true, FrmprintMenuClick, true, 
        null, true, "printFoot", true, 
        null
    ) as IFrmPrint;
    attachFrmPrintMethods(state.frmPrint);
    
    state.frmPrint.picMap = Generic.createNewCanvas(
        state.frmPrint, "mapArea", "", 0, 0, 0, 0, null, 
        "background-color: white"
    );

    state.frmPrint.picMap.oncontextmenu = (): boolean => false;
    state.frmPrint.addEventListener('mousedown', frmPrintFront);
    state.frmPrint.addEventListener('touchstart', frmPrintFront);
    state.frmPrint.dragBorder?.(undefined, state.frmPrint.resizeMapWindow as (() => void) | undefined);
    
    const footer = document.getElementById("printFoot");
    if (!footer) throw new Error("printFoot要素が見つかりません");
    state.frmPrint.label1 = Generic.createNewSpan(footer, "", "", "", 0, 0, "", undefined);
    state.frmPrint.label2 = Generic.createNewSpan(footer, "", "", "", 0, 0, "", undefined);
    state.frmPrint.label3 = Generic.createNewSpan(footer, "", "", "", 0, 0, "", undefined);
    
    // プロパティウィンドウ生成
    const propertyWindowBase = Generic.createWindow(
        "", "", "プロパティ", 350, 50, 200, 250, 
        false, false, null, true, 
        null, false, "", false, 
        undefined
    );
    
    // IPropertyWindow型として拡張
    state.propertyWindow = Object.assign(propertyWindowBase, {
        copyButton: document.createElement('input') as HTMLInputElement,
        rightPositionFixed: false,
        relativePosition: new point(0, 0),
        fixed: false,
        nextVisible: false
    } as Partial<IPropertyWindow>) as IPropertyWindow;
    
    state.propertyWindow.dragBorder?.(undefined, undefined);
    state.propertyWindow.setTitle?.("プロパティ");
    state.propertyWindow.pnlProperty = Object.assign(
        Generic.createNewDiv(
            state.propertyWindow as ExtendedHTMLDivElement, "", "", "", 0, state.scrMargin.top, 
            '100%', 240, "background-color:#eeeeee;overflow:hidden", ""
        ) as ExtendedHTMLDivElement,
        { oObject: undefined, oLayer: undefined, oData: undefined, objInfo: undefined }
    ) as ExtendedHTMLDivElement & { objInfo?: Record<string, unknown> & ExtendedHTMLDivElement; oObject?: number; oLayer?: number; oData?: number; };
    state.propertyWindow.pnlProperty.sizeFixed = true;
    state.propertyWindow.pnlProperty.relativeSize = new size(0, 70);
    state.propertyWindow.pnlProperty.objInfo = Object.assign(
        Generic.createNewDiv(
            state.propertyWindow.pnlProperty as ExtendedHTMLDivElement, "", "", "", 0, 0, 
            '100%', 90, "padding:5px;background-color:white", ""
        ) as ExtendedHTMLDivElement,
        {} as Record<string, unknown>
    ) as ExtendedHTMLDivElement & Record<string, unknown>;
    state.propertyWindow.pnlProperty.oObject = -1;
    state.propertyWindow.pnlProperty.oLayer = -1;
    state.propertyWindow.pnlProperty.oData = -1;
    state.propertyWindow.copyButton = Generic.createNewButton(
        state.propertyWindow as ExtendedHTMLDivElement, "コピー", "", 30, 0, 
        () => state.frmPrint.copyProperty?.(), ""
    );
    state.propertyWindow.copyButton.bottomPositionFixed = true;
    state.propertyWindow.copyButton.relativePosition = new point(0, 30);
    state.propertyWindow.fixed = false;
    state.propertyWindow.nextVisible = true;

    const rightDIV: HTMLDivElement = Generic.createNewDiv(
        footer, "", "FTRight", "", 350, 0, 295, 18, 
        "text-align:center", undefined
    );
    rightDIV.rightPositionFixed = true;
    rightDIV.relativePosition = new point(325, 0);
    
    Generic.createNewButton(rightDIV, "データ値表示", "", 0, 0, dataValueShow, "width:90px");
    Generic.createNewButton(rightDIV, "全体表示", "", 90, 0, () => state.frmPrint.wholeMapShow?.(), "text-aligh:center;width:75px");
    state.frmPrint.backImageButton = Generic.createNewButton(rightDIV, "背景画像", "", 165, 0, backImageButton, "text-aligh:center;width:75px");
    state.frmPrint.seriesNextButton = Generic.createNewButton(rightDIV, "◀", "", 240, 0, () => state.frmPrint.seriesBefore?.(), "font-weight: 900;width:30px");
    state.frmPrint.seriesBeforeButton = Generic.createNewButton(rightDIV, "▶", "", 270, 0, () => state.frmPrint.seriesNext?.(), "font-weight: 900;width:30px");
    
    mapMouse(state.frmPrint.picMap, clsPrint.printMapScreen);
    state.clsDrawMarkFan?.init?.();

    setting(location.search); // 設定画面の作成


    function FrmprintMenuClick(pos: point): void {
        const state = appState();
        const pwchwck: boolean = (state.propertyWindow.getVisibility?.() === true);
        const popmenu = [
            {caption: "画像", enabled: true, child: [
                { caption: "画像ファイルに保存", event: () => state.frmPrint.savePNG?.() },
                { caption: "コピー用画像表示", event: () => state.frmPrint.copyImageWindow?.() }
            ]
        },
            {caption: "表示", enabled: true, child: [
                { caption: "ダミーオブジェクト・グループ変更",  event: mnuDummyObjChange },
                { caption: "局地変動モード", checked: state.attrData.TotalData.ViewStyle.MapLegend.Base.ModeValueInScreenFlag, event: mdvf },
                { caption: "プロパティウインドウ", checked: pwchwck, event: pwreverse },
            ]
        },
        { caption: "線種ラインパターン設定", event: () => state.frmPrint.linePattern?.() },
        { caption: "投影法変換", event: frmPrintProjection},
        { caption: "オプション", event: frmPrintOptionMenu }
        ];
        Generic.ceatePopupMenu(popmenu, pos);
        
        function mdvf(): void {
            const state = appState();
            const v: boolean = !state.attrData.TotalData.ViewStyle.MapLegend.Base.ModeValueInScreenFlag;
            if (v === true) {
                Generic.alert(undefined, "局地変動モードは、階級区分モード（分割方法が自由設定の場合を除く）、記号の大きさモード、棒の高さモードで反映され、他の表示モードでは変化しません。", undefined);
            }
            state.attrData.TotalData.ViewStyle.MapLegend.Base.ModeValueInScreenFlag = v;
            clsPrint.printMapScreen(state.frmPrint.picMap);
        }
        
        function pwreverse(): void {
            const state = appState();
            if (state.propertyWindow.getVisibility?.() === true) {
                state.propertyWindow.setVisibility?.(false);
            } else {
                state.propertyWindow.setVisibility?.(true);
            }
            state.frmPrint.propertyWindowClose?.();
        }
        
        function mnuDummyObjChange(): void {
            frmPrint_DummyObjectGroup();
        }
    }
}

/**
 * 投影法変換
 */
function frmPrintProjection(): void {
    const state = appState();
    
    if (state.attrData.TotalData.ViewStyle.Zahyo.Mode !== enmZahyo_mode_info.Zahyo_Ido_Keido) {
        alert("緯度経度座標系ではありません。");
        return;
    }
    
    const viewStyle = state.attrData.TotalData.ViewStyle as {
        Zahyo: Zahyo_info;
        ScrData: Screen_info;
        MapLegend: typeof state.attrData.TotalData.ViewStyle.MapLegend;
    };
    const mapRect = viewStyle.ScrData.MapRectangle;
    frmProjectionConvert(viewStyle.Zahyo, mapRect, okButton);
    
    function okButton(newZahyo: Zahyo_info): void {
        const state = appState();
        const centerLon: number = newZahyo.CenterXY.x;
        
        if ((newZahyo.Projection !== state.attrData.TotalData.ViewStyle.Zahyo.Projection) || 
            (centerLon !== state.attrData.TotalData.ViewStyle.Zahyo.CenterXY.x)) {
            
            if (typeof state.attrData.Convert_Zahyo === "function") {
                state.attrData.Convert_Zahyo(newZahyo);
            }
            const MapFileList: string[] = state.attrData?.GetMapFileName?.() ?? [];
            
            for (let i = 0; i < MapFileList.length; i++) {
                const mapFile = state.attrData?.SetMapFile?.(MapFileList[i]);
                if (mapFile?.Convert_ZahyoMode) {
                    mapFile.Convert_ZahyoMode(newZahyo);
                }
            }
            
            const nextViewStyle = state.attrData.TotalData.ViewStyle as {
                Zahyo: Zahyo_info;
                ScrData: Screen_info;
                MapLegend: typeof state.attrData.TotalData.ViewStyle.MapLegend;
            };
            const scrData = nextViewStyle.ScrData;
            nextViewStyle.Zahyo = newZahyo;
            const clonedRect = scrData.MapRectangle.Clone();
            scrData.ScrView = clonedRect;
            
            if (state.attrData?.Check_Vector_Object) {
                state.attrData.Check_Vector_Object();
            }

            if (nextViewStyle.ScrData.Accessory_Base === enmBasePosition.Map) {
                const mapRect = nextViewStyle.ScrData.MapRectangle;
                const mapSize = mapRect.size();
                const legendBase = nextViewStyle.MapLegend.Base;
                for (let i = 0; i < legendBase.LegendXY.length; i++) {
                    const legendPos = legendBase.LegendXY[i];
                    const inMap =
                        legendPos.x >= mapRect.left && legendPos.x <= mapRect.right &&
                        legendPos.y >= mapRect.top && legendPos.y <= mapRect.bottom;
                    if (inMap) {
                        legendPos.x = mapRect.right + (1 - i) * mapSize.width / 50;
                        legendPos.y = mapRect.centerP().y + (1 - i) * mapSize.height / 50;
                    }
                }
            } else {
                const scrData = nextViewStyle.ScrData;
                const mapRectOnScreen = scrData.getSxSyRect(scrData.MapRectangle);
                const canvasW = Math.max(1, scrData.frmPrint_FormSize.width());
                const canvasH = Math.max(1, scrData.frmPrint_FormSize.height());
                const legendBase = nextViewStyle.MapLegend.Base;
                for (let i = 0; i < legendBase.LegendXY.length; i++) {
                    const ratioPos = legendBase.LegendXY[i];
                    const legendScreenPos = scrData.getSxSy(scrData.getSRXYfromRatio(ratioPos));
                    const inMap =
                        legendScreenPos.x >= mapRectOnScreen.left && legendScreenPos.x <= mapRectOnScreen.right &&
                        legendScreenPos.y >= mapRectOnScreen.top && legendScreenPos.y <= mapRectOnScreen.bottom;
                    if (inMap) {
                        const rightX = Math.min(0.98, (mapRectOnScreen.right + 12) / canvasW);
                        const centerY = mapRectOnScreen.centerP().y / canvasH;
                        legendBase.LegendXY[i] = new point(
                            Math.max(0.02, rightX),
                            Math.max(0.02, Math.min(0.98, centerY + (1 - i) * 0.05))
                        );
                    }
                }
            }

            state.attrData?.PrtObjectSpatialIndex?.();
            clsPrint.printMapScreen(state.frmPrint.picMap);
            Generic.alert(
                undefined, 
                "投影法を" + Generic.getStringProjectionEnum(newZahyo.Projection) + "に変換しました。", 
                undefined
            );
        }
    }
}

/**
 * オプションメニュー
 */
function frmPrintOptionMenu(): void {
    frmPrintOption(0);
}

/**
 * データ値表示ボタン
 */
function dataValueShow(_e?: Event): void {
    const state = appState();
    frmPrint_ObjectValue(state.attrData, function(): void { 
        clsPrint.printMapScreen(state.frmPrint.picMap); 
    });
}

/**
 * 背景画像ボタン
 */
function backImageButton(): void {
    const state = appState();
    const avt = state.attrData.TotalData.ViewStyle.TileMapView;
    
    if (avt.Visible === true) {
        avt.Visible = false;
        clsPrint.printMapScreen(state.frmPrint.picMap);
    } else {
        avt.Visible = true;
        frmPrint_backImageSet(state.attrData, function (): void { 
            clsPrint.printMapScreen(state.frmPrint.picMap); 
        });
    }
}

const globalScope = globalThis as typeof globalThis & {
    logX?: (data: JsonValue) => void;
    init?: () => void;
    settingFront?: () => void;
    frmPrintFront?: () => void;
};

globalScope.logX = _logX;
globalScope.init = _init;
globalScope.settingFront = settingFront;
globalScope.frmPrintFront = frmPrintFront;

globalThis.onerror = function(message, source, lineno, colno, error) {
    _logX([String(message), String(source ?? ''), lineno ?? 0, colno ?? 0, String(error ?? '')]);
};








