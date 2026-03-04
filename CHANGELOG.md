# Changelog

## 2026-03-04 (v2.002)

### 変更概要
- 凡例文字の可視判定を画面座標系に修正。
- 凡例フォールバックの重複描画を抑止。
- `Class_Div` の欠損/疎配列を補完する整合化を追加。
- 設定画面の階級色表示を Solo Mode 基準に修正。
- 画面デバッグ表示を通常モードで無効化。
- 関連回帰テストを追加。

### 主な変更ファイル
- `src/clsAccessory.ts`
- `src/clsAttrData.ts`
- `src/clsDraw.ts`
- `src/clsWindow.ts`
- `tests/japanadm-classdiv.test.ts`
- `tests/select-getvalue-binding.test.ts`

### 確認
- `npm run build` が成功。

### 参照
- Full Changelog: https://github.com/HORIKazunari/MANDARA_Webgis/compare/v2.001...v2.002

## 2026-03-02

### 修正内容
- `データ描画前` の背景描画時に、面オブジェクト内部まで背景が出てしまう問題を修正。
- ペイントモードで地図が着色されない問題を修正。
- ペイントモードの `カラーチャート` ボタンでチャートが表示されない問題を修正。

### 原因と対応
- `Boundary_Kencode_Arrange` の返却値を配列前提で扱っていた箇所があり、実データ形状との差異でポリゴン境界取得が崩れていたため、単体/配列の両方を正規化して扱うように修正。
- カラーチャート表示時の階級数が不正値になるケースを防ぐため、階級数のガードとフォールバック処理を追加。
- カラーチャート描画時に `CanvasRenderingContext2D` が取得できない場合の防御処理を追加。

### 変更ファイル
- `src/clsPrint.ts`
- `src/clsSubWindows.ts`
- `src/clsWindow.ts`

### 確認
- `npm run build` が成功。
- 手動確認で以下を確認済み:
  - 白地図表示が正常化
  - カラーチャート表示が復旧
