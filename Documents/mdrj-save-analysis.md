# MANDARA WebGIS mdrj 保存処理分析

## 対象

この文書は、mandarawebgis.html で起動される画面の「ファイル」→「属性データ保存」で生成される標準 mdrj ファイルを対象にした分析結果を整理したものです。

- 対象: 標準 mdrj
- 比較対象: mdrmj
- 対象コード: clsWindow.ts, clsAttrData.ts, clsGeneric.ts, zlibrev.ts

## 結論

標準 mdrj の保存元は state.attrData です。これは clsAttrData のインスタンスで、作業中の属性データ全体を保持しています。

保存時には clsAttrData の以下が JSON 化され、ZIP 圧縮されます。

- TotalData
- LayerData
- saveLPat

標準 mdrj では地図本体は保存されません。地図本体を含むのは mdrmj のみです。

## 呼び出し経路

### 1. メニュー登録

ファイルメニューには以下の 2 項目があります。

- 「属性データ保存」
- 「地図データ付属形式属性データ保存」

実装位置:

- ../src/clsWindow.ts#L143-L144

### 2. 標準 mdrj 保存の入口

標準 mdrj は menuSaveData から保存されます。

- 実装位置: ../src/clsWindow.ts#L969-L986
- 呼び出し: state.attrData.saveAsMDRJ(fname, false)

この false が、標準 mdrj 保存であることを示します。

### 3. mdrmj 保存の入口

地図データ付属形式は menuSaveMDRMJData から保存されます。

- 実装位置: ../src/clsWindow.ts#L988-L995
- 呼び出し: state.attrData.saveAsMDRJ(fname, true)

### 4. 保存本体

保存本体は clsAttrData.saveAsMDRJ に集約されています。

- 実装位置: ../src/clsAttrData.ts#L3758-L3801

この関数は次の順で処理します。

1. 現在保持している地図ファイル一覧から saveLPat を構成する
2. savedata を組み立てる
3. LayerData 内の MapFileData を一時的に undefined にする
4. JSON.stringify(savedata) を行う
5. UTF-8 バイト列に変換する
6. ZIP 圧縮してダウンロードする

### 5. ZIP 圧縮

ZIP 化は Generic.zipFile が担当します。

- 実装位置: ../src/clsGeneric.ts#L2302-L2309

ZIP ライブラリは zlibrev.ts 内の Zlib.Zip です。

- 実装位置: ../src/zlibrev.ts#L2968-L2973

ZIP 内部のファイル名は fname + "in" です。

- 実装位置: ../src/clsAttrData.ts#L3800

## saveAsMDRJ が保存している実データ

saveAsMDRJ は clsAttrData インスタンスの内部状態をほぼそのまま保存しています。

### 1. TotalData

保存元:

- 変数: this.TotalData
- クラス: Total_Data_Info
- 定義位置: ../src/clsAttrData.ts#L1772-L1778

主な内容:

- LV1
- TotalMode
- ViewStyle
- FigureStac
- Condition

### 2. LayerData

保存元:

- 変数: this.LayerData
- クラス: strLayerDataInfo[]
- 定義位置: ../src/clsAttrData.ts#L1344-L1368

主な内容:

- レイヤ基本情報
- オブジェクト情報 atrObject
- 属性値情報 atrData
- ダミーオブジェクト設定
- レイヤ別表示設定 LayerModeViewSettings
- ベジェ補助点 ODBezier_DataStac

保存前に MapFileData は明示的に除外されます。

- 実装位置: ../src/clsAttrData.ts#L3786-L3789

その後、保存処理が終わると MapFileData は復元されます。

- 実装位置: ../src/clsAttrData.ts#L3793-L3795

### 3. saveLPat

saveLPat は JSON 入力用に saveAsMDRJ 内で都度組み立てる補助データです。

- クラス: strSaveLinePat_Info
- 定義位置: ../src/clsAttrData.ts#L2934-L2938

内容:

- MapNum: 地図ファイル数
- MapFileName: 地図ファイル名配列
- LpatNumByMapfile: 地図ごとの線種数
- Lpat: 線種情報のスナップショット

元データは clsMapdata 側の LineKind です。

