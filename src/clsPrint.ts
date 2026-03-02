import { Accessory } from './clsAccessory';
import { MeshContour, ContourLineStackInfo } from './MeshContour';
import { appState } from './core/AppState';
import { clsDraw, clsDrawLine } from './clsDraw';
import { EnableMPLine_Data } from './clsMapdata';
import { Generic } from './clsGeneric';
import { spatial } from './clsGeneric';
import { clsBase, enmArrowHeadType, Font_Property, Line_Property, Mark_Property } from './clsTime';
import {
    colorRGBA,
    enmBarChartFrameAxePattern,
    enmBasePosition,
    enmContourIntervalMode,
    enmDivisionMethod,
    enmDrawTiming,
    enmMarkBlockArrange,
    enmMarkBarShape,
    enmMarkSizeValueMode,
    enmMarkPrintType,
    enmOutputDevice,
    enmPointOnjectDrawOrder,
    enmStackedBarChart_Direction,
    enmGraphMaxSize,
    enmLatLonLine_Order,
    enmSoloMode_Number,
    point,
    rectangle,
    Screen_info as AttrScreenInfo,
    size,
    Legend2_Atri
} from './clsAttrData';
import { SortingSearch } from './SortingSearch';
import { boundArrangeData } from './boundArrangeData';
import { enmAttDataType, enmGraphMode, enmHorizontalAlignment, enmLayerMode_Number, enmLayerType, enmPrintMouseMode, enmShape, enmTotalMode_Number, enmVerticalAlignment, enmZahyo_mode_info } from './constants/legacyEnums';

interface strInner_Data_Info {
    Flag: boolean;
    Data: number;
}

class PolydataInfo {
    Pon: number = 0;
    pxy: point[] = []; // point array
    nPolyP: number[] = [];
}

class VecContourStac_Info {
    fnum = 0;
    CNum = 0;
    FStac: number[] = [];
    cStac: number[] = [];
}

interface ContourRegularModeInfo {
    top: number;
    bottom: number;
    Interval: number;
    Line_Pat: Line_Property;
    SP_Bottom: number;
    SP_Top: number;
    SP_interval: number;
    SP_Line_Pat: Line_Property;
    EX_Value_Flag: boolean;
    EX_Value: number;
    EX_Line_Pat: Line_Property;
}

interface ContourIrregularModeInfo {
    Value: number;
    Line_Pat: Line_Property;
}

interface ContourModeInfo {
    Interval_Mode: number;
    Regular: ContourRegularModeInfo;
    IrregularNum: number;
    Irregular: ContourIrregularModeInfo[];
}

interface TitledDataSetInfo {
    title: string;
}

interface ClassDivValueInfo {
    Value: number;
}

interface SoloModeViewSettingsForRestore {
    Class_Div: ClassDivValueInfo[];
    MarkSizeMD: {
        MaxValueMode: number;
        MaxValue: number;
    };
    MarkBarMD: {
        MaxValueMode: number;
        MaxValue: number;
    };
}

interface ModeValueInScreenInfo {
    LayerNum: number;
    DataNum: number;
    divValue: number[];
    MarkSize_MaxValueMode: number;
    MarkSize_MaxValue: number;
    MarkBar_MaxValueMode: number;
    MarkBar_MaxValue: number;
    setF: boolean;
}

interface TempDataLegendInfo {
    Accessory_Temp: {
        MapLegend_W: Legend2_Atri[];
    };
    OverLay_Temp: {
        Always_Ove_DataStac: IOverLayDataItemElement[];
    };
}

interface LabelModeDataSetInfo {
    Location_Mark: Mark_Property;
    Location_Mark_Flag?: boolean;
    DataItem: Array<number | { Data: number; title: string; Unit_Flag?: boolean }>;
    Width: number;
    ObjectName_Print_Flag: boolean;
    ObjectName_Turn_Flag?: boolean;
    ObjectName_Font: Font_Property;
    DataName_Print_Flag: boolean;
    DataValue_Print_Flag?: boolean;
    DataValue_Unit_Flag: boolean;
    DataValue_Font: Font_Property;
    DataValue_TurnFlag: boolean;
    BorderLine: Line_Property;
    BorderObjectTile: Tile_Property;
    BorderDataTile: Tile_Property;
}

interface ContourTempInfo {
    Contour_All_Number: number;
    Contour_All_Point: number;
    Contour_Point: point[];
    Contour_Object: Record<number, strContour_Line_property>;
}

//面オブジェクトの境界線の方向
//Boundary_Arrange関数で使用
class Fringe_Line_Info {
    code?: number;
    Direction?: number;
    LineCode?: number;
    Line?: Line_Property;
    Length?: number;
    StartLine?: boolean;
    EndLine?: boolean;
}



class clsPrint {
    private static cloneLineProperty(linePat: Line_Property): Line_Property {
        const cloned = clsBase.Line();
        Object.assign(cloned, linePat);
        return cloned;
    }

    private static cloneFontProperty(font: Font_Property): Font_Property {
        const cloned = new Font_Property();
        Object.assign(cloned, font);
        return cloned;
    }

    private static clonePointValue(source: point): point {
        const cloned = new point();
        cloned.x = source.x;
        cloned.y = source.y;
        return cloned;
    }

    static setData(picMap: HTMLCanvasElement){
        const state = appState();
        const scrData = state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo;
        scrData.OutputDevide = enmOutputDevice.Screen;
        const atp=state.attrData.TempData;
        atp.ContourMode_Temp.ContourDataResetF = true;
        const dv = document.getElementById("contourDataTip");
        if (dv !== null && dv.parentNode === state.frmPrint) {
            state.frmPrint.removeChild(dv);
        }
        atp.DotMap_Temp.DotMapTempResetF = true;
        atp.frmPrint_Temp.PrintMouseMode = enmPrintMouseMode.Normal;
        if (state.attrData.TotalData.LV1.Print_Mode_Total === enmTotalMode_Number.SeriesMode) {
            atp.Series_temp.Koma = 0;
        }
        if (state.frmPrint.backImageButton?.btnDisabled) state.frmPrint.backImageButton.btnDisabled((state.attrData.TotalData.ViewStyle.Zahyo.Mode !== enmZahyo_mode_info.Zahyo_Ido_Keido));
        state.propertyWindow.fixed = false;
        state.propertyWindow.style.borderWidth = '1px';
        this.printMapScreen(picMap) ;
    }
    static printMapScreen(picMap: HTMLCanvasElement) {
        const state = appState();
        const avs = state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo;
        const g = picMap.getContext('2d');
        if (!g) return;
        
        g.save();
        g.clearRect(0, 0, avs.frmPrint_FormSize.width(), avs.frmPrint_FormSize.height());

        if (state.attrData.TotalData.LV1.Print_Mode_Total === enmTotalMode_Number.SeriesMode) {
            if (state.frmPrint.seriesNextButton?.btnDisabled) state.frmPrint.seriesNextButton.btnDisabled(false);
            if (state.frmPrint.seriesBeforeButton?.btnDisabled) state.frmPrint.seriesBeforeButton.btnDisabled(false);
            clsPrint.Series_Mapping(g);
        } else {
            if (state.frmPrint.seriesNextButton?.btnDisabled) state.frmPrint.seriesNextButton.btnDisabled(true);
            if (state.frmPrint.seriesBeforeButton?.btnDisabled) state.frmPrint.seriesBeforeButton.btnDisabled(true);
            clsPrint.printMap(g);
        }
        g.restore();
    }

    static Series_Mapping(g: CanvasRenderingContext2D) {
        const state = appState();
        state.attrData.TempData.ContourMode_Temp.ContourDataResetF = true;
        state.attrData.TempData.DotMap_Temp.DotMapTempResetF = true;
        const n = state.attrData.TotalData.TotalMode.Series.SelectedIndex;
        const koma = state.attrData.TempData.Series_temp.Koma;
        const atsd = state.attrData.TotalData.TotalMode.Series.DataSet[n] as unknown as { DataItem: strSeries_DataSet_Item_Info[] };
        if (atsd.DataItem.length === 0) {
            return;
        }
        const atsdi = atsd.DataItem[koma] as strSeries_DataSet_Item_Info;
        const layerIndex = Number(atsdi.Layer);
        const dataIndex = Number(atsdi.Data);
        state.attrData.TotalData.LV1.Print_Mode_Total = Number(atsdi.Print_Mode_Total);
        let ttl = "";
        const al = state.attrData.LayerData[layerIndex] as ILayerDataInfo;
        switch (atsdi.Print_Mode_Total) {
            case enmTotalMode_Number.DataViewMode: {
                const o_p_m_l = al.Print_Mode_Layer;
                const O_L = state.attrData.TotalData.LV1.SelectedLayer;
                al.Print_Mode_Layer = Number(atsdi.Print_Mode_Layer);
                state.attrData.TotalData.LV1.SelectedLayer = layerIndex;
                switch (atsdi.Print_Mode_Layer) {
                    case enmLayerMode_Number.SoloMode: {
                        const O_L_Datn = al.atrData.SelectedIndex;
                        al.atrData.SelectedIndex = dataIndex;
                        const md = state.attrData.getSoloMode(layerIndex, dataIndex);
                        state.attrData.setSoloMode(layerIndex, dataIndex,atsdi.SoloMode);
                        this.printMap(g);
                        ttl = state.attrData.Get_DataTitle(layerIndex, dataIndex, false);
                        al.atrData.SelectedIndex = O_L_Datn;
                        state.attrData.setSoloMode(layerIndex, dataIndex, md);
                        break;
                    }
                    case enmLayerMode_Number.GraphMode: {
                        const o_m_d = al.LayerModeViewSettings.GraphMode.SelectedIndex;
                        al.LayerModeViewSettings.GraphMode.SelectedIndex = dataIndex;
                        this.printMap(g);
                        const graphDataSet = al.LayerModeViewSettings.GraphMode.DataSet[dataIndex] as TitledDataSetInfo;
                        ttl = graphDataSet.title;
                        al.LayerModeViewSettings.GraphMode.SelectedIndex = o_m_d;
                        break;
                    }
                    case enmLayerMode_Number.LabelMode: {
                        const o_m_d = al.LayerModeViewSettings.LabelMode.SelectedIndex;
                        al.LayerModeViewSettings.LabelMode.SelectedIndex = dataIndex;
                        this.printMap(g);
                        const labelDataSet = al.LayerModeViewSettings.LabelMode.DataSet[dataIndex] as TitledDataSetInfo;
                        ttl = labelDataSet.title;
                        al.LayerModeViewSettings.LabelMode.SelectedIndex = o_m_d;
                        break;
                    }
                    case enmLayerMode_Number.TripMode: {
                        break;
                    }
                }
                state.attrData.TotalData.LV1.SelectedLayer = O_L;
                al.Print_Mode_Layer = o_p_m_l;
                break;
            }
            case enmTotalMode_Number.OverLayMode: {
                const O_O = state.attrData.TotalData.TotalMode.OverLay.SelectedIndex;
                state.attrData.TotalData.TotalMode.OverLay.SelectedIndex = dataIndex;
                this.printMap(g);
                const overLayDataSet = state.attrData.TotalData.TotalMode.OverLay.DataSet[dataIndex] as TitledDataSetInfo;
                ttl = overLayDataSet.title;
                state.attrData.TotalData.TotalMode.OverLay.SelectedIndex = O_O;
                break;
            }
        }
        state.attrData.TempData.Series_temp.title = ttl;
        state.attrData.TotalData.LV1.Print_Mode_Total = enmTotalMode_Number.SeriesMode;
    }

    static printMap(g: CanvasRenderingContext2D) {
        const state = appState();
        const picMapRect = new rectangle(0, state.frmPrint.picMap.width, 0, state.frmPrint.picMap.height);
        const scrData = state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo;
        scrData.Set_PictureBox_and_CulculateMul(picMapRect)
        state.attrData.TempData.OverLay_Temp.OverLay_Printing_Flag = false;
        const Layernum = state.attrData.TotalData.LV1.SelectedLayer;
        let ca = "";
        switch (state.attrData.TotalData.LV1.Print_Mode_Total) {
            case enmTotalMode_Number.DataViewMode: {
                switch (state.attrData.LayerData[Layernum].Print_Mode_Layer) {
                    case enmLayerMode_Number.SoloMode: {
                        ca = state.attrData.Get_SelectedDataTitle();
                        break;
                    }
                    case enmLayerMode_Number.GraphMode: {
                        const currentGraph = state.attrData.nowGraph() as IGraphDataSet;
                        ca = currentGraph.title;
                        break;
                    }
                    case enmLayerMode_Number.LabelMode: {
                        const currentLabel = state.attrData.nowLabel() as ILabelDataSet;
                        ca = currentLabel.title;
                        break;
                    }
                    case enmLayerMode_Number.TripMode: {
                        break;
                    }
                }
                break;
            }
            case enmTotalMode_Number.OverLayMode: {
                state.attrData.TempData.OverLay_Temp.OverLay_Printing_Flag = true;
                const ov = state.attrData.TotalData.TotalMode.OverLay;
                ca = ov.DataSet[ov.SelectedIndex].title;
                break;
            }
        }
        state.frmPrint.setTitle?.(ca);
        clsPrint.showMap(g);
    }

