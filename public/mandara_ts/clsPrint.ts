

// JavaScript source code
// @ts-expect-error TS(6504): File '/Users/horikazunari/TypeScript/mandara_ts/cl... Remove this comment to see the full error message
/// <reference path="clsGeneric.js" />
// @ts-expect-error TS(6504): File '/Users/horikazunari/TypeScript/mandara_ts/cl... Remove this comment to see the full error message
/// <reference path="clsAttrData.js" />
// @ts-expect-error TS(6504): File '/Users/horikazunari/TypeScript/mandara_ts/cl... Remove this comment to see the full error message
/// <reference path="clsTime.js" />
// @ts-expect-error TS(6504): File '/Users/horikazunari/TypeScript/mandara_ts/cl... Remove this comment to see the full error message
/// <reference path="clsMapdata.js" />
// @ts-expect-error TS(6504): File '/Users/horikazunari/TypeScript/mandara_ts/cl... Remove this comment to see the full error message
/// <reference path="clsDraw.js" />


/**
 * Description placeholder
 *
 * @type {{ DataViewMode: number; OverLayMode: number; SeriesMode: number; }}
 */
const enmTotalMode_Number = {
    DataViewMode: 0,
    OverLayMode: 1,
    SeriesMode:2
}

/**
 * Description placeholder
 *
 * @returns 
 */
var PolydataInfo = function(this: any) {
    this.Pon;
    this.pxy = [];//point
    this.nPolyP = [];
}

/**
 * Description placeholder
 *
 * @returns 
 */
var boundArrangeData = function(this: any) {
    this.Pon;
    this.Fringe = [];
    this.Arrange_LineCode = [];
}

/**
 * Description placeholder
 *
 * @returns 
 */
var VecContourStac_Info = function(this: any) {
    this.fnum=0;// Integer
    this.CNum=0;// Integer
    this.FStac = [];// Integer
    this.cStac = [];// Integer
};

//面オブジェクトの境界線の方向
//Boundary_Arrange関数で使用
/** Description placeholder */
var Fringe_Line_Info = function(this: any) {
    this.code;
    this.Direction;
}



class clsPrint {
    /**
 * Description placeholder
 *
 * @static
 * @param {*} picMap 
 */
static setData(picMap: any){
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.TotalData.ViewStyle.ScrData.OutputDevide = enmOutputDevice.Screen;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let atp=attrData.TempData;
        atp.ContourMode_Temp.ContourDataResetF = true;
        let dv = document.getElementById("contourDataTip")
        if (dv != undefined) {
            // @ts-expect-error TS(2552): Cannot find name 'Frm_Print'. Did you mean 'frmPri... Remove this comment to see the full error message
            Frm_Print.removeChild(dv);
        }
        atp.DotMap_Temp.DotMapTempResetF = true;
        atp.frmPrint_Temp.PrintMouseMode = enmPrintMouseMode.Normal;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if (attrData.TotalData.LV1.Print_Mode_Total == enmTotalMode_Number.SeriesMode) {
            atp.Series_temp.Koma = 0;
        }
        // @ts-expect-error TS(2552): Cannot find name 'Frm_Print'. Did you mean 'frmPri... Remove this comment to see the full error message
        Frm_Print.backImageButton.btnDisabled((attrData.TotalData.ViewStyle.Zahyo.Mode != enmZahyo_mode_info.Zahyo_Ido_Keido));
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        propertyWindow.fixed = false;
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        propertyWindow.style.borderWidth = '1px';
        this.printMapScreen(picMap) ;
    }
    /**
 * Description placeholder
 *
 * @static
 * @param {*} picMap 
 */
static printMapScreen(picMap: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let avs=attrData.TotalData.ViewStyle.ScrData;
        let g = picMap.getContext('2d');
        g.save();
        g.clearRect(0, 0, avs.frmPrint_FormSize.width(), avs.frmPrint_FormSize.height());

        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if (attrData.TotalData.LV1.Print_Mode_Total == enmTotalMode_Number.SeriesMode) {
            // @ts-expect-error TS(2552): Cannot find name 'Frm_Print'. Did you mean 'frmPri... Remove this comment to see the full error message
            Frm_Print.seriesNextButton.btnDisabled(false);
            // @ts-expect-error TS(2552): Cannot find name 'Frm_Print'. Did you mean 'frmPri... Remove this comment to see the full error message
            Frm_Print.seriesBeforeButton.btnDisabled(false);
            clsPrint.Series_Mapping(g);
        } else {
            // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
            Frm_Print.seriesNextButton.btnDisabled(true);
            // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
            Frm_Print.seriesBeforeButton.btnDisabled(true);
            clsPrint.printMap(g);
        }
        g.restore();
    }

    /**
 * Description placeholder
 *
 * @static
 * @param {*} g 
 */
static Series_Mapping(g: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.TempData.ContourMode_Temp.ContourDataResetF = true;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.TempData.DotMap_Temp.DotMapTempResetF = true;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let n = attrData.TotalData.TotalMode.Series.SelectedIndex;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let koma = attrData.TempData.Series_temp.Koma;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let atsd = attrData.TotalData.TotalMode.Series.DataSet[n];
        if (atsd.DataItem.length == 0) {
            return;
        }
        let atsdi = atsd.DataItem[koma];
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.TotalData.LV1.Print_Mode_Total = atsdi.Print_Mode_Total;
        let ttl;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[atsdi.Layer];
        switch (atsdi.Print_Mode_Total) {
            case enmTotalMode_Number.DataViewMode: {
                let o_p_m_l = al.Print_Mode_Layer;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let O_L = attrData.TotalData.LV1.SelectedLayer;
                al.Print_Mode_Layer = atsdi.Print_Mode_Layer;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.TotalData.LV1.SelectedLayer = atsdi.Layer;
                switch (atsdi.Print_Mode_Layer) {
                    case enmLayerMode_Number.SoloMode: {
                        let O_L_Datn = al.atrData.SelectedIndex;
                        al.atrData.SelectedIndex = atsdi.Data;
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        let md = attrData.getSoloMode(atsdi.Layer, atsdi.Data);
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        attrData.setSoloMode(atsdi.Layer, atsdi.Data,atsdi.SoloMode); 
                        this.printMap(g);
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        ttl = attrData.Get_DataTitle(atsdi.Layer, atsdi.Data, false);
                        al.atrData.SelectedIndex = O_L_Datn;
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        attrData.setSoloMode(atsdi.Layer, atsdi.Data,md) ;
                        break;
                    }
                    case enmLayerMode_Number.GraphMode: {
                        let o_m_d = al.LayerModeViewSettings.GraphMode.SelectedIndex;
                        al.LayerModeViewSettings.GraphMode.SelectedIndex = atsdi.Data;
                        this.printMap(g);
                        ttl = al.LayerModeViewSettings.GraphMode.DataSet[atsdi.Data].title;
                        al.LayerModeViewSettings.GraphMode.SelectedIndex = o_m_d;
                        break;
                    }
                    case enmLayerMode_Number.LabelMode: {
                        let o_m_d = al.LayerModeViewSettings.LabelMode.SelectedIndex;
                        al.LayerModeViewSettings.LabelMode.SelectedIndex = atsdi.Data;
                        this.printMap(g);
                        ttl = al.LayerModeViewSettings.LabelMode.DataSet[atsdi.Data].title;
                        al.LayerModeViewSettings.LabelMode.SelectedIndex = o_m_d;
                        break;
                    }
                    case enmLayerMode_Number.TripMode: {
                        break;
                    }
                }
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.TotalData.LV1.SelectedLayer = O_L;
                al.Print_Mode_Layer = o_p_m_l;
                break;
            }
            case enmTotalMode_Number.OverLayMode: {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let O_O = attrData.TotalData.TotalMode.OverLay.SelectedIndex;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.TotalData.TotalMode.OverLay.SelectedIndex = atsdi.Data;
                this.printMap(g);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                ttl = attrData.TotalData.TotalMode.OverLay.DataSet[atsdi.Data].title;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.TotalData.TotalMode.OverLay.SelectedIndex = O_O;
                break;
            }
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.TempData.Series_temp.title = ttl;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.TotalData.LV1.Print_Mode_Total = enmTotalMode_Number.SeriesMode;
    }

    /**
 * Description placeholder
 *
 * @static
 * @param {*} g 
 */
static printMap(g: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.TotalData.ViewStyle.ScrData.Set_PictureBox_and_CulculateMul(Frm_Print.picMap)
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.TempData.OverLay_Temp.OverLay_Printing_Flag = false;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        let ca;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        switch (attrData.TotalData.LV1.Print_Mode_Total) {
            case enmTotalMode_Number.DataViewMode: {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                switch (attrData.LayerData[Layernum].Print_Mode_Layer) {
                    case enmLayerMode_Number.SoloMode: {
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        ca = attrData.Get_SelectedDataTitle();
                        break;
                    }
                    case enmLayerMode_Number.GraphMode: {
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        ca=attrData.nowGraph().title;
                        break;
                    }
                    case enmLayerMode_Number.LabelMode: {
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        ca=attrData.nowLabel().title;
                        break;
                    }
                    case enmLayerMode_Number.TripMode: {
                        break;
                    }
                }
                break;
            }
            case enmTotalMode_Number.OverLayMode: {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.TempData.OverLay_Temp.OverLay_Printing_Flag = true;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let ov = attrData.TotalData.TotalMode.OverLay;
                ca = ov.DataSet[ov.SelectedIndex].title;
                break;
            }
        }
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        Frm_Print.setTitle(ca);
        clsPrint.showMap(g);
    }

    /**
 * Description placeholder
 *
 * @static
 * @param {*} g 
 */
static showMap(g: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let av=attrData.TotalData.ViewStyle;
        let avs=av.ScrData;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.TempData.drawing=true;
        avs.SampleBoxFlag = false;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.ResetMPSubLineXY();
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.ResetObjectPrintedCheckFlag();
        g.globalCompositeOperation = "source-over";
        let avb = av.SouByou;
        if ((avb.Auto == true) || ((avb.ThinningPrint_F == true) && (avb.PointInterval != 0)) || ((avb.LoopAreaF == true) || (avb.LoopSize != 0))) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.check_AutoSoubyou_Enable();
        }
        if (avb.Auto == true) {
            let avss = av.ScrData.ScrRectangle;
            //ラインのポイント自動間引き用に画面の対角線の距離を取得（座標系設定ありの場合）
            let D;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if (attrData.TotalData.ViewStyle.Zahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido) {
                // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                D = spatial.Distance_Ido_Kedo_XY_Point(new point(avss.left, avss.top), new point(avss.right, avss.bottom), av.Zahyo);
            } else {
                D = spatial.Distance(avss.left, avss.top, avss.right, avss.bottom);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                D /= attrData.SetMapFile("").Map.SCL;
            }
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.TempData.SoubyouLinePointIntervalCriteria = D * 0.001 * attrData.TotalData.ViewStyle.SouByou.AutoDegree;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.TempData.SoubyouLoopAreaCriteria = (attrData.TempData.SoubyouLinePointIntervalCriteria) ** 2;
        }
        this.Screen_Area_Back(g);
        g.beginPath();
        if(avs.Screen_Margin.ClipF == true) {//地図領域クリッピング
            g.save();
            let marginRect = avs.getSXSY_Margin();
            g.rect(marginRect.left,marginRect.top,marginRect.width(),marginRect.height());
            g.clip("evenodd");

        }
        this.Screen_Back_ObjectInner_Set(g);

        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if (attrData.TotalData.TotalMode.OverLay.Always_Overlay_Index != -1) {
            this.OverLay_Plus_Print(g);
        } else {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            switch (attrData.TotalData.LV1.Print_Mode_Total) {
                case enmTotalMode_Number.DataViewMode: {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let Layernum = attrData.TotalData.LV1.SelectedLayer;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    switch (attrData.LayerData[Layernum].Print_Mode_Layer) {
                        case enmLayerMode_Number.SoloMode: {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            switch (attrData.getSoloMode(Layernum, DataNum)) {
                                case enmSoloMode_Number.ClassPaintMode: {
                                    this.PrintClassPaintMode(g, Layernum, DataNum);
                                    break;
                                }
                                case enmSoloMode_Number.ClassMarkMode: {
                                    this.PrintClassMarkMode(g, Layernum, DataNum);
                                    break;
                                }
                                case enmSoloMode_Number.ClassODMode: {
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    if (attrData.LayerData[Layernum].Shape == enmShape.LineShape) {
                                        this.PrintClassLineShapeSENMode(g, Layernum, DataNum);
                                    } else {
                                        this.PrintClassODMode(g, Layernum, DataNum);
                                    }
                                    break;
                                }
                                case enmSoloMode_Number.MarkSizeMode: {
                                    this.PrintMarkSizeMode(g, Layernum, DataNum);
                                    break;
                                }
                                case enmSoloMode_Number.MarkBlockMode: {
                                    this.PrintMarkBlockMode(g, Layernum, DataNum);
                                    break;
                                }
                                case enmSoloMode_Number.MarkTurnMode: {
                                    break;
                                }
                                case enmSoloMode_Number.MarkBarMode: {
                                    this.PrintMarkBarMode(g, Layernum, DataNum);
                                    break;
                                }
                                case enmSoloMode_Number.ContourMode: {
                                    this.PrintContourMode(g, Layernum, DataNum);
                                    break;
                                }
                                case enmSoloMode_Number.StringMode: {
                                    this.PrintStringMode(g, Layernum, DataNum);
                                    break;
                                }
                            }
                            break;
                        }
                        case enmLayerMode_Number.GraphMode: {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            this.PrintGraphMode(g,  Layernum, attrData.layerGraph().SelectedIndex)
                            break;
                        }
                        case enmLayerMode_Number.LabelMode: {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            this.PrintLabelMode(g,  Layernum, attrData.layerLabel().SelectedIndex)
                            break;
                        }
                        case enmLayerMode_Number.TripMode: {
                            break;
                        }

                    }
                    break;
                }
                case enmTotalMode_Number.OverLayMode: {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    this.Print_OverLay(g, attrData.TotalData.TotalMode.OverLay.SelectedIndex);
                    break;
                }
            }
        }
        
        if(avs.Screen_Margin.ClipF == true) {
            g.restore();
        }
        let tilecanvas: any;
        let avt = av.TileMapView;
        if ((avt.Visible == true) && (avs.ThreeDMode.Set3D_F == false)) {
            //背景画像を表示
            if (avt.DrawTiming == enmDrawTiming.BeforeDataDraw) {
                this.Legend_Data_Set();
                this.Screen_MapAreaLine(g);
                this.GetAccessoryRectangles(g);
                this.Figure_Print(g, false);
            }
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.TempData.frmPrint_Temp.image = g.getImageData(0, 0, Frm_Print.picMap.width, Frm_Print.picMap.height);
            tilecanvas = document.createElement("canvas");
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            tilecanvas.width = attrData.TotalData.ViewStyle.ScrData.frmPrint_FormSize.width();
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            tilecanvas.height = attrData.TotalData.ViewStyle.ScrData.frmPrint_FormSize.height(); 
            tilecanvas.style.vivility=false;
            let tilecanvasg = tilecanvas.getContext('2d');
            // @ts-expect-error TS(2304): Cannot find name 'tileMapClass'.
            tileMapClass.drawTileMap(tilecanvasg, avt.TileMapDataSet, av.Zahyo, avs, 2, tileMapAcc);
        } else {
            //背景画像を表示しない
            this.Legend_Data_Set();
            this.Screen_MapAreaLine(g);
            this.GetAccessoryRectangles(g);
            this.Figure_Print(g, false);
            this.Screen_BackLine(g);
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.TempData.frmPrint_Temp.image = g.getImageData(0, 0, Frm_Print.picMap.width, Frm_Print.picMap.height);
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if (attrData.TempData.ModeValueInScreen_Stac.setF == true) {
            this.Restore_InScreenObjectData();
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.TempData.drawing = false;

        /**背景地図読み込み後に、背景を地図上に配置、最後に凡例等を描画 */
        function tileMapAcc() {

            switch (avt.DrawTiming) {
                case enmDrawTiming.BeforeDataDraw:
                    g.globalCompositeOperation = "destination-over";
                    break;
                case enmDrawTiming.AfterDataDraw:
                    g.globalCompositeOperation = "multiply";
                    break;
            }
            g.globalAlpha = avt.AlphaValue;
            let mgr;
            if (avs.Screen_Margin.ClipF == true) {
                mgr = avs.getSXSY_Margin();
            } else {
                // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                mgr = new rectangle(0, tilecanvas.width, 0, tilecanvas.height);
            }
            g.drawImage(tilecanvas, mgr.left, mgr.top, mgr.width(), mgr.height(), mgr.left, mgr.top, mgr.width(), mgr.height());
            g.globalAlpha = 1;
            g.globalCompositeOperation = "source-over";
            // @ts-expect-error TS(2304): Cannot find name 'tileMapClass'.
            tileMapClass.PrintCopyright(g, avt.TileMapDataSet, avs);

            switch (avt.DrawTiming) {
                case enmDrawTiming.BeforeDataDraw:
                    clsPrint.Screen_BackLine(g);
                    break;
                case enmDrawTiming.AfterDataDraw:
                    clsPrint.Legend_Data_Set();
                    clsPrint.Screen_MapAreaLine(g);
                    clsPrint.GetAccessoryRectangles(g);
                    clsPrint.Figure_Print(g, false);
                    clsPrint.Screen_BackLine(g);
                        break;
            }


            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.TempData.frmPrint_Temp.image = g.getImageData(0, 0, Frm_Print.picMap.width, Frm_Print.picMap.height);
        }
    }

    /** 最後に画面枠線を描く*/
    static Screen_BackLine(g: any){
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let av=attrData.TotalData.ViewStyle.ScrData;
        let rect  = av.getSxSyRect(av.ScrRectangle);
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let sv=attrData.TotalData.ViewStyle.Screen_Back;
        let penw  = av.Get_Length_On_Screen(sv.ScreenFrameLine.Width) % 2;
        penw = (penw==0) ? 1:penw;
        rect.inflate(-penw, -penw);
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.Draw_Tile_Box(g, rect, sv.ScreenFrameLine, clsBase.BlancTile(), 0)
    }

    /**複数のレイヤごとのポリゴンのクリッピング */
    static ClippingRegion_ObjectBoundary_set(g: any, Layers: any, RealObjClip_f: any, DummyClip_F: any) {
        let f = false;
        let Allpxy = [];
        let AllnPolyP = [];
        for (let i = 0; i < Layers.length; i++) {
            let badata = this.ContourPolygonRegion(Layers[i], RealObjClip_f, DummyClip_F);
            if (badata.Pon > 0) {
                let plusP=0;
                for (let j = 0; j < badata.Pon; j++) {
                    AllnPolyP.push(badata.nPolyP[j]);
                    plusP += badata.nPolyP[j];
                }
                for (let j = 0; j < plusP; j++) {
                    Allpxy.push(badata.pxy[j]);
                }
                f = true;
            }
        }
        if (f == true) {
            clsDraw.ClipPolyPolygon(g,Allpxy, AllnPolyP);
        }
        return f;
    }

    /**等値線モード他の背後のポリゴンのクリッピングリージョン作成、ポリゴン数を返す */
    static ContourPolygonRegion(Layernum: any, RealObjClip_f: any,DummyClip_F: any) {

        let MultiObj = [];
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[Layernum];

        let LT = al.Time;
        let Dummy_F;
        if ((al.Shape == enmShape.PolygonShape) && (RealObjClip_f == true) && (al.Type == enmLayerType.Normal)) {
            let ObjN = al.atrObject.ObjectNum;
            for (let i = 0; i < ObjN; i++) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                if (attrData.Check_screen_Kencode_In(Layernum, i) == true) {
                    MultiObj.push(i);
                }
            }
            Dummy_F = false;
        } else if (DummyClip_F == true) {
            for (let i = 0; i < al.Dummy.length; i++) {
                let c = al.Dummy[i].code
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                if ((al.MapFileData.MPObj[c].Shape == enmShape.PolygonShape) && (attrData.Check_Screen_Objcode_In(Layernum, c) == true)) {
                    MultiObj.push(c);
                }
            }
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let dobgRet = attrData.getDummyObjGroupArray(Layernum,enmShape.PolygonShape);
            if (dobgRet.trueNum > 0) {
                let alm = al.MapFileData;
                for (let j = 0; j < alm.Map.Kend; j++) {
                    if ((dobgRet.DummyOBGArray[alm.MPObj[j].Kind] == true) && (alm.MPObj[j].Shape == enmShape.PolygonShape)) {
                        if (alm.CheckEnableObject(alm.MPObj[j], LT) == true) {
                            MultiObj.push(j);
                        }
                    }
                }
            }
            Dummy_F = true;
        }
        if (MultiObj.length > 0) {
            return this.Get_Multi_Object_Boundary(Layernum,  MultiObj,Dummy_F);
        } else {
            return { Pon: 0 };
        }
    }


/**スクリーン、地図領域背景色 */
    static Screen_Area_Back(g: any){
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let av = attrData.TotalData.ViewStyle;
        let Scrrect  = av.ScrData.getSxSyRect(av.ScrData.ScrRectangle);
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.Draw_Tile_Box(g, Scrrect, clsBase.BlankLine(), av.Screen_Back.ScreenAreaBack, 0);
        let marginRect  = av.ScrData.getSXSY_Margin();
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.Draw_Tile_Box(g, marginRect, clsBase.BlankLine(), av.Screen_Back.MapAreaBack, 0);
    }

    /**経緯線（背面表示）とオブジェクト内部色設定 */
    static Screen_Back_ObjectInner_Set(g: any){
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let av = attrData.TotalData.ViewStyle;
        if((av.Zahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido) && (av.LatLonLine_Print.Order == enmLatLonLine_Order.Back) && (av.LatLonLine_Print.Visible == true)) {
           clsAccessory.LatLonLine_Print(g);
        }
        if(av.Screen_Back.ObjectInner.BlankF == false) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let lv1 = attrData.TotalData.LV1;
            if(lv1.Print_Mode_Total == enmTotalMode_Number.DataViewMode) {
                this.Screen_Back_Set_Paint(g, lv1.SelectedLayer);
            } else {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let n = attrData.TotalData.TotalMode.OverLay.SelectedIndex;
                let OvLay = [];
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let ds = attrData.TotalData.TotalMode.OverLay.DataSet[n];
                for (let i = 0; i < ds.DataItem.length; i++) {
                    for (let j = 0; j < ds.DataItem.length; j++) {
                        OvLay[ds.DataItem[j].Layer] = true;
                    }
                }
                for (let i = 0; i < lv1.Lay_Maxn; i++) {
                    if(OvLay[i] == true) {
                        this.Screen_Back_Set_Paint(g, i);
                    }
                }
            }
        }
    }
    
