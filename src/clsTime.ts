import { appState } from './core/AppState';
import type { JsonValue } from './types';
import { colorRGBA, enmMarkPrintType, enmProjection_Info, Start_End_Time_data, Screen_info, strYMD } from './clsAttrData';

/**
 * 日付期間や描画設定の既定値を扱う補助クラスです。
 */
class clsTime  {
    /**
     * 未設定扱いの年月日を返します。
     *
     * @returns 年月日が 0 の値です。
     */
    static GetNullYMD(): strYMD {
        const ymd = new strYMD(0, 0, 0)
        return ymd;
    }

    /**
     * 指定日の前日を返します。
     *
     * @param YMD 基準日です。
     * @returns 1 日前の年月日です。
     */
    static getYesterday(YMD: strYMD): strYMD {

        const d = YMD.toDate();
        d.setDate(d.getDate() - 1);
        return new strYMD(d.getFullYear(), d.getMonth() + 1, d.getDate());
    }

    /**
     * 指定日の翌日を返します。
     *
     * @param YMD 基準日です。
     * @returns 1 日後の年月日です。
     */
    static getTomorrow(YMD: strYMD): strYMD {

        const d = YMD.toDate();
        d.setDate(d.getDate() + 1);
        return new strYMD(d.getFullYear(), d.getMonth() + 1, d.getDate());
    }

    /**
     * 2 つの日付の差分日数を返します。
     *
     * @param Time1 起点日です。
     * @param Time2 終点日です。
     * @returns Time2 から Time1 を引いた日数です。
     */
    static getDifference (Time1: strYMD, Time2: strYMD): number {
        const day1 = Time1.toDate();
        const day2 = Time2.toDate();
        const termDay = (day2.getTime() - day1.getTime()) / 86400000;
        return termDay;
    }

    /**
     * 未設定の開始日・終了日データを生成します。
     *
     * @returns 両端が未設定の期間データです。
     */
    static GetNullStartEndYMD(): Start_End_Time_data {

        const d=new Start_End_Time_data();
        d.StartTime=this.GetNullYMD();
        d.EndTime=this.GetNullYMD();
        return d;
    }

    /**
     * 年月日を表示用文字列へ変換します。
     *
     * @param YMD 変換対象の年月日です。
     * @returns 未設定時は未設定、それ以外は日付文字列です。
     */
    static YMDtoString(YMD: strYMD): string {

        if (YMD.nullFlag() === true) {
            return "未設定";
        } else {
            return YMD.toString();
        }
    }

    /**
     * 年月日を yyyymmdd 形式の数値へ変換します。
     *
     * @param YMD 変換対象の年月日です。
     * @returns yyyymmdd 形式の数値です。
     */
    static YMDtoValue(YMD: strYMD): number {

            return YMD.Day + YMD.Month * 100 + YMD.Year * 10000;
    }

    /**
     * yyyymmdd 形式の数値から年月日を生成します。
     *
     * @param value 変換元の数値です。
     * @returns 生成した年月日です。
     */
    static GetYMDfromValue(value: number): strYMD {

        const YMD =new  strYMD();
        const s  = "00000000" + value.toString().right( 8);
        YMD.Year = Number(s.substr(0, 4));
        YMD.Month = Number(s.substr(4, 2));
        YMD.Day = Number(s.substr(6, 2));
        return YMD;
    }
    /**
     * 開始日・終了日の組を表示用文字列へ変換します。
     *
     * @param StartEnd 変換対象の期間データです。
     * @returns 表示用の期間文字列です。
     */
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
    /**
     * 指定日が期間内に含まれるかを判定します。
     *
     * @param duration 判定対象の期間です。
     * @param Point 判定する年月日です。
     * @returns 期間内に含まれる場合は true です。
     */
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

    /**
     * Date から年月日オブジェクトを生成します。
     *
     * @param date 変換元の日付です。
     * @returns 年月日です。
     */
    static GetYMD(date: Date): strYMD {

        return new strYMD(date.getFullYear(), date.getMonth()+1, date.getDate());
    }
    /**
     * input[type=date] 形式の文字列から年月日を生成します。
     *
     * @param value yyyy-mm-dd 形式の文字列です。
     * @returns 年月日です。
     */
    static GetFromInputDate  (value: string): strYMD {
        const t = value.split("-");
        return new strYMD(Number(t[0]), Number(t[1]), Number(t[2]));
    }

    /**
     * 年月日の妥当性を判定します。
     *
     * @param y 年です。
     * @param m 月です。
     * @param d 日です。
     * @returns 不正な場合は false、それ以外は undefined です。
     */
    static Check_YMD_Correct(y: number, m: number, d: number): boolean | undefined {

        if ((new Date(y, m, 0).getDate() < d) || (m < 1)|| (m > 12) || (d < 1)) {
            return false;
        }
    }

};



