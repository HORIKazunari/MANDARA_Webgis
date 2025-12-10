# ESモジュール化移行ステータス

## 完了した作業

### Phase 1: main.ts完全AppState対応 ✅

**実施日**: 2025年1月

**変更概要**:
- グローバル変数12個を完全削除し、AppState経由でアクセスするように変更
- 全9つの関数を`appState()`経由で状態にアクセスするよう書き換え

**具体的な変更**:

#### 削除されたグローバル変数（12個）
```typescript
// 以前の実装（削除済み）
let clsSettingData!: Setting_Info;
let attrData!: IAttrData;
let Frm_Print!: IFrmPrint;
let propertyWindow!: IPropertyWindow;
let divmain!: HTMLDivElement;
let TKY2JGD!: typeof TKY2JGDInfo;
let tileMapClass!: clsTileMap;
let preReadMapFile: MapFileInfo[] = [];
const scrMargin: IScrMargin = { ... };
let logWindow: HTMLTextAreaElement | undefined;
let settingModeWindow!: ISettingModeWindow;
// ※ 最後の2つはコード中で確認
```

#### 新しい実装パターン
```typescript
// AppStateからimport
import { appState } from './core/AppState';

// 各関数内で使用
function init(): void {
    const state = appState();
    state.settingData = new Setting_Info();
    state.tky2jgd = new TKY2JGDInfo();
    // ...
}

function frmPrintProjection(): void {
    const state = appState();
    // state.attrDataなど経由でアクセス
}
```

#### 書き換えられた関数（9個）
1. `init()` - 初期化関数、全グローバル変数をstate経由に変更
2. `logX()` - ログ出力関数、state.logWindow経由に変更
3. `contextMenuPrevent()` - 変更なし（引数のみ使用）
4. `frmPrintProjection()` - 投影法変換、state経由に変更
5. `frmPrintOptionMenu()` - オプションメニュー、変更不要
6. `dataValueShow()` - データ値表示、state経由に変更
7. `backImageButton()` - 背景画像、state経由に変更
8. `settingFront()` - 設定画面前面化、state経由に変更
9. `frmPrintFront()` - 印刷画面前面化、state経由に変更

#### 内部関数も対応
- `init()`内の`FrmprintMenuClick()`関数も`appState()`使用に変更
- `FrmprintMenuClick()`内の`mdvf()`, `pwreverse()`, `mnuDummyObjChange()`も同様

**検証結果**:
- ✅ ビルド成功（`npm run build`）
- ✅ 全テストパス（10 passed）
- ✅ 型エラーなし（main.ts）

**ファイルサイズ**: 219行 → 315行（コメント・構造改善含む）

---

## 次のステップ

### Phase 2: 主要ファイルへの展開
次は以下のファイルでAppState/constantsを導入：

1. **clsWindow.ts** (4,558行)
   - グローバル変数: `attrData`, `clsSettingData`, `Frm_Print`等を使用
   - 優先度: ⭐⭐⭐ 高（main.tsと連携が深い）

2. **clsPrint.ts** (推定2,000-3,000行)
   - グローバル変数: `Frm_Print`, `attrData`等を使用
   - 優先度: ⭐⭐⭐ 高（印刷・描画の中核）

3. **clsAttrData.ts** (9,003行)
   - 最大のファイル、独自にAppStateへの統合を検討
   - 優先度: ⭐⭐ 中（大規模ファイルのため慎重に）

### Phase 3: globals.d.ts クリーンアップ
全ファイルの移行完了後：
- `declare var`宣言50+個を削除
- DOM拡張interfaceのみ残す
- 完全なESモジュール化を達成

---

## 移行のベストプラクティス

1. **1ファイルずつ移行**: 一度に複数ファイルを変更せず、1ファイル完了→テスト→次へ
2. **関数単位で確認**: 各関数が`appState()`を正しく呼んでいるか確認
3. **内部関数も忘れずに**: クロージャ内の関数も`appState()`経由に変更
4. **動作確認を頻繁に**: ビルド→テスト→（可能なら）ブラウザでの動作確認
5. **コミット頻度を上げる**: 各フェーズ完了時点でコミット

---

## 技術的な注意点

### AppStateの使用パターン
```typescript
// ❌ 非推奨: 関数外でappState()を呼ぶ
const state = appState();
function someFunc() {
    state.attrData; // グローバル変数と同じ問題
}

// ✅ 推奨: 関数内で毎回呼ぶ
function someFunc() {
    const state = appState();
    state.attrData; // テスト・デバッグしやすい
}
```

### 段階的な移行
```typescript
// Phase 1: main.ts移行（完了✅）
import { appState } from './core/AppState';

// Phase 2: 他ファイルも同様に
// clsWindow.ts, clsPrint.ts等で同じパターン適用

// Phase 3: globals.d.tsクリーンアップ
// declare var削除、完全ESM化
```

---

## 参考ドキュメント
- `ESM_MIGRATION_PLAN.md` - 全体計画
- `ESM_IMPLEMENTATION_GUIDE.md` - 実装ガイド
- `ESM_QUICKSTART.md` - クイックスタート
- `src/core/AppState.ts` - AppState実装

---

**最終更新**: 2025年1月
**ステータス**: Phase 1完了、Phase 2開始可能
