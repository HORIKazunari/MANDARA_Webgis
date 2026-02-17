import { appState } from './core/AppState';
import type { JsonValue } from './types';
import { colorRGBA, enmMarkPrintType, enmProjection_Info, Start_End_Time_data, Screen_info, strYMD } from './clsAttrData';

class clsTime  {
    static GetNullYMD(): strYMD {
        const ymd = new strYMD(0, 0, 0)
        return ymd;
    }

    // 前日を取得
    static getYesterday(YMD: strYMD): strYMD {

        const d = YMD.toDate();
        d.setDate(d.getDate() - 1);
        return new strYMD(d.getFullYear(), d.getMonth() + 1, d.getDate());
    }

    // 翌日を取得
    static getTomorrow(YMD: strYMD): strYMD {

        const d = YMD.toDate();
        d.setDate(d.getDate() + 1);
        return new strYMD(d.getFullYear(), d.getMonth() + 1, d.getDate());
    }

    //指定の日付の間の日数を数える。Time1がTime2より後の場合は負の値
    static getDifference (Time1: strYMD, Time2: strYMD): number {
        const day1 = Time1.toDate();
        const day2 = Time2.toDate();
        const termDay = (day2.getTime() - day1.getTime()) / 86400000;
        return termDay;
    }
    static GetNullStartEndYMD(): Start_End_Time_data {

        const d=new Start_End_Time_data();
        d.StartTime=this.GetNullYMD();
        d.EndTime=this.GetNullYMD();
        return d;
    }

    static YMDtoString(YMD: strYMD): string {

        if (YMD.nullFlag() === true) {
            return "未設定";
        } else {
            return YMD.toString();
        }
    }

    /**20131116のような年月日をそのまま数値にした値を返す。nullValueの場合は0 */
    static YMDtoValue(YMD: strYMD): number {

            return YMD.Day + YMD.Month * 100 + YMD.Year * 10000;
    }

    static GetYMDfromValue(value: number): strYMD {

        const YMD =new  strYMD();
        const s  = "00000000" + value.toString().right( 8);
        YMD.Year = Number(s.substr(0, 4));
        YMD.Month = Number(s.substr(4, 2));
        YMD.Day = Number(s.substr(6, 2));
        return YMD;
    }
    static StartEndtoString(StartEnd: Start_End_Time_data): string {

        let txs = "";
        if (StartEnd.StartTime.nullFlag() === true) {
            txs = "開始";
        }
        txs += this.YMDtoString(StartEnd.StartTime) + "-";
        if (StartEnd.EndTime.nullFlag() === true) {
            txs += "終了";
        }
        txs += this.YMDtoString(StartEnd.EndTime);
        return txs;
    }
    static checkDurationIn(duration: Start_End_Time_data, Point: strYMD): boolean {

        //現時点が指定の期間に含まれているかどうかをチェックし、含まれている場合にtrue
        if ((Point.nullFlag() === true) || (duration.StartTime.nullFlag() === true) && (duration.EndTime.nullFlag() === true)) {
            return true;
        } else {
            const time = Point.toDate();
            switch (duration.StartTime.nullFlag()) {
                case true:
                    if(duration.EndTime.nullFlag() === true) {
                        return true;
                    }else{
                        const etime = duration.EndTime.toDate();
                        return (time <= etime);
                        }
                    break;
                case false: {
                    const stime = duration.StartTime.toDate();
                    if (duration.EndTime.nullFlag() === true) {
                        return (stime <= time);
                    } else {
                        const etime =duration.EndTime.toDate();
                        return ((stime <= time) && (time <= etime));
                    }
                    break;
                }

            }
        }
    }

    static GetYMD(date: Date): strYMD {

        return new strYMD(date.getFullYear(), date.getMonth()+1, date.getDate());
    }
    static GetFromInputDate  (value: string): strYMD {
        const t = value.split("-");
        return new strYMD(Number(t[0]), Number(t[1]), Number(t[2]));
    }
    static Check_YMD_Correct(y: number, m: number, d: number): boolean | undefined {

        if ((new Date(y, m, 0).getDate() < d) || (m < 1)|| (m > 12) || (d < 1)) {
            return false;
        }
    }

};



class Font_Property {
    Color = new colorRGBA();
    Size?: number;
    italic = false;
    bold = false;
    Underline = false;
    Name?: string;
    Kakudo = 0;
    FringeF = false;
    FringeWidth = 50;
    FringeColor = new colorRGBA();
    Back = new BackGround_Box_Property();
    
