import { Generic, spatial } from './clsGeneric';
import { chvValue_on_twoValue, cstRectangle_Cross, point, rectangle } from './clsAttrData';
import { SpatialPointType } from './constants/legacyEnums';


const Add_or_Remove_Add_Obj = 1;
const Add_or_Remove_Remove_Obj = 2;

/**
 * 点判定結果として返す矩形オブジェクト集合です。
 */
interface GetRectInResult {
    number: number;
    Tags: (string | number)[];
    ObStac: number[];
}

/**
 * 空間インデックスへ登録できる座標入力形式です。
 */
type SpatialCoordinate =
    | point
    | { x: number; y: number; toPoint?: () => point }
    | { lat: number; lon: number; toPoint?: () => point };

/**
 * さまざまな座標型を point インスタンスへ正規化します。
 *
 * @param value 正規化対象の座標です。
 * @returns 複製済みまたは新規生成した point です。
 */
function normalizeSpatialCoordinate(value: SpatialCoordinate): point {
    if ('toPoint' in value && typeof value.toPoint === 'function') {
        return value.toPoint().Clone();
    }
    if ('x' in value && 'y' in value) {
        return new point(value.x, value.y);
    }
    return new point(value.lon, value.lat);
}

/**
 * 検索で見つかったオブジェクト番号、ポイント番号、タグを保持します。
 */
export class GetObjectPointTagInfo {
    ObjectNumber: number;
    PointNumber: number;
    Tag: string | number;
    
    /**
     * 検索結果情報を初期化します。
     *
     * @param ObjectNumber オブジェクト番号です。
     * @param PointNumber オブジェクト内のポイント番号です。
     * @param Tag オブジェクトに関連付くタグです。
     */
    constructor(ObjectNumber: number, PointNumber: number, Tag: string | number) {
        this.ObjectNumber = ObjectNumber;
        this.PointNumber = PointNumber;
        this.Tag = Tag;
    }
}

/**
 * メッシュセル内に登録されたオブジェクト参照を表します。
 */
class ObjectInfo {
    ObjectPointNumber: number; //オブジェクト内のポイント番号
    ObjectNumber: number; //メッシュ内のオブジェクト番号
    
    /**
     * メッシュセル用の参照情報を初期化します。
     *
     * @param ObjectNumber オブジェクト番号です。
     * @param ObjectPointNumber オブジェクト内のポイント番号です。
     */
    constructor(ObjectNumber: number, ObjectPointNumber: number) {
        this.ObjectPointNumber = ObjectPointNumber;
        this.ObjectNumber = ObjectNumber;
    }
}

/**
 * 各メッシュセルに属するオブジェクト一覧を保持します。
 */
class IndexContentsInfo {
    Num: number = 0; //メッシュ内のオブジェクト数
    ObjectNumber: ObjectInfo[] = [];
}

/**
 * 空間インデックスへ登録するオブジェクトの座標列とタグを保持します。
 */
class ObjectXYInfo {
    Pnum: number;
    Point: point[];
    Tag: string | number;
    RemoveF: boolean;
    
    /**
     * 登録オブジェクト情報を生成します。
     *
     * @param Pnum ポイント数です。
     * @param Point オブジェクトの座標列です。
     * @param Tag オブジェクトのタグです。
     * @param RemoveF 削除済みかどうかです。
     */
    constructor(Pnum: number, Point: SpatialCoordinate[], Tag: string | number, RemoveF: boolean) {
        this.Pnum = Pnum;
        this.Point = Point.map(normalizeSpatialCoordinate);
        this.Tag = Tag;
        this.RemoveF = RemoveF;
    }
}

/**
 * 点・線・矩形をメッシュ分割で検索する空間インデックス本体です。
 */
class SpatialIndexSearchInternal {
    private MeshIndex: (IndexContentsInfo | undefined)[][] = [];
    private XYSize: number = 0;
    private meshw: number = 0;
    private meshh: number = 0;
    private ObjectXY: ObjectXYInfo[] = [];
    private ObjectType: SpatialPointType;
    private MeshRect: rectangle = new rectangle();
    private AddEndF: boolean = false;
    private ObjectNum: number = 0;
    private ExtraRange: number = 0;
    private ExtraRangeF: boolean;
    private RectSetF: boolean = false;
    private LineCutNum: number = 0;

    /**
     * 既に point 型で保持している値を返します。
     *
     * @param value 対象座標です。
     * @returns 同じ point インスタンスです。
     */
    private toPointValue(value: point): point {
        return value;
    }
    
