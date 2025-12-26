// JavaScript source code

export class clsAccessory {

    /**線種の凡例 */
    static Draw_LineKind(g: CanvasRenderingContext2D, ALP: point, HeadBoxSize?: size, SizeGetOnlyF?: boolean){

        const av = state.attrData.TotalData.ViewStyle;
        const LFont  = av.MapLegend.Base.Font;
        const LPC = state.attrData.Get_AllMapLineKind();
        const LineKind_Used = state.attrData.Get_LineKindUsedList();
        let Use_Line_Number=[]; 
        for(let i  = 0 ;i< LPC.length ;i++){
            if((LineKind_Used[i] == true)&&(av.MapLegend.Line_DummyKind.Line_Visible_Number_STR.mid(i, 1) == "1" )){
                Use_Line_Number.push(i);
            }
        }
        const n=Use_Line_Number.length;
        const UH  = state.attrData.Get_Length_On_Screen(LFont.Size);
        g.font = LFont.toContextFont(av.ScrData).font;
        
        let Xsize  = 0;
        for(let i  = 0 ;i< n ;i++){
            Xsize = Math.max(Xsize, g.measureText(LPC[Use_Line_Number[i]].Name).width);
        }
        Xsize += state.attrData.Radius(16, 1, 1);
        const Ysize  = UH * n;

        HeadBoxSize.width = Xsize;
        HeadBoxSize.height = Ysize;

        let C_Rect  = new rectangle(ALP, HeadBoxSize);
        if(SizeGetOnlyF == true ){
            return false;
        }
        if(state.attrData.Check_Screen_In(C_Rect) == false ){
            return false;
        }else{
            state.attrData.Draw_Tile_RoundBox(g, C_Rect, av.MapLegend.Line_DummyKind.Back, 0);

            for(let i  = 0 ;i< n ;i++){
                const lk= LPC[Use_Line_Number[i]];
                    const Y  = C_Rect.top + i * UH
                    const x3  = C_Rect.left + state.attrData.Radius(16, 1, 1)
                    switch( av.MapLegend.Line_DummyKind.Line_Pattern){
                        case enmCircleMDLegendLine.Zigzag:{
                            let pxy=[];
                            for(let j  = 0 ; j<=3;j++){
                                pxy.push(new point(C_Rect.left + state.attrData.Radius(4.5, 1, 1) * j, Y + UH / 4 + UH / 2 * (j % 2)));
                            }
                            state.attrData.Draw_Line(g, lk.Pat,  pxy);
                            break;
                        }
                        case enmCircleMDLegendLine.Straight:
                            state.attrData.Draw_Line(g, lk.Pat, new point(C_Rect.left, Y + UH / 2), new point(C_Rect.left + state.attrData.Radius(4.5, 1, 1) * 3, Y + UH / 2));
                            break;
                        }
                    state.attrData.Draw_Print(g, lk.Name, new point(x3, Y), LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
            }
        }
    }

    /**点オブジェクトの凡例 */
    static Draw_PointObject(g: CanvasRenderingContext2D, ALP: point, HeadBoxSize: size, SizeGetOnlyF: boolean) {

        const av = state.attrData.TotalData.ViewStyle;

        const LFont = av.MapLegend.Base.Font;
        const UH = state.attrData.Get_Length_On_Screen(LFont.Body.Size);
        g.font = LFont.toContextFont(av.ScrData).font;
        let mxw1 = 0;
        let mxw2 = 0;
        let Ys = 0;
        for (let i in state.attrData.TempData.PointObjectKindUsedStack) {
            let pok = state.attrData.TempData.PointObjectKindUsedStack[i];
            let w1 = state.attrData.Radius(pok.Mark.WordFont.Size, 1, 1) * 3;
            mxw1 = Math.max(mxw1, w1);
            mxw2 = Math.max(mxw2, g.measureText(pok.ObjectKindName).width);
            Ys += Math.max(UH, w1);
        }

        mxw1 += state.attrData.Radius(2, 1, 1);

        HeadBoxSize.width = mxw1 + mxw2;
        HeadBoxSize.height = Ys;
        if (SizeGetOnlyF == true) {
            return false;
        }
        let C_Rect = new rectangle(ALP, HeadBoxSize);
        if (state.attrData.Check_Screen_In(C_Rect) == false) {
            return false;
        }
        state.attrData.Draw_Tile_RoundBox(g, C_Rect, av.MapLegend.Line_DummyKind.Back, 0);
        Ys = 0;
        for (let i in state.attrData.TempData.PointObjectKindUsedStack) {
            const pok = state.attrData.TempData.PointObjectKindUsedStack[i];
            const r = state.attrData.Radius(pok.Mark.WordFont.Size, 1, 1) * 3;
            const s = Math.max(r, UH);
            mxw2 = Math.max(mxw2, g.measureText(pok.ObjectKindName).width);
            state.attrData.Draw_Mark(g, new point(ALP.x + mxw1 / 2, ALP.y + Ys + s / 2), state.attrData.Radius(pok.Mark.WordFont.Size, 1, 1), pok.Mark);
            state.attrData.Draw_Print(g, pok.ObjectKindName, new point(ALP.x + mxw1, ALP.y + Ys + s / 2), LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Center);
            Ys += s;
        }
    }

    /** 飾りグループボックス表示*/
    static AccGroupBoxDraw(g: CanvasRenderingContext2D){

        const Agb = state.attrData.TotalData.ViewStyle.AccessoryGroupBox;
        if (Agb.Visible == true) {
            clsDrawTile.Draw_Tile_RoundBox?.(g, state.attrData.TempData.Accessory_Temp.GroupBox_Rect, Agb.Back, 0, state.attrData.TotalData.ViewStyle.ScrData);
        }
    }
    /**経緯線表示 */
    static LatLonLine_Print(g: CanvasRenderingContext2D) {


        let av = state.attrData.TotalData.ViewStyle;
        if (av.ScrData.ThreeDMode.Set3D_F == true) {
            return;
        }
        let MapIdoKedoRect = state.attrData.TempData.MapAreaLatLon;
        let iiv = av.LatLonLine_Print.Lat_Interval;
        let s1 = Math.floor(MapIdoKedoRect.top / iiv) ;
        let Start_Ido = iiv * s1;
        let End_Ido = iiv * Math.floor(MapIdoKedoRect.bottom / iiv) + iiv;
        let mer85f = false;
        if (av.Zahyo.Projection == enmProjection_Info.prjMercator) {
            if (End_Ido > 85) {
                End_Ido = 85;
                mer85f = true;
            }
            if (Start_Ido < -85) {
                Start_Ido = MapIdoKedoRect.top;
            }
        }

        let ikv = av.LatLonLine_Print.Lon_Interval;
        let s2;
        if (ikv > 2) {
            if (MapIdoKedoRect.left > 0) {
                s2 = Math.floor(MapIdoKedoRect.left / ikv);
            } else {
                s2 = Math.round((MapIdoKedoRect.left) / ikv);
            }
        } else {
            s2 = (MapIdoKedoRect.left > 0) ? Math.floor(MapIdoKedoRect.left / ikv) : Math.ceil(MapIdoKedoRect.left / ikv); 
        }

        let Start_Kedo = ikv * s2;
        let End_kedo;
        if (ikv > 2) {
            End_kedo = Math.round(MapIdoKedoRect.right / ikv) * ikv;
        } else {
            End_kedo = Math.ceil(MapIdoKedoRect.right / ikv) * ikv + ikv;
        }


        let idon = 0;
        let Idock;
        do {
            Idock = Start_Ido + idon * iiv;
            idon++;
        } while (Idock < End_Ido);
        if (mer85f == false) {
            if (Idock != End_Ido) {
                if (Idock - End_Ido > iiv / 2) {
                    idon--;
                    End_Ido = Start_Ido + (idon - 1) * iiv;
                } else {
                    End_Ido = Idock;
                }
            }
        }
        for (let i = 0; i < idon; i++) {
            let Ido = Start_Ido + i * iiv;
            switch (av.Zahyo.Projection) {
                case enmProjection_Info.prjSanson:
                case enmProjection_Info.prjSeikyoEntou:
                case enmProjection_Info.prjMercator:
                case enmProjection_Info.prjMiller:
                case enmProjection_Info.prjLambertSeisekiEntou:
                case enmProjection_Info.prjMollweide:
                case enmProjection_Info.prjEckert4: {
                    let P1 = spatial.Get_Converted_XY(new point(Start_Kedo, Ido), av.Zahyo);
                    let P2 = spatial.Get_Converted_XY(new point(End_kedo, Ido), av.Zahyo);
                    let PC1 = av.ScrData.getSxSy(P1);
                    let PC2 = av.ScrData.getSxSy(P2);
                    let lpt = av.LatLonLine_Print.LPat
                    if ((i == 0) || (i == idon - 1)) {
                        if ((Ido == End_Ido) || (i == 0)) {
                            lpt = av.LatLonLine_Print.OuterPat;
                        }
                    }
                    if (Ido == 0) {
                        lpt = av.LatLonLine_Print.Equator;
                    }
                    clsDrawLine.Line?.(g, lpt, PC1, PC2, av.ScrData);
                    break;
                }
            }
        }
        if (av.Zahyo.Projection == enmProjection_Info.prjMercator) {
            if (End_Ido == 85) {
                let P1 = spatial.Get_Converted_XY(new point(Start_Kedo, End_Ido), av.Zahyo);
                let P2 = spatial.Get_Converted_XY(new point(End_kedo, End_Ido), av.Zahyo);
                let PC1 = av.ScrData.getSxSy(P1);
                let PC2 = av.ScrData.getSxSy(P2);
                clsDrawLine.Line?.(g, av.LatLonLine_Print.OuterPat, PC1, PC2, av.ScrData);
            }
        }

        let kedon = 0;
        let Kedock;
        do {
            Kedock = Start_Kedo + kedon * ikv;
            kedon++;
        } while (Kedock < End_kedo);
        if (Kedock != End_kedo) {
            if (Kedock - End_kedo > ikv / 2) {
                kedon--;
                End_kedo = Start_Kedo + (kedon - 1) * ikv;
            } else {
                End_kedo = Kedock;
            }
        }
        for (let i = 0; i < kedon; i++) {
            let Kedo = Start_Kedo + i * ikv;
            let lpt = av.LatLonLine_Print.LPat;
            if ((i == 0) || (i == kedon - 1)) {
                lpt = av.LatLonLine_Print.OuterPat;
            }

            switch (av.Zahyo.Projection) {
                case enmProjection_Info.prjSanson:
                case enmProjection_Info.prjMollweide:
                case enmProjection_Info.prjEckert4: {
                    let P1 = spatial.Get_Converted_XY(new point(Kedo, End_Ido), av.Zahyo);
                    let P2 = spatial.Get_Converted_XY(new point(Kedo, Start_Ido), av.Zahyo);
                    let PC1 = av.ScrData.getSxSy(P1);
                    let PC2 = av.ScrData.getSxSy(P2);
                    if ((PC1.x == PC2.x) && (End_Ido * Start_Ido >= 0)) {
                        clsDrawLine.Line?.(g, av.LatLonLine_Print.LPat, PC1, PC2, av.ScrData);
                    } else if (End_Ido * Start_Ido >= 0) {
                        //赤道を挟まない場合
                        let w = Math.abs(PC2.x - PC1.x);
                        let H = End_Ido - Start_Ido;
                        let pxy = [];
                        for (let j = 0; j <= w; j++) {
                            let PP1 = spatial.Get_Converted_XY(new point(Kedo, Start_Ido + H * (j / w)), av.Zahyo);
                            pxy.push(av.ScrData.getSxSy(PP1));
                        }
                        clsDrawLine.Line?.(g, lpt, pxy, av.ScrData, false);
                    } else {
                        //赤道を挟む場合
                        let P3 = spatial.Get_Converted_XY(new point(Kedo, 0), av.Zahyo);
                        let PC3 = av.ScrData.getSxSy(P3);
                        let w = Math.abs(PC1.x - PC3.x);
                        let w2 = Math.abs(PC2.x - PC3.x);
                        if (w + w2 == 0) {
                            clsDrawLine.Line?.(g, lpt, [PC1, PC2], av.ScrData);
                        } else {
                            let H = Math.abs(Start_Ido) + End_Ido
                            let pxy = [];
                            for (let j = 0; j <= w + w2; j++) {
                                let PP1 = spatial.Get_Converted_XY(new point(Kedo, Start_Ido + H * (j / (w + w2))), av.Zahyo);
                                pxy.push(av.ScrData.getSxSy(PP1));
                            }
                            clsDrawLine.Line?.(g, lpt, pxy, av.ScrData, null);
                        }
                    }
                    break;
                }
                case enmProjection_Info.prjSeikyoEntou:
                case enmProjection_Info.prjMercator:
                case enmProjection_Info.prjMiller:
                case enmProjection_Info.prjLambertSeisekiEntou: {
                    let PC1;
                    let PC2;
                    if (av.Zahyo.Projection == enmProjection_Info.prjMercator) {
                        let P1 = spatial.Get_Converted_XY(new point(Kedo, End_Ido), av.Zahyo);
                        let P2 = spatial.Get_Converted_XY(new point(Kedo, Start_Ido), av.Zahyo);
                        PC1 = av.ScrData.getSxSy(P1);
                        PC2 = av.ScrData.getSxSy(P2);
                    } else {
                        let P1 = spatial.Get_Converted_XY(new point(Kedo, End_Ido), av.Zahyo);
                        let P2 = spatial.Get_Converted_XY(new point(Kedo, Start_Ido), av.Zahyo);
                        PC1 = av.ScrData.getSxSy(P1);
                        PC2 = av.ScrData.getSxSy(P2);
                    }
                    clsDrawLine.Line?.(g, lpt, PC1, PC2, av.ScrData);
                    break;
                }
            }
        }
    }


    static Legend_print(g: CanvasRenderingContext2D, Legend_No: number, SizeGetOnlyF: boolean) {

        let LegendW = state.attrData.TempData.Accessory_Temp.MapLegend_W[Legend_No];
        let vs = state.attrData.TotalData.ViewStyle;
        if ((vs.MapLegend.Base.Visible == false) && (
            LegendW.LineKind_Flag == false) && (LegendW.PointObject_Flag == false)) {
            return;
        }
        let ALP;
        let P_Legend = vs.MapLegend;
        if (vs.ScrData.Accessory_Base == enmBasePosition.Screen) {
            let p = P_Legend.Base.LegendXY[Legend_No];
            ALP = vs.ScrData.getSxSy(vs.ScrData.getSRXYfromRatio(p));
        } else {
            let p = P_Legend.Base.LegendXY[Legend_No];
            ALP = vs.ScrData.getSxSy(p);
        }
        let LFont = P_Legend.Base.Font;

        let BoxSize= new size(0, 0);
        let TX = "";
        let screen_in;
        if (LegendW.LineKind_Flag == true) {
            //ライン線種の凡例
            TX = ""
            screen_in = this.Draw_LineKind(g, ALP, BoxSize, SizeGetOnlyF);
        } else {
            if (LegendW.PointObject_Flag == true) {
                //ダミーオブジェクトの凡例
                TX = ""
                screen_in = this.Draw_PointObject(g, ALP, BoxSize, SizeGetOnlyF);
            } else {
                let Layn2 = LegendW.Layn;
                switch (LegendW.Print_Mode_Layer) {
                    case enmLayerMode_Number.LabelMode:   //ラベルは凡例無し
                        break;
                    case enmLayerMode_Number.GraphMode:
                        BoxSize = new size(0, 0);
                        switch (LegendW.GraphMode) {
                            case enmGraphMode.PieGraph:
                            case enmGraphMode.StackedBarGraph:
                                screen_in = this.Draw_Multi_Engraph(g, ALP, BoxSize, Layn2, LegendW.DatN, SizeGetOnlyF);
                                break;
                            case enmGraphMode.LineGraph:
                            case enmGraphMode.BarGraph:
                                screen_in = this.Draw_Multi_Oresen(g, ALP, BoxSize, Layn2, LegendW.DatN, SizeGetOnlyF);
                                break;
                        }
                        break;
                    case enmLayerMode_Number.SoloMode:{
                        let datn2 = LegendW.DatN;
                        let UTX = state.attrData.Get_DataUnit_With_Kakko(Layn2, datn2);
                        BoxSize = new size(0, 0);
                        if (P_Legend.OverLay_Legend_Title.Print_f == true) {
                            TX = LegendW.title;
                            if (TX != "") {
                                let mx_w = state.attrData.Get_Length_On_Screen(P_Legend.OverLay_Legend_Title.MaxWidth);
                                let Out_Title = clsDraw.TextCut_for_print(g, TX, LFont, true, mx_w, vs.ScrData);
                                let t_Line_n = Out_Title.Out_Text.length;
                                let Tx_H = Out_Title.Height;
                                let TX2 = "";
                                BoxSize.width = 0;
                                let thdata = LFont.toContextFont(vs.ScrData);
                                g.font = thdata.font;
                                for (let i = 0; i < t_Line_n; i++) {
                                    BoxSize.width = Math.max(BoxSize.width, g.measureText(Out_Title.Out_Text[i]).width);
                                    TX2 += Out_Title.Out_Text[i];
                                    if (i != t_Line_n - 1) {
                                        TX2 += chrLF;
                                    }
                                }
                                BoxSize.height = Tx_H * (t_Line_n + 0.5);
                                TX = TX2;
                            }
                        }

                        switch (LegendW.SoloMode) {
                            case enmSoloMode_Number.ClassPaintMode:
                                if (state.attrData.LayerData[Layn2].Shape != enmShape.LineShape) {
                                    screen_in = this.Draw_ClassPaintHatchMode(g, ALP, BoxSize, UTX, Layn2, datn2, SizeGetOnlyF);
                                } else {
                                    screen_in = this.Draw_ClassPaint_LineShape(g, ALP, BoxSize, UTX, Layn2, datn2, SizeGetOnlyF);
                                }
                                break;
                            case enmSoloMode_Number.MarkSizeMode:
                                screen_in = this.Draw_MarkSizeMode(g, ALP, BoxSize, UTX, Layn2, datn2, SizeGetOnlyF);
                                break;
                            case enmSoloMode_Number.MarkBlockMode:
                                screen_in = this.Draw_MarkBlockMode(g, ALP, BoxSize, UTX, Layn2, datn2, SizeGetOnlyF);
                                break;
                            case enmSoloMode_Number.MarkBarMode:
                                screen_in = this.Draw_MarkBarMode(g, ALP, BoxSize, UTX, Layn2, datn2, SizeGetOnlyF);
                                break;
                            case enmSoloMode_Number.StringMode:
                                screen_in = this.Draw_StringMode(g, ALP, BoxSize, UTX, Layn2, datn2, SizeGetOnlyF);
                                break;
                            case enmSoloMode_Number.ContourMode:
                                let PushMisF = vs.Missing_Data.Print_Flag;
                                //等値線モードの場合は欠損値の凡例を表示しない
                                vs.Missing_Data.Print_Flag = false;
                                switch (state.attrData.LayerData[Layn2].atrData.Data[datn2].SoloModeViewSettings.ContourMD.Interval_Mode) {
                                    case enmContourIntervalMode.ClassPaint:
                                        screen_in = this.Draw_ClassPaintHatchMode(g, ALP, BoxSize, UTX, Layn2, datn2, SizeGetOnlyF);
                                        break;
                                }
                                vs.Missing_Data.Print_Flag = PushMisF;
                                break;
                            case enmSoloMode_Number.ClassMarkMode:
                                screen_in = this.Draw_ClassMarkMode(g, ALP, BoxSize, UTX, Layn2, datn2, SizeGetOnlyF);
                                break;
                            case enmSoloMode_Number.ClassODMode:
                                screen_in = this.Draw_ClassODModeMode(g, ALP, BoxSize, UTX, Layn2, datn2, SizeGetOnlyF);
                                break;
                            case enmSoloMode_Number.MarkTurnMode:
                                //記号の回転は凡例無し
                                break;
                        }
                        break;
                    }
                }
            }
        }
        if (SizeGetOnlyF == true) {
            LegendW.Rect = new rectangle(ALP, BoxSize);
            let padw = state.attrData.Get_PaddingPixcel((LegendW.LineKind_Flag == true) ? state.attrData.TotalData.ViewStyle.MapLegend.Line_DummyKind.Back : state.attrData.TotalData.ViewStyle.MapLegend.Base.Back);
            LegendW.Rect.inflate(padw, padw);
            return;
        }
        if ((TX != "") && (screen_in == true)) {
            state.attrData.Draw_Print(g, TX, ALP, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
        }
        vs.MapLegend = P_Legend;//必要？
    }

    //注記表示
    static Note_Print(g: CanvasRenderingContext2D) {

        if (state.attrData.TotalData.ViewStyle.DataNote.Visible == false) {
            return;
        }
        let NT = this.getPrintNote(g);
        state.attrData.Draw_Print(g, NT.note, NT.rect.topLeft(), state.attrData.TotalData.ViewStyle.DataNote.Font, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
    }
    static getPrintNote(g: CanvasRenderingContext2D) {

        let nt="";
        let Layernum = state.attrData.TotalData.LV1.SelectedLayer;
        switch (state.attrData.TotalData.LV1.Print_Mode_Total) {
            case (enmTotalMode_Number.DataViewMode): {
                let al = state.attrData.LayerData[Layernum];
                switch (al.Print_Mode_Layer) {
                    case (enmLayerMode_Number.SoloMode): {
                        let DataNum = al.atrData.SelectedIndex;
                        nt = al.atrData.Data[DataNum].Note;
                        break;
                    }
                    case (enmLayerMode_Number.GraphMode): {
                        let gm = al.LayerModeViewSettings.GraphMode;
                        let n = gm.DataSet[gm.SelectedIndex].length;
                        if (n > 0) {
                            let NoteD = [];
                            for (let i = 0; i < n; i++) {
                                let txObj = state.attrData.Get_DataNote(Layernum, gm.DataSet[gm.SelectedIndex].Data[i].DataNumber);
                                let tx = txObj.note;
                                if (tx != "") {
                                    NoteD.push(tx);
                                }
                            }
                            if (NoteD.length != 0) {
                                let NoteD2 = Generic.Remove_Same_String(NoteD);
                                nt = NoteD2.join(chrLF);
                            }
                        }
                        break;
                    }
                    case (enmLayerMode_Number.LabelMode): {
                        let lm = al.LayerModeViewSettings.LabelMode;
                        let n = lm.DataSet[lm.SelectedIndex].length;
                        if (n > 0) {
                            let NoteD = [];
                            for (let i = 0; i < n; i++) {
                                let txObj = state.attrData.Get_DataNote(Layernum, lm.DataSet[lm.SelectedIndex].Data[i].DataNumber);
                                let tx = txObj.note;
                                if (tx != "") {
                                    NoteD.push(tx);
                                }
                            }
                            if (NoteD.length != 0) {
                                let NoteD2 = Generic.Remove_Same_String(NoteD);
                                nt = NoteD2.join('\n');
                            }
                        }
                        break;
                    }
                }
                break;
            }
            case (enmTotalMode_Number.OverLayMode): {
                let ov = state.attrData.TotalData.TotalMode.OverLay;
                nt = ov.DataSet[ov.SelectedIndex].Note;
                break;
            }
            case (enmTotalMode_Number.SeriesMode): {
                nt = state.attrData.TempData.Series_temp.title;
                break;
            }
        }
        if (nt == "") {
            return { note:"",rect:new rectangle(0,0,0,0)}
        }
        let P_Note= state.attrData.TotalData.ViewStyle.DataNote.Clone();
        let vs = state.attrData.TotalData.ViewStyle;
        if (vs.ScrData.Accessory_Base == enmBasePosition.Screen) {
            P_Note.Position = vs.ScrData.getSRXYfromRatio(P_Note.Position);
        }
        let atx = nt;
        let xw = state.attrData.Get_Length_On_Screen(P_Note.MaxWidth);

        let txp = clsDraw.TextCut_for_print(g, atx, P_Note.Font, true, xw, vs.ScrData);
        let d_an2 = txp.Out_Text;
        let yw = txp.Height;
        let RealW = txp.RealWidth;
        let outTx =  d_an2[0];
        for (let i = 1; i < d_an2.length; i++) {
            outTx += chrLF + d_an2[i];
        }
        yw *= d_an2.length;
        let tP = state.attrData.TotalData.ViewStyle.ScrData.getSxSy(P_Note.Position);
        let Rect = new rectangle(new point(tP.x - RealW / 2, tP.y - yw / 2), new size(RealW, yw));
        return {
            note: outTx, rect: Rect
        }
    }

    /**円グラフで、凡例の表示方法が円一つの場合で円グラフの周囲にデータ項目名を並べる場合の凡例 */
    static Draw_Multi_Engraph_Pattern1(g: CanvasRenderingContext2D, ALP: point, HeadBoxSize: size, Layn2: number, DataSet_Num: number, SizeGetOnlyF: boolean) {

        let vs = state.attrData.TotalData.ViewStyle;
        let LFont = vs.MapLegend.Base.Font;
        let TH = state.attrData.Get_Length_On_Screen(LFont.Size);
        g.font = LFont.toContextFont(vs.ScrData).font;

        let EN_TP = clsBase.Tile();

        let gData = state.attrData.LayerData[Layn2].LayerModeViewSettings.GraphMode.DataSet[DataSet_Num];
        let UnitTx = state.attrData.Get_DataUnit_With_Kakko(Layn2, gData.Data[0].DataNumber);
        let n = gData.Data.length;
        let size2 = HeadBoxSize;
        let Value = [gData.En_Obi.Value1, gData.En_Obi.Value2, gData.En_Obi.Value3];
        let rmaxw;
        if (gData.En_Obi.EnSizeMode == enmGraphMaxSize.Changeable) {
            //サイズ可変型の場合
            rmaxw = state.attrData.Radius(gData.En_Obi.EnSize, Value[0], gData.En_Obi.MaxValue);
        } else {
            rmaxw = state.attrData.Get_Length_On_Screen(gData.En_Obi.EnSize / 2);
        }

        let Xsmin = -rmaxw;
        let Xsmax = rmaxw;
        let Ysmin = -rmaxw;
        let Ysmax = rmaxw;

        let UnderW = 0;
        let UnderH = 0;
        let xposi = [];// enmHorizontalAlignment
        let yposi = [];// enmVerticalAlignment
        let WordP = [];
        //rep=0の時は大きさを計算、rep1で実際の描画
        for (let rep = 0; rep <= 1; rep++) {
            size2 = HeadBoxSize.Clone();
            if (gData.En_Obi.EnSizeMode == enmGraphMaxSize.Changeable) {
                let p = ALP.Clone();
                p.offset(UnderW / 2 - rmaxw, 0);
                size2=this.OverCircle_Print(g, p, gData.En_Obi.MaxValue, Value, UnitTx, gData.En_Obi.EnSize, gData.En_Obi.BoaderLine, EN_TP,  (rep == 1));
            }

            if (rep == 0) {
                for (let i = 0; i < n; i++) {
                    let a = gData.Data[i].DataNumber;
                    let CeR = Math.PI * 2 * ((i + 0.5) / n);
                    let p = new point(Math.sin(CeR) * rmaxw * 1.3, Math.cos(CeR) * rmaxw * 1.3);
                    let w = g.measureText(state.attrData.Get_DataTitle(Layn2, a, false)).width;
                    let n2 = (i + 0.5) / n;
                    if (n2 < 0.5) {
                        xposi[i] = enmHorizontalAlignment.Left;
                        Xsmax = Math.max(Xsmax, p.x + w);
                    } else if (n2 == 0.5) {
                        Xsmax = Math.max(Xsmax, p.x + w / 2);
                        Xsmin = Math.min(Xsmin, p.x - w / 2);
                        xposi[i] = enmHorizontalAlignment.Center;
                    } else {
                        Xsmin = Math.min(Xsmin, p.x - w);
                        xposi[i] = enmHorizontalAlignment.Right;
                    }
                    if ((n2 < 0.25) || (n2 > 0.75)) {
                        Ysmin = Math.min(Ysmin, -p.y - TH);
                        yposi[i] = enmVerticalAlignment.Bottom;
                    } else if ((n2 = 0.25) || (n2 = 0.75)) {
                        Ysmax = Math.max(Ysmax, -p.y + TH);
                        yposi[i] = enmVerticalAlignment.Center;
                    } else {
                        Ysmax = Math.max(Ysmax, -p.y + TH);
                        yposi[i] = enmVerticalAlignment.Top;
                    }
                    WordP[i] = new point(p.x, -p.y);
                }
                UnderW = Xsmax - Xsmin;
                UnderH = Ysmax - Ysmin;
            } else {
                for (let i = 0; i < n; i++) {
                    let sr = Math.PI * 2 * (i / n);
                    let Er = Math.PI * 2 * ((i + 1) / n);
                    let a = gData.Data[i].DataNumber;
                    let fp = ALP.Clone();
                    fp.offset(-Xsmin, size2.height + TH / 2 + UnderH / 2);
                    state.attrData.Draw_Fan(g, fp, rmaxw, sr, Er, gData.En_Obi.BoaderLine, gData.Data[i].Tile);
                    let p = WordP[i].Clone();
                    p.offset(ALP.x - Xsmin, ALP.y + size2.height + TH / 2 + UnderH / 2);
                    state.attrData.Draw_Print(g, state.attrData.Get_DataTitle(Layn2, a, false), p, LFont, xposi[i], yposi[i]);
                }
            }
            size2.height += UnderH + TH;
            size2.width = Math.max(size2.width, UnderW);
            size2.width *= 1.1;

            if (SizeGetOnlyF == true) {
                HeadBoxSize.width = size2.width;
                HeadBoxSize.height = size2.height;
                return false;
            }

            let C_Rect = new rectangle(ALP, size2);
            if (state.attrData.Check_Screen_In(C_Rect) == false) {
                return false;
            }

            if (rep == 0) {
                this.LegendBoxBack(g,  C_Rect);
            } else {
                HeadBoxSize.width = size2.width;
                HeadBoxSize.height = size2.height;
            }
        }
        return true
    }


    /**グラフ表示モードの円・帯グラフ */
    static Draw_Multi_Engraph(g: CanvasRenderingContext2D, ALP: point, HeadBoxSize: size, Layn2: number, DataSet_Num: number, SizeGetOnlyF: boolean) {

        let vs = state.attrData.TotalData.ViewStyle;
        let LFont = vs.MapLegend.Base.Font;
        let TH = state.attrData.Get_Length_On_Screen(LFont.Size);
        g.font = LFont.toContextFont(vs.ScrData).font;

        if (vs.MapLegend.Base.Visible == false) {
            return false;
        }

        if ((state.attrData.LayerData[Layn2].LayerModeViewSettings.GraphMode.DataSet[DataSet_Num].GraphMode == enmGraphMode.PieGraph) && (
            vs.MapLegend.En_Graph_Pattern == enmMultiEnGraphPattern.oneCircle)) {
            //円グラフで、凡例の表示方法が円一つの場合
            return this.Draw_Multi_Engraph_Pattern1(g, ALP, HeadBoxSize, Layn2, DataSet_Num, SizeGetOnlyF);
        }

        let TilePat = clsBase.Tile();
        TilePat.Color = new colorRGBA(210, 210, 210, 255);

        let gData = state.attrData.LayerData[Layn2].LayerModeViewSettings.GraphMode.DataSet[DataSet_Num];

        let UnitTx = state.attrData.Get_DataUnit_With_Kakko(Layn2, gData.Data[0].DataNumber);
        let n = gData.Data.length;
        let Value = [gData.En_Obi.Value1, gData.En_Obi.Value2, gData.En_Obi.Value3];
        Value.sort(function (a, b) { return b - a; });
        let LegendVn = 0;
        for (let i = 0;i< Value.length; i++) {
            if (Value[i] <= 0) {
                break;
            } else {
                LegendVn++;
            }
        }
        //rep=0の時は大きさを計算、rep1で実際の描画
        for (let rep = 0; rep <= 1; rep++) {
            let size2 = HeadBoxSize.Clone();
            if (gData.En_Obi.EnSizeMode == enmGraphMaxSize.Changeable) {
                //サイズ可変型の場合
                switch (state.attrData.LayerData[Layn2].LayerModeViewSettings.GraphMode.DataSet[DataSet_Num].GraphMode) {
                    case enmGraphMode.PieGraph: {
                        let EN_TP = clsBase.Tile();
                        EN_TP.Color = clsBase.ColorWhite();
                        size2=this.OverCircle_Print(g, ALP, gData.En_Obi.MaxValue, Value, UnitTx, gData.En_Obi.EnSize, gData.En_Obi.BoaderLine, EN_TP,  (rep == 1));
                        break;
                    }
                    case enmGraphMode.StackedBarGraph: {
                        let ysize2 = HeadBoxSize.height;
                        let r1 = state.attrData.Get_Length_On_Screen(gData.En_Obi.EnSize);
                        let y3 = HeadBoxSize.height + r1 + TH / 2;
                        for (let i = 0; i < LegendVn; i++) {
                            let V = Value[i];
                            let r = state.attrData.Radius(gData.En_Obi.EnSize, V, gData.En_Obi.MaxValue) * 2;
                            let r2 = r * gData.En_Obi.AspectRatio;
                            if (gData.En_Obi.StackedBarDirection == enmStackedBarChart_Direction.Horizontal) {
                                if (rep == 1) {
                                    state.attrData.Draw_Tile_Box(g, new rectangle(new point(ALP.x, ALP.y + ysize2), new size(r + 1, r2 + 1)), gData.En_Obi.BoaderLine, TilePat, 0);
                                }
                                ysize2 += r2 * 1.1;
                                let VL = this.UNIT_P(g, new point(ALP.x + TH / 2, ALP.y + ysize2), V, UnitTx, i, (rep == 1));
                                ysize2 += TH * 1.5;
                                size2.width = Math.max(size2.width, TH / 2 + VL);
                            } else {
                                let tateObiXY=new point(ALP.x + r1 * gData.En_Obi.AspectRatio,ALP.y + TH / 2 + r1 - r);
                                let tateObiMojiXY=new point( ALP.x + r1 * gData.En_Obi.AspectRatio + TH * 1.5,tateObiXY.y);
                                let VL;
                                let rect = new rectangle(new point(tateObiXY.x - r2 - 1, tateObiXY.y), new size(r2 + 1, r - 1));
                                state.attrData.Draw_Tile_Box(g, rect, gData.En_Obi.BoaderLine, TilePat, 0);
                                if (tateObiXY.y >= ALP.y + TH * i + TH / 2) {
                                    VL = this.UNIT_P(g, new point(tateObiMojiXY.x, tateObiMojiXY.y - TH / 2), V, UnitTx, i, (rep == 1));
                                    if (rep == 1) {
                                        state.attrData.Draw_Line(g, state.attrData.TotalData.ViewStyle.MapLegend.MarkMD.MultiEnMode_Line, tateObiXY, tateObiMojiXY)
                                    }
                                } else {
                                    VL = this.UNIT_P(g, tateObiMojiXY, V, UnitTx, i, (rep == 1));
                                    let lx2 = tateObiXY.x + (tateObiMojiXY.x - tateObiXY.x) * (LegendVn + 1 - i) / (LegendVn + 1);
                                    if (rep == 1) {
                                        let amd = state.attrData.TotalData.ViewStyle.MapLegend.MarkMD;
                                        state.attrData.Draw_Line(g, amd.MultiEnMode_Line, tateObiXY, new point(lx2, tateObiXY.y));
                                        state.attrData.Draw_Line(g, amd.MultiEnMode_Line, new point(lx2, tateObiXY.y), new point(lx2, tateObiMojiXY.y + TH / 2));
                                        state.attrData.Draw_Line(g, amd.MultiEnMode_Line,new point( lx2, tateObiMojiXY.y + TH / 2),new point( tateObiMojiXY.x, tateObiMojiXY.y + TH / 2));
                                    }
                                }
                                size2.width = Math.max(size2.width, r1 * gData.En_Obi.AspectRatio + TH * 1.5 + VL);
                                ysize2 += TH;
                            }
                        }
                        size2.height = Math.max(ysize2 + TH / 2, y3 + TH / 2);
                        break;
                    }
                }
            }

            //縦にデータ項目名を並べる場合
            let UnderW=0;
            //size2.height += TH / 2
            for (let i = 0; i < n; i++) {
                let a = gData.Data[i].DataNumber;
                UnderW = Math.max(UnderW, g.measureText(state.attrData.Get_DataTitle(Layn2, a, false)).width);
                switch (gData.GraphMode) {
                    case enmGraphMode.PieGraph: {
                        if (rep == 1) {
                            state.attrData.Draw_Print(g, state.attrData.Get_DataTitle(Layn2, a, false),
                                new point(ALP.x + TH * 2, ALP.y + size2.height), LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
                            state.attrData.Draw_Fan(g, new point(ALP.x, ALP.y + size2.height + TH / 2), TH * 1.5, 1.2, 1.9, gData.En_Obi.BoaderLine, gData.Data[i].Tile);
                        }
                        size2.height += TH * 1.2;
                        break;
                    }
                    case enmGraphMode.StackedBarGraph: {
                        if (rep == 1) {
                            state.attrData.Draw_Print(g, state.attrData.Get_DataTitle(Layn2, a, false),
                                new point(ALP.x + TH * 2, ALP.y + size2.height), LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
                            state.attrData.Draw_Tile_Box(g, new rectangle(new point(ALP.x, ALP.y + size2.height),new size( TH * 1.5, TH)), gData.En_Obi.BoaderLine, gData.Data[i].Tile, 0);
                        }
                        size2.height += TH * 1.2;
                        break;
                    }
                }

            }
            UnderW += TH * 2;
            
            size2.width = Math.max(size2.width, UnderW);

            if (SizeGetOnlyF == true) {
                HeadBoxSize.width = size2.width;
                HeadBoxSize.height = size2.height;
                return false;
            }
            let C_Rect = new rectangle(ALP, size2);
            if (state.attrData.Check_Screen_In(C_Rect) == false) {
                return false;
            }

            if (rep == 0) {
                this.LegendBoxBack(g,  C_Rect);
            } else {
                HeadBoxSize.width = size2.width;
                HeadBoxSize.height = size2.height;
            }
        }
    }

    /**折れ線・棒グラフモード */
    static Draw_Multi_Oresen(g: CanvasRenderingContext2D, ALP: point, HeadBoxSize: size, Layn2: number, DataSet_Num: number, SizeGetOnlyF: boolean) {

        if (state.attrData.TotalData.ViewStyle.MapLegend.Base.Visible == false) {
            return false
        }
        let vs = state.attrData.TotalData.ViewStyle;
        let LFont = vs.MapLegend.Base.Font.Clone();
        let TH = state.attrData.Get_Length_On_Screen(LFont.Size);
        g.font = LFont.toContextFont(vs.ScrData).font;


        let gData = state.attrData.LayerData[Layn2].LayerModeViewSettings.GraphMode.DataSet[DataSet_Num];
        let DataN = gData.Data.length;


        let DataTitleHeight = 0;
        let UnitTx = state.attrData.Get_DataUnit_With_Kakko(Layn2, gData.Data[0].DataNumber);
        for (let i = 0; i < DataN; i++) {
            DataTitleHeight = Math.max(DataTitleHeight, g.measureText(state.attrData.Get_DataTitle(Layn2, gData.Data[i].DataNumber, false)).width);
        }
        let ww = state.attrData.Get_Length_On_Screen(gData.Oresen_Bou.Size);
        let wh = ww / gData.Oresen_Bou.AspectRatio;
        let VL = this.UNIT_P(g, new point(0, 0), gData.Oresen_Bou.yMax, UnitTx, 0, false);
        let xsize2 = Math.max(HeadBoxSize.width, ww + VL);
        VL = this.UNIT_P(g, new point(0, 0), gData.Oresen_Bou.ymin, UnitTx, 1, false);
        xsize2 = Math.max(xsize2, ww + VL);
        let ysize2 = HeadBoxSize.height + TH / 2 + wh + TH / 4 + DataTitleHeight;
        let C_Rect = new rectangle(ALP, new size(xsize2, ysize2));
        if (SizeGetOnlyF == true) {
            HeadBoxSize.width = xsize2;
            HeadBoxSize.height = ysize2;
            return false;
        }

        if (state.attrData.Check_Screen_In(C_Rect) == false) {
            return false;
        }

        //ここから描画
        this.LegendBoxBack(g,  C_Rect);

        //折れ線グラフの枠

        let stx;
        let Ymax = gData.Oresen_Bou.YMax;
        let Ymin = gData.Oresen_Bou.Ymin;
        let ST = gData.Oresen_Bou.Ystep;
        if (gData.GraphMode == enmGraphMode.LineGraph) {
            stx = ww / (DataN + 1);
        } else {
            stx = ww / (DataN + 2);
        }
        let GraphRect = new rectangle(new point(ALP.x, ALP.y + HeadBoxSize.height + TH / 2), new size(ww, wh));
        state.attrData.Draw_Tile_Box(g, GraphRect, gData.Oresen_Bou.BorderLine, gData.Oresen_Bou.BackgroundTile, 0);

        //枠の目盛り
        let Zero_Line = clsBase.Line();
        Zero_Line.Color = gData.Oresen_Bou.BorderLine.Color.Clone();
        for (let j = Ymin; j <= Ymax; j += ST) {
            if ((j != Ymin) && (j != Ymax)) {
                let H = 1 - (j - Ymin) / (Ymax - Ymin);
                let yy = HeadBoxSize.height + TH / 2 + wh * H;
                state.attrData.Draw_Line(g, Zero_Line,new point( ALP.x, ALP.y + yy),new point( ALP.x + stx / 2 + 1, ALP.y + yy));
                state.attrData.Draw_Line(g, Zero_Line,new point(  ALP.x + ww, ALP.y + yy),new point(  ALP.x + ww - stx / 2 - 1, ALP.y + yy));
            }
        }

        let zpf = false;
        let zy;
        if ((Ymin < 0) && (Ymax > 0)) {
            let H = 1 - (-Ymin) / (Ymax - Ymin);
            let yy = HeadBoxSize.height + TH / 2 + wh * H;
            g.setLineDash([5,3]);
            state.attrData.Draw_Line(g, Zero_Line,new point( ALP.x, ALP.y + yy),new point( ALP.x + ww + 1, ALP.y + yy));
            g.setLineDash([]);
            zpf = true;
            zy = yy;
        }

        g.save();
        let RectC = GraphRect.Clone();
        RectC.inflate(1, 1);
        g.rect(RectC.left, RectC.top, RectC.width(), RectC.height());
        g.clip();
        if (gData.GraphMode == enmGraphMode.LineGraph) {
            let fsx = stx; //折れ線
            let flx1;
            let fly2;
            for (let j = 0; j < DataN; j++) {
                let a = gData.Data[j].DataNumber;
                let H = 1 - (state.attrData.LayerData[Layn2].atrData.Data[a].Statistics.Ave - Ymin) / (Ymax - Ymin);
                let yy = HeadBoxSize.height + wh * H + TH / 2;
                if (j == 0) {
                    flx1 = ALP.x + fsx;
                    fly2 = ALP.y + yy;
                    fsx += stx;
                } else {
                    state.attrData.Draw_Line(g, gData.Oresen_Bou.Line, new point(flx1, fly2), new point(ALP.x + fsx + 1, ALP.y + yy + 1));
                    flx1 = ALP.x + fsx + 1;
                    fly2 = ALP.y + yy + 1;
                    fsx += stx;
                }
            }
        } else {
            let fsx = stx; //棒グラフ
            for (let j = 0; j < DataN; j++) {
                let a = gData.Data[j].DataNumber;
                let H = 1 - (state.attrData.LayerData[Layn2].atrData.Data[a].Statistics.Ave - Ymin) / (Ymax - Ymin);
                let yy = HeadBoxSize.height + wh * H + TH / 2;
                let yy2 = HeadBoxSize.height + TH / 2 + (wh * (1 - (-Ymin) / (Ymax - Ymin)));
                state.attrData.Draw_Tile_Box(g, new rectangle(new point(ALP.x + fsx, ALP.y + yy), new size(stx, yy2 - yy)), gData.Oresen_Bou.Line, gData.Data[j].Tile, 0);
                fsx += stx;
            }
        }
        g.restore();

        VL = this.UNIT_P(g, new point(ALP.x + ww + TH * 0.2, ALP.y + HeadBoxSize.height), Ymax, UnitTx, 0, true);
        HeadBoxSize.width = Math.max(HeadBoxSize.width, ww + VL);
        VL = this.UNIT_P(g, new point(ALP.x + ww + TH * 0.2, ALP.y + HeadBoxSize.height + wh), Ymin, UnitTx, 1, true);
        HeadBoxSize.width = Math.max(HeadBoxSize.width, ww + VL);
        if (zpf == true) {
            state.attrData.Draw_Print(g, "0", new point(ALP.x + ww + TH * 0.2, ALP.y + HeadBoxSize.height + zy - TH / 2), LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
        }
        HeadBoxSize.height += wh + TH / 4;

        //データの項目表示
        LFont.Kakudo = 90;
        let xstacu = 0;
        for (let i = 0; i < DataN; i++) {
            if (xstacu <= stx * i) {
                let ttl = state.attrData.Get_DataTitle(Layn2, gData.Data[i].DataNumber, false);
                let H = g.measureText(ttl).width;
                let p = new point(ALP.x + stx * i + stx, ALP.y + HeadBoxSize.height + H / 2);
                switch (gData.GraphMode) {
                    case enmGraphMode.LineGraph:
                    case enmGraphMode.BarGraph:
                        p.offset(stx / 2, 0);
                        break;
                }
                state.attrData.Draw_Print(g, ttl, p, LFont, enmHorizontalAlignment.Center, enmVerticalAlignment.Top);
                xstacu += TH;
            }
        }
        HeadBoxSize.height = ysize2;
    }
    
    /**記号の数モードの凡例 */
    static Draw_MarkBlockMode(g: CanvasRenderingContext2D, ALP: point, HeadBoxSize: size, UnitTx: string, Layn2: number, datn2: number, SizeGetOnlyF: boolean){

        let vs = state.attrData.TotalData.ViewStyle;
        let PData  = state.attrData.LayerData[Layn2].atrData.Data[datn2];
        let MkCommon  = PData.SoloModeViewSettings.MarkCommon;

        let LFont  = vs.MapLegend.Base.Font;
        let UH  = state.attrData.Get_Length_On_Screen(LFont.Size);
        g.font = LFont.toContextFont(vs.ScrData).font;

        let B_Md  = PData.SoloModeViewSettings.MarkBlockMD;

        let size2  = HeadBoxSize.Clone();

        let r  = state.attrData.Radius(B_Md.Mark.WordFont.Size, 1, 1);
        r=spatial.Get_TurnedBox(new size(r, r), B_Md.Mark.WordFont.Kakudo).width;
        let in1  = "1個あたり";//clsSettings.Data.LegendBlockmodeWord;
        let LegendWord  = B_Md.LegendBlockModeWord;
        if(LegendWord != "" ){
            in1 = LegendWord;
        }
        let in2  = "　" + String(Generic.Figure_Using_Solo(B_Md.Value, vs.MapLegend.Base.Comma_f)) + UnitTx;
        let leftMargin  = r * 2.5;
        if(B_Md.ArrangeB == enmMarkBlockArrange.Random ){
            leftMargin = UH;
        }
        size2.width = Math.max(size2.width, g.measureText(in1).width + leftMargin);
        size2.width = Math.max(size2.width, g.measureText(in2).width + leftMargin);
        size2.height += Math.max(r * 2.1, UH * 2);
        let MinusWord = this.getLegendMinusWord(MkCommon.LegendMinusWord);
        let PlusWord = this.getLegendPlusWord(MkCommon.LegendPlusWord);

        if(PData.Statistics.Min < 0 ){
            let pmw  = Math.max(g.measureText(PlusWord).width, g.measureText(MinusWord).width);
            size2.width = Math.max(size2.width, r * 2.5 + pmw);
            let yy  = Math.max(r * 2, UH);
            size2.height *= 1.5;
            size2.height += yy * 2;
        }
        if((PData.MissingValueNum > 0)&&(state.attrData.TotalData.ViewStyle.Missing_Data.Print_Flag == true )){
            size2.height += UH * 0.5 + Math.max(state.attrData.Radius(vs.Missing_Data.BlockMark.WordFont.Size, 1, 1) * 2, UH);
        }
        if(SizeGetOnlyF == true ){
            HeadBoxSize.width = size2.width;
            HeadBoxSize.height = size2.height;
            return false;
        }
        let C_Rect  = new rectangle(ALP, size2);
        if(state.attrData.Check_Screen_In(C_Rect) == false ){
            return false;
        }

        //ここまで範囲調べ、以降描画

        this.LegendBoxBack(g, C_Rect);

        size2 = HeadBoxSize.Clone();
        let ax  = r * 1.1;
        let ay  = HeadBoxSize.height + r * 1.1;
        let MKP  = ALP.Clone();
        let MKR  = state.attrData.Radius(B_Md.Mark.WordFont.Size, 1, 1);
        if(B_Md.ArrangeB == enmMarkBlockArrange.Random ){
            let rp=[];
            rp.push(new point(0.3,0.2));
            rp.push(new point(0.74,0.25));
            rp.push(new point(0.58,0.48));
            rp.push(new point(0.28,0.75));
            rp.push(new point(0.7,0.72));
            g.fillStyle=B_Md.Mark.Tile.Color.toRGBA();
            for(let i in rp){
                let p =new point();
                p.x = rp[i].x * UH;
                p.y = rp[i].y * UH;
                let np  = MKP.Clone();
                np.offset(p);
                if(MKR != 0 ){
                    state.attrData.Draw_Mark(g, np, MKR, B_Md.Mark);
                }else{
                    g.fillRect(Brush, np.x, np.y, 1, 1);
                }
            }
        }else{
            MKP.offset(ax, ay);
            state.attrData.Draw_Mark(g, MKP, MKR, B_Md.Mark);
        }
        let DP1  = ALP.Clone();
        size2 = HeadBoxSize.Clone();
        DP1.offset(leftMargin, size2.height);
        let DP2  = DP1.Clone();
        DP2.offset(0, UH);
        state.attrData.Draw_Print(g, in1, DP1, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
        state.attrData.Draw_Print(g, in2, DP2, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
        size2.width = Math.max(size2.width, g.measureText(in1 ).width + r * 2.5);
        size2.width = Math.max(size2.width, g.measureText(in2 ).width);
        size2.height += Math.max(r * 2.1, UH * 2);
        if(PData.Statistics.Min < 0 ){
            let yy  = Math.max(r * 2, UH);
            size2.height *= 1.5;
            let pP  = ALP.Clone();
            pP.offset(ax, size2.height);
            state.attrData.Draw_Mark(g, pP, MKR, B_Md.Mark);
            let mP  = ALP.Clone();
            mP.offset(ax, size2.height + yy);
            let PushMK = B_Md.Mark.Clone();
            PushMK.Tile = MkCommon.MinusTile;
            state.attrData.Draw_Mark(g, mP, MKR, PushMK);

            let tP1 = ALP.Clone();
            tP1.offset(r * 2.5, size2.height - UH / 2);
            let tP2  = tP1.Clone();
            tP2.offset(0, yy);
            state.attrData.Draw_Print(g, PlusWord, tP1, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
            state.attrData.Draw_Print(g, MinusWord, tP2, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);

            size2.height += yy * 2;
        }
        if ((PData.MissingValueNum > 0) && (state.attrData.TotalData.ViewStyle.Missing_Data.Print_Flag == true)) {
            let r2 = state.attrData.Radius(vs.Missing_Data.BlockMark.WordFont.Size, 1, 1);
            let myy = Math.max(r2, UH / 2);
            let mp = ALP.Clone();
            mp.offset(ax, size2.height + myy + UH * 0.5);
            state.attrData.Draw_Mark(g, mp, r2, vs.Missing_Data.BlockMark);
            size2.height += UH * 0.5 + myy * 2;

            let tp = new point(ALP.x + r * 2.5, mp.y);
            state.attrData.Draw_Print(g, vs.Missing_Data.Text, tp, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Center);
        }
        return true;
    }

    /**棒の高さモードの凡例 */
    static Draw_MarkBarMode(g: CanvasRenderingContext2D, ALP: point, HeadBoxSize: size, UnitTx: string, Layn2: number, datn2: number, SizeGetOnlyF: boolean) {

        let vs = state.attrData.TotalData.ViewStyle;
        let md = vs.Missing_Data;
        let LFont = vs.MapLegend.Base.Font;
        let UH = state.attrData.Get_Length_On_Screen(LFont.Size)+3;
        let PData = state.attrData.LayerData[Layn2].atrData.Data[datn2];
        g.font = LFont.toContextFont(vs.ScrData).font;

        let Bar_Md = PData.SoloModeViewSettings.MarkBarMD;

        let UnitHeight = UH;
        let BarSize = new size();
        BarSize.height = state.attrData.Get_Length_On_Screen(Bar_Md.MaxHeight)
        BarSize.width = state.attrData.Get_Length_On_Screen(Bar_Md.Width)
        let maxv;
        if (Bar_Md.MaxValueMode == enmMarkSizeValueMode.inDataItem) {
            maxv = PData.Statistics.Max;
        } else {
            maxv = Bar_Md.MaxValue;
        }
        let printVal;
        if ((vs.MapLegend.Base.ModeValueInScreenFlag == true) || (Bar_Md.BarShape == enmMarkBarShape.triangle)){
            printVal = maxv;
        } else {
            printVal = (Math.floor(maxv / Bar_Md.ScaleLineInterval) * Bar_Md.ScaleLineInterval)
        }

        let val = printVal.toString();
        let printvalP = BarSize.height - printVal / maxv * BarSize.height;
        let barareaPlusH = 0;
        if (printvalP < UH / 2) {
            barareaPlusH = UH / 2 - printvalP;
        }

        let BarAreaSize = BarSize.Clone();
        if (Bar_Md.ThreeD == true) {
            BarAreaSize.width += BarAreaSize.width / 3;
            if (barareaPlusH < BarAreaSize.width / 3) {
                barareaPlusH = BarAreaSize.width / 3;
            }
        }
        BarAreaSize.height += barareaPlusH;
        BarAreaSize.width += state.attrData.Get_Length_On_Screen(4);
        BarAreaSize.height += UnitHeight;

        let tickw = state.attrData.Get_Length_On_Screen(0.3)
        let wordw = g.measureText(val).width;

        let FigSize = new size();
        FigSize.width = BarAreaSize.width + wordw + tickw;
        FigSize.width = Math.max(FigSize.width, g.measureText(UnitTx).width)
        FigSize.width = Math.max(FigSize.width, HeadBoxSize.width);
        FigSize.height = BarAreaSize.height + UH / 2 + HeadBoxSize.height;

        if ((PData.MissingValueNum > 0) && (md.Print_Flag == true)) {
            FigSize.height += UH + Math.max(state.attrData.Radius(md.MarkBar.WordFont.Size, 1, 1) * 2, UH);
            FigSize.width = Math.max(FigSize.width, state.attrData.Radius(md.MarkBar.WordFont.Size, 1, 1) * 2.5 + UH + g.measureText(md.Text).width);
        }
        if (SizeGetOnlyF == true) {
            HeadBoxSize.width = FigSize.width;;
            HeadBoxSize.height = FigSize.height;
            return false;
        }

        let C_Rect = new rectangle(ALP, FigSize);
        if (state.attrData.Check_Screen_In(C_Rect) == false) {
            return false;
        }

        this.LegendBoxBack(g, C_Rect);
        let TopP = ALP.Clone();
        TopP.y += HeadBoxSize.height;
        let zerop = new point(ALP.x + wordw + tickw, TopP.y + BarAreaSize.height);

        let retV = clsPrint.MarkBarRectPrint(new point(zerop.x + state.attrData.Get_Length_On_Screen(2) + BarSize.width / 2, zerop.y), BarSize.width, BarSize.height, Bar_Md.ThreeD)
        let poly = retV.UpperPoly;
        let poly2 = retV.RightPoly;
        let barrect = retV.CenterRect;
        let Tile = Bar_Md.InnerTile.Clone();
        let OP  = new point(zerop.x + state.attrData.Get_Length_On_Screen(2) + BarSize.width / 2, zerop.y);
        switch (Bar_Md.BarShape){
            case enmMarkBarShape.triangle: {
                let tri = [];
                tri.push(new point(OP.x - BarSize.width / 2, OP.y));
                tri.push(new point(OP.x + BarSize.width / 2, OP.y));
                tri.push(new point(OP.x, OP.y - BarSize.height));
                tri.push(tri[0].Clone());
                state.attrData.Draw_Poly_Inner(g, tri, [4], Tile);
                state.attrData.Draw_Line(g, Bar_Md.FrameLinePat,  tri);
                break;
            }
            case enmMarkBarShape.bar: {
                if (Bar_Md.ThreeD == true) {
                    let Ptile = Tile.Clone();
                    Ptile.Color = Generic.GetColorArrange(Tile.Color, 100);
                    state.attrData.Draw_Poly_Inner(g, poly, [5], Ptile);
                    state.attrData.Draw_Line(g, Bar_Md.FrameLinePat, poly);

                    let Ptile2 = Tile.Clone();
                    Ptile2.Color = Generic.GetColorArrange(Tile.Color, -100);
                    state.attrData.Draw_Poly_Inner(g, poly2, [5], Ptile2);
                    state.attrData.Draw_Line(g, Bar_Md.FrameLinePat, poly2);
                }
                state.attrData.Draw_Tile_Box(g, barrect, Bar_Md.FrameLinePat, Tile, 0);
                for (let v = 0; v < maxv; v += Bar_Md.ScaleLineInterval) {
                    let h = v / maxv * BarSize.height;
                    state.attrData.Draw_Line(g, clsBase.Line(), new point(zerop.x, zerop.y - h), new point(zerop.x - tickw, zerop.y - h));
                    if (Bar_Md.ScaleLineVisible == true) {
                        state.attrData.Draw_Line(g, Bar_Md.scaleLinePat, new point(barrect.left, zerop.y - h), new point(barrect.right, zerop.y - h));
                    }
                }
                break;
            }
        }

        state.attrData.Draw_Line(g, clsBase.Line(), zerop, new point(zerop.x + BarAreaSize.width, zerop.y))
        state.attrData.Draw_Line(g, clsBase.Line(), zerop, new point(zerop.x, zerop.y - BarSize.height))
        // if (Bar_Md.ScaleLineVisible == true) {
        //     state.attrData.Draw_Tile_Box(g, barrect, Bar_Md.FrameLinePat, clsBase.BlancTile(), 0);
        // }
        state.attrData.Draw_Print(g, UnitTx, TopP, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
        state.attrData.Draw_Print(g, "0", new point(zerop.x - tickw, zerop.y), LFont, enmHorizontalAlignment.Right, enmVerticalAlignment.Center);
        state.attrData.Draw_Print(g, val, new point(zerop.x - tickw, zerop.y - printVal / maxv * BarSize.height), LFont, enmHorizontalAlignment.Right, enmVerticalAlignment.Center);
        TopP.y += BarAreaSize.height + UH / 2 + HeadBoxSize.height;
        if ((PData.MissingValueNum > 0) && (md.Print_Flag == true)) {
            let r2 = state.attrData.Radius(md.MarkBar.WordFont.Size, 1, 1);
            let mp = TopP;
            mp.offset(r2 + UH, r2 + UH);
            state.attrData.Draw_Mark(g, mp, r2, md.MarkBar);
            mp.offset(r2 * 1.5, 0);
            state.attrData.Draw_Print(g, md.Text, mp, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Center);
        }
        return true;
    }

    //記号の大きさモードの凡例
    static Draw_MarkSizeMode(g: CanvasRenderingContext2D, ALP: point, HeadBoxSize: size, UnitTx: string, Layn2: number, datn2: number, SizeGetOnlyF: boolean) {

        let vs = state.attrData.TotalData.ViewStyle;
        let md = vs.Missing_Data;
        let LFont = vs.MapLegend.Base.Font;
        let PData = state.attrData.LayerData[Layn2].atrData.Data[datn2];
        let UH = state.attrData.Get_Length_On_Screen(LFont.Size);
        g.font = LFont.toContextFont(vs.ScrData).font;

        let Legend_Val = this.Get_CircleModeLegendValue(Layn2, datn2);
        let LegendVn = Legend_Val.length;
        let MkCommon = PData.SoloModeViewSettings.MarkCommon;

        let MinusWord = this.getLegendMinusWord(MkCommon.LegendMinusWord);
        let PlusWord = this. getLegendPlusWord(MkCommon.LegendPlusWord);

        let LayerShape = state.attrData.LayerData[Layn2].Shape;
        let RMAXV;
        let msmd = PData.SoloModeViewSettings.MarkSizeMD;
        let msmdm = msmd.Mark;
        if (msmd.MaxValueMode == enmMarkSizeValueMode.inDataItem) {
            RMAXV = Math.max(Math.abs(state.attrData.Get_DataMax(Layn2, datn2)), Math.abs(state.attrData.Get_DataMin(Layn2, datn2)));
        } else {
            RMAXV = msmd.MaxValue;
        }
        let shapexs;
        let xs = HeadBoxSize.width;
        let Ys = HeadBoxSize.height;
        let ys2 = HeadBoxSize.height;
        let WordsX;
        if (LayerShape == enmShape.LineShape) {
            shapexs = state.attrData.Get_Length_On_Screen(8);
        } else {
            let maxr = state.attrData.Radius(msmdm.WordFont.Size, Legend_Val[0], RMAXV);
            let tr=spatial.Get_TurnedBox(new size(maxr, maxr), msmdm.WordFont.Kakudo);
            shapexs = 2 * tr.width;
        }
        let AllXs;
        if ((LayerShape != enmShape.LineShape) && (msmdm.PrintMark == 0) && (msmdm.ShapeNumber == 0) && (vs.MapLegend.MarkMD.CircleMD_CircleMini_F == true)) {
            //円の大きさでコンパクトの場合の縦横
            let cs=this.OverCircle_Print(g, new point(ALP.x, ALP.y + Ys), RMAXV, Legend_Val, UnitTx, msmdm.WordFont.Size, msmdm.Line, msmdm.Tile,  false);
            AllXs = Math.max(xs, cs.width);
            Ys += cs.height;
        } else {
            //凡例文字の幅比較

             WordsX = shapexs + g.measureText(" ").width;
            let xsWords = 0;
            for (let i = 0; i < LegendVn; i++) {
                let fw = Generic.Figure_Using_Solo(Legend_Val[i], vs.MapLegend.Base.Comma_f);
                if (i == 0) {
                    fw += UnitTx;
                }
                xsWords = Math.max(xsWords, g.measureText(fw).width);
            }
            AllXs = WordsX + xsWords;
            //凡例記号の高さ加算
            for (let i = 0; i < LegendVn;i++) {
                if (LayerShape == enmShape.LineShape) {
                    let r = state.attrData.Get_Length_On_Screen(Legend_Val[i] / RMAXV * msmd.LineShape.LineWidth);
                    Ys += Math.max(r + UH / 2, UH * 1.5);
                } else {
                    let r = state.attrData.Radius(msmdm.WordFont.Size, Legend_Val[i], RMAXV);
                    let tr =spatial.Get_TurnedBox(new size(r, r), msmdm.WordFont.Kakudo);
                    Ys += Math.max(tr.height * 2 + UH / 2, UH);
                }
                
            }
        }
        if ((PData.Statistics.Min < 0) && ((MkCommon.Inner_Data.Flag == false) || (MkCommon.Inner_Data.Mode == enmInner_Data_Info_Mode.ClassHatch))) {
            //正の数負の数の幅計算
            Ys += UH;
            let pmw = Math.max(g.measureText(PlusWord).width, g.measureText(MinusWord).width);

            switch (LayerShape) {
                case (enmShape.PolygonShape, enmShape.PointShape): {
                    Ys += UH * 2;
                    let r = UH / 2;
                    AllXs = Math.max(AllXs, r * 2 + r * 1.5 + pmw);
                    break;
                }
                case (enmShape.LineShape): {
                    Ys += UH * 2;
                    AllXs = Math.max(AllXs, shapexs + pmw);
                    break;
                }
            }
        }
        if ((PData.MissingValueNum > 0) && (md.Print_Flag == true)) {
            //欠損値の凡例計算
            let MKR = state.attrData.Radius(md.Mark.WordFont.Size, 1, 1)
            switch (LayerShape) {
                case (enmShape.PolygonShape):
                case (enmShape.PointShape): {
                    AllXs = Math.max(AllXs, MKR + MKR * 2 + g.measureText(md.Text).width);
                    Ys += UH * 0.5 + Math.max(MKR * 2, UH);
                    break;
                }
                case (enmShape.LineShape):
                    if (md.LineShape.BlankF==false) {
                        AllXs = Math.max(AllXs, shapexs + g.measureText(md.Text).width);
                        Ys += Math.max(UH, md.LineShape.Width * 2) * 1.5;
                    }
                    break;
            }
        }
        HeadBoxSize.width = AllXs;
        HeadBoxSize.height = Ys;
        if (SizeGetOnlyF == true) {
            return false;
        }
        let C_Rect = new rectangle(ALP, HeadBoxSize);
        if (state.attrData.Check_Screen_In(C_Rect) == false) {
            return false;
        }

        //--------描画
        this.LegendBoxBack(g,  C_Rect);
        let cyplus;
        if ((LayerShape != enmShape.LineShape) && ((msmdm.PrintMark == 0) && (msmdm.ShapeNumber == 0))&& (
            vs.MapLegend.MarkMD.CircleMD_CircleMini_F == true)) {
            let cs=this.OverCircle_Print(g, new point(ALP.x, ALP.y + ys2), RMAXV, Legend_Val, UnitTx, msmdm.WordFont.Size, msmdm.Line, msmdm.Tile,  true);
            ys2 += cs.height;
        }else {
            let HL = shapexs / 2;
            //MKCN = .Mark.ShapeNumber
            for (let i = 0; i < LegendVn; i++) {
                let r;
                if (LayerShape == enmShape.LineShape) {
                    r = Legend_Val[i] / RMAXV * msmd.LineShape.LineWidth;
                } else {
                    r = state.attrData.Radius(msmdm.WordFont.Size, Legend_Val[i], RMAXV);
                    let tr = spatial.Get_TurnedBox(new size(r, r), msmdm.WordFont.Kakudo);
                    r = tr.height;
                }
                 cyplus = Math.max(r, UH / 2);
                switch (LayerShape) {
                    case (enmShape.PolygonShape):
                    case (enmShape.PointShape): {
                        let MKP = new point(ALP.x + HL, ALP.y + ys2 + cyplus);
                        let MKR = state.attrData.Radius(msmdm.WordFont.Size, Legend_Val[i], RMAXV);
                        state.attrData.Draw_Mark(g, MKP, MKR, msmdm);
                        break;
                    }
                    case (enmShape.LineShape): {
                        let Line_Pat = clsBase.Line();
                        Line_Pat.Set_Same_ColorWidth_to_LinePat?.(msmd.LineShape.Color, r);
                        Line_Pat.Edge_Connect_Pattern = msmdm.Line.Edge_Connect_Pattern;
                        let P1 = new point(ALP.x + r, ALP.y + ys2 + cyplus);
                        let P2 = new point(ALP.x + shapexs + 1 - r, ALP.y + ys2 + cyplus);
                        state.attrData.Draw_Line(g, Line_Pat, P1, P2);
                        HL = shapexs / 2;
                        break;
                    }
                }

                let fw = Generic.Figure_Using_Solo(Legend_Val[i], vs.MapLegend.Base.Comma_f);
                if (i == 0) {
                    fw += UnitTx;
                }
                let P = new point(ALP.x + WordsX, ALP.y + ys2 + cyplus);
                state.attrData.Draw_Print(g, fw, P, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Center);
                ys2 += Math.max(r * 2 + UH / 2, UH * 1.5);
            }
        }

        if ((PData.Statistics.Min < 0) && (MkCommon.Inner_Data.Flag == false) || ((MkCommon.Inner_Data.Mode == enmInner_Data_Info_Mode.ClassHatch))) {
            ys2 += UH;
            let r = UH / 2.2;
            switch (LayerShape) {
                case (enmShape.PolygonShape):
                case (enmShape.PointShape): {
                    let P = new point(ALP.x + r, ALP.y + ys2)
                    state.attrData.Draw_Mark(g, P, r, msmdm)
                    P.y = ALP.y + ys2 + UH
                    let PushMark = msmdm.Clone();
                    PushMark.Tile = MkCommon.MinusTile;
                    state.attrData.Draw_Mark(g, P, r, PushMark);
                    let p2 = new point(P.x + r * 1.5, ALP.y + ys2 - UH / 2);
                    let p3 = p2.Clone();
                    p3.y += UH;
                    state.attrData.Draw_Print(g, PlusWord, p2, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
                    state.attrData.Draw_Print(g, MinusWord, p3, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
                    ys2 += UH * 2
                    break;
                }
                case (enmShape.LineShape): {
                    let Lpat = clsBase.Line();
                    Lpat.Set_Same_ColorWidth_to_LinePat?.(MkCommon.MinusTile.Line.Color, LFont.Size / 5);
                    let p1 = new point(ALP.x + r, ALP.y + ys2);
                    let p2 = new point(ALP.x + shapexs - r, ALP.y + ys2);
                    state.attrData.Draw_Line(g, Lpat, p1, p2);
                    let p3 = new point(ALP.x + r, ALP.y + ys2 + r * 2.5);
                    let p4 = new point(ALP.x + shapexs - r, ALP.y + ys2 + r * 2.5);
                    Lpat.Set_Same_ColorWidth_to_LinePat?.(MkCommon.MinusTile.Line.Color, LFont.Size / 5);
                    state.attrData.Draw_Line(g, Lpat, p3, p4);
                    let p5 = new point(ALP.x + shapexs, ALP.y + ys2 - UH / 2);
                    let p6 = new point(ALP.x + shapexs, ALP.y + ys2 - UH / 2 + r * 2.5);
                    state.attrData.Draw_Print(g, PlusWord, p5, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
                    state.attrData.Draw_Print(g, MinusWord, p6, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
                    ys2 += UH * 2;
                    break;
                }
            }
        }
        if ((PData.MissingValueNum > 0) && (md.Print_Flag == true)) {
            //欠損値の凡例描画
            switch (LayerShape) {
                case (enmShape.PolygonShape):
                case (enmShape.PointShape):{
                    let MKR = state.attrData.Radius(md.Mark.WordFont.Size, 1, 1);
                    let yy = Math.max(MKR, UH / 2);
                    let p = new point(ALP.x + MKR, ALP.y + ys2 + yy + UH * 0.5);
                    state.attrData.Draw_Mark(g, p, MKR, md.Mark);
                    ys2 += UH * 0.5 + yy * 2;
                    let p2 = new point(p.x + MKR * 2, p.y);
                    state.attrData.Draw_Print(g, md.Text, p2, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Center);
                    break;
                }
                case (enmShape.LineShape): {
                    if (md.LineShape.BlankF==false) {
                        let r;
                        let MaxLW = state.attrData.Get_Length_On_Screen(md.LineShape.Width)
                        if (md.LineShape.Edge_Connect_Pattern.Edge_Pattern == 2) {
                            r = 0;
                        } else {
                            r = MaxLW;
                        }
                        let P1 = new point(ALP.x + r, ALP.y + ys2 + Math.max(UH, MaxLW));
                        let P2 = new point(ALP.x + shapexs - r, P1.y);
                        state.attrData.Draw_Line(g, md.LineShape, P1, P2);
                        let P3 = new point(ALP.x + shapexs, P1.y);
                        state.attrData.Draw_Print(g, md.Text, P3, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Center);
                    }
                }
                    break;
            }
        }

        return true;
    }
    static getLegendMinusWord(s: string) {
        if (s == "") {
            return clsSettingData.LegendMinusWord;
        } else {
            return s;
        }
    }
    static getLegendPlusWord(s: string) {
        if (s == "") {
            return clsSettingData.LegendPlusWord;
        } else {
            return s;
        }
    }

    //記号モードの凡例数値を並べ替えて返す
    static Get_CircleModeLegendValue(Layernum: number, DataNum: number) {

        let lval = state.attrData.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings.MarkSizeMD.Value;
        let ST = new clsSortingSearch();
        for (let i = 0; i < lval.length; i++) {
            if (lval[i] > 0) {
                ST.Add(lval[i]);
            }
        }
        ST.AddEnd();
        let lev = [];
        for (let i = 0; i < ST.NumofData(); i++) {
            lev.push(ST.DataPositionRevValue(i));
        }
        return lev;
    }

    //円をコンパクトにまとめる凡例を描き、幅を返す
    static OverCircle_Print(g: CanvasRenderingContext2D, pos: point, RMAX: number, va: number[], UnitTx: string, EN_Size: number, LP: Tile_Property, tp: Tile_Property, Print_Flag: boolean) {

        let MP = new Mark_Property();
        MP.PrintMark = enmMarkPrintType.Mark;
        MP.ShapeNumber = 0
        MP.Tile = tp.Clone();
        MP.Line = LP.Clone();
        MP.WordFont.Back.Tile.BlankF = true;
        MP.WordFont.Back.Line.BlankF = true;
        MP.WordFont.Back.Round = 0;
        let TH = state.attrData.Get_Length_On_Screen(state.attrData.TotalData.ViewStyle.MapLegend.Base.Font.Size);
        let rx = state.attrData.Radius(EN_Size, va[0], RMAX) * 1.1;
        let xss = 0;
        let yss = 0;
        let x2 = rx * 3;
        let OLY2 = pos.y;
        let cy = 0;
        for (let i = 0; i < va.length; i++) {
            if (va[i] > 0) {
                let r = state.attrData.Radius(EN_Size, va[i], RMAX);
                cy = rx * 2 - r + TH / 2;
                if (Print_Flag == true) {
                    state.attrData.Draw_Mark(g, new point(pos.x + rx, pos.y + cy), r, MP);
                }
                if (i == 0) {
                    yss = cy - r - TH / 2;
                }
                let lx1 = pos.x + rx;
                let lx2 = pos.x + rx * 2.7 - i * (rx * 2.9 - rx) / 10;
                let LX3 = lx2 + rx * 0.2 + i * (rx * 2.9 - rx) / 10;
                let ly1 = pos.y + cy - r;
                let ly2 = ly1;
                if (ly2 < OLY2) {
                    ly2 = OLY2;
                }
                let VL = this.UNIT_P(g, new point(pos.x + x2, ly2 - TH / 2), va[i], UnitTx, i, Print_Flag);
                xss = Math.max(xss, x2 + VL);
                if (Print_Flag == true) {
                    let mmd = state.attrData.TotalData.ViewStyle.MapLegend.MarkMD;
                    state.attrData.Draw_Line(g, mmd.MultiEnMode_Line, new point(lx1, ly1), new point(lx2, ly1));
                    state.attrData.Draw_Line(g, mmd.MultiEnMode_Line, new point(lx2, ly1), new point(lx2, ly2));
                    state.attrData.Draw_Line(g, mmd.MultiEnMode_Line, new point(lx2, ly2), new point(LX3, ly2));
                }
                yss += TH;
                OLY2 = ly2 + TH;
            }
        }
        let Ys = Math.max(yss, cy + rx);
        return new size(xss, Ys);
    }

    static UNIT_P(g: CanvasRenderingContext2D, pos: point, V: number, UnitTx: string, i: number, print_f: boolean) {

        let vsm = state.attrData.TotalData.ViewStyle.MapLegend;
        let vv = Generic.Figure_Using_Solo(V, vsm.Base.Comma_f);
        if(i == 0 ){
            vv += UnitTx;
        }
        if(print_f ==true ){
            state.attrData.Draw_Print(g, vv, pos, vsm.Base.Font, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
        }
        let LFont = vsm.Base.Font;
        g.font = LFont.toContextFont(state.attrData.TotalData.ViewStyle.ScrData).font;
        let w = g.measureText(vv).width;
        return w;
    }

    //文字モードの凡例
    static Draw_StringMode(g: CanvasRenderingContext2D, ALP: point, HeadBoxSize: size, UnitTx: string, Layn2: number, datn2: number, SizeGetOnlyF: boolean) {

        let vs = state.attrData.TotalData.ViewStyle;
        let LFont = vs.MapLegend.Base.Font;
        let UH = state.attrData.Get_Length_On_Screen(LFont.Size);
        g.font = LFont.toContextFont(vs.ScrData).font;

        let Unx = state.attrData.Get_DataUnit_With_Kakko(Layn2, datn2);
        if( Unx == "" ){
            return false;
        }
        let size2 = HeadBoxSize.Clone();
        size2.width = Math.max(size2.width, g.measureText(Unx).width);
        size2.height += UH;
        if( SizeGetOnlyF == true ){
            HeadBoxSize.width = size2.width;
            HeadBoxSize.height = size2.height;
            return false;
        }
        let C_Rect = new rectangle(ALP, size2);
        if( state.attrData.Check_Screen_In(C_Rect) == false ){
            return false;
        }
        this.LegendBoxBack(g,  C_Rect);
        let tP = ALP.Clone();
        tP.y += UH;
        state.attrData.Draw_Print(g, Unx, tP, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Top)
        return true;
    }

    //階級記号モードの凡例
    static Draw_ClassMarkMode(g: CanvasRenderingContext2D, ALP: point, HeadBoxSize: size, UnitTx: string, Layn2: number, datn2: number, SizeGetOnlyF: boolean) {

        let vs = state.attrData.TotalData.ViewStyle;
        let LFont = vs.MapLegend.Base.Font;
        let PData = state.attrData.LayerData[Layn2].atrData.Data[datn2];
        let sv = PData.SoloModeViewSettings;
        let Div_Num = sv.Div_Num;

        let retv = this.Paint_Tile_Word_Set(g, UnitTx, Layn2, datn2,false);
        let ww = retv.ww;
        let hh = retv.hh;
        let hu = retv.hu;
        let bxw = retv.bxw;
        let byh = retv.byh;
        let vn = retv.vn ?? 0;
        let sujiW = retv.sujiW;
        let freqW = retv.freqW;
        let LL = retv.LL;
        let RR = retv.RR;
        let inBox = new size(bxw, 0);
        let acumy=0;
        let ysize=[];
        for (let i = 0; i < Div_Num; i++) {
            let cm = sv.Class_Div[i].ClassMark;
            let w2;
            let h2;
            if (cm.PrintMark == 1) {
                let fnt = cm.WordFont.toContextFont(state.attrData.TotalData.ViewStyle.ScrData);
                g.font = fnt.font;
                w2 = g.measureText(cm.wordmark).width + byh * 0.5;
                h2 = fnt.height;
            } else {
                w2 = state.attrData.Radius(cm.WordFont.Size, 1, 1) * 2 + byh * 0.5;
                h2 = w2;
            }
            let turnedSize = spatial.Get_TurnedBox(new size(w2, h2), cm.WordFont.Kakudo);
            inBox.width = Math.max(inBox.width, turnedSize.width);
            ysize[i] = Math.max(h2, byh);
            acumy += ysize[i];
        }

        let bxwy = 0;
        if (this.GetClassMethod(Layn2, datn2,false)  == enmClassMode_Meshod.Separated) {
            bxwy = byh * vs.MapLegend.ClassMD.SeparateGapSize;
        }

        HeadBoxSize.width = Math.max(HeadBoxSize.width, inBox.width + sujiW + ww / 2 + freqW);
        let ysize2 = HeadBoxSize.height + acumy + hu + (Div_Num - 1) * bxwy;
        inBox.height = ysize2;
        if ((PData.MissingValueNum > 0) && (state.attrData.TotalData.ViewStyle.Missing_Data.Print_Flag == true)) {
            let vm = state.attrData.TotalData.ViewStyle.Missing_Data;
            let H;
            if (vm.ClassMark.PrintMark == enmMarkPrintType.Word) {
                H = state.attrData.Get_Length_On_Screen(vm.ClassMark.WordFont.Size);
            } else {
                H = state.attrData.Radius(vm.ClassMark.WordFont.Size, 1, 1) * 2 ;
            }
            ysize2 += H + byh;
        }
        if (SizeGetOnlyF == true) {
            HeadBoxSize.height = ysize2;
            return false;
        }
        let C_Rect = new rectangle(ALP, new size(HeadBoxSize.width, ysize2));
        if (state.attrData.Check_Screen_In(C_Rect) == false) {
            return false;
        }

        this.LegendBoxBack(g, C_Rect);

        acumy = 0
        for (let i = 0; i < Div_Num; i++) {

            let rect = new rectangle(new point(ALP.x, ALP.y + acumy  + hu + HeadBoxSize.height),
                new size(inBox.width + 1, ysize[i] + 1));
            if (state.attrData.TotalData.ViewStyle.MapLegend.ClassMD.ClassMarkFrame_Visible == true) {
                let TilePat = clsBase.Tile();
                TilePat.Color = new colorRGBA(255, 255, 255, 255);
                state.attrData.Draw_Tile_Box(g, rect, state.attrData.TotalData.ViewStyle.MapLegend.ClassMD.PaintMode_Line, TilePat, 0);
            }
            let r = state.attrData.Radius(sv.Class_Div[i].ClassMark.WordFont.Size, 1, 1);
            let p = new point(ALP.x + inBox.width / 2, ALP.y + acumy + ysize[i] / 2 + hu + HeadBoxSize.height);
            state.attrData.Draw_Mark(g, p, r, sv.Class_Div[i].ClassMark);
            acumy += ysize[i] + bxwy;
        }
        state.attrData.Draw_Print(g, UnitTx, new point(ALP.x + inBox.width, ALP.y + HeadBoxSize.height), LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);

        if ((this.GetClassMethod(Layn2, datn2,false) == enmClassMode_Meshod.Separated) || (PData.DataType == enmAttDataType.Category)) {
            acumy = 0;
            for (let i = 0; i <= vn; i++) {
                let fu;
                if (PData.DataType == enmAttDataType.Category) {
                    fu = sv.Class_Div[i].Value;
                } else {
                    fu = this.Get_SeparateClassWords( sv.Class_Div, i, Div_Num, LL, RR);
                }
                let p = new point(ALP.x + inBox.width + ww / 2, ALP.y + acumy + ysize[i] / 2 + hu + HeadBoxSize.height);
                state.attrData.Draw_Print(g, fu, p, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Center);
                acumy += ysize[i] + bxwy;
            }
        } else {
            acumy = 0;
            for (let i = 0; i < Div_Num - 1; i++) {
                let fu= Generic.Figure_Using3(sv.Class_Div[i].Value, LL, RR, state.attrData.TotalData.ViewStyle.MapLegend.Base.Comma_f);
                let p = new point(ALP.x + inBox.width + ww / 2, ALP.y + acumy + ysize[i] + hu + HeadBoxSize.height);
                state.attrData.Draw_Print(g, fu, p, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Center);
                acumy += ysize[i] + bxwy;
            }
        }

        let retFV;
        if (state.attrData.TotalData.ViewStyle.MapLegend.ClassMD.FrequencyPrint == true) {
            //度数分布
            retFV = state.attrData.Get_ClassFrequency(Layn2, datn2, true);
            if (retFV.ok == true) {
                acumy = 0;
                for (let i = 0; i < retFV.frequency.length; i++) {
                    let cwp = new point();
                    cwp.y = ALP.y + acumy + ysize[i] / 2 + hu + HeadBoxSize.height;
                    cwp.x = ALP.x + inBox.width + ww / 2 + sujiW;
                    state.attrData.Draw_Print(g, "(" + retFV.frequency[i].toString() + ")", cwp, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Center);
                    acumy += ysize[i] + bxwy;
                }
            }
        }

        if ((PData.MissingValueNum > 0) && (state.attrData.TotalData.ViewStyle.Missing_Data.Print_Flag == true)) {
            let vm = state.attrData.TotalData.ViewStyle.Missing_Data;
            let H;
            if (vm.ClassMark.PrintMark == enmMarkPrintType.Word) {
                H = state.attrData.Get_Length_On_Screen(vm.ClassMark.WordFont.Size);
            } else {
                H = state.attrData.Radius(vm.ClassMark.WordFont.Size, 1, 1) * 2 ;
            }
            let y2 = ALP.y + inBox.height + byh / 2 + HeadBoxSize.height;
            if (state.attrData.TotalData.ViewStyle.MapLegend.ClassMD.ClassMarkFrame_Visible == true) {
                let TilePat = clsBase.Tile();
                TilePat.Color = clsBase.ColorWhite();
                let rect = new rectangle(new point(ALP.x, y2), new size(inBox.width + 1, H + 1));
                state.attrData.Draw_Tile_Box(g, rect,  state.attrData.TotalData.ViewStyle.MapLegend.ClassMD.PaintMode_Line, TilePat,0);
            }
            let p = new point(ALP.x + inBox.width / 2, y2 + H / 2);
            state.attrData.Draw_Mark(g, p, state.attrData.Radius(vm.ClassMark.WordFont.Size, 1, 1), vm.ClassMark);
            p = new point(ALP.x + inBox.width + ww / 2, y2 + H / 2);
            state.attrData.Draw_Print(g, vm.Text, p, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Center);
            if (state.attrData.TotalData.ViewStyle.MapLegend.ClassMD.FrequencyPrint == true) {
                let cwp = new point();
                cwp.y = p.y;
                cwp.x = ALP.x + inBox.width + ww / 2 + sujiW;
                state.attrData.Draw_Print(g, "(" + retFV.missFreq.toString() + ")", cwp, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Center);
            }
        }

        HeadBoxSize.height = ysize2;
        return true;

    }

    //線モードと線形状オブジェクトのペイントモードの凡例
    static Draw_ClassODModeMode(g: CanvasRenderingContext2D, ALP: point, HeadBoxSize: size, UnitTx: string, Layn2: number, datn2: number, SizeGetOnlyF: boolean) {

        let PData  = state.attrData.LayerData[Layn2].atrData.Data[datn2];
        let Class_div = PData.SoloModeViewSettings.Class_Div;

        let vs = state.attrData.TotalData.ViewStyle;
        let LFont  = vs.MapLegend.Base.Font;
        let UH  = state.attrData.Get_Length_On_Screen(LFont.Size)+3;
        let Div_Num  = PData.SoloModeViewSettings.Div_Num;
        let LL  = 1;
        let RR  = 0;
        if(PData.DataType != enmAttDataType.Category ){
            for (let i = 0; i < Div_Num - 1;i++){
                let a  = Class_div[i].Value;
                let deci =Generic.Figure_Arrange(a);
                let L = deci.BeforeDecimal;
                let r = deci.AfterDecimal;
                if ( L== 0) { L = 1 }
                if(a < 0 ){ L += 1}
                LL = Math.max(LL, L);
                RR = Math.max(RR, r);
            }
        }

        let rm  = 0;
        for (let i = 0; i < Div_Num ;i++){
            rm = Math.max(Class_div[i].ODLinePat.Width, rm);
        }
        let x2  = state.attrData.Get_Length_On_Screen(8);
        let Xsepa  = state.attrData.Get_Length_On_Screen(2);
        let ysize2  = HeadBoxSize.height;
        //---
        let xs  = 0;
        if(UnitTx != "" ){
            HeadBoxSize.height += UH;
        }
        let thdata = LFont.toContextFont(vs.ScrData);
        g.font = thdata.font;
        for (let i = 0; i < Div_Num; i++) {
            let cvi = Class_div[i];
            if (cvi.ODLinePat.BlankF== false) {
                let LW = state.attrData.Get_Length_On_Screen(cvi.ODLinePat.Width)
                let H = Math.max(UH, LW)
                let r;
                if (cvi.ODLinePat.Edge_Connect_Pattern.Edge_Pattern =='butt' ) {
                    r = state.attrData.Radius(rm, 0, rm);
                } else {
                    r = state.attrData.Radius(rm, cvi.ODLinePat.Width, rm);
                }
                let fu;
                if (PData.DataType == enmAttDataType.Category) {
                    fu = cvi.Value;
                } else {
                    fu = this.Get_SeparateClassWords( Class_div, i, Div_Num, LL, RR);
                }
                xs = Math.max(xs, g.measureText(fu).width);
                HeadBoxSize.height += H * 1.5;
            }
        }
        
        let misv = vs.Missing_Data;
        if ((PData.MissingValueNum > 0) && (misv.Print_Flag == true) && (misv.LineShape.BlankF==false) && (
            state.attrData.LayerData[Layn2].Shape == enmShape.LineShape)) {
            xs = Math.max(xs, g.measureText(misv.Text).width);
            let LW = state.attrData.Get_Length_On_Screen(misv.LineShape.Width);
            HeadBoxSize.height += Math.max(UH, LW) * 1.5;
        }

        let FreqW  = 0;
        let freq=[]; 
        if(vs.MapLegend.ClassMD.FrequencyPrint == true ){
            let retV=state.attrData.Get_ClassFrequency(Layn2, datn2, true);
            freq=retV.frequency;
            if(retV.ok == true) {
                for (let i = 0; i < retV.frequency.length;i++){
                    FreqW = Math.max(FreqW, g.measureText("(" + retV.frequency[i].toString() + ")").width);
                }
            }
        }

        HeadBoxSize.width = x2 + xs + Xsepa + FreqW;
        if(SizeGetOnlyF == true ){
            return false;
        }
        let C_Rect  = new rectangle(ALP, HeadBoxSize);
        if(state.attrData.Check_Screen_In(C_Rect) == false ){
            return false;
        }

        //ここまで範囲調べ、以降描画

        this.LegendBoxBack(g,  C_Rect)

        //---
        HeadBoxSize.height = ysize2;
        if(UnitTx != "" ){
            state.attrData.Draw_Print(g, UnitTx,
                    new point(ALP.x + x2 + state.attrData.Radius(5, 1, 1), ALP.y + HeadBoxSize.height),
                    LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
            HeadBoxSize.height += UH;
        }
        for (let i = 0; i < Div_Num ;i++){
            let cvi =  Class_div[i];
                if(cvi.ODLinePat.BlankF== false ){
                    let LW  = state.attrData.Get_Length_On_Screen(cvi.ODLinePat.Width);
                    let H  = Math.max(UH, LW);
                    let Y  = HeadBoxSize.height + UH / 2;
                    let r ;
                    if(cvi.ODLinePat.Edge_Connect_Pattern.Edge_Pattern == enmEdge_Pattern.Flat ){
                        r = 0;
                    }else{
                        r = LW / 2;
                    }
                    state.attrData.Draw_Line(g, cvi.ODLinePat, new point(ALP.x + r, ALP.y + Y), new point(ALP.x + x2 - r, ALP.y + Y));
                    let fu ;
                    if(PData.DataType == enmAttDataType.Category ){
                        fu = cvi.Value;
                    }else{
                        fu = this.Get_SeparateClassWords( Class_div, i, Div_Num, LL, RR);
                    }
                    state.attrData.Draw_Print(g, fu, new point(ALP.x + x2 + Xsepa, ALP.y + Y), LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Center);
                    if(vs.MapLegend.ClassMD.FrequencyPrint == true ){
                        let cwp =new point(ALP.x + x2 + Xsepa + xs,ALP.y + HeadBoxSize.height + UH / 2);
                        state.attrData.Draw_Print(g, "(" + freq[i].toString() + ")", cwp, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Center);
                    }
                    HeadBoxSize.height += H * 1.5;
                    if(i == Div_Num - 1 ){
                        HeadBoxSize.height -= H;
                    }
                }
            }  
        
            if((PData.MissingValueNum > 0)&&(misv.Print_Flag == true)&&(misv.LineShape.BlankF==false )&&(
                state.attrData.LayerData[Layn2].Shape == enmShape.LineShape) ){
                let LW  = state.attrData.Get_Length_On_Screen(misv.LineShape.Width);
                let r ;
                if(misv.LineShape.Edge_Connect_Pattern.Edge_Pattern == enmEdge_Pattern.Flat ){
                    r = 0;
                }else{
                    r = LW / 2;
                }
                let Y  = HeadBoxSize.height + Math.max(UH, LW) * 1.5;
                state.attrData.Draw_Line(g, misv.LineShape, new point(ALP.x + r, ALP.y + Y), new point(ALP.x + x2 - r, ALP.y + Y));
                state.attrData.Draw_Print(g, misv.Text, new point(ALP.x + x2 + Xsepa, ALP.y + Y), LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Center);
                HeadBoxSize.height = Y;
            }
        
        return true;
    }

    //階級区分凡例分離表示の文字
    static Get_SeparateClassWords(Class_div: number[], checkN: number, DivNum: number, LL: number, RR: number){

        let UnderSTR ;
        let HifunSTR ;
        let MoreSTR ;
        let MiddleSTR ;
        let vs = state.attrData.TotalData.ViewStyle;
        switch( vs.MapLegend.ClassMD.SeparateClassWords){
            case enmSeparateClassWords.Japanese:
                UnderSTR = "未満";
                HifunSTR = "～";
                MoreSTR = "以上";
                MiddleSTR = "";
                break;
            case enmSeparateClassWords.English:
                UnderSTR = "less than ";
                HifunSTR = " - ";
                MoreSTR = " or more";
                MiddleSTR = "";
                break;
            }

        let fu;
        let comma_f = vs.MapLegend.Base.Comma_f;
        switch (checkN) {
            case 0:
                fu = Generic.Figure_Using3(Class_div[checkN].Value, LL, RR, comma_f) + MoreSTR;
                break;
            case (DivNum - 1):
                if (vs.MapLegend.ClassMD.SeparateClassWords == enmSeparateClassWords.Japanese) {
                    fu = Generic.Figure_Using3(Class_div[checkN - 1].Value, LL, RR, comma_f) + UnderSTR;
                } else {
                    fu = UnderSTR + Generic.Figure_Using3(Class_div[checkN - 1].Value, LL, RR, comma_f).trim();
                }
                break;
            default:
                fu = Generic.Figure_Using3(Class_div[checkN].Value, LL, RR, comma_f) + HifunSTR +
                    Generic.Figure_Using3(Class_div[checkN - 1].Value, LL, RR, comma_f) + MiddleSTR;
                break;
        }
        return fu;
    }

    //ペイントモードの線形状
    static Draw_ClassPaint_LineShape(g: CanvasRenderingContext2D, ALP: point, HeadBoxSize: size, UnitTx: string, Layn2: number, datn2: number, SizeGetOnlyF: boolean) {

        let PData  = state.attrData.LayerData[Layn2].atrData.Data[datn2]

        let PointLayerMark  = state.attrData.LayerData[Layn2].LayerModeViewSettings.PointLineShape;

        let dvn  = PData.SoloModeViewSettings.Div_Num
        let LinePush=[];
        for (let i = 0; i < dvn;i++){
            LinePush[i] = PData.SoloModeViewSettings.Class_Div[i].ODLinePat.Clone();
        }

        for (let i = 0; i < dvn ;i++){
            let cd= PData.SoloModeViewSettings.Class_Div[i];
            cd.ODLinePat = clsBase.Line();
            cd.ODLinePat.Color=cd.PaintColor.Clone();
            cd.ODLinePat.Width=PointLayerMark.LineWidth;
            cd.ODLinePat.Edge_Connect_Pattern = PointLayerMark.LineEdge.Clone();
        }

        let screen_in_f  = this.Draw_ClassODModeMode(g,  ALP, HeadBoxSize, UnitTx, Layn2, datn2, SizeGetOnlyF);

        for (let i = 0; i < dvn;i++){
            PData.SoloModeViewSettings.Class_Div[i].ODLinePat = LinePush[i].Clone();
        }
        return screen_in_f;
    }
    //ペイントモードの凡例
    static Draw_ClassPaintHatchMode(g: CanvasRenderingContext2D, ALP: point, HeadBoxSize: size, UnitTx: string, Layn2: number, datn2: number, SizeGetOnlyF: boolean) {

        let vs = state.attrData.TotalData.ViewStyle;
        let LFont = vs.MapLegend.Base.Font;
        let PData = state.attrData.LayerData[Layn2].atrData.Data[datn2];

        let retv=this.Paint_Tile_Word_Set(g, UnitTx, Layn2, datn2,true);
        let ww = retv.ww;
        let hu = retv.hu;
        let bxw = retv.bxw;
        let byh = retv.byh;
        let vn = retv.vn ?? 0;
        let sujiW = retv.sujiW;
        let freqW = retv.freqW;
        let LL = retv.LL;
        let RR = retv.RR;
        HeadBoxSize.width = Math.max(HeadBoxSize.width, bxw + ww / 2 + sujiW + freqW);
        let fbyh = byh;
        if (this.GetClassMethod(Layn2, datn2,true) == enmClassMode_Meshod.Separated) {
            byh = byh * (vs.MapLegend.ClassMD.SeparateGapSize + 1);
        }
        let ysize2 = HeadBoxSize.height + byh * (PData.SoloModeViewSettings.Div_Num + 0.1) + hu;
        //    Ysize2 = YSize + bxw * (PData.Div_Num + 0.1) + hu + (PData.Div_Num - 1) * bxwy
        if ((PData.MissingValueNum > 0) && (vs.Missing_Data.Print_Flag == true) && (
            state.attrData.LayerData[Layn2].Type != enmLayerType.Trip)) {
            ysize2 += bxw * 2;
        }
        if (SizeGetOnlyF == true) {
            HeadBoxSize.height = ysize2;
            return false;
        }
        let C_Rect = new rectangle(ALP, new size(HeadBoxSize.width, ysize2));

        if (state.attrData.Check_Screen_In(C_Rect) == false) {
            return false;
        }
        //ここまで範囲調べ、以降描画
        this.LegendBoxBack(g,  C_Rect);

        let P = ALP.Clone();
        P.offset(bxw, HeadBoxSize.height);
        state.attrData.Draw_Print(g, UnitTx, P, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
        let ClassBoxLine = vs.MapLegend.ClassMD.PaintMode_Line;

        for (let i = 0; i < PData.SoloModeViewSettings.Div_Num; i++) {
            let PaintBox = new rectangle(new point(ALP.x, ALP.y + i * byh + hu + HeadBoxSize.height), new size(bxw + 1, fbyh));
            let TilePat = clsBase.Tile();
            TilePat.Color = PData.SoloModeViewSettings.Class_Div[i].PaintColor;
            state.attrData.Draw_Tile_Box(g, PaintBox, ClassBoxLine, TilePat, 0);
        }
        if ((this.GetClassMethod(Layn2, datn2,true) == enmClassMode_Meshod.Separated) || (PData.DataType == enmAttDataType.Category)) {
            //分離表示またはカテゴリー
            for (let  i = 0; i <= vn; i++) {
                let fu;
                if (PData.DataType == enmAttDataType.Category) {
                    fu = PData.SoloModeViewSettings.Class_Div[i].Value;
                } else {
                    fu = this.Get_SeparateClassWords(PData.SoloModeViewSettings.Class_Div, i, PData.SoloModeViewSettings.Div_Num, LL, RR);
                }
                let cwp = ALP.Clone();;
                cwp.offset(bxw + ww / 2, i * byh + hu + HeadBoxSize.height);
                state.attrData.Draw_Print(g, fu, cwp, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
            }
        } else {
            for (let i = 0; i <= PData.SoloModeViewSettings.Div_Num - 2; i++) {
                let fu = Generic.Figure_Using3(PData.SoloModeViewSettings.Class_Div[i].Value, LL, RR, vs.MapLegend.Base.Comma_f);
                let cwp = ALP.Clone();
                cwp.offset(bxw + ww / 2, (i + 0.5) * byh + hu + HeadBoxSize.height);
                state.attrData.Draw_Print(g, fu, cwp, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
            }
        }
        let retV;
        if (vs.MapLegend.ClassMD.FrequencyPrint == true) {
            //度数分布
            retV=state.attrData.Get_ClassFrequency(Layn2, datn2, true);
            if (retV.ok == true) {
                for (let i = 0; i < retV.frequency.length; i++) {
                    let cwp = new point();
                    cwp.y = ALP.y + i * byh + hu + HeadBoxSize.height;
                    cwp.x = ALP.x + bxw + ww / 2 + sujiW;
                    state.attrData.Draw_Print(g, "(" + retV.frequency[i].toString() + ")", cwp, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
                }
            }
        }

        if ((PData.MissingValueNum > 0) && (vs.Missing_Data.Print_Flag == true) && (
            state.attrData.LayerData[Layn2].Type != enmLayerType.Trip)) {
            //欠損値
            let MissRect = new rectangle(new point(ALP.x, ALP.y + (PData.SoloModeViewSettings.Div_Num + 0.5) * byh + hu + HeadBoxSize.height), new size(bxw, fbyh));
            let am = vs.Missing_Data;
            state.attrData.Draw_Tile_Box(g, MissRect, ClassBoxLine, am.PaintTile, 0);
            let mistxp = new point(ALP.x + bxw + ww / 2, MissRect.top);
            state.attrData.Draw_Print(g, am.Text, mistxp, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);

            if (vs.MapLegend.ClassMD.FrequencyPrint == true) {
                let cwp = new point();
                cwp.y = MissRect.top;
                cwp.x = ALP.x + bxw + ww / 2 + sujiW;
                state.attrData.Draw_Print(g, "(" + String(retV.missFreq)+ ")", cwp, LFont, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
            }
        }
        HeadBoxSize.height = ysize2;
        return true;
    }
    static LegendBoxBack(g: CanvasRenderingContext2D, C_Rect: rectangle) {

        state.attrData.Draw_Tile_RoundBox(g, C_Rect, state.attrData.TotalData.ViewStyle.MapLegend.Base.Back, 0);
    }

    static GetClassMethod(Layn2: number, datn2: number, CategorySeparate_f_Enable: boolean) {

        let CMethod = state.attrData.TotalData.ViewStyle.MapLegend.ClassMD.PaintMode_Method;
        let PData = state.attrData.LayerData[Layn2].atrData.Data[datn2];
        if ((PData.DataType == enmAttDataType.Category == true) && (state.attrData.TotalData.ViewStyle.MapLegend.ClassMD.CategorySeparate_f == true) && (CategorySeparate_f_Enable == true)) {
            CMethod = enmClassMode_Meshod.Separated;
        }
        return CMethod;
    }

    static Paint_Tile_Word_Set(g: CanvasRenderingContext2D, UnitTX: string, Layn2: number, datn2: number, CategorySeparate_f_Enable: boolean) {

        let ww;
        let hh;
        let hu;
        let bxw=0;
        let byh;
        let vn;
        let sujiW=0;
        let freqW=0;
        let LL = 1;
        let RR = 0;
        let PData = state.attrData.LayerData[Layn2].atrData.Data[datn2];
        let Class_div = PData.SoloModeViewSettings.Class_Div;
        let vs = state.attrData.TotalData.ViewStyle;
        let n = 1;
        if (PData.DataType == enmAttDataType.Category) {
            n = 0;
        }
        let Div_Num = PData.SoloModeViewSettings.Div_Num;
        for (let i = 0; i <= (Div_Num -1- n); i++) {
            let a = Class_div[i].Value;
            let deci =Generic.Figure_Arrange(a);
            let L = deci.BeforeDecimal;
            let r = deci.AfterDecimal;
            if ( L== 0) { L = 1 }
            if (a < 0) { L++ }
            LL = Math.max(LL, L);
            RR = Math.max(RR, r);
        }

        let LFont = vs.MapLegend.Base.Font;
        let H = state.attrData.Get_Length_On_Screen(LFont.Size)+3;
        if (H == 0) {
            return {
                ww: ww,
                hh: hh,
                hu: hu,
                bxw: bxw,
                byh: byh,
                vn: vn,
                sujiW: sujiW,
                freqW: freqW,
                LL: LL,
                RR: RR
            };
        }
        g.font = LFont.toContextFont(vs.ScrData).font;
        ww = g.measureText("8").width;
        hh = H;
        if (UnitTX != "") {
            hu = hh;
        } else {
            hu = 0;
        }
        sujiW = g.measureText(UnitTX).width;
        if ((PData.MissingValueNum > 0) && (vs.Missing_Data.Print_Flag == true) && (
            state.attrData.LayerData[Layn2].Type != enmLayerType.Trip)) {
            sujiW = Math.max(sujiW, g.measureText(vs.Missing_Data.Text).width);
        }

        let CMethod = this.GetClassMethod(Layn2, datn2, CategorySeparate_f_Enable);
        if (PData.DataType == enmAttDataType.Category) {
            vn = Div_Num - 1;
        } else {
            if (CMethod == enmClassMode_Meshod.Noral) {
                vn = Div_Num - 2;
            } else {
                vn = Div_Num - 1;
            }
        }

        let sujiw2 = 0;
        if ((CMethod == enmClassMode_Meshod.Separated) || (PData.DataType == enmAttDataType.Category)) {
            let fu
            for (let i = 0; i < vn; i++) {
                if (PData.DataType == enmAttDataType.Category) {
                    fu = Class_div[i].Cat_Name;
                } else {
                    fu = this.Get_SeparateClassWords( PData.SoloModeViewSettings.Class_Div, i, Div_Num, LL, RR);
                }
                sujiw2 = Math.max(sujiw2, g.measureText(fu).width);
            }
        } else {
            let fu;
            for (let i = 0; i < Div_Num - 2; i++) {
                fu = Generic.Figure_Using3(Class_div[i].Value, LL, RR, vs.MapLegend.Base.Comma_f);
                sujiw2 = Math.max(sujiw2, g.measureText(fu).width);
            }
        }
        sujiw2 += ww / 2;

        sujiW = Math.max(sujiW, sujiw2);

        let FreqW = 0;
        if (vs.MapLegend.ClassMD.FrequencyPrint == true) {
            let retV=state.attrData.Get_ClassFrequency(Layn2, datn2, true);
            if (retV.ok == true) {
                for (let j = 0; j < retV.frequency.length; j++) {
                    let fq="(" + String(retV.frequency[j]) + ")";
                    FreqW = Math.max(FreqW, g.measureText(fq).width);
                }
            }
        }
        byh = state.attrData.Get_Length_On_Screen(LFont.Size)+3;
        bxw = byh * vs.MapLegend.ClassMD.PaintMode_Width;
        return {
            ww: ww,
            hh: hh,
            hu: hu,
            bxw: bxw,
            byh: byh,
            vn: vn,
            sujiW: sujiW,
            freqW: FreqW,
            LL: LL,
            RR: RR
        }
    }

    //タイトル表示
    static Title_Print(g: CanvasRenderingContext2D) {

        let vs = state.attrData.TotalData.ViewStyle;
        if (vs.MapTitle.Visible == false) {
            return;
        }
        let TI = this.getPrintTitle(g);
        state.attrData.Draw_Print(g, TI.title, TI.rect.topLeft(), vs.MapTitle.Font, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
    }

    static getPrintTitle(g: CanvasRenderingContext2D) {

        let tt;
        let vs = state.attrData.TotalData.ViewStyle;
        let Layernum = state.attrData.TotalData.LV1.SelectedLayer;
        switch (state.attrData.TotalData.LV1.Print_Mode_Total) {
            case (enmTotalMode_Number.DataViewMode): {
                let al = state.attrData.LayerData[Layernum];
                switch (al.Print_Mode_Layer) {
                    case (enmLayerMode_Number.SoloMode): {
                        let DataNum = al.atrData.SelectedIndex;
                        tt = al.atrData.Data[DataNum].Title;
                        break;
                    }
                    case (enmLayerMode_Number.GraphMode): {
                        let gm = al.LayerModeViewSettings.GraphMode;
                        tt = gm.DataSet[gm.SelectedIndex].title;
                        break;
                    }
                    case (enmLayerMode_Number.LabelMode): {
                        let lm = al.LayerModeViewSettings.LabelMode;
                        tt = lm.DataSet[lm.SelectedIndex].title;
                        break;
                    }
                }
                break;
            }
            case (enmTotalMode_Number.OverLayMode): {
                let ov = state.attrData.TotalData.TotalMode.OverLay;
                tt = ov.DataSet[ov.SelectedIndex].title;
                break;
            }
            case (enmTotalMode_Number.SeriesMode): {
                tt = state.attrData.TempData.Series_temp.title;
                break;
            }
        }
        let P_Title = vs.MapTitle.Clone();
        if (vs.ScrData.Accessory_Base == enmBasePosition.Screen) {
            P_Title.Position = vs.ScrData.getSRXYfromRatio(P_Title.Position);
        }
        let atx = tt;
        let xw = state.attrData.Get_Length_On_Screen(P_Title.MaxWidth);
        
        let txp  = clsDraw.TextCut_for_print(g, atx, P_Title.Font, true, xw,vs.ScrData);
        let d_an2 = txp.Out_Text;
        let yw = txp.Height;
        let RealW = txp.RealWidth;
        let outTx = "";
        if (d_an2.length > 0) {
            outTx = d_an2[0];
    }
        for (let i = 1; i < d_an2.length; i++) {
            outTx += chrLF + d_an2[i];
        }
        yw *= d_an2.length;
        let tP = vs.ScrData.getSxSy(P_Title.Position);
        let Rect = new rectangle(new point(tP.x - RealW / 2, tP.y - yw / 2), new size(RealW, yw));
        return {
            title: outTx, rect: Rect
        }
    }

    //方位表示
    static Compass_print(g: CanvasRenderingContext2D) {

        let vs = state.attrData.TotalData.ViewStyle;
        let threed  = vs.ScrData.ThreeDMode;
        if ((vs.AttMapCompass.Visible ==false)||(threed.Set3D_F ==true)&&((threed.Pitch != 0)||(threed.Head !=0)) ){
            return;
        }
        let P_Comp = vs.AttMapCompass.Clone();
        if(vs.ScrData.Accessory_Base == enmBasePosition.Screen ){
            P_Comp.Position = vs.ScrData.getSRXYfromRatio(P_Comp.Position);
        }

        let fmap = state.attrData.SetMapFile("");
        let CompD = fmap.Map.MapCompass.Mark.WordFont.Kakudo;
        if(threed.Set3D_F ==true ){
            CompD -= threed.Bank;
        }
        P_Comp.Mark.WordFont.Kakudo = CompD;
        let r = state.attrData.Radius(P_Comp.Mark.WordFont.Size, 1, 1);
        let centerP = state.attrData.TotalData.ViewStyle.ScrData.getSxSy(P_Comp.Position);
        let checkRect = new rectangle(new point(centerP.x - r, centerP.y - r), new size(r * 2, r * 2));
        if(state.attrData.Check_Screen_In(checkRect) ==true ){
            state.attrData.Draw_Mark(g, centerP, r, P_Comp.Mark);
            let ww = state.attrData.Get_Length_On_Screen(P_Comp.Font.Size) * 0.7;
            let PlusFont = P_Comp.Font.Clone();
            PlusFont.Kakudo += P_Comp.Mark.WordFont.Kakudo;
            for (let i = 0; i <= 3; i++) {
                let wpos = centerP.Clone();
                wpos.offset(Math.cos((i * 90 + 90 + CompD) * Math.PI / 180) * (r + ww),
                    -Math.sin((i * 90 + 90 + CompD) * Math.PI / 180) * (r + ww));
                let CmpassWord;
                switch (i) {
                    case 0:
                        CmpassWord = P_Comp.dirWord.North;
                        break;
                    case 1:
                        CmpassWord = P_Comp.dirWord.West;
                        break;
                    case 2:
                        CmpassWord = P_Comp.dirWord.South;
                        break;
                    case 3:
                        CmpassWord = P_Comp.dirWord.East;
                        break;
                }
                if (CmpassWord != "") {
                    state.attrData.Draw_Print(g, CmpassWord, wpos, PlusFont, enmHorizontalAlignment.Center, enmVerticalAlignment.Center);
                }
            }
        }

    }

    //スケール表示
    static Scale_Print(g: CanvasRenderingContext2D) {

        let scdata = this.getScaleSub(g);
        let C_Rect = scdata.rect;
        if (C_Rect.width() == 0) {
            return;
        }
        let P_Scl = scdata.P_Scl;
        let SCST = scdata.SCST;
        let scaleMax = scdata.scaleMax;
        let sxy = scdata.sxy;
        let zeroW = scdata.zeroW;
        let ScaleLength = scdata.ScaleLength;
        let ScaleMaxW = scdata.ScaleMaxW;

        if (state.attrData.Check_Screen_In(C_Rect) == true) {
            let H = state.attrData.Get_Length_On_Screen(P_Scl.Font.Size);
            state.attrData.Draw_Tile_RoundBox(g, C_Rect, state.attrData.TotalData.ViewStyle.MapScale.Back, 0);
            let TilePat = clsBase.Tile();
            TilePat.Color = P_Scl.Font.Color.Clone();
            let LPat = clsBase.Line();
            LPat.Color = P_Scl.Font.Color;
            switch (P_Scl.BarPattern) {
                case (enmScaleBarPattern.Thin): {
                    let rec = new rectangle(new point(sxy.x + zeroW, sxy.y + H * 1.4), new size(ScaleLength, H * 0.15));
                    state.attrData.Draw_Tile_Box(g, rec,  LPat, TilePat,0);
                    LPat.Color = P_Scl.Font.Color.Clone();
                    LPat.Width = 0.3;
                    for (let i = 1; i < SCST + 2; i++) {
                        let P1 = new point(sxy.x + zeroW + ScaleLength / SCST * (i - 1), sxy.y + H);
                        let P2 = new point(sxy.x + zeroW + ScaleLength / SCST * (i - 1), sxy.y + H * 1.5 - 1);
                        state.attrData.Draw_Line(g, LPat, P1, P2);
                    }
                    break;
                }
                case (enmScaleBarPattern.Slim): {
                    LPat.Color = P_Scl.Font.Color.Clone();
                    LPat.Width = 0.4;
                    state.attrData.Draw_Line(g, LPat, new point(sxy.x + zeroW, sxy.y + H * 1.5 - 1), new point(sxy.x + zeroW + ScaleLength, sxy.y + H * 1.5 - 1));
                    LPat.Width = 0.3;
                    for (let i = 1; i < (SCST + 2); i++) {
                        let P1 = new point(sxy.x + zeroW + ScaleLength / SCST * (i - 1), sxy.y + H);
                        let P2 = new point(sxy.x + zeroW + ScaleLength / SCST * (i - 1), sxy.y + H * 1.5 - 1);
                        state.attrData.Draw_Line(g, LPat, P1, P2);
                    }
                    break;
                }
                case (enmScaleBarPattern.Bold): {
                    let TilePat2 = TilePat.Clone?.() ?? TilePat;
                    TilePat2.Color = new colorRGBA(255, 255, 255, 255);
                    for (let i = 1; i <= SCST; i++) {
                        let TilePat3;
                        if ((i % 2) == 1) {
                            TilePat3 = TilePat.Clone?.() ?? TilePat;
                        } else {
                            TilePat3 = TilePat2.Clone?.() ?? TilePat2;
                        }
                        let Rect1 = new rectangle(new point(sxy.x + zeroW + ScaleLength / SCST * (i - 1), sxy.y + H),new size( ScaleLength / SCST, H * 0.5 - 1));
                        state.attrData.Draw_Tile_Box(g, Rect1, LPat, TilePat3, 0);
                    }
                    break;
                }
        }

            state.attrData.Draw_Print(g, "0", sxy, P_Scl.Font, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
            let tx = Generic.getScaleUnitStrings(scaleMax, P_Scl.Unit);
            let p = new point(sxy.x + ScaleLength + zeroW - ScaleMaxW, sxy.y);
            state.attrData.Draw_Print(g, tx, p, P_Scl.Font, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
        }

    }

    static getScaleSub(g: CanvasRenderingContext2D) {

        let retV = {
             SCST :0,  scaleMax :'',
             sxy :new point(),  P_Scl :new strScale_Attri(),
            zeroW: 0, ScaleLength: 0, ScaleMaxW: 0,
            rect: new rectangle()
        }
        let vs =  state.attrData.TotalData.ViewStyle;
        let threed = vs.ScrData.ThreeDMode;
        if ((vs.MapScale.Visible == false) || ((threed.Set3D_F == true) && ((threed.Pitch != 0) || (threed.Head != 0)))) {
            return retV;
        } 
        let P_Scl = vs.MapScale.Clone();
        if (vs.ScrData.Accessory_Base == enmBasePosition.Screen) {
            P_Scl.Position = vs.ScrData.getSRXYfromRatio(P_Scl.Position);

        }
        let Map = state.attrData.SetMapFile("").Map;
        let SCT = [0, 2, 2, 3, 4, 2, 3, 2, 4, 3, 2];
        retV.SCST = 0;
        let SCM = 0;
        let MapScaleBairitu;
        if (P_Scl.BarAuto == true) {
            let xw = vs.ScrData.ScrView.width();
            MapScaleBairitu = spatial.Get_Scale_Baititu_IdoKedo(P_Scl.Position, Map.Zahyo);
            MapScaleBairitu /= Generic.Convert_ScaleUnit(enmScaleUnit.kilometer, P_Scl.Unit);
            let i = 5;
            while ((SCM < 1) && (i >= 4)) {
                if (Map.Zahyo.Mode == enmZahyo_mode_info.Zahyo_No_Mode) {
                    SCM = xw / i / (Map.SCL * MapScaleBairitu);
                } else {
                    SCM = xw / i / MapScaleBairitu;
                }
                i -= 1;
            }
            let L;
            let LNum;
            if (SCM >= 1) {
                LNum = Math.floor(Math.log(SCM) / Math.log(10)) + 1;
                L = LNum.toString();
            } else {
                LNum = Math.abs(Math.floor(Math.log(SCM) / Math.log(10)));
                L = LNum.toString();
            }
            if (LNum > 6) {
                //表示桁が大きすぎる場合は表示しない
                return retV;
            }
            let a;
            let b = 10 ** (LNum - 1);
            if (SCM >= 1) {
                SCM = Math.floor(SCM / b) * b;
                a = Math.floor(SCM / b).toString();
                if ((Number(a) == 3) || (Number(a) == 5) || (Number(a) == 7) || (Number(a) == 9)) {
                    let aNum = Number(a) + 1;
                    a = aNum.toString();
                    SCM = aNum * b;
                }
            } else {
                let scmStr = String(SCM);
                let leftPart = scmStr.substring(0, 2);
                SCM = parseFloat(leftPart + L);
                let aChar = String(SCM).charAt(String(SCM).length - 1);
                let aNum = parseInt(aChar, 10);
                if ((aNum == 3) || (aNum == 5) || (aNum == 7) || (aNum == 9)) {
                    aNum += 1;
                    SCM = aNum / (10 ** Number(L));
                }
                a = aNum.toString();
            }
            retV.SCST = SCT[Number(a)];
            vs.MapScale.BarDistance = SCM;
            vs.MapScale.BarKugiriNum = retV.SCST;
        } else {
            SCM = P_Scl.BarDistance;
            retV.SCST = P_Scl.BarKugiriNum;
            MapScaleBairitu = spatial.Get_Scale_Baititu_IdoKedo(P_Scl.Position, Map.Zahyo);
            MapScaleBairitu /= Generic.Convert_ScaleUnit(enmScaleUnit.kilometer, P_Scl.Unit);
        }
        if (SCM == 0) {
            return retV;
        }

        retV.sxy = vs.ScrData.getSxSy(P_Scl.Position);
        retV.scaleMax = String(SCM);
        if (Map.Zahyo.Mode == enmZahyo_mode_info.Zahyo_No_Mode) {
            retV.ScaleLength = SCM * Map.SCL * MapScaleBairitu * vs.ScrData.ScreenMG.Mul;
        } else {
            retV.ScaleLength = SCM * MapScaleBairitu * vs.ScrData.ScreenMG.Mul;
        }

        let H = state.attrData.Get_Length_On_Screen(P_Scl.Font.Size)
        if (H > 0) {
            g.font = P_Scl.Font.toContextFont(vs.ScrData).font;
            retV.zeroW = g.measureText("0").width / 2;
            retV.ScaleMaxW = g.measureText(retV.scaleMax).width / 2;
            let ww2 = g.measureText(Generic.getScaleUnitStrings(P_Scl.Unit)).width;

            let mw = (retV.ScaleLength + retV.zeroW + retV.ScaleMaxW + ww2);
            let mh = H * 1.5;
            retV.rect = new rectangle(new point(retV.sxy.x - mh / 4, retV.sxy.y- mh / 4), new size(mw + mh / 2, mh + mh / 2));
        }
        retV.P_Scl = P_Scl;
        return retV;
    }

    //方位記号の外接四角形領域取得
    static GetCompassRect(g: CanvasRenderingContext2D) {

        let vs = state.attrData.TotalData.ViewStyle;
        let P_Comp = vs.AttMapCompass;
        let pp = P_Comp.Position.Clone();
        if (vs.ScrData.Accessory_Base == enmBasePosition.Screen) {
            pp = vs.ScrData.getSRXYfromRatio(P_Comp.Position);
        }
        let r = state.attrData.Radius(P_Comp.Mark.WordFont.Size, 1, 1);
        let cp = vs.ScrData.getSxSy(pp);
        cp.offset(-r, -r);
        return new rectangle(cp, new size(r * 2, r * 2));
    }

    //タイトルの外接四角形領域取得
    static GetTitleRect(g: CanvasRenderingContext2D) {
        let v = this.getPrintTitle(g);
        return v.rect;
    }

    //注の外接四角形領域取得
    static GetNoteRect(g: CanvasRenderingContext2D) {
        let v = this.getPrintNote(g);
        return v.rect;
    }

    //スケールの外接四角形領域取得
    static GetScaleRect(g: CanvasRenderingContext2D) {
        let v = this.getScaleSub(g);
        return v.rect;
    }
}

