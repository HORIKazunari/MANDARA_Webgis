export const enmZahyo_mode_info = {
    Zahyo_No_Mode: 0,
    Zahyo_Ido_Keido: 1,
    Zahyo_Heimentyokukaku: 2
} as const;

export const enmHorizontalAlignment = {
    Left: 0,
    Center: 1,
    Right: 2
} as const;

export const enmVerticalAlignment = {
    Top: 0,
    Center: 1,
    Bottom: 2
} as const;

export const enmMatchingMode = {
    Exact: 0,
    Partial: 1,
    Prefix: 2,
    Suffix: 3,
    PerfectMatching: 0,
    PartialtMatching: 1
} as const;

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

export const enmShape = {
    NotDeffinition: -1,
    PointShape: 0,
    LineShape: 1,
    PolygonShape: 2
} as const;

export const enmLayerType = {
    Normal: 0,
    Trip_Definition: 1,
    Trip: 2,
    Mesh: 3,
    DefPoint: 4
} as const;

export const enmLayerMode_Number = {
    SoloMode: 0,
    GraphMode: 1,
    LabelMode: 2,
    TripMode: 3
} as const;

export const enmTotalMode_Number = {
    DataViewMode: 0,
    OverLayMode: 1,
    SeriesMode: 2
} as const;

export const enmGraphMode = {
    PieGraph: 0,
    StackedBarGraph: 1,
    LineGraph: 2,
    BarGraph: 3
} as const;

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