/**
 * 文字描画時に使用するフォント属性です。
 */
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
    
    /**
     * フォント属性を複製します。
     *
     * @returns 複製したフォント属性です。
     */
    Clone(): Font_Property {
        const d = new Font_Property();
        Object.assign(d, this);
        d.Color = this.Color.Clone();
        d.FringeColor = this.FringeColor.Clone();
        d.Back = this.Back.Clone();
        return d;
    }
    
    /**
     * Canvas 描画用の font 文字列と高さを生成します。
     *
     * @param ScrData 画面スケール情報です。
     * @returns Canvas 用 font 文字列と算出した高さです。
     */
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

export { clsTime, Font_Property, BackGround_Box_Property, Line_Property, LineEdge_Connect_Pattern_Data_Info, Tile_Property, Mark_Property, Arrow_Data, enmArrowHeadType };

/**
 * 文字背景の塗りと枠線設定です。
 */
class BackGround_Box_Property {
    Tile = new Tile_Property();
    Line = new Line_Property();
    Round?: number;
    Padding?: number;
    
    /**
     * 背景ボックス設定を複製します。
     *
     * @returns 複製した背景設定です。
     */
    Clone(): BackGround_Box_Property {
        const d = new BackGround_Box_Property();
        Object.assign(d, this);
        d.Tile = this.Tile.Clone();
        d.Line = this.Line.Clone();
        return d;
    }
}

/**
 * 線端・線結合の描画設定です。
 */
class LineEdge_Connect_Pattern_Data_Info {
    lineCap: CanvasLineCap = "round";
    lineJoin: CanvasLineJoin = "round";
    miterLimit = 10;
    
    /**
     * 線端接続設定を複製します。
     *
     * @returns 複製した線端接続設定です。
     */
    Clone(): LineEdge_Connect_Pattern_Data_Info {
        const d = new LineEdge_Connect_Pattern_Data_Info();
        Object.assign(d, this);
        return d;
    }
}

/**
 * 線描画の基本属性です。
 */
class Line_Property {
    BlankF = false;
    Width = 0;
    Color = new colorRGBA();
    Edge_Connect_Pattern = new LineEdge_Connect_Pattern_Data_Info();
    
    /**
     * 線属性を複製します。
     *
     * @returns 複製した線属性です。
     */
    Clone(): Line_Property {
        const d = new Line_Property();
        d.BlankF = this.BlankF;
        d.Width = this.Width;
        d.Color = this.Color.Clone();
        d.Edge_Connect_Pattern = this.Edge_Connect_Pattern.Clone();
        return d;
    }
    
    /**
     * 線色と線幅をまとめて設定します。
     *
     * @param Color 設定する色です。
     * @param width 設定する幅です。
     */
    Set_Same_ColorWidth_to_LinePat(Color: colorRGBA, width: number): void {
        this.Width = width;
        this.Color = Color;
    }
}

/**
 * 塗りつぶし属性です。
 */
class Tile_Property {
    BlankF = true;
    Color = new colorRGBA();
    
    /**
     * 塗り属性を複製します。
     *
     * @returns 複製した塗り属性です。
     */
    Clone(): Tile_Property {
        const d = new Tile_Property();
        d.BlankF = this.BlankF;
        d.Color = this.Color.Clone();
        return d;
    }
}

/**
 * 記号描画に使う属性一式です。
 */
class Mark_Property {
    PrintMark?: (typeof enmMarkPrintType)[keyof typeof enmMarkPrintType];
    ShapeNumber?: number;
    Tile = new Tile_Property();
    Line = new Line_Property();
    wordmark?: string;
    WordFont = new Font_Property();
    
    /**
     * 記号属性を複製します。
     *
     * @returns 複製した記号属性です。
     */
    Clone(): Mark_Property {
        const d = new Mark_Property();
        Object.assign(d, this);
        d.Tile = this.Tile.Clone();
        d.Line = this.Line.Clone();
        d.WordFont = this.WordFont.Clone();
        return d;
    }
}

/**
 * 矢印の先端形状種別です。
 */
const enmArrowHeadType={
    Line : 0,
    Fill : 1
}

/**
 * 線端の矢印設定です。
 */
class Arrow_Data {
    Start_Arrow_F?: boolean;
    End_Arrow_F?: boolean;
    ArrowHeadType?: number;
    Angle?: number;
    LWidthRatio?: number;
    WidthPlus?: number;
    
    /**
     * 矢印設定を複製します。
     *
     * @returns 複製した矢印設定です。
     */
    Clone(): Arrow_Data {
        const d = new Arrow_Data();
        Object.assign(d, this);
        return d;
    }
}

/**
 * 緯度経度の表示書式です。
 */
