// MANDARA GIS Application - 型定義ファイル（強化版）

// JSON型はtypes.tsからインポートして使用してください
// import type { JsonValue, JsonObject, JsonArray } from './types';

// ==================== 共通型定義 ====================
// リストアイテムの型定義（select要素やListBoxで使用）
type ListItem = { value: string | number; text: string };

// ListViewTable互換のインターフェース（clsGenericのListViewTableクラスと互換）
interface IListViewTable {
    clear?: () => void;
    insertRow?: (index: number, data: JsonValue) => void;
}

// メニューアイテムの型定義（ポップアップメニューで使用）
interface MenuItem {
    caption: string;
    event?: (() => void) | ((data: MenuItem, e?: Event) => void) | ((e: MouseEvent) => void);
    enabled?: boolean;
    checked?: boolean;
    tag?: string;
    child?: MenuItem[];
}

// ==================== グローバル変数の型定義強化 ====================

// ==================== グローバル変数の宣言 ====================
// Note: 以下の変数はAppStateで管理されています。AppStateからアクセスしてください。
// - attrData: IAttrData
// - settingModeWindow: HTMLDivElement | undefined
// - scrMargin: IScrMargin
// - propertyWindow: IPropertyWindow
// - frmPrint: IFrmPrint
// - divmain: HTMLDivElement
// - preReadMapFile: MapFileInfo[]

// 旧互換性のためのグローバル宣言（新規コードでは使用しないでください）
declare let attrData: IAttrData;
declare let settingModeWindow: HTMLDivElement | undefined;
declare let scrMargin: IScrMargin;
declare let propertyWindow: IPropertyWindow;
declare let frmPrint: IFrmPrint;
declare let divmain: HTMLDivElement;
declare let preReadMapFile: MapFileInfo[];

// レイヤーデータ（未使用の可能性が高い）
declare let clsLayerData: typeof ILayerDataInfo | undefined;

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
    style?: CSSStyleDeclaration;
    files?: FileList; // HTMLInputElement.files
    parentNode?: Node;
    tag?: string | number; // カスタムタグプロパティ
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
// 注: HTMLElementの定義は一箇所にまとめています。他の箇所で重複定義しないこと。
interface HTMLElement {
    // 標準的なプロパティ
    options?: HTMLOptionsCollection;
    selectedIndex?: number;
    value?: string;
    disabled?: boolean;
    innerText?: string;
    checked?: boolean;
    
    // カスタムプロパティ(データ保持用)
    oldSel?: number; // addSelectList で使用される選択位置記憶用
    preValue?: number; // setNumberValue で使用される前回の値
    objInfo?: Record<string, unknown>; // カスタムデータ保持用
    word?: HTMLElement; // カスタム子要素への参照
    tooltip?: string; // ツールチップテキスト
    tag?: string | number; // カスタムタグプロパティ
    
    // レイアウト調整用のカスタムプロパティ
    sizeFixed?: boolean;
    relativeSize?: size;
    bottomPositionFixed?: boolean;
    rightPositionFixed?: boolean;
    bottomRightPositionFixed?: boolean;
    relativePosition?: point;
    
    // オブジェクト管理用のカスタムプロパティ
    oObject?: number;
    oLayer?: number;
    oData?: number;
    inPanel?: number;
    panel?: HTMLElement[];
    selectedRow?: number;
    inPic?: number;
    inTxt?: number;
    numberCheck?: boolean;
    
    // イベントハンドラ
    onchange?: ((e: Event) => void) | null; // changeイベントハンドラ
    selected?: boolean; // 選択状態（カスタム要素）
    
    // プロトタイプ拡張メソッド (clsGeneric.ts で定義)
    removeAll?: () => void; // select要素の子要素を全削除
    optionSwap?: (n1?: number, n2?: number) => void; // optionを入れ替え
    removeOne?: () => string | number | undefined; // select要素の選択要素を1つ削除
    addSelectList?: (list: ListItem[], firstSelectIndex?: number, resetF?: boolean, astariskNonF?: boolean, insertPoint?: number) => void;
    getText?: () => string | undefined; // select要素の選択テキストを取得
    getValue?: () => string | number | undefined; // select要素の選択valueを取得
    setSelectText?: (txt: string) => boolean; // 指定した文字のテキストを選択
    setSelectData?: (n: number, value: string | number, text: string) => void; // 指定位置のvalueとテキストを変更
    setAstarisk?: (value: string | number, astariskAddF: boolean) => void; // アスタリスクを付ける/外す
    setNumberValue?: (v: number) => void; // NumberInputに値を設定
    setSelectValue?: (value: string | number) => void; // select要素の値を設定
    addList?: (list: (string | {text: string; value: string; checked?: boolean})[], pos: number) => void; // リストを配列で追加 (ListBox/CheckedListBox用)
    getVisibility?: () => boolean; // 表示状態を取得
    setVisibility?: (visible: boolean) => void; // 表示状態を設定
    btnDisabled?: (disabled: boolean) => void; // ボタンの無効化
}

// Function拡張（イベントハンドラデータ保持用）
interface Function {
    evtChange_Data?: Record<string, unknown>;
    evtChange_FixedXS?: Record<string, unknown>;
    evtChange_FixedYS?: Record<string, unknown>;
    evtChange_Layer?: (arg1?: boolean, arg2?: boolean, arg3?: boolean) => void;
}

// Number拡張（px単位変換）
interface Number {
    px?: () => string; // 数値にpxをつける (clsGeneric.tsで定義)
}

// String拡張（ユーティリティメソッド）
interface String {
    right?: (length: number) => string; // 右から指定文字数を取得
    left?: (length: number) => string; // 左から指定文字数を取得
    mid?: (start: number, length?: number) => string; // 中間の文字列を取得
    midReplace?: (start: number, replaceString: string) => string; // 指定位置の文字列を置換
    removePx?: () => number; // pxを削除して数値化
    px?: () => string; // 数値にpxをつける
    repeat?: (count: number) => string; // 文字列を繰り返す
    replaceAll?: (org: string, dest: string) => string; // 全置換
}

// Event拡張（カスタムプロパティ）
interface Event {
    ctrlKey?: boolean;
    shiftKey?: boolean;
    dataTransfer?: DataTransfer;
    caption?: string;
}

