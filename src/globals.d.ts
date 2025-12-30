// MANDARA GIS Application - 型定義ファイル（強化版）

// ==================== グローバル変数の型定義強化 ====================

// ==================== グローバル変数の宣言 ====================
declare let attrData: IAttrData;
declare let settingModeWindow: any;
declare let scrMargin: any;
declare let propertyWindow: any;
declare let frmPrint: any;
declare let divmain: HTMLDivElement;
declare let preReadMapFile: any;
declare let clsLayerData: any;

// GlobalEventHandlers拡張
interface GlobalEventHandlers {
    innerText?: string;
    tag?: string | number;
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

// MouseEvent拡張（タッチイベント対応）
interface MouseEvent {
    changedTouches?: TouchList;
}

// HTMLElement拡張（select要素のoptions等）
interface HTMLElement {
    options?: HTMLOptionsCollection;
    selectedIndex?: number;
    value?: string;
    optionSwap?: (n1?: number, n2?: number) => void;
    objInfo?: any; // カスタムデータ保持用
}

// Function拡張（イベントハンドラデータ保持用）
interface Function {
    evtChange_Data?: any;
    evtChange_FixedXS?: any;
    evtChange_FixedYS?: any;
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
        Condition?: unknown[]; // strCondition_DataSet_Info[] (clsAttrData.tsで定義)
        TotalMode?: {
            OverLay?: {
                SelectedIndex?: number;
                DataSet: IOverLayDatasetInfo[];
                Always_Overlay_Index?: number;
                MarkModePosFixFlag?: boolean;
                AddDataSet?: (data?: unknown) => void;
                initDataSet?: () => void;
            };
            Series?: {
                SelectedIndex?: number;
                DataSet: ISeriesDatasetInfo[];
                AddDataSet?: (data?: unknown) => void;
                initDataSet?: () => void;
            };
        };
        ViewStyle: {
            Clone?: () => unknown;
            Dummy_Size_Flag?: boolean;
            ScrData: {
                frmPrint_FormSize: rectangle;
                ScrView?: rectangle;
                MapScreen_Scale?: size;
                MapRectangle?: rectangle;
                MapRectanglem?: rectangle;
                getSXSY_Margin?: () => rectangle;
                getSRXY?: (p: point) => point;
                getSxSy?: (arg1: point, arg2?: point) => point;
                getSRXYfromRatio?: (arg1: number) => point;
                Get_SxSy_With_3D?: (arg1?: point, arg2?: number, arg3?: number) => point;
                ThreeDMode?: {
                    Set3D_F: boolean;
                    Pitch?: number;
                    Head?: number;
                    Bank?: number;
                };
                Accessory_Base?: number;
                OutputDevide?: number; // enmOutputDevice
                SampleBoxFlag?: boolean;
                Set_PictureBox_and_CulculateMul?: (arg1?: rectangle) => void;
                ScrRectangle?: rectangle;
                Screen_Margin?: unknown; // IScrMargin
                getSxSyRect?: (arg1?: rectangle) => rectangle;
                Get_Length_On_Screen?: (arg1?: number) => number;
                ScreenMG?: unknown; // ScreenMultiply_Data_Info
                Clone?: () => unknown;
                init?: (sz?: size, margin?: unknown, mapRect?: rectangle, accessoryBase?: number, clearFlag?: boolean) => void;
            };
            AttMapCompass?: unknown; // strMapCompass_Attri
            MapLegend: {
                Base: {
                    ModeValueInScreenFlag: boolean;
                    LegendXY?: point[];
                    Font?: Font_Property;
                    Visible?: boolean;
                    Back?: BackGround_Box_Property
                    Comma_f?: boolean;
                    Legend_Num?: number;
                };
                Line_DummyKind?: ILegendLineDummyAttri;
                OverLay_Legend_Title?: IOverLayLegendTitleInfo;
                En_Graph_Pattern?: number;
                MarkMD?: {
                    CircleMD_CircleMini_F?: boolean;
                    MultiEnMode_Line?: Line_Property;
                    CircleMDLegendLine?: number;
                };
                ClassMD?: {
                    SeparateGapSize?: number;
                    ClassMarkFrame_Visible?: boolean;
                    PaintMode_Line?: Line_Property;
                    FrequencyPrint?: boolean;
                    SeparateClassWords?: number;
                    PaintMode_Method?: number;
                    CategorySeparate_f?: boolean;
                    PaintMode_Width?: number;
                    ClassBoundaryLine?: Line_Property;
                };
            };
            MapTitle?: {
                Position: point;
                Visible?: boolean;
                Font?: Font_Property;
                Clone?: () => {
                    Position: point;
                    Visible?: boolean;
                    Font?: Font_Property;
                    Back?: BackGround_Box_Property;
                };
                Back?: BackGround_Box_Property
            };
            MapScale?: {
                Position: point;
                Visible?: boolean;
                Clone?: () => {
                    Position: point;
                    Visible?: boolean;
                    BarDistance?: number;
                    BarKugiriNum?: number;
                    Back?: BackGround_Box_Property;
                    Unit?: number;
                };
                BarDistance?: number;
                BarKugiriNum?: number;
                Back?: BackGround_Box_Property;
                Unit?: number;
            };
            DataNote?: {
                Position: point;
                Visible?: boolean;
                Font?: Font_Property;
                MaxWidth?: number;
                Clone?: () => {
                    Position: point;
                    Visible?: boolean;
                    Font?: Font_Property;
                    MaxWidth?: number;
                    Clone?: () => unknown;
                };
            };
            AccessoryGroupBox?: BackGround_Box_Property;
            Zahyo: {
                Mode: number;
                Projection: number;
                CenterXY: point;
            };
            TileMapView: {
                Visible: boolean;
                DrawTiming?: number; // enmDrawTiming
                TileMapDataSet?: unknown;
                AlphaValue?: number;
            };
            Missing_Data?: {
                Print_Flag: boolean;
                Text: string;
                PaintTile: Tile_Property;
                Mark: Mark_Property;
                BlockMark: Mark_Property;
                ClassMark: Mark_Property;
                MarkBar: Mark_Property;
                Label: string;
                LineShape: Line_Property;
                Clone?: () => unknown;
            };
            SouByou?: unknown; // strSoubyou_Data_Info
            DummyObjectPointMark?: unknown[]; // strDummyObjectPointMark_Info[]
            Screen_Back?: BackGround_Box_Property;
            PointPaint_Order?: number; // enmPointOnjectDrawOrder
            ValueShow?: unknown; // strValueShow_Info
            InVisibleObjectBoundaryF?: boolean;
            MeshLine?: Line_Property;
            SymbolLine?: unknown; // strSymbolLine_Info
            LatLonLine_Print?: {
                Lat_Interval?: number;
                Lon_Interval?: number;
                LPat?: Line_Property;
                OuterPat?: Line_Property;
                Equator?: Line_Property;
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
                ObjectPos: number;
                Data: unknown;
            };
            OnObject?: unknown;
            OldObject?: unknown;
            SymbolPointFirstMessage?: boolean;
            LabelPointFirstMessage?: boolean;
            LocationMenuString?: string;
            MultiObjects?: unknown[];
        };
        Accessory_Temp: IAccessoryTemp;
        OnObject?: unknown;
        MouseDownF?: boolean;
        PrintMouseMode?: number;
        PointObjectKindUsedStack?: unknown[];
        MapAreaLatLon?: unknown; // latlonbox
        ContourMode_Temp?: unknown;
        DotMap_Temp?: unknown;
        Series_temp?: unknown;
        OverLay_Temp?: unknown;
        drawing?: boolean;
        SoubyouLinePointIntervalCriteria?: number;
        SoubyouLoopAreaCriteria?: number;
        DataSourceType?: number;
        InVisibleObjectBoundaryF?: boolean;
        ModeValueInScreen_Stac?: unknown[];
        ObjectPrintedCheckFlag?: boolean[];
    };
    LayerData?: ILayerDataInfo[]; // strLayerDataInfo[] (clsAttrData.tsで定義)
    // メソッド
    Get_AllMapLineKind?: () => unknown[];
    Get_LineKindUsedList?: () => unknown[];
    Get_Length_On_Screen?: (arg1?: number) => number;
    Radius?: (size?: number, arg2?: number, arg3?: number) => number;
    Draw_Line?: (arg1: CanvasRenderingContext2D, arg2: Line_Property, arg3?: point[], arg4?: unknown) => void;
    Draw_Print?: (arg1: CanvasRenderingContext2D, arg2: string, arg3?: point, arg4?: unknown, arg5?: string | number, arg6?: string | number) => void;
    Draw_Mark?: (arg1: CanvasRenderingContext2D, arg2: point, arg3?: unknown, arg4?: unknown) => void;
    Get_DataUnit_With_Kakko?: (arg1?: number, arg2?: number) => string;
    Get_PrintError?: () => string[];
    Get_Condition_Info?: (layer?: number) => string;
    Get_Condition_Ok_Num_Info?: (layer?: number) => number;
    Get_ObjectNum?: (layer?: number) => number;
    Check_Condition?: (layer?: number, index?: number) => boolean;
    Get_KenObjName?: (layer?: number, index?: number) => string;
    getSoloMode?: (arg1?: number, arg2?: number) => ISoloModeViewSettings;
    setSoloMode?: (arg1: number, arg2?: number, arg3?: ISoloModeViewSettings) => void;
    Get_DataTitle?: (arg1?: number, arg2?: number, arg3?: boolean) => string;
    Get_SelectedDataTitle?: () => string;
    nowGraph?: () => any; // strGraph_Data (clsAttrData.tsで定義)
    nowLabel?: () => any; // strLabel_Data (clsAttrData.tsで定義)
    ResetMPSubLineXY?: () => void;
    ResetObjectPrintedCheckFlag?: () => void;
    check_AutoSoubyou_Enable?: (arg1?: number, arg2?: number) => boolean;
    layerGraph?: (layerNum?: number) => IGraphMode;
    layerLabel?: (layerNum?: number) => ILabelMode;
    Check_Screen_In?: (CenterP: point, R?: number) => boolean;
    Draw_Tile_RoundBox?: (context: CanvasRenderingContext2D, rect: rectangle, style?: Tile_Property, arg4?: unknown) => void;
    Convert_Zahyo?: (zahyo: number) => void;
    GetMapFileName?: () => string[];
    SetMapFile?: (filename: string) => IMapData;
    Check_Vector_Object?: () => void;
    PrtObjectSpatialIndex?: () => void;
    SetMapViewerData?: (data: unknown, arg2?: unknown, arg3?: unknown) => { ok: boolean; emes: string };
    OpenNewMandaraFile?: (filename: string, callback?: () => void, options?: unknown, layer?: number) => { ok: boolean; emes: string };
    ADD_AttrData?: (data: unknown, flag?: boolean) => { ok: boolean; emes: string };
    Set_LayerName_to?: (selbox: HTMLSelectElement, SelectedIndex?: number, NormalF?: boolean, syntheticF?: boolean, PointF?: boolean, MeshF?: boolean) => void;
    Set_ObjectName_to_selectBox?: (selbox: HTMLSelectElement, Layernum?: number, SelectedObject?: number) => void;
    MapData?: IMapData; // clsAttrMapData (clsAttrData.tsで定義)
    DeleteObjects?: (objects: number[], arg2?: unknown) => void;
    Set_DataTitle_to_cboBox?: (cbox: HTMLSelectElement, Layernum?: number, SelectedIndex?: number, Number_Print_F?: boolean, Normal_F?: boolean, Category_f?: boolean, String_f?: boolean, Special_Astarisk_Num?: number) => void;
    Set_ObjectName_to_checkedListBox?: (selectElement: HTMLElement, layerNum?: number, selectedObject?: number) => void;
    getDummyObjGroupArray?: (Layernum?: number, shape?: number) => { DummyOBGArray: boolean[]; trueNum: number };
    Get_MedianValue?: (layer?: number, data?: number) => number;
    nowLayer?: () => ILayerDataInfo;
    Screen_Back?: BackGround_Box_Property;
    Draw_Tile_Box?: (context: CanvasRenderingContext2D, rect: rectangle, arg3?: unknown, arg4?: unknown, arg5?: unknown) => void;
    Draw_Sample_LineBox?: (arg1?: CanvasRenderingContext2D, arg2?: rectangle, arg3?: unknown, arg4?: unknown) => void;
    Draw_Sample_Mark_Box?: (arg1?: CanvasRenderingContext2D, arg2?: rectangle, arg3?: unknown, arg4?: unknown) => void;
    Get_Length_On_Screen?: (fontSize?: number) => number;
    Draw_Tile_RoundBox?: (context: CanvasRenderingContext2D, rect: rectangle, style?: Tile_Property, arg4?: unknown) => void;
    Draw_Line?: (context: CanvasRenderingContext2D, linePattern: Line_Property, points: point[], style?: unknown) => void;
    Draw_Print?: (context: CanvasRenderingContext2D, text: string, position?: point, font?: unknown, hAlign?: string | number, vAlign?: string | number) => void;
    Get_DataUnit_With_Kakko?: (layerIndex?: number, dataIndex?: number) => string;
    Get_PaddingPixcel?: (style?: Tile_Property) => number;
    Get_DataNote?: (layer?: number, data?: number) => string;
    Get_MaxURLNum?: (Layernum?: number) => number;
    Get_KenObjCode?: (Layernum: number, Objectnum: number) => string;
    Check_screen_Kencode_In?: (kencode: number, arg2?: unknown) => boolean;
    Check_Screen_Objcode_In?: (objcode: number, arg2?: unknown) => boolean;
    Get_DataNum?: (layer?: number) => number;
    
