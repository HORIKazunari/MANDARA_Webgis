"use strict";
// @ts-expect-error TS(6504): File '/Users/horikazunari/TypeScript/mandara_ts/cl... Remove this comment to see the full error message
/// <reference path="clsGeneric.js" />
// @ts-expect-error TS(6504): File '/Users/horikazunari/TypeScript/mandara_ts/cl... Remove this comment to see the full error message
/// <reference path="clsAttrData.js" />
// @ts-expect-error TS(6504): File '/Users/horikazunari/TypeScript/mandara_ts/cl... Remove this comment to see the full error message
/// <reference path="clsTime.js" />
// @ts-expect-error TS(6504): File '/Users/horikazunari/TypeScript/mandara_ts/cl... Remove this comment to see the full error message
/// <reference path="clsMapdata.js" />
// @ts-expect-error TS(6504): File '/Users/horikazunari/TypeScript/mandara_ts/cl... Remove this comment to see the full error message
/// <reference path="clsPrint.js" />
// @ts-expect-error TS(6504): File '/Users/horikazunari/TypeScript/mandara_ts/cl... Remove this comment to see the full error message
/// <reference path="clsDraw.js" />
// @ts-expect-error TS(6504): File '/Users/horikazunari/TypeScript/mandara_ts/ma... Remove this comment to see the full error message
/// <reference path="main.js" />
/**
 * Description placeholder
 *
 * @type {{ noMode: number; ClassPaintMode: number; MarkSizeMode: number; MarkBlockMode: number; ContourMode: number; ClassHatchMode: number; ClassMarkMode: number; ClassODMode: number; MarkTurnMode: number; ... 6 more ...; TripMode: number; }}
 */
var enmSelectMode = {
    noMode: -1,
    ClassPaintMode: 0,
    MarkSizeMode: 1,
    MarkBlockMode: 2,
    ContourMode: 3,
    ClassHatchMode: 4,
    ClassMarkMode: 5,
    ClassODMode: 6,
    MarkTurnMode: 7,
    MarkBarMode: 8,
    StringMode: 9,
    OverLayMode: 11,
    SeriesMode: 12,
    GraphMode: 21,
    LabelMode: 22,
    TripMode: 23
};
/**
 * Description placeholder
 *
 * @returns
 */
var strLayerInfo = function () {
    this.Name;
    this.MapfileName;
    this.UseObjectKind = [];
    this.Time;
    this.Shape;
};
/**設定画面（左側）を保存 */
let settingModeWindow;
/**
 * Description placeholder
 *
 * @type {23}
 */
const picClassBoxHeight = 23;
/**
 * Description placeholder
 *
 * @type {40}
 */
const picClassBoxWidth = 40;
/**
 * Description placeholder
 *
 * @type {10}
 */
const picClassBoxLeft = 10;
/**
 * Description placeholder
 *
 * @type {10}
 */
const picClassBoxTop = 10;
/**
 * Description placeholder
 *
 * @type {120}
 */
const txtClassValueWidth = 120;
/**
 * Description placeholder
 *
 * @type {5}
 */
const txtClassValueLeftMergin = 5;
/**
 * Description placeholder
 *
 * @type {50}
 */
const freqWidth = 50;
/**
 * Description placeholder
 *
 * @type {number}
 */
const allW = picClassBoxWidth + txtClassValueWidth + freqWidth + txtClassValueLeftMergin;
/**
 * Description placeholder
 *
 * @type {25}
 */
const pnlGraphEachItemHeight = 25;
/**
 * Description placeholder
 *
 * @param {*} locSearch
 */
