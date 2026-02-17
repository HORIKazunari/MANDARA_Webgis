
import { SortingSearch } from './SortingSearch';
import { SpatialIndexSearch } from './SpatialIndexSearch';
import { Generic } from './clsGeneric';
import { chvValue_on_twoValue } from './clsAttrData';

type MeshCell = number | undefined;
type MeshGrid = MeshCell[][];
type MortonIndex = number;
type PartitionCounter = [number];

class FringeLineInfo {
    code: number = 0;
    direction: 1 | -1 = 1;
}


class ConPartInfo {
    p0 = new point();
    p1 = new point();
}

class ContourLineStackInfo {
    ContourNumber: number;
    NumOfPoint: number;
    points: point[] = [];
    
    constructor(ContourNumber: number, NumOfPoint: number) {
        this.ContourNumber = ContourNumber;
        this.NumOfPoint = NumOfPoint;
    }
}

class QuadMeshInfo {
    /// <summary>四分木データの配列に入れる情報</summary>
    Position: rectangle | MortonIndex | null; // rectinfo or number
    Max: number | undefined;
    Min: number | undefined;
    LackF: boolean;
    
    constructor(Positon: rectangle | MortonIndex | null, Max: number | undefined, Min: number | undefined, LackF: boolean) {
        this.Position = Positon;
        this.Max = Max;
        this.Min = Min;
        this.LackF = LackF;
    }
}

class MeshContour {
    /// <summary>メッシュ作成クラス</summary>
    private ConValuePlus = 0.0001;
    private Quad_MeshData: QuadMeshInfo[] = [];
    private PCell: MortonIndex[] = [];
    private XMeshNum: number;
    private YMeshNum: number;
    private XMeshSize: number;
    private YMeshSize: number;
    private Xplus: number;
    private Yplus: number;
    private Mesh: MeshGrid;
    
    constructor(xMeshNum: number, yMeshNum: number, xMeshSize: number, yMeshSize: number, xPlus: number, yPlus: number) {
        this.XMeshNum = xMeshNum;
        this.YMeshNum = yMeshNum;
        this.XMeshSize = xMeshSize;
        this.YMeshSize = yMeshSize;
        this.Xplus = xPlus;
        this.Yplus = yPlus;
        this.Mesh = Array.from({ length: xMeshNum }, () => new Array<MeshCell>(yMeshNum));
    }
    
    SetMeshValue(x: number, y: number, Value: number): void {
        this.Mesh[x][y] = Value;
    }
    
    GetMeshValue(x: number, y: number): number {
        return this.Mesh[x][y];
    }
    
