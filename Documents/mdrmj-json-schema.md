# MANDARA WebGIS mdrmj JSON スキーマ一覧表

## 目的

この文書は、mdrmj ファイルの JSON 構造を一覧化したものです。

- 対象: 地図データ付属形式の mdrmj
- 基準: 現行 saveAsMDRJ 実装
- 補助根拠: SetDataFromMDRJ と clsMapdata.openJsonMapData の復元処理

## 結論

mdrmj は、標準 mdrj に mapData を追加した形式です。

ルート構造は次の 4 キーです。

- TotalData
- LayerData
- saveLPat
- mapData

このうち、TotalData、LayerData、saveLPat は標準 mdrj と同一です。mdrmj 固有部分は mapData です。

## 共有部分

次の 3 つの構造は、標準 mdrj と同じです。

- TotalData
- LayerData
- saveLPat

これらの詳細は以下を参照してください。

- mdrj 共通スキーマ: mdrj-json-schema.md
- 保存処理分析: mdrj-save-analysis.md

この文書では、mdrmj 固有の mapData と、mdrmj 全体のルート差分を中心に整理します。

## ルート擬似スキーマ

```json
{
  "TotalData": {},
  "LayerData": [],
  "saveLPat": {},
  "mapData": {
    "<MAP_FILENAME>": {
      "Map": {},
      "ObjectKind": [],
      "LineKind": [],
      "MPLine": [],
      "MPObj": []
    }
  }
}
```

## 実装上の生成元

mdrmj 保存時、saveAsMDRJ はルートへ mapData を追加します。

- 保存元: this.MapData.getAllMapData()
- 実装位置: ../src/clsAttrData.ts#L3779-L3784
- 辞書クラス: clsAttrMapData
- 返却実装: ../src/clsAttrData.ts#L8868-L8870

値として入るのは clsMapdata のインスタンスです。

- クラス定義: ../src/clsMapdata.ts#L512-L520

読み込み側では、mapData の各要素を clsMapdata.openJsonMapData(json, true) で復元します。

- 実装位置: ../src/clsAttrData.ts#L4923-L4931
- 地図 JSON 復元: ../src/clsMapdata.ts#L3006-L3200

## 1. ルート差分一覧

| JSON Path | 型 | 保存元 | 説明 | 備考 |
| --- | --- | --- | --- | --- |
| $ | object | saveAsMDRJ 内の savedata | mdrmj 全体 | 4 キー構成 |
| $.TotalData | object | this.TotalData | 全体表示・条件・図形など | mdrj と同じ |
| $.LayerData | array<object> | this.LayerData | レイヤ配列 | mdrj と同じ |
| $.saveLPat | object | saveLPat | 線種差分 | mdrj と同じ |
| $.mapData | object | this.MapData.getAllMapData() | 埋め込み地図データ辞書 | mdrmj 固有 |

## 2. mapData 概要

mapData は、地図ファイル名をキーにした辞書です。

実サンプル data/japan_sityoson_pop.mdrmj では、次のキーを持っていました。

- 日本市町村緯度経度.MPFJ

### mapData の基本形

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.mapData | object | clsAttrMapData.attrMapData | 地図ファイル辞書 |
| $.mapData.<MAP_FILENAME> | object | clsMapdata instance | 埋め込み地図 JSON 1 件 |

### mapData.<MAP_FILENAME> の主要キー

| JSON Path | 型 | 保存元 | 説明 | 備考 |
| --- | --- | --- | --- | --- |
| $.mapData.<MAP_FILENAME>.Map | object | clsMapdata.Map | 地図メタデータ | strMap_data |
| $.mapData.<MAP_FILENAME>.ObjectKind | array<object> | clsMapdata.ObjectKind | オブジェクト種別定義配列 | strObjectGroup_Data[] |
| $.mapData.<MAP_FILENAME>.LineKind | array<object> | clsMapdata.LineKind | 線種定義配列 | LineKind_Data[] |
| $.mapData.<MAP_FILENAME>.MPLine | array<object> | clsMapdata.MPLine | 線分データ配列 | strLine_Data[] |
| $.mapData.<MAP_FILENAME>.MPObj | array<object> | clsMapdata.MPObj | 地図オブジェクト配列 | strObj_Data[] |

