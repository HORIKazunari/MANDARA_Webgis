// MANDARA GIS Application - 型定義ファイル（強化版）

// ==================== グローバル変数の型定義強化 ====================

// GlobalEventHandlers拡張
interface GlobalEventHandlers {
    innerText?: string;
    tag?: any;
}

// EventTarget拡張
interface EventTarget {
    offsetLeft: number;
    offsetTop: number;
    offsetWidth: number;
    offsetHeight: number;
}

// ParentNode拡張
interface ParentNode {
    style: CSSStyleDeclaration;
}

// 属性データクラス（拡張版）
interface IAttrData {
    TotalData: {
        LV1?: {
            SelectedLayer?: number;
            Lay_Maxn?: number;
            Print_Mode_Total?: number;
            DataSourceType?: number;
            Comment?: string;
            FileName?: string;
            FullPath?: string;
        };
        Condition?: any;
        TotalMode?: {
            OverLay?: {
                SelectedIndex?: number;
                DataSet?: any[];
                Always_Overlay_Index?: number;
                MarkModePosFixFlag?: boolean;
                AddDataSet?: (data?: any) => void;
            };
            Series?: {
                SelectedIndex?: number;
                DataSet?: any[];
                AddDataSet?: (data?: any) => void;
            };
        };
        ViewStyle: {
            Clone?: () => any;
            Dummy_Size_Flag?: boolean;
            ScrData: {
                frmPrint_FormSize: rectangle;
                ScrView?: rectangle;
                MapScreen_Scale?: size;
                MapRectangle?: rectangle;
                MapRectanglem?: rectangle;
                getSXSY_Margin?: () => rectangle;
                getSRXY?: (p: point) => point;
                getSxSy?: (arg1: any, arg2?: any) => any;
                getSRXYfromRatio?: (arg1: any) => any;
                Get_SxSy_With_3D?: (arg1?: any, arg2?: any, arg3?: any) => any;
                ThreeDMode?: {
                    Set3D_F: boolean;
                    Pitch?: number;
                    Head?: number;
                    Bank?: number;
                };
                Accessory_Base?: number;
                OutputDevide?: any;
                SampleBoxFlag?: boolean;
                Set_PictureBox_and_CulculateMul?: (arg1?: any) => any;
                ScrRectangle?: rectangle;
                Screen_Margin?: any;
                getSxSyRect?: (arg1?: any) => rectangle;
                Get_Length_On_Screen?: (arg1?: any) => number;
                ScreenMG?: any;
                Clone?: () => any;
                init?: (sz?: any, margin?: any, mapRect?: any, accessoryBase?: any, clearFlag?: boolean) => void;
            };
            AttMapCompass?: any;
            MapLegend: {
                Base: {
                    ModeValueInScreenFlag: boolean;
                    LegendXY?: any;
                    Font?: any;
                    Visible?: boolean;
                    Back?: any;
                    Comma_f?: boolean;
                    Legend_Num?: number;
                };
                Line_DummyKind?: any;
                OverLay_Legend_Title?: any;
                En_Graph_Pattern?: number;
                MarkMD?: {
                    CircleMD_CircleMini_F?: boolean;
                    MultiEnMode_Line?: any;
                    CircleMDLegendLine?: number;
                };
                ClassMD?: {
                    SeparateGapSize?: number;
                    ClassMarkFrame_Visible?: boolean;
                    PaintMode_Line?: any;
                    FrequencyPrint?: boolean;
                    SeparateClassWords?: number;
                    PaintMode_Method?: number;
                    CategorySeparate_f?: boolean;
                    PaintMode_Width?: number;
                    ClassBoundaryLine?: any;
                };
            };
            MapTitle?: {
                Position: any;
                Visible?: boolean;
                Font?: any;
                Clone?: () => any;
                Back?: any;
            };
            MapScale?: {
                Position: any;
                Visible?: boolean;
                Clone?: () => any;
                BarDistance?: number;
                BarKugiriNum?: number;
                Back?: any;
                Unit?: number;
            };
            DataNote?: {
                Position: any;
                Visible?: boolean;
                Font?: any;
                Clone?: () => any;
            };
            AccessoryGroupBox?: any;
            Zahyo: {
                Mode: number;
                Projection: number;
                CenterXY: point;
            };
            TileMapView: {
                Visible: boolean;
                DrawTiming?: any;
                TileMapDataSet?: any;
                AlphaValue?: number;
            };
            Missing_Data?: any;
            SouByou?: any;
            DummyObjectPointMark?: any;
            Screen_Back?: any;
            PointPaint_Order?: any;
            ValueShow?: any;
            InVisibleObjectBoundaryF?: boolean;
            MeshLine?: any;
            SymbolLine?: any;
            LatLonLine_Print?: {
                Lat_Interval?: number;
                Lon_Interval?: number;
                LPat?: any;
                OuterPat?: any;
                Equator?: any;
                Order?: number;
                Visible?: boolean;
            };
        };
    };
    TempData: {
        frmPrint_Temp: {
            PrintMouseMode: number;
            image?: ImageData;
            mouseAccesoryDragType?: number;
            OD_Drag?: {
                ObjectPos: any;
                Data: any;
            };
            OnObject?: any;
            OldObject?: any;
            SymbolPointFirstMessage?: boolean;
            LabelPointFirstMessage?: boolean;
            LocationMenuString?: any;
            MultiObjects?: any[];
        };
        Accessory_Temp?: any;
        OnObject?: any;
        MouseDownF?: boolean;
        PrintMouseMode?: number;
        PointObjectKindUsedStack?: any;
        MapAreaLatLon?: any;
        ContourMode_Temp?: any;
        DotMap_Temp?: any;
        Series_temp?: any;
        OverLay_Temp?: any;
        drawing?: any;
        SoubyouLinePointIntervalCriteria?: any;
        SoubyouLoopAreaCriteria?: any;
        DataSourceType?: number;
        InVisibleObjectBoundaryF?: boolean;
        ModeValueInScreen_Stac?: any;
        ObjectPrintedCheckFlag?: any;
    };
    LayerData?: any;
    // メソッド
    Get_AllMapLineKind?: () => any;
    Get_LineKindUsedList?: () => any;
    Get_Length_On_Screen?: (arg1?: any) => any;
    Radius?: any;
    Draw_Line?: (arg1: any, arg2: any, arg3?: any, arg4?: any) => any;
    Draw_Print?: (arg1: any, arg2: any, arg3?: any, arg4?: any, arg5?: any, arg6?: any) => any;
    Draw_Mark?: (arg1: any, arg2: any, arg3?: any, arg4?: any) => any;
    Get_DataUnit_With_Kakko?: (arg1?: any, arg2?: any) => any;
    Get_PrintError?: () => any;
    Get_Condition_Info?: (layer?: any) => any;
    Get_Condition_Ok_Num_Info?: (layer?: any) => any;
    Get_ObjectNum?: (layer?: any) => any;
    Check_Condition?: (layer?: any, index?: any) => any;
    Get_KenObjName?: (layer?: any, index?: any) => any;
    getSoloMode?: (arg1?: any, arg2?: any) => any;
    setSoloMode?: (arg1: any, arg2?: any, arg3?: any) => any;
    Get_DataTitle?: (arg1?: any, arg2?: any, arg3?: any) => any;
    Get_SelectedDataTitle?: () => any;
    nowGraph?: any;
    nowLabel?: any;
    ResetMPSubLineXY?: () => any;
    ResetObjectPrintedCheckFlag?: () => any;
    check_AutoSoubyou_Enable?: (arg1?: any, arg2?: any) => any;
    layerGraph?: any;
    layerLabel?: any;
    Check_Screen_In?: (CenterP: any, R?: any) => boolean;
    Draw_Tile_RoundBox?: (context: any, rect: any, style?: any, arg4?: any) => void;
    Convert_Zahyo?: (zahyo: any) => void;
    GetMapFileName?: () => string[];
    SetMapFile?: (filename: string) => any;
    Check_Vector_Object?: () => void;
    PrtObjectSpatialIndex?: () => void;
    SetMapViewerData?: (data: any, arg2?: any, arg3?: any) => { ok: boolean; emes: string };
    OpenNewMandaraFile?: (filename: string, callback?: any, options?: any, layer?: any) => { ok: boolean; emes: string };
    ADD_AttrData?: (data: any, flag?: boolean) => { ok: boolean; emes: string };
    Set_LayerName_to?: (selbox: any, SelectedIndex?: number, NormalF?: boolean, syntheticF?: boolean, PointF?: boolean, MeshF?: boolean) => void;
    Set_ObjectName_to_selectBox?: (selbox: any, Layernum?: number, SelectedObject?: number) => void;
    MapData?: any;
    DeleteObjects?: (objects: any, arg2?: any) => void;
    Set_DataTitle_to_cboBox?: (cbox: any, Layernum?: number, SelectedIndex?: number, Number_Print_F?: boolean, Normal_F?: boolean, Category_f?: boolean, String_f?: boolean, Special_Astarisk_Num?: number) => void;
    Set_ObjectName_to_checkedListBox?: (selectElement: any, layerNum?: number, selectedObject?: any) => void;
    getDummyObjGroupArray?: (Layernum?: any, shape?: any) => { DummyOBGArray: boolean[]; trueNum: number };
    Get_MedianValue?: (layer?: any, data?: any) => number;
    nowLayer?: () => any;
    Screen_Back?: any;
    Draw_Tile_Box?: (context: any, rect: rectangle, arg3?: any, arg4?: any, arg5?: any) => void;
    Draw_Sample_LineBox?: (arg1?: any, arg2?: any, arg3?: any, arg4?: any) => void;
    Draw_Sample_Mark_Box?: (arg1?: any, arg2?: any, arg3?: any, arg4?: any) => void;
    Get_Length_On_Screen?: (fontSize?: number) => number;
    Draw_Tile_RoundBox?: (context: any, rect: any, style?: any, arg4?: any) => void;
    Draw_Line?: (context: any, linePattern: any, points: any, style?: any) => void;
    Draw_Print?: (context: any, text: string, position?: any, font?: any, hAlign?: any, vAlign?: any) => void;
    Get_DataUnit_With_Kakko?: (layerIndex?: number, dataIndex?: number) => string;
    Get_PaddingPixcel?: (style?: any) => number;
    Get_DataNote?: (layer?: any, data?: any) => any;
    Get_MaxURLNum?: (Layernum?: number) => number;
    Get_KenObjCode?: (Layernum: number, Objectnum: number) => string;
    Check_screen_Kencode_In?: (kencode: any, arg2?: any) => boolean;
    Check_Screen_Objcode_In?: (objcode: any, arg2?: any) => any;
    Get_DataNum?: (layer?: any) => number;
    
