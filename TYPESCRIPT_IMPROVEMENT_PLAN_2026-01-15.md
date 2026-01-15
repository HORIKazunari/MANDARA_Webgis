# TypeScript改善計画 2026-01-15

## 現状分析

### 1. tsconfig.json設定状況

#### 有効化済み（厳密チェックON）
- ✅ `noImplicitAny: true` - 暗黙的なany型を禁止
- ✅ `strictNullChecks: true` - null/undefinedの厳密なチェック
- ✅ `noImplicitThis: true` - thisの暗黙的なany型を禁止
- ✅ `strictPropertyInitialization: true` - クラスプロパティの初期化チェック
- ✅ `noUnusedLocals: true` - 未使用のローカル変数を検出
- ✅ `noUnusedParameters: true` - 未使用のパラメータを検出
- ✅ `noImplicitReturns: true` - 関数の全パスでreturnを強制
- ✅ `strictFunctionTypes: true` - 関数型の厳密なチェック
- ✅ `strictBindCallApply: true` - bind/call/applyの厳密なチェック

#### まだ無効化されている設定
- ❌ `strict: false` - 総合的な厳密モード（段階的に有効化予定）
- ❌ `noUncheckedIndexedAccess: false` - 配列やオブジェクトのインデックスアクセスチェック

### 2. any型使用状況

#### 検出箇所：92箇所

主な使用箇所：
1. **globals.d.ts** - 約70箇所
   - レガシーコンストラクタ宣言（`new(...args: any[]): any`パターン）
   - インデックスシグネチャ（`[key: string]: any`パターン）
   
2. **core/AppState.ts** - 1箇所
   - `mnuPropertyWindow?: any` （プロパティウィンドウメニュー）

3. **clsAttrData.ts** - 約20箇所
   - インターフェースのインデックスシグネチャ
   - `Lpat: any[]`配列
   - `Draw_Sample_Mark_Box`, `Draw_Mark`メソッドのパラメータ

### 3. unknown型使用状況

#### 検出箇所：1箇所のみ
- `core/AppState.ts` の `log(data: unknown)` メソッド（適切な使用）

### 4. コードベースの構造

#### 主要ファイル
- **clsAttrData.ts** - 属性データ管理の中核クラス
- **clsWindow.ts** - ウィンドウ管理（4,558行）
- **clsDraw.ts** - 描画処理
- **clsPrint.ts** - 印刷処理
- **main.ts** - エントリーポイント（AppState対応済み）
- **core/AppState.ts** - 状態管理（ESモジュール対応済み）

#### テスト設定
- **vitest** - 単体テスト
- **playwright** - E2Eテスト
- **@testing-library** - UIコンポーネントテスト

---

## 改善計画

### フェーズ1: ESLint設定とコード品質向上（即座に実行可能）

#### 1.1 ESLint警告の確認と修正
**優先度:** ⭐⭐⭐ 高

**タスク:**
1. ESLintで`@typescript-eslint/no-explicit-any`をerrorに昇格
2. 現在のwarningをすべて洗い出し
3. 段階的に修正

**期待される効果:**
- any型の新規追加を防止
- コード品質の可視化

#### 1.2 未使用変数・パラメータの削除
**優先度:** ⭐⭐ 中

**タスク:**
1. `noUnusedLocals: true`で検出される未使用変数を削除
2. `noUnusedParameters: true`で検出される未使用パラメータを`_`プレフィックスに変更

**修正方法:**
```typescript
// Before
function example(unusedParam: string, usedParam: number) {
    return usedParam * 2;
}

// After
function example(_unusedParam: string, usedParam: number) {
    return usedParam * 2;
}
```

---

### フェーズ2: any型の段階的削減

#### 2.1 core/AppState.tsのany型削除
**優先度:** ⭐⭐⭐ 高
**作業量:** 1時間

**対象:**
- `mnuPropertyWindow?: any` → 適切な型定義を作成