    Execute_Mesh(ContourNum: number, contourHighM: number[], conLineStack: ContourLineStackInfo[]): number {
        /// <signature>
        /// <summary>等値線取得、戻り値は等値線ラインの数</summary>
        /// <param name="ContourNum" >取得する等値線の数</param>
        /// <param name="Contour_High_M" >等値線値</param>
        /// <param name="Contour_Line" >等値線ごとの等値線番号、ポイント数、座標contourLineStacInfo(戻り値)</param>
        /// </signature> 

        //'出力
        //'戻り値：線の数
        //'Con_LineStac() (0)等高線番号 (1)点スタックの始め (2)点の数 線の数分繰り返す
        //'Con_Point() xy座標

        const hn = ContourNum;
        const High_M = contourHighM;
        const maxPartitionLevel = this.Get_PartitiopnLevel(this.XMeshNum, this.YMeshNum);
        const highCN: number[] = new Array<number>(hn).fill(0); // 等値線の値ごとの等値線部分線分数
        const con: ConPartInfo[][] = Array.from({ length: hn }, (): ConPartInfo[] => []);
        conLineStack.length = 0; // ContourLineStackInfo
  
        //等値線計算中1
         this.Set_MeshQuadTree(this.Mesh, this.XMeshNum, this.YMeshNum, maxPartitionLevel);//線形四分木データをQuad_MeshDataに作成
         const n: PartitionCounter = [0];
         for (let k = 0; k < hn; k++) {
            const High = High_M[k] + this.ConValuePlus;
            this.Get_Quad_MeshCell(High, this.PCell, 0, 0, n, maxPartitionLevel);//Quad_MeshDataから該当するメッシュの範囲を取得
            for (let i = 0; i < n[0]; i++) {
                const rect = this.Quad_MeshData[this.PCell[i]].Position as rectangle;
                for (let j = rect.left; j <= rect.right; j++) {
                    for (let k2 = rect.top; k2 <= rect.bottom; k2++) {
                        if(typeof this.Mesh[j][k2] !== 'undefined') {
                            this.Mesh_Sub(con, this.Mesh, j, k2, k, High, highCN);
                        }
                    }
                }
            }
        }
        //等値線計算中2、バラバラの等高線線分を結合する
        let all_Pon = 0;
        for (let i = 0; i < hn; i++) {
            const NL = highCN[i];
            if (0 < NL) {
                const PointIndex = new SpatialIndexSearch(SpatialPointType.SinglePoint, false, new rectangle(0, this.XMeshNum, 0, this.YMeshNum));
                const Arrange_LineCode = Array.from({ length: NL + 1 }, () => [0, 0]);
                const Fringe = Array.from({ length: NL + 1 }, () => new FringeLineInfo());
                const Get_Linef = Array.from({ length: NL + 1 }, () => false);
                for (let j = 0; j < NL; j++) {
                    PointIndex.AddDoublePoint(con[i][j].p0.toLatlon(), con[i][j].p1.toLatlon(), j);
                }
                PointIndex.AddEnd();
                let fnl = 0;
                let Pon = 0;
                let Contf = false;
                let stxy = new point();
                let exy = new point();
                let Reverse_f=false;
                while (fnl < NL) {
                    let js = 0;
                    if (Contf === false) {
                        for (let j = 0; j < NL; j++) {
                            //始点の探索
                            if (Get_Linef[j] === false) {
                                Arrange_LineCode[Pon][0] = fnl;
                                Arrange_LineCode[Pon][1] = 1;
                                Get_Linef[j] = true;
                                Fringe[fnl].code = j;
                                Fringe[fnl].direction = 1;
                                fnl++;
                                stxy = con[i][j].p0.Clone();
                                exy = con[i][j].p1.Clone();
                                PointIndex.RemoveObject(j);
                                Reverse_f = false;
                                js = j;
                                break;
                            }
                        }
                    }
                    Contf = false;
                    //始点Xチェック
                    const LineNO2 = PointIndex.GetSamePointNumber(exy.x, exy.y);
                    if (LineNO2.ObjectNumber !== -1) {
                        const PointTag = LineNO2.Tag as number;
                        Contf = true;
                        Get_Linef[PointTag] = true;
                        Arrange_LineCode[Pon][1]++;
                        Fringe[fnl].code = PointTag;
                        if (LineNO2.PointNumber === 0) {
                            exy = con[i][PointTag].p1.Clone();
                            Fringe[fnl].direction = 1; //順方向
                        } else {
                            exy = con[i][PointTag].p0.Clone();
                            Fringe[fnl].direction = -1; //逆方向
                        }
                        PointIndex.RemoveObject(PointTag);
                        fnl++;
                    }
                    if (exy.Equals(stxy) === true) {
                        Contf = false;
                        Pon++;
                    } else {
                        if (Contf === false) {
                            if (Reverse_f === false) {
                                //始点も終点もチェックしてない場合は、初期の始点と終点を入れ替えて繰り返す
                                Reverse_f = true;
                                    const k2 = Arrange_LineCode[Pon][0];
                                    const Kn = Arrange_LineCode[Pon][1];
                                const Fringe_Sub = Array.from({ length: Kn }, () => new FringeLineInfo());
                                for (let k = 0; k < Kn; k++) {
                                    Fringe_Sub[k].code = Fringe[k2 + k].code;
                                    Fringe_Sub[k].direction = Fringe[k2 + k].direction;
                                }
                                for (let k = 0 ; k < Kn; k++) {
                                    Fringe[k2 + k].code = Fringe_Sub[Kn - k - 1].code;
                                    Fringe[k2 + k].direction = Fringe_Sub[Kn - k - 1].direction === 1 ? -1 : 1;
                                }
                                stxy = con[i][js].p1.Clone();
                                exy = con[i][js].p0.Clone();
                                Contf = true;
                            } else {
                                Contf = false;
                                Pon++;
                            }
                        }
                    }
                }

                if (Contf === true) {
                    Pon++;
                }
                for (let j = 0; j < Pon; j++) {
                    conLineStack[all_Pon + j] = new ContourLineStackInfo(i, Arrange_LineCode[j][1] + 1);
                    const k2 = Arrange_LineCode[j][0];
                    const fk2 = Fringe[k2];
                    if (fk2.direction === 1) {
                        conLineStack[all_Pon + j].points.push(con[i][fk2.code].p0.Clone(), con[i][fk2.code].p1.Clone());
                    } else {
                        conLineStack[all_Pon + j].points.push(con[i][fk2.code].p1.Clone(), con[i][fk2.code].p0.Clone());
                    }
                    for (let k = 1; k < Arrange_LineCode[j][1]; k++) {
                        const fk2 = Fringe[k2 + k];
                        if (fk2.direction === 1) {
                            conLineStack[all_Pon + j].points.push(con[i][fk2.code].p1.Clone());
                        } else {
                            conLineStack[all_Pon + j].points.push(con[i][fk2.code].p0.Clone());
                        }
                    }
                }
                all_Pon += Pon;
            }
        }
        for (let i = 0; i < all_Pon; i++) {
            for (let j = 0; j < conLineStack[i].NumOfPoint; j++) {
                    const cp = conLineStack[i].points[j];
                cp.x = this.Xplus + cp.x / (this.XMeshNum - 1) * this.XMeshSize;
                cp.y = this.Yplus + cp.y / (this.YMeshNum - 1) * this.YMeshSize;
            }

        }
        return all_Pon;

    }

