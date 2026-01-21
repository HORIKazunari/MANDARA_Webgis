import { Generic } from './clsGeneric';


const Add_or_Remove_Add_Obj = 1;
const Add_or_Remove_Remove_Obj = 2;

interface GetRectInResult {
    number: number;
    Tags: (string | number)[];
    ObStac: number[];
}

class GetObjectPointTagInfo {
    ObjectNumber: number;
    PointNumber: number;
    Tag: string | number;
    
    constructor(ObjectNumber: number, PointNumber: number, Tag: string | number) {
        this.ObjectNumber = ObjectNumber;
        this.PointNumber = PointNumber;
        this.Tag = Tag;
    }
}

class ObjectInfo {
    ObjectPointNumber: number; //オブジェクト内のポイント番号
    ObjectNumber: number; //メッシュ内のオブジェクト番号
    
    constructor(ObjectNumber: number, ObjectPointNumber: number) {
        this.ObjectPointNumber = ObjectPointNumber;
        this.ObjectNumber = ObjectNumber;
    }
}

class IndexContentsInfo {
    Num: number = 0; //メッシュ内のオブジェクト数
    ObjectNumber: ObjectInfo[] = [];
}

class ObjectXYInfo {
    Pnum: number;
    Point: latlon[];
    Tag: string | number;
    RemoveF: boolean;
    
    constructor(Pnum: number, Point: latlon[], Tag: string | number, RemoveF: boolean) {
        this.Pnum = Pnum;
        this.Point = Generic.ArrayClone(Point);
        this.Tag = Tag;
        this.RemoveF = RemoveF;
    }
}

class SpatialIndexSearchInternal {
    /// <summary>空間インデックス</summary>
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
    
    private BoxData_AddExtraRange(pbox: rectangle): rectangle {
        //四角形に幅をプラスする
        const d = new rectangle();
        d.left = pbox.left - this.ExtraRange;
        d.right = pbox.right + this.ExtraRange;
        d.top = pbox.top - this.ExtraRange;
        d.bottom = pbox.bottom + this.ExtraRange;
        return d;
    }
    
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
        this.MeshIndex = Generic.Array2Dimension(this.XYSize + 1, this.XYSize + 1);

