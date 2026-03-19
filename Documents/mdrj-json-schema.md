# MANDARA WebGIS mdrj JSON スキーマ一覧表

## 目的

この文書は、標準 mdrj の JSON 構造をパス単位で整理した一覧表です。

- 基準: 現行 saveAsMDRJ 実装
- 補助根拠: SetDataFromMDRJ の復元処理
- 対象: 標準 mdrj
- 参考: mdrmj との差分は末尾に記載

## 前提

saveAsMDRJ は class instance を DTO に変換せず、そのまま JSON.stringify しています。したがって、この一覧表は「現在の主要項目」を整理したものであり、特に ViewStyle や runtime helper を持つオブジェクトにはバージョン差分で追加キーが出る可能性があります。

## ルート擬似スキーマ

```json
{
  "TotalData": {
    "LV1": {},
    "TotalMode": {},
    "ViewStyle": {},
    "FigureStac": [],
    "Condition": []
  },
  "LayerData": [
    {
      "Name": "",
      "MapFileName": "",
      "Shape": 0,
      "Type": 0,
      "MeshType": 0,
      "ReferenceSystem": 0,
      "Time": {},
      "Comment": "",
      "TripTimeSpan": {},
      "TripType": 0,
      "atrObject": {},
      "atrData": {},
      "Dummy": [],
      "DummyGroup": [],
      "Print_Mode_Layer": 0,
      "LayerModeViewSettings": {},
      "ObjectGroupRelatedLine": [],
      "ODBezier_DataStac": []
    }
  ],
  "saveLPat": {
    "MapNum": 0,
    "MapFileName": [],
    "LpatNumByMapfile": [],
    "Lpat": []
  }
}
```

## 再利用型

### 基本型

| 型名 | JSON 形 | 主なフィールド | 元クラス |
| --- | --- | --- | --- |
| point | object | x, y, Tag? | point |
| rectangle | object | left, right, top, bottom | rectangle |
| latlon | object | lat, lon | latlon |
| strYMD | object | Year, Month, Day | strYMD |
| colorRGBA | object | r, g, b, a | colorRGBA |

### 描画共通型

| 型名 | JSON 形 | 主なフィールド | 元クラス |
| --- | --- | --- | --- |
| LineEdge | object | lineCap, lineJoin, miterLimit | LineEdge_Connect_Pattern_Data_Info |
| Line_Property | object | BlankF, Width, Color, Edge_Connect_Pattern | Line_Property |
| Tile_Property | object | BlankF, Color | Tile_Property |
| BackGround_Box_Property | object | Tile, Line, Round?, Padding? | BackGround_Box_Property |
| Font_Property | object | Color, Size, italic, bold, Underline, Name, Kakudo, FringeF, FringeWidth, FringeColor, Back | Font_Property |
| Mark_Property | object | PrintMark, ShapeNumber, Tile, Line, wordmark, WordFont | Mark_Property |
| Zahyo_info | object | Mode, System, HeimenTyokkaku_KEI_Number, Projection, CenterXY | Zahyo_info |

## 1. ルート

| JSON Path | 型 | 保存元 | 説明 | 備考 |
| --- | --- | --- | --- | --- |
| $ | object | saveAsMDRJ 内の savedata | mdrj 全体 | 標準 mdrj は 3 キー構成 |
| $.TotalData | object | this.TotalData | 属性データ全体の共通設定 | Total_Data_Info |
| $.LayerData | array<object> | this.LayerData | レイヤ配列 | strLayerDataInfo[] |
| $.saveLPat | object | saveLPat | 地図線種差分 | strSaveLinePat_Info |

## 2. TotalData

| JSON Path | 型 | 保存元 | 説明 | 備考 |
| --- | --- | --- | --- | --- |
| $.TotalData | object | clsAttrData.TotalData | 全体データ本体 | Total_Data_Info |
| $.TotalData.LV1 | object | TotalData.LV1 | 基本情報 | strBasic_Data |
| $.TotalData.TotalMode | object | TotalData.TotalMode | 重ね合わせ・連続表示設定 | strTotalMode_Info |
| $.TotalData.ViewStyle | object | TotalData.ViewStyle | 全体表示設定 | strViewStyle_Info |
| $.TotalData.FigureStac | array<object> | TotalData.FigureStac | 図形スタック | 実装上は保存対象 |
| $.TotalData.Condition | array<object> | TotalData.Condition | 条件設定配列 | strCondition_DataSet_Info[] |

