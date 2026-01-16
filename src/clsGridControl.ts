/**■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
/**　グリッドコントロール用の内部クラス（外部に移動） */
import { appState } from './core/AppState';
import type { JsonValue } from './types';

export {};

// イベントコールバックの型定義
export interface EventCallbacks {
    evtChange_Data?: () => void;
    evtChange_FixedXS?: () => void;
    evtChange_FixedYS?: () => void;
    evtChange_FixedUpperLeft?: () => void;
    evtChange_LayerSelect?: (currentLayer: number, oldLayer: number) => void;
    evtChange_Layer?: (arg1: boolean, arg2: boolean, arg3: boolean) => void;
    evtAdd_Layer?: (layerNumber: number) => void;
    evtClick_FixedYS2?: (layer: number, x: number, y: number, text: string, top: number, left: number, width: number, height: number, pos: {x: number; y: number}) => void;
    evtClick_DataGrid?: (layer: number, x: number, y: number, text: string, top: number, left: number, width: number, height: number) => void;
}

const Keys = {
    Left: 37,
    Right: 39,
    Up: 38,
    Down: 40,
    ShiftKey: 16,
    ControlKey: 17,
    Z: 90,
    C: 67,
    X: 88,
    V: 86,
    Tab: 9,
    Return: 13,
    PageDown: 34,
    PageUp: 33,
    Home: 36,
    Enter: 13,
    Escape: 27,
    Delete: 46
};

class Undo_InputCopyPasteClearInfo {
    Layer: number;
    caption: string;
    Rect: rectangle;
    GridData: string;
}

class Undo_InsertRows {
    Layer: number;
    caption: string;
    Top: number;
    Bottom: number;
}

class Undo_InsertColumns {
    Layer: number;
    caption: string;
    Left: number;
    Right: number;
}

class Undo_DeleteRows {
    Layer: number;
    caption: string;
    Top: number;
    Bottom: number;
    GridData: string;
}

class Undo_DeleteColumns {
    Layer: number;
    caption: string;
    Left: number;
    Right: number;
    GridData: string;
}

class Undo_ChangeRowHeight {
    Layer: number;
    caption: string;
    Top: number;
    Bottom: number;
    Height: number[] = [];
}

class Undo_ChangeColumnWidth {
    Layer: number;
    caption: string;
    Left: number;
    Right: number;
    Width: number[] = [];
}

class Undo_ChangeLayerName {
    Layer: number;
    caption: string;
    Name: string;
}

class Undo_SwapLayer {
    Layer1: number;
    Layer2: number;
    caption: string;
}

class Undo_MoveLayer {
    OriginLay: number;
    DestLay: number;
    caption: string;
}

class Undo_deleteLayer {
    OriginLay: number;
    GridData: Grid_Info;
    caption: string;
}

class Undo_InsertLayer {
    Layer: number;
    caption: string;
}

class FixedObjectNameData_Info {
    Width: number = 0;
    Allignment: number = 0;
    
    Clone() {
        const d = new FixedObjectNameData_Info();
        Object.assign(d, this);
        return d;
    }
}

class FixedDataItemData_Info {
    Height: number = 0;
    Allignment: number = 0;
    
    Clone() {
        const d = new FixedDataItemData_Info();
        Object.assign(d, this);
        return d;
    }
}

class FixedUpperLeft_Info {
    Text: string = "";
    Allignment: number = 0;
    
    Clone() {
        const d = new FixedUpperLeft_Info();
        Object.assign(d, this);
        return d;
    }
}

class CellData_Info {
    Width: number = 0;
    Allignment: number = 0;
    
    Clone() {
        const d = new CellData_Info();
        Object.assign(d, this);
        return d;
    }
}

class GridTextColor_Info {
    Text: string = "";
    colorSetF: boolean = false;
    Color: colorRGBA = new colorRGBA();
    
    Clone() {
        const d = new GridTextColor_Info();
        Object.assign(d, this);
        d.Color = this.Color.Clone();
        return d;
    }
}

class Grid_Operation_enable_info {
    RightClickEnabled: boolean = false;
    RightClickAllEnabled: boolean = false;
    InputEnabled: boolean = false;
    GridRowEnabled: boolean = false;
    GridColEnabled: boolean = false;
    FixedXSEnabled: boolean = false;
    FixedYSEnabled: boolean = false;
    FixedUpperLeftEnabeld: boolean = false;
    TABvisible: boolean = false;
    TabClickEnabled: boolean = false;
    
    Clone() {
        const d = new Grid_Operation_enable_info();
        Object.assign(d, this);
        return d;
    }
}

class Grid_Info {
    OriginalLayerNumber: number = 0;
    Grid_Text: GridTextColor_Info[][] = [];
    FixedObjectName: GridTextColor_Info[][] = [];
    FixedDataItem: GridTextColor_Info[][] = [];
    FixedUpperLeft: FixedUpperLeft_Info[][] = [];
    Ope: Grid_Operation_enable_info = new Grid_Operation_enable_info();

    LayerName: string = "";
    LayerData: string[] = [];
    Ymax: number = 0;
    Xmax: number = 0;
    DataItemData: CellData_Info[] = [];
    CellHeight: number[] = [];

    FixedDataItemData: FixedDataItemData_Info[] = [];

    FixedDataItemHeight() {
        let H = 0;
        for (let i = 0; i < this.FixedDataItemData.length; i++) {
            H += this.FixedDataItemData[i].Height;
        }
        return H;
    }
    FixedObjectNameData: FixedObjectNameData_Info[] = [];
    FixedObjectNameDataWidth() {
        let W = 0;
        for (let i = 0; i < this.FixedObjectNameData.length; i++) {
            W += this.FixedObjectNameData[i].Width;
        }
        return W;
    }
    FixedUpperLeftAllignment: number = 0;
    GridLineCol: colorRGBA = new colorRGBA();
    TopCell: number = 0;
    LeftCell: number = 0;
    scrollTop: number = 0;
    scrollLeft: number = 0;
    BottomCell: number = 0;
    RightCell: number = 0;
    SelectedF: boolean = false;
    MouseDownX: number = 0;
    MouseDownY: number = 0;
    MouseDown_Mode: number = 0;
    MouseUpX: number = 0;
    MouseUpY: number = 0;
    MouseUpDownRect() {
        return new rectangle(Math.min(this.MouseDownX, this.MouseUpX), Math.max(this.MouseDownX, this.MouseUpX), Math.min(this.MouseDownY, this.MouseUpY),
            Math.max(this.MouseDownY, this.MouseUpY))
    }
    
    Clone() {
        const CloneGrid = new Grid_Info();
        Object.assign(CloneGrid, this);
        CloneGrid.Grid_Text = Generic.Array2Clone(this.Grid_Text);
        CloneGrid.FixedObjectName = Generic.Array2Clone(this.FixedObjectName);
        CloneGrid.FixedDataItem = Generic.Array2Clone(this.FixedDataItem);
        CloneGrid.FixedUpperLeft = Generic.Array2Clone(this.FixedUpperLeft);
        CloneGrid.Ope = this.Ope.Clone();
        CloneGrid.LayerName = this.LayerName
        CloneGrid.LayerData = [];
        for(const key in this.LayerData){
            CloneGrid.LayerData[key] = this.LayerData[key];
        }
        Object.assign(CloneGrid.LayerData, this.LayerData);
        CloneGrid.DataItemData = Generic.ArrayClone(this.DataItemData);
        CloneGrid.CellHeight = Generic.ArrayShallowCopy(this.CellHeight);
        CloneGrid.FixedDataItemData = Generic.ArrayClone(this.FixedDataItemData);
        CloneGrid.FixedObjectNameData = Generic.ArrayClone(this.FixedObjectNameData);
        CloneGrid.GridLineCol = this.GridLineCol.Clone();
        return CloneGrid
    }
}

class Grid_Color_Info {
    Frame: colorRGBA = new colorRGBA();
    SelectedFrame: colorRGBA = new colorRGBA();
    Grid: colorRGBA = new colorRGBA();
    GridLine: colorRGBA = new colorRGBA();
    TextBox: colorRGBA = new colorRGBA();
    SelectedGrid: colorRGBA = new colorRGBA();
    FixedGrid: colorRGBA = new colorRGBA();
    SelectedFixedGrid: colorRGBA = new colorRGBA();
}

class Grid_Total_Info {
    initOK: boolean = false;
    LayerNum: number = 0;
    Layer: number = 0;
    FixedDataItem_n: number = 0;
    FixedDataItem_n2: number = 0;
    FixedObjectName_n: number = 0;
    FixedObjectName_n2: number = 0;
    tOpe: Grid_Operation_enable_info = new Grid_Operation_enable_info();

    RowCaption: string = "";
    ColumnCaption: string = "";
    LayerCaption: string = "";
    DefaultFixedXWidth: number = 0;
    DefaultFixedXNumberingWidth: number = 0;
    DefaultGridWidth: number = 0;
    DefaultFixedYSAllignment: number = 0;
    DefaultFixedXSAllignment: number = 0;
    DefaultFixedUpperLeftAlligntment: number = 0;
    DefaultGridAlligntment: number = 0;
    DefaultNumberingAlligntment: number = 0;
    Color: Grid_Color_Info = new Grid_Color_Info();
    GridFont: string = "";
    MsgBoxTitle: string = "";
    GridWidth: number = 0;
    GridHeight: number = 0;
    TabClickEnabled: boolean = false;
}

class Grid_Resize_Info {
    Enable: number = 0;
    GridX: number = 0;
    GridY: number = 0;
    LeftX: number = 0;
    TopY: number = 0;
    tempImage: ImageData | null = null;
}

/**■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
/**　グリッドコントロール */

export class gridControl {
    top: number;
    left: number;
    width: number;
    height: number;
    
    // クラスプロパティ（元のコンストラクタ内ローカル変数）
    private Grid_Property: Grid_Info[] = [];
    private Grid_Total: Grid_Total_Info = new Grid_Total_Info();
    private UndoArray: Array<Undo_InputCopyPasteClearInfo | Undo_ChangeRowHeight | Undo_ChangeColumnWidth | Undo_InsertRows | Undo_InsertColumns | Undo_DeleteRows | Undo_DeleteColumns | Undo_SwapLayer | Undo_MoveLayer | Undo_ChangeLayerName | Undo_InsertLayer | Undo_deleteLayer> = [];
    private TimerObj: ReturnType<typeof setInterval> | undefined = undefined;
    private TimerVX: number = 0;
    private TimerVY: number = 0;
    private GridMouseDown: boolean = false;
    private inClipboard: string = "";
    private GridResize: Grid_Resize_Info = new Grid_Resize_Info();
    private readonly tabh: number = 25;
    private readonly tabArrowW: number = 40;
    private readonly tabw: number = 100;
    private defoFont: string = "";
    private readonly defoCellHeight: number = 22;
    private readonly scrollSize: number = 25;
    private GT: Grid_Total_Info;
    private GTC: Grid_Color_Info;
    private GX: number = 0;
    private GY: number = 0;
    private touchStartTime: number = 0;
    private base: HTMLDivElement;
    private tabbase: {
        frame?: HTMLDivElement;
        tab?: HTMLElement[];
        tabListBase?: HTMLDivElement;
        moveDiv?: HTMLDivElement;
        moveLeft?: HTMLDivElement;
        moveRight?: HTMLDivElement;
        selectedIndex?: number;
    } = {};
    private picGrid: HTMLDivElement;
    private vScroll!: scrollBar;
    private hScroll!: scrollBar;
    private canvas: HTMLCanvasElement;
    private txtTextBox: HTMLTextAreaElement;
    private ctx: CanvasRenderingContext2D | null;
    private eventCall: EventCallbacks = {};
    
    constructor(
        ParentObj: HTMLElement,
        x: number,
        y: number,
        width: number,
        height: number,
        fontName: string
    ) {
    this.top=y;
    this.left=x
    this.width=width;
    this.height=height;
    
    // 初期化
    this.defoFont = "15px '" + fontName + "'";
    this.GT = this.Grid_Total;
    this.GT.initOK = false;
    this.GT.GridFont = this.defoFont;
    this.GT.DefaultFixedXNumberingWidth = 50;
    this.GT.DefaultFixedXWidth = 150;
    this.GT.DefaultGridWidth = 100;
    this.GT.DefaultFixedUpperLeftAlligntment = enmHorizontalAlignment.Left;
    this.GT.DefaultFixedXSAllignment = enmHorizontalAlignment.Left;
    this.GT.DefaultFixedYSAllignment = enmHorizontalAlignment.Left;
    this.GT.DefaultGridAlligntment = enmHorizontalAlignment.Right;
    this.GT.DefaultNumberingAlligntment = enmHorizontalAlignment.Center;
    this.GTC = this.GT.Color;
    this.GTC.TextBox = new colorRGBA([250, 250, 250]);
    this.GTC.GridLine = new colorRGBA([0x80, 0x80, 0x80]);
    this.GTC.Grid = new colorRGBA([255, 255, 255]);
    this.GTC.FixedGrid = new colorRGBA([0xAA, 0xFF, 0xAA]);
    this.GTC.Frame = new colorRGBA([0xCA, 0xCA, 0xCA]);
    this.GT.MsgBoxTitle = "";

    this.base = Generic.createNewDiv(ParentObj, "", "", "", x, y, width, height, "overflow:hidden", "");
    this.picGrid = Generic.createNewDiv(this.base, "", "", "", 0, this.tabh + 1, width - 2, height - this.tabh - 3, "overflow :hidden;border:solid 1px", undefined);
    this.vScroll = new scrollBar(this.base as HTMLElement, width - this.scrollSize - 1, this.tabh + 2, this.scrollSize, height - this.tabh - this.scrollSize - 2, 0, height - this.tabh, height - this.tabh - this.scrollSize, 100, 10, this.ScrollChange);
    this.hScroll = new scrollBar(this.base as HTMLElement, 1, height - this.scrollSize - 1, this.scrollSize, width - this.scrollSize - 1, 1, width - 2, width - this.scrollSize, 200, 20, this.ScrollChange);
    this.vScroll.setVisibility(false);
    this.hScroll.setVisibility(false);
    
    this.canvas = Generic.createNewCanvas(this.picGrid, "", "", 0, 0, width - 2, height - 2, undefined, "");
    this.base.addEventListener("contextmenu", contextMenuPrevent);
    this.canvas.addEventListener("mousedown", this.mdown, false);
    this.canvas.addEventListener("touchstart", this.mdown, {passive: false});
    this.canvas.addEventListener("touchmove", this.mmove, {passive: false});
    this.canvas.addEventListener("mouseup", this.mup, false);
    this.canvas.addEventListener("touchend", this.mup, {passive: false});
    this.canvas.addEventListener("mouseleave", this.mleave, false);
    this.addDocumentEvent();
    this.txtTextBox = Generic.createNewTextarea(this.picGrid, "text", "", 0, 0, 100, 50, "height:25px;width:10px;text-align:right;resize: none;padding:0px;border: 0px solid #ccc;appearance: none");
    
    // @ts-expect-error - 'this' refers to HTMLTextAreaElement in the handler
    this.txtTextBox.onfocus = function(){ this.select() };

    this.ctx = this.canvas.getContext("2d");
    if (this.ctx) {
        this.ctx.font = this.defoFont;
        this.ctx.textBaseline = 'top';
    }
    this.Grid_Total.GridWidth = width;
    this.Grid_Total.GridHeight = height;
    this.tabInit();
}

    private ScrollChange = () => {
        if (this.txtTextBox?.getVisibility?.() === true) {
            if (this.txtTextBox.setVisibility) this.txtTextBox.setVisibility(false);
            this.Set_Data_from_txtBox_To_Grid();
        }
        const GP = this.Grid_Property[this.Grid_Total.Layer];
        GP.scrollTop = this.vScroll.getPosition();
        GP.scrollLeft = this.hScroll.getPosition();
        this.Print_Grid_Data();
        this.eventCall?.evtChange_Data?.();
    }
    
/**■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 外部からアクセス可能
*/
    /** init
    //<param name="LayerCaption">タブのキャプション</param>
    //<param name="RowCaption">行のキャプション</param>
    //<param name="ColumnCaption">列のキャプション</param>
    //<param name="FixedXs">左端固定列数</param>
    //<param name="FixedXs2">左端固定列数のうち左側の固定数</param>
    //<param name="FixedYs">状態固定行数</param>
    //<param name="FixedYS2">状態固定行数のうち上側の行数</param>
    //enableOperation:Operation_enable_info{}
 */
    init(LayerCaption: string, RowCaption: string, ColumnCaption: string, FixedXs: number, FixedXs2: number, FixedYs: number, FixedYS2: number, enableOperation: Partial<Grid_Operation_enable_info>, _eventCall?: EventCallbacks) {
        this.Grid_Total.LayerCaption = LayerCaption;
        this.Grid_Total.RowCaption = RowCaption;
        this.Grid_Total.ColumnCaption = ColumnCaption;
        this.Grid_Total.FixedObjectName_n = FixedXs;
        this.Grid_Total.FixedObjectName_n2 = FixedXs2;
        this.Grid_Total.FixedDataItem_n = FixedYs;
        this.Grid_Total.FixedDataItem_n2 = FixedYS2;
        Object.assign(this.Grid_Total.tOpe, enableOperation);
        this.Grid_Total.Layer = 0;
        this.Grid_Total.LayerNum = 0;
        this.Grid_Total.Color.SelectedFixedGrid = this.Grid_Total.Color.FixedGrid.getDarkColor();
        this.Grid_Total.Color.SelectedFrame = this.Grid_Total.Color.Frame.getDarkColor();
        this.Grid_Total.Color.SelectedGrid = this.Grid_Total.Color.Grid.getDarkColor();
        this.GX = 0
        this.GY = 0
        this.UndoArray.length = 0;
        this.Grid_Property.length = 0;
        this.eventCall = _eventCall;
    }

    /**サイズ変更 */
    changeSize(newWidth: number, newHeight: number) {
        this.width = newWidth;
        this.height = newHeight;
        this.base.style.width = this.width.px();
        this.base.style.height = this.height.px();
        this.picGrid.style.width = (this.width - 2).px();
        this.picGrid.style.height = (this.height - this.tabh - 3).px();
        this.vScroll.setXY(this.width - this.scrollSize - 1, this.tabh + 2);
        this.vScroll.setLength(this.height - this.tabh - this.scrollSize - 2)
        this.vScroll.setAreaRange(this.height - this.tabh - this.scrollSize);
        this.hScroll.setXY(1, this.height - this.scrollSize - 1);
        this.hScroll.setLength(this.width - this.scrollSize - 1);
        this.hScroll.setAreaRange(this.width - this.scrollSize);
        this.Print_Grid_ViewSize();

        const ctx = this.canvas.getContext("2d");
        if (ctx) {
            ctx.font = this.defoFont;
            ctx.textBaseline = 'top';
        }
        this.Grid_Total.GridWidth = this.width;
        this.Grid_Total.GridHeight = this.height;
        this.tabbase.moveDiv.style.left = (this.width - this.tabArrowW * 2).px();
        this.tabSelect();
        this.Print_Grid_Data();
    }
    

    /**グリッドを表示 */
    show() {
        this.tabbase.frame.setVisibility(this.Grid_Total.tOpe.TABvisible);
        if (this.Grid_Total.tOpe.TABvisible) {
            this.picGrid.style.top = (this.tabh + 1).px();
            this.picGrid.style.height = (this.Grid_Total.GridHeight - this.tabh - 3).px();
        } else {
            this.picGrid.style.top = "0px";
            this.picGrid.style.height = this.Grid_Total.GridHeight.px();
        }
        if (this.picGrid?.setVisibility) this.picGrid.setVisibility(true);
        if (this.txtTextBox?.setVisibility) this.txtTextBox.setVisibility(false);
        this.Grid_Total.Layer = 0;
        this.Print_Grid_ViewSize();
        this.Print_Grid_Data();
        this.eventCall?.evtChange_Data?.();
    }

    /**設定を反映する際に使用 */
    refresh(){
        this.tabSelect();
        this.Print_Grid_Data();
    }

    /**レイヤ追加（メソッド） */
    addLayer(LayName: string, LayerNum: number, Xsize: number, Ysize: number, opeEnable?: Partial<Grid_Operation_enable_info>) {
        let Ope = new Grid_Operation_enable_info();
        if (opeEnable === undefined) {
            Ope = this.Grid_Total.tOpe;
        } else {
            Object.assign(Ope, opeEnable);
        }
        this.Insert_Layer(LayName, LayerNum, LayerNum, Xsize, Ysize, Ope);
    }

    /**データ項目追加  */
    addDataItem(Layer: number, AddPoint: number, AddNum: number) {
        if ((Layer < 0) || (this.Grid_Total.LayerNum < Layer)) {
            Generic.alert(undefined, "Layerが誤っています。");
            return;
        }
        if (AddPoint < 0) {
            Generic.alert(undefined, "AddPointが誤っています。");
            return;
        }
        if (AddNum < 0) {
            Generic.alert(undefined, "AddNumが誤っています。");
            return;
        }
        const xMaxS = this.Grid_Property[Layer].Xmax;
        if (xMaxS <= AddPoint) {
            AddPoint = xMaxS;
        }
        this.InsertColumns(Layer, AddPoint, AddNum);
    }

    /**オブジェクト追加 Layer:レイヤ番号 AddPoint:追加縦行位置 AddNum:追加行数*/
    addObject(Layer: number, AddPoint: number, AddNum: number) {
        if ((Layer < 0) || (this.Grid_Total.LayerNum < Layer)) {
            Generic.alert(undefined, "Layerが誤っています。");
            return;
        }
        if (AddPoint < 0) {
            Generic.alert(undefined, "AddPointが誤っています。");
            return;
        }
        if (AddNum < 0) {
            Generic.alert(undefined, "AddNumが誤っています。");
            return;
        }
        const YMaxS = this.Grid_Property[Layer].Ymax;
        if (YMaxS <= AddPoint) {
            AddPoint = YMaxS;
        }
        this.InsertRows(Layer, AddPoint, AddNum);
    }
    /** レイヤ削除*/
    removeLayer(Layer: number) {
        const mxt = this.Grid_Total.LayerNum;
        this.Delete_Layer(Layer);
        this.tabMake();
        this.Set_SSTAB_Name();
        let nnt;
        if (Layer === mxt - 1) {
            nnt = Layer - 1;
        } else {
            nnt = Layer;
        }
        this.Grid_Total.Layer = nnt;
        this.tabSelect();
        this.Print_Grid_ViewSize();
        this.Print_Grid_Data();
    }