let setting = function (locSearch) {
    let man_Data = enmDataSource.NoData;
    let totalh = 680;
    let overlayListView; //重ね合わせデータセットりリストビュー
    let seriesListView; //連続表示データセットりリストビュー
    let lstLabelDataItem; //ラベルデータセットのデータ項目
    let lstcontourSeparateValue; //等値線モードの個別設定のリストボックス
    let popmenu = [{
            caption: "ファイル", enabled: true, child: [
                { caption: "白地図・初期属性データ表示", event: mnuMapViewer },
                { caption: "属性データ読み込み", event: menuReadData },
                { caption: "シェープファイル読み込み", event: mnuOpenShapeFile },
                { caption: "-" },
                { caption: "属性データ保存", event: menuSaveData },
                { caption: "地図データ付属形式属性データ保存", event: menuSaveMDRMJData },
                { caption: "-" },
                { caption: "データ挿入(既存属性データから)", enabled: false, event: menuInsertDataFile },
                { caption: "データ挿入(シェープファイルから)", enabled: false, event: menuInsertShapefile },
                { caption: "データ挿入(白地図・初期属性データ表示から)", enabled: false, event: menuInsertMapViewer },
                { caption: "-" },
                { caption: "プロパティ", event: mnuProperty },
            ]
        },
        { caption: "編集", enabled: true, child: [
                { caption: "属性データ編集", event: mnuPropertyEdit },
                { caption: "属性データ新規作成", event: mnuNewPropertyEdit },
                { caption: "非表示オブジェクトの削除", event: mnuDeleteInvisibleObject }
            ] },
        { caption: "分析", enabled: false, child: [
                { caption: "空間検索", event: mnuSpatialSearch },
                { caption: "面積・周長取得", event: mnuAreaPeripheri },
                { caption: "データ計算", event: mnuCulc },
                { caption: "距離測定", event: mnuMeasureDistance },
                { caption: "属性検索設定", event: mnuConditionSettings },
            ] },
        {
            caption: "ツール", enabled: false, child: [
                { caption: "データ項目設定コピー", event: mnuCopyDataSettings },
                { caption: "連続表示モードにまとめて設定", event: mnuSetSeriesMode },
                { caption: "記号表示位置等操作", event: mnuMarkPosition }
            ]
        },
        { caption: "本サイトについて", event: mnuAbout }
    ];
    //設定画面生成
    // @ts-expect-error TS(2304): Cannot find name 'divmain'.
    divmain = Generic.createWindow("setting", "", "", 10, 10, 400, totalh, true, true, menuClick, false, undefined, false, "", false, undefined);
    // @ts-expect-error TS(2304): Cannot find name 'divmain'.
    divmain.style.userSelect = 'none';
    // @ts-expect-error TS(2304): Cannot find name 'divmain'.
    divmain.style.backgroundColor = "#ffffdc";
    // @ts-expect-error TS(2304): Cannot find name 'divmain'.
    divmain.addEventListener('click', settingFront);
    frmSettingMode();
    if (locSearch != "") {
        let locData_v = locSearch.mid(1, undefined).split("&");
        for (let i = 0; i < locData_v.length; i++) {
            let datav2 = locData_v[i].split("=");
            switch (datav2[0]) {
                case "file":
                    //最初に読み込むファイルが指定されている
                    getFirstFile(datav2[1]);
                    break;
            }
        }
    }
    function menuClick(pos) {
        let dataExist = (man_Data != enmDataSource.NoData);
        switch (man_Data) {
            case enmDataSource.NoData:
                break;
            case enmDataSource.MDRMJ:
            case enmDataSource.Shapefile:
            case enmDataSource.Shapefile:
                break;
        }
        Generic.getPopMenuObj(popmenu, "caption", "属性データ保存").enabled = dataExist;
        Generic.getPopMenuObj(popmenu, "caption", "地図データ付属形式属性データ保存").enabled = dataExist;
        Generic.getPopMenuObj(popmenu, "caption", "データ挿入(既存属性データから)").enabled = dataExist;
        Generic.getPopMenuObj(popmenu, "caption", "データ挿入(シェープファイルから)").enabled = dataExist;
        Generic.getPopMenuObj(popmenu, "caption", "データ挿入(白地図・初期属性データ表示から)").enabled = dataExist;
        Generic.getPopMenuObj(popmenu, "caption", "属性データ編集").enabled = dataExist;
        Generic.getPopMenuObj(popmenu, "caption", "非表示オブジェクトの削除").enabled = dataExist;
        Generic.getPopMenuObj(popmenu, "caption", "プロパティ").enabled = dataExist;
        Generic.getPopMenuObj(popmenu, "caption", "分析").enabled = dataExist;
        Generic.getPopMenuObj(popmenu, "caption", "ツール").enabled = dataExist;
        Generic.ceatePopupMenu(popmenu, pos);
    }
    // @ts-expect-error TS(2304): Cannot find name 'divmain'.
    let firstPanelAbout = AbountInner(divmain, 45, 50);
    // @ts-expect-error TS(2304): Cannot find name 'divmain'.
    let divpanel = Generic.createNewDiv(divmain, "", "SettingPanel", "", 0o0, scrMargin.top, divmain.style.width.removePx(), divmain.style.height.removePx(), "border-solid 1px;", "");
    divpanel.style.visibility = 'hidden';
    Generic.createNewButton(divpanel, "描画開始", "btnDraw", 150, 15, drawMap, "width:115px;height:30px;font-size:17px;font-weight:bold");
    Generic.createNewImageButton(divpanel, "settingWindowBtnPrintError", "image/Warning_yellow_7231_20x20.png", 290, 20, 20, 20, function (e) {
        //エラーボタン
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let retV = attrData.Get_PrintError();
        if (retV.Print_Enable != enmPrint_Enable.Printable) {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            Generic.alert(new point(e.clientX, e.clientY), retV.message);
            return;
        }
    }, "padding:2px");
    Generic.createNewImageButton(divpanel, "settingWindowBtnConditionInfo", "image/Find_VS.png", 315, 20, 20, 20, function (e) {
        //属性検索設定ボタン
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let at = attrData.TotalData;
        let Check_Lay = new Array(at.LV1.Lay_Maxn).fill(false);
        let ST = "";
        switch (at.LV1.Print_Mode_Total) {
            case enmTotalMode_Number.DataViewMode: {
                let L = at.LV1.SelectedLayer;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                ST = attrData.Get_Condition_Info(L);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                ST += attrData.Get_Condition_Ok_Num_Info(L);
                ST += "\n" + "適合オブジェクト一覧" + "\n" + "\n";
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                for (let i = 0; i < attrData.Get_ObjectNum(L); i++) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    if (attrData.Check_Condition(L, i) == true) {
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        ST += attrData.Get_KenObjName(L, i);
                        ST += "\n";
                    }
                }
                break;
            }
            case enmTotalMode_Number.OverLayMode: {
                let s = at.TotalMode.OverLay.SelectedIndex;
                for (let i = 0; i < at.TotalMode.OverLay.DataSet[s].DataItem.length; i++) {
                    let L = at.TotalMode.OverLay.DataSet[s].DataItem[i].Layer;
                    if (Check_Lay[L] == false) {
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        ST += attrData.Get_Condition_Info(L);
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        ST += attrData.Get_Condition_Ok_Num_Info(L);
                        Check_Lay[L] = true;
                    }
                }
                break;
            }
            case enmTotalMode_Number.SeriesMode: {
                let s = at.TotalMode.Series.SelectedIndex;
                for (let i = 0; i < at.TotalMode.Series.DataSet[s].DataItem.length; i++) {
                    let L = at.TotalMode.Series.DataSet[s].DataItem[i].Layer;
                    if (Check_Lay[L] == false) {
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        ST += attrData.Get_Condition_Info(L);
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        ST += attrData.Get_Condition_Ok_Num_Info(L);
                        Check_Lay[L] = true;
                    }
                }
                break;
            }
        }
        Generic.createMsgBox("属性検索条件", ST, true);
    }, "padding:2px");
    Generic.createNewDiv(divpanel, "■データ表示モード", "", "", 20, 50, 352, 25, "background-color:#8080ff;color:white;font-size:16px;padding-left:10px;padding-top:6px;font-weight:bold", "");
    let divDataView = Generic.createNewDiv(divpanel, "", "SettingDataView", "grayFrame", 30, 85, 350, 445, "", "");
    let selectLayer = Generic.createNewWordSelect(divDataView, "対象レイヤ", undefined, -1, "selectLayer", 10, 10, 90, 200, 0, changeLayer, "font-size:16px", "height:22px;font-size:15px");
    let divsolo = Generic.createNewDiv(divDataView, "", "SettingSolo", "", 20, 40, 310, 300, "", "");
    Generic.createNewDiv(divsolo, "■単独表示モード", "", "", 0, 0, 300, 22, "background-color:#00c000;color:white;font-size:15px;padding-left:10px;padding-top:4px;font-weight:bold", "");
    let selectDataItem = Generic.createNewWordSelect(divsolo, "データ項目", undefined, -1, "selectDataItem", 0, 28, 90, 200, 0, changeDataItem, "font-size:16px", "height:22px;font-size:15px");
    Generic.createNewButton(divsolo, "データ値表示", "", 130, 55, showObjectData, "");
    Generic.createNewButton(divsolo, "統計値表示", "", 230, 55, showStatistics, "");
    let divclass = Generic.createNewDiv(divsolo, "", "SettingClass", "", 0, 85, 310, 90, "", "");
    Generic.createNewDiv(divclass, "階級区分モード", "", "", 0, 0, 200, 22, "background-color:#ffe0c0;font-size:15px;padding-left:10px;padding-top:2px", "");
    let divClassPaint = Generic.createNewDiv(divclass, "", "divClassPaint", "modeDivIcon", 20, 30, 50, 65, "background-color:white;border:solid 1px", "");
    // @ts-expect-error TS(2339): Property 'tooltip' does not exist on type 'HTMLDiv... Remove this comment to see the full error message
    divClassPaint.tooltip = "ペイントモード";
    // @ts-expect-error TS(2339): Property 'selected' does not exist on type 'HTMLDi... Remove this comment to see the full error message
    divClassPaint.selected = false;
    Generic.createNewDiv(divClassPaint, "ペイント", "modeclass", "", 0, 48, 50, 16, "font-size:11px;text-align: center", "");
    Generic.createNewImage(divClassPaint, "image/paint_mode.png", "ペイントモード", "", "", 5, 5, "", "");
    let divClassMark = Generic.createNewDiv(divclass, "", "divClassMark", "modeDivIcon", 80, 30, 50, 65, "background-color:white;border:solid 1px", "");
    // @ts-expect-error TS(2339): Property 'tooltip' does not exist on type 'HTMLDiv... Remove this comment to see the full error message
    divClassMark.tooltip = "階級記号モード";
    // @ts-expect-error TS(2339): Property 'selected' does not exist on type 'HTMLDi... Remove this comment to see the full error message
    divClassMark.selected = false;
    Generic.createNewDiv(divClassMark, "階級記号", "modeclass", "", 0, 48, 50, 16, "font-size:11px;text-align: center", "");
    Generic.createNewImage(divClassMark, "image/classmark_Mode.png", "階級記号モード", "", "", 5, 5, "", "");
    let divClassOD = Generic.createNewDiv(divclass, "", "divClassOD", "modeDivIcon", 140, 30, 50, 65, "background-color:white;border:solid 1px", "");
    // @ts-expect-error TS(2339): Property 'tooltip' does not exist on type 'HTMLDiv... Remove this comment to see the full error message
    divClassOD.tooltip = "線モード";
    // @ts-expect-error TS(2339): Property 'selected' does not exist on type 'HTMLDi... Remove this comment to see the full error message
    divClassOD.selected = false;
    Generic.createNewDiv(divClassOD, "線", "modeclass", "", 0, 48, 50, 16, "font-size:11px;text-align: center", "");
    Generic.createNewImage(divClassOD, "image/od.png", "線モード", "", "", 5, 5, "", "");
    Generic.createNewDiv(divclass, "等値線モード", "", "", 220, 0, 80, 22, "background-color:#ffe0c0;font-size:15px;padding-left:10px;padding-right:10px;padding-top:2px", "");
    let divContour = Generic.createNewDiv(divclass, "", "divContour", "modeDivIcon", 240, 30, 50, 65, "background-color:white;border:solid 1px;", "");
    // @ts-expect-error TS(2339): Property 'tooltip' does not exist on type 'HTMLDiv... Remove this comment to see the full error message
    divContour.tooltip = "等値線モード";
    // @ts-expect-error TS(2339): Property 'selected' does not exist on type 'HTMLDi... Remove this comment to see the full error message
    divContour.selected = false;
    Generic.createNewDiv(divContour, "等値線", "modeclass", "", 0, 48, 50, 16, "font-size:11px;text-align: center", "");
    Generic.createNewImage(divContour, "image/contour_mode.png", "等値線モード", "", "", 5, 5, "", "");
    let divMark = Generic.createNewDiv(divsolo, "", "SettingMark", "", 0, 190, 310, 90, "", "");
    Generic.createNewDiv(divMark, "記号モード", "", "", 0, 0, 200, 22, "background-color:#ffe0c0;font-size:15px;padding-left:10px;padding-top:2px", "");
    let divMarkSize = Generic.createNewDiv(divMark, "", "divMarkSize", "modeDivIcon", 20, 30, 50, 65, "background-color:white;border:solid 1px;", "");
    // @ts-expect-error TS(2339): Property 'tooltip' does not exist on type 'HTMLDiv... Remove this comment to see the full error message
    divMarkSize.tooltip = "記号の大きさモード";
    // @ts-expect-error TS(2339): Property 'selected' does not exist on type 'HTMLDi... Remove this comment to see the full error message
    divMarkSize.selected = false;
    Generic.createNewDiv(divMarkSize, "大きさ", "modeclass", "", 0, 48, 50, 16, "font-size:11px;text-align: center", "");
    Generic.createNewImage(divMarkSize, "image/mark_mode.png", "記号の大きさモード", "", "", 5, 5, "", "");
    let divMarkBlock = Generic.createNewDiv(divMark, "", "divMarkBlock", "modeDivIcon", 80, 30, 50, 65, "background-color:white;border:solid 1px;", "");
    // @ts-expect-error TS(2339): Property 'tooltip' does not exist on type 'HTMLDiv... Remove this comment to see the full error message
    divMarkBlock.tooltip = "記号の数モード";
    // @ts-expect-error TS(2339): Property 'selected' does not exist on type 'HTMLDi... Remove this comment to see the full error message
    divMarkBlock.selected = false;
    Generic.createNewDiv(divMarkBlock, "数", "modeclass", "", 0, 48, 50, 16, "font-size:11px;text-align: center", "");
    Generic.createNewImage(divMarkBlock, "image/marknum_mode.png", "記号の数モード", "", "", 5, 5, "", "");
    let divMarkBar = Generic.createNewDiv(divMark, "", "divMarkBar", "modeDivIcon", 140, 30, 50, 65, "background-color:white;border:solid 1px;", "");
    // @ts-expect-error TS(2339): Property 'tooltip' does not exist on type 'HTMLDiv... Remove this comment to see the full error message
    divMarkBar.tooltip = "棒の高さモード";
    // @ts-expect-error TS(2339): Property 'selected' does not exist on type 'HTMLDi... Remove this comment to see the full error message
    divMarkBar.selected = false;
    Generic.createNewDiv(divMarkBar, "棒の高さ", "modeclass", "", 0, 48, 50, 16, "font-size:11px;text-align: center", "");
    Generic.createNewImage(divMarkBar, "image/mark_bar.png", "棒の高さモード", "", "", 5, 5, "", "");
    Generic.createNewDiv(divMark, "文字モード", "", "", 220, 0, 80, 22, "background-color:#ffe0c0;font-size:15px;padding-left:10px;padding-right:10px;padding-top:2px", "");
    let divString = Generic.createNewDiv(divMark, "", "divString", "modeDivIcon", 240, 30, 50, 65, "background-color:white;border:solid 1px;", "");
    // @ts-expect-error TS(2339): Property 'tooltip' does not exist on type 'HTMLDiv... Remove this comment to see the full error message
    divString.tooltip = "文字モード";
    // @ts-expect-error TS(2339): Property 'selected' does not exist on type 'HTMLDi... Remove this comment to see the full error message
    divString.selected = false;
    Generic.createNewDiv(divString, "文字", "modeclass", "", 0, 48, 50, 16, "font-size:11px;text-align: center", "");
    Generic.createNewImage(divString, "image/label_mode.png", "文字モード", "", "", 5, 5, "", "");
    let divMulti = Generic.createNewDiv(divDataView, "", "SettingMulti", "", 20, 340, 50, totalh - 120, "", "");
    Generic.createNewDiv(divMulti, "■複数表示モード", "", "", 0, 0, 300, 22, "background-color:#00c000;color:white;font-size:15px;padding-left:10px;padding-top:4px;font-weight:bold", "");
    let divGraph = Generic.createNewDiv(divMulti, "", "divGraph", "modeDivIcon", 20, 30, 50, 65, "background-color:white;border:solid 1px;", "");
    // @ts-expect-error TS(2339): Property 'tooltip' does not exist on type 'HTMLDiv... Remove this comment to see the full error message
    divGraph.tooltip = "グラフモード";
    // @ts-expect-error TS(2339): Property 'selected' does not exist on type 'HTMLDi... Remove this comment to see the full error message
    divGraph.selected = false;
    Generic.createNewDiv(divGraph, "グラフ", "modeGraph", "", 0, 48, 50, 16, "font-size:11px;text-align: center", "");
    Generic.createNewImage(divGraph, "image/graph_mode.png", "グラフモード", "", "", 5, 5, "", "");
    let divLabel = Generic.createNewDiv(divMulti, "", "divLabel", "modeDivIcon", 80, 30, 50, 65, "background-color:white;border:solid 1px;", "");
    // @ts-expect-error TS(2339): Property 'tooltip' does not exist on type 'HTMLDiv... Remove this comment to see the full error message
    divLabel.tooltip = "ラベルモード";
    // @ts-expect-error TS(2339): Property 'selected' does not exist on type 'HTMLDi... Remove this comment to see the full error message
    divLabel.selected = false;
    Generic.createNewDiv(divLabel, "ラベル", "modeLabel", "", 0, 48, 50, 16, "font-size:11px;text-align: center", "");
    Generic.createNewImage(divLabel, "image/label_mode.png", "ラベルモード", "", "", 5, 5, "", "");
    Generic.createNewButton(divMulti, "重ね合わせセット", "btnOverlaySet", 190, 70, overlaySet, "width:120px");
    let divComplex = Generic.createNewDiv(divpanel, "", "SettingComplex", "", 0, 540, 50, totalh - 120, "", "");
    Generic.createNewDiv(divComplex, "■複合表示モード", "", "", 20, 0, 352, 25, "background-color:#8080ff;color:white;font-size:16px;padding-left:10px;padding-top:6px;font-weight:bold", "");
    let divOverlay = Generic.createNewDiv(divComplex, "", "divOverlay", "modeDivIcon", 70, 30, 50, 65, "background-color:white;border:solid 1px;", "");
    // @ts-expect-error TS(2339): Property 'tooltip' does not exist on type 'HTMLDiv... Remove this comment to see the full error message
    divOverlay.tooltip = "重ね合わせモード";
    // @ts-expect-error TS(2339): Property 'selected' does not exist on type 'HTMLDi... Remove this comment to see the full error message
    divOverlay.selected = false;
    Generic.createNewDiv(divOverlay, "重ね合わせ", "", "", 0, 48, 50, 16, "font-size:10px;text-align: center", "");
    Generic.createNewImage(divOverlay, "image/overlay_Mode.png", "重ね合わせモード", "", "", 5, 5, "", "");
    let divSeries = Generic.createNewDiv(divComplex, "", "divSeries", "modeDivIcon", 130, 30, 50, 65, "background-color:white;border:solid 1px;", "");
    // @ts-expect-error TS(2339): Property 'tooltip' does not exist on type 'HTMLDiv... Remove this comment to see the full error message
    divSeries.tooltip = "連続表示モード";
    // @ts-expect-error TS(2339): Property 'selected' does not exist on type 'HTMLDi... Remove this comment to see the full error message
    divSeries.selected = false;
    Generic.createNewDiv(divSeries, "連続表示", "", "", 0, 48, 50, 16, "font-size:11px;text-align: center", "");
    Generic.createNewImage(divSeries, "image/series_Mode.png", "連続表示モード", "", "", 5, 5, "", "");
    Generic.createNewButton(divComplex, "連続表示セット", "btnSeriesSet", 240, 70, seriesSet, "width:120px");
    let SelectedCategoryIndex = -1;
    //モードのdivにenter
    function modeEnter(e) {
        if (this.selected == false) {
            this.style.backgroundColor = "#ffdcdc";
        }
        Generic.createNewDiv(this, this.tooltip, "", "", e.offsetX, e.offsetY - 10, 80, undefined, "z-index:1000;font-size:12px;border: solid 1px; border-radius:3px; background-color:white;text-align:center", "");
    }
    function modeLeave(e) {
        if (this.selected == false) {
            this.style.backgroundColor = "white";
        }
        this.removeChild(this.lastChild);
    }
    /**複数表示モードをクリック */
    function multiModeClick() {
        clearModeIcon();
        let selDiv;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.TotalData.LV1.Print_Mode_Total = enmTotalMode_Number.DataViewMode;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[Layernum];
        switch (this.id) {
            case "divGraph":
                al.Print_Mode_Layer = enmLayerMode_Number.GraphMode;
                selDiv = divGraph;
                break;
            case "divLabel":
                al.Print_Mode_Layer = enmLayerMode_Number.LabelMode;
                selDiv = divLabel;
                break;
        }
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        selDiv.selected = true;
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        selDiv.style.backgroundColor = '#ff6464';
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        settingModeWindow.setTitle(selDiv.tooltip);
        rightSettingWindowControlVisibilitySet();
        // @ts-expect-error TS(2304): Cannot find name 'Check_Print_err'.
        Check_Print_err();
        switch (this.id) {
            case "divGraph":
                setSettingGraphModeWindow();
                break;
            case "divLabel":
                setSettingLabelModeWindow();
                break;
        }
    }
    /**複合表示モードをクリック */
    function ComplexModeClick() {
        clearModeIcon();
        let selDiv;
        switch (this.id) {
            case "divOverlay":
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.TotalData.LV1.Print_Mode_Total = enmTotalMode_Number.OverLayMode;
                selDiv = divOverlay;
                break;
            case "divSeries":
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.TotalData.LV1.Print_Mode_Total = enmTotalMode_Number.SeriesMode;
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                document.getElementById("btnSeriesSet").disabled = true;
                selDiv = divSeries;
                break;
        }
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        document.getElementById("btnOverlaySet").disabled = true;
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        selDiv.selected = true;
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        selDiv.style.backgroundColor = '#ff6464';
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        settingModeWindow.setTitle(selDiv.tooltip);
        rightSettingWindowControlVisibilitySet();
        // @ts-expect-error TS(2304): Cannot find name 'Check_Print_err'.
        Check_Print_err();
        switch (this.id) {
            case "divOverlay":
                setSettingOverlayModeWindow();
                break;
            case "divSeries":
                setSettingSeriesModeWindow();
                break;
        }
    }
    //モードのdivをクリック
    function modeClick() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.TotalData.LV1.Print_Mode_Total = enmTotalMode_Number.DataViewMode;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.LayerData[Layernum].Print_Mode_Layer = enmLayerMode_Number.SoloMode;
        let mode;
        switch (this.id) {
            case "divClassPaint":
                mode = enmSoloMode_Number.ClassPaintMode;
                break;
            case "divClassMark":
                mode = enmSoloMode_Number.ClassMarkMode;
                break;
            case "divClassOD":
                mode = enmSoloMode_Number.ClassODMode;
                break;
            case "divMarkSize":
                mode = enmSoloMode_Number.MarkSizeMode;
                break;
            case "divMarkBlock":
                mode = enmSoloMode_Number.MarkBlockMode;
                break;
            case "divMarkBar":
                mode = enmSoloMode_Number.MarkBarMode;
                break;
            case "divString":
                mode = enmSoloMode_Number.StringMode;
                break;
            case "divContour":
                mode = enmSoloMode_Number.ContourMode;
                break;
            case "divMarkTurn":
                mode = enmSoloMode_Number.MarkTurnMode;
                break;
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.setSoloMode(Layernum, DataNum, mode);
        setDataMode();
        setSettingSoloModeWindow();
    }
    //シェープファイル読み込み
    function mnuOpenShapeFile() {
        openShapeFile(okButton);
        function okButton(mapdata, layerdata) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData = new clsAttrData();
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.SetMapViewerData(mapdata, layerdata, false);
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.TotalData.LV1.DataSourceType = enmDataSource.Shapefile;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            man_Data = attrData.TotalData.LV1.DataSourceType;
            initAfterGetData(false);
        }
    }
    //属性データ読み込み
    function menuReadData() {
        readData(okButton);
        function okButton(mapdata, attrText, filename, ext) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData = new clsAttrData();
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let retv = attrData.OpenNewMandaraFile(mapdata, attrText, filename, ext);
            if (retv.emes != "") {
                Generic.createMsgBox("読み込みエラー", retv.emes, true);
            }
            if (retv.ok == false) {
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                Generic.alert(undefined, "MANDARAデータとして読み込めませんでした。");
                // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
                Frm_Print.setVisibility(false);
                // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
                propertyWindow.nextVisible = true;
                // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
                propertyWindow.setVisibility(false);
                divpanel.style.visibility = 'hidden';
                settingModeWindow.setVisibility(false);
                man_Data = enmDataSource.NoData;
            }
            else {
                let non_clearf = false;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                man_Data = attrData.TotalData.LV1.DataSourceType;
                if ((man_Data == enmDataSource.MDRJ) || ((man_Data == enmDataSource.MDRMJ))) {
                    non_clearf = true;
                }
                initAfterGetData(non_clearf);
            }
        }
    }
    /**データ挿入(既存属性データから) */
    function menuInsertDataFile() {
        readData(okButton);
        function okButton(mapdata, attrText, filename, ext) {
            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
            let newAttrData = new clsAttrData();
            let retv = newAttrData.OpenNewMandaraFile(mapdata, attrText, filename, ext);
            if (retv.emes != "") {
                Generic.createMsgBox("読み込みエラー", retv.emes, true);
            }
            if (retv.ok == false) {
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                Generic.alert(undefined, "MANDARAデータとして読み込めませんでした。");
            }
            else {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let retV = attrData.ADD_AttrData(newAttrData, true);
                if (retV.ok == true) {
                    Init_Screen_Set(true);
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.Set_LayerName_to(selectLayer, attrData.TotalData.LV1.SelectedLayer);
                }
            }
        }
    }
    /**データ挿入(シェープファイルから) */
    function menuInsertShapefile() {
        openShapeFile(okButton);
        function okButton(mapdata, layerdata) {
            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
            let newAttrData = new clsAttrData();
            newAttrData.SetMapViewerData(mapdata, layerdata, false);
            newAttrData.TotalData.LV1.DataSourceType = enmDataSource.Shapefile;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let retV = attrData.ADD_AttrData(newAttrData, true);
            if (retV.ok == true) {
                Init_Screen_Set(true);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Set_LayerName_to(selectLayer, attrData.TotalData.LV1.SelectedLayer);
            }
        }
    }
    /**データ挿入(白地図・初期属性データ表示から) */
    function menuInsertMapViewer() {
        mapViewer(okButton);
        function okButton(mapdata, layerdata) {
            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
            let newAttrData = new clsAttrData();
            newAttrData.SetMapViewerData(mapdata, layerdata, false);
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let retV = attrData.ADD_AttrData(newAttrData, true);
            if (retV.ok == true) {
                Init_Screen_Set(true);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Set_LayerName_to(selectLayer, attrData.TotalData.LV1.SelectedLayer);
            }
        }
    }
    /**プロパティ */
    function mnuProperty() {
        const backDiv = Generic.set_backDiv("", "プロパティ", 650, 360, true, true, buttonOK, 0.2, true);
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let layn = attrData.TotalData.LV1.Lay_Maxn;
        let data = Generic.Array2Dimension(2, layn * 10 + 4, "");
        data[0][0] = "項目";
        data[1][0] = "値";
        data[0][1] = "地図ファイル数";
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        data[1][1] = attrData.MapData.GetNumOfMapFile();
        data[0][2] = "地図ファイル";
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        data[1][2] = attrData.MapData.GetMapFileName().join(",");
        data[0][3] = "レイヤ数";
        data[1][3] = layn;
        let n = 4;
        for (let i = 0; i < layn; i++) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let lay = attrData.LayerData[i];
            data[0][n + 0] = " ";
            data[1][n + 0] = " ";
            data[0][n + 1] = "レイヤ名";
            data[1][n + 1] = lay.Name;
            data[0][n + 2] = "使用地図ファイル";
            data[1][n + 2] = lay.MapFileName;
            data[0][n + 3] = "種類";
            data[1][n + 3] = Generic.getLayerTypeName(lay.Type);
            data[0][n + 4] = "形状";
            data[1][n + 4] = Generic.ConvertShapeEnumString(lay.Shape);
            data[0][n + 5] = "時間";
            data[1][n + 5] = lay.Time.toString();
            data[0][n + 6] = "コメント";
            data[1][n + 6] = lay.Comment;
            data[0][n + 7] = "オブジェクト数";
            data[1][n + 7] = lay.atrObject.ObjectNum;
            data[0][n + 8] = "データ項目数";
            data[1][n + 8] = lay.atrData.Count;
            data[0][n + 9] = "ダミーオブジェクト数";
            data[1][n + 9] = lay.Dummy.length;
            n += 10;
        }
        Generic.createNewSpan(backDiv, "データ", "", "", 15, 40, "", undefined);
        Generic.createNewSpan(backDiv, "データのコメント", "", "", 330, 40, "", undefined);
        Generic.createNewGrid(backDiv, "", "", "grayFrame", "", data, 15, 60, 300, 250, '100%', "", "font-size:13px", 1, "background-color:#aaffaa;", "", "", "");
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let txComment = Generic.createNewTextarea(backDiv, attrData.TotalData.LV1.Comment, "", 330, 60, 20, 50, "resize:none;width:300px;height:250px");
        function buttonOK() {
            Generic.clear_backDiv();
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.TotalData.LV1.Comment = txComment.value;
        }
    }
    /**非表示オブジェクトの削除 */
    function mnuDeleteInvisibleObject() {
        let ObjLive = [];
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let LayMax = attrData.TotalData.LV1.Lay_Maxn;
        let delN = 0;
        let DelNum = new Array(LayMax).fill(0);
        for (let i = 0; i < LayMax; i++) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let objn = attrData.Get_ObjectNum(i);
            let obn = new Array(objn).fill(false);
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if (attrData.LayerData[i].atrObject.NumOfSyntheticObj == 0) {
                for (let j = 0; j < objn; j++) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    if (attrData.Check_Condition(i, j) == false) {
                        obn[j] = true;
                        DelNum[i]++;
                        delN++;
                    }
                }
            }
            if (objn == DelNum[i]) {
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                Generic.alert(undefined, attrData.LayerData[i].Name + "は全てのオブジェクトが非表示なので、削除できません。");
                return;
            }
            ObjLive.push(obn);
        }
        if (delN == 0) {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            Generic.alert(undefined, "非表示オブジェクトはありません。");
        }
        else {
            Generic.confirm(undefined, "非表示の " + delN + " オブジェクトを削除します。", function () {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.DeleteObjects(DelNum, ObjLive);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Check_Vector_Object();
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.PrtObjectSpatialIndex();
                setSettingSoloModeWindow();
                setFrequencyLabel();
            }, undefined);
        }
    }
    /**属性データ新規作成 */
    function mnuNewPropertyEdit() {
        Check_EraseSettei_OK(function () {
            clsGrid(true, buttonOK);
        });
        function buttonOK(newAttr) {
            man_Data = enmDataSource.DataEdit;
            settingModeWindow.setVisibility(true);
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData = new clsAttrData();
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData = newAttr;
            initAfterGetData(false);
        }
    }
    /**属性データ編集 */
    function mnuPropertyEdit() {
        clsGrid(false, buttonOK);
        function buttonOK(newAttr) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData = new clsAttrData();
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData = newAttr;
            Init_Screen_Set(true);
            initFirtScreen();
        }
    }
    /**空間検索メニュー */
    function mnuSpatialSearch(e) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let oldData = attrData.LayerData[Layernum].atrData.Count;
        frmMain_Buffer(function (e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let newData = attrData.LayerData[Layernum].atrData.Count;
            let lst = [];
            for (let i = oldData; i < newData; i++) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                lst.push({ value: oldData, text: attrData.Get_DataTitle(Layernum, i, true) });
            }
            // @ts-expect-error TS(2339): Property 'addSelectList' does not exist on type 'H... Remove this comment to see the full error message
            selectDataItem.addSelectList(lst, undefined, false, true);
            Generic.clear_backDiv();
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            Generic.alert(new point(e.clientX, e.clientY), "空間検索が終了しました。");
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if (attrData.TotalData.LV1.Print_Mode_Total == enmTotalMode_Number.DataViewMode) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                if (attrData.LayerData[Layernum].Print_Mode_Layer == enmLayerMode_Number.SoloMode) {
                    selectDataItem.selectedIndex = oldData;
                    changeDataItem(0, oldData, 0);
                }
            }
        });
    }
    function Check_EraseSettei_OK(okCall) {
        if (man_Data != enmDataSource.NoData) {
            Generic.confirm(undefined, "現在のデータは破棄されます。よろしいですか？", function () {
                man_Data = enmDataSource.NoData;
                // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
                Frm_Print.setVisibility(false);
                // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
                propertyWindow.nextVisible = true;
                // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
                propertyWindow.setVisibility(false);
                divpanel.style.visibility = 'hidden';
                settingModeWindow.setVisibility(false);
                okCall();
            }, undefined);
        }
        else {
            okCall();
        }
    }
    /**面積・周長取得メニュー */
    function mnuAreaPeripheri(e) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let shape = attrData.LayerData[Layernum].Shape;
        if ((shape == enmShape.PointShape) || (shape == enmShape.NotDeffinition)) {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            Generic.alert(new point(e.clientX, e.clientY), "線または面形状のレイヤでないと、この機能は使えません。");
            return;
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if (attrData.LayerData[Layernum].MapFileData.Map.Detail.DistanceMeasurable == false) {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            Generic.alert(new point(e.clientX, e.clientY), "使用する地図ファイルで面積・距離測定はできない設定になっています。");
            return;
        }
        frmMain_AreaPeripheri(function (e) {
            addNewDataItem(e);
        });
    }
    /**データ計算メニュー */
    function mnuCulc(e) {
        frmMain_Culc(function (e) {
            addNewDataItem(e);
        });
    }
    function addNewDataItem(e) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let newN = attrData.Get_DataNum(Layernum);
        // @ts-expect-error TS(2339): Property 'addSelectList' does not exist on type 'H... Remove this comment to see the full error message
        selectDataItem.addSelectList([{ value: newN - 1, text: attrData.Get_DataTitle(Layernum, newN - 1, true) }], undefined, false, true);
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
        Generic.alert(new point(e.clientX, e.clientY), "データ項目：" + attrData.Get_DataTitle(Layernum, newN - 1, false) + " を取得しました。");
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if (attrData.TotalData.LV1.Print_Mode_Total == enmTotalMode_Number.DataViewMode) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if (attrData.LayerData[Layernum].Print_Mode_Layer == enmLayerMode_Number.SoloMode) {
                selectDataItem.selectedIndex = newN - 1;
                changeDataItem(0, newN - 1, 0);
            }
        }
    }
    /**距離測定メニュー */
    function mnuMeasureDistance(e) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if (attrData.LayerData[Layernum].MapFileData.Map.Detail.DistanceMeasurable == false) {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            Generic.alert(new point(e.clientX, e.clientY), "使用する地図ファイルで面積・距離測定はできない設定になっています。");
            return;
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let oldN = attrData.Get_DataNum(Layernum);
        frmMain_GetDistance(function (e) {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            Generic.alert(new point(e.clientX, e.clientY), "距離を取得しました。");
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let newN = attrData.Get_DataNum(Layernum);
            for (let i = oldN; i < newN; i++) {
                // @ts-expect-error TS(2339): Property 'addSelectList' does not exist on type 'H... Remove this comment to see the full error message
                selectDataItem.addSelectList([{ value: i, text: attrData.Get_DataTitle(Layernum, i, true) }], undefined, false, true);
            }
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if (attrData.TotalData.LV1.Print_Mode_Total == enmTotalMode_Number.DataViewMode) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                if (attrData.LayerData[Layernum].Print_Mode_Layer == enmLayerMode_Number.SoloMode) {
                    selectDataItem.selectedIndex = oldN;
                    changeDataItem(0, oldN, 0);
                }
            }
        });
    }
    /**属性検索設定 */
    function mnuConditionSettings() {
        frmMain_ConditionSettings(function () {
            // @ts-expect-error TS(2304): Cannot find name 'Check_Print_err'.
            Check_Print_err();
        });
    }
    /**データ項目設定コピー */
    function mnuCopyDataSettings() {
        frmMainCopyDataSettings(function () {
            setDataMode();
            setSettingSoloModeWindow();
        });
    }
    /**連続表示モードにまとめて設定 */
    function mnuSetSeriesMode() {
        frmMain_SetSeriesMode(function (selIndex) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.TotalData.LV1.Print_Mode_Total = enmTotalMode_Number.SeriesMode;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.TotalData.TotalMode.Series.SelectedIndex = selIndex;
            clearModeIcon();
            // @ts-expect-error TS(2339): Property 'selected' does not exist on type 'HTMLDi... Remove this comment to see the full error message
            divSeries.selected = true;
            divSeries.style.backgroundColor = '#ff6464';
            // @ts-expect-error TS(2339): Property 'tooltip' does not exist on type 'HTMLDiv... Remove this comment to see the full error message
            settingModeWindow.setTitle(divSeries.tooltip);
            rightSettingWindowControlVisibilitySet();
            setSettingSeriesModeWindow();
            // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
            Frm_Print.setVisibility(false);
            // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
            propertyWindow.nextVisible = (propertyWindow.getVisibility() == true);
            // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
            propertyWindow.setVisibility(false);
        });
    }
    /**記号表示位置等操作 */
    function mnuMarkPosition() {
        frmMain_MarkPosition(function (mode, x, y) {
            switch (mode) {
                case 0:
                case 1:
                case 5: {
                    let Data_Val_STRX = [];
                    let Data_Val_STRY = [];
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let LayerNum = attrData.TotalData.LV1.SelectedLayer;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let Objn = attrData.Get_ObjectNum(LayerNum);
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let newN = attrData.Get_DataNum(LayerNum);
                    for (let i = 0; i < Objn; i++) {
                        let P;
                        switch (mode) {
                            case 0:
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                P = attrData.Get_CenterP(LayerNum, i);
                                break;
                            case 1:
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                P = attrData.LayerData[LayerNum].atrObject.atrObjectData[i].Symbol;
                                break;
                            case 5:
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                P = attrData.LayerData[LayerNum].atrObject.atrObjectData[i].Label;
                                break;
                        }
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        let P2 = spatial.Get_Reverse_XY(P, attrData.TotalData.ViewStyle.Zahyo);
                        Data_Val_STRX[i] = P2.x;
                        Data_Val_STRY[i] = P2.y;
                    }
                    let title = "";
                    switch (mode) {
                        case 0:
                            title = "代表点";
                            break;
                        case 1:
                            title = "記号表示位置";
                            break;
                        case 5:
                            title = "ラベル表示位置";
                            break;
                    }
                    let TTL = "";
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    switch (attrData.TotalData.ViewStyle.Zahyo.Mode) {
                        case enmZahyo_mode_info.Zahyo_No_Mode:
                            TTL = title + "Ｘ";
                            break;
                        case enmZahyo_mode_info.Zahyo_Ido_Keido:
                            TTL = title + "経度";
                            break;
                        case enmZahyo_mode_info.Zahyo_HeimenTyokkaku:
                            TTL = title + "Ｙ";
                            break;
                    }
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.Add_One_Data_Value(LayerNum, TTL, "", "", Data_Val_STRX, false);
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    switch (attrData.TotalData.ViewStyle.Zahyo.Mode) {
                        case enmZahyo_mode_info.Zahyo_No_Mode:
                            TTL = title + "Ｙ";
                            break;
                        case enmZahyo_mode_info.Zahyo_Ido_Keido:
                            TTL = title + "緯度";
                            break;
                        case enmZahyo_mode_info.Zahyo_HeimenTyokkaku:
                            TTL = title + "Ｘ";
                            break;
                    }
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.Add_One_Data_Value(LayerNum, TTL, "", "", Data_Val_STRY, false);
                    // @ts-expect-error TS(2339): Property 'addSelectList' does not exist on type 'H... Remove this comment to see the full error message
                    selectDataItem.addSelectList([{ value: newN, text: attrData.Get_DataTitle(LayerNum, newN, true) }, { value: newN + 1, text: attrData.Get_DataTitle(LayerNum, newN + 1, true) }], undefined, false, true);
                    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                    Generic.alert(undefined, title + "を取得しました。");
                    selectDataItem.selectedIndex = newN;
                    changeDataItem(0, newN, 0);
                    break;
                }
            }
        });
    }
    /**本サイトについて */
    function mnuAbout() {
        const backDiv = Generic.set_backDiv("", "本サイトについて", 330, 285, true, false, buttonOK, 0.2, true);
        AbountInner(backDiv, 15, 50);
        function buttonOK() {
            Generic.clear_backDiv();
        }
    }
    function AbountInner(parent, x, y) {
        let frame = Generic.createNewFrame(parent, "", "", x, y, 300, 185);
        frame.style.backgroundColor = "#ffffff";
        let tx1 = "ブラウザGIS MANDARA JS";
        let tx2 = "バージョン 1.003";
        let tx3 = "<b>左上のメニューから始めてください</b>";
        let tx4 = '<a href="http://ktgis.net/lab" target="_blank">谷 謙二（埼玉大学教育学部人文地理学研究室）</a>';
        let tx5 = '<a href="index.html" target="_blank">本サイトのページ</a>';
        let tx6 = '<a href="http://ktgis.net/mandara/" target="_blank">Windows版MANDARA10のページ</a>';
        Generic.createNewSpan(frame, tx1, "", "", 15, 15, "", undefined);
        Generic.createNewSpan(frame, tx2, "", "", 100, 40, "", undefined);
        Generic.createNewSpan(frame, tx3, "", "", 50, 70, "", undefined);
        Generic.createNewSpan(frame, tx4, "", "", 15, 100, "", undefined);
        Generic.createNewSpan(frame, tx5, "", "", 70, 150, "", undefined);
        Generic.createNewSpan(frame, tx6, "", "", 70, 125, "", undefined);
        return frame;
    }
    //属性データ保存
    function menuSaveData() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        switch (attrData.TotalData.LV1.DataSourceType) {
            case enmDataSource.MDRMJ:
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                Generic.alert(undefined, "地図ファイル付属形式で保存して下さい。");
                return;
                break;
            case enmDataSource.Shapefile:
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                Generic.alert(undefined, "シェープファイルは地図ファイル付属形式で保存して下さい。");
                return;
                break;
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let fname = Generic.getFilenameWithoutExtension(attrData.TotalData.LV1.FileName) + ".mdrj";
        Generic.prompt(undefined, "属性データファイル名", fname, function (v) {
            fname = Generic.getFilenameWithoutExtension(v) + ".mdrj";
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.saveAsMDRJ(fname, false);
        });
    }
    /**地図ファイル付属形式 */
    function menuSaveMDRMJData() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let fname = Generic.getFilenameWithoutExtension(attrData.TotalData.LV1.FileName) + ".mdrmj";
        Generic.prompt(undefined, "地図データ付属形式属性データファイル名", fname, function (v) {
            fname = Generic.getFilenameWithoutExtension(v) + ".mdrmj";
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.saveAsMDRJ(fname, true);
        });
    }
    //白地図初期属性データ
    function mnuMapViewer() {
        mapViewer(okButton);
        function okButton(mapdata, layerdata) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData = new clsAttrData();
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.SetMapViewerData(mapdata, layerdata, false);
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.TotalData.LV1.DataSourceType = enmDataSource.Viwer;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            man_Data = attrData.TotalData.LV1.DataSourceType;
            initAfterGetData(false);
        }
    }
    function SetODModeOriginObject() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let ldd = attrData.nowDataSolo().ClassODMD;
        let tx = "";
        if (ldd.o_Layer != Layernum) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            tx += "レイヤ:" + attrData.LayerData[ldd.o_Layer].Name + '\n';
        }
        if (ldd.Dummy_ObjectFlag == false) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            tx += attrData.LayerData[ldd.o_Layer].atrObject.atrObjectData[ldd.O_object].Name;
        }
        else {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            tx += attrData.LayerData[ldd.o_Layer].Dummy[ldd.O_object].Name;
        }
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        document.getElementById("ODOriginObjectDiv").innerHTML = tx;
    }
    /**重ね合わせセットボタン */
    function overlaySet(e) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let retV = attrData.Get_PrintError();
        if (retV.Print_Enable == enmPrint_Enable.UnPrintable) {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            Generic.alert(new point(e.clientX, e.clientY), retV.message);
            return;
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let OverLayDataSetNum = attrData.TotalData.TotalMode.OverLay.SelectedIndex;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let ovdn = attrData.TotalData.TotalMode.OverLay.DataSet.length;
        let ovttl = [];
        for (let i = 0; i < ovdn; i++) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            ovttl[i] = attrData.TotalData.TotalMode.OverLay.DataSet[i].title;
            if (ovttl[i] == "") {
                ovttl[i] = "重ね合わせデータセット" + (i + 1).toString();
            }
        }
        if (ovdn > 1) {
            Generic.createNewDropdownSelect("重ね合わせデータセット選択", ovttl, e.clientX, e.clientY, 220, function (sel) {
                OverLayDataSetNum = sel;
                setOverlay();
            });
        }
        else {
            setOverlay();
        }
        function setOverlay() {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let Layernum = attrData.TotalData.LV1.SelectedLayer;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let al = attrData.LayerData[Layernum];
            let DataNum = al.atrData.SelectedIndex;
            let ad = al.atrData.Data[DataNum];
            let MDLayer = al.Print_Mode_Layer;
            let SoloMd;
            let MultiDataSetIndex;
            switch (MDLayer) {
                case enmLayerMode_Number.SoloMode:
                    SoloMd = ad.ModeData;
                    break;
                case enmLayerMode_Number.GraphMode:
                    MultiDataSetIndex = al.LayerModeViewSettings.GraphMode.SelectedIndex;
                    break;
                case enmLayerMode_Number.LabelMode:
                    MultiDataSetIndex = al.LayerModeViewSettings.LabelMode.SelectedIndex;
                    break;
            }
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let DataSet = attrData.TotalData.TotalMode.OverLay.DataSet[OverLayDataSetNum];
            let Num = DataSet.DataItem.length;
            let Index = Num;
            for (let i = 0; i < Num; i++) {
                let di = DataSet.DataItem[i];
                switch (MDLayer) {
                    case enmLayerMode_Number.SoloMode:
                        if (di.Print_Mode_Layer == enmLayerMode_Number.SoloMode) {
                            i = Num;
                        }
                        break;
                    case enmLayerMode_Number.GraphMode: {
                        if ((di.Layer == Layernum) && (di.Print_Mode_Layer == enmLayerMode_Number.GraphMode)) {
                            let PresentGraphMode = al.LayerModeViewSettings.GraphMode.DataSet[MultiDataSetIndex].GraphMode;
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            let StackedGraphMode = attrData.LayerData[di.Layer].LayerModeViewSettings.GraphMode.DataSet[di.DataNumber].GraphMode;
                            if (di.DataNumber == MultiDataSetIndex) {
                                Index = -2;
                                i = Num;
                            }
                            else if (((StackedGraphMode == enmGraphMode.BarGraph) && (PresentGraphMode == enmGraphMode.LineGraph)) || ((StackedGraphMode == enmGraphMode.LineGraph) && (PresentGraphMode == enmGraphMode.BarGraph))) {
                            }
                            else {
                                if (window.confirm("同一レイヤのグラフモードで重ね合わせ可能な組み合わせは、折れ線グラフと棒グラフのみです。置換します。") == true) {
                                    Index = -1;
                                    i = Num;
                                }
                                else {
                                    Index = i;
                                    i = Num;
                                }
                            }
                        }
                        break;
                    }
                    case enmLayerMode_Number.LabelMode:
                        if ((di.Layer == Layernum) && (di.DataNumber == MultiDataSetIndex) && (di.Print_Mode_Layer == enmLayerMode_Number.LabelMode)) {
                            Index = -2;
                            i = Num;
                        }
                        break;
                    case enmLayerMode_Number.TripMode:
                        if ((di.Layer == Layernum) && (di.DataNumber == MultiDataSetIndex) && (di.Print_Mode_Layer == enmLayerMode_Number.TripMode)) {
                            Index = -2;
                            i = Num;
                        }
                        break;
                }
            }
            if (Index == -2) {
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                Generic.alert(undefined, "このデータセットはすでに重ね合わせモードに設定してあります。");
            }
            else if (Index == -1) {
            }
            else {
                // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                let d = new strOverLay_DataSet_Item_Info();
                //d.TileMapf = false;
                d.Layer = Layernum;
                d.Print_Mode_Layer = MDLayer;
                let lpf = false;
                switch (MDLayer) {
                    case enmLayerMode_Number.SoloMode:
                        d.DataNumber = DataNum;
                        d.Mode = SoloMd;
                        lpf = true;
                        switch (d.Mode) {
                            case enmSoloMode_Number.ContourMode:
                                let alc = ad.SoloModeViewSettings.ContourMD;
                                if ((alc.Interval_Mode == enmContourIntervalMode.RegularInterval) || (alc.Interval_Mode == enmContourIntervalMode.SeparateSettings)) {
                                    lpf = false;
                                }
                                break;
                            case enmSoloMode_Number.MarkTurnMode:
                                //記号の回転モードは、内部データがある場合のみ凡例を表示
                                // if(ald.SoloModeViewSettings.MarkCommon.Inner_Data.Flag == false ){
                                //     lpf = false
                                // }
                                break;
                        }
                        break;
                    case enmLayerMode_Number.GraphMode:
                        d.DataNumber = MultiDataSetIndex;
                        lpf = true;
                        break;
                    case enmLayerMode_Number.LabelMode:
                        d.DataNumber = MultiDataSetIndex;
                        lpf = false;
                        break;
                    case enmLayerMode_Number.TripMode:
                        //     d.DataNumber = MultiDataSetIndex;
                        // lpf = false;
                        break;
                }
                d.Legend_Print_Flag = lpf;
                if (Index == Num) {
                    DataSet.DataItem.push(d);
                }
                else {
                    DataSet.DataItem[Index] = d;
                }
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Sort_OverLay_Data(OverLayDataSetNum);
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                Generic.alert(new point(e.clientX, e.clientY), "「" + ovttl[OverLayDataSetNum] + "」にセットしました。");
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                if (OverLayDataSetNum != attrData.TotalData.TotalMode.OverLay.SelectedIndex) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.TotalData.TotalMode.OverLay.SelectedIndex = OverLayDataSetNum;
                }
            }
        }
    }
    /**連続表示セットボタン */
    function seriesSet(e) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let retV = attrData.Get_PrintError();
        if (retV.Print_Enable == enmPrint_Enable.UnPrintable) {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            Generic.alert(new point(e.clientX, e.clientY), retV.message);
            return;
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let ats = attrData.TotalData.TotalMode.Series;
        let sedn = ats.DataSet.length;
        let ttl = [];
        for (let i = 0; i < sedn; i++) {
            ttl[i] = ats.DataSet[i].title;
            if (ttl[i] == "") {
                ttl[i] = "連続表示データセット" + (i + 1).toString();
            }
        }
        if (sedn > 1) {
            Generic.createNewDropdownSelect("連続表示データセット選択", ttl, e.clientX, e.clientY, 220, function (sel) {
                setSeries(sel);
            });
        }
        else {
            setSeries(ats.SelectedIndex);
        }
        function setSeries(DataSetNum) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let ats = attrData.TotalData.TotalMode.Series;
            let atsd = ats.DataSet[DataSetNum];
            let Layernum;
            let DataNum;
            let ModeData;
            let Print_Mode_Layer;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let Print_Mode_Total = attrData.TotalData.LV1.Print_Mode_Total;
            switch (Print_Mode_Total) {
                case enmTotalMode_Number.DataViewMode: {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    Layernum = attrData.TotalData.LV1.SelectedLayer;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let al = attrData.LayerData[Layernum];
                    Print_Mode_Layer = al.Print_Mode_Layer;
                    switch (Print_Mode_Layer) {
                        case enmLayerMode_Number.SoloMode:
                            DataNum = al.atrData.SelectedIndex;
                            ModeData = al.atrData.Data[DataNum].ModeData;
                            break;
                        case enmLayerMode_Number.GraphMode:
                            DataNum = al.LayerModeViewSettings.GraphMode.SelectedIndex;
                            break;
                        case enmLayerMode_Number.LabelMode:
                            DataNum = al.LayerModeViewSettings.LabelMode.SelectedIndex;
                            break;
                        case enmLayerMode_Number.TripMode:
                            break;
                    }
                    break;
                }
                case enmTotalMode_Number.OverLayMode:
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    DataNum = attrData.TotalData.TotalMode.OverLay.SelectedIndex;
                    break;
            }
            atsd.AddData(Layernum, DataNum, Print_Mode_Total, Print_Mode_Layer, ModeData);
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            Generic.alert(new point(e.clientX, e.clientY), "「" + ttl[DataSetNum] + "」にセットしました。");
            if (DataSetNum != ats.SelectedIndex) {
                ats.SelectedIndex = DataSetNum;
            }
        }
    }
    //データ値表示
    function showObjectData() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let laydata = attrData.LayerData[Layernum];
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
        let data = Generic.Array2Dimension(3, laydata.atrObject.ObjectNum + 1);
        data[0][0] = "";
        data[1][0] = "オブジェクト名";
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        data[2][0] = "値" + attrData.Get_DataUnit_With_Kakko(Layernum, DataNum);
        for (let i = 0; i < laydata.atrObject.ObjectNum; i++) {
            data[0][i + 1] = i + 1;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            data[1][i + 1] = attrData.Get_KenObjName(Layernum, i);
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            data[2][i + 1] = attrData.Get_Data_Value(Layernum, DataNum, i, attrData.TotalData.ViewStyle.Missing_Data.Text);
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        Generic.createMsgTableBox(attrData.Get_DataTitle(Layernum, DataNum, false), data, 300, 500, true);
    }
    //統計値表示
    function showStatistics() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let laydata = attrData.LayerData[Layernum];
        let ddata = laydata.atrData.Data[DataNum];
        let txt = "レイヤ：" + laydata.Name + "\n"
            + "データ項目：" + ddata.Title + "\n"
            + "データの種類：" + Generic.ConvertAttDataTypeString(ddata.DataType) + "\n";
        if (ddata.DataType == enmAttDataType.Normal) {
            txt += "単位：" + ddata.Unit + '\n'
                + "最大値：" + ddata.Statistics.Max + '\n'
                + "最小値：" + ddata.Statistics.Min + '\n'
                + "合計値：" + ddata.Statistics.Sum + '\n'
                + "平均値：" + ddata.Statistics.Ave + '\n'
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                + "中央値：" + attrData.Get_MedianValue(Layernum, DataNum) + '\n'
                + "標準偏差：" + ddata.Statistics.STD + '\n'
                + "分散：" + (ddata.Statistics.STD ** 2) + '\n';
        }
        txt += '\n'
            + "非欠損値オブジェクト：" + ddata.EnableValueNum + '\n'
            + "欠損値オブジェクト：" + ddata.MissingValueNum + '\n';
        Generic.createMsgBox("統計値表示", txt, true);
    }
    //レイヤの変更
    function changeLayer(obj, sel, v) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.TotalData.LV1.SelectedLayer = sel;
        setDataItemList();
    }
    //データ項目の変更(obj, sel, v)は、セレクトボックスからの戻り値
    function changeDataItem(obj, sel, v) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let LayerNum = attrData.TotalData.LV1.SelectedLayer;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.LayerData[LayerNum].atrData.SelectedIndex = sel;
        for (let k in enmSoloMode_Number) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            let n = enmSoloMode_Number[k];
            SetPicPnlSoloDataEnabled(n, LayerNum, sel);
        }
        setDataMode();
        setSettingSoloModeWindow();
        setFrequencyLabel();
    }
    //読み込み直後の初期表示
    function initFirtScreen() {
        // @ts-expect-error TS(2339): Property 'setVisibility' does not exist on type 'H... Remove this comment to see the full error message
        firstPanelAbout.setVisibility(false);
        divpanel.style.visibility = 'visible';
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.Set_LayerName_to(selectLayer, attrData.TotalData.LV1.SelectedLayer);
        setDataItemList();
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let pmt = attrData.TotalData.LV1.Print_Mode_Total;
        let multiMode = ['divGraph', 'divLabel'];
        for (let i in multiMode) {
            let ele = document.getElementById(multiMode[i]);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            ele.addEventListener("mouseenter", modeEnter, false);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            ele.addEventListener("mouseleave", modeLeave, false);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            ele.addEventListener("click", multiModeClick, false);
        }
        let complexMode = ['divOverlay', 'divSeries'];
        for (let i in complexMode) {
            let ele = document.getElementById(complexMode[i]);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            ele.addEventListener("mouseenter", modeEnter, false);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            ele.addEventListener("mouseleave", modeLeave, false);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            ele.addEventListener("click", ComplexModeClick, false);
        }
        switch (pmt) {
            case enmTotalMode_Number.DataViewMode:
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                switch (attrData.nowLayer().Print_Mode_Layer) {
                    case enmLayerMode_Number.GraphMode:
                        clearModeIcon();
                        // @ts-expect-error TS(2339): Property 'selected' does not exist on type 'HTMLDi... Remove this comment to see the full error message
                        divGraph.selected = true;
                        divGraph.style.backgroundColor = '#ff6464';
                        // @ts-expect-error TS(2339): Property 'tooltip' does not exist on type 'HTMLDiv... Remove this comment to see the full error message
                        settingModeWindow.setTitle(divGraph.tooltip);
                        rightSettingWindowControlVisibilitySet();
                        setSettingGraphModeWindow();
                        break;
                    case enmLayerMode_Number.LabelMode:
                        clearModeIcon();
                        // @ts-expect-error TS(2339): Property 'selected' does not exist on type 'HTMLDi... Remove this comment to see the full error message
                        divLabel.selected = true;
                        divLabel.style.backgroundColor = '#ff6464';
                        // @ts-expect-error TS(2339): Property 'tooltip' does not exist on type 'HTMLDiv... Remove this comment to see the full error message
                        settingModeWindow.setTitle(divLabel.tooltip);
                        rightSettingWindowControlVisibilitySet();
                        setSettingLabelModeWindow();
                        break;
                }
                break;
            case enmTotalMode_Number.OverLayMode:
                clearModeIcon();
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.TotalData.LV1.Print_Mode_Total = pmt;
                // @ts-expect-error TS(2339): Property 'selected' does not exist on type 'HTMLDi... Remove this comment to see the full error message
                divOverlay.selected = true;
                divOverlay.style.backgroundColor = '#ff6464';
                // @ts-expect-error TS(2339): Property 'tooltip' does not exist on type 'HTMLDiv... Remove this comment to see the full error message
                settingModeWindow.setTitle(divOverlay.tooltip);
                rightSettingWindowControlVisibilitySet();
                setSettingOverlayModeWindow();
                break;
            case enmTotalMode_Number.SeriesMode:
                clearModeIcon();
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.TotalData.LV1.Print_Mode_Total = pmt;
                // @ts-expect-error TS(2339): Property 'selected' does not exist on type 'HTMLDi... Remove this comment to see the full error message
                divSeries.selected = true;
                divSeries.style.backgroundColor = '#ff6464';
                // @ts-expect-error TS(2339): Property 'tooltip' does not exist on type 'HTMLDiv... Remove this comment to see the full error message
                settingModeWindow.setTitle(divSeries.tooltip);
                rightSettingWindowControlVisibilitySet();
                setSettingSeriesModeWindow();
                break;
        }
    }
    //データ項目のリストを設定
    function setDataItemList() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let LayerNum = attrData.TotalData.LV1.SelectedLayer;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[LayerNum].atrData;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.Set_DataTitle_to_cboBox(selectDataItem, LayerNum, al.SelectedIndex);
        for (let k in enmSoloMode_Number) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            let n = enmSoloMode_Number[k];
            SetPicPnlSoloDataEnabled(n, LayerNum, al.SelectedIndex);
        }
        setDataMode();
        setSettingSoloModeWindow();
    }
    //度数分布の表示
    function setFrequencyLabel() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let data = attrData.LayerData[Layernum].atrData.Data[DataNum];
        let div_num = data.SoloModeViewSettings.Div_Num;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let retv = attrData.Get_ClassFrequency(Layernum, DataNum, false);
        for (let j = 0; j < div_num; j++) {
            let fbox = document.getElementById("freqBox" + j);
            if (retv.ok == true) {
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                fbox.innerHTML = String(retv.frequency[j]);
            }
            else {
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                fbox.innerHTML = "--";
            }
        }
        // @ts-expect-error TS(2304): Cannot find name 'Check_Print_err'.
        Check_Print_err();
    }
    //データ項目が変更された際に、単独表示モードの可否を調べ、コントロールを設定
    //solomode:enmSoloMode_Number
    function SetPicPnlSoloDataEnabled(solomode, LayerNum, DataNum) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let f = attrData.Check_Enable_SoloMode(solomode, LayerNum, DataNum);
        SetPicPnlDataEnabled(GetSelectModeFromSoloMode(solomode), f);
    }
    //表示モードセレクタのEnabel設定
    //Mode:enmSelectMode
    function SetPicPnlDataEnabled(Mode, Flag) {
        let name = GetModeControlName(Mode);
        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
        let ele = document.getElementById(name);
        if (ele != undefined) {
            Generic.setDisabled(ele, !Flag);
            if (Flag == true) {
                ele.addEventListener("mouseenter", modeEnter, false);
                ele.addEventListener("mouseleave", modeLeave, false);
                ele.addEventListener("click", modeClick, false);
                // @ts-expect-error TS(2339): Property 'disabled' does not exist on type 'HTMLEl... Remove this comment to see the full error message
                ele.disabled = false;
                ele.style.backgroundColor = "#ffffff";
            }
            else {
                ele.removeEventListener("mouseenter", modeEnter, false);
                ele.removeEventListener("mouseleave", modeLeave, false);
                ele.removeEventListener("click", modeClick, false);
                // @ts-expect-error TS(2339): Property 'disabled' does not exist on type 'HTMLEl... Remove this comment to see the full error message
                ele.disabled = true;
            }
        }
    }
    //表示モード列挙型からコントロール名を取得
    //sm:enmSelectMode
    function GetModeControlName(sm) {
        switch (sm) {
            case enmSelectMode.ClassPaintMode:
                return "divClassPaint";
                break;
            case enmSelectMode.ClassHatchMode:
                return "ClassHatch";
                break;
            case enmSelectMode.ClassMarkMode:
                return "divClassMark";
                break;
            case enmSelectMode.ClassODMode:
                return "divClassOD";
                break;
            case enmSelectMode.MarkSizeMode:
                return "divMarkSize";
                break;
            case enmSelectMode.MarkBlockMode:
                return "divMarkBlock";
                break;
            case enmSelectMode.MarkTurnMode:
                return "divMarkTurn";
                break;
            case enmSelectMode.MarkBarMode:
                return "divMarkBar";
                break;
            case enmSelectMode.ContourMode:
                return "divContour";
                break;
            case enmSelectMode.StringMode:
                return "divString";
                break;
            case enmSelectMode.GraphMode:
                return "divGraph";
                break;
            case enmSelectMode.LabelMode:
                return "divLabel";
                break;
            case enmSelectMode.TripMode:
                return "Trip";
                break;
            case enmSelectMode.OverLayMode:
                return "divOverlay";
                break;
            case enmSelectMode.SeriesMode:
                return "divSeries";
                break;
        }
    }
    //単独表示モードから選択モードを取得noModeの場合はラベルモードを返す
    function GetSelectModeFromSoloMode(SoloMode) {
        switch (SoloMode) {
            case enmSoloMode_Number.ClassPaintMode:
                return enmSelectMode.ClassPaintMode;
                break;
            case enmSoloMode_Number.ClassHatchMode:
                return enmSelectMode.ClassHatchMode;
                break;
            case enmSoloMode_Number.ClassMarkMode:
                return enmSelectMode.ClassMarkMode;
                break;
            case enmSoloMode_Number.ClassODMode:
                return enmSelectMode.ClassODMode;
                break;
            case enmSoloMode_Number.MarkSizeMode:
                return enmSelectMode.MarkSizeMode;
                break;
            case enmSoloMode_Number.MarkBlockMode:
                return enmSelectMode.MarkBlockMode;
                break;
            case enmSoloMode_Number.MarkTurnMode:
                return enmSelectMode.MarkTurnMode;
                break;
            case enmSoloMode_Number.ContourMode:
                return enmSelectMode.ContourMode;
                break;
            case enmSoloMode_Number.MarkBarMode:
                return enmSelectMode.MarkBarMode;
                break;
            case enmSoloMode_Number.StringMode:
                return enmSelectMode.StringMode;
                break;
            case enmSoloMode_Number.noMode:
                //文字列データの場合
                return enmSelectMode.noMode;
                break;
        }
    }
    //●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
    /**グラフ表示モードの設定画面の要素設定 */
    function setSettingGraphModeWindow() {
        graphDatasetSelectSet();
        graphDatasetDataItem();
        // @ts-expect-error TS(2304): Cannot find name 'Check_Print_err'.
        Check_Print_err();
    }
    function graphDatasetSelectSet() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let graph = attrData.layerGraph();
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let graphDataSetList = attrData.getGraphTitle(attrData.TotalData.LV1.SelectedLayer);
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        document.getElementById("graphDataSetList").addSelectList(graphDataSetList, graph.SelectedIndex, true, false);
        pnlGraphEachItem(0);
    }
    /**グラフ表示モードのデータセットの内容を表示 */
    function graphDatasetDataItem() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let selGraph = attrData.nowGraph();
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        document.getElementById("graphDatasetTitle").value = selGraph.title;
        Generic.checkRadioByValue("graphShape", selGraph.GraphMode);
        picGraphLinePat();
    }
    /**グラフ表示モードの「線種」 */
    function picGraphLinePat() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let selGraph = attrData.nowGraph();
        switch (selGraph.GraphMode) {
            case enmGraphMode.PieGraph:
            // @ts-expect-error TS(2551): Property 'StackedBarGrap' does not exist on type '... Remove this comment to see the full error message
            case enmGraphMode.StackedBarGrap:
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Draw_Sample_LineBox(document.getElementById("graphLinePat"), selGraph.En_Obi.BoaderLine);
                break;
            case enmGraphMode.BarGraph:
            case enmGraphMode.LineGraph:
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Draw_Sample_LineBox(document.getElementById("graphLinePat"), selGraph.Oresen_Bou.Line);
                break;
        }
    }
    /**グラフモードの表示データ項目を設定 */
    function pnlGraphEachItem(newRow) {
        let pnl = document.getElementById("pnlGraphItem");
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let selGraph = attrData.nowGraph();
        let datan = selGraph.Data.length;
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        let w = pnl.offsetWidth - scrMargin.scrollWidth - 10;
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        for (let i = pnl.inPanel; i < datan; i++) {
            let ele = Generic.createNewDiv(pnl, "", "pnlGraphIteminPanel" + String(i), "", 5, pnlGraphEachItemHeight * i, w, pnlGraphEachItemHeight, "border:solid 1px white;", eleClick);
            // @ts-expect-error TS(2339): Property 'tag' does not exist on type 'HTMLDivElem... Remove this comment to see the full error message
            ele.tag = i;
            let eleText = Generic.createNewDiv(ele, "", "pnlGraphIteminPanelTextBox" + String(i), "", 0, 2, w - 30, pnlGraphEachItemHeight - 3, "overflow:hidden;text-overflow:ellipsis;white-space:nowrap", eleClick);
            // @ts-expect-error TS(2339): Property 'tag' does not exist on type 'HTMLDivElem... Remove this comment to see the full error message
            eleText.tag = i;
            let eleTile = Generic.createNewTileBox(ele, "pnlGraphIteminPanelTileBox" + String(i), "", clsBase.Tile(), w - 30, 0, undefined, function (e) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let tsel = attrData.nowGraph();
                let i = Number(this.tag);
                let tile = tsel.Data[i].Tile;
                clsTileSet(e, tile, function (retTile) { tsel.Data[i].Tile = retTile; });
            }, 30);
            // @ts-expect-error TS(2339): Property 'tag' does not exist on type 'HTMLDivElem... Remove this comment to see the full error message
            eleTile.tag = i;
        }
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        for (let i = datan; i < pnl.inPanel; i++) {
            let delele = document.getElementById("pnlGraphIteminPanel" + String(i));
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            pnl.removeChild(delele);
        }
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        pnl.style.height = (datan * pnlGraphEachItemHeight + 2).px();
        for (let i = 0; i < datan; i++) {
            let tbox = document.getElementById("pnlGraphIteminPanelTileBox" + String(i));
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            tbox.setVisibility(selGraph.GraphMode != enmGraphMode.LineGraph);
            Generic.setTileDiv(tbox, selGraph.Data[i].Tile);
            let ele = document.getElementById("pnlGraphIteminPanelTextBox" + String(i));
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            ele.innerText = attrData.Get_DataTitle(attrData.TotalData.LV1.SelectedLayer, selGraph.Data[i].DataNumber, true);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("pnlGraphIteminPanel" + String(i)).style.borderColor = 'white';
        }
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        pnl.inPanel = datan;
        selItemBorder(newRow);
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        document.getElementById("btmBarGraphColorSetting").setVisibility(selGraph.GraphMode == enmGraphMode.BarGraph);
        // @ts-expect-error TS(2304): Cannot find name 'Check_Print_err'.
        Check_Print_err();
        function eleClick() {
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            if (pnl.selectedRow != -1) {
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                document.getElementById("pnlGraphIteminPanel" + String(pnl.selectedRow)).style.borderColor = 'white';
            }
            let newSelRow = Number(this.tag);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            pnl.selectedRow = newSelRow;
            if (newSelRow < datan) {
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                document.getElementById("pnlGraphIteminPanel" + String(newSelRow)).style.borderColor = '#666666';
            }
        }
        function selItemBorder(newSelRow) {
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            if (pnl.selectedRow != -1) {
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                document.getElementById("pnlGraphIteminPanel" + String(pnl.selectedRow)).style.borderColor = 'white';
            }
            if ((newSelRow < datan) && (newSelRow != -1)) {
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                pnl.selectedRow = newRow;
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                document.getElementById("pnlGraphIteminPanel" + String(newSelRow)).style.borderColor = '#666666';
            }
        }
        graphCulculateRmaxRmin();
    }
    /**グラフモードの選択データの最大値・最小値を求める */
    function graphCulculateRmaxRmin() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let selGraph = attrData.nowGraph();
        if (selGraph.Data.length == 0) {
            return;
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        for (let j = 0; j < attrData.LayerData[Layernum].atrObject.ObjectNum; j++) {
            let s = 0;
            for (let i = 0; i < selGraph.Data.length; i++) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let str = attrData.Get_Data_Value(Layernum, selGraph.Data[i].DataNumber, j, "");
                if (str != "") {
                    s += Number(str);
                }
            }
            if (j == 0) {
                selGraph.En_Obi.RMAX = s;
                selGraph.En_Obi.RMIN = s;
            }
            else {
                selGraph.En_Obi.RMAX = Math.max(selGraph.En_Obi.RMAX, s);
                selGraph.En_Obi.RMIN = Math.min(selGraph.En_Obi.RMIN, s);
            }
        }
        let Max = selGraph.En_Obi.RMAX;
        let min = selGraph.En_Obi.RMIN;
        let retV = Generic.WIC(10, Max, min);
        let zn = [];
        // @ts-expect-error TS(2339): Property 'min' does not exist on type '{}'.
        for (let k = retV.min; k <= retV.max; k += retV.step) {
            if ((selGraph.En_Obi.RMIN < k) && (k < selGraph.En_Obi.RMAX)) {
                zn.push(k);
            }
        }
        let DVN = zn.length;
        let h1, h2, h3;
        switch (DVN) {
            case 1:
                h1 = 1;
                h2 = -1;
                h3 = -1;
                break;
            case 2:
                h1 = 1;
                h2 = 0;
                h3 = -1;
                break;
            case 3:
                h1 = 2;
                h2 = 1;
                h3 = 0;
                break;
            case 4:
                h1 = 3;
                h2 = 1;
                h3 = 0;
                break;
            case 5:
                h1 = 4;
                h2 = 2;
                h3 = 0;
                break;
            case 6:
                h1 = 5;
                h2 = 2;
                h3 = 0;
                break;
            default:
                h1 = DVN - 1;
                // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                h2 = parseInt(DVN / 2) - 1;
                h3 = 0;
                break;
        }
        selGraph.En_Obi.Value1 = zn[h1];
        if (h2 == -1) {
            selGraph.En_Obi.Value2 = 0;
        }
        else {
            selGraph.En_Obi.Value2 = zn[h2];
        }
        if (h3 == -1) {
            selGraph.En_Obi.Value3 = 0;
        }
        else {
            selGraph.En_Obi.Value3 = zn[h3];
        }
        if (selGraph.En_Obi.MaxValueMode == enmMarkMaxValueType.SelectedDataMax) {
            selGraph.En_Obi.MaxValue = selGraph.En_Obi.RMAX;
        }
        if (selGraph.Oresen_Bou.YmaxMinMode == enmBarLineMaxMinMode.Auto) {
            let YMax;
            let Ymin;
            for (let i = 0; i < selGraph.Data.length; i++) {
                let dn = selGraph.Data[i].DataNumber;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let lad = attrData.LayerData[Layernum].atrData.Data[dn];
                if (i == 0) {
                    YMax = lad.Statistics.Max;
                    Ymin = lad.Statistics.Min;
                }
                else {
                    YMax = Math.max(YMax, lad.Statistics.Max);
                    Ymin = Math.min(Ymin, lad.Statistics.Min);
                }
            }
            if (selGraph.GraphMode == enmGraphMode.BarGraph) {
                if (Ymin > 0) {
                    Ymin = 0;
                }
            }
            let retV = Generic.WIC(5, YMax, Ymin);
            // @ts-expect-error TS(2339): Property 'max' does not exist on type '{}'.
            selGraph.Oresen_Bou.YMax = retV.max;
            // @ts-expect-error TS(2339): Property 'min' does not exist on type '{}'.
            selGraph.Oresen_Bou.Ymin = retV.min;
            // @ts-expect-error TS(2339): Property 'step' does not exist on type '{}'.
            selGraph.Oresen_Bou.Ystep = retV.step;
        }
    }
    //●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
    /**ラベル表示モードの設定画面の要素設定 */
    function setSettingLabelModeWindow() {
        labelDatasetSelectSet();
        labelDatasetDataItem();
    }
    function labelDatasetSelectSet() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let lbl = attrData.layerLabel();
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let lblDataSetList = attrData.getLabelTitle(attrData.TotalData.LV1.SelectedLayer);
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        document.getElementById("labelDataSetList").addSelectList(lblDataSetList, lbl.SelectedIndex, true, false);
    }
    function labelDatasetDataItem() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let selLabel = attrData.nowLabel();
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        document.getElementById("labelDatasetTitle").value = selLabel.title;
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        document.getElementById("chkLblObjectName").checked = selLabel.ObjectName_Print_Flag;
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        document.getElementById("chkLblObjectNameReturn").checked = selLabel.ObjectName_Turn_Flag;
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        document.getElementById("txtLabelSizeChange").setNumberValue(selLabel.Width);
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        document.getElementById("chkLblDataName_Print_Flag").checked = selLabel.DataName_Print_Flag;
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        document.getElementById("chkLblDataValue_Unit_Flag").checked = selLabel.DataValue_Unit_Flag;
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        document.getElementById("chkLblDataValue_TurnFlag").checked = selLabel.DataValue_TurnFlag;
        let adList = [];
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        for (let i = 0; i < selLabel.DataItem.length; i++) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            adList.push({ value: selLabel.DataItem[i], text: attrData.Get_DataTitle(Layernum, selLabel.DataItem[i], true) });
        }
        lstLabelDataItem.removeAll();
        lstLabelDataItem.addList(adList, 0);
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.Draw_Sample_LineBox(document.getElementById("labelFrame"), selLabel.BorderLine);
        Generic.setTileDiv(document.getElementById("labelObjectNameColor"), selLabel.BorderObjectTile);
        Generic.setTileDiv(document.getElementById("labelDataColor"), selLabel.BorderDataTile);
    }
    //●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
    /**連続表示モードの設定画面の要素設定 */
    function setSettingSeriesModeWindow() {
        seriesDatasetSelectSet();
        seriesDatasetDataItem();
    }
    function seriesDatasetSelectSet() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let series = attrData.TotalData.TotalMode.Series;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let seriesDataSetList = attrData.getSeriesDataSetName();
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        document.getElementById("seriesDataSetList").addSelectList(seriesDataSetList, series.SelectedIndex, true, false);
    }
    /**連続表示モードのデータセットの内容を表示 */
    function seriesDatasetDataItem() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let series = attrData.TotalData.TotalMode.Series;
        let seriesSelD = series.DataSet[series.SelectedIndex];
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        document.getElementById("seriesDatasetTitle").value = seriesSelD.title;
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        document.getElementById("gbSeriesItemData").setVisibility(seriesSelD.DataItem.length > 0);
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.SeriesMode_to_ListViewData(seriesListView, seriesSelD.DataItem);
        // @ts-expect-error TS(2304): Cannot find name 'Check_Print_err'.
        Check_Print_err();
    }
    /**連続表示モードのリストビュー左端の順番を再設定*/
    function resetSeriesListOrderNumber() {
        let n = seriesListView.getRowNumber();
        for (let i = 0; i < n; i++) {
            seriesListView.setValue(0, i, (i + 1).toString());
        }
    }
    //●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
    /**重ね合わせ表示モードの設定画面の要素設定*/
    function setSettingOverlayModeWindow() {
        overlayDatasetSelectSet();
        overlayDatasetDataItem();
    }
    /**重ね合わせ表示モードのデータセットセレクトボックス*/
    function overlayDatasetSelectSet() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let over = attrData.TotalData.TotalMode.OverLay;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let overlayDataSetList = attrData.getOverlayTitle();
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        document.getElementById("overlayDataSetList").addSelectList(overlayDataSetList, over.SelectedIndex, true, false);
    }
    /**重ね合わせ表示モードのデータセットの内容を表示 */
    function overlayDatasetDataItem() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let over = attrData.TotalData.TotalMode.OverLay;
        let overSelD = over.DataSet[over.SelectedIndex];
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        document.getElementById("overlayAlwaysOver").checked = (over.Always_Overlay_Index == over.SelectedIndex);
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        document.getElementById("overlayDatasetTitle").value = overSelD.title;
        let overData = [4];
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        document.getElementById("gbOverlayItemData").setVisibility(overSelD.DataItem.length > 0);
        overlayListView.clear();
        for (let i = 0; i < overSelD.DataItem.length; i++) {
            let di = overSelD.DataItem[i];
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            overData[0] = attrData.LayerData[di.Layer].Name;
            switch (di.Print_Mode_Layer) {
                case enmLayerMode_Number.SoloMode: {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    overData[1] = attrData.Get_DataTitle(di.Layer, di.DataNumber, false);
                    // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
                    overData[2] = Generic.getSolomodeStrings(di.Mode);
                    break;
                }
                case enmLayerMode_Number.GraphMode: {
                    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'number'.
                    overData[1] = "グラフ表示";
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let T = attrData.LayerData[di.Layer].LayerModeViewSettings.GraphMode.DataSet[di.DataNumber].title;
                    if (T == "") {
                        T = "データセット" + String(di.DataNumber + 1);
                    }
                    overData[2] = T;
                    break;
                }
                case enmLayerMode_Number.LabelMode: {
                    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'number'.
                    overData[1] = "ラベル表示";
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let T = attrData.LayerData[di.Layer].LayerModeViewSettings.LabelMode.DataSet[di.DataNumber].title;
                    if (T == "") {
                        T = "データセット" + String(di.DataNumber + 1);
                    }
                    overData[2] = T;
                    break;
                }
                case enmLayerMode_Number.TripMode:
                    break;
            }
            // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'number'.
            overData[3] = (di.Legend_Print_Flag == true) ? "表示" : "非表示";
            overlayListView.insertRow(1, overData);
        }
        overlayDatasetDataItemEach();
        // @ts-expect-error TS(2304): Cannot find name 'Check_Print_err'.
        Check_Print_err();
    }
    /**重ね合わせモードのデータセットの個別アイテムの情報をgbOverlayItemData内に表示 */
    function overlayDatasetDataItemEach() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let over = attrData.TotalData.TotalMode.OverLay;
        let overSelD = over.DataSet[over.SelectedIndex];
        let n = overlayListView.selectedRow;
        if (n != -1) {
            let d = overSelD.DataItem[n];
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("overlayItemDataLegendPrint").checked = d.Legend_Print_Flag;
        }
    }
    //●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
    /**単独表示モードの設定画面の要素設定*/
    function setSettingSoloModeWindow() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let data = attrData.LayerData[Layernum].atrData.Data[DataNum];
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let md = attrData.getSoloMode(Layernum, DataNum);
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let layShape = attrData.LayerData[Layernum].Shape;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if (attrData.Check_Enable_SoloMode(enmSoloMode_Number.ClassPaintMode, Layernum, DataNum) == true) {
            //●●●●●●●●●●●●●●●●ペイントモード
            switch (layShape) {
                case enmShape.PointShape:
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let md = attrData.LayerData[Layernum].LayerModeViewSettings.PointLineShape;
                    let ele = document.getElementById("picPointMarkSize");
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.Draw_Sample_Mark_Box(ele, md.PointMark);
                    break;
                case enmShape.LineShape:
                    // @ts-expect-error TS(2531): Object is possibly 'null'.
                    document.getElementById("cboPaintLineSize").value = attrData.LayerData[Layernum].LayerModeViewSettings.PointLineShape.LineWidth;
                    break;
                case enmShape.PolygonShape:
                    break;
            }
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("cboDivisionMethod").value = data.SoloModeViewSettings.Div_Method;
            //面以外は面積分位数を選べない
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("cboDivisionMethod").setAstarisk(enmDivisionMethod.AreaQuantile, (layShape != enmShape.PolygonShape));
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("cboDivisionCount").value = data.SoloModeViewSettings.Div_Num;
            Generic.checkRadioByValue("PaintColorSettingMode", data.SoloModeViewSettings.ClassPaintMD.Color_Mode);
            let div_num = data.SoloModeViewSettings.Div_Num;
            let pnlClassDiv = document.getElementById("pnlClassDiv");
            let ph = picClassBoxHeight;
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            pnlClassDiv.style.height = (ph * div_num + 2).px();
            //不足するpicClassBoxを追加
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            for (let i = pnlClassDiv.inPic; i < div_num; i++) {
                let cbox = Generic.createNewCanvas(pnlClassDiv, "picClassBox" + i, "", 0, i * picClassBoxHeight, picClassBoxWidth, picClassBoxHeight, undefined, "border:solid 1px");
                // @ts-expect-error TS(2339): Property 'tag' does not exist on type 'HTMLCanvasE... Remove this comment to see the full error message
                cbox.tag = i;
                cbox.onclick = function (e) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    switch (attrData.nowData().ModeData) {
                        case enmSoloMode_Number.ClassPaintMode: {
                            if (cbox.style.cursor == 'crosshair') {
                                clsColorPicker(e, colorChange);
                            }
                            break;
                        }
                        case enmSoloMode_Number.ClassMarkMode: {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            let md = attrData.nowDataSolo().Class_Div[e.target.tag].ClassMark;
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            clsMarkSet(e, mkChange, md, attrData);
                            function mkChange(newMark) {
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                attrData.nowDataSolo().Class_Div[e.target.tag].ClassMark = newMark.Clone();
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                attrData.Draw_Sample_Mark_Box(e.target, newMark);
                            }
                            break;
                        }
                        case enmSoloMode_Number.ClassODMode: {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            let md = attrData.nowDataSolo().Class_Div[e.target.tag].ODLinePat;
                            clsLinePatternSet(e, md, lineChange);
                            function lineChange(newPat) {
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                attrData.nowDataSolo().Class_Div[e.target.tag].ODLinePat = newPat.Clone();
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                attrData.Draw_Sample_LineBox(e.target, newPat);
                            }
                            break;
                        }
                    }
                };
                // @ts-expect-error TS(2554): Expected 8 arguments, but got 9.
                Generic.createNewSpan(pnlClassDiv, "()", "freqBox" + i, "", picClassBoxWidth + 2 + txtClassValueWidth + 10, i * picClassBoxHeight, freqWidth - 10, "", "");
            }
            //不足するtxtClassValueを追加
            let txtNum = div_num;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if (attrData.Get_DataType(Layernum, DataNum) != enmAttDataType.Category) {
                txtNum--;
            }
            // @ts-expect-error TS(2339): Property 'px' does not exist on type '23'.
            const txtStyle = "border:solid 1px;height:" + picClassBoxHeight.px();
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            for (let i = pnlClassDiv.inTxt; i < txtNum; i++) {
                let txele = Generic.createNewNumberInput(pnlClassDiv, 0, "txtClassValue" + i, picClassBoxWidth + 2, i * picClassBoxHeight, txtClassValueWidth, txeleOnChange, txtStyle);
                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                txele.ondragstart = function (e) { event.dataTransfer.setData('abc', event.target.tag); };
                txele.ondrop = function (e) {
                    //カテゴリーデータの場合、他のカテゴリーをドロップ
                    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                    let oele = document.getElementById("txtClassValue" + String(event.dataTransfer.getData('abc')));
                    // @ts-expect-error TS(2531): Object is possibly 'null'.
                    let dragN = oele.tag;
                    // @ts-expect-error TS(2531): Object is possibly 'null'.
                    let dropN = e.target.tag;
                    if (dropN == dragN) {
                        return;
                    }
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let Layernum = attrData.TotalData.LV1.SelectedLayer;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let ldd = attrData.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings;
                    let ddata = ldd.Class_Div[dragN].Clone();
                    if (dragN < dropN) {
                        for (let i = dragN; i < dropN; i++) {
                            ldd.Class_Div[i] = ldd.Class_Div[i + 1];
                        }
                    }
                    else {
                        for (let i = dragN; i > dropN; i--) {
                            ldd.Class_Div[i] = ldd.Class_Div[i - 1];
                        }
                    }
                    ldd.Class_Div[dropN] = ddata;
                    SetPictureBox();
                    SetClassDivValueTextBox();
                    setFrequencyLabel();
                };
                txele.setAttribute("ondragover", "return false;");
                // @ts-expect-error TS(2339): Property 'tag' does not exist on type 'HTMLInputEl... Remove this comment to see the full error message
                txele.tag = i;
                function txeleOnChange(obj, v) {
                    //階級区分値を変更設定
                    let n = obj.tag;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let L = attrData.TotalData.LV1.SelectedLayer;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let D = attrData.LayerData[L].atrData.SelectedIndex;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let ld = attrData.LayerData[L];
                    let ldd = ld.atrData.Data[D].SoloModeViewSettings;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    if (attrData.Get_DataType(L, D) != enmAttDataType.Category) {
                        ldd.Class_Div[n].Value = v;
                    }
                    else {
                        let oldTx = ldd.Class_Div[n].Value;
                        let newTx = v.trim();
                        if ((newTx == "") && (ldd.MissingF == true)) {
                            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                            Generic.alert(undefined, "欠損値設定があるので空白にはできません。");
                            //e.target.value = oldTx;
                            obj.value = oldTx;
                            return;
                        }
                        for (let i = 0; i < ldd.Div_Num; i++) {
                            if ((ldd.Class_Div[i].Value == newTx) && (i != n)) {
                                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                                Generic.alert(undefined, newTx + "は既に存在しているので設定できません。");
                                obj.value = oldTx;
                                return;
                            }
                        }
                        //カテゴリーの元を新名称に書き換える
                        for (let i = 0; i < ld.atrObject.ObjectNum; i++) {
                            if (ld.atrData.Data[D].Value[i] == oldTx) {
                                ld.atrData.Data[D].Value[i] = newTx;
                            }
                        }
                        ldd.Class_Div[n].Value = newTx;
                    }
                    setFrequencyLabel();
                }
            }
            //余ったpicClassBoxとtxtClassValueを削除
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            for (let i = div_num; i < pnlClassDiv.inPic; i++) {
                let cbox = document.getElementById("picClassBox" + i);
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                cbox.parentNode.removeChild(cbox);
                let fbox = document.getElementById("freqBox" + i);
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                fbox.parentNode.removeChild(fbox);
            }
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            for (let i = txtNum; i < pnlClassDiv.inTxt; i++) {
                let txele = document.getElementById("txtClassValue" + i);
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                txele.parentNode.removeChild(txele);
            }
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            pnlClassDiv.inPic = div_num;
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            pnlClassDiv.inTxt = txtNum;
            SetPictureBox();
            SetPicClassBoxCursol();
            SetClassDivValueTextBox();
            setFrequencyLabel();
            /**ペイントモードのクリックして色変更*/
            function colorChange(e) {
                let n = parseInt(e.target.tag);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let Layernum = attrData.TotalData.LV1.SelectedLayer;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let data = attrData.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings;
                let DivNum = data.Div_Num;
                let col = Generic.RGBAfromElement(e.target);
                data.Class_Div[n].PaintColor = col;
                switch (data.ClassPaintMD.Color_Mode) {
                    case enmPaintColorSettingModeInfo.twoColor:
                        SelectedCategoryIndex = -1;
                        if (n == 0) {
                            data.ClassPaintMD.color1 = col;
                        }
                        else {
                            data.ClassPaintMD.color2 = col;
                        }
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        attrData.Twocolort(Layernum, DataNum);
                        break;
                    case enmPaintColorSettingModeInfo.threeeColor:
                        SelectedCategoryIndex = -1;
                        switch (n) {
                            case 0:
                                data.ClassPaintMD.color1 = col;
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                attrData.Twocolort(Layernum, DataNum);
                                break;
                            case DivNum - 1:
                                data.ClassPaintMD.color2 = col;
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                attrData.Twocolort(Layernum, DataNum);
                                break;
                            default:
                                data.ClassPaintMD.color3 = col;
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                attrData.Threecolor(Layernum, DataNum, n);
                                break;
                        }
                        break;
                    case enmPaintColorSettingModeInfo.multiColor:
                        switch (n) {
                            case 0:
                                data.ClassPaintMD.color1 = col;
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                attrData.Twocolort(Layernum, DataNum);
                                SelectedCategoryIndex = -1;
                                break;
                            case DivNum - 1:
                                data.ClassPaintMD.color2 = col;
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                attrData.Twocolort(Layernum, DataNum);
                                SelectedCategoryIndex = -1;
                                break;
                            default: //中間
                                if (SelectedCategoryIndex == -1) {
                                    SelectedCategoryIndex = n;
                                    data.ClassPaintMD.color3 = col;
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    attrData.Threecolor(Layernum, DataNum, n);
                                }
                                else {
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    attrData.FourColor(Layernum, DataNum, n, SelectedCategoryIndex, col);
                                    SelectedCategoryIndex = n;
                                    data.ClassPaintMD.color3 = col;
                                }
                                break;
                        }
                        break;
                    case enmPaintColorSettingModeInfo.SoloColor:
                        SelectedCategoryIndex = -1;
                        switch (n) {
                            case 0:
                                data.ClassPaintMD.color1 = col;
                                break;
                            case DivNum - 1:
                                data.ClassPaintMD.color2 = col;
                                break;
                        }
                        break;
                }
                SetPictureBox();
            }
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if (attrData.Check_Enable_SoloMode(enmSoloMode_Number.ClassODMode, Layernum, DataNum) == true) {
            //●●●●●●●●●●●●●●●●線モード
            SetODModeOriginObject();
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if (attrData.Check_Enable_SoloMode(enmSoloMode_Number.ContourMode, Layernum, DataNum) == true) {
            //●●●●●●●●●●●●●●●●等値線モード
            const datam = data.SoloModeViewSettings.ContourMD;
            Generic.checkRadioByValue("contourInterval_Mode", datam.Interval_Mode);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("contourDraw_in_Polygon_F").checked = datam.Draw_in_Polygon_F;
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("contourSpline_flag").checked = datam.Spline_flag;
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("contourDetailed").setSelectValue(datam.Detailed);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("gbContourLineLpat").setVisibility(datam.Interval_Mode == enmContourIntervalMode.ClassPaint);
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.Draw_Sample_LineBox(document.getElementById("contourLinePat"), datam.Regular.Line_Pat);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("gbRegularInterval").setVisibility(datam.Interval_Mode == enmContourIntervalMode.RegularInterval);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("contourRegulerMinValue").setNumberValue(datam.Regular.bottom);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("contourRegulerMaxValue").setNumberValue(datam.Regular.top);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("contourRegulerInterval").setNumberValue(datam.Regular.Interval);
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.Draw_Sample_LineBox(document.getElementById("contourRegulerLinePat"), datam.Regular.Line_Pat);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("contourRegulerSPMinValue").setNumberValue(datam.Regular.SP_Bottom);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("contourRegulerSPMaxValue").setNumberValue(datam.Regular.SP_Top);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("contourRegulerSPInterval").setNumberValue(datam.Regular.SP_interval);
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.Draw_Sample_LineBox(document.getElementById("contourRegulerSPLinePat"), datam.Regular.SP_Line_Pat);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("contourRegulerExCheck").checked = datam.Regular.EX_Value_Flag;
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("contourRegulerExValue").setNumberValue(datam.Regular.EX_Value);
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.Draw_Sample_LineBox(document.getElementById("contourRegulerExLine"), datam.Regular.EX_Line_Pat);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("gbSeparateSettings").setVisibility(datam.Interval_Mode == enmContourIntervalMode.SeparateSettings);
            lstcontourSeparateValue.removeAll();
            if (datam.IrregularNum > 0) {
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                document.getElementById("gbContourSepaData").setVisibility(true);
                let conValList = [];
                for (let i = 0; i < datam.IrregularNum; i++) {
                    conValList.push({ value: datam.Irregular[i].Value, text: datam.Irregular[i].Value });
                }
                lstcontourSeparateValue.addList(conValList, 0);
                setContourSepaDataValue();
            }
            else {
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                document.getElementById("gbContourSepaData").setVisibility(false);
            }
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if (attrData.Check_Enable_SoloMode(enmSoloMode_Number.MarkSizeMode, Layernum, DataNum) == true) {
            //●●●●●●●●●●●●●●●●記号の大きさモード
            const datam = data.SoloModeViewSettings.MarkSizeMD;
            if (layShape == enmShape.LineShape) {
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                document.getElementById("gbMark").style.display = 'none';
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                document.getElementById("gbMarkLine").style.display = 'inline';
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                document.getElementById("cboMarkLineSize").value = datam.LineShape.LineWidth;
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                document.getElementById("markLineColor").style.backgroundColor = datam.LineShape.Color.toRGBA();
            }
            else {
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                document.getElementById("gbMark").setVisibility(true);
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                document.getElementById("gbMarkLine").style.display = 'none';
                let picMark = document.getElementById("picMarkSize");
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Draw_Sample_Mark_Box(picMark, datam.Mark);
            }
            for (let i = 0; i < 5; i++) {
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                document.getElementById("txtMarkSizeValue" + String(i + 1)).setNumberValue(datam.Value[i]);
            }
            Generic.checkRadioByValue("markSizeMaxValueSetting", datam.MaxValueMode);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("markSizeUserMaxValue").setNumberValue(datam.MaxValue);
            const markSizeView = document.getElementById("markSizeView");
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if (attrData.Get_DataMin(Layernum, DataNum) < 0) {
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                document.getElementById("gbMarkSizeMinusValueCase").setVisibility(true);
                const mkc = data.SoloModeViewSettings.MarkCommon;
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                document.getElementById("gbMarkSizeMinusValueCase_txtMarkSizePlusValue").value = mkc.LegendPlusWord;
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                document.getElementById("gbMarkSizeMinusValueCase_txtMarkSizeMinusValue").value = mkc.LegendMinusWord;
                Generic.setTileDiv(document.getElementById("gbMarkSizeMinusValueCase_minusColorBox"), mkc.MinusTile);
            }
            else {
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                document.getElementById("gbMarkSizeMinusValueCase").setVisibility(false);
            }
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if (attrData.Check_Enable_SoloMode(enmSoloMode_Number.MarkBlockMode, Layernum, DataNum) == true) {
            //●●●●●●●●●●●●●●●●記号の数モード
            const datam = data.SoloModeViewSettings.MarkBlockMD;
            let picMark = document.getElementById("picMarkBlockSize");
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.Draw_Sample_Mark_Box(picMark, datam.Mark);
            Generic.checkRadioByValue("blockArrange", datam.ArrangeB);
            Generic.enableRadioByValue("blockArrange", enmMarkBlockArrange.Random, (layShape == enmShape.PolygonShape));
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("markBlockValue").setNumberValue(datam.Value);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("markBlockWord").value = datam.LegendBlockModeWord;
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("markBlockHasu").checked = datam.HasuVisible;
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("markBlockOverlap").setSelectValue(datam.Overlap);
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if (attrData.Get_DataMin(Layernum, DataNum) < 0) {
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                document.getElementById("gbMarBlockMinusValueCase").setVisibility(true);
                const mkc = data.SoloModeViewSettings.MarkCommon;
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                document.getElementById("gbMarBlockMinusValueCase_txtMarkSizePlusValue").value = mkc.LegendPlusWord;
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                document.getElementById("gbMarBlockMinusValueCase_txtMarkSizeMinusValue").value = mkc.LegendMinusWord;
                Generic.setTileDiv(document.getElementById("gbMarBlockMinusValueCase_minusColorBox"), mkc.MinusTile);
            }
            else {
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                document.getElementById("gbMarBlockMinusValueCase").setVisibility(false);
            }
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if (attrData.Check_Enable_SoloMode(enmSoloMode_Number.MarkBarMode, Layernum, DataNum) == true) {
            //●●●●●●●●●●●●●●●●棒の高さモード
            const datam = data.SoloModeViewSettings.MarkBarMD;
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("cboMarkBarHeightSize").setNumberValue(datam.MaxHeight);
            Generic.checkRadioByValue("markBarmaxValueSetting", datam.MaxValueMode);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("markBarUserMaxValue").setNumberValue(datam.MaxValue);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("cboMarkBarWidth").setNumberValue(datam.Width);
            Generic.setTileDiv(document.getElementById("markBarInnerColor"), datam.InnerTile);
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.Draw_Sample_LineBox(document.getElementById("markBarFrame"), datam.FrameLinePat);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("markBarView").checked = datam.ThreeD;
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("markBarScaleCheck").checked = datam.ThreeD;
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("markBarScaleInterval").setNumberValue(datam.ScaleLineInterval);
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.Draw_Sample_LineBox(document.getElementById("markBarScaleLine"), datam.scaleLinePat);
            Generic.checkRadioByValue("markBarShape", datam.BarShape);
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if (attrData.Check_Enable_SoloMode(enmSoloMode_Number.StringMode, Layernum, DataNum) == true) {
            //●●●●●●●●●●●●●●●●文字モード
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("txtStringSizeChange").setNumberValue(data.SoloModeViewSettings.StringMD.maxWidth);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("chkStringReturn").checked = data.SoloModeViewSettings.StringMD.WordTurnF;
        }
    }
    //階級区分の区分ボックスを設定
    function SetPictureBox() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let ldd = attrData.nowDataSolo();
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let md = attrData.nowData().ModeData;
        for (let i = 0; i < ldd.Div_Num; i++) {
            let p = document.getElementById("picClassBox" + i);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            let ctx = p.getContext("2d");
            switch (md) {
                case enmSoloMode_Number.ClassPaintMode: {
                    ctx.fillStyle = ldd.Class_Div[i].PaintColor.toRGBA();
                    // @ts-expect-error TS(2531): Object is possibly 'null'.
                    ctx.fillRect(0, 0, p.offsetWidth, p.offsetHeight);
                    break;
                }
                case enmSoloMode_Number.ClassMarkMode: {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.Draw_Sample_Mark_Box(p, ldd.Class_Div[i].ClassMark);
                    break;
                }
                case enmSoloMode_Number.ClassODMode: {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.Draw_Sample_LineBox(p, ldd.Class_Div[i].ODLinePat);
                    break;
                }
            }
        }
    }
    //階級区分の区分テキストボックスを設定
    function SetClassDivValueTextBox() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let DDType = attrData.nowData().DataType;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let ldd = attrData.nowDataSolo();
        for (let i = 0; i < ldd.Div_Num; i++) {
            if ((i != ldd.Div_Num - 1) || (DDType == enmAttDataType.Category)) {
                let t = document.getElementById("txtClassValue" + i);
                let df = false;
                let ttop = picClassBoxHeight * i;
                if (DDType == enmAttDataType.Category) {
                    // @ts-expect-error TS(2531): Object is possibly 'null'.
                    t.value = ldd.Class_Div[i].Value;
                    // @ts-expect-error TS(2531): Object is possibly 'null'.
                    t.numberCheck = false;
                    // @ts-expect-error TS(2531): Object is possibly 'null'.
                    t.style.textAlign = 'left';
                    // @ts-expect-error TS(2531): Object is possibly 'null'.
                    t.draggable = true;
                }
                else {
                    if (ldd.Div_Method != enmDivisionMethod.Free) {
                        df = true;
                    }
                    // @ts-expect-error TS(2531): Object is possibly 'null'.
                    t.setNumberValue(ldd.Class_Div[i].Value);
                    ttop += +picClassBoxHeight / 2;
                    // @ts-expect-error TS(2531): Object is possibly 'null'.
                    t.numberCheck = true;
                    // @ts-expect-error TS(2531): Object is possibly 'null'.
                    t.style.textAlign = 'right';
                    // @ts-expect-error TS(2531): Object is possibly 'null'.
                    t.draggable = false;
                }
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                t.disabled = df;
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                t.style.top = ttop.px();
            }
        }
    }
    /**等値線モードの個別設定の値セット */
    function setContourSepaDataValue() {
        let n = lstcontourSeparateValue.selectedIndex;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let d = attrData.nowDataSolo().ContourMD.Irregular[n];
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        document.getElementById("contourSepaValue").setNumberValue(d.Value);
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.Draw_Sample_LineBox(document.getElementById("contourSepaLine"), d.Line_Pat);
    }
    /**モードアイコンをすべて白にする */
    function clearModeIcon() {
        let modeDiv = document.getElementsByClassName("modeDivIcon");
        for (let i = 0; i < modeDiv.length; i++) {
            // @ts-expect-error TS(2339): Property 'selected' does not exist on type 'Elemen... Remove this comment to see the full error message
            modeDiv[i].selected = false;
            // @ts-expect-error TS(2339): Property 'disabled' does not exist on type 'Elemen... Remove this comment to see the full error message
            if (modeDiv[i].disabled == true) { //アイコンが利用可能かどうかはSetPicPnlDataEnabledで設定
                // @ts-expect-error TS(2339): Property 'style' does not exist on type 'Element'.
                modeDiv[i].style.backgroundColor = "#cccccc";
            }
            else {
                // @ts-expect-error TS(2339): Property 'style' does not exist on type 'Element'.
                modeDiv[i].style.backgroundColor = "#ffffff";
            }
        }
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        document.getElementById("btnSeriesSet").disabled = false;
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        document.getElementById("btnOverlaySet").disabled = false;
    }
    /**右側パネルの表示非表示の設定 */
    function rightSettingWindowControlVisibilitySet() {
        if (settingModeWindow.getVisibility() == false) {
            settingModeWindow.setVisibility(true);
        }
        let settingControl = document.getElementsByClassName("rightSettingWindowControlBase");
        for (let i = 0; i < settingControl.length; i++) {
            // @ts-expect-error TS(2339): Property 'setVisibility' does not exist on type 'E... Remove this comment to see the full error message
            settingControl[i].setVisibility(false);
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        switch (attrData.TotalData.LV1.Print_Mode_Total) {
            case enmTotalMode_Number.OverLayMode: {
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                document.getElementById("overlayView").setVisibility(true);
                break;
            }
            case enmTotalMode_Number.SeriesMode: {
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                document.getElementById("seriesView").setVisibility(true);
                break;
            }
            case enmTotalMode_Number.DataViewMode: {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let Layernum = attrData.TotalData.LV1.SelectedLayer;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                switch (attrData.LayerData[Layernum].Print_Mode_Layer) {
                    case enmLayerMode_Number.SoloMode: {
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        let md = attrData.getSoloMode(Layernum, DataNum);
                        let classViewF = false;
                        switch (md) {
                            case enmSoloMode_Number.ClassPaintMode:
                            case enmSoloMode_Number.ClassMarkMode:
                            case enmSoloMode_Number.ClassODMode:
                                classViewF = true;
                                break;
                        }
                        if (classViewF == true) {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            let shape = attrData.LayerData[Layernum].Shape;
                            // @ts-expect-error TS(2531): Object is possibly 'null'.
                            document.getElementById("classView").setVisibility(true);
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            if (attrData.Get_DataType(Layernum, DataNum) == enmAttDataType.Category) {
                                // @ts-expect-error TS(2531): Object is possibly 'null'.
                                document.getElementById("gbDivNum").setVisibility(false);
                            }
                            else {
                                // @ts-expect-error TS(2531): Object is possibly 'null'.
                                document.getElementById("gbDivNum").setVisibility(true);
                            }
                            // @ts-expect-error TS(2531): Object is possibly 'null'.
                            document.getElementById("gbClassPaint").setVisibility(md == enmSoloMode_Number.ClassPaintMode);
                            // @ts-expect-error TS(2531): Object is possibly 'null'.
                            document.getElementById("btnClassMarkSettings").setVisibility(md == enmSoloMode_Number.ClassMarkMode);
                            // @ts-expect-error TS(2531): Object is possibly 'null'.
                            document.getElementById("gbODPanel").setVisibility(md == enmSoloMode_Number.ClassODMode);
                            // @ts-expect-error TS(2531): Object is possibly 'null'.
                            document.getElementById("gbPaintLine").setVisibility((md == enmSoloMode_Number.ClassPaintMode) && (shape == enmShape.LineShape));
                            // @ts-expect-error TS(2531): Object is possibly 'null'.
                            document.getElementById("gbPointMark").setVisibility((md == enmSoloMode_Number.ClassPaintMode) && (shape == enmShape.PointShape));
                            if (md == enmSoloMode_Number.ClassODMode) {
                                switch (shape) {
                                    case enmShape.PointShape:
                                    case enmShape.PolygonShape: {
                                        // @ts-expect-error TS(2531): Object is possibly 'null'.
                                        document.getElementById("gbODOriginObject").setVisibility(true);
                                        break;
                                    }
                                    case enmShape.LineShape: {
                                        // @ts-expect-error TS(2531): Object is possibly 'null'.
                                        document.getElementById("gbODOriginObject").setVisibility(false);
                                        break;
                                    }
                                }
                            }
                        }
                        else {
                            // @ts-expect-error TS(2531): Object is possibly 'null'.
                            document.getElementById("classView").setVisibility(false);
                        }
                        // @ts-expect-error TS(2531): Object is possibly 'null'.
                        document.getElementById("markSizeView").setVisibility(md == enmSoloMode_Number.MarkSizeMode);
                        // @ts-expect-error TS(2531): Object is possibly 'null'.
                        document.getElementById("markBlockView").setVisibility(md == enmSoloMode_Number.MarkBlockMode);
                        // @ts-expect-error TS(2531): Object is possibly 'null'.
                        document.getElementById("markBarView").setVisibility(md == enmSoloMode_Number.MarkBarMode);
                        // @ts-expect-error TS(2531): Object is possibly 'null'.
                        document.getElementById("stringView").setVisibility(md == enmSoloMode_Number.StringMode);
                        // @ts-expect-error TS(2531): Object is possibly 'null'.
                        document.getElementById("contourView").setVisibility(md == enmSoloMode_Number.ContourMode);
                        break;
                    }
                    case enmLayerMode_Number.GraphMode: {
                        // @ts-expect-error TS(2531): Object is possibly 'null'.
                        document.getElementById("graphView").setVisibility(true);
                        break;
                    }
                    case enmLayerMode_Number.LabelMode: {
                        // @ts-expect-error TS(2531): Object is possibly 'null'.
                        document.getElementById("labelView").setVisibility(true);
                        break;
                    }
                }
                break;
            }
        }
    }
    /**
     *単独表示モードの指定
     */
    function setDataMode() {
        clearModeIcon();
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.TotalData.LV1.Print_Mode_Total = enmTotalMode_Number.DataViewMode;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
        let selDiv;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let md = attrData.getSoloMode(Layernum, DataNum);
        switch (md) {
            case enmSoloMode_Number.ClassPaintMode: {
                selDiv = divClassPaint;
                break;
            }
            case enmSoloMode_Number.ClassMarkMode: {
                selDiv = divClassMark;
                break;
            }
            case enmSoloMode_Number.ClassODMode: {
                selDiv = divClassOD;
                break;
            }
            case enmSoloMode_Number.MarkSizeMode: {
                selDiv = divMarkSize;
                break;
            }
            case enmSoloMode_Number.MarkBlockMode: {
                selDiv = divMarkBlock;
                break;
            }
            case enmSoloMode_Number.MarkBarMode: {
                selDiv = divMarkBar;
                break;
            }
            case enmSoloMode_Number.MarkTurnMode: {
                break;
            }
            case enmSoloMode_Number.ContourMode: {
                selDiv = divContour;
                break;
            }
            case enmSoloMode_Number.StringMode: {
                selDiv = divString;
                break;
            }
        }
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        selDiv.selected = true;
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        selDiv.style.backgroundColor = '#ff6464';
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        settingModeWindow.setTitle(attrData.getSolomodeWord(md));
        rightSettingWindowControlVisibilitySet();
        // @ts-expect-error TS(2304): Cannot find name 'Check_Print_err'.
        Check_Print_err();
    }
    /**データ取得後の共通処理 */
    function initAfterGetData(non_clearf) {
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        Frm_Print.setVisibility(false);
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        propertyWindow.nextVisible = true;
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        propertyWindow.setVisibility(false);
        Init_Screen_Set(non_clearf);
        initFirtScreen();
        // @ts-expect-error TS(2304): Cannot find name 'divmain'.
        divmain.setTitle(attrData.TotalData.LV1.FileName);
    }
    /**
    * 画面の初期設定 出力画面の位置サイズを新しく設定する場合はfalse
    */
    function Init_Screen_Set(Non_Clear_Flag) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let sc = attrData.TotalData.ViewStyle.ScrData;
        if (Non_Clear_Flag == false) {
            frmPrint.Init_FrmPrint();
            frmPrint.set_frmPrint_Window_Size();
            let FpicRect = sc.frmPrint_FormSize;
            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
            let sz = new size(FpicRect.width(), FpicRect.height());
            sc.init(sz, sc.Screen_Margin, sc.MapRectangle, sc.Accessory_Base, true);
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.TempData.frmPrint_Temp.SymbolPointFirstMessage = true;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.TempData.frmPrint_Temp.LabelPointFirstMessage = true;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.Set_Acc_First_Position();
        }
        else {
            frmPrint.set_frmPrint_Window_Size();
            sc.init(sc.frmPrint_FormSize.size(), sc.Screen_Margin, sc.MapRectangle, sc.Accessory_Base, false);
        }
    }
    /**
    * 描画開始
    */
    function drawMap(e) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let retV = attrData.Get_PrintError();
        if (retV.Print_Enable == enmPrint_Enable.UnPrintable) {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            Generic.alert(new point(e.clientX, e.clientY), retV.message);
            return;
        }
        e.stopPropagation();
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        Frm_Print.setVisibility(true);
        // @ts-expect-error TS(2304): Cannot find name 'frmPrintFront'.
        frmPrintFront();
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        if (propertyWindow.nextVisible == true) {
            // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
            propertyWindow.setVisibility(true);
            // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
            propertyWindow.nextVisible = false;
        }
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        clsPrint.setData(Frm_Print.picMap, attrData);
    }
    //階級区分のピクチャボックス、テキストボックスの可否
    function SetPicClassBoxCursol() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let data = attrData.nowDataSolo();
        let DivNum = data.Div_Num;
        for (let i = 0; i < DivNum; i++) {
            let p = document.getElementById("picClassBox" + i);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            p.style.cursor = 'crosshair';
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if (attrData.nowData().ModeData == enmSoloMode_Number.ClassPaintMode) {
            switch (data.ClassPaintMD.Color_Mode) {
                case enmPaintColorSettingModeInfo.twoColor:
                    for (let i = 1; i < DivNum - 1; i++) {
                        let p = document.getElementById("picClassBox" + i);
                        // @ts-expect-error TS(2531): Object is possibly 'null'.
                        p.style.cursor = 'default';
                    }
                    break;
            }
        }
    }
    //各設定モードの画面作成
    function frmSettingMode() {
        const sw = 400;
        const sh = 450;
        // @ts-expect-error TS(2304): Cannot find name 'divmain'.
        let xpos = divmain.style.left.removePx() + divmain.style.width.removePx() + 10;
        // @ts-expect-error TS(2554): Expected 16 arguments, but got 15.
        settingModeWindow = Generic.createWindow("", "", "", xpos, 10, sw, sh, false, false, "", false, false, "", false, undefined);
        settingModeWindow.style.backgroundColor = "#f0f0f0";
        settingModeWindow.style.userSelect = 'none';
        // @ts-expect-error TS(2304): Cannot find name 'settingFront'.
        settingModeWindow.addEventListener('click', settingFront);
        //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■階級区分モード■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        // @ts-expect-error TS(2304): Cannot find name 'scrMargin'.
        let classView = Generic.createNewDiv(settingModeWindow, "", "classView", "rightSettingWindowControlBase", 10, scrMargin.top + 10, sw - 20, sh - 20, "", "");
        classView.style.backgroundColor = "#f0f0f0";
        //階級区分方法
        let gbDivNum = Generic.createNewFrame(classView, "gbDivNum", "", 0, 0, 140, 100, "階級区分方法");
        const cboDivisionMethodList = [{ value: enmDivisionMethod.Free, text: '自由設定' },
            { value: enmDivisionMethod.Quantile, text: '分位数' },
            { value: enmDivisionMethod.AreaQuantile, text: '面積分位数' },
            { value: enmDivisionMethod.StandardDeviation, text: '標準偏差' },
            { value: enmDivisionMethod.EqualInterval, text: '等間隔' }
        ];
        Generic.createNewWordSelect(gbDivNum, "区分方法", cboDivisionMethodList, 0, "cboDivisionMethod", 10, 10, 90, 100, 1, cboDivisionMethodChange, "", "", true);
        let cboDivisionCountMethodList = [];
        for (let i = 0; i < 19; i++) {
            cboDivisionCountMethodList.push({ value: i + 2, text: (i + 2).toString() });
        }
        Generic.createNewWordSelect(gbDivNum, "分割数", cboDivisionCountMethodList, 0, "cboDivisionCount", 10, 53, 90, 50, 1, cboDivisionCountChange, "", "", true);
        //階級区分
        let pnlClassDivBase = Generic.createNewDiv(classView, "", "pnlClassDivBase", "", 150, 20, allW + 20, 350, "background-color:#f0f0f0;overflow-y: scroll", "");
        let pnlClassDiv = Generic.createNewDiv(pnlClassDivBase, "", "pnlClassDiv", "", 0, 0, allW, 300, "overflow:hidden", "");
        // @ts-expect-error TS(2339): Property 'inPic' does not exist on type 'HTMLDivEl... Remove this comment to see the full error message
        pnlClassDiv.inPic = 0; //pnlClassDiv内部の色と息栖とボックスの数を記録
        // @ts-expect-error TS(2339): Property 'inTxt' does not exist on type 'HTMLDivEl... Remove this comment to see the full error message
        pnlClassDiv.inTxt = 0;
        //ペイントモード：色設定方法
        let gbClassPaint = Generic.createNewFrame(classView, "gbClassPaint", "", 0, 115, 140, 160, "色設定方法");
        const PaintColorSettingModeList = [{ value: enmPaintColorSettingModeInfo.twoColor, text: "2色グラデーション" },
            { value: enmPaintColorSettingModeInfo.threeeColor, text: "3色グラデーション" },
            { value: enmPaintColorSettingModeInfo.multiColor, text: "複数グラデーション" },
            { value: enmPaintColorSettingModeInfo.SoloColor, text: " 単独設定" }
        ];
        Generic.createNewRadioButtonList(gbClassPaint, "PaintColorSettingMode", PaintColorSettingModeList, 10, 10, 100, 25, undefined, PaintColorSettingModeChange, "");
        Generic.createNewButton(gbClassPaint, "カラーチャート", "btColorPattern", 20, 108, colorChart, "width:100px;padding-top:0;padding-bottom:0");
        Generic.createNewButton(gbClassPaint, "上下色反転", "btnReverseColor", 20, 133, reverseColor, "width:100px;padding-top:0;padding-bottom:0");
        //ペイントモード点オブジェクトの記号
        let gbPointMark = Generic.createNewFrame(classView, "gbPointMark", "", 0, 290, 140, 50, "表示記号設定");
        Generic.createNewCanvas(gbPointMark, "picPointMarkSize", "imgButton", 53, 10, 30, 30, picPointMark_Click, "");
        //ペイントモード線オブジェクト
        let gbPaintLine = Generic.createNewFrame(classView, "gbPaintLine", "", 0, 280, 140, 60, "線サイズ");
        Generic.createNewSizeSelect(gbPaintLine, 0, "cboPaintLineSize", "線幅", 15, 10, 40, 1, cboPaintLineSizeChange);
        // @ts-expect-error TS(2554): Expected 7 arguments, but got 6.
        Generic.createNewButton(gbPaintLine, "線端設定", "", 30, 35, btnPaintLineEdge);
        //■■■■■階級記号モードの記号設定ボタン■■■■■
        Generic.createNewButton(classView, "記号設定", "btnClassMarkSettings", 25, 140, classMarkButton, "width:100px");
        //■■■■■線モード■■■■■
        let gbODPanel = Generic.createNewDiv(classView, "", "gbODPanel", "", 0, 115, 140, 100, "", undefined);
        Generic.createNewButton(gbODPanel, "線設定", "btnClassODLineSettings", 20, 10, btnClassODSettings, "width:100px");
        let gbODOriginObject = Generic.createNewFrame(gbODPanel, "gbODOriginObject", "", 0, 40, 140, 110, "起点オブジェクト");
        Generic.createNewDiv(gbODOriginObject, "", "ODOriginObjectDiv", "grayFrame", 10, 10, 120, 50, ";background-color:white", undefined);
        Generic.createNewButton(gbODOriginObject, "起点オブジェクト設定", "btnClassODOriginSettings", 5, 80, btnClassODOriginSettings, "font-size:11px");
        function btnClassODSettings(e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let Layernum = attrData.TotalData.LV1.SelectedLayer;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let lshape = attrData.LayerData[Layernum].Shape;
            let popmenu = [{ caption: "全線種変更", event: LpatChange },
                { caption: "全色変更", event: LColorChange },
                { caption: "ペイントモードの色をコピー", event: copyPaintColor },
                { caption: "線幅自動設定", event: LWidthAuto }
            ];
            if (lshape != enmShape.LineShape) {
                popmenu.push({ caption: "矢印設定", event: LArrow });
            }
            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
            Generic.ceatePopupMenu(popmenu, new point(e.clientX, e.clientY));
            function LArrow(data, e) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let ldd = attrData.nowDataSolo().ClassODMD;
                clsArrow(e, ldd.Arrow, "起点方向", "終点方向", function (newArrow) { ldd.Arrow = newArrow; });
            }
            function LpatChange(data, e) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let ldd = attrData.nowDataSolo();
                clsLinePatternSet(e, ldd.Class_Div[0].ODLinePat, function (newLpat) {
                    for (let i = 0; i < ldd.Div_Num; i++) {
                        ldd.Class_Div[i].ODLinePat = newLpat.Clone();
                    }
                    SetPictureBox();
                });
            }
            function LColorChange(data, e) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let ldd = attrData.nowDataSolo();
                // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                clsColorPicker(new point(e.clientX, e.clientY), function (newColor) {
                    for (let i = 0; i < ldd.Div_Num; i++) {
                        ldd.Class_Div[i].ODLinePat.Color = newColor.Clone();
                    }
                    SetPictureBox();
                });
            }
            function copyPaintColor() {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let ldd = attrData.nowDataSolo();
                for (let i = 0; i < ldd.Div_Num; i++) {
                    ldd.Class_Div[i].ODLinePat.Color = ldd.Class_Div[i].PaintColor.Clone();
                }
                SetPictureBox();
            }
            function LWidthAuto() {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let ldd = attrData.nowDataSolo();
                let w1 = ldd.Class_Div[0].ODLinePat.Width;
                let n = ldd.Div_Num - 1;
                if (ldd.Class_Div[ldd.Div_Num - 1].ODLinePat.BlankF == true) {
                    n--;
                }
                let w2 = ldd.Class_Div[n].ODLinePat.Width;
                let stp = (w1 - w2) / n;
                for (let i = 0; i < n; i++) {
                    ldd.Class_Div[i].ODLinePat.Width = w1 - stp * i;
                }
                SetPictureBox();
            }
        }
        function btnClassODOriginSettings(e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let ldd = attrData.nowDataSolo().ClassODMD;
            frmMain_LayeObjectSelectOne(true, ldd.o_Layer, ldd.O_object, ldd.Dummy_ObjectFlag, function (lay, obnum, dumF) {
                ldd.Dummy_ObjectFlag = dumF;
                ldd.o_Layer = lay;
                ldd.O_object = obnum;
                SetODModeOriginObject();
            });
        }
        //階級記号モードの記号設定ボタン
        function classMarkButton(e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let sv = attrData.nowDataSolo();
            let popmenu = [
                { caption: "同一記号に設定", event: setSameMark },
                { caption: "ペイントモードの色を内部色に設定", event: setSamePaintColor },
                { caption: "内部データの設定", event: innerDataSet }
            ];
            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
            Generic.ceatePopupMenu(popmenu, new point(e.clientX, e.clientY));
            function setSameMark(data, e) {
                let md = sv.Class_Div[0].ClassMark;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                clsMarkSet(e, mkChange, md, attrData);
                function mkChange(newMark) {
                    for (let i = 0; i < sv.Div_Num; i++) {
                        sv.Class_Div[i].ClassMark = newMark.Clone();
                    }
                    SetPictureBox();
                }
            }
            function setSamePaintColor() {
                for (let i = 0; i < sv.Div_Num; i++) {
                    sv.Class_Div[i].ClassMark.Tile.Color = sv.Class_Div[i].PaintColor.Clone();
                    sv.Class_Div[i].ClassMark.WordFont.Color = sv.Class_Div[i].PaintColor.Clone();
                }
                SetPictureBox();
            }
            function innerDataSet(data, e) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                clsInnerDataSet(e, attrData);
            }
        }
        //ペイントモード点オブジェクトの記号選択クリック
        function picPointMark_Click(e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let Layernum = attrData.TotalData.LV1.SelectedLayer;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let md = attrData.LayerData[Layernum].LayerModeViewSettings.PointLineShape;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            clsMarkSet(e, picMarkChange, md.PointMark, attrData);
            function picMarkChange(newMark) {
                md.PointMark = newMark;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Draw_Sample_Mark_Box(e.target, newMark);
            }
        }
        //ペイントモード線オブジェクトのサイズ設定
        function cboPaintLineSizeChange(obj, v) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let Layernum = attrData.TotalData.LV1.SelectedLayer;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.LayerData[Layernum].LayerModeViewSettings.PointLineShape.LineWidth = v;
        }
        //ペイントモード線オブジェクトの線端設定
        function btnPaintLineEdge(e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let Layernum = attrData.TotalData.LV1.SelectedLayer;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let edge = attrData.LayerData[Layernum].LayerModeViewSettings.PointLineShape.LineEdge;
            clsLineEdgePattern(e, edge, okButton);
            function okButton(retEdge) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.LayerData[Layernum].LayerModeViewSettings.PointLineShape.LineEdge = retEdge;
            }
        }
        //ペイントモードカラーチャート
        function colorChart(e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let sv = attrData.nowDataSolo();
            let DivNum = sv.Div_Num;
            clsColorChart(e, DivNum, okButton);
            function okButton(col) {
                for (let i = 0; i < DivNum; i++) {
                    sv.Class_Div[i].PaintColor = col[i];
                }
                sv.color1 = col[0].Clone();
                sv.color2 = col[DivNum - 1].Clone();
                setSettingSoloModeWindow();
            }
        }
        //ペイントモード上下色反転ボタンクリック
        function reverseColor() {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let data = attrData.nowDataSolo();
            let DivNum = data.Div_Num;
            let scol = [];
            for (let i = 0; i < DivNum; i++) {
                scol.push(data.Class_Div[i].PaintColor.Clone());
            }
            for (let i = 0; i < DivNum; i++) {
                data.Class_Div[i].PaintColor = scol[DivNum - i - 1];
            }
            setSettingSoloModeWindow();
        }
        //色設定方法ボタンクリック
        function PaintColorSettingModeChange(v) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let Layernum = attrData.TotalData.LV1.SelectedLayer;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings.ClassPaintMD.Color_Mode = v;
            switch (v) {
                case enmPaintColorSettingModeInfo.twoColor:
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.Twocolort(Layernum, DataNum);
                    break;
                case enmPaintColorSettingModeInfo.threeeColor:
                    break;
                case enmPaintColorSettingModeInfo.multiColor:
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.Twocolort(Layernum, DataNum);
                    break;
                case enmPaintColorSettingModeInfo.SoloColor:
                    break;
            }
            setSettingSoloModeWindow();
            SetPicClassBoxCursol();
        }
        //階級区分方法クリック
        function cboDivisionMethodChange(obj, sel, v) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let Layernum = attrData.TotalData.LV1.SelectedLayer;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let data = attrData.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings;
            let dc = document.getElementById("cboDivisionCount");
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let lshape = attrData.LayerData[Layernum].Shape;
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            dc.disabled = false;
            switch (v) {
                case enmDivisionMethod.AreaQuantile:
                    if (lshape != enmShape.PolygonShape) {
                        // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                        Generic.alert(undefined, "レイヤの形状が" + Generic.ConvertShapeEnumString(lshape) + "なので面積分位数は使えません。");
                        return;
                    }
                    break;
                case enmDivisionMethod.StandardDeviation:
                    // @ts-expect-error TS(2531): Object is possibly 'null'.
                    dc.selectedIndex = 2;
                    // @ts-expect-error TS(2531): Object is possibly 'null'.
                    dc.disabled = true;
                    let oldDivNum = data.Div_Num;
                    data.Div_Num = 6;
                    data.Class_Div.length = 6;
                    if (6 > oldDivNum) {
                        for (let i = oldDivNum; i < 6; i++) {
                            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                            data.Class_Div[i] = new strClass_Div_data();
                        }
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        attrData.Set_Class_Div(Layernum, DataNum, oldDivNum);
                    }
                    if (data.ClassPaintMD.Color_Mode != enmPaintColorSettingModeInfo.SoloColor) {
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        attrData.Twocolort(Layernum, DataNum);
                    }
                    break;
            }
            data.Div_Method = v;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.Set_Div_Value(Layernum, DataNum);
            setSettingSoloModeWindow();
            setFrequencyLabel();
        }
        //階級分割数クリック
        function cboDivisionCountChange(obj, sel, v) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let Layernum = attrData.TotalData.LV1.SelectedLayer;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let data = attrData.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings;
            let oldDivNum = data.Div_Num;
            if (oldDivNum == v) {
                return;
            }
            data.Div_Num = v;
            data.Class_Div.length = v;
            if (v > oldDivNum) {
                for (let i = oldDivNum; i < v; i++) {
                    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                    data.Class_Div[i] = new strClass_Div_data();
                }
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Set_Class_Div(Layernum, DataNum, oldDivNum);
            }
            switch (data.ClassPaintMD.Color_Mode) {
                case enmPaintColorSettingModeInfo.SoloColor:
                    for (let i = oldDivNum; i < v; i++) {
                        data.Class_Div[i].PaintColor = data.Class_Div[oldDivNum - 1].PaintColor.Clone();
                    }
                    data.ClassPaintMD.color2 = data.Class_Div[v - 1].PaintColor.Clone();
                    break;
                default:
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.Twocolort(Layernum, DataNum);
            }
            switch (data.Div_Method) {
                case enmDivisionMethod.Free:
                    for (let i = oldDivNum - 1; i < v; i++) {
                        data.Class_Div[i].Value = 0;
                    }
                    break;
                default:
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.Set_Div_Value(Layernum, DataNum);
            }
            setSettingSoloModeWindow();
            setFrequencyLabel();
        }
        //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■等値線モード■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        // @ts-expect-error TS(2304): Cannot find name 'scrMargin'.
        const contourView = Generic.createNewDiv(settingModeWindow, "", "contourView", "rightSettingWindowControlBase", 10, scrMargin.top + 10, sw - 20, sh - 20, "", "");
        contourView.style.backgroundColor = "#f0f0f0";
        const gbContourMode = Generic.createNewFrame(contourView, "", "", 0, 0, 170, 100, "等値線の設定方法");
        const contourIntervalList = [{ value: enmContourIntervalMode.ClassPaint, text: 'ペイントモードで塗り分け' },
            { value: enmContourIntervalMode.RegularInterval, text: '等間隔' },
            { value: enmContourIntervalMode.SeparateSettings, text: '個別設定' }];
        Generic.createNewRadioButtonList(gbContourMode, "contourInterval_Mode", contourIntervalList, 10, 10, undefined, 30, undefined, function (v) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowDataSolo().ContourMD.Interval_Mode = v;
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("gbContourLineLpat").setVisibility(v == enmContourIntervalMode.ClassPaint);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("gbRegularInterval").setVisibility(v == enmContourIntervalMode.RegularInterval);
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("gbSeparateSettings").setVisibility(v == enmContourIntervalMode.SeparateSettings);
            // @ts-expect-error TS(2304): Cannot find name 'Check_Print_err'.
            Check_Print_err();
        }, "");
        const gbContourDrawMethod = Generic.createNewFrame(contourView, "", "", 0, 125, 170, 100, "等値線の描き方");
        Generic.createNewCheckBox(gbContourDrawMethod, "ポリゴン内部のみ描画", "contourDraw_in_Polygon_F", true, 10, 20, undefined, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (obj) { attrData.nowDataSolo().ContourMD.Draw_in_Polygon_F = obj.checked; }, "");
        Generic.createNewCheckBox(gbContourDrawMethod, "等値線を曲線で近似", "contourSpline_flag", true, 10, 45, undefined, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (obj) { attrData.nowDataSolo().ContourMD.Spline_flag = obj.checked; }, "");
        const cboDetailedList = [{ value: 0, text: '非常に細かい' }, { value: 1, text: '細かい' },
            { value: 2, text: '少し細かい' }, { value: 3, text: '普通' }, { value: 4, text: '粗い' }];
        Generic.createNewWordSelect(gbContourDrawMethod, "密度", cboDetailedList, 0, "contourDetailed", 10, 70, 40, 80, 0, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (obj, sel, v) { attrData.nowDataSolo().ContourMD.Detailed = v; }, "", "", true);
        const gbContourLineLpat = Generic.createNewFrame(contourView, "gbContourLineLpat", "", 190, 0, 90, 55, "等値線線種");
        Generic.createNewCanvas(gbContourLineLpat, "contourLinePat", "imgButton", 20, 15, 50, 30, function (e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            clsLinePatternSet(e, attrData.nowDataSolo().ContourMD.Regular.Line_Pat, function (Lpat) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowDataSolo().ContourMD.Regular.Line_Pat = Lpat;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Draw_Sample_LineBox(document.getElementById("contourLinePat"), Lpat);
            });
        }, "");
        const gbRegularInterval = Generic.createNewFrame(contourView, "gbRegularInterval", "", 185, 0, 190, 390, "等値線間隔設定");
        const gbRegularNormal = Generic.createNewFrame(gbRegularInterval, "", "", 10, 10, 170, 125, "通常の等値線");
        Generic.createNewWordNumberInput(gbRegularNormal, "下限値", "", 0, "contourRegulerMinValue", 10, 15, undefined, 80, function (obj, v) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowDataSolo().ContourMD.Regular.bottom = v;
            // @ts-expect-error TS(2304): Cannot find name 'Check_Print_err'.
            Check_Print_err();
        }, "");
        Generic.createNewWordNumberInput(gbRegularNormal, "上限値", "", 0, "contourRegulerMaxValue", 10, 40, undefined, 80, function (obj, v) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowDataSolo().ContourMD.Regular.top = v;
            // @ts-expect-error TS(2304): Cannot find name 'Check_Print_err'.
            Check_Print_err();
        }, "");
        Generic.createNewWordNumberInput(gbRegularNormal, "間隔　", "", 0, "contourRegulerInterval", 10, 65, undefined, 80, function (obj, v) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowDataSolo().ContourMD.Regular.Interval = v;
            // @ts-expect-error TS(2304): Cannot find name 'Check_Print_err'.
            Check_Print_err();
        }, "");
        Generic.createNewWordDivCanvas(gbRegularNormal, "contourRegulerLinePat", "線種", 10, 90, 40, function (e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            clsLinePatternSet(e, attrData.nowDataSolo().ContourMD.Regular.Line_Pat, function (Lpat) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowDataSolo().ContourMD.Regular.Line_Pat = Lpat;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Draw_Sample_LineBox(e.target, Lpat);
            });
        });
        const gbRegularSP = Generic.createNewFrame(gbRegularInterval, "", "", 10, 155, 170, 125, "上のうち強調する等値線");
        Generic.createNewWordNumberInput(gbRegularSP, "下限値", "", 0, "contourRegulerSPMinValue", 10, 15, undefined, 80, function (obj, v) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowDataSolo().ContourMD.Regular.SP_Bottom = v;
            // @ts-expect-error TS(2304): Cannot find name 'Check_Print_err'.
            Check_Print_err();
        }, "");
        Generic.createNewWordNumberInput(gbRegularSP, "上限値", "", 0, "contourRegulerSPMaxValue", 10, 40, undefined, 80, function (obj, v) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowDataSolo().ContourMD.Regular.SP_Top = v;
            // @ts-expect-error TS(2304): Cannot find name 'Check_Print_err'.
            Check_Print_err();
        }, "");
        Generic.createNewWordNumberInput(gbRegularSP, "間隔　", "", 0, "contourRegulerSPInterval", 10, 65, undefined, 80, function (obj, v) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowDataSolo().ContourMD.Regular.SP_interval = v;
            // @ts-expect-error TS(2304): Cannot find name 'Check_Print_err'.
            Check_Print_err();
        }, "");
        Generic.createNewWordDivCanvas(gbRegularSP, "contourRegulerSPLinePat", "線種", 10, 90, 40, function (e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            clsLinePatternSet(e, attrData.nowDataSolo().ContourMD.Regular.SP_Line_Pat, function (Lpat) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowDataSolo().ContourMD.Regular.SP_Line_Pat = Lpat;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Draw_Sample_LineBox(e.target, Lpat);
            });
        });
        const gbRegularEx = Generic.createNewFrame(gbRegularInterval, "", "", 10, 295, 170, 70, "1本だけ強調する等値線");
        Generic.createNewCheckBox(gbRegularEx, "", "contourRegulerExCheck", true, 10, 15, undefined, function (obj) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowDataSolo().ContourMD.Regular.EX_Value_Flag = obj.checked;
        }, "");
        Generic.createNewWordNumberInput(gbRegularEx, "強調値", "", 0, "contourRegulerExValue", 40, 15, undefined, 80, function (obj, v) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowDataSolo().ContourMD.Regular.EX_Value = v;
            // @ts-expect-error TS(2304): Cannot find name 'Check_Print_err'.
            Check_Print_err();
        }, "");
        Generic.createNewWordDivCanvas(gbRegularEx, "contourRegulerExLine", "線種", 10, 40, 40, function (e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            clsLinePatternSet(e, attrData.nowDataSolo().ContourMD.Regular.EX_Line_Pat, function (Lpat) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowDataSolo().ContourMD.Regular.EX_Line_Pat = Lpat;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Draw_Sample_LineBox(e.target, Lpat);
            });
        });
        const gbSeparateSettings = Generic.createNewFrame(contourView, "gbSeparateSettings", "", 185, 0, 190, 360, "個別設定");
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        lstcontourSeparateValue = new ListBox(gbSeparateSettings, "", [], 15, 15, 120, 150, function () { setContourSepaDataValue(); }, "");
        const gbContourSepaData = Generic.createNewFrame(gbSeparateSettings, "gbContourSepaData", "", 15, 175, 150, 100, "");
        Generic.createNewWordNumberInput(gbContourSepaData, "値", "", 0, "contourSepaValue", 10, 10, undefined, 80, function (obj, v) {
            let n = lstcontourSeparateValue.selectedIndex;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowDataSolo().ContourMD.Irregular[n].Value = v;
            sortContourSepaValue();
        }, "");
        Generic.createNewWordDivCanvas(gbContourSepaData, "contourSepaLine", "線種", 10, 40, 40, function (e) {
            let n = lstcontourSeparateValue.selectedIndex;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            clsLinePatternSet(e, attrData.nowDataSolo().ContourMD.Irregular[n].Line_Pat, function (Lpat) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowDataSolo().ContourMD.Irregular[n].Line_Pat = Lpat;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Draw_Sample_LineBox(e.target, Lpat);
            });
        });
        // @ts-expect-error TS(2339): Property 'setVisibility' does not exist on type 'H... Remove this comment to see the full error message
        gbContourSepaData.setVisibility(false);
        Generic.createNewButton(gbContourSepaData, "削除", "", 80, 70, function () {
            let n = lstcontourSeparateValue.selectedIndex;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowDataSolo().ContourMD.Irregular.splice(n, 1);
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowDataSolo().ContourMD.IrregularNum--;
            lstcontourSeparateValue.removeList(n, 1);
            if (lstcontourSeparateValue.selectedIndex == -1) {
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                document.getElementById("gbContourSepaData").setVisibility(false);
            }
            else {
                setContourSepaDataValue();
            }
            // @ts-expect-error TS(2304): Cannot find name 'Check_Print_err'.
            Check_Print_err();
        }, "width:60px");
        Generic.createNewButton(gbSeparateSettings, "追加", "", 10, 295, function () {
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("gbContourSepaData").setVisibility(true);
            lstcontourSeparateValue.addList([{ value: 0, text: "0" }], lstcontourSeparateValue.length);
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowDataSolo().ContourMD.IrregularNum++;
            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
            let dt = new strContour_Data_Irregular_interval();
            dt.Line_Pat = clsBase.Line();
            dt.Value = 0;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowDataSolo().ContourMD.Irregular.push(dt);
            setContourSepaDataValue();
        }, "width:60px");
        Generic.createNewButton(gbSeparateSettings, "すべて削除", "", 80, 295, function () {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowDataSolo().ContourMD.IrregularNum = 0;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowDataSolo().ContourMD.Irregular = [];
            lstcontourSeparateValue.removeAll();
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("gbContourSepaData").setVisibility(false);
        }, "width:100px");
        Generic.createNewButton(gbSeparateSettings, "階級区分の値を設定", "", 10, 325, function () {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let ns = attrData.nowDataSolo();
            let n = ns.Div_Num - 1;
            ns.ContourMD.IrregularNum = n;
            ns.ContourMD.Irregular = [];
            let lst = [];
            for (let i = 0; i < n; i++) {
                // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                let dt = new strContour_Data_Irregular_interval();
                dt.Line_Pat = clsBase.Line();
                dt.Value = ns.Class_Div[i].Value;
                ns.ContourMD.Irregular.push(dt);
                lst.push({ value: dt.Value, text: dt.Value });
            }
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("gbContourSepaData").setVisibility(true);
            lstcontourSeparateValue.removeAll();
            lstcontourSeparateValue.addList(lst, 0);
            setContourSepaDataValue();
        }, "");
        function sortContourSepaValue() {
            //等値線数値の大きい順に並べ替える
            let n = lstcontourSeparateValue.selectedIndex;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let nsc = attrData.nowDataSolo().ContourMD;
            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
            let sort = new clsSortingSearch();
            let stac = [];
            let lst = [];
            for (let i = 0; i < nsc.IrregularNum; i++) {
                sort.Add(nsc.Irregular[i].Value);
                stac.push(nsc.Irregular[i].Clone());
            }
            sort.AddEnd();
            for (let i = 0; i < nsc.IrregularNum; i++) {
                let dt = stac[sort.DataPositionRev(i)];
                nsc.Irregular[i] = dt;
                lst.push({ value: dt.Value, text: String(dt.Value) });
            }
            let newn = sort.getAfterSortPositionRev(n);
            lstcontourSeparateValue.removeAll();
            lstcontourSeparateValue.addList(lst, 0);
            lstcontourSeparateValue.setSelectedIndex(newn);
            // @ts-expect-error TS(2304): Cannot find name 'Check_Print_err'.
            Check_Print_err();
        }
        //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■記号の大きさモード■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        // @ts-expect-error TS(2304): Cannot find name 'scrMargin'.
        const markSizeView = Generic.createNewDiv(settingModeWindow, "", "markSizeView", "rightSettingWindowControlBase", 10, scrMargin.top + 10, sw - 20, sh - 20, "", "");
        markSizeView.style.backgroundColor = "#f0f0f0";
        const gbMark = Generic.createNewFrame(markSizeView, "gbMark", "", 0, 0, 115, 95, "表示記号設定");
        Generic.createNewCanvas(gbMark, "picMarkSize", "imgButton", 25, 17, 65, 65, picMark_Click, "");
        const gbMarkLine = Generic.createNewFrame(markSizeView, "gbMarkLine", "", 0, 0, 125, 95, "線の設定");
        Generic.createNewSizeSelect(gbMarkLine, 0, "cboMarkLineSize", "最大幅", 15, 10, 40, 1, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (obj, v) { attrData.nowDataSolo().MarkSizeMD.LineShape.LineWidth = v; });
        Generic.createNewColorBox(gbMarkLine, "markLineColor", "色", "", 15, 35, MarkLineColor);
        Generic.createNewButton(gbMarkLine, "線端設定", "", 30, 70, btnMarkLineEdge, "");
        Generic.createNewButton(markSizeView, "内部データ", "", 20, 120, innerDataSet, "");
        const pnlMarkSizeLegend = Generic.createNewDiv(markSizeView, "", "pnlMarkSizeLegend", "", 0, 140, 280, 150, "", "");
        const gbLegendValue = Generic.createNewFrame(pnlMarkSizeLegend, "", "", 0, 15, 125, 160, "凡例");
        for (let i = 0; i < 5; i++) {
            Generic.createNewWordNumberInput(gbLegendValue, "値" + String(i + 1), "", 0, "txtMarkSizeValue" + String(i + 1), 10, i * 30 + 10, undefined, 80, function (obj, v) {
                const n = Number(obj.id.right(1)) - 1;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowDataSolo().MarkSizeMD.Value[n] = v;
            }, "");
        }
        const gbMarksizeLegendMaxValue = Generic.createNewFrame(pnlMarkSizeLegend, "", "", 140, 15, 150, 95, "最大サイズの値");
        const maxValuesetting = [{ value: enmMarkSizeValueMode.inDataItem, text: "データ項目の最大値" },
            { value: enmMarkSizeValueMode.UserDefinition, text: "ユーザ設定" }];
        Generic.createNewRadioButtonList(gbMarksizeLegendMaxValue, "markSizeMaxValueSetting", maxValuesetting, 10, 10, undefined, 30, undefined, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (v) { attrData.nowDataSolo().MarkSizeMD.MaxValueMode = v; }, "");
        Generic.createNewNumberInput(gbMarksizeLegendMaxValue, 0, "markSizeUserMaxValue", 40, 63, 90, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (obj, v) { attrData.nowDataSolo().MarkSizeMD.MaxValue = v; }, "");
        setMinusValueCase(markSizeView, "gbMarkSizeMinusValueCase");
        //記号の大きさモード線オブジェクトの線端設定
        function btnMarkLineEdge(e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let edge = attrData.nowDataSolo().MarkSizeMD.LineShape.LineEdge;
            clsLineEdgePattern(e, edge, okButton);
            function okButton(retEdge) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowDataSolo().MarkSizeMD.LineShape.LineEdge = retEdge;
            }
        }
        //記号の大きさモード線オブジェクトの色設定
        function MarkLineColor(e) {
            let col = Generic.RGBAfromElement(e.target);
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowDataSolo().MarkSizeMD.LineShape.Color = col;
        }
        //内部データボタンクリック
        function innerDataSet(e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            clsInnerDataSet(e, attrData, undefined);
        }
        //記号選択クリック(記号大きさ・記号の数共通)
        function picMark_Click(e) {
            let md;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            switch (attrData.nowData().ModeData) {
                case enmSoloMode_Number.MarkSizeMode:
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    md = attrData.nowDataSolo().MarkSizeMD;
                    break;
                case enmSoloMode_Number.MarkBlockMode:
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    md = attrData.nowDataSolo().MarkBlockMD;
                    break;
            }
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            clsMarkSet(e, picMarkChange, md.Mark, attrData);
            function picMarkChange(newMark) {
                md.Mark = newMark;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Draw_Sample_Mark_Box(e.target, newMark);
            }
        }
        //負の場合の内部色（記号の大きさ・数共通）
        function setMinusValueCase(parent, ID) {
            const gbBlockMinusValueCase = Generic.createNewFrame(parent, ID, "", 140, 0, 150, 120, "負の値の場合");
            Generic.createNewTileBox(gbBlockMinusValueCase, ID + "_minusColorBox", "負の値の内部", clsBase.Tile(), 10, 15, undefined, function (e) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let mkc = attrData.nowDataSolo().MarkCommon;
                clsTileSet(e, mkc.MinusTile, function (retTile) { mkc.MinusTile = retTile; });
            });
            Generic.createNewSpan(gbBlockMinusValueCase, "凡例文字", "", "", 10, 45, "", "");
            Generic.createNewWordTextInput(gbBlockMinusValueCase, "正の値", "", "", ID + "_txtMarkSizePlusValue", 20, 62, undefined, 80, 
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            function (e) { attrData.nowDataSolo().MarkCommon.LegendPlusWord = e.target.value; }, "text-align:left");
            Generic.createNewWordTextInput(gbBlockMinusValueCase, "負の値", "", "", ID + "_txtMarkSizeMinusValue", 20, 92, undefined, 80, 
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            function (e) { attrData.nowDataSolo().MarkCommon.LegendMinusWord = e.target.value; }, "text-align:left");
        }
        //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■記号の数モード■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        // @ts-expect-error TS(2304): Cannot find name 'scrMargin'.
        let markBlockView = Generic.createNewDiv(settingModeWindow, "", "markBlockView", "rightSettingWindowControlBase", 10, scrMargin.top + 10, sw - 20, sh - 20, "", "");
        markBlockView.style.backgroundColor = "#f0f0f0";
        const gbBlockMark = Generic.createNewFrame(markBlockView, "", "", 0, 0, 115, 85, "表示記号設定");
        Generic.createNewCanvas(gbBlockMark, "picMarkBlockSize", "imgButton", 30, 17, 55, 55, picMark_Click, "");
        Generic.createNewButton(markBlockView, "内部データ", "", 20, 110, innerDataSet, "");
        const gbBlockMarkArrange = Generic.createNewFrame(markBlockView, "", "", 0, 140, 120, 95, "記号配置");
        const arrangeList = [{ value: enmMarkBlockArrange.Block, text: 'ブロック' },
            { value: enmMarkBlockArrange.Vertical, text: '縦' },
            { value: enmMarkBlockArrange.Horizontal, text: '横' },
            { value: enmMarkBlockArrange.Random, text: 'ランダム' }];
        Generic.createNewRadioButtonList(gbBlockMarkArrange, "blockArrange", arrangeList, 10, 10, undefined, 22, undefined, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (v) { attrData.nowDataSolo().MarkBlockMD.ArrangeB = v; }, "");
        Generic.createNewWordNumberInput(markBlockView, "1記号あたりの値", "", 0, "markBlockValue", 0, 260, undefined, 100, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (obj, v) { attrData.nowDataSolo().MarkBlockMD.Value = v; }, "");
        Generic.createNewWordTextInput(markBlockView, "凡例文字", "（空白は既定値）", "", "markBlockWord", 0, 285, undefined, 80, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (e) { attrData.nowDataSolo().MarkBlockMD.LegendBlockModeWord = e.target.value; }, "text-align:left");
        Generic.createNewCheckBox(markBlockView, "端数表示", "markBlockHasu", false, 0, 310, undefined, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (obj) { attrData.nowDataSolo().MarkBlockMD.HasuVisible = obj.checked; }, "text-align:left");
        const cboOverlapList = [{ value: 0, text: '少し離す' }, { value: 1, text: 'ぴったり' },
            { value: 2, text: '1/4重ねる' }, { value: 3, text: '1/2重ねる' }, { value: 4, text: '3/4重ねる' }];
        Generic.createNewWordSelect(markBlockView, "記号の重なり", cboOverlapList, 0, "markBlockOverlap", 0, 335, undefined, 100, 0, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (obj, sel, v) { attrData.nowDataSolo().MarkBlockMD.Overlap = v; }, "", "", false);
        setMinusValueCase(markBlockView, "gbMarBlockMinusValueCase");
        //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■棒の高さモード■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        // @ts-expect-error TS(2304): Cannot find name 'scrMargin'.
        let markBarView = Generic.createNewDiv(settingModeWindow, "", "markBarView", "rightSettingWindowControlBase", 20, scrMargin.top, sw - 20, sh - 20, "", "");
        Generic.createNewSizeSelect(markBarView, 0, "cboMarkBarHeightSize", "最大高さ", 0, 30, 60, 3, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (obj, v) { attrData.nowDataSolo().MarkBarMD.MaxHeight = v; });
        const gbMarkBarLegendMaxValue = Generic.createNewFrame(markBarView, "", "", 0, 55, 150, 100, "最大高さの値");
        Generic.createNewRadioButtonList(gbMarkBarLegendMaxValue, "markBarmaxValueSetting", maxValuesetting, 10, 15, undefined, 30, undefined, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (v) { attrData.nowDataSolo().MarkBarMD.MaxValueMode = v; }, "");
        Generic.createNewNumberInput(gbMarkBarLegendMaxValue, 0, "markBarUserMaxValue", 40, 70, 90, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (obj, v) { attrData.nowDataSolo().MarkBarMD.MaxValue = v; }, "");
        Generic.createNewSizeSelect(markBarView, 0, "cboMarkBarWidth", "幅", 0, 185, 40, 2, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (obj, v) { attrData.nowDataSolo().MarkBarMD.Width = v; });
        Generic.createNewTileBox(markBarView, "markBarInnerColor", "内部色", clsBase.Tile(), 0, 215, 40, function (e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let mkc = attrData.nowDataSolo().MarkBarMD.InnerTile;
            clsTileSet(e, mkc, 
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            function (retTile) { attrData.nowDataSolo().MarkBarMD.InnerTile = retTile; });
        });
        Generic.createNewWordDivCanvas(markBarView, "markBarFrame", "輪郭線", 0, 245, 40, function (e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            clsLinePatternSet(e, attrData.nowDataSolo().MarkBarMD.FrameLinePat, function (Lpat) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowDataSolo().MarkBarMD.FrameLinePat = Lpat;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Draw_Sample_LineBox(e.target, Lpat);
            });
        });
        Generic.createNewButton(markBarView, "内部データ", "", 0, 280, innerDataSet, "");
        const gbMarkBarShape = Generic.createNewFrame(markBarView, "", "", 180, 30, 150, 70, "形状");
        const MarkBarShapeList = [{ value: enmMarkBarShape.bar, text: "縦棒" },
            { value: enmMarkBarShape.triangle, text: "三角" }];
        Generic.createNewRadioButtonList(gbMarkBarShape, "markBarShape", MarkBarShapeList, 10, 15, undefined, 25, undefined, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (v) { attrData.nowDataSolo().MarkBarMD.BarShape = v; }, "");
        const gbMarkBarScale = Generic.createNewFrame(markBarView, "", "", 180, 120, 150, 150, "縦棒設定");
        Generic.createNewCheckBox(gbMarkBarScale, "立体表示", "", true, 10, 20, undefined, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (obj) { attrData.nowDataSolo().MarkBarMD.ThreeD = obj.checked; }, "");
        Generic.createNewCheckBox(gbMarkBarScale, "目盛り線表示", "markBarScaleCheck", true, 10, 50, undefined, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (obj) { attrData.nowDataSolo().MarkBarMD.ScaleLineVisible = obj.checked; }, "");
        Generic.createNewWordNumberInput(gbMarkBarScale, "間隔", "", 0, "markBarScaleInterval", 15, 80, undefined, 80, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (obj, v) { attrData.nowDataSolo().MarkBarMD.ScaleLineInterval = v; }, "");
        Generic.createNewWordDivCanvas(gbMarkBarScale, "markBarScaleLine", "パターン", 15, 110, 60, function (e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            clsLinePatternSet(e, attrData.nowDataSolo().MarkBarMD.scaleLinePat, function (Lpat) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowDataSolo().MarkBarMD.scaleLinePat = Lpat;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Draw_Sample_LineBox(e.target, Lpat);
            });
        });
        //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■文字モード■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        // @ts-expect-error TS(2304): Cannot find name 'scrMargin'.
        let stringView = Generic.createNewDiv(settingModeWindow, "", "stringView", "rightSettingWindowControlBase", 10, scrMargin.top, sw - 20, sh - 20, "", "");
        stringView.style.backgroundColor = "#f0f0f0";
        Generic.createNewButton(stringView, "フォント", "", 30, 30, function (e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let md = attrData.nowDataSolo().StringMD;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            clsFontSet(e, md.Font, function (newFont) { md.Font = newFont; }, attrData);
        }, "");
        Generic.createNewSizeSelect(stringView, 0, "txtStringSizeChange", "最大幅", 30, 70, 40, 3, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (obj, v) { attrData.nowDataSolo().StringMD.maxWidth = v; });
        Generic.createNewCheckBox(stringView, "最大幅を超えたら折り返す", "chkStringReturn", false, 30, 110, undefined, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (obj) { attrData.nowDataSolo().StringMD.WordTurnF = obj.checked; }, "");
        Generic.createNewButton(stringView, "内部データ", "", 30, 150, innerDataSet, "");
        //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■重ね合わせモード■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        // @ts-expect-error TS(2304): Cannot find name 'scrMargin'.
        let overlayView = Generic.createNewDiv(settingModeWindow, "", "overlayView", "rightSettingWindowControlBase", 10, scrMargin.top, sw - 20, sh - 20, "", "");
        let gbOverlayDataSet = Generic.createNewFrame(overlayView, "gbOverlayDataSet", "", 0, 10, 380, 80, "重ね合わせデータセット");
        Generic.createNewSelect(gbOverlayDataSet, [], -1, "overlayDataSetList", 15, 15, false, function (obj, selectedIndex, value) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.TotalData.TotalMode.OverLay.SelectedIndex = selectedIndex;
            overlayDatasetDataItem();
        }, "width:185px", 1, false);
        Generic.createNewButton(gbOverlayDataSet, "追加", "", 205, 15, function () {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let ov = attrData.TotalData.TotalMode.OverLay;
            ov.AddDataSet();
            ov.SelectedIndex = ov.DataSet.length - 1;
            setSettingOverlayModeWindow();
        }, "font-size:12px");
        Generic.createNewButton(gbOverlayDataSet, "データセット削除", "", 260, 15, function (e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let ov = attrData.TotalData.TotalMode.OverLay;
            if (ov.DataSet.length == 1) {
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                Generic.alert(new point(e.clientX, e.clientY), "これ以上削除できません。");
                return;
            }
            ov.DataSet.splice(ov.SelectedIndex, 1);
            ov.SelectedIndex = Math.min(ov.SelectedIndex, ov.DataSet.length - 1);
            let aoi = ov.Always_Overlay_Index;
            if (aoi == ov.SelectedIndex) {
                aoi = -1;
            }
            else {
                if (aoi > ov.SelectedIndex) {
                    aoi--;
                }
            }
            ov.Always_Overlay_Index = aoi;
            setSettingOverlayModeWindow();
        }, "font-size:12px");
        Generic.createNewWordTextInput(gbOverlayDataSet, "タイトル", "", "", "overlayDatasetTitle", 15, 45, undefined, 200, function (e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let ov = attrData.TotalData.TotalMode.OverLay;
            let ttl = e.target.value;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowOverlay().title = ttl;
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("overlayDataSetList").setSelectData(ov.SelectedIndex, ov.SelectedIndex, ttl);
        }, "");
        Generic.createNewCheckBox(gbOverlayDataSet, "常に重ねる", "overlayAlwaysOver", false, 290, 50, undefined, function (obj) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.TotalData.TotalMode.OverLay.Always_Overlay_Index = (obj.checked == true) ? attrData.TotalData.TotalMode.OverLay.SelectedIndex : -1;
        }, "");
        let gbOverlayDataSetItem = Generic.createNewFrame(overlayView, "gbOverlayDataSetItem", "", 0, 110, 380, 290, "重ね合わせデータ");
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
        let overHdata = Generic.Array2Dimension(4, 1);
        overHdata[0][0] = "レイヤ";
        overHdata[1][0] = "データ";
        overHdata[2][0] = "表示モード";
        overHdata[3][0] = "凡例";
        let borderStyle = "border:solid 1px;background-Color:#ffffff";
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        overlayListView = new ListViewTable(gbOverlayDataSetItem, "", "", "", overHdata, [], 15, 15, 350, 200, borderStyle, "font-size:13px;", "background-Color:#dddddd;text-align:center", "", ["", "", "", "width:10%"], "", true, function (row) { overlayDatasetDataItemEach(); });
        let gbOverlayItemData = Generic.createNewFrame(gbOverlayDataSetItem, "gbOverlayItemData", "", 15, 230, 230, 50, "");
        Generic.createNewImageButton(gbOverlayItemData, "", "image/112_UpArrowLong_Grey_24x24_72.png", 8, 13, 24, 24, function () {
            let n = overlayListView.selectedRow;
            overlayListView.rowUp();
            let dest = n - 1;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let d1 = attrData.nowOverlay().DataItem[n].Clone();
            if (dest == -1) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowOverlay().DataItem.shift();
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowOverlay().DataItem.push(d1);
            }
            else {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let d2 = attrData.nowOverlay().DataItem[dest].Clone();
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowOverlay().DataItem[n] = d2;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowOverlay().DataItem[dest] = d1;
            }
        }, "padding:2px");
        Generic.createNewImageButton(gbOverlayItemData, "", "image/112_DownArrowLong_Grey_24x24_72.png", 43, 13, 24, 24, function () {
            let n = overlayListView.selectedRow;
            overlayListView.rowDown();
            let dest = n + 1;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let d1 = attrData.nowOverlay().DataItem[n].Clone();
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if (dest == attrData.nowOverlay().DataItem.length) {
                dest = 0;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowOverlay().DataItem.splice(0, 0, d1);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowOverlay().DataItem.pop();
            }
            else {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let d2 = attrData.nowOverlay().DataItem[dest].Clone();
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowOverlay().DataItem[n] = d2;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowOverlay().DataItem[dest] = d1;
            }
        }, "padding:2px");
        Generic.createNewCheckBox(gbOverlayItemData, "凡例を表示", "overlayItemDataLegendPrint", false, 75, 18, undefined, function (obj) {
            let n = overlayListView.selectedRow;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowOverlay().DataItem[n].Legend_Print_Flag = obj.checked;
            let tx = (obj.checked == true) ? "表示" : "非表示";
            overlayListView.setValue(3, n, tx);
        }, "");
        Generic.createNewButton(gbOverlayItemData, "削除", "", 170, 15, function () {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if (attrData.nowOverlay().DataItem.length > 0) {
                let n = overlayListView.selectedRow;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowOverlay().DataItem.splice(n, 1);
                overlayListView.deleteRow();
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                if (attrData.nowOverlay().DataItem.length == 0) {
                    // @ts-expect-error TS(2339): Property 'setVisibility' does not exist on type 'H... Remove this comment to see the full error message
                    gbOverlayItemData.setVisibility(false);
                }
            }
        }, "width:50px");
        Generic.createNewButton(gbOverlayDataSetItem, "注", "", 260, 230, function () {
        }, "width:50px");
        Generic.createNewButton(gbOverlayDataSetItem, "すべて削除", "", 260, 260, function () {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowOverlay().DataItem = [];
            overlayListView.clear();
            // @ts-expect-error TS(2339): Property 'setVisibility' does not exist on type 'H... Remove this comment to see the full error message
            gbOverlayItemData.setVisibility(false);
        }, "width:100px");
        //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■連続表示モード■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        // @ts-expect-error TS(2304): Cannot find name 'scrMargin'.
        let seriesView = Generic.createNewDiv(settingModeWindow, "", "seriesView", "rightSettingWindowControlBase", 10, scrMargin.top, sw - 20, sh - 20, "", "");
        let gbseriesDataSet = Generic.createNewFrame(seriesView, "gbSeriesDataSet", "", 0, 10, 380, 80, "連続表示データセット");
        Generic.createNewSelect(gbseriesDataSet, [], -1, "seriesDataSetList", 15, 15, false, function (obj, selectedIndex, value) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.TotalData.TotalMode.Series.SelectedIndex = selectedIndex;
            seriesDatasetDataItem();
        }, "width:185px", 1, false);
        Generic.createNewButton(gbseriesDataSet, "追加", "", 205, 15, function () {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let ov = attrData.TotalData.TotalMode.Series;
            ov.AddDataSet();
            ov.SelectedIndex = ov.DataSet.length - 1;
            setSettingSeriesModeWindow();
        }, "font-size:12px");
        Generic.createNewButton(gbseriesDataSet, "データセット削除", "", 260, 15, function (e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let ov = attrData.TotalData.TotalMode.Series;
            if (ov.DataSet.length == 1) {
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                Generic.alert(new point(e.clientX, e.clientY), "これ以上削除できません。");
                return;
            }
            ov.DataSet.splice(ov.SelectedIndex, 1);
            ov.SelectedIndex = Math.min(ov.SelectedIndex, ov.DataSet.length - 1);
            setSettingSeriesModeWindow();
        }, "font-size:12px");
        Generic.createNewWordTextInput(gbseriesDataSet, "タイトル", "", "", "seriesDatasetTitle", 15, 45, undefined, 200, function (e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let ov = attrData.TotalData.TotalMode.Series;
            let ttl = e.target.value;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowSeries().title = ttl;
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("seriesDataSetList").setSelectData(ov.SelectedIndex, ov.SelectedIndex, ttl);
        }, "");
        let gbSeriesDataSetItem = Generic.createNewFrame(seriesView, "gbSeriesDataSetItem", "", 0, 110, 380, 290, "連続表示データ");
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
        let seriesHdata = Generic.Array2Dimension(4, 1);
        seriesHdata[0][0] = "順番";
        seriesHdata[1][0] = "レイヤ";
        seriesHdata[2][0] = "データ";
        seriesHdata[3][0] = "表示モード";
        let slborderStyle = "border:solid 1px;background-Color:#ffffff";
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        seriesListView = new ListViewTable(gbSeriesDataSetItem, "", "", "", seriesHdata, [], 15, 15, 350, 200, slborderStyle, "font-size:13px;", "background-Color:#dddddd;text-align:center", "", ["width:10%"], ["text-align:center"], true, undefined);
        let gbSeriesItemData = Generic.createNewFrame(gbSeriesDataSetItem, "gbSeriesItemData", "", 15, 230, 150, 50, "");
        Generic.createNewImageButton(gbSeriesItemData, "", "image/112_UpArrowLong_Grey_24x24_72.png", 10, 13, 24, 24, function () {
            let n = seriesListView.selectedRow;
            seriesListView.rowUp();
            resetSeriesListOrderNumber();
            let dest = n - 1;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let d1 = attrData.nowSeries().DataItem[n].Clone();
            if (dest == -1) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowSeries().DataItem.shift();
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowSeries().DataItem.push(d1);
            }
            else {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let d2 = attrData.nowSeries().DataItem[dest].Clone();
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowSeries().DataItem[n] = d2;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowSeries().DataItem[dest] = d1;
            }
        }, "padding:2px");
        Generic.createNewImageButton(gbSeriesItemData, "", "image/112_DownArrowLong_Grey_24x24_72.png", 45, 13, 24, 24, function () {
            let n = seriesListView.selectedRow;
            seriesListView.rowDown();
            resetSeriesListOrderNumber();
            let dest = n + 1;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let d1 = attrData.nowSeries().DataItem[n].Clone();
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if (dest == attrData.nowSeries().DataItem.length) {
                dest = 0;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowSeries().DataItem.splice(0, 0, d1);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowSeries().DataItem.pop();
            }
            else {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let d2 = attrData.nowSeries().DataItem[dest].Clone();
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowSeries().DataItem[n] = d2;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowSeries().DataItem[dest] = d1;
            }
        }, "padding:2px");
        Generic.createNewButton(gbSeriesItemData, "削除", "", 90, 15, function () {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if (attrData.nowSeries().DataItem.length > 0) {
                let n = seriesListView.selectedRow;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowSeries().DataItem.splice(n, 1);
                seriesListView.deleteRow();
                resetSeriesListOrderNumber();
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                if (attrData.nowSeries().DataItem.length == 0) {
                    // @ts-expect-error TS(2339): Property 'setVisibility' does not exist on type 'H... Remove this comment to see the full error message
                    gbSeriesItemData.setVisibility(false);
                }
            }
        }, "width:50px");
        Generic.createNewButton(gbSeriesDataSetItem, "反転", "", 190, 245, function () {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if (attrData.nowSeries().DataItem.length < 2) {
                return;
            }
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let series = attrData.TotalData.TotalMode.Series;
            let seriesSelD = series.DataSet[series.SelectedIndex];
            let n = seriesSelD.DataItem.length;
            // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
            for (let i = 0; i < parseInt(n / 2); i++) {
                [seriesSelD.DataItem[i], seriesSelD.DataItem[n - 1 - i]] = [seriesSelD.DataItem[n - 1 - i], seriesSelD.DataItem[i]];
            }
            seriesListView.reverse();
            resetSeriesListOrderNumber();
        }, "width:50px");
        Generic.createNewButton(gbSeriesDataSetItem, "すべて削除", "", 260, 245, function () {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowSeries().DataItem = [];
            seriesListView.clear();
            // @ts-expect-error TS(2339): Property 'setVisibility' does not exist on type 'H... Remove this comment to see the full error message
            gbSeriesItemData.setVisibility(false);
        }, "width:100px");
        //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■グラフモード■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        // @ts-expect-error TS(2304): Cannot find name 'scrMargin'.
        let graphView = Generic.createNewDiv(settingModeWindow, "", "graphView", "rightSettingWindowControlBase", 10, scrMargin.top, sw - 20, sh - 20, "", "");
        let gbgraphDataSet = Generic.createNewFrame(graphView, "gbgraphDataSet", "", 0, 10, 380, 80, "グラフデータセット");
        Generic.createNewSelect(gbgraphDataSet, [], -1, "graphDataSetList", 15, 15, false, function (obj, selectedIndex, value) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.layerGraph().SelectedIndex = selectedIndex;
            // @ts-expect-error TS(2339): Property 'selectedRow' does not exist on type 'HTM... Remove this comment to see the full error message
            pnlGraphItem.selectedRow = -1;
            pnlGraphEachItem(0);
            graphDatasetDataItem();
        }, "width:185px", 1, false);
        Generic.createNewButton(gbgraphDataSet, "追加", "", 205, 15, function () {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let gv = attrData.layerGraph();
            gv.AddDataSet();
            gv.SelectedIndex = gv.DataSet.length - 1;
            // @ts-expect-error TS(2339): Property 'selectedRow' does not exist on type 'HTM... Remove this comment to see the full error message
            pnlGraphItem.selectedRow = -1;
            setSettingGraphModeWindow();
        }, "font-size:12px");
        Generic.createNewButton(gbgraphDataSet, "データセット削除", "", 260, 15, function (e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let gv = attrData.layerGraph();
            if (gv.DataSet.length == 1) {
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                Generic.alert(new point(e.clientX, e.clientY), "これ以上削除できません。");
                return;
            }
            gv.DataSet.splice(gv.SelectedIndex, 1);
            gv.SelectedIndex = Math.min(gv.SelectedIndex, gv.DataSet.length - 1);
            setSettingGraphModeWindow();
        }, "font-size:12px");
        Generic.createNewWordTextInput(gbgraphDataSet, "タイトル", "", "", "graphDatasetTitle", 15, 45, undefined, 200, function (e) {
            let ttl = e.target.value;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowGraph().title = ttl;
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("graphDataSetList").setSelectData(attrData.layerGraph().SelectedIndex, attrData.layerGraph().SelectedIndex, ttl);
        }, "");
        let gbGraphDataSetItem = Generic.createNewFrame(graphView, "gbGraphDataSetItem", "", 0, 110, 250, 290, "表示データ項目");
        let pnlGraphItemBase = Generic.createNewDiv(gbGraphDataSetItem, "", "pnlGraphItemBase", "grayFrame", 10, 15, 230, 200, "overflow-y:scroll;overflow-x:hidden;background-Color:#ffffff", undefined);
        // @ts-expect-error TS(2304): Cannot find name 'scrMargin'.
        let pnlGraphItem = Generic.createNewDiv(pnlGraphItemBase, "", "pnlGraphItem", "", 0, 0, 230, 200 - scrMargin.scrollWidth, "overflow:hidden", undefined);
        // @ts-expect-error TS(2339): Property 'inPanel' does not exist on type 'HTMLDiv... Remove this comment to see the full error message
        pnlGraphItem.inPanel = 0;
        // @ts-expect-error TS(2339): Property 'selectedRow' does not exist on type 'HTM... Remove this comment to see the full error message
        pnlGraphItem.selectedRow = -1;
        Generic.createNewImageButton(gbGraphDataSetItem, "", "image/112_UpArrowLong_Grey_24x24_72.png", 10, 225, 24, 24, function () {
            // @ts-expect-error TS(2339): Property 'selectedRow' does not exist on type 'HTM... Remove this comment to see the full error message
            let n = pnlGraphItem.selectedRow;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let selGraph = attrData.nowGraph();
            let dest = n - 1;
            let d1 = selGraph.Data[n].Clone();
            if (dest == -1) {
                selGraph.Data.shift();
                selGraph.Data.push(d1);
            }
            else {
                let d2 = selGraph.Data[dest].Clone();
                selGraph.Data[n] = d2;
                selGraph.Data[dest] = d1;
            }
            pnlGraphEachItem(dest);
        }, "padding:2px");
        Generic.createNewImageButton(gbGraphDataSetItem, "", "image/112_DownArrowLong_Grey_24x24_72.png", 45, 225, 24, 24, function () {
            // @ts-expect-error TS(2339): Property 'selectedRow' does not exist on type 'HTM... Remove this comment to see the full error message
            let n = pnlGraphItem.selectedRow;
            let dest = n + 1;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let selGraph = attrData.nowGraph();
            let d1 = selGraph.Data[n].Clone();
            if (dest == selGraph.Data.length) {
                dest = 0;
                selGraph.Data.splice(0, 0, d1);
                selGraph.Data.pop();
            }
            else {
                let d2 = selGraph.Data[dest].Clone();
                selGraph.Data[n] = d2;
                selGraph.Data[dest] = d1;
            }
            pnlGraphEachItem(dest);
        }, "padding:2px");
        Generic.createNewButton(gbGraphDataSetItem, "追加", "", 85, 230, function (e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let selGraph = attrData.nowGraph();
            let preAsta = [];
            for (let i = 0; i < selGraph.Data.length; i++) {
                preAsta.push(selGraph.Data[i].DataNumber);
            }
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            clsSelectData(e, attrData, attrData.TotalData.LV1.SelectedLayer, function (selectedStatus, selectedNumber) {
                let colorPat = [];
                // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                colorPat.push(new colorRGBA([255, 40, 0]));
                // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                colorPat.push(new colorRGBA([0, 0o0, 0xbf]));
                // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                colorPat.push(new colorRGBA([255, 255, 0xbf]));
                // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                colorPat.push(new colorRGBA([0xbf, 255, 0xbf]));
                // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                colorPat.push(new colorRGBA([0xbf, 255, 255]));
                // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                colorPat.push(new colorRGBA([255, 0xbf, 255]));
                // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                colorPat.push(new colorRGBA([255, 0xbf, 0xbf]));
                // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                colorPat.push(new colorRGBA([0xbf, 0xbf, 255]));
                // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                colorPat.push(new colorRGBA([255, 255, 255]));
                // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                colorPat.push(new colorRGBA([0xdb, 0xdb, 0xdb]));
                let n = selGraph.Data.length;
                for (let i = 0; i < selectedNumber.length; i++) {
                    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                    let d = new GraphModeDataItem();
                    d.DataNumber = selectedNumber[i];
                    d.Tile = clsBase.Tile();
                    d.Tile.Color = colorPat[(n + i) % colorPat.length].Clone();
                    // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                    d.Tile.Color = Generic.GetColorArrange(d.Tile.Color, -parseInt((n + i) / colorPat.length) * 50);
                    selGraph.Data.push(d);
                }
                pnlGraphEachItem(n);
                // @ts-expect-error TS(2345): Argument of type 'any[]' is not assignable to para... Remove this comment to see the full error message
            }, preAsta, true, true, false, false);
        }, "width:70px");
        Generic.createNewButton(gbGraphDataSetItem, "削除", "", 170, 230, function () {
            // @ts-expect-error TS(2339): Property 'selectedRow' does not exist on type 'HTM... Remove this comment to see the full error message
            let n = pnlGraphItem.selectedRow;
            if (n != -1) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowGraph().Data.splice(n, 1);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let mxn = attrData.nowGraph().Data.length;
                // @ts-expect-error TS(2339): Property 'selectedRow' does not exist on type 'HTM... Remove this comment to see the full error message
                pnlGraphItem.selectedRow = -1;
                pnlGraphEachItem(Math.min(n, mxn - 1));
            }
        }, "width:70px");
        Generic.createNewButton(gbGraphDataSetItem, "すべて削除", "", 160, 260, function () {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowGraph().Data = [];
            // @ts-expect-error TS(2339): Property 'selectedRow' does not exist on type 'HTM... Remove this comment to see the full error message
            pnlGraphItem.selectedRow = -1;
            pnlGraphEachItem(-1);
        }, "width:80px");
        Generic.createNewButton(gbGraphDataSetItem, "同一色に設定", "btmBarGraphColorSetting", 40, 260, function (e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let selGraph = attrData.nowGraph();
            clsTileSet(e, selGraph.Data[0].Tile, function (retTile) {
                for (let i = 0; i < selGraph.Data.length; i++) {
                    selGraph.Data[i].Tile = retTile.Clone();
                    let tbox = document.getElementById("pnlGraphIteminPanelTileBox" + String(i));
                    Generic.setTileDiv(tbox, retTile);
                }
            });
        }, "width:110px");
        let gbGraphShape = Generic.createNewFrame(graphView, "gbGraphShape", "", 260, 110, 120, 130, "グラフの形式");
        let gslist = [{ value: enmGraphMode.PieGraph, text: "円グラフ" }, { value: enmGraphMode.StackedBarGraph, text: "帯グラフ" }, { value: enmGraphMode.LineGraph, text: "折れ線グラフ" }, { value: enmGraphMode.BarGraph, text: "棒グラフ" }];
        Generic.createNewRadioButtonList(gbGraphShape, "graphShape", gslist, 10, 15, undefined, 25, undefined, function (v) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let selGraph = attrData.nowGraph();
            selGraph.GraphMode = v;
            for (let i = 0; i < selGraph.Data.length; i++) {
                let tbox = document.getElementById("pnlGraphIteminPanelTileBox" + String(i));
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                tbox.setVisibility(v != enmGraphMode.LineGraph);
            }
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("btmBarGraphColorSetting").setVisibility(v == enmGraphMode.BarGraph);
            // @ts-expect-error TS(2304): Cannot find name 'Check_Print_err'.
            Check_Print_err();
        }, "");
        const gbGraphLineLpat = Generic.createNewFrame(graphView, "gbGraphLineLpat", "", 260, 260, 120, 45, "線種");
        Generic.createNewCanvas(gbGraphLineLpat, "graphLinePat", "imgButton", 35, 10, 50, 25, function (e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let selGraph = attrData.nowGraph();
            switch (selGraph.GraphMode) {
                case enmGraphMode.PieGraph:
                // @ts-expect-error TS(2551): Property 'StackedBarGrap' does not exist on type '... Remove this comment to see the full error message
                case enmGraphMode.StackedBarGrap:
                    clsLinePatternSet(e, selGraph.En_Obi.BoaderLine, function (Lpat) {
                        selGraph.En_Obi.BoaderLine = Lpat;
                        picGraphLinePat();
                    });
                    break;
                case enmGraphMode.BarGraph:
                case enmGraphMode.LineGraph:
                    clsLinePatternSet(e, selGraph.Oresen_Bou.Line, function (Lpat) {
                        selGraph.Oresen_Bou.Line = Lpat;
                        picGraphLinePat();
                    });
                    break;
            }
        }, "");
        Generic.createNewButton(graphView, "サイズ等設定", "", 260, 335, function () {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if (attrData.nowGraph().Data.length > 0) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let selGraph = attrData.nowGraph();
                switch (selGraph.GraphMode) {
                    case enmGraphMode.PieGraph:
                    case enmGraphMode.StackedBarGraph:
                        graphModeEn_Obi();
                        break;
                    case enmGraphMode.BarGraph:
                    case enmGraphMode.LineGraph:
                        graphModeOresen_Bou();
                        break;
                }
            }
            else {
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                Generic.alert(undefined, "表示データ項目を選択して下さい。");
            }
        }, "width:120;font-size:15px;font-weight:bold");
        //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ラベルモード■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        // @ts-expect-error TS(2304): Cannot find name 'scrMargin'.
        let labelView = Generic.createNewDiv(settingModeWindow, "", "labelView", "rightSettingWindowControlBase", 10, scrMargin.top, sw - 20, sh - 20, "", "");
        let gblabelDataSet = Generic.createNewFrame(labelView, "gblabelDataSet", "", 0, 10, 380, 80, "ラベルデータセット");
        Generic.createNewSelect(gblabelDataSet, [], -1, "labelDataSetList", 15, 15, false, function (obj, selectedIndex, value) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.layerLabel().SelectedIndex = selectedIndex;
            labelDatasetDataItem();
        }, "width:185px", 1, false);
        Generic.createNewButton(gblabelDataSet, "追加", "", 205, 15, function () {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let ov = attrData.layerLabel();
            ov.AddDataSet();
            ov.SelectedIndex = ov.DataSet.length - 1;
            setSettingLabelModeWindow();
        }, "font-size:12px");
        Generic.createNewButton(gblabelDataSet, "データセット削除", "", 260, 15, function (e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let ov = attrData.layerLabel();
            if (ov.DataSet.length == 1) {
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                Generic.alert(new point(e.clientX, e.clientY), "これ以上削除できません。");
                return;
            }
            ov.DataSet.splice(ov.SelectedIndex, 1);
            ov.SelectedIndex = Math.min(ov.SelectedIndex, ov.DataSet.length - 1);
            setSettingLabelModeWindow();
        }, "font-size:12px");
        Generic.createNewWordTextInput(gblabelDataSet, "タイトル", "", "", "labelDatasetTitle", 15, 45, undefined, 200, function (e) {
            let ttl = e.target.value;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowLabel().title = ttl;
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            document.getElementById("labelDataSetList").setSelectData(attrData.layerLabel().SelectedIndex, attrData.layerGraph().SelectedIndex, ttl);
        }, "");
        let gbLabelObjName = Generic.createNewFrame(labelView, "gbLabelDataSetItem", "", 0, 110, 230, 70, "オブジェクト名");
        // @ts-expect-error TS(2554): Expected 9 arguments, but got 8.
        Generic.createNewCheckBox(gbLabelObjName, "オブジェクト名表示", "chkLblObjectName", false, 15, 15, undefined, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (obj) { attrData.nowLabel().ObjectName_Print_Flag = obj.checked; });
        Generic.createNewCheckBox(gbLabelObjName, "最大幅を超えたら折り返す", "chkLblObjectNameReturn", false, 15, 42, undefined, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (obj) { attrData.nowLabel().ObjectName_Turn_Flag = obj.checked; }, "");
        Generic.createNewButton(gbLabelObjName, "フォント", "", 155, 12, function (e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            clsFontSet(e, attrData.nowLabel().ObjectName_Font, function (newFont) { attrData.nowLabel().ObjectName_Font = newFont; }, attrData);
        }, "");
        let gbLabelMaxSize = Generic.createNewFrame(labelView, "gbLabelDataSetItem", "", 240, 110, 110, 70, "最大幅");
        Generic.createNewSizeSelect(gbLabelMaxSize, 0, "txtLabelSizeChange", "", 15, 30, 40, 3, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (obj, v) { attrData.nowLabel().Width = v; });
        let gbLabelDataItem = Generic.createNewFrame(labelView, "gbLabelDataSetItem", "", 0, 195, 350, 155, "データ項目");
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        lstLabelDataItem = new ListBox(gbLabelDataItem, "", [], 15, 15, 180, 80, undefined, "");
        Generic.createNewImageButton(gbLabelDataItem, "", "image/112_UpArrowLong_Grey_24x24_72.png", 200, 15, 24, 24, function () {
            let n = lstLabelDataItem.selectedIndex;
            if (n == -1) {
                return;
            }
            ;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let selLabel = attrData.nowLabel();
            let dest = n - 1;
            let d1 = selLabel.DataItem[n];
            if (dest == -1) {
                selLabel.DataItem.shift();
                selLabel.DataItem.push(d1);
                dest = selLabel.DataItem.length - 1;
            }
            else {
                let d2 = selLabel.DataItem[dest];
                selLabel.DataItem[n] = d2;
                selLabel.DataItem[dest] = d1;
            }
            lstLabelDataItem.rowUp(n);
        }, "padding:2px");
        Generic.createNewImageButton(gbLabelDataItem, "", "image/112_DownArrowLong_Grey_24x24_72.png", 200, 60, 24, 24, function () {
            let n = lstLabelDataItem.selectedIndex;
            if (n == -1) {
                return;
            }
            ;
            let dest = n + 1;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let selLabel = attrData.nowLabel();
            let d1 = selLabel.DataItem[n];
            if (dest == selLabel.DataItem.length) {
                dest = 0;
                selLabel.DataItem.splice(0, 0, d1);
                selLabel.DataItem.pop();
            }
            else {
                let d2 = selLabel.DataItem[dest];
                selLabel.DataItem[n] = d2;
                selLabel.DataItem[dest] = d1;
            }
            lstLabelDataItem.rowDown(n);
        }, "padding:2px");
        Generic.createNewButton(gbLabelDataItem, "追加", "", 250, 15, function (e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let selLabel = attrData.nowLabel();
            let preAsta = [];
            for (let i = 0; i < selLabel.DataItem.length; i++) {
                preAsta.push(selLabel.DataItem[i]);
            }
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            clsSelectData(e, attrData, attrData.TotalData.LV1.SelectedLayer, function (selected, selectedNumber) {
                let adList = [];
                let selN = lstLabelDataItem.length;
                selN = (selN == -1) ? 0 : selN;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let Layernum = attrData.TotalData.LV1.SelectedLayer;
                for (let i = 0; i < selectedNumber.length; i++) {
                    selLabel.DataItem.push(selectedNumber[i]);
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    adList.push({ value: selectedNumber[i], text: attrData.Get_DataTitle(Layernum, selectedNumber[i], true) });
                }
                lstLabelDataItem.addList(adList, selN);
                // @ts-expect-error TS(2345): Argument of type 'any[]' is not assignable to para... Remove this comment to see the full error message
            }, preAsta, true, true, true, true);
        }, "width:70px");
        Generic.createNewButton(gbLabelDataItem, "削除", "", 250, 45, function () {
            let n = lstLabelDataItem.selectedIndex;
            if (n != -1) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowLabel().DataItem.splice(n, 1);
                lstLabelDataItem.removeList(n, 1);
            }
        }, "width:70px");
        Generic.createNewButton(gbLabelDataItem, "すべて削除", "", 250, 75, function () {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.nowLabel().DataItem = [];
            lstLabelDataItem.removeAll();
        }, "width:80px");
        // @ts-expect-error TS(2554): Expected 9 arguments, but got 8.
        Generic.createNewCheckBox(gbLabelDataItem, "データ項目名の表示", "chkLblDataName_Print_Flag", false, 15, 105, 110, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (obj) { attrData.nowLabel().DataName_Print_Flag = obj.checked; });
        // @ts-expect-error TS(2554): Expected 9 arguments, but got 8.
        Generic.createNewCheckBox(gbLabelDataItem, "単位の表示", "chkLblDataValue_Unit_Flag", false, 150, 105, undefined, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (obj) { attrData.nowLabel().DataValue_Unit_Flag = obj.checked; });
        Generic.createNewCheckBox(gbLabelDataItem, "最大幅を超えたら折り返す", "chkLblDataValue_TurnFlag", false, 15, 130, undefined, 
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        function (obj) { attrData.nowLabel().DataValue_TurnFlag = obj.checked; }, "");
        Generic.createNewButton(gbLabelDataItem, "フォント", "", 230, 125, function (e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            clsFontSet(e, attrData.nowLabel().DataValue_Font, function (newFont) { attrData.nowLabel().DataValue_Font = newFont; }, attrData);
        }, "");
        let gbLabelFrame = Generic.createNewFrame(labelView, "gbLabelFrame", "", 0, 365, 350, 40, "枠");
        Generic.createNewWordDivCanvas(gbLabelFrame, "labelFrame", "輪郭線", 10, 10, 40, function (e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            clsLinePatternSet(e, attrData.nowLabel().BorderLine, function (Lpat) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.nowLabel().BorderLine = Lpat;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Draw_Sample_LineBox(e.target, Lpat);
            });
        });
        Generic.createNewTileBox(gbLabelFrame, "labelObjectNameColor", "オブジェクト名背景", clsBase.Tile(), 120, 10, 60, function (e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let mkc = attrData.nowLabel().BorderObjectTile;
            clsTileSet(e, mkc, 
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            function (retTile) { attrData.nowLabel().BorderObjectTile = retTile; });
        });
        Generic.createNewTileBox(gbLabelFrame, "labelDataColor", "データ項目背景", clsBase.Tile(), 240, 10, 50, function (e) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let mkc = attrData.nowLabel().BorderDataTile;
            clsTileSet(e, mkc, 
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            function (retTile) { attrData.nowLabel().BorderDataTile = retTile; });
        });
    }
    /**設定のエラーをチェックして確認ボタンを表示 */
    var Check_Print_err = function () {
        let errButton = document.getElementById("settingWindowBtnPrintError");
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let retV = attrData.Get_PrintError();
        switch (retV.Print_Enable) {
            case enmPrint_Enable.Printable:
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                errButton.setVisibility(false);
                break;
            case enmPrint_Enable.Printable_with_Error:
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                errButton.setVisibility(true);
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                errButton.style.backgroundColor = 'rgba(255, 255, 255, 0)';
                break;
            case enmPrint_Enable.UnPrintable:
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                errButton.setVisibility(true);
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                errButton.style.backgroundColor = 'rgba(255, 0, 0, 200)';
                break;
        }
        //属性検索設定の有無
        let f = false;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        switch (attrData.TotalData.LV1.Print_Mode_Total) {
            case enmTotalMode_Number.DataViewMode: {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                f = attrData.Check_Condition_UMU(attrData.TotalData.LV1.SelectedLayer);
                break;
            }
            case enmTotalMode_Number.OverLayMode: {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let n = attrData.TotalData.TotalMode.OverLay.SelectedIndex;
                // @ts-expect-error TS(2304): Cannot find name 'i'.
                for (i = 0; i < attrData.TotalData.TotalMode.OverLay.DataSet[n].DataItem.length; i++) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    f = attrData.Check_Condition_UMU(attrData.TotalData.TotalMode.OverLay.DataSet[n].DataItem[i].Layer);
                    if (f == true) {
                        break;
                    }
                }
                break;
            }
            case enmTotalMode_Number.SeriesMode: {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let n = attrData.TotalData.TotalMode.Series.SelectedIndex;
                // @ts-expect-error TS(2304): Cannot find name 'i'.
                for (i = 0; i < attrData.TotalData.TotalMode.Series.DataSet[n].DataItem.length; i++) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let ad = attrData.TotalData.TotalMode.Series.DataSet[n].DataItem[i];
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    switch (attrData.Print_Mode_Total) {
                        case enmTotalMode_Number.DataViewMode: {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            f = attrData.Check_Condition_UMU(ad.Layer);
                            if (f == true) {
                                break;
                            }
                            break;
                        }
                        case enmTotalMode_Number.OverLayMode: {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            for (let j = 0; j < attrData.TotalData.TotalMode.OverLay.DataSet[ad.Data].DataItem.length; j++) { }
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            f = attrData.Check_Condition_UMU(attrData.TotalData.TotalMode.OverLay.DataSet(ad.Data).DataItem[j].Layer);
                            if (f == true) {
                                break;
                            }
                            break;
                        }
                    }
                }
                break;
            }
        }
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        document.getElementById("settingWindowBtnConditionInfo").setVisibility(f);
    };
    /**最初に読み込むファイルがURLパラメータに指定されている */
    function getFirstFile(url) {
        let filename = Generic.getFilename(url);
        let ext = Generic.getExtension(url).toLowerCase();
        if ((ext != "mdrj") && (ext != "mdrmj")) {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            Generic.alert(undefined, filename + "読み込めません。最初に読み込めるのはmdrj、mdrmjファイルのみです。");
            return;
        }
        Generic.readingIcon(filename + "データ読み込み");
        Generic.getMapfileByHttpRequest(url, function (getData) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData = new clsAttrData();
            let mapdata = [];
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let retv = attrData.OpenNewMandaraFile(mapdata, getData, filename, ext);
            if (retv.emes != "") {
                Generic.createMsgBox("読み込みエラー", retv.emes, true);
            }
            if (retv.ok == false) {
                Generic.clear_backDiv();
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                Generic.alert(undefined, "MANDARAデータとして読み込めませんでした。");
            }
            else {
                Generic.clear_backDiv();
                initAfterGetData(true);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                man_Data = attrData.TotalData.LV1.DataSourceType;
            }
        });
    }
};
//属性データ読み込み
/**
 * Description placeholder
 *
 * @param {*} okCall
 */