### 2.1 TotalData.LV1

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.TotalData.LV1.Lay_Maxn | number | LV1.Lay_Maxn | レイヤ数 |
| $.TotalData.LV1.SelectedLayer | number | LV1.SelectedLayer | 選択中レイヤ番号 |
| $.TotalData.LV1.Print_Mode_Total | number | LV1.Print_Mode_Total | 全体表示モード |
| $.TotalData.LV1.Comment | string | LV1.Comment | コメント |
| $.TotalData.LV1.MDRFileVersion | number | LV1.MDRFileVersion | ファイルバージョン |
| $.TotalData.LV1.FileName | string | LV1.FileName | ファイル名 |
| $.TotalData.LV1.FullPath | string | LV1.FullPath | 元パス |
| $.TotalData.LV1.DataSourceType | number | LV1.DataSourceType | データソース種別 |

### 2.2 TotalData.TotalMode

| JSON Path | 型 | 保存元 | 説明 | 備考 |
| --- | --- | --- | --- | --- |
| $.TotalData.TotalMode.OverLay | object | TotalMode.OverLay | 重ね合わせ設定 | DataSet を持つ |
| $.TotalData.TotalMode.OverLay.SelectedIndex | number | OverLay.SelectedIndex | 選択中セット |
| $.TotalData.TotalMode.OverLay.Always_Overlay_Index | number | OverLay.Always_Overlay_Index | 常時重ね合わせ対象 |
| $.TotalData.TotalMode.OverLay.DataSet | array<object> | OverLay.DataSet | 重ね合わせセット配列 | strOverLay_Dataset_Info[] |
| $.TotalData.TotalMode.OverLay.DataSet[].title | string | DataSet[].title | セット名 |
| $.TotalData.TotalMode.OverLay.DataSet[].SelectedIndex | number | DataSet[].SelectedIndex | 選択項目 |
| $.TotalData.TotalMode.OverLay.DataSet[].Note | string | DataSet[].Note | 注記 |
| $.TotalData.TotalMode.OverLay.DataSet[].DataItem | array<object> | DataSet[].DataItem | データ項目配列 |
| $.TotalData.TotalMode.Series | object | TotalMode.Series | 連続表示設定 | DataSet を持つ |
| $.TotalData.TotalMode.Series.SelectedIndex | number | Series.SelectedIndex | 選択中セット |
| $.TotalData.TotalMode.Series.DataSet | array<object> | Series.DataSet | 連続表示セット配列 | strSeries_Dataset_Info[] |
| $.TotalData.TotalMode.Series.DataSet[].title | string | DataSet[].title | セット名 |
| $.TotalData.TotalMode.Series.DataSet[].SelectedIndex | number | DataSet[].SelectedIndex | 選択項目 |
| $.TotalData.TotalMode.Series.DataSet[].DataItem | array<object> | DataSet[].DataItem | データ項目配列 |

### 2.3 TotalData.ViewStyle

| JSON Path | 型 | 保存元 | 説明 | 備考 |
| --- | --- | --- | --- | --- |
| $.TotalData.ViewStyle.ScrData | object | ViewStyle.ScrData | 画面座標と出力関連設定 | Screen_info。実行時追加キーが出ることあり |
| $.TotalData.ViewStyle.MapScale | object | ViewStyle.MapScale | 縮尺表示設定 | 位置、書体、背景、単位など |
| $.TotalData.ViewStyle.MapTitle | object | ViewStyle.MapTitle | 地図タイトル設定 | 位置、フォント、表示可否 |
| $.TotalData.ViewStyle.DataNote | object | ViewStyle.DataNote | データ注記設定 | 位置、フォント、背景 |
| $.TotalData.ViewStyle.AttMapCompass | object | ViewStyle.AttMapCompass | 方位記号設定 | 地図コンパス |
| $.TotalData.ViewStyle.MapLegend | object | ViewStyle.MapLegend | 凡例設定 | Base, ClassMD, MarkMD など |
| $.TotalData.ViewStyle.FigureVisible | boolean | ViewStyle.FigureVisible | 図形表示可否 | FigureStac と連動 |
| $.TotalData.ViewStyle.AccessoryGroupBox | object | ViewStyle.AccessoryGroupBox | 周辺表示枠設定 | タイトル、凡例、注記などの囲み |
| $.TotalData.ViewStyle.Missing_Data | object | ViewStyle.Missing_Data | 欠損値表示設定 | 文字、記号、塗りなど |
| $.TotalData.ViewStyle.Screen_Back | object | ViewStyle.Screen_Back | 背景・地図枠設定 | 画面背景、地図領域背景 |
| $.TotalData.ViewStyle.SymbolLine | object | ViewStyle.SymbolLine | 記号位置補助線設定 | Visible, Line |
| $.TotalData.ViewStyle.Trip_Line | object | ViewStyle.Trip_Line | 移動表示線設定 | 未定義型のまま保存されうる |
| $.TotalData.ViewStyle.PointPaint_Order | number | ViewStyle.PointPaint_Order | 点オブジェクト描画順 | |
| $.TotalData.ViewStyle.Dummy_Size_Flag | boolean | ViewStyle.Dummy_Size_Flag | ダミーサイズ利用可否 | |
| $.TotalData.ViewStyle.MeshLine | object | ViewStyle.MeshLine | メッシュ境界線 | Line_Property |
| $.TotalData.ViewStyle.TileLicenceFont | object | ViewStyle.TileLicenceFont | タイルライセンス表示フォント | Font_Property |
| $.TotalData.ViewStyle.ObjectLimitationF | boolean | ViewStyle.ObjectLimitationF | オブジェクト制限有無 | |
| $.TotalData.ViewStyle.InVisibleObjectBoundaryF | boolean | ViewStyle.InVisibleObjectBoundaryF | 非表示境界描画可否 | |
| $.TotalData.ViewStyle.DummyObjectPointMark | object | ViewStyle.DummyObjectPointMark | 地図ファイル別ダミー点記号 | key は MapFileName |
| $.TotalData.ViewStyle.MapPrint_Flag | boolean | ViewStyle.MapPrint_Flag | 地図印刷フラグ | |
| $.TotalData.ViewStyle.LatLonLine_Print | object | ViewStyle.LatLonLine_Print | 緯度経度線表示設定 | Visible, Order, LPat 等 |
| $.TotalData.ViewStyle.SouByou | object | ViewStyle.SouByou | 総描設定 | 自動・間引きなど |
| $.TotalData.ViewStyle.TileMapView | object | ViewStyle.TileMapView | タイル地図表示設定 | Visible, AlphaValue 等 |
| $.TotalData.ViewStyle.Screen_Setting | array<object> | ViewStyle.Screen_Setting | 画面設定プリセット | |
| $.TotalData.ViewStyle.ValueShow | object | ViewStyle.ValueShow | 値表示設定 | 値フォント、小数点設定等 |
| $.TotalData.ViewStyle.Zahyo | object | ViewStyle.Zahyo | 座標系設定 | Zahyo_info |