    /**オブジェクト削除 Layer:レイヤ番号 RemovePoint:削除する位置 RemoveNum:削除する数*/
    removeObject(Layer: number , RemovePoint: number , RemoveNum: number ) {
        if((Layer < 0)||(this.Grid_Total.LayerNum < Layer )){
            Generic.alert(undefined,"Layerが誤っています。");
            return;
        }
        if(RemovePoint < 0 ){
            Generic.alert(undefined,"RemovePointが誤っています。");
            return;
        }
        if(RemoveNum < 0 ){;
            Generic.alert(undefined,"RemoveNumが誤っています。");
            return;
        }
        const YMaxS  = this.Grid_Property[Layer].Ymax;
        if(YMaxS <= RemovePoint ){
            Generic.alert(undefined,"RemovePointが誤っています。");
            return;
        }else if( YMaxS < RemovePoint + RemoveNum ){
            RemoveNum = YMaxS - RemovePoint;
        }
        this.DeleteRows(Layer, RemovePoint, RemoveNum);
    }

    /**データ項目削除 */
    RemoveDataItem(Layer: number, RemovePoint: number, RemoveNum: number) {
        if ((Layer < 0) || (this.Grid_Total.LayerNum < Layer)) {
            Generic.alert(undefined, "Layerが誤っています。");
            return;
        }
        if (RemovePoint < 0) {
            Generic.alert(undefined, "RemovePointが誤っています。");
            return;
        }
        if (RemoveNum < 0) {
            Generic.alert(undefined, "RemoveNumが誤っています。");
            return;
        }
        const xMaxS = this.Grid_Property[Layer].Xmax
        if (xMaxS <= RemovePoint) {
            Generic.alert(undefined, "RemovePointが誤っています。");
            return;
        } else if (xMaxS < RemovePoint + RemoveNum) {
            RemoveNum = xMaxS - RemovePoint;
        }
        this.DeleteColumns(Layer, RemovePoint, RemoveNum);
    }

    /**検索 MatchingMode:マッチング*/
    Find(FindStr: string, MatchingMode: number) {
        const SPL = this.Grid_Total.Layer;
        let SX, SY;
        let GP = this.Grid_Property[SPL];
        if (GP.SelectedF === true) {
            SX = GP.MouseDownX
            SY = GP.MouseDownY
            if (SX === -this.Grid_Total.FixedObjectName_n) {
                SX ++;
            }
            if (SY === -this.Grid_Total.FixedDataItem_n) {
                SY ++;
            }
        } else {
            SX = -this.Grid_Total.FixedObjectName_n + 1;
            SY = -this.Grid_Total.FixedDataItem_n + 1;
        }

        let X = SX;
        let Y = SY;
        let L = SPL;
        let Index = -1;
        do {
            GP = this.Grid_Property[L];
            Y++;
            if (Y === GP.Ymax) {
                Y = -this.Grid_Total.FixedDataItem_n + 1;
                X++;
            }
            if (X === GP.Xmax) {
                L++;
                if (L === this.Grid_Total.LayerNum) {
                    L = 0;
                }
                X = -this.Grid_Total.FixedObjectName_n + 1;
            }
            const gstr = this.Get_XYData(L, X, Y);
            if ((gstr !== undefined)) {
                switch (MatchingMode) {
                    case enmMatchingMode.PerfectMatching:
                        if (gstr === FindStr) {
                            Index = 0;
                            break;
                        }
                        break;
                    case enmMatchingMode.PartialtMatching:
                        Index = gstr.indexOf(FindStr);
                        break;
                }
            }
        } while ((Index === -1) && ((SX !== X) || (SY !== Y) || (SPL !== L)))
        if ((SX === X) && (SY === Y) && (SPL === L) && (Index === -1)) {
            Generic.alert(undefined, "見つかりませんでした:" + FindStr);
        } else {
            GP = this.Grid_Property[L];
            GP.TopCell = Math.max(Y, 0);
            GP.LeftCell = Math.max(X, 0);
            GP.SelectedF = true;
            GP.MouseDownX = X;
            GP.MouseDownY = Y;
            GP.MouseUpX = X;
            GP.MouseUpY = Y;
            if (this.Grid_Total.Layer !== L) {
                this.Grid_Total.Layer = L;
                this.tabSelect();
                this.Print_Grid_ViewSize();
            }
            this.VScrollGrid_ValueSet();
            this.HScrollGrid_ValueSet();
            this.Print_Grid_Data();
        }
    }
    /**逆方向検索 */
    FindRev(FindStr: string, MatchingMode: number) {
        const SPL = this.Grid_Total.Layer;
        let SX, SY;
        let GP = this.Grid_Property[SPL];
        if (GP.SelectedF === true) {
            SX = GP.MouseDownX;
            SY = GP.MouseDownY;
            if (SX === -this.Grid_Total.FixedObjectName_n) {
                SX++;
            }
            if (SY === -this.Grid_Total.FixedDataItem_n) {
                SY++;
            }
        } else {
            SX = GP.Xmax - 1;
            SY = GP.Ymax - 1;
        }

        let X = SX;
        let Y = SY;
        let L = SPL;
        let Index = -1;
        do {
            GP = this.Grid_Property[L];
            Y--;
            if (Y === -this.Grid_Total.FixedDataItem_n) {
                Y = GP.Ymax - 1
                X--;
            }
            if (X === -this.Grid_Total.FixedObjectName_n) {
                L--;
                if (L === -1) {
                    L = this.Grid_Total.LayerNum - 1;
                }
                X = this.Grid_Property[L].Xmax - 1;
                Y = this.Grid_Property[L].Ymax - 1;
            }
            const gstr = this.Get_XYData(L, X, Y);
            if (gstr !== undefined) {
                switch (MatchingMode) {
                    case enmMatchingMode.PerfectMatching:
                        if (gstr === FindStr) {
                            Index = 0;
                        }
                        break;
                    case enmMatchingMode.PartialtMatching:
                        Index = gstr.indexOf(FindStr);
                        break;
                }
            }
        } while ((Index === -1) && ((SX !== X) || (SY !== Y) || (SPL !== L)))
        if ((SX === X) && (SY === Y) && (SPL === L) && (Index === -1)) {
            Generic.alert(undefined, "見つかりませんでした:" + FindStr);
        } else {
            GP = this.Grid_Property[L];
            GP.TopCell = Math.max(Y, 0);
            GP.LeftCell = Math.max(X, 0);
            GP.SelectedF = true;
            GP.MouseDownX = X;
            GP.MouseDownY = Y;
            GP.MouseUpX = X;
            GP.MouseUpY = Y;
            if (this.Grid_Total.Layer !== L) {
                this.Grid_Total.Layer = L;
                this.tabSelect();
            }
            this.Print_Grid_Data();
        }
    }

/**■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ プロパティメソッド**/

    /**内部のコピーデータに設定 */
    setCopyText(CopyData: string){
        this.inClipboard=CopyData;
    }

    /** グリッドの上端固定部分の文字*/
    setFixedDataItem(LayerNum: number, X: number, Y: number, value: string) {
        this.Grid_Property[LayerNum].FixedDataItem[X][Y].Text = value;
    }
    getFixedDataItem(LayerNum: number, X: number, Y: number) {
        return this.Grid_Property[LayerNum].FixedDataItem[X][Y].Text;
    }

    /** グリッドの左端固定部分の文字*/
    setFixedXSData(LayerNum: number, X: number, Y: number, value: string) {
        this.Grid_Property[LayerNum].FixedObjectName[X][Y].Text = value;
    }
   /**グリッドの左端固定部分の文字設定取得  XY指定なしの場合は配列で取得*/
   getFixedXSData(LayerNum: number, X: number = -1, Y: number = -1) {
    const GP = this.Grid_Property[LayerNum];
    if (X !== undefined) {
        return GP.FixedObjectName[X][Y].Text;    
    }else{
        const xs = this.Grid_Total.FixedObjectName_n;
        const ys = GP.Ymax;
        const dt = Generic.Array2Dimension<string>(xs, ys);
        for (let i = 0; i < xs; i++) {
            for (let j = 0; j < ys; j++) {
                dt[i][j] = GP.FixedObjectName[i][j].Text;
            }
        }
        return dt;
    }
}
    /**グリッドの中身設定 */
    setGridData(LayerNum: number, X: number, Y: number, value: string) {
        this.Grid_Property[LayerNum].Grid_Text[X][Y].Text = value;
    }
    getGridData(LayerNum: number, X: number, Y: number) {
        return this.Grid_Property[LayerNum].Grid_Text[X][Y].Text;
    }
    /**グリッドの左上固定部分設定 */
    setFixedUpperLeftData(LayerNum: number, X: number, Y: number, value: string) {
        this.Grid_Property[LayerNum].FixedUpperLeft[X][Y].Text = value;
    }
    /**グリッドの左端固定部分の配置設定 */
    setFixedXSAllignment(LayerNum: number, X: number, value: enmHorizontalAlignment) {
        this.Grid_Property[LayerNum].FixedObjectNameData[X].Allignment=value;
    }
    getFixedXSAllignment(LayerNum: number, X: number) {
        return this.Grid_Property[LayerNum].FixedObjectNameData[X].Allignment;
    }
    /**グリッドの左端固定部分の幅設定 */
    setFixedXSWidth(LayerNum: number, X: number, value: number) {
        this.Grid_Property[LayerNum].FixedObjectNameData[X].Width=value;
    }
    getFixedXSWidth(LayerNum: number, X: number) {
        return this.Grid_Property[LayerNum].FixedObjectNameData[X].Width;
    }

 
    /**現在のレイヤの左端セルの取得 */
    getLeftCell() {
        return this.Grid_Property[this.Grid_Total.Layer].LeftCell;
    }
    /**現在のレイヤの左端セルの設定(refresh必要) */
    setLeftCell(v: number) {
        this.Grid_Property[this.Grid_Total.Layer].LeftCell = v;
    }
    /**現在のレイヤの上端セルの取得 */
    getTopCell() {
        return this.Grid_Property[this.Grid_Total.Layer].TopCell;
    }
    /**現在のレイヤの上端セルの設定(refresh必要) */
    setTopCell(v: number) {
        this.Grid_Property[this.Grid_Total.Layer].TopCell = v;
    }
    /**グリッドのフォントの取得 */
    getGridFont() {
        return this.Grid_Total.GridFont;
    }
    /**グリッドのフォントの設定ex "15px 'Meiryo UI'";(refresh必要) */
    setGridFont(v: string) {
        this.Grid_Total.GridFont = v;
    }
    /**左端番号列の幅の取得 */
    getDefaultFixedXNumberingWidth() {
        return this.Grid_Total.DefaultFixedXWidth;
    }
    /**左端番号列の幅の設定(refresh必要) */
    setDefaultFixedXNumberingWidth(v: number) {
        this.Grid_Total.DefaultFixedXWidth = v;
    }
    /**左端固定列の幅の取得 */
    getDefaultFixedXWidth() {
        return this.Grid_Total.DefaultGridWidth;
    }
    /**左端固定列の幅の設定(refresh必要) */
    setDefaultFixedXWidth(v: number) {
        this.Grid_Total.DefaultGridWidth = v;
    }
    /**左上端固定列のアライメント取得 */
    getDefaultFixedUpperLeftAlligntment() {
        return this.Grid_Total.DefaultFixedUpperLeftAlligntment;
    }
    /**左上端固定列のアライメント(refresh必要) */
    setDefaultFixedUpperLeftAlligntment(v: enmHorizontalAlignment) {
        this.Grid_Total.DefaultFixedUpperLeftAlligntment = v;
    }
    /**上端固定列のアライメント取得 */
    getDefaultFixedYSAllignment() {
        return this.Grid_Total.DefaultFixedYSAllignment;
    }
    /**上端固定列のアライメント(refresh必要) */
    setDefaultFixedYSAllignment(v: enmHorizontalAlignment) {
        this.Grid_Total.DefaultFixedYSAllignment = v;
    }
    /**左端固定列のアライメント取得 */
    getDefaultFixedXSAllignment() {
        return this.Grid_Total.DefaultFixedXSAllignment;
    }
    /**左端固定列のアライメント(refresh必要) */
    setDefaultFixedXSAllignment(v: enmHorizontalAlignment) {
        this.Grid_Total.DefaultFixedXSAllignment = v;
    }
       /**グリッドのアライメント取得 */
       getDefaultGridAlligntment() {
        return this.Grid_Total.DefaultGridAlligntment;
    }
    /**グリッドのアライメント(refresh必要) */
    setDefaultGridAlligntment(v: enmHorizontalAlignment) {
        this.Grid_Total.DefaultGridAlligntment = v;
    }
    /**グリッドの選択範囲を取得 */
    getSelectedArea(LayerNum: number) {
        const R = this.Grid_Property[LayerNum].MouseUpDownRect();
        if (this.Grid_Property[LayerNum].SelectedF === false) {
            const sz = R.size();
            sz.height = -1;
            sz.width = -1;
            R.left = 0;
            R.top = 0;
        } else {
            const sz = R.size();
            sz.height++;
            sz.width++;
        }
        return R;
    }
    /**グリッドの横セル数取得 */
    getXsize(LayerNum: number) {
        return this.Grid_Property[LayerNum].Xmax;
    }
    /**グリッドの横セル数設定 */
    setXsize(LayerNum: number, value: number) {
        const xmax = this.Grid_Property[LayerNum].Xmax;
        if (value === xmax) {
            return;
        } else if (value > xmax) {
            this.InsertColumns(LayerNum, xmax, value - xmax);
        } else {
            this.DeleteColumns(LayerNum, value, xmax - value);
        }
    }
    /**グリッドの縦セル数取得 */
    getYsize(LayerNum: number) {
        return this.Grid_Property[LayerNum].Ymax;
    }
    /**グリッドの縦セル数設定 */
    setYsize(LayerNum: number, value: number) {
        const ymax = this.Grid_Property[LayerNum].Ymax;
        if (value === ymax) {
            return;
        } else if (value > ymax) {
            this.InsertRows(LayerNum, ymax, value - ymax);
        } else {
            this.DeleteRows(LayerNum, value, ymax - value);
        }
    }
    /**上固定部分の行数 */
    getFixedYsNum() {
        return this.Grid_Total.FixedDataItem_n;
    }

    /**上固定部分二段目の行数 */
    getFixedYsNum2() {
        return this.Grid_Total.FixedDataItem_n2;
    }

    /** 左固定部分の行数 */
    getFixedXsNum() {
        return this.Grid_Total.FixedObjectName_n;
    }

    /**左固定部分二段の行数 */
    getFixedXsNum2() {
        return this.Grid_Total.FixedObjectName_n2;
    }

    /**グリッドの位置を指定して表示 */
    SetGridPosition(LayerNum: number, LeftCell: number, TopCell: number) {
        const GP = this.Grid_Property[LayerNum];
        GP.TopCell = Math.max(TopCell, 0);
        GP.LeftCell = Math.max(LeftCell, 0);
        GP.SelectedF = true;
        GP.MouseDownX = LeftCell;
        GP.MouseDownY = TopCell;
        GP.MouseUpX = LeftCell;
        GP.MouseUpY = TopCell;
        if (this.Grid_Total.Layer !== LayerNum) {
            this.Grid_Total.Layer = LayerNum;
            this.tabSelect();
        }
        this.Print_Grid_Data();
    }

    /**グリッドのデータを配列取得／取得のみ */
    getLayerGridData(LayerNum: number) {
        const GP = this.Grid_Property[LayerNum];
        const xs = GP.Xmax;
        const ys = GP.Ymax;
        const D = Generic.Array2Dimension<string>(xs, ys);
        for (let i = 0; i < xs; i++) {
            for (let j = 0; j < ys; j++) {
                D[i][j] = GP.Grid_Text[i][j].Text;
            }
        }
        return D;
    }

    /**グリッドの文字設定取得（セル単位）：実行時のみ */
    getGridDataCell(LayerNum: number, X: number, Y: number) {
        const GP = this.Grid_Property[LayerNum];
        return GP.Grid_Text[X][Y].Text;
    }
    /** */
    setGridDataCell(LayerNum: number, X: number, Y: number, value: string) {
        const GP = this.Grid_Property[LayerNum];
        GP.Grid_Text[X][Y].Text = value;
    }

    /**グリッドの左上固定部分を配列取得 */
    getFixedUpperLeftDataArray(LayerNum: number) {
        const GP = this.Grid_Property[LayerNum];
        const xs = this.Grid_Total.FixedObjectName_n;
        const ys = this.Grid_Total.FixedDataItem_n;
        const dt = Generic.Array2Dimension<string>(xs, ys);
        for (let i = 0; i <= xs; i++) {
            for (let j = 0; j <= ys; j++) {
                dt[i][j] = GP.FixedUpperLeft[i][j].Text;
            }
        }
        return dt;
    }

 

    /** */
    setInternal(LayerNum: number, X: number, Y: number, value: string) {
        const GP = this.Grid_Property[LayerNum];
        GP.FixedObjectName[X][Y].Text = value;
    }
    /** グリッドの左端固定部分の個別色設定*/
    getFixedXSColor(Layernum: number, X: number, Y: number) {
        if (this.Grid_Property[Layernum].FixedObjectName[X][Y].colorSetF === true) {
            return this.Grid_Property[Layernum].FixedObjectName[X][Y].Color
        } else {
            if (X < this.Grid_Total.FixedObjectName_n2) {
                return this.Grid_Total.Color.Frame;
            } else {
                return this.Grid_Total.Color.FixedGrid;
            }
        }
    }
    /** */

    setFixedXSColor(Layernum: number, X: number, Y: number, value: colorRGBA) {
        this.Grid_Property[Layernum].FixedObjectName[X][Y].colorSetF = true;
        this.Grid_Property[Layernum].FixedObjectName[X][Y].Color = value;
    }
    /**レイヤのグリッドの左端固定部分の色設定をすべてクリア */
    FixedAllXSColorReset(LayerNum: number) {
        const GP = this.Grid_Property[LayerNum];
        for (let i = 0; i < this.Grid_Total.FixedObjectName_n; i++) {
            for (let j = 0; j < GP.Ymax; j++) {
                GP.FixedObjectName[i][j].colorSetF = false;
            }
        }
        this.Print_Grid_Data();
    }

    /**グリッドの左端固定部分の色設定クリア */
    FixedXSColorReset(Layernum: number, X: number, Y: number) {
        this.Grid_Property[Layernum].FixedObjectName[X][Y].colorSetF = false;
    }

    /**グリッドの上端固定部分の文字設定取得 XY指定なしの場合は配列で取得*/
    getFixedYSData(LayerNum: number, X?: number, Y?: number) {
        const GP = this.Grid_Property[LayerNum];
        if (X !== undefined) {
            return GP.FixedDataItem[X][Y].Text;
        } else {
            const xs = GP.Xmax;
            const ys = this.Grid_Total.FixedDataItem_n;
            const dt = Generic.Array2Dimension<string>(xs, ys);
            for (let i = 0; i < xs; i++) {
                for (let j = 0; j < ys; j++) {
                    dt[i][j] = GP.FixedDataItem[i][j].Text;
                }
            }
            return dt;
        }
    }

    setFixedYSData(LayerNum: number, X: number, Y: number, value: string) {
        const GP = this.Grid_Property[LayerNum];
        GP.FixedDataItem[X][Y].Text = value;
    }

    /**グリッドの上端固定部分の個別色設定 */
    getFixedYSColor(Layernum: number, X: number, Y: number) {
        if (this.Grid_Property[Layernum].FixedDataItem[X][Y].colorSetF === true) {
            return this.Grid_Property[Layernum].Grid_Text[X][Y].Color;
        } else {
            if (Y < this.Grid_Total.FixedDataItem_n2) {
                return this.Grid_Total.Color.Frame;
            } else {
                return this.Grid_Total.Color.FixedGrid;
            }
        }
    }
    setFixedYSColor(Layernum: number, X: number, Y: number, value: colorRGBA) {
        this.Grid_Property[Layernum].FixedDataItem[X][Y].colorSetF = true;
        this.Grid_Property[Layernum].FixedDataItem[X][Y].Color = value;
    }
    /**レイヤのグリッドの上端固定部分の色設定をすべてクリア */
    FixedAllYSColorReset(LayerNum: number) {
        const GP = this.Grid_Property[LayerNum];
        for (let i = 0; i < this.Grid_Total.FixedDataItem_n; i++) {
            for (let j = 0; j < GP.Ymax ; j++) {
                GP.FixedDataItem[i][j].colorSetF = false;
            }
        }
        this.Print_Grid_Data();
    }
    /**グリッドの上端固定部分の色設定クリア */
    FixedYSColorReset(Layernum: number, X: number, Y: number) {
        this.Grid_Property[Layernum].FixedDataItem[X][Y].colorSetF = false
    }

    /**グリッド上端固定部分の文字設定 */
    getFixedUpperLeftDataCell(LayerNum: number, X: number, Y: number) {
        return this.Grid_Property[LayerNum].FixedUpperLeft[X][Y].Text;
    }
    setFixedUpperLeftDataCell(LayerNum: number, X: number, Y: number, value: string) {
        this.Grid_Property[LayerNum].FixedUpperLeft[X][Y].Text = value;
    }

    /** グリッドの高さ設定 */
    getGridHeight(LayerNum: number, Y: number) {
        return this.Grid_Property[LayerNum].CellHeight[Y]
    }
    setGridHeight(LayerNum: number, Y: number, value: number) {
        this.Grid_Property[LayerNum].CellHeight[Y] = value;
    }

    /** グリッドの幅設定 */
    getGridWidth(LayerNum: number, X: number) {
        return this.Grid_Property[LayerNum].DataItemData[X].Width;
    }
    setGridWidth(LayerNum: number, X: number, value: number) {
        this.Grid_Property[LayerNum].DataItemData[X].Width = value;
    }

    /** グリッドの配置設定 */
    getGridAlligntment(LayerNum: number, X: number) {
        return this.Grid_Property[LayerNum].DataItemData[X].Allignment
    }
    setGridAlligntment(LayerNum: number, X: number, value: number) {
        this.Grid_Property[LayerNum].DataItemData[X].Allignment = value;
    }

    /** グリッドの左上固定部分の配置設定 */
    getFixedUpperLeftAlligntment(LayerNum: number) {
        return this.Grid_Property[LayerNum].FixedUpperLeftAllignment
    }
    setFixedUpperLeftAlligntment(LayerNum: number, value: number) {
        this.Grid_Property[LayerNum].FixedUpperLeftAllignment = value;
    }