// ChildNode拡張（name等）
interface ChildNode {
    name?: string;
    innerHTML?: string;
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
        Condition?: strCondition_DataSet_Info[]; // strCondition_DataSet_Info[] (clsAttrData.tsで定義)
        TotalMode?: {
            OverLay?: {
                SelectedIndex?: number;
                DataSet: IOverLayDatasetInfo[];
                Always_Overlay_Index?: number;
                MarkModePosFixFlag?: boolean;
                AddDataSet?: (data?: IOverLayDatasetInfo) => void;
                initDataSet?: () => void;
            };
            Series?: {
                SelectedIndex?: number;
                DataSet: ISeriesDatasetInfo[];
                AddDataSet?: (data?: ISeriesDatasetInfo) => void;
                initDataSet?: () => void;
            };
        };
        ViewStyle: {
            Clone?: () => JsonValue;
            Dummy_Size_Flag?: boolean;
            ScrData: Screen_info & {
                frmPrint_FormSize: rectangle;
                ScrView?: rectangle;
                MapScreen_Scale?: size;
                MapRectangle?: rectangle;
                MapRectanglem?: rectangle;
                getSXSY_Margin?: () => rectangle;
                getSRXY?: (p: point) => point;
                getSxSy?: (arg1: point, arg2?: point) => point;
                getSRXYfromRatio?: (p: point) => point;
                // Get_SxSy_With_3Dはオーバーロードがあるため、Screen_infoクラスの定義を使用
                ThreeDMode?: {
                    Set3D_F: boolean;
                    Pitch?: number;
                    Head?: number;
                    Bank?: number;
                };
                Accessory_Base?: number;
                OutputDevide?: number; // enmOutputDevice
                Set_PictureBox_and_CulculateMul?: (arg1?: rectangle) => void;
                ScrRectangle?: rectangle;
                Screen_Margin?: ScreenMargin; // ScreenMargin class from clsAttrData.ts
                getSxSyRect?: (arg1?: rectangle) => rectangle;
                ScreenMG?: {
                    Mul?: number;
                    [key: string]: JsonValue;
                }; // ScreenMultiply_Data_Info
                init?: (sz?: size, margin?: ScreenMargin, mapRect?: rectangle, accessoryBase?: number, clearFlag?: boolean) => void;
            };
            AttMapCompass?: strCompass_Attri; // strMapCompass_Attri from clsAttrData.ts
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
                MaxWidth?: number;
                Clone?: () => {
                    Position: point;
                    Visible?: boolean;
                    Font?: Font_Property;
                    Back?: BackGround_Box_Property;
                    MaxWidth?: number;
                };
                Back?: BackGround_Box_Property
            };
            MapScale?: {
                Position: point;
                Visible?: boolean;
                Font?: Font_Property;
                BarAuto?: boolean;
                Clone?: () => {
                    Position: point;
                    Visible?: boolean;
                    BarDistance?: number;
                    BarKugiriNum?: number;
                    Back?: BackGround_Box_Property;
                    Unit?: number;
                    Font?: Font_Property;
                    BarAuto?: boolean;
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
                    Clone?: () => JsonObject;
                };
            };
            AccessoryGroupBox: {
                Visible: boolean;
                Back: BackGround_Box_Property;
                Title: boolean;
                Comapss: boolean;
                Scale: boolean;
                Legend: boolean;
                Note: boolean;
                LinePattern: boolean;
                ObjectGroup: boolean;
            }; // strAccessoryGroupBox_Info from clsAttrData.ts
            Zahyo: Zahyo_info;
            LatLonLine_Print?: {
                LPat: Line_Property;
                OuterPat: Line_Property;
                Equator: Line_Property;
                [key: string]: JsonValue;
            };
            TileMapView: {
                Visible: boolean;
                DrawTiming?: number; // enmDrawTiming
                TileMapDataSet?: strTileMapViewInfo; // strTileMapViewInfo from clsAttrData.ts
                AlphaValue?: number;
            };
            Missing_Data: {
                Print_Flag: boolean;
                Text: string;
                PaintTile: Tile_Property;
                Mark: Mark_Property;
                BlockMark: Mark_Property;
                ClassMark: Mark_Property;
                MarkBar: Mark_Property;
                TurnMark: Mark_Property;
                Label: string;
                LineShape: Line_Property;
                Clone?: () => JsonObject;
            }; // strMissing_set from clsAttrData.ts
            SouByou?: {
                Auto?: boolean;
                ThinningPrint_F?: boolean;
                PointInterval?: number;
                LoopAreaF?: boolean;
                LoopSize?: number;
                [key: string]: JsonValue;
            }; // strSoubyou_Data_Info
            DummyObjectPointMark?: Record<string, strDummyObjectPointMark_Info[]>; // strDummyObjectPointMark_Info[] from clsAttrData.ts
            Screen_Back: {
                MapAreaFrameLine: Line_Property;
                ScreenFrameLine: Line_Property;
                ScreenAreaBack: Tile_Property;
                MapAreaBack: Tile_Property;
                ObjectInner: Tile_Property;
            }; // strScreen_Back_data from clsAttrData.ts
            PointPaint_Order?: number; // enmPointOnjectDrawOrder
            ValueShow?: {
                ObjNameVisible?: boolean;
                ValueVisible?: boolean;
                ObjNameFont?: Font_Property;
                ValueFont?: Font_Property;
                [key: string]: JsonValue;
            }; // strValueShow_Info
            InVisibleObjectBoundaryF?: boolean;
            MeshLine?: Line_Property;
            SymbolLine?: strSymbolLine_Info; // strSymbolLine_Info (needs definition)
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
                Data: strOD_Drag_Data; // OD drag data structure
            };
            OnObject?: strLocationSearchObject | null;
            OldObject?: strLocationSearchObject | null;
            SymbolPointFirstMessage?: boolean;
            LabelPointFirstMessage?: boolean;
            LocationMenuString?: {
                ObjectNameValue?: string;
                ContourStacPos?: number;
                ClickMapPos?: point;
                DataIndex?: number;
                [key: string]: JsonValue;
            };
            MultiObjects?: strLocationSearchObject[];
        };
        Accessory_Temp: IAccessoryTemp;
        OnObject?: strLocationSearchObject | null;
        MouseDownF?: boolean;
        PrintMouseMode?: number;
        PointObjectKindUsedStack?: strDummyObjectPointMark_Info[];
        MapAreaLatLon?: latlonbox; // latlonbox from clsAttrData.ts
        ContourMode_Temp?: {
            Contour_Point?: point[];
            [key: string]: JsonValue;
        };
        DotMap_Temp?: {
            DotMapTempResetF?: boolean;
            [key: string]: JsonValue;
        };
        Series_temp?: {
            Koma?: number;
            title?: string;
            [key: string]: JsonValue;
        };
        OverLay_Temp?: {
            title?: string;
            [key: string]: JsonValue;
        };
        drawing?: boolean;
        SoubyouLinePointIntervalCriteria?: number;
        SoubyouLoopAreaCriteria?: number;
        DataSourceType?: number;
        InVisibleObjectBoundaryF?: boolean;
        ModeValueInScreen_Stac?: {
            setF?: boolean;
            [key: string]: JsonValue;
        };
        ObjectPrintedCheckFlag?: boolean[][];
    };
    LayerData?: ILayerDataInfo[]; // strLayerDataInfo[] (clsAttrData.tsで定義)
    // メソッド
    Get_AllMapLineKind?: () => LPatSek_Info[];
    Get_LineKindUsedList?: () => boolean[];
    Get_Length_On_Screen?: (arg1?: number) => number;
    Radius?: (size?: number, arg2?: number, arg3?: number) => number;
    Draw_Line?: (arg1: CanvasRenderingContext2D, arg2: Line_Property, arg3?: point[], arg4?: Screen_info) => void;
    Draw_Print?: (arg1: CanvasRenderingContext2D, arg2: string, arg3?: point, arg4?: Font_Property, arg5?: string | number, arg6?: string | number) => void;
    Draw_Mark?: (g: CanvasRenderingContext2D, Position: point, r: number, Mark: Mark_Property) => void;
    Get_DataUnit_With_Kakko?: (arg1?: number, arg2?: number) => string;
    Get_PrintError?: () => { Print_Enable: number; message: string };
    Get_Condition_Info?: (layer?: number) => string;
    Get_Condition_Ok_Num_Info?: (layer?: number) => string;
    Get_ObjectNum?: (layer?: number) => number;
    Check_Condition?: (layer?: number, index?: number) => boolean;
    Get_KenObjName?: (layer?: number, index?: number) => string;
    getSoloMode?: (arg1?: number, arg2?: number) => number;
    setSoloMode?: (arg1: number, arg2?: number, arg3?: number) => void;
    Get_DataTitle?: (arg1?: number, arg2?: number, arg3?: boolean) => string;
    Get_SelectedDataTitle?: () => string;
    nowGraph?: () => any; // strGraph_Data (clsAttrData.tsで定義)
    nowLabel?: () => any; // strLabel_Data (clsAttrData.tsで定義)
    ResetMPSubLineXY?: () => void;
    ResetObjectPrintedCheckFlag?: () => void;
    check_AutoSoubyou_Enable?: (arg1?: number, arg2?: number) => boolean;
    layerGraph?: (layerNum?: number) => IGraphMode;
    layerLabel?: (layerNum?: number) => ILabelMode;
    Check_Screen_In?: (CenterP: point | rectangle, R?: number) => boolean;
    Convert_Zahyo?: (zahyo: number) => void;
    GetMapFileName?: () => string[];
    SetMapFile?: (filename: string) => IMapData;
    Check_Vector_Object?: () => void;
    PrtObjectSpatialIndex?: () => void;
    SetMapViewerData?: (data: JsonObject, arg2?: JsonObject, arg3?: JsonObject) => { ok: boolean; emes: string };
    OpenNewMandaraFile?: (MapDataList: clsMapdata[], attrText: string, filename: string, ext: string) => { ok: boolean; emes: string };
    ADD_AttrData?: (data: JsonObject, flag?: boolean) => { ok: boolean; emes: string };
    Set_LayerName_to?: (selbox: HTMLSelectElement, SelectedIndex?: number, NormalF?: boolean, syntheticF?: boolean, PointF?: boolean, MeshF?: boolean) => void;
    Set_ObjectName_to_selectBox?: (selbox: HTMLSelectElement, Layernum?: number, SelectedObject?: number) => void;
    MapData?: IMapData; // clsAttrMapData (clsAttrData.tsで定義)
    DeleteObjects?: (objects: number[], options?: JsonObject) => void;
    Set_DataTitle_to_cboBox?: (cbox: HTMLSelectElement, Layernum?: number, SelectedIndex?: number, Number_Print_F?: boolean, Normal_F?: boolean, Category_f?: boolean, String_f?: boolean, Special_Astarisk_Num?: number) => void;
    Set_ObjectName_to_checkedListBox?: (selectElement: HTMLElement, layerNum?: number, selectedObject?: number) => void;
    getDummyObjGroupArray?: (Layernum?: number, shape?: number) => { DummyOBGArray: boolean[]; trueNum: number };
    Get_MedianValue?: (layer?: number, data?: number) => number;
    nowLayer?: () => ILayerDataInfo;
    // Screen_Back?: BackGround_Box_Property; // 削除：実際の型はstrScreen_Back_dataで、clsAttrData.tsで定義
    Draw_Tile_Box?: (g: CanvasRenderingContext2D, BoundaryRect: rectangle, L: Line_Property, T: Tile_Property, Kakudo: number) => void;
    Draw_Sample_LineBox?: (picBox: HTMLElement, LinePat: Line_Property) => void;
    Draw_Sample_Mark_Box?: (picBox: HTMLElement, Mark: Mark) => void;
    Get_Length_On_Screen?: (fontSize?: number) => number;
    Draw_Line?: (context: CanvasRenderingContext2D, linePattern: Line_Property, points: point[], style?: Screen_info) => void;
    Draw_Print?: (context: CanvasRenderingContext2D, text: string, position?: point, font?: Font_Property, hAlign?: string | number, vAlign?: string | number) => void;
    Get_DataUnit_With_Kakko?: (layerIndex?: number, dataIndex?: number) => string;
    Get_PaddingPixcel?: (back?: BackGround_Box_Property) => number;
    Get_DataNote?: (layer?: number, data?: number) => string;
    Get_MaxURLNum?: (Layernum?: number) => number;
    Get_KenObjCode?: (Layernum: number, Objectnum: number) => string;
    Check_screen_Kencode_In?: (Layernum: number, ObjNum: number) => boolean;
    Check_Screen_Objcode_In?: (Layernum: number, objcode: number) => boolean;
    Get_DataNum?: (layer?: number) => number;
    
    // 追加プロパティ・メソッド
    Print_Mode_Total?: number;
    nowDataSolo?: () => ISoloModeViewSettings;
    nowData?: () => IDataItem;
    nowLayer?: () => ILayerDataInfo;
    nowSeries?: () => ISeriesDatasetInfo;
    nowOverlay?: () => IOverLayDatasetInfo;
    Twocolort?: (Layernum: number, DataNum: number) => void;
    Threecolor?: (Layernum: number, DataNum: number, Color_cng_n: number) => void;
    FourColor?: (layer?: number, data?: number, color_ch_n?: number) => void;
    Get_DataNote?: (layer?: number, data?: number) => string;
    Get_Data_Value?: (Layernum?: number, DataNum?: number, Obj?: number, Missing_word?: string) => string | number;
    Get_DataUnit?: (layer?: number, data?: number) => string;
    Get_DataType?: (layer?: number, data?: number) => number;
    Get_Missing_Value_DataArray?: (layer?: number, data?: number) => boolean[];
    Get_Data_Cell_Array_With_MissingValue?: (layer?: number, object?: number, data?: number) => number[];
    Add_One_Data_Value?: (Layernum: number, Title: string, Unit: string, Note: string, Data_Val_str: string, Missing_F?: boolean) => boolean;
    Check_Missing_Value?: (layer?: number, object?: number, data?: number) => boolean;
    Check_Enable_SoloMode?: (soloMode?: number, layernum?: number, dataNum?: number) => boolean;
    Get_CategolyArray?: (layer?: number, data?: number) => number[];
    Get_Categoly?: (layer?: number, data?: number, index?: number) => number;
    Draw_Poly_Inner?: (context: CanvasRenderingContext2D, points: point[], nPolyP: number[], tile: Tile_Property) => void;
    Get_InnerTile?: (InnerData: strInner_Data_Info, Layernum: number, CategoryPos: number) => Tile_Property;
    Get_Enable_KenCode_MPLine?: (Layernum: number, ObjNum: number) => EnableMPLine_Data[];
    Get_DataMin?: (layer?: number, data?: number) => number;
    Get_DataMax?: (layer?: number, data?: number) => number;
    Get_ClassFrequency?: (layer: number, data: number, conditionCheck: boolean) => {
        ok: boolean;
        frequency?: number[];
    };
    Get_CenterP?: (layer?: number, object?: number) => point;
    Check_Condition_UMU?: (layer?: number) => boolean;
    Set_DataTitle_to_CheckedListBox?: (CheckedListBox: CheckedListBox, Layernum: number, defoChecked?: boolean, Number_Print_F?: boolean, Normal_F?: boolean, Category_f?: boolean, String_f?: boolean, Special_Astarisk_Num?: number) => void;
    Get_DivNum?: (layer?: number, data?: number) => number;
    Check_Point_in_Kencode_OneObject?: (layernum: number, objnum: number, mapP: point) => boolean;
    Set_Legend?: (D_Layer: number, D_DataNum: number, O_Data: ISoloModeViewSettings, ClassPaintF?: boolean, MarkSizeF?: boolean, MarkSizeValueCopyF?: boolean, MarkBlockF?: boolean, ContourF?: boolean, ClassMarkF?: boolean, ClassODF?: boolean, StringModeF?: boolean, MarkBarF?: boolean, ClassODOriginCopyF?: boolean, copyMarkCommonInnerDataF?: boolean) => void;
    Draw_Fan?: (context: CanvasRenderingContext2D, centerP: point, radius: number, startAngle: number, endAngle: number, scrData?: Screen_info, tile?: Tile_Property) => void;
    Get_SxSy_With_3D?: (point: point) => point;
    ClassMD?: strClassMode_Data; // strClassMode_Data (clsAttrData.tsで定義)
    saveAsMDRJ?: (filename?: string, options?: JsonObject) => void;
    Sort_OverLay_Data?: (dataSetNumber: number) => void;
    Sort_OverLay_Data_Sub?: (ovData: strOverLay_DataSet_Item_Info[]) => strOverLay_DataSet_Item_Info[];
    Boundary_Kencode_Arrange?: (layer?: number, object?: number, time?: strYMD | null) => boundArrangeData[];
    GetObjMenseki?: (layer?: number, object?: number) => number;
    Get_MaxMinValue_Range?: (layer?: number, data?: number) => { min: number; max: number };
    Get_OD_Label_Position?: (layer?: number, object?: number) => point;
    Get_Symbol_Position?: (layer?: number, object?: number) => point;
    Get_Label_Position?: (layer?: number, object?: number) => point;
    Get_KenCode_Circumscribed_Rectangle?: (layer?: number, object?: number) => rectangle;
    Get_Kencode_Object_Circumscribed_Rectangle?: (layer?: number, object?: number) => rectangle;
    Draw_Arrow?: (context: CanvasRenderingContext2D, point: point, beforePoint: point, linePat: Line_Property, arrow: Arrow_Property) => void;
    getMpLineDrawn?: (MapFileName: string, LineCode: number) => boolean | undefined;
    setMpLineDrawn?: (MapFileName: string, LineCode: number, value: boolean) => void;
    setLineKindUseChecked?: (MapFileName: string, lineKindNum: number, PatternNum: number, value: boolean) => void;
    ResetMPSubLineDrawn?: (mapFileName?: string) => void;
    ResetMPSubLineXY?: (layer?: number) => void;
    Get_MPSubLineXY?: (MapFileName: string, LineCode: number, ReverseF: boolean) => point[];
    Set_MPSubLineXY?: (MapFileName: string, LineCode: number, XY: point[], ReverseF: boolean) => void;
    GetAllMapLineKindName?: () => string[];
    Get_AllMapLineKind?: () => LPatSek_Info[];
    getDataTitleName?: (Layernum: number, Number_Print_F?: boolean, Normal_F?: boolean, Category_f?: boolean, String_f?: boolean, Special_Astarisk_Num?: number) => string[];
    Get_Data_Cell_Array_Without_MissingValue?: (layer?: number, object?: number, data?: number) => JsonValue[];
    Set_DummyObjectName_to_checkedListBox?: (element: HTMLElement, layerNum?: number, selectedObject?: number) => void;
    Set_DummyObjectName_to_selectBox?: (selbox: HTMLSelectElement, layernum: number, selectedObject: number) => void;
    Get_LayerName?: (layer?: number) => string;
    Get_DataMissingNum?: (layer?: number, data?: number) => number;
    Get_ObjectCode_from_ObjName?: (layer?: number, objName?: string) => number;
    // 追加メソッド
    getSeriesDataSetName?: () => ListItem[];
    SeriesMode_to_ListViewData?: (seriesListView: HTMLElement | IListViewTable, DataSetItem: ISeriesDatasetInfo) => void;
    getGraphTitle?: (layernum: number) => Array<{value: number, text: string}>;
    getLabelTitle?: (layernum: number) => Array<{value: number, text: string}>;
    getOverlayTitle?: () => Array<{value: number, text: string}>;
    Get_ObjectGravityPoint?: (layernum: number, objNumber: number) => { ok: boolean; gpoint: point };
    Get_ObjectLength?: (layernum: number, objNum: number) => number;
    // 距離計算メソッド
    Distance_Kencode_Point?: (layernum: number, obj: number, point: point) => number;
    Distance_Kencode_Object?: (objNum1: number, objNum2: number, layNum1: number, layNum2: number) => number;
    Distance_Kencode_MPObject?: (layNum1: number, objNum1: number, mapFile: IMapData, objCode2: number, time?: strYMD | null) => number;
    getOneObjectPanelLabelString?: (layernum: number, dataNum: number, objNum: number, separatorString: string) => string;
    getSoloMode?: (layernum: number, dataNum: number) => number;
    Set_Acc_First_Position?: () => void;
    Set_Class_Div?: (layernum: number, dataNum: number, setStartPos?: number) => void;
    Set_Div_Value?: (layernum: number, dataNum: number) => void;
    SetMapFile?: (mapFileName: string) => IMapData;
    AddPointObjectKindUsed?: (MapFilename: string, ObjKindNumber: number, MK: Mark_Property) => void;
    AddExistingMapData?: (mapData: IMapData, mapFileName: string) => void;
    Get_Check_Enable_SoloMode?: (soloMode?: number, layerNum?: number, dataNum?: number) => boolean;
    Draw_Tile_RoundBox?: (g: CanvasRenderingContext2D, boundaryRect: rectangle, back: BackGround_Box_Property, kakudo: number) => void;
    Check_Screen_In?: (rect: rectangle) => boolean;
    Get_Padding_Pixcel?: (back: BackGround_Box_Property) => number;
    Get_Paddin_Pixcel?: (back: BackGround_Box_Property) => number; // typo variant
    Radius?: (size: number, arg2?: number, arg3?: number) => number;
    [key: string]: JsonValue;
    
    // MapData関連
    MapData: {
        SetMapFile: (mapFileName: string) => IMapData;
        SetObject_Name_Search?: (mapFileName: string) => JsonValue;
        CheckMapfileExists?: (mapFileName: string) => boolean;
        AddExistingMapData?: (mapData: IMapData, mapFileName: string) => void;
        getAllMapData?: () => JsonValue;
        [key: string]: JsonValue;
    };
}