    /**オブジェクト内部の背景塗りつぶし*/
    static Screen_Back_Set_Paint(g: any,Layernum: any){

        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[Layernum];

        let MultiObj = [];
        for (let i = 0; i < al.Dummy.length; i++) {
            let c = al.Dummy[i].code;
            if ((al.MapFileData.MPObj[c].Shape == enmShape.PolygonShape) && (
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Check_Screen_Objcode_In(Layernum, c) == true)) {
                MultiObj.push(c);
            }
        }
        if (al.DummyGroup.length > 0) {
            for (let i = 0; i < al.DummyGroup.length; i++) {
                let ok = al.DummyGroup[i];
                if (al.MapFileData.ObjectKind[ok].Shape = enmShape.PolygonShape) {
                    let temp = al.MapFileData.Get_Objects_by_Group(ok, al.Time);
                    for (let j = 0; j < temp.length; j++) {
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        if (attrData.Check_Screen_Objcode_In(Layernum, temp[j]) == true) {
                            MultiObj.push(temp[j]);
                        }
                    }
                }
            }
        }
        let MbjN = MultiObj.length;
        if (MbjN > 0) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            this.PaintMultiPolygonObject(g, Layernum, MultiObj, attrData.TotalData.ViewStyle.Screen_Back.ObjectInner, true);
        }

        if (al.Shape == enmShape.PolygonShape) {
            MultiObj = [];
            for (let i = 0; i < al.atrObject.ObjectNum; i++) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                if (attrData.Check_screen_Kencode_In(Layernum, i) == true) {
                    MultiObj.push(i);
                }
            }
            MbjN = MultiObj.length;
            if (MbjN > 0) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                this.PaintMultiPolygonObject(g, Layernum, MultiObj, attrData.TotalData.ViewStyle.Screen_Back.ObjectInner, false);
            }
        }
    }

    /**複数オブジェクトにまとめて色塗り */
    static PaintMultiPolygonObject(g: any, Layernum: any,  MultiObj: any,TI: any,Dummy_F: any){
        let MbjN=MultiObj.length;
        if((MbjN == 0)||(TI.BlankF == true) ){
            return;
        }
        let Polydata  = this.Get_Multi_Object_Boundary(Layernum, MultiObj, Dummy_F);
        if(Polydata.Pon > 0 ){
            clsDraw.DrawPolyPolygon(g, Polydata, TI.Color.toRGBA());
        }
    }

    /**ポリゴンオブジェクトの周囲の線の座標を取得 */
    static Get_Multi_Object_Boundary(Layernum: any,  ObjCode: any, Dummy_F: any) {

        let ELine = this.Gey_Multi_Object_OuterLineCode(Layernum, ObjCode, Dummy_F);

        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let boundArrange = attrData.LayerData[Layernum].MapFileData.Boundary_Arrange_Sub(ELine);
        if (boundArrange.Pon <= 0) {
            return undefined;
        } else {
            let Polydata = this.Get_Boundary_XY(Layernum, boundArrange);
            return Polydata;
        }
    }

    /** 指定された複数のオブジェクトの外側のラインコードを取得*/
    static Gey_Multi_Object_OuterLineCode(Layernum: any, ObjCode: any, Dummy_F: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[Layernum];
        let ALineN = al.MapFileData.Map.ALIN;
        let Use_Line = new Array(ALineN);
        Use_Line.fill(0);
        for (let i = 0; i < ObjCode.length; i++) {
            let badata; //boundArrangeData
            if (Dummy_F == false) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                badata = attrData.Boundary_Kencode_Arrange(Layernum, ObjCode[i]);
            } else {
                badata = al.MapFileData.Boundary_Arrange(ObjCode[i], al.Time);
            }
            for (let j = 0; j < badata.Fringe.length; j++) {
                Use_Line[badata.Fringe[j].code]++;
            }
        }
        let ELine = [];
        for (let i = 0; i < ALineN; i++) {
            if (Use_Line[i] % 2 == 1) {
                // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
                let d = new EnableMPLine_Data();
                d.LineCode = i;
                ELine.push(d);
            }
        }
        return ELine;
    }

    /**階級区分モードの表示順序と表示の可否を返す */
    static getDrawOrder_and_ShowF_ClassMode(LayerNum: any, DataNum: any, Category_Array: any, D_Order: any, ShowF: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[LayerNum];
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let vs = attrData.TotalData.ViewStyle;
        let LayerShape = al.Shape;
        let Objn = al.atrObject.ObjectNum;
        let DrawOrderByValue;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if ((LayerShape == enmShape.PointShape) || (LayerShape == enmShape.LineShape)||(attrData.getSoloMode(LayerNum, DataNum)==enmSoloMode_Number.ClassMarkMode)) {
            DrawOrderByValue = this.ClassMode_Point_Shape_DrawOrder(LayerNum, DataNum);
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Missing_DataArray = attrData.Get_Missing_Value_DataArray(LayerNum, DataNum);

        let PointLayerMark = al.LayerModeViewSettings.PointLineShape.PointMark;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let pointR = attrData.Radius(PointLayerMark.WordFont.Size, 1, 1);
        for (let i = 0; i < Objn; i++) {
            let dod;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if ((LayerShape == enmShape.PointShape) || (LayerShape == enmShape.LineShape)||(attrData.getSoloMode(LayerNum, DataNum)==enmSoloMode_Number.ClassMarkMode)) {
                switch (vs.PointPaint_Order) {
                    case enmPointOnjectDrawOrder.ObjectOrder:
                        dod = i;
                        break;
                    case enmPointOnjectDrawOrder.LowerToUpperCategory:
                        if (al.atrData.Data[DataNum].DataType == enmAttDataType.Normal) {
                            dod = DrawOrderByValue.DataPosition(i);
                        } else {
                            dod = DrawOrderByValue.DataPositionRev(i);
                        }
                        
                        break;
                    case enmPointOnjectDrawOrder.UpperToLowerCategory:
                        if (al.atrData.Data[DataNum].DataType == enmAttDataType.Normal) {
                            dod = DrawOrderByValue.DataPositionRev(i);
                        } else {
                            dod = DrawOrderByValue.DataPosition(i);
                        }
                        break;
                }
            } else {
                dod = i;
            }
            D_Order[i] = dod;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if ((attrData.Check_Condition(LayerNum, dod) == true) && ((Missing_DataArray[dod] == false) || (vs.Missing_Data.Print_Flag == true))) {
                switch (LayerShape) {
                    case enmShape.PointShape:{
                        let CP = al.atrObject.atrObjectData[dod].Symbol;
                        let OP = vs.ScrData.Get_SxSy_With_3D(CP);
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        ShowF[dod] = attrData.Check_Screen_In(OP, pointR);
                        break;
                    }
                    case enmShape.LineShape:
                    case enmShape.PolygonShape:
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        ShowF[dod] = attrData.Check_screen_Kencode_In(LayerNum, dod);
                        break;
                }
            }
        }
        
        if (vs.MapLegend.Base.ModeValueInScreenFlag == true) {
            Category_Array.length = 0;
            this.get_InScreenObjectData( LayerNum, DataNum, ShowF);
            for (let i = 0; i < Objn; i++) {
                if (ShowF[i] == true) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    Category_Array[i] = attrData.Get_Categoly(LayerNum, DataNum, i);
                }
            }
        } else {
            for (let i = 0; i < Objn; i++) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                Category_Array[i]=attrData.Get_Categoly(LayerNum, DataNum, i);
            }
        }

    }


    /**表示範囲のデータで階級区分などを設定 */
    static get_InScreenObjectData(LayerNum: any ,  DataNum: any ,  ShowF: any){

        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if (attrData.TempData.OverLay_Temp.OverLay_Printing_Flag == true) {
            return;
        }

        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[LayerNum];
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Missing_DataArray = attrData.Get_Missing_Value_DataArray(LayerNum, DataNum);
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let MV_Array = attrData.Get_Data_Cell_Array_With_MissingValue(LayerNum, DataNum);
        let Objn = al.atrObject.ObjectNum;
        let inObjN = 0;
        let Add = 0;
        let Add2 = 0;
        let BeforeDecimal = 0;
        let AfterDecimal = 0;
        let inObjectList = new Array(Objn);

        let ald = al.atrData.Data[DataNum];
        let alds = ald.SoloModeViewSettings;
        let maxV = ald.Statistics.Min;
        let minV = ald.Statistics.Max;
        let div_num = ald.SoloModeViewSettings.Div_Num;
        let divMethos = ald.SoloModeViewSettings.Div_Method;

        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let atm = attrData.TempData.ModeValueInScreen_Stac;
        atm.LayerNum = LayerNum;
        atm.DataNum = DataNum;
        atm.divValue = new Array(div_num);
        for (let i = 0; i < div_num; i++) {
            atm.divValue[i] = alds.Class_Div[i].Value
        }
        atm.MarkSize_MaxValueMode = alds.MarkSizeMD.MaxValueMode;
        atm.MarkSize_MaxValue = alds.MarkSizeMD.MaxValue;
        atm.MarkBar_MaxValueMode = alds.MarkBarMD.MaxValueMode;
        atm.MarkBar_MaxValue = alds.MarkBarMD.MaxValue;


        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let SortV = new clsSortingSearch();
        for (let i = 0; i < Objn; i++) {
            if ((ShowF[i] == true) && (Missing_DataArray[i] == false)) {
                let v = MV_Array[i];
                SortV.Add(v);
                inObjectList[inObjN] = i;
                Add += v;
                Add2 += +v * v;
                maxV = Math.max(maxV, v);
                minV = Math.min(minV, v);
                let retv = Generic.Figure_Arrange(v);
                BeforeDecimal = Math.max(BeforeDecimal, retv.BeforeDecimal);
                AfterDecimal = Math.max(AfterDecimal, retv.AfterDecimal);
                inObjN++;
            }
        }
        SortV.AddEnd();
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let md = attrData.getSoloMode(LayerNum, DataNum);
        switch (md) {
            case enmSoloMode_Number.ClassPaintMode:
            case enmSoloMode_Number.ClassMarkMode:
            case enmSoloMode_Number.ClassODMode: {
                if (md == enmSoloMode_Number.ClassODMode) {
                    if (al.Shape != enmShape.LineShape) {
                        return;
                    }
                }
                let Ave = Add / inObjN;
                let sa = maxV - minV;
                let STD = Math.sqrt(Add2 / inObjN - Ave * Ave);
                let Div_Value = [];
                switch (divMethos) {
                    case enmDivisionMethod.Free:
                        return;
                        break;
                    case enmDivisionMethod.Quantile: { //分位数
                        let divvStp = SortV.NumofData() / div_num;
                        let i = 0;
                        let divv = divvStp;
                        do {
                            Div_Value[i] = SortV.DataPositionRevValue(Math.floor(divv) - 1);
                            divv += divvStp;
                            i++;
                        } while (divv < SortV.NumofData())
                        break;
                    }
                    case enmDivisionMethod.AreaQuantile: {
                        //面積分位数
                        let Mense = [];
                        let AddMense = 0
                        for (let i = 0; i < inObjN; i++) {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            Mense[i] = attrData.GetObjMenseki(LayerNum, inObjectList[i]);
                            AddMense += Mense[i];
                        }
                        let n = 0;

                        let Addv = 0;
                        let divvStp = AddMense / div_num;
                        let divv = divvStp;
                        for (let i = 0; i < SortV.NumofData; i++) {
                            let j = SortV.DataPositionRev(i);
                            Addv += Mense[j];
                            if (Addv >= divv) {
                                Div_Value[n] = SortV.DataPositionRevValue(i);
                                divv += divvStp;
                                n++;
                                Addv -= Mense[j];
                                i--;
                            }
                        }
                        break;
                    }
                    case enmDivisionMethod.StandardDeviation: { //標準偏差
                        if (inObjN > 1) {
                            Div_Value[0] = Ave + STD;
                            Div_Value[1] = Ave + STD / 2;
                            Div_Value[2] = Ave;
                            Div_Value[3] = Ave - STD / 2;
                            Div_Value[4] = Ave - STD;
                        }
                        for (let i = 0; i < 4; i++) {
                            Div_Value[i] = Number(Generic.Figure_Using(Div_Value[i], AfterDecimal + 1));
                        }
                        break;
                    }
                    case enmDivisionMethod.EqualInterval: { //等間隔
                        let a = sa / div_num;
                        for (let i = 0; i < div_num; i++) {
                            Div_Value[i] = maxV - a * (i + 1);
                        }
                        for (let i = 0; i < div_num; i++) {
                            Div_Value[i] = Number(Generic.Figure_Using(Div_Value[i], AfterDecimal + 1));
                        }
                        break;
                    }
                }
                for (let i = 0; i < div_num; i++) {
                    alds.Class_Div[i].Value = Div_Value[i];
                }
                atm.setF = true;
                break;
            }
            case enmSoloMode_Number.MarkSizeMode: {
                alds.MarkSizeMD.MaxValueMode = enmMarkSizeValueMode.UserDefinition;
                alds.MarkSizeMD.MaxValue = maxV;
                atm.setF = true;
                break;
            }
            case enmSoloMode_Number.MarkBarMode: {
                alds.MarkBarMD.MaxValueMode = enmMarkSizeValueMode.UserDefinition;
                alds.MarkBarMD.MaxValue = maxV;
                atm.setF = true;
                break;
            }
        }
    }

    /**
 * Description placeholder
 *
 * @static
 */
static Restore_InScreenObjectData(){
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let atc = attrData.TempData.ModeValueInScreen_Stac;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[atc.LayerNum];
        let ald = al.atrData.Data[atc.DataNum].SoloModeViewSettings;
        for (let i = 0; i < atc.divValue.length; i++) {
            ald.Class_Div[i].Value = atc.divValue[i];
        }
        ald.MarkSizeMD.MaxValueMode = atc.MarkSize_MaxValueMode;
        ald.MarkSizeMD.MaxValue = atc.MarkSize_MaxValue;
        ald.MarkBarMD.MaxValueMode = atc.MarkBar_MaxValueMode;
        ald.MarkBarMD.MaxValue = atc.MarkBar_MaxValue;
        atc.setF = false;
    }

    /**  記号モードの表示順序と表示の可否を返す*/
    static getDrawOrder_and_ShowF_MarkMode(LayerNum: any , DataNum: any ,mode: any , D_Order: any , ShowF: any , ObjP: any , Missing_DataArray: any , MV_Array: any ){
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[LayerNum];
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let vs = attrData.TotalData.ViewStyle;
        let LayerShape = al.Shape;
        let Objn = al.atrObject.ObjectNum;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Missing_DataArraySub = attrData.Get_Missing_Value_DataArray(LayerNum, DataNum);
        for (let i in Missing_DataArraySub) {
            Missing_DataArray[i] = Missing_DataArraySub[i];
        }
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let MK_Order = new clsSortingSearch();
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let MV_ArraySub = attrData.Get_Data_Cell_Array_With_MissingValue(LayerNum, DataNum);
        for (let i in MV_ArraySub) {
            MV_Array[i] = MV_ArraySub[i];
        }
        for (let i = 0; i < Objn; i++) {
            let CP = al.atrObject.atrObjectData[i].Symbol;
            ObjP[i] = vs.ScrData.Get_SxSy_With_3D(CP);
        }
        switch (mode) {
            case enmSoloMode_Number.MarkSizeMode:
                for (let i = 0; i < Objn; i++) {
                    MK_Order.Add(Math.abs(MV_Array[i]));
                }
                MK_Order.AddEnd()
                break;
            case enmSoloMode_Number.MarkBarMode:
                for (let i = 0; i < Objn; i++) {
                    MK_Order.Add(ObjP[i].y)
                }
                MK_Order.AddEnd()
                break;
        }

        let misR;
        let normR;
        let normSize;
        let maxv;
        switch (mode) {
            case enmSoloMode_Number.MarkSizeMode:
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                misR = attrData.Radius(vs.Missing_Data.Mark.WordFont.Size, 1, 1);
                normR = al.atrData.Data[DataNum].SoloModeViewSettings.MarkSizeMD.Mark.WordFont.Size;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                maxv = Math.max(Math.abs(attrData.Get_DataMax(LayerNum, DataNum)), Math.abs(attrData.Get_DataMin(LayerNum, DataNum)));
                break;
            case enmSoloMode_Number.MarkBarMode:
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                misR = attrData.Radius(vs.Missing_Data.MarkBar.WordFont.Size, 1, 1);
                let alm = al.atrData.Data[DataNum].SoloModeViewSettings.MarkBarMD;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let w = attrData.Get_Length_On_Screen(alm.Width);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let h = attrData.Get_Length_On_Screen(alm.MaxHeight);
                let wThree = 0;
                if (alm.ThreeD == true) {
                    wThree = Math.floor(w / 3);
                }
                // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                normSize = new size(w + wThree, h + wThree);
                break;
            case enmSoloMode_Number.MarkTurnMode:
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                misR = attrData.Radius(vs.Missing_Data.TurnMark.WordFont.Size, 1, 1);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                normR = attrData.Radius(al.atrData.Data[DataNum].SoloModeViewSettings.MarkTurnMD.Mark.WordFont.Size, 1, 1);
                break;
            case enmSoloMode_Number.MarkBlockMode:
                break;
        }


        for (let i = 0; i < Objn; i++) {
            let dod;
            switch (mode) {
                case enmSoloMode_Number.MarkSizeMode:
                    dod = MK_Order.DataPositionRev(i);
                    break;
                case enmSoloMode_Number.MarkBarMode:
                    dod = MK_Order.DataPosition(i);
                    break;
                case enmSoloMode_Number.MarkTurnMode:
                    dod = i;
                    break;
                case enmSoloMode_Number.MarkBlockMode:
                    break;
            }
            D_Order[i] = dod;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if ((attrData.Check_Condition(LayerNum, dod) == true) && ((
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                (Missing_DataArray[dod] == false) || (attrData.TotalData.ViewStyle.Missing_Data.Print_Flag == true)))) {
                let scinf = false;
                switch (mode) {
                    case enmSoloMode_Number.MarkSizeMode:
                        switch (LayerShape) {
                            case enmShape.PointShape:
                            case enmShape.PolygonShape:
                                if (Missing_DataArray[dod] == true) {
                                    ObjP[dod] = this.getOverlayMarkPosition(ObjP[dod], misR)
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    scinf = attrData.Check_Screen_In(ObjP[dod], misR)
                                } else {
                                    if (MV_Array[dod] != 0) {
                                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                        let r = attrData.Radius(normR, Math.abs(MV_Array[dod]), maxv)
                                        ObjP[dod] = this.getOverlayMarkPosition(ObjP[dod], r)
                                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                        scinf = attrData.Check_Screen_In(ObjP[dod], r);
                                    }
                                }
                                break;
                            case enmShape.LineShape:
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                scinf = attrData.Check_screen_Kencode_In(LayerNum, dod)
                                break;
                        }
                        break;
                    case enmSoloMode_Number.MarkBarMode:
                        if (MV_Array[dod] > 0) {
                            if (Missing_DataArray[dod] == true) {
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                scinf = attrData.Check_Screen_In(ObjP[dod], misR)
                            } else {
                                // @ts-expect-error TS(2554): Expected 4 arguments, but got 2.
                                let rect = new rectangle(new point(ObjP[dod].x - normSize.width / 2, ObjP[dod].y - normSize.height), normSize);
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                scinf = attrData.Check_Screen_In(rect);
                            }
                        }
                        break;
                    case enmSoloMode_Number.MarkTurnMode:
                        if (Missing_DataArray[dod] == true) {
                            ObjP[dod] = this.getOverlayMarkPosition(ObjP[dod], misR);
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            scinf = attrData.Check_Screen_In(ObjP[dod], misR);
                        } else {
                            ObjP[dod] = this.getOverlayMarkPosition(ObjP[dod], normR);
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            scinf = attrData.Check_Screen_In(ObjP[dod], normR);
                        }
                        break;
                }
                ShowF[dod] = scinf;
            }
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if (attrData.TotalData.ViewStyle.MapLegend.Base.ModeValueInScreenFlag == true) {
            if ((mode = enmSoloMode_Number.MarkSizeMode) || (mode = enmSoloMode_Number.MarkBarMode)) {
                this.get_InScreenObjectData(LayerNum, DataNum, ShowF);
            }
        }

    }


    /**記号の大きさ、階級記号、記号の回転モードの重ね合わせの際の記号表示位置の移動*/
    static getOverlayMarkPosition(OP: any, r: any) {
        let newP = OP.Clone();
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let ato = attrData.TempData.OverLay_Temp;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if ((ato.OverLay_Printing_Flag == true) && (attrData.TotalData.TotalMode.OverLay.MarkModePosFixFlag == false)) {
            if (ato.OverLay_EMode_N >= 2) {
                newP.x += ((ato.OverLay_EMode_Now % 2) * 2 - 1) * r;
                if (ato.OverLay_EMode_N > 2) {
                    // '2つの場合はY座標変えず、3つ以上はずらす
                    // @ts-expect-error TS(2304): Cannot find name 'Meth'.
                    newP.y += ((Meth.floor(ato.OverLay_EMode_Now / 2)) * 2 - 1) * r;
                }
            }
        }
        return newP;
    }

    /**経緯線（前面表示）と地図領域の枠線 */
    static Screen_MapAreaLine(g: any){
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let av = attrData.TotalData.ViewStyle;
        if((av.Zahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido) && (av.LatLonLine_Print.Order == enmLatLonLine_Order.Front) && (av.LatLonLine_Print.Visible == true)) {
            clsAccessory.LatLonLine_Print(g);
        }

        let Lpat = av.Screen_Back.MapAreaFrameLine;
        if(Lpat.BlankF == false) {
            let marginRect = av.ScrData.getSXSY_Margin();
            // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
            let penw = parseInt(av.ScrData.Get_Length_On_Screen(Lpat.Width) / 2);
            if(penw == 0) {
                penw = 1;
            }
            marginRect.inflate(-penw, -penw);
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.Draw_Tile_Box(g, marginRect, Lpat, clsBase.BlancTile, 0);
        }
    }

    //飾りの外接四角形をまとめて記録
    /**
 * Description placeholder
 *
 * @static
 * @param {*} g 
 */
static GetAccessoryRectangles(g: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let at = attrData.TempData.Accessory_Temp;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let av = attrData.TotalData.ViewStyle;
        if(av.AttMapCompass.Visible == true) {
            at.MapCompass_Rect = clsAccessory.GetCompassRect(g);
        }
        if(av.MapTitle.Visible == true) {
            at.MapTitle_Rect = clsAccessory.GetTitleRect(g);
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let padw = attrData.Get_PaddingPixcel(av.MapTitle.Font.Back);
            at.MapTitle_Rect.inflate(padw, padw);
        }

        if(av.DataNote.Visible == true) {
            at.DataNote_Rect = clsAccessory.GetNoteRect(g);
            if(at.DataNote_Rect.width() != 0) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let padw = attrData.Get_PaddingPixcel(av.DataNote.Font.Back);
                at.DataNote_Rect.inflate(padw, padw);
            }
        }

        if(av.MapScale.Visible == true) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let padw = attrData.Get_PaddingPixcel(av.MapScale.Back);
            at.MapScale_Rect = clsAccessory.GetScaleRect(g);
            at.MapScale_Rect.inflate(padw, padw);
        }
        if((av.MapLegend.Base.Visible == true)|| (av.MapLegend.Line_DummyKind.Line_Visible == true)){
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            for (let i = 0; i < attrData.TempData.Accessory_Temp.Legend_No_Max; i++) {
                clsAccessory.Legend_print(g,  i, true);
            }
        }

        let Agb = av.AccessoryGroupBox;
        if(Agb.Visible == true) {
            let Rects = [];
               if((Agb.Title == true) && (at.MapTitle_Rect.width() != 0)&&(av.MapTitle.Visible ==true )){
                   Rects.push( at.MapTitle_Rect);
            }
               if((Agb.Scale == true) && (at.MapScale_Rect.width() != 0) && (av.MapScale.Visible ==true )){
                   Rects.push(at.MapScale_Rect);
            }
               if((Agb.Comapss == true) && (at.MapCompass_Rect.width() != 0) && (av.AttMapCompass.Visible == true)) {
                   Rects.push(at.MapCompass_Rect);
            }
               if((Agb.Note == true) && (at.DataNote_Rect.width() != 0) && (av.DataNote.Visible ==true )){
                   Rects.push(at.DataNote_Rect);
            }
            if((Agb.Legend == true) && (av.MapLegend.Base.Visible == true)) {
                for (let i = 0; i < at.Legend_No_Max; i++) {
                    Rects.push(at.MapLegend_W[i].Rect);
                }
            }
            let rect = Rects[0].Clone();
            for (let i = 1; i < Rects.length; i++) {
                rect = spatial.getCircumscribedRectangle(rect, Rects[i]);
            }
            at.GroupBox_Rect = rect;
        }
    }

    /**
 * Description placeholder
 *
 * @static
 * @param {*} g 
 * @param {*} back_gazo_f 
 */