- 線種グループ定義: ../src/clsMapdata.ts#L441-L448
- 線種本体定義: ../src/clsMapdata.ts#L464-L470

## mdrj と mdrmj の違い

### 標準 mdrj

savedata は以下です。

```json
{
  "TotalData": "this.TotalData",
  "LayerData": "this.LayerData",
  "saveLPat": "saveLPat"
}
```

実装位置:

- ../src/clsAttrData.ts#L3773-L3777

### mdrmj

mdrmj では mapData が追加されます。

```json
{
  "TotalData": "this.TotalData",
  "LayerData": "this.LayerData",
  "saveLPat": "saveLPat",
  "mapData": "this.MapData.getAllMapData()"
}
```

実装位置:

- ../src/clsAttrData.ts#L3779-L3784

標準 mdrj は属性データと表示設定の保存です。地図本体の完全保存ではありません。

## 読み込み側との対応

mdrj 読み込み本体は SetDataFromMDRJ です。

- 実装位置: ../src/clsAttrData.ts#L4914-L5099

この関数は以下を復元します。

- TotalData の主要項目
- LayerData を cnvLayerData で構築
- saveLPat を用いた線種パターン再適用
- mdrmj の場合のみ mapData を読み込み

LayerData の復元処理は cnvLayerData にあります。

- 実装位置: ../src/clsAttrData.ts#L5104-L5346

TotalMode と Condition の復元は以下です。

- cnvTotalmode: ../src/clsAttrData.ts#L5364-L5403
- cnvCondition: ../src/clsAttrData.ts#L5405-L5422

## 変数・クラス対応の要点

### ルート

- state.attrData: 保存元の実体
- clsAttrData: mdrj を生成する中核クラス

### TotalData 系

- Total_Data_Info: 全体データ入れ物
- strBasic_Data: 基本属性情報
- strTotalMode_Info: 重ね合わせ・連続表示設定
- strViewStyle_Info: 画面全体の表示設定
- strCondition_DataSet_Info: 条件設定

### LayerData 系

- strLayerDataInfo: 1 レイヤ全体
- strObject_Info: レイヤ内オブジェクト情報
- strObject_Data_Info: 個別オブジェクト情報
- strSynthetic_Object_Data: 合成オブジェクト情報
- stratrData_Info: 属性項目コンテナ
- strData_info: 属性項目 1 件
- strSoloModeViewSettings_Data: 単独表示モード設定
- strLayerModeViewSetting_Data: ラベル・グラフなどレイヤ別表示設定
- strLabel_Data: ラベル設定 1 件
- strGraph_Data: グラフ設定 1 件
- ODBezier_Data: 線モードベジェ補助点

### 線種差分系

- strSaveLinePat_Info: saveLPat 全体
- LineKind_Data: 地図ファイル側の線種
- strLKOjectGroup_Info: 線種のオブジェクトグループ単位設定

## 実データで確認した事項

data/japan_data.mdrj を展開して確認したところ、トップレベルキーは以下の 3 つでした。

- TotalData
- LayerData
- saveLPat

また、ZIP 内には JSON が 1 ファイルだけ入っており、内部ファイル名は mdrjin 形式でした。

## 注意点

### 1. save 側は class instance をそのまま JSON 化する

saveAsMDRJ は this.TotalData と this.LayerData を明示的な DTO へ詰め替えず、そのまま JSON.stringify しています。そのため、クラスに新しい列挙可能プロパティが追加されると、将来の mdrj にそのまま出力される可能性があります。

### 2. 補助型定義は保存内容の完全定義ではない

MDRJTotalData や MDRJData は最低限の補助型であり、実際の保存内容は this.TotalData と this.LayerData の実インスタンス側で決まります。

### 3. 実サンプルと現行実装には差がありうる

古い mdrj サンプルには、現行クラスに存在するプロパティが入っていない場合があります。逆に、現行実装では runtime helper に由来する空オブジェクトが出力されることがあります。実装ベースの正確な判断は saveAsMDRJ を優先し、互換性判断は SetDataFromMDRJ も併せて確認するのが安全です。

## 参考

- 詳細な JSON パス一覧は mdrj-json-schema.md を参照してください。