// Accessory_Temp（拡張版） - 削除：実際の型はAccessoryTemp_InfpでclsとtrData.tsで定義
// interface IAccessoryTemp {
//     MapLegend_W: IMapLegendW[];
//     [key: string]: JsonValue;
// }

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
    [key: string]: JsonValue;
}

// OverLay DataSet情報（拡張版）
interface IOverLayDatasetInfo {
    title: string;
    DataItem: IOverLayDataItemElement[];
    initData?: () => void;
    [key: string]: JsonValue;
}

// OverLay DataItem要素（拡張版）
interface IOverLayDataItemElement {
    Layer: number;
    DataNumber: number;
    Print_Mode_Layer: number; // enmLayerMode_Number
    Mode?: number; // enmSoloMode_Number or other mode
    Legend_Print_Flag?: boolean;
    Clone: () => IOverLayDataItemElement;
    [key: string]: JsonValue;
}

// Series DataSet情報（拡張版）
interface ISeriesDatasetInfo {
    title: string;
    DataItem: ISeriesDataItem;
    initData?: () => void;
    [key: string]: JsonValue;
}

// レイヤーデータ情報（拡張版）
interface ILayerDataInfo {
    Name: string;
    MapFileName: string;
    MapFileData: clsMapdata;
    MapFileObjectNameSearch: clsObjectNameSearch;
    Shape: number; // enmShape
    Type: number; // enmLayerType
    MeshType: number; // enmMesh_Number
    ReferenceSystem: number; // enmZahyo_System_Info
    Time: strYMD;
    Comment: string;
    TripTimeSpan: number; // 移動時間のスパン（数値）
    TripType: number; // enmTripPositionType
    atrObject: IObjectInfo;
    atrData: IAttrDataInfo;
    Dummy: strDummyObjectName_and_Code[];
    DummyGroup: number[];
    Print_Mode_Layer: number; // enmLayerMode_Number
    LayerModeViewSettings: ILayerModeViewSettings;
    PrtSpatialIndex: JsonValue; // clsSpatialIndexSearch
    ObjectGroupRelatedLine: number[];
    ODBezier_DataStac: ODBezier_Data[];
    // Methods
    Remove_OD_Bezier?: (objPos: number, dataNum: number) => void;
    Get_OD_Bezier_RefPoint?: (index: number, dataNum: number) => JsonObject;
    [key: string]: JsonValue;
}