## 3. mapData.<MAP_FILENAME>.Map

### 概要

Map は地図ファイル全体のメタデータです。

- 元クラス: strMap_data
- 定義位置: ../src/clsMapdata.ts#L420-L432

### 一覧

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.mapData.<MAP_FILENAME>.Map.FileName | string | Map.FileName | 元地図ファイル名 |
| $.mapData.<MAP_FILENAME>.Map.FullPath | string | Map.FullPath | 元のフルパス |
| $.mapData.<MAP_FILENAME>.Map.MPVersion | number | Map.MPVersion | 地図ファイルバージョン |
| $.mapData.<MAP_FILENAME>.Map.OBKNum | number | Map.OBKNum | オブジェクト種別数 |
| $.mapData.<MAP_FILENAME>.Map.Kend | number | Map.Kend | オブジェクト数 |
| $.mapData.<MAP_FILENAME>.Map.LpNum | number | Map.LpNum | 線種数 |
| $.mapData.<MAP_FILENAME>.Map.ALIN | number | Map.ALIN | ライン数 |
| $.mapData.<MAP_FILENAME>.Map.SCL | number | Map.SCL | スケール |
| $.mapData.<MAP_FILENAME>.Map.SCL_U | number | Map.SCL_U | スケール単位 |
| $.mapData.<MAP_FILENAME>.Map.Comment | string | Map.Comment | 地図コメント |
| $.mapData.<MAP_FILENAME>.Map.Time_Mode | boolean | Map.Time_Mode | 時系列地図フラグ |
| $.mapData.<MAP_FILENAME>.Map.Circumscribed_Rectangle | object | Map.Circumscribed_Rectangle | 外接矩形 |
| $.mapData.<MAP_FILENAME>.Map.Zahyo | object | Map.Zahyo | 座標系設定 |
| $.mapData.<MAP_FILENAME>.Map.Detail | object | Map.Detail | 地図詳細設定 |
| $.mapData.<MAP_FILENAME>.Map.MapCompass | object | Map.MapCompass | 方位記号設定 |

### Map.Circumscribed_Rectangle

mdrmj では rectangle が小文字プロパティで保存されます。

| JSON Path | 型 | 説明 |
| --- | --- | --- |
| $.mapData.<MAP_FILENAME>.Map.Circumscribed_Rectangle.left | number | 左 |
| $.mapData.<MAP_FILENAME>.Map.Circumscribed_Rectangle.right | number | 右 |
| $.mapData.<MAP_FILENAME>.Map.Circumscribed_Rectangle.top | number | 上 |
| $.mapData.<MAP_FILENAME>.Map.Circumscribed_Rectangle.bottom | number | 下 |

### Map.Zahyo

| JSON Path | 型 | 説明 |
| --- | --- | --- |
| $.mapData.<MAP_FILENAME>.Map.Zahyo.Mode | number | 座標モード |
| $.mapData.<MAP_FILENAME>.Map.Zahyo.System | number | 座標系 |
| $.mapData.<MAP_FILENAME>.Map.Zahyo.HeimenTyokkaku_KEI_Number | number | 平面直角座標系番号 |
| $.mapData.<MAP_FILENAME>.Map.Zahyo.Projection | number | 投影法 |
| $.mapData.<MAP_FILENAME>.Map.Zahyo.CenterXY | object | 投影中心点 |
| $.mapData.<MAP_FILENAME>.Map.Zahyo.CenterXY.x | number | X |
| $.mapData.<MAP_FILENAME>.Map.Zahyo.CenterXY.y | number | Y |

### Map.Detail

| JSON Path | 型 | 説明 |
| --- | --- | --- |
| $.mapData.<MAP_FILENAME>.Map.Detail.DistanceMeasurable | boolean | 距離測定可能フラグ |
| $.mapData.<MAP_FILENAME>.Map.Detail.ScaleVisible | boolean | 縮尺表示可否 |