    /** グリッドの左端固定部分の配置設定 */
    getFixedXSAllignmentData(LayerNum: number, n: number) {
        return this.Grid_Property[LayerNum].FixedObjectNameData[n].Allignment
    }
    setFixedXSAllignmentData(LayerNum: number, n: number, value: number) {
        this.Grid_Property[LayerNum].FixedObjectNameData[n].Allignment = value;
    }

    /** グリッドの左端固定部分の幅設定 */
    getFixedXSWidthData(LayerNum: number, n: number) {
        return this.Grid_Property[LayerNum].FixedObjectNameData[n].Width
    }
    setFixedXSWidthData(LayerNum: number, n: number, value: number) {
        this.Grid_Property[LayerNum].FixedObjectNameData[n].Width = value;
    }

    /** 上部固定部分の行ごとの配置設定 */
    getFixedYSAllignment(LayerNum: number, n: number) {
        return this.Grid_Property[LayerNum].FixedDataItemData[n].Allignment
    }
    setFixedYSAllignment(LayerNum: number, n: number, value: number) {
        this.Grid_Property[LayerNum].FixedDataItemData[n].Allignment = value;
    }

    /** 上部固定部分の行ごとの高さ設定 */
    getFixedYSHeight(LayerNum: number, n: number) {
        return this.Grid_Property[LayerNum].FixedDataItemData[n].Height
    }
    setFixedYSHeight(LayerNum: number, n: number, value: number) {
        this.Grid_Property[LayerNum].FixedDataItemData[n].Height = value;
    }

    /** レイヤの最大数を取得：実行時・取得のみ */
    getLayerMax() {
        return this.Grid_Total.LayerNum;
    }

    /** レイヤタグを取得：：実行時・取得のみ　設定はAddLayerメソッド */
    getLayerData(LayerNum: number, key: string) {
        return this.Grid_Property[LayerNum].LayerData[key as string];
    }
    setLayerData(LayerNum: number, key: string, value: JsonValue) {
        this.Grid_Property[LayerNum].LayerData[key as string] = value;
    }

    /**現在のレイヤを取得：実行時 */
    getLayer() {
        return this.Grid_Total.Layer;
    }
    setLayer(value: number) {
        this.Grid_Total.Layer = value;
    }

    /**レイヤ名を取得・設定 */
    getLayerName(LayerNum: number) {
        return this.Grid_Property[LayerNum].LayerName;
    }
    setLayerName(LayerNum: number, value: string) {
        this.Grid_Property[LayerNum].LayerName = value;
        this.Set_SSTAB_Name();
    }

    /** タブをクリックしてレイヤメニューが出るかどうか */
    getTabClickEnabled() {
        return this.Grid_Total.TabClickEnabled
    }
    setTabClickEnabled(value: boolean) {
        this.Grid_Total.TabClickEnabled = value;
    }

    /**セルの既定色設定 */
    getTotalGridColor() {
        return this.Grid_Total.Color.Grid;
    }
    setTotalGridColor(value: colorRGBA) {
        this.Grid_Total.Color.Grid = value;
    }

    /** セルの個別色設定 */
    getGridColor(LayerNum: number, X: number, Y: number) {
        if (this.Grid_Property[LayerNum].Grid_Text[X][Y].colorSetF === false) {
            return this.Grid_Total.Color.Grid;
        } else {
            return this.Grid_Property[LayerNum].Grid_Text[X][Y].Color;
        }
    }
    setGridColor(LayerNum: number, X: number, Y: number, value: colorRGBA) {
        this.Grid_Property[LayerNum].Grid_Text[X][Y].colorSetF = true;
        this.Grid_Property[LayerNum].Grid_Text[X][Y].Color = value;
    }

    /** レイヤのグリッドの色設定をすべてクリア */
    GridColorReset(LayerNum: number) {
        const GP = this.Grid_Property[LayerNum];
        for (let i = 0; i <= GP.Xmax; i++) {
            for (let j = 0; j < GP.Ymax; j++) {
                GP.Grid_Text[i][j].colorSetF = false;
            }
        }
        this.Print_Grid_Data();
    }

    /** グリッドの色設定クリア */
    getGridColorReset(LayerNum: number, X: number, Y: number) {
        this.Grid_Property[LayerNum].Grid_Text[X][Y].colorSetF = false;
    }

    /**固定部分の色設定 */
    getFixedGridColor() {
        return this.Grid_Total.Color.FixedGrid;
    }
    setFixedGridColor(value: colorRGBA) {
        this.Grid_Total.Color.FixedGrid = value;
    }

    /**セル境界線色設定 */
    getGridLineColor() {
        return this.Grid_Total.Color.GridLine;
    }
    setGridLineColor(value: colorRGBA) {
        this.Grid_Total.Color.GridLine = value;
    }
    /**枠部分色設定 */
    getFrameColor() {
        return this.Grid_Total.Color.Frame;
    }
    setFrameColor(value: colorRGBA) {
        this.Grid_Total.Color.Frame = value;
    }
    /**行のキャプション */
    getRowCaption() {
        return this.Grid_Total.RowCaption;
    }
    setRowCaption(value: string) {
        this.Grid_Total.RowCaption = value;
    }
    /**列のキャプション */
    getColumnCaption() {
        return this.Grid_Total.ColumnCaption;
    }
    /**レイヤ行キャプション */
    getLayerCaption() {
        return this.Grid_Total.LayerCaption;
    }
    setLayerCaption(value: string) {
        this.Grid_Total.LayerCaption = value;
    }
/**■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 内部関数*/
    /**グリッドを表示 */
    Print_Grid_Data = () => {

        const picW = this.picGrid.clientWidth;
        const picH = this.picGrid.clientHeight;
        if ((picW === 0) || (picH === 0)) {
            return;
        }

        if (!this.ctx) return;

        const GP = this.Grid_Property[this.Grid_Total.Layer];
        const xs = GP.Xmax;
        const ys = GP.Ymax;
        const topPixcel = this.vScroll.getPosition();
        const leftPixcel = this.hScroll.getPosition();
        this.ctx.clearRect(0,0,picW,picH);

        let tpx=0;
        let TopCell=0;
        do{
            tpx+= GP.CellHeight[TopCell];
             TopCell++;
        }while ((tpx < topPixcel) && (TopCell< ys))
        TopCell--;
        GP.TopCell = TopCell;

        let LeftCell=0;
        let lpx=0;
        do{
            lpx += GP.DataItemData[LeftCell].Width;
            LeftCell++;
        }while ((lpx < leftPixcel) && (LeftCell < xs))
        LeftCell--;
        GP.LeftCell = LeftCell;

        const txtF = (this.txtTextBox?.getVisibility) ? this.txtTextBox.getVisibility() : false;

        const MBX1 = Math.min(GP.MouseDownX, GP.MouseUpX);
        const MBX2 = Math.max(GP.MouseDownX, GP.MouseUpX);
        const MBY1 = Math.min(GP.MouseDownY, GP.MouseUpY);
        const MBY2 = Math.max(GP.MouseDownY, GP.MouseUpY);

        const font = new Font_Property();
        font.Name = this.Grid_Total.GridFont;

        let Y = GP.FixedDataItemHeight();
        let j = GP.TopCell;
        do {
            let X = GP.FixedObjectNameDataWidth();
            let i = GP.LeftCell;
            let bkCol;
            if (j === ys - 1) {//一番下の行は折り返しが見えないようにクリップ
                this.ctx.save();
                this.ctx.rect(0,Y,picW,GP.CellHeight[j]+1);
                this.ctx.clip();
            }
            do {
                if (GP.Grid_Text[i][j].colorSetF === false) {
                    bkCol = this.Grid_Total.Color.Grid.Clone();
                } else {
                    bkCol = GP.Grid_Text[i][j].Color.Clone();
                }
                if (GP.SelectedF === true) {
                    if (((MBX1 <= i) && (i <= MBX2)) && ((MBY1 <= j) && (j <= MBY2))) {
                        bkCol = this.Grid_Total.Color.SelectedGrid.Clone();
                    }
                }
                let ptx=GP.Grid_Text[i][j].Text;
                if(ptx==='undefined'){
                    ptx="";
                }
               this.Print_Data(ptx, GP.DataItemData[i].Allignment, X, Y, GP.DataItemData[i].Width, GP.CellHeight[j], GP.GridLineCol, bkCol, 0, font);
                X += GP.DataItemData[i].Width;
                i++;
            } while ((X < picW) && (i < xs))
            //オブジェクト名
            X = 0;
            for (let i = 0; i < this.Grid_Total.FixedObjectName_n; i++) {
                if (GP.FixedObjectName[i][j].colorSetF === true) {
                    bkCol = GP.FixedObjectName[i][j].Color.Clone();
                } else {
                    if (i < this.Grid_Total.FixedObjectName_n2) {
                        bkCol = this.Grid_Total.Color.Frame;
                    } else {
                        bkCol = this.Grid_Total.Color.FixedGrid;
                    }
                }
                if (GP.SelectedF === true) {
                    if ((MBY1 <= j) && (j <= MBY2)) {
                        if ((MBX1 <= -(this.Grid_Total.FixedObjectName_n - i)) && (-(this.Grid_Total.FixedObjectName_n - i) <= MBX2)) {
                            bkCol = bkCol.getDarkColor();
                        } else {
                            if (i < this.Grid_Total.FixedObjectName_n2) {
                                bkCol = bkCol.getDarkColor();
                            }
                        }
                    }
                }
                const fontObj = typeof font === 'string' ? new Font_Property() : font;
                this.Print_Data(GP.FixedObjectName[i][j].Text, GP.FixedObjectNameData[i].Allignment, X, Y, GP.FixedObjectNameData[i].Width, GP.CellHeight[j], GP.GridLineCol, bkCol, 1, fontObj);

                X += GP.FixedObjectNameData[i].Width;
            }
            if (j === ys - 1) {
                this.ctx.restore();
            }
            Y += GP.CellHeight[j];
            j++;
            
        } while ((Y < picH) && (j < ys))
        if (Y >= picH) {
            GP.BottomCell = j - 2;
        } else {
            GP.BottomCell = j - 1;
        }
        
        //データ項目
        this.ctx.save();//データ項目が下にはみ出さないようにクリップ
        this.ctx.rect(0,0, picW, GP.FixedDataItemHeight());
        this.ctx.clip()
        let X = GP.FixedObjectNameDataWidth();
        let i = GP.LeftCell;
        do {
            let Y = 0;
            for (let j = 0; j < this.Grid_Total.FixedDataItem_n; j++) {
                let bkCol;
                if (GP.FixedDataItem[i][j].colorSetF === true) {
                    bkCol = GP.FixedDataItem[i][j].Color.Clone();
                } else {
                    if (j < this.Grid_Total.FixedDataItem_n2) {
                        bkCol = this.Grid_Total.Color.Frame.Clone();
                    } else {
                        bkCol = this.Grid_Total.Color.FixedGrid.Clone();
                    }
                }

                if (GP.SelectedF === true) {
                    if ((MBX1 <= i) && (i <= MBX2)) {
                        if ((MBY1 <= -(this.Grid_Total.FixedDataItem_n - j)) && (-(this.Grid_Total.FixedDataItem_n - j) <= MBY2)) {
                            bkCol = bkCol.getDarkColor();
                        } else {
                            if (j < this.Grid_Total.FixedDataItem_n2) {
                                bkCol = bkCol.getDarkColor();
                            }
                        }
                    }
                }
                const fontObj = typeof font === 'string' ? new Font_Property() : font;
                this.Print_Data(GP.FixedDataItem[i][j].Text, GP.FixedDataItemData[j].Allignment, X, Y, GP.DataItemData[i].Width, GP.FixedDataItemData[j].Height, GP.GridLineCol, bkCol, 0, fontObj);
                Y += GP.FixedDataItemData[j].Height;
            }
            X += GP.DataItemData[i].Width;
            i++; 1
        } while ((X < picW) && (i < xs))
        if (X >= picW) {
            if (GP.Xmax === 1) {
                GP.RightCell = 0;
            } else {
                GP.RightCell = i - 2;
            }
        } else {
            GP.RightCell = i - 1;
        }

        //左上固定部分
         X = 0;
        for (let i = 0; i < this.Grid_Total.FixedObjectName_n; i++) {
            let Y = 0
            for (let j = 0; j < this.Grid_Total.FixedDataItem_n; j++) {
                let bkCol;
                if ((i < this.Grid_Total.FixedObjectName_n2) || (j < this.Grid_Total.FixedDataItem_n2)) {
                    bkCol = this.Grid_Total.Color.Frame.Clone();
                } else {
                    bkCol = this.Grid_Total.Color.FixedGrid.Clone();
                }
                if (GP.SelectedF === true) {
                    let dkf = false;
                    if (((MBX1 <= -(this.Grid_Total.FixedObjectName_n - i)) && (-(this.Grid_Total.FixedObjectName_n - i) <= MBX2)
                    ) && ((MBY1 <= -(this.Grid_Total.FixedDataItem_n - j)) && (-(this.Grid_Total.FixedDataItem_n - j) <= MBY2))) {
                        dkf = true;
                    }
                    if ((MBX1 <= -(this.Grid_Total.FixedObjectName_n - i)) && (-(this.Grid_Total.FixedObjectName_n - i) <= MBX2)) {
                        if (j < this.Grid_Total.FixedDataItem_n2) {
                            dkf = true;
                        }
                    }
                    if ((MBY1 <= -(this.Grid_Total.FixedDataItem_n - j)) && (-(this.Grid_Total.FixedDataItem_n - j) <= MBY2)) {
                        if (i < this.Grid_Total.FixedObjectName_n2) {
                            dkf = true;
                        }
                    }
                    if (dkf === true) {
                        bkCol = bkCol.getDarkColor();
                    }
                }
                const fontObj = typeof font === 'string' ? new Font_Property() : font;
                this.Print_Data(GP.FixedUpperLeft[i][j].Text, GP.FixedUpperLeftAllignment, X, Y, GP.FixedObjectNameData[i].Width, GP.FixedDataItemData[j].Height, GP.GridLineCol, bkCol, 0, fontObj)
                Y += GP.FixedDataItemData[j].Height;
            }
            X += GP.FixedObjectNameData[i].Width;
        }
        this.ctx.restore();
        if (txtF === true) {
            if ((GP.MouseDownX > GP.RightCell) || (GP.MouseDownX < GP.LeftCell) || (GP.MouseDownY > GP.BottomCell) || (GP.MouseDownY < GP.TopCell)) {
            } else {
                if (this.txtTextBox?.setVisibility) this.txtTextBox.setVisibility(true);
                this.SetTextBox(GP.MouseDownX, GP.MouseDownY);
            }
        }
    }

    /**テキストボックスの文字をグリッドにセットする */
    Set_Data_from_txtBox_To_Grid = () => {
        const tx  = this.Get_Data_from_Grid(this.Grid_Total.Layer, this.GX, this.GY);
        const newTx  = this.txtTextBox.value;
        if (tx !== newTx ){
            this.SetUndo_Input(this.GX, this.GY, newTx + "の入力");
            this.Set_Data_To_Grid(this.Grid_Total.Layer, this.GX, this.GY, newTx, true);
            this.Check_ChangeEvent(this.GX, this.GY);
        }
    }

    /** 指定された位置のグリッド配列のデータを取得する*/
    Get_Data_from_Grid = (Grid_Lay: number, X: number, Y: number) => {
        let tx;
        const GP = this.Grid_Property[Grid_Lay];
        if ((X < 0) && (Y < 0)) {
            tx = GP.FixedUpperLeft[X + this.Grid_Total.FixedObjectName_n][Y + this.Grid_Total.FixedDataItem_n].Text;
        } else if (X < 0) {
            tx = GP.FixedObjectName[X + this.Grid_Total.FixedObjectName_n][Y].Text;
        } else if (Y < 0) {
            tx = GP.FixedDataItem[X][Y + this.Grid_Total.FixedDataItem_n].Text;
        } else {
            tx = GP.Grid_Text[X][Y].Text;
        }
        if (tx === undefined) {
            tx = "";
        }
        return tx
    }

    Grid_Clear = (Caption: string ) => {
        const GP = this.Grid_Property[this.Grid_Total.Layer];
        if (GP.SelectedF === false) {
            return;
        }
        const rect = GP.MouseUpDownRect();
        const r1 = Math.max(-this.Grid_Total.FixedObjectName_n + this.Grid_Total.FixedObjectName_n2, rect.left)
        const r2 = rect.right;
        const c1 = Math.max(-this.Grid_Total.FixedDataItem_n + this.Grid_Total.FixedDataItem_n2, rect.top)
        const c2 = rect.bottom;
        
        this.SetUndo_CopyPasteCutClear(Caption);
        for (let i = r1; i <= r2; i++) {
            for (let j = c1; j <= c2; j++) {
                this.Set_Data_To_Grid(this.Grid_Total.Layer, i, j, "", true);
            }
        }
        this.Print_Grid_Data()
        this.Check_ChangeEventRange(r1, c1, r2 - r1 + 1, c2 - c1 + 1);
    }

    /**テキストボックス、コンボボックスを指定した位置のセルのサイズに合わせる */
    Get_Object_to_Cell_Size = (X: number, Y: number, Obj: HTMLElement) => {
        let w, H;
        let n;
        const GP = this.Grid_Property[this.Grid_Total.Layer];
        let lef =0;
        let tp = 0;
        if (X < 0) {
            n = X + this.Grid_Total.FixedObjectName_n
            for (let i = 0; i < n ; i++) {
                lef += GP.FixedObjectNameData[i].Width;
            }
            w = GP.FixedObjectNameData[n].Width;
        } else {
            lef += GP.FixedObjectNameDataWidth();
            for (let i = GP.LeftCell; i < X; i++) {
                lef += GP.DataItemData[i].Width;
            }
            w = GP.DataItemData[X].Width;
        }
        if (Y < 0) {
            n = Y + this.Grid_Total.FixedDataItem_n;
            for (let i = 0; i < n; i++) {
                tp += GP.FixedDataItemData[i].Height;
            }
            H = GP.FixedDataItemData[n].Height;
        } else {
            tp += GP.FixedDataItemHeight();
            for (let i = GP.TopCell; i < Y; i++) {
                tp += GP.CellHeight[i];
            }
            H = GP.CellHeight[Y];
        }
        Obj.style.width = (w - 1).px();
        Obj.style.left = (lef + 1).px();
        Obj.style.height = (H - 1).px();
        Obj.style.top = (tp + 1).px();
    }

    SetTextBox = (X: number, Y: number) => {
        let AL, n;
        this.Get_Object_to_Cell_Size(X, Y, this.txtTextBox as HTMLElement);
        const GP = this.Grid_Property[this.Grid_Total.Layer];
        if (X < 0) {
            n = X + this.Grid_Total.FixedObjectName_n;
            AL = GP.FixedObjectNameData[n].Allignment;
        } else {
            AL = GP.DataItemData[X].Allignment;
        }

        const tx = this.Get_Data_from_Grid(this.Grid_Total.Layer, X, Y);
        let als = "";
        switch (AL) {
            case -1:
                als = "left";
                break;
            case 1:
                als = "right";
                break;
            case 0:
                als = "center";
                break;
        }
        this.txtTextBox?.style.setProperty?.('textAlign', als);
        if (this.txtTextBox) this.txtTextBox.value = tx;
        if (this.txtTextBox?.setVisibility) {
            this.txtTextBox.setVisibility(true);
            if (this.txtTextBox.focus) this.txtTextBox.focus();
            if (this.txtTextBox.select) this.txtTextBox.select();
        }
    }

    Print_Data = (STT: string | JsonValue, Allignment: number, X: number, Y: number, CellW: number, CellHeight: number, BorderColor: colorRGBA, Fillcolor: colorRGBA, BorderWidth: number, font: Font_Property) => {
        if(STT===undefined){return;}
        if (!this.ctx) return;
        
        let ST = typeof STT === 'string' ? STT : (STT?.toString() ?? '');
        this.ctx.fillStyle = Fillcolor.toRGBA();
        this.ctx.strokeStyle = BorderColor.toRGBA();
        this.ctx.lineWidth = 0.3;
        this.ctx.fillRect(X, Y, CellW, CellHeight);
        this.ctx.strokeRect(X, Y, CellW + 1, CellHeight + 1);

        const mes = this.ctx.measureText(ST);
        const S_Size = new size(mes.width, mes.actualBoundingBoxAscent + mes.actualBoundingBoxDescent);
        const txtw = (S_Size.width);
        const txth = (S_Size.height);
        if ((txtw >= CellW - 4) && (Allignment === enmHorizontalAlignment.Center)) {
            Allignment = enmHorizontalAlignment.Left;
        }
        this.ctx.fillStyle = 'rgba(0, 0, 0)';
        switch (Allignment) {
            case enmHorizontalAlignment.Left: { //左詰
                const STP = ST.split('\n');
                if ((txtw <= CellW - 4) && (STP.length === 1)) {
                    this.ctx.fillText(ST, X + 2, Y + 2);
                } else {
                    let H = 0;
                    do {
                        let i = 1;
                        let tw;
                        let ST2 ;
                        do {
                            ST2 = ST.left(i);
                            tw = this.ctx.measureText(ST2).width;
                            i++;
                        } while ((tw < CellW - 4) && (i <= ST.length) && (ST.mid(i - 1, ST.length) !== '\n'))
                        if (tw >= CellW - 4) {
                            i--;
                        }
                        ST2 = ST.left(i - 1);
                        this.ctx.fillText(ST2, X + 2, Y + H + 2);
                        if (ST.mid(i, ST.length) !== '\n') {
                            ST = ST.mid(i - 1, ST.length)
                        } else {
                            ST = ST.mid(i, ST.length)
                        }
                        H += txth;
                    } while ((H < CellHeight - 4) && (ST !== ""))
                }
                break;
            }
            case enmHorizontalAlignment.Center:
                this.ctx.fillText(ST, X + CellW / 2 - txtw / 2, Y + 2);
                break;
            case enmHorizontalAlignment.Right: {
                if (txtw < CellW - 4) {
                    this.ctx.fillText(ST, X + CellW - 2 - txtw, Y + 2);
                } else {
                    let i = 1;
                    let tw;
                    let ST2 ;
                    do {
                        ST2 = ST.right(i);
                        tw = this.ctx.measureText(ST2).width;
                        i++;
                    } while (tw < CellW -8)
                    ST2 = ST.right(i - 1);
                    tw = this.ctx.measureText(ST2).width;
                    this.ctx.fillText(ST2, X + CellW - tw, Y + 2);
                }
                break;
            }
        }
      //  ctx.restore();
    }