    // 追加プロパティ・メソッド
    Print_Mode_Total?: number;
    nowDataSolo?: () => ISoloModeViewSettings;
    nowData?: () => IDataItem;
    nowLayer?: () => ILayerDataInfo;
    nowSeries?: () => ISeriesDatasetInfo;
    nowOverlay?: () => IOverLayDatasetInfo;
    Twocolort?: colorRGBA[];
    Threecolor?: colorRGBA[];
    FourColor?: colorRGBA[];
    Get_DataNote?: (layer?: number, data?: number) => string;
    Get_Data_Value?: (Layernum?: number, DataNum?: number, Obj?: number, Missing_word?: string) => string | number;
    Get_DataUnit?: (layer?: number, data?: number) => string;
    Get_DataType?: (layer?: number, data?: number) => number;
    Get_Missing_Value_DataArray?: (layer?: number, data?: number) => unknown[];
    Get_Data_Cell_Array_With_MissingValue?: (layer?: number, object?: number, data?: number) => unknown[];
    Add_One_Data_Value?: (Layernum: number, Title: string, Unit: string, Note: string, Data_Val_str: string, Missing_F?: boolean) => boolean;
    Check_Missing_Value?: (layer?: number, object?: number, data?: number) => boolean;
    Check_Enable_SoloMode?: (soloMode?: unknown, layernum?: number, dataNum?: number) => boolean;
    Get_CategolyArray?: (layer?: number, data?: number) => unknown[];
    Get_Categoly?: (layer?: number, data?: number, index?: number) => unknown;
    Draw_Poly_Inner?: (context: CanvasRenderingContext2D, points: point[], style?: unknown, tile?: Tile_Property) => void;
    Get_InnerTile?: (layer?: number, object?: number, arg3?: unknown) => Tile_Property;
    Get_Enable_KenCode_MPLine?: (layer?: number, object?: number) => boolean;
    Get_DataMin?: (layer?: number, data?: number) => number;
    Get_DataMax?: (layer?: number, data?: number) => number;
    Get_ClassFrequency?: (layer?: number, data?: number, classNum?: number) => number;
    Get_CenterP?: (layer?: number, object?: number) => point;
    Check_Condition_UMU?: (layer?: number) => boolean;
    Set_DataTitle_to_CheckedListBox?: (CheckedListBox: HTMLElement, Layernum: number, defoChecked?: boolean, Number_Print_F?: boolean, Normal_F?: boolean, Category_f?: boolean, String_f?: boolean, Special_Astarisk_Num?: number) => void;
    Get_DivNum?: (layer?: number, data?: number) => number;
    Check_Point_in_Kencode_OneObject?: (layernum: number, objnum: number, mapP: point) => boolean;
    Set_Legend?: (D_Layer: number, D_DataNum: number, O_Data: unknown, ClassPaintF?: boolean, MarkSizeF?: boolean, MarkSizeValueCopyF?: boolean, MarkBlockF?: boolean, ContourF?: boolean, ClassMarkF?: boolean, ClassODF?: boolean, StringModeF?: boolean, MarkBarF?: boolean, ClassODOriginCopyF?: boolean, copyMarkCommonInnerDataF?: boolean) => void;
    Draw_Fan?: (context: CanvasRenderingContext2D, centerP: point, radius: number, startAngle: number, endAngle: number, style?: unknown, tile?: Tile_Property) => void;
    Get_SxSy_With_3D?: (point: point) => point;
    ClassMD?: unknown; // strClassMode_Data (clsAttrData.tsで定義)
    saveAsMDRJ?: (filename?: string, options?: unknown) => void;
    Sort_OverLay_Data?: (arg1?: unknown, arg2?: unknown) => unknown;
    Sort_OverLay_Data_Sub?: (arg1?: unknown, arg2?: unknown) => unknown;
    Boundary_Kencode_Arrange?: (layer?: number, object?: number, time?: unknown) => unknown[];
    GetObjMenseki?: (layer?: number, object?: number) => number;
    Get_MaxMinValue_Range?: (layer?: number, data?: number) => { min: number; max: number };
    Get_OD_Label_Position?: (layer?: number, object?: number) => point;
    Get_Symbol_Position?: (layer?: number, object?: number) => point;
    Get_Label_Position?: (layer?: number, object?: number) => point;
    Get_KenCode_Circumscribed_Rectangle?: (layer?: number, object?: number) => rectangle;
    Get_Kencode_Object_Circumscribed_Rectangle?: (layer?: number, object?: number) => rectangle;
    Draw_Arrow?: (context: CanvasRenderingContext2D, arg2?: unknown, arg3?: unknown, arg4?: unknown, arg5?: unknown) => void;
    getMpLineDrawn?: (layer?: number, lineCode?: number) => boolean;
    setMpLineDrawn?: (layer?: number, lineCode?: number, drawn?: boolean) => void;
    setLineKindUseChecked?: (layer?: number, lineKind?: number, arg3?: unknown, checked?: boolean) => void;
    ResetMPSubLineDrawn?: (mapFileName?: string) => void;
    ResetMPSubLineXY?: (layer?: number) => void;
    Get_MPSubLineXY?: (layer?: number, lineCode?: number, arg3?: unknown) => point[];
    Set_MPSubLineXY?: (layer?: number, lineCode?: number, points?: point[], reverse?: boolean) => void;
    GetAllMapLineKindName?: () => string[];
    Get_AllMapLineKind?: () => unknown[];
    getDataTitleName?: (Layernum: number, Number_Print_F?: boolean, Normal_F?: boolean, Category_f?: boolean, String_f?: boolean, Special_Astarisk_Num?: number) => string[];
    Get_Data_Cell_Array_Without_MissingValue?: (layer?: number, object?: number, data?: number) => unknown[];
    Set_DummyObjectName_to_checkedListBox?: (element: HTMLElement, layerNum?: number, selectedObject?: number) => void;
    Set_DummyObjectName_to_selectBox?: (selbox: HTMLSelectElement, layernum: number, selectedObject: number) => void;
    Get_LayerName?: (layer?: number) => string;
    Get_DataMissingNum?: (layer?: number, data?: number) => number;
    Get_ObjectCode_from_ObjName?: (layer?: number, objName?: string) => number;
    // 追加メソッド
    getSeriesDataSetName?: () => string[];
    SeriesMode_to_ListViewData?: (seriesListView: HTMLElement, DataSetItem: unknown) => void;
    getGraphTitle?: (layernum: number) => { text: string }[];
    getLabelTitle?: (layernum: number) => { text: string }[];
    getOverlayTitle?: () => { text: string }[];
    Get_ObjectGravityPoint?: (layernum: number, objNumber: number) => { ok: boolean; gpoint: point };
    Get_ObjectLength?: (layernum: number, objNum: number) => number;
    // 距離計算メソッド
    Distance_Kencode_Point?: (layernum: number, obj: number, point: point) => number;
    Distance_Kencode_Object?: (objNum1: number, objNum2: number, layNum1: number, layNum2: number) => number;
    Distance_Kencode_MPObject?: (layNum1: number, objNum1: number, mapFile: unknown, objCode2: number, time: unknown) => number;
    getOneObjectPanelLabelString?: (layernum: number, arg2?: unknown, objNum?: number, arg4?: unknown) => string;
    Set_Acc_First_Position?: () => void;
    Set_Class_Div?: (layernum: number, dataNum: number, setStartPos?: unknown) => void;
    Set_Div_Value?: (layernum: number, dataNum: number) => void;
    SetMapFile?: (mapFileName: string) => IMapData;
    AddPointObjectKindUsed?: (layer?: number, object?: number, arg3?: unknown) => unknown;
    AddExistingMapData?: (mapData: IMapData, mapFileName: string) => void;
    Get_Check_Enable_SoloMode?: (soloMode?: unknown, layerNum?: number, dataNum?: number) => boolean;
}

