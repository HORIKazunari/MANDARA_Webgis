// import { appState } from './core/AppState';
import { Generic, spatial } from './clsGeneric';
import { BackGround_Box_Property, clsBase, clsTime, Font_Property, Line_Property, LineEdge_Connect_Pattern_Data_Info, Mark_Property, Tile_Property } from './clsTime';
import { SortingSearch } from './SortingSearch';
// import { clsDraw } from './clsDraw';
import { SpatialIndexSearch, GetObjectPointTagInfo } from './SpatialIndexSearch';
import { colorRGBA, cstRectangle_Cross, enmLineConnect, enmMarkPrintType, enmScaleUnit, enmZahyo_System_Info, point, rectangle, Start_End_Time_data, strYMD } from './clsAttrData';
import { Fringe_Line_Info } from './clsPrint';
import { boundArrangeData } from './boundArrangeData';
import { enmShape, enmZahyo_mode_info, SpatialPointType } from './constants/legacyEnums';
import type { JsonObject, JsonValue } from './types';

// 廃止した旧補助データのメモです。
// class Hennyu_Data {
//     code?: number;
//     Name?: string;
//     Time?: strYMD;
//     Part?: boolean;
// }

/**
 * オブジェクトの継承元コードと継承時期を保持します。
 */
class Object_Succession_Data {
    ObjectCode?: number;
    Time: strYMD = new strYMD();

    /**
     * データを複製します。
     *
     * @returns 複製した継承データです。
     */
    Clone(): Object_Succession_Data {
        const d = new Object_Succession_Data();
        d.ObjectCode = this.ObjectCode;
        d.Time = this.Time.Clone();
        return d;
    }
}

/**
 * オブジェクト名の候補と有効期間を保持します。
 */
class Object_NameTimeStac_Data {
    NamesList: string[] = [];
    SETime: Start_End_Time_data = new Start_End_Time_data();

    /**
     * 名前一覧を指定区切り文字で連結します。
     *
     * @param delimiter 連結に使う区切り文字です。
     * @returns 連結した名称文字列です。
     */
    connectNames(delimiter: string = '/'): string {
        return this.NamesList.join(delimiter);
    }

    /**
     * データを複製します。
     *
     * @returns 複製した名称スタックです。
     */
    Clone(): Object_NameTimeStac_Data {
        const o = new Object_NameTimeStac_Data();
        o.SETime = this.SETime.Clone();
        o.NamesList = Generic.ArrayShallowCopy(this.NamesList);
        return o;
    }
}

/**
 * オブジェクト代表点とその有効期間を保持します。
 */
class Object_CenterPoint_Data {
    Position: point = new point();
    SETime: Start_End_Time_data = new Start_End_Time_data();

    /**
     * データを複製します。
     *
     * @returns 複製した代表点データです。
     */
    Clone(): Object_CenterPoint_Data {
        const d = new Object_CenterPoint_Data();
        d.Position = this.Position.Clone();
        d.SETime = this.SETime.Clone();
        return d;
    }
}

/**
 * オブジェクト境界を構成するラインコードと有効期間を保持します。
 */
export class LineCodeStac_Data {
    LineCode?: number;
    NumOfTime?: number;
    Times: Start_End_Time_data[] = [];

    /**
     * データを複製します。
     *
     * @returns 複製したラインコード情報です。
     */
    Clone(): LineCodeStac_Data {
        const d = new LineCodeStac_Data();
        d.LineCode = this.LineCode;
        d.NumOfTime = this.NumOfTime;
        d.Times = Generic.ArrayClone(this.Times);
        return d;
    }
}

/**
 * オブジェクトグループ種別を表します。
 */
export const enmObjectGoupType_Data = {
    NormalObject: 0, //通常のオブジェクト
    AggregationObject: 1//集成オブジェクト
}

/**
 * 面積計算結果です。
 */
interface MensekiResult {
    menseki: number;
    gpoint: point;
}

/**
 * 点のポリゴン内判定結果です。
 */
interface PointInPolygonResult {
    ok: boolean;
    CrossPoint_X: number[];
}


/**
 * オブジェクトグループ既定属性項目の定義です。
 */
class strMPObjDefAttData_Info {
    Title: string = "";
    Unit: string = "";
    MissingF: boolean = false;
    Note: string = "";
    /**
     * 既定属性項目を初期化します。
     */
    constructor() {
        this.Title = "";
        this.Unit = ""; //String
        this.MissingF = false; //Boolean
        this.Note = ""; //String
    }

    /**
     * タイトルと単位から属性データ型を取得します。
     */
    get AttDataType() {
        return Generic.getAttDataType_From_TitleUnit(this.Title, this.Unit);
    }

    /**
     * 属性データ型に合わせてタイトルと単位を設定します。
     *
     * @param value 設定する属性データ型です。
     */
    set AttDataType(value) {
        const tu = Generic.SetTitleUnit_from_AttDataType(value, this.Title, this.Unit);
        this.Title = tu.title;
        this.Unit = tu.unit;
    }

    /**
     * データを複製します。
     *
     * @returns 複製した属性定義です。
     */
    Clone(): strMPObjDefAttData_Info {
        const d = new strMPObjDefAttData_Info();
        Object.assign(d, this);
        return d;
    }
}

/**
 * 初期時点属性データで、指定時点外を参照した場合の補完方法です。
 */
const enmDefPointAttDataExtraValue = {
    MissingValue: 0,
    NearestValue: 1,
    interpolation_MissingValue: 2,
    interpolation_NearestValue: 3
}

/**
 * 初期時間属性データの種類です。
 */
const enmDefTimeAttDataType = {
    PointData: 0,
    SpanData: 1,
    interpolation_MissingValue: 2,
    interpolation_NearestValue: 3
}

/**
 * オブジェクトグループに設定する初期時間属性データの定義です。
 */
class strMPObjDefTimeAttData_Info {
    Type?: number;
    attData: strMPObjDefAttData_Info = new strMPObjDefAttData_Info();
    ExtraValue?: number;

    /**
     * データを複製します。
     *
     * @returns 複製した初期時間属性定義です。
     */
    Clone(): strMPObjDefTimeAttData_Info {
        const d = new strMPObjDefTimeAttData_Info();
        Object.assign(d, this);
        d.attData = this.attData.Clone();
        return d;
    }
}

/**
 * オブジェクトグループ定義を保持します。
 */
class strObjectGroup_Data {
    ObjectType?: number;
    Name?: string;
    Shape?: number;
    Mesh?: number;
    Color: colorRGBA = new colorRGBA();
    DefTimeAttDataNum?: number;
    DefTimeAttSTC: strMPObjDefTimeAttData_Info[] = [];
    ObjectNameNum?: number;
    ObjectNameList: string[] = [];
    UseLineType: boolean[] = [];
    UseObjectGroup: boolean[] = [];

    /**
     * データを複製します。
     *
     * @returns 複製したオブジェクトグループ定義です。
     */
    Clone(): strObjectGroup_Data {
    const d = new strObjectGroup_Data();
    Object.assign(d, this);
    d.DefTimeAttSTC = [];
    for (const i in this.DefTimeAttSTC) {
        d.DefTimeAttSTC[i] = this.DefTimeAttSTC[i].Clone();
    }
    d.ObjectNameList = this.ObjectNameList.slice();
    d.UseLineType = this.UseLineType.slice();
    d.UseObjectGroup = this.UseObjectGroup.slice();
    return d;
    }
}

/**
 * 初期時間属性データの個別値です。
 */
class strDefTimeAttDataEach_Info {
    Span: Start_End_Time_data = new Start_End_Time_data();
    Value?: string;

    /**
     * データを複製します。
     *
     * @returns 複製した時間属性値です。
     */
    Clone(): strDefTimeAttDataEach_Info {
        const d = new strDefTimeAttDataEach_Info();
        d.Span = this.Span.Clone();
        d.Value = this.Value;
        return d;
    }
}

/**
 * オブジェクトに紐付く初期時間属性データ列です。
 */
class strDefTimeAttData_Info {
    Data: strDefTimeAttDataEach_Info[] = [];

    /**
     * データを複製します。
     *
     * @returns 複製した初期時間属性データです。
     */
    Clone(): strDefTimeAttData_Info {
        const d = new strDefTimeAttData_Info();
        d.Data = Generic.ArrayClone(this.Data);
        return d;
    }
}

/**
 * 地図上のオブジェクト 1 件分の定義です。
 */
class strObj_Data {
    Number?: number;
    Kind?: number;
    Shape?: number;
    NumOfNameTime?: number;
    NumOfCenterP?: number;
    NumOfSuc?: number;
    NumOfLine?: number;
    Circumscribed_Rectangle: rectangle = new rectangle();
    DefTimeAttValue: strDefTimeAttData_Info[] = [];
    SucSTC: Object_Succession_Data[] = [];
    NameTimeSTC: Object_NameTimeStac_Data[] = [];
    CenterPSTC: Object_CenterPoint_Data[] = [];
    LineCodeSTC: LineCodeStac_Data[] = [];

    /**
     * データを複製します。
     *
     * @returns 複製したオブジェクト定義です。
     */
    Clone(): strObj_Data {
    const d=new strObj_Data();
    Object.assign(d, this);
    d.Circumscribed_Rectangle=this.Circumscribed_Rectangle.Clone();
    d.DefTimeAttValue=Generic.ArrayClone(this.DefTimeAttValue);
    d.SucSTC=Generic.ArrayClone(this.SucSTC) ;
    d.NameTimeSTC=Generic.ArrayClone(this.NameTimeSTC);
    d.CenterPSTC=Generic.ArrayClone(this.CenterPSTC);
    d.LineCodeSTC=Generic.ArrayClone(this.LineCodeSTC);
    return d;
    }
}

/**
 * 方位記号に表示する方角文字列です。
 */
class dirWord_Data {
    East: string = "";
    West: string = "";
    North: string = "";
    South: string = "";

    /**
     * データを複製します。
     *
     * @returns 複製した方角文字列設定です。
     */
    Clone(): dirWord_Data {
    const w = new dirWord_Data();
    w.East = this.East;
    w.West = this.West;
    w.North = this.North;
    w.South = this.South;
    return w;
    }
}

/**
 * 地図上に表示する方位記号全体の設定です。
 */
class strCompass_Attri {
    Visible?: boolean;
    Position: point = new point();
    Mark: Mark_Property = new Mark_Property();
    dirWord: dirWord_Data = new dirWord_Data();
    Font: Font_Property = new Font_Property();

    /**
     * データを複製します。
     *
     * @returns 複製した方位設定です。
     */
    Clone(): strCompass_Attri {
    const cp = new strCompass_Attri();
    cp.Visible = this.Visible;
    cp.Position = this.Position.Clone();
    cp.Mark = this.Mark.Clone();
    cp.dirWord = this.dirWord.Clone();
    cp.Font = this.Font.Clone();
    return cp;
    }
}

/**
 * ラインの線種と有効期間を保持します。
 */
class Line_Time_Data {
    Kind?: number;
    SETime: Start_End_Time_data = new Start_End_Time_data();

    /**
     * データを複製します。
     *
     * @returns 複製したライン時間情報です。
     */
    Clone(): Line_Time_Data {
        const d = new Line_Time_Data();
        d.Kind = this.Kind;
        d.SETime = this.SETime.Clone();
        return d;
    }

    /**
     * 線種と期間が一致するかを判定します。
     *
     * @param LT 比較対象です。
     * @returns 完全一致する場合は true です。
     */
    Equals(LT: Line_Time_Data): boolean {
        if (LT.Kind === this.Kind) {
            if (LT.SETime.Equals(this.SETime)) {
                return true;
            }
        }
        return false;
    }
}

/**
 * 属性データ・地図データで共有するライン情報です。
 */
class strLine_Data {
    Number?: number;
    NumOfPoint?: number;
    Connect?: number;
    NumOfLineUse?: number;
    Circumscribed_Rectangle: rectangle = new rectangle();
    NumOfTime?: number;
    Drawn?: boolean;
    LineTimeSTC: Line_Time_Data[] = [];
    PointSTC: point[] = [];

    /**
     * データを複製します。
     *
     * @returns 複製したライン情報です。
     */
    Clone(): strLine_Data {
        const d = new strLine_Data();
        Object.assign(d, this);
        d.Circumscribed_Rectangle = this.Circumscribed_Rectangle.Clone();
        d.PointSTC = Generic.ArrayClone(this.PointSTC);
        d.LineTimeSTC = Generic.ArrayClone(this.LineTimeSTC);
        return d;
    }
}

/**
 * オブジェクトで利用可能なライン種別情報です。
 */
export class EnableMPLine_Data implements EnableMPLine {
    LineCode!: number;
    Kind!: number;

    /**
     * 利用可能ライン情報を初期化します。
     *
     * @param lcode ラインコードです。
     * @param Kind 線種番号です。
     */
    constructor(lcode?: number, Kind?: number) {
        this.LineCode = lcode ?? 0;
        this.Kind = Kind ?? 0;
    }

    /**
     * データを複製します。
     *
     * @returns 複製した利用可能ライン情報です。
     */
    Clone(): EnableMPLine_Data {
        const d = new EnableMPLine_Data();
        Object.assign(d, this);
        return d;
    }
}

/**
 * 地図データの座標系設定です。
 */
class Zahyo_info {
    Mode: number = 0; // enmZahyo_mode_info (デフォルト値を設定)
    System: number = 0; // enmZahyo_System_Info (デフォルト値を設定)
    HeimenTyokkaku_KEI_Number: number = 0; // 平面直角座標系の系番号 (デフォルト値を設定)
    Projection: number = 0; // enmProjection_Info (デフォルト値を設定)
    CenterXY: point = new point();

    /**
     * データを複製します。
     *
     * @returns 複製した座標系設定です。
     */
    Clone(): Zahyo_info {
        const d = new Zahyo_info();
        Object.assign(d, this);
        d.CenterXY = this.CenterXY.Clone();
        return d;
    }
}

/**
 * 地図ファイル全体のメタデータです。
 */
class strMap_data {
    MPVersion?: number;
    FileName?: string;
    FullPath?: string;
    OBKNum?: number;
    Kend?: number;
    LpNum?: number;
    ALIN?: number;
    SCL?: number;
    SCL_U?: number;
    Comment?: string;
    Time_Mode?: boolean;
    Circumscribed_Rectangle: rectangle = new rectangle();
    Zahyo: Zahyo_info = new Zahyo_info();
    Detail: Map_Detail_Data = new Map_Detail_Data();
    MapCompass: strCompass_Attri = new strCompass_Attri();
}

/**
 * 線種に紐付くオブジェクトグループ別設定です。
 */
class strLKOjectGroup_Info {
    Name?: string;
    GroupNumber?: number;
    UseOnly?: boolean;
    Pattern: Line_Property = new Line_Property();
    ObjGroup?: strLKOjectGroup_Info[];
    NumofObjectGroup?: number;

    /**
     * データを複製します。
     *
     * @returns 複製した線種オブジェクトグループ設定です。
     */
    Clone(): strLKOjectGroup_Info {
        const d = new strLKOjectGroup_Info();
        Object.assign(d, this);
        d.Pattern = this.Pattern.Clone();
        if (this.ObjGroup) {
            d.ObjGroup = this.ObjGroup.map(og => og.Clone());
        }
        return d;
    }
}

/**
 * 地図データの線種定義です。
 */
class LineKind_Data {
    Name?: string;
    NumofObjectGroup?: number;
    ObjGroup: strLKOjectGroup_Info[] = [];
    Mesh?: boolean;

    /**
     * データを複製します。
     *
     * @returns 複製した線種定義です。
     */
    Clone(): LineKind_Data {
        const d = new LineKind_Data();
        Object.assign(d, this);
        d.ObjGroup = Generic.ArrayClone(this.ObjGroup);
        return d;
    }
}



/**
 * オブジェクトグループ連動展開後の線種一覧要素です。
 */
export class LPatSek_Info {
    LKind?: number;
    LkindPatNum?: number;
    Name?: string;
    Pat: Line_Property = new Line_Property();
}

/**
 * 地図詳細設定のうち表示・計測可否を保持します。
 */
class Map_Detail_Data {
    DistanceMeasurable?: boolean;
    ScaleVisible?: boolean;
}

//面オブジェクトの境界線の方向
//Boundary_Arrange関数で使用
// 廃止した境界方向補助データのメモです。
// class Hennyu_Data2 {
//     code?: number;
//     Direction?: number;
// }



/**
 * 地図データ本体を保持し、編集・判定処理を提供します。
 */
class clsMapdata {
    Map: strMap_data;
    ObjectKind: strObjectGroup_Data[] = [];
    MPObj: strObj_Data[] = [];
    LineKind: LineKind_Data[] = [];
    MPLine: strLine_Data[] = [];
    DefTimeAttSTC: strMPObjDefTimeAttData_Info[] = [];
    NoDataFlag: boolean = false;
    private Enable_MPObjStac: number[] = []; // EnableMPOBJ_Data未定義

    /**
     * 空の地図メタデータを持つインスタンスを生成します。
     */
    constructor() {
        this.Map = new strMap_data();
    }

    /**
     * 地図データ全体を初期状態へ戻します。
      *
      * @returns 返り値はありません。
     */
    init_MapData() {
        this.ObjectKind = [];
        this.MPObj = [];
        this.LineKind = [];
        this.MPLine = [];
        const m = new strMap_data();
        m.FileName = "";
        m.FullPath = "";
        m.MPVersion = 11;
        m.ALIN = 0;
        m.Kend = 0;
        m.OBKNum = 0;
        m.LpNum = 0;
        m.SCL = 0;
        m.SCL_U = enmScaleUnit.kilometer;
        m.Time_Mode = false;
        m.Comment = "";
        m.Zahyo.Mode = enmZahyo_mode_info.Zahyo_No_Mode;
        m.Zahyo.System = enmZahyo_System_Info.Zahyo_System_No;
        m.Detail.DistanceMeasurable = true;
        m.Detail.ScaleVisible = true;
        m.MapCompass.Visible = true;
        this.Map = m;
        this.NoDataFlag = true;
    }

    /**
     * オブジェクトグループへ初期属性項目を 1 件追加します。
     *
     * @param OBKNum 対象オブジェクトグループ番号です。
     * @param title 項目名です。
     * @param Unit 単位です。
     * @param Note 注記です。
     */
    Add_one_DefAttDataSet(OBKNum: number, title: string, Unit: string, Note: string) {
        const ok = this.ObjectKind[OBKNum];
        const def = new strMPObjDefTimeAttData_Info();
        def.attData.Title = title;
        def.attData.Unit = Unit;
        def.attData.Note = Note;
        ok.DefTimeAttSTC[ok.DefTimeAttDataNum] = def;
        ok.DefTimeAttDataNum++;
    }