    /**全体のサイズを求める */
    Print_Grid_ViewSize = () => {
        if (this.Grid_Total.LayerNum === 0) {
            this.vScroll.setVisibility(false);
            this.hScroll.setVisibility(false);
            return;
        }
        const GP = this.Grid_Property[this.Grid_Total.Layer];
        const xs = GP.Xmax;
        const ys = GP.Ymax;

        let w = GP.FixedObjectNameDataWidth();
        for (let i = 0; i < xs; i++) {
            w += GP.DataItemData[i].Width;
        }
        w += GP.DataItemData[xs - 1].Width;
        let h = GP.FixedDataItemHeight();
        for (let i = 0; i < ys; i++) {
            h += GP.CellHeight[i];
        }
       h += GP.CellHeight[ys - 1] ;
        if ((w > this.width - 2) && (h > this.height - this.tabh - 2)) {
            this.canvas.width = this.width - this.scrollSize - 2;
            this.canvas.height = this.height - this.tabh - 2 - this.scrollSize;
            this.hScroll.setVisibility(true);
            this.vScroll.setVisibility(true);
        } else if (w > this.width - 2) {
            this.canvas.width = this.width - 2;
            this.canvas.height = this.height - this.tabh - this.scrollSize - 2;
            this.vScroll.setVisibility(false);
            this.hScroll.setVisibility(true);
        } else if (h > this.height - this.tabh - 2) {
            this.canvas.width = this.width - this.scrollSize - 2;
            this.canvas.height = this.height - this.tabh - 2;
            this.vScroll.setVisibility(true);
            this.hScroll.setVisibility(false);
        } else {
            this.canvas.height = this.height - this.tabh - 2;
            this.canvas.width = this.width - 2;
            this.hScroll.setVisibility(false);
            this.vScroll.setVisibility(false);
        }
        this.ctx = this.canvas.getContext("2d");
        if (this.ctx) {
            this.ctx.font = this.defoFont;
            this.ctx.textBaseline = 'top';
        }
        this.vScroll.setMaxValue(h);
        this.hScroll.setMaxValue(w);
    }

    /**レイヤ追加（内部） */
    Insert_Layer = (LayName: string, lay: number, OriginalLayerNumber: number, xs: number, ys: number, OperationEnable: Grid_Operation_enable_info) => {
        this.Grid_Total.LayerNum++;
        this.tabMake();
        if (this.Grid_Total.LayerNum !== 1) {
            for (let i = this.Grid_Total.LayerNum - 1; i >= lay + 1; i--) {
                this.Grid_Property[i] = this.Grid_Property[i - 1].Clone();
            }
        }
        const GP = new Grid_Info(); 
        GP.OriginalLayerNumber = OriginalLayerNumber;
        GP.Grid_Text = Generic.Array2Dimension<GridTextColor_Info>(xs, ys, new GridTextColor_Info());
        GP.FixedObjectName = Generic.Array2Dimension<GridTextColor_Info>(this.Grid_Total.FixedObjectName_n, ys, new GridTextColor_Info())
        GP.FixedDataItem = Generic.Array2Dimension<GridTextColor_Info>(xs, this.Grid_Total.FixedDataItem_n, new GridTextColor_Info())
        GP.FixedUpperLeft = Generic.Array2Dimension<FixedUpperLeft_Info>(this.Grid_Total.FixedObjectName_n, this.Grid_Total.FixedDataItem_n, new FixedUpperLeft_Info())

        GP.Ope = OperationEnable;
        GP.LayerName = LayName;
        GP.LayerData = [];

        GP.Xmax = xs
        GP.Ymax = ys
        GP.CellHeight = [];
        this.Grid_Property[lay]=GP;

        this.Set_SSTAB_Name();
        if ((this.Grid_Total.Layer >= lay) && (this.Grid_Total.LayerNum > 1)) {
            this.Grid_Total.Layer++;
            this.tabbase.selectedIndex = this.Grid_Total.Layer;
        }
        this.tabSelect();
        this.Init_Grid(lay);
    }

    Set_SSTAB_Name = () => {
        for (let i = 0; i < this.Grid_Total.LayerNum; i++) {
            this.tabbase.tab[i].innerHTML = this.Grid_Property[i].LayerName;
        }
    }
    RaiseEvent = (call: Function) => {
        if(call !==undefined){

        }
    }
    rightClickmenu = (pos: point) => {
        const GPO = this.Grid_Property[this.Grid_Total.Layer].Ope;
        if(GPO.RightClickAllEnabled===false){return;}
        let udo="";
        if(this.UndoArray.length!==0){
            udo="("+this.UndoArray[this.UndoArray.length-1].caption+")";
        }
        const popmenu = [
            { caption: "元に戻す"+udo, enabled: true, event: this.Undo },
            { caption: "コピー", enabled: true, event: this.Grid_Copy },
            { caption: "貼り付け", enabled: GPO.RightClickEnabled,child:[{caption:"内部から", event: mnuPaste },{caption:"外部クリップボードから",event: mnuouterPaste}]},
            { caption: "切り取り", enabled: GPO.RightClickEnabled, event: mnuCut },
            { caption: this.Grid_Total.ColumnCaption+"数指定", enabled: GPO.GridColEnabled, event: mnuColNumber },
            { caption: this.Grid_Total.RowCaption+"数指定", enabled: GPO.GridRowEnabled, event: mnuRowNumber },
            { caption: this.Grid_Total.RowCaption+"挿入", enabled: GPO.GridColEnabled, child: [{ caption: "前に挿入", event: mnuInsertRow }, { caption: "後ろに挿入", event: mnuInsertRow }] },
            { caption: this.Grid_Total.ColumnCaption+"挿入", enabled: GPO.GridRowEnabled, child: [{ caption: "左に挿入", event: mnuInsertCOl }, { caption: "右に挿入", event: mnuInsertCOl }] },
            { caption: this.Grid_Total.RowCaption+"削除", enabled: GPO.GridColEnabled, event: mnuDeleteRow },
            { caption: this.Grid_Total.ColumnCaption+"削除", enabled: GPO.GridRowEnabled, event: mnuDeleteCol },
        ];
        Generic.ceatePopupMenu(popmenu, pos);
        const self = this;
        function mnuPaste() {
            if (self.inClipboard !== "") {
                self.Grid_Paste(self.inClipboard, false);
                return;
            }
        }
        /**外部から貼り付け */
        function mnuouterPaste(event: Event){
            self.removeEventlister();
            document.body.removeEventListener("contextmenu", contextMenuPrevent);
            self.base.removeEventListener("contextmenu", contextMenuPrevent);
            Generic.outerPaste(function (tx: string) {
                self.addDocumentEvent();
                self.base.addEventListener("contextmenu", contextMenuPrevent);
                document.body.addEventListener("contextmenu", contextMenuPrevent);
                if (tx !== "") {
                    self.inClipboard = tx;
                    self.Grid_Paste(self.inClipboard, false);
                }
            },function(){
                self.addDocumentEvent();
                self.base.addEventListener("contextmenu",contextMenuPrevent);
                document.body.addEventListener("contextmenu",contextMenuPrevent);
            });
        }

        function mnuCut() { self.Grid_Copy(); self.Grid_Clear("切り取り") }
        function mnuRowNumber() {
            const PV = self.Grid_Property[self.Grid_Total.Layer].Ymax;
            self.removeEventlister();
            Generic.prompt(undefined, self.Grid_Total.RowCaption + "数指定", String(PV), function (SF: string) {
                if (SF !== "") {
                    const convertedValue = Generic.convValue(SF);
                    const numValue = Number(convertedValue);
                    if (isNaN(numValue)) {
                        Generic.alert(undefined, convertedValue + ":数値を入力して下さい。")
                    }
                    const V = numValue;
                    const n = V - PV;
                    if ((V > 0) && (n !== 0)) {
                        if (n < 0) {
                            self.SetUndo_DeleteRows(self.Grid_Total.RowCaption + "数変更", PV + n, -n);
                            self.DeleteRows(self.Grid_Total.Layer, PV + n, -n);
                            self.Print_Grid_Data();
                            self.eventCall.evtChange_FixedXS();
                            self.eventCall.evtChange_Data();
                        } else {
                            self.InsertRows(self.Grid_Total.Layer, PV, n);
                            self.Print_Grid_Data();
                            self.eventCall.evtChange_FixedXS();
                            self.eventCall.evtChange_Data();
                        }
                    }
                    self.addDocumentEvent();
                }
            },"right",self.addDocumentEvent);
        }
        function mnuColNumber(){
            const PV = self.Grid_Property[self.Grid_Total.Layer].Xmax;
            self.removeEventlister();
            Generic.prompt(undefined, self.Grid_Total.ColumnCaption + "数指定", String(PV), function (SF: string) {
                if (SF !== "") {
                    const convertedValue = Generic.convValue(SF);
                    const numValue = Number(convertedValue);
                    if (isNaN(numValue)) {
                        Generic.alert(undefined, convertedValue + ":数値を入力して下さい。")
                    }
                    const V = numValue;
                    const n = V - PV;
                    if ((V > 0) && (n !== 0)) {
                        if (n < 0) {
                            self.SetUndo_DeleteColumns(self.Grid_Total.ColumnCaption + "数指定", PV + n, -n)
                            self.DeleteColumns(self.Grid_Total.Layer, PV + n, -n);
                            self.Print_Grid_Data();
                            self.eventCall.evtChange_FixedYS();
                            self.eventCall.evtChange_Data();
                        } else {
                            self.SetUndo_InsertColumns(self.Grid_Total.ColumnCaption + "数指定", PV, n)
                            self.InsertColumns(self.Grid_Total.Layer, PV, n);
                            self.Print_Grid_Data();
                            self.eventCall.evtChange_FixedYS();
                            self.eventCall.evtChange_Data();
                        }
                    }
                    self.addDocumentEvent();
                }
            },"right",self.addDocumentEvent);
        }

        function mnuInsertRow(e: Event) {
            const GP = self.Grid_Property[self.Grid_Total.Layer];
            let ip;
            const rect = GP.MouseUpDownRect();
            if (rect.top < 0) { return; }
            const r = rect.bottom - rect.top + 1;
            if (e.caption === "後ろに挿入") {
                ip = rect.top + 1;
            } else {
                ip = rect.top;
                GP.MouseDownY = GP.MouseDownY + r;
                GP.MouseUpY = GP.MouseUpY + r;
            }

            self.SetUndo_InsertRows(self.Grid_Total.RowCaption + "挿入", ip, r);
            self.InsertRows(self.Grid_Total.Layer, ip, r);
            self.eventCall.evtChange_FixedXS();
            self.eventCall.evtChange_Data()
            self.Print_Grid_Data();
        }
        function mnuInsertCOl(e: Event) {
            const GP = self.Grid_Property[self.Grid_Total.Layer];
            const rect = GP.MouseUpDownRect();
            if (rect.left < 0) {
                return;
            }

            let ip;
            const r = rect.right - rect.left + 1;
            if (e.caption === "右に挿入") {
                ip = rect.right + 1;
            } else {
                ip = rect.left;
                GP.MouseDownX = GP.MouseDownX + r;
                GP.MouseUpX = GP.MouseUpX + r;
            }
           　self.SetUndo_InsertColumns("列挿入", ip, r);
            self.InsertColumns(self.Grid_Total.Layer, ip, r);
            self.eventCall.evtChange_FixedYS();
            self.eventCall.evtChange_Data();
            self.Print_Grid_Data()
        }
        function mnuDeleteCol() {
            const GP = self.Grid_Property[self.Grid_Total.Layer];
            const rect = GP.MouseUpDownRect();
            const r1 = rect.left;
            const r2 = rect.right;
            const r = r2 - r1 + 1;
            if ((r1 < 0) || (r === GP.Xmax)) { return; }
            self.SetUndo_DeleteColumns(self.Grid_Total.ColumnCaption + "削除", r1, r);
            self.DeleteColumns(self.Grid_Total.Layer, r1, r);
            if ((GP.Xmax <= GP.MouseUpX)) {
                GP.MouseUpX = GP.Xmax - 1;
            }
            if ((GP.Xmax <= GP.MouseDownX)) {
                GP.MouseDownX = GP.Xmax - 1;
            }
            self.Print_Grid_Data();
            self.eventCall.evtChange_FixedYS();
            self.eventCall.evtChange_Data();
        }
        function mnuDeleteRow() {
            const GP = self.Grid_Property[self.Grid_Total.Layer];
            const rect = GP.MouseUpDownRect();
            const r1 = rect.top;
            const r2 = rect.bottom;
            const r = r2 - r1 + 1;
            if ((r1 < 0) || (r === GP.Ymax)) { return; }
            self.SetUndo_DeleteRows(self.Grid_Total.RowCaption + "削除", r1, r)
            self.DeleteRows(self.Grid_Total.Layer, r1, r);
            if ((GP.Ymax <= GP.MouseUpY)) {
                GP.MouseUpY = GP.Ymax - 1;
            }
            if ((GP.Xmax <= GP.MouseDownY)) {
                GP.MouseDownY = GP.Ymax - 1;
            }
            self.Print_Grid_Data();
            self.eventCall.evtChange_FixedXS();
            self.eventCall.evtChange_Data();
        }
    }
    /**レイヤのグリッド初期化 */
    Init_Grid = (L: number) => {
        const GP = this.Grid_Property[L];
        GP.DataItemData = [];
        GP.CellHeight = [];
        GP.FixedObjectNameData = [];
        GP.FixedDataItemData = [];
        GP.SelectedF = false;
        GP.TopCell=0;
        GP.LeftCell=0;
        
        GP.scrollTop=0;
        GP.scrollLeft=0;
        const xs = GP.Xmax;
        const ys = GP.Ymax;
        GP.GridLineCol = this.Grid_Total.Color.GridLine.Clone();

        for (let i = 0; i < ys; i++) {
            for (let j = 0; j < xs; j++) {
                GP.Grid_Text[j][i] = new GridTextColor_Info();
            }
        }

        for (let i = 0; i < ys; i++) {
            GP.CellHeight[i] = this.defoCellHeight;
        }

        for (let i = 0; i < xs; i++) {
            for (let j = 0; j < this.Grid_Total.FixedDataItem_n; j++) {
                GP.FixedDataItem[i][j] = new GridTextColor_Info();
            }
        }
        for (let i = 0; i < this.Grid_Total.FixedObjectName_n; i++) {
            for (let j = 0; j < ys; j++) {
                GP.FixedObjectName[i][j] = new GridTextColor_Info();
            }
        }

        for (let i = 0; i < this.Grid_Total.FixedObjectName_n; i++) {
            for (let j = 0; j < this.Grid_Total.FixedDataItem_n; j++) {
                GP.FixedUpperLeft[i][j] = new FixedUpperLeft_Info();
            }
        }
        for (let i = 0; i < this.Grid_Total.FixedDataItem_n; i++) {            
            const GPF =new FixedDataItemData_Info();
            GPF.Height = this.defoCellHeight;
            if (i === 0) {
                GPF.Allignment = this.Grid_Total.DefaultNumberingAlligntment;
            } else {
                GPF.Allignment = this.Grid_Total.DefaultFixedYSAllignment;
            }
            GP.FixedDataItemData[i]=GPF;
        }

        for (let i = 0; i < xs; i++) {
            const GPF =new CellData_Info(); 
            GPF.Width = this.Grid_Total.DefaultGridWidth;
            GPF.Allignment = this.Grid_Total.DefaultGridAlligntment;
            GP.DataItemData[i]=GPF;
        }

        for (let i = 0; i < this.Grid_Total.FixedObjectName_n; i++) {
            const GPF =new FixedObjectNameData_Info();
            if (i === 0) {
                GPF.Width = this.Grid_Total.DefaultFixedXNumberingWidth;
                GPF.Allignment = this.Grid_Total.DefaultNumberingAlligntment;
            } else {
                GPF.Width = this.Grid_Total.DefaultFixedXWidth;
                GPF.Allignment = this.Grid_Total.DefaultFixedXSAllignment;
            }
            GP.FixedObjectNameData[i] = GPF;
        }

        GP.FixedUpperLeftAllignment = this.Grid_Total.DefaultFixedUpperLeftAlligntment;
        this.txtTextBox.style.font = this.Grid_Total.GridFont;
        this.txtTextBox.style.backgroundColor = this.Grid_Total.Color.TextBox.toHex();
        this.Set_FixedCell_Words(L);
    }

    /**document要素のイベントを追加  */
    addDocumentEvent = () => {
        document.addEventListener("mousemove", this.mmove, false);
        document.addEventListener("mouseup", this.mup, false);
        document.addEventListener('keydown', this.keydown, false);
        this.vScroll.addEventlister();
        this.hScroll.addEventlister();
    }
    removeEventlister = () => {
        document.removeEventListener("mousemove", this.mmove, false);
        document.removeEventListener("mouseup", this.mup, false);
        document.removeEventListener("keydown", this.keydown, false);
        this.vScroll.removeEventlister();
        this.hScroll.removeEventlister();
    }
    // Alias for addDocumentEvent
    addEventlister = () => {
        this.addDocumentEvent();
    }

    /** 行削除*/
    DeleteRows = (GridLay: number, DeletePoint: number, DeleteNum: number) => {

        //データ部分を削除
        const GP = this.Grid_Property[GridLay];
        const oldYs = GP.Ymax;
        const ys = GP.Ymax - DeleteNum;
        GP.Ymax = ys;
        let xs = GP.Xmax;

        for (let j = DeletePoint + DeleteNum; j < oldYs; j++) {
            GP.CellHeight[j - DeleteNum] = GP.CellHeight[j];
        }
        GP.CellHeight.length = ys;
        let GTempText = Generic.Array2Clone(GP.Grid_Text);
        GP.Grid_Text = Generic.Array2Dimension<GridTextColor_Info>(xs, ys, new GridTextColor_Info());
        for (let i = 0; i < xs; i++) {
            for (let j = 0; j < DeletePoint; j++) {
                GP.Grid_Text[i][j] = GTempText[i][j];
            }
            for (let j = DeletePoint + DeleteNum; j < oldYs; j++) {
                GP.Grid_Text[i][ j - DeleteNum] = GTempText[i][j];
            }
        }

        //オブジェクト名部分を削除
         GTempText = Generic.Array2Clone(GP.FixedObjectName);
         xs = this.Grid_Total.FixedObjectName_n;
        GP.FixedObjectName = Generic.Array2Dimension<GridTextColor_Info>(xs, ys, new GridTextColor_Info());
        for (let i = -xs; i <= -1; i++) {
            for (let j = 0; j < DeletePoint; j++) {
                GP.FixedObjectName[i + xs][j] = GTempText[i + xs][j];
            }
            for (let j = DeletePoint + DeleteNum; j < oldYs; j++) {
                GP.FixedObjectName[i + xs][j - DeleteNum] = GTempText[i + xs][j];
            }
        }
        this.Set_FixedCell_Words(GridLay);
        this.Print_Grid_ViewSize();
    }

    InsertRows = (GridLay: number, InsertPoint: number, InsertNum: number) => {
        /** データ部分を挿入*/
        const GP = this.Grid_Property[GridLay];
        const oldYs = GP.Ymax;
        const ys = GP.Ymax + InsertNum;
        GP.Ymax = ys;
        let xs = GP.Xmax;
        let GTempText = Generic.Array2Clone(GP.Grid_Text);
        GP.Grid_Text = Generic.Array2Dimension<GridTextColor_Info>(xs, ys, new GridTextColor_Info());
        const refPoint = (InsertPoint !== oldYs) ? InsertPoint : InsertPoint - 1;
        for (let i = 0; i < xs; i++) {
            for (let j = 0; j < InsertPoint; j++) {
                GP.Grid_Text[i][j] = GTempText[i][j];
            }
            for (let j = 0; j < InsertNum; j++) {
                GP.Grid_Text[i][j + InsertPoint] = GTempText[i][refPoint].Clone();
                GP.Grid_Text[i][j + InsertPoint].Text = "";
            }
            for (let j = InsertPoint; j < oldYs; j++) {
                GP.Grid_Text[i][j + InsertNum] = GTempText[i][j];
            }
        }

        if (InsertPoint === oldYs) {
            for (let i = InsertPoint; i < InsertPoint + InsertNum; i++) {
                GP.CellHeight[i] = GP.CellHeight[InsertPoint - 1];
            }
        } else {
            for (let j = oldYs - 1; j >= InsertPoint; j--) {
                GP.CellHeight[j + InsertNum] = GP.CellHeight[j]
            }
            for (let j = InsertPoint + 1; j < InsertPoint + InsertNum; j++) {
                GP.CellHeight[j] = GP.CellHeight[InsertPoint];
            }
        }

        //オブジェクト名部分を挿入
        xs = this.Grid_Total.FixedObjectName_n
        GTempText = Generic.Array2Clone(GP.FixedObjectName);
        GP.FixedObjectName = Generic.Array2Dimension<GridTextColor_Info>(xs, ys, new GridTextColor_Info());
        for (let i = -xs; i <= -1; i++) {
            for (let j = 0; j < InsertPoint; j++) {
                GP.FixedObjectName[i + xs][j] = GTempText[i + xs][j];
            }
            for (let j = 0; j < InsertNum; j++) {
                GP.FixedObjectName[i + xs][j + InsertPoint] = GTempText[i + xs][refPoint].Clone();
                GP.FixedObjectName[i + xs][j + InsertPoint].Text = "";
            }
            for (let j = InsertPoint; j < oldYs; j++) {
                GP.FixedObjectName[i + xs][j + InsertNum] = GTempText[i + xs][j];
            }
        }
        this.Set_FixedCell_Words(GridLay);
        this.Print_Grid_ViewSize();
    }