    Execute_FrameGet(GetSide: number, ContourNum: number, contourHighM: number[], frameLineContour: number[], framePoint: point[]): number {
        /// <signature>
        /// <summary>等値線の枠取得、戻り値は等値線ラインの数</summary>
        /// <param name="GetSide" >0左 1上 2右 3下</param>
        /// <param name="ContourNum" >取得する等値線の数</param>
        /// <param name="Contour_High_M" >等値線値</param>
        /// <param name="Frame_LineContour" >等高線番号配列(戻り値)</param>
        /// <param name="Frame_Point" >xy座標配列(戻り値)</param>
        /// </signature> 



        for (let i = 0; i < ContourNum - 1; i++) {
            //等高線が低→高に並べ替えてある必要
            if(contourHighM[i + 1] < contourHighM[i]) { return -1;}
        }
        let sx = 0;
        let sy = 0;
        let ex = 0;
        let ey = 0;
        switch (GetSide) {
            case 0:
                sx = 0;
                sy = 0;
                ex = 0;
                ey = this.YMeshNum - 1;
                break;
            case 1:
                sx = 0;
                sy = 0;
                ex = this.XMeshNum - 1;
                ey = 0;
                break;
            case 2:
                sx = this.XMeshNum - 1;
                sy = 0;
                ex = this.XMeshNum - 1;
                ey = this.YMeshNum - 1;
                break;
            case 3:
                sx = 0;
                sy = this.YMeshNum - 1;
                ex = this.XMeshNum - 1;
                ey = this.YMeshNum - 1;
                break;
        }
        let vn = 0;
        frameLineContour.length = 0; //point
        framePoint.length = 0;
        switch (GetSide) {
            case 0:
                vn = this.GetFrameSub(ContourNum, contourHighM, sx, sy, 0, 1, this.YMeshNum ?? 0, framePoint, frameLineContour);
                break;
            case 1:
                vn = this.GetFrameSub(ContourNum, contourHighM, sx, sy, 1, 0, this.XMeshNum ?? 0, framePoint, frameLineContour);
                break;
            case 2:
                vn = this.GetFrameSub(ContourNum, contourHighM, ex, sy, 0, 1, this.YMeshNum ?? 0, framePoint, frameLineContour);
                break;
            case 3:
                vn = this.GetFrameSub(ContourNum, contourHighM, sx, ey, 1, 0, this.XMeshNum ?? 0, framePoint, frameLineContour);
                break;
        }
        for (let i = 0; i < vn; i++) {
            const cp = framePoint[i];
            cp.x = this.Xplus + cp.x / (this.XMeshNum - 1) * this.XMeshSize;
            cp.y = this.Yplus + cp.y / (this.YMeshNum - 1) * this.YMeshSize;
        }
        return vn;
    }
    