        if (this.RectSetF === false) {
            const firstPoint = this.ObjectXY[0].Point[0].toPoint();
            this.MeshRect.left = firstPoint.x;
            this.MeshRect.right = this.MeshRect.left;
            this.MeshRect.top = firstPoint.y;
            this.MeshRect.bottom = this.MeshRect.top;
            for (let i = 0; i < this.ObjectNum; i++) {
                for(let j=0; j<this.ObjectXY[i].Pnum; j++){
                    this.MeshRect=spatial.getCircumscribedRectangle(this.ObjectXY[i].Point[j].toPoint(), this.MeshRect);
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
    Refresh(): void {
        this.RectSetF = false;
        this.AddEnd();
    }
    private AddMeshLine(ObjNum: number): void {
        for (let i = 0; i < this.ObjectXY[ObjNum].Pnum; i += this.LineCutNum) {
            this.Add_Mesh_LineSub(ObjNum, i, Add_or_Remove_Add_Obj)
        }
    }
    private Add_Mesh_LineSub(ObjNum: number, StartP: number, AddorRemove: number): void {
        const oxy = this.ObjectXY[ObjNum];
        let ex = StartP + this.LineCutNum;
        if (oxy.Pnum < ex) {
            ex = oxy.Pnum;
        }
        let PBox = new rectangle(oxy.Point[0].toPoint());
        const RBox = new rectangle();
        for (let i = StartP; i < ex; i++) {
            PBox=spatial.getCircumscribedRectangle(oxy.Point[i].toPoint(), PBox);
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
    private AddMeshRect(ObjNum: number, AddorRemove: number): void {
        const PBox = this.BoxData_AddExtraRange(spatial.Get_Rectangle(this.ObjectXY[ObjNum].Point[0].toPoint(), this.ObjectXY[ObjNum].Point[1].toPoint()));
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
    private AddMeshPoint(ObjNum: number, AddorRemove: number): void {
        const oxy = this.ObjectXY[ObjNum];
        for (let k = 0; k < oxy.Pnum; k++) {
            if (this.ExtraRangeF === false) {
                //大きさのないポイントを追加
                const outXY=new point;
                const exf = this.GetConPointXY(oxy.Point[k].toPoint(), outXY);
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
                const exf = this.GetExtraRange_XY(oxy.Point[k].toPoint(), RBox)
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

    private Add_Mesh_PointSub(X: number, Y: number, ObjNum: number, Pointnum: number): void {
        if (typeof this.MeshIndex[X][Y] === "undefined"){
            this.MeshIndex[X][Y]  = new IndexContentsInfo();
        }
        const n = this.MeshIndex[X][Y].Num;
        this.MeshIndex[X][Y].ObjectNumber[n] = new ObjectInfo(ObjNum,Pointnum);
        this.MeshIndex[X][Y].Num++;
    }

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

    private GetExtraRange_XY(xy: point, OutPutRect: rectangle): boolean {
        const PBox = new rectangle();
        PBox.left = xy.x - this.ExtraRange;
        PBox.right = xy.x + this.ExtraRange;
        PBox.top = xy.y - this.ExtraRange;
        PBox.bottom = xy.y + this.ExtraRange;

        return this.GetRangeXY(PBox, OutPutRect);
    }

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
    private Add_Point_Sub(Pnum: number, XY: latlon[], TagData: string | number): void {
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
    AddMultiPoint(Pnum: number, XY: latlon[], TagData: string | number): void {
        //複数地点オブジェクトを追加
        if (this.ObjectType !== SpatialPointType.SinglePoint) {
            alert("点以外はできません。");
            return;
        }
        this.Add_Point_Sub(Pnum, XY, TagData);
    }
    AddDoublePoint(XY1: latlon, XY2: latlon, TagData: string | number): void {
        //2地点オブジェクトを追加
        if (this.ObjectType !== SpatialPointType.SinglePoint) {
            alert("点以外はできません。");
            return;
        }
        const XY = [XY1, XY2];
        this.Add_Point_Sub(2, XY, TagData);
    }

    AddSinglePoint(XY1: latlon, TagData: string | number): void {
        /// <signature>
        /// <summary>地点オブジェクトを追加</summary>
        /// <returns type="Number" >同じ値の数</returns>
        /// </signature> 
        if (this.ObjectType !== SpatialPointType.SinglePoint) {
            alert("点以外はできません。");
            return;
        }
        const XY = new Array(XY1);
        this.Add_Point_Sub(1, XY, TagData);
    }
    AddSinglePoint_Array(Num: number, XY: latlon[], TagData: string | number): void {
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

    GetSamePointNumber(x: number, y: number): GetObjectPointTagInfo {
        /// <signature>
        /// <summary>同じ地点を求め、番号を返す 存在しない場合は-1を返す</summary>
        /// <returns type="Number" >同じ値の数</returns>
        /// </signature> 
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
                const Point = this.ObjectXY[n].Point[np].toPoint();
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

    GetSamePointNumberArray(x: number, y: number, SamePointData: GetObjectPointTagInfo[]): number {
        /// <signature>
        /// <summary>同じ地点を求め、番号を返す 存在しない場合は-1か0を返す</summary>
        /// <param name="SamePointData" >GetObjectPointTagInfoの配列、オブジェクト番号、オブジェクト-ポイント番号、タグ（戻り値）</param>
        /// <returns type="Number" >同じ地点の数</returns>
        /// </signature> 

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
            const Point = this.ObjectXY[n].Point[np].toPoint();
            if (Point.x === x) {
                if (Point.y === y) {
                    SamePointData.push(new GetObjectPointTagInfo(n,np,this.ObjectXY[n].Tag));
                }
            }
        }
        return SamePointData.length;
    }

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
        const ObStac=[];
        const PStac=[];
        const NearP=[];
        const Tags=[];

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
                let thisNearP;
                let thisNearObjPoint = -1;

                //線分集合ごとに最短距離を求める
                const oxy = this.ObjectXY[Onum];
                for (let j = SP; j < EP - 1; j++) {
                    const pt = oxy.Point[j].toPoint();
                    const ptNext = oxy.Point[j + 1].toPoint();
                    const retD = spatial.Distance_PointLine(x, y, pt.x, pt.y, ptNext.x, ptNext.y);
                    if (retD.distance < thisMin) {
                        thisMin = retD.distance;
                        thisNearP = retD.nearP;
                        thisNearObjPoint = j;
                    }
                }
                if ((thisMin <= mind) && (thisNearObjPoint !== -1)) {
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

    //近い地点を返す、数と番号（配列）を返す（複数出力） 存在しない場合は-1を返す
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
        if(ExceptionTag===undefined){
            ExceptionTag=[];
        }
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
                if ((n !== ExceptionNumber) && ((ExceptionTag.indexOf(this.ObjectXY[n].Tag) === -1))) {
                    const op = this.ObjectXY[n].Point[np].toPoint();
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

    GetNearestPointNumber(x: number, y: number, BaseDistance: number, ExceptionNumber: number, ExceptionTag?: string | number | (string | number)[]): number | undefined {
        /// <signature>
        /// <summary>最も近い地点を求め、数と番号（配列）を返す（複数出力） 存在しない場合は-1を返す</summary>
        /// <param name="BaseDistance" >基準となる距離</param>
        /// <param name="NearestPointData" >最も近い地点の配列(戻り値)</param>
        /// <param name="ExceptionNumber" >対象から除外するオブジェクト番号</param>
        /// <param name="ExceptionTag" >対象から除外するタグ</param>
        /// <returns type="Number" >同じ値の数</returns>
        /// </signature> 
        const NearestPointData=[];
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
        if(ExceptionTag===undefined){
            ExceptionTag=[];
        }
        const XY = new point(x, y);
        const outXY = new point;
        const exf = this.GetConPointXY(XY, outXY);
        if (exf === false) { return {num:0}  }

        let mind = Math.min(this.ExtraRange, BaseDistance);
        let o_mind = mind - 1;
        const meshxy = this.MeshIndex[outXY.x][outXY.y];
        if (meshxy !== undefined) {
            for (let i = 0; i < meshxy.Num; i++) {
                const n = meshxy.ObjectNumber[i].ObjectNumber;
                const np = meshxy.ObjectNumber[i].ObjectPointNumber;
                if ((n !== ExceptionNumber) && (this.ObjectXY[n].Tag !== ExceptionTag)) {
                    const Point = this.ObjectXY[n].Point[np].toPoint();
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
        return {mind:mind,num:NearestPointData.length,NearestPointData: NearestPointData};
    }

    //指定した点が入る四角領域を取得
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
        const ObStac = [];
        const MI = this.MeshIndex[sp.x][sp.y];
        if (MI !== undefined) {
            for (let i = 0; i < MI.ObjectNumber.length;i++) {
                const n = MI.ObjectNumber[i].ObjectNumber;
                const Ob = this.ObjectXY[n];
                const PBox= spatial.Get_Rectangle(Ob.Point[0].toPoint(), Ob.Point[1].toPoint());
                if (spatial.Check_PointInBox(new point(x, y), 0, PBox) === true) {
                    ObStac.push(n);
                    same_N++;
                }
            }
        }
        const Tags = new Array(same_N);
        for (let i = 0; i < same_N; i++) {
            Tags[i] = this.ObjectXY[ObStac[i]].Tag;
        }
        return {number:same_N,Tags:Tags,ObStac:ObStac}

        }

    RemoveObject(Number: number): void {
        /// <signature>
        /// <summary>指定したオブジェクト番号を検索インデックスから削除</summary>
        /// <param name="Number" >オブジェクト番号</param>
        /// </signature> 

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

    AddLine(Pnum: number, XY: latlon[], TagData: string | number): void {
        //線オブジェクト追加
        if (this.ObjectType !== SpatialPointType.SPILine) {
            alert("線以外はできません。");
            return;
        }
        this.Add_Point_Sub(Pnum, XY , TagData);
    }

    ChangeTagValue(ChangeValue: number, StartRangeValue: number, LastRangeValue: number): void {
        //タグの値を変化させる
        for (let i = 0; i < this.ObjectNum; i++) {
            const tagNum = Number(this.ObjectXY[i].Tag);
            if (Generic.Check_Two_Value_In(tagNum, StartRangeValue, LastRangeValue) !== (chvOuter as unknown as number)) {
                this.ObjectXY[i].Tag = tagNum + ChangeValue;
            }
        }
    }

    AddRect(XY1_rectangle: point | rectangle, XY2_TagData: latlon | string | number, TagData?: string | number): void {
        //四角オブジェクト追加
        if (this.ObjectType !== SpatialPointType.SPIRect) {
            alert("四角以外はできません。");
            return;
        }
        if ((XY1_rectangle instanceof point) === true) {
            const XY = [(XY1_rectangle as point).toLatlon(), (XY2_TagData as latlon)];
            this.Add_Point_Sub(2, XY, TagData);
        } else {
            const rect = XY1_rectangle as rectangle;
            const XY: latlon[] = [
                new point(rect.left, rect.top).toLatlon(),
                new point(rect.right, rect.bottom).toLatlon()
            ];
            this.Add_Point_Sub(2, XY, XY2_TagData as string | number);
        }
    }


}

export { SpatialIndexSearchInternal as SpatialIndexSearch };
