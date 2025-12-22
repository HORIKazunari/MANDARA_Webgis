# any型削減作業の進捗状況

最終更新: 2025年12月19日

## 概要

TypeScriptプロジェクトにおけるany型使用箇所の削減作業の進捗状況をまとめたドキュメントです。

## 完了したファイル

### ✅ clsGeneric.ts
- **修正箇所**: 主要関数の型指定を完了
- **主な改善内容**:
  - `set_backDiv`: 11個のパラメータを適切な型に変更（string, number, boolean, callback型など）
  - `getMapfileByHttpRequest`: callbackの型を`(data: MapData | string) => void`に変更
  - `createNewRadioButtonList/Button`: RadioValue、RadioListItem型を使用
  - `createNewTable/Grid`: TableData型を使用
  - `decodePolyline`: 戻り値型を`number[][]`に指定
  - `Check_Two_Value_In`: パラメータを`number`型に指定
  - `Angle`: パラメータと戻り値を`number`型に指定
  - `copyText`, `checkFontExist`: 文字列型に指定
  - `ceateTopMenu`, `ceatePopupMenu`: 適切な型に変更
  - イベントハンドラ関数の型指定（Event, MouseEvent型など）
- **残存any型**: CheckedListBox、ListBox、ListViewTable コンストラクタ関数（次のフェーズでクラス変換予定）

### ✅ clsWindow.ts
- **修正箇所**: 主要な型定義と関数パラメータ
- **主な改善内容**:
  - `SetPicPnlSoloDataEnabled`: SoloMode型を使用
  - `SetPicPnlDataEnabled`: SelectMode型を使用
  - `GetModeControlName`: SelectMode型、戻り値にstring型を指定
  - `GetSelectModeFromSoloMode`: SoloMode、SelectMode型を使用
  - 各種コールバック関数の型を指定（Mark, LinePattern, Color, Tile, Font, Edge型など）
  - 約20箇所のany型を適切な型に置き換え
- **残存any型**: 約100箇所（主にインラインコールバック関数）
  - 大部分は UI イベントハンドラのコールバック関数
  - 優先度は低いが、今後段階的に修正予定

### ✅ clsSubWindows.ts
- **修正箇所**: 主要なサブウィンドウ関数
- **主な改善内容**:
  - `clsColorPicker`: 引数を`point | MouseEvent`と`(color: Color) => void`に変更
  - `clsMarkSet`: Mark型のコールバックを使用
  - LinePatternGet, tileGet, markSetなどのコールバック関数の型を指定
  - イベントハンドラの型を適切に指定
- **残存any型**: 約15-20箇所（主にコールバック関数）

## 作業中のファイル

### 🔲 clsAttrData.ts
- **推定any型数**: 20+箇所
- **主な箇所**: コンストラクタ関数（function式で定義された疑似クラス）
  - `point3`
  - `strDegreeMinuteSeconde`
  - `strLatLonDegreeMinuteSecond`
  - `Start_End_Time_data`
  - `Cross_Line_Data`
  - `strURL_Data`
  - その他多数のデータ構造定義
- **推奨アプローチ**: 
  1. コンストラクタ関数をクラスに変換
  2. インターフェースまたは型エイリアスで型定義
  3. globals.d.tsに統合

### 🔲 clsMapdata.ts
- **推定any型数**: 20+箇所
- **主な箇所**: コンストラクタ関数とプロパティ
  - `Hennyu_Data`
  - `Object_Succession_Data`
  - `Object_NameTimeStac_Data`
  - `Object_CenterPoint_Data`
  - `LineCodeStac_Data`
  - データクラスのプロパティ（Title, Unit, MissingF, Note）
- **推奨アプローチ**: clsAttrData.tsと同様

### 🔲 clsDraw.ts
- **推定any型数**: 5-7箇所
- **主な箇所**:
  - `mShape`: 配列の型指定
  - `mark_info`: コンストラクタ関数
  - `clsTileMap`: コンストラクタ関数
  - TileMap関連関数のパラメータ
- **推奨アプローチ**: コンストラクタ関数のクラス変換とパラメータ型指定