    private GetFrameSub(ContourNum: number, contourHighM: number[], sx: number, sy: number, xPlus: number, yPlus: number, LoopNum: number, Vpoint: point[], Vcon: number[]): number {
        // contourHighM[]
        //Vpoint[]:point
        //Vcon[]
        const SepV: number[] = [];
        const VPC: number[] = [];

        const startVal = this.Mesh[sx]?.[sy];
        if (startVal === undefined) {
            return 0;
        }

        //始終点のコンターの位置を取得
        let SPN = -1;
        for (let i = ContourNum - 1; i >= 0; i--) {
            if((contourHighM[i] + this.ConValuePlus) <= startVal) {
                SPN = i;
                break;
            }
        }
        SepV.push(0);
        VPC.push(SPN);

        const ex = sx + (LoopNum - 1) * xPlus;
        const ey = sy + (LoopNum - 1) * yPlus;
        let EPN = -1;
        const endVal = this.Mesh[ex]?.[ey];
        if (endVal === undefined) {
            return 0;
        }
        for (let i = ContourNum - 1; i >= 0; i--) {
            if((contourHighM[i] + this.ConValuePlus) <= endVal) {
                EPN = i;
                break;
            }
        }
        SepV.push(LoopNum - 1);
        VPC.push(EPN);

        //コンターの区切り箇所を取得
        for (let i = 0;i<=LoopNum - 2;i++){
            const V1 = this.Mesh[sx + i * xPlus][ sy + i * yPlus] ?? 0;
            const V2 = this.Mesh[sx + (i + 1) * xPlus][ sy + (i + 1) * yPlus] ?? 0;
            for (let j = 0;j< ContourNum ;j++){
                const High = contourHighM[j] + this.ConValuePlus;
                const VH1 = V1 - High;
                const VH2 = V2 - High;
                if((((VH1 <= 0) && (VH2 >= 0)) || ((VH1 >= 0) && (VH2 <= 0))) && (V1 !== V2)) {
                    SepV.push(i + Math.abs(VH1 / (V1 - V2)));
                    if(V1 < V2) {
                        VPC.push(j);
                    } else {
                        VPC.push(j - 1);
                    }
                }
            }

        }
        const VPN = SepV.length;

        const SepVSort= new SortingSearch();
        SepVSort.AddRange(SepV);
        Vpoint.length = VPN;
        Vcon.length = VPN;
        let n = 0;
        for (let i = 0; i < VPN ; i++) {
            const j = SepVSort.DataPosition(i);
            let f=false;
            if( i === 0 ){
                f = true;
            }else{
                if( SepVSort.DataPositionValue(i - 1) !== SepVSort.DataPositionValue(i) ){
                    f = true;
                }
            }
            if( f === true ){
                Vcon[n]=VPC[j];
                if( xPlus === 1 ){
                    Vpoint[n] = new point(SepV[j], sy);
                }else{
                    Vpoint[n] = new point(sx, SepV[j]);
                }
                n++;
            }else{
                if(i !== VPN - 1) {
                    n--;
                }
            }
        }
        return n;
    }

