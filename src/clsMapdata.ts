// @ts-nocheck
import { appState } from './core/AppState';
import { Generic } from './clsGeneric';
import { clsTime } from './clsTime';
import { clsSortingSearch } from './SortingSearch';
import { clsDraw } from './clsDraw';
import { SpatialIndexSearch } from './SpatialIndexSearch';

/** Description placeholder */
class Hennyu_Data {
    code?: number;
    Name?: string;
    Time?: strYMD;
    Part?: boolean;
}

//オブジェクト継承データ（地図データ）
/**
 * Description placeholder
 */
class Object_Succession_Data {
    ObjectCode?: number;
    Time: strYMD = new strYMD();

    Clone(): Object_Succession_Data {
        let d = new Object_Succession_Data();
        d.ObjectCode = this.ObjectCode;
        d.Time = this.Time.Clone();
        return d;
    }
}

//オブジェクト名スタック（地図データ）
/**
 * Description placeholder
 */
class Object_NameTimeStac_Data {
    NamesList: string[] = [];
    SETime: Start_End_Time_data = new Start_End_Time_data();

    connectNames(delimiter: string = '/'): string {
        return this.NamesList.join(delimiter);
    }

    Clone(): Object_NameTimeStac_Data {
        let o = new Object_NameTimeStac_Data();
        o.SETime = this.SETime.Clone();
        o.NamesList = Generic.ArrayShallowCopy(this.NamesList);
        return o;
    }
}

// オブジェクト代表点（地図データ）
/**
 * Description placeholder
 */
class Object_CenterPoint_Data {
    Position: point = new point();
    SETime: Start_End_Time_data = new Start_End_Time_data();

    Clone(): Object_CenterPoint_Data {
        let d = new Object_CenterPoint_Data();
        d.Position = this.Position.Clone();
        d.SETime = this.SETime.Clone();
        return d;
    }
}

/**
 * Description placeholder
 */
class LineCodeStac_Data {
    LineCode?: number;
    NumOfTime?: number;
    Times: Start_End_Time_data[] = [];

    Clone(): LineCodeStac_Data {
        let d = new LineCodeStac_Data();
        d.LineCode = this.LineCode;
        d.NumOfTime = this.NumOfTime;
        d.Times = Generic.ArrayClone(this.Times);
        return d;
    }
}

/**
 * Description placeholder
 *
 * @type {{ NormalObject: number; AggregationObject: number; }}
 */
const enmObjectGoupType_Data = {
    NormalObject: 0, //通常のオブジェクト
    AggregationObject: 1//集成オブジェクト
}


class strMPObjDefAttData_Info {
    Title: string = "";
    Unit: string = "";
    MissingF: boolean = false;
    Note: string = "";
    /**
 * Creates an instance of strMPObjDefAttData_Info.
 *
 * @constructor
 */
constructor() {
        this.Title = "";
        this.Unit = ""; //String
        this.MissingF = false; //Boolean
        this.Note;  //String
    }
    get AttDataType() {
        return Generic.getAttDataType_From_TitleUnit(this.Title, this.Unit);
    }
    /**
 * Description placeholder
 *
 * @type {*}
 */
set AttDataType(value) {
        let tu = Generic.SetTitleUnit_from_AttDataType(value, this.Title, this.Unit);
        this.Title = tu.title;
        this.Unit = tu.unit;
    }
    Clone(): strMPObjDefAttData_Info {
        let d = new strMPObjDefAttData_Info();
        Object.assign(d, this);
        return d;
    }
}

//初期時点属性データで、所定時点以外を指定した場合のデータの処理
/**
 * Description placeholder
 *
 * @type {{ MissingValue: number; NearestValue: number; interpolation_MissingValue: number; interpolation_NearestValue: number; }}
 */
const enmDefPointAttDataExtraValue = {
    MissingValue: 0,
    NearestValue: 1,
    interpolation_MissingValue: 2,
    interpolation_NearestValue: 3
}

//初期時間属性データの種類
/**
 * Description placeholder
 *
 * @type {{ PointData: number; SpanData: number; interpolation_MissingValue: number; interpolation_NearestValue: number; }}
 */
const enmDefTimeAttDataType = {
    PointData: 0,
    SpanData: 1,
    interpolation_MissingValue: 2,
    interpolation_NearestValue: 3
}

//初期時間属性データのデータ項目（オブジェクトグループに指定）
/**
 * Description placeholder
 *
 * @returns 
 */
class strMPObjDefTimeAttData_Info {
    Type?: number;
    attData: strMPObjDefAttData_Info = new strMPObjDefAttData_Info();
    ExtraValue?: number;

    Clone(): strMPObjDefTimeAttData_Info {
        let d = new strMPObjDefTimeAttData_Info();
        Object.assign(d, this);
        d.attData = this.attData.Clone();
        return d;
    }
}

//オブジェクトグループデータ
/**
 * Description placeholder
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

    Clone(): strObjectGroup_Data {
    let d = new strObjectGroup_Data();
    Object.assign(d, this);
    d.DefTimeAttSTC = [];
    for (let i in this.DefTimeAttSTC) {
        d.DefTimeAttSTC[i] = this.DefTimeAttSTC[i].Clone();
    }
    d.ObjectNameList = this.ObjectNameList.slice();
    d.UseLineType = this.UseLineType.slice();
    d.UseObjectGroup = this.UseObjectGroup.slice();
    return d;
    }
}

//初期時間属性データ個別(TypeがPointの場合はSpanの開始だけを使う)
/**
 * Description placeholder
 */
class strDefTimeAttDataEach_Info {
    Span: Start_End_Time_data = new Start_End_Time_data();
    Value?: string;

    Clone(): strDefTimeAttDataEach_Info {
        let d = new strDefTimeAttDataEach_Info();
        d.Span = this.Span.Clone();
        d.Value = this.Value;
        return d;
    }
}

//初期時間属性データ
/**
 * Description placeholder
 */
class strDefTimeAttData_Info {
    Data: strDefTimeAttDataEach_Info[] = [];

    Clone(): strDefTimeAttData_Info {
        let d = new strDefTimeAttData_Info();
        d.Data = Generic.ArrayClone(this.Data);
        return d;
    }
}

//オブジェクト（地図データ）
/**
 * Description placeholder
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

    Clone(): strObj_Data {
    let d=new strObj_Data();
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

//方位の文字
/**
 * Description placeholder
 */
class dirWord_Data {
    East: string = "";
    West: string = "";
    North: string = "";
    South: string = "";

    Clone(): dirWord_Data {
    let w = new dirWord_Data();
    w.East = this.East;
    w.West = this.West;
    w.North = this.North;
    w.South = this.South;
    return w;
    }
}

//方位の設定（地図・属性データ）
/**
 * Description placeholder
 */
class strCompass_Attri {
    Visible?: boolean;
    Position: point = new point();
    Mark: Mark_Property = new Mark_Property();
    dirWord: dirWord_Data = new dirWord_Data();
    Font: Font_Property = new Font_Property();

    Clone(): strCompass_Attri {
    let cp = new strCompass_Attri();
    cp.Visible = this.Visible;
    cp.Position = this.Position.Clone();
    cp.Mark = this.Mark.Clone();
    cp.dirWord = this.dirWord.Clone();
    cp.Font = this.Font.Clone();
    return cp;
    }
}

//ライン線種・時間データ（地図データ）
/**
 * Description placeholder
 */
class Line_Time_Data {
    Kind?: number;
    SETime: Start_End_Time_data = new Start_End_Time_data();

    Clone(): Line_Time_Data {
        let d = new Line_Time_Data();
        d.Kind = this.Kind;
        d.SETime = this.SETime.Clone();
        return d;
    }

    Equals(LT: Line_Time_Data): boolean {
        if (LT.Kind == this.Kind) {
            if (LT.SETime.Equals(this.SETime)) {
                return true;
            }
        }
        return false;
    }
}

//ラインデータ（地図データ）
/**
 * Description placeholder (属性・地図データ用のライン情報)
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

    Clone(): strLine_Data {
        let d = new strLine_Data();
        Object.assign(d, this);
        d.Circumscribed_Rectangle = this.Circumscribed_Rectangle.Clone();
        d.PointSTC = Generic.ArrayClone(this.PointSTC);
        d.LineTimeSTC = Generic.ArrayClone(this.LineTimeSTC);
        return d;
    }
}

//利用可能なライン（属性・地図データ）
/**
 * Description placeholder
 */
class EnableMPLine_Data {
    LineCode?: number;
    Kind?: number;

    constructor(lcode?: number, Kind?: number) {
        this.LineCode = lcode;
        this.Kind = Kind;
    }

    Clone(): EnableMPLine_Data {
        let d = new EnableMPLine_Data();
        Object.assign(d, this);
        return d;
    }
}

/**
 * Description placeholder
 */
class Zahyo_info {
    Mode?: number;
    System?: number;
    HeimenTyokkaku_KEI_Number?: number;
    Projection?: number;
    CenterXY: point = new point();

    Clone(): Zahyo_info {
        let d = new Zahyo_info();
        Object.assign(d, this);
        d.CenterXY = this.CenterXY.Clone();
        return d;
    }
}

/**
 * Description placeholder
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
 * Description placeholder
 */
class strLKOjectGroup_Info {
    GroupNumber?: number;
    UseOnly?: boolean;
    Pattern: Line_Property = new Line_Property();

    Clone(): strLKOjectGroup_Info {
        let d = new strLKOjectGroup_Info();
        Object.assign(d, this);
        d.Pattern = this.Pattern.Clone();
        return d;
    }
}



//線種をオブジェクトグループ連動を個別に数えた場合に使用
/**
 * Description placeholder
 */
class LPatSek_Info {
    LKind?: number;
    LkindPatNum?: number;
    Name?: string;
    Pat: Line_Property = new Line_Property();
}

/** Description placeholder */
class Map_Detail_Data {
    DistanceMeasurable?: boolean;
    ScaleVisible?: boolean;
}

//面オブジェクトの境界線の方向
//Boundary_Arrange関数で使用
/** Description placeholder */
class Hennyu_Data2 {
    code?: number;
    Direction?: number;
}



/**
 * Description placeholder
 *
 * @returns 
 */
class clsMapdata {
    Map: strMap_data;
    ObjectKind: strObjectGroup_Data[] = [];
    MPObj: strObj_Data[] = [];
    LineKind: strLKOjectGroup_Info[] = [];
    MPLine: strLine_Data[] = [];
    DefTimeAttSTC: strMPObjDefTimeAttData_Info[] = [];
    NoDataFlag: boolean = false;
    private Enable_MPObjStac: unknown[] = []; // EnableMPOBJ_Data未定義

    constructor() {
        this.Map = new strMap_data();
    }