### Map.MapCompass

| JSON Path | 型 | 説明 | 備考 |
| --- | --- | --- | --- |
| $.mapData.<MAP_FILENAME>.Map.MapCompass.Visible | boolean | 方位記号表示可否 | |
| $.mapData.<MAP_FILENAME>.Map.MapCompass.Position | object | 方位記号位置 | point |
| $.mapData.<MAP_FILENAME>.Map.MapCompass.Mark | object | 方位記号本体 | Mark_Property |
| $.mapData.<MAP_FILENAME>.Map.MapCompass.dirWord | object | 東西南北文字列 | East, West, North, South |
| $.mapData.<MAP_FILENAME>.Map.MapCompass.Font | object | 方位文字フォント | Font_Property |

## 4. mapData.<MAP_FILENAME>.ObjectKind[]

### 概要

ObjectKind は地図オブジェクト種別の定義です。

- 元クラス: strObjectGroup_Data
- 定義位置: ../src/clsMapdata.ts#L198-L218

### 一覧

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.mapData.<MAP_FILENAME>.ObjectKind[].ObjectType | number | ObjectType | オブジェクトグループ種別 |
| $.mapData.<MAP_FILENAME>.ObjectKind[].Name | string | Name | 種別名 |
| $.mapData.<MAP_FILENAME>.ObjectKind[].Shape | number | Shape | 形状 |
| $.mapData.<MAP_FILENAME>.ObjectKind[].Mesh | number | Mesh | メッシュ区分 |
| $.mapData.<MAP_FILENAME>.ObjectKind[].Color | object | Color | 代表色 |
| $.mapData.<MAP_FILENAME>.ObjectKind[].DefTimeAttDataNum | number | DefTimeAttDataNum | 定義済み時間属性数 |
| $.mapData.<MAP_FILENAME>.ObjectKind[].DefTimeAttSTC | array<object> | DefTimeAttSTC | 定義済み時間属性定義 |
| $.mapData.<MAP_FILENAME>.ObjectKind[].ObjectNameNum | number | ObjectNameNum | 名前要素数 |
| $.mapData.<MAP_FILENAME>.ObjectKind[].ObjectNameList | array<string> | ObjectNameList | 名前要素名一覧 |
| $.mapData.<MAP_FILENAME>.ObjectKind[].UseLineType | array<boolean> | UseLineType | 利用線種フラグ配列 |
| $.mapData.<MAP_FILENAME>.ObjectKind[].UseObjectGroup | array<boolean> | UseObjectGroup | 利用オブジェクトグループフラグ配列 |

### ObjectKind[].Color

| JSON Path | 型 | 説明 |
| --- | --- | --- |
| $.mapData.<MAP_FILENAME>.ObjectKind[].Color.r | number | 赤 |
| $.mapData.<MAP_FILENAME>.ObjectKind[].Color.g | number | 緑 |
| $.mapData.<MAP_FILENAME>.ObjectKind[].Color.b | number | 青 |
| $.mapData.<MAP_FILENAME>.ObjectKind[].Color.a | number | 透明度 |

### ObjectKind[].DefTimeAttSTC[]

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.mapData.<MAP_FILENAME>.ObjectKind[].DefTimeAttSTC[].Type | number | Type | 時間属性データ種別 |
| $.mapData.<MAP_FILENAME>.ObjectKind[].DefTimeAttSTC[].ExtraValue | number | ExtraValue | 補間・欠損処理種別 |
| $.mapData.<MAP_FILENAME>.ObjectKind[].DefTimeAttSTC[].attData | object | attData | 属性定義 |

### ObjectKind[].DefTimeAttSTC[].attData

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.mapData.<MAP_FILENAME>.ObjectKind[].DefTimeAttSTC[].attData.Title | string | Title | 属性名 |
| $.mapData.<MAP_FILENAME>.ObjectKind[].DefTimeAttSTC[].attData.Unit | string | Unit | 単位 |
| $.mapData.<MAP_FILENAME>.ObjectKind[].DefTimeAttSTC[].attData.MissingF | boolean | MissingF | 欠損可否 |
| $.mapData.<MAP_FILENAME>.ObjectKind[].DefTimeAttSTC[].attData.Note | string | Note | 注記 |