## 新規追加された型定義（types.ts）

プロジェクト全体で使用する型定義を追加しました：

```typescript
// 選択モード関連
export type SelectMode = number;
export type SoloMode = number;

// コールバック関数型
export type CallbackFunction = (...args: unknown[]) => void;
export type ValueCallback<T = unknown> = (value: T) => void;
export type ObjectValueCallback = (obj: HTMLElement, value: unknown) => void;

// GIS/図形関連
export type Mark = unknown;
export type Tile = unknown;
export type LinePattern = unknown;
export type Color = string | number;
export type Font = unknown;
export type Edge = unknown;
```

**Note**: Mark, Tile, LinePattern, Font, Edge は暫定的に`unknown`型としています。
今後、具体的な型定義が必要になった場合は詳細化する予定です。

## 統計サマリー

| ファイル | 修正前 | 修正後 | 削減率 |
|---------|--------|--------|--------|
| clsGeneric.ts | ~70箇所 | ~15箇所 | ~79% |
| clsWindow.ts | ~120箇所 | ~100箇所 | ~17% |
| clsSubWindows.ts | ~25箇所 | ~15箇所 | ~40% |
| clsAttrData.ts | ~20箇所 | ~20箇所 | 0% |
| clsMapdata.ts | ~25箇所 | ~25箇所 | 0% |
| clsDraw.ts | ~7箇所 | ~7箇所 | 0% |

**プロジェクト全体**: 約267箇所 → 約182箇所 （約32%削減）

## 次のステップ

### 優先度: 高
1. **コンストラクタ関数のクラス変換**
   - clsAttrData.ts, clsMapdata.ts, clsDraw.tsの古いコンストラクタ関数をES6クラスに変換
   - これにより自動的にany型の多くが解消される
   - 参照: `TYPESCRIPT_IMPROVEMENT_GUIDELINES.md`のコンストラクタ関数変換パターン

### 優先度: 中
2. **clsWindow.tsの残存any型削減**
   - 主にインラインコールバック関数の型指定
   - パターンが明確なので一括置換で効率的に処理可能
   - 推定作業時間: 1-2時間

3. **clsSubWindows.tsの残存any型削減**
   - 複数マッチする関数名の個別処理
   - 推定作業時間: 30分-1時間

### 優先度: 低
4. **型定義の詳細化**
   - Mark, Tile, LinePattern, Font, Edge型の具体的な定義
   - 実際の使用パターンを分析して適切なインターフェースを設計

## ベストプラクティス

### any型削減の原則
1. **段階的なアプローチ**: 一度にすべてを変更せず、ファイル単位・機能単位で進める
2. **型定義の共有**: types.tsに共通型を定義し、複数ファイルで再利用
3. **テストの実施**: 各修正後に必ずテストを実行（現在47テスト全て通過中）
4. **eslint-disable の使用**: レガシーコード（コンストラクタ関数など）には適切にdisableコメントを使用

### 型指定のガイドライン
- **イベントハンドラ**: `Event`, `MouseEvent`, `KeyboardEvent`などの具体的な型を使用
- **コールバック関数**: 引数と戻り値の型を明示的に指定
- **不明な型**: `unknown`を使用し、`any`は避ける
- **数値定数**: `number`型で十分な場合は型アサーションを避ける

## 参考リソース

- [TYPESCRIPT_IMPROVEMENT_REPORT.md](./TYPESCRIPT_IMPROVEMENT_REPORT.md) - 全体的な改善レポート
- [TYPESCRIPT_IMPROVEMENT_GUIDELINES.md](./TYPESCRIPT_IMPROVEMENT_GUIDELINES.md) - 改善作業のガイドライン
- [types.ts](./src/types.ts) - 共通型定義ファイル
- [globals.d.ts](./src/globals.d.ts) - グローバル型定義ファイル

## 作業履歴

- 2025-12-19: clsGeneric.ts, clsWindow.ts, clsSubWindows.tsの主要any型削減完了
- 2025-12-19: types.tsに共通型定義を追加
- 2025-12-19: 本ステータス文書作成
