// ESM化ステップ: モジュールシステムへの完全移行
import { appState } from './core/AppState';
import type { RadioValue, RadioListItem, TableData, MapData, ExtendedNavigator, MenuItem } from './types';
import { Object_NameTimeStac_Data } from './clsMapdata';
// CHR_LF は現在未使用のためコメントアウト
// import { CHR_LF } from './constants/geometry';

// グローバル定数は constants からインポート
// const EARTH_R = 6370;  // 削除
// const chrLF = String.fromCharCode(10);  // 削除

// SpatialPointType は globals.d.ts で定義済み（将来的にはtypes/へ移行）

// enmMatchingMode は globals.d.ts で定義済み

// cstRectangle_Cross は globals.d.ts で定義済み

class EllipPar {
    a: number = 0;
    f1: number = 0;
    f: number = 0;
    E: number = 0;
    namec: string = "";
}

// TKY2JGDInfo クラス: 測地系変換（Tokyo97 ⇔ ITRF94）
// 国土地理院技術資料 Ｈ・１－Ｎｏ．２「測地成果2000のための座標変換ソフトウェアTKY2JGD」によるTKY2JGDソース・コードを利用
class TKY2JGDInfo_Impl {
    private readonly EP = new Array<EllipPar>(3);
    private readonly XY_Genten = new Array<latlon>(20);
    private readonly rad2deg = 57.2957795130823;
    private readonly deg2rad = 0.0174532925199433;
    private readonly HAF_PI = 1.5707963267949;
    private readonly PID = 3.14159265358979;
    private readonly TWO_PI = 6.28318530717959;
    private readonly ROBYO = 206264.806247;

    constructor() {
        this.Set_EP_Parameter();
    }

    // Tokyo97系からITRF94系への座標変換
    // Ver.1.1  1999/1/28  (C) Mikio TOBITA 飛田幹男，国土地理院
    // この変換では楕円体高Hはゼロとする
    Tokyo97toITRF94(latlonP: latlon): latlon {
        // 入力　B1    : 緯度(度)
        // 　　　L1    : 経度(度)
        // 出力　B2    : 緯度(度)
        // 　　　L2    : 経度(度)
        const B1 = latlonP.lat;
        const L1 = latlonP.lon;

        const Brad = B1 * this.deg2rad;
        const ALrad = L1 * this.deg2rad;

        //緯度，経度から三次元直交座標系(X,Y,Z)への換算
        const xyz1 = this.BLHXYZcalc(Brad, ALrad, 0, this.EP[1]); //EP(1):Bessel楕円体
        //三次元直交座標系(X,Y,Z)から三次元直交座標系(X,Y,Z)への座標変換
        const xyz2 = this.xyz2xyz(xyz1);
        //三次元直交座標系(X,Y,Z)から緯度，経度への換算
        const retV = this.XYZBLHcalc(xyz2, this.EP[2]) || { Brad: 0, ALrad: 0 };

        const B2 = retV.Brad * this.rad2deg;
        const L2 = retV.ALrad * this.rad2deg;
        return {lat: B2, lon: L2};
    }

    ITRF94toTokyo97(latlonP: latlon): latlon {
        const B1 = latlonP.lat;
        const L1 = latlonP.lon;
        const Brad = B1 * this.deg2rad;
        const ALrad = L1 * this.deg2rad;
        let xyz1 = this.BLHXYZcalc(Brad, ALrad, 0, this.EP[2]);
        let xyz2 = this.xyz2xyzR(xyz1);
        let retV = this.XYZBLHcalc(xyz2, this.EP[1]) || { Brad: 0, ALrad: 0, H: 0 };

        xyz1 = this.BLHXYZcalc(retV.Brad, retV.ALrad, -retV.H, this.EP[2]);
        xyz2 = this.xyz2xyzR(xyz1);
        retV = this.XYZBLHcalc(xyz2, this.EP[1]) || { Brad: 0, ALrad: 0, H: 0 };
        const B2 = retV.Brad * this.rad2deg;
        const L2 = retV.ALrad * this.rad2deg;
        return {lat: B2, lon: L2};
    }

    doCalcXy2bl(Ellip12: number, Kei: number, X: number, Y: number): latlon {
        let M0: number;  //Kei    //系番号，基準子午線の縮尺係数
        let B1: number, L1: number;      //原点の緯度，経度。基本的にradian
        let b: number, L: number;        //求める緯度，経度。基本的にradian
        let Bdeg: number, Ldeg: number;  //求める緯度，経度。基本的にdeg
        let Gamma: number;                 //=γ 子午線収差角。radian
        let MMM: number;                   //縮尺係数
        let AEE: number, CEE: number, Ep2: number;
        let AJ: number, BJ: number, CJ: number, DJ: number, EJ: number;
        let FJ: number, GJ: number, HJ: number, IJ: number;
        let S0: number;                    //赤道から座標原点までの子午線弧長
        let M: number;
        let Eta2: number, M1: number, N1: number;          //phi1の関数
        let Eta2phi: number, Mphi: number, Nphi: number;   //phi(=B)の関数
        let T: number, T2: number, T4: number, T6: number;
        let e2: number, e4: number, e6: number, e8: number, e10: number;
        let e12: number, e14: number, e16: number;
        let S1: number, phi1: number, oldphi1: number, icount: number;
        let Bunsi: number, Bunbo: number;
        let YM0: number, N1CosPhi1: number;
        const EPs = new EllipPar();

        M0 = 0.9999;
        const epSrc = this.EP[Ellip12] ?? new EllipPar();
        EPs.a = epSrc.a ?? 0;
        EPs.f1 = epSrc.f1 ?? 0;
        EPs.f = epSrc.f ?? 0;
        EPs.E = epSrc.E ?? 0;
        EPs.namec = epSrc.namec ?? "";
        e2 = EPs.E ?? 0;
        e4 = e2 * e2
        e6 = e4 * e2
        e8 = e4 * e4
        e10 = e8 * e2
        e12 = e8 * e4
        e14 = e8 * e6
        e16 = e8 * e8

        //定数項 the same as bl2xy
        AEE = EPs.a * (1.0 - EPs.E) //a(1-e2)
        CEE = EPs.a / Math.sqrt(1.0 - EPs.E)   //C=a*sqr(1+e'2)=a / sqr(1 - e2)
        Ep2 = EPs.E / (1.0 - EPs.E) //e'2(e prime 2) Eta2を計算するため

        AJ = 4927697775.0 / 7516192768.0 * e16
        AJ = AJ + 19324305.0 / 29360128.0 * e14
        AJ = AJ + 693693.0 / 1048576.0 * e12
        AJ = AJ + 43659.0 / 65536.0 * e10
        AJ = AJ + 11025.0 / 16384.0 * e8
        AJ = AJ + 175.0 / 256.0 * e6
        AJ = AJ + 45.0 / 64.0 * e4
        AJ = AJ + 3.0 / 4.0 * e2
        AJ = AJ + 1.0
        BJ = 547521975.0 / 469762048.0 * e16
        BJ = BJ + 135270135.0 / 117440512.0 * e14
        BJ = BJ + 297297.0 / 262144.0 * e12
        BJ = BJ + 72765.0 / 65536.0 * e10
        BJ = BJ + 2205.0 / 2048.0 * e8
        BJ = BJ + 525.0 / 512.0 * e6
        BJ = BJ + 15.0 / 16.0 * e4
        BJ = BJ + 3.0 / 4.0 * e2
        CJ = 766530765.0 / 939524096.0 * e16
        // CJ = CJ + 45090045 / 5870256 * e14 精密測地網一次基準点測量作業規定の誤りによるバグ
        CJ = CJ + 45090045.0 / 58720256.0 * e14
        CJ = CJ + 1486485.0 / 2097152.0 * e12
        CJ = CJ + 10395.0 / 16384.0 * e10
        CJ = CJ + 2205.0 / 4096.0 * e8
        CJ = CJ + 105.0 / 256.0 * e6
        CJ = CJ + 15.0 / 64.0 * e4
        DJ = 209053845.0 / 469762048.0 * e16
        DJ = DJ + 45090045.0 / 117440512.0 * e14
        DJ = DJ + 165165.0 / 524288.0 * e12
        DJ = DJ + 31185.0 / 131072.0 * e10
        DJ = DJ + 315.0 / 2048.0 * e8
        DJ = DJ + 35.0 / 512.0 * e6
        EJ = 348423075.0 / 1879048192.0 * e16
        EJ = EJ + 4099095.0 / 29360128.0 * e14
        EJ = EJ + 99099.0 / 1048576.0 * e12
        EJ = EJ + 3465.0 / 65536.0 * e10
        EJ = EJ + 315.0 / 16384.0 * e8
        FJ = 26801775.0 / 469762048.0 * e16
        FJ = FJ + 4099095.0 / 117440512.0 * e14
        FJ = FJ + 9009.0 / 524288.0 * e12
        FJ = FJ + 693.0 / 131072.0 * e10
        GJ = 11486475.0 / 939524096.0 * e16
        GJ = GJ + 315315.0 / 58720256.0 * e14
        GJ = GJ + 3003.0 / 2097152.0 * e12
        HJ = 765765.0 / 469762048.0 * e16
        HJ = HJ + 45045.0 / 117440512.0 * e14
        IJ = 765765.0 / 7516192768.0 * e16


        B1 = this.XY_Genten[Kei].lat * this.deg2rad;
        L1 = this.XY_Genten[Kei].lon * this.deg2rad;

  

        //赤道からの子午線長の計算
        S0 = this.MeridS(B1, AEE, AJ, BJ, CJ, DJ, EJ, FJ, GJ, HJ, IJ); //赤道から座標原点までの子午線弧長
        M = S0 + X / M0;

        //Baileyの式による異性緯度（isometric latitude）phi1の計算。
        //「精密測地網一次基準点測量計算式」P57の11.(1)の式から。
        //この式と「現代測量学１ 測量の数学的基礎」P102の式とは，Cos(phi1)だけ異なる。
        //この式を導入したためベッセル楕円体以外で往復計算OKとなった。
        icount = 0;
        phi1 = B1;
        do {
            icount++;
            oldphi1 = phi1;
            S1 = this.MeridS(phi1, AEE, AJ, BJ, CJ, DJ, EJ, FJ, GJ, HJ, IJ); //赤道から点までの子午線弧長
            Bunsi = 2.0 * (S1 - M) * (1.0 - EPs.E * Math.sin(phi1) * Math.sin(phi1)) ** 1.5;
            Bunbo = 3.0 * EPs.E * (S1 - M) * Math.sin(phi1) * Math.cos(phi1) * Math.sqrt(1.0 - EPs.E * Math.sin(phi1) * Math.sin(phi1)) - 2.0 * EPs.a * (1.0 - EPs.E);
            phi1 = phi1 + Bunsi / Bunbo;
        } while ((Math.abs(phi1 - oldphi1) >= 0.00000000000001) && (icount < 100)); //本では1e-12で十分　iterationの回数は４回

        //何度も使う式を変数に代入
        YM0 = Y / M0;
        T = Math.tan(phi1);  //「精密測地網一次基準点測量計算式」P51のt1に等しい
        T2 = T * T;
        T4 = T2 * T2;
        T6 = T4 * T2;
        Eta2 = Ep2 * Math.cos(phi1) * Math.cos(phi1);     //=η1*η1
        M1 = CEE / Math.sqrt((1.0 + Eta2) ** 3.0);
        N1 = CEE / Math.sqrt(1.0 + Eta2);
        N1CosPhi1 = N1 * Math.cos(phi1);

        //緯度Bの計算 「精密測地網一次基準点測量計算式」P51のphiを求める式より
        b = ((1385.0 + 3633.0 * T2 + 4095 * T4 + 1575.0 * T6) / (40320.0 * N1 ** 8.0)) * YM0 ** 8.0;
        b = b - ((61.0 + 90.0 * T2 + 45 * T4 + 107.0 * Eta2 - 162.0 * T2 * Eta2 - 45.0 * T4 * Eta2) / (720.0 * N1 ** 6.0)) * YM0 ** 6.0;
        b = b + ((5.0 + 3.0 * T2 + 6.0 * Eta2 - 6.0 * T2 * Eta2 - 3.0 * Eta2 ** 2 - 9.0 * T2 * Eta2 ** 2) / (24.0 * N1 ** 4.0)) * YM0 ** 4.0;
        b = b - ((1.0 + Eta2) / (2.0 * N1 ** 2.0)) * YM0 ** 2.0;
        b = b * T;
        b = b + phi1;

        //経度Lの計算 「精密測地網一次基準点測量計算式」P51のΔλを求める式より
        L = -((61.0 + 662.0 * T2 + 1320.0 * T4 + 720.0 * T6) / (5040.0 * N1 ** 6.0 * N1CosPhi1)) * YM0 ** 7.0;
        L = L + ((5.0 + 28.0 * T2 + 24.0 * T4 + 6.0 * Eta2 + 8.0 * T2 * Eta2) / (120.0 * N1 ** 4.0 * N1CosPhi1)) * YM0 ** 5.0;
        L = L - ((1.0 + 2.0 * T2 + Eta2) / (6.0 * N1 ** 2.0 * N1CosPhi1)) * YM0 ** 3.0;
        L = L + (1.0 / N1CosPhi1) * YM0;
        L = L + L1;

        //子午線収差角の計算 「精密測地網一次基準点測量計算式」P51のγを求める式より
        Gamma = ((1.0 + T2) * (2.0 + 3.0 * T2) / (15.0 * N1 ** 5.0)) * (Y / M0) ** 5.0;
        Gamma = Gamma - ((1.0 + T2 - Eta2) / (3.0 * N1 ** 3.0)) * (Y / M0) ** 3.0;
        Gamma = Gamma + (1.0 / N1) * Y / M0;
        Gamma = Gamma * T;

        //縮尺係数の計算 「精密測地網一次基準点測量計算式」P51のmを求める式より
        Eta2phi = Ep2 * Math.cos(b) * Math.cos(b);     //=η*η。Bはphiと同じ。
        Mphi = CEE / Math.sqrt((1.0 + Eta2phi) ** 3.0);
        Nphi = CEE / Math.sqrt(1.0 + Eta2phi);
        MMM = Y ** 4.0 / (24.0 * Mphi * Mphi * Nphi * Nphi * M0 ** 4.0);
        MMM = MMM + Y * Y / (2.0 * Mphi * Nphi * M0 ** 2.0);
        MMM = MMM + 1.0;
        MMM = MMM * M0;

        //出力
        Bdeg = b * this.rad2deg;
        Ldeg = L * this.rad2deg;

        return new latlon(Bdeg, Ldeg);
    }

    // プライベートヘルパーメソッド群
    private MeridS(Phi: number, AEE: number, AJ: number, BJ: number, CJ: number, DJ: number, EJ: number, FJ: number, GJ: number, HJ: number, IJ: number): number {
        let SS: number;
        SS = IJ / 16.0 * Math.sin(16.0 * Phi);
        SS = SS - HJ / 14.0 * Math.sin(14.0 * Phi);
        SS = SS + GJ / 12.0 * Math.sin(12.0 * Phi);
        SS = SS - FJ / 10.0 * Math.sin(10.0 * Phi);
        SS = SS + EJ / 8.0 * Math.sin(8.0 * Phi);
        SS = SS - DJ / 6.0 * Math.sin(6.0 * Phi);
        SS = SS + CJ / 4.0 * Math.sin(4.0 * Phi);
        SS = SS - BJ / 2.0 * Math.sin(2.0 * Phi);
        SS = SS + AJ * Phi;
        return SS;
    }

    private xyz2xyzR(xyz: { x: number; y: number; z: number }): { x: number; y: number; z: number } {
        const T1 = 14641.4;
        const T2 = -50733.7;
        const T3 = -68050.7;
        const T1real = T1 * 0.01;
        const T2real = T2 * 0.01;
        const T3real = T3 * 0.01;
        const x2 = xyz.x + T1real;
        const y2 = xyz.y + T2real;
        const z2 = xyz.z + T3real;
        return new point3(x2, y2, z2);
    }

    private XYZBLHcalc(xyz: { x: number; y: number; z: number }, EP: EllipPar): { Brad: number; ALrad: number; H: number } | undefined {
        const x = xyz.x;
        const y = xyz.y;
        const z = xyz.z;

        const a = EP.a;
        const fi = EP.f1;
        const E = EP.E;

        const P2 = x * x + y * y;
        const p = Math.sqrt(P2);
        if (p == 0) {
            return;
        }
        let ALradV: number;
        if (x == 0) {
            ALradV = this.HAF_PI;
        } else {
            ALradV = Math.atan(y / x);
        }
        if (x < 0) {
            ALradV += this.PID;
        }
        if (ALradV > this.PID) {
            ALradV -= this.TWO_PI;
        }

        const r = Math.sqrt(P2 + z * z);
        const myu = Math.atan((z / p) * (1.0 - (1.0 / fi) + E * a / r));
        let myus3 = Math.sin(myu);
        myus3 = myus3 * myus3 * myus3;
        let myuc3 = Math.cos(myu);
        myuc3 = myuc3 * myuc3 * myuc3;
        const BradV = Math.atan((z * (1.0 - 1.0 / fi) + E * a * myus3) / ((1.0 - 1.0 / fi) * (p - E * a * myuc3)));
        const Hv = p * Math.cos(BradV) + z * Math.sin(BradV) - a * Math.sqrt(1.0 - E * Math.sin(BradV) * Math.sin(BradV));    //楕円体高

        return { Brad: BradV, ALrad: ALradV, H: Hv };
    }

    private xyz2xyz(xyz: { x: number; y: number; z: number }): { x: number; y: number; z: number } {
        const T1 = -14641.4;
        const T2 = 50733.7;
        const T3 = 68050.7;
        const T1real = T1 * 0.01;
        const T2real = T2 * 0.01;
        const T3real = T3 * 0.01;
        const x2 = xyz.x + T1real;
        const y2 = xyz.y + T2real;
        const z2 = xyz.z + T3real;
        return new point3(x2, y2, z2);
    }

    private BLHXYZcalc(Brad: number, ALrad: number, H: number, EP: EllipPar): point3 {
        const a = EP.a;
        const fi = EP.f1;
        const E = EP.E;
        const CB = Math.cos(Brad);
        const SB = Math.sin(Brad);
        const CL = Math.cos(ALrad);
        const SL = Math.sin(ALrad);
        const w = Math.sqrt(1.0 - E * SB * SB);
        const an = a / w;
        const x = (an + H) * CB * CL;
        const y = (an + H) * CB * SL;
        const z = (an * (1.0 - E) + H) * SB;
        return new point3(x, y, z);
    }

    private Set_EP_Parameter(): void {
        this.EP[1] = new EllipPar();
        this.EP[2] = new EllipPar();
        
        this.EP[1].a = 6377397.155;
        this.EP[1].f1 = 299.152813;
        this.EP[1].namec = "Bessel";
        this.EP[1].f = 1.0 / this.EP[1].f1;
        this.EP[1].E = (2.0 * this.EP[1].f1 - 1.0) / this.EP[1].f1 / this.EP[1].f1; //=e*e [squared e]
        this.EP[2].a = 6378137.0;
        this.EP[2].f1 = 298.257222101;
        this.EP[2].namec = "GRS-80";
        this.EP[2].f = 1.0 / this.EP[2].f1;
        this.EP[2].E = (2.0 * this.EP[2].f1 - 1.0) / this.EP[2].f1 / this.EP[2].f1; //=e*e [squared e]

        for (let i = 1; i < 20; i++) {
            this.XY_Genten[i] = new latlon();
        }
        this.XY_Genten[1].lat = 33;
        this.XY_Genten[1].lon = 129.5;
        this.XY_Genten[2].lat = 33;
        this.XY_Genten[2].lon = 131;
        this.XY_Genten[3].lat = 36;
        this.XY_Genten[3].lon = 132 + 10 / 60;
        this.XY_Genten[4].lat = 33;
        this.XY_Genten[4].lon = 133.5;
        this.XY_Genten[5].lat = 36;
        this.XY_Genten[5].lon = 134 + 20 / 60;
        this.XY_Genten[6].lat = 36;
        this.XY_Genten[6].lon = 136;
        this.XY_Genten[7].lat = 36;
        this.XY_Genten[7].lon = 137 + 10 / 60;
        this.XY_Genten[8].lat = 36;
        this.XY_Genten[8].lon = 138.5;
        this.XY_Genten[9].lat = 36;
        this.XY_Genten[9].lon = 139 + 50 / 60;
        this.XY_Genten[10].lat = 40;
        this.XY_Genten[10].lon = 140 + 50 / 60;
        this.XY_Genten[11].lat = 44;
        this.XY_Genten[11].lon = 140 + 15 / 60;
        this.XY_Genten[12].lat = 44;
        this.XY_Genten[12].lon = 142 + 15 / 60;
        this.XY_Genten[13].lat = 44;
        this.XY_Genten[13].lon = 144 + 15 / 60;
        this.XY_Genten[14].lat = 26;
        this.XY_Genten[14].lon = 142;
        this.XY_Genten[15].lat = 26;
        this.XY_Genten[15].lon = 127.5;
        this.XY_Genten[16].lat = 26;
        this.XY_Genten[16].lon = 124;
        this.XY_Genten[17].lat = 26;
        this.XY_Genten[17].lon = 131;
        this.XY_Genten[18].lat = 20;
        this.XY_Genten[18].lon = 136;
        this.XY_Genten[19].lat = 26;
        this.XY_Genten[19].lon = 154;
    }
}

class spatial {

    /**メッシュコードから投影変換した四角形を返す */
    static Get_MeshCode_Rectangle(Meshcode: string, MeshType: number, refOrigin: number, refDestZahyo: Zahyo_info) {

        const RectLatLon  = spatial.Get_Ido_Kedo_from_MeshCode(Meshcode, MeshType);
        RectLatLon.NorthWest = spatial.ConvertRefSystemLatLon(RectLatLon.NorthWest, refOrigin, refDestZahyo.System);
        RectLatLon.SouthEast = spatial.ConvertRefSystemLatLon(RectLatLon.SouthEast, refOrigin, refDestZahyo.System);
        const P=[];
        P[0] = spatial.Get_Converted_XY(RectLatLon.NorthWest.toPoint(), refDestZahyo);
        P[1] = spatial.Get_Converted_XY(RectLatLon.NorthEast.toPoint(), refDestZahyo);
        P[2] = spatial.Get_Converted_XY(RectLatLon.SouthEast.toPoint(), refDestZahyo);
        P[3] = spatial.Get_Converted_XY(RectLatLon.SouthWest.toPoint(), refDestZahyo);
        const filteredP = P.filter((p): p is point => p !== undefined);
        return { convRect: spatial.getCircumscribedRectangle(filteredP, undefined), latlonBox: RectLatLon, RPoint: P };
    }

    /**地図座標のXYから緯度経度にして距離測定 */
    static Distance_Ido_Kedo_XY_Point(P1: point, P2: point, MapDTMapZahyo: Zahyo_info) {

        const D1 = this.Get_Reverse_XY(P1, MapDTMapZahyo);
        const D2 = this.Get_Reverse_XY(P2, MapDTMapZahyo);
        if (!D1 || !D2 || typeof D1.toLatlon !== "function" || typeof D2.toLatlon !== "function") {
            return 0;
        }
        return this.Distance_Ido_Kedo_LatLon(D1.toLatlon(), D2.toLatlon());
    }

    /**緯度経度で地点間の距離を求める */
    static Distance_Ido_Kedo_LatLon(D1: latlon, D2: latlon): number {

        if (D1.Equals(D2)) {
            return 0;
        } else {
            const DV = Math.sqrt((Math.cos((D1.lat + D2.lat) * Math.PI / 180 / 2) * Math.sin((D1.lon - D2.lon) * Math.PI / 180 / 2)) ** 2 + 
                (Math.sin((D1.lat - D2.lat) * Math.PI / 180 / 2) * Math.cos((D1.lon - D2.lon) * Math.PI / 180 / 2)) ** 2)

            return 2 * EarthR * Math.atan(DV / Math.sqrt(-DV * DV + 1));
        }
    }

    /**二つの線分の交点を求める関数。交点がある場合座標、ない場合undefined */
    static Line_Cross_Point(LAP1: point, LAP2: point, LBP1: point, LBP2: point): point | undefined {

        let ax1 = LAP1.x
        let ay1 = LAP1.y
        let ax2 = LAP2.x
        let ay2 = LAP2.y
        let bx1 = LBP1.x
        let by1 = LBP1.y
        let bx2 = LBP2.x
        let by2 = LBP2.y
        //２点が同一、または２線が平行の場合は戻る
        if (((ax2 == ax1) && (bx2 == bx1)) || ((ay2 == ay1) && (by2 == by1)) || (
            (ax1 == bx1) && (ay1 == by1)) || ((ax2 == bx1) && (ay2 == by1)) || ((ax1 == bx2) && (ay1 == by2)) || ((ax2 == bx2) && (ay2 == by2))) {
            return undefined;
        }

        if ((ax2 == ax1) || (bx2 == bx1)) {
            //どちらかがY軸に平行の場合
            if (bx2 == bx1) {
                //B線の場合はAB入れ替えてA線を平行に
                [bx1, ax1] = [ax1, bx1];
                [bx2, ax2] = [ax2, bx2];
                [by1, ay1] = [ay1, by1];
                [by2, ay2] = [ay2, by2];
            }
            if (Generic.Check_Two_Value_In(ax1, bx1, bx2) == chvValue_on_twoValue.chvIN) {
                //交点のY座標を求める
                const BL = (by2 - by1) / (bx2 - bx1);
                const bm = by1 - BL * bx1;
                const px = ax1;
                const py = BL * px + bm;
                if ((Generic.Check_Two_Value_In(py, ay1, ay2) != chvValue_on_twoValue.chvOuter) && (
                    Generic.Check_Two_Value_In(py, by1, by2) != chvValue_on_twoValue.chvOuter)) {
                    //Y座標がAB線の内部だったら交差
                    return new point(px, py);;
                }
            }
            return undefined;
        } else if ((ay2 == ay1) || (by2 == by1)) {
            //どちらかがX軸に平行の場合
            if (by2 == by1) {
                //B線の場合はAB入れ替えてA線を平行に
                [bx1, ax1] = [ax1, bx1];
                [bx2, ax2] = [ax2, bx2];
                [by1, ay1] = [ay1, by1];
                [by2, ay2] = [ay2, by2];
            }
            if (Generic.Check_Two_Value_In(ay1, by1, by2) != chvValue_on_twoValue.chvOuter) {
                //交点のX座標を求める
                const BL = (by2 - by1) / (bx2 - bx1);
                const bm = by1 - BL * bx1;
                const py = ay1;
                const px = (py - bm) / BL;
                if ((Generic.Check_Two_Value_In(px, ax1, ax2) != chvValue_on_twoValue.chvOuter) && (
                    Generic.Check_Two_Value_In(px, bx1, bx2) != chvValue_on_twoValue.chvOuter)) {
                    //X座標がAB線の内部だったら交差
                    return new point(px, py);
                }
            }
            return undefined;
        } else {
            const AL = (ay2 - ay1) / (ax2 - ax1);
            const BL = (by2 - by1) / (bx2 - bx1);
            if (AL == BL) {
                //傾きが等しいと交差しない
                return undefined;
            }
            const AM = ay1 - AL * ax1;
            const bm = by1 - BL * bx1;
            const px = (bm - AM) / (AL - BL);
            const py = AL * px + AM;
            if (((ax1 == px) && (ay1 == py)) || ((ax2 == px) && (ay2 == py)) || ((bx1 == px) && (by1 == py)) || ((bx2 == px) && (by2 == py))) {
            } else {
                if ((Generic.Check_Two_Value_In(px, ax1, ax2) != chvValue_on_twoValue.chvOuter) && (Generic.Check_Two_Value_In(py, ay1, ay2) != chvValue_on_twoValue.chvOuter)) {
                    if ((Generic.Check_Two_Value_In(px, bx1, bx2) != chvValue_on_twoValue.chvOuter) && (
                        Generic.Check_Two_Value_In(py, by1, by2) != chvValue_on_twoValue.chvOuter)) {
                        //交点が２線の内部だったら交差
                        return new point(px, py);
                    }
                }
            }
            return undefined;
        }
    }

    /** 指定したベクトルと垂直のベクトルを取得*/
    static Get_Suisen_Vec(Vx: number, Vy: number) {

        return { rVx: -Vy, rVy: Vx };
    }

    /**ベクトルVecX,VecY方向に距離D離れた地点の座標を取得 */
    static Get_Vec_Point(VecX: number, VecY: number, Dis: number, CenterFlag: boolean) {

            let D ;
            if(CenterFlag ==true ){
                D = Dis / 2;
            }else{
                D = Dis;
            }
    
            let x2 , y2 ;
            if(VecX == 0 ){
                x2 = 0;
                y2 = D * Math.sign(VecY);
            }else if(VecY == 0 ){
                x2 = D * Math.sign(VecX);
                y2 = 0;
            }else{
                x2 = (D * VecX) / Math.sqrt(VecY ** 2 + VecX ** 2);
                y2 = x2 * VecY / VecX;
            }
            return new point(x2, y2);
    }

    //四角形に点が入らない場合，入るように座標を修正して返す
    static checkAndModifyPointInRect(p: point, rect: rectangle) {

        const np =p.Clone();
        if(np.x < rect.left ){
            np.x = rect.left;
        }
        if(np.x > rect.right ){
            np.x = rect.right;
        }
        if(np.y < rect.top ){
            np.y = rect.top;
        }
        if(np.y > rect.bottom ){
            np.y = rect.bottom;
        }
        return np;
    }
    /**  ポリゴン内に指定の地点が含まれる場合ok:true,CrossPoint_Xに交点x座標を返す*/
    static check_Point_in_Polygon(checkPoint: point, PolyLine: point[][]): {ok: boolean, CrossPoint_X: number[]} {


        const CrossPoint_X = [];
        let f = false;
        for (let p = 0; p < PolyLine.length; p++) {
            const LinePoints = PolyLine[p];
            for (let i = 0; i < LinePoints.length-1; i++) {
                const cret = Get_CrossXPoint(checkPoint, LinePoints[i], LinePoints[i + 1]);
                if (cret.ok == true) {
                    CrossPoint_X.push(cret.CrossX);
                }
            }
        }
        //調査地点のX座標が交点の偶数番目の後に来る場合はtrue
        CrossPoint_X.sort(function(a,b){
            if (a === undefined || b === undefined) return 0;
            return (a-b);
        }); //小大に並べ替え
        for(let j  = 0 ;j< CrossPoint_X.length - 1 ;j+=2){
            const xj = CrossPoint_X[j];
            const xj1 = CrossPoint_X[j + 1];
            if(xj !== undefined && xj1 !== undefined && ( xj <= checkPoint.x)&&(checkPoint.x <= xj1) ){
                f=true;
                break;
            }
        }
        const retV ={ok:f,
            CrossPoint_X:CrossPoint_X.filter((x): x is number => x !== undefined)
        }
        return retV;
        //水平線アルゴリズムで、線分と調査地点の座標との水平線上のX座標を求める。Y範囲がずれていた場合はfalse
        function Get_CrossXPoint(checkPoint: point, LinePoint1: point, LinePoint2: point) {
            const x  = checkPoint.x;
            const y  = checkPoint.y;
            const ay  = LinePoint1.y;
            const by  = LinePoint2.y;
            let f;
            let CrossX;
            if(( (ay <= y)&&(y < by))||( (by <= y)&&(y < ay) )){
                const BX  = LinePoint2.x;
                const ax  = LinePoint1.x;
                if( ay == by ){
                    CrossX = ax;
                }else{
                    CrossX = (ax - BX) / (ay - by) * (y - ay) + ax;
                }
                f=true;
            }else{
                f=false;
            }
            const retV ={ok:f,
                CrossX:CrossX
            }
            return retV;
        }
    }