### 2.4 ViewStyle.ScrData の主要キー

| JSON Path | 型 | 説明 | 備考 |
| --- | --- | --- | --- |
| $.TotalData.ViewStyle.ScrData.ScrView | rectangle | 表示領域 | loader で復元 |
| $.TotalData.ViewStyle.ScrData.ScrRectangle | rectangle | 画面矩形 | loader で復元 |
| $.TotalData.ViewStyle.ScrData.MapRectangle | rectangle | 地図矩形 | loader で復元 |
| $.TotalData.ViewStyle.ScrData.MapScreen_Scale | rectangle | 地図と画面の対応 | loader で復元 |
| $.TotalData.ViewStyle.ScrData.ScreenMG | object | 画面倍率係数 | Object.assign で復元 |
| $.TotalData.ViewStyle.ScrData.PrinterMG | object | 印刷倍率係数 | Object.assign で復元 |
| $.TotalData.ViewStyle.ScrData.Screen_Margin | object | 余白設定 | rect と ClipF |
| $.TotalData.ViewStyle.ScrData.frmPrint_FormSize | rectangle | 印刷フォームサイズ | loader で復元 |
| $.TotalData.ViewStyle.ScrData.ThreeDMode | object | 3D 表示設定 | loader で復元 |
| $.TotalData.ViewStyle.ScrData.Accessory_Base | number | 飾りの基準位置 | loader で復元 |
| $.TotalData.ViewStyle.ScrData.GSMul | number | 拡大率 | loader で復元 |

### 2.5 ViewStyle の代表的な下位構造

| JSON Path | 型 | 説明 |
| --- | --- | --- |
| $.TotalData.ViewStyle.MapScale.Position | point | 縮尺表示位置 |
| $.TotalData.ViewStyle.MapScale.Font | Font_Property | 縮尺文字フォント |
| $.TotalData.ViewStyle.MapScale.Back | BackGround_Box_Property | 縮尺背景 |
| $.TotalData.ViewStyle.MapTitle.Position | point | タイトル位置 |
| $.TotalData.ViewStyle.MapTitle.Font | Font_Property | タイトルフォント |
| $.TotalData.ViewStyle.DataNote.Position | point | 注記位置 |
| $.TotalData.ViewStyle.DataNote.Font | Font_Property | 注記フォント |
| $.TotalData.ViewStyle.MapLegend.Base | object | 凡例基本設定 |
| $.TotalData.ViewStyle.MapLegend.ClassMD | object | 階級モード凡例設定 |
| $.TotalData.ViewStyle.MapLegend.MarkMD | object | 記号モード凡例設定 |
| $.TotalData.ViewStyle.MapLegend.Line_DummyKind | object | 線種・ダミー凡例設定 |
| $.TotalData.ViewStyle.Missing_Data.PaintTile | Tile_Property | 欠損値塗り |
| $.TotalData.ViewStyle.Missing_Data.Mark | Mark_Property | 欠損値記号 |
| $.TotalData.ViewStyle.Missing_Data.LineShape | Line_Property | 欠損値線設定 |
| $.TotalData.ViewStyle.Screen_Back.MapAreaFrameLine | Line_Property | 地図領域枠線 |
| $.TotalData.ViewStyle.Screen_Back.ScreenFrameLine | Line_Property | 画面枠線 |
| $.TotalData.ViewStyle.Screen_Back.ScreenAreaBack | Tile_Property | 画面背景 |
| $.TotalData.ViewStyle.Screen_Back.MapAreaBack | Tile_Property | 地図背景 |
| $.TotalData.ViewStyle.SymbolLine.Line | Line_Property | 記号補助線 |
| $.TotalData.ViewStyle.LatLonLine_Print.LPat | Line_Property | 緯経線パターン |
| $.TotalData.ViewStyle.LatLonLine_Print.OuterPat | Line_Property | 外枠パターン |
| $.TotalData.ViewStyle.LatLonLine_Print.Equator | Line_Property | 赤道パターン |
| $.TotalData.ViewStyle.ValueShow.ValueFont | Font_Property | 値フォント |
| $.TotalData.ViewStyle.ValueShow.ObjNameFont | Font_Property | オブジェクト名フォント |
| $.TotalData.ViewStyle.Zahyo.CenterXY | point | 座標系中心 |

