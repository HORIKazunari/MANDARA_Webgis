/**
 * 共通型定義ファイル
 * 
 * このファイルは汎用的なユーティリティ型とヘルパー型を定義します。
 * 
 * 使い分け:
 * - このファイル (types.ts): 汎用的な型、export/importで使用
 * - globals.d.ts: グローバル変数の型、DOM拡張、既存クラス定義
 * 
 * 新しい型を追加する際は:
 * 1. 汎用的な型 → このファイル
 * 2. アプリケーション固有でグローバルに必要 → globals.d.ts
 * 3. ドメイン固有 → 専用の型定義ファイル (例: types/mapData.ts)
 */

// ==================== 汎用ユーティリティ型 ====================

/**
 * イベントハンドラー型
 * 各種DOMイベントのハンドラー関数の型定義
 */
export type EventHandler<T = Event> = (event: T) => void;
export type MouseEventHandler = EventHandler<MouseEvent>;
export type DragEventHandler = EventHandler<DragEvent>;
export type KeyboardEventHandler = EventHandler<KeyboardEvent>;

/**
 * Null許容型
 */
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

/**
 * 汎用辞書型
 */
export type Dictionary<T = unknown> = Record<string, T>;

// ==================== アプリケーション固有型 ====================

/**
 * ファイル関連型
 */
export interface FileData {
  file: File;
  name: string;
  extension: string;
  content?: string | ArrayBuffer;
}

/**
 * マップファイル情報型
 */
export interface MapFileInfo {
  name: string;
  path?: string;
  type: 'mpfj' | 'mdrj' | 'mdrmj' | 'csv';
  data?: unknown;
}

/**
 * リスト項目型
 */
export interface ListItem {
  value: string | number;
  text: string;
  selected?: boolean;
  disabled?: boolean;
}

/**
 * ダイアログコールバック型
 */
export type DialogCallback = (result: boolean, data?: unknown) => void;
export type OkCallback = () => void;
export type CancelCallback = () => void;

/**
 * シェープファイル関連型
 */
export interface ShapeFile {
  name: string;
  type: 'point' | 'line' | 'polygon';
  data: unknown;
  properties?: Dictionary<unknown>;
}

export interface ShapeFileCollection {
  [key: string]: ShapeFile;
}

/**
 * レイヤー情報型
 */
export interface LayerInfo {
  id: string | number;
  name: string;
  visible: boolean;
  data?: unknown;
}

/**
 * アプリケーション設定型
 */
export interface AppSettings {
  font?: string;
  fontSize?: number;
  theme?: string;
  [key: string]: unknown;
}

/**
 * データ読み込み結果型
 * 非同期処理の結果を統一的に扱うための型
 */
export interface DataLoadResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: Error | string;
  message?: string;
}

/**
 * 非同期データローダー型
 */
export type DataLoader<T = unknown> = (
  file: File | string
) => Promise<DataLoadResult<T>>;

/**
 * UIコンポーネント共通プロパティ型
 */
export interface ComponentProps {
  id?: string;
  className?: string;
  style?: string;
  visible?: boolean;
  disabled?: boolean;
}

/**
 * 検索フィルター型
 */
export interface SearchFilter {
  query: string;
  caseSensitive?: boolean;
  regex?: boolean;
  fields?: string[];
}

/**
 * HTMLElement with custom properties (clsWindowで使用)
 */
export interface ExtendedHTMLElement extends HTMLElement {
  selected?: boolean;
  disabled?: boolean;
  tooltip?: string;
  tag?: string | number;
}

/**
 * Radio button value type
 */
export type RadioValue = string | number | boolean;

/**
 * Radio button list item
 */
export interface RadioListItem {
  value: RadioValue;
  text: string;
}

/**
 * Table data type (2D array of strings or numbers)
 */
export type TableData = Array<Array<string | number>>;

/**
 * Map data type (any JSONデータ)
 */
export type MapData = Record<string, unknown>;

/**
 * Navigator with legacy IE properties
 */
export interface ExtendedNavigator extends Navigator {
  msSaveBlob?: (blob: Blob, filename: string) => boolean;
  msSaveOrOpenBlob?: (blob: Blob, filename: string) => void;
}

/**
 * Select element change handler
 */
export type SelectChangeHandler = (
  obj: HTMLSelectElement,
  sel: number,
  v: string
) => void;

/**
 * 色設定型
 */
export type ColorValue = string; // CSS color string

/**
 * タイル設定型 (仮定)
 */
export interface TileConfig {
  pattern?: string;
  color?: ColorValue;
  [key: string]: unknown;
}

/**
 * マーク設定型
 */
export interface MarkConfig {
  type?: string;
  size?: number;
  color?: ColorValue;
  [key: string]: unknown;
}

/**
 * 線パターン設定型
 */
export interface LinePattern {
  type?: string;
  width?: number;
  color?: ColorValue;
  [key: string]: unknown;
}

/**
 * 矢印設定型
 */
export interface ArrowConfig {
  start?: string;
  end?: string;
  [key: string]: unknown;
}

/**
 * 選択モード型（enmSelectMode）
 */
export type SelectMode = number;

/**
 * ソロモード型（enmSoloMode_Number）
 */
export type SoloMode = number;

/**
 * コールバック関数型（汎用）
 */
export type CallbackFunction = (...args: unknown[]) => void;
export type ValueCallback<T = unknown> = (value: T) => void;
export type ObjectValueCallback = (obj: HTMLElement, value: unknown) => void;

/**
 * マーク型
 */
export type Mark = unknown; // 具体的な型定義が必要な場合は後で詳細化

/**
 * タイル型
 */
export type Tile = unknown; // 具体的な型定義が必要な場合は後で詳細化

/**
 * ラインパターン型
 */
export type LinePattern = unknown; // 具体的な型定義が必要な場合は後で詳細化

/**
 * カラー型
 */
export type Color = string | number;

/**
 * フォント型
 */
export type Font = unknown; // 具体的な型定義が必要な場合は後で詳細化

/**
 * エッジ型
 */
export type Edge = unknown; // 具体的な型定義が必要な場合は後で詳細化

// ==================== Note ====================
// 以下の型は globals.d.ts に既に定義されているため、このファイルでは定義しない:
// - point, rectangle, size (既存のグローバルクラス)
// - RectangleInfo は rectangle を使用
// - TransformParams は必要に応じて追加
//
// 将来的には以下の構造への移行を推奨:
// src/types/
//   common.ts      - このファイルの内容
//   geometry.ts    - 座標・図形関連型
//   map.ts         - 地図・GIS関連型
//   ui.ts          - UIコンポーネント型