    /**
     * 方位記号の初期表示設定を作成します。
      *
      * @returns 返り値はありません。
     */
    init_Compass_First() {
        const mc = this.Map.MapCompass;
        mc.dirWord.North = "";
        mc.dirWord.East = "";
        mc.dirWord.West = "";
        mc.dirWord.South = "";
        mc.Mark = clsBase.Mark();
        mc.Font = clsBase.Font();
        mc.Mark.ShapeNumber = 11;//clsSettings.Data.Compass_Mark
        mc.Mark.PrintMark = enmMarkPrintType.Mark;
        mc.Mark.Line.Width = 0.3;
        mc.Mark.Tile.Color = clsBase.ColorBlack();
        mc.Mark.WordFont.Size = 8;//clsSettings.Data.Compass_Mark_Size
        mc.Visible = true;
        mc.Position = this.Get_Compass_Position_First_Position();
    }

    /**
     * 方位記号の初期配置位置を返します。
     *
     * @returns 地図範囲左上寄りの初期配置座標です。
     */
    Get_Compass_Position_First_Position() {
        const mc = this.Map.Circumscribed_Rectangle;
        const pxy = new point();
        pxy.x = mc.left + (mc.right - mc.left) / 20;
        pxy.y = mc.top + (mc.bottom - mc.top) / 20;
        return pxy;
    }

    /**
     * 全オブジェクトグループの初期色をまとめて設定します。
      *
      * @returns 返り値はありません。
     */
    Set_First_ObjectKind_Color() {

        for (let i = 0; i < this.Map.OBKNum; i++) {
            this.ObjectKind[i].Color = this.Set_First_ObjectKind_Color_Solo(i);
        }
    }

    /**
     * 1 つのオブジェクトグループに対する初期色を返します。
     *
     * @param ObkCode オブジェクトグループ番号です。
     * @returns 初期色です。
     */
    Set_First_ObjectKind_Color_Solo(ObkCode: number) {
        const Object_Color = [];
        Object_Color.push(new colorRGBA(0, 255, 0));
        Object_Color.push(new colorRGBA(0, 255, 255));
        Object_Color.push(new colorRGBA(255, 255, 0));
        Object_Color.push(new colorRGBA(255, 0, 255));
        Object_Color.push(new colorRGBA(200, 200, 200));
        const v1 = ObkCode % 6;
        const v2 = Math.floor(ObkCode / 6);
        const col = new colorRGBA(Object_Color[v1].r - v2 / 50, Object_Color[v1].g - v2 / 50, Object_Color[v1].b - v2 / 50);
        return col;
    }

    /**
     * 新規ライン編集用の初期化済みライン情報を返します。
     *
     * @param LineKindNumber 初期線種番号です。
     * @returns 初期化済みライン情報です。
     */
    Init_One_Line(LineKindNumber: number) {
        const line = new strLine_Data();
        line.Number = -1;
        line.NumOfPoint = 0;
        line.NumOfTime = 1;
        const lt = new Line_Time_Data();
        lt.Kind = LineKindNumber;
        lt.SETime = clsTime.GetNullStartEndYMD();
        line.LineTimeSTC.push(lt);
        return line;
    }

    /**
     * 新規オブジェクト編集用の初期化済みオブジェクトを返します。
     *
     * @param ObjectKindNumber オブジェクトグループ番号です。
     * @returns 初期化済みオブジェクトです。
     */
    Init_One_Object(ObjectKindNumber: number) {
        const Obj = new strObj_Data();
        Obj.Number = -1;
        Obj.NumOfNameTime = 1;
        Obj.NumOfCenterP = 1;
        Obj.NumOfLine = 0;
        Obj.NumOfSuc = 0;
        Obj.Shape = enmShape.PointShape;
        Obj.Kind = ObjectKindNumber;
        const ok = this.ObjectKind[ObjectKindNumber];
        if (ok.DefTimeAttDataNum > 0) {
            Obj.DefTimeAttValue = [];
            for (let i = 0; i < ok.DefTimeAttDataNum; i++) {
                const attData = new strDefTimeAttData_Info();
                attData.Data = [];
                Obj.DefTimeAttValue.push(attData);
            }
        }
        const NL = new Object_NameTimeStac_Data();
        NL.NamesList.length = ok.ObjectNameNum;
        NL.NamesList.fill("");
        NL.SETime = clsTime.GetNullStartEndYMD();
        Obj.NameTimeSTC.push(NL);
        const cp = new Object_CenterPoint_Data();
        cp.SETime = clsTime.GetNullStartEndYMD();
        Obj.CenterPSTC.push(cp);
        return Obj;
    }

    /**
     * オブジェクトを保存し、必要なら外接矩形などを更新します。
     *
     * @param EditingObject 保存対象オブジェクトです。
     * @param checkObjectmaxMinFlaf 最大最小範囲の再計算を行う場合は true です。
      * @returns 返り値はありません。
     */
    Save_Object(EditingObject: strObj_Data, checkObjectmaxMinFlaf: boolean) {

        if (EditingObject.Number === -1) {
            //新規オブジェクト
            EditingObject.Number = this.Map.Kend;
            this.Map.Kend++;
        }
        this.MPObj[EditingObject.Number] = EditingObject.Clone();
        if (checkObjectmaxMinFlaf === true) {
            this.Check_Obj_Maxmin(this.MPObj[EditingObject.Number], true);
        }
    }

    /**
     * ラインを保存し、必要な関連判定を更新します。
     *
     * @param EditingLine 保存対象ラインです。
     * @param checkRelatedLineFlag 関連ラインの接続再判定を行う場合は true です。
     * @param checkRelatedObjectShapeFlag 関連オブジェクト形状を再判定する場合は true です。
     * @param checkLineMaxMinFlag ライン外接矩形を再計算する場合は true です。
      * @returns 返り値はありません。
     */
    Save_Line(EditingLine: strLine_Data, checkRelatedLineFlag: boolean, checkRelatedObjectShapeFlag: boolean, checkLineMaxMinFlag: boolean) {
        const SEpoint: point[] = [];
        let newf;
        SEpoint.push(EditingLine.PointSTC[0].Clone());
        SEpoint.push(EditingLine.PointSTC[EditingLine.NumOfPoint-1].Clone());
        if (EditingLine.Number === -1) {
            //新規
            EditingLine.Number = this.Map.ALIN;
            this.Map.ALIN++;
            newf = true;
        } else {
            SEpoint.push(this.MPLine[EditingLine.Number].PointSTC[0].Clone());
            SEpoint.push(this.MPLine[EditingLine.Number].PointSTC[this.MPLine[EditingLine.Number].NumOfPoint - 1].Clone());
            newf = false;
        }
        EditingLine.Connect = this.Check_Line_Connect(EditingLine);
        this.MPLine[EditingLine.Number] = EditingLine.Clone();
        if (checkLineMaxMinFlag === true) {
            this.Check_Line_Maxmin(EditingLine.Number, true);
        }

        if ((newf === false) && (checkRelatedObjectShapeFlag === true)) {
            //当該ラインを使用するオブジェクトの形状チェック
            for (let i = 0; i < this.Map.Kend; i++) {
                const ob = this.MPObj[i];
                for (let j = 0; j < ob.NumOfLine; j++) {
                    if (ob.LineCodeSTC[j].LineCode === EditingLine.Number) {
                        ob.Shape = this.Check_Obj_Shape_AllTime(ob);
                        break;
                    }
                }
            }
        }

        if (checkRelatedLineFlag === true) {
            this.Check_Related_Line(SEpoint, EditingLine.Number);
        }
    }

    /**
     * 指定起終点に接するラインの接続状態を再計算します。
     *
     * @param SEpoint 比較に使う起終点配列です。
     * @param exCode 除外するライン番号です。
      * @returns 返り値はありません。
     */
    Check_Related_Line(SEpoint: point[], exCode: number) {
        const n = SEpoint.length;
        for (let i = 0; i < this.Map.ALIN; i++) {
            const ml = this.MPLine[i];
            if ((i !== exCode) && (ml.NumOfPoint > 0)) {
                let f = false;
                for (let j = 0; j < n; j++) {
                    if (SEpoint[j].Equals(ml.PointSTC[0]) === true) {
                        f = true;
                        break;
                    } else if (SEpoint[j].Equals(ml.PointSTC[ml.NumOfPoint - 1]) === true) {
                        f = true
                        break;
                    }
                }
                if (f === true) {
                    const ct = this.Check_Line_Connect(ml, exCode);
                    if (ct !== ml.Connect) {
                        ml.Connect = ct;
                    }
                }
            }
        }
    }

    /**
     * 指定ラインの接続状態を列挙型で返します。
     *
     * @param Line 判定対象ラインです。
     * @param exclusion_code 比較対象から除外するライン番号です。
     * @returns 接続状態です。
     */
    Check_Line_Connect(Line: strLine_Data, exclusion_code = -1) {
        const ck = this.Check_Line_Connect_Detail(Line, exclusion_code);
        switch (ck) {
            case 0:
                return enmLineConnect.no;
                break;
            case 1:
            case 2:
                return enmLineConnect.one;
                break;
            case 3:
                return enmLineConnect.both;
                break;
            case 4:
                return enmLineConnect.loopen;
                break;
        }
    }

    /**
     * 指定ラインの接続状態を詳細コードで返します。
     *
     * @param Line 判定対象ラインです。
     * @param exclusion_code 比較対象から除外するライン番号です。
     * @returns 0 から 4 の詳細接続コードです。
     */
    Check_Line_Connect_Detail(Line: strLine_Data, exclusion_code = -1) {
        if (Line.NumOfPoint === 0) {
            return 0;
        }

        const XY1 = Line.PointSTC[0];
        const XY2 = Line.PointSTC[Line.NumOfPoint - 1];

        if (XY1.Equals(XY2) === true) {
            return 4;
        }

        let ret_v = 0;
        for (let i = 0; i < this.Map.ALIN; i++) {
            if ((i !== exclusion_code) && (i !== Line.Number)) {
                const ml = this.MPLine[i];
                const n = ml.NumOfPoint;
                if (n > 0) {
                    const pxy1 = ml.PointSTC[0];
                    const pxy2 = ml.PointSTC[n - 1];
                    if ((pxy1.Equals(XY1) === true) || (pxy2.Equals(XY1) === true)) {
                        ret_v = (ret_v) || (1);
                    }
                    if ((pxy1.Equals(XY2) === true) || (pxy2.Equals(XY2) === true)) {
                        ret_v = (ret_v) || (2);
                    }
                }
            }
        }
        return ret_v;
    }

    /**
     * 名前が一致するオブジェクトグループ番号を返します。
     *
     * @param Name 検索するオブジェクトグループ名です。
     * @returns 一致したオブジェクトグループ番号です。未検出時は -1 です。
     */
    Get_ObjectGroupNumber_By_Name(Name: string) {
        for (let i = 0; i < this.Map.OBKNum; i++) {
            if (this.ObjectKind[i].Name === Name) {
                return i;
            }
        }
        return -1;
    }

    /**
     * 展開済み線種一覧のパターンを地図データ側へ反映します。
     *
     * @param LPC Get_TotalLineKind 相当の線種配列です。
      * @returns 返り値はありません。
     */
    Set_TotalLineKind(LPC: Array<JsonObject>) { //LPatSek_Info
        let n = 0;
        for (let i = 0; i < this.Map.LpNum; i++) {
            const lk = this.LineKind[i];
            for (let j = 0; j < lk.NumofObjectGroup; j++) {
                const patValue = LPC[n].Pat;
                if (patValue && typeof patValue === 'object' && !Array.isArray(patValue) && 'Clone' in patValue) {
                    const pat = patValue as unknown as Line_Property;
                    if (typeof pat.Clone === 'function') {
                        lk.ObjGroup[j].Pattern = pat.Clone();
                    }
                }
                n += 1
            }
        }
    }

    /**
     * 指定オブジェクトグループに属し、指定時点で有効なオブジェクト番号一覧を返します。
     *
     * @param ObjGroup 対象オブジェクトグループ番号です。
     * @param Time 判定時点です。
     * @returns 条件に一致したオブジェクト番号配列です。
     */
    Get_Objects_by_Group(ObjGroup: number, Time: strYMD) {
        const Get_Objects = [];
        for (let i = 0; i < this.Map.Kend; i++) {
            if (this.MPObj[i].Kind === ObjGroup) {
                if (this.CheckEnableObject(this.MPObj[i], Time) === true) {
                    Get_Objects.push(i);
                }
            }
        }
        return Get_Objects;
    }

    /**
     * 地図データ全体を指定座標系へ変換します。
     *
     * @param newMapZahyo 変換先の座標系設定です。
      * @returns 返り値はありません。
     */
    Convert_ZahyoMode(newMapZahyo: Zahyo_info) {
        const m = this.Map;
        m.MapCompass.Position = spatial.Get_Reverse_and_Convert_XY(m.MapCompass.Position, m.Zahyo, newMapZahyo);

        for (let i = 0; i < m.ALIN; i++) {
            for (let j = 0; j < this.MPLine[i].NumOfPoint; j++) {
                this.MPLine[i].PointSTC[j] = spatial.Get_Reverse_and_Convert_XY(this.MPLine[i].PointSTC[j], m.Zahyo, newMapZahyo);

            }
        }
        for (let i = 0; i < m.Kend; i++) {
            for (let j = 0; j < this.MPObj[i].NumOfCenterP; j++) {
                this.MPObj[i].CenterPSTC[j].Position = spatial.Get_Reverse_and_Convert_XY(this.MPObj[i].CenterPSTC[j].Position, m.Zahyo, newMapZahyo);
            }
        }
        m.Zahyo = newMapZahyo.Clone();
        this.Checl_All_Line_Maxmin();
        this.Check_All_Obj_MaxMin();
        m.Circumscribed_Rectangle = this.Get_Mapfile_Rectangle();
    }

    /**
     * 地図ファイル全体の外接矩形を再計算して返します。
     *
     * @returns 全ラインと代表点を含む外接矩形です。
     */
    Get_Mapfile_Rectangle() {
        let MapRec;
        const m = this.Map;
        if (this.Map.ALIN > 0) {
            MapRec = new rectangle(this.MPLine[0].PointSTC[0]);
            for (let i = 0; i < m.ALIN; i++) {
                MapRec = spatial.getCircumscribedRectangle(this.MPLine[i].Circumscribed_Rectangle, MapRec);
            }
        } else {
            MapRec = new rectangle(this.MPObj[0].CenterPSTC[0].Position);
        }
        for (let i = 0; i < m.Kend; i++) {
            for (let j = 0; j < this.MPObj[i].NumOfCenterP; j++) {     
                MapRec = spatial.getCircumscribedRectangle(this.MPObj[i].CenterPSTC[j].Position, MapRec);
            }
        }
        return MapRec;
    }

    /**
     * 全オブジェクトの外接矩形を再計算します。
      *
      * @returns 返り値はありません。
     */
    Check_All_Obj_MaxMin() {
        const m = this.Map;
        for (let i = 0; i < m.Kend; i++) {
            this.Check_Obj_Maxmin(this.MPObj[i], false);
        }

    }

    /**
     * 線分列を間引いて平滑化後の座標列を返します。
     *
     * @param _PointXY 元の座標列です。
     * @param s_distanceas 点を残す判定距離です。
     * @returns 間引き後の座標列です。
     */
    Smoothing_Line(_PointXY: point[], s_distanceas: number){
        let PointXY = Generic.ArrayClone(_PointXY);
        let FirstPointNum = PointXY.length;
        if (FirstPointNum <= 3) {
            return PointXY;
        }

        let LoopF = false;
        if (PointXY[0].Equals(PointXY[FirstPointNum - 1]) === true) {
            LoopF = true;
        } else {
            LoopF = false;
        }

        const Push_point: point[] = Array.from({ length: FirstPointNum }) as point[];
        let ts = FirstPointNum;
        let n = 0;
        let Cng_f;
        do {
            Cng_f = false;
            for (let k = 0; k <= 1; k++) {
                FirstPointNum = ts;
                if (k === 1) {
                    Push_point[1] = PointXY[1].Clone();
                }
                n = 1 + k;
                if ((LoopF === true) && (FirstPointNum <= 8)) {
                    break;
                }
                for (let j = 1 + k; j <= FirstPointNum - 3; j += 2) {
                    let D;
                    if (this.Map.Zahyo.Mode === enmZahyo_mode_info.Zahyo_Ido_Keido) {
                        D = spatial.Distance_Ido_Kedo_XY_Point(PointXY[j], PointXY[j + 1], this.Map.Zahyo);
                    } else {
                        D = spatial.Distance_Point(PointXY[j], PointXY[j + 1]) / this.Map.SCL;
                    }
                    if (D < s_distanceas) {
                        Push_point[n] = new point((PointXY[j].x + PointXY[j + 1].x) / 2, (PointXY[j].y + PointXY[j + 1].y) / 2);
                        n++;
                        Cng_f = true;
                    } else {
                        Push_point[n] = PointXY[j].Clone();
                        Push_point[n + 1] = PointXY[j + 1].Clone();
                        n += 2;
                    }
                }
                if (((FirstPointNum % 2 === 1) && (k === 0)) || ((FirstPointNum % 2 === 0) && (k === 1))) {
                    Push_point[n] = PointXY[FirstPointNum - 2].Clone();
                    n++;
                }
                Push_point[0] = PointXY[0].Clone();
                Push_point[n] = PointXY[FirstPointNum - 1].Clone();
                n++;
                PointXY = [];
                for (let j = 0; j < n; j++) {
                    PointXY[j] = Push_point[j].Clone();
                }
                ts = n;
            }
        } while (Cng_f === true);
        return PointXY;
    }
    
    /**
     * 線種を 1 件追加します。
     *
     * @param LineKindName 線種名です。
     * @param LPat ラインパターンです。
     * @param LMesh メッシュ用線種かどうかです。
      * @returns 返り値はありません。
     */
    Add_OneLineKind(LineKindName: string, LPat: Line_Property, LMesh: boolean) {
        this.LineKind.push(this.Get_OneLineKind_Parameter(LineKindName, LPat, LMesh));
        this.Map.LpNum++;
        for (let i = 0; i < this.Map.OBKNum; i++) {
            this.ObjectKind[i].UseLineType.push(false);
        }
    }

    /**
     * 線種 1 件分の初期パラメータを生成します。
     *
     * @param LineKindName 線種名です。
     * @param LPat ラインパターンです。
     * @param LMesh メッシュ用線種かどうかです。
     * @returns 初期化済み線種定義です。
     */
    Get_OneLineKind_Parameter(LineKindName: string, LPat: Line_Property, LMesh: boolean) {
        const Lkind = new LineKind_Data();
        Lkind.ObjGroup = [];
        Lkind.ObjGroup.push(new strLKOjectGroup_Info());
        Lkind.Name = LineKindName;
        Lkind.ObjGroup[0].Pattern = LPat.Clone();
        Lkind.Mesh = LMesh;
        Lkind.NumofObjectGroup = 1;
        return Lkind;
    }