    Clone(): Font_Property {
        const d = new Font_Property();
        Object.assign(d, this);
        d.Color = this.Color.Clone();
        d.FringeColor = this.FringeColor.Clone();
        d.Back = this.Back.Clone();
        return d;
    }
    
    toContextFont(ScrData: Screen_info): { font: string | undefined; height: number } {
        let TH: number;
        if (ScrData.SampleBoxFlag === false) {
            TH = ScrData.Get_Length_On_Screen(this.Size ?? 0);
        } else {
            TH = this.Size ?? 0;
        }
        if (TH === 0) {
            return { font: undefined, height: TH };
        }

        let ftext = TH + "px " + "'" + this.Name + "' ";
        if (this.bold === true) {
            ftext += "bold ";
        }
        if (this.italic === true) {
            ftext += "italic ";
        }
        return { font: ftext, height: TH };
    }
}

export { clsTime, Font_Property, BackGround_Box_Property, Line_Property, Tile_Property, Mark_Property };

class BackGround_Box_Property {
    Tile = new Tile_Property();
    Line = new Line_Property();
    Round?: number;
    Padding?: number;
    
    Clone(): BackGround_Box_Property {
        const d = new BackGround_Box_Property();
        Object.assign(d, this);
        d.Tile = this.Tile.Clone();
        d.Line = this.Line.Clone();
        return d;
    }
}

class LineEdge_Connect_Pattern_Data_Info {
    lineCap: CanvasLineCap = "round";
    lineJoin: CanvasLineJoin = "round";
    miterLimit = 10;
    
    Clone(): LineEdge_Connect_Pattern_Data_Info {
        const d = new LineEdge_Connect_Pattern_Data_Info();
        Object.assign(d, this);
        return d;
    }
}

class Line_Property {
    BlankF = false;
    Width = 0;
    Color = new colorRGBA();
    Edge_Connect_Pattern = new LineEdge_Connect_Pattern_Data_Info();
    
    Clone(): Line_Property {
        const d = new Line_Property();
        d.BlankF = this.BlankF;
        d.Width = this.Width;
        d.Color = this.Color.Clone();
        d.Edge_Connect_Pattern = this.Edge_Connect_Pattern.Clone();
        return d;
    }
    
    Set_Same_ColorWidth_to_LinePat(Color: colorRGBA, width: number): void {
        this.Width = width;
        this.Color = Color;
    }
}

class Tile_Property {
    BlankF = true;
    Color = new colorRGBA();
    
    Clone(): Tile_Property {
        const d = new Tile_Property();
        d.BlankF = this.BlankF;
        d.Color = this.Color.Clone();
        return d;
    }
}

class Mark_Property {
    PrintMark?: (typeof enmMarkPrintType)[keyof typeof enmMarkPrintType];
    ShapeNumber?: number;
    Tile = new Tile_Property();
    Line = new Line_Property();
    wordmark?: string;
    WordFont = new Font_Property();
    
    Clone(): Mark_Property {
        const d = new Mark_Property();
        Object.assign(d, this);
        d.Tile = this.Tile.Clone();
        d.Line = this.Line.Clone();
        d.WordFont = this.WordFont.Clone();
        return d;
    }
}

const enmArrowHeadType={
    Line : 0,
    Fill : 1
}

class Arrow_Data {
    Start_Arrow_F?: boolean;
    End_Arrow_F?: boolean;
    ArrowHeadType?: number;
    Angle?: number;
    LWidthRatio?: number;
    WidthPlus?: number;
    
    Clone(): Arrow_Data {
        const d = new Arrow_Data();
        Object.assign(d, this);
        return d;
    }
}

const enmLatLonPrintPattern = {
    DegreeMinuteSecond: 0,
    DecimalDegree: 1
}

export class Setting_Info {
    ObjectName_Word_Compatible = "ヶガケかカヵ|曽曾|桧檜|条條|蕊蘂|釜竈竃|桜櫻|当當|頸頚|梼檮|挾狭|諫諌|鶯鴬|真眞|篭籠|鯵鰺|檮梼|藪薮|龍竜";
    KatakanaCheck = true;
    SinKyuCharacter = true;
    SetFont = "";
    MinimumLineWidth = 4;
    Printing_Time_Limit = 1;
    Ido_Kedo_Print_Pattern = enmLatLonPrintPattern.DecimalDegree;
    Compass_Mark = 11;
    Compass_Mark_Size = 8;
    default_Projection = enmProjection_Info.prjMercator;
    MDRFileHistory?: JsonValue;
    BackImageSpeed = 3;
    LegendMinusWord = "負の値";
    LegendPlusWord = "正の値";
    LegendBlockmodeWord = "1個あたり";
    
