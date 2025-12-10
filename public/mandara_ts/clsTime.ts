// @ts-expect-error TS(6504): File '/Users/horikazunari/TypeScript/mandara_ts/cl... Remove this comment to see the full error message
/// <reference path="clsGeneric.js" />
// @ts-expect-error TS(6504): File '/Users/horikazunari/TypeScript/mandara_ts/cl... Remove this comment to see the full error message
/// <reference path="clsAttrData.js" />
// @ts-expect-error TS(6504): File '/Users/horikazunari/TypeScript/mandara_ts/ma... Remove this comment to see the full error message
/// <reference path="main.js" />
// @ts-expect-error TS(6504): File '/Users/horikazunari/TypeScript/mandara_ts/cl... Remove this comment to see the full error message
/// <reference path="clsMapdata.js" />

class clsTime  {
    /**
 * Description placeholder
 *
 * @static
 * @returns {*} 
 */
static GetNullYMD  () {
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        var ymd = new strYMD(0, 0, 0)
        return ymd;
    }

    //指定の日付の間の日数を数える。Time1がTime2より後の場合は負の値
    /**
 * Description placeholder
 *
 * @static
 * @param {*} Time1 
 * @param {*} Time2 
 * @returns {number} 
 */
static getDifference (Time1: any, Time2: any) {
        let day1 = Time1.toDate();
        let day2 = Time2.toDate();
        let termDay = (day2 - day1) / 86400000;
        return termDay;
    }
    /**
 * Description placeholder
 *
 * @static
 * @returns {*} 
 */
static GetNullStartEndYMD(){
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let d=new Start_End_Time_data();
        d.StartTime=this.GetNullYMD();
        d.EndTime=this.GetNullYMD();
        return d;
    }

    /**
 * Description placeholder
 *
 * @static
 * @param {*} YMD 
 * @returns {*} 
 */
static YMDtoString(YMD: any) {
        if (YMD.nullFlag() == true) {
            return "未設定";
        } else {
            return YMD.toString();
        }
    }

    /**20131116のような年月日をそのまま数値にした値を返す。nullValueの場合は0 */
    static YMDtoValue(YMD: any) {
            return YMD.Day + YMD.Month * 100 + YMD.Year * 10000;
    }

    /**
 * Description placeholder
 *
 * @static
 * @param {*} value 
 * @returns {*} 
 */
static GetYMDfromValue(value: any){
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
        let  YMD =new  strYMD();
        let s  = "00000000" + value.toString().right( 8);
        YMD.Year = Number(s.substr(0, 4));
        YMD.Month = Number(s.substr(4, 2));
        YMD.Day = Number(s.substr(6, 2));
        return YMD;
    }
    /**
 * Description placeholder
 *
 * @static
 * @param {*} StartEnd 
 * @returns {string} 
 */
static StartEndtoString(StartEnd: any) {
        let txs = "";
        if (StartEnd.StartTime.nullFlag() == true) {
            txs = "開始";
        }
        txs += this.YMDtoString(StartEnd.StartTime) + "-";
        if (StartEnd.EndTime.nullFlag() == true) {
            txs += "終了";
        }
        txs += this.YMDtoString(StartEnd.EndTime);
        return txs;
    }
    /**
 * Description placeholder
 *
 * @static
 * @param {*} duration 
 * @param {*} Point 
 * @returns {boolean} 
 */
static checkDurationIn(duration: any, Point: any) {
        //現時点が指定の期間に含まれているかどうかをチェックし、含まれている場合にtrue
        if ((Point.nullFlag() == true) || (duration.StartTime.nullFlag() == true) && (duration.EndTime.nullFlag() == true)) {
            return true;
        } else {
            let time = Point.toDate();
            switch (duration.StartTime.nullFlag()) {
                case true:
                    if(duration.EndTime.nullFlag() == true) {
                        return true;
                    }else{
                        let etime = duration.EndTime.toDate();
                        return (time <= etime);
                        }
                    break;
                case false:
                    let stime = duration.StartTime.toDate();
                    if (duration.EndTime.nullFlag() == true) {
                        return (stime <= time);
                    } else {
                        let etime =duration.EndTime.toDate();
                        return ((stime <= time) && (time <= etime));
                    }
                    break;

            }
        }
    }