    /**
     * オブジェクトグループを 1 件追加します。
     *
     * @param Name グループ名です。
     * @param Shape 形状種別です。
     * @param Mesh メッシュ系グループかどうかです。
     * @param type オブジェクトグループ種別です。
      * @returns 返り値はありません。
     */
    Add_OneObjectGroup_Parameter(Name: string, Shape: number, Mesh: boolean, type: number) {
        const Okind = this.Get_OneObjectGroup_Parameter(Name, Shape, this.Map.OBKNum, this.Map.LpNum, Mesh, type);
        this.ObjectKind.push(Okind);
        for (let i = 0; i < this.Map.OBKNum; i++) {
            if (this.ObjectKind[i].ObjectType === enmObjectGoupType_Data.AggregationObject) {
                this.ObjectKind[i].UseObjectGroup.push(false);
            }
        }
        this.Map.OBKNum++;
    }

    /**
     * 新規オブジェクトグループの初期パラメータを生成します。
     *
     * @param Name グループ名です。
     * @param Shape 形状種別です。
     * @param ObkNum 現在のオブジェクトグループ数です。
     * @param LpNum 現在の線種数です。
     * @param Mesh メッシュ系グループかどうかです。
     * @param type オブジェクトグループ種別です。
     * @returns 初期化済みオブジェクトグループ定義です。
     */
    Get_OneObjectGroup_Parameter(Name: string, Shape: number, ObkNum: number, LpNum: number, Mesh: boolean, type: number) {
        const Okind = new strObjectGroup_Data();
        Okind.Color = clsBase.ColorWhite();//マップエディタがないので設定不要
        Okind.Mesh = Mesh ? 1 : 0;
        Okind.Name = Name;
        Okind.Shape = Shape;
        Okind.ObjectType = type;
        Okind.DefTimeAttDataNum = 0;
        Okind.ObjectNameNum = 1;
        Okind.ObjectNameList = ["オブジェクト名1"];
        if (type === enmObjectGoupType_Data.AggregationObject) {
            const len = Math.max(ObkNum, 0);
            Okind.UseLineType = new Array(len).fill(false) as boolean[];
        } else {
            const len = Math.max(LpNum - 1, 0);
            Okind.UseLineType = new Array(len).fill(false) as boolean[];
        }
        return Okind;
    }

    /**
     * 地図データ全体の Y 座標を反転します。
      *
      * @returns 返り値はありません。
     */
    YReverse() {

        this.Map.Circumscribed_Rectangle.top = -this.Map.Circumscribed_Rectangle.top;
        this.Map.Circumscribed_Rectangle.bottom = -this.Map.Circumscribed_Rectangle.bottom;

        for (let i = 0; i < this.Map.ALIN; i++) {
            const mp = this.MPLine[i];
            for (let j = 0; j < mp.NumOfPoint; j++) {
                mp.PointSTC[j].y = -mp.PointSTC[j].y;
                mp.Circumscribed_Rectangle.top = -mp.Circumscribed_Rectangle.top;
                mp.Circumscribed_Rectangle.bottom = -mp.Circumscribed_Rectangle.bottom;
            }
        }

        for (let i = 0; i < this.Map.Kend; i++) {
            const mo = this.MPObj[i];
            for (let j = 0; j < mo.NumOfCenterP; j++) {
                mo.CenterPSTC[j].Position.y = -mo.CenterPSTC[j].Position.y;
                mo.Circumscribed_Rectangle.top = -mo.Circumscribed_Rectangle.top;
                mo.Circumscribed_Rectangle.bottom = -mo.Circumscribed_Rectangle.bottom;
            }
        }
    }

    /**
     * 緯度経度をそのまま保持している地図データを投影変換済み座標へ置き換えます。
      *
      * @returns 返り値はありません。
     */
    MapLatLon_Zahyo_convert() {
        const XY_Rect = this.Get_Mapfile_Rectangle();
        this.Map.SCL = 1;
        this.Map.SCL_U = enmScaleUnit.kilometer;
        this.Map.Zahyo.CenterXY = XY_Rect.centerP();
        for (let i = 0; i < this.Map.ALIN; i++) {
            const ml = this.MPLine[i];
            for (let j = 0; j < ml.NumOfPoint; j++) {
                ml.PointSTC[j] = spatial.Get_Converted_XY(ml.PointSTC[j], this.Map.Zahyo);
            }
            this.Check_Line_Maxmin(i, false);
        }
        for (let i = 0; i < this.Map.Kend; i++) {
            const mo = this.MPObj[i];
            let CP;
            switch (mo.Shape) {
                case enmShape.PointShape:
                    CP = mo.CenterPSTC[0].Position;
                    CP = spatial.Get_Converted_XY(CP, this.Map.Zahyo);
                    break;
                case enmShape.PolygonShape:
                    CP = this.GetObjGraviityXY(mo, clsTime.GetNullYMD());
                    break;
                case enmShape.LineShape: {
                    const ml = this.MPLine[mo.LineCodeSTC[0].LineCode];
                    CP = ml.PointSTC[Math.floor(ml.NumOfPoint / 2)];
                    break;
                }
            }
            if (CP) {
                mo.CenterPSTC[0].Position = CP;
            }
            this.Check_Obj_Maxmin(mo, false);
        }
        this.Map.Circumscribed_Rectangle = this.Get_Mapfile_Rectangle();
    }

    /**
     * 面オブジェクトの代表点を重心から再計算します。
      *
      * @returns 返り値はありません。
     */
    GetObjectGravity_All() {
        for (let i = 0; i < this.Map.Kend; i++) {
            const mo = this.MPObj[i];
            switch (mo.Shape) {
                case enmShape.PolygonShape: {
                    const CP = this.GetObjGraviityXY(mo, clsTime.GetNullYMD());
                    if (CP && typeof CP !== 'boolean') {
                        mo.CenterPSTC[0].Position = CP.Clone();
                    }
                    break;
                }
            }
            this.Check_Obj_Maxmin(mo, false);
        }
    }

    /**
     * 面オブジェクトの重心を求めます。
     *
     * @param ObjData 対象オブジェクトです。
     * @param L_Time 判定時点です。
     * @returns 重心座標です。ポリゴン外に補正不能な場合は false、面でない場合は undefined です。
     */
    GetObjGraviityXY(ObjData: strObj_Data, L_Time: strYMD): point | false | undefined {
        if (ObjData.Shape !== enmShape.PolygonShape) {
            //ポリゴンでない場合は求めない
            return undefined;
        }

        let GPoint = new point();
        const retV = this.Menseki(ObjData,  L_Time);
        if (retV === -1) {
            return false;
        }
        const xy2 = retV.gpoint;
        if (retV.menseki === 0) {
            GPoint = xy2.Clone();
        } else {
            //重心がオブジェクト内部に収まるかチェック
            const ELine = this.Get_EnableMPLine(ObjData as unknown as number, L_Time);
            const Fringe_Line: number[] = [];
            for (let j = 0; j < ELine.length; j++) {
                Fringe_Line.push(ELine[j].LineCode);
            }
            const retV2 = this.Check_Point_in_Polygon_LineCode(xy2.x, xy2.y, Fringe_Line);
            if (retV2.ok === true) {
                GPoint = xy2.Clone();
            } else {
                //入らない場合
                const Cross_x = retV2.CrossPoint_X;
                let crn = Cross_x.length;
                if (crn < 2) {
                    GPoint = this.MPLine[Fringe_Line[0]].PointSTC[0];
                    return false
                }
                let mw = Cross_x[1] - Cross_x[0];
                let mww = 0;
                if (crn % 2 === 1) {
                    crn -= 1;
                }
                if (crn >= 4) {
                    for (let i = 2; i <= crn - 1; i += 2) {
                        const mw2 = Cross_x[i + 1] - Cross_x[i];
                        if (mw2 > mw) {
                            mw = mw2;
                            mww = i;
                        }
                    }
                }
                GPoint.y = xy2.y;
                GPoint.x = (Cross_x[mww + 1] + Cross_x[mww]) / 2;
            }
        }
        return GPoint;
    }

    /**
     * オブジェクト 1 件の外接矩形を再計算し、必要に応じて地図全体範囲も更新します。
     *
     * @param ObjData 対象オブジェクトです。
     * @param MapRectCheckF 地図全体の外接矩形更新も行う場合は true です。
     */
    Check_Obj_Maxmin(ObjData: strObj_Data, MapRectCheckF: boolean) {
        const oldObjRect = ObjData.Circumscribed_Rectangle;
        let Obj_rect = new rectangle();
        for (let i = 0; i < ObjData.NumOfCenterP; i++) {
            const p = ObjData.CenterPSTC[i].Position;
            if (i === 0) {
                Obj_rect = new rectangle(p);
            } else {
                Obj_rect = spatial.getCircumscribedRectangle(p, Obj_rect);
            }
        }
        if (this.ObjectKind[ObjData.Kind].ObjectType === enmObjectGoupType_Data.NormalObject) {
            if (ObjData.NumOfLine > 0) {
                for (let i = 0; i < ObjData.NumOfLine; i++) {
                    Obj_rect = spatial.getCircumscribedRectangle(this.MPLine[ObjData.LineCodeSTC[i].LineCode].Circumscribed_Rectangle, Obj_rect);
                }
            }
        } else {
            const AggObs = this.Get_MpObj_used_AggregateObject(ObjData, clsTime.GetNullYMD());
            for (let i = 0; i < AggObs.length; i++) {
                const m = this.MPObj[AggObs[i]];
                if (this.ObjectKind[m.Kind].ObjectType === enmObjectGoupType_Data.NormalObject) {
                    Obj_rect = spatial.getCircumscribedRectangle(m.Circumscribed_Rectangle, Obj_rect);
                }
            }
        }
        ObjData.Circumscribed_Rectangle = Obj_rect;
        if (MapRectCheckF === true) {
            this.Check_MapCircumscribedRectangle(oldObjRect, Obj_rect);
        }
    }

    /**
     * 更新前後の矩形から地図全体の外接矩形を調整します。
     *
     * @param oldRect 更新前の矩形です。
     * @param newRect 更新後の矩形です。
     */
    Check_MapCircumscribedRectangle(oldRect: rectangle, newRect: rectangle) {
        if (spatial.Compare_Two_Rectangle_Position(this.Map.Circumscribed_Rectangle, newRect) !== cstRectangle_Cross.cstInclusion) {
            //内部に含まれない場合はUNIONで外接四角形を求める
            this.Map.Circumscribed_Rectangle = spatial.Get_Rectangle_Union(this.Map.Circumscribed_Rectangle, newRect);
        } else {
            //newRectが内部に含まれる場合
            if (spatial.Check_TwoRectangele_Inner_Contact(this.Map.Circumscribed_Rectangle, oldRect) === true) {
                //oldRectが地図データの外周の一部だった場合は再計算
                this.Map.Circumscribed_Rectangle = this.Get_Mapfile_Rectangle();
            }
        }
    }

    /**
     * 全ラインの外接矩形を再計算します。
     */
    Checl_All_Line_Maxmin() {
        const m = this.Map;
        for (let i = 0; i < m.ALIN; i++) {
            this.Check_Line_Maxmin(i, false);
        }
    }

    /**
     * 指定ラインの外接矩形を再計算します。
     *
     * @param Lcode ラインコードです。
     * @param MapRectCheckF 地図全体の外接矩形更新も行う場合は true です。
     */
    Check_Line_Maxmin(Lcode: number, MapRectCheckF: boolean) {
        const oldRect = this.MPLine[Lcode].Circumscribed_Rectangle;
        this.MPLine[Lcode].Circumscribed_Rectangle = spatial.getCircumscribedRectangle(this.MPLine[Lcode].PointSTC, undefined);
        if (MapRectCheckF === true) {
            this.Check_MapCircumscribedRectangle(oldRect, this.MPLine[Lcode].Circumscribed_Rectangle);
        }

    }

    /**
     * 選択されたオブジェクトグループ群が同種設定かを検査します。
     *
     * @param ObjSel 選択対象のオブジェクトグループ配列です。
     * @param check_objType オブジェクト種別も比較する場合は true です。
     * @param check_objNameListNum オブジェクト名リスト数と内容も比較する場合は true です。
     * @returns 不一致時のエラーメッセージです。一致する場合は空文字です。
     */
    Check_Selected_ObjectGroup_Same(ObjSel: boolean[], check_objType: boolean, check_objNameListNum: boolean) {
        // let f = true;
        let Emes = "";
        let SeFlOb = -1;
        for (let i = 0; i < this.Map.OBKNum; i++) {
            if (ObjSel[i] === true) {
                if (SeFlOb === -1) {
                    SeFlOb = i;
                } else {
                    if (this.ObjectKind[i].Shape !== this.ObjectKind[SeFlOb].Shape) {
                        Emes = "異なる形状のオブジェクトグループが選択されています。";
                        // f = false;
                        break;
                    }
                    if (check_objType === true) {
                        if (this.ObjectKind[i].ObjectType !== this.ObjectKind[SeFlOb].ObjectType) {
                            Emes = "異なるオブジェクトのタイプのオブジェクトグループが選択されています。";
                            // f = false;
                            break;
                        }
                    }
                    if (check_objNameListNum === true) {
                        if (this.ObjectKind[i].ObjectNameNum !== this.ObjectKind[SeFlOb].ObjectNameNum) {
                            Emes = "オブジェクト名リスト数が異なるオブジェクトグループが選択されています。";
                            // f = false;
                            break;
                        } else {
                            for (let j = 0; j < this.ObjectKind[i].ObjectNameNum; j++) {
                                if (this.ObjectKind[i].ObjectNameList[j] !== this.ObjectKind[SeFlOb].ObjectNameList[j]) {
                                    Emes = "オブジェクト名リストの名称が異なるオブジェクトグループが選択されています。";
                                    // f = false;
                                    i = this.Map.OBKNum - 1
                                    break;
                                }
                            }
                        }
                    }
                    if (this.ObjectKind[i].DefTimeAttDataNum !== this.ObjectKind[SeFlOb].DefTimeAttDataNum) {
                        Emes = "初期属性数が異なるオブジェクトグループが選択されています。";
                        // f = false;
                        break;
                    } else {
                        for (let j = 0; j < this.ObjectKind[i].DefTimeAttDataNum; j++) {
                            if ((this.ObjectKind[i].DefTimeAttSTC[j].attData.Title !== this.ObjectKind[SeFlOb].DefTimeAttSTC[j].attData.Title) ||
                                (this.ObjectKind[i].DefTimeAttSTC[j].attData.Unit !== this.ObjectKind[SeFlOb].DefTimeAttSTC[j].attData.Unit)) {
                                Emes = "初期属性のタイトルまたは単位が異なるオブジェクトグループが選択されています。";
                                // const f = false;
                                i = this.Map.OBKNum - 1;
                                break;
                            }
                        }
                    }
                }
            }
        }
        return Emes;
    }

    /**
     * 指定オブジェクトの境界線を面を描く順序へ並べ替えます。
     *
     * @param ObjData_objNum オブジェクト番号またはオブジェクトです。
     * @param Time 判定時点です。
     * @returns 並べ替え済み境界線情報です。
     */
    Boundary_Arrange(ObjData_objNum: number | strObj_Data, Time: strYMD) {
        const ELine = this.Get_EnableMPLine(ObjData_objNum, Time)
        const boundArrange = this.Boundary_Arrange_Sub(ELine);
        return boundArrange;
    }

    /**
     * 指定ライン群を面を描く順序へ並べ替えます。
     *
     * @param ELine 対象ライン群です。
     * @returns 並べ替え済み境界線情報です。
     */
    Boundary_Arrange_Sub(ELine: EnableMPLine_Data[]): boundArrangeData {
        const boundArrange: boundArrangeData = new boundArrangeData();
        const NL = ELine.length;
        if (NL === 0) {
            boundArrange.Pon = 0;
            return boundArrange;
        }
        const spxy: point[] = [];
        const epxy: point[] = [];
        for (let i = 0; i < NL; i++) {
            const LineNO = ELine[i].LineCode;
            spxy.push(this.MPLine[LineNO].PointSTC[0]);
            epxy.push(this.MPLine[LineNO].PointSTC[this.MPLine[LineNO].NumOfPoint - 1]);
        }
        const boundaryArrangeGeneral = spatial.BoundaryArrangeGeneral as (
            lineNum: number,
            startPoints: point[],
            endPoints: point[]
        ) => boundArrangeData;
        const result = boundaryArrangeGeneral(NL, spxy, epxy);
        if (result.Fringe) {
            for (let i = 0; i < NL; i++) {
                const fringeCode = result.Fringe[i].code;
                if (typeof fringeCode === 'number' && fringeCode < ELine.length) {
                    result.Fringe[i].code = ELine[fringeCode].LineCode ?? 0;
                }
            }
        }
        return result as boundArrangeData;
    }

    /**
     * 指定ラインが閉ループなら面積を返します。
     *
     * @param L_Code ラインコードです。
     * @returns ループ時の面積、ループでない場合は -1 です。
     */
    Get_LoopLine_Menseki(L_Code: number) {
        const ml = this.MPLine[L_Code];
        let men;
        const PN = ml.NumOfPoint;
        if (PN === 0) {
            return -1;
        }
        const PE = PN - 1;
        if (ml.PointSTC[PE].Equals(ml.PointSTC[0]) === true) {
            const pxy =Generic.ArrayClone( ml.PointSTC);
            pxy.push(ml.PointSTC[1].Clone());
            men = spatial.Get_Hairetu_Menseki(pxy, this.Map as { Zahyo: Zahyo_info; SCL: number });
        } else {
            men = -1;
        }
        return men;
    }

    /**
     * 指定オブジェクトの面積を重心付きで返します。
     *
     * @param ObjData 対象オブジェクトです。
     * @param L_Time 判定時点です。
     * @returns 面積と重心、面を構成できない場合は -1 です。
     */
    Menseki(ObjData: strObj_Data,  L_Time: strYMD): MensekiResult | -1 {
        const badata = this.Boundary_Arrange(ObjData, L_Time);
        if (badata.Pon <= 0) {
            return -1;
        } else {
            return this.Menseki_Sub( badata);
        }
    }

    /**
     * 境界線配列からポリゴンごとの面積だけを計算します。
     *
     * @param badata 境界線整列結果です。
     * @returns 中抜きを考慮した総面積です。
     */
    Menseki_sub2(badata: boundArrangeData) {
        const Pon = badata.Pon;
        const Arrange_LineCode = badata.Arrange_LineCode;
        const Fringe = badata.Fringe;
        const mens: number[] = Array.from({ length: Pon }) as number[];
        for (let i = 0; i < Pon; i++) {
            const LXY2: point[] = [];
            // const n2 = this.Get_Object_Polygon_Coords(i, 0, Arrange_LineCode, Fringe, LXY2, false, 1);
            this.Get_Object_Polygon_Coords(i, 0, Arrange_LineCode, Fringe, LXY2, false, 1);
            LXY2.push(LXY2[1]);
            mens[i] = spatial.Get_Hairetu_Menseki(LXY2, this.Map as { Zahyo: Zahyo_info; SCL: number });
        }
        let m: number;
        if (Pon === 1) {
            m = mens[0]
        } else {
            const TotalInOut: number[] = [];
            // const In_Out = this.Object_Polygon_InOut(badata, TotalInOut);
            this.Object_Polygon_InOut(badata, TotalInOut);
            m = 0;
            for (let i = 0; i < Pon; i++) {
                if ((TotalInOut[i] % 2) === 1) {
                    //何かのポリゴンに奇数回含まれるポリゴンは中抜け
                    mens[i] = -mens[i];
                } else {
                    m += mens[i];
                }
            }
        }
        return m as number;
    }