// Accessory_Temp（拡張版）
interface IAccessoryTemp {
    MapLegend_W: IMapLegendW[];
    [key: string]: any;
}

// MapLegend_W（拡張版）
interface IMapLegendW {
    Layn: number;
    DatN: number;
    Print_Mode_Layer: number; // enmLayerMode_Number
    SoloMode: number;
    GraphMode: number;
    LabelMode?: number;
    title: string;
    LineKind_Flag: boolean;
    PointObject_Flag: boolean;
    OverLay_Printing_Flag?: boolean;
    [key: string]: any;
}

// OverLay DataSet情報（拡張版）
interface IOverLayDatasetInfo {
    title: string;
    DataItem: IOverLayDataItem;
    initData?: () => void;
    [key: string]: any;
}

// OverLay DataItem（拡張版）
interface IOverLayDataItem {
    Count: number;
    [index: number]: IOverLayDataItemElement;
    Clone?: () => IOverLayDataItem;
    [key: string]: any;
}

// OverLay DataItem要素（拡張版）
interface IOverLayDataItemElement {
    Layer: number;
    DataNumber: number;
    Print_Mode_Layer: number;
    Clone?: () => IOverLayDataItemElement;
    [key: string]: any;
}

// Series DataSet情報（拡張版）
interface ISeriesDatasetInfo {
    title: string;
    DataItem: any;
    initData?: () => void;
    [key: string]: any;
}

// レイヤーデータ情報（拡張版）
interface ILayerDataInfo {
    Name: string;
    MapFileName: string;
    MapFileData: any; // clsMapdata
    MapFileObjectNameSearch: any; // clsObjectNameSearch
    Shape: number; // enmShape
    Type: number; // enmLayerType
    MeshType: number; // enmMesh_Number
    ReferenceSystem: number; // enmZahyo_System_Info
    Time: any; // strYMD
    Comment: string;
    TripTimeSpan: unknown;
    TripType: number; // enmTripPositionType
    atrObject: IObjectInfo;
    atrData: IAttrDataInfo;
    Dummy: any[]; // strDummyObjectName_and_Code[]
    DummyGroup: number[];
    Print_Mode_Layer: number; // enmLayerMode_Number
    LayerModeViewSettings: ILayerModeViewSettings;
    PrtSpatialIndex: any; // clsSpatialIndexSearch
    ObjectGroupRelatedLine: number[];
    ODBezier_DataStac: any[]; // ODBezier_Data[]
}

// オブジェクト情報（拡張版）
interface IObjectInfo {
    ObjectNum: number;
    [key: string]: any;
}

// 属性データ情報（拡張版）
interface IAttrDataInfo {
    Count: number;
    Data: IDataItem[];
    SelectedIndex: number;
    [key: string]: any;
}

// データ項目（拡張版）
interface IDataItem {
    DataType: number;
    Title: string;
    Unit: string;
    Note: string;
    SoloModeViewSettings: ISoloModeViewSettings;
    [key: string]: any;
}