    DeleteColumns = (GridLay: number, DeletePoint: number, DeleteNum: number) => {

        //データ部分を挿入
        const GP = this.Grid_Property[GridLay];
        const oldXs = GP.Xmax;
        let ys = GP.Ymax;
        const xs = GP.Xmax - DeleteNum;
        GP.Xmax = xs;

        let GTempText = Generic.Array2Clone(GP.Grid_Text);
        GP.Grid_Text = Generic.Array2Dimension<GridTextColor_Info>(xs, ys, new GridTextColor_Info());
        for (let i = 0; i < ys; i++) {
            for (let j = 0; j < DeletePoint; j++) {
                GP.Grid_Text[j][i] = GTempText[j][i];
            }
            for (let j = DeletePoint + DeleteNum; j < oldXs; j++) {
                GP.Grid_Text[j - DeleteNum][ i] = GTempText[j][i];
            }
        }

        for (let j = DeletePoint + DeleteNum; j < oldXs; j++) {
            GP.DataItemData[j - DeleteNum] = GP.DataItemData[j];
        }
        GP.DataItemData.length = xs;

        //データ項目部分を削除
         ys = this.Grid_Total.FixedDataItem_n
        GTempText = Generic.Array2Clone(GP.FixedDataItem);
        GP.FixedDataItem = Generic.Array2Dimension<GridTextColor_Info>(xs, ys, new GridTextColor_Info());
        for (let i = -ys; i <= -1; i++) {
            for (let j = 0; j < DeletePoint; j++) {
                GP.FixedDataItem[j][i + ys] = GTempText[j][i + ys];
            }
            for (let j = DeletePoint + DeleteNum; j < oldXs; j++) {
                GP.FixedDataItem[j - DeleteNum][i + ys] = GTempText[j][i + ys];
            }
        }
        this.Set_FixedCell_Words(GridLay);
        this.Print_Grid_ViewSize();
    }

    InsertColumns = (GridLay: number, InsertPoint: number, InsertNum: number) => {

        //データ部分を挿入
        let GP = this.Grid_Property[GridLay];
        const oldXs = GP.Xmax;
        let ys = GP.Ymax;
        const xs = GP.Xmax + InsertNum;
        GP.Xmax = xs;
        let GTempText = Generic.Array2Clone(GP.Grid_Text);
        GP.Grid_Text = Generic.Array2Dimension<GridTextColor_Info>(xs, ys, new GridTextColor_Info());
        const refPoint = (InsertPoint !== oldXs) ? InsertPoint : InsertPoint - 1;
        for (let i = 0; i < ys; i++) {
            for (let j = 0; j < InsertPoint; j++) {
                GP.Grid_Text[j][i] = GTempText[j][i];
            }
            for (let j = 0; j < InsertNum; j++) {
                GP.Grid_Text[j + InsertPoint][ i] = GTempText[refPoint][i].Clone();
                GP.Grid_Text[j + InsertPoint][ i].Text="";
            }
            for (let j = InsertPoint; j < oldXs; j++) {
                GP.Grid_Text[j + InsertNum][ i] = GTempText[j][i];
            }
        }

        if (InsertPoint === oldXs) {
            for (let i = InsertPoint; i < InsertPoint + InsertNum; i++) {
                GP.DataItemData[i] = GP.DataItemData[InsertPoint - 1].Clone();
            }
        } else {
            for (let j = oldXs - 1; j >= InsertPoint; j--) {
                GP.DataItemData[j + InsertNum] = GP.DataItemData[j];
            }
            for (let j = 0; j < InsertNum; j++) {
                GP.DataItemData[j] = GP.DataItemData[refPoint].Clone();
                // CellData_InfoにはTextプロパティがないため削除
            }
            for (let j = InsertPoint + 1; j < InsertPoint + InsertNum; j++) {
                GP.DataItemData[j] = GP.DataItemData[InsertPoint].Clone();
            }
        }

        //データ項目部分を挿入
        GP = this.Grid_Property[GridLay];
         ys = this.Grid_Total.FixedDataItem_n
        GTempText = Generic.Array2Clone(GP.FixedDataItem);
        GP.FixedDataItem = Generic.Array2Dimension<GridTextColor_Info>(xs, ys, new GridTextColor_Info());
        for (let i = -ys; i <= -1; i++) {
            for (let j = 0; j < InsertPoint; j++) {
                GP.FixedDataItem[j][i + ys] = GTempText[j][i + ys];
            }
            for (let j = 0; j < InsertNum; j++) {
                GP.FixedDataItem[j + InsertPoint][ i + ys] = GTempText[refPoint][i + ys].Clone();
                GP.FixedDataItem[j + InsertPoint][ i + ys].Text="";
            }
            for (let j = InsertPoint; j < oldXs; j++) {
                GP.FixedDataItem[j + InsertNum][ i + ys] = GTempText[j][i + ys];
            }
        }
        this.Set_FixedCell_Words(GridLay);
        this.Print_Grid_ViewSize();
    }

    /** 固定行・列に番号をふる */
    Set_FixedCell_Words = (L: number) => {
        const GP = this.Grid_Property[L];
        if (this.Grid_Total.FixedObjectName_n > 0) {
            for (let i = 0; i < GP.Ymax; i++) {
                 this.Set_Data_To_Grid(L, -this.Grid_Total.FixedObjectName_n, i, (i + 1).toString(), false)
            }
        }
        if (this.Grid_Total.FixedDataItem_n2 > 0) {
            for (let i = 0; i < GP.Xmax; i++) {
                 this.Set_Data_To_Grid(L, i, -this.Grid_Total.FixedDataItem_n, (i + 1).toString(), false)
            }
        }
    }

    /**指定された位置のグリッド配列にﾃﾞｰﾀをｾｯﾄする Check_F:変更できるかどうかチェックする */
    Set_Data_To_Grid = ( Grid_Lay: number ,  X: number ,  Y: number ,  tx: string ,  Check_F: boolean ) => {
        if (Check_F === true) {
            const gpo = this.Grid_Property[this.Grid_Total.Layer].Ope;
            if (((Y < 0) && (X >= 0)) && (gpo.FixedYSEnabled === false) ||
                ((X < 0) && (Y >= 0)) && (gpo.FixedXSEnabled === false) ||
                ((X < 0) && (Y < 0)) && (gpo.FixedUpperLeftEnabeld === false)) {
                return;
            }
        }
        const gp = this.Grid_Property[Grid_Lay];
        if ((X < 0) && (Y < 0)) {
            gp.FixedUpperLeft[X + this.Grid_Total.FixedObjectName_n][ Y + this.Grid_Total.FixedDataItem_n].Text = tx;
        } else if (X < 0) {
            gp.FixedObjectName[X + this.Grid_Total.FixedObjectName_n][ Y].Text = tx;
        } else if (Y < 0) {
            gp.FixedDataItem[X][ Y + this.Grid_Total.FixedDataItem_n].Text = tx;
        } else {
            gp.Grid_Text[X][Y].Text = tx;
        }
    }

    Get_XYData = (Layer: number, X: number, Y: number) => {
        const GP = this.Grid_Property[Layer];
        if ((X < 0) && (Y < 0)) {
            return GP.FixedUpperLeft[X + this.Grid_Total.FixedObjectName_n][Y + this.Grid_Total.FixedDataItem_n].Text;
        } else if (X < 0) {
            return GP.FixedObjectName[X + this.Grid_Total.FixedObjectName_n][Y].Text;
        } else if (Y < 0) {
            return  GP.FixedDataItem[X][Y + this.Grid_Total.FixedDataItem_n].Text;
        } else {
            return  GP.Grid_Text[X][Y].Text;
        }
    }

Grid_Copy = () => {
    this.picGrid.style.cursor = 'wait';

    const GP = this.Grid_Property[this.Grid_Total.Layer];
        let sb = "";
        const rect = GP.MouseUpDownRect();
        const r1 = Math.max(-this.Grid_Total.FixedObjectName_n + this.Grid_Total.FixedObjectName_n2, rect.left)
        const r2 = rect.right
        const c1 = Math.max(-this.Grid_Total.FixedDataItem_n + this.Grid_Total.FixedDataItem_n2, rect.top)
        const c2 = rect.bottom
        for (let i = c1; i <= c2; i++) {
            for (let j = r1; j <= r2; j++) {
                let PlusCell = this.Get_Data_from_Grid(this.Grid_Total.Layer, j, i);
                if (PlusCell.indexOf("\n") !== -1) {
                    //改行が含まれるセルは""で囲む
                    PlusCell = '"' + PlusCell + '"';
                }
                sb += PlusCell;
                if (j !== r2) {
                    sb += '\t';
                }
            }
            if (c1 !== c2) {
                sb += '\n';
            }
        }
        if (sb.length !== 0) {
            Generic.copyText(sb);
            this.inClipboard = sb;
        }
        this.picGrid.style.cursor = 'default';
    }

    /** 切り取り、貼り付け、入力、クリアのアンドゥセット*/
    SetUndo_CopyPasteCutClear = (Caption: string) => {
        const rect = this.Grid_Property[this.Grid_Total.Layer].MouseUpDownRect();
        let sb = "";
        for (let i = rect.top; i <= rect.bottom; i++) {
            for (let j = rect.left; j <= rect.right; j++) {
                sb += this.Get_Data_from_Grid(this.Grid_Total.Layer, j, i);
                sb += "\t";
            }
        }
        const UndoInput = new Undo_InputCopyPasteClearInfo();
        UndoInput.Layer = this.Grid_Total.Layer;
        UndoInput.GridData = sb;
        UndoInput.Rect = rect.Clone();
        UndoInput.caption = Caption;
        this.UndoArray.push(UndoInput);
    }

    SetUndo_ChangeRowHeight = (Layer: number, top: number, bottom: number) => {
        const UndoData = new Undo_ChangeRowHeight();
        const oldH = [];
        const GP = this.Grid_Property[Layer];
        for (let i = top; i <= bottom; i++) {
            if (i < 0) {
                oldH[i - top] = GP.FixedDataItemData[i + this.Grid_Total.FixedDataItem_n].Height;
            } else {
                oldH[i - top] = GP.CellHeight[i];
            }
        }
        UndoData.caption = "高さ変更";
        UndoData.Layer = Layer;
        UndoData.Height = oldH;
        UndoData.Top = top;
        UndoData.Bottom = bottom;
        this.UndoArray.push(UndoData);
    }
    SetUndo_Input = (X: number, Y: number, Caption: string) => {
        const UndoData = new Undo_InputCopyPasteClearInfo();
        UndoData.Layer = this.Grid_Total.Layer;
        UndoData.GridData = this.Get_Data_from_Grid(this.Grid_Total.Layer, X, Y);
        const rect = new rectangle(X, X, Y, Y);
        UndoData.Rect = rect;
        UndoData.caption = Caption;
        this.UndoArray.push(UndoData);
    }

    SetUndo_InsertRows = (Caption: string , y: number , InsertNum: number ) => {
        //行挿入
        const UndoData = new Undo_InsertRows();
        UndoData.caption = Caption;
        UndoData.Top = y;
        UndoData.Bottom = y + InsertNum - 1;
        UndoData.Layer = this.Grid_Total.Layer;
        this.UndoArray.push(UndoData)
    }
    
    SetUndo_InsertColumns = (Caption: string, x: number, InsertNum: number) => {
        //列挿入
        const UndoData = new Undo_InsertColumns();
        UndoData.caption = Caption;
        UndoData.Left = x;
        UndoData.Right = x + InsertNum - 1;
        UndoData.Layer = this.Grid_Total.Layer;
        this.UndoArray.push(UndoData);
    }

    // 行削除のundo
    SetUndo_DeleteRows = (Caption: string, Y: number, DeleteNum: number) => {
        let sb = "";
        for (let i = Y; i < Y + DeleteNum; i++) {
            for (let j = -this.Grid_Total.FixedObjectName_n; j < this.Grid_Property[this.Grid_Total.Layer].Xmax; j++) {
                sb += this.Get_Data_from_Grid(this.Grid_Total.Layer, j, i) + "\t";
            }
        }
        const UndoData = new Undo_DeleteRows();
        UndoData.Top = Y;
        UndoData.Bottom = Y + DeleteNum - 1;
        UndoData.caption = Caption;
        UndoData.Layer = this.Grid_Total.Layer;
        UndoData.GridData = sb;
        this.UndoArray.push(UndoData);
    }

    ////// 列削除のundo
    SetUndo_DeleteColumns = (Caption: string, X: number, DeleteNum: number) => {
        let sb = "";
        for (let i = -this.Grid_Total.FixedDataItem_n; i < this.Grid_Property[this.Grid_Total.Layer].Ymax;i++) {
            for (let j = X; j < X + DeleteNum; j++) {
                sb += this.Get_Data_from_Grid(this.Grid_Total.Layer, j, i) + "\t";
            }
        }
        const UndoData = new Undo_DeleteColumns();
        UndoData.Left = X;
        UndoData.Right = X + DeleteNum - 1;
        UndoData.caption = Caption;
        UndoData.Layer = this.Grid_Total.Layer;
        UndoData.GridData = sb;
        this.UndoArray.push(UndoData);
    }

    Grid_Paste = (clipText: string, UndoMode_Flag: boolean) => {

        const GP = this.Grid_Property[this.Grid_Total.Layer];

        //クリップボードのデータ分解
        if (clipText.right(1) === '\n') {
            clipText = clipText.left(clipText.length - 1);
        }
        const pastData: string[][] = [];
        let dbq = false;
        pastData[0] = [];
        let Yn = 0;
        let Xn = 0;
        let startp = 0;
        let endf = false;
        for (let i = 0; i < clipText.length; i++) {
            const tx = clipText.mid(i, 1)
            endf = false;
            if (tx === '"') {
                if (dbq === true) {
                    dbq = false;
                } else {
                    dbq = true;
                }
            } else if (tx === '\t') {
                let ptx = clipText.mid(startp, i - startp);
                startp = i + 1;
                if (ptx.indexOf('\n') !== -1) {
                    ptx = ptx.mid(1, ptx.length - 2);
                }
                pastData[Yn].push(ptx);
                endf = true;
            } else if (tx === '\n') {
                if (dbq === false) {
                    const ptx = clipText.mid(startp, i - startp);
                    startp = i + 1;
                    pastData[Yn].push(ptx);
                    Xn = Math.max(Xn, pastData[Yn].length);
                    Yn++;
                    pastData[Yn] = [];
                    endf = true;
                }
            }
        }
        if (endf === false) {
            const ptx = clipText.mid(startp, undefined);
            pastData[Yn].push(ptx)
            Xn = Math.max(Xn, pastData[Yn].length);
            Yn++;
        }

        for (let i = 0; i < Yn; i++) {
            for (let j = pastData[i].length; j < Xn; j++) {
                pastData[i].push("");
            }
        }

        const ygmax = GP.Ymax;
        const xgmax = GP.Xmax;
        const rect = GP.MouseUpDownRect();
        const gt = this.Grid_Total;
        const xg = Math.max(-gt.FixedObjectName_n + gt.FixedObjectName_n2, rect.left);
        const yg = Math.max(-gt.FixedDataItem_n + gt.FixedDataItem_n2, rect.top);
        const xg2 = Math.max(-gt.FixedObjectName_n + gt.FixedObjectName_n2, rect.right);
        const yg2 = Math.max(-gt.FixedDataItem_n + gt.FixedDataItem_n2, rect.bottom);
        const ygs = yg2 - yg + 1;
        const xgs = xg2 - xg + 1;

        if (yg + Yn - 1 >= ygmax) {
            Yn = ygmax - yg;
        }
        if (xg + Xn - 1 >= xgmax) {
            Xn = xgmax - xg;
        }

        let f = true;
        if ((Yn === 1) && (Xn === 1)) {
            if (UndoMode_Flag === false) {
                this.SetUndo_CopyPasteCutClear("貼り付け");
            }
            for (let i = yg; i <= yg2; i++) {
                for (let j = xg; j <= xg2; j++) {
                    this.Set_Data_To_Grid(this.Grid_Total.Layer, j, i, pastData[0][0], true);
                }
            }
            Xn = xgs;
            Yn = ygs;
        } else if (((ygs === 1) && (xgs === 1)) || ((Xn === xgs) && (Yn === ygs))) {
            if (UndoMode_Flag === false) {
                GP.MouseDownX = xg;
                GP.MouseDownY = yg;
                GP.MouseUpX = xg + Xn - 1;
                GP.MouseUpY = yg + Yn - 1;
                this.SetUndo_CopyPasteCutClear("貼り付け")
            }
            for (let i = 0; i < Yn; i++) {
                for (let j = 0; j < Xn; j++) {
                    this.Set_Data_To_Grid(this.Grid_Total.Layer, j + xg, i + yg, pastData[i][j], true)
                }
            }
        } else if ((xgs === 1) && (ygs > 1) && (Yn === 1) && (Xn > 1)) {
            if (UndoMode_Flag === false) {
                GP.MouseDownX = xg;
                GP.MouseDownY = yg;
                GP.MouseUpX = xg + Xn - 1;
                GP.MouseUpY = yg + ygs - 1;
                this.SetUndo_CopyPasteCutClear("貼り付け");
            }
            for (let i = 0; i < ygs; i++) {
                for (let j = 0; j < Xn; j++) {
                    this.Set_Data_To_Grid(this.Grid_Total.Layer, j + xg, i + yg, pastData[i][j], true);
                }
            }
            Yn = ygs;
        } else if ((ygs === 1) && (xgs > 1) && (Xn === 1) && (Yn > 1)) {
            if (UndoMode_Flag === false) {
                GP.MouseDownX = xg;
                GP.MouseDownY = yg;
                GP.MouseUpX = xg + xgs - 1;
                GP.MouseUpY = yg + Yn - 1;
                this.SetUndo_CopyPasteCutClear("貼り付け");
            }
            for (let i = 0; i < xgs; i++) {
                for (let j = 0; j < Yn; j++) {
                    this.Set_Data_To_Grid(this.Grid_Total.Layer, i + xg, j + yg, pastData[j][0], true);
                }
            }
            Xn = xgs;
        } else if ((xgs === 1) && (ygs === Yn)){
            if (UndoMode_Flag === false) {
                GP.MouseDownX = xg;
                GP.MouseDownY = yg;
                GP.MouseUpX = xg + Xn - 1;
                GP.MouseUpY = yg + ygs - 1;
                this.SetUndo_CopyPasteCutClear("貼り付け");
            }
            for (let i = 0; i < Yn; i++) {
                for (let j = 0; j < Xn; j++) {
                    this.Set_Data_To_Grid(this.Grid_Total.Layer, j + xg, i + yg, pastData[i][j], true);
                }
            }
        } else if ((ygs === 1) && (xgs === Xn)) {
            if (UndoMode_Flag === false) {
                GP.MouseDownX = xg;
                GP.MouseDownY = yg;
                GP.MouseUpX = xg + xgs - 1;
                GP.MouseUpY = yg + Yn - 1;
                this.SetUndo_CopyPasteCutClear("貼り付け")
            }
            for (let i = 0; i < Yn; i++) {
                for (let j = 0; j < Xn; j++) {
                    this.Set_Data_To_Grid(this.Grid_Total.Layer, j + xg, i + yg, pastData[i][j], true);
                }
            }
        } else {
            Generic.alert (undefined,"この形状には対応していません。");
            f = false;
        }

        if (f === true) {
            this.Print_Grid_Data();
            this.Check_ChangeEventRange(xg, yg, Xn, Yn);
        }
    }
    Check_ChangeEvent = (X: number , Y: number ) => {
    let f = false;
    const GPo= this.Grid_Property[this.Grid_Total.Layer].Ope;
        if((X < 0 )&&( Y >= 0 )&&(GPo.FixedXSEnabled === true) ){
            this.eventCall.evtChange_FixedXS?.();
            f = true;
        }
        if((Y < 0 )&&( X >= 0 )&&(GPo.FixedYSEnabled === true) ){
            this.eventCall.evtChange_FixedYS?.();
            f = true;
        }
        if((Y < 0 )&&( X < 0 )&&(GPo.FixedUpperLeftEnabeld === true )){
            this.eventCall.evtChange_FixedUpperLeft?.();
            f = true;
        }
        if((f === false )&&(GPo.InputEnabled === true )){
            this.eventCall.evtChange_Data?.();
        }
}

Check_ChangeEventRange = (X: number , Y: number , Xn: number , Yn: number ) => {
    const GPo= this.Grid_Property[this.Grid_Total.Layer].Ope;
        if((Y < 0 )&&( X < 0 )&&(GPo.FixedUpperLeftEnabeld === true )){
            this.eventCall.evtChange_FixedUpperLeft?.();
        }
        if((X < 0 )&&( 0 <= Y + Yn - 1 )&&(GPo.FixedXSEnabled === true )){
            this.eventCall.evtChange_FixedXS?.();
        }
        if((Y < 0 )&&( 0 <= X + Xn - 1 )&&(GPo.FixedYSEnabled === true )){
            this.eventCall.evtChange_FixedYS?.();
        }
        if((0 <= X + Xn - 1 )&&( 0 <= Y + Yn - 1) ){
            if(GPo.InputEnabled === true ){
                this.eventCall.evtChange_Data?.();
            }
        }

}
    tabInit = () => {
        this.tabbase.frame = Generic.createNewDiv(this.base, "", "", "", 0, 0, this.width, this.tabh, "", "");
        this.tabbase.tab = [];
        this.tabbase.tabListBase = Generic.createNewDiv(this.tabbase.frame, "", "", "", 0, 0, this.width - this.tabArrowW*2 , this.tabh, "", undefined);
        this.tabbase.moveDiv = Generic.createNewDiv(this.tabbase.frame, "", "", "", this.width - this.tabArrowW*2 , 0, this.tabArrowW*2  , this.tabh + 1, "user-select:none;cursor:default;z-index:100;background-color:white", undefined);
        this.tabbase.moveLeft = Generic.createNewDiv(this.tabbase.moveDiv as HTMLElement, "", "", "", 0, 0, this.tabArrowW, this.tabh, "cursor:pointer", undefined);
        this.tabbase.moveLeft.onclick = () => {
            let x = this.tabbase.tabListBase.style.left.removePx() + this.tabw / 2;
            x = Math.min(x, 0);
            this.tabbase.tabListBase.style.left = x.px()
        };
        const moveLeftCanvas = Generic.createNewCanvas(this.tabbase.moveLeft, "", "", 0, 0, this.tabArrowW, this.tabh, undefined, "");
        const ctxl = moveLeftCanvas.getContext("2d");
        const cx = this.tabArrowW / 2;
        const cy = this.tabh / 2;
        ctxl.fillStyle = 'gray';
        ctxl.beginPath();
        ctxl.moveTo(cx - this.tabh / 2, cy);
        ctxl.lineTo(cx + this.tabh / 2, 2);
        ctxl.lineTo(cx + this.tabh / 2, this.tabh - 2);
        ctxl.closePath();
        ctxl.fill();
        this.tabbase.moveRight = Generic.createNewDiv(this.tabbase.moveDiv, "", "", "", this.tabArrowW, 0, this.tabArrowW, this.tabh, "cursor:pointer", undefined);
        this.tabbase.moveRight.onclick = () => {
            let x = this.tabbase.tabListBase.style.left.removePx() - this.tabw / 2;
            x = Math.max(x, -this.tabw * (this.tabbase.tab.length - 1));
            this.tabbase.tabListBase.style.left = x.px()
        };
        const moveRightCanvas = Generic.createNewCanvas(this.tabbase.moveRight, "", "", 0, 0, this.tabArrowW, this.tabh, undefined, "");
        const ctxr = moveRightCanvas.getContext("2d");
        ctxr.fillStyle = 'gray';
        ctxr.beginPath();
        ctxr.moveTo(cx + this.tabh / 2, cy);
        ctxr.lineTo(cx - this.tabh / 2, 2);
        ctxr.lineTo(cx - this.tabh / 2, this.tabh - 2);
        ctxr.closePath();
        ctxr.fill();

    }
    tabMake = () => {
        const oldn = this.tabbase.tab.length;
        if (oldn < this.Grid_Total.LayerNum) {
            for (let i = oldn; i < this.Grid_Total.LayerNum; i++) {
                const tab = Generic.createNewDiv(this.tabbase.tabListBase, "", "", "", i * this.tabw, 0, this.tabw, this.tabh,
                    "font-size:14px;user-select: none; border:solid 1px;border-color:#666666;white-space:pre;overflow:hidden;line-height:" + (this.tabh - 2).px(), undefined);
                    tab.addEventListener("mousedown",this.tabMouseDown as EventListener, false);
                    tab.addEventListener("touchend",this.tabTouchend, false)
                tab.style.backgroundColor = "#e1e1e1";
                tab.align = 'center';
                tab.tag = i;
                this.tabbase.tab.push(tab);
            }
        } else if (this.Grid_Total.LayerNum < oldn) {
            for (let i = this.Grid_Total.LayerNum; i < oldn; i++) {
                this.tabbase.tabListBase.removeChild(this.tabbase.tab[i]);
            }
            this.tabbase.tab.length = this.Grid_Total.LayerNum;
        }
    }