    /**
     * 空間インデックスを初期化します。
     *
     * @param ObjType 扱うオブジェクト種別です。
     * @param ExtraRangeFlag 点検索で大きさ付きポイントを扱うかどうかです。
     * @param Rect インデックス領域を固定する矩形です。
     * @param extraRangeSize 追加する検索余白です。
     */
    constructor(ObjType: SpatialPointType, ExtraRangeFlag: boolean, Rect?: rectangle, extraRangeSize?: number) {
        this.ObjectType = ObjType;
        this.ExtraRangeF = ExtraRangeFlag;
        
        if (typeof extraRangeSize !== 'undefined') {
            this.ExtraRange = extraRangeSize;
        }
        
        if (typeof Rect !== 'undefined') {
            this.RectSetF = true;
            this.MeshRect = this.BoxData_AddExtraRange(Rect);
        }
    }
    
    /**
     * 矩形に余白を加えた矩形を返します。
     *
     * @param pbox 元の矩形です。
     * @returns 余白分を拡張した矩形です。
     */
    private BoxData_AddExtraRange(pbox: rectangle): rectangle {
        //四角形に幅をプラスする
        const d = new rectangle();
        d.left = pbox.left - this.ExtraRange;
        d.right = pbox.right + this.ExtraRange;
        d.top = pbox.top - this.ExtraRange;
        d.bottom = pbox.bottom + this.ExtraRange;
        return d;
    }
    
    /**
     * 追加済みオブジェクトからメッシュ索引を構築します。
     */
    AddEnd(): void {
        if(this.ObjectNum===0) return;
        let n = 0;
        for (let i = 0; i < this.ObjectNum; i++) {
            n += this.ObjectXY[i].Pnum;
        }
        switch (this.ObjectType) {
            case SpatialPointType.SinglePoint:
                this.XYSize = Math.floor(Math.sqrt(n));
                if (this.ExtraRange === 0){ this.XYSize = this.XYSize * 2};
                break;
            case SpatialPointType.SPILine:
                this.XYSize = Math.floor(Math.sqrt(n) / 8);
                this.LineCutNum = Math.floor((n / this.ObjectNum));
                this.LineCutNum = Math.max(this.LineCutNum, 50);
                break;
            case SpatialPointType.SPIRect:
                this.XYSize = Math.floor(Math.sqrt(n));
                break;
        }
        this.XYSize = Math.max(this.XYSize, 2);
        this.MeshIndex = Array.from(
            { length: this.XYSize + 1 },
            () => new Array<IndexContentsInfo | undefined>(this.XYSize + 1)
        );

        if (this.RectSetF === false) {
            const firstPoint = this.toPointValue(this.ObjectXY[0].Point[0]);
            this.MeshRect.left = firstPoint.x;
            this.MeshRect.right = this.MeshRect.left;
            this.MeshRect.top = firstPoint.y;
            this.MeshRect.bottom = this.MeshRect.top;
            for (let i = 0; i < this.ObjectNum; i++) {
                for(let j=0; j<this.ObjectXY[i].Pnum; j++){
                    this.MeshRect=spatial.getCircumscribedRectangle(this.toPointValue(this.ObjectXY[i].Point[j]), this.MeshRect);
                }
            }
            this.BoxData_AddExtraRange(this.MeshRect);
        }

        if (this.MeshRect.left === this.MeshRect.right) {
            this.meshw = 1;
        }  else {
            this.meshw = (this.MeshRect.right - this.MeshRect.left) / this.XYSize;
        }
        if (this.MeshRect.top === this.MeshRect.bottom) {
            this.meshh = 1;
        } else {
            this.meshh = (this.MeshRect.bottom - this.MeshRect.top) / this.XYSize;
        }

        this.ExtraRange = Math.min(this.meshw, this.meshh, this.ExtraRange);


        for (let i = 0; i < this.ObjectNum; i++) {
            if (this.ObjectXY[i].RemoveF === false) {
                switch (this.ObjectType) {
                    case SpatialPointType.SinglePoint:
                        this.AddMeshPoint(i, Add_or_Remove_Add_Obj);
                        break;
                    case SpatialPointType.SPILine:
                        this.AddMeshLine(i);
                        break;
                    case SpatialPointType.SPIRect:
                        this.AddMeshRect(i, Add_or_Remove_Add_Obj);
                        break;
                }
            }
        }

        this.AddEndF = true;
    }

    /**
     * 登録領域を再計算してインデックスを再構築します。
     */
    Refresh(): void {
        this.RectSetF = false;
        this.AddEnd();
    }

    /**
     * 線オブジェクトを分割単位ごとにメッシュへ追加します。
     *
     * @param ObjNum 対象オブジェクト番号です。
     */
    private AddMeshLine(ObjNum: number): void {
        for (let i = 0; i < this.ObjectXY[ObjNum].Pnum; i += this.LineCutNum) {
            this.Add_Mesh_LineSub(ObjNum, i, Add_or_Remove_Add_Obj)
        }
    }