### 2.6 TotalData.Condition

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.TotalData.Condition[] | object | Condition[] | 条件セット 1 件 |
| $.TotalData.Condition[].Enabled | boolean | Enabled | 条件有効フラグ |
| $.TotalData.Condition[].Layer | number | Layer | 対象レイヤ |
| $.TotalData.Condition[].Name | string | Name | 条件名 |
| $.TotalData.Condition[].Condition_Class | array<object> | Condition_Class | 条件段階配列 |
| $.TotalData.Condition[].Condition_Class[].And_OR | number | And_OR | AND / OR |
| $.TotalData.Condition[].Condition_Class[].Condition | array<object> | Condition | 制約配列 |

### 2.7 TotalData.FigureStac

| JSON Path | 型 | 保存元 | 説明 | 備考 |
| --- | --- | --- | --- | --- |
| $.TotalData.FigureStac[] | object | FigureStac[] | 図形データ | 使用時のみ |
| $.TotalData.FigureStac[].StringPos | array<point> | FigureData.StringPos | 文字図形位置 |
| $.TotalData.FigureStac[].Points | array<point> | FigureData.Points | 線・点図形座標 |
| $.TotalData.FigureStac[].NumOfPoint | number | FigureData.NumOfPoint | 線図形点数 |
| $.TotalData.FigureStac[].Position | point | FigureData.Position | 円・点図形位置 |

## 3. LayerData[]

| JSON Path | 型 | 保存元 | 説明 | 備考 |
| --- | --- | --- | --- | --- |
| $.LayerData[] | object | this.LayerData[i] | レイヤ 1 件 | strLayerDataInfo |
| $.LayerData[].Name | string | LayerData[i].Name | レイヤ名 | |
| $.LayerData[].MapFileName | string | LayerData[i].MapFileName | 対応地図ファイル名 | |
| $.LayerData[].MapFileData | omitted | LayerData[i].MapFileData | 地図本体参照 | 保存前に undefined 化 |
| $.LayerData[].MapFileObjectNameSearch | object | LayerData[i].MapFileObjectNameSearch | オブジェクト名検索補助 | 古いサンプルでは {} が出現 |
| $.LayerData[].Shape | number | LayerData[i].Shape | レイヤ形状種別 | |
| $.LayerData[].Type | number | LayerData[i].Type | レイヤ種別 | |
| $.LayerData[].MeshType | number | LayerData[i].MeshType | メッシュ種別 | |
| $.LayerData[].ReferenceSystem | number | LayerData[i].ReferenceSystem | 参照座標系 | 新しめの実装項目 |
| $.LayerData[].Time | strYMD | LayerData[i].Time | 時間情報 | |
| $.LayerData[].Comment | string | LayerData[i].Comment | コメント | |
| $.LayerData[].TripTimeSpan | object | LayerData[i].TripTimeSpan | 移動時間範囲 | 未定義型のまま保存されうる |
| $.LayerData[].TripType | number | LayerData[i].TripType | 移動位置種別 | 新しめの実装項目 |
| $.LayerData[].atrObject | object | LayerData[i].atrObject | レイヤのオブジェクト情報 | strObject_Info |
| $.LayerData[].atrData | object | LayerData[i].atrData | 属性項目情報 | stratrData_Info |
| $.LayerData[].Dummy | array<object> | LayerData[i].Dummy | ダミーオブジェクト配列 | |
| $.LayerData[].DummyGroup | array<number> | LayerData[i].DummyGroup | ダミーオブジェクトグループ | |
| $.LayerData[].Print_Mode_Layer | number | LayerData[i].Print_Mode_Layer | レイヤ表示モード | |
| $.LayerData[].LayerModeViewSettings | object | LayerData[i].LayerModeViewSettings | ラベル・グラフ等設定 | strLayerModeViewSetting_Data |
| $.LayerData[].PrtSpatialIndex | object | LayerData[i].PrtSpatialIndex | 空間検索補助 | 古いサンプルでは {} が出現 |
| $.LayerData[].ObjectGroupRelatedLine | array<number> | LayerData[i].ObjectGroupRelatedLine | 線種関連情報 | runtime 生成値が出力されうる |
| $.LayerData[].ODBezier_DataStac | array<object> | LayerData[i].ODBezier_DataStac | ベジェ補助点 | |