    /**
     * ポリゴンごとの面積と包含関係から総面積と代表重心を求めます。
     *
     * @param badata 境界線整列結果です。
     * @returns 総面積と代表重心です。
     */
    Menseki_Sub(badata: boundArrangeData): MensekiResult {
        // if ((GXY instanceof boundArrangeData) === true) {
        //     return this.Menseki_sub2(GXY);
        // }
        let GXY=new point();
        const Pon = badata.Pon;
        const Arrange_LineCode = badata.Arrange_LineCode;
        const Fringe = badata.Fringe;
        const mens: number[] = new Array<number>(Pon);
        const gp: point[] = new Array<point>(Pon);
        for (let i = 0; i < Pon; i++) {

            const LXY2: point[] = [];
            const n2 = this.Get_Object_Polygon_Coords(i, 0, Arrange_LineCode, Fringe, LXY2, false, 1);
            LXY2.push(LXY2[1]);
            let w = 0;
            if (n2 > 2) {
                //重心の位置を求める
                const wsw = new Array(n2 - 1);
                const a = LXY2[0].x;
                const b = LXY2[0].y;
                for (let j = 0; j < n2 - 1; j++) {
                    wsw[j] = (LXY2[j].x - a) * (LXY2[j + 1].y - b) - (LXY2[j + 1].x - a) * (LXY2[j].y - b);
                    w += wsw[j];
                }
                let xx = 0;
                let yy = 0;
                for (let j = 0; j < n2 - 1; j++) {
                    xx += wsw[j] * (LXY2[j].x + LXY2[j + 1].x)
                    yy += wsw[j] * (LXY2[j].y + LXY2[j + 1].y)
                }
                if (w !== 0) {
                    gp[i] =new point( (a + xx / w) / 3, (b + yy / w) / 3);
                }
            }

            if (n2 < 2) {
                gp[i] = LXY2[0];
            } else {
                mens[i] = spatial.Get_Hairetu_Menseki( LXY2, this.Map as { Zahyo: Zahyo_info; SCL: number });
                if (((mens[i] < 0.0000000001) && (gp[i] === undefined) ) || w === 0) {
                    //幅のないポリゴンはポイント座標で重心
                    let xx = 0;
                    let yy = 0;
                    for (let j = 0; j < n2 - 1; j++) {
                        xx += LXY2[j].x;
                        yy += LXY2[j].y;
                    }
                    gp[i] =new point(xx / (n2 - 1), yy / (n2 - 1));
                }
            }
        }
        let m: number;
        if (Pon === 1) {
            m = mens[0] as number;
            GXY = gp[0] as point;
        } else {
            const TotalInOut: number[] = [];
            // const In_Out = this.Object_Polygon_InOut(badata, TotalInOut);
            this.Object_Polygon_InOut(badata, TotalInOut);
            m = 0;
            let sm = 0;
            for (let i = 0; i < Pon; i++) {
                if ((TotalInOut[i] % 2) === 1) {
                    //何かのポリゴンに奇数回含まれるポリゴンは中抜け
                    mens[i] = -mens[i] as number;
                } else {
                    if (mens[i] > sm) {
                        //より面積の大きいポリゴンに重心を移す
                        GXY = gp[i] as point;
                        sm = mens[i] as number;
                    }
                }
                m += mens[i];
            }
        }
        return {menseki:m,gpoint:GXY};
    }

    /**
     * 指定点がオブジェクト内部に含まれるかを判定します。
     *
     * @param Obj_ObjNumber 対象オブジェクト番号またはオブジェクトです。
     * @param x 判定 X 座標です。
     * @param y 判定 Y 座標です。
     * @param LAY_Time 判定時点です。
     * @returns オブジェクト内部に含まれる場合は true です。
     */
    Check_Point_in_OneObject(Obj_ObjNumber: number | strObj_Data, x: number, y: number, LAY_Time: strYMD) {
        let obj;
        if ((typeof Obj_ObjNumber) === 'number') {
            obj = this.MPObj[Obj_ObjNumber];
        } else {
            obj = Obj_ObjNumber;
        }

        const Fringe_Line: number[] = [];
        const f = this.Check_Point_in_oneObject_Box(obj, x, y);
        if (f === true) {
            const ELine = this.Get_EnableMPLine(obj, LAY_Time);
            for (let j = 0; j < ELine.length; j++) {
                Fringe_Line.push(ELine[j].LineCode);
            }
            return this.Check_Point_in_Polygon_LineCode(x, y, Fringe_Line).ok;
        } else {
            return false
        }
    }

    /**
     * 指定点がオブジェクトの外接矩形に含まれるかを判定します。
     *
     * @param Obj_ObjNumber 対象オブジェクト番号またはオブジェクトです。
     * @param x 判定 X 座標です。
     * @param y 判定 Y 座標です。
     * @returns 外接矩形内なら true です。
     */
    Check_Point_in_oneObject_Box(Obj_ObjNumber: number | strObj_Data, x: number, y: number) {
        let obj;
        if ((typeof Obj_ObjNumber) === 'number') {
            obj = this.MPObj[Obj_ObjNumber];
        } else {
            obj = Obj_ObjNumber;
        }
        let f = false;
        if (obj.Shape !== enmShape.PointShape) {
            if (spatial.Check_PointInBox(new point(x, y), 0, obj.Circumscribed_Rectangle) === true) {
                f = true;
            }
        }
        return f;
    }

    /**
     * 1 オブジェクト内の複数ポリゴンについて包含関係を判定します。
     *
     * @param badata 境界線整列結果です。
     * @param TotalInOutNum 各ポリゴンが他ポリゴンに含まれる回数の出力先です。
     * @returns 包含関係行列です。
     */
    Object_Polygon_InOut(badata: boundArrangeData, TotalInOutNum: number[]) {
        const Polygon_Num = badata.Pon;
        const Arrange_LineCode = badata.Arrange_LineCode;
        const Fringe = badata.Fringe;

        const SIndex = new SpatialIndexSearch(SpatialPointType.SPIRect, false, undefined, undefined);

        TotalInOutNum.length=Polygon_Num;
        TotalInOutNum.fill(0);
        const InOut = Generic.Array2Dimension<number>(Polygon_Num, Polygon_Num, 0);

        for (let i = 0; i < Polygon_Num; i++) {
            let PRect = this.MPLine[Fringe[Arrange_LineCode[i][0]].code].Circumscribed_Rectangle;
            for (let j = 1; j < Arrange_LineCode[i][1]; j++) {
                const ML = this.MPLine[Fringe[Arrange_LineCode[i][0] + j].code];
                PRect = spatial.getCircumscribedRectangle(ML.Circumscribed_Rectangle, PRect);
            }
            SIndex.AddRect(PRect, i);
        }
        SIndex.AddEnd();
        for (let i = 0; i < Polygon_Num; i++) {
            const ML = this.MPLine[Fringe[Arrange_LineCode[i][0]].code];
            const X = ML.PointSTC[0].x;
            const Y = ML.PointSTC[0].y;
            const retRin = SIndex.GetRectIn(X, Y);
            if (retRin !== 0) {
                const n = retRin.number;
                // const Onum = retRin.ObStac;
                const Otags = retRin.Tags;

                for (let j = 0; j < n; j++) {
                    const LCD = Otags[j];
                    if (typeof LCD === 'number' && LCD !== i) {
                        const Fringe_Line: number[] = [];
                        const lcdData = Arrange_LineCode[LCD] as number[];
                        for (let k = 0; k < lcdData[1]; k++) {
                            Fringe_Line.push(Fringe[lcdData[0] + k].code);
                        }
                        const retV = this.Check_Point_in_Polygon_LineCode(X, Y, Fringe_Line);
                        if (retV.ok === true) {
                            const ML = this.MPLine[Fringe[Arrange_LineCode[i][0]].code];
                            const x2 = ML.PointSTC[1].x;
                            const y2 = ML.PointSTC[1].y;
                            const retV2 = this.Check_Point_in_Polygon_LineCode(x2, y2, Fringe_Line);
                            if (retV2.ok === true) {
                                //iがjの中に含まれる場合は(i,j)を1に
                                InOut[i][LCD] = 1;
                                TotalInOutNum[i]++;
                            }
                        }
                    }
                }
            }
        }
        return InOut;
    }

    /**
     * 指定点に対するポリゴン辺との交点を調べ、内外判定結果を返します。
     *
     * @param x 判定 X 座標です。
     * @param y 判定 Y 座標です。
     * @param Fringe_Line 境界を構成するライン番号配列です。
     * @returns 内部判定結果と交点 X 座標配列です。
     */
    Check_Point_in_Polygon_LineCode(x: number, y: number, Fringe_Line: number[]): PointInPolygonResult {
        const P = new point(x, y);
        const CheckLine: point[][] = [];

        for (let j = 0; j < Fringe_Line.length; j++) {
            const m = this.MPLine[Fringe_Line[j]];
            //調査地点のY座標を含むラインのみを選択
            if ((m.Circumscribed_Rectangle.top <= y) && (y <= m.Circumscribed_Rectangle.bottom)) {
                CheckLine.push(m.PointSTC);
            }
        }
        const result = spatial.check_Point_in_Polygon(P, CheckLine);
        return { ok: result.ok, CrossPoint_X: result.CrossPoint_X || [] };
    }

    /**
     * オブジェクト内の指定ポリゴンを連続座標列として取得します。
     *
     * @param Num ポリゴン番号です。
     * @param Get_Coords_Data 取得座標種別です。
     * @param Arrange_LineCode ポリゴンごとの並び替えライン情報です。
     * @param Fringe 境界線並び情報です。
     * @param poxy 取得座標列の出力先です。
     * @param Equal_XY_Get_F 連続重複点も保持する場合は true です。
     * @param getStep 座標取得間隔です。
     * @returns 取得した座標数です。
     */
    Get_Object_Polygon_Coords(Num: number, Get_Coords_Data: number, Arrange_LineCode: number[][], Fringe: Fringe_Line_Info[], poxy: point[], Equal_XY_Get_F: boolean, getStep: number) {
        //Get_Coords_Data
        //0:座標値そのもの
        //1:スクリーン上の座標に変換 --今は使わない。呼び出し元で変換する
        //2:世界測地系の緯度経度
        //3:元々の座標系の座標で取得

        // const Pnum = this.Get_Object_Polygon_Points(Num, Arrange_LineCode, Fringe);
        this.Get_Object_Polygon_Points(Num, Arrange_LineCode, Fringe);
        poxy.length = 0;
        let n = 0;
        for (let i = 0; i < Arrange_LineCode[Num][1]; i++) {
            const XYS: point[] = [];
            const Fr = Fringe[Arrange_LineCode[Num][0] + i];
            const PN = this.Get_Coords_by_LineCode(Fr.code, Get_Coords_Data, Fr.Direction, XYS, getStep);
            for (let j = 0; j < PN; j++) {
                if ((n === 0) || (Equal_XY_Get_F === true)) {
                    poxy.push( XYS[j]);
                    n++;
                } else {
                    if (poxy[n - 1].Equals(XYS[j]) === true) {
                        // 重複点は追加しない
                    } else {
                        poxy.push(XYS[j]);
                        n++;
                    }
                }
            }
        }
        return n
    }

    /**
     * 指定ポリゴンを構成する総ポイント数を返します。
     *
     * @param Num ポリゴン番号です。
     * @param Arrange_LineCode ポリゴンごとの並び替えライン情報です。
     * @param Fringe 境界線並び情報です。
     * @returns 総ポイント数です。
     */
    Get_Object_Polygon_Points(Num: number, Arrange_LineCode: number[][], Fringe: Fringe_Line_Info[]) {
        let Pnum = 0;
        for (let i = 0; i < Arrange_LineCode[Num][1]; i++) {
            const L = Fringe[Arrange_LineCode[Num][0] + i].code;
            Pnum += this.MPLine[L].NumOfPoint;
        }
        return Pnum;

    }

    /**
     * 指定ラインの座標列を取得種別に応じて返します。
     *
     * @param LCode ラインコードです。
     * @param Get_Coords_Data 取得座標種別です。
     * @param P_Dir 取得方向です。1 は順方向、-1 は逆方向です。
     * @param XYS 出力先座標配列です。
     * @param getStep 座標取得間隔です。
     * @returns 取得した座標数です。
     */
    Get_Coords_by_LineCode(LCode: number, Get_Coords_Data: number, P_Dir: number, XYS: point[], getStep: number) {
        let fs;
        let fe;
        let fst;
        const ML = this.MPLine[LCode];
        if ((getStep + 1 >= ML.NumOfPoint) && (ML.PointSTC[0].Equals(ML.PointSTC[ML.NumOfPoint - 1]) === true)) {
            //ループで2地点となって点になるのをふせぐ
            getStep = 1;
        }
        XYS.length = ML.NumOfPoint;
        if (P_Dir === 1) {
            fs = 0;
            fe = ML.NumOfPoint - 1;
            fst = getStep;
        } else {
            fs = ML.NumOfPoint - 1;
            fe = 0;
            fst = -getStep;
        }

        let n = 0
        let lastp = fs
        for (let i = fs; i !== fe+fst; i += fst) {
            let xy;
            switch (Get_Coords_Data) {
                case 0:
                    xy = ML.PointSTC[i];
                    break;
                case 1:
                    break;
                case 2:
                    xy = spatial.Get_Reverse_XY(ML.PointSTC[i], this.Map.Zahyo);
                    xy = spatial.Get_World_IdoKedo(xy, this.Map.Zahyo).toPoint();
                    if (xy.x > 180) {
                        xy.x -= 360;
                    }
                    break;
                case 3:
                    xy = spatial.Get_Reverse_XY(ML.PointSTC[i], this.Map.Zahyo);
            }
            lastp = i;
            XYS[n] = xy;
            n++;
        }
        if (lastp !== fe) {
            let xy;
            switch (Get_Coords_Data) {
                case 0:
                    xy = ML.PointSTC[fe];
                    break;
                case 2:
                    xy = spatial.Get_Reverse_XY(ML.PointSTC[fe], this.Map.Zahyo);
                    xy = spatial.Get_World_IdoKedo(xy, this.Map.Zahyo).toPoint();
                    if (xy.x > 180) {
                        xy.x -= - 360;
                    }
                    break;
                case 3:
                    xy = spatial.Get_Reverse_XY(ML.PointSTC[fe], this.Map.Zahyo);
            }
            XYS[n] = xy;
            n++;
        }
        return n
    }

    /**
     * 指定オブジェクトで指定時点に使用可能なライン一覧を返します。
     *
     * @param ObjData_objNum 対象オブジェクト番号またはオブジェクトです。
     * @param Time 判定時点です。
     * @returns 利用可能ライン一覧です。
     */
    Get_EnableMPLine(ObjData_objNum: number | strObj_Data, Time: strYMD): EnableMPLine_Data[] {
        let ObjData: strObj_Data;
        if ((ObjData_objNum instanceof strObj_Data) === false) {
            ObjData = this.MPObj[ObjData_objNum as number];
        } else {
            ObjData = ObjData_objNum;
        }

        let LCode: EnableMPLine_Data[] = [];
        if (this.ObjectKind[ObjData.Kind].ObjectType === enmObjectGoupType_Data.AggregationObject) {
            const AggObs = this.Get_MpObj_used_AggregateObject(ObjData, Time);
            for (let i = 0; i < AggObs.length; i++) {
                const lc = AggObs[i];
                if (this.ObjectKind[this.MPObj[lc].Kind].ObjectType === enmObjectGoupType_Data.NormalObject) {
                    const E_LCode = this.Get_EnableMPLine_Normal(this.MPObj[lc], Time);
                    if (E_LCode) {
                        LCode = LCode.concat(E_LCode);
                    }
                }
            }
            if (LCode.length > 0) {
                LCode = Generic.Get_Outer_Mpline_AggregatedObj(LCode, this.ObjectKind[ObjData.Kind].Shape)
            }
        } else {
            LCode = this.Get_EnableMPLine_Normal(ObjData, Time);
        }
        return LCode;
    }

    /**
     * 集成オブジェクトを構成する元オブジェクト番号一覧を返します。
     *
     * @param ObjData 対象集成オブジェクトです。
     * @param Time 判定時点です。
     * @returns 構成元オブジェクト番号配列です。
     */
    Get_MpObj_used_AggregateObject(ObjData: strObj_Data, Time: strYMD): number[] {
        this.Enable_MPObjStac = [];
        this.Get_MpObj_used_AggregateObject_Sub(ObjData, Time)
        return this.Enable_MPObjStac;
    }

    /**
     * 集成オブジェクトの構成元を再帰的に収集します。
     *
     * @param ObjData 対象集成オブジェクトです。
     * @param Time 判定時点です。
     */
    Get_MpObj_used_AggregateObject_Sub(ObjData: strObj_Data, Time: strYMD) {
        for (let i = 0; i < ObjData.NumOfLine; i++) {
            const lc = this.Check_Enable_LineCode(ObjData.LineCodeSTC[i], Time)
            if (lc !== -1) {
                if (this.CheckEnableObject(this.MPObj[lc], Time) === true) {
                    this.Enable_MPObjStac.push(lc);
                    if (this.ObjectKind[this.MPObj[lc].Kind].ObjectType === enmObjectGoupType_Data.AggregationObject) {
                        //集成オブジェクトを参照している場合はさらに再帰処理
                        this.Get_MpObj_used_AggregateObject_Sub(this.MPObj[lc], Time)
                    }
                }
            }
        }
    }

    /**
     * ラインコードスタックが指定時点で有効かを判定します。
     *
     * @param Lcode_Stac 判定対象のラインコード情報です。
     * @param Time 判定時点です。
     * @returns 有効なラインコード、無効な場合は -1 です。
     */
    Check_Enable_LineCode(Lcode_Stac: LineCodeStac_Data, Time: strYMD): number {
        if ((Lcode_Stac.NumOfTime === 0) || (Time.nullFlag() === true)) {
            return Lcode_Stac.LineCode ?? -1;
        } else {
            for (let i = 0; i < (Lcode_Stac.NumOfTime ?? 0); i++) {
                if (clsTime.checkDurationIn(Lcode_Stac.Times[i], Time) === true) {
                    return Lcode_Stac.LineCode ?? -1;
                }
            }
        }
        return -1;
    }