## 5. mapData.<MAP_FILENAME>.LineKind[]

### 概要

LineKind は線種定義です。

- 元クラス: LineKind_Data
- 定義位置: ../src/clsMapdata.ts#L464-L470

### 一覧

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.mapData.<MAP_FILENAME>.LineKind[].Name | string | Name | 線種名 |
| $.mapData.<MAP_FILENAME>.LineKind[].NumofObjectGroup | number | NumofObjectGroup | グループ数 |
| $.mapData.<MAP_FILENAME>.LineKind[].Mesh | boolean | Mesh | メッシュ線フラグ |
| $.mapData.<MAP_FILENAME>.LineKind[].ObjGroup | array<object> | ObjGroup | グループ別パターン |

### LineKind[].ObjGroup[]

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.mapData.<MAP_FILENAME>.LineKind[].ObjGroup[].GroupNumber | number | GroupNumber | オブジェクトグループ番号 |
| $.mapData.<MAP_FILENAME>.LineKind[].ObjGroup[].UseOnly | boolean | UseOnly | 使用制限フラグ |
| $.mapData.<MAP_FILENAME>.LineKind[].ObjGroup[].Pattern | object | Pattern | 線パターン |

### LineKind[].ObjGroup[].Pattern

mdrmj では線パターンが簡略形で保存されます。

| JSON Path | 型 | 説明 |
| --- | --- | --- |
| $.mapData.<MAP_FILENAME>.LineKind[].ObjGroup[].Pattern.BlankF | boolean | 空線扱いフラグ |
| $.mapData.<MAP_FILENAME>.LineKind[].ObjGroup[].Pattern.Width | number | 線幅 |
| $.mapData.<MAP_FILENAME>.LineKind[].ObjGroup[].Pattern.Color | object | 色 |
| $.mapData.<MAP_FILENAME>.LineKind[].ObjGroup[].Pattern.Edge_Connect_Pattern | object | 線端・接合 |
| $.mapData.<MAP_FILENAME>.LineKind[].ObjGroup[].Pattern.Edge_Connect_Pattern.lineCap | string | lineCap |
| $.mapData.<MAP_FILENAME>.LineKind[].ObjGroup[].Pattern.Edge_Connect_Pattern.lineJoin | string | lineJoin |
| $.mapData.<MAP_FILENAME>.LineKind[].ObjGroup[].Pattern.Edge_Connect_Pattern.miterLimit | number | miterLimit |

## 6. mapData.<MAP_FILENAME>.MPLine[]

### 概要

MPLine は地図上の線分データ本体です。

- 元クラス: strLine_Data
- 定義位置: ../src/clsMapdata.ts#L358-L377

### 一覧

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.mapData.<MAP_FILENAME>.MPLine[].Number | number | Number | ライン番号 |
| $.mapData.<MAP_FILENAME>.MPLine[].NumOfPoint | number | NumOfPoint | 点数 |
| $.mapData.<MAP_FILENAME>.MPLine[].Connect | number | Connect | 接続種別 |
| $.mapData.<MAP_FILENAME>.MPLine[].NumOfLineUse | number | NumOfLineUse | 利用回数 |
| $.mapData.<MAP_FILENAME>.MPLine[].Circumscribed_Rectangle | object | Circumscribed_Rectangle | 外接矩形 |
| $.mapData.<MAP_FILENAME>.MPLine[].NumOfTime | number | NumOfTime | 時間区分数 |
| $.mapData.<MAP_FILENAME>.MPLine[].Drawn | boolean | Drawn | 描画可否 |
| $.mapData.<MAP_FILENAME>.MPLine[].LineTimeSTC | array<object> | LineTimeSTC | 時間別線種情報 |
| $.mapData.<MAP_FILENAME>.MPLine[].PointSTC | array<object> | PointSTC | 点列 |