### 3.1 LayerData[].atrObject

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.LayerData[].atrObject.ObjectNum | number | atrObject.ObjectNum | オブジェクト数 |
| $.LayerData[].atrObject.NumOfSyntheticObj | number | atrObject.NumOfSyntheticObj | 合成オブジェクト数 |
| $.LayerData[].atrObject.atrObjectData | array<object> | atrObject.atrObjectData | 個別オブジェクト配列 |
| $.LayerData[].atrObject.MPSyntheticObj | array<object> | atrObject.MPSyntheticObj | 合成オブジェクト配列 |
| $.LayerData[].atrObject.TripObjData | array<object> | atrObject.TripObjData | 移動データ配列 |

### 3.2 LayerData[].atrObject.atrObjectData[]

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.LayerData[].atrObject.atrObjectData[].MpObjCode | number | MpObjCode | 地図オブジェクトコード |
| $.LayerData[].atrObject.atrObjectData[].Name | string | Name | オブジェクト名 |
| $.LayerData[].atrObject.atrObjectData[].Objectstructure | number | Objectstructure | 構造種別 |
| $.LayerData[].atrObject.atrObjectData[].HyperLinkNum | number | HyperLinkNum | ハイパーリンク数 |
| $.LayerData[].atrObject.atrObjectData[].HyperLink | array<object> | HyperLink | URL 配列 |
| $.LayerData[].atrObject.atrObjectData[].HyperLink[].Name | string | HyperLink[].Name | 表示名 |
| $.LayerData[].atrObject.atrObjectData[].HyperLink[].Address | string | HyperLink[].Address | URL |
| $.LayerData[].atrObject.atrObjectData[].CenterPoint | point | CenterPoint | 代表点 |
| $.LayerData[].atrObject.atrObjectData[].Symbol | point | Symbol | 記号位置 |
| $.LayerData[].atrObject.atrObjectData[].Label | point | Label | ラベル位置 |
| $.LayerData[].atrObject.atrObjectData[].defPoint | latlon | defPoint | 元の緯度経度 |
| $.LayerData[].atrObject.atrObjectData[].MeshRect | rectangle | MeshRect | メッシュ矩形 |
| $.LayerData[].atrObject.atrObjectData[].MeshPoint | array<point> | MeshPoint | メッシュ多角形点列 |
| $.LayerData[].atrObject.atrObjectData[].Visible | boolean | Visible | 表示可否 |

### 3.3 LayerData[].atrObject.MPSyntheticObj[]

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.LayerData[].atrObject.MPSyntheticObj[].Kind | number | Kind | 合成種別 |
| $.LayerData[].atrObject.MPSyntheticObj[].NumOfObject | number | NumOfObject | 構成要素数 |
| $.LayerData[].atrObject.MPSyntheticObj[].Name | string | Name | 合成オブジェクト名 |
| $.LayerData[].atrObject.MPSyntheticObj[].CenterP | point | CenterP | 中心位置 |
| $.LayerData[].atrObject.MPSyntheticObj[].SETime | object | SETime | 開始終了時間 |
| $.LayerData[].atrObject.MPSyntheticObj[].Shape | number | Shape | 形状種別 |
| $.LayerData[].atrObject.MPSyntheticObj[].Circumscribed_Rectangle | rectangle | Circumscribed_Rectangle | 外接矩形 |
| $.LayerData[].atrObject.MPSyntheticObj[].Objects | array<object> | Objects | 構成オブジェクト配列 |
| $.LayerData[].atrObject.MPSyntheticObj[].Objects[].code | number | code | 構成オブジェクトコード |
| $.LayerData[].atrObject.MPSyntheticObj[].Objects[].Name | string | Name | 構成オブジェクト名 |
| $.LayerData[].atrObject.MPSyntheticObj[].Objects[].Draw_F | boolean | Draw_F | 描画対象可否 |

### 3.4 LayerData[].atrData

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.LayerData[].atrData.Count | number | atrData.Count | 属性項目数 |
| $.LayerData[].atrData.SelectedIndex | number | atrData.SelectedIndex | 選択中データ項目 |
| $.LayerData[].atrData.Data | array<object> | atrData.Data | 属性項目配列 |