static Figure_Print(g: any,  back_gazo_f: any) {
        if(back_gazo_f == false) {
            clsAccessory.AccGroupBoxDraw(g);
            clsAccessory.Scale_Print(g);
            clsAccessory.Note_Print(g);
            clsAccessory.Compass_print(g);
            clsAccessory.Title_Print(g);
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            for (let i = 0; i < attrData.TempData.Accessory_Temp.Legend_No_Max; i++) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                if(attrData.Check_Screen_In(attrData.TempData.Accessory_Temp.MapLegend_W[i].Rect) == true) {
                    clsAccessory.Legend_print(g, i, false);
                }
            }
        }
    }

    /**
 * Description placeholder
 *
 * @static
 * @param {*} InnerData 
 * @param {*} Layernum 
 * @returns {*} 
 */
static Legend_Mark_Mode_Inner_Data_set( InnerData: any, Layernum: any) {
        if(InnerData.Flag == false) {
            return undefined;
        }
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let mlw = new Legend2_Atri();
        mlw.DatN = InnerData.Data;
        mlw.Layn = Layernum;
        mlw.Print_Mode_Layer = enmLayerMode_Number.SoloMode;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        mlw.title = attrData.Get_DataTitle(Layernum, InnerData.Data, false);
        mlw.SoloMode = enmSoloMode_Number.ClassPaintMode;
        return mlw;
    }
    /**
 * Description placeholder
 *
 * @static
 */
static Legend_Data_Set() {
        let n = 0;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let at = attrData.TempData;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if(attrData.TotalData.TotalMode.OverLay.Always_Overlay_Index != -1) {

            at.Accessory_Temp.MapLegend_W.length = at.OverLay_Temp.Always_Ove_DataStac.length;
            for (let i = 0; i < at.OverLay_Temp.Always_Ove_DataStac.length; i++) {
                n=this.Legend_Data_Set_Over_sub(at.OverLay_Temp.Always_Ove_DataStac[i], n);
            }
        } else {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let Layernum = attrData.TotalData.LV1.SelectedLayer;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let Datanum = attrData.LayerData[Layernum].atrData.SelectedIndex;
            at.Accessory_Temp.MapLegend_W.length = 1;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            switch (attrData.TotalData.LV1.Print_Mode_Total) {
                case enmTotalMode_Number.DataViewMode:
                    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                    let atw = new Legend2_Atri();
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    switch (attrData.LayerData[Layernum].Print_Mode_Layer) {
                        case enmLayerMode_Number.SoloMode:
                            //単独・グラフモードの凡例設定
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            let att_Data = attrData.LayerData[Layernum].atrData.Data[Datanum];
                            atw.DatN = Datanum;
                            atw.Layn = Layernum;
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            atw.Print_Mode_Layer = attrData.LayerData[Layernum].Print_Mode_Layer;
                            atw.title = "";
                            atw.SoloMode = att_Data.ModeData;
                            switch (att_Data.ModeData) {
                                case enmSoloMode_Number.MarkSizeMode:
                                case enmSoloMode_Number.MarkBlockMode:
                                case enmSoloMode_Number.MarkTurnMode:
                                case enmSoloMode_Number.MarkBarMode:
                                case enmSoloMode_Number.StringMode: {
                                    // @ts-expect-error TS(2554): Expected 2 arguments, but got 3.
                                    let lwl=this.Legend_Mark_Mode_Inner_Data_set(att_Data.SoloModeViewSettings.MarkCommon.Inner_Data, Layernum, Datanum);
                                    if(lwl != undefined) {
                                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                        atw.title = attrData.Get_DataTitle(Layernum, Datanum, false);
                                        at.Accessory_Temp.MapLegend_W[1] = lwl;
                                        n++;
                                    }
                                    break;
                                }
                                case enmSoloMode_Number.ClassMarkMode: {
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    let lwl = this.Legend_Mark_Mode_Inner_Data_set(attrData.LayerData[Layernum].atrData.Data[Datanum].SoloModeViewSettings.ClassMarkMD,
                                        // @ts-expect-error TS(2554): Expected 2 arguments, but got 3.
                                        Layernum, Datanum);
                                    if(lwl != undefined) {
                                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                        atw.title = attrData.Get_DataTitle(Layernum, Datanum, false);
                                        at.Accessory_Temp.MapLegend_W[1] = lwl;
                                        n++;
                                    }
                                    break;
                                }
                            }
                            n++;
                            break;
                        case enmLayerMode_Number.GraphMode:
                            //グラフモード
                            atw.Layn = Layernum;
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            atw.Print_Mode_Layer = attrData.LayerData[Layernum].Print_Mode_Layer;
                            atw.title = "";
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            atw.DatN = attrData.layerGraph().SelectedIndex;
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            atw.GraphMode = attrData.nowGraph().GraphMode;
                            n++;
                            break;
                        case enmLayerMode_Number.LabelMode:
                            break;
                        case enmLayerMode_Number.TripMode:
                            //移動表示モード

                            break;
                        // @ts-expect-error TS(2304): Cannot find name 'enmTripMode'.
                        case enmTripMode.TripLayerDataMode:

                            break;
                    }
                    at.Accessory_Temp.MapLegend_W[0] = atw;
                    break;
                case enmTotalMode_Number.OverLayMode:
                    //重ね合わせモード凡例の設定
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let ato = attrData.TotalData.TotalMode.OverLay;
                    let atod = ato.DataSet[ato.SelectedIndex];
                    at.Accessory_Temp.MapLegend_W.length = atod.DataItem.length;
                    for (let i = 0; i < atod.DataItem.length; i++) {
                        n = this.Legend_Data_Set_Over_sub(atod.DataItem[i], n);
                    }
                    break;
            }
        }

        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let av = attrData.TotalData.ViewStyle;
        let am = av.MapLegend;
        for (let i = 0; i < n; i++) {
            let atw = at.Accessory_Temp.MapLegend_W[i];
            atw.LineKind_Flag = false;
            atw.PointObject_Flag = false;
        }
        if(am.Line_DummyKind.Line_Visible == true) {
            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
            let atw=new Legend2_Atri(); 
            atw.LineKind_Flag = true;
            atw.PointObject_Flag = false;
            at.Accessory_Temp.MapLegend_W[n]=atw;
            n++;
        }
        if(am.Line_DummyKind.Dummy_Point_Visible == true) {
            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
            let atw=new Legend2_Atri(); 
            atw.LineKind_Flag = false;
            atw.PointObject_Flag = true;
            at.Accessory_Temp.MapLegend_W[n]=atw;
            n++;
        }

        if(n > am.Base.Legend_Num) {
            let oldn= am.Base.Legend_Num;
            am.Base.Legend_Num = n
            am.Base.LegendXY.length = n;
            for (let i = oldn; i < n; i++) {
                let avs = av.ScrData;
                let amb = am.Base;
                if(avs.Accessory_Base == enmBasePosition.Screen) {
                    amb.LegendXY[i] = amb.LegendXY[i - 1].Clone();
                    amb.LegendXY[i].offset(0.05, 0.05);
                    if(amb.LegendXY[i].x >= 0.98) {
                        amb.LegendXY[i].x = amb.LegendXY[i - 1].x;
                    }
                    if(amb.LegendXY[i].y >= 0.98) {
                        amb.LegendXY[i].y = amb.LegendXY[i - 1].y;
                    }
                } else {
                    let Mprect = avs.MapRectangle;
                    let ScrRect = avs.ScrRectangle;
                    amb.LegendXY[i] = amb.LegendXY[i - 1].Clone();
                    amb.LegendXY[i].offset(Mprect.width() * 0.05, Mprect.Height* 0.05);
                    if(amb.LegendXY[i].x > ScrRect.right) {
                        amb.LegendXY[i].x = amb.LegendXY[i - 1].x;
                    }
                    if(amb.LegendXY[i].y > ScrRect.bottom) {
                        amb.LegendXY[i].y = amb.LegendXY[i - 1].y;
                    }
                }
            }
        }
        at.Accessory_Temp.Legend_No_Max = n;
    }

    /**重ね合わせモードのデータセット内の表示項目ごとの凡例セット */
    static Legend_Data_Set_Over_sub(Over_D: any, orn: any) {
        let n = orn;
        let L = Over_D.Layer;
        switch (Over_D.Print_Mode_Layer) {
            case enmLayerMode_Number.SoloMode: {
                let dt = Over_D.DataNumber;
                if (Over_D.Legend_Print_Flag == true) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let OVerData = attrData.LayerData[L].atrData.Data[dt];
                    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                    let atm = new Legend2_Atri();
                    atm.DatN = Over_D.DataNumber;
                    atm.Layn = L;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    atm.title = attrData.Get_DataTitle(L, dt, false);
                    atm.Print_Mode_Layer = enmLayerMode_Number.SoloMode;
                    if (Over_D.Mode == enmSoloMode_Number.ContourMode) {
                        if(OVerData.SoloModeViewSettings.ContourMD.Interval_Mode==enmContourIntervalMode.ClassPaint){
                            atm.SoloMode = enmSoloMode_Number.ClassPaintMode;
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            attrData.TempData.Accessory_Temp.MapLegend_W[n]=atm;
                        }else{
                            n--;
                        }
                    } else {
                        atm.SoloMode = Over_D.Mode;
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        attrData.TempData.Accessory_Temp.MapLegend_W[n]=atm;
                        let lwl;
                        switch (OVerData.ModeData) {
                            case enmSoloMode_Number.MarkSizeMode:
                            case enmSoloMode_Number.MarkBlockMode:
                            case enmSoloMode_Number.MarkTurnMode:
                            case enmSoloMode_Number.MarkBarMode:
                            case enmSoloMode_Number.StringMode:
                                 // @ts-expect-error TS(2554): Expected 2 arguments, but got 3.
                                 lwl = this.Legend_Mark_Mode_Inner_Data_set(OVerData.SoloModeViewSettings.MarkCommon.Inner_Data, L, atm.DatN);
                                break;
                            case enmSoloMode_Number.ClassMarkMode:
                                 // @ts-expect-error TS(2554): Expected 2 arguments, but got 3.
                                 lwl = this.Legend_Mark_Mode_Inner_Data_set(OVerData.SoloModeViewSettings.ClassMarkMD, L, atm.DatN);
                                break;
                        }
                        if (lwl != undefined) {
                            n++;
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            attrData.TempData.Accessory_Temp.MapLegend_W[n] = lwl;
                        }
                    }
                    n++;
                }
                break;
            }
            case enmLayerMode_Number.GraphMode: {
                if (Over_D.Legend_Print_Flag == true) {
                    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                    let atm2 = new Legend2_Atri();;
                    atm2.DatN = Over_D.DataNumber;
                    atm2.Layn = L;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    atm2.GraphMode = attrData.LayerData[L].LayerModeViewSettings.GraphMode.DataSet[atm2.DatN].GraphMode;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    atm2.title = attrData.LayerData[L].LayerModeViewSettings.GraphMode.DataSet[atm2.DatN].title;
                    atm2.Print_Mode_Layer = enmLayerMode_Number.GraphMode;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.TempData.Accessory_Temp.MapLegend_W[n]=atm2;
                    n++;
                }
                break;
            }
            case enmLayerMode_Number.LabelMode:
                break;
            case enmLayerMode_Number.TripMode:
                break;
        }
        return n;
    }

    /**重ね合わせ表示モード */
    static Print_OverLay(g: any, DataSet: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let aot = attrData.TempData.OverLay_Temp;
        aot.OverLay_Printing_Flag = true;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let aod = attrData.TotalData.TotalMode.OverLay.DataSet[DataSet];
        let Num = aod.DataItem.length;

        for (let i = 0; i < Num; i++) {
            aot.Printing_Number = i;
            let aodd = aod.DataItem[i];
            if(aodd.Print_Mode_Layer == enmLayerMode_Number.SoloMode){
                let Equal_Mode_N=0;
                for (let j = 0; j < Num; j++) {
                    if (i == j) {
                        aot.OverLay_EMode_Now = Equal_Mode_N;
                        Equal_Mode_N++;
                    } else {
                        let ovDataj = aod.DataItem[j];
                        if ((ovDataj.Print_Mode_Layer == enmLayerMode_Number.SoloMode) && (
                            ovDataj.Layer == aodd.Layer) && (ovDataj.Mode == aodd.Mode)) {
                            Equal_Mode_N++;
                        }
                    }
                }
                aot.OverLay_EMode_N = Equal_Mode_N;
            }
            this.OverLay_Print_Sub(g, aodd);
        }
        aot.OverLay_Printing_Flag = false;
    }

    /**
 * Description placeholder
 *
 * @static
 * @param {*} g 
 * @param {*} Ov_Data 
 */