    /**
 * Description placeholder
 *
 * @static
 * @param {*} date 
 * @returns {*} 
 */
static GetYMD(date: any) {
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        return new strYMD(date.getFullYear(), date.getMonth()+1, date.getDate());
    }
    /**
 * Description placeholder
 *
 * @static
 * @param {*} value 
 * @returns {*} 
 */
static GetFromInputDate  (value: any) {
        let t = value.split("-");
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        return new strYMD(Number(t[0]), Number(t[1]), Number(t[2]));
    }
    /**
 * Description placeholder
 *
 * @static
 * @param {*} y 
 * @param {*} m 
 * @param {*} d 
 * @returns {boolean} 
 */
static Check_YMD_Correct(y: any, m: any, d: any) {
        if ((new Date(y, m, 0).getDate() < d) || (m < 1)|| (m > 12) || (d < 1)) {
            return false;
        }
    }

};



/**
 * Description placeholder
 *
 * @returns 
 */
var Font_Property = function(this: any) {
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    this.Color=new colorRGBA();
    this.Size; //Single
    this.italic=false; //Boolean
    this.bold = false; //Boolean
    this.Underline = false; //Boolean
    this.Name; //String
    this.Kakudo=0; //Single
    this.FringeF = false; //Boolean
    this.FringeWidth=50; //Single '文字の大きさに対する割合
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    this.FringeColor = new colorRGBA();
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    this.Back = new BackGround_Box_Property(); 
}
Font_Property.prototype.Clone = function () {
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    let d = new Font_Property();
    Object.assign(d, this)
    d.Color = this.Color.Clone();
    d.FringeColor = this.FringeColor.Clone();
    d.Back = this.Back.Clone();
    return d;
}
//fontプロパティから、Cnvas用fontに変換
Font_Property.prototype.toContextFont = function(ScrData: any){
    let TH;
    if (ScrData.SampleBoxFlag == false) {
        TH = ScrData.Get_Length_On_Screen(this.Size);
    } else {
        TH = this.Size;
    }
    if (TH == 0) {
        return { font: undefined, height: TH };
    }

    let ftext = TH + "px " + "'" + this.Name + "' ";
    if (this.bold == true) {
        ftext += "bold ";
    }
    if (this.italic == true) {
        ftext += "italic ";
    }
    return { font: ftext, height: TH };
}

/**
 * Description placeholder
 *
 * @returns 
 */
var BackGround_Box_Property = function(this: any) {
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    this.Tile = new Tile_Property();
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    this.Line = new Line_Property();
    this.Round; //Single
    this.Padding; //Single
}
BackGround_Box_Property.prototype.Clone = function () {
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    let d = new BackGround_Box_Property();
    Object.assign(d, this);
    d.Tile = this.Tile.Clone();
    d.Line = this.Line.Clone();
    return d;
}

/**
 * Description placeholder
 *
 * @returns 
 */
var LineEdge_Connect_Pattern_Data_Info = function(this: any) {
    this.lineCap="round";
    this.lineJoin = "round";
    this.miterLimit=10;
}
LineEdge_Connect_Pattern_Data_Info.prototype.Clone = function () {
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    let d = new LineEdge_Connect_Pattern_Data_Info();
    Object.assign(d, this)
    return d;
}

/**
 * Description placeholder
 *
 * @returns 
 */
var Line_Property = function(this: any) {
    this.BlankF=false;
    this.Width=0;
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    this.Color = new colorRGBA();
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    this.Edge_Connect_Pattern = new LineEdge_Connect_Pattern_Data_Info();
}
Line_Property.prototype.Clone = function () {
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    let d = new Line_Property();
    d.BlankF = this.BlankF;
    d.Width = this.Width;
    d.Color = this.Color.Clone();
    d.Edge_Connect_Pattern = this.Edge_Connect_Pattern.Clone();
    return d;
}
Line_Property.prototype.Set_Same_ColorWidth_to_LinePat= function (Color: any, width: any) {
    this.Width = width;
    this.Color = Color;
}

/**
 * Description placeholder
 *
 * @returns 
 */
var Tile_Property = function(this: any) {
    this.BlankF=true;
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    this.Color = new colorRGBA();
}
Tile_Property.prototype.Clone = function () {
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    let d = new Tile_Property();
    d.BlankF = this.BlankF;
    d.Color = this.Color.Clone();
    return d;
}

//記号のプロパティ
/**
 * Description placeholder
 *
 * @returns 
 */