    /**
     * ラインが指定時点で有効な線種を返します。
     *
     * @param MpLine 判定対象ラインです。
     * @param Check_Time 判定時点です。
     * @returns 有効な線種番号、無効な場合は -1 です。
     */
    Check_Enable_Line(MpLine: strLine_Data, Check_Time: strYMD) {
        let L_K = -1;
        if (Check_Time.nullFlag() === true) {
            L_K = MpLine.LineTimeSTC[0].Kind;
        } else {
            for (let i = 0; i < MpLine.NumOfTime; i++) {
                if (clsTime.checkDurationIn(MpLine.LineTimeSTC[i].SETime, Check_Time) === true) {
                    L_K = MpLine.LineTimeSTC[i].Kind;
                    break;
                }
            }
        }
        return L_K;
    }

    /**
     * 通常オブジェクトで指定時点に有効なライン一覧を返します。
     *
     * @param ObjData 対象オブジェクトです。
     * @param Time 判定時点です。
     * @returns 利用可能ライン一覧です。オブジェクト自体が無効な場合は undefined です。
     */
    Get_EnableMPLine_Normal(ObjData: strObj_Data, Time: strYMD): EnableMPLine_Data[] | undefined {
        const Enable_LCode = [];
        if (Time.nullFlag() === true) {
            for (let i = 0; i < ObjData.NumOfLine; i++) {
                const ls = ObjData.LineCodeSTC[i];
                const d = new EnableMPLine_Data();
                d.LineCode = ls.LineCode;
                d.Kind = this.MPLine[ls.LineCode].LineTimeSTC[0].Kind;
                Enable_LCode.push(d);
            }
            return Enable_LCode;
        } else {
            if (this.CheckEnableObject(ObjData, Time) === false) {
                return undefined;
            }
        }
        for (let i = 0; i < ObjData.NumOfLine; i++) {
            let L_K, f;
            const L_Code = this.Check_Enable_LineCode(ObjData.LineCodeSTC[i], Time);
            if (L_Code !== -1) {
                L_K = this.Check_Enable_Line(this.MPLine[L_Code], Time);
                if (L_K !== -1) {
                    f = true;
                }
                if (f === true) {
                    if (this.Map.Time_Mode === true) {
                        if (this.ObjectKind[ObjData.Kind].UseLineType[L_K] === true) {
                            const d = new EnableMPLine_Data();
                            d.LineCode = L_Code;
                            d.Kind = L_K;
                            Enable_LCode.push(d);
                        }
                    } else {
                        const d = new EnableMPLine_Data();
                        d.LineCode = L_Code;
                        d.Kind = L_K;
                        Enable_LCode.push(d);
                    }
                }
            }
        }
        return Enable_LCode;
    }



    /**
     * 指定時点にオブジェクトが有効かを判定します。
     *
     * @param ObjData 判定対象オブジェクトです。
     * @param Time 判定時点です。
     * @returns 有効期間に含まれる場合は true です。
     */
    CheckEnableObject(ObjData: strObj_Data, Time: strYMD) {
        if (!ObjData) {
            return false;
        }
        const nameTimeCount = ObjData.NumOfNameTime ?? ObjData.NameTimeSTC.length;
        for (let i = 0; i < nameTimeCount; i++) {
            const nameTime = ObjData.NameTimeSTC[i];
            if (nameTime && clsTime.checkDurationIn(nameTime.SETime, Time) === true) {
                return true;
            }
        }
        return false;
    }

    /**
     * 指定オブジェクトグループの初期属性定義をすべて削除します。
     *
     * @param objG 対象オブジェクトグループ番号です。
     */
    DeleteAllDefAttrData(objG: number) {
        this.ObjectKind[objG].DefTimeAttDataNum = 0;
        this.DefTimeAttSTC = [];
        for (let i = 0; i < this.Map.Kend; i++) {
            if (this.MPObj[i].Kind === objG) {
                this.MPObj[i].DefTimeAttValue = [];
            }
        }
    }

    /**
     * オブジェクトグループ連動型を展開した線種一覧を返します。
     *
     * @returns 展開済み線種一覧です。
     */
    Get_TotalLineKind(): LPatSek_Info[] {
        const LPC: LPatSek_Info[] = [];
        for (let i = 0; i < this.Map.LpNum; i++) {
            const lk = this.LineKind[i];
            for (let j = 0; j < lk.NumofObjectGroup; j++) {
                const LP = new LPatSek_Info();
                LP.Pat = lk.ObjGroup[j].Pattern;
                LP.LKind = i;
                LP.LkindPatNum = j;
                LP.Name = (j === 0) ? lk.Name : "-" + this.ObjectKind[lk.ObjGroup[j].GroupNumber].Name;
                LPC.push(LP);
            }
        }
        return LPC;
    }

    /**
     * オブジェクトグループ連動型を含めた総線種数を返します。
     *
     * @returns 展開後の線種数です。
     */
    Get_TotalLineKind_Num() {
        let PatNum = 0;
        for (let i = 0; i < this.Map.LpNum; i++) {
            PatNum += this.LineKind[i].NumofObjectGroup;
        }
        return PatNum;
    }

    /**
     * 指定オブジェクトの初期属性値を時点条件込みで取得します。
     *
     * @param ObjCode オブジェクト番号です。
     * @param defNumber 属性項目番号です。
     * @param Time 取得時点です。
     * @returns 取得した属性値です。条件に一致しない場合は undefined です。
     */
    Get_DefTimeAttrValue(ObjCode: number, defNumber: number, Time: strYMD) {
        const ob = this.MPObj[ObjCode];
        if (!ob) {
            return undefined;
        }
        const ogp = ob.Kind;
        const defTimeAttValue = ob.DefTimeAttValue[defNumber];
        if (!defTimeAttValue) {
            return undefined;
        }
        if (ogp === undefined || !this.ObjectKind[ogp]) {
            return undefined;
        }
        let Value;
        if (this.Map.Time_Mode === false) {
            return defTimeAttValue.Data[0]?.Value;
        } else {
            if (Time.nullFlag() === true) {
                return undefined;
            }
            const dev = defTimeAttValue;
            const n = dev.Data.length;

            if (n === 0) {
                return undefined;
            }
            const defTimeAttSetting = this.ObjectKind[ogp].DefTimeAttSTC[defNumber];
            if (!defTimeAttSetting) {
                return undefined;
            }
            switch (defTimeAttSetting.Type) {
                case enmDefTimeAttDataType.PointData:
                    //時点データの場合
                    for (let i = 0; i < n; i++) {
                        if (dev.Data[i].Span.StartTime.Equals(Time) === true) {
                            //同じ時点のデータがあった場合
                            return dev.Data[i].Value;
                        }
                    }
                    //なかった場合
                    switch (this.ObjectKind[ogp].DefTimeAttSTC[defNumber].ExtraValue) {
                        case enmDefPointAttDataExtraValue.MissingValue:
                            //欠損値
                            return undefined;
                            break;
                        case enmDefPointAttDataExtraValue.NearestValue: {
                            //一番近い値
                            const ff = true;
                            let minDay;
                            for (let i = 0; i < n; i++) {
                                const daten = Math.abs(clsTime.getDifference(dev.Data[i].Span.StartTime, Time));
                                if (ff === true) {
                                    minDay = daten;
                                    Value = dev.Data[i].Value;
                                } else {
                                    if (minDay < daten) {
                                        minDay = daten;
                                        Value = dev.Data[i].Value;
                                    }
                                }
                            }
                            return Value;
                            break;
                        }
                        case enmDefPointAttDataExtraValue.interpolation_MissingValue:
                        case enmDefPointAttDataExtraValue.interpolation_NearestValue:
                            //間に挟まれた場合は按分
                            for (let i = 0; i < n - 1; i++) {
                                const span = new Start_End_Time_data();
                                span.StartTime = dev.Data[i].Span.StartTime;
                                span.EndTime = dev.Data[i + 1].Span.StartTime;
                                if (clsTime.checkDurationIn(span, Time) === true) {
                                    const v1 = Number(dev.Data[i].Value.replace(",", ""));
                                    const v2 = Number(dev.Data[i + 1].Value.replace(",", ""));
                                    const vsa = v2 - v1;
                                    const daten1 = Math.abs(clsTime.getDifference(span.StartTime, Time));
                                    const daten2 = Math.abs(clsTime.getDifference(span.StartTime, span.EndTime));
                                    const v3 = v1 + vsa * (daten1 / daten2);
                                    // if(isNaN(v3)){console.log(ob,ObjCode, defNumber,dev.Data[i].Value , dev.Data[i+1].Value)}
                                    return String(v3);
                                }
                            }
                            switch (this.ObjectKind[ogp].DefTimeAttSTC[defNumber].ExtraValue) {
                                case enmDefPointAttDataExtraValue.interpolation_MissingValue:
                                    //間に挟まれていない場合は欠損値
                                    return undefined;
                                    break;
                                case enmDefPointAttDataExtraValue.interpolation_NearestValue:
                                    //間に挟まれていない場合は近い値

                                    if (dev.Data[0].Span.StartTime.nullFlag() === true) {
                                        return dev.Data[0].Value;
                                    } else {
                                        const d1 = Math.abs(clsTime.getDifference(dev.Data[0].Span.StartTime, Time));
                                        const d2 = Math.abs(clsTime.getDifference(dev.Data[n - 1].Span.StartTime, Time));
                                        if (d1 < d2) {
                                            return dev.Data[0].Value;
                                        } else {
                                            if (dev.Data[n - 1].Value === null) {
                                                return undefined;
                                            } else {
                                                return dev.Data[n - 1].Value;
                                            }
                                        }
                                    }
                                    break;
                            }
                            break;
                    }
                    break;
                case enmDefTimeAttDataType.SpanData:
                    //期間データの場合
                    for (let i = 0; i < dev.Data.length ; i++) {
                        if (clsTime.checkDurationIn(dev.Data[i].Span, Time) === true) {
                            return dev.Data[i].Value;
                        }
                    }
                    return undefined;
                    break;
            }
            return Value;
        }
    }

    /**
     * 2 つのオブジェクト間距離を求めます。
     *
     * 線オブジェクトと面・点オブジェクトの組み合わせでは、線と代表点の最短距離を使います。
     *
     * @param O_Code1 1 つ目のオブジェクト番号です。
     * @param O_Code2 2 つ目のオブジェクト番号です。
     * @param Time1 1 つ目の判定時点です。
     * @param Time2 2 つ目の判定時点です。
     * @returns 計算した距離です。
     */
    Distance_Object(O_Code1: number, O_Code2: number, Time1: strYMD, Time2: strYMD) {
        let P1;
        let P2;
        if (this.MPObj[O_Code2].Shape === enmShape.LineShape) {
            [O_Code1, O_Code2] = [O_Code2, O_Code1];
            [Time1, Time2] = [Time2, Time1];
        }

        let d;
        if (this.MPObj[O_Code1].Shape === enmShape.LineShape) {
            //一方が線オブジェクトの場合
            P2 = this.Get_Enable_CenterP(O_Code2, Time2);
            d = this.Get_Distance_Between_ObjectLine_and_Point(O_Code1, Time1, P2);
        } else {
            P1 = this.Get_Enable_CenterP(O_Code1, Time1);
            P2 = this.Get_Enable_CenterP(O_Code2, Time2);
            if (this.Map.Zahyo.Mode === enmZahyo_mode_info.Zahyo_Ido_Keido) {
                d = spatial.Distance_Ido_Kedo_XY_Point(P1, P2, this.Map.Zahyo);
            } else {
                d = spatial.Distance_Point(P1, P2) / this.Map.SCL;
            }
        }
        return d;
    }

    /**
     * 指定中心点とオブジェクトの距離を求めます。
     *
     * @param CP 基準となる中心点です。
     * @param O_Code1 対象オブジェクト番号です。
     * @param Time1 判定時点です。
     * @returns 計算した距離です。
     */
    Distance_ObjectCenterP(CP: point, O_Code1: number,  Time1: strYMD) {
        let d;
        if (this.MPObj[O_Code1].Shape === enmShape.LineShape) {
            //一方が線オブジェクトの場合
            d = this.Get_Distance_Between_ObjectLine_and_Point(O_Code1, Time1, CP);
        } else {
            const P1 = this.Get_Enable_CenterP(O_Code1, Time1);
            if (this.Map.Zahyo.Mode === enmZahyo_mode_info.Zahyo_Ido_Keido) {
                d = spatial.Distance_Ido_Kedo_XY_Point(CP, P1, this.Map.Zahyo);
            } else {
                d = spatial.Distance_Point(CP, P1) / this.Map.SCL;
            }
        }
        return d;
    }

    /**
     * 線オブジェクトと指定点の最短距離を求めます。
     *
     * @param Ocode 対象オブジェクト番号です。
     * @param Time 判定時点です。
     * @param P 基準点です。
     * @returns 最短距離です。
     */
    Get_Distance_Between_ObjectLine_and_Point(Ocode: number,  Time: strYMD,  P: point){
        const ELine=this.Get_EnableMPLine(this.MPObj[Ocode], Time);
        return this.Distance_PointMPLineAllay(P,  ELine)
    }

    /**
     * 指定点とライン集合との最短距離を求めます。
     *
     * @param P 基準点です。
     * @param LCode 対象ライン集合です。
     * @returns 最短距離です。
     */
    Distance_PointMPLineAllay(P: point, LCode: EnableMPLine_Data[]) {
        let mind;
        let f = false;
        for (let i = 0; i < LCode.length; i++) {
            const lc = LCode[i].LineCode;
            const ml = this.MPLine[lc];
            const ln = ml.NumOfPoint;
            for (let j = 0; j < ln - 1; j++) {
                // let nearP;
                const DD = spatial.Distance_PointLine2(P, ml.PointSTC[j], ml.PointSTC[j + 1]);
                let dist = DD.distance;
                if (this.Map.Zahyo.Mode === enmZahyo_mode_info.Zahyo_Ido_Keido) {
                    dist = spatial.Distance_Ido_Kedo_XY_Point(P, DD.nearP, this.Map.Zahyo)
                }
                if (f === false) {
                    mind = dist;
                    f = true;
                } else {
                    if (dist < mind) {
                        mind = DD.distance;
                    }
                }
            }
        }
        if (this.Map.Zahyo.Mode === enmZahyo_mode_info.Zahyo_Ido_Keido) {
            return mind;
        } else {
            return mind / this.Map.SCL;
        }
    }


    /**
     * ライン中で連続する同一点を削除します。
     *
     * @param Linenum 対象ライン番号です。
     */
    DeleteSamePoints_inLine(Linenum: number) {

        const ml = this.MPLine[Linenum];
        if (ml.NumOfPoint > 0) {
            const ReMovePoint = [];
            ReMovePoint[0] = ml.PointSTC[0].Clone();
            for (let j = 1; j < ml.NumOfPoint; j++) {
                if (ml.PointSTC[j - 1].Equals(ml.PointSTC[j]) !== true) {
                    ReMovePoint.push(ml.PointSTC[j].Clone());
                }
            }
            if (ml.NumOfPoint !== ReMovePoint.length) {
                ml.PointSTC = ReMovePoint;
                ml.NumOfPoint = ReMovePoint.length;
            }
        }
    }

    /**
     * 指定ライン群の共通部分を抽出して位相構造化します。
     *
     * @param TopologyLineList 対象ライン番号一覧です。未指定時は全ラインを対象にします。
     * @returns ライン構成に変更があった場合は true です。
     */
    TopologyStructure_SameLine(TopologyLineList: number[]) {
        if (TopologyLineList === undefined) {
            //全ライン
            TopologyLineList = [];
            for (let i = 0; i < this.Map.ALIN; i++) {
                TopologyLineList.push(i);;
            }
        }
        let Result = false;
        TopologyLineList.sort(function (a: number, b: number) { return a - b; })
        for (const i in TopologyLineList) {
            this.DeleteSamePoints_inLine(TopologyLineList[i]);
        }

        let icount = 0;
        do {
            const i = TopologyLineList[icount];
            let jcount = icount + 1;
            while (jcount < TopologyLineList.length) {
                const j = TopologyLineList[jcount];
                let f;
                do {
                    const ODALIN1 = this.Map.ALIN;
                    f = this.TopologyStructure_Two_SameLine(i, j);
                    if (f === true) {
                        if (ODALIN1 > this.Map.ALIN) {
                            //二つのラインが全く同じで、片方が削除された場合
                            TopologyLineList.splice(jcount, 1);
                            for (let k = 0; k < TopologyLineList.length; k++) {
                                if (TopologyLineList[k] > j) {
                                    TopologyLineList[k]--;
                                }
                            }
                            break;
                        }
                    } else if (ODALIN1 < this.Map.ALIN) {
                        //ラインが増えた場合
                        for (let k = ODALIN1; k < this.Map.ALIN; k++) {
                            TopologyLineList.push(k);
                        }
                    } else {
                        f = false;
                    }
                    if (f === true) {
                        Result = true;
                    }
                } while (f === true);
                jcount++;
            }
            icount++;
        } while (icount < TopologyLineList.length);
        return Result;
    }

    /**
     * 2 本のラインの共通部分を抽出して位相構造化します。
     *
     * @param LCode1 1 本目のライン番号です。
     * @param LCode2 2 本目のライン番号です。
     * @returns 共通部分が見つかり再構成が行われた場合は true です。
     */
    TopologyStructure_Two_SameLine(LCode1: number, LCode2: number) {

        const mLine1 = this.MPLine[LCode1];
        const mLine2 = this.MPLine[LCode2];
        if (spatial.Compare_Two_Rectangle_Position_Inflated(mLine1.Circumscribed_Rectangle, mLine2.Circumscribed_Rectangle, 0.0001) === cstRectangle_Cross.cstOuter) {
            //ラインが重ならない場合
            return false;
        }
        //時間設定が同じかチェック
        if (mLine1.NumOfTime !== mLine2.NumOfTime) {
            return false;
        } else {
            for (let i = 0; i < mLine1.NumOfTime; i++) {
                if (mLine1.LineTimeSTC[i].Equals(mLine2.LineTimeSTC[i]) === false) {
                    //時間設定・線種が異なる場合
                    return false;
                }
            }
        }

        if (this.Check_Points_Of_Two_Lines(LCode1, LCode2) === true) {
            //全く同じラインだった場合
            for (let i = 0; i < this.Map.Kend; i++) {
                const mo = this.MPObj[i];
                if (this.ObjectKind[mo.Kind].ObjectType === enmObjectGoupType_Data.NormalObject) {
                    for (let j = 0; j < mo.NumOfLine; j++) {
                        const mol = mo.LineCodeSTC[j];
                        if (mol.LineCode === LCode2) {
                            mol.LineCode = LCode1;
                        }
                    }
                }
            }
            this.Erase_Line(LCode2, false);
            return true;
        }

        const TwoRect = spatial.Get_Rectangle_Union(mLine1.Circumscribed_Rectangle, mLine2.Circumscribed_Rectangle);
        const PNum1 = mLine1.NumOfPoint;
        const XYstac1 = mLine1.PointSTC;
        const PNum2 = mLine2.NumOfPoint;
        const XYstac2 = mLine2.PointSTC;

        //    最初に座標が一致するポイントを取得
        const PointIndex = new SpatialIndexSearch(SpatialPointType.SinglePoint, false, TwoRect);
        PointIndex.AddSinglePoint_Array(PNum2, XYstac2 as unknown as latlon[], -1);
        PointIndex.AddEnd();

        let f = false;
        for (let i = 0; i < PNum1; i++) {
            const retV = PointIndex.GetSamePointNumber(XYstac1[i].x, XYstac1[i].y);
            if (retV.ObjectNumber !== -1) {
                f = this.TopologyStructure_Two_SameLine_Check(LCode1, LCode2, PNum1, PNum2, i, retV.ObjectNumber, XYstac1, XYstac2);
                if (f === true) {
                    break;
                }
            }
        }
        return f;
    }