### MPLine[].LineTimeSTC[]

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.mapData.<MAP_FILENAME>.MPLine[].LineTimeSTC[].Kind | number | Kind | 線種番号 |
| $.mapData.<MAP_FILENAME>.MPLine[].LineTimeSTC[].SETime | object | SETime | 適用期間 |
| $.mapData.<MAP_FILENAME>.MPLine[].LineTimeSTC[].SETime.StartTime | object | StartTime | 開始日 |
| $.mapData.<MAP_FILENAME>.MPLine[].LineTimeSTC[].SETime.EndTime | object | EndTime | 終了日 |

### MPLine[].PointSTC[]

| JSON Path | 型 | 説明 |
| --- | --- | --- |
| $.mapData.<MAP_FILENAME>.MPLine[].PointSTC[].x | number | X 座標 |
| $.mapData.<MAP_FILENAME>.MPLine[].PointSTC[].y | number | Y 座標 |

## 7. mapData.<MAP_FILENAME>.MPObj[]

### 概要

MPObj は地図オブジェクト本体です。

- 元クラス: strObj_Data
- 定義位置: ../src/clsMapdata.ts#L247-L269

### 一覧

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.mapData.<MAP_FILENAME>.MPObj[].Number | number | Number | オブジェクト番号 |
| $.mapData.<MAP_FILENAME>.MPObj[].Kind | number | Kind | ObjectKind 参照番号 |
| $.mapData.<MAP_FILENAME>.MPObj[].Shape | number | Shape | 形状 |
| $.mapData.<MAP_FILENAME>.MPObj[].NumOfNameTime | number | NumOfNameTime | 名称時点数 |
| $.mapData.<MAP_FILENAME>.MPObj[].NumOfCenterP | number | NumOfCenterP | 代表点数 |
| $.mapData.<MAP_FILENAME>.MPObj[].NumOfSuc | number | NumOfSuc | 継承数 |
| $.mapData.<MAP_FILENAME>.MPObj[].NumOfLine | number | NumOfLine | 使用ライン数 |
| $.mapData.<MAP_FILENAME>.MPObj[].Circumscribed_Rectangle | object | Circumscribed_Rectangle | 外接矩形 |
| $.mapData.<MAP_FILENAME>.MPObj[].DefTimeAttValue | array<object> | DefTimeAttValue | 時点属性値配列 |
| $.mapData.<MAP_FILENAME>.MPObj[].SucSTC | array<object> | SucSTC | 継承情報配列 |
| $.mapData.<MAP_FILENAME>.MPObj[].NameTimeSTC | array<object> | NameTimeSTC | 名称時系列配列 |
| $.mapData.<MAP_FILENAME>.MPObj[].CenterPSTC | array<object> | CenterPSTC | 代表点時系列配列 |
| $.mapData.<MAP_FILENAME>.MPObj[].LineCodeSTC | array<object> | LineCodeSTC | 使用ライン配列 |

### MPObj[].DefTimeAttValue[]

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.mapData.<MAP_FILENAME>.MPObj[].DefTimeAttValue[].Data | array<object> | Data | 時間属性値列 |
| $.mapData.<MAP_FILENAME>.MPObj[].DefTimeAttValue[].Data[].Span | object | Span | 適用期間 |
| $.mapData.<MAP_FILENAME>.MPObj[].DefTimeAttValue[].Data[].Value | string\|null | Value | 属性値 |

### MPObj[].SucSTC[]

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.mapData.<MAP_FILENAME>.MPObj[].SucSTC[].ObjectCode | number | ObjectCode | 継承先または元オブジェクト番号 |
| $.mapData.<MAP_FILENAME>.MPObj[].SucSTC[].Time | object | Time | 継承日 |

### MPObj[].NameTimeSTC[]

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.mapData.<MAP_FILENAME>.MPObj[].NameTimeSTC[].NamesList | array<string> | NamesList | 名称要素配列 |
| $.mapData.<MAP_FILENAME>.MPObj[].NameTimeSTC[].SETime | object | SETime | 適用期間 |

