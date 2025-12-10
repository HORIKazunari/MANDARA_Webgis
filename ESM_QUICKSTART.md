# 完全ESモジュール化 - クイックスタート

## 🎯 目標

**`globals.d.ts` のグローバル変数宣言（`declare var`）を完全に排除し、すべてのコードを `import/export` ベースのモジュールシステムに移行する**

---

## ✅ 完了した作業（2025年12月10日）

### 1. 基盤整備

#### ✓ AppState クラス作成 (`src/core/AppState.ts`)
- グローバル変数を一元管理するシングルトンクラス
- `appState()` 関数で簡単にアクセス可能

#### ✓ 定数のモジュール化 (`src/constants/`)
- `geometry.ts` - 幾何学定数（EARTH_R, CHR_LF等）
- `enums.ts` - 列挙型定数
- `index.ts` - 統一エクスポート

#### ✓ 実装例の作成
- `clsGeneric.ts` で `EarthR` → `EARTH_R` に変更
- constants からの import 実装

---

## 📦 新しいディレクトリ構造

```
src/
  core/
    AppState.ts          ✅ NEW - アプリケーション状態管理
  
  constants/
    index.ts             ✅ NEW - 定数の統一エクスポート
    geometry.ts          ✅ NEW - 幾何学定数
    enums.ts             ✅ NEW - 列挙型
  
  types/
    (既存のtypes.ts)
  
  globals.d.ts           🔄 段階的にクリーンアップ予定
```

---

## 🚀 使い方

### パターン1: AppState 経由での状態アクセス

```typescript
// Before: グローバル変数（悪い例）
attrData.TotalData.LV1.SelectedLayer = 0;
Frm_Print.picMap.width = 100;

// After: AppState経由（良い例）
import { appState } from '@/core/AppState';

const state = appState();
state.attrData.TotalData.LV1.SelectedLayer = 0;
state.frmPrint.picMap.width = 100;
```

### パターン2: 定数のインポート

```typescript
// Before: グローバル定数（悪い例）
const distance = EarthR * angle;

// After: インポート（良い例）
import { EARTH_R } from '@/constants';

const distance = EARTH_R * angle;
```

### パターン3: ユーティリティクラスのインポート

```typescript
// Before: グローバル（暗黙的な依存）
Generic.createNewDiv(...);

// After: 明示的なインポート
import { Generic } from '@/clsGeneric';

Generic.createNewDiv(...);
```

---

## 📋 次のステップ（優先度順）

### 🔥 Priority 1: main.ts の書き換え（次に実施）

**現在の問題:**
```typescript
// main.ts - グローバル変数として定義（問題）
let clsSettingData!: Setting_Info;
let attrData!: IAttrData;
let Frm_Print!: IFrmPrint;
```

**移行先:**
```typescript
// main.ts - AppState使用に変更
import { appState } from './core/AppState';
import { Setting_Info } from './clsTime';
import { TKY2JGDInfo } from './clsGeneric';

function init(): void {
    const state = appState();
    state.settingData = new Setting_Info();
    state.tky2jgd = new TKY2JGDInfo();
    // ... 以降すべて state 経由
}
```

### 🔸 Priority 2: 各ファイルへのimport追加

すべての `.ts` ファイルで:
1. 必要なimport文を追加
2. グローバル変数参照を `appState()` 経由に変更
3. 定数を constants からimport

### 🔹 Priority 3: globals.d.ts のクリーンアップ

段階的に `declare var` を削除:

```typescript
// 削除対象（50個以上）
declare var attrData: any;
declare var Generic: any;
declare var clsSettingData: any;
// ... etc

// 残すもの（DOM拡張のみ）
interface GlobalEventHandlers { ... }
interface EventTarget { ... }
```

---

## 📚 詳細ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| `ESM_MIGRATION_PLAN.md` | 📖 **全体計画** - Phase 1〜6の詳細戦略 |
| `ESM_IMPLEMENTATION_GUIDE.md` | 🔧 **実装ガイド** - 具体的な書き換え方法 |
| `TYPE_ORGANIZATION.md` | 📝 型定義の整理方針 |
| `IMPROVEMENTS.md` | ✅ これまでの改良履歴 |

---

## ⚡ クイックリファレンス

### 移行パターン早見表

| Before (グローバル) | After (ESモジュール) |
|-------------------|-------------------|
| `attrData.xxx` | `appState().attrData.xxx` |
| `clsSettingData.xxx` | `appState().settingData.xxx` |
| `Frm_Print.xxx` | `appState().frmPrint.xxx` |
| `Generic.method()` | `import { Generic } from '@/clsGeneric'`<br>`Generic.method()` |
| `EarthR` | `import { EARTH_R } from '@/constants'`<br>`EARTH_R` |
| `chrLF` | `import { CHR_LF } from '@/constants'`<br>`CHR_LF` |

---

## 🎯 成功の指標

### 最終目標

- ✅ `globals.d.ts` の `declare var` = **0個**
- ✅ グローバル変数 (main.ts) = **0個**
- ✅ すべてのファイルで `import/export`
- ✅ テストがすべてパス
- ✅ 型エラーなし

### 現在の進捗

- ✅ AppState クラス作成済み
- ✅ constants ディレクトリ作成済み
- ✅ 1ファイル（clsGeneric.ts）で実装例完成
- ⏳ main.ts の書き換え（次のステップ）
- ⏳ 他ファイルへの展開
- ⏳ globals.d.ts のクリーンアップ

---

## 💡 すぐに試せる例

### テストプロジェクトでの動作確認

```bash
# 型チェック
npm run type-check

# テスト実行
npm test

# 開発サーバー起動
npm run dev
```

### 簡単な移行テスト

新しいファイルを作成して試してみる:

```typescript
// src/example.ts
import { appState } from './core/AppState';
import { EARTH_R } from './constants';
import { Generic } from './clsGeneric';

export function exampleFunction(): void {
    // AppState 経由でアクセス
    const state = appState();
    console.log(state.scrMargin.top);
    
    // 定数の使用
    const radius = EARTH_R;
    
    // ユーティリティの使用
    Generic.createNewDiv(document.body, '', '', 0, 0, 100, 100, '');
}
```

---

## 🤝 協力者へのガイダンス

### 新しいコードを書く時

1. **絶対にグローバル変数を作らない**
2. **すべての依存関係を import で明示**
3. **状態は AppState 経由でアクセス**

### 既存コードを修正する時

1. **ファイルの先頭に必要な import を追加**
2. **グローバル変数参照を appState() に置き換え**
3. **定数は constants からインポート**

---

**🎉 完全ESモジュール化への道は始まりました！**

次のステップ: `main.ts` の書き換えを実施してください。
詳細は `ESM_IMPLEMENTATION_GUIDE.md` を参照。