    /**タブクリック */
    tabMouseDown = (e: MouseEvent) => {
        //マウスダウンでレイヤ移動
        if (this.txtTextBox?.getVisibility?.() === true) {
            if (this.txtTextBox.setVisibility) this.txtTextBox.setVisibility(false);
            this.Set_Data_from_txtBox_To_Grid();
        }
        const target = e.currentTarget || e.target;
        const GP = this.Grid_Property[this.Grid_Total.Layer];
        GP.scrollLeft = this.hScroll.getPosition();
        GP.scrollTop = this.vScroll.getPosition();
        this.tabbase.selectedIndex = Number(target.tag);
        const oldLay=this.Grid_Total.Layer;
        this.Grid_Total.Layer = Number(target.tag);
        const GP2 = this.Grid_Property[this.Grid_Total.Layer];
        this.Print_Grid_ViewSize();
        this.hScroll.setPosition(  GP2.scrollLeft);
        this.vScroll.setPosition(  GP2.scrollTop);
        this.tabSelect();
        this.Print_Grid_Data();
        this.eventCall.evtChange_LayerSelect(this.Grid_Total.Layer, oldLay);
        let rightButton = false;
        this.touchStartTime = new Date().getTime();
            if (e.button === 2) { rightButton = true; }

            //右クリックの場合メニュー
            if((rightButton)&&(this.Grid_Total.tOpe.TabClickEnabled)){
                
                this.tabRightClickMenu(new point(e.clientX,e.clientY));
            }
        }

    tabTouchend = (e: TouchEvent) => {
        const touchTime = (new Date().getTime() - this.touchStartTime) / 1000;
        if ((touchTime > 0.5)&&(this.Grid_Total.tOpe.TabClickEnabled)) {
            //タッチで0.5秒以上移動しない場合は右クリック
            this.tabRightClickMenu(new point(e.changedTouches[0].clientX,e.changedTouches[0].clientY));;
        }
    }

    /**タブを右クリック */
    tabRightClickMenu = (p: point) => {
        const GPO = this.Grid_Property[this.Grid_Total.Layer].Ope;
        const lc = this.Grid_Total.LayerCaption;
        const mnuTabRightMenuMove = (e: Event) => {
            const nt = this.Grid_Total.Layer;
            switch (e.caption) {
                case "1つ前に移動": {
                    if (nt !== 0) {
                        const UndoData = new Undo_SwapLayer();
                        UndoData.Layer1 = nt;
                        UndoData.Layer2 = nt - 1;
                        UndoData.caption = "レイヤ移動";
                        this.UndoArray.push(UndoData);
                        this.Swap_GridLay(nt, nt - 1);
                        this.Grid_Total.Layer = nt - 1;
                        this.Set_SSTAB_Name();
                        this.tabSelect();
                        this.eventCall.evtChange_Layer(false, true, false);
                    }
                    break;
                }
                case "1つ後ろに移動": {
                    if (nt !== this.Grid_Total.LayerNum - 1) {
                        const UndoData = new Undo_SwapLayer();
                        UndoData.Layer1 = nt;
                        UndoData.Layer2 = nt + 1;
                        UndoData.caption = "レイヤ移動";
                        this.UndoArray.push(UndoData);
                        this.Swap_GridLay(nt, nt + 1);
                        this.Grid_Total.Layer = nt + 1;
                        this.Set_SSTAB_Name();
                        this.tabSelect();
                        this.eventCall.evtChange_Layer(false, true, false);
                    }
                    break;
                }
                case "先頭に移動": {
                    if (nt !== 0) {
                        const UndoData = new Undo_MoveLayer();
                        UndoData.OriginLay = nt;
                        UndoData.DestLay = 0;
                        UndoData.caption = "レイヤ移動";
                        this.UndoArray.push(UndoData);
                        this.Grid_Property.unshift(this.Grid_Property[nt].Clone());
                        this.Grid_Property.splice(nt + 1, 1);
                        this.Grid_Total.Layer = 0;
                        this.Set_SSTAB_Name();
                        this.tabSelect();
                        this.eventCall.evtChange_Layer(false, true, false);
                    }
                    break;
                }
                case "末尾に移動": {
                    const mxt = this.Grid_Total.LayerNum;
                    if (nt !== mxt - 1) {
                        const UndoData = new Undo_MoveLayer();
                        UndoData.OriginLay = nt;
                        UndoData.DestLay = mxt - 1;
                        UndoData.caption = "レイヤ移動";
                        this.UndoArray.push(UndoData);
                        this.Grid_Property.push(this.Grid_Property[nt].Clone());
                        this.Grid_Property.splice(nt, 1);
                        this.Grid_Total.Layer = mxt - 1;
                        this.Set_SSTAB_Name();
                        this.tabSelect();
                        this.eventCall.evtChange_Layer(false, true, false);
                    }
                    break;
                }
            }
        };
        const mnuTabRightMenuChangeTabName = () => {
            this.removeEventlister();
            Generic.prompt(undefined, "新しい" + this.Grid_Total.LayerCaption + "名", this.Grid_Property[this.Grid_Total.Layer].LayerName, (newLayerName: string) => {
                if (newLayerName === "") {
                } else {
                    const UndoData = new Undo_ChangeLayerName();
                    UndoData.Layer = this.Grid_Total.Layer;
                    UndoData.caption = this.Grid_Total.LayerCaption + "名の変更";
                    UndoData.Name = this.Grid_Property[this.Grid_Total.Layer].LayerName;
                    this.UndoArray.push(UndoData);
                    this.Grid_Property[this.Grid_Total.Layer].LayerName = newLayerName;
                    this.Set_SSTAB_Name();
                    this.addDocumentEvent();
                    this.eventCall.evtChange_Layer(true, false, false);
                }
            }, "left", this.addDocumentEvent);
        };
        const mnuTabRightMenuInsert = (e: Event) => {
            let nt;
            if (e.caption === "前に挿入") {
                nt = this.Grid_Total.Layer;
            } else {
                nt = this.Grid_Total.Layer + 1;
            }
            const UndoData = new Undo_InsertLayer();
            UndoData.Layer = nt;
            UndoData.caption = this.Grid_Total.LayerCaption + "の挿入";
            this.UndoArray.push(UndoData);

            const existLayer = [];
            for (let i = 0; i < this.Grid_Total.LayerNum; i++) {
                existLayer[i] = this.Grid_Property[i].LayerName;
            }
            const newName = Generic.Get_New_Numbering_Strings("新しい" + this.Grid_Total.LayerCaption, existLayer);
            this.Insert_Layer(newName, nt, -1, 5, 50, this.Grid_Total.tOpe);
            this.Grid_Total.Layer = nt;
            this.tabSelect();
            this.Print_Grid_ViewSize();
            this.Print_Grid_Data();
            this.eventCall.evtAdd_Layer(nt);
        };
        const mnuTabRightMenuDeleteTab = () => {
            const mxt = this.Grid_Total.LayerNum;
            if (mxt === 1) { return }
            const nt = this.Grid_Total.Layer;
            const UndoData = new Undo_deleteLayer();
            UndoData.OriginLay = nt;
            UndoData.GridData = this.Grid_Property[this.Grid_Total.Layer].Clone();
            UndoData.caption = this.Grid_Total.LayerCaption + "の削除";
            this.UndoArray.push(UndoData);
            this.Delete_Layer(nt);
            this.Set_SSTAB_Name();
            let nnt;
            if (nt === mxt - 1) {
                nnt = nt - 1;
            } else {
                nnt = nt;
            }
            this.Grid_Total.Layer = nnt;
            this.tabMake();
            this.tabSelect();
            this.eventCall.evtChange_Layer(false, false, true);
            this.Print_Grid_ViewSize();
            this.Print_Grid_Data();
        };
        const popmenu = [
            { caption: lc + "名の変更", enabled: true, event: mnuTabRightMenuChangeTabName },
            { caption: lc + "の移動", enabled: true, child: [{ caption: "1つ前に移動", event: mnuTabRightMenuMove }, { caption: "1つ後ろに移動", event: mnuTabRightMenuMove }, { caption: "先頭に移動", event: mnuTabRightMenuMove }, { caption: "末尾に移動", event: mnuTabRightMenuMove }] },
            { caption: "新しい" + lc + "の挿入", enabled: GPO.RightClickEnabled, child: [{ caption: "前に挿入", event: mnuTabRightMenuInsert }, { caption: "後ろに挿入", event: mnuTabRightMenuInsert }] },
            { caption: lc + "の削除", enabled: GPO.RightClickEnabled, event: mnuTabRightMenuDeleteTab }
        ];
        Generic.ceatePopupMenu(popmenu, p);
    }

    Swap_GridLay = (L1: number,L2: number) => {
        const TempGridLay=this.Grid_Property[L1].Clone();
        this.Grid_Property[L1] = this.Grid_Property[L2].Clone();
        this.Grid_Property[L2] = TempGridLay;
    }

    /**レイヤを削除 */
    Delete_Layer = (DLay: number) => {
        this.Grid_Total.LayerNum--;
        this.Grid_Property.splice(DLay,1);
        this.Grid_Property.length = this.Grid_Total.LayerNum;
    }

    tabSelect = () => {
        for (let i = 0; i < this.tabbase.tab.length; i++) {
            if (this.Grid_Total.Layer === i) {
                this.tabbase.tab[i].style.backgroundColor = "#ffffff";            
            }else{
                this.tabbase.tab[i].style.backgroundColor = "#e1e1e1";

            }
        }
    }
    /**■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
    //マウス操作
    mdown = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        let event;
        if (e.type === "mousedown") {
            event = e as MouseEvent;
        } else {
            event = (e as TouchEvent).changedTouches[0];
        }
        const MouseDownF = true;
        this.touchStartTime = new Date().getTime();
        const mouseDownPosition = Generic.getCanvasXY2(event);
        const x = mouseDownPosition.x;
        const y = mouseDownPosition.y;
        let xx, yy
        const GR = this.GridResize;
        const GP = this.Grid_Property[this.Grid_Total.Layer];
        if (GR.Enable !== 0) {
            const grresult = this.check_Width_Height_Change(x, y);
            GR.Enable = grresult.result;
            GR.GridX = grresult.ResizeX;
            GR.GridY = grresult.ResizeY;
            GR.LeftX = grresult.lX
            GR.TopY = grresult.lY;
            this.GridMouseDown = true;
        } else {
            if (this.txtTextBox?.getVisibility?.() === true) {
                if (this.txtTextBox.setVisibility) this.txtTextBox.setVisibility(false);
                this.Set_Data_from_txtBox_To_Grid();
                this.Print_Grid_Data();
            }
            const p = this.GetGridXY(mouseDownPosition.x, mouseDownPosition.y, true);
            xx = p.x;
            yy = p.y;
            let rightButton = false;
            if ('button' in e && e.button === 2) { rightButton = true; }

            if (rightButton === false) { //左クリック
                if ((xx < -this.Grid_Total.FixedObjectName_n + this.Grid_Total.FixedObjectName_n2
                ) && (yy < -this.Grid_Total.FixedDataItem_n + this.Grid_Total.FixedDataItem_n2)) { //左上端をクリック
                    GP.MouseDownX = -this.Grid_Total.FixedObjectName_n;
                    GP.MouseDownY = -this.Grid_Total.FixedDataItem_n;
                    GP.MouseUpX = GP.Xmax - 1;
                    GP.MouseUpY = GP.Ymax - 1;
                } else {
                    if ((xx === -this.Grid_Total.FixedObjectName_n) && (0 < this.Grid_Total.FixedObjectName_n)) {  //左端をクリック
                        GP.MouseDownX = -this.Grid_Total.FixedObjectName_n;
                        GP.MouseDownY = yy;
                        GP.MouseUpX = GP.Xmax - 1;
                        GP.MouseUpY = GP.MouseDownY;
                        GP.MouseDown_Mode = 2;
                        this.GridMouseDown = true;
                    } else if ((yy === -this.Grid_Total.FixedDataItem_n) && (0 < this.Grid_Total.FixedDataItem_n)) {  //上端をクリック
                        GP.MouseDownX = xx
                        GP.MouseDownY = -this.Grid_Total.FixedDataItem_n;
                        GP.MouseUpX = GP.MouseDownX;
                        GP.MouseUpY = GP.Ymax - 1;
                        GP.MouseDown_Mode = 1;
                        this.GridMouseDown = true;
                    } else if ((yy < -this.Grid_Total.FixedDataItem_n + this.Grid_Total.FixedDataItem_n2) && (xx >= 0)) {
                        //上端の固定部分その２　ClickFixedYS2イベントを発生させる
                        GP.MouseDownX = xx;
                        GP.MouseDownY = yy;
                        GP.MouseUpX = xx;
                        GP.MouseUpY = yy;
                        this.GridMouseDown = false
                        let CellLeft = GP.FixedObjectNameDataWidth();
                        for (let i = GP.LeftCell; i < xx; i++) {
                            CellLeft += GP.DataItemData[i].Width;
                        }
                        let Celltop = this.picGrid.offsetTop;
                        const Y2 = this.Grid_Total.FixedDataItem_n + yy;
                        for (let i = 0; i < Y2; i++) {
                            Celltop += GP.FixedDataItemData[i].Height;
                        }
                        const mpos=new point(event.clientX,event.clientY)
                        this.eventCall.evtClick_FixedYS2(this.Grid_Total.Layer, xx, Y2, GP.FixedDataItem[xx][ Y2].Text, Celltop, CellLeft, GP.DataItemData[xx].Width, GP.FixedDataItemData[Y2].Height,mpos);
                        return;
                    } else {
                        //グリッドのデータ部分
                        GP.MouseDownX = xx;
                        GP.MouseDownY = yy;
                        GP.MouseUpX = xx;
                        GP.MouseUpY = yy;
                        GP.MouseDown_Mode = 0;
                        this.GridMouseDown = true;
                    }
                    this.picGrid.Capture = true;
                }
                if (xx < 0) {
                    GP.LeftCell = 0;
                    this.HScrollGrid_ValueSet();
                }
                if (yy < 0) {
                    GP.TopCell = 0;
                    this.VScrollGrid_ValueSet();
                }
                GP.SelectedF = true;
                this.Print_Grid_Data();

            } else { //右クリック
                if ((GP.SelectedF = true) && (((GP.MouseDownX <= xx) && (xx <= GP.MouseUpX)) || ((GP.MouseDownX >= xx) && (xx >= GP.MouseUpX))) && (
                    ((GP.MouseDownY <= yy) && (yy <= GP.MouseUpY)) || ((GP.MouseDownY >= yy) && (yy >= GP.MouseUpY)))) {
                    //右クリックで、選択範囲内をクリックした場合は範囲を変更しない
                } else {
                    if ((xx === -this.Grid_Total.FixedObjectName_n) && (yy === -this.Grid_Total.FixedDataItem_n)) { //左上端をクリック
                        GP.MouseDownX = xx;
                        GP.MouseDownY = yy;
                        GP.MouseUpX = GP.Xmax - 1;
                        GP.MouseUpY = GP.Ymax - 1;
                    } else {
                        if (xx === -this.Grid_Total.FixedObjectName_n) { //左端をクリック
                            GP.MouseDownX = xx;
                            GP.MouseDownY = yy;
                            GP.MouseUpX = GP.Xmax - 1;
                            GP.MouseUpY = GP.MouseDownY;
                            GP.MouseDown_Mode = 2;
                        } else if (yy === -this.Grid_Total.FixedDataItem_n) { //上端をクリック
                            GP.MouseDownX = xx;
                            GP.MouseDownY = yy;
                            GP.MouseUpX = GP.MouseDownX;
                            GP.MouseUpY = GP.Ymax - 1
                            GP.MouseDown_Mode = 1;
                        } else {
                            GP.MouseDownX = xx;
                            GP.MouseDownY = yy;
                            GP.MouseUpX = xx;
                            GP.MouseUpY = yy;
                        }
                    }
                }
                GP.SelectedF = true;
                this.Print_Grid_Data();
                const pt = 'clientX' in e ? new point(e.clientX, e.clientY) : new point(e.touches[0].clientX, e.touches[0].clientY);
                this.rightClickmenu(pt);
            }
        }
    }
    mmove = (e: MouseEvent | TouchEvent) => {
        let event;
        e.preventDefault();
        if(this.txtTextBox?.getVisibility?.()===true){return;}

        if (e.type === "mousemove") {
            event = e as MouseEvent;
        } else {
            // if(mousePointingSituation === mousePointingSituations.pinch){
            //     pinchMove(e);
            //     return;
            // }
            if (e.changedTouches.length > 1) {
                e.preventDefault();
                // mousePointingSituation = mousePointingSituations.pinch;
                // pinch(e);
                return;
            } else {
                event = e.changedTouches[0];
            }
        }
        const p = Generic.getCanvasXY2(event);
        if(p===undefined){
            return;
        }
        const x = p.x;
        const y = p.y;

        if (this.GridMouseDown === false) {
            this.GridResize.Enable = this.check_Width_Height_Change(x, y).result;
            if (this.ctx) {
                this.GridResize.tempImage= this.ctx.getImageData(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);
            }
            if (this.GridResize.Enable !== 0) {
                this.picGrid.style.cursor = 'crosshair';
            } else {
                this.picGrid.style.cursor = 'default';
                //マウス移動中にセルの値ツールチップ表示
                // GetGridXY(x, y, xx, yy, true)
                // let v  = Get_Data_from_Grid(Grid_Total.Layer, xx, yy)
                // if(ToolTip1.GetToolTip(picGrid) !== v ){
                //     ToolTip1.SetToolTip(picGrid, v);
                // }
            }
            return;
        }

        if (this.GridResize.Enable !== 0) {
            this.Print_GridResizeLine(x, y);
        } else {
            const GP = this.Grid_Property[this.Grid_Total.Layer];
            let f = false;
            if ((GP.MouseDownX === -this.Grid_Total.FixedObjectName_n) || (GP.MouseDownY === -this.Grid_Total.FixedDataItem_n)) {
                f = true;
            } else {
                f = false;
            }
            if (((y > this.picGrid.clientHeight - 30) || (x > this.picGrid.clientWidth - 30) || (y < GP.FixedDataItemHeight()) || (x < GP.FixedObjectNameDataWidth()))) {
                if (this.TimerObj === undefined) {
                    this.TimerObj = setInterval(this.TimerMouse, 250);
                }
                this.TimerVX = x;
                this.TimerVY = y;
            } else {
                if (this.TimerObj !== undefined) {
                    clearInterval(this.TimerObj);
                }
                this.TimerObj = undefined;
                const pt = 'clientX' in e ? new point(e.clientX, e.clientY) : new point(e.touches[0].clientX, e.touches[0].clientY);
                const grp = this.GetGridXY(pt.x, pt.y, f);
                switch (GP.MouseDown_Mode) {
                    case 0:
                        GP.MouseUpX = grp.x;
                        GP.MouseUpY = grp.y;
                        break;
                    case 1:
                        GP.MouseUpX = grp.x;
                        break;
                    case 2:
                        GP.MouseUpY = grp.y;
                        break;
                }
                this.Print_Grid_Data();
            }
        }
    }

    /**キーダウン */
    keydown = (e: KeyboardEvent) => {
        if (this.txtTextBox?.getVisibility?.() === true) {
            const op=new point(this.GX,this.GY);
            this.txtTextBox_KeyDown(e);
            const np=new point(this.GX,this.GY);
            if((op.Equals(np)===false)||((this.GY===this.Grid_Property[this.Grid_Total.Layer].Ymax-1)&&(e.keyCode===Keys.Enter))){
                //セルが移動した場合はイベント継続キャンセル
                e.preventDefault();
            }
            return;
        }
        const GP = this.Grid_Property[this.Grid_Total.Layer];
        const GPO = GP.Ope;
        const CTRL_Key = e.ctrlKey;
        const Shift_Key = e.shiftKey;
        if (((CTRL_Key === true) && (e.keyCode === Keys.ControlKey)) || (
            (Shift_Key === true) && (e.keyCode === Keys.ShiftKey))) {
            return;
        }
        if (CTRL_Key === true) {
            switch (e.keyCode) {
                case Keys.Z: //Ctrl+Z
                    this.Undo() ;
                    return;
                    break;
                case Keys.X: //Ctrl+X
                    if ((GPO.RightClickEnabled === true) && (GP.Ope.InputEnabled === true)) {
                        this.Grid_Copy();
                        this.Grid_Clear("切り取り")
                        return;
                    }
                    break;
                case Keys.C: //Ctrl+C
                        this.Grid_Copy()
                        return;
                    break;
                case Keys.V: //Ctrl+V
                    if ((GPO.RightClickEnabled === true) && (GP.Ope.InputEnabled === true)) {
                        // let clip  = System.Windows.Forms.Clipboard.GetText()
                        if (this.inClipboard !== "") {
                            this.Grid_Paste(this.inClipboard, false);;
                            return;
                        }
                    }
                    break;
            }
        }

        if (GP.SelectedF === false) {
            return;
        }
        if ((e.keyCode === Keys.Delete) && (GP.Ope.InputEnabled === true)) {
            this.Grid_Clear("削除");
        } else {
            if (CTRL_Key === true) {
                //CTRL+カーソル／上下左右端にとぶ
                let x, y;
                if (Shift_Key === true) {
                    x = GP.MouseUpX;
                    y = GP.MouseUpY;
                } else {
                    x = GP.MouseDownX;
                    y = GP.MouseDownY;
                }
                if (e.keyCode === Keys.Left) {
                    x = 0;
                    this.GX = x;
                    GP.LeftCell = x;
                    this.HScrollGrid_ValueSet();
                }
                if (e.keyCode === Keys.Right) {
                    x = GP.Xmax - 1;
                    this.GX = x;
                    GP.LeftCell = x;
                    this.HScrollGrid_ValueSet()
                }
                if (e.keyCode === Keys.Up) {
                    y = 0;
                    this.GY = y;
                    GP.TopCell = y;
                    this.VScrollGrid_ValueSet();
                }
                if (e.keyCode === Keys.Down) {
                    y = GP.Ymax - 1;
                    this.GY = y;
                    GP.TopCell = y;
                    this.VScrollGrid_ValueSet();
                }
                if (Shift_Key === false) {
                    GP.MouseDownX = x;
                    GP.MouseDownY = y;
                }
                GP.MouseUpX = x;
                GP.MouseUpY = y;
                this.Print_Grid_Data()
            }
            if ((CTRL_Key === false) && (e.keyCode !== Keys.Tab) && (Shift_Key === true)) {
                //SHIFT+カーソル／選択範囲移動
                this.Key_Move(e.keyCode, true);
                this.Print_Grid_Data();
            }
            if (((CTRL_Key === false) && (Shift_Key === false)) || ((e.keyCode === Keys.Tab))) {
                //通常の移動
                this.Key_Move(e.keyCode, Shift_Key);
                this.Print_Grid_Data();
            }
        }
    }

