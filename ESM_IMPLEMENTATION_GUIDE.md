# ESモジュール化 - 実装ガイド

## ✅ 完了した作業

### 1. 基盤の整備

#### AppState クラス (src/core/AppState.ts) ✓
```typescript
import { appState } from '@/core/AppState';

// Before: グローバル変数
attrData.TotalData.LV1.SelectedLayer = 0;

// After: AppState経由
const state = appState();
state.attrData.TotalData.LV1.SelectedLayer = 0;
```

#### 定数のモジュール化 (src/constants/) ✓
```typescript
import { EARTH_R, ZahyoModeInfo } from '@/constants';

// Before: グローバル定数
const distance = EarthR * angle;

// After: インポートした定数
const distance = EARTH_R * angle;
```

### 2. 実装済みの変更

**clsGeneric.ts** ✓
- `EarthR` → `EARTH_R` (constants/geometry.ts からインポート)
- グローバル定数の削除

---

## 🚀 次のステップ

### Phase 1: 主要クラスの確認と整理

#### 1.1 既にモジュール化されているクラス

以下のクラスはすでに export されているため、import で使用できます:

```typescript
// clsGeneric.ts
import { Generic } from './clsGeneric';
Generic.createNewDiv(...);

// clsAttrData.ts (確認が必要)
// import { AttrData } from './clsAttrData';

// clsDraw.ts (確認が必要)
// import { Draw } from './clsDraw';
```

#### 1.2 確認が必要なファイル

```bash
# export の有無を確認
grep -n "^export class" src/*.ts
grep -n "^export function" src/*.ts
```

### Phase 2: main.ts の書き換え

#### 2.1 現在の main.ts (問題のあるコード)

```typescript
// グローバル変数（問題）
let clsSettingData!: Setting_Info;
let attrData!: IAttrData;
let Frm_Print!: IFrmPrint;
// ...
```

#### 2.2 移行後の main.ts

```typescript
import { appState } from './core/AppState';
import { Generic } from './clsGeneric';
import { TKY2JGDInfo } from './clsGeneric';
import { Setting_Info } from './clsTime';
import { clsTileMap } from './適切なファイル';  // 実装場所を確認

function init(): void {
    const state = appState();
    
    // 状態の初期化
    state.settingData = new Setting_Info();
    state.tky2jgd = new TKY2JGDInfo();
    state.tileMapClass = new clsTileMap();
    
    // 以降の処理も state 経由でアクセス
    const testFont = ["Yu Gothic UI", "Meiryo UI", ...];
    for (const font of testFont) {
        if (Generic.checkFontExist(font)) {
            state.settingData.SetFont = font;
            break;
        }
    }
    
    // ... 残りの初期化処理
}
```

### Phase 3: 各ファイルでのimport追加

#### 3.1 手順

1. **ファイルの先頭に必要なimportを追加**

```typescript
// Before (グローバル変数に依存)
function someFunction() {
    const data = attrData.TotalData;  // グローバル
    Generic.createNewDiv(...);         // グローバル
}

// After (明示的なimport)
import { appState } from '@/core/AppState';
import { Generic } from '@/clsGeneric';

function someFunction() {
    const state = appState();
    const data = state.attrData.TotalData;
    Generic.createNewDiv(...);
}
```

2. **関数のシグネチャを変更（推奨）**

```typescript
// より良いアプローチ: 依存性注入
import type { AppState } from '@/core/AppState';

function someFunction(state: AppState) {
    const data = state.attrData.TotalData;
    // ...
}

// 呼び出し側
import { appState } from '@/core/AppState';
someFunction(appState());
```

### Phase 4: globals.d.ts のクリーンアップ

#### 4.1 削除対象の declare var

以下を段階的に削除:

```typescript
// 削除予定
declare var attrData: any;              // → appState().attrData
declare var clsSettingData: any;        // → appState().settingData
declare var Frm_Print: IFrmPrint;       // → appState().frmPrint
declare var propertyWindow: IPropertyWindow; // → appState().propertyWindow
declare var TKY2JGD: any;               // → appState().tky2jgd
declare var tileMapClass: any;          // → appState().tileMapClass
declare var preReadMapFile: any;        // → appState().preReadMapFile
declare var scrMargin: IScrMargin;      // → appState().scrMargin
declare var logWindow: HTMLTextAreaElement; // → appState().logWindow

// 削除予定の定数
declare var EarthR: number;             // → import { EARTH_R }
declare var chrLF: string;              // → import { CHR_LF }
```

