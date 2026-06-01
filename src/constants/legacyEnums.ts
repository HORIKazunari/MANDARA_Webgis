/**
 * 座標系モードを表す旧来の数値定数です。
 */
export const enmZahyo_mode_info = {
    Zahyo_No_Mode: -1,
    Zahyo_Ido_Keido: 0,
    Zahyo_Heimentyokukaku: 1
} as const;

/**
 * 水平方向の配置位置を表す旧来の数値定数です。
 */
export const enmHorizontalAlignment = {
    Left: 0,
    Center: 1,
    Right: 2
} as const;

/**
 * 垂直方向の配置位置を表す旧来の数値定数です。
 */
export const enmVerticalAlignment = {
    Top: 0,
    Center: 1,
    Bottom: 2
} as const;

/**
 * 検索時の文字列一致条件を表す旧来の数値定数です。
 */
export const enmMatchingMode = {
    Exact: 0,
    Partial: 1,
    Prefix: 2,
    Suffix: 3,
    PerfectMatching: 0,
    PartialtMatching: 1
} as const;

/**
 * 印刷プレビュー画面でのマウス操作モードを表す旧来の数値定数です。
 */
export const enmPrintMouseMode = {
    Normal: 0,
    PlusMinus: 1,
    Fig: 2,
    SymbolPoint: 3,
    LabelPoint: 4,
    RangePrint: 5,
    Accessory_Drag: 6,
    Distance: 7,
    od: 8,
    DistanceObject: 9,
    MultiObjectSelect: 10,
    MultiObjectswitch: 11
} as const;

/**
 * 地理オブジェクトの図形種別を表す旧来の数値定数です。
 */
export const enmShape = {
    NotDeffinition: -1,
    PointShape: 0,
    LineShape: 1,
    PolygonShape: 2
} as const;

/**
 * レイヤのデータ構造種別を表す旧来の数値定数です。
 */
export const enmLayerType = {
    Normal: 0,
    Trip_Definition: 1,
    Trip: 2,
    Mesh: 3,
    DefPoint: 4
} as const;

/**
 * レイヤ単位の表示モード番号を表す旧来の数値定数です。
 */
export const enmLayerMode_Number = {
    SoloMode: 0,
    GraphMode: 1,
    LabelMode: 2,
    TripMode: 3
} as const;

/**
 * 空間検索で指定する対象形状を表す旧来の数値定数です。
 */
export const SpatialPointType = {
    SinglePoint: 0,
    SPILine: 1,
    SPIRect: 2
} as const;

/**
 * 移動データの位置表現方式を表す旧来の数値定数です。
 */
export const enmTripPositionType = {
    LatLon: 0,
    ObjectSet: 1
} as const;

/**
 * 全体表示モード番号を表す旧来の数値定数です。
 */
export const enmTotalMode_Number = {
    DataViewMode: 0,
    OverLayMode: 1,
    SeriesMode: 2
} as const;

/**
 * グラフ表示の種類を表す旧来の数値定数です。
 */
export const enmGraphMode = {
    PieGraph: 0,
    StackedBarGraph: 1,
    LineGraph: 2,
    BarGraph: 3
} as const;

/**
 * 円形階級区分の凡例線種を表す旧来の数値定数です。
 */
export const enmCircleMDLegendLine = {
    Zigzag: 0,
    Straight: 1
} as const;

/**
 * 座標系モード定数の互換別名です。
 */
export const enmZahyo_mode_info_enum = {
    Zahyo_No_Mode: -1,
    Zahyo_Ido_Keido: 0,
    Zahyo_Heimentyokukaku: 1
} as const;

/**
 * オブジェクト集合の追加・削除操作を表す旧来の数値定数です。
 */
export const Add_or_Remove = {
    Add_Obj: 0,
    Remove_Obj: 1
} as const;

/**
 * 外側判定の結果区分を表す旧来の数値定数です。
 */
export const chvOuter = {
    In: 0,
    Out: 1,
    Over: 2,
    Under: 3
} as const;

/**
 * 属性データ項目の型区分を表す旧来の数値定数です。
 */
export const enmAttDataType = {
    Normal: 0,
    Category: 1,
    Strings: 2,
    URL: 3,
    URL_Name: 4,
    Lon: 5,
    Lat: 6,
    Place: 7,
    Arrival: 8,
    Departure: 9
} as const;
