# types.ts と globals.d.ts の関係と統合方針

## 📋 現状分析

### globals.d.ts (1,585行)
**役割:**
- **グローバルスコープの型宣言** (`declare` キーワード使用)
- DOM拡張インターフェース (`GlobalEventHandlers`, `EventTarget`等)
- グローバル変数の型定義 (`declare var attrData`, `declare var Generic`等)
- 既存クラスの型定義 (`declare class point`, `declare class rectangle`等)
- アプリケーション固有のインターフェース (`IAttrData`, `IFrmPrint`等)

**特徴:**
- `.d.ts` ファイル = 型定義専用ファイル（実装コードなし）
- `declare` = 「どこか他の場所で実装されている」という宣言
- グローバル名前空間を汚染する（レガシーパターン）

### types.ts (119行)
**役割:**
- **再利用可能な型定義** (exportして使用)
- 汎用的なヘルパー型 (`EventHandler<T>`, `Dictionary<T>`等)
- データ構造の型 (`FileData`, `MapFileInfo`等)

**特徴:**
- `.ts` ファイル = 実装可能なTypeScriptファイル
- `export` = 明示的にインポートして使用
- モジュールスコープ（モダンパターン）

---

## 🎯 統合方針

### 基本原則

```typescript
// globals.d.ts の役割
// ✅ グローバル変数の宣言
// ✅ DOM/Browser APIの拡張
// ✅ レガシーコードとの互換性維持

// types.ts の役割
// ✅ 新しく追加する型定義
// ✅ 再利用可能な汎用型
// ✅ アプリケーションドメインの型
```

### 推奨される使い分け

| 型の種類 | 配置場所 | 理由 |
|---------|---------|------|
| グローバル変数の型 | `globals.d.ts` | `declare var` が必要 |
| DOM拡張 | `globals.d.ts` | グローバルスコープの拡張 |
| 既存クラス(`point`, `rectangle`等) | `globals.d.ts` | 既に使用されている |
| 新しい汎用型 | `types.ts` | export/import で明示的に管理 |
| ビジネスロジックの型 | 専用ファイル | ドメインごとに分離 |

---

## 🔄 具体的な統合アクション

### 1. types.ts の型を globals.d.ts に統合

一部の型は `globals.d.ts` に移動して、グローバルにアクセス可能にする:

```typescript
// globals.d.ts に追加
interface FileData {
  file: File;
  name: string;
  extension: string;
  content?: string | ArrayBuffer;
}

interface MapFileInfo {
  name: string;
  path?: string;
  type: 'mpfj' | 'mdrj' | 'mdrmj' | 'csv';
  data?: unknown;
}
```

### 2. types.ts を汎用ヘルパー型専用に

```typescript
// types.ts - 汎用的なユーティリティ型のみ
export type EventHandler<T = Event> = (event: T) => void;
export type Dictionary<T = unknown> = Record<string, T>;
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
```

### 3. ドメイン別の型定義ファイルを作成

```
src/
  types/           # 新しいディレクトリ
    common.ts      # 汎用型（旧types.tsの内容）
    events.ts      # イベント関連型
    geometry.ts    # 座標・図形関連型
    map.ts         # 地図関連型
    ui.ts          # UI関連型
```

---

## 📦 推奨される最終構造

```
src/
  globals.d.ts          # グローバル宣言のみ（既存維持）
                        # - declare var ...
                        # - DOM拡張
                        # - レガシークラス定義
  
  types/
    index.ts            # 全型定義のエクスポート
    common.ts           # 汎用ヘルパー型
    domain/
      attrData.ts       # 属性データ型
      mapData.ts        # 地図データ型
      geometry.ts       # 幾何学型
      ui.ts             # UI型
```

### 使用例

```typescript
// グローバル型（globals.d.ts）- importなしで使用可能
const p: point = new point(10, 20);
const rect: rectangle = new rectangle(0, 100, 0, 50);

// モジュール型（types/）- 明示的にimport
import { EventHandler, Dictionary } from '@/types/common';
import { MapFileInfo } from '@/types/domain/mapData';

const handler: EventHandler = (e) => { ... };
const data: Dictionary<MapFileInfo> = {};
```

---

## 🚀 段階的移行計画

### Phase 1: 現状維持 + 整理 ✓（完了）
- [x] `types.ts` 作成
- [x] 基本的な汎用型を定義
- [x] `globals.d.ts` はそのまま維持

### Phase 2: 役割の明確化（次のステップ）
1. `types.ts` → `types/common.ts` にリネーム
2. ドメイン別に型定義を分離
3. `globals.d.ts` から export 可能な型を `types/` に移動

### Phase 3: グローバル依存の削減（長期目標）
1. `declare var` の使用を減らす
2. 依存性注入パターンに移行
3. テスト可能性の向上

---

## 💡 今すぐ実施できる改善

### globals.d.ts に型を追加する場合

```typescript
// globals.d.ts の末尾に追加
interface MyNewGlobalType {
  // ...
}
```

### types.ts（または types/）に型を追加する場合

```typescript
// types/common.ts
export interface MyNewModuleType {
  // ...
}

// 使用側
import { MyNewModuleType } from '@/types/common';
```

---

## ✅ 結論

**現在のベストプラクティス:**

1. **globals.d.ts** 
   - 既存の型定義は維持
   - グローバル変数の型宣言
   - DOM拡張
   
2. **types.ts (または types/)**
   - 新しい型定義を追加
   - export/import で明示的に管理
   - テスト可能で保守しやすい

3. **両方を併用**
   - レガシーコード: `globals.d.ts`
   - 新規コード: `types/` モジュール
   - 段階的に移行

**重要:** どちらも有効で、併用可能です。新しいコードでは `types/` を使い、既存コードは `globals.d.ts` を維持することで、段階的に改善できます。