**アプローチ:**
```typescript
// Before
public mnuPropertyWindow?: any;

// After
export interface IMenuPropertyWindow {
    show(): void;
    hide(): void;
    update(data: unknown): void;
    // 実際の使用箇所から型を推論
}

public mnuPropertyWindow?: IMenuPropertyWindow;
```

#### 2.2 clsAttrData.tsのany型削減
**優先度:** ⭐⭐⭐ 高
**作業量:** 4-6時間

**対象箇所:**
1. `Lpat: any[]` → 適切な型配列に変更
2. `Draw_Sample_Mark_Box(picBox: HTMLElement, Mark: any)` → Mark型を定義
3. `Draw_Mark(..., Mark: any)` → Mark型を使用
4. インデックスシグネチャの型定義改善

**アプローチ:**
```typescript
// Before
interface SomeInterface {
    [key: string]: any;
}

// After
interface SomeInterface {
    [key: string]: string | number | boolean | null | undefined;
    // または、具体的なプロパティを列挙
    specificProp1: string;
    specificProp2: number;
}
```

#### 2.3 globals.d.tsのany型削減
**優先度:** ⭐⭐ 中（段階的に実施）
**作業量:** 10-15時間

**戦略:**
1. **フェーズ2.3.1:** レガシーコンストラクタ宣言の型定義改善
   - `new(...args: any[]): any` パターンを具体的な型に置き換え
   - 使用箇所を調査して正確な型を推論

2. **フェーズ2.3.2:** インデックスシグネチャの具体化
   - `[key: string]: any` を実際のプロパティ型に基づいて定義
   - ユニオン型を使用して許容される型を制限

**例:**
```typescript
// Before
declare const strScaleAttri: { new(): any; [key: string]: JsonValue };

// After
declare const strScaleAttri: {
    new(): StrScaleAttri;
    [key: string]: JsonValue;
};

interface StrScaleAttri {
    scale: number;
    unit: string;
    // 実際のプロパティを定義
}
```

---

### フェーズ3: tsc --noEmit エラーの修正

#### 3.1 strictNullChecksエラーの修正
**優先度:** ⭐⭐⭐ 高
**作業量:** 8-12時間

**一般的なエラーパターン:**
1. `undefined`の可能性があるプロパティアクセス
2. `null`チェックの欠如
3. オプショナルプロパティの不適切な使用

**修正方法:**
```typescript
// Before
const value = obj.property.subProperty; // Error: obj.property may be undefined

// After (Option 1: Optional Chaining)
const value = obj.property?.subProperty;

// After (Option 2: Null Guard)
if (obj.property) {
    const value = obj.property.subProperty;
}

// After (Option 3: Non-null Assertion - 確実な場合のみ)
const value = obj.property!.subProperty;
```

#### 3.2 strictPropertyInitializationエラーの修正
**優先度:** ⭐⭐ 中
**作業量:** 4-6時間

**修正アプローチ:**
```typescript
// Before
class MyClass {
    property: string; // Error: Property 'property' has no initializer
}

// After (Option 1: 初期値を設定)
class MyClass {
    property: string = "";
}

// After (Option 2: コンストラクタで初期化)
class MyClass {
    property: string;
    constructor(value: string) {
        this.property = value;
    }
}

// After (Option 3: Definite Assignment Assertion - 確実に初期化される場合)
class MyClass {
    property!: string; // 注意: 初期化を保証する責任が開発者にある
}
```

#### 3.3 noImplicitReturnsエラーの修正
**優先度:** ⭐ 低
**作業量:** 2-3時間

**修正方法:**
```typescript
// Before
function getValue(flag: boolean): string {
    if (flag) {
        return "yes";
    }
    // Error: Not all code paths return a value
}

// After
function getValue(flag: boolean): string {
    if (flag) {
        return "yes";
    }
    return "no"; // または適切なデフォルト値
}
```

---

### フェーズ4: クラス構造の明確化

#### 4.1 長すぎるクラスの分割
**優先度:** ⭐⭐ 中
**作業量:** 15-20時間