    private Mesh_Sub(con: ConPartInfo[][], Mesh: MeshGrid, mi: number, mj: number, HK: number, High: number, _highCN: number[]): void {
        //メッシュ内で横切る等値線を取得
        const V1 = Mesh[mi][mj] ?? 0;
        const V2 = Mesh[mi + 1][mj] ?? 0;
        const V3 = Mesh[mi][mj + 1] ?? 0;
        const V4 = Mesh[mi + 1][mj + 1] ?? 0;
        //取得する等高線の値とメッシュの４すみを比較
        const VH1 = V1 - High;
        const VH2 = V2 - High;
        const VH3 = V3 - High;
        const VH4 = V4 - High;
        let Q = 0;
        let C12 = 0;
        let C24 = 0;
        let C34 = 0;
        let C13 = 0;
        if( (((VH1 <= 0)&&(VH2 >= 0)) || ((VH1 >= 0 )&&( VH2 <= 0)) )&&( V1 !== V2 )){ C12 = 1; Q ++;}
        if( (((VH2 <= 0)&&(VH4 >= 0)) || ((VH2 >= 0 )&&( VH4 <= 0)) )&&( V2 !== V4 )){ C24 = 1; Q ++;}
        if( (((VH4 <= 0)&&(VH3 >= 0)) || ((VH4 >= 0 )&&( VH3 <= 0)) )&&( V3 !== V4 )){ C34 = 1; Q ++;}
        if( (((VH1 <= 0)&&(VH3 >= 0)) || ((VH1 >= 0 )&&( VH3 <= 0)) )&&( V1 !== V3 )){ C13 = 1; Q ++;}

        switch (Q) {
            case 2:
                this.R2220(mi, mj, C12, C34, C24, C13, VH1, VH2, VH3, VH4, V1, V2, V3, V4, HK, _highCN, con);
                break;
            case 4:
                if(( V2 === High)&&(V3 === High)){
                    C12 = 1; C13 = 1;
                    this.R2220(mi, mj, C12, C34, C24, C13, VH1, VH2, VH3, VH4, V1, V2, V3, V4, HK, _highCN, con);
                }else{
                    C34 = 0; C13 = 0; C12 = 1; C24 = 1;
                    this.R2220(mi, mj, C12, C34, C24, C13, VH1, VH2, VH3, VH4, V1, V2, V3, V4, HK, _highCN, con);
                    C12 = 0; C24 = 0; C34 = 1; C13 = 1;
                    this.R2220(mi, mj, C12, C34, C24, C13, VH1, VH2, VH3, VH4, V1, V2, V3, V4, HK, _highCN, con);
                }
                break;
            case 3:
                if(( C12 === 1 )&&( C24 === 1 )&&( V2 === High )){ C12 = 0;}
                if( (C12 === 1 )&&( C13 === 1 )&&( V1 === High )){ C12 = 0;}
                if(( C24 === 1 )&&( C34 === 1 )&&( V4 === High )){ C24 = 0;}
                if(( C34 === 1 )&&( C13 === 1 )&&( V3 === High )){ C13 = 0;}

                this.R2220(mi, mj, C12, C34, C24, C13, VH1, VH2, VH3, VH4, V1, V2, V3, V4, HK, _highCN, con);
                break;
        }
    }

    private R2220(mi: number, mj: number, C12: number, C34: number, C24: number, C13: number, VH1: number, VH2: number, VH3: number, VH4: number, V1: number, V2: number, V3: number, V4: number, HK: number, highCN: number[], con: ConPartInfo[][]): void {
        let T = 0;
        const po: point[] = [];
        if(C12 === 1 ){
            po[T] = new point(mi + Math.abs(VH1 / (V1 - V2)), mj);
            T++;
        }
        if (C34 === 1) {
            po[T] = new point(mi + Math.abs(VH3 / (V3 - V4)), mj + 1);
            T++;
        }
        if (C24 === 1) {
            po[T] = new point(mi + 1, mj + Math.abs(VH2 / (V2 - V4)));
            T++;
        }
        if (C13 === 1) {
            po[T] = new point(mi, mj + Math.abs(VH1 / (V1 - V3)));
            T++;
        }
        if(T < 2 ){
            return; //Tはほぼ常に２で２未満のことはない
        }
        if(po[0].Equals(po[1])===false){
            //二つの座標が同じになってしまう場合は含めない
            const Pon = highCN[HK];
            con[HK][Pon]=new ConPartInfo();
            con[HK][Pon].p0 = po[0].Clone();
            con[HK][Pon].p1= po[1].Clone();
            highCN[HK] = Pon + 1;
            }
    }