static OverLay_Print_Sub(g: any, Ov_Data: any) {

        switch (Ov_Data.Print_Mode_Layer) {
            case enmLayerMode_Number.SoloMode: {
                switch (Ov_Data.Mode) {
                    case enmSoloMode_Number.ClassPaintMode:
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        attrData.ResetMPSubLineDrawn(attrData.LayerData[Ov_Data.Layer].MapFileName);
                        this.PrintClassPaintMode(g, Ov_Data.Layer, Ov_Data.DataNumber);
                        break;
                    case enmSoloMode_Number.MarkSizeMode:
                        this.PrintMarkSizeMode(g, Ov_Data.Layer, Ov_Data.DataNumber);
                        break;
                    case enmSoloMode_Number.MarkBlockMode:
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        attrData.TempData.DotMap_Temp.DotMapTempResetF = true;
                        this.PrintMarkBlockMode(g, Ov_Data.Layer, Ov_Data.DataNumber);
                        break;
                    case enmSoloMode_Number.ContourMode:
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        attrData.TempData.ContourMode_Temp.ContourDataResetF = true;
                        this.PrintContourMode(g, Ov_Data.Layer, Ov_Data.DataNumber);
                        break;
                    case enmSoloMode_Number.ClassHatchMode:
                        // PrintClassHatchMode(g, Ov_Data .Layer,Ov_Data .DataNumber)
                        break;
                    case enmSoloMode_Number.ClassMarkMode:
                        this.PrintClassMarkMode(g, Ov_Data.Layer, Ov_Data.DataNumber);
                        break;
                    case enmSoloMode_Number.ClassODMode:
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        if (attrData.LayerData[Ov_Data.Layer].Shape == enmShape.LineShape) {
                            // @ts-expect-error TS(2662): Cannot find name 'PrintClassLineShapeSENMode'. Did... Remove this comment to see the full error message
                            PrintClassLineShapeSENMode(g, Ov_Data.Layer, Ov_Data.DataNumber);
                        } else {
                            this.PrintClassODMode(g, Ov_Data.Layer, Ov_Data.DataNumber);
                        }
                        break;
                    case enmSoloMode_Number.MarkTurnMode:
                        // @ts-expect-error TS(2551): Property 'PrintMarkTurnMode' does not exist on typ... Remove this comment to see the full error message
                        this.PrintMarkTurnMode(g, Ov_Data.Layer, Ov_Data.DataNumber);
                        break;
                    case enmSoloMode_Number.MarkBarMode:
                        this.PrintMarkBarMode(g, Ov_Data.Layer, Ov_Data.DataNumber);
                        break;
                    case enmSoloMode_Number.StringMode:
                        this.PrintStringMode(g, Ov_Data.Layer, Ov_Data.DataNumber);
                        break;
                }
                break;
            }
            case enmLayerMode_Number.GraphMode:
                this.PrintGraphMode(g, Ov_Data.Layer, Ov_Data.DataNumber);
                break;
            case enmLayerMode_Number.LabelMode:
                this.PrintLabelMode(g, Ov_Data.Layer, Ov_Data.DataNumber);
                break;
            case enmLayerMode_Number.TripMode:
                // @ts-expect-error TS(2551): Property 'PrintTripMode' does not exist on type 't... Remove this comment to see the full error message
                this.PrintTripMode(g, Ov_Data.Layer, Ov_Data.DataNumber);
                break;
        }
    }

    /**常時重ね合わせが設定してある場合  */
    static OverLay_Plus_Print(g: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let ato = attrData.TotalData.TotalMode.OverLay;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let tmpo=attrData.TempData.OverLay_Temp;
        let n = ato.Always_Overlay_Index;
        tmpo.Always_Ove_DataStac = [];//]strOverLay_DataSet_Item_Info)
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        switch (attrData.TotalData.LV1.Print_Mode_Total) {
            case enmTotalMode_Number.DataViewMode: {
                tmpo.Always_Ove_DataStac=Generic.ArrayClone(ato.DataSet[n].DataItem);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let Layernum = attrData.TotalData.LV1.SelectedLayer;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let al = attrData.LayerData[Layernum];
                if (al.Print_Mode_Layer == enmLayerMode_Number.SoloMode) {
                    let DataNum = al.atrData.SelectedIndex
                    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                    let d = new strOverLay_DataSet_Item_Info();
                    d.DataNumber = DataNum;
                    d.Layer = Layernum;
                    d.Print_Mode_Layer = enmLayerMode_Number.SoloMode;
                    d.Mode = al.atrData.Data[DataNum].ModeData;
                    d.Legend_Print_Flag = true;
                    tmpo.Always_Ove_DataStac.push(d);
                } else {
                    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                    let d = new strOverLay_DataSet_Item_Info();
                    d.Layer = Layernum;
                    d.DataNumber = al.LayerModeViewSettings.GraphMode.SelectedIndex;
                    d.Print_Mode_Layer = al.Print_Mode_Layer;
                    d.Legend_Print_Flag = true;
                    tmpo.Always_Ove_DataStac.push(d);
                }
                break;
            }
            case enmTotalMode_Number.OverLayMode: {
                let n_now = ato.SelectedIndex
                tmpo.Always_Ove_DataStac=Generic.ArrayClone(ato.DataSet[n].DataItem);
                if (n != n_now) {
                    tmpo.Always_Ove_DataStac=tmpo.Always_Ove_DataStac.concat(Generic.ArrayClone(ato.DataSet[n_now].DataItem));
                }
                
                break;
            }
        }

        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let d2 = attrData.Sort_OverLay_Data_Sub(tmpo.Always_Ove_DataStac)
        tmpo.OverLay_Printing_Flag = true;
        for (let i = 0; i < d2.length; i++) {
            tmpo.Printing_Number = i;
            if (d2[i].Print_Mode_Layer == enmLayerMode_Number.SoloMode) {
                let Equal_Mode_N = 0;
                for (let j = 0; j < d2.length; j++) {
                    if (i == j) {
                        tmpo.OverLay_EMode_Now = Equal_Mode_N;
                        Equal_Mode_N++;
                    } else {
                        let ovDataj = d2[j];
                        if ((ovDataj.Print_Mode_Layer == enmLayerMode_Number.SoloMode) && (
                            ovDataj.Layer == d2[i].Layer) && (ovDataj.Mode == d2[i].Mode)) {
                            Equal_Mode_N++;
                        }
                    }
                }
                tmpo.OverLay_EMode_N = Equal_Mode_N;
            }
            this.OverLay_Print_Sub(g, d2[i]);
        }
        tmpo.OverLay_Printing_Flag =false;
    }

    /**グラフモード */
    static PrintGraphMode(g: any,Layernum: any,DataSet: any){
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let selGraph = attrData.LayerData[Layernum].LayerModeViewSettings.GraphMode.DataSet[DataSet];
        switch (selGraph.GraphMode) {
            case enmGraphMode.PieGraph:
            case enmGraphMode.StackedBarGraph:
                this.PrintGraph_Pie_StackdBarMode(g, Layernum, DataSet);
                break;
            case enmGraphMode.LineGraph:
            case enmGraphMode.BarGraph:
                this.PrintGraph_Line_BarMode(g, Layernum, DataSet);
                break;
        }
    }

    /**円グラフまたは帯グラフモード */
    static PrintGraph_Pie_StackdBarMode(g: any, Layernum: any, DataSet: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[Layernum];
        let selGraph = al.LayerModeViewSettings.GraphMode.DataSet[DataSet];
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F == true) {
            g.save();
            this.ClippingRegion_ObjectBoundary_set(g, [Layernum], false, true);
        }
        this.Vector_Object_Boundary(g, Layernum)
        this.Vector_Dummy_Boundary(g, Layernum, true, true);
        this.Vector_Connect_CenterP_To_SymbolPoint(g, Layernum);
        let obn = al.atrObject.ObjectNum;

        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let en_sort = new clsSortingSearch();
        for (let i = 0; i < obn; i++) {
            let env = 0;
            for (let j = 0; j < selGraph.Data.length; j++) {
                let Datan = selGraph.Data[j].DataNumber
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                if (attrData.Check_Missing_Value(Layernum, Datan, i) == true) {
                    env = 0;//欠損値を含む場合は０にして表示しない
                    break;
                } else {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    env += Number( attrData.Get_Data_Value(Layernum, Datan, i, ""));
                }
            }
            en_sort.Add(env);
        }
        en_sort.AddEnd();

        let RMAXVAL = selGraph.En_Obi.MaxValue;

        for (let i = obn - 1; i >= 0; i--) {
            let SortObjPos = en_sort.DataPosition(i);
            let SortSumDataValue = en_sort.DataPositionValue(i);
console.log(SortSumDataValue)
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if ((SortSumDataValue != 0) && (attrData.Check_Condition(Layernum, SortObjPos) == true)) {

                let CP = al.atrObject.atrObjectData[SortObjPos].Symbol;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let OP = attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(CP);

                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.TempData.ObjectPrintedCheckFlag[Layernum][SortObjPos] = true;
                switch (selGraph.GraphMode) {
                    case enmGraphMode.PieGraph: { //円グラフ
                        let r;
                        if (selGraph.En_Obi.EnSizeMode == enmGraphMaxSize.Fixed) {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            r = attrData.Radius(selGraph.En_Obi.EnSize, RMAXVAL, RMAXVAL);
                        } else {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            r = attrData.Radius(selGraph.En_Obi.EnSize, SortSumDataValue, RMAXVAL);
                        }
                        console.log(selGraph.En_Obi.EnSize, SortSumDataValue, RMAXVAL)
                        if (r != 0) {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            if (attrData.Check_Screen_In(OP, r) == true) {
                                let acum = 0
                                for (let j = 0; j < selGraph.Data.length; j++) {
                                    let Datan = selGraph.Data[j].DataNumber
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    if (attrData.Check_Missing_Value(Layernum, Datan, SortObjPos) == false) {
                                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                        let H =Number( attrData.Get_Data_Value(Layernum, Datan, SortObjPos, "")) / SortSumDataValue;
                                        console.log(H);
                                        if (Math.abs(H - 1) <= 0.00001) {
                                            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                                            let Circle_Mark = new Mark_Property();
                                            Circle_Mark.PrintMark = enmMarkPrintType.Mark;
                                            Circle_Mark.WordFont.Back.Tile = clsBase.BlancTile();
                                            Circle_Mark.WordFont.Back.Line = clsBase.BlankLine();
                                            Circle_Mark.WordFont.Back.Round = 0;
                                            Circle_Mark.Line = selGraph.En_Obi.BoaderLine;
                                            Circle_Mark.Tile = selGraph.Data[j].Tile;
                                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                            attrData.Draw_Mark(g, OP, r, Circle_Mark);
                                        } else {
                                            if (H != 0) {
                                                let start_p = acum;
                                                let end_p = start_p + 2 * Math.PI * H;
                                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                                attrData.Draw_Fan(g, OP, r, start_p, end_p, selGraph.En_Obi.BoaderLine, selGraph.Data[j].Tile);
                                                acum = end_p;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        break;
                    }
                    case enmGraphMode.StackedBarGraph: { //帯グラフ
                        let r;
                        let r2;
                        let xw;
                        let yw;
                        if (selGraph.En_Obi.EnSizeMode == 0) {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            r = attrData.Get_Length_On_Screen(selGraph.En_Obi.EnSize);
                        } else {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            r = attrData.Radius(selGraph.En_Obi.EnSize, SortSumDataValue, RMAXVAL) * 2;
                        }
                        r2 = r * selGraph.En_Obi.AspectRatio;
                        if (selGraph.En_Obi.StackedBarDirection == enmStackedBarChart_Direction.Vertical) {
                            xw = r2 / 2;
                            yw = r;
                        } else {
                            xw = r / 2;
                            yw = r2 / 2;
                        }
                        // @ts-expect-error TS(2554): Expected 4 arguments, but got 2.
                        let C_Rect = new rectangle(new point(OP.x - xw, OP.y - yw), new size(xw * 2, yw * 2));
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        if (attrData.Check_Screen_In(C_Rect) == true) {
                            let E = 0;
                            for (let j = 0; j < selGraph.Data.length; j++) {
                                let Datan = selGraph.Data[j].DataNumber;
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                if (attrData.Check_Missing_Value(Layernum, Datan, SortObjPos) == false) {
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    let H = attrData.Get_Data_Value(Layernum, Datan, SortObjPos, "") / SortSumDataValue;
                                    let Rect;
                                    switch (selGraph.En_Obi.StackedBarDirection) {
                                        case enmStackedBarChart_Direction.Vertical:
                                            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                                            Rect = new rectangle(OP.x - r2 / 2, OP.x + r2 / 2,OP.y - r + E * r,  OP.y - r + E * r + r * H);
                                            break;
                                        case enmStackedBarChart_Direction.Horizontal:
                                            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                                            Rect = new rectangle(OP.x - r / 2 + E * r,  OP.x - r / 2 + E * r + r * H,OP.y - r2 / 2, OP.y + r2 / 2);
                                            break;
                                    }
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    attrData.Draw_Tile_Box(g, Rect,  selGraph.En_Obi.BoaderLine, selGraph.Data[j].Tile,0);
                                    E += H;
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F == true) {
            g.restore();
        }
    }

    /**棒グラフまたは折れ線グラフ */
    static PrintGraph_Line_BarMode(g: any, Layernum: any, DataSet: any) {

        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[Layernum];
        let selGraph = al.LayerModeViewSettings.GraphMode.DataSet[DataSet];
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F == true) {
            g.save();
            this.ClippingRegion_ObjectBoundary_set(g, [Layernum], false, true);
        }
        this.Vector_Object_Boundary(g, Layernum)
        this.Vector_Dummy_Boundary(g, Layernum, true, true);
        this.Vector_Connect_CenterP_To_SymbolPoint(g, Layernum);

        let obn = al.atrObject.ObjectNum;

        let OverLay_With_Bou = false;
        let OverLay_Refference_Multi;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if ((attrData.TempData.OverLay_Temp.OverLay_Printing_Flag == true) && (selGraph.GraphMode == enmGraphMode.LineGraph)) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let ato = attrData.TotalData.TotalMode.OverLay;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            for (let i = 0; i < attrData.TempData.OverLay_Temp.Printing_Number; i++) {
                let atod = ato.DataSet[ato.SelectedIndex].DataItem[i];
                if ((atod.Layer == Layernum) && (atod.Print_Mode_Layer == enmLayerMode_Number.GraphMode)) {
                     // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                     OverLay_Refference_Multi =  attrData.LayerData[atod.Layer].LayerModeViewSettings.GraphMode.DataSet[atod.DataNumber];
                    if (OverLay_Refference_Multi.GraphMode == enmGraphMode.BarGraph) {
                        OverLay_With_Bou = true;
                    }
                }
            }
        }

        let YMax = selGraph.Oresen_Bou.YMax;
        let Ymin = selGraph.Oresen_Bou.Ymin;
        let ST = selGraph.Oresen_Bou.Ystep;
        let a;
        let ww;
        let wh;
        if (OverLay_With_Bou == false) {
            this.Vector_Connect_CenterP_To_SymbolPoint(g, Layernum);
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            ww = attrData.Get_Length_On_Screen(selGraph.Oresen_Bou.Size);
            wh = ww / selGraph.Oresen_Bou.AspectRatio;
            if (selGraph.GraphMode == enmGraphMode.LineGraph) {
                a = 1;
            } else {
                a = 2;
            }
        } else {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            ww = attrData.Get_Length_On_Screen(OverLay_Refference_Multi.Oresen_Bou.Size);
            wh = ww / OverLay_Refference_Multi.Oresen_Bou.AspectRatio;
            a = 1;
        }

        let stx = ww / (selGraph.Data.length + a);
        for (let i = 0; i < obn; i++) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if (attrData.Check_Condition(Layernum, i) == true) {
                let dataMaxV;
                let dataMinV;
                let wrh;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                if(attrData.TempData.OverLay_Temp.OverLay_Printing_Flag == true){
                    dataMaxV=YMax;
                    dataMinV=Ymin;
                    wrh = wh;
                }else{
                    let fif=true;
                    for (let j = 0; j < selGraph.Data.length; j++) {
                        let Datan = selGraph.Data[j].DataNumber;
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        if (attrData.Check_Missing_Value(Layernum, Datan, i) == false) {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            let v = attrData.Get_Data_Value(Layernum, Datan, i, "");
                            if (fif == true) {
                                dataMaxV = v;
                                dataMinV = v;
                                fif=false;
                            } else {
                                dataMaxV = Math.max(dataMaxV, v);
                                dataMinV = Math.min(dataMinV, v);
                            }
                        }
                    }
                    dataMaxV += (YMax - Ymin) * 0.1;
                    dataMinV -= (YMax - Ymin) * 0.1;
                    dataMaxV = Math.min(dataMaxV, YMax);
                    dataMinV = Math.max(dataMinV, Ymin);
                    switch (selGraph.GraphMode) {
                        case enmGraphMode.BarGraph:
                            if (dataMinV > 0) {
                                dataMinV = 0;
                            }
                            break;
                        case enmGraphMode.LineGraph:
                            if (dataMinV > 0)
                                if (Ymin <= 0) {
                                    dataMinV = Ymin;
                                }
                            break;
                    }
                    let dataMaxH=Math.abs( (dataMaxV- dataMinV) / (YMax - Ymin));
                     wrh = wh * dataMaxH;
                }

                let CP = al.atrObject.atrObjectData[i].Symbol;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let OP = attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(CP);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.TempData.ObjectPrintedCheckFlag[Layernum][i] = true;
                OP.offset(-ww / 2, -wrh / 2);
                // @ts-expect-error TS(2554): Expected 4 arguments, but got 2.
                let Rect = new rectangle(OP, new size(ww, wrh));
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                if (attrData.Check_Screen_In(Rect) == true) {
                    if (OverLay_With_Bou == false) {
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        attrData.Draw_Tile_Box(g, Rect, clsBase.BlankLine(), selGraph.Oresen_Bou.BackgroundTile, 0);
                        if (selGraph.Oresen_Bou.FrameAxe == enmBarChartFrameAxePattern.Whole) {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            attrData.Draw_Tile_Box(g, Rect, selGraph.Oresen_Bou.BorderLine, clsBase.BlancTile(), 0);
                        } else {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            attrData.Draw_Line(g, selGraph.Oresen_Bou.BorderLine, Rect.bottomLeft(), Rect.topLeft());
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            attrData.Draw_Line(g, selGraph.Oresen_Bou.BorderLine, Rect.bottomLeft(), Rect.bottomRight());
                        }
                        let Zero_Line = clsBase.Line();
                        Zero_Line.Color = selGraph.Oresen_Bou.BorderLine.Color.Clone();
                        for (let wakuj = Ymin; wakuj <= dataMaxV; wakuj += ST) {
                            if (wakuj >= dataMinV) {
                                let H = 1- (wakuj - dataMinV) / (dataMaxV- dataMinV);
                                let yy = OP.y + wrh * H;
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                attrData.Draw_Line(g, Zero_Line, new point(OP.x, yy), new point(OP.x + ww / 15, yy));
                                if (selGraph.Oresen_Bou.FrameAxe == enmBarChartFrameAxePattern.Whole) {
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    attrData.Draw_Line(g, Zero_Line, new point(OP.x + ww, yy), new point(OP.x + ww - ww / 15, yy));
                                }
                            }
                        }
                    }
                    if ((Ymin < 0) && (YMax > 0)) {
                        let Zero_Line = clsBase.Line();
                        Zero_Line.Color = selGraph.Oresen_Bou.BorderLine.Color.Clone();
                        let H = 1 - (-dataMinV) / (dataMaxV- dataMinV);
                        let yy = OP.y + wrh * H;
                        g.setLineDash([5,3]);
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        attrData.Draw_Line(g, Zero_Line, new point(OP.x, yy), new point(OP.x + ww, yy));
                        g.setLineDash([]);
                    }

                    g.save();
                    let RectC = Rect;
                    RectC.inflate(1, 1)
                    g.moveTo(RectC.left,RectC.top);
                    g.lineTo(RectC.right,RectC.top);
                    g.lineTo(RectC.right,RectC.bottom);
                    g.lineTo(RectC.left,RectC.bottom);
                    g.closePath();
                    g.clip("evenodd");

                    switch (selGraph.GraphMode) {
                        case enmGraphMode.LineGraph: {//折れ線グラフ
                            let flx1;
                            let fly1;
                            let fsx = OP.x + stx;
                            let ff = true;
                            for (let j = 0; j < selGraph.Data.length; j++) {
                                let Datan = selGraph.Data[j].DataNumber;
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                if (attrData.Check_Missing_Value(Layernum, Datan, i) == false) {
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    let H = 1 - (attrData.Get_Data_Value(Layernum, Datan, i, "") - dataMinV) / (dataMaxV- dataMinV);
                                    let yy = OP.y + wrh * H;
                                    if (ff == true) {
                                        flx1 = fsx;
                                        fly1 = yy;
                                        ff = false;
                                    } else {
                                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                        attrData.Draw_Line(g, selGraph.Oresen_Bou.Line, new point(flx1, fly1), new point(fsx, yy));
                                        flx1 = fsx;
                                        fly1 = yy;
                                    }
                                    fsx += stx;
                                }
                            }
                            break;
                        }
                        case enmGraphMode.BarGraph: { //棒グラフ
                            let fsx = OP.x + stx;
                            for (let j = 0; j < selGraph.Data.length; j++) {
                                let Datan = selGraph.Data[j].DataNumber;
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                if (attrData.Check_Missing_Value(Layernum, Datan, i) == false) {
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    let H = 1 - (attrData.Get_Data_Value(Layernum, Datan, i, "")- dataMinV) / (dataMaxV- dataMinV);
                                    let yy = OP.y + wrh * H;
                                    let yy2 = OP.y + (wrh * (1 - (-dataMinV) / (dataMaxV- dataMinV)));
                                    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                                    let barRect = new rectangle(fsx, fsx + stx, yy, yy2);
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    attrData.Draw_Tile_Box(g, barRect, selGraph.Oresen_Bou.Line, selGraph.Data[j].Tile, 0);
                                }
                                fsx += stx;
                            }
                            break;
                        }
                    }
                    g.restore();
                }
            }
        }
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F == true) {
            g.restore();
        }
    }


    /**ラベルモード */
    static PrintLabelMode(g: any, Layernum: any, DataSet: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[Layernum];
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F == true) {
            g.save();
            this.ClippingRegion_ObjectBoundary_set(g, [Layernum], false, true);
        }
        this.Vector_Object_Boundary(g, Layernum)
        this.Vector_Dummy_Boundary(g, Layernum, true, true);

        let attLbl = al.LayerModeViewSettings.LabelMode.DataSet[DataSet];
        let LabelMark = attLbl.Location_Mark;


        let LocMarkFlag = attLbl.Location_Mark_Flag;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let mark_r = attrData.Radius(attLbl.Location_Mark.WordFont.Size, 1, 1);


        let obn = al.atrObject.ObjectNum;
        let XY = []
        for (let i = 0; i < obn; i++) {
            let CP = al.atrObject.atrObjectData[i].Label;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            XY.push(attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(CP));
        }

        let Data_n = attLbl.DataItem.length;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let BoxWidth = attrData.Get_Length_On_Screen(attLbl.Width);

        //ラベルを表示
        for (let i = 0; i < obn; i++) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if (attrData.Check_Condition(Layernum, i) == true) {
                let D_TxHeight = 0;
                let D_Word_Cut: any = [];
                if (Data_n > 0) {

                    for (let j = 0; j < Data_n; j++) {
                        let wo2 = "";
                        let DataNum = attLbl.DataItem[j];
                        if (attLbl.DataName_Print_Flag == true) {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            wo2 = attrData.Get_DataTitle(Layernum, DataNum, false) + "："
                        }
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        if (attrData.Check_Missing_Value(Layernum, DataNum, i) == true) {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            if (attrData.TotalData.ViewStyle.Missing_Data.Print_Flag == true) {
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                wo2 += attrData.TotalData.ViewStyle.Missing_Data.Label;
                            } else {
                                wo2 = "";
                            }
                        } else {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            switch (attrData.Get_DataType(Layernum, DataNum)) {
                                case enmAttDataType.Normal:
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    let V = attrData.Get_Data_Value(Layernum, DataNum, i, "");
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    wo2 += Generic.Figure_Using_Solo(V, attrData.TotalData.ViewStyle.MapLegend.Base.Comma_f);
                                    if (attLbl.DataValue_Unit_Flag == true) {
                                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                        wo2 += attrData.Get_DataUnit(Layernum, DataNum);
                                    }
                                    break;
                                case (enmAttDataType.Category, enmAttDataType.Strings):
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    wo2 += attrData.Get_Data_Value(Layernum, DataNum, i, "");
                                    break;

                            }
                            let retV = clsDraw.TextCut_for_print(g, wo2,
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                attLbl.DataValue_Font, attLbl.DataValue_TurnFlag, BoxWidth, attrData.TotalData.ViewStyle.ScrData);
                            Array.prototype.push.apply(D_Word_Cut, retV.Out_Text);
                            D_TxHeight = retV.Height;
                        }
                    }

                }
                if ((D_Word_Cut.length > 0) || (attLbl.ObjectName_Print_Flag == true)) {

                    let O_Word_Cut: any = [];
                    let O_TxHeight = 0;
                    if (attLbl.ObjectName_Print_Flag == true) {
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        let retV = clsDraw.TextCut_for_print(g, attrData.Get_KenObjName(Layernum, i),
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            attLbl.ObjectName_Font, attLbl.ObjectName_Turn_Flag, BoxWidth, attrData.TotalData.ViewStyle.ScrData);
                        O_Word_Cut = retV.Out_Text;
                        O_TxHeight = retV.Height;
                    }

                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.TempData.ObjectPrintedCheckFlag[Layernum][i] = true;

                    let TH = D_TxHeight * D_Word_Cut.length + O_TxHeight * O_Word_Cut.length;
                    // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
                    let AP = new point();
                    // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
                    let BP = new point();
                    AP.x = XY[i].x - BoxWidth / 2;
                    BP.x = AP.x + BoxWidth;
                    let scx = XY[i].x;

                    AP.y = (attLbl.Location_Mark_Flag == true) ? XY[i].y : XY[i].y - TH / 2;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    if (attrData.Check_Screen_In(new rectangle(AP, new size(BoxWidth * 2, TH * 2))) == true) {
                        let y2 = 0;
                        if (attLbl.Location_Mark_Flag == true) {
                            Label_MarkPrint(g, XY[i], mark_r, LabelMark);//表示位置の記号を表示
                            y2 += mark_r * 4;
                        }
                        if (attLbl.ObjectName_Print_Flag == true) {
                            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                            let Rect = new rectangle(AP.x - 1, BP.x, AP.y + y2 - 1, AP.y + y2 + O_TxHeight * O_Word_Cut.length);
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            attrData.Draw_Tile_Box(g, Rect, attLbl.BorderLine, attLbl.BorderObjectTile, 0);
                            for (let j = 0; j < O_Word_Cut.length; j++) {
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                attrData.Draw_Print(g, O_Word_Cut[j], new point(scx, AP.y + y2), attLbl.ObjectName_Font, enmHorizontalAlignment.Center, enmVerticalAlignment.Top);
                                y2 += O_TxHeight;
                            }
                            y2++;
                        }

                        if (attLbl.DataValue_Print_Flag == true) {
                            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                            let Rect = new rectangle(AP.x - 1, BP.x, AP.y + y2 - 1, AP.y + y2 + D_TxHeight * D_Word_Cut.length);
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            attrData.Draw_Tile_Box(g, Rect, attLbl.BorderLine, attLbl.BorderDataTile, 0);
                            for (let j = 0; j < D_Word_Cut.length; j++) {
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                attrData.Draw_Print(g, D_Word_Cut[j], new point(scx, AP.y + y2), attLbl.DataValue_Font, enmHorizontalAlignment.Center, enmVerticalAlignment.Top);
                                y2 += D_TxHeight;
                            }
                        }
                    }
                }
            }
        }
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F == true) {
            g.restore();
        }

        function Label_MarkPrint(g: any, Pos: any, r: any, MK: any) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if (attrData.Check_Screen_In(Pos, r) == true) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Draw_Mark(g, Pos, r, MK)
            }   
        }
    }


    /**等値線モード */
    static PrintContourMode(g: any,LayerNum: any, DataNum: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[LayerNum];
        let ad = al.atrData.Data[DataNum];
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let cont=attrData.TempData.ContourMode_Temp;
        if(cont.ContourDataResetF == true ){
            //等値線用メッシュデータを作成する
            this.ContourMeshIndexSet( LayerNum, DataNum);
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Missing_DataArray  = attrData.Get_Missing_Value_DataArray(LayerNum, DataNum);
        for(let i=0;i< al.atrObject.ObjectNum ;i++){
            if(Missing_DataArray[i] == false ){
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.TempData.ObjectPrintedCheckFlag[LayerNum][i] = true;
            }
        }

        let C_md  = ad.SoloModeViewSettings.ContourMD;

        //等値線間隔と値を取得
        let retConV = this.GetContourIntervalValue(LayerNum, DataNum);
        let hn = retConV.hn;
        let Contour_High_M = retConV.Contour_High_M;
        let C_Line_Pat = retConV.C_Line_Pat;
        //メッシュから等高線を抜き出す
        let Pre_CStac: any=[];// clsMeshContour.ContourLineStacInfo
        let ln  = cont.ContourMesh.Execute_Mesh(hn, Contour_High_M, Pre_CStac);

        if(ln == 0 ){
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            Generic.alert(undefined,"該当する等値線が取得できませんでした。<br>下限値・上限値を変更してください。");
            return
        }

        let Clip_F2  = false;
        if(al.LayerModeViewSettings.PolygonDummy_ClipSet_F == true ){
            g.save();
            if((C_md.Interval_Mode == enmContourIntervalMode.RegularInterval )||(C_md.Interval_Mode == enmContourIntervalMode.SeparateSettings)){
                this.Vector_Dummy_Boundary(g,  LayerNum, true, false);
            }
            Clip_F2 = this.ClippingRegion_ObjectBoundary_set(g, [LayerNum], false, true);
            if((C_md.Interval_Mode == enmContourIntervalMode.RegularInterval )||(C_md.Interval_Mode == enmContourIntervalMode.SeparateSettings)){
                this.Vector_Object_Boundary(g,  LayerNum);
                this.Vector_Dummy_Boundary(g,  LayerNum, (Clip_F2 == false), true);
            }
        }else{
            if((C_md.Interval_Mode == enmContourIntervalMode.RegularInterval )||(C_md.Interval_Mode == enmContourIntervalMode.SeparateSettings)){
                this.Vector_Object_Boundary(g,  LayerNum);
                this.Vector_Dummy_Boundary(g,  LayerNum, true, true);
            }
        }
        let ST = (C_md.Detailed <= 2) ? 0.4 : 0.2;

        if(C_md.Draw_in_Polygon_F == true ){
            //ポリゴン内部のみ描画
            g.save();
            this.ClippingRegion_ObjectBoundary_set(g,  [LayerNum], true, (al.LayerModeViewSettings.PolygonDummy_ClipSet_F == false));
        }

        if (C_md.Interval_Mode == enmContourIntervalMode.ClassPaint) {
            //ペイントモードで塗りつぶす
            let Frame_AllPoint = [];
            let FrameStac = Generic.Array2Dimension(4, 2, 0);
            let Frame_AllLineStac = [];
            let FrameAllLineN = 0;
            for (let i = 0; i <= 3; i++) {
                let Frame_LineStac: any = [];
                let Frame_Point: any = [];
                let FrameLineN = cont.ContourMesh.Execute_FrameGet(i, hn, Contour_High_M, Frame_LineStac, Frame_Point);
                FrameStac[i][0] = FrameAllLineN;
                FrameStac[i][1] = FrameLineN;
                for (let j = 0; j < FrameLineN; j++) {
                    Frame_AllPoint.push(Frame_Point[j]);
                    Frame_AllLineStac.push(Frame_LineStac[j]);
                }
                FrameAllLineN += FrameLineN;
            }

            let HnPolygon = [];// VecContourStac_Info
            for (let i = 0; i <= hn; i++) {
                // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                let d = new VecContourStac_Info();
                HnPolygon.push(d);
            }
            for (let i = 0; i < ln; i++) {
                let n = Pre_CStac[i].ContourNumber;
                for (let j = 0; j <= 1; j++) {
                    let d = HnPolygon[n + j];
                    d.cStac.push(i);
                    d.CNum++;
                }
            }
            for (let i = 0; i <= 3; i++) {
                for (let j = 0; j <= FrameStac[i][1] - 2; j++) {
                    let n = Frame_AllLineStac[FrameStac[i][0] + j];
                    let d = HnPolygon[n + 1];
                    d.FStac.push(FrameStac[i][0] + j);
                    d.fnum++;
                }
            }

            for (let i = 0; i <= hn; i++) {
                if ((HnPolygon[i].fnum > 0) || (HnPolygon[i].CNum > 0)) {
                    this.ContourPolyBoundary(g, LayerNum, DataNum, i, hn, C_md.Interval_Mode,
                        HnPolygon[i], Pre_CStac, Frame_AllPoint, C_md.Spline_flag, ST);
                }
            }
        }

        for (let i = 0; i < ln; i++) {
            let Con_Obj_Code = i + cont.Contour_All_Number;
            let pci=Pre_CStac[i];
            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
            let d = new strContour_Line_property();
            d.Layernum = LayerNum
            d.DataNum = DataNum
            d.PointStac = cont.Contour_All_Point;
            d.NumOfPoint = pci.NumOfPoint;
            d.Value = Contour_High_M[pci.ContourNumber];
            // @ts-expect-error TS(2554): Expected 4 arguments, but got 2.
            d.Circumscribed_Rectangle = new rectangle(pci.points[0], new size(0, 0));

            for (let j = 0; j <  pci.NumOfPoint; j++) {
                cont.Contour_Point.push(pci.points[j].Clone());
                cont.Contour_All_Point++;
                d.Circumscribed_Rectangle = spatial.getCircumscribedRectangle(pci.points[j], d.Circumscribed_Rectangle);
            }
            d.Flag = true;
            cont.Contour_Object[Con_Obj_Code] = d;

            let pxy = [];
            if (C_md.Spline_flag == true) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                pxy = clsSpline.Spline_Get(0, pci.NumOfPoint, pci.points, ST, attrData.TotalData.ViewStyle.ScrData);
            } else {
                for (let j = 0; j < pci.NumOfPoint; j++) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    pxy.push(attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(pci.points[ j]));
                }
            }
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.Draw_Line(g, C_Line_Pat[pci.ContourNumber], pxy);

        }
        this.ObjectValue_And_Name_Print_byLayer(g,  LayerNum, DataNum);

        if(C_md.Draw_in_Polygon_F == true ){
            g.restore();
        }

        if(C_md.Interval_Mode == enmContourIntervalMode.ClassPaint){
            this.Vector_Object_Boundary(g,  LayerNum);
            this.Vector_Dummy_Boundary(g, LayerNum, true, true);
        }
        if(al.LayerModeViewSettings.PolygonDummy_ClipSet_F == true ){
            g.restore();
        }
        cont.Contour_All_Number += ln;
    }

    /**
 * Description placeholder
 *
 * @static
 * @param {*} g 
 * @param {*} Layernum 
 * @param {*} DataNum 
 * @param {*} Pcon 
 * @param {*} hn 
 * @param {*} Interval_Mode 
 * @param {*} HnPolygon 
 * @param {*} Pre_CStac 
 * @param {*} Frame_AllPoint 
 * @param {*} Spline_flag 
 * @param {*} SplineT 
 */
static ContourPolyBoundary(g: any, Layernum: any, DataNum: any,
        Pcon: any, hn: any, Interval_Mode: any, HnPolygon: any,  Pre_CStac: any, Frame_AllPoint: any, Spline_flag: any, SplineT: any) {

        let spxy = [];
        let epxy = [];
        let NL= HnPolygon.CNum + HnPolygon.fnum;
        for (let j = 0; j < HnPolygon.CNum; j++) {
            let hc=HnPolygon.cStac[j];
            let n = Pre_CStac[hc].NumOfPoint;
            spxy.push(Pre_CStac[hc].points[0].Clone());
            epxy.push(Pre_CStac[hc].points[n - 1].Clone());
        }
        for (let j = 0; j < HnPolygon.fnum; j++) {
            let hc=HnPolygon.FStac[j];
            spxy.push(Frame_AllPoint[hc].Clone());
            epxy.push(Frame_AllPoint[hc + 1].Clone());
        }

        let boundArrange = spatial.BoundaryArrangeGeneral(NL, spxy, epxy);
        if (boundArrange.Pon == 0) {
            return;
        }
        let Arrange_LineCode = boundArrange.Arrange_LineCode;
        let Fringe = boundArrange.Fringe;
        let nPolyP = [];
        // let p = 0;
        // for (let i = 0; i < Fringe.length; i++) {
        //     if (Fringe[i].code < HnPolygon.CNum) {
        //         p += Pre_CStac[HnPolygon.cStac[Fringe[i].code]].NumOfPoint;
        //     } else {
        //         p += 2;
        //     }
        // }
        let pxy=[];
        let ponpon = 0
        for (let i = 0; i < boundArrange.Pon; i++) {
            let np2 = 0;
            for (let j = 0; j < Arrange_LineCode[i][1]; j++) {
                let revf;
                if (Fringe[Arrange_LineCode[i][0] + j].Direction == 1) {
                    revf = false;
                } else {
                    revf = true;
                }
                let L = Fringe[Arrange_LineCode[i][0] + j].code;
                if (L < HnPolygon.CNum) {
                    let hc=HnPolygon.cStac[L];
                    let n = Pre_CStac[hc].NumOfPoint;
                    if (Spline_flag == true) {
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        let pxytemp = clsSpline.Spline_Get(0, n, Pre_CStac[hc].points, SplineT, attrData.TotalData.ViewStyle.ScrData);
                        let spn=pxytemp.length;
                        if (revf == false) {
                            for (let k = 0; k < spn; k++) {
                                pxy.push(pxytemp[k]);
                            }
                        } else {
                            for (let k = 0; k < spn; k++) {
                                pxy.push(pxytemp[spn - 1 - k]);
                            }
                        }
                        n=spn;
                    } else {
                        if (revf == false) {
                            for (let k = 0; k < n; k++) {
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                pxy.push(attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(Pre_CStac[hc].points[k]));
                            }
                        } else {
                            for (let k = 0; k < n; k++) {
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                pxy.push(attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(Pre_CStac[hc].points[ n - 1 - k]));
                            }
                        }
                    }
                    np2 += n;
                } else {
                    if (revf == false) {
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        pxy.push(attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(spxy[L]));
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        pxy.push(attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(epxy[L]));
                    } else {
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        pxy.push(attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(epxy[L]));
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        pxy.push(attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(spxy[L]));
                    }
                    np2 += 2;
                }
            }
            nPolyP.push(np2);
            ponpon++;
        }
        switch (Interval_Mode) {
            case enmContourIntervalMode.ClassPaint:
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let col = attrData.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings.Class_Div[hn - Pcon].PaintColor.toRGBA();
                // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                let poly = new PolydataInfo();   
                poly.Pon=ponpon;
                poly.pxy=pxy;
                poly.nPolyP=nPolyP;
                clsDraw.DrawPolyPolygon(g, poly, col);
                break;
        }
    }

    
    /**
 * Description placeholder
 *
 * @static
 * @param {*} Layernum 
 * @param {*} DataNum 
 */
static ContourMeshIndexSet(Layernum: any, DataNum: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[Layernum];
        let ad = al.atrData.Data[DataNum];
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let vs = attrData.TotalData.ViewStyle.ScrData;

        let mw = vs.MapRectangle.width();
        let mh = vs.MapRectangle.height();
        let ObjN = al.atrObject.ObjectNum;
        let StdWSize = vs.STDWsize;
        let md = Math.sqrt(15 * mw * mh / ObjN);
        md = Math.min(md, StdWSize * 0.05);
        // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
        let F_Meshx = parseInt(mw / md);
        // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
        let F_Meshy = parseInt(mh / md);
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
        let F_Mesh = Generic.Array2Dimension(F_Meshx + 1, F_Meshy + 1);
        for (let j = 0; j <= F_Meshx; j++) {
            for (let k = 0; k <= F_Meshy; k++) {
                F_Mesh[j][k] = new Array(2);
                F_Mesh[j][k][0] = 0;
                F_Mesh[j][k][1] = -1;
            }
        }

        let nn = 0;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Missing_DataArray = attrData.Get_Missing_Value_DataArray(Layernum, DataNum);
        let F_Mesh_In = new Array(ObjN).fill(0);

        for (let i = 0; i < ObjN; i++) {

            if (Missing_DataArray[i] == false) {
                let cp = al.atrObject.atrObjectData[i].CenterPoint;
                // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                let X = parseInt((cp.x - vs.MapRectangle.left) / md);;
                // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                let Y = parseInt((cp.y - vs.MapRectangle.top) / md);
                F_Mesh[X][Y][0]++;
                for (let j = 0; j <= F_Meshx; j++) {
                    for (let k = 0; k <= F_Meshy; k++) {
                        if (F_Mesh[j][k][1] > F_Mesh[X][Y][1]) {
                            F_Mesh[j][k][1]++;
                        }
                    }
                }
                if (F_Mesh[X][Y][0] == 1) {
                    F_Mesh[X][Y][1] = 0;
                }
                for (let j = nn - 1; j >= F_Mesh[X][Y][1]; j--) {
                    F_Mesh_In[j + 1] = F_Mesh_In[j];
                }
                F_Mesh_In[F_Mesh[X][Y][1]] = i;
                nn++;
            }
        }
        
        //Mesh()／メッシュの数値を入れる．大きさは設定による
        let md2;
        switch (ad.SoloModeViewSettings.ContourMD.Detailed) {
            case 0:
                md2 = StdWSize * 0.005;
                break;
            case 1:
                md2 = StdWSize * 0.01;
                break;
            case 2:
                md2 = StdWSize * 0.017;
                break;
            case 3:
                md2 = StdWSize * 0.025;
                break;
            case 4:
                md2 = StdWSize * 0.035;
                break;
        }
        // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
        let D_Meshx = parseInt(mw / md2);
        // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
        let D_Meshy = parseInt(mh / md2);
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let cont = attrData.TempData.ContourMode_Temp;
        cont.Contour_All_Number = 0;
        cont.Contour_All_Point = 0;
        cont.Contour_Point=[];
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        cont.ContourMesh = new clsMeshContour(D_Meshx + 1, D_Meshy + 1, md2 * D_Meshx, md2 * D_Meshy, vs.MapRectangle.left, vs.MapRectangle.top);
        cont.ContourDataResetF = false;

        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let DataValue = attrData.Get_Data_Cell_Array_With_MissingValue(Layernum, DataNum);
        for (let i = 0; i <= D_Meshx; i++) {
            for (let j = 0; j <= D_Meshy; j++) {
                let P = vs.MapRectangle.topLeft();
                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                P.offset(i * md2, j * md2);
                let v = this.ContourMesh_Value(Layernum, DataNum, DataValue, P, md, F_Mesh, F_Mesh_In);
                cont.ContourMesh.SetMeshValue(i, j, v);
            }
        }

    }

    /**
 * Description placeholder
 *
 * @static
 * @param {*} Layernum 
 * @param {*} DataNum 
 * @param {*} DataValue 
 * @param {*} P 
 * @param {*} md 
 * @param {*} F_Mesh 
 * @param {*} F_Mesh_In 
 * @returns {*} 
 */
static ContourMesh_Value( Layernum: any , DataNum: any ,DataValue: any , P: any , md: any ,  F_Mesh: any ,  F_Mesh_In: any ){

        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[Layernum];
        let ad = al.atrData.Data[DataNum];
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let vs = attrData.TotalData.ViewStyle.ScrData;
        // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
        let xx = parseInt((P.x - vs.MapRectangle.left) / md);
        // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
        let yy = parseInt((P.y - vs.MapRectangle.top) / md);
        let F_Mesh_W = F_Mesh.length-1;
        let F_Mesh_H = F_Mesh[0].length-1;
        let O_Code = [];
        let O_Distance = [];
        let n = 0;
        let c = 0;
        let cend = 3;

        //メッシュ点周辺のオブジェクトを検索する
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let AngleSort = new clsSortingSearch();
        let dir_num = Generic.Array2Dimension(3, 3, 0);
        let dir_c = Generic.Array2Dimension(3, 3, false);
        do {
            let enf=false;
            do {
                //kkは菱形に走査していくために使う
                let kk = 0
                for (let i = xx - c; i <= xx + c; i++) {
                    if ((0 <= i) && (i <= F_Mesh_W)) {
                        let qx = Math.sign(i - xx) + 1;
                        for (let i2 = 0; i2 <= 1; i2++) {
                            let j;
                            switch (i2) {
                                case 0:
                                    j = yy - kk;
                                    break;
                                case 1:
                                    j = yy + kk;
                                    break;
                            }
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            let qy = Math.sign(j - yy) + 1;
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            if ((0 <= j) && (j <= F_Mesh_H)) {
                                // @ts-expect-error TS(2538): Type 'undefined' cannot be used as an index type.
                                if ((dir_c[qx][qy] == true) || (F_Mesh[i][j][0] == 0)) {
                                } else {
                                    // @ts-expect-error TS(2538): Type 'undefined' cannot be used as an index type.
                                    dir_num[qx][qy] += F_Mesh[i][j][0];
                                    // @ts-expect-error TS(2538): Type 'undefined' cannot be used as an index type.
                                    for (let k = 0; k < F_Mesh[i][j][0]; k++) {
                                        // @ts-expect-error TS(2538): Type 'undefined' cannot be used as an index type.
                                        let O_cd = F_Mesh_In[k + F_Mesh[i][j][1]];
                                        let P3 = al.atrObject.atrObjectData[O_cd].CenterPoint;
                                        if (P.Equals(P3) == true) {
                                            return DataValue[O_cd];
                                        }
                                        let d = Math.sqrt((P3.x - P.x) ** 2 + (P3.y - P.y) ** 2);
                                        O_Distance.push(d);
                                        O_Code.push(O_cd);
                                        let si = (P3.y - P.y) / d;
                                        let co = (P3.x - P.x) / d;
                                        AngleSort.Add(Generic.Angle(si, co));
                                        n++;
                                    }
                                    if (dir_num[qx][qy] >= 2) {
                                        dir_c[qx][qy] = true;
                                    }
                                }
                            }
                            if (kk == 0) { break; }
                        }

                    }
                    if (i < xx) {
                        kk++;
                    } else {
                        kk--;
                    }
                }
                if (xx - c < 0) {
                    dir_c[0][1] = true;
                }
                if (xx + c > F_Mesh_W) {
                    dir_c[2][1] = true;
                }

                if (yy - c < 0) {
                    dir_c[1][0] = true;
                }
                if (yy + c > F_Mesh_H) {
                    dir_c[1][2] = true;
                }

                c++;
                enf = true;
                for (let i = 0; i <= 2; i++) {
                    for (let j = 0; j <= 2; j++) {
                        if ((i == 1) && (j == 1)) {
                        } else {
                            if (dir_c[i][j] == false) {
                                enf = false;
                                j = 2;
                                i = 2;
                            }
                        }
                    }
                }
            } while ((enf == false) && (c < cend));
            cend += 2;
        } while (n == 0);
        AngleSort.AddEnd()
        //メッシュに最も近いオブジェクトの距離を１とする

        let mind = O_Distance[0];
        for (let i = 0; i < O_Distance.length; i++) {
            mind = Math.min(mind, O_Distance[i])
            if (mind == 0) {
                return DataValue[O_Code[i]];
            }
        }
        for (let i = 0; i < n; i++) {
            O_Distance[i] = (O_Distance[i] / mind) //^ 2 ^2の数字を大きくすると一番近い位置の値が強調される
        }


        //30度以内に近接し、ある程度離れている点は、近い方を選択する
        let alimit = 25 * (3 - Math.max(ad.SoloModeViewSettings.ContourMD.Detailed - 1, 0)) + 30;

        let O_Distance_NoUseF = new Array(n).fill(false);
        let nn = n;
        let fa = AngleSort.DataPositionValue(0);
        let fai = 0;
        let ffa = fa;
        for (let i = 0; i < n; i++) {
            let So_fai = AngleSort.DataPosition(fai);
            let So_i = AngleSort.DataPosition(i);
            if ((AngleSort.DataPositionValue(i) - fa < alimit) && (AngleSort.DataPositionValue(i) - ffa < alimit) &&
                (Math.abs(O_Distance[So_fai] - O_Distance[So_i]) > 0.1)) {
                if (O_Distance[So_fai]  < O_Distance[So_i]) {
                    O_Distance_NoUseF[So_i] = true;
                } else {
                    O_Distance_NoUseF[So_fai] = true;
                    fai = i;
                    fa = AngleSort.DataPositionValue(i);
                }
                nn--;
            } else {
                fai = i;
                fa = AngleSort.DataPositionValue(i);
                ffa = fa;
            }
        }

        //最後と最初のオブジェクトの角度を比較する
        let OI;
        let a;
        for (let i = 0; i < n; i++) {
            if (O_Distance_NoUseF[AngleSort.DataPosition[i]] == false) {
                a = AngleSort.DataPositionValue(i);
                OI = i;
                break;
            }
        }
        if ((a - (fa - 360) < alimit) && (nn >= 2) && (a - (ffa - 360) < alimit) && (
            Math.abs(O_Distance[AngleSort.DataPosition(fai)] - O_Distance[AngleSort.DataPosition(OI)]) > 0.1)) {
            if (O_Distance[AngleSort.DataPosition(fai)] < O_Distance[AngleSort.DataPosition(OI)]) {
                O_Distance_NoUseF[AngleSort.DataPosition(OI)] = true;
            } else {
                O_Distance_NoUseF[AngleSort.DataPosition(fai)] = true;
            }
        }

        let SV = 0;
        let SU = 0;
        for (let i = 0; i < n; i++) {
            if (O_Distance_NoUseF[i] == false) {
                SV += DataValue[O_Code[i]] / O_Distance[i];
                SU += 1 / O_Distance[i];
            }
        }
        
        return SV / SU;
    }

    /**
 * Description placeholder
 *
 * @static
 * @param {*} Layernum 
 * @param {*} DataNum 
 * @returns {{ hn: number; Contour_High_M: {}; C_Line_Pat: {}; }} 
 */
static GetContourIntervalValue(Layernum: any, DataNum: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[Layernum];
        let ad = al.atrData.Data[DataNum];
        let Contour_High_M = [];
        let C_Line_Pat = [];//Line_Property
        let c_md = ad.SoloModeViewSettings.ContourMD;

        let hn = 0;
        switch (c_md.Interval_Mode) {
            case enmContourIntervalMode.RegularInterval: {
                let c_mdr = c_md.Regular;
                // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                hn =parseInt( (c_mdr.top - c_mdr.bottom) / c_mdr.Interval) + 1;
                let n = 0;
                let V = c_mdr.bottom;
                do {
                    Contour_High_M.push(V);
                    C_Line_Pat.push(c_mdr.Line_Pat.Clone());
                    n++;
                    V = c_mdr.bottom + n * c_mdr.Interval;
                } while (V < c_mdr.top);

                let n2 = 0;
                V = c_mdr.SP_Bottom;
                while (V < Math.min(c_mdr.SP_Top, c_mdr.top)) {
                    V = c_mdr.SP_Bottom + n2 * c_mdr.SP_interval
                    for (let j = 0; j < n; j++) {
                        if (V == Contour_High_M[j]) {
                            C_Line_Pat[j] = c_mdr.SP_Line_Pat.Clone();
                            break;
                        }
                    }
                    n2++;
                }

                if (c_mdr.EX_Value_Flag == true) {
                    for (let j = 0; j < n; j++) {
                        if (Contour_High_M[j] == c_mdr.EX_Value) {
                            C_Line_Pat[j] = c_mdr.EX_Line_Pat.Clone();
                        }
                    }
                }
                break;
            }
            case enmContourIntervalMode.SeparateSettings: {
                hn = c_md.IrregularNum
                for (let i = 0; i < hn; i++) {
                    Contour_High_M.push(c_md.Irregular[i].Value);
                    C_Line_Pat.push(c_md.Irregular[i].Line_Pat.Clone());
                }
                break;
            }
            case enmContourIntervalMode.ClassPaint: {
                hn = ad.SoloModeViewSettings.Div_Num - 1
                for (let i = 0; i < hn; i++) {
                    Contour_High_M.push(ad.SoloModeViewSettings.Class_Div[hn - 1 - i].Value);
                    C_Line_Pat.push(c_md.Regular.Line_Pat.Clone());
                }
                break;
            }
        }
        return { hn: hn, Contour_High_M: Contour_High_M, C_Line_Pat: C_Line_Pat }
    }

    ////文字モード
    /**
 * Description placeholder
 *
 * @static
 * @param {*} g 
 * @param {*} LayerNum 
 * @param {*} DataNum 
 */
static PrintStringMode(g: any,LayerNum: any, DataNum: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[LayerNum];
        let ad = al.atrData.Data[DataNum];
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F == true) {
            g.save();
            this.ClippingRegion_ObjectBoundary_set(g, [LayerNum], false, true);
        }
        if((al.Shape == enmShape.PolygonShape)|| (al.Shape == enmShape.LineShape)) {
            this.Vector_Object_Boundary(g, LayerNum);
        }
        this.Vector_Dummy_Boundary(g, LayerNum, true, true);
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Missing_DataArray = attrData.Get_Data_Cell_Array_With_MissingValue(LayerNum, DataNum);
        let InnerDT = ad.SoloModeViewSettings.MarkCommon.Inner_Data;
        let Category_Array_Inner = [];
        if(InnerDT.Flag == true) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            Category_Array_Inner = attrData.Get_CategolyArray(LayerNum, InnerDT.Data);
        }
        let smd = ad.SoloModeViewSettings.StringMD;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let H = attrData.Get_Length_On_Screen(smd.Font.Size);
        let Font = smd.Font.Clone();
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let xw = attrData.Get_Length_On_Screen(smd.maxWidth);
        let turnF = smd.WordTurnF;
        for (let i = 0; i < al.atrObject.ObjectNum; i++) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if((attrData.Check_Condition(LayerNum, i) == true) && (
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                (Missing_DataArray[i] == false) || (attrData.TotalData.ViewStyle.Missing_Data.Print_Flag == true))) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.TempData.ObjectPrintedCheckFlag[LayerNum][i] = true;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let tx = attrData.Get_Data_Value(LayerNum, DataNum, i, attrData.TotalData.ViewStyle.Missing_Data.Label);
                let CP = al.atrObject.atrObjectData[i].Label;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let LP = attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(CP);
                let atx = tx;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let d_an2 = clsDraw.TextCut_for_print(g, atx, Font, turnF, xw,  attrData.TotalData.ViewStyle.ScrData)
                let outTx = d_an2.Out_Text[0];
                for (let j = 1; j<d_an2.Out_Text.length; j++) {
                    outTx += "\n" + d_an2.Out_Text[j];
                }
                d_an2.Height *= d_an2.Out_Text.length;
                // @ts-expect-error TS(2554): Expected 4 arguments, but got 2.
                let rect = new rectangle(new point(LP.x - d_an2.RealWidth / 2, LP.y - d_an2.Height / 2), new size(d_an2.RealWidth, d_an2.Height));
                if(InnerDT.Flag == true) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    Font.Color = attrData.Get_InnerTile(InnerDT, LayerNum, Category_Array_Inner[i]).Color;
                }
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Draw_Print(g, outTx, new point(rect.left, rect.top), Font, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
            }
        }
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F == true) {
            g.restore();
        }
    }

    /**棒の高さモード */
    static PrintMarkBarMode(g: any, LayerNum: any, DataNum: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[LayerNum];
        let ad = al.atrData.Data[DataNum];
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F == true) {
            g.save();
            this.ClippingRegion_ObjectBoundary_set(g, [LayerNum], false, true);
        }
        if(al.Shape == enmShape.PolygonShape) {
            this.Vector_Object_Boundary(g, LayerNum);
        }
        this.Vector_Dummy_Boundary(g, LayerNum, true, true);
        this.Vector_Connect_CenterP_To_SymbolPoint(g, LayerNum);
        let MkCommon = ad.SoloModeViewSettings.MarkCommon;
        let InnerDT = MkCommon.Inner_Data;
        let Category_Array_Inner = [];
        if(InnerDT.Flag == true) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            Category_Array_Inner = attrData.Get_CategolyArray(LayerNum, InnerDT.Data);
        }
        let mbmd = ad.SoloModeViewSettings.MarkBarMD;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Objn = attrData.LayerData[LayerNum].atrObject.ObjectNum;

        //表示順序と表示の可否
        let D_Order: any = [];
        let ShowF: any = [];
        let MV_Array: any = [];
        let Missing_DataArray: any = [];
        let ObjP: any = [];
        this.getDrawOrder_and_ShowF_MarkMode(LayerNum, DataNum, enmSoloMode_Number.MarkBarMode, D_Order, ShowF, ObjP, Missing_DataArray, MV_Array);

        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let w = attrData.Get_Length_On_Screen(mbmd.Width);
        for (let i = 0; i < Objn; i++) {
            let num = D_Order[i];
            let MV = MV_Array[num];
            if(ShowF[num] == true){
                let OP = ObjP[num];
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.TempData.ObjectPrintedCheckFlag[LayerNum][num] = true;
                if(Missing_DataArray[num] == true) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let MK = attrData.TotalData.ViewStyle.Missing_Data.MarkBar;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let r = attrData.Radius(MK.WordFont.Size, 1, 1);
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.Draw_Mark(g, OP, r, MK);
                } else {
                    let maxv;
                    if(mbmd.MaxValueMode == enmMarkSizeValueMode.inDataItem) {
                        maxv = ad.Statistics.Max;
                    } else {
                        maxv = mbmd.MaxValue;
                    }
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let h = attrData.Get_Length_On_Screen(mbmd.MaxHeight) * MV / maxv;
                    let retV = this.MarkBarRectPrint(OP, w, h, mbmd.ThreeD);
                    let Tile;
                    if (MkCommon.Inner_Data.Flag == true) {
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        Tile = attrData.Get_InnerTile(MkCommon.Inner_Data, LayerNum, Category_Array_Inner[num]).Clone();
                    } else {
                        Tile = mbmd.InnerTile.Clone();
                    }
                    switch (mbmd.BarShape){
                        case enmMarkBarShape.triangle:{
                            let tri = [];
                            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                            tri.push(new point(OP.x - w / 2, OP.y));
                            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                            tri.push(new point(OP.x + w / 2, OP.y));
                            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                            tri.push(new point(OP.x, OP.y - h));
                            tri[3] = tri[0].Clone();
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            attrData.Draw_Poly_Inner(g, tri, [4], Tile);
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            attrData.Draw_Line(g, mbmd.FrameLinePat, tri);
                            break;
                        }
                        case enmMarkBarShape.bar:{
                            if (mbmd.ThreeD == true) {
                                let Ptile = Tile.Clone();
                                Ptile.Color = Generic.GetColorArrange(Tile.Color, 100);
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                attrData.Draw_Poly_Inner(g, retV.UpperPoly, [5], Ptile);
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                attrData.Draw_Line(g, mbmd.FrameLinePat, retV.UpperPoly)
        
                                let Ptile2 = Tile.Clone();
                                Ptile2.Color = Generic.GetColorArrange(Tile.Color, -100);
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                attrData.Draw_Poly_Inner(g, retV.RightPoly, [5], Ptile2)
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                attrData.Draw_Line(g, mbmd.FrameLinePat, retV.RightPoly)
                            }
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            attrData.Draw_Tile_Box(g, retV.CenterRect, mbmd.FrameLinePat, Tile, 0);
                            if (mbmd.ScaleLineVisible == true) {
                                for (let v = mbmd.ScaleLineInterval; v < MV; v += mbmd.ScaleLineInterval) {
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    let ypos = retV.CenterRect.bottom - attrData.Get_Length_On_Screen(mbmd.MaxHeight) * v / maxv;
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    attrData.Draw_Line(g, mbmd.scaleLinePat, new point(retV.CenterRect.left, ypos), new point(retV.CenterRect.right, ypos));
                                }
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                attrData.Draw_Tile_Box(g, retV.CenterRect, mbmd.FrameLinePat, clsBase.BlancTile(), 0);
                            }
                                    break;
                        }
                    }
                    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                    let OVP = new point(retV.CenterRect.left + retV.CenterRect.width() / 2, retV.CenterRect.bottom);
                    this.ObjectValue_and_Name_Print(g, OVP, enmVerticalAlignment.Top, LayerNum, DataNum, num);
                }
            }
        }
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F == true) {
            g.restore();
        }
    }

    /**
 * Description placeholder
 *
 * @static
 * @param {*} Pos 
 * @param {*} w 
 * @param {*} h 
 * @param {*} threeD 
 * @returns {{ rectAll: any; CenterRect: any; UpperPoly: {}; RightPoly: {}; }} 
 */