    Key_Move = (KeyCode: number, Shit_f: boolean) => {

        let X, Y;
        const GP = this.Grid_Property[this.Grid_Total.Layer];
        if (Shit_f === true) {
            X = GP.MouseUpX;
            Y = GP.MouseUpY;
        } else {
            X = GP.MouseDownX;
            Y = GP.MouseDownY;
        }
        switch (KeyCode) {
            case Keys.Left:
            case Keys.Right:
            case Keys.Down:
            case Keys.Up:
            case Keys.Tab:
            case Keys.Return:
            case Keys.PageDown:
            case Keys.PageUp:
            case Keys.Home: {
                if ((KeyCode === Keys.Left) || ((KeyCode === Keys.Tab) && (Shit_f === true))) {
                    X--;
                }
                if ((KeyCode === Keys.Right) || ((KeyCode === Keys.Tab) && (Shit_f === false))) {
                    X++;
                }
                if (KeyCode === Keys.Up) {
                    Y--;
                }
                if ((KeyCode === Keys.Down)|| (KeyCode === Keys.Return)){
                    Y++;
                }
                if (KeyCode === Keys.PageDown) {
                    Y += 20;
                }
                if (KeyCode === Keys.PageUp) {
                    Y -= 20;
                }
                if (KeyCode === Keys.Home) {
                    X = 0;
                    Y = 0;
                }
                if (X >= GP.Xmax) {
                    X = GP.Xmax - 1;
                }
                if (X < -this.Grid_Total.FixedObjectName_n + this.Grid_Total.FixedObjectName_n2) {
                    X = -this.Grid_Total.FixedObjectName_n + this.Grid_Total.FixedObjectName_n2;
                }
                if (Y >= GP.Ymax) {
                    Y = GP.Ymax - 1;
                }
                if (Y < -this.Grid_Total.FixedDataItem_n + this.Grid_Total.FixedDataItem_n2) {
                    Y = -this.Grid_Total.FixedDataItem_n + this.Grid_Total.FixedDataItem_n2;
                }
                this.Scroll_Set(X, Y);

                GP.SelectedF = false;

                if ((Shit_f === false) || (KeyCode === Keys.Tab)) {
                    this.Print_Grid_Data();
                }
                this.GX = X;
                this.GY = Y;
                GP.SelectedF = true;
                if ((Shit_f === false) || (KeyCode === Keys.Tab)) {
                    GP.MouseDownX = this.GX;
                    GP.MouseDownY = this.GY;
                }
                GP.MouseUpX = this.GX;
                GP.MouseUpY = this.GY;
            }
        }
    }

    /**テキストボックス中でのキー操作 */
    txtTextBox_KeyDown = (e: KeyboardEvent) => {
        
        const CTRL_Key = e.ctrlKey;
        const Shift_Key = e.shiftKey;
        const ALT_Key = e.altKey;

        
        const GP = this.Grid_Property[this.Grid_Total.Layer];
        this.GX = GP.MouseDownX;
        this.GY = GP.MouseDownY;
        this.txtTextBox.Tag = "";
        const Tx = this.txtTextBox.value;
        if (e.keyCode === Keys.Enter) {
            if (ALT_Key === true) { //Alt+Enter
                const a = this.txtTextBox.selectionStart;
                if (Tx.length === a) {
                    this.txtTextBox.value = Tx + "\n";
                } else if (a === 0) {
                    this.txtTextBox.value = "\n" + Tx;
                } else {
                    this.txtTextBox.value = Tx.left(a) + "\n" + Tx.mid(a, undefined);
                }
                this.txtTextBox.selectionStart = a;
                return;
            }else{
                if(Tx.right(1)==="\n"){
                    this.txtTextBox.value = Tx.left(Tx.length - 1);
                }
            }
        }

        switch (e.keyCode) {
            case Keys.Left:
            case Keys.Up:
            case Keys.Right:
            case Keys.Down:
            case Keys.Enter:
            case Keys.Tab: {
                if ((GP.Ymax === 1) && (this.GX === 0) && (this.GY === 0) && ((e.keyCode === Keys.Enter) || (e.keyCode === Keys.Tab))) {
                    this.Set_Data_from_txtBox_To_Grid();
                    if (this.txtTextBox?.setVisibility) this.txtTextBox.setVisibility(false);
                    this.Print_Grid_Data();
                    return;
                }
                const tv = this.txtTextBox?.value ?? "";
                if ((this.txtTextBox?.selectionStart !== tv.length) && ((e.keyCode === Keys.Left) || (e.keyCode === Keys.Right))) {
                    return;
                }
                if (e.keyCode === Keys.Left) {
                    return;
                }

                this.Set_Data_from_txtBox_To_Grid();
                this.Key_Move(e.keyCode, Shift_Key);
                if ((e.keyCode === Keys.Up) && (this.GY === -1) && (((GP.Ope.FixedYSEnabled === false) && (this.GX >= 0)
                ) || ((GP.Ope.FixedUpperLeftEnabeld === false) && (this.GX < 0)))) {
                    GP.SelectedF = true;
                    this.SetTextBox(this.GX, this.GY);
                    if (this.txtTextBox?.setVisibility) this.txtTextBox.setVisibility(false);
                } else {
                    this.SetTextBox(this.GX, this.GY);
                }
                break;
            }
            case Keys.Escape:
                GP.SelectedF = true;
                if (this.txtTextBox?.setVisibility) this.txtTextBox.setVisibility(false);
                this.Print_Grid_Data();
                break;
        }
    }

    Scroll_Set = (X: number, Y: number) => {

        const GP = this.Grid_Property[this.Grid_Total.Layer];
        if ((GP.BottomCell - 1 < Y) && (Y <= GP.Ymax - 1)) {
            GP.TopCell++;
            this.VScrollGrid_ValueSet();
        } else if ((0 <= Y) && (Y < GP.TopCell)) {
            GP.TopCell = Y;
            this.VScrollGrid_ValueSet();
        }
        if ((GP.RightCell < X) && (X <= GP.Xmax - 1)) {
            GP.LeftCell++;
            this.HScrollGrid_ValueSet();
        } else if ((X < GP.LeftCell) && (X >= 0)) {
            GP.LeftCell = X;
            this.HScrollGrid_ValueSet();
        }
    }

    mup = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        let event;

        if ((e.type === "mouseup") ||(e.type === "mouseleave")){
             event = e as MouseEvent;
        } else {
             event = (e as TouchEvent).changedTouches[0];
        }
        let xx, yy
        const f=false;
        const mouseUpPosition = Generic.getCanvasXY2(event);

        if(mouseUpPosition===undefined){
            return;
        }
        const x = mouseUpPosition.x
        const y = mouseUpPosition.y

        if (this.GridMouseDown === true) {
            this.GridMouseDown = false;
            if (this.GridResize.Enable !== 0) {
                this.Grid_Resize_MouseUp(x, y);
                this.GridResize.Enable = 0;
            } else {
                clearInterval(this.TimerObj);
                this.TimerObj=undefined;
                this.picGrid.Capture = false;
                const GP = this.Grid_Property[this.Grid_Total.Layer];
                const p = this.GetGridXY(x, y, f);
                xx = p.x;
                yy = p.y;
                const touchTime = (new Date().getTime() - this.touchStartTime) / 1000;
                if ((e.type === "touchend")  && (touchTime > 0.5)&&(GP.MouseDownX === xx) && (GP.MouseDownY === yy) ) {
                    //タッチで0.5秒以上移動しない場合は右クリック
                    this.rightClickmenu(new point(event.clientX,event.clientY));
                    return;
                }

                if ((GP.MouseDownX === xx) && (GP.MouseDownY === yy) && (GP.MouseDown_Mode === 0)) {
                    if ((yy === GP.BottomCell) && (yy < GP.Ymax - 1)) {
                        GP.TopCell++;
                        this.VScrollGrid_ValueSet();
                        this.Print_Grid_Data();
                    }
                    if ((xx === GP.RightCell) && (xx < GP.Xmax - 1)) {
                        GP.LeftCell++;
                        this.HScrollGrid_ValueSet();
                        this.Print_Grid_Data();
                    }
                    if ((this.GX === xx) && (this.GY === yy) && (GP.Ope.InputEnabled === true)) {
                        if (((xx < 0) && (yy >= 0) && (GP.Ope.FixedXSEnabled === false)) ||
                            ((xx >= 0) && (yy < 0) && (GP.Ope.FixedYSEnabled === false)) ||
                            ((xx < 0) && (yy < 0) && (GP.Ope.FixedUpperLeftEnabeld === false))) {
                            //固定部分が編集できない状態
                        } else {
                            this.Print_Grid_Data();
                            this.SetTextBox(GP.MouseDownX, GP.MouseDownY);
                        }
                    } else {
                        this.GX = xx;
                        this.GY = yy;
                        if ((xx >= 0) && (yy >= 0) && (GP.Ope.InputEnabled === false)) {
                            let CellLeft = GP.FixedObjectNameDataWidth();
                            for (let i = GP.LeftCell; i < xx; i++) {
                                CellLeft += GP.DataItemData[i].Width;
                            }
                            let Celltop = GP.FixedDataItemHeight();
                            for (let i = 0; i < yy; i++) {
                                Celltop += GP.CellHeight[i];
                            }
                            this.eventCall.evtClick_DataGrid(this.Grid_Total.Layer, xx, yy, GP.Grid_Text[xx][ yy].Text, Celltop, CellLeft, GP.DataItemData[xx].Width, GP.CellHeight[yy]);
                        }
                    }
                }
            }
        }
    }

    TimerMouse = () => {
        const GP = this.Grid_Property[this.Grid_Total.Layer];
        const V = GP.TopCell;
        const H = GP.LeftCell;
        const omuX=GP.MouseUpX;
        const omuY=GP.MouseUpY;
        if (GP.MouseDownX !== -this.Grid_Total.FixedObjectName_n) {
            if (this.TimerVX < GP.FixedObjectNameDataWidth()) {
                if (H === 0) {
                    GP.MouseUpX = this.GetGridX(this.TimerVX, false);
                } else {
                    GP.LeftCell = H - 1;
                    this.HScrollGrid_ValueSet();
                    GP.MouseUpX = H - 1;
                }
            } else if (this.TimerVX > this.picGrid.clientWidth-30) {
                if (H < GP.Xmax - 1) {
                    GP.LeftCell = H + 1;
                    this.HScrollGrid_ValueSet();
                    GP.MouseUpX = GP.RightCell+1;
                }
            } else {
                    GP.MouseUpX = this.GetGridX(this.TimerVX, false);
                }
        }
        if (GP.MouseDownY >= -this.Grid_Total.FixedDataItem_n + this.Grid_Total.FixedDataItem_n2) {
            let sa;
            if (this.TimerVY < GP.FixedDataItemHeight()) {
                if (V === 0) {
                    GP.MouseUpY = this.GetGridY(this.TimerVY, false);
                } else {
                    sa = Math.floor((GP.FixedDataItemHeight() - this.TimerVY) / 10) + 1;
                    GP.TopCell = V - sa;
                    if (GP.TopCell < 0) {
                        GP.TopCell = 0;
                    }
                    this.VScrollGrid_ValueSet();
                    GP.MouseUpY = V - sa;
                }
            } else if (this.TimerVY > this.picGrid.clientHeight - 30) {
                if (V < GP.Ymax - 1) {
                    sa = Math.floor((this.TimerVY - (this.picGrid.clientHeight - 30)) / 10) + 1;
                    GP.TopCell = V + sa;
                    if (GP.TopCell > GP.Ymax - 1) {
                        GP.TopCell = GP.Ymax - 1;
                    }
                    this.VScrollGrid_ValueSet();
                    GP.MouseUpY = GP.BottomCell + sa;
                    if (GP.MouseUpY > GP.Ymax - 1) {
                        GP.MouseUpY = GP.Ymax - 1;
                    }
                }
            }
            else {
                GP.MouseUpY = this.GetGridY(this.TimerVY, false);
                
            }
            switch (GP.MouseDown_Mode) {
                case 1:
                    GP.MouseUpY = GP.Ymax - 1;
                    break;
                case 2:
                    GP.MouseUpX = GP.Xmax - 1;
                    break;
            }
        }
        if ((GP.TopCell !== V) || (GP.LeftCell !== H)||(omuX !== GP.MouseUpX) || (omuY !== GP.MouseUpY)) {
            this.Print_Grid_Data();

        }
    }

    mleave = () => {

    }

    VScrollGrid_ValueSet = () => {
        const GP = this.Grid_Property[this.Grid_Total.Layer];
        let y = 0;
        for (let i = 0; i < GP.TopCell; i++) {
            y += GP.CellHeight[i];
        }
        this.vScroll.setPosition(  y+1);
    }
    HScrollGrid_ValueSet = () => {
        const GP = this.Grid_Property[this.Grid_Total.Layer];
        let x = 0;
        for (let i = 0; i < GP.LeftCell; i++) {
            x += GP.DataItemData[i].Width;
        }
        this.hScroll.setPosition( x+1); 
    }

    /** グリッド上のマウスカーソルが列・行の境界線上にあるかどうかを調べる 0を返す/変更できない位置、1/行高変更可、2/列幅変更可　*/
    check_Width_Height_Change = (mx: number, my: number) => {

        let i, s
        let H, w
        let OV;
        let lX, lY
        let ResizeX;
        let ResizeY;
        let result = 0;
        const GP = this.Grid_Property[this.Grid_Total.Layer];
        if (mx < GP.FixedObjectNameDataWidth()) {
            //行高変更位置
            if ((my <= GP.FixedDataItemHeight() + 2) && (0 < GP.FixedDataItemHeight())) {
                i = 0;
                H = 0;
                do {
                    OV = H;
                    H += GP.FixedDataItemData[i].Height;
                    s = Math.abs(my - H);
                    i++;
                } while ((i < this.Grid_Total.FixedDataItem_n) && (s > 2))
                i = (i - 1) - this.Grid_Total.FixedDataItem_n;
            } else {
                i = GP.TopCell;
                H = GP.FixedDataItemHeight();
                do {
                    OV = H;
                    H = H + GP.CellHeight[i];
                    s = Math.abs(my - H);
                    i++;
                } while ((i <= GP.BottomCell) && (s > 2))
                i--;
            }
            if (s <= 2) {
                result = 1;
                lY = OV;
                ResizeY = i;
            }
        }
        if (my < GP.FixedDataItemHeight()) {
            //列幅変更位置
            if (mx <= GP.FixedObjectNameDataWidth() + 2) {
                i = 0;
                w = 0;
                do {
                    OV = w;
                    w = w + GP.FixedObjectNameData[i].Width;
                    s = Math.abs(mx - w);
                    i++;
                } while ((i < this.Grid_Total.FixedObjectName_n) && (s > 2))
                i = (i - 1) - this.Grid_Total.FixedObjectName_n;
            } else {
                i = GP.LeftCell;
                w = GP.FixedObjectNameDataWidth();
                do {
                    OV = w;
                    w = w + GP.DataItemData[i].Width;
                    s = Math.abs(mx - w);
                    i++;
                } while ((i <= GP.RightCell) && (s > 2))
                i--;
            }
            if (s <= 2) {
                result = 2;
                lX = OV;
                ResizeX = i;
            }
        }
        return { result: result, ResizeX: ResizeX, ResizeY: ResizeY, lX: lX, lY: lY };
    }

    
    Print_GridResizeLine = (mox: number, moy: number) => {
        if (!this.ctx || !this.GridResize.tempImage) return;
        
        let w, H;
        this.ctx.putImageData(this.GridResize.tempImage, 0, 0);
        this.ctx.lineWidth =0.5;
        this.ctx.strokeStyle ='black';
        switch (this.GridResize.Enable) {
            case 1: {
                //1/行高変更可
                w = this.picGrid.offsetWidth;
                this.ctx.beginPath();
                this.ctx.moveTo(0,this.GridResize.TopY);
                this.ctx.lineTo(w,this.GridResize.TopY);
                if (moy <= this.GridResize.TopY) {
                    moy = this.GridResize.TopY + 1
                }
                this.ctx.moveTo(0,moy);
                this.ctx.lineTo(w,moy);
                this.ctx.stroke();
                break;
            }
            case 2: {
                //2/列幅変更
                H = this.picGrid.offsetHeight;
                this.ctx.beginPath();
                this.ctx.moveTo(this.GridResize.LeftX,0);
                this.ctx.lineTo(this.GridResize.LeftX,H);
                if (mox <= this.GridResize.LeftX) {
                    mox = this.GridResize.LeftX + 1;
                }
                this.ctx.moveTo(mox,0);
                this.ctx.lineTo(mox,H);
                this.ctx.stroke();
                break;
            }
        }
    }

    Grid_Resize_MouseUp = (X: number, Y: number) => {
        let S1, s2, T, TY, tx;
        let w, H;

        const GP = this.Grid_Property[this.Grid_Total.Layer]
        switch (this.GridResize.Enable) {
            case 1: {
                //行高変更位置
                TY = this.GridResize.GridY
                T = this.GridResize.TopY
                H = (Y - T) + 1
                H = Math.max(2, H)
                if (GP.SelectedF === true) {
                    const rect = GP.MouseUpDownRect();
                    S1 = rect.top;
                    s2 = rect.bottom;
                    if ((S1 <= TY) && (TY <= s2)) {
                    } else {
                        S1 = TY;
                        s2 = TY;
                    }
                } else {
                    S1 = TY;
                    s2 = TY;
                }
               this.SetUndo_ChangeRowHeight(this.Grid_Total.Layer, S1, s2);
                this.ChangeRowHeight(this.Grid_Total.Layer, S1, s2, H);
                break;
            }
            case 2: {
                //列幅変更位置
                tx = this.GridResize.GridX;
                T = this.GridResize.LeftX;
                w = (X - T) + 1;
                w = Math.max(3, w);
                if (GP.SelectedF === true) {
                    const rect = GP.MouseUpDownRect();
                    S1 = rect.left;
                    s2 = rect.right;
                    if ((S1 <= tx) && (tx <= s2)) {
                    } else {
                        S1 = tx;
                        s2 = tx;
                    }
                } else {
                    S1 = tx;
                    s2 = tx;
                }
               this.SetUndo_ChangeColumnWidth(this.Grid_Total.Layer, S1, s2, w);
                this.ChangeColumnWidth(this.Grid_Total.Layer, S1, s2, w);
                break;
            }
        }
        this.Print_Grid_ViewSize();
        this.Print_Grid_Data();
    }

    ChangeRowHeight = (Layer: number, top: number, bottom: number, Height: number | number[]) => {
        const GP = this.Grid_Property[Layer];
        for (let i = top; i <= bottom; i++) {
            if (i < 0) {
                if(Array.isArray(Height)){
                    GP.FixedDataItemData[i + this.Grid_Total.FixedDataItem_n].Height = Height[i - top];
                }else{
                    GP.FixedDataItemData[i + this.Grid_Total.FixedDataItem_n].Height = Height;
                }
            } else {
                if(Array.isArray(Height)){
                    GP.CellHeight[i] = Height[i - top];
                }else{
                    GP.CellHeight[i] = Height;
                }
            }
        }
    }

    ChangeColumnWidth = (Layer: number, left: number, right: number, Width: number | number[]) => {
        const GP = this.Grid_Property[Layer];
        for (let i = left; i <= right; i++) {
            if (i < 0) {
                if(Array.isArray(Width)){
                    GP.FixedObjectNameData[i + this.Grid_Total.FixedObjectName_n].Width = Width[i - left];
                }else{
                    GP.FixedObjectNameData[i + this.Grid_Total.FixedObjectName_n].Width = Width;
                }
            } else {
                if(Array.isArray(Width)){
                    GP.DataItemData[i].Width = Width[i - left];
                }else{
                    GP.DataItemData[i].Width = Width;
                }
            }
        }
    }

    SetUndo_ChangeColumnWidth = (Layer: number, left: number, right: number, Width: number) => {
        const UndoData=new Undo_ChangeColumnWidth();
        const oldW = [];
        const GP = this.Grid_Property[Layer];
        for (let i = left; i <= right;i++) {
            if (i < 0) {
                oldW[i - left] = GP.FixedObjectNameData[i + this.Grid_Total.FixedObjectName_n].Width;
            } else {
                oldW[i - left] = GP.DataItemData[i].Width;
            }
        }
        UndoData.caption = "幅変更";
        UndoData.Layer = Layer;
        UndoData.Width = oldW;
        UndoData.Left = left;
        UndoData.Right = right;
        this.UndoArray.push(UndoData);
    }

    GetGridXY = (MouseX: number, MouseY: number, ZaroLine_F: boolean) => {
        const GridX = this.GetGridX(MouseX, ZaroLine_F);
        const GridY = this.GetGridY(MouseY, ZaroLine_F);
        return new point(GridX, GridY)
    }

    GetGridX = (MouseX: number, ZaroLine_F: boolean) => {
        let GridX;
        const GP = this.Grid_Property[this.Grid_Total.Layer];
        let w = 0;
        if (MouseX < GP.FixedObjectNameDataWidth()) {
            for (let i = 0; i < this.Grid_Total.FixedObjectName_n; i++) {
                w += GP.FixedObjectNameData[i].Width
                if (MouseX < w) {
                    GridX = -(this.Grid_Total.FixedObjectName_n - i)
                    break;
                }
            }
            if ((ZaroLine_F === false) && (GridX !== undefined && GridX < -this.Grid_Total.FixedObjectName_n + this.Grid_Total.FixedObjectName_n2)) {
                GridX = -this.Grid_Total.FixedObjectName_n + this.Grid_Total.FixedObjectName_n2;
            }
        } else {
            w = GP.FixedObjectNameDataWidth();
            GridX = GP.RightCell;
            for (let i = GP.LeftCell; i <=GP.RightCell ; i++) {
                w += GP.DataItemData[i].Width;
                if (MouseX < w) {
                    GridX = i;
                    break;
                }
            }
        }
        return GridX;
    }

    GetGridY = (MouseY: number, ZaroLine_F: boolean) => {
        let GridY;
        let H = 0;

        const GP = this.Grid_Property[this.Grid_Total.Layer];
        if (MouseY < GP.FixedDataItemHeight()) {
            for (let i = 0; i < this.Grid_Total.FixedDataItem_n; i++) {
                H += GP.FixedDataItemData[i].Height;
                if (MouseY < H) {
                    GridY = -(this.Grid_Total.FixedDataItem_n - i);
                    break;
                }
            }
            if ((ZaroLine_F === false) && (GridY !== undefined && GridY < -this.Grid_Total.FixedDataItem_n + this.Grid_Total.FixedDataItem_n2)) {
                GridY = -this.Grid_Total.FixedDataItem_n + this.Grid_Total.FixedDataItem_n2;
            }
        } else {
            H = GP.FixedDataItemHeight();
            GridY = GP.BottomCell
            for (let i = GP.TopCell; i <= GP.BottomCell; i++) {
                H += GP.CellHeight[i];
                if (MouseY < H) {
                    GridY = i;
                    break;
                }
            }
        }
        return GridY;
    }

    Undo = () => {
        const n=this.UndoArray.length-1;
        if(n===-1){
            return;
        }
        const itm = this.UndoArray[n];
        switch (true) {
            case (itm instanceof Undo_InputCopyPasteClearInfo): {
                this.SetGrid_UndoData(itm.Layer, itm.Rect, itm.GridData);
                break;
            }
            case (itm instanceof Undo_InsertRows): {
                this.DeleteRows(itm.Layer, itm.Top, itm.Bottom - itm.Top + 1);
                this.eventCall.evtChange_FixedXS();
                break;
            }
            case (itm instanceof Undo_InsertColumns): {
                this.DeleteColumns(itm.Layer, itm.Left, itm.Right - itm.Left + 1);
                this.eventCall.evtChange_FixedYS();
                break;
            }
            case (itm instanceof Undo_DeleteRows): {
                const Dn = itm.Bottom - itm.Top + 1;
                this.InsertRows(itm.Layer, itm.Top, Dn);
                this.eventCall.evtChange_FixedXS();
                this.SetGrid_UndoData(itm.Layer, new rectangle(-this.Grid_Total.FixedObjectName_n, this.Grid_Property[itm.Layer].Xmax - 1, itm.Top, itm.Bottom), itm.GridData);
                break;
            }
            case (itm instanceof Undo_DeleteColumns): {
                const Dn = itm.Right - itm.Left + 1;
                this.InsertColumns(itm.Layer, itm.Left, Dn);
                this.eventCall.evtChange_FixedYS();
                this.SetGrid_UndoData(itm.Layer, new rectangle(itm.Left, itm.Right, -this.Grid_Total.FixedDataItem_n, this.Grid_Property[itm.Layer].Ymax - 1), itm.GridData);
                break;
            }
            case (itm instanceof Undo_ChangeRowHeight): {
                this.ChangeRowHeight(itm.Layer, itm.Top, itm.Bottom, itm.Height);
                this.Print_Grid_ViewSize();
                break;
            }

            case (itm instanceof Undo_ChangeColumnWidth): {
                this.ChangeColumnWidth(itm.Layer, itm.Left, itm.Right, itm.Width);
                this.Print_Grid_ViewSize();
                break;
            }
            case (itm instanceof Undo_ChangeLayerName): {
                const GP = this.Grid_Property[itm.Layer];
                GP.LayerName = itm.Name;
                this.Set_SSTAB_Name();
                break;
            }
            case (itm instanceof Undo_SwapLayer): {
                this.Swap_GridLay(itm.Layer1, itm.Layer2);
                this.Set_SSTAB_Name();
                this.tabSelect();
                break;
            }
            case (itm instanceof Undo_MoveLayer): {
                const TempGridLay = this.Grid_Property[itm.DestLay].Clone();
                this.Grid_Property.splice(itm.DestLay, 1);
                this.Grid_Property.splice(itm.OriginLay, 0, TempGridLay);
                this.Grid_Total.Layer = itm.OriginLay;
                this.Set_SSTAB_Name();
                this.tabSelect();
                this.Print_Grid_ViewSize();
                break;
            }
            case (itm instanceof Undo_deleteLayer): {
                this.Grid_Total.LayerNum++;
                this.Grid_Property.splice(itm.OriginLay, 0, itm.GridData);
                this.tabMake();
                this.Set_SSTAB_Name();
                this.Grid_Total.Layer = itm.OriginLay
                this.tabSelect();
                this.Print_Grid_ViewSize();
                break;
            }
            case (itm instanceof Undo_InsertLayer): {
                this.Delete_Layer(itm.Layer);
                this.Set_SSTAB_Name();
                let nnt;
                if (itm.Layer === this.Grid_Total.LayerNum) {
                    nnt = itm.Layer - 1;
                } else {
                    nnt = itm.Layer;
                }
                this.Grid_Total.Layer = nnt;
                break;
            }
        }
        this.UndoArray.pop();
        this.Print_Grid_Data();
    }
    SetGrid_UndoData = (Layer: number,rect: rectangle,GridData: string) => {
        let  SN  = 0;
        const cst = GridData.split("\t");
        for (let i = rect.top; i <= rect.bottom; i++) {
            for (let j = rect.left; j <= rect.right; j++) {
                 this.Set_Data_To_Grid(Layer, j, i, cst[SN], true);
                SN++;
            }
        }
    }
}