    /**
     * 2 本のラインの一致区間を切り出して再構成します。
     *
     * @param LCode1 1 本目のライン番号です。
     * @param LCode2 2 本目のライン番号です。
     * @param PNum1 1 本目のポイント数です。
     * @param PNum2 2 本目のポイント数です。
     * @param S1 1 本目の一致開始位置です。
     * @param s2 2 本目の一致開始位置です。
     * @param XYstac1 1 本目の座標列です。
     * @param XYstac2 2 本目の座標列です。
     * @returns 再構成が行われた場合は true です。
     */
    TopologyStructure_Two_SameLine_Check(LCode1: number, LCode2: number, PNum1: number, PNum2: number, S1: number, s2: number, XYstac1: point[], XYstac2: point[]) {

        const NewPnum1: { A: number, B: number, NewXYstacA: point[], NewXYstacB: point[] } = { A: 0, B: 0, NewXYstacA: [], NewXYstacB: [] };
        const NewPnum2: { A: number, B: number, NewXYstacA: point[], NewXYstacB: point[] } = { A: 0, B: 0, NewXYstacA: [], NewXYstacB: [] };
        let JointPnum;
        const NewXYstacJoint = [];
        let jp;

        let Start1, Start2

        //同一方向で、同じ座標が続くか調べる
        let naH2;
        let naH1 = this.TopologyStructure_Two_SameLine_sub(S1, s2, 1, 1, PNum1, PNum2, XYstac1, XYstac2);
        if (naH1 === 1) {
            //同一方向で続いていない場合、線2を逆方向にたどる
            naH1 = this.TopologyStructure_Two_SameLine_sub(S1, s2, 1, -1, PNum1, PNum2, XYstac1, XYstac2);
            naH2 = -naH1;
        } else {
            naH2 = naH1;
        }

        const Loop1F = XYstac1[0].Equals(XYstac1[PNum1 - 1]);
        if ((S1 === 0) && (Loop1F === true)) {
            let j;
            let nRev1;
            //線1がループで､始点が一致箇所の場合
            if (naH1 === 1) {
                //始点からはたどれない場合は終点から逆方向へ
                nRev1 = -this.TopologyStructure_Two_SameLine_sub(PNum1 - 1, s2, -1, 1, PNum1, PNum2, XYstac1, XYstac2);
                if (nRev1 === -1) {
                    return false;
                }

                naH2 = -nRev1;
                if (nRev1 === -1) {
                    //同一方向で続いていない場合、線2を逆方向にたどる
                    nRev1 = -this.TopologyStructure_Two_SameLine_sub(PNum1 - 1, s2, -1, -1, PNum1, PNum2, XYstac1, XYstac2);
                    naH2 = nRev1;
                }
                JointPnum = Math.abs(nRev1);
                j = PNum1 - JointPnum;
                if (PNum1 === Math.abs(nRev1)) {
                    //１周分続く場合
                    naH1 = PNum1;
                } else {
                    this.TopologyStructure_Two_SameLine_Cutsub(PNum1 - 1, nRev1, PNum1, NewPnum1, XYstac1);
                }
                this.TopologyStructure_Two_SameLine_Cutsub(s2, naH2, PNum2, NewPnum2, XYstac2);
            } else {
                if (PNum1 === naH1) {
                    //１周分続く場合
                    JointPnum = naH1;
                    this.TopologyStructure_Two_SameLine_Cutsub(s2, naH2, PNum2, NewPnum2, XYstac2);
                } else {
                    //始点からも、終点からもたどれる場合
                    if (naH2 < 0) {
                        jp = 1;
                    } else {
                        jp = -1;
                    }
                    nRev1 = this.TopologyStructure_Two_SameLine_sub(PNum1 - 1, s2, -1, jp, PNum1, PNum2, XYstac1, XYstac2);
                    Start1 = naH1 - 1;

                    const Len1 = naH1 + nRev1 - 1;
                    this.TopologyStructure_Two_SameLine_Cutsub(Start1, -Len1, PNum1, NewPnum1, XYstac1);
                    Start2 = s2 + naH2 + 1;
                    let Len2 = Len1;
                    if (naH2 > 0) {
                        Len2 = -Len2;
                    }
                    this.TopologyStructure_Two_SameLine_Cutsub(Start2, Len2, PNum2, NewPnum2, XYstac2);
                    JointPnum = naH1 + nRev1 - 1;
                    j = PNum1 - nRev1;
                }
            }

            for (let i = 0; i < JointPnum; i++) {
                NewXYstacJoint[i] = XYstac1[j].Clone();
                j++;
                if (j >= PNum1) {
                    j = 1;
                }
            }
        } else {
            if (naH1 === 1) {
                return false;
            }
            JointPnum = naH1;
            let j = S1;
            for (let i = 0; i < JointPnum; i++) {
                NewXYstacJoint[i] = XYstac1[j].Clone();
                j++;
                if (j > PNum1) {
                    j = 1;
                }
            }
            this.TopologyStructure_Two_SameLine_Cutsub(S1, naH1, PNum1, NewPnum1, XYstac1);
            this.TopologyStructure_Two_SameLine_Cutsub(s2, naH2, PNum2, NewPnum2, XYstac2);
        }

        //ラインを保存
        let PushLine = new strLine_Data();
        if ((Math.abs(naH1) !== PNum1) && (NewPnum1.A !== 1)) { //NewPnum1a!==1は、特殊なパターンでラインの点が1つになってしまう場合があるため
            PushLine = this.MPLine[LCode1].Clone();
            PushLine.NumOfPoint = NewPnum1.A;
            PushLine.PointSTC = Generic.ArrayClone(NewPnum1.NewXYstacA);
            this.Save_Line(PushLine, false, false, true);
        }

        if ((Math.abs(naH2) !== PNum2) && (NewPnum2.A !== 1)) { //NewPnum1.A!==2は、特殊なパターンでラインの点が1つになってしまう場合があるため
            PushLine = this.MPLine[LCode2].Clone();
            PushLine.NumOfPoint = NewPnum2.A;
            PushLine.PointSTC = Generic.ArrayClone(NewPnum2.NewXYstacA);
            this.Save_Line(PushLine, false, false, true);
        }


        if ((JointPnum !== PNum1) && (JointPnum !== PNum2)) {
            PushLine = this.MPLine[LCode1].Clone();
            PushLine.Number = -1;
            PushLine.NumOfPoint = JointPnum;
            PushLine.PointSTC = Generic.ArrayClone(NewXYstacJoint);
            this.Save_Line(PushLine, false, false, true);
            this.Topology_Line_Object_Shori(LCode1, this.Map.ALIN - 1);
            this.Topology_Line_Object_Shori(LCode2, this.Map.ALIN - 1);
        } else {
            if (JointPnum === PNum1) {
                this.Topology_Line_Object_Shori(LCode2, LCode1);
            } else if (JointPnum === PNum2) {
                this.Topology_Line_Object_Shori(LCode1, LCode2);
            }
        }

        if (NewPnum1.B > 0) {
            PushLine = this.MPLine[LCode1].Clone();
            PushLine.NumOfPoint = NewPnum1.B;
            PushLine.Number = -1;
            PushLine.PointSTC = Generic.ArrayClone(NewPnum1.NewXYstacB);
            this.Save_Line(PushLine, false, false, true);
            this.Topology_Line_Object_Shori(LCode1, this.Map.ALIN - 1);
        }

        if (NewPnum2.B > 0) {
            PushLine = this.MPLine[LCode2].Clone();
            PushLine.NumOfPoint = NewPnum2.B;
            PushLine.Number = -1;
            PushLine.PointSTC = Generic.ArrayClone(NewPnum2.NewXYstacB);
            this.Save_Line(PushLine, false, false, true);
            this.Topology_Line_Object_Shori(LCode2, this.Map.ALIN - 1);
        }
        return true;
    }

    /**
     * 一致区間でラインを分割したときの前後パーツを生成します。
     *
     * @param Start_JointPoint 一致開始位置です。
     * @param JointNum 一致区間長です。
     * @param OldPNum 元ラインのポイント数です。
     * @param NewPnum 分割後情報の出力先です。
     * @param OldXY 元ライン座標列です。
     */
    private TopologyStructure_Two_SameLine_Cutsub(Start_JointPoint: number, JointNum: number, OldPNum: number, NewPnum: { A: number, B: number, NewXYstacA: point[], NewXYstacB: point[] },
        OldXY: point[]) {

        const LoopF = OldXY[0].Equals(OldXY[OldPNum - 1]);
        NewPnum.B = -1;
        if (LoopF === true) {
            //線がループの場合
            let Start;
            NewPnum.A = OldPNum - Math.abs(JointNum) + 1;
            NewPnum.NewXYstacA=[];
            if (OldPNum < JointNum + Start_JointPoint) {
                //共有部分が始点終点を挟む場合１
                Start = JointNum - (OldPNum - Start_JointPoint);
                for (let i = Start; i <= Start_JointPoint; i++) {
                    NewPnum.NewXYstacA[i - Start] = OldXY[i].Clone();
                }
            } else if (JointNum + Start_JointPoint < 0) {
                //共有部分が始点終点を挟む場合２
                for (let i = Start_JointPoint; i <= OldPNum + (JointNum + Start_JointPoint); i++) {
                    NewPnum.NewXYstacA[i - Start_JointPoint] = OldXY[i].Clone();
                }
            } else if ((Start_JointPoint < 0) && (JointNum + Start_JointPoint > 0)) {
                //共有部分が始点終点を挟む場合3
                let j = 0;
                for (let i = JointNum + Start_JointPoint - 1; i <= OldPNum - 1 + Start_JointPoint; i++) {
                    NewPnum.NewXYstacA[j] = OldXY[i].Clone();
                    j++;
                }
            } else {
                //共有部分が始点終点を挟まない場合
                if (JointNum > 0) {
                    //順方向
                    let j = 0
                    for (let i = Start_JointPoint + JointNum - 1; i < OldPNum - 1; i++) {
                        NewPnum.NewXYstacA[j] = OldXY[i].Clone();
                        j++;
                    }
                    for (let i = 0; i <= Start_JointPoint; i++) {
                        NewPnum.NewXYstacA[j] = OldXY[i].Clone();
                        j++;
                    }
                } else {
                    //逆方向
                    let j = 0;
                    for (let i = Start_JointPoint; i < OldPNum - 1; i++) {
                        NewPnum.NewXYstacA[j] = OldXY[i].Clone();
                        j++;
                    }
                    for (let i = 0; i <= (Start_JointPoint + JointNum + 1); i++) {
                        NewPnum.NewXYstacA[j] = OldXY[i].Clone();
                        j++;
                    }
                }
            }
        } else {
            //線がループでない場合
            let End2;
            let Start2;
            if (JointNum < 0) {
                Start2 = Start_JointPoint + JointNum + 1;
                End2 = Start_JointPoint;
            } else {
                Start2 = Start_JointPoint;
                End2 = Start_JointPoint + JointNum - 1;
            }
            if ((Start2 === 0) || (End2 === OldPNum - 1)) {
                if (OldPNum === JointNum) {
                    //全体が共有されている場合
                    NewPnum.A = OldPNum;
                    NewPnum.NewXYstacA = Generic.ArrayClone(OldXY);
                } else {
                    //始点又は終点まで共有されている場合
                    NewPnum.A = OldPNum - Math.abs(JointNum) + 1;
                    let j = 0;
                    if (Start2 !== 0) {
                        for (let i = 0; i <= Start2; i++) {
                            NewPnum.NewXYstacA[j] = OldXY[i].Clone();
                            j++;
                        }
                    }
                    if (End2 !== OldPNum - 1) {
                        for (let i = End2; i < OldPNum; i++) {
                            NewPnum.NewXYstacA[j] = OldXY[i].Clone();
                            j++;
                        }
                    }
                }
            } else {
                //始点終点が共有されていない場合は線を１本増やす
                NewPnum.A = Start2 + 1;
                NewPnum.NewXYstacA=[];
                for (let i = 0; i <= Start2; i++) {
                    NewPnum.NewXYstacA[i] = OldXY[i].Clone();
                }

                NewPnum.B = OldPNum - End2;
                NewPnum.NewXYstacB=[];
                for (let i = End2; i < OldPNum; i++) {
                    NewPnum.NewXYstacB[i - End2] = OldXY[i].Clone();
                }
            }
        }

    }

    /**
     * 2 本のライン上で連続一致するポイント数を追跡します。
     *
     * @param S1 1 本目の開始位置です。
     * @param s2 2 本目の開始位置です。
     * @param ip 1 本目の進行方向です。
     * @param jp 2 本目の進行方向です。
     * @param PNum1 1 本目のポイント数です。
     * @param PNum2 2 本目のポイント数です。
     * @param XYstac1 1 本目の座標列です。
     * @param XYstac2 2 本目の座標列です。
     * @returns 連続一致したポイント数です。
     */
    private TopologyStructure_Two_SameLine_sub(S1: number, s2: number, ip: number, jp: number, PNum1: number, PNum2: number, XYstac1: point[], XYstac2: point[]) {

        let i = S1;
        let j = s2;
        const Loop1F = XYstac1[0].Equals(XYstac1[PNum1 - 1]);
        const Loop2F = XYstac2[0].Equals(XYstac2[PNum2 - 1]);
        let n = 0;
        while (XYstac1[i].Equals(XYstac2[j]) === true) {
            i += ip;
            j += jp;
            n++;
            if (i >= PNum1) {
                if (Loop1F === true) {
                    i = 1;
                } else {
                    break;
                }
            }
            if (j >= PNum2) {
                if (Loop2F === true) {
                    j = 1;
                    jp = 1;
                } else {
                    break;
                }
            }
            if (i < 0) {
                if (Loop1F === true) {
                    i = PNum1 - 2;
                } else {
                    break;
                }
            }
            if (j < 0) {
                if (Loop2F === true) {
                    j = PNum2 - 2;
                } else {
                    break;
                }
            }
        }
        return n;
    }

    /**
     * 指定ラインが閉ループかを判定します。
     *
     * @param LCode ライン番号です。
     * @returns 始点と終点が一致する場合は true です。
     */
    Check_Line_Loop(LCode: number){
        const ml = this.MPLine[LCode];
        return ml.PointSTC[0].Equals(ml.PointSTC[ml.NumOfPoint - 1]);
    }

    /**
     * 2 本のラインが完全に同一かを判定します。
     *
     * @param LC1 1 本目のライン番号です。
     * @param LC2 2 本目のライン番号です。
     * @returns 完全一致する場合は true です。
     */
    Check_Points_Of_Two_Lines(LC1: number, LC2: number) {
        const mLine1 = this.MPLine[LC1];
        const mLine2 = this.MPLine[LC2];
        const PNum1 = mLine1.NumOfPoint;
        const PNum2 = mLine2.NumOfPoint;
        let f2 = false;
        if (PNum1 === PNum2) {
            const f = mLine1.Circumscribed_Rectangle.Equals(mLine2.Circumscribed_Rectangle);
            if (f === true) {
                if ((this.Check_Line_Loop(LC1) === true) && (this.Check_Line_Loop(LC2) === true)) {
                    //ループの場合
                    //最初に座標が一致するポイントを取得
                    let s2 = -1
                    for (let i = 0; i < PNum2; i++) {
                        if (mLine1.PointSTC[0].Equals(mLine2.PointSTC[i]) === true) {
                            s2 = i;
                            i = PNum2;
                        }
                    }
                    if (s2 === -1) {
                        f2 = false;
                    } else {
                        let s2p;
                        if (s2 === 0) {
                            if (mLine1.PointSTC[1].Equals(mLine2.PointSTC[1]) === true) {
                                s2p = 1;
                            } else {
                                s2p = -1;
                            }
                        } else {
                            if (mLine1.PointSTC[1].Equals(mLine2.PointSTC[s2 - 1]) === true) {
                                s2p = -1;
                            } else {
                                s2p = 1;
                            }
                        }
                        f2 = true;
                        let i = 0;
                        let j = s2;
                        while ((f2 === true) && (i < PNum1)) {
                            f2 = mLine1.PointSTC[i].Equals(mLine2.PointSTC[j]);
                            i++;
                            j = j + s2p;
                            if (j < 0) {
                                j = PNum2 - 2;
                            } else if (j >= PNum2) {
                                j = 1;
                            }
                        }
                    }
                } else {
                    //ループでない場合
                    if (mLine1.PointSTC[0].Equals(mLine2.PointSTC[0]) === true) {
                        f2 = true
                        for (let i = 1; i < PNum1; i++) {
                            if (mLine1.PointSTC[i].Equals(mLine2.PointSTC[i]) === false) {
                                f2 = false;
                                break;
                            }
                        }
                    } else if (mLine1.PointSTC[0].Equals(mLine2.PointSTC[PNum1 - 1])) {
                        f2 = true;
                        for (let i = 1; i < PNum1; i++) {
                            if (mLine1.PointSTC[i].Equals(mLine2.PointSTC[PNum1 - 1 - i]) === false) {
                                f2 = false;
                                break;
                            }
                        }
                    }
                }
            }
        }
        return f2;
    }


    /**
     * ラインを 1 本削除し、必要な接続状態と形状を更新します。
     *
     * @param EraseLineCode 削除するライン番号です。
     * @param Chack_Object_Shape_F 削除ラインを使うオブジェクト形状も再判定する場合は true です。
     * @returns 返り値はありません。
     */
    Erase_Line(EraseLineCode: number, Chack_Object_Shape_F: boolean) {
        const LCode = [EraseLineCode];
        const SEpoint = [];
        const ml = this.MPLine[EraseLineCode];
        SEpoint[0] = ml.PointSTC[0].Clone();
        SEpoint[1] = ml.PointSTC[ml.NumOfPoint - 1].Clone();
        this.Erase_MultiLine(1, LCode, true, Chack_Object_Shape_F, true);
        this.Check_Related_Line(SEpoint, -1);
    }

