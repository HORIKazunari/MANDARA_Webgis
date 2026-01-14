# TypeScript改善計画 2026-01-14

## 現状分析

### TypeScriptコンパイルエラー
- `tsc --noEmit` 実行時に **150以上のエラー** が検出
- 主要なエラータイプ:
  1. 型の不整合 (JsonValue, unknown型の誤用)
  2. クラス間の型の不一致
  3. 関数シグネチャの不整合
  4. プロパティの存在チェック失敗

### ESLintエラー・警告
- **eqeqeq**: 大量の == / != の使用（===、!== を推奨）
- **naming-convention**: 命名規則違反（snake_case、PascalCase混在）
- **explicit-function-return-type**: 関数の戻り値型の明示なし
- **no-unsafe-assignment/call**: 型安全でない操作
- **prefer-nullish-coalescing**: strictNullChecks無効のため警告

### 主要なファイル別エラー数
1. **clsPrint.ts**: 80+ エラー
2. **clsAttrData.ts**: 30+ エラー
3. **clsGeneric.ts**: 15+ エラー
4. **MeshContour.ts**: ESLintエラー多数

## 改善戦略

### フェーズ1: 基本的なコード品質向上（優先度：高）

#### 1.1 ESLint eqeqeq エラーの修正
**目標**: 全ての == を === に、!= を !== に置換

**作業内容**:
- 自動置換ツールの使用（regex検索と置換）
- null/undefined比較は慎重に対応
- テスト実行で動作確認

**対象ファイル**:
- MeshContour.ts
- clsAttrData.ts
- clsGeneric.ts
- その他全ファイル

**予想作業時間**: 2-3時間

#### 1.2 明示的な関数戻り値型の追加
**目標**: 全ての関数に戻り値型を明示

**作業内容**:
- TypeScriptの型推論を活用しながら型を明示
- void, number, boolean, string など基本型から開始
- 複雑な型は段階的に定義

**予想作業時間**: 4-6時間

### フェーズ2: 型定義の整理と修正（優先度：高）

#### 2.1 globals.d.ts の型定義整理
**問題点**:
- JsonValue型の使用方法が不適切
- unknown型の多用
- 型の階層構造が不明確

**改善策**:
```typescript
// 現在の問題例
type JsonValue = string | number | boolean | null | JsonArray | JsonObject;

// 具体的な型を定義する
interface MdrjData {
  version: string;
  dataType: 'mdrj' | 'mdrmj' | 'mpfj';
  content: Record<string, DataValue>;
}

interface DataValue {
  type: 'string' | 'number' | 'array' | 'object';
  value: string | number | DataValue[] | Record<string, DataValue>;
}
```

#### 2.2 型のエイリアスと厳密化
- `point`, `rectangle`, `size` などの基本型を明確に
- `Zahyo_info` と `zahyohenkan` の関係性を整理
- `Screen_info` の必須プロパティを明確化

**予想作業時間**: 6-8時間

### フェーズ3: クラス固有の型エラー修正（優先度：高）

#### 3.1 clsPrint.ts の修正
**主要な問題**:
- `Legend2_Atri` 型の不整合（80+ エラー）
- `IOverLayDataItem` と配列型の不一致
- `Screen_info` の必須プロパティ不足
- `PolydataInfo` の optional プロパティ

**修正方針**:
1. `Legend2_Atri` インターフェースを見直し、実際の使用に合わせる
2. 配列型とオブジェクト型を明確に区別
3. `Screen_info` の継承関係を整理
4. Type Guardを導入して型安全性を向上

**予想作業時間**: 10-12時間

#### 3.2 clsAttrData.ts の修正
**主要な問題**:
- JsonValue からの型変換エラー
- colorRGBA 型の不整合
- インデックスアクセスの型エラー

**修正方針**:
1. JSON パース時の型ガードを追加
2. colorRGBA 型の定義を明確化
3. Record型の使用を見直し

**予想作業時間**: 8-10時間

#### 3.3 clsGeneric.ts の修正
**主要な問題**:
- `Zahyo_info` と `zahyohenkan` のプロパティ不一致

**修正方針**:
```typescript
// Modeプロパティを必須にするか、デフォルト値を提供
interface Zahyo_info {
  Mode: number;  // 必須にする
  // または
  Mode?: number; // optional のまま
}

function convertZahyo(info: Zahyo_info): result {
  const mode = info.Mode ?? defaultMode; // デフォルト値を使用
  // ...
}
```

**予想作業時間**: 4-6時間

### フェーズ4: TypeScript厳密モードの段階的有効化（優先度：中）

#### 4.1 strictNullChecks の有効化準備
**現状**: `strictNullChecks: false`

