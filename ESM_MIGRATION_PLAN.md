# 完全ESモジュール化計画 - globals.d.ts 撲滅作戦

## 🎯 目標

**グローバル変数への依存を完全に排除し、すべてのTypeScriptファイルでimport/exportによるモジュールシステムを実現する**

## 📊 現状分析

### 問題点

1. **globals.d.ts に50以上の `declare var` が存在**
   - `attrData`, `Generic`, `clsSettingData`, `TKY2JGD` など
   - グローバル名前空間の汚染
   - テストが困難（モックが作れない）
   - 依存関係が不明確

2. **main.ts でもグローバル変数を定義**
   ```typescript
   let clsSettingData!: Setting_Info;  // グローバル変数
   let attrData!: IAttrData;
   let Frm_Print!: IFrmPrint;
   ```

3. **循環参照のリスク**
   - グローバル変数を通じた暗黙的な依存関係
   - 初期化順序の問題

### 影響範囲

```
globals.d.ts (1,649行)
├── declare var 系: 50+
├── declare class 系: 10+
└── interface/type 系: 100+

main.ts
├── グローバル変数定義: 12個
└── 初期化関数: init()
```

---

## 🗺️ 移行戦略

### Phase 1: アプリケーション状態管理の集約 ✨

**目標:** グローバル変数を単一の状態管理オブジェクトに集約

#### 1.1 AppState クラスの作成

```typescript
// src/core/AppState.ts
export class AppState {
    // シングルトンパターン
    private static instance: AppState;
    
    // 状態プロパティ
    public attrData!: IAttrData;
    public settingData!: Setting_Info;
    public frmPrint!: IFrmPrint;
    public propertyWindow!: IPropertyWindow;
    public divMain!: HTMLDivElement;
    public tky2jgd!: TKY2JGDInfo;
    public tileMapClass!: clsTileMap;
    public preReadMapFile: MapFileInfo[] = [];
    public scrMargin: IScrMargin;
    public logWindow?: HTMLTextAreaElement;
    
    private constructor() {
        this.scrMargin = {
            top: 30,
            bottom: 23,
            side: 0,
            scrollWidth: 0
        };
    }
    
    public static getInstance(): AppState {
        if (!AppState.instance) {
            AppState.instance = new AppState();
        }
        return AppState.instance;
    }
    
    // 初期化メソッド
    public initialize(): void {
        this.settingData = new Setting_Info();
        this.tky2jgd = new TKY2JGDInfo();
        this.tileMapClass = new clsTileMap();
    }
    
    // テスト用リセット
    public reset(): void {
        AppState.instance = new AppState();
    }
}

// エクスポート用のショートカット
export const appState = AppState.getInstance;
```

#### 1.2 使用例

```typescript
// Before (グローバル変数)
attrData.TotalData.LV1.SelectedLayer = 0;

// After (AppState経由)
import { appState } from '@/core/AppState';
appState().attrData.TotalData.LV1.SelectedLayer = 0;
```

---

### Phase 2: ユーティリティクラスの完全モジュール化 ✨

**目標:** `Generic`, `TKY2JGD` などのグローバルクラスをESモジュール化

#### 2.1 Generic クラス

```typescript
// src/utils/Generic.ts
export class Generic {
    // 既存の static メソッドはそのまま
    static createNewDiv(...args): HTMLDivElement { ... }
    static createNewButton(...args): HTMLButtonElement { ... }
    // ...
}

// 使用側
import { Generic } from '@/utils/Generic';
Generic.createNewDiv(...);
```

#### 2.2 定数のモジュール化

```typescript
// src/constants/geometry.ts
export const EARTH_R = 6370;
export const CHR_LF = String.fromCharCode(10);

// src/constants/enums.ts
export enum ZahyoModeInfo {
    NoMode = 0,
    IdoKeido = 1,
    Heimentyokukaku = 2
}

export enum LayerType {
    Point = 0,
    Line = 1,
    Polygon = 2
}

// 使用側
import { EARTH_R } from '@/constants/geometry';
import { ZahyoModeInfo } from '@/constants/enums';
```