### 3.5 LayerData[].atrData.Data[]

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.LayerData[].atrData.Data[].Title | string | Title | 項目名 |
| $.LayerData[].atrData.Data[].Unit | string | Unit | 単位 |
| $.LayerData[].atrData.Data[].MissingF | boolean | MissingF | 欠損項目フラグ |
| $.LayerData[].atrData.Data[].Note | string | Note | 注記 |
| $.LayerData[].atrData.Data[].DataType | number | DataType | データ型 |
| $.LayerData[].atrData.Data[].MissingValueNum | number | MissingValueNum | 欠損数 |
| $.LayerData[].atrData.Data[].EnableValueNum | number | EnableValueNum | 有効数 |
| $.LayerData[].atrData.Data[].Statistics | object | Statistics | 統計情報 |
| $.LayerData[].atrData.Data[].ModeData | number | ModeData | 表示モード |
| $.LayerData[].atrData.Data[].SoloModeViewSettings | object | SoloModeViewSettings | 単独表示モード設定 |
| $.LayerData[].atrData.Data[].Value | array<string\|number\|null> | Value | 実データ配列 |

### 3.6 LayerData[].atrData.Data[].Statistics

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.LayerData[].atrData.Data[].Statistics.Max | number | Statistics.Max | 最大値 |
| $.LayerData[].atrData.Data[].Statistics.Min | number | Statistics.Min | 最小値 |
| $.LayerData[].atrData.Data[].Statistics.Ave | number | Statistics.Ave | 平均 |
| $.LayerData[].atrData.Data[].Statistics.STD | number | Statistics.STD | 標準偏差 |
| $.LayerData[].atrData.Data[].Statistics.Sum | number | Statistics.Sum | 合計 |
| $.LayerData[].atrData.Data[].Statistics.sa | number | Statistics.sa | 補助統計値 |
| $.LayerData[].atrData.Data[].Statistics.BeforeDecimalNum | number | Statistics.BeforeDecimalNum | 整数桁数 |
| $.LayerData[].atrData.Data[].Statistics.AfterDecimalNum | number | Statistics.AfterDecimalNum | 小数桁数 |

### 3.7 LayerData[].atrData.Data[].SoloModeViewSettings

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.SoloMode | number | SoloMode | 単独表示モード種別 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.Div_Num | number | Div_Num | 階級数 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.Div_Method | number | Div_Method | 階級分割方法 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.ClassPaintMD | object | ClassPaintMD | 階級ペイント設定 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.MarkCommon | object | MarkCommon | 記号共通設定 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.MarkSizeMD | object | MarkSizeMD | 記号サイズ設定 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.MarkBlockMD | object | MarkBlockMD | 記号数設定 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.MarkBarMD | object | MarkBarMD | 棒記号設定 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.StringMD | object | StringMD | 文字表示設定 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.ContourMD | object | ContourMD | 等値線設定 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.ClassODMD | object | ClassODMD | OD 線設定 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.ClassMarkMD | object | ClassMarkMD | 階級記号設定 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.MarkTurnMD | object | MarkTurnMD | 回転記号設定 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.Class_Div | array<object> | Class_Div | 階級区分配列 |

### 3.8 SoloModeViewSettings の代表下位項目

| JSON Path | 型 | 説明 |
| --- | --- | --- |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.ClassPaintMD.color1 | colorRGBA | 階級色 1 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.ClassPaintMD.color2 | colorRGBA | 階級色 2 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.ClassPaintMD.color3 | colorRGBA | 階級色 3 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.MarkCommon.Inner_Data | object | 内部データ利用 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.MarkCommon.MinusTile | Tile_Property | マイナス値塗り |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.MarkSizeMD.Mark | Mark_Property | サイズ記号本体 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.MarkSizeMD.LineShape | object | 線形状データ |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.MarkBlockMD.Mark | Mark_Property | ブロック記号 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.MarkBarMD.InnerTile | Tile_Property | 棒内部塗り |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.MarkBarMD.FrameLinePat | Line_Property | 棒枠線 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.MarkBarMD.scaleLinePat | Line_Property | 目盛線 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.StringMD.Font | Font_Property | 文字フォント |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.ContourMD.Regular | object | 等間隔等値線設定 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.ContourMD.Irregular | array<object> | 不等間隔等値線配列 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.ClassODMD.Arrow | object | 矢印設定 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.MarkTurnMD.Mark | Mark_Property | 回転記号 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.Class_Div[].Value | number | 階級値 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.Class_Div[].PaintColor | colorRGBA | 階級色 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.Class_Div[].ClassMark | Mark_Property | 階級記号 |
| $.LayerData[].atrData.Data[].SoloModeViewSettings.Class_Div[].ODLinePat | Line_Property | OD 線パターン |