// ソロモード表示設定（拡張版）
interface ISoloModeViewSettings {
    SoloMode: number;
    ClassPaintMode: IClassPaintMode;
    MarkSizeMode: IMarkSizeMode;
    MarkBlockMode: IMarkBlockMode;
    MarkBarMode: IMarkBarMode;
    ClassODMode: IClassODMode;
    ClassODMD: IClassODMD;
    ContourMode: IContourMode;
    TripMode: any;
    StringMode: any;
    MarkSizeMD: any;
    MarkBlockMD: any;
    MarkBarMD: any;
    ClassMarkMode: any;
    MarkTurnMode: any;
    Class_Div: any[];
    Div_Num: number;
    [key: string]: any;
}

// クラス塗り分けモード（拡張版）
interface IClassPaintMode {
    color1?: colorRGBA;
    color2?: colorRGBA;
    color3?: colorRGBA;
    Color_Mode?: number;
    Clone?: () => IClassPaintMode;
    [key: string]: any;
}

// 記号の大きさモード（拡張版）
interface IMarkSizeMode {
    MaxValueMode?: number;
    MaxValue?: number;
    Value?: number[];
    Mark?: Mark_Property;
    LineShape?: any;
    Clone?: () => IMarkSizeMode;
    [key: string]: any;
}

// 記号の数モード（拡張版）
interface IMarkBlockMode {
    Value?: number;
    ArrangeB?: number;
    HasuVisible?: boolean;
    Mark?: Mark_Property;
    Overlap?: number;
    LegendBlockModeWord?: string;
    Clone?: () => IMarkBlockMode;
    [key: string]: any;
}

// 記号の棒モード（拡張版）
interface IMarkBarMode {
    Width?: number;
    MaxHeight?: number;
    MaxValueMode?: number;
    MaxValue?: number;
    InnerTile?: Tile_Property;
    FrameLinePat?: Line_Property;
    ThreeD?: boolean;
    ScaleLineInterval?: number;
    ScaleLineVisible?: boolean;
    scaleLinePat?: Line_Property;
    BarShape?: number;
    Clone?: () => IMarkBarMode;
    [key: string]: any;
}

// 線引きモード（拡張版）
interface IClassODMode {
    o_Layer?: number;
    O_object?: number;
    Dummy_ObjectFlag?: boolean;
    Arrow?: Arrow_Data;
    Clone?: () => IClassODMode;
    [key: string]: any;
}

// 等値線モード（拡張版）
interface IContourMode {
    Interval_Mode?: number;
    Draw_in_Polygon_F?: boolean;
    Spline_flag?: boolean;
    Detailed?: number;
    Regular?: any;
    IrregularNum?: number;
    Irregular?: any[];
    Clone?: () => IContourMode;
    [key: string]: any;
}

// クラスODモード設定（拡張版）
interface IClassODMD {
    Arrow: Arrow_Property;
    [key: string]: any;
}

// レイヤーモード表示設定（拡張版）
interface ILayerModeViewSettings {
    GraphMode: IGraphMode;
    LabelMode: ILabelMode;
    PointLineShape: any;
    PolygonDummy_ClipSet_F: boolean;
    [key: string]: any;
}

// グラフモード（拡張版）
interface IGraphMode {
    DataSet: IGraphDataSet[];
    SelectedIndex?: number;
    initDataSet?: () => void;
    [key: string]: any;
}

// グラフデータセット（拡張版）
interface IGraphDataSet {
    Data: IGraphDataItem[];
    Type?: number;
    length?: number;
    [key: string]: any;
}

// グラフデータ項目（拡張版）
interface IGraphDataItem {
    DataNumber: number;
    Layer?: number;
    [key: string]: any;
}

// ラベルモード（拡張版）
interface ILabelMode {
    DataSet: ILabelDataSet[];
    SelectedIndex?: number;
    initDataSet?: () => void;
    [key: string]: any;
}

// ラベルデータセット（拡張版）
interface ILabelDataSet {
    Data: ILabelDataItem[];
    length?: number;
    [key: string]: any;
}

// ラベルデータ項目（拡張版）
interface ILabelDataItem {
    DataNumber: number;
    Layer?: number;
    [key: string]: any;
}

// マップデータ（拡張版）
interface IMapData {
    Map: IMapInfo;
    LineKind?: any[]; // Line_Pattern配列
    [key: string]: any;
}

// マップ情報（拡張版）
interface IMapInfo {
    MapCompass: IMapCompassInfo;
    ALIN?: number;
    ObjectNumber?: number;
    LpNum?: number;
    SCL?: number;
    [key: string]: any;
}

// マップコンパス情報（拡張版）
interface IMapCompassInfo {
    Mark: Mark_Property;
    Position?: point;
    Visible?: boolean;
    [key: string]: any;
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
    dragBorder?: (arg1: MouseEvent, arg2: HTMLElement) => void;
    resetMaxButton?: (flag?: boolean) => void;
}

// プロパティウィンドウ（拡張）
interface IPropertyWindow extends ExtendedHTMLDivElement {
    copyButton: HTMLInputElement;  // 実際はHTMLInputElement
    rightPositionFixed: boolean;
    relativePosition: point;
    fixed: boolean;
    nextVisible: boolean;
    pnlProperty?: HTMLDivElement;
    objInfo?: HTMLElement;
    oObject?: number;
    oLayer?: number;
    oData?: number;
    // HTMLDivElementのプロパティを継承
    dragBorder?: (arg1: MouseEvent, arg2: HTMLElement) => void;
    getVisibility?: () => boolean;
    setVisibility?: (visible: boolean) => void;
}

// Generic ユーティリティクラス（拡張）
interface IGeneric {
    alert: (event: Event | undefined, message: string) => void;
    prompt: (event: Event, title: string, defaultValue: string, callback: (value: string) => void) => void;
    confirm: (event: Event, message: string, callback: (confirmed: boolean) => void) => void;
    createNewDiv: (parent: HTMLElement, id: string, className: string, innerHTML: string, left: number, top: number, width: number, height: number, style: string, tooltip: string | undefined) => HTMLDivElement;
    createNewButton: (parent: HTMLElement, text: string, className: string, left: number, top: number, onClick: (e: Event) => void, style: string) => HTMLButtonElement;
    createNewSpan: (parent: HTMLElement, text: string, className: string, innerHTML: string, left: number, top: number, style: string, tooltip: string | undefined) => HTMLSpanElement;
    createNewFrame: (parent: HTMLElement, id: string, className: string, left: number, top: number, width: number, height: number, title: string) => HTMLDivElement;
    createNewCheckBox: (parent: HTMLElement, text: string, className: string, checked: boolean, left: number, top: number, tooltip: string | undefined, onChange: (element: HTMLInputElement) => void, style: string) => HTMLInputElement;
    createNewRadioButtonList: (parent: HTMLElement, name: string, items: any[], left: number, top: number, tooltip: string | undefined, itemHeight: number, selectedValue: any, onChange: (value: number) => void, style: string) => void;
    createNewWordNumberInput: (parent: HTMLElement, label: string, unit: string, value: number, className: string, left: number, top: number, tooltip: string | undefined, inputWidth: number, onChange: (element: HTMLElement, value: number) => void, style: string) => HTMLInputElement;
    set_backDiv: (id: string, title: string, width: number, height: number, modal: boolean, closeButton: boolean, okButton: (() => void) | number, opacity: number, draggable: boolean, resizable?: boolean) => HTMLDivElement;
    getBrowserWidth: () => number;
    getBrowserHeight: () => number;
    copyText: (text: string) => void;
    Set_Box_Position_in_Browser: (event: Event, element: HTMLElement) => void;
    Array2Dimension: (array: any[], dimensions: number[]) => any;
    Array2Clone: (array: any[]) => any[];
    ceatePopupMenu: (menu: any, position: point) => void;
    [key: string]: any;
}

// clsPrint クラス（拡張）
interface IClsPrint {
    printMapScreen: (canvas: HTMLCanvasElement) => void;
    [key: string]: any;
}

// clsDraw クラス（拡張）
interface IClsDraw {
    print: (g: CanvasRenderingContext2D, text: string, position: point, font: Font_Property, hAlign: number, vAlign: number, scrData: Screen_info) => void;
    DrawText2: (g: CanvasRenderingContext2D, position: point, text: string, font: Font_Property, scrData: Screen_info) => void;
    Line: (g: CanvasRenderingContext2D, linePat: Tile_Property, arg3: point | point[], arg4?: point | Screen_info, arg5?: Screen_info) => void;
    Draw_Tile_and_Paint_and_Line: (g: CanvasRenderingContext2D, points: point[], nPolyP: number[], polyNum: number, tile: Tile_Property, linePat: Tile_Property, scrData: Screen_info) => void;
    Arrow: (g: CanvasRenderingContext2D, point: point, beforePoint: point, linePat: Tile_Property, arrow: Arrow_Property, scrData: Screen_info) => void;
    [key: string]: any;
}