### MPObj[].CenterPSTC[]

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.mapData.<MAP_FILENAME>.MPObj[].CenterPSTC[].Position | object | Position | 代表点 |
| $.mapData.<MAP_FILENAME>.MPObj[].CenterPSTC[].Position.x | number | x | X 座標 |
| $.mapData.<MAP_FILENAME>.MPObj[].CenterPSTC[].Position.y | number | y | Y 座標 |
| $.mapData.<MAP_FILENAME>.MPObj[].CenterPSTC[].SETime | object | SETime | 適用期間 |

### MPObj[].LineCodeSTC[]

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.mapData.<MAP_FILENAME>.MPObj[].LineCodeSTC[].LineCode | number | LineCode | 参照ライン番号 |
| $.mapData.<MAP_FILENAME>.MPObj[].LineCodeSTC[].NumOfTime | number | NumOfTime | 時間数 |
| $.mapData.<MAP_FILENAME>.MPObj[].LineCodeSTC[].Times | array<object> | Times | 適用時間配列 |

## 8. mdrmj の座標・描画プロパティ表現

mdrmj 内の地図 JSON は、従来の地図 JSON より簡略化された style 表現を使います。読み込み側も mdrmjFlag = true を前提に別分岐で復元しています。

### point

- mdrj 系の一部旧形式では X, Y
- mdrmj 内 mapData では x, y

復元位置:

- ../src/clsMapdata.ts#L3256-L3267

### rectangle

- 旧形式では Left, Right, Top, Bottom
- mdrmj 内 mapData では left, right, top, bottom

復元位置:

- ../src/clsMapdata.ts#L3201-L3226
- ../src/clsMapdata.ts#L3289-L3299

### Font_Property

mdrmj 内では Font が平坦化されます。

- Color
- Size
- italic
- bold
- Underline
- Name
- Kakudo
- FringeF
- FringeWidth
- FringeColor
- Back

復元位置:

- ../src/clsMapdata.ts#L3201-L3226

### Line_Property

mdrmj 内では Line が簡略形になります。

- BlankF
- Width
- Color
- Edge_Connect_Pattern

復元位置:

- ../src/clsMapdata.ts#L3310-L3331

### Tile_Property

mdrmj 内では Tile が簡略形になります。

- BlankF
- Color

復元位置:

- ../src/clsMapdata.ts#L3333-L3344

### Mark_Property

mdrmj 内では Mark も簡略形を使います。

- PrintMark
- ShapeNumber
- Tile
- Line
- wordmark
- WordFont

復元位置:

- ../src/clsMapdata.ts#L3346-L3355

## 9. 実装上の注意点

### 9.1 mapData は clsMapdata インスタンスの直列化結果

saveAsMDRJ は mapData を専用 DTO に変換していません。clsMapdata インスタンスをそのまま JSON 化しているため、将来 clsMapdata に列挙可能プロパティが追加されると、出力キーが増える可能性があります。

### 9.2 現行実装と既存サンプルの差

既存サンプル mdrmj は実際に次の 5 キーで保存されていました。

- Map
- ObjectKind
- LineKind
- MPLine
- MPObj

ただし、現行コードは class instance を直接 JSON 化しているため、バージョン差によっては runtime helper 的な追加キーが保存される可能性があります。互換仕様としては、openJsonMapData が実際に読むキーを優先して扱うのが安全です。

### 9.3 MapCompass.Font など一部 style は空オブジェクトを含みうる

実サンプルでは MapCompass.Font.Color や Back 内に空オブジェクトが見られる箇所があります。これは古い保存データや変換経路の影響を受けるため、厳密な必須項目としては扱わず、復元側が補完する前提で読む必要があります。

### 9.4 LineKind と saveLPat の役割は別

mapData.LineKind は地図本体に埋め込まれた線種定義です。一方、saveLPat は属性データ側の線種差分で、読み込み時に LineKind へ再適用されます。両者は内容が似ていますが用途が異なります。

## 10. 参照先

- mdrj 共通スキーマ: mdrj-json-schema.md
- 保存処理分析: mdrj-save-analysis.md