    /**
     * 線オブジェクトの一部区間をメッシュへ追加または削除します。
     *
     * @param ObjNum 対象オブジェクト番号です。
     * @param StartP 開始ポイント位置です。
     * @param AddorRemove 追加または削除の種別です。
     */
    private Add_Mesh_LineSub(ObjNum: number, StartP: number, AddorRemove: number): void {
        const oxy = this.ObjectXY[ObjNum];
        let ex = StartP + this.LineCutNum;
        if (oxy.Pnum < ex) {
            ex = oxy.Pnum;
        }
        let PBox = new rectangle(this.toPointValue(oxy.Point[0]));
        const RBox = new rectangle();
        for (let i = StartP; i < ex; i++) {
            PBox=spatial.getCircumscribedRectangle(this.toPointValue(oxy.Point[i]), PBox);
        }
        PBox=this.BoxData_AddExtraRange(PBox);
        const f = this.GetRangeXY(PBox, RBox);
        if (f === true) {
            for (let ii = RBox.left; ii <= RBox.right; ii++) {
                for (let j = RBox.top; j <= RBox.bottom; j++) {
                    switch (AddorRemove) {
                        case Add_or_Remove_Add_Obj:
                            this.Add_Mesh_PointSub(ii, j, ObjNum, StartP);
                            break;
                        case Add_or_Remove_Remove_Obj:
                            this.RemoveObject_sub(ii, j, ObjNum);
                            break;
                    }
                }
            }
        }
    }

    /**
     * 矩形オブジェクトをメッシュへ追加または削除します。
     *
     * @param ObjNum 対象オブジェクト番号です。
     * @param AddorRemove 追加または削除の種別です。
     */
    private AddMeshRect(ObjNum: number, AddorRemove: number): void {
        const PBox = this.BoxData_AddExtraRange(spatial.Get_Rectangle(this.toPointValue(this.ObjectXY[ObjNum].Point[0]), this.toPointValue(this.ObjectXY[ObjNum].Point[1])));
        const RBox = new rectangle();
        const f = this.GetRangeXY(PBox, RBox);
        if (f === true) {
            for (let i = RBox.left; i <= RBox.right; i++) {
                for (let j = RBox.top; j <= RBox.bottom; j++) {
                    switch (AddorRemove) {
                        case Add_or_Remove_Add_Obj:
                            this.Add_Mesh_PointSub(i, j, ObjNum, 0);
                            break;
                        case Add_or_Remove_Remove_Obj:
                            this.RemoveObject_sub(i, j, ObjNum);
                            break;
                    }
                }
            }
        }
    }