static MarkBarRectPrint(Pos: any, w: any, h: any, threeD: any) {
        // @ts-expect-error TS(2554): Expected 4 arguments, but got 2.
        let CenterRect= new rectangle(new point(Pos.x - w / 2, Pos.y - h), new size(w, h));
        let UpperPoly=[];
        let RightPoly=[];
        // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
        let TheeDS = parseInt(w / 3);
        let rectAll = CenterRect.Clone();
        if(threeD == true) {
            rectAll.top -= TheeDS;
            rectAll.right += TheeDS;
        }
        if(threeD == true) {
            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
            UpperPoly.push(new point(CenterRect.left, CenterRect.top));
            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
            UpperPoly.push(new point(CenterRect.right, CenterRect.top));
            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
            UpperPoly.push(new point(CenterRect.right + TheeDS, CenterRect.top - TheeDS));
            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
            UpperPoly.push(new point(CenterRect.left + TheeDS, CenterRect.top - TheeDS));
            UpperPoly.push(UpperPoly[0].Clone());

            RightPoly.push(UpperPoly[1].Clone());
            RightPoly.push(UpperPoly[2].Clone());
            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
            RightPoly.push(new point(RightPoly[1].x, UpperPoly[2].y+CenterRect.height()));
            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
            RightPoly.push(new point(RightPoly[0].x, CenterRect.bottom));
            RightPoly.push(UpperPoly[0].Clone());
        }
        return {rectAll:rectAll,CenterRect:CenterRect,UpperPoly:UpperPoly,RightPoly:RightPoly} ;
    }

    /**記号の数モード */
    static PrintMarkBlockMode(g: any, LayerNum: any, DataNum: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if(attrData.TempData.DotMap_Temp.DotMapTempResetF == true) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.TempData.DotMap_Temp.DotMapPoint = {};// New Dictionary(Of Integer, PointF())
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[LayerNum];
        let ad = al.atrData.Data[DataNum];
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F == true) {
            g.save();
            this.ClippingRegion_ObjectBoundary_set(g, [LayerNum], false, true);
        }
        if (al.Shape == enmShape.PolygonShape) {
            this.Vector_Object_Boundary(g, LayerNum);
        }
        this.Vector_Dummy_Boundary(g, LayerNum, true, true);
        this.Vector_Connect_CenterP_To_SymbolPoint(g, LayerNum);
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let MV_Array = attrData.Get_Data_Cell_Array_With_MissingValue(LayerNum, DataNum);
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Missing_DataArray = attrData.Get_Missing_Value_DataArray(LayerNum, DataNum);
        let MkCommon = ad.SoloModeViewSettings.MarkCommon;
        let InnerDT = MkCommon.Inner_Data;
        let Category_Array_Inner = [];
        if(InnerDT.Flag == true) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            Category_Array_Inner = attrData.Get_CategolyArray(LayerNum, InnerDT.Data);
        }
        let mbmd = ad.SoloModeViewSettings.MarkBlockMD;
        let BlockInterval;
        switch (mbmd.Overlap) {
            case 0:
                BlockInterval = 1.1;
                break;
            case 1:
                BlockInterval = 1;
                break;
            case 2:
                BlockInterval = 0.75;
                break;
            case 3:
                BlockInterval = 0.5;
                break;
            case 4:
                BlockInterval = 0.25;
                break;
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let r = attrData.Radius(mbmd.Mark.WordFont.Size, 1, 1);
        for (let i = 0; i < al.atrObject.ObjectNum; i++) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if((attrData.Check_Condition(LayerNum, i) == true) && (
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                (Missing_DataArray[i] == false) || (attrData.TotalData.ViewStyle.Missing_Data.Print_Flag == true))) {
                let MV = MV_Array[i];
                // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                let Block_n = parseInt(Math.abs(MV) / mbmd.Value);
                let Hasu = Math.abs(MV) - (mbmd.Value * Block_n);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let Hasu_R = attrData.Radius(mbmd.Mark.WordFont.Size, Hasu, mbmd.Value);
                let CP = al.atrObject.atrObjectData[i].Symbol;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let OP = attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(CP);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.TempData.ObjectPrintedCheckFlag[LayerNum][i] = true;
                if(Missing_DataArray[i] == true) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    Vector_Block_Draw_Block(g, LayerNum, i, OP, r, attrData.TotalData.ViewStyle.Missing_Data.BlockMark, 1, enmMarkBlockArrange.Block, false, 0, 0, 1);
                } else {
                    let MK = mbmd.Mark.Clone();
                    if(MkCommon.Inner_Data.Flag == true) {
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        MK.Tile = attrData.Get_InnerTile(MkCommon.Inner_Data, LayerNum, Category_Array_Inner[i]);
                        MK.WordFont.Color = MK.Tile.Line.Color;
                    } else {
                        if(MV < 0) {
                            MK.Tile = MkCommon.MinusTile;
                        }
                    }

                    let valPos = Vector_Block_Draw_Block(g, LayerNum, i, OP, r, MK, Block_n, mbmd.ArrangeB, mbmd.HasuVisible, Hasu_R, Hasu, BlockInterval);
                    this.ObjectValue_and_Name_Print(g,  valPos, enmVerticalAlignment.Top, LayerNum, DataNum, i);
                }
            }
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.TempData.DotMap_Temp.DotMapTempResetF = false;
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F == true) {
            g.restore();
        }

        function Vector_Block_Draw_Block(g: any, Layernum: any, ObjNum: any, OP: any, r: any, MK: any, Block_n: any, ArrangeB: any, HasuVisible: any, Hasu_R: any, Hasu: any, BlockInterval: any) {
            
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
            let ap = new point();
            let RetP = OP.Clone();
            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
            let r2 = spatial.Get_TurnedBox(new size(r, r), MK.WordFont.Kakudo).width;
            switch (ArrangeB) {
                case enmMarkBlockArrange.Block: {
                    let Q = Math.sqrt(Block_n);
                    let qx;
                    let qy;
                    // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                    if(Q != parseInt(Q)) {
                        // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                        qx = parseInt(Q) + 1;
                        if(Block_n <= qx * qx - qx) {
                            qy = qx - 1;
                        } else {
                            qy = qx;
                        }
                    } else {
                        // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                        qx = parseInt(Q);
                        // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                        qy = parseInt(Q);
                    }
                    if(qx == 0) {
                        // @ts-expect-error TS(2554): Expected 4 arguments, but got 6.
                        Vector_Block_Draw_Hasu(g,  OP, Hasu_R, MK, Hasu, HasuVisible);
                    }
                    OP.y -= (qy - 1) * r2 * BlockInterval;
                    OP.x -= (qx - 1) * r2 * BlockInterval;
                    let n = 0;
                    let k2;
                    let j2;
                    for (let k = 0; k < qy; k++) {
                        for (let j = 0; j < qx; j++) {
                            ap.y = OP.y + r2 * 2 * BlockInterval * k;
                            if(n < Block_n) {
                                ap.x = OP.x + r2 * 2 * BlockInterval * j;
                                ap.y = OP.y + r2 * 2 * BlockInterval * k;
                                Vector_Block_Arrange_OverLay_Block(ap, r, ArrangeB, Q);
                                Vector_Block_Draw_Block2(g, ap, r, MK);
                                k2 = k;
                                j2 = j;
                            }
                            n++;
                        }
                    }
                    if(Block_n > 0) {
                        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                        ap.x = OP.x + r2 * 2 * BlockInterval * (j2 + 0.5) + Hasu_R * BlockInterval;
                        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                        ap.y = OP.y + r2 * 2 * BlockInterval * (k2 - 0.5) + Hasu_R * BlockInterval;
                        Vector_Block_Arrange_OverLay_Block(ap, r, ArrangeB, Q);
                        // @ts-expect-error TS(2554): Expected 4 arguments, but got 6.
                        Vector_Block_Draw_Hasu(g, ap, Hasu_R, MK, Hasu, HasuVisible);
                    }
                    RetP.y += (r2 * 2 * BlockInterval * Math.max(qy, 1)) / 2;
                    break;
                }
                case enmMarkBlockArrange.Vertical: {
                    for (let j = 0; j < Block_n; j++) {
                        ap.y = OP.y - r2 * 2 * BlockInterval * j;
                        ap.x = OP.x;
                        Vector_Block_Arrange_OverLay_Block(ap, r, ArrangeB);
 
                        Vector_Block_Draw_Block2(g, ap, r, MK);
                    }
                    ap.y = OP.y - r2 * 2 * BlockInterval * (Block_n - 1) - r2 * BlockInterval - Hasu_R * BlockInterval;
                    ap.x = OP.x;
                    Vector_Block_Arrange_OverLay_Block(ap, r, ArrangeB);
                    // @ts-expect-error TS(2554): Expected 4 arguments, but got 6.
                    Vector_Block_Draw_Hasu(g, ap, Hasu_R, MK, Hasu, HasuVisible);
                    RetP.y += r2;
                    break;
                }
                case enmMarkBlockArrange.Horizontal: {
                    for (let j = 0; j < Block_n; j++) {
                        ap.x = OP.x + r2 * 2 * BlockInterval * (j - Block_n / 2 + 0.5);
                        ap.y = OP.y;
                        Vector_Block_Arrange_OverLay_Block(ap, r, ArrangeB);
                        Vector_Block_Draw_Block2(g, ap, r, MK);
                    }
                    ap.x = OP.x + r2 * 2 * BlockInterval * (Block_n - 1- Block_n / 2 + 0.5) + r2 * BlockInterval + Hasu_R * BlockInterval;
                    ap.y = OP.y;
                    Vector_Block_Arrange_OverLay_Block(ap, r, ArrangeB);
                    // @ts-expect-error TS(2554): Expected 4 arguments, but got 6.
                    Vector_Block_Draw_Hasu(g, ap, Hasu_R, MK, Hasu, HasuVisible);
                    RetP.y += r2;
                    break;
                }
                case enmMarkBlockArrange.Random: {
                    if(r == 0) {
                        let brush = MK.Tile.Line.Color.toRGBA();
                        g.fillStyle = brush;
                    }
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    if((attrData.TempData.DotMap_Temp.DotMapTempResetF == true) || (attrData.TempData.DotMap_Temp.DotMapPoint[ObjNum] == undefined)) {
                        let onP = [];
                        for (let j = 0; j < Block_n; j++) {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            let area = attrData.Get_Kencode_Object_Circumscribed_Rectangle(Layernum, ObjNum);
                            let inf = false
                            // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
                            let p = new point();
                            do {
                                p.x = Math.random() * area.width() + area.left;
                                p.y = Math.random() * area.height() + area.top;
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                inf = attrData.Check_Point_in_Kencode_OneObject(Layernum, ObjNum, p);
                            } while (inf == false);
                            onP.push(p);
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            ap = attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(p);
                            if(r != 0) {
                                Vector_Block_Draw_Block2(g, ap, r, MK);
                            } else {
                                g.fillRect(ap.x, ap.y, 1, 1);
                            }
                        }
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        attrData.TempData.DotMap_Temp.DotMapPoint[ObjNum] = onP;
                    } else {
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        let pOn = attrData.TempData.DotMap_Temp.DotMapPoint[ObjNum];
                        for (let j = 0; j < Block_n; j++) {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            ap = attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(pOn[j])
                            if(r != 0) {
                                Vector_Block_Draw_Block2(g, ap, r, MK);
                            } else {
                                g.fillRect(ap.x, ap.y, 1, 1);
                            }
                        }
                    }
                    break;
                }
            }
            return RetP;

            function Vector_Block_Draw_Block2(g: any, ap: any, r: any, MK: any) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                if(attrData.Check_Screen_In(ap, r) == true) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.Draw_Mark(g, ap, r, MK);
                }
            }
            function Vector_Block_Draw_Hasu(g: any,ap: any, Hasu_R: any, MK: any) {
                if((Hasu == 0) || (HasuVisible == false)) {
                    return;
                }
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                if(attrData.Check_Screen_In(ap, Hasu_R) == true) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.Draw_Mark(g, ap, Hasu_R, MK);
                }
            }
            function Vector_Block_Arrange_OverLay_Block(ap: any, r: any, ArrangeB: any, Q = 0) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let ot = attrData.TempData.OverLay_Temp;
                if((ot.OverLay_EMode_N >= 2) && (ot.OverLay_Printing_Flag == true)) {
                    switch (ArrangeB) {
                        case enmMarkBlockArrange.Block: {
                            let oh;
                            ap.x += ((ot.OverLay_EMode_Now % 2) * 2 - 1) * Q * r * 1.1;
                            switch (ot.OverLay_EMode_N) {
                                case 2:
                                    oh = 0;
                                    break;
                                default:
                                    // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                                    oh = parseInt(ot.OverLay_EMode_Now / 2);
                                    break;
                            }
                            ap.y += oh * r * Q * 1.1;
                            break;
                        }
                        case enmMarkBlockArrange.Vertical:
                            // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                            ap.x += ((ot.OverLay_EMode_Now - ot.OverLay_EMode_N + 1) - parseInt(ot.OverLay_EMode_N / 2)) * r * 2.2;
                            break;
                        case enmMarkBlockArrange.Horizontal:
                            // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                            ap.y += ((ot.OverLay_EMode_Now - ot.OverLay_EMode_N + 1) - parseInt(ot.OverLay_EMode_N / 2)) * r * 2.2;
                            break;
                    }
                }
            }
        }
    }

    //記号の大きさモード
    /**
 * Description placeholder
 *
 * @static
 * @param {*} g 
 * @param {*} LayerNum 
 * @param {*} DataNum 
 */