    //地図座標が緯度経度に変換可能かチェックする
    static Check_PsitionReverse_Enable(Position: point, MPDataMapZahyo: Zahyo_info) {

        let f;
        switch (MPDataMapZahyo.Mode) {
            case enmZahyo_mode_info.Zahyo_No_Mode:
            case enmZahyo_mode_info.Zahyo_HeimenTyokkaku: {
                f = true;
                break;
            }
            case enmZahyo_mode_info.Zahyo_Ido_Keido: {
                const oy = Position.y;
                f = true;
                switch (MPDataMapZahyo.Projection) {
                    case enmProjection_Info.prjSanson:
                    case enmProjection_Info.prjSeikyoEntou: {
                        if (Math.abs(oy / EarthR * 180 / Math.PI) > 90) {
                            f = false;
                        }
                        break;
                    }
                    case enmProjection_Info.prjMercator: {
                        //メルカトル図法ではyは無限大でtrue
                        break;
                    }
                    case enmProjection_Info.prjLambertSeisekiEntou: {
                        const tx = -oy / EarthR;
                        if (Math.abs(Math.atan(tx / Math.sqrt(-tx * tx + 1)) * 180 / Math.PI) > 90) {
                            f = false;
                        }
                        break;
                    }
                    case enmProjection_Info.prjMollweide: {
                        if (Math.abs(Position.y) > (Math.sqrt(2) * EarthR - 0.001)) {
                            f = false;
                        }
                        break;
                    }
                    case enmProjection_Info.prjEckert4: {
                        if (Math.abs(Position.y) > (1.3265004 * EarthR - 0.001)) {
                            f = false;
                        }
                        break;
                    }
                }
                break;
            }
        }
        return f;
    }


    //メッシュコードからメッシュの四角形緯度経度を求める
    static Get_Ido_Kedo_from_MeshCode(MeshCode: string, Mesh_Size: number) {

        MeshCode = (MeshCode + "0000000000").left(11);
        const id1 = Number(MeshCode.substr(0, 2));
        const id2 = Number(MeshCode.substr(4, 1));
        const id3 = Number(MeshCode.substr(6, 1));
        const kd1 = Number(MeshCode.substr(2, 2));
        const kd2 = Number(MeshCode.substr(5, 1));
        const kd3 = Number(MeshCode.substr(7, 1));
        const V2 = Number(MeshCode.substr(8, 1));
        const V4 = Number(MeshCode.substr(9, 1));
        const v8 = Number(MeshCode.substr(10, 1));
        let Ido = id1 / 1.5 + (id2 / 8) * (40 / 60) + (id3 / 10) * (5 / 60);
        let kdo = kd1 + 100 + (kd2 / 8) + (kd3 / 10) * (7.5 / 60);
        if (Mesh_Size == enmMesh_Number.mhOne_Tenth) {
            Ido = Ido + V2 * (30 / 3600) / 10;
            kdo = kdo + V4 * (45 / 3600) / 10;
        } else {
            if ((V2 == 3) || (V2 == 4)) {
                //1/2メッシュの北側
                Ido = Ido + (15 / 3600);
            }
            if ((V2 == 2) || (V2 == 4)) {
                //1/2メッシュの東側
                kdo = kdo + (22.5 / 3600);
            }
            if ((V4 == 3) || (V4 == 4)) {
                //1/4メッシュの北側
                Ido = Ido + (7.5 / 3600);
            }
            if ((V4 == 2) || (V4 == 4)) {
                //1/4メッシュの東側
                kdo = kdo + (11.25 / 3600);
            }
            if ((v8 == 3) || (v8 == 4)) {
                Ido = Ido + (3.75 / 3600);
            }
            if ((v8 == 2) || (v8 == 4)) {
                kdo = kdo + (5.625 / 3600);
            }
        }

        const meshWH = this.Get_MeshCode_Size_IdoKedo(Mesh_Size);
        return new latlonbox(new latlon(Ido + meshWH.height, kdo), new latlon(Ido, (kdo + meshWH.width)));
    }

    //メッシュの東西南北の幅を取得
    static Get_MeshCode_Size_IdoKedo(Mesh_Size: number) {

        let Xplus;
        let YPlus;

        switch (Mesh_Size) {
            case enmMesh_Number.mhFirst: {
                Xplus = 450 * 8 / 3600;
                YPlus = 300 * 8 / 3600;
                break;
            }
            case enmMesh_Number.mhSecond: {
                Xplus = 450 / 3600;
                YPlus = 300 / 3600;
                break;
            }
            case enmMesh_Number.mhThird:
            case enmMesh_Number.mhHalf:
            case enmMesh_Number.mhQuarter:
            case enmMesh_Number.mhOne_Eighth:
            case enmMesh_Number.mhOne_Tenth: {
                Xplus = 45 / 3600;
                YPlus = 30 / 3600;
                switch (Mesh_Size) {
                    case enmMesh_Number.mhHalf: {
                        Xplus = Xplus / 2;
                        YPlus = YPlus / 2;
                        break;
                    }
                    case enmMesh_Number.mhQuarter: {
                        Xplus = Xplus / 4;
                        YPlus = YPlus / 4;
                        break;
                    }
                    case enmMesh_Number.mhOne_Eighth: {
                        Xplus = Xplus / 8;
                        YPlus = YPlus / 8;
                        break;
                    } case enmMesh_Number.mhOne_Tenth:
                        Xplus = Xplus / 10;
                        YPlus = YPlus / 10;
                        break;
                }
            }
        }
        return new size(Xplus, YPlus);
    }

    //投影法の緯度に応じたスケール値の倍率を取得
    static Get_Scale_Baititu_IdoKedo(p: point, MPDataMapZahyo: Zahyo_info) {

        let v;
        switch (MPDataMapZahyo.Mode){
            case enmZahyo_mode_info.Zahyo_Ido_Keido: {
                switch (MPDataMapZahyo.Projection) {
                    case enmProjection_Info.prjSanson: {
                        v = 1;
                        break;
                    }
                    case enmProjection_Info.prjMollweide:
                    case enmProjection_Info.prjEckert4: {
                        const newP = this.Get_Reverse_XY(p, MPDataMapZahyo);
                        if (!newP) {
                            v = 1;
                            break;
                        }
                        const PA1 = this.Get_Converted_XY(new point(0, 0), MPDataMapZahyo);
                        const PA2 = this.Get_Converted_XY(new point(180, 0), MPDataMapZahyo);
                        const PB1 = this.Get_Converted_XY(new point(0, newP.y), MPDataMapZahyo);
                        const PB2 = this.Get_Converted_XY(new point(180, newP.y), MPDataMapZahyo);
                        if (!PA1 || !PA2 || !PB1 || !PB2) {
                            v = 1;
                            break;
                        }
                        const chk  = (Math.PI * EarthR) / (PA2.x - PA1.x)
                        const v2 = (PA2.x - PA1.x) / (PB2.x - PB1.x);
                        v = v2 / chk;
                        break;
                    }
                    case enmProjection_Info.prjSeikyoEntou:
                    case enmProjection_Info.prjMercator:
                    case enmProjection_Info.prjMiller:
                    case enmProjection_Info.prjLambertSeisekiEntou: {
                        const newP = this.Get_Reverse_XY(p, MPDataMapZahyo);
                        if (!newP) {
                            v = 1;
                            break;
                        }
                        const Ido = Generic.m_min_max(newP.y, -89.9, 89.9);
                        v = 1 / Math.cos(Ido * Math.PI / 180);
                    }
                }
                break;
            }
            case enmZahyo_mode_info.Zahyo_HeimenTyokkaku: {
                v = 1;
                break;
            }
            case enmZahyo_mode_info.Zahyo_No_Mode: {
                v = 1;
                break;
            }
        }
        return v;
    }

    //測地系をチェックして、違っていたら変換して返す
    static ConvertRefSystemLatLon(P1: latlon, OriginRefSystem: number, DestRefSystem: number) {

        if (OriginRefSystem == DestRefSystem) {
            return P1;
        } else {
        //測地系が違う場合は、データ中の緯度経度を地図の測地系に合わせて変換して代表点に
            let P2;
            switch (OriginRefSystem) {
                case (enmZahyo_System_Info.Zahyo_System_tokyo): {
                    P2 = this.Tokyo97toITRF94(P1);
                    break;
                }
                case (enmZahyo_System_Info.Zahyo_System_World): {
                    P2 = this.ITRF94toTokyo97(P1);
                    break;
                }
            }
            return P2;
        }
    }

    //測地系変換 Tokyo97 to ITRF94
    static Tokyo97toITRF94(latlonP: latlon) {

        return TKY2JGD.Tokyo97toITRF94(latlonP);
    }

    //測地系変換 ITRF94 to Tokyo97
    static ITRF94toTokyo97(latlonP: latlon) {

        return TKY2JGD.ITRF94toTokyo97(latlonP);
    }

    //扇形の座標を求める
    static Get_Fan_Coordinates(CP: point, r: number, start_p: number, end_p: number, CenterLineF: boolean) {

        const ST = 1 / (r * 2 / 5);
        const pxy = [];

        if (((start_p == 0) && (end_p == Math.PI * 2)) || (CenterLineF == false)) {
        } else {
            pxy[0] = CP;
        }

        if (end_p - start_p < ST) {
            pxy.push(new point(r * Math.sin(start_p) + CP.x, -r * Math.cos(start_p) + CP.y));
        } else {
            for (let i = start_p; i < end_p - ST; i += ST) {
                pxy.push(new point(r * Math.sin(i) + CP.x, -r * Math.cos(i) + CP.y))
            }
        }
        pxy.push(new point(r * Math.sin(end_p) + CP.x, -r * Math.cos(end_p) + CP.y));
        if ((start_p == 0) && (end_p == Math.PI * 2) || (CenterLineF == false)) {
        } else {
            pxy.push(CP.Clone());
        }
        return pxy;
    }

    //世界測地系の緯度経度の座標に変換して返す
    static Get_World_IdoKedo(oxy: point, MapZahyo_Info: Zahyo_info) {

        let x2, y2;
        const LatLon = new latlon();

        if (MapZahyo_Info.Mode == enmZahyo_mode_info.Zahyo_HeimenTyokkaku) {
            let Ellip12;
            //平面直角座標系の場合は緯度経度に変換
            if (MapZahyo_Info.System == enmZahyo_System_Info.Zahyo_System_tokyo) {
                Ellip12 = 1;
            } else {
                if (MapZahyo_Info.System == enmZahyo_System_Info.Zahyo_System_World) {
                    Ellip12 = 2;
                }
            }
            const Kei = MapZahyo_Info.HeimenTyokkaku_KEI_Number;
            TKY2JGD.doCalcXy2bl(Ellip12, Kei, oxy.y, oxy.x, y2, x2);
            LatLon.lon = x2 ?? 0;
            LatLon.lat = y2 ?? 0;
        } else {
            LatLon.lat = oxy.y;
            LatLon.lon = oxy.x;
        }

        if(MapZahyo_Info.System == enmZahyo_System_Info.Zahyo_System_tokyo ){
        //日本測地系の場合は世界測地系に変換
            const result = TKY2JGD.Tokyo97toITRF94({lat: LatLon.lat, lon: LatLon.lon});
            LatLon.lon = result.lon;
            LatLon.lat = result.lat;
        }
        return LatLon;
    }
    //地図座標を新しい設定の地図座標に変換する
    static Get_Reverse_and_Convert_XY(OldP: point, oldMapZahyo: Zahyo_info, newMapZahyo: Zahyo_info) {

        if (oldMapZahyo.Mode == enmZahyo_mode_info.Zahyo_No_Mode) {
            return OldP;
        } else {
            let XY2;
            let XY3;
            let P2 = spatial.Get_Reverse_XY(OldP, oldMapZahyo);
            if (!P2) {
                return OldP;
            }
            if ((newMapZahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido) && (oldMapZahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido)) {
                if (newMapZahyo.System != oldMapZahyo.System) {
                    //二つとも緯度経度座標で、測地系が違う場合
                    switch (oldMapZahyo.System) {
                        case enmZahyo_System_Info.Zahyo_System_tokyo:
                            XY2 = P2.toLatlon ? TKY2JGD.Tokyo97toITRF94(P2.toLatlon()) : undefined;
                            break;
                        case enmZahyo_System_Info.Zahyo_System_World:
                            XY2 = P2.toLatlon ? TKY2JGD.ITRF94toTokyo97(P2.toLatlon()) : undefined;
                            break;
                    }
                    if (!XY2 || typeof (XY2 as {toPoint?: () => point}).toPoint !== "function") {
                        return OldP;
                    }
                    P2 = (XY2 as {toPoint: () => point}).toPoint();
                }
            } else if ((oldMapZahyo.Mode == enmZahyo_mode_info.Zahyo_HeimenTyokkaku) && (newMapZahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido)) {
                //元が平面直角、新規が緯度経度の場合、

                let Ellip12;
                const Kei = oldMapZahyo.HeimenTyokkaku_KEI_Number;
                if (oldMapZahyo.System == enmZahyo_System_Info.Zahyo_System_tokyo) {
                    Ellip12 = 1;
                } else {
                    if (oldMapZahyo.System == enmZahyo_System_Info.Zahyo_System_World) {
                        Ellip12 = 2;
                    }
                    const y2 = { value: 0 };
                    const x2 = { value: 0 };
                    TKY2JGD.doCalcXy2bl(Ellip12, Kei, P2.y, P2.x, y2, x2);
                    XY2 = new latlon(y2.value, x2.value);
                    if (newMapZahyo.System != oldMapZahyo.System) {
                        //さらに測地系が違う場合
                        switch (oldMapZahyo.System) {
                            case enmZahyo_System_Info.Zahyo_System_tokyo:
                                XY3 = TKY2JGD.Tokyo97toITRF94(XY2.toLatlon())
                                break;
                            case enmZahyo_System_Info.Zahyo_System_World:
                                XY3 = TKY2JGD.ITRF94toTokyo97(XY2.toLatlon())
                                break;
                        }
                        XY2 = XY3.Clone();
                    }
                    P2 = XY2.toPoint();
                }
            }
            const P3 = spatial.Get_Converted_XY(P2, newMapZahyo);
            return P3;
        }
    }

    /** 世界測地系の緯度経度の座標を、地図ファイルの測地系が日本測地系だった場合、日本測地系の緯度経度に変換、平面直角座標系の場合は変換不可*/
    static Get_ReverseWorld_IdoKedo(oLatLon: latlon, MapZahyo: Zahyo_info) {

        if (MapZahyo.Mode != enmZahyo_mode_info.Zahyo_Ido_Keido) {
            alert("平面直角は不可")
        }

        if (MapZahyo.System == enmZahyo_System_Info.Zahyo_System_tokyo) {
            //日本測地系の場合は変換
            const xy2 = TKY2JGD.ITRF94toTokyo97(oLatLon);
            return xy2;
        } else {
            return oLatLon;
        }
    }

    /** 起終点座標だけを指定した境界線を面領域を描くように並べ替える、返す値は並び順とオブジェクトのポリゴン数*/
    static BoundaryArrangeGeneral(LieneNum: number, spxy: point[], epxy: point[]) {

        const boundArrange = new boundArrangeData();
        boundArrange.Fringe = boundArrange.Fringe ?? [];
        boundArrange.Arrange_LineCode = boundArrange.Arrange_LineCode ?? [];
        switch (LieneNum) {
            case 0:
                boundArrange.Pon = 0;
                return boundArrange;
                break;
            case 1:
                boundArrange.Pon = 1;
                const fr = new Fringe_Line_Info();
                fr.code = 0;
                fr.Direction = 1;
                boundArrange.Fringe[0] = fr;
                boundArrange.Arrange_LineCode[0] = [0, 1]
                return boundArrange;
                break;
        }
        const PointIndex = new clsSpatialIndexSearch(SpatialPointType.SinglePoint, false, undefined, undefined);
        let fnl = 0
        let Pon = 0
        let Eline2_n = 0
        const Eline2: number[] = [];
        for (let i = 0; i < LieneNum; i++) {
            if (spxy[i].Equals(epxy[i]) == true) {
                const fr = new Fringe_Line_Info();
                fr.code = i;
                fr.Direction = 1;
                boundArrange.Fringe[fnl] = fr;
                boundArrange.Arrange_LineCode[Pon] = [fnl, 1];
                Pon++;
                fnl++;
            } else {
                PointIndex.AddDoublePoint(spxy[i], epxy[i], i);
                Eline2.push(i);
                Eline2_n++;
            }
        }
        PointIndex.AddEnd();

        let Contf = false;
        let f = true;
        let Eline2_i = 0;
        let stxy;
        let exy;
        while (Eline2_i < Eline2_n) {
            f = false;
            if (Contf == false) {
                for (let i = 0; i < Eline2_n; i++) {
                    if (Eline2[i] != -1) {
                        boundArrange.Arrange_LineCode[Pon]=[fnl,1]
                        const LineNO: number = Eline2[i];
                        Eline2[i] = -1;
                        const fr = new Fringe_Line_Info();
                        fr.code = LineNO;
                        fr.Direction = 1;
                        boundArrange.Fringe[fnl] = fr;
                        fnl++;
                        Eline2_i++;
                        stxy = spxy[LineNO];
                        exy = epxy[LineNO];
                        PointIndex.RemoveObject_byTag(LineNO);
                        break;
                    }
                }
            }
            Contf = false;

            if (!exy) {
                f = false;
                break;
            }
            const k2: {ObjectNumber: number, Tag: number, PointNumber: number} = PointIndex.GetSamePointNumber(exy.x, exy.y);
            const LINENO2: number = k2.Tag;
            const PointNumber: number = k2.PointNumber;
            if (k2.ObjectNumber != -1) {
                Contf = true;
                Eline2[k2.ObjectNumber] = -1;
                boundArrange.Arrange_LineCode[Pon][1]++;
                const fr = new Fringe_Line_Info();
                fr.code = LINENO2;
                if (PointNumber == 0) {
                    const newExy = epxy[LINENO2];
                    if (!newExy) {
                        f = false;
                        break;
                    }
                    exy = newExy;
                    fr.Direction = 1 //順方向
                } else {
                    const newExy = spxy[LINENO2];
                    if (!newExy) {
                        f = false;
                        break;
                    }
                    exy = newExy;
                    fr.Direction = -1 //逆方向
                }
                boundArrange.Fringe[fnl] = fr;
                PointIndex.RemoveObject_byTag(LINENO2);
                Eline2_i++;
                fnl++;
            }
            if (!exy) {
                f = false;
                break;
            }
            if (!stxy) {
                f = false;
                break;
            }
            if (exy.Equals(stxy) == true) {
                Contf = false;
                Pon++;
                f = true;
            } else {
                if (Contf == false) {
                    f = false;
                    break;
                }
            }
        }
        if (f == false) {
            boundArrange.Pon = 0;
        } else {
            boundArrange.Pon = Pon;
        }
        return boundArrange;
    }

    static Get_Hairetu_Menseki(XY: point[], MapDataMap: { Zahyo: Zahyo_info; SCL: number }) {

        const n = XY.length ;
        const xy2 =Generic.ArrayClone(XY);
        if (MapDataMap.Zahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido) {
            //投影法が正積図法でない場合は座標を正積図法のものに変換
            switch (MapDataMap.Zahyo.Projection) {
                case enmProjection_Info.prjSeikyoEntou:
                case enmProjection_Info.prjMercator:
                case enmProjection_Info.prjMiller:
                    const RemapZahyo = new Zahyo_info();
                    RemapZahyo.Mode = enmZahyo_mode_info.Zahyo_Ido_Keido;
                    RemapZahyo.Projection = enmProjection_Info.prjLambertSeisekiEntou;
                    RemapZahyo.CenterXY = MapDataMap.Zahyo.CenterXY.Clone();
                    for (let j = 0; j < n; j++) {
                        const oxy = this.Get_Reverse_XY(XY[j], MapDataMap.Zahyo);
                        xy2[j] = this.Get_Converted_XY(oxy, RemapZahyo);
                    }
                    break;
            }
        }

        let men = 0;
        for (let j = 1; j < n-1; j++) {
            men += xy2[j].x * (xy2[j + 1].y - xy2[j - 1].y);
        }
        switch (MapDataMap.Zahyo.Mode) {
            case enmZahyo_mode_info.Zahyo_No_Mode:
                if (MapDataMap.SCL != 0) {
                    men = Math.abs(men / (MapDataMap.SCL * MapDataMap.SCL) / 2);
                } else {
                    men = Math.abs(men / 2);
                }
                break;
            case enmZahyo_mode_info.Zahyo_HeimenTyokkaku:
                men = Math.abs(men / (MapDataMap.SCL * MapDataMap.SCL) / 2);
                break;
             default:
                men = Math.abs(men / 2);
                break;

        }
        return men;
    }


    static CheckTwoPoint(xy1: point, xy2: point): boolean { //2つの座標が同じか調べる

        if ((xy1.x == xy2.x) && (xy1.y == xy2.y)) {
            return true;
        } else {
            return false;
        }
    }
    //四角形を回転させた外接四角形を求める
    static getCircumscribedRectangle_turned(Rect1: rectangle, Angle: number) {

        const p = this.Get_TurnedRectangle(Rect1, Angle);
        return this.getCircumscribedRectangle(p, undefined);
    }

    /**Circumscribed_Rectangleの上下左右とpointまたはrectangleを比較し、XYがより外側の場合は置き換える。point_rectangleがpointの配列の場合は、pointからrectangle作成 */
    static getCircumscribedRectangle(point_rectangle: point[] | point | rectangle, Circumscribed_Rectangle: rectangle | undefined) {


        let newRec;
        if ((point_rectangle instanceof Array) == true) {
            //地点配列の外接四角形
            newRec = new rectangle(point_rectangle[0].x, undefined, point_rectangle[0].y, point_rectangle[0].y);
            for (let i = 1; i < point_rectangle.length; i++) {
                const xy = point_rectangle[i];
                if (newRec.left > xy.x) newRec.left = xy.x;
                if (newRec.top > xy.y) newRec.top = xy.y;
                if (newRec.right < xy.x) newRec.right = xy.x;
                if (newRec.bottom < xy.y) newRec.bottom = xy.y;
            }

        } else {
            if (!Circumscribed_Rectangle) {
                return new rectangle(0, 0, 0, 0);
            }
            newRec = Circumscribed_Rectangle.Clone();
            if ((point_rectangle instanceof point) == true) {
                const xy = point_rectangle;
                if (Circumscribed_Rectangle.left > xy.x) newRec.left = xy.x;
                if (Circumscribed_Rectangle.top > xy.y) newRec.top = xy.y;
                if (Circumscribed_Rectangle.right < xy.x) newRec.right = xy.x;
                if (Circumscribed_Rectangle.bottom < xy.y) newRec.bottom = xy.y;
            } else {
                const Rect = point_rectangle;
                if (Circumscribed_Rectangle.left > Rect.left) newRec.left = Rect.left;
                if (Circumscribed_Rectangle.top > Rect.top) newRec.top = Rect.top;
                if (Circumscribed_Rectangle.right < Rect.right) newRec.right = Rect.right;
                if (Circumscribed_Rectangle.bottom < Rect.bottom) newRec.bottom = Rect.bottom;
            }
        }
        return newRec;
    }



    static Get_Inner_Rectangle(Rect1: rectangle, Rect2: rectangle) {

        //二つの四角形が交わっている場合に、重複領域の四角形を取得する 。交わっているかどうかの判定は行わない 
        const inR = new rectangle(0, undefined, 0, 0);
        inR.left = Math.max(Rect1.left, Rect2.left);
        inR.right = Math.min(Rect1.right, Rect2.right);
        inR.top = Math.max(Rect1.top, Rect2.top);
        inR.bottom = Math.min(Rect1.bottom, Rect2.bottom);
        return inR;
    }

    static Check_PointInBox(checkXY: point, Kakudo: number, Rect: rectangle) {//ポイントが四角形の中に入るかどうかチェック

        let ckP = checkXY.Clone();
        if (Kakudo != 0) {
            const rcp = Rect.centerP();
            ckP.offset(-rcp.x, -rcp.y);
            ckP=this.Trans2D(ckP, Kakudo, 0);
            ckP.offset(rcp.x, rcp.y);
        }
        if ((Rect.left <= ckP.x) && (ckP.x <= Rect.right) && (Rect.top <= ckP.y) && (ckP.y <= Rect.bottom)) {
            return true;
        } else {
            return false;
        }
    }



    static Get_TwoPoint_Rect_SingleGet_TwoPoint_Rect_Single(P1: point, P2: point) {

        //二つのポイントの外接四角形を求める
        const Rec = new rectangle(0, undefined, 0, 0);
        if (P1.x < P2.x) {
            Rec.left = P1.x;
            Rec.right = P2.x;
        } else {
            Rec.left = P2.x;
            Rec.right = P1.x;
        }
        if (P1.y < P2.y) {
            Rec.top = P1.y;
            Rec.bottom = P2.y;
        } else {
            Rec.top = P2.y;
            Rec.bottom = P1.y;
        }
        return Rec;
    }
    //二つの四角形の外接四角形を求める
    static Get_Rectangle_Union(rec1: rectangle, rec2: rectangle) {

        const r = new rectangle(0, undefined, 0, 0);
        if (rec1.left < rec2.left) { r.left = rec1.left } else { r.left = rec2.left };
        if (rec1.right < rec2.right) { r.right = rec2.right } else { r.right = rec1.right };
        if (rec1.top < rec2.top) { r.top = rec1.top } else { r.top = rec2.top };
        if (rec1.bottom < rec2.bottom) { r.bottom = rec2.bottom } else { r.bottom = rec1.bottom };
        return r;
    }

    //二つのポイントの外接四角形を求める
    //１つのポイントと半径rの円の外接四角形を求める
    //１つのポイントを中心としたsizeの外接四角形を求める
    static Get_Rectangle(P1: point, P2: number | size | point): rectangle {

        if ((typeof P2) === 'number') {
            const r = P2;
            return new rectangle(P1.x - r, P1.x + r, P1.y - r, P1.y + r);
        } else if ((P2 instanceof size) == true) {
            return new rectangle(P1.x - P2.width, P1.x + P2.width, P1.y - P2.height, P1.y + P2.height);
        } else {
            return new rectangle(Math.min(P1.x, P2.x), Math.max(P1.x, P2.x), Math.min(P1.y, P2.y), Math.max(P1.y, P2.y));
        }

    }

    //2つの四角形の上下左右端1つでも一致する場合true
    static Check_TwoRectangele_Inner_Contact(Rec1: rectangle, Rec2: rectangle): boolean {

        if ((Rec1.left == Rec2.left) || (Math.abs(Rec1.right - Rec2.right) < 0.000001) || (Rec1.top == Rec2.top) || (Math.abs(Rec1.bottom - Rec2.bottom) < 0.000001)) {
            return true;
        } else {
            return false;
        }
    }

    static Compare_Two_Rectangle_Position(Rec1: rectangle, Rec2: rectangle) {

        //二つの長方形の内外判定
        if ((Rec1.left > Rec2.right) || (Rec1.top > Rec2.bottom) || (Rec1.right < Rec2.left) || (Rec1.bottom < Rec2.top)) {
            return cstRectangle_Cross.cstOuter;    //ずれている
        } else if ((Rec1.left <= Rec2.right) && (Rec1.top <= Rec2.bottom) && (Rec1.right >= Rec2.left) && (Rec1.bottom >= Rec2.top)) {
            if ((Rec1.left >= Rec2.left) && (Rec1.top >= Rec2.top) && (Rec1.right <= Rec2.right) && (Rec1.bottom <= Rec2.bottom)) {
                return cstRectangle_Cross.cstInner;  //Rec2の中にRec1が含まれる
            } else {
                return cstRectangle_Cross.cstCross;  //交差している
            }
        } else if ((Rec1.left < Rec2.left) && (Rec1.top < Rec2.top) && (Rec1.right > Rec2.right) && (Rec1.bottom > Rec2.bottom)) {
            return cstRectangle_Cross.cstInclusion; //Rec1の中にRec2が含まれる
        }
    }

    static Compare_Two_Rectangle_Position_Inflated(Rec1: rectangle, Rec2: rectangle, inflate: number) {

        const rect12 = Rec1.Clone();
        const rect22 = Rec2.Clone();
        rect12.inflate(inflate,inflate);
        rect22.inflate(inflate,inflate);
        return this.Compare_Two_Rectangle_Position(rect12, rect22);
    }

    static Compare_Two_Rectangle_Position_turned(Rect1: rectangle, Rect1Angle: number, Rect2: rectangle) {

        const trect = this.getCircumscribedRectangle_turned(Rect1, Rect1Angle);
        return this.Compare_Two_Rectangle_Position(trect, Rect2);
    }

    static Distance(x1: number, y1: number, x2: number, y2: number) {

        const d = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        return d;
    }

    static Distance_Point (P1: point, P2: point): number {
        return this.Distance(P1.x,P1.y,P2.x,P2.y);
    }
    static trans3D (x: number, y: number, z: number, TurnCenter: point, Expantion: number, Pitch: number, Head: number, Bank: number, XYPara: number): point {
        const ESPara = Expantion / 100;
        const COSP = Math.cos(Pitch * Math.PI / 180);
        const SINP = Math.sin(Pitch * Math.PI / 180);
        const COSH = Math.cos(Head * Math.PI / 180);
        const SINH = Math.sin(Head * Math.PI / 180);
        const COSB = Math.cos(Bank * Math.PI / 180);
        const SINB = Math.sin(Bank * Math.PI / 180);

        const xx = x - TurnCenter.x;
        const yy = y - TurnCenter.y;
        const ZZ = z;
        const yy1 = yy * COSP - ZZ * SINP;
        const ZZ1 = yy * SINP + ZZ * COSP;
        const xx2 = xx * COSH + ZZ1 * SINH;
        const ZZ2 = -xx * SINH + ZZ1 * COSH;
        let XX3 = xx2 * COSB - yy1 * SINB;
        let YY3 = xx2 * SINB + yy1 * COSB;
        const Z3D = ZZ2 * ESPara;
        XX3 = XX3 * ESPara;
        YY3 = YY3 * ESPara;
        const ww = XYPara / (XYPara - Z3D);
        const newP = new point(XX3 * ww + TurnCenter.x, YY3 * ww + TurnCenter.y);
        return newP;
    }