    // 追加プロパティ・メソッド
    Print_Mode_Total?: number;
    nowDataSolo?: any;
    nowData?: any;
    nowSeries?: any;
    nowOverlay?: any;
    Twocolort?: any;
    Threecolor?: any;
    FourColor?: any;
    Get_DataNote?: (layer?: any, data?: any) => any;
    Get_Data_Value?: (Layernum?: any, DataNum?: any, Obj?: any, Missing_word?: any) => any;
    Get_DataUnit?: (layer?: any, data?: any) => string;
    Get_DataType?: (layer?: any, data?: any) => number;
    Get_Missing_Value_DataArray?: (layer?: any, data?: any) => any[];
    Get_Data_Cell_Array_With_MissingValue?: (layer?: any, object?: any, data?: any) => any;
    Add_One_Data_Value?: (Layernum: any, Title: any, Unit: any, Note: any, Data_Val_str: any, Missing_F?: boolean) => boolean;
    Check_Missing_Value?: (layer?: any, object?: any, data?: any) => boolean;
    Check_Enable_SoloMode?: (soloMode?: any, layernum?: any, dataNum?: any) => boolean;
    Get_CategolyArray?: (layer?: any, data?: any) => any[];
    Get_Categoly?: (layer?: any, data?: any, index?: any) => any;
    Draw_Poly_Inner?: (context: any, points: any[], style?: any, tile?: any) => void;
    Get_InnerTile?: (layer?: any, object?: any, arg3?: any) => any;
    Get_Enable_KenCode_MPLine?: (layer?: any, object?: any) => any;
    Get_DataMin?: (layer?: any, data?: any) => number;
    Get_DataMax?: (layer?: any, data?: any) => number;
    Get_ClassFrequency?: (layer?: any, data?: any, classNum?: any) => any;
    Get_CenterP?: (layer?: any, object?: any) => point;
    Check_Condition_UMU?: (layer?: any) => boolean;
    Set_DataTitle_to_CheckedListBox?: (CheckedListBox: any, Layernum: number, defoChecked?: boolean, Number_Print_F?: boolean, Normal_F?: boolean, Category_f?: boolean, String_f?: boolean, Special_Astarisk_Num?: number) => void;
    Get_DivNum?: (layer?: any, data?: any) => number;
    Check_Point_in_Kencode_OneObject?: (layernum: number, objnum: number, mapP: point) => boolean;
    Set_Legend?: (D_Layer: number, D_DataNum: number, O_Data: any, ClassPaintF?: boolean, MarkSizeF?: boolean, MarkSizeValueCopyF?: boolean, MarkBlockF?: boolean, ContourF?: boolean, ClassMarkF?: boolean, ClassODF?: boolean, StringModeF?: boolean, MarkBarF?: boolean, ClassODOriginCopyF?: boolean, copyMarkCommonInnerDataF?: boolean) => void;
    Draw_Fan?: (context: any, centerP: point, radius: number, startAngle: number, endAngle: number, style?: any, tile?: any) => void;
    Get_SxSy_With_3D?: (point: point) => point;
    ClassMD?: any;
    saveAsMDRJ?: (filename?: string, options?: any) => void;
    Sort_OverLay_Data?: (arg1?: any, arg2?: any) => any;
    Sort_OverLay_Data_Sub?: (arg1?: any, arg2?: any) => any;
    Boundary_Kencode_Arrange?: (layer?: any, object?: any, time?: any) => any;
    GetObjMenseki?: (layer?: any, object?: any) => any;
    Get_MaxMinValue_Range?: (layer?: any, data?: any) => any;
    Get_OD_Label_Position?: (layer?: any, object?: any) => point;
    Get_Symbol_Position?: (layer?: any, object?: any) => point;
    Get_Label_Position?: (layer?: any, object?: any) => point;
    Get_KenCode_Circumscribed_Rectangle?: (layer?: any, object?: any) => rectangle;
    Get_Kencode_Object_Circumscribed_Rectangle?: (layer?: any, object?: any) => rectangle;
    Draw_Arrow?: (context: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => void;
    getMpLineDrawn?: (layer?: any, lineCode?: any) => boolean;
    setMpLineDrawn?: (layer?: any, lineCode?: any, drawn?: boolean) => void;
    setLineKindUseChecked?: (layer?: any, lineKind?: any, arg3?: any, checked?: boolean) => void;
    ResetMPSubLineDrawn?: (mapFileName?: any) => void;
    ResetMPSubLineXY?: (layer?: any) => void;
    Get_MPSubLineXY?: (layer?: any, lineCode?: any, arg3?: any) => any;
    Set_MPSubLineXY?: (layer?: any, lineCode?: any, points?: any, reverse?: any) => void;
    GetAllMapLineKindName?: () => string[];
    Get_AllMapLineKind?: () => any[];
    getDataTitleName?: (Layernum: any, Number_Print_F?: boolean, Normal_F?: boolean, Category_f?: boolean, String_f?: boolean, Special_Astarisk_Num?: number) => string[];
    Get_Data_Cell_Array_Without_MissingValue?: (layer?: any, object?: any, data?: any) => any;
    Set_DummyObjectName_to_checkedListBox?: (element: any, layerNum?: any, selectedObject?: any) => void;
    Set_DummyObjectName_to_selectBox?: (selbox: any, layernum: any, selectedObject: any) => void;
    Get_LayerName?: (layer?: any) => string;
    Get_DataMissingNum?: (layer?: any, data?: any) => number;
    Get_ObjectCode_from_ObjName?: (layer?: any, objName?: any) => any;
    // 追加メソッド
    getSeriesDataSetName?: () => string[];
    SeriesMode_to_ListViewData?: (seriesListView: any, DataSetItem: any) => void;
    getGraphTitle?: (layernum: number) => { text: string }[];
    getLabelTitle?: (layernum: number) => { text: string }[];
    getOverlayTitle?: () => { text: string }[];
    Get_ObjectGravityPoint?: (layernum: number, objNumber: number) => { ok: boolean; gpoint: point };
    Get_ObjectLength?: (layernum: number, objNum: number) => number;
    // 距離計算メソッド
    Distance_Kencode_Point?: (layernum: number, obj: number, point: point) => number;
    Distance_Kencode_Object?: (objNum1: number, objNum2: number, layNum1: number, layNum2: number) => number;
    Distance_Kencode_MPObject?: (layNum1: number, objNum1: number, mapFile: any, objCode2: any, time: any) => number;
    getOneObjectPanelLabelString?: (layernum: number, arg2?: any, objNum?: number, arg4?: any) => string;
    Set_Acc_First_Position?: () => void;
    Set_Class_Div?: (layernum: any, dataNum: any, setStartPos?: any) => void;
    Set_Div_Value?: (layernum: any, dataNum: any) => void;
    SetMapFile?: (mapFileName: string) => any;
    AddPointObjectKindUsed?: (layer?: any, object?: any, arg3?: any) => any;
    Get_Check_Enable_SoloMode?: (soloMode?: any, layerNum?: any, dataNum?: any) => any;
}

// スクリーンマージン（拡張）
interface IScrMargin {
    side: number;
    top: number;
    bottom?: number;
    scrollWidth: number;
}

// フォームプリント（拡張）
interface IFrmPrint extends ExtendedHTMLDivElement {
    label1: HTMLElement;
    label2?: HTMLElement;
    label3?: HTMLElement;
    picMap: HTMLCanvasElement;
    oldpos: rectangle;
    copyButton?: HTMLInputElement;  // 実際はHTMLInputElement
    backImageButton?: HTMLInputElement;
    seriesNextButton?: HTMLInputElement;
    seriesBeforeButton?: HTMLInputElement;
    // HTMLDivElementのプロパティも継承
    dragBorder?: (arg1: any, arg2: any) => void;
    resetMaxButton?: (flag?: boolean) => void;
}

// プロパティウィンドウ（拡張）
interface IPropertyWindow extends ExtendedHTMLDivElement {
    copyButton: HTMLInputElement;  // 実際はHTMLInputElement
    rightPositionFixed: boolean;
    relativePosition: point;
    fixed: boolean;
    nextVisible: boolean;
    pnlProperty?: any;
    objInfo?: any;
    oObject?: any;
    oLayer?: any;
    oData?: any;
    // HTMLDivElementのプロパティを継承
    dragBorder?: (arg1: any, arg2: any) => void;
    getVisibility?: () => boolean;
    setVisibility?: (visible: boolean) => void;
}

// 強化されたグローバル変数宣言
// attrData: AppStateで管理（削除済み）
declare var Generic: any; // kept temporarily; being migrated to ESM import
declare var clsSettingData: any;
declare var clsTime: any;
declare var clsDraw: any;
declare var clsPrint: any;
// frmPrint: AppStateで管理（削除済み）
declare var Frm_Print: IFrmPrint;
// propertyWindow: AppStateで管理（削除済み）
// divmain: AppStateで管理（削除済み）
declare var TKY2JGD: any; // kept temporarily; being migrated to ESM import
// tileMapClass: AppStateで管理（削除済み）
// preReadMapFile: AppStateで管理（削除済み）
// scrMargin: AppStateで管理（削除済み）
// logWindow: AppStateで管理（削除済み）

declare var tx: string;
declare var mnuPropertyWindow: any;
declare var fname: string;
declare var i: number;
declare var j: number;
declare var k: number;
// settingModeWindow: AppStateで管理（削除済み）

// 列挙型の追加
declare enum enmZahyo_mode_info {
    Zahyo_No_Mode = 0,
    Zahyo_Ido_Keido = 1,
    Zahyo_Heimentyokukaku = 2,
    Zahyo_HeimenTyokkaku = 2  // 別名
}

// ==================== 基本クラスの型定義強化 ====================

declare class point {
    x: number;
    y: number;
    Tag?: any;
    constructor(x?: number, y?: number);
    Clone(): point;
    offset(p_xp: point | number, yp?: number): void;
    toLatlon(): latlon;
    Equals(np: point): boolean;
}

declare class point3 extends point {
    z: number;
    constructor(x?: number, y?: number, z?: number);
    Clone(): point3;
}

declare class size {
    width: number;
    height: number;
    constructor(width?: number, height?: number);
    Clone(): size;
}

declare class rectangle {
    left: number;
    top: number;
    right: number;
    bottom: number;
    constructor(left_point?: point | number, right_size?: size | number, top?: number, bottom?: number);
    Clone(): rectangle;
    centerP(): point;
    size(): size;
    width(): number;
    height(): number;
    topLeft(): point;
    topRight(): point;
    bottomRight(): point;
    bottomLeft(): point;
    contains(P: point): boolean;
    offset(xplus: number, yplus: number): void;
    inflate(xplus: number, yplus: number): void;
    Equals(rect: rectangle): boolean;
    // 既存メソッドも保持
    Inflate(x: number, y: number): void;
    IntersectsWith(rect: rectangle): boolean;
    Contains(x: number, y: number): boolean;
    Contains(pt: point): boolean;
    Contains(rect: rectangle): boolean;
    Offset(x: number, y: number): void;
    Offset(pt: point): void;
    Union(rect: rectangle): rectangle;
}

// 度分秒構造体
interface IStrDegreeMinuteSeconde {
    Degree: number;
    Minute: number;
    Second: number;
    degree: number;
    minute: number;
    second: number;
}

// 度分秒緯度経度構造体
interface IStrLatLonDegreeMinuteSecond {
    LatitudeDMS: IStrDegreeMinuteSeconde;
    LongitudeDMS: IStrDegreeMinuteSeconde;
    toLatLon(): latlon;
}

// ポリゴンデータ情報（clsPrint.tsで実装）
interface IPolydataInfo {
    Pon?: number;
    pxy: point[];
    nPolyP: number[];
}

// 境界整列データ（clsPrint.tsで実装）
interface IboundArrangeData {
    Pon?: number;
    Fringe: any[];
    Arrange_LineCode: any[];
    pxy?: point[];
    nPolyP?: number[];
}

declare class latlon {
    lat: number;
    lon: number;
    x: number;
    y: number;
    constructor(lat?: number, lon?: number);
    Clone(): latlon;
    offset(latplus: number, lonplus: number): void;
    Equals(ll: latlon): boolean;
    toPoint(): point;
    toLatlon(): latlon;
    toDegreeMinuteSecond(): IStrLatLonDegreeMinuteSecond;
}

// 緯度経度範囲クラス
declare class latlonRange {
    NorthWest: latlon;
    SouthEast: latlon;
    constructor(nw?: latlon, se?: latlon);
    Clone(): latlonRange;
    contains(ll: latlon): boolean;
    width(): number;
    height(): number;
    size(): size;
    center(): latlon;
}

// ==================== 列挙型定義強化 ====================

declare enum enmCircleMDLegendLine {
    Zigzag = 0,
    Straight = 1
}

declare enum enmHorizontalAlignment {
    Left = 0,
    Center = 1,
    Right = 2
}

declare enum enmVerticalAlignment {
    Top = 0,
    Center = 1,
    Bottom = 2
}

declare enum Add_or_Remove {
    Add_Obj = 0,
    Remove_Obj = 1
}

declare enum chvOuter {
    In = 0,
    Out = 1,
    Over = 2,
    Under = 3
}

// enmShape は var 宣言で定義済み（下部参照）

declare enum enmPrintMouseMode {
    Normal = 0,
    PlusMinus = 1,
    Fig = 2,
    SymbolPoint = 3,
    LabelPoint = 4,
    RangePrint = 5,
    Accessory_Drag = 6,
    Distance = 7,
    od = 8,
    DistanceObject = 9,
    MultiObjectSelect = 10,
    MultiObjectswitch = 11  // エラーで参照されていた項目
}

// enmLayerMode_Number は var 宣言で定義済み（下部参照）

declare enum SpatialPointType {
    SinglePoint = 0,
    LineString = 1,
    Polygon = 2
}

// ==================== 追加クラス・インターフェース ====================

// 周辺方向情報
declare class PeripheriDirinfo {
    Code: number;
    Dir: number;
    constructor(Code: number, Dir: number);
}

// Quad_Mesh_Info は MeshContour.ts で定義済み

// contourLineStacInfo は MeshContour.ts で定義済み

// clsSpatialIndexSearch は SpatialIndexSearch.ts で実装済み

// Setting_Info は clsTime.ts で定義済み

// 汎用の描画設定・列挙体（グローバル参照されるためここで宣言）
declare const enmArrowHeadType: { Line: number; Fill: number };
declare const enmJoinPattern: { Round: number; Bevel: number; Miter: number };
declare const enmTotalMode_Number: { DataViewMode: number; OverLayMode: number; SeriesMode: number };
declare const enmLatLonPrintPattern: { DegreeMinuteSecond: number; DecimalDegree: number };

declare class LineEdge_Connect_Pattern_Data_Info {
    lineCap?: string;
    lineJoin?: string;
    miterLimit?: number;
    Edge_Pattern?: any;
    Join_Pattern?: any;
    MiterLimitValue?: any;
}

declare class Line_Property {
    BlankF?: boolean;
    Edge_Connect_Pattern?: LineEdge_Connect_Pattern_Data_Info;
    Width?: number;
    Color?: colorRGBA;
    Pattern?: any;
    Pat?: any;
    Set_Same_ColorWidth_to_LinePat?: (color: any, width: any) => void;
    Clone?: () => Line_Property;
    Draw_Fan?: (...args: any[]) => any;
}

declare class Tile_Property {
    BlankF?: boolean;
    Color?: colorRGBA;
    Line?: Line_Property;
    BasicLine?: any;
    TileCode?: any;
    Clone?: () => Tile_Property;
}

declare class BackGround_Box_Property {
    Tile: Tile_Property;
    Line: Line_Property;
    Round?: number;
    Padding?: number;
    constructor();
    Clone?(): BackGround_Box_Property;
}

declare class Font_Property {
    Color?: colorRGBA;
    Size?: number;
    italic?: boolean;
    bold?: boolean;
    Underline?: boolean;
    Name?: string;
    Kakudo?: number;
    FringeF?: boolean;
    FringeWidth?: number;
    FringeColor?: colorRGBA;
    Back: BackGround_Box_Property;
    constructor();
    Clone?(): Font_Property;
    toContextFont?(ScrData: any): { font: string | undefined; height: number };
}

declare class Mark_Property {
    PrintMark?: number;
    ShapeNumber?: number;
    Tile: Tile_Property;
    Line: Line_Property;
    wordmark?: string;
    WordFont: Font_Property;
    constructor();
    Clone?(): Mark_Property;
}

declare class Fringe_Line_Info {
    LineCode?: number;
    Line?: Line_Property;
    Length?: number;
    StartLine?: boolean;
    EndLine?: boolean;
    code?: number;
    Direction?: number;
    constructor();
}

declare class boundArrangeData {
    Mark?: Mark_Property;
    Line?: Line_Property;
    Fringe?: Fringe_Line_Info[];
    Arrange_LineCode?: any[];
    Pon?: number;
    constructor();
}

declare class Setting_Info {
    [key: string]: any;
    constructor();
    Clone?(): Setting_Info;
}

declare class Arrow_Data {
    Start_Arrow_F?: boolean;
    End_Arrow_F?: boolean;
    ArrowHeadType?: number;
    Angle?: number;
    LWidthRatio?: number;
    WidthPlus?: number;
    Clone?(): Arrow_Data;
}

declare class clsBase {
    static Arrow(): any;
    static LineEdge(): LineEdge_Connect_Pattern_Data_Info;
    static Line(): Line_Property;
    static BlankLine(): Line_Property;
    static BoldLine(): Line_Property;
    static Tile(): Tile_Property;
    static BlancTile(): Tile_Property;
    static PaintTile(col: any): Tile_Property;
    static Font(): Font_Property;
    static Mark(): Mark_Property;
    static ColorWhite(): colorRGBA;
    static ColorGray(): colorRGBA;
    static ColorBlack(): colorRGBA;
    static ColorBlue(): colorRGBA;
    static ColorRed(): colorRGBA;
    static ColorGreen(): colorRGBA;
    static BlankBackground(): BackGround_Box_Property;
    static WhiteBackground(): BackGround_Box_Property;
}



// Removed legacy global declarations for ListBox/CheckedListBox/ListViewTable after ESM migration.

// DOM拡張: 旧実装で追加プロパティを持つDIVの型
interface ExtendedHTMLDivElement extends HTMLDivElement {
    relativePosition?: point;
    setVisibility?: (visible: boolean) => void;
    bottomPositionFixed?: boolean;
    bottomRightPositionFixed?: boolean;
    sizeFixed?: boolean;
    relativeSize?: size;
    maxSizeFlag?: boolean;
    oldpos?: rectangle;
    setNumberValue?: (value: number) => void;
    selectedRow?: any;
    inPanel?: any;
    addSelectList?: (items: any[], arg2?: any, arg3?: any, arg4?: any) => void;
    getText?: () => string;
    getValue?: () => any;
    setSelectText?: (text: any) => void;
    setSelectData?: (data: any, arg2?: any, arg3?: any) => void;
    setAstarisk?: (index?: any, flag?: boolean) => void;
    setSelectValue?: (value: any) => void;
}

interface HTMLDivElement {
    tooltip?: string;
    selected?: boolean;
    selectedRow?: any;
    tab?: any;
    table?: any;
    selectedIndex?: number;
    tag?: any;
    maxSizeFlag?: boolean;
    oldpos?: rectangle;
    dragBorder?: any;
    enabled?: boolean;
    submenunum?: any;
    Capture?: boolean;
    addSelectList?: (items: any, arg2?: any, arg3?: any, arg4?: any) => void;
    setSelectData?: (arg1?: any, arg2?: any, arg3?: any) => void;
    setAstarisk?: (index?: any, flag?: boolean) => void;
    setSelectValue?: (value: any) => void;
    setNumberValue?: (value: any) => void;
    inPanel?: any;
    panel?: any;
}

interface HTMLCanvasElement {
    tag?: any;
    name?: string;
    rightPositionFixed?: boolean;
    bottomRightPositionFixed?: boolean;
    bottomPositionFixed?: boolean;
    relativePosition?: point;
    sizeFixed?: boolean;
    relativeSize?: size;
}

interface HTMLInputElement {
    bottomPositionFixed?: boolean;
    bottomRightPositionFixed?: boolean;
    relativePosition?: point;
    btnDisabled?: (disabled: boolean) => void;
    tag?: any;
    preValue?: any;
    word?: any;
}

interface HTMLTextAreaElement {
    sizeFixed?: boolean;
    relativeSize?: size;
}

interface CSSStyleDeclaration {
    vivility?: boolean;
}

interface Number {
    px(): string;
}

interface String {
    right(length: number): string;
    removePx(): number;
    mid(start: number, length?: number): string;
    px(): string;
}

interface Event {
    ctrlKey?: boolean;
    shiftKey?: boolean;
    dataTransfer?: DataTransfer;
}

interface Element {
    setVisibility?: (visible: boolean) => void;
}

interface HTMLElement {
    addSelectList?: (items: any, arg2?: any, arg3?: any, arg4?: any) => void;
    setSelectData?: (arg1?: any, arg2?: any, arg3?: any) => void;
    setAstarisk?: (index?: any, flag?: boolean) => void;
    setSelectValue?: (value: any) => void;
    setNumberValue?: (value: any) => void;
    inPanel?: any;
    panel?: any;
    selectedRow?: any;
}

interface Math {
    Max: typeof Math.max;
}

// Legacy globals still referenced across the codebase (typed as any for now)
declare function clsSelectData(...args: any[]): any;
declare class GraphModeDataItem { [key: string]: any; constructor(...args: any[]); }
declare function clsTileSet(...args: any[]): any;
declare function clsLinePatternSet(...args: any[]): any;
declare function graphModeEn_Obi(...args: any[]): any;
declare function graphModeOresen_Bou(...args: any[]): any;
declare function openMapFile(...args: any[]): any;
declare class clsMapdata { [key: string]: any; constructor(...args: any[]); }
declare class clsAttrData { [key: string]: any; constructor(...args: any[]); }
declare class clsTileMap { [key: string]: any; constructor(...args: any[]); }
declare class clsDrawMarkFan {
    static init?: (...args: any[]) => any;
    static getMarkShameNum?: (...args: any[]) => any;
    static Draw_Fan?: (...args: any[]) => any;
    static Draw_Mark_Sample_Box?: (...args: any[]) => any;
    static Mark_Print?: (...args: any[]) => any;
}
declare const ListBox: any;
declare const CheckedListBox: any;
declare const ListViewTable: any;
declare function frmPrint_DummyObjectGroup(...args: any[]): any;
declare function frmProjectionConvert(...args: any[]): any;
declare function frmPrintOption(...args: any[]): any;
declare function frmPrint_ObjectValue(...args: any[]): any;
declare function frmPrint_backImageSet(...args: any[]): any;
declare function frmCompassSettings(...args: any[]): any;
declare class clsSpline { static Spline_Get?: (...args: any[]) => any; }
declare class strLocationSearchObject { [key: string]: any; constructor(...args: any[]); }
declare class LPatSek_Info { [key: string]: any; constructor(...args: any[]); }
declare class strCondition_Limitation_Info { [key: string]: any; constructor(...args: any[]); }
declare class strDummyObjectName_and_Code { [key: string]: any; constructor(...args: any[]); }
declare class strOverLay_DataSet_Item_Info { [key: string]: any; constructor(...args: any[]); }
declare class strContour_Data_Irregular_interval { [key: string]: any; constructor(...args: any[]); }
declare class strClass_Div_data { [key: string]: any; constructor(...args: any[]); }
declare class clsSortingSearch { [key: string]: any; constructor(...args: any[]); }
declare function clsColorPicker(...args: any[]): any;
declare function clsMarkSet(...args: any[]): any;
declare function clsInnerDataSet(...args: any[]): any;
declare function clsLineEdgePattern(...args: any[]): any;
declare function clsColorChart(...args: any[]): any;
declare function clsArrow(...args: any[]): any;
declare function clsGrid(...args: any[]): any;
declare function clsCompassSettings(...args: any[]): any;
declare function frmMain_Buffer(...args: any[]): any;
declare function frmMain_AreaPeripheri(...args: any[]): any;
declare function frmMain_Culc(...args: any[]): any;
declare function frmMain_GetDistance(...args: any[]): any;
declare function frmMain_ConditionSettings(...args: any[]): any;
declare function frmMainCopyDataSettings(...args: any[]): any;
declare function frmMain_SetSeriesMode(...args: any[]): any;
declare function frmMain_MarkPosition(...args: any[]): any;
declare function frmMain_LayeObjectSelectOne(...args: any[]): any;
declare function settingFront(...args: any[]): any;
declare const clsSpatialIndexSearch: any;
declare class strFrmCopyObjectName_init_parameter_data { [key: string]: any; constructor(...args: any[]); }
declare function frmCopyObjectName(...args: any[]): any;
declare class strOverLay_Dataset_Info { [key: string]: any; constructor(...args: any[]); }
declare class strSeries_Dataset_Info { [key: string]: any; constructor(...args: any[]); }
declare class strCondition_DataSet_Info { [key: string]: any; constructor(...args: any[]); }
declare class strCondition_Data_Info { [key: string]: any; constructor(...args: any[]); }
declare class strObject_Data_Info { [key: string]: any; constructor(...args: any[]); }
declare class strSeries_DataSet_Item_Info { [key: string]: any; constructor(...args: any[]); }
declare class strTileMapViewInfo { [key: string]: any; constructor(...args: any[]); }
declare class strCompass_Attri { [key: string]: any; constructor(...args: any[]); }
declare class clsDrawLine { [key: string]: any; static Arrow?: (...args: any[]) => any; static Line?: (...args: any[]) => any; static Draw_Sample_LineBox?: (...args: any[]) => any; static Check_Draw_Arrow_Line?: (...args: any[]) => any; }
declare class clsDrawTile { [key: string]: any; static Darw_Sample_BackGroundBox?: (...args: any[]) => any; static Draw_Poly_Inner?: (...args: any[]) => any; static Draw_Tile_Box?: (...args: any[]) => any; static Draw_Tile_RoundBox?: (...args: any[]) => any; }
declare class tileList_Data_Info { [key: string]: any; constructor(...args: any[]); }
declare class EnableMPLine_Data { [key: string]: any; constructor(...args: any[]); }
declare class strContour_Line_property { [key: string]: any; constructor(...args: any[]); }
declare class clsMeshContour { [key: string]: any; constructor(...args: any[]); }
declare class Legend2_Atri { [key: string]: any; constructor(...args: any[]); }
declare class clsFontSet { [key: string]: any; constructor(...args: any[]); }
declare function clsFontSet(...args: any[]): any;
declare function clsDrawTileSample(...args: any[]): any;
declare const enmBasePosition: any;
declare const enmSoloMode_Number: any;
declare const enmKenCodeObjectstructure: any;
declare const enmLayerMode_Number: any;
declare const enmObjectGoupType_Data: any;
declare const enmCondition: any;
declare const enmDataSource: any;
declare const enmPrint_Enable: any;
declare const enmMarkPrintType: any;
declare const enmDivisionMethod: any;
declare const enmPaintColorSettingModeInfo: any;
declare const enmMarkBlockArrange: any;
declare const enmMarkBarShape: any;
declare const enmMarkSizeValueMode: any;
declare const enmContourIntervalMode: any;
declare const enmBarLineMaxMinMode: any;
declare const enmMarkMaxValueType: any;
declare const enmInner_Data_Info_Mode: any;
declare const enmClassMode_Meshod: any;
declare const enmEdge_Pattern: any;
declare const enmSeparateClassWords: any;
declare const enmScaleBarPattern: any;
declare const enmGraphMaxSize: any;
declare const enmStackedBarChart_Direction: any;
declare const enmBarChartFrameAxePattern: any;
declare const enmMultiEnGraphPattern: any;
declare const enmLatLonLine_Order: any;
declare const enmOutputDevice: any;
declare const enmDrawTiming: any;
declare const enmLineConnect: any;
declare const enmPointOnjectDrawOrder: any;
declare const Quad_Mesh_Info: any;
declare const LineCodeStac_Data: any;
declare const strDefTimeAttDataEach_Info: any;
declare const strDefTimeAttData_Info: any;

interface Zahyo_info {
    Mode: number;
    System: number;
    HeimenTyokkaku_KEI_Number: number;
    Projection: number;
    CenterXY: point;
    Clone(): Zahyo_info;
}
declare const Zahyo_info: {
    new(): Zahyo_info;
    prototype: Zahyo_info;
};

interface strMap_data {
    MPVersion: number;
    FileName: string;
    FullPath: string;
    OBKNum: number;
    Kend: number;
    LpNum: number;
    ALIN: number;
    SCL: number;
    SCL_U: number;
    Comment: string;
    Time_Mode: boolean;
    Circumscribed_Rectangle: rectangle;
    Zahyo: Zahyo_info;
    Detail: any;
    MapCompass: any;
}
declare const strMap_data: {
    new(): strMap_data;
    prototype: strMap_data;
};

interface EventTarget {
    tag?: any;
    selectedIndex?: number;
    value?: any;
}

// 関数
declare function logX(data: any): void;
declare function init(): void;
declare function setting(search: string): void;
declare function contextMenuPrevent(e: Event): void;
declare function frmPrintFront(): void;
declare function FrmprintMenuClick(pos: any): void;
declare function dataValueShow(): void;
declare function backImageButton(): void;
declare function mapMouse(canvas: any, callback: any): void;
declare function AddMeshPoint(objectNum: any, action: any): void;
declare function AddMeshRect(objectNum: any, action: any): void;

// frmPrint は clsPrint.ts で class として定義済み

// 定数定義
declare const mousePointingSituations: {
    down: 0;
    move: 1;
    up: 2;
    downAndMove: 3;
    pinch: 4;
};

declare const Check_Acc_Result: {
    NoAccessory: 0;
    Title: 1;
    Compass: 2;
    Scale: 3;
    Legend: 4;
    GroupBox: 5;
    Note: 6;
};

declare const enmPrintMouseMode: {
    Normal: 0;
    PlusMinus: 1;
    Fig: 2;
    SymbolPoint: 3;
    LabelPoint: 4;
    RangePrint: 5;
    Accessory_Drag: 7;
    Distance: 9;
    od: 10;
    DistanceObject: 11;
    MultiObjectSelect: 12;
};

declare var TKY2JGDInfo: any;



// String prototype extensions
interface String {
    left(length: number): string;
    mid(start: number, length?: number): string;
    midReplace(start: number, replaceString: string): string;
    replaceAll(org: string, dest: string): string;
}

// Zlib library
declare var Zlib: {
    Zip: new() => any;
    Unzip: new(buffer: Uint8Array) => any;
};

// Navigator extensions
interface Navigator {
    msSaveBlob?: (blob: Blob, filename: string) => void;
    msSaveOrOpenBlob?: (blob: Blob, filename: string) => void;
}

// HTML element extensions
interface HTMLSpanElement {
    whiteSpace?: string;
}

interface HTMLInputElement {
    preValue?: any;
    setNumberValue?: (value: number) => void;
    btnDisabled?: (disabled: boolean) => void;
    numberCheck?: any;
}

interface HTMLDivElement {
    tooltip?: string;
    selected?: boolean;
    setTitle?: (title: string) => void;
    setVisibility?: (visible: boolean) => void;
    panel?: any;
    name?: string;
    sizeFixed?: boolean;
    relativeSize?: size;
    bottomRightPositionFixed?: boolean;
    relativePosition?: point;
}

interface HTMLElement {
    disabled?: boolean;
    innerText?: string;
    checked?: boolean;
    removeOne?: () => void;
    getVisibility?: () => boolean;
    btnDisabled?: (disabled: boolean) => void;
    inPic?: any;
    inTxt?: any;
    numberCheck?: any;
    getText?: () => string;
    getValue?: () => any;
    setSelectText?: (text: any) => void;
}

interface HTMLTextAreaElement {
    getVisibility?: () => boolean;
    setVisibility?: (visible: boolean) => void;
    select?: () => void;
    Tag?: any;
    tag?: any;
}

interface HTMLCanvasElement {
    tag?: any;
}

interface HTMLSelectElement {
    addSelectList?: (items: any[], arg2?: any, arg3?: any, arg4?: any) => void;
    getValue?: () => any;
    getText?: () => string;
    oldSel?: any;
    setSelectValue?: (value: any) => void;
    tooltip?: string;
    setSelectText?: (text: any) => void;
    setSelectData?: (data: any, arg2?: any, arg3?: any) => void;
}

// Global functions
declare function Check_Print_err(): void;

// Shapefile class
declare var clsShapefile: any;

// Additional global variables
declare var picMark: any;
declare var lstDummyItem: any;

// Array extensions
interface Array<T> {
    trueNum?: number;
    DummyOBGArray?: any[];
}

// EventTarget extensions
interface EventTarget {
    value?: any;
}

// Generic class methods
declare class colorRGBA {
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(r?: number | number[], g?: number, b?: number, a?: number);
    Clone(): colorRGBA;
    toRGBA(): string;
    toRGB(): string;
    toHex(): string;
    Equals(col: colorRGBA): boolean;
    getDarkColor(): colorRGBA;
}

declare class Grid_Color {
    Frame: colorRGBA;
    SelectedFrame: colorRGBA;
    Grid: colorRGBA;
    GridLine: colorRGBA;
    TextBox: colorRGBA;
    SelectedGrid: colorRGBA;
    FixedGrid: colorRGBA;
    SelectedFixedGrid: colorRGBA;
    Clone(arg?: any): Grid_Color;
}

declare class Operation_enable_info {
    Clone(arg?: any): Operation_enable_info;
}

declare class strYMD {
    Year: number;
    Month: number;
    Day: number;
    constructor(year?: number | strYMD, month?: number, day?: number);
    Clone(): strYMD;
    nullFlag(): boolean;
    Equals(time: strYMD): boolean;
    toInputDate(): string;
    toString(): string;
    toDate(): Date;
}

declare class latlonbox {
    NorthWest?: any;
    SouthEast?: any;
    NorthEast?: any;
    SouthWest?: any;
    constructor(nw?: any, se?: any);
}

// clsDrawLine は clsDraw.ts で実装済み

declare class Generic {
    static createNewCanvas(parent: any, id: string, className: string, x: number, y: number, width: number, height: number, selectColor?: any): HTMLCanvasElement;
    static alert(event: any, message: string, callback?: any): void;
    static alert(message: string, callback?: any): void;
    static createMsgBox(title: string, message: string, showOk: boolean, arg4?: any, arg5?: any, arg6?: any, arg7?: any, arg8?: any, arg9?: any, arg10?: any): void;
    static createNewDiv(parent: any, text: string, id: string, className: string, x: number, y: number, width?: any, height?: any, style?: string, arg10?: any): HTMLDivElement;
    static addSelectList(selectElement: HTMLSelectElement | string, items: any[], arg3?: any, arg4?: any): void;
    static createNewRadioButtonList(parent: any, name: string, list: any[], x: number, y: number, w?: any, h?: any, defaultValue?: any, changeHandler?: any, fontSize?: any): HTMLElement;
    static createNewFrame(parent: any, text: string, id: string, x: number, y: number, width: number, height: number, title?: string, arg9?: any, arg10?: any): HTMLElement;
    static createNewWordNumberInput(parent: any, label: string, id: string, value: any, unit?: string, x?: number, y?: number, w?: any, h?: any, className?: string, arg11?: any): HTMLInputElement;
    static Get_LatLon_Strings(latlon: any, arg2?: boolean): {x: string, y: string};
    static convValue(value: any): number;
    static Remove_Same_String(arr: any[]): any[];
    static createNewCheckBox(parent: any, text: string, id: string, checked: boolean, x: number, y: number, arg7?: any, onChange?: Function, arg9?: any, arg10?: any): HTMLInputElement;
    static createNewTextarea(parent: any, type: string, id: string, x: number, y: number, width: number, height: number, style?: string): HTMLTextAreaElement;
    static ArrayClone(arr: any[]): any[];
}

// ==================== 列挙型定義（追加） ====================

// レイヤータイプ
declare var enmLayerType: {
    Normal: number;
    Trip_Definition: number;
    Trip: number;
    Mesh: number;
    DefPoint: number;
};

// グラフモード
declare var enmGraphMode: {
    PieGraph: number;
    StackedBarGraph: number;
    LineGraph: number;
    BarGraph: number;
};

// 属性データタイプ
declare var enmAttDataType: {
    Normal: number;
    Category: number;
    Strings: number;
    URL: number;
    URL_Name: number;
    Lon: number;
    Lat: number;
    Place: number;
    Arrival: number;
    Departure: number;
};

// メッシュ番号
declare var enmMesh_Number: {
    mhNonMesh: number;
    mhFirst: number;
    mhSecond: number;
    mhThird: number;
    mhHalf: number;
    mhQuarter: number;
    mhOne_Eighth: number;
    mhOne_Tenth: number;
};

// 座標系情報
declare var enmZahyo_System_Info: {
    Zahyo_System_No: number;
    Zahyo_System_tokyo: number;
    Zahyo_System_World: number;
};

// スケール単位
declare var enmScaleUnit: {
    centimeter: number;
    meter: number;
    kilometer: number;
    inch: number;
    feet: number;
    yard: number;
    mile: number;
    syaku: number;
    ken: number;
    ri: number;
    kairi: number;
};

// 投影法情報
declare var enmProjection_Info: {
    prjNo: number;
    prjSanson: number;
    prjSeikyoEntou: number;
    prjMercator: number;
    prjMiller: number;
    prjLambertSeisekiEntou: number;
    prjMollweide: number;
    prjEckert4: number;
};

// 座標モード情報
declare var enmZahyo_mode_info: {
    Zahyo_No_Mode: number;
    Zahyo_Ido_Keido: number;
    Zahyo_HeimenTyokkaku: number;
};

// 座標系情報（列挙型版）
declare enum enmZahyo_mode_info_enum {
    Zahyo_No_Mode = 0,
    Zahyo_Ido_Keido = 1,
    Zahyo_Heimentyokukaku = 2
}

// 長方形交差定数
declare var cstRectangle_Cross: {
    cstOuter: number;
    cstCross: number;
    cstInner: number;
    cstInclusion: number;
    cstEqual: number;
};

// 形状タイプ
declare var enmShape: {
    NotDeffinition: number;
    PointShape: number;
    LineShape: number;
    PolygonShape: number;
};

// enmLayerMode_Numberの拡張
declare var enmLayerMode_Number: {
    SoloMode: number;
    MultiMode: number;
    LabelMode: number;
    GraphMode: number;
    TripMode: number;
};

// ラインとポリゴンの関係
declare var cstLinePolygonRelationd: {
    cstOuter: number;
    cstCross: number;
    cstInner: number;
};

// 定数
declare var chrLF: string;
declare var EarthR: number;

// マッチングモード
declare var enmMatchingMode: {
    Exact: number;
    Partial: number;
    Prefix: number;
    Suffix: number;
    PerfectMatching: number;
    PartialtMatching: number;
};

// ==================== クラス定義（追加） ====================

// スクロールバークラスはclsGridControl.tsで実装されています
// gridControlクラスもclsGridControl.tsで実装されています

// Brushクラス
declare class Brush {
    color: colorRGBA;
    constructor(color?: colorRGBA);
}

// SpatialPointTypeの拡張
declare namespace SpatialPointType {
    const SPILine: number;
    const SPIPolygon: number;
    const SPIRect: number;
}

// spatialクラス（空間計算ユーティリティ）
declare class spatial {
    static Get_Converted_XY(point: point, zahyo: any): point;
    static Get_Reverse_XY(point: point, zahyo: any): point;
    static Get_MeshCode_Rectangle(meshcode: string, meshType: number, refOrigin: number, refDestZahyo: Zahyo_info): any;
    static Distance_Ido_Kedo_XY_Point(P1: point, P2: point, MapDTMapZahyo: Zahyo_info): number;
    static Distance_Ido_Kedo_XY(P1: any, P2: any, MapDTMapZahyo: any): number;
    static Distance_Ido_Kedo_LatLon(D1: latlon, D2: latlon): number;
    static Line_Cross_Point(LAP1: point, LAP2: point, LBP1: point, LBP2: point): point | undefined;
    static Get_Ido_Kedo_from_MeshCode(meshcode: string, meshType?: number): any;
    static ConvertRefSystemLatLon(ll: latlon, refOrigin: number, refDest: number): latlon;
    static getCircumscribedRectangle(points: point[] | point | rectangle, margin?: number | rectangle): rectangle;
    static Get_TurnedBox(size: size, angle: number): size;
    static Get_Scale_Baititu_IdoKedo(p: point, MPDataMapZahyo: Zahyo_info): number;
    static Trans3D(x: any, y: any, z?: any, center?: any, expand?: any, pitch?: any, head?: any, bank?: any, xyPara?: any): point;
    static Trans2D(CP: any, Kakudo_P: any, Kakudo?: any): point;
    static Check_Zahyo_Projection_Convert_Enabled(zahyo: any, zahyo2?: any): { ok: boolean; emes: string };
    static Get_Reverse_and_Convert_XY(point: point, oldMapZahyo: Zahyo_info, newMapZahyo: Zahyo_info): point;
    static check_Point_in_Polygon(point: point, polygon: point[]): { ok: boolean };
    static Compare_Two_Rectangle_Position(rect1: rectangle, rect2: rectangle): number;
    static Compare_Two_Rectangle_Position_turned(rect1: rectangle, angle: number, rect2: rectangle): number;
    static Compare_Two_Rectangle_Position_Inflated(rect1: rectangle, rect2: rectangle, inflate?: number): number;
    static Get_Suisen_Vec(VecX: number, VecY: number): { rVx: number; rVy: number };
    static Get_Vec_Point(VecX: number, VecY: number, Dis: number, CenterFlag: boolean): point;
    static Get_Fan_Coordinates(CP: point, r: number, start_p: number, end_p: number, CenterLineF?: boolean): point[];
    static Get_Hairetu_Menseki(points: point[], map?: { Zahyo: Zahyo_info; SCL: number }): number;
    static Distance_Point(p1: point, p2: point): number;
    static Distance_PointLine(X: number, Y: number, ax: number, ay: number, BX: number, BY: number): { distance: number; nearP: point };
    static Distance_PointLine2(P: point, LineP1: point, LineP2: point): { distance: number; nearP: point };
    static Get_TurnedRectangle(Rect: any, Kakudo: any): point[];
    static Get_Rectangle(P1: point, P2: number | size | point): rectangle;
    static Get_Rectangle_Union(rect1: rectangle, rect2: rectangle): rectangle;
    static Get_World_IdoKedo(oxy: point, MapZahyo_Info: Zahyo_info): latlon;
    static Get_ReverseWorld_IdoKedo(oLatLon: latlon, MapZahyo: Zahyo_info): latlon;
    static Get_Reverse_Rect(In_Rect: any, MPDataMapZahyo: any): any;
    static Distance(x1: number, y1: number, x2: number, y2: number): number;
    static Get_Poly_Point_Juushin(points: point[]): point;
    static Get_CenterP_from_MeshCode(meshcode: any, meshType: any): point;
    static BoundaryArrangeGeneral(arg1?: any, arg2?: any, arg3?: any): any;
    static Check_TwoRectangele_Inner_Contact(rect1: rectangle, rect2: rectangle): boolean;
    static Check_PointInBox(checkXY: point, Kakudo: number, Rect: rectangle): boolean;
    static checkAndModifyPointInRect(point: point, rect: rectangle): point;
    static Check_PsitionReverse_Enable(p1: point, p2: any): boolean;
}

// clsDrawLine と clsDrawMarkFan は clsDraw.ts で実装済み

// リストボックス
declare class ListBox {
    constructor(parent: any, classname?: any, list?: any[], x?: number, y?: number, width?: number, height?: number, onChange?: any, styleinfo?: any);
    getSelectedIndex(): number;
    setSelectedIndex(index: number): void;
    setItems(items: any[]): void;
    selectedIndex?: number;
    frame?: any;
    length?: number;
    value?: any;
    options?: any[];
    getItems?: () => any[];
    clear?: () => void;
    add?: (item: any) => void;
    addList?: (items: any[], pos?: number) => void;
    addSelectList?: (items: any[], pos?: number) => void;
    removeList?: (pos: number, delNum?: number) => void;
    removeAll?: () => void;
    getText?: (index?: number) => string;
    getAllText?: () => string[];
    getAllValue?: () => any[];
    getValue?: () => any;
    setValue?: (row: number, value: any) => void;
    setText?: (row: number, text: string) => void;
    rowUp?: (row: number) => void;
    rowDown?: (row: number) => void;
}

// チェックリストボックス
declare class CheckedListBox {
    constructor(parent: any, classname?: any, list?: any[], x?: number, y?: number, width?: number, height?: number, twoStepCheckF?: boolean, onChange?: any, styleinfo?: any);
    getChecked(): { checkedStatus: boolean[]; checkedArray: number[] };
    getCheckedStatus(n: number): boolean;
    setChecked(index: number, checked: boolean): void;
    setCheckStatus(n: number, checked: boolean): void;
    getSelectedIndex(): number;
    setSelectedIndex(index: number): void;
    setItems(items: any[]): void;
    addList(list: any[], pos?: number): void;
    removeList(pos: number, delNum?: number): void;
    removeAll(): void;
    setText(n: number, text: string): void;
    add(item: any): void;
    frame?: any;
    length?: number;
    selectedIndex?: number;
    disabled?: boolean;
}

// 条件And/Or
declare var enmConditionAnd_Or: {
    _And: number;
    _Or: number;
    And: number;
    Or: number;
};

// 値の位置チェック
declare var chvValue_on_twoValue: {
    chvIN: number;
    chvOuter: number;
    chvJust: number;
};

// strScale_Attri型
declare var strScale_Attri: any;

// clsAttrData.ts の関数コンストラクタ型
declare var strDegreeMinuteSeconde: any;
declare var strLatLonDegreeMinuteSecond: any;
declare var Start_End_Time_data: any;
declare var strContourData: any;
declare var strMeshPaint: any;
declare var strMesh3DPaint: any;
declare var strLayerData: any;
declare var strLabelDummyData: any;
declare var strLabel_Data: any;
declare var strGraphData: any;
declare var strLabel_Attri: any;
declare var strGraph_Attri: any;
declare var strOverLay_Attri: any;
declare var strTotalData: any;
declare var strLinkURL: any;
declare var strDataTile: any;
declare var strDataTileList: any;
declare var strDataObject: any;
declare var strDataTitle: any;
declare var strDataEdit: any;
declare var strDataEditRow: any;
declare var strDataEditCell: any;
declare var strCategoryData: any;
declare var strMaskData: any;
declare var strMPLine: any;
declare var strMPLineSub: any;
declare var strDataStatistics: any;
declare var strLegend_Attri: any;
declare var strPrint_Mode: any;
declare var strSoloData: any;
declare var strSeriesData: any;
declare var strOverlayData: any;
declare var strPaintModeData: any;
declare var strMarkData: any;
declare var strBarData: any;
declare var strPieData: any;
declare var strFlowData: any;
declare var strTileMarkData: any;
declare var strTimeData: any;
declare var strViewStyle: any;
declare var strScreenData: any;
declare var strMapLegend: any;
declare var strMapTitle: any;
declare var strMapScale: any;
declare var strMapNorth: any;
declare var strGridLine: any;
declare var strBackGround: any;
declare var strMapOverLay: any;
declare var strCondition: any;
declare var strConditionItem: any;
declare var strConditionValue: any;
declare var strPointObject: any;
declare var strPolyObject: any;
declare var strLineObject: any;
declare var strObjectGroup: any;
declare var strAttrValue: any;
declare var strThreeD_Mode: any;
declare var strPrintFooter: any;
declare var strPrintHeader: any;
declare var strMapPrint: any;
declare var strColorPalette: any;
declare var strDivideValue: any;
declare var strTripObjData_Info: any;
declare var strObjectKindUsed_Info: any;

// Map静的プロパティ拡張
interface MapConstructor {
    ALIN?: number;
    ObjectNumber?: number;
}

// Enums
declare enum enmTripPositionType {
    LatLon = 0,
    ObjectSet = 1
}

// ==================== types.ts からの型統合 ====================
// 以下の型は types.ts で export されているものと互換性を保つため、
// グローバルスコープでも利用可能にする

/**
 * ファイルデータ型
 * ファイル読み込み処理で使用
 */
interface FileData {
    file: File;
    name: string;
    extension: string;
    content?: string | ArrayBuffer;
}

/**
 * マップファイル情報型
 * 地図ファイルの管理に使用
 */
interface MapFileInfo {
    name: string;
    path?: string;
    type: 'mpfj' | 'mdrj' | 'mdrmj' | 'csv';
    data?: unknown;
}

/**
 * リスト項目型
 * ドロップダウンやリストボックスで使用
 */
interface ListItem {
    value: string | number;
    text: string;
    selected?: boolean;
    disabled?: boolean;
}

/**
 * レイヤー情報型
 * 地図レイヤーの管理に使用
 */
interface LayerInfo {
    id: string | number;
    name: string;
    visible: boolean;
    data?: unknown;
}

/**
 * データ読み込み結果型
 * 非同期データ読み込みの結果を統一的に扱う
 */
interface DataLoadResult<T = unknown> {
    success: boolean;
    data?: T;
    error?: Error | string;
    message?: string;
}

// Note: 汎用的なユーティリティ型（EventHandler, Dictionary等）は
// types.ts から import して使用することを推奨
// 例: import type { EventHandler, Dictionary } from './types';