    Clone(): Setting_Info {
        const d = new Setting_Info();
        Object.assign(d, this);
        return d;
    }
}

export class clsBase {
    static Arrow(): Arrow_Data {

        const BArrow = new Arrow_Data();
        BArrow.End_Arrow_F = false;
        BArrow.Start_Arrow_F = false;
        BArrow.ArrowHeadType = enmArrowHeadType.Line;
        BArrow.WidthPlus = 2;
        BArrow.Angle = 50;
        BArrow.LWidthRatio = 1;
        return BArrow;
    }

    static LineEdge  (): LineEdge_Connect_Pattern_Data_Info {
        const base = new LineEdge_Connect_Pattern_Data_Info()
        base.lineCap = "round";
        base.lineJoin = "round";
        base.miterLimit = 10;
        return base;

    }
    static Line  (): Line_Property {
        const BaseLine = new Line_Property();
        BaseLine.BlankF = false;
        BaseLine.Edge_Connect_Pattern = this.LineEdge();
        BaseLine.Width = 0;
        BaseLine.Color = new colorRGBA([0, 0, 0]);
        return BaseLine;
    }

    static BlankLine  (): Line_Property {
        const l = this.Line();
        l.BlankF = true;
        return l;
    }


    static BoldLine  (): Line_Property {
        const l = this.Line();
        l.Width = 0.3;
        return l;
    }
    static Tile  (): Tile_Property {
        const BaseTile = new Tile_Property();
        BaseTile.BlankF = false;
        BaseTile.Color = new colorRGBA([255, 255, 255]);
        return BaseTile;
    }
    static BlancTile(): Tile_Property {

        const BaseTile = new Tile_Property();
        BaseTile.BlankF = true;
        BaseTile.Color = new colorRGBA([255, 255, 255]);
        return BaseTile;
    }
    static PaintTile(col: colorRGBA): Tile_Property {

        const BaseTile = new Tile_Property();
        BaseTile.BlankF = false;
        BaseTile.Color = col;
        return BaseTile;
    }

    static Font  (): Font_Property {
        const Base = new Font_Property();
        Base.Size = 4;
        Base.Color = new colorRGBA([0, 0, 0]);
        Base.italic = false;
        Base.Underline = false; //使えない
        Base.Name = appState().settingData?.SetFont ?? 'sans-serif';
        Base.bold = false;
        Base.Kakudo = 0;
        Base.FringeF = false;
        Base.FringeWidth = 60;
        Base.FringeColor = new colorRGBA([255, 255,255]);
        Base.Back = new BackGround_Box_Property();
        Base.Back.Tile.BlankF = true;
        Base.Back.Tile.Color = new colorRGBA([255, 255, 255]);
        Base.Back.Line = this.Line();
        Base.Back.Line.BlankF = true;
        Base.Back.Round = 1;
        Base.Back.Padding = 1;
        return Base;
    }

    static Mark  (): Mark_Property {
        const BMark = new Mark_Property();
        BMark.PrintMark = enmMarkPrintType.Mark;
        BMark.ShapeNumber=0; //Short
        BMark.Tile = this.Tile();
        BMark.Tile.Color = new colorRGBA([200, 200, 200])
        BMark.Line = this.Line();
        BMark.wordmark = "";
        BMark.WordFont = this.Font();
        BMark.WordFont.Size=2;
        return BMark;
    }

    static ColorWhite(): colorRGBA {

        return new colorRGBA([255, 255, 255]);
    }
    static ColorGray(): colorRGBA {

        return new colorRGBA([125, 125, 125]);
    }
    static ColorBlack(): colorRGBA {

        return new colorRGBA([0, 0, 0]);
    }
    static ColorBlue(): colorRGBA {

        return new colorRGBA([0, 0, 255]);
    }
    static ColorRed(): colorRGBA {

        return new colorRGBA([255, 0, 0]);
    }
    static ColorGreen(): colorRGBA {

        return new colorRGBA([0, 255, 0]);
    }


    static BlankBackground(): BackGround_Box_Property {

        const Back = new BackGround_Box_Property();
        Back.Line.BlankF = true;
        Back.Tile.BlankF = true;
        Back.Round = 1;
        Back.Padding = 1;
        return Back;
    }

    static WhiteBackground(): BackGround_Box_Property {

        const Back = new BackGround_Box_Property();
        Back.Line.BlankF = true;
        Back.Tile.BlankF = false;
        Back.Tile.Color = new colorRGBA([255, 255, 255,200]);
        Back.Round = 1;
        Back.Padding = 1;
        return Back;
    }
}