    private Get_Sum_geometric_progression(shokou: number, kouhi: number, n: number): number {
        /// <summary>等比数列の和を求める。今は使っていない</summary>
        return shokou * (1 - Math.pow(kouhi, n)) / (1 - kouhi);
    }

    private Get_MortonArrayPosition(n: number): number {
        /// <summary>四分木線形配列の開始位置。</summary>
        return -(1 - Math.pow(4, n)) / 3;
    }
    
    private Get_MortonNumberXY(X: number, Y: number, SpaceLevel: number, maxPartitionLevel: number): number {
        /// <summary>点の座標値と所属する空間レベルから、四分木線形配列の位置を返す</summary>
        const zero ="0".repeat(maxPartitionLevel);
        const x2 = (zero + X.toString(2)).right(maxPartitionLevel); //X座標を2進数に
        const y2 = (zero + Y.toString(2)).right(maxPartitionLevel); //Y座標を2進数に
        let Num = "";
        for(let i = 0;i< maxPartitionLevel;i++){
            Num +=  y2.substr(i, 1) + x2.substr( i, 1);
        }
        return parseInt(Num, 2) + this.Get_MortonArrayPosition(SpaceLevel);
    }


    private Set_MeshQuadTree(Mesh: MeshGrid, xw: number, yw: number, maxPartitionLevel: number): void {
        /// <summary>メッシュの四分木データをQuad_MeshDataに作成</summary>

        const stp = Math.pow(2, maxPartitionLevel - 1);
        const w = Math.floor(xw / stp);//最大分割レベルの横セル数
        const H = Math.floor(yw / stp);//最大分割レベルの縦セル数
        let mxv: number | undefined;
        let mnv: number | undefined;
        for (let i = 0; i < stp; i++) {
            let h2;
            if (i === stp - 1) {
                h2 = H + (yw % stp); //ループ最後では余り部分を追加する
            } else {
                h2 = H + 1; //1メッシュ分重複を持たせる
            }
            const py2 = i * H;
            for (let j = 0; j < stp; j++) {
                let w2;
                if (j === stp - 1) {
                    w2 = w + (xw % stp);//ループ最後では余り部分を追加する
                } else {
                    w2 = w + 1; //1メッシュ分重複を持たせる
                }
                let f = true;//すべて欠損の場合true
                const px2 = j * w;
                mxv = undefined;
                mnv = undefined;
                for (let ky = 0; ky < h2; ky++) {
                    const py = py2 + ky;
                    for (let kx = 0; kx < w2; kx++) {
                        const px = px2 + kx;
                        const cell = Mesh[px][py];
                        if (cell !== undefined) { //Web等高線メーカーの場合-9999になっているので必要ないが汎用性のため残す
                            if (f === true) {
                                mxv = cell;
                                mnv = cell;
                                f = false;
                            } else if (mxv !== undefined && mnv !== undefined) {
                                if (mxv < cell) {
                                    mxv = cell;
                                } else if (cell < mnv) {
                                    mnv = cell;
                                }
                            }
                        }
                    }
                }
                const mon = this.Get_MortonNumberXY(j, i, maxPartitionLevel - 1, maxPartitionLevel);
                //四分木線形配列の最大分割レベルに、当該メッシュの範囲と、最大標高、最低標高を保存
                this.Quad_MeshData[mon] = new QuadMeshInfo(new rectangle(px2, px2 + w2 - 2, i * H, i * H + h2 - 2), mxv ?? 0, mnv ?? 0, f);
            }
        }

        //親レベルの最大標高、最低標高を計算
        for (let k = maxPartitionLevel - 1; k >= 1; k--) {
            const SP = this.Get_MortonArrayPosition(k); //自レベルの四分木線形配列の開始位置
            const SP2 = this.Get_MortonArrayPosition(k - 1);//親レベルの四分木線形配列の開始位置
            for (let i = 0; i < Math.pow(4, k); i += 4) { //子4メッシュで親1メッシュ
                let f = true;
                mxv = undefined;
                mnv = undefined;
                for (let j = 0; j <= 3; j++) {
                    const Quad_MeshDataSub = this.Quad_MeshData[SP + i + j];
                    if (Quad_MeshDataSub.LackF === false) {
                        if (f === true) {
                            mxv = Quad_MeshDataSub.Max;
                            mnv = Quad_MeshDataSub.Min;
                            f = false;
                        } else if (mxv !== undefined && mnv !== undefined) {
                            if (Quad_MeshDataSub.Max !== undefined && mxv < Quad_MeshDataSub.Max) {
                                mxv = Quad_MeshDataSub.Max;
                            }
                            if (Quad_MeshDataSub.Min !== undefined && Quad_MeshDataSub.Min < mnv) {
                                mnv = Quad_MeshDataSub.Min;
                            }
                        }
                    }
                }
                //親空間レベルの最大／最小値を設定
                const n = SP2 + Math.floor(i / 4);
                this.Quad_MeshData[n] = new QuadMeshInfo(null, mxv ?? 0, mnv ?? 0, f);
                this.Quad_MeshData[n].Position = n;
                this.Quad_MeshData[n].LackF = f;
                this.Quad_MeshData[n].Max = mxv;
                this.Quad_MeshData[n].Min = mnv;
            }
        }

    }