var Mark_Property = function(this: any) {
    this.PrintMark; //enmMarkPrintType
    this.ShapeNumber; //Short
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    this.Tile = new Tile_Property();
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    this.Line = new Line_Property();
    this.wordmark; //String
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    this.WordFont = new Font_Property();
}
Mark_Property.prototype.Clone = function () {
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    let d = new Mark_Property();
    Object.assign(d, this);
    d.Tile = this.Tile.Clone();
    d.Line = this.Line.Clone();
    d.WordFont = this.WordFont.Clone();
    return d;
}

/**
 * Description placeholder
 *
 * @type {{ Line: number; Fill: number; }}
 */
var enmArrowHeadType={
    Line : 0,
    Fill : 1
}
//矢印のプロパティ
/**
 * Description placeholder
 *
 * @returns 
 */
var Arrow_Data = function(this: any) {
    this.Start_Arrow_F; //Boolean
    this.End_Arrow_F; //Boolean
    this.ArrowHeadType; //enmArrowHeadType
    this.Angle; //Single
    this.LWidthRatio; //Single
    this.WidthPlus; //Single
}
Arrow_Data.prototype.Clone = function () {
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    let d = new Arrow_Data();
    Object.assign(d,this);
    return d;
}

/**
 * Description placeholder
 *
 * @type {{ DegreeMinuteSecond: number; DecimalDegree: number; }}
 */
var enmLatLonPrintPattern = {
    DegreeMinuteSecond: 0,
    DecimalDegree: 1
}

/**
 * Description placeholder
 *
 * @returns 
 */
var Setting_Info = function(this: any) {
    this.ObjectName_Word_Compatible = "ヶガケかカヵ|曽曾|桧檜|条條|蕊蘂|釜竈竃|桜櫻|当當|頸頚|梼檮|挾狭|諫諌|鶯鴬|真眞|篭籠|鯵鰺|檮梼|藪薮|龍竜";
    this.KatakanaCheck = true;
    this.SinKyuCharacter = true;
    this.SetFont = "";
    this.MinimumLineWidth = 4;
    this.Printing_Time_Limit = 1;
    this.Ido_Kedo_Print_Pattern = enmLatLonPrintPattern.DecimalDegree ;// enmLatLonPrintPattern
    this.Compass_Mark = 11;
    this.Compass_Mark_Size = 8;
    this.SinKyuCharacter = true;
    this.KatakanaCheck = true;
    this.default_Projection = enmProjection_Info.prjMercator// enmProjection_Info
    this.MDRFileHistory;
    this.BackImageSpeed = 3;
    this.LegendMinusWord = "負の値";
    this.LegendPlusWord = "正の値";
    this.LegendBlockmodeWord = "1個あたり";
}
Setting_Info.prototype.Clone= function(){
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    let d=new Setting_Info();
    Object.assign(d,this);
    return d;
}


class clsBase {
    /**
 * Description placeholder
 *
 * @static
 * @returns {Arrow_Data} 
 */
static Arrow() {
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let BArrow = new Arrow_Data();
        BArrow.End_Arrow_F = false;
        BArrow.Start_Arrow_F = false;
        BArrow.ArrowHeadType = enmArrowHeadType.Line;
        BArrow.WidthPlus = 2;
        BArrow.Angle = 50;
        BArrow.LWidthRatio = 1;
        return BArrow;
    }

    /**
 * Description placeholder
 *
 * @static
 * @returns {LineEdge_Connect_Pattern_Data_Info} 
 */
static LineEdge  () {
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let base = new LineEdge_Connect_Pattern_Data_Info()
        base.lineCap = "round";
        base.lineJoin = "round";
        base.miterLimit = 10;
        return base;

    }
    static Line  () {
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let BaseLine = new Line_Property();
        BaseLine.BlankF = false;
        BaseLine.Edge_Connect_Pattern = this.LineEdge();
        BaseLine.Width = 0;
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        BaseLine.Color = new colorRGBA([0, 0, 0]);
        return BaseLine;
    }

    /**
 * Description placeholder
 *
 * @static
 * @returns {Line_Property} 
 */
static BlankLine  () {
        let l = this.Line();
        l.BlankF = true;
        return l;
    }


