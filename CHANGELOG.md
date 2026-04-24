# Changelog

## 2026-04-24 (v2.2.5)

### 変更概要
- 本番公開時の Content Security Policy に対応するため、UI 生成コードに残っていたインラインイベント属性を DOM イベント登録へ置き換え。
- `onclick`、`onmouseover`、`onmouseout`、`ondragover` に起因する Firefox の CSP 警告を削減。
- Vite 本番ビルドで source map を生成しないように変更し、公開物から `.map` を除外。
- Apache の公開設定を見直し、HSTS / CSP / nosniff などのヘッダ有効化と公開確認を実施。
- About 表示、トップページ更新履歴、`package.json` / `package-lock.json` の版数を `2.2.5` / `v2.2.5` に更新。

### 主な変更ファイル
- `package.json`
- `package-lock.json`
- `vite.config.ts`
- `index.html`
- `src/clsGeneric.ts`
- `src/clsSubWindows.ts`
- `src/clsWindow.ts`

### 確認
- `npm run build` が成功。
- Firefox 実操作で主要機能と国土地理院タイル取得が正常動作。
- 公開サイトの `curl -I` で HSTS / CSP / nosniff / Referrer-Policy が返ることを確認。
- `.js.map` が公開されていないことを確認。

### 参照
- Full Changelog: https://github.com/HORIKazunari/MANDARA_Webgis/compare/v2.2.4...v2.2.5

## 2026-04-14 (v2.2.4)

### 変更概要
- サンプル起動を `?file=` 直読から `#preset=` allowlist 方式へ変更。
- 地図データの起動時先読みを廃止し、`map/` 配下の `.mpfj` を必要時に自動取得する方式へ変更。
- `.mdrj` / `.mdrmj` 読み込み時、参照地図がサーバー上に存在すれば自動取得し、存在しない場合は手動読み込みを案内するよう改善。
- 地図ファイル選択ダイアログで、提供地図選択後にモーダルが残る不具合を修正。
- README と UI 上の案内文、版数表示を `2.2.4` / `v2.2.4` に更新。

### 主な変更ファイル
- `index.html`
- `README.md`
- `package.json`
- `src/index.ts`
- `src/serverMapLoader.ts`
- `src/clsSubWindows.ts`
- `src/clsWindow.ts`
- `tests/e2e/file-open.spec.ts`

### 確認
- `npm run build` が成功。
- Vitest 9 件成功（`tests/startup-presets.test.ts`, `tests/server-map-loader.test.ts`）。
- Playwright 30 件成功（`tests/e2e/file-open.spec.ts`、Chromium / Firefox / WebKit）。

### 参照
- Full Changelog: https://github.com/HORIKazunari/MANDARA_Webgis/compare/v2.2.3...v2.2.4

## 2026-04-10 (v2.2.3)

### 変更概要
- TypeScript 6.0.2、ESLint 10.2.0、Vite 8.0.8、Vitest 4.1.4 へ更新。
- `npm audit` で検出されていた依存関係の脆弱性を解消。
- Vite 8 のビルド警告を設定回避ではなくコードと設定の整理で解消。
- 単体テストと E2E テストで見つかった不具合を修正し、全テスト通過を確認。
- `package.json`、About 表示、トップページ更新履歴、運用文書の版数表記を `2.2.3` / `v2.2.3` に更新。

### 主な変更ファイル
- `package.json`
- `vite.config.ts`
- `src/clsGeneric.ts`
- `src/clsMapdata.ts`
- `src/clsWindow.ts`
- `tests/e2e/app.spec.ts`

### 確認
- `npm run build` が成功。
- `npm run lint` が成功。
- Vitest 61 件成功。
- Playwright 42 件成功。

### 参照
- Full Changelog: https://github.com/HORIKazunari/MANDARA_Webgis/compare/v2.2.2...v2.2.3

## 2026-03-19 (v2.2.2)

### 変更概要
- 階級記号表示時に不要な凡例が二重表示される問題を修正。
- 属性データ読み込み時に地図配列が二重に渡され、実行時 TypeError で開始画面に戻る問題を修正。
- 内部データ凡例フラグの読込値を boolean に正規化し、表示項目番号の参照先を補正。
- `package.json`、About 表示、トップページ更新履歴、運用文書の版数表記を `2.2.2` / `v2.2.2` に統一。

### 主な変更ファイル
- `src/clsAttrData.ts`
- `src/clsPrint.ts`
- `src/clsWindow.ts`
- `tests/legend-visibility.test.ts`

### 確認
- `npm run build` が成功。
- WebServer 上の実操作で以下を確認済み:
  - WORLD2.mpfj の階級記号表示で凡例が二重にならない
  - 属性データ読み込みで TypeError が発生しない

### 参照
- Full Changelog: https://github.com/HORIKazunari/MANDARA_Webgis/compare/v2.002...v2.2.2

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