// オブジェクト情報（拡張版）
interface IObjectInfo {
    ObjectNum: number;
    [key: string]: JsonValue;
}

// 属性データ情報（拡張版）
interface IAttrDataInfo {
    Count: number;
    Data: IDataItem[];
    SelectedIndex: number;
    [key: string]: JsonValue;
}

// データ項目（拡張版）
interface IDataItem {
    DataType: number;
    Title: string;
    Unit: string;
    Note: string;
    SoloModeViewSettings: ISoloModeViewSettings;
    [key: string]: JsonValue;
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
    TripMode: JsonObject;
    StringMode: JsonObject;
    MarkSizeMD: JsonObject;
    MarkBlockMD: JsonObject;
    MarkBarMD: JsonObject;
    ClassMarkMode: JsonObject;
    MarkTurnMode: JsonObject;
    Class_Div: strClass_Div_data[];
    Div_Num: number;
    [key: string]: JsonValue;
}

// クラス塗り分けモード（拡張版）
interface IClassPaintMode {
    color1?: colorRGBA;
    color2?: colorRGBA;
    color3?: colorRGBA;
    Color_Mode?: number;
    Clone?: () => IClassPaintMode;
    [key: string]: JsonValue;
}

// 記号の大きさモード（拡張版）
interface IMarkSizeMode {
    MaxValueMode?: number;
    MaxValue?: number;
    Value?: number[];
    Mark?: Mark_Property;
    LineShape?: Line_Property;
    Clone?: () => IMarkSizeMode;
    [key: string]: JsonValue;
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
    [key: string]: JsonValue;
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
    [key: string]: JsonValue;
}

// 線引きモード（拡張版）
interface IClassODMode {
    o_Layer?: number;
    O_object?: number;
    Dummy_ObjectFlag?: boolean;
    Arrow?: Arrow_Data;
    Clone?: () => IClassODMode;
    [key: string]: JsonValue;
}

// 等値線レギュラー設定
interface IContourRegular {
    bottom?: number;
    Interval?: number;
    top?: number;
    SP_Bottom?: number;
    SP_interval?: number;
    SP_Top?: number;
    Line_Pat?: Line_Property;
    SP_Line_Pat?: Line_Property;
    EX_Line_Pat?: Line_Property;
    [key: string]: JsonValue;
}

// 等値線モード（拡張版）
interface IContourMode {
    Interval_Mode?: number;
    Draw_in_Polygon_F?: boolean;
    Spline_flag?: boolean;
    Detailed?: number;
    Regular?: IContourRegular;
    IrregularNum?: number;
    Irregular?: strContour_Data_Irregular_interval[];
    Clone?: () => IContourMode;
    [key: string]: JsonValue;
}

// クラスODモード設定（拡張版）
interface IClassODMD {
    Arrow: Arrow_Property;
    [key: string]: JsonValue;
}

// レイヤーモード表示設定（拡張版）
interface ILayerModeViewSettings {
    GraphMode: IGraphMode;
    LabelMode: ILabelMode;
    PointLineShape: JsonObject;
    PolygonDummy_ClipSet_F: boolean;
    [key: string]: JsonValue;
}

// グラフモード（拡張版）
interface IGraphMode {
    DataSet: IGraphDataSet[];
    SelectedIndex?: number;
    initDataSet?: () => void;
    [key: string]: JsonValue;
}

// グラフデータセット（拡張版）
interface IGraphDataSet {
    Data: IGraphDataItem[];
    Type?: number;
    length?: number;
    [key: string]: JsonValue;
}

// グラフデータ項目（拡張版）
interface IGraphDataItem {
    DataNumber: number;
    Layer?: number;
    [key: string]: JsonValue;
}

// ラベルモード（拡張版）
interface ILabelMode {
    DataSet: ILabelDataSet[];
    SelectedIndex?: number;
    initDataSet?: () => void;
    [key: string]: JsonValue;
}

// ラベルデータセット（拡張版）
interface ILabelDataSet {
    Data: ILabelDataItem[];
    length?: number;
    [key: string]: JsonValue;
}

// ラベルデータ項目（拡張版）
interface ILabelDataItem {
    DataNumber: number;
    Layer?: number;
    [key: string]: JsonValue;
}

// マップデータ（拡張版）
interface IMapData {
    Map: IMapInfo;
    LineKind?: Array<{
        Name: string;
        NumofObjectGroup: number;
        ObjGroup: strLKOjectGroup_Info[];
        Mesh?: number;
        Clone?: () => JsonObject;
        [key: string]: JsonValue;
    }>; // LineKind_Data配列
    MPObj?: JsonValue[]; // 地図オブジェクト配列
    [key: string]: JsonValue;
}

// マップ情報（拡張版）
interface IMapInfo {
    MapCompass: IMapCompassInfo;
    ALIN?: number;
    ObjectNumber?: number;
    LpNum?: number;
    SCL?: number;
    Zahyo?: Zahyo_info;
    Kend?: number;
    FileName?: string;
    [key: string]: JsonValue;
}

// マップコンパス情報（拡張版）
interface IMapCompassInfo {
    Mark: Mark_Property;
    Position?: point;
    Visible?: boolean;
    [key: string]: JsonValue;
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
    dragBorder?: (arg1?: MouseEvent | undefined, arg2?: (((...args: JsonValue[]) => void) | HTMLElement)) => void;
    resetMaxButton?: (flag?: boolean) => void;
    // Methods
    windowClose?: () => void;
    resizeMapWindow?: () => void;
    PropertyFix?: () => void;
    PrintCursorObjectLine?: (g: CanvasRenderingContext2D, flag: boolean) => void;
    ShowOneObjectProperty?: (layerNum: number, objNum: number, dataIndex: number, printMode: number) => void;
    ShowOverLayObjectProperty?: (layerNum: number, dataIndex: number, onObject: JsonValue[]) => void;
    savePNG?: (flag?: boolean) => void;
    propertyWindowClose?: () => void;
    copyProperty?: () => void;
    wholeMapShow?: () => void;
    seriesBefore?: () => void;
    seriesNext?: () => void;
    copyImageWindow?: () => void;
    linePattern?: () => void;
    [key: string]: JsonValue;
}

// プロパティウィンドウ（拡張）
interface IPropertyWindow extends ExtendedHTMLDivElement {
    copyButton: HTMLInputElement;  // 実際はHTMLInputElement
    rightPositionFixed: boolean;
    relativePosition: point;
    fixed: boolean;
    nextVisible: boolean;
    pnlProperty?: ExtendedHTMLDivElement & { objInfo?: Record<string, unknown> & ExtendedHTMLDivElement; oObject?: number; oLayer?: number; oData?: number; };
    // HTMLDivElementのプロパティを継承
    dragBorder?: (arg1: MouseEvent, arg2: HTMLElement) => void;
    getVisibility?: () => boolean;
    setVisibility?: (visible: boolean) => void;
}