static PrintMarkSizeMode(g: any,  LayerNum: any, DataNum: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[LayerNum];
        let ad = al.atrData.Data[DataNum];
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let vs=attrData.TotalData.ViewStyle;
        let avvs=vs.ValueShow;
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F == true) {
            g.save();
            this.ClippingRegion_ObjectBoundary_set(g, [LayerNum], false, true);
        }
        if(al.Shape == enmShape.PolygonShape) {
            this.Vector_Object_Boundary(g,  LayerNum);
        }
        this.Vector_Dummy_Boundary(g,  LayerNum, true, true);
        let MkCommon = ad.SoloModeViewSettings.MarkCommon;
        let InnerDT = MkCommon.Inner_Data;
        let Category_Array_Inner = [];
        if(InnerDT.Flag == true) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            Category_Array_Inner = attrData.Get_CategolyArray(LayerNum, InnerDT.Data);
        }
        let msmd = ad.SoloModeViewSettings.MarkSizeMD;

        //表示順序と表示の可否
        let D_Order: any=[];
        let ShowF: any=[];
        let MV_Array: any=[];
        let Missing_DataArray: any=[];
        let ObjP: any=[];
        this.getDrawOrder_and_ShowF_MarkMode(LayerNum, DataNum, enmSoloMode_Number.MarkSizeMode, D_Order, ShowF, ObjP, Missing_DataArray, MV_Array);

        for (let i = 0; i < al.atrObject.ObjectNum; i++) {
            let kpos = D_Order[i];
            let MV = MV_Array[kpos];
            let MK = msmd.Mark.Clone();
            if (ShowF[kpos] == true) {
                if (InnerDT.Flag == true) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    MK.Tile = attrData.Get_InnerTile(InnerDT, LayerNum, Category_Array_Inner[kpos]);
                    MK.WordFont.Color = MK.Tile.Color;
                } else {
                    if (MV < 0) {
                        MK.Tile = MkCommon.MinusTile;
                        MK.WordFont.Color = MkCommon.MinusTile.Color;
                    }
                }
                let r = this.PrintMarkSizeMode_Draw(g, LayerNum, DataNum, kpos, ObjP[kpos], MK, MV, Missing_DataArray[kpos]);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.TempData.ObjectPrintedCheckFlag[LayerNum][kpos] = true;
                if ((avvs.ObjNameVisible == true) || (avvs.ValueVisible == true)) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let name = attrData.Get_KenObjName(LayerNum, kpos);
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let V = attrData.Get_Data_Value(LayerNum, DataNum, kpos, "欠損値");
                    let OP = ObjP[kpos];
                    let xs = 0;
                    if (avvs.ObjNameVisible == true) {
                        g.font = avvs.ObjNameFont.toContextFont(vs.ScrData);
                        xs = g.measureText(name).width;
                    }
                    if (avvs.ValueVisible == true) {
                        g.font = avvs.ValueFont.toContextFont(vs.ScrData);
                        xs = Math.max(xs, g.measureText(V).width);
                    }

                    if ((xs < r * 2) || (al.Shape == enmShape.LineShape)) {
                        this.ObjectValue_and_Name_Print(g, OP, enmVerticalAlignment.Center, LayerNum, DataNum, kpos);
                    } else {
                        let OVP = OP.Clone();
                        OVP.y += r;;
                        this.ObjectValue_and_Name_Print(g, OVP, enmVerticalAlignment.Top, LayerNum, DataNum, kpos);
                    }
                }
            }
    }
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F == true) {
            g.restore();
        }
    }

    
    /**
 * Description placeholder
 *
 * @static
 * @param {*} g 
 * @param {*} Layernum 
 * @param {*} DataNum 
 * @param {*} kpos 
 * @param {*} pos 
 * @param {*} MK 
 * @param {*} MV 
 * @param {*} MisF 
 * @returns {*} 
 */