    //回転中心を指定して二次元座標回転角度指定
    static Trans2D(CP: point, Kakudo_P: number | point, Kakudo?: number): point {

        const OutP = new point();
        if (typeof Kakudo_P === "number") {
            const k = Kakudo_P * Math.PI / 180
            OutP.x = CP.x * Math.cos(k) - CP.y* Math.sin(k);
            OutP.y = CP.x * Math.sin(k) + CP.y  * Math.cos(k);
        } else {
            const k = Kakudo * Math.PI / 180;
            const P = Kakudo_P;
            OutP.x = (P.x - CP.x) * Math.cos(k) - (P.y - CP.y) * Math.sin(k);
            OutP.y = (P.x - CP.x) * Math.sin(k) + (P.y - CP.y) * Math.cos(k);
            OutP.offset(CP);
        }
        return OutP;
    }


    //指定した高さ、幅のボックスの、回転後の外接四角形の高さ、幅を取得する
    static Get_TurnedBox(oSize: size, Angle: number): size {

        const rect = new rectangle(new point(-oSize.width / 2,- oSize.height / 2), oSize, undefined, undefined);
        const trect = this.getCircumscribedRectangle_turned(rect, Angle);
        return trect.size();
    }

    //回転させた四角形の座標配列を取得。戻り値は5つの座標
    static Get_TurnedRectangle(Rect: rectangle, Kakudo: number): point[] {

        const x1 = Rect.left;
        const y1 = Rect.top;
        const x2 = Rect.right;
        const y2 = Rect.bottom;

        const pxy = [];
        pxy.push(new point(x1, y1));
        pxy.push(new point(x2, y1));
        pxy.push(new point(x2, y2));
        pxy.push(new point(x1, y2));
        if (Kakudo != 0) {
            const cp = Rect.centerP();
            for (let i = 0; i < 3; i++) {
                pxy[i] = spatial.Trans2D(cp, pxy[i], -Kakudo);
            }
        }
        pxy.push(pxy[0].Clone());
        return pxy;
    }

    static Distance_PointLine2(P: point, LineP1: point, LineP2: point): {distance: number; nearP: point}{

        return this.Distance_PointLine(P.x,P.y,LineP1.x,LineP1.y,LineP2.x,LineP2.y);
    }
    static Distance_PointLine (X: number, Y: number, ax: number, ay: number, BX: number, BY: number): {distance: number; nearP: point} {
        //AXAY,BXBYで定義される線分と、XYポイントの間の距離
        //Nearest_point:最も近い位置の線分上の点を取得（オプション）

        let Nearest_pointX, Nearest_pointY;
        let po = 0;
        const xs = BX - ax;
        const Ys = BY - ay;
        const d1 = this.Distance(X, Y, ax, ay);
        const d2 = this.Distance(X, Y, BX, BY);
        let D;
        if (xs == 0) {
            if ((Math.min(ay, BY) <= Y) && (Y <= Math.max(ay, BY))) {
                D = Math.abs(X - ax);
                Nearest_pointX = ax;
                Nearest_pointY = Y;
            } else {
                po = 1;
            }
        } else if (Ys == 0) {
            if ((Math.min(ax, BX) <= X) && (Y <= Math.max(ax, BX))) {
                D = Math.abs(Y - ay);
                Nearest_pointX = X;
                Nearest_pointY = ay;
            } else {
                po = 1;
            }
        } else {
            const a = Ys / xs;
            const b = -a * ax + ay;

            const Va = -1 / a;
            const Va2 = -Va * X + Y;
            const crossX = (Va2 - b) / (a - Va);
            if ((Math.min(ax, BX) <= crossX) && (crossX <= Math.max(ax, BX))) {
                D = Math.abs(-Ys * X + xs * Y - xs * ay + Ys * ax) / Math.sqrt(xs * xs + Ys * Ys);
                Nearest_pointX = crossX;
                Nearest_pointY = crossX * a + b;
            } else {
                po = 1;
            }
        }

        if (po == 1) {
            if (d1 < d2) {
                D = d1;
                Nearest_pointX = ax;
                Nearest_pointY = ay;
            } else {
                D = d2;
                Nearest_pointX = BX;
                Nearest_pointY = BY;
            }
        }
        return {distance:D,nearP:new point(Nearest_pointX,Nearest_pointY)};

    }

    //緯度経度等もともとの座標から、投影変換した座標を返す
    static Get_Converted_XY (Position: point, MPDataMapZahyo: zahyohenkan) {
        const ox = Position.x;
        let oy = Position.y;
        switch (MPDataMapZahyo.Mode) {
            case enmZahyo_mode_info.Zahyo_No_Mode: {
                return new point(ox, oy);
                break;
            }
            case enmZahyo_mode_info.Zahyo_HeimenTyokkaku: {
                return new point(ox, -oy);
                break;
            }
            case enmZahyo_mode_info.Zahyo_Ido_Keido: {
                switch (MPDataMapZahyo.Projection) {
                    case enmProjection_Info.prjSeikyoEntou: {
                        return new point(EarthR * (ox - MPDataMapZahyo.CenterXY.x) * Math.PI / 180,
                            - EarthR * oy * Math.PI / 180);
                        break;
                    }
                    case enmProjection_Info.prjMercator: {
                        const newP = new point();
                        newP.x = EarthR * ((ox - MPDataMapZahyo.CenterXY.x) * Math.PI / 180);
                        if (oy >= 89.9999) {
                            oy = 89.9999;
                        } else if (oy <= -89.9999) {
                            oy = -89.9999;
                        }
                        newP.y = -EarthR * Math.log(Math.tan((45 + oy / 2) * Math.PI / 180));
                        return newP;
                        break;
                    }
                    case enmProjection_Info.prjMiller: {
                        return new point(EarthR * ((ox - MPDataMapZahyo.CenterXY.x) * Math.PI / 180),
                            - EarthR * Math.log(Math.tan((45 + oy * 2 / 5) * Math.PI / 180)) * 1.25);
                        break;
                    }
                    case enmProjection_Info.prjLambertSeisekiEntou: {
                        return new point(EarthR * ((ox - MPDataMapZahyo.CenterXY.x) * Math.PI / 180),
                            - EarthR * Math.sin(oy * Math.PI / 180));
                        break;
                    }
                    case enmProjection_Info.prjSanson: {
                        return new point(EarthR * ((ox - MPDataMapZahyo.CenterXY.x) * Math.PI / 180) * Math.cos(oy * Math.PI / 180),
                            - EarthR * oy * Math.PI / 180);
                        break;
                    }
                    case enmProjection_Info.prjMollweide: {
                        const theata = this.newtonMollweide(oy);
                        if (theata != undefined) {
                            const x = EarthR * Math.sqrt(2) / 90 * (ox - MPDataMapZahyo.CenterXY.x) * Math.cos(theata);
                            const y = -EarthR * Math.sqrt(2) * Math.sin(theata);
                            return new point(x, y);
                        } else {
                            return new point(0, 0);
                        }
                        break;
                    }
                    case enmProjection_Info.prjEckert4: {
                        const theata = this.newtonEckert4(oy);
                        if (theata != undefined) {
                            const x = EarthR * 0.4222382 * ((ox - MPDataMapZahyo.CenterXY.x) * Math.PI / 180) * (1 + Math.cos(theata));
                            const y = -EarthR * 1.3265044 * Math.sin(theata);
                            return new point(x, y);
                        } else {
                            return new point(0, 0);
                        }
                        break;
                    }
                }
            }
        }
    }
    static newtonMollweide (lat: number) {
        let x = 0;
        const lat2 = lat * Math.PI / 180;
        let n = 0;
        let dx;
        do {
             dx = -(x + Math.sin(x) - Math.PI * Math.sin(lat2)) / (Math.cos(x) + 1);
            x += dx;
            n++;
            if (n > 50) {
                return undefined;
            }
        } while (Math.abs(dx) >= 0.00001)
        return x / 2;
    }

    static newtonEckert4 (lat: number) {
        let x = 0;
        const lat2 = lat * Math.PI / 180;
        let n = 0;
        let dx;
        do {
             dx = -(x + Math.sin(x) * Math.cos(x) + 2 * Math.sin(x) - (2 + Math.PI / 2) * Math.sin(lat2)) / (1 + Math.cos(2 * x) + 2 * Math.cos(x));
            x += dx;
            n++;
            if (n > 50) {
                return undefined;
            }
        } while (Math.abs(dx) >= 0.00001)
        return x;
    }


    static Check_Zahyo_Projection_Convert_Enabled (OriginMap: zahyohenkan, ConvertMap: zahyohenkan) {
        /// <signature>
        /// <summary>座標系・測地系が変換可能か調べる</summary>
        /// <param name="OriginMap">もともとの座標系</param>  
        /// <param name="ConvertMap">変換予定の座標系</param>  
        /// </signature>
        if (((OriginMap.Mode == enmZahyo_mode_info.Zahyo_No_Mode) && (ConvertMap.Mode != enmZahyo_mode_info.Zahyo_No_Mode)) ||
            ((OriginMap.Mode != enmZahyo_mode_info.Zahyo_No_Mode) && (ConvertMap.Mode == enmZahyo_mode_info.Zahyo_No_Mode))) {
            const mes = "座標系の設定していないデータと、設定してあるデータを重ねることはできません。";
            return { ok: false, emes: mes };
        }
        if (((OriginMap.Mode == enmZahyo_mode_info.Zahyo_No_Mode) && (ConvertMap.Mode != enmZahyo_mode_info.Zahyo_No_Mode)) ||
            ((OriginMap.Mode != enmZahyo_mode_info.Zahyo_No_Mode) && (ConvertMap.Mode == enmZahyo_mode_info.Zahyo_No_Mode))) {
            const mes = "座標系の設定していないデータと、設定してあるデータを重ねることはできません。";
            return { ok: false, emes: mes };
        }
        if ((OriginMap.Mode == enmZahyo_mode_info.Zahyo_HeimenTyokkaku) && (ConvertMap.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido)) {
            const mes =  "平面直角座標系のデータ上に緯度経度座標系のデータは追加できません。";
            return { ok: false, emes: mes };
        }
        if ((OriginMap.Mode == enmZahyo_mode_info.Zahyo_HeimenTyokkaku) && (OriginMap.Mode == enmZahyo_mode_info.Zahyo_HeimenTyokkaku)) {
            if (ConvertMap.HeimenTyokkaku_KEI_Number != OriginMap.HeimenTyokkaku_KEI_Number) {
                const mes =  "平面直角座標系の系番号が違います。";
                return { ok: false, emes: mes };
            }
            if (ConvertMap.System != OriginMap.System) {
                const mes =  "平面直角座標系の測地系が違います。";
                return { ok: false, emes: mes };
            }
        }
        return { ok: true, emes: "" };
    }
    //緯度経度・平面直角座標系を変換した四角形の四隅座標から、元の緯度経度・平面直角座標系座標に戻す
    static Get_Reverse_Rect (In_Rect: rectangle, MPDataMapZahyo: zahyohenkan) {
        const leftP1 = this.Get_Reverse_XY(new point(In_Rect.left, In_Rect.top), MPDataMapZahyo) ?? new point(0, 0);
        const leftP2 = this.Get_Reverse_XY(new point(In_Rect.left, (In_Rect.top + In_Rect.bottom) / 2), MPDataMapZahyo) ?? new point(0, 0);
        const leftP3 = this.Get_Reverse_XY(new point(In_Rect.left, In_Rect.bottom), MPDataMapZahyo) ?? new point(0, 0);

        const left = Math.min(Math.min(leftP1.x, leftP2.x), leftP3.x);

        const rightP4 = this.Get_Reverse_XY(new point(In_Rect.right, In_Rect.top), MPDataMapZahyo) ?? new point(0, 0);
        const rightP5 = this.Get_Reverse_XY(new point(In_Rect.right, (In_Rect.top + In_Rect.bottom) / 2), MPDataMapZahyo) ?? new point(0, 0);
        const rightP6 = this.Get_Reverse_XY(new point(In_Rect.right, In_Rect.bottom), MPDataMapZahyo) ?? new point(0, 0);

        const right = Math.max(Math.max(rightP4.x, rightP5.x), rightP6.x);

        return new rectangle(left, right, leftP3.y, leftP1.y);
    }

    //緯度経度・平面直角座標系を変換した座標(地図ファイル中の座標)から、元の緯度経度・平面直角座標系座標に戻す
    static Get_Reverse_XY (Position: point, MPDataMapZahyo: zahyohenkan) {
        const ox = Position.x;
        const oy = Position.y;
        const mz = MPDataMapZahyo;
        const newP = new point();
        let theata;
        switch (mz.Mode) {
            case enmZahyo_mode_info.Zahyo_No_Mode:
                return new point(ox, oy);
                break;
            case enmZahyo_mode_info.Zahyo_HeimenTyokkaku:
                return new point(ox, -oy);
                break;
            case enmZahyo_mode_info.Zahyo_Ido_Keido:
                switch (mz.Projection) {
                    case enmProjection_Info.prjSanson:
                        const y = -oy / EarthR * 180 / Math.PI;
                        return new point(mz.CenterXY.x + (ox * 180) / (EarthR * Math.PI * Math.cos(y * Math.PI / 180)), y);
                        break;
                    case enmProjection_Info.prjSeikyoEntou:
                        return new point(mz.CenterXY.x + (ox * 180) / (EarthR * Math.PI), - oy / EarthR * 180 / Math.PI);
                        break;
                    case enmProjection_Info.prjMercator:
                        const tx = Math.exp(-oy / EarthR);
                        return new point(mz.CenterXY.x + (ox * 180) / (EarthR * Math.PI), 2 * Math.atan(tx) * 180 / Math.PI - 90);
                        break;
                    case enmProjection_Info.prjMiller:
                        const tx2 = Math.exp(-oy / (EarthR * 1.25));
                        return new point(mz.CenterXY.x + (ox * 180) / (EarthR * Math.PI), Math.atan(tx2) * 5 / 2 * 180 / Math.PI - 45 * 5 / 2);
                        break;
                    case enmProjection_Info.prjLambertSeisekiEntou:
                        newP.x = mz.CenterXY.x + (ox * 180) / (EarthR * Math.PI);
                        const tx3 = -oy / EarthR;
                        if (tx3 >= 1) {
                            newP.y = 90;
                        } else if (tx3 <= -1) {
                            newP.y = -90;
                        } else {
                            newP.y = Math.atan(tx3 / Math.sqrt(-tx3 * tx3 + 1)) * 180 / Math.PI;
                        }
                        return newP
                        break;
                    case enmProjection_Info.prjMollweide:
                        if (Math.abs(Position.y) > (Math.sqrt(2) * EarthR - 0.001)) {
                            Position.y = (Math.sqrt(2) * EarthR - 0.001) * Math.sign(Position.y);
                        }
                        theata = Math.asin(Position.y / (Math.sqrt(2) * EarthR));
                        newP.y = -Math.asin((2 * theata + Math.sin(2 * theata)) / Math.PI) * 180 / Math.PI;
                        newP.x = MPDataMapZahyo.CenterXY.x + Math.PI * Position.x / (2 * EarthR * Math.sqrt(2) * Math.cos(theata)) * 180 / Math.PI;
                        return newP
                        break;
                    case enmProjection_Info.prjEckert4:
                        if (Math.abs(Position.y) > (1.3265004 * EarthR - 0.001)) {
                            Position.y = (1.3265004 * EarthR - 0.001) * Math.sign(Position.y);
                        }
                        theata = Math.asin(Position.y / (1.3265004 * EarthR));
                        newP.y = -Math.asin((theata + Math.sin(theata) * Math.cos(theata) + 2 * Math.sin(theata)) / (2 + Math.PI / 2)) * 180 / Math.PI;
                        newP.x = MPDataMapZahyo.CenterXY.x + Position.x / (0.4223382 * EarthR * (1 + Math.cos(theata))) * 180 / Math.PI;
                        return newP
                        break;
                }
                break;
        }
    }
}

export class Generic {

    /**読み込み中マーク 処理終了後に Generic.clear_backDiv();で消す*/
    static readingIcon(title: string){

        const boxReading = Generic.set_backDiv("", title, 300, 150, false, false, undefined, 0.2, false);     
        Generic.createNewDiv(boxReading,  " 読み込み中", "", "grayFrame", 30, 50, 230, 40, "padding:5px", undefined);   
        Generic.createNewImage(boxReading, "image/icon_loader.gif", "", "", "", 140, 110, "", undefined);
    }
    /**外部クリップボードから貼り付け */
    static outerPaste(okCall: (value: string) => void, cancelCall: (() => void) | undefined){

        const backDiv = Generic.set_backDiv("", "外部から貼り付け", 200, 240, true, true, buttonOK, 0.2, true,true,cancelCall);
        Generic.createNewSpan(backDiv,"下に貼り付けて下さい(Ctrl+V)","","",15,40,"",undefined);
        const tx=Generic.createNewTextarea(backDiv,"","",15,65,10,10,"width:170px;height:120px;resize: none;");
        tx.focus();
        function buttonOK(){
            Generic.clear_backDiv();
            okCall( tx.value);
        }
    }

    /**オブジェクト名と設定期間の組み合わせ文字列を返す */
    static getTimeList(OnameStac: Object_NameTimeStac_Data, separator = "") {

        const tx = "【" + OnameStac.connectNames() + "】" + separator + clsTime.StartEndtoString(OnameStac.SETime);
        return tx;
    }
    /**メッシュコードの名称を取得 */
    static ConvertMeshTypeFromEnum(MeshNumber: number) {

        switch (MeshNumber) {
            case enmMesh_Number.mhNonMesh:
                return "";
            case enmMesh_Number.mhFirst:
                return "1次メッシュ";
            case enmMesh_Number.mhSecond:
                return "2次メッシュ";
            case enmMesh_Number.mhThird:
                return "3次メッシュ";
            case enmMesh_Number.mhHalf:
                return "1/2メッシュ";
            case enmMesh_Number.mhQuarter:
                return "1/4メッシュ";
            case enmMesh_Number.mhOne_Eighth:
                return "1/8メッシュ";
            case enmMesh_Number.mhOne_Tenth:
                return "1/10メッシュ";
        }
    }
    static ConvertMeshTypeFromString(MeshType: string) {

        switch (MeshType) {
            case "":
                return enmMesh_Number.mhNonMesh;
            case "1次メッシュ":
                return enmMesh_Number.mhFirst;
            case "2次メッシュ":
                return enmMesh_Number.mhSecond;
            case "3次メッシュ":
                return enmMesh_Number.mhThird;
            case "1/2メッシュ":
                return enmMesh_Number.mhHalf;
            case "1/4メッシュ":
                return enmMesh_Number.mhQuarter;
            case "1/8メッシュ":
                return enmMesh_Number.mhOne_Eighth;
            case "1/10メッシュ":
                return enmMesh_Number.mhOne_Tenth;
        }
    }
    /** レイヤタイプの文字列を返す*/
    static ConvertStringFromLayerType(Type: number) {

        switch (Type) {
            case enmLayerType.Normal:
                return "通常のレイヤ";
                break;
            case enmLayerType.Mesh:
                return "メッシュレイヤ";
                break;
            case enmLayerType.DefPoint:
                return "地点定義レイヤ";
                break;
        }
    }
    static ConvertStringLayerFromString(TypeStr: string) {

        switch (TypeStr) {
            case "通常のレイヤ":
                return enmLayerType.Normal;
                break;
            case "メッシュレイヤ":
                return enmLayerType.Mesh;
                break;
            case "地点定義レイヤ":
                return enmLayerType.DefPoint;
                break;
        }
    }

    /** 属性データ編集で欠損値扱い欄に表示する文字を返す*/
    static ConvertMissingValueFromBool(MissingValueF: boolean) {

        switch (MissingValueF) {
            case true:
                return "欠損値";
                break;
            default:
                return "0または空白";
                break;
        }
    }
    static ConvertMissingValueFromString(MissingStr: string) {

        switch (MissingStr) {
            case "欠損値":
                return true;
                break;
            case "0または空白":
                return false;
                break;
        }
    }


    /**条件検索の文字を返す */
    static getConditionString(con: number){

        switch (con) {
            case enmCondition.Less:
                return "未満";
                break;
            case enmCondition.LessEqual:
                return "以下";
                break;
            case enmCondition.Equal:
                return "等しい";
                break;
            case enmCondition.GreaterEqual:
                return "以上";
                break;
            case enmCondition.Greater:
                return "より大きい";
                break;
            case enmCondition.NotEqual:
                return "以外";
                break;
            case enmCondition.Include:
                return "文字を含む";
                break;
            case enmCondition.Exclude:
                return "文字を含まない";
                break;
            case enmCondition.Head:
                return "先頭の文字";
                break;
            case enmCondition.Foot:
                return "末尾の文字";
                break;
        }
    }

    /**文字列配列Wordsをチェックして「新規1」「新規2」など連番を付ける */
    static Get_New_Numbering_Strings(CheckWords: string, Words: string[]) {

        const L = CheckWords.length;
        let V = 0;
        for (let i = 0; i < Words.length; i++) {
            if (Words[i].left(L) == CheckWords) {
                V = Math.max(Math.floor(Words[i].mid(L, undefined)), V);
            }
        }
        return CheckWords + String(V + 1);
    }

    /**オブジェクト名の漢字を統一する。比較する漢字が含まれていた場合にtrue */
    static ObjName_Kanji_Compatible(objName: string){

        const Word_Compatible  = clsSettingData.ObjectName_Word_Compatible.split("|");
        let f = false;

        const oldCharacter  = "亞圍壹飮榮艷應毆穩壞覺樂寬罐陷戲據峽鄕驅徑溪莖鷄缺圈獻險嚴恆國濟劑慘贊絲兒實釋獸肅緖敍稱剩條疊囑愼盡醉數聲攝專潛錢壯插裝續對臺澤擔彈遲鑄敕遞點黨當獨屆貳霸發濱福變辨舖寶餠藥餘搖來龍獵禮齡戀爐朗惡爲隱衞圓鹽橫假畫繪擴學勸歡觀顏歸龜犧擧挾勳惠經螢藝儉檢顯效鑛碎櫻雜棧殘辭舍壽從縱處奬燒證壤淨讓觸眞圖隨樞靜竊戰纖禪總騷臟墮帶瀧單膽斷晝鎭鐵傳盜讀繩惱廢賣髮甁拂邊瓣襃沒萬譯與樣賴覽綠隸勞樓灣壓醫稻營驛奧歐價會懷殼嶽卷關氣僞舊狹曉區薰繼輕劍權縣驗廣號黑齋册參蠶齒濕寫收澁諸將祥乘孃釀寢神粹髓瀨齊淺踐曾雙搜爭莊增藏屬體滯擇團癡蟲廳聽塚轉都燈德腦拜麥拔蠻祕佛竝辯穗豐飜滿默彌豫譽謠亂隆兩壘勵靈";
        const newCharacter  = "亜囲壱飲栄艶応殴穏壊覚楽寛缶陥戯拠峡郷駆径渓茎鶏欠圏献険厳恒国済剤惨賛糸児実釈獣粛緒叙称剰条畳嘱慎尽酔数声摂専潜銭壮挿装続対台沢担弾遅鋳勅逓点党当独届弐覇発浜福変弁舗宝餅薬余揺来竜猟礼齢恋炉朗悪為隠衛円塩横仮画絵拡学勧歓観顔帰亀犠挙挟勲恵経蛍芸倹検顕効鉱砕桜雑桟残辞舎寿従縦処奨焼証壌浄譲触真図随枢静窃戦繊禅総騒臓堕帯滝単胆断昼鎮鉄伝盗読縄悩廃売髪瓶払辺弁褒没万訳与様頼覧緑隷労楼湾圧医稲営駅奥欧価会懐殻岳巻関気偽旧狭暁区薫継軽剣権県験広号黒斎冊参蚕歯湿写収渋諸将祥乗嬢醸寝神粋髄瀬斉浅践曽双捜争荘増蔵属体滞択団痴虫庁聴塚転都灯徳脳拝麦抜蛮秘仏並弁穂豊翻満黙弥予誉謡乱隆両塁励霊";

        for(let i  = 0 ;i< Word_Compatible.length;i++){
            for(let j  = 1 ;j< Word_Compatible[i].length;j++){
                const k  =objName.indexOf(Word_Compatible[i].mid( j, 1));
                if(k != -1 ){
                    objName=objName.midReplace( k, Word_Compatible[i].left(1));
                    f = true;
                }
            }
        }

        if(clsSettingData.KatakanaCheck == true ){
            const katakana=Generic.Array2Dimension(3,2, undefined); 
            katakana[0][ 0] = "ヴァ"
            katakana[0][ 1] = "バ"
            katakana[1][ 0] = "ティ"
            katakana[1][ 1] = "チ"
            katakana[2][ 0] = "ヴェ"
            katakana[2][ 1] = "ベ"
            for(let i  = 0 ;i<= 2;i++){
                const k  = objName.indexOf(katakana[i][ 0]);
                if(k != -1 ){
                    objName = objName.midReplace(katakana[i][0], katakana[i][1]);
                    f = true;
                }
            }
        }

        //新字体旧字体比較
        if(clsSettingData.SinKyuCharacter == true ){
            for(let j  = 1 ;j<  objName.length;j++){
                const k  = oldCharacter.indexOf( objName.mid( j, 1));
                if(k != -1 ){
                    objName =objName.midReplace(j,  newCharacter.mid( k, 1));
                    f = true;
                }
            }
        }
        return {newObjname:objName,changeF:f};
    }

    /**レイヤの種類の名称 */
    static getLayerTypeName(layType: number){

        let tx = "";
        const enmLayerType = { Normal: 0, Trip_Definition: 1, Trip: 2, Mesh: 3, DefPoint: 4 };
        switch (layType) {
            case enmLayerType.Normal:
                tx = "通常のレイヤ";
                break;
            case enmLayerType.Mesh:
                tx = "メッシュレイヤ";
                break;
            case enmLayerType.DefPoint:
                tx = "地点定義レイヤ";
                break;
        }
        return tx;
    }

    /**スペース、カンマ、タブで区切る */
    static String_Cut(Wo: string, Spliter: string){

        const CUT = [];
        const vbQuate = String.fromCharCode(34);
        if (Wo.length == 0) {
            return [""];
        }
        switch (Spliter) {
            case " ": { //スペース区切り
                if (Wo == " ".repeat(Wo.length)) {
                    return [""];
                }
                while (Wo.left( 1) == " ") {
                    Wo = Wo.mid(1, undefined);
                }
                Wo += " ";
                let qua_f = false;
                let ST = 0;
                for (let i = 0; i < Wo.length; i++) {
                    const w = Wo.mid(i, 1);
                    if (w == vbQuate) {
                        qua_f = !qua_f;
                    }
                    switch (w) {
                        case " ": {
                            if (qua_f == false) {
                                let Cutw = Wo.mid( ST, i - ST);
                                if (Cutw.left(1) == vbQuate) {
                                    Cutw = Cutw.mid(1, undefined);
                                }
                                if (Cutw.right(1) == vbQuate) {
                                    Cutw = Cutw.left(Cutw.length - 1);
                                }
                                CUT.push(Cutw);
                                while (Wo.mid(i, 1) == " ") {
                                    i++;
                                }
                                ST = i;
                                i -= 1;
                            }
                            break;
                        }
                    }
                }
                return CUT;
                break;
            }
            case ",": { //カンマ区切り
                Wo += ",";
                let qua_f = false;
                let wf = false;

                let ST = 0;
                for (let i = 0; i < Wo.length; i++) {
                    const w = Wo.mid(i, 1);
                    switch (w) {
                        case vbQuate: {
                            qua_f = !qua_f;
                            wf = true;
                            if (qua_f == true) {
                                ST = i;
                            }
                            break;
                        }
                        case ",": {
                            if (qua_f == false) {
                                let Cutw;
                                if (wf == false) {
                                    Cutw = Wo.mid(ST, i - ST).trim();
                                    ST = i + 1
                                } else {
                                    Cutw = Wo.mid(ST + 1, i - ST - 2);
                                    ST = i + 1;
                                    wf = false;
                                }
                                CUT.push(Cutw);
                            }
                            break;
                        }
                    }
                }
                return CUT;
                break;
            }
            case '\t': { //タブ区切り
                const RetCut = Wo.split(('\t'));
                for (let i = 0; i < RetCut.length; i++) {
                    RetCut[i] = RetCut[i].trim();
                }
                return RetCut;
                break;
            }
        }

    }

    /**地図ファイルをgetMapfileByHttpRequestで開き、JSONで返す */
    static getMapfileByHttpRequest(url: string, readCall: (data: MapData | string) => void): void {

        
        Generic.readingIcon("地図ファイル読み込み");
        const ext=Generic.getExtension(url).toLowerCase();
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = "blob";
        xhr.onload = function () {
            if (xhr.status === 200) {
                const file = new Blob([xhr.response]);
                Generic.unzipFile(file, unzipOk, unzipError);
                function unzipOk(data: {[key: string]: Uint8Array}) {
                    const key = Object.keys(data)[0];
                    if(ext=="mpfj"){
                        readCall(JSON.parse(Generic.utf8ArrayToStr(data[key]))) ;
                    }else{
                        readCall(Generic.utf8ArrayToStr(data[key])) ;
                    }
                    Generic.clear_backDiv();
                }
                function unzipError(err: Error) {
                    Generic.clear_backDiv();
                    alert(url+"の展開に失敗しました");
                }
            }
        };
        xhr.onerror=function(){
            Generic.clear_backDiv();
            alert(url+"のダウンロードに失敗しました");
        }
        xhr.send(null);
    }