---

### Phase 3: 型定義の完全分離 ✨

**目標:** globals.d.ts を型定義専用ファイルに変換（declare var を排除）

#### 3.1 globals.d.ts → types/ へ移行

```
src/
  types/
    index.ts              # 全型定義のエクスポート
    common.ts             # 汎用型
    interfaces.ts         # インターフェース定義
    classes.ts            # クラス型定義
    enums.ts              # 列挙型
    dom.ts                # DOM拡張
```

#### 3.2 DOM拡張のみ globals.d.ts に残す

```typescript
// src/globals.d.ts (最小化版)
// DOM APIの拡張のみ

interface GlobalEventHandlers {
    innerText?: string;
    tag?: any;
}

interface EventTarget {
    offsetLeft: number;
    offsetTop: number;
    offsetWidth: number;
    offsetHeight: number;
}

// グローバル変数の declare var は完全削除！
```

---

### Phase 4: 依存性注入パターンの導入 ✨

**目標:** 暗黙的なグローバル依存を明示的な引数に変換

#### 4.1 Before: グローバル依存

```typescript
function drawMap() {
    // グローバル変数に暗黙的に依存
    const data = attrData.TotalData;
    const settings = clsSettingData;
    clsPrint.drawSomething(data, settings);
}
```

#### 4.2 After: 依存性注入

```typescript
function drawMap(state: AppState) {
    // 明示的な依存関係
    const data = state.attrData.TotalData;
    const settings = state.settingData;
    // または
    import { Print } from '@/services/Print';
    const printer = new Print(state);
    printer.drawSomething(data, settings);
}

// 呼び出し側
import { appState } from '@/core/AppState';
drawMap(appState());
```

---

## 🔧 実装手順

### Step 1: 準備作業（今すぐ実施可能）

1. **AppState クラスの作成**
   ```bash
   mkdir -p src/core
   touch src/core/AppState.ts
   ```

2. **constants ディレクトリの作成**
   ```bash
   mkdir -p src/constants
   touch src/constants/geometry.ts
   touch src/constants/enums.ts
   touch src/constants/index.ts
   ```

3. **types ディレクトリの整理**
   ```bash
   mkdir -p src/types
   # types.ts を types/common.ts に移動
   ```

### Step 2: 段階的移行（優先度順）

#### Priority 1: 定数の移行 (即座に実施可能)

```typescript
// globals.d.ts から削除
declare var chrLF: string;
declare var EarthR: number;

// constants/geometry.ts に移動
export const CHR_LF = String.fromCharCode(10);
export const EARTH_R = 6370;
```

#### Priority 2: 列挙型の移行

```typescript
// globals.d.ts から削除
declare var enmZahyo_mode_info: {...};

// constants/enums.ts に移動
export enum ZahyoModeInfo {...}
```

#### Priority 3: ユーティリティクラスの移行

```typescript
// Generic はすでに clsGeneric.ts に実装済み
// 他のファイルで import { Generic } from './clsGeneric' を使用
```

#### Priority 4: アプリケーション状態の移行

```typescript
// main.ts のグローバル変数を AppState に移行
// すべてのファイルで appState() 経由でアクセス
```

### Step 3: 検証とクリーンアップ

1. **型チェック**
   ```bash
   npm run type-check
   ```

2. **テスト実行**
   ```bash
   npm test
   ```

3. **globals.d.ts のクリーンアップ**
   - `declare var` を段階的に削除
   - DOM拡張のみ残す

---

## 📁 最終的なディレクトリ構造

```
src/
  core/
    AppState.ts           # アプリケーション状態管理（旧グローバル変数）
    
  constants/
    index.ts              # 全定数のエクスポート
    geometry.ts           # 幾何学定数
    enums.ts              # 列挙型
    
  types/
    index.ts              # 全型定義のエクスポート
    common.ts             # 汎用型
    interfaces.ts         # インターフェース
    classes.ts            # クラス型
    dom.ts                # DOM拡張型
    
  utils/
    Generic.ts            # ユーティリティ（export済み）
    
  services/
    AttrData.ts           # データ管理サービス
    Print.ts              # 印刷サービス
    
  components/
    ...
    
  globals.d.ts            # DOM拡張のみ（最小化）
  main.ts                 # エントリーポイント（グローバル変数なし）
```