/**■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
/**　スクロールバーコントロール type:0縦、type1横　_areaRange:中身の大きさ*/
class scrollBar {
    setLength: (newLength: number) => void;
    setVisibility: (visiflag: boolean) => void;
    setXY: (x: number, y: number) => void;
    getXY: (x: number, y: number) => point;
    setPosition: (newPosition: number) => void;
    getPosition: () => number;
    setMaxValue: (newMax: number) => void;
    getMaxValue: () => number;
    setAreaRange: (newAreaRange: number) => void;
    getAreaRange: () => number;
    removeEventlister: () => void;
    addEventlister: () => void;

    constructor(
        ParentObj: HTMLElement,
        x: number,
        y: number,
        size: number,
        length: number,
        type: number,
        _maxValue: number,
        _areaRange: number,
        largeChange: number,
        smallChange: number,
        changeEventCall: Function | undefined
    ) {

    let maxValue = _maxValue;
    let position = 0;
    let areaRange = _areaRange;
    let frame: HTMLElement;
    let slideFrame: HTMLElement;
    let slider: HTMLElement;
    let slength = length - size*2;
    let slideArea: number;
    let sliderSize: number;
    let btnPlusCanvas: HTMLCanvasElement;
    const arrowCol = "#555555";
    const backCol = "#eeeeee";
    const sliderCol = "#bbbbbb";
    let btnMDownF = false;
    let btnDownTimer: ReturnType<typeof setInterval> | undefined;
    let btnDownID: string = "";
    if (type === 0) {//縦
        frame = Generic.createNewDiv(ParentObj, "", "", "", x, y, size, length, "background-color:" + backCol, undefined);
        const btnMinusCanvas = Generic.createNewCanvas(frame, "tateMinus", "", 0, 0, size, size , undefined, "");
        btnMinusCanvas.addEventListener('mousedown', btnMdown);
        btnMinusCanvas.addEventListener('mouseup', btnMup);
        btnMinusCanvas.addEventListener('mouseleave', btnMup);
        btnMinusCanvas.addEventListener("touchstart",btnMdown as EventListener);
        btnMinusCanvas.addEventListener("touchend",btnMup as EventListener);

        const ctxBtnMinus = btnMinusCanvas.getContext("2d");
        ctxBtnMinus.strokeStyle = arrowCol;
        ctxBtnMinus.lineWidth = 2;
        ctxBtnMinus.beginPath();
        ctxBtnMinus.moveTo(size * 0.3, size * 0.4+size/4);
        ctxBtnMinus.lineTo(size / 2, +size/4);
        ctxBtnMinus.lineTo(size * 0.7, size * 0.4+size/4);
        ctxBtnMinus.stroke();
        btnPlusCanvas = Generic.createNewCanvas(frame, "tatePlus", "", 0, length - size , size, size , undefined, "");
        btnPlusCanvas.addEventListener('mousedown', btnMdown);
        btnPlusCanvas.addEventListener('mouseup', btnMup);
        btnPlusCanvas.addEventListener('mouseleave', btnMup);
        btnPlusCanvas.addEventListener("touchstart",btnMdown as EventListener);
        btnPlusCanvas.addEventListener("touchend",btnMup as EventListener);
        const ctxBtnPlus = btnPlusCanvas.getContext("2d");
        ctxBtnPlus.strokeStyle = arrowCol;
        ctxBtnPlus.lineWidth = 2;
        ctxBtnPlus.beginPath();
        ctxBtnPlus.moveTo(size * 0.3, size * 0.1+size/4);
        ctxBtnPlus.lineTo(size / 2, size -size/4);
        ctxBtnPlus.lineTo(size * 0.7, size * 0.1+size/4);
        ctxBtnPlus.stroke();
        slideFrame = Generic.createNewDiv(frame, "", "slideFrame", "", 0, size, size, slength, "", undefined);
        sliderSize = Math.max(areaRange / maxValue * slength, size );
        slider = Generic.createNewDiv(slideFrame, "", "slider", "", 0, 0, size, sliderSize, "background-color:" + sliderCol, undefined);
        slideArea = slength - sliderSize;
    } else {//横
        frame = Generic.createNewDiv(ParentObj, "", "", "", x, y, length, size, "background-color:" + backCol, undefined);
        const btnMinusCanvas = Generic.createNewCanvas(frame, "yokoMinus", "", 0, 0, size , size, undefined, "");
        btnMinusCanvas.addEventListener('mousedown', btnMdown);
        btnMinusCanvas.addEventListener('mouseup', btnMup);
        btnMinusCanvas.addEventListener('mouseleave', btnMup);
        btnMinusCanvas.addEventListener("touchstart",btnMdown as EventListener);
        btnMinusCanvas.addEventListener("touchend",btnMup as EventListener);
        const ctxBtnMinus = btnMinusCanvas.getContext("2d");
        ctxBtnMinus.strokeStyle = arrowCol;
        ctxBtnMinus.lineWidth = 2;
        ctxBtnMinus.beginPath();
        ctxBtnMinus.moveTo(size * 0.4+size/4, size * 0.3);
        ctxBtnMinus.lineTo(+size/4, size / 2);
        ctxBtnMinus.lineTo(size * 0.4+size/4, size * 0.7);
        ctxBtnMinus.stroke();
        btnPlusCanvas = Generic.createNewCanvas(frame, "yokoPlus", "", length - size , 0, size , size, undefined, "");
        btnPlusCanvas.addEventListener('mousedown', btnMdown);
        btnPlusCanvas.addEventListener('mouseup', btnMup);
        btnPlusCanvas.addEventListener('mouseleave', btnMup);
        btnPlusCanvas.addEventListener("touchstart",btnMdown as EventListener);
        btnPlusCanvas.addEventListener("touchend",btnMup as EventListener);
        const ctxBtnPlus = btnPlusCanvas.getContext("2d");
        ctxBtnPlus.strokeStyle = arrowCol;
        ctxBtnPlus.lineWidth = 2;
        ctxBtnPlus.beginPath();
        ctxBtnPlus.moveTo(size * 0.4, size * 0.3);
        ctxBtnPlus.lineTo(size * 0.8, size / 2);
        ctxBtnPlus.lineTo(size * 0.4, size * 0.7);
        ctxBtnPlus.stroke();
        slideFrame = Generic.createNewDiv(frame, "", "slideFrame", "", size, 0, slength, size, "", undefined);
        sliderSize = Math.max(areaRange / maxValue * slength, size);
        slider = Generic.createNewDiv(slideFrame, "", "", "slider", 0, 0, sliderSize, size, "background-color:" + sliderCol, undefined);
        slideArea = slength - sliderSize;
    }
    slideFrame.addEventListener('mousedown', mdown);
    
    slideFrame.addEventListener("touchstart",mdown as EventListener, false);
    slideFrame.addEventListener("touchmove", mmove as EventListener, {passive:false});
    slideFrame.addEventListener("touchend",mup as EventListener, false)
    addEvent();
    
    /**長さを変更 */
    this.setLength = (newLength: number) => {
        length = newLength;
        slength = length - size*2;
        sliderSize = Math.max(areaRange / maxValue * slength, size);
        slideArea = slength - sliderSize;
        if (type === 0) {//縦
            frame.style.height = length.px();
            btnPlusCanvas.style.top = (length - size ).px();
            slideFrame.style.height =slength.px();
        } else {
            frame.style.width = length.px();
            btnPlusCanvas.style.left = (length - size ).px();
            slideFrame.style.width = slength.px();
        }
        setSliderPosition();
    }

    /**表示非表示 */
    this.setVisibility = (visiflag: boolean) => {
        if (visiflag === true) {
            addEvent();
            frame.style.display = "inline";
        } else {
            removeEvent()
            frame.style.display = 'none';
        }
    }

    /**スクロールバーの位置設定 */
    this.setXY = (x: number, y: number) => {
        frame.style.left = x.px()
        frame.style.top = y.px()
    }

    /**スクロールバーの位置取得 */
    this.getXY = (x: number, y: number): point => {
        return new point(frame.style.left.removePx(), frame.style.top.removePx());
    }

    /**スライダーの位置を設定 */
    this.setPosition = (newPosition: number) => {
        position = newPosition;
        setSliderPosition();
    }

    /**スライダーの位置を取得 */
    this.getPosition = () => {
        return position;
    }

    /**最大値を設定 */
    this.setMaxValue = (newMax: number) => {
        maxValue = newMax;
        if (position > maxValue) {
            position = maxValue;
        }
        sliderSize = Math.max(areaRange / maxValue * slength, size);
        slideArea = slength - sliderSize;
        setSliderPosition();
    }

    /**最大値を取得 */
    this.getMaxValue = () => {
        return maxValue;
    }

    /**エリアレンジを設定 */
    this.setAreaRange = (newAreaRange: number) => {
        areaRange = newAreaRange;
        sliderSize = Math.max(areaRange / maxValue * slength, size);
        slideArea = slength - sliderSize;
        setSliderPosition();
    }

    /**エリアレンジを取得 */
    this.getAreaRange = () => {
        return areaRange;
    }

    /**document要素のイベントを削除 */
    this.removeEventlister = () => {
        removeEvent();
    }
    /**document要素のイベントを追加 */
    this.addEventlister = () => {
        addEvent();
    }
    function setSliderPosition() {
        if (type === 0) {//縦
            slider.style.top = (position / maxValue * slideArea).px()
            slider.style.height = sliderSize.px();
        } else {
            slider.style.left = (position / maxValue * slideArea).px();
            slider.style.width = sliderSize.px();
        }
    }

    function btnMdown(e: MouseEvent) {
        if (btnMDownF === false) {
            btnMDownF = true;
            btnDownID = (e.target as HTMLElement).id;
            btnDownTimer = setInterval(timerButton, 50)
        }
    }
    function timerButton() {
        const opos = position;
        switch (btnDownID) {
            case "tateMinus":
                position -= smallChange;
                position = Math.max(position, 0);
                slider.style.top = (position / maxValue * slideArea).px()
                break;
            case "tatePlus":
                position += smallChange;
                position = Math.min(position, maxValue);
                slider.style.top = (position / maxValue * slideArea).px()
                break;
            case "yokoMinus":
                position -= smallChange;
                position = Math.max(position, 0);
                slider.style.left = (position / maxValue * slideArea).px()
                break;
            case "yokoPlus":
                position += smallChange;
                position = Math.min(position, maxValue);
                slider.style.left = (position / maxValue * slideArea).px()
                break;
        }
        if (opos !== position) {
            changeEventCall(position);
        }
    }

    function btnMup(e: MouseEvent) {
        if (btnMDownF === true) {
            btnMDownF = false;
            clearInterval(btnDownTimer);
            timerButton();
        }
        
    }

    function wheel(e: WheelEvent) {
        const opos = position;
        if (type === 0) {//縦
            position += smallChange * e.deltaY;
        } else {
            position += smallChange * e.deltaX;
        }
        position = Math.max(position, 0);
        position = Math.min(position, maxValue);
        if (opos !== position) {
            setSliderPosition();
            changeEventCall(position);
        }
    }

    function addEvent() {
            document.addEventListener('mousemove', mmove);
            document.addEventListener('mouseup', mup);
            document.addEventListener('mouseup', btnMup);
            document.addEventListener('wheel', wheel);
    }

    function removeEvent() {
            document.removeEventListener('mousemove', mmove);
            document.removeEventListener('mouseup', mup);
            document.removeEventListener('mouseup', btnMup);
            document.removeEventListener('wheel', wheel);
    }

    let mdownF = false;
    let sliderInPosition: number;//-1,0,1
    let mDownsliderInPosition: number;
    let mdownPos: number | undefined;
    function mdown(event: MouseEvent) {
        let e;
        if (event.type === "mousedown") {
            e = event ;
        } else {
            e = event.changedTouches[0];
        }

        if (type === 0) {//縦
            mdownPos = e.clientY - slideFrame.getBoundingClientRect().y;
        } else {
            mdownPos = e.clientX - slideFrame.getBoundingClientRect().x;
        }
        mdownF = true;
        const sliderInF = false;
        if (type === 0) {//縦
            // mdownPos = p.y;
            const p1 = slider.style.top.removePx();
            const pos = mdownPos ?? 0;
            if ((p1 < pos) && (pos < p1 + slider.clientHeight)) {
                sliderInPosition = 0;
                mDownsliderInPosition = slider.style.top.removePx();
            } else if (p1 < mdownPos) {
                sliderInPosition = 1;
            } else {
                sliderInPosition = -1;
            }
        } else {//横
            // mdownPos = p.x;
            const p1 = slider.style.left.removePx();
            const pos = mdownPos ?? 0;
            if ((p1 < pos) && (pos < p1 + slider.clientWidth)) {
                sliderInPosition = 0;
                mDownsliderInPosition = slider.style.left.removePx();
            } else if (p1 < mdownPos) {
                sliderInPosition = 1;
            } else {
                sliderInPosition = -1;
            }
        }
    }

    function mmove(event: MouseEvent) {
        let e;
        if (event.type === "mousemove") {
            e = event ;
        } else {
            e = event.changedTouches[0];
        }
        if ((mdownF === false) || (sliderInPosition !== 0)) {
            return;
        }
        let mdMovePos;
        if (type === 0) {//縦
            mdMovePos = e.clientY - slideFrame.getBoundingClientRect().y;
        } else {
            mdMovePos = e.clientX - slideFrame.getBoundingClientRect().x;
        }
        const moveAmount = mdownPos - mdMovePos;
        let bpos = mDownsliderInPosition - moveAmount;
        bpos = Math.min(bpos, slideArea);
        bpos = Math.max(bpos, 0);
        if (type === 0) {//縦
            slider.style.top = bpos.px();
        } else {
            slider.style.left = bpos.px()
        }
        position = bpos * maxValue / slideArea;
        changeEventCall(position);
    }

    function mup(event: MouseEvent) {
        let e;
        if (event.type === "mouseup"){
            e = event ;
        } else {
            e = event.changedTouches[0];
        }
        let mdUpPos: number;
        if (type === 0) {//縦
            mdUpPos = e.clientY - slideFrame.getBoundingClientRect().y;
        } else {
            mdUpPos = e.clientX - slideFrame.getBoundingClientRect().x;
        }

        if (Math.abs(mdUpPos - mdownPos) < 5) {
            if (sliderInPosition !== 0) {
                if (type === 0) {//縦
                    if (sliderInPosition === -1) {
                        position -= largeChange;
                        position = Math.max(position, 0);
                    } else {
                        position += largeChange;
                        position = Math.min(position, maxValue);
                    }
                    slider.style.top = (position / maxValue * slideArea).px();
                } else {//横
                    if (sliderInPosition === -1) {
                        position -= largeChange;
                        position = Math.max(position, 0);
                    } else {
                        position += largeChange;
                        position = Math.min(position, maxValue);
                    }
                    slider.style.left = (position / maxValue * slideArea).px()
                }
                changeEventCall(position);
            }
        }
        mdownF = false;
    }
}}
