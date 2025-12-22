# コンストラクタ関数からクラスへの変換計画

作成日: 2025年12月22日

## 目的

TypeScriptプロジェクトにおける古いコンストラクタ関数パターンを、モダンなESクラス構文に変換し、Any型の削減作業を可能にする。

## 優先順位付けされた作業リスト

### Phase 1: 基礎データ構造のクラス化（高優先度）

#### ✅ 完了済み
- `CheckedListBox` → クラス化完了（clsGeneric.ts）
- `ListBox` → クラス化完了（clsGeneric.ts）
- `ListViewTable` → クラス化は残存している可能性あり

#### 🔴 Phase 1A: clsGeneric.ts の基礎構造

対象ファイル: `src/clsGeneric.ts`

1. **TKY2JGDInfo_Impl** (座標変換関連)
   - 行数: 約150-200行
   - 複雑度: 中
   - 依存: なし
   - 作業: コンストラクタ関数 → クラス化

2. **spatial** (空間インデックス)
   - 行数: 約100-150行
   - 複雑度: 中
   - 依存: point, rectangle
   - 作業: クラス化済みか確認、未なら変換

#### 🔴 Phase 1B: clsAttrData.ts の基本データ型

対象ファイル: `src/clsAttrData.ts`

基本的なデータ構造（インターフェース化を推奨）:

1. **point3** - 3次元座標
2. **strDegreeMinuteSeconde** - 度分秒表記
3. **strLatLonDegreeMinuteSecond** - 緯度経度
4. **Cross_Line_Data** - 交差線データ
5. **strURL_Data** - URLデータ

これらは単純なデータ構造なので、**クラスではなくインターフェース**に変換を推奨:

```typescript
// 推奨される変換例
interface Point3 {
    x: number;
    y: number;
    z: number;
}

interface DegreeMinuteSecond {
    degree: number;
    minute: number;
    second: number;
}

interface LatLonDegreeMinuteSecond {
    lat: DegreeMinuteSecond;
    lon: DegreeMinuteSecond;
}
```

### Phase 2: 地図・図形関連のクラス化（中優先度）

#### 🟡 Phase 2A: clsAttrData.ts のオブジェクトデータ

1. **Object_Succession_Data** - オブジェクト継承データ
2. **Object_NameTimeStac_Data** - オブジェクト名・時系列スタック
3. **Object_CenterPoint_Data** - オブジェクト中心点
4. **Hennyu_Data** - 変数データ

これらもメソッドが少なければインターフェース化を検討。

#### 🟡 Phase 2B: clsDraw.ts の描画関連

1. **mark_info** - マーク情報
2. **clsTileMap** - タイルマップ

これらはロジックを持つためクラス化が必要。

#### 🟡 Phase 2C: shapeFile.ts のシェイプファイル処理

`this.メソッド名 = function() {}` パターンが多数存在:
- `this.getMapZahyo`
- `this.fileRead`
- `this.convertToMapfile`
など

これらは既にクラス的に使われているため、正式なクラス構文に変換。

### Phase 3: 時系列・合成データのクラス化（低優先度）

#### 🟢 Phase 3: clsAttrData.ts の複雑なデータ構造

1. **Start_End_Time_data** - 開始終了時刻
2. **LineCodeStac_Data** - ラインコードスタック
3. タイルマップ関連データ
4. 合成データ関連

## 変換手順（標準プロセス）

### ステップ1: 現状確認

```bash
# コンストラクタ関数のパターンを検索
grep -n "^function [A-Z]" src/*.ts
grep -n "this\.[a-zA-Z_]* = function" src/*.ts
```

### ステップ2: 個別ファイルの変換

各コンストラクタ関数について:

1. **データのみ → インターフェース化**
   ```typescript
   // Before
   function Point3() {
       this.x = 0;
       this.y = 0;
       this.z = 0;
   }
   
   // After
   interface Point3 {
       x: number;
       y: number;
       z: number;
   }
   ```

2. **ロジック含む → クラス化**
   ```typescript
   // Before
   function TKY2JGDInfo() {
       this.convert = function(lat, lon) {
           // 変換処理
       }
   }
   
   // After
   export class TKY2JGDInfo {
       convert(lat: number, lon: number): LatLon {
           // 変換処理
       }
   }
   ```

