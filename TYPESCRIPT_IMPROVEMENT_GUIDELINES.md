# TypeScript改良ガイドライン - 今後の作業指針

## 目次
1. [clsGeneric.tsのany型削減](#clsgenerictsのany型削減)
2. [コンストラクタ関数のクラス化](#コンストラクタ関数のクラス化)
3. [長すぎるクラスと関数の分割](#長すぎるクラスと関数の分割)
4. [strict モード完全有効化への道](#strict-モード完全有効化への道)

---

## clsGeneric.tsのany型削減

### 現状分析
- 約100箇所以上のany型が使用されている
- 主にDOM操作関数とユーティリティ関数で使用

### 優先順位

#### 高優先度（すぐに対応すべき箇所）

1. **createWindow関数の引数**
   ```typescript
   // 現状
   static createWindow(ID: any, Class: any, title: any, ...)
   
   // 改善後
   static createWindow(
     ID: string,
     Class: string,
     title: string,
     x: number,
     y: number,
     width: number,
     height: number,
     visibilieF: boolean,
     menuMarkF: boolean,
     menuCall: (() => void) | null,
     XmarkF: boolean,
     XmarkCall: (() => void) | null,
     footer_Flag: boolean,
     footerID: string,
     maxButtonF: boolean,
     maxButtonCall?: (() => void) | null
   ): HTMLElement
   ```

2. **createMsgTableBox関数**
   ```typescript
   // 現状
   static createMsgTableBox(title: any, data: any, width: any, height: any, borderFlag: any)
   
   // 改善後
   static createMsgTableBox(
     title: string,
     data: string[][],
     width: number,
     height: number,
     borderFlag: boolean
   ): HTMLElement
   ```

3. **createNewRadioButtonList関数**
   ```typescript
   // 現状
   list: {value: any, text: string}[]
   
   // 改善後
   list: Array<{value: string | number, text: string}>
   ```

#### 中優先度（計画的に対応）

1. **タイル関連の型定義**
   ```typescript
   // types.tsに追加
   export interface TileProperty {
     pattern?: string;
     color?: string;
     opacity?: number;
     [key: string]: unknown;
   }
   ```

2. **マーク関連の型定義**
   ```typescript
   export interface MarkProperty {
     type: string;
     size: number;
     color: string;
     rotation?: number;
     [key: string]: unknown;
   }
   ```

3. **座標変換関数の型**
   ```typescript
   // (X as any).px() のようなパターンを型安全に
   export type PixelValue = number;
   export function px(value: number): string {
     return `${value}px`;
   }
   ```

### 実装パターン

#### パターン1: イベントハンドラーの型付け
```typescript
// 悪い例
onClick: ((this: HTMLElement, ev: MouseEvent) => any) | null

// 良い例
onClick: ((this: HTMLElement, ev: MouseEvent) => void) | null
// または
onClick: MouseEventHandler | null

type MouseEventHandler = (this: HTMLElement, ev: MouseEvent) => void;
```

#### パターン2: ジェネリクスの活用
```typescript
// 悪い例
static createNewDiv(ParentObj: HTMLElement, word: any, ID: string, ...): HTMLElement

// 良い例
static createNewDiv<T extends HTMLElement = HTMLDivElement>(
  ParentObj: HTMLElement,
  word: string,
  ID: string,
  ...
): T
```

#### パターン3: ユニオン型の使用
```typescript
// 悪い例
value: any

// 良い例
value: string | number | boolean | null
```

---

## コンストラクタ関数のクラス化

### 対象ファイル
1. `src/zlibrev.ts` - 多数のコンストラクタ関数
2. `src/clsAttrData.ts` - 一部のコンストラクタ関数

### 変換パターン

#### パターン1: 基本的なコンストラクタ関数
```typescript
// 変換前
const strLocationSearchObject = function(layer: number, objnumber: number) {
    this.objLayer = layer;
    this.ObjNumber = objnumber;
}
strLocationSearchObject.prototype.Clone = function() {
    let d = new strLocationSearchObject;
    Object.assign(d, this);
    return d;
}

// 変換後
class strLocationSearchObject {
    objLayer: number;
    ObjNumber: number;
    
    constructor(layer: number, objnumber: number) {
        this.objLayer = layer;
        this.ObjNumber = objnumber;
    }
    
    Clone(): strLocationSearchObject {
        const d = new strLocationSearchObject(this.objLayer, this.ObjNumber);
        return d;
    }
}
```

#### パターン2: プロトタイプメソッドを持つコンストラクタ
```typescript
// 変換前
let FixedObjectNameData_Info = function(this: any) {
    this.Width;
    this.Allignment;
}
FixedObjectNameData_Info.prototype.Clone = function () {
    let d = new FixedObjectNameData_Info();
    Object.assign(d, this);
    return d;
}

// 変換後
class FixedObjectNameData_Info {
    Width: number = 0;
    Allignment: number = 0;
    
    Clone(): FixedObjectNameData_Info {
        const d = new FixedObjectNameData_Info();
        d.Width = this.Width;
        d.Allignment = this.Allignment;
        return d;
    }
}
```

### 変換の手順
1. コンストラクタ関数を特定
2. プロパティに型を付与
3. class構文に変換
4. プロトタイプメソッドをクラスメソッドに変換
5. テストで動作確認

---

## 長すぎるクラスと関数の分割

### 対象ファイルの分析

#### clsWindow.ts (4567行)
**問題点**:
- 1つのファイルに複数の責任が混在
- 設定画面の生成ロジックが長大

**分割案**:
```
src/window/
  ├── WindowMain.ts          # メイン処理
  ├── SettingPanel.ts        # 設定パネル
  ├── ModeControl.ts         # モード切替
  ├── MenuHandlers.ts        # メニューハンドラー
  ├── DataManagement.ts      # データ管理
  └── types.ts               # 型定義
```

#### clsGeneric.ts (4000行以上)
**問題点**:
- ユーティリティ関数が1つのクラスに集中
- DOM操作、座標変換、ファイル操作など多岐にわたる

**分割案**:
```
src/utils/
  ├── DOMUtils.ts            # DOM操作
  ├── CoordinateUtils.ts     # 座標変換
  ├── FileUtils.ts           # ファイル操作
  ├── MathUtils.ts           # 数学関数
  ├── StringUtils.ts         # 文字列操作
  └── ArrayUtils.ts          # 配列操作
```

#### clsAttrData.ts (5000行以上)
**問題点**:
- データモデルと操作ロジックが混在
- 初期化、保存、読み込みなど多機能

**分割案**:
```
src/data/
  ├── AttrData.ts            # メインクラス
  ├── LayerData.ts           # レイヤーデータ
  ├── DataLoader.ts          # データ読み込み
  ├── DataSaver.ts           # データ保存
  ├── DataValidator.ts       # データ検証
  └── types.ts               # 型定義
```

### 分割の原則

#### 1. 単一責任の原則（SRP）
各クラスは1つの責任のみを持つべき

```typescript
// 悪い例：複数の責任
class DataManager {
    loadData() { /* ... */ }
    saveData() { /* ... */ }
    validateData() { /* ... */ }
    renderUI() { /* ... */ }  // UIはここにあるべきでない
}

// 良い例：責任を分離
class DataLoader {
    loadData() { /* ... */ }
}

class DataSaver {
    saveData() { /* ... */ }
}

class DataValidator {
    validateData() { /* ... */ }
}

class DataRenderer {
    renderUI() { /* ... */ }
}
```

#### 2. 関数は短く（15-20行以内を目安）
```typescript
// 悪い例：長すぎる関数
function processData(data: any) {
    // 100行以上のコード...
}

// 良い例：小さな関数に分割
function processData(data: DataType): ProcessedData {
    const validated = validateData(data);
    const transformed = transformData(validated);
    const enriched = enrichData(transformed);
    return enriched;
}

function validateData(data: DataType): ValidatedData {
    // 検証ロジック
}

function transformData(data: ValidatedData): TransformedData {
    // 変換ロジック
}

function enrichData(data: TransformedData): ProcessedData {
    // エンリッチロジック
}
```

#### 3. モジュール化
```typescript
// utils/index.ts - エントリーポイント
export * from './DOMUtils';
export * from './CoordinateUtils';
export * from './FileUtils';

// 使用例
import { createDiv, createButton } from './utils';
```

---

## strict モード完全有効化への道

### 現在の状態
```json
{
  "strict": false,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true,
  "strictBindCallApply": true,
  "noImplicitThis": true
}
```

### 完全有効化のステップ

#### ステップ1: strictPropertyInitialization の有効化準備
**現在の課題**:
- クラスプロパティが初期化されていない箇所が多数

**対応方法**:
```typescript
// 方法1: コンストラクタで初期化
class Example {
    property: string;
    
    constructor() {
        this.property = "initial value";
    }
}

// 方法2: デフォルト値を設定
class Example {
    property: string = "initial value";
}

// 方法3: ! (definite assignment assertion) を使用（最終手段）
class Example {
    property!: string; // 初期化を保証できる場合のみ使用
    
    initialize() {
        this.property = "initialized later";
    }
}
```

#### ステップ2: noImplicitReturns の確認
**すでに有効化済み**  
全ての関数パスでreturnが必要

#### ステップ3: strictモードの段階的有効化
```typescript
// tsconfig.json の更新計画

// フェーズ1（完了）
"noImplicitAny": true,
"strictNullChecks": true,

// フェーズ2（実施中）
"strictFunctionTypes": true,
"noImplicitThis": true,

// フェーズ3（次の目標）
"strictPropertyInitialization": true,
"noUncheckedIndexedAccess": true,  // すでに有効

// フェーズ4（最終目標）
"strict": true
```

### 完全strict化のチェックリスト

- [ ] すべてのクラスプロパティが初期化されている
- [ ] 配列・オブジェクトのインデックスアクセスで undefined チェックを実施
- [ ] オプショナルチェーン（?.）を適切に使用
- [ ] Null合体演算子（??）を適切に使用
- [ ] any型の使用を最小限に（目標: 0件）
- [ ] すべての関数に戻り値の型を明示
- [ ] catch句でunknown型を適切に処理

---

## 実装の進め方

### 1. 小さなPRで進める
- 1ファイルずつ改善
- 1つの機能ずつ実装
- こまめにコミット

### 2. テストを書く
- 変更前にテストを追加
- リファクタリング後もテストが通ることを確認
- カバレッジを少しずつ向上

### 3. レビューを受ける
- 大きな変更は事前に設計レビュー
- コードレビューでフィードバックを得る

### 4. ドキュメントを更新
- 変更に合わせてドキュメントを更新
- JSDocコメントを追加
- 設計判断を記録

---

## 参考資料

### TypeScript公式ドキュメント
- [Strict Mode](https://www.typescriptlang.org/tsconfig#strict)
- [Type Checking JavaScript Files](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html)

### ESLint TypeScript
- [typescript-eslint](https://typescript-eslint.io/)
- [Recommended Rules](https://typescript-eslint.io/linting/configs)

### テスティング
- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/dom-testing-library/intro/)

---

## まとめ

TypeScriptの改良は継続的なプロセスです。以下の原則を守りながら進めましょう：

1. **段階的な改善** - 一度にすべてを変えようとしない
2. **テストファースト** - 変更前にテストを書く
3. **型安全性の追求** - any型を避け、適切な型を使用
4. **可読性の重視** - コードは読まれるために書く
5. **ドキュメント化** - 判断理由を記録する

この指針に沿って、堅牢で保守しやすいコードベースを構築していきましょう。
