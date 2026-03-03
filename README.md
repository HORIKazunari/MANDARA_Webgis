# MANDARA_Webgis

Webブラウザ上で動作する GIS ソフトウェア **MANDARA JS** の継続改良プロジェクトです。  
元ソフトウェア（MANDARA_JS 1.003）をベースに、TypeScript 化・品質改善・運用性向上を進めています。

## プロジェクト方針

- 元ソフトウェアの機能を維持しつつ、現代ブラウザ環境で安定動作させる
- TypeScript / ESLint / テストにより保守性を高める
- `dist` をそのまま Web サーバーへ配置できる成果物を作る

## 開発環境

- Node.js 18+ 推奨
- npm
- Vite 7
- TypeScript 5.9

## 主要コマンド

```bash
npm install
npm run dev
npm run type-check
npm run lint
npm test
npm run build
```

`npm run build` 実行後、配備対象は `dist/` です。

## 配備（Webサーバー転送）

1. `npm run build` を実行
2. 生成された `dist/` 一式を Web サーバーへ転送
3. `dist/index.html`（または `dist/mandarawebgis.html`）を公開

## 静的データ配置ポリシー（重要）

このプロジェクトは **`public` 非使用** に統一しています。

- `vite.config.ts` で `publicDir: false`
- 元データはプロジェクト直下の以下フォルダで管理
	- `map/`
	- `data/`
	- `image/`
- ビルド時に Vite プラグインで `dist/map`, `dist/data`, `dist/image` へコピー

運用上の混乱を避けるため、`public` 配下に同名データを重複配置しない方針です。

## データファイルについて

- `map/` には `.mpfj`（地図データ）
- `data/` には `.mdrj`, `.mdrmj`（属性データ）
- `image/` には UI 用画像

GitHub のサイズ制限の都合で、一部の大型展開データは含めていません。

## ライセンス・クレジット

元ソフトウェア（MANDARA_JS）に添付されたライセンス方針に基づき、
本プロジェクトの提供物も継承条件付きで公開します。

- 作品名: `MANDARA_JS`
- 作者名: `谷 謙二`
- 派生コード公開時は元ライセンス条件の継承を遵守

`zlibrev` は imaya 氏のコード（MIT License）を含みます。

## 改良ドキュメント

- [IMPROVEMENTS.md](IMPROVEMENTS.md)
- [TYPESCRIPT_IMPROVEMENT_GUIDELINES.md](TYPESCRIPT_IMPROVEMENT_GUIDELINES.md)
- [TYPE_ORGANIZATION.md](TYPE_ORGANIZATION.md)
- [ESM_IMPLEMENTATION_GUIDE.md](ESM_IMPLEMENTATION_GUIDE.md)

## 免責

本プロジェクト提供ファイルの利用により生じた損害等について、
プロジェクト管理者は責任を負いません。