    //地図データを初期化
    init_MapData() {
        this.ObjectKind = [];
        this.MPObj = [];
        this.LineKind = [];
        this.MPLine = [];
        let m = new strMap_data();
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

    //初期属性データ項目を追加（時間属性設定なし）
    Add_one_DefAttDataSet(OBKNum: number, title: string, Unit: string, Note: string) {
        let ok = this.ObjectKind[OBKNum];
        let def = new strMPObjDefTimeAttData_Info();
        def.attData.Title = title;
        def.attData.Unit = Unit;
        def.attData.Note = Note;
        ok.DefTimeAttSTC[ok.DefTimeAttDataNum] = def;
        ok.DefTimeAttDataNum++;
    }

    //方位記号の初期値設定
    init_Compass_First() {
        let mc = this.Map.MapCompass;
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

    Get_Compass_Position_First_Position() {
        let mc = this.Map.Circumscribed_Rectangle;
        let pxy = new point();
        pxy.x = mc.left + (mc.right - mc.left) / 20;
        pxy.y = mc.top + (mc.bottom - mc.top) / 20;
        return pxy;
    }

    //オブジェクトグループの代表点の色の初期値を決める(同時に全部)
    Set_First_ObjectKind_Color() {

        for (let i = 0; i < this.Map.OBKNum; i++) {
            this.ObjectKind[i].Color = this.Set_First_ObjectKind_Color_Solo(i);
        }
    }
    //オブジェクトグループの代表点の色の初期値を決める（一つずつ）
    Set_First_ObjectKind_Color_Solo(ObkCode: number) {
        let Object_Color = [];
        Object_Color.push(new colorRGBA(0, 255, 0));
        Object_Color.push(new colorRGBA(0, 255, 255));
        Object_Color.push(new colorRGBA(255, 255, 0));
        Object_Color.push(new colorRGBA(255, 0, 255));
        Object_Color.push(new colorRGBA(200, 200, 200));
        let v1 = ObkCode % 6;
        let v2 = Math.floor(ObkCode / 6);
        let col = new colorRGBA(Object_Color[v1].r - v2 / 50, Object_Color[v1].g - v2 / 50, Object_Color[v1].b - v2 / 50);
        return col;
    }

    //ラインの初期化
    Init_One_Line(LineKindNumber: number) {
        let line = new strLine_Data();
        line.Number = -1;
        line.NumOfPoint = 0;
        line.NumOfTime = 1;
        let lt = new Line_Time_Data();
        lt.Kind = LineKindNumber;
        lt.SETime = clsTime.GetNullStartEndYMD();
        line.LineTimeSTC.push(lt);
        return line;
    }

    //初期化したオブジェクトを返す
    Init_One_Object(ObjectKindNumber: number) {
        let Obj = new strObj_Data();
        Obj.Number = -1;
        Obj.NumOfNameTime = 1;
        Obj.NumOfCenterP = 1;
        Obj.NumOfLine = 0;
        Obj.NumOfSuc = 0;
        Obj.Shape = enmShape.PointShape;
        Obj.Kind = ObjectKindNumber;
        let ok = this.ObjectKind[ObjectKindNumber];
        if (ok.DefTimeAttDataNum > 0) {
            Obj.DefTimeAttValu = [];
            for (let i = 0; i < ok.DefTimeAttDataNum; i++) {
                Obj.DefTimeAttValue.push([]);
            }
        }
        let NL = new Object_NameTimeStac_Data();
        NL.NamesList.length = ok.ObjectNameNum;
        NL.NamesList.fill("");
        NL.SETime = clsTime.GetNullStartEndYMD();
        Obj.NameTimeSTC.push(NL);
        let cp = new Object_CenterPoint_Data();
        cp.SETime = clsTime.GetNullStartEndYMD();
        Obj.CenterPSTC.push(cp);
        return Obj;
    }

    Save_Object(EditingObject: strObj_Data, checkObjectmaxMinFlaf: boolean) {

        if (EditingObject.Number == -1) {
            //新規オブジェクト
            EditingObject.Number = this.Map.Kend;
            this.Map.Kend++;
        }
        this.MPObj[EditingObject.Number] = EditingObject.Clone();
        if (checkObjectmaxMinFlaf == true) {
            this.Check_Obj_Maxmin(this.MPObj[EditingObject.Number], true);
        }
    }

    //ライン登録
    Save_Line(EditingLine: strLine_Data, checkRelatedLineFlag: boolean, checkRelatedObjectShapeFlag: boolean, checkLineMaxMinFlag: boolean) {
        let SEpoint = [];
        let newf;
        SEpoint.push(EditingLine.PointSTC[0].Clone());
        SEpoint.push(EditingLine.PointSTC[EditingLine.NumOfPoint-1].Clone());
        if (EditingLine.Number == -1) {
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
        if (checkLineMaxMinFlag == true) {
            this.Check_Line_Maxmin(EditingLine.Number, true);
        }

        if ((newf == false) && (checkRelatedObjectShapeFlag == true)) {
            //当該ラインを使用するオブジェクトの形状チェック
            for (let i = 0; i < this.Map.Kend; i++) {
                let ob = this.MPObj[i];
                for (let j = 0; j < ob.NumOfLine; j++) {
                    if (ob.LineCodeSTC[j].LineCode == EditingLine.Number) {
                        ob.Shape = this.Check_Obj_Shape_AllTime(ob);
                        break;
                    }
                }
            }
        }

        if (checkRelatedLineFlag == true) {
            this.Check_Related_Line(SEpoint, EditingLine.Number);
        }
    }

    //指定した起終点の座標のラインを検索し、結節関係をチェックする
    Check_Related_Line(SEpoint: point[], exCode: number) {
        let n = SEpoint.length;
        for (let i = 0; i < this.Map.ALIN; i++) {
            let ml = this.MPLine[i];
            if ((i != exCode) && (ml.NumOfPoint > 0)) {
                let f = false;
                for (let j = 0; j < n; j++) {
                    if (SEpoint[j].Equals(ml.PointSTC[0]) == true) {
                        f = true;
                        break;
                    } else if (SEpoint[j].Equals(ml.PointSTC[ml.NumOfPoint - 1]) == true) {
                        f = true
                        break;
                    }
                }
                if (f == true) {
                    let ct = this.Check_Line_Connect(ml, exCode);
                    if (ct != ml.Connect) {
                        ml.Connect = ct;
                    }
                }
            }
        }
    }

    //指定したラインの他ラインとの接続状況を返す
    //exclude_codeで、比較対象からはずすラインを指定できる
    Check_Line_Connect(Line: strLine_Data, exclusion_code = -1) {
        let ck = this.Check_Line_Connect_Detail(Line, exclusion_code);
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

    //指定したラインの他ラインとの接続状況の詳細を返す
    Check_Line_Connect_Detail(Line: strLine_Data, exclusion_code = -1) {
        if (Line.NumOfPoint == 0) {
            return 0;
        }

        let XY1 = Line.PointSTC[0];
        let XY2 = Line.PointSTC[Line.NumOfPoint - 1];

        if (XY1.Equals(XY2) == true) {
            return 4;
        }

        let ret_v = 0;
        for (let i = 0; i < this.Map.ALIN; i++) {
            if ((i != exclusion_code) && (i != Line.Number)) {
                let ml = this.MPLine[i];
                let n = ml.NumOfPoint;
                if (n > 0) {
                    let pxy1 = ml.PointSTC[0];
                    let pxy2 = ml.PointSTC[n - 1];
                    if ((pxy1.Equals(XY1) == true) || (pxy2.Equals(XY1) == true)) {
                        ret_v = (ret_v) || (1);
                    }
                    if ((pxy1.Equals(XY2) == true) || (pxy2.Equals(XY2) == true)) {
                        ret_v = (ret_v) || (2);
                    }
                }
            }
        }
        return ret_v;
    }

    //同じオブジェクトグループ名の番号を返す見つからなかった場合-1
    Get_ObjectGroupNumber_By_Name(Name: string) {
        for (let i = 0; i < this.Map.OBKNum; i++) {
            if (this.ObjectKind[i].Name == Name) {
                return i;
            }
        }
        return -1;
    }

    //Get_TotalLineKindのラインパターンを地図データの線種に設定する
    Set_TotalLineKind(LPC: unknown[]) { //LPatSek_Info
        let n = 0;
        for (let i = 0; i < this.Map.LpNum; i++) {
            let lk = this.LineKind[i];
            for (let j = 0; j < lk.NumofObjectGroup; j++) {
                lk.ObjGroup[j].Pattern = LPC[n].Pat.Clone();
                n += 1
            }
        }
    }

    //指定したオブジェクトグループのオブジェクトを抽出して配列に取得(時間指定)
    Get_Objects_by_Group(ObjGroup: number, Time: number) {
        let Get_Objects = [];
        for (let i = 0; i < this.Map.Kend; i++) {
            if (this.MPObj[i].Kind == ObjGroup) {
                if (this.CheckEnableObject(this.MPObj[i], Time) == true) {
                    Get_Objects.push(i);
                }
            }
        }
        return Get_Objects;
    }

    //地図データを指定の座標モードに変換 
    Convert_ZahyoMode(newMapZahyo: Zahyo_info) {
        let m = this.Map;
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

    //地図ファイルの外接四角形を計算して返す
    Get_Mapfile_Rectangle() {
        let MapRec;
        let m = this.Map;
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

    //全てのオブジェクトの大きさを求める
    Check_All_Obj_MaxMin() {
        let m = this.Map;
        for (let i = 0; i < m.Kend; i++) {
            this.Check_Obj_Maxmin(this.MPObj[i], false);
        }

    }

    /**線のポイントを指定した距離に応じて削除、座標と数を返すルーチン */
    Smoothing_Line(_PointXY: point[], s_distanceas: number){
        let PointXY = Generic.ArrayClone(_PointXY);
        let FirstPointNum = PointXY.length;
        if (FirstPointNum <= 3) {
            return PointXY;
        }

        let LoopF = false;
        if (PointXY[0].Equals(PointXY[FirstPointNum - 1]) == true) {
            LoopF = true;
        } else {
            LoopF = false;
        }

        let Push_point = new Array(FirstPointNum);
        let ts = FirstPointNum;
        let n = 0;
        let Cng_f;
        do {
            Cng_f = false;
            for (let k = 0; k <= 1; k++) {
                FirstPointNum = ts;
                if (k == 1) {
                    Push_point[1] = PointXY[1].Clone();
                }
                n = 1 + k;
                if ((LoopF == true) && (FirstPointNum <= 8)) {
                    break;
                }
                for (let j = 1 + k; j <= FirstPointNum - 3; j += 2) {
                    let D;
                    if (this.Map.Zahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido) {
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
                if (((FirstPointNum % 2 == 1) && (k == 0)) || ((FirstPointNum % 2 == 0) && (k == 1))) {
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
        } while (Cng_f == true);
        return PointXY;
    }
    
    //線種を一つ追加する
    Add_OneLineKind(LineKindName: string, LPat: Line_Property, LMesh: boolean) {
        this.LineKind.push(this.Get_OneLineKind_Parameter(LineKindName, LPat, LMesh));
        this.Map.LpNum++;
        for (let i = 0; i < this.Map.OBKNum; i++) {
            this.ObjectKind[i].UseLineType.push(false);
        }
    }

    Get_OneLineKind_Parameter(LineKindName: string, LPat: Line_Property, LMesh: boolean) {
        let Lkind = new LineKind_Data();
        Lkind.ObjGroup = [];
        Lkind.ObjGroup.push(new strLKOjectGroup_Info());
        Lkind.Name = LineKindName;
        Lkind.ObjGroup[0].Pattern = LPat.Clone();
        Lkind.Mesh = LMesh;
        Lkind.NumofObjectGroup = 1;
        return Lkind;
    }

    //オブジェクトグループの追加
    Add_OneObjectGroup_Parameter(Name: string, Shape: number, Mesh: boolean, type: number) {
        let Okind = this.Get_OneObjectGroup_Parameter(Name, Shape, this.Map.OBKNum, this.Map.LpNum, Mesh, type);
        this.ObjectKind.push(Okind);
        for (let i = 0; i < this.Map.OBKNum; i++) {
            if (this.ObjectKind[i].ObjectType == enmObjectGoupType_Data.AggregationObject) {
                this.ObjectKind[i].UseObjectGroup.push(false);
            }
        }
        this.Map.OBKNum++;
    }

    //新規オブジェクトグループパラメータの取得
    Get_OneObjectGroup_Parameter(Name: string, Shape: number, ObkNum: number, LpNum: number, Mesh: boolean, type: number) {
        let Okind = new strObjectGroup_Data();
        Okind.Color = clsBase.ColorWhite();//マップエディタがないので設定不要
        Okind.Mesh = Mesh;
        Okind.Name = Name;
        Okind.Shape = Shape;
        Okind.ObjectType = type;
        Okind.DefTimeAttDataNum = 0;
        Okind.ObjectNameNum = 1;
        Okind.ObjectNameList = ["オブジェクト名1"];
        if (type == enmObjectGoupType_Data.AggregationObject) {
            Okind.UseLineType.length = (Math.max(ObkNum, 0));
        } else {
            Okind.UseLineType.length = (Math.max(LpNum - 1, 0));
        }
        Okind.UseLineType.fill(false);
        return Okind;
    }

    //Y座標を反転
    YReverse() {

        this.Map.Circumscribed_Rectangle.top = -this.Map.Circumscribed_Rectangle.top;
        this.Map.Circumscribed_Rectangle.bottom = -this.Map.Circumscribed_Rectangle.bottom;

        for (let i = 0; i < this.Map.ALIN; i++) {
            let mp = this.MPLine[i];
            for (let j = 0; j < mp.NumOfPoint; j++) {
                mp.PointSTC[j].y = -mp.PointSTC[j].y;
                mp.Circumscribed_Rectangle.top = -mp.Circumscribed_Rectangle.top;
                mp.Circumscribed_Rectangle.bottom = -mp.Circumscribed_Rectangle.bottom;
            }
        }

        for (let i = 0; i < this.Map.Kend; i++) {
            let mo = this.MPObj[i];
            for (let j = 0; j < mo.NumOfCenterP; j++) {
                mo.CenterPSTC[j].Position.y = -mo.CenterPSTC[j].Position.y;
                mo.Circumscribed_Rectangle.top = -mo.Circumscribed_Rectangle.top;
                mo.Circumscribed_Rectangle.bottom = -mo.Circumscribed_Rectangle.bottom;
            }
        }
    }

    //座標値が緯度経度そのままの地図データを、投影変換後の座標に変換する
    MapLatLon_Zahyo_convert() {
        let XY_Rect = this.Get_Mapfile_Rectangle();
        this.Map.SCL = 1;
        this.Map.SCL_U = enmScaleUnit.kilometer;
        this.Map.Zahyo.CenterXY = XY_Rect.centerP();
        for (let i = 0; i < this.Map.ALIN; i++) {
            let ml = this.MPLine[i];
            for (let j = 0; j < ml.NumOfPoint; j++) {
                ml.PointSTC[j] = spatial.Get_Converted_XY(ml.PointSTC[j], this.Map.Zahyo);
            }
            this.Check_Line_Maxmin(i, false);
        }
        for (let i = 0; i < this.Map.Kend; i++) {
            let mo = this.MPObj[i];
            let CP;
            switch (mo.Shape) {
                case enmShape.PointShape:
                    CP = mo.CenterPSTC[0].Position;
                    CP = spatial.Get_Converted_XY(CP, this.Map.Zahyo);
                    break;
                case enmShape.PolygonShape:
                    CP = this.GetObjGraviityXY(mo, clsTime.GetNullYMD());
                    break;
                case enmShape.LineShape:
                    let ml = this.MPLine[mo.LineCodeSTC[0].LineCode];
                    CP = ml.PointSTC[Math.floor(ml.NumOfPoint / 2)];
                    break;
            }
            mo.CenterPSTC[0].Position = CP;
            this.Check_Obj_Maxmin(mo, false);
        }
        this.Map.Circumscribed_Rectangle = this.Get_Mapfile_Rectangle();
    }

    GetObjectGravity_All() {
        for (let i = 0; i < this.Map.Kend; i++) {
            let mo = this.MPObj[i];
            switch (mo.Shape) {
                case enmShape.PolygonShape:
                    let CP;
                    CP = this.GetObjGraviityXY(mo, clsTime.GetNullYMD());
                    // @ts-expect-error - type narrowing issue
                    mo.CenterPSTC[0].Position = CP.Clone();
            }
            this.Check_Obj_Maxmin(mo, false);
        }
    }
    //オブジェクトの重心を求める。面形状でない場合はundefinedを返す
    GetObjGraviityXY(ObjData: strObj_Data, L_Time: number) {
        if (ObjData.Shape != enmShape.PolygonShape) {
            //ポリゴンでない場合は求めない
            return undefined;
        }

        let GPoint = new point();
        let retV: unknown = this.Menseki(ObjData,  L_Time);
        let xy2=retV.gpoint;
        if (retV.menseki == -1) {
            return false;
        } else if (retV.menseki == 0) {
            GPoint = xy2.Clone();
        } else {
            //重心がオブジェクト内部に収まるかチェック
            let ELine = this.Get_EnableMPLine(ObjData, L_Time);;
            let Fringe_Line = [];
            for (let j = 0; j < ELine.length; j++) {
                Fringe_Line.push(ELine[j].LineCode);
            }
            let retV: unknown = this.Check_Point_in_Polygon_LineCode(xy2.x, xy2.y, Fringe_Line);
            if (retV.ok == true) {
                GPoint = xy2.Clone();
            } else {
                //入らない場合
                let Cross_x=retV.CrossPoint_X;
                let crn=Cross_x.length;
                if (crn < 2) {
                    GPoint = this.MPLine[Fringe_Line[0]].PointSTC[0];
                    return false
                }
                let mw = Cross_x[1] - Cross_x[0];
                let mww = 0;
                if (crn % 2 == 1) {
                    crn -= 1;
                }
                if (crn >= 4) {
                    for (let i = 2; i <= crn - 1; i += 2) {
                        let mw2 = Cross_x[i + 1] - Cross_x[i];
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

    Check_Obj_Maxmin(ObjData: strObj_Data, MapRectCheckF: boolean) {
        let oldObjRect = ObjData.Circumscribed_Rectangle;
        let Obj_rect = new rectangle();
        for (let i = 0; i < ObjData.NumOfCenterP; i++) {
            let p = ObjData.CenterPSTC[i].Position;
            if (i == 0) {
                Obj_rect = new rectangle(p);
            } else {
                Obj_rect = spatial.getCircumscribedRectangle(p, Obj_rect);
            }
        }
        if (this.ObjectKind[ObjData.Kind].ObjectType == enmObjectGoupType_Data.NormalObject) {
            if (ObjData.NumOfLine > 0) {
                for (let i = 0; i < ObjData.NumOfLine; i++) {
                    Obj_rect = spatial.getCircumscribedRectangle(this.MPLine[ObjData.LineCodeSTC[i].LineCode].Circumscribed_Rectangle, Obj_rect);
                }
            }
        } else {
            let AggObs = this.Get_MpObj_used_AggregateObject(ObjData, clsTime.GetNullYMD());
            for (let i = 0; i < AggObs.length; i++) {
                let m = this.MPObj[AggObs[i]];
                if (this.ObjectKind[m.Kind].ObjectType == enmObjectGoupType_Data.NormalObject) {
                    Obj_rect = spatial.getCircumscribedRectangle(m.Circumscribed_Rectangle, Obj_rect);
                }
            }
        }
        ObjData.Circumscribed_Rectangle = Obj_rect;
        if (MapRectCheckF == true) {
            this.Check_MapCircumscribedRectangle(oldObjRect, Obj_rect);
        }
    }
    Check_MapCircumscribedRectangle(oldRect: rectangle, newRect: rectangle) {
        if (spatial.Compare_Two_Rectangle_Position(this.Map.Circumscribed_Rectangle, newRect) != cstRectangle_Cross.cstInclusion) {
            //内部に含まれない場合はUNIONで外接四角形を求める
            this.Map.Circumscribed_Rectangle = spatial.Get_Rectangle_Union(this.Map.Circumscribed_Rectangle, newRect);
        } else {
            //newRectが内部に含まれる場合
            if (spatial.Check_TwoRectangele_Inner_Contact(this.Map.Circumscribed_Rectangle, oldRect) == true) {
                //oldRectが地図データの外周の一部だった場合は再計算
                this.Map.Circumscribed_Rectangle = this.Get_Mapfile_Rectangle();
            }
        }
    }

    Checl_All_Line_Maxmin() {
        let m = this.Map;
        for (let i = 0; i < m.ALIN; i++) {
            this.Check_Line_Maxmin(i, false);
        }
    }

    //指定したラインコードの外接四角形を求める
    Check_Line_Maxmin(Lcode: number, MapRectCheckF: boolean) {
        let oldRect = this.MPLine[Lcode].Circumscribed_Rectangle;
        this.MPLine[Lcode].Circumscribed_Rectangle = spatial.getCircumscribedRectangle(this.MPLine[Lcode].PointSTC);
        if (MapRectCheckF == true) {
            this.Check_MapCircumscribedRectangle(oldRect, this.MPLine[Lcode].Circumscribed_Rectangle);
        }

    }

    //選択したオブジェクトグループ同士が同じかどうかを調べる
    // <param name="ObjSel">選択したオブジェクトグループにtrue</param>
    // <param name="Emes">エラーメッセージ（戻り値）</param>
    // <param name="check_objType">オブジェクトのタイプをチェックする場合true</param>
    // <param name="check_objNameListNum">オブジェクト名リストの数をチェックする場合true</param>
    Check_Selected_ObjectGroup_Same(ObjSel: boolean[], check_objType: boolean, check_objNameListNum: boolean) {
        let f = true;
        let Emes = "";
        let SeFlOb = -1;
        for (let i = 0; i < this.Map.OBKNum; i++) {
            if (ObjSel[i] == true) {
                if (SeFlOb == -1) {
                    SeFlOb = i;
                } else {
                    if (this.ObjectKind[i].Shape != this.ObjectKind[SeFlOb].Shape) {
                        Emes = "異なる形状のオブジェクトグループが選択されています。";
                        f = false;
                        break;
                    }
                    if (check_objType == true) {
                        if (this.ObjectKind[i].ObjectType != this.ObjectKind[SeFlOb].ObjectType) {
                            Emes = "異なるオブジェクトのタイプのオブジェクトグループが選択されています。";
                            f = false;
                            break;
                        }
                    }
                    if (check_objNameListNum == true) {
                        if (this.ObjectKind[i].ObjectNameNum != this.ObjectKind[SeFlOb].ObjectNameNum) {
                            Emes = "オブジェクト名リスト数が異なるオブジェクトグループが選択されています。";
                            f = false;
                            break;
                        } else {
                            for (let j = 0; j < this.ObjectKind[i].ObjectNameNum; j++) {
                                if (this.ObjectKind[i].ObjectNameList(j) != this.ObjectKind[SeFlOb].ObjectNameList[j]) {
                                    Emes = "オブジェクト名リストの名称が異なるオブジェクトグループが選択されています。";
                                    f = false;
                                    i = this.Map.OBKNum - 1
                                    break;
                                }
                            }
                        }
                    }
                    if (this.ObjectKind[i].DefTimeAttDataNum != this.ObjectKind[SeFlOb].DefTimeAttDataNum) {
                        Emes = "初期属性数が異なるオブジェクトグループが選択されています。";
                        f = false;
                        break;
                    } else {
                        for (let j = 0; j < this.ObjectKind[i].DefTimeAttDataNum; j++) {
                            if ((this.ObjectKind[i].DefTimeAttSTC[j].attData.Title != this.ObjectKind[SeFlOb].DefTimeAttSTC[j].attData.Title) ||
                                (this.ObjectKind[i].DefTimeAttSTC[j].attData.Unit != this.ObjectKind[SeFlOb].DefTimeAttSTC[j].attData.Unit)) {
                                Emes = "初期属性のタイトルまたは単位が異なるオブジェクトグループが選択されています。";
                                f = false;
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

    //指定したオブジェクトの境界線を面領域を描くような順番に並べ替える
    Boundary_Arrange(ObjData_objNum: number, Time: number) {
        let ELine = this.Get_EnableMPLine(ObjData_objNum, Time)
        let boundArrange = this.Boundary_Arrange_Sub(ELine);
        return boundArrange;
    }

    //オブジェクトの使用するラインの境界線を面領域を描くような順番に並べ替える
    Boundary_Arrange_Sub(ELine: unknown[]): boundArrangeData {
        let boundArrange = new boundArrangeData();
        let NL = ELine.length;
        if (NL == 0) {
            boundArrange.Pon = 0;
            return boundArrange;
        }
        let spxy = [];
        let epxy = [];
        for (let i = 0; i < NL; i++) {
            let LineNO = ELine[i].LineCode;
            spxy.push(this.MPLine[LineNO].PointSTC[0]);
            epxy.push(this.MPLine[LineNO].PointSTC[this.MPLine[LineNO].NumOfPoint - 1]);
        }
        boundArrange = spatial.BoundaryArrangeGeneral(NL, spxy, epxy);
        for (let i = 0; i < NL; i++) {
            boundArrange.Fringe[i].code = ELine[boundArrange.Fringe[i].code].LineCode;
        }
        return boundArrange;
    }

    //指定したラインコードがループでない場合は－１、ループの場合は面積を返す
    Get_LoopLine_Menseki(L_Code: number) {
        let ml = this.MPLine[L_Code];
        let men;
        let PN = ml.NumOfPoint;
        if (PN == 0) {
            return -1;
        }
        let PE = PN - 1;
        if (ml.PointSTC[PE].Equals(ml.PointSTC[0]) == true) {
            let pxy =Generic.ArrayClone( ml.PointSTC);
            pxy.push(ml.PointSTC[1].Clone());
            men = spatial.Get_Hairetu_Menseki(pxy, this.Map);
        } else {
            men = -1;
        }
        return men;
    }

    //指定したオブジェクトの面積を重心付きで返す
    Menseki(ObjData: strObj_Data,  L_Time: number) {
        let badata = this.Boundary_Arrange(ObjData, L_Time);
        if (badata.Pon <= 0) {
            return -1;
        } else {
            return this.Menseki_Sub( badata);
        }
    }

    Menseki_sub2(badata: boundArrangeData) {
        let Pon = badata.Pon;
        let Arrange_LineCode = badata.Arrange_LineCode;
        let Fringe = badata.Fringe;
        let mens = new Array(Pon);
        for (let i = 0; i < Pon; i++) {
            let LXY2: unknown[] = [];
            let n2 = this.Get_Object_Polygon_Coords(i, 0, Arrange_LineCode, Fringe, LXY2, false, 1);
            (LXY2 as unknown[]).push((LXY2 as unknown[])[1]);
            mens[i] = spatial.Get_Hairetu_Menseki(LXY2, this.Map);
        }
        let m;
        if (Pon == 1) {
            m = mens[0]
        } else {
            let TotalInOut: number[] = [];
            let In_Out = this.Object_Polygon_InOut(badata, TotalInOut);
            m = 0;
            for (let i = 0; i < Pon; i++) {
                if ((TotalInOut[i] % 2) == 1) {
                    //何かのポリゴンに奇数回含まれるポリゴンは中抜け
                    mens[i] = -mens[i];
                } else {
                    m += mens[i];
                }
            }
        }
        return m;
    }

    //ポリゴンごとの面積を求めて、中抜け等を判定して全体の面積を返す（重心つき）
    Menseki_Sub(badata: boundArrangeData) {
        // if ((GXY instanceof boundArrangeData) == true) {
        //     return this.Menseki_sub2(GXY);
        // }
        let GXY=new point();
        let Pon = badata.Pon;
        let Arrange_LineCode = badata.Arrange_LineCode;
        let Fringe = badata.Fringe;
        let mens = new Array(Pon);
        let gp = new Array(Pon);
        for (let i = 0; i < Pon; i++) {

            let LXY2: unknown[] = [];
            let n2 = this.Get_Object_Polygon_Coords(i, 0, Arrange_LineCode, Fringe, LXY2, false, 1);
            (LXY2 as unknown[]).push((LXY2 as unknown[])[1]);
            let w = 0;
            if (n2 > 2) {
                //重心の位置を求める
                let wsw = new Array(n2 - 1);
                let a = LXY2[0].x;
                let b = LXY2[0].y;
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
                if (w != 0) {
                    gp[i] =new point( (a + xx / w) / 3, (b + yy / w) / 3);
                }
            }

            if (n2 < 2) {
                gp[i] = LXY2[0];
            } else {
                mens[i] = spatial.Get_Hairetu_Menseki( LXY2, this.Map);
                if (((mens[i] < 0.0000000001) && (gp[i] == undefined) ) || w == 0) {
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
        let m;
        if (Pon == 1) {
            m = mens[0]
            GXY = gp[0];
        } else {
            let TotalInOut: number[] = [];
            let In_Out = this.Object_Polygon_InOut(badata, TotalInOut);
            m = 0;
            let sm = 0;
            for (let i = 0; i < Pon; i++) {
                if ((TotalInOut[i] % 2) == 1) {
                    //何かのポリゴンに奇数回含まれるポリゴンは中抜け
                    mens[i] = -mens[i];
                } else {
                    if (mens[i] > sm) {
                        //より面積の大きいポリゴンに重心を移す
                        GXY = gp[i];
                        sm = mens[i];
                    }
                }
                m += mens[i];
            }
        }
        return {menseki:m,gpoint:GXY};
    }

    //ある地点がオブジェクトの外接四角形に入るかどうかを調べ、さらに面オブジェクトの中かどうかを調べる
    Check_Point_in_OneObject(Obj_ObjNumber: number | strObj_Data, x: number, y: number, LAY_Time: number) {
        let obj;
        if ((typeof Obj_ObjNumber) == 'number') {
            obj = this.MPObj[Obj_ObjNumber];
        } else {
            obj = Obj_ObjNumber;
        }

        let Fringe_Line = [];
        let f = this.Check_Point_in_oneObject_Box(obj, x, y);
        if (f == true) {
            let ELine = this.Get_EnableMPLine(obj, LAY_Time);
            for (let j = 0; j < ELine.length; j++) {
                Fringe_Line.push(ELine[j].LineCode);
            }
            return this.Check_Point_in_Polygon_LineCode(x, y, Fringe_Line).ok;
        } else {
            return false
        }
    }

    //ある地点がオブジェクトの外接四角形に入るかどうかを調べる
    Check_Point_in_oneObject_Box(Obj_ObjNumber: number, x: number, y: number) {
        let obj;
        if ((typeof Obj_ObjNumber) == 'number') {
            obj = this.MPObj[Obj_ObjNumber];
        } else {
            obj = Obj_ObjNumber;
        }
        let f = false;
        if (obj.Shape != enmShape.PointShape) {
            if (spatial.Check_PointInBox(new point(x, y), 0, obj.Circumscribed_Rectangle) == true) {
                f = true;
            }
        }
        return f;
    }

    //一つのオブジェクト内のポリゴンの包含関係を返す
    Object_Polygon_InOut(badata: boundArrangeData, TotalInOutNum: number[]) {
        let Polygon_Num = badata.Pon;
        let Arrange_LineCode = badata.Arrange_LineCode;
        let Fringe = badata.Fringe;

        let SIndex = new clsSpatialIndexSearch(SpatialPointType.SPIRect, false, undefined, undefined);

        TotalInOutNum.length=Polygon_Num;
        TotalInOutNum.fill(0);
        let InOut = Generic.Array2Dimension(Polygon_Num, Polygon_Num);

        for (let i = 0; i < Polygon_Num; i++) {
            let PRect = this.MPLine[Fringe[Arrange_LineCode[i][0]].code].Circumscribed_Rectangle;
            for (let j = 1; j < Arrange_LineCode[i][1]; j++) {
                let ML = this.MPLine[Fringe[Arrange_LineCode[i][0] + j].code];
                PRect = spatial.getCircumscribedRectangle(ML.Circumscribed_Rectangle, PRect);
            }
            SIndex.AddRect(PRect, i);
        }
        SIndex.AddEnd();
        for (let i = 0; i < Polygon_Num; i++) {
            let ML = this.MPLine[Fringe[Arrange_LineCode[i][0]].code];
            let X = ML.PointSTC[0].x;
            let Y = ML.PointSTC[0].y;
            let retRin: unknown = SIndex.GetRectIn(X, Y);
            let n=retRin.number;
            let Onum =retRin.ObStac;
            let Otags=retRin.Tags;

            for (let j = 0; j < n; j++) {
                let LCD = Otags[j];
                if (LCD != i) {
                    let Fringe_Line = [];
                    for (let k = 0; k < Arrange_LineCode[LCD][1]; k++) {
                        Fringe_Line.push(Fringe[Arrange_LineCode[LCD][0] + k].code);
                    }
                    let retV = this.Check_Point_in_Polygon_LineCode(X, Y, Fringe_Line);
                    if (retV.ok == true) {
                        let ML = this.MPLine[Fringe[Arrange_LineCode[i][0]].code];
                        let x2 = ML.PointSTC[1].x;
                        let y2 = ML.PointSTC[1].y;
                        let retV2 = this.Check_Point_in_Polygon_LineCode(x2, y2, Fringe_Line);
                        if (retV2.ok == true) {
                            //iがjの中に含まれる場合は(i,j)を1に
                            InOut[i][LCD] = 1;
                            TotalInOutNum[i]++;
                        }
                    }
                }
            }
        }
        return InOut;
    }

    /** 周辺ラインと指定した地点のX軸上の交点を求め、その地点数を返す。ポリゴン内に指定の地点が含まれる場合ok:true,CrossPoint_Xに交点x座標を返す*/ 
    Check_Point_in_Polygon_LineCode(x: number, y: number, Fringe_Line: Fringe_Line_Info[]) {
        let P = new point(x, y);
        let CheckLine = [];

        for (let j = 0; j < Fringe_Line.length; j++) {
            let m = this.MPLine[Fringe_Line[j]];
            //調査地点のY座標を含むラインのみを選択
            if ((m.Circumscribed_Rectangle.top <= y) && (y <= m.Circumscribed_Rectangle.bottom)) {
                CheckLine.push(m.PointSTC);
            }
        }
        return spatial.check_Point_in_Polygon(P, CheckLine);
    }

    //オブジェクト内のポリゴンごとの連続した座標を取得する
    //poxy座標列（戻り値）
    //Equal_XY_Get_F前後の座標が同一の場合にも座標を取得する場合はtrue
    //getStep座標取得間隔（1,2,3,4等）
    Get_Object_Polygon_Coords(Num: number, Get_Coords_Data: number, Arrange_LineCode: number[][], Fringe: Fringe_Line_Info[], poxy: point[], Equal_XY_Get_F: boolean, getStep: number) {
        //Get_Coords_Data
        //0:座標値そのもの
        //1:スクリーン上の座標に変換 --今は使わない。呼び出し元で変換する
        //2:世界測地系の緯度経度
        //3:元々の座標系の座標で取得

        let Pnum = this.Get_Object_Polygon_Points(Num, Arrange_LineCode, Fringe);
        poxy.length = 0;
        let n = 0;
        for (let i = 0; i < Arrange_LineCode[Num][1]; i++) {
            let XYS: unknown[] = [];
            let Fr = Fringe[Arrange_LineCode[Num][0] + i];
            let PN = this.Get_Coords_by_LineCode(Fr.code, Get_Coords_Data, Fr.Direction, XYS, getStep);
            for (let j = 0; j < PN; j++) {
                if ((n == 0) || (Equal_XY_Get_F == true)) {
                    poxy.push( XYS[j]);
                    n++;
                } else {
                    if (poxy[n - 1].Equals(XYS[j]) == true) {
                    } else {
                        poxy.push(XYS[j]);
                        n++;
                    }
                }
            }
        }
        return n
    }

    // Arrange_LineCodeの指定したポリゴンのポイント数を返す
    Get_Object_Polygon_Points(Num: number, Arrange_LineCode: number[][], Fringe: Fringe_Line_Info[]) {
        let Pnum = 0;
        for (let i = 0; i < Arrange_LineCode[Num][1]; i++) {
            let L = Fringe[Arrange_LineCode[Num][0] + i].code;
            Pnum += this.MPLine[L].NumOfPoint;
        }
        return Pnum;

    }

    //指定したライン番号の世界測地系緯度経度などをを取得する
    Get_Coords_by_LineCode(LCode: number, Get_Coords_Data: number, P_Dir: number, XYS: point[], getStep: number) {
        let fs;
        let fe;
        let fst;
        let ML = this.MPLine[LCode];
        if ((getStep + 1 >= ML.NumOfPoint) && (ML.PointSTC[0].Equals(ML.PointSTC[ML.NumOfPoint - 1]) == true)) {
            //ループで2地点となって点になるのをふせぐ
            getStep = 1;
        }
        XYS.length = ML.NumOfPoint;
        if (P_Dir == 1) {
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
        for (let i = fs; i != fe+fst; i += fst) {
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
                case 3:
                    xy = spatial.Get_Reverse_XY(ML.PointSTC[i], this.Map.Zahyo);
            }
            lastp = i;
            XYS[n] = xy;
            n++;
        }
        if (lastp != fe) {
            let xy;
            switch (Get_Coords_Data) {
                case 0:
                    xy = ML.PointSTC[fe];
                case 2:
                    xy = spatial.Get_Reverse_XY(ML.PointSTC[fe], this.Map.Zahyo);
                    xy = spatial.Get_World_IdoKedo(xy, this.Map.Zahyo).toPoint();
                    if (xy.x > 180) {
                        xy.x -= - 360;
                    }
                case 3:
                    xy = spatial.Get_Reverse_XY(ML.PointSTC[fe], this.Map.Zahyo);
            }
            XYS[n] = xy;
            n++;
        }
        return n
    }

    //指定されたオブジェクトで、指定された時期に使用可能なライン番号を返す
    Get_EnableMPLine(ObjData_objNum: number, Time: number) {
        let ObjData;
        if ((ObjData_objNum instanceof strObj_Data) == false) {
            ObjData = this.MPObj[ObjData_objNum];
        } else {
            ObjData = ObjData_objNum;
        }

        let LCode: unknown[] = [];
        if (this.ObjectKind[ObjData.Kind].ObjectType == enmObjectGoupType_Data.AggregationObject) {
            let AggObs = this.Get_MpObj_used_AggregateObject(ObjData, Time);
            for (let i = 0; i < AggObs.length; i++) {
                let lc = AggObs[i];
                if (this.ObjectKind[this.MPObj[lc].Kind].ObjectType == enmObjectGoupType_Data.NormalObject) {
                    let E_LCode = this.Get_EnableMPLine_Normal(this.MPObj[lc], Time);
                    LCode = LCode.concat(E_LCode);
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

    //集成オブジェクトを構成する元のオブジェクト番号を取得
    Get_MpObj_used_AggregateObject(ObjData: strObj_Data, Time: number) {
        this.Enable_MPObjStac = [];
        this.Get_MpObj_used_AggregateObject_Sub(ObjData, Time)
        return this.Enable_MPObjStac;
    }
    //集成オブジェクトを構成する元のオブジェクト番号を取得、再帰処理を行う
    Get_MpObj_used_AggregateObject_Sub(ObjData: strObj_Data, Time: number) {
        for (let i = 0; i < ObjData.NumOfLine; i++) {
            let lc = this.Check_Enable_LineCode(ObjData.LineCodeSTC[i], Time)
            if (lc != -1) {
                if (this.CheckEnableObject(this.MPObj[lc], Time) == true) {
                    this.Enable_MPObjStac.push(lc);
                    if (this.ObjectKind[this.MPObj[lc].Kind].ObjectType == enmObjectGoupType_Data.AggregationObject) {
                        //集成オブジェクトを参照している場合はさらに再帰処理
                        this.Get_MpObj_used_AggregateObject_Sub(this.MPObj[lc], Time)
                    }
                }
            }
        }
    }

    //ラインコードスタックのラインが指定時期に利用できるかをチェック、利用できる場合はラインコード番号を返し，そうでない場合は－１を返す
    Check_Enable_LineCode(Lcode_Stac: number[], Time: clsTime) {
        if ((Lcode_Stac.NumOfTime == 0) || (Time.nullFlag() == true)) {
            return Lcode_Stac.LineCode;
        } else {
            for (let i = 0; i < Lcode_Stac.NumOfTime; i++) {
                if (clsTime.checkDurationIn(Lcode_Stac.Times[i], Time) == true) {
                    return Lcode_Stac.LineCode;
                }
            }
        }
        return -1;
    }
    //ラインが指定時期に利用できるかをチェック,利用できる場合は線種番号そうでない場合は-1を返す
    Check_Enable_Line(MpLine: strLine_Data, Check_Time: clsTime) {
        let L_K = -1;
        if (Check_Time.nullFlag() == true) {
            L_K = MpLine.LineTimeSTC[0].Kind;
        } else {
            for (let i = 0; i < MpLine.NumOfTime; i++) {
                if (clsTime.checkDurationIn(MpLine.LineTimeSTC[i].SETime, Check_Time) == true) {
                    L_K = MpLine.LineTimeSTC[i].Kind;
                    break;
                }
            }
        }
        return L_K;
    }

    //指定したオブジェクトで、指定した時間に利用できるライン番号を戻し、その要素を返す
    Get_EnableMPLine_Normal(ObjData: strObj_Data, Time: clsTime) {
        let Enable_LCode = [];
        if (Time.nullFlag() == true) {
            for (let i = 0; i < ObjData.NumOfLine; i++) {
                let ls = ObjData.LineCodeSTC[i];
                let d = new EnableMPLine_Data();
                d.LineCode = ls.LineCode;
                d.Kind = this.MPLine[ls.LineCode].LineTimeSTC[0].Kind;
                Enable_LCode.push(d);
            }
            return Enable_LCode;
        } else {
            if (this.CheckEnableObject(ObjData, Time) == false) {
                return undefined;
            }
        }
        for (let i = 0; i < ObjData.NumOfLine; i++) {
            let L_K, f;
            let L_Code = this.Check_Enable_LineCode(ObjData.LineCodeSTC[i], Time);
            if (L_Code != -1) {
                L_K = this.Check_Enable_Line(this.MPLine[L_Code], Time);
                if (L_K != -1) {
                    f = true;
                }
                if (f == true) {
                    if (this.Map.Time_Mode == true) {
                        if (this.ObjectKind[ObjData.Kind].UseLineType[L_K] == true) {
                            let d = new EnableMPLine_Data();
                            d.LineCode = L_Code;
                            d.Kind = L_K;
                            Enable_LCode.push(d);
                        }
                    } else {
                        let d = new EnableMPLine_Data();
                        d.LineCode = L_Code;
                        d.Kind = L_K;
                        Enable_LCode.push(d);
                    }
                }
            }
        }
        return Enable_LCode;
    }



    //指定した時間に指定したオブジェクトが存在する場合trueを返す
    CheckEnableObject(ObjData: strObj_Data, Time: number) {
        for (let i = 0; i < ObjData.NumOfNameTime; i++) {
            if (clsTime.checkDurationIn(ObjData.NameTimeSTC[i].SETime, Time) == true) {
                return true;
            }
        }
        return false;
    }

    //指定したオブジェクトグループの初期属性をすべて削除
    DeleteAllDefAttrData(objG: number) {
        this.ObjectKind[objG].DefTimeAttDataNum = 0;
        this.DefTimeAttSTC = [];
        for (let i = 0; i < this.Map.Kend; i++) {
            if (this.MPObj[i].Kind == objG) {
                this.MPObj[i].DefTimeAttValue = [];
            }
        }
    }

    //線種で、オブジェクトグループ連動型も一つとして数えて情報を返す
    Get_TotalLineKind() {
        let LPC = [];
        for (let i = 0; i < this.Map.LpNum; i++) {
            let lk = this.LineKind[i];
            for (let j = 0; j < lk.NumofObjectGroup; j++) {
                let LP = new LPatSek_Info();
                LP.Pat = lk.ObjGroup[j].Pattern;
                LP.LKind = i;
                LP.LkindPatNum = j;
                LP.Name = (j == 0) ? lk.Name : "-" + this.ObjectKind[lk.ObjGroup[j].GroupNumber].Name;
                LPC.push(LP);
            }
        }
        return LPC;
    }

    //オブジェクトグループ連動型も一つとして数えて線種の数を返す
    Get_TotalLineKind_Num() {
        let PatNum = 0;
        for (let i = 0; i < this.Map.LpNum; i++) {
            PatNum += this.LineKind[i].NumofObjectGroup;
        }
        return PatNum;
    }
    //オブジェクトの初期属性データ取得。時期がはずれてデータが取得できない場合はundefined
    Get_DefTimeAttrValue(ObjCode: number, defNumber: number, Time: clsTime) {
        let ob = this.MPObj[ObjCode];
        let ogp = ob.Kind;
        let Value;
        if (this.Map.Time_Mode == false) {
            return ob.DefTimeAttValue[defNumber].Data[0].Value;
        } else {
            if (Time.nullFlag() == true) {
                return undefined;
            }
            let dev = ob.DefTimeAttValue[defNumber];
            let n = dev.Data.length;

            if (n == 0) {
                return undefined;
            }
            switch (this.ObjectKind[ogp].DefTimeAttSTC[defNumber].Type) {
                case enmDefTimeAttDataType.PointData:
                    //時点データの場合
                    for (let i = 0; i < n; i++) {
                        if (dev.Data[i].Span.StartTime.Equals(Time) == true) {
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
                        case enmDefPointAttDataExtraValue.NearestValue:
                            //一番近い値
                            let ff = true;
                            let minDay;
                            for (let i = 0; i < n; i++) {
                                let daten = Math.abs(clsTime.getDifference(dev.Data[i].Span.StartTime, Time));
                                if (ff == true) {
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
                        case enmDefPointAttDataExtraValue.interpolation_MissingValue:
                        case enmDefPointAttDataExtraValue.interpolation_NearestValue:
                            //間に挟まれた場合は按分
                            for (let i = 0; i < n - 1; i++) {
                                let span = new Start_End_Time_data();
                                span.StartTime = dev.Data[i].Span.StartTime;
                                span.EndTime = dev.Data[i + 1].Span.StartTime;
                                if (clsTime.checkDurationIn(span, Time) == true) {
                                    let v1 = Number(dev.Data[i].Value.replace(",", ""));
                                    let v2 = Number(dev.Data[i + 1].Value.replace(",", ""));
                                    let vsa = v2 - v1;
                                    let daten1 = Math.abs(clsTime.getDifference(span.StartTime, Time));
                                    let daten2 = Math.abs(clsTime.getDifference(span.StartTime, span.EndTime));
                                    let v3 = v1 + vsa * (daten1 / daten2);
                                    if(isNaN(v3)){console.log(ob,ObjCode, defNumber,dev.Data[i].Value , dev.Data[i+1].Value)}
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

                                    if (dev.Data[0].Span.StartTime.nullFlag() == true) {
                                        return dev.Data[0].Value;
                                    } else {
                                        let d1 = Math.abs(clsTime.getDifference(dev.Data[0].Span.StartTime, Time));
                                        let d2 = Math.abs(clsTime.getDifference(dev.Data[n - 1].Span.StartTime, Time));
                                        if (d1 < d2) {
                                            return dev.Data[0].Value;
                                        } else {
                                            if (dev.Data[n - 1].Value == null) {
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
                        if (clsTime.checkDurationIn(dev.Data[i].Span, Time) == true) {
                            return dev.Data[i].Value;
                        }
                    }
                    return undefined;
                    break;
            }
            return Value;
        }
    }

    /**オブジェクト番号で指定、'線オブジェクトと面・点オブジェクトの距離は、最も近い線の位置と点・面の代表点、点・面オブジェクト間の距離は代表点間の距離、 */
    Distance_Object(O_Code1: number, O_Code2: number, Time1: clsTime, Time2: clsTime) {
        let P1;
        let P2;
        if (this.MPObj[O_Code2].Shape == enmShape.LineShape) {
            [O_Code1, O_Code2] = [O_Code2, O_Code1];
            [Time1, Time2] = [Time2, Time1];
        }

        let d;
        if (this.MPObj[O_Code1].Shape == enmShape.LineShape) {
            //一方が線オブジェクトの場合
            P2 = this.Get_Enable_CenterP(O_Code2, Time2);
            d = this.Get_Distance_Between_ObjectLine_and_Point(O_Code1, Time1, P2);
        } else {
            P1 = this.Get_Enable_CenterP(O_Code1, Time1);
            P2 = this.Get_Enable_CenterP(O_Code2, Time2);
            if (this.Map.Zahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido) {
                d = spatial.Distance_Ido_Kedo_XY_Point(P1, P2, this.Map.Zahyo);
            } else {
                d = spatial.Distance_Point(P1, P2) / this.Map.SCL;
            }
        }
        return d;
    }

    Distance_ObjectCenterP(CP: point, O_Code1: number,  Time1: clsTime) {
        let d;
        if (this.MPObj[O_Code1].Shape == enmShape.LineShape) {
            //一方が線オブジェクトの場合
            d = this.Get_Distance_Between_ObjectLine_and_Point(O_Code1, Time1, CP);
        } else {
            let P1 = this.Get_Enable_CenterP(O_Code1, Time1);
            if (this.Map.Zahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido) {
                d = spatial.Distance_Ido_Kedo_XY_Point(CP, P1, this.Map.Zahyo);
            } else {
                d = spatial.Distance_Point(CP, P1) / this.Map.SCL;
            }
        }
        return d;
    }

    /**オブジェクトの線とある地点との距離を求める */
    Get_Distance_Between_ObjectLine_and_Point(Ocode: number,  Time: clsTime,  P: point){
        let ELine=this.Get_EnableMPLine(this.MPObj[Ocode], Time);
        return this.Distance_PointMPLineAllay(P,  ELine)
    }

    Distance_PointMPLineAllay(P: point, LCode: number) {
        let mind;
        let f = false;
        for (let i = 0; i < LCode.length; i++) {
            let lc = LCode[i].LineCode;
            let ml = this.MPLine[lc];
            let ln = ml.NumOfPoint;
            for (let j = 0; j < ln - 1; j++) {
                let nearP;
                let DD = spatial.Distance_PointLine2(P, ml.PointSTC[j], ml.PointSTC[j + 1]);
                let dist = DD.distance;
                if (this.Map.Zahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido) {
                    dist = spatial.Distance_Ido_Kedo_XY(P, DD.nearP, this.Map.Zahyo)
                }
                if (f == false) {
                    mind = dist;
                    f = true;
                } else {
                    if (dist < mind) {
                        mind = DD.distance;
                    }
                }
            }
        }
        if (this.Map.Zahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido) {
            return mind;
        } else {
            return mind / this.Map.SCL;
        }
    }


    /**ライン中の同一座標の連続を削除 */
    DeleteSamePoints_inLine(Linenum: number) {

        let ml = this.MPLine[Linenum];
        if (ml.NumOfPoint > 0) {
            let ReMovePoint = [];
            ReMovePoint[0] = ml.PointSTC[0].Clone();
            for (let j = 1; j < ml.NumOfPoint; j++) {
                if (ml.PointSTC[j - 1].Equals(ml.PointSTC[j]) != true) {
                    ReMovePoint.push(ml.PointSTC[j].Clone());
                }
            }
            if (ml.NumOfPoint != ReMovePoint.length) {
                ml.PointSTC = ReMovePoint;
                ml.NumOfPoint = ReMovePoint.length;
            }
        }
    }

/** 指定された線の共通部分を抽出して、位相構造化する。変更があった場合trueを返す */
    TopologyStructure_SameLine(TopologyLineList: number[]) {
        if (TopologyLineList == undefined) {
            //全ライン
            TopologyLineList = [];
            for (let i = 0; i < this.Map.ALIN; i++) {
                TopologyLineList.push(i);;
            }
        }
        let Result = false;
        TopologyLineList.sort(function (a: number, b: number) { return a - b; })
        for (let i in TopologyLineList) {
            this.DeleteSamePoints_inLine(TopologyLineList[i]);
        }

        let icount = 0;
        do {
            let i = TopologyLineList[icount];
            let jcount = icount + 1;
            while (jcount < TopologyLineList.length) {
                let j = TopologyLineList[jcount];
                let f;
                do {
                    let ODALIN1 = this.Map.ALIN;
                    f = this.TopologyStructure_Two_SameLine(i, j);
                    if (f == true) {
                        if (ODALIN1 > this.Map.ALIN) {
                            //二つのラインが全く同じで、片方が削除された場合
                            TopologyLineList.splice(jcount, 1);
                            for (let k = 0; k < TopologyLineList.length; k++) {
                                if (TopologyLineList[k] > j) {
                                    TopologyLineList[k]--;
                                }
                            }
                            break;
                        } else if (ODALIN1 < this.Map.ALIN) {
                            //ラインが増えた場合
                            for (let k = ODALIN1; k < this.Map.ALIN; k++) {
                                TopologyLineList.push(k);
                            }
                        } else {
                            f = false;
                        }
                        Result = true;
                    }
                } while (f == true)
                jcount++;
            }
            icount++;
        } while (icount < TopologyLineList.length);
        return Result;
    }

    /**二つの線ラインの共通部分を抽出して、位相構造化する。共通部分があればtrueを返す */
    TopologyStructure_Two_SameLine(LCode1: number, LCode2: number) {

        let mLine1 = this.MPLine[LCode1];
        let mLine2 = this.MPLine[LCode2];
        if (spatial.Compare_Two_Rectangle_Position_Inflated(mLine1.Circumscribed_Rectangle, mLine2.Circumscribed_Rectangle, 0.0001) == cstRectangle_Cross.cstOuter) {
            //ラインが重ならない場合
            return false;
        }
        //時間設定が同じかチェック
        if (mLine1.NumOfTime != mLine2.NumOfTime) {
            return false;
        } else {
            for (let i = 0; i < mLine1.NumOfTime; i++) {
                if (mLine1.LineTimeSTC[i].Equals(mLine2.LineTimeSTC[i]) == false) {
                    //時間設定・線種が異なる場合
                    return false;
                }
            }
        }

        if (this.Check_Points_Of_Two_Lines(LCode1, LCode2) == true) {
            //全く同じラインだった場合
            for (let i = 0; i < this.Map.Kend; i++) {
                let mo = this.MPObj[i];
                if (this.ObjectKind[mo.Kind].ObjectType == enmObjectGoupType_Data.NormalObject) {
                    for (let j = 0; j < mo.NumOfLine; j++) {
                        let mol = mo.LineCodeSTC[j];
                        if (mol.LineCode == LCode2) {
                            mol.LineCode = LCode1;
                        }
                    }
                }
            }
            this.Erase_Line(LCode2, false);
            return true;
        }

        let TwoRect = spatial.Get_Rectangle_Union(mLine1.Circumscribed_Rectangle, mLine2.Circumscribed_Rectangle);
        let PNum1 = mLine1.NumOfPoint;
        let XYstac1 = mLine1.PointSTC;
        let PNum2 = mLine2.NumOfPoint;
        let XYstac2 = mLine2.PointSTC;

        //    最初に座標が一致するポイントを取得
        let PointIndex = new clsSpatialIndexSearch(SpatialPointType.SinglePoint, false, TwoRect);
        PointIndex.AddSinglePoint_Array(PNum2, XYstac2, -1);
        PointIndex.AddEnd();

        let f = false;
        for (let i = 0; i < PNum1; i++) {
            let retV = PointIndex.GetSamePointNumber(XYstac1[i].x, XYstac1[i].y);
            if (retV.ObjectNumber != -1) {
                f = this.TopologyStructure_Two_SameLine_Check(LCode1, LCode2, PNum1, PNum2, i, retV.ObjectNumber, XYstac1, XYstac2);
                if (f == true) {
                    break;
                }
            }
        }
        return f;
    }

    TopologyStructure_Two_SameLine_Check(LCode1: number, LCode2: number, PNum1: number, PNum2: number, S1: number, s2: number, XYstac1: point[], XYstac2: point[]) {

        let NewPnum1: { A: number, B: number, NewXYstacA: point[], NewXYstacB: point[] } = { A: 0, B: 0, NewXYstacA: [], NewXYstacB: [] };
        let NewPnum2: { A: number, B: number, NewXYstacA: point[], NewXYstacB: point[] } = { A: 0, B: 0, NewXYstacA: [], NewXYstacB: [] };
        let JointPnum;
        let NewXYstacJoint = [];
        let jp;

        let Start1, Start2

        //同一方向で、同じ座標が続くか調べる
        let naH2;
        let naH1 = this.TopologyStructure_Two_SameLine_sub(S1, s2, 1, 1, PNum1, PNum2, XYstac1, XYstac2);
        if (naH1 == 1) {
            //同一方向で続いていない場合、線2を逆方向にたどる
            naH1 = this.TopologyStructure_Two_SameLine_sub(S1, s2, 1, -1, PNum1, PNum2, XYstac1, XYstac2);
            naH2 = -naH1;
        } else {
            naH2 = naH1;
        }

        let Loop1F = XYstac1[0].Equals(XYstac1[PNum1 - 1]);
        if ((S1 == 0) && (Loop1F == true)) {
            let j;
            let nRev1;
            //線1がループで､始点が一致箇所の場合
            if (naH1 == 1) {
                //始点からはたどれない場合は終点から逆方向へ
                nRev1 = -this.TopologyStructure_Two_SameLine_sub(PNum1 - 1, s2, -1, 1, PNum1, PNum2, XYstac1, XYstac2);
                if (nRev1 == -1) {
                    return false;
                }

                naH2 = -nRev1;
                if (nRev1 == -1) {
                    //同一方向で続いていない場合、線2を逆方向にたどる
                    nRev1 = -this.TopologyStructure_Two_SameLine_sub(PNum1 - 1, s2, -1, -1, PNum1, PNum2, XYstac1, XYstac2);
                    naH2 = nRev1;
                }
                JointPnum = Math.abs(nRev1);
                j = PNum1 - JointPnum;
                if (PNum1 == Math.abs(nRev1)) {
                    //１周分続く場合
                    naH1 = PNum1;
                } else {
                    this.TopologyStructure_Two_SameLine_Cutsub(PNum1 - 1, nRev1, PNum1, NewPnum1, XYstac1);
                }
                this.TopologyStructure_Two_SameLine_Cutsub(s2, naH2, PNum2, NewPnum2, XYstac2);
            } else {
                if (PNum1 == naH1) {
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

                    let Len1 = naH1 + nRev1 - 1;
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
            if (naH1 == 1) {
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
        if ((Math.abs(naH1) != PNum1) && (NewPnum1.A != 1)) { //NewPnum1a!=1は、特殊なパターンでラインの点が1つになってしまう場合があるため
            PushLine = this.MPLine[LCode1].Clone();
            PushLine.NumOfPoint = NewPnum1.A;
            PushLine.PointSTC = Generic.ArrayClone(NewPnum1.NewXYstacA);
            this.Save_Line(PushLine, false, false, true);
        }

        if ((Math.abs(naH2) != PNum2) && (NewPnum2.A != 1)) { //NewPnum1.A!=2は、特殊なパターンでラインの点が1つになってしまう場合があるため
            PushLine = this.MPLine[LCode2].Clone();
            PushLine.NumOfPoint = NewPnum2.A;
            PushLine.PointSTC = Generic.ArrayClone(NewPnum2.NewXYstacA);
            this.Save_Line(PushLine, false, false, true);
        }


        if ((JointPnum != PNum1) && (JointPnum != PNum2)) {
            PushLine = this.MPLine[LCode1].Clone();
            PushLine.Number = -1;
            PushLine.NumOfPoint = JointPnum;
            PushLine.PointSTC = Generic.ArrayClone(NewXYstacJoint);
            this.Save_Line(PushLine, false, false, true);
            this.Topology_Line_Object_Shori(LCode1, this.Map.ALIN - 1);
            this.Topology_Line_Object_Shori(LCode2, this.Map.ALIN - 1);
        } else {
            if (JointPnum == PNum1) {
                this.Topology_Line_Object_Shori(LCode2, LCode1);
            } else if (JointPnum == PNum2) {
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

    /**一致する箇所でラインを分断する */
    private TopologyStructure_Two_SameLine_Cutsub(Start_JointPoint: number, JointNum: number, OldPNum: number, NewPnum: { A: number, B: number, NewXYstacA: point[], NewXYstacB: point[] },
        OldXY: point[]) {

        let LoopF = OldXY[0].Equals(OldXY[OldPNum - 1]);
        NewPnum.B = -1;
        if (LoopF == true) {
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
            if ((Start2 == 0) || (End2 == OldPNum - 1)) {
                if (OldPNum == JointNum) {
                    //全体が共有されている場合
                    NewPnum.A = OldPNum;
                    NewPnum.NewXYstacA = Generic.ArrayClone(OldXY);
                } else {
                    //始点又は終点まで共有されている場合
                    NewPnum.A = OldPNum - Math.abs(JointNum) + 1;
                    let j = 0;
                    if (Start2 != 0) {
                        for (let i = 0; i <= Start2; i++) {
                            NewPnum.NewXYstacA[j] = OldXY[i].Clone();
                            j++;
                        }
                    }
                    if (End2 != OldPNum - 1) {
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

    /**一致するポイントを追跡する */
    private TopologyStructure_Two_SameLine_sub(S1: number, s2: number, ip: number, jp: number, PNum1: number, PNum2: number, XYstac1: point[], XYstac2: point[]) {

        let i = S1;
        let j = s2;
        let Loop1F = XYstac1[0].Equals(XYstac1[PNum1 - 1]);
        let Loop2F = XYstac2[0].Equals(XYstac2[PNum2 - 1]);
        let n = 0;
        while (XYstac1[i].Equals(XYstac2[j]) == true) {
            i += ip;
            j += jp;
            n++;
            if (i >= PNum1) {
                if (Loop1F == true) {
                    i = 1;
                } else {
                    break;
                }
            }
            if (j >= PNum2) {
                if (Loop2F == true) {
                    j = 1;
                    jp = 1;
                } else {
                    break;
                }
            }
            if (i < 0) {
                if (Loop1F == true) {
                    i = PNum1 - 2;
                } else {
                    break;
                }
            }
            if (j < 0) {
                if (Loop2F == true) {
                    j = PNum2 - 2;
                } else {
                    break;
                }
            }
        }
        return n;
    }

    /**ラインがループの場合trueを返す */
    Check_Line_Loop(LCode: number){
        let ml = this.MPLine[LCode];
        return ml.PointSTC[0].Equals(ml.PointSTC[ml.NumOfPoint - 1]);
    }

    Check_Points_Of_Two_Lines(LC1: number, LC2: number) {
        let mLine1 = this.MPLine[LC1];
        let mLine2 = this.MPLine[LC2];
        let PNum1 = mLine1.NumOfPoint;
        let PNum2 = mLine2.NumOfPoint;
        let f2 = false;
        if (PNum1 == PNum2) {
            let f = mLine1.Circumscribed_Rectangle.Equals(mLine2.Circumscribed_Rectangle);
            if (f == true) {
                if ((this.Check_Line_Loop(LC1) == true) && (this.Check_Line_Loop(LC2) == true)) {
                    //ループの場合
                    //最初に座標が一致するポイントを取得
                    let s2 = -1
                    for (let i = 0; i < PNum2; i++) {
                        if (mLine1.PointSTC[0].Equals(mLine2.PointSTC[i]) == true) {
                            s2 = i;
                            i = PNum2;
                        }
                    }
                    if (s2 == -1) {
                        f2 = false;
                    } else {
                        let s2p;
                        if (s2 == 0) {
                            if (mLine1.PointSTC[1].Equals(mLine2.PointSTC[1]) == true) {
                                s2p = 1;
                            } else {
                                s2p = -1;
                            }
                        } else {
                            if (mLine1.PointSTC[1].Equals(mLine2.PointSTC[s2 - 1]) == true) {
                                s2p = -1;
                            } else {
                                s2p = 1;
                            }
                        }
                        f2 = true;
                        let i = 0;
                        let j = s2;
                        while ((f2 == true) && (i < PNum1)) {
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
                    if (mLine1.PointSTC[0].Equals(mLine2.PointSTC[0]) == true) {
                        f2 = true
                        for (let i = 1; i < PNum1; i++) {
                            if (mLine1.PointSTC[i].Equals(mLine2.PointSTC[i]) == false) {
                                f2 = false;
                                break;
                            }
                        }
                    } else if (mLine1.PointSTC[0].Equals(mLine2.PointSTC[PNum1 - 1])) {
                        f2 = true;
                        for (let i = 1; i < PNum1; i++) {
                            if (mLine1.PointSTC[i].Equals(mLine2.PointSTC[PNum1 - 1 - i]) == false) {
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
     * ラインの削除 Chack_Object_Shape_F:削除するラインを使用するオブジェクトの形状をチェックする場合true
     */
    Erase_Line(EraseLineCode: number, Chack_Object_Shape_F: boolean) {
        let LCode = [EraseLineCode];
        let SEpoint = [];
        let ml = this.MPLine[EraseLineCode];
        SEpoint[0] = ml.PointSTC[0].Clone();
        SEpoint[1] = ml.PointSTC[ml.NumOfPoint - 1].Clone();
        this.Erase_MultiLine(1, LCode, true, Chack_Object_Shape_F, true);
        this.Check_Related_Line(SEpoint, -1);
    }

    /**複数のラインを削除 */
    // <param name="LNum">削除するライン数</param>
    // <param name="LCode">ライン番号配列</param>
    // <param name="UsedLine_Delete_F">ラインがオブジェクトに使用されていても削除する場合、true</param>
    // <param name="Check_ObjectShape_F">ラインを使用するオブジェクトの形状を削除後にチェックする場合true</param>
    // <param name="MapRectCheckF">地図データ全体の外接四角形をチェックするか</param>
    // <returns>実際に削除したライン番号の配列</returns>
    Erase_MultiLine(LNum: number, LCode: number[], UsedLine_Delete_F: boolean, Check_ObjectShape_F: boolean, MapRectCheckF: boolean) {

        let C_Mpline = [];
        let RealDeleteLineCode = [];
        for (let i = 0; i < LNum; i++) {
            C_Mpline[LCode[i]] = -1;
        }

        if (UsedLine_Delete_F == false) {
            for (let i = 0; i < this.Map.ALIN; i++) {
                if (C_Mpline[i] == -1) {
                    if (this.MPLine[i].NumOfLineUse > 0) {
                        C_Mpline[i] = 0;
                    }
                }
            }
        }

        let n = 0
        for (let i = 0; i < this.Map.ALIN; i++) {
            if (C_Mpline[i] == -1) {
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
            let mo = this.MPObj[i];
            if (this.ObjectKind[mo.Kind].ObjectType == enmObjectGoupType_Data.NormalObject) {
                n = 0;
                for (let j = 0; j < mo.NumOfLine; j++) {
                    if (C_Mpline[mo.LineCodeSTC[j].LineCode] == -1) {
                        n++;
                    } else {
                        mo.LineCodeSTC[j].LineCode = C_Mpline[mo.LineCodeSTC[j].LineCode];
                        mo.LineCodeSTC[j - n] = mo.LineCodeSTC[j].Clone();
                    }
                }
                if (n > 0) {
                    mo.NumOfLine -= n;
                    if (mo.NumOfLine == 0) {
                        mo.LineCodeSTC = [];
                    } else {
                        mo.LineCodeSTC.length = mo.NumOfLine;
                    }
                    if ((UsedLine_Delete_F == true) && (Check_ObjectShape_F == true)) {
                        mo.Shape = this.Check_Obj_Shape_AllTime(this.MPObj[i]);
                    }
                }
            }
        }
        this.Check_ALl_Line_Connect()
        if (MapRectCheckF == true) {
            this.Map.Circumscribed_Rectangle = this.Get_Mapfile_Rectangle()
        }
        return RealDeleteLineCode;
    }
    //*************************************************************************************** */
    // <summary>
    // 
    // </summary>
    // <param name="ObjData">オブジェクト</param>
    // <param name="CutPoint">切れ目の地図座標を返す。必要ない場合は省略化</param>
    // <returns></returns>
    // <remarks></remarks>
    /**全期間を通したオブジェクトの形状をチェック */
    Check_Obj_Shape_AllTime(ObjData: strObj_Data, CutPoint: point | undefined = undefined) {
        //オブジェクト名の有効期間の開始と終了時期での形状チェック

        if (this.ObjectKind[ObjData.Kind].ObjectType == enmObjectGoupType_Data.AggregationObject) {
            return this.Check_Obj_Shape_Cut(ObjData, clsTime.GetNullYMD, CutPoint);
        }

        let OT = []; // As Start_End_Time_data

        let SHP = [];
        let SHN = 0;

        let obtn = ObjData.NumOfNameTime;
        for (let i = 0; i < obtn; i++) {
            OT[i] = ObjData.NameTimeSTC[i].SETime.Clone();
        }

        for (let i = 0; i < obtn; i++) {
            if (OT[i].StartTithis.nullFlag == false) {
                SHP[SHN] = this.Check_Obj_Shape_Cut(ObjData, OT[i].StartTime, CutPoint);
                SHN++;
            }
            if (OT[i].EndTithis.nullFlag == false) {
                SHP[SHN] = this.Check_Obj_Shape_Cut(ObjData, OT[i].EndTime, CutPoint);
                SHN++;
            }
        }

        let TimeSort = new clsSortingSearch();
        for (let i = 0; i < ObjData.NumOfLine; i++) {
            let ols = ObjData.LineCodeSTC[i];
            for (let j = 0; j < ols.NumOfTime; j++) {
                TimeSort.Add(clsTime.YMDtoValue(ols.Times[j].StartTime));
                TimeSort.Add(clsTime.YMDtoValue(ols.Times[j].EndTime));
            }
            let olsl = this.MPLine[ols.LineCode];
            for (let j = 0; j < olsl.NumOfTime; j++) {
                let olsls = olsl.LineTimeSTC[j];
                TimeSort.Add(clsTime.YMDtoValue(olsls.SETime.StartTime));
                TimeSort.Add(clsTime.YMDtoValue(olsls.SETime.EndTime));
            }
        }
        TimeSort.AddEnd()

        let n = TimeSort.NumofData();
        let GT: strYMD[] = [];
        let n2 = 0
        for (let i = 0; i < n; i++) {
            let v = TimeSort.DataPositionValue_Integer[i];
            let T = clsTime.GetYMDfromValue(v);
            if ((T as Record<string, boolean>).nullFlag == false) {
                if (n2 == 0) {
                    if (OT[0].StartTithis.nullFlag == true) {
                        GT[0] = clsTime.getYesterday(T);
                        n2 = 1;
                    }
                    GT[n2] = T;
                    n2++;
                } else {
                    if (GT[n2 - 1].Equals(T) == false) {
                        GT[n2] = T;
                        n2++;
                    }
                }
            }
        }
        if (OT[obtn - 1].EndTithis.nullFlag == true) {
            if (n2 != 0) {
                GT[n2] = clsTime.getTomorrow(GT[n2 - 1]);
                n2++;
            }
        }

        for (let i = 0; i < n2; i++) {
            if (GT[i].nullFlag == false) {
                for (let j = 0; j < obtn; j++) {
                    if (clsTime.checkDurationIn(OT[j], GT[i]) == true) {
                        SHP[SHN] = this.Check_Obj_Shape_Cut(ObjData, GT[i], CutPoint);
                        SHN++;
                    }
                }
            }
        }

        if (SHN == 0) {
            SHP[0] = this.Check_Obj_Shape_Cut(ObjData, clsTime.GetNullYMD, CutPoint);
            SHN = 1;
        }

        let SHF = new Array(SHN);
        SHF.fill(0);
        for (let i = 0; i < SHN; i++) {
            SHF[SHP[i]]++;
        }

        let sp;
        //チェックした期間内に、複数の形状が含まれている場合は、優先的に点＞線＞面が返される
        if (SHF[enmShape.PolygonShape] != 0) { sp = enmShape.PolygonShape }
        if (SHF[enmShape.LineShape] != 0) { sp = enmShape.LineShape }
        if (SHF[enmShape.PointShape] != 0) { sp = enmShape.PointShape }
        return sp;
    }


    // <summary>
    // オブジェクトの形状を返す。CutX,yで切れ目の座標を返す
    // </summary>
    // <param name="ObjData">オブジェクト</param>
    // <param name="L_Time">時期</param>
    // <param name="CutPoint">切れ目の地図座標</param>
    // <returns></returns>
    // <remarks></remarks>
    Check_Obj_Shape_Cut(ObjData: strObj_Data, L_Time: clsTime, CutPoint: point) {
        if (this.ObjectKind[ObjData.Kind].ObjectType == enmObjectGoupType_Data.AggregationObject) {
            //集成オブジェクトタイプの場合
            let OBShape = new Array(3);
            OBShape.fill(0);
            for (let i = 0; i < ObjData.NumOfLine; i++) {
                OBShape[this.MPObj[ObjData.LineCodeSTC[i].LineCode].Shape]++;
            }

            if ((OBShape[enmShape.LineShape] == 0) && (OBShape[enmShape.PolygonShape] == 0)) {
                return enmShape.PointShape;
            } else if ((this.ObjectKind[ObjData.Kind].Shape == enmShape.LineShape) || (OBShape[enmShape.LineShape] > 0)) {
                return enmShape.LineShape;
            } else {
                return enmShape.PolygonShape;
            }
        } else {
            //通常のオブジェクトタイプの場合
            let polyn = this.Check_PolyShape_PolygonNum(ObjData, L_Time, CutPoint);
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

    // <summary>
    // オブジェクトを構成するポリゴン数を数えて返す
    // </summary>
    // <param name="ObjData">オブジェクト</param>
    // <param name="L_Time"></param>
    // <param name="CutPoint">切れ目の地図座標（戻り値）</param>
    // <returns></returns>
    // <remarks></remarks>
    Check_PolyShape_PolygonNum( ObjData: unknown ,  L_Time: number ,  CutPoint: unknown  = undefined) {

        let ELine  = this.Get_EnableMPLine( ObjData, L_Time);
        let NL=ELine.length;
        if(NL == 0 ){
            return -1;
        }

        if(this.ObjectKind[ObjData.Kind].Shape == enmShape.LineShape ){
            return 0;
        }

        let Fringe=[];
        for(let i  = 0;i<NL;i++){
            Fringe[i] = ELine[i].LineCode;
        }

        //ループラインをチェック
        let polyn  = 0;
        let stxy , exy 
        let k  = 0;

        for(let i  = 0;i<NL;i++){
            let ml= this.MPLine[Fringe[i]];
                stxy = ml.PointSTC[0];
                exy = ml.PointSTC[ml.NumOfPoint - 1];
            
            if(exy.Equals(stxy) == true ){
                NL --;
                polyn ++;
            }else{
                Fringe[k] = Fringe[i];
                k ++;
            }
        }
        if(k == 0 ){
            return polyn;
        }

        let Contf  = false;
        for(let i  = 0;i<NL;i++){
            if(Contf == false ){
                let ml= this.MPLine[Fringe[i]];
                    stxy = ml.PointSTC[0].Clone();
                    exy = ml.PointSTC[ml.NumOfPoint - 1].Clone();
                
            }
            Contf = false
            for (let j = i + 1; j < NL; j++) {
                let ml = this.MPLine[Fringe[j]];
                if (ml.PointSTC[0].Equals(exy) == true) {
                    exy = ml.PointSTC[ml.NumOfPoint - 1].Clone();
                    Contf = true;
                    [Fringe[j], Fringe[i + 1]] = [Fringe[i + 1], Fringe[j]];
                    break;
                } else if (ml.PointSTC[ml.NumOfPoint - 1].Equals(exy) == true) {
                    exy = ml.PointSTC[0].Clone();
                    Contf = true;
                    [Fringe[j], Fringe[i + 1]] = [Fringe[i + 1], Fringe[j]];
                    break;
                }
            }
            if(Contf == false ){
                if(exy.Equals(stxy) ){
                    polyn ++;
                }else{
                    polyn = 0;
                    CutPoint = exy;
                    break;
                }
            }
        }
        return polyn;
    }

    Check_ALl_Line_Connect() {
        let PointIndex = new clsSpatialIndexSearch(SpatialPointType.SinglePoint, false);
        for (let i = 0; i < Map.ALIN; i++) {
            let ml = this.MPLine[i];
            if (ml.NumOfPoint > 0) {
                PointIndex.AddDoublePoint(ml.PointSTC[0], ml.PointSTC[ml.NumOfPoint - 1], i);
            }
        }
        PointIndex.AddEnd();
        for (let i = 0; i < Map.ALIN; i++) {
            let ml = this.MPLine[i];
            if (ml.NumOfPoint > 0) {
                if (ml.PointSTC[0].Equals(ml.PointSTC[ml.NumOfPoint - 1]) == true) {
                    ml.Connect = 3;
                } else {
                    ml.Connect = 0;
                    for (let j = 0; j < 1; j++) {
                        let SamePointData: Record<string, unknown> = {};
                        let n = PointIndex.GetSamePointNumberArray(ml.PointSTC[j * (ml.NumOfPoint - 1)].x, ml.PointSTC[j * (ml.NumOfPoint - 1)].y, SamePointData)
                        for (let k = 0; k < n; k++) {
                            if (SamePointData.ObjectNumber[k] != i) {
                                ml.Connect++;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    //指定した時間のオブジェクトの代表点を取得、取得できない場合はundefinedを返す
    Get_Enable_CenterP(ObjInfo: strObj_Data, Time: clsTime) {
        let ObjData;
        if (typeof ObjInfo == 'number') {
            ObjData = this.MPObj[ObjInfo];
        } else {
            ObjData = ObjInfo;
        }

        if (this.CheckEnableObject(ObjData, Time) == false) {
            return undefined;
        }
        for (let i = 0; i < ObjData.NumOfCenterP; i++) {
            if (clsTime.checkDurationIn(ObjData.CenterPSTC[i].SETime, Time) == true) {
                return ObjData.CenterPSTC[i].Position.Clone();
            }
        }
        return undefined;
    }

    /**位相構造化したラインを使用するオブジェクトの修正 */
    Topology_Line_Object_Shori(Search_LineCode: number, Add_LineCode: number) {
        let Add_LineCode_Stac = [];
        Add_LineCode_Stac[0] = Add_LineCode;
        this.Object_LineCode_Add(Search_LineCode, 1, Add_LineCode_Stac);
    }

    /**切断したラインを使用するオブジェクトの修正 */
    Cut_Line_Object_Shori(Search_LineCode: number, ODALIN: number, num: number){
        let Add_LineCode = [];
        for (let i = 0; i < num; i++) {
            Add_LineCode[i] = ODALIN + i;
        }
        this.Object_LineCode_Add(Search_LineCode, num, Add_LineCode);
    }
    /**切断したラインを使用するオブジェクトの修正 */
    Object_LineCode_Add(Search_LineCode: number, AddLineNum: number, Add_LineCode: number[]){
        for (let i = 0; i < this.Map.Kend; i++) {
            let mo = this.MPObj[i];
            if (this.ObjectKind[mo.Kind].ObjectType == enmObjectGoupType_Data.NormalObject) {
                let n = mo.NumOfLine;
                for (let j = 0; j < n; j++) {
                    if (mo.LineCodeSTC[j].LineCode == Search_LineCode) {
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

    /**オブジェクト番号のラインコードスタック数を変更する */
    Move_LineCodeStac(ObjNum: number, New_NumOfLine: number, Old_NumOfLine: number) {
        let mo = this.MPObj[ObjNum];
        let dif = New_NumOfLine - Old_NumOfLine;
        mo.NumOfLine = mo.NumOfLine + dif;

        if (dif != 0) {
            if (dif > 0) {
                for (let i = Old_NumOfLine; i < mo.NumOfLine; i++) {
                    mo.LineCodeSTC[i] = new LineCodeStac_Data();
                    mo.LineCodeSTC[i].NumOfTime = 0;
                }
            } else {
                if (mo.NumOfLine == 0) {
                    mo.LineCodeSTC.length = [];
                } else {
                    mo.LineCodeSTC.length = mo.NumOfLine;
                }
            }
        }
    }

    //オブジェクトから、指定した時間のオブジェクト名リストを取得、取得できない場合はundefinedを返す
    //ObjData:strObj_Dataまたはオブジェクト番号
    Get_Enable_ObjectName(ObjInfo: number | strObj_Data, Time: clsTime, NoDataLastGetF: boolean) {
    let ObjData;
    if (typeof ObjInfo == 'number') {
        ObjData = this.MPObj[ObjInfo];
    } else {
        ObjData = ObjInfo;
    }
    let n;
    if (Time.nullFlag() == true) {
        n = ObjData.NumOfNameTime - 1;
    } else {
        n = -1;
        for (let i = 0; i < ObjData.NumOfNameTime; i++) {
            if (clsTime.checkDurationIn(ObjData.NameTimeSTC[i].SETime, Time) == true) {
                n = i;
                break;
            }
        }
        if ((n == -1) && (NoDataLastGetF == true)) {
            n = ObjData.NumOfNameTime - 1;
        }
    }
    if (n == -1) {
        return undefined;
    } else {
        return Generic.ArrayShallowCopy(ObjData.NameTimeSTC[n].NamesList);
    }
}

    /** JSON地図ファイル(mdrmjFlag:trueはmdrmjファイル内の地図データ)読み込み */
    openJsonMapData(JsonData: unknown, mdrmjFlag: boolean = false) {
    this.init_MapData();
    let m = new strMap_data();
    m.FileName = JsonData.Map.FileName;
    m.FullPath = JsonData.Map.FullPath;
    m.MPVersion = JsonData.Map.MPVersion;
    m.ALIN = JsonData.Map.ALIN;
    m.Kend = JsonData.Map.Kend;
    m.OBKNum = JsonData.Map.OBKNum;
    m.LpNum = JsonData.Map.LpNum;
    m.SCL = JsonData.Map.SCL;
    m.SCL_U = JsonData.Map.SCL_U;
    m.Time_Mode = JsonData.Map.Time_Mode;
    m.Comment = JsonData.Map.Comment;
    m.Zahyo.Mode = JsonData.Map.Zahyo.Mode;
    m.Zahyo.System = JsonData.Map.Zahyo.System;
    m.Zahyo.HeimenTyokkaku_KEI_Number = JsonData.Map.Zahyo.HeimenTyokkaku_KEI_Number;
    m.Zahyo.Projection = JsonData.Map.Zahyo.Projection;
    m.Zahyo.CenterXY =this.cnvJsonPoint(JsonData.Map.Zahyo.CenterXY, mdrmjFlag);
    m.Detail.DistanceMeasurable = JsonData.Map.Detail.DistanceMeasurable;
    m.Detail.ScaleVisible = JsonData.Map.Detail.ScaleVisible;
    m.MapCompass.Visible = JsonData.Map.MapCompass.Visible;
    m.MapCompass.Position = this.cnvJsonPoint(JsonData.Map.MapCompass.Position, mdrmjFlag);
    m.MapCompass.Mark = this.cnvJsonMark_Property(JsonData.Map.MapCompass.Mark);
    Object.assign(m.MapCompass.dirWord,JsonData.Map.MapCompass.dirWord);
    // m.MapCompass.dirWord.East = JsonData.Map.MapCompass.dirWord.East;
    // m.MapCompass.dirWord.West = JsonData.Map.MapCompass.dirWord.West;
    // m.MapCompass.dirWord.North = JsonData.Map.MapCompass.dirWord.North;
    // m.MapCompass.dirWord.South = JsonData.Map.MapCompass.dirWord.South;
    // m.MapCompass.Font = this.cnvJsonFont(JsonData.Map.MapCompass.Font, mdrmjFlag);
    this.Map = m;
    for (let i = 0; i < m.OBKNum; i++) {
        let ok = new strObjectGroup_Data();
        ok.ObjectType = JsonData.ObjectKind[i].ObjectType;
        ok.Name = JsonData.ObjectKind[i].Name;
        ok.Shape = JsonData.ObjectKind[i].Shape;
        ok.Mesh = JsonData.ObjectKind[i].Mesh;
        ok.Color = this.cnvJsonColor(JsonData.ObjectKind[i].Color);
        ok.DefTimeAttDataNum = JsonData.ObjectKind[i].DefTimeAttDataNum;
        ok.DefTimeAttSTC = JsonData.ObjectKind[i].DefTimeAttSTC;
        ok.ObjectNameNum = JsonData.ObjectKind[i].ObjectNameNum;
        ok.ObjectNameList = JsonData.ObjectKind[i].ObjectNameList;
        ok.UseLineType = JsonData.ObjectKind[i].UseLineType;
        ok.UseObjectGroup = JsonData.ObjectKind[i].UseObjectGroup;
        for (let j = 0; j < ok.DefTimeAttDataNum; j++) {
            let da = new strMPObjDefTimeAttData_Info();
            da.Type = JsonData.ObjectKind[i].DefTimeAttSTC[j].Type;
            da.attData.Title = JsonData.ObjectKind[i].DefTimeAttSTC[j].attData.Title;
            da.attData.Unit = JsonData.ObjectKind[i].DefTimeAttSTC[j].attData.Unit;
            da.attData.MissingF = JsonData.ObjectKind[i].DefTimeAttSTC[j].attData.MissingF;
            da.attData.Note = JsonData.ObjectKind[i].DefTimeAttSTC[j].attData.Note;
            da.ExtraValue = JsonData.ObjectKind[i].DefTimeAttSTC[j].ExtraValue;
            ok.DefTimeAttSTC[j] = da;
        }
        this.ObjectKind[i] = ok;
    }
    for (let i = 0; i < m.LpNum; i++) {
        let lk = new LineKind_Data();
        lk.Name = JsonData.LineKind[i].Name;
        lk.NumofObjectGroup = JsonData.LineKind[i].NumofObjectGroup;
        lk.Mesh = JsonData.LineKind[i].Mesh;
        for (let j = 0; j < lk.NumofObjectGroup; j++) {
            lk.ObjGroup[j] = new strLKOjectGroup_Info();
            lk.ObjGroup[j].GroupNumber = JsonData.LineKind[i].ObjGroup[j].GroupNumber;
            lk.ObjGroup[j].UseOnly = JsonData.LineKind[i].ObjGroup[j].UseOnly;
            lk.ObjGroup[j].Pattern = this.cnvJsonLine_Property(JsonData.LineKind[i].ObjGroup[j].Pattern, mdrmjFlag);
        }
        this.LineKind[i] = lk;
    }

    for (let i = 0; i < m.ALIN; i++) {
        let ml = new strLine_Data();
        ml.Number = JsonData.MPLine[i].Number;
        ml.NumOfPoint = JsonData.MPLine[i].NumOfPoint;
        ml.Connect = JsonData.MPLine[i].Connect;
        ml.NumOfLineUse = JsonData.MPLine[i].NumOfLineUse;
        ml.Circumscribed_Rectangle = this.cnvJsonRect(JsonData.MPLine[i].Circumscribed_Rectangle, mdrmjFlag);
        ml.NumOfTime = JsonData.MPLine[i].NumOfTime;
        ml.Drawn = JsonData.MPLine[i].Drawn;
        for (let j = 0; j < ml.NumOfTime; j++) {
            ml.LineTimeSTC[j] = new Line_Time_Data();
            ml.LineTimeSTC[j].Kind = JsonData.MPLine[i].LineTimeSTC[j].Kind;
            ml.LineTimeSTC[j].SETime = this.cnvJsonStart_End_Time_data(JsonData.MPLine[i].LineTimeSTC[j].SETime);
        }
        for (let j = 0; j < ml.NumOfPoint; j++) {
            ml.PointSTC[j] = this.cnvJsonPoint(JsonData.MPLine[i].PointSTC[j], mdrmjFlag);
        }
        this.MPLine[i] = ml;
    }
    for (let i = 0; i < m.Kend; i++) {
        let o = new strObj_Data();
        let s = JsonData.MPObj[i];
        o.Number = s.Number;
        o.Kind = s.Kind;
        o.Shape = s.Shape;
        o.NumOfNameTime = s.NumOfNameTime;
        o.NumOfCenterP = s.NumOfCenterP;
        o.NumOfSuc = s.NumOfSuc;
        o.NumOfLine = s.NumOfLine;
        o.Circumscribed_Rectangle = this.cnvJsonRect(s.Circumscribed_Rectangle, mdrmjFlag);
        if (s.DefTimeAttValue != null) {
            for (let j = 0; j < s.DefTimeAttValue.length; j++) {
                let d = new strDefTimeAttData_Info();
                if (s.DefTimeAttValue[j].Data != null) {
                    for (let k = 0; k < s.DefTimeAttValue[j].Data.length; k++) {
                        d.Data[k] = new strDefTimeAttDataEach_Info();
                        d.Data[k].Span = this.cnvJsonStart_End_Time_data(s.DefTimeAttValue[j].Data[k].Span);
                        if (s.DefTimeAttValue[j].Data[k].Value == null) {
                            d.Data[k].Value = undefined;
                        } else {
                            d.Data[k].Value = s.DefTimeAttValue[j].Data[k].Value;
                        }
                    }
                }
                o.DefTimeAttValue[j] = d;
            }
        }
        for (let j = 0; j < s.NumOfSuc; j++) {
            o.SucSTC[j] = new Object_Succession_Data();
            o.SucSTC[j].ObjectCode = s.SucSTC[j].ObjectCode;
            o.SucSTC[j].Time = this.cnvJsonstrYMD(s.SucSTC[j].Time);
        }
        for (let j = 0; j < s.NumOfNameTime; j++) {
            o.NameTimeSTC[j] = new Object_NameTimeStac_Data();
            o.NameTimeSTC[j].NamesList = Generic.ArrayShallowCopy(s.NameTimeSTC[j].NamesList);
            o.NameTimeSTC[j].SETime = this.cnvJsonStart_End_Time_data(s.NameTimeSTC[j].SETime);
        }

        for (let j = 0; j < s.NumOfCenterP; j++) {
            o.CenterPSTC[j] = new Object_CenterPoint_Data();
            o.CenterPSTC[j].Position = this.cnvJsonPoint(s.CenterPSTC[j].Position, mdrmjFlag);
            o.CenterPSTC[j].SETime = this.cnvJsonStart_End_Time_data(s.CenterPSTC[j].SETime)
        }
        for (let j = 0; j < s.NumOfLine; j++) {
            o.LineCodeSTC[j] = new LineCodeStac_Data();
            o.LineCodeSTC[j].LineCode = s.LineCodeSTC[j].LineCode;
            o.LineCodeSTC[j].NumOfTime = s.LineCodeSTC[j].NumOfTime;
            for (let k = 0; k < s.LineCodeSTC[j].Times.length; k++) {
                o.LineCodeSTC[j].Times[k] = this.cnvJsonStart_End_Time_data(s.LineCodeSTC[j].Times[k]);
            }
        }
        this.MPObj[i] = o;
    }
}

    private cnvJsonstrYMD(json: unknown) {
        let nt = new strYMD();
        Object.assign(nt,json);
        // nt.Year = json.Year;
        // nt.Month = json.Month
        // nt.Day = json.Day;
        return nt;
    }

    private cnvJsonStart_End_Time_data(json: unknown) {
        let nt = new Start_End_Time_data();
        nt.StartTime = this.cnvJsonstrYMD(json.StartTime);
        nt.EndTime = this.cnvJsonstrYMD(json.EndTime);
        return nt;
    }

    private cnvJsonFont(jsonf: unknown, mdrmjFlag: boolean) {
        let newf = new Font_Property();
        if (mdrmjFlag == false) {
            newf.Color = this.cnvJsonColor(jsonf.Body.Color);
            newf.Size = jsonf.Body.Size;
            newf.italic = jsonf.Body.italic;
            newf.bold = jsonf.Body.bold;
            newf.Underline = jsonf.Body.Underline;
            newf.Name = jsonf.Body.Name;
            newf.Kakudo = jsonf.Body.Kakudo;
            newf.FringeF = jsonf.Body.FringeF;
            newf.FringeWidth = jsonf.Body.FringeWidth;
            newf.FringeColor = this.cnvJsonColor(jsonf.Body.FringeColor);
            newf.Back = this.cnvJsonBackGround_Box_Property(jsonf.Back);
        } else {
            newf.Color = this.cnvJsonColor(jsonf.Color);
            newf.Size = jsonf.Size;
            newf.italic = jsonf.italic;
            newf.bold = jsonf.bold;
            newf.Underline = jsonf.Underline;
            newf.Name = jsonf.Name;
            newf.Kakudo = jsonf.Kakudo;
            newf.FringeF = jsonf.FringeF;
            newf.FringeWidth = jsonf.FringeWidth;
            newf.FringeColor = this.cnvJsonColor(jsonf.FringeColor);
            newf.Back = this.cnvJsonBackGround_Box_Property(jsonf.Back);
        }
        return newf;
    }


    private cnvJsonRect(jsonr: unknown, mdrmjFlag: boolean) {
        let newr = new rectangle();
        if (mdrmjFlag == false) {
            newr.left = jsonr.Left;
            newr.right = jsonr.Right;
            newr.top = jsonr.Top;
            newr.bottom = jsonr.Bottom;
        } else {
            Object.assign(newr,jsonr);
        }
        return newr;
    }

    private cnvJsonColor(jsonc: unknown) {
        let newc = new colorRGBA();
        Object.assign(newc,jsonc);
        // newc.a = jsonc.a;
        // newc.r = jsonc.r;
        // newc.g = jsonc.g;
        // newc.b = jsonc.b;
        return newc;
    }

    private cnvJsonPoint(jsonp: unknown, mdrmjFlag: boolean) {
        let newp = new point();
        if (mdrmjFlag == false) {
            newp.x = jsonp.X;
            newp.y = jsonp.Y;
        } else {
            newp.x = jsonp.x;
            newp.y = jsonp.y;
        }
        return newp;
    }

    private cnvJsonBackGround_Box_Property(json: unknown, mdrmjFlag: boolean = false) {
        let nt = new BackGround_Box_Property();
        nt.Tile = this.cnvJsonTile_Property(json.Tile, mdrmjFlag);
        nt.Line = this.cnvJsonLine_Property(json.Line, mdrmjFlag);
        nt.Round = json.Round;
        nt.Padding = json.Padding;
        return nt
    }
    private cnvJsonLineEdge_Connect_Pattern_Data_Info(json: unknown, mdrmjFlag: boolean) {
        let nt = new LineEdge_Connect_Pattern_Data_Info();
        if (mdrmjFlag == false) {
            const lc = ['round', 'square','butt' ];
            const lj = [  'round','bevel','miter'];
            nt.lineCap = lc[json.Edge_Pattern];
            nt.lineJoin = lj[json.Join_Pattern];
            nt.miterLimit = json.MiterLimitValue;
            }else{
                Object.assign(nt,json);
        }
        return nt;
    }
    private cnvJsonLine_Property(json: unknown, mdrmjFlag: boolean) {
        let nt = new Line_Property();
        if (mdrmjFlag == false) {
            nt.Width = json.BasicLine.SolidLine.Width;
            nt.Color = this.cnvJsonColor(json.BasicLine.SolidLine.Color);
            nt.Edge_Connect_Pattern = this.cnvJsonLineEdge_Connect_Pattern_Data_Info(json.Edge_Connect_Pattern, mdrmjFlag);
            if ((json.BasicLine.pattern != -1) || (json.CrossLine.XLine_f == true) || (
                (json.ParallelLine.P_Line_f == true) && (json.ParallelLine.InnerColor_f == true))) {
                nt.BlankF = false;
            } else {
                nt.BlankF = true;
            }
        } else {
            nt.Width = json.Width;
            nt.Color = this.cnvJsonColor(json.Color);
            nt.Edge_Connect_Pattern = this.cnvJsonLineEdge_Connect_Pattern_Data_Info(json.Edge_Connect_Pattern, mdrmjFlag);
            nt.BlankF= json.BlankF;
        }
        return nt;
    }

    private cnvJsonTile_Property(json: unknown, mdrmjFlag: boolean) {
        let nt = new Tile_Property();
        if (mdrmjFlag == false) {
            nt.BlankF = (json.TileCode == 7);
            nt.Color = this.cnvJsonColor(json.Line.BasicLine.SolidLine.Color);
        } else {
            nt.BlankF = json.BlankF;
            nt.Color = this.cnvJsonColor(json.Color);
        }
        return nt;
    }

    private cnvJsonMark_Property(json: unknown, mdrmjFlag: boolean = false) {
        let nt = new Mark_Property();
        nt.PrintMark = json.PrintMark;
        nt.ShapeNumber = json.ShapeNumber;
        nt.Tile = this.cnvJsonTile_Property(json.Tile, mdrmjFlag);
        nt.Line = this.cnvJsonLine_Property(json.Line, mdrmjFlag);
        nt.wordmark = json.wordmark;
        nt.WordFont = this.cnvJsonFont(json.WordFont, mdrmjFlag);
        return nt;
    }
}

export { clsMapdata };