// Generic ユーティリティクラス（拡張）
interface IGeneric {
    alert: (event: point | undefined, message: string) => void;
    prompt: (event_point: point | undefined, promptText: string, defoText: string, okCall: (value: string) => void, textAlign?: string, cancelCall?: (() => void) | undefined) => void;
    confirm: (event: Event, message: string, callback: (confirmed: boolean) => void) => void;
    createNewDiv: (parent: HTMLElement, id: string, className: string, innerHTML: string, left: number, top: number, width: number, height: number, style: string, tooltip: string | undefined) => HTMLDivElement;
    createNewButton: (parent: HTMLElement, text: string, className: string, left: number, top: number, onClick: ((event: MouseEvent) => void) | null, style: string) => HTMLButtonElement;
    createNewSpan: (parent: HTMLElement, text: string, className: string, innerHTML: string, left: number, top: number, style: string, tooltip: string | undefined) => HTMLSpanElement;
    createNewFrame: (parent: HTMLElement, id: string, className: string, left: number, top: number, width: number, height: number, title: string) => HTMLDivElement;
    createNewCheckBox: (parent: HTMLElement, text: string, className: string, checked: boolean, left: number, top: number, wordWidth: number | undefined, onChange: ((element: HTMLInputElement) => void) | undefined | null, style: string) => HTMLInputElement;
    createNewRadioButtonList: (parent: HTMLElement, name: string, items: JsonValue[], left: number, top: number, wordWidth: number | undefined, itemHeight: number | number[], selectedValue: JsonValue, onChange: (value: JsonValue) => void, style: string) => void;
    createNewWordNumberInput: (parent: HTMLElement, headWord: string, footWord: string, defoValue: number, ID: string, x: number, y: number, headWordWidth: number | undefined, width: number, onChange: ((obj: HTMLInputElement, value: number) => void) | undefined | null, styleinfo: string) => HTMLInputElement;
    set_backDiv: (id: string, title: string, width: number, height: number, modal: boolean, closeButton: boolean, okButton: ((event?: MouseEvent) => void) | undefined, opacity: number, draggable: boolean, resizable?: boolean) => HTMLDivElement;
    getBrowserWidth: () => number;
    getBrowserHeight: () => number;
    copyText: (text: string) => void;
    Set_Box_Position_in_Browser: (event: point | MouseEvent, element: HTMLElement) => void;
    Array2Dimension: <T>(dim1num: number, dim2num: number, defoValue?: T) => T[][];
    Array2Clone: (array: JsonValue[]) => JsonValue[];
    ceatePopupMenu: (menu: MenuItem[], position: point) => void;
    [key: string]: JsonValue;
}

// clsPrint クラス（拡張）
interface IClsPrint {
    printMapScreen: (canvas: HTMLCanvasElement) => void;
    [key: string]: JsonValue;
}

// clsDraw クラス（拡張）
interface IClsDraw {
    print: (g: CanvasRenderingContext2D, text: string, position: point, font: Font_Property, hAlign: number, vAlign: number, scrData: Screen_info) => void;
    DrawText2: (g: CanvasRenderingContext2D, position: point, text: string, font: Font_Property, scrData: Screen_info) => void;
    Line: (g: CanvasRenderingContext2D, linePat: Tile_Property, arg3: point | point[], arg4?: point | Screen_info, arg5?: Screen_info) => void;
    Draw_Tile_and_Paint_and_Line: (g: CanvasRenderingContext2D, points: point[], nPolyP: number[], polyNum: number, tile: Tile_Property, linePat: Tile_Property, scrData: Screen_info) => void;
    Arrow: (g: CanvasRenderingContext2D, point: point, beforePoint: point, linePat: Tile_Property, arrow: Arrow_Property, scrData: Screen_info) => void;
    [key: string]: JsonValue;
}

// 強化されたグローバル変数宣言
// attrData: AppStateで管理（削除済み）
declare const Generic: IGeneric;
declare const clsSettingData: {
    MinimumLineWidth: number;
    SetFont: string;
    ObjectName_Word_Compatible: string;
    KatakanaCheck: boolean;
    SinKyuCharacter: boolean;
    Ido_Kedo_Print_Pattern: number;
    LegendPlusWord: string;
    LegendMinusWord: string;
    LegendBlockmodeWord: string;
    Clone(): JsonObject;
    [key: string]: JsonValue;
};
declare const clsTime: typeof import('./clsTime').clsTime;
declare const clsDraw: IClsDraw;
declare const clsPrint: IClsPrint;
// frmPrint: AppStateで管理（削除済み）
declare let Frm_Print: IFrmPrint; // 変更される可能性あり
// propertyWindow: AppStateで管理（削除済み）
// divmain: AppStateで管理（削除済み）
declare class latlon {
    lat: number;
    lon: number;
    constructor(lat?: number, lon?: number);
    Clone(): latlon;
    toDegreeMinuteSecond(): {LatitudeDMS: {degree: number; minute: number; second: number}; LongitudeDMS: {degree: number; minute: number; second: number}};
    toLatlon(): latlon;
    toPoint(): point;
    Equals(other: latlon): boolean;
}
declare const TKY2JGD: {
    Tokyo97toITRF94: (latlonP: latlon) => latlon;
    ITRF94toTokyo97: (latlonP: latlon) => latlon;
    [key: string]: JsonValue;
}; // kept temporarily; being migrated to ESM import
// tileMapClass: AppStateで管理（削除済み）
// preReadMapFile: AppStateで管理（削除済み）
// scrMargin: AppStateで管理（削除済み）
// logWindow: AppStateで管理（削除済み）

declare let tx: string; // 一時変数
declare let mnuPropertyWindow: HTMLElement | undefined; // 変更される可能性あり
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
    constructor(left_point?: point | number, right_size?: point | size | number, top?: number, bottom?: number);
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
    Pon: number;
    pxy: point[];
    nPolyP: number[];
}

// 境界整列データ（clsPrint.tsで実装）
interface IboundArrangeData {
    Pon: number;
    Fringe: Fringe_Line_Info[];
    Arrange_LineCode: number[][];
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
    Tile?: Tile_Property;
    Line?: Line_Property;
    Padding?: number;
    Round?: number;
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
    ScrView: rectangle;
    ScrRectangle: rectangle;
    MapRectangle: rectangle;
    MapScreen_Scale: rectangle;
    ScreenMG: Magnification;
    PrinterMG: Magnification;
    Zahyo: Zahyo_info;
    Screen_Margin: ScreenMargin;
    Get_SxSy_With_3D(p: point): point;
    Get_SxSy_With_3D(pxy: point[]): point[];
    Get_SxSy_With_3D(Pnum: number, inXY: point[], ReverseGetF: boolean): point[];
    Get_SxSy_With_3D(rect: rectangle): rectangle;
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
    Edge_Connect_Pattern: LineEdge_Connect_Pattern_Data_Info;
    Visible?: boolean; // 表示/非表示フラグ
    Clone(): Line_Property;
    Set_Same_ColorWidth_to_LinePat(Color: colorRGBA, width: number): void;
}

// Tile_Property クラス (clsTime.tsで実装)
declare class Tile_Property {
    BlankF: boolean;
    Color: colorRGBA;
    Width?: number; // Line描画時に使用される場合がある
    Edge_Connect_Pattern?: LineEdge_Connect_Pattern_Data_Info; // Line描画時に使用される場合がある
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
type Color = colorRGBA; // colorRGBA型エイリアス（大文字始まり）
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
    lineCap?: CanvasLineCap;
    lineJoin?: CanvasLineJoin;
    miterLimit?: number;
    Edge_Pattern?: number; // enmEdge_Pattern
    Join_Pattern?: number; // enmJoinPattern
    MiterLimitValue?: number;
    Clone?(): LineEdge_Connect_Pattern_Data_Info;
}

declare class Line_Property {
    BlankF?: boolean;
    Edge_Connect_Pattern?: LineEdge_Connect_Pattern_Data_Info;
    Width?: number;
    Color?: colorRGBA;
    Pattern?: number[];
    Pat?: number[]; // LinePattern関連（数値配列）
    Set_Same_ColorWidth_to_LinePat?: (color: colorRGBA, width: number) => void;
    Clone?: () => Line_Property;
    Draw_Fan?: (...args: JsonValue[]) => void;
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
    toContextFont?(ScrData: Screen_info): { font: string | undefined; height: number };
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
    Arrange_LineCode?: number[][];
    Pon: number;
    constructor();
}