    /**
     * 点オブジェクトをメッシュへ追加または削除します。
     *
     * @param ObjNum 対象オブジェクト番号です。
     * @param AddorRemove 追加または削除の種別です。
     */
    private AddMeshPoint(ObjNum: number, AddorRemove: number): void {
        const oxy = this.ObjectXY[ObjNum];
        for (let k = 0; k < oxy.Pnum; k++) {
            if (this.ExtraRangeF === false) {
                //大きさのないポイントを追加
                const outXY=new point;
                const exf = this.GetConPointXY(this.toPointValue(oxy.Point[k]), outXY);
                if (exf === true) {
                    switch (AddorRemove) {
                        case Add_or_Remove_Add_Obj:
                            this.Add_Mesh_PointSub(outXY.x, outXY.y, ObjNum, k);
                            break;
                        case Add_or_Remove_Remove_Obj:
                            this.RemoveObject_sub(outXY.x, outXY.y, ObjNum);
                            break;
                    }
                }
            } else {
                //大きさのあるポイントを追加
                const RBox = new rectangle();
                const exf = this.GetExtraRange_XY(this.toPointValue(oxy.Point[k]), RBox)
                if (exf === true) {
                    for (let i = RBox.left; i <= RBox.right; i++) {
                        for (let j = RBox.top; j <= RBox.bottom; j++) {
                            switch (AddorRemove) {
                                case Add_or_Remove_Add_Obj:
                                    this.Add_Mesh_PointSub(i, j, ObjNum, k);
                                    break;
                                case Add_or_Remove_Remove_Obj:
                                    this.RemoveObject_sub(i, j, ObjNum);
                                    break;
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * 指定メッシュ座標にオブジェクト参照を登録します。
     *
     * @param X メッシュ X 座標です。
     * @param Y メッシュ Y 座標です。
     * @param ObjNum オブジェクト番号です。
     * @param Pointnum オブジェクト内ポイント番号です。
     */
    private Add_Mesh_PointSub(X: number, Y: number, ObjNum: number, Pointnum: number): void {
        if (typeof this.MeshIndex[X][Y] === "undefined"){
            this.MeshIndex[X][Y]  = new IndexContentsInfo();
        }
        const n = this.MeshIndex[X][Y].Num;
        this.MeshIndex[X][Y].ObjectNumber[n] = new ObjectInfo(ObjNum,Pointnum);
        this.MeshIndex[X][Y].Num++;
    }

    /**
     * 実座標をメッシュ座標へ変換し、領域内かを判定します。
     *
     * @param inXY 実座標です。
     * @param outXY 変換後のメッシュ座標出力先です。
     * @returns メッシュ領域内に収まる場合は true です。
     */
    private GetConPointXY(inXY: point, outXY: point): boolean {
        //メッシュ領域に入るかチェック
        outXY.x = Math.floor((inXY.x - this.MeshRect.left) / this.meshw);
        outXY.y = Math.floor((inXY.y - this.MeshRect.top) / this.meshh);
        if ((outXY.x < 0) || (outXY.y < 0) || (outXY.x > this.XYSize) || (outXY.y > this.XYSize)) {
            return false;
        }else{
            return true;
        }
    }

    /**
     * 点の周囲余白を含むメッシュ範囲を取得します。
     *
     * @param xy 基準点です。
     * @param OutPutRect メッシュ範囲の出力先です。
     * @returns 範囲がメッシュ領域と交差する場合は true です。
     */
    private GetExtraRange_XY(xy: point, OutPutRect: rectangle): boolean {
        const PBox = new rectangle();
        PBox.left = xy.x - this.ExtraRange;
        PBox.right = xy.x + this.ExtraRange;
        PBox.top = xy.y - this.ExtraRange;
        PBox.bottom = xy.y + this.ExtraRange;

        return this.GetRangeXY(PBox, OutPutRect);
    }

    /**
     * 実座標の矩形をメッシュ座標範囲へ変換します。
     *
     * @param InPBox 実座標での対象矩形です。
     * @param OutRBox メッシュ座標での矩形出力先です。
     * @returns メッシュ領域と交差する場合は true です。
     */
    private GetRangeXY(InPBox: rectangle, OutRBox: rectangle): boolean {
        if (spatial.Compare_Two_Rectangle_Position(InPBox, this.MeshRect) !== cstRectangle_Cross.cstOuter) {
            let x1 = Math.floor((InPBox.left - this.MeshRect.left) / this.meshw);
            let y1 = Math.floor((InPBox.top - this.MeshRect.top) / this.meshh);
            x1 = Generic.m_min_max(x1, 0, this.XYSize);
            y1 = Generic.m_min_max(y1, 0, this.XYSize);
            let x2 = Math.floor((InPBox.right - this.MeshRect.left) / this.meshw);
            let y2 = Math.floor((InPBox.bottom - this.MeshRect.top) / this.meshh);
            x2 = Generic.m_min_max(x2, 0, this.XYSize);
            y2 = Generic.m_min_max(y2, 0, this.XYSize);

            OutRBox.left = x1;
            OutRBox.right = x2;
            OutRBox.top = y1;
            OutRBox.bottom = y2;
            return true;
        } else {
            return false;
        }
    }

    /**
     * オブジェクトを登録配列へ追加し、必要なら索引へ反映します。
     *
     * @param Pnum ポイント数です。
     * @param XY 座標列です。
     * @param TagData タグ値です。
     */
    private Add_Point_Sub(Pnum: number, XY: SpatialCoordinate[], TagData: string | number): void {
        this.ObjectXY[this.ObjectNum] = new ObjectXYInfo(Pnum, XY, TagData,false);
        if (this.AddEndF === true) {
            switch (this.ObjectType) {
                case SpatialPointType.SinglePoint:
                    this.AddMeshPoint(this.ObjectNum, Add_or_Remove_Add_Obj);
                    break;
                case SpatialPointType.SPILine:
                    this.AddMeshLine(this.ObjectNum);
                    break;
                case SpatialPointType.SPIRect:
                    this.AddMeshRect(this.ObjectNum, Add_or_Remove_Add_Obj);
                    break;
            }
        }
        this.ObjectNum++;

    }

    /**
     * 複数点から成る点オブジェクトを追加します。
     *
     * @param Pnum 点数です。
     * @param XY 座標列です。
     * @param TagData タグ値です。
     */
    AddMultiPoint(Pnum: number, XY: SpatialCoordinate[], TagData: string | number): void {
        //複数地点オブジェクトを追加
        if (this.ObjectType !== SpatialPointType.SinglePoint) {
            alert("点以外はできません。");
            return;
        }
        this.Add_Point_Sub(Pnum, XY, TagData);
    }

    /**
     * 2 点から成る点オブジェクトを追加します。
     *
     * @param XY1 1 点目の座標です。
     * @param XY2 2 点目の座標です。
     * @param TagData タグ値です。
     */
    AddDoublePoint(XY1: SpatialCoordinate, XY2: SpatialCoordinate, TagData: string | number): void {
        //2地点オブジェクトを追加
        if (this.ObjectType !== SpatialPointType.SinglePoint) {
            alert("点以外はできません。");
            return;
        }
        const XY = [XY1, XY2];
        this.Add_Point_Sub(2, XY, TagData);
    }

    /**
     * 単一点オブジェクトを追加します。
     *
     * @param XY1 座標です。
     * @param TagData タグ値です。
     */
    AddSinglePoint(XY1: SpatialCoordinate, TagData: string | number): void {
        if (this.ObjectType !== SpatialPointType.SinglePoint) {
            alert("点以外はできません。");
            return;
        }
        const XY = new Array(XY1);
        this.Add_Point_Sub(1, XY, TagData);
    }

    /**
     * 単一点オブジェクトを配列から連続追加します。
     *
     * @param Num 追加件数です。
     * @param XY 座標配列です。
     * @param TagData タグ値です。
     */
    AddSinglePoint_Array(Num: number, XY: SpatialCoordinate[], TagData: string | number): void {
        //1地点オブジェクトを配列で追加
        if (this.ObjectType !== SpatialPointType.SinglePoint) {
            alert("点以外はできません。");
            return;
        }
        for (let i = 0; i < Num; i++) {
            const XYS = new Array(XY[i]);
            this.Add_Point_Sub(1, XYS, TagData);
        }
    }

    /**
     * 完全一致する単一点オブジェクトを 1 件検索します。
     *
     * @param x 検索 X 座標です。
     * @param y 検索 Y 座標です。
     * @returns 見つかったオブジェクト情報です。未検出時は ObjectNumber が -1 です。
     */
    GetSamePointNumber(x: number, y: number): GetObjectPointTagInfo {
        if (this.ObjectType !== SpatialPointType.SinglePoint) {
            alert("点以外はできません。");
            return  new GetObjectPointTagInfo(-1,0, 0); 
        }
        if ( this.ExtraRangeF === true){
            alert( "GetSamePointNumberは大きさのあるポイントには実装されていません。");
            return  new GetObjectPointTagInfo(-1,0, 0); 
        }
        if (this.ObjectNum === 0) {
            return  new GetObjectPointTagInfo(-1,0, 0); 
        }
        const XY = new point(x, y);
        const outXY = new point();
        const exf = this.GetConPointXY(XY, outXY);
        if (exf === false) { return new GetObjectPointTagInfo(-1, 0, 0); }
        let gn = -1;
        let PointNumber;
        let Tag;
        const meshxy = this.MeshIndex[outXY.x][outXY.y];
        if (meshxy !== undefined) {
            for (let i = 0; i < meshxy.Num; i++) {
                const n = meshxy.ObjectNumber[i].ObjectNumber;
                const np = meshxy.ObjectNumber[i].ObjectPointNumber;
                const Point = this.toPointValue(this.ObjectXY[n].Point[np]);
                if (Point.x === x) {
                    if (Point.y === y) {
                        gn = n;
                        PointNumber = np;
                        Tag = this.ObjectXY[n].Tag;
                        break;
                    }
                }
            }
        }
        return new GetObjectPointTagInfo(gn, PointNumber, Tag ?? "") ;
    }

    /**
     * 完全一致する単一点オブジェクトをすべて検索します。
     *
     * @param x 検索 X 座標です。
     * @param y 検索 Y 座標です。
     * @param SamePointData 検索結果を書き込む配列です。
     * @returns 一致件数です。未検索時は -1 を返します。
     */
    GetSamePointNumberArray(x: number, y: number, SamePointData: GetObjectPointTagInfo[]): number {
        if (this.ObjectType !== SpatialPointType.SinglePoint) {
            alert("点以外はできません。");
            return;
        }
        if (this.ExtraRangeF === true) {
            alert("GetSamePointNumberArrayは大きさのあるポイントには実装されていません。");
            return;
        }
        if (this.ObjectNum === 0) {
            return -1;
        }
        SamePointData.length = 0;
        const XY = new point(x, y);
        const outXY = new point;
        const exf = this.GetConPointXY(XY, outXY);
        if (exf === false) { return -1; }

        const meshxy = this.MeshIndex[outXY.x][outXY.y];
        for (let i = 0; i < meshxy.Num; i++) {
            const n = meshxy.ObjectNumber[i].ObjectNumber;
            const np = meshxy.ObjectNumber[i].ObjectPointNumber;
            const Point = this.toPointValue(this.ObjectXY[n].Point[np]);
            if (Point.x === x) {
                if (Point.y === y) {
                    SamePointData.push(new GetObjectPointTagInfo(n,np,this.ObjectXY[n].Tag));
                }
            }
        }
        return SamePointData.length;
    }

    /**
     * 指定位置に最も近い線分集合を検索します。
     *
     * @param x 検索 X 座標です。
     * @param y 検索 Y 座標です。
     * @param BaseDistance 探索の基準距離です。
     * @param _ExceptionNumber 現在は未使用の除外オブジェクト番号です。
     * @param _ExceptionTag 現在は未使用の除外タグです。
     * @returns 最短距離にある線分集合の情報です。
     */
    GetNearestLineNumber(x: number, y: number, BaseDistance: number, _ExceptionNumber: number, _ExceptionTag: string | number): { 
        Num: number; 
        ObjectPointNumber?: point[];
        Onumber?: number[]; 
        PNumber?: number[];
        Tags?: (string | number)[]; 
        NearestPoint?: point[];
        Distance?: number;
    } {
        
        if (this.ObjectType !== SpatialPointType.SPILine) {
            alert("線以外はできません。");
            return { Num:0 };
        }
        if (this.ObjectNum === 0) {
            return { Num:0 };
        }
        const XY = new point(x, y);
        const outXY = new point(x, y);
        const ObStac: number[] = [];
        const PStac: number[] = [];
        const NearP: point[] = [];
        const Tags: (string | number)[] = [];

        const exf = this.GetConPointXY(XY, outXY);
        if (exf === false) { return { Num:0 }; }

        let mind = Math.min(this.ExtraRange, BaseDistance);
        const meshxy = this.MeshIndex[outXY.x][outXY.y];
        if (meshxy !== undefined) {
            for (let i = 0; i < meshxy.Num; i++) {
                const Onum = meshxy.ObjectNumber[i].ObjectNumber;
                const SP = meshxy.ObjectNumber[i].ObjectPointNumber;
                let EP = SP + this.LineCutNum;
                if (this.ObjectXY[Onum].Pnum < EP) {
                    EP = this.ObjectXY[Onum].Pnum;
                }
                let thisMin = Math.min(this.ExtraRange, BaseDistance);
                let thisNearP: point | undefined;
                let thisNearObjPoint = -1;

                //線分集合ごとに最短距離を求める
                const oxy = this.ObjectXY[Onum];
                for (let j = SP; j < EP - 1; j++) {
                    const pt = this.toPointValue(oxy.Point[j]);
                    const ptNext = this.toPointValue(oxy.Point[j + 1]);
                    const retD = spatial.Distance_PointLine(x, y, pt.x, pt.y, ptNext.x, ptNext.y);
                    if (retD.distance < thisMin) {
                        thisMin = retD.distance;
                        thisNearP = retD.nearP;
                        thisNearObjPoint = j;
                    }
                }
                if ((thisMin <= mind) && (thisNearObjPoint !== -1) && thisNearP !== undefined) {
                    //線分集合の最短最小値がそれ以前の最短距離以下の場合
                    if (thisMin !== mind) {
                        ObStac.length = 0;
                        PStac.length = 0;
                        NearP.length = 0;
                        Tags.length = 0;
                    }
                    ObStac.push(Onum);
                    PStac.push(thisNearObjPoint);
                    NearP.push(thisNearP);
                    Tags.push(this.ObjectXY[Onum].Tag);
                    mind = thisMin;
                }
            }
        }
        const return_V = {
            ObjectPointNumber: NearP,
            Onumber: ObStac,
            PNumber: PStac,
            Tags: Tags,
            NearestPoint: NearP,
            Distance: mind,
            Num: PStac.length
        };
        return return_V;
    }

    /**
     * 指定位置の近傍にあるポイント群を検索します。
     *
     * @param x 検索 X 座標です。
     * @param y 検索 Y 座標です。
     * @param BaseDistance 探索の基準距離です。
     * @param ExceptionNumber 除外するオブジェクト番号です。
     * @param ExceptionTag 除外するタグ一覧です。
     * @returns 見つかったポイント群の情報です。
     */
    GetNearPointNumber(x: number, y: number, BaseDistance: number, ExceptionNumber: number = -1, ExceptionTag?: (string | number)[]): {num: number; Onumber?: number[]; PNumber?: number[]; Tags?: (string | number)[]; Distance?: number[]} {
        const ObStac: number[] = [];
        const PStac: number[] = [];
        const Distance: number[] = [];
        const Tags: (string | number)[] = [];
        if (this.ObjectType !== SpatialPointType.SinglePoint) {
            alert("点以外はできません。");
            return {num:ObStac.length, Onumber:ObStac,PNumber:PStac, Tags:Tags,Distance:Distance};
        }
        if (this.ExtraRangeF === false) {
            alert("GetNearPointNumberは大きさのないポイントには実装されていません。");
            return {num:ObStac.length, Onumber:ObStac,PNumber:PStac, Tags:Tags,Distance:Distance};
        }
        if (this.ObjectNum === 0) {
            return {num:ObStac.length, Onumber:ObStac,PNumber:PStac, Tags:Tags,Distance:Distance};
        }
        const exceptionTags: (string | number)[] = ExceptionTag ?? [];
        const XY = new point(x, y);
        const outXY = new point;
        const exf = this.GetConPointXY(XY, outXY);
        if (exf === false) { return {num:0} }

        const mind  = Math.min(this.ExtraRange, BaseDistance);
        const mi = this.MeshIndex[outXY.x][outXY.y];
        if (mi !== undefined) {
            for (let i = 0; i < mi.ObjectNumber.length; i++) {
                const n = mi.ObjectNumber[i].ObjectNumber;
                const np = mi.ObjectNumber[i].ObjectPointNumber;
                if ((n !== ExceptionNumber) && (exceptionTags.indexOf(this.ObjectXY[n].Tag) === -1)) {
                    const op = this.toPointValue(this.ObjectXY[n].Point[np]);
                    const D = spatial.Distance(x, y, op.x, op.y);
                    if (D < mind) {
                        Distance.push(D);
                        ObStac.push(n);
                        PStac.push(np);
                        Tags.push(this.ObjectXY[n].Tag);
                    }
                }
            }
        }
        return {num:ObStac.length, Onumber:ObStac,PNumber:PStac, Tags:Tags,Distance:Distance}
    }

    /**
     * 指定位置に最も近いポイントまでの距離を返します。
     *
     * @param x 検索 X 座標です。
     * @param y 検索 Y 座標です。
     * @param BaseDistance 探索の基準距離です。
     * @param ExceptionNumber 除外するオブジェクト番号です。
     * @param ExceptionTag 除外するタグまたはタグ配列です。
     * @returns 最短距離です。対象なしの場合は -1、領域外では 0 または undefined を返します。
     */
    GetNearestPointNumber(x: number, y: number, BaseDistance: number, ExceptionNumber: number, ExceptionTag?: string | number | (string | number)[]): number | undefined {
        const NearestPointData: GetObjectPointTagInfo[] = [];
        if (this.ObjectType !== SpatialPointType.SinglePoint) {
            alert("点以外はできません。");
            return;
        }
        if (this.ExtraRangeF === false) {
            alert("GetNearestPointNumberは大きさのないポイントには実装されていません。");
            return;
        }
        if (this.ObjectNum === 0) {
            return -1;
        }
        const exceptionTags: (string | number)[] = ExceptionTag === undefined
            ? []
            : (Array.isArray(ExceptionTag) ? ExceptionTag : [ExceptionTag]);
        const XY = new point(x, y);
        const outXY = new point;
        const exf = this.GetConPointXY(XY, outXY);
        if (exf === false) { return 0  }

        let mind = Math.min(this.ExtraRange, BaseDistance);
        let o_mind = mind - 1;
        const meshxy = this.MeshIndex[outXY.x][outXY.y];
        if (meshxy !== undefined) {
            for (let i = 0; i < meshxy.Num; i++) {
                const n = meshxy.ObjectNumber[i].ObjectNumber;
                const np = meshxy.ObjectNumber[i].ObjectPointNumber;
                if ((n !== ExceptionNumber) && (exceptionTags.indexOf(this.ObjectXY[n].Tag) === -1)) {
                    const Point = this.toPointValue(this.ObjectXY[n].Point[np]);
                    const D = spatial.Distance(x, y, Point.x, Point.y);
                    if (D <= mind) {
                        if (D !== o_mind) {
                            NearestPointData.length = 0;
                        }
                        NearestPointData.push(new GetObjectPointTagInfo(n, np, this.ObjectXY[n].Tag));
                        mind = D;
                        o_mind = mind;
                    }
                }
            }
        }
        return mind;
    }

    /**
     * 指定点を含む矩形オブジェクト群を取得します。
     *
     * @param x 検索 X 座標です。
     * @param y 検索 Y 座標です。
     * @returns 含有矩形一覧です。対象なしまたは不正種別では 0 を返します。
     */
    GetRectIn(x: number, y: number): GetRectInResult | 0 {
        if (this.ObjectType !== SpatialPointType.SPIRect) {
            alert("四角以外はできません。");
            return 0;
        }
        if (this.ObjectNum === 0) {
            return 0;
        }

        const XY = new point();
        const sp = new point();
        XY.x = x;
        XY.y = y;
        const exf = this.GetConPointXY(XY, sp);
        if (exf === false) {
            return 0;
        }

        let same_N = 0;
        const ObStac: number[] = [];
        const MI = this.MeshIndex[sp.x][sp.y];
        if (MI !== undefined) {
            for (let i = 0; i < MI.ObjectNumber.length;i++) {
                const n = MI.ObjectNumber[i].ObjectNumber;
                const Ob = this.ObjectXY[n];
                const PBox= spatial.Get_Rectangle(this.toPointValue(Ob.Point[0]), this.toPointValue(Ob.Point[1]));
                if (spatial.Check_PointInBox(new point(x, y), 0, PBox) === true) {
                    ObStac.push(n);
                    same_N++;
                }
            }
        }
        const Tags: (string | number)[] = new Array<string | number>(same_N);
        for (let i = 0; i < same_N; i++) {
            Tags[i] = this.ObjectXY[ObStac[i]].Tag as (string | number);
        }
        return {number:same_N,Tags:Tags,ObStac:ObStac}

        }

    /**
     * 指定オブジェクトを検索インデックスから削除します。
     *
     * @param Number 削除するオブジェクト番号です。
     */
    RemoveObject(Number: number): void {
        this.ObjectXY[Number].RemoveF = true;
        switch (this.ObjectType) {
            case SpatialPointType.SinglePoint:
                this.AddMeshPoint(Number, Add_or_Remove_Remove_Obj);
                break;
            case SpatialPointType.SPILine:
                for (let i = 0; i < this.ObjectXY[Number].Pnum;i+=this.LineCutNum){
                    this.Add_Mesh_LineSub(Number, i, Add_or_Remove_Remove_Obj);
                }
                break;
            case SpatialPointType.SPIRect:
                this.AddMeshRect(Number, Add_or_Remove_Remove_Obj);
                break;
        }
    }

    /**
     * 指定メッシュセルからオブジェクト参照を 1 件削除します。
     *
     * @param x メッシュ X 座標です。
     * @param y メッシュ Y 座標です。
     * @param Number 削除対象オブジェクト番号です。
     */
    private RemoveObject_sub(x: number, y: number, Number: number): void {
        const meshxy = this.MeshIndex[x][y];
        let i = -1;
        do {
           i ++;
        } while (meshxy.ObjectNumber[i].ObjectNumber !== Number)
        //for (j = i + 1;j<meshxy.Num;j++){ '配列をつめる
        //    meshxy.ObjectNumber[j-1]=meshxy.ObjectNumber[j]
        //}
        //meshxy.ObjectNumber.splice(i, 1)メソッドもあるがはやくない
        meshxy.ObjectNumber[i] = meshxy.ObjectNumber[meshxy.Num - 1]//配列最後と入れ替える
        meshxy.Num--;
    }

    /**
     * 指定タグに一致するすべてのオブジェクトを削除します。
     *
     * @param TagNumber 削除対象のタグ値です。
     */
    RemoveObject_byTag(TagNumber: string | number): void {
        //指定したタグのオブジェクトの検索インデックスを削除
        for (let i = 0; i < this.ObjectNum; i++) {
            if (this.ObjectXY[i].Tag === TagNumber) {
                if (this.ObjectXY[i].RemoveF === false) {
                    this.RemoveObject(i);
                }
            }
        }
    }

    /**
     * 線オブジェクトを追加します。
     *
     * @param Pnum ポイント数です。
     * @param XY 座標列です。
     * @param TagData タグ値です。
     */
    AddLine(Pnum: number, XY: SpatialCoordinate[], TagData: string | number): void {
        //線オブジェクト追加
        if (this.ObjectType !== SpatialPointType.SPILine) {
            alert("線以外はできません。");
            return;
        }
        this.Add_Point_Sub(Pnum, XY , TagData);
    }

    /**
     * 指定範囲に入る数値タグを一括変換します。
     *
     * @param ChangeValue 加算する値です。
     * @param StartRangeValue 範囲開始値です。
     * @param LastRangeValue 範囲終了値です。
     */
    ChangeTagValue(ChangeValue: number, StartRangeValue: number, LastRangeValue: number): void {
        //タグの値を変化させる
        for (let i = 0; i < this.ObjectNum; i++) {
            const tagNum = Number(this.ObjectXY[i].Tag);
            if (Generic.Check_Two_Value_In(tagNum, StartRangeValue, LastRangeValue) !== chvValue_on_twoValue.chvOuter) {
                this.ObjectXY[i].Tag = tagNum + ChangeValue;
            }
        }
    }

    /**
     * 矩形オブジェクトを追加します。
     *
     * @param xy1Rectangle 左上点または矩形です。
     * @param xy2TagData 右下点またはタグ値です。
     * @param TagData point 指定時のタグ値です。
     */
    AddRect(xy1Rectangle: point | rectangle, xy2TagData: latlon | string | number, TagData?: string | number): void {
        //四角オブジェクト追加
        if (this.ObjectType !== SpatialPointType.SPIRect) {
            alert("四角以外はできません。");
            return;
        }
        if ((xy1Rectangle instanceof point) === true) {
            const XY = [(xy1Rectangle as point).toLatlon(), (xy2TagData as latlon)];
            this.Add_Point_Sub(2, XY, TagData);
        } else {
            const rect = xy1Rectangle as rectangle;
            const XY: latlon[] = [
                new point(rect.left, rect.top).toLatlon(),
                new point(rect.right, rect.bottom).toLatlon()
            ];
            this.Add_Point_Sub(2, XY, xy2TagData as string | number);
        }
    }


}

/**
 * 点・線・矩形の近傍検索を行う空間インデックス実装です。
 */
export { SpatialIndexSearchInternal as SpatialIndexSearch };
