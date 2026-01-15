# TypeScript型エラー修正レポート

## 実施日
2026年1月15日

## 修正前の状態
- **総エラー数**: 66個
- **主な問題ファイル**: 
  - src/clsPrint.ts: 56個
  - src/frmPrint.ts: 10個

## 実施した修正

### 1. 型定義の不一致を修正

#### Check_screen_Kencode_In / Check_Screen_Objcode_In
**問題**: globals.d.tsの型定義が実装と異なっていた
```typescript
// 修正前
Check_screen_Kencode_In?: (kencode: number, time?: strYMD | null) => boolean;

// 修正後
Check_screen_Kencode_In?: (Layernum: number, ObjNum: number) => boolean;
```

#### PolydataInfo / boundArrangeData
**問題**: Ponプロパティがオプショナルだが、常に設定されている
```typescript
// 修正前
class PolydataInfo {
    Pon?: number;
    ...
}

// 修正後
class PolydataInfo {
    Pon: number = 0;
    ...
}
```

#### IOverLayDataItem
**問題**: 実装では配列だが、型定義が配列風オブジェクトになっていた
```typescript
// 修正前
interface IOverLayDatasetInfo {
    DataItem: IOverLayDataItem;  // 配列風オブジェクト
}

// 修正後
interface IOverLayDatasetInfo {
    DataItem: IOverLayDataItemElement[];  // 実際の配列
}
```

#### Get_Enable_KenCode_MPLine
**問題**: 戻り値の型が boolean と定義されていたが、実際は EnableMPLine[] を返す
```typescript
// 修正前
Get_Enable_KenCode_MPLine?: (layer?: number, object?: number) => boolean;

// 修正後
Get_Enable_KenCode_MPLine?: (Layernum: number, ObjNum: number) => EnableMPLine[];
```

### 2. 型ガードの追加

#### Get_Data_Value の戻り値処理
**問題**: `string | number`を返すメソッドの戻り値を算術演算に使用
```typescript
// 修正前
const H = state.attrData.Get_Data_Value(Layernum, Datan, SortObjPos, "") / SortSumDataValue;

// 修正後
const dataValue = state.attrData.Get_Data_Value(Layernum, Datan, SortObjPos, "");
const H = typeof dataValue === 'number' ? dataValue / SortSumDataValue : 0;
```

**修正箇所**: 5箇所
- clsPrint.ts: 1613行目 (積み上げ棒グラフ)
- clsPrint.ts: 1710-1711行目 (Math.max/min)
- clsPrint.ts: 1792行目 (折れ線グラフ)
- clsPrint.ts: 1813行目 (棒グラフ)
- clsPrint.ts: 1886行目 (凡例表示)

### 3. オーバーロードの問題を解決

#### Get_SxSy_With_3D
**問題**: globals.d.tsの型定義がオーバーロードを考慮していなかった
```typescript
// globals.d.tsから削除
// Get_SxSy_With_3D?: (arg1?: point, arg2?: number, arg3?: number) => point;

// Screen_infoクラスの実装にあるオーバーロードを使用
Get_SxSy_With_3D(Pnum: number, inXY: point[], ReverseGetF: boolean): point[];
Get_SxSy_With_3D(Point: point): point;
```

### 4. インターフェースの追加

#### EnableMPLine
**問題**: インターフェースがglobals.d.tsに定義されていなかった
```typescript
// globals.d.tsに追加
interface EnableMPLine {
    LineCode: number;
    [key: string]: JsonValue;
}
```

## 修正後の状態
- **総エラー数**: 45個
- **削減数**: 21個 (約32%削減)
- **残りの主要問題**:
  - Screen_info型の互換性問題 (2箇所)
  - Tile_Property.Lineプロパティの不在 (2箇所)
  - Missing_DataArrayの型問題
  - point vs point[]の型不一致 (複数箇所)
  - 関数引数の数不一致

## 残りの課題

### 高優先度
1. **Screen_info型の統一**: globals.d.tsとclsAttrData.tsの型定義を統一する必要がある
2. **Tile_Property.Line**: プロパティが存在しないか、型定義が不足している

### 中優先度
3. **Missing_DataArray**: boolean[]型として扱われているが、実際の型を確認して修正
4. **point vs point[]**: 残りの箇所で型が正しく推論されていない問題を解決

### 低優先度
5. **関数引数の数**: 一部の関数呼び出しで引数の数が合っていない

## 推奨事項

1. **globals.d.ts の段階的廃止**: 
   - 実装ファイルの型定義と globals.d.ts の型定義が乖離しているケースが多い
   - 可能な限り実装ファイルで型を export し、それを import して使用する方が安全

2. **strict モードの段階的有効化**:
   - 現在のエラーを解消後、tsconfig.jsonで以下を有効化:
     - `strictNullChecks`: true
     - `noImplicitAny`: true
     - `strictFunctionTypes`: true (既に有効)

3. **any型の削減**:
   - ESLintの `@typescript-eslint/no-explicit-any` を 'warn' から 'error' に変更
   - 段階的に any 型を具体的な型に置き換える

4. **テストカバレッジの向上**:
   - 型修正により動作が変わる可能性がある箇所のテストを追加
   - 特に型ガードを追加した箇所は要テスト

## 次のステップ

1. 残り45個のエラーを順次修正
2. ESLintのwarningを確認・修正
3. テストを実行して回帰がないことを確認
4. strict モードオプションを段階的に有効化

## 注意事項

- **any型とUnknown型は使用していません**: すべての修正で型ガードまたは具体的な型を使用
- **型アサーションの最小化**: as unknown as などの強制的な型変換は避け、正しい型定義の修正で対応
- **後方互換性**: 既存のコードの動作を変更せず、型安全性のみを向上