3. **this.method = function パターン → クラスメソッド化**
   ```typescript
   // Before
   function MyClass() {
       this.method1 = function() { ... }
       this.method2 = function() { ... }
   }
   
   // After
   export class MyClass {
       method1(): void { ... }
       method2(): void { ... }
   }
   ```

### ステップ3: 型定義の更新

1. `src/types.ts` に新しい型定義を追加
2. `src/globals.d.ts` から古い宣言を削除
3. インポート文を更新

### ステップ4: 呼び出し側の更新

```typescript
// Before
let obj = new SomeConstructor();

// After（クラス化の場合）
let obj = new SomeClass();

// After（インターフェース化の場合）
let obj: SomeInterface = { x: 0, y: 0, z: 0 };
```

### ステップ5: テスト実行

```bash
npm run build
npm run test
```

## 変換時の注意点

### 1. `this` のスコープ

コンストラクタ関数では `this` がインスタンスを指すが、アロー関数では親のスコープを継承する。

```typescript
// コンストラクタ関数（問題あり）
function MyClass() {
    this.value = 10;
    this.method = function() {
        setTimeout(function() {
            console.log(this.value); // undefined
        }, 1000);
    }
}

// クラス（推奨）
class MyClass {
    value = 10;
    method() {
        setTimeout(() => {
            console.log(this.value); // 10
        }, 1000);
    }
}
```

### 2. プライベートメンバー

```typescript
// コンストラクタ関数でのクロージャ
function MyClass() {
    let privateVar = 10; // 外部からアクセス不可
    this.getPrivate = function() { return privateVar; }
}

// クラスでのプライベートフィールド
class MyClass {
    #privateVar = 10; // ECMAScript Private Fields
    // または
    private privateVar2 = 10; // TypeScriptのprivate
    
    getPrivate() { return this.#privateVar; }
}
```

### 3. プロトタイプメソッド vs インスタンスメソッド

```typescript
// コンストラクタ関数
function MyClass() {
    // インスタンスメソッド（各インスタンスにコピー）
    this.method1 = function() { }
}
// プロトタイプメソッド（共有）
MyClass.prototype.method2 = function() { }

// クラス（自動的にプロトタイプメソッド）
class MyClass {
    method1() { } // プロトタイプメソッド
    method2() { } // プロトタイプメソッド
}
```

## 実装順序の提案

### Week 1: 基礎構造の変換
- [ ] clsGeneric.ts の TKY2JGDInfo_Impl をクラス化
- [ ] clsAttrData.ts の基本データ型をインターフェース化（point3, strDegreeMinuteSeconde等）
- [ ] types.ts に新しい型定義を集約

### Week 2: 地図関連の変換
- [ ] shapeFile.ts のコンストラクタパターンをクラス化
- [ ] clsDraw.ts の描画関連をクラス化
- [ ] clsAttrData.ts のオブジェクトデータ構造を変換

### Week 3: 残りの変換とテスト
- [ ] 時系列データ構造の変換
- [ ] 全ファイルの動作確認
- [ ] ユニットテストの追加

### Week 4: Any型削減の開始
- [ ] strict: true の段階的有効化
- [ ] 各関数の型定義追加
- [ ] ESLintルールの厳格化

## 期待される効果

### 1. 型安全性の向上
- コンストラクタ関数では型推論が困難
- クラス化により、プロパティとメソッドの型が明確に

### 2. コード補完の改善
- IDEによる自動補完が正確に
- メソッドシグネチャの表示

### 3. リファクタリングの容易化
- クラスの継承、インターフェースの実装が可能に
- 責任の明確化

### 4. バンドルサイズの削減
- 未使用のメソッドのTree Shaking が可能に

### 5. テストの記述が容易
- モックの作成が簡単に
- 依存性注入がしやすく

## 関連ドキュメント

- [ANY_TYPE_REDUCTION_STATUS.md](./ANY_TYPE_REDUCTION_STATUS.md) - Any型削減の進捗
- [REFACTORING_PLAN.md](./REFACTORING_PLAN.md) - 全体的なリファクタリング計画
- [TYPE_ORGANIZATION.md](./TYPE_ORGANIZATION.md) - 型定義の整理方針
- [TYPESCRIPT_IMPROVEMENT_GUIDELINES.md](./TYPESCRIPT_IMPROVEMENT_GUIDELINES.md) - TypeScript改善ガイドライン

## 次のステップ

1. このドキュメントをレビュー
2. Phase 1A から作業開始
3. 各Phase完了後、動作確認とテスト実行
4. 問題があれば即座に修正