**対象クラス:**
1. **clsWindow.ts** (4,558行) → 複数のクラスに分割
   - WindowManager（ウィンドウ管理）
   - WindowRenderer（描画処理）
   - WindowEventHandler（イベント処理）

2. **clsAttrData.ts** (大規模) → 責務ごとに分割
   - AttrDataManager（データ管理）
   - AttrDataValidator（データ検証）
   - AttrDataCalculator（データ計算）

**アプローチ:**
- 単一責任の原則（SRP）に従って分割
- インターフェースで依存関係を定義
- 段階的にリファクタリング

#### 4.2 長い関数の分割
**優先度:** ⭐⭐ 中
**作業量:** 8-12時間

**基準:**
- 100行を超える関数
- 複数の責務を持つ関数
- ネストが深い関数（3階層以上）

**アプローチ:**
```typescript
// Before: 長い関数
function processData(data: Data[]): Result {
    // 100行以上の処理
    // ...
}

// After: 小さな関数に分割
function processData(data: Data[]): Result {
    const validated = validateData(data);
    const transformed = transformData(validated);
    return calculateResult(transformed);
}

function validateData(data: Data[]): ValidData[] { /* ... */ }
function transformData(data: ValidData[]): TransformedData[] { /* ... */ }
function calculateResult(data: TransformedData[]): Result { /* ... */ }
```

---

### フェーズ5: テスト設定の充実

#### 5.1 単体テストの整備
**優先度:** ⭐⭐⭐ 高
**作業量:** 12-16時間

**テスト対象（優先順）:**
1. **ユーティリティ関数** (clsGeneric.ts)
   - 座標変換関数
   - 文字列処理関数
   - 数学関数

2. **データ計算ロジック** (clsAttrData.ts)
   - 統計計算
   - データ変換

3. **状態管理** (core/AppState.ts)
   - シングルトンパターンの動作
   - 状態の読み書き

**テストファイル構造:**
```
tests/
  unit/
    clsGeneric.test.ts
    clsAttrData.test.ts
    AppState.test.ts
  integration/
    dataFlow.test.ts
  e2e/
    userWorkflow.spec.ts
```

**例:**
```typescript
// tests/unit/clsGeneric.test.ts
import { describe, it, expect } from 'vitest';
import { Generic } from '@/clsGeneric';

describe('Generic.latLonDistance', () => {
    it('should calculate distance between two points', () => {
        const point1 = { lat: 35.6762, lon: 139.6503 }; // Tokyo
        const point2 = { lat: 34.6937, lon: 135.5023 }; // Osaka
        const distance = Generic.latLonDistance(point1, point2);
        expect(distance).toBeCloseTo(400, -2); // 約400km
    });
});
```

#### 5.2 UIコンポーネントテストの整備
**優先度:** ⭐⭐ 中
**作業量:** 8-12時間

**対象コンポーネント:**
1. ウィンドウコンポーネント（clsWindow.ts）
2. サブウィンドウ（clsSubWindows.ts）
3. プロパティウィンドウ

**アプローチ:**
```typescript
// tests/ui/window.test.ts
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/dom';
import { clsWindow } from '@/clsWindow';

describe('clsWindow', () => {
    it('should render window with title', () => {
        const window = new clsWindow();
        window.setTitle('Test Window');
        
        const element = window.getElement();
        document.body.appendChild(element);
        
        expect(screen.getByText('Test Window')).toBeInTheDocument();
    });
});
```

#### 5.3 Playwrightによるe2eテスト
**優先度:** ⭐⭐ 中
**作業量:** 10-15時間

**テストシナリオ:**
1. **基本操作フロー**
   - アプリケーション起動
   - 地図ファイル読み込み
   - 表示モード切り替え
   - データ編集

2. **複雑な操作フロー**
   - レイヤー操作
   - 印刷プレビュー
   - データエクスポート