function readData(okCall) {
    // @ts-expect-error TS(2304): Cannot find name 'contextMenuPrevent'.
    document.body.removeEventListener("contextmenu", contextMenuPrevent);
    let mapList = {};
    // @ts-expect-error TS(2345): Argument of type '() => void' is not assignable to... Remove this comment to see the full error message
    let bbox = Generic.set_backDiv("", "属性データ読み込み", 490, 550, true, true, buttonOK, 0.2, false, true, buttonCancel);
    // @ts-expect-error TS(2304): Cannot find name 'scrMargin'.
    let mapFileFrame = Generic.createNewFrame(bbox, "mapFile", "", 15, scrMargin.top + 5, 450, 140, "使用地図ファイル");
    Generic.createNewSpan(mapFileFrame, "<b>下に地図ファイル(MPFJ)をドロップしてください</b>", "", "", 15, 15, "", "");
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    let mapFileList = new ListBox(mapFileFrame, "", [], 15, 35, 200, 55, undefined, "");
    Generic.createNewButton(mapFileFrame, "地図ファイル追加", "", 230, 50, addMapOn, "");
    Generic.createNewButton(mapFileFrame, "削除", "", 360, 50, deleteMap, "");
    Generic.createNewDiv(mapFileFrame, "※以下の地図ファイルは、読み込み済みのため設定不要です。<br>JAPAN、WORLD、日本緯度経度", "", "", 15, 95, 430, 50, "", "");
    mapFileList.frame.addEventListener('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }, false);
    mapFileList.frame.addEventListener('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files; // FileList object.
        var file = files[0];
        let ext = Generic.getExtension(file.name).toLowerCase();
        if (ext == "mpfj") {
            dropMapFile(file);
        }
        else {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            Generic.alert(undefined, "MANDARAの地図ファイルではありません。拡張子mpfjのファイルをドロップしてください。");
        }
    }, false);
    let dropMapFile = function (file) {
        Generic.readingIcon("地図ファイル読み込み中");
        Generic.unzipFile(file, unzipOk, unzipError);
        function unzipOk(data) {
            let key = Object.keys(data)[0];
            getMapFile(JSON.parse(Generic.utf8ArrayToStr(data[key])), file.name);
            Generic.clear_backDiv();
        }
        function unzipError(err) {
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            getMapFile(undefined);
            Generic.clear_backDiv();
        }
    };
    let dataFileFrame = Generic.createNewFrame(bbox, "dataFile", "", 15, 195, 450, 300, "属性データ");
    let fileIn = Generic.createNewInput(dataFileFrame, "file", "", "", 15, 15, "", "");
    fileIn.accept = ".csv,.mdrj,.mdrmj";
    const cboCodeList = [{ value: 'shift-jis', text: 'シフトJIS' },
        { value: 'utf-8', text: 'UTF-8' }];
    let cboCode = Generic.createNewWordSelect(dataFileFrame, "CSVファイル文字コード", cboCodeList, 0, "cboCode", 270, 8, undefined, 100, 1, undefined, "", "font-size:12px", false);
    let ext = "clipboard";
    let filename = "";
    let mdrjString;
    Generic.createNewSpan(dataFileFrame, "<b>下に属性データを貼り付ける（ctrl+v）、Excelで範囲選択してドラッグ&ドロップ、またはCSV、MDRJ、MDRMJファイルをドロップしてください</b>", "", "", 10, 55, "", "");
    let dataTextArea = Generic.createNewTextarea(dataFileFrame, "", "tArea", 15, 85, 42, 24, "font-size:12px;width:420px;height:170px;resize: none;overflow-x: scroll");
    dataTextArea.wrap = "off";
    // let pasteBtn=Generic.createNewButton(dataFileFrame, "クリップボードから貼り付け", "", 120,270,function(){
    //     navigator.clipboard.readText().then(
    //         clipText => dataTextArea.value= clipText);
    // }, "width:200px");
    // if(navigator.clipboard.readText != undefined){//httpsサイトでないと動作しない
    //     pasteBtn.setVisibility(true);
    // }else{
    //     pasteBtn.setVisibility(false);
    // }
    Generic.createNewButton(dataFileFrame, "クリア", "", 350, 270, btnClear, "width:80px");
    function btnClear() {
        dataTextArea.value = "";
        ext = "clipboard";
    }
    fileIn.addEventListener("change", function (e) {
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        var file = e.target.files[0];
        readAttrData(file);
    }, false);
    dataTextArea.addEventListener('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        e.dataTransfer.dropEffect = 'copy';
    }, false);
    dataTextArea.addEventListener('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        var files = e.dataTransfer.files; // FileList object.
        if (files.length > 0) {
            var file = files[0];
            let ext = Generic.getExtension(file.name).toLowerCase();
            if ((ext == "csv") || (ext == "mdrj") || (ext == "mdrmj")) {
                readAttrData(file);
            }
            else {
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                Generic.alert(undefined, "MANDARAの属性データファイルではありません。拡張子csv,mdrj,mdrmjのファイルをドロップしてください。");
            }
        }
        else {
            //文字列
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            dataTextArea.value = e.dataTransfer.getData("text");
        }
    }, false);
    function readAttrData(file) {
        //ファイル読み込み（ボタン、ドロップ共通）
        Generic.readingIcon("データ読み込み");
        filename = file.name;
        ext = Generic.getExtension(file.name).toLowerCase();
        if ((ext == "mdrj") || (ext == "mdrmj")) {
            Generic.unzipFile(file, unzipOk, unzipError);
            function unzipOk(data) {
                Generic.clear_backDiv();
                let key = Object.keys(data)[0];
                mdrjString = Generic.utf8ArrayToStr(data[key]);
                dataTextArea.value = ext.toUpperCase() + "ファイル: " + file.name;
            }
            function unzipError(err) {
                Generic.clear_backDiv();
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                Generic.alert(undefined, "読み込めませんでした。");
            }
        }
        else {
            //CSVファイルの読込が終了した時の処理
            Generic.clear_backDiv();
            let reader = new FileReader();
            let wcode = cboCode.value;
            reader.readAsText(file, wcode); //文字コード重要
            reader.onload = function (evt) {
                // @ts-expect-error TS(2322): Type 'string | ArrayBuffer | null' is not assignab... Remove this comment to see the full error message
                dataTextArea.value = reader.result;
            };
        }
    }
    //地図ファイル追加
    function addMapOn() {
        openMapFile(getMapFile);
    }
    function getMapFile(jsonMapData, mapFilename) {
        if (jsonMapData == undefined) {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            Generic.alert(undefined, "読み込めませんでした。");
            return;
        }
        let key = Object.keys(mapList);
        let fu = mapFilename.toUpperCase();
        if (key.indexOf(fu) != -1) {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            Generic.alert(undefined, mapFilename + "は既に読み込まれています。");
            return;
        }
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let mapdata = new clsMapdata();
        mapdata.openJsonMapData(jsonMapData);
        mapdata.Map.filename = mapFilename;
        if (key.length > 0) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            let z = mapList[key[0]].Map.Zahyo;
            let retv = spatial.Check_Zahyo_Projection_Convert_Enabled(z, mapdata.Map.Zahyo);
            if (retv.ok == false) {
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                Generic.alert(undefined, mapFilename + "は既存の読み込み地図ファイルと座標系が異なります。");
                return;
            }
        }
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        mapList[mapFilename.toUpperCase()] = mapdata;
        mapFileList.addList([{ value: fu, text: mapFilename }], mapFileList.length, false, false);
    }
    //選択した地図ファイル削除
    function deleteMap() {
        let n = mapFileList.selectedIndex;
        if (n == -1) {
            return;
        }
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        delete mapList[mapFileList.getValue()];
        mapFileList.removeList(n, 1);
    }
    function buttonCancel() {
        // @ts-expect-error TS(2304): Cannot find name 'contextMenuPrevent'.
        document.body.addEventListener("contextmenu", contextMenuPrevent);
    }
    function buttonOK() {
        // @ts-expect-error TS(2339): Property 'length' does not exist on type '{}'.
        if (mapList.length == 0) {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            Generic.alert(undefined, "地図ファイルを設定してください。");
            return;
        }
        let attrText = dataTextArea.value;
        if (attrText == "") {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            Generic.alert(undefined, "属性データを設定してください。");
            return;
        }
        let mdata = [];
        for (let i in mapList) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            mdata.push(mapList[i]);
        }
        Generic.clear_backDiv();
        if ((ext == "mdrj") || (ext == "mdrmj")) {
            okCall(mdata, mdrjString, filename, ext);
        }
        else {
            okCall(mdata, attrText, filename, ext);
        }
        // @ts-expect-error TS(2304): Cannot find name 'contextMenuPrevent'.
        document.body.addEventListener("contextmenu", contextMenuPrevent);
    }
}
//シェープファイル読み込み
/**
 * Description placeholder
 *
 * @param {*} okCall
 */