// 強化されたグローバル変数宣言
// attrData: AppStateで管理（削除済み）
declare const Generic: IGeneric;
declare const clsSettingData: unknown;
declare const clsTime: unknown;
declare const clsDraw: IClsDraw;
declare const clsPrint: IClsPrint;
// frmPrint: AppStateで管理（削除済み）
declare let Frm_Print: IFrmPrint; // 変更される可能性あり
// propertyWindow: AppStateで管理（削除済み）
// divmain: AppStateで管理（削除済み）
declare const TKY2JGD: unknown; // kept temporarily; being migrated to ESM import
// tileMapClass: AppStateで管理（削除済み）
// preReadMapFile: AppStateで管理（削除済み）
// scrMargin: AppStateで管理（削除済み）
// logWindow: AppStateで管理（削除済み）

declare let tx: string; // 一時変数
declare let mnuPropertyWindow: unknown; // 変更される可能性あり
declare let fname: string; // 一時変数
declare let i: number; // ループカウンタ
declare let j: number; // ループカウンタ
declare let k: number; // ループカウンタ
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
    Tag?: string | number;
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
    Fringe: Fringe_Line_Info[];
    Arrange_LineCode: number[];
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

// 矢印プロパティクラス
declare class Arrow_Property {
    ArrowHeadType: number; // enmArrowHeadType
    Start_Arrow_F: boolean;
    End_Arrow_F: boolean;
    Angle: number;
    LWidthRatio: number;
    WidthPlus: number;
    Clone(): Arrow_Property;
}

// 背景プロパティクラス  
declare class Back_Property {
    Clone(): Back_Property;
}

// 緯度経度クラス (IdoKeido)
declare class IdoKeido {
    lat: number;
    lon: number;
    Clone(): IdoKeido;
}

// Edge プロパティクラス
declare class Edge_Property {
    Clone(): Edge_Property;
}

// Screen_info クラス (clsAttrData.tsで実装)
declare class Screen_info {
    STDWsize: number;
    GSMul: number;
    SampleBoxFlag: boolean;
    Get_SxSy_With_3D(p: point): point;
    Get_Length_On_Screen(fontSize: number): number;
    Clone(): Screen_info;
}

// Font_Property クラス (clsTime.tsで実装)
declare class Font_Property {
    Color: colorRGBA;
    Size?: number;
    italic: boolean;
    bold: boolean;
    Underline: boolean;
    Name?: string;
    Kakudo: number;
    FringeF: boolean;
    FringeWidth: number;
    FringeColor: colorRGBA;
    Back: BackGround_Box_Property;
    Body?: Font_Property; // 再帰的プロパティ（一部のコードで使用）
    Clone(): Font_Property;
    toContextFont(ScrData: Screen_info): { font: string | undefined; height: number };
}

// BackGround_Box_Property クラス (clsTime.tsで実装)
declare class BackGround_Box_Property {
    Tile: Tile_Property;
    Line: Line_Property;
    Round?: number;
    Padding?: number;
    Visible?: boolean;
    Back?: BackGround_Box_Property;
    Clone(): BackGround_Box_Property;
}

// Line_Property クラス (clsTime.tsで実装)
declare class Line_Property {
    BlankF: boolean;
    Width: number;
    Color: colorRGBA;
    Edge_Connect_Pattern: any; // LineEdge_Connect_Pattern_Data_Info
    Clone(): Line_Property;
    Set_Same_ColorWidth_to_LinePat(Color: colorRGBA, width: number): void;
}

// Tile_Property クラス (clsTime.tsで実装)
declare class Tile_Property {
    BlankF: boolean;
    Color: colorRGBA;
    Clone(): Tile_Property;
}

// Mark_Property クラス (clsTime.tsで実装)
declare class Mark_Property {
    PrintMark?: number;
    ShapeNumber?: number;
    Tile: Tile_Property;
    Line: Line_Property;
    wordmark?: string;
    WordFont: Font_Property;
    Clone(): Mark_Property;
}

// 型エイリアス
type MarkSizeMD = any; // strMarkSize_Data
type MarkBlockMD = any; // strMarkBlock_Data
type MapCompass = any; // strMapCompass_Attri
type color = colorRGBA; // colorRGBAの型エイリアス
type Arrow = Arrow_Property; // Arrow_Propertyの型エイリアス

// ==================== 列挙型定義強化 ====================

declare const enmGraphMaxSize: {
    Fixed: 0;
    Changeable: 1;
};

declare const enmBarLineMaxMinMode: {
    Auto: 0;
    Manual: 1;
};

declare const enmBasePosition: {
    Screen: 0;
    Map: 1;
};

declare const enmSoloMode_Number: {
    noMode: -1;
    ClassPaintMode: 0;
    MarkSizeMode: 1;
    MarkBlockMode: 2;
    ContourMode: 3;
    ClassHatchMode: 4;
    ClassMarkMode: 5;
    ClassODMode: 6;
    MarkTurnMode: 7;
    MarkBarMode: 8;
    StringMode: 9;
};

declare const enmShape: {
    NotDeffinition: -1;
    PointShape: 0;
    LineShape: 1;
    PolygonShape: 2;
};

declare const enmMarkBarShape: {
    bar: 0;
    triangle: 1;
};

declare const enmContourIntervalMode: {
    RegularInterval: 0;
    SeparateSettings: 1;
    ClassPaint: 2;
    ClassHatch: 3;
};

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
    Edge_Pattern?: number; // enmEdge_Pattern
    Join_Pattern?: number; // enmJoinPattern
    MiterLimitValue?: number;
}

declare class Line_Property {
    BlankF?: boolean;
    Edge_Connect_Pattern?: LineEdge_Connect_Pattern_Data_Info;
    Width?: number;
    Color?: colorRGBA;
    Pattern?: number[];
    Pat?: unknown; // LinePattern関連
    Set_Same_ColorWidth_to_LinePat?: (color: colorRGBA, width: number) => void;
    Clone?: () => Line_Property;
    Draw_Fan?: (...args: unknown[]) => void;
}

declare class Tile_Property {
    BlankF?: boolean;
    Color?: colorRGBA;
    Line?: Line_Property;
    BasicLine?: Line_Property;
    TileCode?: number;
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
    toContextFont?(ScrData: unknown): { font: string | undefined; height: number };
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
    Arrange_LineCode?: number[];
    Pon?: number;
    constructor();
}

declare class Setting_Info {
    [key: string]: unknown;
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
    static Arrow(): Arrow_Data;
    static LineEdge(): LineEdge_Connect_Pattern_Data_Info;
    static Line(): Line_Property;
    static BlankLine(): Line_Property;
    static BoldLine(): Line_Property;
    static Tile(): Tile_Property;
    static BlancTile(): Tile_Property;
    static PaintTile(col: colorRGBA): Tile_Property;
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
    selectedRow?: number;
    inPanel?: number;
    addSelectList?: (items: unknown[], arg2?: unknown, arg3?: unknown, arg4?: unknown) => void;
    getText?: () => string;
    getValue?: () => string | number;
    setSelectText?: (text: string) => void;
    setSelectData?: (data: unknown, arg2?: unknown, arg3?: unknown) => void;
    setAstarisk?: (index?: number, flag?: boolean) => void;
    setSelectValue?: (value: string | number) => void;
}

interface HTMLDivElement {
    tooltip?: string;
    selected?: boolean;
    selectedRow?: number;
    tab?: HTMLElement[];
    table?: HTMLElement;
    selectedIndex?: number;
    tag?: string | number;
    maxSizeFlag?: boolean;
    oldpos?: rectangle;
    dragBorder?: (arg1: MouseEvent, arg2: HTMLElement) => void;
    enabled?: boolean;
    submenunum?: number;
    Capture?: boolean;
    addSelectList?: (items: unknown[], arg2?: unknown, arg3?: unknown, arg4?: unknown) => void;
    setSelectData?: (arg1?: unknown, arg2?: unknown, arg3?: unknown) => void;
    setAstarisk?: (index?: number, flag?: boolean) => void;
    setSelectValue?: (value: string | number) => void;
    setNumberValue?: (value: number) => void;
    inPanel?: number;
    panel?: HTMLElement[];
}