---

## ✅ 成功の指標

### 完了条件

- [ ] `globals.d.ts` の `declare var` が0個
- [ ] `main.ts` のファイルスコープのグローバル変数が0個
- [ ] すべての依存関係が `import` で明示的
- [ ] `AppState` 経由で状態アクセス
- [ ] 全テストがパス
- [ ] 型エラーなし

### 測定可能な改善

| 指標 | Before | Target |
|-----|--------|--------|
| `declare var` の数 | 50+ | 0 |
| グローバル変数 (main.ts) | 12 | 0 |
| import文のないファイル | 多数 | 0 |
| テスト可能性 | 低 | 高 |

---

## 🎓 メリット

### 1. **明示的な依存関係**
```typescript
// どのモジュールに依存しているか一目瞭然
import { AppState } from '@/core/AppState';
import { Generic } from '@/utils/Generic';
import { EARTH_R } from '@/constants/geometry';
```

### 2. **テスト容易性**
```typescript
// モックが簡単に作れる
const mockState = {
    attrData: { ... },
    settingData: { ... }
};
drawMap(mockState);
```

### 3. **型安全性の向上**
```typescript
// グローバル変数 → 実体のあるオブジェクト
// コンパイラが依存関係をチェック可能
```

### 4. **バンドルサイズの最適化**
```typescript
// 使用していないモジュールはバンドルから除外される
// Tree-shakingが有効に機能
```

### 5. **開発体験の向上**
- IDEの補完が正確に機能
- 定義ジャンプが正しく動作
- リファクタリングが安全

---

## 🚀 実装タイムライン

### Week 1: 基盤整備
- [x] AppState クラス作成
- [x] constants/ ディレクトリ作成
- [x] types/ ディレクトリ整理

### Week 2-3: 段階的移行
- [ ] 定数の移行 (chrLF, EarthR 等)
- [ ] 列挙型の移行 (enmZahyo_mode_info 等)
- [ ] ユーティリティの確認

### Week 4: 状態管理の移行
- [ ] main.ts のグローバル変数を AppState へ
- [ ] 全ファイルで appState() 使用に変更

### Week 5: クリーンアップ
- [ ] globals.d.ts の declare var 削除
- [ ] テスト追加
- [ ] ドキュメント更新

### Week 6: 検証と最適化
- [ ] 全機能テスト
- [ ] パフォーマンス測定
- [ ] 最終調整

---

## 🔍 リスクと対策

### リスク1: 大規模な変更による不具合
**対策:** 
- 段階的に移行（1ファイルずつ）
- 各ステップでテスト実行
- Git branchで作業

### リスク2: 既存コードの動作変更
**対策:**
- AppStateはシングルトン → 動作は変わらない
- importの追加のみで既存ロジックは維持

### リスク3: 開発時間
**対策:**
- 自動化スクリプトの活用
- コード生成ツールの使用
- 優先度をつけた段階的実施

---

## 💡 次のアクション

### 今すぐ実施

1. **AppState クラスの作成**
   ```bash
   npm run type-check  # 現状確認
   ```

2. **constants ディレクトリの作成**
   - 定数を抽出

3. **1つのファイルで試験導入**
   - 小さな変更で動作確認

### 今後の作業

1. **自動移行スクリプトの作成**
   - `declare var` → `export` 変換
   - import文の自動追加

2. **チーム合意の形成**
   - 移行計画のレビュー
   - 優先度の調整

3. **CI/CDの整備**
   - 各ステップでの自動テスト
   - リグレッション防止

---

この計画により、**完全なESモジュール化**を実現し、モダンで保守性の高いコードベースを構築できます！
