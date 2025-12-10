# TypeScript改良計画 - 長大なクラスの分割提案

## 📊 現状分析

### ファイルサイズ (行数)

| ファイル | 行数 | 状態 |
|---------|------|------|
| clsAttrData.ts | 9,003 | 🔴 要分割 |
| clsGeneric.ts | 6,084 | 🔴 要分割 |
| clsWindow.ts | 4,557 | 🟡 分割推奨 |
| clsGridControl.ts | 4,444 | 🟡 分割推奨 |
| clsDraw.ts | 4,240 | 🟡 分割推奨 |
| clsPrint.ts | 3,814 | 🟡 分割推奨 |

**問題点:**
- メンテナンス性の低下
- テストの困難さ
- 複数人での並行開発が困難
- ビルド時間の増加
- IDE のパフォーマンス低下

---

## 🎯 分割戦略

### 1. clsAttrData.ts (9,003行)

**問題:**
- 多数のインターフェース定義が混在
- データ型と処理ロジックが同一ファイル
- 20以上のインターフェース定義

**分割案:**

```
src/
  models/
    attrData/
      types.ts              # 基本型定義 (point3, strDegreeMinuteSeconde等)
      objectData.ts         # オブジェクト関連型 (strObject_Data_Info等)
      markData.ts           # マーク関連型 (strMarkCommon_Data等)
      classData.ts          # クラス分類関連型 (strClassPaint_Data等)
      timeData.ts           # 時系列関連型 (Start_End_Time_data等)
      syntheticData.ts      # 合成データ関連型
      tileMapData.ts        # タイルマップ関連型
  
  services/
    attrData/
      attrDataReader.ts     # データ読み込み処理
      attrDataWriter.ts     # データ書き込み処理
      attrDataValidator.ts  # データバリデーション
      attrDataTransform.ts  # データ変換処理
```

**メリット:**
- 型定義が見つけやすい
- 関連する型がグループ化される
- テストが書きやすくなる

---

### 2. clsGeneric.ts (6,084行)

**問題:**
- 汎用ユーティリティが1つのクラスに集約
- 座標計算、DOM操作、文字列処理など多岐にわたる

**分割案:**

```
src/
  utils/
    geometry/
      point.ts              # 座標計算ユーティリティ
      rectangle.ts          # 矩形関連ユーティリティ
      transform2D.ts        # 2D変換処理
      transform3D.ts        # 3D変換処理
      distance.ts           # 距離計算
    
    dom/
      elementCreator.ts     # DOM要素作成
      windowManager.ts      # ウィンドウ管理
      eventHandlers.ts      # イベントハンドリング
    
    data/
      arrayUtils.ts         # 配列操作
      stringUtils.ts        # 文字列操作
      numberUtils.ts        # 数値処理
    
    spatial/
      spatialIndex.ts       # 空間インデックス
      boundingBox.ts        # バウンディングボックス
```

**メリット:**
- 責任の明確化
- 単体テストが容易
- 必要な機能だけインポート可能（バンドルサイズ削減）

---

### 3. clsWindow.ts (4,557行)

**問題:**
- UI設定処理が1ファイルに集約
- 複数の大きな関数が存在

**分割案:**

```
src/
  ui/
    windows/
      settingWindow.ts      # 設定ウィンドウ (setting関数)
      dataReaderWindow.ts   # データ読み込みウィンドウ (readData)
      shapeFileWindow.ts    # シェープファイルウィンドウ (openShapeFile)
      mapViewerWindow.ts    # 地図ビューアウィンドウ (mapViewer)
    
    components/
      layerInfo.ts          # strLayerInfo クラス
      fileDropZone.ts       # ファイルドロップ処理
      dialogBase.ts         # ダイアログ基底クラス
```

---

### 4. clsGridControl.ts / clsDraw.ts / clsPrint.ts

これらも同様の方針で分割:

```
src/
  grid/
    gridControl.ts        # グリッド制御のコア
    gridRenderer.ts       # グリッド描画
    gridEditor.ts         # グリッド編集
    gridValidator.ts      # グリッド検証
  
  draw/
    drawCore.ts           # 描画のコア処理
    shapes/
      lineDrawer.ts       # 線描画
      polygonDrawer.ts    # ポリゴン描画
      circleDrawer.ts     # 円描画
    styles/
      colorManager.ts     # 色管理
      styleApplier.ts     # スタイル適用
  
  print/
    printCore.ts          # 印刷のコア処理
    printPreview.ts       # 印刷プレビュー
    printSettings.ts      # 印刷設定
    exporters/
      pdfExporter.ts      # PDF出力
      imageExporter.ts    # 画像出力
```

---

## 🚀 段階的移行計画

### Phase 1: 型定義の分離 (優先度: 高)

1. `src/models/` ディレクトリを作成
2. インターフェース定義を移行
3. 既存コードから型をインポート

```typescript
// Before: clsAttrData.ts
interface strObject_Data_Info { ... }
class AttrData {
  data: strObject_Data_Info;
}

// After:
// src/models/attrData/objectData.ts
export interface ObjectDataInfo { ... }

// src/services/attrData/attrDataReader.ts
import { ObjectDataInfo } from '@/models/attrData/objectData';
```

### Phase 2: ユーティリティ関数の分離 (優先度: 中)

1. `src/utils/` ディレクトリを作成
2. static メソッドを個別関数として抽出
3. 関連する関数をグループ化

### Phase 3: UIコンポーネントの分離 (優先度: 中)

1. `src/ui/` ディレクトリを作成
2. 大きな関数を独立したモジュールに分割
3. 共通UIコンポーネントを抽出

### Phase 4: テストの追加 (優先度: 高)

各分割モジュールにテストを追加

```
tests/
  utils/
    geometry/
      point.test.ts
      rectangle.test.ts
  models/
    attrData/
      objectData.test.ts
```

---

## 📝 命名規則の改善

### 現在の問題
- `str`プレフィックス (Hungrian記法の名残)
- 略語の多用 (`cls`, `frm`, `enmなど`)

### 提案

```typescript
// Before
interface strObject_Data_Info { ... }
class clsAttrData { ... }
var enmSelectMode = { ... }

// After
interface ObjectDataInfo { ... }
class AttrData { ... }
enum SelectMode { ... }
```

---

## ✅ 実装チェックリスト

- [x] テスト環境のセットアップ
- [x] tsconfig.json strict設定強化
- [x] ESLint設定強化
- [x] var → let/const 変換
- [x] any型の削減開始
- [ ] 型定義ファイルの分離
- [ ] ユーティリティ関数の分割
- [ ] UIコンポーネントの分割
- [ ] 各モジュールのテスト追加
- [ ] ドキュメント整備

---

## 🎓 参考ベストプラクティス

### Single Responsibility Principle (単一責任の原則)
各クラス/ファイルは1つの責任のみを持つべき

### ファイルサイズの目安
- 理想: 300行以下
- 許容: 500行以下
- 要検討: 1000行以上
- 緊急: 3000行以上

### モジュール分割の指標
- 機能ごと (feature-based)
- レイヤーごと (layer-based)
- ドメインごと (domain-based)

---

## 📚 次のステップ

1. **即座に実行可能:**
   - 型定義を `src/types.ts` や `src/models/` に移動
   - 定数を `src/constants/` に移動
   
2. **短期 (1-2週間):**
   - clsGeneric の分割開始
   - 基本的なテストの追加
   
3. **中期 (1ヶ月):**
   - clsAttrData の分割
   - UIコンポーネントの分離
   
4. **長期 (3ヶ月):**
   - 全モジュールのテストカバレッジ80%以上
   - ドキュメント整備完了
   - CI/CD パイプライン構築