#### 4.2 残す宣言

```typescript
// DOM拡張は残す
interface GlobalEventHandlers { ... }
interface EventTarget { ... }

// 型定義は残す（または types/ に移行）
interface IAttrData { ... }
interface IFrmPrint { ... }
declare class point { ... }
declare class rectangle { ... }
```

---

## 📝 実装チェックリスト

### 即座に実施可能

- [x] AppState クラスの作成
- [x] constants/ ディレクトリの作成
- [x] clsGeneric.ts の定数をインポートに変更
- [ ] main.ts を AppState 使用に変更
- [ ] 各クラスで export を確認
- [ ] 最初の1ファイルで動作確認

### 短期目標 (1週間)

- [ ] 主要5ファイルの import/export 確認
- [ ] main.ts の完全書き換え
- [ ] Generic, TKY2JGD など主要クラスの動作確認
- [ ] テスト実行で問題がないことを確認

### 中期目標 (2-3週間)

- [ ] 全ファイルでのimport追加
- [ ] globals.d.ts の declare var 削除開始
- [ ] 定数の完全移行
- [ ] 列挙型の完全移行

### 長期目標 (1ヶ月)

- [ ] globals.d.ts に declare var が0個
- [ ] 全ファイルが import/export ベース
- [ ] 型定義を types/ に整理
- [ ] 完全なESモジュール化達成

---

## 🔧 便利なコマンド

### グローバル変数の使用箇所を検索

```bash
# attrData の使用箇所
grep -rn "\battrData\b" src/*.ts | grep -v "^src/globals.d.ts" | wc -l

# Generic の使用箇所
grep -rn "\bGeneric\." src/*.ts | wc -l

# import文がないファイルを探す
for file in src/*.ts; do
  if ! grep -q "^import" "$file"; then
    echo "$file"
  fi
done
```

### export の確認

```bash
# どのクラスがexportされているか
grep -n "^export class" src/*.ts
grep -n "^export function" src/*.ts
grep -n "^export interface" src/*.ts
```

### 型エラーの確認

```bash
# 特定ファイルの型エラーのみ表示
npm run type-check 2>&1 | grep "src/main.ts"
```

---

## 💡 よくある問題と解決策

### Q1: 循環参照エラー

**問題:**
```
Error: Circular dependency detected
```

**解決策:**
- AppState を介して依存関係を整理
- 型定義だけ別ファイルに分離（type-only import）

```typescript
import type { IAttrData } from './types/interfaces';
```

### Q2: "cannot find module" エラー

**問題:**
```
Error: Cannot find module '@/core/AppState'
```

**解決策:**
- tsconfig.json または vite.config.ts でパスエイリアス設定を確認

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Q3: 実行時エラー「undefined」

**問題:**
```
TypeError: Cannot read property 'attrData' of undefined
```

**解決策:**
- AppState の初期化が完了しているか確認
- 初期化順序の見直し

```typescript
// main.ts
const state = appState();
state.initialize();  // 初期化を忘れずに
```

---

## 🎯 成功の指標

### コード品質

```typescript
// ✅ 良い例: 明示的なimport
import { appState } from '@/core/AppState';
import { Generic } from '@/clsGeneric';
import { EARTH_R } from '@/constants';

// ❌ 悪い例: グローバル変数への依存
function calculate() {
    return EarthR * 2;  // どこから来たのか不明
}
```

### テスト可能性

```typescript
// ✅ 良い例: 依存性注入でテスト可能
function processData(state: AppState) {
    return state.attrData.TotalData;
}

// テスト
const mockState = { attrData: { TotalData: {...} } };
processData(mockState as AppState);
```

---

## 📚 参考資料

- `ESM_MIGRATION_PLAN.md` - 全体計画
- `TYPE_ORGANIZATION.md` - 型定義の整理方針
- `IMPROVEMENTS.md` - これまでの改良内容

---

**次のアクション:** main.ts の書き換えを実施してください！