const enmLatLonPrintPattern = {
    DegreeMinuteSecond: 0,
    DecimalDegree: 1
}

/**
 * アプリケーション全体の既定設定です。
 */
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
    
    /**
     * 設定値を複製します。
     *
     * @returns 複製した設定値です。
     */
    Clone(): Setting_Info {
        const d = new Setting_Info();
        Object.assign(d, this);
        return d;
    }
}

/**
 * 描画属性や色の既定値を生成するファクトリ群です。
 */
export class clsBase {
    /**
     * 既定の矢印設定を生成します。
     *
     * @returns 初期化済みの矢印設定です。
     */
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

    /**
     * 既定の線端接続設定を生成します。
     *
     * @returns 初期化済みの線端接続設定です。
     */
    static LineEdge  (): LineEdge_Connect_Pattern_Data_Info {
        const base = new LineEdge_Connect_Pattern_Data_Info()
        base.lineCap = "round";
        base.lineJoin = "round";
        base.miterLimit = 10;
        return base;

    }
    /**
     * 既定の線属性を生成します。
     *
     * @returns 初期化済みの線属性です。
     */
    static Line  (): Line_Property {
        const BaseLine = new Line_Property();
        BaseLine.BlankF = false;
        BaseLine.Edge_Connect_Pattern = this.LineEdge();
        BaseLine.Width = 0;
        BaseLine.Color = new colorRGBA([0, 0, 0]);
        return BaseLine;
    }

    /**
     * 非表示線として使う線属性を生成します。
     *
     * @returns BlankF が有効な線属性です。
     */
    static BlankLine  (): Line_Property {
        const l = this.Line();
        l.BlankF = true;
        return l;
    }


    /**
     * 太めの既定線属性を生成します。
     *
     * @returns 線幅を調整済みの線属性です。
     */
    static BoldLine  (): Line_Property {
        const l = this.Line();
        l.Width = 0.3;
        return l;
    }
    /**
     * 既定の塗り属性を生成します。
     *
     * @returns 初期化済みの塗り属性です。
     */
    static Tile  (): Tile_Property {
        const BaseTile = new Tile_Property();
        BaseTile.BlankF = false;
        BaseTile.Color = new colorRGBA([255, 255, 255]);
        return BaseTile;
    }
    /**
     * 空塗りの塗り属性を生成します。
     *
     * @returns BlankF が有効な塗り属性です。
     */
    static BlancTile(): Tile_Property {

        const BaseTile = new Tile_Property();
        BaseTile.BlankF = true;
        BaseTile.Color = new colorRGBA([255, 255, 255]);
        return BaseTile;
    }
    /**
     * 指定色で塗る塗り属性を生成します。
     *
     * @param col 塗り色です。
     * @returns 指定色を持つ塗り属性です。
     */
    static PaintTile(col: colorRGBA): Tile_Property {

        const BaseTile = new Tile_Property();
        BaseTile.BlankF = false;
        BaseTile.Color = col;
        return BaseTile;
    }

    /**
     * 既定のフォント属性を生成します。
     *
     * @returns 初期化済みのフォント属性です。
     */
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

    /**
     * 既定の記号属性を生成します。
     *
     * @returns 初期化済みの記号属性です。
     */
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

    /**
     * 白色を返します。
     *
     * @returns 白色です。
     */
    static ColorWhite(): colorRGBA {

        return new colorRGBA([255, 255, 255]);
    }
    /**
     * 灰色を返します。
     *
     * @returns 灰色です。
     */
    static ColorGray(): colorRGBA {

        return new colorRGBA([125, 125, 125]);
    }
    /**
     * 黒色を返します。
     *
     * @returns 黒色です。
     */
    static ColorBlack(): colorRGBA {

        return new colorRGBA([0, 0, 0]);
    }
    /**
     * 青色を返します。
     *
     * @returns 青色です。
     */
    static ColorBlue(): colorRGBA {

        return new colorRGBA([0, 0, 255]);
    }
    /**
     * 赤色を返します。
     *
     * @returns 赤色です。
     */
    static ColorRed(): colorRGBA {

        return new colorRGBA([255, 0, 0]);
    }
    /**
     * 緑色を返します。
     *
     * @returns 緑色です。
     */
    static ColorGreen(): colorRGBA {

        return new colorRGBA([0, 255, 0]);
    }


    /**
     * 枠線も塗りも持たない背景設定を生成します。
     *
     * @returns 空背景の設定です。
     */
    static BlankBackground(): BackGround_Box_Property {

        const Back = new BackGround_Box_Property();
        Back.Line.BlankF = true;
        Back.Tile.BlankF = true;
        Back.Round = 1;
        Back.Padding = 1;
        return Back;
    }

    /**
     * 白背景の設定を生成します。
     *
     * @returns 半透明白を使う背景設定です。
     */
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