**例:**
```typescript
// tests/e2e/basic-workflow.spec.ts
import { test, expect } from '@playwright/test';

test('load map file and display', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // ファイル選択
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('data/japan_data.mdrj');
    
    // 地図が表示されることを確認
    await expect(page.locator('canvas')).toBeVisible();
    
    // レイヤーが読み込まれることを確認
    await expect(page.locator('.layer-list')).toContainText('Layer 1');
});
```

---

## 実行スケジュール

### Week 1-2: 基盤整備
- [x] tsconfig.json設定の厳格化（完了）
- [ ] ESLint設定の調整
- [ ] any型使用箇所の完全な洗い出し
- [ ] 修正計画の詳細化

### Week 3-4: any型削減（Phase 1）
- [ ] core/AppState.ts
- [ ] clsAttrData.ts（部分的）
- [ ] ESLintエラー/警告の修正

### Week 5-8: any型削減（Phase 2）
- [ ] clsAttrData.ts（残り）
- [ ] globals.d.ts（段階的）
- [ ] その他の主要ファイル

### Week 9-10: tscエラー修正
- [ ] strictNullChecksエラー
- [ ] strictPropertyInitializationエラー
- [ ] noImplicitReturnsエラー

### Week 11-14: リファクタリング
- [ ] clsWindow.tsの分割
- [ ] clsAttrData.tsの分割
- [ ] 長い関数の分割

### Week 15-18: テスト整備
- [ ] 単体テスト作成
- [ ] UIコンポーネントテスト
- [ ] e2eテスト

---

## 成功基準

### 短期目標（1-2ヶ月）
1. ✅ tsconfig.jsonの厳格化完了
2. ⬜ ESLint警告ゼロ
3. ⬜ core/AppState.tsとclsAttrData.tsのany型削減完了
4. ⬜ tsc --noEmit エラーゼロ

### 中期目標（3-4ヶ月）
1. ⬜ any型使用箇所を20箇所以下に削減（80%削減）
2. ⬜ 主要クラスの単体テストカバレッジ50%以上
3. ⬜ 長いクラス（2000行以上）の分割完了

### 長期目標（5-6ヶ月）
1. ⬜ any型使用箇所を5箇所以下に削減（95%削減）
2. ⬜ テストカバレッジ70%以上
3. ⬜ e2eテストによる主要フローのカバレッジ完了
4. ⬜ `strict: true`の有効化

---

## リスク管理

### リスク1: 大規模な型変更による既存機能の破壊
**対策:**
- 段階的な変更
- 各変更後に手動テスト実施
- テストケースの先行作成

### リスク2: globals.d.tsのリファクタリングの複雑さ
**対策:**
- 使用頻度の低い型から着手
- インクリメンタルな修正
- 各変更のコミットを小さく保つ

### リスク3: テスト作成の時間不足
**対策:**
- 優先度の高いモジュールから着手
- クリティカルパスを重点的にカバー
- ペアプログラミングやレビューで効率化

---

## 次のアクション

### 即座に実行可能なタスク
1. **ESLint実行とwarning確認**
   ```bash
   npm run lint > eslint-report.txt 2>&1
   ```

2. **tsc実行とエラー確認**
   ```bash
   npm run type-check > tsc-report.txt 2>&1
   ```

3. **any型使用箇所の詳細分析**
   - 各any型の使用理由を調査
   - 型定義可能なものと困難なものに分類

4. **core/AppState.tsの修正開始**
   - `mnuPropertyWindow`の型定義作成
   - 実際の使用箇所を調査

---

## 付録: 有用なコマンド

```bash
# 型チェック
npm run type-check

# ESLint実行
npm run lint

# ESLint自動修正
npm run lint:fix

# テスト実行
npm run test

# テストカバレッジ
npm run test:coverage

# e2eテスト
npm run test:e2e

# any型検索
grep -rn ": any" src/ --include="*.ts"

# unknown型検索
grep -rn ": unknown" src/ --include="*.ts"
```

---

## 参考資料

- [TypeScript Handbook - Strict Mode](https://www.typescriptlang.org/docs/handbook/2/basic-types.html#strictness)
- [ESLint TypeScript Rules](https://typescript-eslint.io/rules/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