interface HTMLCanvasElement {
    tag?: string | number;
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
    tag?: string | number;
    preValue?: string | number;
    word?: string;
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
    addSelectList?: (items: unknown[], arg2?: unknown, arg3?: unknown, arg4?: unknown) => void;
    setSelectData?: (arg1?: unknown, arg2?: unknown, arg3?: unknown) => void;
    setAstarisk?: (index?: number, flag?: boolean) => void;
    setSelectValue?: (value: string | number) => void;
    setNumberValue?: (value: number) => void;
    inPanel?: number;
    panel?: HTMLElement[];
    selectedRow?: number;
}

interface Math {
    Max: typeof Math.max;
}

// Legacy globals still referenced across the codebase (typed as unknown for now)
declare function clsSelectData(...args: unknown[]): unknown;
declare class GraphModeDataItem { [key: string]: unknown; constructor(...args: unknown[]); }
declare function clsTileSet(...args: unknown[]): unknown;
declare function clsLinePatternSet(...args: unknown[]): unknown;
declare function graphModeEn_Obi(...args: unknown[]): unknown;
declare function graphModeOresen_Bou(...args: unknown[]): unknown;
declare function openMapFile(...args: unknown[]): unknown;
declare class clsMapdata { [key: string]: unknown; constructor(...args: unknown[]); }
declare class clsAttrData implements IAttrData { 
    TotalData: IAttrData['TotalData'];
    TempData: IAttrData['TempData'];
    LayerData: IAttrData['LayerData'];
    [key: string]: unknown; 
    constructor(...args: unknown[]); 
}
declare class clsTileMap { [key: string]: unknown; constructor(...args: unknown[]); }
declare class clsDrawMarkFan {
    static init?: (...args: unknown[]) => unknown;
    static getMarkShameNum?: (...args: unknown[]) => unknown;
    static Draw_Fan?: (...args: unknown[]) => unknown;
    static Draw_Mark_Sample_Box?: (...args: unknown[]) => unknown;
    static Mark_Print?: (...args: unknown[]) => unknown;
}
declare const ListBox: unknown;
declare const CheckedListBox: unknown;
declare const ListViewTable: unknown;
declare function frmPrint_DummyObjectGroup(...args: unknown[]): unknown;
declare function frmProjectionConvert(...args: unknown[]): unknown;
declare function frmPrintOption(...args: unknown[]): unknown;
declare function frmPrint_ObjectValue(...args: unknown[]): unknown;
declare function frmPrint_backImageSet(...args: unknown[]): unknown;
declare function frmCompassSettings(...args: unknown[]): unknown;
declare class clsSpline { static Spline_Get?: (...args: unknown[]) => unknown; }
declare class strLocationSearchObject { [key: string]: unknown; constructor(...args: unknown[]); }
declare class LPatSek_Info { [key: string]: unknown; constructor(...args: unknown[]); }
declare class strCondition_Limitation_Info { [key: string]: unknown; constructor(...args: unknown[]); }
declare class strDummyObjectName_and_Code { [key: string]: unknown; constructor(...args: unknown[]); }
declare class strOverLay_DataSet_Item_Info { [key: string]: unknown; constructor(...args: unknown[]); }
declare class strContour_Data_Irregular_interval { [key: string]: unknown; constructor(...args: unknown[]); }
declare class strClass_Div_data { [key: string]: unknown; constructor(...args: unknown[]); }
declare class clsSortingSearch { [key: string]: unknown; constructor(...args: unknown[]); }
declare function clsColorPicker(...args: unknown[]): unknown;
declare function clsMarkSet(...args: unknown[]): unknown;
declare function clsInnerDataSet(...args: unknown[]): unknown;
declare function clsLineEdgePattern(...args: unknown[]): unknown;
declare function clsColorChart(...args: unknown[]): unknown;
declare function clsArrow(...args: unknown[]): unknown;
declare function clsGrid(...args: unknown[]): unknown;
declare function clsCompassSettings(...args: unknown[]): unknown;
declare function frmMain_Buffer(...args: unknown[]): unknown;
declare function frmMain_AreaPeripheri(...args: unknown[]): unknown;
declare function frmMain_Culc(...args: unknown[]): unknown;
declare function frmMain_GetDistance(...args: unknown[]): unknown;
declare function frmMain_ConditionSettings(...args: unknown[]): unknown;
declare function frmMainCopyDataSettings(...args: unknown[]): unknown;
declare function frmMain_SetSeriesMode(...args: unknown[]): unknown;
declare function frmMain_MarkPosition(...args: unknown[]): unknown;
declare function frmMain_LayeObjectSelectOne(...args: unknown[]): unknown;
declare function settingFront(...args: unknown[]): unknown;
declare const clsSpatialIndexSearch: unknown;
declare class strFrmCopyObjectName_init_parameter_data { [key: string]: unknown; constructor(...args: unknown[]); }
declare function frmCopyObjectName(...args: unknown[]): unknown;
declare class strOverLay_Dataset_Info { [key: string]: unknown; constructor(...args: unknown[]); }
declare class strSeries_Dataset_Info { [key: string]: unknown; constructor(...args: unknown[]); }
declare class strCondition_DataSet_Info { [key: string]: unknown; constructor(...args: unknown[]); }
declare class strCondition_Data_Info { [key: string]: unknown; constructor(...args: unknown[]); }
declare class strObject_Data_Info { [key: string]: unknown; constructor(...args: unknown[]); }
declare class strSeries_DataSet_Item_Info { [key: string]: unknown; constructor(...args: unknown[]); }
declare class strTileMapViewInfo { [key: string]: unknown; constructor(...args: unknown[]); }
declare class strCompass_Attri { [key: string]: unknown; constructor(...args: unknown[]); }
declare class clsDrawLine { [key: string]: unknown; static Arrow?: (...args: unknown[]) => unknown; static Line?: (...args: unknown[]) => unknown; static Draw_Sample_LineBox?: (...args: unknown[]) => unknown; static Check_Draw_Arrow_Line?: (...args: unknown[]) => unknown; }
declare class clsDrawTile { [key: string]: unknown; static Darw_Sample_BackGroundBox?: (...args: unknown[]) => unknown; static Draw_Poly_Inner?: (...args: unknown[]) => unknown; static Draw_Tile_Box?: (...args: unknown[]) => unknown; static Draw_Tile_RoundBox?: (...args: unknown[]) => unknown; }
declare class tileList_Data_Info { [key: string]: unknown; constructor(...args: unknown[]); }
declare class EnableMPLine_Data { [key: string]: unknown; constructor(...args: unknown[]); }
declare class strContour_Line_property { [key: string]: unknown; constructor(...args: unknown[]); }
declare class clsMeshContour { [key: string]: unknown; constructor(...args: unknown[]); }
declare class Legend2_Atri { [key: string]: unknown; constructor(...args: unknown[]); }
declare class clsFontSet { [key: string]: unknown; constructor(...args: unknown[]); }
declare function clsFontSet(...args: unknown[]): unknown;
declare function clsDrawTileSample(...args: unknown[]): unknown;
declare const enmBasePosition: unknown;
declare const enmSoloMode_Number: unknown;
declare const enmKenCodeObjectstructure: unknown;
declare const enmLayerMode_Number: unknown;
declare const enmObjectGoupType_Data: unknown;
declare const enmCondition: unknown;
declare const enmDataSource: unknown;
declare const enmPrint_Enable: unknown;
declare const enmMarkPrintType: unknown;
declare const enmDivisionMethod: unknown;
declare const enmPaintColorSettingModeInfo: unknown;
declare const enmMarkBlockArrange: unknown;
declare const enmMarkBarShape: unknown;
declare const enmMarkSizeValueMode: unknown;
declare const enmContourIntervalMode: unknown;
declare const enmBarLineMaxMinMode: unknown;
declare const enmMarkMaxValueType: unknown;
declare const enmInner_Data_Info_Mode: unknown;
declare const enmClassMode_Meshod: unknown;
declare const enmEdge_Pattern: unknown;
declare const enmSeparateClassWords: unknown;
declare const enmScaleBarPattern: unknown;
declare const enmGraphMaxSize: unknown;
declare const enmStackedBarChart_Direction: unknown;
declare const enmBarChartFrameAxePattern: unknown;
declare const enmMultiEnGraphPattern: unknown;
declare const enmLatLonLine_Order: unknown;
declare const enmOutputDevice: unknown;
declare const enmDrawTiming: unknown;
declare const enmLineConnect: unknown;
declare const enmPointOnjectDrawOrder: unknown;
declare const Quad_Mesh_Info: unknown;
declare const LineCodeStac_Data: unknown;
declare const strDefTimeAttDataEach_Info: unknown;
declare const strDefTimeAttData_Info: unknown;

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
    Detail: unknown;
    MapCompass: unknown;
}
declare const strMap_data: {
    new(): strMap_data;
    prototype: strMap_data;
};