    /**画像ウインドウ表示 */
    static windowCenterOpen(img: string, Xv: number, Yv: number, title: string) {

    const Xw = Xv + 10;
    const Yw = Yv + 80;
    const  new1 = window.open("", "_blank", "titlebar=No,directories=no,resizable=Yes,width=" + Xw + ",height=" + Yw + "");
    if (!new1) {
        return;
    }

    new1.document.write("<html><head><meta http-equiv=Content-Type content=\"text/html charset=utf-8\"><title>" + title + "</title></head><body bgcolor=#FFFFFF>");
    const  imgs = "<img src=" + img + ">"
    new1.document.write(imgs);
    new1.document.write("</br>画像を右クリックして保存またはコピーして下さい。</br></br>");
    new1.document.write("<center><input type=button value='このウインドウを閉じる' onClick='window.close()'></center>");
    new1.document.write("</body></html>");
    new1.document.close();
}

/** ウィンドウでutl表示 */
static windowCenterPage(help_url: string, Xv: number, Yv: number) {


    const Xw = Xv + 50;
    const Yw = Yv + 80;
    const  new2 = window.open(help_url, "_blank", "titlebar=No,status=0,scrollbars=1,resizable=0,width=" + Xw + ",height=" + Yw + "");
    if (new2 && Number(navigator.appVersion.charAt(0)) >= 3) { new2.focus() };
}

/**prompt入力 event_pointがundefinedの場合は画面中央表示*/
    static prompt(event_point: point | undefined, promptText: string, defoText: string, okCall: (value: string) => void, textAlign='left', cancelCall: (() => void) | undefined = undefined) {

        const gsize = Generic.getDivSize(promptText, 270, "");
        const fheight = (gsize.height) + 130;
        const alertObj = Generic.set_backDiv("", "MANDARA JS", 300, fheight, true, true, buttonOK, 0.2, false,true,cancelCall);
        if (event_point != undefined) {
            Generic.Set_Box_Position_in_Browser(event_point, alertObj);
        }
        this.createNewDiv(alertObj, promptText, "", "", 15, 40, 270, undefined, "", undefined);
        const inbox = Generic.createNewInput(alertObj, 'text', defoText, "", 15, gsize.height + 50, undefined, "width:270px;text-align:"+textAlign);
         inbox.select();
        inbox.onkeydown = function (e) {
            if (e.keyCode == 13) {
                const children = alertObj.childNodes;
                for (const i in children) {
                    if ((children[i] as HTMLInputElement).name == "ok") {
                        (children[i] as HTMLInputElement).focus();
                        break;
                    }
                }
            }else if(e.keyCode == 27){
                const children = alertObj.childNodes;
                for (const i in children) {
                    if ((children[i] as HTMLInputElement).name == "cancel") {
                        (children[i] as HTMLInputElement).click();
                        break;
                    }
                }
            }
        }
        function buttonOK() {
            Generic.clear_backDiv();
            okCall(inbox.value);
        }
    }

    /**yes　noの確認 event_point:表示座標*/
    static confirm(event_point: point | undefined, text: string, yesFunc: (() => void) | undefined, noFunc: (() => void) | undefined) {

        const gsize=Generic.getDivSize(text,220,"");
        const fheight=(gsize.height)+100;
        const fw=250;
        const confirmObj = Generic.set_backDiv("", "MANDARA JS",fw, fheight, false, false, undefined, 0.2,false);
        if(event_point!=undefined){
            Generic.Set_Box_Position_in_Browser(event_point, confirmObj);
        }
        this.createNewDiv(confirmObj,text,"","",15,40,220,undefined,"",undefined);
        Generic.createNewButton(confirmObj, "いいえ", "", fw - 80, fheight - 35, btnNo,"width:60px;height:23px");
        Generic.createNewButton(confirmObj, "はい", "", fw - 150, fheight - 35, btnYes, "width:60px;height:23px");

        function btnYes() {
            Generic.clear_backDiv();
            if(typeof yesFunc === 'function'){
                yesFunc();
            }
        }
        function btnNo() {
            Generic.clear_backDiv();
            if(typeof noFunc === 'function'){
                noFunc();
            }
        }
    }

    /**alertメッセージ event_pointがundefinedの場合は画面中央表示*/
    static alert(event_point: point | undefined, text: string, returnFunction: (() => void) | undefined = undefined) {

        const gsize=Generic.getDivSize(text,220,"");
        const fheight=(gsize.height)+100;
        const alertObj = Generic.set_backDiv("", "MANDARA JS",250, fheight, true, false, buttonOK, 0.2,false,true,returnFunction);
        if(event_point!=undefined){
            Generic.Set_Box_Position_in_Browser(event_point, alertObj);
        }
        this.createNewDiv(alertObj,text,"","",15,40,220,undefined,"",undefined);
        function buttonOK() {
            Generic.clear_backDiv();
            if (typeof returnFunction === 'function') {
                returnFunction();
            }
        }
    }

    /**圧縮ファイルを展開 展開後のファイル名の連想配列のバイナリデータを返す*/
    static unzipFile(file: Blob, onOK: (data: {[key: string]: Uint8Array}) => void, onError: (err: Error) => void) {

        const zipReader = new FileReader();
        zipReader.readAsArrayBuffer(file);
        const unZipData=[];
        zipReader.onload = function () {
            try {
                const zipArr = new Uint8Array(zipReader.result as ArrayBuffer);
                const unzip = new Zlib.Unzip(zipArr);
                const importFileList = unzip.getFilenames();
                for (const i in importFileList) {
                    const importFile = importFileList[i];
                    //let jsonBuffer = utf8ArrayToStr(unzip.decompress(importFile));
                    unZipData[importFile] = unzip.decompress(importFile);
                }
               onOK(unZipData);
            } catch (e) {
                console.log(e);
                 onError(e);
             }
        }
    }

    /**データ（バイナリ）と対応するファイル名をtotalFileNameにZIP圧縬 */
    static zipFile(totalFileName: string, data: Uint8Array[], fileName: string[]) {

        const zip = new Zlib.Zip();
        for(const i in data){
            zip.addFile(data[i], {filename: Generic.strToUtf8Array(fileName[i])
        });
        }
        const compressData = zip.compress();

        const blob = new Blob([compressData], { 'type': 'application/octet-stream' });

        const nav = window.navigator as ExtendedNavigator;
        if (typeof nav?.msSaveBlob === "function") {
            nav.msSaveBlob(blob, totalFileName);
            nav.msSaveOrOpenBlob?.(blob, totalFileName);
        } else {
            const a= document.createElement("a");
            a.href = window.URL.createObjectURL(blob);
            a.download = totalFileName;
            a.click();
        }
    }