static PrintMarkSizeMode_Draw(g: any, Layernum: any, DataNum: any, kpos: any,pos: any, MK: any, MV: any, MisF: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[Layernum];
        let ad = al.atrData.Data[DataNum];
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let vs=attrData.TotalData.ViewStyle;

        let mmv = ad.SoloModeViewSettings.MarkSizeMD;
        let InnerDT = ad.SoloModeViewSettings.MarkCommon.Inner_Data;
        let maxv;
        if(mmv.MaxValueMode == enmMarkSizeValueMode.inDataItem) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            maxv = Math.max(Math.abs(attrData.Get_DataMax(Layernum, DataNum)), Math.abs(attrData.Get_DataMin(Layernum, DataNum)));
        } else {
            maxv = mmv.MaxValue;
        }
        switch (al.Shape) {
            case  enmShape.PointShape:
            case enmShape.PolygonShape:
                let r;
                if(MisF == true) {
                    MK = vs.Missing_Data.Mark;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    r = attrData.Radius(MK.WordFont.Size, 1, 1);
                } else {

                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    r = attrData.Radius(mmv.Mark.WordFont.Size, Math.abs(MV), maxv);
                }
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Draw_Mark(g, pos, r, MK);
                    return r;
                break;
            case enmShape.LineShape:
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                if(attrData.Check_screen_Kencode_In(Layernum, kpos) == true) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.TempData.ObjectPrintedCheckFlag[Layernum][kpos] = true;
                    let LineSize = Math.abs(MV) / maxv * mmv.LineShape.LineWidth;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let ELine = attrData.Get_Enable_KenCode_MPLine(Layernum, kpos);
                    for (let j = 0; j < ELine.length; j++) {
                        let mpl = al.MapFileData.MPLine[ELine[j].LineCode];
                        let np= mpl.NumOfPoint;
                        let pxy = vs.ScrData.Get_SxSy_With_3D(np, mpl.PointSTC, false);

                        let LineShapeLine;
                        if(MisF == true) {
                            LineShapeLine = vs.Missing_Data.LineShape;
                        } else {
                            LineShapeLine = clsBase.Line();
                            if(InnerDT.Flag == true) {
                                LineShapeLine.Set_Same_ColorWidth_to_LinePat(MK.WordFont.Color, LineSize);
                            } else {
                                LineShapeLine.Set_Same_ColorWidth_to_LinePat(mmv.LineShape.Color, LineSize);
                            }
                            LineShapeLine.Edge_Connect_Pattern = mmv.Mark.Line.Edge_Connect_Pattern;
                        }
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        attrData.Draw_Line(g, LineShapeLine,  pxy);
                    }
                }
                break;
        }
    }

    /**線モード */
    static PrintClassODMode(g: any, LayerNum: any, DataNum: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Category_Array = attrData.Get_CategolyArray(LayerNum, DataNum);
        let DrawOrderByValue = this.ClassMode_Point_Shape_DrawOrder(LayerNum, DataNum);
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[LayerNum];
        let ad = al.atrData.Data[DataNum];
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F == true) {
            g.save();
            this.Vector_Dummy_Boundary(g, LayerNum, true, false);
            this.ClippingRegion_ObjectBoundary_set(g, [LayerNum], false, true);
        }

        this.Vector_Object_Boundary(g, LayerNum);
        this.Vector_Dummy_Boundary(g, LayerNum, true, true);
        let OD_MD = ad.SoloModeViewSettings.ClassODMD;

        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let adobl=attrData.LayerData[OD_MD.o_Layer];
        let StartFP;
        if(OD_MD.Dummy_ObjectFlag == true) {
            StartFP=al.MapFileData.Get_Enable_CenterP(adobl.Dummy[OD_MD.O_object].code, adobl.Time);
        } else {
            StartFP = adobl.atrObject.atrObjectData[OD_MD.O_object].CenterPoint;
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let StartP = attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(StartFP);

        for (let i = 0; i < al.atrObject.ObjectNum; i++) {
            let DrawOrder;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            switch (attrData.TotalData.ViewStyle.PointPaint_Order) {
                case enmPointOnjectDrawOrder.ObjectOrder:
                    DrawOrder = i;
                    break;
                case enmPointOnjectDrawOrder.LowerToUpperCategory:
                    DrawOrder = DrawOrderByValue.DataPosition(i);
                    break;
                case enmPointOnjectDrawOrder.UpperToLowerCategory:
                    DrawOrder = DrawOrderByValue.DataPositionRev(i);
                    break;
            }
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if((attrData.Check_Condition(LayerNum, DrawOrder) == true) && (Category_Array[DrawOrder] != -1) && (DrawOrder != OD_MD.O_object)) {
                let colpos = Category_Array[DrawOrder];
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.TempData.ObjectPrintedCheckFlag[LayerNum][DrawOrder] = true;
                let DestFP = al.atrObject.atrObjectData[DrawOrder].CenterPoint;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let DestP = attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(DestFP);
                let C_Rect = spatial.getCircumscribedRectangle(DestP, StartP);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                if((attrData.Check_Screen_In(C_Rect) == true) && (DestFP.Equals(StartFP) == false)) {
                    let ODLinePat = ad.SoloModeViewSettings.Class_Div[colpos].ODLinePat;
                    if(ODLinePat.BlankF == false) {
                        let retV = al.Get_OD_Bezier_RefPoint(DrawOrder, DataNum);
                        let SplineRefP=retV.RefPoint;
                        if(retV.ok == false) {
                            //曲線近似でない場合
                            if((OD_MD.Arrow.End_Arrow_F == true) && (OD_MD.Arrow.ArrowHeadType == enmArrowHeadType.Fill)) {
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                let Cp = clsDrawLine.Check_Draw_Arrow_Line( DestFP, StartFP, DestFP, StartFP, ODLinePat, OD_MD.Arrow, attrData.TotalData.ViewStyle.ScrData);
                                if(Cp !=undefined) {
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    DestP = attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(Cp);
                                }
                            }
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            attrData.Draw_Line(g, ODLinePat, StartP, DestP);
                            if(OD_MD.Arrow.End_Arrow_F == true) {
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                attrData.Draw_Arrow(g, DestFP, StartFP, ODLinePat, OD_MD.Arrow);
                            }
                        } else {
                            //曲線近似の場合
                            let Refp = Generic.Get_OD_Spline_Point(SplineRefP, StartFP, DestFP);
                            
                            if((OD_MD.Arrow.End_Arrow_F == true) && (OD_MD.Arrow.ArrowHeadType == enmArrowHeadType.Fill)) {
                                //塗りつぶしの矢印付き
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                let Cp= clsDrawLine.Check_Draw_Arrow_Line( DestFP, Refp[1], Refp[1], Refp[0], ODLinePat, OD_MD.Arrow, attrData.TotalData.ViewStyle.ScrData);
                                if(Cp !=undefined) {
                                    Refp[0] = Cp;
                                } else {
                                    Refp[0] = Refp[1].Clone();
                                }
                            }
                            let ln = 4;
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            let pxy = clsSpline.Spline_Get(0, ln, Refp, 0.05, attrData.TotalData.ViewStyle.ScrData);
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            attrData.Draw_Line(g, ODLinePat, pxy);

                            if(OD_MD.Arrow.End_Arrow_F == true) {
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                attrData.Draw_Arrow(g, DestFP, Refp[1], ODLinePat, OD_MD.Arrow);
                            }
                        }
                    }
                }
            }
        }
        this.ObjectValue_And_Name_Print_byLayer(g,  LayerNum, DataNum);
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F == true) {
            g.restore();
        }
    }
    /**階級区分モードの線形状オブジェクトの線モード */
    static PrintClassLineShapeSENMode(g: any, LayerNum: any, DataNum: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[LayerNum];
        let ad = al.atrData.Data[DataNum];
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F == true) {
            g.save();
            this.Vector_Dummy_Boundary(g, LayerNum, true, false);
            this.ClippingRegion_ObjectBoundary_set(g, [LayerNum], false, true);
        }

        this.Vector_Dummy_Boundary(g, LayerNum, true, true);
        let Category_Array: any=[];
        let ShowF: any=[];
        let D_Order: any=[];
        this.getDrawOrder_and_ShowF_ClassMode(LayerNum, DataNum, Category_Array, D_Order, ShowF);

        for (let i = 0; i < al.atrObject.ObjectNum; i++) {
            let DrawOrder=D_Order[i];
            if(ShowF[DrawOrder]== true) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.TempData.ObjectPrintedCheckFlag[LayerNum][DrawOrder] = true;
                let colpos = Category_Array[DrawOrder];
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                if(attrData.Check_screen_Kencode_In(LayerNum, DrawOrder) == true) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let ELine = attrData.Get_Enable_KenCode_MPLine(LayerNum, DrawOrder);
                    let LineShapeLine;
                    if(colpos == -1) {
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        LineShapeLine = attrData.TotalData.ViewStyle.Missing_Data.LineShape;
                    } else {
                        LineShapeLine = ad.SoloModeViewSettings.Class_Div[colpos].ODLinePat;
                    }
                    for (let j = 0; j <ELine.length; j++) {
                        let pxy = this.Get_PointXY_by_LineCode(LayerNum, ELine[j].LineCode, false);
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        attrData.Draw_Line(g, LineShapeLine, pxy);
                    }
                }
            }
        }
        this.ObjectValue_And_Name_Print_byLayer(g,  LayerNum, DataNum);
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F == true) {
            g.restore();
        }
    }

    //階級記号モード
    /**
 * Description placeholder
 *
 * @static
 * @param {*} g 
 * @param {*} LayerNum 
 * @param {*} DataNum 
 */
static PrintClassMarkMode(g: any, LayerNum: any, DataNum: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al= attrData.LayerData[LayerNum];
        let ad = al.atrData.Data[DataNum];
        if(al.Shape == enmShape.PolygonShape) {
            this.Vector_Object_Boundary(g, LayerNum);
            this.Class_Category_Boundary(g, LayerNum, DataNum);
        }
        this.Vector_Dummy_Boundary(g, LayerNum, true, true)
        this.Vector_Connect_CenterP_To_SymbolPoint(g, LayerNum);

        let Category_Array: any=[];
        let ShowF: any=[];
        let D_Order: any=[];
        this.getDrawOrder_and_ShowF_ClassMode(LayerNum, DataNum, Category_Array, D_Order, ShowF);
        let InnerDT = ad.SoloModeViewSettings.ClassMarkMD;
        let Category_Array_Inner;
        if(InnerDT.Flag == true) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            Category_Array_Inner = attrData.Get_CategolyArray(LayerNum, InnerDT.Data);
        }

        for (let i = 0; i < al.atrObject.ObjectNum; i++) {
            let DrawOrder = D_Order[i];
            if (ShowF[DrawOrder] == true) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.TempData.ObjectPrintedCheckFlag[LayerNum][DrawOrder] =true;
                let colpos = Category_Array[DrawOrder];
                let MK;
                if(colpos == -1) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    MK = attrData.TotalData.ViewStyle.Missing_Data.ClassMark.Clone();
                } else {
                    MK = ad.SoloModeViewSettings.Class_Div[colpos].ClassMark.Clone();
                }
                if(InnerDT.Flag == true) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    MK.Tile = attrData.Get_InnerTile(InnerDT, LayerNum, Category_Array_Inner[DrawOrder]);
                    MK.WordFont.Color = MK.Tile.Color.Clone();
                }
                let CP = al.atrObject.atrObjectData[DrawOrder].Symbol;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let vs = attrData.TotalData.ViewStyle.ScrData;
                let OP = vs.Get_SxSy_With_3D(CP);
                let r = vs.Radius(MK.WordFont.Size, 1, 1);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let ot = attrData.TempData.OverLay_Temp;
                OP = this.getOverlayMarkPosition(OP, r);
                // if(ot.OverLay_Printing_Flag == true) {
                //     if(ot.OverLay_EMode_N >= 2) {
                //         let a;
                //         if(ot.OverLay_EMode_N == 2) {
                //             a = 0;
                //         } else {
                //             a = -1;
                //         }
                //         OP.x += ((ot.OverLay_EMode_Now % 2) * 2 - 1) * r / 2;
                //         OP.y += (parseInt(ot.OverLay_EMode_Now / 2) + a) * r;
                //     }
                // }
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Draw_Mark(g, OP, r, MK);
                let OVP = OP.Clone();
                OVP.y += r;
                this.ObjectValue_and_Name_Print(g,  OVP, enmVerticalAlignment.Top, LayerNum, DataNum, DrawOrder);
            }
        }


    }

    //ペイントモード
    /**
 * Description placeholder
 *
 * @static
 * @param {*} g 
 * @param {*} LayerNum 
 * @param {*} DataNum 
 */