function openShapeFile(okCall) {
    let shapeFiles = []; //clsShapefile
    var bbox = Generic.set_backDiv("", "シェープファイル読み込み", 630, 320, true, true, buttonOK, 0.2, false);
    // @ts-expect-error TS(2304): Cannot find name 'scrMargin'.
    let fileFrame = Generic.createNewFrame(bbox, "", "", 15, scrMargin.top + 5, 340, 200, "読み込むシェープファイル");
    const cboCodeList = [{ value: 'shift-jis', text: 'シフトJIS' },
        { value: 'utf-8', text: 'UTF-8' }];
    let cboCode = Generic.createNewWordSelect(fileFrame, "dbfファイル文字コード", cboCodeList, 0, "cboCode", 15, 15, 140, 100, 0, undefined, "", "", false);
    Generic.createNewDiv(fileFrame, "<b>下にシェープファイル1式（shp,shx,dbf,prjファイル）ずつ（またはzip圧縮ファイル）ドロップしてください</b>", "", "", 15, 45, 310, 50, "", "");
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    let fileList = new ListBox(fileFrame, "", [], 15, 90, 220, 95, setShapeFileInfo, "");
    Generic.createNewButton(fileFrame, "削除", "", 250, 120, deleteFile, "");
    Generic.createNewButton(fileFrame, "全削除", "", 250, 150, deleteAllFile, "");
    // @ts-expect-error TS(2304): Cannot find name 'scrMargin'.
    let infoFrame = Generic.createNewFrame(bbox, "", "", 370, scrMargin.top + 5, 245, 220, "シェープファイル情報");
    // @ts-expect-error TS(2554): Expected 10 arguments, but got 9.
    let infoFileName = Generic.createNewDiv(infoFrame, "ファイル名", "", "", 15, 10, 215, 20, "overflow:hidden;text-overflow:ellipsis;white-space:nowrap;");
    // @ts-expect-error TS(2554): Expected 10 arguments, but got 9.
    let relatedFile = Generic.createNewDiv(infoFrame, "関連ファイル", "", "grayFrame", 15, 30, 200, 50, "padding:5px;");
    let zahyoModeFrame = Generic.createNewFrame(infoFrame, "", "", 15, 100, 100, 100, "座標系");
    const ZahyoSystemList = [{ value: enmZahyo_mode_info.Zahyo_Ido_Keido, text: "緯度経度" },
        { value: enmZahyo_mode_info.Zahyo_HeimenTyokkaku, text: "平面直角" },
        { value: enmZahyo_mode_info.Zahyo_No_Mode, text: "その他" }];
    Generic.createNewRadioButtonList(zahyoModeFrame, "zahyoMode", ZahyoSystemList, 10, 10, undefined, 22, undefined, zahyoModeFrameChange, "");
    let lst = document.getElementById("radiozahyoMode2");
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    lst.style.top = (lst.offsetTop + 17).px();
    let lsts = document.getElementById("divradiozahyoMode2");
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    lsts.style.top = (lsts.offsetTop + 20).px();
    let keiNo = [];
    for (let i = 1; i <= 19; i++) {
        keiNo.push({ value: i, text: i.toString() });
    }
    let cboKeiNo = Generic.createNewSelect(zahyoModeFrame, keiNo, 0, "cboKeiNo", 50, 50, false, keiChange, "");
    let zahyoSystemFrame = Generic.createNewFrame(infoFrame, "", "", 125, 100, 110, 100, "測地系");
    const ZahyoModeList = [{ value: enmZahyo_System_Info.Zahyo_System_tokyo, text: "日本測地系" },
        { value: enmZahyo_System_Info.Zahyo_System_World, text: "世界測地系" },
        { value: enmZahyo_System_Info.Zahyo_System_No, text: "その他・不明" }];
    Generic.createNewRadioButtonList(zahyoSystemFrame, "zahyoSystem", ZahyoModeList, 10, 10, undefined, 22, undefined, zahyoSystemFrameChange, "");
    // @ts-expect-error TS(2339): Property 'setVisibility' does not exist on type 'H... Remove this comment to see the full error message
    infoFrame.setVisibility(false);
    let chkTopology = Generic.createNewCheckBox(bbox, "位相構造化", "", false, 30, 260, 120, undefined, "");
    let cboProjection = Generic.createNewWordSelect(bbox, "読み込み後の投影法", Generic.getProjectionList(), 0, "cboProjection", 150, 260, undefined, 150, 1, undefined, "", "", false);
    function keiChange(obj, sel, v) {
        let fileKey = fileList.getValue();
        let zahyo = shapeFiles[fileKey].shape.getMapZahyo();
        zahyo.HeimenTyokkaku_KEI_Number = v;
        shapeFiles[fileKey].shape.setMapZahyo(zahyo);
    }
    function zahyoModeFrameChange(v) {
        let fileKey = fileList.value;
        let zahyo = shapeFiles[fileKey].shape.getMapZahyo();
        zahyo.Mode = v;
        shapeFiles[fileKey].shape.setMapZahyo(zahyo);
    }
    function zahyoSystemFrameChange(v) {
        let fileKey = fileList.value;
        let zahyo = shapeFiles[fileKey].shape.getMapZahyo();
        zahyo.System = v;
        shapeFiles[fileKey].shape.setMapZahyo(zahyo);
    }
    fileList.frame.addEventListener('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }, false);
    fileList.frame.addEventListener('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
        let files = e.dataTransfer.files; // FileList object.
        dropShapeFiles(files);
    }, false);
    let dropShapeFiles = function (files) {
        //ファイル読み込み（ドロップ）
        let sFiles = [];
        let er = "";
        let er_sub = "";
        // @ts-expect-error TS(2339): Property 'getValue' does not exist on type 'HTMLSe... Remove this comment to see the full error message
        let encode = cboCode.getValue();
        let firstSel = fileList.length;
        let n = 0;
        for (let i = 0; i < files.length; i++) {
            if (Generic.getExtension(files[i].name).toLowerCase() == "zip") {
                n++;
            }
        }
        if (n >= 2) {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            Generic.alert(undefined, "ZIPファイルは1つずつドラッグしてください。");
            return;
        }
        else if (n == 1) {
            zipShape(files[0]);
            return;
        }
        for (let i = 0; i < files.length; i++) {
            checkSFiles(files[i], false);
        }
        checkSFiles2();
        if (er != '') {
            return;
        }
        let key = Object.keys(sFiles)[0];
        sFiles[key].shape.fileRead(sFiles[key].files, encode, key, onOk, onError);
        function onOk(tag) {
            let lst = [{ value: tag, text: tag + ".shp" }];
            fileList.addList(lst, firstSel);
            shapeFiles[tag] = sFiles[tag];
            setShapeFileInfo();
        }
        function onError(tag) {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            Generic.alert(undefined, tag + "は読み込めませんでした。");
        }
        /**zipされたシェープファイル */
        function zipShape(zipFile) {
            Generic.unzipFile(zipFile, zipSOK, zipSErr);
            function zipSOK(unZipData) {
                for (let filename in unZipData) {
                    checkSFiles(filename, true);
                }
                checkSFiles2();
                if (er != '') {
                    return;
                }
                let key = Object.keys(sFiles)[0];
                sFiles[key].shape.fileReadZip(unZipData, encode, key, onOk);
            }
            function zipSErr() {
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                Generic.alert(undefined, zipFile.name + "は読み込めませんでした。");
            }
        }
        function checkSFiles(file, zipF) {
            let ext = (zipF == true ? Generic.getExtension(file).toLowerCase() : Generic.getExtension(file.name).toLowerCase());
            let fname = (zipF == true ? Generic.getFilenameWithoutExtension(file) : Generic.getFilenameWithoutExtension(file.name));
            switch (ext) {
                case 'shp':
                case 'shx':
                case 'prj':
                case 'dbf':
                    if (sFiles[fname] == undefined) {
                        // @ts-expect-error TS(2304): Cannot find name 'clsShapefile'.
                        sFiles[fname] = { shp: false, prj: false, dbf: false, shx: false, files: [], shape: new clsShapefile };
                    }
                    switch (ext) {
                        case 'shp':
                            sFiles[fname].shp = true;
                            sFiles[fname].files.push(file);
                            break;
                        case 'shx':
                            sFiles[fname].shx = true;
                            sFiles[fname].files.push(file);
                            break;
                        case 'prj':
                            sFiles[fname].prj = true;
                            sFiles[fname].files.push(file);
                            break;
                        case 'dbf':
                            sFiles[fname].dbf = true;
                            sFiles[fname].files.push(file);
                            break;
                    }
                    break;
                default:
                    let fn = (zipF == true ? file : file.name);
                    er_sub += fn + "は読み込めません。" + '\n';
                    break;
            }
        }
        function checkSFiles2() {
            for (let i in sFiles) {
                let s = sFiles[i];
                if (s.shp == false) {
                    er += i + "はshpファイルがありません。" + '\n';
                }
                if (s.shx == false) {
                    er += i + "はshxファイルがありません。" + '\n';
                }
                if (s.dbf == false) {
                    er += i + "はdbfファイルがありません。" + '\n';
                }
            }
            if (Object.keys(sFiles).length > 1) {
                er += "シェープファイルは1セットずつ追加して下さい。" + '\n';
            }
            if (shapeFiles[Object.keys(sFiles)[0]]) {
                er += Object.keys(sFiles)[0] + "は設定済みです。" + '\n';
            }
            if ((er != '') || (er_sub != '')) {
                Generic.createMsgBox("エラー", er + er_sub, false);
            }
        }
    };
    //シェープファイル情報
    function setShapeFileInfo() {
        let fileKey = fileList.value;
        if (fileKey == undefined) {
            // @ts-expect-error TS(2339): Property 'setVisibility' does not exist on type 'H... Remove this comment to see the full error message
            infoFrame.setVisibility(false);
            return;
        }
        else {
            // @ts-expect-error TS(2339): Property 'setVisibility' does not exist on type 'H... Remove this comment to see the full error message
            infoFrame.setVisibility(true);
        }
        let data = shapeFiles[fileKey];
        infoFileName.innerHTML = fileKey + ".shp";
        let tx = "";
        if (data.shp == true) {
            tx += "shpファイル：あり　";
        }
        else {
            tx += "shpファイル：なし　";
        }
        ;
        if (data.shx == true) {
            tx += "shxファイル：あり　";
        }
        else {
            tx += "shxファイル：なし　";
        }
        ;
        if (data.dbf == true) {
            tx += "<br>dbfファイル：あり　";
        }
        else {
            tx += "<br>dbfファイル：なし";
        }
        ;
        if (data.prj == true) {
            tx += "prj ファイル：あり";
        }
        else {
            tx += "prj ファイル：なし";
        }
        ;
        relatedFile.innerHTML = tx;
        let zahyo;
        let zahyoGet = data.shape.getZahyoSettingFlag();
        Generic.setDisabled(zahyoModeFrame, zahyoGet);
        Generic.setDisabled(zahyoSystemFrame, zahyoGet);
        zahyo = data.shape.getMapZahyo();
        Generic.checkRadioByValue('zahyoSystem', zahyo.System);
        Generic.checkRadioByValue('zahyoMode', zahyo.Mode);
        // @ts-expect-error TS(2339): Property 'setSelectValue' does not exist on type '... Remove this comment to see the full error message
        cboKeiNo.setSelectValue(zahyo.HeimenTyokkaku_KEI_Number);
    }
    function getFile(jsonMapData, filename) {
        // @ts-expect-error TS(2304): Cannot find name 'mapList'.
        let key = Object.keys(mapList);
        let fu = filename.toUpperCase();
        if (key.indexOf(fu) != -1) {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            Generic.alert(undefined, filename + "は既に読み込まれています。");
            return;
        }
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let mapdata = new clsMapdata();
        mapdata.openJsonMapData(jsonMapData);
        mapdata.Map.filename = filename;
        if (key.length > 0) {
            // @ts-expect-error TS(2304): Cannot find name 'mapList'.
            let z = mapList[key[0]].Map.Zahyo;
            let retv = spatial.Check_Zahyo_Projection_Convert_Enabled(z, mapdata.Map.Zahyo);
            if (retv.ok == false) {
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                Generic.alert(undefined, filename + "は既存の読み込み地図ファイルと座標系が異なります。");
                return;
            }
        }
        // @ts-expect-error TS(2304): Cannot find name 'mapList'.
        mapList[filename.toUpperCase()] = mapdata;
        fileList.addSelectList([{ value: fu, text: filename }], fileList.options.length);
        // @ts-expect-error TS(2304): Cannot find name 'useMapList'.
        useMapList.addSelectList([{ value: fu, text: filename }], useMapList.options.length, false, false);
        // @ts-expect-error TS(2304): Cannot find name 'layerFrame'.
        Generic.setDisabled(layerFrame, false);
        // @ts-expect-error TS(2304): Cannot find name 'AddLayer'.
        AddLayer();
    }
    function deleteFile() {
        delete shapeFiles[fileList.value];
        let n = fileList.selectedIndex;
        fileList.removeList(n, 1);
        setShapeFileInfo();
    }
    function deleteAllFile() {
        fileList.removeAll();
        shapeFiles = [];
        setShapeFileInfo();
    }
    function buttonOK() {
        let mapList = {};
        let LayerData = []; //strLayerInfo
        // @ts-expect-error TS(2339): Property 'getValue' does not exist on type 'HTMLSe... Remove this comment to see the full error message
        let prj = parseInt(cboProjection.getValue());
        for (let i in shapeFiles) {
            let sfile = shapeFiles[i];
            let newMapData = sfile.shape.convertToMapfile(prj, true);
            newMapData.init_Compass_First();
            if (chkTopology.checked == true) {
                newMapData.TopologyStructure_SameLine();
            }
            let key = i.toUpperCase();
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            mapList[key] = newMapData;
            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
            let d = new strLayerInfo();
            d.Time = clsTime.GetYMD(new Date());
            d.Shape = sfile.shape.getShape();
            d.MapfileName = i;
            d.Name = "レイヤ" + d.MapfileName;
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            let okn = mapList[key].Map.OBKNum;
            d.UseObjectKind = (new Array(okn)).fill(false);
            d.UseObjectKind[0] = true;
            LayerData.push(d);
        }
        let mdata = [];
        for (let i in mapList) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            mdata.push(mapList[i]);
        }
        Generic.clear_backDiv();
        okCall(mdata, LayerData);
    }
}
/** 白地図・初期属性データ表示 */
function mapViewer(okCall) {
    let mapList = {};
    let LayerData = []; //strLayerInfo
    var bbox = Generic.set_backDiv("", "白地図・初期属性データ表示", 600, 410, true, true, buttonOK, 0.2, false);
    // @ts-expect-error TS(2304): Cannot find name 'scrMargin'.
    let fileFrame = Generic.createNewFrame(bbox, "file", "", 15, scrMargin.top + 5, 450, 100, "地図ファイル");
    Generic.createNewSpan(fileFrame, "<b>下に地図ファイル(MPFJ)をドロップしてください</b>", "", "", 15, 15, "", "");
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    let fileList = new ListBox(fileFrame, "", [], 15, 35, 200, 55, undefined, "");
    Generic.createNewButton(fileFrame, "地図ファイル追加", "", 230, 50, addMapOn, "");
    Generic.createNewButton(fileFrame, "削除", "", 360, 50, deleteMap, "");
    let layerFrame = Generic.createNewFrame(bbox, "", "", 15, 150, 560, 205, "レイヤ");
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    let layerList = new ListBox(layerFrame, "", [], 15, 15, 200, 130, layerListOnChange, "");
    Generic.createNewButton(layerFrame, "レイヤ追加", "", 15, 160, AddLayer, "width:90px");
    Generic.createNewButton(layerFrame, "削除", "", 120, 160, deleteLayer, "width:80px");
    let eachLayerFrame = Generic.createNewFrame(layerFrame, "", "", 225, 5, 320, 180, "レイヤごとの設定");
    Generic.createNewSpan(eachLayerFrame, "レイヤ名", "", "", 15, 15, "", "");
    let layerNameBox = Generic.createNewInput(eachLayerFrame, "text", "", "", 15, 35, "", "width:150px");
    layerNameBox.onchange = layerNameChange;
    Generic.createNewWordWidthDiv(eachLayerFrame, "", "表示するオブジェクトグループ", 15, 63, 22, 150, undefined);
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    let objGList = new CheckedListBox(eachLayerFrame, "", [], 15, 90, 150, 80, false, objGListChange, "");
    Generic.createNewSpan(eachLayerFrame, "使用する地図ファイル", "", "", 180, 15, "", "");
    let useMapList = Generic.createNewSelect(eachLayerFrame, undefined, 0, "", 180, 35, false, useMapListChange, "width:130px;");
    Generic.createNewSpan(eachLayerFrame, "時期設定", "", "", 180, 60, "", "");
    let layerTime = Generic.createNewInput(eachLayerFrame, "date", "", "", 180, 80, "", "width:130px");
    layerTime.onchange = layerTimeChange;
    Generic.setDisabled(layerFrame, true);
    fileList.frame.addEventListener('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }, false);
    fileList.frame.addEventListener('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files; // FileList object.
        var file = files[0];
        if (Generic.getExtension(file.name).toLowerCase() != "mpfj") {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            Generic.alert(undefined, "地図ファイルではありません。拡張子mpfjのファイルをドロップしてください。");
        }
        else {
            dropMapFile(file);
        }
    }, false);
    let dropMapFile = function (file) {
        Generic.readingIcon("地図ファイル読み込み中");
        Generic.unzipFile(file, unzipOk, unzipError);
        function unzipOk(data) {
            let key = Object.keys(data)[0];
            let tx = JSON.parse(Generic.utf8ArrayToStr(data[key]));
            getFile(tx, file.name);
            Generic.clear_backDiv();
        }
        function unzipError(err) {
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            getFile(undefined);
            Generic.clear_backDiv();
        }
    };
    function addMapOn() {
        openMapFile(getFile);
    }
    function getFile(jsonMapData, filename) {
        if (jsonMapData == undefined) {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            Generic.alert(undefined, "読み込めませんでした。");
            return;
        }
        let key = Object.keys(mapList);
        let fu = filename.toUpperCase();
        if (key.indexOf(fu) != -1) {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            Generic.alert(undefined, filename + "は既に読み込まれています。");
            return;
        }
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let mapdata = new clsMapdata();
        mapdata.openJsonMapData(jsonMapData);
        mapdata.Map.FileName = filename;
        if (key.length > 0) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            let z = mapList[key[0]].Map.Zahyo;
            let retv = spatial.Check_Zahyo_Projection_Convert_Enabled(z, mapdata.Map.Zahyo);
            if (retv.ok == false) {
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                Generic.alert(undefined, filename + "は既存の読み込み地図ファイルと座標系が異なります。");
                return;
            }
        }
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        mapList[filename.toUpperCase()] = mapdata;
        fileList.addList([{ value: fu, text: filename }], fileList.length);
        // @ts-expect-error TS(2339): Property 'addSelectList' does not exist on type 'H... Remove this comment to see the full error message
        useMapList.addSelectList([{ value: fu, text: filename }], useMapList.options.length, false, false);
        Generic.setDisabled(layerFrame, false);
        AddLayer();
    }
    function AddLayer() {
        let n = LayerData.length;
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let d = new strLayerInfo();
        d.Time = clsTime.GetYMD(new Date());
        d.MapfileName = fileList.getText();
        d.Name = "レイヤ" + d.MapfileName;
        let key = d.MapfileName.toUpperCase();
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        let okn = mapList[key].Map.OBKNum;
        d.UseObjectKind = (new Array(okn)).fill(false);
        d.UseObjectKind[0] = true;
        Generic.setDisabled(eachLayerFrame, false);
        layerList.addList([{ value: "", text: d.Name }], n, false, false);
        LayerData[n] = d;
        layerListOnChange();
    }
    //レイヤの選択変更
    function layerListOnChange() {
        let n = layerList.selectedIndex;
        if (n == -1) {
            if (layerList.length == 0) {
                Generic.setDisabled(eachLayerFrame, true);
                return;
            }
            else {
                layerList.setSelectedIndex(0);
                n = 0;
            }
        }
        let d = LayerData[n];
        // @ts-expect-error TS(2339): Property 'setSelectText' does not exist on type 'H... Remove this comment to see the full error message
        useMapList.setSelectText(d.MapfileName);
        layerNameBox.value = d.Name;
        checkTime();
        resetObjKind();
    }
    //レイヤの地図ファイルが時間モードか
    function checkTime() {
        let n = layerList.selectedIndex;
        if (n == -1) {
            return;
        }
        let d = LayerData[n];
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        if (mapList[d.MapfileName.toUpperCase()].Map.Time_Mode == true) {
            layerTime.disabled = false;
            layerTime.value = d.Time.toInputDate();
        }
        else {
            layerTime.disabled = true;
        }
    }
    //レイヤのオブジェクトグループのリスト設定
    function resetObjKind() {
        let n = layerList.selectedIndex;
        if (n == -1) {
            return;
        }
        let d = LayerData[n];
        let key = d.MapfileName.toUpperCase();
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        let okn = mapList[key].Map.OBKNum;
        let tx = [];
        for (let i = 0; i < okn; i++) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            let str = mapList[key].ObjectKind[i].Name;
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            str += "(" + Generic.ConvertShapeEnumString(mapList[key].ObjectKind[i].Shape) + ")";
            tx.push({ text: str, checked: d.UseObjectKind[i] });
        }
        objGList.removeAll();
        objGList.addList(tx, 0);
    }
    //選択した地図ファイル削除
    function deleteMap() {
        let n = fileList.selectedIndex;
        if (n == -1) {
            return;
        }
        let delMapfile = fileList.getText();
        for (let i in LayerData) {
            if (LayerData[i].MapfileName == delMapfile) {
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                Generic.alert(undefined, delMapfile + "は使用されています。");
                return;
            }
        }
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        delete mapList[fileList.getValue()];
        fileList.removeList(n, 1);
        useMapList.remove(n);
    }
    //レイヤ削除
    function deleteLayer() {
        let n = layerList.selectedIndex;
        if (n == -1) {
            return;
        }
        LayerData.splice(n, 1);
        layerList.removeList(n, 1);
        // Generic.ListIndex_Reset(layerList, n);
        layerListOnChange();
    }
    //レイヤ名の変更
    function layerNameChange(e) {
        let n = layerList.selectedIndex;
        LayerData[n].Name = e.target.value;
        layerList.setText(n, e.target.value);
    }
    //レイヤのオブジェクトグループ変更
    function objGListChange(obj, checkList, checkArray) {
        let n = layerList.selectedIndex;
        LayerData[n].UseObjectKind.fill(false);
        for (let i = 0; i < checkArray.length; i++) {
            LayerData[n].UseObjectKind[checkArray[i]] = true;
        }
    }
    //レイヤの地図ファイル変更
    function useMapListChange(obj, sel, v) {
        let n = layerList.selectedIndex;
        // @ts-expect-error TS(2339): Property 'getText' does not exist on type 'HTMLSel... Remove this comment to see the full error message
        LayerData[n].MapfileName = useMapList.getText();
        // @ts-expect-error TS(2339): Property 'getText' does not exist on type 'HTMLSel... Remove this comment to see the full error message
        let key = useMapList.getText().toUpperCase();
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        let okn = mapList[key].Map.OBKNum;
        LayerData[n].UseObjectKind = (new Array(okn)).fill(false);
        checkTime();
        resetObjKind();
    }
    //レイヤの時間変更
    function layerTimeChange() {
        let n = layerList.selectedIndex;
        LayerData[n].Time = clsTime.GetFromInputDate(layerTime.value);
    }
    function buttonOK() {
        if (LayerData.length == 0) {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            Generic.alert(undefined, "レイヤが設定されていません。");
            return;
        }
        for (let i in LayerData) {
            let LD = LayerData[i];
            let key = LD.MapfileName.toUpperCase();
            let f1 = false;
            for (let j in LD.UseObjectKind) {
                if (LD.UseObjectKind[j] == true) {
                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    LD.Shape = mapList[key].ObjectKind[j].Shape;
                    f1 = true;
                    break;
                }
            }
            if (f1 == false) {
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                Generic.alert(undefined, "レイヤ" + LD.Name + "で表示するオブジェクトクループが設定されていません。");
                return;
            }
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            let emes = mapList[key].Check_Selected_ObjectGroup_Same(LD.UseObjectKind, false, false);
            if (emes != "") {
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                Generic.alert(undefined, emes);
                return;
            }
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            if (mapList[key].Map.Time_Mode == false) {
                LD.Time = clsTime.GetNullYMD();
            }
        }
        let mdata = [];
        for (let i in mapList) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            mdata.push(mapList[i]);
        }
        Generic.clear_backDiv();
        okCall(mdata, LayerData);
    }
}