    /**バイト配列をUTF8文字列に変換 */
    static utf8ArrayToStr(array: Uint8Array) {

        const len = array.length;
        let out = "";
        let i = 0;
        let char1, char2, char3;
        if(array[0]==239){
            i=3;
        }
        while (i < len) {
            char1 = array[i++];
            switch (char1 >> 4) {
                case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                    out += String.fromCharCode(char1);
                    break;
                case 12: case 13:
                    char2 = array[i++];
                    out += String.fromCharCode(((char1 & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    char2 = array[i++];
                    char3 = array[i++];
                    out += String.fromCharCode(((char1 & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
                    break;
            }
        }
        return out;
    }

    /**UTF8文字列をバイト配列に変換 */
     static strToUtf8Array(str: string) {

        let n = str.length,
            idx = -1,
            bytes = [],
            i, j, c;

        for (i = 0; i < n; ++i) {
            c = str.charCodeAt(i);
            if (c <= 0x7F) {
                bytes[++idx] = c;
            } else if (c <= 0x7FF) {
                bytes[++idx] = 0xC0 | (c >>> 6);
                bytes[++idx] = 0x80 | (c & 0x3F);
            } else if (c <= 0xFFFF) {
                bytes[++idx] = 0xE0 | (c >>> 12);
                bytes[++idx] = 0x80 | ((c >>> 6) & 0x3F);
                bytes[++idx] = 0x80 | (c & 0x3F);
            } else {
                bytes[++idx] = 0xF0 | (c >>> 18);
                bytes[++idx] = 0x80 | ((c >>> 12) & 0x3F);
                bytes[++idx] = 0x80 | ((c >>> 6) & 0x3F);
                bytes[++idx] = 0x80 | (c & 0x3F);
            }
        }
        return bytes;
    };

    /**投影法に対応した文字列を返す */
    static getStringProjectionEnum (prj: number){
        switch (prj) {
            case enmProjection_Info.prjNo:
                return "設定なし";
            case enmProjection_Info.prjSanson:
                return "サンソン図法";
            case enmProjection_Info.prjSeikyoEntou:
                return "正距円筒図法";
            case enmProjection_Info.prjMercator:
                return "メルカトル図法";
            case enmProjection_Info.prjMiller:
                return "ミラー図法";
            case enmProjection_Info.prjLambertSeisekiEntou:
                return "ランベルト正積円筒図法";
            case enmProjection_Info.prjMollweide:
                return "モルワイデ図法";
            case enmProjection_Info.prjEckert4:
                return "エッケルト第４図法";
        }
    }
    /**指定の文字数より長い場合、以降を...で省略して返す。短い場合はそのまま返す */
    static Check_StringLength_And_Cut(Str: string, MaxLen: number){

        let rstr  = Str;
        if(rstr.length>MaxLen){
            rstr = rstr.left(MaxLen) + "..."
        }
        return rstr;
} 

/**単独表示モードの文字列を返す */
    static getSolomodeStrings (solomode: number){
        switch (solomode) {
            case enmSoloMode_Number.ClassPaintMode:
                return "ペイント";
            case enmSoloMode_Number.MarkSizeMode:
                return "記号の大きさ";
            case enmSoloMode_Number.MarkBlockMode:
                return "記号の数";
            case enmSoloMode_Number.ContourMode:
                return "等値線";
            case enmSoloMode_Number.ClassHatchMode:
                return "ハッチ";
            case enmSoloMode_Number.ClassMarkMode:
                return "階級記号";
            case enmSoloMode_Number.ClassODMode:
                return "線";
            case enmSoloMode_Number.MarkTurnMode:
                return "記号の回転";
            case enmSoloMode_Number.MarkBarMode:
                return "棒の高さ";
            case enmSoloMode_Number.StringMode:
                return "文字";
        }
    }

    /**spanの文字のサイズをbodyに設定して求める（改行しない） */
    static getSpanSize(text: string, fontSize: number){

        const t = this.createNewSpan(document.body, text, "", "", 0, 0, "", "visibility:hidden");
        t.whiteSpace = 'nowrap';
        t.style.top = '600px';
        t.style.fontSize = fontSize.px();
        const w = t.offsetWidth;
        const h = t.offsetHeight;
        document.body.removeChild(t);
        return new size(w, h);
    }

    /**divの文字のサイズをbodyに設定して求める（指定幅より広いと改行） */
    static getDivSize(text: string, width: number | undefined, styleinfo: string) {

        const t = this.createNewDiv(document.body, text, "", "", 0, 0, "", "", styleinfo + ";visibility:hidden", undefined);
        if (width != undefined) {
            t.style.width = width.px();
        }
        const w = t.offsetWidth;
        const h = t.offsetHeight;
        document.body.removeChild(t);
        return new size(w, h);
    }
    /** 線モードの曲線の座標列を求めるための4つのコントロールポイント取得*/
    static Get_OD_Spline_Point(ControlP: point, OriginP: point, DestP: point) {

        const poxy = [];
        const retV = spatial.Distance_PointLine2(ControlP, OriginP, DestP);
        const D = retV.distance ?? 0;
        let dd1 = Math.abs((OriginP.x - ControlP.x) ** 2 + (OriginP.y - ControlP.y) ** 2 - D ** 2);
        const dd2 = Math.abs((DestP.x - ControlP.x) ** 2 + (DestP.y - ControlP.y) ** 2 - D ** 2);
        if (dd2 < dd1) {
            dd1 = dd2;
        }
        poxy.push(DestP.Clone());
        if (OriginP.y == DestP.y) {
            poxy.push(new point(ControlP.x - Math.sqrt(dd1) * 0.75, ControlP.y));
            poxy.push(new point(ControlP.x + Math.sqrt(dd1) * 0.75, ControlP.y));
        } else if (OriginP.x == DestP.x) {
            poxy.push(new point(ControlP.x, ControlP.y - Math.sqrt(dd1) * 0.75));
            poxy.push(new point(ControlP.x, ControlP.y + Math.sqrt(dd1) * 0.75));
        } else {
            const a = (DestP.y - OriginP.y) / (DestP.x - OriginP.x);
            let xa = Math.sqrt(dd1 / (a * a + 1)) * 0.75;
            if (OriginP.x < DestP.x) { xa = -xa }
            const ya = xa * a;
            poxy.push(new point(ControlP.x - xa, ControlP.y - ya));
            poxy.push(new point(ControlP.x + xa, ControlP.y + ya));
        }
        poxy.push(OriginP.Clone());
        return poxy;
    }

    /**前後文字付き数字入力テキストボックス onChangeでオブジェクトと値を返し、後で数値を設定する場合はHTMLElement.prototype.setNumberValue()を使用 */
    static createNewWordNumberInput(ParentObj: HTMLElement, headWord: string, footWord: string, defoValue: number, ID: string, x: number, y: number, headWordWidth: number, width: number, onChange: ((obj: HTMLInputElement, value: number) => void) | undefined, styleinfo: string) {

        const hsw = this.createNewWordWidthDiv(ParentObj, "", headWord, x, y, 21, headWordWidth, undefined);
        const tx = this.createNewNumberInput(ParentObj, defoValue, ID, x + hsw, y, width, onChange, styleinfo);
        if (footWord != "") {
            Generic.createNewSpan(ParentObj, footWord, "", "", x + width + hsw + 5, y + 3, "", "");
        }
        return tx;
    }

    /**数値に変換する */
    static convValue(value: string){

        let v=value;
        v = v.replace(/\s+/g, "");//スペース削除
        v = v.replace(/\s+/g, "　");//スペース削除
        v = v.replaceAll("．", ".");
        v = v.replaceAll("－", "-");
        v = v.replaceAll("＋", "+");
        v = v.replace(/[０-９]/g, function (s: string) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });
        return v;
    }

    /**数字入力テキストボックス 数字以外の入力の場合は元に戻す。onChangeでオブジェクトと値を返し、後で数値を設定する場合はHTMLElement.prototype.setNumberValue()を使用*/
    static createNewNumberInput(ParentObj: HTMLElement, defoValue: number, ID: string, x: number, y: number, width: number, onChange: ((obj: HTMLInputElement, value: number) => void) | undefined, styleinfo: string) {

        const box = this.createNewInput(ParentObj, "text", defoValue, ID, x, y, undefined, "width:" + width.px() + ";" + styleinfo + ";text-align:right;padding:0px 5px 0px 0px ");
        box.preValue = defoValue;
        box.numberCheck = true;//数字のチェックをしない場合はfalseにする
        box.onchange = function () {
            let v = box.value;         
            if (box.numberCheck == false) {
                if(typeof onChange==='function'){
                    onChange(box, v);
                }
            } else {
                if (isNaN(Number(v)) == false) {
                    const nv = Number(v);
                    box.preValue = nv;
                    if(typeof onChange==='function'){
                        onChange(box, nv);
                    }
                } else {
                    v=Generic.convValue(v);
                    if (isNaN(Number(v)) == false) {
                        const nv = Number(v);
                        box.value = String(nv);
                        box.preValue = nv;
                        if(typeof onChange==='function'){
                            onChange(box, nv);
                        }
                    } else {
                        //一秒間メッセージを表示
                        const bpos = box.getBoundingClientRect();
                        const divele = Generic.createNewDiv(document.body, "数値を入力して下さい", "", "", bpos.left + width / 2, bpos.top + 20, 110, undefined,
                            "z-index:2000;font-size:12px;border: solid 1px; border-radius:3px; background-color:#ffffdd;text-align:center", "");
                        const timerId = setTimeout(
                            function () {
                                document.body.removeChild(divele);
                                clearTimeout(timerId);
                            }, 1000);
                        box.value = box.preValue;//退避値にもどす
                    }
                }
            }
        }
        return box;
    }

    /**数字入力＋リストボックス onChangeでオブジェクトと値を返し、後で数値を設定する場合はHTMLElement.prototype.setNumberValue()を使用**/
    static createNewNumberComboBox(ParentObj: HTMLElement, defoValue: number, ID: string, list: number[], x: number, y: number, width: number, maxNumber: number, onChange: ((obj: HTMLInputElement, value: number) => void) | undefined){

        const dropinwidth=18;
        const ipsize=this.createNewNumberInput(document.body,defoValue,"",0,0,width-dropinwidth+1,onChange,"visibility:hidden");
        const boxh=ipsize.offsetHeight-2;
        const base=this.createNewDiv(ParentObj,"","","numberCbox",x,y,ipsize.offsetWidth+dropinwidth,boxh,"","");
        const lastBodyChild = document.body.lastChild;
        if (lastBodyChild) {
            document.body.removeChild(lastBodyChild);
        }
        const ip=this.createNewNumberInput(base,defoValue,ID,0,0,width-dropinwidth,onChange,"border:none");
        this.createNewDiv(base, "▼", "", "", width - dropinwidth, 0, dropinwidth, boxh, "background-Color:white;border:none;cursor:default;text-align:center", dropList);
        return ip;
        function dropList(){
            const e = document.getElementsByName("backDiv");
            const maxZindex = 1000 + e.length*10;
            const d = Generic.createNewDiv(document.body, "", "frontDIV", "setting", 0, 0, '100%', '100%',"",function () {
                //固定ウインドウを消す
                const last = document.body.lastChild;
                if (last) {
                    document.body.removeChild(last);
                }
            });
            d.setAttribute("name", "backDiv");
            d.style.zIndex = String(maxZindex);
            const rrect=ip.getBoundingClientRect();
            const dropArea=Generic.createNewDiv(d,"","","",rrect.left,rrect.bottom-1,rrect.width+18,100,"background-Color:#ffffff;border:solid 1px;overflow-x:hidden;overflow-y:scroll",undefined);
            const selectList = document.createElement("div");
            dropArea.appendChild(selectList)
            let mainw = 0;
            let lineh = 0;
            for (const i in list) {
                const msp = document.createElement('span');
                document.body.appendChild(msp)
                msp.innerHTML = list[i].caption;
                mainw = Math.max(mainw, msp.offsetWidth);
                lineh = msp.offsetHeight;
                document.body.removeChild(msp);
                y += lineh;
            }
            dropArea.style.height=(Math.min(maxNumber,list.length)*lineh).px();
            for (const i in list) {
                const md = Generic.createNewDiv(selectList, list[i], "", "", 0, lineh * parseInt(i), mainw + 20, lineh, "padding-left:5px", "");
                md.onmouseover = function () {
                    md.style.backgroundColor = '#dddddd';
                }
                md.onmouseleave = function () {
                    md.style.backgroundColor = 'white';
                }
                md.onclick = function () {
                    ip.value=this.innerText ?? "";
                    ip.preValue=ip.value;
                    if(typeof onChange==='function'){
                        onChange(ip,Number(ip.value));
                    }
                }
            }
        }
    }

    /**チェックリストボックス */
    static createNewCheckListBox(ParentObj: HTMLElement, ID: string, list: {text: string, checked: boolean}[], x: number, y: number, width: number, height: number, onChange: ((index: number, checked: boolean) => void) | undefined, styleinfo: string) {
        const state = appState();
        const lineH = this.getDivSize("A", undefined, "").height + 3;
        const allh = lineH * list.length;
        const ovy = (allh < height - 2) ? "" : "overflow-y: scroll";
        const w = (allh < height - 2) ? width - 2 : width - (state.scrMargin.scrollWidth ?? 0) - 1;
        const frame = this.createNewDiv(ParentObj, "", ID, "grayFrame", x, y, width, height, ovy + "overflow-x:hidden", undefined);
        const inFrame = this.createNewDiv(frame, "", ID, "", 0, 0, w, allh, "", undefined);
        for (const i in list) {
            const index = Number(i);
            const cbox = this.createNewCheckBox(inFrame, list[i].text, "", list[i].checked, 3, index * lineH,undefined, 
                function (obj: HTMLInputElement) {
                    if (typeof onChange === 'function') {
                        onChange(Number(obj.tag), obj.checked);
                    }
                }, styleinfo + ";overflow:hidden;text-overflow:ellipsis;white-space:nowrap");
            cbox.tag = i;
        }
        return frame;
    }


    //**色を指定分明るくまたは暗くする（0を下回った場合は0、255を上回った場合は255） */
    static GetColorArrange(Col: color, ChangeValue: number){

        const newcol=Col.Clone();
        const r  = Generic.m_min_max(Col.r + ChangeValue, 0, 255)
        const g  = Generic.m_min_max(Col.g + ChangeValue, 0, 255)
        const b  = Generic.m_min_max(Col.b + ChangeValue, 0, 255)
        newcol.r = r;
        newcol.g = g;
        newcol.b = b;
        return newcol;
    }


    //2次元配列aData()の内容から、データ項目ごとに通常、文字列、カテゴリーと分類する
    static Check_DataType(DataNum: number, ObjNum: number, aData: string[][]) {

        const UNT = [];
        const SS = new clsSortingSearch();
        for (let i = 0; i < DataNum; i++) {
            let f = true;
            for (let j = 0; j < ObjNum; j++) {
                const v = aData[j][i];
                const L = v.length;
                if (L > 20) {
                    f = false;
                    break;
                } else {
                    if (v != "") {
                        if (isNaN(v) == true) {
                                f = false;
                            break;
                        }
                    }
                }
            }
            if (f == false) {
                //文字列のデータ項目の場合
                for (let j = 0; j < ObjNum; j++) {
                    SS.Add(aData[j][i]);
                }
                SS.AddEnd()
                const ctn = SS.EachValue_Array();
                //カテゴリー数が256未満の場合はカテゴリーデータ
                if (ctn.length < 256) {
                    UNT[i] = "CAT";
                } else {
                    UNT[i] = "STR";
                }
            } else {
                UNT[i] = "";
            }
        }
        return UNT;
    }

    //セレクトボックス用投影法リスト
    static getProjectionList() {

        const list = [
            { value: enmProjection_Info.prjMercator, text: 'メルカトル図法' },
            { value: enmProjection_Info.prjMiller, text: 'ミラー図法' },
            { value: enmProjection_Info.prjSeikyoEntou, text: '正距円筒図法' },
            { value: enmProjection_Info.prjLambertSeisekiEntou, text: 'ランベルト正積円筒図法' },
            { value: enmProjection_Info.prjEckert4, text: 'エッケルト第4図法' },
            { value: enmProjection_Info.prjMollweide, text: 'モルワイデ図法' },
            { value: enmProjection_Info.prjSanson, text: 'サンソン図法' }
        ];
        return list;
    }

    /**拡張子取得 */ 
    static getExtension(filename: string){

        const n=filename.lastIndexOf(".");
        if(n==-1){
            return "";
        }else{
            return filename.mid(n+1,filename.length);
        }
    }

       /**フォルダを除いたファイル名を取得 */
       static getFilename(filename: string) {

        const hn = filename.lastIndexOf("/");//スラッシュ
        let tx = "";
        if ((hn == -1)) {
            tx = filename;
        } else {
            tx = filename.mid(hn + 1,undefined);
        }
        return tx;
    }

    /**拡張子を除いたファイル名を取得 */
    static getFilenameWithoutExtension(filename: string) {

        const n = filename.lastIndexOf(".");
        const hn = filename.lastIndexOf("/");//スラッシュ
        let tx = "";
        if ((n == -1) && (hn == -1)) {
            tx = filename;
        } else if (n == -1) {
            tx = filename.right(filename.length - (hn + 1), n);
        } else if (hn == -1) {
            tx = filename.left(n);
        } else {
            tx = filename.mid(hn + 1, n - hn);
        }
        return tx;
    }

    //テキストファイル保存
    static saveText(text: string, fileName: string) {

        /// <signature>
        /// <summary>ファイル保存</summary>
        /// </signature> 
        if (fileName == null) {
            fileName = "textfile.txt";
        }
        const blob = new Blob([text], {
            type: "text/plain"
        });
        if (window.navigator.msSaveBlob != null) {
            window.navigator.msSaveBlob(blob, fileName);
        } else {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = fileName;
            a.click();
        }
    };

    //座標の文字列取得
    static Get_PositionCoordinate_Strings(P: point, MPDataMapZahyo: zahyohenkan, Header_Flag = true) {

        let retPS: {x: string, y: string} = {x: "", y: ""};
        switch (MPDataMapZahyo.Mode) {
            case enmZahyo_mode_info.Zahyo_HeimenTyokkaku: {
                if (Header_Flag == true) {
                    retPS.x = "Y:";
                    retPS.y = "X:";
                }
                retPS.x += P.x.toFixed(1);
                retPS.y += P.y.toFixed(1);
                break;
            }
            case enmZahyo_mode_info.Zahyo_No_Mode: {
                if (Header_Flag == true) {
                    retPS.x = "X:";
                    retPS.y = "Y:";
                }
                retPS.x += P.x.toFixed(3);
                retPS.y += P.y.toFixed(3);
                break;
            }
            case enmZahyo_mode_info.Zahyo_Ido_Keido: {
                retPS = this.Get_LatLon_PointStrings(P, Header_Flag);
                break;
            }
        }
        return retPS;
    }

    /**緯度経度(latlon)の文字列取得 (.x,.y)*/
    static Get_LatLon_Strings(LatLon: latlon, Header_Flag = true) {

        const p = LatLon.toPoint();
        return this.Get_LatLon_PointStrings(p, Header_Flag);
    }

    /**緯度経度(point)の文字列取得*/
    static Get_LatLon_PointStrings(Pos: point, Header_Flag=true){

        const P = Pos.Clone();
        const retPS = {x: "", y: ""};

        if( Header_Flag == true ){
            if( P.y < 0 ){
                retPS.y = "南緯";
            }else{
                retPS.y = "北緯";
            }
            const V2  = Math.abs(P.x);
            const V3  = V2 % 360;
            if( 180 < V3 ){
                if( P.x < 0 ){
                    P.x = (P.x - Math.floor(P.x /360) * 360) + 360;
                }else{
                    P.x = (P.x - Math.floor(P.x /360)  * 360) - 360;
                }
            }else{
                P.x = P.x - Math.floor(P.x /360)  * 360;
            }
            if( P.x < 0 ){
                retPS.x = "西経";
            }else{
                retPS.x = "東経";
            }
            P.x = Math.abs(P.x);
            P.y= Math.abs(P.y);
        }else{
            retPS.x = "";
            retPS.y = "";
        }
        if (clsSettingData.Ido_Kedo_Print_Pattern == enmLatLonPrintPattern.DegreeMinuteSecond) {
            const LatLonDMS = new latlon(P.y,P.x).toDegreeMinuteSecond();
            const o = LatLonDMS.LongitudeDMS;
            retPS.x += String(o.degree) + "度" + String(o.minute) + "分" + o.second.toFixed(4) + "秒"
            const a = LatLonDMS.LatitudeDMS;
            retPS.y += String(a.degree) + "度" + String(a.minute) + "分" + a.second.toFixed(4) + "秒"
        } else {
            retPS.x += P.x.toFixed(6) + "度";
            retPS.y += P.y.toFixed(6)  + "度";
        }
        return retPS;
    }

    //メッシュコードの文字の長さを取得
    static getMeshCodeLength(MeshNumber: number) {

        let CodeLen;
        switch (MeshNumber) {
            case enmMesh_Number.mhFirst: {
                CodeLen = 4;
                break;
            }
            case enmMesh_Number.mhSecond: {
                CodeLen = 6;
                break;
            }
            case enmMesh_Number.mhThird: {
                CodeLen = 8;
                break;
            }
            case enmMesh_Number.mhHalf: {
                CodeLen = 9;
                break;
            }
            case enmMesh_Number.mhQuarter: {
                CodeLen = 10;
                break;
            }
            case enmMesh_Number.mhOne_Eighth: {
                CodeLen = 11;
                break;
            }
            case enmMesh_Number.mhOne_Tenth: {
                CodeLen = 10;
                break;
            }
        }
        return CodeLen;
    }

    /**距離単位をvalueとtextの配列で返す */
    static getScaleUnit_for_select(){

        const list=[];
        const scl=[enmScaleUnit.centimeter,enmScaleUnit.meter,enmScaleUnit.kilometer,enmScaleUnit.inch,enmScaleUnit.feet,enmScaleUnit.yard,enmScaleUnit.mile,
            enmScaleUnit.syaku,enmScaleUnit.ken,enmScaleUnit.ri,enmScaleUnit.kairi];
            for (const i in scl){
                list.push({ value: scl[i], text: this.getScaleUnitStrings(undefined, scl[i]) });
            }
            return list;
    }

    
    /**距離単位列挙型から面積文字列を返す */
    static getScaleUnitAreaStrings(scl: number) {

        switch (scl) {
            case enmScaleUnit.meter:
                return "㎡";
            case enmScaleUnit.kilometer:
                return "㎢";
            case enmScaleUnit.centimeter:
                return "㎠";
            case enmScaleUnit.inch:
                return "sq in";
            case enmScaleUnit.feet:
                return "sq ft";
            case enmScaleUnit.yard:
                return "sq yd";
            case enmScaleUnit.mile:
                return "sq mi";
            case enmScaleUnit.syaku:
                return "平方尺";
            case enmScaleUnit.ken:
                return "坪";
            case enmScaleUnit.ri:
                return "平方里";
            case enmScaleUnit.kairi:
                return "平方海里";
            default:
                return "km";
        }
    }

    ///*距離単位列挙型と値から距離文字列を返す 距離単位だけの場合はValue=undefined*/
    static getScaleUnitStrings(Value: number | undefined, scl: number) {

        let vs;
        if(Value==undefined){
            vs="";
        }else{
            vs = Value.toString();
        }
        switch( scl){
            case enmScaleUnit.meter:
                return vs + "m";
                break;
            case enmScaleUnit.kilometer:
                return vs + "km";
                break;
            case enmScaleUnit.centimeter:
                return vs + "cm";
                break;
            case enmScaleUnit.inch:
                return vs + "inch";
                break;
            case enmScaleUnit.feet:
                if (Value == 1) {
                    return "1 foot";
                } else {
                    return vs + "feet";
                }
                break;
            case enmScaleUnit.yard:
                if (Value == 1) {
                    return "1 yard";
                } else {
                    return vs + " yards";
                }
            case enmScaleUnit.mile:
                if (Value == 1) {
                    return "1 mile";
                } else {
                    return vs + " miles";
                }
                break;
            case enmScaleUnit.syaku:
                return vs + "尺";
                break;
            case enmScaleUnit.ken:
                return vs + "間";
                break;
            case enmScaleUnit.ri:
                return vs + "里";
                break;
            case enmScaleUnit.kairi:
                return vs + "海里";
                break;
            default:
                return vs + "km"
                break;
        }
    }

    //距離単位の変換係数を求める
    static Convert_ScaleUnit(from_Unit: number, to_Unit: number){

        const kmco = [];
        kmco[enmScaleUnit.meter] = 1000;
        kmco[enmScaleUnit.kilometer] = 1;
        kmco[enmScaleUnit.centimeter] = 100000;
        kmco[enmScaleUnit.inch] = 39370.078740157;
        kmco[enmScaleUnit.feet] = 3280.8398950131;
        kmco[enmScaleUnit.yard] = 1093.6132983377;
        kmco[enmScaleUnit.mile] = 0.62137119223733;
        kmco[enmScaleUnit.syaku] = 3300;
        kmco[enmScaleUnit.ken] = 550;
        kmco[enmScaleUnit.ri] = 0.25462962962963;
        kmco[enmScaleUnit.kairi] = 0.53995680345572;

        const fromdis = kmco[from_Unit];
        const todis = kmco[to_Unit];
        return (todis / fromdis);
}

    //レイヤの形状ごとの数を入れた配列から、可能な形状を返す
    static checkShape(Shape: number[]) {

        if (Shape[enmShape.PointShape] > 0) {
            return enmShape.PointShape;
        } else if (Shape[enmShape.LineShape] > 0) {
            return enmShape.LineShape;
        } else {
        return enmShape.PolygonShape;
        }
    }

    static RGBAfromElement(ele: HTMLElement) {

        //要素の背景色をcolorRGBAに変換して返す
        let opa=1 ;
        const bcol = ele.style.backgroundColor;
        const k1 = bcol.indexOf("(");
        const k2 = bcol.indexOf(")");
        const cola = bcol.slice(k1 + 1, k2);
        const RGB = cola.split(",");
        if (RGB.length == 4) {
            opa = parseFloat(RGB[3]);
        }
        opa *= 256;
        const col = new colorRGBA(parseInt(RGB[0]), parseInt(RGB[1]), parseInt(RGB[2]), opa);
        return col;
    }
    static Set_Box_Position_in_Browser(e_point: point | MouseEvent, box: HTMLElement) {	//

        /// <signature>
        /// <summary>ブラウザからはみださないようにボックスの位置を決める</summary>
        /// <param name="e" >イベントの引数</param>
        /// <param name="box" >div等の要素</param>
        /// </signature> 
        box.style.left = "0px"; //いったん左上に移す（高さ、幅の自動調整をなくすため）
        box.style.top = "0px";

        let x;
        let y;
        if(e_point instanceof point){
            x=e_point.x;
            y=e_point.y;
        }else{
            x = e_point.clientX; //ページ内でのマウスカーソル位置を取得
            y = e_point.clientY;
        }
        if (x == 'undefined') {
            x = e_point.pageX;
            y = e_point.pageY;
        } else {
            x += document.body.scrollLeft;
            y += document.body.scrollTop;
        }
        y += 5;
        x += 5;
        const clientWidth =this.getBrowserWidth();     //ウインドウの高さと幅
        const clientHeight = this.getBrowserHeight();
        const boxWidth = box.scrollWidth;		//作成したボックスの高さと幅
        const boxHeight = box.scrollHeight;
        if ((y + boxHeight - document.body.scrollTop) > clientHeight) {	//縦にはみ出る場合
            y = document.body.scrollTop + clientHeight - boxHeight - 10;
        }
        if ((x + boxWidth - document.body.scrollLeft) > clientWidth) {  //横にはみ出る場合
            x = clientWidth - boxWidth - 20;
        }
        box.style.left = x.px();
        box.style.top = y.px();
    }

    static Check_Point_in_screen(p: point, ScrData: Screen_info, Mode: number) {

        //定義
        //Mode=0/SRX:SRY  Mode=1/SR:SY
        //ScrData.ScrRectangle.Left = SRX(0): ScrData.ScrRectangle.Top = SRY(0)
        //ScrData.ScrRectangle.Right = SRX(MapScreen.ScaleWidth): ScrData.ScrRectangle.bottom = SRY(MapScreen.ScaleHeight)

        switch (Mode) {
            case 0:
                return ScrData.ScrRectangle.contains(p);
                break;
            case 1:
                return ScrData.MapScreen_Scale.contains(p);
                break;
        }
    }

    //属性データタイプ列挙型から文字を返す
    static ConvertAttDataTypeString(dataType: number) {

        switch (dataType) {
            case enmAttDataType.Normal:
                return "通常のデータ";
                break;
            case enmAttDataType.Category:
                return "ｶﾃｺﾞﾘｰﾃﾞｰﾀ";
                break;
            case enmAttDataType.Strings:
                return "文字データ";
                break;
            case enmAttDataType.URL:
                return "URLのアドレス";
                break;
            case enmAttDataType.URL_Name:
                return "URLの名称";
                break;
            case enmAttDataType.Lon:
                return "経度";
                break;
            case enmAttDataType.Lat:
                return "緯度";
                break;
            case enmAttDataType.Place:
                return "場所";
                break;
            case enmAttDataType.Arrival:
                return "到着時刻";
                break;
            case enmAttDataType.Departure:
                return "出発時刻";
                break;
            default:
                return "その他" //本当はこれは出現しない
                break;
        }
    }

    //selectのアイテム削除後に、次のインデックスを指定する
    static ListIndex_Reset(select: HTMLSelectElement, Old_n: number) {

        if (select.options.length == 0) {
            return;
        }
        if (Old_n == select.options.length) {
            select.selectedIndex = Old_n - 1;
        } else {
            select.selectedIndex = Old_n;
        }
    }


    //形状列挙型からその文字を返す
    static ConvertShapeEnumString(shape: number) {

        switch (shape) {
            case enmShape.LineShape:
                return "線";
                break;
            case enmShape.PointShape:
                return "点";
                break;
            case enmShape.PolygonShape:
                return "面";
                break;
            case enmShape.NotDeffinition:
                return "未指定" //本当はこれは出現しない
                break;
        }
    }

    //イベント情報からcanvas上の座標位置を求める
    static getCanvasXY(e: MouseEvent) {

        const cx = e.clientX;
        const cy = e.clientY;
        const rx = cx - (e.target.parentNode.style.left.removePx() + e.target.style.left.removePx());
        const ry = cy - (e.target.parentNode.style.top.removePx() + e.target.style.top.removePx());
        return new point(rx, ry);
    }

        //イベント情報からcanvas上の座標位置を求める
        static getCanvasXY2(e: MouseEvent) {

            const cx = e.clientX;
            const cy = e.clientY;
            if(typeof e.target.getBoundingClientRect !=='function'){
                return undefined;//ブラウザ外に移動した場合
            }
            const rx = cx - (e.target.getBoundingClientRect().x);
            const ry = cy - (e.target.getBoundingClientRect().y);
            return new point(rx, ry);
        }

    //画面表示領域変更の可否のチェック
    static Check_New_ScrView(MapRect: rectangle, new_Rect: rectangle) {

        if (new_Rect.width() > MapRect.width() / 5000) {
            //拡大しすぎでない場合
            if (new_Rect.width() < MapRect.width() * 10) {
                //縮小しすぎでない場合
                return true;
            }
        }
        return false;
    }

    //集成オブジェクトの輪郭線（>ラインコード）のみを抽出し、必要なラインコードに変換して返す
    static Get_Outer_Mpline_AggregatedObj(LCode: Array<{LineCode: number}>, Shape: number): Array<{LineCode: number}> { //LCode:EnableMPLine_Data

        const lc = this.ArrayClone(LCode);

        const ncode = [];
        for (let i = 0; i < lc.length; i++) {
            const k = lc[i].LineCode;
            if (k != -1) {
                for (let j = i+1; j < lc.length; j++) {
                    if (k == lc[j].LineCode) {
                        lc[j].LineCode = -1;
                        //面形状の場合は重複するラインは使用しない
                        //線形上の場合は、最初の1回だけ使用する
                        if (Shape == enmShape.PolygonShape) {
                            lc[i].LineCode = -1;
                        }
                    }
                }
            }
            if (lc[i].LineCode != -1) {
                ncode.push(lc[i]);
            }
        }
        return ncode;
    }

    //タイトル、単位から属性データタイプ列挙型を返す
    static getAttDataType_From_TitleUnit(Title: string, Unit: string) {

        let dtype;
        const UTitle = Title.toUpperCase();
        if (UTitle == "URL") {
            dtype = enmAttDataType.URL;
        } else if (UTitle == "URL_NAME") {
            dtype = enmAttDataType.URL_Name;
        } else if (UTitle == "LON") {
            dtype = enmAttDataType.Lon;
        } else if (UTitle == "LAT") {
            dtype = enmAttDataType.Lat;
        } else if (UTitle == "PLACE") {
            dtype = enmAttDataType.Place;
        } else if (UTitle == "ARRIVAL") {
            dtype = enmAttDataType.Arrival;
        } else if (UTitle == "DEPARTURE") {
            dtype = enmAttDataType.Departure;
        } else if (Unit.toUpperCase() == "CAT") {
            dtype = enmAttDataType.Category;
        } else if (Unit.toUpperCase() == "STR") {
            dtype = enmAttDataType.Strings;
        } else {
            dtype = enmAttDataType.Normal;
        }
        return dtype;
    }

    //属性データタイプ列挙型からTITLE、単位文字列を設定

    /** @returns {MyType} */
    static SetTitleUnit_from_AttDataType(dtype: number, defoTitle: string, defoUnit: string) {

        let Title=defoTitle;
        let Unit=defoUnit;
        switch (dtype) {
            case enmAttDataType.Normal:
                if ((defoTitle.toUpperCase() == "URL") || (defoTitle.toUpperCase() == "URL_NAME")) {
                    Title = "データ" + Title
                }
                if ((defoUnit.toUpperCase() == "CAT") || (defoUnit.toUpperCase() == "STR")) {
                    Unit = ""
                }
                break;
            case enmAttDataType.Lon:
                Title = "LON";
                Unit = "";
                break;
            case enmAttDataType.Lat:
                Title = "LAT";
                Unit = "";
                break;
            case enmAttDataType.Category:
                Unit = "CAT";
                break;
            case enmAttDataType.Strings:
                Unit = "STR";
                break;
            case enmAttDataType.URL:
                Title = "URL";
                break;
            case enmAttDataType.URL_Name:
                Title = "URL_NAME";
                break;
            case enmAttDataType.Arrival:
                Title = "ARRIVAL";
                break;
            case enmAttDataType.Departure:
                Title = "DEPARTURE";
                break;
            case enmAttDataType.Place:
                Title = "PLACE";
        }
        return { title: Title, unit: Unit }
    }


    //オブジェクトが同じかどうか調べる
    static equal<T>(objecta: T, objectb: T) {

        return (JSON.stringify(objecta) == JSON.stringify(objectb))
    }
    static Clone<T>(odata: T): T {

        return JSON.parse(JSON.stringify(odata));
    }

    //配列のシャローコピー
    static ArrayShallowCopy<T>(Arr: T[]): T[]{

        return Arr.concat();
    }
    /**Cloneメソッドを持つオブジェクトの配列をコピーする */ 
    static ArrayClone<T extends {Clone(): T}>(array: T[]): T[] | undefined {

        if (array.length==0){
            return [];
        }
        if (typeof array[0].Clone !== 'function') {
            //Clone関数を持たない場合
            return undefined;
        }
        const rea = array.map((x: T) => x.Clone());
        return rea;
    }
    /**Cloneメソッドを持つオブジェクトの2次元配列をコピーする */
    static Array2Clone<T extends {Clone(): T}>(array: T[][]): (T[] | undefined)[] {

        const ca: (T[] | undefined)[] = [];
        for (let i = 0; i < array.length; i++) {
            ca.push(this.ArrayClone(array[i]));
        }
        return ca;
    }

    
    static m_min_max(V: number, Min: number, Max: number) {

        //検査値がMinより小さければMinを返し、Maxより大きければMaxを返す

        if (V < Min) {
            return Min;
        }

        if (V > Max) {
            return Max;
        }
        return V;

    }

    //画面の幅取得
    static getBrowserWidth() {

        if (window.innerWidth) {
            return window.innerWidth;
        }
        else if (document.documentElement && document.documentElement.clientWidth != 0) {
            return document.documentElement.clientWidth;
        }
        else if (document.body) {
            return document.body.clientWidth;
        }
        return 0;
    }

    //画面の高さ取得
    static getBrowserHeight() {

        if (window.innerHeight) {
            return window.innerHeight;
        }
        else if (document.documentElement && document.documentElement.clientHeight != 0) {
            return document.documentElement.clientHeight;
        }
        else if (document.body) {
            return document.body.clientHeight;
        }
        return 0;
    }

    //ドキュメントの高さ取得
    static getDocumentHeight() {

        const h = Math.max.apply(null, [document.body.clientHeight, document.body.scrollHeight, document.documentElement.scrollHeight, document.documentElement.clientHeight]);
        return h;
    }

    //ウィンドウで表示  
    static CenterPage(help_url: string, Xv: number, Yv: number) {

        const win2p: string = "";
        let win1p: string = "";
        let new2: Window | null = null;
        let Xw: number;
        let Yw: number;
        
        if (win2p == "on") {
            if (new2?.closed === false) {
                new2.close();
            }
        }
        win1p = "on";
        Xw = Xv + 50;
        Yw = Yv + 80;
        new2 = window.open(help_url, "_blank", "titlebar=No,status=0,scrollbars=1,resizable=0,width=" + Xw + ",height=" + Yw + "");
        if (parseInt(navigator.appVersion.charAt(0)) >= 3 && new2) { new2.focus(); }
    }

    //ボタン作成
    static createNewButton(ParentObj: HTMLElement, text: string, ID: string, x: number, y: number, onClick: (event: MouseEvent) => void, styleinfo: string = "") {

        const ok = this.createNewInput(ParentObj, "button", text, ID, x, y, "", styleinfo);
        ok.addEventListener('click', onClick);
        ParentObj.appendChild(ok);
        return ok;
    }


    //img要素作成
    static createNewImage(ParentObj: HTMLElement, src: string, alt: string, ID: string, Class: string, x: number, y: number, styleinfo: string, onclick: string | undefined) {

        const obj = document.createElement("img");
        obj.src = src;
        obj.alt = alt;
        obj.setAttribute("id", ID);
        obj.setAttribute("class", Class);
        obj.setAttribute("onclick", onclick);
        obj.setAttribute("style", "position:absolute;" + styleinfo)
        obj.style.top = y.px();
        obj.style.left = x.px();
        ParentObj.appendChild(obj);
        return obj;
    }

    //span要素作成
    static createNewSpan(ParentObj: HTMLElement, innerHtml: string, ID: string, Class: string, x: number, y: number, styleinfo: string, onclick: ((event: MouseEvent) => void) | undefined = undefined) {

        const obj = document.createElement("span");
        obj.setAttribute("id", ID);
        obj.setAttribute("class", Class);
        obj.onclick= onclick;
        obj.innerHTML = innerHtml;
        obj.setAttribute("style", "position:absolute;" + styleinfo)
        obj.style.top = y.px();
        obj.style.left = x.px();
        ParentObj.appendChild(obj);
        return obj;
    }

    //文字配列中の同じ文字を削除した配列を返す
    static Remove_Same_String(ST: string[]) {

        const ST2 = [];
        const sdv = [];
        const n = ST.length;
        for (let i = 0; i < n - 1; i++) {
            if (sdv[i] == undefined) {
                for (let j = i + 1; j < n; j++) {
                    if ((ST[i] == ST[j]) && (sdv[j] == undefined)) {
                        sdv[j] = true;
                    }
                }
            }
        }
        for (let i = 0; i < n; i++) {
            if (sdv[i] == undefined) {
                ST2.push(ST[i]);
            }
        }
        return ST2;
    }

    //二色の間で指定の数だけグラデーションをかける
    static TwoColorGradation(StartCol: colorRGBA, EndCol: colorRGBA, n: number) {

        const ColData = [];
        const a1 = StartCol.a;
        const AL = EndCol.a - a1;
        const r1 = StartCol.r;
        const RL = EndCol.r - r1;
        const g1 = StartCol.g;
        const GL = EndCol.g - g1;
        const B1 = StartCol.b;
        const BL = EndCol.b - B1;
        let cf = 0;
        if (n >= 3) {
            if (EndCol.toHex() == '#ffffff') {
                cf = 1;
            }
            if (StartCol.toHex() == '#ffffff') {
                cf = -1
            }
        }
        for (let i = 0; i < n; i++) {
            let v = i / (n - 1);
            if ((i >= 1) && (i <= n - 2) && (cf != 0)) {
                v = v + 1 / (2 * (n - 1)) * cf;
            }
            const a = a1 + AL * v;
            const b = B1 + BL * v;
            const r = r1 + RL * v;
            const g = g1 + GL * v;
            ColData[i] = new colorRGBA(r, g, b, a);
        }
        return ColData;
    }

    //3色の間で指定の数だけグラデーションをかける
    static ThreeColorGradation(StartCol: colorRGBA, CenterCol: colorRGBA, EndCol: colorRGBA, n: number, Color_cng_n: number) {

        const ColData = [];
        let coldata1 = this.TwoColorGradation(StartCol, CenterCol, Color_cng_n + 1);
        for (let i = 0; i <= Color_cng_n; i++) {
            ColData[i] = coldata1[i];
        }
        coldata1 = this.TwoColorGradation(CenterCol, EndCol, n - Color_cng_n);
        for (let i = Color_cng_n; i < n; i++) {
            ColData[i] = coldata1[i - Color_cng_n];
        }
        return ColData;
    }

    //最大値と最小値を指定の区分数で切りのよい数字で区切る
    static WIC(CUTN: number, Max: number, Min: number) {

        if (Max == Min) {
            return { max: Max + 1, min: Min - 1, step: 1 }
        }
        const ret: {step: number, min: number, max: number} = {step: 0, min: 0, max: 0};

        let H = Max - Min;
        let f = 1;
        const deci = this.Figure_Arrange(Max);
        const deci2 = this.Figure_Arrange(Min);
        if (deci.BeforeDecimal + deci2.BeforeDecimal == 0) {
            const f = 10 ** deci2.AfterDecimal;
            Max = Max * f;
            Min = Min * f;
            H = H * f;
        } else {
            const deci3 = this.Figure_Arrange(H);
            if (deci3.BeforeDecimal == 0) {
                f = 10 ** deci3.AfterDecimal;
                Max = Max * f;
                Min = Min * f;
                H = H * f;
            }
        }
        const deci4 = this.Figure_Arrange(H);
        let b = 10 ** (deci4.BeforeDecimal - 1);
        let w = (1 + Math.floor(H / b)) * b / CUTN;
        const deci5 = this.Figure_Arrange(w)
        b = 10 ** (deci5.BeforeDecimal - 1);
        const w2 = w;
        w = Math.floor(w / b) * b
        if (w == 0) {
            w = w2 / b;
        }
        b = 10 ** (deci4.BeforeDecimal - 1);
        H = Math.floor(Min / b) * b;
        if ((H >= 0) || (Max <= 0)) {
        } else {
            let H2 = H;
            while (H2 < 0) {
                H2 += w;
            }
            H -= H2;
        }
        ret.step = w / f;
        let a = H / f;
        ret.min = a;
        let n = 0;
        while (a < Max / f) {
            a += ret.step;
            n++;
        }
        ret.max = ret.min + ret.step * n;
        return ret;
    }

    static Figure_Arrange(Value: number) {

        let Left, Right;

        if (Value == 0) {
            Left = 1;
        } else {
            Left = Math.floor(Math.log10(Math.abs(Value))) + 1;
        }
        const b = String(Value);
        const c = b.indexOf(".");
        if ((c == -1) || (b.indexOf("E+") != -1)) {
            Right = 0;
        } else if (b.indexOf("E-") != -1) {
            Right = b.length - b.indexOf("E") + Math.floor(Number(b.slice(b.indexOf("-") + 1)));
        } else {
            Right = b.slice(c + 1).length;
        }
        if (Left < 0) {
            Left = 0;
        }
        return { BeforeDecimal: Left, AfterDecimal: Right };
    }

    static Figure_Using_Solo(val: number, commma_f: boolean) {


        const retv = this.Figure_Arrange(val);
        let L = retv.BeforeDecimal;
        const r = retv.AfterDecimal;
        if (L == 0) {
            L = 1;
        }
        if (val < 0) {
            L++;
        }
        return this.Figure_Using3(val, L, r, commma_f);
    }

    //指定した数値を、指定した小数点以下桁数の文字列に変換して返す
    static Figure_Using(Value: number, RightOfDecimaplPoint: number) {

        return Value.toFixed(RightOfDecimaplPoint);
    }

    static Figure_Using3(Value: number, LeftOfDecimalPoint: number, RightOfDecimaplPoint: number, Comma_f: boolean) {

        
        let Comma_Num;
        if (Comma_f == true) {
            Comma_Num = Math.floor((LeftOfDecimalPoint - 1) / 3);
        } else {
            Comma_Num = 0;
        }
        let Num = Comma_Num + LeftOfDecimalPoint + RightOfDecimaplPoint;
        if (RightOfDecimaplPoint > 0) {
            Num++;
        }
        let FL = " ".repeat(LeftOfDecimalPoint);
        if (Comma_f == true) {
            FL += Math.floor(Value).toLocaleString();
        } else {
            FL += String(Math.floor(Value));
        }
        if (RightOfDecimaplPoint != 0) {
            FL += "." + Number(Value).toFixed(RightOfDecimaplPoint).split(".")[1];
        }
        FL = FL.right(Num);
        return FL;
    }

    //配列から特定の値の位置を取り出す
    static Get_Specified_Value_Array<T>(Original_Array: T[], Specified_Value: T) {

        const retArray = [];
        for (const key in Original_Array) {
            if (Original_Array[key] == Specified_Value) {
                retArray.push(key);
            }
        }
        return retArray;
    }
    //配列中の指定した値の数をカウントする
    static Count_Specified_Value_Array<T>(Original_Array: T[], Specified_Value: T) {

        let n = 0;
        for (const key in Original_Array) {
            if (Original_Array[key] == Specified_Value) {
                n++;
            }
        }
        return n;
    }
    /**配列中から含まれる要素とその数の一覧の配列[{value: num:}]を返す */
    static getArrayContentsList<T>(originArray: T[]){

        const s=new clsSortingSearch();
        s.AddRange(originArray);
        return s.EachValue_Array();
    }

    /**タブ作成(base.panel[]に内部要素を追加する) */
    static createNewTab(ParentObj: HTMLElement, tabList: string[], firstSel: number, x: number, y: number, width: number, height: number) {

        const tabh = 20;
        const base = this.createNewDiv(ParentObj, "", "", "", x, y, width, height, "", "");
        base.tab = [];
        base.selectedIndex = firstSel;
        base.panel = [];
        const n = tabList.length;
        const tabw = Math.floor(width - 20) / n;
        for (let i = 0; i < n; i++) {
            const tab = this.createNewDiv(base, tabList[i], "", "", i * tabw, 0, tabw, tabh, "border:solid 1px;border-color:#666666;line-height:"+(tabh-2).px(), tabclick);
            tab.style.backgroundColor = "#e1e1e1";
            tab.align = 'center';
            tab.tag = i;
            base.tab.push(tab);
            const panel = this.createNewDiv(base, "", "", "", 0, tabh + 1, width, height - tabh - 1, "border:solid 1px;border-color:#666666;border-bottom-right-radius:3px;border-bottom-left-radius:3px;border-top-right-radius:3px", "");
            panel.tag = i;
            panel.setVisibility?.(false);
            panel.style.backgroundColor = "#ffffff";
            base.panel.push(panel);
        }
        base.tab[firstSel].style.backgroundColor = "#ffffff";
        if (base.panel[firstSel]) {
            base.panel[firstSel].style.visibility = "visible";
            base.panel[firstSel].setVisibility?.(true);
        }
        const mask = this.createNewDiv(base, "", "", "", 0, tabh - 1, tabw - 1, 3, "", undefined);
        mask.style.backgroundColor = "#ffffff";
        mask.style.left = (firstSel * tabw + 1).px();
        return base;
        function tabclick(this: HTMLElement & { tag: number }) {
            for (let i = 0; i < n; i++) {
                base.tab[i].style.backgroundColor = "#e1e1e1";
                base.panel[i]?.setVisibility?.(false);
            }
            this.style.backgroundColor = "#ffffff";
            base.panel[this.tag]?.setVisibility?.(true);
            base.selectedIndex = Number(this.tag);
            mask.style.left = (this.tag * tabw + 1).px();
        }
    }

    static createNewDiv(ParentObj: HTMLElement, innerHtml: string, ID: string, Class: string, x: number, y: number, width: number | string | undefined, height: number | string | undefined, styleinfo: string, onclick?: ((event: MouseEvent) => void) | string) {

        /// <signature>
        /// <summary>div要素を作成</summary>
        /// <param name="ParentObj">親要素</param>  
        /// <param name="innerHtml">innerHtml</param>  
        /// <param name="ID">ID</param>  
        /// <param name="Class">クラス名</param>  
        /// <param name="x">座標</param>  
        /// <param name="y">y座標</param>  
        /// <param name="width">幅</param>  
        /// <param name="height">高さ</param>  
        /// <param name="styleinfo">スタイルシート文字列</param>  
        /// <param name="onclick">onclickイベント</param>  
        /// <returns >div要素</returns>  
        /// </signature>
        const obj = document.createElement("div");
        obj.setAttribute("id", ID);
        obj.setAttribute("class", Class);
        obj.setAttribute("onclick", onclick);
        obj.setAttribute("style", "position:absolute;" + styleinfo);
        obj.onclick = onclick;
        obj.innerHTML = innerHtml;
        obj.style.top = y.px();
        obj.style.left = x.px();
        if (width != undefined) {
            if ((typeof width) === 'string') {
                obj.style.width = width;
            } else {
                obj.style.width = width.px();
            }
        }
        if (height != undefined) {
            if ((typeof height) === 'string') {
                obj.style.height = height;
            } else {
                obj.style.height = height.px();
            }
        }
        ParentObj.appendChild(obj);
        return obj;
    }


    /**
     *ラジオボタン要素をリスト(value,text,checked)で作成onClickで選択されたValueを返す
     * @static
     * @param {*} yplus 配列の場合は個別にプラス
     * @param {*} defoCheckValue
     * @param {*} onClick
     * @param {*} styleinfo
     * @memberof Generic
     */
    static createNewRadioButtonList(ParentObj: HTMLElement, name: string, list: RadioListItem[], x: number, y: number, wordWidth: number, yplus: number | number[], defoCheckValue: RadioValue, onClick: (value: RadioValue) => void, styleinfo: string): void {

        let sy = y;
        for (let i = 0; i < list.length; i++) {
            this.createNewRadioButton(ParentObj, list[i].text, "radio" + name + i, name, (list[i].value == defoCheckValue), list[i].value, x, sy, wordWidth, onClick, styleinfo);
            if (Array.isArray(yplus)) {
                sy += yplus[i];
            } else {
                sy += yplus;
            }
        }
    }
    /**ラジオボタン要素作成 onClickで選択されたValueを返す */
    static createNewRadioButton(ParentObj: HTMLElement, text: string, ID: string, name: string, checked: boolean, value: RadioValue, x: number, y: number, wordWidth: number, onClick: (value: RadioValue) => void, styleinfo: string): HTMLInputElement {

        const ok = this.createNewInput(ParentObj, "radio", "", ID, x, y, "", styleinfo);
        ok.addEventListener('change', change);
        ok.value = value;
        ok.setAttribute("name", name);
        if (checked == true) {
            ok.setAttribute("checked", "")
        }
        const asize = Generic.getDivSize(text, wordWidth, "");
        const sp=Generic.createNewDiv(ParentObj, text, "div"+ID, "", x+10, y + 16 / 2 - asize.height / 2, wordWidth, undefined, styleinfo+";padding-left:15px", undefined);
        ok.setAttribute("name", name);
        sp.tag = ID;
        sp.addEventListener('click', function gg(e) {
            const target = e?.target as (HTMLElement & {tag?: string}) | null;
            if (!target) { return; }
            const obj = target.tag ? document.getElementById(target.tag) as HTMLInputElement | null : null;
            if (obj?.disabled == false) {
                obj.checked = true;
                change();
            }
        }, false);
//        sp.addEventListener('click', onClick, false);
        function change(){
            if (typeof (onClick) === "function") {
                let v=ok.value;
                if (isNaN(Number(v))==false){
                    v=String(Number(v));
                }
                onClick(v);
            }
        }
    }

    //ラジオボタンの指定valueの要素をenabled/disableする
    static enableRadioByValue(name: string, value: RadioValue, enabled: boolean): void {

        const rd = document.getElementsByName(name);
        for (let i = 0; i < rd.length; i++) {
            let v = rd[i].value;
            if ((isNaN(v) == false) && (isNaN(value) == false)) {
                v = Number(v);
            }
            if (v == value) {
                rd[i].disabled = !enabled;
                break;
            }
        }
    }
    //ラジオボタンの指定valueの要素をチェックする
    static checkRadioByValue(name: string, value: RadioValue): void {

        const rd = document.getElementsByName(name);
        for (let i = 0; i < rd.length; i++) {
            let v = rd[i].value;
            if ((isNaN(v) == false) && (isNaN(value) == false)) {
                v = Number(v);
            }
            if (v == value) {
                rd[i].checked = true;
                break;
            }
        }
    }

    //ラジオボタンのチェック要素のvalueを取得する
    static getRadioCheckByValue(name: string) {

        const rd = document.getElementsByName(name);
        for (let i = 0; i < rd.length; i++) {
            if (rd[i].checked==true) {
                let v=rd[i].value;
                if (isNaN(v)==false){
                    v=Number(v);
                }
                return v;
                break;
            }
        }
        return undefined;
    }

    /**チェックボックス要素作成 onClickでは要素を返す */
    static createNewCheckBox(ParentObj: HTMLElement, text: string, ID: string, checked: boolean, x: number, y: number, wordWidth: number, onClick: ((obj: HTMLInputElement) => void) | undefined, styleinfo: string = "") {

        const ok = this.createNewInput(ParentObj, "checkbox", "", ID, x, y, undefined, styleinfo);
        if (checked == true) {
            ok.setAttribute("checked", "")
        }
        ok.onchange = change;
        this.createNewWordWidthDiv(ParentObj, "", text, x + 20, y, 18, wordWidth, spnClick);
        function spnClick() {
            if(ok.disabled==false){
                ok.checked = !ok.checked;
                change();
                }
        }
        function change(){
            if (typeof (onClick) === "function") {
                onClick(ok);
            }
        }
        return ok;
    }

    /**inputText要素作成*/
    static createNewWordTextInput(ParentObj: HTMLElement, headWord: string, footWord: string, defoText: string, ID: string, x: number, y: number, headWordWidth: number, boxWidth: number, onChange: ((this: HTMLInputElement, ev: Event) => void) | undefined, styleinfo: string) {

        const hsw = this.createNewWordWidthDiv(ParentObj, "", headWord, x, y, 21, headWordWidth, undefined);
        styleinfo = "width:" + String(boxWidth) + "px;" + styleinfo;
        const tx = this.createNewInput(ParentObj, "text", defoText, ID, x + hsw, y, undefined, styleinfo);
        tx.onchange = onChange;
        if (footWord != "") {
            Generic.createNewSpan(ParentObj, footWord, "", "", x + boxWidth + hsw + 5, y + 3, "", "");
        }
        return tx;
    }

    /**イメージボタン */
    static createNewImageButton(ParentObj: HTMLElement, ID: string, src: string, x: number, y: number, width: number, height: number, onClick: ((this: HTMLImageElement, ev: MouseEvent) => void) | null, styleinfo: string) {

        const ok=document.createElement("img");
        ok.setAttribute("style", "position:absolute;width:"+width.px()+";height:" +height.px() +";"+ styleinfo);
        ok.style.top = y.px();
        ok.style.left = x.px();
        ok.setAttribute("id", ID);
        ok.setAttribute("class", "imgButton");
        ok.setAttribute("src", src);
        ok.onclick = onClick;
        ParentObj.appendChild(ok);
        return ok;

    }


    //** input要素作成*/
    static createNewInput(ParentObj: HTMLElement, type: string, text: string, ID: string, x: number, y: number, onClick: string | undefined, styleinfo: string) {

        const ok = document.createElement("input");
        ok.setAttribute("type", type);
        ok.setAttribute("id", ID);
        ok.setAttribute("value", text);
        ok.setAttribute("onclick", onClick);
        ok.setAttribute("style", "position:absolute;" + styleinfo);
        ok.style.top = y.px();
        ok.style.left = x.px();
        ParentObj.appendChild(ok);
        return ok;
    }

    /** 改行つきDIV作成*/
    static createNewWordWidthDiv(ParentObj: HTMLElement, ID: string, word: string, x: number, y: number, lineHeight: number, wordWidth: number, onclick: ((event: MouseEvent) => void) | string | undefined, styleinfo: string = "") {

        if (word == "") {
            return 0;
        } else {
            const asize = Generic.getDivSize(word, wordWidth,styleinfo);
            Generic.createNewDiv(ParentObj, word, "", "", x, y + lineHeight / 2 - asize.height / 2, wordWidth, undefined, styleinfo, onclick);
            return asize.width + 5;
        }
    }

    //タイルdivボックス
    static createNewTileBox(ParentObj: HTMLElement, ID: string, word: string, defoTile: {BlankF: boolean, Color: colorRGBA}, x: number, y: number, wordWidth: number, onclick: ((event: MouseEvent) => void) | string | undefined, tileWidth: number = 45): HTMLElement {

        const lineH = 23;
        const hsw = this.createNewWordWidthDiv(ParentObj, "", word, x, y, lineH, wordWidth, undefined);
        const tilebox = Generic.createNewDiv(ParentObj, "", ID, "imgButton", x + hsw, y, tileWidth, lineH, "", onclick);
        Generic.createNewDiv(tilebox, "透明", "", "", 0, 3, tileWidth, lineH, "pointer-events: none;text-align:center", "");
        Generic.setTileDiv(tilebox, defoTile);
        return tilebox;
            }

    //タイルDIVに設定
    static setTileDiv(tileDiv: HTMLElement, Tile: {BlankF: boolean, Color: colorRGBA}) {

        const trans = tileDiv.children;
        if(trans.length==0){
            return;
        }
        if (Tile.BlankF == true) {
           trans[0].style.display = "inline";
            tileDiv.style.backgroundColor = 'white';
        } else {
           trans[0].style.display = "none";
            tileDiv.style.backgroundColor = Tile.Color.toRGBA();
        }
    }

    //** 背景Canvasボックス */
    static createNewWordDivCanvas(ParentObj: HTMLElement, ID: string, word: string, x: number, y: number, wordWidth: number, onclick: ((this: HTMLCanvasElement, ev: MouseEvent) => void) | null) {

        const lineH = 23;
        const hsw = this.createNewWordWidthDiv(ParentObj, "", word, x, y, lineH, wordWidth, undefined);
        const canv = Generic.createNewCanvas(ParentObj, ID, "imgButton", x + hsw, y, 45, lineH, onclick,"");
        return canv;
    }



    //** 色divボックス */
    static createNewColorBox(ParentObj: HTMLElement, ID: string, word: string, color: colorRGBA | undefined, x: number, y: number, onclick: ((color: colorRGBA) => void) | undefined) {

        const sp = Generic.createNewSpan(ParentObj, word, "", "", x, y + 3, "", "");
        let sw = sp.offsetWidth;
        if (sw < 35) {
            sw = 35;
        } else {
            sw += 10;
        }
        const colbox = Generic.createNewDiv(ParentObj, "", ID, "imgButton", x + sw, y, 45, 23, "", colSelect);
        if(color instanceof colorRGBA){
            colbox.style.backgroundColor = color.toRGBA();
        }
        return colbox;
        function colSelect(e: MouseEvent) {
            clsColorPicker(e, onclick);
        }
    }

    /**サイズ選択用select valueType:配列はそのまま入れる、1（0.1間隔）,2(0.5),3(5),4(10))、onChangeでは要素,オブジェクトと値を返す*/ 
    static createNewSizeSelect(ParentObj: HTMLElement, defoValue: number, ID: string, preWord: string, x: number, y: number, preWordWidth: number, valueType: number[] | number, onChange: ((obj: HTMLInputElement, value: number) => void) | undefined, percentShowF: boolean = true) {

        let cboCodeList=[];
        if( valueType instanceof Array==true){
            for (const i　in valueType) {
                cboCodeList.push(valueType[i]);
            }
        }else{
            switch (valueType) {
                case 1: {
                    cboCodeList = [0];
                    for (let i = 1; i < 10; i++) {
                        const n = i / 10;
                        cboCodeList.push(n);
                    }
                    for (let i = 1; i < 5; i++) {
                        cboCodeList.push(i);
                    }
                    break;
                }
                case 2: {
                    cboCodeList = [0.2];
                    for (let i = 0.5; i < 5; i += 0.5) {
                        cboCodeList.push(i);
                    }
                    for (let i = 5; i < 20; i++) {
                        cboCodeList.push(i);
                    }
                    break;
                }
                case 3:
                    for (let i = 5; i < 55; i += 5) {
                        cboCodeList.push(i);
                    }
                    break;
                case 4: {
                    for (let i = 10; i < 110; i += 10) {
                        cboCodeList.push(i);
                    }
                    break;
                }
            }
    
        }
        const lineH =21;
        const sw =this.createNewWordWidthDiv(ParentObj,"",preWord,x,y,lineH,preWordWidth,undefined);
        const sInput=this.createNewNumberComboBox(ParentObj,defoValue,ID, cboCodeList,x+sw,y,60,10,onChange );
        if(percentShowF==true){
            Generic.createNewSpan(ParentObj, "%", "", "", x+sw+65, y+3, "", "");
        }
        return sInput;
    }


    /**最初からドロップダウンされているリストを表示 戻り値はselectedIndex番号 */
    static createNewDropdownSelect(title: string, textList: string[], x: number, y: number, width: number, onChange: (selectedIndex: number) => void) {
        const state = appState();
        const pele=this.set_backDiv("",title,width,100,false,false,undefined,0,true);
        const oneHeight=this.getSpanSize(textList[0],15).height+2;
        const totalHeight=Math.min(8,textList.length)*oneHeight;
        pele.style.height=(state.scrMargin.top+totalHeight+2).px();
        const frame=this.createNewDiv(pele,"","","grayFrame",0,state.scrMargin.top,width-1,totalHeight,"overflow-y:scroll;overflow-x:hidden", undefined);
        Generic.Set_Box_Position_in_Browser(new point(x,y), pele);
        for (const i in textList) {
            const md = this.createNewDiv(frame, textList[i], "", "", 0, oneHeight * Number(i), Number(width)-2, oneHeight - 2, "padding-top:2px;padding-left:10px;font-size:14px", "");
            md.tag = i;
            md.onmouseover = function () {
                md.style.backgroundColor = '#dddddd';
            }
            md.onmouseleave = function () {
                md.style.backgroundColor = 'white';
            }
            md.onclick = function (e) {
                change(Number(this.tag))
            }
        }

        function change(selectedIndex: number) {
            Generic.clear_backDiv();
            onChange(selectedIndex);
        }
    }
    /**文つきselect要素作成 selectPosition:0は右、1は下*/
    static createNewWordSelect(ParentObj: HTMLElement, headWord: string, list: string[] | undefined, firstSelectIndex: number, ID: string, x: number, y: number, headWordWidth: number, selectWidth: number, selectPosition: number, onChange: ((sbox: HTMLSelectElement, sel: number | number[], v?: string) => void) | undefined, divStyle: string, selectStyleinfo: string, astariskNonF: boolean = true) {

        const lineH = this.getDivSize("A", undefined, divStyle).height ;
        const hsw = this.createNewWordWidthDiv(ParentObj, "", headWord, x, y, lineH, headWordWidth, undefined,divStyle);
        let xx=x;
        let yy=y;
        if(selectPosition==0){
            xx= x + hsw;
        }else{
            xx+=15;
            yy+=lineH+2;
        }
        const sbox=this.createNewSelect(ParentObj, list, firstSelectIndex, ID, xx, yy, false, onChange, selectStyleinfo, 0 ,astariskNonF) ;
        sbox.style.width=selectWidth.px();
        return sbox;
    }
    /**select要素作成 list.value,.text *は非選択が標準、onChangeでは要素,selectedIndex,valueを返す*/
    static createNewSelect(ParentObj: HTMLElement, list: string[] | undefined, firstSelectIndex: number, ID: string, x: number, y: number, multipleFlag: boolean, onChange: ((sbox: HTMLSelectElement, sel: number | number[], v?: string) => void) | undefined, styleinfo: string, size: number = 1, astariskNonF: boolean = true) {

        const sbox = document.createElement("select")
        sbox.setAttribute("id", ID)
        sbox.multiple = multipleFlag;
        sbox.onchange =function(){
            const nochange=false;
            if((typeof onChange==='function')&&(nochange==false)){
                let sel;
                let v;
                if(multipleFlag==false){
                    sel=sbox.selectedIndex;
                    v=sbox.getValue ? sbox.getValue() : undefined;
                }else{
                    sel=Generic.getMultipleSelectIndex(sbox,0);
                }
                onChange(sbox,sel,v);
            }
        }
        sbox.setAttribute("style", "position:absolute;" + styleinfo)
        sbox.style.top = y.px();
        sbox.style.left = x.px();
        sbox.setAttribute("size", String(size));
        sbox.addEventListener("mouseenter", mouseEnter, false);
        sbox.addEventListener("mouseleave", mouseLeave, false);
        if (list != undefined) {
            sbox.addSelectList?.( list, firstSelectIndex,true,astariskNonF);
            sbox.selectedIndex = firstSelectIndex;
        }
        sbox.oldSel = firstSelectIndex;
        ParentObj.appendChild(sbox);
        return sbox;
        function mouseEnter(this: HTMLSelectElement, e: MouseEvent) {
            const w = Generic.getSpanSize(sbox.getText ? sbox.getText() : "", sbox.style.fontSize.removePx()).width + 20;
            if (w > sbox.offsetWidth) {
                Generic.createNewDiv(this.parentNode, sbox.getText ? sbox.getText() : "", "", "", x + 50, y + sbox.offsetHeight, 150, undefined, "z-index:1000;font-size:12px;border: solid 1px; border-radius:3px; background-color:#fffff0;text-align:center", "");
                sbox.tooltip = 'true';
            }
        }
        function mouseLeave(this: HTMLSelectElement, e: MouseEvent) {
            if (sbox.tooltip == 'true') {
                this.parentNode.removeChild(this.parentNode.lastChild);
                sbox.tooltip = '';
            }
        }
    }



    //
    /**複数選択select要素の選択状態を取得 mode0は選択された番号の配列、mode1は選択をtruefalseを配列で返す */
    static getMultipleSelectIndex(obj: HTMLSelectElement, mode: number) {

        const opts = obj.options;
        const selectedIndex = [];
        const selected = []
        for (let i = 0; i < opts.length; i++) {
            if (opts[i].selected) {
                selectedIndex.push(i);
                selected[i] = true;
            } else {
                selected[i] = false;
            }
        }
        switch (mode) {
            case 0:
                return selectedIndex;
                break;
            case 1:
                return selected;
                break;
        }
    }

    //子要素までdisabledを設定
    static setDisabled(element: HTMLElement, value: boolean) {

        const children = element.children;
        for (let i = 0; i < children.length; i++) {
            children[i].disabled = value;
            if (children[i].children.length > 0) {
               this.setDisabled(children[i], value);
            }
        }

    }

    //Canvas要素を作成
    static createNewCanvas(ParentObj: HTMLElement, ID: string, Class: string, x: number, y: number, width: number, height: number, onClick: ((this: HTMLCanvasElement, ev: MouseEvent) => void) | null, styleinfo: string) {

        const canvas = document.createElement("canvas");
        canvas.setAttribute("style", "position:absolute;" + styleinfo);
        canvas.setAttribute("id", ID);
        canvas.setAttribute("class", Class);
        canvas.width = width;
        canvas.height = height;
        canvas.style.top = y.px();
        canvas.style.left = x.px();
        canvas.onclick = onClick;
        ParentObj.appendChild(canvas);
        return canvas;
    }

    static createMenuMark(parentObj: HTMLElement, onClick: ((this: HTMLCanvasElement, ev: MouseEvent) => void) | null, markSize: number | undefined) {

        const size = markSize ?? 20;
        const canvas = this.createNewCanvas(parentObj, "", "", 10, 4, size, size, handleClick, "");
        canvas.addEventListener("mouseenter", handleClick);
        canvas.name = "menuMark";
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(1, 5);
            ctx.lineTo(size - 2, 5);
            ctx.moveTo(1, 10);
            ctx.lineTo(size - 2, 10);
            ctx.moveTo(1, 15);
            ctx.lineTo(size - 2, 15);
            ctx.stroke();
        }
        return canvas;

        function handleClick(this: HTMLCanvasElement, e: MouseEvent) {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            onClick(new point(rect.right, rect.bottom));
        }
    }

    // ParentObjの右上にXマーク表示
    static createXmark(parentObj: HTMLElement, onClick: ((this: HTMLCanvasElement, ev: MouseEvent) => void) | null, markSize: number | undefined) {

        const size = markSize ?? 20;
        const canvas = this.createNewCanvas(parentObj, "", "", parentObj.style.width.removePx() - 14 - size, 4, size, size, onClick, "");
        canvas.name = "xMark";
        canvas.rightPositionFixed = true;
        canvas.relativePosition = new point(size + 14, 0);
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(1, 1);
            ctx.lineTo(size - 2, size - 2);
            ctx.moveTo(size - 2, 1);
            ctx.lineTo(1, size - 2);
            ctx.stroke();
        }
        return canvas;
    }

    // windowの右上に最大化マーク表示
    static createMaxButton(parentObj: HTMLElement, onClick: ((this: HTMLCanvasElement, ev: MouseEvent) => void) | null, markSize: number | undefined) {

        const size = markSize ?? 20;
        const canvas = this.createNewCanvas(parentObj, "", "", parentObj.style.width.removePx() - 14 - size, 4, size, size, onClick, "");
        canvas.name = "maxButton";
        return canvas;
    }

    // 移動要素の内部の要素で右下に固定のものを動かす
    static moveInnerElement(parentObj: HTMLElement) {

        const cnode = parentObj.children;
        const w = parentObj.style.width.removePx(); // 親要素で幅100%指定だと効かないので注意
        const h = parentObj.style.height.removePx();
        for (let i = 0; i < cnode.length; i++) {
            const node = cnode[i] as HTMLElement & {rightPositionFixed?: boolean, bottomRightPositionFixed?: boolean, bottomPositionFixed?: boolean, relativePosition?: point};
            if (Object.prototype.hasOwnProperty.call(node, 'rightPositionFixed')) {
                node.style.left = (w - node.relativePosition.x).px();
            }
            if (Object.prototype.hasOwnProperty.call(node, 'bottomRightPositionFixed')) {
                if (node.relativePosition.x === -1) {
                    node.style.left = (0).px();
                    node.style.width = w.px();
                    node.style.top = (h - node.relativePosition.y).px();
                } else {
                    node.style.left = (w - node.relativePosition.x).px();
                    node.style.top = (h - node.relativePosition.y).px();
                }
            }
            if (Object.prototype.hasOwnProperty.call(node, 'bottomPositionFixed')) {
                node.style.top = (h - node.relativePosition.y).px();
            }
            if (Object.prototype.hasOwnProperty.call(node, 'sizeFixed')) {
                node.style.width = (w - node.relativeSize.width).px();
                node.style.height = (h - node.relativeSize.height).px();
            }
            if (node.nodeType === 1 && node.childElementCount > 0) {
                this.moveInnerElement(node);
            }
        }
    }

    // 指定したオブジェクトの子要素に、指定したIDの子要素が含まれるかどうかチェックする
    static checkHasChildNode(parentObj: HTMLElement, childObjID: string) {

        const cnode = parentObj.childNodes;
        for (let i = 0; i < cnode.length; i++) {
            const child = cnode[i];
            if (child instanceof HTMLElement && child.id === childObjID) {
                return true;
            }
        }
        return false;
    }

    // テキストエリアを作成
    static createNewTextarea(parentObj: HTMLElement, text: string, id: string, x: number, y: number, row: number, col: number, styleinfo: string) {

        const obj = document.createElement("textarea");
        obj.setAttribute("id", id);
        obj.innerHTML = text;
        obj.setAttribute("style", "position:absolute;" + styleinfo);
        obj.setAttribute("rows", row);
        obj.setAttribute("cols", col);
        obj.style.top = y.px();
        obj.style.left = x.px();
        parentObj.appendChild(obj);
        return obj;
    }

    static createNewTable(parentObj: HTMLElement, id: string, tableClass: string, data: TableData, width: number, styleinfo: string, headNum: number, headStyleinfo: string, normalStyleinfo: string, headXStyleinfo: string, normalXStyleinfo: string): HTMLTableElement {

        const xcell = data.length;
        const ycell = data[1].length;

        const tb = document.createElement("table");
        tb.setAttribute("style", "position:absolute;" + styleinfo);
        tb.setAttribute("id", id);
        tb.setAttribute("class", tableClass);
        tb.style.top = "0px";
        tb.style.left = "0px";
        tb.style.width = (typeof width === 'string') ? width : width.px();

        for (let i = 0; i < ycell; i++) {
            const row = tb.insertRow(-1);
            row.setAttribute("style", i < headNum ? headStyleinfo : normalStyleinfo);
            for (let j = 0; j < xcell; j++) {
                const newtd = row.insertCell(-1);
                newtd.setAttribute("class", tableClass);
                if (i < headNum && headXStyleinfo !== "") {
                    newtd.setAttribute("style", headXStyleinfo[j]);
                } else if (i >= headNum && normalXStyleinfo !== "") {
                    newtd.setAttribute("style", normalXStyleinfo[j]);
                }
                newtd.innerHTML = data[j][i];
            }
        }
        parentObj.appendChild(tb);
        return tb;
    }

    static createNewGrid(parentObj: HTMLElement, gridID: string, tableID: string, gridClass: string, tableClass: string, data: TableData, x: number, y: number, width: number | string, height: number | string, tableWidth: number, styleinfo: string, tableStyleinfo: string, tableHeadNum: number,
        tableHeadStyleinfo: string, tableNormalStyleinfo: string, tableHeadXStyleinfo: string, tableNormalXStyleinfo: string): HTMLElement & {table: HTMLTableElement} {

        const obj = document.createElement("div");
        obj.setAttribute("style", "position:absolute;overflow: auto;" + styleinfo);
        obj.setAttribute("id", gridID);
        obj.setAttribute("class", gridClass);
        obj.style.top = y.px();
        obj.style.left = x.px();
        obj.style.width = (typeof width === 'string') ? width : width.px();
        obj.style.height = (typeof height === 'string') ? height : height.px();
        obj.table = this.createNewTable(obj, tableID, tableClass, data, tableWidth, tableStyleinfo, tableHeadNum,
            tableHeadStyleinfo, tableNormalStyleinfo, tableHeadXStyleinfo, tableNormalXStyleinfo);
        parentObj.appendChild(obj);
        return obj;
    }

    // 表の中身を取得する
    static getTableValue(table: HTMLTableElement) {

        let tx = "";
        for (let i = 0; i < table.rows.length; i++) {
            for (let j = 0; j < table.rows[i].cells.length; j++) {
                tx += table.rows[i].cells[j].innerText;
                tx += (j !== table.rows[i].cells.length - 1) ? '\t' : '\n';
            }
        }
        return tx;
    }

    static Array2Dimension<T>(dim1num: number, dim2num: number, defoValue: T = undefined as T) {

        const arrayData = new Array(dim1num);
        for (let i = 0; i < dim1num; i++) {
            arrayData[i] = new Array(dim2num);
            if (defoValue !== undefined) {
                arrayData[i].fill(defoValue);
            }
        }
        return arrayData;
    }

    static createNewFrame(parentObj: HTMLElement, id: string, Class: string, x: number, y: number, width: number, height: number, text: string = "") {

        let yy = y;
        if (text !== "") {
            yy += 10;
        }
        const div = this.createNewDiv(parentObj, "", id, Class, x, yy, width, height, "border:solid 1px;border-color:#666666;border-radius:3px;", "");
        if (text !== "") {
            let bg = parentObj.style.backgroundColor;
            if (bg === "") {
                bg = parentObj.parentNode.style.backgroundColor;
            }
            this.createNewSpan(div, text, "label", Class, 8, -8, "padding-left:3px;padding-right:3px;background-color:" + bg, "");
        }
        return div;
    }

    /**メッセージ表示 borderFlag:枠を動かせるかどうか*/
    static createMsgBox(title: string, text: string, borderFlag: boolean, width: number = 350, height: number = 400) {
        const state = appState();
        const msgbox = this.set_backDiv('msgbox', title, width, height, true, false, undefined, 0.2, false);
        const ta = this.createNewTextarea(msgbox, text, "", 10, state.scrMargin.top + 10, 20, 50, "resize:none;width:480px;height:420px;font-size:13px");
        ta.style.width = (width - 20).px();
        ta.style.height = (height - 50 - state.scrMargin.top - 10).px();
        if (borderFlag === true) {
            msgbox.dragBorder(undefined, undefined);
            ta.sizeFixed = true;
            ta.relativeSize = new size(20, 80);
        }
        const copy = Generic.createNewButton(msgbox, "コピー", "", 30, height - 35, copyValue, "width:60px;height:23px");
        copy.bottomPositionFixed = true;
        copy.relativePosition = new point(0, 30);
        copy.setAttribute("name", 'copy');
        function copyValue() {
            Generic.copyText(ta.value);
        }
    }

    static createMsgTableBox(title: string, data: TableData, width: number, height: number, borderFlag: boolean): void {

        const msgbox = this.set_backDiv('msgbox', title, width, height, true, false, undefined, 0.2, false);
        const gd = Generic.createNewGrid(msgbox, "", "", "", "", data, 5, 35, width - 10, height - 80, '100%', "", "font-size:13px", 1, "background-color:#aaffaa;", "", "", "");
        if (borderFlag === true) {
            msgbox.dragBorder(undefined, undefined);
            gd.sizeFixed = true;
            gd.relativeSize = new size(30, 70);
        }
        const copy = Generic.createNewButton(msgbox, "コピー", "", 30, height - 35, copyValue, "width:60px;height:23px");
        copy.bottomPositionFixed = true;
        copy.relativePosition = new point(0, 30);
        copy.setAttribute("name", 'copy');
        function copyValue() {
            const tx = Generic.getTableValue(gd.table);
            Generic.copyText(tx);
        }
    }

    static createWindow(
        ID: string,
        Class: string,
        title: string,
        x: number,
        y: number,
        width: number,
        height: number,
        visibilieF: boolean,
        menuMarkF: boolean,
        menuCall: ((pos: point) => void) | null,
        XmarkF: boolean,
        XmarkCall: (() => void) | null,
        footer_Flag: boolean,
        footerID: string,
        maxButtonF: boolean,
        maxButtonCall: (() => void) | null = null
    ): HTMLElement {

        const state = appState();
        const hiddenWindow = function () {
            const winAny = window as Record<string, any>;
            winAny.setVisibility?.(false) ;
            if(XmarkCall !=undefined){
                XmarkCall();
            }
        }
        const window = Generic.createNewDiv(document.body, "", ID, Class, x, y, width, height, "border: solid 1px; border-radius:5px; background-color:white; overflow:hidden; ", "");
        let pl="padding-left:40px;"
        if(menuMarkF==false){
            pl="padding-left:15px;"
        }
        const hd = Generic.createNewDiv(window, "", "", title, 0, 0, '100%', state.scrMargin.top-3, "padding-top:3px;background-color: gray;color:#ffffff;font-size:17px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"+pl, "");
        hd.name = "header";
        window.maxSizeFlag=false;
        if (footer_Flag == true) {
            const ft = Generic.createNewDiv(window, "", footerID, "", 0, 0, 100, state.scrMargin.bottom, "background-color: #dddddd;color:#000000;font-size:13px;padding-left:10px;padding-top:5px", "");
            ft.bottomRightPositionFixed=true;
            ft.relativePosition=new point(-1,state.scrMargin.bottom);
            ft.name = "footer";
        }
        if (XmarkF == true) {
            this.createXmark(window, hiddenWindow, 14);
        }
        if (menuMarkF == true) {
            this.createMenuMark(window,menuCall, 14);
        }
        if (maxButtonF == true) {
            const cs=this.createMaxButton(window, resizeWindow, 14);
            cs.rightPositionFixed=true;
            if(XmarkF==true){
                cs.relativePosition=new point(cs.width*2+38,0);
            }else{
                cs.relativePosition=new point(cs.width+14,0);
            }
            
            const w=cs.width;
            const ctx = cs.getContext("2d");
            function resizeWindow(){
                //最大化ボタン
                if (!ctx) {
                    return;
                }
                ctx.clearRect(0, 0,cs.width,cs.height);
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 2;
                ctx.strokeRect(2, 2,w-4,w-4);
                if (window.maxSizeFlag == false) {
                    ctx.strokeRect(2, 7,Math.floor(w/2),Math.floor(w/2));//小さい四角を追加
                    window.oldpos=new rectangle(new point(window.style.left.removePx(),window.style.top.removePx()),
                        new size(window.style.width.removePx(),window.style.height.removePx()));
                    const ScreenH = Generic.getBrowserHeight();
                    const ScreenW = Generic.getBrowserWidth();
                    window.style.width = (ScreenW * 0.9).px();
                    window.style.height = (ScreenH * 0.9).px();
                    window.style.left = (ScreenW * 0.05).px();
                    window.style.top = (ScreenH * 0.05).px();
                    window.maxSizeFlag=true;
                } else {
                    window.oldpos = window.oldpos ?? new rectangle(new point(0,0), new size(0,0));
                    window.style.width = window.oldpos.width().px();
                    window.style.height = window.oldpos.height().px();
                    window.style.left = window.oldpos.left.px();
                    window.style.top = window.oldpos.top.px();
                    window.maxSizeFlag=false;
                }
                maxButtonCall();
            }
        }
        const winAny = window as Record<string, any>;
        winAny.setVisibility?.(visibilieF);
        window.setTitle = function (title) {
            const cnode = this.childNodes;
            for (let i = 0; i < cnode.length; i++) {
                if (cnode[i].name == 'header') {
                    cnode[i].innerHTML = title;
                    break;
                }
            }
        }
        return window;
    }

    static clear_backDiv() {

        //固定ウインドウを消す
        const last1 = document.body.lastChild;
        if (last1) {
            document.body.removeChild(last1);
        }
        const last2 = document.body.lastChild;
        if (last2) {
            document.body.removeChild(last2);
        }
    }

    static set_backDiv(
        idname: string, 
        title: string, 
        innerWidth: number | string, 
        innerHeight: number | string,
        okButtonF: boolean,
        cancelButtonF: boolean,
        okCall: (() => void) | undefined, 
        opacity: number,
        outerClickF: boolean,
        createXmark: boolean = true,
        cancelCall: (() => void) | undefined = undefined
    ): HTMLDivElement {

        /// <signature>
        /// <summary>固定ウインドウを作る</summary>
        /// <param name="idname">DIV要素のid</param>  
        /// <param name="innerWidth">内部div幅（ピクセル、省略可）</param>  
        /// <param name="innerHeight">内部div高さ（ピクセル、省略可）</param>  
        /// <param name="opacity">背景透過度（省略可）</param>  
        /// <returns >div要素</returns>  
        /// </signature>

        const e = document.getElementsByName("backDiv");
        const maxZindex = 1000 + e.length*10;
        const browserWidth = this.getBrowserWidth();
        const browserHeight = this.getBrowserHeight();
        const d = document.createElement("div");
        const deletediv = function (e: Event) {
        //固定ウインドウを消す
            e.preventDefault();
            const last1 = document.body.lastChild;
            if (last1) {
                document.body.removeChild(last1);
            }
            const last2 = document.body.lastChild;
            if (last2) {
                document.body.removeChild(last2);
            }
        };

        if (outerClickF == true) {
            d.onclick = deletediv;
            d.ontouchstart=deletediv;
        }
        d.setAttribute("id", "backDiv");
        d.setAttribute("name", "backDiv");
        d.setAttribute("style", "position:absolute;background-color:#000000;font-size:13px")
        d.style.zIndex = maxZindex.toString();
        d.style.top = "0px";
        d.style.left = "0px";
        d.style.width = '100%';
        d.style.height = '100%';
        d.style.opacity = "0.5";
        if (opacity != undefined) {
            d.style.opacity =opacity;
        }
        document.body.appendChild(d)

        let w = browserWidth * 0.9;
        if (innerWidth != undefined) {
            w = typeof innerWidth === 'number' ? innerWidth : Number(innerWidth);
        }
        let h = browserHeight * 0.8// / 2
        if (innerHeight != undefined) {
            h = typeof innerHeight === 'number' ? innerHeight : Number(innerHeight);
        }
        const state = appState();
        const y = this.getScrollY() + (browserHeight - h) / 2;
        const x = (browserWidth - w) / 2;
        const dup = this.createNewDiv(document.body, idname, "frontDIV", "setting", x, y, w, h, "background-color:#ffffff; border:solid 1px; border-radius: 4px;border-color:#666666;opacity:1", undefined);
        dup.style.zIndex = (maxZindex+1).toString();
        const head = Generic.createNewDiv(dup, "", "", "", 0, 0, '100%', state.scrMargin.top, "background-color: gray;color:#ffffff;font-size:15px", "");
        Generic.createNewSpan(head, title, "", "", 10, 0, "margin-top:4px", "");
        if(createXmark){
            const cv = this.createXmark(dup, cancelButton, 14);
        }

        let bux = w;
        if (cancelButtonF == true) {
            const ele=Generic.createNewButton(dup, "Cancel", "", bux - 80, h - 35, cancelButton, "width:70px;height:23px");
            ele.bottomRightPositionFixed=true;
            ele.relativePosition=new point(80,30);
            ele.name="cancel";
            bux -= 60;
        }
        if (okButtonF == true) {
            if (okCall == undefined) {
                okCall = deletediv;
            }
            const ele=Generic.createNewButton(dup, "OK", "", bux - 90, h - 35, okButton, "width:60px;height:23px");
            ele.bottomRightPositionFixed=true;
            if (cancelButtonF == true) {
                ele.relativePosition=new point(150,30);
            }else{
                ele.relativePosition=new point(90,30);
            }
            ele.name="ok";
        }
        function cancelButton(e: Event): void {
            deletediv(e);
            if(cancelCall!=undefined){
                cancelCall();
            }
        }
        function okButton(e: Event): void {
            okCall(e);
        }
        return dup;
    }



    static getScrollX() {

        const supportPageOffset = window.pageXOffset !== undefined;
        const isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
        const x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
        return x;
    }

    static getScrollY() {

        const supportPageOffset = window.pageXOffset !== undefined;
        const isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
        const y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
        return y;
    }

    static decodePolyline(data: string): number[][] {

        //Google Mapのエンコード化ポリラインをデコードする
        const cood = [];
        let n = 0;
        let selpos = 0;
        let cflag = 0;
        const sc = new latlon(0, 0);
        let newlat: number = 0;
        let newlon: number = 0;

        do {
            const strcode = [];
            let i = 0;
            while (true) {
                const w1 = data.substr(i + selpos, 1);
                const cd = w1.charCodeAt(0);
                strcode[i] = cd - 63;
                if (strcode[i] >= 32) {
                    strcode[i] -= 32;
                } else {
                    i++
                    break;
                }
                i++;
            }
            selpos += i;
            let binary = "";
            for (let j = 0; j < i; j++) {
                const x = ("00000" + strcode[i - j - 1].toString(2)).slice(-5)
                binary += x;
            }
            let binary10;
            if (binary.slice(-1) == "1") {
                binary10 = ~(parseInt(binary, 2));
            } else {
                binary10 = parseInt(binary, 2);
            }
            binary10 /= 2;
            const val = binary10 / 100000;

            if (cflag == 0) {
                sc.lat = val;
            } else {
                sc.lon = val;
                if (n == 0) {
                    cood[n] = [];
                    cood[n].push(sc.lat);
                    cood[n].push(sc.lon);
                    newlat = sc.lat;
                    newlon = sc.lon;
                } else {
                    cood[n] = [];
                    newlat = sc.lat + newlat;
                    newlon = sc.lon + newlon;
                    cood[n].push(newlat);
                    cood[n].push(newlon);
                }
                n++;
            }
            cflag = 1 - cflag;
        } while (selpos < data.length)
        return cood;
    }



    static Check_Two_Value_In(CheckV: number, V1: number, V2: number): number {

        //チェックする値が二つの数字の中間であればtrue

        if ((CheckV == V1) || (CheckV == V2)) {
            return chvValue_on_twoValue.chvJust;
        } else if (V1 < V2) {
            if ((V1 < CheckV) && (CheckV < V2)) {
                return chvValue_on_twoValue.chvIN;
            }
        } else {
            if ((V2 < CheckV) && (CheckV < V1)) {
                return chvValue_on_twoValue.chvIN;
            }
        }
        return chvValue_on_twoValue.chvOuter;
    }
    static Angle(si: number, co: number): number {//角度を求める

        let AngleV;
        if (co == 0) {
            AngleV = 90;
        } else {
            AngleV = Math.atan(Math.abs(si / co)) * 180 / Math.PI;
        }
        if ((0 <= si) && (0 <= co)) {
        } else if ((0 <= si) && (co < 0)) {
            AngleV = 180 - AngleV;
        } else if ((si < 0) && (0 <= co)) {
            AngleV = 360 - AngleV;
        } else if ((si < 0) && (co < 0)) {
            AngleV = 180 + AngleV;
        }
        return AngleV;
    }

    //クリップボードにテキスト出力
    static copyText(text: string): void {

        const ta = document.createElement("textarea") as HTMLTextAreaElement;
        ta.value = text;
        document.body.appendChild(ta);
        if (typeof ta.select === "function") {
            ta.select();
        }
        document.execCommand("copy");
        ta.parentElement?.removeChild(ta);
    }

    //フォントがシステムに入っているかチェック
    static checkFontExist(checkFont: string): boolean {

        const baseFonts = ['monospace', 'sans-serif', 'serif'];
        const testString = "mmmmmmmmmmlli";
        const testSize = '72px';
        const h = document.getElementsByTagName("body")[0];
        const s = document.createElement("span");
        s.style.fontSize = testSize;
        s.innerHTML = testString;
        const  defaultWidth: { [key: string]: number } = {};
        const defaultHeight: { [key: string]: number } = {};
        for (const index in baseFonts) {
            //get the default width for the three base fonts
            s.style.fontFamily = baseFonts[index];
            h.appendChild(s);
            defaultWidth[baseFonts[index]] = s.offsetWidth; //width for the default font
            defaultHeight[baseFonts[index]] = s.offsetHeight; //height for the defualt font
            h.removeChild(s);
        }
        let detected = false;
        for (const index in baseFonts) {
            s.style.fontFamily = checkFont + ',' + baseFonts[index];
            h.appendChild(s);
            const matched = (s.offsetWidth != defaultWidth[baseFonts[index]] || s.offsetHeight != defaultHeight[baseFonts[index]]);
            h.removeChild(s);
            detected = detected || matched;
        }
        return detected;
    }
//トップメニュー(ポップアップと上下の調整が取れないため未使用)
    static ceateTopMenu(ParentObj: HTMLElement, list: MenuItem[], pos: point, width: number): void {

        for(const i in list){
            const data=list[i];
            const div=this.createNewDiv(ParentObj,data.caption,"","",pos.x+Number(i)*width,pos.y,width,20,"position:absolute;background-color:#cccccc;", undefined);
            div.style.zIndex = "1000";
            div.setAttribute("name","topmenu");
            div.onmouseover =function(){
                const rect=div.getBoundingClientRect();
                const oldm=document.getElementById("popmenu");
                if(oldm!=undefined){
                    document.body.removeChild(oldm);
                }
                Generic.ceatePopupMenu(data.child,new point(rect.left,rect.bottom));
                const tm=document.getElementsByName("topmenu");
                for(let j=0;j< tm.length;j++){
                    tm[j].style.backgroundColor="#cccccc";
                }
                div.style.backgroundColor="#eeeeee";
            }
            div.onmouseleave=function(){
            }
    
        }
    }
    //ポップアップメニュー
    static ceatePopupMenu(list: MenuItem[], pos: point): void {

        
        const e = document.getElementsByName("backDiv");
        const maxZindex = 1000 + e.length * 10;
        let touchf=false;
        const mnudiv = document.createElement("div");
        
        const deletediv = function () {
            //メニューを消す
            const nd=document.getElementById("popmenu");
            if(nd!=undefined){
                document.body.removeChild(nd);
            }
            //トップメニューがある場合は色をそろえる
            const tm=document.getElementsByName("topmenu");
            for(let j=0;j< tm.length;j++){
                tm[j].style.backgroundColor="#cccccc";
            }
        };
        mnudiv.onclick = mnudicclivk;
        mnudiv.addEventListener('touchstart',mnudicclivk,false)
        function mnudicclivk(e: MouseEvent): void {
            e.stopPropagation();
            e.preventDefault();
            if(touchf==true){//タッチした直後はクリックスルー
                touchf=false;
            }else{
                deletediv();
            }
        }
        mnudiv.setAttribute("id", "popmenu");
        mnudiv.setAttribute("name", "backDiv");
        mnudiv.setAttribute("style", "position:absolute;back-ground");
        mnudiv.setAttribute("class", "popMenu");
        mnudiv.style.zIndex = maxZindex.toString();
        mnudiv.style.backgroundColor="#55555555"
        mnudiv.style.top = "0px";
        mnudiv.style.left = "0px";
        mnudiv.style.width = '100%';
        mnudiv.style.height = '100%';
        document.body.appendChild(mnudiv)

        const mainMenu = document.createElement("div");
        mnudiv.appendChild(mainMenu)
        let mainw = 0;
        let lineh = 0;
        for (const i in list) {
            const msp = document.createElement('span');
            mnudiv.appendChild(msp)
            msp.innerHTML = list[i].caption;
            mainw = Math.max(mainw, msp.offsetWidth);
            lineh = msp.offsetHeight;
            mnudiv.removeChild(msp);
        }
        lineh+=6;
        const y=list.length*lineh;
        let subn = 0;
        for (const i in list) {
            const data = list[i];
            if (data.caption == "-") {
                const md = this.createNewDiv(mainMenu, "", "", "popMenu", 10, Number(lineh) * Number(i) + Number(lineh) / 2, mainw + 20, 2, "", undefined);
                md.style.backgroundColor = '#dddddd';
            } else {
                const md = this.createNewDiv(mainMenu, data.caption, "", "", 0, Number(lineh) * Number(i), mainw + 20, Number(lineh)-2, "padding-top:2px;padding-left:20px", undefined);
                md.onmouseover = function () {
                    md.style.backgroundColor = '#dddddd';
                    for (const j in subMenu) {
                        subMenu[j].style.visibility = 'hidden';
                    }
                    if ((data.hasOwnProperty('child'))&&(md.enabled==true)) {
                        subMenu[md.submenunum].style.visibility = 'visible';
                    }
                }
                md.addEventListener("touchstart", touch, false);
                function touch() {
                    touchf=true;
                    md.style.backgroundColor = '#dddddd';
                    for (const j in subMenu) {
                        subMenu[j].style.visibility = 'hidden';
                    }
                    if ((data.hasOwnProperty('child'))&&(md.enabled==true)) {
                        subMenu[md.submenunum].style.visibility = 'visible';
                    }
                }
                md.onmouseleave = function () {
                    md.style.backgroundColor = 'white';
                }
                let enabled=true;
                if (data.hasOwnProperty('enabled')) {
                    if(data.enabled==false){
                        md.style.color="#888888";
                        enabled=false;
                    }
                }
                md.enabled=enabled;
                if (data.hasOwnProperty('event')) {
                    if (enabled==true) {
                        md.onclick = function (e) {
                            deletediv();
                            data.event(data,e);
                        }
                        md.ontouchend = function (e) {
                            deletediv();
                            data.event(data,e);
                        }
                    }
                }
                if (data.hasOwnProperty('checked')) {
                    let tx = "";
                    if (data.checked == true) {
                        tx = "✓";
                    }
                    this.createNewDiv(md, tx, "", "", 0, 0, 20, lineh, "", "");
                }
                if (data.hasOwnProperty('child')) {
                        this.createNewDiv(md, "‣", "", "", mainw + 20, 0, 10, lineh, "", "");
                        md.submenunum = subn;
                        subn++;
                }
            }
        }

        mainMenu.setAttribute("style", "position:absolute;border:solid 1px; border-radius: 1px;border-color:#666666;background-color:#ffffff");
        mainMenu.style.left = pos.x.px();
        mainMenu.style.top = pos.y.px();
        mainMenu.style.width = (mainw + 40).px();
        mainMenu.style.height = y.px();
        mainMenu.style.zIndex = (maxZindex + 1).toString();
        const subMenu: HTMLDivElement[] = [];
        for (const i in list) {
            if (list[i].hasOwnProperty('child')) {
                const smenu = document.createElement("div");
                mnudiv.appendChild(smenu);
                const cdata = list[i].child;
                let w = 0;
                for (const j in cdata) {
                    const msp = document.createElement('span');
                    mnudiv.appendChild(msp)
                    msp.innerHTML = cdata[j].caption;
                    w = Math.max(w, msp.offsetWidth);
                    mnudiv.removeChild(msp);
                }
                for (const j in cdata) {
                    const data = cdata[j];
                    if (data.caption == "-") {
                        const md = this.createNewDiv(smenu, "", "", "popMenu1", 10, lineh * Number(j) + lineh / 2, w  + 30, 2, "", "");
                        md.style.backgroundColor = '#dddddd';
                    } else {
                        const md = this.createNewDiv(smenu, data.caption, "", "", 0, lineh * Number(j), w + 10, lineh-2, "padding-top:2px;padding-left:20px", "");
                        md.setAttribute("name", "popmenu1");
                        md.onmouseover = function () {
                            md.style.backgroundColor = '#dddddd';
                        }
                        md.onmouseleave = function () {
                            md.style.backgroundColor = 'white';
                        }
                        let enabled=true;
                        if (data.hasOwnProperty('enabled')) {
                            if(data.enabled==false){
                                md.style.color="#888888";
                                enabled=false;
                            }
                        }
                        if ((data.hasOwnProperty('event'))&&(enabled==true)) {
                            md.onclick = function () {
                                deletediv();
                                data.event(data);
                            }
                            md.ontouchend = function (e) {
                                deletediv();
                                data.event(data,e);
                            }
                        }
                        if (data.hasOwnProperty('checked')) {
                            let tx = "";
                            if (data.checked == true) {
                                tx = "✓";
                            }
                            this.createNewDiv(md, tx, "", "", 0, 0, 20, lineh, "", "");
                        }
    
                    }

                }
                smenu.setAttribute("style", "position:absolute;border:solid 1px; border-radius: 1px;border-color:#666666;background-color:#ffffff")
                smenu.style.left = (mainw + 40 + pos.x - 5).px();
                smenu.style.top = (lineh * Number(i) + pos.y).px();
                smenu.style.width = (w + 30).px();
                smenu.style.height = (lineh * cdata.length).px();
                smenu.style.visibility = 'hidden';
                smenu.style.zIndex = (maxZindex + 1).toString();
                subMenu.push(smenu);
            }
        }
        let menuRect=new rectangle(new point(mainMenu.style.left.removePx(),mainMenu.style.top.removePx()),new size(mainMenu.clientWidth,mainMenu.clientHeight));
        if(subMenu.length>0){
            for (const i in subMenu){
                const menuRectSub=new rectangle(new point(subMenu[i].style.left.removePx(),subMenu[i].style.top.removePx()),new size(subMenu[i].clientWidth,subMenu[i].clientHeight));
                menuRect=spatial.getCircumscribedRectangle(menuRect,menuRectSub);
            }
        }

        const gScreenWidth = (Generic.getBrowserWidth());
        const gScreenHeight = (Generic.getBrowserHeight());
        if (menuRect.bottom > gScreenHeight) {
            const sa=menuRect.bottom - gScreenHeight;
            mainMenu.style.top = (menuRect.top -sa ).px();
            for (const i in subMenu){
                subMenu[i].style.top=(subMenu[i].style.top.removePx()-sa).px()
            }
        }
        if (menuRect.right > gScreenWidth) {
            const sa=menuRect.right - gScreenWidth;
            mainMenu.style.left = (menuRect.left - sa).px();
            for (const i in subMenu){
                subMenu[i].style.left=(subMenu[i].style.left.removePx()-sa).px()
            }
        }
    }

    /**メニューオブジェクトのプロパティからオブジェクトを取得する */
    static getPopMenuObj(menuObj: MenuItem[], property: string, pname: string): MenuItem | undefined {

        for (const i in menuObj) {
            if (menuObj[i].hasOwnProperty(property)) {
                if ((menuObj[i] as Record<string, any>)[property] == pname) {
                    return menuObj[i];
                }
                if (menuObj[i].child) {
                    const v = this.getPopMenuObj(menuObj[i].child!, property, pname);
                    if (v != undefined) {
                        return v;
                    }
                }
            }
        }
        return undefined;
    }
};

 
(globalThis as Record<string, any>).Generic = Generic;
 
(globalThis as Record<string, any>).TKY2JGDInfo = new TKY2JGDInfo_Impl();

// ESM-friendly export handles
export const TKY2JGDInfo = new TKY2JGDInfo_Impl();


/**チェックリストボックス twoStepCheckF:二回目のクリックでチェックを変更*/
export class CheckedListBox {
    length: number = 0;
    selectedIndex: number = -1;
    private lineH: number;
    private allh: number;
    private w: number;
    private lBox: HTMLDivElement[] = [];
    private frame: HTMLElement;
    private inFrame: HTMLElement;
    private width: number;
    private height: number;
    private twoStepCheckF: boolean;
    private onChange: (index: number) => void;

    constructor(
        ParentObj: HTMLElement,
        Class: string,
        list: string[],
        x: number,
        y: number,
        width: number,
        height: number,
        twoStepCheckF: boolean,
        onChange: (index: number) => void,
        styleinfo: string = ""
    ) {
        const state = appState();
        this.width = width;
        this.height = height;
        this.twoStepCheckF = twoStepCheckF;
        this.onChange = onChange;
        this.lineH = Generic.getDivSize("A", undefined, "").height + 3;
        this.allh = this.lineH * list.length;
        const ovy = (this.allh < height - 2) ? "" : "overflow-y: scroll;";
        this.w = (this.allh < height - 2) ? width - 2 : width - (state.scrMargin.scrollWidth ?? 0) - 1;
        this.frame = Generic.createNewDiv(ParentObj, "", Class, "grayFrame", x, y, width, height - 24, ovy + "overflow-x:hidden;background-color:white;user-Select:none");
        const allSelFrame = Generic.createNewDiv(ParentObj, "", "", "", x, y + (height - 22), this.w, 22, "");
        Generic.createNewButton(allSelFrame, "全選択", "", width - 115, 0, () => { this.allChange(true); if (onChange != undefined) { onChange(-1); } }, "width:55px;height:22px;padding:0");
        Generic.createNewButton(allSelFrame, "全解除", "", width - 55, 0, () => { this.allChange(false); if (onChange != undefined) { onChange(-1); } }, "width:55px;height:22px;padding:0");
        this.inFrame = Generic.createNewDiv(this.frame, "", "", "", 0, 0, this.w, this.allh, "");
        this._addList(list, 0, styleinfo);
    }

    /**リ1つ追加 */
    add(soloData: string, pos: number | undefined = undefined): void {
        if (pos == undefined) {
            pos = this.length;
        }
        this._addList([soloData], pos, "");
    }

    /**リストを追加 */
    addList(list: string[], pos: number): void {
        this._addList(list, pos, "");
    }

    /**指定範囲のリストを削除 */
    removeList(pos: number, delNum: number): void {
        this._removeList(pos, delNum);
    }

    /**全リストを削除 */
    removeAll(): void {
        this._removeList(0, this.lBox.length);
    }

    /**チェック状態を取得 */
    getCheckedStatus(n: number): boolean {
        return this.lBox[n].checked;
    }

    /**チェック状態を設定 */
    setCheckStatus(n: number, checked: boolean): void {
        this.lBox[n].checked = checked;
    }

    /**テキストを設定 */
    setText(n: number, text: string): void {
        this.lBox[n].word.innerHTML = text;
    }

    /**チェックの状態を返す checkedStatus:全項目のtrue|false,checkedArray:trueの番号一覧*/
    getChecked(): { checkedStatus: boolean[], checkedArray: number[] } {
        return this._getChecked();
    }

    private _removeList(pos: number, delNum: number): void {
        if (this.lBox.length == 0) {
            return;
        }
        for (let i = 0; i < delNum; i++) {
            if (this.selectedIndex == (i + pos)) {
                this.setIndexColor(-1);
            }
            this.inFrame.removeChild(this.lBox[i + pos].word);
            this.inFrame.removeChild(this.lBox[i + pos]);
        }
        this.lBox.splice(pos, delNum);
        this.reNumbering();
    }

    private _addList(lst: string[], pos: number, styleinfo: string): void {
        const osel = this.selectedIndex;
        const newsel = (osel == -1) ? -1 : osel + lst.length;
        if (osel >= pos) {
            this.setIndexColor(-1);
        }
        for (let i = 0; i < lst.length; i++) {
            const ypos = (i + pos) * this.lineH;
            const asfdisabled = (lst[i].text.left(1) == "*");
            const cbox = Generic.createNewInput(this.inFrame, "checkbox", "", "", 3, ypos, undefined, "");
            cbox.checked = lst[i].checked;
            cbox.disabled = asfdisabled;
            const change = (e: Event) => {
                const obj = e.target as HTMLInputElement;
                const newSel = Number(obj.tag);
                if (this.selectedIndex != newSel) {
                    this.setIndexColor(newSel);
                    if (this.twoStepCheckF == true) {
                        this.lBox[newSel].checked = !this.lBox[newSel].checked;
                        return;
                    }
                }
                if (typeof this.onChange === 'function') {
                    const retV = this._getChecked();
                    this.onChange(newSel);
                }
            };
            cbox.onchange = change;
            cbox.word = Generic.createNewDiv(this.inFrame, lst[i].text, "", "", 20, ypos, undefined, undefined, styleinfo + ";padding-left:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap",
                function (e: MouseEvent) {
                    if (asfdisabled == false) {
                        cbox.checked = !cbox.checked;
                        change(e);
                    }
                });
            this.lBox.splice(pos + i, 0, cbox);
        }
        this.reNumbering();
        if (osel >= pos) {
            this.setIndexColor(newsel);
        }
    }

    private setIndexColor(newSel: number): void {
        if (this.selectedIndex != -1) {
            this.lBox[this.selectedIndex].word.style.backgroundColor = "#ffffff";
        }
        this.selectedIndex = newSel;
        if (newSel != -1) {
            this.lBox[newSel].word.style.backgroundColor = "#e1e1ff";
        }
    }

    private _getChecked(): { checkedStatus: boolean[], checkedArray: number[] } {
        const checkedList = [];
        const checkedArray = [];
        for (let i = 0; i < this.lBox.length; i++) {
            checkedList.push(this.lBox[i].checked);
            if (this.lBox[i].checked) {
                checkedArray.push(i);
            }
        }
        return { checkedStatus: checkedList, checkedArray: checkedArray };
    }

    private allChange(checked: boolean): void {
        for (let i = 0; i < this.lBox.length; i++) {
            if (this.lBox[i].disabled == false) {
                this.lBox[i].checked = checked;
            }
        }
    }

    private reNumbering(): void {
        const state = appState();
        this.allh = this.lineH * this.lBox.length;
        this.w = (this.allh < this.height - 2) ? this.width - 2 : this.width - (state.scrMargin.scrollWidth ?? 0) - 1;
        this.inFrame.style.height = this.allh.px();
        for (let i = 0; i < this.lBox.length; i++) {
            this.lBox[i].style.top = (i * this.lineH).px();
            this.lBox[i].tag = i;
            this.lBox[i].word.style.top = (i * this.lineH + 3).px();
            this.lBox[i].word.style.width = (this.w - 20).px();
            this.lBox[i].word.tag = i;
        }
        this.length = this.lBox.length;
    }
}

/**リストボックスコントロール addEventListenerを付ける場合は.frameに*/
export class ListBox {
    selectedIndex: number = -1;
    length: number = 0;
    value: string | undefined = undefined;
    frame: HTMLElement;
    private lBox: HTMLElement[] = [];
    private lineH: number;
    private allh: number;
    private w: number;
    private width: number;
    private height: number;
    private inFrame: HTMLElement;
    private Class: string;
    private styleinfo: string;
    private onChange: ((index: number) => void) | null;

    constructor(ParentObj: HTMLElement, Class: string, list: string[], x: number | string, y: number | string, width: number, height: number, onChange: ((index: number) => void) | null, styleinfo: string = "") {
        const state = appState();
        this.width = width;
        this.height = height;
        this.Class = Class;
        this.styleinfo = styleinfo;
        this.onChange = onChange;
        this.lineH = Generic.getDivSize("A", undefined, "").height + 3;
        this.allh = this.lineH * list.length;
        const ovy = (this.allh < height - 2) ? "" : "overflow-y: scroll";
        this.w = (this.allh < height - 2) ? width - 2 : width - (state.scrMargin.scrollWidth ?? 0) - 1;
        this.frame = Generic.createNewDiv(ParentObj, "", "", "grayFrame", x, y, width, height, ovy + "overflow-x:hidden;background-color:white");
        this.inFrame = Generic.createNewDiv(this.frame, "", "", "", 0, 0, this.w, this.allh, "");
        this._addList(list, 0);
    }

    /**1つ追加 */
    add(soloData: string, pos: number | undefined = undefined): void {
        if (pos == undefined) {
            pos = this.length;
        }
        this._addList([soloData], pos);
    }

    /**リストを配列で追加 */
    addList(list: string[], pos: number | undefined = undefined): void {
        if (pos == undefined) {
            pos = this.length;
        }
        this._addList(list, pos);
    }

    /**指定範囲のリストを削除 */
    removeList(pos: number, delNum: number): void {
        this._removeList(pos, delNum);
    }

    /**全リストを削除 */
    removeAll(): void {
        this._removeList(0, this.lBox.length);
    }

    /**選択要素を指定 */
    setSelectedIndex(newIndex: number): void {
        if (this.selectedIndex != -1) {
            this.lBox[this.selectedIndex].style.backgroundColor = "#ffffff";
        }
        this.selectedIndex = newIndex;
        this.lBox[newIndex].style.backgroundColor = "#e1e1e1";
        this.value = this.lBox[newIndex].value;
    }

    getText(): string | undefined {
        if (this.selectedIndex != -1) {
            return this.lBox[this.selectedIndex].innerText;
        } else {
            return undefined;
        }
    }

    getAllText(): string[] {
        const v = [];
        for (let i = 0; i < this.length; i++) {
            v.push(this.lBox[i].innerText);
        }
        return v;
    }

    getValue(): string | undefined {
        if (this.selectedIndex != -1) {
            return this.lBox[this.selectedIndex].value;
        } else {
            return undefined;
        }
    }

    getAllValue(): string[] {
        const v = [];
        for (let i = 0; i < this.length; i++) {
            v.push(this.lBox[i].value);
        }
        return v;
    }

    setText(row: number, text: string): void {
        this.lBox[row].innerText = text;
    }

    setValue(row: number, value: string): void {
        this.lBox[row].innerText = value;
    }

    rowUp(row: number): void {
        if (this.lBox.length < 2) {
            return;
        }
        let dest = row - 1;
        dest = (dest == -1) ? this.lBox.length - 1 : dest;
        [this.lBox[row].innerText, this.lBox[dest].innerHTML] = [this.lBox[dest].innerText, this.lBox[row].innerHTML];
        [this.lBox[row].value, this.lBox[dest].value] = [this.lBox[dest].value, this.lBox[row].value];
        if (row == this.selectedIndex) {
            this.lBox[this.selectedIndex].style.backgroundColor = "#ffffff";
            this.selectedIndex = dest;
            this.lBox[this.selectedIndex].style.backgroundColor = "#e1e1e1";
        }
    }

    rowDown(row: number): void {
        if (this.lBox.length < 2) {
            return;
        }
        let dest = row + 1;
        dest = (dest == this.lBox.length) ? 0 : dest;
        [this.lBox[row].innerText, this.lBox[dest].innerHTML] = [this.lBox[dest].innerText, this.lBox[row].innerHTML];
        [this.lBox[row].value, this.lBox[dest].value] = [this.lBox[dest].value, this.lBox[row].value];
        if (row == this.selectedIndex) {
            this.lBox[this.selectedIndex].style.backgroundColor = "#ffffff";
            this.selectedIndex = dest;
            this.lBox[this.selectedIndex].style.backgroundColor = "#e1e1e1";
        }
    }

    private _addList(lst: Array<{text: string, value: string}>, pos: number): void {
        if (lst.length == 0) {
            return;
        }
        if (this.selectedIndex != -1) {
            this.lBox[this.selectedIndex].style.backgroundColor = "#ffffff";
        }
        this.selectedIndex = pos;
        for (const i in lst) {
            const div = Generic.createNewDiv(this.inFrame, lst[i].text, "", this.Class, 3, Number(i) * this.lineH, this.w, this.lineH, this.styleinfo + ";overflow:hidden;text-overflow:ellipsis;white-space:nowrap;background-color:white",
                (e: MouseEvent) => {
                    if (this.selectedIndex != -1) {
                        this.lBox[this.selectedIndex].style.backgroundColor = "#ffffff";
                    }
                    const obj = e.target as HTMLElement & {tag: string};
                    obj.style.backgroundColor = "#e1e1e1";
                    this.selectedIndex = Number(obj.tag);
                    this.value = this.lBox[this.selectedIndex].value;
                    if (typeof this.onChange === 'function') {
                        this.onChange(Number(obj.tag));
                    }
                });
            div.value = lst[i].value;
            this.lBox.splice(pos + Number(i), 0, div);
        }
        this.reNumbering();
    }

    private _removeList(pos: number, delNum: number): void {
        if (this.lBox.length == 0) {
            return;
        }
        if (this.selectedIndex != -1) {
            this.lBox[this.selectedIndex].style.backgroundColor = "#ffffff";
        }
        for (let i = 0; i < delNum; i++) {
            this.inFrame.removeChild(this.lBox[i + pos]);
        }
        this.lBox.splice(pos, delNum);
        if (this.selectedIndex >= pos) {
            this.selectedIndex -= delNum;
            this.selectedIndex = (this.selectedIndex < 0) ? 0 : this.selectedIndex;
        }
        this.reNumbering();
    }

    private reNumbering(): void {
        const state = appState();
        this.allh = this.lineH * this.lBox.length;
        this.w = (this.allh < this.height - 2) ? this.width - 2 : this.width - (state.scrMargin.scrollWidth ?? 0) - 1;
        this.inFrame.style.height = this.allh.px();
        for (let i = 0; i < this.lBox.length; i++) {
            this.lBox[i].style.top = (i * this.lineH).px();
            this.lBox[i].style.width = this.w.px();
            this.lBox[i].tag = i;
        }
        if (this.lBox.length > 0) {
            this.lBox[this.selectedIndex].style.backgroundColor = "#e1e1e1";
            this.value = this.lBox[this.selectedIndex].value;
        } else {
            this.selectedIndex = -1;
            this.value = undefined;
        }
        this.length = this.lBox.length;
    }
}

/**リストビューコントロール_rowselFlag=trueでクリックした行を返す,selectedRowで選択中の行 */
export class ListViewTable {
    frameStyleinfo: string;
    styleinfo: string;
    normalStyleinfo: string;
    headStyleinfo: string;
    headXStyleinfo: string[];
    normalXStyleinfo: string[];
    rowselFlag: boolean;
    selectedRow: number = -1;
    oldBG: string[] = [];
    thead: HTMLTableSectionElement | null = null;
    tb: HTMLTableElement | null = null;
    tbody: HTMLTableSectionElement | null = null;
    tbdiv: HTMLDivElement | null = null;
    private topDIV: HTMLElement;
    private headNum: number;
    private bpos: number = -1;
    private mousePointingSituation: number = mousePointingSituations.up;
    private tbhdiv: HTMLElement;
    private tbh: HTMLTableElement | undefined;
    private tbhHeight: number = 0;
    private onclick: ((row: number) => void) | null;

    constructor(
        ParentObj: HTMLElement,
        gridID: string,
        gridClass: string,
        tableClass: string,
        hdata: string[][],
        data: string[][],
        x: number | string,
        y: number | string,
        width: number | string,
        height: number,
        frameStyleinfo: string,
        styleinfo: string,
        headStyleinfo: string,
        normalStyleinfo: string,
        headXStyleinfo: string[],
        normalXStyleinfo: string[],
        _rowselFlag: boolean,
        onclick: ((row: number) => void) | null
    ) {
        this.frameStyleinfo = frameStyleinfo;
        this.styleinfo = styleinfo;
        this.normalStyleinfo = normalStyleinfo;
        this.headStyleinfo = headStyleinfo;
        this.headXStyleinfo = headXStyleinfo;
        this.normalXStyleinfo = normalXStyleinfo;
        this.rowselFlag = _rowselFlag;
        this.onclick = onclick;
        const state = appState();
        this.topDIV = Generic.createNewDiv(ParentObj, gridID, "", gridClass, x, y, width, height, this.frameStyleinfo, undefined);

        this.headNum = hdata[0].length;
        this.tbhdiv = document.createElement("div");

        if (this.headNum > 0) {
            this.tbh = document.createElement("table");
            this.tbh.setAttribute("style", "user-select: none;" + this.styleinfo);
            this.tbh.setAttribute("class", tableClass);
            this.tbh.style.tableLayout = 'fixed';
            this.tbh.style.width = '100%';
            this.tbh.onmousemove = (e) => {
                if (!e.target) { return; }
                switch (this.mousePointingSituation) {
                    case mousePointingSituations.up: {
                        const target = e.target as HTMLElement;
                        const x = target.offsetLeft + e.offsetX;
                        const n = this.tbh!.rows[0].cells.length;
                        this.bpos = -1;
                        for (let i = 0; i < n - 1; i++) {
                            const cellBorderx0 = this.tbh!.rows[0].cells[i].offsetLeft + this.tbh!.rows[0].cells[i].offsetWidth;
                            if ((Math.abs(x - cellBorderx0) < 10)) {
                                this.tbh!.style.cursor = 'w-resize';
                                this.bpos = i;
                                break;
                            }
                        }
                        if (this.bpos == -1) {
                            this.tbh!.style.cursor = 'default';
                        }
                        break;
                    }
                    case mousePointingSituations.down as number: {
                        if (this.bpos != -1) {
                            const target = e.target as HTMLElement;
                            const x = target.offsetLeft + e.offsetX;
                            const w = x - this.tbh!.rows[0].cells[this.bpos].offsetLeft;
                            this.tbh!.rows[0].cells[this.bpos].style.width = w.px();
                            if (this.tb.rows[0] != undefined) {
                                this.tb.rows[0].cells[this.bpos].style.width = w.px();
                            }
                        }
                        break;
                    }
                }
            };
            this.tbh.onmousedown = (e) => {
                this.mousePointingSituation = mousePointingSituations.down as number;
            };
            this.tbh.onmouseup = (e) => {
                this.bpos = -1;
                this.mousePointingSituation = mousePointingSituations.up as number;
            };
            this.thead = this.tbh.createTHead();
            this.thead.setAttribute("style", this.headStyleinfo);

            for (let i = 0; i < this.headNum; i++) {
                const row = this.thead.insertRow(-1);

                for (let j = 0; j < hdata.length; j++) {
                    const newCell = row.insertCell(-1);
                    newCell.setAttribute("style", "overflow:hidden;text-overflow:ellipsis;white-space:nowrap");
                    if ((this.headXStyleinfo[j] != undefined)) {
                        newCell.setAttribute("style", this.headXStyleinfo[j]);
                    }
                    newCell.innerHTML = hdata[j][i];
                }
            }

            this.tbhdiv.appendChild(this.tbh);
            document.body.appendChild(this.tbhdiv);
            this.tbhHeight = this.tbhdiv.clientHeight;
            document.body.removeChild(this.tbhdiv);
            this.topDIV.appendChild(this.tbhdiv);
        }

        const xcell = data.length;

        this.tbdiv = document.createElement("div");
        if (this.headNum > 0) {
            this.tbhHeight = height - this.tbhHeight;
        } else {
            this.tbhHeight = height;
        }
        this.tbdiv.setAttribute("style", "height:" + this.tbhHeight.px() + ";overflow-y: scroll;overflow-x:hidden");
        this.tb = document.createElement("table");
        this.tb.setAttribute("style", "user-select: none;" + this.styleinfo);
        this.tb.setAttribute("class", tableClass);
        this.tb.style.tableLayout = 'fixed';
        this.tb.style.width = '100%';
        this.tbody = this.tb.createTBody();

        const clickTBody = (e: MouseEvent) => {
            this.selectRow(e.target.parentNode.rowIndex);
            if (typeof this.onclick === 'function') {
                this.onclick(e.target.parentNode.rowIndex);
            }
        };

        if (xcell > 0) {
            const ycell = data[0].length;
            for (let i = 0; i < ycell; i++) {
                const row = this.tbody.insertRow(-1);
                row.setAttribute("style", this.normalStyleinfo);
                for (let j = 0; j < xcell; j++) {
                    const newtd = row.insertCell(-1);
                    newtd.innerHTML = data[j][i];
                    newtd.setAttribute("style", "overflow:hidden;text-overflow:ellipsis;white-space:nowrap");
                    if (this.normalXStyleinfo[j] != undefined) {
                        newtd.setAttribute("style", this.normalXStyleinfo[j]);
                    }
                    newtd.onclick = clickTBody;
                }
            }
            this.selectRow(0);
        }

        this.tb.appendChild(this.tbody);
        this.tbdiv.appendChild(this.tb);
        this.topDIV.appendChild(this.tbdiv);
        if (this.headNum > 0) {
            this.tbhdiv.style.width = (width - (state.scrMargin.scrollWidth ?? 0)).px();
        }
    }

    selectRow(newSelRow: number): void {
        if (this.rowselFlag == true) {
            if ((this.selectedRow >= 0) && (this.selectedRow < this.tb.rows.length)) {
                for (let i = 0; i < this.tb.rows[this.selectedRow].cells.length; i++) {
                    this.tb.rows[this.selectedRow].cells[i].style.backgroundColor = this.oldBG[i];
                }
            }
            this.oldBG = [];
            if (newSelRow != -1) {
                for (let i = 0; i < this.tb.rows[newSelRow].cells.length; i++) {
                    this.oldBG.push(this.tb.rows[newSelRow].cells[i].style.backgroundColor);
                    this.tb.rows[newSelRow].cells[i].style.backgroundColor = "#e1e1e1";
                }
            }
        }
        this.selectedRow = newSelRow;
    }

    /**行にデータ挿入prototypeでは作りにくい rowInsertPos=0の場合はselectedRowの前に、1の場合は後ろに追加*/
    insertRow(rowInsertPos: number, plusData: string[]): void {
        const rn = this.tb!.rows.length;
        const rowpos = this.selectedRow + rowInsertPos;
        const row = this.tbody!.insertRow(rowpos);
        row.setAttribute("style", this.normalStyleinfo);
        for (let j = 0; j < plusData.length; j++) {
            const newtd = row.insertCell(-1);
            newtd.innerHTML = plusData[j];
            newtd.setAttribute("style", "overflow:hidden;text-overflow:ellipsis;white-space:nowrap");
            if (this.normalXStyleinfo[j] != undefined) {
                newtd.setAttribute("style", this.normalXStyleinfo[j]);
            }
            newtd.onclick = (e: MouseEvent) => {
                const target = e.target as HTMLElement;
                const row = target.parentNode as HTMLTableRowElement;
                this.selectRow(row.rowIndex);
                if (typeof this.onclick === 'function') {
                    this.onclick(row.rowIndex);
                }
            };
            if ((this.headNum > 0) && (rn == 0)) {
                newtd.style.width = this.tbh!.rows[0].cells[j].style.width;
            }
        }
        if (rowInsertPos == 0) {
            this.selectedRow++;
        }
        this.selectRow(rowpos);
    }
    /**ListViewの行数取得 */
    getRowNumber(): number {
        return this.tb!.rows.length;
    }

    /**selectedRowの行削除 */
    deleteRow(): void {
        const rowPos = this.selectedRow;
        if (rowPos == -1) { return; }
        this.tbody!.deleteRow(rowPos);
        if (this.tb!.rows.length == 0) {
            this.selectedRow = -1;
        } else {
            const newsel = Math.min(this.selectedRow, this.tb!.rows.length - 1);
            this.selectRow(newsel);
        }
    }

    /**セルに値を設定 */
    setValue(x: number, y: number, value: string): void {
        this.tb!.rows[y].cells[x].innerHTML = value;
    }

    /**行の上下を反転 */
    reverse(): void {
        const n = this.tb!.rows.length;
        const celln = this.tb!.rows[0].cells.length;
        for (let i = 0; i < Math.floor(n / 2); i++) {
            const r1 = this.tb!.rows[i];
            const r2 = this.tb!.rows[n - 1 - i];
            for (let j = 0; j < celln; j++) {
                [r1.cells[j].innerHTML, r2.cells[j].innerHTML] = [r2.cells[j].innerHTML, r1.cells[j].innerHTML];
            }
        }
        const newsel = this.tb!.rows.length - 1 - this.selectedRow;
        this.selectRow(newsel);
    }

    /**selectedRowの行上移動 */
    rowUp(): void {
        if (this.tb!.rows.length < 2) { return; }
        const rowPos = this.selectedRow;
        const celln = this.tb!.rows[rowPos].cells.length;
        const dest = rowPos - 1;
        if (dest == -1) {
            const stac = [];
            for (let i = 0; i < celln; i++) {
                stac.push(this.tb!.rows[rowPos].cells[i].innerHTML);
            }
            this.deleteRow();
            this.selectRow(this.tb!.rows.length - 1);
            this.insertRow(1, stac);
            this.tbdiv!.scrollTop = (this.tbdiv as HTMLElement & {scrollTopMax: number}).scrollTopMax;
        } else {
            for (let i = 0; i < celln; i++) {
                [this.tb!.rows[rowPos].cells[i].innerHTML, this.tb!.rows[dest].cells[i].innerHTML] = [this.tb!.rows[dest].cells[i].innerHTML, this.tb!.rows[rowPos].cells[i].innerHTML];
            }
            this.selectRow(dest);
        }
    }
    /**selectedRowの行下移動 */
    rowDown(): void {
        const maxrow = this.tb!.rows.length;
        if (maxrow < 2) { return; }
        const rowPos = this.selectedRow;
        const celln = this.tb!.rows[rowPos].cells.length;
        const dest = rowPos + 1;
        if (dest == maxrow) {
            const stac = [];
            for (let i = 0; i < celln; i++) {
                stac.push(this.tb!.rows[rowPos].cells[i].innerHTML);
            }
            this.deleteRow();
            this.selectRow(0);
            this.insertRow(0, stac);
            this.tbdiv!.scrollTop = 0;
        } else {
            for (let i = 0; i < celln; i++) {
                [this.tb!.rows[rowPos].cells[i].innerHTML, this.tb!.rows[dest].cells[i].innerHTML] = [this.tb!.rows[dest].cells[i].innerHTML, this.tb!.rows[rowPos].cells[i].innerHTML];
            }
            this.selectRow(dest);
        }
    }
    /**表クリア */
    clear(): void {
        const maxrow = this.tb!.rows.length;
        for (let i = maxrow - 1; i >= 0; i--) {
            this.selectRow(i);
            this.deleteRow();
        }
        this.selectRow(-1);
    }
}

//ウインドウの最大化ボタンをリセットする
// @ts-ignore
const resetMaxButtonFunc = function(this: HTMLElement, MaxFlag?: boolean): void {
    const cnode = this.childNodes;
    for (let i = 0; i < cnode.length; i++) {
        const child = cnode[i] as HTMLCanvasElement & {name?: string};
        if (child.name == 'maxButton') {
            const ctx = child.getContext("2d");
            if (!ctx) continue;
            const w=child.width;
            ctx.clearRect(0, 0,child.width,child.height);
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.strokeRect(2, 2,w-4,w-4);
            if (MaxFlag == false) {
                ctx.strokeRect(2, 7,Math.floor(w/2),Math.floor(w/2));//小さい四角を追加
            }
            break;
        }
    }
    if(MaxFlag==true){
        (this as Record<string, any>).maxSizeFlag=false;
    }else{
        (this as Record<string, any>).maxSizeFlag=true;
    }
};
// @ts-ignore
(Element.prototype as Record<string, any>)['resetMaxButton'] = resetMaxButtonFunc;

//DIV要素の移動，拡大縮小
// @ts-ignore
(Element.prototype as Record<string, any>)['dragBorder'] = function(movingCall?: Function, moveEndCall?: Function): void {
    const state = appState();
    let x: number;
    let y: number;
    let fx: number;
    let fy: number;
    let fW: number;
    let fH: number;
    let fLeft: number;
    let fTop: number;
    let mode: string | number;
    let mdownF=false;
    const targetEle=this;
    const SR=10;
    const TR=state.scrMargin.top;

    this.addEventListener("mousedown", mdown, false);
    this.addEventListener("touchstart", mdown, false);
    this.addEventListener("mousemove", mmovef, false);
    function mmovef(event: MouseEvent) {
        //要素内の相対座標を取得
        fx = event.pageX- this.parentElement.offsetLeft;
        fy = event.pageY- this.parentElement.offsetTop;
        x = fx - this.offsetLeft;
        y = fy - this.offsetTop;
        fW = this.style.width.removePx();
        fH = this.style.height.removePx()
        const posX = fW - x;
        const posY = fH - y;
        const top = this.offsetTop;
        //拡大縮小エリアのカーソル
        if ((posX < SR) && (posY < SR)) {
            this.style.cursor = 'se-resize';
        } else if ((posX < SR) && (y < TR)) {
            this.style.cursor = 'ne-resize';
        } else if ((x < SR) && (y < TR)) {
            this.style.cursor = 'nw-resize';
        } else if ((x < SR) && (posY < SR)) {
            this.style.cursor = 'sw-resize';
        } else if ((posX < SR) && (y > TR)) {
            this.style.cursor = 'e-resize';
        } else if ((x < SR)) {
            this.style.cursor = 'w-resize';
        } else if ((posY < SR) && (top > 0)) {
            this.style.cursor = 's-resize';
        } else if ((((0 <= y) && (y <= TR)) || ((posY < SR) && (top <= 0))) && (70<posX )&&(40<x)) {
            if (y < 3) {
                this.style.cursor = 'n-resize';
            } else {
                this.style.cursor = 'move';
            }
        } else {
            this.style.cursor = 'default';
        }
    }

    //マウスが押された際の関数
    function mdown(e: MouseEvent) {
        e.stopPropagation();
        let checkF = true;
         mdownF=true;
        //タッチデイベントとマウスのイベントの差異を吸収
        let event;
        if (e.type === "mousedown") {
             event = e;
        } else {
             event = e.changedTouches[0];
        }

        //要素内の相対座標を取得
        fx = event.pageX- this.parentElement.offsetLeft;
        fy = event.pageY- this.parentElement.offsetTop;
        fW = this.style.width.removePx();
        fH = this.style.height.removePx();
        fLeft = this.style.left.removePx();
        fTop = this.style.top.removePx();
        x = fx - this.offsetLeft;
        y = fy - this.offsetTop;
        const posX = fW - x;
        const posY = fH - y;
        const top = this.offsetTop;
        //拡大縮小エリアのカーソルとモード設定
        if ((posX < SR) && (posY < SR)) {
            this.style.cursor = 'se-resize';
            mode = 'se-resize';
        } else if ((posX < SR) && (y < TR)) {
            this.style.cursor = 'ne-resize';
            mode = 'ne-resize';
        } else if ((x < SR) && (y < TR)) {
            this.style.cursor = 'nw-resize';
            mode = 'nw-resize';
        } else if ((x < SR) && (posY < SR)) {
            this.style.cursor = 'sw-resize';
            mode = 'sw-resize';
        } else if ((posX < SR) && (y > TR)) {
            this.style.cursor = 'e-resize';
            mode = 'e-resize';
        } else if ((x < SR) && (y > TR)) {
            this.style.cursor = 'w-resize';
            mode = 'w-resize';
        } else if ((posY < SR) && (top > 0)) {
            this.style.cursor = 's-resize';
            mode = 's-resize';
        } else if ((((0 <= y) && (y <= TR)) || ((posY < SR) && (top <= 0))) && (posX > 60)) {
            if (x > 40) {
                if (y < 3) {
                    this.style.cursor = 'n-resize';
                    mode = 'n-resize';
                } else {
                    this.style.cursor = 'move';
                    mode = 'move';
                }
            }
        } else {
            checkF = false;
        }
        //ムーブイベントにコールバック
        if (checkF == true) {
            this.removeEventListener("mousemove", mmovef, false);
            this.parentElement.addEventListener("mousemove", mmove, false);
            this.parentElement.addEventListener("touchmove", mmove, false);
            this.addEventListener("mouseup", mdup, false);
        }
    }

    //マウスカーソルが動いたときに発火
    function mmove(e: MouseEvent) {
        if(mdownF==false){
            return;
        }
        //同様にマウスとタッチの差異を吸収
        let event;
        if (e.type === "mousemove") {
             event = e;
        } else {
             event = e.changedTouches[0];
        }

        //フリックしたときに画面を動かさないようにデフォルト動作を抑制
        e.preventDefault();
        //マウスが動いた場所に要素を動かす
        const epx = event.pageX- targetEle.parentElement.offsetLeft;
        const epy = event.pageY- targetEle.parentElement.offsetTop;
        const newW = fW + epx - fx;
        const newH = fH + epy - fy;
        const newW2 = fW + fx - epx;
        const newH2 = fH + fy - epy;
        const minSize = 50;
        switch (mode) {
            case 'move':
                targetEle.style.top = (epy - y).px();
                targetEle.style.left = (epx - x).px();           
                break;
            case 'e-resize':
                if (newW > minSize) {
                    targetEle.style.width = newW.px();
                }
                break;
            case 'w-resize':
                if (newW2 > minSize) {
                    targetEle.style.left = (fLeft - (fx - epx)).px();
                    targetEle.style.width = newW2.px();
                }
                break;
            case 's-resize':
                if (newH > minSize) {
                    targetEle.style.height = newH.px();
                }
                break;
            case 'n-resize':
                if (newH2 > minSize) {
                    targetEle.style.top = (fTop - (fy - epy)).px();
                    targetEle.style.height = newH2.px();
                }
                break;
            case 'se-resize':
                if (newW > minSize) {
                    targetEle.style.width = newW.px();
                }
                if (newH > minSize) {
                    targetEle.style.height = newH.px();
                }
                break;
            case 'ne-resize':
                if (newW > minSize) {
                    targetEle.style.width = newW.px();
                }
                if (newH2 > minSize) {
                    targetEle.style.top = (fTop - (fy - epy)).px();
                    targetEle.style.height = newH2.px();
                }
                break;
            case 'sw-resize':
                if (newW2 > minSize) {
                    targetEle.style.left = (fLeft - (+fx - epx)).px();
                    targetEle.style.width = newW2.px();
                }
                if (newH > minSize) {
                    targetEle.style.height = newH.px();
                }
                break;
            case 'nw-resize':
                if (newW2 > minSize) {
                    targetEle.style.left = (fLeft - (+fx - epx)).px();
                    targetEle.style.width = newW2.px();
                }
                if (newH2 > minSize) {
                    targetEle.style.top = (fTop - (fy - epy)).px();
                    targetEle.style.height = newH2.px();
                }
                break;
        }
        if(mode!='move'){
            Generic.moveInnerElement(targetEle);
        }
        if (mode != 'move') {
            targetEle.maxSizeFlag = false;
            //リサイズ中に発生するコールバック
            if(typeof movingCall  === 'function'){
                movingCall(targetEle);
            }
        }
        targetEle.removeEventListener("mouseup", mdup, false);//移動した場合は同じ地点でマウスボタンが上がった場合の処理は行わない
        //マウスボタンが離されたとき、またはカーソルが外れたとき発火
        targetEle.addEventListener("mouseup", mup, false);
        targetEle.addEventListener("touchend", mup, false);
        targetEle.parentElement.addEventListener("touchleave", mup, false);
    }

    //同じ地点でマウスボタンが上がった場合の処理
    function mdup(e: MouseEvent) {
        this.style.cursor = 'default';
        this.addEventListener("mousemove", mmovef, false);
        targetEle.parentElement.removeEventListener("mousemove", mmove, false);
        targetEle.parentElement.removeEventListener("touchmove", mmove, false);
        mdownF=false;
    }

    //マウスボタンが上がったら発火
    function mup(e: MouseEvent) {
        if(mdownF==false){
            return;
        }

        this.style.cursor = 'default';
        this.addEventListener("mousemove", mmovef, false);
        //ムーブベントハンドラの消去
        this.parentElement.removeEventListener("mousemove", mmove, false);
        this.parentElement.removeEventListener("touchmove", mmove, false);
        targetEle.removeEventListener("mouseup", mup, false);
        targetEle.removeEventListener("touchend", mup, false);
        if (mode != 'move') {            
            if(typeof moveEndCall === 'function'){
                moveEndCall(targetEle);
            }
        }
        mdownF=false;
    }
}



//数値にpxをつける
// @ts-ignore
(Number.prototype as Record<string, any>)['px'] = function(): string {
    const v = this.toString();
    return v + "px";
};

/**NumberInputに値を設定する */
// @ts-ignore
(HTMLElement.prototype as Record<string, any>).setNumberValue = function (v: number){
    this.preValue=v;
    this.value=v;
}
//select要素の子要素を削除
// @ts-ignore
(HTMLElement.prototype as unknown)['removeAll'] = function (): void {
    while (this.lastChild) {
        this.removeChild(this.lastChild);
    }
}

/**select要素のoptionを入れ替える */
// @ts-ignore
(HTMLElement.prototype as unknown)['optionSwap'] = function(n1?: number, n2?: number): void {
    if (n1 === undefined || n2 === undefined) {
        return;
    }
    const opt1 = this.options[n1];
    const opt2 = this.options[n2];
    if (!opt1 || !opt2) {
        return;
    }
    const d = opt1.text;
    opt1.text = opt2.text;
    opt2.text = d;
    const v = opt1.value;
    opt1.value = opt2.value;
    opt2.value = v;
    const a = opt1.disabled;
    opt1.disabled = opt2.disabled;
    opt2.disabled = a;
}

//select要素の選択要素を一つ削除、選択位置を移動、削除したvalueを返す
HTMLElement.prototype.removeOne = function () {
    const mx=this.options.length;
    const fSel=parseInt(this.selectedIndex);
    if(fSel==-1){
        return undefined;
    }
    const v=this.options[fSel].value;
    let newSel=fSel;
    this.remove(fSel);
    if(mx==1){
        newSel=-1;
    }else{
        if(fSel==(mx-1)){
            newSel=fSel-1;
        }
    }
    this.selectedIndex=newSel;
    return v;
}

//select要素にリスト追加
HTMLElement.prototype.addSelectList = function (list: ListItem[], firstSelectIndex: number | undefined, resetF: boolean, astariskNonF: boolean,insertPoint: number | undefined=undefined) {
    if (resetF == true) {
        this.removeAll();
    }
    for (let j = 0; j < list.length; j++) {
        const opt = document.createElement("option");
        opt.value = list[j].value;
        opt.appendChild(document.createTextNode(list[j].text));
        if ((list[j].text.left(1) == "*") && (astariskNonF == true)) {
            opt.disabled = true;
        }
        if(insertPoint==undefined){
            this.appendChild(opt);
        }else{
            this.add(opt,insertPoint+j);
        }
    }
    if (firstSelectIndex != undefined) {
        this.selectedIndex = firstSelectIndex;
        this.oldSel=firstSelectIndex;
    }
}

//select要素の選択テキストを取得
HTMLElement.prototype.getText = function () {
    const n = this.selectedIndex;
    if (n == -1) {
        return undefined;
    }
    return this.options[n].text;
}

//select要素の選択valueを取得
HTMLElement.prototype.getValue = function () {
    const n = this.selectedIndex;
    if (n == -1) {
        return undefined;
    }
    let v=this.options[n].value;
    if (isNaN(v)==false){
        v=Number(v);
    }
    return v;
}

//select要素で指定した文字のテキストを選択
HTMLElement.prototype.setSelectText = function (txt: string) {
    const n = this.options.length;
    for (let i = 0; i < n; i++) {
        if (this.options[i].text == txt) {
            this.selectedIndex = i;
            return true;
            break;
        }
    }
    return false;
}

/**select要素の指定の位置のvalueとテキストを変更 */
HTMLElement.prototype.setSelectData=function(n: number,value: string | number,text: string){
    this.options[n].text=text;
    this.options[n].value=value;
}

//select要素で指定したvalueのテキストの先頭にアスタリスクを付ける、外す
HTMLElement.prototype.setAstarisk = function (value: string | number, astariskAddF: boolean) {
    const n = this.options.length;
    for (let i = 0; i < n; i++) {
        let v=this.options[i].value;
        if ((isNaN(v)==false)&&(isNaN(value)==false)){
            v=Number(v);
        }
        if (v == value) {
            let tx=this.options[i].text;
            if(astariskAddF==true){
                if(tx.left(1)!="*"){
                    tx="*"+tx;
                }
                this.options[i].disabled = true;
            }else{
                if(tx.left(1)=="*"){
                    tx=tx.mid(1,tx.length-1);
                }
                this.options[i].disabled = false;
            }
            this.options[i].text=tx;
            return;
        }
    }
}

//select要素で指定したvalueを選択
HTMLElement.prototype.setSelectValue= function (value: string | number) {
    const n = this.options.length;
    for (let i = 0; i < n; i++) {
        let v=this.options[i].value;
        if ((isNaN(v)==false)&&(isNaN(value)==false)){
            v=Number(v);
        }
        if (v == value) {
            this.selectedIndex = i;
            return true;
            break;
        }
    }
    return false;
}
//要素の表示状態を指定のものに設定
HTMLElement.prototype.setVisibility = function (visiflag: boolean) {
    if (visiflag == true) {
        this.style.display = "inline";
    } else {
        this.style.display = 'none';
    }
}
/**要素の表示状態を取得 */
HTMLElement.prototype.getVisibility = function () {
    if (this.style.display == "inline"){
        return true;
    } else {
        return false;
    }
}

/**ボタンの使用可／不可の切り替え */
// @ts-ignore
HTMLElement.prototype.btnDisabled = function (f) {
    this.disabled = f;
    if (f == true) {
        this.className = "btnDisable";
    } else {
        this.className = "";
    }
}

//文字からpxをとる
// @ts-ignore
(String.prototype as unknown)['removePx'] = function (): number {
    return parseInt(this.substr(0, this.length - 2))
}

//文字列繰り返し
// @ts-ignore
(String.prototype as unknown)['repeatString'] = function (num?: number): string {
    const repeatCount = num ?? 0;
    let str = "";
    for (; (this.length * repeatCount) > str.length; str += this);
    return str;
};

//文字列左から抜き出し
(String.prototype as unknown).left = function (num: number) {
    return this.substr(0, num);
};

//文字列右から抜き出し
(String.prototype as unknown).right = function (num: number) {
    return this.substr(this.length - num);
};
/**文字を途中から抜き出し lengthがundefinedの場合最後まで*/
(String.prototype as unknown).mid = function (start: number, length?: number){
    if(length==undefined){
        return this.slice(start);

    }else{
        return this.slice(start, start + length);
    }
}
/**文字列の指定位置に文字列を差し替え */
(String.prototype as unknown).midReplace = function (start: number, replaceString?: string): string {
    const rep = replaceString ?? "";
    const tx = this.substring(0, start ) + rep + this.substring(start + rep.length);
   return tx;
}

//文字列全置換
(String.prototype as unknown).replaceAll = function (org: string, dest?: string): string {
    return this.split(org).join(dest);
}

// Number型の拡張: px()メソッド
(Number.prototype as unknown).px = function() {
    return this.toString() + "px";
};

// String型の拡張: right()メソッド  
(String.prototype as unknown).right = function(length: number) {
    if (length >= this.length) {
        return this;
    }
    return this.substring(this.length - length);
};

// String型の拡張: removePx()メソッド
(String.prototype as unknown).removePx = function() {
    return parseFloat(this.replace("px", "")) || 0;
};

// expose helpers globally for legacy callers
(globalThis as Record<string, unknown>).CheckedListBox = CheckedListBox;
(globalThis as Record<string, unknown>).ListBox = ListBox;
(globalThis as Record<string, unknown>).ListViewTable = ListViewTable;

// latlon class for latitude/longitude coordinates
class latlon {
    lat: number;
    lon: number;
    
    constructor(lat: number = 0, lon: number = 0) {
        this.lat = lat;
        this.lon = lon;
    }
    
    Clone(): latlon {
        return new latlon(this.lat, this.lon);
    }
    
    toDegreeMinuteSecond(): {lat: string; lon: string} {
        const latDeg = Math.floor(Math.abs(this.lat));
        const latMin = Math.floor((Math.abs(this.lat) - latDeg) * 60);
        const latSec = ((Math.abs(this.lat) - latDeg) * 60 - latMin) * 60;
        const latDir = this.lat >= 0 ? 'N' : 'S';
        
        const lonDeg = Math.floor(Math.abs(this.lon));
        const lonMin = Math.floor((Math.abs(this.lon) - lonDeg) * 60);
        const lonSec = ((Math.abs(this.lon) - lonDeg) * 60 - lonMin) * 60;
        const lonDir = this.lon >= 0 ? 'E' : 'W';
        
        return {
            lat: `${latDeg}°${latMin}'${latSec.toFixed(2)}"${latDir}`,
            lon: `${lonDeg}°${lonMin}'${lonSec.toFixed(2)}"${lonDir}`
        };
    }
    
    toLatlon(): latlon {
        return this;
    }
}

(globalThis as Record<string, unknown>).latlon = latlon;

