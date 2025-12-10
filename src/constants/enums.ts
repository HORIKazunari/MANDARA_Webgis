/**
 * 列挙型定数
 * 
 * globals.d.ts の declare var を enum に変換
 */

/**
 * 座標モード情報
 */
export enum ZahyoModeInfo {
    NoMode = 0,
    IdoKeido = 1,
    Heimentyokukaku = 2
}

/**
 * レイヤータイプ
 */
export enum LayerType {
    Point = 0,
    Line = 1,
    Polygon = 2,
    Mesh = 3
}

/**
 * グラフモード
 */
export enum GraphMode {
    NoGraph = 0,
    BarGraph = 1,
    PieGraph = 2,
    LineGraph = 3
}

/**
 * 属性データタイプ
 */
export enum AttDataType {
    Numeric = 0,
    String = 1,
    Date = 2
}

/**
 * メッシュ番号
 */
export enum MeshNumber {
    Mesh1 = 1,
    Mesh2 = 2,
    Mesh3 = 3,
    Mesh4 = 4,
    Mesh5 = 5
}

/**
 * 座標系情報
 */
export enum ZahyoSystemInfo {
    LatLon = 0,
    UTM = 1,
    PlaneRect = 2
}

/**
 * スケール単位
 */
export enum ScaleUnit {
    Meter = 0,
    Kilometer = 1,
    Mile = 2
}

/**
 * 投影法情報
 */
export enum ProjectionInfo {
    Mercator = 0,
    Lambert = 1,
    Albers = 2,
    Orthographic = 3
}

/**
 * 図形種類
 */
export enum Shape {
    Point = 0,
    Line = 1,
    Polygon = 2,
    Circle = 3,
    Rectangle = 4
}

/**
 * レイヤーモード番号
 */
export enum LayerModeNumber {
    Base = 0,
    Overlay = 1,
    Background = 2
}

/**
 * 矩形交差判定
 */
export enum RectangleCross {
    NoIntersection = 0,
    Intersect = 1,
    Contains = 2,
    ContainedBy = 3
}

/**
 * マッチングモード
 */
export enum MatchingMode {
    Exact = 0,
    Partial = 1,
    Forward = 2,
    Backward = 3
}

/**
 * 条件のAND/OR
 */
export enum ConditionAndOr {
    And = 0,
    Or = 1
}

/**
 * トリップ位置タイプ
 */
export enum TripPositionType {
    LatLon = 0,
    ObjectSet = 1
}

/**
 * 線とポリゴンの関係
 */
export const LinePolygonRelation = {
    NoRelation: 0,
    Inside: 1,
    Outside: 2,
    OnBorder: 3
} as const;

export type LinePolygonRelationType = typeof LinePolygonRelation[keyof typeof LinePolygonRelation];