interface EventTarget {
    tag?: string | number;
    selectedIndex?: number;
    value?: string | number | unknown;
}

// 関数
declare function logX(data: unknown): void;
declare function init(): void;
declare function setting(search: string): void;
declare function contextMenuPrevent(e: Event): void;
declare function frmPrintFront(): void;
declare function FrmprintMenuClick(pos: point): void;
declare function dataValueShow(): void;
declare function backImageButton(): void;
declare function mapMouse(canvas: HTMLCanvasElement, callback: Function): void;
declare function AddMeshPoint(objectNum: number, action: unknown): void;
declare function AddMeshRect(objectNum: number, action: unknown): void;

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

declare const TKY2JGDInfo: unknown;



// String prototype extensions
interface String {
    left(length: number): string;
    mid(start: number, length?: number): string;
    midReplace(start: number, replaceString: string): string;
    replaceAll(org: string, dest: string): string;
}

// Zlib library
declare const Zlib: {
    Zip: new() => unknown;
    Unzip: new(buffer: Uint8Array) => unknown;
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
    preValue?: string | number;
    setNumberValue?: (value: number) => void;
    btnDisabled?: (disabled: boolean) => void;
    numberCheck?: unknown;
}

interface HTMLDivElement {
    tooltip?: string;
    selected?: boolean;
    setTitle?: (title: string) => void;
    setVisibility?: (visible: boolean) => void;
    panel?: unknown;
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
    inPic?: unknown;
    inTxt?: unknown;
    numberCheck?: unknown;
    getText?: () => string;
    getValue?: () => string | number | unknown;
    setSelectText?: (text: string) => void;
}

interface HTMLTextAreaElement {
    getVisibility?: () => boolean;
    setVisibility?: (visible: boolean) => void;
    select?: () => void;
    Tag?: string | number;
    tag?: string | number;
}

interface HTMLCanvasElement {
    tag?: string | number;
}

interface HTMLSelectElement {
    addSelectList?: (items: unknown[], arg2?: unknown, arg3?: unknown, arg4?: unknown) => void;
    getValue?: () => string | number | unknown;
    getText?: () => string;
    oldSel?: unknown;
    setSelectValue?: (value: string | number) => void;
    tooltip?: string;
    setSelectText?: (text: string) => void;
    setSelectData?: (data: unknown, arg2?: unknown, arg3?: unknown) => void;
}

// Global functions
declare function Check_Print_err(): void;

// Shapefile class
declare const clsShapefile: unknown;

// Additional global variables
declare let picMark: unknown; // 変更される可能性あり
declare let lstDummyItem: unknown; // 変更される可能性あり

// Array extensions
interface Array<T> {
    trueNum?: number;
    DummyOBGArray?: unknown[];
}

// EventTarget extensions

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
    Clone(arg?: unknown): Grid_Color;
}

declare class Operation_enable_info {
    Clone(arg?: unknown): Operation_enable_info;
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
    NorthWest?: latlon;
    SouthEast?: latlon;
    NorthEast?: latlon;
    SouthWest?: latlon;
    constructor(nw?: latlon, se?: latlon);
}

// clsDrawLine は clsDraw.ts で実装済み

declare class Generic {
    static createNewCanvas(parent: HTMLElement, id: string, className: string, x: number, y: number, width: number, height: number, selectColor?: string): HTMLCanvasElement;
    static alert(event: Event, message: string, callback?: Function): void;
    static alert(message: string, callback?: Function): void;
    static createMsgBox(title: string, message: string, showOk: boolean, arg4?: unknown, arg5?: unknown, arg6?: unknown, arg7?: unknown, arg8?: unknown, arg9?: unknown, arg10?: unknown): void;
    static createNewDiv(parent: HTMLElement, text: string, id: string, className: string, x: number, y: number, width?: number | string, height?: number | string, style?: string, arg10?: unknown): HTMLDivElement;
    static addSelectList(selectElement: HTMLSelectElement | string, items: unknown[], arg3?: unknown, arg4?: unknown): void;
    static createNewRadioButtonList(parent: HTMLElement, name: string, list: unknown[], x: number, y: number, w?: number | string, h?: number | string, defaultValue?: string | number, changeHandler?: Function, fontSize?: number): HTMLElement;
    static createNewFrame(parent: HTMLElement, text: string, id: string, x: number, y: number, width: number, height: number, title?: string, arg9?: unknown, arg10?: unknown): HTMLElement;
    static createNewWordNumberInput(parent: HTMLElement, label: string, id: string, value: string | number, unit?: string, x?: number, y?: number, w?: number | string, h?: number | string, className?: string, arg11?: unknown): HTMLInputElement;
    static Get_LatLon_Strings(latlon: latlon, arg2?: boolean): {x: string, y: string};
    static convValue(value: string | number): number;
    static Remove_Same_String(arr: string[]): string[];
    static createNewCheckBox(parent: HTMLElement, text: string, id: string, checked: boolean, x: number, y: number, arg7?: unknown, onChange?: Function, arg9?: unknown, arg10?: unknown): HTMLInputElement;
    static createNewTextarea(parent: HTMLElement, type: string, id: string, x: number, y: number, width: number, height: number, style?: string): HTMLTextAreaElement;
    static ArrayClone<T>(arr: T[]): T[];
}

// ==================== 列挙型定義（追加） ====================

// レイヤータイプ
declare const enmLayerType: {
    Normal: number;
    Trip_Definition: number;
    Trip: number;
    Mesh: number;
    DefPoint: number;
};

// グラフモード
declare const enmGraphMode: {
    PieGraph: number;
    StackedBarGraph: number;
    LineGraph: number;
    BarGraph: number;
};

