import { appState } from './core/AppState';
import { Generic, CheckedListBox, latlon } from './clsGeneric';
import { SortingSearch } from './SortingSearch';
import { clsTime } from './clsTime';
import { clsMapdata, EnableMPLine_Data } from './clsMapdata';
import { enmAttDataType, enmGraphMode, enmHorizontalAlignment, enmLayerType, enmPrintMouseMode, enmShape, enmTotalMode_Number, enmVerticalAlignment, enmZahyo_mode_info } from './constants/legacyEnums';
import type { strLayerInfo } from './clsWindow';
import type { JsonObject, JsonValue, JsonArray, ListItem } from './types';

type HorizontalAlignmentValue = (typeof enmHorizontalAlignment)[keyof typeof enmHorizontalAlignment];
type VerticalAlignmentValue = (typeof enmVerticalAlignment)[keyof typeof enmVerticalAlignment];
type PrintMouseModeValue = (typeof enmPrintMouseMode)[keyof typeof enmPrintMouseMode];


export class size {
    width: number;
    height: number;

    constructor(width: number = 0, height: number = 0) {
        this.width = width;
        this.height = height;
    }

    Clone(): size {
        return new size(this.width, this.height);
    }
}

export class point {
    x: number;
    y: number;
    Tag?: string | number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    Clone(): point {
        return new point(this.x, this.y);
    }

    offset(p_xp: point | number, yp: number = 0): void {
        if (p_xp instanceof point) {
            this.x += p_xp.x;
            this.y += p_xp.y;
            return;
        }
        this.x += p_xp;
        this.y += yp;
    }

    toLatlon(): latlon {
        return new latlon(this.y, this.x);
    }

    Equals(np: point): boolean {
        return (this.x === np.x) && (this.y === np.y);
    }
}

export class point3 extends point {
    z: number;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        super(x, y);
        this.z = z;
    }

    Clone(): point3 {
        return new point3(this.x, this.y, this.z);
    }
}

export class latlonbox {
    NorthWest?: latlon;
    SouthEast?: latlon;

    constructor(nw?: latlon, se?: latlon) {
        this.NorthWest = nw;
        this.SouthEast = se;
    }

    Clone(): latlonbox {
        return new latlonbox(this.NorthWest?.Clone(), this.SouthEast?.Clone());
    }

    toRectangle(): rectangle {
        return new rectangle(this.NorthWest?.lon ?? 0, this.SouthEast?.lon ?? 0, this.SouthEast?.lat ?? 0, this.NorthWest?.lat ?? 0);
    }
}

export class rectangle {
    left: number;
    right: number;
    top: number;
    bottom: number;

    constructor(left_point: point | number = 0, right_size: point | size | number = 0, top: number = 0, bottom: number = 0) {
        if (left_point instanceof point) {
            const p = left_point;
            if (right_size instanceof size) {
                this.left = p.x;
                this.right = p.x + right_size.width;
                this.top = p.y;
                this.bottom = p.y + right_size.height;
                return;
            }
            this.left = p.x;
            this.right = p.x;
            this.top = p.y;
            this.bottom = p.y;
            return;
        }

        this.left = left_point;
        this.right = right_size as number;
        this.top = top;
        this.bottom = bottom;
    }

    Clone(): rectangle {
        return new rectangle(this.left, this.right, this.top, this.bottom);
    }

    centerP(): point {
        return new point((this.right + this.left) / 2, (this.bottom + this.top) / 2);
    }

    size(): size {
        return new size(this.right - this.left, this.bottom - this.top);
    }

    width(): number {
        return this.right - this.left;
    }

    height(): number {
        return this.bottom - this.top;
    }

    topLeft(): point {
        return new point(this.left, this.top);
    }

    topRight(): point {
        return new point(this.right, this.top);
    }

    bottomRight(): point {
        return new point(this.right, this.bottom);
    }

    bottomLeft(): point {
        return new point(this.left, this.bottom);
    }

    contains(P: point): boolean {
        return (P.x >= this.left) && (P.x <= this.right) && (P.y >= this.top) && (P.y <= this.bottom);
    }

    offset(xplus: number, yplus: number): void {
        this.left += xplus;
        this.right += xplus;
        this.top += yplus;
        this.bottom += yplus;
    }

    inflate(xplus: number, yplus: number): void {
        this.left -= xplus;
        this.right += xplus;
        this.top -= yplus;
        this.bottom += yplus;
    }

    Inflate(x: number, y: number): void {
        this.inflate(x, y);
    }

    Contains(value1: number | point | rectangle, value2?: number): boolean {
        if (typeof value1 === 'number' && typeof value2 === 'number') {
            return this.contains(new point(value1, value2));
        }
        if (value1 instanceof point) {
            return this.contains(value1);
        }
        if (value1 instanceof rectangle) {
            return this.contains(value1.topLeft()) && this.contains(value1.bottomRight());
        }
        return false;
    }

    Offset(value1: number | point, value2?: number): void {
        if (value1 instanceof point) {
            this.offset(value1.x, value1.y);
            return;
        }
        this.offset(value1, value2 ?? 0);
    }

    IntersectsWith(rect: rectangle): boolean {
        if (this.right < rect.left || rect.right < this.left) return false;
        if (this.bottom < rect.top || rect.bottom < this.top) return false;
        return true;
    }

    Union(rect: rectangle): rectangle {
        return new rectangle(
            Math.min(this.left, rect.left),
            Math.max(this.right, rect.right),
            Math.min(this.top, rect.top),
            Math.max(this.bottom, rect.bottom)
        );
    }

    Equals(rect: rectangle): boolean {
        return (rect.left === this.left) && (rect.right === this.right) && (rect.top === this.top) && (rect.bottom === this.bottom);
    }
}

export class strYMD {
    Year: number;
    Month: number;
    Day: number;

    constructor(year: number | strYMD = 0, month: number = 0, day: number = 0) {
        if (year instanceof strYMD) {
            this.Year = year.Year;
            this.Month = year.Month;
            this.Day = year.Day;
            return;
        }
        this.Year = year;
        this.Month = month;
        this.Day = day;
    }

    Clone(): strYMD {
        return new strYMD(this.Year, this.Month, this.Day);
    }

    nullFlag(): boolean {
        return this.Year === 0 && this.Month === 0 && this.Day === 0;
    }

    Equals(time: strYMD): boolean {
        return this.Year === time.Year && this.Month === time.Month && this.Day === time.Day;
    }

    toInputDate(): string {
        if (this.nullFlag()) {
            return '';
        }
        return `${this.Year.toString().padStart(4, '0')}-${this.Month.toString().padStart(2, '0')}-${this.Day.toString().padStart(2, '0')}`;
    }

    toString(): string {
        if (this.nullFlag()) {
            return '';
        }
        return `${this.Year}/${this.Month}/${this.Day}`;
    }

    toDate(): Date {
        return new Date(this.Year, this.Month - 1, this.Day);
    }
}

//度分秒構造体
class strDegreeMinuteSeconde {
    Degree: number = 0;
    Minute: number = 0;
    Second: number = 0;
}

//度分秒緯度経度構造体
class _strLatLonDegreeMinuteSecond {
    LatitudeDMS: strDegreeMinuteSeconde;
    LongitudeDMS: strDegreeMinuteSeconde;

    constructor() {
        this.LatitudeDMS = new strDegreeMinuteSeconde();
        this.LongitudeDMS = new strDegreeMinuteSeconde();
    }

    toLatLon(): latlon {
        const result = new latlon(0, 0);
        result.lat = Math.abs(this.LatitudeDMS.Degree) + this.LatitudeDMS.Minute / 60 + this.LatitudeDMS.Second / 3600;
        if (this.LatitudeDMS.Degree < 0) {
            result.lat = -result.lat;
        }
        result.lon = Math.abs(this.LongitudeDMS.Degree) + this.LongitudeDMS.Minute / 60 + this.LongitudeDMS.Second / 3600;
        if (this.LongitudeDMS.Degree < 0) {
            result.lon = -result.lon;
        }
        return result;
    }
}

// latlon クラスは globals.d.ts で定義済み
// latlonbox クラスは globals.d.ts で定義済み
// rectangle クラスは globals.d.ts で定義済み
// PeripheriDirinfo クラスは globals.d.ts で定義済み
// strYMD クラスは globals.d.ts で定義済み

export class Start_End_Time_data {
    StartTime: strYMD;
    EndTime: strYMD;

    constructor() {
        this.StartTime = new strYMD(0, 0, 0);
        this.EndTime = new strYMD(0, 0, 0);
    }

    Clone(): Start_End_Time_data {
        const d = new Start_End_Time_data();
        d.StartTime = this.StartTime.Clone();
        d.EndTime = this.EndTime.Clone();
        return d;
    }

    Equals(SETime: Start_End_Time_data): boolean {
        if(this.StartTime.Equals(SETime.StartTime)){
            if(this.EndTime.Equals(SETime.EndTime)){
                return true;
            }
        }
        return false;
    }
}

const enmDataSource = {
    NoData: -1,
    Clipboard: 0,
    CSV: 1,
    DataEdit: 2,
    MDRJ: 3,
    MDRMJ: 4,
    Viwer: 7,
    Shapefile: 8
}

const enmClassMode_Meshod = {
    Noral: 0,
    Separated:1
}
const enmPointOnjectDrawOrder = {
    ObjectOrder: 0,
    LowerToUpperCategory: 1,
    UpperToLowerCategory: 2

}



//データ表示モードはglobals.d.tsで定義済み

//'線端形状
const enmEdge_Pattern = {
    Round: 0,// '丸
    Rectangle: 1,// '四角
    Flat: 2 //'平ら
}

//折れ線の接続
const enmJoinPattern = {
    Round: 0,
    Bevel: 1,
    Miter: 2,
}

const enmLineConnect={
    no : 0,
    one : 1,
    both : 2,
    loopen : 3
}
//階級区分モードの凡例
const enmClassModE_Meshod = {
    Noral: 0,
    Separated: 1
}
// 階級区分凡例分離表示のさいの表記法
const enmSeparateClassWords = {
    Japanese: 0,
    English: 1
}

const enmMesh_Number = {
    mhNonMesh: -1,
    mhFirst: 0,
    mhSecond: 1,
    mhThird: 2,
    mhHalf: 3,
    mhQuarter: 4,
    mhOne_Eighth: 5,
    mhOne_Tenth: 6
}
const enmZahyo_System_Info = {
    Zahyo_System_No: -1,
    Zahyo_System_tokyo: 0, //日本測地系
    Zahyo_System_World: 1 //世界測地系
}

const enmScaleUnit = {
    centimeter: 0,
    meter: 1,
    kilometer: 2,
    inch: 3,
    feet: 4,
    yard: 5,
    mile: 6,
    syaku: 7,
    ken: 8,
    ri: 9,
    kairi: 10
}

const enmProjection_Info = {
    prjNo: -1,
    prjSanson: 0,//サンソン図法
    prjSeikyoEntou: 1,//正距円筒図法
    prjMercator: 2,//メルカトル図法
    prjMiller: 3,//ミラー図法
    prjLambertSeisekiEntou: 4,//ランベルト正積円筒図法
    prjMollweide: 5,//モルワイデ図法
    prjEckert4: 6,//エッケルト第4図法
}
// enmZahyo_mode_info はglobals.d.tsで定義済み
const cstRectangle_Cross = {
    cstOuter: -1,
    cstCross: 0,
    cstInner: 1,
    cstInclusion: 2,
    cstEqual: 3
};

const chvValue_on_twoValue = {
    chvOuter: -1,
    chvJust: 0,
    chvIN: 1
};

export class colorRGBA {
    r: number;
    g: number;
    b: number;
    a: number;

    constructor(r: number | number[] = 0, g: number = 0, b: number = 0, a: number = 255) {
        if (Array.isArray(r)) {
            this.r = Number(r[0] ?? 0);
            this.g = Number(r[1] ?? 0);
            this.b = Number(r[2] ?? 0);
            this.a = Number(r.length >= 4 ? r[3] : 255);
            return;
        }
        this.r = Number(r);
        this.g = Number(g);
        this.b = Number(b);
        this.a = Number(a);
    }

    Clone(): colorRGBA {
        return new colorRGBA([this.r, this.g, this.b, this.a]);
    }

    toRGB(): string {
        return `RGB(${this.r},${this.g},${this.b})`;
    }

    toRGBA(): string {
        return `RGBA(${this.r},${this.g},${this.b},${this.a / 255})`;
    }

    toHex(): string {
        const hex = (n: number): string => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
        return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
    }

    Equals(col: colorRGBA): boolean {
        return (col.r === this.r) && (col.g === this.g) && (col.b === this.b) && (col.a === this.a);
    }

    getDarkColor(): colorRGBA {
        const rate = 0.85;
        return new colorRGBA([this.r * rate, this.g * rate, this.b * rate, this.a]);
    }
}

class _Cross_Line_Data {
    BeforPoint: point = new point();
    Point: point = new point();
}
// enmShape はglobals.d.tsで定義済み

// enmGraphMode はglobals.d.tsで定義済み


class strURL_Data {
    Name: string = "";
    Address: string = "";
}

//オブジェクト名とコード、シンボル位置（属性データ）
class strObject_Data_Info {
    MpObjCode: number = 0;
    Name: string = "";
    Objectstructure: number = 0;
    HyperLinkNum: number = 0;
    HyperLink: strURL_Data[] = [];
    CenterPoint: point = new point();
    Symbol: point = new point();
    Label: point = new point();
    defPoint: latlon = new latlon();
    MeshRect: rectangle = new rectangle(0, 0, 0, 0);
    MeshPoint: point[] = [];
    Visible: boolean = false;

    Clone(): strObject_Data_Info {
    const d = new strObject_Data_Info();
    d.MpObjCode = this.MpObjCode;
    d.Name = this.Name;
    d.Objectstructure = this.Objectstructure;
    d.HyperLinkNum = this.HyperLinkNum;
    for(const i in this.HyperLink){
        const  ud=new strURL_Data();
        Object.assign(ud,this.HyperLink[i]);
        d.HyperLink.push(ud);
    }
    d.CenterPoint = this.CenterPoint.Clone();
    d.Symbol = this.Symbol.Clone();
    d.Label = this.Label.Clone();
    d.MeshRect = this.MeshRect.Clone();
    d.defPoint = this.defPoint.Clone();
    d.MeshPoint = Generic.ArrayClone(this.MeshPoint); 
    d.Visible = this.Visible;
    return d;
    }
}

class strObject_Info {
    ObjectNum: number = 0;
    NumOfSyntheticObj: number = 0;
    atrObjectData: strObject_Data_Info[] = [];
    MPSyntheticObj: strSynthetic_Object_Data[] = [];
    TripObjData: TripObjData[] = [];
}

//合成オブジェクト名とコード（属性データ）
class strSynthetic_ObjectName_and_Code {
    code: number = 0;
    Name: string = "";
    Draw_F: boolean = false;

    Clone(): strSynthetic_ObjectName_and_Code {
        const dt = new strSynthetic_ObjectName_and_Code();
        Object.assign(dt, this);
        return dt;
    }
}

//合成オブジェクト（属性・地図データ）
class strSynthetic_Object_Data {
    Kind: number = 0;
    NumOfObject: number = 0;
    Name: string = "";
    CenterP: point = new point();
    SETime: Start_End_Time_data = new Start_End_Time_data();
    Shape: number = 0; // enmShape
    Circumscribed_Rectangle: rectangle = new rectangle();
    Objects: strSynthetic_ObjectName_and_Code[] = [];

    Clone(): strSynthetic_Object_Data {
        const dt = new strSynthetic_Object_Data();
        Object.assign(dt, this);
        dt.SETime = this.SETime.Clone();
        dt.CenterP = this.CenterP.Clone();
        dt.Circumscribed_Rectangle = this.Circumscribed_Rectangle.Clone();
        dt.Objects = Generic.ArrayClone(this.Objects);
        return dt;
    }
}

// const enmLatLonLine_Order = {
//     Back: 0,
//     Front: 1
// }

const enmInner_Data_Info_Mode = {
    ClassPaint: 0,
    ClassHatch: 1
}

const enmMarkPrintType = {
    Mark: 0,
    Word: 1,
    Picture:2
}

//画面上に固定または地図領域に固定
const enmBasePosition = {
    Map: 0,
    Screen: 1
}

const enmScaleBarPattern = {
    Thin : 0,
        Bold : 1,
        Slim : 2
}


//記号の数，大きさ，階級記号，線モードの内部色設定
export class strInner_Data_Info {
    Flag: number = 0;
    Data: number = 0;

    Clone(): strInner_Data_Info {
        const d = new strInner_Data_Info();
        d.Flag = this.Flag;
        d.Data = this.Data;
        return d;
    }
}

// colorRGBA クラスは globals.d.ts で定義済み

/**イルマップを描画するタイミング */
const enmDrawTiming={
    BeforeDataDraw:0,
    AfterDataDraw:1
}
/**タイルマップを描画する際の情報 */
class strTileMapViewInfo {
    Visible: boolean = false;
    AlphaValue: number = 1;
    TileMapDataSet: JsonObject = {};
    DrawTiming: number = 0;

    Clone(): strTileMapViewInfo {
        const d = new strTileMapViewInfo();
        Object.assign(d, this);
        d.TileMapDataSet = Generic.Clone(this.TileMapDataSet);
        return d;
    }
}

/**取得する個別タイル 旧Watchize_Data_Info*/
class _tileList_Data_Info {
    LatLonBox: JsonObject | undefined = undefined;
    ScrPosition: rectangle = new rectangle();
    URL: string = "";
}


//ペイントモード設定値（属性データ）
class strClassPaint_Data {
    color1: colorRGBA = new colorRGBA();
    color2: colorRGBA = new colorRGBA();
    color3: colorRGBA = new colorRGBA();
    Color_Mode: number = 0; // enmPaintColorSettingModeInfo

    Clone(): strClassPaint_Data {
        const d = new strClassPaint_Data();
        d.color1 = this.color1.Clone();
        d.color2 = this.color2.Clone();
        d.color3 = this.color3.Clone();
        d.Color_Mode = this.Color_Mode;
        return d;
    }
}

//記号モード共通
class strMarkCommon_Data {
    Inner_Data: strInner_Data_Info = new strInner_Data_Info();
    MinusTile: Tile_Property = new Tile_Property();
    MinusLineColor: colorRGBA = new colorRGBA();
    LegendMinusWord: string = "";
    LegendPlusWord: string = "";

    Clone(): strMarkCommon_Data {
        const d = new strMarkCommon_Data();
        d.Inner_Data = this.Inner_Data.Clone();
        d.MinusTile = this.MinusTile.Clone();
        d.MinusLineColor = this.MinusLineColor.Clone();
        d.LegendMinusWord = this.LegendMinusWord;
        d.LegendPlusWord = this.LegendPlusWord;
        return d;
    }
}

class strMarkSizeModeLineShapeData {
    LineWidth: number = 1;
    LineEdge: LineEdge_Connect_Pattern_Data_Info = new LineEdge_Connect_Pattern_Data_Info();
    Color: colorRGBA = new colorRGBA();

    Clone(): strMarkSizeModeLineShapeData {
        const d = new strMarkSizeModeLineShapeData();
        d.LineWidth = this.LineWidth;
        d.LineEdge = this.LineEdge.Clone();
        d.Color = this.Color.Clone();
        return d;
    }
}

//記号の大きさモード設定（属性データ）
class strMarkSize_Data {
    MaxValueMode: number = 0;
    MaxValue: number = 0;
    Value: number[] = [];
    Mark: Mark_Property = new Mark_Property();
    LineShape: strMarkSizeModeLineShapeData = new strMarkSizeModeLineShapeData();

    Clone(): strMarkSize_Data {
        const d = new strMarkSize_Data();
        d.MaxValueMode = this.MaxValueMode;
        d.MaxValue = this.MaxValue;
        d.Value = this.Value.concat();
        d.Mark = this.Mark.Clone();
        d.LineShape = this.LineShape.Clone();
        return d;
    }
}

//記号の数モード設定（属性データ）
class strMarkBlock_Data {
    Value: number = 0;
    ArrangeB: number = 0;
    HasuVisible: boolean = false;
    Mark: Mark_Property = new Mark_Property();
    Overlap: number = 0;
    LegendBlockModeWord: string = "";

    Clone(): strMarkBlock_Data {
        const d = new strMarkBlock_Data();
        Object.assign(d, this);
        d.Mark = this.Mark.Clone();
        return d;
    }
}

//記号の棒モード
const enmMarkBarShape = {
    bar: 0,
    triangle: 1
}

class strMarkBar_Data {
    Width: number = 0;
    MaxHeight: number = 0;
    MaxValueMode: number = 0;
    MaxValue: number = 0;
    InnerTile: Tile_Property = new Tile_Property();
    FrameLinePat: Line_Property = new Line_Property();
    ThreeD: boolean = false;
    ScaleLineInterval: number = 0;
    ScaleLineVisible: boolean = false;
    scaleLinePat: Line_Property = new Line_Property();
    BarShape: number = 0;

    Clone(): strMarkBar_Data {
        const d = new strMarkBar_Data();
        Object.assign(d, this);
        d.InnerTile = this.InnerTile.Clone();
        d.FrameLinePat = this.FrameLinePat.Clone();
        d.scaleLinePat = this.scaleLinePat.Clone();
        return d;
    }
}

//文字モード
class strString_Data {
    Font: Font_Property = new Font_Property();
    maxWidth: number = 0;
    WordTurnF: boolean = false;

    Clone(): strString_Data {
        const d = new strString_Data();
        d.Font = this.Font.Clone();
        d.maxWidth = this.maxWidth;
        d.WordTurnF = this.WordTurnF;
        return d;
    }
}

const enmMarkBlockArrange = {
    Block: 0,
    Vertical: 1,
    Horizontal: 2,
    Random:3
}

/**単独表示モードの列挙型 */
const enmSoloMode_Number = {
    noMode: -1,
    ClassPaintMode: 0,
    MarkSizeMode: 1,
    MarkBlockMode: 2,
    ContourMode: 3,
    ClassHatchMode: 4,
    ClassMarkMode: 5,
    ClassODMode: 6,
    MarkTurnMode: 7,
    MarkBarMode: 8,
    StringMode: 9
}

//階級区分データ（属性データ）
class strClass_Div_data {
    Value: number | string = 0;  //Double/String
    PaintColor: colorRGBA = new colorRGBA();
    ClassMark: Mark_Property = new Mark_Property();
    ODLinePat: Line_Property = new Line_Property();
    
    Clone(): strClass_Div_data {
        const d = new strClass_Div_data();
        d.Value = this.Value;
        d.PaintColor = this.PaintColor.Clone();
        d.ClassMark = this.ClassMark.Clone();
        d.ODLinePat = this.ODLinePat.Clone();
        return d;
    }
}

class strContour_Data_Regular_interval {
    bottom: number = 0;
    Interval: number = 0;
    top: number = 0;
    Line_Pat: Line_Property = new Line_Property();
    SP_Bottom: number = 0;
    SP_interval: number = 0;
    SP_Top: number = 0;
    SP_Line_Pat: Line_Property = new Line_Property();
    EX_Value_Flag: boolean = false;
    EX_Value: number = 0;
    EX_Line_Pat: Line_Property = new Line_Property();
}
class strContour_Data_Irregular_interval {
    Value: number = 0; // Double
    Line_Pat: Line_Property = new Line_Property();
    
    Clone(): strContour_Data_Irregular_interval {
        const ir = new strContour_Data_Irregular_interval();
        ir.Value = this.Value;
        ir.Line_Pat = this.Line_Pat.Clone();
        return ir;
    }
}

const enmContourIntervalMode = {
    RegularInterval: 0,
    SeparateSettings: 1,
    ClassPaint: 2,
    ClassHatch: 3
}
class strContour_Data {
    Interval_Mode: number = 0; // enmContourIntervalMode
    Draw_in_Polygon_F: boolean = false; // Boolean
    Spline_flag: boolean = false; // Boolean
    Detailed: number = 0; // Integer
    Regular: strContour_Data_Regular_interval = new strContour_Data_Regular_interval();
    IrregularNum: number = 0; // Integer
    Irregular: strContour_Data_Irregular_interval[] = []; // strContour_Data_Irregular_interval
    
    Clone(): strContour_Data {
        const d = new strContour_Data();
        Object.assign(d, this);
        d.Regular = new strContour_Data_Regular_interval();
        Object.assign(d.Regular, this.Regular);
        d.Regular.Line_Pat = this.Regular.Line_Pat.Clone();
        d.Regular.SP_Line_Pat = this.Regular.SP_Line_Pat.Clone();
        d.Regular.EX_Line_Pat = this.Regular.EX_Line_Pat.Clone();
        d.Irregular = [];
        for (const i in this.Irregular) {
            d.Irregular.push(this.Irregular[i].Clone());
        }
        return d;
    }
}

class strContour_Line_property {
    Flag: boolean = false; // Boolean
    Layernum: number = 0; // Integer
    DataNum: number = 0; // Integer
    Value: number = 0; // Double
    NumOfPoint: number = 0; // Integer
    PointStac: number = 0; // Integer
    Circumscribed_Rectangle: rectangle = new rectangle();
}
//線引きモード（属性データ）
class strClassODMode_data {
    o_Layer: number = 0; // Integer
    O_object: number = 0; // Integer
    Dummy_ObjectFlag: boolean = false; // Boolean
    Arrow: Arrow_Data = new Arrow_Data();
    
    Clone(): strClassODMode_data {
        const d = new strClassODMode_data();
        d.o_Layer = this.o_Layer;
        d.O_object = this.O_object;
        d.Dummy_ObjectFlag = this.Dummy_ObjectFlag;
        d.Arrow = this.Arrow.Clone();
        return d;
    }
}
const _enmMarkTurnDirection = {
    AntiClockwise: 0,
    Clockwise: 1
}
//記号の回転モード
class strMarkTurnMode_Data {
    Dirction: number = 0;
    Mark: Mark_Property = new Mark_Property();
    DegreeLap: number = 0;
    Clone(): strMarkTurnMode_Data {
        const d = new strMarkTurnMode_Data();
        d.Dirction = this.Dirction;
        d.DegreeLap = this.DegreeLap;
        d.Mark = this.Mark.Clone();
        return d;
    }
}

//データ項目ごとの単独表示モードのプロパティを保持する構造体
class strSoloModeViewSettings_Data {
    SoloMode: number = 0;
    Div_Num: number = 0;
    Div_Method: number = 0;
    ClassPaintMD: strClassPaint_Data = new strClassPaint_Data();
    MarkCommon: strMarkCommon_Data = new strMarkCommon_Data();
    MarkSizeMD: strMarkSize_Data = new strMarkSize_Data();
    MarkBlockMD: strMarkBlock_Data = new strMarkBlock_Data();
    MarkBarMD: strMarkBar_Data = new strMarkBar_Data();
    StringMD: strString_Data = new strString_Data();
    ContourMD: strContour_Data = new strContour_Data();
    ClassODMD: strClassODMode_data = new strClassODMode_data();
    ClassMarkMD: strInner_Data_Info = new strInner_Data_Info();
    MarkTurnMD: strMarkTurnMode_Data = new strMarkTurnMode_Data();
    Class_Div: strClass_Div_data[] = [];
}
class strStatisticInfo {
    Max: number = 0;
    Min: number = 0;
    Ave: number = 0;
    STD: number = 0;
    Sum: number = 0;
    sa: number = 0;
    BeforeDecimalNum: number = 0;
    AfterDecimalNum: number = 0;
}




//階級区分の分割方法
const enmDivisionMethod = {
    Free: 0,
    Quantile: 1,
    AreaQuantile: 2,
    StandardDeviation: 3,
    EqualInterval: 4
}

//記号モードなど最大サイズの値
const enmMarkMaxValueType = {
    SelectedDataMax: 0,
    UserSettingValue: 1
}

/** 円グラフ、帯グラフの最大サイズ*/
const enmGraphMaxSize= {
    Fixed : 0,
    Changeable :1
}
/** 折れ線・棒グラフの最大最小値*/
const enmBarLineMaxMinMode= {
    Auto : 0,
    Manual : 1
}

/**棒・折れ線グラフ枠のパターン */
const enmBarChartFrameAxePattern={
    Whole:0,
    Half:1
}

const enmMultiEnGraphPattern = {
    multiCircle: 0,
    oneCircle: 1
}
const enmKenCodeObjectstructure = {
    MapObj: 0,  //地図ファイル中のオブジェクトの場合
    SyntheticObj: 1 //時系列集計による合成オブジェクトの場合
}


//データ項目の情報
class strData_info {
    Title: string = "";  //String
    Unit: string = "";  //String
    MissingF: boolean = false;  //Boolean
    Note: string = "";  //String
    DataType: number = 0;  //enmAttDataType
    // 欠損値のデータ数
    MissingValueNum: number = 0;  //Integer
    // 欠損値を除いたデータ項目中のデータ数
    EnableValueNum: number = 0;  //Integer
    Statistics: strStatisticInfo = new strStatisticInfo();
    //  表示モード
    ModeData: number = 0;  //enmSoloMode_Number
    SoloModeViewSettings: strSoloModeViewSettings_Data = new strSoloModeViewSettings_Data();//  '単独表示モードごとのプロパティ
    Value: (string | number | undefined)[] = [];  //String or Number
    
    Clone(NoValueFlag: boolean = false): strData_info {
        const dt = new strData_info();
        dt.Title = this.Title;
        dt.Unit = this.Unit;
        dt.MissingF = this.MissingF;
        dt.Note = this.Note;
        dt.DataType = this.DataType;
        dt.MissingValueNum = this.MissingValueNum;
        dt.EnableValueNum = this.EnableValueNum;
        dt.Statistics = new strStatisticInfo();
        Object.assign(dt.Statistics, this.Statistics);
        dt.ModeData = this.ModeData;
        const dts = dt.SoloModeViewSettings;
        dts.Div_Num = this.SoloModeViewSettings.Div_Num;
        dts.Div_Method = this.SoloModeViewSettings.Div_Method;
        dts.Class_Div = [];
        for (const i in this.SoloModeViewSettings.Class_Div) {
            dts.Class_Div[i] = this.SoloModeViewSettings.Class_Div[i].Clone();
        }
        dts.ClassMarkMD = this.SoloModeViewSettings.ClassMarkMD.Clone();
        dts.ClassODMD = this.SoloModeViewSettings.ClassODMD.Clone();
        dts.ClassPaintMD = this.SoloModeViewSettings.ClassPaintMD.Clone();
        dts.ContourMD = this.SoloModeViewSettings.ContourMD.Clone();
        dts.MarkCommon = this.SoloModeViewSettings.MarkCommon.Clone();
        dts.MarkBarMD = this.SoloModeViewSettings.MarkBarMD.Clone();
        dts.MarkBlockMD = this.SoloModeViewSettings.MarkBlockMD.Clone();
        dts.MarkSizeMD = this.SoloModeViewSettings.MarkSizeMD.Clone();
        dts.MarkTurnMD = this.SoloModeViewSettings.MarkTurnMD.Clone();
        dts.StringMD = this.SoloModeViewSettings.StringMD.Clone();
        if (NoValueFlag === false) {
            dt.Value = this.Value.concat();
        }
        return dt;
    }
}

class _strShowViewerLayerInfo {
    //白地図初期属性データのレイヤ情報
    Name: string = ""; //String
    MapfileName: string = ""; //String
    UseObjectKind: boolean[] = []; //Boolean
    Time: strYMD = new strYMD();
    Shape: number = 0; //enmShape
}

class stratrData_Info {
    [key: string]: number | strData_info[];
    Count: number = 0;//データ項目数
    SelectedIndex: number = 0;//選択中のデータ項目番号
    Data: strData_info[] = [];//strData_info
}

class strLayerPointLineShape_Data {
    LineWidth: number = 1; //Single
    LineEdge: LineEdge_Connect_Pattern_Data_Info = new LineEdge_Connect_Pattern_Data_Info();
    PointMark: Mark_Property = new Mark_Property();
}
/**ラベルモード全体 */
class strLabelMode_Data_info {
    SelectedIndex: number = 0;// Integer
    DataSet: strLabel_Data[] = [];// As strLabel_Data
    
    initDataSet(): void {
        this.SelectedIndex = 0;
        this.DataSet = [];
        this.AddDataSet();
    }

    AddDataSet(): void {
        const d = new strLabel_Data();
        d.initData();
        this.DataSet.push(d);
    }

    Clone(): strLabelMode_Data_info {
        const d = new strLabelMode_Data_info();
        d.SelectedIndex = this.SelectedIndex;
        for (const i in this.DataSet) {
            d.DataSet.push(this.DataSet[i].Clone());
        }
        return d;
    }
}

/**ラベルモードの個別データセットの構造体*/
class strLabel_Data {
    title: string = ""; //String
    Location_Mark_Flag: boolean = false; //Boolean
    Location_Mark: Mark_Property = new Mark_Property();
    Width: number = 0; //Single
    DataItem: number[] = []; //Integer
    DataValue_Font: Font_Property = new Font_Property();
    DataValue_Unit_Flag: boolean = false; //Boolean
    DataValue_TurnFlag: boolean = false; //Boolean
    DataValue_Print_Flag: boolean = false; //Boolean
    DataName_Print_Flag: boolean = false; //Boolean
    ObjectName_Font: Font_Property = new Font_Property();
    ObjectName_Turn_Flag: boolean = false; //Boolean
    ObjectName_Print_Flag: boolean = false; //Boolean
    BorderObjectTile: Tile_Property = new Tile_Property();
    BorderDataTile: Tile_Property = new Tile_Property();
    BorderLine: Line_Property = new Line_Property();
    
    Clone(): strLabel_Data {
        const d = new strLabel_Data();
        Object.assign(d, this);
        d.DataItem = this.DataItem.concat();
        d.Location_Mark = this.Location_Mark.Clone();
        d.DataValue_Font = this.DataValue_Font.Clone();
        d.BorderObjectTile = this.BorderObjectTile.Clone();
        d.BorderDataTile = this.BorderDataTile.Clone();
        d.BorderLine = this.BorderLine.Clone();
        return d;
    }
    
    initData(): void {
        this.DataItem = [];
        this.title = "";
        this.Location_Mark = clsBase.Mark();
        this.Location_Mark.WordFont.Size = 1;
        this.Location_Mark_Flag = false;
        this.Width = 30;

        this.DataValue_Font = clsBase.Font();
        this.DataValue_Font.Size = 2;
        this.DataValue_Font.FringeF = true;
        this.DataValue_TurnFlag = true;
        this.DataValue_Unit_Flag = true;
        this.DataValue_Print_Flag = true;
        this.DataName_Print_Flag = true;

        this.ObjectName_Font = clsBase.Font();
        this.ObjectName_Font.Size = 2;
        this.ObjectName_Font.FringeF = true;
        this.ObjectName_Turn_Flag = true;
        this.ObjectName_Print_Flag = true;

        this.BorderLine = clsBase.BlankLine();
        this.BorderDataTile = clsBase.BlancTile();
        this.BorderObjectTile = clsBase.BlancTile();
    }
}


//グラフモード全体の構造体
class strGraphMode_DataSetting_Info {
    SelectedIndex: number = 0;// Integer
    DataSet: strGraph_Data[] = [];// As strGraph_Data
    
    initDataSet(): void {
        this.SelectedIndex = 0;
        this.DataSet = [];
        this.AddDataSet();
    }
    
    AddDataSet(): void {
        const d = new strGraph_Data();
        d.initData();
        this.DataSet.push(d);
    }
    
    Clone(): strGraphMode_DataSetting_Info {
        const d = new strGraphMode_DataSetting_Info();
        d.SelectedIndex = this.SelectedIndex;
        d.DataSet = Generic.ArrayClone(this.DataSet);
        return d;
    }
}

/**グラフモード個別データセット */
class strGraph_Data {
    title: string = ""; //String
    GraphMode: number = 0; //enmGraphMode
    Data: GraphModeDataItem[] = []; //GraphModeDataItem
    En_Obi: strGraph_Data_En = new strGraph_Data_En();
    Oresen_Bou: strGraph_Data_Oresen = new strGraph_Data_Oresen();
    
    initData(): void {
        this.title = "";
        this.Data = [];
        this.En_Obi = new strGraph_Data_En();
        this.GraphMode = enmGraphMode.PieGraph;
        this.En_Obi.EnSize = 10;
        this.En_Obi.EnSizeMode = enmGraphMaxSize.Changeable;
        this.En_Obi.BoaderLine = clsBase.Line();
        this.En_Obi.AspectRatio = 0.5;
        this.En_Obi.StackedBarDirection = 0;
        this.En_Obi.MaxValueMode = enmMarkMaxValueType.SelectedDataMax;

        this.Oresen_Bou.Size = 10;
        this.Oresen_Bou.Line = clsBase.Line();
        this.Oresen_Bou.AspectRatio = 1;
        this.Oresen_Bou.YmaxMinMode = enmBarLineMaxMinMode.Auto;
        this.Oresen_Bou.BackgroundTile = clsBase.Tile();
        this.Oresen_Bou.BackgroundTile.BlankF = true;
        this.Oresen_Bou.BackgroundTile.Color = new colorRGBA(255, 255, 255, 128);
        this.Oresen_Bou.BorderLine = clsBase.Line();
        this.Oresen_Bou.FrameAxe = enmBarChartFrameAxePattern.Half;
    }

    Clone(): strGraph_Data {
        const d = new strGraph_Data();
        Object.assign(d, this);
        d.En_Obi = this.En_Obi.Clone();
        d.Oresen_Bou = this.Oresen_Bou.Clone();
        d.Data = [];
        for (const i in this.Data) {
            d.Data.push(this.Data[i].Clone());
        }
        return d;
    }
}

class GraphModeDataItem {
    DataNumber: number = 0;// Integer
    Tile: Tile_Property = new Tile_Property();
    
    Clone(): GraphModeDataItem {
        const d = new GraphModeDataItem();
        d.DataNumber = this.DataNumber;
        d.Tile = this.Tile.Clone();
        return d;
    }
}
class strGraph_Data_En {
    EnSizeMode: number = 0; //enmGraphMaxSize
    EnSize: number = 0; //Single
    Value1: number = 0; //Double
    Value2: number = 0; //Double
    Value3: number = 0; //Double
    BoaderLine: Line_Property = new Line_Property();
    AspectRatio: number = 0; //Single
    StackedBarDirection: number = 0; //enmStackedBarChart_Direction
    RMAX: number = 0; //Double
    RMIN: number = 0; //Double
    MaxValueMode: number = 0; //enmMarkMaxValueType
    MaxValue: number = 0; //Double
    
    Clone(): strGraph_Data_En {
        const d = new strGraph_Data_En();
        Object.assign(d, this);
        d.BoaderLine = this.BoaderLine.Clone();
        return d;
    }
}
class strGraph_Data_Oresen { //複数表示（折れ線）（属性データ）
    Size: number = 0; //Single
    Line: Line_Property = new Line_Property();
    AspectRatio: number = 0; //Single
    YmaxMinMode: number = 0; //enmBarLineMaxMinMode
    YMax: number = 0; //Double
    Ymin: number = 0; //Double
    Ystep: number = 0; //Double
    BackgroundTile: Tile_Property = new Tile_Property();
    BorderLine: Line_Property = new Line_Property();
    FrameAxe: number = 0;//enmBarChartFrameAxePattern
    
    Clone(): strGraph_Data_Oresen {
        const d = new strGraph_Data_Oresen();
        Object.assign(d, this);
        d.Line = this.Line.Clone();
        d.BackgroundTile = this.BackgroundTile.Clone();
        d.BorderLine = this.BorderLine.Clone();
        return d;
    }
}

class strLayerModeViewSetting_Data {
   //this.TripMode = new strTripMode_Data_Info;
   LabelMode: strLabelMode_Data_info = new strLabelMode_Data_info();
   GraphMode: strGraphMode_DataSetting_Info = new strGraphMode_DataSetting_Info();
   // 点オブジェクトのペイントモードの記号・線オブジェクトのペイントモードの線幅等設定
   PointLineShape: strLayerPointLineShape_Data = new strLayerPointLineShape_Data();
   // ダミーオブジェクトをクリッピング領域に設定
   PolygonDummy_ClipSet_F: boolean = false; //Boolean
}

/**ダミーオブジェクトの配列 */
class strDummyObjectName_and_Code {
    code: number = 0; //Integer
    Name: string = ""; //String
    
    Clone(): strDummyObjectName_and_Code {
        const d = new strDummyObjectName_and_Code();
        d.code = this.code;
        d.Name = this.Name;
        return d;
    }
}

const _enmMoveDirection = {
    NextPos: 1,
    PreviousPos: -1
}



class ODBezier_Data {
    ObjectPos: number = 0;//Integer
    Data: number = 0;//Integer
    Point: point = new point();
    Name: string = "";
    
    Clone(): ODBezier_Data {
        const d = new ODBezier_Data();
        d.ObjectPos = this.ObjectPos;
        d.Data = this.Data;
        d.Point = this.Point.Clone();
        d.Name = this.Name;
        return d;
    }
}

class strLayerDataInfo {
    Name: string = ""; // String
    MapFileName: string = ""; // String
    MapFileData: clsMapdata | undefined = undefined;
    MapFileObjectNameSearch: clsObjectNameSearch | undefined = undefined;
    Shape: number = 0; // enmShape
    Type: number = 0; // enmLayerType
    MeshType: number = 0; // enmMesh_Number
    ReferenceSystem: number = 0; // enmZahyo_System_Info
    Time: strYMD = new strYMD();
    Comment: string = ""; // String
    TripTimeSpan: JsonObject | undefined = undefined; // TripTimeSpan_Info (未定義のため暫定的にJsonObject)
    TripType: number = 0; // enmTripPositionType
    // オブジェクトの情報
    atrObject: strObject_Info = new strObject_Info();
    // データ項目の情報
    atrData: stratrData_Info = new stratrData_Info();
    Dummy: strDummyObjectName_and_Code[] = [];
    DummyGroup: number[] = [];
    Print_Mode_Layer: number = 0; // enmLayerMode_Number '0:単独 1:グラフ 2:ラベル 3:移動
    // グラフ表示、ラベル表示、移動表示、点線オブジェクトのペイントモードの記号
    LayerModeViewSettings: strLayerModeViewSetting_Data = new strLayerModeViewSetting_Data();
    PrtSpatialIndex: ClsSpatialIndexSearchInstance | undefined = undefined;
    ObjectGroupRelatedLine: number[] = []; // Integer()
    ODBezier_DataStac: ODBezier_Data[] = []; // List(Of ODBezier_Data)

    initLayerData_from_mdrz(): void {
        if (this.MapFileData.Map.ALIN > 0) {
            this.ObjectGroupRelatedLine = [];
        }
    }

    /** 線モードのベジェ曲線用の参照地点をRefPointに返す。該当しない場合はfalseを返す*/
    Get_OD_Bezier_RefPoint(ObjPos: number, DataNum: number): { ok: boolean; RefPoint?: point } {
        for (let i = 0; i < this.ODBezier_DataStac.length; i++) {
            const bs = this.ODBezier_DataStac[i];
            if ((bs.Data === DataNum) && (bs.ObjectPos === ObjPos)){
                return { ok: true, RefPoint: bs.Point };
            }
        }
        return { ok: false };
    }

    /**線モードのベジェ曲線用の参照地点を削除 */
    Remove_OD_Bezier(ObjPos: number, DataNum: number): void {
        for (let i = 0; i < this.ODBezier_DataStac.length; i++) {
            const bs = this.ODBezier_DataStac[i];
            if ((bs.Data === DataNum) && (bs.ObjectPos === ObjPos)){
                this.ODBezier_DataStac.splice(i,1);
                return;
            }
        }
    }

    /**線モードのベジェ曲線用の参照地点を追加。存在する場合は変更 */
    Add_OD_Bezier(ObjPos: number, DataNum: number, RefPoint: point): void {
        for (let i = 0; i < this.ODBezier_DataStac.length; i++) {
            const bs = this.ODBezier_DataStac[i];
            if ((bs.Data === DataNum) && (bs.ObjectPos === ObjPos)){
                bs.Point=RefPoint.Clone();
                return;
            }
        }
        const newD=new ODBezier_Data();
        newD.Data = DataNum;
        newD.ObjectPos = ObjPos;
        newD.Point = RefPoint.Clone();
        this.ODBezier_DataStac.push(newD);
    }

    initLayerData(): void {
        this.ObjectGroupRelatedLine = [];
        switch (this.Type) {
            case enmLayerType.Normal:
            case enmLayerType.Mesh:
            case enmLayerType.DefPoint: {
                this.Print_Mode_Layer = enmLayerMode_Number.SoloMode;
                const ps = new strLayerPointLineShape_Data();
                ps.LineWidth = 0.5;
                ps.LineEdge = clsBase.LineEdge();
                ps.PointMark = clsBase.Mark();
                ps.PointMark.WordFont.Size = 3;
                this.LayerModeViewSettings.PointLineShape = ps;
                this.LayerModeViewSettings.PolygonDummy_ClipSet_F =false;
                this.LayerModeViewSettings.LabelMode.initDataSet()
                this.LayerModeViewSettings.GraphMode.initDataSet()
                break;
            }
            case enmLayerType.Trip:
                break;
            case enmLayerType.Trip_Definition:
                break;
        }
    }

    //通常のデータの最初の位置を返す。存在しない場合は-1を返す
    getFirstNormalDataItem(): number {
        for (let i = 0; i < this.atrData.Data.length; i++) {
            const dataItem = this.atrData.Data[i];
            if (dataItem.DataType === enmAttDataType.Normal) {
                return i;
            }
        }
        return -1;
    }
}

class strScreen_Setting_Data_Info {
    //画面設定保存用
    title: string = "";
    frmPrint_FormSize: rectangle = new rectangle();
    ScrView: rectangle = new rectangle();
    Screen_Margin: ScreenMargin = new ScreenMargin();
    Accessory_Base: number = 0;//enmBasePosition
    MapScale: strScale_Attri = new strScale_Attri();
    MapTitle: strTitle_Attri = new strTitle_Attri();
    DataNote: strNote_Attri = new strNote_Attri();
    AttMapCompass: strCompass_Attri = new strCompass_Attri();
    MapLegend: strLegend_Attri = new strLegend_Attri();
    ThreeDMode: strThreeDMode_Set = new strThreeDMode_Set();
    
    Clone(): strScreen_Setting_Data_Info {
        const d = new strScreen_Setting_Data_Info();
        Object.assign(d, this);
        d.frmPrint_FormSize = this.frmPrint_FormSize.Clone();
        d.ScrView = this.ScrView.Clone();
        d.Screen_Margin = this.Screen_Margin.Clone();
        d.MapScale = this.MapScale.Clone();
        d.MapTitle = this.MapTitle.Clone();
        d.DataNote = this.DataNote.Clone();
        d.AttMapCompass = this.AttMapCompass.Clone();
        d.MapLegend = this.MapLegend.Clone();
        d.ThreeDMode = this.ThreeDMode.Clone();
        return d;
    }
}

class strOverLay_DataSet_Item_Info {
    Layer: number = 0;
    DataNumber: number = 0;
    Print_Mode_Layer: number = 0;//enmLayerMode_Number
    Mode: number = 0;//enmSoloMode_Number
    Legend_Print_Flag: boolean = false;//Boolean
 //   this.TileMapf;//Boolean
 //   this.TileData;//strTileMapViewDataInfo使用しない
    
    Clone(): strOverLay_DataSet_Item_Info {
        const d = new strOverLay_DataSet_Item_Info();
        Object.assign(d, this);
        return d;
    }
}

// <summary>
// 重ね合わせモードの個別データセットに関するデータ
// </summary>
// <remarks></remarks>
class strOverLay_Dataset_Info {
    title: string = "";
    SelectedIndex: number = -1;
    DataItem: strOverLay_DataSet_Item_Info[] = [];// strOverLay_DataSet_Item_Info
    Note: string = "";
    
    initData(): void {
        this.SelectedIndex = -1;
        this.title = "";
        this.DataItem = [];// strOverLay_DataSet_Item_Info
        this.Note = "";
    }
    
    Clone(): strOverLay_Dataset_Info {
        const d = new strOverLay_Dataset_Info();
        Object.assign(d, this);
        d.DataItem = this.DataItem.map(item => {
            const newItem = new strOverLay_DataSet_Item_Info();
            Object.assign(newItem, item);
            return newItem;
        });
        return d;
    }
}

// 重ね合わせモード全体のデータ
class strOverLayMOde_Dataset_Info {
    SelectedIndex: number = 0;
    DataSet: strOverLay_Dataset_Info[] = []; // strOverLay_Dataset_Info)
    // 常に重ねる設定のデータセット・存在しない場合は-1
    Always_Overlay_Index: number = -1;
    MarkModePosFixFlag: boolean = false;
    
    initDataSet(): void {
        this.Always_Overlay_Index = -1;
        this.SelectedIndex = 0;
        this.MarkModePosFixFlag = false;
        this.DataSet = []; // strOverLay_Dataset_Info)
        this.AddDataSet();
    }
    
    AddDataSet(): void {
        const d = new strOverLay_Dataset_Info();
        this.DataSet.push(d);
    }
}

class strSeries_DataSet_Item_Info {//連続表示モード
    Layer: number = 0;
    Data: number = 0;
    Print_Mode_Total: number = 0;// enmTotalMode_Number
    Print_Mode_Layer: number = 0;// enmLayerMode_Number
    SoloMode: number = 0;// enmSoloMode_Number
    
    Clone(): strSeries_DataSet_Item_Info {
        const d = new strSeries_DataSet_Item_Info();
        Object.assign(d, this);
        return d;
    }
}

// 連続表示モードの個別データセットの構造体
class strSeries_Dataset_Info {
    title: string = "";
    SelectedIndex: number = -1;
    DataItem: strSeries_DataSet_Item_Info[] = []; //  strSeries_DataSet_Item_Info

    initData(): void {
       this.SelectedIndex = 0;
       this.title = "";
       this.DataItem = [];// List(Of strSeries_DataSet_Item_Info)
    }
    
    AddData(LayerIndex: number, DataIndex: number, TotalDataViewMode: number, LayerDataVieMode: number, SoloViewMode: number): void {
        const d = new strSeries_DataSet_Item_Info();
        d.Layer = LayerIndex;
        d.Data = DataIndex;
        d.Print_Mode_Total = TotalDataViewMode;
        d.Print_Mode_Layer = LayerDataVieMode;
        d.SoloMode = SoloViewMode;
        this.DataItem.push(d);
    }
    
    Clone(): strSeries_Dataset_Info {
        const d = new strSeries_Dataset_Info();
        Object.assign(d, this);
        for (const i in d.DataItem) {
            d.DataItem.push(this.DataItem[i].Clone());
        }
        return d;
    }
}

// 連続表示モード全体の構造体
class strSeriesMode_Dataset_Info {
    SelectedIndex: number = 0;
    DataSet: strSeries_Dataset_Info[] = []; //  strSeries_Dataset_Info)
    
    initDataSet(): void {
        this.SelectedIndex = 0;
        this.DataSet = []; //  strSeries_Dataset_Info)
        this.AddDataSet();
    }
    
    AddDataSet(): void {
        const d = new strSeries_Dataset_Info();
        this.DataSet.push(d);
    }
}

class strTotalMode_Info {
    OverLay: strOverLayMOde_Dataset_Info = new strOverLayMOde_Dataset_Info();
    Series: strSeriesMode_Dataset_Info = new strSeriesMode_Dataset_Info();
}

//欠損値の設定（属性データ）
class strMissing_set {
    Print_Flag: boolean = false; //Boolean
    Text: string = ""; //String
    PaintTile: Tile_Property = new Tile_Property();
    Mark: Mark_Property = new Mark_Property();
    BlockMark: Mark_Property = new Mark_Property();
    ClassMark: Mark_Property = new Mark_Property();
    MarkBar: Mark_Property = new Mark_Property();
    TurnMark: Mark_Property = new Mark_Property();
    Label: string = ""; //String
    LineShape: Line_Property = new Line_Property();
    
    Clone(): strMissing_set {
        const d = new strMissing_set();
        Object.assign(d, this);
        d.PaintTile = this.PaintTile.Clone();
        d.Mark = this.Mark.Clone();
        d.BlockMark = this.BlockMark.Clone();
        d.ClassMark = this.ClassMark.Clone();
        d.MarkBar = this.MarkBar.Clone();
        d.TurnMark = this.TurnMark.Clone();
        d.LineShape = this.LineShape.Clone();
        return d;
    }
}

//代表点と記号表示位置を結ぶデータ（属性データ）
class strSymbol_Lien_Data {
    Visible: boolean = false;
    Line: Line_Property = new Line_Property();
    
    Clone(): strSymbol_Lien_Data {
        const d = new strSymbol_Lien_Data();
        d.Visible = this.Visible;
        d.Line = this.Line.Clone();
        return d;
    }
}

//属性データ基本値（属性データ）
class strBasic_Data {
    Lay_Maxn: number = 0; //Integer
    // 選択中のレイヤ番号
    SelectedLayer: number = 0; //Integer
    Print_Mode_Total: number = 0; //enmTotalMode_Number '0:データ表示 1:重ね合わせ 2:連続
    Comment: string = ""; //String
    MDRFileVersion: number = 0; //Single
    FileName: string = ""; //String
    FullPath: string = ""; //String
    DataSourceType: number = 0; //enmDataSource
    
    Clone(): strBasic_Data {
        const d = new strBasic_Data();
        Object.assign(d, this);
        return d;
    }
}

const enmCondition={
    Less : 0,
    LessEqual : 1,
    Equal : 2,
    GreaterEqual : 3,
    Greater : 4,
    NotEqual : 5,
    Include : 6,
    Exclude : 7,
    Head : 8,
    Foot : 9
}
// var enmConditionAnd_Or={ // globals.d.tsで定義済み
//     _And : 0,
//     _Or :1
// }
class strCondition_Limitation_Info {
    Data: number = 0;// Integer
    Condition: number = 0;// enmCondition
    Val: string = ""; // String
    
    Clone(): strCondition_Limitation_Info {
        const d = new strCondition_Limitation_Info();
        Object.assign(d, this);
        return d;
    }
}
class strCondition_Data_Info {
    And_OR: number = 0;//enmConditionAnd_Or
    Condition: strCondition_Limitation_Info[] = [];//strCondition_Limitation_Info
    
    Clone(): strCondition_Data_Info {
        const d = new strCondition_Data_Info();
        d.And_OR = this.And_OR;
        d.Condition = Generic.ArrayClone(this.Condition);
        return d;
    }
}

class strCondition_DataSet_Info {
    Enabled: boolean = false;// Boolean
    Layer: number = 0; // Integer
    Name: string = ""; // String
    Condition_Class: strCondition_Data_Info[] = []; // List(Of strCondition_Data_Info) '（条件の段階別の条件スタック）
    
    Clone(): strCondition_DataSet_Info {
        const d = new strCondition_DataSet_Info();
        Object.assign(d, this);
        d.Condition_Class = Generic.ArrayClone(this.Condition_Class);
        return d;
    }
}

// 図形データの基本型（FigureStacで使用される図形オブジェクト）
interface FigureData {
    StringPos?: point[]; // Word Data用
    Points?: point[]; // Line/Point Data用
    NumOfPoint?: number; // Line Data用（点数）
    Position?: point; // Circle/Point Data用
}

// 有効な地図ラインの型（LineCodeプロパティを持つ）
interface _EnableMPLine {
    LineCode: number;
    [key: string]: JsonValue;
}

// トリップオブジェクトデータの型
interface TripObjData {
    TripPersonName: string;
    TripPersonCode: number;
    PositionObjName: string;
    LatLon?: latlon;
}

// 座標系の結果型
interface ZahyoResult {
    ok: boolean;
    emes?: string;
}

// データ読み込み結果型
interface DataLoadResult {
    ok: boolean;
    emes: string;
}

//属性データ全体に関わるデータ（属性データ）
class Total_Data_Info {
    LV1: strBasic_Data = new strBasic_Data();
    TotalMode: strTotalMode_Info = new strTotalMode_Info();
    ViewStyle: strViewStyle_Info = new strViewStyle_Info();
    FigureStac: FigureData[] = [];
    Condition: strCondition_DataSet_Info[] = [];//strCondition_DataSet_Info

    initTotalData(): void {
        this.TotalMode.OverLay.initDataSet();
        this.TotalMode.Series.initDataSet();
        this.ViewStyle.initViewStyle();
        this.FigureStac = [];
        this.Condition = [];
    }
}

export class strDummyObjectPointMark_Info {
    ObjectKindName: string = ""; //String
    Mark: Mark_Property = new Mark_Property(); //Mark_Property
    
    Clone(): strDummyObjectPointMark_Info {
        const d = new strDummyObjectPointMark_Info();
        d.ObjectKindName = this.ObjectKindName;
        d.Mark = this.Mark.Clone();
        return d;
    }
}

class strLegend_Base_Attri {
    Visible: boolean = false; //Boolean
    Legend_Num: number = 0; //Integer
    Font: Font_Property = new Font_Property();
    Back: BackGround_Box_Property = new BackGround_Box_Property();
    LegendXY: point[] = []; // PointF
    Comma_f: boolean = false; //Boolean
    ModeValueInScreenFlag: boolean = false;
    
    Clone(): strLegend_Base_Attri {
        const d = new strLegend_Base_Attri();
        Object.assign(d, this);
        d.Font = this.Font.Clone();
        d.Back = this.Back.Clone();
        d.LegendXY = Generic.ArrayClone(this.LegendXY);
        return d;
    }
}

// enmCircleMDLegendLine はglobals.d.tsで定義済み

class strClassBoundaryLine_Info {
    Visible: boolean = false;
    LPat: Line_Property = new Line_Property();
    
    Clone(): strClassBoundaryLine_Info {
        const d = new strClassBoundaryLine_Info();
        d.Visible = this.Visible;
        d.LPat = this.LPat.Clone();
        return d;
    }
}
class strLegend_Class_Attri {
    PaintMode_Line: Line_Property = new Line_Property();
    PaintMode_Method: number = 0; //enmClassMode_Meshod
    CategorySeparate_f: boolean = false; //Boolean
    PaintMode_Width: number = 0; //Single
    ClassMarkFrame_Visible: boolean = false; //Boolean
    SeparateClassWords: number = 0; //enmSeparateClassWords
    SeparateGapSize: number = 0; //Single
    ClassBoundaryLine: strClassBoundaryLine_Info = new strClassBoundaryLine_Info();
    FrequencyPrint: boolean = false; //Boolean
    
    Clone(): strLegend_Class_Attri {
        const d = new strLegend_Class_Attri();
        Object.assign(d, this);
        d.PaintMode_Line = this.PaintMode_Line.Clone();
        d.ClassBoundaryLine = this.ClassBoundaryLine.Clone();
        return d;
    }
}

class strLegend_Mark_Attri {
    CircleMD_CircleMini_F: boolean = false; //Boolean
    MultiEnMode_Line: Line_Property = new Line_Property();
    
    Clone(): strLegend_Mark_Attri {
        const d = new strLegend_Mark_Attri();
        Object.assign(d, this);
        return d;
    }
}

class strLegend_Line_Dummy_Attri {
    Line_Visible: boolean = false; //Boolean
    Line_Visible_Number_STR: string = ""; //String '線種ごとに表示するかどうか、１は表示０は非表示で連続文字列
    Line_Pattern: number = 0; //enmCircleMDLegendLine
    Dummy_Point_Visible: boolean = false; //Boolean
    Back: BackGround_Box_Property = new BackGround_Box_Property();
    
    Clone(): strLegend_Line_Dummy_Attri {
        const d = new strLegend_Line_Dummy_Attri();
        Object.assign(d, this);
        d.Back = this.Back.Clone();
        return d;
    }
}

class strOverLay_Legend_Title_Info {
    Print_f: boolean = false;
    MaxWidth: number = 0;
    
    Clone(): strOverLay_Legend_Title_Info {
        const d = new strOverLay_Legend_Title_Info();
        Object.assign(d, this);
        return d;
    }
}  

class strLegend_Attri {
    Base: strLegend_Base_Attri = new strLegend_Base_Attri();
    OverLay_Legend_Title: strOverLay_Legend_Title_Info = new strOverLay_Legend_Title_Info();
    ClassMD: strLegend_Class_Attri = new strLegend_Class_Attri();
    MarkMD: strLegend_Mark_Attri = new strLegend_Mark_Attri();
    Line_DummyKind: strLegend_Line_Dummy_Attri = new strLegend_Line_Dummy_Attri();
    En_Graph_Pattern: number = 0; //enmMultiEnGraphPattern
    
    Clone(): strLegend_Attri {
        const d = new strLegend_Attri();
        d.Base = this.Base.Clone();
        d.OverLay_Legend_Title = this.OverLay_Legend_Title.Clone();
        d.ClassMD = this.ClassMD.Clone();
        d.MarkMD = this.MarkMD.Clone();
        d.Line_DummyKind = this.Line_DummyKind.Clone();
        d.En_Graph_Pattern = this.En_Graph_Pattern; //enmMultiEnGraphPattern
        return d;
    }
}
class strLatLonLine_Print_Info {
    Visible: boolean = false;
    Order: number = 0;//enmLatLonLine_Order
    Lat_Interval: number = 0;
    Lon_Interval: number = 0;
    LPat: Line_Property = new Line_Property();
    OuterPat: Line_Property = new Line_Property();
    Equator: Line_Property = new Line_Property();
    
    Clone(): strLatLonLine_Print_Info {
        const d = new strLatLonLine_Print_Info();
        Object.assign(d, this);
        d.LPat = this.LPat.Clone();
        d.OuterPat = this.OuterPat.Clone();
        d.Equator = this.Equator.Clone();
        return d;
    }
}

class strAccessoryGroupBox_Info {
    Visible: boolean = false;  // Boolean
    Back: BackGround_Box_Property = new BackGround_Box_Property();
    Title: boolean = false;  // Boolean
    Comapss: boolean = false;  // Boolean
    Scale: boolean = false;  // Boolean
    Legend: boolean = false;  // Boolean
    Note: boolean = false;  // Boolean
    LinePattern: boolean = false;  // Boolean
    ObjectGroup: boolean = false;  // Boolean
    
    Clone(): strAccessoryGroupBox_Info {
        const d = new strAccessoryGroupBox_Info();
        Object.assign(d, this);
        d.Back = this.Back.Clone();
        return d;
    }
}

class strScreen_Back_data {
    MapAreaFrameLine: Line_Property = new Line_Property();
    ScreenFrameLine: Line_Property = new Line_Property();
    ScreenAreaBack: Tile_Property = new Tile_Property();
    MapAreaBack: Tile_Property = new Tile_Property();
    ObjectInner: Tile_Property = new Tile_Property();

    Clone(): strScreen_Back_data {
        const d = new strScreen_Back_data();
        d.MapAreaFrameLine = this.MapAreaFrameLine.Clone();
        d.ScreenFrameLine = this.ScreenFrameLine.Clone();
        d.ScreenAreaBack = this.ScreenAreaBack.Clone();
        d.MapAreaBack = this.MapAreaBack.Clone();
        d.ObjectInner = this.ObjectInner.Clone();
        return d;
    }
}

class strValueShow_Info {
    ValueVisible: boolean = false;//Boolean
    ValueFont: Font_Property = new Font_Property();
    DecimalSepaF: boolean = false;//Boolean
    DecimalNumber: number = 0;
    ObjNameVisible: boolean = false;//Boolean
    ObjNameFont: Font_Property = new Font_Property();
    
    Clone(): strValueShow_Info {
        const d = new strValueShow_Info();
        d.ValueVisible = this.ValueVisible;
        d.ValueFont = this.ValueFont.Clone();
        d.DecimalSepaF = this.DecimalSepaF;
        d.DecimalNumber = this.DecimalNumber;
        d.ObjNameVisible = this.ObjNameVisible;
        d.ObjNameFont = this.ObjNameFont.Clone();
        return d;
    }
}

class strSouByou_Info {
    Auto: boolean = false;
    AutoDegree: number = 0; // 1-5の値
    ThinningPrint_F: boolean = false;
    PointInterval: number = 0;
    LoopAreaF: boolean = false;
    LoopSize: number = 0;
    Spline_F: boolean = false;

    Clone(): strSouByou_Info {
        const d = new strSouByou_Info();
        Object.assign(d, this);
        return d;
    }
}

//飾りの設定を保持（属性データ）
class strViewStyle_Info {
    ScrData: Screen_info = new Screen_info();
    MapScale: strScale_Attri = new strScale_Attri();
    MapTitle: strTitle_Attri = new strTitle_Attri();
    DataNote: strNote_Attri = new strNote_Attri();
    AttMapCompass: strCompass_Attri = new strCompass_Attri();
    MapLegend: strLegend_Attri = new strLegend_Attri();
    FigureVisible: boolean = false;
    AccessoryGroupBox: strAccessoryGroupBox_Info = new strAccessoryGroupBox_Info();
    Missing_Data: strMissing_set = new strMissing_set();
    Screen_Back: strScreen_Back_data = new strScreen_Back_data();
    SymbolLine: strSymbol_Lien_Data = new strSymbol_Lien_Data();
    Trip_Line: JsonObject | undefined; // strTrip_Line_Data (未定義)
    PointPaint_Order: number = 0; // enmPointOnjectDrawOrder
    Dummy_Size_Flag: boolean = false;
    MeshLine: Line_Property = new Line_Property();
    TileLicenceFont: Font_Property = new Font_Property();
    ObjectLimitationF: boolean = false;
    InVisibleObjectBoundaryF: boolean = false;
    // Key:地図ファイル、Value:点オブジェクトのダミー表示時記号
    DummyObjectPointMark: Record<string, strDummyObjectPointMark_Info[]> = {};
    MapPrint_Flag: boolean = false;
    LatLonLine_Print: strLatLonLine_Print_Info = new strLatLonLine_Print_Info();
    SouByou: strSouByou_Info = new strSouByou_Info();
    TileMapView: strTileMapViewInfo = new strTileMapViewInfo();
    Screen_Setting: strScreen_Setting_Data_Info[] = [];
    ValueShow: strValueShow_Info = new strValueShow_Info();
    Zahyo: Zahyo_info = new Zahyo_info();

    Clone(): strViewStyle_Info {
        const d = new strViewStyle_Info();
        d.ScrData = this.ScrData.Clone();
        d.MapScale = this.MapScale.Clone();
        d.MapTitle = this.MapTitle.Clone();
        d.DataNote = this.DataNote.Clone();
        d.AttMapCompass = this.AttMapCompass.Clone();
        d.MapLegend = this.MapLegend.Clone();
        d.FigureVisible = this.FigureVisible;
        d.AccessoryGroupBox = this.AccessoryGroupBox.Clone();
        d.Missing_Data = this.Missing_Data.Clone();
        d.Screen_Back = this.Screen_Back.Clone();
        d.SymbolLine = this.SymbolLine.Clone();
        //  d.Trip_Line =  this.Trip_Line; // =  new strTrip_Line_Data
        d.PointPaint_Order = this.PointPaint_Order; //enmPointOnjectDrawOrder
        d.Dummy_Size_Flag = this.Dummy_Size_Flag; //Boolean
        d.MeshLine = this.MeshLine.Clone();
        d.TileLicenceFont = this.TileLicenceFont.Clone();
        d.ObjectLimitationF = this.ObjectLimitationF; //Boolean
        d.InVisibleObjectBoundaryF = this.InVisibleObjectBoundaryF; //Boolean
        d.DummyObjectPointMark = {};
        for (const key in this.DummyObjectPointMark) {
            d.DummyObjectPointMark[key] = [...this.DummyObjectPointMark[key]];
        }
        d.MapPrint_Flag = this.MapPrint_Flag; //Boolean
        
        d.SouByou = this.SouByou.Clone();
        d.LatLonLine_Print = this.LatLonLine_Print.Clone();
        d.TileMapView = this.TileMapView.Clone();

        d.Screen_Setting = Generic.ArrayClone(this.Screen_Setting);
        d.ValueShow = this.ValueShow.Clone();
        d.Zahyo = this.Zahyo.Clone();
        return d;
    }

    initViewStyle(): void {
        const state = appState();
    const md = this.Missing_Data;
    md.Print_Flag = true;
    md.Text = "欠損値";
    md.PaintTile = clsBase.Tile();
    md.PaintTile.BlankF = true;
    md.Mark = clsBase.Mark();
    md.Mark.ShapeNumber = 6
    md.BlockMark = clsBase.Mark();
    md.BlockMark.Tile.Color = new colorRGBA(255, 255, 255);
    md.BlockMark.ShapeNumber = 6;
    md.ClassMark = clsBase.Mark();
    md.ClassMark.wordmark = "NA";
    md.ClassMark.WordFont.Color = new colorRGBA(0, 0, 0);
    md.ClassMark.PrintMark = enmMarkPrintType.Word;
    md.BlockMark.ShapeNumber = 6;
    md.MarkBar = clsBase.Mark();
    md.MarkBar.ShapeNumber = 6;
    md.MarkBar.Tile.Color = new colorRGBA(255, 255, 255);
    md.Label = "欠損値";

    this.SymbolLine.Visible = false;
    this.SymbolLine.Line = clsBase.Line();
    this.Dummy_Size_Flag = true;

    const sb = this.SouByou;
    sb.Auto=true;
    sb.AutoDegree=2;
    sb.LoopSize = 0;
    sb.PointInterval = 0;
    sb.Spline_F = false;
    sb.ThinningPrint_F = false;
    sb.LoopAreaF = false;


    const tb = this.TileMapView;
    tb.Visible = false;
    tb.TileMapDataSet = state.tileMapClass.getTileMapData('k_cj4');
    tb.AlphaValue = 0.8;
    tb.DrawTiming = enmDrawTiming.BeforeDataDraw;

    const sm = this.ScrData.Screen_Margin;
    sm.rect=new rectangle( 4,20, 4.5 ,10);
    sm.ClipF = false;
    const st = this.ScrData.ThreeDMode;
    st.Set3D_F = false;
    st.Pitch = 65;
    st.Head = 0;
    st.Bank = 0;
    st.Expand = 100;
    this.ScrData.Accessory_Base = enmBasePosition.Screen;

    this.MapPrint_Flag = true;
    this.FigureVisible = true;
    this.MapLegend = new strLegend_Attri();
    const ml = this.MapLegend;
    ml.En_Graph_Pattern = enmMultiEnGraphPattern.multiCircle;
    const mlb = ml.Base;
    mlb.Visible = true;
    mlb.Comma_f = true;
    mlb.Font = clsBase.Font();
    mlb.Font.Size = 3.5;
    mlb.Back = clsBase.WhiteBackground();
    mlb.ModeValueInScreenFlag = false;
    mlb.Back.Line.Edge_Connect_Pattern.Edge_Pattern = enmEdge_Pattern.Rectangle;
    mlb.Back.Line.Edge_Connect_Pattern.Join_Pattern = enmJoinPattern.Miter;
    mlb.Legend_Num = 1;
    mlb.LegendXY = [];

    ml.OverLay_Legend_Title.Print_f = true;
    ml.OverLay_Legend_Title.MaxWidth = 30

    const cmd = ml.ClassMD;
    cmd.PaintMode_Line = clsBase.Line();
    cmd.PaintMode_Line.Edge_Connect_Pattern.Edge_Pattern = 1;
    cmd.PaintMode_Line.Edge_Connect_Pattern.Join_Pattern = 2;
    cmd.PaintMode_Method = enmClassModE_Meshod.Noral;
    cmd.CategorySeparate_f = true;
    cmd.PaintMode_Width = 1.2;
    cmd.SeparateGapSize = 0.2;
    cmd.ClassMarkFrame_Visible = false;
    cmd.SeparateClassWords = enmSeparateClassWords.Japanese;
    cmd.FrequencyPrint = false;
    cmd.ClassBoundaryLine.Visible = false;
    cmd.ClassBoundaryLine.LPat = clsBase.BoldLine();
    cmd.ClassBoundaryLine.LPat.Width=0.5;
    cmd.ClassBoundaryLine.LPat.Color = new colorRGBA(0xbf, 0, 0, 255);

    ml.MarkMD.MultiEnMode_Line = clsBase.Line();
    ml.MarkMD.CircleMD_CircleMini_F = true;

    ml.Line_DummyKind.Line_Visible =false;
    ml.Line_DummyKind.Back=clsBase.WhiteBackground();
    ml.Line_DummyKind.Line_Pattern=enmCircleMDLegendLine.Zigzag;
    ml.Line_DummyKind.Dummy_Point_Visible=false;
    ml.Line_DummyKind.Line_Visible_Number_STR = "" //ここの設定は後で

    const agb = this.AccessoryGroupBox;
    agb.Visible = false;
    agb.Back = clsBase.WhiteBackground();
    agb.Back.Line.BlankF = false;
    agb.Back.Line.Color = new colorRGBA(180, 180, 180, 255);
    agb.Legend = true;
    agb.Title = true;
    agb.Comapss = true;
    agb.Scale = true;
    agb.ObjectGroup = true;
    agb.LinePattern = true;
    agb.Note = true;

    const mtl = this.MapTitle;
    mtl.Visible = true;
    mtl.MaxWidth = 70;
    mtl.Font = clsBase.Font();
    mtl.Font.Size = 5;
    mtl.Font.Back = clsBase.WhiteBackground();

    const mdn = this.DataNote;
    mdn.Visible = true;
    mdn.MaxWidth = 20;
    mdn.Font = clsBase.Font();
    mdn.Font.Size = 2.5;
    mdn.Font.Back = clsBase.WhiteBackground();

    const msl = this.MapScale;
    msl.Visible = true;
    msl.Font = clsBase.Font();
    msl.Font.Size = 3.5;
    msl.BarAuto = true;
    msl.BarPattern = enmScaleBarPattern.Thin;
    msl.BarDistance = 0;
    msl.BarKugiriNum = 2;
    msl.Back = clsBase.WhiteBackground();
    msl.Back.Line = clsBase.BlankLine();
    msl.Unit = enmScaleUnit.kilometer;

    const mll = this.LatLonLine_Print;
    //緯度経度地図データの場合は，initTotalData_andOtherで設定
    mll.Visible = false;
    mll.Order = 0;
    mll.LPat = clsBase.Line();
    mll.LPat.Color = new colorRGBA(200, 200, 200);
    mll.Lat_Interval = 1;
    mll.Lon_Interval = 1;
    mll.OuterPat = clsBase.Line();
    mll.Equator = clsBase.Line();

    const mvs = this.ValueShow;
    mvs.ObjNameVisible = false;
    mvs.ObjNameFont = clsBase.Font();
    mvs.ObjNameFont.Size = 2.5;
    mvs.ObjNameFont.FringeF = true;
    mvs.ObjNameFont.FringeColor = clsBase.ColorWhite();
    mvs.ValueVisible = false;
    mvs.DecimalSepaF = false;
    mvs.DecimalNumber = 0;
    mvs.ValueFont = clsBase.Font();
    mvs.ValueFont.Size = 2.5;
    mvs.ValueFont.FringeF = true;
    mvs.ValueFont.FringeColor = clsBase.ColorWhite();

    this.PointPaint_Order = enmPointOnjectDrawOrder.LowerToUpperCategory;
    this.MeshLine = clsBase.BlankLine();

    const msb = this.Screen_Back;
    msb.MapAreaFrameLine = clsBase.BlankLine();
    msb.MapAreaFrameLine.BlankF = true;
    msb.ScreenFrameLine = clsBase.BlankLine();
    msb.MapAreaBack = clsBase.BlancTile();
    msb.MapAreaBack.Color = new colorRGBA(255, 255, 250);
    msb.ScreenAreaBack = clsBase.BlancTile();
    msb.ScreenAreaBack.Color = new colorRGBA(255, 255, 240);
    msb.ObjectInner = clsBase.BlancTile();
    msb.ObjectInner.BlankF = true;
    msb.ObjectInner.Color = new colorRGBA(210, 255, 210, 255);

    this.Screen_Setting = [];
    this.ObjectLimitationF = false;
    this.InVisibleObjectBoundaryF = true;
    }
}

//スケール設定（属性データ）
class strScale_Attri {
    Visible: boolean = false; //Boolean
    Position: point = new point();
    Font: Font_Property = new Font_Property();
    BarPattern: number = 0; //enmScaleBarPattern
    BarAuto: boolean = false; //Boolean
    BarDistance: number = 0; //Single
    BarKugiriNum: number = 0; //Integer
    Back: BackGround_Box_Property = new BackGround_Box_Property();
    Unit: number = 0; //enmScaleUnit
    
    Clone(): strScale_Attri {
        const s = new strScale_Attri();
        s.Visible = this.Visible;
        s.Position = this.Position.Clone();
        s.Font = this.Font.Clone();
        s.BarPattern = this.BarPattern;
        s.BarAuto = this.BarAuto;
        s.BarDistance = this.BarDistance;
        s.BarKugiriNum = this.BarKugiriNum; //Integer
        s.Back = this.Back.Clone();
        s.Unit = this.Unit;
        return s;
    }
}

//注釈設定（属性データ）
class strNote_Attri {
    Visible: boolean = false; //Boolean
    Position: point = new point();
    MaxWidth: number = 0; //Single
    Font: Font_Property = new Font_Property();
    
    Clone(): strNote_Attri {
        const v = new strNote_Attri();
        v.Visible = this.Visible; //Boolean
        v.Position = this.Position.Clone();
        v.MaxWidth = this.MaxWidth; //Single
        v.Font = this.Font.Clone();
        return v;
    }
}

//タイトル設定（属性データ）
class strTitle_Attri {
    Visible: boolean = false; //Boolean
    Position: point = new point();
    MaxWidth: number = 0; //Single
    Font: Font_Property = new Font_Property();
    
    Clone(): strTitle_Attri {
        const t = new strTitle_Attri();
        t.Visible = this.Visible;
        t.Position = this.Position.Clone();
        t.MaxWidth = this.MaxWidth;
        t.Font = this.Font.Clone();
        return t;
    }
}

class Magnification {
    Xplus: number = 0; // Single
    YPlus: number = 0; // Single
    Mul: number = 1; // Single
    
    Clone(): Magnification {
        const d = new Magnification();
        Object.assign(d, this);
        return d;
    }
}

class ScreenMargin {
    ClipF: boolean = false; //Boolean
    rect: rectangle = new rectangle();
    
    Clone(): ScreenMargin {
        const d = new ScreenMargin();
        d.ClipF = this.ClipF;
        d.rect = this.rect.Clone();
        return d;
    }
}
const enmOutputDevice = {
    Screen: 0,
    Printer: 1,
    EMF: 2
}

//3Dモードの回転の使用（属性データ）
class strThreeDMode_Set {
    Set3D_F: boolean = false; //Boolean
    Pitch: number = 0; //Integer
    Head: number = 0; //Integer
    Bank: number = 0; //Integer
    Expand: number = 0; //Integer
    
    Clone(): strThreeDMode_Set {
        const d = new strThreeDMode_Set();
        Object.assign(d, this);
        return d;
    }
}
class Screen_info {
    FirstScreenMGMul: number = 1; // Single '全体が表示してある場合の拡大係数(MDRには保存しない)
    GSMul: number = 1; // Double '地図サイズに対するウィンドウサイズの比(MDRには保存しない)
    // MapRectangleの面積と同等の正方形の対角線の長さ
    STDWsize: number = 0; // Single
    //  '地図中の画面に表示したい領域（地図座標）
    ScrView: rectangle = new rectangle(); // 旧wx1など
    // 画面領域四隅の地図座標
    ScrRectangle: rectangle = new rectangle(); // 旧S_Wx1など
    // 地図の領域全体の地図座標
    MapRectangle: rectangle = new rectangle(); // 旧F_Wx1など
    // 画面の四隅の座標（0,0,width,bottom）
    MapScreen_Scale: rectangle = new rectangle(); // pictureboxの大きさ.Left=0  .Top=0  .bottom=Scalebottom  .Top=scaleTop
    // 地図座標を画面座標に変換する際の拡大係数とXY座標の平行移動値
    ScreenMG: Magnification = new Magnification(); // 旧mul,xp,yp
    OutputDevide: number = 0; // enmOutputDevice
    PrinterMG: Magnification = new Magnification(); // 旧Prtmul,xp,yp
    PrintPageNum: number = 0;
    PrinterPageSize: size = new size();
    PrintRectangle: rectangle = new rectangle();
    Zahyo: Zahyo_info = new Zahyo_info();
    // 画面上下左右端のマージン
    Screen_Margin: ScreenMargin = new ScreenMargin(); // 画面のマージン
    frmPrint_FormSize: rectangle = new rectangle(); // state.frmPrintのウィンドウ自体の位置とサイズ
    Accessory_Base: number = 0; // enmBasePosition '飾り等のサイズを地図領域でなくpictureboxの大きさに比例させる場合true
    SampleBoxFlag: boolean = false; // Boolean 'サンプルのライン、記号等に表示する際にtrueにする
    ThreeDMode: strThreeDMode_Set = new strThreeDMode_Set();

    init(pictureboxSize: rectangle, picBoxMargin: ScreenMargin, MapAllAreaRect: rectangle, AccessoryBase: number, SCRViewResetF: boolean): void {
        // <param name="picturebox">表示するpictureBoxのsize</param>
        // <param name="picBoxMargin">マージンScreenMargin構造体</param>
        // <param name="MapAllAreaRect">地図領域全体の外接四角形</param>
        // <param name="AccessoryBaseSetScreenFlag">飾り等のサイズを地図領域でなくpictureboxの大きさに比例させる場合true</param>
        // <param name="SCRViewResetF">SCRViewResetFを初期化する場合true</param>
        this.Screen_Margin = picBoxMargin;
        this.MapRectangle = MapAllAreaRect.Clone();
        const SCRS = this.ScrView.Clone();
        this.ScrView = MapAllAreaRect.Clone();
        this.Set_PictureBox_and_CulculateMul(pictureboxSize)
        this.FirstScreenMGMul = this.ScreenMG.Mul;
        if (SCRViewResetF === false) {
            this.ScrView = SCRS;
        }
        
        this.Accessory_Base = AccessoryBase;
        this.STDWsize = Math.sqrt((this.MapRectangle.width()) * (this.MapRectangle.height()));
        this.Get_Screen_BaseMul();
        this.SampleBoxFlag = false;
        this.OutputDevide = enmOutputDevice.Screen;
    }

    Set_PictureBox_and_CulculateMul(Size: rectangle): void {
        const Wwidth = Size.width();
        const Wheight = Size.height();
        const w = Wwidth * (1 - (this.Screen_Margin.rect.left + this.Screen_Margin.rect.right) / 100);
        const H = Wheight * (1 - (this.Screen_Margin.rect.top + this.Screen_Margin.rect.bottom) / 100);

        const FN = w / H;
        const xw = this.ScrView.width();
        const yw = this.ScrView.height();
        const n = xw / yw;
        if (n >= FN) {
            this.ScreenMG.Mul = w / xw;
        } else {
            this.ScreenMG.Mul = H / yw;
        }
        this.ScreenMG.Xplus = (w - xw * this.ScreenMG.Mul) / 2 + Wwidth * this.Screen_Margin.rect.left / 100;
        this.ScreenMG.YPlus = (H - yw * this.ScreenMG.Mul) / 2 + Wheight * this.Screen_Margin.rect.top / 100;
        if (this.OutputDevide !== enmOutputDevice.Printer) {
            this.MapScreen_Scale = new rectangle(0, 0, Wwidth, Wheight);
            this.ScrRectangle = new rectangle(this.getSRX(0), this.getSRY(0), this.getSRX(Wwidth), this.getSRY(Wheight));
        } else {
            this.OutputDevide = enmOutputDevice.Screen;
            this.ScrRectangle = new rectangle(this.getSRX(0), this.getSRY(0), this.getSRX(Wwidth), this.getSRY(Wheight));
            this.OutputDevide = enmOutputDevice.Printer;
            this.MapScreen_Scale = new rectangle(0, 0, this.ScrRectangle.width(), this.ScrRectangle.height());
        }
        this.Get_Screen_BaseMul();
    }

    //地図サイズに対する表示領域サイズの比を求める
    Get_Screen_BaseMul(): void {
        if (this.Accessory_Base === enmBasePosition.Screen) {
            const s = Math.sqrt(this.ScrView.width() * this.ScrView.height());
            this.GSMul = s / this.STDWsize;
        } else {
            this.GSMul = 1;
        }
    }

    //画面上のピクセルが地図中の何パーセントに当たるか計算
    Get_Length_On_BaseMap(Pixcel: number): number {
        let a = Pixcel / this.STDWsize * 100 / this.ScreenMG.Mul / this.GSMul;
        if (this.OutputDevide === enmOutputDevice.Printer) {
            a = a / this.PrinterMG.Mul;
        }
        return a;
    }

    //パーセントのサイズが，画面上で何ピクセルかを取得
    Get_Length_On_Screen(Percentage: number): number {
        if (this.SampleBoxFlag === false) {
            let RR = this.STDWsize * Percentage / 100 * this.ScreenMG.Mul * this.GSMul
            if (this.OutputDevide === enmOutputDevice.Printer) {
                RR = RR * this.PrinterMG.Mul
            }
            return (RR);
        } else {
            return (this.STDWsize * Percentage / 100 * this.FirstScreenMGMul)
        }
    }
    //最大値に占める指定値の割合に面積比例する画面半径を返す
    Radius(R_Percent: number, Value: number, max_Value: number): number {
        let RR;
        if (max_Value === 0) {
            RR = 0;
        } else {
            RR = this.STDWsize * R_Percent * this.GSMul / 100 * this.ScreenMG.Mul * Math.sqrt(Value) / Math.sqrt(max_Value) / 2;
        }
        return Math.floor(RR)
    }

    //地図X座標をスクリーン座標に
    getSx(x: number): number {
        const nx = (x - this.ScrView.left) * this.ScreenMG.Mul + this.ScreenMG.Xplus;
        return nx;
    }

    //地図Y座標をスクリーン座標に
    getSy(y: number): number {
        return (y - this.ScrView.top) * this.ScreenMG.Mul + this.ScreenMG.YPlus;
    }

    //回転を考慮して地図座標列をスクリーン座標に変換
    Get_SxSy_With_3D(Pnum: number, inXY: point[], ReverseGetF: boolean): point[];
    Get_SxSy_With_3D(Point: point): point;
    Get_SxSy_With_3D(p1: number | point | point[] | rectangle, p2?: point[] | boolean, p3?: boolean): point | point[] | rectangle {
        if ((typeof p1) === 'number') {
            const Pnum = p1;
            const inXY = p2 as point[];
            const ReverseGetF = p3 as boolean;
            if (this.ThreeDMode.Set3D_F === true) {
                const XYPara = Math.sqrt((this.MapRectangle.width()) ** 2 + (this.MapRectangle.height()) ** 2);
                const TurnCenter = this.MapRectangle.centerP();
                const INXY2 = [];
                for (let i = 0; i < Pnum; i++) {
                    INXY2.push(spatial.Trans3D(inXY[i].x, inXY[i].y, 0, TurnCenter, this.ThreeDMode.Expand, this.ThreeDMode.Pitch, this.ThreeDMode.Head, this.ThreeDMode.Bank, XYPara));
                }
                return this.getSxSyArray(Pnum, INXY2, ReverseGetF, true);
            } else {
                const nxy = this.getSxSyArray(Pnum, inXY, ReverseGetF, true);
                return nxy;
            }
        } else if ((p1 instanceof Array) === true) {
            const meshP = [];
            for (let i = 0; i < 4; i++) {
                meshP.push(p1[i].Clone());
            }
            meshP.push(p1[0].Clone());
            return this.Get_SxSy_With_3D(5, meshP, false);
        } else if ((p1 instanceof rectangle) === true) {
            const rect = p1 as rectangle;
            const meshP: point[] = [];
            meshP[0] = new point(rect.left, rect.top);
            meshP[1] = new point(rect.right, rect.top);
            meshP[2] = new point(rect.right, rect.bottom);
            meshP[3] = new point(rect.left, rect.bottom);
            const pxy = this.Get_SxSy_With_3D(4, meshP, false);
            let minx = pxy[0].x;
            let maxx = pxy[0].x;
            let miny = pxy[0].y;
            let maxy = pxy[0].y;
            for (let i = 1; i < pxy.length; i++) {
                minx = Math.min(minx, pxy[i].x)
                maxx = Math.max(maxx, pxy[i].x)
                miny = Math.min(miny, pxy[i].y)
                maxy = Math.max(maxy, pxy[i].y)
            }
            const ret = new rectangle(minx, miny, maxx, maxy);
            return ret;
        } else if ((p1 instanceof point) === true) {
            const P = [(p1 as point).Clone()];
            const Pout = this.Get_SxSy_With_3D(1, P, false);
            return Pout[0];
        }
    }

    //画面上のピクセル数に対応する地図座標のサイズを取得
    Get_MapDataSize_from_ScreenPixcel(Pixcel: number): number {
        return Pixcel / this.ScreenMG.Mul;
    }

    //余白の四角形を取得
    getSXSY_Margin(): rectangle {
        const p1 = new point(this.Screen_Margin.rect.left / 100, this.Screen_Margin.rect.top / 100);
        const p2 = new point(1 - this.Screen_Margin.rect.right / 100, 1 - this.Screen_Margin.rect.bottom / 100);
        const pp1 = this.getSxSy(this.getSRXYfromRatio(p1));
        const pp2 = this.getSxSy(this.getSRXYfromRatio(p2));
        const marginRect = new rectangle(pp1.x, pp2.x, pp1.y, pp2.y);;
        return marginRect;
    }

    //元々の座標を地図座標経由してスクリーン座標XYに変換
    getSxSy(Point: point): point {
        const newP = new point(this.getSx(Point.x), this.getSy(Point.y))
        return newP;
    }

    /** 元々の四角形座標を地図座標経由してスクリーン座標XYに変換*/
    getSxSyRect(rect: rectangle): rectangle {
        const L  = new point(rect.left, rect.top);
        const R  = new point(rect.right, rect.bottom);
        const LC  = this.getSxSy(L)
        const RC  = this.getSxSy(R)
        return new rectangle(LC.x,RC.x, LC.y,  RC.y);
    }

    getSxSyArray(n: number, XY: point[], ReverseGetF: boolean, SamePointCheck: boolean): point[] {
        let j;
        let jp;
        const XY2 = [];
        if (ReverseGetF === false) {
            j = 0;
            jp = 1;
        } else {
            j = n - 1;
            jp = -1;
        }

        if (SamePointCheck === true) {
            XY2[0] = this.getSxSy(XY[j]);
            j += jp;
            let newP = 1;
            for (let i = 1; i < n; i++) {
                const nXY = this.getSxSy(XY[j]);
                if (nXY.Equals(XY2[newP - 1]) === false) {
                    //一つ前のポイントとスクリーン座標が違う場合は追加する
                    XY2.push(nXY);
                    newP++;
                }
                j += jp;
            }
            if ((newP === 1) && (n > 1)) {
                //短い線で1点になってしまう場合
                newP++;
                XY2[1] = XY2[0].Clone();
            }
        } else {
            for (let i = 0; i < n; i++) {
                XY2[i] =this.getSxSy(XY[j]);
                j += jp;
            }
        }
        return XY2;
    }

    getSRX(x: number): number {
        const newx = (x - this.ScreenMG.Xplus) / this.ScreenMG.Mul + this.ScrView.left;
        return newx;
    }

    getSRY(y: number): number {
        const newy = (y - this.ScreenMG.YPlus) / this.ScreenMG.Mul + this.ScrView.top;
        return newy;
    }

    getSRXY(P: point): point {
        const newx = this.getSRX(P.x);
        const newy = this.getSRY(P.y);
        return new point(newx, newy);
    }

    //線幅を返す（線幅が0の場合は最小値に）
    Get_Line_Width(Percentage: number): number {
        if (Percentage === 0) {
            return (appState().settingData.MinimumLineWidth*0.2+0.1);
        } else {
            return this.Get_Length_On_Screen(Percentage);
        }
    }

    //画面の上下の位置の相対比(0～1)から画面座標を返す
    getSxSyfromRatio(p: point): point {
        const P2 = new point();
        P2.x = this.ScrRectangle.left + this.ScrRectangle.width() * p.x;
        P2.y = this.ScrRectangle.top + this.ScrRectangle.height() * p.y;
        return this.getSxSy(P2);
    }

    //画面座標から相対比座標を返す
    getRatioPfromSxSy(p: point): point {
        const P2 = new point(p.x / this.frmPrint_FormSize.width(), p.y / this.frmPrint_FormSize.height());
        return P2;
    }

    //地図座標から相対比座標を返す
    getRatioPfromSrxSry(p: point): point {
        const p2 = this.getSxSy(p);
        const P3 = new point(p2.x / this.frmPrint_FormSize.width(), p2.y / this.frmPrint_FormSize.height());
        return P3;
    }

    //画面の上下の位置の相対比（0～1）から地図座標に戻す(旧SRX2,SRY2)
    getSRXYfromRatio(p: point): point {
        const P2 = new point();
        P2.x = this.ScrRectangle.left + this.ScrRectangle.width() * p.x;
        P2.y = this.ScrRectangle.top + this.ScrRectangle.height() * p.y;
        return P2;
    }

    Clone(): Screen_info {
        const d = new Screen_info();
        Object.assign(d, this);
        d.ScrView = this.ScrView.Clone();
        d.ScrRectangle = this.ScrRectangle.Clone();
        d.MapRectangle = this.MapRectangle.Clone();
        d.MapScreen_Scale = this.MapScreen_Scale.Clone();
        d.ScreenMG = this.ScreenMG.Clone();
        d.PrinterMG = this.PrinterMG.Clone();
        d.Screen_Margin = this.Screen_Margin.Clone();
        d.frmPrint_FormSize = this.frmPrint_FormSize.Clone();
        d.ThreeDMode = this.ThreeDMode.Clone();
        return d;
    }
}

//データ項目データ取得で、欠損値以外の値を取得する際に使用
class strObjLocation_and_Data_info {
    ObjLocation: number = 0;
    DataValue: number | string | undefined = undefined;
}

class Overlay_Temporaly_Data_Info {
    Printing_Number: number = 0; // Integer
    OverLay_Printing_Flag: boolean = false; // Boolean  '記号やブロックを重ね合わせる際に標示位置をずらすのに使用
    OverLay_EMode_N: number = 0; // Integer '記号モードをずらす際に使用するが、10では使用しない
    OverLay_EMode_Now: number = 0; // Integer
    Always_Ove_DataStac: strOverLay_DataSet_Item_Info[] = []; // List(Of strOverLay_Dat//et_Item_Info)
}

export class Legend2_Atri {
   LineKind_Flag: boolean = false;// Boolean
   PointObject_Flag: boolean = false;// Boolean
   Layn: number = 0;// Integer
   DatN: number = 0;// Integer
   Print_Mode_Layer: number = 0;// enmLayerMode_Number
   SoloMode: number = 0;// enmSoloMode_Number
   GraphMode: number = 0;// enmGraphMode
   LabelMode: number = 0;// enmLabelMode
   title: string = "";// String
   Rect: rectangle = new rectangle();
   OverLay_Printing_Flag: boolean = false;// Boolean
   
   Clone(): Legend2_Atri {
       const La = new Legend2_Atri();
       La.LineKind_Flag = this.LineKind_Flag;
       La.PointObject_Flag = this.PointObject_Flag;
       La.Layn = this.Layn;
       La.DatN = this.DatN;
       La.Print_Mode_Layer = this.Print_Mode_Layer;
       La.SoloMode = this.SoloMode;
       La.GraphMode = this.GraphMode;
       La.LabelMode = this.LabelMode;
       La.title = this.title;
       La.Rect = this.Rect.Clone();
       La.OverLay_Printing_Flag = this.OverLay_Printing_Flag;
       return La;
   }
}

class AccessoryTemp_Infp {
    MapScale_Rect: rectangle = new rectangle();
    MapTitle_Rect: rectangle = new rectangle();
    DataNote_Rect: rectangle = new rectangle();
    MapLegend_W: Legend2_Atri[] = [];// Legend2_Atri
    MapCompass_Rect: rectangle = new rectangle();
    GroupBox_Rect: rectangle = new rectangle();
    Legend_No_Max: number = 0;// Integer
    Push_titleXY: point = new point();
    Push_LegendXY: point = new point();
    Edit_Legend: number = 0;// Integer
    Push_CompassXY: point = new point();
    Push_ScaleXY: point = new point();
    Push_DataNoteXY: point = new point();
    Push_GroupBoxXY: point = new point();
    OriginalGroupBoxRect: rectangle = new rectangle();
    
    Clone(): AccessoryTemp_Infp {
        const tac = new AccessoryTemp_Infp();
        tac.MapScale_Rect = this.MapScale_Rect.Clone();
        tac.DataNote_Rect = this.DataNote_Rect.Clone();
        tac.MapTitle_Rect = this.MapTitle_Rect.Clone();
        tac.MapCompass_Rect = this.MapCompass_Rect.Clone();
        tac.Legend_No_Max = this.Legend_No_Max;
        tac.Edit_Legend = this.Edit_Legend;
        tac.Push_CompassXY = this.Push_CompassXY.Clone();
        tac.Push_LegendXY = this.Push_LegendXY.Clone();
        tac.Push_ScaleXY = this.Push_ScaleXY.Clone();
        tac.Push_DataNoteXY = this.Push_DataNoteXY.Clone();
        tac.Push_titleXY = this.Push_titleXY.Clone();
        tac.MapLegend_W = Generic.ArrayClone(this.MapLegend_W);
        return tac;
    }
}

//一時データ

class strLocationSearchObject {
    objLayer: number;
    ObjNumber: number;

    constructor(layer: number, objnumber: number) {
        this.objLayer = layer;
        this.ObjNumber = objnumber;
    }

    Clone(): strLocationSearchObject {
        const d = new strLocationSearchObject(this.objLayer, this.ObjNumber);
        Object.assign(d, this);
        return d;
    }
}

class strTempLocationMenuString {
    ObjectNameValue?: string;
    ContourStacPos?: number;
    ClickMapPos: point = new point();
    DataIndex?: number;
}

class frmPrint_temp_info {
    OnObject: strLocationSearchObject[] = [];
    OldObject: strLocationSearchObject[] = [];
    PrintMouseMode: PrintMouseModeValue | undefined;
    MultiObjectSelectSub: number | undefined; // enmMultiObjectSelecModesSub (未定義)
    MultiObjectSelectShowFlag: boolean = false;
    MultiObjects: number[] = [];
    FigMode: JsonObject | undefined; // strFigureMode (未定義)
    mouseAccesoryDragType: JsonObject | undefined; // Check_Acc_Result (未定義)
    OD_Drag: ODBezier_Data = new ODBezier_Data();
    MouseDownF: boolean = false;
    LocationMenuString: strTempLocationMenuString = new strTempLocationMenuString();
    RightButtonClickF: boolean = false;
    SymbolPointFirstMessage: boolean = false;
    LabelPointFirstMessage: boolean = false;
    Menu_Enable: JsonObject | undefined; // menu_Ename_Info (未定義)
    PointDistanceArea: point[] = [];
    image: JsonValue | undefined; //出力画面の保存 (未定義)
}

class DotMapTemp_Info {
    DotMapTempResetF: boolean | undefined; // Boolean
    DotMapPoint: { [key: number]: JsonValue } = {}; // Dictionary(Of Integer, PointF()) (未定義)
}

class strSeries_Temporaly_Data_Info {
    Printing_Flag: boolean | undefined; //Boolean
    Koma: number | undefined; //Integer
    title: string | undefined; //String
}
class ContourModeTemp_Temporaly_Data_Info {
    ContourDataResetF: boolean | undefined; //Boolean
    ContourMesh: JsonObject | undefined; //clsMeshContour (未定義)
    Contour_Object: strContour_Line_property[] = [];
    Contour_Point: point[] = [];
    Contour_All_Number: number | undefined; //Integer '描いた等値線の全体数
    Contour_All_Point: number | undefined; //Integer '描いた等値線のポイント数
}

class ModeValueInScreen_Stac_Info {
    setF: boolean | undefined; // Boolean
    LayerNum: number | undefined; // Integer
    DataNum: number | undefined; // Integer
    divValue: number[] = []; // Double
    MarkSize_MaxValueMode: number | undefined; // enmMarkSizeValueMode (未定義)
    MarkSize_MaxValue: number | undefined; // Double
    MarkBar_MaxValueMode: number | undefined; // enmMarkSizeValueMode (未定義)
    MarkBar_MaxValue: number | undefined; // Double
}
class strTem {
    Series_temp: strSeries_Temporaly_Data_Info = new strSeries_Temporaly_Data_Info();
    OverLay_Temp: Overlay_Temporaly_Data_Info = new Overlay_Temporaly_Data_Info();
    ContourMode_Temp: ContourModeTemp_Temporaly_Data_Info = new ContourModeTemp_Temporaly_Data_Info();
    Trip_Temp: JsonObject | undefined; //TripModeTemp_DataInfo (未定義)
    Accessory_Temp: AccessoryTemp_Infp = new AccessoryTemp_Infp();
    frmPrint_Temp: frmPrint_temp_info = new frmPrint_temp_info();
    FigurePrinted: boolean[] = []; //Boolean
    ObjectPrintedCheckFlag: boolean[][] = []; //Boolean
    PointObjectKindUsedStack: IObjectKindUsed_Info[] = []; //strObjectKindUsed_Info[]
    drawing: boolean | undefined; //boolean描画中
    DotMap_Temp: DotMapTemp_Info = new DotMapTemp_Info();
    ModeValueInScreen_Stac: ModeValueInScreen_Stac_Info = new ModeValueInScreen_Stac_Info();
    // 地図の緯度経度の領域
    MapAreaLatLon: rectangle | undefined; //RectangleF (未定義)
    SoubyouLayerEnable: boolean[] = []; //Boolean
    SoubyouLoopLineArea: JsonValue[] = []; //(未定義)
    SoubyouLoopAreaCriteria: JsonValue | undefined; //(未定義)
    SoubyouLinePointIntervalCriteria: JsonValue | undefined; //(未定義)
}



class strGetLinePointAPI_Info {
    GetF: boolean | undefined; //Boolean
    Drawn: boolean | undefined; //Boolean
    Reverse: boolean | undefined; //Boolean
    ReverseF: boolean | undefined; //Boolean (alias for Reverse)
    Point: point[] = [];
}

const enmPrint_Enable = { Printable: 0, Printable_with_Error: 2, UnPrintable: 1 };
const enmPaintColorSettingModeInfo = { twoColor: 0, threeeColor: 1, SoloColor: 2, multiColor: 3 };


class strLayerReadingInfo {
    Name: string = "";
    MapFile: string = "";
    Time: strYMD = new strYMD();
    Type: number = 0; // enmLayerType
    MeshType: number = 0; // enmMesh_Number
    //ポイント、メッシュ、移動データの測地系指定
    ReferenceSystem: number = 0; // enmZahyo_System_Info
    Shape: number = 0; // enmShape
    TTL: string[] = [];
    UNT: string[] = [];
    DTMis: JsonValue[] = [];
    Note: string[] = [];
    ObjectDataStac: string[][] = [];
    Dummy_Temp: string[][] = [];
    Dummy_OBKTemp: string[][] = [];
    Comment_Temp: string = "";

    //レイヤの初期化。タイプはNormal形状はNotDefinition
    init(): void {
        this.TTL = [];
        this.UNT = [];
        this.DTMis = [];
        this.Note = [];
        this.ObjectDataStac = [];
        this.Dummy_Temp = [];
        this.Dummy_OBKTemp = [];
        this.Comment_Temp = "";
        this.Name = "";
        this.MapFile = "";
        this.Time = clsTime.GetNullYMD();
        this.Type = enmLayerType.Normal;
        this.Shape = enmShape.NotDeffinition;
        this.MeshType = enmMesh_Number.mhNonMesh;
    }
}

// Save Line Pattern Info
class strSaveLinePat_Info {
    MapNum: number = 0;
    MapFileName: string[] = [];
    LpatNumByMapfile: number[] = [];
    Lpat: strLKOjectGroup_Info[] = [];
}

//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

// JSON構造の最小型（使用箇所のみ定義）
type MDRJSaveLPat = {
    MapNum: number;
    MapFileName: string[];
    LpatNumByMapfile: number[];
    Lpat: Array<{
        Name?: string;
        NumofObjectGroup?: number;
        ObjGroup: Array<{
            GroupNumber?: number;
            Pattern?: JsonObject;
        }>;
    }>;
};

type MDRJTotalData = {
    LV1: Total_Data_Info['LV1'];
    ViewStyle: IAttrData['TotalData']['ViewStyle'];
    Condition: Total_Data_Info['Condition'];
    TotalMode: Total_Data_Info['TotalMode'];
};

type MDRJData = {
    TotalData: MDRJTotalData;
    LayerData: JsonValue[];
    saveLPat?: MDRJSaveLPat;
    mapData?: Record<string, JsonObject>;
};

class clsAttrData {
    TempData: strTem;
    LayerData: strLayerDataInfo[];
    TotalData: Total_Data_Info;
    MapData: clsAttrMapData;
    MPSubLine: Record<string, Record<number, strGetLinePointAPI_Info>>;
    LineKindUse: boolean[];
    private defaultColor: {
        paintMode: colorRGBA[];
        markColorTrance: colorRGBA;
        markColor: colorRGBA;
        markBarColor: colorRGBA;
        minusColor: colorRGBA;
    };

    constructor() {
        this.defaultColor = {
            paintMode: [new colorRGBA(0x99, 0x34, 0x4), new colorRGBA(0xFF, 0xFF, 0xC4)],
            markColorTrance: new colorRGBA(0xff, 0xbf, 0xbf, 200),
            markColor: new colorRGBA(0xff, 0xbf, 0xbf),
            markBarColor: new colorRGBA(0xff, 0x80, 0x00),
            minusColor: new colorRGBA(0x55, 0x55, 0xbf)
        };

        this.TempData = new strTem();

        this.LayerData = []; //strLayerDataInfo
        this.TotalData = new Total_Data_Info(); //Total_Data_Info
        const lv = this.TotalData.LV1;
        lv.Comment = "";
        lv.Lay_Maxn = 0;
        lv.SelectedLayer = 0;
        lv.DataSourceType = enmDataSource.NoData;
        lv.Print_Mode_Total = enmTotalMode_Number.DataViewMode;

        this.MapData = new clsAttrMapData(); //clsAttrMapData
        this.MPSubLine = {};
        this.LineKindUse = new Array<boolean>(); //Boolean
    }

    //＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊

    /**ダミーオブジェクトグループの設定をDummyOBGArray[true,false]の配列で返す、trueNumはtrueの数 */
    getDummyObjGroupArray(Layernum: number, shape?: number): {DummyOBGArray: boolean[], trueNum: number} {
        const state = appState();
        const al = state.attrData.LayerData[Layernum];
        const alm = al.MapFileData;
        if (!alm) {
            return { DummyOBGArray: [], trueNum: 0 };
        }
        const DummyObjG: boolean[] = Array.from({ length: alm.Map.OBKNum }, () => false);
        let n = 0;
        for (let i = 0; i < al.DummyGroup.length; i++) {
            const objg = al.DummyGroup[i];
            if ((alm.ObjectKind[objg].Shape === shape) || shape === undefined) {
                DummyObjG[objg] = true;
                n++;
            }
        }
        return {DummyOBGArray:DummyObjG,trueNum:n};
    }

    /**設定した状態で描画可能か調べる Print_Enable: enmPrint_Enable.とmessageを返す*/
    Get_PrintError(): {Print_Enable: number, message: string} {
        
        let LV1E  = false;
        let LV2E  = false;
        const Layernum  = this.TotalData.LV1.SelectedLayer;
        const lay = this.LayerData[Layernum];
        const DataNum  = lay.atrData.SelectedIndex;
        const laydata=this.LayerData[Layernum].atrData.Data[DataNum];
        let mes = "";
        switch (this.TotalData.LV1.Print_Mode_Total) {
            case enmTotalMode_Number.DataViewMode: {
                switch (lay.Print_Mode_Layer) {
                    case enmLayerMode_Number.SoloMode: {
                        if (this.Get_DataNum(Layernum) === 0) {
                            mes += "データがありません。" + '\n';
                            LV1E = true;
                        } else {
                            const DataMax = laydata.Statistics.Max;
                            const DataMin = laydata.Statistics.Min;
                            let md = laydata.ModeData;
                            if ((md === enmSoloMode_Number.ContourMode) && (
                                (laydata.SoloModeViewSettings.ContourMD.Interval_Mode === enmContourIntervalMode.ClassPaint) || (
                                    laydata.SoloModeViewSettings.ContourMD.Interval_Mode === enmContourIntervalMode.ClassHatch))) {
                                md = enmSoloMode_Number.ClassPaintMode;
                            }
                            switch (md) {
                                case enmSoloMode_Number.ClassPaintMode:
                                case enmSoloMode_Number.ClassMarkMode:
                                case enmSoloMode_Number.ClassODMode: {
                                    let ef = 0;
                                    if (this.Get_DataType(Layernum, DataNum) === enmAttDataType.Normal) {
                                        for (let i = 0; i < laydata.SoloModeViewSettings.Div_Num - 1; i++) {
                                            const v = laydata.SoloModeViewSettings.Class_Div[i].Value;
                                            const numV = typeof v === 'number' ? v : parseFloat(String(v));
                                            if ((numV > DataMax) || (numV < DataMin)) {
                                                ef = 2;
                                            }
                                            if (i !== 0) {
                                                const prevV = laydata.SoloModeViewSettings.Class_Div[i - 1].Value;
                                                const numPrevV = typeof prevV === 'number' ? prevV : parseFloat(String(prevV));
                                                if (numPrevV <= numV) {
                                                    ef = 1;
                                                }
                                            }
                                        }
                                    }
                                    if (ef === 2) {
                                        mes += "区分値の最小値または最大値の値が、データの最小値～最大値の値を越えています。" + '\n';
                                        LV2E = true;
                                    }
                                    if (ef === 1) {
                                        mes += "階級区分の区分値が不正です" + '\n';
                                        LV1E = true;
                                    }
                                    break;
                                }
                                case enmSoloMode_Number.MarkSizeMode:
                                    break;
                                case enmSoloMode_Number.ContourMode: {
                                    const cmd = laydata.SoloModeViewSettings.ContourMD;
                                    switch (cmd.Interval_Mode) {
                                        case enmContourIntervalMode.RegularInterval: {
                                            const cmdr = cmd.Regular;
                                            if (cmdr.Interval <= 0) {
                                                mes += "通常の等値線：間隔は0よりも大きくして下さい。" + '\n';
                                                LV1E = true;
                                            }
                                            if ((cmdr.bottom > DataMax) || (cmdr.top < DataMin)) {
                                                mes += "通常の等値線：下限値または上限値が不正です。" + '\n';
                                                LV1E = true;
                                            }
                                            if (cmdr.top < cmdr.bottom) {
                                                mes += "通常の等値線：下限値が上限値よりも大きくなっています。"
                                                LV1E = true;
                                            }

                                            if (cmdr.SP_interval <= 0) {
                                                mes += "強調する等値線：間隔は0よりも大きくして下さい。" + '\n';
                                                LV1E = true;
                                            }
                                            if ((cmdr.SP_Bottom > DataMax) || (cmdr.SP_Top < DataMin)) {
                                                mes += "強調する等値線：下限値または上限値が不正です。" + '\n';
                                                LV1E = true;
                                            }
                                            if (cmdr.SP_Top < cmdr.SP_Bottom) {
                                                mes += "強調する等値線：下限値が上限値よりも大きくなっています。";
                                                LV1E = true;
                                            }
                                            if ((cmdr.EX_Value_Flag === true) && ((cmdr.EX_Value > DataMax) || (cmdr.top < cmdr.EX_Value))) {
                                                mes += "一本だけ強調する等値線の値が不正です。"
                                                LV2E = true;
                                            }
                                            if (LV1E === false) {
                                                const contn = Math.floor((Math.max(cmdr.top, DataMax) - Math.min(cmdr.bottom, DataMin)) / cmdr.Interval);
                                                if (contn > 100) {
                                                    mes += "等値線が" + contn + "本ほど描かれます。" + '\n';
                                                    LV2E = true;
                                                }
                                            }
                                            break;
                                        }
                                        case enmContourIntervalMode.SeparateSettings: {
                                            if (cmd.IrregularNum === 0) {
                                                mes += "等値線の値を設定してください。" + '\n';
                                                LV1E = true;
                                            } else {
                                                for (let i = 0; i < cmd.IrregularNum; i++) {
                                                    if ((cmd.Irregular[i].Value > DataMax) || (cmd.Irregular[i].Value < DataMin)) {
                                                        mes += "区分値が不正です。" + '\n';
                                                        LV2E = true;
                                                    }
                                                }
                                            }
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                            break;
                        }
                        break;
                    }
                    case enmLayerMode_Number.GraphMode:{
                        const dset  = lay.LayerModeViewSettings.GraphMode.SelectedIndex;
                        const gdata= lay.LayerModeViewSettings.GraphMode.DataSet[dset];
                        if(gdata.Data.length===0){
                            mes += "表示データが設定されていません。" + '\n';
                            LV1E = true;
                            break;
                        }
                        if((gdata.GraphMode === enmGraphMode.PieGraph)||(gdata.GraphMode === enmGraphMode.StackedBarGraph )){
                                for(let i  = 0 ;i< gdata.Data.length ;i++){
                                    const a  = gdata.Data[i].DataNumber;
                                    if(lay.atrData.Data[a].Statistics.Min < 0 ){
                                        mes += "選択データに負の数が含まれています。" + '\n';
                                        LV1E = true;
                                        break;
                                    }
                                }
                            }
                            if(gdata.Data.length <= 1 ){
                                mes += "選択データが足りません。" + '\n';
                                LV1E = true;
                            }
                        break;
                    }
                    case enmLayerMode_Number.LabelMode:
                        break;
                }
                break;
            }
            case enmTotalMode_Number.OverLayMode: {
                const oset = this.TotalData.TotalMode.OverLay;
                const odata = oset.DataSet[oset.SelectedIndex];
                if (odata.DataItem.length === 0) {
                    mes += "重ね合わせデータが設定されていません。" + '\n';
                    LV1E = true;
                }
                break;
            }
            case enmTotalMode_Number.SeriesMode: {
                const sset = this.TotalData.TotalMode.Series;
                const sdata = sset.DataSet[sset.SelectedIndex];
                if (sdata.DataItem.length === 0) {
                    mes += "連続表示データが設定されていません。" + '\n';
                    LV1E = true;
                }
                break;
            }
        }

        if (LV1E === true) {
            return { Print_Enable: enmPrint_Enable.UnPrintable, message: mes };
        } else {
            if (LV2E === true) {
                return { Print_Enable: enmPrint_Enable.Printable_with_Error, message: mes };
            }
        }
        return { Print_Enable: enmPrint_Enable.Printable, message: mes };
    }

    /** データ挿入 AddMapFileNameF:レイヤ名に地図ファイルを追加する場合true */
    ADD_AttrData(InsertData: clsAttrData, AddMapFileNameF: boolean): {ok: boolean, ErrorMessage: string} {

    const ErrorMessage = "";
    const checkResult = spatial.Check_Zahyo_Projection_Convert_Enabled(this.TotalData.ViewStyle.Zahyo, InsertData.TotalData.ViewStyle.Zahyo);
    if (checkResult.ok === false) {
        return { ok: false, ErrorMessage: ErrorMessage };
    }
    const Mfile = InsertData.GetMapFileName();
    const ExtMfile = this.GetMapFileName();
    const LayerPlus = this.TotalData.LV1.Lay_Maxn;
    if (InsertData.TotalData.LV1.DataSourceType === enmDataSource.MDRMJ) {
        for (let i = 0; i < Mfile.length; i++) {
            const newMFname = this.getUniqueMapFileName(Mfile[i]);
            this.MapData.AddExistingMapData(InsertData.SetMapFile(Mfile[i]), newMFname);
            for (let j = 0; j < InsertData.TotalData.LV1.Lay_Maxn; j++) {
                if (InsertData.LayerData[j].MapFileName.toUpperCase() === Mfile[i].toUpperCase()) {
                    InsertData.LayerData[j].MapFileName = newMFname;
                }
            }
        }
    } else {
        for (let i = 0; i < Mfile.length; i++) {
            if (ExtMfile.indexOf(Mfile[i]) === -1) {
                this.MapData.AddExistingMapData(InsertData.SetMapFile(Mfile[i]), Mfile[i]);
            }
        }
    }

    InsertData.Convert_Zahyo(this.TotalData.ViewStyle.Zahyo);
    this.MapData.EqualizeZahyoMode(this.TotalData.ViewStyle.Zahyo);

    if (InsertData.TotalData.LV1.Comment !== "") {
        this.TotalData.LV1.Comment += "\n" + InsertData.TotalData.LV1.FileName + "を挿入" + "\n" +
            InsertData.TotalData.LV1.Comment

    }
    //レイヤのコピー
    const nLayer = this.TotalData.LV1.Lay_Maxn + InsertData.TotalData.LV1.Lay_Maxn;
    for (let i = 0; i < InsertData.TotalData.LV1.Lay_Maxn; i++) {
        const il = InsertData.LayerData[i];
        if ((il.Name === "") && (InsertData.TotalData.LV1.Lay_Maxn > 1)) {
            il.Name = (i + 1).toString();
        }
        if (AddMapFileNameF === true) {
            if (il.Name !== "") {
                if (InsertData.TotalData.LV1.FileName !== "") {
                    il.Name = InsertData.TotalData.LV1.FileName + "：" + il.Name;
                }
            } else {
                il.Name = InsertData.TotalData.LV1.FileName;
            }
        }
        for (let j = 0; j < il.atrData.Count; j++) {
            il.atrData.Data[j].SoloModeViewSettings.ClassODMD.o_Layer += LayerPlus;
        }
        this.LayerData[this.TotalData.LV1.Lay_Maxn + i] = InsertData.LayerData[i];
        this.LayerData[this.TotalData.LV1.Lay_Maxn + i].MapFileData = this.MapData.SetMapFile(InsertData.LayerData[i].MapFileName);
    }
    this.TotalData.LV1.Lay_Maxn = nLayer;

    const itt = InsertData.TotalData.TotalMode;
    //重ね合わせモード
    for (let i = 0; i < itt.OverLay.DataSet.length; i++) {
        const lttd = itt.OverLay.DataSet[i];
        for (let j = 0; j < lttd.DataItem.length; j++) {
            const d = lttd.DataItem[j].Clone();
            d.Layer += LayerPlus;
            lttd.DataItem[j] = d
            if ((itt.OverLay.DataSet.length === 1) && (itt.OverLay.DataSet[0].DataItem.length === 0) && (itt.OverLay.DataSet[0].title === "")) {
                // 空のデータセットの場合はスキップ
            } else {
                this.TotalData.TotalMode.OverLay.DataSet.push(lttd.Clone());
            }
        }
    }

    //連続表示モード
    for (let i = 0; i < itt.Series.DataSet.length; i++) {
        const ltts = itt.Series.DataSet[i];
        for (let j = 0; j < ltts.DataItem.length; j++) {
            const d = ltts.DataItem[j];
            d.Layer += LayerPlus;
            ltts.DataItem[j] = d;
        }
        if ((itt.Series.DataSet.length === 1) && (itt.Series.DataSet[0].DataItem.length === 0) && (itt.Series.DataSet[0].title === "")) {
            // 空のデータセットの場合はスキップ
        } else {
            this.TotalData.TotalMode.Series.DataSet.push(ltts.Clone());
        }
    }

    //表示設定のコピー
    const itv = InsertData.TotalData.ViewStyle;
    for (let i = 0; i < itv.Screen_Setting.length; i++) {
        this.TotalData.ViewStyle.Screen_Setting.push(itv.Screen_Setting[i].Clone());
    }

    for (let i = 0; i < Mfile.length; i++) {
        if (ExtMfile.indexOf(Mfile[i]) === -1) {
            if (Object.keys(itv.DummyObjectPointMark).length > 0) {
                this.TotalData.ViewStyle.DummyObjectPointMark[Mfile[i]] = itv.DummyObjectPointMark[Mfile[i]];
            }
        }
    }


    const it = InsertData.TotalData;
    //条件設定の変換
    for (let i = 0; i < it.Condition.length; i++) {
        const d = it.Condition[i].Clone();
        d.Layer += LayerPlus;
        //it.Condition.Item[i] = d;
        this.TotalData.Condition.push(d);
    }

    //図形モードの変換
    // For wi  = 0 To InsertData.TotalData.FigureStac.Count - 1
    //     let FigStac As Object = InsertData.TotalData.FigureStac(wi)
    //     switch( true
    //         case TypeOf FigStac Is clsAttrData.strFig_Word_Data
    //             let FigData As clsAttrData.strFig_Word_Data = DirectCast(FigStac, clsAttrData.strFig_Word_Data)
    //             if(FigData.Data.Layer !== 0 ){
    //                 FigData.Data.Layer += LayerPlus
    //             }
    //             this.TotalData.FigureStac.Add(FigData)
    //         case TypeOf FigStac Is clsAttrData.strFig_Line_Data
    //             let FigData As clsAttrData.strFig_Line_Data = DirectCast(FigStac, clsAttrData.strFig_Line_Data)
    //             if(FigData.Data.Layer !== 0 ){
    //                 FigData.Data.Layer += LayerPlus
    //             }
    //             this.TotalData.FigureStac.Add(FigData)
    //         case TypeOf FigStac Is clsAttrData.strFig_Rectangle_Data
    //             let FigData As clsAttrData.strFig_Rectangle_Data = DirectCast(FigStac, clsAttrData.strFig_Rectangle_Data)
    //             if(FigData.Data.Layer !== 0 ){
    //                 FigData.Data.Layer += LayerPlus
    //             }
    //             this.TotalData.FigureStac.Add(FigData)
    //         case TypeOf FigStac Is clsAttrData.strFig_Circle_data
    //             let FigData As clsAttrData.strFig_Circle_data = DirectCast(FigStac, clsAttrData.strFig_Circle_data)
    //             if(FigData.Data.Layer !== 0 ){
    //                 FigData.Data.Layer += LayerPlus
    //             }
    //             this.TotalData.FigureStac.Add(FigData)
    //         case TypeOf FigStac Is clsAttrData.strFig_Point_Data
    //             let FigData As clsAttrData.strFig_Point_Data = DirectCast(FigStac, clsAttrData.strFig_Point_Data)
    //             if(FigData.Data.Layer !== 0 ){
    //                 FigData.Data.Layer += LayerPlus
    //             }
    //             this.TotalData.FigureStac.Add(FigData)
    //         case TypeOf FigStac Is clsAttrData.strFig_gazo_data
    //             let FigData As clsAttrData.strFig_gazo_data = DirectCast(FigStac, clsAttrData.strFig_gazo_data)
    //             if(FigData.Data.Layer !== 0 ){
    //                 FigData.Data.Layer += LayerPlus
    //             }
    //             this.TotalData.FigureStac.Add(FigData)
    //     }
    // }

    this.Check_Vector_Object()
    this.LinePatternCheck()
    this.PrtObjectSpatialIndex()
    const retV = { ok: true, ErrorMessage: ErrorMessage };
    return retV;
}

    /**データ中の座標を変換する */
    Convert_Zahyo(newZahyo: Zahyo_info): void {
        const oldZahyo = this.TotalData.ViewStyle.Zahyo;
        for (let i = 0; i < this.TotalData.LV1.Lay_Maxn; i++) {
            const li = this.LayerData[i];
            if ((li.Type !== enmLayerType.Trip) && (li.Type !== enmLayerType.Trip_Definition)) {
                //記号・ラベル表示位置
                for (let j = 0; j < li.atrObject.ObjectNum; j++) {
                    const lia = li.atrObject.atrObjectData[j];
                    lia.CenterPoint = spatial.Get_Reverse_and_Convert_XY(lia.CenterPoint, oldZahyo, newZahyo);
                    lia.Symbol = spatial.Get_Reverse_and_Convert_XY(lia.Symbol, oldZahyo, newZahyo);
                    lia.Label = spatial.Get_Reverse_and_Convert_XY(lia.Label, oldZahyo, newZahyo);
                }
                //ODの参照点
                for (let j = 0; j < li.ODBezier_DataStac.length; j++) {
                    li.ODBezier_DataStac[j].Point = spatial.Get_Reverse_and_Convert_XY(li.ODBezier_DataStac[j].Point, oldZahyo, newZahyo);
                }
            }
            if (li.Type === enmLayerType.Mesh) {
                for (let j = 0; j < li.atrObject.ObjectNum; j++) {
                    const lia = li.atrObject.atrObjectData[j];
                    for (let k = 0; k <= 3; k++) {
                        lia.MeshPoint[k] = spatial.Get_Reverse_and_Convert_XY(lia.MeshPoint[k], oldZahyo, newZahyo);
                    }
                    lia.MeshRect = spatial.getCircumscribedRectangle(lia.MeshPoint[0], new rectangle(lia.MeshPoint[0].x, lia.MeshPoint[1].x, lia.MeshPoint[0].y, lia.MeshPoint[2].y));
                }
            }

        }

        //図形モード
        for (let i = 0; i < this.TotalData.FigureStac.length; i++) {
            const FigStac = this.TotalData.FigureStac[i];
            // Word Dataの場合
            if (FigStac.StringPos) {
                for (let j = 0; j < FigStac.StringPos.length; j++) {
                    FigStac.StringPos[j] = spatial.Get_Reverse_and_Convert_XY(FigStac.StringPos[j], oldZahyo, newZahyo);
                }
            }
            // Line Dataの場合
            if (FigStac.Points && FigStac.NumOfPoint) {
                for (let j = 0; j < FigStac.NumOfPoint; j++) {
                    FigStac.Points[j] = spatial.Get_Reverse_and_Convert_XY(FigStac.Points[j], oldZahyo, newZahyo);
                }
            }
            // Circle/Point Dataの場合
            if (FigStac.Position) {
                FigStac.Position = spatial.Get_Reverse_and_Convert_XY(FigStac.Position, oldZahyo, newZahyo);
            }
            // Point Data配列の場合
            if (FigStac.Points && !FigStac.NumOfPoint) {
                for (let j = 0; j < FigStac.Points.length; j++) {
                    FigStac.Points[j] = spatial.Get_Reverse_and_Convert_XY(FigStac.Points[j], oldZahyo, newZahyo);
                }
            }
        }
    }

    /**重ね合わせデータセットの内容を自動で並べ替える */
    Sort_OverLay_Data(DataSetNumber: number): void {
            const d = this.TotalData.TotalMode.OverLay.DataSet[DataSetNumber]
                ; d.DataItem = this.Sort_OverLay_Data_Sub(d.DataItem);
        }

    /**重ね合わせモードにセットするデータを並べ替える（一つのstrOverLay_DataSet_Item_Infoデータセット） */
    Sort_OverLay_Data_Sub(Ov_Data: strOverLay_DataSet_Item_Info[]): strOverLay_DataSet_Item_Info[] {

        const PicUpMode = [];
        const PicUpShape = [];// enmShape

        PicUpShape.push(enmShape.PolygonShape); PicUpMode.push("0");
        PicUpShape.push(enmShape.PolygonShape); PicUpMode.push("4");
        PicUpShape.push(enmShape.PolygonShape); PicUpMode.push("3");
        PicUpShape.push(enmShape.LineShape); PicUpMode.push("016");
        PicUpShape.push(enmShape.PolygonShape); PicUpMode.push("125678");
        PicUpShape.push(enmShape.PolygonShape); PicUpMode.push("9A");
        PicUpShape.push(enmShape.PolygonShape); PicUpMode.push("B");
        PicUpShape.push(enmShape.LineShape); PicUpMode.push("2349");
        PicUpShape.push(enmShape.PointShape); PicUpMode.push("3");
        PicUpShape.push(enmShape.PointShape); PicUpMode.push("0");
        PicUpShape.push(enmShape.PointShape); PicUpMode.push("1245678");
        PicUpShape.push(enmShape.PointShape); PicUpMode.push("9A");
        PicUpShape.push(enmShape.PointShape); PicUpMode.push("B");
        PicUpShape.push(enmShape.PolygonShape); PicUpMode.push("C");
        PicUpShape.push(enmShape.LineShape); PicUpMode.push("C");
        PicUpShape.push(enmShape.PointShape); PicUpMode.push("C");

        const Sub_Over = [];// strOverLay_DataSet_Item_Info)

        for (let i = 0; i < PicUpMode.length; i++) {
            for (let j = 0; j < Ov_Data.length; j++) {
                const ovd = Ov_Data[j].Clone();
                if (this.LayerData[ovd.Layer].Shape === PicUpShape[i]) {
                    switch (ovd.Print_Mode_Layer) {
                        case enmLayerMode_Number.SoloMode:
                            if (PicUpMode[i].indexOf(String(ovd.Mode)) !== -1) {
                                Sub_Over.push(ovd);
                            }
                            break;
                        case enmLayerMode_Number.GraphMode: {
                            const d = this.LayerData[ovd.Layer].LayerModeViewSettings.GraphMode.DataSet[ovd.DataNumber];
                            if (PicUpMode[i].indexOf("A") !== -1) {
                                if ((d.GraphMode === enmGraphMode.PieGraph) || (d.GraphMode === enmGraphMode.StackedBarGraph) || (d.GraphMode === enmGraphMode.BarGraph)) {
                                    Sub_Over.push(ovd);
                                }
                            } else if (PicUpMode[i].indexOf("B") !== -1) {
                                if (d.GraphMode === enmGraphMode.LineGraph) {
                                    Sub_Over.push(ovd);
                                }
                            }
                            break;
                        }
                        case enmLayerMode_Number.LabelMode:
                            if (PicUpMode[i].indexOf("C") !== -1) {
                                Sub_Over.push(ovd)
                            }
                            break;
                        case enmLayerMode_Number.TripMode:
                            // if(InStr(PicUpMode[i], "D") !== 0 ){
                            //     Sub_Over.push(Ov_Data[j])
                            // }
                            break;
                    }
                }
            }
        }

        // for (let i = 0; i < Ov_Data.Count; i++) { タイルは使用しない
        //     if (Ov_Data[i].TileMapf === true) {
        //         Sub_Over.splice(i,0, Ov_Data[i].Clone())
        //     }
        // }
        return Sub_Over;
    }

    Check_Missing_Value(Layernum: number, DataNumber: number, objNumber: number): boolean {
        const state = appState();
        const ad = state.attrData.LayerData[Layernum].atrData.Data[DataNumber];
        if ((ad.MissingValueNum === 0) || (ad.MissingF === false)) {
            return false;
        } else {
            if (ad.Value[objNumber] === undefined ){
                return true;
            } else {
                return false;
            }
        }
    }

    /**レイヤ内のURLリンクの最大数を求める */
    Get_MaxURLNum(Layernum: number): number {
        const state = appState();
        let mx=0;
        const al = state.attrData.LayerData[Layernum];
        for (let i = 0; i < al.atrObject.ObjectNum; i++) {
            mx = Math.max(mx, al.atrObject.atrObjectData[i].HyperLinkNum);
        }
        return mx;
    }

    /**通常データ、カテゴリーデータの凡例を指定したデータ項目にコピーする */
    Set_Legend(D_Layer: number, D_DataNum: number, O_Data: strData_info, ClassPaintF: boolean, MarkSizeF: boolean, MarkSizeValueCopyF: boolean, MarkBlockF: boolean,
        ContourF: boolean, ClassMarkF: boolean, ClassODF: boolean, StringModeF: boolean, MarkBarF: boolean, ClassODOriginCopyF: boolean,
        copyMarkCommonInnerDataF: boolean): void {

        const ls =this.LayerData[D_Layer].atrData.Data[D_DataNum].SoloModeViewSettings;
        if ((ClassPaintF === true) || (ClassMarkF === true) || (ClassODF === true)) {
            if (O_Data.DataType === enmAttDataType.Normal) {
                //通常のデータの場合
                const p = O_Data.SoloModeViewSettings.Div_Num;
                ls.Class_Div.length = p;
                for (let j = 0; j < p; j++) {
                    ls.Class_Div[j]=new strClass_Div_data();
                }
                ls.Div_Num = O_Data.SoloModeViewSettings.Div_Num;
                ls.Div_Method = O_Data.SoloModeViewSettings.Div_Method;
                if (ls.Div_Method === enmDivisionMethod.Free) {
                    for (j = 0; j < p; j++) {
                        ls.Class_Div[j].Value = O_Data.SoloModeViewSettings.Class_Div[j].Value;
                    }
                } else {
                    this.Set_Div_Value(D_Layer, D_DataNum);
                }
                if (ClassPaintF === true) {
                    ls.ClassPaintMD = O_Data.SoloModeViewSettings.ClassPaintMD.Clone();
                    for (j = 0; j < p; j++) {
                        ls.Class_Div[j].PaintColor = O_Data.SoloModeViewSettings.Class_Div[j].PaintColor;
                    }
                }
                if (ClassMarkF === true) {
                    ls.ClassMarkMD = O_Data.SoloModeViewSettings.ClassMarkMD.Clone();
                    for (j = 0; j < p; j++) {
                        ls.Class_Div[j].ClassMark = O_Data.SoloModeViewSettings.Class_Div[j].ClassMark;
                    }
                }
                if (ClassODF === true) {
                    if (ClassODOriginCopyF === true) {
                        ls.ClassODMD = O_Data.SoloModeViewSettings.ClassODMD.Clone();
                    } else {
                        ls.ClassODMD.Arrow = O_Data.SoloModeViewSettings.ClassODMD.Arrow.Clone();
                    }
                    for (j = 0; j < p; j++) {
                        ls.Class_Div[j].ODLinePat = O_Data.SoloModeViewSettings.Class_Div[j].ODLinePat.Clone();
                    }
                }
            } else if (O_Data.DataType === enmAttDataType.Category) {
                //カテゴリーデータの場合
                if (ClassPaintF === true) {
                    ls.ClassPaintMD = O_Data.SoloModeViewSettings.ClassPaintMD.Clone();
                }
                if (ClassMarkF === true) {
                    ls.ClassMarkMD = O_Data.SoloModeViewSettings.ClassMarkMD.Clone();
                }
                if (ClassODF === true) {
                    ls.ClassODMD = O_Data.SoloModeViewSettings.ClassODMD.Clone();
                }
                const P1 = O_Data.SoloModeViewSettings.Div_Num;
                const O_CateStr = [];
                for (j = 0; j < P1; j++) {
                    O_CateStr[j] = O_Data.SoloModeViewSettings.Class_Div[j].Value;
                }

                const P2 = ls.Div_Num;
                const Con_Class_Div_Temp = [];
                for (j = 0; j < P2; j++) {
                    Con_Class_Div_Temp[j] = ls.Class_Div[j];
                }
                const Con_CateStr = [];
                for (j = 0; j < P2; j++) {
                    Con_CateStr[j] = ls.Class_Div[j].Value;
                }

                const okf = [];
                let caten = 0;
                for (j = 0; j < P1; j++) {
                    const k = Con_CateStr.indexOf(O_CateStr[j]);
                    if (k !== -1) {
                        const o_Class_Div_Temp = O_Data.SoloModeViewSettings.Class_Div[j]
                        const ald = ls.Class_Div[caten];
                        ald.Value = o_Class_Div_Temp.Value;
                        if (ClassPaintF === true) {
                            ald.PaintColor = o_Class_Div_Temp.PaintColor.Clone();
                        }
                        if (ClassMarkF === true) {
                            ald.ClassMark = o_Class_Div_Temp.ClassMark.Clone();
                        }
                        if (ClassODF === true) {
                            ald.ODLinePat = o_Class_Div_Temp.ODLinePat.Clone();
                        }
                        caten++;
                        okf[k] = true;
                    }
                }
                for (j = 0; j < P2; j++) {
                    if (okf[j] === false) {
                        ls.Class_Div[caten] = Con_Class_Div_Temp[j];
                        caten++;
                    }
                }
                if (ClassODF === true) {
                    if (ClassODOriginCopyF === true) {
                        ls.ClassODMD = O_Data.SoloModeViewSettings.ClassODMD.Clone();
                    } else {
                        ls.ClassODMD.Arrow = O_Data.SoloModeViewSettings.ClassODMD.Arrow.Clone();
                    }
                }
            }
        }
        if ((MarkSizeF === true) || (MarkBlockF === true) || (StringModeF === true) || (MarkBarF === true)) {
            const alm = ls.MarkCommon;
            if (copyMarkCommonInnerDataF === true) {
                alm.Inner_Data = O_Data.SoloModeViewSettings.MarkCommon.Inner_Data;
            }
            alm.LegendMinusWord = O_Data.SoloModeViewSettings.MarkCommon.LegendMinusWord;
            alm.LegendPlusWord = O_Data.SoloModeViewSettings.MarkCommon.LegendPlusWord;
            alm.MinusLineColor = O_Data.SoloModeViewSettings.MarkCommon.MinusLineColor.Clone();
            alm.MinusTile = O_Data.SoloModeViewSettings.MarkCommon.MinusTile.Clone();
        }
        if (MarkSizeF === true) {
            ls.MarkSizeMD.MaxValueMode = O_Data.SoloModeViewSettings.MarkSizeMD.MaxValueMode;
            if (ls.MarkSizeMD.MaxValueMode === enmMarkSizeValueMode.UserDefinition) {
                ls.MarkSizeMD.MaxValue = O_Data.SoloModeViewSettings.MarkSizeMD.MaxValue;
            }
            ls.MarkSizeMD.Mark = O_Data.SoloModeViewSettings.MarkSizeMD.Mark.Clone();
            if (MarkSizeValueCopyF === true) {
                ls.MarkSizeMD.Value = O_Data.SoloModeViewSettings.MarkSizeMD.Value.concat();
            }
        }
        if (MarkBlockF === true) {
            ls.MarkBlockMD = O_Data.SoloModeViewSettings.MarkBlockMD.Clone();
        }
        if (ContourF === true) {
            ls.ContourMD = O_Data.SoloModeViewSettings.ContourMD.Clone();
        }
        if (StringModeF === true) {
            ls.StringMD = O_Data.SoloModeViewSettings.StringMD.Clone();
        }
        if (MarkBarF === true) {
            ls.MarkBarMD = O_Data.SoloModeViewSettings.MarkBarMD.Clone();
        }
    }

    //オブジェクト名とデータ項目を文字列で取得
    getOneObjectPanelLabelString(LayerNum: number, DataNumber: number, objNumber: number, SeparataString: string): string {
        let SoloProperty = this.Get_DataTitle(LayerNum, DataNumber, false) + SeparataString +
            this.Get_Data_Value(LayerNum, DataNumber, objNumber, this.TotalData.ViewStyle.Missing_Data.Text) +
            this.Get_DataUnit_With_Kakko(LayerNum, DataNumber);
        let inData = -1;
        const layData = this.LayerData[LayerNum].atrData.Data[DataNumber];
        switch (layData.ModeData) {
            case enmSoloMode_Number.ClassMarkMode: {
                if (layData.SoloModeViewSettings.ClassMarkMD.Flag) {
                    inData = layData.SoloModeViewSettings.ClassMarkMD.Data;
                }
                break;
            }
            case enmSoloMode_Number.MarkSizeMode:
            case enmSoloMode_Number.MarkBlockMode:
            case enmSoloMode_Number.MarkTurnMode: {
                if (layData.SoloModeViewSettings.MarkCommon.Inner_Data.Flag) {
                    inData = layData.SoloModeViewSettings.MarkCommon.Inner_Data.Data;
                }
                break;
            }
        }
        if (inData !== -1) {
            //内部データの値
            SoloProperty += SeparataString + this.Get_DataTitle(LayerNum, inData, false) + SeparataString +
                this.Get_Data_Value(LayerNum, inData, objNumber, this.TotalData.ViewStyle.Missing_Data.Text) +
                this.Get_DataUnit_With_Kakko(LayerNum, inData);
        }
        return SoloProperty;
    }

    //MDRJ形式で保存
    saveAsMDRJ(fname: string, MDRMJFlag: boolean): void {
        const saveLPat = new strSaveLinePat_Info();
        const MapFileList = this.GetMapFileName();
        saveLPat.MapNum = MapFileList.length;
        saveLPat.MapFileName = MapFileList;
        for (let i = 0; i < MapFileList.length; i++) {
            const n = this.SetMapFile(MapFileList[i]).Map.LpNum;
            saveLPat.LpatNumByMapfile.push(n);
            for (let j = 0; j < n; j++) {
                saveLPat.Lpat.push(this.SetMapFile(MapFileList[i]).LineKind[j]);
            }
        }

        let savedata;
        if (MDRMJFlag === false) {
            savedata = {
                TotalData: this.TotalData,
                LayerData: this.LayerData,
                saveLPat: saveLPat
            }
        } else {
            savedata = {
                TotalData: this.TotalData,
                LayerData: this.LayerData,
                saveLPat: saveLPat,
                mapData:this.MapData.getAllMapData()
            }
        }
        //地図ファイルデータがLayer内に保存されるのを防ぐ
        for (const i in this.LayerData){
            savedata.LayerData[i].MapFileData=undefined
        }

        const json = JSON.stringify(savedata);

        //Layer内の地図ファイル参照を戻す
        for (const i in this.LayerData){
            this.LayerData[i].MapFileData=this.SetMapFile(this.LayerData[i].MapFileName);
        }

        const bData: Uint8Array = Generic.strToUtf8Array(json);
        const bDataArray: Uint8Array[] = [bData];
        const bDataFile: string[] = [fname + "in"];
        Generic.zipFile(fname, bDataArray, bDataFile);
    }

    //ある地点がオブジェクト内部に入るかどうかを調べる
    Check_Point_in_Kencode_OneObject(Layernum: number, ObjNum: number, MapP: point): boolean {
        if (this.LayerData[Layernum].Type === enmLayerType.Mesh) {
            const meshP =Generic.ArrayClone( this.LayerData[Layernum].atrObject.atrObjectData[ObjNum].MeshPoint);
            meshP.push(meshP[0].Clone());
            const retV=spatial.check_Point_in_Polygon(MapP, [meshP]);
            return retV.ok;
        } else {
            switch (this.LayerData[Layernum].atrObject.atrObjectData[ObjNum].Objectstructure) {
                case enmKenCodeObjectstructure.MapObj: {
                    const O_Code = this.LayerData[Layernum].atrObject.atrObjectData[ObjNum].MpObjCode;
                    const Time = this.LayerData[Layernum].Time;
                    return this.LayerData[Layernum].MapFileData.Check_Point_in_OneObject(O_Code, MapP.x, MapP.y, Time);
                    break;
                }
                case enmKenCodeObjectstructure.SyntheticObj: {
                    // @ts-expect-error TS2304: Cannot find name 'Check_Point_in_Kencode_oneObject_Box'.
                    const f = Check_Point_in_Kencode_oneObject_Box(Layernum, ObjNum, MapP.x, MapP.y);
                    if (f === true) {
                        const ELine = this.Get_Enable_KenCode_MPLine(Layernum, ObjNum)
                        const Fringe_Line: number[] = [];
                        for (let j = 0; j < ELine.length; j++) {
                            Fringe_Line.push(ELine[j].LineCode);
                        }
                        const result = this.LayerData[Layernum].MapFileData.Check_Point_in_Polygon_LineCode(MapP.x, MapP.y, Fringe_Line);
                        return result.ok;
                    }
                    break;
                }
            }
        }
    }
    //階級区分の度数分布を求める。区分値が不正の場合はfalseを返す
    Get_ClassFrequency(Layernum: number, DataNum: number, ConditionCheck: boolean): {ok: boolean, frequency?: number[], missFreq?: number} {
        const ld = this.LayerData[Layernum].atrData.Data[DataNum];
        const ldd = ld.SoloModeViewSettings;
        if (ld.DataType === enmAttDataType.Category) {
            // カテゴリデータの場合は処理なし
        } else {
            for (let i = 0; i < ldd.Div_Num - 2; i++) {
                const v = ldd.Class_Div[i + 1].Value;
                if (ldd.Class_Div[i].Value <= v) {
                    return { ok: false };
                }
            }
        }
        const cate = this.Get_CategolyArray(Layernum, DataNum);
        let MissFreq = 0;
        const Freqency: number[] = Array.from({ length: ldd.Div_Num }, () => 0);
        for (let i = 0; i < cate.length; i++) {
            let f = true;
            if (ConditionCheck === true) {
                f = this.Check_Condition(Layernum, i);
            }
            if (f === true) {
                const cateValue = Number(cate[i]);
                if (cateValue === -1) {
                    MissFreq++;
                } else {
                    Freqency[cateValue]++;
                }
            }
        }
        return { ok: true, frequency: Freqency, missFreq: MissFreq };
    }

    //Backgroundの余白部分のピクセル数を取得
    Get_PaddingPixcel(back: BackGround_Box_Property): number {
        if ((back.Line.BlankF === true) && (back.Tile.BlankF === true)) {
            return 0;
        } else {
            return this.TotalData.ViewStyle.ScrData.Get_Length_On_Screen(back.Padding);
        }
    }

    /**レイヤの階級区分数を取得 */
    Get_DivNum(Layernum: number, DataNum: number): number {
        return this.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings.Div_Num;
    }
    //レイヤ名を取得
    Get_LayerName(Layernum: number): string {
        return this.LayerData[Layernum].Name;
    }

    //レイヤ内のオブジェクトのオブジェクト名を取得
    Get_KenObjName(Layernum: number, Objectnum: number): string {
        switch (this.LayerData[Layernum].Type) {
            case enmLayerType.Trip: {
                return this.LayerData[Layernum].atrObject.TripObjData[Objectnum].TripPersonName;
                break;
            }
            default: {
                return this.LayerData[Layernum].atrObject.atrObjectData[Objectnum].Name;
                break;
            }
        }
    }

    /**レイヤ内のオブジェクトのオブジェクト番号(地図ファイル中)を取得 */
    Get_KenObjCode(Layernum: number, Objectnum: number): number {
        switch (this.LayerData[Layernum].Type) {
            case enmLayerType.Trip: {
                return this.LayerData[Layernum].atrObject.TripObjData[Objectnum].TripPersonCode;
                break;
            }
            default: {
                return this.LayerData[Layernum].atrObject.atrObjectData[Objectnum].MpObjCode;
                break;
            }
        }      
    }

    //レイヤ・データ・オブジェクトを指定して値を取得
    Get_Data_Value(Layernum: number, DataNum: number, Obj: number, Missing_word: string): string | number {
        const ad = this.LayerData[Layernum].atrData.Data[DataNum];
        const v = ad.Value[Obj];
        if (ad.MissingF === false) {
            return v;
        } else {
            if (v === undefined) {
                return Missing_word;
            } else {
                return v;
            }
        }
    }

    //パーセントのサイズが，画面上で何ピクセルかを取得/TotalData.ViewStyle.ScrData.Get_Length_On_Screenのショートカット
    //パーセントのサイズが，画面上で何ピクセルかを取得/TotalData.ViewStyle.ScrData.Get_Length_On_Screenのショートカット
    Get_Length_On_Screen(Percentage: number): string {
        const s = this.TotalData.ViewStyle.ScrData;
        if (s.SampleBoxFlag === false) {
            const RR = s.STDWsize * Percentage / 100 * s.ScreenMG.Mul * s.GSMul;
            return parseInt(RR.toString()).toString();
        } else {
            return parseInt((s.STDWsize * Percentage / 100 * s.FirstScreenMGMul).toString()).toString();
        }

    }

    /** */
    Draw_Arrow(g: CanvasRenderingContext2D, DestFP: point, StartFP: point, LinePat: Line_Property, Arrow: Arrow_Property): void {
        clsDrawLine.Arrow?.(g,DestFP,StartFP,LinePat,Arrow,this.TotalData.ViewStyle.ScrData);
    }
    //ライン描画
    Draw_Line(g: CanvasRenderingContext2D, LinePat: Line_Property, P1: point[], P2?: point): void {
        if (P2 === undefined) {
            clsDrawLine.Line?.(g, LinePat, P1, this.TotalData.ViewStyle.ScrData);
        } else {
            clsDrawLine.Line?.(g, LinePat, P1, P2, this.TotalData.ViewStyle.ScrData);
        }
    }

    Draw_Poly_Inner(g: CanvasRenderingContext2D, pxy: point[], nPolyP: number[], T: Tile_Property): void {
        clsDrawTile.Draw_Poly_Inner?.(g, pxy, nPolyP,  T);
    }

    // TODO: タイル領域の描画機能は未実装
    Draw_Tile_Region(_g: CanvasRenderingContext2D, _BoundaryRect: rectangle, _L: Line_Property, _T: Tile_Property, _Kakudo: number): void {
        // 現在未実装 - 必要に応じて実装予定
        void 0;
    }
    
    Draw_Tile_Box(g: CanvasRenderingContext2D, BoundaryRect: rectangle, L: Line_Property, T: Tile_Property, Kakudo: number): void {
        clsDrawTile.Draw_Tile_Box?.(g, BoundaryRect, L, T, Kakudo, this.TotalData.ViewStyle.ScrData);
    }

    Draw_Tile_RoundBox(g: CanvasRenderingContext2D, BoundaryRect: rectangle, Back: BackGround_Box_Property, Kakudo: number): void {
        clsDrawTile.Draw_Tile_RoundBox?.(g, BoundaryRect, Back, Kakudo, this.TotalData.ViewStyle.ScrData);
    }

    Draw_Print(g: CanvasRenderingContext2D, Word: string, Pos: point, Font_P: Font_Property, HorizonalAlignment: HorizontalAlignmentValue, VerticalAlignment: VerticalAlignmentValue): void {
        clsDraw.print?.(g, Word, Pos, Font_P, HorizonalAlignment, VerticalAlignment, this.TotalData.ViewStyle.ScrData);
    }

    Draw_Fan(g: CanvasRenderingContext2D, OP: point, r: number, start_p: number, end_p: number, Lpat: Line_Property, Tile: Tile_Property): void {
        appState().clsDrawMarkFan?.Draw_Fan?.(g,OP,r,start_p, end_p,Lpat,Tile,this.TotalData.ViewStyle.ScrData);
    }

        // サンプル記号ボックスに記号を描画
    Draw_Sample_Mark_Box(picBox: HTMLElement, Mark: Mark_Property): void {
        appState().clsDrawMarkFan?.Draw_Mark_Sample_Box?.(picBox, Mark, this.TotalData.ViewStyle.ScrData);
    }
    //サンプルラインボックスにラインを描画
    Draw_Sample_LineBox(picBox: HTMLElement, LinePat: Line_Property): void {
        clsDrawLine.Draw_Sample_LineBox?.(picBox, LinePat, this.TotalData.ViewStyle.ScrData);
    }
    //記号描画
    Draw_Mark(g: CanvasRenderingContext2D, Position: point, r: number, Mark: Mark_Property): void {
        appState().clsDrawMarkFan?.Mark_Print?.(g, Position, r, Mark, this.TotalData.ViewStyle.ScrData);
    }
    // 最大値に占める指定値の割合に面積比例する画面半径を返す/TotalData.ViewStyle.ScrData.Radiusのショートカット
    Radius(R_Percent: number, Value: number, max_Value: number): number {
        return this.TotalData.ViewStyle.ScrData.Radius(R_Percent, Value, max_Value);
    }

    //データ項目の中央値を求める
    Get_MedianValue(Layernum: number, DataNum: number): number {

        const ST = new SortingSearch();
        const MV = this.Get_Data_Cell_Array_Without_MissingValue(Layernum, DataNum);
        const n = MV.length;
        const n2 = Math.floor(n / 2);
        for (let i = 0; i < n; i++) {
            ST.Add(Number(MV[i].DataValue));
        }
        ST.AddEnd();
        if ((n % 2) === 1) {
            //奇数個の場合
            return ST.DataPositionRevValue(n2);
        } else {
            //偶数個の場合
            return (ST.DataPositionRevValue(n2 - 1) + ST.DataPositionRevValue(n2)) / 2

        }

    }

    /**属性データ編集から座標系を設定する */
    attrGridZahyoSet(): boolean {
        this.TotalData.ViewStyle.Zahyo = this.MapData.GetPrestigeZahyoMode();
        return this.MapData.EqualizeZahyoMode(this.TotalData.ViewStyle.Zahyo).ok;
    }
    //指定した地図ファイルを削除
    RemoveMapData(MapFileName: string): void {
        this.MapData.RemoveMapData(MapFileName);
    }
    //既存地図ファイル追加
    AddExistingMapData(MData: clsMapdata, MapFileName: string): void {
        if (this.MapData === undefined) {
            this.MapData = new clsAttrMapData();
        }
        this.MapData.AddExistingMapData(MData, MapFileName);
    }
    //同じ名前の地図ファイルが存在する場合、別名をつけて返す
    getUniqueMapFileName(checkMfile: string): string {
        const ExtMfile = this.GetMapFileName();
        if (ExtMfile.indexOf(checkMfile) === -1) {
            return checkMfile;
        } else {
            let Omfile;
            let n = 1;
            do {
                Omfile = checkMfile + n.toString();
                n++;
            } while (ExtMfile.indexOf(Omfile) !== -1)
            return Omfile;
        }
    }
    //地図デーセットをセットする 空白の場合、最初に読み込まれた地図
    SetMapFile(MapFileName: string): clsMapdata | undefined {
        return this.MapData.SetMapFile(MapFileName);
    }

    //地図ファイル数を取得
    GetNumOfMapFile(): number {
        return this.MapData.GetNumOfMapFile();
    }

    //読み込んだ地図ファイルのファイル名の配列を返す
    GetMapFileName(): string[] {
        return this.MapData.GetMapFileName();
    }

    //指定したレイヤ・データ項目で指定した単独表示モードが表示可能か調べる
    //Solo_md:enmSoloMode_Number
    Check_Enable_SoloMode(Solo_md: number, Layernum: number, DataNum: number): boolean {
        switch (this.LayerData[Layernum].atrData.Data[DataNum].DataType) {
            case enmAttDataType.Strings:
                if (Solo_md !== enmSoloMode_Number.StringMode) {
                    return false;
                }
                break;
            case enmAttDataType.Category:
                switch (Solo_md) {
                    case enmSoloMode_Number.MarkSizeMode:
                    case enmSoloMode_Number.MarkBlockMode:
                    case enmSoloMode_Number.ContourMode:
                    case enmSoloMode_Number.MarkTurnMode:
                    case enmSoloMode_Number.MarkBarMode:
                        return false;
                        break;
                }
                break;
        }
        switch (this.LayerData[Layernum].Type) {
            case enmLayerType.Normal:
                case enmLayerType.Mesh:
                if (this.LayerData[Layernum].Shape === enmShape.LineShape) {
                    switch (Solo_md) {
                        case enmSoloMode_Number.ClassHatchMode:
                        case enmSoloMode_Number.ClassMarkMode:
                        case enmSoloMode_Number.MarkBlockMode:
                        case enmSoloMode_Number.ContourMode:
                        case enmSoloMode_Number.MarkTurnMode:
                        case enmSoloMode_Number.MarkBarMode:
                            return false;
                    }
                }
                break;
            case enmLayerType.Trip:
                switch (Solo_md) {
                    case enmSoloMode_Number.ClassHatchMode:
                    case enmSoloMode_Number.ClassMarkMode:
                    case enmSoloMode_Number.MarkSizeMode:
                    case enmSoloMode_Number.MarkBlockMode:
                    case enmSoloMode_Number.ContourMode:
                    case enmSoloMode_Number.MarkTurnMode:
                    case enmSoloMode_Number.MarkBarMode:
                    case enmSoloMode_Number.StringMode:
                        return false;
                }
                break;
            case enmLayerType.Trip_Definition:
                switch (Solo_md) {
                    case enmSoloMode_Number.ClassHatchMode:
                    case enmSoloMode_Number.ClassMarkMode:
                    case enmSoloMode_Number.MarkSizeMode:
                    case enmSoloMode_Number.MarkBlockMode:
                    case enmSoloMode_Number.ContourMode:
                    case enmSoloMode_Number.MarkTurnMode:
                    case enmSoloMode_Number.MarkBarMode:
                    case enmSoloMode_Number.StringMode:
                        return false;
                        break;
                }
                break;
        }

        return true;
    }

    //飾りの初期位置指定
    Set_Acc_First_Position(): void {
        const mv = this.TotalData.ViewStyle;
        const mr = mv.ScrData.MapRectangle;
        const w = mr.width();
        const H = mr.height();
        for (let i = 0; i < mv.MapLegend.Base.Legend_Num; i++) {
            mv.MapLegend.Base.LegendXY[i] = new point(mr.right + (i - i) * w / 50, mr.top + H / 2 + (1 - i) * H / 50);
        }
        mv.MapTitle.Position = new point(mr.centerP().x, mr.bottom + H / 20);
        mv.MapScale.Position = new point(mr.left + w * 4 / 5, mr.bottom + H / 30);
        mv.DataNote.Position = new point(mr.left + w, mr.bottom - H * 0.2);

        const cpx = mv.AttMapCompass.Position.x;
        const cpy = mv.AttMapCompass.Position.y;
        if (cpx >= mr.right + w * 0.3) {
            mv.AttMapCompass.Position.x = mr.right - w * 0.1;
        }
        if (cpx <= mr.left - w * 0.3) {
            mv.AttMapCompass.Position.x = mr.left + w * 0.1;
        }
        if (cpy >= mr.bottom + H * 0.3) {
            mv.AttMapCompass.Position.y = mr.bottom - H * 0.1;
        }
        if (cpy >= mr.top - H * 0.3) {
            mv.AttMapCompass.Position.y = mr.top + H * 0.1;
        }

        if (mv.ScrData.Accessory_Base === enmBasePosition.Screen) {
            this.Change_Acc_Position_by_Accessory_Base_Set_Screen()
        }
    }

    Boundary_Kencode_Arrange(Layernum: number, ObjNum: number): boundArrangeData {
        const O_Code = this.LayerData[Layernum].atrObject.atrObjectData[ObjNum].MpObjCode;
        let badata = new boundArrangeData();

        switch (this.LayerData[Layernum].atrObject.atrObjectData[ObjNum].Objectstructure) {
            case enmKenCodeObjectstructure.MapObj:
                badata = this.LayerData[Layernum].MapFileData.Boundary_Arrange(O_Code, this.LayerData[Layernum].Time);
                break;
            case enmKenCodeObjectstructure.SyntheticObj: {
                const ELine = this.Get_Enable_KenCode_MPLine( Layernum, ObjNum);
                badata = this.LayerData[Layernum].MapFileData.Boundary_Arrange_Sub(ELine);
                break;
            }
        }
        return badata;
    }

    //飾りをウインドウに固定する際の飾り位置をチェック・修正
    Change_Acc_Position_by_Accessory_Base_Set_Screen(): void {
        const mv = this.TotalData.ViewStyle;
        const ms = mv.ScrData.ScrRectangle;
        const lft = ms.left;
        const tp = ms.top;
        const w = ms.width();
        const H = ms.height();
        mv.MapTitle.Position = new point(
            Generic.m_min_max((mv.MapTitle.Position.x - lft) / w, 0.1, 0.9),
            Generic.m_min_max((mv.MapTitle.Position.y - tp) / H, 0.1, 0.95));
        mv.MapScale.Position = new point(
            Generic.m_min_max((mv.MapScale.Position.x - lft) / w, 0.1, 0.8),
            Generic.m_min_max((mv.MapScale.Position.y - tp) / H, 0.1, 0.95));
        mv.DataNote.Position = new point(
            Generic.m_min_max((mv.DataNote.Position.x - lft) / w, 0.1, 0.9),
            Generic.m_min_max((mv.DataNote.Position.y - tp) / H, 0.1, 0.95));

        mv.AttMapCompass.Position = new point(
            Generic.m_min_max((mv.AttMapCompass.Position.x - lft) / w, 0.1, 0.9),
            Generic.m_min_max((mv.AttMapCompass.Position.y - tp) / H, 0.1, 0.9));
        for (let i = 0; i < mv.MapLegend.Base.Legend_Num; i++) {
            mv.MapLegend.Base.LegendXY[i] = new point(
                Generic.m_min_max((mv.MapLegend.Base.LegendXY[i].x - lft) / w, 0.1, 0.8),
                Generic.m_min_max((mv.MapLegend.Base.LegendXY[i].y - tp) / H, 0.1, 0.8));
        }
    }

    //変換した座標を計算済み座標に登録
    Set_MPSubLineXY(MapFileName: string, LineCode: number, XY: point[], ReverseF: boolean): void {
        const mapKey = MapFileName.toUpperCase();
        if (!this.MPSubLine[mapKey]) {
            this.MPSubLine[mapKey] = {};
        }
        const LinePoint = this.MPSubLine[mapKey];
        const LP = new strGetLinePointAPI_Info();
        LP.GetF = true;
        LP.ReverseF = ReverseF;
        LP.Point = Generic.ArrayClone(XY);
        LP.Drawn = false;
        LinePoint[LineCode] = LP;
    }

    /** MPSubLine.Drawnの値をfalseにする*/
    ResetMPSubLineDrawn(MapFileName: string): void {
        const mapKey = MapFileName.toUpperCase();
        const LinePoint = this.MPSubLine[mapKey];
        if (!LinePoint) return;
        for (const lineCode in LinePoint) {
            if (Object.prototype.hasOwnProperty.call(LinePoint, lineCode)) {
                LinePoint[lineCode].Drawn = false;
            }
        }
    }

    getMpLineDrawn(MapFileName: string, LineCode: number): boolean | undefined {
        const mapKey = MapFileName.toUpperCase();
        const LinePoint = this.MPSubLine[mapKey];
        if (LinePoint?.[LineCode] === undefined) {
            return undefined;
        } else {
            return LinePoint[LineCode].Drawn;
        }
    }
    setMpLineDrawn(MapFileName: string, LineCode: number, value: boolean): void {
        const mapKey = MapFileName.toUpperCase();
        if (!this.MPSubLine[mapKey]) {
            this.MPSubLine[mapKey] = {};
        }
        if (!this.MPSubLine[mapKey][LineCode]) {
            this.MPSubLine[mapKey][LineCode] = new strGetLinePointAPI_Info();
        }
        this.MPSubLine[mapKey][LineCode].Drawn = value;
    }


    //線種の使用チェック
    getLineKindUseChecked(MapFileName: string, lineKindNum: number, PatternNum: number): boolean {
        const n = this.MapData.GetLineKindPosition(MapFileName, lineKindNum, PatternNum);
        return this.LineKindUse[n];
    }
    setLineKindUseChecked(MapFileName: string, lineKindNum: number, PatternNum: number, value: boolean): void {
        const n = this.MapData.GetLineKindPosition(MapFileName, lineKindNum, PatternNum);
        this.LineKindUse[n] = value;
    }

    /**線種の使用状況を取得 */
    Get_LineKindUsedList(): boolean[] {
        return this.LineKindUse;
    }

    //地図データの保存してある計算済み座標を取得する
    Get_MPSubLineXY(MapFileName: string, LineCode: number, ReverseF: boolean): point[] | undefined {
        let xy: point[] = [];
        const mapKey = MapFileName.toUpperCase();
        const LinePoint = this.MPSubLine[mapKey];
        if (!LinePoint) {
            return undefined;
        }
        const MPSubLinePointXY = LinePoint[LineCode];
        if (MPSubLinePointXY !== undefined) {
            if (MPSubLinePointXY.GetF === true) {
                if (ReverseF === MPSubLinePointXY.ReverseF) {
                    xy = Generic.ArrayClone(MPSubLinePointXY.Point);
                } else {
                    //反転コピー
                    const np = MPSubLinePointXY.Point.length - 1
                    for (let i = 0; i < np + 1; i++) {
                        xy.push(MPSubLinePointXY.Point[np - i].Clone());
                    }
                }
                return xy;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    //計算済み座標と使用線種をリセットする
    ResetMPSubLineXY(): void {
        for (const key in this.MPSubLine) {
            delete this.MPSubLine[key];
        }
        const FList = this.MapData.GetMapFileName();
        for (let i = 0; i < this.MapData.GetNumOfMapFile(); i++) {
            // for (j = 0; j < this.MapData.SetMapFile(FList[i]).Map.ALIN; j++) {
            //     let d = new strGetLinePointAPI_Info()
            // }
            this.MPSubLine[FList[i]] = {};//strGetLinePointAPI_Info
        }
        this.LineKindUse = [];
        this.TempData.PointObjectKindUsedStack = [];
    }

    //**点ダミーオブジェクトの凡例表示用に記録する */
    AddPointObjectKindUsed(MapFilename: string, ObjKindNumber: number, MK: Mark_Property): void {
        for(const i in this.TempData.PointObjectKindUsedStack){
            const Ob=this.TempData.PointObjectKindUsedStack[i];
            if(( Ob.MapFileName=== MapFilename )&&( Ob.ObjectKindNumber === ObjKindNumber) ){
                //記録済み
                return;
            }
        }
        const newObk = new strObjectKindUsed_Info();
        newObk.MapFileName = MapFilename;
        newObk.ObjectKindNumber = ObjKindNumber;
        newObk.Mark = MK;
        newObk .ObjectKindName = this.SetMapFile(MapFilename).ObjectKind[ObjKindNumber].Name;
        this.TempData.PointObjectKindUsedStack.push(newObk);
    }

    //オブジェクトの表示チェックをクリア
    ResetObjectPrintedCheckFlag(): void {
        this.TempData.ObjectPrintedCheckFlag = [];
        for (let i = 0; i < this.TotalData.LV1.Lay_Maxn; i++) {
            // 必要に応じて配列を初期化
        }
    }

    //データ読み込み後の共通初期化
    initTotalData_andOther(): void {
        const DourceType = this.TotalData.LV1.DataSourceType;
        if ((DourceType === enmDataSource.CSV) ||
            (DourceType === enmDataSource.Clipboard) ||
            (DourceType === enmDataSource.Viwer) ||
            (DourceType === enmDataSource.Shapefile) ||
            (DourceType === enmDataSource.DataEdit)) {
            this.TotalData.initTotalData();
            const tv = this.TotalData.ViewStyle;
            tv.AttMapCompass = this.SetMapFile("").Map.MapCompass.Clone();
            tv.MapScale.Visible = this.SetMapFile("").Map.Detail.ScaleVisible;
            tv.MapScale.Unit = this.SetMapFile("").Map.SCL_U;
            this.Check_Vector_Object();
            if (this.TotalData.ViewStyle.Zahyo.Mode === enmZahyo_mode_info.Zahyo_Ido_Keido) {
                //緯度経度の場合の経緯線設定
                const w = this.TempData.MapAreaLatLon.width();
                let v;
                let visi = false;
                if (w < 30) {
                    v=1;
                } else if (w < 60) {
                    v = 2;
                } else if (w < 90) {
                    v = 5;
                } else if (w < 180) {
                    visi = true;
                    v = 10;
                } else {
                    visi = true;
                    v = 15;
                }
                this.TotalData.ViewStyle.LatLonLine_Print.Lat_Interval = v;
                this.TotalData.ViewStyle.LatLonLine_Print.Lon_Interval = v;
                this.TotalData.ViewStyle.LatLonLine_Print.Visible = visi;
            }
            this.initDummuyPointObjectMark();
        } else {
            this.TempData.MapAreaLatLon = this.get_DataLatLonBox();
        }

        this.LinePatternCheck();
        this.PrtObjectSpatialIndex();
    }

    //単独表示モードで選択中のデータ項目のタイトルを返す
    Get_SelectedDataTitle(): string {
        const l = this.TotalData.LV1.SelectedLayer;
        const d = this.LayerData[l].atrData.SelectedIndex;
        return this.LayerData[l].atrData.Data[d].Title;
    }

    //レイヤごとのオブジェクトの空間インデックス作成
    PrtObjectSpatialIndex(): void {
        const mrect = this.TotalData.ViewStyle.ScrData.MapRectangle;
        for (let i = 0; i < this.TotalData.LV1.Lay_Maxn; i++) {
            const LD = this.LayerData[i];
            const obn = LD.atrObject.ObjectNum;
            switch (LD.Shape) {
                case enmShape.PointShape: {
                    let XYSize;
                    if (obn > 100) {
                        XYSize = Math.sqrt(obn) / 2;
                    } else {
                        XYSize = Math.sqrt(obn);
                    }
                    const index = new clsSpatialIndexSearch(SpatialPointType.SinglePoint, true, mrect, mrect.width() / XYSize);
                    LD.PrtSpatialIndex = index;
                    for (let j = 0; j < obn; j++) {
                        index.AddSinglePoint(LD.atrObject.atrObjectData[j].CenterPoint, j)
                    }
                    break;
                }
                case enmShape.LineShape: {
                    const XYSize = Math.sqrt(obn) / 4;
                    const index = new clsSpatialIndexSearch(SpatialPointType.SPILine, true, mrect, mrect.width() / XYSize);
                    LD.PrtSpatialIndex = index;
                    for (let j = 0; j < obn; j++) {
                        if (LD.Type === enmLayerType.Mesh) {
                            index.AddLine(4, LD.atrObject.atrObjectData[j].MeshPoint, j)
                        } else {
                            const ELine = this.Get_Enable_KenCode_MPLine(i, j);
                            for (const k in ELine) {
                                const LDM = LD.MapFileData.MPLine[ELine[k].LineCode];
                                index.AddLine(LDM.NumOfPoint, LDM.PointSTC, j);
                            }
                        }
                    }
                    break;
                }
                case enmShape.PolygonShape: {
                    const index = new clsSpatialIndexSearch(SpatialPointType.SPIRect, false, mrect);
                    LD.PrtSpatialIndex = index;
                    for (let j = 0; j < obn; j++) {
                        const ObjRect = this.Get_Kencode_Object_Circumscribed_Rectangle(i, j);
                        index.AddRect(ObjRect, j);
                    }
                    break;
                }
            }
            LD.PrtSpatialIndex?.AddEnd();
        }

    }

    /**レイヤの地図ファイルのオブジェクト番号からオブジェクトの外周を取得 */
    Get_Object_Circumscribed_Rectangle(Layernum: number, ObjCode: number): rectangle {
        return this.LayerData[Layernum].MapFileData.MPObj[ObjCode].Circumscribed_Rectangle;
    }
    //レイヤのオブジェクト位置からオブジェクトの外周を取得
    Get_Kencode_Object_Circumscribed_Rectangle(Layernum: number, ObjNum: number): rectangle {
        const LD = this.LayerData[Layernum];
        switch (LD.Type) {
            case enmLayerType.Mesh: {
                return LD.atrObject.atrObjectData[ObjNum].MeshRect;
                break;
            }
            case enmLayerType.DefPoint: {
                const LDA = LD.atrObject.atrObjectData[ObjNum];
                const pt: point[] = [LDA.CenterPoint, LDA.Symbol, LDA.Label];
                const rect = spatial.getCircumscribedRectangle(pt);
                return rect;
                break;
            }
        }
        const code = LD.atrObject.atrObjectData[ObjNum].MpObjCode;
        switch (LD.atrObject.atrObjectData[ObjNum].Objectstructure) {
            case enmKenCodeObjectstructure.MapObj: {
                return LD.MapFileData.MPObj[code].Circumscribed_Rectangle;
                break;
            }
            case enmKenCodeObjectstructure.SyntheticObj: {
                return LD.atrObject.MPSyntheticObj[code].Circumscribed_Rectangle;
                break;
            }

        }
    }

    //ダミー点オブジェクトの記号を初期化
    initDummuyPointObjectMark(): void {
        const vs = this.TotalData.ViewStyle;
        vs.MapLegend.Line_DummyKind.Line_Visible_Number_STR = "1".repeat(this.GetAllMapLineKindNum());
        vs.DummyObjectPointMark = {};
        const PointObjG = this.GetAllPointObjectGroup();
        for (const key in PointObjG) {
            if (PointObjG[key].length > 0) {
                const d = [];
                for (let i = 0; i < PointObjG[key].length; i++) {
                    const dd = new strDummyObjectPointMark_Info();
                    dd.ObjectKindName = PointObjG[key][i];
                    dd.Mark = clsBase.Mark();
                    d.push(dd);
                }
                vs.DummyObjectPointMark[key] = d;
            }
        }
    }

    //点オブジェクトグループのオブジェクト名のDictionary（地図ファイル名,オブジェクトグループ名）を取得
    GetAllPointObjectGroup(): { [key: string]: string[] } {
        return this.MapData.GetAllPointObjectGroup();
    }

    /**読み込んだ地図ファイルの全線種（オブジェクト連動型を含む）一覧を返す */
    Get_AllMapLineKind(): LPatSek_Info[] {
        return this.MapData.GetAllMapLineKind();
    }

    /**読み込んだ地図ファイルの全線種名（オブジェクト連動型を含む）一覧を返す */
    GetAllMapLineKindName(): string[] {
        return this.MapData.GetAllMapLineKindName();
    }
    //読み込んだ地図ファイルの全線種数（オブジェクト連動型を含む）を返す
    GetAllMapLineKindNum(): number {
        return this.MapData.GetAllMapLineKindNum();
    }

    //表示領域の最大サイズを求めてMapRectangleに格納する
    Check_Vector_Object(): void {
        let TotalScrRect = new rectangle();

        for (let i = 0; i < this.TotalData.LV1.Lay_Maxn; i++) {
            let FirstF = false;
            let ScrRect = new rectangle();
            const ld = this.LayerData[i];
            if (ld.Type !== enmLayerType.Trip_Definition) {
                const MapFileData = ld.MapFileData;
                if (!MapFileData) {
                    continue;
                }
                const LayerTime = ld.Time;
                if (this.TotalData.ViewStyle.Dummy_Size_Flag === true) {

                    for (let j = 0; j < MapFileData.Map.Kend; j++) {
                        const mp = MapFileData.MPObj[j];
                        if (ld.DummyGroup.indexOf(mp.Kind) !== -1) {
                            const cxy = MapFileData.Get_Enable_CenterP(j, LayerTime);
                            if (cxy !== undefined) {
                                if (FirstF === false) {
                                    ScrRect = new rectangle(cxy);
                                    FirstF = true;
                                } else {
                                    ScrRect = spatial.getCircumscribedRectangle(mp.Circumscribed_Rectangle, ScrRect)
                                }
                            }
                        }
                    }
                    for (let j = 0; j < ld.Dummy.length; j++) {
                        const ocode = ld.Dummy[j].code;
                        if (FirstF === false) {
                            const cxy = MapFileData.Get_Enable_CenterP(ocode, LayerTime);
                            if (cxy !== undefined) {
                                ScrRect = new rectangle(cxy);
                                FirstF = true;
                            }
                        }
                        ScrRect = spatial.getCircumscribedRectangle(MapFileData.MPObj[ocode].Circumscribed_Rectangle, ScrRect);
                    }
                    switch (ld.Type) {
                        case enmLayerType.Trip:
                            break;
                        case enmLayerType.Mesh:{
                            for (let j = 0; j < ld.atrObject.ObjectNum; j++) {
                                const Rect =ld.atrObject.atrObjectData[j].MeshRect;
                                if (FirstF === false) {
                                    ScrRect = Rect;
                                    FirstF = true;
                                }
                                ScrRect = spatial.getCircumscribedRectangle(Rect, ScrRect);
                            }
                            break;
                        }
                        case enmLayerType.DefPoint:{
                            for (let j = 0; j < ld.atrObject.ObjectNum; j++) {
                                const p = ld.atrObject.atrObjectData[j].CenterPoint;
                                if (FirstF === false) {
                                    ScrRect = new rectangle(p);
                                    FirstF = true;
                                }
                                ScrRect = spatial.getCircumscribedRectangle(p, ScrRect);
                            }
                            break;
                        }
                        case enmLayerType.Normal:{
                            for (let j = 0; j < ld.atrObject.ObjectNum; j++) {
                                const ocode = ld.atrObject.atrObjectData[j].MpObjCode;
                                switch (ld.atrObject.atrObjectData[j].Objectstructure) {
                                    case enmKenCodeObjectstructure.MapObj:
                                        if (FirstF === false) {
                                            const cxy = ld.atrObject.atrObjectData[j].CenterPoint;
                                            ScrRect = new rectangle(cxy, new size(0, 0));;
                                            FirstF = true;
                                        }
                                        ScrRect = spatial.getCircumscribedRectangle(MapFileData.MPObj[ocode].Circumscribed_Rectangle, ScrRect);
                                        break;
                                    case enmKenCodeObjectstructure.SyntheticObj:
                                        ScrRect = spatial.getCircumscribedRectangle(ld.atrObject.MPSyntheticObj[ocode].Circumscribed_Rectangle, ScrRect);
                                        break;
                                }
                            }
                            break;
                        }
                    }
                }
            }
            if (i === 0) {
                TotalScrRect = ScrRect.Clone();     
            }else{
                TotalScrRect=spatial.getCircumscribedRectangle(TotalScrRect, ScrRect);
            }
        }
        if (TotalScrRect.left === TotalScrRect.right) {
            TotalScrRect.left = TotalScrRect.left - 1;
            TotalScrRect.right = TotalScrRect.left + 2;
        }
        if (TotalScrRect.top === TotalScrRect.bottom) {
            TotalScrRect.top = TotalScrRect.top - 1;
            TotalScrRect.bottom = TotalScrRect.top + 2;
        }
        this.TotalData.ViewStyle.ScrData.MapRectangle = TotalScrRect;
        this.TempData.MapAreaLatLon = this.get_DataLatLonBox();
    }

    getSolomodeWord(md: number): string {

        switch (md) {
            case enmSoloMode_Number.ClassPaintMode: {
                return "ペイントモード";
                break;
            }
            case enmSoloMode_Number.ClassMarkMode: {
                return "階級記号モード";
                break;
            }
            case enmSoloMode_Number.ClassODMode: {
                return "線モード";
                break;
            }
            case enmSoloMode_Number.MarkSizeMode: {
                return "記号の大きさモード";
                break;
            }
            case enmSoloMode_Number.MarkBlockMode: {
                return "記号の数モード";
                break;

            }
            case enmSoloMode_Number.MarkTurnMode: {
                return "記号の回転モード";
                break;
            }
            case enmSoloMode_Number.MarkBarMode: {
                return "棒の高さモード";
                break;
            }
            case enmSoloMode_Number.ContourMode: {
                return "等値線モード";
                break;
            }
            case enmSoloMode_Number.StringMode: {
                // @ts-ignore - selDiv and divString are not defined, appears to be dead code
                // selDiv = divString;
                return "文字モード";
                break;
            }
        }
    }

    /**現在のレイヤのグラフモードを返す */
    layerGraph(): IGraphMode {
        const state = appState();
        const Layernum = this.TotalData.LV1.SelectedLayer;
        return state.attrData.LayerData[Layernum].LayerModeViewSettings.GraphMode;
    }

    /**現在のレイヤのグラフモードの選択データセットを返す */
    nowGraph(): IGraphDataSet {
        const state = appState();
        const Layernum = this.TotalData.LV1.SelectedLayer;
        const gv=state.attrData.LayerData[Layernum].LayerModeViewSettings.GraphMode;
        return gv.DataSet[gv.SelectedIndex];
    }

    /**現在のレイヤのラベルモードを返す */
    layerLabel(): ILabelMode {
        const state = appState();
        const Layernum = this.TotalData.LV1.SelectedLayer;
        return state.attrData.LayerData[Layernum].LayerModeViewSettings.LabelMode;
    }
    /**現在のレイヤのラベルモードの選択データセットを返す */
    nowLabel(): ILabelDataSet {
        const state = appState();
        const Layernum = this.TotalData.LV1.SelectedLayer;
        const lv=state.attrData.LayerData[Layernum].LayerModeViewSettings.LabelMode;
        return lv.DataSet[lv.SelectedIndex];;
    }
    /**現在の重ね合わせモードのデータセットを返す */
    nowSeries(): ISeriesDatasetInfo {
        const state = appState();
        const series = state.attrData.TotalData.TotalMode.Series;
        return series.DataSet[series.SelectedIndex];
    }

    /**現在の重ね合わせモードのデータセットを返す */
    nowOverlay(): IOverLayDatasetInfo {
        const state = appState();
        const over = state.attrData.TotalData.TotalMode.OverLay;
        return over.DataSet[over.SelectedIndex];
    }

    /**現在のレイヤの位置を返す */
    nowLayer(): ILayerDataInfo {
        const state = appState();
        const Layernum = this.TotalData.LV1.SelectedLayer;
        return state.attrData.LayerData[Layernum];
    }

    /**
     * 現在のレイヤ・データ項目の位置を返す */
    nowData(): IDataItem {
        const state = appState();
        const Layernum = this.TotalData.LV1.SelectedLayer;
        const DataNum = this.LayerData[Layernum].atrData.SelectedIndex;
        return state.attrData.LayerData[Layernum].atrData.Data[DataNum];
    }

    /**現在のレイヤ・データ項目のSoloModeViewSettings位置を返す */
    nowDataSolo(): ISoloModeViewSettings {
        const state = appState();
        const Layernum = this.TotalData.LV1.SelectedLayer;
        const DataNum = this.LayerData[Layernum].atrData.SelectedIndex;
        return state.attrData.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings;
    }

    //単独表示モードのモードを取得
    getSoloMode(LayerNum: number, DataNum: number): number {
        return this.LayerData[LayerNum].atrData.Data[DataNum].SoloModeViewSettings.SoloMode;
    }

    setSoloMode(LayerNum: number, DataNum: number, mode: number): void {
        this.LayerData[LayerNum].atrData.Data[DataNum].SoloModeViewSettings.SoloMode = mode;
    }

    //データの緯度経度の領域を返す
    get_DataLatLonBox(): rectangle {
        let IdoKedoRect = new rectangle();
        const Zahyo = this.TotalData.ViewStyle.Zahyo;
        if (Zahyo.Mode !== enmZahyo_mode_info.Zahyo_Ido_Keido) {
            return IdoKedoRect;
        }
        switch (Zahyo.Projection) {
            case enmProjection_Info.prjMercator:
            case enmProjection_Info.prjMiller:
            case enmProjection_Info.prjSeikyoEntou:
            case enmProjection_Info.prjLambertSeisekiEntou:
                IdoKedoRect = spatial.Get_Reverse_Rect(this.TotalData.ViewStyle.ScrData.MapRectangle, Zahyo);
                return IdoKedoRect;
                break;
        }
        const pf = this.LayerData[0].atrObject.atrObjectData[0].CenterPoint.Clone();
        const pf2 = spatial.Get_Reverse_XY(pf, Zahyo);
        let LLRect = new rectangle(pf2, new size(0, 0));
        const LineCheck: Record<string, boolean[]> = {} // Dictionary(Of String, Boolean())
        for (let i = 0; i < this.TotalData.LV1.Lay_Maxn; i++) {
            const ld = this.LayerData[i];
            if (ld.Type !== enmLayerType.Trip_Definition) {
                const MapFileData = ld.MapFileData;
                if (!MapFileData) {
                    continue;
                }
                if (Object.keys(LineCheck).indexOf(ld.MapFileName) === -1) {
                    const LineL: boolean[] = Array.from({ length: MapFileData.Map.ALIN }, () => false);
                    LineCheck[ld.MapFileName] = LineL;
                }
                const LC = (LineCheck as Record<string, boolean[]>)[ld.MapFileName];
                const LayerTime = ld.Time;
                if (this.TotalData.ViewStyle.Dummy_Size_Flag === true) {
                    //ダミー領域も範囲に含む場合
                    const dmObj: number[] = [];
                    if (ld.DummyGroup.length > 0) {
                        const ObjGIndex: boolean[] = Array.from({ length: MapFileData.Map.OBKNum }, () => false);
                        for (let j = 0; j < ld.DummyGroup.length; j++) {
                            ObjGIndex[ld.DummyGroup[j]] = true;
                        }
                        for (let j = 0; j < MapFileData.Map.Kend; j++) {
                            if (ObjGIndex[MapFileData.MPObj[j].Kind] === true) {
                                dmObj.push(j);
                            }
                        }
                    }
                    for (let j = 0; j < ld.Dummy.length; j++) {
                        const ocode = ld.Dummy[j].code;
                        dmObj.push(ocode);
                    }
                    for (let j = 0; j < dmObj.length; j++) {
                        if (MapFileData.MPObj[j].Shape === enmShape.PointShape) {
                            const cp = MapFileData.Get_Enable_CenterP(dmObj[j], LayerTime);
                            const cp2 = spatial.Get_Reverse_XY(cp, Zahyo);
                            LLRect = spatial.getCircumscribedRectangle(cp2, LLRect);
                        } else {
                            const ELine = MapFileData.Get_EnableMPLine(dmObj[j], LayerTime);
                            for (let k = 0; k < ELine.length; k++) {
                                if (LC[ELine[k].LineCode] === false) {
                                    LLRect=this.getLinelatLon(MapFileData, ELine[k].LineCode, LLRect);
                                    LC[ELine[k].LineCode] = true;
                                }
                            }
                        }
                    }
                }
                switch (ld.Type) {
                    case enmLayerType.Trip:
                        break;
                    case enmLayerType.Mesh: {
                        for (let j = 0; j < ld.atrObject.ObjectNum; j++) {
                            const Meshcode = ld.atrObject.atrObjectData[j].Name;
                            const RectLatLon = spatial.Get_Ido_Kedo_from_MeshCode(Meshcode, ld.MeshType);
                            const RectPoints = [
                                RectLatLon.NorthWest?.toPoint() || new point(),
                                new latlon(RectLatLon.NorthWest?.lat || 0, RectLatLon.SouthEast?.lon || 0).toPoint(),
                                RectLatLon.SouthEast?.toPoint() || new point(),
                                new latlon(RectLatLon.SouthEast?.lat || 0, RectLatLon.NorthWest?.lon || 0).toPoint()
                            ];
                            LLRect = spatial.getCircumscribedRectangle(RectPoints, LLRect);
                        }
                        break;
                    }
                    case enmLayerType.DefPoint: {
                        for (let j = 0; j < ld.atrObject.ObjectNum; j++) {
                            const p = spatial.Get_Reverse_XY(ld.atrObject.atrObjectData[j].CenterPoint, Zahyo)
                            LLRect = spatial.getCircumscribedRectangle(p, LLRect);
                        }
                        break;
                    }
                    case enmLayerType.Normal: {
                        for (let j = 0; j < ld.atrObject.ObjectNum; j++) {
                            if (ld.Shape === enmShape.PointShape) {
                                const p = spatial.Get_Reverse_XY(ld.atrObject.atrObjectData[j].CenterPoint, Zahyo)
                                LLRect = spatial.getCircumscribedRectangle(p, LLRect)
                            } else {
                                const ELine = this.Get_Enable_KenCode_MPLine(i, j)
                                for (let k = 0; k < ELine.length; k++) {
                                    const cd = ELine[k].LineCode;
                                    if (LC[cd] === false) {
                                        LLRect=this.getLinelatLon(MapFileData, cd, LLRect);
                                        LC[cd] = true;
                                    }
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }
        return LLRect;
    }

    getLinelatLon(mapdata: clsMapdata, LineNumber: number, rect: rectangle): rectangle {
        const ml=mapdata.MPLine[LineNumber];
        const LP: point[] = [];
        for (let i = 0; i <  ml.NumOfPoint;i++){
            LP.push( spatial.Get_Reverse_XY(ml.PointSTC[i], this.TotalData.ViewStyle.Zahyo))
        }
        const rectf = spatial.getCircumscribedRectangle(LP);
        const newRect = spatial.getCircumscribedRectangle(rect, rectf)  ;
        return newRect;
    }
    //MANDARAファイルデータを開く
    OpenNewMandaraFile(MapDataList: clsMapdata[], attrText: string, filename: string, ext: string): { ok: boolean; emes: string } {
        let retv;
        if (ext === "clipboard") {
            retv = this.SetDataFromClipBoard(MapDataList, attrText)
            this.TotalData.LV1.DataSourceType = enmDataSource.Clipboard;
            this.TotalData.LV1.FileName = "Clipboard";
        }
        if (ext === "csv") {
            retv = this.SetDataFromClipBoard(MapDataList, attrText);
            this.TotalData.LV1.DataSourceType = enmDataSource.CSV;
            this.TotalData.LV1.FileName = filename;
        }
        
        if (ext === "mdrj") {
            retv = this.SetDataFromMDRJ(MapDataList, attrText);
            this.TotalData.LV1.DataSourceType = enmDataSource.MDRJ;
            this.TotalData.LV1.FileName = filename;
        }
        if (ext === "mdrmj") {
            retv = this.SetDataFromMDRJ(MapDataList, attrText);
            this.TotalData.LV1.DataSourceType = enmDataSource.MDRMJ;
            this.TotalData.LV1.FileName = filename;
        }
        if (retv.ok === true) {
            this.initTotalData_andOther();
        }
        return retv;
    }
    //mdrjファイルから読み込み
    SetDataFromMDRJ(MapDataList: clsMapdata[], attrText: string): DataLoadResult {
        const state = appState();
        this.MapData = new clsAttrMapData();
        for (let i = 0; i < MapDataList.length; i++) {
            this.MapData.AddExistingMapData(MapDataList[i], MapDataList[i].Map.FileName);
        }

        const odata = JSON.parse(attrText) as MDRJData;
        
        const mapData = odata.mapData;
        if (mapData) {
            //地図データ付属形式
            for (const mapfname in mapData) {
                const mdata = new clsMapdata();
                mdata.openJsonMapData(mapData[mapfname], true);
                mdata.Map.FileName = mapfname;
                this.MapData.AddExistingMapData(mdata, mdata.Map.FileName);
            }
        }

        this.TotalData.initTotalData();
        const existFont: string[] = [];
        const nonExistFont: string[] = [];
        const lv1 = this.TotalData.LV1;
        lv1.Comment = odata.TotalData.LV1.Comment;
        lv1.Lay_Maxn = odata.TotalData.LV1.Lay_Maxn;
        lv1.Print_Mode_Total = odata.TotalData.LV1.Print_Mode_Total;
        lv1.SelectedLayer = odata.TotalData.LV1.SelectedLayer;

        const vs = this.TotalData.ViewStyle;
        const oldvs = odata.TotalData.ViewStyle;
        vs.AttMapCompass = cnvCompass(oldvs.AttMapCompass);
        const oldSCR = oldvs.ScrData;
        const vss = vs.ScrData;
        vss.Accessory_Base = oldSCR.Accessory_Base;
        vss.frmPrint_FormSize = cnvRectgle(oldSCR.frmPrint_FormSize);
        vss.GSMul = oldSCR.GSMul;
        vss.MapRectangle = cnvRectgle(oldSCR.MapRectangle);
        vss.MapScreen_Scale = cnvRectgle(oldSCR.MapScreen_Scale);
        Object.assign(vss.PrinterMG, oldSCR.PrinterMG);
        Object.assign(vss.ScreenMG, oldSCR.ScreenMG);
        vss.Screen_Margin.ClipF = oldSCR.Screen_Margin.ClipF;
        vss.Screen_Margin.rect = cnvRectgle(oldSCR.Screen_Margin.rect);
        vss.ScrRectangle = cnvRectgle(oldSCR.ScrRectangle);
        vss.ScrView = cnvRectgle(oldSCR.ScrView);
        Object.assign(vss.ThreeDMode, oldSCR.ThreeDMode);

        vs.Dummy_Size_Flag = oldvs.Dummy_Size_Flag;
        //点ダミーオブジェクトの記号
        const oldDOG = oldvs.DummyObjectPointMark ?? {};
        vs.DummyObjectPointMark = vs.DummyObjectPointMark ?? {};
        for (const key in oldDOG) {
            const d = oldDOG[key] ?? [];
            const nd: strDummyObjectPointMark_Info[] = [];
            for (let i = 0; i < d.length; i++) {
                const src = d[i];
                const dd = new strDummyObjectPointMark_Info();
                dd.ObjectKindName = src.ObjectKindName;
                dd.Mark = cnvMarkProperty(src.Mark);
                nd.push(dd);
            }
            vs.DummyObjectPointMark[key] = nd;
        }
        const lp = vs.LatLonLine_Print;
        const olp = oldvs.LatLonLine_Print ?? {
            Lat_Interval: 1,
            Lon_Interval: 1,
            LPat: clsBase.Line(),
            Order: 0,
            Visible: false
        };
        lp.Lat_Interval = olp.Lat_Interval ?? 1;
        lp.Lon_Interval = olp.Lon_Interval ?? 1;
        lp.LPat = cnvLineProperty(olp.LPat);
        lp.Order = olp.Order;
        lp.Visible = olp.Visible;

        vs.MapLegend = cnvMapLegend(oldvs.MapLegend);

        vs.MapPrint_Flag = oldvs.MapPrint_Flag;
        vs.MapScale = cnvMapSCL(oldvs.MapScale);
        vs.MapTitle = cnvMapTitle(oldvs.MapTitle);
        vs.DataNote = cnvDataNode(oldvs.DataNote);
        vs.Missing_Data = cnvMissingData(oldvs.Missing_Data);
        vs.PointPaint_Order = oldvs.PointPaint_Order;
        if(vs.PointPaint_Order===undefined){//試作版0.0のmdrjファイルの問題への対処
            vs.PointPaint_Order=enmPointOnjectDrawOrder.LowerToUpperCategory;
        }
        vs.Screen_Back = cnvScreen_Back(oldvs.Screen_Back);
        vs.AccessoryGroupBox = cnvAccessoryGroupBox(oldvs.AccessoryGroupBox);
        vs.Screen_Setting = cnvScreen_Setting(oldvs.Screen_Setting);
        vs.ValueShow=cnvValueShow(oldvs.ValueShow);
        vs.SouByou = cnvSouByou(oldvs.SouByou);
        vs.TileMapView = cnvTileMapView(oldvs.TileMapView);
        const oldSymbolLine = oldvs.SymbolLine ?? { Visible: false, Line: clsBase.Line() };
        vs.SymbolLine.Visible = oldSymbolLine.Visible ?? false;
        vs.SymbolLine.Line = cnvLineProperty(oldSymbolLine.Line ?? clsBase.Line());
        vs.Zahyo = new Zahyo_info();
        Object.assign(vs.Zahyo, oldvs.Zahyo);
        vs.Zahyo.CenterXY=cnvPoint(oldvs.Zahyo.CenterXY);

        this.TotalData.Condition = cnvCondition(odata.TotalData.Condition);
        this.TotalData.TotalMode = cnvTotalmode(odata.TotalData.TotalMode);
        //レイヤデータの読み込み
        for (let i = 0; i < lv1.Lay_Maxn; i++) {
            this.LayerData[i] = cnvLayerData(odata.LayerData[i] as JsonObject);
        }
        
        //レイヤに地図ファイルを設定

        let mpfileEr="";
        for (let i = 0; i < this.TotalData.LV1.Lay_Maxn; i++) {
            const fname = this.LayerData[i].MapFileName.toUpperCase();
            if (this.MapData.CheckMapfileExists(fname) === true) {
                this.LayerData[i].MapFileData = this.MapData.SetMapFile(fname);
                this.LayerData[i].MapFileObjectNameSearch = this.MapData.SetObject_Name_Search(fname);
            } else {
                let tx: string | JsonObject = "";
                switch (fname) {
                    case "JAPAN.MPFJ":
                    case "日本緯度経度.MPFJ":
                    case "WORLD.MPFJ":
                        tx = state.preReadMapFile[fname];
                        break;
                } 
                if (tx !== "") {
                    const mapdata = new clsMapdata();
                    mapdata.openJsonMapData(tx as JsonObject);
                    this.MapData.AddExistingMapData(mapdata, fname);
                    this.LayerData[i].MapFileData = this.MapData.SetMapFile(fname);
                    this.LayerData[i].MapFileObjectNameSearch = this.MapData.SetObject_Name_Search( fname);
                }else{
                    mpfileEr += "地図ファイル" + fname + "を読み込んでください。\n";
                }
            }
        }
        if(mpfileEr!==""){
            return { ok: false, emes: mpfileEr };
        }

        let ObjectErrorMessage="";
        //線種の設定
        const saveLPat = odata.saveLPat ?? { MapNum: 0, MapFileName: [], LpatNumByMapfile: [], Lpat: [] };
        let ct = 0;
        for (let i = 0; i < saveLPat.MapNum; i++) {
            const mpk = this.SetMapFile(saveLPat.MapFileName[i]).Map.LpNum;
            let setN = 0;
            //線種名が地図ファイルと属性データファイルと同じものを探し、セットする
            for (let j = 0; j < mpk; j++) {
                const mapLkind = this.SetMapFile(saveLPat.MapFileName[i]).LineKind[j]
                for (let k = 0; k < saveLPat.LpatNumByMapfile[i]; k++) {
                    if (saveLPat.Lpat[ct + k].Name === mapLkind.Name) {
                        if (mapLkind.NumofObjectGroup !== saveLPat.Lpat[ct + k].NumofObjectGroup) {
                            // グループ数が異なる場合は処理なし
                        } else {
                            for (let og = 0; og < mapLkind.NumofObjectGroup; og++) {
                                if(mapLkind.ObjGroup[og].GroupNumber===saveLPat.Lpat[ct + k].ObjGroup[og].GroupNumber){
                                    mapLkind.ObjGroup[og].Pattern=cnvLineProperty( saveLPat.Lpat[ct + k].ObjGroup[og].Pattern);
                                }
                            }
                            setN++;
                            break;
                        }
                    }
                }
            }
            if ((setN !== mpk) || (setN !== saveLPat.LpatNumByMapfile[i])) {
                ObjectErrorMessage = "地図ファイル" + saveLPat.MapFileName[i] + "の線種が変更されています。" + "\n"
            }
            ct += saveLPat.LpatNumByMapfile[i];
        }
        
        //投影法の設定
        if (this.TotalData.ViewStyle.Zahyo.Projection !== this.MapData.SetMapFile("").Map.Zahyo.Projection) {
            const MapFileList = state.attrData.GetMapFileName();
            for (let i = 0; i < MapFileList.length; i++) {
                state.attrData.SetMapFile(MapFileList[i]).Convert_ZahyoMode(this.TotalData.ViewStyle.Zahyo);
            }
        }
        return { ok: true, emes: ObjectErrorMessage };

        //-----------------
        function cnvAccessoryGroupBox(oa: JsonObject): strAccessoryGroupBox_Info {
            const d=new strAccessoryGroupBox_Info();
            Object.assign(d, oa);
            d.Back=cnvBackGround_Box_Property(oa.Back as JsonObject);
            return d;
        }

        function cnvLayerData(oldLay: JsonObject): strLayerDataInfo {
            const oLay = oldLay;
            const ld = new strLayerDataInfo();
            ld.Name = oLay.Name as string;
            ld.MapFileName = oLay.MapFileName as string;
            ld.Shape = oLay.Shape as number;
            ld.Type = oLay.Type as number;
            ld.MeshType = oLay.MeshType as number;
            ld.ReferenceSystem = oLay.ReferenceSystem as number;
            ld.Time = cnvTime(oLay.Time as JsonObject);
            ld.Comment = oLay.Comment as string;
            ld.Print_Mode_Layer = oLay.Print_Mode_Layer as number;

            const lda = ld.atrObject;// オブジェクトの情報
            const oldAtrObject = oLay.atrObject as JsonObject;
            lda.ObjectNum = oldAtrObject.ObjectNum as number;
            lda.NumOfSyntheticObj = oldAtrObject.NumOfSyntheticObj as number;
            const oldAtrObjectData = oldAtrObject.atrObjectData as JsonObject[];
            for (let i = 0; i < oldAtrObjectData.length; i++) {
                const od = oldAtrObjectData[i];
                const d = new strObject_Data_Info();
                d.MpObjCode = od.MpObjCode as number;
                d.Name = od.Name as string;
                d.Objectstructure = od.Objectstructure as number;
                d.HyperLinkNum = od.HyperLinkNum as number;
                const odHyperLink = od.HyperLink as JsonObject[];
                for (const i in odHyperLink) {
                    const ud = new strURL_Data();
                    Object.assign(ud, odHyperLink[i]);
                    d.HyperLink.push(ud);
                }
                d.CenterPoint = cnvPoint(od.CenterPoint as JsonObject);
                d.Symbol = cnvPoint(od.Symbol as JsonObject);
                d.Label = cnvPoint(od.Label as JsonObject);
                d.MeshRect = cnvRectgle(od.MeshRect as JsonObject);
                d.defPoint = new latlon((od.defPoint as JsonObject).lat as number, (od.defPoint as JsonObject).lon as number);
                const odMeshPoint = od.MeshPoint as JsonObject[];
                for(const i in odMeshPoint){
                    d.MeshPoint.push(cnvPoint(odMeshPoint[i]));
                }
                d.Visible = od.Visible as boolean;
                lda.atrObjectData.push(d);
            }
            const oldMPSyntheticObj = oldAtrObject.MPSyntheticObj as JsonObject[];
            for (let i = 0; i < oldMPSyntheticObj.length; i++) {
                const od = oldMPSyntheticObj[i];
                const d = new strSynthetic_Object_Data();
                d.Kind = Number(od.Kind);
                d.NumOfObject = Number(od.NumOfObject);
                d.Name = String(od.Name);
                d.CenterP = cnvPoint(od.CenterP as JsonObject);
                d.SETime = cnvStart_End_Time_data(od.SETime as JsonObject);
                d.Shape = Number(od.Shape);
                d.Circumscribed_Rectangle = new rectangle();
                const odObjects = od.Objects as JsonObject[];
                d.Objects = [];
                for (const j in odObjects) {
                    const s = new strSynthetic_ObjectName_and_Code();
                    Object.assign(s, odObjects[j]);
                    d.Objects.push(s);
                }
                lda.MPSyntheticObj.push(d);
            }

            const ldd = ld.atrData;//データ項目の情報
            const oldAtrData = oLay.atrData as JsonObject;
            ldd.Count = oldAtrData.Count as number;
            ldd.SelectedIndex = oldAtrData.SelectedIndex as number;
            const oldDataArray = oldAtrData.Data as JsonObject[];
            for (const i in oldDataArray) {
                const od = oldDataArray[i];
                const d = new strData_info();
                Object.assign(d, od);
                d.Statistics = new strStatisticInfo();
                Object.assign(d.Statistics, od.Statistics);
                const dts = new strSoloModeViewSettings_Data();
                const odts = od.SoloModeViewSettings as JsonObject;
                dts.Div_Method = odts.Div_Method as number;
                dts.Div_Num = odts.Div_Num as number;
                dts.Class_Div = [];
                const odtsClassDiv = odts.Class_Div as JsonObject[];
                for (const j in odtsClassDiv) {
                    const s = new strClass_Div_data();
                    s.Value = odtsClassDiv[j].Value as number;
                    s.PaintColor = cnvColorProperty(odtsClassDiv[j].PaintColor as JsonObject);
                    s.ClassMark = cnvMarkProperty(odtsClassDiv[j].ClassMark as JsonObject);
                    s.ODLinePat = cnvLineProperty(odtsClassDiv[j].ODLinePat as JsonObject);
                    dts.Class_Div.push(s);
                }
                dts.ClassMarkMD = new strInner_Data_Info();
                Object.assign(dts.ClassMarkMD, odts.ClassMarkMD);
                dts.ClassODMD = new strClassODMode_data();
                Object.assign(dts.ClassODMD, odts.ClassODMD);
                dts.ClassODMD.Arrow = cnvArrow((odts.ClassODMD as JsonObject).Arrow as JsonObject);
                if(dts.ClassODMD.Dummy_ObjectFlag===undefined){
                    dts.ClassODMD.Dummy_ObjectFlag=false;
                }
                dts.ClassPaintMD = new strClassPaint_Data();
                const odtsClassPaintMD = odts.ClassPaintMD as JsonObject;
                dts.ClassPaintMD.color1 = cnvColorProperty(odtsClassPaintMD.color1 as JsonObject);
                dts.ClassPaintMD.color2 = cnvColorProperty(odtsClassPaintMD.color2 as JsonObject);
                dts.ClassPaintMD.color3 = cnvColorProperty(odtsClassPaintMD.color3 as JsonObject);
                dts.ClassPaintMD.Color_Mode = odtsClassPaintMD.Color_Mode as number;
                dts.ContourMD = new strContour_Data();
                const odtsContourMD = odts.ContourMD as JsonObject;
                Object.assign(dts.ContourMD, odtsContourMD);
                dts.ContourMD.Regular = new strContour_Data_Regular_interval();
                const odtsContourMDRegular = odtsContourMD.Regular as JsonObject;
                Object.assign(dts.ContourMD.Regular, odtsContourMDRegular);
                dts.ContourMD.Regular.Line_Pat = cnvLineProperty(odtsContourMDRegular.Line_Pat as JsonObject);
                dts.ContourMD.Regular.SP_Line_Pat = cnvLineProperty(odtsContourMDRegular.SP_Line_Pat as JsonObject);
                dts.ContourMD.Regular.EX_Line_Pat = cnvLineProperty(odtsContourMDRegular.EX_Line_Pat as JsonObject);
                dts.ContourMD.Irregular = [];
                const odtsContourMDIrregular = odtsContourMD.Irregular as JsonObject[];
                for (const j in odtsContourMDIrregular) {
                    const ir = new strContour_Data_Irregular_interval();
                    ir.Value = odtsContourMDIrregular[j].Value as number;
                    ir.Line_Pat = cnvLineProperty(odtsContourMDIrregular[j].Line_Pat as JsonObject);
                    dts.ContourMD.Irregular.push(ir);
                }
                dts.MarkCommon = new strMarkCommon_Data();
                const odtsMarkCommon = odts.MarkCommon as JsonObject;
                dts.MarkCommon.Inner_Data = new strInner_Data_Info();
                Object.assign(dts.MarkCommon.Inner_Data, odtsMarkCommon.Inner_Data);
                dts.MarkCommon.MinusTile = cnvTileProperty(odtsMarkCommon.MinusTile as JsonObject);
                dts.MarkCommon.MinusLineColor = cnvColorProperty(odtsMarkCommon.MinusLineColor as JsonObject);
                dts.MarkCommon.LegendMinusWord = odtsMarkCommon.LegendMinusWord as string;
                dts.MarkCommon.LegendPlusWord = odtsMarkCommon.LegendPlusWord as string;
                dts.MarkBarMD = new strMarkBar_Data();
                const odtsMarkBarMD = odts.MarkBarMD as JsonObject;
                Object.assign(dts.MarkBarMD, odtsMarkBarMD);
                dts.MarkBarMD.InnerTile = cnvTileProperty(odtsMarkBarMD.InnerTile as JsonObject);
                dts.MarkBarMD.FrameLinePat = cnvLineProperty(odtsMarkBarMD.FrameLinePat as JsonObject);
                dts.MarkBarMD.scaleLinePat = cnvLineProperty(odtsMarkBarMD.scaleLinePat as JsonObject);
                if(dts.MarkBarMD.BarShape===undefined){
                    dts.MarkBarMD.BarShape = enmMarkBarShape.bar;
                }
                dts.MarkBlockMD = new strMarkBlock_Data();
                const odtsMarkBlockMD = odts.MarkBlockMD as JsonObject;
                Object.assign(dts.MarkBlockMD, odtsMarkBlockMD);
                dts.MarkBlockMD.Mark = cnvMarkProperty(odtsMarkBlockMD.Mark as JsonObject);
                dts.MarkSizeMD = new strMarkSize_Data();
                const odtsMarkSizeMD = odts.MarkSizeMD as JsonObject;
                dts.MarkSizeMD.MaxValueMode = odtsMarkSizeMD.MaxValueMode as number;
                dts.MarkSizeMD.MaxValue = odtsMarkSizeMD.MaxValue as number;
                dts.MarkSizeMD.Value = (odtsMarkSizeMD.Value as JsonArray).concat() as number[];
                dts.MarkSizeMD.Mark = cnvMarkProperty(odtsMarkSizeMD.Mark as JsonObject);
                dts.MarkSizeMD.LineShape = new strMarkSizeModeLineShapeData();
                const odtsMarkSizeMDLineShape = odtsMarkSizeMD.LineShape as JsonObject;
                dts.MarkSizeMD.LineShape.LineWidth = odtsMarkSizeMDLineShape.LineWidth as number;
                dts.MarkSizeMD.LineShape.LineEdge = cnvLineEdgeProperty(odtsMarkSizeMDLineShape.LineEdge as JsonObject);
                dts.MarkSizeMD.LineShape.Color = cnvColorProperty(odtsMarkSizeMDLineShape.Color as JsonObject);
                dts.MarkTurnMD = new strMarkTurnMode_Data();
                const odtsMarkTurnMD = odts.MarkTurnMD as JsonObject;
                dts.MarkTurnMD.Dirction = odtsMarkTurnMD.Dirction as number;
                dts.MarkTurnMD.DegreeLap = odtsMarkTurnMD.DegreeLap as number;
                dts.MarkTurnMD.Mark = cnvMarkProperty(odtsMarkTurnMD.Mark as JsonObject);
                dts.StringMD = new strString_Data();
                const odtsStringMD = odts.StringMD as JsonObject;
                dts.StringMD.Font = cnvFontProperty(odtsStringMD.Font as JsonObject);
                dts.StringMD.maxWidth = odtsStringMD.maxWidth as number;
                dts.StringMD.WordTurnF = odtsStringMD.WordTurnF as boolean;
                d.SoloModeViewSettings = dts;
                ldd.Data.push(d);
            }

            ld.Dummy = [];//ダミーオブジェクト
            const oldDummy = oLay.Dummy as JsonObject[];
            for (const i in oldDummy) {
                const d = new strDummyObjectName_and_Code();
                Object.assign(d, oldDummy[i]);
                ld.Dummy.push(d);
            }
            ld.DummyGroup = [];//ダミーオブジェクトグループ
            const dummyGroup = oLay.DummyGroup as JsonArray;
            ld.DummyGroup = dummyGroup.map(item => Number(item));

            const oldv = oLay.LayerModeViewSettings as JsonObject;
            const oldvl = oldv.LabelMode as JsonObject;
            const ldv = ld.LayerModeViewSettings;
            ldv.LabelMode = new strLabelMode_Data_info();//ラベルモード
            ldv.LabelMode.SelectedIndex = oldvl.SelectedIndex as number;
            const oldvlDataSet = oldvl.DataSet as JsonObject[];
            for (const i in oldvlDataSet) {
                const od = oldvlDataSet[i];
                const d = new strLabel_Data();
                Object.assign(d, od);
                d.DataItem = (od.DataItem as JsonArray).concat() as number[];
                d.Location_Mark = cnvMarkProperty(od.Location_Mark as JsonObject);
                d.DataValue_Font = cnvFontProperty(od.DataValue_Font as JsonObject);
                d.ObjectName_Font= cnvFontProperty(od.ObjectName_Font as JsonObject);
                d.BorderObjectTile = cnvTileProperty(od.BorderObjectTile as JsonObject);
                d.BorderDataTile = cnvTileProperty(od.BorderDataTile as JsonObject);
                d.BorderLine = cnvLineProperty(od.BorderLine as JsonObject);
                ldv.LabelMode.DataSet.push(d);
            }
            const oldvg = oldv.GraphMode as JsonObject;
            ldv.GraphMode = new strGraphMode_DataSetting_Info();//グラフモード
            ldv.GraphMode.SelectedIndex = oldvg.SelectedIndex as number;
            const oldvgDataSet = oldvg.DataSet as JsonObject[];
            for (const i in oldvgDataSet) {
                const od = oldvgDataSet[i];
                const d = new strGraph_Data();
                Object.assign(d, od);
                d.En_Obi = new strGraph_Data_En();
                Object.assign(d.En_Obi, od.En_Obi);
                d.En_Obi.BoaderLine = cnvLineProperty((od.En_Obi as JsonObject).BoaderLine as JsonObject);
                d.Oresen_Bou = new strGraph_Data_Oresen();
                Object.assign(d.Oresen_Bou, od.Oresen_Bou);
                d.Oresen_Bou.Line = cnvLineProperty((od.Oresen_Bou as JsonObject).Line as JsonObject);
                d.Oresen_Bou.BackgroundTile = cnvTileProperty((od.Oresen_Bou as JsonObject).BackgroundTile as JsonObject);
                d.Oresen_Bou.BorderLine = cnvLineProperty((od.Oresen_Bou as JsonObject).BorderLine as JsonObject);
                d.Data = [];
                const odData = od.Data as JsonObject[];
                for (const j in odData) {
                    const s = new GraphModeDataItem();
                    s.DataNumber = odData[j].DataNumber as number;
                    s.Tile = cnvTileProperty(odData[j].Tile as JsonObject);
                    d.Data.push(s);
                }
                ldv.GraphMode.DataSet.push(d);
            }

            const oldvPointLineShape = oldv.PointLineShape as JsonObject;
            ldv.PointLineShape.LineWidth = oldvPointLineShape.LineWidth as number;
            ldv.PointLineShape.LineEdge = cnvLineEdgeProperty(oldvPointLineShape.LineEdge as JsonObject);
            ldv.PointLineShape.PointMark = cnvMarkProperty(oldvPointLineShape.PointMark as JsonObject);
            ldv.PolygonDummy_ClipSet_F = oldv.PolygonDummy_ClipSet_F as boolean;

            const oldODBezier = oLay.ODBezier_DataStac as JsonObject[];
            for (const i in oldODBezier) {
                const d = new ODBezier_Data();
                Object.assign(d, oldODBezier[i]);
                d.Point = cnvPoint(oldODBezier[i].Point as JsonObject);
                ld.ODBezier_DataStac.push(d);
            }
            return ld;
        }

        function cnvArrow(oa: JsonObject): Arrow_Data {
            const a = new Arrow_Data();
            Object.assign(a, oa);
            return a;
        }
        function cnvStart_End_Time_data(ot: JsonObject): Start_End_Time_data {
            const nt = new Start_End_Time_data();
            nt.StartTime = cnvTime(ot.StartTime as JsonObject);
            nt.EndTime = cnvTime(ot.EndTime as JsonObject);
            return nt;
        }
        function cnvTime(oldT: JsonObject): strYMD {
            return new strYMD(oldT.Year as number, oldT.Month as number, oldT.Day as number);
        }
        function cnvTotalmode(oldTM: JsonObject): strTotalMode_Info {
            const otmo = oldTM.OverLay as JsonObject;
            const tm = new strTotalMode_Info();
            const tmo = tm.OverLay;
            tmo.SelectedIndex = otmo.SelectedIndex as number;
            tmo.Always_Overlay_Index = otmo.Always_Overlay_Index as number;
            const otmoDataSet = otmo.DataSet as JsonObject[];
            for (let i = 0; i < otmoDataSet.length; i++) {
                const od = otmoDataSet[i];
                const d = new strOverLay_Dataset_Info();
                d.title = od.title as string;
                d.SelectedIndex = od.SelectedIndex as number;
                d.Note = od.Note as string;
                const odDataItem = od.DataItem as JsonObject[];
                for (let j = 0; j < odDataItem.length; j++) {
                    const itm = new strOverLay_DataSet_Item_Info();
                    Object.assign(itm, odDataItem[j]);
                    d.DataItem.push(itm);
                }
                tmo.DataSet.push(d);
            }
            const otms = oldTM.Series as JsonObject;
            const tms = tm.Series;
            tms.SelectedIndex = otms.SelectedIndex as number;
            const otmsDataSet = otms.DataSet as JsonObject[];
            for (let i = 0; i < otmsDataSet.length; i++) {
                const od = otmsDataSet[i];
                const d = new strSeries_Dataset_Info();
                d.title = od.title as string;
                d.SelectedIndex = od.SelectedIndex as number;
                const odDataItem = od.DataItem as JsonObject[];
                for (let j = 0; j < odDataItem.length; j++) {
                    const itm = new strSeries_DataSet_Item_Info();
                    Object.assign(itm, odDataItem[j]);
                    d.DataItem.push(itm);
                }
                tms.DataSet.push(d);
            }
            return tm;
        }

        function cnvCondition(oldC: Array<JsonObject>): strCondition_DataSet_Info[] {
            const cd: strCondition_DataSet_Info[] = [];
            for (let i = 0; i < oldC.length; i++) {
                const od = oldC[i];
                const d = new strCondition_DataSet_Info();
                d.Enabled = od.Enabled as boolean;
                d.Layer = od.Layer as number;
                d.Name = od.Name as string;
                const odConditionClass = od.Condition_Class as JsonObject[];
                for (let j = 0; j < odConditionClass.length; j++) {
                    const oind = odConditionClass[j];
                    const ind = new strCondition_Data_Info();
                    ind.And_OR = oind.And_OR as number;
                    const oindCondition = oind.Condition as JsonObject[];
                    for (let k = 0; k < oindCondition.length; k++) {
                        const lim = new strCondition_Limitation_Info();
                        Object.assign(lim, oindCondition[k]);
                        ind.Condition.push(lim);
                    }
                    d.Condition_Class.push(ind);
                }
                cd.push(d);
            }
            return cd;
        }
        function cnvTileMapView(oldTV: JsonObject): strTileMapViewInfo {
            const tm = new strTileMapViewInfo();
            Object.assign(tm, oldTV);
            return tm;
        }

        function cnvSouByou(oldSB: JsonObject): strSouByou_Info {
            const sb = new strSouByou_Info();
            Object.assign(sb, oldSB);
            if (sb.Auto===undefined){
                sb.Auto=false;
                sb.AutoDegree=2;
            }
            return sb;
        }

        function cnvValueShow(oldvs: JsonObject): strValueShow_Info {
            const sv = new strValueShow_Info();
            Object.assign(sv, oldvs);
            if (sv.DecimalNumber === undefined) {
                sv.DecimalNumber = 0;
            }
            if (sv.DecimalSepaF === undefined) {
                sv.DecimalSepaF = false;
            }
            sv.ValueFont = cnvFontProperty(oldvs.ValueFont as JsonObject);
            sv.ObjNameFont = cnvFontProperty(oldvs.ObjNameFont as JsonObject);
            return sv;
        }

        function cnvScreen_Setting(oldSS: Array<JsonObject>): strScreen_Setting_Data_Info[] {
            const ss: strScreen_Setting_Data_Info[] = [];
            for (let i = 0; i < oldSS.length; i++) {
                const oldItem = oldSS[i];
                const s = new strScreen_Setting_Data_Info();
                s.title = oldItem.Title as string;
                s.frmPrint_FormSize = cnvRectgle(oldItem.frmPrint_FormSize as JsonObject);
                s.ScrView = cnvRectgle(oldItem.ScrView as JsonObject);
                s.Screen_Margin = new ScreenMargin();
                const oldItemScreenMargin = oldItem.Screen_Margin as JsonObject;
                s.Screen_Margin.ClipF = oldItemScreenMargin.ClipF as boolean;
                s.Screen_Margin.rect = cnvRectgle(oldItemScreenMargin.rect as JsonObject);
                s.Accessory_Base = oldItem.Accessory_Base as number;
                s.MapScale = cnvMapSCL(oldItem.MapScale as JsonObject);
                s.MapTitle = cnvMapTitle(oldItem.MapTitle as JsonObject);
                s.DataNote = cnvDataNode(oldItem.DataNote as JsonObject);
                s.AttMapCompass = cnvCompass(oldItem.AttMapCompass as JsonObject);
                s.MapLegend = cnvMapLegend(oldItem.MapLegend as JsonObject);
                s.ThreeDMode = new strThreeDMode_Set();
                Object.assign(s.ThreeDMode, oldItem.ThreeDMode);
                ss.push(s);
            }
            return ss;
        }

        function cnvDataNode(oldDN: JsonObject): strNote_Attri {
            const dn = new strNote_Attri();
            dn.Visible = oldDN.Visible as boolean;
            dn.Position = cnvPoint(oldDN.Position as JsonObject);
            dn.MaxWidth = oldDN.MaxWidth as number;
            dn.Font = cnvFontProperty(oldDN.Font as JsonObject);
            return dn;
        }

        function cnvScreen_Back(oldsb: JsonObject): strScreen_Back_data {
            const sb = new strScreen_Back_data();
            sb.MapAreaFrameLine = cnvLineProperty(oldsb.MapAreaFrameLine as JsonObject);
            sb.ScreenFrameLine = cnvLineProperty(oldsb.ScreenFrameLine as JsonObject);
            sb.ScreenAreaBack = cnvTileProperty(oldsb.ScreenAreaBack as JsonObject);
            sb.MapAreaBack = cnvTileProperty(oldsb.MapAreaBack as JsonObject);
            sb.ObjectInner = cnvTileProperty(oldsb.ObjectInner as JsonObject);
            return sb;
        }
        function cnvMissingData(oldM: JsonObject): strMissing_set {
            const m = new strMissing_set();
            m.Print_Flag = oldM.Print_Flag as boolean;
            m.Text = oldM.Text as string;
            m.PaintTile = cnvTileProperty(oldM.PaintTile as JsonObject);
            m.Mark = cnvMarkProperty(oldM.Mark as JsonObject);
            m.BlockMark = cnvMarkProperty(oldM.BlockMark as JsonObject);
            m.ClassMark = cnvMarkProperty(oldM.ClassMark as JsonObject);
            m.MarkBar = cnvMarkProperty(oldM.MarkBar as JsonObject);
            m.Label = oldM.Label as string;
            m.LineShape = cnvLineProperty(oldM.LineShape as JsonObject);
            return m;
        }
        function cnvMapTitle(oldTtl: JsonObject): strTitle_Attri {
            const ttl = new strTitle_Attri();
            ttl.Visible = oldTtl.Visible as boolean;
            ttl.Position = cnvPoint(oldTtl.Position as JsonObject);
            ttl.MaxWidth = oldTtl.MaxWidth as number;
            ttl.Font = cnvFontProperty(oldTtl.Font as JsonObject);
            return ttl;
        }
        function cnvMapSCL(olsSCL: JsonObject): strScale_Attri {
            const scl = new strScale_Attri();
            scl.Visible = olsSCL.Visible as boolean;
            scl.Position = cnvPoint(olsSCL.Position as JsonObject);
            scl.Font = cnvFontProperty(olsSCL.Font as JsonObject);
            scl.BarPattern = olsSCL.BarPattern as number;
            scl.BarAuto = olsSCL.BarAuto as boolean;
            scl.BarDistance = olsSCL.BarDistance as number;
            scl.BarKugiriNum = olsSCL.BarKugiriNum as number;
            scl.Back = cnvBackGround_Box_Property(olsSCL.Back as JsonObject);
            scl.Unit = Number(olsSCL.Unit);
            return scl;
        }
        function cnvMapLegend(oldML: JsonObject): strLegend_Attri {
            const MapLegend = new strLegend_Attri();
            const mlb = MapLegend.Base;
            const oldMLBase = oldML.Base as JsonObject;
            mlb.Back = cnvBackGround_Box_Property(oldMLBase.Back as JsonObject);
            mlb.Font = cnvFontProperty(oldMLBase.Font as JsonObject);
            mlb.Legend_Num = oldMLBase.Legend_Num as number;
            mlb.LegendXY = [];
            const oldMLBaseLegendXY = oldMLBase.LegendXY as JsonObject[];
            for (let i = 0; i < mlb.Legend_Num; i++) {
                mlb.LegendXY.push(cnvPoint(oldMLBaseLegendXY[i]));
            }
            const oldMLBase2 = oldML.Base as JsonObject;
            mlb.Visible = oldMLBase2.Visible as boolean;
            mlb.Comma_f = oldMLBase2.Comma_f as boolean;
            mlb.ModeValueInScreenFlag = oldMLBase2.ModeValueInScreenFlag as boolean;
            if (mlb.ModeValueInScreenFlag === undefined) {
                mlb.ModeValueInScreenFlag = false;
            }
            const mlc = MapLegend.ClassMD;
            const oldMLClassMD = oldML.ClassMD as JsonObject;
            mlc.ClassMarkFrame_Visible = oldMLClassMD.ClassMarkFrame_Visible as boolean;
            mlc.PaintMode_Line = cnvLineProperty(oldMLClassMD.PaintMode_Line as JsonObject);
            mlc.PaintMode_Method = oldMLClassMD.PaintMode_Method as number;
            mlc.PaintMode_Width = oldMLClassMD.PaintMode_Width as number;
            mlc.SeparateGapSize = oldMLClassMD.SeparateGapSize as number;
            mlc.SeparateClassWords = oldMLClassMD.SeparateClassWords as number;
            mlc.FrequencyPrint = oldMLClassMD.FrequencyPrint as boolean;
            const oldMLClassMDBoundaryLine = oldMLClassMD.ClassBoundaryLine as JsonObject;
            mlc.ClassBoundaryLine.Visible = oldMLClassMDBoundaryLine.Visible as boolean;
            mlc.ClassBoundaryLine.LPat = cnvLineProperty(oldMLClassMDBoundaryLine.LPat as JsonObject);
            if (oldMLClassMD.CategorySeparate_f === undefined) {
                oldMLClassMD.CategorySeparate_f = false;
            }
            mlc.CategorySeparate_f = oldMLClassMD.CategorySeparate_f as boolean;
            MapLegend.En_Graph_Pattern = oldML.En_Graph_Pattern as number;

            const mll = MapLegend.Line_DummyKind;
            const oldMLLineDummyKind = oldML.Line_DummyKind as JsonObject;
            mll.Back = cnvBackGround_Box_Property(oldMLLineDummyKind.Back as JsonObject);
            mll.Dummy_Point_Visible = oldMLLineDummyKind.Dummy_Point_Visible as boolean;
            mll.Line_Pattern = oldMLLineDummyKind.Line_Pattern as number;
            mll.Line_Visible = oldMLLineDummyKind.Line_Visible as boolean;
            mll.Line_Visible_Number_STR = oldMLLineDummyKind.Line_Visible_Number_STR as string;

            const mlm = MapLegend.MarkMD;
            const oldMLMarkMD = oldML.MarkMD as JsonObject;
            mlm.CircleMD_CircleMini_F = oldMLMarkMD.CircleMD_CircleMini_F as boolean;
            mlm.MultiEnMode_Line = cnvLineProperty(oldMLMarkMD.MultiEnMode_Line as JsonObject);

            Object.assign(MapLegend.OverLay_Legend_Title, oldML.OverLay_Legend_Title);

            return MapLegend;
        }

        function cnvPoint(oldP: JsonObject): point {
            return new point(oldP.x as number, oldP.y as number);
        }
        function cnvRectgle(orect: JsonObject): rectangle {
            const rec = new rectangle(orect.left as number, orect.right as number, orect.top as number, orect.bottom as number);
            return rec;
        }
        function cnvCompass(ovsc: JsonObject): strCompass_Attri {
            const vsc = new strCompass_Attri();
            const ovscdirWord = ovsc.dirWord as JsonObject;
            vsc.dirWord.East = ovscdirWord.East as string;
            vsc.dirWord.West = ovscdirWord.West as string;
            vsc.dirWord.North = ovscdirWord.North as string;
            vsc.dirWord.South = ovscdirWord.South as string;
            vsc.Visible = ovsc.Visible as boolean;
            vsc.Font = cnvFontProperty(ovsc.Font as JsonObject);
            vsc.Mark = cnvMarkProperty(ovsc.Mark as JsonObject);
            const ovscPosition = ovsc.Position as JsonObject;
            vsc.Position.x = ovscPosition.x as number;
            vsc.Position.y = ovscPosition.y as number;
            return vsc;
        }
        function cnvMarkProperty(oldMK: JsonObject): Mark_Property {
            const mk = new Mark_Property();
            mk.PrintMark = oldMK.PrintMark as number;
            mk.ShapeNumber = oldMK.ShapeNumber as number;
            mk.Tile = cnvTileProperty(oldMK.Tile as JsonObject);
            mk.Line = cnvLineProperty(oldMK.Line as JsonObject);
            mk.wordmark = oldMK.wordmark as string;
            mk.WordFont = cnvFontProperty(oldMK.WordFont as JsonObject);
            return mk;
        }
        function cnvFontProperty(oldFont: JsonObject): Font_Property {
            const fnt = new Font_Property();
            fnt.Color = cnvColorProperty(oldFont.Color as JsonObject);
            fnt.Size = oldFont.Size as number;
            fnt.italic = oldFont.italic as boolean;
            fnt.bold = oldFont.bold as boolean;
            fnt.Underline = oldFont.Underline as boolean;
            fnt.Name = oldFont.Name as string;
            fnt.Kakudo = oldFont.Kakudo as number;
            fnt.FringeF = oldFont.FringeF as boolean;
            fnt.FringeWidth = oldFont.FringeWidth as number;
            fnt.FringeColor = cnvColorProperty(oldFont.FringeColor as JsonObject);
            fnt.Back = cnvBackGround_Box_Property(oldFont.Back as JsonObject);
            //フォントの有無チェック
            if(fnt.Name && existFont.indexOf(fnt.Name)===-1){
                if(nonExistFont.indexOf(fnt.Name)===-1){
                    if(Generic.checkFontExist(fnt.Name)===true){
                        existFont.push(fnt.Name);
                    }else{
                        nonExistFont.push(fnt.Name);
                        fnt.Name=appState().settingData.SetFont;
                    }
                }else{
                    fnt.Name=appState().settingData.SetFont;
                }
            }
            return fnt;
        }
        function cnvBackGround_Box_Property(oldBK: JsonObject): BackGround_Box_Property {
            const bk = new BackGround_Box_Property();
            bk.Tile = cnvTileProperty(oldBK.Tile as JsonObject)
            bk.Line = cnvLineProperty(oldBK.Line as JsonObject);
            bk.Round = oldBK.Round as number;
            bk.Padding = oldBK.Padding as number;
            return bk;
        }
        function cnvColorProperty(oldColor: JsonObject): colorRGBA {
            const col = new colorRGBA();
            return Object.assign(col, oldColor);
        }
        function cnvLineProperty(oldLine: JsonObject): Line_Property {
            const line = new Line_Property();
            line.BlankF = oldLine.BlankF as boolean;
            line.Width = oldLine.Width as number;
            line.Color = cnvColorProperty(oldLine.Color as JsonObject);
            line.Edge_Connect_Pattern = cnvLineEdgeProperty(oldLine.Edge_Connect_Pattern as JsonObject);
            return line;
        }
        function cnvLineEdgeProperty(oldLineEdsge: JsonObject): LineEdge_Connect_Pattern_Data_Info {
            const ledge = new LineEdge_Connect_Pattern_Data_Info();
            return Object.assign(ledge, oldLineEdsge);
        }
        function cnvTileProperty(oldTile: JsonObject): Tile_Property {
            const tile = new Tile_Property();
            tile.BlankF = oldTile.BlankF as boolean;
            tile.Color = cnvColorProperty(oldTile.Color as JsonObject);
            return tile;
        }
}

    //クリップボードから読み込み
    SetDataFromClipBoard(MapDataList: clsMapdata[], attrText: string): DataLoadResult {
        this.MapData = new clsAttrMapData();
        for (let i = 0; i < MapDataList.length; i++) {
            this.MapData.AddExistingMapData(MapDataList[i], MapDataList[i].Map.FileName);
        }

        const retv = this.ReadAttrDataOneLine(attrText);
        let _ObjectErrorMessage = '';
        let _f = true;
        if (retv.ok === true) {
            this.TotalData.ViewStyle.Zahyo = this.MapData.GetPrestigeZahyoMode();
            const retv2 = this.MapData.EqualizeZahyoMode(this.TotalData.ViewStyle.Zahyo);
            if (retv2.ok === false) {
                _ObjectErrorMessage += "地図ファイルの座標系・測地系を統一できません。" + '\n' + retv2.emes;
                _f = false;
            }
        }
        return { ok: retv.ok, emes: retv.emes };
    }

    //Clipboard,CSVのデータを一行ずつ処理して読み込む
    ReadAttrDataOneLine(STR: string): DataLoadResult {
        const state = appState();
        let ObjectErrorMessage = '';
        let lay = -1;
        const LayerReading = new strLayerReadingInfo();
        LayerReading.init();
        let LayerError = "";
        let LayerTypeTripDefinitionExists = false;
        let OK_Flag = true;
        let TotalMissing=false;
        let Map_readed = (this.MapData.GetNumOfMapFile()!==0);
        for (let i = 0; i < STR.length; i++) {
            const tb = STR[i].indexOf('\t');
            const cm = STR[i].indexOf(',');
            let splitter='\t';
            if ((tb === -1) && (cm !== -1)) {
                splitter = ",";
            }
            const CutS=Generic.String_Cut(STR[i],splitter);
            const CutN = CutS.length;
            switch (CutS[0].toUpperCase()) {
                case "": {
                    break;
                }
                case "MAP": {
                    if (2 <= CutN) {
                        for (let i = 1; i < CutN; i++) {
                            if(CutS[i]!==""){
                                const fu =Generic.getFilenameWithoutExtension( CutS[i].toUpperCase())+".MPFJ";
                                switch (fu) {//既存地図ファイルを使用
                                    case "JAPAN.MPFJ":
                                    case "日本緯度経度.MPFJ":
                                    case "WORLD.MPFJ": {
                                        if (this.MapData.CheckMapfileExists(fu) === false) {
                                            if (state.preReadMapFile[fu]) {
                                                const mapdata = new clsMapdata();
                                                mapdata.openJsonMapData(state.preReadMapFile[fu]);
                                                this.MapData.AddExistingMapData(mapdata, fu);
                                                Map_readed = true;
                                            } else {
                                                ObjectErrorMessage+="地図ファイル" + CutS[i] + "を読み込んでください。";
                                                return { ok: false, emes: ObjectErrorMessage };
                                            }
                                        }
                                        break;
                                    }
                                    default:{
                                        if (this.MapData.CheckMapfileExists(fu) === false) {
                                            ObjectErrorMessage+="地図ファイル" + CutS[i] + "を読み込んでください。";
                                            return { ok: false, emes: ObjectErrorMessage };
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    break;
                }
                case "COMMENT": {
                    if (2 <= CutN) {
                        if (lay === -1) {
                            this.TotalData.LV1.Comment += CutS[1] + '\n';
                        }
                        LayerReading.Comment_Temp += CutS[1];
                    }
                    break;
                }
                case "DUMMY": {
                    LayerReading.Dummy_Temp.push(CutS);
                    break;
                }
                case "DUMMY_GROUP": {
                    LayerReading.Dummy_OBKTemp.push(CutS);
                    break;
                }
                case "TITLE": {
                    if (lay === -1) {
                        lay = 0;
                    }
                    LayerReading.TTL = Array.from(CutS);
                    break;
                }
                case "UNIT": {
                    if (lay === -1) {
                        lay = 0;
                    }
                    LayerReading.UNT = Array.from(CutS);
                    break;
                }
                case "DATA_MISSING": {
                    if (lay === -1) {
                        lay = 0;
                    }
                    for (let j = 0; j < CutN; j++) {
                        if (CutS[j].toUpperCase() === "ON") {
                            LayerReading.DTMis[j] = true;
                        } else {
                            LayerReading.DTMis[j] = false;
                        }
                    }
                    break;
                }
                case "NOTE": {
                    if (lay === -1) {
                        lay = 0;
                    }
                    LayerReading.Note = Array.from(CutS);
                    break;
                }
                case "SHAPE": {
                    if (2 <= CutN) {
                        switch (CutS[1].toUpperCase()) {
                            case "POINT": {
                                LayerReading.Shape = enmShape.PointShape;
                                break;
                            }
                            case "LINE": {
                                LayerReading.Shape = enmShape.LineShape;
                                break;
                            }
                            case "POLYGON": {
                                LayerReading.Shape = enmShape.PolygonShape;
                                break;
                            }
                            default:
                                LayerError += "SHAPEタグで" + CutS[1] + "は無効です。";
                        }
                    }
                    break;
                }
                case "TYPE": {
                    if (2 <= CutN) {
                        switch (CutS[1].toUpperCase()) {
                            case "NORMAL": {
                                LayerReading.Type = enmLayerType.Normal;
                                break;
                            }
                            case "TRIP_DEFINITION": {
                                if (LayerTypeTripDefinitionExists === true) {
                                    ObjectErrorMessage += "移動主体定義レイヤは１つしか設定できません。" + '\n';
                                    return { ok: false, emes: ObjectErrorMessage };
                                }
                                LayerReading.Type = enmLayerType.Trip_Definition;
                                LayerTypeTripDefinitionExists = true;
                                break;
                            }
                            case "TRIP": {
                                LayerReading.Type = enmLayerType.Trip;
                                LayerReading.ReferenceSystem = enmZahyo_System_Info.Zahyo_System_World;
                                if (3 <= CutN) {
                                    const Sys = CutS[2];
                                    switch (Sys) {
                                        case "日本": {
                                            LayerReading.ReferenceSystem = enmZahyo_System_Info.Zahyo_System_tokyo;
                                            break;
                                        }
                                        case "世界": {
                                            LayerReading.ReferenceSystem = enmZahyo_System_Info.Zahyo_System_World;
                                            break;
                                        }
                                        case "":{
                                            break;
                                        }
                                        default:
                                            LayerError += "TYPE TRIPの測地系指定で" + Sys + "は無効です。";
                                    }
                                }
                                break;
                            }
                            case "POINT": {
                                LayerReading.Type = enmLayerType.DefPoint;
                                LayerReading.Shape = enmShape.PointShape;
                                LayerReading.ReferenceSystem = enmZahyo_System_Info.Zahyo_System_World;
                                if (3 <= CutN) {
                                    const Sys = CutS[2];
                                    switch (Sys) {
                                        case "日本": {
                                            LayerReading.ReferenceSystem = enmZahyo_System_Info.Zahyo_System_tokyo;
                                            break;
                                        }
                                        case "世界": {
                                            LayerReading.ReferenceSystem = enmZahyo_System_Info.Zahyo_System_World;
                                            break;
                                        }
                                        case "":{
                                            break;
                                        }
                                        default:
                                            LayerError += "TYPE POINTの測地系指定で" + Sys + "は無効です。";
                                    }
                                }
                                break;
                            }
                            case "MESH": {
                                LayerReading.Type = enmLayerType.Mesh
                                if (3 <= CutN) {
                                    const MT = CutS[2];
                                    switch (MT) {
                                        case "1": {
                                            LayerReading.MeshType = enmMesh_Number.mhFirst;
                                            break;
                                        }
                                        case "2": {
                                            LayerReading.MeshType = enmMesh_Number.mhSecond;
                                            break;
                                        }
                                        case "3":
                                        case "1km": {
                                            LayerReading.MeshType = enmMesh_Number.mhThird;
                                            break;
                                        }
                                        case "1/2":
                                        case "4":
                                        case "500m": {
                                            LayerReading.MeshType = enmMesh_Number.mhHalf;
                                            break;
                                        }
                                        case "1/4":
                                        case "5":
                                        case "250m": {
                                            LayerReading.MeshType = enmMesh_Number.mhQuarter;
                                            break;
                                        }
                                        case "1/8": {
                                            LayerReading.MeshType = enmMesh_Number.mhOne_Eighth;
                                            break;
                                        }
                                        case "1/10": {
                                            LayerReading.MeshType = enmMesh_Number.mhOne_Tenth;
                                            break;
                                        }
                                        default:
                                            ObjectErrorMessage += "メッシュの種類の設定が不正です。" + CutS[2] + '\n';
                                            return;
                                    }
                                    if (LayerReading.Shape === enmShape.NotDeffinition) {
                                        LayerReading.Shape = enmShape.PolygonShape;
                                    }
                                    LayerReading.ReferenceSystem = enmZahyo_System_Info.Zahyo_System_World;
                                    if (4 <= CutN) {
                                        const Sys = CutS[3];
                                        switch (Sys) {
                                            case "日本": {
                                                LayerReading.ReferenceSystem = enmZahyo_System_Info.Zahyo_System_tokyo;
                                                break;
                                            }
                                            case "世界": {
                                                LayerReading.ReferenceSystem = enmZahyo_System_Info.Zahyo_System_World;
                                                break;
                                            }
                                            case "":{
                                                break;
                                            }
                                            default:
                                                LayerError += "TYPE MESHの測地系指定で" + Sys + "は無効です。";
                                        }
                                    }
                                }
                                break;
                            }
                            default:
                                ObjectErrorMessage += "TYPEタグで" + CutS[1] + "は無効です。" + '\n';
                                return { ok: false, emes: ObjectErrorMessage };
                        }
                    }
                    break;
                }
                case "LAYER": {
                    lay += 1;
                    if (1 <= lay) {
                        if ((LayerReading.TTL === undefined) || (LayerReading.ObjectDataStac === undefined)) {
                            alert("レイヤのデータがありません：" + LayerReading.Name);
                            return { ok: false, emes: ObjectErrorMessage };
                        }
                        const retv = this.Set_Data_from_String(LayerReading, TotalMissing);
                        OK_Flag = OK_Flag && retv.ok;
                        LayerError += retv.emes;
                        if (LayerError !== "") {
                            ObjectErrorMessage += "エラー／レイヤ:";
                            if (LayerReading.Name === "") {
                                ObjectErrorMessage += (this.TotalData.LV1.Lay_Maxn).toString() + '\n';
                            } else {
                                ObjectErrorMessage += LayerReading.Name + '\n';
                            }
                            ObjectErrorMessage += LayerError + '\n';
                        }
                    }
                    LayerError = "";
                    LayerReading.init();
                    LayerReading.Time = clsTime.GetNullYMD();
                    if (2 <= CutN) {
                        LayerReading.Name = CutS[1];
                    }
                    if (3 <= CutN) {
                        LayerReading.MapFile = CutS[2];
                    }
                    if ((LayerReading.MapFile !== "") && (Generic.getExtension(LayerReading.MapFile) === "")) {
                        LayerReading.MapFile += ".MPFJ";
                    }
                    if (LayerReading.MapFile !== "") {
                        if (this.MapData.CheckMapfileExists(LayerReading.MapFile) === false) {
                            alert("レイヤ" + LayerReading.Name + "の地図ファイルを読み込んでください。");
                            return { ok: false, emes: ObjectErrorMessage };
                        }
                    }
                    break;
                }
                case "TIME": {
                    if (lay === -1) {
                        lay = 0;
                    }
                    if (LayerReading.Time.nullFlag() === true) {
                        if (2 <= CutN) {
                            let cngTimeF = false;
                            CutS[1].replace(",", "");
                            const Y = Math.floor(Number(CutS[1]));
                            //if (DateTime.MinValue.Year > Y) {
                            //    Y = DateTime.MinValue.Year;
                            //    cngTimeF = true;
                            //}
                            let m = 1;
                            let d = 1;
                            if (3 <= CutN) {
                                m = Math.floor(Number(CutS[2]));
                                if (m <= 0) {
                                    m = 1;
                                    cngTimeF = true;
                                } else {
                                    if (m > 12) {
                                        m = 12;
                                        cngTimeF = true;
                                    }
                                }
                            }
                            if (4 <= CutN) {
                                const iDaysInMonth = new Date(Y, m, 0).getDate();
                                d = Math.floor(Number(CutS[3]));
                                if (d <= 0) {
                                    d = 1;
                                    cngTimeF = true;
                                } else {
                                    if (d > iDaysInMonth) {
                                        d = iDaysInMonth;
                                        cngTimeF = true;
                                    }
                                }
                            }
                            if (Y !== -1) {
                                if (clsTime.Check_YMD_Correct(Y, m, d) === false) {
                                    alert("TIMEタグの時期設定が不正です。");
                                    return { ok: false, emes: ObjectErrorMessage };
                                }
                                LayerReading.Time = new strYMD(Y, m, d);
                                if (cngTimeF === true) {
                                    LayerError += "TIMEタグの時期は修正されました:" + LayerReading.Time.toString() + '\n';
                                }
                            }
                        } else {
                            LayerError += "TIMEタグに時間設定がありません。" + '\n';
                        }
                    } else {
                        LayerError += "1つのレイヤには1箇所しかTIMEタグは使用できません。" + '\n';
                    }
                    break;
                }
                case "MISSING": {
                    if (2 <= CutN) {
                        if (CutS[1].toUpperCase() === "ON") {
                            TotalMissing = true;
                        } else {
                            TotalMissing = false;
                        }
                    }
                    break;
                }
                default: {
                    if ((lay === -1) && (Map_readed === false)) {
                        return { ok: false, emes: ObjectErrorMessage };
                    }
                    if (Map_readed === false) {
                        ObjectErrorMessage += "データの先頭にMAPタグが見つかりません。\n";
                        return { ok: false, emes: ObjectErrorMessage };
                    }
                    if ((this.MapData.SetMapFile(LayerReading.MapFile).Map.Time_Mode === true) &&
                        (LayerReading.Type !== enmLayerType.Trip_Definition)) {
                        if (LayerReading.Time.nullFlag() === true) {
                            LayerError += "使用する地図ファイルは、時空間モードで作成されています。" + '\n' + "レイヤごとにTIMEタグを使用して属性データの時期を指定してください。" + '\n';
                            ObjectErrorMessage += LayerError;
                            return { ok: false, emes: ObjectErrorMessage };
                        }
                    }
                    if (lay === -1) {
                        lay = 0;
                    }
                    LayerReading.ObjectDataStac.push(CutS);
                    break;
                }
            }
        }
        const retv = this.Set_Data_from_String(LayerReading, TotalMissing);
        OK_Flag = OK_Flag && retv.ok;
        LayerError += retv.emes;
        if (LayerError !== "") {
            ObjectErrorMessage += "エラー／レイヤ:";
            if (LayerReading.Name === "") {
                ObjectErrorMessage += (this.TotalData.LV1.Lay_Maxn).toString() + '\n';
            } else {
                ObjectErrorMessage += LayerReading.Name + '\n';
            }
            ObjectErrorMessage += LayerError + '\n';
        }
        if ((lay === -1) ){
            return { ok: false, emes: ObjectErrorMessage };
        }
        if (this.TotalData.LV1.Lay_Maxn === 0) {
            return { ok: false, emes: ObjectErrorMessage };
        }
        return { ok: OK_Flag, emes: ObjectErrorMessage };
    }

    /**オブジェクトからオブジェクトコードを返す。見つからない場合は-1を返す Timeは地図ファイル指定の場合     */
    Get_ObjectCode_from_ObjName(Layernum_MapfileName: JsonValue, ObjName: string, Time: strYMD): number {
        if(typeof(Layernum_MapfileName)==="string"){//地図ファイル指定
            const MapFileObjectNameSearch = this.MapData.SetObject_Name_Search(Layernum_MapfileName);
            return MapFileObjectNameSearch.Get_KenToCode(String(ObjName), Time);
        }else{//レイヤ指定
            const layerIndex = Number(Layernum_MapfileName);
            const MapFileObjectNameSearch = this.MapData.SetObject_Name_Search(this.LayerData[layerIndex].MapFileName);
            return MapFileObjectNameSearch.Get_KenToCode(String(ObjName), this.LayerData[layerIndex].Time);    
        }
    }


    //文字列からデータに変換
    Set_Data_from_String(LayerReading: strLayerReadingInfo, TotalMissing: boolean): {ok: boolean, emes: string} {
        let E_Mes = "";
        const MapFileData = this.MapData.SetMapFile(LayerReading.MapFile as string);
        const MapFileObjectNameSearch = this.MapData.SetObject_Name_Search(LayerReading.MapFile as string);
        const Object_Use_Check: boolean[] = Array.from({ length: MapFileData.Map.Kend - 1 }, () => false);
        const No_Object_Name: string[] = [];
        const Over_Lap_Object: string[] = [];

        let MxData = 0;
        const LayerReadingTTL = LayerReading.TTL as string[];
        const LayerReadingUNT = LayerReading.UNT as string[];
        const LayerReadingDTMis = LayerReading.DTMis as JsonValue[];
        const LayerReadingNote = LayerReading.Note as string[];
        const LayerReadingObjectDataStac = LayerReading.ObjectDataStac as string[][];
        MxData = Math.max(LayerReadingTTL.length, MxData);
        MxData = Math.max(LayerReadingUNT.length, MxData);
        MxData = Math.max(MxData, LayerReadingDTMis.length);
        MxData = Math.max(MxData, LayerReadingNote.length);
        for (let i = 0; i < LayerReadingObjectDataStac.length; i++) {
            MxData = Math.max(MxData, LayerReadingObjectDataStac[i].length);
        }
        if (MxData === 0) {
            return { ok: false, emes: "タグ・オブジェクトが存在しません。" + '\n' };
        }
        const DN_Str = Generic.Array2Dimension(MxData, LayerReadingObjectDataStac.length);
        
        const Get_Obj: Array<strObject_Data_Info | strTripObjData_Info | string> = [];
        let MeshCodeLen = 0;
        const LayerReadingType = LayerReading.Type as number;
        if (LayerReadingType === enmLayerType.Mesh) {
            MeshCodeLen = Generic.getMeshCodeLength(LayerReading.MeshType as number) ?? 0;
        }

        for (let i = 0; i < LayerReadingObjectDataStac.length; i++) {
            const CutS = LayerReadingObjectDataStac[i];
            const OBName = CutS[0];
            let code: number | undefined;
            switch (LayerReadingType) {
                case (enmLayerType.Normal): {
                    code = MapFileObjectNameSearch.Get_KenToCode(OBName, LayerReading.Time);
                    if (code === -1) {
                        No_Object_Name.push(OBName);
                    } else if (code !== undefined) {
                        if (Object_Use_Check[code] === true) {
                            Over_Lap_Object.push(OBName);
                            code = -1;
                        } else {
                            Object_Use_Check[code] = true;
                        }
                    }
                    break;
                }
                case (enmLayerType.Mesh): {
                    if (OBName.length !== MeshCodeLen) {
                        No_Object_Name.push(OBName);
                        code = -1;
                    } else {
                        code = -2;// Val(OBName)10桁以上になるとintegerに入らない
                    }
                    break;
                }
                case (enmLayerType.Trip): {
                    const d = new  strTripObjData_Info();
                    d.TripPersonName = OBName;
                    Get_Obj.push(d);
                    break;
                }
                case (enmLayerType.Trip_Definition): {
                    Get_Obj.push(OBName);
                    code = 0;
                    break;
                }
                default:
                    code = 0;
            }
            if (code !== -1) {
                if ((LayerReadingType === enmLayerType.Mesh) || (LayerReadingType === enmLayerType.Normal) || (LayerReadingType === enmLayerType.DefPoint)) {
                    const d = new strObject_Data_Info();
                    d.MpObjCode = code;
                    d.Name = OBName;
                    d.Objectstructure = enmKenCodeObjectstructure.MapObj;
                    if (LayerReadingType === enmLayerType.Normal) {
                        const layerTime = LayerReading.Time;
                        d.CenterPoint = MapFileData.Get_Enable_CenterP(code, layerTime);
                        d.Symbol = d.CenterPoint;
                        d.Label = d.Symbol;
                        d.Visible = true;
                    }
                    Get_Obj.push(d);
                }
            }
            for (let j = 1; j < MxData; j++) {
                let T = "";
                if (j < CutS.length) {
                    T = CutS[j];
                }
                DN_Str[j - 1][Get_Obj.length - 1] = T;
            }
        }
        if( MapFileData.Map.Zahyo.Mode !== enmZahyo_mode_info.Zahyo_Ido_Keido ){
            switch (LayerReading.Type) {
                case (enmLayerType.Mesh): {
                    E_Mes = "メッシュレイヤの場合は、緯度経度情報つきの地図ファイルを使用して下さい。" + '\n';
                    return { ok: false, emes: E_Mes };
                    break;
                }
                case (enmLayerType.DefPoint): {
                    E_Mes = "地点定義レイヤの場合は、緯度経度情報つきの地図ファイルを使用して下さい。" + '\n';
                    return { ok: false, emes: E_Mes };
                    break;
                }
            }
        }
        if (0 < No_Object_Name.length) {
            switch (LayerReading.Type) {
                case (enmLayerType.Mesh): {
                    E_Mes += "以下のメッシュコードは指定のメッシュと異なります。" + '\n';
                    break;
                }
                case (enmLayerType.Normal): {
                    E_Mes += "以下のオブジェクトは地図ファイルに含まれていません。" + '\n';
                    break;
                }
            }
            for (let i = 0; i < Math.min(50, No_Object_Name.length); i++) {
                E_Mes += No_Object_Name[i] + '\n';
            }
            if (50 < No_Object_Name.length) {
                E_Mes += "ほか" + (Number(No_Object_Name.length) - 50) + "オブジェクト" + '\n';
            }
            E_Mes += + '\n';
        }
        if (0 < Over_Lap_Object.length) {
            E_Mes += "以下のオブジェクトは同一レイヤ内に複数含まれていました。最初に出てきたものが採用されています。" + '\n';
            E_Mes += Over_Lap_Object.join('\n');
        }

        const Object_num = Get_Obj.length;
        if (Object_num === 0) {
            E_Mes = "有効なオブジェクトがありません。";
            return { ok: false, emes: E_Mes };
        }
        
        const layerTime = LayerReading.Time;
        this.Add_one_Layer(LayerReading.Name as string, LayerReading.Type as number, LayerReading.MeshType as number, LayerReading.Shape as number, LayerReading.MapFile as string,
            layerTime, LayerReading.ReferenceSystem as number, LayerReading.Comment_Temp as string, Object_num, Get_Obj);

        const Laye_Shape_Emes = this.Check_LayerShape();
        if (Laye_Shape_Emes !== "") {
            E_Mes += Laye_Shape_Emes + '\n';
        }

        if ((LayerReading.UNT as string[]).length === 0) {
            LayerReading.UNT = new Array<string>(MxData).fill("");
        }
        if ((LayerReading.TTL as string[]).length === 0) {
            LayerReading.TTL = new Array<string>(MxData).fill("");
        }

        if ((LayerReading.DTMis as JsonValue[]).length === 0) {
            LayerReading.DTMis = new Array<JsonValue>(MxData).fill(TotalMissing);
        }
        if ((LayerReading.Note as string[]).length === 0) {
            LayerReading.Note = new Array<string>(MxData).fill("");
        }

        (LayerReading.TTL as JsonValue[]).shift();
        (LayerReading.UNT as JsonValue[]).shift();
        (LayerReading.DTMis as JsonValue[]).shift();
        (LayerReading.Note as JsonValue[]).shift();

        const DummmyObjNamesList: string[] = [];
        const LayerReadingDummyTemp = LayerReading.Dummy_Temp;
        for (let i = 0; i < LayerReadingDummyTemp.length; i++) {
            const DCS = LayerReadingDummyTemp[i];
            for (let j = 1; j < DCS.length; j++) {
                if (DCS[j] !== "") {
                    DummmyObjNamesList.push(DCS[j]);
                }
            }
        }

        const DummmyObjGroupNamesList: string[] = [];
        const LayerReadingDummyOBKTemp = LayerReading.Dummy_OBKTemp as string[][];
        for (let i = 0; i < LayerReadingDummyOBKTemp.length; i++) {
            const DCS = LayerReadingDummyOBKTemp[i];
            for (let j = 1; j < DCS.length; j++) {
                if (DCS[j] !== "") {
                    DummmyObjGroupNamesList.push(DCS[j]);
                }
            }
        }
        const NowLay = this.TotalData.LV1.Lay_Maxn - 1;
        const Emes = this.Set_Dummy_and_Group(NowLay, DummmyObjNamesList, DummmyObjGroupNamesList);
        if (Emes !== "") {
            E_Mes += "ダミーオブジェクト指定で地図ファイルに含まれないものがあります。" + '\n' + Emes
        }
        const retv = this.Set_STRData_To_Cell(NowLay, MxData - 1, LayerReading.TTL as string[], LayerReading.UNT as string[], LayerReading.DTMis as JsonValue[], LayerReading.Note as string[], DN_Str as string[][]);
        E_Mes += retv.emes;
        return { ok: retv.ok, emes: E_Mes };
    }


    //レイヤ単位で文字列配列に入れたデータを設定する
    Set_STRData_To_Cell(Layernum: number, DataNum: number, TTL: string[], UNT: string[], DTMissing: JsonValue[], Note: string[], DN_Str: string[][]): {ok: boolean, emes: string} {
        let ErrorMes = "";
        const L = this.LayerData[Layernum];
        const ObjNum = L.atrObject.ObjectNum;
        const DataItemNotF: boolean[] = Array.from({ length: DataNum }, () => false);
        const URLData: number[] = Array.from({ length: DataNum }, () => 0);
        const URL_NameData: number[] = Array.from({ length: DataNum }, () => 0);
        let URLDataNum = 0;
        let URL_NameDataNum = 0;
        let LatPosition = -1;
        let LonPosition = -1;

        let DepartureGet = -1;
        let ArrivalGet = -1;
        let PlaceGet = -1;
        for (let i = 0; i < DataNum; i++) {
            const Uttl = TTL[i].toUpperCase();
            if (Uttl === "URL") {
                DataItemNotF[i] = true;
                URLData[URLDataNum] = i;
                URLDataNum += 1;
            } else if (Uttl === "URL_NAME") {
                DataItemNotF[i] = true;
                URL_NameData[URL_NameDataNum] = i;
                URL_NameDataNum += 1;
                break;
            } else {
                switch (L.Type) {
                    case (enmLayerType.Trip): {
                        //移動データのデータは通常のデータに入れない
                        switch (Uttl) {
                            case ("LAT"): {
                                if (LatPosition === -1) {
                                    LatPosition = i;
                                }
                                DataItemNotF[i] = true;
                                break;
                            }
                            case ("LON"): {
                                if (LonPosition === -1) {
                                    LonPosition = i;
                                }
                                DataItemNotF[i] = true;
                                break;
                            }
                            case ("PLACE"): {
                                if (PlaceGet === -1) {
                                    PlaceGet = i;
                                }
                                DataItemNotF[i] = true;
                                break;
                            }
                            case ("ARRIVAL"): {
                                if (ArrivalGet === -1) {
                                    ArrivalGet = i;
                                }
                                DataItemNotF[i] = true;
                                break;
                            }
                            case ("DEPARTURE"): {
                                if (DepartureGet === -1) {
                                    DepartureGet = i;
                                }
                                DataItemNotF[i] = true;
                                break;
                            }
                        }
                        break;
                    }
                    case (enmLayerType.DefPoint): {
                        //地点定義レイヤ
                        if (Uttl === "LAT") {
                            if (LatPosition === -1) {
                                LatPosition = i;
                            }
                            DataItemNotF[i] = true;
                        } else if (Uttl === "LON") {
                            if (LonPosition === -1) {
                                LonPosition = i;
                            }
                            DataItemNotF[i] = true;
                        }
                        break;
                    }
                }
            }
        }
        //リンク
        if ((L.Type !== enmLayerType.Trip) && (L.Type !== enmLayerType.Trip_Definition)) {
            for (let i = 0; i < ObjNum; i++) {
                const O = L.atrObject.atrObjectData[i];
                O.HyperLinkNum = 0;
                O.HyperLink = [];
                if (0 < URL_NameDataNum) {
                    for (let j = 0; j < URLDataNum; j++) {
                        const T = DN_Str[URLData[j]][i];
                        if (T !== "") {
                            const u = new strURL_Data();
                            u.Address = T;
                            u.Name = DN_Str[URL_NameData[j]][i];
                            O.HyperLink.push(u);
                            O.HyperLinkNum++;
                        }
                    }
                }
            }
        }
        //移動データの処理
        if (L.Type === enmLayerType.Trip) {
            let posTagF = false;
            if ((LatPosition !== -1) && (LonPosition !== -1)) {
                L.TripType = enmTripPositionType.LatLon;
                posTagF = true;
            } else if (PlaceGet !== -1) {
                L.TripType = enmTripPositionType.ObjectSet;
                posTagF = true;
            } else {
                ErrorMes += "移動データレイヤの位置指定のタグ（LAT,LON,PLACE）が指定されていません。" + '\n';
            }
            if (ArrivalGet === -1) {
                ErrorMes += "移動データレイヤの到着時間タグ（ARRIVAL）が指定されていません。" + '\n';
            }
            if (DepartureGet === -1) {
                ErrorMes += "移動データレイヤの出発時間タグ（DEPARTURE）が指定されていません。" + '\n';
            }
            if ((ArrivalGet === -1) || (DepartureGet === -1) || (posTagF === false)) {
                return { ok: false, emes: ErrorMes };
            }

            for (let j = 0; j < L.atrObject.ObjectNum; j++) {
                const TD = L.atrObject.TripObjData[j];
                if (L.TripType === enmTripPositionType.ObjectSet) {
                    TD.PositionObjName = DN_Str[PlaceGet][j];
                } else {
                    TD.PositionObjName = "";
                    const lonV = Number(DN_Str[LonPosition][j]);
                    const latV = Number(DN_Str[LatPosition][j]);
                    TD.LatLon = new latlon(latV, lonV);
                }
                TD.PositionObjName += '\t' + DN_Str[ArrivalGet][j].trim() + '\t' + DN_Str[DepartureGet][j].trim();//後でCheck_Trip_Dataから中身を調べる
            }
        }

        //メッシュレイヤの処理
        if (L.Type === enmLayerType.Mesh) {
            for (let j = 0; j < L.atrObject.ObjectNum; j++) {
                const O = L.atrObject.atrObjectData[j];
                const mapZahyo = this.SetMapFile("").Map.Zahyo;
                const retV=spatial.Get_MeshCode_Rectangle( O.Name, L.MeshType, L.ReferenceSystem, mapZahyo);
                O.CenterPoint = spatial.Get_Converted_XY(retV.latlonBox.CenterPoint().toPoint(), mapZahyo);
                O.Symbol = O.CenterPoint.Clone();
                O.Label = O.CenterPoint.Clone();
                O.MeshRect = retV.convRect;
                O.MeshPoint = retV.RPoint;
                O.Visible = true;
            }
        }

        //地点定義レイヤの処理
        if (L.Type === enmLayerType.DefPoint) {
            if (LonPosition === -1) {
                ErrorMes += "地点定義レイヤの経度（LONタグ）が指定されていません。" + '\n';
            }
            if (LatPosition === -1) {
                ErrorMes += "地点定義レイヤの経度（LATタグ）が指定されていません。" + '\n';
            }
            if ((LonPosition === -1) || (LatPosition === -1)) {
                return { ok: false, emes: ErrorMes };
            }
            let valE = false;
            for (let j = 0; j < L.atrObject.ObjectNum; j++) {
                const O = L.atrObject.atrObjectData[j];
                let lonV = Number(Generic.convValue(DN_Str[LonPosition][j]));
                if (isNaN(lonV) === true) {
                    ErrorMes += "地点定義レイヤの経度で数字以外の地点があります。(" + O.Name + ":" + DN_Str[LonPosition][j] + ")" + '\n';
                    valE = true;
                    lonV=0;
                }

                let latV = Number(Generic.convValue(DN_Str[LatPosition][j]));
                if (isNaN(latV) === true) {
                    ErrorMes += "地点定義レイヤの緯度で数字以外の地点があります。(" + O.Name + ":" + DN_Str[LatPosition][j] + ")" + '\n';
                    valE = true;
                    latV=0;
                } else {
                    if (Math.abs(latV) >= 90) {
                        ErrorMes += "地点定義レイヤの緯度で90度を超えている地点があります。(" + O.Name + DN_Str[LatPosition][j] + ")" + '\n';
                        valE = true;
                        latV=0;
                    }
                }
                O.defPoint = new latlon(latV, lonV);
                const conp = spatial.ConvertRefSystemLatLon(O.defPoint, L.ReferenceSystem, this.SetMapFile("").Map.Zahyo.System);
                O.CenterPoint = spatial.Get_Converted_XY(conp.toPoint(), this.SetMapFile("").Map.Zahyo);
                O.Symbol = O.CenterPoint;
                O.Label = O.CenterPoint;
                O.Visible = true;
            }
            if (valE === true) {
                return { ok: false, emes: ErrorMes };
            }
        }
        //データ項目の追加
        let addErMes = "";
        const Data_Val_STR: string[] = Array.from({ length: ObjNum }, () => "");
        for (let i = 0; i < DataNum; i++) {
            if (DataItemNotF[i] === false) {
                for (let j = 0; j < ObjNum; j++) {
                    Data_Val_STR[j] = DN_Str[i][j];
                }
                const Dtype = Generic.getAttDataType_From_TitleUnit(TTL[i], UNT[i]);
                if (Dtype === enmAttDataType.Normal) {
                    for (let j = 0; j < ObjNum; j++) {
                        if (Data_Val_STR[j] !== "") {
                            Data_Val_STR[j] = Data_Val_STR[j].replace(/,/g, "");
                        }
                        if ((isNaN(Data_Val_STR[j]) === true)||(Data_Val_STR[j] === "")) {
                            if (Data_Val_STR[j] === "") {
                                if (DTMissing[i] === false) {
                                    if ((TTL[i] !== "") || (UNT[i] !== "")) {
                                        addErMes += "欠損値設定でないデータ項目に空白データがあります。0に設定されます。(" + TTL[i] + ")" + '\n';
                                        Data_Val_STR[j] = "0";
                                    }
                                }else{
                                    Data_Val_STR[j] = undefined;
                                }
                            } else {
                                addErMes += "数字以外のデータがあります。欠損値に設定されます。(" + TTL[i] + ":" + Data_Val_STR[j] + ")" + '\n';
                                DTMissing[i] = true;
                                Data_Val_STR[j] = undefined;
                            }
                        }
                    }
                }
                const missingValue = (typeof DTMissing[i] === 'boolean' && DTMissing[i]) ? true : false;
                if (this.Add_One_Data_Value(Layernum, TTL[i], UNT[i], Note[i], Data_Val_STR, missingValue) === false) {
                    if (TTL[i] !== "") {
                        addErMes += TTL[i] +"はデータ値がないため取得できませんでした。" + '\n';
                    }
                }
            }

        }
        if (addErMes.length !== 0) {
            ErrorMes += addErMes;
        }
        if ((this.Get_DataNum(Layernum) === 0) && (L.Type !== enmLayerType.Trip)) {
            this.Add_One_Data_Value(Layernum, "地図表示", "CAT", "", new Array(ObjNum).fill(''), false)
            switch (L.Shape){
                case (enmShape.PointShape):{
                    L.atrData.Data[0].SoloModeViewSettings.Class_Div[0].PaintColor = new colorRGBA([255, 255,191, 255])
                    break;
                }
                case (enmShape.PolygonShape):{
                    L.atrData.Data[0].SoloModeViewSettings.Class_Div[0].PaintColor = clsBase.ColorWhite();
                    break;
                }
            }
            ErrorMes += "有効なデータ項目がなかったため、「地図表示」データ項目を自動生成しました。";
        }


        return { ok: true, emes: ErrorMes };
    }

    //レイヤにダミーオブジェクトとグループを設定する
    Set_Dummy_and_Group(LayerNum: number, Dummy: string[], DummyGroup: string[]): string {
        const L = this.LayerData[LayerNum];
        if (L.Type === enmLayerType.Trip_Definition) {
            return "";
        }
        let DummyEmes = "";
        if (Dummy !== undefined) {
            L.Dummy=[];
            for (let i = 0; i < Dummy.length; i++) {
                const k = L.MapFileObjectNameSearch.Get_KenToCode(Dummy[i], L.Time);
                if (k !== -1) {
                    const d=new strDummyObjectName_and_Code();
                    d.code=k;
                    d.Name=Dummy[i];
                    L.Dummy.push(d);
                } else {
                    if (DummyEmes !== "") {
                        DummyEmes += "/";
                    }
                    DummyEmes += Dummy[i];
                }
            }
        }

        let DummyGroupEmes = "";
        if (DummyGroup !== undefined) {
            L.DummyGroup=[];
            for (let i = 0; i < DummyGroup.length; i++) {
                const k = L.MapFileData.Get_ObjectGroupNumber_By_Name(DummyGroup[i]);
                if (k !== -1) {
                    L.DummyGroup.push(k);
                } else {
                    if (DummyGroupEmes !== "") {
                        DummyGroupEmes += "/";
                    }
                    DummyGroupEmes += DummyGroup[i];
                }
            }
        }
        if ((DummyEmes !== "") && (DummyGroupEmes !== "")){
            DummyEmes += '\n';
        }
        const Emes = DummyEmes + DummyGroupEmes;

        return Emes;
    }

    /**白地図・初期属性データ表示から読み込み DeleteDefDataFlag:取得した初期属性データを地図データ中から削除する場合true */
    SetMapViewerData(MapDataList: clsMapdata[], LayDataInf: strLayerInfo[], DeleteDefDataFlag: boolean): void {      
        this.MapData = new clsAttrMapData();
        for (let i = 0; i < MapDataList.length;i++) {
            this.MapData.AddExistingMapData(MapDataList[i], MapDataList[i].Map.FileName);
        }
        this.TotalData.ViewStyle.Zahyo = this.MapData.GetPrestigeZahyoMode();
        this.MapData.EqualizeZahyoMode(this.TotalData.ViewStyle.Zahyo);

        let LayN = 0;
        let  noAttrData = true;
        for (const key in LayDataInf) {
            const layData = LayDataInf[key];
            const Get_Obj = [];
            let fobk = 0;
            const UseMap = this.SetMapFile(String(layData.MapfileName));
            for (let i = 0; i < UseMap.Map.Kend; i++) {
                if (layData.UseObjectKind[UseMap.MPObj[i].Kind] === true) {
                    fobk = UseMap.MPObj[i].Kind;
                    const objName = UseMap.Get_Enable_ObjectName(i, layData.Time, false);
                    if (objName !== undefined && typeof objName !== 'string') {
                        const CP = UseMap.Get_Enable_CenterP(i, layData.Time);
                        const ob = new strObject_Data_Info();
                        ob.MpObjCode = i;
                        ob.Name = String(objName[0]);
                        ob.Objectstructure = enmKenCodeObjectstructure.MapObj;
                        ob.CenterPoint = CP.Clone();
                        ob.Symbol = CP.Clone();
                        ob.Label = CP.Clone();
                        ob.Visible = true;
                        ob.HyperLinkNum=0;
                        Get_Obj.push(ob);
                    }
                }
            }
            let layshape = layData.Shape as number;
            if (layshape === enmShape.NotDeffinition) {
                layshape = UseMap.MPObj[Get_Obj[0].MpObjCode].Shape;
            }

            const objn = Get_Obj.length;
            this.Add_one_Layer(layData.Name, enmLayerType.Normal, enmMesh_Number.mhNonMesh, layshape, String(layData.MapfileName), layData.Time,
                enmZahyo_System_Info.Zahyo_System_No, "", objn, Get_Obj);
            if (UseMap.ObjectKind[fobk].DefTimeAttDataNum === 0) {
                //初期属性が無い場合の色の設定

                this.Add_One_Data_Value(LayN, "地図表示", "CAT", "", new Array(objn).fill(''), false)
                if (Number(layData.Shape) !== enmShape.LineShape) {
                    this.LayerData[LayN].atrData.Data[0].SoloModeViewSettings.Class_Div[0].PaintColor = new colorRGBA([255, 255, 255,255])
                }
            } else {
                noAttrData = false;
                const nDX = UseMap.ObjectKind[fobk].DefTimeAttDataNum;
                let misf = false;
                for (let j = 0; j < nDX; j++) {
                    const attData = UseMap.ObjectKind[fobk].DefTimeAttSTC[j].attData;
                    const Data_Val = [];
                    for (let k = 0; k < objn; k++) {
                        let v = UseMap.Get_DefTimeAttrValue(Get_Obj[k].MpObjCode, j, layData.Time);
                        if((attData.MissingF===true)&&(v==="")){
                            v = undefined;
                        }
                        if (v === undefined) {
                            misf = true;
                        }
                        Data_Val.push(v);
                    }
                    if((attData.MissingF===true)&&(misf === false)){
                        misf=true;
                    }
                    this.Add_One_Data_Value(LayN, attData.Title, attData.Unit, attData.Note, Data_Val, misf);
                }
                if (DeleteDefDataFlag === true) {
                    UseMap.DeleteAllDefAttrData(fobk);
                }
            }
            LayN += 1;

        }
        this.TotalData.LV1.DataSourceType = enmDataSource.Viwer;
        this.TotalData.LV1.FileName =Generic.getFilenameWithoutExtension( this.LayerData[0].MapFileName);
        this.TotalData.LV1.FullPath = this.TotalData.LV1.FileName;
        this.initTotalData_andOther();
        if (noAttrData === true) {
            this.TotalData.ViewStyle.MapLegend.Base.Visible = false;
            this.TotalData.ViewStyle.MapTitle.Visible = false;
        }

        this.Check_LayerShape();
    }

    //レイヤの形状を実際のオブジェクトの形状に基づいて設定
    Check_LayerShape(): string {
        let EMes = "";
        for (let i = 0; i < this.TotalData.LV1.Lay_Maxn; i++) {
            const L = this.LayerData[i];
            switch (L.Type) {
                case (enmLayerType.Normal): {
                    const sp = this.Check_LayerShape_Sub(i);
                    if (sp.emes !== "") {
                        EMes += sp.emes;
                    }
                    switch (L.Shape) {
                        case (enmShape.NotDeffinition): {
                            L.Shape = sp.shape;
                            break;
                        }
                        case (enmShape.PolygonShape): {
                            if (sp.shape !== enmShape.PolygonShape) {
                                EMes += "面形状に指定されましたが、" + Generic.ConvertShapeEnumString(sp.shape) + "形状に設定されました。" + '\n';
                                L.Shape = sp.shape;
                            }
                            break;
                        }
                        case (enmShape.LineShape): {
                            if (sp.shape === enmShape.PointShape) {
                                EMes += "線形状に指定されましたが、" + Generic.ConvertShapeEnumString(sp.shape) + "形状に設定されました。" + '\n';
                                L.Shape = sp.shape;
                            }
                            break;
                        }
                    }
                    break;
                }
                case (enmLayerType.DefPoint): {
                    L.Shape = enmShape.PointShape;
                    break;
                }
                case (enmLayerType.Mesh): {
                    if (L.Shape === enmShape.NotDeffinition) {
                        L.Shape = enmShape.PolygonShape;
                    }
                    break;
                }
            }
        }
        return EMes;
    }

    Check_LayerShape_Sub(LayerNum: number): { shape: number; emes: string } {
        let EMes = "";
        const L = this.LayerData[LayerNum];
        switch (L.Type) {
            case (enmLayerType.Mesh): {
                return { shape: enmShape.PolygonShape, emes: EMes };
                break;
            }
        }

        const sh: number[] = Array.from({ length: 3 }, () => 0);
        for (let j = 0; j < L.atrObject.ObjectNum; j++) {
            let D = 0;
            const O = L.atrObject.atrObjectData[j];
            if (O.Objectstructure === enmKenCodeObjectstructure.MapObj) {
                D = L.MapFileData.MPObj[O.MpObjCode].Shape;
            } else {
                D = L.atrObject.MPSyntheticObj[O.MpObjCode].Shape;
            }
            sh[D] ++;
        }
        let shcount = 0;
        let shmax = sh[0];
        let shmaxN: 0 | 1 | 2 = 0;
        for (let j = 0; j <= 2; j++) {
            if (sh[j] > 0 ) {
                shcount++;
                if (shmax < sh[j] ) {
                    shmax = sh[j];
                    shmaxN = j as 0 | 1 | 2;
                }
            }
        }
        if (shcount > 1) {
            EMes += "レイヤ：" + L.Name + '\n';
            EMes += "オブジェクトの形状が混在しています。" + '\n';
            EMes += "最も多い形状：" + Generic.ConvertShapeEnumString(shmaxN) + '\n';
            EMes += "それ以外の形状のオブジェクト" + '\n';
            for (let j = 0; j < L.atrObject.ObjectNum; j++) {
                let D;
                const O = L.atrObject.atrObjectData[j];
                if (O.Objectstructure === enmKenCodeObjectstructure.MapObj) {
                    D = L.MapFileData.MPObj[O.MpObjCode].Shape;
                } else {
                    D = L.atrObject.MPSyntheticObj[O.MpObjCode].Shape;
                }
                if (D !== shmaxN) {
                    EMes += L.atrObject.atrObjectData[j].Name + "(" + Generic.ConvertShapeEnumString(D) + ")" + '\n';
                }
            }
        }
        return { shape: Generic.checkShape(sh), emes: EMes };
    }

    //オブジェクトグループ連動型線種の線種決定
    LinePatternCheck(): void {
        for (let Lay = 0; Lay < this.TotalData.LV1.Lay_Maxn; Lay++) {
            const LD = this.LayerData[Lay];
            if (LD.Type !== enmLayerType.Trip_Definition) {
                const MapFileData = LD.MapFileData;
                for (let i = 0; i < MapFileData.Map.LpNum; i++) {
                    const lk = MapFileData.LineKind[i];
                    if (lk.NumofObjectGroup >= 2) {
                        for (let j = 1; j < lk.NumofObjectGroup; j++) {
                            const Ltmp = [];
                            if ((lk.ObjGroup[j].UseOnly === false) || ((lk.ObjGroup[j].UseOnly === true) && (LD.DummyGroup.indexOf(lk.ObjGroup[j].GroupNumber) !==-1))) {
                                for (let k = 0; k < MapFileData.Map.Kend; k++) {
                                    if (MapFileData.MPObj[k].Kind === lk.ObjGroup[j].GroupNumber) {
                                        const ELine = MapFileData.Get_EnableMPLine(k, LD.Time)
                                        for (const k2 in ELine) {
                                            if (ELine[k2].Kind === i) {
                                                Ltmp[ELine[k2].LineCode] = true;
                                            }
                                        }
                                    }
                                }
                            } else {
                                //データで使われている場合に限る
                                for (let k = 0; k < LD.atrObject.ObjectNum; k++) {
                                    let obk;
                                    if (LD.atrObject.atrObjectData[k].Objectstructure === enmKenCodeObjectstructure.MapObj) {
                                        obk = MapFileData.MPObj[LD.atrObject.atrObjectData[k].MpObjCode].Kind;
                                    } else {
                                        obk = LD.atrObject.MPSyntheticObj[LD.atrObject.atrObjectData[k].MpObjCode].Kind;
                                    }
                                    if (obk === lk.ObjGroup[j].GroupNumber) {
                                        const ELine = this.Get_Enable_KenCode_MPLine(Lay, k);
                                        for (const k2 in ELine) {
                                            if (ELine[k2].Kind === i) {
                                                Ltmp[ELine[k2].LineCode] = true;
                                            }
                                        }
                                    }
                                }
                            }
                            for (let k = 0; k < MapFileData.Map.ALIN; k++) {
                                if ((Ltmp[k] === true) && (LD.ObjectGroupRelatedLine[k] === undefined)) {
                                    LD.ObjectGroupRelatedLine[k] = j;
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    //指定されたオブジェクトで、指定された時期に使用可能なライン数と番号を返す
    Get_Enable_KenCode_MPLine(Layernum: number, ObjNum: number): EnableMPLine_Data[] {
        switch (this.LayerData[Layernum].atrObject.atrObjectData[ObjNum].Objectstructure) {
            case enmKenCodeObjectstructure.MapObj: {
                const O_Code = this.LayerData[Layernum].atrObject.atrObjectData[ObjNum].MpObjCode;
                return this.LayerData[Layernum].MapFileData.Get_EnableMPLine(O_Code, this.LayerData[Layernum].Time);
            }
            case enmKenCodeObjectstructure.SyntheticObj:
                return this.Get_EnableMPLine_SyntheticObject(Layernum, ObjNum);
        }
    }
    //合成オブジェクトの外周線を返す
    Get_EnableMPLine_SyntheticObject(Layernum: number, ObjNum: number): EnableMPLine_Data[] {
        const LD = this.LayerData[Layernum];
        const SO_Code = LD.atrObject.atrObjectData[ObjNum].MpObjCode;
        const Time = LD.Time;
        const ELineStock = [];
        const mp = LD.atrObject.MPSyntheticObj[SO_Code];
        for (let i = 0; i < mp.NumOfObject; i++) {
            if (mp.Objects[i].Draw_F === true) {
                const c = mp.Objects[i].code;
                if (c !== -1) {
                    const ELine = LD.MapFileData.Get_EnableMPLine(c, Time);
                    for (const j in ELine) {
                        ELineStock.push(ELine[j]);
                    }
                }
            }
        }
        const ag = Generic.Get_Outer_Mpline_AggregatedObj(ELineStock, LD.Shape);
        return ag;
    }

    //オブジェクトが画面内に入るかどうかチェック
    Check_screen_Kencode_In(Layernum: number, ObjNum: number): boolean {
        const rect = this.Get_Kencode_Object_Circumscribed_Rectangle(Layernum, ObjNum);
        if (this.TotalData.ViewStyle.ScrData.ThreeDMode.Set3D_F === true) {
            const turnRect = this.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(rect.topLeft());
            const turnRect2 = this.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(rect.bottomRight());
            const turnRectFull = new rectangle(turnRect, turnRect2);
            const formSize = this.TotalData.ViewStyle.ScrData.frmPrint_FormSize;
            const screct = new rectangle(new point(0, 0), new size(formSize.width(), formSize.height()));
            const relation = spatial.Compare_Two_Rectangle_Position(turnRectFull, screct);
            if (relation === cstRectangle_Cross.cstOuter) {
                return false;
            } else {
                if (relation === cstRectangle_Cross.cstInclusion) {
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            if (spatial.Compare_Two_Rectangle_Position(rect, this.TotalData.ViewStyle.ScrData.ScrRectangle) === cstRectangle_Cross.cstOuter) {

                return false;
            } else {
                return true;
            }
        }
    }
        //地図ファイル中のオブジェクトが画面内に入るかどうかチェック
    Check_Screen_Objcode_In(Layernum: number, ObjCode: number): boolean {
        const rect = this.LayerData[Layernum].MapFileData.MPObj[ObjCode].Circumscribed_Rectangle;
        if (this.TotalData.ViewStyle.ScrData.ThreeDMode.Set3D_F === true) {
            const turnRect = this.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(rect.topLeft());
            const turnRect2 = this.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(rect.bottomRight());
            const turnRectFull = new rectangle(turnRect, turnRect2);
            const screct = new rectangle(0, this.TotalData.ViewStyle.ScrData.frmPrint_FormSize.width(), 0, this.TotalData.ViewStyle.ScrData.frmPrint_FormSize.height());
            const relation = spatial.Compare_Two_Rectangle_Position(turnRectFull, screct);
            if (relation === cstRectangle_Cross.cstOuter) {
                return false;
            } else {
                if (relation === cstRectangle_Cross.cstInclusion) {
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            if (spatial.Compare_Two_Rectangle_Position(rect, this.TotalData.ViewStyle.ScrData.ScrRectangle) === cstRectangle_Cross.cstOuter) {
                return false;
            } else {
                return true;
            }
        }
    }

    //指定の画面座標の中心点と半径の領域が画面に入る場合はtrue
    Check_Screen_In(CenterP: point | rectangle, R?: number): boolean {
        if ((CenterP instanceof rectangle) === true){
            if (spatial.Compare_Two_Rectangle_Position(CenterP, this.TotalData.ViewStyle.ScrData.MapScreen_Scale) !== cstRectangle_Cross.cstOuter) {
                return true;
        } else {
            return false;
        }
        } else {
            const R_val = R ?? 0;
            const C_Rect = new rectangle(new point(CenterP.x - R_val, CenterP.y - R_val), new size(R_val * 2, R_val * 2));
            if (spatial.Compare_Two_Rectangle_Position(C_Rect, this.TotalData.ViewStyle.ScrData.MapScreen_Scale) !== cstRectangle_Cross.cstOuter) {
                return true;
            } else {
                return false;
            }
        }
    }

    Add_One_Data_Value(Layernum: number, TTL: string, UNT: string, Note: string, Dn_Val_str: (string | number | undefined)[], Missing_F: boolean): boolean {

        if(TTL === null){TTL=""}
        if(UNT === null){UNT=""}
        const ObjNum = this.LayerData[Layernum].atrObject.ObjectNum;
        
        if (((TTL === "") && (UNT === "")) || ((UNT.toUpperCase() !== "STR") && (UNT.toUpperCase()) !== "CAT")) {
            let f = false;
            let f2=false;
            for (let i = 0; i < ObjNum; i++) {
                if (Dn_Val_str[i] !== undefined) {
                    f = true
                    break;
                }
                if (Dn_Val_str[i] !== undefined) {
                    f2 = true
                    break;
                }
            }
            if (f === false) {
                return false;
            }
            if ((f2 === false)&&(TTL==="")) {
                return false;
            }

        }
        const DataNum = this.Get_DataNum(Layernum);
        const Dtype = Generic.getAttDataType_From_TitleUnit(TTL, UNT);
        const newD = new strData_info();
        newD.MissingF = Missing_F;
        newD.Unit = UNT;
        newD.Title = TTL;
        newD.Note = (Note === null) ? "": Note;
        newD.DataType = Dtype;
        // newD.SoloModeViewSettings.Div_Num = 0;
        if (Dtype === enmAttDataType.Normal) {
            for (let i = 0; i < Dn_Val_str.length; i++) {
                if (Dn_Val_str[i] !== undefined) {
                    const val = Dn_Val_str[i];
                    if (typeof val === 'string' && isNaN(Number(val))) {
                        let sv = val.replace(/,/g, "");
                        sv = sv.replace(/\s+/g, "");
                        newD.Value[i] = Number(sv);
                    } else {
                        newD.Value[i] = typeof val === 'number' ? val : Number(val);
                    }
                } else {
                    newD.Value[i] = undefined;
                }
            }
        } else {
            newD.Value = Dn_Val_str.map(v => {
                if (v === undefined) return undefined;
                return typeof v === 'number' ? v : Number(v);
            }) as (number | undefined)[];
        }
        this.LayerData[Layernum].atrData.Data.push(newD);
        this.LayerData[Layernum].atrData.Count++;
        this.CulcuOne(Layernum, DataNum);//データの統計情報取得
        this.SetIniHanrei(Layernum, DataNum)
        return true;
    }

    //レイヤのオブジェクト数を求める
    Get_ObjectNum(Layernum: number): number {
        return this.LayerData[Layernum].atrObject.ObjectNum;
    }

    //レイヤ名を取得する。レイヤが1つでレイヤ名が空白の場合は""を返す
    Get_Layer_Name(Layernum: number, CR_F=false): string {
        let ln = "";
        if ((this.TotalData.LV1.Lay_Maxn === 1) && (this.LayerData[Layernum].Name === "")) {
            // レイヤ1つで空名の場合は空文字列を返す
        } else {
            ln = "レイヤ:" + this.LayerData[Layernum].Name +  '\n';
            if (CR_F === true) {
                ln +=   '\n';
            }
        } return ln;
    }

    /**指定レイヤの条件設定情報を文字列で出力 */
    Get_Condition_Info(Layernum: number): string {
        let ST1 = "表示オブジェクト限定:"

        if (this.Check_ObjectLimitation(Layernum) === true) {
            ST1 += "あり";
        } else {
            ST1 += "なし";
        }

        let st2 = "";
        for (let ic = 0; ic < this.TotalData.Condition.length; ic++) {
            const tc = this.TotalData.Condition[ic];
            if ((tc.Enabled === true) && (tc.Layer === Layernum)) {
                st2 += this.Get_Layer_Name(Layernum)
                st2 += tc.Name + "\n"
                for (let i = 0; i < this.TotalData.Condition[ic].Condition_Class.length; i++) {
                    const tcc = tc.Condition_Class[i];
                    if (tcc.Condition.length > 0) {
                        st2 += "第" + (i + 1).toString() + "段階" + "\n"
                        for (let j = 0; j < tcc.Condition.length; j++) {
                            const tcc2 = tcc.Condition[j];
                            st2 += "データ項目：" + this.Get_DataTitle(Layernum, tcc2.Data, false) + "／";
                            st2 += tcc2.Val + "／";
                            st2 += Generic.getConditionString(tcc2.Condition);
                            if (j !== tcc.Condition.length-1) {
                                if (tcc.And_OR === enmConditionAnd_Or._And) {
                                    st2 += "　かつ";
                                } else {
                                    st2 += "　または";
                                }
                            }
                            st2 += "\n";
                        }
                    }
                }
                st2 += "\n";
            }
        }
        if (st2 !== "") {
            st2 = "属性検索設定" + "\n" + "\n" + st2;
        } else {
            st2 = "属性検索設定なし" + "\n";
        }
        const ST = ST1 + "\n" + "\n" + st2 + "\n";
        return ST;
    }

    //指定したレイヤに条件設定または表示オブジェクト限定が有効に設定されているかを調べる
    Check_Condition_UMU(Layernum: number): boolean {
        for (let i = 0; i < this.TotalData.Condition.length; i++) {
            if ((this.TotalData.Condition[i].Enabled === true) && (this.TotalData.Condition[i].Layer === Layernum)) {
                return true;
            }
        }
        if (this.Check_ObjectLimitation(Layernum) === true) {
            return true;
        }
        return false;
    }

    //**指定したレイヤに表示オブジェクト限定が有効に設定されているかを調べる */
    Check_ObjectLimitation(Layernum: number): boolean {
        if (this.TotalData.ViewStyle.ObjectLimitationF === true) {
            for (let i = 0; i < this.Get_ObjectNum(Layernum); i++) {
                if (this.LayerData[Layernum].atrObject.atrObjectData[i].Visible === false) {
                    return true;
                }
            }
        }
        return false;
    }

    //表示オブジェクト限定、属性検索条件に合うオブジェクト数を数えて文字列で出力
    Get_Condition_Ok_Num_Info(Layernum: number): string {
        let T = this.Get_Layer_Name(Layernum,false);
        T += "全オブジェクト数:"+ this.Get_ObjectNum(Layernum).toString()  + '\n';
        T += "条件に適合するオブジェクト数:" + this.Get_Condition_Ok_Num(Layernum).toString() +  '\n' + '\n';
        return T;
    }

    //表示オブジェクト限定、属性検索条件に合うオブジェクト数を数える
    Get_Condition_Ok_Num(Layernum: number): number {
        let n = 0;
        for (let j = 0; j < this.Get_ObjectNum(Layernum); j++) {
            if ((this.TotalData.ViewStyle.ObjectLimitationF === false) || (this.LayerData[Layernum].atrObject.atrObjectData[j].Visible === true)) {
                if (this.Check_Condition(Layernum, j) === true) {
                    n++;
                }
            }
        }
        return n;
    }

    //属性検索条件･オブジェクト限定のチェック
    Check_Condition(Layernum: number, Obj: number): boolean {
        if ((this.LayerData[Layernum].atrObject.atrObjectData[Obj].Visible === false) && (this.TotalData.ViewStyle.ObjectLimitationF === true)) {
            return false;
        }

        let af = true;
        const td = this.TotalData.Condition;
        for (let ic = 0; ic < td.length; ic++) {
            const d = td[ic];
            if ((d.Enabled === true) && (d.Layer === Layernum)) {
                for (let i = 0; i < d.Condition_Class.length; i++) {
                    const tdc = d.Condition_Class[i];
                    if (tdc.And_OR === enmConditionAnd_Or._And) {
                        af = true;
                    } else {
                        af = false;
                    }
                    for (let j = 0; j < tdc.Condition.length; j++) {
                        let f;
                        const tdcc = tdc.Condition[j];
                        const V = this.Get_Data_Value(Layernum, tdcc.Data, Obj, "\t");
                        if (V === "\t") {
                            //欠損値の場合
                            f = false;
                        } else {
                            switch (this.Get_DataType(Layernum, tdcc.Data)) {
                                case enmAttDataType.Category:
                                case enmAttDataType.Strings:{
                                    f = false;
                                    const strV = String(V);
                                    const strVal = String(tdcc.Val);
                                    switch (tdcc.Condition) {
                                        case enmCondition.Less:
                                            if (V < tdcc.Val) { f = true }
                                            break;
                                        case enmCondition.LessEqual:
                                            if (V <= tdcc.Val) { f = true }
                                            break;
                                        case enmCondition.Equal:
                                            if (V === tdcc.Val) { f = true }
                                            break;
                                        case enmCondition.GreaterEqual:
                                            if (V >= tdcc.Val) { f = true }
                                            break;
                                        case enmCondition.Greater:
                                            if (V > tdcc.Val) { f = true }
                                            break;
                                        case enmCondition.NotEqual:
                                            if (V !== tdcc.Val) { f = true }
                                            break;
                                        case enmCondition.Include:
                                            if (strV.indexOf(strVal) !== -1) { f = true }
                                            break;
                                        case enmCondition.Exclude:
                                            if (strV.indexOf(strVal) === -1) { f = true }
                                            break;
                                        case enmCondition.Head:
                                            if (strV.substring(0, strVal.length) === strVal) { f = true }
                                            break;
                                        case enmCondition.Foot:
                                            if (strV.substring(strV.length - strVal.length) === strVal) { f = true }
                                            break;
                                    }
                                    break;
                                }
                                default:{
                                    const av = Math.floor(typeof V === 'number' ? V : parseFloat(String(V)));
                                    const valNum = typeof tdcc.Val === 'number' ? tdcc.Val : parseFloat(String(tdcc.Val));
                                    f = false;
                                    switch (tdcc.Condition) {
                                        case enmCondition.Less:
                                            if (av < valNum) { f = true }
                                            break;
                                        case enmCondition.LessEqual:
                                            if (av <= valNum) { f = true }
                                            break;
                                        case enmCondition.Equal:
                                            if (av === valNum) { f = true }
                                            break;
                                        case enmCondition.GreaterEqual:
                                            if (av >= valNum) { f = true }
                                            break;
                                        case enmCondition.Greater:
                                            if (av > valNum) { f = true }
                                            break;
                                        case enmCondition.NotEqual:
                                            if (av !== valNum) { f = true }
                                            break;
                                        case enmCondition.Include:
                                            if (String(V).indexOf(String(tdcc.Val)) !== -1) { f = true }
                                            break;
                                        case enmCondition.Exclude:
                                            if (String(V).indexOf(String(tdcc.Val)) === -1) { f = true }
                                            break;
                                        case enmCondition.Head:
                                            if (String(V).substring(0, String(tdcc.Val).length) === String(tdcc.Val)) { f = true }
                                            break;
                                        case enmCondition.Foot:
                                            if (String(V).substring(String(V).length - String(tdcc.Val).length) === String(tdcc.Val)) { f = true }
                                            break;
                                    }
                                    break;
                                }
                            }
                        }
                        if (tdc.And_OR === enmConditionAnd_Or._And) {
                            if (f === false) {
                                af = false;
                                break;
                            }
                        } else {
                            if (f === true) {
                                af = true;
                                break;
                            }
                        }
                    }
                    if (af === false) {
                        break;
                    }
                }
            }
            if (af === false) {
                break;
            }
        }
        return af;
    }


    //データ項目のデータを配列で取得、欠損値は最小値-1に、カテゴリーデータの場合はカテゴリーの位置
    Get_Data_Cell_Array_With_MissingValue(Layernum: number, DataNum: number): number[] {
        const ObjNum = this.LayerData[Layernum].atrObject.ObjectNum;
        const ad = this.LayerData[Layernum].atrData.Data[DataNum];
        let DT: number[] = [];
        if (ad.EnableValueNum === 0) {
            return DT;
        }
        switch (ad.DataType) {
            case enmAttDataType.Category: {
                DT = this.Get_CategolyArray(Layernum, DataNum);
                break;
            }
            case enmAttDataType.Normal: {
                for (let i = 0; i < ObjNum; i++) {
                    if (ad.Value[i] !== undefined) {
                        DT[i] =Number( ad.Value[i]);
                    } else {
                        DT[i] = ad.Statistics.Min - 1;
                    }
                }
                break;
            }
        }
        return DT;
    }

    //データ項目のデータが欠損値だった場合にTRUEが入る配列を返す
    Get_Missing_Value_DataArray(Layernum: number, DataNum: number): boolean[] {
        const ObjNum = this.LayerData[Layernum].atrObject.ObjectNum;
        let dt: boolean[] = [];
        const ad = this.LayerData[Layernum].atrData.Data[DataNum];
        if ((ad.MissingValueNum === 0) || (ad.MissingF === false)) {
             dt = Array.from({ length: ObjNum }, () => false);
        } else {
            for (let i = 0; i < ObjNum; i++) {
                dt[i] = (ad.Value[i] === undefined);
            }
        }
        return dt;
    }


    //指定したレイヤのデータ項目の全オブジェクトの階級区分の際の位置を配列で取得する。欠損値は-1
    Get_CategolyArray(Layernum: number, DataNum: number): number[] {
        const Category_Array: number[] = [];
        for (let i = 0; i < this.LayerData[Layernum].atrObject.ObjectNum; i++) {
            Category_Array.push(this.Get_Categoly(Layernum, DataNum, i));
        }
        return Category_Array;
    }

    //指定したレイヤのデータ項目・オブジェクトの階級区分の際の位置を取得する。欠損値の場合は-1を返す
    Get_Categoly(Layernum: number, DataNum: number, Objectnum: number): number {
        const ad = this.LayerData[Layernum].atrData.Data[DataNum];
        const Div_Num = ad.SoloModeViewSettings.Div_Num;
        let sj: number = -1;
        if (ad.Value[Objectnum] === undefined) {
            sj = -1;
        } else {
            switch (ad.DataType) {
                case enmAttDataType.Normal: {
                    sj = Div_Num - 1;
                    const h = ad.Value[Objectnum];
                    for (let j = 0; j < Div_Num - 1; j++) {
                        if (h >= ad.SoloModeViewSettings.Class_Div[j].Value) {
                            sj = j;
                            break;
                        }
                    }
                    break;
                }
                case enmAttDataType.Category: {
                    for (let j = 0; j < Div_Num; j++) {
                        if (ad.Value[Objectnum] === ad.SoloModeViewSettings.Class_Div[j].Value) {
                            sj = j;
                            break;
                        }
                    }
                    break;
                }
            }
        }

        return sj;
    }
    //データ項目の初期凡例の設定
    SetIniHanrei(Layernum: number, DataNum: number): void {
        const data = this.LayerData[Layernum].atrData.Data[DataNum];
        const lay = this.LayerData[Layernum];

        if (data.EnableValueNum === 0) {
            return;
        }
        const DType = data.DataType;
        const DataMax = data.Statistics.Max;
        const DataMin = data.Statistics.Min;
        //ペイント
        const pmd = data.SoloModeViewSettings.ClassPaintMD;
        if (lay.Type === enmLayerType.Trip_Definition) {
            pmd.color1 = new colorRGBA([255, 255, 0, 255]);
            pmd.color2 = new colorRGBA([255, 0, 0, 255]);
        } else {
            pmd.color1 = this.defaultColor.paintMode[0].Clone();

                pmd.color2 = this.defaultColor.paintMode[1].Clone();

        }
        //タイトルと単位によって記号モードとペイントモードを振り分ける
        const Class_Mode_Title = ["率", "割合", "密度", "Rate", "density", "average", "平均", "比",
            "Ratio ", "あたり", "当たり", "時間", "距離", "distance", "標高", "水深"];
        const Class_Mode_unit = ["パーセント", "％", "%", " per ", "/", "‰", "パーミル", "／"];
        let m = enmSoloMode_Number.MarkSizeMode;
        let meshF = false;
        switch (lay.Type) {
            case enmLayerType.Mesh:
                meshF = true;
                break;
            case enmLayerType.Normal: {
                const d = lay.atrObject.atrObjectData[0].MpObjCode;
                if (lay.MapFileData.ObjectKind[lay.MapFileData.MPObj[d].Kind].Mesh !== enmMesh_Number.mhNonMesh) {
                    meshF = true;
                }
                break;
            }
        }
        if (DType === enmAttDataType.Strings) {
            m = enmSoloMode_Number.StringMode;
        } else if ((DType === enmAttDataType.Category) || (lay.Shape !== enmShape.PolygonShape) || (data.Unit === "") || (meshF === true)) {
            m = enmSoloMode_Number.ClassPaintMode;
        } else {
            const t = data.Title.toUpperCase();
            for (let i = 0; i < Class_Mode_Title.length; i++) {
                if (t.indexOf(Class_Mode_Title[i].toUpperCase()) !== -1) {
                    m = enmSoloMode_Number.ClassPaintMode;
                    break;
                }
            }
            const u = data.Unit.toUpperCase();
            for (let i = 0; i < Class_Mode_unit.length; i++) {
                if (u.indexOf(Class_Mode_unit[i].toUpperCase()) !== -1) {
                    m = enmSoloMode_Number.ClassPaintMode;
                    break;
                }
            }
        }
        data.ModeData = m;
        data.SoloModeViewSettings.Div_Method = enmDivisionMethod.Free;

        if (DType === enmAttDataType.Category) {
            //'カテゴリーデータの階級区分
            const cateData = this.Get_Data_Cell_Array_Without_MissingValue(Layernum, DataNum);
            const n = cateData.length;
            const Value: (string | number)[] = [];
            for (let i = 0; i < n; i++) {
                Value[i] = cateData[i].DataValue;
            }
            const CateValue = Generic.Remove_Same_String(Value.map(v => String(v)));
            data.Statistics.sa = CateValue.length;
            data.SoloModeViewSettings.Div_Num = CateValue.length;
            data.SoloModeViewSettings.Class_Div = [];
            for (let i = 0; i < CateValue.length; i++) {
                const v = new strClass_Div_data();
                v.Value = CateValue[i];
                data.SoloModeViewSettings.Class_Div.push(v);
            }
            pmd.Color_Mode = enmPaintColorSettingModeInfo.SoloColor;
            const mmMD = data.SoloModeViewSettings.ClassMarkMD;
            mmMD.Data = DataNum;
            mmMD.Flag = 0;

        } else {
            //通常のデータの階級区分値
            const zn = [];
            pmd.Color_Mode = enmPaintColorSettingModeInfo.twoColor;
            const cdiv = Generic.WIC(5, DataMax, DataMin);

            let dk = cdiv.min;
            let cn=0;
            while(dk<=cdiv.max){
                dk=cdiv.min+cdiv.step*cn;
                cn++;
                if (((dk > DataMin) && (dk < DataMax)) || (DataMax === DataMin)) {
                    zn.push(dk);
                }
            }
            const DVN = zn.length;
            for (let k = zn.length - 1; 0 <= k; k--) {
                const v = new strClass_Div_data();
                v.Value = zn[k];
                data.SoloModeViewSettings.Class_Div.push(v);
            }
            data.SoloModeViewSettings.Class_Div.push(new strClass_Div_data());
            data.SoloModeViewSettings.Div_Num = DVN + 1;
            if (lay.Type !== enmLayerType.Trip) {
                //記号の大きさモードの凡例値
                let mzn = [];
                let h = {};
                if (DataMax !== DataMin) {
                    let Max, Min;
                    if (DataMin < 0) {
                        Min = 0;
                        Max = Math.max(Math.abs(DataMax), Math.abs(DataMin));
                    } else {
                        Min = DataMin;
                        Max = DataMax;
                    }
                    const cdiv = Generic.WIC(10, Max, Min);
                    let dk = cdiv.min;
                    let cn=0;
                    while(dk<=cdiv.max){
                        dk=cdiv.min+cdiv.step*cn;
                        cn++;
                        if ((Min < dk) && (dk < Max)) {
                            mzn.push(dk);
                        }
                    }
 
                    const mDVN = mzn.length;
                    switch (mDVN) {
                        case 2:
                            h = { h1: 1, h2: 0, h3: -1 };
                            break;
                        case 3:
                            h = { h1: 2, h2: 1, h3: 0 };
                            break;
                        case 4:
                            h = { h1: 3, h2: 1, h3: 0 };
                            break;
                        case 5:
                            h = { h1: 4, h2: 2, h3: 0 };
                            break;
                        case 6:
                            h = { h1: 5, h2: 2, h3: 0 };
                            break;
                        default:
                            h = { h1: mDVN - 1, h2: Math.floor(mDVN / 2) - 1, h3: 0 };
                            break;
                    }
                } else {
                    h = { h1: 0, h2: 1, h3: 2 };
                    mzn = [DataMax, 0, 0];
                }
                const mmd = data.SoloModeViewSettings.MarkSizeMD;
                mmd.Value[0] = mzn[(h as Record<string, number>).h1];
                mmd.Value[1] = mzn[(h as Record<string, number>).h2];
                if (zn[3] === 0) {
                    mmd.Value[2] = mzn[(h as Record<string, number>).h2] / 2;
                } else {
                    mmd.Value[2] = mzn[(h as Record<string, number>).h3];
                }
                mmd.Value[3] = 0;
                mmd.Value[4] = 0;
                mmd.MaxValueMode = 0;
                mmd.MaxValue = Math.max(Math.abs(DataMax), Math.abs(DataMin));
                if (lay.Shape === enmShape.LineShape) {
                    mmd.LineShape.LineWidth = 1;
                    mmd.LineShape.Color = new colorRGBA([0, 0, 0]);
                    mmd.LineShape.LineEdge = clsBase.LineEdge();;
                } else {
                    mmd.Mark = clsBase.Mark();
                    mmd.Mark.ShapeNumber = 0;
                    mmd.Mark.Tile.BlankF = false;
                    mmd.Mark.Tile.Color = this.defaultColor.markColorTrance.Clone();
                    mmd.Mark.Line.BlankF = false;
                    mmd.Mark.WordFont.Size = 10;
                }
                //記号の数モードの凡例値

                const Max = Math.max(Math.abs(DataMax), Math.abs(DataMin));
                const Min = 0;
                const _ST = 0;
                const mdiv =Generic.WIC(10, Max, Min);
                const mmb = data.SoloModeViewSettings.MarkBlockMD;
                if ((mdiv.step < 1) && (mdiv.min >= 1)){
                    mmb.Value = 1;
                } else {
                    mmb.Value = mdiv.step;
                }
                mmb.ArrangeB = enmMarkBlockArrange.Block;
                mmb.HasuVisible = false;
                mmb.Mark = clsBase.Mark();
                mmb.Mark.Tile.Color=this.defaultColor.markColor.Clone();
                mmb.Mark.WordFont.Size = 2;
                mmb.Overlap = 0;
                mmb.LegendBlockModeWord = "";

                const mmMD = data.SoloModeViewSettings.ClassMarkMD;
                mmMD.Data = DataNum;
                mmMD.Flag = 0;

                const mmt = data.SoloModeViewSettings.MarkTurnMD;
                mmt.Dirction = 0;
                mmt.DegreeLap = 360;
                mmt.Mark = clsBase.Mark();
                mmt.Mark.ShapeNumber = 14;
                mmt.Mark.Tile.Color=this.defaultColor.markColor.Clone();
                mmt.Mark.WordFont.Size = 5;

                const mmbar = data.SoloModeViewSettings.MarkBarMD;
                mmbar.InnerTile.BlankF=false;
                mmbar.InnerTile.Color = this.defaultColor.markBarColor.Clone();
                mmbar.FrameLinePat = clsBase.Line();
                mmbar.ScaleLineInterval = mdiv.step;
                mmbar.MaxHeight = 10;
                mmbar.MaxValueMode = enmMarkSizeValueMode.inDataItem;
                mmbar.MaxValue = DataMax;
                mmbar.scaleLinePat = clsBase.Line();
                mmbar.scaleLinePat.Color = clsBase.ColorWhite();
                mmbar.ScaleLineVisible = true;
                mmbar.Width = 1.5;
                mmbar.ThreeD = true;
                mmbar.BarShape=enmMarkBarShape.bar;
            }
        }

        const mkc = data.SoloModeViewSettings.MarkCommon;
        mkc.MinusTile = clsBase.Tile();
        mkc.MinusTile.Color = this.defaultColor.minusColor.Clone();
        mkc.MinusTile.BlankF = false;
        mkc.MinusLineColor = this.defaultColor.minusColor.Clone();
        mkc.Inner_Data.Flag = 0;
        mkc.Inner_Data.Data = DataNum;
        mkc.LegendMinusWord = "";
        mkc.LegendPlusWord = "";

        const smd = data.SoloModeViewSettings.StringMD;
        smd.Font = clsBase.Font();
        smd.Font.Size = 3;
        smd.Font.FringeF=true;
        smd.maxWidth = 20;
        smd.WordTurnF = true;
        this.Twocolort(Layernum, DataNum);

        if ((DType === enmAttDataType.Normal) && (lay.Shape !== enmShape.LineShape)) {
            const sv = data.SoloModeViewSettings;
            const ctm = sv.ContourMD;
            ctm.Interval_Mode = 2;
            ctm.Detailed = 3;
            ctm.Draw_in_Polygon_F = true;
            ctm.Spline_flag = true;
            if (!ctm.Regular) {
                ctm.Regular = new strContour_Data_Regular_interval();
            }
            const ctmr = ctm.Regular;
            ctmr.bottom = Number(sv.Class_Div[sv.Div_Num - 2].Value);
            ctmr.Interval = (Number(sv.Class_Div[sv.Div_Num - 3].Value) - ctmr.bottom) / 2;
            ctmr.Line_Pat = clsBase.Line();
            ctmr.top = DataMax;
            ctmr.SP_Bottom = ctmr.bottom;
            ctmr.SP_interval = (ctmr.Interval as number) * 5;
            ctmr.SP_Line_Pat = clsBase.Line();
            ctmr.SP_Line_Pat.Color = clsBase.ColorBlue();
            ctmr.SP_Top = ctmr.top;
            ctmr.EX_Value_Flag = false;
            ctmr.EX_Value = 0;
            ctmr.EX_Line_Pat = clsBase.Line();
            ctmr.EX_Line_Pat.Color = clsBase.ColorRed();
            ctm.IrregularNum = 0;
        }
        this.Set_Class_Div(Layernum, DataNum, 0);

        if ((lay.Type !== enmLayerType.Trip) && (lay.Type !== enmLayerType.Trip_Definition)) {
            const odm = data.SoloModeViewSettings.ClassODMD;
            odm.O_object = 0;
            odm.o_Layer = Layernum;
            odm.Dummy_ObjectFlag = false;
            odm.Arrow = clsBase.Arrow();
            for (let kk = 0; kk < this.TotalData.LV1.Lay_Maxn; kk++) {
                if ((this.LayerData[kk].Type !== enmLayerType.Trip) && (this.LayerData[kk].Type !== enmLayerType.Trip_Definition)) {
                    for (let k = 0; k < this.LayerData[kk].atrObject.ObjectNum; k++) {
                        if (lay.atrData.Data[DataNum].Title.indexOf(this.LayerData[kk].atrObject.atrObjectData[k].Name) !== -1) {
                            odm.O_object = k;
                            odm.o_Layer = kk;
                            kk = this.TotalData.LV1.Lay_Maxn;
                            break;
                        }
                    }
                }
            }
        }
    }

    //階級記号、記号の大きさモードなどの内部データ設定の際に、内部データの色またはハッチを返す
    Get_InnerTile(InnerData: strInner_Data_Info, Layernum: number, CategoryPos: number): Tile_Property {
        let t;
        if (CategoryPos === -1) {
            t = this.TotalData.ViewStyle.Missing_Data.PaintTile.Clone();
        } else {
            t = clsBase.Tile();
            const layerDataArray = this.LayerData[Layernum].atrData.Data as strData_info[];
            t.Color = layerDataArray[InnerData.Data].SoloModeViewSettings.Class_Div[CategoryPos].PaintColor.Clone();
        }
        return t;
    }
    //階級区分設定(ペイントモードでは特に設定なし)
    Set_Class_Div(Layernum: number, DataNum: number, setStartPos: number): void {
        const att_DTA = this.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings;
        const n = att_DTA.Div_Num;
        for (let j = setStartPos; j < n; j++) {
            const cs = att_DTA.Class_Div[j];
            cs.ClassMark = clsBase.Mark();
            cs.ClassMark.wordmark = String.fromCharCode("A".charCodeAt(0) + j % 26);
            cs.ClassMark.PrintMark = 1;
            cs.ClassMark.Tile = clsBase.Tile();
            cs.ClassMark.Tile.Color=this.defaultColor.markColor.Clone();
            cs.ClassMark.WordFont = clsBase.Font();
            cs.ClassMark.WordFont.Size = 4;
            cs.ClassMark.WordFont.FringeF=true;

            const w = 1;
            let col = cs.PaintColor;
            if (col.Equals(clsBase.ColorWhite()) === true){
                col = new colorRGBA([200, 200, 200]);
            }
            cs.ODLinePat = clsBase.Line();
            cs.ODLinePat.Color = col;
            cs.ODLinePat.Width = w;
            cs.ODLinePat.Edge_Connect_Pattern.Edge_Pattern = enmEdge_Pattern.Flat;
            if ((j === n - 1) && (this.LayerData[Layernum].atrData.Data[DataNum].DataType === enmAttDataType.Normal) &&
                (this.LayerData[Layernum].Shape === enmShape.PolygonShape) || (this.LayerData[Layernum].Shape === enmShape.PointShape)) {
                cs.ODLinePat.BlankF=true;
            }
        }
    }

    //2色グラテーション設定
    Twocolort(Layernum: number, DataNum: number): void {
        const pms = this.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings;
        const n = pms.Div_Num;
        if (n === 1) {
            pms.Class_Div[0].PaintColor = pms.ClassPaintMD.color1;
        } else {
            const coldata = Generic.TwoColorGradation(pms.ClassPaintMD.color1, pms.ClassPaintMD.color2, n);
            for (let i = 0; i < n; i++) {
                pms.Class_Div[i].PaintColor = coldata[i];
           }
        }
    }

    //3色グラテーション設定
    Threecolor(Layernum: number, DataNum: number, Color_cng_n: number): void {
        const pms = this.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings;
        const n = pms.Div_Num;
        const coldata = Generic.ThreeColorGradation(pms.ClassPaintMD.color1, pms.ClassPaintMD.color3, pms.ClassPaintMD.color2, n, Color_cng_n);
        for (let i = 0; i < n; i++) {
            pms.Class_Div[i].PaintColor = coldata[i];
        }
    }

    //複数グラデーション
    FourColor(Layernum: number, DataNum: number, Color_cng_n: number, GradationPoint4: JsonValue, col: JsonValue): void {
        let ColData = [];// colorARGB
        const gradPoint = Number(GradationPoint4);
        const colRGBA = col as unknown as colorRGBA;

        if (Color_cng_n === gradPoint) { return; }

        const sv = this.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings;
        if (Color_cng_n < gradPoint) {
            const n = gradPoint + 1;
            ColData = Generic.TwoColorGradation(sv.ClassPaintMD.color1 as colorRGBA, colRGBA, Color_cng_n + 1);
            for (let i = 0; i < Color_cng_n; i++) {
                sv.Class_Div[i].PaintColor = ColData[i] as colorRGBA;
            }
            ColData = Generic.TwoColorGradation(colRGBA, sv.ClassPaintMD.color3 as colorRGBA, n - Color_cng_n);
            for (let i = Color_cng_n; i < n; i++) {
                sv.Class_Div[i].PaintColor = ColData[i - Color_cng_n] as colorRGBA;
            }
        } else {
            let n = Color_cng_n - gradPoint + 1;
            ColData = Generic.TwoColorGradation(sv.ClassPaintMD.color3 as colorRGBA, colRGBA, n);
            for (let i = 0; i < n; i++) {
                sv.Class_Div[gradPoint + i].PaintColor = ColData[i] as colorRGBA;
            }
            n = sv.Div_Num - Color_cng_n;
            ColData = Generic.TwoColorGradation(colRGBA, sv.ClassPaintMD.color2 as colorRGBA, n);
            for (let i = 0; i < n; i++) {
                sv.Class_Div[Color_cng_n + i].PaintColor = ColData[i] as colorRGBA;
            }

        }
    }
   
    //データ項目の平均、合計、標準偏差等を計算
    CulcuOne(Layernum: number, DataNum: number): void {
        const L = this.LayerData[Layernum].atrData.Data[DataNum];
        L.MissingValueNum = this.Get_Att_Missing_Num(Layernum, DataNum);
        L.EnableValueNum = this.LayerData[Layernum].atrObject.ObjectNum - L.MissingValueNum;
        switch (L.DataType) {
            case enmAttDataType.Normal: {
                const EDataNum = L.EnableValueNum as number;
                if (EDataNum > 0) {
                    const EnableDT = this.Get_Data_Cell_Array_Without_MissingValue(Layernum, DataNum);
                    let Add: number = 0, Add2: number = 0;
                    const firstValue = Number(EnableDT[0].DataValue);
                    let Max: number = firstValue, Min: number = firstValue;
                    const Decimal = { AfterDecimal: 0, BeforeDecimal: 0 };

                    for (let i = 0; i < EDataNum; i++) {
                        const v = Number(EnableDT[i].DataValue);
                        Add += v;
                        Add2 += +v * v;
                        Max = Math.max(Max, v);
                        Min = Math.min(Min, v);
                        const Dsub = Generic.Figure_Arrange(v);
                        Decimal.AfterDecimal = Math.max(Decimal.AfterDecimal, Dsub.AfterDecimal);
                        Decimal.BeforeDecimal = Math.max(Decimal.BeforeDecimal, Dsub.BeforeDecimal);
                    }
                    L.Statistics.Max = Max;
                    L.Statistics.Min = Min;
                    L.Statistics.Sum = Add;
                    L.Statistics.AfterDecimalNum = Decimal.AfterDecimal;
                    L.Statistics.BeforeDecimalNum = Decimal.BeforeDecimal;
                    L.Statistics.Ave = Add / EDataNum;
                    L.Statistics.Ave = Number(Generic.Figure_Using(L.Statistics.Ave, Decimal.AfterDecimal + 1));
                    L.Statistics.sa = Max - Min;
                    L.Statistics.STD = Math.sqrt(Add2 / EDataNum - L.Statistics.Ave * L.Statistics.Ave);
                    L.Statistics.STD = Number(Generic.Figure_Using(L.Statistics.STD, Decimal.AfterDecimal + 1));
                }
                break;
            }
        }
    }


    /**オブジェクトの重心取得、できなかった場合はFalse */
    Get_ObjectGravityPoint(Layernum: number, ObjNumber: number): point {
        const lay = this.LayerData[Layernum];
        const LO = lay.atrObject.atrObjectData[ObjNumber];
        if (lay.Type === enmLayerType.Mesh) {
            let px = LO.MeshPoint[0].x;
            let py = LO.MeshPoint[0].y;
            for (let i = 1; i <= 4; i++) {
                px += LO.MeshPoint[i].x;
                py += LO.MeshPoint[i].y;
            }
            px /= 4;
            py /= 4;
            return new point(px, py);
        } else {
            const badata = this.Boundary_Kencode_Arrange(Layernum, ObjNumber);
            if (badata.Pon <= 0) {
                return new point(0, 0);
            } else {
                const v = this.LayerData[Layernum].MapFileData.Menseki_Sub(badata);
                return v.gpoint;
            }
        }
    }

    //オブジェクトの面積取得
    GetObjMenseki(Layernum: number, ObjNumber: number): number {
        const lay=this.LayerData[Layernum];
        const LO = lay.atrObject.atrObjectData[ObjNumber];
        if (lay.Type === enmLayerType.Mesh) {
            const p = [];
            for (let i = 0; i < LO.MeshPoint.length; i++) {
                p.push(LO.MeshPoint[i]);
            }
            p.push(LO.MeshPoint[0]);
            p.push(LO.MeshPoint[1]);
            const men = spatial.Get_Hairetu_Menseki( p, lay.MapFileData.Map as { Zahyo: Zahyo_info; SCL: number })
            return men;
        } else {
            const badata = this.Boundary_Kencode_Arrange(Layernum, ObjNumber);
            if (badata.Pon <= 0) {
                return (-1);
            } else {
                const m = lay.MapFileData.Menseki_Sub(badata);
                return m.menseki;
            }
        }
    }

    //オブジェクトの周長を求める
    Get_ObjectLength(Layernum: number, ObjNum: number): number {
        const lay=this.LayerData[Layernum];
        let ELine;
        switch (lay.atrObject.atrObjectData[ObjNum].Objectstructure) {
            case enmKenCodeObjectstructure.MapObj: {
                const O_Code = lay.atrObject.atrObjectData[ObjNum].MpObjCode;
                ELine = lay.MapFileData.Get_EnableMPLine(O_Code, lay.Time);
                break;
            }
            case enmKenCodeObjectstructure.SyntheticObj:
                ELine = this.Get_Enable_KenCode_MPLine( ObjNum, Layernum);
                break;
        }
        const NL = ELine.length;
        if (NL === 0) {
            return -1;
        }
        const za=this.TotalData.ViewStyle.Zahyo;
        let D = 0;
        for (let i = 0; i < NL; i++) {
            const ml = lay.MapFileData.MPLine[ELine[i].LineCode];
            if (za.Mode === enmZahyo_mode_info.Zahyo_Ido_Keido) {
                for (let j = 0; j < ml.NumOfPoint - 1; j++) {
                    D += spatial.Distance_Ido_Kedo_XY_Point(ml.PointSTC[j], ml.PointSTC[j + 1], za);
                }
            } else {
                for (let j = 0; j < ml.NumOfPoint - 1; j++) {
                    D += spatial.Distance_Point(ml.PointSTC[j], ml.PointSTC[j + 1]);
                }
            }
        }
        if (za.Mode === enmZahyo_mode_info.Zahyo_Ido_Keido) {
            // 緯度経度モードの場合は処理なし
        } else {
            D = D / lay.MapFileData.Map.SCL;
        }
        return D;
    }

    //階級区分値の指定
    Set_Div_Value(Layernum: number, DataNum: number): void {
        const L = this.LayerData[Layernum].atrData.Data[DataNum];
        const v = L.SoloModeViewSettings.Div_Method;
        const EDataNum = L.EnableValueNum;
        const div_num = L.SoloModeViewSettings.Div_Num;
        const _dtype = L.DataType;
        const Div_Value: number[] = Array.from({ length: div_num }, () => 0);
        switch (v) {
            case enmDivisionMethod.Free:
                return;
                break;
            case enmDivisionMethod.Quantile://分位数
            case enmDivisionMethod.AreaQuantile: {
               const EnableDT = this.Get_Data_Cell_Array_Without_MissingValue(Layernum, DataNum);
                const SortV = new SortingSearch();
                for (let i = 0; i < EDataNum; i++) {
                    SortV.Add(Number(EnableDT[i].DataValue));
                }
                SortV.AddEnd();
                if (v === enmDivisionMethod.Quantile) {
                    const divvStp = SortV.NumofData() / div_num;
                    let i = 0;
                    let divv = divvStp;
                    do {
                        Div_Value[i] = SortV.DataPositionRevValue(parseInt(divv.toString()) - 1);
                        divv += divvStp;
                        i++;
                    } while (divv < SortV.NumofData());
                } else {
                    //面積分位数
                    const Mense: number[] = Array.from({ length: EDataNum }, () => 0);
                    let AddMense = 0;
                    for (let i = 0; i < EDataNum; i++) {
                        Mense[i] = this.GetObjMenseki(Layernum, EnableDT[i].ObjLocation);
                        AddMense += Mense[i];
                    }
                    let n = 0;
                    let Addv = 0;
                    const divvStp = AddMense / div_num;
                    let divv = divvStp;
                    for (let i = 0; i < SortV.NumofData(); i++) {
                        const j = SortV.DataPositionRev(i);
                        Addv += Mense[j];
                        if (Addv >= divv) {
                            Div_Value[n] = SortV.DataPositionRevValue(i);
                            divv += divvStp;
                            n++;
                            Addv -= Mense[j];
                            i--;
                        }
                    }
                }
                break;
            }
            case enmDivisionMethod.StandardDeviation://標準偏差
                Div_Value[0] = L.Statistics.Ave + L.Statistics.STD;
                Div_Value[1] = L.Statistics.Ave + L.Statistics.STD / 2;
                Div_Value[2] = L.Statistics.Ave;
                Div_Value[3] = L.Statistics.Ave - L.Statistics.STD / 2;
                Div_Value[4] = L.Statistics.Ave - L.Statistics.STD;
                for (let i = 0; i < 4; i++) {
                    Div_Value[i] = parseFloat(Generic.Figure_Using(Div_Value[i], L.Statistics.AfterDecimalNum + 1));
                }
                break;
            case enmDivisionMethod.EqualInterval: {//等間隔
                const a = L.Statistics.sa / div_num;
                for (let i = 0; i < div_num; i++) {
                    Div_Value[i] = L.Statistics.Max - a * (i + 1);
                }
                for (let i = 0; i < div_num; i++) {
                    Div_Value[i] = parseFloat(Generic.Figure_Using(Div_Value[i], L.Statistics.AfterDecimalNum + 1));
                  }
                break;
            }
        }
        for (let i = 0; i < div_num; i++) {
            L.SoloModeViewSettings.Class_Div[i].Value = Div_Value[i];
        }
    }

    Get_Att_Missing_Num(LayerNum: number, DataNum: number): number {
        if (this.LayerData[LayerNum].atrData.Data[DataNum].MissingF === false) {
            return 0;
        } else {
            return Generic.Count_Specified_Value_Array(this.LayerData[LayerNum].atrData.Data[DataNum].Value, undefined);
        }
    }

    //欠損値を除いた配列でデータ項目の値を取得
    Get_Data_Cell_Array_Without_MissingValue(LayerNum: number, DataNum: number): strObjLocation_and_Data_info[] | undefined {
        const ObjNum = this.LayerData[LayerNum].atrObject.ObjectNum;
        const DT = [];
        const LD = this.LayerData[LayerNum].atrData.Data[DataNum];
        if (LD.EnableValueNum === 0) {
            return undefined;
        }
        if ((LD.MissingF === false) || (LD.MissingValueNum === 0)) {
            for (let i = 0; i < ObjNum; i++) {
                DT[i] = new strObjLocation_and_Data_info();
                DT[i].ObjLocation = i;
                DT[i].DataValue = LD.Value[i];
            }
            return DT;
        } else {
            let n = 0;
            for (let i = 0; i < ObjNum; i++) {
                if (LD.Value[i] !== undefined) {
                    DT[n] = new strObjLocation_and_Data_info();
                    DT[n].ObjLocation = i;
                    DT[n].DataValue = LD.Value[i];
                    n++;
                }
            }
            return DT;
        }
    }

    Get_DataType(Layernum: number, DataNum: number): number {
        return this.LayerData[Layernum].atrData.Data[DataNum].DataType;

    }
    Get_DataNote(Layernum: number, DataNum: number): string {
        return this.LayerData[Layernum].atrData.Data[DataNum].Note;
    }

    Set_DataTitle_to_CheckedListBox(checkedListBox: CheckedListBox, Layernum: number, defoChecked: boolean, Number_Print_F = true, Normal_F = true, Category_f = true, String_f = true, Special_Astarisk_Num = -1): void {
        const titles = this.getDataTitleName(Layernum, Number_Print_F, Normal_F, Category_f, String_f, Special_Astarisk_Num);
        const list = [];
        for(const i in titles){
            list.push({checked:defoChecked,text:titles[i], value:i});
        }
        checkedListBox.removeAll();
        checkedListBox.addList(list, 0);
    }


    Set_DataTitle_to_cboBox(cbox: HTMLElement, Layernum: number, SelectedIndex: number, Number_Print_F = true, Normal_F = true, Category_f = true, String_f = true, Special_Astarisk_Num = -1): void {
        const titles = this.getDataTitleName(Layernum, Number_Print_F, Normal_F, Category_f, String_f, Special_Astarisk_Num);
        const items = [];
        for (let i = 0; i < titles.length; i++) {
            items.push({ value: (i), text: titles[i] });
        }
        cbox.addSelectList(items, SelectedIndex, true,true);
    }

    //**グラフデータセットのタイトル配列取得(value:番号、text:タイトル) */
    getGraphTitle(Layernum: number): Array<{value: number, text: string}> {
        const graph = this.LayerData[Layernum].LayerModeViewSettings.GraphMode;
        const items = [];
        for (let i = 0; i < graph.DataSet.length; i++) {
            let tx = graph.DataSet[i].title;
            if (tx === "") {
                tx = "データセット" + (i + 1).toString();
            }
            items.push({ value: i, text: tx });
        }
        return items;
    }

    //**ラベルデータセットのタイトル配列取得(value:番号、text:タイトル) */
    getLabelTitle(Layernum: number): Array<{value: number, text: string}> {
        const lbl = this.LayerData[Layernum].LayerModeViewSettings.LabelMode;
        const items = [];
        for (let i = 0; i < lbl.DataSet.length; i++) {
            let tx = lbl.DataSet[i].title;
            if (tx === "") {
                tx = "データセット" + (i + 1).toString();
            }
            items.push({ value: i, text: tx });
        }
        return items;
    }

    //**重ね合わせデータセットのタイトル配列取得(value:番号、text:タイトル) */
    getOverlayTitle(): Array<{value: number, text: string}> {
        const over = this.TotalData.TotalMode.OverLay;
        const items = [];
        for (let i = 0; i < over.DataSet.length; i++) {
            let tx = over.DataSet[i].title;
            if (tx === "") {
                tx = "データセット" + (i + 1).toString();
            }
            items.push({ value: i, text: tx });
        }
        return items;
    }

    //データ項目のタイトルを取得する。Number_Print_F=trueの場合は、データの種類毎に選択可否可能
    // <param name="Number_Print_F">タイトルの前に番号を振る</param>
    // <param name="Normal_F">通常のデータを選択可に</param>
    // <param name="Category_f">カテゴリーデータを選択可に</param>
    // <param name="String_f">文字列データを選択可に</param>
    // <param name="Special_Astarisk_Num">特別にアスタリスクにする番号</param>
    getDataTitleName(Layernum: number, Number_Print_F = true, Normal_F = true, Category_f = true, String_f = true, Special_Astarisk_Num = -1): string[] {
        const ad = this.LayerData[Layernum].atrData;
        const items = [];
        const n = this.Get_DataNum(Layernum);
        for (let i = 0; i < n; i++) {
            const d = ad.Data[i];
            let itm = d.Title;
            let hd = "";
            if (Number_Print_F === true) {
                if (i === Special_Astarisk_Num) {
                    hd = "*";
                } else {
                    hd = String(i + 1);
                    switch (d.DataType) {
                        case (enmAttDataType.Normal): {
                            if (Normal_F === false) {
                                hd = "*"
                            }
                            break;
                        }
                        case (enmAttDataType.Category): {
                            if (Category_f === false) {
                                hd = "*";
                            }
                            break;
                        }
                        case (enmAttDataType.Strings): {
                            if (String_f === false) {
                                hd = "*";
                            }
                            break;
                        }
                    }
                }
                itm = hd + ":" + itm;
            }
            items.push(itm);
        }
        return items;
    }

    Get_DataTitle(Layernum: number, DataNum: number, PreFixDataNumberFlag: boolean): string {
        let tx = this.LayerData[Layernum].atrData.Data[DataNum].Title;
        if (PreFixDataNumberFlag === true) {
            tx = (DataNum + 1) + ":" + tx;
        }
        return tx;
    }

    Get_DataTitleLayer(Layernum: number, PreFixDataNumberFlag: boolean): string[] {
        const n = this.LayerData[Layernum].atrData.Count;
        const ttl = [];
        for (let i = 0; i < n; i++){
            ttl.push(this.Get_DataTitle(Layernum, i, PreFixDataNumberFlag));
        }
        return ttl;
    }

    Get_DataUnitLayer(Layernum: number): string[] {
        const n = this.LayerData[Layernum].atrData.Count;
        const unt = [];
        for (let i = 0; i < n; i++) {
            unt.push(this.Get_DataUnit(Layernum, i));
        }
        return unt;
    }

    Get_DataUnit(Layernum: number, DataNum: number): string {
        return this.LayerData[Layernum].atrData.Data[DataNum].Unit;
    }

    Get_DataUnit_With_Kakko(Layernum: number, DataNum: number): string {
        let tx = "";
        if (this.LayerData[Layernum].atrData.Data[DataNum].DataType === enmAttDataType.Normal) {
            tx = this.Get_DataUnit(Layernum, DataNum);
        }
        if (tx !== "") {
            tx = "(" + tx + ")"
        }
        return tx;
    }
    Get_DataMax(Layernum: number, DataNum: number): number {
        return this.LayerData[Layernum].atrData.Data[DataNum].Statistics.Max;
    }

    Get_DataMin(Layernum: number, DataNum: number): number {
        return this.LayerData[Layernum].atrData.Data[DataNum].Statistics.Min;
    }

    Get_DataNum(LayerNum: number): number {
        return this.LayerData[LayerNum].atrData.Count;
    }
    Get_DataMissingNum(LayerNum: number, DataNum: number): number {
        return this.LayerData[LayerNum].atrData.Data[DataNum].MissingValueNum;
    }
  
    /**連続表示モードのデータセット一覧を取得 */
    getSeriesDataSetName(): ListItem[] {
        const state = appState();
        const series = state.attrData.TotalData.TotalMode.Series;
        const seriesDataSetList = [];
        for (let i = 0; i < series.DataSet.length; i++) {
            let tx = series.DataSet[i].title;
            if (tx === "") {
                tx = "データセット" + (i + 1).toString();
            }
            seriesDataSetList.push({ value: i, text: tx });
        }
        return seriesDataSetList;
    }

    /** 連続表示モードのデータセットをリストビューに入れる*/
    SeriesMode_to_ListViewData(seriesListView: HTMLElement | IListViewTable, DataSetItem: strSeries_DataSet_Item_Info[] | JsonValue): void {
        // ListViewTableインスタンスかHTMLElementかを判定
        if ('clear' in seriesListView && typeof seriesListView.clear === 'function') {
            // ListViewTableのメソッドを直接使用
            seriesListView.clear();
        }
        const seriesData: JsonValue[] = [];
        const DataSetItemArray = Array.isArray(DataSetItem) ? DataSetItem : [DataSetItem];
        for (let i = 0; i < DataSetItemArray.length; i++) {
            const di = DataSetItemArray[i] as JsonObject;
            seriesData[0] = Number((i + 1).toString());
            if (di.Print_Mode_Total === enmTotalMode_Number.OverLayMode) {
                const over = this.TotalData.TotalMode.OverLay;
                seriesData[1] = Number("重ね合わせ表示モード".length); // Convert to number
                let T = over.DataSet[over.SelectedIndex].title;
                if (T === "") {
                    T = "データセット" + Number(Number(di.Data) + 1);
                }
                seriesData[2] = Number(T.length);
                seriesData[3] = 0; // Convert empty string to number
            } else {
                seriesData[1] = this.LayerData[di.Layer as number].Name;
                switch (di.Print_Mode_Layer) {
                    case enmLayerMode_Number.SoloMode: {
                        seriesData[2] = this.Get_DataTitle(di.Layer as number, di.Data as number, false);
                        seriesData[3] = Generic.getSolomodeStrings(di.SoloMode as number);
                        break;
                    }
                    case enmLayerMode_Number.GraphMode: {
                        seriesData[2] = "グラフ表示".length; // Convert string to number
                        let T = this.LayerData[di.Layer as number].LayerModeViewSettings.GraphMode.DataSet[di.Data as number].title;
                        if (T === "") {
                            T = "データセット" + String(Number(di.Data) + 1);
                        }
                        seriesData[3] = T;
                        break;
                    }
                    case enmLayerMode_Number.LabelMode: {
                        seriesData[2] = "ラベル表示".length; // Convert string to number
                        let T = this.LayerData[di.Layer as number].LayerModeViewSettings.LabelMode.DataSet[di.Data as number].title;
                        if (T === "") {
                            T = "データセット" + String(Number(di.Data) + 1);
                        }
                        seriesData[3] = T;
                        break;
                    }
                    case enmLayerMode_Number.TripMode:
                        break;
                }
            }
            if ('insertRow' in seriesListView && typeof seriesListView.insertRow === 'function') {
                seriesListView.insertRow(1, seriesData);
            }
        }
    }
    Add_one_Layer(LayerName: string, LayerType: number, LayerMeshType: number, LayerShape: number, LayerMapFile: string, LayerTime: strYMD, LayerSystem: number, comment: string, ObjectNum: number, ObjData: strObject_Data_Info[]): void {
        //レイヤの追加
        const NewL = new strLayerDataInfo();
        if (LayerMapFile === "") {
            LayerMapFile = this.MapData.GetPrestigeMapFileName();
        }
        NewL.MapFileName = LayerMapFile;
        NewL.MapFileData = this.MapData.SetMapFile(LayerMapFile);
        NewL.MapFileObjectNameSearch = this.MapData.SetObject_Name_Search(LayerMapFile);
        NewL.Name = LayerName;
        NewL.Type = LayerType;
        NewL.ReferenceSystem = LayerSystem;
        NewL.MeshType = LayerMeshType;
        NewL.Shape = LayerShape;
        NewL.Time = LayerTime;
        NewL.Comment = comment;
        NewL.atrData.Count = 0;
        NewL.atrData.SelectedIndex = 0;
        NewL.atrObject.ObjectNum = ObjectNum;
        NewL.atrObject.NumOfSyntheticObj = 0;
        for (let i = 0; i < NewL.atrObject.ObjectNum; i++) {
            NewL.atrObject.atrObjectData[i] = ObjData[i].Clone();
        }
        NewL.initLayerData()
        this.LayerData.push(NewL);
        this.TotalData.LV1.Lay_Maxn++;
    }

    /**レイヤ名をセレクトボックスに入れる */
    Set_LayerName_to(selbox: HTMLElement, SelectedIndex: number, NormalF=true, syntheticF=true, PointF=true, MeshF=true): void {
        const state = appState();
        const lst = [];
        let fall=false;
        for (let i = 0; i < this.TotalData.LV1.Lay_Maxn; i++) {
            let f =false;
            switch (this.LayerData[i].Type) {
                case enmLayerType.Normal: {
                    if (this.LayerData[i].atrObject.NumOfSyntheticObj > 0) {
                        if ((NormalF === true) && (syntheticF === true)) {
                            f = true;
                        } else {
                            f = false;
                        }
                    } else {
                        f = NormalF;
                    }
                    break;
                }
                case enmLayerType.DefPoint:
                    f = PointF;
                    break;
                case enmLayerType.Mesh:
                    f = MeshF;
                    break;
            }
            if (f === false) { fall = true }
            const d = { value: i, text:f ?  state.attrData.LayerData[i].Name: "*"+state.attrData.LayerData[i].Name}
            lst.push(d);
        }
        selbox.addSelectList(lst, SelectedIndex, true,fall);
    }

    
    /**セレクトボックスにレイヤ内のオブジェクト一覧と初期設定を入れる */
    Set_ObjectName_to_selectBox(selbox: HTMLElement, Layernum: number, SelectedObject: number): void {
        const objList=[];
        selbox.removeAll();
        const L = this.LayerData[Layernum].atrObject;
        for (let i = 0; i <L.ObjectNum;i++){
            const v={text:L.atrObjectData[i].Name,value:i};
            objList.push(v);
        }
        if (objList.length > 0) {
            selbox.addSelectList(objList, SelectedObject, true, true);
        }
    }
    /**セレクトボックスにレイヤ内のダミーオブジェクト一覧と初期設定を入れる */
    Set_DummyObjectName_to_selectBox(selbox: HTMLElement, Layernum: number, SelectedObject: number): void {
        const objList = [];
        selbox.removeAll();
        const L = this.LayerData[Layernum].Dummy
        for (let i = 0; i < L.length; i++) {
            const v = { text: L[i].Name, value: i };
            objList.push(v);
        }
        if (objList.length > 0) {
            selbox.addSelectList(objList, SelectedObject, true, true);
        }
    }

    /**リストボックスexにレイヤ内のオブジェクト一覧と初期設定を入れる */
    Set_ObjectName_to_checkedListBox(lbox: CheckedListBox | (HTMLElement & {removeAll: () => void; addList: (list: {text: string; value: string; checked: boolean}[], pos: number) => void}), Layernum: number, SelectedObjects?: boolean[]): void {
        const objList=[];
        lbox.removeAll();
        const L = this.LayerData[Layernum].atrObject;
        for (let i = 0; i <L.ObjectNum;i++){
            const v={text:L.atrObjectData[i].Name,checked:false, value:String(i)};
            if(SelectedObjects !== undefined){
                v.checked=SelectedObjects[i];
            }
            objList.push(v);
        }
        lbox.addList(objList,0);
    }

    /**リストボックスexにレイヤ内のダミーオブジェクト一覧と初期設定を入れる */
    Set_DummyObjectName_to_checkedListBox(lbox: CheckedListBox | (HTMLElement & {removeAll: () => void; addList: (list: {text: string; value: string; checked: boolean}[], pos: number) => void}), Layernum: number, SelectedObjects?: boolean[]): void {
        const objList: {text: string, value: string, checked: boolean}[] = [];
        lbox.removeAll();
        const L=this.LayerData[Layernum].Dummy
        for (let i = 0; i <L.length;i++){
            const v={text:L[i].Name, value:L[i].Name, checked:false};
            if(SelectedObjects !== undefined){
                v.checked=SelectedObjects[i];
            }
            objList.push(v);
        }
        if(objList.length>0){
            lbox.addList(objList,0);
        }
    }
    /**レイヤとそのでのオブジェクト位置から代表点を取得 */
    Get_CenterP(Layernum: number, ObjNum: number): point {
        return this.LayerData[Layernum].atrObject.atrObjectData[ObjNum].CenterPoint;
    }

    /**オブジェクトと座標の距離 */
    Distance_Kencode_Point(Layernum: number, Obj: number, Point: point): number {
        const L = this.LayerData[Layernum];
        let v: JsonValue;
        if (L.Shape === enmShape.LineShape) {
            v = this.Get_Distance_Kencode_Between_ObjectLine_and_Point(Layernum, Obj, Point);
        } else {
            const p1 = this.Get_CenterP(Layernum, Obj);
            const z = this.TotalData.ViewStyle.Zahyo;
            if (z.Mode === enmZahyo_mode_info.Zahyo_Ido_Keido) {
                const PS = spatial.Get_Reverse_XY(Point, z);
                const P2 = spatial.Get_Reverse_XY(p1, z);
                v = spatial.Distance_Ido_Kedo_LatLon(PS.toLatlon(), P2.toLatlon());
            } else {
                v = spatial.Distance_Point(Point, p1) / this.MapData.SetMapFile("").Map.SCL;
            }
        }
        return v;
    }

    /**KecnCodeと地図ファイルのオブジェクトの間で指定/線オブジェクトと面・点オブジェクトの距離は、最も近い線の位置と点・面の代表点、点・面オブジェクト間の距離は代表点間の距離、線と線の場合は、o_Code2側か線、o_Code1側が点として扱われる */
    Distance_Kencode_MPObject(LayNum1: number, ObjNum1: number, MapFile: string, ObjCode2: number, Time: strYMD): number {
        let P1;
        let P2;
        let d;
        const z = this.TotalData.ViewStyle.Zahyo;
        if (this.MapData.SetMapFile(MapFile).MPObj[ObjCode2].Shape === enmShape.LineShape) {
            if (this.LayerData[LayNum1].Shape !== enmShape.LineShape) {
                P1 = this.Get_CenterP(LayNum1, ObjNum1);
                d = this.MapData.SetMapFile(MapFile).Get_Distance_Between_ObjectLine_and_Point(ObjCode2, Time, P1);
            } else {
                P1 = this.MapData.SetMapFile(MapFile).Get_Enable_CenterP(ObjCode2, Time);
                if (P1 && P2 && z.Zahyo.Mode === enmZahyo_mode_info.Zahyo_Ido_Keido) {
                    d = spatial.Distance_Ido_Kedo_XY_Point(P1, P2, z);
                } else if (P1 && P2) {
                    d = spatial.Distance_Point(P1, P2) / this.MapData.SetMapFile("").Map.SCL;
                }
            }
        } else {
            if (this.LayerData[LayNum1].Shape === enmShape.LineShape) {
                P1 = this.Get_CenterP(LayNum1, ObjNum1);
                d = this.Get_Distance_Kencode_Between_ObjectLine_and_Point(LayNum1, ObjNum1, P2);
            } else {
                P1 = this.Get_CenterP(LayNum1, ObjNum1);
                P2 = this.MapData.SetMapFile(MapFile).Get_Enable_CenterP(ObjCode2, Time);
                if (P1 && P2 && z.Mode === enmZahyo_mode_info.Zahyo_Ido_Keido) {
                    d = spatial.Distance_Ido_Kedo_XY_Point(P1, P2, z);
                } else if (P1 && P2) {
                    d = spatial.Distance_Point(P1, P2) / this.MapData.SetMapFile("").Map.SCL;
                }
            }
        }
        return d;
    }

    /**KecnCodeで指定/線オブジェクトと面・点オブジェクトの距離は、最も近い線の位置と点・面の代表点、点・面オブジェクト間の距離は代表点間の距離、線と線の場合は、o_Code2側か線、o_Code1側が点として扱われる */
    Distance_Kencode_Object(ObjNum1: number, ObjNum2: number, LayNum1: number, LayNum2: number): number {
        let P1;
        let P2;

        if (this.LayerData[LayNum2].Shape === enmShape.LineShape) {
            [ObjNum1, ObjNum2] = [ObjNum2, ObjNum1];
            [LayNum1, LayNum2] = [LayNum2, LayNum1];
        }
        let d;
        if (this.LayerData[LayNum1].Shape === enmShape.LineShape) {
            //一方が線オブジェクトの場合
            P2 = this.Get_CenterP(LayNum2, ObjNum2);
            d = this.Get_Distance_Kencode_Between_ObjectLine_and_Point(LayNum1, ObjNum1, P2);
        } else {
            P1 = this.Get_CenterP(LayNum1, ObjNum1);
            P2 = this.Get_CenterP(LayNum2, ObjNum2);
            if (this.TotalData.ViewStyle.Zahyo.Mode === enmZahyo_mode_info.Zahyo_Ido_Keido) {
                d = spatial.Distance_Ido_Kedo_XY_Point(P1, P2, this.TotalData.ViewStyle.Zahyo);
            } else {
                d = spatial.Distance_Point(P1, P2) / this.MapData.SetMapFile("").Map.SCL;
            }
        }
        return d;
    }

    /**オブジェクトの線とある地点との距離を求める */
    Get_Distance_Kencode_Between_ObjectLine_and_Point(LayNum: number, ObjNum: number, P: point): number {

        const ELine = this.Get_Enable_KenCode_MPLine(LayNum, ObjNum);
        const d = this.LayerData[LayNum].MapFileData.Distance_PointMPLineAllay(P,  ELine);
        return d;
    }

    /**オブジェクトを削除（移動レイヤ、移動主体定義レイヤ、合成オブジェクト使用レイヤは削除不可 LayerDelNum:レイヤごとの削除数の配列。削除しない場合は0,ObjectDeleteCheck:オブジェクトの数だけの配列で、削除する場合Trueを、全レイヤ分Listに格納） */
    DeleteObjects(LayerDelNum: number[], ObjectDeleteCheck: boolean[][]): void {
        //線モードの起点オブジェクトをチェックするために新旧対応リスト作成
        const LayMax=this.TotalData.LV1.Lay_Maxn;
        const ConvObj: number[][] = [];
        for (let i = 0; i < LayMax; i++) {
            const ObjConv: number[] = [];
            if (LayerDelNum[i] > 0) {
                const obn = ObjectDeleteCheck[i];
                let n = 0;
                for (let j = 0; j < obn.length; j++) {
                    if (obn[j] === false) {
                        ObjConv[j] = n;
                        n++;
                    } else {
                        ObjConv[j] = 0;
                    }
                }
            }
            ConvObj.push(ObjConv);
        }

        for(let i  = 0;i< LayMax;i++){
            if (LayerDelNum[i] > 0) {
                const ld = this.LayerData[i];
                const obn = ObjectDeleteCheck[i];
                const GetList = [];
                for (let j = 0; j < ld.atrObject.ObjectNum; j++) {
                    if (obn[j] === false) {
                        GetList.push(j);
                    }
                }
                const newObjN = GetList.length;
                ld.atrObject.ObjectNum = newObjN
                for (let j = 0; j < newObjN; j++) {
                    const fromObj = GetList[j];
                    if (fromObj !== j) {
                        ld.atrObject.atrObjectData[j] = ld.atrObject.atrObjectData[fromObj].Clone();
                    }
                    for (let k = 0; k < this.Get_DataNum(i); k++) {
                        ld.atrData.Data[k].Value[j] = ld.atrData.Data[k].Value[fromObj];
                    }
                }
                ld.atrObject.atrObjectData.length = newObjN;
                for (let k = 0; k < this.Get_DataNum(i); k++) {
                    const oldData = this.LayerData[i].atrData.Data[k].Clone(true);
                    const oldMode = ld.atrData.Data[k].ModeData;
                    ld.atrData.Data[k].Value.length = newObjN;
                    this.CulcuOne(i, k);
                    this.SetIniHanrei(i, k);
                    this.Set_Legend(i, k, oldData, true, true, true, true, true, true, true, true, true, true, true);
                    ld.atrData.Data[k].ModeData = oldMode;
                    if (oldData.DataType !== enmAttDataType.Strings) {
                        const ldc = ld.atrData.Data[k].SoloModeViewSettings.ClassODMD;
                        if (ldc.Dummy_ObjectFlag === false) {
                            if (LayerDelNum[ldc.o_Layer] > 0) {
                                ldc.O_object = ConvObj[ldc.o_Layer][ldc.O_object];
                            }
                        }
                    }
                }
            }
        }
    }

    /**レイヤごとに自動間引きができるかどうかチェック */
    check_AutoSoubyou_Enable(): boolean {
        this.TempData.SoubyouLayerEnable = [];
        this.TempData.SoubyouLoopLineArea = [];
        for (let i = 0; i < this.TotalData.LV1.Lay_Maxn; i++) {
            const ld = this.LayerData[i]
            const LoopLineArea: number[] = Array.from({ length: ld.MapFileData.Map.ALIN }, () => 0);
            //ダミーオブジェクトグループのチェック
            const ObjGIndex = new Array(ld.MapFileData.Map.OBKNum);
            ObjGIndex.fill(false);
            for (let j = 0; j < ld.DummyGroup.length; j++) {
                ObjGIndex[ld.DummyGroup[j]] = true;
            }
            for (let j = 0; j < ld.MapFileData.Map.Kend; j++) {
                if (ObjGIndex[ld.MapFileData.MPObj[j].Kind] === true) {
                    const ELine = ld.MapFileData.Get_EnableMPLine( j, ld.Time);
                    for (let k = 0; k < ELine.length; k++) {
                        const Lcode = ELine[k].LineCode;
                        if (LoopLineArea[Lcode] === 0) {
                            const men = ld.MapFileData.Get_LoopLine_Menseki(Lcode);
                            LoopLineArea[Lcode] = men;
                            this.TempData.SoubyouLayerEnable[i] = true;
                        }
                    }
                }
            }
            //ダミーオブジェクトのチェック
            for (let j = 0; j < ld.Dummy.length; j++) {
                const c = ld.Dummy[j].code;
                if (ld.MapFileData.MPObj[c].Shape !== enmShape.PointShape) {
                    const ELine = ld.MapFileData.Get_EnableMPLine(c, ld.Time);
                    for (let k = 0; k < ELine.length; k++) {
                        const Lcode = ELine[k].LineCode;
                        if (LoopLineArea[Lcode] === 0) {
                            const men = ld.MapFileData.Get_LoopLine_Menseki(Lcode);
                            LoopLineArea[Lcode] = men;
                            this.TempData.SoubyouLayerEnable[i] = true;
                        }
                    }
                    break;
                }
            }
            if (ld.Type === enmLayerType.Normal) {
                switch (ld.Shape) {
                    case enmShape.PointShape:
                        break;
                    case enmShape.LineShape:
                        this.TempData.SoubyouLayerEnable[i] = true;
                        break;
                    case enmShape.PolygonShape: {
                        const checkObjn = Math.min(ld.atrObject.ObjectNum, 100);
                        const LUse = new Array(ld.MapFileData.Map.ALIN);
                        LUse.fill(0);
                        for (let j = 0; j < checkObjn; j++) {
                            const ELine = this.Get_Enable_KenCode_MPLine( i, j);
                            for (let k = 0; k < ELine.length; k++) {
                                LUse[ELine[k].LineCode]++;
                                if (LUse[ELine[k].LineCode] === 2) {
                                    this.TempData.SoubyouLayerEnable[i] = true;
                                    j = ld.atrObject.ObjectNum;
                                    break;
                                }
                            }
                        }
                        if (this.TempData.SoubyouLayerEnable[i] === true) {
                            //ループオブジェクトの中で、最後に残す一番面積の大きいループを決める
                            for (let j = 0; j < ld.atrObject.ObjectNum; j++) {
                                const ELine = this.Get_Enable_KenCode_MPLine( i, j);
                                const Loop_mens = new SortingSearch();
                                let LoopOnlyf = true;
                                for (let k = 0; k < ELine.length; k++) {
                                    const Lcode = ELine[k].LineCode;
                                    let men = LoopLineArea[Lcode];
                                    if (men === 0) {
                                        men = ld.MapFileData.Get_LoopLine_Menseki(Lcode);
                                        LoopLineArea[Lcode] = men;
                                    }
                                    if (men === -1) {
                                        LoopOnlyf = false;
                                    } else {
                                        Loop_mens.Add(men);
                                    }
                                }
                                if (LoopOnlyf === true) {
                                    Loop_mens.AddEnd();
                                    const lnum = Loop_mens.DataPositionRev(0);
                                    LoopLineArea[ELine[lnum].LineCode] = -2;
                                }
                            }
                        }
                        break;
                    }
                }
            }
            this.TempData.SoubyouLoopLineArea[i] = LoopLineArea;
        }
        return true;
    }
}



//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

class clsAttrMapData {
    private strAttrMap = class {
        FileName: string | undefined; //String
        FullPath: string | undefined; //String
        Mapdata: clsMapdata; //clsMapData
    };
    private Prestage_MapFileName: string = "";
    private attrMapData: Record<string, clsMapdata> = {}; //  clsMapData
    private Object_Name_Search: Record<string, clsObjectNameSearch> = {}; //clsObjectNameSearch

    getAllMapData(): Record<string, clsMapdata> {
        return this.attrMapData;
    }

    AddExistingMapData(MapData: clsMapdata, MapFileName: string): void {
        const key = MapFileName.toUpperCase();
        this.attrMapData[key] = MapData;
        this.Object_Name_Search[key] = new clsObjectNameSearch(MapData, true);
        if (Object.keys(this.attrMapData).length === 1) {
            this.Prestage_MapFileName = key;
        }
    }
    SetMapFile(MapFileName: string): clsMapdata | undefined {
        if (MapFileName === "") {
            return this.attrMapData[this.Prestage_MapFileName];
        } else {
            //存在しない場合はundefined
            return this.attrMapData[MapFileName.toUpperCase()];
        }
    }
    SetObject_Name_Search(MapFileName: string): clsObjectNameSearch | undefined {
        if (MapFileName === "") {
            return this.Object_Name_Search[this.Prestage_MapFileName];
        } else {
            //存在しない場合はundefined
            return this.Object_Name_Search[MapFileName.toUpperCase()];
        }
    }

    // 読み込んだ地図ファイル名の配列を返す
    GetMapFileName(): string[] {
        const fname = Object.keys(this.attrMapData);
        return fname;
    }
    //読み込んだ地図ファイル数を返す
    GetNumOfMapFile(): number {
        return Object.keys(this.attrMapData).length;
    }
    //地図ファイルの有無を調べる
    CheckMapfileExists(MapFileName: string): boolean {
        const fname = Object.keys(this.attrMapData);
        if (fname.indexOf(MapFileName) === -1) {
            return false;
        } else {
            return true;
        }
    }


    EqualizeZahyoMode(Zahyo: Zahyo_info): ZahyoResult {
        //読み込んだ地図ファイルの投影法等座標設定を同じにする
        let f = true;
        let emes = "";
        //コレクションのループ
        Object.keys(this.attrMapData).forEach((key) => {
            const retv = spatial.Check_Zahyo_Projection_Convert_Enabled(Zahyo as Zahyo_info, this.attrMapData[key].Map.Zahyo as Zahyo_info);
            if (retv.ok === false) { 
                f = false;
                emes += key + ":" + retv.emes + '\n';
            }
        });
        if (f === true) {
            Object.keys(this.attrMapData).forEach((key) => {
                if (Generic.equal(this.attrMapData[key].Map.Zahyo as Zahyo_info, Zahyo as Zahyo_info) === false) {
                    this.attrMapData[key].Convert_ZahyoMode(Zahyo as Zahyo_info);
                }
            });
        }
        return {
            ok: f, emes: emes
        };
    }

    //点オブジェクトグループのオブジェクト名のDictionary（地図ファイル名,オブジェクトグループ名）を取得
    GetAllPointObjectGroup(): { [key: string]: string[] } {
        const AllPOBJG: { [key: string]: string[] } = {};
        for (const key in this.attrMapData) {
            const cmap = this.attrMapData[key];
            const PointObk = [];
            for (let i = 0; i < cmap.Map.OBKNum; i++) {
                if(cmap.ObjectKind[i].Shape === enmShape.PointShape){
                    PointObk.push(cmap.ObjectKind[i].Name);
                }
            }
            if (PointObk.length > 0) {
                AllPOBJG[key] = PointObk;
            }
        }
        return AllPOBJG;
    }

    //地図ファイル名、線種、グループで、線種位置番号を求める
    GetLineKindPosition(MapFileName: string, lineKindNum: number, PatternNum: number): number {
        let n = 0;
        for (const key in this.attrMapData) {
            const cmap = this.attrMapData[key];
            if (key !== MapFileName.toUpperCase()) {
                n += cmap.Get_TotalLineKind_Num();
            } else {
                for (let j = 0; j < lineKindNum; j++) {
                    n += cmap.LineKind[j].NumofObjectGroup;
                }
                n += PatternNum
                return n;
            }
        }
        return -1;
    }
    //優先地図ファイル名取得
    GetPrestigeMapFileName(): string {
        return this.Prestage_MapFileName;
    }
    //最初の地図ファイル名の座標プロパティ取得
    GetPrestigeZahyoMode(): Zahyo_info {
        return this.attrMapData[this.Prestage_MapFileName].Map.Zahyo;
    }

    /** 読み込んだ地図ファイルの全線種（オブジェクト連動型を含む）一覧を返す*/
    GetAllMapLineKind(): LPatSek_Info[] {
        const LKind = [];
        for (const key in this.attrMapData) {
            const LK = this.attrMapData[key].Get_TotalLineKind();
            for (let j = 0; j < LK.length; j++) {
                LKind.push(LK[j]);
            }
        }
        return LKind;
    }

    /** 読み込んだ地図ファイルの全線種名（オブジェクト連動型を含む）一覧を返す*/
    GetAllMapLineKindName(): string[] {
        const STR = [];
        for (const key in this.attrMapData) {
            const LK = this.attrMapData[key].Get_TotalLineKind();
            for (let j = 0; j < LK.length; j++) {
                STR.push(LK[j].Name);
            }
        }
        return STR;
    }

    //読み込んだ地図ファイルの全線種数（オブジェクト連動型を含む）を返す
    GetAllMapLineKindNum(): number {
        let n = 0;
        for (const key in this.attrMapData) {
            n += this.attrMapData[key].Get_TotalLineKind_Num();
        }
        return n;
    }

    /**指定した地図ファイルを削除 */
    RemoveMapData(mapFileName: string): void {
        if(mapFileName === "" ){
            mapFileName = this.Prestage_MapFileName
        }
        delete this.attrMapData[mapFileName];
        delete this.Object_Name_Search[mapFileName];
        if(mapFileName === this.Prestage_MapFileName ){
            if(Object.keys(this.attrMapData).length === 0 ){
                this.Prestage_MapFileName = ""
            }else{
                this.Prestage_MapFileName = Object.keys(this.attrMapData)[0];
            }
        }
    }
}
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

class clsObjectNameSearch {
    private Object_Name_Search: SortingSearch;
    private Object_Name_Stac_for_Search_O_Code: InstanceType<clsObjectNameSearch['ObjNameAndTime_Info']>[];
    private checkObjectNameKanjiCompatibleFF: boolean;

    ObjNameAndTime_Info = class {
        ObjCode: number | undefined;
        SETime: Start_End_Time_data = new Start_End_Time_data();
    };

    constructor(MapData: clsMapdata, CheckKanjiCompatibleFlag: boolean) {
        //オブジェクト名検索用クラス
        this.Object_Name_Search = new SortingSearch();
        this.Object_Name_Stac_for_Search_O_Code = []; //ObjNameAndTime_Info
        this.checkObjectNameKanjiCompatibleFF = CheckKanjiCompatibleFlag; //Boolean
        // let Name_n = 0
        // for (let i = 0; i < MapData.Map.Kend; i++) {
        //     Name_n += MapData.MPObj[i].NumOfNameTime * MapData.ObjectKind[MapData.MPObj[i].Kind].ObjectNameNum;
        // }
        
        for (let i = 0; i < MapData.Map.Kend; i++) {
            for (let j = 0; j < MapData.MPObj[i].NumOfNameTime; j++) {
                const nstc = MapData.MPObj[i].NameTimeSTC[j];
                for (let k = 0; k < nstc.NamesList.length; k++) {
                    let nam = nstc.NamesList[k];
                    if (nam !== "") {
                        if (this.checkObjectNameKanjiCompatibleFF === true) {
                            const retV=Generic.ObjName_Kanji_Compatible(nam);
                            nam=retV.newObjname;
                        }
                        this.Object_Name_Search.Add(Number(nam));
                        const dt = new this.ObjNameAndTime_Info();
                        dt.ObjCode = i;
                        dt.SETime = nstc.SETime;
                        this.Object_Name_Stac_for_Search_O_Code.push(dt);
                    }
                }
            }
        }
        this.Object_Name_Search.AddEnd();
    }

    Object_Name_Stac(Pos: number): InstanceType<clsObjectNameSearch['ObjNameAndTime_Info']> {
        return this.Object_Name_Stac_for_Search_O_Code[Pos];
    }

    DataPositionValue(Pos: number): JsonValue {
        return this.Object_Name_Search.DataPositionValue(Pos) as JsonValue;
    }

    NumofData(): number {
        return this.Object_Name_Search.NumofData();
    }

    DataPosition(num: number): JsonValue {
        return this.Object_Name_Search.DataPosition(num);
    }

    Get_KenToCode(ObjName: string, Time: strYMD): number {
        //オブジェクト名からオブジェクト番号を取得する。見つからなかった場合-1を返す
        if (ObjName === "") {
            return -1;
        }
        if (this.checkObjectNameKanjiCompatibleFF  === true) {
            const retV=Generic.ObjName_Kanji_Compatible(ObjName);
            ObjName=retV.newObjname;
        }
        const DataList = this.Object_Name_Search.SearchData_Array(Number(ObjName));
        for (const i in DataList) {
            const j = DataList[i];
            if (clsTime.checkDurationIn(this.Object_Name_Stac_for_Search_O_Code[j].SETime, Time) === true) {
                return this.Object_Name_Stac_for_Search_O_Code[j].ObjCode;
            }
        }
        return - 1;
    }
}

// Export all enums defined in this module
export {
    enmDataSource,
    enmMarkBlockArrange,
    enmSoloMode_Number,
    enmContourIntervalMode,
    enmDivisionMethod,
    enmPrint_Enable,
    enmPaintColorSettingModeInfo,
    enmClassMode_Meshod,
    enmPointOnjectDrawOrder,
    enmEdge_Pattern,
    enmJoinPattern,
    enmLineConnect,
    enmClassModE_Meshod,
    enmSeparateClassWords,
    enmMesh_Number,
    enmZahyo_System_Info,
    enmScaleUnit,
    enmProjection_Info,
    enmInner_Data_Info_Mode,
    enmMarkPrintType,
    enmBasePosition,
    enmScaleBarPattern,
    enmDrawTiming,
    enmOutputDevice,
    enmKenCodeObjectstructure,
    enmMultiEnGraphPattern,
    enmGraphMaxSize,
    enmMarkMaxValueType,
    enmBarLineMaxMinMode,
    enmBarChartFrameAxePattern,
    cstRectangle_Cross,
    chvValue_on_twoValue
};

// Export constructor functions
export { clsAttrData, clsAttrMapData, Screen_info };