declare class Setting_Info {
    ObjectName_Word_Compatible?: string;
    KatakanaCheck?: boolean;
    SinKyuCharacter?: boolean;
    SetFont?: string;
    MinimumLineWidth?: number;
    Printing_Time_Limit?: number;
    Ido_Kedo_Print_Pattern?: number;
    Compass_Mark?: number;
    Compass_Mark_Size?: number;
    default_Projection?: number;
    MDRFileHistory?: JsonValue;
    BackImageSpeed?: number;
    LegendMinusWord?: string;
    LegendPlusWord?: string;
    LegendBlockmodeWord?: string;
    [key: string]: JsonValue;
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
    addSelectList?: (items: ListItem[], selectedIndex?: number, resetF?: boolean, astariskNonF?: boolean, insertPoint?: number) => void;
    getText?: () => string;
    getValue?: () => string | number;
    setSelectText?: (text: string) => void;
    setSelectData?: (index: number, value: string | number, text: string) => void;
    setAstarisk?: (value: string | number, astariskAddF: boolean) => void;
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
    addSelectList?: (items: ListItem[], selectedIndex?: number, resetF?: boolean, astariskNonF?: boolean, insertPoint?: number) => void;
    setSelectData?: (index: number, value: string | number, text: string) => void;
    setAstarisk?: (value: string | number, astariskAddF: boolean) => void;
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

// Number の定義は globals.d.ts の冒頭 (147行目付近) に統合されています

// String の定義は globals.d.ts の冒頭 (150行目付近) に統合されています

// Event の定義は globals.d.ts の冒頭 (165行目付近) に統合されています

interface Element {
    setVisibility?: (visible: boolean) => void;
}

// HTMLElement の定義は globals.d.ts の冒頭 (78行目付近) に統合されています

interface Math {
    Max: typeof Math.max;
}

// Legacy globals still referenced across the codebase (typed as unknown for now)
declare function clsSelectData(...args: JsonValue[]): void;
declare class GraphModeDataItem { [key: string]: JsonValue; constructor(...args: JsonValue[]); }
declare function clsTileSet(...args: JsonValue[]): void;
declare function clsLinePatternSet(event: MouseEvent, line: LinePattern, okEvent: (line: LinePattern) => void): void;
declare function graphModeEn_Obi(...args: JsonValue[]): void;
declare function graphModeOresen_Bou(...args: JsonValue[]): void;
declare function openMapFile(...args: JsonValue[]): JsonValue;
declare class clsMapdata { [key: string]: JsonValue; constructor(...args: JsonValue[]); }
declare class clsAttrData implements IAttrData { 
    TotalData: IAttrData['TotalData'];
    TempData: IAttrData['TempData'];
    LayerData: IAttrData['LayerData'];
    [key: string]: JsonValue; 
    constructor(...args: JsonValue[]); 
}
declare class clsTileMap { [key: string]: JsonValue; constructor(...args: JsonValue[]); }
declare class clsDrawMarkFan {
    static init?: (...args: JsonValue[]) => void;
    static getMarkShameNum?: (...args: JsonValue[]) => number;
    static Draw_Fan?: (...args: JsonValue[]) => void;
    static Draw_Mark_Sample_Box?: (...args: JsonValue[]) => void;
    static Mark_Print?: (...args: JsonValue[]) => void;
}
declare const ListBox: typeof import('./clsGeneric').ListBox;
declare const CheckedListBox: typeof import('./clsGeneric').CheckedListBox;
declare const ListViewTable: typeof import('./clsGeneric').ListViewTable;
declare function frmPrint_DummyObjectGroup(...args: JsonValue[]): void;
declare function frmProjectionConvert(...args: JsonValue[]): void;
declare function frmPrintOption(...args: JsonValue[]): void;
declare function frmPrint_ObjectValue(...args: JsonValue[]): void;
declare function frmPrint_backImageSet(...args: JsonValue[]): void;
declare function frmCompassSettings(...args: JsonValue[]): void;
declare class clsSpline { static Spline_Get?: (...args: JsonValue[]) => JsonValue; }
declare class strLocationSearchObject { [key: string]: JsonValue; constructor(...args: JsonValue[]); }
declare class LPatSek_Info { [key: string]: JsonValue; constructor(...args: JsonValue[]); }
declare class strDummyObjectPointMark_Info { 
    ObjectKindName: string;
    Mark: Mark_Property;
    Clone(): strDummyObjectPointMark_Info;
}
declare class strCondition_Limitation_Info { [key: string]: JsonValue; constructor(...args: JsonValue[]); }
declare class strDummyObjectName_and_Code { [key: string]: JsonValue; constructor(...args: JsonValue[]); }
declare class strOverLay_DataSet_Item_Info { [key: string]: JsonValue; constructor(...args: JsonValue[]); }
declare class strContour_Data_Irregular_interval { [key: string]: JsonValue; constructor(...args: JsonValue[]); }
declare class strClass_Div_data { [key: string]: JsonValue; constructor(...args: JsonValue[]); }
declare class clsSortingSearch { [key: string]: JsonValue; constructor(...args: JsonValue[]); }
declare function clsColorPicker(...args: JsonValue[]): void;
declare function clsMarkSet(event: MouseEvent, okEvent: (mark: Mark) => void, mark: Mark, _attrData: JsonValue): void;
declare function clsInnerDataSet(...args: JsonValue[]): void;
declare function clsLineEdgePattern(...args: JsonValue[]): void;
declare function clsColorChart(...args: JsonValue[]): void;
declare function clsArrow(...args: JsonValue[]): void;
declare function clsGrid(...args: JsonValue[]): void;
declare function clsCompassSettings(...args: JsonValue[]): void;
declare function frmMain_Buffer(...args: JsonValue[]): void;
declare function frmMain_AreaPeripheri(...args: JsonValue[]): void;
declare function frmMain_Culc(...args: JsonValue[]): void;
declare function frmMain_GetDistance(...args: JsonValue[]): void;
declare function frmMain_ConditionSettings(...args: JsonValue[]): void;
declare function frmMainCopyDataSettings(...args: JsonValue[]): void;
declare function frmMain_SetSeriesMode(...args: JsonValue[]): void;
declare function frmMain_MarkPosition(...args: JsonValue[]): void;
declare function frmMain_LayeObjectSelectOne(...args: JsonValue[]): void;
declare function settingFront(...args: JsonValue[]): void;
declare const clsSpatialIndexSearch: typeof import('./SpatialIndexSearch').clsSpatialIndexSearch;
declare class strFrmCopyObjectName_init_parameter_data { [key: string]: JsonValue; constructor(...args: JsonValue[]); }
declare function frmCopyObjectName(...args: JsonValue[]): void;
declare class strOverLay_Dataset_Info { 
    [key: string]: JsonValue;
    Clone?: () => strOverLay_Dataset_Info;
    constructor(...args: JsonValue[]); 
}
declare class strSeries_Dataset_Info { [key: string]: JsonValue; constructor(...args: JsonValue[]); }
declare class strCondition_DataSet_Info { [key: string]: JsonValue; constructor(...args: JsonValue[]); }
declare class strCondition_Data_Info { [key: string]: JsonValue; constructor(...args: JsonValue[]); }
declare class strObject_Data_Info { [key: string]: JsonValue; constructor(...args: JsonValue[]); }
declare class strSeries_DataSet_Item_Info { [key: string]: JsonValue; constructor(...args: JsonValue[]); }
declare class strLKOjectGroup_Info { 
    Name?: string;
    GroupNumber?: number;
    UseOnly?: boolean;
    Pattern?: Line_Property;
    ObjGroup?: strLKOjectGroup_Info[];
    NumofObjectGroup?: number;
    [key: string]: JsonValue; 
    constructor(...args: JsonValue[]); 
}
declare class strTileMapViewInfo { [key: string]: JsonValue; constructor(...args: JsonValue[]); }
declare class strCompass_Attri { 
    Mark?: Mark_Property;
    Position?: point;
    Visible?: boolean;
    [key: string]: JsonValue; 
    constructor(...args: JsonValue[]); 
}
declare class clsDrawLine { [key: string]: JsonValue; static Arrow?: (...args: JsonValue[]) => void; static Line?: (...args: JsonValue[]) => void; static Draw_Sample_LineBox?: (...args: JsonValue[]) => void; static Check_Draw_Arrow_Line?: (OP: point, BeforPoint: point, LineP1: point, LineP2: point, LPat: Tile_Property, DArrow: Arrow_Property, ScrData: Screen_info) => point | undefined; }
declare class clsDrawTile { [key: string]: JsonValue; static Darw_Sample_BackGroundBox?: (...args: JsonValue[]) => void; static Draw_Poly_Inner?: (...args: JsonValue[]) => void; static Draw_Tile_Box?: (...args: JsonValue[]) => void; static Draw_Tile_RoundBox?: (...args: JsonValue[]) => void; }
declare class tileList_Data_Info { [key: string]: JsonValue; constructor(...args: JsonValue[]); }
declare class EnableMPLine_Data { [key: string]: JsonValue; constructor(...args: JsonValue[]); }

// EnableMPLine インターフェース
interface EnableMPLine {
    LineCode: number;
    Kind: number;
}

declare class strContour_Line_property { [key: string]: JsonValue; constructor(...args: JsonValue[]); }
declare class clsMeshContour { [key: string]: JsonValue; constructor(...args: JsonValue[]); }
declare class Legend2_Atri { [key: string]: JsonValue; constructor(...args: JsonValue[]); }
declare class clsFontSet { [key: string]: JsonValue; constructor(...args: JsonValue[]); }
declare function clsFontSet(...args: JsonValue[]): void;
declare function clsDrawTileSample(...args: JsonValue[]): void;
declare const enmBasePosition: { readonly [key: string]: number };
declare const enmKenCodeObjectstructure: { readonly MapObj: number; readonly SyntheticObj: number };
declare const enmObjectGoupType_Data: { readonly [key: string]: number };
declare const enmCondition: { readonly [key: string]: number };
declare const enmDataSource: {
    NoData: number;
    [key: string]: number;
};
declare const enmPrint_Enable: {
    Printable: number;
    [key: string]: number;
};
declare const enmMarkPrintType: { readonly [key: string]: number };
declare const enmDivisionMethod: { readonly [key: string]: number };
declare const enmPaintColorSettingModeInfo: {
    SoloColor: number;
    [key: string]: number;
};
declare const enmMarkBlockArrange: {
    Random: number;
    [key: string]: number;
};
declare const enmMarkBarShape: { readonly [key: string]: number };
declare const enmMarkSizeValueMode: {
    inDataItem: number;
    [key: string]: number;
};
declare const enmContourIntervalMode: { readonly [key: string]: number };
declare const enmBarLineMaxMinMode: { readonly [key: string]: number };
declare const enmMarkMaxValueType: { readonly [key: string]: number };
declare const enmInner_Data_Info_Mode: { readonly [key: string]: number };
declare const enmClassMode_Meshod: {
    Separated: number;
    [key: string]: number;
};
declare const enmEdge_Pattern: { readonly [key: string]: number };
declare const enmSeparateClassWords: { readonly [key: string]: number };
declare const enmScaleBarPattern: { readonly [key: string]: number };
declare const enmGraphMaxSize: { readonly [key: string]: number };
declare const enmStackedBarChart_Direction: {
    Vertical: number;
    [key: string]: number;
};
declare const enmBarChartFrameAxePattern: { readonly [key: string]: number };
declare const enmMultiEnGraphPattern: { readonly [key: string]: number };
declare const enmLatLonLine_Order: { readonly [key: string]: number };
declare const enmOutputDevice: { readonly [key: string]: number };
declare const enmDrawTiming: { readonly [key: string]: number };
declare const enmLineConnect: { readonly [key: string]: number };
declare const enmPointOnjectDrawOrder: { readonly [key: string]: number };
// レガシーコンストラクタ型（互換性維持のため、戻り値の型をJsonObjectに統一）
declare const Quad_Mesh_Info: { new(...args: JsonValue[]): JsonObject; [key: string]: JsonValue };
declare const LineCodeStac_Data: { new(...args: JsonValue[]): JsonObject; [key: string]: JsonValue };
declare const strDefTimeAttDataEach_Info: { new(...args: JsonValue[]): JsonObject; [key: string]: JsonValue };
declare const strDefTimeAttData_Info: { new(...args: JsonValue[]): JsonObject; [key: string]: JsonValue };

interface Zahyo_info {
    Mode: number; // enmZahyo_mode_info (必須プロパティに変更)
    System: number; // enmZahyo_System_Info (必須プロパティに変更)
    HeimenTyokkaku_KEI_Number: number; // 平面直角座標系の系番号 (必須プロパティに変更)
    Projection: number; // enmProjection_Info (必須プロパティに変更)
    CenterXY: point;
    Zahyo?: Zahyo_info; // 自己参照（実装で使用されている場合）
    Clone(): Zahyo_info;
    [key: string]: JsonValue;
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
    Detail: { DistanceMeasurable?: boolean; ScaleVisible?: boolean; [key: string]: JsonValue };
    MapCompass: { Position?: point; Visible?: boolean; Mark?: Mark_Property; Font?: Font_Property; dirWord?: { North?: string; East?: string; West?: string; South?: string; }; [key: string]: JsonValue };
}
declare const strMap_data: {
    new(): strMap_data;
    prototype: strMap_data;
};

interface EventTarget {
    tag?: string | number;
    selectedIndex?: number;
    value?: JsonValue;
}

// 関数
declare function logX(data: JsonValue): void;
declare function init(): void;
declare function setting(search: string): void;
declare function contextMenuPrevent(e: Event): void;
declare function frmPrintFront(): void;
declare function FrmprintMenuClick(pos: point): void;
declare function dataValueShow(): void;
declare function backImageButton(): void;
declare function mapMouse(canvas: HTMLCanvasElement, callback: Function): void;
declare function AddMeshPoint(objectNum: number, action: JsonValue): void;
declare function AddMeshRect(objectNum: number, action: JsonValue): void;

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

declare const TKY2JGDInfo: { new(): JsonObject; Tokyo97toITRF94: (latlonP: latlon) => latlon; ITRF94toTokyo97: (latlonP: latlon) => latlon; [key: string]: JsonValue };

// String の定義は globals.d.ts の冒頭 (150行目付近) に統合されています

// Zlib library
interface ZlibUnzip {
    getFilenames(): string[];
    decompress(filename: string): Uint8Array;
}

interface ZlibZip {
    addFile(data: Uint8Array, options: {filename: Uint8Array}): void;
    compress(): Uint8Array;
}

declare const Zlib: {
    Zip: new() => ZlibZip;
    Unzip: new(buffer: Uint8Array) => ZlibUnzip;
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
    numberCheck?: boolean;
}

interface HTMLDivElement {
    tooltip?: string;
    selected?: boolean;
    setTitle?: (title: string) => void;
    setVisibility?: (visible: boolean) => void;
    panel?: HTMLElement;
    name?: string;
    sizeFixed?: boolean;
    relativeSize?: size;
    bottomRightPositionFixed?: boolean;
    relativePosition?: point;
}

// HTMLElement の定義は globals.d.ts の冒頭 (78行目付近) に統合されています

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
    addSelectList?: (items: ListItem[], selectedIndex?: number, resetF?: boolean, astariskNonF?: boolean, insertPoint?: number) => void;
    getValue?: () => JsonValue;
    getText?: () => string;
    oldSel?: number;
    setSelectValue?: (value: string | number) => void;
    tooltip?: string;
    setSelectText?: (text: string) => void;
    setSelectData?: (index: number, value: string | number, text: string) => void;
}