    /**
     * 複数ラインを削除し、必要な参照更新を行います。
     *
     * @param LNum 削除対象ライン数です。
     * @param LCode 削除対象ライン番号配列です。
     * @param UsedLine_Delete_F 使用中ラインも削除する場合は true です。
     * @param Check_ObjectShape_F 削除後にオブジェクト形状を再判定する場合は true です。
     * @param MapRectCheckF 地図全体の外接矩形も更新する場合は true です。
     * @returns 実際に削除したライン番号配列です。
     */
    Erase_MultiLine(LNum: number, LCode: number[], UsedLine_Delete_F: boolean, Check_ObjectShape_F: boolean, MapRectCheckF: boolean) {

        const C_Mpline = [];
        const RealDeleteLineCode = [];
        for (let i = 0; i < LNum; i++) {
            C_Mpline[LCode[i]] = -1;
        }

        if (UsedLine_Delete_F === false) {
            for (let i = 0; i < this.Map.ALIN; i++) {
                if (C_Mpline[i] === -1) {
                    if (this.MPLine[i].NumOfLineUse > 0) {
                        C_Mpline[i] = 0;
                    }
                }
            }
        }

        let n = 0
        for (let i = 0; i < this.Map.ALIN; i++) {
            if (C_Mpline[i] === -1) {
                RealDeleteLineCode[n] = i;
                n++;
            } else {
                C_Mpline[i] = i - n;
                this.MPLine[i - n] = this.MPLine[i].Clone();
                this.MPLine[i - n].Number = i - n;
            }
        }
        if (n > 0) {
            this.Map.ALIN -= n;
            this.MPLine.length = this.Map.ALIN;
        }

        for (let i = 0; i < this.Map.Kend; i++) {
            const mo = this.MPObj[i];
            if (this.ObjectKind[mo.Kind].ObjectType === enmObjectGoupType_Data.NormalObject) {
                n = 0;
                for (let j = 0; j < mo.NumOfLine; j++) {
                    if (C_Mpline[mo.LineCodeSTC[j].LineCode] === -1) {
                        n++;
                    } else {
                        mo.LineCodeSTC[j].LineCode = C_Mpline[mo.LineCodeSTC[j].LineCode];
                        mo.LineCodeSTC[j - n] = mo.LineCodeSTC[j].Clone();
                    }
                }
                if (n > 0) {
                    mo.NumOfLine -= n;
                    if (mo.NumOfLine === 0) {
                        mo.LineCodeSTC = [];
                    } else {
                        mo.LineCodeSTC.length = mo.NumOfLine;
                    }
                    if ((UsedLine_Delete_F === true) && (Check_ObjectShape_F === true)) {
                        mo.Shape = this.Check_Obj_Shape_AllTime(this.MPObj[i]);
                    }
                }
            }
        }
        this.Check_ALl_Line_Connect()
        if (MapRectCheckF === true) {
            this.Map.Circumscribed_Rectangle = this.Get_Mapfile_Rectangle()
        }
        return RealDeleteLineCode;
    }

    /**
     * 全期間を通してオブジェクトの代表形状を判定します。
     *
     * @param ObjData 対象オブジェクトです。
     * @returns 判定した形状種別です。
     */
    Check_Obj_Shape_AllTime(ObjData: strObj_Data, /* CutPoint: point | undefined = undefined */) {
        //オブジェクト名の有効期間の開始と終了時期での形状チェック

        if (this.ObjectKind[ObjData.Kind].ObjectType === enmObjectGoupType_Data.AggregationObject) {
            return this.Check_Obj_Shape_Cut(ObjData, clsTime.GetNullYMD());
        }

        const OT = []; // As Start_End_Time_data

        const SHP = [];
        let SHN = 0;

        const obtn = ObjData.NumOfNameTime;
        for (let i = 0; i < obtn; i++) {
            OT[i] = ObjData.NameTimeSTC[i].SETime.Clone();
        }

        for (let i = 0; i < obtn; i++) {
            if (OT[i].StartTime.nullFlag() === false) {
                SHP[SHN] = this.Check_Obj_Shape_Cut(ObjData, OT[i].StartTime);
                SHN++;
            }
            if (OT[i].EndTime.nullFlag() === false) {
                SHP[SHN] = this.Check_Obj_Shape_Cut(ObjData, OT[i].EndTime);
                SHN++;
            }
        }

        const TimeSort = new SortingSearch();
        for (let i = 0; i < ObjData.NumOfLine; i++) {
            const ols = ObjData.LineCodeSTC[i];
            for (let j = 0; j < ols.NumOfTime; j++) {
                TimeSort.Add(clsTime.YMDtoValue(ols.Times[j].StartTime));
                TimeSort.Add(clsTime.YMDtoValue(ols.Times[j].EndTime));
            }
            const olsl = this.MPLine[ols.LineCode];
            for (let j = 0; j < olsl.NumOfTime; j++) {
                const olsls = olsl.LineTimeSTC[j];
                TimeSort.Add(clsTime.YMDtoValue(olsls.SETime.StartTime));
                TimeSort.Add(clsTime.YMDtoValue(olsls.SETime.EndTime));
            }
        }
        TimeSort.AddEnd()

        const n = TimeSort.NumofData();
        const GT: strYMD[] = [];
        let n2 = 0
        for (let i = 0; i < n; i++) {
            const v = TimeSort.DataPositionValue_Integer[i];
            const T = clsTime.GetYMDfromValue(v);
            if (T.nullFlag() === false) {
                if (n2 === 0) {
                    if (OT[0].StartTime.nullFlag() === true) {
                        GT[0] = clsTime.getYesterday(T);
                        n2 = 1;
                    }
                    GT[n2] = T;
                    n2++;
                } else {
                    if (GT[n2 - 1].Equals(T) === false) {
                        GT[n2] = T;
                        n2++;
                    }
                }
            }
        }
        if (OT[obtn - 1].EndTime.nullFlag() === true) {
            if (n2 !== 0) {
                GT[n2] = clsTime.getTomorrow(GT[n2 - 1]);
                n2++;
            }
        }

        for (let i = 0; i < n2; i++) {
            if (GT[i].nullFlag() === false) {
                for (let j = 0; j < obtn; j++) {
                    if (clsTime.checkDurationIn(OT[j], GT[i]) === true) {
                        SHP[SHN] = this.Check_Obj_Shape_Cut(ObjData, GT[i]);
                        SHN++;
                    }
                }
            }
        }

        if (SHN === 0) {
            SHP[0] = this.Check_Obj_Shape_Cut(ObjData, clsTime.GetNullYMD());
            SHN = 1;
        }

        const SHF = new Array(SHN);
        SHF.fill(0);
        for (let i = 0; i < SHN; i++) {
            SHF[SHP[i]]++;
        }

        let sp;
        //チェックした期間内に、複数の形状が含まれている場合は、優先的に点＞線＞面が返される
        if (SHF[enmShape.PolygonShape] !== 0) { sp = enmShape.PolygonShape }
        if (SHF[enmShape.LineShape] !== 0) { sp = enmShape.LineShape }
        if (SHF[enmShape.PointShape] !== 0) { sp = enmShape.PointShape }
        return sp;
    }


    /**
     * 指定時点でのオブジェクト形状を判定します。
     *
     * @param ObjData 対象オブジェクトです。
     * @param L_Time 判定時点です。
     * @returns 判定した形状種別です。
     */
    Check_Obj_Shape_Cut(ObjData: strObj_Data, L_Time: strYMD, /* CutPoint: point */) {
        if (this.ObjectKind[ObjData.Kind].ObjectType === enmObjectGoupType_Data.AggregationObject) {
            //集成オブジェクトタイプの場合
            const OBShape = new Array(3);
            OBShape.fill(0);
            for (let i = 0; i < ObjData.NumOfLine; i++) {
                OBShape[this.MPObj[ObjData.LineCodeSTC[i].LineCode].Shape]++;
            }

            if ((OBShape[enmShape.LineShape] === 0) && (OBShape[enmShape.PolygonShape] === 0)) {
                return enmShape.PointShape;
            } else if ((this.ObjectKind[ObjData.Kind].Shape === enmShape.LineShape) || (OBShape[enmShape.LineShape] > 0)) {
                return enmShape.LineShape;
            } else {
                return enmShape.PolygonShape;
            }
        } else {
            //通常のオブジェクトタイプの場合
            const polyn = this.Check_PolyShape_PolygonNum(ObjData, L_Time);
            switch (polyn) {
                case -1:
                    return enmShape.PointShape;
                case 0:
                    return enmShape.LineShape;
                default:
                    return enmShape.PolygonShape;
            }
        }
    }

    /**
     * 指定時点でオブジェクトを構成するポリゴン数を数えます。
     *
     * @param ObjData 対象オブジェクトです。
     * @param L_Time 判定時点です。
     * @returns ポリゴン数です。ラインのみなら 0、構成できない場合は -1 です。
     */
    Check_PolyShape_PolygonNum( ObjData: strObj_Data ,  L_Time: strYMD , /* CutPoint: point | undefined  = undefined */) {

        const ELine  = this.Get_EnableMPLine( ObjData, L_Time);
        let NL=ELine.length;
        if(NL === 0 ){
            return -1;
        }

        if(this.ObjectKind[ObjData.Kind].Shape === enmShape.LineShape ){
            return 0;
        }

        const Fringe: number[] = [];
        for(let i  = 0;i<NL;i++){
            Fringe[i] = ELine[i].LineCode;
        }

        //ループラインをチェック
        let polyn  = 0;
        let stxy , exy 
        let k  = 0;

        for(let i  = 0;i<NL;i++){
            const ml= this.MPLine[Fringe[i]];
                stxy = ml.PointSTC[0];
                exy = ml.PointSTC[ml.NumOfPoint - 1];
            
            if(exy.Equals(stxy) === true ){
                NL --;
                polyn ++;
            }else{
                Fringe[k] = Fringe[i];
                k ++;
            }
        }
        if(k === 0 ){
            return polyn;
        }

        let Contf  = false;
        for(let i  = 0;i<NL;i++){
            if(Contf === false ){
                const ml= this.MPLine[Fringe[i]];
                    stxy = ml.PointSTC[0].Clone();
                    exy = ml.PointSTC[ml.NumOfPoint - 1].Clone();
                
            }
            Contf = false
            for (let j = i + 1; j < NL; j++) {
                const ml = this.MPLine[Fringe[j]];
                if (ml.PointSTC[0].Equals(exy) === true) {
                    exy = ml.PointSTC[ml.NumOfPoint - 1].Clone();
                    Contf = true;
                    [Fringe[j], Fringe[i + 1]] = [Fringe[i + 1], Fringe[j]];
                    break;
                } else if (ml.PointSTC[ml.NumOfPoint - 1].Equals(exy) === true) {
                    exy = ml.PointSTC[0].Clone();
                    Contf = true;
                    [Fringe[j], Fringe[i + 1]] = [Fringe[i + 1], Fringe[j]];
                    break;
                }
            }
            if(Contf === false ){
                if(exy.Equals(stxy) ){
                    polyn ++;
                }else{
                    polyn = 0;
                    // const CutPoint = exy;
                    break;
                }
            }
        }
        return polyn;
    }