    /**
 * Description placeholder
 *
 * @static
 * @returns {Line_Property} 
 */
static BoldLine  () {
        let l = this.Line();
        l.Width = 0.3;
        return l;
    }
    /**
 * Description placeholder
 *
 * @static
 * @returns {Tile_Property} 
 */
static Tile  () {
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let BaseTile = new Tile_Property();
        BaseTile.BlankF = false;
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        BaseTile.Color = new colorRGBA([255, 255, 255]);
        return BaseTile;
    }
    /**
 * Description placeholder
 *
 * @static
 * @returns {Tile_Property} 
 */
static BlancTile() {
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let BaseTile = new Tile_Property();
        BaseTile.BlankF = true;
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        BaseTile.Color = new colorRGBA([255, 255, 255]);
        return BaseTile;
    }
    /**
 * Description placeholder
 *
 * @static
 * @param {*} col 
 * @returns {Tile_Property} 
 */
static PaintTile(col: any) {
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let BaseTile = new Tile_Property();
        BaseTile.BlankF = false;
        BaseTile.Color = col;
        return BaseTile;
    }

    /**
 * Description placeholder
 *
 * @static
 * @returns {Font_Property} 
 */
static Font  () {
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let Base = new Font_Property();
        Base.Size = 4;
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        Base.Color = new colorRGBA([0, 0, 0]);
        Base.italic = false;
        Base.Underline = false; //使えない
        // @ts-expect-error TS(2304): Cannot find name 'clsSettingData'.
        Base.Name =clsSettingData.SetFont;
        Base.bold = false;
        Base.Kakudo = 0;
        Base.FringeF = false;
        Base.FringeWidth = 60;
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        Base.FringeColor = new colorRGBA([255, 255,255]);
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        Base.Back = new BackGround_Box_Property();
        Base.Back.Tile.BlankF = true;
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        Base.Back.Tile.Color = new colorRGBA([255, 255, 255]);
        Base.Back.Line = this.Line();
        Base.Back.Line.BlankF = true;
        Base.Back.Round = 1;
        Base.Back.Padding = 1;
        return Base;
    }

    /**
 * Description placeholder
 *
 * @static
 * @returns {Mark_Property} 
 */
static Mark  () {
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let BMark = new Mark_Property();
        BMark.PrintMark = enmMarkPrintType.Mark;
        BMark.ShapeNumber=0; //Short
        BMark.Tile = this.Tile();
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        BMark.Tile.Color = new colorRGBA([200, 200, 200])
        BMark.Line = this.Line();
        BMark.wordmark = "";
        BMark.WordFont = this.Font();
        BMark.WordFont.Size=2;
        return BMark;
    }

    /**
 * Description placeholder
 *
 * @static
 * @returns {*} 
 */
static ColorWhite() {
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        return new colorRGBA([255, 255, 255]);
    }
    /**
 * Description placeholder
 *
 * @static
 * @returns {*} 
 */
static ColorGray() {
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        return new colorRGBA([125, 125, 125]);
    }
    /**
 * Description placeholder
 *
 * @static
 * @returns {*} 
 */
static ColorBlack() {
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        return new colorRGBA([0, 0, 0]);
    }
    /**
 * Description placeholder
 *
 * @static
 * @returns {*} 
 */
static ColorBlue() {
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        return new colorRGBA([0, 0, 255]);
    }
    /**
 * Description placeholder
 *
 * @static
 * @returns {*} 
 */
static ColorRed() {
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        return new colorRGBA([255, 0, 0]);
    }
    /**
 * Description placeholder
 *
 * @static
 * @returns {*} 
 */
static ColorGreen() {
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        return new colorRGBA([0, 255, 0]);
    }


    /**
 * Description placeholder
 *
 * @static
 * @returns {BackGround_Box_Property} 
 */
static BlankBackground() {
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let Back = new BackGround_Box_Property();
        Back.Line.BlankF = true;
        Back.Tile.BlankF = true;
        Back.Round = 1;
        Back.Padding = 1;
        return Back;
    }

    /**
 * Description placeholder
 *
 * @static
 * @returns {BackGround_Box_Property} 
 */
static WhiteBackground() {
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let Back = new BackGround_Box_Property();
        Back.Line.BlankF = true;
        Back.Tile.BlankF = false;
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        Back.Tile.Color = new colorRGBA([255, 255, 255,200]);
        Back.Round = 1;
        Back.Padding = 1;
        return Back;
    }
}