// Global functions
declare function Check_Print_err(): void;

// Shapefile class
declare const clsShapefile: { new(...args: JsonValue[]): JsonObject; [key: string]: JsonValue };

// Additional global variables
declare let picMark: HTMLElement | undefined; // 変更される可能性あり
declare let lstDummyItem: HTMLElement | undefined; // 変更される可能性あり

// Array extensions
interface Array<T> {
    trueNum?: number;
    DummyOBGArray?: boolean[];
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
    Clone(arg?: JsonValue): Grid_Color;
}

declare class Operation_enable_info {
    Clone(arg?: JsonValue): Operation_enable_info;
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
    // 代替プロパティ名
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    constructor(nw?: latlon, se?: latlon);
}

// clsDrawLine は clsDraw.ts で実装済み

declare class Generic {
    static createNewCanvas(parent: HTMLElement, id: string, className: string, x: number, y: number, width: number, height: number, selectColor?: string): HTMLCanvasElement;
    static alert(event: Event, message: string, callback?: Function): void;
    static alert(message: string, callback?: Function): void;
    static createMsgBox(title: string, message: string, showOk: boolean, arg4?: JsonValue, arg5?: JsonValue, arg6?: JsonValue, arg7?: JsonValue, arg8?: JsonValue, arg9?: JsonValue, arg10?: JsonValue): void;
    static createNewDiv(parent: HTMLElement, text: string, id: string, className: string, x: number, y: number, width?: number | string, height?: number | string, style?: string, arg10?: JsonValue): HTMLDivElement;
    static addSelectList(selectElement: HTMLSelectElement | string, items: ListItem[], selectedIndex?: number, resetF?: boolean): void;
    static createNewRadioButtonList(parent: HTMLElement, name: string, list: ListItem[], x: number, y: number, w?: number | string, h?: number | string, defaultValue?: string | number, changeHandler?: Function, fontSize?: number): HTMLElement;
    static createNewFrame(parent: HTMLElement, text: string, id: string, x: number, y: number, width: number, height: number, title?: string, arg9?: JsonValue, arg10?: JsonValue): HTMLElement;
    static createNewWordNumberInput(parent: HTMLElement, label: string, id: string, value: string | number, unit?: string, x?: number, y?: number, w?: number | string, h?: number | string, className?: string, arg11?: JsonValue): HTMLInputElement;
    static Get_LatLon_Strings(latlon: latlon, arg2?: boolean): {x: string, y: string};
    static convValue(value: string | number): number;
    static Remove_Same_String(arr: string[]): string[];
    static createNewCheckBox(parent: HTMLElement, text: string, id: string, checked: boolean, x: number, y: number, arg7?: JsonValue, onChange?: Function, arg9?: JsonValue, arg10?: JsonValue): HTMLInputElement;
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
    static Get_MeshCode_Rectangle(meshcode: string, meshType: number, refOrigin: number, refDestZahyo: Zahyo_info): {
        convRect: rectangle;
        latlonBox: { NorthWest: latlon; NorthEast: latlon; SouthEast: latlon; SouthWest: latlon; CenterPoint: () => latlon };
        RPoint: point[];
    };
    static Distance_Ido_Kedo_XY_Point(P1: point, P2: point, MapDTMapZahyo: Zahyo_info): number;
    static Distance_Ido_Kedo_XY(P1: point, P2: point, MapDTMapZahyo: Zahyo_info): number;
    static Distance_Ido_Kedo_LatLon(D1: latlon, D2: latlon): number;
    static Line_Cross_Point(LAP1: point, LAP2: point, LBP1: point, LBP2: point): point | undefined;
    static Get_Ido_Kedo_from_MeshCode(meshcode: string, meshType: number): latlonbox;
    static ConvertRefSystemLatLon(ll: latlon, refOrigin: number, refDest: number): latlon;
    static getCircumscribedRectangle(points: point[] | point | rectangle, margin?: number | rectangle): rectangle;
    static Get_TurnedBox(size: size, angle: number): size;
    static Get_Scale_Baititu_IdoKedo(p: point, MPDataMapZahyo: Zahyo_info): number;
    static Trans3D(x: number, y: number, z?: number, center?: point, expand?: number, pitch?: number, head?: number, bank?: number, xyPara?: JsonValue): point;
    static Trans2D(CP: point, Kakudo_P: number | point, Kakudo?: number): point;
    static Check_Zahyo_Projection_Convert_Enabled(zahyo: Zahyo_info, zahyo2?: Zahyo_info): { ok: boolean; emes: string };
    static Get_Reverse_and_Convert_XY(point: point, oldMapZahyo: Zahyo_info, newMapZahyo: Zahyo_info): point;
    static check_Point_in_Polygon(point: point, polygon: point[][]): { ok: boolean; CrossPoint_X: number[] };
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
    static BoundaryArrangeGeneral(arg1?: JsonValue, arg2?: JsonValue, arg3?: JsonValue): JsonValue;
    static Check_TwoRectangele_Inner_Contact(rect1: rectangle, rect2: rectangle): boolean;
    static Check_PointInBox(checkXY: point, Kakudo: number, Rect: rectangle): boolean;
    static checkAndModifyPointInRect(point: point, rect: rectangle): point;
    static Check_PsitionReverse_Enable(Position: point, MPDataMapZahyo: Zahyo_info): boolean;
}