    /**
     * 全ラインの接続状態を再計算します。
     */
    Check_ALl_Line_Connect() {
        const PointIndex = new SpatialIndexSearch(SpatialPointType.SinglePoint, false);
        for (let i = 0; i < Map.ALIN; i++) {
            const ml = this.MPLine[i];
            if (ml.NumOfPoint > 0) {
                PointIndex.AddDoublePoint(ml.PointSTC[0] as unknown as latlon, ml.PointSTC[ml.NumOfPoint - 1] as unknown as latlon, i);
            }
        }
        PointIndex.AddEnd();
        for (let i = 0; i < Map.ALIN; i++) {
            const ml = this.MPLine[i];
            if (ml.NumOfPoint > 0) {
                if (ml.PointSTC[0].Equals(ml.PointSTC[ml.NumOfPoint - 1]) === true) {
                    ml.Connect = 3;
                } else {
                    ml.Connect = 0;
                    for (let j = 0; j < 1; j++) {
                        const SamePointData: GetObjectPointTagInfo[] = [];
                        const n = PointIndex.GetSamePointNumberArray(ml.PointSTC[j * (ml.NumOfPoint - 1)].x, ml.PointSTC[j * (ml.NumOfPoint - 1)].y, SamePointData)
                        if (n > 0) {
                            for (let k = 0; k < n; k++) {
                                if (SamePointData[k].ObjectNumber !== i) {
                                    ml.Connect++;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * 指定時点で有効なオブジェクト代表点を取得します。
     *
     * @param ObjInfo 対象オブジェクト番号またはオブジェクトです。
     * @param Time 判定時点です。
     * @returns 代表点座標です。取得できない場合は undefined です。
     */
    Get_Enable_CenterP(ObjInfo: number | strObj_Data, Time: strYMD) {
        let ObjData;
        if (typeof ObjInfo === 'number') {
            ObjData = this.MPObj[ObjInfo];
        } else {
            ObjData = ObjInfo;
        }

        if (this.CheckEnableObject(ObjData, Time) === false) {
            return undefined;
        }
        for (let i = 0; i < ObjData.NumOfCenterP; i++) {
            if (clsTime.checkDurationIn(ObjData.CenterPSTC[i].SETime, Time) === true) {
                return ObjData.CenterPSTC[i].Position.Clone();
            }
        }
        return undefined;
    }

    /**
     * 位相構造化で生成したラインを使うようオブジェクト参照を補正します。
     *
     * @param Search_LineCode 置換元ラインコードです。
     * @param Add_LineCode 追加先ラインコードです。
     */
    Topology_Line_Object_Shori(Search_LineCode: number, Add_LineCode: number) {
        const Add_LineCode_Stac = [];
        Add_LineCode_Stac[0] = Add_LineCode;
        this.Object_LineCode_Add(Search_LineCode, 1, Add_LineCode_Stac);
    }

    /**
     * ライン切断で増えたライン群を使うようオブジェクト参照を補正します。
     *
     * @param Search_LineCode 置換元ラインコードです。
     * @param ODALIN 追加ライン開始番号です。
     * @param num 追加ライン本数です。
     */
    Cut_Line_Object_Shori(Search_LineCode: number, ODALIN: number, num: number){
        const Add_LineCode = [];
        for (let i = 0; i < num; i++) {
            Add_LineCode[i] = ODALIN + i;
        }
        this.Object_LineCode_Add(Search_LineCode, num, Add_LineCode);
    }

    /**
     * 指定ラインを参照するオブジェクトへ追加ライン参照を複製します。
     *
     * @param Search_LineCode 検索する元ラインコードです。
     * @param AddLineNum 追加ライン本数です。
     * @param Add_LineCode 追加するラインコード配列です。
     */
    Object_LineCode_Add(Search_LineCode: number, AddLineNum: number, Add_LineCode: number[]){
        for (let i = 0; i < this.Map.Kend; i++) {
            const mo = this.MPObj[i];
            if (this.ObjectKind[mo.Kind].ObjectType === enmObjectGoupType_Data.NormalObject) {
                const n = mo.NumOfLine;
                for (let j = 0; j < n; j++) {
                    if (mo.LineCodeSTC[j].LineCode === Search_LineCode) {
                        this.Move_LineCodeStac(i, n + AddLineNum, n);
                        for (let k = 0; k < AddLineNum; k++) {
                            mo.LineCodeSTC[k + n] = mo.LineCodeSTC[j].Clone();
                            mo.LineCodeSTC[k + n].LineCode = Add_LineCode[k];
                        }
                        break;
                    }
                }
            }
        }
    }

    /**
     * 指定オブジェクトのラインコードスタック長を変更します。
     *
     * @param ObjNum 対象オブジェクト番号です。
     * @param New_NumOfLine 変更後のライン数です。
     * @param Old_NumOfLine 変更前のライン数です。
     */
    Move_LineCodeStac(ObjNum: number, New_NumOfLine: number, Old_NumOfLine: number) {
        const mo = this.MPObj[ObjNum];
        const dif = New_NumOfLine - Old_NumOfLine;
        mo.NumOfLine = mo.NumOfLine + dif;

        if (dif !== 0) {
            if (dif > 0) {
                for (let i = Old_NumOfLine; i < mo.NumOfLine; i++) {
                    mo.LineCodeSTC[i] = new LineCodeStac_Data();
                    mo.LineCodeSTC[i].NumOfTime = 0;
                }
            } else {
                if (mo.NumOfLine === 0) {
                    mo.LineCodeSTC.length = 0;
                } else {
                    mo.LineCodeSTC.length = mo.NumOfLine;
                }
            }
        }
    }

    /**
     * 指定時点で有効なオブジェクト名リストを取得します。
     *
     * @param ObjInfo 対象オブジェクト番号またはオブジェクトです。
     * @param Time 判定時点です。
     * @param NoDataLastGetF 一致しない場合に末尾の名称を返すなら true です。
     * @returns オブジェクト名リストです。取得できない場合は undefined です。
     */
    Get_Enable_ObjectName(ObjInfo: number | strObj_Data, Time: strYMD, NoDataLastGetF: boolean) {
    let ObjData;
    if (typeof ObjInfo === 'number') {
        ObjData = this.MPObj[ObjInfo];
    } else {
        ObjData = ObjInfo;
    }
    let n;
    if (Time.nullFlag() === true) {
        n = ObjData.NumOfNameTime - 1;
    } else {
        n = -1;
        for (let i = 0; i < ObjData.NumOfNameTime; i++) {
            if (clsTime.checkDurationIn(ObjData.NameTimeSTC[i].SETime, Time) === true) {
                n = i;
                break;
            }
        }
        if ((n === -1) && (NoDataLastGetF === true)) {
            n = ObjData.NumOfNameTime - 1;
        }
    }
    if (n === -1) {
        return undefined;
    } else {
        return Generic.ArrayShallowCopy(ObjData.NameTimeSTC[n].NamesList);
    }
}

    /**
     * JSON 地図ファイルを読み込み、内部地図データへ展開します。
     *
     * @param JsonData 読み込む JSON データです。
     * @param mdrmjFlag true の場合は mdrmj 内形式として解釈します。
     */
    openJsonMapData(JsonData: JsonObject, mdrmjFlag: boolean = false) {
    this.init_MapData();
    const m = new strMap_data();
    const mapData = JsonData.Map as JsonObject;
    const zahyoData = mapData.Zahyo as JsonObject;
    m.FileName = mapData.FileName as string;
    m.FullPath = mapData.FullPath as string;
    m.MPVersion = mapData.MPVersion as number;
    m.ALIN = mapData.ALIN as number;
    m.Kend = mapData.Kend as number;
    m.OBKNum = mapData.OBKNum as number;
    m.LpNum = mapData.LpNum as number;
    m.SCL = mapData.SCL as number;
    m.SCL_U = mapData.SCL_U as number;
    m.Time_Mode = mapData.Time_Mode as boolean;
    m.Comment = mapData.Comment as string;
    m.Circumscribed_Rectangle = this.cnvJsonRect(mapData.Circumscribed_Rectangle as JsonObject, mdrmjFlag);
    m.Zahyo.Mode = zahyoData.Mode as number;
    m.Zahyo.System = zahyoData.System as number;
    m.Zahyo.HeimenTyokkaku_KEI_Number = zahyoData.HeimenTyokkaku_KEI_Number as number;
    m.Zahyo.Projection = zahyoData.Projection as number;
    m.Zahyo.CenterXY =this.cnvJsonPoint(zahyoData.CenterXY as JsonObject, mdrmjFlag);
    const detailData = mapData.Detail as JsonObject;
    const compassData = mapData.MapCompass as JsonObject;
    m.Detail.DistanceMeasurable = detailData.DistanceMeasurable as boolean;
    m.Detail.ScaleVisible = detailData.ScaleVisible as boolean;
    m.MapCompass.Visible = compassData.Visible as boolean;
    m.MapCompass.Position = this.cnvJsonPoint(compassData.Position as JsonObject, mdrmjFlag);
    m.MapCompass.Mark = this.cnvJsonMark_Property(compassData.Mark as JsonObject, mdrmjFlag);
    Object.assign(m.MapCompass.dirWord, compassData.dirWord);
    // m.MapCompass.dirWord.East = JsonData.Map.MapCompass.dirWord.East;
    // m.MapCompass.dirWord.West = JsonData.Map.MapCompass.dirWord.West;
    // m.MapCompass.dirWord.North = JsonData.Map.MapCompass.dirWord.North;
    // m.MapCompass.dirWord.South = JsonData.Map.MapCompass.dirWord.South;
    // m.MapCompass.Font = this.cnvJsonFont(JsonData.Map.MapCompass.Font, mdrmjFlag);
    this.Map = m;
    const objectKindArray = JsonData.ObjectKind as JsonObject[];
    for (let i = 0; i < m.OBKNum; i++) {
        const ok = new strObjectGroup_Data();
        const okData = objectKindArray[i];
        ok.ObjectType = okData.ObjectType as number;
        ok.Name = okData.Name as string;
        ok.Shape = okData.Shape as number;
        ok.Mesh = okData.Mesh as number;
        ok.Color = this.cnvJsonColor(okData.Color);
        ok.DefTimeAttDataNum = okData.DefTimeAttDataNum as number;
        ok.ObjectNameNum = okData.ObjectNameNum as number;
        ok.ObjectNameList = okData.ObjectNameList as string[];
        ok.UseLineType = okData.UseLineType as boolean[];
        ok.UseObjectGroup = okData.UseObjectGroup as boolean[];
        for (let j = 0; j < ok.DefTimeAttDataNum; j++) {
            const da = new strMPObjDefTimeAttData_Info();
            const defTimeAttData = (okData.DefTimeAttSTC as JsonObject[])[j];
            const attDataObj = defTimeAttData.attData as JsonObject;
            da.Type = defTimeAttData.Type as number;
            da.attData.Title = attDataObj.Title as string;
            da.attData.Unit = attDataObj.Unit as string;
            da.attData.MissingF = attDataObj.MissingF as boolean;
            da.attData.Note = attDataObj.Note as string;
            da.ExtraValue = defTimeAttData.ExtraValue as number;
            ok.DefTimeAttSTC[j] = da;
        }
        this.ObjectKind[i] = ok;
    }
    const lineKindArray = JsonData.LineKind as JsonObject[];
    for (let i = 0; i < m.LpNum; i++) {
        const lk = new LineKind_Data();
        const lkData = lineKindArray[i];
        lk.Name = lkData.Name as string;
        lk.NumofObjectGroup = lkData.NumofObjectGroup as number;
        lk.Mesh = lkData.Mesh as boolean;
        const objGroupArray = lkData.ObjGroup as JsonObject[];
        for (let j = 0; j < lk.NumofObjectGroup; j++) {
            lk.ObjGroup[j] = new strLKOjectGroup_Info();
            lk.ObjGroup[j].GroupNumber = objGroupArray[j].GroupNumber as number;
            lk.ObjGroup[j].UseOnly = objGroupArray[j].UseOnly as boolean;
            lk.ObjGroup[j].Pattern = this.cnvJsonLine_Property(objGroupArray[j].Pattern, mdrmjFlag);
        }
        this.LineKind[i] = lk;
    }

    const mpLineArray = JsonData.MPLine as JsonObject[];
    for (let i = 0; i < m.ALIN; i++) {
        const ml = new strLine_Data();
        const mlData = mpLineArray[i];
        ml.Number = mlData.Number as number;
        ml.NumOfPoint = mlData.NumOfPoint as number;
        ml.Connect = mlData.Connect as number;
        ml.NumOfLineUse = mlData.NumOfLineUse as number;
        ml.Circumscribed_Rectangle = this.cnvJsonRect(mlData.Circumscribed_Rectangle as JsonObject, mdrmjFlag);
        ml.NumOfTime = mlData.NumOfTime as number;
        ml.Drawn = mlData.Drawn as boolean;
        const lineTimeArray = mlData.LineTimeSTC as JsonObject[];
        for (let j = 0; j < ml.NumOfTime; j++) {
            ml.LineTimeSTC[j] = new Line_Time_Data();
            ml.LineTimeSTC[j].Kind = lineTimeArray[j].Kind as number;
            ml.LineTimeSTC[j].SETime = this.cnvJsonStart_End_Time_data(lineTimeArray[j].SETime);
        }
        const pointArray = mlData.PointSTC as JsonValue[];
        for (let j = 0; j < ml.NumOfPoint; j++) {
            ml.PointSTC[j] = this.cnvJsonPoint(pointArray[j], mdrmjFlag);
        }
        this.MPLine[i] = ml;
    }
    const mpObjArray = JsonData.MPObj as JsonObject[];
    for (let i = 0; i < m.Kend; i++) {
        const o = new strObj_Data();
        const s = mpObjArray[i];
        o.Number = s.Number as number;
        o.Kind = s.Kind as number;
        o.Shape = s.Shape as number;
        o.NumOfNameTime = s.NumOfNameTime as number;
        o.NumOfCenterP = s.NumOfCenterP as number;
        o.NumOfSuc = s.NumOfSuc as number;
        o.NumOfLine = s.NumOfLine as number;
        o.Circumscribed_Rectangle = this.cnvJsonRect(s.Circumscribed_Rectangle as JsonObject, mdrmjFlag);
        if (s.DefTimeAttValue !== null) {
            const defTimeAttArray = s.DefTimeAttValue as JsonObject[];
            for (let j = 0; j < defTimeAttArray.length; j++) {
                const d = new strDefTimeAttData_Info();
                const defTimeAttItem = defTimeAttArray[j];
                if (defTimeAttItem.Data !== null) {
                    const dataArray = defTimeAttItem.Data as JsonObject[];
                    for (let k = 0; k < dataArray.length; k++) {
                        d.Data[k] = new strDefTimeAttDataEach_Info();
                        d.Data[k].Span = this.cnvJsonStart_End_Time_data(dataArray[k].Span);
                        if (dataArray[k].Value === null) {
                            d.Data[k].Value = undefined;
                        } else {
                            const val = dataArray[k].Value;
                            d.Data[k].Value = typeof val === 'number' ? val.toString() : val as string;
                        }
                    }
                }
                o.DefTimeAttValue[j] = d;
            }
        }
        const sucArray = s.SucSTC as JsonObject[];
        const numOfSuc = s.NumOfSuc as number;
        for (let j = 0; j < numOfSuc; j++) {
            o.SucSTC[j] = new Object_Succession_Data();
            o.SucSTC[j].ObjectCode = sucArray[j].ObjectCode as number;
            o.SucSTC[j].Time = this.cnvJsonstrYMD(sucArray[j].Time);
        }
        const nameTimeArray = s.NameTimeSTC as JsonObject[];
        const numOfNameTime = s.NumOfNameTime as number;
        for (let j = 0; j < numOfNameTime; j++) {
            o.NameTimeSTC[j] = new Object_NameTimeStac_Data();
            o.NameTimeSTC[j].NamesList = Generic.ArrayShallowCopy(nameTimeArray[j].NamesList as string[]);
            o.NameTimeSTC[j].SETime = this.cnvJsonStart_End_Time_data(nameTimeArray[j].SETime);
        }

        const centerPArray = s.CenterPSTC as JsonObject[];
        const numOfCenterP = s.NumOfCenterP as number;
        for (let j = 0; j < numOfCenterP; j++) {
            o.CenterPSTC[j] = new Object_CenterPoint_Data();
            o.CenterPSTC[j].Position = this.cnvJsonPoint(centerPArray[j].Position, mdrmjFlag);
            o.CenterPSTC[j].SETime = this.cnvJsonStart_End_Time_data(centerPArray[j].SETime)
        }
        const lineCodeArray = s.LineCodeSTC as JsonObject[];
        const numOfLine = s.NumOfLine as number;
        for (let j = 0; j < numOfLine; j++) {
            o.LineCodeSTC[j] = new LineCodeStac_Data();
            const lineCodeItem = lineCodeArray[j];
            o.LineCodeSTC[j].LineCode = lineCodeItem.LineCode as number;
            o.LineCodeSTC[j].NumOfTime = lineCodeItem.NumOfTime as number;
            const timesArray = lineCodeItem.Times as JsonValue[];
            for (let k = 0; k < timesArray.length; k++) {
                o.LineCodeSTC[j].Times[k] = this.cnvJsonStart_End_Time_data(timesArray[k]);
            }
        }
        this.MPObj[i] = o;
    }

    this.Checl_All_Line_Maxmin();
    this.Check_All_Obj_MaxMin();
    this.Map.Circumscribed_Rectangle = this.Get_Mapfile_Rectangle();
}

    /**
     * JSON 値から strYMD を生成します。
     *
     * @param json 変換元 JSON 値です。
     * @returns 変換した strYMD です。
     */
    private cnvJsonstrYMD(json: JsonValue | undefined | null) {
        const nt = new strYMD();
        if (json === undefined || json === null || typeof json !== 'object') {
            return nt;
        }
        Object.assign(nt, json as JsonObject);
        // nt.Year = json.Year;
        // nt.Month = json.Month
        // nt.Day = json.Day;
        return nt;
    }

    /**
     * JSON 値から開始終了時期データを生成します。
     *
     * @param json 変換元 JSON 値です。
     * @returns 変換した開始終了時期データです。
     */
    private cnvJsonStart_End_Time_data(json: JsonValue | undefined | null) {
        const nt = new Start_End_Time_data();
        if (json === undefined || json === null || typeof json !== 'object') {
            return nt;
        }
        const jsonObj = json as JsonObject;
        nt.StartTime = this.cnvJsonstrYMD(jsonObj.StartTime);
        nt.EndTime = this.cnvJsonstrYMD(jsonObj.EndTime);
        return nt;
    }

    /**
     * JSON からフォント設定を生成します。
     *
     * @param jsonf 変換元 JSON オブジェクトです。
     * @param mdrmjFlag true の場合は mdrmj 内形式として解釈します。
     * @returns 変換したフォント設定です。
     */
    private cnvJsonFont(jsonf: JsonObject, mdrmjFlag: boolean) {
        const newf = new Font_Property();
        if (mdrmjFlag === false) {
            const bodyObj = jsonf.Body as JsonObject;
            newf.Color = this.cnvJsonColor(bodyObj.Color);
            newf.Size = bodyObj.Size as number;
            newf.italic = bodyObj.italic as boolean;
            newf.bold = bodyObj.bold as boolean;
            newf.Underline = bodyObj.Underline as boolean;
            newf.Name = bodyObj.Name as string;
            newf.Kakudo = bodyObj.Kakudo as number;
            newf.FringeF = bodyObj.FringeF as boolean;
            newf.FringeWidth = bodyObj.FringeWidth as number;
            newf.FringeColor = this.cnvJsonColor(bodyObj.FringeColor);
            newf.Back = this.cnvJsonBackGround_Box_Property(jsonf.Back as JsonObject, mdrmjFlag);
        } else {
            newf.Color = this.cnvJsonColor(jsonf.Color);
            newf.Size = jsonf.Size as number;
            newf.italic = jsonf.italic as boolean;
            newf.bold = jsonf.bold as boolean;
            newf.Underline = jsonf.Underline as boolean;
            newf.Name = jsonf.Name as string;
            newf.Kakudo = jsonf.Kakudo as number;
            newf.FringeF = jsonf.FringeF as boolean;
            newf.FringeWidth = jsonf.FringeWidth as number;
            newf.FringeColor = this.cnvJsonColor(jsonf.FringeColor);
            newf.Back = this.cnvJsonBackGround_Box_Property(jsonf.Back as JsonObject, mdrmjFlag);
        }
        return newf;
    }


    /**
     * JSON から矩形を生成します。
     *
     * @param jsonr 変換元 JSON オブジェクトです。
     * @param mdrmjFlag true の場合は mdrmj 内形式として解釈します。
     * @returns 変換した矩形です。
     */
    private cnvJsonRect(jsonr: JsonObject, mdrmjFlag: boolean) {
        const newr = new rectangle();
        if (mdrmjFlag === false) {
            newr.left = jsonr.Left as number;
            newr.right = jsonr.Right as number;
            newr.top = jsonr.Top as number;
            newr.bottom = jsonr.Bottom as number;
        } else {
            Object.assign(newr,jsonr);
        }
        return newr;
    }

    /**
     * JSON から RGBA 色を生成します。
     *
     * @param jsonc 変換元 JSON 値です。
     * @returns 変換した色です。
     */
    private cnvJsonColor(jsonc: JsonValue) {
        const newc = new colorRGBA();
        Object.assign(newc,jsonc);
        // newc.a = jsonc.a;
        // newc.r = jsonc.r;
        // newc.g = jsonc.g;
        // newc.b = jsonc.b;
        return newc;
    }

    /**
     * JSON から point を生成します。
     *
     * @param jsonp 変換元 JSON 値です。
     * @param mdrmjFlag true の場合は mdrmj 内形式として解釈します。
     * @returns 変換した座標です。
     */
    private cnvJsonPoint(jsonp: JsonValue, mdrmjFlag: boolean) {
        const newp = new point();
        const jsonpObj = jsonp as JsonObject;
        if (mdrmjFlag === false) {
            newp.x = jsonpObj.X as number;
            newp.y = jsonpObj.Y as number;
        } else {
            newp.x = jsonpObj.x as number;
            newp.y = jsonpObj.y as number;
        }
        return newp;
    }

    /**
     * JSON から背景ボックス設定を生成します。
     *
     * @param json 変換元 JSON オブジェクトです。
     * @param mdrmjFlag true の場合は mdrmj 内形式として解釈します。
     * @returns 変換した背景ボックス設定です。
     */
    private cnvJsonBackGround_Box_Property(json: JsonObject, mdrmjFlag: boolean = false) {
        const nt = new BackGround_Box_Property();
        nt.Tile = this.cnvJsonTile_Property(json.Tile as JsonObject, mdrmjFlag);
        nt.Line = this.cnvJsonLine_Property(json.Line as JsonObject, mdrmjFlag);
        nt.Round = json.Round as number;
        nt.Padding = json.Padding as number;
        return nt
    }

    /**
     * JSON から線端・線結合パターン設定を生成します。
     *
     * @param json 変換元 JSON オブジェクトです。
     * @param mdrmjFlag true の場合は mdrmj 内形式として解釈します。
     * @returns 変換した線端・線結合設定です。
     */
    private cnvJsonLineEdge_Connect_Pattern_Data_Info(json: JsonObject, mdrmjFlag: boolean) {
        const nt = new LineEdge_Connect_Pattern_Data_Info();
        if (mdrmjFlag === false) {
            const lc: CanvasLineCap[] = ['round', 'square','butt' ];
            const lj: CanvasLineJoin[] = [  'round','bevel','miter'];
            nt.lineCap = lc[json.Edge_Pattern as number];
            nt.lineJoin = lj[json.Join_Pattern as number];
            nt.miterLimit = json.MiterLimitValue as number;
            }else{
                Object.assign(nt,json);
        }
        return nt;
    }

    /**
     * JSON からライン設定を生成します。
     *
     * @param json 変換元 JSON 値です。
     * @param mdrmjFlag true の場合は mdrmj 内形式として解釈します。
     * @returns 変換したライン設定です。
     */
    private cnvJsonLine_Property(json: JsonValue, mdrmjFlag: boolean) {
        const nt = new Line_Property();
        const jsonObj = json as JsonObject;
        if (mdrmjFlag === false) {
            const basicLine = jsonObj.BasicLine as JsonObject;
            const solidLine = basicLine.SolidLine as JsonObject;
            const crossLine = jsonObj.CrossLine as JsonObject;
            const parallelLine = jsonObj.ParallelLine as JsonObject;
            nt.Width = solidLine.Width as number;
            nt.Color = this.cnvJsonColor(solidLine.Color);
            nt.Edge_Connect_Pattern = this.cnvJsonLineEdge_Connect_Pattern_Data_Info(jsonObj.Edge_Connect_Pattern as JsonObject, mdrmjFlag);
            if ((basicLine.pattern !== -1) || (crossLine.XLine_f === true) || (
                (parallelLine.P_Line_f === true) && (parallelLine.InnerColor_f === true))) {
                nt.BlankF = false;
            } else {
                nt.BlankF = true;
            }
        } else {
            nt.Width = jsonObj.Width as number;
            nt.Color = this.cnvJsonColor(jsonObj.Color);
            nt.Edge_Connect_Pattern = this.cnvJsonLineEdge_Connect_Pattern_Data_Info(jsonObj.Edge_Connect_Pattern as JsonObject, mdrmjFlag);
            nt.BlankF= jsonObj.BlankF as boolean;
        }
        return nt;
    }

    /**
     * JSON から塗り設定を生成します。
     *
     * @param json 変換元 JSON オブジェクトです。
     * @param mdrmjFlag true の場合は mdrmj 内形式として解釈します。
     * @returns 変換した塗り設定です。
     */
    private cnvJsonTile_Property(json: JsonObject, mdrmjFlag: boolean) {
        const nt = new Tile_Property();
        if (mdrmjFlag === false) {
            nt.BlankF = (json.TileCode === 7);
            const line = json.Line as JsonObject;
            const basicLine = line.BasicLine as JsonObject;
            const solidLine = basicLine.SolidLine as JsonObject;
            nt.Color = this.cnvJsonColor(solidLine.Color);
        } else {
            nt.BlankF = json.BlankF as boolean;
            nt.Color = this.cnvJsonColor(json.Color);
        }
        return nt;
    }

    /**
     * JSON から記号設定を生成します。
     *
     * @param json 変換元 JSON オブジェクトです。
     * @param mdrmjFlag true の場合は mdrmj 内形式として解釈します。
     * @returns 変換した記号設定です。
     */
    private cnvJsonMark_Property(json: JsonObject, mdrmjFlag: boolean = false) {
        const nt = new Mark_Property();
        nt.PrintMark = json.PrintMark as number;
        nt.ShapeNumber = json.ShapeNumber as number;
        nt.Tile = this.cnvJsonTile_Property(json.Tile as JsonObject, mdrmjFlag);
        nt.Line = this.cnvJsonLine_Property(json.Line, mdrmjFlag);
        nt.wordmark = json.wordmark as string;
        nt.WordFont = this.cnvJsonFont(json.WordFont as JsonObject, mdrmjFlag);
        return nt;
    }
}

export { clsMapdata, Object_NameTimeStac_Data, Zahyo_info, strCompass_Attri };