// 属性データタイプ
declare const enmAttDataType: {
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
declare const enmMesh_Number: {
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
declare const enmZahyo_System_Info: {
    Zahyo_System_No: number;
    Zahyo_System_tokyo: number;
    Zahyo_System_World: number;
};

// スケール単位
declare const enmScaleUnit: {
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
declare const enmProjection_Info: {
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
declare const enmZahyo_mode_info: {
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
declare const cstRectangle_Cross: {
    cstOuter: number;
    cstCross: number;
    cstInner: number;
    cstInclusion: number;
    cstEqual: number;
};

// 形状タイプ
declare const enmShape: {
    NotDeffinition: number;
    PointShape: number;
    LineShape: number;
    PolygonShape: number;
};

// enmLayerMode_Numberの拡張
declare const enmLayerMode_Number: {
    SoloMode: number;
    MultiMode: number;
    LabelMode: number;
    GraphMode: number;
    TripMode: number;
};

// ラインとポリゴンの関係
declare const cstLinePolygonRelationd: {
    cstOuter: number;
    cstCross: number;
    cstInner: number;
};

// 定数
declare const chrLF: string;
declare const EarthR: number;

// マッチングモード
declare const enmMatchingMode: {
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
    static Get_Converted_XY(point: point, zahyo: Zahyo_info): point;
    static Get_Reverse_XY(point: point, zahyo: Zahyo_info): point;
    static Get_MeshCode_Rectangle(meshcode: string, meshType: number, refOrigin: number, refDestZahyo: Zahyo_info): rectangle;
    static Distance_Ido_Kedo_XY_Point(P1: point, P2: point, MapDTMapZahyo: Zahyo_info): number;
    static Distance_Ido_Kedo_XY(P1: point, P2: point, MapDTMapZahyo: Zahyo_info): number;
    static Distance_Ido_Kedo_LatLon(D1: latlon, D2: latlon): number;
    static Line_Cross_Point(LAP1: point, LAP2: point, LBP1: point, LBP2: point): point | undefined;
    static Get_Ido_Kedo_from_MeshCode(meshcode: string, meshType?: number): latlon;
    static ConvertRefSystemLatLon(ll: latlon, refOrigin: number, refDest: number): latlon;
    static getCircumscribedRectangle(points: point[] | point | rectangle, margin?: number | rectangle): rectangle;
    static Get_TurnedBox(size: size, angle: number): size;
    static Get_Scale_Baititu_IdoKedo(p: point, MPDataMapZahyo: Zahyo_info): number;
    static Trans3D(x: number, y: number, z?: number, center?: point, expand?: number, pitch?: number, head?: number, bank?: number, xyPara?: unknown): point;
    static Trans2D(CP: point, Kakudo_P: number, Kakudo?: number): point;
    static Check_Zahyo_Projection_Convert_Enabled(zahyo: Zahyo_info, zahyo2?: Zahyo_info): { ok: boolean; emes: string };
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
    static Get_TurnedRectangle(Rect: rectangle, Kakudo: number): point[];
    static Get_Rectangle(P1: point, P2: number | size | point): rectangle;
    static Get_Rectangle_Union(rect1: rectangle, rect2: rectangle): rectangle;
    static Get_World_IdoKedo(oxy: point, MapZahyo_Info: Zahyo_info): latlon;
    static Get_ReverseWorld_IdoKedo(oLatLon: latlon, MapZahyo: Zahyo_info): latlon;
    static Get_Reverse_Rect(In_Rect: rectangle, MPDataMapZahyo: Zahyo_info): rectangle;
    static Distance(x1: number, y1: number, x2: number, y2: number): number;
    static Get_Poly_Point_Juushin(points: point[]): point;
    static Get_CenterP_from_MeshCode(meshcode: string, meshType: number): point;
    static BoundaryArrangeGeneral(arg1?: unknown, arg2?: unknown, arg3?: unknown): unknown;
    static Check_TwoRectangele_Inner_Contact(rect1: rectangle, rect2: rectangle): boolean;
    static Check_PointInBox(checkXY: point, Kakudo: number, Rect: rectangle): boolean;
    static checkAndModifyPointInRect(point: point, rect: rectangle): point;
    static Check_PsitionReverse_Enable(p1: point, p2: point): boolean;
}

// clsDrawLine と clsDrawMarkFan は clsDraw.ts で実装済み

// リストボックス
declare class ListBox {
    constructor(parent: HTMLElement, classname?: string, list?: unknown[], x?: number, y?: number, width?: number, height?: number, onChange?: Function, styleinfo?: unknown);
    getSelectedIndex(): number;
    setSelectedIndex(index: number): void;
    setItems(items: unknown[]): void;
    selectedIndex?: number;
    frame?: unknown;
    length?: number;
    value?: unknown;
    options?: unknown[];
    getItems?: () => unknown[];
    clear?: () => void;
    add?: (item: unknown) => void;
    addList?: (items: unknown[], pos?: number) => void;
    addSelectList?: (items: unknown[], pos?: number) => void;
    removeList?: (pos: number, delNum?: number) => void;
    removeAll?: () => void;
    getText?: (index?: number) => string;
    getAllText?: () => string[];
    getAllValue?: () => unknown[];
    getValue?: () => unknown;
    setValue?: (row: number, value: unknown) => void;
    setText?: (row: number, text: string) => void;
    rowUp?: (row: number) => void;
    rowDown?: (row: number) => void;
}

// チェックリストボックス
declare class CheckedListBox {
    constructor(parent: HTMLElement, classname?: string, list?: unknown[], x?: number, y?: number, width?: number, height?: number, twoStepCheckF?: boolean, onChange?: Function, styleinfo?: unknown);
    getChecked(): { checkedStatus: boolean[]; checkedArray: number[] };
    getCheckedStatus(n: number): boolean;
    setChecked(index: number, checked: boolean): void;
    setCheckStatus(n: number, checked: boolean): void;
    getSelectedIndex(): number;
    setSelectedIndex(index: number): void;
    setItems(items: unknown[]): void;
    addList(list: unknown[], pos?: number): void;
    removeList(pos: number, delNum?: number): void;
    removeAll(): void;
    setText(n: number, text: string): void;
    add(item: unknown): void;
    frame?: unknown;
    length?: number;
    selectedIndex?: number;
    disabled?: boolean;
}

// 条件And/Or
declare const enmConditionAnd_Or: {
    _And: number;
    _Or: number;
    And: number;
    Or: number;
};

// 値の位置チェック
declare const chvValue_on_twoValue: {
    chvIN: number;
    chvOuter: number;
    chvJust: number;
};

// strScale_Attri型
declare const strScale_Attri: unknown;

// clsAttrData.ts の関数コンストラクタ型
declare const strDegreeMinuteSeconde: unknown;
declare const strLatLonDegreeMinuteSecond: unknown;
declare const Start_End_Time_data: unknown;
declare const strContourData: unknown;
declare const strMeshPaint: unknown;
declare const strMesh3DPaint: unknown;
declare const strLayerData: unknown;
declare const strLabelDummyData: unknown;
declare const strLabel_Data: unknown;
declare const strGraphData: unknown;
declare const strLabel_Attri: unknown;
declare const strGraph_Attri: unknown;
declare const strOverLay_Attri: unknown;
declare const strTotalData: unknown;
declare const strLinkURL: unknown;
declare const strDataTile: unknown;
declare const strDataTileList: unknown;
declare const strDataObject: unknown;
declare const strDataTitle: unknown;
declare const strDataEdit: unknown;
declare const strDataEditRow: unknown;
declare const strDataEditCell: unknown;
declare const strCategoryData: unknown;
declare const strMaskData: unknown;
declare const strMPLine: unknown;
declare const strMPLineSub: unknown;
declare const strDataStatistics: unknown;
declare const strLegend_Attri: unknown;
declare const strPrint_Mode: unknown;
declare const strSoloData: unknown;
declare const strSeriesData: unknown;
declare const strOverlayData: unknown;
declare const strPaintModeData: unknown;
declare const strMarkData: unknown;
declare const strBarData: unknown;
declare const strPieData: unknown;
declare const strFlowData: unknown;
declare const strTileMarkData: unknown;
declare const strTimeData: unknown;
declare const strViewStyle: unknown;
declare const strScreenData: unknown;
declare const strMapLegend: unknown;
declare const strMapTitle: unknown;
declare const strMapScale: unknown;
declare const strMapNorth: unknown;
declare const strGridLine: unknown;
declare const strBackGround: unknown;
declare const strMapOverLay: unknown;
declare const strCondition: unknown;
declare const strConditionItem: unknown;
declare const strConditionValue: unknown;
declare const strPointObject: unknown;
declare const strPolyObject: unknown;
declare const strLineObject: unknown;
declare const strObjectGroup: unknown;
declare const strAttrValue: unknown;
declare const strThreeD_Mode: unknown;
declare const strPrintFooter: unknown;
declare const strPrintHeader: unknown;
declare const strMapPrint: unknown;
declare const strColorPalette: unknown;
declare const strDivideValue: unknown;
declare const strTripObjData_Info: unknown;
declare const strObjectKindUsed_Info: unknown;

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
 * 座標変換情報型
 * 座標系の投影変換に使用
 */
interface zahyohenkan {
    Mode: number; // enmZahyo_mode_info
    Projection: number; // enmProjection_Info
    CenterXY: point;
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

// ==================== Legend関連の型定義 ====================

/**
 * 線凡例のダミー属性
 */
interface ILegendLineDummyAttri {
    Line_Visible: boolean;
    Line_Visible_Number_STR: string;
    Line_Pattern: number; // enmCircleMDLegendLine
    Dummy_Point_Visible: boolean;
    Back: BackGround_Box_Property;
    Clone?: () => ILegendLineDummyAttri;
}

/**
 * オーバーレイ凡例タイトル情報
 */
interface IOverLayLegendTitleInfo {
    Print_f: boolean;
    MaxWidth: number;
    Clone?: () => IOverLayLegendTitleInfo;
}