**手順**:
1. null/undefined チェックが必要な箇所を特定
2. Optional Chaining (?.) と Nullish Coalescing (??) を使用
3. 段階的に有効化（ファイル単位で）

**予想作業時間**: 15-20時間

#### 4.2 noImplicitAny の有効化
**現状**: `noImplicitAny: false`

**手順**:
1. any型が暗黙的に使われている箇所を特定
2. 適切な型を定義
3. 段階的に有効化

**予想作業時間**: 10-15時間

### フェーズ5: テスト体制の強化（優先度：中）

#### 5.1 単体テストの充実
**目標**: 主要な関数とクラスメソッドのテストカバレッジ60%以上

**対象**:
- ユーティリティ関数
- データ変換関数
- 座標変換関数
- 検索・ソート機能

**テストフレームワーク**: Vitest (既に設定済み)

**予想作業時間**: 20-25時間

#### 5.2 UIコンポーネントテスト
**目標**: 主要なUIインタラクションのテスト

**使用ツール**: 
- @testing-library/dom (既にインストール済み)
- @testing-library/user-event (既にインストール済み)

**対象**:
- ボタンクリック
- フォーム入力
- モーダルダイアログ
- 地図操作

**予想作業時間**: 15-20時間

#### 5.3 E2Eテストの拡充
**目標**: 主要なユーザーフローのテスト

**使用ツール**: Playwright (既に設定済み)

**テストシナリオ**:
1. 地図データの読み込み
2. レイヤーの追加・削除
3. データの可視化
4. 印刷機能
5. エクスポート機能

**予想作業時間**: 15-20時間

### フェーズ6: コード構造の改善（優先度：低）

#### 6.1 長大なクラスの分割
**対象クラス**:
- clsAttrData (7000+ 行)
- clsPrint (3500+ 行)
- clsMapdata (推定3000+ 行)

**分割方針**:
- Single Responsibility Principle に従う
- 関連する機能をサブクラスに分離
- Composition over Inheritance

**予想作業時間**: 30-40時間

#### 6.2 長大な関数の分割
**基準**: 100行以上の関数

**手法**:
- Extract Method リファクタリング
- 複雑な条件分岐を Guard Clause に
- 繰り返しパターンをヘルパー関数に

**予想作業時間**: 20-25時間

## 実施スケジュール

### 第1週（優先）
- [ ] ESLint eqeqeq エラー修正（全ファイル）
- [ ] globals.d.ts の型定義整理
- [ ] clsGeneric.ts の Zahyo_info エラー修正

### 第2週
- [ ] clsPrint.ts の型エラー修正（50%）
- [ ] clsAttrData.ts の型エラー修正（50%）
- [ ] 関数戻り値型の明示（主要ファイル）

### 第3週
- [ ] clsPrint.ts の型エラー修正（残り）
- [ ] clsAttrData.ts の型エラー修正（残り）
- [ ] 単体テスト追加開始

### 第4週以降
- [ ] strictNullChecks 有効化準備
- [ ] UIコンポーネントテスト追加
- [ ] E2Eテスト拡充
- [ ] コード構造改善（継続的）

## 成功指標

### 短期目標（1ヶ月）
- ✅ `tsc --noEmit` のエラー数: 150+ → 50以下
- ✅ ESLint エラー: 削減80%以上
- ✅ ESLint 警告: 削減50%以上

### 中期目標（3ヶ月）
- ✅ `tsc --noEmit` のエラー数: 0
- ✅ strictNullChecks 有効化
- ✅ テストカバレッジ: 60%以上

### 長期目標（6ヶ月）
- ✅ TypeScript strict モード完全有効化
- ✅ テストカバレッジ: 80%以上
- ✅ 主要クラスのリファクタリング完了

## リスク管理

### 既知のリスク
1. **型エラー修正による新たなバグ**: 修正の度にテスト実行
2. **既存機能の破壊**: Git で小まめにコミット、ブランチ戦略の活用
3. **作業時間の超過**: 優先順位を明確に、段階的な実施

### 対策
- 各フェーズ後に動作確認
- 自動テストの充実
- コードレビュー体制の確立
- 継続的インテグレーション（CI）の活用

## 注意事項

### any型とunknown型の使用禁止
- **原則**: any型、unknown型は使用しない
- **例外**: 外部ライブラリの型定義が不完全な場合のみ、一時的に許可
- **代替案**: 具体的な Union 型、Type Guard の使用

### 安全な修正の進め方
1. 1つの問題に集中
2. 修正後、必ずビルドとテストを実行
3. エラーが増えた場合は即座にロールバック
4. 小さな単位でコミット

## 次のアクション
1. ✅ 改善計画書の作成（完了）
2. ⏭️ ESLint eqeqeq エラーの修正開始（MeshContour.tsから）
3. ⏭️ globals.d.ts の型定義見直し