    static showMap(g: CanvasRenderingContext2D) {
        const state = appState();
        const av=state.attrData.TotalData.ViewStyle;
        const avs = av.ScrData as AttrScreenInfo;
        state.attrData.TempData.drawing=true;
        avs.SampleBoxFlag = false;
        state.attrData.ResetMPSubLineXY();
        state.attrData.ResetObjectPrintedCheckFlag();
        g.globalCompositeOperation = "source-over";
        const avb = av.SouByou;
        if ((avb.Auto === true) || ((avb.ThinningPrint_F === true) && (avb.PointInterval !== 0)) || ((avb.LoopAreaF === true) || (avb.LoopSize !== 0))) {
            state.attrData.check_AutoSoubyou_Enable();
        }
        if (avb.Auto === true) {
            const avss = avs.ScrRectangle;
            //ラインのポイント自動間引き用に画面の対角線の距離を取得（座標系設定ありの場合）
            let D;
            if (state.attrData.TotalData.ViewStyle.Zahyo.Mode === enmZahyo_mode_info.Zahyo_Ido_Keido) {
                D = spatial.Distance_Ido_Kedo_XY_Point(new point(avss.left, avss.top), new point(avss.right, avss.bottom), av.Zahyo);
            } else {
                D = spatial.Distance(avss.left, avss.top, avss.right, avss.bottom);
                D /= state.attrData.SetMapFile("").Map.SCL;
            }
            state.attrData.TempData.SoubyouLinePointIntervalCriteria = D * 0.001 * state.attrData.TotalData.ViewStyle.SouByou.AutoDegree;
            state.attrData.TempData.SoubyouLoopAreaCriteria = (state.attrData.TempData.SoubyouLinePointIntervalCriteria) ** 2;
        }
        this.Screen_Area_Back(g);
        g.beginPath();
        if(avs.Screen_Margin.ClipF === true) {//地図領域クリッピング
            g.save();
            const marginRect = avs.getSXSY_Margin();
            g.rect(marginRect.left,marginRect.top,marginRect.width(),marginRect.height());
            g.clip("evenodd");

        }
        this.Screen_Back_ObjectInner_Set(g);

        if (state.attrData.TotalData.TotalMode.OverLay.Always_Overlay_Index !== -1) {
            this.OverLay_Plus_Print(g);
        } else {
            switch (state.attrData.TotalData.LV1.Print_Mode_Total) {
                case enmTotalMode_Number.DataViewMode: {
                    const Layernum = state.attrData.TotalData.LV1.SelectedLayer;
                    switch (state.attrData.LayerData[Layernum].Print_Mode_Layer) {
                        case enmLayerMode_Number.SoloMode: {
                            const DataNum = state.attrData.LayerData[Layernum].atrData.SelectedIndex;
                            switch (state.attrData.getSoloMode(Layernum, DataNum)) {
                                case enmSoloMode_Number.ClassPaintMode: {
                                    this.PrintClassPaintMode(g, Layernum, DataNum);
                                    break;
                                }
                                case enmSoloMode_Number.ClassMarkMode: {
                                    this.PrintClassMarkMode(g, Layernum, DataNum);
                                    break;
                                }
                                case enmSoloMode_Number.ClassODMode: {
                                    if (state.attrData.LayerData[Layernum].Shape === enmShape.LineShape) {
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
                            this.PrintGraphMode(g,  Layernum, state.attrData.layerGraph().SelectedIndex)
                            break;
                        }
                        case enmLayerMode_Number.LabelMode: {
                            this.PrintLabelMode(g,  Layernum, state.attrData.layerLabel().SelectedIndex)
                            break;
                        }
                        case enmLayerMode_Number.TripMode: {
                            break;
                        }

                    }
                    break;
                }
                case enmTotalMode_Number.OverLayMode: {
                    this.Print_OverLay(g, state.attrData.TotalData.TotalMode.OverLay.SelectedIndex);
                    break;
                }
            }
        }
        
        if(avs.Screen_Margin.ClipF === true) {
            g.restore();
        }
        let tilecanvas: HTMLCanvasElement | null = null;
        const avt = av.TileMapView;
        const drawTiming = Number(avt.DrawTiming) === enmDrawTiming.AfterDataDraw ? enmDrawTiming.AfterDataDraw : enmDrawTiming.BeforeDataDraw;
        if ((avt.Visible === true) && (avs.ThreeDMode.Set3D_F === false)) {
            //背景画像を表示
            if (drawTiming === enmDrawTiming.BeforeDataDraw) {
                this.Legend_Data_Set();
                this.Screen_MapAreaLine(g);
                this.GetAccessoryRectangles(g);
                this.Figure_Print(g, false);
            }
            state.attrData.TempData.frmPrint_Temp.image = g.getImageData(0, 0, state.frmPrint.picMap.width, state.frmPrint.picMap.height);
            tilecanvas = document.createElement("canvas");
            tilecanvas.width = avs.frmPrint_FormSize.width();
            tilecanvas.height = avs.frmPrint_FormSize.height(); 
            tilecanvas.style.vivility=false;
            const tilecanvasg = tilecanvas.getContext('2d');
            state.tileMapClass.drawTileMap(tilecanvasg, avt.TileMapDataSet, av.Zahyo, avs, 2, tileMapAcc);
        } else {
            //背景画像を表示しない
            this.Legend_Data_Set();
            this.Screen_MapAreaLine(g);
            this.GetAccessoryRectangles(g);
            this.Figure_Print(g, false);
            this.Screen_BackLine(g);
            state.attrData.TempData.frmPrint_Temp.image = g.getImageData(0, 0, state.frmPrint.picMap.width, state.frmPrint.picMap.height);
        }
        if (state.attrData.TempData.ModeValueInScreen_Stac.setF === true) {
            this.Restore_InScreenObjectData();
        }
        state.attrData.TempData.drawing = false;

        /**背景地図読み込み後に、背景を地図上に配置、最後に凡例等を描画 */
        function tileMapAcc() {

            if (!tilecanvas) {
                return;
            }

            let mgr;
            if (avs.Screen_Margin.ClipF === true) {
                mgr = avs.getSXSY_Margin();
            } else {
                mgr = new rectangle(0, tilecanvas.width, 0, tilecanvas.height);
            }

            switch (drawTiming) {
                case enmDrawTiming.BeforeDataDraw:
                    g.globalCompositeOperation = "destination-over";
                    break;
                case enmDrawTiming.AfterDataDraw:
                    g.globalCompositeOperation = "multiply";
                    break;
            }
            g.globalAlpha = avt.AlphaValue;
            g.drawImage(tilecanvas, mgr.left, mgr.top, mgr.width(), mgr.height(), mgr.left, mgr.top, mgr.width(), mgr.height());
            g.globalAlpha = 1;
            g.globalCompositeOperation = "source-over";

            state.tileMapClass.PrintCopyright(g, avt.TileMapDataSet, avs);

            switch (drawTiming) {
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


            state.attrData.TempData.frmPrint_Temp.image = g.getImageData(0, 0, state.frmPrint.picMap.width, state.frmPrint.picMap.height);
        }
    }

    /** 最後に画面枠線を描く*/
    static Screen_BackLine(g: CanvasRenderingContext2D){
        const state = appState();
        const av = state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo;
        const rect  = av.getSxSyRect(av.ScrRectangle);
        const sv=state.attrData.TotalData.ViewStyle.Screen_Back;
        let penw  = Math.trunc(state.attrData.Get_Length_On_Screen(sv.ScreenFrameLine.Width)) % 2;
        penw = (penw===0) ? 1:penw;
        rect.inflate(-penw, -penw);
        state.attrData.Draw_Tile_Box(g, rect, sv.ScreenFrameLine, clsBase.BlancTile(), 0)
    }

    /**複数のレイヤごとのポリゴンのクリッピング */
    static ClippingRegion_ObjectBoundary_set(g: CanvasRenderingContext2D, Layers: number[], RealObjClip_f: boolean, DummyClip_F: boolean) {
        // const state = appState();
        let f = false;
        const Allpxy = [];
        const AllnPolyP = [];
        for (let i = 0; i < Layers.length; i++) {
            const badata = this.ContourPolygonRegion(Layers[i], RealObjClip_f, DummyClip_F);
            if (badata.Pon && badata.Pon > 0) {
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
        if (f === true) {
            clsDraw.ClipPolyPolygon(g,Allpxy, AllnPolyP);
        }
        return f;
    }

    /**等値線モード他の背後のポリゴンのクリッピングリージョン作成、ポリゴン数を返す */
    static ContourPolygonRegion(Layernum: number, RealObjClip_f: boolean, DummyClip_F: boolean): PolydataInfo {
        const state = appState();
        const MultiObj: number[] = [];
        const al = state.attrData.LayerData[Layernum];
        type MapObjectShapeInfo = { Shape: number; Kind: number };

        const LT = al.Time;
        let Dummy_F;
        if ((al.Shape === enmShape.PolygonShape) && (RealObjClip_f === true) && (al.Type === enmLayerType.Normal)) {
            const ObjN = al.atrObject.ObjectNum;
            for (let i = 0; i < ObjN; i++) {
                if (state.attrData.Check_screen_Kencode_In(Layernum, i) === true) {
                    MultiObj.push(i);
                }
            }
            Dummy_F = false;
        } else if (DummyClip_F === true) {
            for (let i = 0; i < al.Dummy.length; i++) {
                const c = Number(al.Dummy[i].code);
                const mapObj = al.MapFileData.MPObj[c] as unknown as MapObjectShapeInfo;
                if ((mapObj.Shape === enmShape.PolygonShape) && (state.attrData.Check_Screen_Objcode_In(Layernum, c) === true)) {
                    MultiObj.push(c);
                }
            }
            const dobgRet = state.attrData.getDummyObjGroupArray(Layernum,enmShape.PolygonShape);
            if (dobgRet.trueNum > 0) {
                const alm = al.MapFileData as unknown as {
                    Map: { Kend: number };
                    MPObj: MapObjectShapeInfo[];
                    CheckEnableObject: (mapObj: MapObjectShapeInfo, time: unknown) => boolean;
                };
                for (let j = 0; j < alm.Map.Kend; j++) {
                    const mapObj = alm.MPObj[j] as unknown as MapObjectShapeInfo;
                    if ((dobgRet.DummyOBGArray[mapObj.Kind] === true) && (mapObj.Shape === enmShape.PolygonShape)) {
                        if (alm.CheckEnableObject(mapObj, LT) === true) {
                            MultiObj.push(j);
                        }
                    }
                }
            }
            Dummy_F = true;
        }
        if (MultiObj.length > 0) {
            return this.Get_Multi_Object_Boundary(Layernum,  MultiObj, Dummy_F ?? false) ?? { Pon: 0, pxy: [], nPolyP: [] };
        } else {
            return { Pon: 0, pxy: [], nPolyP: [] };
        }
    }


/**スクリーン、地図領域背景色 */
    static Screen_Area_Back(g: CanvasRenderingContext2D){
        const state = appState();
        const av = state.attrData.TotalData.ViewStyle;
        const avs = av.ScrData as AttrScreenInfo;
        const Scrrect  = avs.getSxSyRect(avs.ScrRectangle);
        state.attrData.Draw_Tile_Box(g, Scrrect, clsBase.BlankLine(), av.Screen_Back.ScreenAreaBack, 0);
        const marginRect  = avs.getSXSY_Margin();
        state.attrData.Draw_Tile_Box(g, marginRect, clsBase.BlankLine(), av.Screen_Back.MapAreaBack, 0);
    }

    /**経緯線（背面表示）とオブジェクト内部色設定 */
    static Screen_Back_ObjectInner_Set(g: CanvasRenderingContext2D){
        const state = appState();
        const av = state.attrData.TotalData.ViewStyle;
        if((av.Zahyo.Mode === enmZahyo_mode_info.Zahyo_Ido_Keido) && (av.LatLonLine_Print.Order === enmLatLonLine_Order.Back) && (av.LatLonLine_Print.Visible === true)) {
           Accessory.LatLonLine_Print(g);
        }
        if(av.Screen_Back.ObjectInner.BlankF === false) {
            const lv1 = state.attrData.TotalData.LV1;
            if(lv1.Print_Mode_Total === enmTotalMode_Number.DataViewMode) {
                this.Screen_Back_Set_Paint(g, lv1.SelectedLayer);
            } else {
                const n = state.attrData.TotalData.TotalMode.OverLay.SelectedIndex;
                const OvLay = [];
                const ds = state.attrData.TotalData.TotalMode.OverLay.DataSet[n];
                for (let i = 0; i < ds.DataItem.length; i++) {
                    for (let j = 0; j < ds.DataItem.length; j++) {
                        OvLay[ds.DataItem[j].Layer] = true;
                    }
                }
                for (let i = 0; i < lv1.Lay_Maxn; i++) {
                    if(OvLay[i] === true) {
                        this.Screen_Back_Set_Paint(g, i);
                    }
                }
            }
        }
    }
    
    /**オブジェクト内部の背景塗りつぶし*/
    static Screen_Back_Set_Paint(g: CanvasRenderingContext2D, Layernum: number){
        const state = appState();
        const al = state.attrData.LayerData[Layernum];
        type PolygonShapeInfo = { Shape: number };

        let MultiObj: number[] = [];
        for (let i = 0; i < al.Dummy.length; i++) {
            const c = Number(al.Dummy[i].code);
            const mapObject = al.MapFileData.MPObj[c] as PolygonShapeInfo;
            if ((mapObject.Shape === enmShape.PolygonShape) && (
                state.attrData.Check_Screen_Objcode_In(Layernum, c) === true)) {
                MultiObj.push(c);
            }
        }
        if (al.DummyGroup.length > 0) {
            const mapFileData = al.MapFileData as unknown as {
                ObjectKind: PolygonShapeInfo[];
                Get_Objects_by_Group: (ok: number, time: unknown) => number[];
            };
            for (let i = 0; i < al.DummyGroup.length; i++) {
                const ok = al.DummyGroup[i];
                const objectKind = mapFileData.ObjectKind[ok] as PolygonShapeInfo;
                if (objectKind.Shape === enmShape.PolygonShape) {
                    const temp = mapFileData.Get_Objects_by_Group(ok, al.Time) as number[];
                    for (let j = 0; j < temp.length; j++) {
                        if (state.attrData.Check_Screen_Objcode_In(Layernum, temp[j]) === true) {
                            MultiObj.push(temp[j]);
                        }
                    }
                }
            }
        }
        let MbjN = MultiObj.length;
        if (MbjN > 0) {
            this.PaintMultiPolygonObject(g, Layernum, MultiObj, state.attrData.TotalData.ViewStyle.Screen_Back.ObjectInner, true);
        }

        if (al.Shape === enmShape.PolygonShape) {
            MultiObj = [];
            for (let i = 0; i < al.atrObject.ObjectNum; i++) {
                if (state.attrData.Check_screen_Kencode_In(Layernum, i) === true) {
                    MultiObj.push(i);
                }
            }
            MbjN = MultiObj.length;
            if (MbjN > 0) {
                this.PaintMultiPolygonObject(g, Layernum, MultiObj, state.attrData.TotalData.ViewStyle.Screen_Back.ObjectInner, false);
            }
        }
    }

    /**複数オブジェクトにまとめて色塗り */
    static PaintMultiPolygonObject(g: CanvasRenderingContext2D, Layernum: number, MultiObj: number[], TI: Tile_Property, Dummy_F: boolean){
        // const state = appState();
        const MbjN=MultiObj.length;
        if((MbjN === 0)||(TI.BlankF === true) ){
            return;
        }
        const Polydata  = this.Get_Multi_Object_Boundary(Layernum, MultiObj, Dummy_F);
        if(Polydata?.Pon && Polydata.Pon > 0 && TI.Color){
            clsDraw.DrawPolyPolygon(g, Polydata, TI.Color.toRGBA());
        }
    }

    /**ポリゴンオブジェクトの周囲の線の座標を取得 */
    static Get_Multi_Object_Boundary(Layernum: number, ObjCode: number[], Dummy_F: boolean) {
        const state = appState();
        const ELine = this.Gey_Multi_Object_OuterLineCode(Layernum, ObjCode, Dummy_F);

        const mapFileData = state.attrData.LayerData[Layernum].MapFileData as unknown as {
            Boundary_Arrange_Sub: (line: EnableMPLine_Data[]) => boundArrangeData;
        };
        const boundArrange = mapFileData.Boundary_Arrange_Sub(ELine);
        if (boundArrange.Pon <= 0) {
            return undefined;
        } else {
            const Polydata = this.Get_Boundary_XY(Layernum, boundArrange);
            return Polydata;
        }
    }

    /** 指定された複数のオブジェクトの外側のラインコードを取得*/
    static Gey_Multi_Object_OuterLineCode(Layernum: number, ObjCode: number[], Dummy_F: boolean) {
        const state = appState();
        const al = state.attrData.LayerData[Layernum];
        const mapFileData = al.MapFileData as unknown as {
            Map: { ALIN: number };
            Boundary_Arrange: (objCode: number, time: unknown) => boundArrangeData;
        };
        const ALineN = mapFileData.Map.ALIN;
        const Use_Line: number[] = Array.from({ length: ALineN }, () => 0);
        for (let i = 0; i < ObjCode.length; i++) {
            if (Dummy_F === false) {
                const badataRaw = state.attrData.Boundary_Kencode_Arrange(Layernum, ObjCode[i]) as boundArrangeData | boundArrangeData[] | undefined;
                const badataArray = Array.isArray(badataRaw) ? badataRaw : (badataRaw ? [badataRaw] : []);
                for (let k = 0; k < badataArray.length; k++) {
                    const badata = badataArray[k] as boundArrangeData;
                    for (let j = 0; j < badata.Fringe.length; j++) {
                        Use_Line[badata.Fringe[j].code]++;
                    }
                }
            } else {
                const badata = mapFileData.Boundary_Arrange(ObjCode[i], al.Time);
                for (let j = 0; j < badata.Fringe.length; j++) {
                    Use_Line[badata.Fringe[j].code]++;
                }
            }
        }
        const ELine: EnableMPLine_Data[] = [];
        for (let i = 0; i < ALineN; i++) {
            if (Use_Line[i] % 2 === 1) {
                const d = new EnableMPLine_Data(i, -1);
                d.LineCode = i;
                ELine.push(d);
            }
        }
        return ELine;
    }

    /**階級区分モードの表示順序と表示の可否を返す */
    static getDrawOrder_and_ShowF_ClassMode(LayerNum: number, DataNum: number, Category_Array: number[], D_Order: number[], ShowF: boolean[]) {
        const state = appState();
        const al = state.attrData.LayerData[LayerNum];
        const vs = state.attrData.TotalData.ViewStyle;
        const LayerShape = al.Shape;
        const Objn = al.atrObject.ObjectNum;
        let DrawOrderByValue;
        if ((LayerShape === enmShape.PointShape) || (LayerShape === enmShape.LineShape)||(state.attrData.getSoloMode(LayerNum, DataNum)===enmSoloMode_Number.ClassMarkMode)) {
            DrawOrderByValue = this.ClassMode_Point_Shape_DrawOrder(LayerNum, DataNum);
        }
        const Missing_DataArray = state.attrData.Get_Missing_Value_DataArray(LayerNum, DataNum);

        const PointLayerMark = al.LayerModeViewSettings.PointLineShape.PointMark;
        const pointR = state.attrData.Radius(PointLayerMark.WordFont.Size, 1, 1);
        for (let i = 0; i < Objn; i++) {
            let dod;
            if ((LayerShape === enmShape.PointShape) || (LayerShape === enmShape.LineShape)||(state.attrData.getSoloMode(LayerNum, DataNum)===enmSoloMode_Number.ClassMarkMode)) {
                switch (vs.PointPaint_Order) {
                    case enmPointOnjectDrawOrder.ObjectOrder:
                        dod = i;
                        break;
                    case enmPointOnjectDrawOrder.LowerToUpperCategory:
                        if (al.atrData.Data[DataNum].DataType === enmAttDataType.Normal) {
                            dod = DrawOrderByValue?.DataPosition(i) ?? i;
                        } else {
                            dod = DrawOrderByValue?.DataPositionRev(i) ?? i;
                        }
                        
                        break;
                    case enmPointOnjectDrawOrder.UpperToLowerCategory:
                        if (al.atrData.Data[DataNum].DataType === enmAttDataType.Normal) {
                            dod = DrawOrderByValue?.DataPositionRev(i) ?? i;
                        } else {
                            dod = DrawOrderByValue?.DataPosition(i) ?? i;
                        }
                        break;
                }
            } else {
                dod = i;
            }
            D_Order[i] = dod;
            if ((state.attrData.Check_Condition(LayerNum, dod) === true) && ((Missing_DataArray[dod] === false) || (vs.Missing_Data.Print_Flag === true))) {
                switch (LayerShape) {
                    case enmShape.PointShape:{
                        const CP = al.atrObject.atrObjectData[dod].Symbol;
                        const OP = (vs.ScrData as AttrScreenInfo).Get_SxSy_With_3D(CP);
                        ShowF[dod] = state.attrData.Check_Screen_In(OP, pointR);
                        break;
                    }
                    case enmShape.LineShape:
                    case enmShape.PolygonShape:
                        ShowF[dod] = state.attrData.Check_screen_Kencode_In(LayerNum, dod);
                        break;
                }
            }
        }
        
        if (vs.MapLegend.Base.ModeValueInScreenFlag === true) {
            Category_Array.length = 0;
            this.get_InScreenObjectData( LayerNum, DataNum, ShowF);
            for (let i = 0; i < Objn; i++) {
                if (ShowF[i] === true) {
                    Category_Array[i] = state.attrData.Get_Categoly(LayerNum, DataNum, i);
                }
            }
        } else {
            for (let i = 0; i < Objn; i++) {
                Category_Array[i]=state.attrData.Get_Categoly(LayerNum, DataNum, i);
            }
        }

    }


    /**表示範囲のデータで階級区分などを設定 */
    static get_InScreenObjectData(LayerNum: number, DataNum: number, ShowF: boolean[]){
        const state = appState();
        if (state.attrData.TempData.OverLay_Temp.OverLay_Printing_Flag === true) {
            return;
        }

        const al = state.attrData.LayerData[LayerNum];
        const Missing_DataArray = state.attrData.Get_Missing_Value_DataArray(LayerNum, DataNum);
        const MV_Array = state.attrData.Get_Data_Cell_Array_With_MissingValue(LayerNum, DataNum);
        const Objn = al.atrObject.ObjectNum;
        let inObjN = 0;
        let Add = 0;
        let Add2 = 0;
        let BeforeDecimal = 0;
        let AfterDecimal = 0;
        const inObjectList = new Array(Objn);

        const ald = al.atrData.Data[DataNum];
        const alds = ald.SoloModeViewSettings as unknown as SoloModeViewSettingsForRestore & { Div_Num: number; Div_Method: number };
        let maxV = ald.Statistics.Min;
        let minV = ald.Statistics.Max;
        const div_num = alds.Div_Num;
        const divMethos = alds.Div_Method;

        const atm = state.attrData.TempData.ModeValueInScreen_Stac as ModeValueInScreenInfo;
        atm.LayerNum = LayerNum;
        atm.DataNum = DataNum;
        atm.divValue = Array.from({ length: div_num }, () => 0);
        const classDiv = alds.Class_Div as ClassDivValueInfo[];
        for (let i = 0; i < div_num; i++) {
            atm.divValue[i] = classDiv[i].Value;
        }
        atm.MarkSize_MaxValueMode = alds.MarkSizeMD.MaxValueMode;
        atm.MarkSize_MaxValue = alds.MarkSizeMD.MaxValue;
        atm.MarkBar_MaxValueMode = alds.MarkBarMD.MaxValueMode;
        atm.MarkBar_MaxValue = alds.MarkBarMD.MaxValue;


        const SortV = new SortingSearch();
        for (let i = 0; i < Objn; i++) {
            if ((ShowF[i] === true) && (Missing_DataArray[i] === false)) {
                const v = MV_Array[i];
                const vNum = Number(v);
                SortV.Add(vNum);
                inObjectList[inObjN] = i;
                Add += vNum;
                Add2 += vNum * vNum;
                maxV = Math.max(maxV, vNum);
                minV = Math.min(minV, vNum);
                const retv = Generic.Figure_Arrange(vNum);
                BeforeDecimal = Math.max(BeforeDecimal, retv.BeforeDecimal);
                AfterDecimal = Math.max(AfterDecimal, retv.AfterDecimal);
                inObjN++;
            }
        }
        SortV.AddEnd();
        const md = state.attrData.getSoloMode(LayerNum, DataNum);
        switch (md) {
            case enmSoloMode_Number.ClassPaintMode:
            case enmSoloMode_Number.ClassMarkMode:
            case enmSoloMode_Number.ClassODMode: {
                if (md === enmSoloMode_Number.ClassODMode) {
                    if (al.Shape !== enmShape.LineShape) {
                        return;
                    }
                }
                const Ave = Add / inObjN;
                const sa = maxV - minV;
                const STD = Math.sqrt(Add2 / inObjN - Ave * Ave);
                const Div_Value = [];
                switch (divMethos) {
                    case enmDivisionMethod.Free:
                        return;
                        break;
                    case enmDivisionMethod.Quantile: { //分位数
                        const divvStp = SortV.NumofData() / div_num;
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
                        const Mense = [];
                        let AddMense = 0
                        for (let i = 0; i < inObjN; i++) {
                            Mense[i] = state.attrData.GetObjMenseki(LayerNum, inObjectList[i]);
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
                        const a = sa / div_num;
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

    static Restore_InScreenObjectData(){
        const state = appState();
        const atc = state.attrData.TempData.ModeValueInScreen_Stac as ModeValueInScreenInfo;
        const al = state.attrData.LayerData[atc.LayerNum];
        const ald = al.atrData.Data[atc.DataNum].SoloModeViewSettings as SoloModeViewSettingsForRestore;
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
    static getDrawOrder_and_ShowF_MarkMode(LayerNum: number, DataNum: number, mode: number, D_Order: number[], ShowF: boolean[], ObjP: point[], Missing_DataArray: boolean[], MV_Array: number[]) {
        const state = appState();
        const al = state.attrData.LayerData[LayerNum];
        const vs = state.attrData.TotalData.ViewStyle;
        const missingData = vs.Missing_Data as {
            Mark: { WordFont: { Size: number } };
            MarkBar: { WordFont: { Size: number } };
            TurnMark: { WordFont: { Size: number } };
            Print_Flag: boolean;
        };
        const LayerShape = al.Shape;
        const Objn = al.atrObject.ObjectNum;
        const Missing_DataArraySub = state.attrData.Get_Missing_Value_DataArray(LayerNum, DataNum);
        for (let i = 0; i < Missing_DataArraySub.length; i++) {
            Missing_DataArray[i] = Missing_DataArraySub[i];
        }
        const MK_Order = new SortingSearch();
        const MV_ArraySub = state.attrData.Get_Data_Cell_Array_With_MissingValue(LayerNum, DataNum);
        for (let i = 0; i < MV_ArraySub.length; i++) {
            MV_Array[i] = MV_ArraySub[i];
        }
        for (let i = 0; i < Objn; i++) {
            const CP = al.atrObject.atrObjectData[i].Symbol;
            ObjP[i] = (vs.ScrData as AttrScreenInfo).Get_SxSy_With_3D(CP);
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
                misR = state.attrData.Radius(missingData.Mark.WordFont.Size, 1, 1);
                normR = al.atrData.Data[DataNum].SoloModeViewSettings.MarkSizeMD.Mark.WordFont.Size;
                maxv = Math.max(Math.abs(state.attrData.Get_DataMax(LayerNum, DataNum)), Math.abs(state.attrData.Get_DataMin(LayerNum, DataNum)));
                break;
            case enmSoloMode_Number.MarkBarMode: {
                misR = state.attrData.Radius(missingData.MarkBar.WordFont.Size, 1, 1);
                const alm = al.atrData.Data[DataNum].SoloModeViewSettings.MarkBarMD;
                const w = state.attrData.Get_Length_On_Screen(alm.Width);
                const h = state.attrData.Get_Length_On_Screen(alm.MaxHeight);
                let wThree = 0;
                if (alm.ThreeD === true) {
                    wThree = Math.floor(w / 3);
                }
                normSize = new size(w + wThree, h + wThree);
                break;
            }
            case enmSoloMode_Number.MarkTurnMode: {
                misR = state.attrData.Radius(missingData.TurnMark.WordFont.Size, 1, 1);
                const markTurn = al.atrData.Data[DataNum].SoloModeViewSettings.MarkTurnMD as { Mark: { WordFont: { Size: number } } };
                normR = state.attrData.Radius(markTurn.Mark.WordFont.Size, 1, 1);
                break;
            }
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
            if ((state.attrData.Check_Condition(LayerNum, dod) === true) && ((
                (Missing_DataArray[dod] === false) || (state.attrData.TotalData.ViewStyle.Missing_Data.Print_Flag === true)))) {
                let scinf = false;
                switch (mode) {
                    case enmSoloMode_Number.MarkSizeMode:
                        switch (LayerShape) {
                            case enmShape.PointShape:
                            case enmShape.PolygonShape:
                                if (Missing_DataArray[dod] === true) {
                                    ObjP[dod] = this.getOverlayMarkPosition(ObjP[dod], misR)
                                    scinf = state.attrData.Check_Screen_In(ObjP[dod], misR)
                                } else {
                                    if (MV_Array[dod] !== 0) {
                                        const r = state.attrData.Radius(normR, Math.abs(MV_Array[dod]), maxv)
                                        ObjP[dod] = this.getOverlayMarkPosition(ObjP[dod], r)
                                        scinf = state.attrData.Check_Screen_In(ObjP[dod], r);
                                    }
                                }
                                break;
                            case enmShape.LineShape:
                                scinf = state.attrData.Check_screen_Kencode_In(LayerNum, dod)
                                break;
                        }
                        break;
                    case enmSoloMode_Number.MarkBarMode:
                        if (MV_Array[dod] > 0) {
                            if (Missing_DataArray[dod] === true) {
                                scinf = state.attrData.Check_Screen_In(ObjP[dod], misR)
                            } else {
                                if (normSize) {
                                    const rect = new rectangle(new point(ObjP[dod].x - normSize.width / 2, ObjP[dod].y - normSize.height), normSize);
                                    scinf = state.attrData.Check_Screen_In(rect);
                                }
                            }
                        }
                        break;
                    case enmSoloMode_Number.MarkTurnMode:
                        if (Missing_DataArray[dod] === true) {
                            ObjP[dod] = this.getOverlayMarkPosition(ObjP[dod], misR);
                            scinf = state.attrData.Check_Screen_In(ObjP[dod], misR);
                        } else {
                            ObjP[dod] = this.getOverlayMarkPosition(ObjP[dod], normR);
                            scinf = state.attrData.Check_Screen_In(ObjP[dod], normR);
                        }
                        break;
                }
                ShowF[dod] = scinf;
            }
        }
        if (state.attrData.TotalData.ViewStyle.MapLegend.Base.ModeValueInScreenFlag === true) {
            if ((mode = enmSoloMode_Number.MarkSizeMode) || (mode = enmSoloMode_Number.MarkBarMode)) {
                this.get_InScreenObjectData(LayerNum, DataNum, ShowF);
            }
        }

    }


    /**記号の大きさ、階級記号、記号の回転モードの重ね合わせの際の記号表示位置の移動*/
    static getOverlayMarkPosition(OP: point, r: number) {
        const state = appState();
        const newP = OP.Clone();
        const ato = state.attrData.TempData.OverLay_Temp;
        if ((ato.OverLay_Printing_Flag === true) && (state.attrData.TotalData.TotalMode.OverLay.MarkModePosFixFlag === false)) {
            if (ato.OverLay_EMode_N >= 2) {
                newP.x += ((ato.OverLay_EMode_Now % 2) * 2 - 1) * r;
                if (ato.OverLay_EMode_N > 2) {
                    // '2つの場合はY座標変えず、3つ以上はずらす
                    newP.y += ((Math.floor(ato.OverLay_EMode_Now / 2)) * 2 - 1) * r;
                }
            }
        }
        return newP;
    }

    /**経緯線（前面表示）と地図領域の枠線 */
    static Screen_MapAreaLine(g: CanvasRenderingContext2D){
        const state = appState();
        const av = state.attrData.TotalData.ViewStyle;
        const avs = av.ScrData as AttrScreenInfo;
        if((av.Zahyo.Mode === enmZahyo_mode_info.Zahyo_Ido_Keido) && (av.LatLonLine_Print.Order === enmLatLonLine_Order.Front) && (av.LatLonLine_Print.Visible === true)) {
            Accessory.LatLonLine_Print(g);
        }

        const Lpat = av.Screen_Back.MapAreaFrameLine;
        if(Lpat.BlankF === false) {
            const marginRect = avs.getSXSY_Margin();
            let penw = Math.trunc(state.attrData.Get_Length_On_Screen(Lpat.Width)) / 2;
            if(penw === 0) {
                penw = 1;
            }
            marginRect.inflate(-penw, -penw);
            state.attrData.Draw_Tile_Box(g, marginRect, Lpat, clsBase.BlancTile(), 0);
        }
    }

    //飾りの外接四角形をまとめて記録
    static GetAccessoryRectangles(g: CanvasRenderingContext2D) {
        const state = appState();
        const at = state.attrData.TempData.Accessory_Temp;
        const av = state.attrData.TotalData.ViewStyle;
        if(av.AttMapCompass.Visible === true) {
            at.MapCompass_Rect = Accessory.GetCompassRect(g);
        }
        if(av.MapTitle.Visible === true) {
            at.MapTitle_Rect = Accessory.GetTitleRect(g);
            const padw = state.attrData.Get_PaddingPixcel(av.MapTitle.Font.Back);
            at.MapTitle_Rect.inflate(padw, padw);
        }

        if(av.DataNote.Visible === true) {
            at.DataNote_Rect = Accessory.GetNoteRect(g);
            if(at.DataNote_Rect.width() !== 0) {
                const padw = state.attrData.Get_PaddingPixcel(av.DataNote.Font.Back);
                at.DataNote_Rect.inflate(padw, padw);
            }
        }

        if(av.MapScale.Visible === true) {
            const padw = state.attrData.Get_PaddingPixcel(av.MapScale.Back);
            at.MapScale_Rect = Accessory.GetScaleRect(g);
            at.MapScale_Rect.inflate(padw, padw);
        }
        if((av.MapLegend.Base.Visible === true)|| (av.MapLegend.Line_DummyKind.Line_Visible === true)){
            for (let i = 0; i < state.attrData.TempData.Accessory_Temp.Legend_No_Max; i++) {
                Accessory.Legend_print(g,  i, true);
            }
        }

        const Agb = av.AccessoryGroupBox;
        if(Agb.Visible === true) {
            const Rects = [];
               if((Agb.Title === true) && (at.MapTitle_Rect.width() !== 0)&&(av.MapTitle.Visible ===true )){
                   Rects.push( at.MapTitle_Rect);
            }
               if((Agb.Scale === true) && (at.MapScale_Rect.width() !== 0) && (av.MapScale.Visible ===true )){
                   Rects.push(at.MapScale_Rect);
            }
               if((Agb.Comapss === true) && (at.MapCompass_Rect.width() !== 0) && (av.AttMapCompass.Visible === true)) {
                   Rects.push(at.MapCompass_Rect);
            }
               if((Agb.Note === true) && (at.DataNote_Rect.width() !== 0) && (av.DataNote.Visible ===true )){
                   Rects.push(at.DataNote_Rect);
            }
            if((Agb.Legend === true) && (av.MapLegend.Base.Visible === true)) {
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

    static Figure_Print(g: CanvasRenderingContext2D, back_gazo_f: boolean) {
        const state = appState();
        if(back_gazo_f === false) {
            Accessory.AccGroupBoxDraw(g);
            Accessory.Scale_Print(g);
            Accessory.Note_Print(g);
            Accessory.Compass_print(g);
            Accessory.Title_Print(g);
            Accessory.BeginLegendFrame();
            for (let i = 0; i < state.attrData.TempData.Accessory_Temp.Legend_No_Max; i++) {
                Accessory.Legend_print(g, i, false);
            }
            Accessory.EnsureLegendFallback(g);
            Accessory.LegendHardFallback_Print(g);
            Accessory.LegendDebug_Print(g);
        }
    }

    static Legend_Mark_Mode_Inner_Data_set(InnerData: strInner_Data_Info, Layernum: number, Datanum?: number): Legend2_Atri | undefined {
        const state = appState();
        if(InnerData.Flag === false) {
            return undefined;
        }
        const mlw = new Legend2_Atri();
        mlw.DatN = Datanum !== undefined ? Datanum : InnerData.Data;
        mlw.Layn = Layernum;
        mlw.Print_Mode_Layer = enmLayerMode_Number.SoloMode;
        mlw.title = state.attrData.Get_DataTitle(Layernum, Datanum !== undefined ? Datanum : InnerData.Data, false);
        mlw.SoloMode = enmSoloMode_Number.ClassPaintMode;
        return mlw;
    }
    static Legend_Data_Set() {
        const state = appState();
        let n = 0;
        const at = state.attrData.TempData as unknown as TempDataLegendInfo;
        if(state.attrData.TotalData.TotalMode.OverLay.Always_Overlay_Index !== -1) {

            at.Accessory_Temp.MapLegend_W.length = at.OverLay_Temp.Always_Ove_DataStac.length;
            for (let i = 0; i < at.OverLay_Temp.Always_Ove_DataStac.length; i++) {
                n=this.Legend_Data_Set_Over_sub(at.OverLay_Temp.Always_Ove_DataStac[i], n);
            }
        } else {
            const Layernum = state.attrData.TotalData.LV1.SelectedLayer;
            const Datanum = state.attrData.LayerData[Layernum].atrData.SelectedIndex;
            at.Accessory_Temp.MapLegend_W.length = 1;
            switch (state.attrData.TotalData.LV1.Print_Mode_Total) {
                case enmTotalMode_Number.DataViewMode: {
                    const atw = new Legend2_Atri();
                    switch (state.attrData.LayerData[Layernum].Print_Mode_Layer) {
                        case enmLayerMode_Number.SoloMode: {
                            //単独・グラフモードの凡例設定
                            const att_Data = state.attrData.LayerData[Layernum].atrData.Data[Datanum] as unknown as {
                                ModeData: number;
                                SoloModeViewSettings: {
                                    MarkCommon: { Inner_Data: strInner_Data_Info };
                                    ClassMarkMD: strInner_Data_Info;
                                };
                            };
                            atw.DatN = Datanum;
                            atw.Layn = Layernum;
                            atw.Print_Mode_Layer = state.attrData.LayerData[Layernum].Print_Mode_Layer;
                            atw.title = "";
                            const currentSoloMode = state.attrData.getSoloMode(Layernum, Datanum);
                            atw.SoloMode = currentSoloMode;
                            switch (currentSoloMode) {
                                case enmSoloMode_Number.MarkSizeMode:
                                case enmSoloMode_Number.MarkBlockMode:
                                case enmSoloMode_Number.MarkTurnMode:
                                case enmSoloMode_Number.MarkBarMode:
                                case enmSoloMode_Number.StringMode: {
                                    const lwl=this.Legend_Mark_Mode_Inner_Data_set(att_Data.SoloModeViewSettings.MarkCommon.Inner_Data, Layernum, Datanum);
                                    if(lwl !== undefined) {
                                        atw.title = state.attrData.Get_DataTitle(Layernum, Datanum, false);
                                        at.Accessory_Temp.MapLegend_W[1] = lwl;
                                        n++;
                                    }
                                    break;
                                }
                                case enmSoloMode_Number.ClassMarkMode: {
                                    const lwl = this.Legend_Mark_Mode_Inner_Data_set(state.attrData.LayerData[Layernum].atrData.Data[Datanum].SoloModeViewSettings.ClassMarkMD,
                                        Layernum, Datanum);
                                    if(lwl !== undefined) {
                                        atw.title = state.attrData.Get_DataTitle(Layernum, Datanum, false);
                                        at.Accessory_Temp.MapLegend_W[1] = lwl;
                                        n++;
                                    }
                                    break;
                                }
                            }
                            n++;
                            break;
                        }
                        case enmLayerMode_Number.GraphMode: {
                            //グラフモード
                            atw.Layn = Layernum;
                            atw.Print_Mode_Layer = state.attrData.LayerData[Layernum].Print_Mode_Layer;
                            atw.title = "";
                            atw.DatN = state.attrData.layerGraph().SelectedIndex;
                            const currentGraph = state.attrData.nowGraph() as IGraphDataSet;
                            atw.GraphMode = currentGraph.GraphMode;
                            n++;
                            break;
                        }
                        case enmLayerMode_Number.LabelMode:
                            break;
                        case enmLayerMode_Number.TripMode:
                            //移動表示モード

                            break;
                        // case enmTripMode.TripLayerDataMode:
                        //     break;
                    }
                    at.Accessory_Temp.MapLegend_W[0] = atw;
                    break;
                }
                case enmTotalMode_Number.OverLayMode: {
                    //重ね合わせモード凡例の設定
                    const ato = state.attrData.TotalData.TotalMode.OverLay;
                    const atod = ato.DataSet[ato.SelectedIndex];
                    at.Accessory_Temp.MapLegend_W.length = atod.DataItem.length;
                    for (let i = 0; i < atod.DataItem.length; i++) {
                        n = this.Legend_Data_Set_Over_sub(atod.DataItem[i], n);
                    }
                    break;
                }
            }
        }

        const av = state.attrData.TotalData.ViewStyle;
        const am = av.MapLegend;
        for (let i = 0; i < n; i++) {
            const atw = at.Accessory_Temp.MapLegend_W[i];
            atw.LineKind_Flag = false;
            atw.PointObject_Flag = false;
        }
        if(am.Line_DummyKind.Line_Visible === true) {
            const atw=new Legend2_Atri(); 
            atw.LineKind_Flag = true;
            atw.PointObject_Flag = false;
            at.Accessory_Temp.MapLegend_W[n]=atw;
            n++;
        }
        if(am.Line_DummyKind.Dummy_Point_Visible === true) {
            const atw=new Legend2_Atri(); 
            atw.LineKind_Flag = false;
            atw.PointObject_Flag = true;
            at.Accessory_Temp.MapLegend_W[n]=atw;
            n++;
        }

        if (n === 0 && state.attrData.TotalData.LV1.Print_Mode_Total === enmTotalMode_Number.DataViewMode) {
            const selectedLayer = state.attrData.TotalData.LV1.SelectedLayer;
            const layer = state.attrData.LayerData[selectedLayer];
            if (layer.Print_Mode_Layer === enmLayerMode_Number.SoloMode) {
                const selectedData = layer.atrData.SelectedIndex;
                const atw = new Legend2_Atri();
                atw.DatN = selectedData;
                atw.Layn = selectedLayer;
                atw.Print_Mode_Layer = enmLayerMode_Number.SoloMode;
                atw.title = "";
                atw.SoloMode = state.attrData.getSoloMode(selectedLayer, selectedData);
                atw.LineKind_Flag = false;
                atw.PointObject_Flag = false;
                at.Accessory_Temp.MapLegend_W[0] = atw;
                n = 1;
            }
        }

        if(n > am.Base.Legend_Num) {
            const oldn= am.Base.Legend_Num;
            am.Base.Legend_Num = n
            am.Base.LegendXY.length = n;
            for (let i = oldn; i < n; i++) {
                const avs = av.ScrData as AttrScreenInfo;
                const amb = am.Base;
                if(avs.Accessory_Base === enmBasePosition.Screen) {
                    amb.LegendXY[i] = amb.LegendXY[i - 1].Clone();
                    amb.LegendXY[i].offset(0.05, 0.05);
                    if(amb.LegendXY[i].x >= 0.98) {
                        amb.LegendXY[i].x = amb.LegendXY[i - 1].x;
                    }
                    if(amb.LegendXY[i].y >= 0.98) {
                        amb.LegendXY[i].y = amb.LegendXY[i - 1].y;
                    }
                } else {
                    const Mprect = avs.MapRectangle;
                    const ScrRect = avs.ScrRectangle;
                    amb.LegendXY[i] = amb.LegendXY[i - 1].Clone();
                    amb.LegendXY[i].offset(Mprect.width() * 0.05, Mprect.height() * 0.05);
                    if(amb.LegendXY[i].x > ScrRect.right) {
                        amb.LegendXY[i].x = amb.LegendXY[i - 1].x;
                    }
                    if(amb.LegendXY[i].y > ScrRect.bottom) {
                        amb.LegendXY[i].y = amb.LegendXY[i - 1].y;
                    }
                }
            }
        }
        (at.Accessory_Temp as unknown as { Legend_No_Max: number }).Legend_No_Max = n;
    }

    /**重ね合わせモードのデータセット内の表示項目ごとの凡例セット */
    static Legend_Data_Set_Over_sub(Over_D: IOverLayDataItemElement, orn: number): number {
        const state = appState();
        let n = orn;
        const L = Over_D.Layer;
        switch (Over_D.Print_Mode_Layer) {
            case enmLayerMode_Number.SoloMode: {
                const dt = Over_D.DataNumber;
                if (Over_D.Legend_Print_Flag === true) {
                    const OVerData = state.attrData.LayerData[L].atrData.Data[dt] as unknown as {
                        ModeData: number;
                        SoloModeViewSettings: {
                            ContourMD: { Interval_Mode: number };
                            MarkCommon: { Inner_Data: strInner_Data_Info };
                            ClassMarkMD: strInner_Data_Info;
                        };
                    };
                    const atm = new Legend2_Atri();
                    atm.DatN = Over_D.DataNumber;
                    atm.Layn = L;
                    atm.title = state.attrData.Get_DataTitle(L, dt, false);
                    atm.Print_Mode_Layer = enmLayerMode_Number.SoloMode;
                    if (Over_D.Mode === enmSoloMode_Number.ContourMode) {
                        if(OVerData.SoloModeViewSettings.ContourMD.Interval_Mode===enmContourIntervalMode.ClassPaint){
                            atm.SoloMode = enmSoloMode_Number.ClassPaintMode;
                            state.attrData.TempData.Accessory_Temp.MapLegend_W[n]=atm;
                        }else{
                            n--;
                        }
                    } else {
                        atm.SoloMode = Over_D.Mode;
                        state.attrData.TempData.Accessory_Temp.MapLegend_W[n]=atm;
                        let lwl;
                        const overlaySoloMode = state.attrData.getSoloMode(L, dt);
                        switch (overlaySoloMode) {
                            case enmSoloMode_Number.MarkSizeMode:
                            case enmSoloMode_Number.MarkBlockMode:
                            case enmSoloMode_Number.MarkTurnMode:
                            case enmSoloMode_Number.MarkBarMode:
                            case enmSoloMode_Number.StringMode:
                                 lwl = this.Legend_Mark_Mode_Inner_Data_set(OVerData.SoloModeViewSettings.MarkCommon.Inner_Data, L, atm.DatN);
                                break;
                            case enmSoloMode_Number.ClassMarkMode:
                                 lwl = this.Legend_Mark_Mode_Inner_Data_set(OVerData.SoloModeViewSettings.ClassMarkMD, L, atm.DatN);
                                break;
                        }
                        if (lwl !== undefined) {
                            n++;
                            state.attrData.TempData.Accessory_Temp.MapLegend_W[n] = lwl;
                        }
                    }
                    n++;
                }
                break;
            }
            case enmLayerMode_Number.GraphMode: {
                if (Over_D.Legend_Print_Flag === true) {
                    const atm2 = new Legend2_Atri();;
                    atm2.DatN = Over_D.DataNumber;
                    atm2.Layn = L;
                    atm2.GraphMode = state.attrData.LayerData[L].LayerModeViewSettings.GraphMode.DataSet[atm2.DatN].GraphMode;
                    atm2.title = state.attrData.LayerData[L].LayerModeViewSettings.GraphMode.DataSet[atm2.DatN].title;
                    atm2.Print_Mode_Layer = enmLayerMode_Number.GraphMode;
                    state.attrData.TempData.Accessory_Temp.MapLegend_W[n]=atm2;
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
    static Print_OverLay(g: CanvasRenderingContext2D, DataSet: number) {
        const state = appState();
        const aot = state.attrData.TempData.OverLay_Temp;
        aot.OverLay_Printing_Flag = true;
        const aod = state.attrData.TotalData.TotalMode.OverLay.DataSet[DataSet];
        const Num = aod.DataItem.length;

        for (let i = 0; i < Num; i++) {
            aot.Printing_Number = i;
            const aodd = aod.DataItem[i];
            if(aodd.Print_Mode_Layer === enmLayerMode_Number.SoloMode){
                let Equal_Mode_N=0;
                for (let j = 0; j < Num; j++) {
                    if (i === j) {
                        aot.OverLay_EMode_Now = Equal_Mode_N;
                        Equal_Mode_N++;
                    } else {
                        const ovDataj = aod.DataItem[j];
                        if ((ovDataj.Print_Mode_Layer === enmLayerMode_Number.SoloMode) && (
                            ovDataj.Layer === aodd.Layer) && (ovDataj.Mode === aodd.Mode)) {
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

    static OverLay_Print_Sub(g: CanvasRenderingContext2D, Ov_Data: IOverLayDataItemElement | strOverLay_DataSet_Item_Info) {
        const state = appState();
        const overData = Ov_Data as IOverLayDataItemElement;
        const layerData = state.attrData.LayerData[overData.Layer] as ILayerDataInfo;
        switch (Ov_Data.Print_Mode_Layer) {
            case enmLayerMode_Number.SoloMode: {
                switch (Ov_Data.Mode) {
                    case enmSoloMode_Number.ClassPaintMode:
                        state.attrData.ResetMPSubLineDrawn(layerData.MapFileName);
                        this.PrintClassPaintMode(g, Ov_Data.Layer, Ov_Data.DataNumber);
                        break;
                    case enmSoloMode_Number.MarkSizeMode:
                        this.PrintMarkSizeMode(g, Ov_Data.Layer, Ov_Data.DataNumber);
                        break;
                    case enmSoloMode_Number.MarkBlockMode:
                        state.attrData.TempData.DotMap_Temp.DotMapTempResetF = true;
                        this.PrintMarkBlockMode(g, Ov_Data.Layer, Ov_Data.DataNumber);
                        break;
                    case enmSoloMode_Number.ContourMode:
                        state.attrData.TempData.ContourMode_Temp.ContourDataResetF = true;
                        this.PrintContourMode(g, Ov_Data.Layer, Ov_Data.DataNumber);
                        break;
                    case enmSoloMode_Number.ClassHatchMode:
                        // PrintClassHatchMode(g, Ov_Data .Layer,Ov_Data .DataNumber)
                        break;
                    case enmSoloMode_Number.ClassMarkMode:
                        this.PrintClassMarkMode(g, Ov_Data.Layer, Ov_Data.DataNumber);
                        break;
                    case enmSoloMode_Number.ClassODMode:
                        if (layerData.Shape === enmShape.LineShape) {
                            clsPrint.PrintClassLineShapeSENMode(g, Ov_Data.Layer, Ov_Data.DataNumber);
                        } else {
                            this.PrintClassODMode(g, Ov_Data.Layer, Ov_Data.DataNumber);
                        }
                        break;
                    case enmSoloMode_Number.MarkTurnMode:
                        this.PrintMarkBarMode(g, Ov_Data.Layer, Ov_Data.DataNumber);
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
                this.PrintStringMode(g, Ov_Data.Layer, Ov_Data.DataNumber);
                break;
        }
    }

    /**常時重ね合わせが設定してある場合  */
    static OverLay_Plus_Print(g: CanvasRenderingContext2D) {
        const state = appState();
        const ato = state.attrData.TotalData.TotalMode.OverLay;
        const tmpo = state.attrData.TempData.OverLay_Temp as {
            Always_Ove_DataStac: strOverLay_DataSet_Item_Info[];
            OverLay_Printing_Flag: boolean;
            Printing_Number: number;
            OverLay_EMode_Now: number;
            OverLay_EMode_N: number;
        };
        const n = ato.Always_Overlay_Index;
        tmpo.Always_Ove_DataStac = [];//]strOverLay_DataSet_Item_Info)
        switch (state.attrData.TotalData.LV1.Print_Mode_Total) {
            case enmTotalMode_Number.DataViewMode: {
                tmpo.Always_Ove_DataStac = Generic.ArrayClone(ato.DataSet[n].DataItem) as strOverLay_DataSet_Item_Info[];
                const Layernum = state.attrData.TotalData.LV1.SelectedLayer;
                const al = state.attrData.LayerData[Layernum];
                if (al.Print_Mode_Layer === enmLayerMode_Number.SoloMode) {
                    const DataNum = al.atrData.SelectedIndex
                    const d = new strOverLay_DataSet_Item_Info();
                    d.DataNumber = DataNum;
                    d.Layer = Layernum;
                    d.Print_Mode_Layer = enmLayerMode_Number.SoloMode;
                    d.Mode = Number((al.atrData.Data[DataNum] as unknown as { ModeData: number }).ModeData);
                    d.Legend_Print_Flag = true;
                    tmpo.Always_Ove_DataStac.push(d);
                } else {
                    const d = new strOverLay_DataSet_Item_Info();
                    d.Layer = Layernum;
                    d.DataNumber = al.LayerModeViewSettings.GraphMode.SelectedIndex;
                    d.Print_Mode_Layer = al.Print_Mode_Layer;
                    d.Legend_Print_Flag = true;
                    tmpo.Always_Ove_DataStac.push(d);
                }
                break;
            }
            case enmTotalMode_Number.OverLayMode: {
                const n_now = ato.SelectedIndex
                tmpo.Always_Ove_DataStac = Generic.ArrayClone(ato.DataSet[n].DataItem) as strOverLay_DataSet_Item_Info[];
                if (n !== n_now) {
                    tmpo.Always_Ove_DataStac = tmpo.Always_Ove_DataStac.concat(Generic.ArrayClone(ato.DataSet[n_now].DataItem) as strOverLay_DataSet_Item_Info[]);
                }
                
                break;
            }
        }

        const d2 = state.attrData.Sort_OverLay_Data_Sub(tmpo.Always_Ove_DataStac)
        tmpo.OverLay_Printing_Flag = true;
        for (let i = 0; i < d2.length; i++) {
            tmpo.Printing_Number = i;
            if (d2[i].Print_Mode_Layer === enmLayerMode_Number.SoloMode) {
                let Equal_Mode_N = 0;
                for (let j = 0; j < d2.length; j++) {
                    if (i === j) {
                        tmpo.OverLay_EMode_Now = Equal_Mode_N;
                        Equal_Mode_N++;
                    } else {
                        const ovDataj = d2[j];
                        if ((ovDataj.Print_Mode_Layer === enmLayerMode_Number.SoloMode) && (
                            ovDataj.Layer === d2[i].Layer) && (ovDataj.Mode === d2[i].Mode)) {
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
    static PrintGraphMode(g: CanvasRenderingContext2D, Layernum: number, DataSet: number){
        const state = appState();
        const selGraph = state.attrData.LayerData[Layernum].LayerModeViewSettings.GraphMode.DataSet[DataSet];
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
    static PrintGraph_Pie_StackdBarMode(g: CanvasRenderingContext2D, Layernum: number, DataSet: number) {
        const state = appState();
        const al = state.attrData.LayerData[Layernum];
        const selGraph = al.LayerModeViewSettings.GraphMode.DataSet[DataSet];
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F === true) {
            g.save();
            this.ClippingRegion_ObjectBoundary_set(g, [Layernum], false, true);
        }
        this.Vector_Object_Boundary(g, Layernum)
        this.Vector_Dummy_Boundary(g, Layernum, true, true);
        this.Vector_Connect_CenterP_To_SymbolPoint(g, Layernum);
        const obn = al.atrObject.ObjectNum;

        const en_sort = new SortingSearch();
        for (let i = 0; i < obn; i++) {
            let env = 0;
            for (let j = 0; j < selGraph.Data.length; j++) {
                const Datan = selGraph.Data[j].DataNumber
                if (state.attrData.Check_Missing_Value(Layernum, Datan, i) === true) {
                    env = 0;//欠損値を含む場合は０にして表示しない
                    break;
                } else {
                    env += Number( state.attrData.Get_Data_Value(Layernum, Datan, i, ""));
                }
            }
            en_sort.Add(env);
        }
        en_sort.AddEnd();

        const RMAXVAL = selGraph.En_Obi.MaxValue;

        for (let i = obn - 1; i >= 0; i--) {
            const SortObjPos = en_sort.DataPosition(i);
            const SortSumDataValue = en_sort.DataPositionValue(i);
            // console.log(SortSumDataValue)
            if ((SortSumDataValue !== 0) && (state.attrData.Check_Condition(Layernum, SortObjPos) === true)) {

                const CP = al.atrObject.atrObjectData[SortObjPos].Symbol;
                const OP = (state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo).Get_SxSy_With_3D(CP);

                state.attrData.TempData.ObjectPrintedCheckFlag[Layernum][SortObjPos] = true;
                switch (selGraph.GraphMode) {
                    case enmGraphMode.PieGraph: { //円グラフ
                        let r;
                        if (selGraph.En_Obi.EnSizeMode === enmGraphMaxSize.Fixed) {
                            r = state.attrData.Radius(selGraph.En_Obi.EnSize, RMAXVAL, RMAXVAL);
                        } else {
                            r = state.attrData.Radius(selGraph.En_Obi.EnSize, SortSumDataValue, RMAXVAL);
                        }
                        // console.log(selGraph.En_Obi.EnSize, SortSumDataValue, RMAXVAL)
                        if (r !== 0) {
                            if (state.attrData.Check_Screen_In(OP, r) === true) {
                                let acum = 0
                                for (let j = 0; j < selGraph.Data.length; j++) {
                                    const Datan = selGraph.Data[j].DataNumber
                                    if (state.attrData.Check_Missing_Value(Layernum, Datan, SortObjPos) === false) {
                                        const H =Number( state.attrData.Get_Data_Value(Layernum, Datan, SortObjPos, "")) / SortSumDataValue;
                                        // console.log(H);
                                        if (Math.abs(H - 1) <= 0.00001) {
                                            const Circle_Mark = new Mark_Property();
                                            Circle_Mark.PrintMark = enmMarkPrintType.Mark;
                                            Circle_Mark.WordFont.Back.Tile = clsBase.BlancTile();
                                            Circle_Mark.WordFont.Back.Line = clsBase.BlankLine();
                                            Circle_Mark.WordFont.Back.Round = 0;
                                            Circle_Mark.Line = selGraph.En_Obi.BoaderLine;
                                            Circle_Mark.Tile = selGraph.Data[j].Tile;
                                            state.attrData.Draw_Mark(g, OP, r, Circle_Mark);
                                        } else {
                                            if (H !== 0) {
                                                const start_p = acum;
                                                const end_p = start_p + 2 * Math.PI * H;
                                                const scrData = state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo;
                                                appState().clsDrawMarkFan?.Draw_Fan?.(g, OP, r, start_p, end_p, selGraph.En_Obi.BoaderLine as unknown as Tile_Property, selGraph.Data[j].Tile, scrData);
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
                        let r2 = 0;
                        let xw;
                        let yw;
                        if (selGraph.En_Obi.EnSizeMode === 0) {
                            r = state.attrData.Get_Length_On_Screen(selGraph.En_Obi.EnSize);
                        } else {
                            r = state.attrData.Radius(selGraph.En_Obi.EnSize, SortSumDataValue, RMAXVAL) * 2;
                        }
                        r2 = r * selGraph.En_Obi.AspectRatio;
                        if (selGraph.En_Obi.StackedBarDirection === enmStackedBarChart_Direction.Vertical) {
                            xw = r2 / 2;
                            yw = r;
                        } else {
                            xw = r / 2;
                            yw = r2 / 2;
                        }
                        const C_Rect = new rectangle(new point(OP.x - xw, OP.y - yw), new size(xw * 2, yw * 2));
                        if (state.attrData.Check_Screen_In(C_Rect) === true) {
                            let E = 0;
                            for (let j = 0; j < selGraph.Data.length; j++) {
                                const Datan = selGraph.Data[j].DataNumber;
                                if (state.attrData.Check_Missing_Value(Layernum, Datan, SortObjPos) === false) {
                                    const dataValue = state.attrData.Get_Data_Value(Layernum, Datan, SortObjPos, "");
                                    const H = typeof dataValue === 'number' ? dataValue / SortSumDataValue : 0;
                                    let Rect;
                                    switch (selGraph.En_Obi.StackedBarDirection) {
                                        case enmStackedBarChart_Direction.Vertical:
                                            Rect = new rectangle(OP.x - r2 / 2, OP.x + r2 / 2,OP.y - r + E * r,  OP.y - r + E * r + r * H);
                                            break;
                                        case enmStackedBarChart_Direction.Horizontal:
                                            Rect = new rectangle(OP.x - r / 2 + E * r,  OP.x - r / 2 + E * r + r * H,OP.y - r2 / 2, OP.y + r2 / 2);
                                            break;
                                    }
                                    state.attrData.Draw_Tile_Box(g, Rect,  selGraph.En_Obi.BoaderLine, selGraph.Data[j].Tile,0);
                                    E += H;
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F === true) {
            g.restore();
        }
    }

    /**棒グラフまたは折れ線グラフ */
    static PrintGraph_Line_BarMode(g: CanvasRenderingContext2D, Layernum: number, DataSet: number) {
        const state = appState();
        const al = state.attrData.LayerData[Layernum];
        const selGraph = al.LayerModeViewSettings.GraphMode.DataSet[DataSet];
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F === true) {
            g.save();
            this.ClippingRegion_ObjectBoundary_set(g, [Layernum], false, true);
        }
        this.Vector_Object_Boundary(g, Layernum)
        this.Vector_Dummy_Boundary(g, Layernum, true, true);
        this.Vector_Connect_CenterP_To_SymbolPoint(g, Layernum);

        const obn = al.atrObject.ObjectNum;

        let OverLay_With_Bou = false;
        let OverLay_Refference_Multi;
        if ((state.attrData.TempData.OverLay_Temp.OverLay_Printing_Flag === true) && (selGraph.GraphMode === enmGraphMode.LineGraph)) {
            const ato = state.attrData.TotalData.TotalMode.OverLay;
            for (let i = 0; i < state.attrData.TempData.OverLay_Temp.Printing_Number; i++) {
                const atod = ato.DataSet[ato.SelectedIndex].DataItem[i];
                if ((atod.Layer === Layernum) && (atod.Print_Mode_Layer === enmLayerMode_Number.GraphMode)) {
                     OverLay_Refference_Multi =  state.attrData.LayerData[atod.Layer].LayerModeViewSettings.GraphMode.DataSet[atod.DataNumber];
                    if (OverLay_Refference_Multi.GraphMode === enmGraphMode.BarGraph) {
                        OverLay_With_Bou = true;
                    }
                }
            }
        }

        const YMax = selGraph.Oresen_Bou.YMax;
        const Ymin = selGraph.Oresen_Bou.Ymin;
        const ST = selGraph.Oresen_Bou.Ystep;
        let a;
        let ww;
        let wh;
        if (OverLay_With_Bou === false) {
            this.Vector_Connect_CenterP_To_SymbolPoint(g, Layernum);
            ww = state.attrData.Get_Length_On_Screen(selGraph.Oresen_Bou.Size);
            wh = ww / selGraph.Oresen_Bou.AspectRatio;
            if (selGraph.GraphMode === enmGraphMode.LineGraph) {
                a = 1;
            } else {
                a = 2;
            }
        } else {
            ww = state.attrData.Get_Length_On_Screen(OverLay_Refference_Multi.Oresen_Bou.Size);
            wh = ww / OverLay_Refference_Multi.Oresen_Bou.AspectRatio;
            a = 1;
        }

        const stx = ww / (selGraph.Data.length + a);
        for (let i = 0; i < obn; i++) {
            if (state.attrData.Check_Condition(Layernum, i) === true) {
                let dataMaxV;
                let dataMinV;
                let wrh;
                if(state.attrData.TempData.OverLay_Temp.OverLay_Printing_Flag === true){
                    dataMaxV=YMax;
                    dataMinV=Ymin;
                    wrh = wh;
                }else{
                    let fif=true;
                    for (let j = 0; j < selGraph.Data.length; j++) {
                        const Datan = selGraph.Data[j].DataNumber;
                        if (state.attrData.Check_Missing_Value(Layernum, Datan, i) === false) {
                            const v = state.attrData.Get_Data_Value(Layernum, Datan, i, "");
                            if (typeof v === 'number') {
                                if (fif === true) {
                                    dataMaxV = v;
                                    dataMinV = v;
                                    fif=false;
                                } else {
                                    dataMaxV = Math.max(dataMaxV, v);
                                    dataMinV = Math.min(dataMinV, v);
                                }
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
                    const dataMaxH=Math.abs( (dataMaxV- dataMinV) / (YMax - Ymin));
                     wrh = wh * dataMaxH;
                }

                const CP = al.atrObject.atrObjectData[i].Symbol;
                const OP = (state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo).Get_SxSy_With_3D(CP);
                state.attrData.TempData.ObjectPrintedCheckFlag[Layernum][i] = true;
                OP.offset(-ww / 2, -wrh / 2);
                const Rect = new rectangle(OP, new size(ww, wrh));
                if (state.attrData.Check_Screen_In(Rect) === true) {
                    if (OverLay_With_Bou === false) {
                        state.attrData.Draw_Tile_Box(g, Rect, clsBase.BlankLine(), selGraph.Oresen_Bou.BackgroundTile, 0);
                        if (selGraph.Oresen_Bou.FrameAxe === enmBarChartFrameAxePattern.Whole) {
                            state.attrData.Draw_Tile_Box(g, Rect, selGraph.Oresen_Bou.BorderLine, clsBase.BlancTile(), 0);
                        } else {
                            state.attrData.Draw_Line(g, selGraph.Oresen_Bou.BorderLine, [Rect.bottomLeft(), Rect.topLeft()]);
                            state.attrData.Draw_Line(g, selGraph.Oresen_Bou.BorderLine, [Rect.bottomLeft(), Rect.bottomRight()]);
                        }
                        const Zero_Line = clsBase.Line();
                        Zero_Line.Color = selGraph.Oresen_Bou.BorderLine.Color.Clone();
                        for (let wakuj = Ymin; wakuj <= dataMaxV; wakuj += ST) {
                            if (wakuj >= dataMinV) {
                                const H = 1- (wakuj - dataMinV) / (dataMaxV- dataMinV);
                                const yy = OP.y + wrh * H;
                                state.attrData.Draw_Line(g, Zero_Line, [new point(OP.x, yy), new point(OP.x + ww / 15, yy)]);
                                if (selGraph.Oresen_Bou.FrameAxe === enmBarChartFrameAxePattern.Whole) {
                                    state.attrData.Draw_Line(g, Zero_Line, [new point(OP.x + ww, yy), new point(OP.x + ww - ww / 15, yy)]);
                                }
                            }
                        }
                    }
                    if ((Ymin < 0) && (YMax > 0)) {
                        const Zero_Line = clsBase.Line();
                        Zero_Line.Color = selGraph.Oresen_Bou.BorderLine.Color.Clone();
                        const H = 1 - (-dataMinV) / (dataMaxV- dataMinV);
                        const yy = OP.y + wrh * H;
                        g.setLineDash([5,3]);
                        state.attrData.Draw_Line(g, Zero_Line, [new point(OP.x, yy), new point(OP.x + ww, yy)]);
                        g.setLineDash([]);
                    }

                    g.save();
                    const RectC = Rect;
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
                                const Datan = selGraph.Data[j].DataNumber;
                                if (state.attrData.Check_Missing_Value(Layernum, Datan, i) === false) {
                                    const dataValue = state.attrData.Get_Data_Value(Layernum, Datan, i, "");
                                    const H = typeof dataValue === 'number' ? 1 - (dataValue - dataMinV) / (dataMaxV- dataMinV) : 0;
                                    const yy = OP.y + wrh * H;
                                    if (ff === true) {
                                        flx1 = fsx;
                                        fly1 = yy;
                                        ff = false;
                                    } else {
                                        state.attrData.Draw_Line(g, selGraph.Oresen_Bou.Line, [new point(flx1, fly1), new point(fsx, yy)]);
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
                                const Datan = selGraph.Data[j].DataNumber;
                                if (state.attrData.Check_Missing_Value(Layernum, Datan, i) === false) {
                                    const dataValue = state.attrData.Get_Data_Value(Layernum, Datan, i, "");
                                    const H = typeof dataValue === 'number' ? 1 - (dataValue - dataMinV) / (dataMaxV- dataMinV) : 0;
                                    const yy = OP.y + wrh * H;
                                    const yy2 = OP.y + (wrh * (1 - (-dataMinV) / (dataMaxV- dataMinV)));
                                    const barRect = new rectangle(fsx, fsx + stx, yy, yy2);
                                    state.attrData.Draw_Tile_Box(g, barRect, selGraph.Oresen_Bou.Line, selGraph.Data[j].Tile, 0);
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
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F === true) {
            g.restore();
        }
    }


    /**ラベルモード */
    static PrintLabelMode(g: CanvasRenderingContext2D, Layernum: number, DataSet: number) {
        const state = appState();
        const al = state.attrData.LayerData[Layernum];
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F === true) {
            g.save();
            this.ClippingRegion_ObjectBoundary_set(g, [Layernum], false, true);
        }
        this.Vector_Object_Boundary(g, Layernum)
        this.Vector_Dummy_Boundary(g, Layernum, true, true);

        const attLbl = al.LayerModeViewSettings.LabelMode.DataSet[DataSet] as LabelModeDataSetInfo;
        const LabelMark = attLbl.Location_Mark;


        // const LocMarkFlag = attLbl.Location_Mark_Flag;
        const mark_r = state.attrData.Radius(attLbl.Location_Mark.WordFont.Size, 1, 1);


        const obn = al.atrObject.ObjectNum;
        const XY = []
        for (let i = 0; i < obn; i++) {
            const CP = al.atrObject.atrObjectData[i].Label;
            XY.push((state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo).Get_SxSy_With_3D(CP));
        }

        const Data_n = attLbl.DataItem.length;
        const BoxWidth = state.attrData.Get_Length_On_Screen(attLbl.Width);

        //ラベルを表示
        for (let i = 0; i < obn; i++) {
            if (state.attrData.Check_Condition(Layernum, i) === true) {
                let D_TxHeight = 0;
                const D_Word_Cut: string[] = [];
                if (Data_n > 0) {

                    for (let j = 0; j < Data_n; j++) {
                        let wo2 = "";
                        const dataItem = attLbl.DataItem[j];
                        const DataNum = typeof dataItem === 'number' ? dataItem : dataItem.Data;
                        if (attLbl.DataName_Print_Flag === true) {
                            wo2 = state.attrData.Get_DataTitle(Layernum, DataNum, false) + "："
                        }
                        if (state.attrData.Check_Missing_Value(Layernum, DataNum, i) === true) {
                            if (state.attrData.TotalData.ViewStyle.Missing_Data.Print_Flag === true) {
                                wo2 += state.attrData.TotalData.ViewStyle.Missing_Data.Label;
                            } else {
                                wo2 = "";
                            }
                        } else {
                            switch (state.attrData.Get_DataType(Layernum, DataNum)) {
                                case enmAttDataType.Normal: {
                                    const V = state.attrData.Get_Data_Value(Layernum, DataNum, i, "");
                                    if (typeof V === 'number') {
                                        wo2 += Generic.Figure_Using_Solo(V, state.attrData.TotalData.ViewStyle.MapLegend.Base.Comma_f);
                                    } else {
                                        wo2 += String(V);
                                    }
                                    if (attLbl.DataValue_Unit_Flag === true) {
                                        wo2 += state.attrData.Get_DataUnit(Layernum, DataNum);
                                    }
                                    break;
                                }
                                case enmAttDataType.Category, enmAttDataType.Strings:
                                    wo2 += state.attrData.Get_Data_Value(Layernum, DataNum, i, "");
                                    break;

                            }
                            const retV = clsDraw.TextCut_for_print(g, wo2,
                                attLbl.DataValue_Font, attLbl.DataValue_TurnFlag, BoxWidth, state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo);
                            Array.prototype.push.apply(D_Word_Cut, retV.Out_Text);
                            D_TxHeight = retV.Height;
                        }
                    }

                }
                if ((D_Word_Cut.length > 0) || (attLbl.ObjectName_Print_Flag === true)) {

                    let O_Word_Cut: string[] = [];
                    let O_TxHeight = 0;
                    if (attLbl.ObjectName_Print_Flag === true) {
                        const retV = clsDraw.TextCut_for_print(g, state.attrData.Get_KenObjName(Layernum, i),
                            attLbl.ObjectName_Font, Boolean(attLbl.ObjectName_Turn_Flag), BoxWidth, state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo);
                        O_Word_Cut = retV.Out_Text;
                        O_TxHeight = retV.Height;
                    }

                    state.attrData.TempData.ObjectPrintedCheckFlag[Layernum][i] = true;

                    const TH = D_TxHeight * D_Word_Cut.length + O_TxHeight * O_Word_Cut.length;
                    const AP = new point();
                    const BP = new point();
                    AP.x = XY[i].x - BoxWidth / 2;
                    BP.x = AP.x + BoxWidth;
                    const scx = XY[i].x;

                    AP.y = (attLbl.Location_Mark_Flag === true) ? XY[i].y : XY[i].y - TH / 2;
                    if (state.attrData.Check_Screen_In(new rectangle(AP, new size(BoxWidth * 2, TH * 2))) === true) {
                        let y2 = 0;
                        if (attLbl.Location_Mark_Flag === true) {
                            Label_MarkPrint(g, XY[i], mark_r, LabelMark);//表示位置の記号を表示
                            y2 += mark_r * 4;
                        }
                        if (attLbl.ObjectName_Print_Flag === true) {
                            const Rect = new rectangle(AP.x - 1, BP.x, AP.y + y2 - 1, AP.y + y2 + O_TxHeight * O_Word_Cut.length);
                            state.attrData.Draw_Tile_Box(g, Rect, attLbl.BorderLine, attLbl.BorderObjectTile, 0);
                            for (let j = 0; j < O_Word_Cut.length; j++) {
                                state.attrData.Draw_Print(g, O_Word_Cut[j], new point(scx, AP.y + y2), attLbl.ObjectName_Font, enmHorizontalAlignment.Center, enmVerticalAlignment.Top);
                                y2 += O_TxHeight;
                            }
                            y2++;
                        }

                        if (attLbl.DataValue_Print_Flag !== false) {
                            const Rect = new rectangle(AP.x - 1, BP.x, AP.y + y2 - 1, AP.y + y2 + D_TxHeight * D_Word_Cut.length);
                            state.attrData.Draw_Tile_Box(g, Rect, attLbl.BorderLine, attLbl.BorderDataTile, 0);
                            for (let j = 0; j < D_Word_Cut.length; j++) {
                                state.attrData.Draw_Print(g, D_Word_Cut[j], new point(scx, AP.y + y2), attLbl.DataValue_Font, enmHorizontalAlignment.Center, enmVerticalAlignment.Top);
                                y2 += D_TxHeight;
                            }
                        }
                    }
                }
            }
        }
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F === true) {
            g.restore();
        }

        function Label_MarkPrint(g: CanvasRenderingContext2D, Pos: point, r: number, MK: Mark_Property) {
            if (state.attrData.Check_Screen_In(Pos, r) === true) {
                state.attrData.Draw_Mark(g, Pos, r, MK)
            }   
        }
    }


    /**等値線モード */
    static PrintContourMode(g: CanvasRenderingContext2D, LayerNum: number, DataNum: number) {
        const state = appState();
        const al = state.attrData.LayerData[LayerNum];
        const ad = al.atrData.Data[DataNum];
        const cont=state.attrData.TempData.ContourMode_Temp;
        if(cont.ContourDataResetF === true ){
            //等値線用メッシュデータを作成する
            this.ContourMeshIndexSet( LayerNum, DataNum);
        }
        const Missing_DataArray  = state.attrData.Get_Missing_Value_DataArray(LayerNum, DataNum);
        for(let i=0;i< al.atrObject.ObjectNum ;i++){
            if(Missing_DataArray[i] === false ){
                state.attrData.TempData.ObjectPrintedCheckFlag[LayerNum][i] = true;
            }
        }

        const C_md  = ad.SoloModeViewSettings.ContourMD as { Interval_Mode: number; Detailed: number; Draw_in_Polygon_F: boolean; Spline_flag: boolean };
        const contourTemp = cont as ContourTempInfo;

        //等値線間隔と値を取得
        const retConV = this.GetContourIntervalValue(LayerNum, DataNum);
        const hn = retConV.hn;
        const Contour_High_M = retConV.Contour_High_M;
        const C_Line_Pat = retConV.C_Line_Pat;
        //メッシュから等高線を抜き出す
        const Pre_CStac: ContourLineStackInfo[] = [];// clsMeshContour.ContourLineStackInfo
        const contourMesh = cont.ContourMesh as MeshContour;
        const ln  = contourMesh.Execute_Mesh(hn, Contour_High_M, Pre_CStac);

        if(ln === 0 ){
            Generic.alert(undefined,"該当する等値線が取得できませんでした。<br>下限値・上限値を変更してください。");
            return
        }

        let Clip_F2  = false;
        if(al.LayerModeViewSettings.PolygonDummy_ClipSet_F === true ){
            g.save();
            if((C_md.Interval_Mode === enmContourIntervalMode.RegularInterval )||(C_md.Interval_Mode === enmContourIntervalMode.SeparateSettings)){
                this.Vector_Dummy_Boundary(g,  LayerNum, true, false);
            }
            Clip_F2 = this.ClippingRegion_ObjectBoundary_set(g, [LayerNum], false, true);
            if((C_md.Interval_Mode === enmContourIntervalMode.RegularInterval )||(C_md.Interval_Mode === enmContourIntervalMode.SeparateSettings)){
                this.Vector_Object_Boundary(g,  LayerNum);
                this.Vector_Dummy_Boundary(g,  LayerNum, (Clip_F2 === false), true);
            }
        }else{
            if((C_md.Interval_Mode === enmContourIntervalMode.RegularInterval )||(C_md.Interval_Mode === enmContourIntervalMode.SeparateSettings)){
                this.Vector_Object_Boundary(g,  LayerNum);
                this.Vector_Dummy_Boundary(g,  LayerNum, true, true);
            }
        }
        const ST = (C_md.Detailed <= 2) ? 0.4 : 0.2;

        if(C_md.Draw_in_Polygon_F === true ){
            //ポリゴン内部のみ描画
            g.save();
            this.ClippingRegion_ObjectBoundary_set(g,  [LayerNum], true, (al.LayerModeViewSettings.PolygonDummy_ClipSet_F === false));
        }

        if (C_md.Interval_Mode === enmContourIntervalMode.ClassPaint) {
            //ペイントモードで塗りつぶす
            const Frame_AllPoint = [];
            const FrameStac = Generic.Array2Dimension(4, 2, 0);
            const Frame_AllLineStac = [];
            let FrameAllLineN = 0;
            for (let i = 0; i <= 3; i++) {
                const Frame_LineStac: number[] = [];
                const Frame_Point: point[] = [];
                const FrameLineN = contourMesh.Execute_FrameGet(i, hn, Contour_High_M, Frame_LineStac, Frame_Point);
                FrameStac[i][0] = FrameAllLineN;
                FrameStac[i][1] = FrameLineN;
                for (let j = 0; j < FrameLineN; j++) {
                    Frame_AllPoint.push(Frame_Point[j]);
                    Frame_AllLineStac.push(Frame_LineStac[j]);
                }
                FrameAllLineN += FrameLineN;
            }

            const HnPolygon = [];// VecContourStac_Info
            for (let i = 0; i <= hn; i++) {
                const d = new VecContourStac_Info();
                HnPolygon.push(d);
            }
            for (let i = 0; i < ln; i++) {
                const n = Pre_CStac[i].ContourNumber;
                for (let j = 0; j <= 1; j++) {
                    const d = HnPolygon[n + j];
                    d.cStac.push(i);
                    d.CNum++;
                }
            }
            for (let i = 0; i <= 3; i++) {
                for (let j = 0; j <= FrameStac[i][1] - 2; j++) {
                    const n = Frame_AllLineStac[FrameStac[i][0] + j];
                    const d = HnPolygon[n + 1];
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
            const Con_Obj_Code = i + contourTemp.Contour_All_Number;
            const pci=Pre_CStac[i];
            const d = new strContour_Line_property();
            d.Layernum = LayerNum
            d.DataNum = DataNum
            d.PointStac = contourTemp.Contour_All_Point;
            d.NumOfPoint = pci.NumOfPoint;
            d.Value = Contour_High_M[pci.ContourNumber];
            d.Circumscribed_Rectangle = new rectangle(pci.points[0], new size(0, 0));

            for (let j = 0; j <  pci.NumOfPoint; j++) {
                contourTemp.Contour_Point.push(pci.points[j].Clone());
                contourTemp.Contour_All_Point++;
                d.Circumscribed_Rectangle = spatial.getCircumscribedRectangle(pci.points[j], d.Circumscribed_Rectangle);
            }
            d.Flag = true;
            contourTemp.Contour_Object[Con_Obj_Code] = d;

            let pxy: point[] = [];
            if (C_md.Spline_flag === true && clsSpline.Spline_Get) {
                pxy = clsSpline.Spline_Get(0, pci.NumOfPoint, pci.points, ST, state.attrData.TotalData.ViewStyle.ScrData) as point[];
            } else {
                for (let j = 0; j < pci.NumOfPoint; j++) {
                    pxy.push((state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo).Get_SxSy_With_3D(pci.points[ j]));
                }
            }
            state.attrData.Draw_Line(g, C_Line_Pat[pci.ContourNumber], pxy);

        }
        this.ObjectValue_And_Name_Print_byLayer(g,  LayerNum, DataNum);

        if(C_md.Draw_in_Polygon_F === true ){
            g.restore();
        }

        if(C_md.Interval_Mode === enmContourIntervalMode.ClassPaint){
            this.Vector_Object_Boundary(g,  LayerNum);
            this.Vector_Dummy_Boundary(g, LayerNum, true, true);
        }
        if(al.LayerModeViewSettings.PolygonDummy_ClipSet_F === true ){
            g.restore();
        }
        cont.Contour_All_Number += ln;
    }

    static ContourPolyBoundary(g: CanvasRenderingContext2D, Layernum: number, DataNum: number,
        Pcon: number, hn: number, Interval_Mode: number, HnPolygon: VecContourStac_Info, Pre_CStac: ContourLineStackInfo[], Frame_AllPoint: point[], Spline_flag: boolean, SplineT: number) {
        const state = appState();
        const spxy = [];
        const epxy = [];
        const NL= HnPolygon.CNum + HnPolygon.fnum;
        for (let j = 0; j < HnPolygon.CNum; j++) {
            const hc=HnPolygon.cStac[j];
            const n = Pre_CStac[hc].NumOfPoint;
            spxy.push(Pre_CStac[hc].points[0].Clone());
            epxy.push(Pre_CStac[hc].points[n - 1].Clone());
        }
        for (let j = 0; j < HnPolygon.fnum; j++) {
            const hc=HnPolygon.FStac[j];
            spxy.push(Frame_AllPoint[hc].Clone());
            epxy.push(Frame_AllPoint[hc + 1].Clone());
        }

        const boundArrange = spatial.BoundaryArrangeGeneral(NL, spxy, epxy);
        if (boundArrange.Pon === 0) {
            return;
        }
        const Arrange_LineCode = boundArrange.Arrange_LineCode;
        const Fringe = boundArrange.Fringe;
        const nPolyP = [];
        // let p = 0;
        // for (let i = 0; i < Fringe.length; i++) {
        //     if (Fringe[i].code < HnPolygon.CNum) {
        //         p += Pre_CStac[HnPolygon.cStac[Fringe[i].code]].NumOfPoint;
        //     } else {
        //         p += 2;
        //     }
        // }
        const pxy=[];
        let ponpon = 0
        for (let i = 0; i < boundArrange.Pon; i++) {
            let np2 = 0;
            for (let j = 0; j < Arrange_LineCode[i][1]; j++) {
                let revf;
                if (Fringe[Arrange_LineCode[i][0] + j].Direction === 1) {
                    revf = false;
                } else {
                    revf = true;
                }
                const L = Fringe[Arrange_LineCode[i][0] + j].code;
                if (L < HnPolygon.CNum) {
                    const hc=HnPolygon.cStac[L];
                    let n = Pre_CStac[hc].NumOfPoint;
                    if (Spline_flag === true && clsSpline.Spline_Get) {
                        const pxytemp = clsSpline.Spline_Get(0, n, Pre_CStac[hc].points, SplineT, state.attrData.TotalData.ViewStyle.ScrData);
                        const spn=pxytemp.length;
                        if (revf === false) {
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
                        if (revf === false) {
                            for (let k = 0; k < n; k++) {
                                pxy.push((state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo).Get_SxSy_With_3D(Pre_CStac[hc].points[k]));
                            }
                        } else {
                            for (let k = 0; k < n; k++) {
                                pxy.push((state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo).Get_SxSy_With_3D(Pre_CStac[hc].points[ n - 1 - k]));
                            }
                        }
                    }
                    np2 += n;
                } else {
                    if (revf === false) {
                        pxy.push((state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo).Get_SxSy_With_3D(spxy[L]));
                        pxy.push((state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo).Get_SxSy_With_3D(epxy[L]));
                    } else {
                        pxy.push((state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo).Get_SxSy_With_3D(epxy[L]));
                        pxy.push((state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo).Get_SxSy_With_3D(spxy[L]));
                    }
                    np2 += 2;
                }
            }
            nPolyP.push(np2);
            ponpon++;
        }
        switch (Interval_Mode) {
            case enmContourIntervalMode.ClassPaint: {
                const col = state.attrData.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings.Class_Div[(hn as number) - (Pcon as number)].PaintColor.toRGBA();
                const poly = new PolydataInfo();   
                poly.Pon=ponpon;
                poly.pxy=pxy;
                poly.nPolyP=nPolyP;
                clsDraw.DrawPolyPolygon(g, poly, col);
                break;
            }
        }
    }

    
    static ContourMeshIndexSet(Layernum: number, DataNum: number) {
        const state = appState();
        const al = state.attrData.LayerData[Layernum];
        const ad = al.atrData.Data[DataNum];
        const vs = state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo;

        const mw = vs.MapRectangle.width();
        const mh = vs.MapRectangle.height();
        const ObjN = al.atrObject.ObjectNum;
        const StdWSize = 10; // vs.STDWsize; // Property not available, using default
        let md = Math.sqrt(15 * mw * mh / ObjN);
        md = Math.min(md, StdWSize * 0.05);
        const F_Meshx = parseInt((mw / md).toString());
        const F_Meshy = parseInt((mh / md).toString());
        const F_Mesh: number[][][] = Generic.Array2Dimension(F_Meshx + 1, F_Meshy + 1);
        for (let j = 0; j <= F_Meshx; j++) {
            for (let k = 0; k <= F_Meshy; k++) {
                F_Mesh[j][k] = [0, -1];
            }
        }

        let nn = 0;
        const Missing_DataArray = state.attrData.Get_Missing_Value_DataArray(Layernum, DataNum);
        const F_Mesh_In: number[] = Array.from({ length: ObjN }, () => 0);

        for (let i = 0; i < ObjN; i++) {

            if (Missing_DataArray[i] === false) {
                const cp = al.atrObject.atrObjectData[i].CenterPoint;
                const X = parseInt(((cp.x - vs.MapRectangle.left) / md).toString());;
                const Y = parseInt(((cp.y - vs.MapRectangle.top) / md).toString());
                F_Mesh[X][Y][0]++;
                for (let j = 0; j <= F_Meshx; j++) {
                    for (let k = 0; k <= F_Meshy; k++) {
                        if (F_Mesh[j][k][1] > F_Mesh[X][Y][1]) {
                            F_Mesh[j][k][1]++;
                        }
                    }
                }
                if (F_Mesh[X][Y][0] === 1) {
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
        const contourMD = ad.SoloModeViewSettings.ContourMD as unknown as { Detailed: number };
        let md2;
        switch (contourMD.Detailed) {
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
        if (!md2) return;
        
        const D_Meshx = parseInt((mw / md2).toString());
        const D_Meshy = parseInt((mh / md2).toString());
        const cont = state.attrData.TempData.ContourMode_Temp;
        cont.Contour_All_Number = 0;
        cont.Contour_All_Point = 0;
        cont.Contour_Point=[];
        const contourMesh = new MeshContour(D_Meshx + 1, D_Meshy + 1, md2 * D_Meshx, md2 * D_Meshy, vs.MapRectangle.left, vs.MapRectangle.top);
        cont.ContourMesh = contourMesh;
        cont.ContourDataResetF = false;

        const DataValue = state.attrData.Get_Data_Cell_Array_With_MissingValue(Layernum, DataNum);
        for (let i = 0; i <= D_Meshx; i++) {
            for (let j = 0; j <= D_Meshy; j++) {
                const P = vs.MapRectangle.topLeft();
                P.offset(i * md2, j * md2);
                const v = this.ContourMesh_Value(Layernum, DataNum, DataValue, P, md, F_Mesh, F_Mesh_In);
                contourMesh.SetMeshValue(i, j, v);
            }
        }

    }

    static ContourMesh_Value(Layernum: number, DataNum: number, DataValue: number[], P: point, md: number, F_Mesh: number[][][], F_Mesh_In: number[]) {
        const state = appState();
        const al = state.attrData.LayerData[Layernum];
        const ad = al.atrData.Data[DataNum];
        const vs = state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo;
        const xx = parseInt(((P.x - vs.MapRectangle.left) / md).toString());
        const yy = parseInt(((P.y - vs.MapRectangle.top) / md).toString());
        const F_Mesh_W = F_Mesh.length-1;
        const F_Mesh_H = F_Mesh[0].length-1;
        const O_Code: number[] = [];
        const O_Distance: number[] = [];
        let n = 0;
        let c = 0;
        let cend = 3;

        //メッシュ点周辺のオブジェクトを検索する
        const AngleSort = new SortingSearch();
        const dir_num = Generic.Array2Dimension(3, 3, 0);
        const dir_c = Generic.Array2Dimension(3, 3, false);
        do {
            let enf=false;
            do {
                //kkは菱形に走査していくために使う
                let kk = 0
                for (let i = xx - c; i <= xx + c; i++) {
                    if ((0 <= i) && (i <= F_Mesh_W)) {
                        const qx = Math.sign(i - xx) + 1;
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
                            if (j !== undefined && (0 <= j) && (j <= F_Mesh_H)) {
                                const qy = Math.sign(j - yy) + 1;
                                const meshCell: number[] | undefined = F_Mesh[i]?.[j];
                                if (!meshCell || (dir_c[qx][qy] === true) || (meshCell[0] === 0)) {
                                    // メッシュセルがないか、方向がチェック済みか、オブジェクト数が0の場合はスキップ
                                } else {
                                    dir_num[qx][qy] += meshCell[0];
                                    for (let k = 0; k < meshCell[0]; k++) {
                                        const O_cd = F_Mesh_In[k + meshCell[1]];
                                        const P3 = al.atrObject.atrObjectData[O_cd].CenterPoint;
                                        if (P.Equals(P3) === true) {
                                            return DataValue[O_cd];
                                        }
                                        const d = Math.sqrt((P3.x - P.x) ** 2 + (P3.y - P.y) ** 2);
                                        O_Distance.push(d);
                                        O_Code.push(O_cd);
                                        const si = (P3.y - P.y) / d;
                                        const co = (P3.x - P.x) / d;
                                        AngleSort.Add(Generic.Angle(si, co));
                                        n++;
                                    }
                                    if (dir_num[qx][qy] >= 2) {
                                        dir_c[qx][qy] = true;
                                    }
                                }
                            }
                            if (kk === 0) { break; }
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
                        if ((i === 1) && (j === 1)) {
                            // 中心セル（現在位置）はスキップ
                        } else {
                            if (dir_c[i][j] === false) {
                                enf = false;
                                j = 2;
                                i = 2;
                            }
                        }
                    }
                }
            } while ((enf === false) && (c < cend));
            cend += 2;
        } while (n === 0);
        AngleSort.AddEnd()
        //メッシュに最も近いオブジェクトの距離を１とする

        let mind = O_Distance[0];
        for (let i = 0; i < O_Distance.length; i++) {
            mind = Math.min(mind, O_Distance[i])
            if (mind === 0) {
                return DataValue[O_Code[i]];
            }
        }
        for (let i = 0; i < n; i++) {
            O_Distance[i] = (O_Distance[i] / mind) //^ 2 ^2の数字を大きくすると一番近い位置の値が強調される
        }


        //30度以内に近接し、ある程度離れている点は、近い方を選択する
        const contourMD = ad.SoloModeViewSettings.ContourMD as unknown as { Detailed: number };
        const alimit = 25 * (3 - Math.max(contourMD.Detailed - 1, 0)) + 30;

        const O_Distance_NoUseF = new Array(n).fill(false);
        let nn = n;
        let fa = AngleSort.DataPositionValue(0);
        let fai = 0;
        let ffa = fa;
        for (let i = 0; i < n; i++) {
            const So_fai = AngleSort.DataPosition(fai);
            const So_i = AngleSort.DataPosition(i);
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
        let OI = 0;
        let a = 0;
        for (let i = 0; i < n; i++) {
            if (O_Distance_NoUseF[AngleSort.DataPosition(i)] === false) {
                a = AngleSort.DataPositionValue(i) as number;
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
            if (O_Distance_NoUseF[i] === false) {
                SV += DataValue[O_Code[i]] / O_Distance[i];
                SU += 1 / O_Distance[i];
            }
        }
        
        return SV / SU;
    }

    static GetContourIntervalValue(Layernum: number, DataNum: number) {
        const state = appState();
        const al = state.attrData.LayerData[Layernum];
        const ad = al.atrData.Data[DataNum];
        const Contour_High_M: number[] = [];
        const C_Line_Pat: Line_Property[] = [];
        const c_md = ad.SoloModeViewSettings.ContourMD as ContourModeInfo;

        let hn = 0;
        switch (c_md.Interval_Mode) {
            case enmContourIntervalMode.RegularInterval: {
                const c_mdr = c_md.Regular as ContourRegularModeInfo;
                hn = parseInt(((c_mdr.top - c_mdr.bottom) / c_mdr.Interval).toString()) + 1;
                let n = 0;
                let V = c_mdr.bottom;
                do {
                    Contour_High_M.push(V);
                    C_Line_Pat.push(this.cloneLineProperty(c_mdr.Line_Pat));
                    n++;
                    V = c_mdr.bottom + n * c_mdr.Interval;
                } while (V < c_mdr.top);

                let n2 = 0;
                V = c_mdr.SP_Bottom;
                while (V < Math.min(c_mdr.SP_Top, c_mdr.top)) {
                    V = c_mdr.SP_Bottom + n2 * c_mdr.SP_interval
                    for (let j = 0; j < n; j++) {
                        if (V === Contour_High_M[j]) {
                            C_Line_Pat[j] = this.cloneLineProperty(c_mdr.SP_Line_Pat);
                            break;
                        }
                    }
                    n2++;
                }

                if (c_mdr.EX_Value_Flag === true) {
                    for (let j = 0; j < n; j++) {
                        if (Contour_High_M[j] === c_mdr.EX_Value) {
                            C_Line_Pat[j] = this.cloneLineProperty(c_mdr.EX_Line_Pat);
                        }
                    }
                }
                break;
            }
            case enmContourIntervalMode.SeparateSettings: {
                hn = c_md.IrregularNum
                for (let i = 0; i < hn; i++) {
                    const irregular = c_md.Irregular[i] as ContourIrregularModeInfo;
                    Contour_High_M.push(irregular.Value);
                    C_Line_Pat.push(this.cloneLineProperty(irregular.Line_Pat));
                }
                break;
            }
            case enmContourIntervalMode.ClassPaint: {
                hn = ad.SoloModeViewSettings.Div_Num - 1
                for (let i = 0; i < hn; i++) {
                    Contour_High_M.push(Number(ad.SoloModeViewSettings.Class_Div[hn - 1 - i].Value));
                    C_Line_Pat.push(this.cloneLineProperty(c_md.Regular.Line_Pat));
                }
                break;
            }
        }
        return { hn: hn, Contour_High_M: Contour_High_M, C_Line_Pat: C_Line_Pat }
    }

    ////文字モード
    static PrintStringMode(g: CanvasRenderingContext2D, LayerNum: number, DataNum: number) {
        const state = appState();
        const al = state.attrData.LayerData[LayerNum];
        const ad = al.atrData.Data[DataNum];
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F === true) {
            g.save();
            this.ClippingRegion_ObjectBoundary_set(g, [LayerNum], false, true);
        }
        if((al.Shape === enmShape.PolygonShape)|| (al.Shape === enmShape.LineShape)) {
            this.Vector_Object_Boundary(g, LayerNum);
        }
        this.Vector_Dummy_Boundary(g, LayerNum, true, true);
        const Missing_DataArray = state.attrData.Get_Missing_Value_DataArray(LayerNum, DataNum);
        const InnerDT = ad.SoloModeViewSettings.MarkCommon.Inner_Data;
        let Category_Array_Inner: number[] = [];
        if(InnerDT.Flag === true) {
            Category_Array_Inner = state.attrData.Get_CategolyArray(LayerNum, InnerDT.Data);
        }
        const smd = ad.SoloModeViewSettings.StringMD as unknown as { Font: Font_Property; maxWidth: number; WordTurnF: boolean };
        const stringMode = smd as { Font: Font_Property; maxWidth: number; WordTurnF: boolean };
        // const H = state.attrData.Get_Length_On_Screen(smd.Font.Size);
        const Font = this.cloneFontProperty(stringMode.Font);
        const xw = state.attrData.Get_Length_On_Screen(stringMode.maxWidth);
        const turnF = stringMode.WordTurnF;
        for (let i = 0; i < al.atrObject.ObjectNum; i++) {
            if((state.attrData.Check_Condition(LayerNum, i) === true) && (
                (!Missing_DataArray[i]) || (state.attrData.TotalData.ViewStyle.Missing_Data.Print_Flag === true))) {
                state.attrData.TempData.ObjectPrintedCheckFlag[LayerNum][i] = true;
                const tx = state.attrData.Get_Data_Value(LayerNum, DataNum, i, state.attrData.TotalData.ViewStyle.Missing_Data.Label);
                const CP = al.atrObject.atrObjectData[i].Label;
                const LP = (state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo).Get_SxSy_With_3D(CP);
                const atx = String(tx);
                const d_an2 = clsDraw.TextCut_for_print(g, atx, Font, turnF, xw, state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo)
                let outTx = d_an2.Out_Text[0];
                for (let j = 1; j<d_an2.Out_Text.length; j++) {
                    outTx += "\n" + d_an2.Out_Text[j];
                }
                d_an2.Height *= d_an2.Out_Text.length;
                const rect = new rectangle(new point(LP.x - d_an2.RealWidth / 2, LP.y - d_an2.Height / 2), new size(d_an2.RealWidth, d_an2.Height));
                if(InnerDT.Flag === true) {
                    Font.Color = state.attrData.Get_InnerTile(InnerDT, LayerNum, Category_Array_Inner[i]).Color;
                }
                state.attrData.Draw_Print(g, outTx, new point(rect.left, rect.top), Font, enmHorizontalAlignment.Left, enmVerticalAlignment.Top);
            }
        }
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F === true) {
            g.restore();
        }
    }

    /**棒の高さモード */
    static PrintMarkBarMode(g: CanvasRenderingContext2D, LayerNum: number, DataNum: number) {
        const state = appState();
        const al = state.attrData.LayerData[LayerNum];
        const ad = al.atrData.Data[DataNum];
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F === true) {
            g.save();
            this.ClippingRegion_ObjectBoundary_set(g, [LayerNum], false, true);
        }
        if(al.Shape === enmShape.PolygonShape) {
            this.Vector_Object_Boundary(g, LayerNum);
        }
        this.Vector_Dummy_Boundary(g, LayerNum, true, true);
        this.Vector_Connect_CenterP_To_SymbolPoint(g, LayerNum);
        const MkCommon = ad.SoloModeViewSettings.MarkCommon;
        const InnerDT = MkCommon.Inner_Data;
        let Category_Array_Inner: number[] = [];
        if(InnerDT.Flag === true) {
            Category_Array_Inner = state.attrData.Get_CategolyArray(LayerNum, InnerDT.Data);
        }
        const mbmd = ad.SoloModeViewSettings.MarkBarMD;
        const Objn = state.attrData.LayerData[LayerNum].atrObject.ObjectNum;

        //表示順序と表示の可否
        const D_Order: number[] = [];
        const ShowF: boolean[] = [];
        const MV_Array: number[] = [];
        const Missing_DataArray: boolean[] = [];
        const ObjP: point[] = [];
        this.getDrawOrder_and_ShowF_MarkMode(LayerNum, DataNum, enmSoloMode_Number.MarkBarMode, D_Order, ShowF, ObjP, Missing_DataArray, MV_Array);

        const w = state.attrData.Get_Length_On_Screen(mbmd.Width);
        for (let i = 0; i < Objn; i++) {
            const num = D_Order[i];
            const MV = MV_Array[num];
            if(ShowF[num] === true){
                const OP = ObjP[num];
                state.attrData.TempData.ObjectPrintedCheckFlag[LayerNum][num] = true;
                if(Missing_DataArray[num] === true) {
                    const MK = state.attrData.TotalData.ViewStyle.Missing_Data.MarkBar;
                    const r = state.attrData.Radius(MK.WordFont.Size, 1, 1);
                    state.attrData.Draw_Mark(g, OP, r, MK);
                } else {
                    let maxv;
                    if(mbmd.MaxValueMode === enmMarkSizeValueMode.inDataItem) {
                        maxv = ad.Statistics.Max;
                    } else {
                        maxv = mbmd.MaxValue;
                    }
                    const h = state.attrData.Get_Length_On_Screen(mbmd.MaxHeight) * MV / maxv;
                    const retV = this.MarkBarRectPrint(OP, w, h, mbmd.ThreeD);
                    let Tile;
                    if (MkCommon.Inner_Data.Flag === true) {
                        Tile = state.attrData.Get_InnerTile(MkCommon.Inner_Data, LayerNum, Category_Array_Inner[num]).Clone();
                    } else {
                        Tile = mbmd.InnerTile.Clone();
                    }
                    switch (mbmd.BarShape){
                        case enmMarkBarShape.triangle:{
                            const tri = [];
                            tri.push(new point(OP.x - w / 2, OP.y));
                            tri.push(new point(OP.x + w / 2, OP.y));
                            tri.push(new point(OP.x, OP.y - h));
                            tri[3] = tri[0].Clone();
                            state.attrData.Draw_Poly_Inner(g, tri, [4], Tile);
                            state.attrData.Draw_Line(g, mbmd.FrameLinePat, tri);
                            break;
                        }
                        case enmMarkBarShape.bar:{
                            if (mbmd.ThreeD === true) {
                                const Ptile = Tile.Clone();
                                Ptile.Color = Generic.GetColorArrange(Tile.Color, 100);
                                state.attrData.Draw_Poly_Inner(g, retV.UpperPoly, [5], Ptile);
                                state.attrData.Draw_Line(g, mbmd.FrameLinePat, retV.UpperPoly)
        
                                const Ptile2 = Tile.Clone();
                                Ptile2.Color = Generic.GetColorArrange(Tile.Color, -100);
                                state.attrData.Draw_Poly_Inner(g, retV.RightPoly, [5], Ptile2)
                                state.attrData.Draw_Line(g, mbmd.FrameLinePat, retV.RightPoly)
                            }
                            state.attrData.Draw_Tile_Box(g, retV.CenterRect, mbmd.FrameLinePat, Tile, 0);
                            if (mbmd.ScaleLineVisible === true) {
                                for (let v = mbmd.ScaleLineInterval; v < MV; v += mbmd.ScaleLineInterval) {
                                    const ypos = retV.CenterRect.bottom - state.attrData.Get_Length_On_Screen(mbmd.MaxHeight) * v / maxv;
                                    state.attrData.Draw_Line(g, mbmd.scaleLinePat, [new point(retV.CenterRect.left, ypos), new point(retV.CenterRect.right, ypos)]);
                                }
                                state.attrData.Draw_Tile_Box(g, retV.CenterRect, mbmd.FrameLinePat, clsBase.BlancTile(), 0);
                            }
                                    break;
                        }
                    }
                    const OVP = new point(retV.CenterRect.left + retV.CenterRect.width() / 2, retV.CenterRect.bottom);
                    this.ObjectValue_and_Name_Print(g, OVP, enmVerticalAlignment.Top, LayerNum, DataNum, num);
                }
            }
        }
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F === true) {
            g.restore();
        }
    }

    static MarkBarRectPrint(Pos: point, w: number, h: number, threeD: boolean) {
        // const state = appState();
        const CenterRect= new rectangle(new point(Pos.x - w / 2, Pos.y - h), new size(w, h));
        const UpperPoly=[];
        const RightPoly=[];
        const TheeDS = parseInt((w / 3).toString());
        const rectAll = CenterRect.Clone();
        if(threeD === true) {
            rectAll.top -= TheeDS;
            rectAll.right += TheeDS;
        }
        if(threeD === true) {
            UpperPoly.push(new point(CenterRect.left, CenterRect.top));
            UpperPoly.push(new point(CenterRect.right, CenterRect.top));
            UpperPoly.push(new point(CenterRect.right + TheeDS, CenterRect.top - TheeDS));
            UpperPoly.push(new point(CenterRect.left + TheeDS, CenterRect.top - TheeDS));
            UpperPoly.push(UpperPoly[0].Clone());

            RightPoly.push(UpperPoly[1].Clone());
            RightPoly.push(UpperPoly[2].Clone());
            RightPoly.push(new point(RightPoly[1].x, UpperPoly[2].y+CenterRect.height()));
            RightPoly.push(new point(RightPoly[0].x, CenterRect.bottom));
            RightPoly.push(UpperPoly[0].Clone());
        }
        return {rectAll:rectAll,CenterRect:CenterRect,UpperPoly:UpperPoly,RightPoly:RightPoly} ;
    }

    /**記号の数モード */
    static PrintMarkBlockMode(g: CanvasRenderingContext2D, LayerNum: number, DataNum: number) {
        const state = appState();
        if(state.attrData.TempData.DotMap_Temp.DotMapTempResetF === true) {
            state.attrData.TempData.DotMap_Temp.DotMapPoint = {};// New Dictionary(Of Integer, PointF())
        }
        const al = state.attrData.LayerData[LayerNum];
        const ad = al.atrData.Data[DataNum];
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F === true) {
            g.save();
            this.ClippingRegion_ObjectBoundary_set(g, [LayerNum], false, true);
        }
        if (al.Shape === enmShape.PolygonShape) {
            this.Vector_Object_Boundary(g, LayerNum);
        }
        this.Vector_Dummy_Boundary(g, LayerNum, true, true);
        this.Vector_Connect_CenterP_To_SymbolPoint(g, LayerNum);
        const MV_Array = state.attrData.Get_Data_Cell_Array_With_MissingValue(LayerNum, DataNum);
        const Missing_DataArray = state.attrData.Get_Missing_Value_DataArray(LayerNum, DataNum);
        const MkCommon = ad.SoloModeViewSettings.MarkCommon;
        const InnerDT = MkCommon.Inner_Data;
        let Category_Array_Inner: number[] = [];
        if(InnerDT.Flag === true) {
            Category_Array_Inner = state.attrData.Get_CategolyArray(LayerNum, InnerDT.Data);
        }
        const mbmd = ad.SoloModeViewSettings.MarkBlockMD;
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
        const r = state.attrData.Radius(mbmd.Mark.WordFont.Size, 1, 1);
        for (let i = 0; i < al.atrObject.ObjectNum; i++) {
            if((state.attrData.Check_Condition(LayerNum, i) === true) && (
                (Missing_DataArray[i] === false) || (state.attrData.TotalData.ViewStyle.Missing_Data.Print_Flag === true))) {
                const MV = Number(MV_Array[i]);
                const Block_n = parseInt((Math.abs(MV) / mbmd.Value).toString());
                const Hasu = Math.abs(MV) - (mbmd.Value * Block_n);
                const Hasu_R = state.attrData.Radius(mbmd.Mark.WordFont.Size, Hasu, mbmd.Value);
                const CP = al.atrObject.atrObjectData[i].Symbol;
                const OP = (state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo).Get_SxSy_With_3D(CP);
                state.attrData.TempData.ObjectPrintedCheckFlag[LayerNum][i] = true;
                if(Missing_DataArray[i] === true) {
                    Vector_Block_Draw_Block(g, LayerNum, i, OP, r, state.attrData.TotalData.ViewStyle.Missing_Data.BlockMark, 1, enmMarkBlockArrange.Block, false, 0, 0, 1);
                } else {
                    const MK = mbmd.Mark.Clone();
                    if(MkCommon.Inner_Data.Flag === true) {
                        MK.Tile = state.attrData.Get_InnerTile(MkCommon.Inner_Data, LayerNum, Category_Array_Inner[i]);
                        MK.WordFont.Color = MK.Tile.Line.Color;
                    } else {
                        if(MV < 0) {
                            MK.Tile = MkCommon.MinusTile;
                        }
                    }

                    const valPos = Vector_Block_Draw_Block(g, LayerNum, i, OP, r, MK, Block_n, mbmd.ArrangeB, mbmd.HasuVisible, Hasu_R, Hasu, BlockInterval ?? 0);
                    if (valPos) this.ObjectValue_and_Name_Print(g,  valPos, enmVerticalAlignment.Top, LayerNum, DataNum, i);
                }
            }
        }
        state.attrData.TempData.DotMap_Temp.DotMapTempResetF = false;
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F === true) {
            g.restore();
        }

        function Vector_Block_Draw_Block(g: CanvasRenderingContext2D, Layernum: number, ObjNum: number, OP: point, r: number, MK: Mark_Property, Block_n: number, ArrangeB: number, HasuVisible: boolean, Hasu_R: number, Hasu: number, BlockInterval: number) {
            
            let ap = new point();
            const RetP = OP.Clone();
            const r2 = spatial.Get_TurnedBox(new size(r, r), MK.WordFont?.Kakudo ?? 0).width;
            switch (ArrangeB) {
                case enmMarkBlockArrange.Block: {
                    const Q = Math.sqrt(Block_n);
                    let qx;
                    let qy;
                    if(Q !== parseInt(Q.toString())) {
                        qx = parseInt(Q.toString()) + 1;
                        if(Block_n <= qx * qx - qx) {
                            qy = qx - 1;
                        } else {
                            qy = qx;
                        }
                    } else {
                        qx = parseInt(Q.toString());
                        qy = parseInt(Q.toString());
                    }
                    if(qx === 0) {
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
                    if(Block_n > 0 && j2 !== undefined && k2 !== undefined) {
                        ap.x = OP.x + r2 * 2 * BlockInterval * (j2 + 0.5) + Hasu_R * BlockInterval;
                        ap.y = OP.y + r2 * 2 * BlockInterval * (k2 - 0.5) + Hasu_R * BlockInterval;
                        Vector_Block_Arrange_OverLay_Block(ap, r, ArrangeB, Q);
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
                    Vector_Block_Draw_Hasu(g, ap, Hasu_R, MK, Hasu, HasuVisible);
                    RetP.y += r2;
                    break;
                }
                case enmMarkBlockArrange.Random: {
                    const dotMapPoint = state.attrData.TempData.DotMap_Temp.DotMapPoint as Record<number, point[]>;
                    if(r === 0 && MK.Line?.Color) {
                        const brush = MK.Line.Color.toRGBA();
                        g.fillStyle = brush;
                    }
                    if((state.attrData.TempData.DotMap_Temp.DotMapTempResetF === true) || (dotMapPoint[ObjNum] === undefined)) {
                        const onP: point[] = [];
                        for (let j = 0; j < Block_n; j++) {
                            const area = state.attrData.Get_Kencode_Object_Circumscribed_Rectangle(Layernum, ObjNum);
                            let inf = false
                            const p = new point();
                            do {
                                p.x = Math.random() * area.width() + area.left;
                                p.y = Math.random() * area.height() + area.top;
                                inf = state.attrData.Check_Point_in_Kencode_OneObject(Layernum, ObjNum, p);
                            } while (inf === false);
                            onP.push(p);
                            ap = (state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo).Get_SxSy_With_3D(p);
                            if(r !== 0) {
                                Vector_Block_Draw_Block2(g, ap, r, MK);
                            } else {
                                g.fillRect(ap.x, ap.y, 1, 1);
                            }
                        }
                        dotMapPoint[ObjNum] = onP;
                    } else {
                        const pOn = dotMapPoint[ObjNum] as point[];
                        for (let j = 0; j < Block_n; j++) {
                            ap = (state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo).Get_SxSy_With_3D(pOn[j])
                            if(r !== 0) {
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

            function Vector_Block_Draw_Block2(g: CanvasRenderingContext2D, ap: point, r: number, MK: Mark_Property) {
                if(state.attrData.Check_Screen_In(ap, r) === true) {
                    state.attrData.Draw_Mark(g, ap, r, MK);
                }
            }
            function Vector_Block_Draw_Hasu(g: CanvasRenderingContext2D, ap: point, Hasu_R: number, MK: Mark_Property, Hasu?: number, HasuVisible?: boolean) {
                if((Hasu === 0) || (HasuVisible === false)) {
                    return;
                }
                if(state.attrData.Check_Screen_In(ap, Hasu_R) === true) {
                    state.attrData.Draw_Mark(g, ap, Hasu_R, MK);
                }
            }
            function Vector_Block_Arrange_OverLay_Block(ap: point, r: number, ArrangeB: number, Q = 0) {
                const ot = state.attrData.TempData.OverLay_Temp;
                if((ot.OverLay_EMode_N >= 2) && (ot.OverLay_Printing_Flag === true)) {
                    switch (ArrangeB) {
                        case enmMarkBlockArrange.Block: {
                            let oh;
                            ap.x += ((ot.OverLay_EMode_Now % 2) * 2 - 1) * Q * r * 1.1;
                            switch (ot.OverLay_EMode_N) {
                                case 2:
                                    oh = 0;
                                    break;
                                default:
                                    oh = parseInt((ot.OverLay_EMode_Now / 2).toString());
                                    break;
                            }
                            ap.y += oh * r * Q * 1.1;
                            break;
                        }
                        case enmMarkBlockArrange.Vertical:
                            ap.x += ((ot.OverLay_EMode_Now - ot.OverLay_EMode_N + 1) - parseInt((ot.OverLay_EMode_N / 2).toString())) * r * 2.2;
                            break;
                        case enmMarkBlockArrange.Horizontal:
                            ap.y += ((ot.OverLay_EMode_Now - ot.OverLay_EMode_N + 1) - parseInt((ot.OverLay_EMode_N / 2).toString())) * r * 2.2;
                            break;
                    }
                }
            }
        }
    }

    //記号の大きさモード
    static PrintMarkSizeMode(g: CanvasRenderingContext2D,  LayerNum: number, DataNum: number) {
        const state = appState();
        const al = state.attrData.LayerData[LayerNum];
        const ad = al.atrData.Data[DataNum];
        const vs=state.attrData.TotalData.ViewStyle;
        const avvs=vs.ValueShow;
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F === true) {
            g.save();
            this.ClippingRegion_ObjectBoundary_set(g, [LayerNum], false, true);
        }
        if(al.Shape === enmShape.PolygonShape) {
            this.Vector_Object_Boundary(g,  LayerNum);
        }
        this.Vector_Dummy_Boundary(g,  LayerNum, true, true);
        const MkCommon = ad.SoloModeViewSettings.MarkCommon;
        const InnerDT = MkCommon.Inner_Data;
        let Category_Array_Inner: number[] = [];
        if(InnerDT.Flag === true) {
            Category_Array_Inner = state.attrData.Get_CategolyArray(LayerNum, InnerDT.Data);
        }
        const msmd = ad.SoloModeViewSettings.MarkSizeMD;

        //表示順序と表示の可否
        const D_Order: number[] = [];
        const ShowF: boolean[] = [];
        const MV_Array: number[] = [];
        const Missing_DataArray: boolean[] = [];
        const ObjP: point[] = [];
        this.getDrawOrder_and_ShowF_MarkMode(LayerNum, DataNum, enmSoloMode_Number.MarkSizeMode, D_Order, ShowF, ObjP, Missing_DataArray, MV_Array);

        for (let i = 0; i < al.atrObject.ObjectNum; i++) {
            const kpos = D_Order[i];
            const MV = MV_Array[kpos];
            const MK = msmd.Mark.Clone();
            if (ShowF[kpos] === true) {
                if (InnerDT.Flag === true) {
                    MK.Tile = state.attrData.Get_InnerTile(InnerDT, LayerNum, Category_Array_Inner[kpos]);
                    MK.WordFont.Color = MK.Tile.Color;
                } else {
                    if (MV < 0) {
                        MK.Tile = MkCommon.MinusTile;
                        MK.WordFont.Color = MkCommon.MinusTile.Color;
                    }
                }
                const r = this.PrintMarkSizeMode_Draw(g, LayerNum, DataNum, kpos, ObjP[kpos], MK, MV, Missing_DataArray[kpos]);
                state.attrData.TempData.ObjectPrintedCheckFlag[LayerNum][kpos] = true;
                if ((avvs.ObjNameVisible === true) || (avvs.ValueVisible === true)) {
                    const name = state.attrData.Get_KenObjName(LayerNum, kpos);
                    const V = state.attrData.Get_Data_Value(LayerNum, DataNum, kpos, "欠損値");
                    const OP = ObjP[kpos];
                    let xs = 0;
                    if (avvs.ObjNameVisible === true) {
                        g.font = avvs.ObjNameFont.toContextFont(vs.ScrData).font;
                        xs = g.measureText(name).width;
                    }
                    if (avvs.ValueVisible === true) {
                        g.font = avvs.ValueFont.toContextFont(vs.ScrData).font;
                        xs = Math.max(xs, g.measureText(String(V)).width);
                    }

                    if ((xs < r * 2) || (al.Shape === enmShape.LineShape)) {
                        this.ObjectValue_and_Name_Print(g, OP, enmVerticalAlignment.Center, LayerNum, DataNum, kpos);
                    } else {
                        const OVP = OP.Clone();
                        OVP.y += r;;
                        this.ObjectValue_and_Name_Print(g, OVP, enmVerticalAlignment.Top, LayerNum, DataNum, kpos);
                    }
                }
            }
    }
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F === true) {
            g.restore();
        }
    }

    
    static PrintMarkSizeMode_Draw(g: CanvasRenderingContext2D, Layernum: number, DataNum: number, kpos: number, pos: point, MK: Mark_Property, MV: number, MisF: boolean) {
        const state = appState();
        const al = state.attrData.LayerData[Layernum];
        const ad = al.atrData.Data[DataNum];
        const vs=state.attrData.TotalData.ViewStyle;

        const mmv = ad.SoloModeViewSettings.MarkSizeMD;
        const InnerDT = ad.SoloModeViewSettings.MarkCommon.Inner_Data;
        let maxv;
        if(mmv.MaxValueMode === enmMarkSizeValueMode.inDataItem) {
            maxv = Math.max(Math.abs(state.attrData.Get_DataMax(Layernum, DataNum)), Math.abs(state.attrData.Get_DataMin(Layernum, DataNum)));
        } else {
            maxv = mmv.MaxValue;
        }
        switch (al.Shape) {
            case  enmShape.PointShape:
            case enmShape.PolygonShape: {
                let r;
                if(MisF === true) {
                    MK = vs.Missing_Data.Mark;
                    r = state.attrData.Radius(MK.WordFont.Size, 1, 1);
                } else {

                    r = state.attrData.Radius(mmv.Mark.WordFont.Size, Math.abs(MV), maxv);
                }
                state.attrData.Draw_Mark(g, pos, r, MK);
                    return r;
                break;
            }
            case enmShape.LineShape:
                if(state.attrData.Check_screen_Kencode_In(Layernum, kpos) === true) {
                    state.attrData.TempData.ObjectPrintedCheckFlag[Layernum][kpos] = true;
                    const LineSize = Math.abs(MV) / maxv * mmv.LineShape.Width;
                    const ELine = state.attrData.Get_Enable_KenCode_MPLine(Layernum, kpos);
                    for (let j = 0; j < ELine.length; j++) {
                        const lineCode = Number((ELine[j] as { LineCode: number }).LineCode);
                        const mpl = al.MapFileData.MPLine[lineCode] as { NumOfPoint: number; PointSTC: point[] };
                        const np= mpl.NumOfPoint;
                        const pxy = (vs.ScrData as AttrScreenInfo).Get_SxSy_With_3D(np, mpl.PointSTC, false) as point[];

                        let LineShapeLine;
                        if(MisF === true) {
                            LineShapeLine = vs.Missing_Data.LineShape;
                        } else {
                            LineShapeLine = clsBase.Line();
                            if(InnerDT.Flag === true) {
                                LineShapeLine.Set_Same_ColorWidth_to_LinePat?.(MK.WordFont.Color, LineSize);
                            } else {
                                LineShapeLine.Set_Same_ColorWidth_to_LinePat?.(mmv.LineShape.Color, LineSize);
                            }
                            LineShapeLine.Edge_Connect_Pattern = mmv.Mark.Line.Edge_Connect_Pattern;
                        }
                        state.attrData.Draw_Line(g, LineShapeLine,  pxy);
                    }
                }
                break;
        }
    }

    /**線モード */
    static PrintClassODMode(g: CanvasRenderingContext2D, LayerNum: number, DataNum: number) {
        const state = appState();
        const Category_Array = state.attrData.Get_CategolyArray(LayerNum, DataNum);
        const DrawOrderByValue = this.ClassMode_Point_Shape_DrawOrder(LayerNum, DataNum);
        const al = state.attrData.LayerData[LayerNum];
        const ad = al.atrData.Data[DataNum];
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F === true) {
            g.save();
            this.Vector_Dummy_Boundary(g, LayerNum, true, false);
            this.ClippingRegion_ObjectBoundary_set(g, [LayerNum], false, true);
        }

        this.Vector_Object_Boundary(g, LayerNum);
        this.Vector_Dummy_Boundary(g, LayerNum, true, true);
        const OD_MD = ad.SoloModeViewSettings.ClassODMD;
        const scrData = state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo;

        const adobl=state.attrData.LayerData[OD_MD.o_Layer];
        let StartFP;
        if(OD_MD.Dummy_ObjectFlag === true) {
            StartFP=al.MapFileData.Get_Enable_CenterP(adobl.Dummy[OD_MD.O_object].code, adobl.Time);
        } else {
            StartFP = adobl.atrObject.atrObjectData[OD_MD.O_object].CenterPoint;
        }
        const StartP = scrData.Get_SxSy_With_3D(StartFP);

        for (let i = 0; i < al.atrObject.ObjectNum; i++) {
            let DrawOrder;
            switch (state.attrData.TotalData.ViewStyle.PointPaint_Order) {
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
            if((state.attrData.Check_Condition(LayerNum, DrawOrder) === true) && (Category_Array[DrawOrder] !== -1) && (DrawOrder !== OD_MD.O_object)) {
                const colpos = Category_Array[DrawOrder];
                state.attrData.TempData.ObjectPrintedCheckFlag[LayerNum][DrawOrder] = true;
                const DestFP = al.atrObject.atrObjectData[DrawOrder].CenterPoint;
                let DestP = scrData.Get_SxSy_With_3D(DestFP);
                const C_Rect = spatial.getCircumscribedRectangle([DestP, StartP], undefined);
                if((state.attrData.Check_Screen_In(C_Rect) === true) && (DestFP.Equals(StartFP) === false)) {
                    const ODLinePat = ad.SoloModeViewSettings.Class_Div[colpos].ODLinePat;
                    if(ODLinePat.BlankF === false) {
                        const retV = al.Get_OD_Bezier_RefPoint(DrawOrder, DataNum);
                        const SplineRefP=retV.RefPoint;
                        if(retV.ok === false) {
                            //曲線近似でない場合
                            if((OD_MD.Arrow.End_Arrow_F === true) && (OD_MD.Arrow.ArrowHeadType === enmArrowHeadType.Fill) && clsDrawLine.Check_Draw_Arrow_Line) {
                                const Cp = clsDrawLine.Check_Draw_Arrow_Line( DestFP, StartFP, DestFP, StartFP, ODLinePat, OD_MD.Arrow, scrData);
                                if(Cp !== undefined && Cp !== true && Cp !== false) {
                                    DestP = scrData.Get_SxSy_With_3D(Cp as point);
                                }
                            }
                            state.attrData.Draw_Line(g, ODLinePat, [StartP, DestP]);
                            if(OD_MD.Arrow.End_Arrow_F === true) {
                                state.attrData.Draw_Arrow(g, DestFP, StartFP, ODLinePat, OD_MD.Arrow);
                            }
                        } else {
                            //曲線近似の場合
                            const Refp = Generic.Get_OD_Spline_Point(SplineRefP, StartFP, DestFP);
                            
                            if((OD_MD.Arrow.End_Arrow_F === true) && (OD_MD.Arrow.ArrowHeadType === enmArrowHeadType.Fill)) {
                                //塗りつぶしの矢印付き
                                if (clsDrawLine.Check_Draw_Arrow_Line) {
                                    const canDrawArrow = clsDrawLine.Check_Draw_Arrow_Line(DestFP, Refp[1], Refp[1], Refp[0], ODLinePat, OD_MD.Arrow, scrData);
                                    if (canDrawArrow !== true) {
                                        Refp[0] = Refp[1].Clone();
                                    }
                                }
                            }
                            const ln = 4;
                            if (clsSpline.Spline_Get) {
                                const pxy = clsSpline.Spline_Get(0, ln, Refp, 0.05, scrData as unknown as Screen_info);
                                state.attrData.Draw_Line(g, ODLinePat, pxy);
                            }

                            if(OD_MD.Arrow.End_Arrow_F === true) {
                                state.attrData.Draw_Arrow(g, DestFP, Refp[1], ODLinePat, OD_MD.Arrow);
                            }
                        }
                    }
                }
            }
        }
        this.ObjectValue_And_Name_Print_byLayer(g,  LayerNum, DataNum);
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F === true) {
            g.restore();
        }
    }
    /**階級区分モードの線形状オブジェクトの線モード */
    static PrintClassLineShapeSENMode(g: CanvasRenderingContext2D, LayerNum: number, DataNum: number) {
        const state = appState();
        const al = state.attrData.LayerData[LayerNum];
        const ad = al.atrData.Data[DataNum];
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F === true) {
            g.save();
            this.Vector_Dummy_Boundary(g, LayerNum, true, false);
            this.ClippingRegion_ObjectBoundary_set(g, [LayerNum], false, true);
        }

        this.Vector_Dummy_Boundary(g, LayerNum, true, true);
        const Category_Array: number[] = [];
        const ShowF: boolean[] = [];
        const D_Order: number[] = [];
        this.getDrawOrder_and_ShowF_ClassMode(LayerNum, DataNum, Category_Array, D_Order, ShowF);

        for (let i = 0; i < al.atrObject.ObjectNum; i++) {
            const DrawOrder=D_Order[i];
            if(ShowF[DrawOrder]=== true) {
                state.attrData.TempData.ObjectPrintedCheckFlag[LayerNum][DrawOrder] = true;
                const colpos = Category_Array[DrawOrder];
                if(state.attrData.Check_screen_Kencode_In(LayerNum, DrawOrder) === true) {
                    const ELine = state.attrData.Get_Enable_KenCode_MPLine(LayerNum, DrawOrder);
                    let LineShapeLine;
                    if(colpos === -1) {
                        LineShapeLine = state.attrData.TotalData.ViewStyle.Missing_Data.LineShape;
                    } else {
                        LineShapeLine = ad.SoloModeViewSettings.Class_Div[colpos].ODLinePat;
                    }
                    for (let j = 0; j <ELine.length; j++) {
                        const pxy = this.Get_PointXY_by_LineCode(LayerNum, ELine[j].LineCode, false);
                        state.attrData.Draw_Line(g, LineShapeLine, pxy);
                    }
                }
            }
        }
        this.ObjectValue_And_Name_Print_byLayer(g,  LayerNum, DataNum);
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F === true) {
            g.restore();
        }
    }

    //階級記号モード
    static PrintClassMarkMode(g: CanvasRenderingContext2D, LayerNum: number, DataNum: number) {
        const state = appState();
        const al= state.attrData.LayerData[LayerNum];
        const ad = al.atrData.Data[DataNum];
        if(al.Shape === enmShape.PolygonShape) {
            this.Vector_Object_Boundary(g, LayerNum);
            this.Class_Category_Boundary(g, LayerNum, DataNum);
        }
        this.Vector_Dummy_Boundary(g, LayerNum, true, true)
        this.Vector_Connect_CenterP_To_SymbolPoint(g, LayerNum);

        const Category_Array: number[] = [];
        const ShowF: boolean[] = [];
        const D_Order: number[] = [];
        this.getDrawOrder_and_ShowF_ClassMode(LayerNum, DataNum, Category_Array, D_Order, ShowF);
        const InnerDT = ad.SoloModeViewSettings.ClassMarkMD as unknown as Parameters<typeof state.attrData.Get_InnerTile>[0];
        let Category_Array_Inner;
        if(InnerDT.Flag === true) {
            Category_Array_Inner = state.attrData.Get_CategolyArray(LayerNum, InnerDT.Data);
        }

        for (let i = 0; i < al.atrObject.ObjectNum; i++) {
            const DrawOrder = D_Order[i];
            if (ShowF[DrawOrder] === true) {
                state.attrData.TempData.ObjectPrintedCheckFlag[LayerNum][DrawOrder] =true;
                const colpos = Category_Array[DrawOrder];
                let MK;
                if(colpos === -1) {
                    MK = state.attrData.TotalData.ViewStyle.Missing_Data.ClassMark.Clone();
                } else {
                    MK = ad.SoloModeViewSettings.Class_Div[colpos].ClassMark.Clone();
                }
                if(InnerDT.Flag === true) {
                    MK.Tile = state.attrData.Get_InnerTile(InnerDT, LayerNum, Category_Array_Inner[DrawOrder]);
                    MK.WordFont.Color = MK.Tile.Color.Clone();
                }
                const CP = al.atrObject.atrObjectData[DrawOrder].Symbol;
                const vs = state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo;
                let OP = vs.Get_SxSy_With_3D(CP);
                const r = 5; // vs.Radius(MK.WordFont.Size, 1, 1); // Property not available1, 1); // Property not available
                // const ot = state.attrData.TempData.OverLay_Temp;
                OP = this.getOverlayMarkPosition(OP, r);
                // if(ot.OverLay_Printing_Flag === true) {
                //     if(ot.OverLay_EMode_N >= 2) {
                //         let a;
                //         if(ot.OverLay_EMode_N === 2) {
                //             a = 0;
                //         } else {
                //             a = -1;
                //         }
                //         OP.x += ((ot.OverLay_EMode_Now % 2) * 2 - 1) * r / 2;
                //         OP.y += (parseInt(ot.OverLay_EMode_Now / 2) + a) * r;
                //     }
                // }
                state.attrData.Draw_Mark(g, OP, r, MK);
                const OVP = OP.Clone();
                OVP.y += r;
                this.ObjectValue_and_Name_Print(g,  OVP, enmVerticalAlignment.Top, LayerNum, DataNum, DrawOrder);
            }
        }


    }

    //ペイントモード
    static PrintClassPaintMode(g: CanvasRenderingContext2D, LayerNum: number, DataNum: number) {
        const state = appState();
        const al = state.attrData.LayerData[LayerNum];
        const ad = al.atrData.Data[DataNum];
        const LayerShape = al.Shape;
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F === true) {
            g.save();
            if (LayerShape !== enmShape.PolygonShape) {
                this.Vector_Dummy_Boundary(g, LayerNum, true, false);
            }
            const f2=this.ClippingRegion_ObjectBoundary_set(g, [LayerNum], false, true);
            if (LayerShape !== enmShape.PolygonShape) {
                this.Vector_Object_Boundary(g, LayerNum);
                this.Vector_Dummy_Boundary(g, LayerNum, (f2===false), true);
            }
        } else {
            if (LayerShape !== enmShape.PolygonShape) {
                this.Vector_Object_Boundary(g, LayerNum);
                this.Vector_Dummy_Boundary(g, LayerNum, true, true);
            }
        }
        const Category_Array: number[] = [];
        const ShowF: boolean[] = [];
        const D_Order: number[] = [];
        this.getDrawOrder_and_ShowF_ClassMode(LayerNum, DataNum, Category_Array, D_Order, ShowF);


        let pointR;
        let PointLayerMark;
        if(LayerShape === enmShape.PointShape) {
            this.Vector_Connect_CenterP_To_SymbolPoint(g, LayerNum);
            PointLayerMark = al.LayerModeViewSettings.PointLineShape.PointMark.Clone();
            pointR = 5; // state.attrData.TotalData.ViewStyle.ScrData.Radius(PointLayerMark.WordFont.Size, 1, 1); // Property not available
        }
        for (let i = 0; i < al.atrObject.ObjectNum; i++) {
            const DrawOrder = D_Order[i];
            if (ShowF[DrawOrder] === true) {
                const colpos = Category_Array[DrawOrder];
                let col = new colorRGBA();
                if (colpos !== -1) {
                    col = ad.SoloModeViewSettings.Class_Div[colpos].PaintColor;
                }
                state.attrData.TempData.ObjectPrintedCheckFlag[LayerNum][DrawOrder] = true;
                const CP = al.atrObject.atrObjectData[DrawOrder].Symbol;
                const OP = (state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo).Get_SxSy_With_3D(CP);
                switch (LayerShape) {
                    case enmShape.PointShape: {
                        PointLayerMark = al.LayerModeViewSettings.PointLineShape.PointMark.Clone();
                        if (colpos === -1) {
                            PointLayerMark.Tile = state.attrData.TotalData.ViewStyle.Missing_Data.PaintTile.Clone();
                        } else {
                            PointLayerMark.Tile.BlankF = false;
                            PointLayerMark.Tile.Color = col;
                            PointLayerMark.WordFont.Color = col;
                        }
                        state.attrData.Draw_Mark(g, OP, pointR, PointLayerMark);
                        const OVP = OP.Clone();
                        OVP.y += pointR;
                        this.ObjectValue_and_Name_Print(g, OVP, enmVerticalAlignment.Top, LayerNum, DataNum, DrawOrder);
                        break;
                    }
                    case enmShape.LineShape: {
                        const penw = al.LayerModeViewSettings.PointLineShape.LineWidth;
                        let LineShapeLine;
                        if (colpos === -1) {
                            LineShapeLine = state.attrData.TotalData.ViewStyle.Missing_Data.LineShape.Clone();
                        } else {
                            LineShapeLine = clsBase.Line();
                            LineShapeLine.Color = col;
                            LineShapeLine.Width = penw;
                        }
                        LineShapeLine.Edge_Connect_Pattern = al.LayerModeViewSettings.PointLineShape.LineEdge;

                        if (al.Type === enmLayerType.Mesh) {
                            const meshPoint: point[] = al.atrObject.atrObjectData[DrawOrder].MeshPoint;
                            const pxy = (state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo).Get_SxSy_With_3D(meshPoint.length, meshPoint, false);
                            state.attrData.Draw_Line(g, LineShapeLine, pxy);
                        } else {
                            const ELine = state.attrData.Get_Enable_KenCode_MPLine(LayerNum, DrawOrder);
                            for (let j = 0; j < ELine.length; j++) {
                                const pxy = this.Get_PointXY_by_LineCode(LayerNum, ELine[j].LineCode, false);
                                state.attrData.Draw_Line(g, LineShapeLine, pxy);
                            }
                        }
                        break;
                    }
                    case enmShape.PolygonShape: {
                        if (colpos === -1) {
                            const mistile=state.attrData.TotalData.ViewStyle.Missing_Data.PaintTile;
                            if(mistile.BlankF===false){
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
        if(LayerShape === enmShape.PolygonShape) {
           this.Vector_Object_Boundary(g,  LayerNum);
            this.Class_Category_Boundary(g, LayerNum, DataNum);
            for (let i = 0; i < al.atrObject.ObjectNum; i++) {
                const DrawOrder = D_Order[i];
                if (ShowF[DrawOrder] === true) {
                    const CP = al.atrObject.atrObjectData[DrawOrder].Symbol;
                    const OP = (state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo).Get_SxSy_With_3D(CP);
                        this.ObjectValue_and_Name_Print(g, OP, enmVerticalAlignment.Center, LayerNum, DataNum, DrawOrder);
                }
            }
        }
        if (al.LayerModeViewSettings.PolygonDummy_ClipSet_F === true) {
            g.restore();
            this.Vector_Dummy_Boundary(g,  LayerNum, true, false);
        }else{
            this.Vector_Dummy_Boundary(g,  LayerNum, true, true);
        }
    }

    /**階級区分ごとの境界線 */
    static Class_Category_Boundary(g: CanvasRenderingContext2D, Layernum: number, DataNum: number){
        const state = appState();
        const al = state.attrData.LayerData[Layernum];
        const ad = al.atrData.Data[DataNum];
        const av = state.attrData.TotalData.ViewStyle;
        if ((av.MapLegend.ClassMD.ClassBoundaryLine.Visible === false) || (al.Type === enmLayerType.Mesh)) {
            return;
        }

        const Alin = al.MapFileData.Map.ALIN;
        const objN = al.atrObject.ObjectNum;
        const StacLine = new Array(Alin).fill(0);
        let sti = 0;
        if ((av.Missing_Data.Print_Flag === true) && (ad.MissingValueNum !== 0)) {
            sti = -1;
        }

        const Category_Array = state.attrData.Get_CategolyArray(Layernum, DataNum);
        for (let i = sti; i < ad.SoloModeViewSettings.Div_Num; i++) {
            const MultiObj = [];
            for (let j = 0; j < objN; j++) {
                if (Category_Array[j] === i) {
                    if ((state.attrData.Check_Condition(Layernum, j) === true) && (
                        (Category_Array[j] !== -1) || (av.Missing_Data.Print_Flag === true))) {
                        if (state.attrData.Check_screen_Kencode_In(Layernum, j) === true) {
                            MultiObj.push(j);
                        }
                    }
                }
            }
            if (MultiObj.length > 0) {
                const ELine = this.Gey_Multi_Object_OuterLineCode(Layernum, MultiObj, false);
                for (let j = 0; j < ELine.length; j++) {
                    StacLine[ELine[j].LineCode]++;
                }
            }
        }

        for (let i = 0; i < Alin; i++) {
            if (StacLine[i] === 2) {
                const pxy = this.Get_PointXY_by_LineCode(Layernum, i,false);
                state.attrData.Draw_Line(g, av.MapLegend.ClassMD.ClassBoundaryLine, pxy);
            }
        }
    }

    static Vector_Object_Boundary(g: CanvasRenderingContext2D,  Layernum: number) {
        const state = appState();
        const ad = state.attrData.LayerData[Layernum];
        if((ad.Shape === enmShape.LineShape)||(ad.Shape === enmShape.PointShape)|| (ad.Type === enmLayerType.Trip)) {
            // 線形、点形、またはTripタイプの場合は境界線を描画しない
        } else {
            // if((ad.Type === enmLayerType.Mesh) && (false)) { // state.attrData.TotalData.ViewStyle.MeshLine.BlankF === true // Property not available
            //     //メッシュで透明の場合は描画しない
            // } else {
                for (let i = 0; i < ad.atrObject.ObjectNum; i++) {
                    let vf = false;
                    if(state.attrData.TotalData.ViewStyle.InVisibleObjectBoundaryF === true) {
                        vf = true;
                    } else {
                        vf = state.attrData.Check_Condition(Layernum, i);
                    }
                    if(vf === true) {

                        this.Vector_Boundary_Draw(g,  Layernum, i);
                    }
                }
            // }
        }
    }

    static Vector_Boundary_Draw(g: CanvasRenderingContext2D,  Layernum: number, Obj_Num_code: number, /* Dummy_F: boolean */) {
        const state = appState();
        type DrawEnableLine = { LineCode: number; Kind: number };
        let ELine: DrawEnableLine[] = []
        const ad = state.attrData.LayerData[Layernum];
        let pxy: point[] = [];
        // if(false) { // Dummy_F === true
        //     if(!(false)) { // state.attrData.Check_Screen_Objcode_In(Layernum, Obj_Num_code) === false
        //         return;
        //     } else {
        //         ELine = []; // ad.MapFileData.Get_EnableMPLine( Obj_Num_code, ad.Time); // Property not available
        //     }
        // } else {
        if(state.attrData.Check_screen_Kencode_In(Layernum, Obj_Num_code) === false) {
            return;
        }
        if(ad.Type === enmLayerType.Mesh) {
            const meshPoint: point[] = ad.atrObject.atrObjectData[Obj_Num_code].MeshPoint;
            pxy = (state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo).Get_SxSy_With_3D(meshPoint.length, meshPoint, false);
            pxy.push(this.clonePointValue(pxy[0]));
            state.attrData.Draw_Line(g, state.attrData.TotalData.ViewStyle.MeshLine, pxy);
            return;
        } else {
            ELine = state.attrData.Get_Enable_KenCode_MPLine(Layernum, Obj_Num_code) as unknown as DrawEnableLine[];
        }
        // }
        // const MPFileNapa = ad.MapFileName;
        const layerForLine = ad as ILayerDataInfo & { ObjectGroupRelatedLine: number[] };
        for (let j = 0; j < ELine.length; j++) {
            const lc = ELine[j].LineCode;
            const lcc = ELine[j].Kind;
            const objectGroupRelatedLine = layerForLine.ObjectGroupRelatedLine;
            let PatNum = Number(objectGroupRelatedLine[lc] ?? 0);
            if(Number.isNaN(PatNum)) {
                PatNum = 0;
            }
            const lineKind = ad.MapFileData.LineKind[lcc];
            if (!lineKind || lineKind.NumofObjectGroup === 0) {
                continue;
            }
            if (PatNum >= lineKind.NumofObjectGroup) {
                PatNum = 0;
            }
            const Lpat = lineKind.ObjGroup[PatNum].Pattern;
            if ((Lpat.BlankF === false) && (state.attrData.getMpLineDrawn(ad.MapFileName, lc) !== true)) {
                const pxy = this.Get_PointXY_by_LineCode(Layernum, lc, false);
                if (pxy !== undefined) {
                    state.attrData.Draw_Line(g, Lpat, pxy);
                    state.attrData.setMpLineDrawn(ad.MapFileName, lc, true);
                    state.attrData.setLineKindUseChecked(ad.MapFileName, lcc, PatNum, true);
                }
            }
        }
    }


    static PaintOnePolygonObject(g: CanvasRenderingContext2D, Layernum: number, ObjNum: number, ocol: colorRGBA) {

        const Polydata = this.Get_OnePolygonObject_Boundary( Layernum, ObjNum, false);
        if(Polydata?.Pon && Polydata.Pon > 0) {
            clsDraw.DrawPolyPolygon(g, Polydata, ocol.toRGBA());
            return true;
        } else {
            return false;
        }
    }

    /**代表点と記号表示位置を線で結ぶ */
    static Vector_Connect_CenterP_To_SymbolPoint(g: CanvasRenderingContext2D, Layernum: number) {
        const state = appState();
        const av = state.attrData.TotalData.ViewStyle;
        if (av.SymbolLine.Visible === false) {
            return;
        }
        if ((state.attrData.TempData.OverLay_Temp.OverLay_Printing_Flag === true) && (state.attrData.TempData.OverLay_Temp.OverLay_EMode_N >= 2)) {
            return;
        }
        const al = state.attrData.LayerData[Layernum];
        for (let i = 0; i < al.atrObject.ObjectNum; i++) {
            const cp = al.atrObject.atrObjectData[i].CenterPoint;
            const sp = al.atrObject.atrObjectData[i].Symbol;
            if (cp.Equals(sp) === false) {
                const cp2 = (av.ScrData as AttrScreenInfo).Get_SxSy_With_3D(cp);
                const sp2 = (av.ScrData as AttrScreenInfo).Get_SxSy_With_3D(sp);
                state.attrData.Draw_Line(g, av.SymbolLine.Line, [cp2, sp2]);
            }
        }
    }


    /**階級区分モードで点・線オブジェクトの場合で、オブジェクトの描画順で使用するソートクラスを作成する */
    static ClassMode_Point_Shape_DrawOrder( LayerNum: number, DataNum: number) {
        const state = appState();
        let en_sort = [];
        const s=new SortingSearch();
        if(state.attrData.TotalData.ViewStyle.PointPaint_Order !== enmPointOnjectDrawOrder.ObjectOrder) {
            en_sort = state.attrData.Get_Data_Cell_Array_With_MissingValue(LayerNum, DataNum);
            s.AddRange(en_sort);
        }
        return s;
    }

    static Get_OnePolygonObject_Boundary( Layernum: number, O_ObjNum_Code: number, Dummy_F: boolean) {
        const state = appState();
        const ad = state.attrData.LayerData[Layernum];
        let Polydata = new PolydataInfo();
        let badata = new boundArrangeData();        
        if(Dummy_F === false) {
            if(state.attrData.LayerData[Layernum].Type === enmLayerType.Mesh) {
                const meshPoint: point[] = ad.atrObject.atrObjectData[O_ObjNum_Code].MeshPoint;
                const pxy = (state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo).Get_SxSy_With_3D(meshPoint.length, meshPoint, false) as point[];
                const nPolyP: number[] = [];
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
                const badataRaw = state.attrData.Boundary_Kencode_Arrange(Layernum, O_ObjNum_Code) as boundArrangeData | boundArrangeData[] | undefined;
                const badataArray = Array.isArray(badataRaw) ? badataRaw : (badataRaw ? [badataRaw] : []);
                if (badataArray.length > 0) {
                    badata = badataArray[0] as boundArrangeData;
                }
            }
        } else {
            const mapFileData = ad.MapFileData as unknown as { Boundary_Arrange: (objCode: number, time: unknown) => boundArrangeData };
            badata = mapFileData.Boundary_Arrange(O_ObjNum_Code, ad.Time);
        }
        if(!badata.Pon || badata.Pon <= 0) {
            Polydata.Pon = 0;
        } else {
            Polydata = this.Get_Boundary_XY( Layernum, badata);
        }
        return Polydata;
    }

    //指定されたラインをポリゴン化したXY座標を返す
    static Get_Boundary_XY(Layernum: number, badata: boundArrangeData) {
        // const state = appState();
        const poly = new PolydataInfo();

        let Pon = badata.Pon ?? 0;
        const Arrange_LineCode: number[][] = badata.Arrange_LineCode;
        const Fringe = badata.Fringe;

        const nPolyP = [];
        const pxy = [];
        for (let i = 0; i < Pon; i++) {
            let pxytemp = [];
            let np2 = 0;
            let f = true;
            for (let j = 0; j < Arrange_LineCode[i][1]; j++) {
                let revf;
                if (Fringe[Arrange_LineCode[i][0] + j].Direction === 1) {
                    revf = false;
                } else {
                    revf = true;
                }
                const L = Fringe[Arrange_LineCode[i][0] + j].code ?? 0;
                pxytemp = this.Get_PointXY_by_LineCode(Layernum, L, revf);
                if ((pxytemp === undefined) && (Arrange_LineCode[i][1] === 1)) {
                    Pon--;
                    f = false;
                } else {
                    //座標配列をコピーする
                    const ntp = pxytemp.length;
                    for (let k = 0; k < ntp; k++) {
                        pxy.push(pxytemp[k].Clone());
                    }
                    np2 += ntp;
                }
            }

            if (f === true) {
                nPolyP.push(np2);
            }
        }
        poly.Pon = Pon;
        poly.nPolyP = nPolyP;
        poly.pxy = pxy;
        return poly;
    }

    //指定したラインコードの座標を変換して取得
    static Get_PointXY_by_LineCode(Layernum: number, LCode: number, ReverseGetF: boolean) {
        const state = appState();
        const ad = state.attrData.LayerData[Layernum];
        const av = state.attrData.TotalData.ViewStyle;
        const at=state.attrData.TempData;
        const mpfilename = ad.MapFileName;
        if((av.SouByou.Auto===true) || (av.SouByou.LoopAreaF === true)&&(av.SouByou.LoopSize !== 0)) {
           const men = 0; // at.SoubyouLoopLineArea[Layernum][LCode]; // Property not available
           if(men >0) {
               let Check_S;
               if(av.SouByou.Auto===true){
                Check_S = at.SoubyouLoopAreaCriteria;
               }else{
                Check_S = av.SouByou.LoopSize;
               }
               if(men < Check_S) {
                   return undefined;
               }
           }
        }

        let pxy = state.attrData.Get_MPSubLineXY(mpfilename, LCode, ReverseGetF);
        if (pxy === undefined) {
            //まだ計算していないライン
            let np = ad.MapFileData.MPLine[LCode].NumOfPoint;
            pxy = [];
            const spxy = Generic.ArrayClone(ad.MapFileData.MPLine[LCode].PointSTC);
            if ((av.SouByou.Auto === true) || (av.SouByou.ThinningPrint_F === true) && (av.SouByou.PointInterval !== 0)) {
                // if (false) { // at.SoubyouLayerEnable[Layernum] === true // Property not available
                //     if (av.SouByou.Auto === true) {
                //         spxy = spxy; // ad.MapFileData.Smoothing_Line(spxy, at.SoubyouLinePointIntervalCriteria) // Method not available
                //     } else if (av.SouByou.ThinningPrint_F === true) {
                //         spxy = spxy; // ad.MapFileData.Smoothing_Line(spxy, av.SouByou.PointInterval); // Method not available
                //     }
                // }
                np = spxy.length;
            }

            if (state.attrData.TotalData.ViewStyle.SouByou.Spline_F === true) {
                if (ReverseGetF === true) {
                    const spxy2 = [];
                    for (let i = 0; i < np; i++) {
                        spxy2.push(spxy[np - 1 - i].Clone());
                    }
                    if (clsSpline.Spline_Get) pxy = clsSpline.Spline_Get(0, np, spxy2, 0.3, av.ScrData);
                } else {
                    if (clsSpline.Spline_Get) pxy = clsSpline.Spline_Get(0, np, spxy as point[], 0.3, av.ScrData);
                }
            } else {
                const spxyPoints: point[] = spxy as point[];
                pxy = (av.ScrData as AttrScreenInfo).Get_SxSy_With_3D(np, spxyPoints, ReverseGetF);
            }
            state.attrData.Set_MPSubLineXY(mpfilename, LCode, pxy, ReverseGetF);
        }
        return pxy;
    }

    /** イヤのオブジェクトの値を記号表示位置の中央に表示*/
    static ObjectValue_And_Name_Print_byLayer(g: CanvasRenderingContext2D, Layernum: number, DataNum: number) {
        const state = appState();
        if ((state.attrData.TotalData.ViewStyle.ValueShow.ValueVisible === true) || (state.attrData.TotalData.ViewStyle.ValueShow.ObjNameVisible === true)) {
            for (let i = 0; i < state.attrData.LayerData[Layernum].atrObject.ObjectNum; i++) {
                if (state.attrData.Check_Condition(Layernum, i) === true) {
                    const CP = state.attrData.LayerData[Layernum].atrObject.atrObjectData[i].Symbol;
                    const OP = (state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo).Get_SxSy_With_3D(CP);
                    this.ObjectValue_and_Name_Print(g, OP, enmVerticalAlignment.Center, Layernum, DataNum, i);
                }
            }
        }
    }

    /**データ値／オブジェクト名表示 */
    static ObjectValue_and_Name_Print(g: CanvasRenderingContext2D, Pos: point, VerticalAlignment: enmVerticalAlignment, Layernum: number, DataNum: number, ObjectNumber: number) {
        const state = appState();
        const avv = state.attrData.TotalData.ViewStyle.ValueShow;
        switch (VerticalAlignment) {
            case enmVerticalAlignment.Top: {
                const pos2 = Pos.Clone();
                if (avv.ObjNameVisible === true) {
                    const name = state.attrData.Get_KenObjName(Layernum, ObjectNumber);
                    state.attrData.Draw_Print(g, name, Pos, avv.ObjNameFont, enmHorizontalAlignment.Center, enmVerticalAlignment.Top);
                    pos2.y += state.attrData.Get_Length_On_Screen(avv.ObjNameFont.Size);
                }
                if (avv.ValueVisible === true) {
                    let V = state.attrData.Get_Data_Value(Layernum, DataNum, ObjectNumber, "欠損値");
                    if (state.attrData.Get_DataType(Layernum, DataNum) === enmAttDataType.Normal) {
                        if ( avv.DecimalSepaF === true) {
                            V = Generic.Figure_Using(Number(V), avv.DecimalNumber);
                        }
                    }
                    state.attrData.Draw_Print(g, String(V), pos2, avv.ValueFont, enmHorizontalAlignment.Center, enmVerticalAlignment.Top);
                }
                break;
            }
            case enmVerticalAlignment.Center: {
                if (avv.ObjNameVisible === true) {
                    let opos: number = enmVerticalAlignment.Center;
                    if (avv.ValueVisible === true) {
                        opos = enmVerticalAlignment.Bottom;
                    }
                    const name = state.attrData.Get_KenObjName(Layernum, ObjectNumber);
                    state.attrData.Draw_Print(g, name, Pos, avv.ObjNameFont, enmHorizontalAlignment.Center, opos);
                }
                if (avv.ValueVisible === true) {
                    let opos: number = enmVerticalAlignment.Center;
                    if (avv.ObjNameVisible === true) {
                        opos = enmVerticalAlignment.Top;
                    }
                    let V = state.attrData.Get_Data_Value(Layernum, DataNum, ObjectNumber, "欠損値");
                    if (state.attrData.Get_DataType(Layernum, DataNum) === enmAttDataType.Normal) {
                        if ( avv.DecimalSepaF === true) {
                            V = Generic.Figure_Using(Number(V), avv.DecimalNumber);
                        }
                    }
                    state.attrData.Draw_Print(g, String(V), Pos, avv.ValueFont, enmHorizontalAlignment.Center, opos);
                    break;
                }
            }
        }
    }

    //ダミーオブジェクト・ダミーオブジェクトグループを描画
    static Vector_Dummy_Boundary(g: CanvasRenderingContext2D, Layernum: number, Polygon_F: boolean, nonPolygon_F: boolean) {
        const state = appState();
        const ad = state.attrData.LayerData[Layernum];
        type DummyMapObjectInfo = { Shape: number; Kind: number };
        if(ad.DummyGroup.length > 0) {
            if(Polygon_F === true) {
                this.Vector_DummyGroup_Draw(g,  enmShape.PolygonShape, Layernum);
            }
            if(nonPolygon_F === true) {
                this.Vector_DummyGroup_Draw(g,  enmShape.NotDeffinition, Layernum);
                this.Vector_DummyGroup_Draw(g,  enmShape.LineShape, Layernum);
                this.Vector_DummyGroup_Draw(g,  enmShape.PointShape, Layernum);
            }
        }
        for (let i = 0; i < ad.Dummy.length; i++) {
            const c = Number(ad.Dummy[i].code);
            const mc = ad.MapFileData.MPObj[c] as unknown as DummyMapObjectInfo;
            if((mc.Shape === enmShape.PolygonShape) && (Polygon_F === true) || (mc.Shape !== enmShape.PolygonShape) && (nonPolygon_F === true)){
                this.Vector_Dummy_Draw(g, c, Layernum);
            }
        }
    }
    //ダミーオブジェクトグループの描画。描画順は設定したグループ順
    static Vector_DummyGroup_Draw(g: CanvasRenderingContext2D, SHP: number, Layernum: number) {
        const state = appState();
        const ad = state.attrData.LayerData[Layernum];
        type DummyObjectKindInfo = { Shape: number };
        for (let i = 0; i < ad.DummyGroup.length; i++) {
            const ok = ad.DummyGroup[i];
            const objectKind = ad.MapFileData.ObjectKind[ok] as DummyObjectKindInfo;
            if(objectKind.Shape === SHP) {
                const mapFileData = ad.MapFileData as unknown as { Get_Objects_by_Group: (ok: number, time: unknown) => number[] };
                const temp = mapFileData.Get_Objects_by_Group(ok, ad.Time);
                for (const code of temp) {
                    this.Vector_Dummy_Draw(g, code, Layernum);
                }
            }
        }

    }
    //ダミーオブジェクトの描画
    static Vector_Dummy_Draw(g: CanvasRenderingContext2D, code: number, Layernum: number) {
        const state = appState();
        if(state.attrData.Check_Screen_Objcode_In(Layernum, code) === true) {
            const ad = state.attrData.LayerData[Layernum];
            type DummyMapObjectInfo = { Shape: number; Kind: number };
            type DummyObjectKindInfo = { Name: string };
            const mapObj = ad.MapFileData.MPObj[code] as unknown as DummyMapObjectInfo;
            if(mapObj.Shape === enmShape.PointShape) {
                const ok = mapObj.Kind;
                const CP = ad.MapFileData.Get_Enable_CenterP(code, ad.Time);
                const OP = (state.attrData.TotalData.ViewStyle.ScrData as AttrScreenInfo).Get_SxSy_With_3D(CP);
                const objectKind = ad.MapFileData.ObjectKind[ok] as DummyObjectKindInfo;
                const MK = this.getPointDummyMark(ad.MapFileName, objectKind.Name);
                const r = state.attrData.Radius(MK.WordFont.Size, 1, 1);
                state.attrData.Draw_Mark(g, OP, r, MK);
                if(state.attrData.TotalData.ViewStyle.MapLegend.Line_DummyKind.Dummy_Point_Visible === true) {
                    const okIndex = Number(ok);
                    state.attrData.AddPointObjectKindUsed(ad.MapFileName, okIndex, MK);
                }
            } else {
                this.Vector_Boundary_Draw(g,  Layernum, code);
            }
        }

    }
    //ダミー点オブジェクトの記号取得
    static getPointDummyMark(MapFIleName: string, ObjectGroupName: string) {
        const state = appState();
        const av = state.attrData.TotalData.ViewStyle;
        const obk = av.DummyObjectPointMark[MapFIleName];
        for (let i = 0; i < obk.length; i++) {
            if (obk[i].ObjectKindName === ObjectGroupName) {
                return obk[i].Mark;
            }
        }
    }
}

export { clsPrint, Fringe_Line_Info };