    private Get_Quad_MeshCell(value: number, Qcell: MortonIndex[], SpaceLevel: number, Scell: number, n: PartitionCounter, maxPartitionLevel: number): void {
        /// <summary>四分木から等値線にかかるメッシュを抜き出す再帰処理</summary>
        if (SpaceLevel === 0) {
            //初回の呼び出し
            Qcell.length = this.Get_MortonArrayPosition( maxPartitionLevel);
            n[0] = 0;
            const Quad_MeshDataSub = this.Quad_MeshData[0];
            if ((Generic.Check_Two_Value_In(value, Quad_MeshDataSub.Min, Quad_MeshDataSub.Max) !== chvValue_on_twoValue.chvOuter) && (Quad_MeshDataSub.LackF === false)) {
                this.Get_Quad_MeshCell(value, Qcell, SpaceLevel + 1, 0, n, maxPartitionLevel)
            }
        } else {
            const SP = this.Get_MortonArrayPosition( SpaceLevel);
            for (let i = 0; i <= 3 ; i++) {
                const Quad_MeshDataSub = this.Quad_MeshData[SP + Scell + i];
                if ((Generic.Check_Two_Value_In(value, Quad_MeshDataSub.Min, Quad_MeshDataSub.Max) !== chvValue_on_twoValue.chvOuter) && (Quad_MeshDataSub.LackF === false)) {
                    //該当した場合
                    if (SpaceLevel === maxPartitionLevel - 1) {
                        //最大レベルの場合、四分木線形配列の位置をQcellに記憶
                        Qcell[n[0]] = SP + Scell + i;
                        n[0] ++;
                    } else {
                        //最大レベルでない場合は、さらに子レベルを調べる
                        this.Get_Quad_MeshCell(value, Qcell, SpaceLevel + 1, (Scell + i) * 4, n, maxPartitionLevel);
                    }
                }
            }
        }
    }

    private Get_PartitiopnLevel(xs: number, ys: number): number {
        /// <summary>四分木の最大分割段階を決める</summary>
        const ms = Math.min(xs, ys);
        let i=1;
        let n;
        do{
            n = Math.floor(ms / Math.pow(2, i));
            i++;
        } while (n >= 20);
        if (i === 2) {
            i = 3;
        }
        return i-1;
    }
}

export { ContourLineStackInfo, MeshContour };