### 3.9 LayerData[].Dummy と DummyGroup

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.LayerData[].Dummy[] | object | Dummy[] | ダミーオブジェクト 1 件 |
| $.LayerData[].Dummy[].code | number | code | オブジェクトコード |
| $.LayerData[].Dummy[].Name | string | Name | オブジェクト名 |
| $.LayerData[].DummyGroup[] | number | DummyGroup[] | オブジェクトグループ番号 |

### 3.10 LayerData[].LayerModeViewSettings

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.LayerData[].LayerModeViewSettings.LabelMode | object | LabelMode | ラベルモード全体 |
| $.LayerData[].LayerModeViewSettings.GraphMode | object | GraphMode | グラフモード全体 |
| $.LayerData[].LayerModeViewSettings.PointLineShape | object | PointLineShape | 点・線の描画設定 |
| $.LayerData[].LayerModeViewSettings.PolygonDummy_ClipSet_F | boolean | PolygonDummy_ClipSet_F | ポリゴンダミーのクリップ設定 |

### 3.11 LayerModeViewSettings.LabelMode

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.LayerData[].LayerModeViewSettings.LabelMode.SelectedIndex | number | SelectedIndex | 選択中ラベルセット |
| $.LayerData[].LayerModeViewSettings.LabelMode.DataSet | array<object> | DataSet | ラベルセット配列 |
| $.LayerData[].LayerModeViewSettings.LabelMode.DataSet[].title | string | title | セット名 |
| $.LayerData[].LayerModeViewSettings.LabelMode.DataSet[].Location_Mark_Flag | boolean | Location_Mark_Flag | 位置記号表示 |
| $.LayerData[].LayerModeViewSettings.LabelMode.DataSet[].Location_Mark | Mark_Property | Location_Mark | 位置記号 |
| $.LayerData[].LayerModeViewSettings.LabelMode.DataSet[].Width | number | Width | 幅 |
| $.LayerData[].LayerModeViewSettings.LabelMode.DataSet[].DataItem | array<number> | DataItem | 対象データ番号 |
| $.LayerData[].LayerModeViewSettings.LabelMode.DataSet[].DataValue_Font | Font_Property | DataValue_Font | 値フォント |
| $.LayerData[].LayerModeViewSettings.LabelMode.DataSet[].DataValue_Unit_Flag | boolean | DataValue_Unit_Flag | 単位表示 |
| $.LayerData[].LayerModeViewSettings.LabelMode.DataSet[].DataValue_TurnFlag | boolean | DataValue_TurnFlag | 回転可否 |
| $.LayerData[].LayerModeViewSettings.LabelMode.DataSet[].DataValue_Print_Flag | boolean | DataValue_Print_Flag | 値表示可否 |
| $.LayerData[].LayerModeViewSettings.LabelMode.DataSet[].DataName_Print_Flag | boolean | DataName_Print_Flag | 項目名表示可否 |
| $.LayerData[].LayerModeViewSettings.LabelMode.DataSet[].ObjectName_Font | Font_Property | ObjectName_Font | オブジェクト名フォント |
| $.LayerData[].LayerModeViewSettings.LabelMode.DataSet[].ObjectName_Turn_Flag | boolean | ObjectName_Turn_Flag | オブジェクト名回転 |
| $.LayerData[].LayerModeViewSettings.LabelMode.DataSet[].ObjectName_Print_Flag | boolean | ObjectName_Print_Flag | オブジェクト名表示 |
| $.LayerData[].LayerModeViewSettings.LabelMode.DataSet[].BorderObjectTile | Tile_Property | BorderObjectTile | オブジェクト名背景 |
| $.LayerData[].LayerModeViewSettings.LabelMode.DataSet[].BorderDataTile | Tile_Property | BorderDataTile | 値背景 |
| $.LayerData[].LayerModeViewSettings.LabelMode.DataSet[].BorderLine | Line_Property | BorderLine | 枠線 |