static PrintClassPaintMode(g: any, LayerNum: any, DataNum: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[LayerNum];
        let ad = al.atrData.Data[DataNum];
        let LayerShape = al.Shape;
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F == true) {
            g.save();
            if (LayerShape != enmShape.PolygonShape) {
                this.Vector_Dummy_Boundary(g, LayerNum, true, false);
            }
            let f2=this.ClippingRegion_ObjectBoundary_set(g, [LayerNum], false, true);
            if (LayerShape != enmShape.PolygonShape) {
                this.Vector_Object_Boundary(g, LayerNum);
                this.Vector_Dummy_Boundary(g, LayerNum, (f2==false), true);
            }
        } else {
            if (LayerShape != enmShape.PolygonShape) {
                this.Vector_Object_Boundary(g, LayerNum);
                this.Vector_Dummy_Boundary(g, LayerNum, true, true);
            }
        }
        let Category_Array: any=[];
        let ShowF: any=[];
        let D_Order: any=[];
        this.getDrawOrder_and_ShowF_ClassMode(LayerNum, DataNum, Category_Array, D_Order, ShowF);


        let pointR;
        let PointLayerMark;
        if(LayerShape == enmShape.PointShape) {
            this.Vector_Connect_CenterP_To_SymbolPoint(g, LayerNum);
            PointLayerMark = al.LayerModeViewSettings.PointLineShape.PointMark.Clone();
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            pointR = attrData.TotalData.ViewStyle.ScrData.Radius(PointLayerMark.WordFont.Size, 1, 1);
        }
        for (let i = 0; i < al.atrObject.ObjectNum; i++) {
            let DrawOrder = D_Order[i];
            if (ShowF[DrawOrder] == true) {
                let colpos = Category_Array[DrawOrder];
                // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
                let col = new colorRGBA();
                if (colpos != -1) {
                    col = ad.SoloModeViewSettings.Class_Div[colpos].PaintColor;
                }
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.TempData.ObjectPrintedCheckFlag[LayerNum][DrawOrder] = true;
                let CP = al.atrObject.atrObjectData[DrawOrder].Symbol;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let OP = attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(CP);
                switch (LayerShape) {
                    case enmShape.PointShape: {
                        PointLayerMark = al.LayerModeViewSettings.PointLineShape.PointMark.Clone();
                        if (colpos == -1) {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            PointLayerMark.Tile = attrData.TotalData.ViewStyle.Missing_Data.PaintTile.Clone();
                        } else {
                            PointLayerMark.Tile.BlankF = false;
                            PointLayerMark.Tile.Color = col;
                            PointLayerMark.WordFont.Color = col;
                        }
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        attrData.Draw_Mark(g, OP, pointR, PointLayerMark);
                        let OVP = OP.Clone();
                        OVP.y += pointR;
                        this.ObjectValue_and_Name_Print(g, OVP, enmVerticalAlignment.Top, LayerNum, DataNum, DrawOrder);
                        break;
                    }
                    case enmShape.LineShape: {
                        let penw = al.LayerModeViewSettings.PointLineShape.LineWidth;
                        let LineShapeLine;
                        if (colpos == -1) {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            LineShapeLine = attrData.TotalData.ViewStyle.Missing_Data.LineShape.Clone();
                        } else {
                            LineShapeLine = clsBase.Line();
                            LineShapeLine.Color = col;
                            LineShapeLine.Width = penw;
                        }
                        LineShapeLine.Edge_Connect_Pattern = al.LayerModeViewSettings.PointLineShape.LineEdge;

                        if (al.Type == enmLayerType.Mesh) {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            let pxy = attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(al.atrObject.atrObjectData[DrawOrder].MeshPoint);
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            attrData.Draw_Line(g, LineShapeLine, pxy);
                        } else {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            let ELine = attrData.Get_Enable_KenCode_MPLine(LayerNum, DrawOrder);
                            for (let j = 0; j < ELine.length; j++) {
                                let pxy = this.Get_PointXY_by_LineCode(LayerNum, ELine[j].LineCode, false);
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                attrData.Draw_Line(g, LineShapeLine, pxy);
                            }
                        }
                        break;
                    }
                    case enmShape.PolygonShape: {
                        if (colpos == -1) {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            let mistile=attrData.TotalData.ViewStyle.Missing_Data.PaintTile;
                            if(mistile.BlankF==false){
                                this.PaintOnePolygonObject(g, LayerNum, DrawOrder, mistile.Color);
                            }
                        } else {
                            this.PaintOnePolygonObject(g, LayerNum, DrawOrder, col);
                        }
                        break;
                    }
                }
            }
        }
        if(LayerShape == enmShape.PolygonShape) {
           this.Vector_Object_Boundary(g,  LayerNum);
            this.Class_Category_Boundary(g, LayerNum, DataNum);
            for (let i = 0; i < al.atrObject.ObjectNum; i++) {
                let DrawOrder = D_Order[i];
                if (ShowF[DrawOrder] == true) {
                    let CP = al.atrObject.atrObjectData[DrawOrder].Symbol;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let OP = attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(CP);
                        this.ObjectValue_and_Name_Print(g, OP, enmVerticalAlignment.Center, LayerNum, DataNum, DrawOrder);
                }
            }
        }
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F == true) {
            g.restore();
            this.Vector_Dummy_Boundary(g,  LayerNum, true, false);
        }else{
            this.Vector_Dummy_Boundary(g,  LayerNum, true, true);
        }
    }

    /**階級区分ごとの境界線 */
    static Class_Category_Boundary(g: any, Layernum: any, DataNum: any){
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[Layernum];
        let ad = al.atrData.Data[DataNum];
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let av = attrData.TotalData.ViewStyle;
        if ((av.MapLegend.ClassMD.ClassBoundaryLine.Visible == false) || (al.Type == enmLayerType.Mesh)) {
            return;
        }

        let Alin = al.MapFileData.Map.ALIN;
        let objN = al.atrObject.ObjectNum;
        let StacLine = new Array(Alin).fill(0);
        let sti = 0;
        if ((av.Missing_Data.Print_Flag == true) && (ad.MissingValueNum != 0)) {
            sti = -1;
        }

        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Category_Array = attrData.Get_CategolyArray(Layernum, DataNum);
        for (let i = sti; i < ad.SoloModeViewSettings.Div_Num; i++) {
            let MultiObj = [];
            for (let j = 0; j < objN; j++) {
                if (Category_Array[j] == i) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    if ((attrData.Check_Condition(Layernum, j) == true) && (
                        (Category_Array[j] != -1) || (av.Missing_Data.Print_Flag == true))) {
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        if (attrData.Check_screen_Kencode_In(Layernum, j) == true) {
                            MultiObj.push(j);
                        }
                    }
                }
            }
            if (MultiObj.length > 0) {
                let ELine = this.Gey_Multi_Object_OuterLineCode(Layernum, MultiObj, false);
                for (let j = 0; j < ELine.length; j++) {
                    StacLine[ELine[j].LineCode]++;
                }
            }
        }

        for (let i = 0; i < Alin; i++) {
            if (StacLine[i] == 2) {
                let pxy = this.Get_PointXY_by_LineCode(Layernum, i,false);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Draw_Line(g, av.MapLegend.ClassMD.ClassBoundaryLine.LPat, pxy);
            }
        }
    }

    /**
 * Description placeholder
 *
 * @static
 * @param {*} g 
 * @param {*} Layernum 
 */
static Vector_Object_Boundary(g: any,  Layernum: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let ad = attrData.LayerData[Layernum];
        if((ad.Shape == enmShape.LineShape)||(ad.Shape == enmShape.PointShape)|| (ad.Type == enmLayerType.Trip)) {

        } else {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if((ad.Type == enmLayerType.Mesh) && (attrData.TotalData.ViewStyle.MeshLine.BlankF == true)) {
                //メッシュで透明の場合は描画しない
            } else {
                for (let i = 0; i < ad.atrObject.ObjectNum; i++) {
                    let vf = false;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    if(attrData.TotalData.ViewStyle.InVisibleObjectBoundaryF == true) {
                        vf = true;
                    } else {
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        vf = attrData.Check_Condition(Layernum, i);
                    }
                    if(vf == true) {

                        this.Vector_Boundary_Draw(g,  Layernum, i, false);
                    }
                }
            }
        }
    }

    /**
 * Description placeholder
 *
 * @static
 * @param {*} g 
 * @param {*} Layernum 
 * @param {*} Obj_Num_code 
 * @param {*} Dummy_F 
 */
static Vector_Boundary_Draw(g: any,  Layernum: any, Obj_Num_code: any, Dummy_F: any) {
        let ELine = []// clsMapData.EnableMPLine_Data
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let ad = attrData.LayerData[Layernum];
        let pxy = [];// Point
        if(Dummy_F == true) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if(attrData.Check_Screen_Objcode_In(Layernum, Obj_Num_code) == false) {
                return;
            } else {
                ELine = ad.MapFileData.Get_EnableMPLine( Obj_Num_code, ad.Time);
            }
        } else {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if(attrData.Check_screen_Kencode_In(Layernum, Obj_Num_code) == false) {
                return;
            }
            if(ad.Type == enmLayerType.Mesh) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                pxy = attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(ad.atrObject.atrObjectData[Obj_Num_code].MeshPoint);
                pxy.push(pxy[0].Clone())
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Draw_Line(g, attrData.TotalData.ViewStyle.MeshLine, pxy);
                return;
            } else {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                ELine = attrData.Get_Enable_KenCode_MPLine( Layernum, Obj_Num_code);
            }
        }
        let MPFileNapa = ad.MapFileName;
        for (let j = 0; j < ELine.length; j++) {
            let lc = ELine[j].LineCode;
            let lcc = ELine[j].Kind;
            let PatNum = ad.ObjectGroupRelatedLine[lc];
            if(PatNum == undefined) {
                PatNum = 0;
            }
            let Lpat = ad.MapFileData.LineKind[lcc].ObjGroup[PatNum].Pattern;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if((Lpat.BlankF==false) && (attrData.getMpLineDrawn(MPFileNapa, lc) != true)) {
                let pxy = this.Get_PointXY_by_LineCode(Layernum, lc, false);
                if(pxy != undefined) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.Draw_Line(g, Lpat, pxy);
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.setMpLineDrawn(MPFileNapa, lc, true);
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.setLineKindUseChecked(MPFileNapa, lcc, PatNum, true);
                    }
            }
        }
    }


    /**
 * Description placeholder
 *
 * @static
 * @param {*} g 
 * @param {*} Layernum 
 * @param {*} ObjNum 
 * @param {*} ocol 
 * @returns {boolean} 
 */
static PaintOnePolygonObject(g: any, Layernum: any, ObjNum: any, ocol: any) {
        let Polydata = this.Get_OnePolygonObject_Boundary( Layernum, ObjNum, false);
        if(Polydata.Pon > 0) {
            clsDraw.DrawPolyPolygon(g, Polydata, ocol.toRGBA());
            return true;
        } else {
            return false;
        }
    }

    /**代表点と記号表示位置を線で結ぶ */
    static Vector_Connect_CenterP_To_SymbolPoint(g: any, Layernum: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let av = attrData.TotalData.ViewStyle;
        if (av.SymbolLine.Visible == false) {
            return;
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if ((attrData.TempData.OverLay_Temp.OverLay_Printing_Flag == true) && (attrData.TempData.OverLay_Temp.OverLay_EMode_N >= 2)) {
            return;
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[Layernum];
        for (let i = 0; i < al.atrObject.ObjectNum; i++) {
            let cp = al.atrObject.atrObjectData[i].CenterPoint;
            let sp = al.atrObject.atrObjectData[i].Symbol;
            if (cp.Equals(sp) == false) {
                let cp2 = av.ScrData.Get_SxSy_With_3D(cp);
                let sp2 = av.ScrData.Get_SxSy_With_3D(sp);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Draw_Line(g, av.SymbolLine.Line, cp2, sp2);
            }
        }
    }


    /**階級区分モードで点・線オブジェクトの場合で、オブジェクトの描画順で使用するソートクラスを作成する */
    static ClassMode_Point_Shape_DrawOrder( LayerNum: any, DataNum: any) {
        let en_sort = [];
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let s=new clsSortingSearch();
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if(attrData.TotalData.ViewStyle.PointPaint_Order != enmPointOnjectDrawOrder.ObjectOrder) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            en_sort = attrData.Get_Data_Cell_Array_With_MissingValue(LayerNum, DataNum, false);
            s.AddRange(en_sort);
        }
        return s;
    }

    /**
 * Description placeholder
 *
 * @static
 * @param {*} Layernum 
 * @param {*} O_ObjNum_Code 
 * @param {*} Dummy_F 
 * @returns {PolydataInfo} 
 */
static Get_OnePolygonObject_Boundary( Layernum: any, O_ObjNum_Code: any, Dummy_F: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let ad = attrData.LayerData[Layernum];
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let Polydata = new PolydataInfo();
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let badata = new boundArrangeData();        
        if(Dummy_F == false) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if(attrData.LayerData[Layernum].Type == enmLayerType.Mesh) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let pxy = attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(ad.atrObject.atrObjectData[O_ObjNum_Code].MeshPoint);
                let nPolyP = [];
                nPolyP[0] = pxy.length;
                if(pxy.length >= 4) {
                    //メッシュオブジェクトで計算誤差による白抜けが入るのを防ぐ処置
                    pxy[1].x++;
                    pxy[2].x++;
                    pxy[2].y++;
                    pxy[3].y++;
                }
                Polydata.Pon = 1;
                Polydata.pxy = pxy;
                Polydata.nPolyP = nPolyP;
                return Polydata;
            } else {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                badata = attrData.Boundary_Kencode_Arrange(Layernum, O_ObjNum_Code);
            }
        } else {
            badata = ad.MapFileData.Boundary_Arrange(O_ObjNum_Code, ad.Time);
        }
        if(badata.Pon <= 0) {
            Polydata.Pon = 0;
        } else {
            Polydata = this.Get_Boundary_XY( Layernum, badata);
        }
        return Polydata;
    }

    //指定されたラインをポリゴン化したXY座標を返す
    /**
 * Description placeholder
 *
 * @static
 * @param {*} Layernum 
 * @param {*} badata 
 * @returns {PolydataInfo} 
 */
static Get_Boundary_XY(Layernum: any, badata: any) {
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let poly = new PolydataInfo();

        let Pon = badata.Pon;
        let Arrange_LineCode = badata.Arrange_LineCode;
        let Fringe = badata.Fringe;

        let nPolyP = [];
        let pxy = [];
        for (let i = 0; i < badata.Pon; i++) {
            let pxytemp = [];
            let np2 = 0;
            let f = true;
            for (let j = 0; j < Arrange_LineCode[i][1]; j++) {
                let revf;
                if (Fringe[Arrange_LineCode[i][0] + j].Direction == 1) {
                    revf = false;
                } else {
                    revf = true;
                }
                let L = Fringe[Arrange_LineCode[i][0] + j].code;
                pxytemp = this.Get_PointXY_by_LineCode(Layernum, L, revf);
                if ((pxytemp == undefined) && (Arrange_LineCode[i][1] == 1)) {
                    Pon--;
                    f = false;
                } else {
                    //座標配列をコピーする
                    let ntp = pxytemp.length;
                    for (let k = 0; k < ntp; k++) {
                        pxy.push(pxytemp[k].Clone());
                    }
                    np2 += ntp;
                }
            }

            if (f == true) {
                nPolyP.push(np2);
            }
        }
        poly.Pon = Pon;
        poly.nPolyP = nPolyP;
        poly.pxy = pxy;
        return poly;
    }

    //指定したラインコードの座標を変換して取得
    /**
 * Description placeholder
 *
 * @static
 * @param {*} Layernum 
 * @param {*} LCode 
 * @param {*} ReverseGetF 
 * @returns {*} 
 */
static Get_PointXY_by_LineCode(Layernum: any, LCode: any, ReverseGetF: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let ad = attrData.LayerData[Layernum];
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let av = attrData.TotalData.ViewStyle;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let at=attrData.TempData;
        let mpfilename = ad.MapFileName;
        if((av.SouByou.Auto==true) || (av.SouByou.LoopAreaF == true)&&(av.SouByou.LoopSize != 0)) {
           let men =at.SoubyouLoopLineArea[Layernum][LCode];
           if(men >0) {
               let Check_S;
               if(av.SouByou.Auto==true){
                Check_S = at.SoubyouLoopAreaCriteria;
               }else{
                Check_S = av.SouByou.LoopSize;
               }
               if(men < Check_S) {
                   return undefined;
               }
           }
        }

        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let pxy = attrData.Get_MPSubLineXY(mpfilename, LCode, ReverseGetF);
        if (pxy == undefined) {
            //まだ計算していないライン
            let np = ad.MapFileData.MPLine[LCode].NumOfPoint;
            pxy = [];
            let spxy = Generic.ArrayClone(ad.MapFileData.MPLine[LCode].PointSTC);
            if ((av.SouByou.Auto == true) || (av.SouByou.ThinningPrint_F == true) && (av.SouByou.PointInterval != 0)) {
                if (at.SoubyouLayerEnable[Layernum] == true) {
                    if (av.SouByou.Auto == true) {
                        spxy = ad.MapFileData.Smoothing_Line(spxy, at.SoubyouLinePointIntervalCriteria)
                    } else if (av.SouByou.ThinningPrint_F == true) {
                        spxy = ad.MapFileData.Smoothing_Line(spxy, av.SouByou.PointInterval);
                    }
                }
                np = spxy.length;
            }

            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if (attrData.TotalData.ViewStyle.SouByou.Spline_F == true) {
                if (ReverseGetF == true) {
                    let spxy2 = [];
                    for (let i = 0; i < np; i++) {
                        spxy2.push(spxy[np - 1 - i].Clone());
                    }
                    pxy = clsSpline.Spline_Get(0, np, spxy2, 0.3, av.ScrData);
                } else {
                    pxy = clsSpline.Spline_Get(0, np, spxy, 0.3, av.ScrData);
                }
            } else {
                pxy = av.ScrData.Get_SxSy_With_3D(np, spxy, ReverseGetF);
            }
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.Set_MPSubLineXY(mpfilename, LCode, pxy, ReverseGetF);
        }
        return pxy;
    }

    /** イヤのオブジェクトの値を記号表示位置の中央に表示*/
    static ObjectValue_And_Name_Print_byLayer(g: any, Layernum: any, DataNum: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if ((attrData.TotalData.ViewStyle.ValueShow.ValueVisible == true) || (attrData.TotalData.ViewStyle.ValueShow.ObjNameVisible == true)) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            for (let i = 0; i < attrData.LayerData[Layernum].atrObject.ObjectNum; i++) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                if (attrData.Check_Condition(Layernum, i) == true) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let CP = attrData.LayerData[Layernum].atrObject.atrObjectData[i].Symbol;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let OP = attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(CP);
                    this.ObjectValue_and_Name_Print(g, OP, enmVerticalAlignment.Center, Layernum, DataNum, i);
                }
            }
        }
    }

    /**データ値／オブジェクト名表示 */
    static ObjectValue_and_Name_Print(g: any, Pos: any, VerticalAlignment: any, Layernum: any, DataNum: any, ObjectNumber: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let avv = attrData.TotalData.ViewStyle.ValueShow;
        switch (VerticalAlignment) {
            case enmVerticalAlignment.Top: {
                let pos2 = Pos.Clone();
                if (avv.ObjNameVisible == true) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let name = attrData.Get_KenObjName(Layernum, ObjectNumber);
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.Draw_Print(g, name, Pos, avv.ObjNameFont, enmHorizontalAlignment.Center, enmVerticalAlignment.Top);
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    pos2.y += attrData.Get_Length_On_Screen(avv.ObjNameFont.Size);
                }
                if (avv.ValueVisible == true) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let V = attrData.Get_Data_Value(Layernum, DataNum, ObjectNumber, "欠損値");
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    if (attrData.Get_DataType(Layernum, DataNum) == enmAttDataType.Normal) {
                        if ( avv.DecimalSepaF == true) {
                            V = Generic.Figure_Using(Number(V), avv.DecimalNumber);
                        }
                    }
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.Draw_Print(g, V, pos2, avv.ValueFont, enmHorizontalAlignment.Center, enmVerticalAlignment.Top);
                }
                break;
            }
            case enmVerticalAlignment.Center: {
                if (avv.ObjNameVisible == true) {
                    let opos = enmVerticalAlignment.Center;
                    if (avv.ValueVisible == true) {
                        opos = enmVerticalAlignment.Bottom;
                    }
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let name = attrData.Get_KenObjName(Layernum, ObjectNumber);
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.Draw_Print(g, name, Pos, avv.ObjNameFont, enmHorizontalAlignment.Center, opos);
                }
                if (avv.ValueVisible == true) {
                    let opos = enmVerticalAlignment.Center;
                    if (avv.ObjNameVisible == true) {
                        opos = enmVerticalAlignment.Top;
                    }
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let V = attrData.Get_Data_Value(Layernum, DataNum, ObjectNumber, "欠損値");
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    if (attrData.Get_DataType(Layernum, DataNum) == enmAttDataType.Normal) {
                        if ( avv.DecimalSepaF == true) {
                            V = Generic.Figure_Using(Number(V), avv.DecimalNumber);
                        }
                    }
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.Draw_Print(g, V, Pos, avv.ValueFont, enmHorizontalAlignment.Center, opos);
                    break;
                }
            }
        }
    }

    //ダミーオブジェクト・ダミーオブジェクトグループを描画
    /**
 * Description placeholder
 *
 * @static
 * @param {*} g 
 * @param {*} Layernum 
 * @param {*} Polygon_F 
 * @param {*} nonPolygon_F 
 */
static Vector_Dummy_Boundary(g: any, Layernum: any, Polygon_F: any, nonPolygon_F: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let ad = attrData.LayerData[Layernum];
        if(ad.DummyGroup.length > 0) {
            if(Polygon_F == true) {
                this.Vector_DummyGroup_Draw(g,  enmShape.PolygonShape, Layernum);
            }
            if(nonPolygon_F =true) {
                this.Vector_DummyGroup_Draw(g,  enmShape.NotDeffinition, Layernum);
                this.Vector_DummyGroup_Draw(g,  enmShape.LineShape, Layernum);
                this.Vector_DummyGroup_Draw(g,  enmShape.PointShape, Layernum);
            }
        }
        for (let i = 0; i < ad.Dummy.length; i++) {
            let c = ad.Dummy[i].code;
            let mc = ad.MapFileData.MPObj[c];
            if((mc.Shape == enmShape.PolygonShape) && (Polygon_F == true) || (mc.Shape != enmShape.PolygonShape) && (nonPolygon_F == true)){
                this.Vector_Dummy_Draw(g, c, Layernum);
            }
        }
    }
    //ダミーオブジェクトグループの描画。描画順は設定したグループ順
    /**
 * Description placeholder
 *
 * @static
 * @param {*} g 
 * @param {*} SHP 
 * @param {*} Layernum 
 */
static Vector_DummyGroup_Draw(g: any, SHP: any, Layernum: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let ad = attrData.LayerData[Layernum];
        for (let i = 0; i < ad.DummyGroup.length; i++) {
            let ok = ad.DummyGroup[i];
            if(ad.MapFileData.ObjectKind[ok].Shape == SHP) {
                let temp = ad.MapFileData.Get_Objects_by_Group(ok, ad.Time);
                for (let j in temp) {
                    this.Vector_Dummy_Draw(g,  temp[j], Layernum);
                }
            }
        }

    }
    //ダミーオブジェクトの描画
    /**
 * Description placeholder
 *
 * @static
 * @param {*} g 
 * @param {*} code 
 * @param {*} Layernum 
 */
static Vector_Dummy_Draw(g: any, code: any, Layernum: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if(attrData.Check_Screen_Objcode_In(Layernum, code) == true) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let ad = attrData.LayerData[Layernum];
            if(ad.MapFileData.MPObj[code].Shape == enmShape.PointShape) {
                let ok = ad.MapFileData.MPObj[code].Kind;
                let CP = ad.MapFileData.Get_Enable_CenterP(code, ad.Time);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let OP = attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(CP);
                let MK = this.getPointDummyMark(ad.MapFileName, ad.MapFileData.ObjectKind[ok].Name);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let r = attrData.Radius(MK.WordFont.Size, 1, 1);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Draw_Mark(g, OP, r, MK);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                if(attrData.TotalData.ViewStyle.MapLegend.Line_DummyKind.Dummy_Point_Visible == true) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.AddPointObjectKindUsed(ad.MapFileName, ok, MK);
                }
            } else {
                this.Vector_Boundary_Draw(g,  Layernum, code, true);
            }
        }

    }
    //ダミー点オブジェクトの記号取得
    /**
 * Description placeholder
 *
 * @static
 * @param {*} MapFIleName 
 * @param {*} ObjectGroupName 
 * @returns {*} 
 */
static getPointDummyMark(MapFIleName: any, ObjectGroupName: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let av = attrData.TotalData.ViewStyle;
        let obk = av.DummyObjectPointMark[MapFIleName];
        for (let i = 0; i < obk.length; i++) {
            if (obk[i].ObjectKindName == ObjectGroupName) {
                return obk[i].mark;
            }
        }
    }
}