// clsDrawLine と clsDrawMarkFan は clsDraw.ts で実装済み

// リストボックス
declare class ListBox {
    constructor(parent: HTMLElement, classname?: string, list?: string[], x?: number, y?: number, width?: number, height?: number, onChange?: Function, styleinfo?: string);
    getSelectedIndex(): number;
    setSelectedIndex(index: number): void;
    setItems(items: string[]): void;
    selectedIndex?: number;
    frame?: HTMLElement;
    length?: number;
    value?: string | number;
    options?: string[];
    getItems?: () => string[];
    clear?: () => void;
    add?: (item: string) => void;
    addList?: (items: string[], pos?: number) => void;
    addSelectList?: (items: string[], pos?: number) => void;
    removeList?: (pos: number, delNum?: number) => void;
    removeAll?: () => void;
    getText?: (index?: number) => string;
    getAllText?: () => string[];
    getAllValue?: () => Array<string | number>;
    getValue?: () => string | number;
    setValue?: (row: number, value: string | number) => void;
    setText?: (row: number, text: string) => void;
    rowUp?: (row: number) => void;
    rowDown?: (row: number) => void;
}

// チェックリストボックス
declare class CheckedListBox {
    constructor(parent: HTMLElement, classname?: string, list?: string[], x?: number, y?: number, width?: number, height?: number, twoStepCheckF?: boolean, onChange?: Function, styleinfo?: string);
    getChecked(): { checkedStatus: boolean[]; checkedArray: number[] };
    getCheckedStatus(n: number): boolean;
    setChecked(index: number, checked: boolean): void;
    setCheckStatus(n: number, checked: boolean): void;
    getSelectedIndex(): number;
    setSelectedIndex(index: number): void;
    setItems(items: string[]): void;
    addList(list: string[], pos?: number): void;
    removeList(pos: number, delNum?: number): void;
    removeAll(): void;
    setText(n: number, text: string): void;
    add(item: string): void;
    frame?: HTMLElement;
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
declare const strScale_Attri: { new(): JsonObject; [key: string]: JsonValue };

// clsAttrData.ts の関数コンストラクタ型（戻り値をJsonObjectに統一）
declare const strDegreeMinuteSeconde: { new(...args: JsonValue[]): JsonObject; [key: string]: JsonValue };
declare const strLatLonDegreeMinuteSecond: { new(...args: JsonValue[]): JsonObject; [key: string]: JsonValue };
declare const Start_End_Time_data: { new(): JsonObject; StartTime?: JsonValue; EndTime?: JsonValue; [key: string]: JsonValue };
declare const strContourData: { new(): JsonObject; [key: string]: JsonValue };
declare const strMeshPaint: { new(): JsonObject; [key: string]: JsonValue };
declare const strMesh3DPaint: { new(): JsonObject; [key: string]: JsonValue };
declare const strLayerData: { new(): JsonObject; [key: string]: JsonValue };
declare const strLabelDummyData: { new(): JsonObject; [key: string]: JsonValue };
declare const strLabel_Data: { new(): JsonObject; [key: string]: JsonValue };
declare const strGraphData: { new(): JsonObject; [key: string]: JsonValue };
declare const strLabel_Attri: { new(): JsonObject; [key: string]: JsonValue };
declare const strGraph_Attri: { new(): JsonObject; [key: string]: JsonValue };
declare const strOverLay_Attri: { new(): JsonObject; [key: string]: JsonValue };
declare const strTotalData: { new(): JsonObject; [key: string]: JsonValue };
declare const strLinkURL: { new(): JsonObject; [key: string]: JsonValue };
declare const strDataTile: { new(): JsonObject; [key: string]: JsonValue };
declare const strDataTileList: { new(): JsonObject; [key: string]: JsonValue };
declare const strDataObject: { new(): JsonObject; [key: string]: JsonValue };
declare const strDataTitle: { new(): JsonObject; [key: string]: JsonValue };
declare const strDataEdit: { new(): JsonObject; [key: string]: JsonValue };
declare const strDataEditRow: { new(): JsonObject; [key: string]: JsonValue };
declare const strDataEditCell: { new(): JsonObject; [key: string]: JsonValue };
declare const strCategoryData: { new(): JsonObject; [key: string]: JsonValue };
declare const strMaskData: { new(): JsonObject; [key: string]: JsonValue };
declare const strMPLine: { new(): JsonObject; [key: string]: JsonValue };
declare const strMPLineSub: { new(): JsonObject; [key: string]: JsonValue };
declare const strDataStatistics: { new(): JsonObject; [key: string]: JsonValue };
declare const strLegend_Attri: { new(): JsonObject; [key: string]: JsonValue };
declare const strPrint_Mode: { new(): JsonObject; [key: string]: JsonValue };
declare const strSoloData: { new(): JsonObject; [key: string]: JsonValue };
declare const strSeriesData: { new(): JsonObject; [key: string]: JsonValue };
declare const strOverlayData: { new(): JsonObject; [key: string]: JsonValue };
declare const strPaintModeData: { new(): JsonObject; [key: string]: JsonValue };
declare const strMarkData: { new(): JsonObject; [key: string]: JsonValue };
declare const strBarData: { new(): JsonObject; [key: string]: JsonValue };
declare const strPieData: { new(): JsonObject; [key: string]: JsonValue };
declare const strFlowData: { new(): JsonObject; [key: string]: JsonValue };
declare const strTileMarkData: { new(): JsonObject; [key: string]: JsonValue };
declare const strTimeData: { new(): JsonObject; [key: string]: JsonValue };
declare const strViewStyle: { new(): JsonObject; [key: string]: JsonValue };
declare const strScreenData: { new(): JsonObject; [key: string]: JsonValue };
declare const strMapLegend: { new(): JsonObject; [key: string]: JsonValue };
declare const strMapTitle: { new(): JsonObject; [key: string]: JsonValue };
declare const strMapScale: { new(): JsonObject; [key: string]: JsonValue };
declare const strMapNorth: { new(): JsonObject; [key: string]: JsonValue };
declare const strGridLine: { new(): JsonObject; [key: string]: JsonValue };
declare const strBackGround: { new(): JsonObject; [key: string]: JsonValue };
declare const strMapOverLay: { new(): JsonObject; [key: string]: JsonValue };
declare const strCondition: { new(): JsonObject; [key: string]: JsonValue };
declare const strConditionItem: { new(): JsonObject; [key: string]: JsonValue };
declare const strConditionValue: { new(): JsonObject; [key: string]: JsonValue };
declare const strPointObject: { new(): JsonObject; [key: string]: JsonValue };
declare const strPolyObject: { new(): JsonObject; [key: string]: JsonValue };
declare const strLineObject: { new(): JsonObject; [key: string]: JsonValue };
declare const strObjectGroup: { new(): JsonObject; [key: string]: JsonValue };
declare const strAttrValue: { new(): JsonObject; [key: string]: JsonValue };
declare const strThreeD_Mode: { new(): JsonObject; [key: string]: JsonValue };
declare const strPrintFooter: { new(): JsonObject; [key: string]: JsonValue };
declare const strPrintHeader: { new(): JsonObject; [key: string]: JsonValue };
declare const strMapPrint: { new(): JsonObject; [key: string]: JsonValue };
declare const strColorPalette: { new(): JsonObject; [key: string]: JsonValue };
declare const strDivideValue: { new(): JsonObject; [key: string]: JsonValue };
declare const strTripObjData_Info: { new(): JsonObject; [key: string]: JsonValue };

interface IObjectKindUsed_Info {
    MapFileName?: string;
    ObjectKindNumber?: number;
    Mark?: Mark_Property;
    ObjectKindName?: string;
    [key: string]: JsonValue;
}
declare const strObjectKindUsed_Info: { new(): IObjectKindUsed_Info; [key: string]: JsonValue };

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
    data?: JsonValue;
}

/**
 * 座標変換情報型
 * 座標系の投影変換に使用
 */
interface zahyohenkan {
    Mode: number; // enmZahyo_mode_info
    System: number; // enmZahyo_System_Info
    HeimenTyokkaku_KEI_Number: number; // 平面直角座標系の系番号
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

type RadioValue = string | number | boolean;

/**
 * レイヤー情報型
 * 地図レイヤーの管理に使用
 */
interface LayerInfo {
    id: string | number;
    name: string;
    visible: boolean;
    data?: JsonValue;
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