### 3.12 LayerModeViewSettings.GraphMode

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.LayerData[].LayerModeViewSettings.GraphMode.SelectedIndex | number | SelectedIndex | 選択中グラフセット |
| $.LayerData[].LayerModeViewSettings.GraphMode.DataSet | array<object> | DataSet | グラフセット配列 |
| $.LayerData[].LayerModeViewSettings.GraphMode.DataSet[].title | string | title | セット名 |
| $.LayerData[].LayerModeViewSettings.GraphMode.DataSet[].GraphMode | number | GraphMode | グラフ種別 |
| $.LayerData[].LayerModeViewSettings.GraphMode.DataSet[].Data | array<object> | Data | グラフ対象項目配列 |
| $.LayerData[].LayerModeViewSettings.GraphMode.DataSet[].Data[].DataNumber | number | DataNumber | 対象データ番号 |
| $.LayerData[].LayerModeViewSettings.GraphMode.DataSet[].Data[].Tile | Tile_Property | Tile | 塗り設定 |
| $.LayerData[].LayerModeViewSettings.GraphMode.DataSet[].En_Obi | object | En_Obi | 円・帯グラフ設定 |
| $.LayerData[].LayerModeViewSettings.GraphMode.DataSet[].Oresen_Bou | object | Oresen_Bou | 折れ線・棒グラフ設定 |
| $.LayerData[].LayerModeViewSettings.GraphMode.DataSet[].En_Obi.BoaderLine | Line_Property | BoaderLine | 境界線 |
| $.LayerData[].LayerModeViewSettings.GraphMode.DataSet[].Oresen_Bou.Line | Line_Property | Line | 線設定 |
| $.LayerData[].LayerModeViewSettings.GraphMode.DataSet[].Oresen_Bou.BackgroundTile | Tile_Property | BackgroundTile | 背景塗り |
| $.LayerData[].LayerModeViewSettings.GraphMode.DataSet[].Oresen_Bou.BorderLine | Line_Property | BorderLine | 枠線 |

### 3.13 LayerModeViewSettings.PointLineShape

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.LayerData[].LayerModeViewSettings.PointLineShape.LineWidth | number | LineWidth | 線幅 |
| $.LayerData[].LayerModeViewSettings.PointLineShape.LineEdge | object | LineEdge | 線端・接合設定 |
| $.LayerData[].LayerModeViewSettings.PointLineShape.PointMark | Mark_Property | PointMark | 点記号 |

### 3.14 LayerData[].ODBezier_DataStac[]

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.LayerData[].ODBezier_DataStac[].ObjectPos | number | ObjectPos | オブジェクト位置 |
| $.LayerData[].ODBezier_DataStac[].Data | number | Data | データ番号 |
| $.LayerData[].ODBezier_DataStac[].Point | point | Point | ベジェ参照点 |
| $.LayerData[].ODBezier_DataStac[].Name | string | Name | 名称 |

## 4. saveLPat

| JSON Path | 型 | 保存元 | 説明 | 備考 |
| --- | --- | --- | --- | --- |
| $.saveLPat.MapNum | number | saveLPat.MapNum | 地図ファイル数 | |
| $.saveLPat.MapFileName | array<string> | saveLPat.MapFileName | 地図ファイル名配列 | |
| $.saveLPat.LpatNumByMapfile | array<number> | saveLPat.LpatNumByMapfile | 地図ごとの線種数 | |
| $.saveLPat.Lpat | array<object> | saveLPat.Lpat | 線種スナップショット配列 | clsMapdata.LineKind 由来 |

### 4.1 saveLPat.Lpat[]

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.saveLPat.Lpat[].Name | string | LineKind.Name | 線種名 |
| $.saveLPat.Lpat[].NumofObjectGroup | number | LineKind.NumofObjectGroup | オブジェクトグループ数 |
| $.saveLPat.Lpat[].Mesh | boolean | LineKind.Mesh | メッシュ線種フラグ |
| $.saveLPat.Lpat[].ObjGroup | array<object> | LineKind.ObjGroup | グループ別パターン |

### 4.2 saveLPat.Lpat[].ObjGroup[]

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.saveLPat.Lpat[].ObjGroup[].GroupNumber | number | ObjGroup[].GroupNumber | オブジェクトグループ番号 |
| $.saveLPat.Lpat[].ObjGroup[].UseOnly | boolean | ObjGroup[].UseOnly | 利用制限フラグ |
| $.saveLPat.Lpat[].ObjGroup[].Pattern | Line_Property | ObjGroup[].Pattern | 線パターン |

## 5. 実装上の注意点

### 5.1 標準 mdrj に mapData は入らない

標準 mdrj の保存時、ルートに mapData は追加されません。mapData が追加されるのは mdrmj のみです。

### 5.2 loader が主要契約を決めている

save 側は広めに JSON 化しますが、復元で実際に意味を持つのは SetDataFromMDRJ と cnvLayerData が読み取る項目です。仕様として利用する場合は、save 側と load 側の両方を確認する必要があります。

### 5.3 古い実ファイルとの差異

既存の古いサンプル mdrj には、次のような差異がありえます。

- 現行クラスにある新規プロパティが出現しない
- runtime helper が空オブジェクトとして残る
- ViewStyle.ScrData に runtime 由来の補助キーが追加される

そのため、厳密な互換仕様としては「必須項目」と「保存されうる項目」を分けて扱うのが安全です。

## 6. mdrmj 差分

mdrmj は標準 mdrj の全キーに加えて、以下を持ちます。

| JSON Path | 型 | 保存元 | 説明 |
| --- | --- | --- | --- |
| $.mapData | object | this.MapData.getAllMapData() | 地図本体辞書 |
| $.mapData.<MAPFILENAME> | object | clsMapdata | 地図ファイル本体 JSON |
